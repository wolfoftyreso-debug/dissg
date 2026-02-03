/**
 * INFINITE DEPTH DEMO
 * ═══════════════════════════════════════════════════════════════
 * 
 * Demonstrates the Spotless Protocol: Every piece of data is clickable
 * and leads to infinite depth of understanding.
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { ClickableDataPoint, createDataPoint, DataPoint } from '@/components/data';
import { Info, MousePointer, Layers, ArrowRight } from 'lucide-react';

// =============================================================================
// DEMO DATA
// =============================================================================

const demoDataPoints: DataPoint[] = [
  {
    id: 'gdp-per-capita-se',
    value: 578420,
    unit: 'SEK',
    label: 'BNP per capita Sverige',
    type: 'currency',
    confidence: 0.95,
    geoScope: 'Sverige',
    timeScope: { start: '2023-01-01', end: '2023-12-31' },
    depth: [
      {
        level: 1,
        title: 'Observation',
        content: 'Sveriges BNP per capita uppgick till 578 420 SEK under 2023, vilket motsvarar en realökning om 1,2% jämfört med föregående år efter justering för inflation.',
        shows: [
          'Totalt ekonomiskt värde delat på befolkningen',
          'Jämförbarhet med andra länder och tidsperioder',
          'Trend över tid',
        ],
        doesNotShow: [
          'Fördelning av välstånd inom befolkningen',
          'Livskvalitet eller välfärd',
          'Miljöpåverkan av ekonomisk aktivitet',
          'Obetalt arbete (hushållsarbete, omsorg)',
        ],
      },
      {
        level: 2,
        title: 'Mekanism',
        content: 'BNP per capita beräknas genom att dividera landets totala BNP med befolkningen. Ökningen 2023 drevs primärt av tjänstesektorn (+2,8%) och export (+3,1%), medan byggsektor (-4,2%) och detaljhandel (-1,8%) hade negativ påverkan.',
        data: {
          type: 'comparison',
          data: [
            { name: 'Tjänstesektor', value: 2.8 },
            { name: 'Export', value: 3.1 },
            { name: 'Industri', value: 0.5 },
            { name: 'Detaljhandel', value: -1.8 },
            { name: 'Byggsektorn', value: -4.2 },
          ],
        },
      },
      {
        level: 3,
        title: 'Metod',
        content: 'SCB samlar in data från företagsundersökningar, administrativa register och nationalräkenskaper. BNP beräknas enligt ESA 2010-standarden som används av alla EU-länder.',
        sources: [
          {
            id: 'scb-nr',
            name: 'SCB Nationalräkenskaper',
            type: 'official',
            url: 'https://scb.se/nr',
            accessDate: '2024-03-15',
            reliability: 96,
            methodology: 'ESA 2010',
          },
          {
            id: 'eurostat',
            name: 'Eurostat',
            type: 'institutional',
            url: 'https://ec.europa.eu/eurostat',
            accessDate: '2024-03-10',
            reliability: 94,
          },
        ],
      },
      {
        level: 4,
        title: 'Begränsningar',
        content: 'BNP har betydande begränsningar som mått på välstånd och kan inte ensamt användas för att bedöma samhällets tillstånd.',
        doesNotShow: [
          'Inkomstfördelning (Gini: 0.28 i Sverige)',
          'Miljökostnader och resursuttag',
          'Obetalt arbete (värderas till ~25% av BNP)',
          'Svart ekonomi (uppskattas till 8-15% av BNP)',
          'Kvalitetsförbättringar i tjänster',
          'Subjektiv livskvalitet och välbefinnande',
        ],
      },
      {
        level: 5,
        title: 'Rådata',
        content: 'Underliggande tidsseriedata för BNP per capita.',
        data: {
          type: 'chart',
          data: [
            { year: 2015, value: 456000 },
            { year: 2016, value: 468000 },
            { year: 2017, value: 485000 },
            { year: 2018, value: 502000 },
            { year: 2019, value: 518000 },
            { year: 2020, value: 495000 },
            { year: 2021, value: 532000 },
            { year: 2022, value: 558000 },
            { year: 2023, value: 578420 },
          ],
        },
        sources: [
          {
            id: 'scb-raw',
            name: 'SCB Statistikdatabasen',
            type: 'official',
            url: 'https://statistikdatabasen.scb.se',
            accessDate: '2024-03-15',
            reliability: 98,
          },
        ],
        drillDown: [
          {
            id: 'regional-breakdown',
            label: 'Regional fördelning',
            description: 'BNP per capita uppdelat på län',
          },
          {
            id: 'sector-breakdown',
            label: 'Sektorsfördelning',
            description: 'Bidrag från olika ekonomiska sektorer',
          },
          {
            id: 'historical-comparison',
            label: 'Historisk jämförelse',
            description: 'Utveckling sedan 1950',
          },
        ],
      },
    ],
  },
  {
    id: 'unemployment-rate-se',
    value: 7.8,
    unit: '%',
    label: 'Arbetslöshet',
    type: 'percentage',
    confidence: 0.92,
    geoScope: 'Sverige',
    timeScope: { start: '2024-01-01', end: '2024-01-31' },
    depth: [
      {
        level: 1,
        title: 'Observation',
        content: 'Arbetslösheten i Sverige uppgick till 7,8% i januari 2024, vilket är 0,3 procentenheter högre än samma månad föregående år.',
        shows: [
          'Andel av arbetskraften som är arbetslös',
          'Förändring jämfört med tidigare perioder',
        ],
        doesNotShow: [
          'Kvalitet på de jobb som finns',
          'Undersysselsättning (deltid mot sin vilja)',
          'Dolda arbetslösa (studerar, förtidspension)',
        ],
      },
      {
        level: 2,
        title: 'Mekanism',
        content: 'Arbetslösheten definieras som personer 15-74 år som är utan arbete, har sökt arbete och kan börja arbeta inom 14 dagar. Ökningen beror främst på minskad efterfrågan inom byggsektorn och detaljhandeln.',
      },
      {
        level: 3,
        title: 'Metod',
        content: 'Arbetskraftsundersökningen (AKU) genomförs av SCB med telefonintervjuer av cirka 29 000 personer varje månad. Metoden följer ILO-standard.',
        sources: [
          {
            id: 'scb-aku',
            name: 'SCB Arbetskraftsundersökningar',
            type: 'official',
            url: 'https://scb.se/aku',
            accessDate: '2024-02-20',
            reliability: 94,
          },
        ],
      },
      {
        level: 4,
        title: 'Begränsningar',
        content: 'AKU-arbetslösheten fångar inte alla aspekter av arbetsmarknaden.',
        doesNotShow: [
          'Dolda arbetslösa i program/studier: +2,5%',
          'Undersysselsatta: +3,1%',
          'Latent arbetssökande: +1,8%',
          'Kvalitet och trygghet i anställningar',
        ],
      },
    ],
  },
  {
    id: 'lambda-index',
    value: 0.94,
    label: 'Lambda Index (Sverige)',
    type: 'index',
    confidence: 0.88,
    geoScope: 'Sverige',
    timeScope: { start: '2024-01-01', end: '2024-01-31' },
    depth: [
      {
        level: 1,
        title: 'Observation',
        content: 'Sveriges Lambda-index ligger på 0.94, vilket indikerar en lätt underoptimerad systembalans. Värdet ligger inom normalintervallet (0.85-1.15) men under det optimala jämviktsläget 1.0.',
        shows: [
          'Aggregerat balansmått för samhällssystem',
          'Avvikelse från optimal jämvikt',
          'Riktning på systemstress',
        ],
        doesNotShow: [
          'Vilka specifika system som är stressade',
          'Kausalitet eller lösningar',
          'Subjektiva livskvalitetsaspekter',
        ],
      },
      {
        level: 2,
        title: 'Mekanism',
        content: 'Lambda beräknas som kvoten S_observed / S_optimal över fem universella domäner: Liv & Hälsa (25%), Försörjning & Arbete (25%), Kunskap & Kompetens (20%), Stabilitet & Säkerhet (15%), Resurs & Miljöbas (15%).',
        data: {
          type: 'comparison',
          data: [
            { name: 'Liv & Hälsa', value: 0.96 },
            { name: 'Försörjning', value: 0.91 },
            { name: 'Kunskap', value: 0.95 },
            { name: 'Stabilitet', value: 0.92 },
            { name: 'Miljö', value: 0.94 },
          ],
        },
      },
      {
        level: 3,
        title: 'Metod',
        content: 'Lambda aggregerar 24+ sensorindikatorer genom viktad normalisering mot historiska optimum-värden härledda från empiriska studier av högpresterande samhällen.',
        sources: [
          {
            id: 'lambda-calc',
            name: 'Lambda Calculator v1.0',
            type: 'calculated',
            url: '/lambda/methodology',
            accessDate: '2024-02-01',
            reliability: 85,
            methodology: 'Viktad aggregering med empirisk kalibrering',
          },
        ],
      },
      {
        level: 4,
        title: 'Begränsningar',
        content: 'Lambda är ett experimentellt aggregerat mått med inneboende begränsningar.',
        doesNotShow: [
          'Modellen kan inte fånga alla systemaspekter',
          'Viktningen är normativ och kan ifrågasättas',
          'Historiska optimum kanske inte gäller framtiden',
          '"Optimal" nivå varierar mellan kontexter',
        ],
      },
    ],
  },
];

// =============================================================================
// DEMO PAGE
// =============================================================================

const InfiniteDepthDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-12 px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-12">
          <Badge className="mb-4">Spotless Protocol</Badge>
          <h1 className="text-4xl font-bold mb-4">Oändligt Informationsdjup</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Varje siffra, varje datapunkt, varje påstående kan klickas för att 
            avslöja djupare förståelse. Inget visas som inte kan förklaras.
          </p>
        </div>
        
        {/* Instruction */}
        <Alert className="mb-8">
          <MousePointer className="h-4 w-4" />
          <AlertDescription>
            <strong>Instruktion:</strong> Klicka på valfri siffra eller datapunkt nedan för att 
            öppna fördjupningsvyn med 5 nivåer av förklaring.
          </AlertDescription>
        </Alert>
        
        {/* Demo Cards */}
        <div className="grid gap-6">
          {/* Hero Data Point */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5" />
                Hero-visning
              </CardTitle>
              <CardDescription>
                Stor klickbar datapunkt med full kontextinformation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ClickableDataPoint 
                dataPoint={demoDataPoints[0]} 
                variant="hero"
                showTrend
                trend="up"
                trendValue={1.2}
              />
            </CardContent>
          </Card>
          
          {/* Card Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Kort-visning</CardTitle>
              </CardHeader>
              <CardContent>
                <ClickableDataPoint 
                  dataPoint={demoDataPoints[1]} 
                  variant="card"
                  showTrend
                  trend="up"
                  trendValue={0.3}
                  showConfidence
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Index-visning</CardTitle>
              </CardHeader>
              <CardContent>
                <ClickableDataPoint 
                  dataPoint={demoDataPoints[2]} 
                  variant="card"
                  showTrend
                  trend="down"
                  trendValue={-0.02}
                  showConfidence
                />
              </CardContent>
            </Card>
          </div>
          
          {/* Inline Examples */}
          <Card>
            <CardHeader>
              <CardTitle>Inline-visning i löpande text</CardTitle>
              <CardDescription>
                Datapunkter integrerade direkt i textflöde
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-relaxed">
                Sveriges ekonomi genererade ett BNP per capita på{' '}
                <ClickableDataPoint 
                  dataPoint={demoDataPoints[0]} 
                  variant="inline"
                  size="sm"
                />{' '}
                under 2023. Samtidigt låg arbetslösheten på{' '}
                <ClickableDataPoint 
                  dataPoint={demoDataPoints[1]} 
                  variant="inline"
                  size="sm"
                />, 
                vilket är något högre än EU-genomsnittet. Det aggregerade Lambda-indexet 
                för systembalans visade{' '}
                <ClickableDataPoint 
                  dataPoint={demoDataPoints[2]} 
                  variant="inline"
                  size="sm"
                />, 
                vilket indikerar lätt underoptimering i samhällssystemet.
              </p>
            </CardContent>
          </Card>
          
          {/* Compact Examples */}
          <Card>
            <CardHeader>
              <CardTitle>Kompakt-visning</CardTitle>
              <CardDescription>
                Minimala klickbara värden med tooltip
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-6">
                <div>
                  <span className="text-xs text-muted-foreground block mb-1">BNP/capita</span>
                  <ClickableDataPoint 
                    dataPoint={demoDataPoints[0]} 
                    variant="compact"
                    size="lg"
                  />
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block mb-1">Arbetslöshet</span>
                  <ClickableDataPoint 
                    dataPoint={demoDataPoints[1]} 
                    variant="compact"
                    size="lg"
                  />
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block mb-1">Lambda</span>
                  <ClickableDataPoint 
                    dataPoint={demoDataPoints[2]} 
                    variant="compact"
                    size="lg"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Separator className="my-12" />
        
        {/* Explanation */}
        <Card className="bg-muted/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Förklaringspyramiden
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <Badge variant="outline">L1</Badge>
                <div>
                  <p className="font-medium">Observation</p>
                  <p className="text-sm text-muted-foreground">Vad visar datan? Sammanfattning och trender.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Badge variant="outline">L2</Badge>
                <div>
                  <p className="font-medium">Mekanism</p>
                  <p className="text-sm text-muted-foreground">Hur fungerar det? Drivkrafter och samband.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Badge variant="outline">L3</Badge>
                <div>
                  <p className="font-medium">Metod</p>
                  <p className="text-sm text-muted-foreground">Hur vet vi detta? Datakällor och metodologi.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Badge variant="outline">L4</Badge>
                <div>
                  <p className="font-medium">Begränsningar</p>
                  <p className="text-sm text-muted-foreground">Vad visar detta INTE? Kända brister och luckor.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Badge variant="outline">L5</Badge>
                <div>
                  <p className="font-medium">Rådata</p>
                  <p className="text-sm text-muted-foreground">Underliggande siffror och primärkällor.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InfiniteDepthDemo;
