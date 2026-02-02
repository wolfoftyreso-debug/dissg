/**
 * DEL XXIV — DEMOGRAPHIC DATA GUARD
 * 
 * Automatisk hantering av känsliga korsningar och N-spärrar
 * för demografisk data (kön, migration, ursprung).
 */

import { ReactNode, useMemo } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Shield, Lock, AlertTriangle, Users, 
  Shuffle, EyeOff, Merge 
} from 'lucide-react';
import {
  DEMOGRAPHIC_PRIVACY_THRESHOLDS,
  FORBIDDEN_CROSSINGS,
  DEMOGRAPHIC_DIMENSIONS,
  type DemographicPrivacyThreshold,
  type ForbiddenCrossing,
} from '@/config/depthModelConfig';
import { cn } from '@/lib/utils';

// ═══════════════════════════════════════════════════════════════
// PRIVACY CHECK RESULT
// ═══════════════════════════════════════════════════════════════

interface PrivacyCheckResult {
  allowed: boolean;
  reason?: string;
  action?: 'show' | 'suppress' | 'aggregate' | 'add_noise';
  aggregatedTo?: string;
  noiseApplied?: boolean;
}

interface DataCell {
  dimensions: Record<string, string>;
  n: number;
  value: number;
}

/**
 * Kontrollera om en datapunkt får visas
 */
export function checkDemographicPrivacy(
  cell: DataCell,
  thresholds: DemographicPrivacyThreshold[] = DEMOGRAPHIC_PRIVACY_THRESHOLDS
): PrivacyCheckResult {
  const dimensionKeys = Object.keys(cell.dimensions);

  // Kontrollera förbjudna korsningar
  for (const forbidden of FORBIDDEN_CROSSINGS) {
    const hasAll = forbidden.dimensions.every(d => 
      dimensionKeys.some(key => key.includes(d))
    );
    if (hasAll) {
      return {
        allowed: false,
        reason: forbidden.reason,
        action: 'suppress',
      };
    }
  }

  // Kontrollera N-spärrar
  for (const key of dimensionKeys) {
    const threshold = thresholds.find(t => key.includes(t.dimension));
    if (threshold && cell.n < threshold.minN) {
      return {
        allowed: false,
        reason: `Färre än ${threshold.minN} individer i gruppen`,
        action: threshold.aggregationStrategy === 'add_noise' ? 'add_noise' : 
                threshold.aggregationStrategy === 'merge_adjacent' ? 'aggregate' : 'suppress',
        aggregatedTo: threshold.aggregationStrategy === 'broaden_category' ? 
          'bredare kategori' : undefined,
        noiseApplied: threshold.aggregationStrategy === 'add_noise',
      };
    }
  }

  return { allowed: true, action: 'show' };
}

/**
 * Lägg till statistiskt brus för skydd
 */
export function addDemographicNoise(value: number, noiseLevel: number = 0.05): number {
  const noise = (Math.random() - 0.5) * 2 * noiseLevel * value;
  return Math.round(value + noise);
}

// ═══════════════════════════════════════════════════════════════
// DEMOGRAPHIC DATA GUARD COMPONENT
// ═══════════════════════════════════════════════════════════════

interface DemographicDataGuardProps {
  dimensions: Record<string, string>;
  n: number;
  children: ReactNode;
  showReason?: boolean;
  fallback?: ReactNode;
}

