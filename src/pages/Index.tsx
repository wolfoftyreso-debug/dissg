import { useState, useMemo } from 'react';
import { mockKPIs } from '@/data/mockKPIs';
import { CATEGORIES, KPI } from '@/types/kpi';
import { SystemHeader } from '@/components/dashboard/SystemHeader';
import { CategorySection } from '@/components/dashboard/CategorySection';
import { KPIDetailPanel } from '@/components/dashboard/KPIDetailPanel';

const Index = () => {
  const [selectedKPI, setSelectedKPI] = useState<KPI | null>(null);

  const kpisByCategory = useMemo(() => {
    return CATEGORIES.map(category => ({
      category,
      kpis: mockKPIs.filter(kpi => kpi.category === category.id),
    })).filter(group => group.kpis.length > 0);
  }, []);

  const lastUpdate = new Date().toLocaleString('sv-SE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="min-h-screen bg-background">
      {/* System Header */}
      <SystemHeader kpis={mockKPIs} lastUpdate={lastUpdate} />

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
            NATIONELLT LEDNINGS- OCH BESLUTSSTÖDSYSTEM • VERSION 0.1.0-PROTOTYP
          </p>
          <p className="font-mono text-xs text-muted-foreground">
            KLASSIFICERING: DEMO — EJ VERKLIG DATA
          </p>
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
