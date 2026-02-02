/**
 * MISUSE DETECTION LAYER (MDL)
 * BLOCK VA–VI: Fullständigt skyddslager
 * 
 * OBRYTBAR PRINCIP:
 * Systemet försvarar kontext, inte narrativ.
 * Det skyddar förståelse, inte positioner.
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  ShieldAlert, AlertTriangle, CheckCircle, Eye, 
  ExternalLink, Info, ChevronDown, ChevronUp,
  Share2, BookOpen, TrendingUp, TrendingDown, Minus,
  Lightbulb, Shield, Link2, BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  MDL_CORE_PRINCIPLE,
  MISUSE_DEFINITIONS,
  MOCK_DETECTIONS,
  MISUSE_CLASSIFICATIONS,
  CONTEXT_ELEMENTS,
  CLAIM_ALIGNMENT_STATEMENTS,
  PUBLIC_INDICATOR_TEMPLATES,
  SHARING_CHECKS,
  MOCK_HEATMAP_DATA,
  NON_PUNITIVE_PRINCIPLES,
  EDUCATIONAL_FEEDBACK,
  type MisuseDetection,
  type MisuseType,
  type MisuseClassification,
  type ContextElement,
  type ClaimAlignment,
} from '@/config/misuseDetectionConfig';

export function MisuseDetectionPanel() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <ShieldAlert className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Misuse Detection Layer</h1>
          <p className="text-sm text-muted-foreground">
            {MDL_CORE_PRINCIPLE.systemQuestion}
          </p>
        </div>
      </div>

      {/* Core disclaimers */}
      <div className="grid md:grid-cols-2 gap-4">
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Systemet försvarar kontext, inte narrativ. Det skyddar förståelse, inte positioner.
          </AlertDescription>
        </Alert>
        <Alert variant="default" className="border-primary/20">
          <Info className="h-4 w-4" />
          <AlertDescription>
            Fokus: användning, inte innehåll. Inget innehållsdömande – bara mönster.
          </AlertDescription>
        </Alert>
      </div>

      <Tabs defaultValue="detections" className="space-y-4">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="detections">Flaggningar</TabsTrigger>
          <TabsTrigger value="patterns">Mönster (VA)</TabsTrigger>
          <TabsTrigger value="heatmap">Heatmap (VG)</TabsTrigger>
          <TabsTrigger value="selfcheck">Självkontroll (VF)</TabsTrigger>
          <TabsTrigger value="education">Lärande (VI)</TabsTrigger>
        </TabsList>

        {/* BLOCK VA + VB + VC + VD + VE — Detections */}
        <TabsContent value="detections" className="space-y-4">
          <Card className="border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Block VA–VE: Identifiering & Klassificering
              </CardTitle>
              <CardDescription>
                Senaste flaggade fall av vilseledande dataanvändning
              </CardDescription>
            </CardHeader>
          </Card>
          {MOCK_DETECTIONS.map((detection) => (
            <MisuseDetectionCard key={detection.id} detection={detection} />
          ))}
        </TabsContent>

        {/* BLOCK VA — Misuse Pattern Engine */}
        <TabsContent value="patterns" className="space-y-4">
          <Card className="border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Block VA: Misuse Pattern Engine
              </CardTitle>
              <CardDescription>
                Kända mönster för hur data missbrukas – inget innehållsdömande, bara strukturer
              </CardDescription>
            </CardHeader>
          </Card>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.values(MISUSE_DEFINITIONS).map((def) => (
              <MisuseTypeCard key={def.type} definition={def} />
            ))}
          </div>
        </TabsContent>

        {/* BLOCK VG — Misuse Heatmap */}
        <TabsContent value="heatmap" className="space-y-4">
          <Card className="border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Block VG: Misuse Heatmap (Aggregerad)
              </CardTitle>
              <CardDescription>
                Meta-insikt om vilka typer av data som oftast missbrukas – inte övervakning
              </CardDescription>
            </CardHeader>
          </Card>
          <MisuseHeatmap />
        </TabsContent>

        {/* BLOCK VF — Self-Check for Users */}
        <TabsContent value="selfcheck" className="space-y-4">
          <Card className="border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Block VF: Självkontroll innan delning
              </CardTitle>
              <CardDescription>
                Förhindra oavsiktligt missbruk genom att kontrollera vad som saknas
              </CardDescription>
            </CardHeader>
          </Card>
          <SharingCheckPanel />
        </TabsContent>

        {/* BLOCK VI — Educational Feedback Loop */}
        <TabsContent value="education" className="space-y-4">
          <Card className="border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                Block VI: Educational Feedback Loop
              </CardTitle>
              <CardDescription>
                Missbruk blir tillfälle för lärande – inte straff
              </CardDescription>
            </CardHeader>
          </Card>
          <EducationalFeedbackPanel />
          
          {/* BLOCK VH — Non-Punitive Principles */}
          <Card className="border-success/30 bg-success/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-4 w-4 text-success" />
                Block VH: Icke-straffande design
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-3">
                {Object.entries(NON_PUNITIVE_PRINCIPLES).map(([key, principle]) => (
                  <div key={key} className="flex items-center gap-2 p-2 bg-background rounded">
                    <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                    <span className="text-sm">{principle.sv}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Reader guide */}
      <ReaderGuide />
    </div>
  );
}

