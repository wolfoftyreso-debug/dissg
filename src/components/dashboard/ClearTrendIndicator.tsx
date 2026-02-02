import { TrendingUp, TrendingDown, Minus, ArrowRight } from 'lucide-react';
import { TrendDirection } from '@/types/kpi';
import { cn } from '@/lib/utils';

interface ClearTrendIndicatorProps {
  direction: TrendDirection;
  changeValue: number; // The actual change (e.g., 0.2, not 0.2%)
  changeUnit: string; // e.g., "år", "procentenheter", "dagar"
  comparisonPeriod: string; // e.g., "förra året", "samma period förra året"
  inverted?: boolean;
  className?: string;
}

/**
 * A crystal-clear trend indicator that always explains:
 * 1. What changed
 * 2. Compared to what
 * 3. In plain language
 */
export function ClearTrendIndicator({
  direction,
  changeValue,
  changeUnit,
  comparisonPeriod,
  inverted = false,
  className,
}: ClearTrendIndicatorProps) {
  // For inverted KPIs, down is good (e.g., crime rates, death rates)
  const isPositive = inverted
    ? direction === 'down'
    : direction === 'up';
  
  const isNegative = inverted
    ? direction === 'up'
    : direction === 'down';

  const Icon = direction === 'up' 
    ? TrendingUp 
    : direction === 'down' 
      ? TrendingDown 
      : Minus;

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
    <div className={cn('rounded-md p-2.5 space-y-1', bgClass, className)}>
      {/* Main change statement */}
      <div className="flex items-start gap-2">
        <ArrowIcon />
        <div className="flex-1 min-w-0">
          <p className={cn('text-sm font-medium', colorClass)}>
            {directionText} med {Math.abs(changeValue).toLocaleString('sv-SE')} {changeUnit}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Jämfört med {comparisonPeriod}
          </p>
        </div>
      </div>
    </div>
  );
}
