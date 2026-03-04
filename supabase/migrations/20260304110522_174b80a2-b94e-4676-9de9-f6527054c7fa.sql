
-- ============================================================================
-- UNIVERSAL CLAIM ENGINE (UCE) — Database Schema
-- ============================================================================

-- Relationship types enum
CREATE TYPE public.uce_relationship_type AS ENUM (
  'increases', 'decreases', 'causes', 'prevents', 'correlates_with',
  'modulates', 'mediates', 'confounds', 'no_effect', 'unknown'
);

-- Claim status enum
CREATE TYPE public.uce_claim_status AS ENUM (
  'hypothesized', 'proposed', 'under_review', 'supported', 'contested',
  'refuted', 'superseded', 'retracted'
);

-- Evidence type enum
CREATE TYPE public.uce_evidence_type AS ENUM (
  'systematic_review', 'meta_analysis', 'rct', 'cohort_study',
  'case_control', 'cross_sectional', 'case_report', 'expert_opinion',
  'statistical_dataset', 'observational_report', 'simulation'
);

-- ============================================================================
-- 1. UNIVERSAL CLAIMS — The core table
-- ============================================================================
CREATE TABLE public.universal_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  claim_code TEXT NOT NULL UNIQUE,
  domain TEXT NOT NULL,
  
  -- ENTITY → VARIABLE → RELATIONSHIP → OUTCOME
  subject_entity TEXT NOT NULL,
  subject_entity_code TEXT,
  variable_or_intervention TEXT NOT NULL,
  variable_code TEXT,
  relationship_type public.uce_relationship_type NOT NULL,
  target_outcome TEXT NOT NULL,
  target_outcome_code TEXT,
  
  -- Quantification
  effect_size NUMERIC,
  effect_size_unit TEXT,
  effect_size_ci_lower NUMERIC,
  effect_size_ci_upper NUMERIC,
  
  -- Scope
  population_scope TEXT,
  population_size INTEGER,
  geographic_scope TEXT,
  geo_code TEXT,
  time_scale TEXT,
  time_observed_start DATE,
  time_observed_end DATE,
  
  -- Confidence & Status
  status public.uce_claim_status NOT NULL DEFAULT 'proposed',
  confidence_score NUMERIC NOT NULL DEFAULT 0 CHECK (confidence_score >= 0 AND confidence_score <= 1),
  evidence_quality TEXT NOT NULL DEFAULT 'very_low',
  uncertainty_description TEXT,
  limitations TEXT[] DEFAULT '{}',
  
  -- Versioning
  version INTEGER NOT NULL DEFAULT 1,
  superseded_by UUID REFERENCES public.universal_claims(id),
  
  -- Provenance
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by TEXT DEFAULT 'system',
  
  -- Full-text search
  statement TEXT NOT NULL,
  statement_local JSONB DEFAULT '{}'
);

-- ============================================================================
-- 2. CLAIM EVIDENCE — Links evidence to claims
-- ============================================================================
CREATE TABLE public.claim_evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  claim_id UUID NOT NULL REFERENCES public.universal_claims(id) ON DELETE CASCADE,
  
  -- Evidence metadata
  evidence_type public.uce_evidence_type NOT NULL,
  link_type TEXT NOT NULL CHECK (link_type IN ('supports', 'contradicts', 'qualifies', 'neutral')),
  
  -- Source info
  source_title TEXT NOT NULL,
  source_authors TEXT,
  source_year INTEGER,
  source_journal TEXT,
  source_doi TEXT,
  source_url TEXT,
  source_organization TEXT,
  source_dataset_id TEXT,
  
  -- Strength assessment
  strength NUMERIC NOT NULL DEFAULT 0.5 CHECK (strength >= 0 AND strength <= 1),
  sample_size INTEGER,
  replication_weight NUMERIC NOT NULL DEFAULT 1.0,
  bias_flags TEXT[] DEFAULT '{}',
  
  -- Statistical details
  p_value NUMERIC,
  effect_reported NUMERIC,
  methodology_notes TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- 3. CLAIM GRAPH EDGES — Connects claims into knowledge graph
