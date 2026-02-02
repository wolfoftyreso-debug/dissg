/**
 * COVID-19 REALITY LAYER - Policy Overlay
 * Shows policy periods as neutral time markers
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Info, ExternalLink } from 'lucide-react';
import type { CovidPolicyPeriod } from '@/types/covid';

interface CovidPolicyOverlayProps {
  policies: CovidPolicyPeriod[];
  countryCode: string;
}

const POLICY_TYPE_LABELS: Record<string, { label: string; color: string }> = {
  lockdown: { label: 'Lockdown', color: 'bg-red-500/10 text-red-500 border-red-500/30' },
  school_closure: { label: 'School Closure', color: 'bg-orange-500/10 text-orange-500 border-orange-500/30' },
  mask_mandate: { label: 'Mask Mandate', color: 'bg-blue-500/10 text-blue-500 border-blue-500/30' },
  travel_restriction: { label: 'Travel Restriction', color: 'bg-purple-500/10 text-purple-500 border-purple-500/30' },
  gathering_limit: { label: 'Gathering Limit', color: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30' },
  business_closure: { label: 'Business Closure', color: 'bg-pink-500/10 text-pink-500 border-pink-500/30' },
  curfew: { label: 'Curfew', color: 'bg-gray-500/10 text-gray-500 border-gray-500/30' },
};

export function CovidPolicyOverlay({ policies, countryCode }: CovidPolicyOverlayProps) {
  if (policies.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <Info className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No policy periods recorded for this selection</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          Policy Periods ({countryCode})
          <Badge variant="outline" className="font-normal text-xs">
            Neutral markers only
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Warning */}
        <div className="p-3 bg-muted/50 rounded mb-4">
          <p className="text-xs text-muted-foreground">
            Policy periods are shown as time markers without value judgments. 
            The system does not evaluate policy effectiveness or assign causation to outcomes.
          </p>
        </div>

        {/* Policy List */}
        <div className="space-y-3">
          {policies.map((policy, index) => {
            const typeConfig = POLICY_TYPE_LABELS[policy.policyType] || {
              label: policy.policyType,
              color: 'bg-muted text-muted-foreground border-border',
            };

            return (
              <div 
                key={policy.id || index} 
                className={`p-3 rounded border ${typeConfig.color}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="font-mono text-xs">
                        {policy.startDate}
                        {policy.endDate && ` → ${policy.endDate}`}
                        {!policy.endDate && ' → ongoing'}
                      </Badge>
                      <span className="text-sm font-medium">{typeConfig.label}</span>
                    </div>
                    {policy.description && (
                      <p className="text-xs text-muted-foreground">{policy.description}</p>
                    )}
                    {policy.stringencyLevel !== undefined && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Stringency Index: {policy.stringencyLevel}/100
                      </p>
                    )}
                  </div>
                  {policy.sourceUrl && (
                    <a 
                      href={policy.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
                {!policy.isVerified && (
                  <p className="text-xs text-muted-foreground mt-2 italic">
                    ⚠️ Unverified – awaiting source confirmation
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Disclaimer */}
        <div className="mt-4 pt-4 border-t">
          <p className="text-xs text-muted-foreground">
            <strong>What this overlay does NOT show:</strong>
          </p>
          <ul className="text-xs text-muted-foreground list-disc list-inside mt-1">
            <li>Whether policies "worked" or "failed"</li>
            <li>Causal relationships between policies and outcomes</li>
            <li>Recommendations for future policy</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
