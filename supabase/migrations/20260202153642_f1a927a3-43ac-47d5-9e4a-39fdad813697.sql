-- ============================================================================
-- BLOCK 56: GLOBAL BIG QUESTIONS — AUTO-RANKED, DATA-ONLY
-- No opinions. No editors. No meetings.
-- ============================================================================

-- Question category enum
CREATE TYPE public.question_category AS ENUM (
  'demography_work',
  'economic_capacity',
  'health_longevity',
  'energy_resources',
  'food_supply',
  'institutional_resilience'
);

-- ============================================================================
-- BIG QUESTIONS DEFINITIONS (Fixed structure)
-- ============================================================================

CREATE TABLE public.big_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Identity
  code TEXT UNIQUE NOT NULL, -- e.g., "BQ-DEM-001"
  category question_category NOT NULL,
  
  -- Question (neutral, never normative)
  question_text TEXT NOT NULL,
  question_text_local JSONB DEFAULT '{}', -- {"sv": "...", "de": "..."}
  
  -- Description
  short_description TEXT NOT NULL,
  what_this_shows TEXT NOT NULL,
  what_this_does_not_show TEXT[] NOT NULL DEFAULT '{}',
  
  -- Linked indicators
  primary_kpi_codes TEXT[] NOT NULL DEFAULT '{}',
  secondary_kpi_codes TEXT[] DEFAULT '{}',
  
  -- Metadata
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.big_questions ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Big questions are public"
  ON public.big_questions
  FOR SELECT
  USING (true);

-- ============================================================================
-- BIG QUESTION RANKINGS (Auto-calculated, per geography)
-- ============================================================================

CREATE TABLE public.big_question_rankings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Which question
  question_id UUID NOT NULL REFERENCES public.big_questions(id) ON DELETE CASCADE,
  
  -- Geography (NULL = global)
  country_code TEXT REFERENCES public.countries(code),
  region_code TEXT,
  
  -- Ranking metrics (all 0-100)
  trend_acceleration NUMERIC(5,2) NOT NULL DEFAULT 0,
  cross_domain_impact NUMERIC(5,2) NOT NULL DEFAULT 0,
  population_affected NUMERIC(5,2) NOT NULL DEFAULT 0,
  data_uncertainty NUMERIC(5,2) NOT NULL DEFAULT 0,
  
  -- Calculated score
  importance_score NUMERIC(6,2) GENERATED ALWAYS AS (
    trend_acceleration + cross_domain_impact + population_affected - data_uncertainty
  ) STORED,
  
  -- Rank (1 = most important)
  rank_position INTEGER,
  rank_change INTEGER DEFAULT 0, -- vs previous period
  
  -- Period
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  
  -- Timestamps
  calculated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Unique per question per geography per period
  UNIQUE (question_id, country_code, region_code, period_start)
);

-- Enable RLS
ALTER TABLE public.big_question_rankings ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Rankings are public"
  ON public.big_question_rankings
  FOR SELECT
  USING (true);

-- ============================================================================
-- BIG QUESTION SUMMARIES (Auto-generated text per geography)
-- ============================================================================

CREATE TABLE public.big_question_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Which question/geography
  question_id UUID NOT NULL REFERENCES public.big_questions(id) ON DELETE CASCADE,
  country_code TEXT REFERENCES public.countries(code),
  
  -- Summary content
  summary_text TEXT NOT NULL,
  why_ranked_high TEXT,
  underlying_indicators JSONB DEFAULT '[]',
  
  -- Language
  language_code TEXT NOT NULL DEFAULT 'en',
  
  -- Timestamps
  generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  valid_until TIMESTAMP WITH TIME ZONE,
  
  -- Unique per question/country/language
  UNIQUE (question_id, country_code, language_code)
);

-- Enable RLS
ALTER TABLE public.big_question_summaries ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Summaries are public"
  ON public.big_question_summaries
  FOR SELECT
  USING (true);

-- ============================================================================
-- BIG QUESTION HISTORY (Track ranking changes over time)
-- ============================================================================

CREATE TABLE public.big_question_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Reference
  question_id UUID NOT NULL REFERENCES public.big_questions(id) ON DELETE CASCADE,
  country_code TEXT REFERENCES public.countries(code),
  
  -- Historical data
  period DATE NOT NULL,
  rank_position INTEGER NOT NULL,
  importance_score NUMERIC(6,2) NOT NULL,
  
  -- What changed
  change_reason TEXT,
  
  -- Timestamps
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE (question_id, country_code, period)
);

-- Enable RLS
ALTER TABLE public.big_question_history ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "History is public"
  ON public.big_question_history
  FOR SELECT
  USING (true);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX idx_bq_rankings_score ON public.big_question_rankings(importance_score DESC);
CREATE INDEX idx_bq_rankings_country ON public.big_question_rankings(country_code);
CREATE INDEX idx_bq_rankings_period ON public.big_question_rankings(period_start);
CREATE INDEX idx_bq_history_question ON public.big_question_history(question_id, period);

-- ============================================================================
-- SEED: Initial Big Questions (V1)
-- ============================================================================

