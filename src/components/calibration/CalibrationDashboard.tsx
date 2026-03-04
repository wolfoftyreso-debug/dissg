/**
 * CALIBRATION / BRIER SCORE DASHBOARD
 * 
 * Visualizes prediction calibration and Brier scores.
 */

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

// =============================================================================
// DEMO DATA
// =============================================================================

interface PredictionEntry {
  id: string;
  code: string;
  description: string;
  predictedProbability: number;
  actualOutcome: boolean | null;
  brierScore: number | null;
  predictedAt: string;
  resolvedAt: string | null;
  modelVersion: string;
}

interface CalibrationBucket {
  binStart: number;
  binEnd: number;
  avgPredicted: number;
  avgActual: number;
  count: number;
}

const DEMO_PREDICTIONS: PredictionEntry[] = [
  { id: '1', code: 'PRED-INE-2024-001', description: 'Gini-koefficient >0.35 inom 12 mån', predictedProbability: 0.72, actualOutcome: true, brierScore: 0.0784, predictedAt: '2023-12-01', resolvedAt: '2024-11-15', modelVersion: 'v2.1' },
  { id: '2', code: 'PRED-DEM-2024-002', description: 'Demokratiindex under 5.0 globalt', predictedProbability: 0.35, actualOutcome: false, brierScore: 0.1225, predictedAt: '2024-01-15', resolvedAt: '2024-12-01', modelVersion: 'v2.1' },
  { id: '3', code: 'PRED-HEA-2024-003', description: 'Opioidmortalitet >10/100k i 3+ länder', predictedProbability: 0.58, actualOutcome: true, brierScore: 0.1764, predictedAt: '2024-02-01', resolvedAt: '2024-10-01', modelVersion: 'v2.1' },
  { id: '4', code: 'PRED-CLI-2025-001', description: 'Global temp anomaly >1.5°C (årsbasis)', predictedProbability: 0.85, actualOutcome: null, brierScore: null, predictedAt: '2025-01-01', resolvedAt: null, modelVersion: 'v2.2' },
  { id: '5', code: 'PRED-FER-2025-002', description: 'TFR <1.3 i 3+ OECD-länder', predictedProbability: 0.62, actualOutcome: null, brierScore: null, predictedAt: '2025-02-01', resolvedAt: null, modelVersion: 'v2.2' },
];

const DEMO_CALIBRATION_BUCKETS: CalibrationBucket[] = [
  { binStart: 0.0, binEnd: 0.1, avgPredicted: 0.05, avgActual: 0.03, count: 12 },
  { binStart: 0.1, binEnd: 0.2, avgPredicted: 0.15, avgActual: 0.12, count: 18 },
  { binStart: 0.2, binEnd: 0.3, avgPredicted: 0.25, avgActual: 0.28, count: 22 },
  { binStart: 0.3, binEnd: 0.4, avgPredicted: 0.35, avgActual: 0.31, count: 15 },
  { binStart: 0.4, binEnd: 0.5, avgPredicted: 0.45, avgActual: 0.42, count: 20 },
  { binStart: 0.5, binEnd: 0.6, avgPredicted: 0.55, avgActual: 0.58, count: 25 },
  { binStart: 0.6, binEnd: 0.7, avgPredicted: 0.65, avgActual: 0.60, count: 19 },
  { binStart: 0.7, binEnd: 0.8, avgPredicted: 0.75, avgActual: 0.72, count: 16 },
  { binStart: 0.8, binEnd: 0.9, avgPredicted: 0.85, avgActual: 0.88, count: 10 },
  { binStart: 0.9, binEnd: 1.0, avgPredicted: 0.95, avgActual: 0.92, count: 8 },
];

// =============================================================================
// COMPONENT
// =============================================================================

