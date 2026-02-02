/**
 * PLATFORM DISCLAIMER
 * 
 * Den obligatoriska disclaimern som ska visas överallt.
 * "This platform does not tell you what to think. It shows what can be observed."
 */

import React from 'react';
import { TRUTH_ORACLE_DOCTRINE } from '@/config/truthOracleDoctrineConfig';

interface PlatformDisclaimerProps {
  language?: 'sv' | 'en';
  variant?: 'inline' | 'footer' | 'prominent';
  className?: string;
}

export function PlatformDisclaimer({ 
  language = 'en', 
  variant = 'inline',
  className = ''
}: PlatformDisclaimerProps) {
  const disclaimer = TRUTH_ORACLE_DOCTRINE.platformDisclaimer[language];

  if (variant === 'prominent') {
    return (
      <div className={`border-2 border-border bg-muted/50 p-6 text-center ${className}`}>
        <p className="text-lg font-medium text-foreground tracking-wide">
          {disclaimer}
        </p>
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={`border-t border-border py-4 text-center ${className}`}>
        <p className="text-sm text-muted-foreground">
          {disclaimer}
        </p>
      </div>
    );
  }

  // inline variant
  return (
    <span className={`text-xs text-muted-foreground italic ${className}`}>
      {disclaimer}
    </span>
  );
}
