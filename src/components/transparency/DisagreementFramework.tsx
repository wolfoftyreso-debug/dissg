/**
 * DISAGREEMENT WITHOUT CHAOS
 * 
 * "Users may disagree on interpretation. The underlying observations remain shared."
 */

import React from 'react';
import { TRANSPARENCY_LAYER_PROMPT_PART_II } from '@/config/masterPromptConfig';

interface DisagreementFrameworkProps {
  language?: 'sv' | 'en';
  variant?: 'banner' | 'card' | 'inline';
  className?: string;
}

export function DisagreementFramework({
  language = 'en',
  variant = 'card',
  className = '',
}: DisagreementFrameworkProps) {
  const framework = TRANSPARENCY_LAYER_PROMPT_PART_II.disagreementFramework;
  const text = framework.standardFormulation[language];

  const labels = {
    en: {
      title: 'Shared Facts, Diverse Views',
      enables: 'This platform enables',
      doesNotEnable: 'This platform does not enable',
    },
    sv: {
      title: 'Delade fakta, olika tolkningar',
      enables: 'Denna plattform möjliggör',
      doesNotEnable: 'Denna plattform möjliggör inte',
    },
  }[language];

  if (variant === 'inline') {
    return (
      <span className={`text-xs text-muted-foreground italic ${className}`}>
        {text}
      </span>
    );
  }

  if (variant === 'banner') {
    return (
      <div className={`bg-primary/5 border border-primary/20 py-3 px-4 ${className}`}>
        <p className="text-sm text-center">{text}</p>
      </div>
    );
  }

  // Card variant (default)
  return (
    <div className={`border border-border bg-card p-5 space-y-4 ${className}`}>
      <h3 className="font-semibold flex items-center gap-2">
        <span className="w-6 h-6 border border-border flex items-center justify-center text-sm">
          ⇔
        </span>
        {labels.title}
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
            {labels.enables}
          </h4>
          <ul className="space-y-1">
            {framework.enables.map((item, i) => (
              <li key={i} className="text-sm flex items-center gap-2">
                <span className="text-primary">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
            {labels.doesNotEnable}
          </h4>
          <ul className="space-y-1">
            {framework.doesNotEnable.map((item, i) => (
              <li key={i} className="text-sm flex items-center gap-2">
                <span className="text-destructive">✗</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="pt-4 border-t border-border">
        <p className="text-sm italic text-center">{text}</p>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        {framework.insight}
      </p>
    </div>
  );
}
