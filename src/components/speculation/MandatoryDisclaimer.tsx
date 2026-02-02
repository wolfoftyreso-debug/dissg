/**
 * 🛑 BLOCK 51 — MANDATORY DISCLAIMER
 * 
 * Displays required disclaimers based on topic.
 * These CANNOT be removed.
 * 
 * On all pages where people normally guess
 * (nutrition, health, violence, economy, migration):
 * 
 * "These data describe population-level patterns only."
 * "They do not predict individual outcomes."
 * "No recommendations are made."
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { getRequiredDisclaimers, MANDATORY_DISCLAIMERS } from '@/config/zeroSpeculationConfig';

interface MandatoryDisclaimerProps {
  /** Topic category (nutrition, health, economy, etc.) */
  topic: string;
  /** Additional custom disclaimers */
  additional?: string[];
  /** Visual style */
  variant?: 'default' | 'prominent' | 'inline';
  className?: string;
}

/**
 * Mandatory Disclaimer Component
 * 
 * Displays topic-appropriate disclaimers that cannot be removed.
 */
export function MandatoryDisclaimer({ 
  topic, 
  additional = [],
  variant = 'default',
  className 
}: MandatoryDisclaimerProps) {
  const disclaimers = getRequiredDisclaimers(topic);
  const allDisclaimers = [...disclaimers, ...additional];

  if (variant === 'inline') {
    return (
      <p className={cn('text-xs text-muted-foreground italic', className)}>
        {allDisclaimers.join(' ')}
      </p>
    );
  }

  if (variant === 'prominent') {
    return (
      <div className={cn(
        'bg-muted border-l-4 border-status-warning px-4 py-3 rounded-r',
        className
      )}>
        <div className="text-xs font-semibold uppercase tracking-wider text-status-warning mb-2">
          Important Notice
        </div>
        <ul className="space-y-1">
          {allDisclaimers.map((disclaimer, index) => (
            <li key={index} className="text-sm text-foreground/80">
              {disclaimer}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // Default variant
  return (
    <div className={cn(
      'bg-muted/50 border border-border rounded px-4 py-3',
      className
    )}>
      <ul className="space-y-1">
        {allDisclaimers.map((disclaimer, index) => (
          <li key={index} className="text-sm text-muted-foreground">
            {disclaimer}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Quick access to standard disclaimers
 */
export function StandardDisclaimer({ className }: { className?: string }) {
  return (
    <p className={cn('text-xs text-muted-foreground', className)}>
      {MANDATORY_DISCLAIMERS.standard} {MANDATORY_DISCLAIMERS.individual} {MANDATORY_DISCLAIMERS.noRecommendation}
    </p>
  );
}

export default MandatoryDisclaimer;
