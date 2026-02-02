import { useState, useMemo } from 'react';
import { useKPIOverview } from '@/hooks/useKPIData';
import { mockKPIs } from '@/data/mockKPIs';
import { cn } from '@/lib/utils';
import { 
  TrendingUp, TrendingDown, Minus, ChevronRight, Info, Shield, 
  ChevronDown, ExternalLink, ArrowLeft, BarChart3, Eye, Database,
  HelpCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Link } from 'react-router-dom';
import { PublicOnboarding } from '@/components/onboarding';

// Category groupings with human-readable names and descriptions
const AREA_GROUPS = [
  {
    id: 'halsa_liv',
    name: 'Hälsa & Liv',
    description: 'Påverkar din och dina närståendes hälsa',
    categories: ['demografi_halsa'],
  },
  {
    id: 'arbete_ekonomi', 
    name: 'Arbete & Ekonomi',
    description: 'Påverkar jobb och levnadsstandard',
    categories: ['arbete_produktivitet', 'ekonomisk_barkraft'],
  },
  {
    id: 'trygghet_stabilitet',
    name: 'Trygghet & Stabilitet', 
    description: 'Påverkar din vardag och säkerhet',
    categories: ['social_stabilitet'],
  },
  {
    id: 'karnfunktioner',
    name: 'Kärnfunktioner',
    description: 'Påverkar samhällets grundläggande funktioner',
    categories: ['karnsystem_funktion'],
  },
  {
    id: 'infrastruktur_framtid',
    name: 'Infrastruktur & Framtid',
    description: 'Påverkar Sveriges långsiktiga förmåga',
    categories: ['infrastruktur', 'systemrisk_styrning'],
  },
];

type ViewState = 'overview' | 'area' | 'detail';

interface SelectedArea {
  group: typeof AREA_GROUPS[0];
  kpis: typeof mockKPIs;
}

interface SelectedKPI {
  kpi: typeof mockKPIs[0];
  showWhy: boolean;
  showHow: boolean;
}

function NationalStatusBadge({ status, summary }: { 
  status: 'positive' | 'warning' | 'critical'; 
  summary: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 animate-fade-in">
      <div className={cn(
        "w-28 h-28 rounded-full flex items-center justify-center mb-4 transition-all duration-500",
        "ring-4 ring-offset-4 ring-offset-background",
        status === 'positive' && "ring-status-positive/30 bg-status-positive/10",
        status === 'warning' && "ring-status-warning/30 bg-status-warning/10",
        status === 'critical' && "ring-status-critical/30 bg-status-critical/10"
      )}>
        <div className={cn(
          "w-16 h-16 rounded-full transition-colors",
          status === 'positive' && "bg-status-positive",
          status === 'warning' && "bg-status-warning",
          status === 'critical' && "bg-status-critical"
        )} />
      </div>
      <h2 className={cn(
        "text-xl font-bold uppercase tracking-wide",
        status === 'positive' && "text-status-positive",
        status === 'warning' && "text-status-warning",
        status === 'critical' && "text-status-critical"
      )}>
        {status === 'positive' && 'Sverige förbättras'}
        {status === 'warning' && 'Stabilt men med risker'}
        {status === 'critical' && 'Sverige försämras'}
      </h2>
      <p className="text-muted-foreground text-center mt-3 max-w-md text-sm">
        {summary}
      </p>
      <p className="text-xs text-muted-foreground mt-4">
        Uppdaterad: {new Date().toLocaleDateString('sv-SE')}
      </p>
    </div>
  );
}

