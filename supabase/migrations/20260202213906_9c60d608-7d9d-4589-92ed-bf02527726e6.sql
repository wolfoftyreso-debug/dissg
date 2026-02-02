-- AI & Compliance Guardrails Schema
-- Core infrastructure for maintaining platform as reference, not advisor

-- Scope Declarations for all datasets/views
CREATE TABLE public.scope_declarations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL, -- 'dataset', 'view', 'report', 'indicator'
  entity_id TEXT NOT NULL,
  entity_name TEXT NOT NULL,
  
  -- What this covers
  covers TEXT[] NOT NULL DEFAULT '{}',
  does_not_cover TEXT[] NOT NULL DEFAULT '{}',
  valid_comparisons TEXT[] NOT NULL DEFAULT '{}',
  invalid_uses TEXT[] NOT NULL DEFAULT '{}',
  
  -- Confidence and limitations
  confidence_level TEXT NOT NULL DEFAULT 'medium', -- 'high', 'medium', 'low', 'experimental'
  confidence_rationale TEXT,
  temporal_validity_start DATE,
  temporal_validity_end DATE,
  geographic_scope TEXT[] NOT NULL DEFAULT '{}',
  
  -- AI instructions
  ai_must_cite BOOLEAN NOT NULL DEFAULT true,
  ai_blocked_actions TEXT[] NOT NULL DEFAULT ARRAY['recommend', 'advise', 'predict', 'prescribe'],
  ai_required_disclaimers TEXT[] NOT NULL DEFAULT '{}',
  
  -- Metadata
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  UNIQUE(entity_type, entity_id)
);

-- Blocked query patterns (what the system refuses to answer)
CREATE TABLE public.blocked_query_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pattern_type TEXT NOT NULL, -- 'advice', 'recommendation', 'prediction', 'medical', 'individual'
  pattern_regex TEXT NOT NULL,
  pattern_keywords TEXT[] NOT NULL DEFAULT '{}',
  
  -- Response when blocked
  block_response_template TEXT NOT NULL,
  redirect_suggestion TEXT,
  
  -- Categorization
  severity TEXT NOT NULL DEFAULT 'block', -- 'block', 'warn', 'log'
  category TEXT NOT NULL, -- 'medical', 'policy', 'individual', 'predictive'
  
  -- Metadata
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- API usage logging (all access is traceable)
CREATE TABLE public.api_compliance_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Request info
  api_key_id UUID REFERENCES public.api_keys(id),
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  
  -- Scope acceptance
  scope_declaration_id UUID REFERENCES public.scope_declarations(id),
  scope_accepted BOOLEAN NOT NULL DEFAULT false,
  usage_declaration TEXT,
  
  -- Compliance checks
  query_blocked BOOLEAN NOT NULL DEFAULT false,
  block_reason TEXT,
  warnings_issued TEXT[] NOT NULL DEFAULT '{}',
  
  -- Request/response metadata
  request_hash TEXT, -- SHA-256 of request for audit
  response_included_disclaimers BOOLEAN NOT NULL DEFAULT false,
  
  -- Tracking
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- AI response templates (standardized safe responses)
CREATE TABLE public.ai_response_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_code TEXT UNIQUE NOT NULL,
  template_name TEXT NOT NULL,
  
  -- Template content
  template_text TEXT NOT NULL,
  required_placeholders TEXT[] NOT NULL DEFAULT '{}',
  
  -- Usage rules
  use_when TEXT[] NOT NULL DEFAULT '{}', -- conditions
  never_use_when TEXT[] NOT NULL DEFAULT '{}',
  
  -- Localization
  translations JSONB NOT NULL DEFAULT '{}',
  
  -- Metadata
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Legal classification declarations
CREATE TABLE public.legal_classifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  jurisdiction TEXT NOT NULL, -- 'EU', 'US', 'GLOBAL', 'WHO', etc.
  
  -- Classification
  platform_classification TEXT NOT NULL, -- 'information_service', 'statistical_reference', 'educational'
  not_classified_as TEXT[] NOT NULL DEFAULT ARRAY['medical_device', 'clinical_tool', 'decision_support_system', 'policy_advisory'],
  
  -- Required disclaimers for this jurisdiction
  required_disclaimers TEXT[] NOT NULL DEFAULT '{}',
  
  -- Regulatory references
  regulatory_framework TEXT,
  compliance_notes TEXT,
  
  -- Metadata
  effective_date DATE NOT NULL DEFAULT CURRENT_DATE,
  review_date DATE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ethics constraints (hard-coded into system)
