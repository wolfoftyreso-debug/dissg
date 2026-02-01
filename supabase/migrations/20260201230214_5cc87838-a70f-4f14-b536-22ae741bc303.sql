-- ============================================
-- FÖRKLARBARHET & SPÅRBARHET: Datamodell
-- ============================================

-- Enum för observationstyp
CREATE TYPE public.observation_type AS ENUM (
  'trend_deviation',      -- Trendavvikelse
  'threshold_breach',     -- Tröskelvärde passerat
  'correlation_detected', -- Korrelation upptäckt
  'pattern_match',        -- Mönstermatchning
  'lag_signal',           -- Tidsfördröjd signal
  'anomaly'               -- Statistisk anomali
);

-- Enum för analysstatus
CREATE TYPE public.analysis_status AS ENUM (
  'pending',
  'in_progress',
  'completed',
  'verified'
);

-- Enum för analyseringsmetod
CREATE TYPE public.analysis_method AS ENUM (
  'trend_detection',
  'change_point_detection',
  'correlation_analysis',
  'lag_analysis',
  'regression',
  'decomposition',
  'anomaly_detection'
);

-- ============================================
-- 1. OBSERVATIONS (Iakttagelser)
-- ============================================
CREATE TABLE public.observations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Vad observerades
  observation_type observation_type NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL, -- Alltid observationsspråk
  
  -- Koppling till KPI
  kpi_id UUID NOT NULL REFERENCES public.kpi_definitions(id),
  kpi_value_id UUID REFERENCES public.kpi_values(id),
  
  -- Signalstyrka & säkerhet
  signal_strength NUMERIC NOT NULL CHECK (signal_strength >= 0 AND signal_strength <= 100),
  confidence_level NUMERIC NOT NULL CHECK (confidence_level >= 0 AND confidence_level <= 100),
  
  -- Tidsram
  observation_period_start DATE NOT NULL,
  observation_period_end DATE NOT NULL,
  detected_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Status
  status analysis_status NOT NULL DEFAULT 'pending',
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  acknowledged_by TEXT,
  
  -- Metadata (immutable efter skapande)
  analysis_version TEXT NOT NULL DEFAULT '1.0',
  model_version TEXT NOT NULL DEFAULT '1.0',
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================
-- 2. ANALYSIS_CHAINS (Analyskedjor - 5 nivåer)
-- ============================================
CREATE TABLE public.analysis_chains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  observation_id UUID NOT NULL REFERENCES public.observations(id) ON DELETE CASCADE,
  
  -- Nivå i kedjan (1-5)
  level INTEGER NOT NULL CHECK (level >= 1 AND level <= 5),
  
  -- Nivåbeskrivningar:
  -- 1 = Analysöversikt (sammanfattning)
  -- 2 = Rotorsaksanalys (metod)
  -- 3 = Faktoranalys (bidrag)
  -- 4 = Datakällor & bearbetning
  -- 5 = Rå tidsserie
  
  level_title TEXT NOT NULL,
  level_content JSONB NOT NULL, -- Strukturerat innehåll per nivå
  
  -- Metodtransparens (nivå 2+)
  analysis_method analysis_method,
  method_rationale TEXT, -- Varför denna metod
  alternatives_tested JSONB, -- Vilka alternativ förkastades
  
  -- Ordning inom nivå
  sequence_order INTEGER NOT NULL DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================
-- 3. FACTOR_CONTRIBUTIONS (Faktoranalys)
-- ============================================
CREATE TABLE public.factor_contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_chain_id UUID NOT NULL REFERENCES public.analysis_chains(id) ON DELETE CASCADE,
  
  -- Faktoridentifiering
  factor_name TEXT NOT NULL,
  factor_kpi_id UUID REFERENCES public.kpi_definitions(id),
  
  -- Bidragsanalys
  contribution_strength NUMERIC NOT NULL CHECK (contribution_strength >= 0 AND contribution_strength <= 100),
  time_relation TEXT NOT NULL, -- "föregick med 2-3 veckor"
  stability_score NUMERIC NOT NULL CHECK (stability_score >= 0 AND stability_score <= 100),
  uncertainty NUMERIC NOT NULL CHECK (uncertainty >= 0 AND uncertainty <= 100),
  
  -- Evidens
  evidence_periods INTEGER NOT NULL, -- Antal mätperioder med evidens
  evidence_total_periods INTEGER NOT NULL, -- Totalt antal testade perioder
  
  -- Beskrivning (observationsspråk)
  description TEXT NOT NULL,
  
  sequence_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================
