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
  // WHAT THIS PROVES
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
