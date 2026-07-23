-- =============================================================
-- FIX: Allow authenticated users to read ALL appointments
-- The existing "Users view own appointments" policy only shows
-- rows where auth.uid() = user_id, but WhatsApp-triggered
-- appointments are created with the admin's user_id.
-- The anon_read_appointments policy only helps the 'anon' role,
-- NOT the 'authenticated' role used when a user is logged in.
-- =============================================================

-- 1. Allow all authenticated users to SELECT all appointments
DROP POLICY IF EXISTS "authenticated_read_all_appointments" ON public.appointments;

CREATE POLICY "authenticated_read_all_appointments"
  ON public.appointments
  FOR SELECT
  TO authenticated
  USING (true);
