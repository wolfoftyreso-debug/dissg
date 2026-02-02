-- =====================================================
-- INTELLIGENCE FEEDS SYSTEM
-- Prenumeration på relevans, signaler och beslutsunderlag
-- =====================================================

-- Feed tier enum
CREATE TYPE feed_tier AS ENUM ('open', 'plus', 'pro');

-- Feed severity enum
CREATE TYPE feed_severity AS ENUM ('low', 'medium', 'high', 'critical');

-- Delivery method enum
CREATE TYPE delivery_method AS ENUM ('api', 'webhook', 'sse', 'kafka');

-- =====================================================
-- 1. FEED DEFINITIONS
-- =====================================================
CREATE TABLE public.feed_definitions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  tier feed_tier NOT NULL DEFAULT 'open',
  category TEXT NOT NULL,
  
  -- Generation settings
  default_frequency TEXT NOT NULL DEFAULT 'daily', -- hourly, daily, weekly, realtime
  min_effect_threshold NUMERIC NOT NULL DEFAULT 2.0, -- minimum % change to trigger
  min_duration_periods INTEGER NOT NULL DEFAULT 1, -- minimum periods of consistency
  min_confidence NUMERIC NOT NULL DEFAULT 0.7, -- minimum data confidence
  max_events_per_day INTEGER NOT NULL DEFAULT 10, -- anti-spam limit
  
  -- Content settings
  include_metrics BOOLEAN NOT NULL DEFAULT true,
  include_why_now BOOLEAN NOT NULL DEFAULT true,
  include_links BOOLEAN NOT NULL DEFAULT true,
  
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.feed_definitions ENABLE ROW LEVEL SECURITY;

-- Public read for feed catalog
CREATE POLICY "Feed definitions are publicly readable"
  ON public.feed_definitions FOR SELECT
  USING (true);

-- Insert default feed definitions
INSERT INTO public.feed_definitions (code, name, description, tier, category, default_frequency, min_effect_threshold) VALUES
-- OPEN FEEDS
('daily_top_changes', 'Dagens största förändringar', 'De 10 KPI:er med störst förändring senaste dygnet', 'open', 'summary', 'daily', 3.0),
('weekly_summary_country', 'Veckans nationella sammanfattning', 'Översikt av veckans viktigaste förändringar på nationell nivå', 'open', 'summary', 'weekly', 2.0),
('new_data_available', 'Ny data tillgänglig', 'Notifikation när nya datakällor uppdaterats', 'open', 'data', 'realtime', 0.0),
('monthly_master_index', 'Månadsvis masterindex', 'Utveckling av det aggregerade masterindexet', 'open', 'summary', 'monthly', 1.0),

-- PLUS FEEDS
('emerging_trends', 'Framväxande trender', 'Tidiga signaler på trender innan de blir uppenbara', 'plus', 'trends', 'daily', 1.5),
('regional_anomalies', 'Regionala avvikelser', 'Regioner som avviker signifikant från riksgenomsnittet', 'plus', 'regional', 'daily', 5.0),
('demographic_shifts', 'Demografiska skiften', 'Förändringar i demografiska mönster', 'plus', 'demographic', 'weekly', 2.0),
('correlation_alerts', 'Korrelationsvarningar', 'När korrelationer mellan KPI:er stabiliseras eller bryts', 'plus', 'analysis', 'daily', 0.0),

-- PRO FEEDS
('priority_alerts', 'Prioriterade varningar', 'Högrelevanta signaler som kräver uppmärksamhet', 'pro', 'alerts', 'realtime', 2.0),
('structural_decline', 'Strukturella nedgångar', 'Långvariga negativa trender som indikerar systemiska problem', 'pro', 'alerts', 'weekly', 1.0),
('responsibility_alignment', 'Ansvarsmatchning', 'Koppling mellan KPI-förändringar och ansvarsnivåer', 'pro', 'governance', 'daily', 2.0),
('early_warning', 'Tidig varning', 'Flera sammanfallande signaler som indikerar kommande problem', 'pro', 'alerts', 'realtime', 0.0),
('decision_impact', 'Beslutspåverkan', 'Uppmätta effekter av policy-beslut på KPI:er', 'pro', 'governance', 'weekly', 0.0);

