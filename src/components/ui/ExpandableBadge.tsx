/**
 * EXPANDABLE BADGE
 * 
 * "Zero Dead-Ends" Policy - Varje badge är klickbar
 * och leder till djup dokumentation med källor och evidens.
 */

import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

// Text-based type labels instead of icons (per design doctrine)
const SOURCE_TYPE_LABELS: Record<string, string> = {
  study: 'STUDIE',
  report: 'RAPPORT',
  law: 'LAG',
  data: 'DATA',
  book: 'BOK'
};

// ═══════════════════════════════════════════════════════════════
// BADGE EVIDENCE REGISTRY
// ═══════════════════════════════════════════════════════════════

interface BadgeEvidence {
  title: string;
  scientificBasis: string;
  sources: Array<{
    title: string;
    type: 'study' | 'report' | 'book' | 'data' | 'law';
    source: string;
    year?: number;
    url?: string;
  }>;
  whatThisProves: string[];
  limitations: string[];
  context?: string;
}

const BADGE_EVIDENCE_REGISTRY: Record<string, BadgeEvidence> = {
  // GCCE Not-definitions
  'inte-maximal-överlevnad': {
    title: 'Inte maximal överlevnad',
    scientificBasis: 'Ren överlevnad utan kvalitet är inte mänsklig blomstring. Systemet mäter förmåga till meningsfullt liv, inte bara biologisk existens.',
    sources: [
      { title: 'Capability Approach', type: 'book', source: 'Sen, Amartya - Development as Freedom', year: 1999 },
      { title: 'Beyond GDP', type: 'report', source: 'European Commission', year: 2009, url: 'https://ec.europa.eu/environment/beyond_gdp' },
    ],
    whatThisProves: [
      'Livskvalitet ≠ överlevnadstid',
      'Välbefinnande kräver frihet och möjligheter',
      'Rent kvantitativa mått missar essentiella dimensioner'
    ],
    limitations: [
      'Livskvalitet är delvis subjektiv',
      'Kulturella skillnader påverkar värderingar'
    ]
  },
  'inte-bnp-maximering': {
    title: 'Inte BNP-maximering',
    scientificBasis: 'BNP mäter ekonomisk aktivitet, inte välbefinnande. Hög BNP kan samexistera med ojämlikhet, miljöförstöring och social fragmentering.',
    sources: [
      { title: 'Mismeasuring Our Lives', type: 'book', source: 'Stiglitz, Sen & Fitoussi', year: 2010 },
      { title: 'The Spirit Level', type: 'book', source: 'Wilkinson & Pickett', year: 2009 },
      { title: 'GDP as Welfare Measure', type: 'study', source: 'Journal of Economic Literature', year: 2016 },
    ],
    whatThisProves: [
      'BNP-tillväxt korrelerar svagt med välbefinnande efter viss nivå',
      'Fördelning viktigare än total storlek',
      'Negativa externaliteter räknas som positivt i BNP'
    ],
    limitations: [
      'BNP är fortfarande nödvändigt för resursfördelning',
      'Alternativa mått är svårare att mäta'
    ],
    context: 'Stiglitz-kommissionen (2008) visade att BNP systematiskt underskattar miljökostnader och överskattar finansiell aktivitet.'
  },
  'levbarhet-över-generationer': {
    title: 'Levbarhet över generationer',
    scientificBasis: 'Hållbarhet definieras som att tillfredsställa nuvarande behov utan att äventyra framtida generationers möjligheter. Detta kräver långsiktig planering bortom valkykler.',
    sources: [
      { title: 'Our Common Future (Brundtland Report)', type: 'report', source: 'UN World Commission', year: 1987, url: 'https://sustainabledevelopment.un.org/milestones/wced' },
      { title: 'Intergenerational Justice', type: 'book', source: 'Gosseries & Meyer', year: 2009 },
      { title: 'Planetary Boundaries', type: 'study', source: 'Stockholm Resilience Centre', year: 2009 },
    ],
    whatThisProves: [
      'Kortsiktiga vinster kan skapa långsiktiga förluster',
      'Resurser tillhör alla generationer, inte bara nuvarande',
      'Ekologisk skuld överförs till framtiden'
    ],
    limitations: [
      'Diskonteringsränta för framtida nytta debatteras',
      'Framtida preferenser är osäkra'
    ]
  },
  // Axis components
  'mat': {
    title: 'Mat',
    scientificBasis: 'Matsäkerhet är grundläggande för mänsklig kapacitet. Kaloritillgång, näringskvalitet och distribution avgör hälsa och produktivitet.',
    sources: [
      { title: 'State of Food Security', type: 'report', source: 'FAO/WHO/UNICEF', year: 2023 },
      { title: 'Global Food Security Index', type: 'data', source: 'Economist Impact', year: 2023 },
    ],
    whatThisProves: [
      'Undernäring begränsar kognitiv och fysisk utveckling',
      'Matsystemens resiliens påverkar nationell stabilitet'
    ],
    limitations: ['Matpreferenser varierar kulturellt', 'Produktionsdata kan vara ofullständig']
  },
  'bostäder': {
    title: 'Bostäder',
    scientificBasis: 'Adekvat boende är en mänsklig rättighet och grundförutsättning för hälsa, trygghet och social delaktighet.',
    sources: [
      { title: 'UN-Habitat Global Housing Report', type: 'report', source: 'United Nations', year: 2022 },
      { title: 'Housing Affordability Crisis', type: 'study', source: 'OECD Economic Studies', year: 2021 },
    ],
    whatThisProves: [
      'Bostadsbrist korrelerar med social instabilitet',
      'Boendestandard påverkar hälsoutfall'
    ],
    limitations: ['Standarder för "adekvat" varierar', 'Informella bosättningar svåra att mäta']
  },
  'transporter': {
    title: 'Transporter',
    scientificBasis: 'Transportinfrastruktur möjliggör ekonomisk integration, arbetsmarknadsmobilitet och tillgång till tjänster.',
    sources: [
      { title: 'Global Infrastructure Outlook', type: 'report', source: 'G20/Oxford Economics', year: 2017 },
      { title: 'Transport and Economic Development', type: 'study', source: 'Journal of Transport Geography', year: 2019 },
    ],
    whatThisProves: [
      'Transporttillgång korrelerar med ekonomiska möjligheter',
      'Infrastrukturinvesteringar har multiplikatoreffekter'
    ],
    limitations: ['CO2-avtryck från transporter är betydande', 'Urbanisering förändrar transportbehov']
  },
  // Pressure zone factors
  'energibrist': {
    title: 'Energibrist',
    scientificBasis: 'Energitillgång är nödvändig för all ekonomisk aktivitet. Brist leder till produktionsstopp, försämrad levnadsstandard och social stress.',
    sources: [
      { title: 'World Energy Outlook', type: 'report', source: 'International Energy Agency', year: 2023, url: 'https://www.iea.org/reports/world-energy-outlook-2023' },
      { title: 'Energy Poverty in Europe', type: 'study', source: 'EU Energy Poverty Observatory', year: 2022 },
    ],
    whatThisProves: [
      'Energifattigdom påverkar hälsa och välbefinnande',
      'Industriproduktion kräver stabil energitillförsel'
    ],
    limitations: ['Energimix varierar mellan länder', 'Förnybar kapacitet växer snabbt']
  },
  'befolkningstillväxt': {
    title: 'Befolkningstillväxt',
    scientificBasis: 'Snabb befolkningstillväxt ökar trycket på resurser och infrastruktur om inte ekonomin växer snabbare.',
    sources: [
      { title: 'World Population Prospects', type: 'data', source: 'UN DESA Population Division', year: 2022 },
      { title: 'Demographic Transition Theory', type: 'study', source: 'Population and Development Review', year: 2015 },
    ],
    whatThisProves: [
      'Demografisk transition sker i förutsägbara steg',
      'Utbildning sänker fertiliteten'
    ],
    limitations: ['Befolkningsprognoser är osäkra', 'Migrationsmönster svåra att förutse']
  },
  'svaga-institutioner': {
    title: 'Svaga institutioner',
    scientificBasis: 'Institutionell kvalitet avgör samhällets förmåga att leverera tjänster, upprätthålla lag och möjliggöra ekonomisk utveckling.',
    sources: [
      { title: 'Why Nations Fail', type: 'book', source: 'Acemoglu & Robinson', year: 2012 },
      { title: 'Worldwide Governance Indicators', type: 'data', source: 'World Bank', year: 2023 },
    ],
    whatThisProves: [
      'Inkluderande institutioner korrelerar med välstånd',
      'Korruption underminerar ekonomisk utveckling'
    ],
    limitations: ['Institutionell förändring är långsam', 'Mätning av "kvalitet" är subjektiv']
  },
  'historisk-evidens': {
    title: 'Historisk evidens',
    scientificBasis: 'Påståendet stöds av dokumenterade historiska fall och longitudinella data.',
    sources: [
      { title: 'Historical Database', type: 'data', source: 'Maddison Project', year: 2020 },
      { title: 'Comparative Historical Analysis', type: 'book', source: 'Mahoney & Thelen', year: 2015 },
    ],
    whatThisProves: [
      'Mönster kan identifieras över tid',
      'Historiska analogier ger lärdomar'
    ],
    limitations: ['Historiska analogier är begränsade', 'Kontext förändras']
  },

  // ═══ VIABILITY CONNECTION TERMS ═══
  'arbete': {
    title: 'Arbete',
    scientificBasis: 'Tillgång till meningsfull sysselsättning är grundläggande för ekonomisk trygghet, självständighet och social integration.',
    sources: [
      { title: 'Employment Outlook', type: 'report', source: 'OECD', year: 2023 },
      { title: 'Arbetsmarknadsekonomi', type: 'book', source: 'Cahuc & Zylberberg', year: 2014 },
    ],
    whatThisProves: [
      'Arbetslöshet korrelerar med ohälsa och social exkludering',
      'Sysselsättningsgrad påverkar statsfinanserna',
      'Arbetsmarknadsintegration är mätbar'
    ],
    limitations: [
      'Kvalitet på arbete varierar kraftigt',
      'Informellt arbete syns inte i statistiken'
    ]
  },
  'trygghet': {
    title: 'Trygghet',
    scientificBasis: 'Upplevd och faktisk säkerhet påverkar livskvalitet, boendemönster och ekonomisk aktivitet.',
    sources: [
      { title: 'Global Peace Index', type: 'data', source: 'Institute for Economics & Peace', year: 2023 },
      { title: 'Nationella trygghetsundersökningen (NTU)', type: 'report', source: 'Brå', year: 2023 },
    ],
    whatThisProves: [
      'Brottslighet påverkar bostadspriser och segregation',
      'Otrygghet har mätbara ekonomiska konsekvenser'
    ],
    limitations: [
      'Upplevd trygghet ≠ faktisk säkerhet',
      'Mediebevakning påverkar perception'
    ]
  },
  'integrationens-tempo': {
    title: 'Integrationens tempo',
    scientificBasis: 'Hastigheten för språk-, arbetsmarknads- och social integration avgör långsiktiga utfall för nyanlända och mottagarsamhälle.',
    sources: [
      { title: 'MIPEX Migration Integration Policy Index', type: 'data', source: 'Barcelona Centre for International Affairs', year: 2020 },
      { title: 'Establishing Migrants', type: 'report', source: 'OECD/EU', year: 2018 },
    ],
    whatThisProves: [
      'Tidiga arbetsmarknadsinsatser förbättrar integration',
      'Integration är en mätbar process, inte ett binärt tillstånd'
    ],
    limitations: [
      'Integration är multidimensionell',
      'Tidsaxlar varierar per grupp och region'
    ]
  },
  'institutionell-kapacitet': {
    title: 'Institutionell kapacitet',
    scientificBasis: 'Institutioners förmåga att leverera tjänster, upprätthålla lagar och anpassa sig avgör samhällets resiliens.',
    sources: [
      { title: 'Worldwide Governance Indicators', type: 'data', source: 'World Bank', year: 2023 },
      { title: 'Quality of Government Dataset', type: 'data', source: 'University of Gothenburg', year: 2023 },
    ],
    whatThisProves: [
      'Kapacitet korrelerar med utfall i vård, skola och integration',
      'Kapacitetsbrister är mätbara'
    ],
    limitations: [
      'Kapacitet varierar lokalt, aggregat kan dölja problem',
      'Mätning är delvis subjektiv'
    ]
  },
  'skuld': {
    title: 'Skuld (exkluderad variabel)',
    scientificBasis: 'Moraliska tillskrivanden av skuld saknar mätbar grund i data och leder till polarisering snarare än problemlösning.',
    sources: [
      { title: 'Moral Foundations Theory', type: 'study', source: 'Haidt & Graham', year: 2007 },
      { title: 'Language of public policy', type: 'book', source: 'Deborah Stone', year: 2012 },
    ],
    whatThisProves: [
      'Skuldretorik aktiverar affekt, inte analys',
      'Fokus på skuld skymmer mekanismer'
    ],
    limitations: [
      'Ansvarsutkrävande är legitim demokratifunktion',
      'Distinktion mellan skuld och ansvar krävs'
    ],
    context: 'Detta system undviker skuldterminologi för att hålla fokus på mätbara effekter och åtgärdbara variabler.'
  },
  'identitet': {
    title: 'Identitet (exkluderad variabel)',
    scientificBasis: 'Identitetskategorier som etnicitet, religion och nationalitet är socialt konstruerade och inte direkt kausala för samhällsutfall.',
    sources: [
      { title: 'Ethnic Boundaries and Inequalities', type: 'book', source: 'Wimmer', year: 2013 },
      { title: 'Social Identities', type: 'study', source: 'Tajfel & Turner', year: 1979 },
    ],
    whatThisProves: [
      'Identitet medierar andra variabler (diskriminering, nätverk)',
      'Grupptillhörighet är inte prediktiv utan kontext'
    ],
    limitations: [
      'Identitet påverkar upplevelser och möjligheter',
      'Att ignorera kan dölja diskriminering'
    ],
    context: 'Systemet fokuserar på strukturella variabler (utbildning, inkomst, anställning) snarare än grupptillhörighet.'
  },
  'ideologi': {
    title: 'Ideologi (exkluderad variabel)',
    scientificBasis: 'Politisk ideologi är ett ramverk för tolkning, inte en oberoende variabel som förklarar samhällsutfall.',
    sources: [
      { title: 'Ideology and Politics', type: 'book', source: 'Freeden', year: 2003 },
      { title: 'Political psychology', type: 'study', source: 'Jost et al.', year: 2009 },
    ],
    whatThisProves: [
      'Ideologi korrelerar med policypreferenser, inte direkt med utfall',
      'Fokus på ideologi polariserar snarare än informerar'
    ],
    limitations: [
      'Politiska beslut påverkas av ideologi',
      'Att utesluta helt är inte möjligt'
    ],
    context: 'Systemet visar utfall av policyer utan att attribuera till ideologisk "sida".'
  }
};

