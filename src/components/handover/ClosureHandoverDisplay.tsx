/**
 * 🔚 CLOSURE & HANDOVER DISPLAY
 * 
 * When the system lives on its own.
 */

import React from 'react';
import {
  PUBLIC_STANCE,
  NEVER_DO,
  CRITICISM_RESPONSES,
  POWER_HOLDER_RESPONSE,
  INFRASTRUCTURE_SIGNALS,
  PERSONAL_STANCE,
  MISUSE_PROTOCOL,
  FINAL_CONCLUSION,
  FINAL_LOCK,
} from '@/config/closureHandoverConfig';

interface ClosureHandoverDisplayProps {
  language?: 'en' | 'sv';
}

export function ClosureHandoverDisplay({ language = 'en' }: ClosureHandoverDisplayProps) {
  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center border-b pb-6">
        <h1 className="text-2xl font-bold mb-2">🔚 {language === 'en' ? 'Closure & Handover' : 'Överlämning'}</h1>
        <p className="text-muted-foreground italic">
          {language === 'en' ? 'When the system lives on its own' : 'När systemet lever själv'}
        </p>
      </div>

      {/* 1. Public Stance */}
      <section className="border-2 border-primary p-6 bg-primary/5">
        <h2 className="font-bold mb-4">1. {language === 'en' ? 'Public Stance' : 'Offentlig hållning'}</h2>
        <blockquote className="text-lg italic border-l-4 border-primary pl-4 mb-4">
          "{PUBLIC_STANCE.statement[language]}"
        </blockquote>
        <ul className="text-sm text-muted-foreground space-y-1">
          {PUBLIC_STANCE.rules[language].map((rule, i) => (
            <li key={i}>• {rule}</li>
          ))}
        </ul>
      </section>

      {/* 2. Never Do */}
      <section className="border p-6">
        <h2 className="font-bold mb-4">2. {NEVER_DO.label[language]}</h2>
        <ul className="space-y-2 mb-4">
          {NEVER_DO.items.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <span className="text-destructive">✗</span>
              <span>{item[language]}</span>
            </li>
          ))}
        </ul>
        <div className="bg-muted/30 p-4 text-sm">
          <p className="italic mb-2">{NEVER_DO.exampleChallenge[language]}</p>
          <p className="font-semibold">→ "{NEVER_DO.correctResponse[language]}"</p>
        </div>
      </section>

      {/* 3. Criticism Responses */}
      <section className="border p-6">
        <h2 className="font-bold mb-4">3. {CRITICISM_RESPONSES.label[language]}</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-semibold mb-2 text-primary">{language === 'en' ? 'Allowed' : 'Tillåtet'}</h3>
            <ul className="space-y-2">
              {CRITICISM_RESPONSES.allowedResponses.map((r, i) => (
                <li key={i} className="text-sm flex items-start gap-2">
                  <span className="text-primary">{i + 1}.</span>
                  <span>"{r[language]}"</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-2 text-destructive">{language === 'en' ? 'Forbidden' : 'Förbjudet'}</h3>
            <ul className="space-y-2">
              {CRITICISM_RESPONSES.forbiddenResponses.map((r, i) => (
                <li key={i} className="text-sm flex items-start gap-2 text-muted-foreground">
                  <span className="text-destructive">✗</span>
                  <span>"{r[language]}"</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="text-sm italic mt-4 text-muted-foreground">📌 {CRITICISM_RESPONSES.principle[language]}</p>
      </section>

      {/* 4. Power Holders */}
      <section className="border p-6">
        <h2 className="font-bold mb-4">4. {POWER_HOLDER_RESPONSE.label[language]}</h2>
        <p className="text-sm mb-4">{POWER_HOLDER_RESPONSE.theirBehavior[language]}</p>
        <ul className="space-y-2 mb-4">
          {POWER_HOLDER_RESPONSE.yourBehavior.map((b, i) => (
            <li key={i} className="text-sm flex items-start gap-2">
              <span className="text-muted-foreground">•</span>
              <span>{b[language]}</span>
            </li>
          ))}
        </ul>
        <p className="text-sm font-semibold">{POWER_HOLDER_RESPONSE.principle[language]}</p>
      </section>

      {/* 5. Infrastructure Signals */}
      <section className="border p-6">
        <h2 className="font-bold mb-4">5. {INFRASTRUCTURE_SIGNALS.label[language]}</h2>
        <ul className="space-y-2 mb-4">
          {INFRASTRUCTURE_SIGNALS.signals.map((s, i) => (
            <li key={i} className="text-sm flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>{s[language]}</span>
            </li>
          ))}
        </ul>
        <p className="text-sm font-semibold">📌 {INFRASTRUCTURE_SIGNALS.conclusion[language]}</p>
      </section>

      {/* 6. Personal Stance */}
      <section className="border p-6">
        <h2 className="font-bold mb-4">6. {PERSONAL_STANCE.label[language]}</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <h3 className="text-sm font-semibold mb-2 text-destructive">{language === 'en' ? 'Do not become' : 'Bli inte'}</h3>
            <ul className="space-y-1">
              {PERSONAL_STANCE.notBe.map((n, i) => (
                <li key={i} className="text-sm text-muted-foreground">• {n[language]}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-2 text-primary">{language === 'en' ? 'Be' : 'Var'}</h3>
            <p className="text-sm font-medium">{PERSONAL_STANCE.shouldBe[language]}</p>
          </div>
        </div>
        <p className="text-sm italic text-muted-foreground">{PERSONAL_STANCE.principle[language]}</p>
      </section>

      {/* 7. Misuse Protocol */}
      <section className="border-2 border-destructive/50 p-6 bg-destructive/5">
        <h2 className="font-bold mb-4">7. {MISUSE_PROTOCOL.label[language]}</h2>
        <ol className="space-y-2 mb-4">
          {MISUSE_PROTOCOL.actions.map((a, i) => (
            <li key={i} className="text-sm flex items-start gap-2">
              <span className="font-mono">{i + 1}.</span>
              <span>{a[language]}</span>
            </li>
          ))}
        </ol>
        <div className="text-sm">
          <span className="font-semibold">{language === 'en' ? 'Prefer:' : 'Hellre:'}</span>{' '}
          <span className="text-primary">{MISUSE_PROTOCOL.preference.choose[language]}</span>
          <span className="text-muted-foreground"> {language === 'en' ? 'over' : 'än'} </span>
          <span className="text-destructive">{MISUSE_PROTOCOL.preference.over[language]}</span>
        </div>
      </section>

      {/* 8. Final Conclusion */}
      <section className="border p-6">
        <h2 className="font-bold mb-4">8. {language === 'en' ? 'Conclusion' : 'Slutsats'}</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <h3 className="text-sm font-semibold mb-2 text-muted-foreground">
              {language === 'en' ? 'You have not built' : 'Du har inte byggt'}
            </h3>
            <ul className="space-y-1">
              {FINAL_CONCLUSION.notBuilt.map((n, i) => (
                <li key={i} className="text-sm text-muted-foreground">• {n[language]}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-2 text-primary">
              {language === 'en' ? 'You have built' : 'Du har byggt'}
            </h3>
            <p className="text-lg font-medium">{FINAL_CONCLUSION.built[language]}</p>
          </div>
        </div>
        <div className="border-t pt-4 mt-4">
          <p className="text-sm mb-2">{language === 'en' ? 'When it exists:' : 'När det finns:'}</p>
          <ul className="space-y-1">
            {FINAL_CONCLUSION.effects.map((e, i) => (
              <li key={i} className="text-sm">• {e[language]}</li>
            ))}
          </ul>
          <p className="text-sm italic mt-2 text-muted-foreground">{FINAL_CONCLUSION.method[language]}</p>
        </div>
      </section>

      {/* Final Lock */}
      <section className="border-2 border-primary p-6 bg-primary/5 text-center">
        <h2 className="font-bold mb-4">🔒 {language === 'en' ? 'Final Lock' : 'Slutlåsning'}</h2>
        <blockquote className="text-lg italic mb-4">
          "{FINAL_LOCK.statement[language]}"
        </blockquote>
        <p className="text-sm text-muted-foreground">{FINAL_LOCK.closure[language]}</p>
      </section>
    </div>
  );
}
