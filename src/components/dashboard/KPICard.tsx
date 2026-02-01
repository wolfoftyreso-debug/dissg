import { KPI } from '@/types/kpi';
import { StatusBadge } from './StatusBadge';
import { TrendIndicator } from './TrendIndicator';
import { ConfidenceBar } from './ConfidenceBar';
import { cn } from '@/lib/utils';

interface KPICardProps {
  kpi: KPI;
  onClick?: () => void;
}

export function KPICard({ kpi, onClick }: KPICardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'group relative flex w-full flex-col gap-3 rounded border bg-card p-4 text-left transition-all',
        'hover:border-muted-foreground/30 hover:bg-accent/50',
        'focus:outline-none focus:ring-1 focus:ring-ring',
        kpi.status === 'critical' && 'border-status-critical/30'
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-xs text-muted-foreground">
            {kpi.index.toString().padStart(2, '0')}
          </span>
          <h3 className="text-sm font-medium leading-tight text-foreground">
            {kpi.name}
          </h3>
        </div>
        <StatusBadge status={kpi.status} />
      </div>

      {/* Main Value */}
      <div className="flex items-baseline gap-2">
        <span className="font-mono text-2xl font-semibold tabular-nums tracking-tight text-foreground">
          {typeof kpi.value === 'number' && kpi.value >= 1000 
            ? kpi.value.toLocaleString('sv-SE') 
            : kpi.value}
        </span>
        <span className="text-xs text-muted-foreground">{kpi.unit}</span>
      </div>

      {/* Trend */}
      <div className="flex items-center justify-between gap-2">
        <TrendIndicator
          direction={kpi.trend}
          percent={kpi.trendPercent}
          inverted={kpi.inverted}
        />
        <span className="font-mono text-xs text-muted-foreground">
          {kpi.shortTermTrend}
        </span>
      </div>

      {/* Confidence */}
      <div className="flex items-center justify-between gap-2 border-t border-border pt-3">
        <span className="text-xs text-muted-foreground">Konfidens</span>
        <ConfidenceBar value={kpi.confidence} />
      </div>

      {/* Red flag indicator if applicable */}
      {kpi.status === 'critical' && kpi.redFlags.length > 0 && (
        <div className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-status-critical opacity-75" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-status-critical" />
        </div>
      )}
    </button>
  );
}
