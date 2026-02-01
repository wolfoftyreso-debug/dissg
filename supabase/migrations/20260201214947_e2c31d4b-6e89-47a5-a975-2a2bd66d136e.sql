-- ═══════════════════════════════════════════════════════════════
-- NATIONELLT LEDNINGSSYSTEM - DATARYGGRAD
-- ═══════════════════════════════════════════════════════════════

-- ENUMS
CREATE TYPE public.kpi_category AS ENUM (
  'demografi_halsa',
  'arbete_produktivitet',
  'ekonomisk_barkraft',
  'social_stabilitet',
  'karnsystem_funktion',
  'infrastruktur',
  'systemrisk_styrning'
);

CREATE TYPE public.kpi_status AS ENUM (
  'positive',
  'warning',
  'critical',
  'neutral'
);

CREATE TYPE public.trend_direction AS ENUM (
  'up',
  'down',
  'stable'
);

CREATE TYPE public.data_source_type AS ENUM (
  'api',
  'file_feed',
  'manual',
  'calculated'
);

CREATE TYPE public.update_frequency AS ENUM (
  'realtime',
  'daily',
  'weekly',
  'monthly',
  'quarterly',
  'yearly'
);

-- ═══════════════════════════════════════════════════════════════
-- DATA SOURCES - Datakällor (SCB, Socialstyrelsen, etc.)
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE public.data_sources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  source_type public.data_source_type NOT NULL DEFAULT 'api',
  base_url TEXT,
  api_endpoint TEXT,
  update_frequency public.update_frequency NOT NULL,
  reliability_score INTEGER NOT NULL DEFAULT 80 CHECK (reliability_score >= 0 AND reliability_score <= 100),
  requires_auth BOOLEAN NOT NULL DEFAULT false,
  auth_type TEXT, -- 'api_key', 'oauth', 'basic', etc.
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_successful_fetch TIMESTAMPTZ,
  last_fetch_error TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ═══════════════════════════════════════════════════════════════
-- KPI DEFINITIONS - Definitioner av de 20 KPI:erna
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE public.kpi_definitions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  kpi_index INTEGER NOT NULL UNIQUE CHECK (kpi_index >= 1 AND kpi_index <= 100),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category public.kpi_category NOT NULL,
  description TEXT NOT NULL,
  rationale TEXT NOT NULL,
  unit TEXT NOT NULL,
  is_inverted BOOLEAN NOT NULL DEFAULT false, -- True if decrease is positive
  red_flag_conditions JSONB NOT NULL DEFAULT '[]',
  breakdown_dimensions TEXT[] NOT NULL DEFAULT '{}',
  calculation_formula TEXT, -- For calculated KPIs
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ═══════════════════════════════════════════════════════════════
-- KPI <-> DATA SOURCE MAPPING
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE public.kpi_data_source_mapping (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  kpi_id UUID NOT NULL REFERENCES public.kpi_definitions(id) ON DELETE CASCADE,
  data_source_id UUID NOT NULL REFERENCES public.data_sources(id) ON DELETE CASCADE,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  weight DECIMAL(3,2) NOT NULL DEFAULT 1.0, -- For weighted averaging
  transformation_config JSONB DEFAULT '{}', -- Field mappings, calculations
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(kpi_id, data_source_id)
);

-- ═══════════════════════════════════════════════════════════════
-- KPI VALUES - Tidsserie med värden
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE public.kpi_values (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  kpi_id UUID NOT NULL REFERENCES public.kpi_definitions(id) ON DELETE CASCADE,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  granularity TEXT NOT NULL DEFAULT 'national', -- 'national', 'regional', 'municipal'
  region_code TEXT, -- NULL for national, else region/kommun code
  value DECIMAL(20,6) NOT NULL,
  previous_value DECIMAL(20,6),
  status public.kpi_status NOT NULL DEFAULT 'neutral',
  trend public.trend_direction NOT NULL DEFAULT 'stable',
  trend_percent DECIMAL(10,4),
  confidence INTEGER NOT NULL DEFAULT 80 CHECK (confidence >= 0 AND confidence <= 100),
  data_source_id UUID REFERENCES public.data_sources(id),
  raw_data JSONB, -- Original data from source
  is_provisional BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(kpi_id, period_start, period_end, granularity, region_code)
);

