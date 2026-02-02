-- ═══════════════════════════════════════════════════════════════════════════
-- LÄGG TILL SAKNADE FOREIGN KEY-RELATIONER (med DROP IF EXISTS först)
-- ═══════════════════════════════════════════════════════════════════════════

-- 1. ANVÄNDARE → PROFILES
-- ═══════════════════════════════════════════════════════════════════════════

-- evaluation_weights.user_id → profiles
ALTER TABLE public.evaluation_weights
  DROP CONSTRAINT IF EXISTS evaluation_weights_user_id_fkey;
ALTER TABLE public.evaluation_weights
  ADD CONSTRAINT evaluation_weights_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE SET NULL;

-- role_responsibilities.user_id → profiles
ALTER TABLE public.role_responsibilities
  DROP CONSTRAINT IF EXISTS role_responsibilities_user_id_fkey;
ALTER TABLE public.role_responsibilities
  ADD CONSTRAINT role_responsibilities_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- user_roles.user_id → profiles
ALTER TABLE public.user_roles
  DROP CONSTRAINT IF EXISTS user_roles_user_id_fkey;
ALTER TABLE public.user_roles
  ADD CONSTRAINT user_roles_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- user_roles.assigned_by → profiles
ALTER TABLE public.user_roles
  DROP CONSTRAINT IF EXISTS user_roles_assigned_by_fkey;
ALTER TABLE public.user_roles
  ADD CONSTRAINT user_roles_assigned_by_fkey
  FOREIGN KEY (assigned_by) REFERENCES public.profiles(id) ON DELETE SET NULL;

-- user_relevance_preferences.user_id → profiles
ALTER TABLE public.user_relevance_preferences
  DROP CONSTRAINT IF EXISTS user_relevance_preferences_user_id_fkey;
ALTER TABLE public.user_relevance_preferences
  ADD CONSTRAINT user_relevance_preferences_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- 2. FÖRSTÄRK BEFINTLIGA CONSTRAINTS MED CASCADE/SET NULL
-- ═══════════════════════════════════════════════════════════════════════════

-- kpi_values → data_sources
ALTER TABLE public.kpi_values
  DROP CONSTRAINT IF EXISTS kpi_values_data_source_id_fkey;
ALTER TABLE public.kpi_values
  ADD CONSTRAINT kpi_values_data_source_id_fkey
  FOREIGN KEY (data_source_id) REFERENCES public.data_sources(id) ON DELETE SET NULL;

-- data_lineage kopplingar
ALTER TABLE public.data_lineage
  DROP CONSTRAINT IF EXISTS data_lineage_kpi_value_id_fkey;
ALTER TABLE public.data_lineage
  ADD CONSTRAINT data_lineage_kpi_value_id_fkey
  FOREIGN KEY (kpi_value_id) REFERENCES public.kpi_values(id) ON DELETE SET NULL;

ALTER TABLE public.data_lineage
  DROP CONSTRAINT IF EXISTS data_lineage_observation_id_fkey;
ALTER TABLE public.data_lineage
  ADD CONSTRAINT data_lineage_observation_id_fkey
  FOREIGN KEY (observation_id) REFERENCES public.observations(id) ON DELETE SET NULL;

ALTER TABLE public.data_lineage
  DROP CONSTRAINT IF EXISTS data_lineage_analysis_chain_id_fkey;
ALTER TABLE public.data_lineage
  ADD CONSTRAINT data_lineage_analysis_chain_id_fkey
  FOREIGN KEY (analysis_chain_id) REFERENCES public.analysis_chains(id) ON DELETE SET NULL;