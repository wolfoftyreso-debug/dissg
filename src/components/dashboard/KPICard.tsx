import { KPI } from '@/types/kpi';
import { StatusBadge } from './StatusBadge';
import { TrendIndicator } from './TrendIndicator';
import { Sparkline } from './Sparkline';
import { cn } from '@/lib/utils';
import { AlertTriangle } from 'lucide-react';

interface KPICardProps {
  kpi: KPI;
  onClick?: () => void;
}

// Generate mock sparkline data based on current value and trend
function generateSparklineData(value: number, trend: string, percent: number): number[] {
  const points = 12;
  const data: number[] = [];
  
  let current = value;
  const changePerPoint = (value * (percent / 100)) / points;
  
  for (let i = 0; i < points; i++) {
    const noise = (Math.random() - 0.5) * changePerPoint * 0.5;
    data.unshift(current + noise);
    
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
  const isCritical = kpi.status === 'critical';
  const hasActiveWarning = isCritical && kpi.redFlags.length > 0;

  return (
    <button
      onClick={onClick}
      className={cn(
        'group flex w-full flex-col gap-2 rounded-sm border bg-card p-3 text-left transition-all',
        'hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1',
        isCritical 
          ? 'border-status-critical/40 bg-status-critical/[0.02]' 
          : 'border-border'
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
      <div className="flex items-end justify-between gap-3">
        <div className="min-w-0">
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
          width={52}
          height={20}
        />
      </div>

      {/* Bottom: Trend + Warning */}
      <div className="flex items-center justify-between border-t border-border pt-2">
        <TrendIndicator
          direction={kpi.trend}
          percent={kpi.trendPercent}
          inverted={kpi.inverted}
          compact
        />
        {hasActiveWarning && (
          <div className="flex items-center gap-1 text-status-critical">
            <AlertTriangle className="h-3 w-3" />
            <span className="text-[10px] font-semibold uppercase tracking-wide">
              Varning
            </span>
          </div>
        )}
      </div>
    </button>
  );
}
