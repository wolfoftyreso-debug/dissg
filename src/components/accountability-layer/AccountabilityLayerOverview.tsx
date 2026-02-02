/**
 * ACCOUNTABILITY LAYER OVERVIEW
 * 
 * Complete presentation of the Inconsistency & Accountability Layer.
 * When decisions, motives and outcomes don't align.
 */

import React from 'react';
import { ComparisonFramework } from './ComparisonFramework';
import { InconsistencyClasses } from './InconsistencyClasses';
import { OfficialStance } from './OfficialStance';
import { INCONSISTENCY_TRIGGERS, PRESENTATION_RULES } from '@/config/inconsistencyLayerConfig';

interface AccountabilityLayerOverviewProps {
  language?: 'en' | 'sv';
  className?: string;
}

export function AccountabilityLayerOverview({
  language = 'en',
  className = '',
}: AccountabilityLayerOverviewProps) {
  const labels = {
    en: {
      title: 'Inconsistency & Accountability Layer',
      subtitle: 'When decisions, motives and outcomes don\'t align',
      tagline: 'This is not review. This is disclosure.',
      section1: 'The Comparison Framework',
      section2: 'When Inconsistency Is Flagged',
      section3: 'Four Classes of Inconsistency',
      section4: 'How It Is Presented',
      section5: 'Official Stance & Legitimacy',
    },
    sv: {
      title: 'Inkonsistens- och ansvarslager',
      subtitle: 'När beslut, motiv och utfall inte linjerar',
      tagline: 'Detta är inte granskning. Detta är redovisning.',
      section1: 'Jämförelseramverket',
      section2: 'När inkonsistens markeras',
      section3: 'Fyra klasser av inkonsistens',
      section4: 'Hur det presenteras',
      section5: 'Officiell hållning & legitimitet',
    },
  }[language];

  return (
    <div className={`space-y-16 ${className}`}>
      {/* Header */}
      <header className="text-center space-y-4">
        <div className="w-20 h-20 mx-auto border-4 border-primary flex items-center justify-center text-4xl">
          ⚖️
        </div>
        <h1 className="text-3xl lg:text-4xl font-bold">{labels.title}</h1>
        <p className="text-lg text-muted-foreground">{labels.subtitle}</p>
        <p className="text-xl font-semibold text-primary">{labels.tagline}</p>
      </header>

      {/* Section 1: Comparison Framework */}
      <section>
        <SectionHeader number={1} title={labels.section1} />
        <ComparisonFramework language={language} variant="full" />
      </section>

      {/* Section 2: Inconsistency Triggers */}
      <section>
        <SectionHeader number={2} title={labels.section2} />
        <InconsistencyTriggers language={language} />
      </section>

      {/* Section 3: Four Classes */}
      <section>
        <SectionHeader number={3} title={labels.section3} />
        <InconsistencyClasses language={language} variant="full" />
      </section>

      {/* Section 4: Presentation Rules */}
      <section>
        <SectionHeader number={4} title={labels.section4} />
        <PresentationRules language={language} />
      </section>

      {/* Section 5: Official Stance */}
      <section>
        <SectionHeader number={5} title={labels.section5} />
        <OfficialStance language={language} variant="full" />
      </section>
    </div>
  );
}

function SectionHeader({ number, title }: { number: number; title: string }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <span className="w-10 h-10 border-2 border-primary flex items-center justify-center font-bold text-primary">
        {number}
      </span>
      <h2 className="text-xl font-bold">{title}</h2>
    </div>
  );
}

function InconsistencyTriggers({ language }: { language: 'en' | 'sv' }) {
  return (
    <div className="border-2 border-border bg-card p-6 space-y-4">
      <h2 className="text-xl font-bold">{INCONSISTENCY_TRIGGERS.title[language]}</h2>

      <ul className="space-y-2">
        {INCONSISTENCY_TRIGGERS.conditions.map((cond) => (
          <li key={cond.id} className="flex items-start gap-3 p-3 bg-muted/50">
            <span className="text-primary mt-0.5">•</span>
            <span>{cond.condition[language]}</span>
          </li>
        ))}
      </ul>

      <div className="pt-4 border-t border-border text-center">
        <p className="font-semibold text-primary">{INCONSISTENCY_TRIGGERS.threshold[language]}</p>
      </div>
    </div>
  );
}

function PresentationRules({ language }: { language: 'en' | 'sv' }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Never */}
        <div className="border-2 border-destructive/30 bg-destructive/5 p-6 space-y-4">
          <h3 className="font-bold flex items-center gap-2">
            <span className="text-destructive">✗</span>
            {PRESENTATION_RULES.never.label[language]}
          </h3>
          <div className="space-y-2">
            {PRESENTATION_RULES.never.examples.map((ex, i) => (
              <div key={i} className="text-muted-foreground line-through italic">
                {ex[language]}
              </div>
            ))}
          </div>
        </div>

        {/* Always */}
        <div className="border-2 border-primary/30 bg-primary/5 p-6 space-y-4">
          <h3 className="font-bold flex items-center gap-2">
            <span className="text-primary">✓</span>
            {PRESENTATION_RULES.always.label[language]}
          </h3>
          <div className="space-y-3">
            {PRESENTATION_RULES.always.examples.map((ex, i) => (
              <div key={i} className="text-sm border-l-2 border-primary pl-3">
                "{ex[language]}"
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center p-4 border-2 border-border bg-card">
        <p className="text-xl font-bold text-primary">{PRESENTATION_RULES.principle[language]}</p>
      </div>
    </div>
  );
}
