import { useState } from 'react';
import { KPI } from '@/types/kpi';
import { cn } from '@/lib/utils';
import { RootKPIDisplay } from './RootKPIDisplay';
import { ChevronDown } from 'lucide-react';

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
  onKPIClick?: (kpi: KPI) => void;
}

export function OverviewHeader({ kpis, selectedPeriod, onPeriodChange, onKPIClick }: OverviewHeaderProps) {
  const [showRootKPIDetails, setShowRootKPIDetails] = useState(false);
  
  const criticalCount = kpis.filter(k => k.status === 'critical').length;
  const warningCount = kpis.filter(k => k.status === 'warning').length;
  const positiveCount = kpis.filter(k => k.status === 'positive').length;
  
  return (
    <div className="space-y-4 px-4 py-5 border-b border-border">
      {/* Title */}
      <div>
        <h2 className="text-lg font-semibold text-foreground tracking-tight">
          Nationell lägesbild
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5">just nu</p>
      </div>

      {/* Root KPI - Compact view */}
      <RootKPIDisplay kpis={kpis} onKPIClick={onKPIClick} compact />
      
      {/* Expandable root KPI details */}
      <button
        onClick={() => setShowRootKPIDetails(!showRootKPIDetails)}
        className="flex w-full items-center justify-between rounded-md border border-border bg-card p-2 text-left hover:bg-muted/50 transition-colors"
      >
        <span className="text-xs font-medium text-foreground">Visa hierarki & bidrag</span>
        <ChevronDown className={cn(
          "h-4 w-4 text-muted-foreground transition-transform",
          showRootKPIDetails && "rotate-180"
        )} />
      </button>
      
      {showRootKPIDetails && (
        <RootKPIDisplay kpis={kpis} onKPIClick={onKPIClick} />
      )}

      {/* Period selector */}
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

      {/* Status summary */}
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
