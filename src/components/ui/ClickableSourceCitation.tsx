/**
 * CLICKABLE SOURCE CITATION
 * 
 * Compliance-compliant source citations with real, aggregated links.
 * Every source must be traceable to primary data.
 * 
 * Design: No icons, text-based markers only.
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
// SOURCE REGISTRY - Real, verifiable links
// ═══════════════════════════════════════════════════════════════

export interface SourceLink {
  name: string;
  url: string;
  type: 'primary' | 'secondary' | 'archive';
  description: string;
  lastAccessed?: string;
  datasetId?: string;
}

export interface AggregatedSource {
  categoryName: string;
  description: string;
  methodology: string;
  updateFrequency: string;
  primarySources: SourceLink[];
  secondarySources: SourceLink[];
  qualityAssurance: string;
  evidenceHash?: string;
}

const SOURCE_REGISTRY: Record<string, AggregatedSource> = {
  'historical-archives': {
    categoryName: 'Historiska arkiv och akademisk forskning',
    description: 'Aggregerade data från akademiska institutioner, nationella arkiv och peer-reviewed historisk forskning.',
    methodology: 'Systematisk litteraturgenomgång med triangulering mellan multipla primärkällor. Konsensusbedömning vid motstridiga uppgifter.',
    updateFrequency: 'Vid publicering av nya akademiska studier',
    primarySources: [
      {
        name: 'Armed Conflict Location & Event Data Project (ACLED)',
        url: 'https://acleddata.com/',
        type: 'primary',
        description: 'Detaljerad konfliktdata för Afrika, Asien och Mellanöstern sedan 1997',
        lastAccessed: '2024-01',
        datasetId: 'ACLED-2024'
      },
      {
        name: 'Uppsala Conflict Data Program (UCDP)',
        url: 'https://ucdp.uu.se/',
        type: 'primary',
        description: 'Definierande databas för väpnade konflikter sedan 1946',
        lastAccessed: '2024-01',
        datasetId: 'UCDP-GED-24'
      },
      {
        name: 'UN OCHA Humanitarian Data Exchange',
        url: 'https://data.humdata.org/',
        type: 'primary',
        description: 'FN:s humanitära dataportalen med realtidsdata',
        lastAccessed: '2024-01'
      },
      {
        name: 'World Bank Open Data',
        url: 'https://data.worldbank.org/',
        type: 'primary',
        description: 'Ekonomiska och sociala indikatorer för alla länder',
        lastAccessed: '2024-01'
      }
    ],
    secondarySources: [
      {
        name: 'Council on Foreign Relations - Global Conflict Tracker',
        url: 'https://www.cfr.org/global-conflict-tracker',
        type: 'secondary',
        description: 'Kurerat sammandrag av pågående konflikter'
      },
      {
        name: 'International Crisis Group',
        url: 'https://www.crisisgroup.org/',
        type: 'secondary',
        description: 'Expertanalys och tidiga varningssignaler'
      }
    ],
    qualityAssurance: 'Alla konfliktdata korsvalideras mellan ACLED, UCDP och FN-källor. Avvikelser noteras explicit.'
  },
  
  'undp-worldbank-who': {
    categoryName: 'UNDP, World Bank, WHO',
    description: 'Officiella indikatorer från FN-systemet och internationella finansinstitutioner.',
    methodology: 'Standardiserad rapportering enligt internationella definitioner (SDG, ICD, SNA). Kvalitetskontroll via peer-review mellan organisationer.',
    updateFrequency: 'Årlig uppdatering; preliminära data kvartalsvis för utvalda indikatorer',
    primarySources: [
      {
        name: 'UNDP Human Development Data Center',
        url: 'https://hdr.undp.org/data-center',
        type: 'primary',
        description: 'Human Development Index och relaterade indikatorer',
        lastAccessed: '2024-01',
        datasetId: 'HDR-2023-24'
      },
      {
        name: 'World Bank Development Indicators',
        url: 'https://databank.worldbank.org/source/world-development-indicators',
        type: 'primary',
        description: '1,400+ indikatorer för 217 länder',
        lastAccessed: '2024-01',
        datasetId: 'WDI-2024'
      },
      {
        name: 'WHO Global Health Observatory',
        url: 'https://www.who.int/data/gho',
        type: 'primary',
        description: 'Hälsostatistik för alla WHO-medlemsländer',
        lastAccessed: '2024-01'
      },
      {
        name: 'UN Statistics Division',
        url: 'https://unstats.un.org/home/',
        type: 'primary',
        description: 'SDG-indikatorer och nationalräkenskaper'
      }
    ],
    secondarySources: [
      {
        name: 'Our World in Data',
        url: 'https://ourworldindata.org/',
        type: 'secondary',
        description: 'Pedagogiska visualiseringar baserade på primärdata'
      },
      {
        name: 'Gapminder',
        url: 'https://www.gapminder.org/data/',
        type: 'secondary',
        description: 'Historiska tidsserier och visualiseringsverktyg'
      }
    ],
    qualityAssurance: 'Officiell statistik med metoddokumentation. Revisioner noteras i metadata. Täckningsgrad och datakvalitet varierar per land.'
  },
  
  'international-organizations': {
    categoryName: 'Internationella organisationer',
    description: 'Aggregerade data från mellanstatliga organisationer med global täckning.',
    methodology: 'Harmoniserad datainsamling via nationella statistikbyråer med kvalitetskontroll enligt internationella standarder.',
    updateFrequency: 'Varierar per organisation: månadsvis till årligt',
    primarySources: [
      {
        name: 'OECD Data',
        url: 'https://data.oecd.org/',
        type: 'primary',
        description: 'Ekonomiska och sociala indikatorer för OECD-länder',
        lastAccessed: '2024-01'
      },
      {
        name: 'IMF Data',
        url: 'https://data.imf.org/',
        type: 'primary',
        description: 'Makroekonomiska och finansiella indikatorer'
      },
      {
        name: 'ILO STAT',
        url: 'https://ilostat.ilo.org/',
        type: 'primary',
        description: 'Arbetsmarknadsstatistik enligt internationella definitioner'
      },
      {
        name: 'FAO STAT',
        url: 'https://www.fao.org/faostat/',
        type: 'primary',
        description: 'Jordbruks- och livsmedelsdata'
      },
      {
        name: 'UNESCO Institute for Statistics',
        url: 'http://data.uis.unesco.org/',
        type: 'primary',
        description: 'Utbildnings- och kulturstatistik'
      }
    ],
    secondarySources: [
      {
        name: 'Eurostat',
        url: 'https://ec.europa.eu/eurostat',
        type: 'secondary',
        description: 'Detaljerad statistik för EU-länder'
      }
    ],
    qualityAssurance: 'Multilateral validering. Jämförbarhet mellan länder säkerställs via gemensamma definitioner och klassifikationer.'
  },
  
  'methodological-analysis': {
    categoryName: 'Intern metodologisk analys',
    description: 'Analyser baserade på aggregering och transformation av primärdata enligt dokumenterad metodik.',
    methodology: 'Transparent beräkningskedja från rådata till slutpresentation. Alla transformationer versionshanterade.',
    updateFrequency: 'Kontinuerligt vid datauppdatering',
    primarySources: [
      {
        name: 'Metoddokumentation (intern)',
        url: '/methodology',
        type: 'primary',
        description: 'Fullständig beskrivning av beräkningsmetoder'
      }
    ],
    secondarySources: [
      {
        name: 'Data Constitution',
        url: '/data-constitution',
        type: 'secondary',
        description: 'Principer och regler för databehandling'
      }
    ],
    qualityAssurance: 'SHA-256 checksummor för dataintegritet. Fullständig audit trail från källa till presentation.'
  },
  
  'demographic-data': {
    categoryName: 'Demografiska databaser',
    description: 'Befolkningsdata och prognoser från officiella demografiska institutioner.',
    methodology: 'Kohortkomponentmetod för prognoser. Historiska data från folkräkningar och civilregister.',
    updateFrequency: 'Vartannat år (UN WPP); årligt för nationella byråer',
    primarySources: [
      {
        name: 'UN World Population Prospects',
        url: 'https://population.un.org/wpp/',
        type: 'primary',
        description: 'Officiella FN-befolkningsprognoser och historik',
        datasetId: 'WPP-2022'
      },
      {
        name: 'UN World Urbanization Prospects',
        url: 'https://population.un.org/wup/',
        type: 'primary',
        description: 'Urbaniseringsdata och prognoser'
      },
      {
        name: 'Human Mortality Database',
        url: 'https://www.mortality.org/',
        type: 'primary',
        description: 'Detaljerade dödlighetsdata för 40+ länder'
      }
    ],
    secondarySources: [
      {
        name: 'IIASA Population Program',
        url: 'https://iiasa.ac.at/programs/population-and-just-societies',
        type: 'secondary',
        description: 'Alternativa scenarier och metodutveckling'
      }
    ],
    qualityAssurance: 'Officiella FN-data med dokumenterade osäkerhetsintervall för prognoser.'
  },
  
  'national-statistics-nordic': {
    categoryName: 'Nordiska statistikbyråer',
    description: 'Officiell statistik från nationella statistikbyråer i Norden.',
    methodology: 'Totalundersökningar och registerbaserad statistik enligt europeiska standarder (ESS).',
    updateFrequency: 'Månadsvis till årligt beroende på indikator',
    primarySources: [
      {
        name: 'Statistiska centralbyrån (SCB)',
        url: 'https://www.scb.se/',
        type: 'primary',
        description: 'Sveriges officiella statistikmyndighet',
        lastAccessed: '2024-01'
      },
      {
        name: 'Brottsförebyggande rådet (BRÅ)',
        url: 'https://bra.se/statistik.html',
        type: 'primary',
        description: 'Officiell svensk brottsstatistik'
      },
      {
        name: 'Eurostat',
        url: 'https://ec.europa.eu/eurostat',
        type: 'primary',
        description: 'EU:s statistikkontor med harmoniserade data'
      },
      {
        name: 'Statistics Denmark',
        url: 'https://www.dst.dk/',
        type: 'primary',
        description: 'Danmarks statistik'
      },
      {
        name: 'Statistics Norway (SSB)',
        url: 'https://www.ssb.no/',
        type: 'primary',
        description: 'Statistisk sentralbyrå'
      },
      {
        name: 'Statistics Finland',
        url: 'https://www.stat.fi/',
        type: 'primary',
        description: 'Tilastokeskus'
      }
    ],
    secondarySources: [
      {
        name: 'Nordic Statistics',
        url: 'https://www.nordicstatistics.org/',
        type: 'secondary',
        description: 'Jämförbar nordisk statistik'
      }
    ],
    qualityAssurance: 'Officiell statistik enligt europeiska kvalitetsstandarder. Registerbaserade data med hög täckningsgrad.'
  }
};

// ═══════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════

export interface ClickableSourceCitationProps {
  /** Source category key from registry */
  sourceKey: keyof typeof SOURCE_REGISTRY | string;
  /** Optional custom display text */
  displayText?: string;
  /** Optional additional class */
  className?: string;
}

