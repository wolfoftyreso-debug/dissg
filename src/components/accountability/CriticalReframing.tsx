/**
 * THE CRITICAL REFRAMING
 * 
 * Don't say: "You must use this."
 * Say: "Show which factual basis you use — and make it comparable."
 */

import React from 'react';
import { CRITICAL_REFRAMING, INSTITUTIONAL_CLAIMS } from '@/config/accountabilityPrincipleConfig';

interface CriticalReframingProps {
  language?: 'en' | 'sv';
  variant?: 'full' | 'compact' | 'comparison';
  className?: string;
}

export function CriticalReframing({
  language = 'en',
  variant = 'full',
  className = '',
}: CriticalReframingProps) {
  const labels = {
    en: {
      title: 'The Critical Reframing',
      doNotSay: 'Do NOT say',
      say: 'Say',
      ifGood: 'If they have good basis',
      ifNot: 'If they do not',
    },
    sv: {
      title: 'Den avgörande omformuleringen',
      doNotSay: 'Säg INTE',
      say: 'Säg',
      ifGood: 'Om de redan har bra underlag',
      ifNot: 'Om de inte har det',
    },
  }[language];

  if (variant === 'compact') {
    return (
      <div className={`space-y-3 ${className}`}>
        <div className="flex items-start gap-4">
          <span className="text-destructive">✗</span>
          <span className="line-through text-muted-foreground">"{CRITICAL_REFRAMING.doNotSay[language]}"</span>
        </div>
        <div className="flex items-start gap-4">
          <span className="text-primary">✓</span>
          <span className="font-medium">"{CRITICAL_REFRAMING.say[language]}"</span>
        </div>
      </div>
    );
  }

  if (variant === 'comparison') {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`}>
        <div className="border-2 border-destructive/30 bg-destructive/5 p-4">
          <span className="text-xs text-destructive uppercase tracking-wider font-mono">{labels.doNotSay}</span>
          <p className="mt-2 text-lg line-through text-muted-foreground">
            "{CRITICAL_REFRAMING.doNotSay[language]}"
          </p>
        </div>
        <div className="border-2 border-primary/30 bg-primary/5 p-4">
          <span className="text-xs text-primary uppercase tracking-wider font-mono">{labels.say}</span>
          <p className="mt-2 text-lg font-medium">
            "{CRITICAL_REFRAMING.say[language]}"
          </p>
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div className={`border-2 border-border bg-card p-6 lg:p-8 space-y-6 ${className}`}>
      <h2 className="text-xl font-bold">{labels.title}</h2>
      
      {/* Do Not Say vs Say */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <span className="inline-block px-2 py-1 text-xs font-mono uppercase bg-destructive/10 text-destructive">
            {labels.doNotSay}
          </span>
          <p className="text-xl line-through text-muted-foreground">
            "{CRITICAL_REFRAMING.doNotSay[language]}"
          </p>
        </div>
        
        <div className="space-y-2">
          <span className="inline-block px-2 py-1 text-xs font-mono uppercase bg-primary/10 text-primary">
            {labels.say}
          </span>
          <p className="text-xl font-semibold">
            "{CRITICAL_REFRAMING.say[language]}"
          </p>
        </div>
      </div>
      
      {/* Consequences */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border">
        <div className="flex items-start gap-3">
          <span className="text-primary text-xl">✓</span>
          <div>
            <span className="text-sm text-muted-foreground">{labels.ifGood}:</span>
            <p className="font-medium">{CRITICAL_REFRAMING.ifTheyHaveGoodBasis[language]}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <span className="text-primary text-xl">✓</span>
          <div>
            <span className="text-sm text-muted-foreground">{labels.ifNot}:</span>
            <p className="font-medium">{CRITICAL_REFRAMING.ifTheyDont[language]}</p>
          </div>
        </div>
      </div>
      
      {/* Conclusion */}
      <div className="pt-4 border-t border-border text-center">
        <p className="text-lg font-semibold text-primary">
          📌 {CRITICAL_REFRAMING.conclusion[language]}
        </p>
      </div>
    </div>
  );
}

/**
 * What Institutions Already Claim
 */
export function InstitutionalClaims({
  language = 'en',
  className = '',
}: {
  language?: 'en' | 'sv';
  className?: string;
}) {
  const labels = {
    en: {
      title: 'What They Already Claim',
      theNextStep: 'The Next, Inevitable Step',
    },
    sv: {
      title: 'Vad de redan påstår',
      theNextStep: 'Det nästa, oundvikliga steget',
    },
  }[language];

  return (
    <div className={`space-y-6 ${className}`}>
      <div>
        <h3 className="text-sm font-mono text-muted-foreground uppercase tracking-wider mb-3">
          {labels.title}
        </h3>
        <ul className="space-y-2">
          {INSTITUTIONAL_CLAIMS.whatTheyAlreadySay.map((claim, i) => (
            <li key={i} className="flex items-center gap-3">
              <span className="w-6 h-6 border border-muted-foreground/30 flex items-center justify-center text-xs text-muted-foreground">
                "
              </span>
              <span className="text-muted-foreground italic">{claim[language]}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="bg-primary/5 border-l-4 border-primary p-4">
        <span className="text-xs font-mono text-primary uppercase tracking-wider">
          {labels.theNextStep}
        </span>
        <p className="text-xl font-bold mt-2">
          "{INSTITUTIONAL_CLAIMS.theNextStep[language]}"
        </p>
      </div>
      
      <p className="text-sm text-muted-foreground italic text-center">
        {INSTITUTIONAL_CLAIMS.consequence[language]}
      </p>
    </div>
  );
}
