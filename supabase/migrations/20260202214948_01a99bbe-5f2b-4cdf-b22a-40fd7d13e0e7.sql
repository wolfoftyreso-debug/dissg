-- COVID-19 Reality Layer - Raw Data & Method Tracking

-- Raw COVID data points (cases, deaths, hospitalizations, etc.)
CREATE TABLE public.covid_raw_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  country_code TEXT NOT NULL,
  region_code TEXT,
  data_type TEXT NOT NULL,
  period_date DATE NOT NULL,
  value NUMERIC NOT NULL,
  value_per_100k NUMERIC,
  age_group TEXT,
  definition_version TEXT NOT NULL,
  reporter TEXT NOT NULL,
  reporting_lag_days INTEGER,
  is_preliminary BOOLEAN DEFAULT false,
  revision_number INTEGER DEFAULT 1,
  confidence_interval_lower NUMERIC,
  confidence_interval_upper NUMERIC,
  data_source_code TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(country_code, region_code, data_type, period_date, age_group, definition_version)
);

-- Method changes over time (CRITICAL for valid comparisons)
CREATE TABLE public.covid_method_changes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  country_code TEXT NOT NULL,
  data_type TEXT NOT NULL,
  change_date DATE NOT NULL,
  previous_definition TEXT NOT NULL,
  new_definition TEXT NOT NULL,
  change_type TEXT NOT NULL,
  impact_severity TEXT NOT NULL,
  comparability_note TEXT NOT NULL,
  source_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Excess mortality data (all-cause, the anchor)
CREATE TABLE public.covid_excess_mortality (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  country_code TEXT NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  observed_deaths INTEGER NOT NULL,
  expected_deaths NUMERIC NOT NULL,
  expected_deaths_lower NUMERIC,
  expected_deaths_upper NUMERIC,
  excess_deaths NUMERIC GENERATED ALWAYS AS (observed_deaths - expected_deaths) STORED,
  excess_percent NUMERIC,
  age_standardized BOOLEAN DEFAULT false,
  season_adjusted BOOLEAN DEFAULT false,
  baseline_period TEXT,
  methodology TEXT NOT NULL,
  data_source_code TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Policy periods (neutral markers, no value judgments)
CREATE TABLE public.covid_policy_periods (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  country_code TEXT NOT NULL,
  region_code TEXT,
  policy_type TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  stringency_level INTEGER,
  description TEXT,
  source_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Comparison validity matrix
CREATE TABLE public.covid_comparison_validity (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  country_a TEXT NOT NULL,
  country_b TEXT NOT NULL,
  data_type TEXT NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  is_valid BOOLEAN NOT NULL,
  validity_score NUMERIC,
  invalidity_reasons TEXT[],
  methodology_match BOOLEAN,
  definition_match BOOLEAN,
  reporting_match BOOLEAN,
  assessed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Sensitivity analysis results (Fjädran)
CREATE TABLE public.covid_sensitivity_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  analysis_code TEXT NOT NULL UNIQUE,
  base_query_params JSONB NOT NULL,
  variations_tested JSONB NOT NULL,
  results JSONB NOT NULL,
  stability_score NUMERIC NOT NULL,
  stability_classification TEXT NOT NULL,
  key_sensitivities TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Conclusion classification (what can be said)
CREATE TABLE public.covid_conclusion_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conclusion_type TEXT NOT NULL UNIQUE,
  is_allowed BOOLEAN NOT NULL DEFAULT true,
  template_text TEXT NOT NULL,
  requires_conditions TEXT[],
  forbidden_phrases TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert allowed conclusion types with explicit array casting
INSERT INTO public.covid_conclusion_types (conclusion_type, is_allowed, template_text, requires_conditions, forbidden_phrases) VALUES
('observed_association', true, 'An association was observed between {X} and {Y} during {period}.', ARRAY['same_geography', 'overlapping_period', 'comparable_definitions']::TEXT[], ARRAY['proves', 'caused', 'resulted in', 'because of']::TEXT[]),
('temporal_comovement', true, '{X} and {Y} moved together during {period}. This temporal pattern does not establish causation.', ARRAY['same_time_resolution', 'comparable_lag']::TEXT[], ARRAY['therefore', 'thus proving', 'demonstrating that']::TEXT[]),
('outcome_difference', true, 'Outcomes differed between {A} and {B} under {conditions}. Multiple confounding factors may explain this difference.', ARRAY['comparable_demographics', 'comparable_definitions', 'comparable_reporting']::TEXT[], ARRAY['better', 'worse', 'successful', 'failed', 'worked']::TEXT[]),
('causal_claim', false, 'BLOCKED: Causal claims require controlled studies and cannot be derived from observational data alone.', ARRAY[]::TEXT[], ARRAY['caused', 'led to', 'resulted in', 'because', 'therefore']::TEXT[]),
('policy_judgment', false, 'BLOCKED: Policy evaluations require value judgments that are outside the scope of this reference system.', ARRAY[]::TEXT[], ARRAY['should have', 'correct', 'wrong', 'mistake', 'success']::TEXT[]);

-- Create indexes for performance
CREATE INDEX idx_covid_raw_data_lookup ON public.covid_raw_data(country_code, data_type, period_date);
CREATE INDEX idx_covid_method_changes_lookup ON public.covid_method_changes(country_code, data_type, change_date);
CREATE INDEX idx_covid_excess_mortality_lookup ON public.covid_excess_mortality(country_code, period_start);
CREATE INDEX idx_covid_policy_periods_lookup ON public.covid_policy_periods(country_code, start_date);

-- Enable RLS
ALTER TABLE public.covid_raw_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.covid_method_changes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.covid_excess_mortality ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.covid_policy_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.covid_comparison_validity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.covid_sensitivity_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.covid_conclusion_types ENABLE ROW LEVEL SECURITY;

-- Public read access (reference data)
CREATE POLICY "COVID raw data public read" ON public.covid_raw_data FOR SELECT USING (true);
CREATE POLICY "COVID method changes public read" ON public.covid_method_changes FOR SELECT USING (true);
CREATE POLICY "COVID excess mortality public read" ON public.covid_excess_mortality FOR SELECT USING (true);
CREATE POLICY "COVID policy periods public read" ON public.covid_policy_periods FOR SELECT USING (true);
CREATE POLICY "COVID comparison validity public read" ON public.covid_comparison_validity FOR SELECT USING (true);
CREATE POLICY "COVID sensitivity results public read" ON public.covid_sensitivity_results FOR SELECT USING (true);
CREATE POLICY "COVID conclusion types public read" ON public.covid_conclusion_types FOR SELECT USING (true);