function AreaCard({ 
  group, 
  kpis, 
  onClick 
}: { 
  group: typeof AREA_GROUPS[0]; 
  kpis: typeof mockKPIs;
  onClick: () => void;
}) {
  const criticalCount = kpis.filter(k => k.status === 'critical').length;
  const warningCount = kpis.filter(k => k.status === 'warning').length;
  
  const status = criticalCount > 0 ? 'critical' : warningCount > 0 ? 'warning' : 'positive';

  return (
    <Card 
      className="group cursor-pointer hover:shadow-md transition-all hover-scale"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className={cn(
            "w-3 h-3 rounded-full shrink-0 mt-1",
            status === 'positive' && "bg-emerald-500",
            status === 'warning' && "bg-amber-500",
            status === 'critical' && "bg-red-500"
          )} />
          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
        </div>
        
        <h3 className="font-semibold text-base mb-1">{group.name}</h3>
        <p className="text-xs text-muted-foreground mb-3">{group.description}</p>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{kpis.length} indikatorer</span>
          {criticalCount > 0 && (
            <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
              {criticalCount} kritisk
            </Badge>
          )}
          {warningCount > 0 && criticalCount === 0 && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-amber-500 text-amber-600">
              {warningCount} varning
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function AreaDetailView({ 
  area, 
  onBack,
  onKPISelect
}: { 
  area: SelectedArea; 
  onBack: () => void;
  onKPISelect: (kpi: typeof mockKPIs[0]) => void;
}) {
  const criticalKpis = area.kpis.filter(k => k.status === 'critical');
  const warningKpis = area.kpis.filter(k => k.status === 'warning');

  return (
    <div className="animate-fade-in">
      <button 
        onClick={onBack}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Tillbaka till översikt
      </button>

      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-1">{area.group.name}</h2>
        <p className="text-muted-foreground">{area.group.description}</p>
      </div>

      {/* Summary */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <h3 className="font-medium mb-2">Vad ser vi?</h3>
          <p className="text-sm text-muted-foreground">
            {criticalKpis.length > 0 
              ? `Detta område har ${criticalKpis.length} kritiska indikatorer som kräver omedelbar uppmärksamhet.`
              : warningKpis.length > 0
                ? `Detta område är stabilt men ${warningKpis.length} indikatorer visar varning.`
                : 'Detta område utvecklas positivt. Alla indikatorer är stabila.'
            }
          </p>
        </CardContent>
      </Card>

      {/* KPI List */}
      <div className="space-y-3">
        {area.kpis.map(kpi => {
          const TrendIcon = kpi.trend === 'up' ? TrendingUp : kpi.trend === 'down' ? TrendingDown : Minus;
          const trendPercent = kpi.trendPercent ?? 0;
          
          return (
            <Card 
              key={kpi.id} 
              className="cursor-pointer hover:shadow-sm transition-shadow"
              onClick={() => onKPISelect(kpi)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className={cn(
                        "w-2 h-2 rounded-full shrink-0",
                        kpi.status === 'positive' && "bg-emerald-500",
                        kpi.status === 'warning' && "bg-amber-500",
                        kpi.status === 'critical' && "bg-red-500",
                        kpi.status === 'neutral' && "bg-muted-foreground"
                      )} />
                      <h4 className="font-medium text-sm">{kpi.name}</h4>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1 ml-4">
                      {kpi.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {kpi.value.toFixed(1)} {kpi.unit}
                      </div>
                      <div className="flex items-center gap-1 justify-end">
                        <TrendIcon className={cn(
                          "h-3 w-3",
                          kpi.trend === 'up' && "text-emerald-500",
                          kpi.trend === 'down' && "text-red-500",
                          kpi.trend === 'stable' && "text-muted-foreground"
                        )} />
                        <span className="text-xs text-muted-foreground">
                          {trendPercent !== 0 ? `${trendPercent > 0 ? '+' : ''}${trendPercent.toFixed(1)}%` : 'Stabil'}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function KPIDetailView({ 
  selected, 
  onBack,
  onToggleWhy,
  onToggleHow
}: { 
  selected: SelectedKPI; 
  onBack: () => void;
  onToggleWhy: () => void;
  onToggleHow: () => void;
}) {
  const { kpi, showWhy, showHow } = selected;
  const trendPercent = kpi.trendPercent ?? 0;
  const confidence = kpi.confidence ?? 80;

  const confidenceText = confidence > 90 
    ? "Datat är starkt och pålitligt."
    : confidence > 70 
      ? "Datat är tillförlitligt men med viss osäkerhet."
      : confidence > 50
        ? "Datat är indikativt, tolka med försiktighet."
        : "Preliminära siffror, stor osäkerhet.";

  return (
    <div className="animate-fade-in">
      <button 
        onClick={onBack}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Tillbaka
      </button>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className={cn(
            "w-3 h-3 rounded-full",
            kpi.status === 'positive' && "bg-emerald-500",
            kpi.status === 'warning' && "bg-amber-500",
            kpi.status === 'critical' && "bg-red-500",
            kpi.status === 'neutral' && "bg-muted-foreground"
          )} />
          <Badge variant="outline" className="text-xs">
            {kpi.value.toFixed(1)} {kpi.unit}
          </Badge>
        </div>
        <h2 className="text-2xl font-bold mb-1">{kpi.name}</h2>
        <p className="text-muted-foreground text-sm">{kpi.description}</p>
      </div>

      {/* Trend visualization placeholder */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="h-32 bg-muted/50 rounded-lg flex items-center justify-center mb-4">
            <BarChart3 className="h-8 w-8 text-muted-foreground" />
            <span className="ml-2 text-sm text-muted-foreground">Tidslinje visas här</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Trend senaste 12 månader</span>
            <span className={cn(
              "font-medium",
              trendPercent > 0 && "text-emerald-600",
              trendPercent < 0 && "text-red-600",
              trendPercent === 0 && "text-muted-foreground"
            )}>
              {trendPercent !== 0 ? `${trendPercent > 0 ? '+' : ''}${trendPercent.toFixed(1)}%` : 'Ingen förändring'}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Three questions */}
      <div className="space-y-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Vad ser vi?</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground">
              {kpi.status === 'critical' 
                ? `Denna indikator har försämrats betydligt och befinner sig på kritisk nivå.`
                : kpi.status === 'warning'
                  ? `Denna indikator visar tecken på försämring och kräver uppmärksamhet.`
                  : `Denna indikator utvecklas stabilt eller positivt.`
              }
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Vad betyder det för dig?</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground">
              {kpi.rationale || `Denna indikator påverkar samhällets grundläggande funktioner och din vardag.`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Hur säkra är vi?</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground">{confidenceText}</p>
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all"
                  style={{ width: `${confidence}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground">{confidence}%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Expandable sections */}
      <div className="space-y-3">
        <Collapsible open={showWhy} onOpenChange={onToggleWhy}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <span className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Visa varför detta händer
              </span>
              <ChevronDown className={cn("h-4 w-4 transition-transform", showWhy && "rotate-180")} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3">
            <Card>
              <CardContent className="p-4 space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Bidragande faktorer</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-3/4" />
                      </div>
                      <span className="text-xs w-20">Stark ↑</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Demografisk förändring</p>
                    
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-muted-foreground w-1/2" />
                      </div>
                      <span className="text-xs w-20">Neutral →</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Ekonomisk konjunktur</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Klicka på en faktor för att se hur den beräknats.
                </p>
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible open={showHow} onOpenChange={onToggleHow}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <span className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                Visa hur detta analyserats
              </span>
              <ChevronDown className={cn("h-4 w-4 transition-transform", showHow && "rotate-180")} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3">
            <Card>
              <CardContent className="p-4 space-y-4">
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground uppercase mb-1">Metod</h4>
                  <p className="text-sm">Trendanalys med 12 månaders glidande medelvärde.</p>
                </div>
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground uppercase mb-1">Datapunkter</h4>
                  <p className="text-sm">Baserat på 156 månadsvärden (2011-01 till 2024-01).</p>
                </div>
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground uppercase mb-1">Källor</h4>
                  <p className="text-sm">SCB, Socialstyrelsen, Arbetsförmedlingen</p>
                </div>
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground uppercase mb-1">Osäkerhet</h4>
                  <p className="text-sm">±1,2 procentenheter (95% konfidensintervall)</p>
                </div>
                <Button variant="link" className="px-0 h-auto text-xs" asChild>
                  <a href="https://www.scb.se" target="_blank" rel="noopener noreferrer">
                    Visa originaldata hos SCB <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Responsibility */}
      <Card className="mt-6">
        <CardContent className="p-4">
          <h4 className="text-xs font-medium text-muted-foreground uppercase mb-2">Ansvarsområde</h4>
          <p className="text-sm font-medium">Nationell nivå</p>
          <p className="text-sm text-muted-foreground">Berört departement med uppföljningsansvar</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PublicDashboard() {
  const { data: dbKPIs, isLoading } = useKPIOverview();
  const [view, setView] = useState<ViewState>('overview');
  const [selectedArea, setSelectedArea] = useState<SelectedArea | null>(null);
  const [selectedKPI, setSelectedKPI] = useState<SelectedKPI | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  const kpis = useMemo(() => {
    if (dbKPIs && dbKPIs.length > 0) {
      const hasValues = dbKPIs.some(k => k.value !== 0);
      if (hasValues) return dbKPIs;
    }
    return mockKPIs;
  }, [dbKPIs]);

  const { nationalStatus, summary, areaData } = useMemo(() => {
    const warnings = kpis.filter(k => k.status === 'warning').length;
    const critical = kpis.filter(k => k.status === 'critical').length;
    
    let status: 'positive' | 'warning' | 'critical' = 'positive';
    let summaryText = 'De flesta områden visar stabil utveckling.';
    
    if (critical > 1) {
      status = 'critical';
      summaryText = `${critical} centrala indikatorer visar kritisk nivå. Situationen kräver uppmärksamhet.`;
    } else if (warnings > 2 || critical === 1) {
      status = 'warning';
      summaryText = `${warnings + critical} indikatorer visar varning. Flera områden kräver uppmärksamhet.`;
    }

    const areas = AREA_GROUPS.map(group => ({
      group,
      kpis: kpis.filter(kpi => group.categories.includes(kpi.category))
    }));
    
    return { nationalStatus: status, summary: summaryText, areaData: areas };
  }, [kpis]);

  const handleAreaSelect = (area: typeof areaData[0]) => {
    setSelectedArea(area);
    setView('area');
  };

  const handleKPISelect = (kpi: typeof mockKPIs[0]) => {
    setSelectedKPI({ kpi, showWhy: false, showHow: false });
    setView('detail');
  };

  const handleBack = () => {
    if (view === 'detail') {
      setView('area');
      setSelectedKPI(null);
    } else if (view === 'area') {
      setView('overview');
      setSelectedArea(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <Skeleton className="h-48 w-full mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-28" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-semibold text-sm">Nationellt Läge</span>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={showOnboarding} onOpenChange={setShowOnboarding}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
                  <HelpCircle className="h-3.5 w-3.5" />
                  Hur fungerar det?
                </Button>
              </DialogTrigger>
              <DialogContent className="p-0 border-0 bg-transparent shadow-none max-w-md">
                <PublicOnboarding 
                  onComplete={() => setShowOnboarding(false)} 
                  onSkip={() => setShowOnboarding(false)} 
                />
              </DialogContent>
            </Dialog>
            <Link 
              to="/"
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              Intern vy <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Overview View */}
        {view === 'overview' && (
          <div className="animate-fade-in">
            {/* Hero */}
            <div className="text-center mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
                Hur går det för Sverige just nu?
              </h1>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                {kpis.length} centrala indikatorer. Samma data som beslutsfattare använder.
              </p>
            </div>

            <NationalStatusBadge status={nationalStatus} summary={summary} />

            {/* Area Grid */}
            <div className="mt-8">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
                Välj ett område
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {areaData.map((area) => (
                  <AreaCard 
                    key={area.group.id}
                    group={area.group}
                    kpis={area.kpis}
                    onClick={() => handleAreaSelect(area)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Area View */}
        {view === 'area' && selectedArea && (
          <AreaDetailView 
            area={selectedArea} 
            onBack={handleBack}
            onKPISelect={handleKPISelect}
          />
        )}

        {/* KPI Detail View */}
        {view === 'detail' && selectedKPI && (
          <KPIDetailView 
            selected={selectedKPI}
            onBack={handleBack}
            onToggleWhy={() => setSelectedKPI(prev => prev ? {...prev, showWhy: !prev.showWhy} : null)}
            onToggleHow={() => setSelectedKPI(prev => prev ? {...prev, showHow: !prev.showHow} : null)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-card mt-8">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-medium mb-1">Om detta system</h4>
              <p className="text-muted-foreground text-xs">
                Samma data som används för beslutsfattande på nationell nivå.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-1">Spårbarhet</h4>
              <p className="text-muted-foreground text-xs">
                Varje siffra kan spåras till källan.
              </p>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Info className="h-3 w-3" />
              <span>Demo med simulerad data</span>
            </div>
            <span>NOGF v1.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
