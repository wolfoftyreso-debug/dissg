/**
 * THE MINIMUM STANDARD
 * 
 * "This is not a tool — it is a minimum standard."
 * 
 * If you cannot point to an open, reproducible basis
 * that shows why this particular prioritization is reasonable —
 * then the decision lacks legitimate foundation.
 */

import React from 'react';
import { MINIMUM_STANDARD, FINAL_INSIGHT } from '@/config/accountabilityPrincipleConfig';

interface MinimumStandardProps {
  language?: 'en' | 'sv';
  variant?: 'full' | 'statement' | 'banner';
  className?: string;
}

export function MinimumStandard({
  language = 'en',
  variant = 'full',
  className = '',
}: MinimumStandardProps) {
  if (variant === 'statement') {
    return (
      <p className={`text-lg ${className}`}>
        {MINIMUM_STANDARD.statement[language]}
      </p>
    );
  }

  if (variant === 'banner') {
    return (
      <div className={`bg-primary/5 border-y border-primary/20 py-6 px-4 text-center ${className}`}>
        <p className="font-semibold text-lg max-w-2xl mx-auto">
          {MINIMUM_STANDARD.statement[language]}
        </p>
      </div>
    );
  }

  // Full variant
  return (
    <div className={`border-4 border-border bg-card p-8 lg:p-12 space-y-8 ${className}`}>
      {/* Title */}
      <div className="text-center">
        <span className="inline-block text-xs font-mono uppercase tracking-widest px-3 py-1 border border-border bg-muted">
          📐 {language === 'en' ? 'Definition' : 'Definition'}
        </span>
        <h1 className="text-2xl lg:text-3xl font-bold mt-4">
          {MINIMUM_STANDARD.title[language]}
        </h1>
      </div>
      
      {/* Statement */}
      <blockquote className="text-xl lg:text-2xl text-center leading-relaxed max-w-3xl mx-auto border-l-4 border-primary pl-6 py-4">
        {MINIMUM_STANDARD.statement[language]}
      </blockquote>
      
      {/* What It Is */}
      <div className="flex justify-center gap-4 flex-wrap">
        {MINIMUM_STANDARD.whatItIs.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-muted-foreground">×</span>
            <span className="text-muted-foreground">{item[language]}</span>
          </div>
        ))}
      </div>
      
      {/* Only This */}
      <div className="text-center pt-4 border-t border-border">
        <p className="text-2xl font-bold text-primary">
          {MINIMUM_STANDARD.onlyThis[language]}
        </p>
      </div>
    </div>
  );
}

/**
 * THE FINAL INSIGHT
 */
export function FinalInsight({
  language = 'en',
  className = '',
}: {
  language?: 'en' | 'sv';
  className?: string;
}) {
  return (
    <div className={`text-center space-y-4 py-8 ${className}`}>
      <p className="text-xl font-semibold">
        {FINAL_INSIGHT.statement[language]}
      </p>
      <p className="text-muted-foreground">
        {FINAL_INSIGHT.reality[language]}
      </p>
      <p className="text-2xl font-bold text-primary">
        {FINAL_INSIGHT.conclusion[language]}
      </p>
    </div>
  );
}
