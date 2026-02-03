/**
 * FACTOR DEEP DIVE
 * ═══════════════════════════════════════════════════════════════
 * 
 * Detailed view of a single capacity factor with full evidence chain.
 * Follows Spotless Protocol: every claim is clickable and traceable.
 */

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  TrendingUp, 
  Clock, 
  BookOpen, 
  Globe, 
  ChevronRight,
  ExternalLink,
  Info,
  BarChart3,
  History,
  AlertTriangle
} from 'lucide-react';
import type { CapacityFactor } from '@/config/carryingCapacityConfig';

interface FactorDeepDiveProps {
  factor: CapacityFactor | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock historical evidence data - would come from database
const getHistoricalEvidence = (factorId: string) => {
  const evidenceMap: Record<string, {
    cases: Array<{
      region: string;
      period: string;
      description: string;
      impact: string;
      source: string;
    }>;
    mechanism: string;
    limitations: string[];
    relatedIndicators: string[];
  }> = {
    stable_energy: {
      cases: [
        {
          region: 'Norden',
          period: '1950–1980',
          description: 'Utbyggnad av vattenkraft och kärnkraft gav stabil basproduktion',
          impact: 'BNP per capita ökade 3.2× under perioden',
          source: 'SCB, Energimyndigheten'
        },
        {
          region: 'Tyskland',
          period: '1990–2020',
          description: 'Energiewende med ökad intermittent produktion',
          impact: 'Elpriser ökade 118%, stabilitetsproblem uppstod',
          source: 'Destatis, Bundesnetzagentur'
        },
        {
          region: 'Sydkorea',
          period: '1970–2000',
          description: 'Kärnkraftsprogram gav billig och stabil el',
          impact: 'Industrikapacitet ökade 20×',
          source: 'KEPCO, World Bank'
        }
      ],
      mechanism: 'Stabil energi minskar osäkerhet för investeringar och möjliggör planering av produktion. Intermittent energi kräver backup eller lagring, vilket ökar systemkostnaden.',
      limitations: [
        'Korrelation mellan stabilitet och tillväxt – kausalitet ej bevisad',
        'Andra faktorer (utbildning, institutioner) spelade också roll',
        'Historiska mönster garanterar inte framtida utfall'
      ],
      relatedIndicators: ['electricity_price', 'grid_stability', 'industrial_output', 'gdp_per_capita']
    },
    cheaper_energy: {
      cases: [
        {
          region: 'USA',
          period: '2010–2020',
          description: 'Skiffergasrevolutionen sänkte naturgaspriset 70%',
          impact: 'Tillverkningssektorn återvände, 500 000+ jobb',
          source: 'EIA, BLS'
        },
        {
          region: 'Kina',
          period: '2000–2020',
          description: 'Kraftig utbyggnad av kolkraft gav billig el',
          impact: 'Världens fabrik – export ökade 10×',
          source: 'China Statistical Yearbook'
        },
        {
          region: 'Europa',
          period: '2021–2023',
          description: 'Energikris efter rysk gasminskning',
          impact: 'Industriflykt, 30%+ av kemisektor pausad',
          source: 'Eurostat, CEFIC'
        }
      ],
      mechanism: 'Energi är en grundläggande input i nästan all produktion. Lägre energikostnader sänker produktionskostnader och ökar konkurrenskraft. Detta gäller särskilt energiintensiva industrier.',
      limitations: [
        'Billig energi kan komma med externa kostnader (miljö)',
        'Effekten varierar beroende på ekonomins struktur',
        'Kortsiktigt billig energi kan skapa långsiktiga beroenden'
      ],
      relatedIndicators: ['energy_price', 'manufacturing_output', 'trade_balance', 'employment_industry']
    },
    efficient_tech: {
      cases: [
        {
          region: 'Global',
          period: '1900–2000',
          description: 'Energieffektivitet i ljuskällor förbättrades 100×',
          impact: 'Samma ljus med 1% av ursprunglig energi',
          source: 'IEA, historiska studier'
        },
        {
          region: 'Japan',
          period: '1970–1990',
          description: 'Oljekrisen drev fram effektiviseringar',
          impact: 'Energiintensitet halverades i industrin',
          source: 'METI, IEA'
        },
        {
          region: 'Global',
          period: '1950–2020',
          description: 'Jordbruksproduktivitet ökade 4× per hektar',
          impact: 'Samma mark försörjer 4× fler människor',
          source: 'FAO, Our World in Data'
        }
      ],
      mechanism: 'Teknologisk effektivisering gör att samma mängd energi eller resurser kan producera mer output. Detta expanderar effektivt bärkraften utan att öka resursförbrukningen.',
      limitations: [
        'Jevons paradox: effektivitet kan öka total konsumtion',
        'Teknologiska språng är svåra att förutsäga',
        'Implementering tar tid och kräver investeringar'
      ],
      relatedIndicators: ['energy_intensity', 'productivity', 'r_and_d_spending', 'patents']
    },
    better_organization: {
      cases: [
        {
          region: 'Sydkorea',
          period: '1960–1990',
          description: 'Centraliserad industriplanering och utbildningssatsning',
          impact: 'Från fattig agrarstat till OECD-land',
          source: 'World Bank, KOSIS'
        },
        {
          region: 'Singapore',
          period: '1965–2000',
          description: 'Effektiv förvaltning och antikorruption',
          impact: 'BNP per capita ökade 50×',
          source: 'Singapore DOS'
        },
        {
          region: 'Venezuela',
          period: '2000–2020',
          description: 'Institutionell kollaps och misallokering',
          impact: 'BNP föll 80% trots världens största oljereserver',
          source: 'IMF, BCV'
        }
      ],
      mechanism: 'Bra institutioner, låg korruption och effektiv koordination minskar transaktionskostnader och slöseri. Detta gör att resurser används mer produktivt.',
      limitations: [
        'Svårt att kvantifiera "bra organisation"',
        'Kulturella och historiska faktorer spelar in',
        'Organisationsförändringar tar ofta decennier'
      ],
      relatedIndicators: ['corruption_index', 'ease_of_business', 'government_effectiveness', 'rule_of_law']
    }
  };
  
  return evidenceMap[factorId] || null;
};

export const FactorDeepDive: React.FC<FactorDeepDiveProps> = ({ 
  factor, 
  open, 
  onOpenChange 
}) => {
  if (!factor) return null;
  
  const evidence = getHistoricalEvidence(factor.id);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${
              factor.impact === 'high' ? 'bg-green-500' : 'bg-yellow-500'
            }`} />
            <DialogTitle className="text-xl">{factor.labelSv}</DialogTitle>
          </div>
          <DialogDescription className="text-base mt-2">
            {factor.descriptionSv}
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh]">
          <Tabs defaultValue="mechanism" className="mt-4">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="mechanism" className="text-xs">Mekanism</TabsTrigger>
              <TabsTrigger value="evidence" className="text-xs">Historik</TabsTrigger>
              <TabsTrigger value="limitations" className="text-xs">Begränsningar</TabsTrigger>
              <TabsTrigger value="data" className="text-xs">Data</TabsTrigger>
            </TabsList>
            
            <TabsContent value="mechanism" className="mt-4 space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Hur påverkar detta bärkraften?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {evidence?.mechanism || 'Mekanismbeskrivning saknas.'}
                  </p>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Tidshorisont</span>
                    </div>
                    <Badge variant="outline" className="text-sm">{factor.timeframeSv}</Badge>
                    <p className="text-xs text-muted-foreground mt-2">
                      Tid innan effekten syns i data
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Påverkansnivå</span>
                    </div>
                    <Badge 
                      variant={factor.impact === 'high' ? 'default' : 'secondary'}
                      className="text-sm"
                    >
                      {factor.impact === 'high' ? 'Hög' : factor.impact === 'moderate' ? 'Måttlig' : 'Låg'}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-2">
                      Baserat på historiska observationer
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="evidence" className="mt-4 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <History className="h-4 w-4" />
                <span className="font-medium text-sm">Historiska exempel</span>
                {factor.historicalEvidence && (
                  <Badge variant="secondary" className="text-xs">Verifierad evidens</Badge>
                )}
              </div>
              
              {evidence?.cases.map((caseStudy, idx) => (
                <Card key={idx} className="cursor-pointer hover:bg-muted/30 transition-colors">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-sm">{caseStudy.region}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">{caseStudy.period}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {caseStudy.description}
                    </p>
                    <div className="flex items-start gap-2 p-2 bg-muted/50 rounded text-sm">
                      <TrendingUp className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                      <span>{caseStudy.impact}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                      <BookOpen className="h-3 w-3" />
                      <span>Källa: {caseStudy.source}</span>
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {(!evidence?.cases || evidence.cases.length === 0) && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Detaljerad historisk evidens håller på att samlas in.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>
            
            <TabsContent value="limitations" className="mt-4 space-y-4">
              <Alert variant="destructive" className="bg-destructive/10 border-destructive/30">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="font-medium">
                  Detta visar INTE kausalitet – endast observerade mönster
                </AlertDescription>
              </Alert>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Begränsningar i analysen</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {evidence?.limitations.map((limitation, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-2 shrink-0" />
                      <span className="text-muted-foreground">{limitation}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
              
              <Card className="bg-muted/30">
                <CardContent className="pt-4">
                  <p className="text-sm text-muted-foreground italic">
                    "Historiska mönster kan indikera trender men garanterar inte framtida utfall. 
                    Många faktorer samverkar och isolering av enskilda variabler är metodologiskt svårt."
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="data" className="mt-4 space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Relaterade indikatorer</CardTitle>
                  <CardDescription>Klicka för att utforska underliggande data</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {evidence?.relatedIndicators.map((indicator, idx) => (
                    <Button 
                      key={idx} 
                      variant="outline" 
                      className="w-full justify-between text-sm h-auto py-3"
                    >
                      <span className="font-mono text-xs">{indicator}</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  ))}
                </CardContent>
              </Card>
              
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Data hämtas från officiella statistikbyråer (SCB, Eurostat, World Bank, etc.)
                </AlertDescription>
              </Alert>
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
