/**
 * FACTOR DEEP DIVE - FULL EXPLANATION PYRAMID
 * ═══════════════════════════════════════════════════════════════
 * 
 * Multi-level deep dive following the 5-level explanation pyramid:
 * L1: Observation (Vad?)
 * L2: Mechanism (Varför?)
 * L3: Method (Hur vet vi?)
 * L4: Limitations (Vad visar detta INTE?)
 * L5: Raw Data (Underliggande siffror)
 * 
 * Every claim is clickable. Every number is traceable.
 */

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown,
  Clock, 
  BookOpen, 
  Globe, 
  ChevronRight,
  ExternalLink,
  BarChart3,
  History,
  AlertTriangle,
  Database,
  FileText,
  Link2,
  Microscope,
  Scale,
  Zap,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Download,
  Share2,
  Bookmark
} from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import type { CapacityFactor } from '@/config/carryingCapacityConfig';

interface FactorDeepDiveProps {
  factor: CapacityFactor | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Comprehensive evidence data structure
interface FactorEvidence {
  // L1: Observation
  observation: {
    summary: string;
    keyMetric: { value: number; unit: string; change: number; period: string };
    globalPattern: string;
    thisShows: string[];
    thisDoesNotShow: string[];
  };
  // L2: Mechanism
  mechanism: {
    causalChain: Array<{ step: number; description: string; confidence: 'high' | 'medium' | 'low' }>;
    primaryDrivers: Array<{ name: string; contribution: number; description: string }>;
    feedbackLoops: Array<{ type: 'positive' | 'negative'; description: string }>;
    timelag: { min: number; max: number; unit: string; explanation: string };
  };
  // L3: Method
  methodology: {
    dataCollection: { method: string; frequency: string; coverage: number };
    statisticalApproach: string;
    validationMethod: string;
    peerReview: { status: 'yes' | 'partial' | 'no'; details: string };
    replicationAttempts: { total: number; successful: number; details: string };
    alternativeInterpretations: string[];
  };
  // L4: Limitations
  limitations: {
    dataGaps: Array<{ gap: string; impact: 'critical' | 'moderate' | 'minor' }>;
    methodologicalWeaknesses: string[];
    confoundingFactors: Array<{ factor: string; controlled: boolean }>;
    geographicLimitations: string[];
    temporalLimitations: string[];
    expertDissent: Array<{ perspective: string; source: string }>;
  };
  // L5: Raw Data
  rawData: {
    timeSeries: Array<{ year: number; value: number; source: string }>;
    regionalBreakdown: Array<{ region: string; value: number; trend: 'up' | 'down' | 'stable' }>;
    sources: Array<{ 
      name: string; 
      type: 'official' | 'academic' | 'institutional';
      url: string;
      lastUpdated: string;
      reliability: number;
    }>;
    downloadFormats: string[];
  };
  // Historical cases
  cases: Array<{
    region: string;
    period: string;
    description: string;
    impact: string;
    outcome: 'positive' | 'negative' | 'mixed';
    source: string;
    methodology: string;
    dataPoints: Array<{ label: string; before: number; after: number; unit: string }>;
  }>;
  // Related indicators
  relatedIndicators: Array<{
    code: string;
    name: string;
    correlation: number;
    description: string;
  }>;
}

// Mock comprehensive evidence data
const getFactorEvidence = (factorId: string): FactorEvidence | null => {
  const evidenceMap: Record<string, FactorEvidence> = {
    stable_energy: {
      observation: {
        summary: 'Regioner med stabil elproduktion (låg intermittens) uppvisar konsekvent högre industriell output och lägre energikostnader per enhet BNP.',
        keyMetric: { value: 2.8, unit: '× högre industriproduktion', change: 180, period: '1950–2020' },
        globalPattern: 'Mönstret observeras i 34 av 38 OECD-länder under perioden 1960–2020.',
        thisShows: [
          'Korrelation mellan energistabilitet och industriell tillväxt',
          'Samband mellan basproduktion och låga spotpriser',
          'Historiskt mönster i industrialiserade ekonomier'
        ],
        thisDoesNotShow: [
          'Att stabil energi ORSAKAR tillväxt (kausalitet ej bevisad)',
          'Att intermittent energi inte kan fungera med rätt infrastruktur',
          'Framtida teknologiska lösningar (lagring, smarta nät)',
          'Optimala energimixen för specifika länder'
        ]
      },
      mechanism: {
        causalChain: [
          { step: 1, description: 'Stabil basproduktion sänker osäkerhet i energipriser', confidence: 'high' },
          { step: 2, description: 'Lägre osäkerhet minskar riskpremie för investeringar', confidence: 'medium' },
          { step: 3, description: 'Fler investeringar i energiintensiv industri', confidence: 'medium' },
          { step: 4, description: 'Ökad industrikapacitet och sysselsättning', confidence: 'high' },
          { step: 5, description: 'Högre BNP per capita och levnadsstandard', confidence: 'medium' }
        ],
        primaryDrivers: [
          { name: 'Kapacitetsfaktor', contribution: 35, description: 'Andel av maximal produktion som faktiskt levereras' },
          { name: 'Prognosbarhet', contribution: 30, description: 'Förmåga att förutsäga produktion 24–48h framåt' },
          { name: 'Systemkostnad', contribution: 25, description: 'Total kostnad inklusive backup och nätförstärkning' },
          { name: 'Reglerbarhet', contribution: 10, description: 'Förmåga att snabbt justera produktion efter behov' }
        ],
        feedbackLoops: [
          { type: 'positive', description: 'Låga energipriser → fler industrier → högre efterfrågan → stordriftsfördelar → lägre priser' },
          { type: 'negative', description: 'Hög stabilitet → lägre incitament för lagringsutveckling → teknologisk lock-in' }
        ],
        timelag: { min: 5, max: 15, unit: 'år', explanation: 'Industriinvesteringar tar 5–10 år att realisera, effekter på BNP syns efter ytterligare 3–5 år' }
      },
      methodology: {
        dataCollection: { method: 'Officiell statistik från nationella energimyndigheter och IEA', frequency: 'Årlig', coverage: 92 },
        statisticalApproach: 'Panelregression med fasta effekter för land och år, kontrollvariabler för utbildning, institutioner och öppenhet',
        validationMethod: 'Out-of-sample prediktion på 10 länder som hölls utanför ursprunglig analys',
        peerReview: { status: 'yes', details: 'Publicerad i Energy Economics (2019) och replikerad av oberoende forskare' },
        replicationAttempts: { total: 4, successful: 3, details: '3/4 replikationer bekräftade huvudresultaten. 1 studie fann svagare effekt i tropiska klimat.' },
        alternativeInterpretations: [
          'Omvänd kausalitet: Rika länder har råd med stabil energi, inte tvärtom',
          'Utelämnad variabel: Institutionell kvalitet driver både energival och tillväxt',
          'Historisk path dependency: Kolländer industrialiserades tidigare av andra skäl'
        ]
      },
      limitations: {
        dataGaps: [
          { gap: 'Saknar granulär data från utvecklingsländer före 1990', impact: 'moderate' },
          { gap: 'Intermittens-data standardiserades först 2010', impact: 'moderate' },
          { gap: 'Systemkostnader ofta underskattas i officiell statistik', impact: 'critical' }
        ],
        methodologicalWeaknesses: [
          'Svårt att isolera energieffekt från andra industrialiseringsfaktorer',
          'Korta tidsserier för förnybar energi (< 20 år i de flesta länder)',
          'Definitioner av "stabil" varierar mellan studier'
        ],
        confoundingFactors: [
          { factor: 'Utbildningsnivå', controlled: true },
          { factor: 'Institutionell kvalitet (Governance Index)', controlled: true },
          { factor: 'Geografiskt läge', controlled: false },
          { factor: 'Historisk industristruktur', controlled: false },
          { factor: 'Handelsöppenhet', controlled: true }
        ],
        geographicLimitations: [
          'Huvudsakligen baserat på OECD-länder',
          'Tropiska länder underrepresenterade',
          'Oljeexporterande länder exkluderade (endogenitet)'
        ],
        temporalLimitations: [
          'Data före 1960 saknar standardiserade definitioner',
          'Energimarknaderna har förändrats radikalt sedan 2000',
          'Framtida teknologier (fusion, avancerad lagring) kan förändra mönstret'
        ],
        expertDissent: [
          { perspective: 'Med moderna smarta nät och lagring kan intermittent energi vara lika stabil', source: 'Jacobson et al., 2017' },
          { perspective: 'Effekten överdrivs av fossilintressenfinansierad forskning', source: 'Greenpeace Energy Report' },
          { perspective: 'Kärnkraft medför dolda kostnader som inte inkluderas', source: 'DIW Berlin, 2019' }
        ]
      },
      rawData: {
        timeSeries: [
          { year: 1960, value: 45, source: 'IEA' },
          { year: 1970, value: 62, source: 'IEA' },
          { year: 1980, value: 78, source: 'IEA' },
          { year: 1990, value: 89, source: 'IEA' },
          { year: 2000, value: 94, source: 'IEA' },
          { year: 2010, value: 91, source: 'IEA' },
          { year: 2020, value: 85, source: 'IEA' }
        ],
        regionalBreakdown: [
          { region: 'Norden', value: 95, trend: 'stable' },
          { region: 'Centraleuropa', value: 78, trend: 'down' },
          { region: 'Nordamerika', value: 88, trend: 'stable' },
          { region: 'Östasien', value: 92, trend: 'up' },
          { region: 'Sydamerika', value: 72, trend: 'down' }
        ],
        sources: [
          { name: 'IEA World Energy Outlook', type: 'institutional', url: 'https://iea.org/weo', lastUpdated: '2024-10', reliability: 95 },
          { name: 'Eurostat Energy Statistics', type: 'official', url: 'https://ec.europa.eu/eurostat/energy', lastUpdated: '2024-09', reliability: 92 },
          { name: 'Energy Economics Journal', type: 'academic', url: 'https://www.journals.elsevier.com/energy-economics', lastUpdated: '2024-08', reliability: 88 }
        ],
        downloadFormats: ['CSV', 'JSON', 'Excel']
      },
      cases: [
        {
          region: 'Sverige',
          period: '1950–1985',
          description: 'Massiv utbyggnad av vattenkraft och kärnkraft gav stabil basproduktion med >90% kapacitetsfaktor',
          impact: 'Industriproduktionen ökade 4.2× medan elanvändningen ökade 6×. Elpriset förblev bland de lägsta i Europa.',
          outcome: 'positive',
          source: 'SCB, Energimyndigheten, Vattenfall historik',
          methodology: 'Jämförelse av industri-index (1950=100) mot energiproduktion med kontroll för befolkningstillväxt',
          dataPoints: [
            { label: 'Industriproduktion (index)', before: 100, after: 420, unit: '1950=100' },
            { label: 'Elpris (realt)', before: 100, after: 85, unit: 'öre/kWh, 2020 års penningvärde' },
            { label: 'Kapacitetsfaktor', before: 45, after: 91, unit: '%' }
          ]
        },
        {
          region: 'Tyskland',
          period: '2000–2023',
          description: 'Energiewende med snabb utbyggnad av sol och vind, avveckling av kärnkraft',
          impact: 'Elpriset fördubblades (2010–2022). Intermittens ökade till 40%. Industriproduktion planade ut.',
          outcome: 'mixed',
          source: 'Destatis, Bundesnetzagentur, BDEW',
          methodology: 'Tidsserieanalys av elpris, CO2-utsläpp och industriproduktion med strukturella brytpunkter',
          dataPoints: [
            { label: 'Hushållselpris', before: 14, after: 32, unit: 'cent/kWh' },
            { label: 'CO2-intensitet el', before: 500, after: 380, unit: 'g/kWh' },
            { label: 'Industriproduktion (index)', before: 100, after: 105, unit: '2010=100' }
          ]
        },
        {
          region: 'Frankrike',
          period: '1974–2000',
          description: 'Messmer-planen: 58 kärnreaktorer byggdes efter oljekrisen 1973',
          impact: 'Energioberoende ökade från 23% till 51%. Elpriset blev Europas lägsta. Kraftig industriexpansion.',
          outcome: 'positive',
          source: 'INSEE, RTE, CEA',
          methodology: 'Difference-in-differences mot jämförbara länder (Italien, Spanien) som valde annan energimix',
          dataPoints: [
            { label: 'Energioberoende', before: 23, after: 51, unit: '%' },
            { label: 'Elpris (relativt EU-snitt)', before: 100, after: 70, unit: 'EU-snitt=100' },
            { label: 'Kärnkraftens andel', before: 8, after: 78, unit: '% av elproduktion' }
          ]
        }
      ],
      relatedIndicators: [
        { code: 'ELEC_PRICE', name: 'Elpris (hushåll)', correlation: -0.72, description: 'Stabil produktion korrelerar med lägre priser' },
        { code: 'GRID_STABILITY', name: 'Nätfrekvensavvikelser', correlation: -0.68, description: 'Färre avbrott med stabil basproduktion' },
        { code: 'IND_OUTPUT', name: 'Industriproduktion', correlation: 0.81, description: 'Stark positiv korrelation observerad' },
        { code: 'ENERGY_INTENSITY', name: 'Energiintensitet BNP', correlation: -0.45, description: 'Svagt samband, många confounders' }
      ]
    }
  };
  
  return evidenceMap[factorId] || createDefaultEvidence(factorId);
};

// Default evidence for factors without full data
const createDefaultEvidence = (_factorId: string): FactorEvidence => ({
  observation: {
    summary: 'Detaljerad evidens för denna faktor samlas in.',
    keyMetric: { value: 0, unit: '', change: 0, period: '' },
    globalPattern: 'Mönster under analys.',
    thisShows: ['Data under insamling'],
    thisDoesNotShow: ['Fullständig analys ej tillgänglig ännu']
  },
  mechanism: {
    causalChain: [{ step: 1, description: 'Analys pågår', confidence: 'low' }],
    primaryDrivers: [],
    feedbackLoops: [],
    timelag: { min: 0, max: 0, unit: 'år', explanation: 'Okänt' }
  },
  methodology: {
    dataCollection: { method: 'Under utveckling', frequency: '', coverage: 0 },
    statisticalApproach: 'Ej definierat',
    validationMethod: 'Ej utförd',
    peerReview: { status: 'no', details: 'Ej granskad' },
    replicationAttempts: { total: 0, successful: 0, details: 'Inga försök' },
    alternativeInterpretations: []
  },
  limitations: {
    dataGaps: [{ gap: 'Fullständig data saknas', impact: 'critical' }],
    methodologicalWeaknesses: ['Metodologi under utveckling'],
    confoundingFactors: [],
    geographicLimitations: ['Ej kartlagt'],
    temporalLimitations: ['Ej kartlagt'],
    expertDissent: []
  },
  rawData: {
    timeSeries: [],
    regionalBreakdown: [],
    sources: [],
    downloadFormats: []
  },
  cases: [],
  relatedIndicators: []
});

// Sub-components
const ConfidenceBadge: React.FC<{ level: 'high' | 'medium' | 'low' }> = ({ level }) => {
  const config = {
    high: { label: 'Hög konfidens', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
    medium: { label: 'Medel konfidens', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
    low: { label: 'Låg konfidens', className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' }
  };
  return <Badge className={config[level].className}>{config[level].label}</Badge>;
};

const ImpactBadge: React.FC<{ impact: 'critical' | 'moderate' | 'minor' }> = ({ impact }) => {
  const config = {
    critical: { label: 'Kritisk', className: 'bg-red-100 text-red-800' },
    moderate: { label: 'Måttlig', className: 'bg-yellow-100 text-yellow-800' },
    minor: { label: 'Mindre', className: 'bg-green-100 text-green-800' }
  };
  return <Badge className={config[impact].className}>{config[impact].label}</Badge>;
};

const SourceReliabilityBar: React.FC<{ reliability: number }> = ({ reliability }) => (
  <div className="flex items-center gap-2">
    <Progress value={reliability} className="h-2 flex-1" />
    <span className="text-xs text-muted-foreground">{reliability}%</span>
  </div>
);

// Case study detail sheet
const CaseStudyDetail: React.FC<{
  caseStudy: FactorEvidence['cases'][0] | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}> = ({ caseStudy, open, onOpenChange }) => {
  if (!caseStudy) return null;
  
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            <SheetTitle>{caseStudy.region}</SheetTitle>
            <Badge variant="outline">{caseStudy.period}</Badge>
          </div>
          <SheetDescription>{caseStudy.description}</SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          {/* Outcome */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                {caseStudy.outcome === 'positive' ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : caseStudy.outcome === 'negative' ? (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                ) : (
                  <Scale className="h-4 w-4 text-yellow-600" />
                )}
                Observerat utfall
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{caseStudy.impact}</p>
            </CardContent>
          </Card>
          
          {/* Data points comparison */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Kvantitativ jämförelse</CardTitle>
              <CardDescription>Före och efter perioden</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {caseStudy.dataPoints.map((dp, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{dp.label}</span>
                      <span className="text-muted-foreground">{dp.unit}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>Före: {dp.before}</span>
                          <span>Efter: {dp.after}</span>
                        </div>
                        <div className="h-3 bg-muted rounded-full overflow-hidden flex">
                          <div 
                            className="h-full bg-muted-foreground/30" 
                            style={{ width: `${(dp.before / Math.max(dp.before, dp.after)) * 100}%` }} 
                          />
                        </div>
                        <div className="h-3 bg-primary/20 rounded-full overflow-hidden flex mt-1">
                          <div 
                            className="h-full bg-primary" 
                            style={{ width: `${(dp.after / Math.max(dp.before, dp.after)) * 100}%` }} 
                          />
                        </div>
                      </div>
                      <div className={`text-sm font-medium ${dp.after > dp.before ? 'text-green-600' : 'text-red-600'}`}>
                        {dp.after > dp.before ? '+' : ''}{Math.round((dp.after - dp.before) / dp.before * 100)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Methodology */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Microscope className="h-4 w-4" />
                Metodologi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{caseStudy.methodology}</p>
            </CardContent>
          </Card>
          
          {/* Source */}
          <Card className="bg-muted/30">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-sm">
                <BookOpen className="h-4 w-4" />
                <span className="font-medium">Källa:</span>
                <span className="text-muted-foreground">{caseStudy.source}</span>
                <ExternalLink className="h-3 w-3 ml-auto cursor-pointer hover:text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export const FactorDeepDive: React.FC<FactorDeepDiveProps> = ({ 
  factor, 
  open, 
  onOpenChange 
}) => {
  const [selectedCase, setSelectedCase] = useState<FactorEvidence['cases'][0] | null>(null);
  const [activeLevel, setActiveLevel] = useState<'L1' | 'L2' | 'L3' | 'L4' | 'L5'>('L1');
  
  if (!factor) return null;
  
  const evidence = getFactorEvidence(factor.id);
  if (!evidence) return null;
  
  const levels = [
    { id: 'L1', label: 'Observation', icon: BarChart3, description: 'Vad ser vi?' },
    { id: 'L2', label: 'Mekanism', icon: Zap, description: 'Hur fungerar det?' },
    { id: 'L3', label: 'Metod', icon: Microscope, description: 'Hur vet vi?' },
    { id: 'L4', label: 'Begränsningar', icon: AlertTriangle, description: 'Vad visar detta INTE?' },
    { id: 'L5', label: 'Rådata', icon: Database, description: 'Underliggande siffror' }
  ];
  
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-5xl max-h-[90vh] p-0">
          <div className="flex h-full">
            {/* Level navigation sidebar */}
            <div className="w-48 border-r bg-muted/30 p-4 flex-shrink-0">
              <div className="space-y-1">
                {levels.map((level) => {
                  const Icon = level.icon;
                  const isActive = activeLevel === level.id;
                  return (
                    <button
                      key={level.id}
                      onClick={() => setActiveLevel(level.id as any)}
                      className={`w-full text-left p-3 rounded-lg transition-all ${
                        isActive 
                          ? 'bg-primary text-primary-foreground' 
                          : 'hover:bg-muted'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <span className="text-sm font-medium">{level.label}</span>
                      </div>
                      <p className={`text-xs mt-1 ${isActive ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                        {level.description}
                      </p>
                    </button>
                  );
                })}
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                  <Download className="h-3 w-3 mr-2" />
                  Exportera
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                  <Share2 className="h-3 w-3 mr-2" />
                  Dela
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                  <Bookmark className="h-3 w-3 mr-2" />
                  Spara
                </Button>
              </div>
            </div>
            
            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0">
              <DialogHeader className="p-6 pb-4 border-b">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    factor.impact === 'high' ? 'bg-green-500' : 'bg-yellow-500'
                  }`} />
                  <DialogTitle className="text-xl">{factor.labelSv}</DialogTitle>
                  <Badge variant="outline">{factor.timeframeSv}</Badge>
                </div>
                <DialogDescription className="mt-2">
                  {factor.descriptionSv}
                </DialogDescription>
              </DialogHeader>
              
              <ScrollArea className="flex-1 p-6">
                {/* L1: Observation */}
                {activeLevel === 'L1' && (
                  <div className="space-y-6">
                    {/* Key metric */}
                    <Card className="bg-primary/5 border-primary/20">
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-4xl font-bold text-primary">
                            {evidence.observation.keyMetric.value}{evidence.observation.keyMetric.unit}
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">
                            {evidence.observation.keyMetric.period}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Summary */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Sammanfattning</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm leading-relaxed">{evidence.observation.summary}</p>
                        <p className="text-sm text-muted-foreground mt-4 italic">
                          {evidence.observation.globalPattern}
                        </p>
                      </CardContent>
                    </Card>
                    
                    {/* This shows / does not show */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <Card className="border-green-200 dark:border-green-900">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm flex items-center gap-2 text-green-700 dark:text-green-400">
                            <CheckCircle2 className="h-4 w-4" />
                            Detta visar
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {evidence.observation.thisShows.map((item, idx) => (
                              <li key={idx} className="text-sm flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                      
                      <Card className="border-red-200 dark:border-red-900">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm flex items-center gap-2 text-red-700 dark:text-red-400">
                            <XCircle className="h-4 w-4" />
                            Detta visar INTE
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {evidence.observation.thisDoesNotShow.map((item, idx) => (
                              <li key={idx} className="text-sm flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                    
                    {/* Historical cases */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm flex items-center gap-2">
                          <History className="h-4 w-4" />
                          Historiska fallstudier
                        </CardTitle>
                        <CardDescription>Klicka för full fördjupning</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {evidence.cases.map((caseStudy, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedCase(caseStudy)}
                            className="w-full p-4 border rounded-lg hover:bg-muted/30 hover:border-primary/50 transition-all text-left group"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Globe className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">{caseStudy.region}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">{caseStudy.period}</Badge>
                                {caseStudy.outcome === 'positive' && <TrendingUp className="h-4 w-4 text-green-600" />}
                                {caseStudy.outcome === 'negative' && <TrendingDown className="h-4 w-4 text-red-600" />}
                                {caseStudy.outcome === 'mixed' && <Scale className="h-4 w-4 text-yellow-600" />}
                                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">{caseStudy.description}</p>
                          </button>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                )}
                
                {/* L2: Mechanism */}
                {activeLevel === 'L2' && (
                  <div className="space-y-6">
                    {/* Causal chain */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Link2 className="h-4 w-4" />
                          Kausalkedja (hypotetisk)
                        </CardTitle>
                        <CardDescription>Varje steg har osäkerhet – detta är en modell, inte bevisad sanning</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {evidence.mechanism.causalChain.map((step, idx) => (
                            <div key={idx} className="flex items-start gap-4">
                              <div className="flex flex-col items-center">
                                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                                  {step.step}
                                </div>
                                {idx < evidence.mechanism.causalChain.length - 1 && (
                                  <div className="w-0.5 h-8 bg-border mt-2" />
                                )}
                              </div>
                              <div className="flex-1 pt-1">
                                <p className="text-sm">{step.description}</p>
                                <div className="mt-2">
                                  <ConfidenceBadge level={step.confidence} />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Primary drivers */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Primära drivkrafter</CardTitle>
                        <CardDescription>Relativ betydelse enligt modellen</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {evidence.mechanism.primaryDrivers.map((driver, idx) => (
                          <div key={idx}>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium">{driver.name}</span>
                              <span className="text-sm text-muted-foreground">{driver.contribution}%</span>
                            </div>
                            <Progress value={driver.contribution} className="h-2" />
                            <p className="text-xs text-muted-foreground mt-1">{driver.description}</p>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                    
                    {/* Feedback loops */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Återkopplingsslingor</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {evidence.mechanism.feedbackLoops.map((loop, idx) => (
                          <div key={idx} className={`p-3 rounded-lg border-l-4 ${
                            loop.type === 'positive' ? 'border-l-green-500 bg-green-50 dark:bg-green-950/30' : 'border-l-red-500 bg-red-50 dark:bg-red-950/30'
                          }`}>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="text-xs">
                                {loop.type === 'positive' ? '+ Förstärkande' : '− Dämpande'}
                              </Badge>
                            </div>
                            <p className="text-sm">{loop.description}</p>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                    
                    {/* Time lag */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Tidsfördröjning
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-4 mb-4">
                          <Badge variant="outline" className="text-lg px-4 py-2">
                            {evidence.mechanism.timelag.min}–{evidence.mechanism.timelag.max} {evidence.mechanism.timelag.unit}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{evidence.mechanism.timelag.explanation}</p>
                      </CardContent>
                    </Card>
                  </div>
                )}
                
                {/* L3: Methodology */}
                {activeLevel === 'L3' && (
                  <div className="space-y-6">
                    <Alert>
                      <Microscope className="h-4 w-4" />
                      <AlertTitle>Metodtransparens</AlertTitle>
                      <AlertDescription>
                        Alla analyser ska kunna granskas och ifrågasättas. Här visar vi exakt hur slutsatserna är framtagna.
                      </AlertDescription>
                    </Alert>
                    
                    {/* Data collection */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Datainsamling</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <span className="text-xs text-muted-foreground">Metod</span>
                            <p className="text-sm font-medium">{evidence.methodology.dataCollection.method}</p>
                          </div>
                          <div>
                            <span className="text-xs text-muted-foreground">Frekvens</span>
                            <p className="text-sm font-medium">{evidence.methodology.dataCollection.frequency}</p>
                          </div>
                          <div>
                            <span className="text-xs text-muted-foreground">Geografisk täckning</span>
                            <p className="text-sm font-medium">{evidence.methodology.dataCollection.coverage}%</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Statistical approach */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Statistisk metod</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">{evidence.methodology.statisticalApproach}</p>
                      </CardContent>
                    </Card>
                    
                    {/* Validation */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Validering</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <span className="text-xs text-muted-foreground">Valideringsmetod</span>
                          <p className="text-sm">{evidence.methodology.validationMethod}</p>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Peer review</span>
                          <Badge variant={evidence.methodology.peerReview.status === 'yes' ? 'default' : 'secondary'}>
                            {evidence.methodology.peerReview.status === 'yes' ? 'Ja' : evidence.methodology.peerReview.status === 'partial' ? 'Delvis' : 'Nej'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{evidence.methodology.peerReview.details}</p>
                      </CardContent>
                    </Card>
                    
                    {/* Replication */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Replikeringsförsök</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-4 mb-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">{evidence.methodology.replicationAttempts.successful}</div>
                            <div className="text-xs text-muted-foreground">Lyckade</div>
                          </div>
                          <div className="text-muted-foreground">/</div>
                          <div className="text-center">
                            <div className="text-2xl font-bold">{evidence.methodology.replicationAttempts.total}</div>
                            <div className="text-xs text-muted-foreground">Totalt</div>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{evidence.methodology.replicationAttempts.details}</p>
                      </CardContent>
                    </Card>
                    
                    {/* Alternative interpretations */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm flex items-center gap-2">
                          <HelpCircle className="h-4 w-4" />
                          Alternativa tolkningar
                        </CardTitle>
                        <CardDescription>Andra sätt att förklara samma data</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Accordion type="single" collapsible>
                          {evidence.methodology.alternativeInterpretations.map((alt, idx) => (
                            <AccordionItem key={idx} value={`alt-${idx}`}>
                              <AccordionTrigger className="text-sm">{alt.split(':')[0]}</AccordionTrigger>
                              <AccordionContent className="text-sm text-muted-foreground">
                                {alt}
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </CardContent>
                    </Card>
                  </div>
                )}
                
                {/* L4: Limitations */}
                {activeLevel === 'L4' && (
                  <div className="space-y-6">
                    <Alert variant="destructive" className="bg-destructive/10 border-destructive/30">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Obligatorisk begränsningsvy</AlertTitle>
                      <AlertDescription>
                        Ingen analys är komplett utan att förstå dess begränsningar. Läs detta innan du drar slutsatser.
                      </AlertDescription>
                    </Alert>
                    
                    {/* Data gaps */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Dataluckor</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {evidence.limitations.dataGaps.map((gap, idx) => (
                          <div key={idx} className="flex items-start justify-between p-3 border rounded-lg">
                            <span className="text-sm flex-1">{gap.gap}</span>
                            <ImpactBadge impact={gap.impact} />
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                    
                    {/* Methodological weaknesses */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Metodologiska svagheter</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {evidence.limitations.methodologicalWeaknesses.map((weakness, idx) => (
                            <li key={idx} className="text-sm flex items-start gap-2">
                              <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 shrink-0" />
                              <span>{weakness}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                    
                    {/* Confounding factors */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Confounders (störfaktorer)</CardTitle>
                        <CardDescription>Variabler som kan påverka resultaten</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {evidence.limitations.confoundingFactors.map((cf, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2 border rounded">
                              <span className="text-sm">{cf.factor}</span>
                              <Badge variant={cf.controlled ? 'default' : 'destructive'}>
                                {cf.controlled ? 'Kontrollerad' : 'Ej kontrollerad'}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Expert dissent */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Experter som inte håller med</CardTitle>
                        <CardDescription>Vetenskaplig debatt och motstående perspektiv</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {evidence.limitations.expertDissent.map((dissent, idx) => (
                          <div key={idx} className="p-3 border rounded-lg bg-muted/30">
                            <p className="text-sm italic">"{dissent.perspective}"</p>
                            <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                              <BookOpen className="h-3 w-3" />
                              <span>{dissent.source}</span>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                )}
                
                {/* L5: Raw Data */}
                {activeLevel === 'L5' && (
                  <div className="space-y-6">
                    {/* Time series chart */}
                    {evidence.rawData.timeSeries.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Tidsserie</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={evidence.rawData.timeSeries}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip />
                                <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.2)" />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                    
                    {/* Regional breakdown */}
                    {evidence.rawData.regionalBreakdown.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Regional fördelning</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={evidence.rawData.regionalBreakdown} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" tick={{ fontSize: 12 }} />
                                <YAxis dataKey="region" type="category" tick={{ fontSize: 12 }} width={100} />
                                <Tooltip />
                                <Bar dataKey="value" fill="hsl(var(--primary))" />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                    
                    {/* Sources */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Datakällor</CardTitle>
                        <CardDescription>Ursprung och tillförlitlighet</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {evidence.rawData.sources.map((source, idx) => (
                          <div key={idx} className="p-3 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                <span className="font-medium text-sm">{source.name}</span>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {source.type === 'official' ? 'Officiell' : source.type === 'academic' ? 'Akademisk' : 'Institutionell'}
                              </Badge>
                            </div>
                            <div className="space-y-2">
                              <SourceReliabilityBar reliability={source.reliability} />
                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span>Senast uppdaterad: {source.lastUpdated}</span>
                                <a href={source.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary">
                                  <ExternalLink className="h-3 w-3" />
                                  Öppna källa
                                </a>
                              </div>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                    
                    {/* Download options */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Ladda ner rådata</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-2">
                          {evidence.rawData.downloadFormats.map((format, idx) => (
                            <Button key={idx} variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-2" />
                              {format}
                            </Button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Related indicators */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Relaterade indikatorer</CardTitle>
                        <CardDescription>Korrelationer (ej kausalitet)</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {evidence.relatedIndicators.map((indicator, idx) => (
                          <button key={idx} className="w-full p-3 border rounded-lg hover:bg-muted/30 hover:border-primary/50 transition-all text-left">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-mono text-xs text-muted-foreground">{indicator.code}</span>
                              <Badge variant={indicator.correlation > 0 ? 'default' : 'destructive'}>
                                r = {indicator.correlation > 0 ? '+' : ''}{indicator.correlation.toFixed(2)}
                              </Badge>
                            </div>
                            <div className="font-medium text-sm">{indicator.name}</div>
                            <p className="text-xs text-muted-foreground mt-1">{indicator.description}</p>
                          </button>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Case study detail sheet */}
      <CaseStudyDetail 
        caseStudy={selectedCase} 
        open={selectedCase !== null} 
        onOpenChange={(open) => !open && setSelectedCase(null)} 
      />
    </>
  );
};
