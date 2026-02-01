import { KPI } from '@/types/kpi';
import { StatusBadge } from './StatusBadge';
import { TrendIndicator } from './TrendIndicator';
import { ConfidenceBar } from './ConfidenceBar';
import { cn } from '@/lib/utils';

interface KPICardProps {
  kpi: KPI;
  onClick?: () => void;
}

// Metrics where a decrease is positive
const invertedMetrics = [
  'psychiatric_care_queue',
  'sick_leave_rate',
  'shootings',
  'segregation_index',
  'inflation',
  'energy_dependency',
  'cyber_incidents',
  'supply_chain_risk',
];

export function KPICard({ kpi, onClick }: KPICardProps) {
  const isInverted = invertedMetrics.includes(kpi.id);

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
        <h3 className="text-sm font-medium leading-tight text-foreground">
          {kpi.name}
        </h3>
        <StatusBadge status={kpi.status} />
      </div>

      {/* Main Value */}
      <div className="flex items-baseline gap-2">
        <span className="font-mono text-2xl font-semibold tabular-nums tracking-tight text-foreground">
          {kpi.value.toLocaleString('sv-SE')}
        </span>
        <span className="text-xs text-muted-foreground">{kpi.unit}</span>
      </div>

      {/* Trend */}
      <div className="flex items-center justify-between gap-2">
        <TrendIndicator
          direction={kpi.trend}
          percent={kpi.trendPercent}
          inverted={isInverted}
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

      {/* Description tooltip on hover */}
      {kpi.description && (
        <div className="absolute -bottom-1 left-0 right-0 translate-y-full opacity-0 transition-opacity group-hover:opacity-100">
          <div className="mx-2 rounded border bg-popover p-2 text-xs text-popover-foreground shadow-lg">
            {kpi.description}
          </div>
        </div>
      )}
    </button>
  );
}
