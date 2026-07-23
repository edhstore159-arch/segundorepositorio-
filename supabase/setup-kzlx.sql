-- =============================================================
-- SETUP COMPLETO: kzlxysxvvlupjtrmxqmb
-- Rodar no SQL Editor do projeto kzlxysxvvlupjtrmxqmb
-- =============================================================

-- 1. Tipo app_role (se não existir)
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'user');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 2. Funções auxiliares
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger LANGUAGE plpgsql SET search_path TO 'public' AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- 3. Tabela user_roles
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 4. Tabela appointments
CREATE TABLE IF NOT EXISTS public.appointments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid,
  session_id text,
  client_name text NOT NULL,
  phone text,
  email text,
  city text,
  legal_area text,
  case_summary text,
  appointment_date date NOT NULL,
  appointment_time time without time zone NOT NULL,
  source text NOT NULL DEFAULT 'chat_ai',
  status text NOT NULL DEFAULT 'scheduled',
  raw_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_appointments_date_time
ON public.appointments (appointment_date, appointment_time);
CREATE INDEX IF NOT EXISTS idx_appointments_session
ON public.appointments (session_id);

DROP TRIGGER IF EXISTS update_appointments_updated_at ON public.appointments;
CREATE TRIGGER update_appointments_updated_at
BEFORE UPDATE ON public.appointments
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_appointments" ON public.appointments;
CREATE POLICY "anon_read_appointments"
  ON public.appointments FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "anon_insert_appointments" ON public.appointments;
CREATE POLICY "anon_insert_appointments"
  ON public.appointments FOR INSERT TO anon WITH CHECK (true);

GRANT SELECT ON public.appointments TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.appointments TO authenticated;
GRANT ALL ON public.appointments TO service_role;

-- 5. Tabela whatsapp_messages
CREATE TABLE IF NOT EXISTS public.whatsapp_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  contact_id TEXT NOT NULL,
  contact_name TEXT,
  contact_phone TEXT,
  text TEXT NOT NULL,
  from_me BOOLEAN NOT NULL DEFAULT false,
  provider_message_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_user_contact_created
ON public.whatsapp_messages(user_id, contact_id, created_at DESC);

DROP TRIGGER IF EXISTS update_whatsapp_messages_updated_at ON public.whatsapp_messages;
CREATE TRIGGER update_whatsapp_messages_updated_at
BEFORE UPDATE ON public.whatsapp_messages
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.whatsapp_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_whatsapp" ON public.whatsapp_messages;
CREATE POLICY "anon_insert_whatsapp"
  ON public.whatsapp_messages FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "anon_select_whatsapp" ON public.whatsapp_messages;
CREATE POLICY "anon_select_whatsapp"
  ON public.whatsapp_messages FOR SELECT TO anon USING (true);

GRANT SELECT, INSERT ON public.whatsapp_messages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.whatsapp_messages TO authenticated;
GRANT ALL ON public.whatsapp_messages TO service_role;

-- 6. Trigger de agendamento automático
CREATE OR REPLACE FUNCTION public.create_appointment_from_whatsapp()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  t text; context_text text; source_text text;
  hh int; mm int;
  appt_date date; appt_time time;
  ref_today date := (NEW.created_at AT TIME ZONE 'America/Sao_Paulo')::date;
  m text[]; assignee uuid;
  new_contact_digits text; new_phone_digits text;
BEGIN
  IF coalesce(NEW.from_me, false) THEN RETURN NEW; END IF;
  t := lower(coalesce(NEW.text, ''));
  IF t = '' THEN RETURN NEW; END IF;

  new_contact_digits := regexp_replace(coalesce(NEW.contact_id, ''), '\D', '', 'g');
  new_phone_digits := regexp_replace(coalesce(NEW.contact_phone, ''), '\D', '', 'g');

  SELECT lower(string_agg(coalesce(x.text, ''), ' ' ORDER BY x.created_at ASC))
    INTO context_text
  FROM (
    SELECT wm.text, wm.created_at FROM public.whatsapp_messages wm
    WHERE (wm.contact_id = NEW.contact_id
      OR regexp_replace(coalesce(wm.contact_id, ''), '\D', '', 'g') = new_contact_digits)
      AND wm.created_at >= NEW.created_at - interval '6 hours'
      AND wm.created_at <= NEW.created_at + interval '1 minute'
    ORDER BY wm.created_at DESC LIMIT 32
  ) x;

  context_text := trim(coalesce(context_text, '') || ' ' || t);

  IF context_text !~ '(agend|reagend|remarc|marc|consulta|reuni[aã]o|atendimento|hor[aá]rio|confirm|adiar|alterar|mudar|trocar)' THEN
    RETURN NEW;
  END IF;

  assignee := NEW.user_id;
  IF assignee IS NULL THEN
    SELECT user_id INTO assignee FROM public.user_roles WHERE role = 'admin' ORDER BY user_id LIMIT 1;
  END IF;
  source_text := left(coalesce(NEW.text, context_text), 240);

  m := regexp_match(context_text, '(?:[aà]s|as|hor[aá]rio(?:\s*(?:de|para))?)\s*(\d{1,2})(?:[:h](\d{1,2}))?\s*(?:h|hs|horas)?');
  IF m IS NULL THEN
    m := regexp_match(context_text, '(^|\s)(\d{1,2})(?:[:h](\d{1,2}))\s*(?:h|hs|horas)?');
  END IF;
  IF m IS NOT NULL THEN
    hh := m[1]::int; mm := coalesce(m[2], '0')::int;
  END IF;
  IF hh IS NULL THEN RETURN NEW; END IF;
  IF hh < 0 OR hh > 23 OR mm < 0 OR mm > 59 THEN RETURN NEW; END IF;

  IF position('amanha' in context_text) > 0 OR position('amanhã' in context_text) > 0 THEN
    appt_date := ref_today + 1;
  ELSIF position('hoje' in context_text) > 0 THEN
    appt_date := ref_today;
  ELSE
    appt_date := ref_today + 1;
  END IF;

  appt_time := make_time(hh, mm, 0);

  IF EXISTS (
    SELECT 1 FROM public.appointments a
    WHERE a.appointment_date = appt_date AND a.appointment_time = appt_time
      AND (coalesce(a.session_id, '') = coalesce(NEW.contact_id, '')
        OR regexp_replace(coalesce(a.session_id, ''), '\D', '', 'g') = new_contact_digits)
  ) THEN RETURN NEW; END IF;

  INSERT INTO public.appointments (
    user_id, session_id, client_name, phone, legal_area, case_summary,
    appointment_date, appointment_time, source, status, raw_payload
  ) VALUES (
    assignee, NEW.contact_id,
    coalesce(nullif(NEW.contact_name, ''), 'Cliente do WhatsApp'),
    NEW.contact_phone, 'Atendimento jurídico', source_text,
    appt_date, appt_time, 'whatsapp_trigger', 'scheduled',
    jsonb_build_object('source', 'whatsapp_trigger', 'message_id', NEW.id)
  );

  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS trg_appointment_from_whatsapp ON public.whatsapp_messages;
CREATE TRIGGER trg_appointment_from_whatsapp
  AFTER INSERT ON public.whatsapp_messages
  FOR EACH ROW EXECUTE FUNCTION public.create_appointment_from_whatsapp();
