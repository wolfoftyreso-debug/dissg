-- ============================================================================
-- BLOCK 55: PUBLIC TRUST LOG & GOVERNANCE
-- Immune to manipulation. Everything is traceable.
-- ============================================================================

-- Change types enum (standardized, no "editorial" allowed)
CREATE TYPE public.trust_log_change_type AS ENUM (
  'data_update',
  'method_update', 
  'text_simplification',
  'structure_change',
  'bug_fix',
  'deprecation'
);

-- Governance roles enum
CREATE TYPE public.governance_role AS ENUM (
  'data_steward',
  'method_reviewer',
  'system_maintainer',
  'public_observer'
);

-- Review status enum
CREATE TYPE public.review_status AS ENUM (
  'pending',
  'verified',
  'disputed',
  'resolved'
);

-- ============================================================================
-- TRUST LOG TABLE (Public, immutable)
-- ============================================================================

CREATE TABLE public.trust_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  log_id TEXT UNIQUE NOT NULL, -- Format: TL-YYYY-MM-NNNNN
  
  -- What changed
  change_type trust_log_change_type NOT NULL,
  scope TEXT NOT NULL, -- e.g., "facts/work-and-ai/country/sweden/1990-2024"
  reason TEXT NOT NULL,
  
  -- Impact
  data_changed BOOLEAN NOT NULL DEFAULT false,
  method_changed BOOLEAN NOT NULL DEFAULT false,
  content_impact TEXT,
  
  -- Who/what initiated
  initiated_by TEXT NOT NULL, -- Role or system name, never personal
  initiated_by_role governance_role,
  
  -- Review
  review_status review_status NOT NULL DEFAULT 'pending',
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by_role governance_role,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Immutability: cannot be updated or deleted
  CONSTRAINT trust_log_immutable CHECK (true)
);

-- Enable RLS
ALTER TABLE public.trust_log ENABLE ROW LEVEL SECURITY;

-- Everyone can read (public transparency)
CREATE POLICY "Trust log is public"
  ON public.trust_log
  FOR SELECT
  USING (true);

-- Only system can insert (via edge functions)
CREATE POLICY "Only authenticated can insert trust log"
  ON public.trust_log
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- No updates or deletes allowed (immutability)
-- Policies intentionally omitted for UPDATE and DELETE

-- ============================================================================
-- DATA VERSIONS TABLE (Historical immutability)
-- ============================================================================

CREATE TABLE public.data_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- What this version is for
  entity_type TEXT NOT NULL, -- 'kpi_value', 'observation', 'analysis_chain'
  entity_id UUID NOT NULL,
  
  -- Version info
  version_number INTEGER NOT NULL DEFAULT 1,
  version_checksum TEXT NOT NULL,
  
  -- Snapshot of the data at this version
  data_snapshot JSONB NOT NULL,
  
  -- Why this version was created
  trust_log_id UUID REFERENCES public.trust_log(id),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Unique version per entity
  UNIQUE (entity_type, entity_id, version_number)
);

-- Enable RLS
ALTER TABLE public.data_versions ENABLE ROW LEVEL SECURITY;

-- Everyone can read versions
CREATE POLICY "Data versions are public"
  ON public.data_versions
  FOR SELECT
  USING (true);

-- Only system can insert
CREATE POLICY "Only authenticated can insert versions"
  ON public.data_versions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- ============================================================================
-- GOVERNANCE ACTIONS TABLE (Who did what)
-- ============================================================================

CREATE TABLE public.governance_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Actor (role, not person)
  actor_role governance_role NOT NULL,
  actor_id UUID, -- Optional reference to profiles
  
  -- Action
  action_type TEXT NOT NULL,
  action_scope TEXT NOT NULL,
  action_description TEXT NOT NULL,
  
  -- Result
  was_approved BOOLEAN,
  approval_reason TEXT,
  
  -- Link to trust log
  trust_log_id UUID REFERENCES public.trust_log(id),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.governance_actions ENABLE ROW LEVEL SECURITY;

-- Everyone can read
CREATE POLICY "Governance actions are public"
  ON public.governance_actions
  FOR SELECT
  USING (true);

-- ============================================================================
-- ANTI-INFLUENCE LOCKS TABLE
-- Records all rejected influence attempts
-- ============================================================================

CREATE TABLE public.anti_influence_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- What was blocked
  attempt_type TEXT NOT NULL, -- 'sponsored_content', 'pay_to_rank', 'political_banner', etc.
  attempt_description TEXT NOT NULL,
  
  -- System response
  blocked_automatically BOOLEAN NOT NULL DEFAULT true,
  block_reason TEXT NOT NULL,
  
  -- Timestamps
  attempted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.anti_influence_log ENABLE ROW LEVEL SECURITY;

-- Everyone can read (transparency about what we reject)
CREATE POLICY "Anti-influence log is public"
  ON public.anti_influence_log
  FOR SELECT
  USING (true);

-- ============================================================================
-- FUNCTION: Generate Trust Log ID
-- ============================================================================

CREATE OR REPLACE FUNCTION public.generate_trust_log_id()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  year_month TEXT;
  sequence_num INTEGER;
  new_id TEXT;
BEGIN
  year_month := to_char(now(), 'YYYY-MM');
  
  -- Get next sequence number for this month
  SELECT COALESCE(MAX(
    CAST(SPLIT_PART(log_id, '-', 4) AS INTEGER)
  ), 0) + 1
  INTO sequence_num
  FROM public.trust_log
  WHERE log_id LIKE 'TL-' || year_month || '-%';
  
  new_id := 'TL-' || year_month || '-' || LPAD(sequence_num::TEXT, 5, '0');
  
  RETURN new_id;
END;
$$;

-- ============================================================================
-- FUNCTION: Create Trust Log Entry
-- ============================================================================

CREATE OR REPLACE FUNCTION public.create_trust_log_entry(
  p_change_type trust_log_change_type,
  p_scope TEXT,
  p_reason TEXT,
  p_data_changed BOOLEAN DEFAULT false,
  p_method_changed BOOLEAN DEFAULT false,
  p_content_impact TEXT DEFAULT NULL,
  p_initiated_by TEXT DEFAULT 'system',
  p_initiated_by_role governance_role DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id UUID;
  new_log_id TEXT;
BEGIN
  new_log_id := public.generate_trust_log_id();
  
  INSERT INTO public.trust_log (
    log_id,
    change_type,
    scope,
    reason,
    data_changed,
    method_changed,
    content_impact,
    initiated_by,
    initiated_by_role
  ) VALUES (
    new_log_id,
    p_change_type,
    p_scope,
    p_reason,
    p_data_changed,
    p_method_changed,
    p_content_impact,
    p_initiated_by,
    p_initiated_by_role
  )
  RETURNING id INTO new_id;
  
  RETURN new_id;
END;
$$;

-- ============================================================================
-- INDEX for performance
-- ============================================================================

CREATE INDEX idx_trust_log_created_at ON public.trust_log(created_at DESC);
CREATE INDEX idx_trust_log_change_type ON public.trust_log(change_type);
CREATE INDEX idx_trust_log_scope ON public.trust_log(scope);
CREATE INDEX idx_data_versions_entity ON public.data_versions(entity_type, entity_id);