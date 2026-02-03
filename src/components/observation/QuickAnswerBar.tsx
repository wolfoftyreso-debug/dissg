/**
 * QUICK ANSWER BAR
 * 
 * 🔬 30-SECOND RULE
 * 
 * Compact fact row at the top – NOT conclusions.
 * No words like "good", "bad", "failure", "disgrace".
 */

import React from 'react';

export interface QuickAnswerData {
  periodStart: string;
  periodEnd: string;
  regionsCount: number;
  indicatorsCount: number;
  dataCoverage: number; // 0-100
  majorDataGaps: string[];
  lastUpdated: string;
}

interface QuickAnswerBarProps {
  data: QuickAnswerData;
  language?: 'en' | 'sv';
}

const LABELS = {
  period: { en: 'Period analyzed', sv: 'Analyserad period' },
  regions: { en: 'Regions covered', sv: 'Täckta regioner' },
  indicators: { en: 'Indicators used', sv: 'Använda indikatorer' },
  coverage: { en: 'Data coverage', sv: 'Datatäckning' },
  gaps: { en: 'Major data gaps', sv: 'Större datagap' },
  updated: { en: 'Last updated', sv: 'Senast uppdaterad' },
};

export function QuickAnswerBar({ data, language = 'en' }: QuickAnswerBarProps) {
  return (
    <div className="bg-muted/30 border border-border p-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-xs font-mono">
        {/* Period */}
        <DataCell
          label={LABELS.period[language]}
          value={`${data.periodStart}–${data.periodEnd}`}
        />

        {/* Regions */}
        <DataCell
          label={LABELS.regions[language]}
          value={`${data.regionsCount} ${language === 'sv' ? 'länder' : 'countries'}`}
        />

        {/* Indicators */}
        <DataCell
          label={LABELS.indicators[language]}
          value={String(data.indicatorsCount)}
        />

        {/* Coverage */}
        <DataCell
          label={LABELS.coverage[language]}
          value={`${data.dataCoverage}%`}
        />

        {/* Data Gaps */}
        <DataCell
          label={LABELS.gaps[language]}
          value={data.majorDataGaps.length > 0 
            ? `${language === 'sv' ? 'se sektion D' : 'see section D'}` 
            : `${language === 'sv' ? 'inga kända' : 'none known'}`}
          isLink={data.majorDataGaps.length > 0}
          linkTo="#section-d"
        />

        {/* Last Updated */}
        <DataCell
          label={LABELS.updated[language]}
          value={new Date(data.lastUpdated).toLocaleDateString(
            language === 'sv' ? 'sv-SE' : 'en-GB'
          )}
        />
      </div>
    </div>
  );
}

function DataCell({ 
  label, 
  value, 
  isLink = false,
  linkTo = '#',
}: { 
  label: string; 
  value: string;
  isLink?: boolean;
  linkTo?: string;
}) {
  return (
    <div className="space-y-1">
      <span className="text-muted-foreground text-[10px] uppercase tracking-wider block">
        {label}
      </span>
      {isLink ? (
        <a 
          href={linkTo}
          className="text-foreground underline hover:text-muted-foreground"
        >
          {value}
        </a>
      ) : (
        <span className="text-foreground">{value}</span>
      )}
    </div>
  );
}

export default QuickAnswerBar;
