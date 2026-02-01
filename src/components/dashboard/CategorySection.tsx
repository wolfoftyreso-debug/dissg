import { KPI, CategoryMeta } from '@/types/kpi';
import { KPICard } from './KPICard';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface CategorySectionProps {
  category: CategoryMeta;
  kpis: KPI[];
  onKPIClick?: (kpi: KPI) => void;
  defaultExpanded?: boolean;
}

export function CategorySection({ 
  category, 
  kpis, 
  onKPIClick,
  defaultExpanded = true 
}: CategorySectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  
  const criticalCount = kpis.filter(k => k.status === 'critical').length;
  const warningCount = kpis.filter(k => k.status === 'warning').length;
  const allGood = criticalCount === 0 && warningCount === 0;

  return (
    <section className="space-y-2">
      {/* Category Header - Klickbar för att expandera/kollapa */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between px-4 py-2 text-left hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-primary uppercase tracking-wide">{category.code}</span>
              <h3 className="text-sm font-semibold text-foreground">{category.name}</h3>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{category.description}</p>
          </div>
        </div>
        
        {/* Status indicators - Endast tre färger */}
        <div className="flex items-center gap-2">
          {criticalCount > 0 && (
            <span className={cn(
              "flex items-center gap-1 rounded-sm px-2 py-0.5 text-xs font-semibold",
              "bg-status-critical/10 text-status-critical"
            )}>
              {criticalCount}
            </span>
          )}
          {warningCount > 0 && (
            <span className={cn(
              "flex items-center gap-1 rounded-sm px-2 py-0.5 text-xs font-semibold",
              "bg-status-warning/12 text-amber-700"
            )}>
              {warningCount}
            </span>
          )}
          {allGood && (
            <span className={cn(
              "flex items-center gap-1 rounded-sm px-2 py-0.5 text-xs font-semibold",
              "bg-status-positive/10 text-status-positive"
            )}>
              OK
            </span>
          )}
        </div>
      </button>

      {/* KPI Grid - Responsiv */}
      {isExpanded && (
        <div className="grid gap-2 px-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {kpis.map((kpi) => (
            <KPICard
              key={kpi.id}
              kpi={kpi}
              onClick={() => onKPIClick?.(kpi)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