-- 4. DATA_LINEAGE (Fullständig spårbarhet)
-- ============================================
CREATE TABLE public.data_lineage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Koppling (kan vara till observation eller kpi_value)
  observation_id UUID REFERENCES public.observations(id) ON DELETE CASCADE,
  kpi_value_id UUID REFERENCES public.kpi_values(id) ON DELETE CASCADE,
  analysis_chain_id UUID REFERENCES public.analysis_chains(id) ON DELETE CASCADE,
  
  -- Källinformation
  data_source_id UUID NOT NULL REFERENCES public.data_sources(id),
  original_source TEXT NOT NULL, -- Myndighet/system
  
  -- Insamlingsmetadata
  collection_method TEXT NOT NULL,
  collection_interval TEXT NOT NULL, -- "daglig", "veckovis", etc.
  collected_at TIMESTAMP WITH TIME ZONE NOT NULL,
  
  -- Bearbetning
  aggregation_level TEXT NOT NULL, -- "nationell", "regional", "kommunal"
  transformations_applied JSONB NOT NULL DEFAULT '[]', -- Lista av transformationer
  data_cleaning_notes TEXT,
  
  -- Kvalitet
  missing_data_count INTEGER DEFAULT 0,
  corrections_applied JSONB DEFAULT '[]',
  methodology_changes JSONB DEFAULT '[]',
  
  -- Rå värden (aggregerad, laglig nivå)
  raw_values JSONB NOT NULL, -- Tidsseriedata
  
  -- Immutability
  checksum TEXT NOT NULL, -- SHA-256 av raw_values
  version INTEGER NOT NULL DEFAULT 1,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================
-- 5. DECISION_TIMELINE (Beslutskoppling)
-- ============================================
CREATE TABLE public.decision_timeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Beslutsinformation
  decision_id UUID REFERENCES public.policy_decisions(id),
  action_id UUID REFERENCES public.action_options(id),
  
  -- Extern händelse (om inte kopplad till beslut/åtgärd)
  event_type TEXT, -- "policy_change", "external_event", "methodology_change"
  event_title TEXT NOT NULL,
  event_description TEXT,
  
  -- Tidpunkt
  event_date DATE NOT NULL,
  event_timestamp TIMESTAMP WITH TIME ZONE,
  
  -- Koppling till KPI:er
  affected_kpi_ids UUID[] NOT NULL DEFAULT '{}',
  
  -- Ansvar
  responsible_level TEXT, -- "regering", "myndighet", "region", "kommun"
  responsible_entity TEXT,
  
  -- Verifierbarhet
  source_document TEXT,
  source_url TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================
-- 6. ANALYSIS_AUDIT_LOG (Immutable revision)
-- ============================================
CREATE TABLE public.analysis_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Vad loggades
  entity_type TEXT NOT NULL, -- "observation", "analysis_chain", "data_lineage"
  entity_id UUID NOT NULL,
  
  -- Händelse
  action TEXT NOT NULL, -- "created", "accessed", "exported", "verified"
  actor TEXT, -- Vem/vad utförde handlingen
  
  -- Snapshot (för reproducerbarhet)
  entity_snapshot JSONB NOT NULL,
  
  -- Kontext
  context JSONB DEFAULT '{}',
  
  -- Tidsstämpel (aldrig ändringsbar)
  logged_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_observations_kpi ON public.observations(kpi_id);
CREATE INDEX idx_observations_type ON public.observations(observation_type);
CREATE INDEX idx_observations_detected ON public.observations(detected_at DESC);
CREATE INDEX idx_analysis_chains_observation ON public.analysis_chains(observation_id);
CREATE INDEX idx_analysis_chains_level ON public.analysis_chains(level);
CREATE INDEX idx_factor_contributions_chain ON public.factor_contributions(analysis_chain_id);
CREATE INDEX idx_data_lineage_observation ON public.data_lineage(observation_id);
CREATE INDEX idx_data_lineage_kpi_value ON public.data_lineage(kpi_value_id);
CREATE INDEX idx_decision_timeline_date ON public.decision_timeline(event_date);
CREATE INDEX idx_audit_log_entity ON public.analysis_audit_log(entity_type, entity_id);

-- ============================================
-- RLS POLICIES
-- ============================================
ALTER TABLE public.observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_chains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.factor_contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_lineage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.decision_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_audit_log ENABLE ROW LEVEL SECURITY;

-- Alla kan läsa (transparens)
CREATE POLICY "Public read access" ON public.observations FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.analysis_chains FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.factor_contributions FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.data_lineage FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.decision_timeline FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.analysis_audit_log FOR SELECT USING (true);

-- Service role kan skapa (backend only)
CREATE POLICY "Service can insert" ON public.observations FOR INSERT WITH CHECK (true);
CREATE POLICY "Service can insert" ON public.analysis_chains FOR INSERT WITH CHECK (true);
CREATE POLICY "Service can insert" ON public.factor_contributions FOR INSERT WITH CHECK (true);
CREATE POLICY "Service can insert" ON public.data_lineage FOR INSERT WITH CHECK (true);
CREATE POLICY "Service can insert" ON public.decision_timeline FOR INSERT WITH CHECK (true);

-- Audit log är append-only
CREATE POLICY "Service can insert audit" ON public.analysis_audit_log FOR INSERT WITH CHECK (true);
-- Ingen UPDATE eller DELETE på audit_log (immutable by design)