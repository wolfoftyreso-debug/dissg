/**
 * PUBLIC DASHBOARD - ODIS STRUCTURE
 * 
 * Global Diagnostic Information System - Public Entry Point
 * Strukturmässigt lik VW ODIS / Volvo VIDA diagnostiksystem.
 */

import { useState, useMemo } from 'react';
import { useKPIOverview } from '@/hooks/useKPIData';
import { mockKPIs } from '@/data/mockKPIs';
import { CATEGORIES, KPI } from '@/types/kpi';
import { ODISHeader, ODISTabs, ODISSidebar, ODISTreeView, ODISFooter, type ODISTab, type OperatingMode, type TreeNode } from '@/components/gdis';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { PublicOnboarding } from '@/components/onboarding';
import { SystemFooter } from '@/components/transparency/SystemFooter';

// Tab configuration
const MAIN_TABS: ODISTab[] = [
  { id: 'diagnosis', label: 'Diagnosis', shortLabel: 'Diag' },
  { id: 'areas', label: 'Areas', shortLabel: 'Areas' },
  { id: 'timeline', label: 'Timeline', shortLabel: 'Time' },
  { id: 'help', label: 'Help', shortLabel: 'Help' },
];

// Operating modes configuration
const OPERATING_MODES: OperatingMode[] = [
  { id: 'diagnosis', label: 'Diagnosis', shortLabel: 'Diag' },
  { id: 'index', label: 'Index View', shortLabel: 'Index' },
  { id: 'regional', label: 'Regional', shortLabel: 'Reg' },
  { id: 'info', label: 'Info', shortLabel: 'Info' },
];

// KPI Detail Dialog
interface KPIDetailDialogProps {
  kpi: KPI | null;
  onClose: () => void;
}

