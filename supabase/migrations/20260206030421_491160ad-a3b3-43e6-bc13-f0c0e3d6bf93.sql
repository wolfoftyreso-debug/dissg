-- GLOBAL INDEX QUESTION LIBRARY
-- Machine-readable, AI-optimized question registry

-- Question scope enum
CREATE TYPE question_scope AS ENUM ('global', 'regional', 'national', 'municipal');

-- Time dimension enum  
CREATE TYPE time_dimension AS ENUM ('realtime', 'daily', 'weekly', 'monthly', 'quarterly', 'yearly', 'historical');

-- Answer type enum
CREATE TYPE answer_type AS ENUM ('statistic', 'index', 'comparison', 'ranking', 'trend', 'correlation', 'distribution', 'aggregate');

-- Update frequency enum
CREATE TYPE question_update_frequency AS ENUM ('realtime', 'daily', 'weekly', 'monthly', 'quarterly', 'yearly', 'event_based');

-- Data quality grade
CREATE TYPE data_quality_grade AS ENUM ('A', 'B', 'C', 'D', 'unverified');

-- Domain registry - 30 core domains
CREATE TABLE global_question_domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name_en TEXT NOT NULL,
  name_sv TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  parent_domain_code TEXT REFERENCES global_question_domains(code),
  sort_order INT DEFAULT 0,
  question_count INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Subdomain registry
CREATE TABLE global_question_subdomains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  domain_code TEXT NOT NULL REFERENCES global_question_domains(code),
  name_en TEXT NOT NULL,
  name_sv TEXT NOT NULL,
  description TEXT,
  question_count INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Primary data source types
CREATE TABLE data_source_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name_en TEXT NOT NULL,
  name_sv TEXT NOT NULL,
  description TEXT,
  reliability_default data_quality_grade DEFAULT 'B',
  examples TEXT[],
  created_at TIMESTAMPTZ DEFAULT now()
);

-- MAIN QUESTION TABLE - The global index
CREATE TABLE global_index_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id TEXT UNIQUE NOT NULL,
  
  -- Question content (multilingual)
  question_en TEXT NOT NULL,
  question_sv TEXT NOT NULL,
  question_variants TEXT[] DEFAULT '{}',
  
  -- Classification
  domain_code TEXT NOT NULL REFERENCES global_question_domains(code),
  subdomain_code TEXT REFERENCES global_question_subdomains(code),
  scope question_scope NOT NULL DEFAULT 'global',
  time_dimension time_dimension NOT NULL DEFAULT 'yearly',
  answer_type answer_type NOT NULL DEFAULT 'statistic',
  update_frequency question_update_frequency DEFAULT 'yearly',
  
  -- Data sourcing
  primary_source_types TEXT[] NOT NULL DEFAULT '{}',
  data_quality data_quality_grade DEFAULT 'B',
  data_coverage_percent NUMERIC(5,2) DEFAULT 0,
  
  -- Cross-referencing
  cross_reference_domains TEXT[] DEFAULT '{}',
  related_question_ids TEXT[] DEFAULT '{}',
  parent_question_id TEXT REFERENCES global_index_questions(question_id),
  
  -- AI/Search optimization
  ai_retrieval_tags TEXT[] NOT NULL DEFAULT '{}',
  search_volume_estimate INT DEFAULT 0,
  seo_priority INT DEFAULT 50,
  
  -- Metadata
  is_answerable BOOLEAN DEFAULT true,
  is_published BOOLEAN DEFAULT false,
  last_answered_at TIMESTAMPTZ,
  answer_count INT DEFAULT 0,
  view_count INT DEFAULT 0,
  
  -- Audit
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by TEXT DEFAULT 'system',
  version INT DEFAULT 1
);

-- Question answers (cached/generated)
CREATE TABLE global_index_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id TEXT NOT NULL REFERENCES global_index_questions(question_id),
  
  -- Scope of this answer
  geo_scope TEXT NOT NULL DEFAULT 'GLOBAL',
  time_period_start DATE,
  time_period_end DATE,
  
  -- Answer content (A2F format)
  summary TEXT NOT NULL,
  mechanisms TEXT,
  timeline JSONB,
  comparison JSONB,
  uncertainty TEXT,
  deep_dive_links TEXT[],
  
  -- Raw data
  data_points JSONB NOT NULL DEFAULT '[]',
  aggregation_method TEXT,
  
  -- Sources
  citations JSONB NOT NULL DEFAULT '[]',
  source_checksums TEXT[],
  
  -- Quality
  confidence_score NUMERIC(3,2) DEFAULT 0.8,
  data_quality data_quality_grade DEFAULT 'B',
  is_current BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ,
  
  -- Generation
  generated_at TIMESTAMPTZ DEFAULT now(),
  generated_by TEXT DEFAULT 'system',
  model_used TEXT,
  generation_prompt_hash TEXT,
  
  -- Audit
  view_count INT DEFAULT 0,
  citation_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(question_id, geo_scope, time_period_start, time_period_end)
);

-- Indexes for performance
CREATE INDEX idx_questions_domain ON global_index_questions(domain_code);
CREATE INDEX idx_questions_subdomain ON global_index_questions(subdomain_code);
CREATE INDEX idx_questions_scope ON global_index_questions(scope);
CREATE INDEX idx_questions_published ON global_index_questions(is_published) WHERE is_published = true;
CREATE INDEX idx_questions_tags ON global_index_questions USING GIN(ai_retrieval_tags);
CREATE INDEX idx_questions_search ON global_index_questions USING GIN(to_tsvector('english', question_en));
CREATE INDEX idx_answers_question ON global_index_answers(question_id);
CREATE INDEX idx_answers_geo ON global_index_answers(geo_scope);

