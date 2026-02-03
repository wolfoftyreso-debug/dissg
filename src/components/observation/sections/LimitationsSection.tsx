/**
 * SECTION D: WHAT CANNOT BE CONCLUDED
 * 
 * ⚠️ THIS IS THE MOST IMPORTANT SECTION
 * 
 * Auto-generated list of:
 * - Missing data points
 * - Methodology changes
 * - Known biases
 * - Uncertain periods
 * - Alternative explanations
 * 
 * 📌 If this section is empty → analysis CANNOT be displayed.
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export interface LimitationItem {
  type: 'data_gap' | 'methodology_change' | 'known_bias' | 'uncertain_period' | 'alternative_explanation';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  affectedIndicators?: string[];
  affectedPeriod?: string;
  source?: string;
}

export interface LimitationsData {
  items: LimitationItem[];
  overallConfidence: 'low' | 'medium' | 'high';
  lastAssessed: string;
}

interface LimitationsSectionProps {
  data: LimitationsData;
  language: 'en' | 'sv';
}

const TYPE_LABELS = {
  data_gap: { en: 'Data Gap', sv: 'Datagap' },
  methodology_change: { en: 'Methodology Change', sv: 'Metodändring' },
  known_bias: { en: 'Known Bias', sv: 'Känd bias' },
  uncertain_period: { en: 'Uncertain Period', sv: 'Osäker period' },
  alternative_explanation: { en: 'Alternative Explanation', sv: 'Alternativ förklaring' },
};

const SEVERITY_LABELS = {
  low: { en: 'Minor', sv: 'Mindre' },
  medium: { en: 'Moderate', sv: 'Måttlig' },
  high: { en: 'Significant', sv: 'Betydande' },
};

export function LimitationsSection({ data, language }: LimitationsSectionProps) {
  // Group by type
  const grouped = data.items.reduce((acc, item) => {
    if (!acc[item.type]) acc[item.type] = [];
    acc[item.type].push(item);
    return acc;
  }, {} as Record<string, LimitationItem[]>);

  return (
    <div className="space-y-4">
      {/* Overall confidence indicator */}
      <div className="flex items-center gap-4 text-xs font-mono">
        <span className="text-muted-foreground uppercase tracking-wider">
          {language === 'sv' ? 'Total konfidens' : 'Overall confidence'}:
        </span>
        <span className="text-foreground">
          {SEVERITY_LABELS[data.overallConfidence][language]}
        </span>
        <span className="text-muted-foreground">
          ({language === 'sv' ? 'bedömd' : 'assessed'}: {new Date(data.lastAssessed).toLocaleDateString(language === 'sv' ? 'sv-SE' : 'en-GB')})
        </span>
      </div>

      {/* Limitations by type */}
      {Object.entries(grouped).map(([type, items]) => (
        <LimitationTypeCard
          key={type}
          type={type as LimitationItem['type']}
          items={items}
          language={language}
        />
      ))}

      {/* Critical note if high-severity items exist */}
      {data.items.some(i => i.severity === 'high') && (
        <div className="bg-muted p-4 border-l-4 border-l-muted-foreground text-xs font-mono">
          <p className="text-foreground font-medium mb-1">
            {language === 'sv' 
              ? 'Betydande begränsningar identifierade'
              : 'Significant limitations identified'}
          </p>
          <p className="text-muted-foreground">
            {language === 'sv'
              ? 'Slutsatser baserade på denna data bör behandlas med extra försiktighet.'
              : 'Conclusions based on this data should be treated with extra caution.'}
          </p>
        </div>
      )}
    </div>
  );
}

function LimitationTypeCard({
  type,
  items,
  language,
}: {
  type: LimitationItem['type'];
  items: LimitationItem[];
  language: 'en' | 'sv';
}) {
  return (
    <Card className="border-border bg-background">
      <CardContent className="p-4">
        <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">
          {TYPE_LABELS[type][language]} ({items.length})
        </h4>
        <ul className="space-y-3">
          {items.map((item, i) => (
            <li key={i} className="border-l-2 border-border pl-3">
              <div className="flex items-start justify-between">
                <span className="text-sm text-foreground">{item.title}</span>
                <span className="text-[10px] text-muted-foreground uppercase">
                  {SEVERITY_LABELS[item.severity][language]}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {item.description}
              </p>
              {item.affectedIndicators && item.affectedIndicators.length > 0 && (
                <p className="text-[10px] text-muted-foreground/70 mt-1 font-mono">
                  {language === 'sv' ? 'Påverkar' : 'Affects'}: {item.affectedIndicators.join(', ')}
                </p>
              )}
              {item.affectedPeriod && (
                <p className="text-[10px] text-muted-foreground/70 font-mono">
                  {language === 'sv' ? 'Period' : 'Period'}: {item.affectedPeriod}
                </p>
              )}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export default LimitationsSection;
