import { useMemo } from 'react';
import { useKPIOverview } from '@/hooks/useKPIData';
import { mockKPIs } from '@/data/mockKPIs';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus, ExternalLink, ChevronRight, Info, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';

const STATUS_CONFIG = {
  positive: { label: 'Stabilt', color: 'bg-emerald-500', textColor: 'text-emerald-500' },
  warning: { label: 'Osäkert', color: 'bg-amber-500', textColor: 'text-amber-500' },
  critical: { label: 'Försämras', color: 'bg-red-500', textColor: 'text-red-500' },
  neutral: { label: 'Stabilt', color: 'bg-emerald-500', textColor: 'text-emerald-500' },
};

const CATEGORY_NAMES: Record<string, string> = {
  demografi_halsa: 'Demografi & Hälsa',
  arbete_produktivitet: 'Arbete & Produktivitet',
  ekonomisk_barkraft: 'Ekonomisk bärkraft',
  social_stabilitet: 'Social stabilitet',
  karnsystem_funktion: 'Kärnsystemfunktion',
  infrastruktur: 'Infrastruktur',
  systemrisk_styrning: 'Systemrisk & Styrning',
};

function NationalStatusBadge({ status, warningCount, criticalCount }: { 
  status: 'positive' | 'warning' | 'critical'; 
  warningCount: number;
  criticalCount: number;
}) {
  const config = STATUS_CONFIG[status];
  
  return (
    <div className="flex flex-col items-center justify-center py-8 px-4">
      <div className={cn(
        "w-32 h-32 rounded-full flex items-center justify-center mb-4",
        "ring-4 ring-offset-4 ring-offset-background",
        status === 'positive' && "ring-emerald-500/30 bg-emerald-500/10",
        status === 'warning' && "ring-amber-500/30 bg-amber-500/10",
        status === 'critical' && "ring-red-500/30 bg-red-500/10"
      )}>
        <div className={cn("w-20 h-20 rounded-full", config.color)} />
      </div>
      <h2 className={cn("text-2xl font-bold uppercase tracking-wide", config.textColor)}>
        {config.label}
      </h2>
      <p className="text-muted-foreground text-center mt-2 max-w-md">
        {status === 'positive' && 'Majoriteten av indikatorerna visar stabil eller positiv trend.'}
        {status === 'warning' && `${warningCount} indikatorer visar varning. Situationen kräver uppmärksamhet.`}
        {status === 'critical' && `${criticalCount} kritiska indikatorer. Flera centrala områden försämras.`}
      </p>
      <p className="text-xs text-muted-foreground mt-4">
        Uppdaterad: {new Date().toLocaleDateString('sv-SE')}
      </p>
    </div>
  );
}

