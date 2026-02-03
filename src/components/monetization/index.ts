/**
 * Monetization Components Index
 * 
 * 🔥 MONSTER MONETIZATION INFRASTRUCTURE
 */

export { FeatureGate, LimitedAccessBadge, WatermarkOverlay } from './FeatureGate';
export { GracePeriodWarning } from './GracePeriodWarning';

// Re-export hooks for convenience
export {
  useSubscription,
  useCurrentTier,
  useFeatureAccess,
  useTierCheck,
  useGracePeriod,
  useFeatureUsage,
  useAcceptLegalTerms,
  useFeatureGate,
} from '@/hooks/useSubscription';

// Re-export config
export {
  SUBSCRIPTION_TIERS,
  FEATURE_MATRIX,
  LEGAL_CHECKBOXES,
  PAYMENT_RULES,
  MONSTER_UX_RULES,
  tierAtLeast,
  getFeatureAccess,
  hasFeatureAccess,
  hasFullFeatureAccess,
  type SubscriptionTier,
  type TierFeatureAccess,
} from '@/config/monetizationConfig';
