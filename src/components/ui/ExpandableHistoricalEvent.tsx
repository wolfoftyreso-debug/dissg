/**
 * EXPANDABLE HISTORICAL EVENT
 * 
 * "Zero Dead-Ends" Policy - Varje historisk milstolpe är klickbar
 * och leder till fullskalig fördjupning.
 * 
 * Designprincip: Historia som process, inte isolerade händelser.
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

// ═══════════════════════════════════════════════════════════════
// HISTORICAL EVENTS REGISTRY
// ═══════════════════════════════════════════════════════════════

export interface HistoricalEventDetail {
  id: string;
  year: number;
  event: string;
  significance: string;
  
  // Deep dive content
  fullDescription: string;
  keyActors: string[];
  mainFindings?: string[];
  howItChangedThinking: string;
  legacyToday: string;
  criticisms?: string[];
  
  // References
  primarySource?: {
    title: string;
    url?: string;
    authors?: string;
  };
  relatedEvents?: string[];
  
  // Context
  category: 'sustainability' | 'population' | 'energy' | 'climate' | 'economy';
}

const HISTORICAL_EVENT_REGISTRY: Record<string, HistoricalEventDetail> = {
  // Sustainability & Limits
  'limits-to-growth-1972': {
    id: 'limits-to-growth-1972',
    year: 1972,
    event: 'Limits to Growth publiceras',
    significance: 'Första systemdynamiska modellen av globala resursbegränsningar',
    category: 'sustainability',
    fullDescription: 'Rapporten "The Limits to Growth" beställdes av Club of Rome och författades av ett team på MIT under ledning av Donella och Dennis Meadows. Med hjälp av datorsimulering (World3-modellen) visade de hur exponentiell tillväxt i befolkning och ekonomi oundvikligen kolliderar med planetens ändliga resurser.',
    keyActors: [
      'Donella H. Meadows (huvudförfattare)',
      'Dennis L. Meadows (projektledare)',
      'Jørgen Randers (medförfattare)',
      'Club of Rome (uppdragsgivare)',
      'Jay Forrester (systemdynamikens grundare, mentor)'
    ],
    mainFindings: [
      'Exponentiell tillväxt är ohållbar i ett ändligt system',
      '12 scenarion modellerades – de flesta ledde till kollaps före 2100',
      'Tidiga åtgärder är kritiska pga tidsfördröjningar i systemet',
      'Teknologi kan fördröja men inte eliminera fysiska gränser'
    ],
    howItChangedThinking: 'Första gången "tillväxtparadigmet" utmanades vetenskapligt. Introducerade systemdynamik i miljödebatten och visade att isolerade beslut skapar oavsedda konsekvenser i komplexa system.',
    legacyToday: '30-årsuppföljningen (2004) visade att originalscenarierna i stort sett följt verkligheten. Modellen används fortfarande som referens för hållbarhetsstudier och ligger till grund för begreppet "overshoot".',
    criticisms: [
      'Kritiserades för "malthusiansk pessimism"',
      'Anklagades för att underskatta teknologisk utveckling',
      'Modellen saknade regional detalj',
      'Ekonomer kritiserade avsaknaden av prissignaler'
    ],
    primarySource: {
      title: 'The Limits to Growth (1972)',
      url: 'https://www.clubofrome.org/publication/the-limits-to-growth/',
      authors: 'Meadows, Meadows, Randers & Behrens'
    },
    relatedEvents: ['brundtland-1987', 'planetary-boundaries-2009']
  },
  
  'brundtland-1987': {
    id: 'brundtland-1987',
    year: 1987,
    event: 'Brundtlandkommissionen',
    significance: 'Hållbar utveckling definieras som begrepp',
    category: 'sustainability',
    fullDescription: 'Världskommissionen för miljö och utveckling, ledd av Norges statsminister Gro Harlem Brundtland, publicerade rapporten "Vår gemensamma framtid". Rapporten myntade begreppet "hållbar utveckling" och argumenterade för att ekonomisk tillväxt och miljöskydd kan förenas.',
    keyActors: [
      'Gro Harlem Brundtland (ordförande)',
      'Mansour Khalid (vice ordförande)',
      'FN:s generalförsamling (uppdragsgivare)',
      '21 kommissionärer från olika länder'
    ],
    mainFindings: [
      'Definitionen: "Utveckling som tillfredsställer nuvarande generationers behov utan att äventyra framtida generationers möjligheter"',
      'Miljö och utveckling är oupplösligt sammankopplade',
      'Fattigdom är en huvudorsak till miljöförstöring',
      'Internationellt samarbete är nödvändigt'
    ],
    howItChangedThinking: 'Skapade ett politiskt användbart ramverk som kunde enas om. Kompromissen mellan miljö och ekonomi möjliggjorde bred uppslutning men kritiserades senare för vaghet.',
    legacyToday: 'Begreppet "hållbar utveckling" genomsyrar idag all miljöpolitik, FN:s Agenda 2030 och SDG:erna. Kritiker menar att det legitimerat fortsatt tillväxt under grön fasad.',
    criticisms: [
      'Definitionen är tillräckligt vag för att tolkas hur som helst',
      'Ignorerar trade-offs mellan ekonomi och ekologi',
      '"Svag hållbarhet" tillåter substitution av naturkapital',
      'Skapade illusion av att allt kan förenas'
    ],
    primarySource: {
      title: 'Vår gemensamma framtid (Our Common Future)',
      url: 'https://sustainabledevelopment.un.org/milestones/wced',
      authors: 'World Commission on Environment and Development'
    },
    relatedEvents: ['limits-to-growth-1972', 'rio-1992']
  },
  
  'planetary-boundaries-2009': {
    id: 'planetary-boundaries-2009',
    year: 2009,
    event: 'Planetary Boundaries introduceras',
    significance: 'Stockholm Resilience Centre kvantifierar säkra gränser',
    category: 'sustainability',
    fullDescription: 'Johan Rockström och kollegor vid Stockholm Resilience Centre publicerade ramverket "Planetary Boundaries" i Nature. Det identifierar nio jordsystemprocesser med gränser som definierar ett "säkert operationsutrymme" för mänskligheten.',
    keyActors: [
      'Johan Rockström (huvudförfattare)',
      'Will Steffen (medförfattare)',
      'Stockholm Resilience Centre',
      'Katherine Richardson',
      'Hans Joachim Schellnhuber'
    ],
    mainFindings: [
      'Nio planetära gränser identifierade',
      'Klimat och biologisk mångfald är "kärngränser" som påverkar alla andra',
      'Fyra gränser var redan överskridna (2015-uppdatering)',
      'Gränserna interagerar – att överskrida en destabiliserar andra'
    ],
    howItChangedThinking: 'Flyttade fokus från enskilda miljöproblem till jordsystemet som helhet. Kvantifiering möjliggjorde mätbara mål och Science Based Targets-rörelsen.',
    legacyToday: 'Ramverket används av företag (SBTi), regeringar och i forskning. 2023-uppdateringen visar att sex av nio gränser nu är överskridna.',
    criticisms: [
      'Exakta tröskelvärden är osäkra',
      'Regional variation fångas inte',
      'Politiskt normativt – "säkert" kräver värderingar',
      'Vissa gränser (t.ex. nya kemikalier) är svåra att kvantifiera'
    ],
    primarySource: {
      title: 'Planetary Boundaries: Exploring the Safe Operating Space for Humanity',
      url: 'https://www.nature.com/articles/461472a',
      authors: 'Rockström et al., Nature 2009'
    },
    relatedEvents: ['limits-to-growth-1972', 'paris-2015']
  },
  
  'paris-2015': {
    id: 'paris-2015',
    year: 2015,
    event: 'Parisavtalet',
    significance: 'Global konsensus om klimatbegränsningar',
    category: 'climate',
    fullDescription: 'Vid COP21 i Paris enades 196 länder om ett juridiskt bindande avtal för att begränsa global uppvärmning till "väl under 2°C" med strävan mot 1.5°C jämfört med förindustriell nivå. Avtalet bygger på nationellt bestämda bidrag (NDC) med regelbunden skärpning.',
    keyActors: [
      'Laurent Fabius (COP21-ordförande)',
      'Christiana Figueres (UNFCCC)',
      'Ban Ki-moon (FN:s generalsekreterare)',
      'Barack Obama, Xi Jinping (USA-Kina-överenskommelse)',
      'Marshall Islands (drev på 1.5°C-målet)'
    ],
    mainFindings: [
      'Mål: Begränsa uppvärmning till väl under 2°C, sträva mot 1.5°C',
      'Globala utsläpp ska nå topp "så snart som möjligt"',
      'Netto-noll i andra halvan av seklet',
      'Rika länder ska stödja fattigare med 100 miljarder USD/år',
      'Femårscykler för att skärpa ambitioner (Global Stocktake)'
    ],
    howItChangedThinking: 'Första globala klimatavtal med alla länder. Förändrade från "top-down" (Kyoto) till "bottom-up" (nationella åtaganden). Skapade politisk legitimitet för fossil avveckling.',
    legacyToday: 'Nuvarande NDC:er räcker till 2.5-2.9°C uppvärmning. Trots gap har avtalet drivit energitransition, divestering från fossil och ökad klimatlagstiftning.',
    criticisms: [
      'Frivilliga NDC:er är juridiskt svaga',
      'Inga sanktioner för missade mål',
      '100 miljarder-löftet har inte infriats fullt',
      'Nuvarande ambitioner räcker inte för 1.5°C'
    ],
    primarySource: {
      title: 'Paris Agreement',
      url: 'https://unfccc.int/process-and-meetings/the-paris-agreement',
      authors: 'UNFCCC'
    },
    relatedEvents: ['planetary-boundaries-2009', 'ipcc-2018']
  },
  
  // Population
  'malthus-1798': {
    id: 'malthus-1798',
    year: 1798,
    event: 'Malthus: An Essay on the Principle of Population',
    significance: 'Första systematiska analysen av befolkning och resurser',
    category: 'population',
    fullDescription: 'Thomas Robert Malthus, engelsk präst och ekonom, publicerade anonymt sin inflytelserika essä. Han argumenterade att befolkningen växer exponentiellt (geometriskt) medan matproduktion växer linjärt (aritmetiskt), vilket oundvikligen leder till svält och elände.',
    keyActors: [
      'Thomas Robert Malthus (författare)',
      'Influerade Darwin och Wallace',
      'Kritiserad av Marx och Engels'
    ],
    mainFindings: [
      'Befolkning fördubblas var 25:e år om obegränsad',
      'Matproduktion kan inte hålla jämna steg',
      '"Positiva kontroller" (svält, sjukdom, krig) begränsar befolkning',
      '"Preventiva kontroller" (senarelagda äktenskap) är att föredra'
    ],
    howItChangedThinking: 'Introducerade kvantitativt tänkande om befolkning. Inspirerade Darwin till teorin om naturligt urval. Skapade "malthusianism" som politisk strömning.',
    legacyToday: 'Malthus "hade fel" om jordbruksproduktion tack vare teknologi, men hans grundläggande logik om exponentiell tillväxt i ändliga system lever vidare i ekologisk ekonomi.',
    criticisms: [
      'Underskattade teknologisk kapacitet',
      'Ignorerade fördelningsfrågor',
      'Används för att rättfärdiga ojämlikhet',
      '"Neo-malthusianism" har rasistiska konnotationer'
    ],
    primarySource: {
      title: 'An Essay on the Principle of Population',
      url: 'https://www.econlib.org/library/Malthus/malPop.html',
      authors: 'Thomas Robert Malthus'
    },
    relatedEvents: ['population-bomb-1968', 'cairo-1994']
  },
  
  'population-bomb-1968': {
    id: 'population-bomb-1968',
    year: 1968,
    event: 'The Population Bomb publiceras',
    significance: 'Ökad medvetenhet om befolkningstillväxt',
    category: 'population',
    fullDescription: 'Paul Ehrlich och Anne Ehrlich publicerade bestsellern som varnade för massiv svält under 1970-80-talen pga befolkningstillväxt. Boken sålde miljoner exemplar och satte befolkningsfrågan på dagordningen.',
    keyActors: [
      'Paul R. Ehrlich (huvudförfattare)',
      'Anne Ehrlich (medförfattare, ofta osynliggjord)',
      'David Brower (Sierra Club, utgivare)',
      'ZPG-rörelsen (Zero Population Growth)'
    ],
    mainFindings: [
      'Förutspådde massiv svält under 70-80-talen (fel prognos)',
      'Befolkningsökning som främsta miljöhot',
      'Förespråkade drastiska åtgärder inkl. tvångssterilisering'
    ],
    howItChangedThinking: 'Mainstream-popularisering av befolkningsfrågan. Inspirerade miljörörelsen men också kontroversiella folkminsknigsprogram i Indien, Kina m.fl.',
    legacyToday: 'Ehrlichs konkreta förutsägelser slog inte in tack vare Gröna revolutionen. Kritiken mot boken försvagade befolkningsargument för decennier framåt.',
    criticisms: [
      'Prognoserna var dramatiskt fel',
      'Ignorerade teknologisk anpassning',
      'Inspirerade tvångsprogram i Indien/Kina',
      'Anklagad för rasism och neo-kolonialism'
    ],
    primarySource: {
      title: 'The Population Bomb',
      authors: 'Paul R. Ehrlich'
    },
    relatedEvents: ['malthus-1798', 'cairo-1994', 'limits-to-growth-1972']
  },
  
  'cairo-1994': {
    id: 'cairo-1994',
    year: 1994,
    event: 'Kairokonferensen',
    significance: 'Internationell konsensus om reproduktiva rättigheter',
    category: 'population',
    fullDescription: 'FN:s internationella konferens om befolkning och utveckling (ICPD) i Kairo samlade 179 regeringar. Den historiska överenskommelsen flyttade fokus från "befolkningskontroll" till "reproduktiva rättigheter" och kvinnors egenmakt.',
    keyActors: [
      'Nafis Sadik (UNFPA, konferenssekreterare)',
      'Bella Abzug (kvinnorättsrörelsen)',
      'Vatikanen (opposition)',
      'Feministiska organisationer globalt'
    ],
    mainFindings: [
      'Fokusförflyttning: från antal till rättigheter',
      'Tillgång till preventivmedel är en mänsklig rättighet',
      'Kvinnors utbildning och egenmakt sänker fertilitet',
      'Tvångsåtgärder fördöms explicit',
      '20-årigt handlingsprogram antaget'
    ],
    howItChangedThinking: 'Paradigmskifte i befolkningspolitik. Erkände att de mest effektiva åtgärderna är positiva (utbildning, hälsa, jämställdhet) snarare än negativa (kvoter, tvång).',
    legacyToday: 'ICPD-ramverket är fortfarande grunden för FN:s befolkningsarbete. Demografisk transition accelererade i de flesta länder. Fertilitet har fallit snabbare än förväntat.',
    criticisms: [
      'Vatikanen och islamistiska länder motsatte sig',
      'Finansieringslöften infriades aldrig fullt',
      'Abort förblev kontroversiellt',
      'Fokus på individ kan skymma strukturella faktorer'
    ],
    primarySource: {
      title: 'ICPD Programme of Action',
      url: 'https://www.unfpa.org/icpd',
      authors: 'United Nations'
    },
    relatedEvents: ['population-bomb-1968', 'population-8b-2022']
  },
  
  'population-8b-2022': {
    id: 'population-8b-2022',
    year: 2022,
    event: 'Världens befolkning passerar 8 miljarder',
    significance: 'Historisk milstolpe',
    category: 'population',
    fullDescription: 'FN meddelade att världens befolkning passerade 8 miljarder den 15 november 2022. Tillväxttakten har dock minskat kraftigt – det tog 12 år att gå från 7 till 8 miljarder, att jämföra med 12 år från 6 till 7.',
    keyActors: [
      'FN:s befolkningsfond (UNFPA)',
      'FN:s statistikavdelning (DESA)',
      'Nationella statistikbyråer'
    ],
    mainFindings: [
      'Befolkningstillväxten avtar – under 1% årligen',
      'Över hälften av framtida tillväxt sker i Afrika',
      'Medelåldern stiger globalt',
      'Toppen förväntas 2080-talet kring 10.4 miljarder (medianprognos)',
      'Fertilitet under reproduktionsnivå i 60+ länder'
    ],
    howItChangedThinking: 'Markerade övergång från oro för "befolkningsexplosion" till diskussion om åldrande samhällen och ojämn fördelning av demografisk transition.',
    legacyToday: 'Debatten handlar nu mer om var tillväxt sker (Afrika, Sydasien) än global total. Åldrande befolkningar i rika länder skapar nya ekonomiska utmaningar.',
    criticisms: [
      'Osäkerhet i prognoser är stor',
      'Regional variation är avgörande',
      'Fokus på siffror döljer resursanvändning per capita'
    ],
    primarySource: {
      title: 'World Population Prospects 2022',
      url: 'https://population.un.org/wpp/',
      authors: 'United Nations DESA'
    },
    relatedEvents: ['cairo-1994']
  }
};

// ═══════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════

const getCategoryColor = (category: HistoricalEventDetail['category']) => {
  switch (category) {
    case 'sustainability': return 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-950/30';
    case 'population': return 'text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-950/30';
    case 'energy': return 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/30';
    case 'climate': return 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/30';
    case 'economy': return 'text-cyan-600 bg-cyan-50 dark:text-cyan-400 dark:bg-cyan-950/30';
  }
};

const getCategoryName = (category: HistoricalEventDetail['category']) => {
  switch (category) {
    case 'sustainability': return 'Hållbarhet';
    case 'population': return 'Befolkning';
    case 'energy': return 'Energi';
    case 'climate': return 'Klimat';
    case 'economy': return 'Ekonomi';
  }
};

const normalizeEventKey = (year: number, event: string): string => {
  const base = event
    .toLowerCase()
    .replace(/[åä]/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .substring(0, 30);
  return `${base}-${year}`;
};

// ═══════════════════════════════════════════════════════════════
// EXPANDABLE HISTORICAL EVENT COMPONENT
// ═══════════════════════════════════════════════════════════════

export interface ExpandableHistoricalEventProps {
  /** Event ID from registry or inline event data */
  eventId?: string;
  /** Inline event if not in registry */
  event?: {
    year: number;
    event: string;
    significance: string;
  };
  /** Additional className */
  className?: string;
}

