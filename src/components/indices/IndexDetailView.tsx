/**
 * INDEX DETAIL VIEW
 * 
 * Complete drill-down view for a single index.
 * Shows methodology, components, sources, historical data, and correlations.
 * Follows infinite-clickability requirement.
 * 
 * NO ICONS - text markers only per design doctrine.
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import type { IndexDefinition } from '@/lib/lambda';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface IndexDetailViewProps {
  index: IndexDefinition;
  onBack: () => void;
  className?: string;
}

// Direction markers
const DIRECTION_INFO = {
  higher_better: { text: 'Högre är bättre', marker: '[+]', color: 'text-trend-up' },
  lower_better: { text: 'Lägre är bättre', marker: '[−]', color: 'text-trend-down' },
  neutral_optimal: { text: 'Optimalt intervall', marker: '[~]', color: 'text-trend-stable' },
};

export function IndexDetailView({ index, onBack, className }: IndexDetailViewProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'methodology' | 'data' | 'history'>('overview');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['formula']));

  const toggleSection = (section: string) => {
    const next = new Set(expandedSections);
    if (next.has(section)) {
      next.delete(section);
    } else {
      next.add(section);
    }
    setExpandedSections(next);
  };

  const direction = DIRECTION_INFO[index.direction];

  return (
    <div className={cn("flex flex-col h-full font-mono", className)}>
      {/* Header with back button */}
      <div className="flex-shrink-0 p-4 border-b bg-card">
        <div className="flex items-center gap-3 mb-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="font-mono">
            [←] Tillbaka
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="font-mono">
                {index.code}
              </Badge>
              <Badge variant="secondary" className={cn("gap-1 font-mono", direction.color)}>
                {direction.marker} {direction.text}
              </Badge>
            </div>
            <h1 className="text-2xl font-bold">{index.name_sv}</h1>
            <p className="text-sm text-muted-foreground">{index.name_en}</p>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <QuickStat 
            marker="[GEO]" 
            label="Täckning" 
            value={index.geo_coverage === 'global' ? 'Global' : index.geo_coverage.toUpperCase()} 
          />
          <QuickStat 
            marker="[TID]" 
            label="Uppdatering" 
            value={
              index.update_frequency === 'annual' ? 'Årlig' : 
              index.update_frequency === 'quarterly' ? 'Kvartalsvis' :
              index.update_frequency === 'monthly' ? 'Månatlig' : 'Veckovis'
            } 
          />
          <QuickStat 
            marker="[DATA]" 
            label="Data från" 
            value={`${index.coverage_start_year}`} 
          />
          <QuickStat 
            marker="[KOM]" 
            label="Indikatorer" 
            value={`${index.input_indicators.length}`} 
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="flex-1 flex flex-col">
        <TabsList className="w-full justify-start px-4 pt-2 rounded-none border-b bg-transparent">
          <TabsTrigger value="overview" className="gap-2 font-mono">
            [INFO] Översikt
          </TabsTrigger>
          <TabsTrigger value="methodology" className="gap-2 font-mono">
            [METOD] Metodik
          </TabsTrigger>
          <TabsTrigger value="data" className="gap-2 font-mono">
            [KÄLLA] Data & Källor
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2 font-mono">
            [HIST] Historik
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1">
          {/* Overview Tab */}
          <TabsContent value="overview" className="p-4 space-y-4 m-0">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2 font-mono">
                  [INFO] Beskrivning
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{index.description}</p>
              </CardContent>
            </Card>

            {/* Optimal Range */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2 font-mono">
                  [SKALA] Optimalt intervall
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Min</span>
                  <span className="font-mono font-medium">{index.optimal_range.min}</span>
                </div>
                <Progress 
                  value={50} 
                  className="h-3"
                />
                <div className="flex items-center justify-between text-sm">
                  <span className="font-mono font-medium">{index.optimal_range.min}</span>
                  <span className="text-xs text-muted-foreground">← Optimalt →</span>
                  <span className="font-mono font-medium">{index.optimal_range.max}</span>
                </div>
              </CardContent>
            </Card>

            {/* Input indicators */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2 font-mono">
                  [KOM] Ingående indikatorer
                </CardTitle>
                <CardDescription>
                  Klicka för att utforska varje indikator
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {index.input_indicators.map((indicator, i) => (
                    <Badge 
                      key={i} 
                      variant="outline" 
                      className="cursor-pointer hover:bg-primary/10 transition-colors font-mono"
                    >
                      {indicator.replace(/_/g, ' ')}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Primary sources */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2 font-mono">
                  [KÄLLA] Primära källor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {index.primary_sources.map((source, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <span className="text-primary shrink-0">[OK]</span>
                      <span>{source}</span>
                      <span className="text-muted-foreground ml-auto cursor-pointer hover:text-primary">[LÄNK]</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Methodology Tab */}
          <TabsContent value="methodology" className="p-4 space-y-4 m-0">
            {/* Formula */}
            <CollapsibleSection
              title="Beräkningsformel"
              marker="[FORMEL]"
              isOpen={expandedSections.has('formula')}
              onToggle={() => toggleSection('formula')}
            >
              <div className="p-4 bg-muted/50 rounded-lg font-mono text-sm">
                {index.formula_description}
              </div>
            </CollapsibleSection>

            {/* Normalization */}
            <CollapsibleSection
              title="Normaliseringsmetod"
              marker="[NORM]"
              isOpen={expandedSections.has('normalization')}
              onToggle={() => toggleSection('normalization')}
            >
              <div className="space-y-2">
                <Badge variant="secondary" className="text-sm font-mono">
                  {index.normalization_method}
                </Badge>
                <p className="text-sm text-muted-foreground">
                  {index.normalization_method === 'zscore' && 
                    'Z-score normalisering: (värde - medelvärde) / standardavvikelse. Värden uttrycks som antal standardavvikelser från genomsnittet.'}
                  {index.normalization_method === 'minmax' && 
                    'Min-Max normalisering: (värde - min) / (max - min). Skalar värden till intervallet 0-100.'}
                  {index.normalization_method === 'percentile' && 
                    'Percentil-rankning: Visar var en observation ligger i fördelningen (0-100).'}
                  {index.normalization_method === 'ppp_adjusted' && 
                    'PPP-justerat: Värdena justeras för köpkraftsparitet mellan länder.'}
                </p>
              </div>
            </CollapsibleSection>

            {/* Direction */}
            <CollapsibleSection
              title="Tolkning"
              marker="[TOLKNING]"
              isOpen={expandedSections.has('direction')}
              onToggle={() => toggleSection('direction')}
            >
              <div className="space-y-3">
                <div className={cn("flex items-center gap-2", direction.color)}>
                  <span className="font-mono">{direction.marker}</span>
                  <span className="font-medium">{direction.text}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {index.direction === 'higher_better' && 
                    'Högre värden indikerar bättre utfall. Värden över det optimala intervallet är generellt positiva.'}
                  {index.direction === 'lower_better' && 
                    'Lägre värden indikerar bättre utfall. Värden under det optimala intervallet är generellt positiva.'}
                  {index.direction === 'neutral_optimal' && 
                    'Varken för högt eller för lågt är önskvärt. Värden nära det optimala intervallet indikerar balans.'}
                </p>
              </div>
            </CollapsibleSection>

            {/* Update frequency */}
            <CollapsibleSection
              title="Uppdateringsfrekvens"
              marker="[TID]"
              isOpen={expandedSections.has('frequency')}
              onToggle={() => toggleSection('frequency')}
            >
              <div className="space-y-2">
                <Badge variant="secondary" className="font-mono">
                  {index.update_frequency === 'annual' ? 'Årlig uppdatering' : 
                   index.update_frequency === 'quarterly' ? 'Kvartalsvis uppdatering' :
                   index.update_frequency === 'monthly' ? 'Månatlig uppdatering' : 
                   index.update_frequency === 'weekly' ? 'Veckovis uppdatering' : 'Daglig uppdatering'}
                </Badge>
                <p className="text-sm text-muted-foreground">
                  Data tillgänglig från {index.coverage_start_year} till idag.
                </p>
              </div>
            </CollapsibleSection>
          </TabsContent>

          {/* Data Tab */}
          <TabsContent value="data" className="p-4 space-y-4 m-0">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2 font-mono">
                  [KÄLLA] Datakällor
                </CardTitle>
                <CardDescription>
                  Alla primära och sekundära källor för detta index
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {index.primary_sources.map((source, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                    <div className="p-2 bg-primary/10 rounded-lg shrink-0 font-mono text-xs text-primary">
                      [DATA]
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm">{source}</h4>
                      <p className="text-xs text-muted-foreground">
                        Primär källa • Verifierad • Regelbundet uppdaterad
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">[LÄNK]</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2 font-mono">
                  [GEO] Geografisk täckning
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Täckningsnivå</span>
                    <Badge variant="secondary" className="font-mono">
                      {index.geo_coverage === 'global' ? 'Global (190+ länder)' :
                       index.geo_coverage === 'oecd' ? 'OECD (38 länder)' :
                       index.geo_coverage === 'eu' ? 'EU (27 länder)' : 'Regional'}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Data tillgänglig på nationell nivå. Regional disaggregering tillgänglig för utvalda länder.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2 font-mono">
                  [!] Kvalitetsvarningar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-status-warning shrink-0">[!]</span>
                    <span>Eftersläpning i data varierar mellan 1-24 månader beroende på källa</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-status-warning shrink-0">[!]</span>
                    <span>Definitoner kan variera mellan länder</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-muted-foreground shrink-0">[i]</span>
                    <span>Se fullständig metoddokumentation för detaljer</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="p-4 space-y-4 m-0">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2 font-mono">
                  [HIST] Datatillgänglighet
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Startår</span>
                  <Badge variant="secondary" className="font-mono">{index.coverage_start_year}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Senaste data</span>
                  <Badge variant="secondary" className="font-mono">2024</Badge>
                </div>
                <Separator />
                <div className="text-center py-8">
                  <span className="text-4xl font-mono text-muted-foreground block mb-4">[GRAF]</span>
                  <p className="text-sm text-muted-foreground">
                    Historisk tidsseriedata tillgänglig.
                    <br />
                    Välj geografisk enhet för att visa utveckling.
                  </p>
                  <Button variant="outline" size="sm" className="mt-4 font-mono">
                    Visa historik [→]
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
}

// Quick stat component - text marker based
function QuickStat({ 
  marker, 
  label, 
  value 
}: { 
  marker: string; 
  label: string; 
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg font-mono">
      <div className="p-2 bg-background rounded-lg text-xs text-muted-foreground">
        {marker}
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-medium text-sm">{value}</p>
      </div>
    </div>
  );
}

// Collapsible section component - text marker based
function CollapsibleSection({ 
  title, 
  marker, 
  isOpen, 
  onToggle, 
  children 
}: { 
  title: string; 
  marker: string; 
  isOpen: boolean; 
  onToggle: () => void; 
  children: React.ReactNode;
}) {
  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-between p-4 h-auto border rounded-lg font-mono">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{marker}</span>
            <span className="font-medium">{title}</span>
          </div>
          <span>{isOpen ? '[−]' : '[+]'}</span>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="px-4 py-3 border-x border-b rounded-b-lg -mt-px">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}

export default IndexDetailView;
