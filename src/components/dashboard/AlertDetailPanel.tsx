/**
 * Alert Detail Panel
 * Expandable alert with root cause analysis and action planning
 */

import { useState } from 'react';
import { KPIAlert } from '@/hooks/useKPIAlerts';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';

interface AlertDetailPanelProps {
  alert: KPIAlert;
  isOpen: boolean;
  onClose: () => void;
  isPro?: boolean;
  licenseLevel?: 'observer' | 'analyst' | 'institutional';
}

interface RootCauseAnalysis {
  primaryCauses: Array<{
    id: string;
    cause: string;
    probability: number;
    evidence: string[];
    relatedIndicators: string[];
  }>;
  secondaryCauses: Array<{
    cause: string;
    contributionPercent: number;
  }>;
  correlatedSignals: Array<{
    kpiName: string;
    correlation: number;
    lagMonths: number;
  }>;
  structuralFactors: string[];
  cyclicalFactors: string[];
  externalShocks: string[];
}

interface ActionPlan {
  actions: Array<{
    id: string;
    title: string;
    description: string;
    effortScore: number; // 1-10
    effectScore: number; // 1-10
    effortEffectRatio: number;
    timeframe: 'immediate' | 'short_term' | 'medium_term' | 'long_term';
    responsibleEntity: string;
    expectedImpact: string;
    confidence: number;
    prerequisites: string[];
    risks: string[];
  }>;
  quickWins: string[];
  strategicPriorities: string[];
}

