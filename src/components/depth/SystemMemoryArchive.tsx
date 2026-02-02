/**
 * SYSTEM MEMORY & HISTORICAL PATTERN ARCHIVE (SMA)
 * The system's long-term memory for patterns and misinterpretations
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Database, Clock, AlertTriangle, TrendingUp, 
  CheckCircle, XCircle, History, BookOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  SMA_CORE_PRINCIPLE,
  MOCK_PATTERNS,
  MOCK_MISINTERPRETATIONS,
  MOCK_PREDICTIONS,
  type HistoricalPattern,
  type HistoricalMisinterpretation,
  type HistoricalPrediction,
} from '@/config/systemMemoryConfig';

export function SystemMemoryArchive() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Database className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">System Memory Archive</h1>
          <p className="text-sm text-muted-foreground">
            {SMA_CORE_PRINCIPLE.statement}
          </p>
        </div>
      </div>

      <Tabs defaultValue="patterns" className="space-y-4">
        <TabsList>
          <TabsTrigger value="patterns">Historiska mönster</TabsTrigger>
          <TabsTrigger value="misinterpretations">Feltolkningar</TabsTrigger>
          <TabsTrigger value="predictions">Prediktionsarkiv</TabsTrigger>
        </TabsList>

        <TabsContent value="patterns" className="space-y-4">
          {MOCK_PATTERNS.map((pattern) => (
            <HistoricalPatternCard key={pattern.id} pattern={pattern} />
          ))}
        </TabsContent>

        <TabsContent value="misinterpretations" className="space-y-4">
          {MOCK_MISINTERPRETATIONS.map((mis) => (
            <MisinterpretationCard key={mis.id} misinterpretation={mis} />
          ))}
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4">
          {MOCK_PREDICTIONS.map((pred) => (
            <PredictionCard key={pred.id} prediction={pred} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function HistoricalPatternCard({ pattern }: { pattern: HistoricalPattern }) {
  const [expanded, setExpanded] = useState(false);

  const riskColors = {
    dormant: 'bg-muted text-muted-foreground',
    low: 'bg-success/20 text-success',
    elevated: 'bg-warning/20 text-warning',
    high: 'bg-destructive/20 text-destructive',
    imminent: 'bg-destructive text-destructive-foreground',
  };

  const riskLabels = {
    dormant: 'Vilande',
    low: 'Låg',
    elevated: 'Förhöjd',
    high: 'Hög',
    imminent: 'Överhängande',
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <Badge variant="outline" className="text-xs mb-2">{pattern.code}</Badge>
            <CardTitle className="text-lg">{pattern.titleSv}</CardTitle>
          </div>
          <Badge className={cn(riskColors[pattern.currentRiskLevel])}>
            Risk: {riskLabels[pattern.currentRiskLevel]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{pattern.descriptionSv}</p>

        {/* Timeline */}
        <div className="space-y-2">
          <p className="text-sm font-medium flex items-center gap-2">
            <History className="h-4 w-4" />
            Historisk tidslinje
          </p>
          <div className="flex flex-wrap gap-2">
            <div className="px-3 py-2 bg-primary/10 rounded-lg text-xs">
              <span className="font-medium">{pattern.firstInstance.location}</span>
              <span className="text-muted-foreground ml-2">
                {pattern.firstInstance.startYear}–{pattern.firstInstance.endYear}
              </span>
              <Badge variant="secondary" className="ml-2 text-xs">Första</Badge>
            </div>
            {pattern.subsequentInstances.map((inst) => (
              <div key={inst.id} className="px-3 py-2 bg-muted rounded-lg text-xs">
                <span className="font-medium">{inst.location}</span>
                <span className="text-muted-foreground ml-2">
                  {inst.startYear}–{inst.endYear}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Cycle info */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>Genomsnittlig cykel: <strong>{pattern.averageCycleYears} år</strong></span>
          </div>
        </div>

        {/* Warning indicators */}
        <div className="p-3 bg-warning/10 rounded-lg">
          <p className="text-xs font-medium text-warning mb-2 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Varningsindikatorer att bevaka:
          </p>
          <div className="flex flex-wrap gap-1">
            {pattern.warningIndicatorsSv.map((ind, i) => (
              <Badge key={i} variant="outline" className="text-xs">
                {ind}
              </Badge>
            ))}
          </div>
        </div>

        {expanded && (
          <div className="pt-4 border-t space-y-3">
            <div>
              <p className="text-sm font-medium mb-2">Första förekomsten:</p>
              <p className="text-sm text-muted-foreground">
                {pattern.firstInstance.outcomeSv}
              </p>
              <div className="flex flex-wrap gap-1 mt-2">
                {pattern.firstInstance.keyFactorsSv.map((f, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">{f}</Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setExpanded(!expanded)}
          className="w-full"
        >
          {expanded ? 'Visa mindre' : 'Visa mer'}
        </Button>
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
        {/* Original interpretation */}
        <div className="p-3 bg-destructive/10 rounded-lg">
          <p className="text-xs font-medium text-destructive mb-1">Ursprunglig tolkning:</p>
          <p className="text-sm">{misinterpretation.originalInterpretationSv}</p>
        </div>

        {/* Actual cause */}
        <div className="p-3 bg-success/10 rounded-lg">
          <p className="text-xs font-medium text-success mb-1">Faktisk orsak:</p>
          <p className="text-sm">{misinterpretation.actualCauseSv}</p>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>Tid att korrigera: <strong>{misinterpretation.howLongToCorrect}</strong></span>
        </div>

        {/* Lessons */}
        <div>
          <p className="text-xs font-medium mb-2">Lärdomar:</p>
          <ul className="text-sm text-muted-foreground space-y-1">
            {misinterpretation.lessonsLearnedSv.map((lesson, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-primary">•</span>
                {lesson}
              </li>
            ))}
          </ul>
        </div>

        {misinterpretation.stillRepeated && (
          <Badge variant="destructive" className="flex items-center gap-1 w-fit">
            <AlertTriangle className="h-3 w-3" />
            Upprepas fortfarande
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}

function PredictionCard({ prediction }: { prediction: HistoricalPrediction }) {
  const outcomeStyles = {
    accurate: { icon: <CheckCircle className="h-4 w-4" />, color: 'text-success', label: 'Korrekt' },
    partially_accurate: { icon: <TrendingUp className="h-4 w-4" />, color: 'text-warning', label: 'Delvis korrekt' },
    wrong: { icon: <XCircle className="h-4 w-4" />, color: 'text-destructive', label: 'Fel' },
    pending: { icon: <Clock className="h-4 w-4" />, color: 'text-muted-foreground', label: 'Ej avgjort' },
  };

  const outcomeInfo = outcomeStyles[prediction.outcome];

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <span>{prediction.madeBy}</span>
              <span>•</span>
              <span>{prediction.madeIn}</span>
            </div>
            <CardTitle className="text-base">{prediction.predictionSv}</CardTitle>
          </div>
          <Badge variant="outline" className={outcomeInfo.color}>
            <span className="mr-1">{outcomeInfo.icon}</span>
            {outcomeInfo.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-sm">
          <span className="text-muted-foreground">Målår: </span>
          <strong>{prediction.targetYear}</strong>
        </div>

        {prediction.actualResultSv && (
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-xs font-medium mb-1">Faktiskt resultat:</p>
            <p className="text-sm text-muted-foreground">{prediction.actualResultSv}</p>
          </div>
        )}

        <div className="p-3 bg-primary/10 rounded-lg">
          <p className="text-xs font-medium text-primary mb-1 flex items-center gap-1">
            <BookOpen className="h-3 w-3" />
            Lärdom för prognoser:
          </p>
          <p className="text-sm">{prediction.lessonsForForecastingSv}</p>
        </div>
      </CardContent>
    </Card>
  );
}
