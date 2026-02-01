import { useState, useMemo } from 'react';
import { mockKPIs } from '@/data/mockKPIs';
import { CATEGORIES, KPI } from '@/types/kpi';
import { AppHeader } from '@/components/dashboard/AppHeader';
import { BottomNav, NavItem } from '@/components/dashboard/BottomNav';
import { OverviewHeader } from '@/components/dashboard/OverviewHeader';
import { CategorySection } from '@/components/dashboard/CategorySection';
import { KPIDetailPanel } from '@/components/dashboard/KPIDetailPanel';
import { useKPIOverview } from '@/hooks/useKPIData';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const [selectedKPI, setSelectedKPI] = useState<KPI | null>(null);
  const [activeNav, setActiveNav] = useState<NavItem>('overview');
  const [comparisonPeriod, setComparisonPeriod] = useState<'week' | 'month3' | 'month12'>('week');
  
  // Try to fetch from database first
  const { data: dbKPIs, isLoading, error } = useKPIOverview();
  
  // Use database KPIs if available and have values, otherwise fall back to mock
  const kpis = useMemo(() => {
    if (dbKPIs && dbKPIs.length > 0) {
      const hasValues = dbKPIs.some(k => k.value !== 0);
      if (hasValues) {
        return dbKPIs;
      }
    }
    return mockKPIs;
  }, [dbKPIs]);

  const kpisByCategory = useMemo(() => {
    return CATEGORIES.map(category => ({
      category,
      kpis: kpis.filter(kpi => kpi.category === category.id),
    })).filter(group => group.kpis.length > 0);
  }, [kpis]);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* App Header - Discrete */}
      <AppHeader kpis={kpis} role="Statsminister" />

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          <span className="ml-2 text-sm text-muted-foreground">Laddar data...</span>
        </div>
      )}

      {/* Overview Header with period selection */}
      <OverviewHeader 
        kpis={kpis}
        selectedPeriod={comparisonPeriod}
        onPeriodChange={setComparisonPeriod}
      />

      {/* Main Content */}
      <main className="space-y-6 pb-6">
        {kpisByCategory.map(({ category, kpis }, index) => (
          <CategorySection
            key={category.id}
            category={category}
            kpis={kpis}
            onKPIClick={setSelectedKPI}
            defaultExpanded={index < 2} // Expand first two categories by default
          />
        ))}
      </main>

      {/* Bottom Navigation */}
      <BottomNav active={activeNav} onNavigate={setActiveNav} />

      {/* Detail Panel */}
      {selectedKPI && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
            onClick={() => setSelectedKPI(null)}
          />
          {/* Panel */}
          <KPIDetailPanel
            kpi={selectedKPI}
            onClose={() => setSelectedKPI(null)}
          />
        </>
      )}
    </div>
  );
};

export default Index;