CREATE TABLE public.ethics_constraints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  constraint_code TEXT UNIQUE NOT NULL,
  constraint_name TEXT NOT NULL,
  constraint_description TEXT NOT NULL,
  
  -- What this prevents
  prevents TEXT[] NOT NULL DEFAULT '{}',
  
  -- Technical enforcement
  enforcement_type TEXT NOT NULL, -- 'block', 'aggregate', 'anonymize', 'warn'
  minimum_group_size INTEGER, -- for aggregation constraints
  
  -- Metadata
  rationale TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Misuse detection log
CREATE TABLE public.misuse_detection_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Detection info
  detection_type TEXT NOT NULL, -- 'campaign_use', 'data_harvesting', 'context_stripping', 'selective_citation'
  severity TEXT NOT NULL DEFAULT 'warning', -- 'info', 'warning', 'critical'
  
  -- Evidence
  evidence_summary TEXT NOT NULL,
  api_log_ids UUID[] NOT NULL DEFAULT '{}',
  
  -- Action taken
  action_taken TEXT, -- 'flagged', 'rate_limited', 'blocked', 'reported'
  
  -- Tracking
  detected_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at TIMESTAMPTZ,
  resolution_notes TEXT
);

-- Insert default blocked query patterns
INSERT INTO public.blocked_query_patterns (pattern_type, pattern_regex, pattern_keywords, block_response_template, category, severity) VALUES
-- Medical advice patterns
('medical', '(what|which) (should|do) (i|we|you) (take|use|try)', 
 ARRAY['should I take', 'what medicine', 'which treatment', 'best cure', 'how to treat'],
 'This platform does not provide medical advice. It shows observed population-level health data. For personal health decisions, consult licensed healthcare professionals.',
 'medical', 'block'),

-- Policy recommendation patterns  
('recommendation', '(what|which) (policy|approach|strategy) (is|would be) (best|better|optimal)',
 ARRAY['best policy', 'should implement', 'recommend', 'which approach', 'optimal strategy'],
 'This platform does not provide policy recommendations. It presents observed outcomes from historical policy periods. Policy decisions require context beyond this data.',
 'policy', 'block'),

-- Individual prediction patterns
('individual', '(what|how) (will|would) (happen|change) (to|for) (me|my|individual)',
 ARRAY['will I', 'my risk', 'predict for me', 'my chances', 'individual outcome'],
 'This platform does not provide individual predictions or risk assessments. All data is aggregated at population level. For individual guidance, consult relevant professionals.',
 'individual', 'block'),

-- Causation claims
('prediction', '(will|would|going to) (cause|lead to|result in|create)',
 ARRAY['will cause', 'going to lead', 'would result', 'future impact'],
 'This platform does not make causal claims or predictions. It shows observed correlations and historical patterns. Causation requires controlled studies beyond observational data.',
 'predictive', 'warn'),

-- Normative judgments
('advice', '(is it|would it be) (good|bad|better|worse|right|wrong)',
 ARRAY['is it good', 'would be better', 'right thing', 'wrong approach'],
 'This platform does not make normative judgments. It presents observed data without value assessments. Interpretation and evaluation lie outside this system.',
 'policy', 'block');

-- Insert default AI response templates
INSERT INTO public.ai_response_templates (template_code, template_name, template_text, required_placeholders, use_when) VALUES
('OBSERVATION_STANDARD', 'Standard Observation Response',
 'Observed data from the Truth Layer show {{observation}} under {{conditions}}. The data do not establish causation or recommendations. Source: {{source}}. Confidence: {{confidence}}.',
 ARRAY['observation', 'conditions', 'source', 'confidence'],
 ARRAY['general_query', 'data_request']),

('COMPARISON_STANDARD', 'Standard Comparison Response',
 'Comparison of {{entity_a}} and {{entity_b}} during {{period}}: {{observation}}. This comparison is observational only and does not imply that one approach is preferable. Limitations: {{limitations}}.',
 ARRAY['entity_a', 'entity_b', 'period', 'observation', 'limitations'],
 ARRAY['comparison_query']),

('TREND_STANDARD', 'Standard Trend Response',
 'During {{period}}, {{metric}} showed {{direction}} of {{magnitude}}. This observation does not predict future trends or establish causation. Context: {{context}}.',
 ARRAY['period', 'metric', 'direction', 'magnitude', 'context'],
 ARRAY['trend_query']),

('BLOCKED_QUERY', 'Blocked Query Response',
 'This query requests {{blocked_type}}, which is outside the scope of this platform. This platform provides: observational data, historical patterns, and population-level statistics. It does not provide: {{not_provided}}.',
 ARRAY['blocked_type', 'not_provided'],
 ARRAY['blocked_query']),

