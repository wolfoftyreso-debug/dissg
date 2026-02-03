/**
 * Feature Gate Component
 * 
 * 🔒 Wraps content that requires specific tier access
 * Shows upgrade prompt if user lacks access
 */

import React from 'react';
import { Lock, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useFeatureGate, type FeatureGateResult } from '@/hooks/useSubscription';
import { TierFeatureAccess, SUBSCRIPTION_TIERS, FEATURE_MATRIX } from '@/config/monetizationConfig';
import { Link } from 'react-router-dom';

interface FeatureGateProps {
  feature: keyof TierFeatureAccess;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showUpgradePrompt?: boolean;
  className?: string;
}

export function FeatureGate({
  feature,
  children,
  fallback,
  showUpgradePrompt = true,
  className = '',
}: FeatureGateProps) {
  const gate = useFeatureGate(feature);

  if (gate.canAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (!showUpgradePrompt) {
    return null;
  }

  return <UpgradePrompt feature={feature} gate={gate} className={className} />;
}

// ============================================
// UPGRADE PROMPT (Clean, clinical, no hype)
// ============================================

interface UpgradePromptProps {
  feature: keyof TierFeatureAccess;
  gate: FeatureGateResult;
  className?: string;
}

function UpgradePrompt({ feature, gate, className = '' }: UpgradePromptProps) {
  const featureInfo = FEATURE_MATRIX.find(f => f.key === feature);
  const requiredTierInfo = gate.requiredTier ? SUBSCRIPTION_TIERS[gate.requiredTier] : null;

  return (
    <Card className={`border-border/50 bg-muted/30 ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-muted rounded-md">
            <Lock className="h-5 w-5 text-muted-foreground" />
          </div>
          
          <div className="flex-1 space-y-3">
            <div>
              <h3 className="font-medium text-foreground">
                {featureInfo?.name.en || feature}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {featureInfo?.description.en || 'This feature requires an upgraded subscription.'}
              </p>
            </div>

            {requiredTierInfo && (
              <div className="text-sm text-muted-foreground">
                <span>Available from </span>
                <span className="font-medium text-foreground">
                  {requiredTierInfo.name.en}
                </span>
                {requiredTierInfo.pricing.monthly !== null && requiredTierInfo.pricing.monthly > 0 && (
                  <span className="text-muted-foreground">
                    {' '}(€{requiredTierInfo.pricing.monthly}/mo)
                  </span>
                )}
              </div>
            )}

            <Link to={gate.upgradeUrl}>
              <Button variant="outline" size="sm" className="mt-2">
                View Options
                <ArrowUpRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================
// LIMITED ACCESS BADGE
// ============================================

export function LimitedAccessBadge() {
  return (
    <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-amber-500/10 text-amber-600 rounded">
      Limited
    </span>
  );
}

// ============================================
// WATERMARK OVERLAY (for PDF exports)
// ============================================

interface WatermarkOverlayProps {
  children: React.ReactNode;
  tier: 'analyst';
}

export function WatermarkOverlay({ children }: WatermarkOverlayProps) {
  return (
    <div className="relative">
      {children}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div 
          className="text-4xl font-bold text-muted-foreground/10 transform -rotate-45 select-none"
          style={{ whiteSpace: 'nowrap' }}
        >
          ANALYST EXPORT
        </div>
      </div>
    </div>
  );
}

// ============================================
// EXPORT
// ============================================

export default FeatureGate;
