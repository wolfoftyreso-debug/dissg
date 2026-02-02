/**
 * COMPARISON FRAMEWORK
 * 
 * The three-point comparison: Objective → Action → Outcome
 */

import React from 'react';
import { COMPARISON_FRAMEWORK } from '@/config/inconsistencyLayerConfig';

interface ComparisonFrameworkProps {
  language?: 'en' | 'sv';
  variant?: 'full' | 'compact' | 'visual';
  className?: string;
}

export function ComparisonFramework({
  language = 'en',
  variant = 'full',
  className = '',
}: ComparisonFrameworkProps) {
  if (variant === 'compact') {
    return (
      <div className={`flex items-center justify-center gap-4 ${className}`}>
        {COMPARISON_FRAMEWORK.points.map((point, i) => (
          <React.Fragment key={point.id}>
            <div className="text-center">
              <div className="w-10 h-10 border-2 border-primary flex items-center justify-center font-bold text-primary mx-auto">
                {point.order}
              </div>
              <p className="text-sm font-medium mt-2">{point.label[language]}</p>
            </div>
            {i < COMPARISON_FRAMEWORK.points.length - 1 && (
              <span className="text-2xl text-muted-foreground">→</span>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  }

  if (variant === 'visual') {
    return (
      <div className={`space-y-4 ${className}`}>
        {COMPARISON_FRAMEWORK.points.map((point, i) => (
          <div key={point.id} className="flex items-start gap-4">
            <div className="w-12 h-12 border-2 border-primary flex items-center justify-center font-bold text-primary shrink-0">
              {point.order}
            </div>
            <div className="flex-1">
              <h3 className="font-bold">{point.label[language]}</h3>
              <p className="text-muted-foreground">{point.question[language]}</p>
              <p className="text-sm text-muted-foreground italic mt-1">({point.examples[language]})</p>
            </div>
            {i < COMPARISON_FRAMEWORK.points.length - 1 && (
              <div className="w-12 flex items-center justify-center">
                <span className="text-2xl text-muted-foreground">↓</span>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  // Full variant
  return (
    <div className={`border-2 border-border bg-card p-6 space-y-6 ${className}`}>
      <div className="text-center">
        <h2 className="text-xl font-bold">{COMPARISON_FRAMEWORK.title[language]}</h2>
        <p className="text-muted-foreground">{COMPARISON_FRAMEWORK.subtitle[language]}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {COMPARISON_FRAMEWORK.points.map((point) => (
          <div key={point.id} className="border border-border bg-muted/30 p-4 text-center space-y-2">
            <div className="w-12 h-12 border-2 border-primary flex items-center justify-center font-bold text-2xl text-primary mx-auto">
              {point.order}
            </div>
            <h3 className="font-bold">{point.label[language]}</h3>
            <p className="text-sm text-muted-foreground">{point.question[language]}</p>
            <p className="text-xs text-muted-foreground italic">({point.examples[language]})</p>
          </div>
        ))}
      </div>

      <div className="text-center pt-4 border-t border-border">
        <p className="font-semibold text-primary">{COMPARISON_FRAMEWORK.principle[language]}</p>
      </div>
    </div>
  );
}
