/**
 * INDEX DETAIL VIEW
 * 
 * Complete drill-down view for a single index.
 * Shows methodology, components, sources, historical data, and correlations.
 * Follows infinite-clickability requirement.
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
  ArrowLeft,
  Info,
  Calculator,
  TrendingUp,
  TrendingDown,
  Minus,
  ExternalLink,
  Database,
  Clock,
  Globe2,
  LineChart,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText,
  Link2,
  ChevronDown,
  ChevronUp,
  Scale,
  Layers,
  History,
  BarChart3,
} from 'lucide-react';
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

  const directionLabel = {
    higher_better: { text: 'Högre är bättre', icon: TrendingUp, color: 'text-trend-up' },
    lower_better: { text: 'Lägre är bättre', icon: TrendingDown, color: 'text-trend-down' },
    neutral_optimal: { text: 'Optimalt intervall', icon: Minus, color: 'text-trend-stable' },
  };

  const direction = directionLabel[index.direction];
  const DirectionIcon = direction.icon;

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header with back button */}
      <div className="flex-shrink-0 p-4 border-b bg-card">
        <div className="flex items-center gap-3 mb-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="font-mono">
                {index.code}
              </Badge>
              <Badge variant="secondary" className={cn("gap-1", direction.color)}>
                <DirectionIcon className="h-3 w-3" />
                {direction.text}
              </Badge>
            </div>
            <h1 className="text-2xl font-bold">{index.name_sv}</h1>
            <p className="text-sm text-muted-foreground">{index.name_en}</p>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <QuickStat 
            icon={Globe2} 
            label="Täckning" 
            value={index.geo_coverage === 'global' ? 'Global' : index.geo_coverage.toUpperCase()} 
          />
          <QuickStat 
            icon={Clock} 
            label="Uppdatering" 
            value={
              index.update_frequency === 'annual' ? 'Årlig' : 
              index.update_frequency === 'quarterly' ? 'Kvartalsvis' :
              index.update_frequency === 'monthly' ? 'Månatlig' : 'Veckovis'
            } 
          />
          <QuickStat 
            icon={Database} 
            label="Data från" 
            value={`${index.coverage_start_year}`} 
          />
          <QuickStat 
            icon={Layers} 
            label="Indikatorer" 
            value={`${index.input_indicators.length}`} 
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="flex-1 flex flex-col">
        <TabsList className="w-full justify-start px-4 pt-2 rounded-none border-b bg-transparent">
          <TabsTrigger value="overview" className="gap-2">
            <Info className="h-4 w-4" />
            Översikt
          </TabsTrigger>
          <TabsTrigger value="methodology" className="gap-2">
            <Calculator className="h-4 w-4" />
            Metodik
          </TabsTrigger>
          <TabsTrigger value="data" className="gap-2">
            <Database className="h-4 w-4" />
            Data & Källor
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <History className="h-4 w-4" />
            Historik
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1">
          {/* Overview Tab */}
          <TabsContent value="overview" className="p-4 space-y-4 m-0">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Beskrivning
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{index.description}</p>
              </CardContent>
            </Card>

            {/* Optimal Range */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Scale className="h-4 w-4" />
                  Optimalt intervall
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
                <CardTitle className="text-base flex items-center gap-2">
                  <Layers className="h-4 w-4" />
                  Ingående indikatorer
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
                      className="cursor-pointer hover:bg-primary/10 transition-colors"
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
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Primära källor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {index.primary_sources.map((source, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                      <span>{source}</span>
                      <ExternalLink className="h-3 w-3 text-muted-foreground ml-auto cursor-pointer hover:text-primary" />
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
              icon={Calculator}
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
              icon={Scale}
              isOpen={expandedSections.has('normalization')}
              onToggle={() => toggleSection('normalization')}
            >
              <div className="space-y-2">
                <Badge variant="secondary" className="text-sm">
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
              icon={TrendingUp}
              isOpen={expandedSections.has('direction')}
              onToggle={() => toggleSection('direction')}
            >
              <div className="space-y-3">
                <div className={cn("flex items-center gap-2", direction.color)}>
                  <DirectionIcon className="h-5 w-5" />
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
              icon={Clock}
              isOpen={expandedSections.has('frequency')}
              onToggle={() => toggleSection('frequency')}
            >
              <div className="space-y-2">
                <Badge variant="secondary">
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
                <CardTitle className="text-base flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  Datakällor
                </CardTitle>
                <CardDescription>
                  Alla primära och sekundära källor för detta index
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {index.primary_sources.map((source, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                    <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                      <Database className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm">{source}</h4>
                      <p className="text-xs text-muted-foreground">
                        Primär källa • Verifierad • Regelbundet uppdaterad
                      </p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Globe2 className="h-4 w-4" />
                  Geografisk täckning
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Täckningsnivå</span>
                    <Badge variant="secondary">
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
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-status-warning" />
                  Kvalitetsvarningar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-status-warning shrink-0 mt-0.5" />
                    <span>Eftersläpning i data varierar mellan 1-24 månader beroende på källa</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-status-warning shrink-0 mt-0.5" />
                    <span>Definitoner kan variera mellan länder</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
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
                <CardTitle className="text-base flex items-center gap-2">
                  <History className="h-4 w-4" />
                  Datatillgänglighet
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Startår</span>
                  <Badge variant="secondary">{index.coverage_start_year}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Senaste data</span>
                  <Badge variant="secondary">2024</Badge>
                </div>
                <Separator />
                <div className="text-center py-8">
                  <LineChart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground">
                    Historisk tidsseriedata tillgänglig.
                    <br />
                    Välj geografisk enhet för att visa utveckling.
                  </p>
                  <Button variant="outline" size="sm" className="mt-4">
                    Visa historik →
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

// Quick stat component
function QuickStat({ 
  icon: Icon, 
  label, 
  value 
}: { 
  icon: React.ElementType; 
  label: string; 
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
      <div className="p-2 bg-background rounded-lg">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-medium text-sm">{value}</p>
      </div>
    </div>
  );
}

// Collapsible section component
function CollapsibleSection({ 
  title, 
  icon: Icon, 
  isOpen, 
  onToggle, 
  children 
}: { 
  title: string; 
  icon: React.ElementType; 
  isOpen: boolean; 
  onToggle: () => void; 
  children: React.ReactNode;
}) {
  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-between p-4 h-auto border rounded-lg">
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4" />
            <span className="font-medium">{title}</span>
          </div>
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="px-4 py-3 border-x border-b rounded-b-lg -mt-px">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}

export default IndexDetailView;