-- Index for fast time-series queries
CREATE INDEX idx_kpi_values_kpi_period ON public.kpi_values(kpi_id, period_start DESC);
CREATE INDEX idx_kpi_values_status ON public.kpi_values(status) WHERE status IN ('critical', 'warning');

-- ═══════════════════════════════════════════════════════════════
-- INGEST LOG - Audit trail för datainsamling
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE public.ingest_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  data_source_id UUID NOT NULL REFERENCES public.data_sources(id),
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'running', -- 'running', 'success', 'partial', 'failed'
  records_fetched INTEGER DEFAULT 0,
  records_inserted INTEGER DEFAULT 0,
  records_updated INTEGER DEFAULT 0,
  records_failed INTEGER DEFAULT 0,
  error_message TEXT,
  metadata JSONB DEFAULT '{}'
);

CREATE INDEX idx_ingest_log_source_time ON public.ingest_log(data_source_id, started_at DESC);

-- ═══════════════════════════════════════════════════════════════
-- ALERTS - Automatiska varningar
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE public.kpi_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  kpi_id UUID NOT NULL REFERENCES public.kpi_definitions(id) ON DELETE CASCADE,
  kpi_value_id UUID REFERENCES public.kpi_values(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL, -- 'threshold_breach', 'trend_change', 'data_quality', 'missing_data'
  severity public.kpi_status NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  triggered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  acknowledged_at TIMESTAMPTZ,
  acknowledged_by TEXT,
  resolved_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'
);

CREATE INDEX idx_kpi_alerts_active ON public.kpi_alerts(severity, triggered_at DESC) 
WHERE resolved_at IS NULL;

-- ═══════════════════════════════════════════════════════════════
-- POLICY DECISIONS - Beslutsspårning (NIVÅ 4 & 5)
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE public.policy_decisions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  decision_date DATE NOT NULL,
  expected_effect TEXT,
  target_kpis UUID[] NOT NULL DEFAULT '{}', -- KPI IDs this should affect
  status TEXT NOT NULL DEFAULT 'active', -- 'proposed', 'active', 'completed', 'abandoned'
  measured_effect TEXT,
  effectiveness_score INTEGER CHECK (effectiveness_score >= 0 AND effectiveness_score <= 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ═══════════════════════════════════════════════════════════════
-- CALCULATED INDICATORS - Sammansatta indikatorer
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE public.calculated_indicators (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  kpi_id UUID NOT NULL REFERENCES public.kpi_definitions(id) ON DELETE CASCADE,
  source_kpi_ids UUID[] NOT NULL,
  weights DECIMAL(5,4)[] NOT NULL,
  formula TEXT NOT NULL, -- 'weighted_average', 'sum', 'custom'
  last_calculated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ═══════════════════════════════════════════════════════════════
-- ENABLE RLS
-- ═══════════════════════════════════════════════════════════════
ALTER TABLE public.data_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kpi_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kpi_data_source_mapping ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kpi_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ingest_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kpi_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.policy_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calculated_indicators ENABLE ROW LEVEL SECURITY;

-- Public read access for dashboard (no auth required for viewing)
CREATE POLICY "Public read access" ON public.data_sources FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.kpi_definitions FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.kpi_data_source_mapping FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.kpi_values FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.kpi_alerts FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.policy_decisions FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.calculated_indicators FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.ingest_log FOR SELECT USING (true);

-- ═══════════════════════════════════════════════════════════════
-- UPDATE TIMESTAMP TRIGGER
-- ═══════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_data_sources_updated_at
  BEFORE UPDATE ON public.data_sources
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_kpi_definitions_updated_at
  BEFORE UPDATE ON public.kpi_definitions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_kpi_values_updated_at
  BEFORE UPDATE ON public.kpi_values
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_policy_decisions_updated_at
  BEFORE UPDATE ON public.policy_decisions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();