export const ExpandableHistoricalEvent: React.FC<ExpandableHistoricalEventProps> = ({
  eventId,
  event: inlineEvent,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Try to find in registry
  const registryEvent = eventId ? HISTORICAL_EVENT_REGISTRY[eventId] : null;
  
  // Also try normalized key from inline event
  const normalizedKey = inlineEvent 
    ? normalizeEventKey(inlineEvent.year, inlineEvent.event)
    : null;
  const normalizedRegistryEvent = normalizedKey 
    ? Object.values(HISTORICAL_EVENT_REGISTRY).find(e => 
        e.year === inlineEvent?.year && 
        e.event.toLowerCase().includes(inlineEvent?.event.toLowerCase().substring(0, 15) || '')
      )
    : null;
  
  const hasFullData = !!(registryEvent || normalizedRegistryEvent);
  const fullEvent = registryEvent || normalizedRegistryEvent;
  
  const year = fullEvent?.year || inlineEvent?.year || 0;
  const eventName = fullEvent?.event || inlineEvent?.event || 'Okänd händelse';
  const significance = fullEvent?.significance || inlineEvent?.significance || '';
  
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <div className={cn(
          "relative pl-8 cursor-pointer group transition-all",
          isOpen && "bg-muted/30 -mx-3 px-3 py-2 rounded-lg ml-5",
          className
        )}>
          <div className={cn(
            "absolute left-1.5 top-1.5 w-3 h-3 rounded-full transition-all",
            isOpen ? "bg-primary scale-125" : "bg-primary group-hover:scale-110"
          )} />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="mb-1">{year}</Badge>
              {hasFullData && (
                <Badge 
                  variant="secondary" 
                  className="text-[10px] h-4 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Klicka för fördjupning
                </Badge>
              )}
            </div>
            <p className="text-sm font-medium group-hover:text-primary transition-colors">
              {eventName}
            </p>
            <p className="text-xs text-muted-foreground">{significance}</p>
          </div>
          {hasFullData && (
            <span className={cn(
              "absolute right-0 top-2 font-mono text-xs text-muted-foreground transition-transform",
              isOpen && "rotate-180"
            )}>
              {isOpen ? '[−]' : '[+]'}
            </span>
          )}
        </div>
      </CollapsibleTrigger>
      
      {hasFullData && fullEvent && (
        <CollapsibleContent className="pl-8 mt-3 space-y-3 border-l-2 border-primary/30 ml-1.5">
          {/* Category badge */}
          <Badge className={cn("text-xs", getCategoryColor(fullEvent.category))}>
            {getCategoryName(fullEvent.category)}
          </Badge>
          
          {/* Full Description */}
          <Card>
            <CardContent className="p-3">
              <p className="text-sm leading-relaxed">{fullEvent.fullDescription}</p>
            </CardContent>
          </Card>
          
          {/* Key Actors */}
          <Card className="bg-muted/30">
            <CardHeader className="pb-2 pt-3">
              <CardTitle className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                NYCKELAKTÖRER
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-3">
              <ul className="space-y-1">
                {fullEvent.keyActors.map((actor, idx) => (
                  <li key={idx} className="text-xs flex items-start gap-1.5 hover:text-primary cursor-pointer transition-colors">
                    <span className="font-mono text-[10px] text-muted-foreground">[{idx + 1}]</span>
                    {actor}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          {/* Main Findings */}
          {fullEvent.mainFindings && fullEvent.mainFindings.length > 0 && (
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader className="pb-2 pt-3">
                <CardTitle className="text-xs font-mono uppercase tracking-wider text-primary">
                  HUVUDSLUTSATSER
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-3">
                <ul className="space-y-1.5">
                  {fullEvent.mainFindings.map((finding, idx) => (
                    <li key={idx} className="text-xs flex items-start gap-2 hover:text-primary cursor-pointer transition-colors">
                      <span className="font-mono text-[10px] text-primary">[{idx + 1}]</span>
                      {finding}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
          
          {/* How It Changed Thinking */}
          <Card className="bg-blue-50/30 dark:bg-blue-950/10 border-blue-200/50">
            <CardHeader className="pb-2 pt-3">
              <CardTitle className="text-xs font-mono uppercase tracking-wider text-blue-700 dark:text-blue-400">
                [→] HUR DET FÖRÄNDRADE TÄNKANDET
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-3">
              <p className="text-xs hover:text-primary cursor-pointer transition-colors">{fullEvent.howItChangedThinking}</p>
            </CardContent>
          </Card>
          
          {/* Legacy Today */}
          <Card className="bg-green-50/30 dark:bg-green-950/10 border-green-200/50">
            <CardHeader className="pb-2 pt-3">
              <CardTitle className="text-xs font-mono uppercase tracking-wider text-green-700 dark:text-green-400">
                [✓] ARV IDAG
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-3">
              <p className="text-xs hover:text-primary cursor-pointer transition-colors">{fullEvent.legacyToday}</p>
            </CardContent>
          </Card>
          
          {/* Criticisms */}
          {fullEvent.criticisms && fullEvent.criticisms.length > 0 && (
            <Card className="bg-amber-50/30 dark:bg-amber-950/10 border-amber-200/50">
              <CardHeader className="pb-2 pt-3">
                <CardTitle className="text-xs font-mono uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  [!] KRITIK OCH BEGRÄNSNINGAR
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-3">
                <ul className="space-y-1">
                  {fullEvent.criticisms.map((criticism, idx) => (
                    <li key={idx} className="text-xs flex items-start gap-1.5 hover:text-primary cursor-pointer transition-colors">
                      <span className="font-mono text-[10px] text-amber-500">[!]</span>
                      {criticism}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
          
          {/* Primary Source */}
          {fullEvent.primarySource && (
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="text-xs text-muted-foreground flex items-center gap-2">
                <span className="font-mono text-[10px]">[SRC]</span>
                <span>{fullEvent.primarySource.title}</span>
              </div>
              {fullEvent.primarySource.url && (
                <Button variant="outline" size="sm" className="h-7" asChild>
                  <a href={fullEvent.primarySource.url} target="_blank" rel="noopener noreferrer">
                    <span className="font-mono text-[10px] mr-1">[→]</span>
                    Primärkälla
                  </a>
                </Button>
              )}
            </div>
          )}
          
          {/* Related Events - Clickable navigation */}
          {fullEvent.relatedEvents && fullEvent.relatedEvents.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2">
              <span className="text-xs font-mono text-muted-foreground">
                [REL]
              </span>
              {fullEvent.relatedEvents.map((eventKey) => {
                const related = HISTORICAL_EVENT_REGISTRY[eventKey];
                return related ? (
                  <a 
                    key={eventKey}
                    href={`/history/${eventKey}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      // Scroll to top and trigger navigation
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                      // For now, open in dialog or navigate
                      window.location.href = `/history/${eventKey}`;
                    }}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <span className="font-mono text-[10px]">[→]</span>
                    {related.year}: {related.event.substring(0, 25)}...
                  </a>
                ) : null;
              })}
            </div>
          )}
        </CollapsibleContent>
      )}
    </Collapsible>
  );
};

// Export registry for external use
export { HISTORICAL_EVENT_REGISTRY };
