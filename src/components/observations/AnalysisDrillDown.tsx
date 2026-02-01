import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Layers, GitBranch, BarChart3, Database, FileSpreadsheet } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Observation, 
  AnalysisChain, 
  AnalysisLevel, 
  ANALYSIS_LEVEL_TITLES,
  ANALYSIS_LEVEL_DESCRIPTIONS,
  AnalysisBreadcrumb,
  FactorContribution,
  DataLineage
} from '@/types/observation';
import { cn } from '@/lib/utils';

interface AnalysisDrillDownProps {
  observation: Observation;
  onClose: () => void;
}

const LEVEL_ICONS: Record<AnalysisLevel, React.ElementType> = {
  1: Layers,
  2: GitBranch,
  3: BarChart3,
  4: Database,
  5: FileSpreadsheet,
};

// Mock data för demonstration
const generateMockAnalysisChains = (observationId: string): AnalysisChain[] => [
  {
    id: 'chain-1',
    observation_id: observationId,
    level: 1,
    level_title: 'Analysöversikt',
    level_content: {
      summary: 'Indikatorn har försämrats kontinuerligt under 7 veckor.',
      change_description: 'Värdet har sjunkit från 78.4 till 72.1, en minskning om 8%.',
      deviation_start: '2025-11-15',
      signal_strength: 78,
      confidence: 85,
      top_factors: [
        'Demografisk förändring i arbetsför ålder',
        'Konjunkturavmattning Q4',
        'Säsongsvariation (vinter)',
      ],
    },
    sequence_order: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: 'chain-2',
    observation_id: observationId,
    level: 2,
    level_title: 'Rotorsaksanalys',
    level_content: {
      method_description: 'Trend- och förändringspunktsdetektion med ARIMA-baserad anomalidetektion.',
      why_chosen: 'Metoden valdes på grund av tidsseriens karaktär (stark säsongsvariation, linjär trend) och datatillgänglighet (månatlig granularitet).',
      statistical_details: {
        p_value: 0.003,
        confidence_interval: '95%',
        sample_size: 84,
      },
    },
    analysis_method: 'change_point_detection',
    method_rationale: 'Tidsserien uppvisar tydliga regimskiften som lämpar sig för change point-analys.',
    alternatives_tested: [
      { method: 'regression', reason_rejected: 'Linjär regression fångade inte säsongsvariationen', result_summary: 'R² = 0.42' },
      { method: 'decomposition', reason_rejected: 'STL-decomposition visade inga tydliga trendbrott', result_summary: 'Trend monoton' },
    ],
    sequence_order: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: 'chain-3',
    observation_id: observationId,
    level: 3,
    level_title: 'Faktoranalys',
    level_content: {},
    sequence_order: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: 'chain-4',
    observation_id: observationId,
    level: 4,
    level_title: 'Datakällor & Bearbetning',
    level_content: {
      source_info: [
        {
          data_source_id: 'scb-aku',
          source_name: 'SCB Arbetskraftsundersökningen',
          original_source: 'Statistiska Centralbyrån',
          collection_interval: 'Månatlig',
          aggregation_level: 'Nationell',
          transformations: ['Säsongsrensning (X-13ARIMA)', 'Glidande medelvärde (3 mån)'],
          quality_notes: 'Urvalsstorlek ~29 000 personer/månad. Standardfel ±0.3%.',
        },
      ],
    },
    sequence_order: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: 'chain-5',
    observation_id: observationId,
    level: 5,
    level_title: 'Rå Tidsserie',
    level_content: {
      time_series: Array.from({ length: 24 }, (_, i) => ({
        timestamp: new Date(2024, i % 12, 1).toISOString(),
        value: 75 + Math.random() * 8 - (i > 18 ? (i - 18) * 1.5 : 0),
        is_missing: i === 7,
        is_corrected: i === 12,
        correction_note: i === 12 ? 'Metodbyte i källa, värde justerat för jämförbarhet' : undefined,
      })),
      missing_data_markers: ['2024-08'],
      correction_markers: ['2025-01: Metodbyte SCB AKU'],
      methodology_change_markers: [],
    },
    sequence_order: 0,
    created_at: new Date().toISOString(),
  },
];

