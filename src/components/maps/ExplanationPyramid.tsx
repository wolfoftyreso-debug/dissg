/**
 * EXPLANATION PYRAMID
 * 
 * Fördjupningsystem som följer 5-nivåers pyramiden:
 * Nivå 1: Observation (Vad?)
 * Nivå 2: Mekanism (Varför?)
 * Nivå 3: Metod (Hur vet vi?)
 * Nivå 4: Begränsningar
 * Nivå 5: Rådata
 */

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Info, 
  Eye, 
  Cog, 
  FlaskConical, 
  AlertTriangle, 
  Database,
  ExternalLink,
  ChevronRight,
  HelpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ========== COMPARISON MODE EXPLANATIONS ==========

export interface ComparisonModeExplanation {
  id: string;
  labelSv: string;
  observation: {
    title: string;
    description: string;
    example: string;
  };
  mechanism: {
    title: string;
    description: string;
    formula?: string;
    components: string[];
  };
  method: {
    title: string;
    dataSource: string;
    calculation: string;
    frequency: string;
    reliability: number;
  };
  limitations: {
    title: string;
    items: string[];
    notShown: string[];
  };
  rawData: {
    title: string;
    sources: { name: string; url?: string; type: string }[];
    accessLevel: 'open' | 'restricted' | 'computed';
  };
}

