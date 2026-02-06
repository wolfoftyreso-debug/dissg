-- ============================================================================
-- CANONICAL REPORTS SYSTEM
-- ============================================================================
-- AI-generated analysis reports that answer common questions with verifiable
-- data sources. Designed for SEO and AI agent consumption.

-- Question categories enum
CREATE TYPE public.report_category AS ENUM (
  'societal_state',    -- "Hur står det till med X?"
  'comparison',        -- "Hur står sig X jämfört med Y?"
  'trend'              -- "Går det uppåt eller nedåt med X?"
);

-- Report status enum
CREATE TYPE public.report_status AS ENUM (
  'draft',
  'generating',
  'review',
  'published',
  'archived'
);

-- ============================================================================
-- CANONICAL QUESTIONS - The questions we answer
-- ============================================================================
CREATE TABLE public.report_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Unique identifier for URL: /report/unemployment-rate-sweden-2024
  slug TEXT NOT NULL UNIQUE,
  
  -- The canonical question
  question_text TEXT NOT NULL,
  question_text_en TEXT,
  
  -- Classification
  category report_category NOT NULL,
  
  -- Geographic scope
  geo_level TEXT NOT NULL DEFAULT 'global', -- global, continent, country, region
  geo_code TEXT, -- ISO country code if applicable
  
  -- Related indicators
  primary_indicator_codes TEXT[] DEFAULT '{}',
  secondary_indicator_codes TEXT[] DEFAULT '{}',
  
  -- SEO
  meta_title TEXT,
  meta_description TEXT,
  
  -- Search variants for matching
  search_variants TEXT[] DEFAULT '{}',
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  priority_rank INTEGER DEFAULT 100,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- REPORTS - The actual analysis reports
-- ============================================================================
CREATE TABLE public.analysis_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Link to question
  question_id UUID NOT NULL REFERENCES public.report_questions(id) ON DELETE CASCADE,
  
  -- Unique URL slug: /report/unemployment-sweden-2024-q4
  slug TEXT NOT NULL UNIQUE,
  
  -- Version tracking
  version INTEGER NOT NULL DEFAULT 1,
  
  -- Content (following A2F structure)
  title TEXT NOT NULL,
  subtitle TEXT,
  
  -- The 6-part answer structure
  summary TEXT NOT NULL,                    -- Short factual answer
  mechanisms TEXT,                          -- Driving mechanisms
  timeline JSONB DEFAULT '[]',              -- Historical timeline data
  comparison JSONB DEFAULT '{}',            -- Comparison data
  uncertainty TEXT,                         -- Limitations and uncertainty
  deep_dive_links TEXT[] DEFAULT '{}',      -- Links for further exploration
  
  -- Full content in markdown
  content_markdown TEXT NOT NULL,
  
  -- Machine-readable structured data
  structured_data JSONB DEFAULT '{}',
  
  -- Data freshness
  data_period_start DATE,
  data_period_end DATE,
  data_last_verified TIMESTAMPTZ,
  
  -- AI generation metadata
  model_used TEXT,
  generation_prompt TEXT,
  generation_timestamp TIMESTAMPTZ,
  confidence_score NUMERIC(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
  
  -- Status
  status report_status DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  
  -- SEO
  meta_title TEXT,
  meta_description TEXT,
  canonical_url TEXT,
  
  -- Stats
  view_count INTEGER DEFAULT 0,
  citation_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- REPORT CITATIONS - Sources used in reports
-- ============================================================================
CREATE TABLE public.report_citations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES public.analysis_reports(id) ON DELETE CASCADE,
  
  -- Source identification
  source_name TEXT NOT NULL,
  source_organization TEXT,
  source_url TEXT,
  
  -- Data specifics
  data_type TEXT, -- 'statistic', 'study', 'official_report', 'dataset'
  indicator_code TEXT,
  
  -- Extracted value
  cited_value TEXT,
  cited_date DATE,
  
  -- Reliability
  reliability_score NUMERIC(3,2) CHECK (reliability_score >= 0 AND reliability_score <= 1),
  
  -- Position in report
  citation_order INTEGER,
  
  -- Verification
  last_verified_at TIMESTAMPTZ,
  is_verified BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- REPORT GENERATION QUEUE
-- ============================================================================
CREATE TABLE public.report_generation_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  question_id UUID REFERENCES public.report_questions(id) ON DELETE CASCADE,
  
  -- Generation parameters
  geo_code TEXT,
  time_period TEXT,
  priority INTEGER DEFAULT 5,
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  error_message TEXT,
  
  -- Result
  report_id UUID REFERENCES public.analysis_reports(id),
  
  -- Timing
  queued_at TIMESTAMPTZ DEFAULT now(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX idx_report_questions_slug ON public.report_questions(slug);
CREATE INDEX idx_report_questions_category ON public.report_questions(category);
CREATE INDEX idx_report_questions_geo ON public.report_questions(geo_level, geo_code);
CREATE INDEX idx_report_questions_active ON public.report_questions(is_active, priority_rank);

CREATE INDEX idx_analysis_reports_slug ON public.analysis_reports(slug);
CREATE INDEX idx_analysis_reports_question ON public.analysis_reports(question_id);
CREATE INDEX idx_analysis_reports_status ON public.analysis_reports(status);
CREATE INDEX idx_analysis_reports_published ON public.analysis_reports(published_at) WHERE status = 'published';

CREATE INDEX idx_report_citations_report ON public.report_citations(report_id);
CREATE INDEX idx_report_citations_source ON public.report_citations(source_name);

CREATE INDEX idx_generation_queue_status ON public.report_generation_queue(status, priority);

-- ============================================================================
-- RLS POLICIES
-- ============================================================================
ALTER TABLE public.report_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_citations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_generation_queue ENABLE ROW LEVEL SECURITY;

-- Public read access for published content
CREATE POLICY "Public can view active questions"
  ON public.report_questions FOR SELECT
  USING (is_active = true);

CREATE POLICY "Public can view published reports"
  ON public.analysis_reports FOR SELECT
  USING (status = 'published');

CREATE POLICY "Public can view report citations"
  ON public.report_citations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.analysis_reports
      WHERE id = report_citations.report_id
      AND status = 'published'
    )
  );