-- =====================================================
-- 2. FEED SUBSCRIPTIONS
-- =====================================================
CREATE TABLE public.feed_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  api_key_id UUID, -- for API-only subscriptions without user
  feed_id UUID NOT NULL REFERENCES public.feed_definitions(id) ON DELETE CASCADE,
  
  -- Delivery configuration
  delivery_method delivery_method NOT NULL DEFAULT 'api',
  webhook_url TEXT, -- for webhook delivery
  webhook_secret TEXT, -- for webhook signature verification
  
  -- Filters (narrowing, not expanding)
  region_filter TEXT[], -- specific regions to include
  kpi_category_filter TEXT[], -- specific KPI categories
  demographic_filter JSONB, -- demographic dimensions
  responsibility_level_filter TEXT[], -- ansvarsnivå
  min_severity feed_severity NOT NULL DEFAULT 'low',
  
  -- Override settings
  custom_frequency TEXT, -- override default frequency
  custom_max_events_per_day INTEGER, -- override anti-spam
  
  -- Status
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_paused BOOLEAN NOT NULL DEFAULT false,
  pause_until TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Ensure unique subscription per user per feed
  UNIQUE(user_id, feed_id)
);

-- Enable RLS
ALTER TABLE public.feed_subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can manage their own subscriptions
CREATE POLICY "Users can view own subscriptions"
  ON public.feed_subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own subscriptions"
  ON public.feed_subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions"
  ON public.feed_subscriptions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own subscriptions"
  ON public.feed_subscriptions FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- 3. FEED EVENTS
-- =====================================================
CREATE TABLE public.feed_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  feed_id UUID NOT NULL REFERENCES public.feed_definitions(id),
  
  -- Event content
  severity feed_severity NOT NULL DEFAULT 'medium',
  scope_type TEXT NOT NULL DEFAULT 'national', -- national, regional, municipal
  scope_code TEXT, -- region code if applicable
  
  summary TEXT NOT NULL,
  why_now JSONB NOT NULL DEFAULT '[]'::jsonb, -- array of reasons
  
  -- Metrics included
  metrics JSONB NOT NULL DEFAULT '[]'::jsonb,
  
  -- Linked entities
  kpi_ids TEXT[] NOT NULL DEFAULT '{}',
  observation_ids TEXT[],
  decision_ids TEXT[],
  
  -- Metadata
  confidence TEXT NOT NULL DEFAULT 'medium', -- low, medium, high
  data_sources TEXT[] NOT NULL DEFAULT '{}',
  
  -- Links
  explore_url TEXT,
  methodology_url TEXT,
  source_urls JSONB DEFAULT '[]'::jsonb,
  
  -- Timing
  generated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  valid_from TIMESTAMPTZ NOT NULL DEFAULT now(),
  valid_until TIMESTAMPTZ,
  
  -- Processing
  checksum TEXT NOT NULL, -- for deduplication
  generation_context JSONB, -- debug info
  
  UNIQUE(feed_id, checksum)
);

-- Enable RLS
ALTER TABLE public.feed_events ENABLE ROW LEVEL SECURITY;

-- Public events are readable by all authenticated users
CREATE POLICY "Feed events readable by authenticated users"
  ON public.feed_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.feed_definitions fd
      WHERE fd.id = feed_id
      AND (fd.tier = 'open' OR auth.uid() IS NOT NULL)
    )
  );

-- Index for efficient querying
CREATE INDEX idx_feed_events_feed_generated ON public.feed_events(feed_id, generated_at DESC);
CREATE INDEX idx_feed_events_severity ON public.feed_events(severity, generated_at DESC);
CREATE INDEX idx_feed_events_scope ON public.feed_events(scope_type, scope_code);

-- =====================================================
-- 4. FEED EVENT INTERACTIONS (Feedback loop)
-- =====================================================
CREATE TABLE public.feed_event_interactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.feed_events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  subscription_id UUID REFERENCES public.feed_subscriptions(id) ON DELETE SET NULL,
  
  -- Interaction type
  interaction_type TEXT NOT NULL, -- 'viewed', 'clicked', 'explored', 'shared', 'dismissed', 'reported'
  
  -- Context
  interaction_context JSONB, -- additional data (time spent, destination, etc.)
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.feed_event_interactions ENABLE ROW LEVEL SECURITY;