export const COMPARISON_MODE_EXPLANATIONS: ComparisonModeExplanation[] = [
  {
    id: 'absolute',
    labelSv: 'Absolut nivå',
    observation: {
      title: 'Vad visar detta?',
      description: 'Det faktiska uppmätta värdet för indikatorn vid den senaste tillgängliga mätpunkten. Inget jämförs – värdet presenteras som det är.',
      example: 'Sverige: 71 på individualismindex = mätvärdet är 71 av 100.'
    },
    mechanism: {
      title: 'Hur fungerar det?',
      description: 'Värdet hämtas direkt från källan utan transformation. Det representerar den senaste officiella mätningen.',
      formula: 'Visat värde = Källvärde',
      components: [
        'Senaste datapunkt från primärkälla',
        'Osäkerhetsintervall från källan',
        'Täckningsgrad baserad på datakvalitet'
      ]
    },
    method: {
      title: 'Hur mäts det?',
      dataSource: 'Varierar per indikator (World Bank, OECD, Hofstede, etc.)',
      calculation: 'Ingen transformation – direktvisning av källdata',
      frequency: 'Uppdateras när nya data publiceras (årligen för de flesta indikatorer)',
      reliability: 95
    },
    limitations: {
      title: 'Begränsningar',
      items: [
        'Olika mätår mellan länder kan förekomma',
        'Definitioner kan variera marginellt mellan källor',
        'Ger ingen kontext om hur värdet förhåller sig till andra'
      ],
      notShown: [
        'Historisk trend',
        'Jämförelse med andra länder',
        'Värdering av om nivån är "bra" eller "dålig"'
      ]
    },
    rawData: {
      title: 'Underliggande data',
      sources: [
        { name: 'World Bank Open Data', url: 'https://data.worldbank.org', type: 'API' },
        { name: 'OECD.Stat', url: 'https://stats.oecd.org', type: 'API' },
        { name: 'Hofstede Insights', url: 'https://hofstede-insights.com', type: 'Dataset' }
      ],
      accessLevel: 'open'
    }
  },
  {
    id: 'relative_global',
    labelSv: 'Relativt globalt snitt',
    observation: {
      title: 'Vad visar detta?',
      description: 'Hur landets värde förhåller sig till världsgenomsnittet. Positivt = över snittet, negativt = under snittet.',
      example: 'Sverige: +49.7% = Sveriges värde är 49.7% högre än det globala genomsnittet.'
    },
    mechanism: {
      title: 'Hur fungerar det?',
      description: 'Beräknas som procentuell avvikelse från det viktade globala genomsnittet.',
      formula: 'Avvikelse = ((Landsvärde - Globalt snitt) / Globalt snitt) × 100%',
      components: [
        'Landets faktiska värde',
        'Globalt genomsnitt (befolkningsviktat eller oviktat)',
        'Procentuell differens'
      ]
    },
    method: {
      title: 'Hur mäts det?',
      dataSource: 'Aggregerat från alla länder med tillgänglig data',
      calculation: 'Globalt snitt beräknas som aritmetiskt medelvärde av alla länder med data',
      frequency: 'Uppdateras vid ny data – snittet kan ändras',
      reliability: 88
    },
    limitations: {
      title: 'Begränsningar',
      items: [
        'Snittet påverkas av vilka länder som har data',
        'Små länder får samma vikt som stora i oviktat snitt',
        'Extremvärden kan skeva snittet',
        'Senaste dataår varierar mellan länder'
      ],
      notShown: [
        'Spridning/varians inom gruppen',
        'Median istället för medelvärde',
        'Regionala skillnader'
      ]
    },
    rawData: {
      title: 'Underliggande data',
      sources: [
        { name: 'Beräknat aggregat', type: 'Computed' },
        { name: 'Baserat på samtliga ländervärden', type: 'Derived' }
      ],
      accessLevel: 'computed'
    }
  },
  {
    id: 'change_over_time',
    labelSv: 'Förändring över tid',
    observation: {
      title: 'Vad visar detta?',
      description: 'Hur indikatorn har utvecklats över en definierad tidsperiod. Visar riktning och magnitud av förändringen.',
      example: '+12% över 10 år = värdet har ökat med 12 procentenheter sedan startåret.'
    },
    mechanism: {
      title: 'Hur fungerar det?',
      description: 'Jämför det senaste värdet med ett historiskt basvärde och beräknar den procentuella förändringen.',
      formula: 'Förändring = ((Nuvarande värde - Basvärde) / Basvärde) × 100%',
      components: [
        'Nuvarande mätvärde (senaste tillgängliga)',
        'Basvärde (typiskt 5 eller 10 år tillbaka)',
        'Årlig genomsnittlig förändring (CAGR om tillgängligt)',
        'Trendlinje för visualisering'
      ]
    },
    method: {
      title: 'Hur mäts det?',
      dataSource: 'Tidsserier från primärkällor',
      calculation: 'Punktförändring mellan två tidpunkter. Vid luckor: interpolering markeras.',
      frequency: 'Beror på källans uppdateringsfrekvens',
      reliability: 82
    },
    limitations: {
      title: 'Begränsningar',
      items: [
        'Metodändringar i källan kan skapa falska trender',
        'Korta tidsserier (<5 år) är opålitliga',
        'Säsongsvariation kan påverka årsjämförelser',
        'Basårsvalet påverkar resultatet kraftigt',
        'Extremvärden i start/slut kan ge missvisande bild'
      ],
      notShown: [
        'Orsak till förändringen',
        'Om trenden är statistiskt signifikant',
        'Kortsiktiga fluktuationer',
        'Framtida projektion'
      ]
    },
    rawData: {
      title: 'Underliggande data',
      sources: [
        { name: 'Historiska tidsserier', type: 'Time series' },
        { name: 'Metodloggar vid definitionsändringar', type: 'Metadata' }
      ],
      accessLevel: 'open'
    }
  }
];

// ========== INDICATOR EXPLANATIONS ==========

export interface IndicatorExplanation {
  id: string;
  labelSv: string;
  observation: {
    title: string;
    description: string;
    whatItMeasures: string;
    scale: { min: number; max: number; unit: string };
  };
  mechanism: {
    title: string;
    description: string;
    drivers: string[];
    relatedIndicators: string[];
  };
  method: {
    title: string;
    methodology: string;
    dataCollection: string;
    sampleSize?: string;
    frequency: string;
    primarySource: { name: string; url?: string };
    secondarySources: { name: string; url?: string }[];
  };
  limitations: {
    title: string;
    methodologicalIssues: string[];
    coverageGaps: string[];
    notShown: string[];
    commonMisinterpretations: string[];
  };
  rawData: {
    title: string;
    availability: 'full' | 'partial' | 'restricted';
    format: string;
    downloadUrl?: string;
    apiEndpoint?: string;
  };
}

