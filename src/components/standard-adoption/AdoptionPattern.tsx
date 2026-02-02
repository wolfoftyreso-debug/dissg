/**
 * ADOPTION PATTERN
 * 
 * How standards actually get adopted — never formally first.
 */

import React from 'react';
import { ADOPTION_PATTERN } from '@/config/deFactoStandardConfig';

interface AdoptionPatternProps {
  language?: 'en' | 'sv';
  variant?: 'full' | 'steps' | 'compact';
  className?: string;
}

export function AdoptionPattern({
  language = 'en',
  variant = 'full',
  className = '',
}: AdoptionPatternProps) {
  if (variant === 'compact') {
    return (
      <div className={`text-center ${className}`}>
        <p className="text-lg font-medium">{ADOPTION_PATTERN.keyInsight[language]}</p>
      </div>
    );
  }

  if (variant === 'steps') {
    return (
      <div className={`space-y-3 ${className}`}>
        {ADOPTION_PATTERN.steps.map((step, i) => (
          <div key={i} className="flex items-center gap-4">
            <span className="w-8 h-8 border-2 border-primary flex items-center justify-center text-sm font-bold text-primary">
              {i + 1}
            </span>
            <span>{step[language]}</span>
          </div>
        ))}
      </div>
    );
  }

  // Full variant
  return (
    <div className={`border-2 border-border bg-card p-6 lg:p-8 space-y-6 ${className}`}>
      <h2 className="text-xl font-bold">{ADOPTION_PATTERN.title[language]}</h2>
      
      {/* Steps */}
      <div className="space-y-4">
        {ADOPTION_PATTERN.steps.map((step, i) => (
          <div key={i} className="flex items-start gap-4">
            <span className="w-10 h-10 border-2 border-primary flex items-center justify-center font-bold text-primary flex-shrink-0">
              {i + 1}
            </span>
            <p className="text-lg pt-1.5">{step[language]}</p>
          </div>
        ))}
      </div>
      
      {/* Examples */}
      <div className="pt-4 border-t border-border">
        <p className="text-sm text-muted-foreground mb-2">
          {language === 'en' ? 'No one voted on:' : 'Ingen röstade om:'}
        </p>
        <div className="flex flex-wrap gap-2">
          {ADOPTION_PATTERN.examples.map((ex, i) => (
            <span key={i} className="px-3 py-1 bg-muted text-sm font-mono">
              {ex}
            </span>
          ))}
        </div>
      </div>
      
      {/* Key Insight */}
      <div className="pt-4 border-t border-border text-center">
        <p className="text-lg font-semibold text-primary">
          {ADOPTION_PATTERN.keyInsight[language]}
        </p>
      </div>
    </div>
  );
}
