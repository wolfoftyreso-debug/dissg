/**
 * SECTION A: WHAT WAS OBSERVED
 * 
 * Primary indicators as time series.
 * Clear axes, historical average marked, peer-group overlay.
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export interface IndicatorData {
  code: string;
  name: string;
  unit: string;
  values: Array<{
    date: string;
    value: number;
    isBaseline?: boolean;
  }>;
  historicalAverage: number;
  source: string;
  methodology: string;
}

export interface ObservationData {
  indicators: IndicatorData[];
  baselinePeriod: string;
}

interface ObservationSectionProps {
  data: ObservationData;
  language: 'en' | 'sv';
  graphNote: string;
}

export function ObservationSection({ 
  data, 
  language,
  graphNote,
}: ObservationSectionProps) {
  return (
    <div className="space-y-6">
      {data.indicators.map((indicator) => (
        <IndicatorCard 
          key={indicator.code}
          indicator={indicator}
          language={language}
          graphNote={graphNote}
          baselinePeriod={data.baselinePeriod}
        />
      ))}
    </div>
  );
}

function IndicatorCard({
  indicator,
  language,
  graphNote,
  baselinePeriod,
}: {
  indicator: IndicatorData;
  language: 'en' | 'sv';
  graphNote: string;
  baselinePeriod: string;
}) {
  // Calculate change from baseline
  const latestValue = indicator.values[indicator.values.length - 1]?.value ?? 0;
  const change = ((latestValue - indicator.historicalAverage) / indicator.historicalAverage) * 100;

  return (
    <Card className="border-border bg-background">
      <CardContent className="p-4">
        {/* Indicator Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-sm font-medium text-foreground">
              {indicator.name}
            </h3>
            <p className="text-xs text-muted-foreground font-mono">
              {indicator.code} · {indicator.unit}
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-muted-foreground">
              {language === 'sv' ? 'Senaste' : 'Latest'}
            </span>
            <p className="text-sm font-mono text-foreground">
              {latestValue.toLocaleString(language === 'sv' ? 'sv-SE' : 'en-GB')}
            </p>
          </div>
        </div>

        {/* Simplified Time Series Visualization */}
        <div className="h-32 bg-muted/30 border border-border flex items-end justify-between p-2 gap-1">
          {indicator.values.slice(-24).map((point, i) => {
            const height = Math.max(10, (point.value / (indicator.historicalAverage * 1.5)) * 100);
            const isAboveBaseline = point.value > indicator.historicalAverage;
            
            return (
              <div 
                key={i}
                className="flex-1 flex flex-col justify-end"
                title={`${point.date}: ${point.value}`}
              >
                <div 
                  className={`w-full ${isAboveBaseline ? 'bg-foreground' : 'bg-muted-foreground'}`}
                  style={{ height: `${Math.min(height, 100)}%` }}
                />
              </div>
            );
          })}
        </div>

        {/* Baseline marker */}
        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground font-mono">
          <span>
            {language === 'sv' ? 'Historiskt snitt' : 'Historical avg'}: {indicator.historicalAverage.toLocaleString()}
          </span>
          <span>
            {language === 'sv' ? 'Basperiod' : 'Baseline'}: {baselinePeriod}
          </span>
        </div>

        {/* Change from baseline */}
        <div className="mt-3 pt-3 border-t border-border">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              {language === 'sv' ? 'Förändring från baslinje' : 'Change from baseline'}
            </span>
            <span className="font-mono text-foreground">
              {change > 0 ? '+' : ''}{change.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Fixed graph note */}
        <p className="text-xs text-muted-foreground mt-3 italic">
          {graphNote}
        </p>

        {/* Source */}
        <div className="mt-3 flex items-center justify-between text-[10px] text-muted-foreground/70">
          <span>
            {language === 'sv' ? 'Källa' : 'Source'}: {indicator.source}
          </span>
          <a href="#" className="underline hover:text-muted-foreground">
            {language === 'sv' ? 'Metod' : 'Methodology'}
          </a>
        </div>
      </CardContent>
    </Card>
  );
}

export default ObservationSection;