export const INDICATOR_EXPLANATIONS: Record<string, IndicatorExplanation> = {
  individualism: {
    id: 'individualism',
    labelSv: 'Individualismindex',
    observation: {
      title: 'Vad mäter detta?',
      description: 'Individualismindex mäter i vilken utsträckning individer i ett samhälle förväntas ta hand om sig själva och sin närmaste familj, kontra att vara integrerade i starka, sammanhållna grupper.',
      whatItMeasures: 'Grad av individualism vs kollektivism i nationella kulturer baserat på Geert Hofstedes kulturella dimensionsteori.',
      scale: { min: 0, max: 100, unit: 'index' }
    },
    mechanism: {
      title: 'Vad driver detta?',
      description: 'Indexet är baserat på enkätsvar om attityder till arbete, familj och samhälle. Högre värden indikerar kulturer där individens intressen prioriteras före gruppens.',
      drivers: [
        'Historiska faktorer (industrialisering, urbanisering)',
        'Ekonomisk utvecklingsnivå',
        'Religiösa och filosofiska traditioner',
        'Politiska system och institutioner',
        'Geografiska faktorer (befolkningstäthet, klimat)'
      ],
      relatedIndicators: ['social_trust', 'gdp_per_capita', 'urbanization']
    },
    method: {
      title: 'Hur mäts det?',
      methodology: 'Ursprungligen baserat på IBM-anställdas enkätsvar i 70+ länder (1967-1973). Uppdaterats och validerats genom replikationsstudier.',
      dataCollection: 'Enkätundersökningar med standardiserade frågebatterier om arbetsrelaterade värderingar.',
      sampleSize: 'Ursprungligen 116,000 enkäter. Replikationer: 1000-5000 per land.',
      frequency: 'Originaldata från 1970-talet. Replikationer och uppdateringar genomförs oregelbundet.',
      primarySource: { name: 'Hofstede Insights', url: 'https://hofstede-insights.com' },
      secondarySources: [
        { name: 'World Values Survey', url: 'https://www.worldvaluessurvey.org' },
        { name: 'GLOBE Project', url: 'https://globeproject.com' }
      ]
    },
    limitations: {
      title: 'Begränsningar',
      methodologicalIssues: [
        'Baserat på en specifik population (IBM-anställda) – representativitet diskuteras',
        'Originaldata är över 50 år gammal – kulturell förändring har skett',
        'Enkätfrågor kan tolkas olika i olika kulturer',
        'Aggregerar hela nationer – ignorerar regionala och demografiska skillnader'
      ],
      coverageGaps: [
        'Små nationer underrepresenterade',
        'Ursprungligen begränsat till länder med IBM-verksamhet',
        'Afrikanska och centralasiatiska länder har mindre data'
      ],
      notShown: [
        'Individuella variationer inom länder',
        'Förändring över tid (tidsserie saknas)',
        'Kausalitet eller konsekvenser',
        'Normativ bedömning av vad som är "bättre"'
      ],
      commonMisinterpretations: [
        'Att hög individualism = egoism (det mäter samhällsstruktur, inte moral)',
        'Att låg individualism = ofrihet (kollektivism kan vara frivillig)',
        'Att värdet är statiskt (kulturer förändras)'
      ]
    },
    rawData: {
      title: 'Rådata',
      availability: 'partial',
      format: 'Publicerade nationella poäng. Enkätrådata är proprietär.',
      downloadUrl: 'https://hofstede-insights.com/country-comparison-tool'
    }
  },
  
  gdp_per_capita: {
    id: 'gdp_per_capita',
    labelSv: 'BNP per capita',
    observation: {
      title: 'Vad mäter detta?',
      description: 'BNP per capita mäter det totala ekonomiska värdet som produceras i ett land, delat på befolkningen. PPP-justerat för att möjliggöra jämförelser mellan länder.',
      whatItMeasures: 'Ekonomisk produktion per person uttryckt i internationella dollar (köpkraftsjusterade USD).',
      scale: { min: 0, max: 150000, unit: 'USD' }
    },
    mechanism: {
      title: 'Vad driver detta?',
      description: 'BNP per capita drivs av produktivitet, sysselsättningsgrad, naturresurser, kapitalstock, teknologinivå och institutionell kvalitet.',
      drivers: [
        'Arbetskraftens produktivitet',
        'Utbildningsnivå och humankapital',
        'Investeringar i fysiskt kapital',
        'Teknologisk utveckling',
        'Institutionell kvalitet (rättssäkerhet, korruptionsnivå)',
        'Naturresurser och geografi'
      ],
      relatedIndicators: ['income_inequality', 'social_trust', 'urbanization']
    },
    method: {
      title: 'Hur mäts det?',
      methodology: 'Nationalräkenskaper enligt FN:s System of National Accounts (SNA). PPP-konvertering via International Comparison Program.',
      dataCollection: 'Officiell statistik från nationella statistikbyråer, sammanställd av World Bank och IMF.',
      frequency: 'Årligen. Preliminära estimat publiceras under året, reviderade data följande år.',
      primarySource: { name: 'World Bank', url: 'https://data.worldbank.org/indicator/NY.GDP.PCAP.PP.CD' },
      secondarySources: [
        { name: 'IMF World Economic Outlook', url: 'https://www.imf.org/en/Publications/WEO' },
        { name: 'OECD National Accounts', url: 'https://stats.oecd.org' }
      ]
    },
    limitations: {
      title: 'Begränsningar',
      methodologicalIssues: [
        'Mäter inte fördelning – två länder med samma BNP/capita kan ha helt olika ojämlikhet',
        'Exkluderar informell ekonomi (stor i utvecklingsländer)',
        'PPP-justeringar bygger på antaganden som kan ifrågasättas',
        'Mäter produktion, inte välbefinnande eller livskvalitet'
      ],
      coverageGaps: [
        'Konfliktländer kan sakna tillförlitlig data',
        'Små stater har ofta större osäkerhet',
        'Skatteplaneringseffekter i vissa jurisdiktioner (Irland, Luxemburg)'
      ],
      notShown: [
        'Inkomstfördelning',
        'Miljöpåverkan av produktionen',
        'Obetalt arbete (hushållsarbete, omsorg)',
        'Livskvalitet eller lycka'
      ],
      commonMisinterpretations: [
        'Att hög BNP/capita = alla är rika (fördelningen ignoreras)',
        'Att BNP-tillväxt alltid är positiv (kan ske på bekostnad av miljö/jämlikhet)',
        'Att länder kan jämföras rakt av (strukturella skillnader finns)'
      ]
    },
    rawData: {
      title: 'Rådata',
      availability: 'full',
      format: 'CSV, JSON, Excel via World Bank API',
      downloadUrl: 'https://data.worldbank.org/indicator/NY.GDP.PCAP.PP.CD',
      apiEndpoint: 'https://api.worldbank.org/v2/country/all/indicator/NY.GDP.PCAP.PP.CD'
    }
  },
  
  social_trust: {
    id: 'social_trust',
    labelSv: 'Social tillit',
    observation: {
      title: 'Vad mäter detta?',
      description: 'Andelen av befolkningen som svarar att "de flesta människor kan litas på" i enkätundersökningar. Ett mått på generaliserad tillit i samhället.',
      whatItMeasures: 'Generaliserad mellanmänsklig tillit baserat på standardiserade enkätsvar.',
      scale: { min: 0, max: 100, unit: '%' }
    },
    mechanism: {
      title: 'Vad driver detta?',
      description: 'Social tillit påverkas av institutionell kvalitet, ekonomisk jämlikhet, etnisk homogenitet, historiska erfarenheter och välfärdssystem.',
      drivers: [
        'Låg korruption och fungerande rättssystem',
        'Ekonomisk jämlikhet',
        'Välfärdssystemets omfattning',
        'Historiska faktorer (konflikter, totalitarism)',
        'Utbildningsnivå',
        'Religiösa och kulturella traditioner'
      ],
      relatedIndicators: ['income_inequality', 'gdp_per_capita', 'individualism']
    },
    method: {
      title: 'Hur mäts det?',
      methodology: 'Standardiserad enkätfråga: "Generally speaking, would you say that most people can be trusted, or that you can\'t be too careful in dealing with people?"',
      dataCollection: 'Representativa befolkningsundersökningar i respektive land.',
      sampleSize: 'Typiskt 1000-2000 respondenter per land per våg.',
      frequency: 'World Values Survey: vart 5:e år. Eurobarometer: kontinuerligt.',
      primarySource: { name: 'World Values Survey', url: 'https://www.worldvaluessurvey.org' },
      secondarySources: [
        { name: 'European Social Survey', url: 'https://www.europeansocialsurvey.org' },
        { name: 'Eurobarometer', url: 'https://europa.eu/eurobarometer' }
      ]
    },
    limitations: {
      title: 'Begränsningar',
      methodologicalIssues: [
        'Enkätfrågan kan tolkas olika i olika kulturer',
        '"Trust" översätts olika på olika språk',
        'Svar påverkas av aktuella händelser vid mättillfället',
        'Representativitet varierar mellan länder'
      ],
      coverageGaps: [
        'Många utvecklingsländer saknar data',
        'Tidsserierna är korta och ojämna',
        'Olika undersökningar ger ibland olika resultat'
      ],
      notShown: [
        'Tillit till specifika grupper eller institutioner',
        'Faktiskt beteende (bara attityder mäts)',
        'Varför tilliten är hög eller låg',
        'Regionala skillnader inom länder'
      ],
      commonMisinterpretations: [
        'Att hög tillit = naivitet (tillit kan vara rationell)',
        'Att låg tillit = dåligt samhälle (kan vara realistisk anpassning)',
        'Att mätningen fångar verklig tillit (det är en attityd, inte beteende)'
      ]
    },
    rawData: {
      title: 'Rådata',
      availability: 'full',
      format: 'SPSS, Stata, CSV via WVS',
      downloadUrl: 'https://www.worldvaluessurvey.org/WVSDocumentationWV7.jsp'
    }
  }
};

