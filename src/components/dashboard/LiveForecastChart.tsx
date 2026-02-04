import { useMemo } from 'react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Area, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip,
  ReferenceLine 
} from 'recharts';
import { LiveDataPoint } from '@/hooks/useLiveForecast';
import { cn } from '@/lib/utils';

interface LiveForecastChartProps {
  data: LiveDataPoint[];
  unit: string;
  isLoading?: boolean;
  showConfidenceInterval?: boolean;
  height?: number;
}

export function LiveForecastChart({ 
  data, 
  unit, 
  isLoading = false,
  showConfidenceInterval = true,
  height = 160
}: LiveForecastChartProps) {
  
  // Transform data for chart with month labels
  const chartData = useMemo(() => {
    return data.map((point) => ({
      ...point,
      label: point.month === 0 ? 'Nu' : `${point.month}m`,
    }));
  }, [data]);

  // Calculate domain for Y axis
  const yDomain = useMemo(() => {
    if (data.length === 0) return [0, 100];
    
    const allValues = data.flatMap(d => [
      d.lower_bound, 
      d.upper_bound, 
      d.optimistic, 
      d.pessimistic
    ]);
    const min = Math.floor(Math.min(...allValues) * 0.95);
    const max = Math.ceil(Math.max(...allValues) * 1.05);
    
    return [min, max];
  }, [data]);

  if (data.length === 0) {
    return (
      <div 
        className={cn(
          "flex items-center justify-center rounded-sm border border-dashed border-border bg-muted/20",
          isLoading && "animate-pulse"
        )}
        style={{ height }}
      >
        <p className="text-xs font-mono text-muted-foreground">
          {isLoading ? '[LADDAR DATA...]' : '[INGEN DATA]'}
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-mono text-muted-foreground">[UPPDATERAR...]</span>
          </div>
        </div>
      )}
      
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart data={chartData} margin={{ top: 10, right: 10, bottom: 5, left: 0 }}>
          <defs>
            <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.15} />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="pessimisticGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--status-critical))" stopOpacity={0.1} />
              <stop offset="100%" stopColor="hsl(var(--status-critical))" stopOpacity={0} />
            </linearGradient>
          </defs>
          
          <XAxis 
            dataKey="label" 
            tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
            axisLine={{ stroke: 'hsl(var(--border))' }}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis 
            domain={yDomain}
            tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
            axisLine={false}
            tickLine={false}
            width={40}
            tickFormatter={(value) => value.toLocaleString('sv-SE')}
          />
          
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '4px',
              fontSize: '11px',
              fontFamily: 'monospace',
            }}
            formatter={(value: number, name: string) => {
              const labels: Record<string, string> = {
                baseline: 'Basscenario',
                optimistic: 'Optimistiskt',
                pessimistic: 'Pessimistiskt',
                upper_bound: 'Övre gräns',
                lower_bound: 'Undre gräns',
              };
              return [`${value.toLocaleString('sv-SE')} ${unit}`, labels[name] || name];
            }}
          />

          {/* Confidence interval band */}
          {showConfidenceInterval && (
            <Area
              type="monotone"
              dataKey="upper_bound"
              stroke="none"
              fill="url(#confidenceGradient)"
              fillOpacity={1}
              animationDuration={800}
              isAnimationActive={true}
            />
          )}

          {/* Reference line at current time */}
          <ReferenceLine 
            x="Nu" 
            stroke="hsl(var(--border))" 
            strokeDasharray="3 3"
            label={{ 
              value: 'Idag', 
              position: 'top',
              fontSize: 9,
              fill: 'hsl(var(--muted-foreground))'
            }}
          />

          {/* Pessimistic scenario */}
          <Line
            type="monotone"
            dataKey="pessimistic"
            stroke="hsl(var(--status-critical))"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            dot={false}
            animationDuration={1200}
            isAnimationActive={true}
          />

          {/* Optimistic scenario */}
          <Line
            type="monotone"
            dataKey="optimistic"
            stroke="hsl(var(--status-positive))"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            dot={false}
            animationDuration={1000}
            isAnimationActive={true}
          />

          {/* Baseline (main forecast) - rendered last to be on top */}
          <Line
            type="monotone"
            dataKey="baseline"
            stroke="hsl(var(--primary))"
            strokeWidth={2.5}
            dot={{ 
              r: 3, 
              fill: 'hsl(var(--primary))',
              strokeWidth: 0
            }}
            activeDot={{ 
              r: 5, 
              fill: 'hsl(var(--primary))',
              stroke: 'hsl(var(--background))',
              strokeWidth: 2
            }}
            animationDuration={1500}
            isAnimationActive={true}
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="mt-2 flex items-center justify-center gap-4 text-[10px] font-mono">
        <div className="flex items-center gap-1.5">
          <div className="h-0.5 w-4 rounded bg-primary" />
          <span className="text-muted-foreground">Basscenario</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-0.5 w-4 rounded bg-status-positive opacity-70" style={{ 
            backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 2px, hsl(var(--status-positive)) 2px, hsl(var(--status-positive)) 4px)' 
          }} />
          <span className="text-muted-foreground">Optimistiskt</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-0.5 w-4 rounded bg-status-critical opacity-70" style={{ 
            backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 2px, hsl(var(--status-critical)) 2px, hsl(var(--status-critical)) 4px)' 
          }} />
          <span className="text-muted-foreground">Pessimistiskt</span>
        </div>
      </div>
    </div>
  );
}
