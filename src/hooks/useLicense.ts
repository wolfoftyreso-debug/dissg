/**
 * License Hook
 * 
 * Access user's licensing tier and feature permissions.
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  type LicenseTier, 
  hasFeature, 
  meetsTierRequirement,
  type TierFeatures,
  licenseTiers 
} from '@/config/licensing';

export interface UseLicenseReturn {
  tier: LicenseTier;
  isLoading: boolean;
  error: Error | null;
  hasFeature: (feature: keyof TierFeatures) => boolean;
  meetsRequirement: (requiredTier: LicenseTier) => boolean;
  tierConfig: typeof licenseTiers[LicenseTier];
  isGuest: boolean;
  isObserver: boolean;
  isAnalyst: boolean;
  isInstitutional: boolean;
}

export function useLicense(): UseLicenseReturn {
  const { data: tier = 'guest', isLoading, error } = useQuery({
    queryKey: ['user-tier'],
    queryFn: async (): Promise<LicenseTier> => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return 'guest';

      const { data } = await supabase
        .from('user_subscriptions')
        .select('tier, status')
        .eq('user_id', user.id)
        .in('status', ['active', 'trialing', 'past_due'])
        .single();

      return (data?.tier as LicenseTier) || 'observer';
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    tier,
    isLoading,
    error: error as Error | null,
    hasFeature: (feature) => hasFeature(tier, feature),
    meetsRequirement: (requiredTier) => meetsTierRequirement(tier, requiredTier),
    tierConfig: licenseTiers[tier],
    isGuest: tier === 'guest',
    isObserver: tier === 'observer',
    isAnalyst: tier === 'analyst',
    isInstitutional: tier === 'institutional',
  };
}

export default useLicense;
