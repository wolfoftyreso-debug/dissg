/**
 * SCENARIO LAB OVERVIEW
 * 
 * Complete presentation of the Probabilistic Scenario Lab.
 * Advanced user mode — responsibility on the user.
 */

import React from 'react';
import { ModeIndicator } from './ModeIndicator';
import { ScenarioDisclaimer } from './ScenarioDisclaimer';
import {
  SCENARIO_CORE_PRINCIPLE,
  MODE_DISTINCTION,
  SCENARIO_INPUTS,
  OUTPUT_RULES,
  TRACEABILITY,
  COUNTERWEIGHT_SYSTEM,
  SAFETY_RATIONALE,
  SCENARIO_COMPLETION_CRITERIA,
  SCENARIO_CONCLUSION,
} from '@/config/scenarioLabConfig';

interface ScenarioLabOverviewProps {
  language?: 'en' | 'sv';
  className?: string;
}

export function ScenarioLabOverview({
  language = 'en',
  className = '',
}: ScenarioLabOverviewProps) {
  const labels = {
    en: {
      title: 'Probabilistic Scenario Lab',
      subtitle: 'Advanced User Mode — Responsibility on the User',
      tagline: 'This is not analysis from the platform. This is calculation the user performs with platform data.',
      section1: 'Core Principle',
      section2: 'Mode Distinction',
      section3: 'What the User Can Do',
      section4: 'Output Presentation',
      section5: 'Traceability & Accountability',
      section6: 'Built-in Counterweight',
      section7: 'Why This Is Safe',
      section8: 'Completion Criteria',
    },
    sv: {
      title: 'Probabilistiskt scenariolabb',
      subtitle: 'Avancerat användarläge — Ansvar på användaren',
      tagline: 'Detta är inte analys från plattformen. Detta är beräkning som användaren utför med plattformens data.',
      section1: 'Grundprincip',
      section2: 'Lägesåtskillnad',
      section3: 'Vad användaren kan göra',
      section4: 'Output-presentation',
      section5: 'Spårbarhet & ansvar',
      section6: 'Inbyggd motvikt',
      section7: 'Varför detta är säkert',
      section8: 'Klart-kriterium',
    },
  }[language];

  return (
    <div className={`space-y-16 ${className}`}>
      {/* Header */}
      <header className="text-center space-y-4">
        <div className="w-20 h-20 mx-auto border-4 border-amber-500 flex items-center justify-center text-4xl">
          📈
        </div>
        <h1 className="text-3xl lg:text-4xl font-bold">{labels.title}</h1>
        <p className="text-lg text-muted-foreground">{labels.subtitle}</p>
        <p className="text-xl font-semibold text-amber-600">{labels.tagline}</p>
      </header>

      {/* Section 1: Core Principle */}
      <section>
        <SectionHeader number={1} title={labels.section1} />
        <CorePrinciple language={language} />
      </section>

      {/* Section 2: Mode Distinction */}
      <section>
        <SectionHeader number={2} title={labels.section2} />
        <ModeDistinction language={language} />
      </section>

      {/* Section 3: User Inputs */}
      <section>
        <SectionHeader number={3} title={labels.section3} />
        <UserInputs language={language} />
      </section>

      {/* Section 4: Output Presentation */}
      <section>
        <SectionHeader number={4} title={labels.section4} />
        <OutputPresentation language={language} />
      </section>

      {/* Section 5: Traceability */}
      <section>
        <SectionHeader number={5} title={labels.section5} />
        <TraceabilitySection language={language} />
      </section>

      {/* Section 6: Counterweight */}
      <section>
        <SectionHeader number={6} title={labels.section6} />
        <CounterweightSection language={language} />
      </section>

      {/* Section 7: Safety Rationale */}
      <section>
        <SectionHeader number={7} title={labels.section7} />
        <SafetySection language={language} />
      </section>

      {/* Section 8: Completion Criteria */}
      <section>
        <SectionHeader number={8} title={labels.section8} />
        <CompletionSection language={language} />
      </section>

      {/* Final Conclusion */}
      <FinalConclusion language={language} />
    </div>
  );
}

