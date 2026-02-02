import { useState, useMemo } from 'react';
import { TrendingUp, GitBranch, Zap, AlertCircle, BarChart2, Layers, ArrowRight, CircleDot, Info, MousePointerClick } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { KPI, CATEGORIES } from '@/types/kpi';
import { cn } from '@/lib/utils';
import { CorrelationCompareView } from './CorrelationCompareView';

interface AnalysisPanelProps {
  kpis: KPI[];
}

interface Correlation {
  id: string;
  kpi1Id: string;
  kpi2Id: string;
  strength: number; // -1 to 1
  lagMonths: number;
  confidence: number;
  description: string;
  isSignificant: boolean;
}

// Mock correlations baserat på verkliga samband
const MOCK_CORRELATIONS: Correlation[] = [
  {
    id: 'c1',
    kpi1Id: 'ebe5e4a7-f507-4f72-9c1e-517582e50af1', // Unga män utanför system
    kpi2Id: '5987e149-c730-4e07-9c66-61533eeaacd7', // Grova våldsbrott
    strength: 0.72,
    lagMonths: 18,
    confidence: 82,
    description: 'Ökning av unga män utanför system föregår ökning av grova våldsbrott med 18 månader',
    isSignificant: true,
  },
  {
    id: 'c2',
    kpi1Id: '9a6ef79a-a719-4133-be03-76bdc4bccf0a', // Sysselsättningsgrad
    kpi2Id: 'fd9918a5-ae65-4375-98dd-a3cab51390dc', // Skattebasens tillväxt
    strength: 0.85,
    lagMonths: 3,
    confidence: 91,
    description: 'Sysselsättningsgrad korrelerar starkt med skattebasens tillväxt',
    isSignificant: true,
  },
  {
    id: 'c3',
    kpi1Id: 'f6718a4b-5f81-4f7d-8b81-c9382d167cf3', // Långvarigt utanförskap
    kpi2Id: '6fc7b55d-2ab9-4b3f-9378-c8dcdff3bb8c', // Offentlig kostnad
    strength: 0.68,
    lagMonths: 6,
    confidence: 78,
    description: 'Ökat utanförskap leder till högre offentliga kostnader med 6 månaders fördröjning',
    isSignificant: true,
  },
  {
    id: 'c4',
    kpi1Id: '62983e23-343f-4dc5-951d-9b3799c4f70c', // Skolutfall
    kpi2Id: 'f6718a4b-5f81-4f7d-8b81-c9382d167cf3', // Långvarigt utanförskap
    strength: -0.61,
    lagMonths: 60,
    confidence: 75,
    description: 'Låga skolresultat korrelerar med framtida utanförskap (5 år)',
    isSignificant: true,
  },
  {
    id: 'c5',
    kpi1Id: 'c063a645-b198-4f9b-9f70-bbebe736dff4', // Energibalans
    kpi2Id: '362ddb45-91ff-4427-856b-39b40b5cb131', // Produktivitet
    strength: 0.45,
    lagMonths: 1,
    confidence: 65,
    description: 'Energiprisvolatilitet påverkar produktivitet negativt',
    isSignificant: false,
  },
  {
    id: 'c6',
    kpi1Id: '47a0800c-a5eb-42dc-9790-2d7d5d581dbf', // Vårdkö
    kpi2Id: '9061350b-be73-4e50-a2cb-e36d07c6f764', // Arbetsför befolkning
    strength: -0.52,
    lagMonths: 12,
    confidence: 70,
    description: 'Längre vårdköer korrelerar med minskad arbetsförmåga',
    isSignificant: true,
  },
];

interface TrendAlert {
  id: string;
  kpiId: string;
  alertType: 'acceleration' | 'deceleration' | 'reversal' | 'threshold';
  severity: 'high' | 'medium' | 'low';
  message: string;
  detectedAt: string;
}

const MOCK_ALERTS: TrendAlert[] = [
  {
    id: 'a1',
    kpiId: '5987e149-c730-4e07-9c66-61533eeaacd7',
    alertType: 'acceleration',
    severity: 'high',
    message: 'Ökningstakten av grova våldsbrott har accelererat de senaste 3 månaderna',
    detectedAt: '2025-01-15',
  },
  {
    id: 'a2',
    kpiId: '47a0800c-a5eb-42dc-9790-2d7d5d581dbf',
    alertType: 'threshold',
    severity: 'high',
    message: 'Vårdkön har passerat 90-dagarsgränsen för första gången sedan 2021',
    detectedAt: '2025-01-10',
  },
  {
    id: 'a3',
    kpiId: 'b4506f87-b18b-4367-823d-fd2cd2b3e543',
    alertType: 'acceleration',
    severity: 'medium',
    message: 'Systemstress-index ökar snabbare än prognoserat',
    detectedAt: '2025-01-08',
  },
  {
    id: 'a4',
    kpiId: '9a6ef79a-a719-4133-be03-76bdc4bccf0a',
    alertType: 'deceleration',
    severity: 'medium',
    message: 'Nedgångstakten i sysselsättning avtar - möjlig stabilisering',
    detectedAt: '2025-01-05',
  },
];

