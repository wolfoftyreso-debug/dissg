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
import { GovRoleDashboard } from '@/components/dashboard/GovRoleDashboard';
import { AlertNotificationPanel } from '@/components/dashboard/AlertNotificationPanel';
import UniversalResponsibilityMap from '@/components/global/UniversalResponsibilityMap';
import { useKPIOverview } from '@/hooks/useKPIData';
import { useGovRole } from '@/hooks/useGovRole';
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
  const { data: govRole } = useGovRole();
  const currentRole = govRole?.role || 'public';
  
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
        {/* Main content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {activeTab === 'diagnosis' && (
            <div className="flex-1 flex flex-col p-3 gap-3 overflow-hidden">
              {/* Alert panel */}
              <AlertNotificationPanel />
              
              {/* Priority dashboard collapsed into tree view */}
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

          {activeTab === 'modules' && (
            <div className="flex-1 p-3 overflow-auto">
              <GovRoleDashboard />
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="flex-1 p-3 overflow-auto">
              <PrioritizedDashboard />
            </div>
          )}

          {activeTab === 'operation' && (
            <div className="flex-1 p-3 overflow-auto">
              <UniversalResponsibilityMap />
            </div>
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
