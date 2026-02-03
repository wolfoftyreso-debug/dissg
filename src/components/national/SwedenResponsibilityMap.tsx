import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Building2, 
  MapPin, 
  Globe, 
  Users, 
  GraduationCap, 
  HeartPulse, 
  Shield, 
  Home, 
  Banknote, 
  Scale, 
  TreePine, 
  Briefcase,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Minus,
  Info,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// Types
interface KPILink {
  code: string;
  name: string;
  trend: 'up' | 'down' | 'stable';
  isPositive: boolean;
}

interface Mandate {
  id: string;
  title: string;
  description: string;
  legalBasis?: string;
  responsibleAuthority: string;
  kpis: KPILink[];
}

interface Domain {
  id: string;
  code: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  mandates: {
    national: Mandate[];
    regional: Mandate[];
    municipal: Mandate[];
  };
}

// Comprehensive responsibility data for Sweden
const SWEDEN_RESPONSIBILITY_DATA: Domain[] = [
  {
    id: 'healthcare',
    code: 'A',
    name: 'Hälso- och sjukvård',
    icon: <HeartPulse className="h-5 w-5" />,
    color: 'bg-red-500/20 text-red-400 border-red-500/30',
    description: 'Vård, omsorg och folkhälsa',
    mandates: {
      national: [
        {
          id: 'nat-health-1',
          title: 'Nationell hälsopolitik',
          description: 'Fastställer övergripande mål och ramar för hälso- och sjukvården',
          legalBasis: 'Hälso- och sjukvårdslagen (2017:30)',
          responsibleAuthority: 'Socialdepartementet',
          kpis: [
            { code: 'A01', name: 'Medellivslängd', trend: 'up', isPositive: true },
            { code: 'A02', name: 'Förväntad frisk livslängd', trend: 'stable', isPositive: false }
          ]
        },
        {
          id: 'nat-health-2',
          title: 'Läkemedelstillsyn',
          description: 'Godkännande och övervakning av läkemedel',
          legalBasis: 'Läkemedelslagen (2015:315)',
          responsibleAuthority: 'Läkemedelsverket',
          kpis: [
            { code: 'A03', name: 'Läkemedelsbiverkningar', trend: 'stable', isPositive: true }
          ]
        },
        {
          id: 'nat-health-3',
          title: 'Folkhälsopolitik',
          description: 'Nationella folkhälsomål och strategier',
          responsibleAuthority: 'Folkhälsomyndigheten',
          kpis: [
            { code: 'A04', name: 'Självskattad hälsa', trend: 'down', isPositive: false },
            { code: 'A05', name: 'Psykisk ohälsa 15-24', trend: 'up', isPositive: false }
          ]
        }
      ],
      regional: [
        {
          id: 'reg-health-1',
          title: 'Sjukvårdshuvudman',
          description: 'Ansvar för att erbjuda god hälso- och sjukvård till invånarna',
          legalBasis: 'Hälso- och sjukvårdslagen (2017:30)',
          responsibleAuthority: '21 Regioner',
          kpis: [
            { code: 'A06', name: 'Vårdköer > 90 dagar', trend: 'up', isPositive: false },
            { code: 'A07', name: 'Patientnöjdhet', trend: 'stable', isPositive: false },
            { code: 'A08', name: 'Vårdrelaterade infektioner', trend: 'down', isPositive: true }
          ]
        },
        {
          id: 'reg-health-2',
          title: 'Primärvård',
          description: 'Första linjens vård och vårdcentraler',
          responsibleAuthority: 'Regioner',
          kpis: [
            { code: 'A09', name: 'Tillgång till fast läkarkontakt', trend: 'down', isPositive: false },
            { code: 'A10', name: 'Listade per läkare', trend: 'up', isPositive: false }
          ]
        },
        {
          id: 'reg-health-3',
          title: 'Kollektivtrafik',
          description: 'Regional kollektivtrafik (delat ansvar)',
          responsibleAuthority: 'Regioner',
          kpis: [
            { code: 'F05', name: 'Kollektivtrafikandel', trend: 'stable', isPositive: false }
          ]
        }
      ],
      municipal: [
        {
          id: 'mun-health-1',
          title: 'Hemsjukvård',
          description: 'Vård i hemmet för äldre och funktionsnedsatta',
          legalBasis: 'Hälso- och sjukvårdslagen (2017:30)',
          responsibleAuthority: '290 Kommuner',
          kpis: [
            { code: 'A11', name: 'Hemsjukvårdsbesök/invånare', trend: 'up', isPositive: true }
          ]
        },
        {
          id: 'mun-health-2',
          title: 'Äldreomsorg',
          description: 'Särskilda boenden och hemtjänst för äldre',
          legalBasis: 'Socialtjänstlagen (2001:453)',
          responsibleAuthority: '290 Kommuner',
          kpis: [
            { code: 'A12', name: 'Nöjdhet äldreomsorg', trend: 'stable', isPositive: false },
            { code: 'A13', name: 'Personal per boende', trend: 'down', isPositive: false }
          ]
        }
      ]
    }
  },
  {
    id: 'education',
    code: 'B',
    name: 'Utbildning & Kunskap',
    icon: <GraduationCap className="h-5 w-5" />,
    color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    description: 'Förskola, grundskola, gymnasium och högre utbildning',
    mandates: {
      national: [
        {
          id: 'nat-edu-1',
          title: 'Skollag och läroplan',
          description: 'Nationell styrning av utbildningens innehåll och mål',
          legalBasis: 'Skollagen (2010:800)',
          responsibleAuthority: 'Utbildningsdepartementet',
          kpis: [
            { code: 'B01', name: 'PISA-resultat', trend: 'up', isPositive: true },
            { code: 'B02', name: 'Gymnasiebehörighet', trend: 'down', isPositive: false }
          ]
        },
        {
          id: 'nat-edu-2',
          title: 'Skolinspektion',
          description: 'Granskning av skolors kvalitet och regelefterlevnad',
          responsibleAuthority: 'Skolinspektionen',
          kpis: [
            { code: 'B03', name: 'Andel godkända inspektioner', trend: 'stable', isPositive: false }
          ]
        },
        {
          id: 'nat-edu-3',
          title: 'Högre utbildning',
          description: 'Universitet och högskolor',
          responsibleAuthority: 'UKÄ / Lärosäten',
          kpis: [
            { code: 'B04', name: 'Genomströmning högskola', trend: 'stable', isPositive: false },
            { code: 'B05', name: 'Forskningsanslag/BNP', trend: 'up', isPositive: true }
          ]
        }
      ],
      regional: [
        {
          id: 'reg-edu-1',
          title: 'Regional kompetensförsörjning',
          description: 'Samordning av utbildningsbehov och arbetsmarknad',
          responsibleAuthority: 'Regioner',
          kpis: [
            { code: 'B06', name: 'Matchning utbildning-jobb', trend: 'down', isPositive: false }
          ]
        }
      ],
      municipal: [
        {
          id: 'mun-edu-1',
          title: 'Förskola',
          description: 'Pedagogisk omsorg för barn 1-5 år',
          legalBasis: 'Skollagen (2010:800)',
          responsibleAuthority: '290 Kommuner',
          kpis: [
            { code: 'B07', name: 'Barn per årsarbetare', trend: 'up', isPositive: false },
            { code: 'B08', name: 'Andel behöriga förskollärare', trend: 'down', isPositive: false }
          ]
        },
        {
          id: 'mun-edu-2',
          title: 'Grundskola',
          description: 'Obligatorisk skolgång årskurs F-9',
          legalBasis: 'Skollagen (2010:800)',
          responsibleAuthority: '290 Kommuner',
          kpis: [
            { code: 'B09', name: 'Meritvärde åk 9', trend: 'stable', isPositive: false },
            { code: 'B10', name: 'Behöriga lärare', trend: 'down', isPositive: false },
            { code: 'B11', name: 'Elever per lärare', trend: 'up', isPositive: false }
          ]
        },
        {
          id: 'mun-edu-3',
          title: 'Gymnasium',
          description: 'Frivillig gymnasieutbildning',
          responsibleAuthority: '290 Kommuner',
          kpis: [
            { code: 'B12', name: 'Fullföljd gymnasieutbildning', trend: 'stable', isPositive: false }
          ]
        },
        {
          id: 'mun-edu-4',
          title: 'Vuxenutbildning',
          description: 'Komvux, SFI och yrkesutbildning för vuxna',
          responsibleAuthority: '290 Kommuner',
          kpis: [
            { code: 'B13', name: 'SFI-resultat', trend: 'down', isPositive: false }
          ]
        }
      ]
    }
  },
  {
    id: 'social',
    code: 'C',
    name: 'Social trygghet',
    icon: <Users className="h-5 w-5" />,
    color: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    description: 'Socialförsäkring, socialtjänst och ekonomiskt bistånd',
    mandates: {
      national: [
        {
          id: 'nat-soc-1',
          title: 'Socialförsäkring',
          description: 'Sjukpenning, föräldraförsäkring, pension',
          legalBasis: 'Socialförsäkringsbalken (2010:110)',
          responsibleAuthority: 'Försäkringskassan',
          kpis: [
            { code: 'C01', name: 'Sjuktal', trend: 'up', isPositive: false },
            { code: 'C02', name: 'Föräldraledighetsfördelning', trend: 'up', isPositive: true }
          ]
        },
        {
          id: 'nat-soc-2',
          title: 'Pensionssystem',
          description: 'Allmän pension och premiepension',
          responsibleAuthority: 'Pensionsmyndigheten',
          kpis: [
            { code: 'C03', name: 'Pensionsersättningsgrad', trend: 'down', isPositive: false }
          ]
        },
        {
          id: 'nat-soc-3',
          title: 'Arbetsmarknadspolitik',
          description: 'Arbetslöshetsförsäkring och arbetsmarknadsprogram',
          responsibleAuthority: 'Arbetsförmedlingen',
          kpis: [
            { code: 'C04', name: 'Arbetslöshet', trend: 'stable', isPositive: false },
            { code: 'C05', name: 'Långtidsarbetslöshet', trend: 'up', isPositive: false }
          ]
        }
      ],
      regional: [
        {
          id: 'reg-soc-1',
          title: 'Arbetsmarknadsregioner',
          description: 'Regional arbetsmarknadspolitik och kompetensförsörjning',
          responsibleAuthority: 'Regioner / AF',
          kpis: [
            { code: 'C06', name: 'Regional sysselsättningsgrad', trend: 'stable', isPositive: false }
          ]
        }
      ],
      municipal: [
        {
          id: 'mun-soc-1',
          title: 'Ekonomiskt bistånd',
          description: 'Försörjningsstöd (socialbidrag)',
          legalBasis: 'Socialtjänstlagen (2001:453)',
          responsibleAuthority: '290 Kommuner',
          kpis: [
            { code: 'C07', name: 'Biståndsmottagare/1000 inv', trend: 'stable', isPositive: false },
            { code: 'C08', name: 'Tid i bistånd', trend: 'up', isPositive: false }
          ]
        },
        {
          id: 'mun-soc-2',
          title: 'Barn och unga',
          description: 'Stöd till barn och familjer, placeringar',
          legalBasis: 'Socialtjänstlagen (2001:453)',
          responsibleAuthority: '290 Kommuner',
          kpis: [
            { code: 'C09', name: 'Placerade barn/1000', trend: 'up', isPositive: false },
            { code: 'C10', name: 'Orosanmälningar', trend: 'up', isPositive: false }
          ]
        },
        {
          id: 'mun-soc-3',
          title: 'Missbruksvård',
          description: 'Stöd och behandling vid beroendeproblematik',
          responsibleAuthority: '290 Kommuner',
          kpis: [
            { code: 'C11', name: 'Narkotikadödlighet', trend: 'down', isPositive: true }
          ]
        }
      ]
    }
  },
  {
    id: 'security',
    code: 'D',
    name: 'Trygghet & Säkerhet',
    icon: <Shield className="h-5 w-5" />,
    color: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    description: 'Rättsväsende, polis och krisberedskap',
    mandates: {
      national: [
        {
          id: 'nat-sec-1',
          title: 'Polisverksamhet',
          description: 'Brottsbekämpning och ordningshållning',
          legalBasis: 'Polislagen (1984:387)',
          responsibleAuthority: 'Polismyndigheten',
          kpis: [
            { code: 'D01', name: 'Uppklarade brott', trend: 'down', isPositive: false },
            { code: 'D02', name: 'Anmälda brott/100k', trend: 'stable', isPositive: false },
            { code: 'D03', name: 'Skjutningar', trend: 'up', isPositive: false }
          ]
        },
        {
          id: 'nat-sec-2',
          title: 'Rättsväsende',
          description: 'Domstolar, åklagare och kriminalvård',
          responsibleAuthority: 'Domstolsverket / Åklagarmyndigheten',
          kpis: [
            { code: 'D04', name: 'Handläggningstid brottmål', trend: 'up', isPositive: false },
            { code: 'D05', name: 'Återfall i brott', trend: 'stable', isPositive: false }
          ]
        },
        {
          id: 'nat-sec-3',
          title: 'Civil beredskap',
          description: 'Nationell krisberedskap och totalförsvar',
          responsibleAuthority: 'MSB',
          kpis: [
            { code: 'D06', name: 'Krisberedskapsindex', trend: 'up', isPositive: true }
          ]
        },
        {
          id: 'nat-sec-4',
          title: 'Försvar',
          description: 'Militärt försvar',
          responsibleAuthority: 'Försvarsmakten',
          kpis: [
            { code: 'D07', name: 'Försvarsanslag/BNP', trend: 'up', isPositive: true }
          ]
        }
      ],
      regional: [
        {
          id: 'reg-sec-1',
          title: 'Regional räddningstjänst',
          description: 'Samordning av räddningsinsatser',
          responsibleAuthority: 'Regioner / Länsstyrelser',
          kpis: [
            { code: 'D08', name: 'Insatstid räddningstjänst', trend: 'stable', isPositive: false }
          ]
        }
      ],
      municipal: [
        {
          id: 'mun-sec-1',
          title: 'Räddningstjänst',
          description: 'Brand- och räddningsverksamhet',
          legalBasis: 'Lagen om skydd mot olyckor (2003:778)',
          responsibleAuthority: '290 Kommuner',
          kpis: [
            { code: 'D09', name: 'Bränder per 1000 inv', trend: 'down', isPositive: true },
            { code: 'D10', name: 'Utryckningstid < 10 min', trend: 'stable', isPositive: false }
          ]
        },
        {
          id: 'mun-sec-2',
          title: 'Brottsförebyggande',
          description: 'Lokalt brottsförebyggande arbete',
          responsibleAuthority: '290 Kommuner',
          kpis: [
            { code: 'D11', name: 'Upplevd trygghet', trend: 'down', isPositive: false }
          ]
        }
      ]
    }
  },
  {
    id: 'housing',
    code: 'E',
    name: 'Bostad & Samhällsbyggnad',
    icon: <Home className="h-5 w-5" />,
    color: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
    description: 'Bostadsförsörjning, planering och byggande',
    mandates: {
      national: [
        {
          id: 'nat-house-1',
          title: 'Bostadspolitik',
          description: 'Nationella mål för bostadsbyggande',
          responsibleAuthority: 'Boverket',
          kpis: [
            { code: 'E01', name: 'Bostadsbyggande/1000 inv', trend: 'down', isPositive: false },
            { code: 'E02', name: 'Bostadsbrist kommuner', trend: 'stable', isPositive: false }
          ]
        },
        {
          id: 'nat-house-2',
          title: 'Byggregelverk',
          description: 'Byggregler och standarder',
          legalBasis: 'Plan- och bygglagen (2010:900)',
          responsibleAuthority: 'Boverket',
          kpis: [
            { code: 'E03', name: 'Bygglovshandläggningstid', trend: 'up', isPositive: false }
          ]
        }
      ],
      regional: [
        {
          id: 'reg-house-1',
          title: 'Regional planering',
          description: 'Översiktlig fysisk planering',
          responsibleAuthority: 'Regioner',
          kpis: [
            { code: 'E04', name: 'Regionplaner antagna', trend: 'stable', isPositive: false }
          ]
        }
      ],
      municipal: [
        {
          id: 'mun-house-1',
          title: 'Bostadsförsörjning',
          description: 'Planering för bostadsförsörjning',
          legalBasis: 'Bostadsförsörjningslagen (2000:1383)',
          responsibleAuthority: '290 Kommuner',
          kpis: [
            { code: 'E05', name: 'Kötid hyresrätt', trend: 'up', isPositive: false },
            { code: 'E06', name: 'Andel hyresrätter', trend: 'down', isPositive: false }
          ]
        },
        {
          id: 'mun-house-2',
          title: 'Planläggning',
          description: 'Detaljplaner och bygglov',
          legalBasis: 'Plan- och bygglagen (2010:900)',
          responsibleAuthority: '290 Kommuner',
          kpis: [
            { code: 'E07', name: 'Detaljplaner/år', trend: 'stable', isPositive: false }
          ]
        },
        {
          id: 'mun-house-3',
          title: 'Vatten och avlopp',
          description: 'Kommunalt VA',
          legalBasis: 'Vattentjänstlagen (2006:412)',
          responsibleAuthority: '290 Kommuner',
          kpis: [
            { code: 'E08', name: 'Dricksvatten godkänt', trend: 'stable', isPositive: true },
            { code: 'E09', name: 'Läckage vattenledningar', trend: 'up', isPositive: false }
          ]
        }
      ]
    }
  },
  {
    id: 'economy',
    code: 'F',
    name: 'Ekonomi & Skatter',
    icon: <Banknote className="h-5 w-5" />,
    color: 'bg-green-500/20 text-green-400 border-green-500/30',
    description: 'Offentlig ekonomi, skatter och finanspolitik',
    mandates: {
      national: [
        {
          id: 'nat-econ-1',
          title: 'Finanspolitik',
          description: 'Statsbudget och finansiell styrning',
          responsibleAuthority: 'Finansdepartementet',
          kpis: [
            { code: 'F01', name: 'Statsskuld/BNP', trend: 'down', isPositive: true },
            { code: 'F02', name: 'Budgetbalans', trend: 'stable', isPositive: true }
          ]
        },
        {
          id: 'nat-econ-2',
          title: 'Penningpolitik',
          description: 'Inflation och räntor',
          responsibleAuthority: 'Riksbanken',
          kpis: [
            { code: 'F03', name: 'Inflation', trend: 'down', isPositive: true },
            { code: 'F04', name: 'Styrränta', trend: 'down', isPositive: true }
          ]
        },
        {
          id: 'nat-econ-3',
          title: 'Skattepolitik',
          description: 'Nationella skatter och avgifter',
          responsibleAuthority: 'Skatteverket',
          kpis: [
            { code: 'F05', name: 'Skattekvot', trend: 'stable', isPositive: false },
            { code: 'F06', name: 'Skatteintäkter/BNP', trend: 'stable', isPositive: false }
          ]
        }
      ],
      regional: [
        {
          id: 'reg-econ-1',
          title: 'Regionskatt',
          description: 'Regional beskattning för sjukvård och kollektivtrafik',
          responsibleAuthority: '21 Regioner',
          kpis: [
            { code: 'F07', name: 'Regionskattesats', trend: 'stable', isPositive: false },
            { code: 'F08', name: 'Regionens resultat', trend: 'down', isPositive: false }
          ]
        }
      ],
      municipal: [
        {
          id: 'mun-econ-1',
          title: 'Kommunalskatt',
          description: 'Lokal beskattning för kommunal service',
          legalBasis: 'Kommunallagen (2017:725)',
          responsibleAuthority: '290 Kommuner',
          kpis: [
            { code: 'F09', name: 'Kommunalskattesats', trend: 'stable', isPositive: false },
            { code: 'F10', name: 'Kommunens resultat', trend: 'down', isPositive: false }
          ]
        },
        {
          id: 'mun-econ-2',
          title: 'Kommunal ekonomi',
          description: 'Budget och ekonomistyrning',
          responsibleAuthority: '290 Kommuner',
          kpis: [
            { code: 'F11', name: 'Soliditet', trend: 'down', isPositive: false },
            { code: 'F12', name: 'Skuldsättningsgrad', trend: 'up', isPositive: false }
          ]
        }
      ]
    }
  },
  {
    id: 'environment',
    code: 'G',
    name: 'Miljö & Klimat',
    icon: <TreePine className="h-5 w-5" />,
    color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    description: 'Miljöskydd, klimatpolitik och hållbarhet',
    mandates: {
      national: [
        {
          id: 'nat-env-1',
          title: 'Klimatpolitik',
          description: 'Nationella klimatmål och utsläppsminskningar',
          legalBasis: 'Klimatlagen (2017:720)',
          responsibleAuthority: 'Naturvårdsverket',
          kpis: [
            { code: 'G01', name: 'CO2-utsläpp/capita', trend: 'down', isPositive: true },
            { code: 'G02', name: 'Fossilfri elproduktion', trend: 'stable', isPositive: true }
          ]
        },
        {
          id: 'nat-env-2',
          title: 'Miljöskydd',
          description: 'Skydd av naturmiljö och biologisk mångfald',
          legalBasis: 'Miljöbalken (1998:808)',
          responsibleAuthority: 'Naturvårdsverket',
          kpis: [
            { code: 'G03', name: 'Skyddad natur %', trend: 'up', isPositive: true },
            { code: 'G04', name: 'Hotade arter', trend: 'up', isPositive: false }
          ]
        },
        {
          id: 'nat-env-3',
          title: 'Energipolitik',
          description: 'Nationell energiförsörjning',
          responsibleAuthority: 'Energimyndigheten',
          kpis: [
            { code: 'G05', name: 'Förnybar energi %', trend: 'up', isPositive: true },
            { code: 'G06', name: 'Energieffektivitet', trend: 'up', isPositive: true }
          ]
        }
      ],
      regional: [
        {
          id: 'reg-env-1',
          title: 'Regional miljöövervakning',
          description: 'Miljötillsyn och regional planering',
          responsibleAuthority: 'Länsstyrelser',
          kpis: [
            { code: 'G07', name: 'Miljömålsuppfyllelse', trend: 'stable', isPositive: false }
          ]
        }
      ],
      municipal: [
        {
          id: 'mun-env-1',
          title: 'Avfallshantering',
          description: 'Insamling och återvinning av avfall',
          legalBasis: 'Miljöbalken (1998:808)',
          responsibleAuthority: '290 Kommuner',
          kpis: [
            { code: 'G08', name: 'Återvinningsgrad', trend: 'up', isPositive: true },
            { code: 'G09', name: 'Deponiavfall kg/inv', trend: 'down', isPositive: true }
          ]
        },
        {
          id: 'mun-env-2',
          title: 'Miljötillsyn',
          description: 'Lokal miljötillsyn och tillståndsprövning',
          responsibleAuthority: '290 Kommuner',
          kpis: [
            { code: 'G10', name: 'Tillsynsbesök/år', trend: 'stable', isPositive: false }
          ]
        },
        {
          id: 'mun-env-3',
          title: 'Klimatanpassning',
          description: 'Lokala åtgärder för klimatanpassning',
          responsibleAuthority: '290 Kommuner',
          kpis: [
            { code: 'G11', name: 'Klimatanpassningsindex', trend: 'up', isPositive: true }
          ]
        }
      ]
    }
  },
  {
    id: 'labor',
    code: 'H',
    name: 'Arbetsmarknad & Näringsliv',
    icon: <Briefcase className="h-5 w-5" />,
    color: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    description: 'Arbetsrätt, näringspolitik och innovation',
    mandates: {
      national: [
        {
          id: 'nat-lab-1',
          title: 'Arbetsmarknadspolitik',
          description: 'Arbetsförmedling och arbetsmarknadsåtgärder',
          responsibleAuthority: 'Arbetsförmedlingen',
          kpis: [
            { code: 'H01', name: 'Sysselsättningsgrad', trend: 'stable', isPositive: false },
            { code: 'H02', name: 'Inskrivna arbetslösa', trend: 'stable', isPositive: false }
          ]
        },
        {
          id: 'nat-lab-2',
          title: 'Näringspolitik',
          description: 'Stöd till företagande och innovation',
          responsibleAuthority: 'Tillväxtverket',
          kpis: [
            { code: 'H03', name: 'Nyföretagande', trend: 'up', isPositive: true },
            { code: 'H04', name: 'FoU-investeringar/BNP', trend: 'stable', isPositive: false }
          ]
        },
        {
          id: 'nat-lab-3',
          title: 'Arbetsrätt',
          description: 'Regler för arbetsmarknaden',
          legalBasis: 'LAS m.fl.',
          responsibleAuthority: 'Arbetsmarknadsdep.',
          kpis: [
            { code: 'H05', name: 'Facklig anslutning', trend: 'down', isPositive: false }
          ]
        }
      ],
      regional: [
        {
          id: 'reg-lab-1',
          title: 'Regional tillväxt',
          description: 'Regionala tillväxtprogram',
          responsibleAuthority: 'Regioner',
          kpis: [
            { code: 'H06', name: 'Regional BRP/capita', trend: 'up', isPositive: true }
          ]
        }
      ],
      municipal: [
        {
          id: 'mun-lab-1',
          title: 'Lokalt näringslivsklimat',
          description: 'Stöd till lokalt företagande',
          responsibleAuthority: '290 Kommuner',
          kpis: [
            { code: 'H07', name: 'Företagsklimat (SKR)', trend: 'stable', isPositive: false },
            { code: 'H08', name: 'Handläggningstid företag', trend: 'up', isPositive: false }
          ]
        },
        {
          id: 'mun-lab-2',
          title: 'Arbetsmarknadsinsatser',
          description: 'Kommunala arbetsmarknadsinsatser',
          responsibleAuthority: '290 Kommuner',
          kpis: [
            { code: 'H09', name: 'Ungdomsarbetslöshet', trend: 'stable', isPositive: false }
          ]
        }
      ]
    }
  },
  {
    id: 'democracy',
    code: 'I',
    name: 'Demokrati & Rättsstaten',
    icon: <Scale className="h-5 w-5" />,
    color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    description: 'Demokratiska institutioner, mänskliga rättigheter och rättsstat',
    mandates: {
      national: [
        {
          id: 'nat-dem-1',
          title: 'Demokratisk styrning',
          description: 'Riksdag, regering och statsförvaltning',
          legalBasis: 'Regeringsformen',
          responsibleAuthority: 'Riksdagen / Regeringen',
          kpis: [
            { code: 'I01', name: 'Valdeltagande', trend: 'down', isPositive: false },
            { code: 'I02', name: 'Förtroende för politiker', trend: 'down', isPositive: false }
          ]
        },
        {
          id: 'nat-dem-2',
          title: 'Mänskliga rättigheter',
          description: 'Diskrimineringsskydd och rättigheter',
          responsibleAuthority: 'DO / JO / JK',
          kpis: [
            { code: 'I03', name: 'Diskrimineringsanmälningar', trend: 'up', isPositive: false },
            { code: 'I04', name: 'Pressfrihet (index)', trend: 'stable', isPositive: true }
          ]
        },
        {
          id: 'nat-dem-3',
          title: 'Offentlighetsprincipen',
          description: 'Öppenhet och insyn i offentlig verksamhet',
          responsibleAuthority: 'Alla myndigheter',
          kpis: [
            { code: 'I05', name: 'Besvarade begäranden', trend: 'stable', isPositive: false }
          ]
        }
      ],
      regional: [
        {
          id: 'reg-dem-1',
          title: 'Regional demokrati',
          description: 'Regionfullmäktige och regional styrning',
          responsibleAuthority: '21 Regioner',
          kpis: [
            { code: 'I06', name: 'Valdeltagande region', trend: 'down', isPositive: false }
          ]
        }
      ],
      municipal: [
        {
          id: 'mun-dem-1',
          title: 'Kommunal demokrati',
          description: 'Kommunfullmäktige och lokalt självstyre',
          legalBasis: 'Kommunallagen (2017:725)',
          responsibleAuthority: '290 Kommuner',
          kpis: [
            { code: 'I07', name: 'Valdeltagande kommun', trend: 'down', isPositive: false },
            { code: 'I08', name: 'Medborgarförslag behandlade', trend: 'up', isPositive: true }
          ]
        },
        {
          id: 'mun-dem-2',
          title: 'Medborgardialog',
          description: 'Brukarundersökningar och medborgarpaneler',
          responsibleAuthority: '290 Kommuner',
          kpis: [
            { code: 'I09', name: 'Nöjd-Medborgar-Index', trend: 'stable', isPositive: false }
          ]
        }
      ]
    }
  }
];