-- RLS policies
ALTER TABLE global_question_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE global_question_subdomains ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_source_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE global_index_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE global_index_answers ENABLE ROW LEVEL SECURITY;

-- Public read access for all reference data
CREATE POLICY "Public read domains" ON global_question_domains FOR SELECT USING (true);
CREATE POLICY "Public read subdomains" ON global_question_subdomains FOR SELECT USING (true);
CREATE POLICY "Public read source types" ON data_source_types FOR SELECT USING (true);
CREATE POLICY "Public read published questions" ON global_index_questions FOR SELECT USING (is_published = true);
CREATE POLICY "Public read current answers" ON global_index_answers FOR SELECT USING (is_current = true);

-- Insert 30 core domains
INSERT INTO global_question_domains (code, name_en, name_sv, sort_order, icon) VALUES
('DEMO', 'Demographics & Population', 'Demografi & Befolkning', 1, 'Users'),
('ECON', 'Economy & Financial Systems', 'Ekonomi & Finansiella system', 2, 'TrendingUp'),
('TAX', 'Tax & Public Revenue', 'Skatt & Offentliga intäkter', 3, 'Receipt'),
('HEALTH', 'Health & Healthcare', 'Hälsa & Sjukvård', 4, 'Heart'),
('EDU', 'Education', 'Utbildning', 5, 'GraduationCap'),
('LABOR', 'Labor Market', 'Arbetsmarknad', 6, 'Briefcase'),
('CRIME', 'Crime & Justice System', 'Brott & Rättssystem', 7, 'Scale'),
('ENERGY', 'Energy & Environment', 'Energi & Miljö', 8, 'Zap'),
('HOUSING', 'Housing & Real Estate', 'Boende & Fastigheter', 9, 'Home'),
('TRANSPORT', 'Transport & Infrastructure', 'Transport & Infrastruktur', 10, 'Train'),
('MIGRATION', 'Migration & Citizenship', 'Migration & Medborgarskap', 11, 'Plane'),
('BUSINESS', 'Business & Enterprise', 'Företagande & Näringsliv', 12, 'Building2'),
('TRADE', 'Trade & Import/Export', 'Handel & Import/Export', 13, 'Package'),
('TECH', 'Technology & Digitalization', 'Teknik & Digitalisering', 14, 'Cpu'),
('INTERNET', 'Internet & Platform Economy', 'Internet & Plattformsekonomi', 15, 'Globe'),
('MEDIA', 'Media & Information Flows', 'Media & Informationsflöden', 16, 'Newspaper'),
('GOV', 'Politics & Public Administration', 'Politik & Offentlig förvaltning', 17, 'Landmark'),
('WELFARE', 'Social Insurance & Benefits', 'Socialförsäkringar & Bidrag', 18, 'Shield'),
('PENSION', 'Pensions & Aging', 'Pensioner & Åldrande', 19, 'Clock'),
('INTL', 'International Relations', 'Internationella relationer', 20, 'Flag'),
('CONSUME', 'Consumption & Price Index', 'Konsumtion & Prisindex', 21, 'ShoppingCart'),
('FOOD', 'Food & Agriculture', 'Livsmedel & Jordbruk', 22, 'Wheat'),
('URBAN', 'Housing Market & Urbanization', 'Bostadsmarknad & Urbanisering', 23, 'Building'),
('RELIGION', 'Religion & Communities', 'Religion & Samfund', 24, 'Church'),
('ADDICTION', 'Addiction & Care Systems', 'Missbruk & Vårdsystem', 25, 'HeartPulse'),
('CLIMATE', 'Climate Data & Natural Resources', 'Klimatdata & Naturresurser', 26, 'Cloud'),
('RND', 'Innovation & R&D', 'Innovation & FoU', 27, 'Lightbulb'),
('CRYPTO', 'Digital Currencies & Payment Systems', 'Digitala valutor & Betalningssystem', 28, 'Bitcoin'),
('PROCUREMENT', 'Public Procurement', 'Offentlig upphandling', 29, 'FileText'),
('INEQUALITY', 'Global Inequality & Indices', 'Global ojämlikhet & Index', 30, 'BarChart3');

-- Insert data source types
INSERT INTO data_source_types (code, name_en, name_sv, reliability_default, examples) VALUES
('NSO', 'National Statistical Offices', 'Nationella statistikbyråer', 'A', ARRAY['SCB', 'BLS', 'ONS', 'INSEE']),
('INTL_ORG', 'International Organizations', 'Internationella organisationer', 'A', ARRAY['UN', 'World Bank', 'IMF', 'OECD', 'WHO']),
('CENTRAL_BANK', 'Central Banks', 'Centralbanker', 'A', ARRAY['Fed', 'ECB', 'Riksbanken', 'BoE']),
('GOV_AGENCY', 'Government Agencies', 'Myndigheter', 'A', ARRAY['Ministries', 'Regulatory bodies']),
('REGISTRY', 'Administrative Registers', 'Registerdata', 'A', ARRAY['Population registers', 'Business registers']),
('ACADEMIC', 'Academic Databases', 'Akademiska databaser', 'B', ARRAY['PubMed', 'SSRN', 'RePEc']),
('INDUSTRY', 'Industry Reports', 'Branschrapporter', 'B', ARRAY['Trade associations', 'Market research']),
('OPEN_DATA', 'Open Data Portals', 'Öppen data-portaler', 'B', ARRAY['data.gov', 'EU Open Data']),
('SURVEY', 'Survey Data', 'Enkätdata', 'C', ARRAY['Eurobarometer', 'Gallup']),
('AGGREGATOR', 'Data Aggregators', 'Dataaggrerare', 'B', ARRAY['Our World in Data', 'Gapminder']);