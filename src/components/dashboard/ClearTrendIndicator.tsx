import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { TrendDirection } from '@/types/kpi';
import { cn } from '@/lib/utils';

interface ClearTrendIndicatorProps {
  direction: TrendDirection;
  changeValue: number; // The actual change (e.g., 0.2, not 0.2%)
  changeUnit: string; // e.g., "år", "procentenheter", "dagar"
  comparisonPeriod: string; // e.g., "förra året", "samma period förra året"
  inverted?: boolean;
  clarification?: string; // Extra explanation for complex metrics
  className?: string;
}

/**
 * A crystal-clear trend indicator that always explains:
 * 1. What changed
 * 2. Compared to what
 * 3. In plain language
 * 4. Optional clarification for complex metrics (like baseline deviations)
 */
export function ClearTrendIndicator({
  direction,
  changeValue,
  changeUnit,
  comparisonPeriod,
  inverted = false,
  clarification,
  className,
}: ClearTrendIndicatorProps) {
  // For inverted KPIs, down is good (e.g., crime rates, death rates)
  const isPositive = inverted
    ? direction === 'down'
    : direction === 'up';
  
  const isNegative = inverted
    ? direction === 'up'
    : direction === 'down';

  const colorClass = isPositive
    ? 'text-status-positive'
    : isNegative
      ? 'text-status-critical'
      : 'text-muted-foreground';

  const bgClass = isPositive
    ? 'bg-status-positive/10'
    : isNegative
      ? 'bg-status-critical/10'
      : 'bg-muted/50';

  // Direction text
  const directionText = direction === 'up'
    ? 'Har ökat'
    : direction === 'down'
      ? 'Har minskat'
      : 'Oförändrad';

  // Arrow icon for direction
  const ArrowIcon = direction === 'up'
    ? () => <span className="text-lg">🔺</span>
    : direction === 'down'
      ? () => <span className="text-lg">🔻</span>
      : () => <span className="text-lg">➡️</span>;

  if (direction === 'stable') {
    return (
      <div className={cn('rounded-md p-2.5', bgClass, className)}>
        <div className="flex items-center gap-2">
          <ArrowIcon />
          <span className={cn('text-sm font-medium', colorClass)}>
            Oförändrad senaste perioden
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('rounded-md p-2.5 space-y-1.5', bgClass, className)}>
      {/* Main change statement */}
      <div className="flex items-start gap-2">
        <ArrowIcon />
        <div className="flex-1 min-w-0">
          <p className={cn('text-sm font-medium', colorClass)}>
            {directionText} med {Math.abs(changeValue).toLocaleString('sv-SE', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} {changeUnit}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Jämfört med {comparisonPeriod}
          </p>
        </div>
      </div>
      
      {/* Clarification for complex metrics (e.g., baseline deviations) */}
      {clarification && (
        <div className="flex items-start gap-1.5 pl-7">
          <span className="text-xs">ℹ️</span>
          <p className="text-xs text-muted-foreground italic">
            {clarification}
          </p>
        </div>
      )}
    </div>
  );
}
