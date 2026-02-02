import { useMemo } from 'react';
import { KPI } from '@/types/kpi';
import { ROOT_KPI_CONFIG, calculateRootKPI, ROOT_KPI_THRESHOLDS, KPI_HIERARCHY } from '@/config/rootKPIConfig';
import { cn } from '@/lib/utils';
import { 
  Target, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  ChevronRight,
  Info,
  AlertTriangle,
  CheckCircle2,
  XCircle
} from 'lucide-react';

interface RootKPIDisplayProps {
  kpis: KPI[];
  onKPIClick?: (kpi: KPI) => void;
  compact?: boolean;
}

export function RootKPIDisplay({ kpis, onKPIClick, compact = false }: RootKPIDisplayProps) {
  // Calculate root KPI from all component KPIs
  const rootKPIResult = useMemo(() => {
    const kpiValues: Record<string, number> = {};
    kpis.forEach(kpi => {
      kpiValues[kpi.id] = kpi.value;
    });
    return calculateRootKPI(kpiValues);
  }, [kpis]);

  const currentThreshold = ROOT_KPI_THRESHOLDS.find(
    t => rootKPIResult.value >= t.minValue && rootKPIResult.value <= t.maxValue
  );

  // Group contributions by category
  const contributionsByCategory = useMemo(() => {
    const grouped: Record<string, { total: number; kpis: typeof rootKPIResult.contributions }> = {};
    
    rootKPIResult.contributions.forEach(contrib => {
      const component = KPI_HIERARCHY.find(c => c.kpiId === contrib.kpiId);
      if (component) {
        if (!grouped[component.categoryId]) {
          grouped[component.categoryId] = { total: 0, kpis: [] };
        }
        grouped[component.categoryId].total += contrib.contribution;
        grouped[component.categoryId].kpis.push(contrib);
      }
    });
    
    return grouped;
  }, [rootKPIResult.contributions]);

  if (compact) {
    return (
      <div className={cn(
        "flex items-center gap-3 rounded-lg border p-3",
        rootKPIResult.level === 'green' && "border-status-positive/30 bg-status-positive/5",
        rootKPIResult.level === 'yellow' && "border-status-warning/30 bg-status-warning/5",
        rootKPIResult.level === 'red' && "border-status-critical/30 bg-status-critical/5",
      )}>
        <div className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full",
          rootKPIResult.level === 'green' && "bg-status-positive/20",
          rootKPIResult.level === 'yellow' && "bg-status-warning/20",
          rootKPIResult.level === 'red' && "bg-status-critical/20",
        )}>
          <Target className={cn(
            "h-5 w-5",
            rootKPIResult.level === 'green' && "text-status-positive",
            rootKPIResult.level === 'yellow' && "text-status-warning",
            rootKPIResult.level === 'red' && "text-status-critical",
          )} />
        </div>
        <div className="flex-1">
          <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            {ROOT_KPI_CONFIG.shortName}
          </p>
          <p className={cn(
            "text-xl font-bold tabular-nums",
            rootKPIResult.level === 'green' && "text-status-positive",
            rootKPIResult.level === 'yellow' && "text-status-warning",
            rootKPIResult.level === 'red' && "text-status-critical",
          )}>
            {rootKPIResult.value.toFixed(1)}%
          </p>
        </div>
        <div className={cn(
          "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase",
          rootKPIResult.level === 'green' && "bg-status-positive/20 text-status-positive",
          rootKPIResult.level === 'yellow' && "bg-status-warning/20 text-status-warning",
          rootKPIResult.level === 'red' && "bg-status-critical/20 text-status-critical",
        )}>
          {currentThreshold?.label}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main display */}
      <div className={cn(
        "rounded-lg border-2 p-4",
        rootKPIResult.level === 'green' && "border-status-positive/50 bg-status-positive/5",
        rootKPIResult.level === 'yellow' && "border-status-warning/50 bg-status-warning/5",
        rootKPIResult.level === 'red' && "border-status-critical/50 bg-status-critical/5",
      )}>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Target className={cn(
                "h-5 w-5",
                rootKPIResult.level === 'green' && "text-status-positive",
                rootKPIResult.level === 'yellow' && "text-status-warning",
                rootKPIResult.level === 'red' && "text-status-critical",
              )} />
              <h2 className="text-sm font-semibold text-foreground">{ROOT_KPI_CONFIG.name}</h2>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{ROOT_KPI_CONFIG.description}</p>
          </div>
          <div className={cn(
            "flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold",
            rootKPIResult.level === 'green' && "bg-status-positive/20 text-status-positive",
            rootKPIResult.level === 'yellow' && "bg-status-warning/20 text-status-warning",
            rootKPIResult.level === 'red' && "bg-status-critical/20 text-status-critical",
          )}>
            {rootKPIResult.level === 'green' && <CheckCircle2 className="h-3.5 w-3.5" />}
            {rootKPIResult.level === 'yellow' && <AlertTriangle className="h-3.5 w-3.5" />}
            {rootKPIResult.level === 'red' && <XCircle className="h-3.5 w-3.5" />}
            {currentThreshold?.label}
          </div>
        </div>

        {/* Value display */}
        <div className="mt-4 flex items-end gap-2">
          <span className={cn(
            "text-5xl font-bold tabular-nums tracking-tight",
            rootKPIResult.level === 'green' && "text-status-positive",
            rootKPIResult.level === 'yellow' && "text-status-warning",
            rootKPIResult.level === 'red' && "text-status-critical",
          )}>
            {rootKPIResult.value.toFixed(1)}
          </span>
          <span className="text-lg text-muted-foreground mb-1">{ROOT_KPI_CONFIG.unit}</span>
        </div>

        {/* Threshold bar */}
        <div className="mt-4 space-y-1">
          <div className="flex h-3 rounded-full overflow-hidden">
            {ROOT_KPI_THRESHOLDS.slice().reverse().map((threshold, i) => (
              <div
                key={threshold.level}
                className={cn(
                  "relative",
                  threshold.level === 'green' && "bg-status-positive/30",
                  threshold.level === 'yellow' && "bg-status-warning/30",
                  threshold.level === 'red' && "bg-status-critical/30",
                )}
                style={{ 
                  width: `${(threshold.maxValue - threshold.minValue)}%`,
                }}
              >
                {/* Current position indicator */}
                {rootKPIResult.value >= threshold.minValue && rootKPIResult.value <= threshold.maxValue && (
                  <div 
                    className={cn(
                      "absolute top-0 h-full w-1 rounded-full",
                      threshold.level === 'green' && "bg-status-positive",
                      threshold.level === 'yellow' && "bg-status-warning",
                      threshold.level === 'red' && "bg-status-critical",
                    )}
                    style={{
                      left: `${((rootKPIResult.value - threshold.minValue) / (threshold.maxValue - threshold.minValue)) * 100}%`,
                    }}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>0%</span>
            <span className="text-status-critical">65% (kritisk)</span>
            <span className="text-status-warning">72% (varning)</span>
            <span>100%</span>
          </div>
        </div>

        {/* Implication */}
        {currentThreshold && (
          <div className="mt-4 rounded bg-background/50 p-3">
            <p className="text-xs text-muted-foreground">{currentThreshold.implication}</p>
          </div>
        )}
      </div>

      {/* Category contributions */}
      <div className="space-y-2">
        <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground flex items-center gap-2">
          <Info className="h-3.5 w-3.5" />
          Bidrag per kategori
        </h3>
        <div className="grid gap-2">
          {Object.entries(contributionsByCategory).map(([categoryId, { total, kpis: categoryKpis }]) => {
            const categoryWeight = KPI_HIERARCHY
              .filter(c => c.categoryId === categoryId)
              .reduce((sum, c) => sum + c.weight, 0);
            
            return (
              <div key={categoryId} className="rounded border border-border bg-card p-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-foreground capitalize">
                    {categoryId.replace(/_/g, ' ')}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${(total / categoryWeight) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground min-w-[40px] text-right">
                      {(categoryWeight * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {categoryKpis.map(contrib => {
                    const kpi = kpis.find(k => k.id === contrib.kpiId);
                    if (!kpi) return null;
                    return (
                      <button
                        key={contrib.kpiId}
                        onClick={() => onKPIClick?.(kpi)}
                        className="text-[10px] text-muted-foreground hover:text-primary transition-colors"
                      >
                        #{kpi.index}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
