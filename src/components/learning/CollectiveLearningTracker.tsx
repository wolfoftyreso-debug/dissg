/**
 * COLLECTIVE LEARNING TRACKER (CLT)
 * "Vad har världen lärt sig – och vad upprepar den?"
 * 
 * Systemets långminne. Observerad förändring i beteende och utfall.
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, TrendingUp, TrendingDown, RefreshCw, Clock, Globe,
  AlertTriangle, CheckCircle, XCircle, Lightbulb, ArrowRight,
  BarChart3, Zap, Eye, ChevronDown, ChevronUp, Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  CLT_CORE_PRINCIPLE,
  LEARNING_CLASSIFICATION_LABELS,
  MOCK_PATTERNS,
  MOCK_DOMAIN_STATUS,
  MOCK_REPEATED_PATTERNS,
  MOCK_SCIENCE_GAPS,
  MOCK_POSITIVE_DEVIATIONS,
  MOCK_ATTENTION_LEARNING,
  MOCK_COLLECTIVE_MEMORY,
  type HistoricalPattern,
  type DomainLearningStatus,
  type RepeatedPattern,
  type ScienceActionGap,
  type PositiveDeviation,
  type LearningClassification,
} from '@/config/collectiveLearningConfig';

export function CollectiveLearningTracker() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Brain className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Collective Learning Tracker</h1>
          <p className="text-sm text-muted-foreground">
            {CLT_CORE_PRINCIPLE.systemQuestion}
          </p>
        </div>
      </div>

      {/* Core principle */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription className="italic">
          "{CLT_CORE_PRINCIPLE.statement}"
        </AlertDescription>
      </Alert>

      {/* Block UI: Collective Memory Widget */}
      <CollectiveMemoryWidget />

      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="dashboard">Global översikt</TabsTrigger>
          <TabsTrigger value="patterns">Mönsterminne</TabsTrigger>
          <TabsTrigger value="repeating">Vad vi upprepar</TabsTrigger>
          <TabsTrigger value="gaps">Vetenskap → Handling</TabsTrigger>
          <TabsTrigger value="positive">Positiva avvikelser</TabsTrigger>
          <TabsTrigger value="attention">Lärande vs Uppmärksamhet</TabsTrigger>
        </TabsList>

        {/* Block UD: Global Learning Dashboard */}
        <TabsContent value="dashboard">
          <GlobalLearningDashboard />
        </TabsContent>

        {/* Block UA: Pattern Memory Engine */}
        <TabsContent value="patterns" className="space-y-4">
          {MOCK_PATTERNS.map((pattern) => (
            <PatternMemoryCard key={pattern.id} pattern={pattern} />
          ))}
        </TabsContent>

        {/* Block UE: What We Keep Repeating */}
        <TabsContent value="repeating" className="space-y-4">
          <Card className="border-warning/30 bg-warning/5">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-warning">
                <RefreshCw className="h-5 w-5" />
                Mönster utan tydlig förbättring
              </CardTitle>
              <CardDescription>
                Dessa mönster har observerats flera gånger utan tydlig förbättring i utfall.
              </CardDescription>
            </CardHeader>
          </Card>
          {MOCK_REPEATED_PATTERNS.map((pattern) => (
            <RepeatedPatternCard key={pattern.id} pattern={pattern} />
          ))}
        </TabsContent>

        {/* Block UF: Science vs Action Gap */}
        <TabsContent value="gaps" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Tid från kunskap till handling
              </CardTitle>
              <CardDescription>
                När vetenskaplig konsensus uppstod – och när (om) beteenden ändrades.
              </CardDescription>
            </CardHeader>
          </Card>
          {MOCK_SCIENCE_GAPS.map((gap) => (
            <ScienceActionGapCard key={gap.id} gap={gap} />
          ))}
        </TabsContent>

        {/* Block UG: Positive Deviation */}
        <TabsContent value="positive" className="space-y-4">
          <Card className="border-success/30 bg-success/5">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-success">
                <Zap className="h-5 w-5" />
                Snabbare lärande än genomsnittet
              </CardTitle>
              <CardDescription>
                Exempel där lärande skett snabbare än historiskt snitt – och varför.
              </CardDescription>
            </CardHeader>
          </Card>
          {MOCK_POSITIVE_DEVIATIONS.map((deviation) => (
            <PositiveDeviationCard key={deviation.id} deviation={deviation} />
          ))}
        </TabsContent>

        {/* Block UH: Learning vs Attention */}
        <TabsContent value="attention">
          <LearningAttentionMatrix />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Block UI: Collective Memory Widget
