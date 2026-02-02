/**
 * COGNITIVE BIAS EXPOSURE LAYER (CBEL)
 * BLOCK WA–WH: Metakognitionslager
 * 
 * OBRYTBAR PRINCIP:
 * Systemet ska aldrig vara smartare än användaren.
 * Det ska hjälpa användaren bli smartare.
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  Brain, AlertTriangle, Lightbulb, Eye, Lock, 
  BookOpen, TrendingUp, TrendingDown, Minus,
  ArrowRight, RefreshCw, ChevronDown, ChevronUp,
  Shield, Users, Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  CBEL_CORE_PRINCIPLE,
  BIAS_DEFINITIONS,
  BIAS_TRIGGERS,
  BEFORE_AFTER_EXAMPLES,
  MOCK_PERSONAL_PROFILE,
  PERSONAL_PROFILE_PRINCIPLES,
  LEARNING_LINKS,
  COLLECTIVE_BIAS_PATTERNS,
  HUMILITY_GUARD,
  type BiasType,
  type BiasTrigger,
} from '@/config/cognitiveBiasConfig';

export function CognitiveBiasPanel() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Brain className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Cognitive Bias Exposure Layer</h1>
          <p className="text-sm text-muted-foreground">
            {CBEL_CORE_PRINCIPLE.systemQuestion}
          </p>
        </div>
      </div>

      {/* BLOCK WH — Humility Guard (Always visible) */}
      <Alert className="border-primary/30 bg-primary/5">
        <Shield className="h-4 w-4" />
        <AlertDescription className="text-sm">
          {HUMILITY_GUARD.statementSv}
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="biases" className="space-y-4">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="biases">Bias-katalog (WA)</TabsTrigger>
          <TabsTrigger value="triggers">Triggers (WB)</TabsTrigger>
          <TabsTrigger value="beforeafter">Före/Efter (WD)</TabsTrigger>
          <TabsTrigger value="profile">Din profil (WE)</TabsTrigger>
          <TabsTrigger value="collective">Kollektiva mönster (WG)</TabsTrigger>
        </TabsList>

        {/* BLOCK WA — Bias Map */}
        <TabsContent value="biases" className="space-y-4">
          <Card className="border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Brain className="h-4 w-4" />
                Block WA: Bias Map
              </CardTitle>
              <CardDescription>
                Kognitiva snedvridningar relevanta för dataanalys – endast mönster, ingen psykologi
              </CardDescription>
            </CardHeader>
          </Card>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.values(BIAS_DEFINITIONS).map((bias) => (
              <BiasCard key={bias.type} bias={bias} />
            ))}
          </div>
        </TabsContent>

        {/* BLOCK WB — Contextual Triggers */}
        <TabsContent value="triggers" className="space-y-4">
          <Card className="border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Block WB: Contextual Bias Triggers
              </CardTitle>
              <CardDescription>
                Systemet aktiverar bias-varningar endast när de är kontextuellt relevanta
              </CardDescription>
            </CardHeader>
          </Card>
          <ContextualTriggers />
        </TabsContent>

        {/* BLOCK WD — Before / After View */}
        <TabsContent value="beforeafter" className="space-y-4">
          <Card className="border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Block WD: Före / Efter-vy
              </CardTitle>
              <CardDescription>
                Aha-ögonblick: se skillnaden mellan spontan tolkning och kontextuell förståelse
              </CardDescription>
            </CardHeader>
          </Card>
          <BeforeAfterExamples />
        </TabsContent>

        {/* BLOCK WE — Personal Bias Profile */}
        <TabsContent value="profile" className="space-y-4">
          <Card className="border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Block WE: Personal Bias Profile
              </CardTitle>
              <CardDescription>
                Självinsikt, inte ranking – helt privat
              </CardDescription>
            </CardHeader>
          </Card>
          <PersonalBiasProfile />
        </TabsContent>

        {/* BLOCK WG — Collective Bias Patterns */}
        <TabsContent value="collective" className="space-y-4">
          <Card className="border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4" />
                Block WG: Kollektiva bias-mönster
              </CardTitle>
              <CardDescription>
                Meta-förståelse om vanliga snedvridningar per domän – inte pekande
              </CardDescription>
            </CardHeader>
          </Card>
          <CollectiveBiasPatterns />
        </TabsContent>
      </Tabs>

      {/* BLOCK WC — UI Hints Example */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Block WC: Bias-medvetna UI-hints
          </CardTitle>
          <CardDescription>
            Diskreta hjälpmedel som dyker upp i kontext – hjälp, inte föreläsning
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <BiasHintExample 
            hint="Observera att denna skala inte startar vid noll."
            biasType="framing"
            placement="tooltip"
          />
          <BiasHintExample 
            hint="Senaste datapunkten kan verka mer betydelsefull än historisk kontext antyder."
            biasType="recency"
            placement="callout"
          />
          <BiasHintExample 
            hint="Detta visar korrelation, inte bevisat orsakssamband."
            biasType="causality"
            placement="inline"
          />
        </CardContent>
      </Card>
    </div>
  );
}