function SectionHeader({ number, title }: { number: number; title: string }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <span className="w-10 h-10 border-2 border-amber-500 flex items-center justify-center font-bold text-amber-600">
        {number}
      </span>
      <h2 className="text-xl font-bold">{title}</h2>
    </div>
  );
}

function CorePrinciple({ language }: { language: 'en' | 'sv' }) {
  return (
    <div className="border-2 border-amber-500/30 bg-amber-500/5 p-6 space-y-4">
      <p className="text-xl font-medium">{SCENARIO_CORE_PRINCIPLE.statement[language]}</p>
      
      <div className="flex flex-wrap gap-2">
        {SCENARIO_CORE_PRINCIPLE.characteristics.map((c, i) => (
          <span key={i} className="px-3 py-1 border border-amber-500/50 text-sm">
            ✓ {c[language]}
          </span>
        ))}
      </div>

      <div className="pt-4 border-t border-amber-500/20 text-center">
        <p className="font-semibold text-amber-700">{SCENARIO_CORE_PRINCIPLE.conclusion[language]}</p>
      </div>
    </div>
  );
}

function ModeDistinction({ language }: { language: 'en' | 'sv' }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ModeIndicator mode="observation" language={language} variant="banner" />
        <ModeIndicator mode="scenario" language={language} variant="banner" />
      </div>
      <div className="text-center p-4 border-2 border-border bg-card">
        <p className="font-semibold text-primary">{MODE_DISTINCTION.principle[language]}</p>
      </div>
    </div>
  );
}

