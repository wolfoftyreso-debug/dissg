/**
 * SYSTEM MEMORY & LONG ARC ARCHIVE (LAA)
 * BLOCK XA–XI: Tidens ryggrad
 * 
 * OBRYTBAR PRINCIP:
 * Utan historiskt djup ser varje våg ut som en tsunami.
 * Systemets jobb är att visa havet.
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  Clock, Archive, TrendingUp, Layers, History, Scale, MessageSquare, 
  Users, Sparkles, Shield, ChevronRight, AlertTriangle, CheckCircle, 
  Info, Eye, Database, XCircle, BookOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  LAA_CORE_PRINCIPLE,
  PHASE_DEFINITIONS,
  HISTORICAL_PARALLELS,
  SCALE_NORMALIZATIONS,
  NARRATIVE_DRIFTS,
  GENERATIONAL_VIEWS,
  GENUINE_NOVELTIES,
  ARCHIVAL_INTEGRITY_SAMPLES,
  CURRENT_LONG_VIEW,
  DOMAIN_LABELS,
  MOCK_PATTERNS,
  MOCK_MISINTERPRETATIONS,
  MOCK_PREDICTIONS,
  type StructuralPhase,
  type LongViewStatus,
  type NoveltyType,
  type HistoricalPattern,
  type HistoricalMisinterpretation,
  type HistoricalPrediction,
} from '@/config/systemMemoryConfig';

export function SystemMemoryArchive() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Archive className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">System Memory & Long Arc Archive</h1>
          <p className="text-sm text-muted-foreground">
            {LAA_CORE_PRINCIPLE.systemQuestion}
          </p>
        </div>
      </div>

      {/* Core Principle */}
      <Alert className="border-primary/30 bg-primary/5">
        <Clock className="h-4 w-4" />
        <AlertDescription className="text-sm italic">
          "{LAA_CORE_PRINCIPLE.statementSv}"
        </AlertDescription>
      </Alert>

      {/* BLOCK XI — Long View Widget */}
      <LongViewWidget />

      <Tabs defaultValue="phases" className="space-y-4">
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="phases">Faser (XB)</TabsTrigger>
          <TabsTrigger value="parallels">"Hänt förut?" (XC)</TabsTrigger>
          <TabsTrigger value="scale">Skala (XD)</TabsTrigger>
          <TabsTrigger value="narrative">Narrativ (XE)</TabsTrigger>
          <TabsTrigger value="generations">Generationer (XF)</TabsTrigger>
          <TabsTrigger value="novelty">Nytt (XG)</TabsTrigger>
          <TabsTrigger value="integrity">Integritet (XH)</TabsTrigger>
          <TabsTrigger value="patterns">Mönster</TabsTrigger>
          <TabsTrigger value="misinterpretations">Feltolkningar</TabsTrigger>
        </TabsList>

        {/* BLOCK XB — Structural Phase Detection */}
        <TabsContent value="phases" className="space-y-4">
          <StructuralPhasesView />
        </TabsContent>

        {/* BLOCK XC — Historical Parallels */}
        <TabsContent value="parallels" className="space-y-4">
          <HistoricalParallelsView />
        </TabsContent>

        {/* BLOCK XD — Scale Normalization */}
        <TabsContent value="scale" className="space-y-4">
          <ScaleNormalizationView />
        </TabsContent>

        {/* BLOCK XE — Narrative Drift */}
        <TabsContent value="narrative" className="space-y-4">
          <NarrativeDriftView />
        </TabsContent>

        {/* BLOCK XF — Generational Memory */}
        <TabsContent value="generations" className="space-y-4">
          <GenerationalMemoryView />
        </TabsContent>

        {/* BLOCK XG — What Is Actually New */}
        <TabsContent value="novelty" className="space-y-4">
          <GenuineNoveltyView />
        </TabsContent>

        {/* BLOCK XH — Archival Integrity */}
        <TabsContent value="integrity" className="space-y-4">
          <ArchivalIntegrityView />
        </TabsContent>

        {/* Historical Patterns (Original SMA) */}
        <TabsContent value="patterns" className="space-y-4">
          {MOCK_PATTERNS.map((pattern) => (
            <HistoricalPatternCard key={pattern.id} pattern={pattern} />
          ))}
        </TabsContent>

        {/* Misinterpretations */}
        <TabsContent value="misinterpretations" className="space-y-4">
          {MOCK_MISINTERPRETATIONS.map((mis) => (
            <MisinterpretationCard key={mis.id} misinterpretation={mis} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function LongViewWidget() {
  const view = CURRENT_LONG_VIEW;
  
  const statusColors: Record<LongViewStatus, string> = {
    stable_cycle: 'text-success',
    breakpoint: 'text-destructive',
    transition_phase: 'text-warning',
    uncertain: 'text-muted-foreground',
  };

  const statusIcons: Record<LongViewStatus, React.ReactNode> = {
    stable_cycle: <CheckCircle className="h-5 w-5" />,
    breakpoint: <AlertTriangle className="h-5 w-5" />,
    transition_phase: <TrendingUp className="h-5 w-5" />,
    uncertain: <Info className="h-5 w-5" />,
  };

  return (
    <Card className="border-2 border-primary/30 bg-gradient-to-r from-primary/5 to-transparent">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Long-term Context
          </CardTitle>
          <div className={cn("flex items-center gap-2", statusColors[view.overallStatus])}>
            {statusIcons[view.overallStatus]}
            <span className="font-semibold">{view.statusLabelSv}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{view.shortDescriptionSv}</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {view.keyDomainPhases.map((dp) => (
            <div key={dp.domain} className="p-2 bg-muted/50 rounded text-center">
              <p className="text-xs font-medium">{DOMAIN_LABELS[dp.domain].sv}</p>
              <Badge variant="outline" className="text-xs mt-1">
                {PHASE_DEFINITIONS[dp.phase].nameSv}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function StructuralPhasesView() {
  const [selectedPhase, setSelectedPhase] = useState<StructuralPhase>('transition');
  const phase = PHASE_DEFINITIONS[selectedPhase];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {Object.values(PHASE_DEFINITIONS).map((p) => (
          <Button
            key={p.phase}
            variant={selectedPhase === p.phase ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedPhase(p.phase)}
          >
            {p.nameSv}
          </Button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{phase.nameSv}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{phase.descriptionSv}</p>

          <div>
            <p className="text-sm font-medium mb-2">Typiska indikatorer:</p>
            <div className="flex flex-wrap gap-2">
              {phase.typicalIndicators.map((ind, i) => (
                <Badge key={i} variant="secondary" className="text-xs">{ind}</Badge>
              ))}
            </div>
          </div>

          <div className="p-3 bg-muted/50 rounded">
            <p className="text-sm font-medium mb-2">Historiska exempel:</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              {phase.historicalExamples.map((ex, i) => (
                <li key={i} className="flex items-center gap-2">
                  <ChevronRight className="h-3 w-3" />
                  {ex}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function HistoricalParallelsView() {
  const [selected, setSelected] = useState(0);
  const parallel = HISTORICAL_PARALLELS[selected];

  return (
    <div className="space-y-4">
      <Alert className="border-primary/20">
        <History className="h-4 w-4" />
        <AlertDescription className="text-sm">
          "Har detta hänt förut?" – Slår hål på både alarmism och förnekelse.
        </AlertDescription>
      </Alert>

      <div className="flex flex-wrap gap-2">
        {HISTORICAL_PARALLELS.map((p, i) => (
          <Button key={p.id} variant={selected === i ? "default" : "outline"} size="sm" onClick={() => setSelected(i)}>
            {p.currentSituationSv}
          </Button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{parallel.currentSituationSv}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {parallel.historicalPeriods.map((period, i) => (
            <div key={i} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{period.period}</h4>
                <Badge variant="outline">{period.years}</Badge>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="p-2 bg-success/5 rounded border border-success/20">
                  <p className="text-xs font-medium text-success mb-1">Likheter:</p>
                  <ul className="text-xs text-muted-foreground">
                    {period.similarities.map((s, j) => <li key={j}>• {s}</li>)}
                  </ul>
                </div>
                <div className="p-2 bg-destructive/5 rounded border border-destructive/20">
                  <p className="text-xs font-medium text-destructive mb-1">Skillnader:</p>
                  <ul className="text-xs text-muted-foreground">
                    {period.differences.map((d, j) => <li key={j}>• {d}</li>)}
                  </ul>
                </div>
              </div>
              <div className="p-2 bg-muted/50 rounded">
                <p className="text-xs"><strong>Utfall:</strong> {period.outcomeSv}</p>
              </div>
            </div>
          ))}
          <Alert className="border-primary/30 bg-primary/5">
            <Sparkles className="h-4 w-4" />
            <AlertDescription><strong>Slutsats:</strong> {parallel.conclusionSv}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}

function ScaleNormalizationView() {
  return (
    <div className="space-y-4">
      <Alert className="border-primary/20">
        <Scale className="h-4 w-4" />
        <AlertDescription>Hur stora är dagens förändringar relativt historien? Ger proportion utan värdering.</AlertDescription>
      </Alert>
      <div className="grid md:grid-cols-2 gap-4">
        {SCALE_NORMALIZATIONS.map((norm) => (
          <Card key={norm.metric} className={cn(norm.isExceptional && "border-warning/50 bg-warning/5")}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center justify-between">
                {norm.metricSv}
                {norm.isExceptional && <Badge className="bg-warning text-warning-foreground">Exceptionellt</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Min: {norm.historicalRange.min}</span>
                <span>Median: {norm.historicalRange.median}</span>
                <span>Max: {norm.historicalRange.max}</span>
              </div>
              <div className="relative h-2 bg-muted rounded-full">
                <div className="absolute h-2 bg-primary rounded-full" style={{ width: `${norm.percentilePosition}%` }} />
              </div>
              <p className="text-xs text-center text-muted-foreground">Percentil: {norm.percentilePosition}%</p>
              <p className="text-xs text-muted-foreground p-2 bg-muted/50 rounded">{norm.interpretationSv}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function NarrativeDriftView() {
  return (
    <div className="space-y-4">
      <Alert className="border-primary/20">
        <MessageSquare className="h-4 w-4" />
        <AlertDescription>Har språket ändrats snabbare än verkligheten?</AlertDescription>
      </Alert>
      {NARRATIVE_DRIFTS.map((drift) => (
        <Card key={drift.topic}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{drift.topicSv}</CardTitle>
              <Badge variant={drift.drift === 'increasing_dramatization' ? 'destructive' : 'secondary'}>
                {drift.drift === 'increasing_dramatization' ? 'Ökande dramatisering' : 'Stabil'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Era</th>
                    <th className="text-left py-2">Typiskt språk</th>
                    <th className="text-center py-2">Dramatik</th>
                    <th className="text-center py-2">Faktisk svårighet</th>
                  </tr>
                </thead>
                <tbody>
                  {drift.periods.map((period) => (
                    <tr key={period.era} className="border-b border-muted">
                      <td className="py-2"><strong>{period.era}</strong> <span className="text-muted-foreground text-xs">({period.years})</span></td>
                      <td className="py-2">
                        <div className="flex flex-wrap gap-1">
                          {period.typicalLanguage.map((w, i) => <Badge key={i} variant="outline" className="text-xs">{w}</Badge>)}
                        </div>
                      </td>
                      <td className="py-2"><Progress value={period.dramaticIntensity * 10} className="w-16 h-2 mx-auto" /></td>
                      <td className="py-2"><Progress value={period.actualSeverity * 10} className="w-16 h-2 mx-auto" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-muted-foreground mt-3 p-2 bg-muted/50 rounded">{drift.insightSv}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function GenerationalMemoryView() {
  return (
    <div className="space-y-4">
      <Alert className="border-primary/20">
        <Users className="h-4 w-4" />
        <AlertDescription>Förklarar varför människor uppfattar världen olika baserat på formativa erfarenheter.</AlertDescription>
      </Alert>
      {GENERATIONAL_VIEWS.map((gen) => (
        <Card key={gen.generationName}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{gen.generationName}</CardTitle>
              <Badge variant="outline">Födda {gen.birthYears}</Badge>
            </div>
            <CardDescription>Formativa år: {gen.formativeYears}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid md:grid-cols-2 gap-3">
              <div className="p-2 bg-success/5 rounded border border-success/20">
                <p className="text-xs font-medium text-success mb-1">Upplevt:</p>
                <ul className="text-xs text-muted-foreground">{gen.majorEventsExperienced.map((e, i) => <li key={i}>• {e}</li>)}</ul>
              </div>
              <div className="p-2 bg-muted/50 rounded">
                <p className="text-xs font-medium mb-1">Inte upplevt:</p>
                <ul className="text-xs text-muted-foreground">{gen.majorEventsNotExperienced.map((e, i) => <li key={i}>• {e}</li>)}</ul>
              </div>
            </div>
            <div className="p-2 bg-primary/5 rounded border border-primary/20">
              <p className="text-xs font-medium text-primary mb-1">Troligt perspektiv:</p>
              <p className="text-xs text-muted-foreground">{gen.likelyPerspectiveSv}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function GenuineNoveltyView() {
  const noveltyLabels: Record<NoveltyType, string> = {
    new_scale: 'Ny skala',
    new_speed: 'Ny hastighet',
    new_combination: 'Ny kombination',
    new_scope: 'Ny omfattning',
  };

  return (
    <div className="space-y-4">
      <Alert className="border-success/30 bg-success/5">
        <Sparkles className="h-4 w-4" />
        <AlertDescription>"Detta är genuint nytt i historisk kontext" – fenomen utan tydliga paralleller</AlertDescription>
      </Alert>
      <div className="grid md:grid-cols-2 gap-4">
        {GENUINE_NOVELTIES.map((novelty) => (
          <Card key={novelty.phenomenon}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">{novelty.phenomenonSv}</CardTitle>
              <div className="flex flex-wrap gap-1 mt-1">
                {novelty.noveltyTypes.map((type) => <Badge key={type} className="text-xs">{noveltyLabels[type]}</Badge>)}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-2 bg-success/5 rounded border border-success/20">
                <p className="text-xs font-medium text-success mb-1">Varför nytt:</p>
                <p className="text-xs text-muted-foreground">{novelty.whyNewSv}</p>
              </div>
              <div className="p-2 bg-muted/50 rounded">
                <p className="text-xs font-medium mb-1">Vad som INTE är nytt:</p>
                <p className="text-xs text-muted-foreground">{novelty.whatIsNotNewSv}</p>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Konfidens:</span>
                <div className="flex items-center gap-2">
                  <Progress value={novelty.confidence} className="w-16 h-1.5" />
                  <span>{novelty.confidence}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ArchivalIntegrityView() {
  return (
    <div className="space-y-4">
      <Alert className="border-warning/30 bg-warning/5">
        <Shield className="h-4 w-4" />
        <AlertDescription>Historien är också osäker – det visas öppet med kända metodbrott.</AlertDescription>
      </Alert>
      <div className="grid md:grid-cols-2 gap-4">
        {ARCHIVAL_INTEGRITY_SAMPLES.map((archive) => (
          <Card key={archive.datasetNameSv}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">{archive.datasetNameSv}</CardTitle>
              <CardDescription className="text-xs">Period: {archive.periodCovered}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-1">
                {archive.sources.map((src, i) => <Badge key={i} variant="secondary" className="text-xs">{src}</Badge>)}
              </div>
              <div>
                <p className="text-xs font-medium mb-2">Kända metodbrott:</p>
                {archive.knownMethodologyBreaks.map((brk, i) => (
                  <div key={i} className={cn("p-2 rounded text-xs mb-1", brk.impact === 'significant' ? 'bg-destructive/10' : brk.impact === 'moderate' ? 'bg-warning/10' : 'bg-muted/50')}>
                    <strong>{brk.year}:</strong> {brk.descriptionSv}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Konfidens:</span>
                <Progress value={archive.confidence} className="w-16 h-1.5" />
                <span className="text-xs">{archive.confidence}%</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function HistoricalPatternCard({ pattern }: { pattern: HistoricalPattern }) {
  const riskColors = { dormant: 'bg-muted', low: 'bg-success/20', elevated: 'bg-warning/20', high: 'bg-destructive/20', imminent: 'bg-destructive' };
  const riskLabels = { dormant: 'Vilande', low: 'Låg', elevated: 'Förhöjd', high: 'Hög', imminent: 'Överhängande' };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <Badge variant="outline" className="text-xs mb-2">{pattern.code}</Badge>
            <CardTitle className="text-lg">{pattern.titleSv}</CardTitle>
          </div>
          <Badge className={cn(riskColors[pattern.currentRiskLevel])}>Risk: {riskLabels[pattern.currentRiskLevel]}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{pattern.descriptionSv}</p>
        <div className="flex items-center gap-4 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>Genomsnittlig cykel: <strong>{pattern.averageCycleYears} år</strong></span>
        </div>
        <div className="p-3 bg-warning/10 rounded-lg">
          <p className="text-xs font-medium text-warning mb-2 flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> Varningsindikatorer:</p>
          <div className="flex flex-wrap gap-1">
            {pattern.warningIndicatorsSv.map((ind, i) => <Badge key={i} variant="outline" className="text-xs">{ind}</Badge>)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MisinterpretationCard({ misinterpretation }: { misinterpretation: HistoricalMisinterpretation }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base">{misinterpretation.eventSv}</CardTitle>
          <Badge variant="outline">{misinterpretation.year}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-3 bg-destructive/10 rounded-lg">
          <p className="text-xs font-medium text-destructive mb-1">Ursprunglig tolkning:</p>
          <p className="text-sm">{misinterpretation.originalInterpretationSv}</p>
        </div>
        <div className="p-3 bg-success/10 rounded-lg">
          <p className="text-xs font-medium text-success mb-1">Faktisk orsak:</p>
          <p className="text-sm">{misinterpretation.actualCauseSv}</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>Tid att korrigera: <strong>{misinterpretation.howLongToCorrect}</strong></span>
        </div>
        {misinterpretation.stillRepeated && (
          <Badge variant="destructive" className="flex items-center gap-1 w-fit">
            <AlertTriangle className="h-3 w-3" /> Upprepas fortfarande
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}
