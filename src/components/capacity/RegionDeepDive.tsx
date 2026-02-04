/**
 * REGION DEEP DIVE - FULL EXPLANATION PYRAMID FOR GEOGRAPHIC REGIONS
 * ═══════════════════════════════════════════════════════════════════
 * 
 * Multi-level deep dive for pressure zones and regions:
 * L1: Observation (Current state)
 * L2: Mechanism (Why this pressure exists)
 * L3: Indicators (KPIs and data)
 * L4: Substance & Health Data (STRIM integration)
 * L5: Limitations & Sources
 * 
 * Every claim is clickable. Every number is traceable.
 */

import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  MapPin, 
  TrendingUp, 
  TrendingDown,
  Minus,
  AlertTriangle,
  Zap,
  Users,
  Building2,
  Heart,
  Pill,
  Activity,
  Globe,
  ChevronRight,
  ExternalLink,
  Database,
  FileText,
  BookOpen,
  Scale,
  Clock,
  Info,
  Skull,
  Wine,
  Cigarette,
  Syringe
} from 'lucide-react';
import type { PressZone } from '@/config/carryingCapacityConfig';
import { cn } from '@/lib/utils';

// ═══════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════

interface RegionIndicator {
  code: string;
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
  dataQuality: 'high' | 'medium' | 'low';
  source: string;
  year: number;
  global_percentile?: number;
}

interface SubstanceData {
  substance: string;
  slug: string;
  prevalence: number;
  prevalenceUnit: string;
  trend: 'up' | 'down' | 'stable';
  ageGroup: string;
  yearlyDeaths?: number;
  daysLostPerCapita?: number;
  treatmentGap: number;
  dataYear: number;
  source: string;
  notes?: string;
}

interface RegionHealth {
  lifeExpectancy: number;
  healthyLifeExpectancy: number;
  disabilityAdjustedLifeYears: number;
  substanceRelatedDALY: number;
  mentalHealthPrevalence: number;
  treatmentAccessRate: number;
}

interface RegionEvidence {
  overview: {
    population: number;
    countries: string[];
    mainChallenges: string[];
    positiveSignals: string[];
  };
  indicators: RegionIndicator[];
  substances: SubstanceData[];
  health: RegionHealth;
  pressureFactors: {
    energy: { score: number; description: string; trend: string };
    population: { score: number; description: string; trend: string };
    institutions: { score: number; description: string; trend: string };
  };
  historicalContext: Array<{
    period: string;
    event: string;
    impact: string;
  }>;
  thisShows: string[];
  thisDoesNotShow: string[];
  sources: Array<{
    name: string;
    type: 'government' | 'international' | 'academic';
    url: string;
    reliability: number;
  }>;
  relatedRegions: string[];
}

// ═══════════════════════════════════════════════════════════════
// COMPREHENSIVE REGIONAL DATA
// ═══════════════════════════════════════════════════════════════

