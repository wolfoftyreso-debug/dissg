/**
 * AI GUARDRAILS PANEL
 * 
 * Visar de guardrails som stoppar AI-glidning.
 * "If an AI starts interpreting → response is blocked"
 */

import React from 'react';
import { AI_GUARDRAILS, getBlockedResponse } from '@/config/immutablePrinciplesConfig';

interface AIGuardrailsPanelProps {
  language?: 'sv' | 'en';
  variant?: 'full' | 'compact' | 'status';
  className?: string;
}

export function AIGuardrailsPanel({
  language = 'en',
  variant = 'full',
  className = '',
}: AIGuardrailsPanelProps) {
  const labels = {
    en: {
      title: 'AI Guardrails',
      subtitle: 'What stops drift',
      requirements: 'All AI agents must',
      triggers: 'Blocking triggers',
      blockedResponse: 'Blocked response',
      permittedVerbs: 'Permitted verbs',
      active: 'Active',
      patterns: 'forbidden patterns',
    },
    sv: {
      title: 'AI-Guardrails',
      subtitle: 'Det som stoppar glidning',
      requirements: 'Alla AI-agenter måste',
      triggers: 'Blockeringstriggers',
      blockedResponse: 'Blockerat svar',
      permittedVerbs: 'Tillåtna verb',
      active: 'Aktiv',
      patterns: 'förbjudna mönster',
    },
  }[language];

  if (variant === 'status') {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/30 text-sm ${className}`}>
        <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
        <span className="font-mono text-xs">{labels.active}</span>
        <span className="text-muted-foreground">|</span>
        <span className="text-xs">{AI_GUARDRAILS.forbiddenPatterns.length} {labels.patterns}</span>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`border border-border p-3 space-y-2 ${className}`}>
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 border border-border flex items-center justify-center text-xs">🤖</span>
          <h3 className="font-semibold text-sm">{labels.title}</h3>
        </div>
        <ul className="text-xs text-muted-foreground space-y-1">
          {AI_GUARDRAILS.requirements.map((req, i) => (
            <li key={i}>• {req}</li>
          ))}
        </ul>
      </div>
    );
  }

  // Full variant
  return (
    <div className={`border border-border bg-card p-6 space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="w-8 h-8 border-2 border-border flex items-center justify-center text-lg">
              🤖
            </span>
            {labels.title}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">{labels.subtitle}</p>
        </div>
        <AIGuardrailsPanel variant="status" language={language} />
      </div>

      {/* Requirements */}
      <section>
        <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
          {labels.requirements}
        </h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {AI_GUARDRAILS.requirements.map((req, i) => (
            <li key={i} className="flex items-center gap-2 text-sm">
              <span className="text-primary">✓</span>
              {req}
            </li>
          ))}
        </ul>
      </section>

      {/* Triggers */}
      <section>
        <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
          {labels.triggers}
        </h3>
        <div className="space-y-2">
          {AI_GUARDRAILS.triggerConditions.map((tc, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-2 px-3 bg-muted/50 text-sm"
            >
              <span>If AI {tc.trigger}</span>
              <span className={`text-xs px-2 py-0.5 font-mono uppercase ${
                tc.action === 'block' 
                  ? 'bg-destructive/10 text-destructive' 
                  : 'bg-yellow-500/10 text-yellow-600'
              }`}>
                → {tc.action}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Blocked Response */}
      <section className="bg-destructive/5 border border-destructive/20 p-4">
        <h3 className="text-xs uppercase tracking-wider text-destructive mb-2">
          {labels.blockedResponse}
        </h3>
        <p className="text-sm italic">"{getBlockedResponse(language)}"</p>
      </section>

      {/* Permitted Verbs */}
      <section>
        <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
          {labels.permittedVerbs}
        </h3>
        <div className="flex flex-wrap gap-2">
          {AI_GUARDRAILS.permittedVerbs.map((verb) => (
            <span
              key={verb}
              className="text-xs px-2 py-1 bg-primary/10 text-primary font-mono"
            >
              {verb}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