('SCOPE_CITATION', 'Scope Citation',
 'Data scope: {{scope_name}}. Covers: {{covers}}. Does not cover: {{does_not_cover}}. Valid for: {{geographic_scope}}, {{temporal_scope}}.',
 ARRAY['scope_name', 'covers', 'does_not_cover', 'geographic_scope', 'temporal_scope'],
 ARRAY['always']);

-- Insert default legal classifications
INSERT INTO public.legal_classifications (jurisdiction, platform_classification, not_classified_as, required_disclaimers, regulatory_framework) VALUES
('EU', 'information_service', 
 ARRAY['medical_device', 'clinical_decision_support', 'AI_system_high_risk', 'policy_advisory_service'],
 ARRAY['This platform does not provide medical advice', 'All data is observational and population-level', 'For personal decisions, consult licensed professionals'],
 'GDPR, EU AI Act (information service exemption), MDR (not a medical device)'),

('US', 'statistical_reference',
 ARRAY['medical_device', 'clinical_tool', 'covered_entity_HIPAA', 'investment_advice'],
 ARRAY['This platform does not provide medical advice', 'Not intended for clinical use', 'Educational and research purposes only'],
 'FDA (not a medical device), HIPAA (no individual health data), SEC (not financial advice)'),

('GLOBAL', 'educational_research',
 ARRAY['medical_device', 'clinical_tool', 'decision_support_system', 'policy_advisory_service'],
 ARRAY['This platform does not provide medical advice', 'All data is aggregated and anonymized', 'Not intended for individual decision-making'],
 'WHO standards, OECD data principles, UN statistical guidelines');

-- Insert default ethics constraints
INSERT INTO public.ethics_constraints (constraint_code, constraint_name, constraint_description, prevents, enforcement_type, minimum_group_size, rationale) VALUES
('NO_INDIVIDUAL', 'No Individual Data',
 'System never displays or processes individual-level data',
 ARRAY['individual identification', 'personal health records', 'named individuals'],
 'block', NULL,
 'Individual data would enable harm, identification, and misuse. Population aggregates serve the platform purpose.'),

('MIN_GROUP_SIZE', 'Minimum Group Size',
 'Aggregated data requires minimum group size to prevent identification',
 ARRAY['small group identification', 'rare condition exposure', 'geographic re-identification'],
 'aggregate', 100,
 'Small groups can be identified through cross-referencing. Minimum size prevents statistical disclosure.'),

('NO_PREDICTIVE_PROFILES', 'No Predictive Profiles',
 'System does not create or display predictive profiles for individuals or groups',
 ARRAY['risk scores', 'future behavior prediction', 'propensity modeling'],
 'block', NULL,
 'Predictive profiles enable discrimination and manipulation. Historical observation is the limit.'),

('NO_REAL_TIME', 'No Real-Time Surveillance',
 'System does not process or display real-time individual tracking',
 ARRAY['real-time location', 'live behavior tracking', 'immediate alerts on individuals'],
 'block', NULL,
 'Real-time tracking enables surveillance and control. Historical aggregates serve transparency.'),

('CONTEXT_REQUIRED', 'Context Always Required',
 'No data point displayed without accompanying context',
 ARRAY['context-free statistics', 'isolated numbers', 'unexplained comparisons'],
 'warn', NULL,
 'Context-free data enables misinterpretation and cherry-picking. Mandatory context prevents misuse.');

-- Enable RLS with public read
ALTER TABLE public.scope_declarations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_query_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_compliance_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_response_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_classifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ethics_constraints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.misuse_detection_log ENABLE ROW LEVEL SECURITY;

-- Public read for reference tables
CREATE POLICY "Public read scope declarations" ON public.scope_declarations FOR SELECT USING (true);
CREATE POLICY "Public read blocked patterns" ON public.blocked_query_patterns FOR SELECT USING (true);
CREATE POLICY "Public read AI templates" ON public.ai_response_templates FOR SELECT USING (true);
CREATE POLICY "Public read legal classifications" ON public.legal_classifications FOR SELECT USING (true);
CREATE POLICY "Public read ethics constraints" ON public.ethics_constraints FOR SELECT USING (true);

-- Restricted access for logs
CREATE POLICY "Authenticated read compliance log" ON public.api_compliance_log FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read misuse log" ON public.misuse_detection_log FOR SELECT TO authenticated USING (true);

-- Create indexes for performance
CREATE INDEX idx_scope_declarations_entity ON public.scope_declarations(entity_type, entity_id);
CREATE INDEX idx_blocked_patterns_active ON public.blocked_query_patterns(is_active, category);
CREATE INDEX idx_compliance_log_created ON public.api_compliance_log(created_at DESC);
CREATE INDEX idx_misuse_log_detected ON public.misuse_detection_log(detected_at DESC);