// ═══════════════════════════════════════════════════════════════

function CollectiveMemoryWidget() {
  const memory = MOCK_COLLECTIVE_MEMORY;
  
  const trendIcon = {
    improving: <TrendingUp className="h-4 w-4 text-success" />,
    stable: <ArrowRight className="h-4 w-4 text-muted-foreground" />,
    declining: <TrendingDown className="h-4 w-4 text-destructive" />,
  }[memory.overallTrend];

  const trendLabel = {
    improving: 'Förbättras',
    stable: 'Stabil',
    declining: 'Försämras',
  }[memory.overallTrend];

  return (
    <Card className="bg-gradient-to-r from-primary/5 to-transparent">
      <CardContent className="py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Brain className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Historical Pattern Awareness</p>
              <p className="text-xs text-muted-foreground">{memory.keyInsightSv}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {trendIcon}
            <Badge variant="outline">{trendLabel}</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════
// Block UD: Global Learning Dashboard
// ═══════════════════════════════════════════════════════════════

function GlobalLearningDashboard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" />
          Blir världen bättre på att hantera sina största utmaningar?
        </CardTitle>
        <CardDescription>
          Lärandegrad per domän baserat på observerad beteendeförändring och utfall över tid.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {MOCK_DOMAIN_STATUS.map((domain) => (
          <DomainLearningCard key={domain.domain} status={domain} />
        ))}

        <div className="p-4 bg-muted/50 rounded-lg mt-6">
          <p className="text-xs text-muted-foreground text-center">
            <strong>Metod:</strong> Lärandegrad baseras på förändring i responstid, 
            åtgärdstyp och utfall vid liknande situationer över tid. 
            Inga poäng – bara riktning.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function DomainLearningCard({ status }: { status: DomainLearningStatus }) {
  const [expanded, setExpanded] = useState(false);

  const TrendIcon = {
    improving: <TrendingUp className="h-4 w-4 text-success" />,
    stable: <ArrowRight className="h-4 w-4 text-muted-foreground" />,
    declining: <TrendingDown className="h-4 w-4 text-destructive" />,
  }[status.trend];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-medium">{status.domainNameSv}</span>
          <span className="text-xs text-muted-foreground">({status.timespan})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm">{status.learningScore}%</span>
          {TrendIcon}
        </div>
      </div>
      
      <Progress 
        value={status.learningScore} 
        className={cn(
          "h-2",
          status.learningScore < 40 && "[&>div]:bg-destructive",
          status.learningScore >= 40 && status.learningScore < 60 && "[&>div]:bg-warning",
          status.learningScore >= 60 && "[&>div]:bg-success"
        )}
      />

      {status.regionalVariation.length > 0 && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setExpanded(!expanded)}
          className="text-xs p-0 h-auto"
        >
          {expanded ? 'Dölj regional variation' : 'Visa regional variation'}
          {expanded ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
        </Button>
      )}

      {expanded && status.regionalVariation.length > 0 && (
        <div className="pl-4 space-y-1 text-xs">
          {status.regionalVariation.map((rv, i) => (
            <div key={i} className="flex items-center justify-between">
              <span>{rv.regionSv}</span>
              <span className={cn(
                rv.deviation > 0 ? "text-success" : "text-destructive"
              )}>
                {rv.deviation > 0 ? '+' : ''}{rv.deviation}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Block UA: Pattern Memory Card
// ═══════════════════════════════════════════════════════════════

function PatternMemoryCard({ pattern }: { pattern: HistoricalPattern }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <Badge variant="outline" className="text-xs mb-2">{pattern.code}</Badge>
            <CardTitle className="text-lg">{pattern.titleSv}</CardTitle>
          </div>
          <Badge variant="secondary">{pattern.situationTypeSv}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{pattern.descriptionSv}</p>

        <div className="text-xs text-muted-foreground">
          Första observation: <strong>{pattern.firstObserved}</strong> • 
          Förekomster: <strong>{pattern.occurrences.length}</strong>
        </div>

        <div className="space-y-2">
          {pattern.occurrences.slice(0, expanded ? undefined : 2).map((occ) => (
            <div key={occ.id} className="p-3 bg-muted/50 rounded-lg text-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{occ.location} ({occ.period})</span>
                <LearningClassificationBadge classification={occ.learningClassification} />
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div>
                  <span className="font-medium">Trigger:</span> {occ.triggerEventSv}
                </div>
                <div>
                  <span className="font-medium">Respons:</span> {occ.responseTypeSv}
                </div>
              </div>
              <div className="mt-2 text-xs">
                <span className="font-medium">Utfall:</span> {occ.outcomeSv}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                Igenkänningstid: {occ.recognitionSpeedDays} dagar
              </div>
            </div>
          ))}
        </div>

        {pattern.occurrences.length > 2 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setExpanded(!expanded)}
            className="w-full"
          >
            {expanded ? 'Visa färre' : `Visa alla ${pattern.occurrences.length} förekomster`}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

function LearningClassificationBadge({ classification }: { classification: LearningClassification }) {
  const info = LEARNING_CLASSIFICATION_LABELS[classification];
  
  const styles = {
    adaptive: 'bg-success/20 text-success border-success/30',
    partial: 'bg-warning/20 text-warning border-warning/30',
    stagnation: 'bg-muted text-muted-foreground',
    regression: 'bg-destructive/20 text-destructive border-destructive/30',
  }[classification];

  return (
    <Badge variant="outline" className={cn("text-xs border", styles)}>
      {info.sv}
    </Badge>
  );
}

// ═══════════════════════════════════════════════════════════════
// Block UE: Repeated Pattern Card
// ═══════════════════════════════════════════════════════════════

function RepeatedPatternCard({ pattern }: { pattern: RepeatedPattern }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-warning" />
            {pattern.patternSv}
          </CardTitle>
          <Badge variant="outline">
            {pattern.occurrenceCount} förekomster
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {pattern.examples.map((ex, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">{ex.period}</span>
              <span>•</span>
              <span>{ex.location}</span>
              <span>•</span>
              <span className="text-muted-foreground">{ex.descriptionSv}</span>
            </div>
          ))}
        </div>

        <div>
          <p className="text-xs font-medium mb-2">Identifierade grundorsaker:</p>
          <div className="flex flex-wrap gap-1">
            {pattern.rootCausesSv.map((cause, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {cause}
              </Badge>
            ))}
          </div>
        </div>

        {pattern.noImprovementObserved && (
          <Alert className="bg-warning/10 border-warning/30">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <AlertDescription className="text-sm">
              Ingen tydlig förbättring observerad över tid.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════
// Block UF: Science-Action Gap Card
// ═══════════════════════════════════════════════════════════════

function ScienceActionGapCard({ gap }: { gap: ScienceActionGap }) {
  const statusStyles = {
    acted: { icon: <CheckCircle className="h-4 w-4" />, color: 'text-success', label: 'Agerat' },
    partial_action: { icon: <AlertTriangle className="h-4 w-4" />, color: 'text-warning', label: 'Delvis agerat' },
    no_action: { icon: <XCircle className="h-4 w-4" />, color: 'text-destructive', label: 'Ingen åtgärd' },
  }[gap.status];

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base">{gap.topicSv}</CardTitle>
          <Badge variant="outline" className={statusStyles.color}>
            {statusStyles.icon}
            <span className="ml-1">{statusStyles.label}</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <div className="flex items-center justify-between">
            <div className="text-center">
              <div className="w-3 h-3 rounded-full bg-primary mx-auto" />
              <p className="text-xs font-medium mt-1">{gap.scientificConsensusYear}</p>
              <p className="text-xs text-muted-foreground">Konsensus</p>
            </div>
            
            <div className="flex-1 mx-4 relative">
              <div className="h-0.5 bg-muted w-full" />
              {gap.gapYears && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2">
                  <span className="text-sm font-bold text-primary">{gap.gapYears} år</span>
                </div>
              )}
            </div>

            <div className="text-center">
              <div className={cn(
                "w-3 h-3 rounded-full mx-auto",
                gap.firstMajorActionYear ? "bg-success" : "bg-muted"
              )} />
              <p className="text-xs font-medium mt-1">{gap.firstMajorActionYear || '—'}</p>
              <p className="text-xs text-muted-foreground">Handling</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="p-3 bg-primary/5 rounded-lg">
            <p className="text-xs font-medium text-primary mb-1">Konsensus:</p>
            <p className="text-muted-foreground">{gap.consensusDescriptionSv}</p>
          </div>
          {gap.actionDescriptionSv && (
            <div className="p-3 bg-success/5 rounded-lg">
              <p className="text-xs font-medium text-success mb-1">Första större åtgärd:</p>
              <p className="text-muted-foreground">{gap.actionDescriptionSv}</p>
            </div>
          )}
        </div>

        {gap.ongoingGap && (
          <p className="text-xs text-center text-muted-foreground italic">
            I detta fall gick {gap.gapYears || 'okänt antal'} år mellan etablerad kunskap och observerad förändring.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════
// Block UG: Positive Deviation Card
// ═══════════════════════════════════════════════════════════════

function PositiveDeviationCard({ deviation }: { deviation: PositiveDeviation }) {
  return (
    <Card className="border-success/30">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-success" />
            {deviation.titleSv}
          </CardTitle>
          <Badge className="bg-success/20 text-success border-success/30">
            {deviation.improvementFactor}x snabbare
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{deviation.descriptionSv}</p>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="p-3 bg-muted/50 rounded-lg text-center">
            <p className="text-xs text-muted-foreground">Historiskt snitt</p>
            <p className="text-2xl font-bold text-muted-foreground">{deviation.historicalAverageLag}</p>
            <p className="text-xs text-muted-foreground">
              {deviation.domain === 'health' ? 'månader' : 'år'}
            </p>
          </div>
          <div className="p-3 bg-success/10 rounded-lg text-center">
            <p className="text-xs text-success">Faktisk tid</p>
            <p className="text-2xl font-bold text-success">{deviation.actualLag}</p>
            <p className="text-xs text-success">
              {deviation.domain === 'health' ? 'månader' : 'år'}
            </p>
          </div>
        </div>

        <div>
          <p className="text-xs font-medium mb-2">Möjliggörande faktorer:</p>
          <div className="flex flex-wrap gap-1">
            {deviation.enablingFactorsSv.map((factor, i) => (
              <Badge key={i} variant="outline" className="text-xs bg-success/5">
                {factor}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-medium mb-2">Strukturella förutsättningar:</p>
          <div className="flex flex-wrap gap-1">
            {deviation.structuralConditionsSv.map((condition, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {condition}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════
// Block UH: Learning vs Attention Matrix
// ═══════════════════════════════════════════════════════════════

function LearningAttentionMatrix() {
  const quadrantLabels = {
    high_attention_high_learning: { label: 'Fungerande fokus', color: 'bg-success/20 border-success/30' },
    high_attention_low_learning: { label: 'Symbolpolitik?', color: 'bg-warning/20 border-warning/30' },
    low_attention_high_learning: { label: 'Tyst framsteg', color: 'bg-primary/20 border-primary/30' },
    low_attention_low_learning: { label: 'Försummat', color: 'bg-destructive/20 border-destructive/30' },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Lärande vs Uppmärksamhet
        </CardTitle>
        <CardDescription>
          Korsning mellan offentlig diskurs och faktisk beteendeförändring.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(quadrantLabels).map(([quadrant, { label, color }]) => {
            const items = MOCK_ATTENTION_LEARNING.filter(i => i.quadrant === quadrant);
            return (
              <div key={quadrant} className={cn("p-4 rounded-lg border", color)}>
                <p className="text-sm font-medium mb-2">{label}</p>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{item.topicSv}</span>
                      </div>
                      <p className="text-muted-foreground">{item.interpretationSv}</p>
                    </div>
                  ))}
                  {items.length === 0 && (
                    <p className="text-xs text-muted-foreground italic">Inga exempel</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <ArrowRight className="h-3 w-3" />
            <span>Hög uppmärksamhet →</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            <span>Högt lärande ↑</span>
          </div>
        </div>

        <Alert>
          <Eye className="h-4 w-4" />
          <AlertDescription className="text-sm">
            Avslöjar gap mellan diskurs och handling – utan att säga det explicit.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
