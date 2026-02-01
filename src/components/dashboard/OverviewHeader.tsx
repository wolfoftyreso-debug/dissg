import { KPI } from '@/types/kpi';

interface ComparisonPeriod {
  label: string;
  key: 'week' | 'month3' | 'month12';
}

const PERIODS: ComparisonPeriod[] = [
  { label: '1v', key: 'week' },
  { label: '3m', key: 'month3' },
  { label: '12m', key: 'month12' },
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

  const today = new Date().toLocaleDateString('sv-SE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="space-y-4 px-4 py-4">
      {/* Title */}
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          Nationell lägesbild
        </h2>
        <p className="text-sm text-muted-foreground">{today}</p>
      </div>

      {/* Period selector */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Jämför mot:</span>
        <div className="inline-flex rounded-lg border border-border bg-muted/50 p-0.5">
          {PERIODS.map((period) => (
            <button
              key={period.key}
              onClick={() => onPeriodChange(period.key)}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                selectedPeriod === period.key
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      {/* Status summary */}
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-status-critical" />
          <span className="font-medium text-foreground">{criticalCount}</span>
          <span className="text-muted-foreground">kritiska</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-status-warning" />
          <span className="font-medium text-foreground">{warningCount}</span>
          <span className="text-muted-foreground">avvikelser</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-status-positive" />
          <span className="font-medium text-foreground">{positiveCount}</span>
          <span className="text-muted-foreground">stabila</span>
        </div>
      </div>
    </div>
  );
}
