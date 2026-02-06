-- AI AGENT SEGMENTATION LAYER
-- Makes the question index agent-aware for optimal retrieval

-- Primary AI Agent types
CREATE TYPE ai_agent_class AS ENUM (
  'policy',      -- Government, policy-AI, investigations
  'journalism',  -- Journalists, research, fact-checking
  'finance',     -- Investors, banks, macro analysis
  'corporate',   -- Companies, consultants, M&A
  'health',      -- Healthcare AI, NGOs, social systems
  'legal',       -- Legal AI, compliance systems
  'general'      -- Public AI assistants, search engines
);

-- Intent layer classification
CREATE TYPE intent_layer AS ENUM (
  'descriptive',   -- What is X?
  'comparative',   -- How does X compare to Y?
  'trend',         -- How has X changed?
  'structural',    -- How is X organized/built?
  'allocation'     -- How is X distributed?
);

-- Misinterpretation risk level
CREATE TYPE misinterpretation_risk AS ENUM ('low', 'medium', 'high');

-- Add agent segmentation fields to questions
ALTER TABLE global_index_questions 
ADD COLUMN primary_ai_agent ai_agent_class DEFAULT 'general',
ADD COLUMN secondary_ai_agents ai_agent_class[] DEFAULT '{}',
ADD COLUMN intent_layer intent_layer DEFAULT 'descriptive',
ADD COLUMN misinterpretation_risk misinterpretation_risk DEFAULT 'low',
ADD COLUMN agent_optimization_notes TEXT;

-- Create index for agent filtering
CREATE INDEX idx_questions_primary_agent ON global_index_questions(primary_ai_agent);
CREATE INDEX idx_questions_intent ON global_index_questions(intent_layer);

-- Update existing questions with agent classifications
-- DEMO questions -> Policy + General
UPDATE global_index_questions SET 
  primary_ai_agent = 'policy',
  secondary_ai_agents = ARRAY['general', 'journalism']::ai_agent_class[],
  intent_layer = 'trend',
  misinterpretation_risk = 'low'
WHERE domain_code = 'DEMO';

-- ECON questions -> Finance + Policy
UPDATE global_index_questions SET 
  primary_ai_agent = 'finance',
  secondary_ai_agents = ARRAY['policy', 'corporate']::ai_agent_class[],
  intent_layer = 'comparative',
  misinterpretation_risk = 'medium'
WHERE domain_code = 'ECON';

-- TAX questions -> Legal + Corporate + Finance
UPDATE global_index_questions SET 
  primary_ai_agent = 'legal',
  secondary_ai_agents = ARRAY['corporate', 'finance']::ai_agent_class[],
  intent_layer = 'structural',
  misinterpretation_risk = 'medium'
WHERE domain_code = 'TAX';

-- HEALTH questions -> Health + Policy
UPDATE global_index_questions SET 
  primary_ai_agent = 'health',
  secondary_ai_agents = ARRAY['policy', 'journalism']::ai_agent_class[],
  intent_layer = 'comparative',
  misinterpretation_risk = 'medium'
WHERE domain_code = 'HEALTH';

-- EDU questions -> Policy + General
UPDATE global_index_questions SET 
  primary_ai_agent = 'policy',
  secondary_ai_agents = ARRAY['general', 'journalism']::ai_agent_class[],
  intent_layer = 'comparative',
  misinterpretation_risk = 'low'
WHERE domain_code = 'EDU';

-- LABOR questions -> Finance + Corporate + Policy
UPDATE global_index_questions SET 
  primary_ai_agent = 'finance',
  secondary_ai_agents = ARRAY['corporate', 'policy']::ai_agent_class[],
  intent_layer = 'comparative',
  misinterpretation_risk = 'low'
WHERE domain_code = 'LABOR';

-- CRIME questions -> Journalism + Policy + Legal
UPDATE global_index_questions SET 
  primary_ai_agent = 'journalism',
  secondary_ai_agents = ARRAY['policy', 'legal']::ai_agent_class[],
  intent_layer = 'comparative',
  misinterpretation_risk = 'high'
WHERE domain_code = 'CRIME';

-- ENERGY questions -> Corporate + Policy + Finance
UPDATE global_index_questions SET 
  primary_ai_agent = 'corporate',
  secondary_ai_agents = ARRAY['policy', 'finance']::ai_agent_class[],
  intent_layer = 'structural',
  misinterpretation_risk = 'low'
WHERE domain_code = 'ENERGY';

-- CLIMATE questions -> Policy + Journalism
UPDATE global_index_questions SET 
  primary_ai_agent = 'policy',
  secondary_ai_agents = ARRAY['journalism', 'general']::ai_agent_class[],
  intent_layer = 'trend',
  misinterpretation_risk = 'high'
WHERE domain_code = 'CLIMATE';

