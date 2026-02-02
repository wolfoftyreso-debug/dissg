/**
 * THE DECISIVE MOMENT
 * 
 * The moment when it's over — when the debate shifts from
 * "Who is right?" to "Why didn't you use the reference?"
 */

import React from 'react';
import { DECISIVE_MOMENT } from '@/config/deFactoStandardConfig';

interface DecisiveMomentProps {
  language?: 'en' | 'sv';
  variant?: 'full' | 'shift' | 'compact';
  className?: string;
}

export function DecisiveMoment({
  language = 'en',
  variant = 'full',
  className = '',
}: DecisiveMomentProps) {
  if (variant === 'compact') {
    return (
      <div className={`text-center ${className}`}>
        <p className="font-bold text-lg">{DECISIVE_MOMENT.conclusion[language]}</p>
      </div>
    );
  }

  if (variant === 'shift') {
    return (
      <div className={`flex items-center justify-center gap-6 ${className}`}>
        <div className="text-center">
          <span className="text-xs text-muted-foreground uppercase">
            {language === 'en' ? 'From' : 'Från'}
          </span>
          <p className="text-lg font-medium text-muted-foreground line-through mt-1">
            {DECISIVE_MOMENT.shiftFrom[language]}
          </p>
        </div>
        
        <span className="text-2xl text-primary">→</span>
        
        <div className="text-center">
          <span className="text-xs text-primary uppercase">
            {language === 'en' ? 'To' : 'Till'}
          </span>
          <p className="text-lg font-bold mt-1">
            {DECISIVE_MOMENT.shiftTo[language]}
          </p>
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div className={`border-4 border-border bg-card p-6 lg:p-8 space-y-6 ${className}`}>
      <h2 className="text-xl font-bold text-center">{DECISIVE_MOMENT.title[language]}</h2>
      
      {/* Trigger */}
      <div className="text-center">
        <span className="inline-block text-xs font-mono uppercase tracking-wider px-2 py-1 bg-muted">
          {language === 'en' ? 'Trigger' : 'Trigger'}
        </span>
        <p className="text-lg mt-3">{DECISIVE_MOMENT.trigger[language]}</p>
      </div>
      
      {/* Consequences */}
      <div className="space-y-2">
        <span className="text-xs text-muted-foreground uppercase">
          {language === 'en' ? 'Then this happens:' : 'Då händer detta:'}
        </span>
        <div className="flex flex-wrap gap-3">
          {DECISIVE_MOMENT.consequences.map((c, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-primary">→</span>
              <span>{c[language]}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* The Shift */}
      <div className="pt-6 border-t border-border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div className="text-center p-4 border border-border bg-muted/50">
            <span className="text-xs text-muted-foreground uppercase">
              {language === 'en' ? 'From' : 'Från'}
            </span>
            <p className="text-2xl font-medium text-muted-foreground line-through mt-2">
              {DECISIVE_MOMENT.shiftFrom[language]}
            </p>
          </div>
          
          <div className="text-center p-4 border-2 border-primary bg-primary/5">
            <span className="text-xs text-primary uppercase">
              {language === 'en' ? 'To' : 'Till'}
            </span>
            <p className="text-2xl font-bold mt-2">
              {DECISIVE_MOMENT.shiftTo[language]}
            </p>
          </div>
        </div>
      </div>
      
      {/* Conclusion */}
      <div className="text-center pt-4">
        <p className="text-xl font-bold text-primary">
          📌 {DECISIVE_MOMENT.conclusion[language]}
        </p>
      </div>
    </div>
  );
}
