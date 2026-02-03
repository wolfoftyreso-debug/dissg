import { useState, useMemo } from 'react';
import { mockKPIs } from '@/data/mockKPIs';
import { CATEGORIES, KPI } from '@/types/kpi';
import { AppHeader } from '@/components/dashboard/AppHeader';
import { BottomNav, NavItem } from '@/components/dashboard/BottomNav';
import { OverviewHeader } from '@/components/dashboard/OverviewHeader';
import { CategorySection } from '@/components/dashboard/CategorySection';
import { KPIDetailPanel } from '@/components/dashboard/KPIDetailPanel';
import { IndicatorsPanel } from '@/components/dashboard/IndicatorsPanel';
import { DecisionsTimelinePanel } from '@/components/dashboard/DecisionsTimelinePanel';

import { AnalysisPanel } from '@/components/dashboard/AnalysisPanel';
import { RoleBasedDashboard } from '@/components/dashboard/RoleBasedDashboard';
import { GovRoleDashboard } from '@/components/dashboard/GovRoleDashboard';
import { AlertNotificationPanel } from '@/components/dashboard/AlertNotificationPanel';
import { PrioritizedDashboard } from '@/components/relevance/PrioritizedDashboard';
import { SwedenResponsibilityMap } from '@/components/responsibility/SwedenResponsibilityMap';
import { useKPIOverview } from '@/hooks/useKPIData';
import { useGovRole } from '@/hooks/useGovRole';
import { getRoleConfig } from '@/config/roleViewConfig';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  const [selectedKPI, setSelectedKPI] = useState<KPI | null>(null);
  const [activeNav, setActiveNav] = useState<NavItem>('priority');
  const [comparisonPeriod, setComparisonPeriod] = useState<'week' | 'month3' | 'month12'>('week');
  const [viewMode, setViewMode] = useState<'standard' | 'role'>('role');
  
  const { data: govRole } = useGovRole();
  const currentRole = govRole?.role || 'public';
  const roleConfig = getRoleConfig(currentRole);
  
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
      <AppHeader kpis={kpis} role={roleConfig.displayName} />

      {/* View Mode Tabs */}
      <div className="px-4 py-2 border-b">
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'standard' | 'role')}>
          <TabsList className="grid w-full grid-cols-2 max-w-xs">
            <TabsTrigger value="role">Rollbaserad vy</TabsTrigger>
            <TabsTrigger value="standard">Standardvy</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

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
        onKPIClick={setSelectedKPI}
      />

      {/* Main Content */}
      <main className="space-y-6 pb-6 px-4">
        {/* Alert Notification Panel */}
        <AlertNotificationPanel />

        {viewMode === 'role' ? (
          <>
            <GovRoleDashboard />
            <RoleBasedDashboard kpis={kpis} onKPIClick={setSelectedKPI} />
          </>
        ) : (
          <>
            {activeNav === 'priority' && (
              <PrioritizedDashboard />
            )}

            {activeNav === 'overview' && kpisByCategory.map(({ category, kpis }, index) => (
              <CategorySection
                key={category.id}
                category={category}
                kpis={kpis}
                onKPIClick={setSelectedKPI}
                defaultExpanded={index < 2}
              />
            ))}
            
            {activeNav === 'decisions' && (
              <DecisionsTimelinePanel />
            )}
            
            {activeNav === 'indicators' && (
              <IndicatorsPanel kpis={kpis} onKPIClick={setSelectedKPI} />
            )}
            
            {activeNav === 'responsibility' && (
              <SwedenResponsibilityMap />
            )}
            
            {activeNav === 'analysis' && (
              <AnalysisPanel kpis={kpis} />
            )}
          </>
        )}
      </main>

      {/* Bottom Navigation - only show in standard mode */}
      {viewMode === 'standard' && (
        <BottomNav active={activeNav} onNavigate={setActiveNav} />
      )}

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
