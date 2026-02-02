/**
 * COLLECTIVE LEARNING TRACKER (CLT)
 * Main component for tracking humanity's learning patterns
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, TrendingUp, TrendingDown, RefreshCw, 
  AlertTriangle, CheckCircle, XCircle, Globe, Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  CLT_CORE_PRINCIPLE,
  MOCK_LEARNING_PATTERNS,
  MOCK_REPEATED_MISTAKES,
  type LearningPattern,
  type RepeatedMistake,
} from '@/config/collectiveLearningConfig';

export function CollectiveLearningTracker() {
  const [selectedPattern, setSelectedPattern] = useState<LearningPattern | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Brain className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Collective Learning Tracker</h1>
          <p className="text-sm text-muted-foreground">
            {CLT_CORE_PRINCIPLE.statement}
          </p>
        </div>
      </div>

      <Tabs defaultValue="patterns" className="space-y-4">
        <TabsList>
          <TabsTrigger value="patterns">Lärandemönster</TabsTrigger>
          <TabsTrigger value="mistakes">Upprepade misstag</TabsTrigger>
          <TabsTrigger value="progress">Global lärprogress</TabsTrigger>
        </TabsList>

        <TabsContent value="patterns" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {MOCK_LEARNING_PATTERNS.map((pattern) => (
              <LearningPatternCard 
                key={pattern.id} 
                pattern={pattern}
                onSelect={() => setSelectedPattern(pattern)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="mistakes" className="space-y-4">
          {MOCK_REPEATED_MISTAKES.map((mistake) => (
            <RepeatedMistakeCard key={mistake.id} mistake={mistake} />
          ))}
        </TabsContent>

        <TabsContent value="progress">
          <GlobalLearningProgress />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function LearningPatternCard({ 
  pattern, 
  onSelect 
}: { 
  pattern: LearningPattern; 
  onSelect: () => void;
}) {
  const StatusIcon = {
    learned: <CheckCircle className="h-4 w-4 text-success" />,
    learning: <TrendingUp className="h-4 w-4 text-primary" />,
    forgotten: <XCircle className="h-4 w-4 text-destructive" />,
    repeating: <RefreshCw className="h-4 w-4 text-warning" />,
  }[pattern.currentStatus];

  const statusLabels = {
    learned: 'Inlärt',
    learning: 'Lär sig',
    forgotten: 'Glömt',
    repeating: 'Upprepas',
  };

  return (
    <Card className="cursor-pointer hover:border-primary/50 transition-colors" onClick={onSelect}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base">{pattern.titleSv}</CardTitle>
          <Badge variant="outline" className="flex items-center gap-1">
            {StatusIcon}
            {statusLabels[pattern.currentStatus]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{pattern.descriptionSv}</p>
        
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Första gången: {pattern.firstObserved}
          </span>
          <span className="flex items-center gap-1">
            <Globe className="h-3 w-3" />
            {pattern.geographicSpread === 'global' ? 'Globalt' : 
             pattern.geographicSpread === 'regional' ? 'Regionalt' : 'Lokalt'}
          </span>
        </div>

        <div className="flex gap-4 text-sm">
          <div>
            <span className="text-destructive font-medium">{pattern.timesRepeated}</span>
            <span className="text-muted-foreground"> upprepat</span>
          </div>
          <div>
            <span className="text-success font-medium">{pattern.timesLearned}</span>
            <span className="text-muted-foreground"> inlärt</span>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span>Konfidens</span>
            <span>{Math.round(pattern.confidenceLevel * 100)}%</span>
          </div>
          <Progress value={pattern.confidenceLevel * 100} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}

function RepeatedMistakeCard({ mistake }: { mistake: RepeatedMistake }) {
  const riskColors = {
    low: 'bg-success/20 text-success border-success/30',
    medium: 'bg-warning/20 text-warning border-warning/30',
    high: 'bg-destructive/20 text-destructive border-destructive/30',
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-warning" />
            {mistake.patternSv}
          </CardTitle>
          <Badge className={cn("border", riskColors[mistake.predictedRisk])}>
            Risk: {mistake.predictedRisk === 'low' ? 'Låg' : 
                   mistake.predictedRisk === 'medium' ? 'Medel' : 'Hög'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Timeline of occurrences */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Historiska förekomster:</p>
          <div className="flex flex-wrap gap-2">
            {mistake.occurrences.map((occ) => (
              <div 
                key={occ.id}
                className="px-3 py-1 bg-muted rounded-full text-xs flex items-center gap-2"
              >
                <span className="font-medium">{occ.location}</span>
                <span className="text-muted-foreground">{occ.date}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Genomsnittlig tid mellan:</span>
            <p className="font-medium">{mistake.avgTimeBetween}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Senaste förekomst:</span>
            <p className="font-medium">{mistake.lastOccurred}</p>
          </div>
        </div>

        {/* Warning signals */}
        <div className="p-3 bg-warning/10 rounded-lg">
          <p className="text-xs font-medium text-warning mb-2 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Varningssignaler att bevaka:
          </p>
          <div className="flex flex-wrap gap-1">
            {mistake.warningSignalsSv.map((signal, i) => (
              <Badge key={i} variant="outline" className="text-xs">
                {signal}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function GlobalLearningProgress() {
  const domains = [
    { name: 'Ekonomisk politik', score: 45, trend: 'stable' as const },
    { name: 'Folkhälsa', score: 62, trend: 'improving' as const },
    { name: 'Miljö', score: 38, trend: 'declining' as const },
    { name: 'Styrning', score: 51, trend: 'stable' as const },
    { name: 'Teknologi', score: 71, trend: 'improving' as const },
    { name: 'Socialpolitik', score: 55, trend: 'stable' as const },
  ];

  const TrendIcon = ({ trend }: { trend: 'improving' | 'stable' | 'declining' }) => {
    if (trend === 'improving') return <TrendingUp className="h-4 w-4 text-success" />;
    if (trend === 'declining') return <TrendingDown className="h-4 w-4 text-destructive" />;
    return <span className="text-muted-foreground">→</span>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" />
          Global kunskapsackumulering
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Hur väl har mänskligheten lärt sig inom varje område?
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {domains.map((domain) => (
          <div key={domain.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{domain.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm">{domain.score}%</span>
                <TrendIcon trend={domain.trend} />
              </div>
            </div>
            <Progress 
              value={domain.score} 
              className={cn(
                "h-2",
                domain.score < 40 && "[&>div]:bg-destructive",
                domain.score >= 40 && domain.score < 60 && "[&>div]:bg-warning",
                domain.score >= 60 && "[&>div]:bg-success"
              )}
            />
          </div>
        ))}

        <div className="p-3 bg-muted/50 rounded-lg mt-6">
          <p className="text-xs text-muted-foreground text-center italic">
            "Mänskligheten lär sig – men långsamt, ojämnt och med frekventa återfall."
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
