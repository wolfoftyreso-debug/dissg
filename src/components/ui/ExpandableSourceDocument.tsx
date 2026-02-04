/**
 * EXPANDABLE SOURCE DOCUMENT
 * 
 * "Zero Dead-Ends" Policy - Varje källdokument är klickbart
 * och leder till vår egen sammanfattning OCH originalkällan.
 * 
 * Designprincip: Vi litar inte blint på källor, vi tolkar dem.
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
import {
  ChevronDown,
  BookOpen,
  FileText,
  ExternalLink,
  Database,
  CheckCircle2,
  AlertTriangle,
  Atom,
  Scale,
  Quote,
  Lightbulb,
  Link2,
  MessageSquareQuote,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ═══════════════════════════════════════════════════════════════
// EXTENDED SOURCE DOCUMENT REGISTRY
// ═══════════════════════════════════════════════════════════════

export interface SourceDocumentDetail {
  id: string;
  title: string;
  type: 'book' | 'study' | 'report' | 'law' | 'data' | 'article';
  source: string;
  year: number;
  url?: string;
  relevance: 'primary' | 'supporting' | 'context';
  
  // Our interpretation layer
  ourSummary: string;
  keyFindings: string[];
  howWeUseIt: string;
  criticalNotes?: string[];
  relatedConcepts?: string[];
  
  // Original source info
  originalAbstract?: string;
  citationCount?: number;
  impactFactor?: number;
}

const SOURCE_DOCUMENT_REGISTRY: Record<string, SourceDocumentDetail> = {
  'limits-to-growth-30': {
    id: 'limits-to-growth-30',
    title: 'Limits to Growth: The 30-Year Update',
    type: 'book',
    source: 'Meadows et al., Chelsea Green Publishing',
    year: 2004,
    url: 'https://www.chelseagreen.com/product/limits-to-growth/',
    relevance: 'primary',
    ourSummary: 'Uppdaterad systemdynamisk modell som visar samband mellan fysiska resurser och samhällsutveckling. Bekräftar att ursprungliga scenarion från 1972 i stora drag följer verkligheten.',
    keyFindings: [
      'Exponentiell tillväxt i ett ändligt system leder oundvikligen till gränser',
      '12 scenarion modellerades – de flesta visar "overshoot and collapse" om inte kursen ändras',
      'Tekniska lösningar kan fördröja men inte eliminera fysiska gränser',
      'Tidsfördröjningar i systemet gör tidiga åtgärder kritiska'
    ],
    howWeUseIt: 'Grundmodell för att förstå relationen mellan befolkning, resurser, produktion och föroreningar. Används för att kalibrera långsiktiga scenarion i bärkraftsberäkningar.',
    criticalNotes: [
      'Modellen är aggregerad – saknar regional detalj',
      'Teknologisk utveckling kan ändra parametrar',
      'Originalstudien kritiserades för pessimism, men 30-årsuppföljningen visar god träffsäkerhet'
    ],
    relatedConcepts: ['Systemdynamik', 'Overshoot', 'Bärkraft', 'Exponentiell tillväxt'],
    citationCount: 12500
  },
  'planetary-boundaries-2015': {
    id: 'planetary-boundaries-2015',
    title: 'Planetary boundaries: Guiding human development on a changing planet',
    type: 'study',
    source: 'Science, Steffen et al.',
    year: 2015,
    url: 'https://www.science.org/doi/10.1126/science.1259855',
    relevance: 'primary',
    ourSummary: 'Kvantifierar nio planetära gränser som definierar ett "säkert operationsutrymme" för mänskligheten. Fyra gränser är redan överskridna.',
    keyFindings: [
      'Nio planetära gränser identifierade: klimat, biologisk mångfald, markanvändning, sötvatten, kväve/fosfor, havsförsurning, ozon, aerosoler, nya kemikalier',
      'Klimatförändring och biologisk mångfald är "kärngränser" – överskridande påverkar alla andra',
      'Kväve- och fosforkretsloppen är kraftigt överskridna',
      'Gränserna interagerar – att överskrida en kan destabilisera andra'
    ],
    howWeUseIt: 'Ram för att definiera fysiska constraints i GCCE-modellen. Varje planetär gräns kopplas till relaterade KPI:er.',
    criticalNotes: [
      'Exakta tröskelvärden är osäkra',
      'Regional variation fångas inte',
      'Ramverket är normativt – "säkert" kräver värderingar'
    ],
    relatedConcepts: ['Jordsystemvetenskap', 'Tipping points', 'Safe operating space'],
    citationCount: 8900,
    impactFactor: 56.9
  },
  'energy-wealth-nations': {
    id: 'energy-wealth-nations',
    title: 'Energy and the Wealth of Nations',
    type: 'book',
    source: 'Hall & Klitgaard, Springer',
    year: 2018,
    relevance: 'supporting',
    ourSummary: 'Etablerar kausaliteten mellan energianvändning och ekonomisk produktion. Visar att BNP-tillväxt historiskt kräver energitillväxt.',
    keyFindings: [
      'BNP korrelerar starkt med total energianvändning (r² > 0.9)',
      'EROI (Energy Return on Investment) är central för ekonomisk utveckling',
      'Fallande EROI från fossila bränslen skapar ekonomiska utmaningar',
      '"Decoupling" (BNP-tillväxt utan energitillväxt) är extremt sällsynt historiskt'
    ],
    howWeUseIt: 'Grund för energi-ekonomi-kopplingen i bärkraftsberäkningar. Används för att validera antaganden om energibehov per capita.',
    criticalNotes: [
      'Tjänsteekonomi kan öka BNP/energi-ratio något',
      'Förnybar energi har annan EROI-profil',
      'Framtida teknik kan ändra sambandet'
    ],
    relatedConcepts: ['EROI', 'Biofysisk ekonomi', 'Energideterminism']
  },
  'world-energy-outlook-2023': {
    id: 'world-energy-outlook-2023',
    title: 'World Energy Outlook 2023',
    type: 'report',
    source: 'International Energy Agency (IEA)',
    year: 2023,
    url: 'https://www.iea.org/reports/world-energy-outlook-2023',
    relevance: 'primary',
    ourSummary: 'IEA:s årliga flaggskeppsrapport om global energi. Inkluderar tre scenarion: Stated Policies (STEPS), Announced Pledges (APS), och Net Zero Emissions (NZE).',
    keyFindings: [
      'Fossila bränslen förväntas nå topp före 2030 under alla scenarion',
      'Förnybar elproduktion växer snabbt, men inte tillräckligt för NZE',
      'Energiinvesteringar behöver tredubblas för att nå klimatmål',
      'Energifattigdom kvarstår för hundratals miljoner'
    ],
    howWeUseIt: 'Primär datakälla för energiscenarier och prognoser. Används för att kalibrera framtida energitillgång i bärkraftsberäkningar.',
    criticalNotes: [
      'IEA har historiskt underskattat förnybar tillväxt',
      'Scenarion är inte prognoser utan "vad-om"-analyser',
      'Politiska antaganden kan ändras snabbt'
    ],
    relatedConcepts: ['Energitransition', 'Klimatscenarier', 'Peak fossil']
  }
};

// ═══════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════

const getDocumentIcon = (type: SourceDocumentDetail['type']) => {
  switch (type) {
    case 'study': return <Atom className="h-4 w-4 text-purple-500" />;
    case 'report': return <FileText className="h-4 w-4 text-blue-500" />;
    case 'law': return <Scale className="h-4 w-4 text-amber-500" />;
    case 'data': return <Database className="h-4 w-4 text-green-500" />;
    case 'book': return <BookOpen className="h-4 w-4 text-orange-500" />;
    case 'article': return <FileText className="h-4 w-4 text-cyan-500" />;
  }
};

const getDocumentTypeName = (type: SourceDocumentDetail['type']) => {
  switch (type) {
    case 'study': return 'Vetenskaplig studie';
    case 'report': return 'Officiell rapport';
    case 'law': return 'Lagstiftning';
    case 'data': return 'Statistik';
    case 'book': return 'Akademisk bok';
    case 'article': return 'Artikel';
  }
};

const normalizeDocumentKey = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[åä]/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .substring(0, 50);
};

// ═══════════════════════════════════════════════════════════════
// EXPANDABLE SOURCE DOCUMENT COMPONENT
// ═══════════════════════════════════════════════════════════════

export interface ExpandableSourceDocumentProps {
  /** Document ID from registry or inline document data */
  documentId?: string;
  /** Inline document if not in registry */
  document?: Partial<SourceDocumentDetail> & { title: string; source: string; year: number };
  /** Visual variant based on relevance */
  variant?: 'primary' | 'supporting' | 'context';
  /** Additional className */
  className?: string;
}

