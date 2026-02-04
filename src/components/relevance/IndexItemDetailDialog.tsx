/**
 * INDEX ITEM DETAIL DIALOG
 * ═══════════════════════════════════════════════════════════════
 * 
 * Fördjupad vy för en indikator/index med:
 * - Utfallsdata (outcome)
 * - Antal berörda människor (population impact)
 * - Påverkande faktorer
 * - Historisk trend
 * - Ansvarsfördelning
 * 
 * Följer NO ICONS-doktrinen: endast text-markörer.
 */

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface OutcomeData {
  description: string;
  measurementPeriod: string;
  baselineValue: number;
  currentValue: number;
  changePercent: number;
  changeDirection: 'improvement' | 'decline' | 'stable';
  targetValue?: number;
  targetAchieved?: boolean;
}

interface PopulationImpact {
  totalAffected: number;
  affectedPercentage: number;
  demographicBreakdown?: {
    category: string;
    count: number;
    percentage: number;
  }[];
  regionalDistribution?: {
    region: string;
    count: number;
    severity: 'high' | 'medium' | 'low';
  }[];
}

interface ContributingFactor {
  factorName: string;
  impactWeight: number; // 0-100
  direction: 'positive' | 'negative' | 'mixed';
  confidence: number;
  description: string;
}

interface ResponsibilityChain {
  level: 'national' | 'regional' | 'municipal' | 'operational';
  entity: string;
  role: string;
  hasAction: boolean;
}

interface IndexItemDetailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: {
    id: string;
    code: string;
    name: string;
    change: number;
    score?: number;
    primaryReason?: string;
    category?: string;
  } | null;
  type: 'improvement' | 'decline' | 'attention';
}

// Mock data generator för demonstration
function generateMockData(item: IndexItemDetailProps['item'], type: IndexItemDetailProps['type']) {
  if (!item) return null;

  const isDecline = type === 'decline';
  const changeAbs = Math.abs(item.change || 5);

  const outcome: OutcomeData = {
    description: isDecline 
      ? `${item.name} har försämrats under mätperioden`
      : `${item.name} har förbättrats under mätperioden`,
    measurementPeriod: '2024-Q3 till 2025-Q1',
    baselineValue: isDecline ? 100 : 85,
    currentValue: isDecline ? 100 - changeAbs : 85 + changeAbs,
    changePercent: item.change || changeAbs * (isDecline ? -1 : 1),
    changeDirection: isDecline ? 'decline' : 'improvement',
    targetValue: 95,
    targetAchieved: !isDecline,
  };

  const population: PopulationImpact = {
    totalAffected: Math.floor(Math.random() * 500000) + 50000,
    affectedPercentage: Math.random() * 15 + 2,
    demographicBreakdown: [
      { category: '18-30 år', count: Math.floor(Math.random() * 100000), percentage: 22 },
      { category: '31-50 år', count: Math.floor(Math.random() * 150000), percentage: 35 },
      { category: '51-65 år', count: Math.floor(Math.random() * 120000), percentage: 28 },
      { category: '65+ år', count: Math.floor(Math.random() * 80000), percentage: 15 },
    ],
    regionalDistribution: [
      { region: 'Stockholm', count: Math.floor(Math.random() * 100000), severity: isDecline ? 'high' : 'low' },
      { region: 'Västra Götaland', count: Math.floor(Math.random() * 80000), severity: 'medium' },
      { region: 'Skåne', count: Math.floor(Math.random() * 60000), severity: isDecline ? 'high' : 'medium' },
      { region: 'Övriga', count: Math.floor(Math.random() * 150000), severity: 'low' },
    ],
  };

  const factors: ContributingFactor[] = [
    {
      factorName: 'Demografisk förskjutning',
      impactWeight: Math.floor(Math.random() * 30) + 20,
      direction: isDecline ? 'negative' : 'positive',
      confidence: Math.floor(Math.random() * 20) + 75,
      description: 'Förändringar i befolkningsstruktur påverkar utfallet',
    },
    {
      factorName: 'Policyförändringar',
      impactWeight: Math.floor(Math.random() * 25) + 15,
      direction: 'mixed',
      confidence: Math.floor(Math.random() * 25) + 60,
      description: 'Genomförda reformer har haft observerbar effekt',
    },
    {
      factorName: 'Ekonomiska cykler',
      impactWeight: Math.floor(Math.random() * 20) + 10,
      direction: isDecline ? 'negative' : 'positive',
      confidence: Math.floor(Math.random() * 30) + 50,
      description: 'Konjunkturläget korrelerar med observerad förändring',
    },
    {
      factorName: 'Externa faktorer',
      impactWeight: Math.floor(Math.random() * 15) + 5,
      direction: 'mixed',
      confidence: Math.floor(Math.random() * 40) + 30,
      description: 'Globala trender och händelser kan ha bidragit',
    },
  ];

  const responsibility: ResponsibilityChain[] = [
    { level: 'national', entity: 'Socialdepartementet', role: 'Policyansvar', hasAction: Math.random() > 0.5 },
    { level: 'regional', entity: 'Region Stockholm', role: 'Genomförandeansvar', hasAction: Math.random() > 0.6 },
    { level: 'municipal', entity: 'Stockholms kommun', role: 'Operativt ansvar', hasAction: Math.random() > 0.7 },
    { level: 'operational', entity: 'Socialstyrelsen', role: 'Tillsyn & uppföljning', hasAction: true },
  ];

  return { outcome, population, factors, responsibility };
}

