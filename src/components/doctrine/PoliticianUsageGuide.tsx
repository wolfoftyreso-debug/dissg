/**
 * POLITICIAN USAGE GUIDE
 * 
 * Riktlinjer för hur politiker får och inte får använda plattformen.
 */

import React from 'react';
import { POLITICIAN_USAGE_GUIDE } from '@/config/truthOracleDoctrineConfig';
import { PlatformDisclaimer } from './PlatformDisclaimer';

interface PoliticianUsageGuideProps {
  language?: 'sv' | 'en';
}

export function PoliticianUsageGuide({ language = 'en' }: PoliticianUsageGuideProps) {
  return (
    <div className="max-w-3xl mx-auto bg-card border border-border">
      {/* Header */}
      <div className="border-b border-border p-6 text-center">
        <h1 className="text-2xl font-bold text-foreground tracking-wide uppercase">
          {POLITICIAN_USAGE_GUIDE.title[language]}
        </h1>
      </div>

      <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
        {/* Legitimate Uses */}
        <div className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">
            {language === 'sv' ? 'TILLÅTEN ANVÄNDNING' : 'PERMITTED USE'}
          </h2>
          <ul className="space-y-3">
            {POLITICIAN_USAGE_GUIDE.legitimeUses.map((use, index) => (
              <li key={index} className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 border border-border flex items-center justify-center text-xs font-mono">
                  {index + 1}
                </span>
                <span className="text-muted-foreground text-sm">
                  {use[language]}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Forbidden Uses */}
        <div className="p-6 bg-muted/20">
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">
            {language === 'sv' ? 'FÖRBJUDEN ANVÄNDNING' : 'FORBIDDEN USE'}
          </h2>
          <ul className="space-y-3">
            {POLITICIAN_USAGE_GUIDE.forbiddenUses.map((use, index) => (
              <li key={index} className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 border border-destructive/50 flex items-center justify-center text-xs font-mono text-destructive">
                  ×
                </span>
                <span className="text-muted-foreground text-sm">
                  {use[language]}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Required Disclaimer */}
      <div className="p-6 border-t border-border bg-muted/30">
        <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">
          {language === 'sv' ? 'Obligatorisk hänvisningstext' : 'Required Reference Text'}
        </h3>
        <div className="p-4 bg-background border border-border">
          <p className="text-sm text-foreground font-mono">
            {POLITICIAN_USAGE_GUIDE.requiredDisclaimer[language]}
          </p>
        </div>
      </div>

      {/* Platform Disclaimer */}
      <PlatformDisclaimer language={language} variant="footer" />
    </div>
  );
}
