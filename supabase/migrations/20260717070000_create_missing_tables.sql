-- Função auxiliar para updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Tabela: creative_assets
CREATE TABLE IF NOT EXISTS public.creative_assets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  storage_path TEXT NOT NULL,
  mime_type TEXT,
  size_bytes BIGINT,
  width INTEGER,
  height INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.creative_assets TO authenticated;
GRANT ALL ON public.creative_assets TO service_role;
ALTER TABLE public.creative_assets ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Users manage their own creative assets"
    ON public.creative_assets FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TRIGGER update_creative_assets_updated_at
    BEFORE UPDATE ON public.creative_assets
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE INDEX IF NOT EXISTS creative_assets_user_id_created_at_idx
  ON public.creative_assets (user_id, created_at DESC);

-- Tabela: generated_images
CREATE TABLE IF NOT EXISTS public.generated_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  prompt TEXT,
  kind TEXT NOT NULL DEFAULT 'fusion',
  paid BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.generated_images TO authenticated;
GRANT ALL ON public.generated_images TO service_role;
ALTER TABLE public.generated_images ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Users manage own generated images"
    ON public.generated_images FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Storage bucket: creative-assets
INSERT INTO storage.buckets (id, name, public)
VALUES ('creative-assets', 'creative-assets', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies para creative-assets
DO $$ BEGIN
  CREATE POLICY "Users read own creative assets"
    ON storage.objects FOR SELECT TO authenticated
    USING (bucket_id = 'creative-assets' AND (storage.foldername(name))[1] = auth.uid()::text);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users upload own creative assets"
    ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'creative-assets' AND (storage.foldername(name))[1] = auth.uid()::text);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users update own creative assets"
    ON storage.objects FOR UPDATE TO authenticated
    USING (bucket_id = 'creative-assets' AND (storage.foldername(name))[1] = auth.uid()::text)
    WITH CHECK (bucket_id = 'creative-assets' AND (storage.foldername(name))[1] = auth.uid()::text);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users delete own creative assets"
    ON storage.objects FOR DELETE TO authenticated
    USING (bucket_id = 'creative-assets' AND (storage.foldername(name))[1] = auth.uid()::text);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
