-- ========================================
-- API POLICY & LICENSING SYSTEM
-- ========================================

-- API-nycklar och licenshantering
CREATE TABLE IF NOT EXISTS public.api_keys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  organization_name TEXT,
  key_hash TEXT NOT NULL UNIQUE, -- Hashed API key
  key_prefix TEXT NOT NULL, -- First 8 chars for identification
  license_tier TEXT NOT NULL DEFAULT 'open' CHECK (license_tier IN ('open', 'plus', 'pro', 'enterprise')),
  description TEXT,
  -- Rate limits
  rate_limit_per_minute INTEGER DEFAULT 60,
  rate_limit_per_day INTEGER DEFAULT 10000,
  query_complexity_limit INTEGER DEFAULT 100,
  -- Permissions
  allowed_endpoints TEXT[] DEFAULT '{}',
  allowed_countries TEXT[] DEFAULT '{}', -- Empty = all
  allowed_nuts_levels INTEGER[] DEFAULT '{0,1,2}',
  can_access_feeds BOOLEAN DEFAULT false,
  can_access_correlations BOOLEAN DEFAULT false,
  can_bulk_export BOOLEAN DEFAULT false,
  can_white_label BOOLEAN DEFAULT false,
  -- Status
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  last_used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- API-användningslogg
CREATE TABLE IF NOT EXISTS public.api_usage_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  api_key_id UUID REFERENCES api_keys(id) ON DELETE SET NULL,
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL DEFAULT 'GET',
  query_params JSONB,
  query_complexity INTEGER DEFAULT 1,
  response_status INTEGER,
  response_time_ms INTEGER,
  ip_address INET,
  user_agent TEXT,
  country_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Licensavtal och godkännanden
CREATE TABLE IF NOT EXISTS public.license_agreements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  api_key_id UUID REFERENCES api_keys(id) ON DELETE CASCADE,
  license_tier TEXT NOT NULL,
  license_version TEXT NOT NULL DEFAULT '1.0',
  terms_accepted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  accepted_from_ip INET,
  organization_name TEXT,
  organization_country TEXT,
  billing_contact_email TEXT,
  special_terms JSONB, -- Custom enterprise terms
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Attributionslogg (för att spåra korrekt attribution)
CREATE TABLE IF NOT EXISTS public.attribution_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  api_key_id UUID REFERENCES api_keys(id) ON DELETE SET NULL,
  content_type TEXT NOT NULL, -- 'kpi', 'observation', 'feed', 'correlation'
  content_id TEXT,
  attribution_required BOOLEAN DEFAULT true,
  attribution_provided BOOLEAN DEFAULT false,
  publication_url TEXT,
  checked_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Policy-överträdelser
CREATE TABLE IF NOT EXISTS public.policy_violations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  api_key_id UUID REFERENCES api_keys(id) ON DELETE SET NULL,
  violation_type TEXT NOT NULL, -- 'rate_limit', 'scraping', 'replication', 'privacy_breach'
  severity TEXT NOT NULL DEFAULT 'warning' CHECK (severity IN ('warning', 'temporary_block', 'permanent_block')),
  description TEXT,
  evidence JSONB,
  action_taken TEXT,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Index för prestanda
CREATE INDEX IF NOT EXISTS idx_api_keys_user ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_prefix ON api_keys(key_prefix);
CREATE INDEX IF NOT EXISTS idx_api_keys_tier ON api_keys(license_tier);
CREATE INDEX IF NOT EXISTS idx_api_usage_key ON api_usage_log(api_key_id);
CREATE INDEX IF NOT EXISTS idx_api_usage_time ON api_usage_log(created_at);
CREATE INDEX IF NOT EXISTS idx_api_usage_endpoint ON api_usage_log(endpoint);
CREATE INDEX IF NOT EXISTS idx_license_agreements_user ON license_agreements(user_id);
CREATE INDEX IF NOT EXISTS idx_policy_violations_key ON policy_violations(api_key_id);

-- Enable RLS
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE license_agreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE attribution_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE policy_violations ENABLE ROW LEVEL SECURITY;

-- Users can manage their own API keys
CREATE POLICY "Users can view own API keys" ON api_keys 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own API keys" ON api_keys 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own API keys" ON api_keys 
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can view their own usage
CREATE POLICY "Users can view own usage" ON api_usage_log 
  FOR SELECT USING (api_key_id IN (SELECT id FROM api_keys WHERE user_id = auth.uid()));

-- Users can view their own agreements
CREATE POLICY "Users can view own agreements" ON license_agreements 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own agreements" ON license_agreements 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Attribution is public for transparency
CREATE POLICY "Attribution log publicly readable" ON attribution_log FOR SELECT USING (true);

-- Violations visible to key owner
CREATE POLICY "Users can view own violations" ON policy_violations 
  FOR SELECT USING (api_key_id IN (SELECT id FROM api_keys WHERE user_id = auth.uid()));