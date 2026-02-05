-- =============================================================================
-- SÄKERHETSMIGRATION: FAS 1 (del 2 - final)
-- =============================================================================

-- API Keys: Lägg till admin-access policy baserad på responsibility_level
DROP POLICY IF EXISTS "Admins can view all api_keys" ON public.api_keys;
CREATE POLICY "Admins can view all api_keys" ON public.api_keys
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() 
      AND p.responsibility_level = 'nationell'
    )
  );

-- Trust log: Kräv faktisk autentisering
DROP POLICY IF EXISTS "Only authenticated can insert trust log" ON public.trust_log;
DROP POLICY IF EXISTS "Authenticated users can insert trust log" ON public.trust_log;
CREATE POLICY "Authenticated users can insert trust log" ON public.trust_log
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Data versions: Kräv faktisk autentisering  
DROP POLICY IF EXISTS "Only authenticated can insert versions" ON public.data_versions;
DROP POLICY IF EXISTS "Authenticated users can insert versions" ON public.data_versions;
CREATE POLICY "Authenticated users can insert versions" ON public.data_versions
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);