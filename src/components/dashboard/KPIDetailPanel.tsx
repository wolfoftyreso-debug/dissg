import { KPI } from '@/types/kpi';
import { StatusBadge } from './StatusBadge';
import { TrendIndicator } from './TrendIndicator';
import { ConfidenceBar } from './ConfidenceBar';
import { X, AlertTriangle, Database, Clock, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPIDetailPanelProps {
  kpi: KPI;
  onClose: () => void;
}

export function KPIDetailPanel({ kpi, onClose }: KPIDetailPanelProps) {
  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg border-l border-border bg-card shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground">
              KPI {kpi.index.toString().padStart(2, '0')}
            </span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              NIVÅ 2 — Förklaring
            </span>
          </div>
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
                  {typeof kpi.value === 'number' && kpi.value >= 1000 
                    ? kpi.value.toLocaleString('sv-SE') 
                    : kpi.value}
                </p>
                <p className="text-sm text-muted-foreground">{kpi.unit}</p>
              </div>
              <StatusBadge status={kpi.status} className="text-base" />
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <TrendIndicator
                direction={kpi.trend}
                percent={kpi.trendPercent}
                inverted={kpi.inverted}
              />
              <div className="text-right">
                <p className="font-mono text-sm text-foreground">
                  {typeof kpi.previousValue === 'number' && kpi.previousValue >= 1000 
                    ? kpi.previousValue.toLocaleString('sv-SE') 
                    : kpi.previousValue}
                </p>
                <p className="text-xs text-muted-foreground">Föregående period</p>
              </div>
            </div>
          </div>
        </section>

        {/* Rationale */}
        <section className="space-y-3">
          <h3 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Varför denna indikator
          </h3>
          <p className="text-sm text-foreground leading-relaxed">{kpi.rationale}</p>
        </section>

        {/* Red Flags */}
        {kpi.redFlags.length > 0 && (
          <section className="space-y-3">
            <h3 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Röda flaggor
            </h3>
            <div className="space-y-2">
              {kpi.redFlags.map((flag, i) => (
                <div
                  key={i}
                  className={cn(
                    'flex items-start gap-3 rounded border p-3',
                    kpi.status === 'critical'
                      ? 'border-status-critical/30 bg-status-critical/5'
                      : 'border-border bg-background'
                  )}
                >
                  <AlertTriangle className={cn(
                    'mt-0.5 h-4 w-4 shrink-0',
                    kpi.status === 'critical' ? 'text-status-critical' : 'text-muted-foreground'
                  )} />
                  <div>
                    <p className="text-sm text-foreground">{flag.condition}</p>
                    {flag.threshold && (
                      <p className="font-mono text-xs text-muted-foreground">
                        Tröskel: {flag.threshold}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

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

        {/* Breakdown Available */}
        <section className="space-y-3">
          <h3 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Nedbrytning tillgänglig
          </h3>
          <div className="flex flex-wrap gap-2">
            {kpi.breakdownAvailable.map((dim) => (
              <span
                key={dim}
                className="inline-flex items-center gap-1 rounded border border-border bg-background px-2 py-1 text-xs text-muted-foreground"
              >
                {dim === 'region' && <MapPin className="h-3 w-3" />}
                {dim === 'time' && <Clock className="h-3 w-3" />}
                {dim}
              </span>
            ))}
          </div>
        </section>

        {/* Data Sources */}
        <section className="space-y-3">
          <h3 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Datakällor
          </h3>
          <div className="space-y-2">
            {kpi.dataSources.map((source, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded border border-border bg-background p-3"
              >
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{source.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-muted-foreground">
                    {source.updateFrequency}
                  </span>
                  <ConfidenceBar value={source.reliability} />
                </div>
              </div>
            ))}
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

        {/* Definition */}
        <section className="space-y-3">
          <h3 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Definition
          </h3>
          <p className="text-sm text-muted-foreground">{kpi.description}</p>
        </section>

        {/* Consequence preview (NIVÅ 3) */}
        {kpi.status !== 'positive' && (
          <section className="space-y-3 border-t border-border pt-6">
            <h3 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              NIVÅ 3 — Konsekvensanalys
            </h3>
            <div className={cn(
              'rounded border p-4',
              kpi.status === 'critical' 
                ? 'border-status-critical/30 bg-status-critical/5' 
                : 'border-status-warning/30 bg-status-warning/5'
            )}>
              <p className="text-sm text-foreground">
                Vid status quo fortsätter denna indikator att{' '}
                {kpi.trend === 'up' ? 'öka' : kpi.trend === 'down' ? 'minska' : 'ligga stabilt'} med cirka{' '}
                {Math.abs(kpi.trendPercent).toFixed(1)}% per period.
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Baserat på nuvarande trend och historiska mönster.
              </p>
            </div>
          </section>
        )}

        {/* Actions placeholder (NIVÅ 4) */}
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
