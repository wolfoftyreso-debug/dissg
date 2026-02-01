import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { TrendDirection } from '@/types/kpi';
import { cn } from '@/lib/utils';

interface TrendIndicatorProps {
  direction: TrendDirection;
  percent: number;
  inverted?: boolean;
  compact?: boolean;
  className?: string;
}

export function TrendIndicator({ direction, percent, inverted = false, compact = false, className }: TrendIndicatorProps) {
  // For inverted KPIs, down is good (e.g., crime rates)
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

  if (compact) {
    return (
      <div className={cn('flex items-center gap-1', colorClass, className)}>
        <Icon className="h-3.5 w-3.5" />
        <span className="text-xs font-medium tabular-nums">
          {Math.abs(percent).toFixed(1)}%
        </span>
      </div>
    );
  }

  return (
    <div className={cn('flex items-center gap-1.5', colorClass, className)}>
      <Icon className="h-4 w-4" />
      <span className="text-sm font-medium tabular-nums">
        {direction === 'up' ? '+' : direction === 'down' ? '-' : ''}
        {Math.abs(percent).toFixed(1)}%
      </span>
      <span className="text-xs text-muted-foreground">
        {direction === 'stable' ? 'oförändrad' : 'vs föregående'}
      </span>
    </div>
  );
}
