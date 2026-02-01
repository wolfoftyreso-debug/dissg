import { useState, useMemo } from 'react';
import { mockKPIs } from '@/data/mockKPIs';
import { CATEGORIES, KPI } from '@/types/kpi';
import { SystemHeader } from '@/components/dashboard/SystemHeader';
import { CategorySection } from '@/components/dashboard/CategorySection';
import { KPIDetailPanel } from '@/components/dashboard/KPIDetailPanel';
import { useKPIOverview } from '@/hooks/useKPIData';
import { Loader2, Database, AlertCircle } from 'lucide-react';

const Index = () => {
  const [selectedKPI, setSelectedKPI] = useState<KPI | null>(null);
  
  // Try to fetch from database first
  const { data: dbKPIs, isLoading, error } = useKPIOverview();
  
  // Use database KPIs if available and have values, otherwise fall back to mock
  const kpis = useMemo(() => {
    if (dbKPIs && dbKPIs.length > 0) {
      // Check if any KPIs have actual values (not just definitions)
      const hasValues = dbKPIs.some(k => k.value !== 0);
      if (hasValues) {
        return dbKPIs;
      }
    }
    // Fall back to mock data
    return mockKPIs;
  }, [dbKPIs]);

  const kpisByCategory = useMemo(() => {
    return CATEGORIES.map(category => ({
      category,
      kpis: kpis.filter(kpi => kpi.category === category.id),
    })).filter(group => group.kpis.length > 0);
  }, [kpis]);

  const lastUpdate = new Date().toLocaleString('sv-SE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

  const isUsingMockData = !dbKPIs || dbKPIs.length === 0 || !dbKPIs.some(k => k.value !== 0);

  return (
    <div className="min-h-screen bg-background">
      {/* System Header */}
      <SystemHeader kpis={kpis} lastUpdate={lastUpdate} />

      {/* Data Source Indicator */}
      {isUsingMockData && (
        <div className="border-b border-border bg-status-warning/5 px-6 py-2">
          <div className="mx-auto flex max-w-7xl items-center gap-2 text-status-warning">
            <Database className="h-4 w-4" />
            <span className="font-mono text-xs uppercase">
              Demo-läge: Visar simulerad data. Anslut till riktiga datakällor för live-data.
            </span>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-sm text-muted-foreground">Laddar data...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="mx-6 mt-6 rounded border border-status-critical/30 bg-status-critical/5 p-4">
          <div className="flex items-center gap-2 text-status-critical">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">Kunde inte ladda data från databasen. Visar demo-data.</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="p-6">
        <div className="mx-auto max-w-7xl space-y-8">
          {kpisByCategory.map(({ category, kpis }) => (
            <CategorySection
              key={category.id}
              category={category}
              kpis={kpis}
              onKPIClick={setSelectedKPI}
            />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <p className="font-mono text-xs text-muted-foreground">
            NATIONELLT LEDNINGS- OCH BESLUTSSTÖDSYSTEM • VERSION 0.2.0
          </p>
          <div className="flex items-center gap-4">
            {isUsingMockData ? (
              <p className="font-mono text-xs text-status-warning">
                KLASSIFICERING: DEMO — SIMULERAD DATA
              </p>
            ) : (
              <p className="font-mono text-xs text-status-positive">
                KLASSIFICERING: OPERATIV — LIVE DATA
              </p>
            )}
          </div>
        </div>
      </footer>

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
