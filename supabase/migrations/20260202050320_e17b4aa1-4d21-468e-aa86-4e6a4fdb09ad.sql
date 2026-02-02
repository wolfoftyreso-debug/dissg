-- Add Swedish government roles to existing enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'statsminister';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'departementsansvarig';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'operativ';

-- Add department and region columns to user_roles if not exists
ALTER TABLE public.user_roles ADD COLUMN IF NOT EXISTS department TEXT;
ALTER TABLE public.user_roles ADD COLUMN IF NOT EXISTS region TEXT;