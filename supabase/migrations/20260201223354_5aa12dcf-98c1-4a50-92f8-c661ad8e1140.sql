-- ═══════════════════════════════════════════════════════════════
-- BESLUTSPRIORITERINGSMOTOR - Databasschemat
-- ═══════════════════════════════════════════════════════════════

-- Enum för åtgärdsstatus
CREATE TYPE public.action_status AS ENUM (
  'proposed',      -- Föreslagen
  'under_review',  -- Under granskning
  'approved',      -- Godkänd
  'in_progress',   -- Pågår
  'completed',     -- Genomförd
  'rejected',      -- Avvisad
  'deferred'       -- Uppskjuten
);

-- Enum för prioritetsnivå
CREATE TYPE public.priority_level AS ENUM (
  'critical',   -- Kritisk - kräver omedelbar åtgärd
  'high',       -- Hög prioritet
  'medium',     -- Medel prioritet
  'low',        -- Låg prioritet
  'monitor'     -- Bevaka endast
);

-- ═══════════════════════════════════════════════════════════════
-- Tabell: action_options (Åtgärdsförslag)
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE public.action_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Grundläggande information
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  
  -- Koppling till KPI:er som påverkas
  target_kpi_ids UUID[] NOT NULL DEFAULT '{}',
  
  -- Kategorisering
  category TEXT NOT NULL,  -- t.ex. 'policy', 'budget', 'organization', 'legislation'
  responsible_department TEXT NOT NULL,
  
  -- Uppskattningar (manuellt inmatade)
  estimated_cost_sek BIGINT,  -- Uppskattad kostnad i SEK
  estimated_timeframe_months INTEGER,  -- Tid till effekt
  
  -- Status
  status action_status NOT NULL DEFAULT 'proposed',
  proposed_by TEXT,
  proposed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Metadata
  source_document TEXT,  -- Länk till utredning/PM
  external_references JSONB DEFAULT '[]',
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ═══════════════════════════════════════════════════════════════
-- Tabell: action_evaluations (AI-utvärderingar)
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE public.action_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_id UUID NOT NULL REFERENCES public.action_options(id) ON DELETE CASCADE,
  
  -- De fyra viktningsdimensionerna (0-100)
  effect_score INTEGER NOT NULL CHECK (effect_score >= 0 AND effect_score <= 100),
  cost_score INTEGER NOT NULL CHECK (cost_score >= 0 AND cost_score <= 100),
  risk_score INTEGER NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
  reversibility_score INTEGER NOT NULL CHECK (reversibility_score >= 0 AND reversibility_score <= 100),
  
  -- Viktad totalpoäng (beräknad)
  weighted_score NUMERIC(5,2) NOT NULL,
  
  -- Prioritetsnivå (baserad på weighted_score)
  priority priority_level NOT NULL,
  
  -- AI-genererade motiveringar
  effect_rationale TEXT NOT NULL,      -- Varför denna effektpoäng
  cost_rationale TEXT NOT NULL,        -- Varför denna kostnadspoäng
  risk_rationale TEXT NOT NULL,        -- Varför denna riskpoäng
  reversibility_rationale TEXT NOT NULL, -- Varför denna reversibilitetspoäng
  
  -- Sammanfattning
  summary TEXT NOT NULL,               -- Kort sammanfattning
  recommendation TEXT NOT NULL,        -- AI:s rekommendation
  
  -- Kontraindikationer och risker
  potential_side_effects TEXT[],
  dependencies TEXT[],                 -- Beroenden av andra åtgärder
  
  -- KPI-specifik påverkan (prognos)
  kpi_impact_forecast JSONB DEFAULT '[]',  -- [{kpi_id, expected_change_percent, confidence}]
  
  -- Metadata om utvärderingen
  model_used TEXT NOT NULL DEFAULT 'google/gemini-3-flash-preview',
  evaluation_context JSONB DEFAULT '{}',  -- Vilken KPI-data som användes
  confidence_level INTEGER NOT NULL DEFAULT 70,
  
  evaluated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Unikhet: en aktiv utvärdering per åtgärd
  UNIQUE(action_id, evaluated_at)
);

-- ═══════════════════════════════════════════════════════════════
-- Tabell: evaluation_weights (Konfigurerbara vikter)
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE public.evaluation_weights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  
  -- Vikter för de fyra dimensionerna (ska summera till 1.0)
  effect_weight NUMERIC(3,2) NOT NULL DEFAULT 0.40,
  cost_weight NUMERIC(3,2) NOT NULL DEFAULT 0.25,
  risk_weight NUMERIC(3,2) NOT NULL DEFAULT 0.20,
  reversibility_weight NUMERIC(3,2) NOT NULL DEFAULT 0.15,
  
  is_active BOOLEAN NOT NULL DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Validera att vikter summerar till 1.0
  CONSTRAINT weights_sum_to_one CHECK (
    effect_weight + cost_weight + risk_weight + reversibility_weight = 1.0
  )
);

-- Infoga standardvikter
INSERT INTO public.evaluation_weights (name, description, is_active) VALUES
('default', 'Standardvikter: Effekt 40%, Kostnad 25%, Risk 20%, Reversibilitet 15%', true);

-- ═══════════════════════════════════════════════════════════════
-- RLS Policies
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE public.action_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.action_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluation_weights ENABLE ROW LEVEL SECURITY;

-- Read access för alla (dashboard är offentligt)
CREATE POLICY "Public read access" ON public.action_options
  FOR SELECT USING (true);

CREATE POLICY "Public read access" ON public.action_evaluations
  FOR SELECT USING (true);

CREATE POLICY "Public read access" ON public.evaluation_weights
  FOR SELECT USING (true);

-- ═══════════════════════════════════════════════════════════════
-- Indexes
-- ═══════════════════════════════════════════════════════════════

CREATE INDEX idx_action_options_status ON public.action_options(status);
CREATE INDEX idx_action_options_target_kpis ON public.action_options USING GIN(target_kpi_ids);
CREATE INDEX idx_action_evaluations_action_id ON public.action_evaluations(action_id);
CREATE INDEX idx_action_evaluations_priority ON public.action_evaluations(priority);
CREATE INDEX idx_action_evaluations_weighted_score ON public.action_evaluations(weighted_score DESC);

-- ═══════════════════════════════════════════════════════════════
-- Trigger för updated_at
-- ═══════════════════════════════════════════════════════════════

CREATE TRIGGER update_action_options_updated_at
  BEFORE UPDATE ON public.action_options
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_evaluation_weights_updated_at
  BEFORE UPDATE ON public.evaluation_weights
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();