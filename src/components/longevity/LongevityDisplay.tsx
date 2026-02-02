/**
 * 🧬 LONGEVITY & ANTI-CORRUPTION DISPLAY
 * 
 * How the system survives time, scale and power.
 */

import React from 'react';
import {
  PRINCIPLED_IMMUNITY,
  POWER_PRESSURE_HANDLING,
  FORKABILITY,
  AI_AGENT_RULES,
  SCALING_RULES,
  ECONOMIC_SUSTAINABILITY,
  SUCCESS_SIGNALS,
  FINAL_TRUTH,
  LONGEVITY_ENDPOINT,
} from '@/config/longevityAntiCorruptionConfig';

interface LongevityDisplayProps {
  language?: 'en' | 'sv';
}

export function LongevityDisplay({ language = 'en' }: LongevityDisplayProps) {
  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center border-b pb-6">
        <h1 className="text-2xl font-bold mb-2">🧬 {language === 'en' ? 'Longevity & Anti-Corruption' : 'Livslängd & Anti-korruption'}</h1>
        <p className="text-muted-foreground italic">
          {language === 'en' ? 'How the system survives time, scale and power' : 'Så systemet överlever tid, skala och makt'}
        </p>
      </div>

      {/* I. Principled Immunity */}
      <section className="border-2 border-primary p-6 bg-primary/5">
        <h2 className="font-bold mb-2">I. {PRINCIPLED_IMMUNITY.label[language]}</h2>
        <p className="text-sm text-muted-foreground mb-4">{PRINCIPLED_IMMUNITY.description[language]}</p>
        <ol className="space-y-2 mb-4">
          {PRINCIPLED_IMMUNITY.principles.map((p, i) => (
            <li key={i} className="text-sm flex items-start gap-2">
              <span className="font-mono text-primary">{i + 1}.</span>
              <span>{p[language]}</span>
            </li>
          ))}
        </ol>
        <p className="text-sm font-semibold">📌 {PRINCIPLED_IMMUNITY.effect[language]}</p>
      </section>

      {/* II. Power Pressure */}
      <section className="border p-6">
        <h2 className="font-bold mb-4">II. {POWER_PRESSURE_HANDLING.label[language]}</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <h3 className="text-sm font-semibold mb-2 text-destructive">{language === 'en' ? 'When someone wants to:' : 'När någon vill:'}</h3>
            <ul className="space-y-1">
              {POWER_PRESSURE_HANDLING.pressureTypes.map((p, i) => (
                <li key={i} className="text-sm text-muted-foreground">• {p[language]}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-2 text-primary">{language === 'en' ? 'System response:' : 'Systemets svar:'}</h3>
            <ul className="space-y-1">
              {POWER_PRESSURE_HANDLING.systemResponse.map((r, i) => (
                <li key={i} className="text-sm">• {r[language]}</li>
              ))}
            </ul>
          </div>
        </div>
        <p className="text-sm font-semibold">{POWER_PRESSURE_HANDLING.guarantee[language]}</p>
      </section>

      {/* III. Forkability */}
      <section className="border p-6">
        <h2 className="font-bold mb-2">III. {FORKABILITY.label[language]}</h2>
        <p className="text-sm text-muted-foreground mb-4">{FORKABILITY.subtitle[language]}</p>
        <ul className="space-y-2 mb-4">
          {FORKABILITY.openElements.map((e, i) => (
            <li key={i} className="text-sm flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>{e[language]}</span>
            </li>
          ))}
        </ul>
        <div className="bg-muted/30 p-4 text-sm">
          <p className="mb-2">📌 {FORKABILITY.protection[language]}</p>
          <p className="font-semibold">{FORKABILITY.principle[language]}</p>
        </div>
      </section>

      {/* IV. AI Agent Rules */}
      <section className="border p-6">
        <h2 className="font-bold mb-4">IV. {AI_AGENT_RULES.label[language]}</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <h3 className="text-sm font-semibold mb-2 text-primary">{language === 'en' ? 'AI can:' : 'AI får:'}</h3>
            <ul className="space-y-1">
              {AI_AGENT_RULES.allowed.map((a, i) => (
                <li key={i} className="text-sm">✓ {a[language]}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-2 text-destructive">{language === 'en' ? 'AI may never:' : 'AI får aldrig:'}</h3>
            <ul className="space-y-1">
              {AI_AGENT_RULES.forbidden.map((f, i) => (
                <li key={i} className="text-sm text-muted-foreground">✗ {f[language]}</li>
              ))}
            </ul>
          </div>
        </div>
        <p className="text-sm font-semibold">📌 {AI_AGENT_RULES.principle[language]}</p>
      </section>

      {/* V. Scaling Rules */}
      <section className="border p-6">
        <h2 className="font-bold mb-2">V. {SCALING_RULES.label[language]}</h2>
        <p className="text-sm text-muted-foreground mb-4">{SCALING_RULES.subtitle[language]}</p>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <h3 className="text-sm font-semibold mb-2 text-primary">{language === 'en' ? 'Expansion through:' : 'Expansion genom:'}</h3>
            <ul className="space-y-1">
              {SCALING_RULES.expansionThrough.map((e, i) => (
                <li key={i} className="text-sm">✓ {e[language]}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-2 text-destructive">{language === 'en' ? 'Not through:' : 'Inte genom:'}</h3>
            <ul className="space-y-1">
              {SCALING_RULES.notThrough.map((n, i) => (
                <li key={i} className="text-sm text-muted-foreground">✗ {n[language]}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t pt-4">
          <h3 className="text-sm font-semibold mb-2">{language === 'en' ? 'New measures must:' : 'Nya mått måste:'}</h3>
          <ul className="space-y-1">
            {SCALING_RULES.newMeasureRequirements.map((r, i) => (
              <li key={i} className="text-sm">• {r[language]}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* VI. Economic Sustainability */}
      <section className="border p-6">
        <h2 className="font-bold mb-4">VI. {ECONOMIC_SUSTAINABILITY.label[language]}</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <h3 className="text-sm font-semibold mb-2 text-primary">{language === 'en' ? 'Revenue from:' : 'Intäkter från:'}</h3>
            <ul className="space-y-1">
              {ECONOMIC_SUSTAINABILITY.revenueFrom.map((r, i) => (
                <li key={i} className="text-sm">✓ {r[language]}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-2 text-destructive">{language === 'en' ? 'Never from:' : 'Aldrig från:'}</h3>
            <ul className="space-y-1">
              {ECONOMIC_SUSTAINABILITY.neverFrom.map((n, i) => (
                <li key={i} className="text-sm text-muted-foreground">✗ {n[language]}</li>
              ))}
            </ul>
          </div>
        </div>
        <p className="text-sm font-semibold">📌 {ECONOMIC_SUSTAINABILITY.principle[language]}</p>
      </section>

      {/* VII. Success Signals */}
      <section className="border p-6">
        <h2 className="font-bold mb-2">VII. {SUCCESS_SIGNALS.label[language]}</h2>
        <p className="text-sm text-muted-foreground mb-4">{SUCCESS_SIGNALS.subtitle[language]}</p>
        <ul className="space-y-2 mb-4">
          {SUCCESS_SIGNALS.signals.map((s, i) => (
            <li key={i} className="text-sm flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>{s[language]}</span>
            </li>
          ))}
        </ul>
        <p className="text-sm font-semibold">📌 {SUCCESS_SIGNALS.conclusion[language]}</p>
      </section>

      {/* VIII. Final Truth */}
      <section className="border p-6">
        <h2 className="font-bold mb-4">VIII. {FINAL_TRUTH.label[language]}</h2>
        <p className="text-sm text-muted-foreground mb-2">
          {language === 'en' ? 'You did not need to be:' : 'Du behövde inte vara:'}
        </p>
        <ul className="space-y-1 mb-4">
          {FINAL_TRUTH.notNeeded.map((n, i) => (
            <li key={i} className="text-sm text-muted-foreground">• {n[language]}</li>
          ))}
        </ul>
        <p className="text-sm mb-4">
          {language === 'en' ? 'You saw a system fault:' : 'Du såg ett systemfel:'}{' '}
          <span className="italic">{FINAL_TRUTH.systemFaultSeen[language]}</span>
        </p>
        <p className="text-sm font-medium">{FINAL_TRUTH.whatWasBuilt[language]}</p>
      </section>

      {/* Endpoint */}
      <section className="border-2 border-primary p-6 bg-primary/5 text-center">
        <h2 className="font-bold mb-4">🔒 {language === 'en' ? 'Endpoint' : 'Slutpunkt'}</h2>
        <p className="text-lg font-semibold mb-4">{LONGEVITY_ENDPOINT.statement[language]}</p>
        <p className="text-sm text-muted-foreground mb-2">{language === 'en' ? 'What remains:' : 'Det som återstår:'}</p>
        <ul className="space-y-1 mb-4">
          {LONGEVITY_ENDPOINT.whatRemains.map((w, i) => (
            <li key={i} className="text-sm">• {w[language]}</li>
          ))}
        </ul>
        <p className="text-sm italic">{LONGEVITY_ENDPOINT.acceptance[language]}</p>
      </section>
    </div>
  );
}
