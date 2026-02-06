/**
 * INTERGENERATIONAL FAIRNESS ENGINE (IFE)
 * 
 * "Vem får nyttan – och vem betalar, över generationer?"
 * 
 * SPOTLESS UI: Allt är klickbart för fördjupning
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { StructuralPositionAlert, DecisionCorrelationAlert } from '@/components/ui/ExpandableInfoAlert';
import {
  Clock,
  Users,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  Info,
  Scale,
  Baby,
  Globe,
  Calendar,
  ChevronRight,
  ExternalLink,
  Database,
  FileText,
  BarChart3
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  AreaChart, Area
} from 'recharts';
import {
  IFE_CORE_QUESTION,
  IFE_WARNING,
  DEBT_CATEGORIES,
  COHORT_DATA,
  BENEFIT_COST_EXAMPLES,
  TIME_RESPONSIBILITY,
  GLOBAL_FAIRNESS_DATA,
  KEY_MESSAGES,
  SWEDEN_MANDATE_PERIODS,
  type DebtCategory
} from '@/config/intergenerationalFairnessConfig';

// Trend icon helper
const TrendIcon: React.FC<{ trend: string; size?: number }> = ({ trend, size = 16 }) => {
  if (trend === 'improving') return <TrendingUp size={size} className="text-green-500" />;
  if (trend === 'worsening') return <TrendingDown size={size} className="text-red-500" />;
  return <Minus size={size} className="text-muted-foreground" />;
};

// Debt level badge
const DebtLevelBadge: React.FC<{ level: string }> = ({ level }) => {
  const config = {
    low: { color: 'bg-green-500', label: '🟢 Låg' },
    moderate: { color: 'bg-yellow-500', label: '🟡 Måttlig' },
    high: { color: 'bg-red-500', label: '🔴 Hög' },
    unsustainable: { color: 'bg-black', label: '⚫ Ohållbar' },
    critical: { color: 'bg-red-700', label: '🔴 Kritisk' }
  };
  const c = config[level as keyof typeof config] || config.moderate;
  return <Badge variant="outline" className="text-xs">{c.label}</Badge>;
};

// Component detail data for drill-down
const COMPONENT_DETAILS: Record<string, {
  title: string;
  definition: string;
  currentValue: string;
  trend: string;
  source: string;
  methodology: string;
  historicalData: { year: number; value: number }[];
}> = {
  state_debt: {
    title: 'Statsskuld per capita',
    definition: 'Den totala statsskulden dividerad med befolkningen. Mäter hur mycket skuld varje medborgare teoretiskt "bär".',
    currentValue: '142 000 kr',
    trend: '+3.2% senaste året',
    source: 'Riksgälden, SCB',
    methodology: 'Nominell skuld / befolkning vid årets slut',
    historicalData: [
      { year: 2015, value: 98000 }, { year: 2017, value: 105000 },
      { year: 2019, value: 112000 }, { year: 2021, value: 128000 },
      { year: 2023, value: 138000 }, { year: 2024, value: 142000 }
    ]
  },
  implicit_debt: {
    title: 'Implicit skuld (pensioner, åtaganden)',
    definition: 'Framtida åtaganden som inte syns i statsbudgeten men som staten är förpliktigad att betala.',
    currentValue: '~2.8 biljoner kr',
    trend: 'Ökande med åldrande befolkning',
    source: 'ESV, Pensionsmyndigheten',
    methodology: 'Nuvärde av framtida pensionsåtaganden + vårdkostnader',
    historicalData: [
      { year: 2015, value: 2100 }, { year: 2017, value: 2250 },
      { year: 2019, value: 2400 }, { year: 2021, value: 2550 },
      { year: 2023, value: 2700 }, { year: 2024, value: 2800 }
    ]
  },
  municipal_debt: {
    title: 'Kommunal skuld',
    definition: 'Kommunernas och regionernas samlade skuldsättning.',
    currentValue: '785 mdr kr',
    trend: '+5.1% senaste året',
    source: 'SKR, SCB',
    methodology: 'Aggregerad kommunal upplåning',
    historicalData: [
      { year: 2015, value: 520 }, { year: 2017, value: 580 },
      { year: 2019, value: 650 }, { year: 2021, value: 710 },
      { year: 2023, value: 750 }, { year: 2024, value: 785 }
    ]
  },
  guarantees: {
    title: 'Garantier & framtida åtaganden',
    definition: 'Statliga garantier och borgensåtaganden som kan bli verkliga kostnader.',
    currentValue: '~1.2 biljoner kr',
    trend: 'Stabilt',
    source: 'Riksgälden',
    methodology: 'Nominellt värde av utställda garantier',
    historicalData: [
      { year: 2015, value: 900 }, { year: 2017, value: 980 },
      { year: 2019, value: 1050 }, { year: 2021, value: 1120 },
      { year: 2023, value: 1180 }, { year: 2024, value: 1200 }
    ]
  },
  maintenance: {
    title: 'Underhållsunderskott',
    definition: 'Eftersatt underhåll av offentlig infrastruktur som ackumuleras som framtida kostnad.',
    currentValue: '~300 mdr kr',
    trend: 'Ökande',
    source: 'Trafikverket, SKR',
    methodology: 'Beräknat gap mellan optimalt och faktiskt underhåll',
    historicalData: [
      { year: 2015, value: 180 }, { year: 2017, value: 210 },
      { year: 2019, value: 240 }, { year: 2021, value: 270 },
      { year: 2023, value: 290 }, { year: 2024, value: 300 }
    ]
  },
  deferred: {
    title: 'Eftersatt infrastruktur',
    definition: 'Infrastrukturprojekt som skjutits upp eller inte genomförts trots identifierat behov.',
    currentValue: '150+ projekt',
    trend: 'Ökande kö',
    source: 'Trafikverket, Energimyndigheten',
    methodology: 'Antal och värde av uppskjutna projekt',
    historicalData: [
      { year: 2015, value: 80 }, { year: 2017, value: 95 },
      { year: 2019, value: 110 }, { year: 2021, value: 130 },
      { year: 2023, value: 145 }, { year: 2024, value: 150 }
    ]
  },
  investment_gap: {
    title: 'Investeringsgap',
    definition: 'Skillnaden mellan vad som behöver investeras och vad som faktiskt investeras.',
    currentValue: '~80 mdr kr/år',
    trend: 'Stabilt gap',
    source: 'Konjunkturinstitutet, SNS',
    methodology: 'Behovsanalys minus faktiska investeringar',
    historicalData: [
      { year: 2015, value: 50 }, { year: 2017, value: 55 },
      { year: 2019, value: 65 }, { year: 2021, value: 75 },
      { year: 2023, value: 78 }, { year: 2024, value: 80 }
    ]
  },
  resource_depletion: {
    title: 'Resursutarmning',
    definition: 'Användning av naturresurser i takt som överstiger naturlig förnyelse.',
    currentValue: '3.8 jordklot/år',
    trend: 'Långsamt minskande',
    source: 'Global Footprint Network',
    methodology: 'Ekologiskt fotavtryck / biokapacitet',
    historicalData: [
      { year: 2015, value: 4.2 }, { year: 2017, value: 4.1 },
      { year: 2019, value: 4.0 }, { year: 2021, value: 3.9 },
      { year: 2023, value: 3.85 }, { year: 2024, value: 3.8 }
    ]
  },
  restoration: {
    title: 'Miljöåterställningsbehov',
    definition: 'Uppskattad kostnad för att återställa degraderade ekosystem och miljöer.',
    currentValue: '~200 mdr kr',
    trend: 'Ökande',
    source: 'Naturvårdsverket, EU',
    methodology: 'Sammanställning av restaureringskostnader',
    historicalData: [
      { year: 2015, value: 120 }, { year: 2017, value: 140 },
      { year: 2019, value: 160 }, { year: 2021, value: 175 },
      { year: 2023, value: 190 }, { year: 2024, value: 200 }
    ]
  },
  long_term: {
    title: 'Långsiktiga belastningar',
    definition: 'Framtida miljökostnader från nuvarande aktiviteter (klimat, föroreningar).',
    currentValue: 'Ej kvantifierbart',
    trend: 'Ackumulerande',
    source: 'SMHI, Naturvårdsverket',
    methodology: 'Scenariobaserade uppskattningar',
    historicalData: []
  },
  capacity: {
    title: 'Minskad kapacitet',
    definition: 'Reducerad förmåga hos offentliga institutioner att leverera tjänster.',
    currentValue: 'Index: 72/100',
    trend: 'Sjunkande',
    source: 'ESV, Statskontoret',
    methodology: 'Sammansatt index av leveransförmåga',
    historicalData: [
      { year: 2015, value: 85 }, { year: 2017, value: 82 },
      { year: 2019, value: 79 }, { year: 2021, value: 76 },
      { year: 2023, value: 74 }, { year: 2024, value: 72 }
    ]
  },
  competence: {
    title: 'Kompetensförlust',
    definition: 'Förlust av kritisk kompetens inom offentlig sektor genom pensionsavgångar och låg attraktivitet.',
    currentValue: '~25% gap',
    trend: 'Accelererande',
    source: 'Arbetsförmedlingen, SKR',
    methodology: 'Rekryteringsbehov vs tillgänglig kompetens',
    historicalData: [
      { year: 2015, value: 12 }, { year: 2017, value: 15 },
      { year: 2019, value: 18 }, { year: 2021, value: 21 },
      { year: 2023, value: 23 }, { year: 2024, value: 25 }
    ]
  },
  trust: {
    title: 'Förtroendenedbrytning',
    definition: 'Minskande förtroende för samhällsinstitutioner över tid.',
    currentValue: 'Index: 58/100',
    trend: 'Långsamt sjunkande',
    source: 'SOM-institutet',
    methodology: 'Årliga förtroendemätningar',
    historicalData: [
      { year: 2015, value: 68 }, { year: 2017, value: 65 },
      { year: 2019, value: 63 }, { year: 2021, value: 61 },
      { year: 2023, value: 59 }, { year: 2024, value: 58 }
    ]
  }
};

// Category detail data
const CATEGORY_DETAILS: Record<string, {
  fullDescription: string;
  keyIndicators: string[];
  policyImplications: string[];
  internationalComparison: string;
}> = {
  financial: {
    fullDescription: 'Finansiell skuld inkluderar alla explicita och implicita ekonomiska åtaganden som nuvarande generationer skapar och som framtida generationer måste hantera. Detta omfattar statsskuld, pensionsåtaganden, kommunal skuld och garantier.',
    keyIndicators: ['Skuld/BNP-kvot', 'Implicit pensionsskuld', 'Kommunal skuld per capita'],
    policyImplications: ['Budgetdisciplin behövs', 'Pensionssystemets hållbarhet', 'Generationskontrakt'],
    internationalComparison: 'Sverige: 33% av BNP. EU-snitt: 84%. Japan: 264%.'
  },
  infrastructural: {
    fullDescription: 'Infrastrukturell skuld uppstår när underhåll och nyinvesteringar skjuts upp. Kostnaderna försvinner inte – de ackumuleras och växer med tiden. En krona i uppskjutet underhåll blir ofta 3-5 kronor i framtida reparationskostnader.',
    keyIndicators: ['Underhållsunderskott', 'Investeringsgap', 'Antal uppskjutna projekt'],
    policyImplications: ['Långsiktig infrastrukturplanering', 'Skuldfinansering av investeringar', 'Livscykelkostnadsanalys'],
    internationalComparison: 'Sverige investerar ~3% av BNP. Behov: ~4.5%. Schweiz: 5%.'
  },
  ecological: {
    fullDescription: 'Ekologisk skuld representerar uttaget av naturresurser och miljöförstöring som framtida generationer måste hantera. Detta inkluderar klimatförändringar, artutrotning, markförstöring och vattenföroreningar.',
    keyIndicators: ['Ekologiskt fotavtryck', 'Koldioxidskuld', 'Biodiversitetsförlust'],
    policyImplications: ['Klimatinvesteringar', 'Cirkulär ekonomi', 'Naturrestaurering'],
    internationalComparison: 'Sverige: 3.8 jordklot. Globalt snitt: 1.7. Mål: 1.0.'
  },
  institutional: {
    fullDescription: 'Institutionell erosion är den mest förbisedda skulden. När institutioner tappar kompetens, kapacitet och förtroende tar det generationer att återbygga. Detta påverkar statens förmåga att hantera framtida kriser.',
    keyIndicators: ['Institutionsförtroende', 'Kompetensförsörjning', 'Leveranskapacitet'],
    policyImplications: ['Långsiktig kompetensplanering', 'Institutionellt underhåll', 'Transparent styrning'],
    internationalComparison: 'Sverige: Topp 10 globalt. Men fallande trend senaste 15 åren.'
  }
};

// Component drill-down dialog
interface ComponentDialogProps {
  componentId: string | null;
  onClose: () => void;
}

const ComponentDrillDownDialog: React.FC<ComponentDialogProps> = ({ componentId, onClose }) => {
  const details = componentId ? COMPONENT_DETAILS[componentId] : null;
  
  if (!details) return null;
  
  return (
    <Dialog open={!!componentId} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            {details.title}
          </DialogTitle>
          <DialogDescription>Fördjupad analys och metodik</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Definition */}
          <div className="p-3 bg-muted/50 rounded-lg">
            <h4 className="text-sm font-medium mb-1 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Definition
            </h4>
            <p className="text-sm text-muted-foreground">{details.definition}</p>
          </div>
          
          {/* Current value */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 border rounded-lg">
              <p className="text-xs text-muted-foreground">Nuvarande värde</p>
              <p className="text-xl font-bold">{details.currentValue}</p>
            </div>
            <div className="p-3 border rounded-lg">
              <p className="text-xs text-muted-foreground">Trend</p>
              <p className="text-sm font-medium">{details.trend}</p>
            </div>
          </div>
          
          {/* Historical chart */}
          {details.historicalData.length > 0 && (
            <div className="p-3 border rounded-lg">
              <h4 className="text-sm font-medium mb-2">Historisk utveckling</h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={details.historicalData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))', 
                        border: '1px solid hsl(var(--border))' 
                      }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
          
          {/* Methodology */}
          <div className="p-3 border rounded-lg">
            <h4 className="text-sm font-medium mb-1 flex items-center gap-2">
              <Database className="h-4 w-4" />
              Metodik
            </h4>
            <p className="text-sm text-muted-foreground">{details.methodology}</p>
          </div>
          
          {/* Source */}
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <div>
              <p className="text-xs text-muted-foreground">Källa</p>
              <p className="text-sm font-medium">{details.source}</p>
            </div>
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Category drill-down dialog
interface CategoryDialogProps {
  category: DebtCategory | null;
  onClose: () => void;
  onComponentClick: (componentId: string) => void;
}

const CategoryDrillDownDialog: React.FC<CategoryDialogProps> = ({ category, onClose, onComponentClick }) => {
  const details = category ? CATEGORY_DETAILS[category.id] : null;
  
  if (!category || !details) return null;
  
  return (
    <Dialog open={!!category} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">{category.icon}</span>
            {category.labelSv}
          </DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            <DebtLevelBadge level={category.currentLevel} />
            <TrendIcon trend={category.trendDirection} />
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Full description */}
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-sm">{details.fullDescription}</p>
          </div>
          
          {/* Components - clickable for further drill-down */}
          <div>
            <h4 className="text-sm font-medium mb-2">Komponenter (klicka för fördjupning)</h4>
            <div className="space-y-2">
              {category.components.map(comp => (
                <button
                  key={comp.id}
                  onClick={() => {
                    onClose();
                    onComponentClick(comp.id);
                  }}
                  className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors text-left"
                >
                  <span className="text-sm font-medium">{comp.labelSv}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>
          
          {/* Key indicators */}
          <div className="p-3 border rounded-lg">
            <h4 className="text-sm font-medium mb-2">Nyckelindikatorer</h4>
            <div className="flex flex-wrap gap-2">
              {details.keyIndicators.map((ind, i) => (
                <Badge key={i} variant="secondary">{ind}</Badge>
              ))}
            </div>
          </div>
          
          {/* Policy implications */}
          <div className="p-3 border rounded-lg">
            <h4 className="text-sm font-medium mb-2">Policyimplikationer</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              {details.policyImplications.map((impl, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  {impl}
                </li>
              ))}
            </ul>
          </div>
          
          {/* International comparison */}
          <div className="p-3 bg-primary/5 rounded-lg">
            <h4 className="text-sm font-medium mb-1 flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Internationell jämförelse
            </h4>
            <p className="text-sm text-muted-foreground">{details.internationalComparison}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Debt categories panel with clickable elements
const DebtCategoriesPanel: React.FC<{
  onCategoryClick: (cat: DebtCategory) => void;
  onComponentClick: (componentId: string) => void;
}> = ({ onCategoryClick, onComponentClick }) => (
  <div className="grid gap-4 md:grid-cols-2">
    {DEBT_CATEGORIES.map(cat => (
      <Card 
        key={cat.id} 
        className={`cursor-pointer hover:shadow-md transition-all ${
          cat.currentLevel === 'critical' || cat.currentLevel === 'high' 
            ? 'border-red-200 bg-red-50/30 dark:bg-red-950/20' 
            : ''
        }`}
        onClick={() => onCategoryClick(cat)}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">{cat.icon}</span>
              <CardTitle className="text-sm hover:text-primary transition-colors">
                {cat.labelSv}
              </CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <DebtLevelBadge level={cat.currentLevel} />
              <TrendIcon trend={cat.trendDirection} size={14} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground mb-3">{cat.descriptionSv}</p>
          <div className="flex flex-wrap gap-1">
            {cat.components.map(c => (
              <Badge 
                key={c.id} 
                variant="secondary" 
                className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onComponentClick(c.id);
                }}
              >
                {c.labelSv}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

// Cohort selector and view
const CohortViewPanel: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState('1990');
  const cohort = COHORT_DATA.find(c => c.birthYear.toString() === selectedYear) || COHORT_DATA[3];

  const radarData = [
    { axis: 'Energitillgång', value: cohort.energyAccess },
    { axis: 'Bostadsmarknad', value: cohort.housingAffordability },
    { axis: 'Arbetsmarknad', value: cohort.laborMarketAccess },
    { axis: 'Framtidsutsikter', value: cohort.futureOutlook }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Baby className="h-5 w-5" />
          <CardTitle className="text-base">Generationskohort-vy</CardTitle>
        </div>
        <CardDescription>Strukturell startposition vid födelse</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">Födelseår:</span>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {COHORT_DATA.map(c => (
                <SelectItem key={c.birthYear} value={c.birthYear.toString()}>
                  {c.birthYear}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Badge variant="outline">{cohort.labelSv}</Badge>
        </div>

        <StructuralPositionAlert statement={KEY_MESSAGES.structuralPosition.sv} />

        <div className="grid gap-4 lg:grid-cols-2">
          {/* Stats */}
          <div className="space-y-3">
            <div className="p-3 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Skuld vid födsel</span>
                <DebtLevelBadge level={cohort.bornWithDebtLevel} />
              </div>
              <p className="text-2xl font-bold">{cohort.debtAtBirth.toLocaleString()} kr</p>
              <p className="text-xs text-muted-foreground">per capita</p>
            </div>

            <div className="p-3 border rounded-lg">
              <span className="text-sm font-medium">Strukturell belastning</span>
              <p className="text-sm text-muted-foreground mt-1">{cohort.structuralBurdenSv}</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 border rounded text-center">
                <p className="text-lg font-bold">{cohort.energyAccess}</p>
                <p className="text-xs text-muted-foreground">Energitillgång</p>
              </div>
              <div className="p-2 border rounded text-center">
                <p className="text-lg font-bold">{cohort.housingAffordability}</p>
                <p className="text-xs text-muted-foreground">Bostadsmarknad</p>
              </div>
              <div className="p-2 border rounded text-center">
                <p className="text-lg font-bold">{cohort.laborMarketAccess}</p>
                <p className="text-xs text-muted-foreground">Arbetsmarknad</p>
              </div>
              <div className="p-2 border rounded text-center">
                <p className="text-lg font-bold">{cohort.futureOutlook}</p>
                <p className="text-xs text-muted-foreground">Framtidsutsikter</p>
              </div>
            </div>
          </div>

          {/* Radar */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="axis" tick={{ fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar
                  name="Index"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Historical debt timeline
const DebtTimelinePanel: React.FC = () => {
  const chartData = COHORT_DATA.map(c => ({
    year: c.birthYear,
    debt: c.debtAtBirth / 1000,
    housing: c.housingAffordability,
    outlook: c.futureOutlook
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Skuld vid födsel över tid</CardTitle>
        <CardDescription>Tusen kronor per capita</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))'
                }}
                formatter={(value: number) => [`${value}k kr`, 'Skuld']}
              />
              <Line
                type="monotone"
                dataKey="debt"
                stroke="hsl(var(--destructive))"
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--destructive))' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

// Benefit vs Cost examples
const BenefitCostPanel: React.FC = () => (
  <Card>
    <CardHeader>
      <div className="flex items-center gap-2">
        <Scale className="h-5 w-5" />
        <CardTitle className="text-base">Nytta vs kostnad över tid</CardTitle>
      </div>
      <CardDescription>Vem fick nyttan – vem betalar kostnaden</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      {BENEFIT_COST_EXAMPLES.map(ex => (
        <div key={ex.id} className="p-4 border rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="font-medium">{ex.decisionSv}</span>
            <Badge variant="outline">{ex.year}</Badge>
          </div>
          
          <div className="grid gap-3 md:grid-cols-2">
            <div className="p-2 bg-green-50 dark:bg-green-950/30 rounded">
              <p className="text-xs font-medium text-green-700 dark:text-green-400 mb-1">
                Omedelbar nytta
              </p>
              <p className="text-sm">{ex.immediateBenefitSv}</p>
            </div>
            
            <div className="p-2 bg-red-50 dark:bg-red-950/30 rounded">
              <p className="text-xs font-medium text-red-700 dark:text-red-400 mb-1">
                Långsiktig kostnad
              </p>
              <p className="text-sm">{ex.longTermCostSv}</p>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>Tidsförskjutning: {ex.timeShift} år</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>Kostnadsbärare: {ex.costBearersSv}</span>
            </div>
          </div>
        </div>
      ))}

      <Alert className="bg-primary/5">
        <Info className="h-4 w-4" />
        <AlertDescription className="text-xs">
          📌 {KEY_MESSAGES.populismVisible.sv}
        </AlertDescription>
      </Alert>
    </CardContent>
  </Card>
);

// Time responsibility panel
const TimeResponsibilityPanel: React.FC = () => (
  <Card className="border-yellow-200 bg-yellow-50/30 dark:bg-yellow-950/20">
    <CardHeader>
      <div className="flex items-center gap-2">
        <Clock className="h-5 w-5 text-yellow-600" />
        <CardTitle className="text-base">Tidsansvar</CardTitle>
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="p-4 bg-background rounded-lg text-center">
        <p className="text-sm mb-2">Exempel: Infrastrukturunderskott</p>
        <p className="text-xl font-bold">
          {TIME_RESPONSIBILITY.template.sv.replace('{x}', '15')}
        </p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription className="text-sm font-medium">
          {TIME_RESPONSIBILITY.principle.sv}
        </AlertDescription>
      </Alert>
    </CardContent>
  </Card>
);

// Global comparison
const GlobalComparisonPanel: React.FC = () => (
  <Card>
    <CardHeader>
      <div className="flex items-center gap-2">
        <Globe className="h-5 w-5" />
        <CardTitle className="text-base">Global jämförelse</CardTitle>
      </div>
      <CardDescription>Vilka länder skjuter kostnader framåt?</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        {GLOBAL_FAIRNESS_DATA.sort((a, b) => a.futureShiftScore - b.futureShiftScore).map(country => (
          <div key={country.code} className="p-3 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{country.nameSv}</span>
                <TrendIcon trend={country.trend} size={14} />
              </div>
              <Badge variant={country.futureShiftScore > 60 ? 'destructive' : country.futureShiftScore > 40 ? 'secondary' : 'outline'}>
                Framtidsförskjutning: {country.futureShiftScore}%
              </Badge>
            </div>
            
            <div className="grid gap-2 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-muted-foreground">Investering för framtiden</span>
                  <span>{country.investmentScore}%</span>
                </div>
                <Progress value={country.investmentScore} className="h-1.5" />
              </div>
              <div className="text-muted-foreground">
                Skuld per ung person: {country.debtPerYouth.toLocaleString()} kr
              </div>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

// Mandate period correlation
const MandatePeriodPanel: React.FC = () => (
  <Card>
    <CardHeader>
      <div className="flex items-center gap-2">
        <Calendar className="h-5 w-5" />
        <CardTitle className="text-base">Mandatperioder & skuldutveckling</CardTitle>
      </div>
      <CardDescription>Spårbarhet utan anklagelse</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        {SWEDEN_MANDATE_PERIODS.map((period, i) => (
          <div key={i} className="flex items-center gap-3 p-2 border rounded text-sm">
            <Badge variant="outline" className="shrink-0">
              {period.start}–{period.end}
            </Badge>
            <span className="flex-1">{period.leader} ({period.party})</span>
            <div className="flex items-center gap-2 text-xs">
              <span className={period.debtChange > 0 ? 'text-red-500' : 'text-green-500'}>
                Skuld: {period.debtChange > 0 ? '+' : ''}{period.debtChange}%
              </span>
              <span className="text-muted-foreground">
                Infrastruktur: {period.infrastructureInvestment}%
              </span>
            </div>
          </div>
        ))}
      </div>

      <DecisionCorrelationAlert statement={KEY_MESSAGES.decisionCorrelation.sv} className="mt-4" />
    </CardContent>
  </Card>
);

// Main component
const IntergenerationalFairnessEngine: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCategory, setSelectedCategory] = useState<DebtCategory | null>(null);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);

  const handleCategoryClick = (cat: DebtCategory) => {
    setSelectedCategory(cat);
  };

  const handleComponentClick = (componentId: string) => {
    setSelectedComponent(componentId);
  };

  return (
    <div className="space-y-6 p-4 max-w-6xl mx-auto">
      {/* Drill-down dialogs */}
      <CategoryDrillDownDialog 
        category={selectedCategory} 
        onClose={() => setSelectedCategory(null)}
        onComponentClick={handleComponentClick}
      />
      <ComponentDrillDownDialog 
        componentId={selectedComponent} 
        onClose={() => setSelectedComponent(null)} 
      />

      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Clock className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Intergenerational Fairness Engine</h1>
        </div>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Vem får nyttan – och vem betalar, över generationer?
        </p>
      </div>

      {/* Core question */}
      <Alert className="bg-primary/5 border-primary/20">
        <Info className="h-4 w-4" />
        <AlertDescription className="text-sm">
          <strong>Kärnfråga:</strong> {IFE_CORE_QUESTION.sv}
        </AlertDescription>
      </Alert>

      {/* Warning */}
      <Alert variant="destructive" className="bg-destructive/10">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="text-sm">
          {IFE_WARNING.sv}
        </AlertDescription>
      </Alert>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Skuldtyper</TabsTrigger>
          <TabsTrigger value="cohorts">Generationer</TabsTrigger>
          <TabsTrigger value="decisions">Beslut</TabsTrigger>
          <TabsTrigger value="global">Globalt</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4 space-y-6">
          <DebtCategoriesPanel 
            onCategoryClick={handleCategoryClick}
            onComponentClick={handleComponentClick}
          />
          <Alert className="bg-muted/30">
            <AlertDescription className="text-xs">
              📌 {KEY_MESSAGES.workShifted.sv}
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="cohorts" className="mt-4 space-y-6">
          <CohortViewPanel />
          <DebtTimelinePanel />
        </TabsContent>

        <TabsContent value="decisions" className="mt-4 space-y-6">
          <BenefitCostPanel />
          <TimeResponsibilityPanel />
          <MandatePeriodPanel />
        </TabsContent>

        <TabsContent value="global" className="mt-4 space-y-6">
          <GlobalComparisonPanel />
        </TabsContent>
      </Tabs>

      {/* Core message */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="pt-6 text-center">
          <p className="text-sm font-medium max-w-lg mx-auto">
            {KEY_MESSAGES.civilizationWarning.sv}
          </p>
          <Separator className="my-4" />
          <p className="text-xs text-muted-foreground">
            Detta är inte moral. Detta är bokföring över tid.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntergenerationalFairnessEngine;
