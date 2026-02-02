/**
 * Simple KPI Timeline - Otroligt förståelig tidslinje
 * 
 * Visar trend över tid med:
 * - Tydlig graf utan onödig komplexitet
 * - Klartext: "Vad ser vi?"
 * - Trend-indikation i färg
 */

import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface DataPoint {
  date: string;
  value: number;
  label?: string;
}

interface SimpleKPITimelineProps {
  /** Data points for the timeline */
  data?: DataPoint[];
  /** Generate mock data if none provided */
  currentValue?: number;
  trendPercent?: number;
  trend?: 'up' | 'down' | 'stable';
  /** Time period label */
  periodLabel?: string;
  /** Chart height */
  height?: number;
  /** Status for coloring */
  status?: 'positive' | 'warning' | 'critical' | 'neutral';
  className?: string;
}

/**
 * Generate simple trend data based on current value and trend
 */
function generateTrendData(
  currentValue: number,
  trendPercent: number,
  points: number = 12
): DataPoint[] {
  const data: DataPoint[] = [];
  const startValue = currentValue / (1 + trendPercent / 100);
  const increment = (currentValue - startValue) / (points - 1);
  
  for (let i = 0; i < points; i++) {
    const date = new Date();
    date.setMonth(date.getMonth() - (points - 1 - i));
    
    // Add some natural variation
    const variation = (Math.random() - 0.5) * (Math.abs(increment) * 0.3);
    const value = startValue + (increment * i) + variation;
    
    data.push({
      date: date.toISOString().slice(0, 7),
      value: Math.max(0, value),
      label: date.toLocaleDateString('sv-SE', { month: 'short' }),
    });
  }
  
  // Ensure last point is current value
  if (data.length > 0) {
    data[data.length - 1].value = currentValue;
  }
  
  return data;
}

/**
 * SimpleKPITimeline
 * 
 * A clean, understandable timeline visualization.
 */
export function SimpleKPITimeline({
  data: providedData,
  currentValue = 100,
  trendPercent = 0,
  trend = 'stable',
  periodLabel = 'senaste 12 månader',
  height = 120,
  status = 'neutral',
  className,
}: SimpleKPITimelineProps) {
  // Use provided data or generate from current value
  const data = useMemo(() => {
    if (providedData && providedData.length > 0) {
      return providedData;
    }
    return generateTrendData(currentValue, trendPercent);
  }, [providedData, currentValue, trendPercent]);

  // Calculate SVG path
  const { path, areaPath, minValue, maxValue } = useMemo(() => {
    if (data.length < 2) {
      return { path: '', areaPath: '', minValue: 0, maxValue: 0 };
    }

    const values = data.map(d => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    
    const padding = { top: 10, bottom: 10, left: 10, right: 10 };
    const chartWidth = 100 - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    
    const points = data.map((d, i) => {
      const x = padding.left + (i / (data.length - 1)) * chartWidth;
      const y = padding.top + chartHeight - ((d.value - min) / range) * chartHeight;
      return { x, y };
    });

    const linePath = points
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
      .join(' ');
    
    // Area path (for fill)
    const area = linePath + 
      ` L ${points[points.length - 1].x} ${padding.top + chartHeight}` +
      ` L ${points[0].x} ${padding.top + chartHeight} Z`;

    return { 
      path: linePath, 
      areaPath: area,
      minValue: min, 
      maxValue: max 
    };
  }, [data, height]);

  // Determine stroke color based on status
  const strokeColor = useMemo(() => {
    switch (status) {
      case 'positive':
        return 'hsl(var(--status-positive))';
      case 'warning':
        return 'hsl(var(--status-warning))';
      case 'critical':
        return 'hsl(var(--status-critical))';
      default:
        return 'hsl(var(--primary))';
    }
  }, [status]);

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;

  if (data.length < 2) {
    return (
      <div className={cn(
        'flex items-center justify-center bg-muted/50 rounded-lg',
        className
      )} style={{ height }}>
        <span className="text-sm text-muted-foreground">Ingen tidsdata tillgänglig</span>
      </div>
    );
  }

  return (
    <div className={cn('relative', className)}>
      {/* SVG Timeline */}
      <svg 
        viewBox={`0 0 100 ${height}`} 
        className="w-full" 
        style={{ height }}
        preserveAspectRatio="none"
      >
        {/* Gradient fill */}
        <defs>
          <linearGradient id={`gradient-${status}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.2" />
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        
        {/* Area fill */}
        <path
          d={areaPath}
          fill={`url(#gradient-${status})`}
        />
        
        {/* Line */}
        <path
          d={path}
          fill="none"
          stroke={strokeColor}
          strokeWidth="0.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        
        {/* End dot */}
        {data.length > 0 && (
          <circle
            cx="90"
            cy={10 + (height - 20) - ((data[data.length - 1].value - minValue) / (maxValue - minValue || 1)) * (height - 20)}
            r="3"
            fill={strokeColor}
          />
        )}
      </svg>
      
      {/* Time labels */}
      <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
        <span>{data[0]?.label || ''}</span>
        <span>{data[data.length - 1]?.label || ''}</span>
      </div>
      
      {/* Trend summary */}
      <div className="flex items-center justify-between mt-3 text-sm">
        <span className="text-muted-foreground">Trend {periodLabel}</span>
        <span className={cn(
          'flex items-center gap-1 font-medium',
          trend === 'up' && status !== 'critical' && 'text-status-positive',
          trend === 'up' && status === 'critical' && 'text-status-critical',
          trend === 'down' && status !== 'positive' && 'text-status-critical',
          trend === 'down' && status === 'positive' && 'text-status-positive',
          trend === 'stable' && 'text-muted-foreground',
        )}>
          <TrendIcon className="h-4 w-4" />
          {trendPercent !== 0 
            ? `${trendPercent > 0 ? '+' : ''}${trendPercent.toFixed(1)}%`
            : 'Stabil'
          }
        </span>
      </div>
    </div>
  );
}

export default SimpleKPITimeline;