// ═══════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════

const getSourceTypeLabel = (type: string): string => {
  return SOURCE_TYPE_LABELS[type] || 'KÄLLA';
};

const normalizeKey = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[åä]/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
};

// ═══════════════════════════════════════════════════════════════
// EXPANDABLE BADGE COMPONENT
// ═══════════════════════════════════════════════════════════════

export interface ExpandableBadgeProps {
  /** The badge text */
  text: string;
  /** Optional evidence key override (otherwise derived from text) */
  evidenceKey?: string;
  /** Badge variant */
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  /** Additional className */
  className?: string;
  /** Custom fallback evidence if not in registry */
  fallbackEvidence?: Partial<BadgeEvidence>;
}

export const ExpandableBadge: React.FC<ExpandableBadgeProps> = ({
  text,
  evidenceKey,
  variant = 'outline',
  className,
  fallbackEvidence,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Derive key from text or use provided key
  const key = evidenceKey || normalizeKey(text);
  
  // Get evidence from registry or use fallback
  const evidence: BadgeEvidence = BADGE_EVIDENCE_REGISTRY[key] || {
    title: text,
    scientificBasis: fallbackEvidence?.scientificBasis || 'Dokumentation under utveckling för denna komponent.',
    sources: fallbackEvidence?.sources || [],
    whatThisProves: fallbackEvidence?.whatThisProves || [],
    limitations: fallbackEvidence?.limitations || ['Fullständig evidensdokumentation pågår.'],
    ...fallbackEvidence
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Badge 
          variant={variant} 
          className={cn(
            "cursor-pointer transition-all hover:bg-primary/10 hover:border-primary/50 group min-h-[44px] px-3 py-2 text-sm",
            className
          )}
        >
          {text}
          <span className="text-xs ml-1 opacity-50 group-hover:opacity-100 transition-opacity">→</span>
        </Badge>
      </DialogTrigger>
      
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-primary">[EVIDENS]</span>
            {evidence.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-2">
          {/* Scientific Basis */}
          <Card className="bg-muted/30">
            <CardHeader className="pb-2 pt-3">
              <CardTitle className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                VETENSKAPLIG GRUND
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-3">
              <p className="text-sm text-muted-foreground">{evidence.scientificBasis}</p>
            </CardContent>
          </Card>
          
          {/* Context if available */}
          {evidence.context && (
            <Card className="bg-amber-50/30 dark:bg-amber-950/10 border-amber-200/50">
              <CardContent className="py-3">
                <p className="text-xs text-muted-foreground">{evidence.context}</p>
              </CardContent>
            </Card>
          )}
          
          {/* Sources - CLICKABLE with real links */}
          {evidence.sources.length > 0 && (
            <Card>
              <CardHeader className="pb-2 pt-3">
                <CardTitle className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                  KÄLLOR ({evidence.sources.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-3 space-y-2">
                {evidence.sources.map((source, idx) => (
                  <ClickableSource key={idx} source={source} />
                ))}
              </CardContent>
            </Card>
          )}
          
          {/* What this proves - CLICKABLE for deeper understanding */}
          {evidence.whatThisProves.length > 0 && (
            <Card className="bg-green-50/30 dark:bg-green-950/10 border-green-200/50">
              <CardHeader className="pb-1 pt-2">
                <CardTitle className="text-xs font-mono uppercase tracking-wider text-green-700 dark:text-green-400">
                  DETTA VISAR
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  Klicka på varje punkt för att förstå varför
                </p>
              </CardHeader>
              <CardContent className="pb-2 space-y-1">
                {evidence.whatThisProves.map((point, idx) => (
                  <ClickableProofPoint 
                    key={idx} 
                    point={point} 
                    type="proof"
                    parentContext={evidence.title}
                  />
                ))}
              </CardContent>
            </Card>
          )}
          
          {/* Limitations - CLICKABLE for deeper understanding */}
          {evidence.limitations.length > 0 && (
            <Card className="bg-amber-50/30 dark:bg-amber-950/10 border-amber-200/50">
              <CardHeader className="pb-1 pt-2">
                <CardTitle className="text-xs font-mono uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  BEGRÄNSNINGAR
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  Klicka för att förstå vad detta betyder
                </p>
              </CardHeader>
              <CardContent className="pb-2 space-y-1">
                {evidence.limitations.map((point, idx) => (
                  <ClickableProofPoint 
                    key={idx} 
                    point={point} 
                    type="limitation"
                    parentContext={evidence.title}
                  />
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ═══════════════════════════════════════════════════════════════
// CLICKABLE SOURCE COMPONENT
// ═══════════════════════════════════════════════════════════════

interface ClickableSourceProps {
  source: BadgeEvidence['sources'][0];
}

const ClickableSource: React.FC<ClickableSourceProps> = ({ source }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Generate Google Scholar search URL if no direct URL
  const searchUrl = source.url || 
    `https://scholar.google.com/scholar?q=${encodeURIComponent(source.title + ' ' + source.source)}`;
  
  return (
    <div className="border rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-start gap-2 p-2 hover:bg-muted/50 transition-colors text-left"
      >
        <span className="text-xs font-mono uppercase text-muted-foreground shrink-0">
          [{getSourceTypeLabel(source.type)}]
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium">{source.title}</p>
          <p className="text-xs text-muted-foreground">
            {source.source}{source.year && ` (${source.year})`}
          </p>
        </div>
        <span className="text-xs opacity-50">{isExpanded ? '−' : '+'}</span>
      </button>
      
      {isExpanded && (
        <div className="p-3 bg-muted/30 border-t space-y-3">
          <div>
            <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">
              VAD DENNA KÄLLA HANDLAR OM
            </p>
            <p className="text-xs">
              {getSourceExplanation(source)}
            </p>
          </div>
          
          <div>
            <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">
              VARFÖR VI ANVÄNDER DEN
            </p>
            <p className="text-xs">
              {getSourceRelevance(source)}
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="text-xs h-7" asChild>
              <a href={searchUrl} target="_blank" rel="noopener noreferrer">
                Läs källan →
              </a>
            </Button>
            <Button variant="ghost" size="sm" className="text-xs h-7" asChild>
              <a 
                href={`https://scholar.google.com/scholar?q=${encodeURIComponent(source.title)}`} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Sök fler studier
              </a>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

function getSourceExplanation(source: BadgeEvidence['sources'][0]): string {
  const explanations: Record<string, string> = {
    'study': 'En vetenskaplig studie som har granskats av andra forskare (peer review) innan publicering.',
    'report': 'En officiell rapport från en organisation som samlar in och analyserar data.',
    'book': 'En bok skriven av experter inom området, ofta med djupare analys än kortare artiklar.',
    'data': 'Ren statistik och siffror från officiella datakällor.',
    'law': 'Lagtext eller officiellt regelverk som styr hur saker fungerar.'
  };
  return explanations[source.type] || 'En källa som ger evidens för påståendet.';
}

function getSourceRelevance(source: BadgeEvidence['sources'][0]): string {
  if (source.title.toLowerCase().includes('stiglitz') || source.title.toLowerCase().includes('mismeasuring')) {
    return 'Stiglitz-kommissionen (med två Nobelpristagare) fick i uppdrag att utreda alternativ till BNP. Deras slutsatser är brett accepterade.';
  }
  if (source.title.toLowerCase().includes('spirit level')) {
    return 'The Spirit Level visade med data från 23 länder att ojämlikhet korrelerar med sämre hälsa, brottslighet och livskvalitet.';
  }
  if (source.title.toLowerCase().includes('capability')) {
    return 'Amartya Sen fick Nobelpriset i ekonomi för sitt arbete med "capability approach" – att mäta vad människor faktiskt kan göra.';
  }
  return `Denna källa är relevant för att den ger ${source.type === 'data' ? 'hårda siffror' : 'vetenskapligt stöd'} för påståendet.`;
}

// ═══════════════════════════════════════════════════════════════
// CLICKABLE PROOF/LIMITATION POINT
// ═══════════════════════════════════════════════════════════════

interface ClickableProofPointProps {
  point: string;
  type: 'proof' | 'limitation';
  parentContext: string;
}

const ClickableProofPoint: React.FC<ClickableProofPointProps> = ({ point, type, parentContext }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const explanation = getPointExplanation(point, type, parentContext);
  
  return (
    <div className="border rounded overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "w-full flex items-start gap-2 p-2 text-left transition-colors",
          type === 'proof' 
            ? "hover:bg-green-100/50 dark:hover:bg-green-900/20" 
            : "hover:bg-amber-100/50 dark:hover:bg-amber-900/20"
        )}
      >
        <span className={cn(
          "mt-0.5 shrink-0",
          type === 'proof' ? "text-green-500" : "text-amber-500"
        )}>
          {type === 'proof' ? '✓' : '⚠'}
        </span>
        <span className="text-xs flex-1">{point}</span>
        <span className="text-xs opacity-50">{isExpanded ? '−' : '+'}</span>
      </button>
      
      {isExpanded && (
        <div className={cn(
          "p-3 border-t space-y-2",
          type === 'proof' 
            ? "bg-green-50/50 dark:bg-green-950/20" 
            : "bg-amber-50/50 dark:bg-amber-950/20"
        )}>
          <div>
            <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">
              VAD BETYDER DETTA?
            </p>
            <p className="text-xs">{explanation.meaning}</p>
          </div>
          
          <div>
            <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">
              VARFÖR ÄR DET VIKTIGT?
            </p>
            <p className="text-xs">{explanation.importance}</p>
          </div>
          
          {explanation.example && (
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">
                EXEMPEL
              </p>
              <p className="text-xs italic">{explanation.example}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface PointExplanation {
  meaning: string;
  importance: string;
  example?: string;
}

function getPointExplanation(point: string, type: 'proof' | 'limitation', context: string): PointExplanation {
  // BNP-related explanations
  if (point.toLowerCase().includes('bnp') && point.toLowerCase().includes('korrelerar')) {
    return {
      meaning: 'När ett land blir rikare (mätt i BNP) så blir inte människor automatiskt lyckligare eller friskare efter en viss nivå.',
      importance: 'Det visar att pengar inte löser allt. Efter att grundbehoven är täckta spelar andra saker större roll – som relationer, hälsa och frihet.',
      example: 'USA har mycket högre BNP per person än Costa Rica, men Costa Rica har nästan samma förväntade livslängd och högre självrapporterad lycka.'
    };
  }
  
  if (point.toLowerCase().includes('fördelning')) {
    return {
      meaning: 'Det spelar större roll hur pengarna fördelas mellan människor än hur mycket pengar ett land totalt har.',
      importance: 'Ett land kan ha hög BNP men ändå ha många fattiga om pengarna är ojämnt fördelade.',
      example: 'Brasilien har hög BNP men stor ojämlikhet. Sverige har lägre BNP men jämnare fördelning och högre livskvalitet för de flesta.'
    };
  }
  
  if (point.toLowerCase().includes('negativa externaliteter')) {
    return {
      meaning: '"Externaliteter" är effekter som inte syns i prislappen. Föroreningar är negativt men kan öka BNP (fabriker producerar mer). Att städa upp föroreningar ökar också BNP!',
      importance: 'BNP räknar både problemet och lösningen som "tillväxt". Det betyder att BNP kan stiga även när samhället faktiskt mår sämre.',
      example: 'En oljeolycka sänker inte BNP – tvärtom. Städningen, sjukvården och reparationerna räknas som ekonomisk aktivitet.'
    };
  }
  
  // Limitation explanations
  if (point.toLowerCase().includes('fortfarande nödvändigt') || point.toLowerCase().includes('resursfördelning')) {
    return {
      meaning: 'Även om BNP inte mäter välbefinnande perfekt, behöver vi ändå resurser. Pengar köper mat, medicin och tak över huvudet.',
      importance: 'Kritik mot BNP betyder inte att ekonomi är oviktigt – det betyder att vi behöver fler mått, inte färre.',
      example: 'Ett fattigt land behöver först öka sin BNP för att kunna erbjuda grundläggande vård och utbildning.'
    };
  }
  
  if (point.toLowerCase().includes('svårare att mäta')) {
    return {
      meaning: 'Det är lättare att räkna pengar än att mäta lycka, frihet eller mening. Alternativa mått är mer komplicerade.',
      importance: 'Enklare mått vinner ofta över bättre mått, även om de bättre måtten ger en sannare bild.',
      example: 'BNP beräknas varje kvartal. Ett "lyckoindex" kräver omfattande enkäter och subjektiva bedömningar.'
    };
  }
  
  // Generic explanations based on type
  if (type === 'proof') {
    return {
      meaning: `Detta är något som data och forskning visar inom området "${context}".`,
      importance: 'Det hjälper oss förstå hur verkligheten fungerar, inte bara hur vi tror att den fungerar.',
      example: undefined
    };
  } else {
    return {
      meaning: `Detta är en begränsning vi måste ha i åtanke när vi tolkar information om "${context}".`,
      importance: 'Ingen mätning är perfekt. Att veta begränsningarna hjälper oss undvika felaktiga slutsatser.',
      example: undefined
    };
  }
}

// Export registry for external use
export { BADGE_EVIDENCE_REGISTRY };
export type { BadgeEvidence };