INSERT INTO public.big_questions (code, category, question_text, short_description, what_this_shows, what_this_does_not_show, primary_kpi_codes) VALUES
-- Demography & Work
('BQ-DEM-001', 'demography_work', 'How is the dependency ratio changing?', 
 'Tracks the ratio of non-working age population to working age population.',
 'Changes in the balance between those who typically work and those who typically do not.',
 ARRAY['Future predictions', 'Individual circumstances', 'Policy recommendations'],
 ARRAY['dependency_ratio', 'age_structure', 'labor_participation']),

('BQ-DEM-002', 'demography_work', 'How is labor force participation evolving?',
 'Measures changes in the share of working-age population actively in the labor market.',
 'Trends in who participates in formal employment across demographics.',
 ARRAY['Informal work', 'Work quality', 'Future employment levels'],
 ARRAY['labor_participation', 'employment_rate', 'unemployment_rate']),

-- Economic Capacity
('BQ-ECO-001', 'economic_capacity', 'How is productivity developing relative to population?',
 'Compares output per person over time.',
 'Whether economic output is keeping pace with population changes.',
 ARRAY['Income distribution', 'Environmental costs', 'Quality of output'],
 ARRAY['gdp_per_capita', 'productivity_index', 'population_growth']),

('BQ-ECO-002', 'economic_capacity', 'How is the tax base changing relative to public expenditure?',
 'Tracks fiscal sustainability indicators.',
 'The balance between public income and spending over time.',
 ARRAY['Optimal tax levels', 'Spending priorities', 'Future deficits'],
 ARRAY['tax_revenue_gdp', 'public_spending_gdp', 'debt_to_gdp']),

-- Health & Longevity
('BQ-HEA-001', 'health_longevity', 'How is life expectancy changing?',
 'Tracks changes in expected lifespan at birth.',
 'Aggregate trends in population health outcomes.',
 ARRAY['Individual health', 'Cause of death specifics', 'Healthcare recommendations'],
 ARRAY['life_expectancy', 'infant_mortality', 'healthy_life_years']),

('BQ-HEA-002', 'health_longevity', 'How are health outcomes changing relative to health spending?',
 'Compares health investment to measurable outcomes.',
 'Whether increased spending correlates with improved outcomes.',
 ARRAY['Optimal spending levels', 'Treatment recommendations', 'Individual prognosis'],
 ARRAY['health_spending_gdp', 'life_expectancy', 'disease_burden']),

-- Energy & Resources
('BQ-ENE-001', 'energy_resources', 'How is energy dependency changing?',
 'Measures reliance on energy imports vs domestic production.',
 'Structural changes in energy self-sufficiency.',
 ARRAY['Energy policy recommendations', 'Future prices', 'Optimal energy mix'],
 ARRAY['energy_import_ratio', 'energy_per_capita', 'renewable_share']),

('BQ-ENE-002', 'energy_resources', 'How is energy consumption per capita evolving?',
 'Tracks energy use relative to population.',
 'Changes in per-person energy consumption patterns.',
 ARRAY['Environmental impact', 'Efficiency judgments', 'Consumption recommendations'],
 ARRAY['energy_per_capita', 'electricity_per_capita', 'industrial_energy']),

-- Food & Supply
('BQ-FOO-001', 'food_supply', 'How is food security changing?',
 'Measures calorie availability and food import dependence.',
 'Structural trends in food system resilience.',
 ARRAY['Nutrition quality', 'Individual diet recommendations', 'Future food prices'],
 ARRAY['calorie_supply', 'food_import_ratio', 'agricultural_land']),

-- Institutional Resilience
('BQ-INS-001', 'institutional_resilience', 'How is public debt evolving relative to capacity?',
 'Tracks debt levels against economic capacity.',
 'Long-term trends in fiscal position.',
 ARRAY['Optimal debt levels', 'Spending recommendations', 'Default risk'],
 ARRAY['debt_to_gdp', 'interest_payments_gdp', 'primary_balance']),

('BQ-INS-002', 'institutional_resilience', 'How is democratic participation changing?',
 'Measures trends in voter turnout and civic engagement.',
 'Changes in formal political participation over time.',
 ARRAY['Democratic quality', 'Policy preferences', 'Governance recommendations'],
 ARRAY['voter_turnout', 'trust_in_government', 'civic_engagement']);

-- ============================================================================
-- FUNCTION: Calculate importance score for a question
-- ============================================================================

CREATE OR REPLACE FUNCTION public.calculate_question_importance(
  p_question_id UUID,
  p_country_code TEXT DEFAULT NULL
)
RETURNS NUMERIC
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_trend NUMERIC := 0;
  v_impact NUMERIC := 0;
  v_population NUMERIC := 0;
  v_uncertainty NUMERIC := 0;
BEGIN
  -- This would normally calculate from actual KPI data
  -- For now, returns placeholder that can be enhanced
  
  -- Get trend acceleration from related KPIs
  v_trend := 50; -- Placeholder
  
  -- Get cross-domain impact
  v_impact := 30; -- Placeholder
  
  -- Get population affected
  v_population := 40; -- Placeholder
  
  -- Get data uncertainty
  v_uncertainty := 10; -- Placeholder
  
  RETURN v_trend + v_impact + v_population - v_uncertainty;
END;
$$;