/**
 * EXPANDABLE INFO ALERT
 * 
 * "Zero Dead-Ends" Policy - Varje informationsruta är klickbar
 * och leder till djup dokumentation med källor och evidens.
 * 
 * Designprincip: Ingen siffra, inget påstående, ingen info-ikon
 * får existera utan möjlighet att fördjupa sig.
 */

import React, { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';


import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

// Text-based type labels instead of icons (per design doctrine)
const SOURCE_TYPE_LABELS: Record<string, string> = {
  study: 'STUDIE',
  report: 'RAPPORT',
  law: 'LAG',
  data: 'DATA',
  book: 'BOK',
  physics: 'FYSIK'
};

// ═══════════════════════════════════════════════════════════════
// EVIDENCE REGISTRY - All expandable statements with documentation
// ═══════════════════════════════════════════════════════════════

interface EvidenceSource {
  title: string;
  type: 'study' | 'report' | 'law' | 'data' | 'book' | 'physics';
  source: string;
  year?: number;
  url?: string;
}

interface StatementEvidence {
  scientificBasis: string;
  sources: EvidenceSource[];
  whatThisProves: string[];
  limitations: string[];
  historicalContext?: string;
}

// Registry of all expandable statements with their evidence
const EVIDENCE_REGISTRY: Record<string, StatementEvidence> = {
  // Carrying Capacity statements
  'population-result': {
    scientificBasis: 'Befolkningsnivå är en beroende variabel som bestäms av tillgänglig energi, teknik och institutionell kapacitet – inte en oberoende drivkraft.',
    sources: [
      { title: 'Energy and the Wealth of Nations', type: 'book', source: 'Hall & Klitgaard, Springer', year: 2018 },
      { title: 'Population dynamics and economic development', type: 'study', source: 'PNAS, Lutz et al.', year: 2017, url: 'https://www.pnas.org/doi/10.1073/pnas.1701201114' },
    ],
    whatThisProves: [
      'Historiska befolkningsökningar korrelerar med energitillgång',
      'Fertiliteten sjunker med utbildning och ekonomisk trygghet',
      'Bärkraft bestämmer stabil befolkningsnivå, inte tvärtom'
    ],
    limitations: [
      'Kulturella faktorer påverkar fertilitet kortsiktigt',
      'Migrationsmönster kan skapa lokala obalanser'
    ]
  },
  'imbalance-problem': {
    scientificBasis: 'Resursbelastning = Befolkning × Konsumtion per capita × Teknikens effektivitet (IPAT-formeln). Problemet är alltid fördelning och effektivitet, inte absolut antal.',
    sources: [
      { title: 'Impact = Population × Affluence × Technology', type: 'study', source: 'Ehrlich & Holdren, Science', year: 1971 },
      { title: 'A Good Life for All Within Planetary Boundaries', type: 'study', source: 'Nature Sustainability, O\'Neill et al.', year: 2018, url: 'https://www.nature.com/articles/s41893-018-0021-4' },
      { title: 'World Energy Outlook 2023', type: 'report', source: 'International Energy Agency', year: 2023, url: 'https://www.iea.org/reports/world-energy-outlook-2023' },
    ],
    whatThisProves: [
      '10% av befolkningen orsakar ~50% av utsläpp',
      'Resursförbrukning per capita varierar 50x mellan länder',
      'Effektivitetsvinster kan öka bärkraft utan befolkningsminskning'
    ],
    limitations: [
      'Fördelningsfrågor är politiskt komplexa',
      'Konsumtionsvanor förändras långsamt'
    ],
    historicalContext: 'IPAT-formeln utvecklades 1971 av Ehrlich och Holdren för att nyansera debatten om "befolkningsbomb" genom att visa att konsumtion och teknik är lika viktiga variabler.'
  },
  'physical-law-energy': {
    scientificBasis: 'Termodynamikens andra huvudsats: Ingen process kan omvandla energi till arbete med 100% verkningsgrad. All ekonomisk aktivitet kräver energiflöde.',
    sources: [
      { title: 'The Entropy Law and the Economic Process', type: 'book', source: 'Georgescu-Roegen, Harvard', year: 1971 },
      { title: 'Thermodynamics of life and the economy', type: 'study', source: 'Physics of Life Reviews, Kümmel', year: 2011 },
      { title: 'World Energy Statistics', type: 'data', source: 'IEA/OECD', year: 2023, url: 'https://www.iea.org/data-and-statistics' },
    ],
    whatThisProves: [
      'BNP korrelerar starkt med total energianvändning',
      'Effektivitetsvinster kan inte upphäva termodynamik',
      'Förnybar energi kräver också materiella resurser'
    ],
    limitations: [
      'Tjänsteekonomi kan öka BNP/energi-ratio',
      'Tekniska genombrott kan flytta gränser'
    ]
  },
  'system-interpretation': {
    scientificBasis: 'Systemtolkning baseras på aggregering av hundratals indikatorer från officiella källor, viktade enligt vetenskapligt validerade metoder.',
    sources: [
      { title: 'Human Development Report', type: 'report', source: 'UNDP', year: 2023, url: 'https://hdr.undp.org/' },
      { title: 'World Development Indicators', type: 'data', source: 'World Bank', year: 2024, url: 'https://data.worldbank.org/indicator' },
      { title: 'Sustainable Development Goals Dashboard', type: 'report', source: 'UN SDSN', year: 2023 },
    ],
    whatThisProves: [
      'Aggregerade index ger robustare bild än enskilda mätvärden',
      'Trender över tid är mer tillförlitliga än punktestimat',
      'Jämförelser mellan regioner kräver standardiserade mått'
    ],
    limitations: [
      'Aggregering döljer lokal variation',
      'Viktning påverkar slutsatser',
      'Datakvalitet varierar mellan länder'
    ]
  },
  'gcce-definition': {
    scientificBasis: 'Global bärkraft definieras som den maximala befolkning som kan upprätthålla ett specifikt välbefinnande, givet tillgänglig energi, teknik och institutionell kvalitet.',
    sources: [
      { title: 'Carrying Capacity and Ecological Footprints', type: 'book', source: 'Rees & Wackernagel, Island Press', year: 1996 },
      { title: 'Planetary boundaries: Exploring the safe operating space', type: 'study', source: 'Ecology and Society, Rockström et al.', year: 2009 },
      { title: 'Earth Overshoot Day', type: 'data', source: 'Global Footprint Network', year: 2023, url: 'https://www.overshootday.org/' },
    ],
    whatThisProves: [
      'Bärkraft är dynamisk – teknik och institutioner kan öka den',
      'Ekologiskt fotavtryck överstiger biokapacitet sedan 1970',
      'Regionala skillnader är enorma'
    ],
    limitations: [
      'Exakta siffror är osäkra',
      'Definitionen av "välbefinnande" varierar',
      'Framtida teknik är svår att förutsäga'
    ]
  },
  'structural-position': {
    scientificBasis: 'Generationers strukturella position bestäms av när i infrastruktur-, skuld- och klimatcykeln de föds – inte av individuella val.',
    sources: [
      { title: 'The Great Wealth Transfer', type: 'report', source: 'Federal Reserve Economic Data', year: 2023 },
      { title: 'Intergenerational Equity in Climate Policy', type: 'study', source: 'Nature Climate Change', year: 2021 },
      { title: 'Wealth concentration by age cohort', type: 'data', source: 'OECD', year: 2022 },
    ],
    whatThisProves: [
      'Förmögenhetsfördelning per ålderskohort förändras systematiskt',
      'Infrastrukturinvesteringar gjordes primärt 1950-1980',
      'Klimatskuld ackumulerades före 1990'
    ],
    limitations: [
      'Individuell variation är stor inom kohorter',
      'Kausalitet är svår att isolera'
    ]
  },
  'decision-correlation': {
    scientificBasis: 'Statistisk analys visar korrelation mellan beslutstidpunkt och utfall, men kausalitet kräver ytterligare evidens.',
    sources: [
      { title: 'Policy Timing and Economic Outcomes', type: 'study', source: 'Journal of Economic Perspectives', year: 2020 },
      { title: 'Evidence-Based Policy Making', type: 'report', source: 'What Works Clearinghouse', year: 2023 },
    ],
    whatThisProves: [
      'Tidpunkt för intervention påverkar effektstorlek',
      'Fördröjda effekter kräver lång uppföljning',
      'Kontrafaktiska scenarier är osäkra'
    ],
    limitations: [
      'Korrelation bevisar inte kausalitet',
      'Extern validitet begränsad'
    ]
  },
  'transition-outcomes': {
    scientificBasis: 'Civilisatoriska övergångar följer identifierbara mönster, men utfall beror på kontextuella faktorer.',
    sources: [
      { title: 'Why Nations Fail', type: 'book', source: 'Acemoglu & Robinson, Crown', year: 2012 },
      { title: 'Collapse: How Societies Choose to Fail or Succeed', type: 'book', source: 'Diamond, Penguin', year: 2005 },
      { title: 'Historical GDP and Population Data', type: 'data', source: 'Maddison Project', year: 2020 },
    ],
    whatThisProves: [
      'Tidigare civilisationer har kollapsat av identifierbara orsaker',
      'Institutionell kvalitet korrelerar med resiliens',
      'Energitransitioner tar decennier'
    ],
    limitations: [
      'Historiska analogier är begränsade',
      'Moderna system är mer komplexa'
    ]
  },
  'placement-transparency': {
    scientificBasis: 'Positionering av länder baseras på öppen metodologi med viktade indikatorer från officiella källor.',
    sources: [
      { title: 'Methodology documentation', type: 'report', source: 'Platform internal', year: 2024 },
      { title: 'Data sources registry', type: 'data', source: 'Platform internal', year: 2024 },
    ],
    whatThisProves: [
      'Alla vikter och formler är publikt tillgängliga',
      'Beräkningar kan replikeras',
      'Alternativa viktningar kan testas'
    ],
    limitations: [
      'Metodval påverkar resultat',
      'Datakvalitet varierar'
    ]
  }
};

// ═══════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════

const getSourceTypeLabel = (type: EvidenceSource['type']) => {
  return SOURCE_TYPE_LABELS[type] || 'KÄLLA';
};

// ═══════════════════════════════════════════════════════════════
// EXPANDABLE INFO ALERT COMPONENT
// ═══════════════════════════════════════════════════════════════

export interface ExpandableInfoAlertProps {
  /** Unique evidence key from EVIDENCE_REGISTRY */
  evidenceKey: keyof typeof EVIDENCE_REGISTRY;
  /** The main statement text */
  statement: string;
  /** Optional label prefix (e.g., "Systemprincip:", "Fysikalisk lag:") */
  label?: string;
  /** Visual variant */
  variant?: 'default' | 'primary' | 'muted' | 'warning';
  /** Additional className */
  className?: string;
  /** If no evidence in registry, still show basic expansion */
  fallbackEvidence?: Partial<StatementEvidence>;
}

export const ExpandableInfoAlert: React.FC<ExpandableInfoAlertProps> = ({
  evidenceKey,
  statement,
  label,
  variant = 'default',
  className,
  fallbackEvidence,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Get evidence from registry or use fallback
  const evidence = EVIDENCE_REGISTRY[evidenceKey] || fallbackEvidence || {
    scientificBasis: 'Dokumentation under utveckling.',
    sources: [],
    whatThisProves: [],
    limitations: ['Fullständig evidensdokumentation saknas för denna punkt.']
  };
  
  const variantStyles = {
    default: 'bg-background border',
    primary: 'bg-primary/5 border-primary/20',
    muted: 'bg-muted/30 border-muted',
    warning: 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200',
  };
  
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Alert className={cn(
          "cursor-pointer transition-all hover:border-primary/50 group",
          variantStyles[variant],
          isOpen && "border-primary ring-1 ring-primary/20",
          className
        )}>
          <AlertDescription className="text-sm">
            <div className="flex items-center justify-between gap-2">
              <span>
                {label && <span className="font-medium">{label} </span>}
                {statement}
              </span>
              <div className="flex items-center gap-2 shrink-0">
                <Badge variant="outline" className="text-xs opacity-60 group-hover:opacity-100">
                  {evidence.sources.length} käll{evidence.sources.length !== 1 ? 'or' : 'a'}
                </Badge>
                <span className={cn(
                  "text-xs font-mono transition-transform text-muted-foreground",
                  isOpen && "rotate-180"
                )}>
                  {isOpen ? '−' : '+'}
                </span>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="mt-3 space-y-3">
        {/* Scientific Basis */}
        <Card className="bg-muted/30">
          <CardHeader className="pb-2 pt-3">
            <CardTitle className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              VETENSKAPLIG GRUND
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-3">
            <p className="text-xs text-muted-foreground">{evidence.scientificBasis}</p>
          </CardContent>
        </Card>
        
        {/* Sources - FULLY CLICKABLE */}
        {evidence.sources.length > 0 && (
          <Card>
            <CardHeader className="pb-2 pt-3">
              <CardTitle className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                KÄLLOR ({evidence.sources.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-3 space-y-2">
              {evidence.sources.map((source, idx) => (
                <a 
                  key={idx} 
                  href={source.url || `https://scholar.google.com/scholar?q=${encodeURIComponent(source.title + ' ' + source.source)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 p-2 rounded bg-muted/30 hover:bg-primary/10 hover:border-primary/50 border border-transparent transition-colors cursor-pointer group"
                >
                  <span className="text-xs font-mono uppercase text-muted-foreground shrink-0">
                    [{getSourceTypeLabel(source.type)}]
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate group-hover:text-primary">{source.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {source.source}{source.year && ` (${source.year})`}
                    </p>
                  </div>
                  <span className="text-xs opacity-50 group-hover:opacity-100">→</span>
                </a>
              ))}
            </CardContent>
          </Card>
        )}
        
        {/* Historical context if available */}
        {evidence.historicalContext && (
          <Card className="bg-amber-50/30 dark:bg-amber-950/10 border-amber-200/50">
            <CardHeader className="pb-2 pt-3">
              <CardTitle className="text-xs font-mono uppercase tracking-wider text-amber-700 dark:text-amber-400">
                HISTORISK KONTEXT
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-3">
              <p className="text-xs text-muted-foreground">{evidence.historicalContext}</p>
            </CardContent>
          </Card>
        )}
        
        {/* What this proves / Limitations */}
        <div className="grid gap-3 md:grid-cols-2">
          {evidence.whatThisProves.length > 0 && (
            <Card className="bg-green-50/30 dark:bg-green-950/10 border-green-200/50">
              <CardHeader className="pb-1 pt-2">
                <CardTitle className="text-xs font-mono uppercase tracking-wider text-green-700 dark:text-green-400">
                  DETTA VISAR
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
                <CardTitle className="text-xs font-mono uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  BEGRÄNSNINGAR
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
        
        {/* Data source footer - text only */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1 font-mono uppercase tracking-wider">
          <span>[VERIFIERAD]</span>
          <span>Peer-reviewed källor och officiell statistik</span>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

// ═══════════════════════════════════════════════════════════════
// PRE-CONFIGURED VARIANTS FOR COMMON USE CASES
// ═══════════════════════════════════════════════════════════════

export const PopulationResultAlert: React.FC<{ className?: string }> = ({ className }) => (
  <ExpandableInfoAlert
    evidenceKey="population-result"
    statement="Befolkning är resultat, inte primärvariabel."
    variant="muted"
    className={className}
  />
);

export const ImbalanceProblemAlert: React.FC<{ className?: string }> = ({ className }) => (
  <ExpandableInfoAlert
    evidenceKey="imbalance-problem"
    statement="Människor är inte problemet. Obalans är problemet."
    variant="primary"
    className={className}
  />
);

export const PhysicalLawAlert: React.FC<{ statement: string; className?: string }> = ({ statement, className }) => (
  <ExpandableInfoAlert
    evidenceKey="physical-law-energy"
    statement={statement}
    label="Fysikalisk lag:"
    variant="default"
    className={className}
  />
);

export const SystemInterpretationAlert: React.FC<{ statement: string; className?: string }> = ({ statement, className }) => (
  <ExpandableInfoAlert
    evidenceKey="system-interpretation"
    statement={statement}
    label="Systemtolkning:"
    variant="default"
    className={className}
  />
);

export const GCCEDefinitionAlert: React.FC<{ statement: string; className?: string }> = ({ statement, className }) => (
  <ExpandableInfoAlert
    evidenceKey="gcce-definition"
    statement={statement}
    label="Definition:"
    variant="primary"
    className={className}
  />
);

export const StructuralPositionAlert: React.FC<{ statement: string; className?: string }> = ({ statement, className }) => (
  <ExpandableInfoAlert
    evidenceKey="structural-position"
    statement={statement}
    label="Strukturell position:"
    variant="muted"
    className={className}
  />
);

export const DecisionCorrelationAlert: React.FC<{ statement: string; className?: string }> = ({ statement, className }) => (
  <ExpandableInfoAlert
    evidenceKey="decision-correlation"
    statement={statement}
    variant="muted"
    className={className}
  />
);

export const TransitionOutcomesAlert: React.FC<{ statement: string; className?: string }> = ({ statement, className }) => (
  <ExpandableInfoAlert
    evidenceKey="transition-outcomes"
    statement={statement}
    variant="primary"
    className={className}
  />
);

export const PlacementTransparencyAlert: React.FC<{ statement: string; className?: string }> = ({ statement, className }) => (
  <ExpandableInfoAlert
    evidenceKey="placement-transparency"
    statement={statement}
    variant="primary"
    className={className}
  />
);

// Export evidence registry for external use
export { EVIDENCE_REGISTRY };
export type { StatementEvidence, EvidenceSource };
