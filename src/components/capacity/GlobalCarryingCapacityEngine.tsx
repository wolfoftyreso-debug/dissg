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
import { ChevronRight, Clock, Info } from 'lucide-react';
import { DescriptiveMetricCard } from '@/components/ui/MiniSparkline';
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
        
        <Alert>
          <AlertDescription className="text-sm">
            <span className="font-medium">Systemtolkning: </span>
            {KEY_MESSAGES.currentState.sv}
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

// Three axes visualization
const ThreeAxesPanel: React.FC = () => {
  const radarData = CAPACITY_AXES.map(axis => ({
    axis: axis.labelSv,
    value: axis.id === 'energy' ? 72 : axis.id === 'technology' ? 67 : 54,
    fullMark: 100
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">De tre obrytbara axlarna</CardTitle>
        <CardDescription>All bärkraft är funktion av dessa</CardDescription>
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
              <div key={axis.id} className="p-3 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{axis.icon}</span>
                  <span className="font-medium text-sm">{axis.labelSv}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{axis.descriptionSv}</p>
                <div className="flex flex-wrap gap-1">
                  {axis.components.map(c => (
                    <Badge key={c.id} variant="outline" className="text-xs">{c.labelSv}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <Alert className="mt-4 bg-muted/30">
          <AlertDescription className="text-xs">
            📌 Befolkning är resultat, inte primärvariabel.
          </AlertDescription>
        </Alert>
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
      
      <Alert className="bg-primary/5 mt-4">
        <Info className="h-4 w-4" />
        <AlertDescription className="text-xs font-medium">
          {KEY_MESSAGES.notOverpopulation.sv}
        </AlertDescription>
      </Alert>
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
      <div className="p-4 bg-background rounded-lg">
        <p className="text-sm font-medium mb-2">Baslinje:</p>
        <p className="text-sm text-muted-foreground">
          {ENERGY_HONESTY.baseline.sv.replace('{x}', '21')}
        </p>
      </div>
      
      <div className="p-4 bg-background rounded-lg border-l-4 border-primary">
        <p className="text-sm font-medium mb-2">Konsekvens:</p>
        <p className="text-sm text-muted-foreground">
          {ENERGY_HONESTY.consequence.sv}
        </p>
      </div>
      
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription className="text-sm">
          <span className="font-medium">Fysikalisk lag: </span>
          {ENERGY_HONESTY.physics.sv}
        </AlertDescription>
      </Alert>
    </CardContent>
  </Card>
);

// Regional capacity view
const RegionalCapacityPanel: React.FC = () => (
  <Card>
    <CardHeader>
      <CardTitle className="text-base">Regional bärkraft</CardTitle>
      <CardDescription>Lokal vs importerad kapacitet & sårbarhet</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        {REGIONAL_CAPACITY_DATA.map(region => (
          <div key={region.id} className="p-3 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-sm">{region.nameSv}</span>
              <Badge variant="outline" className="text-xs">
                {region.energyPerCapita} MWh/cap
              </Badge>
            </div>
            
            <div className="grid gap-2 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-muted-foreground">Lokal kapacitet</span>
                  <span>{region.localCapacity}%</span>
                </div>
                <Progress value={region.localCapacity} className="h-1.5" />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-muted-foreground">Sårbarhet</span>
                  <span>{region.vulnerabilityIndex}</span>
                </div>
                <Progress 
                  value={region.vulnerabilityIndex} 
                  className={`h-1.5 ${region.vulnerabilityIndex > 60 ? '[&>div]:bg-red-500' : region.vulnerabilityIndex > 40 ? '[&>div]:bg-yellow-500' : ''}`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <Alert className="mt-4 bg-muted/30">
        <AlertDescription className="text-xs">
          📌 Avslöjar sårbarhet utan moralism.
        </AlertDescription>
      </Alert>
    </CardContent>
  </Card>
);

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
      
      {/* Header - descriptive text, no abstract icons */}
      <div className="text-center space-y-3">
        <h1 className="text-2xl font-bold">Global Carrying Capacity Engine</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Hur många människor kan leva bra — givet energi, teknik och resurser? 
          Detta är systemets kärnmodul som kvantifierar de fysiska begränsningarna för mänskligt välbefinnande.
        </p>
      </div>

      {/* Core definition */}
      <Alert className="bg-primary/5 border-primary/20">
        <Info className="h-4 w-4" />
        <AlertDescription className="text-sm">
          <strong>Definition:</strong> {GCCE_CORE_DEFINITION.sv}
        </AlertDescription>
      </Alert>

      {/* Not definitions */}
      <div className="flex flex-wrap justify-center gap-2">
        {GCCE_NOT_DEFINITIONS.map((def, i) => (
          <Badge key={i} variant="outline" className="text-xs">
            {def.sv}
          </Badge>
        ))}
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
          <ThreeAxesPanel />
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
