import { KPI } from '@/types/kpi';
import { StatusBadge } from './StatusBadge';
import { TrendIndicator } from './TrendIndicator';
import { Sparkline } from './Sparkline';
import { cn } from '@/lib/utils';

interface KPICardProps {
  kpi: KPI;
  onClick?: () => void;
}

// Generate mock sparkline data based on current value and trend
function generateSparklineData(value: number, trend: string, percent: number): number[] {
  const points = 12;
  const data: number[] = [];
  
  // Work backwards from current value
  let current = value;
  const changePerPoint = (value * (percent / 100)) / points;
  
  for (let i = 0; i < points; i++) {
    // Add some noise
    const noise = (Math.random() - 0.5) * changePerPoint * 0.5;
    data.unshift(current + noise);
    
    // Adjust based on trend direction
    if (trend === 'up') {
      current -= changePerPoint;
    } else if (trend === 'down') {
      current += changePerPoint;
    } else {
      current += (Math.random() - 0.5) * changePerPoint;
    }
  }
  
  return data;
}

export function KPICard({ kpi, onClick }: KPICardProps) {
  const sparklineData = generateSparklineData(kpi.value, kpi.trend, kpi.trendPercent);

  return (
    <button
      onClick={onClick}
      className={cn(
        'group flex w-full flex-col gap-2 rounded-lg border bg-card p-4 text-left transition-all',
        'hover:border-primary/30 hover:shadow-sm',
        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        kpi.status === 'critical' && 'border-status-critical/30 bg-status-critical/5'
      )}
    >
      {/* Top row: Name and Status */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-medium leading-tight text-foreground">
          {kpi.name}
        </h3>
        <StatusBadge status={kpi.status} compact />
      </div>

      {/* Middle: Value and Sparkline */}
      <div className="flex items-end justify-between gap-2">
        <div>
          <span className="text-2xl font-semibold tabular-nums tracking-tight text-foreground">
            {typeof kpi.value === 'number' && kpi.value >= 1000 
              ? kpi.value.toLocaleString('sv-SE') 
              : typeof kpi.value === 'number' 
                ? kpi.value.toFixed(1)
                : kpi.value}
          </span>
          <span className="ml-1 text-xs text-muted-foreground">{kpi.unit}</span>
        </div>
        <Sparkline 
          data={sparklineData} 
          status={kpi.status}
          width={56}
          height={24}
        />
      </div>

      {/* Bottom: Trend */}
      <div className="flex items-center justify-between border-t border-border pt-2">
        <TrendIndicator
          direction={kpi.trend}
          percent={kpi.trendPercent}
          inverted={kpi.inverted}
          compact
        />
        {kpi.status === 'critical' && kpi.redFlags.length > 0 && (
          <span className="text-[10px] font-medium text-status-critical">
            VARNING
          </span>
        )}
      </div>
    </button>
  );
}
