/**
 * ============================================================================
 * DISSG – DIAGNOSTIC INFORMATION SYSTEM FOR SOCIETAL GOVERNANCE
 * ============================================================================
 * 
 * Main Entry Point - "Oscilloscope for Civilization"
 * 
 * Clinical diagnostics for societal governance:
 * - Makes reality measurable, comprehensible, independent of narrative
 * - Treats the world like a vehicle fleet, nations as vehicles, indicators as sensors
 * - Never provides policy recommendations
 */

import { useState, useMemo } from 'react';
import { mockKPIs } from '@/data/mockKPIs';
import { CATEGORIES, KPI } from '@/types/kpi';
import { ODISHeader, ODISTabs, ODISSidebar, ODISTreeView, ODISFooter, type ODISTab, type OperatingMode, type TreeNode } from '@/components/gdis';
import { KPIDetailPanel } from '@/components/dashboard/KPIDetailPanel';
import { PrioritizedDashboard } from '@/components/relevance/PrioritizedDashboard';
import { SubscriptionDashboard } from '@/components/dashboard/SubscriptionDashboard';
import { AlertNotificationPanel } from '@/components/dashboard/AlertNotificationPanel';
import { IndexExplorer } from '@/components/indices';
import UniversalResponsibilityMap from '@/components/global/UniversalResponsibilityMap';
import { useKPIOverview } from '@/hooks/useKPIData';
import { SYSTEM } from '@/config/system';
import { UniversalBreadcrumb } from '@/components/navigation';
import { MachineReadableHead } from '@/components/seo';
import { useGeo } from '@/contexts/GeoContext';

// Tab configuration
const MAIN_TABS: ODISTab[] = [
  { id: 'diagnosis', label: 'Diagnosis', shortLabel: 'Diag' },
  { id: 'modules', label: 'Control modules', shortLabel: 'Modules' },
  { id: 'timeline', label: 'Timeline', shortLabel: 'Time' },
  { id: 'operation', label: 'Operation', shortLabel: 'Oper' },
  { id: 'special', label: 'Special Functions', shortLabel: 'Special', disabled: true },
];

// Operating modes configuration
const OPERATING_MODES: OperatingMode[] = [
  { id: 'diagnosis', label: 'Diagnosis', shortLabel: 'Diag' },
  { id: 'index', label: 'Index View', shortLabel: 'Index' },
  { id: 'simulation', label: 'Simulation', shortLabel: 'Sim', disabled: true },
  { id: 'measurement', label: 'Measurement', shortLabel: 'Meas' },
  { id: 'info', label: 'Info', shortLabel: 'Info' },
  { id: 'admin', label: 'Admin', shortLabel: 'Admin' },
];

