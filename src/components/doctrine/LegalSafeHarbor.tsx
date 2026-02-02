/**
 * LEGAL SAFE HARBOR
 * 
 * Juridisk ansvarsfriskrivning – skyddar plattformen juridiskt.
 */

import React from 'react';
import { LEGAL_SAFE_HARBOR } from '@/config/truthOracleDoctrineConfig';

interface LegalSafeHarborProps {
  language?: 'sv' | 'en';
  compact?: boolean;
}

export function LegalSafeHarbor({ language = 'en', compact = false }: LegalSafeHarborProps) {
  if (compact) {
    return (
      <div className="text-xs text-muted-foreground p-4 border border-border bg-muted/20">
        <p className="font-semibold mb-2 uppercase tracking-wide">
          {LEGAL_SAFE_HARBOR.title[language]}
        </p>
        <p>
          {LEGAL_SAFE_HARBOR.sections[0].text[language]}
        </p>
        <p className="mt-2 font-medium text-foreground">
          {LEGAL_SAFE_HARBOR.finalStatement[language]}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-card border border-border">
      {/* Header */}
      <div className="border-b border-border p-6 text-center bg-muted/30">
        <h1 className="text-xl font-bold text-foreground tracking-wide uppercase">
          {LEGAL_SAFE_HARBOR.title[language]}
        </h1>
      </div>

      {/* Sections */}
      <div className="divide-y divide-border">
        {LEGAL_SAFE_HARBOR.sections.map((section, index) => (
          <div key={index} className="p-6">
            <h2 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">
              {section.heading[language]}
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {section.text[language]}
            </p>
          </div>
        ))}
      </div>

      {/* Final Statement */}
      <div className="p-6 border-t-2 border-foreground bg-foreground text-background">
        <p className="text-center font-bold tracking-wide">
          {LEGAL_SAFE_HARBOR.finalStatement[language]}
        </p>
      </div>
    </div>
  );
}
