import { KPI } from '@/types/kpi';
import { StatusBadge } from './StatusBadge';
import { TrendIndicator } from './TrendIndicator';
import { ConfidenceBar } from './ConfidenceBar';
import { ForecastPanel } from './ForecastPanel';
import { DecisionSupportPanel } from './DecisionSupportPanel';
import { HistoryPanel } from './HistoryPanel';
import { 
  X, 
  AlertTriangle, 
  Database, 
  Clock, 
  MapPin, 
  Users, 
  ChevronRight,
  Building2,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPIDetailPanelProps {
  kpi: KPI;
  onClose: () => void;
}

// Mappning av kategorier till departement
const DEPARTMENT_MAP: Record<string, { primary: string; secondary: string; operational: string }> = {
  demografi_halsa: {
    primary: 'Socialdepartementet',
    secondary: 'Finansdepartementet',
    operational: 'Socialstyrelsen',
  },
  arbete_produktivitet: {
    primary: 'Arbetsmarknadsdepartementet',
    secondary: 'Utbildningsdepartementet',
    operational: 'Arbetsförmedlingen',
  },
  ekonomisk_barkraft: {
    primary: 'Finansdepartementet',
    secondary: 'Näringsdepartementet',
    operational: 'Skatteverket',
  },
  social_stabilitet: {
    primary: 'Justitiedepartementet',
    secondary: 'Socialdepartementet',
    operational: 'Polismyndigheten',
  },
  karnsystem_funktion: {
    primary: 'Socialdepartementet',
    secondary: 'Utbildningsdepartementet',
    operational: 'Skolverket',
  },
  infrastruktur: {
    primary: 'Infrastrukturdepartementet',
    secondary: 'Miljödepartementet',
    operational: 'Trafikverket',
  },
  systemrisk_styrning: {
    primary: 'Statsrådsberedningen',
    secondary: 'Finansdepartementet',
    operational: 'Regeringskansliet',
  },
};

export function KPIDetailPanel({ kpi, onClose }: KPIDetailPanelProps) {
  const dept = DEPARTMENT_MAP[kpi.category] || DEPARTMENT_MAP.systemrisk_styrning;
  
  // Real data only - no simulation
  // These values will come from verified database sources
  const weeksNegative: number | null = null; // Will be populated from kpi_values
  const hasRegisteredActions: boolean | null = null; // Will be populated from policy_actions

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[28rem] lg:w-[32rem] xl:w-[36rem] overflow-y-auto border-l border-border bg-background shadow-xl animate-in slide-in-from-right-full duration-300">
      {/* Header - Klar rubrik */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background px-4 py-3">
        <div>
          <h2 className="text-base font-semibold text-foreground tracking-tight">{kpi.name}</h2>
          <p className="text-xs text-muted-foreground">KPI {kpi.index}</p>
        </div>
        <button
          onClick={onClose}
          className="rounded-sm p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Content */}
      <div className="space-y-5 p-4">
        
        {/* A. Topp - Kort, neutral sammanfattning */}
        <section className="rounded-sm border border-border bg-muted/30 p-4">
          <p className="text-sm text-foreground leading-relaxed">
            {kpi.status === 'critical' && (
              <>
                <span className="font-semibold text-status-critical">Negativ trend</span> sedan {weeksNegative} veckor.{' '}
              </>
            )}
            {kpi.status === 'warning' && (
              <>
                <span className="font-semibold text-status-warning">Avvikelse observerad</span>.{' '}
              </>
            )}
            {kpi.status === 'positive' && (
              <>
                <span className="font-semibold text-status-positive">Stabil utveckling</span>.{' '}
              </>
            )}
            {kpi.status === 'neutral' && (
              <>Ingen signifikant förändring.{' '}</>
            )}
            Avvikelsen är {kpi.confidence > 70 ? 'statistiskt säker' : 'ännu osäker'}.
          </p>
        </section>

        {/* Aktuellt värde */}
        <section className="flex items-center justify-between rounded-sm border border-border bg-card p-4">
          <div>
            <p className="text-3xl font-semibold tabular-nums text-foreground tracking-tight">
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

        {/* Automatisk varning - VIKTIGT */}
        {kpi.status === 'critical' && !hasRegisteredActions && (
          <section className="rounded-sm border border-status-critical/40 bg-status-critical/5 p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-status-critical mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-status-critical">
                  Indikatorn har försämrats {weeksNegative} veckor i rad
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Inga åtgärder registrerade i systemet.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* B. History Panel - Löpande tidsdiagram */}
        <HistoryPanel kpi={kpi} />

        {/* C. Förklaring (AI-text) - Kort, strikt */}
        <section className="space-y-2">
          <h3 className="section-header">Förklaring</h3>
          <div className="space-y-3 rounded-sm border border-border bg-card p-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Vad förändrades</p>
              <p className="text-sm text-foreground mt-1">
                Värdet har {kpi.trend === 'up' ? 'ökat' : kpi.trend === 'down' ? 'minskat' : 'legat stabilt'} med {Math.abs(kpi.trendPercent).toFixed(1)}% jämfört med föregående period.
              </p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Troliga orsaker</p>
              <p className="text-sm text-foreground mt-1">{kpi.rationale}</p>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Datakvalitet</p>
                <p className="text-sm text-foreground mt-0.5">
                  {kpi.confidence >= 80 ? 'Hög' : kpi.confidence >= 60 ? 'Medel' : 'Låg'} ({kpi.confidence}%)
                </p>
              </div>
              <ConfidenceBar value={kpi.confidence} />
            </div>
          </div>
        </section>

        {/* D. Ansvar - Systemets ryggrad */}
        <section className="space-y-2">
          <h3 className="section-header">Ansvar</h3>
          <div className="space-y-2">
            {/* Primärt ansvar */}
            <button className="flex w-full items-center justify-between rounded-sm border border-border bg-card p-3 text-left hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <Building2 className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">Primärt ansvar</p>
                  <p className="text-xs text-muted-foreground">{dept.primary}</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
            
            {/* Sekundärt ansvar */}
            <button className="flex w-full items-center justify-between rounded-sm border border-border bg-card p-3 text-left hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">Sekundärt ansvar</p>
                  <p className="text-xs text-muted-foreground">{dept.secondary}</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
            
            {/* Operativt ansvar */}
            <button className="flex w-full items-center justify-between rounded-sm border border-border bg-card p-3 text-left hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">Operativ nivå</p>
                  <p className="text-xs text-muted-foreground">{dept.operational}</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </section>

        {/* NIVÅ 3: Konsekvensanalys med prognos */}
        <ForecastPanel kpi={kpi} />

        {/* NIVÅ 4: Beslutsstöd med åtgärdsförslag */}
        <DecisionSupportPanel kpi={kpi} />

        {/* Varningsflaggor */}
        {kpi.redFlags.length > 0 && (
          <section className="space-y-2">
            <h3 className="section-header">Varningsflaggor</h3>
            <div className="space-y-2">
              {kpi.redFlags.map((flag, i) => (
                <div
                  key={i}
                  className={cn(
                    'flex items-start gap-3 rounded-sm border p-3',
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
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Tröskel: {flag.threshold}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Nedbrytning tillgänglig */}
        <section className="space-y-2">
          <h3 className="section-header">Nedbrytning tillgänglig</h3>
          <div className="flex flex-wrap gap-2">
            {kpi.breakdownAvailable.map((dim) => (
              <button
                key={dim}
                className="inline-flex items-center gap-1.5 rounded-sm border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted/50 transition-colors"
              >
                {dim === 'region' && <MapPin className="h-3 w-3" />}
                {dim === 'time' && <Clock className="h-3 w-3" />}
                {dim === 'age' && <Users className="h-3 w-3" />}
                {dim === 'gender' && <Users className="h-3 w-3" />}
                <span className="capitalize">{dim}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Datakällor */}
        <section className="space-y-2">
          <h3 className="section-header font-mono">[DATAKÄLLOR]</h3>
          <div className="space-y-2">
            {kpi.dataSources && kpi.dataSources.length > 0 ? (
              kpi.dataSources.map((source, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-sm border border-border bg-card p-3"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">[SRC]</span>
                    <span className="text-sm text-foreground">{source.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground font-mono">
                      [{source.updateFrequency?.toUpperCase() || 'N/A'}]
                    </span>
                    <ConfidenceBar value={source.reliability} />
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-sm border border-dashed border-border bg-muted/30 p-4 text-center">
                <p className="text-sm text-muted-foreground font-mono">—</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Inga verifierade datakällor konfigurerade
                </p>
                <p className="text-xs font-mono text-status-warning mt-2">[NO_SOURCES]</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
