import { useState, useMemo } from 'react';
import { KPI, CATEGORIES } from '@/types/kpi';
import { mockKPIs } from '@/data/mockKPIs';
import { useKPIOverview } from '@/hooks/useKPIData';
import { Search, GitCompare, X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StatusBadge } from './StatusBadge';

interface KPICompareSelectorProps {
  currentKPI: KPI;
  onSelect: (kpi: KPI) => void;
  onCancel: () => void;
}

export function KPICompareSelector({ currentKPI, onSelect, onCancel }: KPICompareSelectorProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const { data: dbKPIs } = useKPIOverview();
  
  // Use database KPIs if available, otherwise fall back to mock
  const allKPIs = useMemo(() => {
    if (dbKPIs && dbKPIs.length > 0 && dbKPIs.some(k => k.value !== 0)) {
      return dbKPIs;
    }
    return mockKPIs;
  }, [dbKPIs]);
  
  // Filter out current KPI and apply search/category filters
  const filteredKPIs = useMemo(() => {
    return allKPIs
      .filter(kpi => kpi.id !== currentKPI.id)
      .filter(kpi => {
        if (search) {
          const searchLower = search.toLowerCase();
          return (
            kpi.name.toLowerCase().includes(searchLower) ||
            kpi.description?.toLowerCase().includes(searchLower) ||
            kpi.unit.toLowerCase().includes(searchLower)
          );
        }
        return true;
      })
      .filter(kpi => {
        if (selectedCategory) {
          return kpi.category === selectedCategory;
        }
        return true;
      });
  }, [allKPIs, currentKPI.id, search, selectedCategory]);
  
  const kpisByCategory = useMemo(() => {
    const grouped: Record<string, KPI[]> = {};
    filteredKPIs.forEach(kpi => {
      if (!grouped[kpi.category]) {
        grouped[kpi.category] = [];
      }
      grouped[kpi.category].push(kpi);
    });
    return grouped;
  }, [filteredKPIs]);
  
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GitCompare className="h-4 w-4 text-primary" />
          <h4 className="text-sm font-medium text-foreground">Välj KPI att jämföra med</h4>
        </div>
        <button
          onClick={onCancel}
          className="rounded-sm p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      
      {/* Current KPI indicator */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>Jämför</span>
        <span className="font-medium text-foreground px-2 py-0.5 bg-primary/10 rounded">
          {currentKPI.name}
        </span>
        <span>med:</span>
      </div>
      
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Sök KPI..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-md border border-border bg-background pl-9 pr-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
      
      {/* Category filter */}
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => setSelectedCategory(null)}
          className={cn(
            "px-2 py-1 text-[10px] font-medium rounded-full transition-colors",
            !selectedCategory
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          )}
        >
          Alla
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
            className={cn(
              "px-2 py-1 text-[10px] font-medium rounded-full transition-colors",
              selectedCategory === cat.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {cat.name.split(' ')[0]}
          </button>
        ))}
      </div>
      
      {/* KPI list */}
      <div className="max-h-64 overflow-y-auto space-y-1 rounded-md border border-border">
        {filteredKPIs.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Inga KPI:er matchar sökningen
          </div>
        ) : (
          Object.entries(kpisByCategory).map(([categoryId, kpis]) => {
            const category = CATEGORIES.find(c => c.id === categoryId);
            return (
              <div key={categoryId}>
                <div className="sticky top-0 bg-muted/80 backdrop-blur-sm px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground border-b border-border">
                  {category?.name || categoryId}
                </div>
                {kpis.map((kpi) => (
                  <button
                    key={kpi.id}
                    onClick={() => onSelect(kpi)}
                    className="w-full flex items-center justify-between p-2 text-left hover:bg-muted/50 transition-colors border-b border-border last:border-b-0"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-muted-foreground font-mono">
                          #{kpi.index}
                        </span>
                        <span className="text-sm font-medium text-foreground truncate">
                          {kpi.name}
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                        {kpi.value.toLocaleString('sv-SE')} {kpi.unit}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <StatusBadge status={kpi.status} />
                      <Check className="h-4 w-4 text-muted-foreground/30" />
                    </div>
                  </button>
                ))}
              </div>
            );
          })
        )}
      </div>
      
      {/* Quick suggestions */}
      <div className="text-[10px] text-muted-foreground">
        <p className="font-medium mb-1">Förslag:</p>
        <div className="flex flex-wrap gap-1">
          {allKPIs
            .filter(kpi => kpi.id !== currentKPI.id)
            .filter(kpi => kpi.category === currentKPI.category)
            .slice(0, 3)
            .map((kpi) => (
              <button
                key={kpi.id}
                onClick={() => onSelect(kpi)}
                className="px-2 py-0.5 rounded bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
              >
                {kpi.name}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}
