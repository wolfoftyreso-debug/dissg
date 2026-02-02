/**
 * LEGAL & MORAL SHIELD
 * 
 * Alltid synlig text som skyddar plattformen juridiskt.
 * "We own the presentation, not the reality."
 */

import React from 'react';
import { TRANSPARENCY_LAYER_PROMPT_PART_II } from '@/config/masterPromptConfig';

interface LegalMoralShieldProps {
  language?: 'sv' | 'en';
  variant?: 'banner' | 'footer' | 'inline' | 'prominent';
  className?: string;
}

export function LegalMoralShield({
  language = 'en',
  variant = 'footer',
  className = '',
}: LegalMoralShieldProps) {
  const shield = TRANSPARENCY_LAYER_PROMPT_PART_II.legalShield;
  const text = shield.alwaysVisibleText[language];

  if (variant === 'inline') {
    return (
      <span className={`text-xs text-muted-foreground ${className}`}>
        {text}
      </span>
    );
  }

  if (variant === 'banner') {
    return (
      <div className={`bg-muted/50 border-y border-border py-2 px-4 ${className}`}>
        <p className="text-xs text-center text-muted-foreground tracking-wide">
          {text}
        </p>
      </div>
    );
  }

  if (variant === 'prominent') {
    return (
      <div className={`border-2 border-border bg-card p-6 ${className}`}>
        <div className="flex items-start gap-4">
          <span className="w-10 h-10 border-2 border-border flex items-center justify-center text-lg flex-shrink-0">
            ⚖
          </span>
          <div>
            <p className="text-sm font-medium leading-relaxed">{text}</p>
            <p className="text-xs text-muted-foreground mt-2 italic">
              {shield.principle}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Footer variant (default)
  return (
    <div className={`border-t border-border py-4 ${className}`}>
      <p className="text-xs text-center text-muted-foreground">{text}</p>
    </div>
  );
}
