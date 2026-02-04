/**
 * SYSTEM PRINCIPLE EXPANDER
 * 
 * Klickbara informationsrutor med tunga dokument i ryggen.
 * När man klickar vecklas ett helt nytt avsnitt upp med:
 * - Källdokument och evidens
 * - Historisk bakgrund
 * - Relaterade indikatorer
 * - Vetenskapliga studier
 */

import React, { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { ExpandableSourceDocument } from '@/components/ui/ExpandableSourceDocument';
import { ExpandableHistoricalEvent } from '@/components/ui/ExpandableHistoricalEvent';
import { ExpandableIndicatorBadge } from '@/components/ui/ExpandableIndicatorBadge';
import { ExpandableProofPoint } from '@/components/ui/ExpandableProofPoint';

// ═══════════════════════════════════════════════════════════════
// PRINCIPLE EVIDENCE DATA
// ═══════════════════════════════════════════════════════════════

interface EvidenceDocument {
  id: string;
  title: string;
  type: 'study' | 'report' | 'law' | 'data' | 'book';
  source: string;
  year: number;
  summary: string;
  url?: string;
  relevance: 'primary' | 'supporting';
}

interface HistoricalMilestone {
  year: number;
  event: string;
  significance: string;
}

interface PrincipleEvidence {
  id: string;
  summary: string;
  documents: EvidenceDocument[];
  historicalContext: HistoricalMilestone[];
  relatedIndicators: string[];
  scientificBasis: string;
  whatThisProves: string[];
  limitations: string[];
}

// System principles with their evidence
const PRINCIPLE_EVIDENCE: Record<string, PrincipleEvidence> = {
  'welfare-physical': {
    id: 'welfare-physical',
    summary: 'Alla välfärdsfrågor bottnar i fysisk kapacitet — därför landar allt här.',
    scientificBasis: 'Termodynamikens lagar, ekologisk ekonomi, biofysiska begränsningar för samhällen.',
    documents: [
      {
        id: 'doc1',
        title: 'Limits to Growth: The 30-Year Update',
        type: 'book',
        source: 'Meadows et al., Chelsea Green Publishing',
        year: 2004,
        summary: 'Uppdaterad systemdynamisk modell som visar samband mellan fysiska resurser och samhällsutveckling.',
        url: 'https://www.chelseagreen.com/product/limits-to-growth/',
        relevance: 'primary'
      },
      {
        id: 'doc2',
        title: 'Planetary boundaries: Guiding human development on a changing planet',
        type: 'study',
        source: 'Science, Steffen et al.',
        year: 2015,
        summary: 'Nio planetära gränser definierar det säkra operationsområdet för mänskligheten.',
        url: 'https://www.science.org/doi/10.1126/science.1259855',
        relevance: 'primary'
      },
      {
        id: 'doc3',
        title: 'Energy and the Wealth of Nations',
        type: 'book',
        source: 'Hall & Klitgaard, Springer',
        year: 2018,
        summary: 'BNP korrelerar starkt med energianvändning. Ekonomisk tillväxt kräver energitillväxt.',
        relevance: 'supporting'
      },
      {
        id: 'doc4',
        title: 'World Energy Outlook',
        type: 'report',
        source: 'International Energy Agency (IEA)',
        year: 2023,
        summary: 'Årlig rapport om global energiproduktion, konsumtion och framtidsscenarier.',
        url: 'https://www.iea.org/reports/world-energy-outlook-2023',
        relevance: 'primary'
      }
    ],
    historicalContext: [
      { year: 1972, event: 'Limits to Growth publiceras', significance: 'Första systemdynamiska modellen av globala resursbegränsningar' },
      { year: 1987, event: 'Brundtlandkommissionen', significance: 'Hållbar utveckling definieras som begrepp' },
      { year: 2009, event: 'Planetary Boundaries introduceras', significance: 'Stockholm Resilience Centre kvantifierar säkra gränser' },
      { year: 2015, event: 'Parisavtalet', significance: 'Global konsensus om klimatbegränsningar' }
    ],
    relatedIndicators: ['ENERGY_PER_CAPITA', 'BIOCAPACITY', 'ECOLOGICAL_FOOTPRINT', 'EROI'],
    whatThisProves: [
      'Välbefinnande kräver materiella resurser (energi, vatten, mat)',
      'Ekonomisk aktivitet är bunden till fysiska flöden',
      'Det finns absoluta gränser för resursuttag',
      'Teknik kan öka effektivitet men inte upphäva termodynamik'
    ],
    limitations: [
      'Säger inget om hur resurser ska fördelas',
      'Kvantifierar inte lycka eller meningsfullhet',
      'Regionala variationer kan vara stora',
      'Teknologiska språng kan flytta gränser'
    ]
  },
  'population-capacity': {
    id: 'population-capacity',
    summary: 'Vi måste matcha mänskligt antal med faktisk systemkapacitet – annars sjunker levnadsförmågan.',
    scientificBasis: 'Ekologisk bärkraft, resursekonomi, demografisk transitionsteori.',
    documents: [
      {
        id: 'doc5',
        title: 'Human population and the global environment',
        type: 'study',
        source: 'American Scientist, Ehrlich & Holdren',
        year: 1974,
        summary: 'IPAT-formeln: Impact = Population × Affluence × Technology',
        relevance: 'primary'
      },
      {
        id: 'doc6',
        title: 'World Population Prospects',
        type: 'report',
        source: 'United Nations DESA',
        year: 2022,
        summary: 'FN:s officiella befolkningsprognoser fram till 2100.',
        url: 'https://population.un.org/wpp/',
        relevance: 'primary'
      },
      {
        id: 'doc7',
        title: 'The return of the population bomb',
        type: 'study',
        source: 'Nature Climate Change, O\'Neill et al.',
        year: 2020,
        summary: 'Befolkningsstorlek är en signifikant faktor för koldioxidutsläpp.',
        relevance: 'supporting'
      },
      {
        id: 'doc8',
        title: 'Global Assessment Report on Biodiversity',
        type: 'report',
        source: 'IPBES',
        year: 2019,
        summary: 'En miljon arter hotas av utrotning, befolkningstillväxt är en drivkraft.',
        url: 'https://ipbes.net/global-assessment',
        relevance: 'primary'
      }
    ],
    historicalContext: [
      { year: 1798, event: 'Malthus: An Essay on the Principle of Population', significance: 'Första systematiska analysen av befolkning och resurser' },
      { year: 1968, event: 'The Population Bomb publiceras', significance: 'Ökad medvetenhet om befolkningstillväxt' },
      { year: 1994, event: 'Kairokonferensen', significance: 'Internationell konsensus om reproduktiva rättigheter' },
      { year: 2022, event: 'Världens befolkning passerar 8 miljarder', significance: 'Historisk milstolpe' }
    ],
    relatedIndicators: ['FERTILITY_RATE', 'POPULATION_GROWTH', 'CARRYING_CAPACITY', 'DEPENDENCY_RATIO'],
    whatThisProves: [
      'Fler människor kräver mer resurser (ceteris paribus)',
      'Demografisk transition sänker födelsetal med utveckling',
      'Befolkning × konsumtion = total belastning',
      'Regionala obalanser skapar migrationstryck'
    ],
    limitations: [
      'Säger inget om önskvärd befolkningsnivå',
      'Konsumtion per capita varierar enormt',
      'Teknologi kan öka bärkraft',
      'Etiska frågor om befolkningspolitik exkluderas'
    ]
  }
};

// ═══════════════════════════════════════════════════════════════
// DATABASE HOOKS
// ═══════════════════════════════════════════════════════════════

function useRelatedKpiData(kpiCodes: string[]) {
  return useQuery({
    queryKey: ['principle-kpis', kpiCodes],
    queryFn: async () => {
      if (kpiCodes.length === 0) return [];
      
      const { data, error } = await supabase
        .from('kpi_definitions')
        .select('id, code, name, name_sv, unit, description')
        .in('code', kpiCodes);
      
      if (error) {
        console.error('Error fetching KPIs:', error);
        return [];
      }
      return data || [];
    },
    enabled: kpiCodes.length > 0,
  });
}

function useDataConstitutionArticles(principleId: string) {
  return useQuery({
    queryKey: ['constitution-articles', principleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('data_constitution_articles')
        .select('*')
        .order('article_number', { ascending: true })
        .limit(3);
      
      if (error) {
        console.error('Error fetching constitution articles:', error);
        return [];
      }
      return data || [];
    },
    enabled: !!principleId,
  });
}

// Document icon and type helpers moved to ExpandableSourceDocument component

// ═══════════════════════════════════════════════════════════════
// EXPANDABLE PRINCIPLE COMPONENT
// ═══════════════════════════════════════════════════════════════

interface ExpandablePrincipleProps {
  principleId: 'welfare-physical' | 'population-capacity';
  variant?: 'default' | 'prominent';
  className?: string;
}

export const ExpandablePrinciple: React.FC<ExpandablePrincipleProps> = ({
  principleId,
  variant = 'default',
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const evidence = PRINCIPLE_EVIDENCE[principleId];
  const { data: relatedKpis, isLoading: kpisLoading } = useRelatedKpiData(evidence?.relatedIndicators || []);
  const { data: constitutionArticles } = useDataConstitutionArticles(principleId);
  
  if (!evidence) return null;
  
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        {variant === 'prominent' ? (
          <Card className={cn(
            "cursor-pointer transition-all hover:border-primary/50 group",
            "bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20",
            isOpen && "border-primary ring-1 ring-primary/20",
            className
          )}>
            <CardContent className="pt-6 text-center">
              <p className="text-sm font-medium max-w-lg mx-auto group-hover:text-primary transition-colors">
                {evidence.summary}
              </p>
              <Separator className="my-4" />
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <span>Inte ideologi. Inte klimatmoral. Inte tillväxtoptimism. Bara fysik, biologi, teknik och mänskligt välbefinnande.</span>
              </div>
              <div className="mt-4 flex items-center justify-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {evidence.documents.length} källdokument
                </Badge>
                <ChevronDown className={cn(
                  "h-4 w-4 transition-transform",
                  isOpen && "rotate-180"
                )} />
              </div>
            </CardContent>
          </Card>
        ) : (
          <Alert className={cn(
            "cursor-pointer transition-all hover:border-primary/50 group",
            "bg-primary/5 border-primary/20",
            isOpen && "border-primary ring-1 ring-primary/20",
            className
          )}>
            <AlertDescription className="text-sm">
              <div className="flex items-center justify-between">
                <span>
                  <Badge variant="secondary" className="mr-2 font-mono text-xs">PRINCIP</Badge>
                  {evidence.summary}
                </span>
                <div className="flex items-center gap-2 ml-4">
                  <Badge variant="outline" className="text-xs">
                    {evidence.documents.length} källor
                  </Badge>
                  <ChevronDown className={cn(
                    "h-4 w-4 transition-transform",
                    isOpen && "rotate-180"
                  )} />
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CollapsibleTrigger>
      
      <CollapsibleContent className="mt-4 space-y-4">
        {/* Scientific Basis */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              VETENSKAPLIG GRUND
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{evidence.scientificBasis}</p>
          </CardContent>
        </Card>
        
        {/* Source Documents - Now Expandable */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              KÄLLDOKUMENT ({evidence.documents.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {evidence.documents.map((doc) => (
              <ExpandableSourceDocument
                key={doc.id}
                document={{
                  id: doc.id,
                  title: doc.title,
                  type: doc.type,
                  source: doc.source,
                  year: doc.year,
                  url: doc.url,
                  relevance: doc.relevance,
                  ourSummary: doc.summary,
                  keyFindings: [],
                  howWeUseIt: 'Används som evidensbas för systemprinciper och bärkraftsberäkningar.',
                }}
                variant={doc.relevance}
              />
            ))}
          </CardContent>
        </Card>
        
        {/* Historical Context - Now Expandable */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              HISTORISK KONTEXT ({evidence.historicalContext.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-border" />
              <div className="space-y-4">
                {evidence.historicalContext.map((milestone, idx) => (
                  <ExpandableHistoricalEvent
                    key={idx}
                    event={{
                      year: milestone.year,
                      event: milestone.event,
                      significance: milestone.significance,
                    }}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Related Indicators from Database */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              RELATERADE INDIKATORER
            </CardTitle>
          </CardHeader>
          <CardContent>
            {kpisLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            ) : relatedKpis && relatedKpis.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {relatedKpis.map((kpi: any) => (
                  <ExpandableIndicatorBadge 
                    key={kpi.id}
                    code={kpi.code || kpi.id}
                    displayName={kpi.name_sv || kpi.name}
                    unit={kpi.unit}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {evidence.relatedIndicators.map((code) => (
                  <ExpandableIndicatorBadge 
                    key={code}
                    code={code}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* What This Proves / Limitations */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-mono uppercase tracking-wider text-primary">
                DETTA BEVISAR
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-0">
                {evidence.whatThisProves.map((point, idx) => (
                  <ExpandableProofPoint
                    key={idx}
                    point={point}
                    type="proof"
                  />
                ))}
              </ul>
            </CardContent>
          </Card>
          
          <Card className="border-muted-foreground/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                BEGRÄNSNINGAR
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-0">
                {evidence.limitations.map((point, idx) => (
                  <ExpandableProofPoint
                    key={idx}
                    point={point}
                    type="limitation"
                  />
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
        
        {/* Constitution Articles if available */}
        {constitutionArticles && constitutionArticles.length > 0 && (
          <Card className="bg-muted/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                RELATERADE ARTIKLAR I DATAKONSTITUTIONEN
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {constitutionArticles.map((article: any) => (
                <div key={article.id} className="p-2 rounded border bg-background">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      Artikel {article.article_number}
                    </Badge>
                    <span className="text-sm font-medium">{article.article_title}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{article.principle}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
        
        {/* Data Source Footer */}
        <div className="text-xs text-muted-foreground border-t pt-3 mt-2">
          <span className="font-mono uppercase tracking-wider">KÄLLOR:</span>
          <span className="ml-2">Vetenskapliga publikationer, officiella rapporter, internationella organisationer</span>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

// ═══════════════════════════════════════════════════════════════
// SIMPLE EXPORTS FOR QUICK USE
// ═══════════════════════════════════════════════════════════════

export const WelfarePrincipleExpander: React.FC<{ className?: string }> = ({ className }) => (
  <ExpandablePrinciple principleId="welfare-physical" className={className} />
);

export const PopulationCapacityExpander: React.FC<{ className?: string }> = ({ className }) => (
  <ExpandablePrinciple principleId="population-capacity" variant="prominent" className={className} />
);
