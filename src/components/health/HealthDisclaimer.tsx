/**
 * HEALTH DISCLAIMER COMPONENT
 * 
 * Required on all health-related views.
 * This is a legal and ethical requirement.
 */

import React from 'react';
import { AlertTriangle, Info, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { HEALTH_DISCLAIMER } from '@/types/health';

interface HealthDisclaimerProps {
  variant?: 'banner' | 'inline' | 'compact';
  className?: string;
}

export function HealthDisclaimer({ 
  variant = 'banner',
  className = ''
}: HealthDisclaimerProps) {
  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2 text-xs text-muted-foreground ${className}`}>
        <Info className="h-3 w-3" />
        <span>{HEALTH_DISCLAIMER.primary}</span>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <Alert className={className}>
        <Info className="h-4 w-4" />
        <AlertTitle className="text-sm font-medium">
          {HEALTH_DISCLAIMER.primary}
        </AlertTitle>
        <AlertDescription className="text-xs text-muted-foreground">
          {HEALTH_DISCLAIMER.secondary}
        </AlertDescription>
      </Alert>
    );
  }

  // Banner variant (default)
  return (
    <div className={`bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4 ${className}`}>
      <div className="flex gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-2">
          <h4 className="font-semibold text-amber-800 dark:text-amber-200">
            {HEALTH_DISCLAIMER.primary}
          </h4>
          <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
            <li>• {HEALTH_DISCLAIMER.secondary}</li>
            <li>• {HEALTH_DISCLAIMER.legal}</li>
          </ul>
          <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
            {HEALTH_DISCLAIMER.action}
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Scenario-specific warning
 */
export function ScenarioWarning({ className = '' }: { className?: string }) {
  return (
    <Alert variant="destructive" className={`border-amber-500 bg-amber-50 dark:bg-amber-950/30 ${className}`}>
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Historical Scenario Exploration</AlertTitle>
      <AlertDescription>
        This is a historical scenario exploration, not a medical recommendation.
        Results show what was observed in similar situations, not what will happen.
      </AlertDescription>
    </Alert>
  );
}

/**
 * Data context notice
 */
export function DataContextNotice({ 
  sources,
  methodology,
  className = ''
}: { 
  sources: string[];
  methodology?: string;
  className?: string;
}) {
  return (
    <div className={`text-xs text-muted-foreground border-t pt-3 mt-4 ${className}`}>
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        <span className="font-medium">Sources:</span>
        {sources.map((source, i) => (
          <span key={i}>{source}</span>
        ))}
      </div>
      {methodology && (
        <div className="mt-1 flex items-center gap-1">
          <ExternalLink className="h-3 w-3" />
          <a href={methodology} className="underline hover:text-foreground">
            Methodology documentation
          </a>
        </div>
      )}
    </div>
  );
}

export default HealthDisclaimer;
