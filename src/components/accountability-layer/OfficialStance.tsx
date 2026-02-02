/**
 * OFFICIAL STANCE & LEGITIMACY
 * 
 * The platform's official position — always visible.
 * Why this approach is unassailable.
 */

import React from 'react';
import {
  OFFICIAL_STANCE,
  UNASSAILABLE_LOGIC,
  DECISIVE_QUESTION,
  PRACTICAL_EFFECTS,
  COMPLETION_CRITERIA,
  FINAL_TRANSLATION,
} from '@/config/inconsistencyLayerConfig';

interface OfficialStanceProps {
  language?: 'en' | 'sv';
  variant?: 'full' | 'compact' | 'statement';
  className?: string;
}

export function OfficialStance({
  language = 'en',
  variant = 'full',
  className = '',
}: OfficialStanceProps) {
  if (variant === 'statement') {
    return (
      <div className={`border-2 border-primary bg-primary/5 p-6 text-center ${className}`}>
        <p className="text-lg font-medium">"{OFFICIAL_STANCE.statement[language]}"</p>
        <p className="text-sm text-primary mt-2">{OFFICIAL_STANCE.note[language]}</p>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`border border-border bg-card p-4 ${className}`}>
        <h3 className="font-bold text-sm mb-2">{OFFICIAL_STANCE.title[language]}</h3>
        <p className="text-sm">"{OFFICIAL_STANCE.statement[language]}"</p>
      </div>
    );
  }

  // Full variant
  return (
    <div className={`space-y-8 ${className}`}>
      {/* Official Statement */}
      <div className="border-4 border-primary bg-primary/5 p-8 text-center">
        <h2 className="text-xl font-bold mb-4">{OFFICIAL_STANCE.title[language]}</h2>
        <p className="text-xl font-medium">"{OFFICIAL_STANCE.statement[language]}"</p>
        <p className="text-lg text-primary mt-4 font-semibold">{OFFICIAL_STANCE.note[language]}</p>
      </div>

      {/* Why Unassailable */}
      <UnassailableLogic language={language} />

      {/* The Decisive Question */}
      <DecisiveQuestion language={language} />

      {/* Practical Effects */}
      <PracticalEffects language={language} />

      {/* Completion Criteria */}
      <CompletionCriteria language={language} />

      {/* Final Translation */}
      <FinalTranslation language={language} />
    </div>
  );
}

function UnassailableLogic({ language }: { language: 'en' | 'sv' }) {
  return (
    <div className="border-2 border-border bg-card p-6 space-y-4">
      <h2 className="text-xl font-bold">{UNASSAILABLE_LOGIC.title[language]}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <span className="text-xs text-destructive uppercase tracking-wider">
            {language === 'en' ? 'It is not' : 'Det är inte'}
          </span>
          <ul className="mt-2 space-y-1">
            {UNASSAILABLE_LOGIC.isNot.map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-muted-foreground line-through">
                <span className="text-destructive">✗</span>
                {item[language]}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <span className="text-xs text-primary uppercase tracking-wider">
            {UNASSAILABLE_LOGIC.isSameAs.label[language]}
          </span>
          <ul className="mt-2 space-y-1">
            {UNASSAILABLE_LOGIC.isSameAs.examples.map((item, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="text-primary">≡</span>
                {item[language]}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="pt-4 border-t border-border text-center">
        <p className="font-semibold text-primary">{UNASSAILABLE_LOGIC.conclusion[language]}</p>
      </div>
    </div>
  );
}

function DecisiveQuestion({ language }: { language: 'en' | 'sv' }) {
  return (
    <div className="border-2 border-border bg-card p-6 space-y-4 text-center">
      <h2 className="text-xl font-bold">{DECISIVE_QUESTION.title[language]}</h2>
      <p className="text-muted-foreground">{DECISIVE_QUESTION.note[language]}</p>

      <div className="py-4">
        <p className="text-2xl font-bold text-primary">{DECISIVE_QUESTION.question[language]}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="p-3 bg-primary/10 border border-primary/20">
          <span className="text-primary">✓</span>
          <p className="mt-1">{DECISIVE_QUESTION.ifExists[language]}</p>
        </div>
        <div className="p-3 bg-muted border border-border">
          <span className="text-muted-foreground">∅</span>
          <p className="mt-1">{DECISIVE_QUESTION.ifNotExists[language]}</p>
        </div>
      </div>
    </div>
  );
}

function PracticalEffects({ language }: { language: 'en' | 'sv' }) {
  return (
    <div className="border-2 border-border bg-card p-6 space-y-4">
      <h2 className="text-xl font-bold">{PRACTICAL_EFFECTS.title[language]}</h2>
      <p className="text-muted-foreground">{PRACTICAL_EFFECTS.intro[language]}</p>

      <ul className="space-y-2">
        {PRACTICAL_EFFECTS.effects.map((effect, i) => (
          <li key={i} className="flex items-center gap-3 p-2 bg-muted/50">
            <span className="text-primary">→</span>
            <span>{effect[language]}</span>
          </li>
        ))}
      </ul>

      <div className="pt-4 border-t border-border">
        <p className="text-sm italic text-muted-foreground">{PRACTICAL_EFFECTS.reason[language]}</p>
      </div>
    </div>
  );
}

function CompletionCriteria({ language }: { language: 'en' | 'sv' }) {
  return (
    <div className="border-2 border-primary/30 bg-primary/5 p-6 space-y-4">
      <h2 className="text-xl font-bold">{COMPLETION_CRITERIA.title[language]}</h2>
      <p className="text-muted-foreground">{COMPLETION_CRITERIA.intro[language]}</p>

      <ul className="space-y-2">
        {COMPLETION_CRITERIA.criteria.map((criterion, i) => (
          <li key={i} className="flex items-center gap-3">
            <span className="w-6 h-6 border border-primary flex items-center justify-center text-xs font-mono text-primary">
              {i + 1}
            </span>
            <span>{criterion[language]}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FinalTranslation({ language }: { language: 'en' | 'sv' }) {
  return (
    <div className="border-4 border-border bg-card p-8 text-center space-y-4">
      <p className="text-muted-foreground">{FINAL_TRANSLATION.from[language]}</p>
      <p className="text-sm text-muted-foreground">{FINAL_TRANSLATION.to[language]}</p>

      <p className="text-3xl font-bold text-primary py-4">{FINAL_TRANSLATION.result[language]}</p>

      <div className="flex justify-center gap-4">
        {FINAL_TRANSLATION.qualities.map((q, i) => (
          <span key={i} className="text-muted-foreground">{q[language]}</span>
        ))}
      </div>
    </div>
  );
}
