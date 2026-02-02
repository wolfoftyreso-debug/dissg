-- Drop existing overly permissive policies on action_options
DROP POLICY IF EXISTS "Authenticated users can create actions" ON public.action_options;
DROP POLICY IF EXISTS "Authenticated users can update actions" ON public.action_options;

-- Create stricter policies using the existing has_any_role function
-- Only users with elevated roles can create action proposals
CREATE POLICY "Authorized users can create actions" 
ON public.action_options 
FOR INSERT 
TO authenticated
WITH CHECK (
  public.has_any_role(
    auth.uid(), 
    ARRAY['researcher', 'department_lead', 'minister', 'prime_minister', 'system_admin']::app_role[]
  )
);

-- Only users with elevated roles can update action proposals
CREATE POLICY "Authorized users can update actions" 
ON public.action_options 
FOR UPDATE 
TO authenticated
USING (
  public.has_any_role(
    auth.uid(), 
    ARRAY['researcher', 'department_lead', 'minister', 'prime_minister', 'system_admin']::app_role[]
  )
)
WITH CHECK (
  public.has_any_role(
    auth.uid(), 
    ARRAY['researcher', 'department_lead', 'minister', 'prime_minister', 'system_admin']::app_role[]
  )
);

-- Only system_admin can delete action proposals
CREATE POLICY "System admins can delete actions" 
ON public.action_options 
FOR DELETE 
TO authenticated
USING (
  public.has_role(auth.uid(), 'system_admin')
);