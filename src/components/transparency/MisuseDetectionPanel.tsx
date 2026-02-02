/**
 * MISUSE DETECTION LAYER (MDL)
 * Panel for identifying misleading data usage
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  ShieldAlert, AlertTriangle, CheckCircle, Eye, 
  ExternalLink, Info, ChevronDown, ChevronUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  MDL_CORE_PRINCIPLE,
  MISUSE_DEFINITIONS,
  MOCK_DETECTIONS,
  type MisuseDetection,
  type MisuseType,
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
            {MDL_CORE_PRINCIPLE.statement}
          </p>
        </div>
      </div>

      {/* Core disclaimer */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Systemet identifierar vilseledande presentation – det censurerar inte innehåll.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="recent" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recent">Senaste flaggningar</TabsTrigger>
          <TabsTrigger value="types">Typer av missbruk</TabsTrigger>
          <TabsTrigger value="guide">Läsarguide</TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="space-y-4">
          {MOCK_DETECTIONS.map((detection) => (
            <MisuseDetectionCard key={detection.id} detection={detection} />
          ))}
        </TabsContent>

        <TabsContent value="types" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {Object.values(MISUSE_DEFINITIONS).map((def) => (
              <MisuseTypeCard key={def.type} definition={def} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="guide">
          <ReaderGuide />
        </TabsContent>
      </Tabs>
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

  return (
    <Card className={cn("border-2", severityStyles[detection.severity])}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <span>{detection.source}</span>
              <span>•</span>
              <span>{detection.detectedAt}</span>
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

        {/* Explanation */}
        <div className="p-3 bg-warning/10 rounded-lg">
          <p className="text-sm font-medium text-warning mb-1">Varför är detta vilseledande?</p>
          <p className="text-sm text-muted-foreground">{detection.explanationSv}</p>
        </div>

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
              Visa korrekt version
            </>
          )}
        </Button>

        {expanded && (
          <div className="space-y-3 pt-2 border-t">
            <div className="p-3 bg-success/10 rounded-lg">
              <p className="text-sm font-medium text-success mb-1">Korrekt formulering:</p>
              <p className="text-sm">{detection.correctVersionSv}</p>
            </div>
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
          <CardTitle className="text-base">{definition.nameSv}</CardTitle>
          <Badge variant="outline" className={severityColors[definition.severity]}>
            {definition.severity === 'high' ? 'Hög' :
             definition.severity === 'medium' ? 'Medel' : 'Låg'} risk
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{definition.descriptionSv}</p>
        
        <div className="text-xs">
          <span className="font-medium">Vanliga källor: </span>
          <span className="text-muted-foreground">
            {definition.commonSources.join(', ')}
          </span>
        </div>

        <div className="p-2 bg-muted/50 rounded text-xs">
          <span className="font-medium">Upptäcksmetod: </span>
          {definition.detectionMethod}
        </div>
      </CardContent>
    </Card>
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
        <div className="grid md:grid-cols-2 gap-4">
          {tips.map((tip, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium">
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
