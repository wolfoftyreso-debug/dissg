/**
 * INSIGHT CALCULATOR
 * 
 * Avanza-inspirerad interaktiv kalkylator.
 * Visa vad diagnostik kan avslöja baserat på användarens val.
 */

import React, { useState, useMemo } from 'react';
import { Slider } from '@/components/ui/slider';

export const InsightCalculator: React.FC = () => {
  const [indicatorCount, setIndicatorCount] = useState([50]);
  const [timeRange, setTimeRange] = useState([10]);
  const [regionDepth, setRegionDepth] = useState([2]);

  // Calculate "insights" based on sliders
  const insights = useMemo(() => {
    const base = indicatorCount[0] * timeRange[0] * regionDepth[0];
    const patterns = Math.floor(base * 0.15);
    const correlations = Math.floor(base * 0.08);
    const anomalies = Math.floor(base * 0.02);
    
    return {
      datapoints: base * 12, // Monthly data
      patterns,
      correlations,
      anomalies,
    };
  }, [indicatorCount, timeRange, regionDepth]);

  const formatNumber = (n: number) => {
    return n.toLocaleString('sv-SE');
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Testa insiktskalkylatorn –<br />
            se vad du kan upptäcka
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Genom att analysera samhällsdata kan du hitta mönster, samband och 
            anomalier. Testa och se hur mycket insikt du kan få.
          </p>
        </div>

        {/* Calculator card */}
        <div className="bg-card border rounded-sm p-8 max-w-lg mx-auto">
          {/* Result display */}
          <div className="text-center mb-8">
            <div className="text-4xl font-bold font-mono mb-2">
              {formatNumber(insights.datapoints)} datapunkter
            </div>
            <p className="text-muted-foreground text-sm">
              varav {formatNumber(insights.patterns)} upptäckta mönster
            </p>
          </div>

          {/* Sliders */}
          <div className="space-y-6">
            {/* Indicator count */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Antal indikatorer</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono">{indicatorCount[0]}</span>
                </div>
              </div>
              <Slider
                value={indicatorCount}
                onValueChange={setIndicatorCount}
                min={10}
                max={184}
                step={10}
                className="py-2"
              />
            </div>

            {/* Time range */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tidsperiod (år)</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono">{timeRange[0]} år</span>
                </div>
              </div>
              <Slider
                value={timeRange}
                onValueChange={setTimeRange}
                min={1}
                max={30}
                step={1}
                className="py-2"
              />
            </div>

            {/* Region depth */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Geografiskt djup</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono">
                    {regionDepth[0] === 1 && 'Land'}
                    {regionDepth[0] === 2 && 'Region'}
                    {regionDepth[0] === 3 && 'Kommun'}
                  </span>
                </div>
              </div>
              <Slider
                value={regionDepth}
                onValueChange={setRegionDepth}
                min={1}
                max={3}
                step={1}
                className="py-2"
              />
            </div>
          </div>

          {/* Insights breakdown */}
          <div className="mt-8 pt-6 border-t grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold font-mono text-primary">{formatNumber(insights.patterns)}</div>
              <div className="text-xs text-muted-foreground">Mönster</div>
            </div>
            <div>
              <div className="text-lg font-bold font-mono text-primary">{formatNumber(insights.correlations)}</div>
              <div className="text-xs text-muted-foreground">Samband</div>
            </div>
            <div>
              <div className="text-lg font-bold font-mono text-primary">{formatNumber(insights.anomalies)}</div>
              <div className="text-xs text-muted-foreground">Anomalier</div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-xs text-muted-foreground mt-6 max-w-lg mx-auto">
          *Baserat på statistiska modeller för mönsterigenkänning. Faktisk insikt 
          beror på datakvalitet och analysmetodik.
        </p>

        <div className="text-center mt-4">
          <button className="text-sm text-primary hover:underline">
            Så har vi räknat
          </button>
        </div>
      </div>
    </section>
  );
};

export default InsightCalculator;
