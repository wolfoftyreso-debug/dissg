/**
 * Mobile Metric Display
 * Large, touch-friendly metric display for mobile
 * Single column, clear hierarchy
 */

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileMetricDisplayProps {
  /** Primary value */
  value: string | number;
  /** Unit of measurement */
  unit?: string;
  /** Label describing the metric */
  label: string;
  /** Trend direction */
  trend?: 'up' | 'down' | 'stable';
  /** Trend percentage */
  trendPercent?: number;
  /** Trend period description */
  trendPeriod?: string;
  /** Context comparison */
  context?: string;
  /** Uncertainty indicator */
  uncertainty?: 'low' | 'medium' | 'high';
  /** Warning message */
  warning?: string;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function MobileMetricDisplay({
  value,
  unit,
  label,
  trend,
  trendPercent,
  trendPeriod,
  context,
  uncertainty,
  warning,
  size = 'md',
  className,
}: MobileMetricDisplayProps) {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-4xl',
  };

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  
  const uncertaintyColors = {
    low: 'text-green-600 dark:text-green-400',
    medium: 'text-orange-600 dark:text-orange-400',
    high: 'text-red-600 dark:text-red-400',
  };

  return (
    <div className={cn('text-center py-4', className)}>
      {/* Label */}
      <p className="text-sm text-muted-foreground mb-2">{label}</p>
      
      {/* Primary Value */}
      <div className="flex items-baseline justify-center gap-2 mb-2">
        <span className={cn('font-bold tabular-nums', sizeClasses[size])}>
          {value}
        </span>
        {unit && (
          <span className="text-lg text-muted-foreground">{unit}</span>
        )}
      </div>

      {/* Trend */}
      {trend && (
        <div className="flex items-center justify-center gap-2 text-sm mb-2">
          <TrendIcon className="h-4 w-4 text-blue-500" />
          {trendPercent !== undefined && (
            <span className="text-muted-foreground">
              {trend === 'up' ? '+' : trend === 'down' ? '-' : ''}
              {Math.abs(trendPercent)}%
            </span>
          )}
          {trendPeriod && (
            <span className="text-muted-foreground">({trendPeriod})</span>
          )}
        </div>
      )}

      {/* Context */}
      {context && (
        <p className="text-xs text-muted-foreground mb-2">{context}</p>
      )}

      {/* Uncertainty Badge */}
      {uncertainty && uncertainty !== 'low' && (
        <Badge 
          variant="outline" 
          className={cn('text-xs', uncertaintyColors[uncertainty])}
        >
          {uncertainty === 'medium' ? 'Måttlig osäkerhet' : 'Hög osäkerhet'}
        </Badge>
      )}

      {/* Warning */}
      {warning && (
        <div className="flex items-center justify-center gap-1 text-xs text-orange-600 dark:text-orange-400 mt-2">
          <AlertTriangle className="h-3 w-3" />
          <span>{warning}</span>
        </div>
      )}
    </div>
  );
}

/**
 * Compact metric for use in lists
 */
interface CompactMetricProps {
  value: string | number;
  unit?: string;
  label: string;
  trend?: 'up' | 'down' | 'stable';
  onClick?: () => void;
}

export function CompactMetric({ value, unit, label, trend, onClick }: CompactMetricProps) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  
  const Wrapper = onClick ? 'button' : 'div';
  
  return (
    <Wrapper 
      onClick={onClick}
      className={cn(
        'flex items-center justify-between py-3 w-full text-left',
        onClick && 'min-h-[44px] hover:bg-muted/50 rounded-lg px-2 -mx-2 transition-colors'
      )}
    >
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <span className="font-semibold tabular-nums">
          {value}
          {unit && <span className="text-xs text-muted-foreground ml-1">{unit}</span>}
        </span>
        {trend && <TrendIcon className="h-4 w-4 text-blue-500" />}
      </div>
    </Wrapper>
  );
}
