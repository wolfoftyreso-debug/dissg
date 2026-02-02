-- Ta bort gamla öppna policies
DROP POLICY IF EXISTS "Anyone can propose actions" ON public.action_options;
DROP POLICY IF EXISTS "Anyone can update actions" ON public.action_options;

-- Skapa nya policies som kräver autentisering
CREATE POLICY "Authenticated users can create actions"
ON public.action_options
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update actions"
ON public.action_options
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Behåll public read access för transparency
-- (ingen ändring behövs för SELECT-policy)