export function IndexItemDetailDialog({ open, onOpenChange, item, type }: IndexItemDetailProps) {
  const [activeTab, setActiveTab] = useState('outcome');
  
  if (!item) return null;

  const data = generateMockData(item, type);
  if (!data) return null;

  const { outcome, population, factors, responsibility } = data;

  const typeLabels = {
    improvement: { label: '[+] FÖRBÄTTRING', color: 'text-emerald-600 bg-emerald-50' },
    decline: { label: '[-] FÖRSÄMRING', color: 'text-red-600 bg-red-50' },
    attention: { label: '[!] KRÄVER UPPMÄRKSAMHET', color: 'text-amber-600 bg-amber-50' },
  };

  const typeConfig = typeLabels[type];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader className="space-y-3 pb-4 border-b">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <Badge variant="outline" className={cn('font-mono text-xs', typeConfig.color)}>
                {typeConfig.label}
              </Badge>
              <DialogTitle className="text-xl font-semibold leading-tight">
                {item.name}
              </DialogTitle>
            </div>
            <div className="text-right shrink-0">
              <div className={cn(
                'text-2xl font-mono font-bold tabular-nums',
                type === 'decline' ? 'text-red-600' : 'text-emerald-600'
              )}>
                {type === 'decline' ? '↓' : '↑'} {Math.abs(item.change || 0).toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground font-mono">
                [{item.code}]
              </div>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-4 shrink-0">
            <TabsTrigger value="outcome" className="text-xs font-mono">[UTFALL]</TabsTrigger>
            <TabsTrigger value="population" className="text-xs font-mono">[BERÖRDA]</TabsTrigger>
            <TabsTrigger value="factors" className="text-xs font-mono">[FAKTORER]</TabsTrigger>
            <TabsTrigger value="responsibility" className="text-xs font-mono">[ANSVAR]</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto mt-4">
            {/* UTFALL TAB */}
            <TabsContent value="outcome" className="space-y-4 m-0">
              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                  <p className="text-sm">{outcome.description}</p>
                  <div className="text-xs text-muted-foreground font-mono">
                    [PERIOD] {outcome.measurementPeriod}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-xs text-muted-foreground font-mono mb-1">[BASLINJE]</div>
                    <div className="text-2xl font-bold font-mono">{outcome.baselineValue.toFixed(1)}</div>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-xs text-muted-foreground font-mono mb-1">[NULÄGE]</div>
                    <div className={cn(
                      'text-2xl font-bold font-mono',
                      outcome.changeDirection === 'decline' ? 'text-red-600' : 'text-emerald-600'
                    )}>
                      {outcome.currentValue.toFixed(1)}
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-xs text-muted-foreground font-mono mb-1">[MÅL]</div>
                    <div className="text-2xl font-bold font-mono text-blue-600">
                      {outcome.targetValue ?? '—'}
                    </div>
                    {outcome.targetAchieved !== undefined && (
                      <div className={cn(
                        'text-xs font-mono mt-1',
                        outcome.targetAchieved ? 'text-emerald-600' : 'text-red-600'
                      )}>
                        {outcome.targetAchieved ? '[✓] Uppnått' : '[✗] Ej uppnått'}
                      </div>
                    )}
                  </div>
                </div>

                <div className={cn(
                  'p-3 rounded-lg border-l-4 text-sm',
                  outcome.changeDirection === 'decline' 
                    ? 'border-l-red-500 bg-red-50' 
                    : 'border-l-emerald-500 bg-emerald-50'
                )}>
                  <span className="font-mono font-bold">
                    {outcome.changeDirection === 'decline' ? '[↓]' : '[↑]'}
                  </span>{' '}
                  Förändring: <span className="font-mono font-bold">{outcome.changePercent.toFixed(1)}%</span> sedan baslinjen
                </div>
              </div>
            </TabsContent>

            {/* BERÖRDA TAB */}
            <TabsContent value="population" className="space-y-4 m-0">
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground font-mono">[TOTALT BERÖRDA]</div>
                    <div className="text-3xl font-bold font-mono">
                      {population.totalAffected.toLocaleString('sv-SE')}
                    </div>
                    <div className="text-sm text-muted-foreground">personer</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground font-mono">[ANDEL AV BEFOLKNING]</div>
                    <div className="text-3xl font-bold font-mono">
                      {population.affectedPercentage.toFixed(1)}%
                    </div>
                    <div className="text-sm text-muted-foreground">av nationell population</div>
                  </div>
                </div>
              </div>

              {population.demographicBreakdown && (
                <div className="space-y-2">
                  <h4 className="text-xs font-mono text-muted-foreground">[DEMOGRAFISK FÖRDELNING]</h4>
                  <div className="space-y-2">
                    {population.demographicBreakdown.map((demo, i) => (
                      <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="text-sm font-medium">{demo.category}</span>
                        <div className="text-right">
                          <span className="font-mono font-bold">{demo.count.toLocaleString('sv-SE')}</span>
                          <span className="text-xs text-muted-foreground ml-2">({demo.percentage}%)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {population.regionalDistribution && (
                <div className="space-y-2">
                  <h4 className="text-xs font-mono text-muted-foreground">[REGIONAL FÖRDELNING]</h4>
                  <div className="space-y-2">
                    {population.regionalDistribution.map((reg, i) => (
                      <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant="outline" 
                            className={cn(
                              'text-xs font-mono',
                              reg.severity === 'high' ? 'border-red-300 text-red-600' :
                              reg.severity === 'medium' ? 'border-amber-300 text-amber-600' :
                              'border-emerald-300 text-emerald-600'
                            )}
                          >
                            {reg.severity === 'high' ? '[!]' : reg.severity === 'medium' ? '[~]' : '[○]'}
                          </Badge>
                          <span className="text-sm font-medium">{reg.region}</span>
                        </div>
                        <span className="font-mono font-bold">{reg.count.toLocaleString('sv-SE')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* FAKTORER TAB */}
            <TabsContent value="factors" className="space-y-4 m-0">
              <div className="p-3 bg-muted/50 rounded-lg text-sm">
                <span className="font-mono">[INFO]</span> Faktorer rangordnade efter uppskattad påverkan. 
                Konfidensvärden baserade på tillgänglig evidens.
              </div>

              <div className="space-y-3">
                {factors
                  .sort((a, b) => b.impactWeight - a.impactWeight)
                  .map((factor, i) => (
                  <div key={i} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          'font-mono font-bold',
                          factor.direction === 'positive' ? 'text-emerald-600' :
                          factor.direction === 'negative' ? 'text-red-600' :
                          'text-amber-600'
                        )}>
                          {factor.direction === 'positive' ? '[+]' :
                           factor.direction === 'negative' ? '[-]' : '[±]'}
                        </span>
                        <span className="font-medium">{factor.factorName}</span>
                      </div>
                      <Badge variant="outline" className="font-mono text-xs">
                        {factor.impactWeight}% påverkan
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">{factor.description}</p>
                    
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            'h-full rounded-full',
                            factor.confidence >= 70 ? 'bg-emerald-500' :
                            factor.confidence >= 50 ? 'bg-amber-500' : 'bg-red-500'
                          )}
                          style={{ width: `${factor.confidence}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono text-muted-foreground">
                        {factor.confidence}% konfidens
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 border border-dashed rounded-lg text-xs text-muted-foreground">
                <span className="font-mono">[METOD]</span> Faktoranalys baserad på korrelationsdata, 
                tidsseriebrottspunkter, och expertbedömningar. Kausalitet kan ej fastställas med säkerhet.
              </div>
            </TabsContent>

            {/* ANSVAR TAB */}
            <TabsContent value="responsibility" className="space-y-4 m-0">
              <div className="space-y-2">
                {responsibility.map((resp, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      'p-4 border rounded-lg flex items-center justify-between',
                      resp.hasAction ? 'border-l-4 border-l-emerald-500' : 'border-l-4 border-l-muted'
                    )}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono text-xs uppercase">
                          [{resp.level.slice(0, 3)}]
                        </Badge>
                        <span className="font-medium">{resp.entity}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{resp.role}</p>
                    </div>
                    <Badge 
                      variant={resp.hasAction ? 'default' : 'secondary'}
                      className="font-mono text-xs"
                    >
                      {resp.hasAction ? '[ÅTGÄRD]' : '[—]'}
                    </Badge>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-muted/50 rounded-lg text-sm space-y-2">
                <div className="font-mono text-xs text-muted-foreground">[ANSVARSKEDJA]</div>
                <p>
                  Ansvarsnivåer enligt svensk förvaltningsstruktur. 
                  Markering <span className="font-mono">[ÅTGÄRD]</span> indikerar registrerade 
                  insatser i åtgärdsregistret.
                </p>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
