/**
 * CURRENT STATE
 * 
 * Always two things side by side:
 * A. Baseline (historical normal range)
 * B. Current (current level, clearly marked)
 * 
 * No dramatic colors. No annotations suggesting action.
 */

interface CurrentStateProps {
  baseline: {
    label: string;
    min: number;
    max: number;
    unit: string;
  };
  current: {
    value: number;
    asOf: string;
  };
  direction: 'increasing' | 'decreasing' | 'stable' | 'mixed';
  magnitude: 'low' | 'medium' | 'high' | 'extreme';
}

function getDirectionMarker(direction: CurrentStateProps['direction']): string {
  switch (direction) {
    case 'increasing': return '[↑]';
    case 'decreasing': return '[↓]';
    case 'stable': return '[—]';
    case 'mixed': return '[~]';
  }
}

function getPositionPercent(value: number, min: number, max: number): number {
  const range = max - min;
  if (range === 0) return 50;
  const position = ((value - min) / range) * 100;
  return Math.max(0, Math.min(100, position));
}

export function CurrentState({ baseline, current, direction, magnitude }: CurrentStateProps) {
  const position = getPositionPercent(current.value, baseline.min, baseline.max);
  const isOutsideRange = current.value < baseline.min || current.value > baseline.max;
  
  return (
    <section className="space-y-3">
      <h2 className="font-mono text-xs text-muted-foreground tracking-wide">
        CURRENT STATE {getDirectionMarker(direction)} {magnitude.toUpperCase()}
      </h2>
      
      <div className="grid gap-4 md:grid-cols-2">
        {/* Baseline */}
        <div className="p-3 bg-muted/30 rounded border border-border">
          <div className="font-mono text-xs text-muted-foreground mb-2">
            [BASELINE] {baseline.label}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-medium">
              {baseline.min}–{baseline.max}
            </span>
            <span className="text-sm text-muted-foreground">
              {baseline.unit}
            </span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Historical normal range
          </div>
        </div>
        
        {/* Current */}
        <div className={`p-3 rounded border ${
          isOutsideRange 
            ? 'bg-amber-500/10 border-amber-500/30' 
            : 'bg-muted/30 border-border'
        }`}>
          <div className="font-mono text-xs text-muted-foreground mb-2">
            [CURRENT] As of {current.asOf}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-medium">
              {current.value}
            </span>
            <span className="text-sm text-muted-foreground">
              {baseline.unit}
            </span>
          </div>
          {isOutsideRange && (
            <div className="text-xs text-amber-600 dark:text-amber-400 mt-1">
              Outside historical range
            </div>
          )}
        </div>
      </div>
      
      {/* Visual range indicator */}
      <div className="relative h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className="absolute h-full bg-muted-foreground/20"
          style={{ left: '10%', right: '10%' }}
        />
        <div 
          className={`absolute w-2 h-2 rounded-full top-0 ${
            isOutsideRange ? 'bg-amber-500' : 'bg-foreground'
          }`}
          style={{ left: `calc(${position}% - 4px)` }}
        />
      </div>
    </section>
  );
}