export const ExpandableSourceDocument: React.FC<ExpandableSourceDocumentProps> = ({
  documentId,
  document: inlineDoc,
  variant,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Get document from registry or use inline
  const registryDoc = documentId ? SOURCE_DOCUMENT_REGISTRY[documentId] : null;
  const doc: SourceDocumentDetail = registryDoc || {
    id: inlineDoc?.id || normalizeDocumentKey(inlineDoc?.title || 'unknown'),
    title: inlineDoc?.title || 'Okänd källa',
    type: inlineDoc?.type || 'book',
    source: inlineDoc?.source || 'Okänd',
    year: inlineDoc?.year || 0,
    url: inlineDoc?.url,
    relevance: inlineDoc?.relevance || variant || 'supporting',
    ourSummary: inlineDoc?.ourSummary || 'Sammanfattning under utveckling.',
    keyFindings: inlineDoc?.keyFindings || [],
    howWeUseIt: inlineDoc?.howWeUseIt || 'Dokumentation av användning pågår.',
    criticalNotes: inlineDoc?.criticalNotes,
    relatedConcepts: inlineDoc?.relatedConcepts,
  };
  
  const effectiveVariant = variant || doc.relevance;
  
  const variantStyles = {
    primary: 'bg-primary/5 border-primary/20 hover:border-primary/40',
    supporting: 'bg-muted/30 hover:bg-muted/50',
    context: 'bg-muted/20 hover:bg-muted/30',
  };
  
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <div className={cn(
          "p-3 rounded-lg border transition-all cursor-pointer group",
          variantStyles[effectiveVariant],
          isOpen && "ring-2 ring-primary/30",
          className
        )}>
          <div className="flex items-start gap-3">
            {getDocumentIcon(doc.type)}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <p className="text-sm font-medium">{doc.title}</p>
                {effectiveVariant === 'primary' && (
                  <Badge className="text-xs h-5">Primär</Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {doc.source} ({doc.year})
              </p>
              <p className="text-xs mt-2 line-clamp-2">{doc.ourSummary}</p>
              
              {/* Expand indicator */}
              <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                <Badge variant="outline" className="text-xs opacity-60 group-hover:opacity-100">
                  Klicka för vår analys
                </Badge>
                {doc.url && (
                  <span className="flex items-center gap-1">
                    <Link2 className="h-3 w-3" />
                    + originalkälla
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              <Badge variant="outline" className="text-xs">
                {getDocumentTypeName(doc.type)}
              </Badge>
              <ChevronDown className={cn(
                "h-4 w-4 transition-transform text-muted-foreground",
                isOpen && "rotate-180"
              )} />
            </div>
          </div>
        </div>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="mt-2 space-y-3 pl-4 border-l-2 border-primary/30 ml-4">
        {/* Our Summary */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-2 pt-3">
            <CardTitle className="text-xs flex items-center gap-2">
              <MessageSquareQuote className="h-3.5 w-3.5 text-primary" />
              Vår tolkning
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-3">
            <p className="text-sm">{doc.ourSummary}</p>
          </CardContent>
        </Card>
        
        {/* Key Findings */}
        {doc.keyFindings.length > 0 && (
          <Card>
            <CardHeader className="pb-2 pt-3">
              <CardTitle className="text-xs flex items-center gap-2">
                <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
                Nyckelfynd
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-3">
              <ul className="space-y-1.5">
                {doc.keyFindings.map((finding, idx) => (
                  <li key={idx} className="text-xs flex items-start gap-2">
                    <span className="text-primary mt-0.5 font-bold">{idx + 1}.</span>
                    {finding}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
        
        {/* How We Use It */}
        <Card className="bg-blue-50/30 dark:bg-blue-950/10 border-blue-200/50">
          <CardHeader className="pb-2 pt-3">
            <CardTitle className="text-xs flex items-center gap-2 text-blue-700 dark:text-blue-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Hur vi använder detta
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-3">
            <p className="text-xs">{doc.howWeUseIt}</p>
          </CardContent>
        </Card>
        
        {/* Critical Notes */}
        {doc.criticalNotes && doc.criticalNotes.length > 0 && (
          <Card className="bg-amber-50/30 dark:bg-amber-950/10 border-amber-200/50">
            <CardHeader className="pb-2 pt-3">
              <CardTitle className="text-xs flex items-center gap-2 text-amber-700 dark:text-amber-400">
                <AlertTriangle className="h-3.5 w-3.5" />
                Kritiska noteringar
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-3">
              <ul className="space-y-1">
                {doc.criticalNotes.map((note, idx) => (
                  <li key={idx} className="text-xs flex items-start gap-1.5">
                    <span className="text-amber-500 mt-0.5">⚠</span>
                    {note}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
        
        {/* Related Concepts */}
        {doc.relatedConcepts && doc.relatedConcepts.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {doc.relatedConcepts.map((concept, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {concept}
              </Badge>
            ))}
          </div>
        )}
        
        {/* Citation info and Original Source Link */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {doc.citationCount && (
              <span className="flex items-center gap-1">
                <Quote className="h-3 w-3" />
                {doc.citationCount.toLocaleString()} citeringar
              </span>
            )}
            {doc.impactFactor && (
              <span>IF: {doc.impactFactor}</span>
            )}
          </div>
          {doc.url && (
            <Button variant="outline" size="sm" className="h-7" asChild>
              <a href={doc.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3 w-3 mr-1.5" />
                Läs originalkälla
              </a>
            </Button>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

// Export registry for external use
export { SOURCE_DOCUMENT_REGISTRY };