export function AlertDetailPanel({ 
  alert, 
  isOpen, 
  onClose,
  isPro = false,
  licenseLevel = 'observer'
}: AlertDetailPanelProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [rootCause, setRootCause] = useState<RootCauseAnalysis | null>(null);
  const [actionPlan, setActionPlan] = useState<ActionPlan | null>(null);
  const [isLoadingRootCause, setIsLoadingRootCause] = useState(false);
  const [isLoadingActionPlan, setIsLoadingActionPlan] = useState(false);
  
  const isCritical = alert.severity === 'critical';
  const canAccessRootCause = licenseLevel === 'analyst' || licenseLevel === 'institutional';
  const canAccessActionPlan = licenseLevel === 'institutional';

  const generateRootCauseAnalysis = async () => {
    setIsLoadingRootCause(true);
    try {
      const { data, error } = await supabase.functions.invoke('alert-root-cause', {
        body: { alert }
      });
      
      if (error) throw error;
      setRootCause(data?.analysis || generateMockRootCause());
    } catch (err) {
      console.log('Using mock root cause analysis');
      setRootCause(generateMockRootCause());
    } finally {
      setIsLoadingRootCause(false);
    }
  };

  const generateActionPlanAnalysis = async () => {
    setIsLoadingActionPlan(true);
    try {
      const { data, error } = await supabase.functions.invoke('alert-action-plan', {
        body: { alert, rootCause }
      });
      
      if (error) throw error;
      setActionPlan(data?.plan || generateMockActionPlan());
    } catch (err) {
      console.log('Using mock action plan');
      setActionPlan(generateMockActionPlan());
    } finally {
      setIsLoadingActionPlan(false);
    }
  };

  // Generate mock data for demo
  const generateMockRootCause = (): RootCauseAnalysis => ({
    primaryCauses: [
      {
        id: 'pc1',
        cause: 'Demografisk obalans med åldrande befolkning',
        probability: 78,
        evidence: [
          'Förhållandet mellan arbetande och icke-arbetande har försämrats 3.2% YoY',
          'Nettomigration i arbetsför ålder -12,400 senaste kvartalet',
          'Fertilitetsnivå 1.52 under ersättningsnivån'
        ],
        relatedIndicators: ['dependency_ratio', 'working_age_functional', 'tax_base_growth']
      },
      {
        id: 'pc2',
        cause: 'Strukturell arbetslöshet i specifika segment',
        probability: 65,
        evidence: [
          'Långtidsarbetslöshet >12 månader ökat 18% senaste året',
          'Matchningseffektivitet på arbetsmarknaden sjunkit',
          'Regionala skillnader i sysselsättningsgrad vidgats'
        ],
        relatedIndicators: ['long_term_exclusion', 'employment_rate_net']
      }
    ],
    secondaryCauses: [
      { cause: 'Kompetensglapp i nyckelsektorer', contributionPercent: 23 },
      { cause: 'Ineffektiva incitamentsstrukturer', contributionPercent: 18 },
      { cause: 'Regulatoriska hinder för mobilitet', contributionPercent: 12 }
    ],
    correlatedSignals: [
      { kpiName: 'Skattebasens tillväxt', correlation: 0.84, lagMonths: 6 },
      { kpiName: 'Vårdköer (funktionell)', correlation: 0.72, lagMonths: 12 },
      { kpiName: 'Skolresultat åk 9', correlation: 0.61, lagMonths: 48 }
    ],
    structuralFactors: [
      'Låg bostadsmobilitet på grund av höga transaktionskostnader',
      'Pensionssystemets utformning minskar incitament för förlängt arbetsliv',
      'Utbildningssystemets tröghet att anpassa sig till arbetsmarknadens behov'
    ],
    cyclicalFactors: [
      'Konjunkturnedgång i exportberoende sektorer',
      'Räntehöjningar påverkar investeringsbenägenhet'
    ],
    externalShocks: [
      'Geopolitisk osäkerhet påverkar handelsflöden',
      'Energiprisvolatilitet'
    ]
  });

  const generateMockActionPlan = (): ActionPlan => ({
    actions: [
      {
        id: 'a1',
        title: 'Reformera matchningsmekanismer på arbetsmarknaden',
        description: 'Implementera AI-driven matchning och riktade utbildningsinsatser för att minska strukturell arbetslöshet',
        effortScore: 6,
        effectScore: 9,
        effortEffectRatio: 1.5,
        timeframe: 'medium_term',
        responsibleEntity: 'Arbetsmarknadsdepartementet',
        expectedImpact: '-2.3% i långtidsarbetslöshet inom 18 månader',
        confidence: 72,
        prerequisites: ['Budgetallokering Q1', 'Systemutveckling 6 mån'],
        risks: ['Implementeringsförseningar', 'Datakvalitetsproblem']
      },
      {
        id: 'a2',
        title: 'Snabbspår för validering av utländsk utbildning',
        description: 'Digitalisera och accelerera valideringsprocessen för att snabbare integrera utrikesfödd kompetens',
        effortScore: 4,
        effectScore: 7,
        effortEffectRatio: 1.75,
        timeframe: 'short_term',
        responsibleEntity: 'UHR/Socialstyrelsen',
        expectedImpact: '+15,000 i arbetskraftsutbud årligen',
        confidence: 81,
        prerequisites: ['IT-system anpassning', 'Regulatorisk uppdatering'],
        risks: ['Kvalitetssäkring av bedömningar']
      },
      {
        id: 'a3',
        title: 'Incitamentsreform för förlängt arbetsliv',
        description: 'Justera skattemässiga incitament för att uppmuntra arbete efter 65',
        effortScore: 3,
        effectScore: 5,
        effortEffectRatio: 1.67,
        timeframe: 'immediate',
        responsibleEntity: 'Finansdepartementet',
        expectedImpact: '+1.2% i sysselsättningsgrad 65-74',
        confidence: 68,
        prerequisites: ['Politisk förankring'],
        risks: ['Rättviseaspekter', 'Begränsad effekt på kort sikt']
      }
    ],
    quickWins: [
      'Förenkla rapporteringskrav för småföretag som anställer',
      'Utöka ROT/RUT-avdragen tillfälligt för att stimulera tjänstesektorn',
      'Aktivera latent arbetskraft genom förbättrad barnomsorgstillgång'
    ],
    strategicPriorities: [
      'Säkra kompetensförsörjning i vård och omsorg',
      'Minska regionala skillnader i sysselsättning',
      'Öka produktivitetstillväxten genom kompetensutveckling'
    ]
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <span className={cn(
              "font-mono text-lg font-bold",
              isCritical ? "text-destructive" : "text-warning"
            )}>
              {isCritical ? '[!!]' : '[!]'}
            </span>
            <div>
              <DialogTitle className="text-lg">{alert.kpiName}</DialogTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={isCritical ? "destructive" : "secondary"} className="text-xs font-mono">
                  {isCritical ? 'KRITISK' : 'VARNING'}
                </Badge>
                <span className="text-xs text-muted-foreground font-mono">
                  P:{alert.priorityIndex}
                </span>
                <span className="text-xs text-muted-foreground font-mono">
                  [{alert.triggeredAt && format(new Date(alert.triggeredAt), 'yyyy-MM-dd HH:mm', { locale: sv })}]
                </span>
              </div>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList className="grid w-full grid-cols-3 font-mono text-xs">
            <TabsTrigger value="overview">[ÖVERSIKT]</TabsTrigger>
            <TabsTrigger value="rootcause" disabled={!canAccessRootCause}>
              [ROTORSAK] {!canAccessRootCause && '🔒'}
            </TabsTrigger>
            <TabsTrigger value="actions" disabled={!canAccessActionPlan}>
              [ÅTGÄRDER] {!canAccessActionPlan && '🔒'}
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[60vh] mt-4">
            <TabsContent value="overview" className="space-y-4">
              {/* Alert Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border bg-card p-4">
                  <h4 className="text-xs font-mono text-muted-foreground mb-2">[AKTUELLT LÄGE]</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Värde</span>
                      <span className="text-sm font-bold font-mono">{alert.currentValue}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Tröskel</span>
                      <span className="text-sm font-mono">{alert.threshold}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Avvikelse</span>
                      <span className={cn(
                        "text-sm font-bold font-mono",
                        isCritical ? "text-destructive" : "text-warning"
                      )}>
                        {alert.deviationPercent?.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border bg-card p-4">
                  <h4 className="text-xs font-mono text-muted-foreground mb-2">[TREND]</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Förändring</span>
                      <span className={cn(
                        "text-sm font-bold font-mono",
                        alert.trendPercent >= 0 ? "text-destructive" : "text-status-positive"
                      )}>
                        {alert.trendPercent >= 0 ? '[↑]' : '[↓]'} {alert.trendPercent >= 0 ? '+' : ''}{alert.trendPercent.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Typ</span>
                      <span className="text-sm font-mono">
                        {alert.alertType === 'threshold_breach' ? '[TRÖSKELBROTT]' :
                         alert.alertType === 'velocity_warning' ? '[HASTIGHETSVARNING]' :
                         alert.alertType === 'trend_reversal' ? '[TRENDBRYTNING]' : '[KORRELATIONSBROTT]'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Prioritet</span>
                      <span className="text-sm font-mono">{alert.priorityIndex}/100</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="rounded-lg border bg-card p-4">
                <h4 className="text-xs font-mono text-muted-foreground mb-2">[BESKRIVNING]</h4>
                <p className="text-sm">{alert.description}</p>
              </div>

              {/* Upgrade Prompt for non-Pro users */}
              {!canAccessRootCause && (
                <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
                  <div className="flex items-start gap-3">
                    <span className="font-mono text-sm text-primary">[UPPGRADERA]</span>
                    <div>
                      <p className="text-sm font-medium">Lås upp guidad rotorsaksanalys</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Med Analyst-licens får du tillgång till AI-driven rotorsaksanalys som identifierar
                        primära och sekundära orsaker, korrelerade signaler och strukturella faktorer.
                      </p>
                      <Button variant="outline" size="sm" className="mt-2 font-mono text-xs">
                        [→ SE LICENSER]
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {!canAccessActionPlan && canAccessRootCause && (
                <div className="rounded-lg border border-accent/30 bg-accent/5 p-4">
                  <div className="flex items-start gap-3">
                    <span className="font-mono text-sm text-accent-foreground">[UPPGRADERA]</span>
                    <div>
                      <p className="text-sm font-medium">Lås upp handlingsplanering</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Med Institutional-licens får du tillgång till sannolikhetsoptimerade 
                        handlings- och implementationsplaner rangordnade efter ansträngning/effekt-principen.
                      </p>
                      <Button variant="outline" size="sm" className="mt-2 font-mono text-xs">
                        [→ SE LICENSER]
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="rootcause" className="space-y-4">
              {!rootCause && !isLoadingRootCause ? (
                <div className="text-center py-8">
                  <p className="font-mono text-lg text-muted-foreground mb-4">[ROTORSAKSANALYS]</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Identifierar primära och sekundära orsaker genom korrelationsanalys och historiska mönster.
                  </p>
                  <Button onClick={generateRootCauseAnalysis} className="font-mono">
                    [→ GENERERA ANALYS]
                  </Button>
                </div>
              ) : isLoadingRootCause ? (
                <div className="text-center py-12">
                  <p className="font-mono text-2xl animate-pulse mb-2">[...]</p>
                  <p className="text-sm text-muted-foreground">Analyserar rotorsaker...</p>
                </div>
              ) : rootCause && (
                <div className="space-y-4">
                  {/* Primary Causes */}
                  <div className="rounded-lg border bg-card p-4">
                    <h4 className="text-xs font-mono text-muted-foreground mb-3">[PRIMÄRA ORSAKER]</h4>
                    <div className="space-y-3">
                      {rootCause.primaryCauses.map((cause, i) => (
                        <div key={cause.id} className="border-l-2 border-primary pl-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{cause.cause}</span>
                            <Badge variant="outline" className="font-mono text-xs">
                              {cause.probability}% sannolikhet
                            </Badge>
                          </div>
                          <div className="mt-2">
                            <p className="text-[10px] font-mono text-muted-foreground">[EVIDENS]</p>
                            <ul className="text-xs text-muted-foreground mt-1 space-y-0.5">
                              {cause.evidence.map((e, j) => (
                                <li key={j} className="flex items-start gap-1">
                                  <span className="font-mono text-primary">•</span> {e}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {cause.relatedIndicators.map((ind) => (
                              <Badge key={ind} variant="secondary" className="text-[10px] font-mono">
                                {ind}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Secondary Causes */}
                  <div className="rounded-lg border bg-card p-4">
                    <h4 className="text-xs font-mono text-muted-foreground mb-3">[SEKUNDÄRA ORSAKER]</h4>
                    <div className="space-y-2">
                      {rootCause.secondaryCauses.map((cause, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="flex-1">
                            <span className="text-sm">{cause.cause}</span>
                          </div>
                          <div className="w-32">
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary/60 rounded-full"
                                style={{ width: `${cause.contributionPercent}%` }}
                              />
                            </div>
                          </div>
                          <span className="text-xs font-mono text-muted-foreground w-10">
                            {cause.contributionPercent}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Correlated Signals */}
                  <div className="rounded-lg border bg-card p-4">
                    <h4 className="text-xs font-mono text-muted-foreground mb-3">[KORRELERADE SIGNALER]</h4>
                    <div className="grid gap-2">
                      {rootCause.correlatedSignals.map((signal, i) => (
                        <div key={i} className="flex items-center justify-between text-sm">
                          <span>{signal.kpiName}</span>
                          <div className="flex items-center gap-4 font-mono text-xs">
                            <span className={cn(
                              signal.correlation >= 0.7 ? "text-status-positive" : "text-muted-foreground"
                            )}>
                              r={signal.correlation.toFixed(2)}
                            </span>
                            <span className="text-muted-foreground">
                              lag: {signal.lagMonths} mån
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Factors */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-lg border bg-card p-3">
                      <h5 className="text-[10px] font-mono text-muted-foreground mb-2">[STRUKTURELLA]</h5>
                      <ul className="text-xs space-y-1">
                        {rootCause.structuralFactors.map((f, i) => (
                          <li key={i} className="flex items-start gap-1">
                            <span className="font-mono text-primary shrink-0">→</span>
                            <span className="text-muted-foreground">{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-lg border bg-card p-3">
                      <h5 className="text-[10px] font-mono text-muted-foreground mb-2">[CYKLISKA]</h5>
                      <ul className="text-xs space-y-1">
                        {rootCause.cyclicalFactors.map((f, i) => (
                          <li key={i} className="flex items-start gap-1">
                            <span className="font-mono text-warning shrink-0">↻</span>
                            <span className="text-muted-foreground">{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-lg border bg-card p-3">
                      <h5 className="text-[10px] font-mono text-muted-foreground mb-2">[EXTERNA CHOCKER]</h5>
                      <ul className="text-xs space-y-1">
                        {rootCause.externalShocks.map((f, i) => (
                          <li key={i} className="flex items-start gap-1">
                            <span className="font-mono text-destructive shrink-0">!</span>
                            <span className="text-muted-foreground">{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="actions" className="space-y-4">
              {!actionPlan && !isLoadingActionPlan ? (
                <div className="text-center py-8">
                  <p className="font-mono text-lg text-muted-foreground mb-4">[HANDLINGSPLAN]</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Genererar sannolikhetsoptimerade åtgärder rangordnade efter ansträngning/effekt-principen.
                  </p>
                  <Button 
                    onClick={generateActionPlanAnalysis} 
                    disabled={!rootCause}
                    className="font-mono"
                  >
                    {rootCause ? '[→ GENERERA PLAN]' : '[!] KÖR ROTORSAKSANALYS FÖRST'}
                  </Button>
                </div>
              ) : isLoadingActionPlan ? (
                <div className="text-center py-12">
                  <p className="font-mono text-2xl animate-pulse mb-2">[...]</p>
                  <p className="text-sm text-muted-foreground">Optimerar handlingsplan...</p>
                </div>
              ) : actionPlan && (
                <div className="space-y-4">
                  {/* Quick Wins */}
                  <div className="rounded-lg border border-status-positive/30 bg-status-positive/5 p-4">
                    <h4 className="text-xs font-mono text-status-positive mb-2">[SNABBA VINSTER]</h4>
                    <ul className="space-y-1">
                      {actionPlan.quickWins.map((win, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <span className="font-mono text-status-positive">→</span>
                          {win}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Matrix */}
                  <div className="rounded-lg border bg-card p-4">
                    <h4 className="text-xs font-mono text-muted-foreground mb-3">[ÅTGÄRDSMATRIS - ANSTRÄNGNING/EFFEKT]</h4>
                    <div className="space-y-3">
                      {actionPlan.actions
                        .sort((a, b) => b.effortEffectRatio - a.effortEffectRatio)
                        .map((action, i) => (
                          <div 
                            key={action.id}
                            className={cn(
                              "rounded-lg border p-3",
                              i === 0 ? "border-primary/50 bg-primary/5" : "border-border"
                            )}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-xs text-muted-foreground">#{i + 1}</span>
                                  <span className="text-sm font-medium">{action.title}</span>
                                  {i === 0 && (
                                    <Badge className="font-mono text-[10px]">[★ REKOMMENDERAD]</Badge>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">{action.description}</p>
                              </div>
                              <div className="flex items-center gap-3 text-xs font-mono shrink-0">
                                <div className="text-center">
                                  <p className="text-[10px] text-muted-foreground">[EFFEKT]</p>
                                  <p className={cn(
                                    "font-bold",
                                    action.effectScore >= 7 ? "text-status-positive" : 
                                    action.effectScore >= 4 ? "text-status-warning" : "text-status-critical"
                                  )}>
                                    {action.effectScore}/10
                                  </p>
                                </div>
                                <div className="text-center">
                                  <p className="text-[10px] text-muted-foreground">[ANSTRÄNG]</p>
                                  <p className={cn(
                                    "font-bold",
                                    action.effortScore <= 3 ? "text-status-positive" : 
                                    action.effortScore <= 6 ? "text-status-warning" : "text-status-critical"
                                  )}>
                                    {action.effortScore}/10
                                  </p>
                                </div>
                                <div className="text-center border-l pl-3">
                                  <p className="text-[10px] text-muted-foreground">[RATIO]</p>
                                  <p className="font-bold text-primary">{action.effortEffectRatio.toFixed(2)}</p>
                                </div>
                              </div>
                            </div>

                            <div className="mt-3 grid grid-cols-4 gap-3 text-xs">
                              <div>
                                <p className="font-mono text-[10px] text-muted-foreground">[TIDSRAM]</p>
                                <p className="font-mono">
                                  {action.timeframe === 'immediate' ? 'Omedelbart' :
                                   action.timeframe === 'short_term' ? '0-6 mån' :
                                   action.timeframe === 'medium_term' ? '6-18 mån' : '18+ mån'}
                                </p>
                              </div>
                              <div>
                                <p className="font-mono text-[10px] text-muted-foreground">[ANSVARIG]</p>
                                <p>{action.responsibleEntity}</p>
                              </div>
                              <div>
                                <p className="font-mono text-[10px] text-muted-foreground">[FÖRVÄNTAD EFFEKT]</p>
                                <p>{action.expectedImpact}</p>
                              </div>
                              <div>
                                <p className="font-mono text-[10px] text-muted-foreground">[KONFIDENS]</p>
                                <p className="font-mono">{action.confidence}%</p>
                              </div>
                            </div>

                            {action.prerequisites.length > 0 && (
                              <div className="mt-2">
                                <p className="font-mono text-[10px] text-muted-foreground">[FÖRUTSÄTTNINGAR]</p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {action.prerequisites.map((pre, j) => (
                                    <Badge key={j} variant="outline" className="text-[10px]">{pre}</Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            {action.risks.length > 0 && (
                              <div className="mt-2">
                                <p className="font-mono text-[10px] text-muted-foreground">[RISKER]</p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {action.risks.map((risk, j) => (
                                    <Badge key={j} variant="secondary" className="text-[10px] bg-destructive/10 text-destructive">
                                      {risk}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Strategic Priorities */}
                  <div className="rounded-lg border bg-card p-4">
                    <h4 className="text-xs font-mono text-muted-foreground mb-2">[STRATEGISKA PRIORITERINGAR]</h4>
                    <ul className="space-y-1">
                      {actionPlan.strategicPriorities.map((priority, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <span className="font-mono text-primary">{i + 1}.</span>
                          {priority}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
