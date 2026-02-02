/**
 * PUBLIC CHARTER & ToS DISPLAY
 * 
 * Public-ready presentation of charter and terms.
 */

import React from 'react';
import {
  PUBLIC_CHARTER,
  TERMS_OF_SERVICE,
  INTERNAL_OPERATING_RULE,
  COMPLETION_CRITERIA,
} from '@/config/publicCharterConfig';

interface CharterSectionProps {
  label: { en: string; sv: string };
  items: { en: string; sv: string }[];
  language: 'en' | 'sv';
  variant?: 'does' | 'does-not' | 'neutral';
}

function CharterSection({ label, items, language, variant = 'neutral' }: CharterSectionProps) {
  const borderColor = variant === 'does' ? 'border-primary/30' : variant === 'does-not' ? 'border-destructive/30' : 'border-border';
  
  return (
    <div className={`border ${borderColor} p-4`}>
      <h3 className="font-semibold text-sm mb-3">{label[language]}</h3>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <span className={variant === 'does-not' ? 'text-destructive' : 'text-primary'}>
              {variant === 'does-not' ? '✗' : '✓'}
            </span>
            <span className="text-muted-foreground">{item[language]}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface PublicCharterDisplayProps {
  language?: 'en' | 'sv';
  showToS?: boolean;
  compact?: boolean;
}

export function PublicCharterDisplay({ language = 'en', showToS = true, compact = false }: PublicCharterDisplayProps) {
  return (
    <div className="space-y-8">
      {/* Charter Header */}
      <div className="text-center border-b pb-6">
        <h1 className="text-2xl font-bold mb-2">📜 {language === 'en' ? 'Public Charter' : 'Offentlig stadga'}</h1>
        <p className="text-lg text-muted-foreground italic">{PUBLIC_CHARTER.title[language]}</p>
        <p className="text-xs text-muted-foreground mt-2">v{PUBLIC_CHARTER.version}</p>
      </div>

      {/* Purpose */}
      <div className="bg-muted/30 p-6 border">
        <h2 className="font-semibold mb-2">{language === 'en' ? 'Purpose' : 'Syfte'}</h2>
        <p className="text-muted-foreground">{PUBLIC_CHARTER.purpose[language]}</p>
      </div>

      {/* What it does / does not */}
      <div className={`grid gap-4 ${compact ? 'grid-cols-1' : 'md:grid-cols-2'}`}>
        <CharterSection
          label={PUBLIC_CHARTER.whatPlatformDoes.label}
          items={PUBLIC_CHARTER.whatPlatformDoes.items}
          language={language}
          variant="does"
        />
        <CharterSection
          label={PUBLIC_CHARTER.whatPlatformDoesNot.label}
          items={PUBLIC_CHARTER.whatPlatformDoesNot.items}
          language={language}
          variant="does-not"
        />
      </div>

      {/* Neutrality & User Responsibility */}
      <div className={`grid gap-4 ${compact ? 'grid-cols-1' : 'md:grid-cols-2'}`}>
        <CharterSection
          label={PUBLIC_CHARTER.neutralityMethod.label}
          items={PUBLIC_CHARTER.neutralityMethod.items}
          language={language}
        />
        <CharterSection
          label={PUBLIC_CHARTER.userResponsibility.label}
          items={PUBLIC_CHARTER.userResponsibility.items}
          language={language}
        />
      </div>

      {/* Core Principle */}
      <div className="border-2 border-primary p-6 text-center bg-primary/5">
        <h3 className="font-bold mb-2">{PUBLIC_CHARTER.corePrinciple.label[language]}</h3>
        <p className="text-lg italic">{PUBLIC_CHARTER.corePrinciple.statement[language]}</p>
      </div>

      {/* Terms of Service */}
      {showToS && (
        <div className="space-y-4 pt-8 border-t">
          <h2 className="text-xl font-bold">⚖️ {TERMS_OF_SERVICE.title[language]}</h2>
          <div className="space-y-4">
            {TERMS_OF_SERVICE.clauses.map((clause) => (
              <div key={clause.id} className="border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono text-xs text-muted-foreground">{clause.id}</span>
                  <h4 className="font-semibold text-sm">{clause.title[language]}</h4>
                </div>
                <p className="text-sm text-muted-foreground">{clause.text[language]}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function InternalRuleDisplay({ language = 'en' }: { language?: 'en' | 'sv' }) {
  return (
    <div className="border-2 border-destructive/50 bg-destructive/5 p-6">
      <div className="text-center">
        <h3 className="font-bold text-lg mb-1">🧠 {INTERNAL_OPERATING_RULE.title[language]}</h3>
        <p className="text-xs text-muted-foreground mb-4">{INTERNAL_OPERATING_RULE.subtitle[language]}</p>
        <p className="text-lg font-medium">{INTERNAL_OPERATING_RULE.rule[language]}</p>
      </div>
    </div>
  );
}

export function CompletionCriteriaDisplay({ language = 'en' }: { language?: 'en' | 'sv' }) {
  return (
    <div className="space-y-4">
      <h3 className="font-bold">{COMPLETION_CRITERIA.title[language]}</h3>
      <ul className="space-y-2">
        {COMPLETION_CRITERIA.criteria.map((criterion, i) => (
          <li key={i} className="flex items-center gap-2 text-sm">
            <span className="text-primary">✓</span>
            <span>{criterion[language]}</span>
          </li>
        ))}
      </ul>
      <div className="border-t pt-4 mt-4">
        <p className="text-sm italic text-muted-foreground">{COMPLETION_CRITERIA.conclusion[language]}</p>
      </div>
    </div>
  );
}
