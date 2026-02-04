/**
 * EXPANDABLE PROOF POINT
 * 
 * "Zero Dead-Ends" Policy - Varje bevis- och begränsningspunkt
 * är klickbar med fullständig fördjupning.
 * 
 * Designprincip: Inga ikoner, endast text och semantisk färgkodning.
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

// ═══════════════════════════════════════════════════════════════
// PROOF POINT EVIDENCE REGISTRY
// ═══════════════════════════════════════════════════════════════

export interface ProofPointEvidence {
  point: string;
  
  // Expanded content
  explanation: string;
  scientificBasis: string;
  examples: string[];
  relatedPrinciples: string[];
  implications: string[];
  
  // For limitations
  whyThisMatters?: string;
  possibleMitigations?: string[];
}

const PROOF_EVIDENCE_REGISTRY: Record<string, ProofPointEvidence> = {
  // ═══ POPULATION & CARRYING CAPACITY ═══
  'Fler människor kräver mer resurser (ceteris paribus)': {
    point: 'Fler människor kräver mer resurser (ceteris paribus)',
    explanation: 'Med allt annat lika ("ceteris paribus") innebär varje ytterligare person ökad efterfrågan på mat, vatten, energi och bostäder. Detta är grundläggande aritmetik, inte ideologi.',
    scientificBasis: 'IPAT-ekvationen: Impact = Population × Affluence × Technology (Ehrlich & Holdren, 1971). Bekräftad av material footprint-forskning (Wiedmann et al. 2015).',
    examples: [
      'Global matproduktion måste öka 50% till 2050 enbart pga befolkningstillväxt',
      '8 miljarder människor → 8x resursbehov vs 1 miljard (vid lika konsumtion)',
      'Urbana infrastrukturinvesteringar korrelerar starkt med befolkningsmängd'
    ],
    relatedPrinciples: ['IPAT-ekvationen', 'Carrying capacity', 'Malthusiansk dynamik'],
    implications: [
      'Befolkningsstorlek är EN variabel bland flera',
      'Konsumtionsmönster (A) och teknik (T) kan kompensera',
      'Politiska lösningar kräver alla tre vektorer'
    ]
  },
  
  'Demografisk transition sänker födelsetal med utveckling': {
    point: 'Demografisk transition sänker födelsetal med utveckling',
    explanation: 'Historiskt mönster: när samhällen utvecklas faller först dödligheten (bättre hälsovård), sedan födelsetalen (urbanisering, utbildning, preventivmedel). Resultatet är stabiliserad befolkning.',
    scientificBasis: 'Demografisk transitionsteori (Thompson 1929, Notestein 1945). Empiriskt bekräftad i 150+ länder. TFR under 2.1 i alla höginkomstländer.',
    examples: [
      'Sverige: TFR från 5.0 (1800) → 1.7 (idag)',
      'Sydkorea: snabbaste transitionen – 6.0 → 0.7 på 60 år',
      'Bangladesh: TFR halverad på 30 år utan att bli höginkomstland'
    ],
    relatedPrinciples: ['Demografisk transition', 'Fertilitetsteori', 'Humankapitalteori'],
    implications: [
      'Utveckling är mest effektiva "befolkningspolitiken"',
      'Flickors utbildning har starkast effekt på fertilitet',
      'Framtida befolkning beror på hur snabbt låginkomstländer utvecklas'
    ]
  },
  
  'Befolkning × konsumtion = total belastning': {
    point: 'Befolkning × konsumtion = total belastning',
    explanation: 'Total miljöpåverkan är produkten av antal människor och genomsnittlig konsumtion per capita. En amerikan belastar miljön 10-50x mer än en genomsnittlig afrikan.',
    scientificBasis: 'IPAT-modellen (Ehrlich & Holdren). Ecological Footprint-metodik (Wackernagel & Rees). Koldioxidräkenskaper per capita (GCP).',
    examples: [
      'USA: 15 ton CO2/capita vs Somalia: 0.04 ton',
      'Om alla levde som svenskar behövs 3.5 jordklot',
      'Afrikas befolkningsökning adderar mindre utsläpp än Europas befintliga konsumtion'
    ],
    relatedPrinciples: ['Ecological Footprint', 'Koldioxidbudgetar', 'Rättvis andel (fair share)'],
    implications: [
      'Fokus enbart på befolkning är ofullständigt',
      'Höginkomstländers konsumtion är proportionellt viktigare',
      'Rättviseaspekt: vem har "rätt" till hur mycket?'
    ]
  },
  
  'Regionala obalanser skapar migrationstryck': {
    point: 'Regionala obalanser skapar migrationstryck',
    explanation: 'När befolkningstillväxt överstiger lokal ekonomisk möjlighet eller resurstillgång uppstår push-faktorer. Kombinerat med pull-faktorer (högre löner, säkerhet) driver detta migration.',
    scientificBasis: 'Push-pull-teori (Lee 1966). Gravity models of migration. World Bank migrationsdata visar korrelation med inkomstskillnader.',
    examples: [
      'Afrika söder om Sahara: 60% av befolkningen under 25 år → jobbunderskott',
      'Centralamerika-USA: löneskillnad 10:1 driver migration',
      'Syrien: klimatdriven torka → jordbruksmigration → urban stress → konflikt'
    ],
    relatedPrinciples: ['Migrationsekonomik', 'Youth bulge-teori', 'Klimatmigration'],
    implications: [
      'Migration är systemiskt, inte individuella val',
      'Destination-länders politik påverkar flöden marginellt',
      'Utveckling vid ursprung är långsiktig lösning'
    ]
  },
  
  // ═══ CARRYING CAPACITY & RESOURCES ═══
  'Välbefinnande kräver materiella resurser (energi, vatten, mat)': {
    point: 'Välbefinnande kräver materiella resurser (energi, vatten, mat)',
    explanation: 'Mänsklig välfärd är fundamentalt bunden till fysiska flöden. Inget samhälle har uppnått hög levnadsstandard utan tillgång till energi, rent vatten och näringsriktig mat. Detta är inte ideologi utan termodynamik.',
    scientificBasis: 'Maslows behovshierarki bekräftad av empirisk forskning (Tay & Diener 2011). Energi-HDI-korrelation r² > 0.85 (Steinberger & Roberts 2010).',
    examples: [
      'Länder med <50 GJ/capita energi har aldrig HDI >0.8',
      'Vattenkriser korrelerar med politisk instabilitet (r=0.67)',
      'Matosäkerhet driver migration och konflikt'
    ],
    relatedPrinciples: ['Termodynamikens lagar', 'Biogeokemiska cykler', 'Ekosystemtjänster'],
    implications: [
      'Resurseffektivitet är nödvändig men inte tillräcklig',
      'Fattigdomsbekämpning kräver energitillgång',
      '"Grön tillväxt" måste förklara resursmixen'
    ]
  },
  
  'Ekonomisk aktivitet är bunden till fysiska flöden': {
    point: 'Ekonomisk aktivitet är bunden till fysiska flöden',
    explanation: 'All produktion transformerar materia och energi. BNP mäter monetära transaktioner men dessa korresponderar alltid med fysiska processer. "Dematerialisering" sker sällan i absoluta termer.',
    scientificBasis: 'Biofysisk ekonomi (Hall & Klitgaard 2018). Material footprint-studier visar koppling BNP-resurser (Wiedmann et al. 2015).',
    examples: [
      'Globalt: 1% BNP-tillväxt ≈ 0.6% energitillväxt',
      'Tjänstesektorns "lätta" karaktär döljer materiell infrastruktur',
      'Digital ekonomi kräver datacenters, kablar, enheter'
    ],
    relatedPrinciples: ['Massbalans', 'Energibevarande', 'EROI-teori'],
    implications: [
      'Ekonomisk modellering bör inkludera fysiska begränsningar',
      'Absolutt frikoppling är extremt sällsynt historiskt',
      'Cirkulär ekonomi minskar men eliminerar inte resursflöden'
    ]
  },
  
  'Det finns absoluta gränser för resursuttag': {
    point: 'Det finns absoluta gränser för resursuttag',
    explanation: 'Planetära gränser definierar ett "säkert operativt utrymme" för mänskligheten. Flera gränser är redan överskridna: klimat, biodiversitet, kvävecykel, markanvändning.',
    scientificBasis: 'Planetary Boundaries framework (Rockström et al. 2009, uppdaterad 2023). Stöds av IPCC och IPBES-rapporter.',
    examples: [
      'CO2: 420 ppm vs 350 ppm gräns',
      'Biodiversitet: 6:e massutrotningen pågår',
      'Kväve: 3x säker gräns överskriden'
    ],
    relatedPrinciples: ['Systemresiliens', 'Tipping points', 'Earth System Science'],
    implications: [
      'Tillväxtparadigmet behöver revidering',
      'Resursallokering blir fördelningsfråga',
      'Teknologi kan flytta men inte ta bort gränser'
    ]
  },
  
  'Teknik kan öka effektivitet men inte upphäva termodynamik': {
    point: 'Teknik kan öka effektivitet men inte upphäva termodynamik',
    explanation: 'Innovation kan dramatiskt förbättra resursproduktivitet men kan aldrig bryta fysikens lagar. Alla processer har entropi. Rebound-effekter äter ofta upp effektivitetsvinster.',
    scientificBasis: 'Jevons paradox (1865). Carnot-effektivitet sätter teoretiska tak. EROI-analys visar att energikostnaden för energi aldrig är noll.',
    examples: [
      'LED-lampor 90% effektivare → belysningsanvändning ökade',
      'Bränslesnålare bilar → fler körda kilometer',
      'Moore\'s lag: datorkraft ökar men total elanvändning stiger'
    ],
    relatedPrinciples: ['Entropi', 'Rebound-effekter', 'Jevons paradox'],
    implications: [
      'Effektivitetspolitik måste kompletteras med absoluta tak',
      'Systemtänkande krävs för att undvika suboptimering',
      'Teknologisk optimism bör balanseras med fysisk realism'
    ]
  }
};

const LIMITATION_EVIDENCE_REGISTRY: Record<string, ProofPointEvidence> = {
  // ═══ POPULATION LIMITATIONS ═══
  'Säger inget om önskvärd befolkningsnivå': {
    point: 'Säger inget om önskvärd befolkningsnivå',
    explanation: 'Data visar trender och konsekvenser, men tar inte ställning till vilken befolkningsstorlek som är "optimal". Detta är en värderingsfråga som involverar etik, politik och kulturella preferenser.',
    scientificBasis: 'Humes giljotin: deskriptiva fakta implicerar inte normativa slutsatser. Optimal befolkning beror på teknologi, fördelning och livsstilsval.',
    examples: [
      'Vissa förespråkar drastisk minskning (Deep Ecology)',
      'Andra betonar teknologisk lösning oavsett befolkningsstorlek',
      'Nationella intressen (pensionssystem, militär) föredrar tillväxt'
    ],
    relatedPrinciples: ['Normativ vs deskriptiv analys', 'Etiska ramverk', 'Politisk ekonomi'],
    implications: [
      'Systemet presenterar scenarier, inte rekommendationer',
      'Användare måste själva väga värden',
      'Inga "rätta" befolkningsmål finns i data'
    ],
    whyThisMatters: 'Risk för att data används för att rättfärdiga specifika befolkningspolicies utan transparent värdediskussion.',
    possibleMitigations: [
      'Explicit noterar att detta är värderings-, inte faktafråga',
      'Presenterar multipla scenarier utan rangordning',
      'Länkar till etisk litteratur'
    ]
  },
  
  'Konsumtion per capita varierar enormt': {
    point: 'Konsumtion per capita varierar enormt',
    explanation: 'En amerikan konsumerar i genomsnitt 10-50x mer resurser än en afrikan. Att fokusera enbart på befolkningsantal ignorerar denna enorma variation.',
    scientificBasis: 'Ecological Footprint-data (Global Footprint Network). Koldioxidräkenskaper: 15 ton/capita (USA) vs 0.1 ton/capita (Malawi). Material footprint-studier.',
    examples: [
      'Afrikas befolkningsökning (1.2 miljarder) adderar mindre CO2 än Europas befintliga nivå',
      'De rikaste 10% orsakar 50% av globala utsläpp',
      'Luxuryconsumption (flyg, kött, SUV) dominerar i höginkomstländer'
    ],
    relatedPrinciples: ['IPAT-modellen', 'Ekologiskt fotavtryck', 'Klimaträttvisa'],
    implications: [
      'Befolkningsfokus kan avleda från konsumtionsmönster',
      'Höginkomstländers konsumtion är proportionellt viktigare',
      'Rättviseperspektiv: vem bär ansvaret?'
    ],
    whyThisMatters: 'Risk för att utvecklingsländer skuldbeläggs medan höginkomstländers överkonsumtion förbises.',
    possibleMitigations: [
      'Alltid visar per capita OCH absoluta tal',
      'Inkluderar konsumtionsbaserade utsläpp',
      'Fördelningsanalyser per inkomstgrupp'
    ]
  },
  
  'Teknologi kan öka bärkraft': {
    point: 'Teknologi kan öka bärkraft',
    explanation: 'Historien visar att teknologiska genombrott kan dramatiskt öka jordens bärkraft. Haber-Bosch-processen möjliggjorde mat för 4 miljarder extra människor.',
    scientificBasis: 'Boserup-hypotesen: befolkningstryck driver innovation. Grön revolution 3x matproduktion. Smil (2017): energitransitioner.',
    examples: [
      'Haber-Bosch (1909): artificiellt kväve → moderna jordbruket',
      'Grön revolution: ökade skördar 200-300%',
      'Solenergi: potentiellt 1000x nuvarande energibehov'
    ],
    relatedPrinciples: ['Boserup vs Malthus', 'Teknologisk determinism', 'Innovation under press'],
    implications: [
      'Nuvarande begränsningar är inte permanenta',
      'Men timing och distribution av teknik är osäker',
      'Teknologi löser inte automatiskt fördelningsproblem'
    ],
    whyThisMatters: 'Risk för både överdriven optimism och pessimism om framtida kapacitet.',
    possibleMitigations: [
      'Scenarier med olika teknik-antaganden',
      'Historiska exempel på gränsförskjutning',
      'Explicit osäkerhet om framtida innovation'
    ]
  },
  
  'Etiska frågor om befolkningspolitik exkluderas': {
    point: 'Etiska frågor om befolkningspolitik exkluderas',
    explanation: 'Data om befolkningstrender säger inget om huruvida staten bör påverka fertilitet, eller hur. Historiskt missbruk (eugenik, tvångssterilisering) gör frågan känslig.',
    scientificBasis: 'FN-konventioner om reproduktiva rättigheter. Historisk forskning om befolkningspolitik (Connelly 2008). Bioetisk litteratur.',
    examples: [
      'Kinas ettbarnspolitik: effektiv men kränkte rättigheter',
      'Indiens tvångssterilisering (1970-talet): etisk katastrof',
      'Skandinavisk modell: utbildning och ekonomisk trygghet sänker fertilitet frivilligt'
    ],
    relatedPrinciples: ['Reproduktiva rättigheter', 'Bioetik', 'Kolonialt arv'],
    implications: [
      'Systemet tar aldrig ställning till befolkningspolicy',
      'Historisk kontext krävs för tolkning',
      'Frivilliga metoder prioriteras i forskning'
    ],
    whyThisMatters: 'Befolkningsdata har historiskt missbrukats för auktoritär politik. Ansvarsfullt system undviker detta.',
    possibleMitigations: [
      'Explicit disclaimer om etiska dimensioner',
      'Inga policyrekommendationer baserat på demografi',
      'Länkar till etisk och rättighetsbaserad litteratur'
    ]
  },
  
  // ═══ GENERAL LIMITATIONS ═══
  'Säger inget om hur resurser ska fördelas': {
    point: 'Säger inget om hur resurser ska fördelas',
    explanation: 'Biofysiska fakta beskriver vad som är möjligt, inte vad som är rättvist. Fördelningsfrågor är politiska och etiska, inte vetenskapliga.',
    scientificBasis: 'Hume\'s guillotine: man kan inte härleda "bör" från "är". Rawls vs utilitarism-debatt i politisk filosofi.',
    examples: [
      'Samma resursmängd kan fördelas jämlikt eller ojämlikt',
      'Effektivitet och rättvisa kan stå i konflikt',
      '"Lagom" konsumtion är normativt, inte empiriskt'
    ],
    relatedPrinciples: ['Normativ vs deskriptiv', 'Distributiv rättvisa', 'Kapabilitetsteori'],
    implications: [
      'Data informerar men avgör inte värderingar',
      'Demokratiska processer krävs för fördelningsbeslut',
      'Systemet tar inte ställning i ideologiska frågor'
    ],
    whyThisMatters: 'Användare måste förstå att data inte ersätter politik. Fördelning kräver värderingar som ligger utanför vetenskaplig analys.',
    possibleMitigations: [
      'Vi visar fördelningsdata (Gini, decilkvoter) utan rekommendation',
      'Kontrafaktiska scenarier kan illustrera alternativ',
      'Värderingsfrågor flaggas explicit'
    ]
  },
  
  'Kvantifierar inte lycka eller meningsfullhet': {
    point: 'Kvantifierar inte lycka eller meningsfullhet',
    explanation: 'Subjektivt välbefinnande och existentiellt meningsskapande fångas inte av materiella indikatorer. "Mer" garanterar inte "bättre".',
    scientificBasis: 'Easterlin-paradoxen: BNP-tillväxt → ej konstant lyckotillväxt. Positiv psykologi: hedonisk vs eudaimonisk lycka.',
    examples: [
      'Bhutan mäter Gross National Happiness',
      'Skandinavien: hög välfärd men höga depressions-siffror',
      'Materiell mättnad: lyckoplatån vid ~$75k (Kahneman)'
    ],
    relatedPrinciples: ['Hedonisk anpassning', 'Easterlin-paradoxen', 'Kapabilitetsteori'],
    implications: [
      'Materiella mått är nödvändiga men inte tillräckliga',
      'Kvalitativa dimensioner kräver annan metodik',
      'Policy bör inkludera men inte begränsas till BNP'
    ],
    whyThisMatters: 'Risk att systemet uppfattas som materialistiskt reduktionistiskt. Välfärd ≠ välbefinnande.',
    possibleMitigations: [
      'Inkludera subjektiva undersökningar där data finns',
      'Explicit notera vad som INTE mäts',
      'Länka till kvalitativ forskning'
    ]
  },
  
  'Regionala variationer kan vara stora': {
    point: 'Regionala variationer kan vara stora',
    explanation: 'Nationella snitt döljer ofta dramatiska skillnader mellan regioner, kommuner och stadsdelar. Aggregering kan vilseleda.',
    scientificBasis: 'Spatial statistik: MAUP (Modifiable Areal Unit Problem). Ojämlikhetsforskning visar inomlands-klyftor.',
    examples: [
      'Stockholms län vs Norrbotten: 40% inkomstskillnad',
      'USA: livslängdsskillnad 20+ år mellan counties',
      'Stadskärnor vs landsbygd: polariserande trender'
    ],
    relatedPrinciples: ['Aggregeringsproblem', 'Spatial autokorrelation', 'MAUP'],
    implications: [
      'Policy bör anpassas till lokal kontext',
      'Nationella mål kan dölja lokala kriser',
      'Granularitet viktigt för rättvisebedömning'
    ],
    whyThisMatters: 'Nationella snittvärden kan skapa falsk trygghet eller felriktad kritik.',
    possibleMitigations: [
      'NUTS-3 nivå visas där data finns',
      'Variansintervall och spridningsmått inkluderas',
      'Drill-down möjliggör regional analys'
    ]
  },
  
  'Teknologiska språng kan flytta gränser': {
    point: 'Teknologiska språng kan flytta gränser',
    explanation: 'Historien visar att teknikskiften kan dramatiskt ändra förutsättningarna. Nuvarande begränsningar behöver inte vara permanenta.',
    scientificBasis: 'Schumpeter: kreativ förstörelse. Energitransitioner (Smil). Jordbruksrevolutionen ökade bärkraft 100x.',
    examples: [
      'Haber-Bosch: bröt kväve-begränsningen → 4 miljarder fler människor',
      'Solenergi: kostnad -99% på 40 år',
      'Kärnfusion: potentiellt obegränsad energi'
    ],
    relatedPrinciples: ['Teknologisk disruption', 'S-kurvor', 'Paradigmskiften'],
    implications: [
      'Prognoser bör inkludera osäkerhet om teknikutveckling',
      'Dagens begränsningar är inte definitiva',
      'Men timing är osäker – kan inte planeras för'
    ],
    whyThisMatters: 'Risk att systemet uppfattas som deterministiskt pessimistiskt. Tekniksprång är möjliga men oförutsägbara.',
    possibleMitigations: [
      'Scenarier med olika teknik-antaganden',
      'Historiska exempel på gränsförskjutning',
      'Explicit osäkerhet i projektioner'
    ]
  }
};

// ═══════════════════════════════════════════════════════════════
// EXPANDABLE PROOF POINT COMPONENT
// ═══════════════════════════════════════════════════════════════

export interface ExpandableProofPointProps {
  point: string;
  type: 'proof' | 'limitation';
  className?: string;
}

export const ExpandableProofPoint: React.FC<ExpandableProofPointProps> = ({
  point,
  type,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const registry = type === 'proof' ? PROOF_EVIDENCE_REGISTRY : LIMITATION_EVIDENCE_REGISTRY;
  const evidence = registry[point];
  
  const hasEvidence = !!evidence;
  
  const baseStyle = type === 'proof' 
    ? 'text-green-700 dark:text-green-400' 
    : 'text-amber-700 dark:text-amber-400';
  
  const bgStyle = type === 'proof'
    ? 'bg-green-50/50 dark:bg-green-950/20 border-green-200/50'
    : 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200/50';
  
  if (!hasEvidence) {
    return (
      <li className={cn("text-xs py-1", className)}>
        <span className={cn("block", baseStyle)}>{point}</span>
      </li>
    );
  }
  
  return (
    <li className={cn("list-none", className)}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="w-full text-left group">
          <div className={cn(
            "text-xs py-1.5 px-2 rounded transition-colors flex items-start justify-between gap-2",
            "hover:bg-muted/50 cursor-pointer",
            isOpen && bgStyle
          )}>
            <span className={cn("flex-1", baseStyle, isOpen && "font-medium")}>
              {point}
            </span>
            <span className={cn(
              "text-muted-foreground opacity-50 group-hover:opacity-100 transition-opacity shrink-0",
              isOpen && "opacity-100"
            )}>
              {isOpen ? '−' : '+'}
            </span>
          </div>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <div className={cn("ml-2 mt-2 p-3 rounded border space-y-3", bgStyle)}>
            {/* Explanation */}
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">
                FÖRKLARING
              </p>
              <p className="text-sm">{evidence.explanation}</p>
            </div>
            
            {/* Scientific Basis */}
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">
                VETENSKAPLIG GRUND
              </p>
              <p className="text-xs text-muted-foreground">{evidence.scientificBasis}</p>
            </div>
            
            {/* Examples */}
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">
                EXEMPEL
              </p>
              <ul className="space-y-0.5">
                {evidence.examples.map((ex, idx) => (
                  <li key={idx} className="text-xs text-muted-foreground">
                    • {ex}
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Related Principles */}
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">
                RELATERADE PRINCIPER
              </p>
              <div className="flex flex-wrap gap-1">
                {evidence.relatedPrinciples.map((p) => (
                  <Badge key={p} variant="outline" className="text-xs font-normal">
                    {p}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Implications */}
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">
                IMPLIKATIONER
              </p>
              <ul className="space-y-0.5">
                {evidence.implications.map((imp, idx) => (
                  <li key={idx} className="text-xs text-muted-foreground">
                    → {imp}
                  </li>
                ))}
              </ul>
            </div>
            
            {/* For limitations: why it matters & mitigations */}
            {type === 'limitation' && evidence.whyThisMatters && (
              <Card className="bg-background/50">
                <CardHeader className="pb-1 pt-2">
                  <CardTitle className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    VARFÖR DETTA SPELAR ROLL
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-xs">{evidence.whyThisMatters}</p>
                </CardContent>
              </Card>
            )}
            
            {type === 'limitation' && evidence.possibleMitigations && (
              <div>
                <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">
                  HUR VI HANTERAR DETTA
                </p>
                <ul className="space-y-0.5">
                  {evidence.possibleMitigations.map((m, idx) => (
                    <li key={idx} className="text-xs text-muted-foreground">
                      ◦ {m}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </li>
  );
};
