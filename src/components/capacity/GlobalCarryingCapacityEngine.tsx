/**
 * GLOBAL CARRYING CAPACITY ENGINE (GCCE)
 * 
 * "Hur många människor kan leva bra – givet energi, teknik och resurser?"
 * 
 * DESIGN PRINCIPLE: No abstract icons. All data points are explained with:
 * - Clear text labels
 * - Mini sparklines showing actual trajectories
 * - Expandable "What this shows / does not show" sections
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronRight, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ExpandableBadge } from '@/components/ui/ExpandableBadge';
import { EnergyBaselineCard, EnergyConsequenceCard } from '@/components/ui/ExpandableStatementCard';
import { DescriptiveMetricCard } from '@/components/ui/MiniSparkline';
import {
  ExpandableInfoAlert,
  SystemInterpretationAlert,
  PopulationResultAlert,
  ImbalanceProblemAlert,
  PhysicalLawAlert,
  GCCEDefinitionAlert,
} from '@/components/ui/ExpandableInfoAlert';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import {
  GCCE_CORE_DEFINITION,
  GCCE_NOT_DEFINITIONS,
  CAPACITY_AXES,
  GLOBAL_CAPACITY_DATA,
  PRESS_ZONES,
  POSITIVE_FACTORS,
  ENERGY_HONESTY,
  REGIONAL_CAPACITY_DATA,
  HISTORICAL_TIMELINE,
  SYSTEM_CONNECTIONS,
  KEY_MESSAGES,
  type CapacityFactor,
  type PressZone
} from '@/config/carryingCapacityConfig';
import { FactorDeepDive } from './FactorDeepDive';
import { RegionDeepDive } from './RegionDeepDive';
import { WelfarePrincipleExpander, PopulationCapacityExpander } from './SystemPrincipleExpander';

// Sample sparkline data for each metric (would come from API in production)
const SPARKLINE_DATA = {
  population: [7.2, 7.4, 7.6, 7.8, 7.9, 8.0, 8.1],
  energy: [18.5, 19.0, 19.3, 19.8, 20.2, 20.7, 21],
  tech: [52, 55, 58, 61, 63, 65, 67],
  institutions: [54, 54, 53, 54, 54, 54, 54],
  wellbeing: [62, 63, 63.5, 64, 64.2, 64.5, 65]
};

/**
 * Global Status Panel
 * 
 * Replaces icon-based metrics with descriptive cards showing:
 * - Clear metric name and explanation
 * - Current value with unit
 * - Sparkline showing actual trajectory
 * - Trend description in plain text
 */
const GlobalStatusPanel: React.FC = () => {
  const data = GLOBAL_CAPACITY_DATA;
  
  return (
    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Global bärkraft – nuläge</CardTitle>
        <CardDescription>
          Systemets kapacitet att upprätthålla mänskligt välbefinnande. Klicka på varje panel för detaljer.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 md:grid-cols-5">
          {/* Population */}
          <DescriptiveMetricCard
            title="Befolkning"
            description="Totalt antal människor på jorden"
            value={data.population.current}
            unit="miljarder"
            change={data.population.growthRate}
            changePeriod="per år"
            sparklineData={SPARKLINE_DATA.population}
            whatThisShows="Demografisk utveckling baserad på FN-data"
            whatThisDoesNotShow="Fördelning av resurser eller livskvalitet"
          />
          
          {/* Energy per capita */}
          <DescriptiveMetricCard
            title="Energi per person"
            description="Genomsnittlig energianvändning"
            value={data.energyPerCapita.value}
            unit="MWh/år"
            change={data.energyPerCapita.changePercent}
            changePeriod="senaste 5 åren"
            sparklineData={SPARKLINE_DATA.energy}
            whatThisShows="Tillgänglig energi för produktion och konsumtion"
            whatThisDoesNotShow="Energikvalitet eller fördelning mellan länder"
          />
          
          {/* Tech efficiency */}
          <DescriptiveMetricCard
            title="Teknikeffektivitet"
            description="Hur väl vi omvandlar resurser till nytta"
            value={data.technicalEfficiency.index}
            unit="index"
            change={data.technicalEfficiency.changePercent}
            changePeriod="senaste 5 åren"
            sparklineData={SPARKLINE_DATA.tech}
            whatThisShows="Teknologisk produktivitet per energienhet"
            whatThisDoesNotShow="Miljöpåverkan eller hållbarhet"
          />
          
          {/* Institutions */}
          <DescriptiveMetricCard
            title="Institutioner"
            description="Samhällsorganisationens kvalitet"
            value={data.institutionalQuality.index}
            unit="index"
            change={data.institutionalQuality.changePercent}
            changePeriod="senaste 5 åren"
            sparklineData={SPARKLINE_DATA.institutions}
            whatThisShows="Rättsstat, korruption, administrativa system"
            whatThisDoesNotShow="Kulturella faktorer eller lokal variation"
          />
          
          {/* Wellbeing */}
          <DescriptiveMetricCard
            title="Välbefinnande"
            description="Aggregerat mått på livskvalitet"
            value={data.humanWellbeing.index}
            unit="index"
            change={data.humanWellbeing.changePercent}
            changePeriod="senaste 5 åren"
            sparklineData={SPARKLINE_DATA.wellbeing}
            whatThisShows="Hälsa, utbildning, ekonomisk trygghet"
            whatThisDoesNotShow="Subjektiv lycka eller meningsfullhet"
          />
        </div>
        
        <SystemInterpretationAlert statement={KEY_MESSAGES.currentState.sv} />
      </CardContent>
    </Card>
  );
};

