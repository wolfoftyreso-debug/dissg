/**
 * WHAT WE CANNOT SAY – EXPLICIT NEGATIVE SPACE
 * 
 * Systemet ska ha ett explicit negativt utrymme.
 * "Institutions trust systems that know what they do not know."
 */

import React from 'react';
import { TRANSPARENCY_LAYER_PROMPT_PART_II } from '@/config/masterPromptConfig';

interface NegativeSpaceItem {
  question: string;
  reason?: string;
}

interface WhatWeCannotSayProps {
  language?: 'sv' | 'en';
  cannotCommentOn?: NegativeSpaceItem[];
  questionsLackingData?: NegativeSpaceItem[];
  uncertaintyTooLarge?: NegativeSpaceItem[];
  className?: string;
}

export function WhatWeCannotSay({
  language = 'en',
  cannotCommentOn = [],
  questionsLackingData = [],
  uncertaintyTooLarge = [],
  className = '',
}: WhatWeCannotSayProps) {
  const config = TRANSPARENCY_LAYER_PROMPT_PART_II.negativeSpace;

  const labels = {
    en: {
      title: 'What This Does Not Show',
      cannotComment: 'What we cannot comment on',
      lackData: 'Questions lacking data',
      tooUncertain: 'Where uncertainty is too large',
      emptyState: 'Explicit limitations for this topic are not yet defined.',
    },
    sv: {
      title: 'Vad detta inte visar',
      cannotComment: 'Vad vi inte kan uttala oss om',
      lackData: 'Frågor som saknar data',
      tooUncertain: 'Där osäkerheten är för stor',
      emptyState: 'Explicita begränsningar för detta ämne är ännu inte definierade.',
    },
  }[language];

  const hasContent = 
    cannotCommentOn.length > 0 || 
    questionsLackingData.length > 0 || 
    uncertaintyTooLarge.length > 0;

  return (
    <div className={`border-2 border-dashed border-muted-foreground/30 bg-muted/20 p-5 space-y-4 ${className}`}>
      <div className="flex items-center gap-3">
        <span className="w-8 h-8 border-2 border-muted-foreground/50 flex items-center justify-center text-lg">
          ∅
        </span>
        <h3 className="font-semibold tracking-wide">{labels.title}</h3>
      </div>

      {hasContent ? (
        <div className="space-y-4">
          {cannotCommentOn.length > 0 && (
            <section>
              <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                {labels.cannotComment}
              </h4>
              <ul className="space-y-2">
                {cannotCommentOn.map((item, i) => (
                  <li key={i} className="text-sm">
                    <span className="font-medium">{item.question}</span>
                    {item.reason && (
                      <span className="text-muted-foreground ml-2">— {item.reason}</span>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {questionsLackingData.length > 0 && (
            <section>
              <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                {labels.lackData}
              </h4>
              <ul className="space-y-2">
                {questionsLackingData.map((item, i) => (
                  <li key={i} className="text-sm">
                    <span className="font-medium">{item.question}</span>
                    {item.reason && (
                      <span className="text-muted-foreground ml-2">— {item.reason}</span>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {uncertaintyTooLarge.length > 0 && (
            <section>
              <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                {labels.tooUncertain}
              </h4>
              <ul className="space-y-2">
                {uncertaintyTooLarge.map((item, i) => (
                  <li key={i} className="text-sm">
                    <span className="font-medium">{item.question}</span>
                    {item.reason && (
                      <span className="text-muted-foreground ml-2">— {item.reason}</span>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground italic">{labels.emptyState}</p>
      )}

      <div className="pt-3 border-t border-muted-foreground/20">
        <p className="text-xs text-muted-foreground">
          {config.institutionalBenefit}
        </p>
      </div>
    </div>
  );
}