export const ClickableSourceCitation: React.FC<ClickableSourceCitationProps> = ({
  sourceKey,
  displayText,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const source = SOURCE_REGISTRY[sourceKey as keyof typeof SOURCE_REGISTRY];
  
  if (!source) {
    // Fallback for unregistered sources
    return (
      <div className={cn("text-xs text-muted-foreground", className)}>
        <span className="font-mono text-[10px]">[SRC]</span>
        <span className="ml-1">{displayText || sourceKey}</span>
        <span className="ml-2 text-[10px] text-amber-500">[KÄLLA SAKNAR REGISTRERING]</span>
      </div>
    );
  }
  
  
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className={className}>
      <CollapsibleTrigger className="group cursor-pointer w-full text-left">
        <div className="flex items-center gap-2 text-xs text-primary hover:text-primary/80 transition-colors">
          <span className="font-mono text-[10px]">[SRC]</span>
          <span className="flex-1 underline underline-offset-2 decoration-dotted">
            Källa: {displayText || source.categoryName}
          </span>
          <span className="font-mono text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
            {isOpen ? '[−]' : '[VISA KÄLLOR]'}
          </span>
        </div>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="mt-3">
        <Card className="bg-muted/30 border-primary/20">
          <CardHeader className="pb-2 pt-3">
            <CardTitle className="text-xs font-mono uppercase tracking-wider text-primary">
              AGGREGERADE DATAKÄLLOR
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">{source.description}</p>
          </CardHeader>
          
          <CardContent className="space-y-4 pb-4">
            {/* Primary Sources */}
            <div>
              <span className="font-mono text-[10px] text-muted-foreground block mb-2">
                PRIMÄRKÄLLOR ({source.primarySources.length})
              </span>
              <ul className="space-y-2">
                {source.primarySources.map((src, idx) => (
                  <li key={idx} className="text-xs">
                    <a 
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-start gap-2 hover:bg-primary/10 p-1.5 -mx-1.5 rounded transition-colors"
                    >
                      <span className="font-mono text-[10px] text-primary shrink-0">[{idx + 1}]</span>
                      <div className="flex-1">
                        <span className="text-primary underline group-hover:no-underline">{src.name}</span>
                        <span className="text-muted-foreground block text-[11px]">{src.description}</span>
                        {src.datasetId && (
                          <Badge variant="outline" className="text-[9px] h-4 mt-1">
                            Dataset: {src.datasetId}
                          </Badge>
                        )}
                      </div>
                      <span className="font-mono text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100">[→]</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Secondary Sources */}
            {source.secondarySources.length > 0 && (
              <div>
                <span className="font-mono text-[10px] text-muted-foreground block mb-2">
                  SEKUNDÄRKÄLLOR ({source.secondarySources.length})
                </span>
                <ul className="space-y-1.5">
                  {source.secondarySources.map((src, idx) => (
                    <li key={idx} className="text-xs">
                      <a 
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 hover:text-primary transition-colors"
                      >
                        <span className="font-mono text-[10px] text-muted-foreground">
                          [{source.primarySources.length + idx + 1}]
                        </span>
                        <span className="underline">{src.name}</span>
                        <span className="font-mono text-[10px]">[→]</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Methodology */}
            <div className="border-t pt-3">
              <span className="font-mono text-[10px] text-muted-foreground block mb-1">
                INSAMLINGSMETODIK
              </span>
              <p className="text-xs text-muted-foreground">{source.methodology}</p>
            </div>
            
            {/* Update Frequency */}
            <div className="flex gap-4">
              <div>
                <span className="font-mono text-[10px] text-muted-foreground block">
                  UPPDATERINGSFREKVENS
                </span>
                <span className="text-xs">{source.updateFrequency}</span>
              </div>
            </div>
            
            {/* Quality Assurance */}
            <div className="p-2 bg-muted rounded">
              <span className="font-mono text-[10px] text-muted-foreground">[QA]</span>
              <span className="text-[11px] text-muted-foreground ml-1">{source.qualityAssurance}</span>
            </div>
            
            {/* Evidence Hash */}
            {source.evidenceHash && (
              <div className="text-[10px] font-mono text-muted-foreground">
                Evidence Hash: {source.evidenceHash}
              </div>
            )}
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );
};

export { SOURCE_REGISTRY };
export default ClickableSourceCitation;
