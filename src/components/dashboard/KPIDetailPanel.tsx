import { KPI } from '@/types/kpi';
import { StatusBadge } from './StatusBadge';
import { TrendIndicator } from './TrendIndicator';
import { ConfidenceBar } from './ConfidenceBar';
import { ForecastPanel } from './ForecastPanel';
import { DecisionSupportPanel } from './DecisionSupportPanel';
import { HistoryPanel } from './HistoryPanel';
import { X, AlertTriangle, Database, Clock, MapPin, Users, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPIDetailPanelProps {
  kpi: KPI;
  onClose: () => void;
}

export function KPIDetailPanel({ kpi, onClose }: KPIDetailPanelProps) {

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg overflow-y-auto border-l border-border bg-card shadow-xl">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card px-4 py-3">
        <div>
          <h2 className="text-base font-semibold text-foreground">{kpi.name}</h2>
          <p className="text-xs text-muted-foreground">KPI {kpi.index} • Detaljerad vy</p>
        </div>
        <button
          onClick={onClose}
          className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Content */}
      <div className="space-y-6 p-4">
        {/* A. Summary at top */}
        <section className="rounded-lg border border-border bg-muted/30 p-4">
          <p className="text-sm text-foreground">
            {kpi.status === 'critical' && (
              <>
                <span className="font-medium text-status-critical">Negativ trend</span> sedan {Math.floor(Math.random() * 8) + 4} veckor. 
              </>
            )}
            {kpi.status === 'warning' && (
              <>
                <span className="font-medium text-status-warning">Avvikelse observerad</span>. 
              </>
            )}
            {kpi.status === 'positive' && (
              <>
                <span className="font-medium text-status-positive">Stabil utveckling</span>. 
              </>
            )}
            {kpi.status === 'neutral' && (
              <>
                Ingen signifikant förändring. 
              </>
            )}
            {' '}Avvikelsen är {kpi.confidence > 70 ? 'statistiskt säker' : 'ännu osäker'}.
          </p>
        </section>

        {/* Current value */}
        <section className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
          <div>
            <p className="text-3xl font-semibold tabular-nums text-foreground">
              {typeof kpi.value === 'number' && kpi.value >= 1000 
                ? kpi.value.toLocaleString('sv-SE') 
                : typeof kpi.value === 'number'
                  ? kpi.value.toFixed(1)
                  : kpi.value}
            </p>
            <p className="text-sm text-muted-foreground">{kpi.unit}</p>
          </div>
          <div className="text-right">
            <StatusBadge status={kpi.status} />
            <div className="mt-2">
              <TrendIndicator
                direction={kpi.trend}
                percent={kpi.trendPercent}
                inverted={kpi.inverted}
                compact
              />
            </div>
          </div>
        </section>

        {/* B. History Panel with time series */}
        <HistoryPanel kpi={kpi} />

        {/* C. AI Explanation */}
        <section className="space-y-2">
          <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Förklaring
          </h3>
          <div className="space-y-3 rounded-lg border border-border bg-card p-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Vad förändrades</p>
              <p className="text-sm text-foreground">
                Värdet har {kpi.trend === 'up' ? 'ökat' : kpi.trend === 'down' ? 'minskat' : 'legat stabilt'} med {Math.abs(kpi.trendPercent).toFixed(1)}% jämfört med föregående period.
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Troliga orsaker</p>
              <p className="text-sm text-foreground">
                {kpi.rationale}
              </p>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-3">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Datakvalitet</p>
                <p className="text-sm text-foreground">
                  {kpi.confidence >= 80 ? 'Hög' : kpi.confidence >= 60 ? 'Medel' : 'Låg'} ({kpi.confidence}%)
                </p>
              </div>
              <ConfidenceBar value={kpi.confidence} />
            </div>
          </div>
        </section>

        {/* NIVÅ 3: Konsekvensanalys med prognos */}
        <ForecastPanel kpi={kpi} />

        {/* NIVÅ 4: Beslutsstöd med åtgärdsförslag */}
        <DecisionSupportPanel kpi={kpi} />

        {/* D. Responsibility */}
        <section className="space-y-2">
          <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Ansvar
          </h3>
          <div className="space-y-2">
            <button className="flex w-full items-center justify-between rounded-lg border border-border bg-card p-3 text-left hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <Users className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">Primärt ansvar</p>
                  <p className="text-xs text-muted-foreground">
                    {kpi.category === 'demografi_halsa' && 'Socialdepartementet'}
                    {kpi.category === 'arbete_produktivitet' && 'Arbetsmarknadsdepartementet'}
                    {kpi.category === 'ekonomisk_barkraft' && 'Finansdepartementet'}
                    {kpi.category === 'social_stabilitet' && 'Justitiedepartementet'}
                    {kpi.category === 'karnsystem_funktion' && 'Socialdepartementet'}
                    {kpi.category === 'infrastruktur' && 'Infrastrukturdepartementet'}
                    {kpi.category === 'systemrisk_styrning' && 'Statsrådsberedningen'}
                  </p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
            <button className="flex w-full items-center justify-between rounded-lg border border-border bg-card p-3 text-left hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">Operativt ansvar</p>
                  <p className="text-xs text-muted-foreground">
                    {kpi.dataSources[0]?.name || 'Ansvarig myndighet'}
                  </p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </section>

        {/* Red Flags */}
        {kpi.redFlags.length > 0 && (
          <section className="space-y-2">
            <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Varningsflaggor
            </h3>
            <div className="space-y-2">
              {kpi.redFlags.map((flag, i) => (
                <div
                  key={i}
                  className={cn(
                    'flex items-start gap-3 rounded-lg border p-3',
                    kpi.status === 'critical'
                      ? 'border-status-critical/30 bg-status-critical/5'
                      : 'border-border bg-card'
                  )}
                >
                  <AlertTriangle className={cn(
                    'mt-0.5 h-4 w-4 shrink-0',
                    kpi.status === 'critical' ? 'text-status-critical' : 'text-muted-foreground'
                  )} />
                  <div>
                    <p className="text-sm text-foreground">{flag.condition}</p>
                    {flag.threshold && (
                      <p className="text-xs text-muted-foreground">
                        Tröskel: {flag.threshold}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Breakdown Available */}
        <section className="space-y-2">
          <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Nedbrytning tillgänglig
          </h3>
          <div className="flex flex-wrap gap-2">
            {kpi.breakdownAvailable.map((dim) => (
              <button
                key={dim}
                className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted/50 transition-colors"
              >
                {dim === 'region' && <MapPin className="h-3 w-3" />}
                {dim === 'time' && <Clock className="h-3 w-3" />}
                {dim}
              </button>
            ))}
          </div>
        </section>

        {/* Data Sources */}
        <section className="space-y-2">
          <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Datakällor
          </h3>
          <div className="space-y-2">
            {kpi.dataSources.map((source, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border border-border bg-card p-3"
              >
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{source.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">
                    {source.updateFrequency}
                  </span>
                  <ConfidenceBar value={source.reliability} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
