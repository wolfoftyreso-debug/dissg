-- ============================================
-- MONETIZATION & SUBSCRIPTION INFRASTRUCTURE
-- "MAKE IT A MONSTER" - Commercial hardening
-- ============================================

-- Create subscription tier enum
CREATE TYPE public.subscription_tier AS ENUM ('guest', 'observer', 'analyst', 'institutional');

-- Create subscription status enum
CREATE TYPE public.subscription_status AS ENUM (
  'active',
  'trialing', 
  'past_due',
  'canceled',
  'unpaid',
  'paused',
  'incomplete'
);

-- ============================================
-- USER SUBSCRIPTIONS TABLE
-- ============================================
CREATE TABLE public.user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tier subscription_tier NOT NULL DEFAULT 'observer',
  status subscription_status NOT NULL DEFAULT 'active',
  
  -- Stripe references
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  stripe_price_id TEXT,
  
  -- Billing period
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at TIMESTAMP WITH TIME ZONE,
  canceled_at TIMESTAMP WITH TIME ZONE,
  
  -- Grace period tracking
  grace_period_ends_at TIMESTAMP WITH TIME ZONE,
  payment_failed_at TIMESTAMP WITH TIME ZONE,
  payment_retry_count INTEGER DEFAULT 0,
  
  -- Legal acceptance (REQUIRED before purchase)
  terms_accepted_at TIMESTAMP WITH TIME ZONE,
  responsibility_accepted_at TIMESTAMP WITH TIME ZONE,
  scenario_disclaimer_accepted_at TIMESTAMP WITH TIME ZONE,
  data_usage_policy_accepted_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Ensure one subscription per user
  UNIQUE(user_id)
);

-- ============================================
-- SUBSCRIPTION AUDIT LOG
-- ============================================
CREATE TABLE public.subscription_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES public.user_subscriptions(id) ON DELETE SET NULL,
  
  action TEXT NOT NULL, -- 'created', 'upgraded', 'downgraded', 'canceled', 'payment_failed', 'payment_succeeded', 'grace_period_started', 'grace_period_ended'
  from_tier subscription_tier,
  to_tier subscription_tier,
  
  -- Event source
  source TEXT NOT NULL DEFAULT 'system', -- 'stripe_webhook', 'admin', 'system', 'user'
  stripe_event_id TEXT,
  
  -- Additional context
  metadata JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================
-- FEATURE USAGE TRACKING (for rate limiting)
-- ============================================
CREATE TABLE public.feature_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  feature_key TEXT NOT NULL,
  
  -- Usage tracking
  usage_count INTEGER NOT NULL DEFAULT 0,
  period_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT date_trunc('month', now()),
  period_end TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT date_trunc('month', now()) + interval '1 month',
  
  -- Limits based on tier
  usage_limit INTEGER,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- One record per user per feature per period
  UNIQUE(user_id, feature_key, period_start)
);

-- ============================================
-- INSTITUTIONAL ACCESS REQUESTS
-- ============================================
CREATE TABLE public.institutional_access_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Contact info
  organization_name TEXT NOT NULL,
  organization_type TEXT NOT NULL, -- 'government', 'central_bank', 'bank', 'research_institution', 'corporation', 'other'
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  
  -- Request details
  use_case_description TEXT NOT NULL,
  expected_users INTEGER,
  countries_of_interest TEXT[],
  
  -- Status tracking
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'reviewing', 'approved', 'rejected', 'negotiating'
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  review_notes TEXT,
  
  -- If approved, link to subscription
  approved_subscription_id UUID REFERENCES public.user_subscriptions(id),
  custom_pricing_eur INTEGER, -- Monthly price in EUR
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================
-- ENABLE RLS
-- ============================================
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institutional_access_requests ENABLE ROW LEVEL SECURITY;

-- ============================================
-- SECURITY DEFINER FUNCTIONS
-- ============================================

-- Get user's current subscription tier
CREATE OR REPLACE FUNCTION public.get_user_tier(p_user_id UUID)
RETURNS subscription_tier
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT tier FROM public.user_subscriptions 
     WHERE user_id = p_user_id 
       AND status IN ('active', 'trialing', 'past_due')
     LIMIT 1),
    'guest'::subscription_tier
  )
$$;

-- Check if user has at least a specific tier
CREATE OR REPLACE FUNCTION public.has_tier_access(p_user_id UUID, p_required_tier subscription_tier)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE public.get_user_tier(p_user_id)
    WHEN 'institutional' THEN true
    WHEN 'analyst' THEN p_required_tier IN ('guest', 'observer', 'analyst')
    WHEN 'observer' THEN p_required_tier IN ('guest', 'observer')
    WHEN 'guest' THEN p_required_tier = 'guest'
    ELSE false
  END
$$;

-- Check if user is in grace period
CREATE OR REPLACE FUNCTION public.is_in_grace_period(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_subscriptions
    WHERE user_id = p_user_id
      AND status = 'past_due'
      AND grace_period_ends_at > now()
  )
$$;

-- ============================================
-- RLS POLICIES
-- ============================================

-- User subscriptions: users can only see their own
CREATE POLICY "Users can view own subscription"
  ON public.user_subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Subscription audit log: users can view their own history
CREATE POLICY "Users can view own subscription history"
  ON public.subscription_audit_log
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Feature usage: users can view their own usage
CREATE POLICY "Users can view own feature usage"
  ON public.feature_usage
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Institutional requests: users can view their own requests
CREATE POLICY "Users can view own institutional requests"
  ON public.institutional_access_requests
  FOR SELECT
  TO authenticated
  USING (contact_email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Institutional requests: anyone can create (public form)
CREATE POLICY "Anyone can create institutional request"
  ON public.institutional_access_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX idx_user_subscriptions_user_id ON public.user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_stripe_customer ON public.user_subscriptions(stripe_customer_id);
CREATE INDEX idx_user_subscriptions_stripe_subscription ON public.user_subscriptions(stripe_subscription_id);
CREATE INDEX idx_user_subscriptions_status ON public.user_subscriptions(status);
CREATE INDEX idx_subscription_audit_log_user ON public.subscription_audit_log(user_id);
CREATE INDEX idx_subscription_audit_log_created ON public.subscription_audit_log(created_at);
CREATE INDEX idx_feature_usage_user_feature ON public.feature_usage(user_id, feature_key);
CREATE INDEX idx_institutional_requests_status ON public.institutional_access_requests(status);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_subscriptions_updated_at
  BEFORE UPDATE ON public.user_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_feature_usage_updated_at
  BEFORE UPDATE ON public.feature_usage
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_institutional_requests_updated_at
  BEFORE UPDATE ON public.institutional_access_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- AUTO-CREATE OBSERVER SUBSCRIPTION ON SIGNUP
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user_subscription()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_subscriptions (user_id, tier, status)
  VALUES (NEW.id, 'observer', 'active');
  
  INSERT INTO public.subscription_audit_log (user_id, action, to_tier, source)
  VALUES (NEW.id, 'created', 'observer', 'system');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Note: This trigger should be created on auth.users but we cannot modify auth schema
-- Instead, handle this in the application layer when a user signs up