-- =============================================================
-- Migration: Allow anon read access to appointments table
-- This fixes the dashboard not showing appointments created by
-- the chat-ai Edge Function (which uses service_role key).
-- =============================================================

-- 1. Ensure RLS is enabled (should already be)
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing SELECT policies for anon if any
DROP POLICY IF EXISTS "Allow anon read appointments" ON public.appointments;
DROP POLICY IF EXISTS "appointments_select_anon" ON public.appointments;
DROP POLICY IF EXISTS "anon_read_appointments" ON public.appointments;

-- 3. Create policy: anon can SELECT all appointments
CREATE POLICY "anon_read_appointments"
  ON public.appointments
  FOR SELECT
  TO anon
  USING (true);

-- 4. Verify: this query should now work with the anon key
-- SELECT id, client_name, appointment_date, appointment_time, status
-- FROM public.appointments
-- ORDER BY appointment_date DESC
-- LIMIT 10;
