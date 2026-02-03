/**
 * License Tier Card - Visar licensnivåer och deras villkor
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X, Zap, Building2, Globe, Lock } from 'lucide-react';
import { licenseTiers, type LicenseTier } from '@/config/licensingConfig';

interface LicenseTierCardProps {
  tier: LicenseTier;
  isCurrentTier?: boolean;
  onSelect?: () => void;
  compact?: boolean;
}

export function LicenseTierCard({ tier, isCurrentTier, onSelect, compact = false }: LicenseTierCardProps) {
  const config = licenseTiers[tier];
  
  const TierIcon = {
    open: Globe,
    plus: Zap,
    pro: Lock,
    enterprise: Building2,
  }[tier];

  if (compact) {
    return (
      <div className={`flex items-center gap-3 p-3 rounded-lg border ${isCurrentTier ? 'border-primary bg-primary/5' : 'bg-card'}`}>
        <div className={`p-2 rounded-lg ${config.color.replace('text-', 'bg-').replace('-500', '-500/20')}`}>
          <TierIcon className={`h-4 w-4 ${config.color}`} />
        </div>
        <div className="flex-1">
          <div className="font-medium">{config.name}</div>
          <div className="text-xs text-muted-foreground">{config.price}</div>
        </div>
        {isCurrentTier && <Badge>Aktiv</Badge>}
      </div>
    );
  }

  return (
    <Card className={`relative overflow-hidden ${isCurrentTier ? 'ring-2 ring-primary' : ''}`}>
      {tier === 'pro' && (
        <div className="absolute top-0 right-0 bg-gradient-to-l from-purple-500 to-pink-500 text-white px-3 py-1 text-xs font-medium rounded-bl-lg">
          Populärast
        </div>
      )}
      
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${config.color.replace('text-', 'bg-').replace('-500', '-500/20')}`}>
            <TierIcon className={`h-5 w-5 ${config.color}`} />
          </div>
          <div>
            <CardTitle className="text-lg">{config.name}</CardTitle>
            <CardDescription>{config.description}</CardDescription>
          </div>
        </div>
        <div className="text-2xl font-bold mt-2">{config.price}</div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Features */}
        <div className="space-y-2">
          {config.features.map((feature, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span>{feature}</span>
            </div>
          ))}
        </div>

        {/* Limits */}
        <div className="pt-3 border-t">
          <div className="text-xs font-medium text-muted-foreground mb-2">GRÄNSER</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-muted-foreground">Förfrågningar/min:</span>
              <span className="ml-1 font-medium">{config.limits.ratePerMinute}</span>
            </div>
            <div>
              <span className="text-muted-foreground">NUTS-nivåer:</span>
              <span className="ml-1 font-medium">{config.limits.nutsLevels.join(', ')}</span>
            </div>
          </div>
        </div>

        {/* Permissions */}
        <div className="pt-3 border-t">
          <div className="text-xs font-medium text-muted-foreground mb-2">BEHÖRIGHETER</div>
          <div className="flex flex-wrap gap-1">
            <PermissionBadge label="Kommersiellt" enabled={config.permissions.commercialUse} />
            <PermissionBadge label="White-label" enabled={config.permissions.whiteLabel} />
            <PermissionBadge label="Feeds" enabled={config.permissions.feeds} />
            <PermissionBadge label="Bulk" enabled={config.permissions.bulkExport} />
            <PermissionBadge label="SLA" enabled={config.permissions.sla} />
          </div>
        </div>

        {/* Attribution requirement */}
        <div className="pt-3 border-t">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground">Attribution:</span>
            <Badge variant="outline" className="text-xs">
              {config.permissions.attribution === 'required' && 'Obligatorisk'}
              {config.permissions.attribution === 'recommended' && 'Rekommenderad'}
              {config.permissions.attribution === 'optional' && 'Valfri'}
            </Badge>
          </div>
        </div>

        {/* Typical users */}
        <div className="pt-3 border-t text-xs text-muted-foreground">
          Typiska användare: {config.typicalUsers.join(', ')}
        </div>

        {/* CTA */}
        {onSelect && (
          <Button 
            onClick={onSelect} 
            variant={isCurrentTier ? 'outline' : tier === 'pro' ? 'default' : 'secondary'}
            className="w-full mt-4"
            disabled={isCurrentTier}
          >
            {isCurrentTier ? 'Nuvarande plan' : tier === 'enterprise' ? 'Kontakta oss' : 'Välj plan'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

function PermissionBadge({ label, enabled }: { label: string; enabled: boolean }) {
  return (
    <Badge variant={enabled ? 'default' : 'secondary'} className="text-xs gap-1">
      {enabled ? <Check className="h-2 w-2" /> : <X className="h-2 w-2" />}
      {label}
    </Badge>
  );
}

export function LicenseTierComparison() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {(Object.keys(licenseTiers) as LicenseTier[]).map(tier => (
        <LicenseTierCard key={tier} tier={tier} />
      ))}
    </div>
  );
}

export default LicenseTierCard;
