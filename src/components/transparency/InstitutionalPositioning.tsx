/**
 * INSTITUTIONAL POSITIONING
 * 
 * Hur plattformen presenteras externt.
 * "Those who understand will hear anyway. Those who do not understand will not be scared."
 */

import React from 'react';
import { 
  TRANSPARENCY_LAYER_PROMPT, 
  TRANSPARENCY_LAYER_PROMPT_PART_II 
} from '@/config/masterPromptConfig';

interface InstitutionalPositioningProps {
  language?: 'sv' | 'en';
  variant?: 'full' | 'summary' | 'badge';
  className?: string;
}

export function InstitutionalPositioning({
  language = 'en',
  variant = 'full',
  className = '',
}: InstitutionalPositioningProps) {
  const p1 = TRANSPARENCY_LAYER_PROMPT;
  const p2 = TRANSPARENCY_LAYER_PROMPT_PART_II;

  const labels = {
    en: {
      title: 'What This Platform Is',
      subtitle: 'Institutional Identity',
      weAre: 'We are',
      weAreNot: 'We are not',
      languageUse: 'We say',
      languageAvoid: 'We do not say',
      powerStatement: 'Our Position on Power',
      globalIdentity: 'Global Identity',
    },
    sv: {
      title: 'Vad denna plattform är',
      subtitle: 'Institutionell identitet',
      weAre: 'Vi är',
      weAreNot: 'Vi är inte',
      languageUse: 'Vi säger',
      languageAvoid: 'Vi säger inte',
      powerStatement: 'Vår position om makt',
      globalIdentity: 'Global identitet',
    },
  }[language];

  if (variant === 'badge') {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1 border border-border bg-muted/50 text-xs ${className}`}>
        <span className="font-mono">[REF]</span>
        <span>{p1.positioning.use[0]}</span>
      </div>
    );
  }

  if (variant === 'summary') {
    return (
      <div className={`border border-border p-4 space-y-3 ${className}`}>
        <h3 className="font-semibold text-sm">{labels.title}</h3>
        <div className="flex flex-wrap gap-2">
          {p1.positioning.use.map((term, i) => (
            <span 
              key={i} 
              className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium"
            >
              {term}
            </span>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          {p2.powerDynamics.officialStance[language]}
        </p>
      </div>
    );
  }

  // Full variant
  return (
    <div className={`border border-border bg-card p-6 space-y-6 ${className}`}>
      <div className="space-y-1">
        <h2 className="text-xl font-bold">{labels.title}</h2>
        <p className="text-sm text-muted-foreground">{labels.subtitle}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* What we are */}
        <section>
          <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
            {labels.weAre}
          </h3>
          <ul className="space-y-2">
            {p1.systemRole.is.map((item, i) => (
              <li key={i} className="text-sm flex items-start gap-2">
                <span className="text-primary mt-0.5">→</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* What we are not */}
        <section>
          <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
            {labels.weAreNot}
          </h3>
          <ul className="space-y-2">
            {p1.systemRole.isNot.map((item, i) => (
              <li key={i} className="text-sm flex items-start gap-2 text-muted-foreground">
                <span className="text-destructive mt-0.5">×</span>
                {item}
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Language guidance */}
      <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-border">
        <section>
          <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
            {labels.languageUse}
          </h3>
          <div className="flex flex-wrap gap-2">
            {p2.institutionalLanguage.use.map((term, i) => (
              <span 
                key={i} 
                className="px-2 py-1 bg-primary/10 text-primary text-xs"
              >
                "{term}"
              </span>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
            {labels.languageAvoid}
          </h3>
          <div className="flex flex-wrap gap-2">
            {p2.institutionalLanguage.avoid.map((term, i) => (
              <span 
                key={i} 
                className="px-2 py-1 bg-destructive/10 text-destructive text-xs line-through"
              >
                "{term}"
              </span>
            ))}
          </div>
        </section>
      </div>

      {/* Power dynamics */}
      <section className="pt-4 border-t border-border">
        <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
          {labels.powerStatement}
        </h3>
        <blockquote className="border-l-2 border-primary pl-4 italic">
          "{p2.powerDynamics.officialStance[language]}"
        </blockquote>
        <p className="text-sm text-muted-foreground mt-2">
          {p2.powerDynamics.whatWeAttack}
        </p>
      </section>

      {/* Global identity */}
      <section className="pt-4 border-t border-border">
        <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
          {labels.globalIdentity}
        </h3>
        <ul className="grid grid-cols-2 gap-2">
          {p2.globalAdoption.reasons.map((reason, i) => (
            <li key={i} className="text-sm flex items-center gap-2">
              <span className="text-primary">•</span>
              {reason}
            </li>
          ))}
        </ul>
        <p className="text-sm font-medium mt-3">{p2.globalAdoption.identity}</p>
      </section>

      {/* Closing */}
      <div className="pt-4 border-t border-border text-center">
        <p className="text-lg font-semibold">{p2.finalLock[language]}</p>
        <p className="text-sm text-muted-foreground mt-2">
          {p1.closingPrinciple[language]}
        </p>
      </div>
    </div>
  );
}
