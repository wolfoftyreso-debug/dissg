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

// NO MOCK DATA - System principle: "Silence over speculation"
// All data must come from verified database sources
function getVerifiedData(_item: IndexItemDetailProps['item'], _type: IndexItemDetailProps['type']): {
  outcome: OutcomeData | null;
  population: PopulationImpact | null;
  factors: ContributingFactor[];
  responsibility: ResponsibilityChain[];
} {
  // Return empty/null states - data will be populated from real sources
  // when connected to action_outcome_links, decision_outcomes, etc.
  return {
    outcome: null,
    population: null,
    factors: [],
    responsibility: [],
  };
}

export function IndexItemDetailDialog({ open, onOpenChange, item, type }: IndexItemDetailProps) {
  const [activeTab, setActiveTab] = useState('outcome');
  
  if (!item) return null;

  const data = getVerifiedData(item, type);
  const { outcome, population, factors, responsibility } = data;

  const typeLabels = {
    improvement: { label: '[+] FÖRBÄTTRING', color: 'text-status-positive bg-status-positive/10' },
    decline: { label: '[-] FÖRSÄMRING', color: 'text-status-critical bg-status-critical/10' },
    attention: { label: '[!] KRÄVER UPPMÄRKSAMHET', color: 'text-status-warning bg-status-warning/10' },
  };

  const typeConfig = typeLabels[type];

  // Show no-data state when verified data is not available
  const hasData = outcome !== null;

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
                type === 'decline' ? 'text-status-critical' : 'text-status-positive'
              )}>
                {type === 'decline' ? '↓' : '↑'} {Math.abs(item.change || 0).toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground font-mono">
                [{item.code}]
              </div>
            </div>
          </div>
        </DialogHeader>

        {!hasData ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center space-y-3">
              <div className="text-3xl font-mono text-muted-foreground">—</div>
              <h3 className="font-semibold">Data ej tillgänglig</h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                Detaljerad utfallsdata visas endast från verifierade datakällor.
              </p>
              <div className="text-xs font-mono text-status-warning">[DATA_UNAVAILABLE]</div>
            </div>
          </div>
        ) : (
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
                  <p className="text-sm">{outcome?.description || '—'}</p>
                  <div className="text-xs text-muted-foreground font-mono">
                    [PERIOD] {outcome?.measurementPeriod || '—'}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-xs text-muted-foreground font-mono mb-1">[BASLINJE]</div>
                    <div className="text-2xl font-bold font-mono">{outcome?.baselineValue?.toFixed(1) ?? '—'}</div>
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
        )}
      </DialogContent>
    </Dialog>
  );
}