const Index = () => {
  const [selectedKPI, setSelectedKPI] = useState<KPI | null>(null);
  const [activeTab, setActiveTab] = useState('diagnosis');
  const [activeMode, setActiveMode] = useState('diagnosis');
  const [selectedNodeId, setSelectedNodeId] = useState<string | undefined>();
  
  const { scope } = useGeo();
  
  // Try to fetch from database first
  const { data: dbKPIs, isLoading } = useKPIOverview();
  
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

  // Convert KPIs to tree nodes for ODIS tree view
  const treeNodes: TreeNode[] = useMemo(() => {
    const categoryNodes: TreeNode[] = CATEGORIES.map(category => {
      const categoryKPIs = kpis.filter(kpi => kpi.category === category.id);
      const hasErrors = categoryKPIs.some(k => k.status === 'critical');
      const hasWarnings = categoryKPIs.some(k => k.status === 'warning');
      
      const nodeStatus: TreeNode['status'] = hasErrors ? 'error' : hasWarnings ? 'warning' : 'ok';
      
      const children: TreeNode[] = categoryKPIs.map(kpi => {
        const childStatus: TreeNode['status'] = 
          kpi.status === 'critical' ? 'error' : 
          kpi.status === 'warning' ? 'warning' : 
          kpi.status === 'positive' ? 'ok' : 'info';
        
        return {
          id: kpi.id,
          label: kpi.name,
          code: `KPI-${kpi.index}`,
          status: childStatus,
          details: `${kpi.value}${kpi.unit} | ${kpi.trendPercent >= 0 ? '+' : ''}${kpi.trendPercent}%`,
        };
      });
      
      return {
        id: category.id,
        label: category.name,
        code: category.code,
        status: nodeStatus,
        details: `${categoryKPIs.length} indicators monitored`,
        children,
      };
    }).filter(cat => cat.children && cat.children.length > 0);

    return categoryNodes;
  }, [kpis]);

  const handleNodeClick = (node: TreeNode) => {
    setSelectedNodeId(node.id);
    // Find matching KPI
    const matchingKPI = kpis.find(k => k.id === node.id);
    if (matchingKPI) {
      setSelectedKPI(matchingKPI);
    }
  };

  // System info for header
  const criticalCount = kpis.filter(k => k.status === 'critical').length;
  const warningCount = kpis.filter(k => k.status === 'warning').length;

  const rightInfo = [
    { label: 'VER', value: `${SYSTEM.name} ${SYSTEM.version}` },
    { label: 'Coverage', value: `${kpis.length} indicators` },
  ];

  const statusIndicators: Array<{ status: 'ok' | 'warning' | 'error' | 'inactive'; label?: string }> = [
    { 
      status: isLoading ? 'inactive' : 'ok', 
      label: 'Data sync' 
    },
    { 
      status: criticalCount > 0 ? 'error' : warningCount > 0 ? 'warning' : 'ok', 
      label: `${criticalCount} critical, ${warningCount} warnings` 
    },
    { 
      status: 'inactive', 
      label: 'Simulation (PRO)' 
    },
  ];

  const footerActions = [
    { id: 'run', label: 'Run test...', onClick: () => {}, variant: 'default' as const },
    { id: 'documents', label: 'Documents', onClick: () => {} },
    { id: 'export', label: 'Export', onClick: () => {} },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Machine-readable metadata */}
      <MachineReadableHead
        entityType={scope.level as any}
        entityCode={scope.code}
        dataTimestamp={new Date().toISOString()}
      />

      {/* ODIS Header */}
      <ODISHeader
        rightInfo={rightInfo}
        statusIndicators={statusIndicators}
      />

      {/* Universal Breadcrumb - ALWAYS VISIBLE */}
      <UniversalBreadcrumb showDataTier variant="full" />

      {/* ODIS Tabs */}
      <ODISTabs
        tabs={MAIN_TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main content area with sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main content - respects both tabs and modes */}
        <main className="flex-1 flex flex-col overflow-hidden">
          
          {/* INDEX MODE - Full screen Index Explorer (overrides tabs) */}
          {activeMode === 'index' ? (
            <div className="flex-1 overflow-hidden">
              <IndexExplorer />
            </div>
          ) : (
            <>
              {/* DIAGNOSIS TAB - Tree view with alerts */}
              {activeTab === 'diagnosis' && (
                <div className="flex-1 flex flex-col p-3 gap-3 overflow-hidden">
                  <AlertNotificationPanel />
                  <div className="flex-1 overflow-hidden">
                    <ODISTreeView
                      title="Tests in current diagnostic plan"
                      subtitle="Indicators (sorted according to priority/status)"
                      nodes={treeNodes}
                      onNodeClick={handleNodeClick}
                      selectedNodeId={selectedNodeId}
                    />
                  </div>
                </div>
              )}

              {/* CONTROL MODULES TAB - Subscription/System modules */}
              {activeTab === 'modules' && (
                <div className="flex-1 p-3 overflow-auto">
                  <SubscriptionDashboard />
                </div>
              )}

              {/* TIMELINE TAB - Prioritized dashboard with trends */}
              {activeTab === 'timeline' && (
                <div className="flex-1 p-3 overflow-auto">
                  <PrioritizedDashboard />
                </div>
              )}

              {/* OPERATION TAB - Responsibility map */}
              {activeTab === 'operation' && (
                <div className="flex-1 p-3 overflow-auto">
                  <UniversalResponsibilityMap />
                </div>
              )}

              {/* Contextual overlays based on active mode */}
              {activeMode === 'info' && (
                <div className="absolute inset-0 bg-background/95 flex items-center justify-center z-10">
                  <div className="text-center font-mono space-y-4 max-w-lg p-8 bg-card border rounded-lg shadow-lg">
                    <div className="text-4xl">[INFO]</div>
                    <h2 className="text-xl font-bold">{SYSTEM.name} v{SYSTEM.version}</h2>
                    <p className="text-muted-foreground text-sm">
                      Diagnostic Information System for Societal Governance. 
                      Klinisk diagnostik för samhällsstyrning.
                    </p>
                    <div className="text-xs text-muted-foreground border-t pt-4 mt-4 space-y-1">
                      <div>[DATA] {kpis.length} indikatorer</div>
                      <div>[GEO] {scope.level.toUpperCase()}: {scope.code}</div>
                      <div>[STATUS] {criticalCount} kritiska, {warningCount} varningar</div>
                      <div>[FLIK] Aktiv: {activeTab}</div>
                    </div>
                    <button 
                      onClick={() => setActiveMode('diagnosis')}
                      className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded text-sm font-mono"
                    >
                      [X] Stäng
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </main>

        {/* Right sidebar - hidden on mobile */}
        <div className="hidden md:flex">
          <ODISSidebar
            modes={OPERATING_MODES}
            activeMode={activeMode}
            onModeChange={setActiveMode}
          />
        </div>
      </div>

      {/* ODIS Footer */}
      <ODISFooter
        actions={footerActions}
        rightContent={
          <span className="font-mono text-[10px] text-muted-foreground">
            {SYSTEM.name}_SE_NATIONAL_{SYSTEM.version}@2025
          </span>
        }
      />

      {/* Detail Panel */}
      {selectedKPI && (
        <>
          <div
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
            onClick={() => setSelectedKPI(null)}
          />
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