function UserInputs({ language }: { language: 'en' | 'sv' }) {
  return (
    <div className="border-2 border-border bg-card p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-bold mb-3">{SCENARIO_INPUTS.title[language]}</h3>
          <ul className="space-y-2">
            {SCENARIO_INPUTS.inputs.map((input) => (
              <li key={input.id} className="flex items-center gap-2 p-2 bg-muted/50">
                <span>{input.icon}</span>
                <span>{input.label[language]}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h3 className="font-bold mb-3">
            {language === 'en' ? 'System Calculates' : 'Systemet räknar'}
          </h3>
          <ul className="space-y-2">
            {SCENARIO_INPUTS.outputs.map((output, i) => (
              <li key={i} className="flex items-center gap-2 p-2 bg-primary/5">
                <span className="text-primary">→</span>
                <span>{output[language]}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="text-center pt-4 border-t border-border">
        <p className="font-semibold text-primary">{SCENARIO_INPUTS.principle[language]}</p>
      </div>
    </div>
  );
}

function OutputPresentation({ language }: { language: 'en' | 'sv' }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Never */}
        <div className="border-2 border-destructive/30 bg-destructive/5 p-6 space-y-4">
          <h3 className="font-bold flex items-center gap-2">
            <span className="text-destructive">✗</span>
            {OUTPUT_RULES.never.label[language]}
          </h3>
          <div className="space-y-2">
            {OUTPUT_RULES.never.examples.map((ex, i) => (
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
            {OUTPUT_RULES.always.label[language]}
          </h3>
          <div className="space-y-3">
            {OUTPUT_RULES.always.templates.map((t, i) => (
              <div key={i} className="text-sm border-l-2 border-primary pl-3">
                "{t[language]}"
              </div>
            ))}
          </div>
        </div>
      </div>

      <ScenarioDisclaimer language={language} variant="block" />
    </div>
  );
}

function TraceabilitySection({ language }: { language: 'en' | 'sv' }) {
  return (
    <div className="border-2 border-border bg-card p-6 space-y-4">
      <h3 className="font-bold">{TRACEABILITY.title[language]}</h3>
      
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {TRACEABILITY.requirements.map((req, i) => (
          <li key={i} className="flex items-center gap-2 p-2 bg-muted/50">
            <span className="text-primary">✓</span>
            {req[language]}
          </li>
        ))}
      </ul>

      <ScenarioDisclaimer language={language} variant="export" />

      <div className="text-center pt-4 border-t border-border">
        <p className="font-semibold text-primary">{TRACEABILITY.principle[language]}</p>
      </div>
    </div>
  );
}

function CounterweightSection({ language }: { language: 'en' | 'sv' }) {
  return (
    <div className="border-2 border-amber-500/30 bg-amber-500/5 p-6 space-y-4">
      <h3 className="font-bold">{COUNTERWEIGHT_SYSTEM.title[language]}</h3>
      
      <div className="flex flex-wrap gap-2">
        {COUNTERWEIGHT_SYSTEM.triggers.map((t, i) => (
          <span key={i} className="px-3 py-1 bg-amber-500/20 text-sm">
            {t[language]}
          </span>
        ))}
      </div>

      <div className="p-4 border border-amber-500/30 bg-card">
        <p className="font-medium">"{COUNTERWEIGHT_SYSTEM.systemResponse[language]}"</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {COUNTERWEIGHT_SYSTEM.linkedResources.map((r, i) => (
          <span key={i} className="px-3 py-1 border border-border text-sm">
            → {r[language]}
          </span>
        ))}
      </div>

      <div className="text-center pt-4 border-t border-amber-500/20">
        <p className="font-semibold text-amber-700">{COUNTERWEIGHT_SYSTEM.principle[language]}</p>
      </div>
    </div>
  );
}

function SafetySection({ language }: { language: 'en' | 'sv' }) {
  return (
    <div className="border-2 border-border bg-card p-6 space-y-4">
      <h3 className="font-bold">{SAFETY_RATIONALE.title[language]}</h3>
      
      <ul className="space-y-2">
        {SAFETY_RATIONALE.points.map((p, i) => (
          <li key={i} className="flex items-center gap-2">
            <span className="text-primary">✓</span>
            {p[language]}
          </li>
        ))}
      </ul>

      <div className="pt-4 border-t border-border">
        <span className="text-xs text-muted-foreground uppercase">
          {SAFETY_RATIONALE.usedBy.label[language]}
        </span>
        <div className="flex flex-wrap gap-2 mt-2">
          {SAFETY_RATIONALE.usedBy.examples.map((ex, i) => (
            <span key={i} className="px-3 py-1 bg-muted text-sm font-medium">
              {ex[language]}
            </span>
          ))}
        </div>
      </div>

      <div className="text-center pt-4 border-t border-border">
        <p className="font-semibold text-primary">{SAFETY_RATIONALE.conclusion[language]}</p>
      </div>
    </div>
  );
}

function CompletionSection({ language }: { language: 'en' | 'sv' }) {
  return (
    <div className="border-2 border-primary/30 bg-primary/5 p-6 space-y-4">
      <h3 className="font-bold">{SCENARIO_COMPLETION_CRITERIA.title[language]}</h3>
      <p className="text-muted-foreground">{SCENARIO_COMPLETION_CRITERIA.intro[language]}</p>

      <ul className="space-y-2">
        {SCENARIO_COMPLETION_CRITERIA.criteria.map((c, i) => (
          <li key={i} className="flex items-center gap-3">
            <span className="w-6 h-6 border border-primary flex items-center justify-center text-xs font-mono text-primary">
              {i + 1}
            </span>
            <span>{c[language]}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FinalConclusion({ language }: { language: 'en' | 'sv' }) {
  return (
    <div className="border-4 border-amber-500 bg-amber-500/5 p-8 text-center space-y-6">
      <p className="text-lg">{SCENARIO_CONCLUSION.statement[language]}</p>
      
      <div>
        <span className="text-muted-foreground">{SCENARIO_CONCLUSION.conditions.label[language]}</span>
        <ul className="mt-2 space-y-1">
          {SCENARIO_CONCLUSION.conditions.items.map((item, i) => (
            <li key={i} className="text-lg">• {item[language]}</li>
          ))}
        </ul>
      </div>

      <div className="pt-6 border-t border-amber-500/30 space-y-2">
        <p className="text-xl text-muted-foreground">{SCENARIO_CONCLUSION.final.notThis[language]}</p>
        <p className="text-3xl font-bold text-amber-700">{SCENARIO_CONCLUSION.final.butThis[language]}</p>
      </div>
    </div>
  );
}
