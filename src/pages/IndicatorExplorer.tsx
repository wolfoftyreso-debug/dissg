/**
 * ============================================================================
 * DISSG INDICATOR EXPLORER
 * Diagnostic Information System for Societal Governance
 * ============================================================================
 * 
 * Hierarchy Level: INDIKATOR (Level 5 of 7)
 * 
 * Deep-dive into any single indicator with:
 * - Historical trend (up to 2000 years where data exists)
 * - Geographic scale switching (Civilisation/Nation/Region)
 * - Correlation with secondary indicators
 * - Full provenance and methodology
 */

import { useState, useMemo } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Info,
  ArrowLeft,
  ExternalLink,
  Clock,
  Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

// ============================================================================
// INDICATOR DEFINITIONS
// ============================================================================

interface IndicatorDefinition {
  code: string;
  name: string;
  nameEn: string;
  domain: string;
  domainName: string;
  unit: string;
  description: string;
  methodology: string;
  sources: string[];
  higherIsBetter: boolean;
  updateFrequency: string;
  coverage: string;
  limitations: string[];
}

const INDICATORS: Record<string, IndicatorDefinition> = {
  life_expectancy: {
    code: 'life_expectancy',
    name: 'Förväntad livslängd',
    nameEn: 'Life Expectancy',
    domain: 'life_health',
    domainName: 'Liv & Hälsa',
    unit: 'år',
    description: 'Genomsnittligt antal år en nyfödd förväntas leva givet nuvarande dödlighetsmönster.',
    methodology: 'Beräknas från periodspecifika dödstal per åldersgrupp. Standardiserad enligt WHO:s metodik.',
    sources: ['WHO', 'SCB', 'Eurostat', 'World Bank'],
    higherIsBetter: true,
    updateFrequency: 'Årligen',
    coverage: '195 länder, 1960-2024',
    limitations: [
      'Speglar nuvarande förhållanden, inte faktisk framtida livslängd',
      'Nationella genomsnitt döljer regionala skillnader',
      'Historiska data före 1950 är estimat med hög osäkerhet'
    ]
  },
  infant_mortality: {
    code: 'infant_mortality',
    name: 'Barnadödlighet',
    nameEn: 'Infant Mortality',
    domain: 'life_health',
    domainName: 'Liv & Hälsa',
    unit: 'per 1000 levande födda',
    description: 'Antal dödsfall bland barn under 1 års ålder per 1000 levande födda.',
    methodology: 'Direkta mätningar från civilregister och hushållsundersökningar.',
    sources: ['UNICEF', 'WHO', 'SCB'],
    higherIsBetter: false,
    updateFrequency: 'Årligen',
    coverage: '195 länder, 1950-2024',
    limitations: [
      'Underrapportering i länder med svaga civilregister',
      'Definitioner av "levande född" varierar mellan länder'
    ]
  },
  disease_burden: {
    code: 'disease_burden',
    name: 'Sjukdomsbörda (DALY)',
    nameEn: 'Disease Burden (DALY)',
    domain: 'life_health',
    domainName: 'Liv & Hälsa',
    unit: 'DALYs per 100 000',
    description: 'Disability-Adjusted Life Years - mått på förlorade friska levnadsår genom sjukdom och förtida död.',
    methodology: 'Global Burden of Disease Study metodologi. Kombinerar YLL (years of life lost) och YLD (years lived with disability).',
    sources: ['IHME', 'WHO', 'GBD Study'],
    higherIsBetter: false,
    updateFrequency: 'Vart 2-3 år',
    coverage: '195 länder, 1990-2021',
    limitations: [
      'Modellbaserade estimat med betydande osäkerhetsintervall',
      'Vikter för funktionsnedsättning baseras på expertpaneler, inte empiriska data'
    ]
  },
  healthcare_access: {
    code: 'healthcare_access',
    name: 'Vårdtillgång',
    nameEn: 'Healthcare Access',
    domain: 'life_health',
    domainName: 'Liv & Hälsa',
    unit: 'index 0-100',
    description: 'Composite index för tillgång till och kvalitet på hälso- och sjukvård.',
    methodology: 'HAQ Index från GBD Study. Baserat på behandlingsbara dödsorsaker.',
    sources: ['IHME', 'Lancet'],
    higherIsBetter: true,
    updateFrequency: 'Vart 2-3 år',
    coverage: '195 länder, 1990-2021',
    limitations: [
      'Fokuserar på akut vård, underskattar preventiv och mental hälsa',
      'Nationella genomsnitt döljer socioekonomiska skillnader'
    ]
  },
  employment_rate: {
    code: 'employment_rate',
    name: 'Sysselsättningsgrad',
    nameEn: 'Employment Rate',
    domain: 'livelihood_work',
    domainName: 'Försörjning & Arbete',
    unit: '%',
    description: 'Andel av befolkningen 15-64 år som är sysselsatta.',
    methodology: 'ILO-definition. Minst 1 timmes arbete under referensveckan.',
    sources: ['ILO', 'Eurostat', 'SCB'],
    higherIsBetter: true,
    updateFrequency: 'Kvartalsvis',
    coverage: '180+ länder, 1991-2024',
    limitations: [
      'Inkluderar undersysselsättning',
      'Döljer informell ekonomi i utvecklingsländer'
    ]
  },
  labor_participation: {
    code: 'labor_participation',
    name: 'Arbetskraftsdeltagande',
    nameEn: 'Labor Force Participation',
    domain: 'livelihood_work',
    domainName: 'Försörjning & Arbete',
    unit: '%',
    description: 'Andel av befolkningen 15-64 år som är aktiva i arbetskraften (sysselsatta eller arbetssökande).',
    methodology: 'ILO standarddefinition.',
    sources: ['ILO', 'World Bank'],
    higherIsBetter: true,
    updateFrequency: 'Årligen',
    coverage: '180+ länder, 1990-2024',
    limitations: [
      'Exkluderar informellt arbete i vissa länder',
      'Studenter som arbetar kan dubbelräknas'
    ]
  },
  real_income: {
    code: 'real_income',
    name: 'Reell medianinkomst',
    nameEn: 'Real Median Income',
    domain: 'livelihood_work',
    domainName: 'Försörjning & Arbete',
    unit: 'PPP USD',
    description: 'Medianinkomst justerad för köpkraft och inflation.',
    methodology: 'PPP-justerad med 2017 som basår.',
    sources: ['World Bank', 'OECD', 'Penn World Table'],
    higherIsBetter: true,
    updateFrequency: 'Årligen',
    coverage: '150+ länder, 1980-2023',
    limitations: [
      'PPP-justeringar har betydande osäkerheter',
      'Svårt att jämföra över tid pga konsumtionsmönster'
    ]
  },
  job_sustainability: {
    code: 'job_sustainability',
    name: 'Jobbens framtida bärkraft',
    nameEn: 'Job Sustainability',
    domain: 'livelihood_work',
    domainName: 'Försörjning & Arbete',
    unit: 'index 0-100',
    description: 'Index som mäter jobbens resiliens mot automatisering, klimatomställning och strukturomvandling.',
    methodology: 'Composite baserat på OECD:s Skills for Jobs database och automatiseringsrisker.',
    sources: ['OECD', 'WEF', 'McKinsey Global Institute'],
    higherIsBetter: true,
    updateFrequency: 'Vart 2 år',
    coverage: 'OECD-länder + G20',
    limitations: [
      'Framåtblickande estimat med hög osäkerhet',
      'Metodiken varierar mellan studier'
    ]
  },
  literacy_rate: {
    code: 'literacy_rate',
    name: 'Funktionell läskunnighet',
    nameEn: 'Functional Literacy',
    domain: 'knowledge_skills',
    domainName: 'Kunskap & Kompetens',
    unit: '%',
    description: 'Andel vuxna med funktionell läs- och räkneförmåga enligt PIAAC/IALS-standard.',
    methodology: 'PIAAC Level 2+ (grundläggande arbetsplatsrelevant läskunnighet).',
    sources: ['OECD PIAAC', 'UNESCO'],
    higherIsBetter: true,
    updateFrequency: 'Vart 10 år',
    coverage: 'OECD + utvalda länder',
    limitations: [
      'Begränsat till länder som deltar i PIAAC',
      'Testbaserade mått kan underskatta praktisk kompetens'
    ]
  },
  education_match: {
    code: 'education_match',
    name: 'Utbildning-arbete-match',
    nameEn: 'Education-Work Match',
    domain: 'knowledge_skills',
    domainName: 'Kunskap & Kompetens',
    unit: '%',
    description: 'Andel sysselsatta som arbetar inom ett område som matchar deras utbildning.',
    methodology: 'Baserat på ISCO-kodning av yrken och utbildningsnivåer.',
    sources: ['OECD', 'Eurostat'],
    higherIsBetter: true,
    updateFrequency: 'Årligen',
    coverage: 'OECD-länder',
    limitations: [
      'Subjektiva definitioner av "matchning"',
      'Svårt att bedöma kvalitativa aspekter'
    ]
  },
  // ==================== NYA INDIKATORER ====================
  gdp_growth: {
    code: 'gdp_growth',
    name: 'BNP-tillväxt',
    nameEn: 'GDP Growth',
    domain: 'livelihood_work',
    domainName: 'Försörjning & Arbete',
    unit: '% årlig',
    description: 'Årlig procentuell förändring av bruttonationalprodukten i fasta priser.',
    methodology: 'Nationalräkenskaper enligt SNA 2008 standard. Säsongsrensad och kalenderkorrigerad.',
    sources: ['SCB', 'Eurostat', 'World Bank', 'IMF'],
    higherIsBetter: true,
    updateFrequency: 'Kvartalsvis',
    coverage: '195 länder, 1960-2024',
    limitations: [
      'BNP mäter inte välbefinnande eller miljöpåverkan',
      'Informell ekonomi underskattas i många länder'
    ]
  },
  energy_efficiency: {
    code: 'energy_efficiency',
    name: 'Energieffektivitet',
    nameEn: 'Energy Efficiency',
    domain: 'resource_environment',
    domainName: 'Resurs & Miljö',
    unit: 'index',
    description: 'BNP per energienhet förbrukad (energiintensitet inverterad).',
    methodology: 'PPP-justerad BNP dividerat med total primär energiförbrukning.',
    sources: ['IEA', 'World Bank', 'Energimyndigheten'],
    higherIsBetter: true,
    updateFrequency: 'Årligen',
    coverage: '180+ länder, 1990-2023',
    limitations: [
      'Strukturella skillnader mellan ekonomier påverkar jämförbarheten',
      'Exkluderar embodied energy i import'
    ]
  },
  healthcare_wait_time: {
    code: 'healthcare_wait_time',
    name: 'Vårdkötid',
    nameEn: 'Healthcare Wait Time',
    domain: 'life_health',
    domainName: 'Liv & Hälsa',
    unit: 'dagar',
    description: 'Genomsnittlig väntetid från remiss till första specialistvårdsbesök.',
    methodology: 'Väntetidsdata från nationella hälsodataregister.',
    sources: ['SKR', 'Väntetider i vården', 'OECD Health Statistics'],
    higherIsBetter: false,
    updateFrequency: 'Månadsvis',
    coverage: 'Sverige regionalt, OECD-länder nationellt',
    limitations: [
      'Definitioner av "väntetid" varierar mellan regioner',
      'Mäter endast specialistvård, inte primärvård'
    ]
  },
  shootings: {
    code: 'shootings',
    name: 'Skjutningar',
    nameEn: 'Gun Violence',
    domain: 'stability_security',
    domainName: 'Stabilitet & Säkerhet',
    unit: 'per 100 000',
    description: 'Antal bekräftade skjutningar (dödliga och icke-dödliga) per 100 000 invånare.',
    methodology: 'BRÅ:s skjutningsstatistik baserad på polisanmälningar och bekräftade händelser.',
    sources: ['BRÅ', 'Polisen', 'UNODC'],
    higherIsBetter: false,
    updateFrequency: 'Månadsvis',
    coverage: 'Sverige, EU-jämförelser',
    limitations: [
      'Internationella jämförelser försvåras av olika definitioner',
      'Mörkertal förekommer'
    ]
  },
  housing_segregation: {
    code: 'housing_segregation',
    name: 'Boendesegregation',
    nameEn: 'Housing Segregation',
    domain: 'stability_security',
    domainName: 'Stabilitet & Säkerhet',
    unit: 'index',
    description: 'Dissimilarity index som mäter geografisk separation mellan demografiska grupper.',
    methodology: 'Beräknas på DeSO-nivå (demografiska statistikområden) baserat på födelseland.',
    sources: ['SCB', 'Delmos', 'Boverket'],
    higherIsBetter: false,
    updateFrequency: 'Årligen',
    coverage: 'Sverige kommunalt',
    limitations: [
      'Mäter endast bostadssegregation, inte arbetsplatser eller skolor',
      'Statiska mått fångar inte mobilitet'
    ]
  },
  teacher_shortage: {
    code: 'teacher_shortage',
    name: 'Lärarbrist',
    nameEn: 'Teacher Shortage',
    domain: 'knowledge_skills',
    domainName: 'Kunskap & Kompetens',
    unit: '%',
    description: 'Andel lärartjänster som saknar behörig personal.',
    methodology: 'Andel tjänster som tillsatts med obehöriga lärare eller är vakanta.',
    sources: ['Skolverket', 'UKÄ', 'SKR'],
    higherIsBetter: false,
    updateFrequency: 'Årligen',
    coverage: 'Sverige kommunalt och nationellt',
    limitations: [
      'Definition av "behörig" varierar mellan ämnen',
      'Döljer kvalitativa skillnader i undervisning'
    ]
  }
};

