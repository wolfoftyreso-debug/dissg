/**
 * EXIT-SAFE MODE
 * 
 * Om systemet inte längre kan följa principerna:
 * - Visa varning
 * - Frysa tolkande funktioner
 * - Gå i "read-only reference mode"
 * 
 * "Rather silent than wrong."
 */

import React from 'react';
import { IMMUTABLE_PRINCIPLES } from '@/config/immutablePrinciplesConfig';

interface ExitSafeModeProps {
  isActive?: boolean;
  violatedPrinciples?: number[];
  language?: 'sv' | 'en';
  className?: string;
}

export function ExitSafeMode({
  isActive = false,
  violatedPrinciples = [],
  language = 'en',
  className = '',
}: ExitSafeModeProps) {
  const labels = {
    en: {
      title: 'SYSTEM IN SAFE MODE',
      description: 'The system has detected principle violations and has entered read-only reference mode.',
      violatedPrinciples: 'Violated principles',
      functionsDisabled: 'Disabled functions',
      interpretive: 'Interpretive analysis',
      recommendations: 'Recommendations',
      predictions: 'Predictions',
      dataStillAvailable: 'Raw data remains accessible',
      ratherSilent: 'Rather silent than wrong.',
    },
    sv: {
      title: 'SYSTEM I SÄKERT LÄGE',
      description: 'Systemet har upptäckt principbrott och har gått in i skrivskyddat referensläge.',
      violatedPrinciples: 'Brutna principer',
      functionsDisabled: 'Inaktiverade funktioner',
      interpretive: 'Tolkande analys',
      recommendations: 'Rekommendationer',
      predictions: 'Prognoser',
      dataStillAvailable: 'Rådata förblir tillgänglig',
      ratherSilent: 'Hellre tyst än fel.',
    },
  }[language];

  if (!isActive) {
    return null;
  }

  const violated = violatedPrinciples.map((num) =>
    IMMUTABLE_PRINCIPLES.find((p) => p.number === num)
  ).filter(Boolean);

  return (
    <div className={`fixed inset-0 z-50 bg-background/95 flex items-center justify-center p-4 ${className}`}>
      <div className="max-w-lg w-full border-4 border-destructive bg-card p-8 space-y-6">
        {/* Warning Icon */}
        <div className="text-center">
          <div className="w-16 h-16 mx-auto border-4 border-destructive flex items-center justify-center text-3xl text-destructive">
            ⚠
          </div>
        </div>

        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="text-xl font-bold text-destructive tracking-wider">
            {labels.title}
          </h1>
          <p className="text-sm text-muted-foreground">{labels.description}</p>
        </div>

        {/* Violated Principles */}
        {violated.length > 0 && (
          <div>
            <h2 className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
              {labels.violatedPrinciples}
            </h2>
            <ul className="space-y-1">
              {violated.map((p) => (
                <li key={p!.number} className="text-sm flex items-center gap-2">
                  <span className="text-destructive">×</span>
                  <span className="font-medium">{p!.number}. {p!.title[language]}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Disabled Functions */}
        <div>
          <h2 className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
            {labels.functionsDisabled}
          </h2>
          <ul className="space-y-1 text-sm">
            <li className="flex items-center gap-2">
              <span className="text-destructive">×</span>
              {labels.interpretive}
            </li>
            <li className="flex items-center gap-2">
              <span className="text-destructive">×</span>
              {labels.recommendations}
            </li>
            <li className="flex items-center gap-2">
              <span className="text-destructive">×</span>
              {labels.predictions}
            </li>
          </ul>
        </div>

        {/* Data Still Available */}
        <div className="bg-muted/50 p-3 text-center">
          <p className="text-sm flex items-center justify-center gap-2">
            <span className="text-primary">✓</span>
            {labels.dataStillAvailable}
          </p>
        </div>

        {/* Final Statement */}
        <div className="text-center pt-4 border-t border-border">
          <p className="text-lg font-semibold italic">{labels.ratherSilent}</p>
        </div>
      </div>
    </div>
  );
}

/**
 * Compact exit-safe warning banner
 */
export function ExitSafeWarningBanner({
  language = 'en',
  className = '',
}: {
  language?: 'sv' | 'en';
  className?: string;
}) {
  const text = {
    en: 'System operating in limited mode due to detected principle violations.',
    sv: 'Systemet körs i begränsat läge på grund av upptäckta principbrott.',
  }[language];

  return (
    <div className={`bg-destructive/10 border-y border-destructive/30 py-2 px-4 ${className}`}>
      <p className="text-xs text-center text-destructive flex items-center justify-center gap-2">
        <span>⚠</span>
        {text}
      </p>
    </div>
  );
}