function BiasCard({ bias }: { bias: typeof BIAS_DEFINITIONS[BiasType] }) {
  const [expanded, setExpanded] = useState(false);
  
  const riskColors = {
    low: 'text-muted-foreground',
    medium: 'text-warning',
    high: 'text-destructive',
  };

  const learningLink = LEARNING_LINKS[bias.type];

  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-sm">{bias.nameSv}</CardTitle>
          <Badge variant="outline" className={cn("text-xs", riskColors[bias.riskLevel])}>
            {bias.riskLevel === 'high' ? 'Hög' :
             bias.riskLevel === 'medium' ? 'Medel' : 'Låg'} risk
          </Badge>
        </div>
        <p className="text-xs text-primary font-medium italic">
          "{bias.shortExplanationSv}"
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-xs text-muted-foreground">{bias.descriptionSv}</p>

        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setExpanded(!expanded)}
          className="w-full text-xs"
        >
          {expanded ? (
            <><ChevronUp className="h-3 w-3 mr-1" /> Dölj</>
          ) : (
            <><ChevronDown className="h-3 w-3 mr-1" /> Lärande & motmedel</>
          )}
        </Button>

        {expanded && (
          <div className="space-y-2 pt-2 border-t">
            <div className="p-2 bg-success/5 rounded border border-success/20">
              <p className="text-xs font-medium text-success mb-1">Motmedel:</p>
              <p className="text-xs">{bias.mitigationHintSv}</p>
            </div>
            
            {/* BLOCK WF — Learning Linkage */}
            <div className="p-2 bg-primary/5 rounded border border-primary/20">
              <p className="text-xs font-medium text-primary mb-1">Lärande i kontext:</p>
              <p className="text-xs text-muted-foreground">{learningLink.exampleInSystemSv}</p>
              <Button variant="link" size="sm" className="h-auto p-0 text-xs mt-1">
                <BookOpen className="h-3 w-3 mr-1" />
                {learningLink.alternativeViewSv}
              </Button>
            </div>

            <div className="text-xs text-muted-foreground">
              <span className="font-medium">Vanlig i: </span>
              {bias.commonIn.join(', ')}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ContextualTriggers() {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {BIAS_TRIGGERS.map((trigger, i) => (
        <Card key={i} className="border-warning/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning" />
              {trigger.contextNameSv}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground italic">
              "{trigger.warningTemplateSv}"
            </p>
            
            <div className="flex flex-wrap gap-1">
              {trigger.triggeredBiases.map((biasType) => (
                <Badge key={biasType} variant="secondary" className="text-xs">
                  {BIAS_DEFINITIONS[biasType].nameSv}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function BeforeAfterExamples() {
  const [selectedExample, setSelectedExample] = useState(0);
  const example = BEFORE_AFTER_EXAMPLES[selectedExample];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {BEFORE_AFTER_EXAMPLES.map((ex, i) => (
          <Button
            key={ex.id}
            variant={selectedExample === i ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedExample(i)}
          >
            {BIAS_DEFINITIONS[ex.biasType].nameSv}
          </Button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{example.scenarioSv}</CardTitle>
          <Badge variant="outline">
            {BIAS_DEFINITIONS[example.biasType].nameSv}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Without Context */}
            <div className="p-4 bg-destructive/5 rounded-lg border border-destructive/20">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="h-4 w-4 text-destructive" />
                <p className="text-sm font-medium text-destructive">Utan kontext</p>
              </div>
              <p className="text-sm">{example.withoutContextSv}</p>
            </div>

            {/* With Context */}
            <div className="p-4 bg-success/5 rounded-lg border border-success/20">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="h-4 w-4 text-success" />
                <p className="text-sm font-medium text-success">Med kontext</p>
              </div>
              <p className="text-sm">{example.withContextSv}</p>
            </div>
          </div>

          {/* Insight */}
          <div className="p-3 bg-primary/5 rounded-lg border border-primary/20 flex items-start gap-2">
            <Sparkles className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-primary">Insikt:</p>
              <p className="text-sm text-muted-foreground">{example.insightSv}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PersonalBiasProfile() {
  const profile = MOCK_PERSONAL_PROFILE;

  return (
    <div className="space-y-4">
      {/* Privacy principles */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
        {Object.entries(PERSONAL_PROFILE_PRINCIPLES).map(([key, principle]) => (
          <div key={key} className="flex items-center gap-2 p-2 bg-muted/50 rounded text-xs">
            <Lock className="h-3 w-3 text-primary flex-shrink-0" />
            <span>{principle.sv}</span>
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Eye className="h-4 w-4" />
            I dina tidigare analyser har dessa bias ofta varit relevanta
          </CardTitle>
          <CardDescription>
            Baserat på {profile.totalAnalyses} analyser • Senast uppdaterad: {profile.lastUpdated}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {profile.observedPatterns.map((pattern) => (
            <div key={pattern.biasType} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{BIAS_DEFINITIONS[pattern.biasType].nameSv}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {pattern.occurrences} observationer
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  Senast: {pattern.lastObserved}
                </span>
              </div>
              <Progress 
                value={(pattern.occurrences / 10) * 100} 
                className="h-1.5"
              />
              <div className="flex flex-wrap gap-1">
                {pattern.contexts.map((ctx, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {ctx}
                  </Badge>
                ))}
              </div>
            </div>
          ))}

          <Button variant="outline" size="sm" className="w-full mt-4">
            <RefreshCw className="h-4 w-4 mr-2" />
            Rensa min profil
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function CollectiveBiasPatterns() {
  const trendIcon = (trend: 'increasing' | 'stable' | 'decreasing') => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="h-4 w-4 text-destructive" />;
      case 'decreasing': return <TrendingDown className="h-4 w-4 text-success" />;
      default: return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {COLLECTIVE_BIAS_PATTERNS.map((pattern) => (
        <Card key={pattern.domain}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{pattern.domainSv}</CardTitle>
              <div className="flex items-center gap-2">
                {trendIcon(pattern.trend)}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-xs font-medium mb-2">Vanligaste snedvridningar:</p>
              <div className="flex flex-wrap gap-1">
                {pattern.mostCommonBiases.map((biasType) => (
                  <Badge key={biasType} variant="secondary" className="text-xs">
                    {BIAS_DEFINITIONS[biasType].nameSv}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="p-2 bg-muted/50 rounded text-xs text-muted-foreground">
              {pattern.insightSv}
            </div>

            <div className="text-xs text-muted-foreground">
              Trend: {pattern.trend === 'increasing' ? 'Ökande' : 
                      pattern.trend === 'decreasing' ? 'Minskande' : 'Stabil'}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function BiasHintExample({ 
  hint, 
  biasType, 
  placement 
}: { 
  hint: string; 
  biasType: BiasType; 
  placement: 'tooltip' | 'inline' | 'callout';
}) {
  const placementStyles = {
    tooltip: 'border-muted bg-muted/20',
    inline: 'border-primary/30 bg-primary/5',
    callout: 'border-warning/30 bg-warning/5',
  };

  const placementLabels = {
    tooltip: 'Tooltip',
    inline: 'Inline',
    callout: 'Callout',
  };

  return (
    <div className={cn(
      "flex items-start gap-3 p-3 rounded-lg border",
      placementStyles[placement]
    )}>
      <AlertTriangle className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm">{hint}</p>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant="outline" className="text-xs">
            {BIAS_DEFINITIONS[biasType].nameSv}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {placementLabels[placement]}
          </Badge>
        </div>
      </div>
    </div>
  );
}