// ========== EXPLANATION DIALOG COMPONENT ==========

interface ExplanationPyramidDialogProps {
  type: 'comparison_mode' | 'indicator';
  id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExplanationPyramidDialog({ 
  type, 
  id, 
  open, 
  onOpenChange 
}: ExplanationPyramidDialogProps) {
  const [activeLevel, setActiveLevel] = useState<number>(1);
  
  const explanation = type === 'comparison_mode'
    ? COMPARISON_MODE_EXPLANATIONS.find(e => e.id === id)
    : INDICATOR_EXPLANATIONS[id];
  
  if (!explanation) return null;
  
  const levels = [
    { level: 1, label: 'Observation', labelShort: 'Vad?', icon: Eye, color: 'bg-blue-500' },
    { level: 2, label: 'Mekanism', labelShort: 'Varför?', icon: Cog, color: 'bg-purple-500' },
    { level: 3, label: 'Metod', labelShort: 'Hur?', icon: FlaskConical, color: 'bg-green-500' },
    { level: 4, label: 'Begränsningar', labelShort: 'Varning', icon: AlertTriangle, color: 'bg-orange-500' },
    { level: 5, label: 'Rådata', labelShort: 'Källa', icon: Database, color: 'bg-gray-500' }
  ];
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            {explanation.labelSv}
          </DialogTitle>
          <DialogDescription>
            Fördjupad förklaring – klicka på en nivå för att utforska
          </DialogDescription>
        </DialogHeader>
        
        {/* Level selector */}
        <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
          {levels.map(level => {
            const Icon = level.icon;
            return (
              <button
                key={level.level}
                onClick={() => setActiveLevel(level.level)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-md transition-all text-sm",
                  activeLevel === level.level
                    ? "bg-background shadow-sm font-medium"
                    : "hover:bg-background/50 text-muted-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{level.labelShort}</span>
              </button>
            );
          })}
        </div>
        
        <ScrollArea className="h-[400px] pr-4">
          {activeLevel === 1 && (
            <ExplanationLevel1 explanation={explanation} type={type} />
          )}
          {activeLevel === 2 && (
            <ExplanationLevel2 explanation={explanation} type={type} />
          )}
          {activeLevel === 3 && (
            <ExplanationLevel3 explanation={explanation} type={type} />
          )}
          {activeLevel === 4 && (
            <ExplanationLevel4 explanation={explanation} type={type} />
          )}
          {activeLevel === 5 && (
            <ExplanationLevel5 explanation={explanation} type={type} />
          )}
        </ScrollArea>
        
        {/* Navigation hint */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
          <span>Nivå {activeLevel} av 5</span>
          {activeLevel < 5 && (
            <button 
              onClick={() => setActiveLevel(activeLevel + 1)}
              className="flex items-center gap-1 hover:text-foreground transition-colors"
            >
              Djupare <ChevronRight className="h-3 w-3" />
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Level 1: Observation
function ExplanationLevel1({ explanation, type }: { explanation: any; type: string }) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg flex items-center gap-2">
        <Eye className="h-5 w-5 text-blue-500" />
        {explanation.observation.title}
      </h3>
      <p className="text-muted-foreground leading-relaxed">
        {explanation.observation.description}
      </p>
      
      {explanation.observation.example && (
        <Card className="bg-muted/30">
          <CardContent className="pt-4">
            <div className="text-sm font-medium mb-1">Exempel:</div>
            <p className="text-sm text-muted-foreground italic">
              {explanation.observation.example}
            </p>
          </CardContent>
        </Card>
      )}
      
      {explanation.observation.whatItMeasures && (
        <div className="p-3 rounded-lg border bg-blue-50 dark:bg-blue-950/20">
          <div className="text-sm font-medium mb-1">Vad mäts:</div>
          <p className="text-sm">{explanation.observation.whatItMeasures}</p>
        </div>
      )}
      
      {explanation.observation.scale && (
        <div className="flex items-center gap-4 text-sm">
          <Badge variant="outline">Skala: {explanation.observation.scale.min}–{explanation.observation.scale.max}</Badge>
          <Badge variant="outline">Enhet: {explanation.observation.scale.unit}</Badge>
        </div>
      )}
    </div>
  );
}

// Level 2: Mechanism
function ExplanationLevel2({ explanation, type }: { explanation: any; type: string }) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg flex items-center gap-2">
        <Cog className="h-5 w-5 text-purple-500" />
        {explanation.mechanism.title}
      </h3>
      <p className="text-muted-foreground leading-relaxed">
        {explanation.mechanism.description}
      </p>
      
      {explanation.mechanism.formula && (
        <Card className="bg-purple-50 dark:bg-purple-950/20 border-purple-200">
          <CardContent className="pt-4">
            <div className="text-sm font-medium mb-2">Formel:</div>
            <code className="text-sm bg-background px-2 py-1 rounded">
              {explanation.mechanism.formula}
            </code>
          </CardContent>
        </Card>
      )}
      
      {explanation.mechanism.components && (
        <div>
          <div className="text-sm font-medium mb-2">Komponenter:</div>
          <ul className="space-y-1">
            {explanation.mechanism.components.map((c: string, i: number) => (
              <li key={i} className="text-sm flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {explanation.mechanism.drivers && (
        <div>
          <div className="text-sm font-medium mb-2">Drivande faktorer:</div>
          <ul className="space-y-1">
            {explanation.mechanism.drivers.map((d: string, i: number) => (
              <li key={i} className="text-sm flex items-start gap-2">
                <span className="text-purple-500 mt-1">→</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// Level 3: Method
function ExplanationLevel3({ explanation, type }: { explanation: any; type: string }) {
  const method = explanation.method;
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg flex items-center gap-2">
        <FlaskConical className="h-5 w-5 text-green-500" />
        {method.title}
      </h3>
      
      <div className="grid gap-3">
        {method.dataSource && (
          <div className="p-3 rounded-lg border">
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Datakälla</div>
            <div className="text-sm">{method.dataSource}</div>
          </div>
        )}
        
        {method.methodology && (
          <div className="p-3 rounded-lg border">
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Metodik</div>
            <div className="text-sm">{method.methodology}</div>
          </div>
        )}
        
        {method.calculation && (
          <div className="p-3 rounded-lg border">
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Beräkning</div>
            <div className="text-sm">{method.calculation}</div>
          </div>
        )}
        
        {method.frequency && (
          <div className="p-3 rounded-lg border">
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Uppdateringsfrekvens</div>
            <div className="text-sm">{method.frequency}</div>
          </div>
        )}
        
        {method.reliability !== undefined && (
          <div className="p-3 rounded-lg border bg-green-50 dark:bg-green-950/20">
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Tillförlitlighet</div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full" 
                  style={{ width: `${method.reliability}%` }} 
                />
              </div>
              <span className="text-sm font-medium">{method.reliability}%</span>
            </div>
          </div>
        )}
        
        {method.primarySource && (
          <div className="p-3 rounded-lg border">
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Primärkälla</div>
            <div className="flex items-center justify-between">
              <span className="text-sm">{method.primarySource.name}</span>
              {method.primarySource.url && (
                <a 
                  href={method.primarySource.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-xs flex items-center gap-1"
                >
                  Öppna <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Level 4: Limitations
function ExplanationLevel4({ explanation, type }: { explanation: any; type: string }) {
  const lim = explanation.limitations;
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-orange-500" />
        {lim.title}
      </h3>
      
      {(lim.items || lim.methodologicalIssues) && (
        <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Metodologiska begränsningar</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {(lim.items || lim.methodologicalIssues).map((item: string, i: number) => (
                <li key={i} className="text-sm flex items-start gap-2">
                  <span className="text-orange-500 mt-1">⚠</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
      
      {lim.notShown && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Detta visas inte</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {lim.notShown.map((item: string, i: number) => (
                <li key={i} className="text-sm flex items-start gap-2">
                  <span className="text-red-500 mt-1">✕</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
      
      {lim.commonMisinterpretations && (
        <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Vanliga feltolkningar</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {lim.commonMisinterpretations.map((item: string, i: number) => (
                <li key={i} className="text-sm flex items-start gap-2">
                  <span className="text-amber-600 mt-1">❌</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Level 5: Raw Data
function ExplanationLevel5({ explanation, type }: { explanation: any; type: string }) {
  const raw = explanation.rawData;
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg flex items-center gap-2">
        <Database className="h-5 w-5 text-gray-500" />
        {raw.title}
      </h3>
      
      <div className="grid gap-3">
        {raw.accessLevel && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Tillgänglighet:</span>
            <Badge 
              variant="outline"
              className={cn(
                raw.accessLevel === 'open' && 'border-green-500 text-green-700',
                raw.accessLevel === 'partial' && 'border-amber-500 text-amber-700',
                raw.accessLevel === 'restricted' && 'border-red-500 text-red-700',
                raw.accessLevel === 'computed' && 'border-purple-500 text-purple-700'
              )}
            >
              {raw.accessLevel === 'open' ? 'Öppen data' : 
               raw.accessLevel === 'partial' ? 'Delvis öppen' :
               raw.accessLevel === 'computed' ? 'Beräknad' : 'Begränsad'}
            </Badge>
          </div>
        )}
        
        {raw.format && (
          <div className="p-3 rounded-lg border">
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Format</div>
            <div className="text-sm">{raw.format}</div>
          </div>
        )}
        
        {raw.sources && (
          <div className="p-3 rounded-lg border">
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Källor</div>
            <ul className="space-y-2">
              {raw.sources.map((source: any, i: number) => (
                <li key={i} className="flex items-center justify-between text-sm">
                  <span>{source.name}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">{source.type}</Badge>
                    {source.url && (
                      <a 
                        href={source.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {raw.downloadUrl && (
          <Button variant="outline" asChild className="w-full">
            <a href={raw.downloadUrl} target="_blank" rel="noopener noreferrer">
              <Database className="h-4 w-4 mr-2" />
              Ladda ner rådata
              <ExternalLink className="h-3 w-3 ml-2" />
            </a>
          </Button>
        )}
        
        {raw.apiEndpoint && (
          <div className="p-3 rounded-lg border bg-muted/30">
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">API Endpoint</div>
            <code className="text-xs break-all">{raw.apiEndpoint}</code>
          </div>
        )}
      </div>
    </div>
  );
}

// ========== CLICKABLE BADGE FOR TRIGGERING EXPLANATION ==========

interface ExplanationTriggerProps {
  type: 'comparison_mode' | 'indicator';
  id: string;
  label: string;
  className?: string;
}

export function ExplanationTrigger({ type, id, label, className }: ExplanationTriggerProps) {
  const [open, setOpen] = useState(false);
  
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "inline-flex items-center gap-1 text-sm hover:underline cursor-pointer",
          "text-primary hover:text-primary/80 transition-colors",
          className
        )}
      >
        {label}
        <Info className="h-3 w-3" />
      </button>
      <ExplanationPyramidDialog 
        type={type} 
        id={id} 
        open={open} 
        onOpenChange={setOpen} 
      />
    </>
  );
}