function PublicKPICard({ kpi }: { kpi: typeof mockKPIs[0] }) {
  const TrendIcon = kpi.trend === 'up' ? TrendingUp : kpi.trend === 'down' ? TrendingDown : Minus;
  const isInverted = 'inverted' in kpi ? kpi.inverted : false;
  const trendPercent = kpi.trendPercent ?? 0;
  
  // Format value based on unit
  const formattedValue = kpi.unit === '%' 
    ? `${kpi.value.toFixed(1)}%`
    : kpi.unit === 'SEK' 
      ? `${(kpi.value / 1000).toFixed(0)} tkr`
      : `${kpi.value.toFixed(1)} ${kpi.unit}`;

  return (
    <Card className="group hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm leading-tight truncate">{kpi.name}</h3>
          </div>
          <Badge 
            variant="outline" 
            className={cn(
              "ml-2 shrink-0",
              kpi.status === 'critical' && "border-destructive text-destructive",
              kpi.status === 'warning' && "border-amber-500 text-amber-600",
              kpi.status === 'positive' && "border-emerald-500 text-emerald-600",
              kpi.status === 'neutral' && "border-muted-foreground"
            )}
          >
            {formattedValue}
          </Badge>
        </div>
        
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
          {kpi.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <TrendIcon className={cn(
              "h-3.5 w-3.5",
              kpi.trend === 'up' && !isInverted && "text-emerald-500",
              kpi.trend === 'up' && isInverted && "text-destructive",
              kpi.trend === 'down' && !isInverted && "text-destructive",
              kpi.trend === 'down' && isInverted && "text-emerald-500",
              kpi.trend === 'stable' && "text-muted-foreground"
            )} />
            <span className="text-xs text-muted-foreground">
              {trendPercent !== 0 
                ? `${trendPercent > 0 ? '+' : ''}${trendPercent.toFixed(1)}%`
                : 'Stabil'
              }
            </span>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
        </div>
      </CardContent>
    </Card>
  );
}

function PublicKPIGrid({ kpis }: { kpis: typeof mockKPIs }) {
  const kpisByCategory = useMemo(() => {
    const grouped: Record<string, typeof mockKPIs> = {};
    kpis.forEach(kpi => {
      if (!grouped[kpi.category]) {
        grouped[kpi.category] = [];
      }
      grouped[kpi.category].push(kpi);
    });
    return grouped;
  }, [kpis]);

  return (
    <div className="space-y-8">
      {Object.entries(kpisByCategory).map(([category, categoryKpis]) => (
        <div key={category}>
          <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
            {CATEGORY_NAMES[category] || category}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {categoryKpis.map(kpi => (
              <PublicKPICard key={kpi.id} kpi={kpi} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function PublicDashboard() {
  const { data: dbKPIs, isLoading } = useKPIOverview();
  
  const kpis = useMemo(() => {
    if (dbKPIs && dbKPIs.length > 0) {
      const hasValues = dbKPIs.some(k => k.value !== 0);
      if (hasValues) return dbKPIs;
    }
    return mockKPIs;
  }, [dbKPIs]);

  const { warningCount, criticalCount, nationalStatus } = useMemo(() => {
    const warnings = kpis.filter(k => k.status === 'warning').length;
    const critical = kpis.filter(k => k.status === 'critical').length;
    
    let status: 'positive' | 'warning' | 'critical' = 'positive';
    if (critical > 1) status = 'critical';
    else if (warnings > 2 || critical === 1) status = 'warning';
    
    return { warningCount: warnings, criticalCount: critical, nationalStatus: status };
  }, [kpis]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <Skeleton className="h-64 w-full mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-semibold">Nationellt Läge</span>
          </div>
          <Link 
            to="/"
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            Intern vy <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="border-b bg-gradient-to-b from-card to-background">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center pt-8 pb-4">
            <h1 className="text-3xl font-bold tracking-tight">
              Hur går det för Sverige?
            </h1>
            <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
              En öppen instrumentpanel med 20 centrala indikatorer för landets utveckling.
              Samma data som beslutsfattare använder.
            </p>
          </div>
          
          <NationalStatusBadge 
            status={nationalStatus} 
            warningCount={warningCount}
            criticalCount={criticalCount}
          />
        </div>
      </section>

      {/* KPI Grid */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Alla indikatorer</h2>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Positiv</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Varning</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span>Kritisk</span>
            </div>
          </div>
        </div>
        
        <PublicKPIGrid kpis={kpis} />
      </main>

      {/* Footer */}
      <footer className="border-t bg-card mt-8">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-medium mb-2">Om detta system</h4>
              <p className="text-sm text-muted-foreground">
                Nationellt Läge är en öppen instrumentpanel som visar samma data 
                som används för beslutsfattande på nationell nivå.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Datakällor</h4>
              <p className="text-sm text-muted-foreground">
                All data kommer från officiella svenska myndigheter: SCB, 
                Socialstyrelsen, Arbetsförmedlingen, med flera.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Spårbarhet</h4>
              <p className="text-sm text-muted-foreground">
                Varje datapunkt kan spåras tillbaka till ursprungskällan. 
                Klicka på en indikator för att se fullständig analys.
              </p>
            </div>
          </div>
          
          <div className="mt-8 pt-4 border-t flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Info className="h-3 w-3" />
              <span>Detta är en demo. Data är simulerad.</span>
            </div>
            <span>NOGF v1.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