// Component for displaying a single KPI link
const KPIBadge: React.FC<{ kpi: KPILink }> = ({ kpi }) => {
  const TrendIcon = kpi.trend === 'up' ? TrendingUp : kpi.trend === 'down' ? TrendingDown : Minus;
  const trendColor = kpi.isPositive 
    ? 'text-green-400' 
    : kpi.trend === 'stable' 
      ? 'text-muted-foreground' 
      : 'text-red-400';

  return (
    <Badge variant="outline" className="gap-1 text-xs py-0.5">
      <span className="font-mono text-muted-foreground">{kpi.code}</span>
      <span className="max-w-[120px] truncate">{kpi.name}</span>
      <TrendIcon className={cn("h-3 w-3", trendColor)} />
    </Badge>
  );
};

// Component for displaying a mandate
const MandateCard: React.FC<{ mandate: Mandate; level: string }> = ({ mandate }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="w-full">
        <div className="flex items-start gap-3 p-3 rounded-lg bg-card/50 hover:bg-card/80 transition-colors border border-border/50 text-left">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-sm">{mandate.title}</h4>
              {isOpen ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
              {mandate.responsibleAuthority}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <Badge variant="secondary" className="text-xs">
              {mandate.kpis.length} KPI
            </Badge>
          </div>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 ml-4 p-3 rounded-lg bg-muted/30 border border-border/30"
            >
              <p className="text-sm text-muted-foreground mb-3">{mandate.description}</p>
              
              {mandate.legalBasis && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                  <Scale className="h-3 w-3" />
                  <span>{mandate.legalBasis}</span>
                </div>
              )}

              <div className="flex flex-wrap gap-1.5">
                {mandate.kpis.map((kpi) => (
                  <KPIBadge key={kpi.code} kpi={kpi} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CollapsibleContent>
    </Collapsible>
  );
};

// Level section component
const LevelSection: React.FC<{ 
  level: 'national' | 'regional' | 'municipal';
  mandates: Mandate[];
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}> = ({ level, mandates, icon, title, subtitle }) => {
  if (mandates.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 pb-2 border-b border-border/50">
        {icon}
        <div>
          <h3 className="font-semibold text-sm">{title}</h3>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
        <Badge variant="outline" className="ml-auto text-xs">
          {mandates.length} mandat
        </Badge>
      </div>
      <div className="space-y-2">
        {mandates.map((mandate) => (
          <MandateCard key={mandate.id} mandate={mandate} level={level} />
        ))}
      </div>
    </div>
  );
};

// Domain card component
const DomainCard: React.FC<{ domain: Domain }> = ({ domain }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const totalMandates = 
    domain.mandates.national.length + 
    domain.mandates.regional.length + 
    domain.mandates.municipal.length;
  
  const totalKPIs = [
    ...domain.mandates.national,
    ...domain.mandates.regional,
    ...domain.mandates.municipal
  ].reduce((sum, m) => sum + m.kpis.length, 0);

  return (
    <Card className="overflow-hidden">
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger className="w-full">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className={cn("p-2 rounded-lg border", domain.color)}>
                {domain.icon}
              </div>
              <div className="flex-1 text-left">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="font-mono text-muted-foreground text-sm">{domain.code}.</span>
                  {domain.name}
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground ml-auto" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto" />
                  )}
                </CardTitle>
                <CardDescription>{domain.description}</CardDescription>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <Badge variant="outline" className="text-xs">
                {totalMandates} mandat
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {totalKPIs} KPI:er
              </Badge>
              <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-400 border-blue-500/30">
                {domain.mandates.national.length} nationellt
              </Badge>
              <Badge variant="outline" className="text-xs bg-purple-500/10 text-purple-400 border-purple-500/30">
                {domain.mandates.regional.length} regionalt
              </Badge>
              <Badge variant="outline" className="text-xs bg-green-500/10 text-green-400 border-green-500/30">
                {domain.mandates.municipal.length} kommunalt
              </Badge>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <CardContent className="pt-0 space-y-6">
                  <LevelSection
                    level="national"
                    mandates={domain.mandates.national}
                    icon={<Globe className="h-4 w-4 text-blue-400" />}
                    title="Nationell nivå"
                    subtitle="Staten, myndigheter"
                  />
                  <LevelSection
                    level="regional"
                    mandates={domain.mandates.regional}
                    icon={<MapPin className="h-4 w-4 text-purple-400" />}
                    title="Regional nivå"
                    subtitle="21 regioner, länsstyrelser"
                  />
                  <LevelSection
                    level="municipal"
                    mandates={domain.mandates.municipal}
                    icon={<Building2 className="h-4 w-4 text-green-400" />}
                    title="Kommunal nivå"
                    subtitle="290 kommuner"
                  />
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

// Statistics summary
const StatsSummary: React.FC = () => {
  const totals = SWEDEN_RESPONSIBILITY_DATA.reduce(
    (acc, domain) => {
      acc.mandates += 
        domain.mandates.national.length + 
        domain.mandates.regional.length + 
        domain.mandates.municipal.length;
      acc.national += domain.mandates.national.length;
      acc.regional += domain.mandates.regional.length;
      acc.municipal += domain.mandates.municipal.length;
      
      const allMandates = [
        ...domain.mandates.national,
        ...domain.mandates.regional,
        ...domain.mandates.municipal
      ];
      acc.kpis += allMandates.reduce((sum, m) => sum + m.kpis.length, 0);
      
      return acc;
    },
    { mandates: 0, kpis: 0, national: 0, regional: 0, municipal: 0 }
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      <Card className="p-4 text-center">
        <div className="text-2xl font-bold text-primary">{SWEDEN_RESPONSIBILITY_DATA.length}</div>
        <div className="text-xs text-muted-foreground">Samhällsområden</div>
      </Card>
      <Card className="p-4 text-center">
        <div className="text-2xl font-bold">{totals.mandates}</div>
        <div className="text-xs text-muted-foreground">Mandat totalt</div>
      </Card>
      <Card className="p-4 text-center bg-blue-500/10 border-blue-500/30">
        <div className="text-2xl font-bold text-blue-400">{totals.national}</div>
        <div className="text-xs text-muted-foreground">Nationella</div>
      </Card>
      <Card className="p-4 text-center bg-purple-500/10 border-purple-500/30">
        <div className="text-2xl font-bold text-purple-400">{totals.regional}</div>
        <div className="text-xs text-muted-foreground">Regionala</div>
      </Card>
      <Card className="p-4 text-center bg-green-500/10 border-green-500/30">
        <div className="text-2xl font-bold text-green-400">{totals.municipal}</div>
        <div className="text-xs text-muted-foreground">Kommunala</div>
      </Card>
    </div>
  );
};

// Main component
const SwedenResponsibilityMap: React.FC = () => {
  // Future: add toggle between domain view and level view
  // const [viewMode, setViewMode] = useState<'domains' | 'levels'>('domains');
  const [selectedLevel, setSelectedLevel] = useState<'all' | 'national' | 'regional' | 'municipal'>('all');

  // Filter mandates by level
  const getFilteredDomains = () => {
    if (selectedLevel === 'all') return SWEDEN_RESPONSIBILITY_DATA;
    
    return SWEDEN_RESPONSIBILITY_DATA.map(domain => ({
      ...domain,
      mandates: {
        national: selectedLevel === 'national' ? domain.mandates.national : [],
        regional: selectedLevel === 'regional' ? domain.mandates.regional : [],
        municipal: selectedLevel === 'municipal' ? domain.mandates.municipal : [],
      }
    })).filter(domain => 
      domain.mandates.national.length > 0 ||
      domain.mandates.regional.length > 0 ||
      domain.mandates.municipal.length > 0
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
              <Scale className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Sveriges Ansvarskarta</CardTitle>
              <CardDescription>
                Komplett översikt över samhällsområden, mandat och KPI:er fördelade på nationell, regional och kommunal nivå
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <StatsSummary />
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <Tabs value={selectedLevel} onValueChange={(v) => setSelectedLevel(v as typeof selectedLevel)}>
          <TabsList>
            <TabsTrigger value="all" className="gap-1.5">
              <Scale className="h-3.5 w-3.5" />
              Alla nivåer
            </TabsTrigger>
            <TabsTrigger value="national" className="gap-1.5">
              <Globe className="h-3.5 w-3.5" />
              Nationellt
            </TabsTrigger>
            <TabsTrigger value="regional" className="gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              Regionalt
            </TabsTrigger>
            <TabsTrigger value="municipal" className="gap-1.5">
              <Building2 className="h-3.5 w-3.5" />
              Kommunalt
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2 text-xs text-muted-foreground ml-auto">
          <Info className="h-3.5 w-3.5" />
          Klicka på ett område för att visa mandat och KPI:er
        </div>
      </div>

      {/* Domain cards */}
      <div className="grid gap-4">
        {getFilteredDomains().map((domain) => (
          <DomainCard key={domain.id} domain={domain} />
        ))}
      </div>

      {/* Legend */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-400" />
            <span>Positiv trend (förbättring)</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-red-400" />
            <span>Negativ trend (försämring)</span>
          </div>
          <div className="flex items-center gap-2">
            <Minus className="h-4 w-4 text-muted-foreground" />
            <span>Stabil trend</span>
          </div>
          <div className="ml-auto flex items-center gap-2 text-muted-foreground">
            <ExternalLink className="h-3.5 w-3.5" />
            <span>Data från offentliga källor</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SwedenResponsibilityMap;