-- Admin full access (researchers and above)
CREATE POLICY "Researchers can manage questions"
  ON public.report_questions FOR ALL
  USING (public.has_any_role(auth.uid(), ARRAY['researcher', 'system_admin', 'statsminister']::app_role[]));

CREATE POLICY "Researchers can manage reports"
  ON public.analysis_reports FOR ALL
  USING (public.has_any_role(auth.uid(), ARRAY['researcher', 'system_admin', 'statsminister']::app_role[]));

CREATE POLICY "Researchers can manage citations"
  ON public.report_citations FOR ALL
  USING (public.has_any_role(auth.uid(), ARRAY['researcher', 'system_admin', 'statsminister']::app_role[]));

CREATE POLICY "System can manage queue"
  ON public.report_generation_queue FOR ALL
  USING (public.has_any_role(auth.uid(), ARRAY['system_admin', 'statsminister']::app_role[]));

-- ============================================================================
-- TRIGGERS
-- ============================================================================
CREATE TRIGGER update_report_questions_updated_at
  BEFORE UPDATE ON public.report_questions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_analysis_reports_updated_at
  BEFORE UPDATE ON public.analysis_reports
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to increment view count
CREATE OR REPLACE FUNCTION public.increment_report_view(p_report_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE public.analysis_reports
  SET view_count = view_count + 1
  WHERE id = p_report_id;
END;
$$;

-- Function to get report by slug with citations
CREATE OR REPLACE FUNCTION public.get_report_with_citations(p_slug TEXT)
RETURNS TABLE (
  report JSONB,
  citations JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    to_jsonb(r.*) as report,
    COALESCE(
      jsonb_agg(
        to_jsonb(c.*) ORDER BY c.citation_order
      ) FILTER (WHERE c.id IS NOT NULL),
      '[]'::jsonb
    ) as citations
  FROM public.analysis_reports r
  LEFT JOIN public.report_citations c ON c.report_id = r.id
  WHERE r.slug = p_slug
    AND r.status = 'published'
  GROUP BY r.id;
END;
$$;