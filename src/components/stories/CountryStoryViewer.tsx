/**
 * COMPARATIVE COUNTRY STORIES — Main Story Viewer
 * "Visa vad som hände – inte vad man borde tycka om det."
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer
} from 'recharts';
import {
  Globe, Clock, ArrowUp, ArrowDown, 
  Minus, AlertTriangle, Share2, ChevronLeft, Info,
  TrendingUp, Activity
} from 'lucide-react';
import type { 
  CountryStory, 
  OutcomeObservation,
  StoryOutcomes 
} from '@/config/countryStoriesConfig';
import { 
  STORY_STRUCTURE, 
  SHIFT_TYPE_LABELS,
  TIME_LAG_DISPLAY,
  MISUSE_PROTECTION 
} from '@/config/countryStoriesConfig';

interface CountryStoryViewerProps {
  story: CountryStory;
  onBack?: () => void;
}

const DIRECTION_ICONS = {
  increase: <ArrowUp className="h-4 w-4 text-success" />,
  decrease: <ArrowDown className="h-4 w-4 text-destructive" />,
  stable: <Minus className="h-4 w-4 text-primary" />,
  volatile: <Activity className="h-4 w-4 text-warning" />,
};

export function CountryStoryViewer({ story, onBack }: CountryStoryViewerProps) {
  const [activeSection, setActiveSection] = useState('context');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {onBack && (
                <Button variant="ghost" size="sm" onClick={onBack}>
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Tillbaka
                </Button>
              )}
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                <div>
                  <h1 className="font-semibold">{story.country.nameSv}</h1>
                  <p className="text-xs text-muted-foreground">
                    {story.shift.titleSv}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {SHIFT_TYPE_LABELS[story.shift.type].sv}
              </Badge>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Dela
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Misuse warning - ALWAYS VISIBLE */}
        <Alert className="border-warning/50 bg-warning/10">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {MISUSE_PROTECTION.always_visible_warning.sv}
          </AlertDescription>
        </Alert>

        {/* Section tabs */}
        <Tabs value={activeSection} onValueChange={setActiveSection}>
          <TabsList className="grid grid-cols-5 w-full">
            {STORY_STRUCTURE.sections.map((section) => (
              <TabsTrigger key={section.id} value={section.id} className="text-xs">
                {section.titleSv}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* 1. Context */}
          <TabsContent value="context" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Kontext: {story.country.nameSv}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Starting position */}
                <div>
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    Utgångsläge
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {story.country.startingPosition.map((factor, i) => (
                      <div key={i} className="p-3 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-primary">
                          {factor.value}{factor.unit}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {factor.nameSv}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {factor.year} • {factor.source}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Structural factors */}
                <div>
                  <h3 className="font-medium mb-3">Strukturella faktorer</h3>
                  <div className="space-y-2">
                    {story.country.structuralFactors.map((factor, i) => (
                      <div key={i} className="flex justify-between p-2 bg-muted/30 rounded">
                        <span>{factor.nameSv}</span>
                        <span className="text-muted-foreground">{factor.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Differentiating factors */}
                <div>
                  <h3 className="font-medium mb-3">Vad skiljer från jämförelsegruppen</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {story.country.differentiatingFactors.map((factor, i) => (
                      <li key={i}>{factor}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 2. What changed */}
          <TabsContent value="what_changed" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Vad förändrades?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <Badge className="mb-2">{SHIFT_TYPE_LABELS[story.shift.type].sv}</Badge>
                  <h3 className="text-lg font-semibold mb-2">{story.shift.titleSv}</h3>
                  <p className="text-muted-foreground">{story.shift.descriptionSv}</p>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="text-sm text-muted-foreground">Startdatum</div>
                    <div className="font-medium">{story.shift.dateStart}</div>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="text-sm text-muted-foreground">Omfattning</div>
                    <div className="font-medium capitalize">{story.shift.scope}</div>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="text-sm text-muted-foreground">Magnitud</div>
                    <div className="font-medium capitalize">{story.shift.magnitude}</div>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">
                  Källor: {story.shift.sourceDocuments.join(', ')}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 3. What happened after */}
          <TabsContent value="what_happened" className="space-y-4 mt-6">
            <OutcomesSection outcomes={story.outcomes} />
            
            {/* Time lag info */}
            <Card className="bg-muted/30">
              <CardContent className="p-4 flex items-start gap-3">
                <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <div className="font-medium">⏱️ Tidsfördröjning</div>
                  <p className="text-sm text-muted-foreground">
                    Effekter började synas efter ca {story.outcomes.primary[0]?.timeLag.months || '?'} månader.
                  </p>
                  {!story.outcomes.primary[0]?.timeLag.fullEffectObserved && (
                    <p className="text-sm text-muted-foreground">
                      {TIME_LAG_DISPLAY.not_observed_sv}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 4. Comparison */}
          <TabsContent value="comparison" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Jämförelse: {story.comparisonGroup.nameSv}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {story.comparisonGroup.criteriaSv.join(' • ')}
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-6">
                  {story.comparisonGroup.countries.map((code) => (
                    <Badge 
                      key={code} 
                      variant={code === story.country.code ? "default" : "outline"}
                    >
                      {code}
                    </Badge>
                  ))}
                </div>

                {/* Comparison chart */}
                <div className="h-[300px] bg-muted/30 rounded-lg flex items-center justify-center">
                  <span className="text-muted-foreground">
                    [Jämförande visualisering laddas här]
                  </span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 5. Observations */}
          <TabsContent value="observations" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Vad kan man observera?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                    <h4 className="font-medium text-emerald-700 dark:text-emerald-400 mb-1">
                      Mönster som skiljer sig
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Förnybar andel ökade snabbare i {story.country.nameSv} än i jämförelsegruppen.
                    </p>
                  </div>
                  
                  <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <h4 className="font-medium text-blue-700 dark:text-blue-400 mb-1">
                      Mönster som är lika
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Elprisvariabilitet ökade i alla länder under samma period.
                    </p>
                  </div>
                  
                  <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                    <h4 className="font-medium text-amber-700 dark:text-amber-400 mb-1">
                      Hög osäkerhet
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Långsiktiga effekter på systemstabilitet är ännu inte observerbara.
                    </p>
                  </div>
                </div>

                {/* Standard closing */}
                <div className="p-4 bg-muted rounded-lg text-center">
                  <p className="text-sm italic text-muted-foreground">
                    "{STORY_STRUCTURE.closingStatement.sv}"
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Limitations - WHERE THIS DOES NOT APPLY */}
            <Card className="border-warning/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  Var denna berättelse inte gäller
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {story.limitations.structuralDifferences.map((diff, i) => (
                  <div key={i} className="p-3 bg-warning/5 rounded-lg">
                    <div className="font-medium">{diff.factorSv}</div>
                    <p className="text-sm text-muted-foreground">
                      {diff.explanationSv}
                    </p>
                  </div>
                ))}
                
                <p className="text-sm text-muted-foreground italic">
                  {story.limitations.generalizabilityNoteSv}
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

// Outcomes section component
function OutcomesSection({ outcomes }: { outcomes: StoryOutcomes }) {
  return (
    <div className="space-y-6">
      {/* Primary */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Primära effekter
          </CardTitle>
        </CardHeader>
        <CardContent>
          {outcomes.primary.map((outcome) => (
            <OutcomeCard key={outcome.id} outcome={outcome} />
          ))}
        </CardContent>
      </Card>

      {/* Secondary */}
      {outcomes.secondary.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" />
              Sekundära effekter
            </CardTitle>
          </CardHeader>
          <CardContent>
            {outcomes.secondary.map((outcome) => (
              <OutcomeCard key={outcome.id} outcome={outcome} />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Unintended */}
      {outcomes.unintended.length > 0 && (
        <Card className="border-amber-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Oavsiktliga effekter
            </CardTitle>
          </CardHeader>
          <CardContent>
            {outcomes.unintended.map((outcome) => (
              <OutcomeCard key={outcome.id} outcome={outcome} />
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function OutcomeCard({ outcome }: { outcome: OutcomeObservation }) {
  return (
    <div className="p-4 bg-muted/30 rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {DIRECTION_ICONS[outcome.direction]}
          <span className="font-medium">{outcome.indicatorSv}</span>
        </div>
        <Badge variant="outline">
          {outcome.direction === 'increase' && '+'}
          {outcome.magnitude}%
        </Badge>
      </div>
      
      {outcome.dataPoints.length > 0 && (
        <div className="h-[120px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={outcome.dataPoints}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
      
      <div className="text-xs text-muted-foreground mt-2">
        Konfidens: {Math.round(outcome.confidence * 100)}% • 
        Tidsfördröjning: ~{outcome.timeLag.months} mån
      </div>
    </div>
  );
}
