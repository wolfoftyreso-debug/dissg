/**
 * FACTOR DEEP DIVE - FULL EXPLANATION PYRAMID
 * ═══════════════════════════════════════════════════════════════
 * 
 * Multi-level deep dive following the 5-level explanation pyramid:
 * L1: Observation (Vad?)
 * L2: Mechanism (Varför?)
 * L3: Method (Hur vet vi?)
 * L4: Limitations (Vad visar detta INTE?)
 * L5: Raw Data (Underliggande siffror)
 * 
 * Every claim is clickable. Every number is traceable.
 */

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown,
  Clock, 
  BookOpen, 
  Globe, 
  ChevronRight,
  ExternalLink,
  History,
  FileText,
  Link2,
  Scale,
  CheckCircle2,
  XCircle,
  Download,
  Share2,
  Bookmark
} from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import type { CapacityFactor } from '@/config/carryingCapacityConfig';
import { 
  getFactorEvidence, 
  type FactorEvidence 
} from '@/lib/registry/factorEvidenceRegistry';

interface FactorDeepDiveProps {
  factor: CapacityFactor | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Evidence is now imported from factorEvidenceRegistry - no local definitions needed

// Sub-components
const ConfidenceBadge: React.FC<{ level: 'high' | 'medium' | 'low' }> = ({ level }) => {
  const config = {
    high: { label: 'Hög konfidens', variant: 'default' as const },
    medium: { label: 'Medel konfidens', variant: 'secondary' as const },
    low: { label: 'Låg konfidens', variant: 'destructive' as const }
  };
  return <Badge variant={config[level].variant}>{config[level].label}</Badge>;
};

const ImpactBadge: React.FC<{ impact: 'critical' | 'moderate' | 'minor' }> = ({ impact }) => {
  const config = {
    critical: { label: 'Kritisk', variant: 'destructive' as const },
    moderate: { label: 'Måttlig', variant: 'secondary' as const },
    minor: { label: 'Mindre', variant: 'default' as const }
  };
  return <Badge variant={config[impact].variant}>{config[impact].label}</Badge>;
};

const SourceReliabilityBar: React.FC<{ reliability: number }> = ({ reliability }) => (
  <div className="flex items-center gap-2">
    <Progress value={reliability} className="h-2 flex-1" />
    <span className="text-xs text-muted-foreground">{reliability}%</span>
  </div>
);

// Case study detail sheet
const CaseStudyDetail: React.FC<{
  caseStudy: FactorEvidence['cases'][0] | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}> = ({ caseStudy, open, onOpenChange }) => {
  if (!caseStudy) return null;
  
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            <SheetTitle>{caseStudy.region}</SheetTitle>
            <Badge variant="outline">{caseStudy.period}</Badge>
          </div>
          <SheetDescription>{caseStudy.description}</SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          {/* Outcome */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                {caseStudy.outcome === 'positive' ? (
                  <TrendingUp className="h-4 w-4 text-primary" />
                ) : caseStudy.outcome === 'negative' ? (
                  <TrendingDown className="h-4 w-4 text-destructive" />
                ) : (
                  <Scale className="h-4 w-4 text-muted-foreground" />
                )}
                Observerat utfall
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{caseStudy.impact}</p>
            </CardContent>
          </Card>
          
          {/* Key figures comparison */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Kvantitativ jämförelse</CardTitle>
              <CardDescription>Före och efter perioden</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {caseStudy.keyFigures.map((kf, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{kf.labelSv || kf.label}</span>
                      <span className="text-muted-foreground">{kf.unit}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>Före: {kf.before}</span>
                          <span>Efter: {kf.after}</span>
                        </div>
                        <div className="h-3 bg-muted rounded-full overflow-hidden flex">
                          <div 
                            className="h-full bg-muted-foreground/30" 
                            style={{ width: `${(kf.before / Math.max(kf.before, kf.after)) * 100}%` }} 
                          />
                        </div>
                        <div className="h-3 bg-primary/20 rounded-full overflow-hidden flex mt-1">
                          <div 
                            className="h-full bg-primary" 
                            style={{ width: `${(kf.after / Math.max(kf.before, kf.after)) * 100}%` }} 
                          />
                        </div>
                      </div>
                      <div className={`text-sm font-medium ${kf.changePercent >= 0 ? 'text-primary' : 'text-destructive'}`}>
                        {kf.changePercent >= 0 ? '+' : ''}{kf.changePercent}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Methodology */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Metod & tillvägagångssätt</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{caseStudy.methodology}</p>
            </CardContent>
          </Card>
          
          {/* Source */}
          <Card className="bg-muted/30">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-sm">
                <BookOpen className="h-4 w-4" />
                <span className="font-medium">Källa:</span>
                <span className="text-muted-foreground">{caseStudy.source}</span>
                <ExternalLink className="h-3 w-3 ml-auto cursor-pointer hover:text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export const FactorDeepDive: React.FC<FactorDeepDiveProps> = ({ 
  factor, 
  open, 
  onOpenChange 
}) => {
  const [selectedCase, setSelectedCase] = useState<FactorEvidence['cases'][0] | null>(null);
  const [activeLevel, setActiveLevel] = useState<'L1' | 'L2' | 'L3' | 'L4' | 'L5'>('L1');
  
  if (!factor) return null;
  
  const evidence = getFactorEvidence(factor.id);
  if (!evidence) return null;
  
  // Levels use text descriptions instead of abstract icons
  const levels = [
    { id: 'L1', label: 'Observation', description: 'Vad ser vi i datan?' },
    { id: 'L2', label: 'Mekanism', description: 'Hur fungerar sambandet?' },
    { id: 'L3', label: 'Metod', description: 'Hur vet vi detta?' },
    { id: 'L4', label: 'Begränsningar', description: 'Vad visar detta INTE?' },
    { id: 'L5', label: 'Rådata', description: 'Underliggande siffror' }
  ];
  
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-5xl max-h-[90vh] p-0">
          <div className="flex h-full">
            {/* Level navigation sidebar - text-based, no icons */}
            <div className="w-48 border-r bg-muted/30 p-4 flex-shrink-0">
              <div className="space-y-1">
                {levels.map((level) => {
                  const isActive = activeLevel === level.id;
                  return (
                    <button
                      key={level.id}
                      onClick={() => setActiveLevel(level.id as any)}
                      className={`w-full text-left p-3 rounded-lg transition-all ${
                        isActive 
                          ? 'bg-primary text-primary-foreground' 
                          : 'hover:bg-muted'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono opacity-60">{level.id}</span>
                        <span className="text-sm font-medium">{level.label}</span>
                      </div>
                      <p className={`text-xs mt-1 ${isActive ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                        {level.description}
                      </p>
                    </button>
                  );
                })}
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                  <Download className="h-3 w-3 mr-2" />
                  Exportera
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                  <Share2 className="h-3 w-3 mr-2" />
                  Dela
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                  <Bookmark className="h-3 w-3 mr-2" />
                  Spara
                </Button>
              </div>
            </div>
            
            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0">
              <DialogHeader className="p-6 pb-4 border-b">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    factor.impact === 'high' ? 'bg-green-500' : 'bg-yellow-500'
                  }`} />
                  <DialogTitle className="text-xl">{factor.labelSv}</DialogTitle>
                  <Badge variant="outline">{factor.timeframeSv}</Badge>
                </div>
                <DialogDescription className="mt-2">
                  {factor.descriptionSv}
                </DialogDescription>
              </DialogHeader>
              
              <ScrollArea className="flex-1 p-6">
                {/* L1: Observation */}
                {activeLevel === 'L1' && (
                  <div className="space-y-6">
                    {/* Key metric */}
                    <Card className="bg-primary/5 border-primary/20">
                      <CardContent className="pt-6">
                        <div className="text-center">
                        <div className="text-4xl font-bold text-primary">
                            {evidence.observation.keyMetric.value}{evidence.observation.keyMetric.unit}
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">
                            {evidence.observation.keyMetric.changePeriod}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Summary */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Sammanfattning</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm leading-relaxed">{evidence.observation.summary}</p>
                        <p className="text-sm text-muted-foreground mt-4 italic">
                          {evidence.observation.globalPattern}
                        </p>
                      </CardContent>
                    </Card>
                    
                    {/* This shows / does not show */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <Card className="border-primary/30">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm flex items-center gap-2 text-primary">
                            <CheckCircle2 className="h-4 w-4" />
                            Detta visar
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {evidence.observation.thisShows.map((item, idx) => (
                              <li key={idx} className="text-sm flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                      
                      <Card className="border-destructive/30">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm flex items-center gap-2 text-destructive">
                            <XCircle className="h-4 w-4" />
                            Detta visar INTE
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {evidence.observation.thisDoesNotShow.map((item, idx) => (
                              <li key={idx} className="text-sm flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-destructive mt-2 shrink-0" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                    
                    {/* Historical cases */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm flex items-center gap-2">
                          <History className="h-4 w-4" />
                          Historiska fallstudier
                        </CardTitle>
                        <CardDescription>Klicka för full fördjupning</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {evidence.cases.map((caseStudy, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedCase(caseStudy)}
                            className="w-full p-4 border rounded-lg hover:bg-muted/30 hover:border-primary/50 transition-all text-left group"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Globe className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">{caseStudy.region}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">{caseStudy.period}</Badge>
                                {caseStudy.outcome === 'positive' && <TrendingUp className="h-4 w-4 text-primary" />}
                                {caseStudy.outcome === 'negative' && <TrendingDown className="h-4 w-4 text-destructive" />}
                                {caseStudy.outcome === 'mixed' && <Scale className="h-4 w-4 text-muted-foreground" />}
                                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">{caseStudy.description}</p>
                          </button>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                )}
                
                {/* L2: Mechanism */}
                {activeLevel === 'L2' && (
                  <div className="space-y-6">
                    {/* Causal chain */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Link2 className="h-4 w-4" />
                          Kausalkedja (hypotetisk)
                        </CardTitle>
                        <CardDescription>Varje steg har osäkerhet – detta är en modell, inte bevisad sanning</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {evidence.mechanism.causalChain.map((step, idx) => (
                            <div key={idx} className="flex items-start gap-4">
                              <div className="flex flex-col items-center">
                                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                                  {step.step}
                                </div>
                                {idx < evidence.mechanism.causalChain.length - 1 && (
                                  <div className="w-0.5 h-8 bg-border mt-2" />
                                )}
                              </div>
                              <div className="flex-1 pt-1">
                                <p className="text-sm">{step.description}</p>
                                <div className="mt-2">
                                  <ConfidenceBadge level={step.confidence} />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Primary drivers */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Primära drivkrafter</CardTitle>
                        <CardDescription>Relativ betydelse enligt modellen</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {evidence.mechanism.primaryDrivers.map((driver, idx) => (
                          <div key={idx}>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium">{driver.name}</span>
                              <span className="text-sm text-muted-foreground">{driver.contribution}%</span>
                            </div>
                            <Progress value={driver.contribution} className="h-2" />
                            <p className="text-xs text-muted-foreground mt-1">{driver.description}</p>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                    
                    {/* Feedback loops */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Återkopplingsslingor</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {evidence.mechanism.feedbackLoops.map((loop, idx) => (
                          <div key={idx} className={`p-3 rounded-lg border-l-4 ${
                            loop.type === 'positive' ? 'border-l-green-500 bg-green-50 dark:bg-green-950/30' : 'border-l-red-500 bg-red-50 dark:bg-red-950/30'
                          }`}>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="text-xs">
                                {loop.type === 'positive' ? '+ Förstärkande' : '− Dämpande'}
                              </Badge>
                            </div>
                            <p className="text-sm">{loop.description}</p>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                    
                    {/* Time lag */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Tidsfördröjning
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-4 mb-4">
                          <Badge variant="outline" className="text-lg px-4 py-2">
                            {evidence.mechanism.timelag.min}–{evidence.mechanism.timelag.max} {evidence.mechanism.timelag.unit}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{evidence.mechanism.timelag.explanation}</p>
                      </CardContent>
                    </Card>
                  </div>
                )}
                
                {/* L3: Methodology */}
                {activeLevel === 'L3' && (
                  <div className="space-y-6">
                    <Alert>
                      <AlertTitle>Metodtransparens</AlertTitle>
                      <AlertDescription>
                        Alla analyser ska kunna granskas och ifrågasättas. Här visar vi exakt hur slutsatserna är framtagna.
                      </AlertDescription>
                    </Alert>
                    
                    {/* Data collection */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Datainsamling</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <span className="text-xs text-muted-foreground">Metod</span>
                            <p className="text-sm font-medium">{evidence.methodology.dataCollection.method}</p>
                          </div>
                          <div>
                            <span className="text-xs text-muted-foreground">Frekvens</span>
                            <p className="text-sm font-medium">{evidence.methodology.dataCollection.frequency}</p>
                          </div>
                          <div>
                            <span className="text-xs text-muted-foreground">Geografisk täckning</span>
                            <p className="text-sm font-medium">{evidence.methodology.dataCollection.coverage}%</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Statistical approach */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Statistisk metod</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">{evidence.methodology.statisticalApproach}</p>
                      </CardContent>
                    </Card>
                    
                    {/* Validation */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Validering</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <span className="text-xs text-muted-foreground">Valideringsmetod</span>
                          <p className="text-sm">{evidence.methodology.validationMethod}</p>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Peer review</span>
                          <Badge variant={evidence.methodology.peerReview.status === 'yes' ? 'default' : 'secondary'}>
                            {evidence.methodology.peerReview.status === 'yes' ? 'Ja' : evidence.methodology.peerReview.status === 'partial' ? 'Delvis' : 'Nej'}
                          </Badge>
                        </div>
                        {evidence.methodology.peerReview.journals.length > 0 && (
                          <p className="text-sm text-muted-foreground">Publicerad i: {evidence.methodology.peerReview.journals.join(', ')}</p>
                        )}
                      </CardContent>
                    </Card>
                    
                    {/* Replication */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Replikeringsförsök</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-4 mb-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary">{evidence.methodology.replicationAttempts.successful}</div>
                            <div className="text-xs text-muted-foreground">Lyckade</div>
                          </div>
                          <div className="text-muted-foreground">/</div>
                          <div className="text-center">
                            <div className="text-2xl font-bold">{evidence.methodology.replicationAttempts.total}</div>
                            <div className="text-xs text-muted-foreground">Totalt</div>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{evidence.methodology.replicationAttempts.detailsSv || evidence.methodology.replicationAttempts.details}</p>
                      </CardContent>
                    </Card>
                    
                    {/* Alternative interpretations */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Alternativa tolkningar</CardTitle>
                        <CardDescription>Andra sätt att förklara samma data — vetenskaplig ödmjukhet</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Accordion type="single" collapsible>
                          {evidence.methodology.alternativeInterpretations.map((alt, idx) => (
                            <AccordionItem key={idx} value={`alt-${idx}`}>
                              <AccordionTrigger className="text-sm">{alt.interpretationSv || alt.interpretation}</AccordionTrigger>
                              <AccordionContent className="text-sm text-muted-foreground">
                                <p>{alt.interpretationSv || alt.interpretation}</p>
                                {alt.proponents && <p className="mt-2 text-xs">Förespråkare: {alt.proponents}</p>}
                                {alt.counterEvidence && <p className="mt-1 text-xs">Motbevis: {alt.counterEvidence}</p>}
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </CardContent>
                    </Card>
                  </div>
                )}
                
                {/* L4: Limitations */}
                {activeLevel === 'L4' && (
                  <div className="space-y-6">
                    <Alert variant="destructive" className="bg-destructive/10 border-destructive/30">
                      <AlertTitle>⚠ Obligatorisk begränsningsvy</AlertTitle>
                      <AlertDescription>
                        Ingen analys är komplett utan att förstå dess begränsningar. Läs detta innan du drar slutsatser.
                      </AlertDescription>
                    </Alert>
                    
                    {/* Data gaps */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Dataluckor</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {evidence.limitations.dataGaps.map((gap, idx) => (
                          <div key={idx} className="flex items-start justify-between p-3 border rounded-lg">
                            <div className="flex-1">
                              <span className="text-sm">{gap.gapSv || gap.gap}</span>
                              {gap.potentialSolution && (
                                <p className="text-xs text-muted-foreground mt-1">Möjlig lösning: {gap.potentialSolution}</p>
                              )}
                            </div>
                            <ImpactBadge impact={gap.impact} />
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                    
                    {/* Methodological weaknesses */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Metodologiska svagheter</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {evidence.limitations.methodologicalWeaknesses.map((w, idx) => (
                            <li key={idx} className="text-sm flex items-start gap-2">
                              <span className={`text-sm shrink-0 ${w.severity === 'high' ? 'text-destructive' : w.severity === 'medium' ? 'text-amber-600' : 'text-muted-foreground'}`}>
                                {w.severity === 'high' ? '●' : w.severity === 'medium' ? '◐' : '○'}
                              </span>
                              <div>
                                <span>{w.weaknessSv || w.weakness}</span>
                                {w.mitigation && <p className="text-xs text-muted-foreground mt-1">Åtgärd: {w.mitigation}</p>}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                    
                    {/* Confounding factors */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Confounders (störfaktorer)</CardTitle>
                        <CardDescription>Variabler som kan påverka resultaten</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {evidence.limitations.confoundingFactors.map((cf, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2 border rounded">
                              <span className="text-sm">{cf.factorSv || cf.factor}</span>
                              <Badge variant={cf.controlled ? 'default' : 'destructive'}>
                                {cf.controlled ? 'Kontrollerad' : 'Ej kontrollerad'}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Expert dissent */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Experter som inte håller med</CardTitle>
                        <CardDescription>Vetenskaplig debatt och motstående perspektiv</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {evidence.limitations.expertDissent.map((dissent, idx) => (
                          <div key={idx} className="p-3 border rounded-lg bg-muted/30">
                            <p className="text-sm italic">"{dissent.perspectiveSv || dissent.perspective}"</p>
                            <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <BookOpen className="h-3 w-3" />
                                <span>{dissent.source} ({dissent.year})</span>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {dissent.credibility === 'high' ? 'Hög trovärdighet' : dissent.credibility === 'medium' ? 'Medel' : 'Låg'}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                )}
                
                {/* L5: Raw Data */}
                {activeLevel === 'L5' && (
                  <div className="space-y-6">
                    {/* Time series chart */}
                    {evidence.rawData.timeSeries.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Tidsserie</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={evidence.rawData.timeSeries}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip />
                                <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.2)" />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                    
                    {/* Regional breakdown */}
                    {evidence.rawData.regionalBreakdown.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Regional fördelning</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={evidence.rawData.regionalBreakdown} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" tick={{ fontSize: 12 }} />
                                <YAxis dataKey="region" type="category" tick={{ fontSize: 12 }} width={100} />
                                <Tooltip />
                                <Bar dataKey="value" fill="hsl(var(--primary))" />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                    
                    {/* Sources */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Datakällor</CardTitle>
                        <CardDescription>Ursprung och tillförlitlighet</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {evidence.rawData.sources.map((source, idx) => (
                          <div key={idx} className="p-3 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                <span className="font-medium text-sm">{source.name}</span>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {source.type === 'official' ? 'Officiell' : source.type === 'academic' ? 'Akademisk' : 'Institutionell'}
                              </Badge>
                            </div>
                            <div className="space-y-2">
                              <SourceReliabilityBar reliability={source.reliability} />
                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span>Senast uppdaterad: {source.lastUpdated}</span>
                                <a href={source.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary">
                                  <ExternalLink className="h-3 w-3" />
                                  Öppna källa
                                </a>
                              </div>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                    
                    {/* Download options */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Ladda ner rådata</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-2">
                          {evidence.rawData.downloadFormats.map((format, idx) => (
                            <Button key={idx} variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-2" />
                              {format}
                            </Button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Related indicators */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Relaterade indikatorer</CardTitle>
                        <CardDescription>Korrelationer (ej kausalitet)</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {evidence.relatedIndicators.map((indicator, idx) => (
                          <button key={idx} className="w-full p-3 border rounded-lg hover:bg-muted/30 hover:border-primary/50 transition-all text-left">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-mono text-xs text-muted-foreground">{indicator.code}</span>
                              <Badge variant={indicator.correlation > 0 ? 'default' : 'destructive'}>
                                r = {indicator.correlation > 0 ? '+' : ''}{indicator.correlation.toFixed(2)}
                              </Badge>
                            </div>
                            <div className="font-medium text-sm">{indicator.nameSv || indicator.name}</div>
                            <p className="text-xs text-muted-foreground mt-1">{indicator.descriptionSv || indicator.description}</p>
                          </button>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Case study detail sheet */}
      <CaseStudyDetail 
        caseStudy={selectedCase} 
        open={selectedCase !== null} 
        onOpenChange={(open) => !open && setSelectedCase(null)} 
      />
    </>
  );
};
