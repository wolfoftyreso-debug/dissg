import { KPI } from '@/types/kpi';
import { StatusBadge } from './StatusBadge';
import { TrendIndicator } from './TrendIndicator';
import { ConfidenceBar } from './ConfidenceBar';
import { X, AlertTriangle, TrendingDown, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPIDetailPanelProps {
  kpi: KPI;
  onClose: () => void;
}

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

export function KPIDetailPanel({ kpi, onClose }: KPIDetailPanelProps) {
  const isInverted = invertedMetrics.includes(kpi.id);

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg border-l border-border bg-card shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            NIVÅ 2 — Förklaring
          </p>
          <h2 className="text-lg font-semibold text-foreground">{kpi.name}</h2>
        </div>
        <button
          onClick={onClose}
          className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Content */}
      <div className="space-y-6 overflow-y-auto p-6" style={{ height: 'calc(100% - 73px)' }}>
        {/* Current Status */}
        <section className="space-y-3">
          <h3 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Aktuellt läge
          </h3>
          <div className="rounded border border-border bg-background p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-3xl font-semibold tabular-nums text-foreground">
                  {kpi.value.toLocaleString('sv-SE')}
                </p>
                <p className="text-sm text-muted-foreground">{kpi.unit}</p>
              </div>
              <StatusBadge status={kpi.status} className="text-base" />
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <TrendIndicator
                direction={kpi.trend}
                percent={kpi.trendPercent}
                inverted={isInverted}
              />
              <div className="text-right">
                <p className="font-mono text-sm text-foreground">{kpi.previousValue.toLocaleString('sv-SE')}</p>
                <p className="text-xs text-muted-foreground">Föregående period</p>
              </div>
            </div>
          </div>
        </section>

        {/* Trend Analysis */}
        <section className="space-y-3">
          <h3 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Trendutveckling
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between rounded border border-border bg-background p-3">
              <span className="text-sm text-muted-foreground">Kortsiktig (4–12v)</span>
              <span className="font-mono text-sm text-foreground">{kpi.shortTermTrend}</span>
            </div>
            <div className="flex items-center justify-between rounded border border-border bg-background p-3">
              <span className="text-sm text-muted-foreground">Långsiktig (6–12m)</span>
              <span className="font-mono text-sm text-foreground">{kpi.longTermTrend}</span>
            </div>
          </div>
        </section>

        {/* Data Quality */}
        <section className="space-y-3">
          <h3 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Datakvalitet
          </h3>
          <div className="rounded border border-border bg-background p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Konfidensnivå</span>
              <ConfidenceBar value={kpi.confidence} />
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
              <span className="text-sm text-muted-foreground">Senast uppdaterad</span>
              <span className="font-mono text-sm text-foreground">{kpi.lastUpdated}</span>
            </div>
          </div>
        </section>

        {/* Consequence Analysis (NIVÅ 3 preview) */}
        {kpi.status !== 'positive' && (
          <section className="space-y-3">
            <h3 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              NIVÅ 3 — Konsekvensanalys
            </h3>
            <div className={cn(
              'rounded border p-4',
              kpi.status === 'critical' 
                ? 'border-status-critical/30 bg-status-critical/5' 
                : 'border-status-warning/30 bg-status-warning/5'
            )}>
              <div className="flex items-start gap-3">
                <AlertTriangle className={cn(
                  'mt-0.5 h-5 w-5',
                  kpi.status === 'critical' ? 'text-status-critical' : 'text-status-warning'
                )} />
                <div className="space-y-2">
                  <p className="text-sm text-foreground">
                    Vid status quo fortsätter denna indikator att{' '}
                    {kpi.trend === 'up' ? 'öka' : 'minska'} med cirka{' '}
                    {Math.abs(kpi.trendPercent).toFixed(1)}% per månad.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Förväntad utveckling baserad på nuvarande trend och historiska mönster.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Description */}
        {kpi.description && (
          <section className="space-y-3">
            <h3 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Definition
            </h3>
            <p className="text-sm text-muted-foreground">{kpi.description}</p>
          </section>
        )}

        {/* Actions placeholder */}
        <section className="space-y-3 border-t border-border pt-6">
          <h3 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            NIVÅ 4 — Beslutsstöd
          </h3>
          <div className="rounded border border-dashed border-border bg-muted/30 p-4">
            <p className="text-center text-sm text-muted-foreground">
              Beslutsstöd genereras vid fullständig dataintegrering
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
