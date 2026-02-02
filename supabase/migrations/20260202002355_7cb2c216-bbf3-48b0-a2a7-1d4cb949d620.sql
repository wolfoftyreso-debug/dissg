-- =====================================================
-- ANSVARSSYSTEM: Databasschemat för öppet + rollbaserat ansvar
-- =====================================================

-- 1. ENUM för ansvarsområden
CREATE TYPE public.responsibility_area AS ENUM (
  'halsa',
  'arbete',
  'utbildning',
  'trygghet',
  'ekonomi',
  'infrastruktur',
  'integration',
  'miljo'
);

-- 2. ENUM för ansvarsnivå
CREATE TYPE public.responsibility_level AS ENUM (
  'nationell',
  'regional',
  'kommunal'
);

-- 3. Profiler för användare (kopplat till auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  position_title TEXT, -- Fritext: "Statsminister", "Kommunalpolitiker - utbildning"
  responsibility_level responsibility_level,
  responsibility_areas responsibility_area[] DEFAULT '{}',
  party_affiliation TEXT, -- Frivilligt: partitillhörighet
  region_code TEXT, -- För regional/kommunal nivå
  organization TEXT, -- Myndighet, kommun, etc.
  is_public_profile BOOLEAN DEFAULT false, -- Om profilen syns publikt
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies för profiler
CREATE POLICY "Profiles are publicly viewable if is_public_profile is true"
ON public.profiles FOR SELECT
USING (is_public_profile = true OR id = auth.uid());

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (id = auth.uid());

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (id = auth.uid());

-- 4. KPI Ansvarsmatris (vilka KPI:er hör till vilka områden/nivåer)
CREATE TABLE public.kpi_responsibility_matrix (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kpi_id UUID NOT NULL REFERENCES public.kpi_definitions(id) ON DELETE CASCADE,
  primary_area responsibility_area NOT NULL,
  secondary_areas responsibility_area[] DEFAULT '{}',
  primary_level responsibility_level NOT NULL DEFAULT 'nationell',
  secondary_levels responsibility_level[] DEFAULT '{}',
  description TEXT, -- Förklaring av ansvarskopplingen
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(kpi_id)
);

-- Enable RLS
ALTER TABLE public.kpi_responsibility_matrix ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read access for kpi_responsibility_matrix"
ON public.kpi_responsibility_matrix FOR SELECT
USING (true);

-- 5. Styrperioder (vem hade ansvar när)
CREATE TABLE public.governance_periods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  period_name TEXT NOT NULL, -- "Regeringen Löfven I", "Stockholms kommun 2018-2022"
  start_date DATE NOT NULL,
  end_date DATE, -- NULL om pågående
  level responsibility_level NOT NULL,
  areas responsibility_area[] NOT NULL,
  region_code TEXT, -- För regional/kommunal
  party_constellation TEXT[], -- ["S", "MP", "V"] etc.
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.governance_periods ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read access for governance_periods"
ON public.governance_periods FOR SELECT
USING (true);

-- Service insert
CREATE POLICY "Service can insert governance_periods"
ON public.governance_periods FOR INSERT
WITH CHECK (true);

-- 6. Aggregerad utfallsbild (snapshots av KPI-status per period)
CREATE TABLE public.governance_outcomes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  governance_period_id UUID NOT NULL REFERENCES public.governance_periods(id) ON DELETE CASCADE,
  kpi_id UUID NOT NULL REFERENCES public.kpi_definitions(id) ON DELETE CASCADE,
  months_improved INTEGER DEFAULT 0,
  months_stagnant INTEGER DEFAULT 0,
  months_declined INTEGER DEFAULT 0,
  actions_with_effect INTEGER DEFAULT 0,
  actions_without_effect INTEGER DEFAULT 0,
  snapshot_date DATE NOT NULL,
  calculated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(governance_period_id, kpi_id, snapshot_date)
);