function KPIDetailDialog({ kpi, onClose }: KPIDetailDialogProps) {
  if (!kpi) return null;

  const trendPercent = kpi.trendPercent ?? 0;
  const confidence = kpi.confidence ?? 80;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed inset-x-4 top-[10%] z-50 mx-auto max-w-lg rounded-lg border bg-background p-6 shadow-lg sm:inset-x-auto">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="font-mono text-xs">
                  KPI-{kpi.index}
                </Badge>
                <span className={cn(
                  "w-2 h-2 rounded-full",
                  kpi.status === 'positive' && "bg-emerald-500",
                  kpi.status === 'warning' && "bg-amber-500",
                  kpi.status === 'critical' && "bg-red-500",
                  kpi.status === 'neutral' && "bg-muted-foreground"
                )} />
              </div>
              <h2 className="text-lg font-bold">{kpi.name}</h2>
              <p className="text-sm text-muted-foreground">{kpi.description}</p>
            </div>
            <button 
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
            >
              [X]
            </button>
          </div>

          {/* Value */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-xs text-muted-foreground">Värde</div>
                  <div className="font-mono font-medium">{kpi.value.toFixed(1)} {kpi.unit}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Förändring</div>
                  <div className={cn(
                    "font-mono font-medium",
                    trendPercent > 0 && "text-emerald-600",
                    trendPercent < 0 && "text-red-600"
                  )}>
                    {trendPercent > 0 ? '+' : ''}{trendPercent.toFixed(1)}%
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Trend</div>
                  <div className="font-medium">{kpi.trend === 'up' ? 'Uppåt' : kpi.trend === 'down' ? 'Nedåt' : 'Stabil'}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Konfidens</div>
                  <div className="font-mono font-medium">{confidence}%</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rationale */}
          <div className="text-sm">
            <div className="text-xs text-muted-foreground uppercase mb-1">Varför detta spelar roll</div>
            <p>{kpi.rationale || 'Denna indikator påverkar samhällets grundläggande funktioner.'}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={onClose}
              className="flex-1 px-3 py-2 text-sm border rounded-sm hover:bg-muted"
            >
              Stäng
            </button>
            <Link
              to="/login"
              className="flex-1 px-3 py-2 text-sm text-center bg-primary text-primary-foreground rounded-sm hover:bg-primary/90"
            >
              Logga in för mer
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

const PublicDashboard = () => {
  const [activeTab, setActiveTab] = useState('diagnosis');
  const [activeMode, setActiveMode] = useState('diagnosis');
  const [selectedNodeId, setSelectedNodeId] = useState<string | undefined>();
  const [selectedKPI, setSelectedKPI] = useState<KPI | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  const { data: dbKPIs, isLoading } = useKPIOverview();
  
  const kpis = useMemo(() => {
    if (dbKPIs && dbKPIs.length > 0) {
      const hasValues = dbKPIs.some(k => k.value !== 0);
      if (hasValues) {
        return dbKPIs;
      }
    }
    return mockKPIs;
  }, [dbKPIs]);

  // Convert KPIs to tree nodes
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
    const matchingKPI = kpis.find(k => k.id === node.id);
    if (matchingKPI) {
      setSelectedKPI(matchingKPI);
    }
  };

  // System info
  const criticalCount = kpis.filter(k => k.status === 'critical').length;
  const warningCount = kpis.filter(k => k.status === 'warning').length;

  const leftInfo = [
    { label: 'Country', value: 'SE' },
    { label: 'Scope', value: 'PUBLIC' },
    { label: 'Level', value: 'NATIONAL' },
  ];

  const rightInfo = [
    { label: 'VER', value: 'GDIS 1.0.4' },
    { label: 'Coverage', value: `${kpis.length} indicators` },
  ];

  const statusIndicators: Array<{ status: 'ok' | 'warning' | 'error' | 'inactive'; label?: string }> = [
    { status: isLoading ? 'inactive' : 'ok', label: 'Data sync' },
    { status: criticalCount > 0 ? 'error' : warningCount > 0 ? 'warning' : 'ok', label: `${criticalCount} errors` },
    { status: 'inactive', label: 'Auth required' },
  ];

  const footerActions = [
    { id: 'help', label: 'Hur fungerar det?', onClick: () => setShowOnboarding(true) },
    { id: 'login', label: 'Logga in', onClick: () => {}, variant: 'primary' as const },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* ODIS Header */}
      <ODISHeader
        systemName="Global Diagnostic Information System - PUBLIC VIEW"
        leftInfo={leftInfo}
        rightInfo={rightInfo}
        statusIndicators={statusIndicators}
      />

      {/* ODIS Tabs */}
      <ODISTabs
        tabs={MAIN_TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {activeTab === 'diagnosis' && (
            <div className="flex-1 flex flex-col p-3 gap-3 overflow-hidden">
              {/* Status summary */}
              <Card className="shrink-0">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        "w-4 h-4 rounded-sm",
                        criticalCount > 0 ? "bg-red-500" : warningCount > 0 ? "bg-amber-500" : "bg-emerald-500"
                      )} />
                      <div>
                        <div className="font-medium text-sm">
                          {criticalCount > 0 ? 'CRITICAL STATUS' : warningCount > 0 ? 'WARNING STATUS' : 'OK STATUS'}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {criticalCount} critical, {warningCount} warning, {kpis.length - criticalCount - warningCount} ok
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground font-mono">
                      {new Date().toLocaleDateString('sv-SE')}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Tree view */}
              <div className="flex-1 overflow-hidden">
                <ODISTreeView
                  title="Nationell diagnostik - Sverige"
                  subtitle="Indikatorer (sorterade efter status/prioritet)"
                  nodes={treeNodes}
                  onNodeClick={handleNodeClick}
                  selectedNodeId={selectedNodeId}
                />
              </div>
            </div>
          )}

          {activeTab === 'areas' && (
            <div className="flex-1 p-4 overflow-auto">
              <div className="grid gap-4 md:grid-cols-2">
                {CATEGORIES.map(cat => {
                  const catKPIs = kpis.filter(k => k.category === cat.id);
                  const critical = catKPIs.filter(k => k.status === 'critical').length;
                  const warning = catKPIs.filter(k => k.status === 'warning').length;
                  
                  return (
                    <Card key={cat.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <Badge variant="outline" className="font-mono">{cat.code}</Badge>
                          <span className={cn(
                            "w-3 h-3 rounded-sm",
                            critical > 0 ? "bg-red-500" : warning > 0 ? "bg-amber-500" : "bg-emerald-500"
                          )} />
                        </div>
                        <h3 className="font-medium mb-1">{cat.name}</h3>
                        <p className="text-xs text-muted-foreground mb-2">{cat.description}</p>
                        <div className="text-xs text-muted-foreground font-mono">
                          {catKPIs.length} KPIs | {critical} critical | {warning} warning
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="flex-1 p-4 overflow-auto">
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  <div className="font-mono text-sm mb-2">[TIMELINE VIEW]</div>
                  <p className="text-sm">Tidsaxelvy kräver inloggning för fullständig funktionalitet.</p>
                  <Link to="/login" className="text-primary text-sm hover:underline mt-2 inline-block">
                    Logga in
                  </Link>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'help' && (
            <div className="flex-1 p-4 overflow-auto">
              <div className="max-w-xl mx-auto space-y-4">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-2">Vad är GDIS?</h3>
                    <p className="text-sm text-muted-foreground">
                      Global Diagnostic Information System (GDIS) är ett civilisatoriskt diagnostiksystem 
                      som behandlar länder som fordon i en fordonsflotta och indikatorer som sensorer.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-2">Hur läser jag trädvyn?</h3>
                    <p className="text-sm text-muted-foreground">
                      [OK] = Indikatorn är stabil/positiv<br/>
                      [-] = Varning, kräver uppmärksamhet<br/>
                      [X] = Kritisk, kräver åtgärd<br/>
                      [i] = Informativ, neutral status
                    </p>
                  </CardContent>
                </Card>
              </div>
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
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-xs text-muted-foreground hover:text-foreground">
              Intern vy
            </Link>
            <span className="font-mono text-[10px] text-muted-foreground">
              GDIS_SE_PUBLIC_1.0
            </span>
          </div>
        }
      />

      {/* System footer */}
      <SystemFooter />

      {/* KPI Detail Dialog */}
      <KPIDetailDialog kpi={selectedKPI} onClose={() => setSelectedKPI(null)} />

      {/* Onboarding */}
      {showOnboarding && (
        <PublicOnboarding onComplete={() => setShowOnboarding(false)} />
      )}
    </div>
  );
};

export default PublicDashboard;
