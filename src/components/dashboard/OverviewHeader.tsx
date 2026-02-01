import { KPI } from '@/types/kpi';
import { cn } from '@/lib/utils';

interface ComparisonPeriod {
  label: string;
  key: 'week' | 'month3' | 'month12';
  description: string;
}

const PERIODS: ComparisonPeriod[] = [
  { label: '1 vecka', key: 'week', description: 'vs förra veckan' },
  { label: '3 månader', key: 'month3', description: 'vs 3 månader sedan' },
  { label: '12 månader', key: 'month12', description: 'vs 12 månader sedan' },
];

interface OverviewHeaderProps {
  kpis: KPI[];
  selectedPeriod: 'week' | 'month3' | 'month12';
  onPeriodChange: (period: 'week' | 'month3' | 'month12') => void;
}

export function OverviewHeader({ kpis, selectedPeriod, onPeriodChange }: OverviewHeaderProps) {
  const criticalCount = kpis.filter(k => k.status === 'critical').length;
  const warningCount = kpis.filter(k => k.status === 'warning').length;
  const positiveCount = kpis.filter(k => k.status === 'positive').length;
  return (
    <div className="space-y-4 px-4 py-5 border-b border-border">
      {/* Title - just nu */}
      <div>
        <h2 className="text-lg font-semibold text-foreground tracking-tight">
          Nationell lägesbild
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5">just nu</p>
      </div>

      {/* Period selector - tydlig jämförelse */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Jämför:</span>
        <div className="flex gap-1">
          {PERIODS.map((period) => (
            <button
              key={period.key}
              onClick={() => onPeriodChange(period.key)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-sm border transition-colors",
                selectedPeriod === period.key
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-muted-foreground border-border hover:bg-muted hover:text-foreground"
              )}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      {/* Status summary - tre signalfärger, tydliga siffror */}
      <div className="flex items-center gap-6">
        {criticalCount > 0 && (
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-status-critical" />
            <div>
              <span className="text-lg font-semibold text-foreground tabular-nums">{criticalCount}</span>
              <span className="text-sm text-muted-foreground ml-1.5">kritiska</span>
            </div>
          </div>
        )}
        {warningCount > 0 && (
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-status-warning" />
            <div>
              <span className="text-lg font-semibold text-foreground tabular-nums">{warningCount}</span>
              <span className="text-sm text-muted-foreground ml-1.5">avvikelser</span>
            </div>
          </div>
        )}
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-sm bg-status-positive" />
          <div>
            <span className="text-lg font-semibold text-foreground tabular-nums">{positiveCount}</span>
            <span className="text-sm text-muted-foreground ml-1.5">stabila</span>
          </div>
        </div>
      </div>
    </div>
  );
}