// Default indicator for unknown codes
const DEFAULT_INDICATOR: IndicatorDefinition = {
  code: 'unknown',
  name: 'Okänd indikator',
  nameEn: 'Unknown Indicator',
  domain: 'unknown',
  domainName: 'Okänd domän',
  unit: '-',
  description: 'Ingen definition tillgänglig för denna indikator.',
  methodology: 'Ej specificerad',
  sources: [],
  higherIsBetter: true,
  updateFrequency: 'Okänd',
  coverage: 'Okänd',
  limitations: []
};

// ============================================================================
// COMPONENT
// ============================================================================

type GeoScale = 'city' | 'nation' | 'global';
type TimeRange = '10y' | '50y' | '100y' | 'all';

export default function IndicatorExplorer() {
  const { code } = useParams<{ code: string }>();
  const [searchParams] = useSearchParams();
  const countryCode = searchParams.get('country') || 'SE';
  
  const [geoScale, setGeoScale] = useState<GeoScale>('nation');
  const [timeRange, setTimeRange] = useState<TimeRange>('50y');
  
  const indicator = INDICATORS[code || ''] || { ...DEFAULT_INDICATOR, code: code || 'unknown', name: code || 'Okänd' };
  
  // Generate mock historical data
  const historicalData = useMemo(() => {
    const years: number[] = [];
    const values: number[] = [];
    
    const endYear = 2024;
    let startYear = endYear - 10;
    if (timeRange === '50y') startYear = endYear - 50;
    if (timeRange === '100y') startYear = endYear - 100;
    if (timeRange === 'all') startYear = 1850;
    
    let baseValue = indicator.higherIsBetter ? 70 : 30;
    
    for (let year = startYear; year <= endYear; year++) {
      years.push(year);
      // Gradual improvement over time with some noise
      const progress = (year - startYear) / (endYear - startYear);
      const noise = (Math.sin(year * 0.5) * 5);
      const value = indicator.higherIsBetter 
        ? baseValue + progress * 20 + noise
        : baseValue - progress * 20 + noise;
      values.push(Math.max(0, Math.min(100, value)));
    }
    
    return { years, values };
  }, [timeRange, indicator]);
  
  const currentValue = historicalData.values[historicalData.values.length - 1];
  const previousValue = historicalData.values[historicalData.values.length - 2];
  const trend = currentValue > previousValue ? 'up' : currentValue < previousValue ? 'down' : 'stable';
  const change = currentValue - previousValue;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-muted/30">
        <div className="container max-w-4xl py-4">
          <Link 
            to="/reality-index" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Tillbaka till Reality Index
          </Link>
          
          <div className="flex items-start justify-between gap-4">
            <div>
              <Badge variant="outline" className="mb-2 font-mono text-[10px]">
                {indicator.domainName}
              </Badge>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                {indicator.name}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {indicator.nameEn}
              </p>
            </div>
            
            <div className="text-right">
              <div className="text-4xl font-bold">
                {Math.round(currentValue)}
              </div>
              <div className="text-sm text-muted-foreground">
                {indicator.unit}
              </div>
              <div className={cn(
                "flex items-center gap-1 justify-end text-sm mt-1",
                trend === 'up' && indicator.higherIsBetter ? "text-emerald-600" : 
                trend === 'down' && !indicator.higherIsBetter ? "text-emerald-600" :
                trend === 'stable' ? "text-muted-foreground" : "text-rose-600"
              )}>
                {trend === 'up' ? <TrendingUp className="h-4 w-4" /> : 
                 trend === 'down' ? <TrendingDown className="h-4 w-4" /> : 
                 <Minus className="h-4 w-4" />}
                <span>{change > 0 ? '+' : ''}{change.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container max-w-4xl py-8 space-y-8">
        {/* Controls */}
        <div className="flex flex-wrap gap-4 justify-between">
          {/* Geographic Scale */}
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground font-medium">Geografisk skala</label>
            <div className="flex gap-1">
              {[
                { value: 'city', label: 'Stad' },
                { value: 'nation', label: 'Nation' },
                { value: 'global', label: 'Global' },
              ].map((option) => (
                <Button
                  key={option.value}
                  variant={geoScale === option.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setGeoScale(option.value as GeoScale)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Time Range */}
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground font-medium">Tidshorisont</label>
            <div className="flex gap-1">
              {[
                { value: '10y', label: '10 år' },
                { value: '50y', label: '50 år' },
                { value: '100y', label: '100 år' },
                { value: 'all', label: 'All tid' },
              ].map((option) => (
                <Button
                  key={option.value}
                  variant={timeRange === option.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTimeRange(option.value as TimeRange)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Historisk utveckling</h2>
            <Badge variant="outline" className="font-mono text-[10px]">
              {historicalData.years[0]}–{historicalData.years[historicalData.years.length - 1]}
            </Badge>
          </div>
          
          {/* Simple ASCII-style chart */}
          <div className="h-64 flex items-end gap-[2px] overflow-hidden">
            {historicalData.values.map((value, i) => {
              const height = (value / 100) * 100;
              const isEstimate = historicalData.years[i] < 1950;
              
              return (
                <motion.div
                  key={i}
                  className={cn(
                    "flex-1 min-w-[2px] rounded-t transition-colors group cursor-pointer",
                    isEstimate ? "bg-primary/30" : "bg-primary/60 hover:bg-primary"
                  )}
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ delay: i * 0.005, duration: 0.3 }}
                  title={`${historicalData.years[i]}: ${value.toFixed(1)}`}
                />
              );
            })}
          </div>
          
          {/* X-axis labels */}
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>{historicalData.years[0]}</span>
            <span>{historicalData.years[Math.floor(historicalData.years.length / 2)]}</span>
            <span>{historicalData.years[historicalData.years.length - 1]}</span>
          </div>
          
          {timeRange === 'all' && (
            <div className="mt-4 p-3 rounded bg-amber-500/10 border border-amber-500/20 text-sm">
              <div className="flex gap-2">
                <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-muted-foreground">
                  <strong className="text-foreground">Observera:</strong> Data före 1950 är historiska estimat 
                  med betydligt högre osäkerhet. Visas med ljusare färg.
                </p>
              </div>
            </div>
          )}
        </Card>

        {/* Tabs for detailed info */}
        <Tabs defaultValue="about" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="about" className="text-xs sm:text-sm">
              <span className="font-mono text-[10px] mr-1">[OM]</span>
              <span className="hidden sm:inline">Om</span>
            </TabsTrigger>
            <TabsTrigger value="method" className="text-xs sm:text-sm">
              <span className="font-mono text-[10px] mr-1">[MET]</span>
              <span className="hidden sm:inline">Metod</span>
            </TabsTrigger>
            <TabsTrigger value="sources" className="text-xs sm:text-sm">
              <span className="font-mono text-[10px] mr-1">[KÄL]</span>
              <span className="hidden sm:inline">Källor</span>
            </TabsTrigger>
            <TabsTrigger value="limits" className="text-xs sm:text-sm">
              <span className="font-mono text-[10px] mr-1">[BEG]</span>
              <span className="hidden sm:inline">Begränsningar</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="about">
            <Card className="p-6 space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Beskrivning</h3>
                <p className="text-sm text-muted-foreground">{indicator.description}</p>
              </div>
              
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="text-xs text-muted-foreground mb-1">Enhet</div>
                  <div className="font-medium">{indicator.unit}</div>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="text-xs text-muted-foreground mb-1">Uppdateringsfrekvens</div>
                  <div className="font-medium">{indicator.updateFrequency}</div>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="text-xs text-muted-foreground mb-1">Täckning</div>
                  <div className="font-medium">{indicator.coverage}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Tolkning:</span>
                <Badge variant={indicator.higherIsBetter ? "default" : "secondary"}>
                  {indicator.higherIsBetter ? "Högre = bättre" : "Lägre = bättre"}
                </Badge>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="method">
            <Card className="p-6">
              <h3 className="font-semibold mb-2">Metodologi</h3>
              <p className="text-sm text-muted-foreground">{indicator.methodology}</p>
              
              <div className="mt-4 p-4 rounded-lg bg-muted/30 border-l-2 border-primary">
                <p className="text-sm">
                  <strong>Normalisering:</strong> Värden konverteras till en 0-100 skala baserat på 
                  global distribution (percentilbaserad normalisering).
                </p>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="sources">
            <Card className="p-6 space-y-4">
              <h3 className="font-semibold">Datakällor</h3>
              
              {indicator.sources.length > 0 ? (
                <div className="space-y-2">
                  {indicator.sources.map((source, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{source}</span>
                      </div>
                      <Button variant="ghost" size="sm" className="gap-1">
                        <span className="text-xs">Besök</span>
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Inga källor specificerade.</p>
              )}
              
              <div className="text-xs text-muted-foreground flex items-center gap-2">
                <Clock className="h-3 w-3" />
                Senast uppdaterad: 2025-Q4
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="limits">
            <Card className="p-6 space-y-4">
              <h3 className="font-semibold">Kända begränsningar</h3>
              
              {indicator.limitations.length > 0 ? (
                <ul className="space-y-2">
                  {indicator.limitations.map((limit, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-rose-500 shrink-0">—</span>
                      <span className="text-muted-foreground">{limit}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">Inga dokumenterade begränsningar.</p>
              )}
              
              <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/20">
                <h4 className="font-medium text-sm mb-1">Vad denna indikator INTE visar:</h4>
                <p className="text-xs text-muted-foreground">
                  Kausalitet, framtida utveckling, normativa bedömningar, 
                  eller rekommendationer för åtgärder.
                </p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Related indicators */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Relaterade indikatorer</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {Object.values(INDICATORS)
              .filter(ind => ind.domain === indicator.domain && ind.code !== indicator.code)
              .slice(0, 4)
              .map((ind) => (
                <Link
                  key={ind.code}
                  to={`/indicator/${ind.code}`}
                  className="p-3 rounded-lg border hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium group-hover:text-primary transition-colors">
                      {ind.name}
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                      [→]
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{ind.unit}</p>
                </Link>
              ))}
          </div>
        </Card>

        {/* Citation */}
        <Card className="p-4 bg-muted/30">
          <div className="text-xs text-muted-foreground">
            <strong>Citera denna vy:</strong>
            <code className="block mt-1 p-2 bg-background rounded border text-[11px]">
              {indicator.name} [{indicator.code}], Reality Index v1.0, 
              accessed 2025-02-04, scope: {geoScale}, range: {timeRange}
            </code>
          </div>
        </Card>
      </main>
    </div>
  );
}
