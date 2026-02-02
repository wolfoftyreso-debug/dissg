/**
 * PLATFORM ROLE
 * 
 * What the platform does and doesn't do.
 * The passivity that makes adoption inevitable.
 */

import React from 'react';
import { PLATFORM_ROLE, OPPOSITION_IMPOSSIBILITY, STANDARD_CONCLUSION } from '@/config/deFactoStandardConfig';

interface PlatformRoleProps {
  language?: 'en' | 'sv';
  variant?: 'full' | 'rules' | 'statement';
  className?: string;
}

export function PlatformRole({
  language = 'en',
  variant = 'full',
  className = '',
}: PlatformRoleProps) {
  if (variant === 'statement') {
    return (
      <blockquote className={`text-xl font-medium text-center ${className}`}>
        "{PLATFORM_ROLE.youSayOnly.statement[language]}"
      </blockquote>
    );
  }

  if (variant === 'rules') {
    return (
      <div className={`space-y-4 ${className}`}>
        <div>
          <span className="text-xs text-destructive uppercase font-mono">{PLATFORM_ROLE.youDoNot.label[language]}</span>
          <div className="flex flex-wrap gap-2 mt-2">
            {PLATFORM_ROLE.youDoNot.items.map((item, i) => (
              <span key={i} className="px-3 py-1 border border-destructive/30 text-sm text-muted-foreground line-through">
                {item[language]}
              </span>
            ))}
          </div>
        </div>
        
        <div className="bg-primary/5 border-l-4 border-primary p-4">
          <span className="text-xs text-primary uppercase font-mono">{PLATFORM_ROLE.youSayOnly.label[language]}</span>
          <p className="text-lg font-bold mt-2">"{PLATFORM_ROLE.youSayOnly.statement[language]}"</p>
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div className={`border-2 border-border bg-card p-6 lg:p-8 space-y-6 ${className}`}>
      <h2 className="text-xl font-bold">{PLATFORM_ROLE.title[language]}</h2>
      
      {/* You Do Not */}
      <div>
        <span className="text-xs text-destructive uppercase tracking-wider font-mono">
          {PLATFORM_ROLE.youDoNot.label[language]}
        </span>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
          {PLATFORM_ROLE.youDoNot.items.map((item, i) => (
            <div key={i} className="text-center p-3 border border-destructive/20 bg-destructive/5">
              <span className="text-destructive text-lg">✗</span>
              <p className="text-sm mt-1 line-through text-muted-foreground">{item[language]}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* You Say Only */}
      <div className="bg-primary/5 border-2 border-primary p-6 text-center">
        <span className="text-xs text-primary uppercase tracking-wider font-mono">
          {PLATFORM_ROLE.youSayOnly.label[language]}
        </span>
        <p className="text-2xl font-bold mt-3">
          "{PLATFORM_ROLE.youSayOnly.statement[language]}"
        </p>
      </div>
      
      {/* Key Insight */}
      <div className="text-center">
        <p className="text-lg font-semibold text-primary">
          📌 {PLATFORM_ROLE.keyInsight[language]}
        </p>
      </div>
    </div>
  );
}

/**
 * WHY NO ONE CAN OPPOSE
 */
export function OppositionImpossibility({
  language = 'en',
  className = '',
}: {
  language?: 'en' | 'sv';
  className?: string;
}) {
  return (
    <div className={`border-2 border-border bg-card p-6 space-y-4 ${className}`}>
      <h3 className="font-bold">{OPPOSITION_IMPOSSIBILITY.title[language]}</h3>
      
      <p className="text-sm text-muted-foreground">{OPPOSITION_IMPOSSIBILITY.toSayNo[language]}</p>
      
      <div className="space-y-2">
        {OPPOSITION_IMPOSSIBILITY.impossibleStatements.map((stmt, i) => (
          <div key={i} className="flex items-center gap-3 p-2 bg-destructive/5 border border-destructive/20">
            <span className="text-destructive">✗</span>
            <span className="italic text-muted-foreground">{stmt[language]}</span>
          </div>
        ))}
      </div>
      
      <p className="text-sm font-medium pt-2">
        {OPPOSITION_IMPOSSIBILITY.conclusion[language]}
      </p>
    </div>
  );
}

/**
 * STANDARD CONCLUSION
 */
export function StandardConclusion({
  language = 'en',
  className = '',
}: {
  language?: 'en' | 'sv';
  className?: string;
}) {
  return (
    <div className={`text-center space-y-4 py-8 ${className}`}>
      <p className="text-xl font-semibold">
        {STANDARD_CONCLUSION.statement[language]}
      </p>
      <p className="text-muted-foreground">
        {STANDARD_CONCLUSION.reality[language]}
      </p>
      <p className="text-2xl font-bold text-primary">
        {STANDARD_CONCLUSION.final[language]}
      </p>
    </div>
  );
}
