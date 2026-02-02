/**
 * SCENARIO DISCLAIMER
 * 
 * Mandatory disclaimers for all scenario outputs.
 * Protects both the platform and the user.
 */

import React from 'react';
import { 
  OUTPUT_RULES, 
  TRACEABILITY, 
  COUNTERWEIGHT_SYSTEM 
} from '@/config/scenarioLabConfig';

interface ScenarioDisclaimerProps {
  language?: 'en' | 'sv';
  variant?: 'inline' | 'block' | 'export';
  className?: string;
}

export function ScenarioDisclaimer({
  language = 'en',
  variant = 'inline',
  className = '',
}: ScenarioDisclaimerProps) {
  if (variant === 'inline') {
    return (
      <p className={`text-xs text-muted-foreground italic ${className}`}>
        {OUTPUT_RULES.mandatoryDisclaimer[language]}
      </p>
    );
  }

  if (variant === 'export') {
    return (
      <div className={`border-2 border-amber-500/30 bg-amber-500/5 p-4 space-y-3 ${className}`}>
        <div className="flex items-center gap-2">
          <span className="text-amber-600">⚠️</span>
          <span className="font-bold text-sm uppercase tracking-wider text-amber-700">
            {language === 'en' ? 'Required Disclaimer' : 'Obligatorisk disclaimer'}
          </span>
        </div>
        
        <p className="text-sm">{TRACEABILITY.standardDisclaimer[language]}</p>
        
        <div className="pt-2 border-t border-amber-500/20">
          <p className="text-xs text-muted-foreground">
            {OUTPUT_RULES.mandatoryDisclaimer[language]}
          </p>
        </div>
      </div>
    );
  }

  // Block variant
  return (
    <div className={`border border-border bg-muted/50 p-3 ${className}`}>
      <p className="text-sm text-muted-foreground">
        {OUTPUT_RULES.mandatoryDisclaimer[language]}
      </p>
    </div>
  );
}

/**
 * Counterweight warning shown on export/share/conclusion
 */
export function CounterweightWarning({
  language = 'en',
  onDismiss,
  onBroaderReview,
  className = '',
}: {
  language?: 'en' | 'sv';
  onDismiss?: () => void;
  onBroaderReview?: () => void;
  className?: string;
}) {
  return (
    <div className={`border-2 border-amber-500 bg-amber-500/10 p-6 space-y-4 ${className}`}>
      <div className="flex items-start gap-3">
        <span className="text-2xl">⚠️</span>
        <div className="flex-1">
          <h3 className="font-bold text-lg">
            {language === 'en' ? 'Before You Proceed' : 'Innan du fortsätter'}
          </h3>
          <p className="text-lg mt-2">{COUNTERWEIGHT_SYSTEM.systemResponse[language]}</p>
        </div>
      </div>

      <div className="border-t border-amber-500/30 pt-4">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">
          {language === 'en' ? 'Recommended resources:' : 'Rekommenderade resurser:'}
        </span>
        <div className="flex flex-wrap gap-2 mt-2">
          {COUNTERWEIGHT_SYSTEM.linkedResources.map((resource, i) => (
            <button
              key={i}
              onClick={onBroaderReview}
              className="px-3 py-1 text-sm border border-amber-500/50 hover:bg-amber-500/10 transition-colors"
            >
              {resource[language]} →
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          onClick={onDismiss}
          className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {language === 'en' ? 'I understand, proceed anyway' : 'Jag förstår, fortsätt ändå'}
        </button>
      </div>
    </div>
  );
}

/**
 * Scenario metadata for traceability
 */
export function ScenarioMetadata({
  userId,
  timestamp,
  version,
  assumptions,
  language = 'en',
  className = '',
}: {
  userId: string;
  timestamp: Date;
  version: number;
  assumptions: string[];
  language?: 'en' | 'sv';
  className?: string;
}) {
  const labels = {
    en: {
      title: 'Scenario Metadata',
      user: 'Created by',
      time: 'Timestamp',
      version: 'Version',
      assumptions: 'Assumptions',
    },
    sv: {
      title: 'Scenariometadata',
      user: 'Skapad av',
      time: 'Tidsstämpel',
      version: 'Version',
      assumptions: 'Antaganden',
    },
  }[language];

  return (
    <div className={`border border-border bg-card p-4 space-y-3 text-sm ${className}`}>
      <h4 className="font-bold">{labels.title}</h4>
      
      <div className="grid grid-cols-2 gap-2">
        <div>
          <span className="text-xs text-muted-foreground">{labels.user}</span>
          <p className="font-mono text-xs">{userId}</p>
        </div>
        <div>
          <span className="text-xs text-muted-foreground">{labels.time}</span>
          <p className="font-mono text-xs">{timestamp.toISOString()}</p>
        </div>
        <div>
          <span className="text-xs text-muted-foreground">{labels.version}</span>
          <p className="font-mono text-xs">v{version}</p>
        </div>
      </div>

      <div>
        <span className="text-xs text-muted-foreground">{labels.assumptions}</span>
        <ul className="mt-1 space-y-1">
          {assumptions.map((a, i) => (
            <li key={i} className="text-xs font-mono bg-muted px-2 py-1">• {a}</li>
          ))}
        </ul>
      </div>

      <div className="pt-2 border-t border-border">
        <p className="text-xs text-muted-foreground italic">
          {TRACEABILITY.standardDisclaimer[language]}
        </p>
      </div>
    </div>
  );
}