export function DemographicDataGuard({ 
  dimensions, 
  n, 
  children, 
  showReason = true,
  fallback 
}: DemographicDataGuardProps) {
  const result = useMemo(() => 
    checkDemographicPrivacy({ dimensions, n, value: 0 }),
    [dimensions, n]
  );

  if (result.allowed) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className="relative">
      <div className="opacity-0 pointer-events-none">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-muted/80 rounded-lg backdrop-blur-sm">
        <div className="text-center p-4">
          {result.action === 'suppress' ? (
            <Lock className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
          ) : result.action === 'aggregate' ? (
            <Merge className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
          ) : (
            <EyeOff className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
          )}
          <p className="text-sm font-medium">Data skyddad</p>
          {showReason && result.reason && (
            <p className="text-xs text-muted-foreground mt-1 max-w-xs">
              {result.reason}
            </p>
          )}
          {result.aggregatedTo && (
            <Badge variant="outline" className="mt-2 text-xs">
              Aggregeras till: {result.aggregatedTo}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// FORBIDDEN CROSSING WARNING
// ═══════════════════════════════════════════════════════════════

interface ForbiddenCrossingWarningProps {
  requestedDimensions: string[];
  className?: string;
}

export function ForbiddenCrossingWarning({ 
  requestedDimensions,
  className 
}: ForbiddenCrossingWarningProps) {
  const violation = useMemo(() => {
    for (const forbidden of FORBIDDEN_CROSSINGS) {
      const hasAll = forbidden.dimensions.every(d => 
        requestedDimensions.some(req => req.includes(d))
      );
      if (hasAll) {
        return forbidden;
      }
    }
    return null;
  }, [requestedDimensions]);

  if (!violation) {
    return null;
  }

  return (
    <Alert variant="destructive" className={className}>
      <Shield className="h-4 w-4" />
      <AlertDescription>
        <strong className="block mb-1">Spärrad korsning</strong>
        <p className="text-xs">{violation.reason}</p>
        <Badge variant="outline" className="mt-2 text-xs">
          Risk: {violation.riskType === 'reidentification' ? 'Identifiering' : 
                 violation.riskType === 'small_n' ? 'För liten grupp' :
                 violation.riskType === 'methodological' ? 'Metodologisk' : 'Etisk'}
        </Badge>
      </AlertDescription>
    </Alert>
  );
}

// ═══════════════════════════════════════════════════════════════
// N-THRESHOLD STATUS
// ═══════════════════════════════════════════════════════════════

interface NThresholdStatusProps {
  n: number;
  dimension: string;
  compact?: boolean;
}

export function NThresholdStatus({ n, dimension, compact = false }: NThresholdStatusProps) {
  const threshold = DEMOGRAPHIC_PRIVACY_THRESHOLDS.find(t => 
    dimension.includes(t.dimension)
  );
  
  const minRequired = threshold?.minN ?? 30;
  const ratio = n / minRequired;

  let status: 'safe' | 'marginal' | 'blocked';
  let StatusIcon: typeof Shield;
  let statusColor: string;
  let statusLabel: string;

  if (ratio >= 2) {
    status = 'safe';
    StatusIcon = Shield;
    statusColor = 'text-status-positive';
    statusLabel = 'Tillräcklig gruppstorlek';
  } else if (ratio >= 1) {
    status = 'marginal';
    StatusIcon = AlertTriangle;
    statusColor = 'text-status-warning';
    statusLabel = 'Marginell gruppstorlek';
  } else {
    status = 'blocked';
    StatusIcon = Lock;
    statusColor = 'text-muted-foreground';
    statusLabel = 'Spärrad - för liten grupp';
  }

  if (compact) {
    return (
      <Badge variant="outline" className={cn("text-xs gap-1", statusColor)}>
        <StatusIcon className="h-3 w-3" />
        N={n >= minRequired ? n.toLocaleString('sv-SE') : '< ' + minRequired}
      </Badge>
    );
  }

  return (
    <div className={cn("flex items-center gap-2 text-sm", statusColor)}>
      <StatusIcon className="h-4 w-4" />
      <span>{statusLabel}</span>
      <span className="text-muted-foreground">(N={n.toLocaleString('sv-SE')}, krav ≥{minRequired})</span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SENSITIVITY INDICATOR
// ═══════════════════════════════════════════════════════════════

interface SensitivityIndicatorProps {
  dimensionId: string;
  className?: string;
}

export function SensitivityIndicator({ dimensionId, className }: SensitivityIndicatorProps) {
  const dimension = DEMOGRAPHIC_DIMENSIONS.find(d => d.id === dimensionId);
  
  if (!dimension) return null;

  const colors = {
    low: 'bg-status-positive/10 text-status-positive border-status-positive/30',
    medium: 'bg-chart-4/10 text-chart-4 border-chart-4/30',
    high: 'bg-status-warning/10 text-status-warning border-status-warning/30',
    very_high: 'bg-status-critical/10 text-status-critical border-status-critical/30',
  };

  const labels = {
    low: 'Låg känslighet',
    medium: 'Medel känslighet',
    high: 'Hög känslighet',
    very_high: 'Mycket hög känslighet',
  };

  return (
    <Badge 
      variant="outline" 
      className={cn("text-xs", colors[dimension.sensitivityLevel], className)}
    >
      {labels[dimension.sensitivityLevel]}
    </Badge>
  );
}

// ═══════════════════════════════════════════════════════════════
// PRIVACY POLICY SUMMARY FOR DEL XXIV
// ═══════════════════════════════════════════════════════════════

export function DemographicPrivacySummary() {
  return (
    <Card className="bg-muted/30">
      <CardContent className="py-4">
        <div className="flex items-center gap-2 font-medium text-sm mb-3">
          <Shield className="h-4 w-4" />
          Integritetsskydd för demografisk data
        </div>
        
        <ul className="space-y-2 text-xs text-muted-foreground">
          <li className="flex items-start gap-2">
            <Users className="h-3 w-3 mt-0.5 shrink-0" />
            <span>All data visas på aggregerad gruppnivå – aldrig individer</span>
          </li>
          <li className="flex items-start gap-2">
            <Lock className="h-3 w-3 mt-0.5 shrink-0" />
            <span>Grupper under tröskelvärdet spärras automatiskt</span>
          </li>
          <li className="flex items-start gap-2">
            <AlertTriangle className="h-3 w-3 mt-0.5 shrink-0" />
            <span>Känsliga korsningar (t.ex. ursprung × kommun) är förbjudna</span>
          </li>
          <li className="flex items-start gap-2">
            <Shuffle className="h-3 w-3 mt-0.5 shrink-0" />
            <span>Statistiskt brus läggs till vid marginell gruppstorlek</span>
          </li>
        </ul>

        <div className="mt-4 pt-3 border-t border-muted text-xs text-muted-foreground">
          <strong>Tröskelvärden:</strong>
          <div className="grid grid-cols-2 gap-1 mt-1">
            <span>Kommun: ≥50</span>
            <span>Region: ≥100</span>
            <span>Ursprungsland: ≥200</span>
            <span>Intersektioner: ≥30</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
