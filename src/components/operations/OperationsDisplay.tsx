/**
 * 🗓️ OPERATIONAL DRIFT DISPLAY
 * 
 * How the system lives, improves, and doesn't derail.
 */

import React from 'react';
import {
  WEEKLY_RHYTHM,
  IMPROVEMENT_RULE,
  FEATURE_GATE,
  DATA_EXPANSION_PRIORITY,
  AI_USAGE_RULES,
  TEAM_PSYCHOLOGY,
  PAUSE_SIGNALS,
  PERSONAL_OPERATIONS,
  SOBER_CONCLUSION,
} from '@/config/operationalDriftConfig';

interface OperationsDisplayProps {
  language?: 'en' | 'sv';
}

export function OperationsDisplay({ language = 'en' }: OperationsDisplayProps) {
  const dayLabels: Record<string, { en: string; sv: string }> = {
    monday: { en: 'Monday', sv: 'Måndag' },
    tuesday: { en: 'Tuesday', sv: 'Tisdag' },
    wednesday: { en: 'Wednesday', sv: 'Onsdag' },
    thursday: { en: 'Thursday', sv: 'Torsdag' },
    friday: { en: 'Friday', sv: 'Fredag' },
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center border-b pb-6">
        <h1 className="text-2xl font-bold mb-2">🗓️ {language === 'en' ? 'Operational Drift & Build Cycle' : 'Operativ drift & byggcykel'}</h1>
        <p className="text-muted-foreground italic">
          {language === 'en' ? 'How the system lives, improves, and doesn\'t derail' : 'Så systemet lever, förbättras och inte spårar ur'}
        </p>
      </div>

      {/* 1. Weekly Rhythm */}
      <section className="border p-6">
        <h2 className="font-bold mb-2">1. {WEEKLY_RHYTHM.label[language]}</h2>
        <p className="text-sm text-muted-foreground mb-4">{WEEKLY_RHYTHM.subtitle[language]}</p>
        <div className="space-y-2 mb-4">
          {WEEKLY_RHYTHM.schedule.map((day) => (
            <div key={day.day} className="flex items-center gap-4 text-sm">
              <span className="font-semibold w-24">{dayLabels[day.day][language]}</span>
              <span className="text-muted-foreground">{day.focus[language]}</span>
            </div>
          ))}
        </div>
        <div className="border-t pt-4 space-y-1">
          {WEEKLY_RHYTHM.rules.map((rule, i) => (
            <p key={i} className="text-sm">📌 {rule[language]}</p>
          ))}
        </div>
      </section>

      {/* 2. Improvement Rule */}
      <section className="border-2 border-primary p-6 bg-primary/5">
        <h2 className="font-bold mb-2">2. {IMPROVEMENT_RULE.label[language]}</h2>
        <p className="text-sm text-muted-foreground mb-4">{IMPROVEMENT_RULE.subtitle[language]}</p>
        <p className="text-lg font-medium mb-4">{IMPROVEMENT_RULE.rule[language]}</p>
        <div className="bg-muted/30 p-4 text-sm">
          <p className="mb-2">{IMPROVEMENT_RULE.wrongPath.label[language]}</p>
          <ul className="space-y-1 mb-2">
            {IMPROVEMENT_RULE.wrongPath.signs.map((sign, i) => (
              <li key={i}>• {sign[language]}</li>
            ))}
          </ul>
          <p className="font-semibold">{IMPROVEMENT_RULE.wrongPath.conclusion[language]}</p>
        </div>
      </section>

      {/* 3. Feature Gate */}
      <section className="border p-6">
        <h2 className="font-bold mb-2">3. {FEATURE_GATE.label[language]}</h2>
        <p className="text-sm text-muted-foreground mb-4">{FEATURE_GATE.subtitle[language]}</p>
        <p className="text-sm mb-4">{FEATURE_GATE.description[language]}</p>
        <ol className="space-y-2 mb-4">
          {FEATURE_GATE.questions.map((q, i) => (
            <li key={i} className="text-sm flex items-start gap-2">
              <span className="font-mono text-primary">{i + 1}.</span>
              <span>{q[language]}</span>
            </li>
          ))}
        </ol>
        <p className="text-sm font-semibold text-destructive">{FEATURE_GATE.rule[language]}</p>
      </section>

      {/* 4. Data Expansion Priority */}
      <section className="border p-6">
        <h2 className="font-bold mb-2">4. {DATA_EXPANSION_PRIORITY.label[language]}</h2>
        <p className="text-sm text-muted-foreground mb-4">{DATA_EXPANSION_PRIORITY.subtitle[language]}</p>
        <p className="text-sm mb-4">{DATA_EXPANSION_PRIORITY.description[language]}</p>
        <ol className="space-y-2 mb-4">
          {DATA_EXPANSION_PRIORITY.priorities.map((p) => (
            <li key={p.order} className="text-sm flex items-start gap-2">
              <span className="font-mono text-primary">{p.order}.</span>
              <span>{p.text[language]}</span>
            </li>
          ))}
        </ol>
        <p className="text-sm font-semibold">📌 {DATA_EXPANSION_PRIORITY.principle[language]}</p>
      </section>

      {/* 5. AI Usage */}
      <section className="border p-6">
        <h2 className="font-bold mb-2">5. {AI_USAGE_RULES.label[language]}</h2>
        <p className="text-sm text-muted-foreground mb-4">{AI_USAGE_RULES.subtitle[language]}</p>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <h3 className="text-sm font-semibold mb-2 text-primary">{language === 'en' ? 'Use for:' : 'Använd för:'}</h3>
            <ul className="space-y-1">
              {AI_USAGE_RULES.allowedFor.map((a, i) => (
                <li key={i} className="text-sm">✓ {a[language]}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-2 text-destructive">{language === 'en' ? 'Never for:' : 'Aldrig för:'}</h3>
            <ul className="space-y-1">
              {AI_USAGE_RULES.notAllowedFor.map((n, i) => (
                <li key={i} className="text-sm text-muted-foreground">✗ {n[language]}</li>
              ))}
            </ul>
          </div>
        </div>
        <p className="text-sm italic">{AI_USAGE_RULES.redirect[language]}</p>
      </section>

      {/* 6. Team Psychology */}
      <section className="border p-6">
        <h2 className="font-bold mb-2">6. {TEAM_PSYCHOLOGY.label[language]}</h2>
        <p className="text-sm text-muted-foreground mb-4">{TEAM_PSYCHOLOGY.subtitle[language]}</p>
        <p className="text-sm mb-4">{TEAM_PSYCHOLOGY.context[language]}</p>
        <ul className="space-y-1 mb-4">
          {TEAM_PSYCHOLOGY.avoid.map((a, i) => (
            <li key={i} className="text-sm text-muted-foreground">✗ {a[language]}</li>
          ))}
        </ul>
        <div className="border-t pt-4">
          <p className="text-sm mb-2">{language === 'en' ? 'Always answer:' : 'Svara alltid:'}</p>
          {TEAM_PSYCHOLOGY.alwaysAnswer.map((a, i) => (
            <p key={i} className="text-sm font-semibold">{a[language]}</p>
          ))}
        </div>
      </section>

      {/* 7. Pause Signals */}
      <section className="border-2 border-destructive/50 p-6 bg-destructive/5">
        <h2 className="font-bold mb-4">7. {PAUSE_SIGNALS.label[language]}</h2>
        <ul className="space-y-2 mb-4">
          {PAUSE_SIGNALS.signals.map((s, i) => (
            <li key={i} className="text-sm flex items-start gap-2">
              <span className="text-destructive">⚠</span>
              <span>{s[language]}</span>
            </li>
          ))}
        </ul>
        <div className="space-y-1">
          {PAUSE_SIGNALS.principles.map((p, i) => (
            <p key={i} className="text-sm font-semibold">📌 {p[language]}</p>
          ))}
        </div>
      </section>

      {/* 8. Personal */}
      <section className="border p-6">
        <h2 className="font-bold mb-2">8. {PERSONAL_OPERATIONS.label[language]}</h2>
        <p className="text-sm text-muted-foreground mb-4">{PERSONAL_OPERATIONS.subtitle[language]}</p>
        <p className="text-sm mb-2">{language === 'en' ? 'You do not need to:' : 'Du behöver inte:'}</p>
        <ul className="space-y-1 mb-4">
          {PERSONAL_OPERATIONS.notNeeded.map((n, i) => (
            <li key={i} className="text-sm text-muted-foreground">• {n[language]}</li>
          ))}
        </ul>
        <p className="text-sm font-medium">{PERSONAL_OPERATIONS.truth[language]}</p>
      </section>

      {/* 9. Sober Conclusion */}
      <section className="border-2 border-primary p-6 bg-primary/5 text-center">
        <h2 className="font-bold mb-2">9. {SOBER_CONCLUSION.label[language]}</h2>
        <p className="text-sm text-muted-foreground mb-4">{SOBER_CONCLUSION.subtitle[language]}</p>
        <p className="text-lg mb-2">{SOBER_CONCLUSION.whatItIs[language]}</p>
        <p className="text-sm mb-4">{SOBER_CONCLUSION.sufficiency[language]}</p>
        <div className="text-sm text-muted-foreground mb-2">
          <p>{SOBER_CONCLUSION.beyondIt.label[language]}</p>
          <ul className="space-y-1">
            {SOBER_CONCLUSION.beyondIt.items.map((item, i) => (
              <li key={i}>• {item[language]}</li>
            ))}
          </ul>
        </div>
        <p className="text-sm italic">{SOBER_CONCLUSION.acceptance[language]}</p>
      </section>
    </div>
  );
}