export function AnalysisPanel({ kpis }: AnalysisPanelProps) {
  const [activeTab, setActiveTab] = useState<'correlations' | 'trends' | 'system'>('correlations');
  const [selectedCorrelation, setSelectedCorrelation] = useState<Correlation | null>(null);

  const getKPIName = (id: string) => {
    return kpis.find(k => k.id === id)?.name || 'Okänd KPI';
  };


  const getCorrelationColor = (strength: number) => {
    const absStrength = Math.abs(strength);
    if (absStrength >= 0.7) return strength > 0 ? 'text-emerald-600' : 'text-red-600';
    if (absStrength >= 0.4) return 'text-amber-600';
    return 'text-muted-foreground';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-amber-500';
      default: return 'bg-blue-500';
    }
  };

  // Beräkna systemöversikt
  const systemOverview = useMemo(() => {
    const critical = kpis.filter(k => k.status === 'critical').length;
    const warning = kpis.filter(k => k.status === 'warning').length;
    const positive = kpis.filter(k => k.status === 'positive').length;
    const avgConfidence = Math.round(kpis.reduce((acc, k) => acc + k.confidence, 0) / kpis.length);
    
    // Beräkna "systemhälsa" som ett index
    const healthScore = Math.round(((positive * 100) + (warning * 50)) / kpis.length);
    
    return { critical, warning, positive, avgConfidence, healthScore };
  }, [kpis]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            Systemanalys
          </h2>
          <p className="text-muted-foreground mt-1">
            Korrelationer, trender och systemöversikt
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Systemhälsa</p>
                <p className="text-2xl font-bold">{systemOverview.healthScore}%</p>
              </div>
              <div className={cn(
                "p-2 rounded-full",
                systemOverview.healthScore >= 70 ? 'bg-emerald-100 dark:bg-emerald-900/30' :
                systemOverview.healthScore >= 40 ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-red-100 dark:bg-red-900/30'
              )}>
                <BarChart2 className={cn(
                  "h-5 w-5",
                  systemOverview.healthScore >= 70 ? 'text-emerald-600' :
                  systemOverview.healthScore >= 40 ? 'text-amber-600' : 'text-red-600'
                )} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Signifikanta korrelationer</p>
                <p className="text-2xl font-bold">
                  {MOCK_CORRELATIONS.filter(c => c.isSignificant).length}
                </p>
              </div>
              <div className="p-2 rounded-full bg-primary/10">
                <GitBranch className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Aktiva varningar</p>
                <p className="text-2xl font-bold">{MOCK_ALERTS.length}</p>
              </div>
              <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/30">
                <AlertCircle className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Datakonfidens</p>
                <p className="text-2xl font-bold">{systemOverview.avgConfidence}%</p>
              </div>
              <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
                <Layers className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
        <TabsList>
          <TabsTrigger value="correlations" className="gap-2">
            <GitBranch className="h-4 w-4" />
            Korrelationer
          </TabsTrigger>
          <TabsTrigger value="trends" className="gap-2">
            <Zap className="h-4 w-4" />
            Trendvarningar
          </TabsTrigger>
          <TabsTrigger value="system" className="gap-2">
            <Layers className="h-4 w-4" />
            Systemvy
          </TabsTrigger>
        </TabsList>

        {/* Correlations Tab */}
        <TabsContent value="correlations" className="mt-6 space-y-6">
          {/* Selected correlation comparison view */}
          {selectedCorrelation && (
            <CorrelationCompareView 
              correlation={selectedCorrelation}
              kpis={kpis}
              onClose={() => setSelectedCorrelation(null)}
            />
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <GitBranch className="h-4 w-4" />
                Upptäckta samband mellan indikatorer
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Korrelation observerad, kausalitet ej fastställd. 
                      Sambanden baseras på historisk dataanalys. Klicka på ett samband för att jämföra KPI:erna.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Badge variant="outline" className="ml-auto gap-1 text-xs">
                  <MousePointerClick className="h-3 w-3" />
                  Klicka för jämförelse
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {MOCK_CORRELATIONS.map((corr) => (
                    <div 
                      key={corr.id}
                      onClick={() => setSelectedCorrelation(corr)}
                      className={cn(
                        "p-4 rounded-lg border cursor-pointer transition-all",
                        corr.isSignificant ? 'bg-card' : 'bg-muted/30',
                        selectedCorrelation?.id === corr.id 
                          ? 'ring-2 ring-primary border-primary' 
                          : 'hover:border-primary/50 hover:bg-muted/50'
                      )}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <Badge 
                          variant={corr.isSignificant ? 'default' : 'secondary'}
                          className="gap-1"
                        >
                          <CircleDot className="h-3 w-3" />
                          {corr.isSignificant ? 'Signifikant' : 'Svag'}
                        </Badge>
                        <Badge variant="outline">
                          {corr.lagMonths} månaders fördröjning
                        </Badge>
                        <Badge variant="outline">
                          {corr.confidence}% konfidens
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex-1 p-2 rounded bg-muted/50 text-sm font-medium">
                          {getKPIName(corr.kpi1Id)}
                        </div>
                        <ArrowRight className={cn("h-5 w-5", getCorrelationColor(corr.strength))} />
                        <div className="flex-1 p-2 rounded bg-muted/50 text-sm font-medium">
                          {getKPIName(corr.kpi2Id)}
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">{corr.description}</p>
                      
                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Korrelationsstyrka:</span>
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={cn(
                              "h-full transition-all",
                              corr.strength > 0 ? 'bg-emerald-500' : 'bg-red-500'
                            )}
                            style={{ width: `${Math.abs(corr.strength) * 100}%` }}
                          />
                        </div>
                        <span className={cn("font-mono text-sm", getCorrelationColor(corr.strength))}>
                          {corr.strength > 0 ? '+' : ''}{corr.strength.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Automatiska trendvarningar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {MOCK_ALERTS.map((alert) => (
                  <div 
                    key={alert.id}
                    className="flex items-start gap-4 p-4 rounded-lg border"
                  >
                    <div className={cn(
                      "w-2 h-2 rounded-full mt-2",
                      getSeverityColor(alert.severity)
                    )} />
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{getKPIName(alert.kpiId)}</span>
                        <Badge variant="outline" className="text-xs capitalize">
                          {alert.alertType}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{alert.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Upptäckt: {alert.detectedAt}
                      </p>
                    </div>
                    
                    <Badge 
                      variant={alert.severity === 'high' ? 'destructive' : 'secondary'}
                      className="capitalize"
                    >
                      {alert.severity === 'high' ? 'Hög' : alert.severity === 'medium' ? 'Medium' : 'Låg'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Tab */}
        <TabsContent value="system" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Category Health */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Hälsa per kategori</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {CATEGORIES.map((cat) => {
                    const catKPIs = kpis.filter(k => k.category === cat.id);
                    if (catKPIs.length === 0) return null;
                    
                    const positive = catKPIs.filter(k => k.status === 'positive').length;
                    const warning = catKPIs.filter(k => k.status === 'warning').length;
                    const critical = catKPIs.filter(k => k.status === 'critical').length;
                    const score = Math.round(((positive * 100) + (warning * 50)) / catKPIs.length);
                    
                    return (
                      <div key={cat.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{cat.code}. {cat.name}</span>
                          <span className="text-sm text-muted-foreground">{score}%</span>
                        </div>
                        <div className="flex h-2 rounded-full overflow-hidden bg-muted">
                          {positive > 0 && (
                            <div 
                              className="bg-emerald-500" 
                              style={{ width: `${(positive / catKPIs.length) * 100}%` }}
                            />
                          )}
                          {warning > 0 && (
                            <div 
                              className="bg-amber-500" 
                              style={{ width: `${(warning / catKPIs.length) * 100}%` }}
                            />
                          )}
                          {critical > 0 && (
                            <div 
                              className="bg-red-500" 
                              style={{ width: `${(critical / catKPIs.length) * 100}%` }}
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Risk Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Riskbedömning</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <span className="font-medium text-red-800 dark:text-red-200">Kritiska risker</span>
                    </div>
                    <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                      <li>• Grova våldsbrott ökar exponentiellt</li>
                      <li>• Långvarigt utanförskap över kritisk nivå</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-4 w-4 text-amber-600" />
                      <span className="font-medium text-amber-800 dark:text-amber-200">Under observation</span>
                    </div>
                    <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                      <li>• Vårdköer närmar sig kritisk gräns</li>
                      <li>• Sysselsättningsgraden fortsätter minska</li>
                      <li>• Regional divergens ökar snabbt</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-emerald-600" />
                      <span className="font-medium text-emerald-800 dark:text-emerald-200">Positiva signaler</span>
                    </div>
                    <ul className="text-sm text-emerald-700 dark:text-emerald-300 space-y-1">
                      <li>• Produktivitet ökar stadigt</li>
                      <li>• Livslängd fortsätter uppåt</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Disclaimer */}
      <div className="text-xs text-muted-foreground text-center pt-4 border-t">
        Korrelation observerad, kausalitet ej fastställd. Analyserna är systematiserade iakttagelser, inte rekommendationer.
      </div>
    </div>
  );
}