// Three axes visualization - FULLY CLICKABLE
const ThreeAxesPanel: React.FC<{ onAxisClick: (axisId: string) => void }> = ({ onAxisClick }) => {
  const radarData = CAPACITY_AXES.map(axis => ({
    axis: axis.labelSv,
    value: axis.id === 'energy' ? 72 : axis.id === 'technology' ? 67 : 54,
    fullMark: 100
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">De tre obrytbara axlarna</CardTitle>
        <CardDescription>All bärkraft är funktion av dessa – klicka för fördjupning</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="axis" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar
                  name="Nuläge"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="space-y-3">
            {CAPACITY_AXES.map(axis => (
              <button
                key={axis.id}
                onClick={() => onAxisClick(axis.id)}
                className="w-full text-left p-3 border rounded-lg hover:bg-muted/30 hover:border-primary/50 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm group-hover:text-primary transition-colors">{axis.labelSv}</span>
                  <Badge variant="outline" className="text-xs">
                    {axis.id === 'energy' ? '72' : axis.id === 'technology' ? '67' : '54'} index
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{axis.descriptionSv}</p>
                <div className="flex flex-wrap gap-1">
                  {axis.components.map(c => (
                    <ExpandableBadge
                      key={c.id}
                      text={c.labelSv}
                      fallbackEvidence={{
                        scientificBasis: `Del av ${axis.labelSv}: ${axis.descriptionSv}`,
                        whatThisProves: [`Bidrar till ${axis.labelSv.toLowerCase()}`],
                        limitations: ['Komponentdata aggregeras på axelnivå']
                      }}
                    />
                  ))}
                </div>
                <div className="mt-2 flex justify-end">
                  <Badge variant="secondary" className="text-xs">
                    {axis.components.length} källor
                    <span className="ml-1 opacity-60">+</span>
                  </Badge>
                </div>
              </button>
            ))}
          </div>
        </div>
        
        <PopulationResultAlert className="mt-4" />
      </CardContent>
    </Card>
  );
};

// Press zones panel - CLICKABLE for deep dive
const PressZonesPanel: React.FC<{ onZoneClick: (zone: PressZone) => void }> = ({ onZoneClick }) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-base">Tryckzoner</CardTitle>
      <CardDescription>
        Regioner där systemet är under press — inte "överbefolkning", utan strukturella obalanser. 
        Klicka för att se fullständig analys.
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-3">
      {PRESS_ZONES.map(zone => (
        <button
          key={zone.id}
          onClick={() => onZoneClick(zone)}
          className={`w-full text-left p-4 border rounded-lg transition-all cursor-pointer group hover:border-primary/50 ${
            zone.severity === 'high' ? 'border-destructive/30 bg-destructive/5 hover:bg-destructive/10' :
            zone.severity === 'moderate' ? 'border-primary/30 bg-primary/5 hover:bg-primary/10' :
            'border-secondary bg-secondary/30 hover:bg-secondary/50'
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium text-sm group-hover:text-primary transition-colors">{zone.regionSv}</span>
                <Badge variant={zone.severity === 'high' ? 'destructive' : 'secondary'} className="text-xs">
                  {zone.severity === 'high' ? 'Hög belastning' : zone.severity === 'moderate' ? 'Måttlig belastning' : 'Framväxande risk'}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-2">{zone.descriptionSv}</p>
              
              {/* Factor tags - text-based instead of icons */}
              <div className="flex flex-wrap gap-1.5">
                {zone.factors.energyPressure && (
                  <Badge variant="outline" className="text-xs bg-primary/10">Energibrist</Badge>
                )}
                {zone.factors.populationGrowth && (
                  <Badge variant="outline" className="text-xs bg-primary/10">Befolkningstillväxt</Badge>
                )}
                {zone.factors.institutionalWeakness && (
                  <Badge variant="outline" className="text-xs bg-destructive/10 text-destructive">Svaga institutioner</Badge>
                )}
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors mt-1 shrink-0" />
          </div>
        </button>
      ))}
      
      <ImbalanceProblemAlert className="mt-4" />
    </CardContent>
  </Card>
);

// What increases capacity
const PositiveFactorsPanel: React.FC<{ onFactorClick: (factor: CapacityFactor) => void }> = ({ onFactorClick }) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-base">Vad ökar bärkraften?</CardTitle>
      <CardDescription>Datadrivet, inte slogans — klicka för att fördjupa</CardDescription>
    </CardHeader>
    <CardContent className="space-y-3">
      {POSITIVE_FACTORS.map(factor => (
        <button
          key={factor.id}
          onClick={() => onFactorClick(factor)}
          className="w-full flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/30 hover:border-primary/50 transition-all cursor-pointer text-left group"
        >
          <div className={`w-2 h-2 rounded-full mt-2 ${
            factor.impact === 'high' ? 'bg-green-500' : 'bg-yellow-500'
          }`} />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm group-hover:text-primary transition-colors">{factor.labelSv}</span>
              <Badge variant="outline" className="text-xs">{factor.timeframeSv}</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{factor.descriptionSv}</p>
          </div>
          {factor.historicalEvidence && (
            <Badge variant="secondary" className="text-xs shrink-0">✓ Historisk evidens</Badge>
          )}
          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors mt-1" />
        </button>
      ))}
    </CardContent>
  </Card>
);

// Energy honesty panel
const EnergyHonestyPanel: React.FC = () => (
  <Card className="border-primary/30 bg-primary/5">
    <CardHeader>
      <CardTitle className="text-base">Energiärlighet</CardTitle>
      <CardDescription>
        Grundläggande fysiska begränsningar som sätter ramarna för all bärkraft
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <EnergyBaselineCard energyValue={21} />
      <EnergyConsequenceCard />
      <PhysicalLawAlert statement={ENERGY_HONESTY.physics.sv} />
    </CardContent>
  </Card>
);

// Regional capacity view - ALL ELEMENTS CLICKABLE
const RegionalCapacityPanel: React.FC = () => {
  const [expandedRegion, setExpandedRegion] = useState<string | null>(null);
  const [expandedMetric, setExpandedMetric] = useState<{ regionId: string; metric: string } | null>(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Regional bärkraft</CardTitle>
        <CardDescription>
          Lokal vs importerad kapacitet & sårbarhet. 
          <span className="text-primary ml-1">Klicka på varje region och mätstapel för djupare analys.</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {REGIONAL_CAPACITY_DATA.map(region => (
            <div key={region.id} className="border rounded-lg overflow-hidden">
              {/* Clickable region header */}
              <button
                onClick={() => setExpandedRegion(expandedRegion === region.id ? null : region.id)}
                className="w-full p-3 flex items-center justify-between hover:bg-muted/50 transition-colors text-left"
              >
                <span className="font-medium text-sm">{region.nameSv}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {region.energyPerCapita} MWh/cap
                  </Badge>
                  <span className="text-xs opacity-50">{expandedRegion === region.id ? '−' : '+'}</span>
                </div>
              </button>
              
              {/* Clickable metrics */}
              <div className="px-3 pb-3 space-y-2">
                {/* Local capacity bar - CLICKABLE */}
                <ClickableMetricBar
                  label="Lokal kapacitet"
                  value={region.localCapacity}
                  unit="%"
                  regionId={region.id}
                  metricType="localCapacity"
                  isExpanded={expandedMetric?.regionId === region.id && expandedMetric?.metric === 'localCapacity'}
                  onToggle={() => setExpandedMetric(
                    expandedMetric?.regionId === region.id && expandedMetric?.metric === 'localCapacity'
                      ? null
                      : { regionId: region.id, metric: 'localCapacity' }
                  )}
                />
                
                {/* Vulnerability bar - CLICKABLE */}
                <ClickableMetricBar
                  label="Sårbarhet"
                  value={region.vulnerabilityIndex}
                  unit=""
                  regionId={region.id}
                  metricType="vulnerability"
                  isExpanded={expandedMetric?.regionId === region.id && expandedMetric?.metric === 'vulnerability'}
                  onToggle={() => setExpandedMetric(
                    expandedMetric?.regionId === region.id && expandedMetric?.metric === 'vulnerability'
                      ? null
                      : { regionId: region.id, metric: 'vulnerability' }
                  )}
                  isWarning={region.vulnerabilityIndex > 40}
                  isDanger={region.vulnerabilityIndex > 60}
                />
              </div>
              
              {/* Expanded region details */}
              {expandedRegion === region.id && (
                <div className="px-3 pb-3 pt-0 border-t bg-muted/30">
                  <RegionDeepInfo region={region} />
                </div>
              )}
            </div>
          ))}
        </div>
        
        <ExpandableInfoAlert
          evidenceKey="imbalance-problem"
          statement="Avslöjar sårbarhet utan moralism."
          icon={<span className="text-sm">📌</span>}
          variant="muted"
          className="mt-4"
          fallbackEvidence={{
            scientificBasis: 'Sårbarhet kan mätas objektivt genom beroende av externa resurser, institutionell kapacitet och geografiska faktorer.',
            sources: [
              { title: 'Global Risk Report', type: 'report', source: 'World Economic Forum', year: 2024 }
            ],
            whatThisProves: ['Sårbarhet är strukturell, inte moralisk'],
            limitations: ['Sårbarhetsmått är kontextberoende']
          }}
        />
      </CardContent>
    </Card>
  );
};

// Clickable metric bar with expandable explanation
interface ClickableMetricBarProps {
  label: string;
  value: number;
  unit: string;
  regionId: string;
  metricType: 'localCapacity' | 'vulnerability';
  isExpanded: boolean;
  onToggle: () => void;
  isWarning?: boolean;
  isDanger?: boolean;
}

const ClickableMetricBar: React.FC<ClickableMetricBarProps> = ({
  label, value, unit, metricType, isExpanded, onToggle, isWarning, isDanger
}) => {
  const getExplanation = () => {
    if (metricType === 'localCapacity') {
      return {
        whatItMeasures: 'Andelen av regionens energi- och resursbehov som kan tillgodoses lokalt, utan import.',
        whyItMatters: 'Hög lokal kapacitet = mindre sårbar för globala störningar (krig, handelskrig, pandemier).',
        howCalculated: 'Lokal energiproduktion ÷ Total energikonsumtion × 100',
        interpretation: value > 80 
          ? 'Hög självförsörjning – regionen är relativt resilient.'
          : value > 50 
            ? 'Måttlig – regionen är delvis beroende av import.'
            : 'Låg – regionen är starkt beroende av externa resurser.',
        sources: ['IEA World Energy Outlook', 'Eurostat Energy Statistics']
      };
    } else {
      return {
        whatItMeasures: 'Sammansatt index av faktorer som gör en region känslig för störningar.',
        whyItMatters: 'Hög sårbarhet innebär att små störningar kan få stora konsekvenser.',
        howCalculated: 'Vägt genomsnitt av: Importberoende, institutionell svaghet, geografisk isolering, demografisk obalans',
        interpretation: value > 60 
          ? 'Kritiskt – regionen behöver strukturella förändringar för att bli hållbar.'
          : value > 40 
            ? 'Förhöjd risk – bör bevakas och förbättras.'
            : 'Relativt robust – men ingen region är immun.',
        sources: ['World Risk Report', 'UNDP Human Development Index']
      };
    }
  };

  const explanation = getExplanation();

  return (
    <div className="border rounded overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-2 p-2 hover:bg-muted/50 transition-colors text-left"
      >
        <div className="flex-1">
          <div className="flex justify-between mb-1">
            <span className="text-xs text-muted-foreground">{label}</span>
            <span className="text-xs font-medium">{value}{unit}</span>
          </div>
          <Progress 
            value={value} 
            className={cn(
              "h-1.5",
              isDanger && "[&>div]:bg-destructive",
              isWarning && !isDanger && "[&>div]:bg-amber-500"
            )}
          />
        </div>
        <span className="text-xs opacity-50">{isExpanded ? '−' : '+'}</span>
      </button>
      
      {isExpanded && (
        <div className={cn(
          "p-3 border-t space-y-3 text-xs",
          isDanger ? "bg-destructive/10" :
          isWarning ? "bg-amber-500/10" :
          "bg-muted/30"
        )}>
          <div>
            <p className="font-mono uppercase tracking-wider text-muted-foreground mb-1">VAD MÄTER DETTA?</p>
            <p>{explanation.whatItMeasures}</p>
          </div>
          
          <div>
            <p className="font-mono uppercase tracking-wider text-muted-foreground mb-1">VARFÖR ÄR DET VIKTIGT?</p>
            <p>{explanation.whyItMatters}</p>
          </div>
          
          <div>
            <p className="font-mono uppercase tracking-wider text-muted-foreground mb-1">HUR BERÄKNAS DET?</p>
            <p className="font-mono bg-background/50 p-2 rounded">{explanation.howCalculated}</p>
          </div>
          
          <div>
            <p className="font-mono uppercase tracking-wider text-muted-foreground mb-1">TOLKNING AV {value}{unit}</p>
            <p className={cn(
              "p-2 rounded",
              isDanger ? "bg-destructive/20" :
              isWarning ? "bg-amber-500/20" :
              "bg-chart-2/20"
            )}>
              {explanation.interpretation}
            </p>
          </div>
          
          <div>
            <p className="font-mono uppercase tracking-wider text-muted-foreground mb-1">DATAKÄLLOR</p>
            <div className="flex flex-wrap gap-1">
              {explanation.sources.map((src, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {src}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Deep info for expanded region
interface RegionDeepInfoProps {
  region: typeof REGIONAL_CAPACITY_DATA[0];
}

const RegionDeepInfo: React.FC<RegionDeepInfoProps> = ({ region }) => {
  const getRegionAnalysis = () => {
    const analyses: Record<string, { context: string; challenges: string[]; opportunities: string[] }> = {
      'europe': {
        context: 'Europa har historiskt hög energikonsumtion per capita men begränsade egna fossila resurser. Omställningen till förnybart pågår men går långsamt.',
        challenges: [
          'Beroende av importerad naturgas (primärt från Ryssland, nu LNG)',
          'Åldrande befolkning skapar demografisk obalans',
          'Höga levnadsstandard-förväntningar kräver mycket energi'
        ],
        opportunities: [
          'Stark institutionell kapacitet för koordinerad omställning',
          'Ledande inom förnybar teknik och policy',
          'Hög utbildningsnivå möjliggör kunskapsintensiv ekonomi'
        ]
      },
      'north-america': {
        context: 'Nordamerika har rikliga naturresurser och hög energiproduktion. USA är världens största oljeproducent men också största konsument.',
        challenges: [
          'Extremt hög per capita-konsumtion (dubbelt EU-snitt)',
          'Politisk polarisering försvårar klimatomställning',
          'Infrastruktur byggd för bilberoende'
        ],
        opportunities: [
          'Enorm potential för sol- och vindkraft',
          'Innovationsekosystem världsledande',
          'Stora jordbruksresurser'
        ]
      },
      'east-asia': {
        context: 'Östasien har snabb ekonomisk tillväxt men begränsade egna resurser. Kina är världens största energikonsument.',
        challenges: [
          'Massivt importberoende för energi och mat',
          'Miljöförstöring och luftkvalitet',
          'Geopolitiska spänningar påverkar handelsflöden'
        ],
        opportunities: [
          'Världsledande inom solcellsproduktion',
          'Snabb teknologisk utveckling',
          'Stark statlig kapacitet för storskaliga projekt'
        ]
      },
      'south-asia': {
        context: 'Sydasien har världens största befolkning men låg energitillgång per capita. Indien växer snabbt men från låg nivå.',
        challenges: [
          'Mycket låg energitillgång per capita',
          'Snabb befolkningstillväxt',
          'Vattenstress och klimatsårbarhet'
        ],
        opportunities: [
          'Ung befolkning = arbetskraftspotential',
          'Snabb expansion av förnybar energi',
          'Digital infrastruktur möjliggör snabba framsteg'
        ]
      }
    };
    return analyses[region.id] || analyses['europe'];
  };

  const analysis = getRegionAnalysis();

  return (
    <div className="space-y-4 py-3">
      <div>
        <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">KONTEXT</p>
        <p className="text-sm">{analysis.context}</p>
      </div>
      
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <p className="text-xs font-mono uppercase tracking-wider text-destructive mb-2">UTMANINGAR</p>
          <ul className="space-y-1">
            {analysis.challenges.map((c, i) => (
              <li key={i} className="text-xs flex items-start gap-2">
                <span className="text-destructive mt-0.5">•</span>
                {c}
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <p className="text-xs font-mono uppercase tracking-wider text-green-600 dark:text-green-400 mb-2">MÖJLIGHETER</p>
          <ul className="space-y-1">
            {analysis.opportunities.map((o, i) => (
              <li key={i} className="text-xs flex items-start gap-2">
                <span className="text-green-500 mt-0.5">•</span>
                {o}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

// Historical timeline
const HistoricalTimelinePanel: React.FC = () => (
  <Card>
    <CardHeader>
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4" />
        <CardTitle className="text-base">Tidsperspektiv: 200 år</CardTitle>
      </div>
      <CardDescription>Hur bärkraft byggts upp – och hur snabbt den kan falla</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={HISTORICAL_TIMELINE}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="year" tick={{ fontSize: 11 }} />
            <YAxis yAxisId="pop" orientation="left" tick={{ fontSize: 11 }} />
            <YAxis yAxisId="energy" orientation="right" tick={{ fontSize: 11 }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))'
              }}
            />
            <Line
              yAxisId="pop"
              type="monotone"
              dataKey="population"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              name="Befolkning (mdr)"
              dot={false}
            />
            <Line
              yAxisId="energy"
              type="monotone"
              dataKey="energyPerCapita"
              stroke="#f59e0b"
              strokeWidth={2}
              name="Energi per capita"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <Alert className="mt-4">
        <Clock className="h-4 w-4" />
        <AlertDescription className="text-sm">
          {KEY_MESSAGES.timeAsymmetry.sv}
        </AlertDescription>
      </Alert>
    </CardContent>
  </Card>
);

// Route mapping for system connections
const CONNECTION_ROUTES: Record<string, string> = {
  demography: '/demography',
  economy: '/reality-index',
  climate: '/scenario',
  energy: '/sweden', // Energy section in Sweden dashboard
  resilience: '/resilience',
  intergenerational: '/fairness'
};

// System connections - descriptive cards with navigation
const SystemConnectionsPanel: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <Card className="bg-muted/30">
      <CardHeader>
        <CardTitle className="text-base">Systemkopplingar</CardTitle>
        <CardDescription>
          Bärkraftsmotorn är navet som alla andra moduler refererar till
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2 md:grid-cols-3">
          {SYSTEM_CONNECTIONS.map(conn => (
            <Button 
              key={conn.id} 
              variant="outline" 
              className="justify-start h-auto py-3 hover:bg-primary/10 hover:border-primary/50 transition-all group"
              onClick={() => navigate(CONNECTION_ROUTES[conn.id] || '/')}
            >
              <ChevronRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="text-sm">{conn.labelSv}</span>
            </Button>
          ))}
        </div>
        
        <div className="mt-4">
          <WelfarePrincipleExpander />
        </div>
      </CardContent>
    </Card>
  );
};

// Main component
const GlobalCarryingCapacityEngine: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedFactor, setSelectedFactor] = useState<CapacityFactor | null>(null);
  const [selectedZone, setSelectedZone] = useState<PressZone | null>(null);

  return (
    <div className="space-y-6 p-4 max-w-6xl mx-auto">
      {/* Factor Deep Dive Dialog */}
      <FactorDeepDive 
        factor={selectedFactor} 
        open={selectedFactor !== null} 
        onOpenChange={(open) => !open && setSelectedFactor(null)} 
      />
      
      {/* Region Deep Dive Dialog */}
      <RegionDeepDive 
        zone={selectedZone} 
        open={selectedZone !== null} 
        onOpenChange={(open) => !open && setSelectedZone(null)} 
      />
      
      {/* Header - SIMPLE language for 15-year-olds */}
      <div className="text-center space-y-3">
        <h1 className="text-2xl font-bold">Hur många kan leva bra?</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-base">
          Tänk dig jorden som ett hus. Hur många personer kan bo där och ha det bra – 
          inte bara överleva, utan faktiskt trivas? Det beror på hur mycket energi vi har, 
          hur smart vår teknik är, och hur bra vi är på att organisera oss.
        </p>
      </div>

      {/* Core definition - EXPANDABLE with simple language */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="text-2xl">🌍</div>
            <div className="flex-1 space-y-2">
              <p className="font-medium">Grundfrågan:</p>
              <p className="text-sm text-muted-foreground">
                {GCCE_CORE_DEFINITION.sv}
              </p>
              <GCCEDefinitionAlert 
                statement="Klicka för att se källorna bakom detta påstående" 
                className="mt-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Not definitions - with explanations for 15-year-olds */}
      <div className="space-y-2">
        <p className="text-xs text-center text-muted-foreground font-mono uppercase tracking-wider">
          VAD VI INTE RÄKNAR
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {GCCE_NOT_DEFINITIONS.map((def, i) => (
            <ExpandableBadge 
              key={i} 
              text={def.sv} 
              className="text-xs"
              fallbackEvidence={{
                scientificBasis: def.explanation,
                whatThisProves: [],
                limitations: []
              }}
            />
          ))}
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Överblick</TabsTrigger>
          <TabsTrigger value="factors">Faktorer</TabsTrigger>
          <TabsTrigger value="regional">Regional</TabsTrigger>
          <TabsTrigger value="history">Historia</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4 space-y-6">
          <GlobalStatusPanel />
          <ThreeAxesPanel onAxisClick={(axisId) => {
            // Map axis to factor for deep dive
            const axisToFactor: Record<string, string> = {
              'energy': 'stable-energy',
              'technology': 'technical-efficiency',
              'institutions': 'institutional-capacity'
            };
            const factorId = axisToFactor[axisId];
            if (factorId) {
              const factor = POSITIVE_FACTORS.find(f => f.id === factorId);
              if (factor) setSelectedFactor(factor);
            }
          }} />
          <PressZonesPanel onZoneClick={(zone) => setSelectedZone(zone)} />
        </TabsContent>

        <TabsContent value="factors" className="mt-4 space-y-6">
          <PositiveFactorsPanel onFactorClick={(factor) => setSelectedFactor(factor)} />
          <EnergyHonestyPanel />
        </TabsContent>

        <TabsContent value="regional" className="mt-4 space-y-6">
          <RegionalCapacityPanel />
        </TabsContent>

        <TabsContent value="history" className="mt-4 space-y-6">
          <HistoricalTimelinePanel />
        </TabsContent>
      </Tabs>

      {/* System connections */}
      <SystemConnectionsPanel />

      {/* Core message - EXPANDABLE */}
      <PopulationCapacityExpander />
    </div>
  );
};

export default GlobalCarryingCapacityEngine;
