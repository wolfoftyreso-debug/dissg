/**
 * EXPANDABLE INDICATOR BADGE
 * 
 * "Zero Dead-Ends" Policy - Varje indikator är klickbar
 * och leder till fullständig fördjupning.
 * 
 * Designprincip: Inga ikoner, endast text och semantisk färgkodning.
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

// ═══════════════════════════════════════════════════════════════
// INDICATOR EVIDENCE REGISTRY
// ═══════════════════════════════════════════════════════════════

export interface IndicatorEvidence {
  code: string;
  name: string;
  nameSv: string;
  unit?: string;
  
  // Core definition
  definition: string;
  whyItMatters: string;
  howItsMeasured: string;
  
  // Scientific basis
  scientificBasis: string;
  keyStudies: Array<{
    title: string;
    authors: string;
    year: number;
    finding: string;
    url?: string;
  }>;
  
  // Context
  globalRange: {
    min: number;
    max: number;
    median: number;
    unit: string;
  };
  historicalTrend: string;
  
  // Connections
  relatedIndicators: string[];
  drivingFactors: string[];
  
  // Limitations
  limitations: string[];
  dataQualityNotes: string;
  
  // Domain
  domain: 'energy' | 'ecology' | 'economy' | 'health' | 'social';
}

const INDICATOR_EVIDENCE_REGISTRY: Record<string, IndicatorEvidence> = {
  'ENERGY_PER_CAPITA': {
    code: 'ENERGY_PER_CAPITA',
    name: 'Energy Per Capita',
    nameSv: 'Energi per capita',
    unit: 'kWh/person/år',
    definition: 'Total primär energianvändning dividerat med befolkning. Inkluderar all energi: el, värme, transporter, industri.',
    whyItMatters: 'Energi är den fundamentala kapaciteten som möjliggör all ekonomisk aktivitet och materiell välfärd. Historiskt korrelerar energianvändning starkt med livskvalitet upp till ca 100-150 GJ/capita.',
    howItsMeasured: 'Primär energiförbrukning från nationell statistik (IEA, nationella energimyndigheter) dividerat med befolkning. Konverteras till gemensam enhet (kWh eller GJ).',
    scientificBasis: 'Termodynamikens lagar: all fysisk transformation kräver energi. Bevisat samband mellan energiflöde och ekonomisk produktion (Hall & Klitgaard 2018).',
    keyStudies: [
      {
        title: 'Energy and the Wealth of Nations',
        authors: 'Hall, C.A.S. & Klitgaard, K.',
        year: 2018,
        finding: 'BNP korrelerar med energianvändning med r² > 0.9. "Decoupling" är extremt sällsynt historiskt.',
        url: 'https://link.springer.com/book/10.1007/978-3-319-66219-0'
      },
      {
        title: 'A Minimal Model for Human and Nature Interaction',
        authors: 'Motesharrei et al.',
        year: 2014,
        finding: 'Energiresurser är centrala för civilisationers stabilitet och kollaps.',
      }
    ],
    globalRange: {
      min: 200,
      max: 80000,
      median: 20000,
      unit: 'kWh/capita'
    },
    historicalTrend: 'Global snitt har ökat från ~5000 kWh (1970) till ~22000 kWh (2020). Ojämn fördelning: OECD använder 3-10x mer än låginkomstländer.',
    relatedIndicators: ['EROI', 'CO2_PER_CAPITA', 'GDP_PER_CAPITA', 'HDI'],
    drivingFactors: ['Teknologisk utveckling', 'Industristruktur', 'Klimat', 'Levnadsstandard'],
    limitations: [
      'Säger inget om energikälla (fossil vs förnybar)',
      'Högt värde garanterar inte välfördelad välfärd',
      'Effektivitet kan variera kraftigt',
      'Inbäddad energi i import fångas ej'
    ],
    dataQualityNotes: 'Hög kvalitet för OECD-länder. Lägre för utvecklingsländer, särskilt informell sektor.',
    domain: 'energy'
  },
  
  'BIOCAPACITY': {
    code: 'BIOCAPACITY',
    name: 'Biocapacity',
    nameSv: 'Biokapacitet',
    unit: 'gha/person',
    definition: 'Den produktiva yta (globala hektar) som ett territorium har för att producera biologiska resurser och absorbera avfall, främst koldioxid.',
    whyItMatters: 'Definierar den ekologiska budgeten – hur mycket biologisk produktion naturen kan leverera hållbart. Överskott tillåter "sparande", underskott innebär ekologisk skuld.',
    howItsMeasured: 'National Footprint and Biocapacity Accounts (NFA). Beräknas från jordbruksmark, skog, fiskevatten, bebyggd mark och kolabsorption.',
    scientificBasis: 'Ekologisk ekonomi: ekonomin är ett subsystem av biosfären. Inspirerat av H.T. Odums systemekologi och Daly\'s steady-state economics.',
    keyStudies: [
      {
        title: 'National Footprint Accounts',
        authors: 'Global Footprint Network',
        year: 2023,
        finding: 'Mänskligheten använder 1.7 jordklot per år. Biokapaciteten är ojämnt fördelad.',
        url: 'https://www.footprintnetwork.org/'
      },
      {
        title: 'The Ecological Footprint: A Response to the Critiques',
        authors: 'Wackernagel et al.',
        year: 2019,
        finding: 'Metoden är robust för att visa trender trots osäkerheter i absoluta värden.',
      }
    ],
    globalRange: {
      min: 0.1,
      max: 20,
      median: 1.6,
      unit: 'gha/capita'
    },
    historicalTrend: 'Global biokapacitet per capita har halverats sedan 1960 pga befolkningstillväxt. Absolut biokapacitet relativt stabil men under press från klimatförändringar.',
    relatedIndicators: ['ECOLOGICAL_FOOTPRINT', 'FOREST_COVER', 'ARABLE_LAND', 'CO2_ABSORPTION'],
    drivingFactors: ['Markanvändning', 'Skogsareal', 'Jordbruksproduktivitet', 'Befolkningstäthet'],
    limitations: [
      'Aggregerar olika ekosystemtjänster',
      'Kolabsorption dominerar ofta beräkningen',
      'Kvalitativa aspekter (biodiversitet) fångas ej',
      'Regional variation inom länder visas ej'
    ],
    dataQualityNotes: 'Modellbaserad beräkning med global standardisering. Osäkerhet ±10-20% på nationell nivå.',
    domain: 'ecology'
  },
  
  'ECOLOGICAL_FOOTPRINT': {
    code: 'ECOLOGICAL_FOOTPRINT',
    name: 'Ecological Footprint',
    nameSv: 'Ekologiskt fotavtryck',
    unit: 'gha/person',
    definition: 'Den produktiva yta (globala hektar) som krävs för att producera de resurser en befolkning konsumerar och absorbera dess avfall.',
    whyItMatters: 'Visar om en befolkning lever inom sin ekologiska budget. Jämförelse med biokapacitet avgör hållbarhet: Fotavtryck > Biokapacitet = ekologiskt underskott.',
    howItsMeasured: 'National Footprint Accounts summerar markanvändning för: jordbruk, boskap, fiske, skog, bebyggd mark och koldioxidabsorption.',
    scientificBasis: 'Mathis Wackernagel och William Rees utvecklade konceptet 1990. Baseras på biogeokemiska flöden och regenereringskapacitet.',
    keyStudies: [
      {
        title: 'Our Ecological Footprint',
        authors: 'Wackernagel, M. & Rees, W.',
        year: 1996,
        finding: 'Introducerade begreppet och visade att industriländer överstiger sin rättvisa andel.',
      },
      {
        title: 'Earth Overshoot Day',
        authors: 'Global Footprint Network',
        year: 2023,
        finding: '2023 års resurser var förbrukade 2 augusti. Datumet har flyttat framåt sedan 1970.',
        url: 'https://www.overshootday.org/'
      }
    ],
    globalRange: {
      min: 0.5,
      max: 15,
      median: 2.8,
      unit: 'gha/capita'
    },
    historicalTrend: 'Globalt snitt har ökat från ~2.5 gha (1970) till ~2.8 gha (2020). Mänskligheten gick i ekologiskt underskott ca 1970.',
    relatedIndicators: ['BIOCAPACITY', 'CARBON_FOOTPRINT', 'MATERIAL_FOOTPRINT', 'WATER_FOOTPRINT'],
    drivingFactors: ['Konsumtionsmönster', 'Koldioxidutsläpp', 'Matproduktion', 'Boendeyta'],
    limitations: [
      'Kolabsorption utgör 60% av fotavtrycket för rika länder',
      'Biodiversitet och vattenkvalitet fångas ej',
      'Aggregering döljer specifika problem',
      'Kontrafaktisk fråga: hur stor yta "behövs"?'
    ],
    dataQualityNotes: 'Globalt standardiserad metodik. Osäkerhet störst för kolkomponenten. Årlig uppdatering.',
    domain: 'ecology'
  },
  
  'EROI': {
    code: 'EROI',
    name: 'Energy Return on Investment',
    nameSv: 'Energiavkastning på investering',
    unit: 'ratio (x:1)',
    definition: 'Förhållandet mellan energi som erhålls från en källa och energi som investeras för att utvinna den. EROI 10:1 innebär att 10 enheter energi erhålls för varje investerad enhet.',
    whyItMatters: 'Definierar hur mycket "nettoenergi" samhället har tillgängligt för icke-energiändamål. Låg EROI innebär att mer resurser måste läggas på energiförsörjning, mindre på allt annat.',
    howItsMeasured: 'Energiinput (prospektering, utvinning, raffinering, transport) dividerat med energioutput. Varierande systemgränser gör jämförelser svåra.',
    scientificBasis: 'Biofysisk ekonomi. Charles Hall formaliserade begreppet i 1970-talet. Grundat i termodynamik och systemekologi.',
    keyStudies: [
      {
        title: 'EROI of different fuels and the implications for society',
        authors: 'Hall, Lambert & Balogh',
        year: 2014,
        finding: 'Samhällen kräver minimum EROI ~5:1 för att fungera. Moderna industrisamhällen behöver ~10-15:1.',
      },
      {
        title: 'Energy and the Wealth of Nations',
        authors: 'Hall & Klitgaard',
        year: 2018,
        finding: 'Fallande EROI för fossil energi skapar ekonomiska utmaningar ("energy squeeze").',
      }
    ],
    globalRange: {
      min: 1,
      max: 100,
      median: 15,
      unit: 'ratio'
    },
    historicalTrend: 'EROI för olja: ~100:1 (1930) → ~15:1 (idag). Kol relativt stabilt ~30-50:1. Sol/vind ca 10-20:1 men stigande med teknikutveckling.',
    relatedIndicators: ['ENERGY_PER_CAPITA', 'ENERGY_INTENSITY', 'FOSSIL_SHARE', 'RENEWABLE_SHARE'],
    drivingFactors: ['Resurskvalitet', 'Teknologi', 'Tillgänglighet', 'Infrastruktur'],
    limitations: [
      'Systemgränser varierar mellan studier',
      'Svårt att jämföra olika energikällor rättvist',
      'EROI för sol/vind debatteras pga lagrings-/intermittensfrågor',
      'Indirekt energi svår att mäta'
    ],
    dataQualityNotes: 'Metodologisk osäkerhet stor. Olika studier ger olika värden för samma källa. Trender mer pålitliga än absoluta värden.',
    domain: 'energy'
  },
  
  'FERTILITY_RATE': {
    code: 'FERTILITY_RATE',
    name: 'Total Fertility Rate',
    nameSv: 'Summerad fruktsamhet',
    unit: 'barn/kvinna',
    definition: 'Genomsnittligt antal barn en kvinna förväntas föda under sin livstid, givet nuvarande åldersspecifika födelsetal.',
    whyItMatters: 'Avgör långsiktig befolkningsutveckling. TFR ~2.1 = ersättningsnivå. Under 2.1 = befolkningsminskning, över = tillväxt.',
    howItsMeasured: 'Summering av åldersspecifika födelsetal (ASFR) för kvinnor 15-49 år. Data från folkbokföring, enkäter (DHS) eller FN-estimat.',
    scientificBasis: 'Demografisk transitionsteori: ekonomisk utveckling, urbanisering och kvinnors utbildning driver fertilitetsfall.',
    keyStudies: [
      {
        title: 'Demographic Transition Theory',
        authors: 'Notestein, F.',
        year: 1945,
        finding: 'Industrialisering driver förändring från hög dödlighet/fertilitet till låg.',
      },
      {
        title: 'World Population Prospects',
        authors: 'UN DESA',
        year: 2022,
        finding: 'Global TFR fallit från 5.0 (1950) till 2.3 (2022). Fortsatt fall förväntas.',
        url: 'https://population.un.org/wpp/'
      }
    ],
    globalRange: {
      min: 0.8,
      max: 7.0,
      median: 2.3,
      unit: 'barn/kvinna'
    },
    historicalTrend: 'Dramatiskt fall globalt. Europa, Ostasien under 1.5. Afrika söder om Sahara fortfarande ~4.5. Konvergens förväntas.',
    relatedIndicators: ['POPULATION_GROWTH', 'MEDIAN_AGE', 'DEPENDENCY_RATIO', 'FEMALE_EDUCATION'],
    drivingFactors: ['Kvinnors utbildning', 'Tillgång till preventivmedel', 'Urbanisering', 'Barnöverlevnad'],
    limitations: [
      'Visar inte timing av barnafödande',
      'Påverkas av åldersstruktur vid jämförelse',
      'Förändras snabbt – ögonblicksvärde',
      'Kulturella faktorer svåra att kvantifiera'
    ],
    dataQualityNotes: 'Hög kvalitet för länder med folkbokföring. Modellbaserade estimat för många utvecklingsländer.',
    domain: 'social'
  },
  
  'POPULATION_GROWTH': {
    code: 'POPULATION_GROWTH',
    name: 'Population Growth Rate',
    nameSv: 'Befolkningstillväxt',
    unit: '%/år',
    definition: 'Årlig procentuell förändring av befolkningen, inklusive födslar, dödsfall och nettomigration.',
    whyItMatters: 'Avgör framtida befolkningsstorlek och åldersstruktur. Hög tillväxt skapar tryck på resurser och infrastruktur. Negativ tillväxt skapar åldrande samhällen.',
    howItsMeasured: '((Befolkning år n+1 / Befolkning år n) - 1) × 100. Data från folkräkningar och vitala händelseregister.',
    scientificBasis: 'Exponentiell matematik: P(t) = P₀ × e^(rt). Även små tillväxttal ger stora förändringar över tid.',
    keyStudies: [
      {
        title: 'The Population Bomb',
        authors: 'Ehrlich, P.',
        year: 1968,
        finding: 'Varnade för befolkningsexplosion (delvis fel prognos men väckte debatt).',
      },
      {
        title: 'World Population Prospects 2022',
        authors: 'UN DESA',
        year: 2022,
        finding: 'Global tillväxt avtar: från 2.1%/år (1968) till 0.9%/år (2022). Topp ~2080.',
        url: 'https://population.un.org/wpp/'
      }
    ],
    globalRange: {
      min: -2.0,
      max: 4.0,
      median: 0.9,
      unit: '%/år'
    },
    historicalTrend: 'Topp vid ~2.1%/år (1968). Nu under 1%/år och fallande. Negativ tillväxt i 30+ länder.',
    relatedIndicators: ['FERTILITY_RATE', 'LIFE_EXPECTANCY', 'MIGRATION_RATE', 'CARRYING_CAPACITY'],
    drivingFactors: ['Fertilitet', 'Mortalitet', 'Migration', 'Hälsosystem'],
    limitations: [
      'Nationella siffror döljer regional variation',
      'Migration skapar stora årliga fluktuationer',
      'Historiska data osäkra för många länder'
    ],
    dataQualityNotes: 'Hög osäkerhet för länder utan folkbokföring. FN:s estimat har konfidensintervall.',
    domain: 'social'
  },
  
  'CARRYING_CAPACITY': {
    code: 'CARRYING_CAPACITY',
    name: 'Human Carrying Capacity',
    nameSv: 'Mänsklig bärkraft',
    unit: 'miljarder människor',
    definition: 'Det maximala antal människor som kan försörjas uthålligt av Jordens resurser, givet antagna konsumtionsmönster och teknologi.',
    whyItMatters: 'Central fråga för hållbarhet: är vi för många? Svaret beror kritiskt på hur vi lever, inte bara hur många vi är.',
    howItsMeasured: 'Modellbaserade estimat som varierar kraftigt (2-15 miljarder) beroende på antaganden om kost, energi, jämlikhet.',
    scientificBasis: 'Ekologisk bärkraft: K i logistisk tillväxt. Tillämpat på människor av Ehrlich, Meadows, och biofysiska ekonomer.',
    keyStudies: [
      {
        title: 'How Many People Can the Earth Support?',
        authors: 'Cohen, J.',
        year: 1995,
        finding: 'Sammanställde 65 estimat: 2-15 miljarder. Visar att K beror på val, inte bara fysik.',
      },
      {
        title: 'Limits to Growth: The 30-Year Update',
        authors: 'Meadows et al.',
        year: 2004,
        finding: 'Hållbar befolkning kräver betydande konsumtionsminskning i rika länder.',
      }
    ],
    globalRange: {
      min: 2,
      max: 15,
      median: 8,
      unit: 'miljarder'
    },
    historicalTrend: 'Teknologi har höjt K historiskt (jordbruksrevolution, fossilera). Frågan är om nuvarande K kan upprätthållas.',
    relatedIndicators: ['ECOLOGICAL_FOOTPRINT', 'BIOCAPACITY', 'ENERGY_PER_CAPITA', 'FERTILITY_RATE'],
    drivingFactors: ['Konsumtionsmönster', 'Tekniknivå', 'Fördelning', 'Ekosystemhälsa'],
    limitations: [
      'Inte ett fixerat tal – beror på antaganden',
      'Kvalitativa aspekter (frihet, kultur) fångas ej',
      'Osäkerhet om teknologisk utveckling',
      'Etiska frågor: vems konsumtionsnivå?'
    ],
    dataQualityNotes: 'Modellbaserat koncept, inte mätbar empirisk storhet. Stor osäkerhet är inneboende.',
    domain: 'ecology'
  },
  
  'DEPENDENCY_RATIO': {
    code: 'DEPENDENCY_RATIO',
    name: 'Age Dependency Ratio',
    nameSv: 'Försörjningskvot',
    unit: 'per 100 i arbetsför ålder',
    definition: 'Antal personer under 15 och över 64 år per 100 personer i arbetsför ålder (15-64). Visar "försörjningsbörda".',
    whyItMatters: 'Påverkar ekonomisk produktivitet, pensionssystem och vårdbehov. Höga värden = fler som ska försörjas av färre.',
    howItsMeasured: '((Befolkning 0-14 + Befolkning 65+) / Befolkning 15-64) × 100',
    scientificBasis: 'Demografisk ekonomi. Låg kvot = "demografisk bonus" som drev Asiens tillväxt 1970-2010.',
    keyStudies: [
      {
        title: 'The Demographic Dividend',
        authors: 'Bloom & Williamson',
        year: 1998,
        finding: 'Fallande försörjningskvot förklarar 1/3 av Ostasiens ekonomiska mirakel.',
      }
    ],
    globalRange: {
      min: 35,
      max: 100,
      median: 55,
      unit: 'per 100'
    },
    historicalTrend: 'Fallande globalt (mindre barnförsörjning) men stigande i rika länder (mer äldreförsörjning). Japan redan >70.',
    relatedIndicators: ['MEDIAN_AGE', 'FERTILITY_RATE', 'LIFE_EXPECTANCY', 'LABOUR_PARTICIPATION'],
    drivingFactors: ['Fertilitet', 'Dödlighet', 'Pensionsålder', 'Migration'],
    limitations: [
      'Alla 15-64-åringar arbetar inte',
      'Många 65+ är ekonomiskt aktiva',
      'Informell ekonomi fångas ej',
      'Produktivitet varierar'
    ],
    dataQualityNotes: 'Hög kvalitet i länder med folkbokföring. Osäker i länder med svaga register.',
    domain: 'social'
  }
};

// ═══════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════

const getDomainLabel = (domain: IndicatorEvidence['domain']) => {
  switch (domain) {
    case 'energy': return 'ENERGI';
    case 'ecology': return 'EKOLOGI';
    case 'economy': return 'EKONOMI';
    case 'health': return 'HÄLSA';
    case 'social': return 'SOCIAL';
  }
};

const getDomainStyle = (domain: IndicatorEvidence['domain']) => {
  switch (domain) {
    case 'energy': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
    case 'ecology': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    case 'economy': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    case 'health': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    case 'social': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
  }
};

// ═══════════════════════════════════════════════════════════════
// EXPANDABLE INDICATOR BADGE COMPONENT
// ═══════════════════════════════════════════════════════════════

export interface ExpandableIndicatorBadgeProps {
  /** Indicator code (e.g., 'ENERGY_PER_CAPITA') */
  code: string;
  /** Optional display name override */
  displayName?: string;
  /** Optional unit to show */
  unit?: string;
  /** Additional className */
  className?: string;
}

