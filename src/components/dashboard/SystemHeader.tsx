import { KPI } from '@/types/kpi';

interface SystemHeaderProps {
  kpis: KPI[];
  lastUpdate: string;
}

export function SystemHeader({ kpis, lastUpdate }: SystemHeaderProps) {
  const criticalCount = kpis.filter(k => k.status === 'critical').length;
  const warningCount = kpis.filter(k => k.status === 'warning').length;
  const positiveCount = kpis.filter(k => k.status === 'positive').length;
  const totalKpis = kpis.length;

  // Calculate overall system status
  const systemStatus = criticalCount > 3 ? 'critical' : criticalCount > 0 ? 'elevated' : 'nominal';

  return (
    <header className="border-b border-border bg-card/50 px-6 py-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Title */}
        <div>
          <h1 className="font-mono text-lg font-semibold uppercase tracking-wider text-foreground">
            Nationellt Ledningssystem
          </h1>
          <p className="text-xs text-muted-foreground">
            NIVÅ 1 — Översikt • {totalKpis} indikatorer • Senast: {lastUpdate}
          </p>
        </div>

        {/* Status Summary */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-6 rounded border border-border bg-background px-4 py-2">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-status-critical" />
              <span className="font-mono text-sm">
                <span className="text-foreground">{criticalCount}</span>
                <span className="ml-1 text-muted-foreground">kritiska</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-status-warning" />
              <span className="font-mono text-sm">
                <span className="text-foreground">{warningCount}</span>
                <span className="ml-1 text-muted-foreground">avvikelser</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-status-positive" />
              <span className="font-mono text-sm">
                <span className="text-foreground">{positiveCount}</span>
                <span className="ml-1 text-muted-foreground">stabila</span>
              </span>
            </div>
          </div>

          {/* System Status */}
          <div className={`flex items-center gap-2 rounded border px-3 py-2 ${
            systemStatus === 'critical' 
              ? 'border-status-critical/30 bg-status-critical/10' 
              : systemStatus === 'elevated'
              ? 'border-status-warning/30 bg-status-warning/10'
              : 'border-status-positive/30 bg-status-positive/10'
          }`}>
            <div className={`h-2 w-2 animate-pulse rounded-full ${
              systemStatus === 'critical' 
                ? 'bg-status-critical' 
                : systemStatus === 'elevated'
                ? 'bg-status-warning'
                : 'bg-status-positive'
            }`} />
            <span className={`font-mono text-xs uppercase ${
              systemStatus === 'critical' 
                ? 'text-status-critical' 
                : systemStatus === 'elevated'
                ? 'text-status-warning'
                : 'text-status-positive'
            }`}>
              {systemStatus === 'critical' ? 'Förhöjd risk' : systemStatus === 'elevated' ? 'Avvikelser' : 'Nominellt'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