-- Enable RLS
ALTER TABLE public.governance_outcomes ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read access for governance_outcomes"
ON public.governance_outcomes FOR SELECT
USING (true);

-- Service insert
CREATE POLICY "Service can insert governance_outcomes"
ON public.governance_outcomes FOR INSERT
WITH CHECK (true);

-- 7. Masterindex definition
CREATE TABLE public.master_index_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT 'Nationellt Funktionsindex',
  description TEXT NOT NULL DEFAULT 'Ett sammanvägt mått av befolkningens livslängd, hälsa, arbetsförmåga, trygghet och långsiktiga bärkraft.',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.master_index_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for master_index_config"
ON public.master_index_config FOR SELECT
USING (true);

-- 8. Masterindex komponenter (vilka KPI:er ingår och med vilken vikt)
CREATE TABLE public.master_index_components (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  master_index_id UUID NOT NULL REFERENCES public.master_index_config(id) ON DELETE CASCADE,
  kpi_id UUID NOT NULL REFERENCES public.kpi_definitions(id) ON DELETE CASCADE,
  weight NUMERIC NOT NULL CHECK (weight >= 0 AND weight <= 1),
  weight_rationale TEXT, -- Varför denna vikt?
  normalization_method TEXT DEFAULT 'z_score', -- Hur normaliseras värdet
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(master_index_id, kpi_id)
);

-- Enable RLS
ALTER TABLE public.master_index_components ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for master_index_components"
ON public.master_index_components FOR SELECT
USING (true);

-- 9. Masterindex värden (beräknade över tid)
CREATE TABLE public.master_index_values (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  master_index_id UUID NOT NULL REFERENCES public.master_index_config(id) ON DELETE CASCADE,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  value NUMERIC NOT NULL, -- Det beräknade indexvärdet
  previous_value NUMERIC,
  trend trend_direction DEFAULT 'stable',
  trend_percent NUMERIC,
  component_values JSONB NOT NULL DEFAULT '{}', -- {"kpi_id": {"value": X, "contribution": Y}}
  confidence INTEGER DEFAULT 80,
  calculated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(master_index_id, period_end)
);

-- Enable RLS
ALTER TABLE public.master_index_values ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for master_index_values"
ON public.master_index_values FOR SELECT
USING (true);

CREATE POLICY "Service can insert master_index_values"
ON public.master_index_values FOR INSERT
WITH CHECK (true);

