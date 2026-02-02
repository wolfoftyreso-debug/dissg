/**
 * Aggregation Guard Components
 * Block C: UI for comparability warnings and uncertainty indicators
 */

import React from 'react';
import { AlertTriangle, XCircle, CheckCircle, Info, HelpCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { ComparabilityCheck, UncertaintyIndicator, UncertaintyLevel } from '@/lib/aggregation/aggregationGuard';
import { COMPARISON_BLOCKED_MESSAGE_SV } from '@/lib/aggregation/aggregationGuard';

interface ComparabilityWarningProps {
  check: ComparabilityCheck;
  onShowAlternatives?: () => void;
  className?: string;
}

export function ComparabilityWarning({ check, onShowAlternatives, className }: ComparabilityWarningProps) {
  if (check.isComparable && check.warnings.length === 0) {
    return null;
  }

  // Blocked comparison
  if (!check.isComparable) {
    return (
      <Alert variant="destructive" className={className}>
        <XCircle className="h-4 w-4" />
        <AlertTitle>Jämförelse ej möjlig</AlertTitle>
        <AlertDescription className="space-y-2">
          <p>{COMPARISON_BLOCKED_MESSAGE_SV}</p>
          <ul className="list-disc list-inside text-sm space-y-1 mt-2">
            {check.blockingIssues.map((issue, i) => (
              <li key={i}>{issue}</li>
            ))}
          </ul>
          {check.alternatives && check.alternatives.length > 0 && onShowAlternatives && (
            <Button
              variant="outline"
              size="sm"
              onClick={onShowAlternatives}
              className="mt-3"
            >
              Visa alternativ
            </Button>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  // Warnings only
  return (
    <Alert className={className}>
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Jämförelsevarningar</AlertTitle>
      <AlertDescription>
        <ul className="list-disc list-inside text-sm space-y-1 mt-2">
          {check.warnings.map((warning, i) => (
            <li key={i}>{warning}</li>
          ))}
        </ul>
        <p className="text-xs text-muted-foreground mt-2">
          Jämförelsekonfidens: {Math.round(check.confidence * 100)}%
        </p>
      </AlertDescription>
    </Alert>
  );
}

interface UncertaintyBadgeProps {
  uncertainty: UncertaintyIndicator;
  showTooltip?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export function UncertaintyBadge({ 
  uncertainty, 
  showTooltip = true, 
  size = 'md',
  className 
}: UncertaintyBadgeProps) {
  const colors: Record<UncertaintyLevel, string> = {
    low: 'border-green-500 text-green-600 dark:text-green-400',
    medium: 'border-orange-500 text-orange-600 dark:text-orange-400',
    high: 'border-red-500 text-red-600 dark:text-red-400',
    unknown: 'border-gray-500 text-gray-600 dark:text-gray-400',
  };

  const labels: Record<UncertaintyLevel, string> = {
    low: 'Låg osäkerhet',
    medium: 'Måttlig osäkerhet',
    high: 'Hög osäkerhet',
    unknown: 'Okänd osäkerhet',
  };

  const badge = (
    <Badge 
      variant="outline" 
      className={cn(
        colors[uncertainty.level],
        size === 'sm' && 'text-xs py-0',
        className
      )}
    >
      {size === 'sm' ? (
        <>±{uncertainty.confidenceInterval}%</>
      ) : (
        <>{labels[uncertainty.level]} (±{uncertainty.confidenceInterval}%)</>
      )}
    </Badge>
  );

  if (!showTooltip) {
    return badge;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {badge}
      </TooltipTrigger>
      <TooltipContent side="bottom" className="max-w-xs">
        <p className="font-medium mb-1">{labels[uncertainty.level]}</p>
        <p className="text-sm text-muted-foreground">{uncertainty.explanation}</p>
        {uncertainty.factors.length > 0 && (
          <ul className="mt-2 text-xs space-y-1">
            {uncertainty.factors.map((f, i) => (
              <li key={i}>• {f}</li>
            ))}
          </ul>
        )}
      </TooltipContent>
    </Tooltip>
  );
}

interface DataQualityIndicatorProps {
  dataTier: 'A' | 'B' | 'C' | 'D';
  uncertainty?: UncertaintyIndicator;
  compact?: boolean;
  className?: string;
}

export function DataQualityIndicator({ 
  dataTier, 
  uncertainty, 
  compact = false,
  className 
}: DataQualityIndicatorProps) {
  const tierInfo = {
    A: { label: 'Hög kvalitet', color: 'text-green-600', icon: CheckCircle },
    B: { label: 'God kvalitet', color: 'text-blue-600', icon: CheckCircle },
    C: { label: 'Begränsad', color: 'text-orange-600', icon: AlertTriangle },
    D: { label: 'Låg kvalitet', color: 'text-red-600', icon: AlertTriangle },
  }[dataTier];

  const Icon = tierInfo.icon;

  if (compact) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={cn('inline-flex items-center gap-1', tierInfo.color, className)}>
            <Icon className="h-3 w-3" />
            <span className="text-xs font-medium">{dataTier}</span>
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>Datakvalitet: {tierInfo.label}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className={cn('flex items-center gap-1', tierInfo.color)}>
        <Icon className="h-4 w-4" />
        <span className="text-sm font-medium">{tierInfo.label}</span>
        <Badge variant="outline" className="ml-1 text-xs">
          Tier {dataTier}
        </Badge>
      </div>
      {uncertainty && (
        <UncertaintyBadge uncertainty={uncertainty} size="sm" />
      )}
    </div>
  );
}

interface MethodologyDisclosureProps {
  title: string;
  methodology: string;
  source: string;
  sourceUrl?: string;
  limitations?: string[];
  className?: string;
}

export function MethodologyDisclosure({
  title,
  methodology,
  source,
  sourceUrl,
  limitations,
  className,
}: MethodologyDisclosureProps) {
  return (
    <div className={cn('rounded-lg border bg-muted/30 p-4 space-y-3', className)}>
      <div className="flex items-start gap-2">
        <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
        <div>
          <h4 className="font-medium text-sm">{title}</h4>
          <p className="text-sm text-muted-foreground mt-1">{methodology}</p>
        </div>
      </div>

      <div className="text-xs space-y-2">
        <p>
          <span className="text-muted-foreground">Källa: </span>
          {sourceUrl ? (
            <a 
              href={sourceUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              {source}
            </a>
          ) : (
            source
          )}
        </p>

        {limitations && limitations.length > 0 && (
          <div>
            <p className="text-muted-foreground mb-1">Begränsningar:</p>
            <ul className="list-disc list-inside space-y-0.5">
              {limitations.map((lim, i) => (
                <li key={i} className="text-muted-foreground">{lim}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
