/**
 * TRUTH ORACLE DOCTRINE
 * 
 * Huvudkomponent som visar hela doktrinen.
 * Den slutliga låsningen av systemets roll i samhället.
 */

import React from 'react';
import { TRUTH_ORACLE_DOCTRINE } from '@/config/truthOracleDoctrineConfig';
import { PlatformDisclaimer } from './PlatformDisclaimer';

interface TruthOracleDoctrineProps {
  language?: 'sv' | 'en';
}

export function TruthOracleDoctrine({ language = 'en' }: TruthOracleDoctrineProps) {
  return (
    <div className="max-w-4xl mx-auto bg-card border border-border">
      {/* Header */}
      <div className="border-b-2 border-foreground p-8 text-center bg-foreground text-background">
        <h1 className="text-3xl font-bold tracking-widest uppercase mb-2">
          THE TRUTH ORACLE DOCTRINE
        </h1>
        <p className="text-sm opacity-80 tracking-wide">
          {language === 'sv' 
            ? 'ÖPPEN TRANSPARENS · INGET MANIPULATIVT MELLANLAGER'
            : 'OPEN TRANSPARENCY · NO MANIPULATIVE INTERMEDIARY'}
        </p>
      </div>

      {/* Core Statement */}
      <div className="p-8 border-b border-border bg-muted/20">
        <p className="text-lg text-center text-foreground leading-relaxed">
          {TRUTH_ORACLE_DOCTRINE.coreStatement[language]}
        </p>
      </div>

      {/* What the system IS and IS NOT */}
      <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
        <div className="p-6">
          <h2 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide text-center">
            {language === 'sv' ? 'Systemet är' : 'The system is'}
          </h2>
          <ul className="space-y-3">
            {TRUTH_ORACLE_DOCTRINE.systemIs.map((item, index) => (
              <li key={index} className="flex items-center gap-3 text-muted-foreground">
                <span className="w-2 h-2 bg-foreground" />
                {item[language]}
              </li>
            ))}
          </ul>
        </div>
        <div className="p-6 bg-muted/10">
          <h2 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide text-center">
            {language === 'sv' ? 'Systemet är inte' : 'The system is not'}
          </h2>
          <ul className="space-y-3">
            {TRUTH_ORACLE_DOCTRINE.systemIsNot.map((item, index) => (
              <li key={index} className="flex items-center gap-3 text-muted-foreground">
                <span className="w-2 h-2 border border-destructive" />
                {item[language]}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Legitimate Politics */}
      <div className="p-6 border-t border-border">
        <h2 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide">
          {language === 'sv' ? 'Politikens legitima form' : 'The legitimate form of politics'}
        </h2>
        <ul className="space-y-2 mb-4">
          {TRUTH_ORACLE_DOCTRINE.legitimatePolitics.requirements.map((req, index) => (
            <li key={index} className="flex items-center gap-3 text-muted-foreground text-sm">
              <span className="flex-shrink-0 w-5 h-5 border border-border flex items-center justify-center text-xs font-mono">
                {index + 1}
              </span>
              {req[language]}
            </li>
          ))}
        </ul>
        <div className="text-center p-4 border border-border bg-muted/20">
          <code className="text-foreground font-mono tracking-wider">
            {TRUTH_ORACLE_DOCTRINE.legitimatePolitics.formula[language]}
          </code>
        </div>
      </div>

      {/* Authority vs Legitimacy */}
      <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border border-t border-border">
        <div className="p-6">
          <h2 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide">
            {language === 'sv' ? 'Ger ingen auktoritet' : 'Does not give authority'}
          </h2>
          <ul className="space-y-2">
            {TRUTH_ORACLE_DOCTRINE.noAuthority.map((item, index) => (
              <li key={index} className="flex items-center gap-2 text-muted-foreground text-sm">
                <span className="text-destructive">×</span>
                {item[language]}
              </li>
            ))}
          </ul>
        </div>
        <div className="p-6 bg-muted/10">
          <h2 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide">
            {language === 'sv' ? 'Ger legitimitet' : 'Gives legitimacy'}
          </h2>
          <ul className="space-y-2">
            {TRUTH_ORACLE_DOCTRINE.legitimacySources.map((item, index) => (
              <li key={index} className="flex items-center gap-2 text-muted-foreground text-sm">
                <span className="text-foreground">→</span>
                {item[language]}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Neutrality Principles */}
      <div className="p-6 border-t border-border">
        <h2 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide text-center">
          {language === 'sv' ? 'Neutralitetsprinciper' : 'Neutrality Principles'}
        </h2>
        <div className="flex flex-wrap justify-center gap-2">
          {TRUTH_ORACLE_DOCTRINE.neutralityPrinciples.map((principle, index) => (
            <span 
              key={index}
              className="px-3 py-1 border border-border text-xs text-muted-foreground"
            >
              {principle[language]}
            </span>
          ))}
        </div>
      </div>

      {/* Oracle Statement */}
      <div className="p-6 border-t border-border bg-muted/20">
        <p className="text-center text-foreground">
          {language === 'sv'
            ? 'Oraklet svarar på vad som är observerbart. Människan svarar på vad hon vill.'
            : 'The oracle answers what is observable. The human answers what she wants.'}
        </p>
      </div>

      {/* Final Platform Disclaimer */}
      <PlatformDisclaimer language={language} variant="prominent" className="border-t border-border" />
    </div>
  );
}
