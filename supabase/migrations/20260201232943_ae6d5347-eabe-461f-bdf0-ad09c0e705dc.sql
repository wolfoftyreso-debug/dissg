-- =====================================================
-- DEL VII: ROLLER & BEHÖRIGHET
-- Säker rollbaserad access för NOGF
-- =====================================================

-- 1. Skapa enum för systemroller
CREATE TYPE public.app_role AS ENUM (
  'public',           -- Publik användare (ingen inloggning krävs)
  'researcher',       -- Fördjupad användare (journalist, forskare, analytiker)
  'department_lead',  -- Departementsansvarig (loggar beslut, följer indikatorer)
  'minister',         -- Statsråd (ser sitt område)
  'prime_minister',   -- Statsminister (ser allt, syntes)
  'system_admin'      -- Systemadministration (metadata, datakällor)
);

-- 2. Skapa user_roles-tabell
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  assigned_by UUID REFERENCES auth.users(id),
  notes TEXT,
  UNIQUE (user_id, role)
);

-- 3. Skapa tabell för ansvarsområden (vilka KPI:er en roll ansvarar för)
CREATE TABLE public.role_responsibilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  kpi_id UUID REFERENCES public.kpi_definitions(id) ON DELETE CASCADE NOT NULL,
  responsibility_level TEXT NOT NULL CHECK (responsibility_level IN ('primary', 'secondary', 'observer')),
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, kpi_id)
);

-- 4. Skapa tabell för interna anteckningar (endast för ansvariga)
CREATE TABLE public.internal_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kpi_id UUID REFERENCES public.kpi_definitions(id) ON DELETE CASCADE,
  observation_id UUID REFERENCES public.observations(id) ON DELETE CASCADE,
  action_id UUID REFERENCES public.action_options(id) ON DELETE CASCADE,
  author_id UUID REFERENCES auth.users(id) NOT NULL,
  content TEXT NOT NULL,
  is_private BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (
    (kpi_id IS NOT NULL)::int + 
    (observation_id IS NOT NULL)::int + 
    (action_id IS NOT NULL)::int = 1
  )
);

-- 5. Aktivera RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_responsibilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internal_notes ENABLE ROW LEVEL SECURITY;

-- 6. Skapa SECURITY DEFINER-funktion för rollkontroll
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
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
      AND role = _role
  )
$$;

-- 7. Funktion för att kontrollera om användare har någon av angivna roller
CREATE OR REPLACE FUNCTION public.has_any_role(_user_id UUID, _roles app_role[])
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
      AND role = ANY(_roles)
  )
$$;

-- 8. Funktion för att kontrollera KPI-ansvar
CREATE OR REPLACE FUNCTION public.has_kpi_responsibility(_user_id UUID, _kpi_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.role_responsibilities
    WHERE user_id = _user_id
      AND kpi_id = _kpi_id
  )
$$;

-- 9. RLS-policies för user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'system_admin'));

CREATE POLICY "Admins can manage roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'system_admin'))
WITH CHECK (public.has_role(auth.uid(), 'system_admin'));

-- 10. RLS-policies för role_responsibilities
CREATE POLICY "Users can view their own responsibilities"
ON public.role_responsibilities
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can manage responsibilities"
ON public.role_responsibilities
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'system_admin'))
WITH CHECK (public.has_role(auth.uid(), 'system_admin'));

-- 11. RLS-policies för internal_notes
CREATE POLICY "Authors can manage their own notes"
ON public.internal_notes
FOR ALL
TO authenticated
USING (author_id = auth.uid())
WITH CHECK (author_id = auth.uid());

CREATE POLICY "Responsible users can view notes for their KPIs"
ON public.internal_notes
FOR SELECT
TO authenticated
USING (
  kpi_id IS NOT NULL AND public.has_kpi_responsibility(auth.uid(), kpi_id)
);

CREATE POLICY "Admins and ministers can view all notes"
ON public.internal_notes
FOR SELECT
TO authenticated
USING (
  public.has_any_role(auth.uid(), ARRAY['system_admin', 'prime_minister']::app_role[])
);

-- 12. Trigger för updated_at på internal_notes
CREATE TRIGGER update_internal_notes_updated_at
BEFORE UPDATE ON public.internal_notes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 13. Audit-logg för rollförändringar
CREATE TABLE public.role_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role app_role NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('granted', 'revoked')),
  performed_by UUID REFERENCES auth.users(id),
  performed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reason TEXT
);

ALTER TABLE public.role_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view role audit log"
ON public.role_audit_log
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'system_admin'));

-- 14. Funktion för att logga rollförändringar automatiskt
CREATE OR REPLACE FUNCTION public.log_role_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.role_audit_log (user_id, role, action, performed_by)
    VALUES (NEW.user_id, NEW.role, 'granted', auth.uid());
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.role_audit_log (user_id, role, action, performed_by)
    VALUES (OLD.user_id, OLD.role, 'revoked', auth.uid());
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER log_role_changes
AFTER INSERT OR DELETE ON public.user_roles
FOR EACH ROW
EXECUTE FUNCTION public.log_role_change();