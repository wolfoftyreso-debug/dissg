/**
 * ============================================================================
 * DISSG – DIAGNOSTIC INFORMATION SYSTEM FOR SOCIETAL GOVERNANCE
 * ============================================================================
 * 
 * Fullscreen Layout with Minimal Sidebar Navigation
 */

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { mockKPIs } from '@/data/mockKPIs';
import { CATEGORIES, KPI } from '@/types/kpi';
import { ODISTreeView, type TreeNode } from '@/components/gdis';
import { KPIDetailPanel } from '@/components/dashboard/KPIDetailPanel';
import { PrioritizedDashboard } from '@/components/relevance/PrioritizedDashboard';
import { SubscriptionDashboard } from '@/components/dashboard/SubscriptionDashboard';
import { AlertNotificationPanel } from '@/components/dashboard/AlertNotificationPanel';
import { IndexExplorer } from '@/components/indices';
import UniversalResponsibilityMap from '@/components/global/UniversalResponsibilityMap';
import { useKPIOverview } from '@/hooks/useKPIData';
import { MachineReadableHead } from '@/components/seo';
import { useGeo } from '@/contexts/GeoContext';
import { cn } from '@/lib/utils';

// Navigation items for skeleton sidebar
const NAV_ITEMS = [
  { id: 'diagnosis', label: 'Diagnosis', path: '/' },
  { id: 'modules', label: 'Modules', path: '/' },
  { id: 'timeline', label: 'Timeline', path: '/' },
  { id: 'operation', label: 'Operation', path: '/' },
];

const BOTTOM_NAV = [
  { id: 'log', label: 'Log', path: '/log' },
  { id: 'data', label: 'Data', path: '/data' },
  { id: 'extras', label: 'Extras', path: '/extras' },
  { id: 'help', label: 'Help', path: '/help' },
];

const Index = () => {
  const [selectedKPI, setSelectedKPI] = useState<KPI | null>(null);
  const [activeTab, setActiveTab] = useState('diagnosis');
  const [selectedNodeId, setSelectedNodeId] = useState<string | undefined>();
  
  const { scope } = useGeo();
  
  // Try to fetch from database first
  const { data: dbKPIs } = useKPIOverview();
  
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

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-background">
      {/* Machine-readable metadata */}
      <MachineReadableHead
        entityType={scope.level as any}
        entityCode={scope.code}
        dataTimestamp={new Date().toISOString()}
      />

      {/* MINIMAL SKELETON SIDEBAR */}
      <aside className="w-14 flex-shrink-0 bg-card border-r flex flex-col font-mono">
        {/* Logo/System marker */}
        <div className="h-12 flex items-center justify-center border-b text-xs font-bold">
          [D]
        </div>
        
        {/* Main navigation */}
        <nav className="flex-1 py-2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full h-10 flex items-center justify-center text-[10px] transition-colors",
                activeTab === item.id 
                  ? "bg-primary/10 text-primary border-l-2 border-primary" 
                  : "text-muted-foreground hover:bg-muted/50"
              )}
              title={item.label}
            >
              {item.label.slice(0, 4)}
            </button>
          ))}
        </nav>

        {/* Bottom navigation */}
        <nav className="border-t py-2">
          {BOTTOM_NAV.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className="w-full h-10 flex items-center justify-center text-[10px] text-muted-foreground hover:bg-muted/50 transition-colors"
              title={item.label}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT - FULLSCREEN */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* DIAGNOSIS TAB - Tree view with alerts */}
        {activeTab === 'diagnosis' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-3">
              <AlertNotificationPanel />
            </div>
            <div className="flex-1 overflow-hidden px-3 pb-3">
              <ODISTreeView
                title="Diagnostic Tests"
                subtitle="Indicators sorted by priority"
                nodes={treeNodes}
                onNodeClick={handleNodeClick}
                selectedNodeId={selectedNodeId}
              />
            </div>
          </div>
        )}

        {/* MODULES TAB */}
        {activeTab === 'modules' && (
          <div className="flex-1 overflow-auto p-3">
            <SubscriptionDashboard />
          </div>
        )}

        {/* TIMELINE TAB - Index Explorer */}
        {activeTab === 'timeline' && (
          <div className="flex-1 overflow-hidden">
            <IndexExplorer className="h-full" />
          </div>
        )}

        {/* OPERATION TAB - Responsibility map */}
        {activeTab === 'operation' && (
          <div className="flex-1 overflow-auto p-3">
            <UniversalResponsibilityMap />
          </div>
        )}
      </main>

      {/* Detail Panel */}
      {selectedKPI && (
        <>
          <div
            className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm transition-opacity duration-200"
            onClick={() => setSelectedKPI(null)}
            aria-hidden="true"
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
