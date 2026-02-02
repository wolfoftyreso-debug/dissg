/**
 * RESPONSIBILITY DISCLAIMER
 * 
 * Legally critical component showing platform vs user responsibility.
 */

import React from 'react';
import { RESPONSIBILITY_MODEL } from '@/config/businessModelConfig';

interface ResponsibilityDisclaimerProps {
  language?: 'en' | 'sv';
  variant?: 'compact' | 'full' | 'legal';
  className?: string;
}

export function ResponsibilityDisclaimer({
  language = 'en',
  variant = 'compact',
  className = '',
}: ResponsibilityDisclaimerProps) {
  if (variant === 'legal') {
    return (
      <div className={`border-2 border-primary/30 bg-primary/5 p-6 ${className}`}>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">⚖️</span>
          <h3 className="font-bold">{RESPONSIBILITY_MODEL.title[language]}</h3>
        </div>
        <p className="text-lg font-medium border-l-4 border-primary pl-4">
          {RESPONSIBILITY_MODEL.legalStatement[language]}
        </p>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <p className={`text-sm text-muted-foreground italic ${className}`}>
        {RESPONSIBILITY_MODEL.legalStatement[language]}
      </p>
    );
  }

  return (
    <div className={`border-2 border-border bg-card p-6 space-y-6 ${className}`}>
      <h3 className="font-bold text-lg flex items-center gap-2">
        <span>⚖️</span>
        {RESPONSIBILITY_MODEL.title[language]}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <h4 className="font-medium text-primary">{RESPONSIBILITY_MODEL.platformProvides.label[language]}</h4>
          <ul className="space-y-1">
            {RESPONSIBILITY_MODEL.platformProvides.items.map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-sm">
                <span className="text-primary">✓</span>
                {item[language]}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium text-destructive">{RESPONSIBILITY_MODEL.platformDoesNot.label[language]}</h4>
          <ul className="space-y-1">
            {RESPONSIBILITY_MODEL.platformDoesNot.items.map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-sm">
                <span className="text-destructive">✗</span>
                {item[language]}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium text-amber-600">{RESPONSIBILITY_MODEL.userResponsibility.label[language]}</h4>
          <ul className="space-y-1">
            {RESPONSIBILITY_MODEL.userResponsibility.items.map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-sm">
                <span className="text-amber-600">→</span>
                {item[language]}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="pt-4 border-t border-border">
        <p className="font-medium text-center">"{RESPONSIBILITY_MODEL.legalStatement[language]}"</p>
      </div>
    </div>
  );
}