export function CalibrationDashboard() {
  const resolved = DEMO_PREDICTIONS.filter(p => p.actualOutcome !== null);
  const pending = DEMO_PREDICTIONS.filter(p => p.actualOutcome === null);
  const meanBrier = resolved.length > 0
    ? resolved.reduce((s, p) => s + (p.brierScore ?? 0), 0) / resolved.length
    : 0;

  return (
    <ScrollArea className="h-full">
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-mono text-xs tracking-widest text-muted-foreground mb-1">
            KALIBRERING & BRIER-SCORES
          </h1>
          <p className="text-sm text-muted-foreground">
            Epistemisk kalibrering — hur väl matchar systemets prediktioner verkligheten?
          </p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard label="MEDEL BRIER" value={meanBrier.toFixed(4)} interpretation={meanBrier < 0.15 ? 'Bra' : meanBrier < 0.25 ? 'Acceptabel' : 'Behöver kalibrering'} />
          <MetricCard label="LÖSTA PREDIKTIONER" value={resolved.length.toString()} interpretation={`av ${DEMO_PREDICTIONS.length} totalt`} />
          <MetricCard label="PÅGÅENDE" value={pending.length.toString()} interpretation="Ej avgjorda" />
          <MetricCard label="MODELLVERSION" value="v2.2" interpretation="Senaste" />
        </div>

        {/* Calibration Chart (text-based) */}
        <div className="border border-border rounded-lg bg-card p-5">
          <div className="font-mono text-[10px] tracking-widest text-muted-foreground mb-4">
            KALIBRERINGSDIAGRAM (PREDIKTERAD vs FAKTISK)
          </div>
          <div className="space-y-2">
            {DEMO_CALIBRATION_BUCKETS.map((bucket) => {
              const deviation = Math.abs(bucket.avgPredicted - bucket.avgActual);
              const isWellCalibrated = deviation < 0.05;
              return (
                <div key={bucket.binStart} className="flex items-center gap-3 text-xs">
                  <span className="font-mono w-16 text-right text-muted-foreground">
                    {(bucket.binStart * 100).toFixed(0)}–{(bucket.binEnd * 100).toFixed(0)}%
                  </span>
                  <div className="flex-1 flex items-center gap-2">
                    <div className="flex-1 bg-muted/30 rounded-full h-4 relative overflow-hidden">
                      {/* Predicted */}
                      <div
                        className="absolute top-0 h-full bg-primary/30 rounded-full"
                        style={{ width: `${bucket.avgPredicted * 100}%` }}
                      />
                      {/* Actual */}
                      <div
                        className="absolute top-0 h-full bg-green-500/60 rounded-full"
                        style={{ width: `${bucket.avgActual * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="font-mono w-12 text-right">{(bucket.avgActual * 100).toFixed(0)}%</span>
                  <span className={`font-mono w-8 text-right ${isWellCalibrated ? 'text-green-600' : 'text-orange-500'}`}>
                    {isWellCalibrated ? '✓' : '△'}
                  </span>
                  <span className="font-mono w-8 text-muted-foreground text-right">n={bucket.count}</span>
                </div>
              );
            })}
          </div>
          <div className="flex gap-6 mt-3 text-[10px] text-muted-foreground font-mono">
            <span>■ Predikterad (blå)</span>
            <span>■ Faktisk (grön)</span>
            <span>✓ Inom ±5%</span>
            <span>△ Avvikelse &gt;5%</span>
          </div>
        </div>

        {/* Prediction log */}
        <div className="border border-border rounded-lg bg-card">
          <div className="p-4 border-b border-border">
            <div className="font-mono text-[10px] tracking-widest text-muted-foreground">
              PREDIKTIONSLOGG
            </div>
          </div>
          <div className="divide-y divide-border">
            {DEMO_PREDICTIONS.map((pred) => (
              <div key={pred.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold">{pred.code}</span>
                      {pred.actualOutcome === null ? (
                        <Badge className="font-mono text-[10px] bg-muted text-muted-foreground">PÅGÅENDE</Badge>
                      ) : pred.actualOutcome ? (
                        <Badge className="font-mono text-[10px] bg-green-500/10 text-green-600">INTRÄFFADE</Badge>
                      ) : (
                        <Badge className="font-mono text-[10px] bg-orange-500/10 text-orange-600">INTRÄFFADE EJ</Badge>
                      )}
                    </div>
                    <div className="text-sm">{pred.description}</div>
                    <div className="text-[10px] text-muted-foreground font-mono mt-1">
                      Predikterad: {pred.predictedAt} · Modell: {pred.modelVersion}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-mono text-lg font-bold">{(pred.predictedProbability * 100).toFixed(0)}%</div>
                    <div className="font-mono text-[10px] text-muted-foreground">PREDIKTERAD</div>
                    {pred.brierScore !== null && (
                      <div className="mt-1">
                        <div className="font-mono text-xs">Brier: {pred.brierScore.toFixed(4)}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground font-mono py-4">
          Brier score: 0 = perfekt, 1 = sämsta möjliga. Under 0.15 = bra kalibrering.
        </div>
      </div>
    </ScrollArea>
  );
}

function MetricCard({ label, value, interpretation }: { label: string; value: string; interpretation: string }) {
  return (
    <div className="border border-border rounded-lg bg-card p-4">
      <div className="font-mono text-[10px] tracking-widest text-muted-foreground mb-1">{label}</div>
      <div className="font-mono text-2xl font-bold">{value}</div>
      <div className="text-[10px] text-muted-foreground mt-0.5">{interpretation}</div>
    </div>
  );
}

export default CalibrationDashboard;
