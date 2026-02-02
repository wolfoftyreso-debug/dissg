/**
 * ═══════════════════════════════════════════════════════════════════════════
 * MISINTERPRETATION GUARD - Active Protection (Spotless Protocol §6)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * The system must ACTIVELY:
 * - Block invalid comparisons
 * - Warn about low data quality
 * - Stop graphs with too few data points
 * - Show when uncertainty is too high
 * 
 * Standard text (immutable):
 * "This view cannot be presented reliably with available data."
 * 
 * NOT SHOWING is better than SHOWING WRONG.
 */

import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  Ban, 
  ShieldAlert,
  TrendingDown,
  BarChart3,
  HelpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { INSUFFICIENT_DATA_TEXT } from '@/context/SpotlessContext';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type GuardReason = 
  | 'insufficient_data_points'
  | 'low_confidence'
  | 'invalid_comparison'
  | 'methodological_mismatch'
  | 'temporal_incompatibility'
  | 'geographic_mismatch'
  | 'source_unreliable'
  | 'high_uncertainty';

interface GuardConfig {
  icon: typeof AlertTriangle;
  title: string;
  severity: 'block' | 'warn' | 'info';
  color: string;
}

const GUARD_CONFIGS: Record<GuardReason, GuardConfig> = {
  insufficient_data_points: {
    icon: BarChart3,
    title: 'Otillräckliga datapunkter',
    severity: 'block',
    color: 'text-status-critical',
  },
  low_confidence: {
    icon: TrendingDown,
    title: 'Låg datakvalitet',
    severity: 'warn',
    color: 'text-status-warning',
  },
  invalid_comparison: {
    icon: Ban,
    title: 'Ogiltig jämförelse',
    severity: 'block',
    color: 'text-status-critical',
  },
  methodological_mismatch: {
    icon: ShieldAlert,
    title: 'Metodologisk inkompatibilitet',
    severity: 'block',
    color: 'text-status-critical',
  },
  temporal_incompatibility: {
    icon: AlertTriangle,
    title: 'Tidsmässig inkompatibilitet',
    severity: 'warn',
    color: 'text-status-warning',
  },
  geographic_mismatch: {
    icon: AlertTriangle,
    title: 'Geografisk inkompatibilitet',
    severity: 'warn',
    color: 'text-status-warning',
  },
  source_unreliable: {
    icon: ShieldAlert,
    title: 'Opålitlig källa',
    severity: 'block',
    color: 'text-status-critical',
  },
  high_uncertainty: {
    icon: HelpCircle,
    title: 'Hög osäkerhet',
    severity: 'warn',
    color: 'text-status-warning',
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

interface MisinterpretationGuardProps {
  /** Reasons why this view is problematic */
  reasons: GuardReason[];
  /** Detailed explanations for each reason */
  explanations?: Partial<Record<GuardReason, string>>;
  /** The content to guard */
  children?: ReactNode;
  /** Override to force show content despite warnings */
  forceShow?: boolean;
  /** Callback when user acknowledges warning */
  onAcknowledge?: () => void;
  /** Language */
  lang?: 'sv' | 'en';
  className?: string;
}

export function MisinterpretationGuard({
  reasons,
  explanations = {},
  children,
  forceShow = false,
  onAcknowledge,
  lang = 'sv',
  className,
}: MisinterpretationGuardProps) {
  if (reasons.length === 0) {
    return <>{children}</>;
  }

  const hasBlockingReason = reasons.some(r => GUARD_CONFIGS[r].severity === 'block');
  const shouldBlock = hasBlockingReason && !forceShow;

  if (shouldBlock) {
    return (
      <BlockedView 
        reasons={reasons} 
        explanations={explanations} 
        lang={lang}
        className={className}
      />
    );
  }

  return (
    <div className={className}>
      <WarningBanner 
        reasons={reasons} 
        explanations={explanations}
        onAcknowledge={onAcknowledge}
        lang={lang}
      />
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// BLOCKED VIEW
// ═══════════════════════════════════════════════════════════════════════════

interface BlockedViewProps {
  reasons: GuardReason[];
  explanations: Partial<Record<GuardReason, string>>;
  lang: 'sv' | 'en';
  className?: string;
}

function BlockedView({ reasons, explanations, lang, className }: BlockedViewProps) {
  return (
    <Card className={cn('border-status-critical/40 bg-status-critical/5', className)}>
      <CardContent className="py-8 text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-status-critical/10 flex items-center justify-center">
            <Ban className="h-8 w-8 text-status-critical" />
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-status-critical">
            Vy blockerad
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            {INSUFFICIENT_DATA_TEXT[lang]}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {reasons.map(reason => {
            const config = GUARD_CONFIGS[reason];
            const Icon = config.icon;
            return (
              <Badge 
                key={reason} 
                variant="outline" 
                className={cn('gap-1.5', config.color, 'border-current/40')}
              >
                <Icon className="h-3 w-3" />
                {config.title}
              </Badge>
            );
          })}
        </div>

        {Object.keys(explanations).length > 0 && (
          <div className="text-left bg-muted/50 rounded-md p-4 max-w-lg mx-auto">
            <h4 className="text-sm font-semibold mb-2">Detaljer:</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {reasons.map(reason => explanations[reason] && (
                <li key={reason} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-status-critical mt-1.5 shrink-0" />
                  <span><strong>{GUARD_CONFIGS[reason].title}:</strong> {explanations[reason]}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// WARNING BANNER
// ═══════════════════════════════════════════════════════════════════════════

interface WarningBannerProps {
  reasons: GuardReason[];
  explanations: Partial<Record<GuardReason, string>>;
  onAcknowledge?: () => void;
  lang: 'sv' | 'en';
}

function WarningBanner({ reasons, explanations, onAcknowledge, lang }: WarningBannerProps) {
  return (
    <div className="mb-4 p-3 bg-status-warning/10 border border-status-warning/30 rounded-md">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-status-warning shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-status-warning">
            {lang === 'sv' ? 'Tolka med försiktighet' : 'Interpret with caution'}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {reasons.map(reason => {
              const config = GUARD_CONFIGS[reason];
              const Icon = config.icon;
              return (
                <Badge 
                  key={reason} 
                  variant="outline" 
                  className={cn('gap-1 text-xs', config.color, 'border-current/40')}
                >
                  <Icon className="h-3 w-3" />
                  {config.title}
                </Badge>
              );
            })}
          </div>
          {Object.keys(explanations).length > 0 && (
            <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
              {reasons.map(reason => explanations[reason] && (
                <li key={reason}>• {explanations[reason]}</li>
              ))}
            </ul>
          )}
        </div>
        {onAcknowledge && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onAcknowledge}
            className="shrink-0"
          >
            {lang === 'sv' ? 'Uppfattat' : 'Understood'}
          </Button>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// VALIDATION UTILITIES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Validate if a comparison between two datasets is methodologically valid
 */
export function validateComparison(
  datasetA: { methodology: string; timePeriod: string; geography: string },
  datasetB: { methodology: string; timePeriod: string; geography: string }
): { isValid: boolean; reasons: GuardReason[] } {
  const reasons: GuardReason[] = [];

  if (datasetA.methodology !== datasetB.methodology) {
    reasons.push('methodological_mismatch');
  }
  if (datasetA.timePeriod !== datasetB.timePeriod) {
    reasons.push('temporal_incompatibility');
  }
  if (datasetA.geography !== datasetB.geography) {
    reasons.push('geographic_mismatch');
  }

  return { isValid: reasons.length === 0, reasons };
}

/**
 * Validate if data has sufficient points for visualization
 */
export function validateDataSufficiency(
  dataPoints: number,
  minRequired: number = 3
): { isValid: boolean; reasons: GuardReason[] } {
  if (dataPoints < minRequired) {
    return { isValid: false, reasons: ['insufficient_data_points'] };
  }
  return { isValid: true, reasons: [] };
}

/**
 * Validate confidence level
 */
export function validateConfidence(
  confidence: number,
  minRequired: number = 60
): { isValid: boolean; reasons: GuardReason[] } {
  if (confidence < minRequired) {
    return { isValid: false, reasons: ['low_confidence'] };
  }
  if (confidence < 80) {
    return { isValid: true, reasons: ['high_uncertainty'] };
  }
  return { isValid: true, reasons: [] };
}

export default MisinterpretationGuard;
