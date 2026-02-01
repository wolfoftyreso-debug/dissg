import { KPI, CategoryMeta } from '@/types/kpi';
import { KPICard } from './KPICard';

interface CategorySectionProps {
  category: CategoryMeta;
  kpis: KPI[];
  onKPIClick?: (kpi: KPI) => void;
}

export function CategorySection({ category, kpis, onKPIClick }: CategorySectionProps) {
  const criticalCount = kpis.filter(k => k.status === 'critical').length;
  const warningCount = kpis.filter(k => k.status === 'warning').length;

  return (
    <section className="space-y-3">
      {/* Category Header */}
      <div className="flex items-center justify-between border-b border-border pb-2">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">
            {category.name}
          </h2>
          <p className="text-xs text-muted-foreground">{category.description}</p>
        </div>
        <div className="flex items-center gap-2">
          {criticalCount > 0 && (
            <span className="status-indicator status-critical font-mono">
              {criticalCount} KRITISK
            </span>
          )}
          {warningCount > 0 && (
            <span className="status-indicator status-warning font-mono">
              {warningCount} AVVIKELSE
            </span>
          )}
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {kpis.map((kpi) => (
          <KPICard
            key={kpi.id}
            kpi={kpi}
            onClick={() => onKPIClick?.(kpi)}
          />
        ))}
      </div>
    </section>
  );
}
