-- Create function to get user's government role (Swedish system)
CREATE OR REPLACE FUNCTION public.get_gov_role(_user_id UUID)
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role::TEXT
  FROM public.user_roles
  WHERE user_id = _user_id
  ORDER BY 
    CASE role::TEXT
      WHEN 'statsminister' THEN 1 
      WHEN 'prime_minister' THEN 1
      WHEN 'system_admin' THEN 2
      WHEN 'departementsansvarig' THEN 3 
      WHEN 'minister' THEN 3
      WHEN 'department_lead' THEN 4
      WHEN 'operativ' THEN 5 
      WHEN 'researcher' THEN 6
      WHEN 'public' THEN 7
    END
  LIMIT 1
$$;

-- Check if user has specific gov role (text-based for flexibility)
CREATE OR REPLACE FUNCTION public.has_gov_role(_user_id UUID, _role TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role::TEXT = _role
  )
$$;

-- Update RLS policies for leadership access
DROP POLICY IF EXISTS "Top leadership can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Top leadership can manage roles" ON public.user_roles;

CREATE POLICY "Leadership can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id 
  OR public.has_role(auth.uid(), 'prime_minister')
  OR public.has_role(auth.uid(), 'system_admin')
  OR public.has_gov_role(auth.uid(), 'statsminister')
);

CREATE POLICY "Leadership can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  public.has_role(auth.uid(), 'prime_minister')
  OR public.has_role(auth.uid(), 'system_admin')
  OR public.has_gov_role(auth.uid(), 'statsminister')
);

CREATE POLICY "Leadership can update roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (
  public.has_role(auth.uid(), 'prime_minister')
  OR public.has_role(auth.uid(), 'system_admin')
  OR public.has_gov_role(auth.uid(), 'statsminister')
);

CREATE POLICY "Leadership can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (
  public.has_role(auth.uid(), 'prime_minister')
  OR public.has_role(auth.uid(), 'system_admin')
  OR public.has_gov_role(auth.uid(), 'statsminister')
);