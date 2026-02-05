/**
 * SIGNAL DISPLAY COMPONENTS
 * 
 * Minimal, clear visualization.
 * Never headlines. Never quotes. Never words.
 * Only: sparklines, histograms, heatmaps, deviation bars.
 */

import { SIGNAL_GUARDRAILS, SIGNAL_DISPLAY_RULES } from '@/core/signals';
import type { NormalizedSignal, SignalDetection } from '@/core/signals';

// ============================================
// SIGNAL SPARKLINE
// ============================================

interface SignalSparklineProps {
  data: Array<{ timestamp: string; value: number }>;
  baseline: number;
  width?: number;
  height?: number;
}

export function SignalSparkline({ 
  data, 
  baseline, 
  width = 120, 
  height = 32 
}: SignalSparklineProps) {
  if (data.length === 0) return null;
  
  const max = Math.max(...data.map(d => d.value), baseline * 1.5);
  const min = Math.min(...data.map(d => d.value), 0);
  const range = max - min || 1;
  
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((d.value - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');
  
  const baselineY = height - ((baseline - min) / range) * height;
  
  return (
    <svg width={width} height={height} className="overflow-visible">
      {/* Baseline */}
      <line 
        x1={0} 
        y1={baselineY} 
        x2={width} 
        y2={baselineY} 
        stroke="currentColor" 
        strokeOpacity={0.2}
        strokeDasharray="2,2"
      />
      {/* Signal line */}
      <polyline 
        points={points} 
        fill="none" 
        stroke="currentColor" 
        strokeWidth={1.5}
      />
    </svg>
  );
}

// ============================================
// DEVIATION BAR
// ============================================

interface DeviationBarProps {
  zscore: number;
  maxZscore?: number;
}

export function DeviationBar({ zscore, maxZscore = 5 }: DeviationBarProps) {
  const clampedZscore = Math.max(-maxZscore, Math.min(maxZscore, zscore));
  const percentage = ((clampedZscore + maxZscore) / (2 * maxZscore)) * 100;
  const isPositive = zscore > 0;
  
  return (
    <div className="relative h-2 bg-muted rounded-full overflow-hidden">
      {/* Center marker */}
      <div className="absolute left-1/2 w-px h-full bg-foreground/30" />
      
      {/* Deviation bar */}
      <div 
        className={`absolute h-full ${isPositive ? 'bg-amber-500/60' : 'bg-blue-500/60'}`}
        style={{
          left: isPositive ? '50%' : `${percentage}%`,
          width: `${Math.abs(percentage - 50)}%`,
        }}
      />
    </div>
  );
}

// ============================================
// SIGNAL SUMMARY
// ============================================

interface SignalSummaryProps {
  signal: NormalizedSignal;
  detection?: SignalDetection;
}

export function SignalSummary({ signal, detection }: SignalSummaryProps) {
  const deviationPercent = ((signal.count - signal.baseline_mean) / signal.baseline_mean * 100).toFixed(0);
  const direction = signal.deviation_score > 0 ? '↑' : signal.deviation_score < 0 ? '↓' : '—';
  
  return (
    <div className="space-y-2 p-3 bg-muted/30 rounded border border-border">
      {/* Quantitative summary only */}
      <div className="font-mono text-sm">
        <span className="text-muted-foreground">[SIG]</span>{' '}
        <span className="font-medium">
          Signal frequency {direction} {Math.abs(Number(deviationPercent))}% vs baseline
        </span>
      </div>
      
      {/* Deviation bar */}
      <DeviationBar zscore={signal.deviation_score} />
      
      {/* Detection info */}
      {detection && (
        <div className="font-mono text-xs text-muted-foreground">
          <span>[{detection.detection_type.toUpperCase()}]</span>{' '}
          <span>z={detection.zscore.toFixed(2)}</span>{' '}
          <span>persistence={detection.persistence_hours.toFixed(0)}h</span>
        </div>
      )}
      
      {/* Required disclaimer */}
      <div className="text-xs text-muted-foreground italic">
        {SIGNAL_GUARDRAILS.required_disclaimers[0]}
      </div>
    </div>
  );
}

// ============================================
// SIGNAL CONTEXT PANEL
// ============================================

interface SignalContextPanelProps {
  signals: NormalizedSignal[];
  indexId: string;
}

export function SignalContextPanel({ signals, indexId }: SignalContextPanelProps) {
  const relevantSignals = signals.filter(s => s.is_valid);
  
  if (relevantSignals.length === 0) {
    return (
      <div className="p-3 bg-muted/30 rounded border border-border">
        <div className="font-mono text-xs text-muted-foreground">
          [SIGNALS] No active signals for this index
        </div>
      </div>
    );
  }
  
  const avgDeviation = relevantSignals.reduce((sum, s) => sum + s.deviation_score, 0) / relevantSignals.length;
  
  return (
    <div className="space-y-3">
      <div className="font-mono text-xs text-muted-foreground tracking-wide">
        SIGNAL CONTEXT
      </div>
      
      <div className="grid gap-2">
        {relevantSignals.slice(0, 3).map((signal, i) => (
          <SignalSummary key={signal.signal_id || i} signal={signal} />
        ))}
      </div>
      
      {relevantSignals.length > 3 && (
        <div className="font-mono text-xs text-muted-foreground">
          +{relevantSignals.length - 3} more signals
        </div>
      )}
      
      {/* Aggregate stats */}
      <div className="p-2 bg-muted/20 rounded text-xs font-mono">
        <span className="text-muted-foreground">[AGG]</span>{' '}
        Avg deviation: {avgDeviation.toFixed(2)}σ
      </div>
    </div>
  );
}
