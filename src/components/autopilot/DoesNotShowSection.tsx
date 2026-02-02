/**
 * 🔁 BLOCK 53 — "WHAT THE DATA DOES NOT SHOW" SECTION
 * 
 * Automatically surfaces limitations when misinterpretation is detected.
 * Moves up when:
 * - Misinterpretation rate > 20%
 * - Backtracking rate > 30%
 * - Exit before summary > 40%
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';
import { DOES_NOT_SHOW_CONFIG } from '@/config/autopilotConfig';

interface DoesNotShowSectionProps {
  /** Custom limitations text (optional) */
  limitations?: string[];
  /** Position priority (higher = more prominent) */
  priority?: 'normal' | 'high' | 'critical';
  /** Topic-specific limitations */
  topicLimitations?: {
    noIndividualEffects?: boolean;
    noCausalClaims?: boolean;
    noRecommendations?: boolean;
    noPredictions?: boolean;
  };
  className?: string;
}

/**
 * What the data does NOT show section
 */
export function DoesNotShowSection({
  limitations,
  priority = 'normal',
  topicLimitations = {},
  className,
}: DoesNotShowSectionProps) {
  // Build limitations list
  const allLimitations: string[] = limitations || [];
  
  if (topicLimitations.noIndividualEffects) {
    allLimitations.push('individual effects or outcomes');
  }
  if (topicLimitations.noCausalClaims) {
    allLimitations.push('causal relationships');
  }
  if (topicLimitations.noRecommendations) {
    allLimitations.push('recommendations or advice');
  }
  if (topicLimitations.noPredictions) {
    allLimitations.push('predictions or forecasts');
  }

  // Default if nothing specified
  if (allLimitations.length === 0) {
    allLimitations.push('individual effects', 'causes', 'recommendations');
  }

  // Format the text
  const text = allLimitations.length === 1
    ? `These data do not show ${allLimitations[0]}.`
    : `These data do not show ${allLimitations.slice(0, -1).join(', ')} or ${allLimitations.slice(-1)}.`;

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-lg border',
        priority === 'normal' && 'bg-muted/30 border-border',
        priority === 'high' && 'bg-status-warning/10 border-status-warning/30',
        priority === 'critical' && 'bg-status-critical/10 border-status-critical/30',
        className
      )}
      role="note"
      aria-label="Data limitations"
    >
      <AlertCircle className={cn(
        'h-5 w-5 flex-shrink-0 mt-0.5',
        priority === 'normal' && 'text-muted-foreground',
        priority === 'high' && 'text-status-warning',
        priority === 'critical' && 'text-status-critical',
      )} />
      <div>
        <div className={cn(
          'text-xs font-semibold uppercase tracking-wider mb-1',
          priority === 'normal' && 'text-muted-foreground',
          priority === 'high' && 'text-status-warning',
          priority === 'critical' && 'text-status-critical',
        )}>
          What this data does not show
        </div>
        <p className={cn(
          'text-sm',
          priority === 'normal' && 'text-foreground',
          priority === 'high' && 'text-foreground font-medium',
          priority === 'critical' && 'text-foreground font-semibold',
        )}>
          {text}
        </p>
      </div>
    </div>
  );
}

/**
 * Compact inline version
 */
export function DoesNotShowInline({ className }: { className?: string }) {
  return (
    <span className={cn(
      'text-xs text-muted-foreground italic',
      className
    )}>
      {DOES_NOT_SHOW_CONFIG.standardText}
    </span>
  );
}

/**
 * Determine priority based on page metrics
 */
export function determinePriority(metrics: {
  misinterpretationRate?: number;
  backtrackingRate?: number;
  exitBeforeSummary?: number;
}): 'normal' | 'high' | 'critical' {
  const { moveUpWhen } = DOES_NOT_SHOW_CONFIG;

  if (
    (metrics.misinterpretationRate || 0) > moveUpWhen.misinterpretationRate * 1.5 ||
    (metrics.backtrackingRate || 0) > moveUpWhen.backtrackingRate * 1.5 ||
    (metrics.exitBeforeSummary || 0) > moveUpWhen.exitBeforeSummary * 1.5
  ) {
    return 'critical';
  }

  if (
    (metrics.misinterpretationRate || 0) > moveUpWhen.misinterpretationRate ||
    (metrics.backtrackingRate || 0) > moveUpWhen.backtrackingRate ||
    (metrics.exitBeforeSummary || 0) > moveUpWhen.exitBeforeSummary
  ) {
    return 'high';
  }

  return 'normal';
}

export default DoesNotShowSection;