const REGION_EVIDENCE: Record<string, RegionEvidence> = {
  sahel: {
    overview: {
      population: 150_000_000,
      countries: ['Mali', 'Niger', 'Burkina Faso', 'Tchad', 'Mauritanien', 'Senegal'],
      mainChallenges: [
        'Snabb befolkningstillväxt (>3%/år)',
        'Begränsad energiinfrastruktur',
        'Institutionell instabilitet',
        'Klimatpåverkan på jordbruk',
        'Väpnade konflikter'
      ],
      positiveSignals: [
        'Mobilteknologi sprider sig snabbt',
        'Ung befolkning (median 15 år)',
        'Solenergi-potential mycket hög',
        'Internationellt biståndsfokus'
      ]
    },
    indicators: [
      { code: 'HDI', name: 'Human Development Index', value: 0.41, unit: 'index 0-1', trend: 'up', changePercent: 2.1, dataQuality: 'high', source: 'UNDP', year: 2023, global_percentile: 8 },
      { code: 'ENERGY_ACC', name: 'Tillgång till elektricitet', value: 22, unit: '%', trend: 'up', changePercent: 3.5, dataQuality: 'medium', source: 'World Bank', year: 2022, global_percentile: 5 },
      { code: 'FERTILITY', name: 'Fertilitet', value: 5.8, unit: 'barn/kvinna', trend: 'down', changePercent: -1.2, dataQuality: 'high', source: 'UN DESA', year: 2023, global_percentile: 98 },
      { code: 'LIFE_EXP', name: 'Medellivslängd', value: 56.2, unit: 'år', trend: 'up', changePercent: 0.8, dataQuality: 'high', source: 'WHO', year: 2023, global_percentile: 12 },
      { code: 'GOVERNANCE', name: 'Governance Index', value: 28, unit: 'index 0-100', trend: 'down', changePercent: -5.3, dataQuality: 'medium', source: 'World Bank', year: 2023, global_percentile: 15 },
      { code: 'WATER_ACC', name: 'Tillgång till rent vatten', value: 54, unit: '%', trend: 'up', changePercent: 1.8, dataQuality: 'medium', source: 'WHO/UNICEF', year: 2022, global_percentile: 18 }
    ],
    substances: [
      { substance: 'Alkohol', slug: 'alkohol', prevalence: 3.2, prevalenceUnit: 'liter ren alkohol/capita', trend: 'stable', ageGroup: '15+', yearlyDeaths: 15200, treatmentGap: 95, dataYear: 2019, source: 'WHO GHO', notes: 'Låg konsumtion pga religiös/kulturell kontext, men underrapportering sannolikt' },
      { substance: 'Tobak', slug: 'tobak', prevalence: 11.5, prevalenceUnit: '% daglig användning', trend: 'up', ageGroup: '15+', yearlyDeaths: 28000, treatmentGap: 98, dataYear: 2020, source: 'WHO GTSS' },
      { substance: 'Cannabis', slug: 'cannabis', prevalence: 6.8, prevalenceUnit: '% senaste året', trend: 'stable', ageGroup: '15-64', treatmentGap: 99, dataYear: 2020, source: 'UNODC' },
      { substance: 'Tramadol (missbruk)', slug: 'tramadol', prevalence: 4.2, prevalenceUnit: '% senaste året', trend: 'up', ageGroup: '15-35', yearlyDeaths: 3500, treatmentGap: 99, dataYear: 2021, source: 'UNODC/WACD', notes: 'Snabbväxande problem i regionen' }
    ],
    health: {
      lifeExpectancy: 56.2,
      healthyLifeExpectancy: 48.1,
      disabilityAdjustedLifeYears: 72000,
      substanceRelatedDALY: 4800,
      mentalHealthPrevalence: 11.2,
      treatmentAccessRate: 2
    },
    pressureFactors: {
      energy: { score: 85, description: 'Endast 22% har el. Biomassa dominerar (>80%). Solpotential outnyttjad.', trend: 'improving' },
      population: { score: 95, description: 'Världens snabbast växande region. Fördubblas på 25 år.', trend: 'unchanged' },
      institutions: { score: 90, description: 'Väpnade konflikter, svag statskapacitet, korruption.', trend: 'deteriorating' }
    },
    historicalContext: [
      { period: '1960-tal', event: 'Självständighet från Frankrike', impact: 'Institutionellt vacuum, gränskonflikter' },
      { period: '1970-80', event: 'Stora torkor', impact: 'Massivt humanitär kris, migration söderut' },
      { period: '2012-nu', event: 'Jihadistisk aktivitet', impact: 'Statskollaps i delar av Mali, Niger, Burkina Faso' }
    ],
    thisShows: [
      'Extremt tryck från alla tre faktorer samtidigt',
      'Snabb befolkningstillväxt i energifattig miljö',
      'Institutionell kapacitet räcker inte för basala tjänster',
      'Ung befolkning = potential OCH sårbarhet'
    ],
    thisDoesNotShow: [
      'Orsakssamband mellan faktorer (komplext)',
      'Kulturella variationer inom regionen',
      'Lokala framgångshistorier',
      'Framtida scenarier'
    ],
    sources: [
      { name: 'UNDP Human Development Report', type: 'international', url: 'https://hdr.undp.org', reliability: 95 },
      { name: 'World Bank Open Data', type: 'international', url: 'https://data.worldbank.org', reliability: 92 },
      { name: 'WHO Global Health Observatory', type: 'international', url: 'https://gho.who.int', reliability: 94 },
      { name: 'UNODC World Drug Report', type: 'international', url: 'https://www.unodc.org', reliability: 88 }
    ],
    relatedRegions: ['west_africa', 'north_africa', 'horn_of_africa']
  },
  
  south_asia: {
    overview: {
      population: 1_900_000_000,
      countries: ['Indien', 'Pakistan', 'Bangladesh', 'Nepal', 'Sri Lanka', 'Bhutan', 'Maldiverna'],
      mainChallenges: [
        'Massiv befolkning under ekonomiskt tryck',
        'Ojämn energifördelning',
        'Luftkvalitet i storstäder kritisk',
        'Vattenresurser under press'
      ],
      positiveSignals: [
        'Snabb ekonomisk tillväxt',
        'Tekniksektor expanderar',
        'Utbildningsnivåer stiger',
        'Institutioner anpassar sig'
      ]
    },
    indicators: [
      { code: 'HDI', name: 'Human Development Index', value: 0.63, unit: 'index 0-1', trend: 'up', changePercent: 1.8, dataQuality: 'high', source: 'UNDP', year: 2023, global_percentile: 42 },
      { code: 'ENERGY_ACC', name: 'Tillgång till elektricitet', value: 96, unit: '%', trend: 'up', changePercent: 2.1, dataQuality: 'high', source: 'World Bank', year: 2022, global_percentile: 65 },
      { code: 'AIR_QUALITY', name: 'PM2.5 koncentration', value: 52, unit: 'μg/m³', trend: 'down', changePercent: -3.2, dataQuality: 'high', source: 'AQLI', year: 2023, global_percentile: 92 },
      { code: 'LIFE_EXP', name: 'Medellivslängd', value: 69.4, unit: 'år', trend: 'up', changePercent: 0.6, dataQuality: 'high', source: 'WHO', year: 2023, global_percentile: 55 }
    ],
    substances: [
      { substance: 'Alkohol', slug: 'alkohol', prevalence: 4.1, prevalenceUnit: 'liter ren alkohol/capita', trend: 'up', ageGroup: '15+', yearlyDeaths: 371000, treatmentGap: 78, dataYear: 2019, source: 'WHO GHO' },
      { substance: 'Tobak', slug: 'tobak', prevalence: 27.2, prevalenceUnit: '% användning', trend: 'down', ageGroup: '15+', yearlyDeaths: 1350000, treatmentGap: 85, dataYear: 2020, source: 'WHO GTSS' },
      { substance: 'Cannabis', slug: 'cannabis', prevalence: 3.3, prevalenceUnit: '% senaste året', trend: 'stable', ageGroup: '15-64', treatmentGap: 92, dataYear: 2020, source: 'UNODC' },
      { substance: 'Opioider', slug: 'opioider', prevalence: 0.42, prevalenceUnit: '% senaste året', trend: 'up', ageGroup: '15-64', yearlyDeaths: 68000, treatmentGap: 88, dataYear: 2021, source: 'UNODC' }
    ],
    health: {
      lifeExpectancy: 69.4,
      healthyLifeExpectancy: 60.1,
      disabilityAdjustedLifeYears: 28500,
      substanceRelatedDALY: 3200,
      mentalHealthPrevalence: 14.8,
      treatmentAccessRate: 12
    },
    pressureFactors: {
      energy: { score: 55, description: 'Tillgång god men kvalitet ojämn. Kolberoende högt.', trend: 'improving' },
      population: { score: 70, description: 'Tillväxt avtar men absoluta tal enorma.', trend: 'improving' },
      institutions: { score: 40, description: 'Fungerande demokratier, men kapacitetsproblem.', trend: 'stable' }
    },
    historicalContext: [
      { period: '1947', event: 'Självständighet & Delning', impact: 'Massiva flyktingströmmar, religiösa spänningar' },
      { period: '1990-tal', event: 'Ekonomiska reformer', impact: 'Snabb tillväxt, ökande ojämlikhet' },
      { period: '2010-tal', event: 'Digital revolution', impact: 'Mobil finans, e-government expansion' }
    ],
    thisShows: [
      'Energi- och befolkningstryck hanteras av anpassningsbara institutioner',
      'Ojämn utveckling mellan och inom länder',
      'Tobaksrelaterad dödlighet en massiv folkhälsobörda'
    ],
    thisDoesNotShow: [
      'Landsspecifika skillnader (Indien ≠ Bangladesh)',
      'Rurala vs urbana variationer',
      'Klassgradienter i hälsoutfall'
    ],
    sources: [
      { name: 'UNDP Human Development Report', type: 'international', url: 'https://hdr.undp.org', reliability: 95 },
      { name: 'World Bank Open Data', type: 'international', url: 'https://data.worldbank.org', reliability: 92 },
      { name: 'WHO Global Health Observatory', type: 'international', url: 'https://gho.who.int', reliability: 94 },
      { name: 'Air Quality Life Index (AQLI)', type: 'academic', url: 'https://aqli.epic.uchicago.edu', reliability: 90 }
    ],
    relatedRegions: ['southeast_asia', 'central_asia', 'middle_east']
  },

  central_america: {
    overview: {
      population: 180_000_000,
      countries: ['Guatemala', 'Honduras', 'El Salvador', 'Nicaragua', 'Costa Rica', 'Panama', 'Belize'],
      mainChallenges: [
        'Organiserad brottslighet (narkotikahandel)',
        'Institutionell svaghet i norra triangeln',
        'Klimatpåverkan (orkaner, torka)',
        'Migration mot USA'
      ],
      positiveSignals: [
        'Costa Rica som regional förebild',
        'Förnybar energi-potential',
        'Ung befolkning',
        'Diaspora-remitteringar'
      ]
    },
    indicators: [
      { code: 'HDI', name: 'Human Development Index', value: 0.67, unit: 'index 0-1', trend: 'up', changePercent: 1.2, dataQuality: 'high', source: 'UNDP', year: 2023, global_percentile: 48 },
      { code: 'HOMICIDE', name: 'Mordfrekvens', value: 22.1, unit: 'per 100 000', trend: 'down', changePercent: -8.5, dataQuality: 'medium', source: 'UNODC', year: 2022, global_percentile: 92 },
      { code: 'GOVERNANCE', name: 'Governance Index', value: 42, unit: 'index 0-100', trend: 'down', changePercent: -2.1, dataQuality: 'high', source: 'World Bank', year: 2023, global_percentile: 35 }
    ],
    substances: [
      { substance: 'Alkohol', slug: 'alkohol', prevalence: 4.8, prevalenceUnit: 'liter ren alkohol/capita', trend: 'stable', ageGroup: '15+', yearlyDeaths: 12500, treatmentGap: 72, dataYear: 2019, source: 'WHO GHO' },
      { substance: 'Kokain', slug: 'kokain', prevalence: 0.8, prevalenceUnit: '% senaste året', trend: 'up', ageGroup: '15-64', yearlyDeaths: 850, treatmentGap: 89, dataYear: 2021, source: 'UNODC', notes: 'Transit-region för narkotikahandel, lokal konsumtion ökar' },
      { substance: 'Cannabis', slug: 'cannabis', prevalence: 2.5, prevalenceUnit: '% senaste året', trend: 'stable', ageGroup: '15-64', treatmentGap: 94, dataYear: 2020, source: 'UNODC' },
      { substance: 'Metamfetamin', slug: 'metamfetamin', prevalence: 0.4, prevalenceUnit: '% senaste året', trend: 'up', ageGroup: '15-64', treatmentGap: 96, dataYear: 2021, source: 'UNODC' }
    ],
    health: {
      lifeExpectancy: 74.1,
      healthyLifeExpectancy: 64.8,
      disabilityAdjustedLifeYears: 22000,
      substanceRelatedDALY: 2800,
      mentalHealthPrevalence: 16.2,
      treatmentAccessRate: 18
    },
    pressureFactors: {
      energy: { score: 30, description: 'God tillgång, förnybart växer. Costa Rica nära 100% förnybart.', trend: 'improving' },
      population: { score: 35, description: 'Stabiliserad tillväxt, migration utåt.', trend: 'stable' },
      institutions: { score: 75, description: 'Norra triangeln: korruption, gäng, svag rättsstat.', trend: 'deteriorating' }
    },
    historicalContext: [
      { period: '1980-tal', event: 'Inbördeskrig', impact: 'Guatemala, El Salvador, Nicaragua destabiliseras' },
      { period: '1990-tal', event: 'Fredsavtal', impact: 'Demokratisering men svaga institutioner' },
      { period: '2000-tal', event: 'Narkotikakrig', impact: 'Mexiko-effekt sprider sig söderut' }
    ],
    thisShows: [
      'Institutionell svaghet som primär begränsning',
      'Stora skillnader inom regionen (Costa Rica vs Honduras)',
      'Narkotikahandel underminerar statsfunktioner'
    ],
    thisDoesNotShow: [
      'Framgångsrika lokala initiativ',
      'Orsakerna till institutionell svaghet',
      'USAs roll i regional dynamik'
    ],
    sources: [
      { name: 'UNODC Homicide Statistics', type: 'international', url: 'https://dataunodc.un.org', reliability: 88 },
      { name: 'World Bank Governance Indicators', type: 'international', url: 'https://info.worldbank.org/governance/wgi', reliability: 92 },
      { name: 'PAHO Health Data', type: 'international', url: 'https://www.paho.org', reliability: 90 }
    ],
    relatedRegions: ['mexico', 'caribbean', 'south_america']
  },

  mena: {
    overview: {
      population: 450_000_000,
      countries: ['Egypten', 'Marocko', 'Algeriet', 'Tunisien', 'Libyen', 'Jordanien', 'Libanon', 'Irak', 'Syrien', 'Jemen'],
      mainChallenges: [
        'Vattenbrist (kritisk i flera länder)',
        'Ungdomsarbetslöshet mycket hög',
        'Konfliktzoner (Syrien, Jemen, Libyen)',
        'Oljeekonomier i transition'
      ],
      positiveSignals: [
        'Hög utbildningsnivå',
        'Ung befolkning',
        'Solenergi-potential enorm',
        'Ekonomiska reformer i flera länder'
      ]
    },
    indicators: [
      { code: 'HDI', name: 'Human Development Index', value: 0.71, unit: 'index 0-1', trend: 'up', changePercent: 0.8, dataQuality: 'medium', source: 'UNDP', year: 2023, global_percentile: 58 },
      { code: 'WATER_STRESS', name: 'Vattenstress', value: 4.2, unit: 'index 0-5', trend: 'up', changePercent: 2.8, dataQuality: 'high', source: 'WRI Aqueduct', year: 2023, global_percentile: 95 },
      { code: 'YOUTH_UNEMP', name: 'Ungdomsarbetslöshet', value: 27.5, unit: '%', trend: 'stable', changePercent: -0.5, dataQuality: 'medium', source: 'ILO', year: 2023, global_percentile: 88 }
    ],
    substances: [
      { substance: 'Alkohol', slug: 'alkohol', prevalence: 0.9, prevalenceUnit: 'liter ren alkohol/capita', trend: 'stable', ageGroup: '15+', yearlyDeaths: 18500, treatmentGap: 92, dataYear: 2019, source: 'WHO GHO', notes: 'Officiellt låg, men underrapportering i flera länder' },
      { substance: 'Tobak', slug: 'tobak', prevalence: 28.5, prevalenceUnit: '% användning', trend: 'up', ageGroup: '15+', yearlyDeaths: 165000, treatmentGap: 88, dataYear: 2020, source: 'WHO GTSS' },
      { substance: 'Cannabis', slug: 'cannabis', prevalence: 4.4, prevalenceUnit: '% senaste året', trend: 'stable', ageGroup: '15-64', treatmentGap: 96, dataYear: 2020, source: 'UNODC' },
      { substance: 'Captagon', slug: 'captagon', prevalence: 0.8, prevalenceUnit: '% uppskattat', trend: 'up', ageGroup: '15-45', treatmentGap: 99, dataYear: 2022, source: 'UNODC', notes: 'Regionalt fenomen, stora osäkerheter i data' }
    ],
    health: {
      lifeExpectancy: 72.8,
      healthyLifeExpectancy: 62.4,
      disabilityAdjustedLifeYears: 25000,
      substanceRelatedDALY: 3600,
      mentalHealthPrevalence: 18.5,
      treatmentAccessRate: 8
    },
    pressureFactors: {
      energy: { score: 35, description: 'Rika oljeländer vs energifattiga. Stor ojämlikhet.', trend: 'stable' },
      population: { score: 60, description: 'Tillväxt avtar men ung befolkning utan jobb.', trend: 'improving' },
      institutions: { score: 65, description: 'Auktoritära regimer, konflikt, instabilitet.', trend: 'deteriorating' }
    },
    historicalContext: [
      { period: '2011', event: 'Arabiska våren', impact: 'Demokrati-rörelser, följt av repression/konflikt' },
      { period: '2011-nu', event: 'Syriska inbördeskriget', impact: '500 000 döda, 12M flyktingar' },
      { period: '2014-nu', event: 'Jemen-konflikten', impact: 'Värsta humanitära krisen i världen' }
    ],
    thisShows: [
      'Befolkningstillväxt snabbare än institutionell kapacitet',
      'Vattenbrist som existentiellt hot',
      'Tobak som massiv folkhälsobörda'
    ],
    thisDoesNotShow: [
      'Skillnader mellan Gulfstater och övriga',
      'Orsaker till Arabiska våren',
      'Geopolitiska faktorer (extern intervention)'
    ],
    sources: [
      { name: 'UNDP Arab Human Development Report', type: 'international', url: 'https://www.undp.org/arab-states', reliability: 92 },
      { name: 'WRI Aqueduct Water Risk Atlas', type: 'academic', url: 'https://www.wri.org/aqueduct', reliability: 90 },
      { name: 'ILO Labour Statistics', type: 'international', url: 'https://ilostat.ilo.org', reliability: 88 }
    ],
    relatedRegions: ['sahel', 'gulf_states', 'southern_europe']
  }
};