export const ExpandableIndicatorBadge: React.FC<ExpandableIndicatorBadgeProps> = ({
  code,
  displayName,
  unit,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Normalize code for lookup
  const normalizedCode = code.toUpperCase().replace(/\s+/g, '_');
  const evidence = INDICATOR_EVIDENCE_REGISTRY[normalizedCode];
  
  const hasEvidence = !!evidence;
  const name = displayName || evidence?.nameSv || code.replace(/_/g, ' ');
  const displayUnit = unit || evidence?.unit;
  
  if (!hasEvidence) {
    // Fallback: just a badge with hover state
    return (
      <Badge 
        variant="outline" 
        className={cn(
          "cursor-default",
          className
        )}
      >
        {name}
        {displayUnit && <span className="text-muted-foreground ml-1">({displayUnit})</span>}
      </Badge>
    );
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Badge 
          variant="outline" 
          className={cn(
            "cursor-pointer hover:bg-primary/10 transition-colors",
            "border-dashed hover:border-solid",
            className
          )}
        >
          <span className="font-mono text-xs">{name}</span>
          {displayUnit && <span className="text-muted-foreground ml-1">({displayUnit})</span>}
          <span className="ml-1 opacity-50">→</span>
        </Badge>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 flex-wrap">
            <span className="font-mono">{evidence.code}</span>
            <Badge className={getDomainStyle(evidence.domain)}>
              {getDomainLabel(evidence.domain)}
            </Badge>
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {evidence.nameSv} • {evidence.unit}
          </p>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          {/* Definition */}
          <Card>
            <CardHeader className="pb-2 pt-3">
              <CardTitle className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                DEFINITION
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-3">
              <p className="text-sm">{evidence.definition}</p>
            </CardContent>
          </Card>
          
          {/* Why It Matters */}
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="pb-2 pt-3">
              <CardTitle className="text-xs font-mono uppercase tracking-wider text-primary">
                VARFÖR DET SPELAR ROLL
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-3">
              <p className="text-sm">{evidence.whyItMatters}</p>
            </CardContent>
          </Card>
          
          {/* How It's Measured */}
          <Card>
            <CardHeader className="pb-2 pt-3">
              <CardTitle className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                HUR DET MÄTS
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-3">
              <p className="text-sm">{evidence.howItsMeasured}</p>
            </CardContent>
          </Card>
          
          {/* Global Range */}
          <Card className="bg-muted/30">
            <CardHeader className="pb-2 pt-3">
              <CardTitle className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                GLOBALT INTERVALL
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-lg font-mono font-bold">{evidence.globalRange.min}</p>
                  <p className="text-xs text-muted-foreground">MIN</p>
                </div>
                <div>
                  <p className="text-lg font-mono font-bold text-primary">{evidence.globalRange.median}</p>
                  <p className="text-xs text-muted-foreground">MEDIAN</p>
                </div>
                <div>
                  <p className="text-lg font-mono font-bold">{evidence.globalRange.max}</p>
                  <p className="text-xs text-muted-foreground">MAX</p>
                </div>
              </div>
              <p className="text-xs text-center text-muted-foreground mt-2">{evidence.globalRange.unit}</p>
            </CardContent>
          </Card>
          
          {/* Historical Trend */}
          <Card>
            <CardHeader className="pb-2 pt-3">
              <CardTitle className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                HISTORISK TREND
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-3">
              <p className="text-sm">{evidence.historicalTrend}</p>
            </CardContent>
          </Card>
          
          {/* Scientific Basis */}
          <Card>
            <CardHeader className="pb-2 pt-3">
              <CardTitle className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                VETENSKAPLIG GRUND
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-3">
              <p className="text-sm">{evidence.scientificBasis}</p>
            </CardContent>
          </Card>
          
          {/* Key Studies */}
          <Card>
            <CardHeader className="pb-2 pt-3">
              <CardTitle className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                NYCKELSTUDIER ({evidence.keyStudies.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-3 space-y-3">
              {evidence.keyStudies.map((study, idx) => (
                <div key={idx} className="p-2 bg-muted/30 rounded text-sm">
                  <p className="font-medium">{study.title} ({study.year})</p>
                  <p className="text-xs text-muted-foreground">{study.authors}</p>
                  <p className="text-xs mt-1">{study.finding}</p>
                  {study.url && (
                    <Button variant="link" size="sm" className="h-auto p-0 mt-1" asChild>
                      <a href={study.url} target="_blank" rel="noopener noreferrer">
                        Läs mer →
                      </a>
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
          
          <Separator />
          
          {/* Related Indicators */}
          <div>
            <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
              RELATERADE INDIKATORER
            </p>
            <div className="flex flex-wrap gap-1.5">
              {evidence.relatedIndicators.map((rel) => (
                <Badge key={rel} variant="secondary" className="font-mono text-xs">
                  {rel}
                </Badge>
              ))}
            </div>
          </div>
          
          {/* Driving Factors */}
          <div>
            <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
              DRIVANDE FAKTORER
            </p>
            <div className="flex flex-wrap gap-1.5">
              {evidence.drivingFactors.map((factor) => (
                <Badge key={factor} variant="outline" className="text-xs">
                  {factor}
                </Badge>
              ))}
            </div>
          </div>
          
          <Separator />
          
          {/* Limitations */}
          <Card className="bg-amber-50/30 dark:bg-amber-950/10 border-amber-200/50">
            <CardHeader className="pb-2 pt-3">
              <CardTitle className="text-xs font-mono uppercase tracking-wider text-amber-700 dark:text-amber-400">
                BEGRÄNSNINGAR
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-3">
              <ul className="space-y-1">
                {evidence.limitations.map((lim, idx) => (
                  <li key={idx} className="text-xs flex items-start gap-1.5">
                    <span className="text-amber-500 mt-0.5">•</span>
                    {lim}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          {/* Data Quality */}
          <Card className="bg-muted/20">
            <CardHeader className="pb-2 pt-3">
              <CardTitle className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                DATAKVALITET
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-3">
              <p className="text-xs">{evidence.dataQualityNotes}</p>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Export registry for external use
export { INDICATOR_EVIDENCE_REGISTRY };