function MisuseDetectionCard({ detection }: { detection: MisuseDetection }) {
  const [expanded, setExpanded] = useState(false);

  const severityStyles = {
    low: 'border-muted',
    medium: 'border-warning/50',
    high: 'border-destructive/50',
    critical: 'border-destructive bg-destructive/5',
  };

  const statusIcons = {
    flagged: <AlertTriangle className="h-4 w-4 text-warning" />,
    verified: <CheckCircle className="h-4 w-4 text-success" />,
    disputed: <Info className="h-4 w-4 text-muted-foreground" />,
    corrected: <CheckCircle className="h-4 w-4 text-primary" />,
  };

  const classification = MISUSE_CLASSIFICATIONS[detection.classification];
  const publicIndicator = PUBLIC_INDICATOR_TEMPLATES[detection.classification];

  return (
    <Card className={cn("border-2", severityStyles[detection.severity])}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <span>{detection.source}</span>
              <span>•</span>
              <span>{detection.detectedAt}</span>
              <span>•</span>
              <Badge variant="outline" className="text-xs">
                {classification.nameSv}
              </Badge>
            </div>
            <CardTitle className="text-base">{detection.claimSv}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {statusIcons[detection.status]}
            <Badge variant="outline">
              {detection.severity === 'critical' ? 'Kritisk' :
               detection.severity === 'high' ? 'Hög' :
               detection.severity === 'medium' ? 'Medel' : 'Låg'}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Misuse types */}
        <div className="flex flex-wrap gap-2">
          {detection.misuseTypes.map((type) => (
            <Badge key={type} variant="secondary" className="text-xs">
              {MISUSE_DEFINITIONS[type].nameSv}
            </Badge>
          ))}
        </div>

        {/* BLOCK VE — Public Indicator */}
        <Alert className={cn(
          publicIndicator.type === 'warning' ? 'border-warning/50 bg-warning/5' :
          publicIndicator.type === 'notice' ? 'border-primary/50 bg-primary/5' :
          'border-muted'
        )}>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex flex-col gap-2">
            <span>{publicIndicator.messageSv}</span>
            <div className="flex flex-wrap gap-2">
              {publicIndicator.links.map((link, i) => (
                <Button key={i} variant="link" size="sm" className="h-auto p-0 text-xs">
                  <Link2 className="h-3 w-3 mr-1" />
                  {link.labelSv}
                </Button>
              ))}
            </div>
          </AlertDescription>
        </Alert>

        {/* Explanation */}
        <div className="p-3 bg-warning/10 rounded-lg">
          <p className="text-sm font-medium text-warning mb-1">Varför är detta vilseledande?</p>
          <p className="text-sm text-muted-foreground">{detection.explanationSv}</p>
        </div>

        {/* BLOCK VB — Context Lost */}
        {detection.contextLost.length > 0 && (
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-xs font-medium mb-2">Borttappad kontext:</p>
            <div className="flex flex-wrap gap-1">
              {detection.contextLost.map((element) => (
                <Badge key={element} variant="outline" className="text-xs">
                  {CONTEXT_ELEMENTS[element].nameSv}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setExpanded(!expanded)}
          className="w-full"
        >
          {expanded ? (
            <>
              <ChevronUp className="h-4 w-4 mr-2" />
              Dölj detaljer
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-2" />
              Visa korrekt version & lärande
            </>
          )}
        </Button>

        {expanded && (
          <div className="space-y-3 pt-2 border-t">
            <div className="p-3 bg-success/10 rounded-lg">
              <p className="text-sm font-medium text-success mb-1">Korrekt formulering:</p>
              <p className="text-sm">{detection.correctVersionSv}</p>
            </div>
            
            {/* Educational feedback */}
            {detection.misuseTypes[0] && (
              <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="h-4 w-4 text-primary" />
                  <p className="text-sm font-medium">Nyckellärdom:</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {EDUCATIONAL_FEEDBACK[detection.misuseTypes[0]].keyTakeawaySv}
                </p>
              </div>
            )}

            <div>
              <p className="text-xs font-medium mb-1">Data som användes:</p>
              <div className="flex flex-wrap gap-1">
                {detection.dataUsed.map((data, i) => (
                  <Badge key={i} variant="outline" className="text-xs">
                    {data}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function MisuseTypeCard({ definition }: { definition: typeof MISUSE_DEFINITIONS[MisuseType] }) {
  const severityColors = {
    low: 'text-muted-foreground',
    medium: 'text-warning',
    high: 'text-destructive',
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-sm">{definition.nameSv}</CardTitle>
          <Badge variant="outline" className={cn("text-xs", severityColors[definition.severity])}>
            {definition.severity === 'high' ? 'Hög' :
             definition.severity === 'medium' ? 'Medel' : 'Låg'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-xs text-muted-foreground">{definition.descriptionSv}</p>
        
        <div className="p-2 bg-muted/50 rounded text-xs">
          <span className="font-medium">Mönster: </span>
          {definition.examplePattern}
        </div>

        <div className="text-xs">
          <span className="font-medium">Upptäcksmetod: </span>
          <span className="text-muted-foreground">{definition.detectionMethod}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function MisuseHeatmap() {
  const trendIcon = (trend: 'increasing' | 'stable' | 'decreasing') => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="h-4 w-4 text-destructive" />;
      case 'decreasing': return <TrendingDown className="h-4 w-4 text-success" />;
      default: return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const maxDetections = Math.max(...MOCK_HEATMAP_DATA.map(d => d.totalDetections));

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {MOCK_HEATMAP_DATA.map((domain) => (
        <Card key={domain.domain}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{domain.domainSv}</CardTitle>
              <div className="flex items-center gap-2">
                {trendIcon(domain.trend)}
                <Badge variant="outline">{domain.totalDetections} flaggningar</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <Progress 
              value={(domain.totalDetections / maxDetections) * 100} 
              className="h-2"
            />
            
            <div>
              <p className="text-xs font-medium mb-2">Mest sårbara för:</p>
              <div className="flex flex-wrap gap-1">
                {domain.mostVulnerable.map((type) => (
                  <Badge key={type} variant="secondary" className="text-xs">
                    {MISUSE_DEFINITIONS[type].nameSv}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="text-xs text-muted-foreground">
              Trend: {domain.trend === 'increasing' ? 'Ökande' : 
                      domain.trend === 'decreasing' ? 'Minskande' : 'Stabil'}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function SharingCheckPanel() {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const toggleCheck = (element: string) => {
    setCheckedItems(prev => ({ ...prev, [element]: !prev[element] }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="h-5 w-5 text-primary" />
          Kontrollera innan du delar
        </CardTitle>
        <CardDescription>
          Säkerställ att din delning inkluderar nödvändig kontext
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {SHARING_CHECKS.map((check, i) => (
          <div 
            key={i} 
            className={cn(
              "flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
              checkedItems[check.elementMissing] 
                ? "bg-success/5 border-success/30" 
                : "bg-muted/50 border-transparent hover:border-muted"
            )}
            onClick={() => toggleCheck(check.elementMissing)}
          >
            <div className={cn(
              "w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 mt-0.5",
              checkedItems[check.elementMissing] 
                ? "bg-success border-success" 
                : "border-muted-foreground"
            )}>
              {checkedItems[check.elementMissing] && (
                <CheckCircle className="h-3 w-3 text-success-foreground" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium">{check.warningSv}</p>
              <p className="text-xs text-muted-foreground mt-1">{check.suggestionSv}</p>
            </div>
          </div>
        ))}

        <Alert className="mt-4">
          <Lightbulb className="h-4 w-4" />
          <AlertDescription>
            Dessa kontroller hjälper dig undvika oavsiktlig vilseledning. 
            Markera de punkter du har åtgärdat innan delning.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}

function EducationalFeedbackPanel() {
  const [selectedType, setSelectedType] = useState<MisuseType | null>(null);

  const feedbackTypes = Object.values(EDUCATIONAL_FEEDBACK).slice(0, 6);

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-3 gap-3">
        {feedbackTypes.map((feedback) => (
          <Card 
            key={feedback.misuseType}
            className={cn(
              "cursor-pointer transition-all",
              selectedType === feedback.misuseType 
                ? "border-primary ring-1 ring-primary" 
                : "hover:border-muted-foreground/30"
            )}
            onClick={() => setSelectedType(
              selectedType === feedback.misuseType ? null : feedback.misuseType
            )}
          >
            <CardContent className="p-4">
              <p className="font-medium text-sm mb-1">
                {MISUSE_DEFINITIONS[feedback.misuseType].nameSv}
              </p>
              <p className="text-xs text-primary font-medium">
                "{feedback.keyTakeawaySv}"
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedType && (
        <Card className="border-primary/30">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Lärande: {MISUSE_DEFINITIONS[selectedType].nameSv}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-destructive/5 rounded-lg border border-destructive/20">
              <p className="text-sm font-medium text-destructive mb-1">Vad gick fel?</p>
              <p className="text-sm">{EDUCATIONAL_FEEDBACK[selectedType].whatWentWrongSv}</p>
            </div>
            
            <div className="p-3 bg-success/5 rounded-lg border border-success/20">
              <p className="text-sm font-medium text-success mb-1">Hur göra korrekt?</p>
              <p className="text-sm">{EDUCATIONAL_FEEDBACK[selectedType].howToDoCorrectlySv}</p>
            </div>

            <Button variant="outline" size="sm" className="w-full">
              <ExternalLink className="h-4 w-4 mr-2" />
              Gå till relaterad lärandemodul
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ReaderGuide() {
  const tips = [
    { title: 'Kontrollera hela datasetet', description: 'Är endast utvalda punkter visade?' },
    { title: 'Granska tidslinjen', description: 'Är start- och slutdatum rimliga?' },
    { title: 'Sök jämförelsegrupper', description: 'Mot vad jämförs detta?' },
    { title: 'Fråga efter källan', description: 'Var kommer datan ifrån?' },
    { title: 'Leta efter kontext', description: 'Vad utelämnas?' },
    { title: 'Korrelation ≠ kausalitet', description: 'Bevisas orsak eller bara samband?' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-primary" />
          Läsarguide: Hur du själv upptäcker vilseledning
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tips.map((tip, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium flex-shrink-0">
                {i + 1}
              </div>
              <div>
                <p className="text-sm font-medium">{tip.title}</p>
                <p className="text-xs text-muted-foreground">{tip.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