const generateMockFactors = (): FactorContribution[] => [
  {
    id: 'factor-1',
    analysis_chain_id: 'chain-3',
    factor_name: 'Arbetsför befolkning 25-54',
    factor_kpi_id: 'working-age',
    contribution_strength: 42,
    time_relation: 'föregick med 2-3 månader',
    stability_score: 78,
    uncertainty: 15,
    evidence_periods: 5,
    evidence_total_periods: 6,
    description: 'Faktor A har konsekvent föregått förändringen med 2-3 månader i 5 av 6 mätperioder.',
    sequence_order: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: 'factor-2',
    analysis_chain_id: 'chain-3',
    factor_name: 'Konjunkturbarometer (företag)',
    contribution_strength: 31,
    time_relation: 'sammanfaller',
    stability_score: 65,
    uncertainty: 22,
    evidence_periods: 4,
    evidence_total_periods: 6,
    description: 'Konjunkturförväntningar samvarierar med indikatorn. Korrelation observerad, kausalitet ej fastställd.',
    sequence_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: 'factor-3',
    analysis_chain_id: 'chain-3',
    factor_name: 'Säsongseffekt (Q4)',
    contribution_strength: 18,
    time_relation: 'cyklisk',
    stability_score: 92,
    uncertainty: 8,
    evidence_periods: 6,
    evidence_total_periods: 6,
    description: 'Säsongsmönster bekräftat i samtliga mätperioder. Förväntad variation, ej anomali.',
    sequence_order: 2,
    created_at: new Date().toISOString(),
  },
];