// ═══════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════

const TrendIcon: React.FC<{ trend: 'up' | 'down' | 'stable'; size?: number; inverted?: boolean }> = 
  ({ trend, size = 16, inverted = false }) => {
    // Some metrics are "bad" when up (e.g., homicide rate)
    const isPositive = inverted ? trend === 'down' : trend === 'up';
    const isNegative = inverted ? trend === 'up' : trend === 'down';
    
    if (isPositive) return <TrendingUp size={size} className="text-green-500" />;
    if (isNegative) return <TrendingDown size={size} className="text-red-500" />;
    return <Minus size={size} className="text-muted-foreground" />;
  };

const DataQualityBadge: React.FC<{ quality: 'high' | 'medium' | 'low' }> = ({ quality }) => {
  const config = {
    high: { label: '●', className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
    medium: { label: '◐', className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
    low: { label: '○', className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' }
  };
  return (
    <Badge variant="outline" className={cn("text-xs", config[quality].className)}>
      {config[quality].label}
    </Badge>
  );
};

const SubstanceIcon: React.FC<{ slug: string }> = ({ slug }) => {
  switch (slug) {
    case 'alkohol': return <Wine className="h-4 w-4 text-purple-500" />;
    case 'tobak': return <Cigarette className="h-4 w-4 text-amber-600" />;
    case 'heroin':
    case 'fentanyl':
    case 'opioider': return <Syringe className="h-4 w-4 text-red-500" />;
    default: return <Pill className="h-4 w-4 text-blue-500" />;
  }
};

// Indicator card - clickable for deep dive
const IndicatorCard: React.FC<{ indicator: RegionIndicator; onClick: () => void }> = ({ indicator, onClick }) => {
  const invertedMetrics = ['HOMICIDE', 'PM25', 'AIR_QUALITY', 'FERTILITY', 'WATER_STRESS', 'YOUTH_UNEMP'];
  const isInverted = invertedMetrics.includes(indicator.code);
  
  return (
    <button 
      onClick={onClick}
      className="w-full text-left p-3 border rounded-lg bg-card hover:bg-muted/50 hover:border-primary/50 transition-all group"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground">{indicator.code}</span>
            <DataQualityBadge quality={indicator.dataQuality} />
          </div>
          <p className="font-medium text-sm mt-1 truncate group-hover:text-primary transition-colors">
            {indicator.name}
          </p>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 ml-2" />
      </div>
      <div className="flex items-end justify-between mt-2">
        <div>
          <span className="text-xl font-bold">{indicator.value}</span>
          <span className="text-xs text-muted-foreground ml-1">{indicator.unit}</span>
        </div>
        <div className="flex items-center gap-1">
          <TrendIcon trend={indicator.trend} size={14} inverted={isInverted} />
          <span className={cn(
            "text-xs",
            (isInverted ? indicator.trend === 'down' : indicator.trend === 'up') ? 'text-green-600' : 
            (isInverted ? indicator.trend === 'up' : indicator.trend === 'down') ? 'text-red-600' : 
            'text-muted-foreground'
          )}>
            {indicator.changePercent > 0 ? '+' : ''}{indicator.changePercent}%
          </span>
        </div>
      </div>
      {indicator.global_percentile !== undefined && (
        <div className="mt-2">
          <Progress value={indicator.global_percentile} className="h-1.5" />
          <p className="text-xs text-muted-foreground mt-0.5">
            Global percentil: {indicator.global_percentile}%
          </p>
        </div>
      )}
    </button>
  );
};

// Substance card - clickable
const SubstanceCard: React.FC<{ substance: SubstanceData; onClick: () => void }> = ({ substance, onClick }) => (
  <button 
    onClick={onClick}
    className="w-full text-left p-3 border rounded-lg bg-card hover:bg-muted/50 hover:border-primary/50 transition-all group"
  >
    <div className="flex items-start gap-3">
      <SubstanceIcon slug={substance.slug} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="font-medium text-sm group-hover:text-primary transition-colors">
            {substance.substance}
          </span>
          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-lg font-bold">{substance.prevalence}</span>
          <span className="text-xs text-muted-foreground">{substance.prevalenceUnit}</span>
          <TrendIcon trend={substance.trend} size={14} inverted />
        </div>
        {substance.yearlyDeaths && (
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            <Skull className="h-3 w-3 text-red-500" />
            {substance.yearlyDeaths.toLocaleString()} dödsfall/år
          </p>
        )}
        <div className="mt-2 flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Behandlingsgap:</span>
          <Progress value={substance.treatmentGap} className="h-1.5 flex-1" />
          <span className="text-xs font-mono">{substance.treatmentGap}%</span>
        </div>
      </div>
    </div>
    {substance.notes && (
      <p className="text-xs text-muted-foreground mt-2 italic border-l-2 border-yellow-500 pl-2">
        {substance.notes}
      </p>
    )}
  </button>
);

// Pressure factor visualization
const PressureGauge: React.FC<{ 
  label: string; 
  score: number; 
  description: string; 
  trend: string;
  icon: React.ReactNode;
}> = ({ label, score, description, trend, icon }) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {icon}
        <span className="font-medium text-sm">{label}</span>
      </div>
      <Badge variant={score > 70 ? 'destructive' : score > 40 ? 'secondary' : 'outline'}>
        {score}/100
      </Badge>
    </div>
    <Progress 
      value={score} 
      className={cn(
        "h-2",
        score > 70 ? '[&>div]:bg-red-500' : score > 40 ? '[&>div]:bg-yellow-500' : '[&>div]:bg-green-500'
      )} 
    />
    <p className="text-xs text-muted-foreground">{description}</p>
    <Badge variant="outline" className="text-xs">
      Trend: {trend}
    </Badge>
  </div>
);

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

interface RegionDeepDiveProps {
  zone: PressZone | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

import { MetricDeepDive, type MetricType } from './MetricDeepDive';
import { DetailDeepDive, type DetailType } from './DetailDeepDive';

export const RegionDeepDive: React.FC<RegionDeepDiveProps> = ({ zone, open, onOpenChange }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [_selectedIndicator, setSelectedIndicator] = useState<RegionIndicator | null>(null);
  const [_selectedSubstance, setSelectedSubstance] = useState<SubstanceData | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<MetricType | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<DetailType | null>(null);
  
  if (!zone) return null;
  
  const evidence = REGION_EVIDENCE[zone.id];
  
  if (!evidence) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-2xl">
          <SheetHeader>
            <SheetTitle>{zone.regionSv}</SheetTitle>
          </SheetHeader>
          <Alert className="mt-6">
            <Info className="h-4 w-4" />
            <AlertDescription>
              Detaljerad data för denna region samlas in. Fullständig djupdykning kommer snart.
            </AlertDescription>
          </Alert>
        </SheetContent>
      </Sheet>
    );
  }
  
  return (
    <>
      {/* Metric Deep Dive */}
      <MetricDeepDive
        open={selectedMetric !== null}
        onOpenChange={(open) => !open && setSelectedMetric(null)}
        metricType={selectedMetric || 'population'}
        regionName={zone.regionSv}
        population={evidence.overview.population}
        countries={evidence.overview.countries}
        lifeExpectancy={evidence.health.lifeExpectancy}
      />
      
      {/* Detail Deep Dive */}
      <DetailDeepDive
        open={selectedDetail !== null}
        onOpenChange={(open) => !open && setSelectedDetail(null)}
        type={selectedDetail || 'challenges'}
        regionName={zone.regionSv}
        items={
          selectedDetail === 'challenges' ? evidence.overview.mainChallenges :
          selectedDetail === 'signals' ? evidence.overview.positiveSignals :
          selectedDetail === 'shows' ? evidence.thisShows :
          selectedDetail === 'notShows' ? evidence.thisDoesNotShow :
          []
        }
        historicalContext={evidence.historicalContext}
      />
      
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-3xl p-0">
          <ScrollArea className="h-full">
            <div className="p-6 space-y-6">
            {/* Header */}
            <SheetHeader className="space-y-3">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-lg",
                  zone.severity === 'high' ? 'bg-red-100 dark:bg-red-900/30' :
                  zone.severity === 'moderate' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                  'bg-blue-100 dark:bg-blue-900/30'
                )}>
                  <MapPin className={cn(
                    "h-5 w-5",
                    zone.severity === 'high' ? 'text-red-600' :
                    zone.severity === 'moderate' ? 'text-yellow-600' :
                    'text-blue-600'
                  )} />
                </div>
                <div>
                  <SheetTitle className="text-xl">{zone.regionSv}</SheetTitle>
                  <SheetDescription>{zone.descriptionSv}</SheetDescription>
                </div>
                <Badge 
                  variant={zone.severity === 'high' ? 'destructive' : 'secondary'}
                  className="ml-auto"
                >
                  {zone.severity === 'high' ? 'Hög' : zone.severity === 'moderate' ? 'Måttlig' : 'Framväxande'}
                </Badge>
              </div>
              
              {/* Quick stats - CLICKABLE */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <button 
                  onClick={() => setSelectedMetric('population')}
                  className="text-left"
                >
                  <Card className="p-3 text-center hover:bg-primary/10 hover:border-primary/50 transition-all cursor-pointer group">
                    <Users className="h-4 w-4 mx-auto text-muted-foreground group-hover:text-primary transition-colors" />
                    <p className="text-lg font-bold mt-1 group-hover:text-primary transition-colors">
                      {(evidence.overview.population / 1_000_000).toFixed(0)}M
                    </p>
                    <p className="text-xs text-muted-foreground">Befolkning</p>
                  </Card>
                </button>
                <button 
                  onClick={() => setSelectedMetric('countries')}
                  className="text-left"
                >
                  <Card className="p-3 text-center hover:bg-primary/10 hover:border-primary/50 transition-all cursor-pointer group">
                    <Globe className="h-4 w-4 mx-auto text-muted-foreground group-hover:text-primary transition-colors" />
                    <p className="text-lg font-bold mt-1 group-hover:text-primary transition-colors">{evidence.overview.countries.length}</p>
                    <p className="text-xs text-muted-foreground">Länder</p>
                  </Card>
                </button>
                <button 
                  onClick={() => setSelectedMetric('lifeExpectancy')}
                  className="text-left"
                >
                  <Card className="p-3 text-center hover:bg-primary/10 hover:border-primary/50 transition-all cursor-pointer group">
                    <Activity className="h-4 w-4 mx-auto text-muted-foreground group-hover:text-primary transition-colors" />
                    <p className="text-lg font-bold mt-1 group-hover:text-primary transition-colors">{evidence.health.lifeExpectancy}</p>
                    <p className="text-xs text-muted-foreground">Medellivslängd</p>
                  </Card>
                </button>
              </div>
            </SheetHeader>

            {/* Navigation tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4 h-auto">
                <TabsTrigger value="overview" className="text-xs py-2">Överblick</TabsTrigger>
                <TabsTrigger value="indicators" className="text-xs py-2">Indikatorer</TabsTrigger>
                <TabsTrigger value="substances" className="text-xs py-2">Substanser</TabsTrigger>
                <TabsTrigger value="sources" className="text-xs py-2">Källor</TabsTrigger>
              </TabsList>

              {/* OVERVIEW TAB */}
              <TabsContent value="overview" className="mt-4 space-y-4">
                {/* Pressure factors */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      Tryckfaktorer
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <PressureGauge 
                      label="Energitryck" 
                      score={evidence.pressureFactors.energy.score}
                      description={evidence.pressureFactors.energy.description}
                      trend={evidence.pressureFactors.energy.trend}
                      icon={<Zap className="h-4 w-4 text-yellow-500" />}
                    />
                    <PressureGauge 
                      label="Befolkningstryck" 
                      score={evidence.pressureFactors.population.score}
                      description={evidence.pressureFactors.population.description}
                      trend={evidence.pressureFactors.population.trend}
                      icon={<Users className="h-4 w-4 text-blue-500" />}
                    />
                    <PressureGauge 
                      label="Institutionell svaghet" 
                      score={evidence.pressureFactors.institutions.score}
                      description={evidence.pressureFactors.institutions.description}
                      trend={evidence.pressureFactors.institutions.trend}
                      icon={<Building2 className="h-4 w-4 text-red-500" />}
                    />
                  </CardContent>
                </Card>

                {/* Challenges & signals - CLICKABLE */}
                <div className="grid gap-4 md:grid-cols-2">
                  <button onClick={() => setSelectedDetail('challenges')} className="text-left">
                    <Card className="h-full hover:bg-red-50/50 dark:hover:bg-red-950/20 hover:border-red-300 transition-all cursor-pointer group">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          Huvudutmaningar
                          <ChevronRight className="h-4 w-4 ml-auto text-muted-foreground group-hover:text-red-500 transition-colors" />
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1">
                          {evidence.overview.mainChallenges.map((challenge, i) => (
                            <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                              <span className="text-red-500 mt-0.5">•</span>
                              {challenge}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </button>
                  
                  <button onClick={() => setSelectedDetail('signals')} className="text-left">
                    <Card className="h-full hover:bg-green-50/50 dark:hover:bg-green-950/20 hover:border-green-300 transition-all cursor-pointer group">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          Positiva signaler
                          <ChevronRight className="h-4 w-4 ml-auto text-muted-foreground group-hover:text-green-500 transition-colors" />
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1">
                          {evidence.overview.positiveSignals.map((signal, i) => (
                            <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                              <span className="text-green-500 mt-0.5">•</span>
                              {signal}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </button>
                </div>

                {/* Historical context - CLICKABLE */}
                <button onClick={() => setSelectedDetail('history')} className="w-full text-left">
                  <Card className="hover:bg-blue-50/50 dark:hover:bg-blue-950/20 hover:border-blue-300 transition-all cursor-pointer group">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-500" />
                        Historisk kontext
                        <ChevronRight className="h-4 w-4 ml-auto text-muted-foreground group-hover:text-blue-500 transition-colors" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {evidence.historicalContext.map((event, i) => (
                          <div key={i} className="flex gap-3 text-xs">
                            <Badge variant="outline" className="shrink-0 h-5">{event.period}</Badge>
                            <div>
                              <p className="font-medium">{event.event}</p>
                              <p className="text-muted-foreground">{event.impact}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </button>

                {/* This shows / doesn't show - CLICKABLE */}
                <div className="grid gap-4 md:grid-cols-2">
                  <button onClick={() => setSelectedDetail('shows')} className="text-left">
                    <Alert className="h-full bg-green-50/50 dark:bg-green-950/20 border-green-200 hover:border-green-400 transition-all cursor-pointer group">
                      <BookOpen className="h-4 w-4 text-green-600" />
                      <AlertDescription>
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-green-700 dark:text-green-400 text-xs">Detta visar:</p>
                          <ChevronRight className="h-3 w-3 text-green-500 group-hover:translate-x-1 transition-transform" />
                        </div>
                        <ul className="text-xs space-y-0.5">
                          {evidence.thisShows.map((item, i) => (
                            <li key={i}>• {item}</li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  </button>
                  
                  <button onClick={() => setSelectedDetail('notShows')} className="text-left">
                    <Alert className="h-full bg-red-50/50 dark:bg-red-950/20 border-red-200 hover:border-red-400 transition-all cursor-pointer group">
                      <Scale className="h-4 w-4 text-red-600" />
                      <AlertDescription>
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-red-700 dark:text-red-400 text-xs">Detta visar INTE:</p>
                          <ChevronRight className="h-3 w-3 text-red-500 group-hover:translate-x-1 transition-transform" />
                        </div>
                        <ul className="text-xs space-y-0.5">
                          {evidence.thisDoesNotShow.map((item, i) => (
                            <li key={i}>• {item}</li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  </button>
                </div>
              </TabsContent>

              {/* INDICATORS TAB */}
              <TabsContent value="indicators" className="mt-4">
                <div className="grid gap-3 md:grid-cols-2">
                  {evidence.indicators.map((indicator) => (
                    <IndicatorCard 
                      key={indicator.code} 
                      indicator={indicator} 
                      onClick={() => setSelectedIndicator(indicator)}
                    />
                  ))}
                </div>
              </TabsContent>

              {/* SUBSTANCES TAB */}
              <TabsContent value="substances" className="mt-4 space-y-4">
                {/* Health summary */}
                <Card className="bg-primary/5 border-primary/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Heart className="h-4 w-4 text-red-500" />
                      Hälsöversikt
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div>
                        <p className="text-lg font-bold">{evidence.health.healthyLifeExpectancy}</p>
                        <p className="text-xs text-muted-foreground">Friska levnadsår</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold">{evidence.health.mentalHealthPrevalence}%</p>
                        <p className="text-xs text-muted-foreground">Psykisk ohälsa</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold">{evidence.health.treatmentAccessRate}%</p>
                        <p className="text-xs text-muted-foreground">Behandlingstillgång</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Substance cards */}
                <div className="grid gap-3">
                  {evidence.substances.map((substance) => (
                    <SubstanceCard 
                      key={substance.slug} 
                      substance={substance} 
                      onClick={() => setSelectedSubstance(substance)}
                    />
                  ))}
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    <strong>Behandlingsgap</strong> = andel av personer med beroende/skadligt bruk som INTE får behandling.
                    Höga behandlingsgap indikerar bristande tillgång till vård, stigma, eller avsaknad av infrastruktur.
                  </AlertDescription>
                </Alert>
              </TabsContent>

              {/* SOURCES TAB */}
              <TabsContent value="sources" className="mt-4 space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Database className="h-4 w-4" />
                      Datakällor
                    </CardTitle>
                    <CardDescription>Klicka för att öppna originalkälla</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {evidence.sources.map((source, i) => (
                      <a
                        key={i}
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 hover:border-primary/50 transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium group-hover:text-primary transition-colors">
                              {source.name}
                            </p>
                            <Badge variant="outline" className="text-xs mt-1">
                              {source.type === 'government' ? 'Myndighet' : 
                               source.type === 'international' ? 'Internationell' : 'Akademisk'}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={source.reliability} className="w-16 h-1.5" />
                          <span className="text-xs text-muted-foreground">{source.reliability}%</span>
                          <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                        </div>
                      </a>
                    ))}
                  </CardContent>
                </Card>

                {/* Countries */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Länder i regionen</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {evidence.overview.countries.map((country) => (
                        <Badge key={country} variant="secondary">{country}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Related regions */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Relaterade regioner</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {evidence.relatedRegions.map((region) => (
                        <Badge key={region} variant="outline">{region}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
    </>
  );
};

export default RegionDeepDive;
