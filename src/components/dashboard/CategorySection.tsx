import { KPI, CategoryMeta } from '@/types/kpi';
import { KPICard } from './KPICard';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

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

  return (
    <section className="space-y-2">
      {/* Category Header - Clickable to expand/collapse */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between px-4 py-2 text-left hover:bg-muted/50 transition-colors rounded-lg"
      >
        <div className="flex items-center gap-3">
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-primary">{category.code}</span>
              <h3 className="text-sm font-semibold text-foreground">{category.name}</h3>
            </div>
            <p className="text-xs text-muted-foreground">{category.description}</p>
          </div>
        </div>
        
        {/* Status indicators */}
        <div className="flex items-center gap-2">
          {criticalCount > 0 && (
            <span className="flex items-center gap-1 rounded bg-status-critical/10 px-2 py-0.5 text-xs font-medium text-status-critical">
              {criticalCount}
            </span>
          )}
          {warningCount > 0 && (
            <span className="flex items-center gap-1 rounded bg-status-warning/12 px-2 py-0.5 text-xs font-medium text-amber-700">
              {warningCount}
            </span>
          )}
          {criticalCount === 0 && warningCount === 0 && (
            <span className="flex items-center gap-1 rounded bg-status-positive/10 px-2 py-0.5 text-xs font-medium text-status-positive">
              OK
            </span>
          )}
        </div>
      </button>

      {/* KPI Grid */}
      {isExpanded && (
        <div className="grid gap-3 px-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
