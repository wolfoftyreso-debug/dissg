/**
 * SUBSCRIPTION GATE
 * ═══════════════════════════════════════════════════════════════
 * 
 * Gatekeeper component for premium features.
 * Shows content if user has required tier, otherwise shows fallback.
 */

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  SubscriptionTier, 
  hasFeatureAccess, 
  SUBSCRIPTION_PLANS 
} from '@/lib/subscription-tiers';

interface SubscriptionGateProps {
  requiredTier: SubscriptionTier;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function SubscriptionGate({ 
  requiredTier, 
  children, 
  fallback 
}: SubscriptionGateProps) {
  const { user } = useAuth();

  // Fetch user's subscription tier
  const { data: userTier, isLoading } = useQuery({
    queryKey: ['user-tier', user?.id],
    queryFn: async () => {
      if (!user) return 'guest' as SubscriptionTier;

      const { data, error } = await supabase
        .rpc('get_user_tier', { p_user_id: user.id });

      if (error) {
        console.error('Failed to fetch user tier:', error);
        return 'observer' as SubscriptionTier; // Default to observer for logged-in users
      }

      return (data as SubscriptionTier) || 'observer';
    },
    enabled: true,
  });

  // Show loading state
  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-32 bg-muted rounded-lg" />
      </div>
    );
  }

  // Determine effective tier
  const effectiveTier = user ? (userTier || 'observer') : 'guest';

  // Check access
  if (hasFeatureAccess(effectiveTier, requiredTier)) {
    return <>{children}</>;
  }

  // Show fallback or default upgrade message
  if (fallback) {
    return <>{fallback}</>;
  }

  const requiredPlan = SUBSCRIPTION_PLANS[requiredTier];

  return (
    <div className="text-center py-12 px-4">
      <div className="max-w-md mx-auto space-y-4">
        <div className="text-4xl font-mono text-muted-foreground">[🔒]</div>
        <h3 className="text-lg font-semibold">
          {requiredPlan.name_local}-funktion
        </h3>
        <p className="text-muted-foreground">
          Denna funktion kräver {requiredPlan.name_local}-prenumeration.
        </p>
        <div className="text-sm text-muted-foreground">
          Nuvarande nivå: <span className="font-mono">{SUBSCRIPTION_PLANS[effectiveTier].name_local}</span>
        </div>
      </div>
    </div>
  );
}
