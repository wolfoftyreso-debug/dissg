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
import {
  ChevronRight,
  BookOpen,
  FileText,
  ExternalLink,
  Database,
  CheckCircle2,
  AlertTriangle,
  Atom,
  Scale,
} from 'lucide-react';
import { cn } from '@/lib/utils';

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
  }
};

// ═══════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════

const getSourceIcon = (type: string) => {
  switch (type) {
    case 'study': return <Atom className="h-3.5 w-3.5 text-purple-500" />;
    case 'report': return <FileText className="h-3.5 w-3.5 text-blue-500" />;
    case 'law': return <Scale className="h-3.5 w-3.5 text-amber-500" />;
    case 'data': return <Database className="h-3.5 w-3.5 text-green-500" />;
    case 'book': return <BookOpen className="h-3.5 w-3.5 text-orange-500" />;
    default: return <FileText className="h-3.5 w-3.5" />;
  }
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
            "cursor-pointer transition-all hover:bg-primary/10 hover:border-primary/50 group",
            className
          )}
        >
          {text}
          <ChevronRight className="h-3 w-3 ml-1 opacity-50 group-hover:opacity-100 transition-opacity" />
        </Badge>
      </DialogTrigger>
      
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-4 w-4 text-primary" />
            {evidence.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-2">
          {/* Scientific Basis */}
          <Card className="bg-muted/30">
            <CardHeader className="pb-2 pt-3">
              <CardTitle className="text-xs flex items-center gap-2">
                <Atom className="h-3.5 w-3.5 text-purple-500" />
                Vetenskaplig grund
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
          
          {/* Sources */}
          {evidence.sources.length > 0 && (
            <Card>
              <CardHeader className="pb-2 pt-3">
                <CardTitle className="text-xs flex items-center gap-2">
                  <FileText className="h-3.5 w-3.5 text-blue-500" />
                  Källor ({evidence.sources.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-3 space-y-2">
                {evidence.sources.map((source, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-2 rounded bg-muted/30">
                    {getSourceIcon(source.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{source.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {source.source}{source.year && ` (${source.year})`}
                      </p>
                    </div>
                    {source.url && (
                      <Button variant="ghost" size="sm" className="h-6 px-2" asChild>
                        <a href={source.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
          
          {/* What this proves / Limitations */}
          <div className="grid gap-3 md:grid-cols-2">
            {evidence.whatThisProves.length > 0 && (
              <Card className="bg-green-50/30 dark:bg-green-950/10 border-green-200/50">
                <CardHeader className="pb-1 pt-2">
                  <CardTitle className="text-xs flex items-center gap-2 text-green-700 dark:text-green-400">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Detta visar
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <ul className="space-y-0.5">
                    {evidence.whatThisProves.map((point, idx) => (
                      <li key={idx} className="text-xs flex items-start gap-1.5">
                        <span className="text-green-500 mt-0.5">✓</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
            
            {evidence.limitations.length > 0 && (
              <Card className="bg-amber-50/30 dark:bg-amber-950/10 border-amber-200/50">
                <CardHeader className="pb-1 pt-2">
                  <CardTitle className="text-xs flex items-center gap-2 text-amber-700 dark:text-amber-400">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Begränsningar
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <ul className="space-y-0.5">
                    {evidence.limitations.map((point, idx) => (
                      <li key={idx} className="text-xs flex items-start gap-1.5">
                        <span className="text-amber-500 mt-0.5">⚠</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Export registry for external use
export { BADGE_EVIDENCE_REGISTRY };
export type { BadgeEvidence };