-- Users can create their own interactions
CREATE POLICY "Users can log own interactions"
  ON public.feed_event_interactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Only owner can view their interactions
CREATE POLICY "Users can view own interactions"
  ON public.feed_event_interactions FOR SELECT
  USING (auth.uid() = user_id);

-- Index for analytics
CREATE INDEX idx_feed_interactions_event ON public.feed_event_interactions(event_id);
CREATE INDEX idx_feed_interactions_user ON public.feed_event_interactions(user_id, created_at DESC);

-- =====================================================
-- 5. FEED DELIVERY LOG
-- =====================================================
CREATE TABLE public.feed_delivery_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subscription_id UUID NOT NULL REFERENCES public.feed_subscriptions(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES public.feed_events(id) ON DELETE CASCADE,
  
  -- Delivery details
  delivery_method delivery_method NOT NULL,
  delivered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Status
  status TEXT NOT NULL DEFAULT 'pending', -- pending, delivered, failed, skipped
  error_message TEXT,
  retry_count INTEGER NOT NULL DEFAULT 0,
  
  -- Webhook specific
  response_code INTEGER,
  response_time_ms INTEGER,
  
  UNIQUE(subscription_id, event_id)
);

-- Enable RLS
ALTER TABLE public.feed_delivery_log ENABLE ROW LEVEL SECURITY;

-- Users can view their delivery history
CREATE POLICY "Users can view own delivery log"
  ON public.feed_delivery_log FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.feed_subscriptions fs
      WHERE fs.id = subscription_id AND fs.user_id = auth.uid()
    )
  );

-- Index for efficient querying
CREATE INDEX idx_feed_delivery_subscription ON public.feed_delivery_log(subscription_id, delivered_at DESC);
CREATE INDEX idx_feed_delivery_status ON public.feed_delivery_log(status) WHERE status IN ('pending', 'failed');

-- =====================================================
-- 6. FEED THRESHOLD ADJUSTMENTS (Learning system)
-- =====================================================
CREATE TABLE public.feed_threshold_adjustments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  feed_id UUID NOT NULL REFERENCES public.feed_definitions(id) ON DELETE CASCADE,
  
  -- Adjustment details
  adjustment_type TEXT NOT NULL, -- 'effect_threshold', 'frequency', 'max_events'
  old_value NUMERIC NOT NULL,
  new_value NUMERIC NOT NULL,
  
  -- Reason
  reason TEXT NOT NULL, -- automated or manual reason
  evidence JSONB, -- supporting metrics
  
  -- Who/what made the change
  adjusted_by TEXT NOT NULL DEFAULT 'system', -- 'system' or user_id
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.feed_threshold_adjustments ENABLE ROW LEVEL SECURITY;

-- Public read for transparency
CREATE POLICY "Threshold adjustments are publicly readable"
  ON public.feed_threshold_adjustments FOR SELECT
  USING (true);

-- =====================================================
-- 7. CRITICAL SIGNAL BYPASS
-- Ensures critical national signals always go through
-- =====================================================
CREATE TABLE public.critical_signal_overrides (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  kpi_id UUID REFERENCES public.kpi_definitions(id),
  observation_id UUID REFERENCES public.observations(id),
  
  reason TEXT NOT NULL,
  override_type TEXT NOT NULL DEFAULT 'force_delivery', -- force_delivery, raise_severity
  
  is_active BOOLEAN NOT NULL DEFAULT true,
  expires_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by TEXT
);

-- Enable RLS
ALTER TABLE public.critical_signal_overrides ENABLE ROW LEVEL SECURITY;

-- Public read for transparency
CREATE POLICY "Critical overrides are publicly readable"
  ON public.critical_signal_overrides FOR SELECT
  USING (true);

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Auto-update timestamps
CREATE TRIGGER update_feed_definitions_updated_at
  BEFORE UPDATE ON public.feed_definitions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_feed_subscriptions_updated_at
  BEFORE UPDATE ON public.feed_subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();