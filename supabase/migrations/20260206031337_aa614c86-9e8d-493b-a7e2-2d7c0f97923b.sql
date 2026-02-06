-- AI-FIRST ARCHITECTURE: TEFLON ENTRY SYSTEM
-- Canonical Question Object (CQO) + Provenance Layer

-- Add CQO fields to global_index_questions
ALTER TABLE global_index_questions
ADD COLUMN IF NOT EXISTS canonical_answer_id UUID,
ADD COLUMN IF NOT EXISTS methodology_pointer TEXT,
ADD COLUMN IF NOT EXISTS definition_pointers TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS source_pointers TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS certainty_level TEXT DEFAULT 'medium' CHECK (certainty_level IN ('very_high', 'high', 'medium', 'low', 'uncertain')),
ADD COLUMN IF NOT EXISTS last_verified_at TIMESTAMPTZ DEFAULT now(),
ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'verified' CHECK (verification_status IN ('verified', 'pending', 'stale', 'disputed')),
ADD COLUMN IF NOT EXISTS token_cost_estimate INTEGER DEFAULT 100,
ADD COLUMN IF NOT EXISTS retrieval_priority INTEGER DEFAULT 50;

-- Create canonical_answers table (the answer blobs AI agents consume)
CREATE TABLE IF NOT EXISTS canonical_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID REFERENCES global_index_questions(id) ON DELETE CASCADE,
  
  -- The canonical answer (5-10 lines, never varies)
  answer_blob TEXT NOT NULL,
  answer_format TEXT DEFAULT 'structured' CHECK (answer_format IN ('structured', 'narrative', 'table', 'time_series')),
  
  -- Machine-readable summary (for vector embedding)
  summary_for_embedding TEXT NOT NULL,
  
  -- Structured data (JSON for direct consumption)
  structured_data JSONB DEFAULT '{}',
  
  -- Methodology section (separate, not in answer)
  methodology_text TEXT,
  methodology_version TEXT DEFAULT 'v1',
  
  -- Temporal validity
  valid_from DATE NOT NULL,
  valid_until DATE,
  is_current BOOLEAN DEFAULT true,
  
  -- Provenance
  primary_source TEXT NOT NULL,
  source_dataset_ids TEXT[] DEFAULT '{}',
  retrieved_at TIMESTAMPTZ DEFAULT now(),
  
  -- Quality signals
  confidence_score NUMERIC(3,2) DEFAULT 0.80,
  data_completeness NUMERIC(3,2) DEFAULT 1.00,
  last_verified_at TIMESTAMPTZ DEFAULT now(),
  verification_note TEXT DEFAULT 'Verified – no change',
  
  -- Version control
  version INTEGER DEFAULT 1,
  previous_version_id UUID,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create data_provenance table (per-value tracking)
CREATE TABLE IF NOT EXISTS data_provenance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  answer_id UUID REFERENCES canonical_answers(id) ON DELETE CASCADE,
  
  -- The actual value
  value NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  
  -- Source tracking
  source_org TEXT NOT NULL,
  source_dataset_id TEXT NOT NULL,
  source_url TEXT,
  
  -- Temporal
  retrieved_at TIMESTAMPTZ DEFAULT now(),
  valid_for_period TEXT NOT NULL, -- e.g., '2023', '2024-Q1'
  
  -- Quality
  confidence TEXT DEFAULT 'high' CHECK (confidence IN ('very_high', 'high', 'medium', 'low', 'estimated')),
  is_preliminary BOOLEAN DEFAULT false,
  revision_number INTEGER DEFAULT 1,
  
  -- Geographic
  geo_code TEXT,
  geo_level TEXT,
  
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create question_embeddings table (vector layer entry point)
CREATE TABLE IF NOT EXISTS question_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID REFERENCES global_index_questions(id) ON DELETE CASCADE UNIQUE,
  
  -- Embedding vector (for pgvector if enabled)
  embedding_model TEXT DEFAULT 'text-embedding-3-small',
  embedding_text TEXT NOT NULL, -- The text that was embedded
  embedding_checksum TEXT, -- To detect if re-embedding needed
  
  -- Retrieval optimization
  retrieval_score NUMERIC(4,2) DEFAULT 0.00,
  hit_count INTEGER DEFAULT 0,
  last_retrieved_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for AI retrieval optimization
CREATE INDEX IF NOT EXISTS idx_answers_current ON canonical_answers(is_current) WHERE is_current = true;
CREATE INDEX IF NOT EXISTS idx_answers_confidence ON canonical_answers(confidence_score DESC);
CREATE INDEX IF NOT EXISTS idx_questions_verified ON global_index_questions(last_verified_at DESC);
CREATE INDEX IF NOT EXISTS idx_questions_retrieval ON global_index_questions(retrieval_priority DESC);
CREATE INDEX IF NOT EXISTS idx_provenance_source ON data_provenance(source_org, source_dataset_id);

-- Add foreign key for canonical_answer
ALTER TABLE global_index_questions 
ADD CONSTRAINT fk_canonical_answer 
FOREIGN KEY (canonical_answer_id) REFERENCES canonical_answers(id);

-- Enable RLS
ALTER TABLE canonical_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_provenance ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_embeddings ENABLE ROW LEVEL SECURITY;

-- Public read access (AI agents need this)
CREATE POLICY "Public read canonical_answers" ON canonical_answers FOR SELECT USING (true);
CREATE POLICY "Public read data_provenance" ON data_provenance FOR SELECT USING (true);
CREATE POLICY "Public read question_embeddings" ON question_embeddings FOR SELECT USING (true);