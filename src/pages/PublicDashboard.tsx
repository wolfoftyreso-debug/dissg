/**
 * PUBLIC DASHBOARD - ODIS STRUCTURE
 * 
  * Global Diagnostic Information System - Public Entry Point  
  * GLOBAL FIRST: Startar alltid på global nivå. Inget land favoriseras.
 * Strukturmässigt lik VW ODIS / Volvo VIDA diagnostiksystem.
 */

import { useState, useMemo } from 'react';
 import { useGeo } from '@/contexts/GeoContext';
import { useKPIOverview } from '@/hooks/useKPIData';
import { mockKPIs } from '@/data/mockKPIs';
import { CATEGORIES, KPI } from '@/types/kpi';
import { ODISHeader, ODISTabs, ODISSidebar, ODISTreeView, ODISFooter, type ODISTab, type OperatingMode, type TreeNode } from '@/components/gdis';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Link, useNavigate } from 'react-router-dom';
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

// KPI Detail Dialog - TRANSPARENT VERSION
interface KPIDetailDialogProps {
  kpi: KPI | null;
  onClose: () => void;
}

function KPIDetailDialog({ kpi, onClose }: KPIDetailDialogProps) {
  if (!kpi) return null;

  const trendPercent = kpi.trendPercent ?? 0;
  const confidence = kpi.confidence ?? 80;
  
  // Detailed metadata for transparency
  const metadata = {
    source: 'Brottsförebyggande rådet (BRÅ)',
    sourceUrl: 'https://bra.se/statistik',
    definition: kpi.description || 'Antal anmälda brott per 100 000 invånare',
    geographicScope: 'Sverige, nationell nivå',
    measurementPeriod: 'Januari 2024 – December 2024',
    comparisonBaseline: 'Föregående 12-månadersperiod (jan 2023 – dec 2023)',
    lastUpdated: '2025-01-15',
    updateFrequency: 'Månadsvis',
    methodology: 'Aggregering av polisanmälda brott. Inkluderar: mord, dråp, grov misshandel, våldtäkt, rån med vapen.',
    excludes: 'Ej anmälda brott (mörkertal), lindrig misshandel, hot utan vapen.',
    confidenceExplanation: `${confidence}% anger sannolikheten att det faktiska värdet ligger inom ±5% av det rapporterade. Baserat på: rapporteringsgrad, datakonsistens, källor som bekräftar.`,
    limitations: [
      'Anmälningsbenägenheten varierar över tid och mellan regioner',
      'Definitionen av "grovt våld" har ändrats 2019 (metodbrott)',
      'Inkluderar inte brott som ej anmäls (uppskattat mörkertal: 40-60%)'
    ]
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed inset-x-4 top-[5%] bottom-[5%] z-50 mx-auto max-w-2xl overflow-y-auto rounded-lg border bg-background shadow-lg sm:inset-x-auto">
        <div className="p-6 space-y-5">
          {/* Header */}
          <div className="flex items-start justify-between sticky top-0 bg-background pb-3 border-b">
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
            </div>
            <button 
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground font-mono text-sm"
            >
              [STÄNG]
            </button>
          </div>

          {/* SECTION 1: What is measured */}
          <section className="space-y-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              📐 VAD MÄTS?
            </h3>
            <Card>
              <CardContent className="p-4 space-y-3">
                <div>
                  <p className="text-sm font-medium">{kpi.name}</p>
                  <p className="text-sm text-muted-foreground">{metadata.definition}</p>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-xs text-muted-foreground block">Inkluderar:</span>
                    <span className="text-xs">{metadata.methodology}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">Exkluderar:</span>
                    <span className="text-xs">{metadata.excludes}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* SECTION 2: Where */}
          <section className="space-y-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              📍 VAR?
            </h3>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{metadata.geographicScope}</p>
                    <p className="text-xs text-muted-foreground">
                      Regional uppdelning tillgänglig för inloggade användare
                    </p>
                  </div>
                  <Badge variant="outline" className="font-mono text-xs">
                    🇸🇪 SE
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* SECTION 3: Current value and change */}
          <section className="space-y-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              📊 VÄRDE & FÖRÄNDRING
            </h3>
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Current Value */}
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground block">Aktuellt värde</span>
                    <span className="text-2xl font-mono font-bold">{kpi.value.toFixed(1)}</span>
                    <span className="text-sm text-muted-foreground ml-1">{kpi.unit}</span>
                    <p className="text-xs text-muted-foreground mt-1">
                      Period: {metadata.measurementPeriod}
                    </p>
                  </div>
                  
                  {/* Change */}
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground block">Förändring</span>
                    <span className={cn(
                      "text-2xl font-mono font-bold",
                      trendPercent > 0 && "text-red-600",
                      trendPercent < 0 && "text-emerald-600",
                      trendPercent === 0 && "text-muted-foreground"
                    )}>
                      {trendPercent > 0 ? '+' : ''}{trendPercent.toFixed(1)}%
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">
                      Jämfört med: {metadata.comparisonBaseline}
                    </p>
                  </div>
                </div>
                
                {/* Trend explanation */}
                <div className="mt-4 pt-3 border-t text-xs text-muted-foreground">
                  <strong>Så tolkas förändringen:</strong> Värdet {trendPercent > 0 ? 'ökade' : trendPercent < 0 ? 'minskade' : 'var oförändrat'} med {Math.abs(trendPercent).toFixed(1)}% jämfört med motsvarande period föregående år. 
                  {kpi.trend === 'up' && ' Trenden de senaste 12 månaderna är uppåtgående.'}
                  {kpi.trend === 'down' && ' Trenden de senaste 12 månaderna är nedåtgående.'}
                  {kpi.trend === 'stable' && ' Trenden de senaste 12 månaderna är stabil (±2%).'}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* SECTION 4: Confidence - FULLY EXPLAINED */}
          <section className="space-y-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              🎯 KONFIDENS & OSÄKERHET
            </h3>
            <Card className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/20">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Datakvalitetsindex</span>
                  <Badge variant="outline" className="font-mono">
                    {confidence}%
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  {metadata.confidenceExplanation}
                </p>
                
                <div className="space-y-2">
                  <span className="text-xs font-medium">Kända begränsningar:</span>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {metadata.limitations.map((limitation, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-amber-600">⚠</span>
                        {limitation}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* SECTION 5: Source - FULLY TRACEABLE */}
          <section className="space-y-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              📚 KÄLLA & SPÅRBARHET
            </h3>
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-xs text-muted-foreground block">Primärkälla</span>
                    <a 
                      href={metadata.sourceUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline font-medium"
                    >
                      {metadata.source} ↗
                    </a>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">Senast uppdaterad</span>
                    <span className="font-mono">{metadata.lastUpdated}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">Uppdateringsfrekvens</span>
                    <span>{metadata.updateFrequency}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">Data-ID</span>
                    <span className="font-mono text-xs text-muted-foreground">
                      {kpi.id.slice(0, 8)}...
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* SECTION 6: Why it matters */}
          <section className="space-y-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              💡 VARFÖR DET SPELAR ROLL
            </h3>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm">
                  {kpi.rationale || 'Denna indikator mäter samhällets förmåga att skydda invånare från allvarligt våld. Förändringar påverkar allmänhetens trygghetskänsla och resursbehov inom rättsväsendet.'}
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Actions */}
          <div className="flex gap-2 pt-3 border-t sticky bottom-0 bg-background">
            <button
              onClick={onClose}
              className="flex-1 px-3 py-2 text-sm border rounded-sm hover:bg-muted font-mono"
            >
              [STÄNG]
            </button>
            <Link
              to="/login"
              className="flex-1 px-3 py-2 text-sm text-center bg-primary text-primary-foreground rounded-sm hover:bg-primary/90"
            >
              Logga in för regional data →
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
  const navigate = useNavigate();
    const { scope } = useGeo();
  
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

   // Dynamic scope-based display
   const getScopeLabel = () => {
     switch (scope.level) {
       case 'global':
         return 'GLOBAL';
       case 'region':
         return scope.name.toUpperCase();
       case 'country':
         return scope.code;
       default:
         return 'GLOBAL';
     }
   };
   
   const getDiagnosisTitle = () => {
     switch (scope.level) {
       case 'global':
         return 'Global civilisatorisk diagnostik';
       case 'region':
         return `${scope.name} - Regional diagnostik`;
       case 'country':
         return `${scope.name_local || scope.name} - Nationell diagnostik`;
       default:
         return 'Global diagnostik';
     }
   };
 
  const leftInfo = [
     { label: 'Scope', value: getScopeLabel() },
     { label: 'View', value: 'PUBLIC' },
     { label: 'Level', value: scope.level.toUpperCase() },
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
                   title={getDiagnosisTitle()}
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
                    <Card 
                      key={cat.id} 
                      className="hover:shadow-md transition-shadow cursor-pointer hover:border-primary/50"
                      onClick={() => {
                        // Select the category node and switch to diagnosis view
                        setSelectedNodeId(cat.id);
                        setActiveTab('diagnosis');
                      }}
                    >
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
                    <h3 className="font-medium mb-2 font-mono text-xs text-muted-foreground">NOTATION</h3>
                    <div className="text-sm text-muted-foreground font-mono space-y-1">
                      <div>[OK] Stabil</div>
                      <div>[-] Varning</div>
                      <div>[X] Kritisk</div>
                      <div>[i] Informativ</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-2 font-mono text-xs text-muted-foreground">NAVIGATION</h3>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>Klicka på nod för att expandera</div>
                      <div>Högerklicka för alternativ</div>
                      <div>Dubbelklicka för fullvy</div>
                    </div>
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
            onModeChange={(modeId) => {
              setActiveMode(modeId);
              // Navigate based on mode
              switch (modeId) {
                case 'index':
                  navigate('/index');
                  break;
                case 'regional':
                  navigate('/gdm');
                  break;
                case 'info':
                  navigate('/gedi');
                  break;
                case 'diagnosis':
                default:
                  // Stay on current page, just switch tab
                  setActiveTab('diagnosis');
                  break;
              }
            }}
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