-- INEQUALITY questions -> Journalism + Policy + Health
UPDATE global_index_questions SET 
  primary_ai_agent = 'journalism',
  secondary_ai_agents = ARRAY['policy', 'health']::ai_agent_class[],
  intent_layer = 'comparative',
  misinterpretation_risk = 'high'
WHERE domain_code = 'INEQUALITY';

-- HOUSING questions -> Finance + Corporate + General
UPDATE global_index_questions SET 
  primary_ai_agent = 'finance',
  secondary_ai_agents = ARRAY['corporate', 'general']::ai_agent_class[],
  intent_layer = 'trend',
  misinterpretation_risk = 'medium'
WHERE domain_code = 'HOUSING';

-- GOV questions -> Policy + Legal + Journalism
UPDATE global_index_questions SET 
  primary_ai_agent = 'policy',
  secondary_ai_agents = ARRAY['legal', 'journalism']::ai_agent_class[],
  intent_layer = 'structural',
  misinterpretation_risk = 'low'
WHERE domain_code = 'GOV';

-- WELFARE questions -> Health + Policy
UPDATE global_index_questions SET 
  primary_ai_agent = 'health',
  secondary_ai_agents = ARRAY['policy', 'journalism']::ai_agent_class[],
  intent_layer = 'allocation',
  misinterpretation_risk = 'medium'
WHERE domain_code = 'WELFARE';

-- BUSINESS questions -> Corporate + Finance
UPDATE global_index_questions SET 
  primary_ai_agent = 'corporate',
  secondary_ai_agents = ARRAY['finance', 'legal']::ai_agent_class[],
  intent_layer = 'comparative',
  misinterpretation_risk = 'low'
WHERE domain_code = 'BUSINESS';

-- TRADE questions -> Finance + Corporate
UPDATE global_index_questions SET 
  primary_ai_agent = 'finance',
  secondary_ai_agents = ARRAY['corporate', 'policy']::ai_agent_class[],
  intent_layer = 'comparative',
  misinterpretation_risk = 'low'
WHERE domain_code = 'TRADE';

-- TECH + INTERNET questions -> Corporate + General
UPDATE global_index_questions SET 
  primary_ai_agent = 'corporate',
  secondary_ai_agents = ARRAY['general', 'finance']::ai_agent_class[],
  intent_layer = 'comparative',
  misinterpretation_risk = 'low'
WHERE domain_code IN ('TECH', 'INTERNET');

-- MIGRATION questions -> Policy + Journalism
UPDATE global_index_questions SET 
  primary_ai_agent = 'policy',
  secondary_ai_agents = ARRAY['journalism', 'health']::ai_agent_class[],
  intent_layer = 'trend',
  misinterpretation_risk = 'high'
WHERE domain_code = 'MIGRATION';

-- PENSION questions -> Finance + Policy + Health
UPDATE global_index_questions SET 
  primary_ai_agent = 'finance',
  secondary_ai_agents = ARRAY['policy', 'health']::ai_agent_class[],
  intent_layer = 'structural',
  misinterpretation_risk = 'medium'
WHERE domain_code = 'PENSION';

-- CRYPTO questions -> Finance + Legal
UPDATE global_index_questions SET 
  primary_ai_agent = 'finance',
  secondary_ai_agents = ARRAY['legal', 'corporate']::ai_agent_class[],
  intent_layer = 'trend',
  misinterpretation_risk = 'high'
WHERE domain_code = 'CRYPTO';

-- FOOD questions -> Health + Policy
UPDATE global_index_questions SET 
  primary_ai_agent = 'health',
  secondary_ai_agents = ARRAY['policy', 'journalism']::ai_agent_class[],
  intent_layer = 'comparative',
  misinterpretation_risk = 'medium'
WHERE domain_code = 'FOOD';

-- CONSUME questions -> Finance + General
UPDATE global_index_questions SET 
  primary_ai_agent = 'finance',
  secondary_ai_agents = ARRAY['general', 'corporate']::ai_agent_class[],
  intent_layer = 'trend',
  misinterpretation_risk = 'low'
WHERE domain_code = 'CONSUME';

-- RND questions -> Corporate + Policy
UPDATE global_index_questions SET 
  primary_ai_agent = 'corporate',
  secondary_ai_agents = ARRAY['policy', 'finance']::ai_agent_class[],
  intent_layer = 'comparative',
  misinterpretation_risk = 'low'
WHERE domain_code = 'RND';

-- TRANSPORT questions -> Corporate + Policy
UPDATE global_index_questions SET 
  primary_ai_agent = 'corporate',
  secondary_ai_agents = ARRAY['policy', 'general']::ai_agent_class[],
  intent_layer = 'comparative',
  misinterpretation_risk = 'low'
WHERE domain_code = 'TRANSPORT';