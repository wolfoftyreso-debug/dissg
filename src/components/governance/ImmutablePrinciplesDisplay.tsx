/**
 * IMMUTABLE PRINCIPLES DISPLAY
 * 
 * Visar de 10 oföränderliga principerna.
 * "These are not features. This is constitution."
 */

import React from 'react';
import { IMMUTABLE_PRINCIPLES, type ImmutablePrinciple } from '@/config/immutablePrinciplesConfig';

interface ImmutablePrinciplesDisplayProps {
  language?: 'sv' | 'en';
  variant?: 'full' | 'compact' | 'manifest';
  className?: string;
}

export function ImmutablePrinciplesDisplay({
  language = 'en',
  variant = 'full',
  className = '',
}: ImmutablePrinciplesDisplayProps) {
  const labels = {
    en: {
      title: 'Immutable Principles',
      subtitle: 'The Non-Negotiable Core',
      description: 'These are not features. This is constitution.',
      cannotChange: 'Can never be changed',
      enforcement: 'Enforcement',
    },
    sv: {
      title: 'Oföränderliga principer',
      subtitle: 'Den oförhandlingsbara kärnan',
      description: 'Detta är inte features. Detta är konstitution.',
      cannotChange: 'Kan aldrig ändras',
      enforcement: 'Upprätthållande',
    },
  }[language];

  if (variant === 'manifest') {
    return (
      <div className={`font-mono text-sm space-y-4 ${className}`}>
        <div className="text-center border-b border-border pb-4">
          <h1 className="text-lg font-bold tracking-wider">IMMUTABLE PRINCIPLES</h1>
          <p className="text-xs text-muted-foreground mt-1">v1.0.0 — LOCKED</p>
        </div>
        {IMMUTABLE_PRINCIPLES.map((p) => (
          <div key={p.code} className="py-2 border-b border-border/50">
            <div className="flex items-baseline gap-2">
              <span className="text-primary font-bold">{p.number}.</span>
              <span className="font-semibold">{p.title[language]}</span>
            </div>
            <p className="text-muted-foreground mt-1 pl-5">{p.principle[language]}</p>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`space-y-2 ${className}`}>
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <span className="w-5 h-5 border border-border flex items-center justify-center text-xs">🔐</span>
          {labels.title}
        </h3>
        <ol className="text-sm space-y-1 list-decimal list-inside text-muted-foreground">
          {IMMUTABLE_PRINCIPLES.map((p) => (
            <li key={p.code}>{p.title[language]}</li>
          ))}
        </ol>
      </div>
    );
  }

  // Full variant
  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center space-y-2 pb-4 border-b-2 border-border">
        <div className="inline-flex items-center gap-2 px-4 py-1 bg-primary/10 text-primary text-xs font-mono uppercase tracking-widest">
          <span>🔐</span>
          <span>{labels.cannotChange}</span>
        </div>
        <h2 className="text-2xl font-bold">{labels.title}</h2>
        <p className="text-muted-foreground">{labels.subtitle}</p>
        <p className="text-sm italic">{labels.description}</p>
      </div>

      <div className="space-y-4">
        {IMMUTABLE_PRINCIPLES.map((principle) => (
          <PrincipleCard
            key={principle.code}
            principle={principle}
            language={language}
            enforcementLabel={labels.enforcement}
          />
        ))}
      </div>
    </div>
  );
}

function PrincipleCard({
  principle,
  language,
  enforcementLabel,
}: {
  principle: ImmutablePrinciple;
  language: 'sv' | 'en';
  enforcementLabel: string;
}) {
  const responseColors = {
    block: 'bg-destructive/10 text-destructive border-destructive/30',
    warn: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30',
    freeze: 'bg-blue-500/10 text-blue-600 border-blue-500/30',
  };

  return (
    <div className="border border-border bg-card p-4 space-y-3">
      <div className="flex items-start gap-3">
        <span className="flex-shrink-0 w-8 h-8 border-2 border-primary flex items-center justify-center font-bold text-primary">
          {principle.number}
        </span>
        <div className="flex-1">
          <h3 className="font-semibold">{principle.title[language]}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {principle.principle[language]}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-border">
        <span className="text-xs text-muted-foreground">
          {enforcementLabel}: {principle.enforcementNote[language]}
        </span>
        <span className={`text-xs px-2 py-0.5 border ${responseColors[principle.violationResponse]}`}>
          {principle.violationResponse.toUpperCase()}
        </span>
      </div>
    </div>
  );
}
