/**
 * SECTION B: WHAT MOVED TOGETHER
 * 
 * Correlation matrix with user selection.
 * Stability measure shown. Time lag shown.
 */

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

export interface CorrelationPair {
  indicatorA: string;
  indicatorB: string;
  correlation: number; // -1 to 1
  stabilityScore: number; // 0-100
  timeLag: number | null; // months
  sampleSize: number;
  period: string;
}

export interface CoMovementData {
  availableIndicators: string[];
  correlations: CorrelationPair[];
}

interface CoMovementSectionProps {
  data: CoMovementData;
  language: 'en' | 'sv';
}

export function CoMovementSection({ data, language }: CoMovementSectionProps) {
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>(
    data.availableIndicators.slice(0, 4)
  );

  const toggleIndicator = (indicator: string) => {
    setSelectedIndicators(prev => 
      prev.includes(indicator)
        ? prev.filter(i => i !== indicator)
        : [...prev, indicator]
    );
  };

  // Filter correlations based on selected indicators
  const visibleCorrelations = data.correlations.filter(
    c => selectedIndicators.includes(c.indicatorA) && selectedIndicators.includes(c.indicatorB)
  );

  return (
    <div className="space-y-4">
      {/* Indicator Selection */}
      <Card className="border-border bg-background">
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">
            {language === 'sv' ? 'Välj indikatorer att jämföra' : 'Select indicators to compare'}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {data.availableIndicators.map(indicator => (
              <label 
                key={indicator}
                className="flex items-center gap-2 text-xs font-mono cursor-pointer"
              >
                <Checkbox
                  checked={selectedIndicators.includes(indicator)}
                  onCheckedChange={() => toggleIndicator(indicator)}
                />
                <span className="text-foreground">{indicator}</span>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Correlation Matrix */}
      {visibleCorrelations.length > 0 ? (
        <Card className="border-border bg-background">
          <CardContent className="p-4">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-muted-foreground font-medium">
                    {language === 'sv' ? 'Par' : 'Pair'}
                  </th>
                  <th className="text-right py-2 text-muted-foreground font-medium">r</th>
                  <th className="text-right py-2 text-muted-foreground font-medium">
                    {language === 'sv' ? 'Stabilitet' : 'Stability'}
                  </th>
                  <th className="text-right py-2 text-muted-foreground font-medium">
                    {language === 'sv' ? 'Fördröjning' : 'Lag'}
                  </th>
                  <th className="text-right py-2 text-muted-foreground font-medium">n</th>
                </tr>
              </thead>
              <tbody>
                {visibleCorrelations.map((corr, i) => (
                  <tr key={i} className="border-b border-border/50">
                    <td className="py-2 text-foreground">
                      {corr.indicatorA} ↔ {corr.indicatorB}
                    </td>
                    <td className="py-2 text-right text-foreground">
                      {corr.correlation > 0 ? '+' : ''}{corr.correlation.toFixed(2)}
                    </td>
                    <td className="py-2 text-right text-muted-foreground">
                      {corr.stabilityScore}/100
                    </td>
                    <td className="py-2 text-right text-muted-foreground">
                      {corr.timeLag !== null ? `${corr.timeLag}m` : '—'}
                    </td>
                    <td className="py-2 text-right text-muted-foreground">
                      {corr.sampleSize}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      ) : (
        <div className="text-center py-8 text-xs text-muted-foreground">
          {language === 'sv' 
            ? 'Välj minst två indikatorer för att se korrelationer.'
            : 'Select at least two indicators to see correlations.'}
        </div>
      )}

      {/* Interpretation guide */}
      <div className="grid grid-cols-3 gap-4 text-[10px] text-muted-foreground font-mono">
        <div>
          <span className="uppercase tracking-wider">r</span>
          <p className="mt-1">
            {language === 'sv' 
              ? 'Korrelationskoefficient (-1 till +1)'
              : 'Correlation coefficient (-1 to +1)'}
          </p>
        </div>
        <div>
          <span className="uppercase tracking-wider">
            {language === 'sv' ? 'Stabilitet' : 'Stability'}
          </span>
          <p className="mt-1">
            {language === 'sv'
              ? 'Konsistens över tid (0-100)'
              : 'Consistency over time (0-100)'}
          </p>
        </div>
        <div>
          <span className="uppercase tracking-wider">
            {language === 'sv' ? 'Fördröjning' : 'Lag'}
          </span>
          <p className="mt-1">
            {language === 'sv'
              ? 'Tidsförskjutning i månader'
              : 'Time offset in months'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default CoMovementSection;
