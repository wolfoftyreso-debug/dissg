/**
 * MINI SPARKLINE COMPONENT
 * 
 * Replaces abstract trend icons with actual data visualizations.
 * Shows the real trajectory of a metric over time.
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface MiniSparklineProps {
  data: number[];
  width?: number;
  height?: number;
  className?: string;
  showTrend?: boolean;
  trendLabel?: string;
}

export function MiniSparkline({ 
  data, 
  width = 60, 
  height = 20, 
  className,
  showTrend = true,
  trendLabel
}: MiniSparklineProps) {
  if (!data || data.length < 2) return null;
  
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  
  // Normalize data to fit in the height
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  });
  
  const pathD = `M ${points.join(' L ')}`;
  
  // Calculate trend
  const firstHalf = data.slice(0, Math.floor(data.length / 2));
  const secondHalf = data.slice(Math.floor(data.length / 2));
  const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
  const trend = secondAvg > firstAvg ? 'up' : secondAvg < firstAvg ? 'down' : 'stable';
  
  const trendColor = trend === 'up' ? 'text-primary' : trend === 'down' ? 'text-destructive' : 'text-muted-foreground';
  const strokeColor = trend === 'up' ? 'hsl(var(--primary))' : trend === 'down' ? 'hsl(var(--destructive))' : 'hsl(var(--muted-foreground))';
  
  // Calculate percentage change
  const firstValue = data[0];
  const lastValue = data[data.length - 1];
  const percentChange = firstValue !== 0 ? ((lastValue - firstValue) / Math.abs(firstValue)) * 100 : 0;
  
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg width={width} height={height} className="overflow-visible">
        <path
          d={pathD}
          fill="none"
          stroke={strokeColor}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* End point dot */}
        <circle
          cx={width}
          cy={height - ((lastValue - min) / range) * height}
          r={2}
          fill={strokeColor}
        />
      </svg>
      
      {showTrend && (
        <span className={cn("text-xs font-medium", trendColor)}>
          {percentChange >= 0 ? '+' : ''}{percentChange.toFixed(1)}%
          {trendLabel && <span className="text-muted-foreground ml-1">{trendLabel}</span>}
        </span>
      )}
    </div>
  );
}

/**
 * DESCRIPTIVE TREND INDICATOR
 * 
 * Replaces icons like TrendingUp/TrendingDown with clear textual descriptions
 */
interface DescriptiveTrendProps {
  value: number;
  unit?: string;
  change: number;
  period: string;
  className?: string;
}

export function DescriptiveTrend({ value, unit = '', change, period, className }: DescriptiveTrendProps) {
  const isPositive = change > 0;
  const isNegative = change < 0;
  const isStable = change === 0;
  
  return (
    <div className={cn("space-y-1", className)}>
      <div className="text-2xl font-bold">
        {value}{unit}
      </div>
      <div className={cn(
        "text-xs",
        isPositive && "text-primary",
        isNegative && "text-destructive",
        isStable && "text-muted-foreground"
      )}>
        {isPositive && '↑ '}
        {isNegative && '↓ '}
        {isStable && '→ '}
        {Math.abs(change)}% {period}
      </div>
    </div>
  );
}

/**
 * METRIC CARD WITH DESCRIPTION
 * 
 * A self-explanatory metric display that doesn't rely on icons
 */
interface DescriptiveMetricCardProps {
  title: string;
  description: string;
  value: number | string;
  unit?: string;
  change?: number;
  changePeriod?: string;
  sparklineData?: number[];
  whatThisShows?: string;
  whatThisDoesNotShow?: string;
  className?: string;
}

export function DescriptiveMetricCard({
  title,
  description,
  value,
  unit = '',
  change,
  changePeriod = 'sedan förra året',
  sparklineData,
  whatThisShows,
  whatThisDoesNotShow,
  className
}: DescriptiveMetricCardProps) {
  const [showDetails, setShowDetails] = React.useState(false);
  
  return (
    <div 
      className={cn(
        "p-4 rounded-lg border bg-card transition-all cursor-pointer hover:border-primary/50",
        className
      )}
      onClick={() => setShowDetails(!showDetails)}
    >
      {/* Title */}
      <h4 className="font-medium text-sm mb-1">{title}</h4>
      <p className="text-xs text-muted-foreground mb-3">{description}</p>
      
      {/* Value and trend */}
      <div className="flex items-end justify-between">
        <div>
          <span className="text-2xl font-bold">{value}</span>
          {unit && <span className="text-sm text-muted-foreground ml-1">{unit}</span>}
        </div>
        
        {sparklineData && sparklineData.length > 1 && (
          <MiniSparkline data={sparklineData} />
        )}
      </div>
      
      {/* Change indicator */}
      {change !== undefined && (
        <div className={cn(
          "text-xs mt-2",
          change > 0 && "text-primary",
          change < 0 && "text-destructive",
          change === 0 && "text-muted-foreground"
        )}>
          {change > 0 && '↑ Ökat med '}
          {change < 0 && '↓ Minskat med '}
          {change === 0 && '→ Oförändrat '}
          {change !== 0 && `${Math.abs(change)}% `}
          {changePeriod}
        </div>
      )}
      
      {/* Expandable details */}
      {showDetails && (whatThisShows || whatThisDoesNotShow) && (
        <div className="mt-4 pt-4 border-t space-y-3 text-xs">
          {whatThisShows && (
            <div>
              <p className="font-medium text-primary mb-1">Detta visar:</p>
              <p className="text-muted-foreground">{whatThisShows}</p>
            </div>
          )}
          {whatThisDoesNotShow && (
            <div>
              <p className="font-medium text-destructive mb-1">Detta visar INTE:</p>
              <p className="text-muted-foreground">{whatThisDoesNotShow}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
