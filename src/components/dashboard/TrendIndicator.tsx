import { TrendDirection } from '@/types/kpi';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrendIndicatorProps {
  direction: TrendDirection;
  percent: number;
  inverted?: boolean; // For metrics where down is good (e.g., crime, inflation)
  className?: string;
}

export function TrendIndicator({ direction, percent, inverted = false, className }: TrendIndicatorProps) {
  const isPositiveChange = inverted 
    ? direction === 'down' 
    : direction === 'up';
  
  const isNegativeChange = inverted 
    ? direction === 'up' 
    : direction === 'down';

  return (
    <div
      className={cn(
        'flex items-center gap-1 font-mono text-sm',
        {
          'text-trend-up': isPositiveChange,
          'text-trend-down': isNegativeChange,
          'text-trend-stable': direction === 'stable',
        },
        className
      )}
    >
      {direction === 'up' && <ArrowUp className="h-3 w-3" />}
      {direction === 'down' && <ArrowDown className="h-3 w-3" />}
      {direction === 'stable' && <Minus className="h-3 w-3" />}
      <span>{percent > 0 ? '+' : ''}{percent.toFixed(1)}%</span>
    </div>
  );
}
