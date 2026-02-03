/**
 * Subscription & Feature Access Hooks
 * 
 * 🔥 MONSTER FEATURE GATING
 * Secure, tier-based access control
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  SubscriptionTier, 
  TierFeatureAccess,
  SUBSCRIPTION_TIERS,
  tierAtLeast,
  hasFeatureAccess,
  hasFullFeatureAccess,
  getFeatureAccess
} from '@/config/monetizationConfig';

// ============================================
// TYPES
// ============================================

export interface UserSubscription {
  id: string;
  user_id: string;
  tier: SubscriptionTier;
  status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'unpaid' | 'paused' | 'incomplete';
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  grace_period_ends_at: string | null;
  payment_failed_at: string | null;
  terms_accepted_at: string | null;
  responsibility_accepted_at: string | null;
  created_at: string;
}

export interface FeatureUsage {
  feature_key: string;
  usage_count: number;
  usage_limit: number | null;
  period_start: string;
  period_end: string;
}

// ============================================
// SUBSCRIPTION HOOK
// ============================================

export function useSubscription() {
  return useQuery({
    queryKey: ['user-subscription'],
    queryFn: async (): Promise<UserSubscription | null> => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return null;
      }

      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        // No subscription found - user is a guest
        if (error.code === 'PGRST116') {
          return null;
        }
        console.error('Error fetching subscription:', error);
        return null;
      }

      return data as UserSubscription;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// ============================================
// CURRENT TIER HOOK
// ============================================

export function useCurrentTier(): SubscriptionTier {
  const { data: subscription, isLoading } = useSubscription();
  const { data: authData } = useQuery({
    queryKey: ['auth-user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
    staleTime: 5 * 60 * 1000,
  });

  // Not logged in = guest
  if (!authData) {
    return 'guest';
  }

  // Loading or no subscription = observer (free tier for logged-in users)
  if (isLoading || !subscription) {
    return 'observer';
  }

  // Check if subscription is active
  const activeStatuses = ['active', 'trialing', 'past_due'];
  if (!activeStatuses.includes(subscription.status)) {
    return 'observer';
  }

  return subscription.tier;
}

// ============================================
// FEATURE ACCESS HOOK
// ============================================

export function useFeatureAccess(feature: keyof TierFeatureAccess) {
  const tier = useCurrentTier();
  const access = getFeatureAccess(tier, feature);
  
  return {
    tier,
    access,
    hasAccess: hasFeatureAccess(tier, feature),
    hasFullAccess: hasFullFeatureAccess(tier, feature),
    isLimited: access === 'limited',
    isWatermarked: access === 'watermarked',
  };
}

// ============================================
// TIER CHECK HOOK
// ============================================

export function useTierCheck(requiredTier: SubscriptionTier) {
  const currentTier = useCurrentTier();
  const hasAccess = tierAtLeast(currentTier, requiredTier);
  const tierDefinition = SUBSCRIPTION_TIERS[requiredTier];
  
  return {
    currentTier,
    requiredTier,
    hasAccess,
    needsUpgrade: !hasAccess,
    upgradePrice: tierDefinition.pricing.monthly,
  };
}

// ============================================
// GRACE PERIOD CHECK
// ============================================

export function useGracePeriod() {
  const { data: subscription } = useSubscription();
  
  if (!subscription) {
    return { isInGracePeriod: false, daysRemaining: 0 };
  }

  if (subscription.status !== 'past_due' || !subscription.grace_period_ends_at) {
    return { isInGracePeriod: false, daysRemaining: 0 };
  }

  const graceEnd = new Date(subscription.grace_period_ends_at);
  const now = new Date();
  const daysRemaining = Math.ceil((graceEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  return {
    isInGracePeriod: daysRemaining > 0,
    daysRemaining: Math.max(0, daysRemaining),
    graceEndDate: graceEnd,
  };
}

// ============================================
// FEATURE USAGE HOOK
// ============================================

export function useFeatureUsage(featureKey: string) {
  const { data: authData } = useQuery({
    queryKey: ['auth-user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
    staleTime: 5 * 60 * 1000,
  });

  return useQuery({
    queryKey: ['feature-usage', featureKey],
    queryFn: async (): Promise<FeatureUsage | null> => {
      if (!authData) return null;

      const { data, error } = await supabase
        .from('feature_usage')
        .select('*')
        .eq('user_id', authData.id)
        .eq('feature_key', featureKey)
        .gte('period_end', new Date().toISOString())
        .order('period_start', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        console.error('Error fetching feature usage:', error);
        return null;
      }

      return data as FeatureUsage;
    },
    enabled: !!authData,
    staleTime: 60 * 1000, // 1 minute
  });
}

// ============================================
// LEGAL ACCEPTANCE MUTATION
// ============================================

export function useAcceptLegalTerms() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (acceptedTerms: {
      termsOfService: boolean;
      responsibilityClause: boolean;
      scenarioDisclaimer?: boolean;
      dataUsagePolicy: boolean;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const now = new Date().toISOString();
      
      const updateData: Record<string, string | null> = {};
      
      if (acceptedTerms.termsOfService) {
        updateData.terms_accepted_at = now;
      }
      if (acceptedTerms.responsibilityClause) {
        updateData.responsibility_accepted_at = now;
      }
      if (acceptedTerms.scenarioDisclaimer) {
        updateData.scenario_disclaimer_accepted_at = now;
      }
      if (acceptedTerms.dataUsagePolicy) {
        updateData.data_usage_policy_accepted_at = now;
      }

      const { error } = await supabase
        .from('user_subscriptions')
        .update(updateData)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-subscription'] });
    },
  });
}

// ============================================
// FEATURE GATE COMPONENT HELPER
// ============================================

export interface FeatureGateResult {
  canAccess: boolean;
  isLimited: boolean;
  isWatermarked: boolean;
  currentTier: SubscriptionTier;
  requiredTier: SubscriptionTier | null;
  upgradeUrl: string;
}

export function useFeatureGate(feature: keyof TierFeatureAccess): FeatureGateResult {
  const tier = useCurrentTier();
  const access = getFeatureAccess(tier, feature);
  
  // Find the minimum tier that has this feature
  const tierOrder: SubscriptionTier[] = ['guest', 'observer', 'analyst', 'institutional'];
  let requiredTier: SubscriptionTier | null = null;
  
  for (const t of tierOrder) {
    if (hasFeatureAccess(t, feature)) {
      requiredTier = t;
      break;
    }
  }

  return {
    canAccess: access !== false,
    isLimited: access === 'limited',
    isWatermarked: access === 'watermarked',
    currentTier: tier,
    requiredTier,
    upgradeUrl: '/pricing',
  };
}
