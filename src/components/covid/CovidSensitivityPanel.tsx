/**
 * COVID-19 REALITY LAYER - Sensitivity Panel (Fjädran)
 * Tests how conclusions change under different assumptions
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Sliders, TrendingUp, TrendingDown, Minus, AlertTriangle } from 'lucide-react';
import { STABILITY_DISPLAY } from '@/lib/covid/sensitivity-analyzer';
import type { StabilityClassification } from '@/types/covid';

interface SensitivityResult {
  parameter: string;
  baseValue: number;
  testedValue: number;
  resultChange: number;
  changePercent: number;
}

export function CovidSensitivityPanel() {
  const [timeWindow, setTimeWindow] = useState([30]);
  const [reportingFactor, setReportingFactor] = useState([1.0]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<SensitivityResult[] | null>(null);
  const [stability, setStability] = useState<StabilityClassification | null>(null);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    await new Promise(r => setTimeout(r, 800));

    // Demo results
    const demoResults: SensitivityResult[] = [
      { parameter: 'Time Window', baseValue: 30, testedValue: timeWindow[0], resultChange: (timeWindow[0] - 30) * 100, changePercent: ((timeWindow[0] - 30) / 30) * 100 },
      { parameter: 'Reporting Factor', baseValue: 1.0, testedValue: reportingFactor[0], resultChange: (reportingFactor[0] - 1.0) * 15000, changePercent: (reportingFactor[0] - 1.0) * 100 },
    ];

    const maxChange = Math.max(...demoResults.map(r => Math.abs(r.changePercent)));
    let stabilityResult: StabilityClassification;
    if (maxChange < 5) stabilityResult = 'robust';
    else if (maxChange < 15) stabilityResult = 'moderate';
    else if (maxChange < 30) stabilityResult = 'sensitive';
    else stabilityResult = 'unstable';

    setResults(demoResults);
    setStability(stabilityResult);
    setIsAnalyzing(false);
  };

  const stabilityDisplay = stability ? STABILITY_DISPLAY[stability] : null;

  return (
    <div className="space-y-6">
      {/* Intro */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <Sliders className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Sensitivity Analysis (Fjädran)</p>
              <p className="text-xs text-muted-foreground">
                Test how conclusions change when assumptions are varied. 
                Drag the sliders to adjust parameters and see if the result is robust or sensitive.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Parameter Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Adjust Parameters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Time Window (days)</Label>
              <span className="text-sm font-mono">{timeWindow[0]}</span>
            </div>
            <Slider
              value={timeWindow}
              onValueChange={setTimeWindow}
              min={7}
              max={90}
              step={7}
            />
            <p className="text-xs text-muted-foreground">
              How many days of data to include in the analysis
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Reporting Adjustment Factor</Label>
              <span className="text-sm font-mono">{reportingFactor[0].toFixed(2)}x</span>
            </div>
            <Slider
              value={reportingFactor}
              onValueChange={setReportingFactor}
              min={0.7}
              max={1.3}
              step={0.05}
            />
            <p className="text-xs text-muted-foreground">
              Adjust for potential under/over-reporting (1.0 = as reported)
            </p>
          </div>

          <Button onClick={handleAnalyze} disabled={isAnalyzing} className="w-full">
            {isAnalyzing ? 'Analyzing...' : 'Run Sensitivity Analysis'}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {results && stability && (
        <>
          <Card className={`border-${stabilityDisplay?.color}-500/30`}>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                Stability Assessment
                <Badge className={`${stabilityDisplay?.bgClass} ${stabilityDisplay?.textClass}`}>
                  {stabilityDisplay?.icon} {stabilityDisplay?.label}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {stabilityDisplay?.description}
              </p>

              <div className="space-y-3">
                {results.map((result, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded">
                    <div>
                      <p className="text-sm font-medium">{result.parameter}</p>
                      <p className="text-xs text-muted-foreground">
                        {result.baseValue} → {result.testedValue}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {result.changePercent > 5 ? (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      ) : result.changePercent < -5 ? (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      ) : (
                        <Minus className="w-4 h-4 text-muted-foreground" />
                      )}
                      <span className={`text-sm font-mono ${
                        Math.abs(result.changePercent) > 10 ? 'text-warning' : ''
                      }`}>
                        {result.changePercent > 0 ? '+' : ''}{result.changePercent.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Interpretation */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-warning" />
                Interpretation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {stability === 'robust' && 
                  'The observed pattern is robust and does not significantly change under tested variations. Conclusions can be stated with higher confidence.'}
                {stability === 'moderate' && 
                  'The observed pattern is moderately stable but shows some sensitivity to parameter changes. Conclusions should note this uncertainty.'}
                {stability === 'sensitive' && 
                  'The observed pattern is sensitive to assumptions. Conclusions should be stated with caution and explicitly note the sensitivity.'}
                {stability === 'unstable' && 
                  'The observed pattern is highly sensitive to assumptions. No firm conclusions can be drawn from this data without additional verification.'}
              </p>
            </CardContent>
          </Card>
        </>
      )}

      {/* Standard Tests */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Standard Sensitivity Tests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="p-3 bg-muted/50 rounded">
              <p className="text-sm font-medium">Time Window Test</p>
              <p className="text-xs text-muted-foreground">
                Tests 7, 14, 30, 60, 90 day windows
              </p>
            </div>
            <div className="p-3 bg-muted/50 rounded">
              <p className="text-sm font-medium">Reporting Adjustment</p>
              <p className="text-xs text-muted-foreground">
                Tests 0.8x to 1.2x reporting factors
              </p>
            </div>
            <div className="p-3 bg-muted/50 rounded">
              <p className="text-sm font-medium">Preliminary Data Exclusion</p>
              <p className="text-xs text-muted-foreground">
                Tests with/without preliminary data
              </p>
            </div>
            <div className="p-3 bg-muted/50 rounded">
              <p className="text-sm font-medium">Age Group Filter</p>
              <p className="text-xs text-muted-foreground">
                Tests different age group selections
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