-- ============================================================================
CREATE TABLE public.claim_graph_edges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_claim_id UUID NOT NULL REFERENCES public.universal_claims(id) ON DELETE CASCADE,
  target_claim_id UUID NOT NULL REFERENCES public.universal_claims(id) ON DELETE CASCADE,
  
  edge_type TEXT NOT NULL CHECK (edge_type IN ('causal_chain', 'shared_variable', 'cross_domain', 'contradiction', 'refinement')),
  strength NUMERIC DEFAULT 0.5 CHECK (strength >= 0 AND strength <= 1),
  confidence NUMERIC DEFAULT 0.5,
  
  -- Chain semantics: source's outcome is target's variable
  shared_entity TEXT,
  mechanism_description TEXT,
  is_inferred BOOLEAN NOT NULL DEFAULT false,
  inference_method TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  CONSTRAINT no_self_loop CHECK (source_claim_id != target_claim_id),
  UNIQUE(source_claim_id, target_claim_id, edge_type)
);

-- ============================================================================
-- 4. CLAIM CONFLICTS — Tracks and resolves contradictions
-- ============================================================================
CREATE TABLE public.claim_conflicts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  claim_a_id UUID NOT NULL REFERENCES public.universal_claims(id) ON DELETE CASCADE,
  claim_b_id UUID NOT NULL REFERENCES public.universal_claims(id) ON DELETE CASCADE,
  
  conflict_type TEXT NOT NULL CHECK (conflict_type IN ('direct_contradiction', 'effect_direction', 'scope_overlap', 'magnitude_disagreement')),
  description TEXT NOT NULL,
  
  -- Resolution
  resolution_status TEXT NOT NULL DEFAULT 'unresolved' CHECK (resolution_status IN ('unresolved', 'resolved_a', 'resolved_b', 'resolved_both_valid', 'requires_more_data')),
  resolution_rationale TEXT,
  resolved_at TIMESTAMPTZ,
  
  -- Auto-computed winner confidence
  claim_a_confidence NUMERIC,
  claim_b_confidence NUMERIC,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- 5. CLAIM DISCOVERY LOG — Tracks auto-discovered relationships
-- ============================================================================
CREATE TABLE public.claim_discovery_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discovery_type TEXT NOT NULL CHECK (discovery_type IN ('transitive_chain', 'correlation', 'cross_domain', 'pattern')),
  
  -- What was discovered
  source_claims TEXT[] NOT NULL,
  inferred_statement TEXT NOT NULL,
  inferred_relationship public.uce_relationship_type,
  
  -- Confidence in discovery
  confidence NUMERIC NOT NULL DEFAULT 0,
  method TEXT NOT NULL,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'promoted_to_claim')),
  promoted_claim_id UUID REFERENCES public.universal_claims(id),
  
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX idx_uc_domain ON public.universal_claims(domain);
CREATE INDEX idx_uc_status ON public.universal_claims(status);
CREATE INDEX idx_uc_subject ON public.universal_claims(subject_entity);
CREATE INDEX idx_uc_variable ON public.universal_claims(variable_or_intervention);
CREATE INDEX idx_uc_outcome ON public.universal_claims(target_outcome);
CREATE INDEX idx_uc_confidence ON public.universal_claims(confidence_score DESC);
CREATE INDEX idx_uc_claim_code ON public.universal_claims(claim_code);

CREATE INDEX idx_ce_claim ON public.claim_evidence(claim_id);
CREATE INDEX idx_ce_type ON public.claim_evidence(link_type);

CREATE INDEX idx_cge_source ON public.claim_graph_edges(source_claim_id);
CREATE INDEX idx_cge_target ON public.claim_graph_edges(target_claim_id);
CREATE INDEX idx_cge_type ON public.claim_graph_edges(edge_type);

CREATE INDEX idx_cc_claims ON public.claim_conflicts(claim_a_id, claim_b_id);

-- ============================================================================
-- RLS — Public read, authenticated write
-- ============================================================================
ALTER TABLE public.universal_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.claim_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.claim_graph_edges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.claim_conflicts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.claim_discovery_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read universal_claims" ON public.universal_claims FOR SELECT USING (true);
CREATE POLICY "Auth write universal_claims" ON public.universal_claims FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public read claim_evidence" ON public.claim_evidence FOR SELECT USING (true);
CREATE POLICY "Auth write claim_evidence" ON public.claim_evidence FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public read claim_graph_edges" ON public.claim_graph_edges FOR SELECT USING (true);
CREATE POLICY "Auth write claim_graph_edges" ON public.claim_graph_edges FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public read claim_conflicts" ON public.claim_conflicts FOR SELECT USING (true);
CREATE POLICY "Auth write claim_conflicts" ON public.claim_conflicts FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public read claim_discovery_log" ON public.claim_discovery_log FOR SELECT USING (true);
CREATE POLICY "Auth write claim_discovery_log" ON public.claim_discovery_log FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================================================
-- REALTIME for claims
-- ============================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.universal_claims;