-- 10. Trigger för att skapa profil vid registrering
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 11. Updated_at trigger för profiler
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 12. Sätt in initial KPI-ansvarsmatris
INSERT INTO public.kpi_responsibility_matrix (kpi_id, primary_area, secondary_areas, primary_level, secondary_levels, description)
SELECT 
  id,
  CASE 
    WHEN code IN ('life_expectancy', 'excess_mortality', 'working_age_functional') THEN 'halsa'::responsibility_area
    WHEN code IN ('employment_rate_net', 'productivity_per_hour', 'long_term_exclusion') THEN 'arbete'::responsibility_area
    WHEN code IN ('tax_base_growth', 'public_cost_per_capita', 'dependency_ratio') THEN 'ekonomi'::responsibility_area
    WHEN code IN ('violent_crime_rate', 'young_men_outside_system', 'substance_harm') THEN 'trygghet'::responsibility_area
    WHEN code IN ('healthcare_queue_functional', 'school_outcomes_grade9', 'justice_throughput') THEN 'halsa'::responsibility_area
    WHEN code IN ('housing_turnover', 'energy_stability', 'transport_reliability') THEN 'infrastruktur'::responsibility_area
    ELSE 'ekonomi'::responsibility_area
  END,
  CASE 
    WHEN code = 'life_expectancy' THEN ARRAY['arbete', 'trygghet']::responsibility_area[]
    WHEN code = 'excess_mortality' THEN ARRAY['arbete']::responsibility_area[]
    WHEN code = 'working_age_functional' THEN ARRAY['arbete', 'utbildning']::responsibility_area[]
    WHEN code = 'employment_rate_net' THEN ARRAY['utbildning', 'integration']::responsibility_area[]
    WHEN code = 'long_term_exclusion' THEN ARRAY['halsa', 'utbildning', 'integration']::responsibility_area[]
    WHEN code = 'violent_crime_rate' THEN ARRAY['integration']::responsibility_area[]
    WHEN code = 'young_men_outside_system' THEN ARRAY['arbete', 'utbildning', 'integration']::responsibility_area[]
    WHEN code = 'school_outcomes_grade9' THEN ARRAY['utbildning']::responsibility_area[]
    ELSE ARRAY[]::responsibility_area[]
  END,
  'nationell',
  CASE 
    WHEN code IN ('school_outcomes_grade9', 'housing_turnover') THEN ARRAY['regional', 'kommunal']::responsibility_level[]
    WHEN code IN ('healthcare_queue_functional', 'violent_crime_rate') THEN ARRAY['regional']::responsibility_level[]
    ELSE ARRAY[]::responsibility_level[]
  END,
  CASE 
    WHEN code = 'life_expectancy' THEN 'Statsministerns yttersta ansvar – samlad effekt av hela samhällssystemet'
    WHEN code = 'excess_mortality' THEN 'Folkhälsoministerns primära ansvar med stöd från arbetsmarknadsminister'
    WHEN code = 'working_age_functional' THEN 'Delat ansvar mellan socialminister och arbetsmarknadsminister'
    ELSE 'Standard ansvarsfördelning enligt politikområde'
  END
FROM public.kpi_definitions
WHERE is_active = true;

-- 13. Sätt in initial masterindex-konfiguration
INSERT INTO public.master_index_config (name, description)
VALUES (
  'Nationellt Funktionsindex',
  'Ett sammanvägt mått av befolkningens livslängd, hälsa, arbetsförmåga, trygghet och långsiktiga bärkraft. Detta är statsministerns yttersta ansvarsmått.'
);

-- 14. Sätt in masterindex-komponenter
INSERT INTO public.master_index_components (master_index_id, kpi_id, weight, weight_rationale, normalization_method)
SELECT 
  (SELECT id FROM public.master_index_config WHERE is_active = true LIMIT 1),
  kd.id,
  CASE 
    WHEN kd.code = 'life_expectancy' THEN 0.20
    WHEN kd.code = 'excess_mortality' THEN 0.15
    WHEN kd.code = 'working_age_functional' THEN 0.18
    WHEN kd.code = 'long_term_exclusion' THEN 0.12
    WHEN kd.code = 'productivity_per_hour' THEN 0.15
    WHEN kd.code = 'violent_crime_rate' THEN 0.10
    WHEN kd.code = 'dependency_ratio' THEN 0.10
    ELSE 0
  END,
  CASE 
    WHEN kd.code = 'life_expectancy' THEN 'Samlad effekt av hela samhället – högsta vikt'
    WHEN kd.code = 'excess_mortality' THEN 'Direkt signal på systemstress'
    WHEN kd.code = 'working_age_functional' THEN 'Avgör systemets bärkraft'
    WHEN kd.code = 'long_term_exclusion' THEN 'Framtidsrisk-indikator'
    WHEN kd.code = 'productivity_per_hour' THEN 'Långsiktig välståndskälla'
    WHEN kd.code = 'violent_crime_rate' THEN 'Social stabilitet'
    WHEN kd.code = 'dependency_ratio' THEN 'Långsiktig hållbarhet'
    ELSE NULL
  END,
  'z_score'
FROM public.kpi_definitions kd
WHERE kd.code IN ('life_expectancy', 'excess_mortality', 'working_age_functional', 'long_term_exclusion', 'productivity_per_hour', 'violent_crime_rate', 'dependency_ratio')
AND kd.is_active = true;