export function AnalysisDrillDown({ observation, onClose }: AnalysisDrillDownProps) {
  const [currentLevel, setCurrentLevel] = useState<AnalysisLevel>(1);
  const [breadcrumbs, setBreadcrumbs] = useState<AnalysisBreadcrumb[]>([
    { level: 1, title: 'Analysöversikt' }
  ]);
  
  const chains = generateMockAnalysisChains(observation.id);
  const factors = generateMockFactors();
  
  const currentChain = chains.find(c => c.level === currentLevel);
  
  const navigateToLevel = (level: AnalysisLevel) => {
    if (level > currentLevel) {
      // Gå djupare
      setBreadcrumbs(prev => [...prev, { 
        level, 
        title: ANALYSIS_LEVEL_TITLES[level] 
      }]);
    } else if (level < currentLevel) {
      // Gå tillbaka
      setBreadcrumbs(prev => prev.filter(b => b.level <= level));
    }
    setCurrentLevel(level);
  };
  
  const goBack = () => {
    if (currentLevel > 1) {
      navigateToLevel((currentLevel - 1) as AnalysisLevel);
    }
  };
  
  const goForward = () => {
    if (currentLevel < 5) {
      navigateToLevel((currentLevel + 1) as AnalysisLevel);
    }
  };
  
  const LevelIcon = LEVEL_ICONS[currentLevel];

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex flex-col">
      {/* Header med breadcrumbs */}
      <div className="border-b bg-card p-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" onClick={onClose} className="gap-2">
              <ChevronLeft className="h-4 w-4" />
              Tillbaka till iakttagelser
            </Button>
            
            <div className="text-sm text-muted-foreground">
              Du är här i analyskedjan:
            </div>
          </div>
          
          {/* Breadcrumb navigation */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {breadcrumbs.map((crumb, index) => {
              const Icon = LEVEL_ICONS[crumb.level];
              return (
                <div key={crumb.level} className="flex items-center gap-2">
                  {index > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                  <Button
                    variant={crumb.level === currentLevel ? "default" : "outline"}
                    size="sm"
                    className="gap-2"
                    onClick={() => navigateToLevel(crumb.level)}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{crumb.title}</span>
                    <span className="sm:hidden">Nivå {crumb.level}</span>
                  </Button>
                </div>
              );
            })}
            
            {/* Visa kommande nivåer (grayed out) */}
            {Array.from({ length: 5 - currentLevel }, (_, i) => {
              const level = (currentLevel + i + 1) as AnalysisLevel;
              const Icon = LEVEL_ICONS[level];
              return (
                <div key={level} className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4 text-muted-foreground/40" />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-muted-foreground/40"
                    onClick={() => navigateToLevel(level)}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{ANALYSIS_LEVEL_TITLES[level]}</span>
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <ScrollArea className="flex-1">
        <div className="max-w-5xl mx-auto p-6">
          {/* Level header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-xl bg-primary/10">
                <LevelIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  Nivå {currentLevel}: {ANALYSIS_LEVEL_TITLES[currentLevel]}
                </h2>
                <p className="text-muted-foreground">
                  {ANALYSIS_LEVEL_DESCRIPTIONS[currentLevel]}
                </p>
              </div>
            </div>
            <Badge variant="outline" className="mt-2">
              KPI: {observation.kpi_name || observation.title}
            </Badge>
          </div>
          
          <Separator className="mb-6" />
          
          {/* Level-specific content */}
          {currentLevel === 1 && currentChain && (
            <Level1Overview chain={currentChain} />
          )}
          
          {currentLevel === 2 && currentChain && (
            <Level2Method chain={currentChain} />
          )}
          
          {currentLevel === 3 && (
            <Level3Factors factors={factors} />
          )}
          
          {currentLevel === 4 && currentChain && (
            <Level4DataSources chain={currentChain} />
          )}
          
          {currentLevel === 5 && currentChain && (
            <Level5RawData chain={currentChain} />
          )}
          
          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={goBack}
              disabled={currentLevel === 1}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Föregående nivå
            </Button>
            
            <Button
              onClick={goForward}
              disabled={currentLevel === 5}
              className="gap-2"
            >
              Nästa nivå
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

// Nivå 1: Analysöversikt
function Level1Overview({ chain }: { chain: AnalysisChain }) {
  const content = chain.level_content;
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Sammanfattning</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg">{content.summary}</p>
          <p className="text-muted-foreground">{content.change_description}</p>
          
          {content.deviation_start && (
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="outline">Avvikelsen började:</Badge>
              <span>{new Date(content.deviation_start).toLocaleDateString('sv-SE')}</span>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Signalstyrka</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{content.signal_strength}%</div>
            <div className="h-2 bg-muted rounded-full mt-2 overflow-hidden">
              <div 
                className="h-full bg-accent"
                style={{ width: `${content.signal_strength}%` }}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Säkerhet i slutsats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{content.confidence}%</div>
            <div className="h-2 bg-muted rounded-full mt-2 overflow-hidden">
              <div 
                className="h-full bg-primary"
                style={{ width: `${content.confidence}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {content.top_factors && (
        <Card>
          <CardHeader>
            <CardTitle>Bidragande faktorer (rangordnade)</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2">
              {content.top_factors.map((factor, i) => (
                <li key={i} className="text-muted-foreground">
                  {factor}
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Nivå 2: Rotorsaksanalys (metod)
function Level2Method({ chain }: { chain: AnalysisChain }) {
  const content = chain.level_content;
  
  const METHOD_LABELS: Record<string, string> = {
    trend_detection: 'Trenddetektion',
    change_point_detection: 'Förändringspunktsdetektion',
    correlation_analysis: 'Korrelationsanalys',
    lag_analysis: 'Tidsfördröjningsanalys',
    regression: 'Regression',
    decomposition: 'Tidsseriedekomposition',
    anomaly_detection: 'Anomalidetektion',
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Använd metod
            {chain.analysis_method && (
              <Badge>{METHOD_LABELS[chain.analysis_method] || chain.analysis_method}</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>{content.method_description}</p>
          
          {chain.method_rationale && (
            <div className="bg-muted p-4 rounded-lg">
              <div className="font-medium mb-1">Varför denna metod:</div>
              <p className="text-muted-foreground">{chain.method_rationale}</p>
            </div>
          )}
          
          {content.statistical_details && (
            <div className="grid grid-cols-3 gap-4 mt-4">
              {Object.entries(content.statistical_details).map(([key, value]) => (
                <div key={key} className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-lg font-mono font-bold">{String(value)}</div>
                  <div className="text-xs text-muted-foreground uppercase">{key.replace('_', ' ')}</div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {chain.alternatives_tested && chain.alternatives_tested.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Alternativ som testades och förkastades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {chain.alternatives_tested.map((alt, i) => (
                <div key={i} className="border-l-2 border-muted pl-4">
                  <div className="font-medium">{METHOD_LABELS[alt.method] || alt.method}</div>
                  <p className="text-sm text-muted-foreground">{alt.reason_rejected}</p>
                  {alt.result_summary && (
                    <Badge variant="outline" className="mt-1">{alt.result_summary}</Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Nivå 3: Faktoranalys
function Level3Factors({ factors }: { factors: FactorContribution[] }) {
  return (
    <div className="space-y-4">
      {factors.map((factor) => (
        <Card key={factor.id}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{factor.factor_name}</CardTitle>
              <Badge 
                variant={factor.contribution_strength > 30 ? "default" : "outline"}
              >
                Bidrag: {factor.contribution_strength}%
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground italic">
              "{factor.description}"
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">Tidsrelation</div>
                <div className="font-medium">{factor.time_relation}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Stabilitet</div>
                <div className="font-medium">{factor.stability_score}%</div>
              </div>
              <div>
                <div className="text-muted-foreground">Osäkerhet</div>
                <div className="font-medium">±{factor.uncertainty}%</div>
              </div>
              <div>
                <div className="text-muted-foreground">Evidens</div>
                <div className="font-medium">
                  {factor.evidence_periods}/{factor.evidence_total_periods} perioder
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Nivå 4: Datakällor & bearbetning
function Level4DataSources({ chain }: { chain: AnalysisChain }) {
  const sources = chain.level_content.source_info || [];
  
  return (
    <div className="space-y-4">
      {sources.map((source, i) => (
        <Card key={i}>
          <CardHeader>
            <CardTitle>{source.source_name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Original källa</div>
                <div className="font-medium">{source.original_source}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Insamlingsintervall</div>
                <div className="font-medium">{source.collection_interval}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Aggregeringsnivå</div>
                <div className="font-medium">{source.aggregation_level}</div>
              </div>
            </div>
            
            {source.transformations.length > 0 && (
              <div>
                <div className="text-sm text-muted-foreground mb-2">Transformationer</div>
                <div className="flex flex-wrap gap-2">
                  {source.transformations.map((t, j) => (
                    <Badge key={j} variant="outline">{t}</Badge>
                  ))}
                </div>
              </div>
            )}
            
            {source.quality_notes && (
              <div className="bg-muted p-3 rounded-lg text-sm">
                <span className="font-medium">Kvalitetsnotering:</span> {source.quality_notes}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Nivå 5: Rå tidsserie
function Level5RawData({ chain }: { chain: AnalysisChain }) {
  const timeSeries = chain.level_content.time_series || [];
  const markers = chain.level_content;
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Originalvärden (datapunktsnivå)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3">Tidpunkt</th>
                  <th className="text-right py-2 px-3">Värde</th>
                  <th className="text-left py-2 px-3">Status</th>
                  <th className="text-left py-2 px-3">Notering</th>
                </tr>
              </thead>
              <tbody>
                {timeSeries.map((point, i) => (
                  <tr 
                    key={i} 
                    className={cn(
                      "border-b",
                      point.is_missing && "bg-destructive/10",
                      point.is_corrected && "bg-warning/10"
                    )}
                  >
                    <td className="py-2 px-3 font-mono">
                      {new Date(point.timestamp).toLocaleDateString('sv-SE')}
                    </td>
                    <td className="py-2 px-3 text-right font-mono">
                      {point.is_missing ? '—' : point.value.toFixed(2)}
                    </td>
                    <td className="py-2 px-3">
                      {point.is_missing && <Badge variant="destructive">Saknas</Badge>}
                      {point.is_corrected && <Badge variant="outline">Korrigerad</Badge>}
                    </td>
                    <td className="py-2 px-3 text-muted-foreground text-xs">
                      {point.correction_note}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid md:grid-cols-3 gap-4">
        {markers.missing_data_markers && markers.missing_data_markers.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Saknade data</CardTitle>
            </CardHeader>
            <CardContent>
              {markers.missing_data_markers.map((m, i) => (
                <Badge key={i} variant="destructive" className="mr-1">{m}</Badge>
              ))}
            </CardContent>
          </Card>
        )}
        
        {markers.correction_markers && markers.correction_markers.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Korrigeringar</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {markers.correction_markers.map((m, i) => (
                <div key={i}>{m}</div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
      
      <div className="bg-muted/50 p-4 rounded-lg text-center text-muted-foreground">
        <div className="font-medium">🔒 Spårets slut</div>
        <p className="text-sm">Detta är den lägsta aggregeringsnivån tillgänglig enligt dataskyddsregler.</p>
      </div>
    </div>
  );
}
