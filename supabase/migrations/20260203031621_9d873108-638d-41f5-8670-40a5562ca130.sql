-- =============================================
-- CANONICAL QUESTION & ANSWER INTELLIGENCE SYSTEM (CQAIS)
-- =============================================

-- Question intent classification enum
CREATE TYPE question_intent_class AS ENUM (
  'status',        -- How is it now?
  'trend',         -- What's changing over time?
  'cause',         -- Why is this happening?
  'comparison',    -- How does it differ?
  'consequence',   -- What does this mean?
  'forecast'       -- What are likely outcomes?
);

-- Question block reason enum
CREATE TYPE question_block_reason AS ENUM (
  'normative',           -- Is it right/wrong?
  'political_directive', -- Should we do X?
  'speculative',         -- What if (no data)?
  'insufficient_data',   -- Not enough coverage
  'out_of_scope'         -- Not factual
);

-- Canonical Questions table
CREATE TABLE public.canonical_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id TEXT NOT NULL UNIQUE,
  canonical_text TEXT NOT NULL,
  canonical_text_local JSONB DEFAULT '{}',
  intent_class question_intent_class NOT NULL,
  scope_level TEXT NOT NULL DEFAULT 'world', -- world/country/region/city
  default_time_window TEXT DEFAULT '5Y',
  comparison_baseline TEXT,
  search_variants TEXT[] DEFAULT '{}',
  search_volume_estimate INTEGER,
  priority_rank INTEGER,
  is_blocked BOOLEAN DEFAULT false,
  block_reason question_block_reason,
  block_redirect TEXT,
  related_indicator_ids TEXT[] DEFAULT '{}',
  primary_indicator_ids TEXT[] DEFAULT '{}',
  secondary_indicator_ids TEXT[] DEFAULT '{}',
  excluded_indicator_ids TEXT[] DEFAULT '{}',
  answer_template_id UUID,
  metadata JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.canonical_questions ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Canonical questions are publicly readable"
  ON public.canonical_questions FOR SELECT
  USING (true);

-- Admin write access
CREATE POLICY "Admins can manage canonical questions"
  ON public.canonical_questions FOR ALL
  USING (public.has_any_role(auth.uid(), ARRAY['system_admin', 'researcher']::app_role[]));

-- Question Answer Templates table
CREATE TABLE public.question_answer_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_code TEXT NOT NULL UNIQUE,
  template_name TEXT NOT NULL,
  intent_class question_intent_class NOT NULL,
  short_answer_template TEXT NOT NULL,
  mechanism_template TEXT,
  timeline_template TEXT,
  comparison_template TEXT,
  uncertainty_template TEXT,
  deep_links_template TEXT,
  blocked_response_template TEXT,
  translations JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.question_answer_templates ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Answer templates are publicly readable"
  ON public.question_answer_templates FOR SELECT
  USING (true);

-- Question Search Log (for self-expanding question list)
CREATE TABLE public.question_search_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  raw_query TEXT NOT NULL,
  normalized_query TEXT,
  detected_intent question_intent_class,
  matched_question_id UUID REFERENCES public.canonical_questions(id),
  was_blocked BOOLEAN DEFAULT false,
  block_reason question_block_reason,
  geo_context TEXT,
  language_code TEXT DEFAULT 'en',
  source_type TEXT DEFAULT 'api', -- api/web/voice
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.question_search_log ENABLE ROW LEVEL SECURITY;

-- System can insert logs
CREATE POLICY "System can log question searches"
  ON public.question_search_log FOR INSERT
  WITH CHECK (true);

-- Admins can view logs
CREATE POLICY "Admins can view question logs"
  ON public.question_search_log FOR SELECT
  USING (public.has_any_role(auth.uid(), ARRAY['system_admin', 'researcher']::app_role[]));

-- Suggested Questions (for self-expanding system)
CREATE TABLE public.suggested_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  suggested_text TEXT NOT NULL,
  detected_intent question_intent_class,
  search_frequency INTEGER DEFAULT 1,
  first_seen_at TIMESTAMPTZ DEFAULT now(),
  last_seen_at TIMESTAMPTZ DEFAULT now(),
  status TEXT DEFAULT 'pending', -- pending/approved/rejected
  reviewed_by UUID,
  reviewed_at TIMESTAMPTZ,
  rejection_reason TEXT,
  promoted_to_question_id UUID REFERENCES public.canonical_questions(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.suggested_questions ENABLE ROW LEVEL SECURITY;

-- System can insert suggestions
CREATE POLICY "System can suggest questions"
  ON public.suggested_questions FOR INSERT
  WITH CHECK (true);

-- Admins can manage suggestions
CREATE POLICY "Admins can manage suggested questions"
  ON public.suggested_questions FOR ALL
  USING (public.has_any_role(auth.uid(), ARRAY['system_admin', 'researcher']::app_role[]));

-- Indexes for performance
CREATE INDEX idx_canonical_questions_intent ON public.canonical_questions(intent_class);
CREATE INDEX idx_canonical_questions_scope ON public.canonical_questions(scope_level);
CREATE INDEX idx_canonical_questions_priority ON public.canonical_questions(priority_rank);
CREATE INDEX idx_canonical_questions_active ON public.canonical_questions(is_active);
CREATE INDEX idx_canonical_questions_search ON public.canonical_questions USING GIN(search_variants);
CREATE INDEX idx_question_search_log_created ON public.question_search_log(created_at);
CREATE INDEX idx_suggested_questions_status ON public.suggested_questions(status);

-- Trigger for updated_at
CREATE TRIGGER update_canonical_questions_updated_at
  BEFORE UPDATE ON public.canonical_questions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();