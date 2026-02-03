/**
 * GLOBAL CARRYING CAPACITY ENGINE (GCCE)
 * 
 * "Hur många människor kan leva bra – givet energi, teknik och resurser?"
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Globe,
  Zap,
  Brain,
  Building2,
  Heart,
  Users,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  Info,
  Clock,
  Layers,
  MapPin,
  ChevronRight
} from 'lucide-react';
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
  type CapacityFactor
} from '@/config/carryingCapacityConfig';
import { FactorDeepDive } from './FactorDeepDive';

// Trend icon helper
const TrendIcon: React.FC<{ trend: string; size?: number }> = ({ trend, size = 16 }) => {
  if (trend === 'growing' || trend === 'improving') return <TrendingUp size={size} className="text-green-500" />;
  if (trend === 'declining') return <TrendingDown size={size} className="text-red-500" />;
  return <Minus size={size} className="text-muted-foreground" />;
};

// Global status panel
const GlobalStatusPanel: React.FC = () => {
  const data = GLOBAL_CAPACITY_DATA;
  
  return (
    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Global bärkraft – nuläge</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-5">
          {/* Population */}
          <div className="text-center p-3 bg-background rounded-lg">
            <Users className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
            <p className="text-2xl font-bold">{data.population.current}B</p>
            <p className="text-xs text-muted-foreground">Befolkning</p>
            <div className="flex items-center justify-center gap-1 mt-1">
              <TrendIcon trend={data.population.trend} size={12} />
              <span className="text-xs">+{data.population.growthRate}%/år</span>
            </div>
          </div>
          
          {/* Energy */}
          <div className="text-center p-3 bg-background rounded-lg">
            <Zap className="h-5 w-5 mx-auto mb-1 text-yellow-500" />
            <p className="text-2xl font-bold">{data.energyPerCapita.value}</p>
            <p className="text-xs text-muted-foreground">MWh/person/år</p>
            <div className="flex items-center justify-center gap-1 mt-1">
              <TrendIcon trend={data.energyPerCapita.trend} size={12} />
              <span className="text-xs">{data.energyPerCapita.changePercent > 0 ? '+' : ''}{data.energyPerCapita.changePercent}%</span>
            </div>
          </div>
          
          {/* Tech efficiency */}
          <div className="text-center p-3 bg-background rounded-lg">
            <Brain className="h-5 w-5 mx-auto mb-1 text-purple-500" />
            <p className="text-2xl font-bold">{data.technicalEfficiency.index}</p>
            <p className="text-xs text-muted-foreground">Teknikindex</p>
            <div className="flex items-center justify-center gap-1 mt-1">
              <TrendIcon trend={data.technicalEfficiency.trend} size={12} />
              <span className="text-xs">+{data.technicalEfficiency.changePercent}%</span>
            </div>
          </div>
          
          {/* Institutions */}
          <div className="text-center p-3 bg-background rounded-lg">
            <Building2 className="h-5 w-5 mx-auto mb-1 text-blue-500" />
            <p className="text-2xl font-bold">{data.institutionalQuality.index}</p>
            <p className="text-xs text-muted-foreground">Institutionsindex</p>
            <div className="flex items-center justify-center gap-1 mt-1">
              <TrendIcon trend={data.institutionalQuality.trend} size={12} />
              <span className="text-xs">{data.institutionalQuality.changePercent}%</span>
            </div>
          </div>
          
          {/* HWI */}
          <div className="text-center p-3 bg-background rounded-lg">
            <Heart className="h-5 w-5 mx-auto mb-1 text-red-500" />
            <p className="text-2xl font-bold">{data.humanWellbeing.index}</p>
            <p className="text-xs text-muted-foreground">Välbefinnande</p>
            <div className="flex items-center justify-center gap-1 mt-1">
              <TrendIcon trend={data.humanWellbeing.trend} size={12} />
              <span className="text-xs">{data.humanWellbeing.changePercent > 0 ? '+' : ''}{data.humanWellbeing.changePercent}%</span>
            </div>
          </div>
        </div>
        
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription className="text-sm">
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

// Press zones panel
const PressZonesPanel: React.FC = () => (
  <Card>
    <CardHeader>
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-yellow-500" />
        <CardTitle className="text-base">Tryckzoner</CardTitle>
      </div>
      <CardDescription>Där systemet är under press – inte "överbefolkning"</CardDescription>
    </CardHeader>
    <CardContent className="space-y-3">
      {PRESS_ZONES.map(zone => (
        <div key={zone.id} className={`p-3 border rounded-lg ${
          zone.severity === 'high' ? 'border-red-200 bg-red-50/50 dark:bg-red-950/20' :
          zone.severity === 'moderate' ? 'border-yellow-200 bg-yellow-50/50 dark:bg-yellow-950/20' :
          'border-blue-200 bg-blue-50/50 dark:bg-blue-950/20'
        }`}>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span className="font-medium text-sm">{zone.regionSv}</span>
                <Badge variant={zone.severity === 'high' ? 'destructive' : 'secondary'} className="text-xs">
                  {zone.severity === 'high' ? 'Hög' : zone.severity === 'moderate' ? 'Måttlig' : 'Framväxande'}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{zone.descriptionSv}</p>
            </div>
            <div className="flex gap-1">
              {zone.factors.energyPressure && <Zap className="h-4 w-4 text-yellow-500" />}
              {zone.factors.populationGrowth && <Users className="h-4 w-4 text-blue-500" />}
              {zone.factors.institutionalWeakness && <Building2 className="h-4 w-4 text-red-500" />}
            </div>
          </div>
        </div>
      ))}
      
      <Alert className="bg-primary/5">
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
  <Card className="border-yellow-200 bg-yellow-50/30 dark:bg-yellow-950/20">
    <CardHeader>
      <div className="flex items-center gap-2">
        <Zap className="h-5 w-5 text-yellow-600" />
        <CardTitle className="text-base">Energy Honesty Layer</CardTitle>
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="p-4 bg-background rounded-lg">
        <p className="text-sm">
          {ENERGY_HONESTY.baseline.sv.replace('{x}', '21')}
        </p>
      </div>
      
      <div className="p-4 bg-background rounded-lg border-l-4 border-yellow-500">
        <p className="text-sm font-medium">
          {ENERGY_HONESTY.consequence.sv}
        </p>
      </div>
      
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription className="text-sm font-medium">
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

// System connections
const SystemConnectionsPanel: React.FC = () => (
  <Card className="bg-muted/30">
    <CardHeader>
      <div className="flex items-center gap-2">
        <Layers className="h-4 w-4" />
        <CardTitle className="text-base">Koppling till andra system</CardTitle>
      </div>
      <CardDescription>GCCE kopplas direkt till alla andra moduler</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="grid gap-2 md:grid-cols-3">
        {SYSTEM_CONNECTIONS.map(conn => (
          <Button key={conn.id} variant="outline" className="justify-start h-auto py-3">
            <span className="text-xl mr-2">{conn.icon}</span>
            <span className="text-sm">{conn.labelSv}</span>
          </Button>
        ))}
      </div>
      
      <Alert className="mt-4 bg-primary/5 border-primary/20">
        <AlertDescription className="text-sm text-center font-medium">
          📌 Allt landar här.
        </AlertDescription>
      </Alert>
    </CardContent>
  </Card>
);

// Main component
const GlobalCarryingCapacityEngine: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedFactor, setSelectedFactor] = useState<CapacityFactor | null>(null);

  return (
    <div className="space-y-6 p-4 max-w-6xl mx-auto">
      {/* Factor Deep Dive Dialog */}
      <FactorDeepDive 
        factor={selectedFactor} 
        open={selectedFactor !== null} 
        onOpenChange={(open) => !open && setSelectedFactor(null)} 
      />
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Globe className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Global Carrying Capacity Engine</h1>
        </div>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Hur många människor kan leva bra – givet energi, teknik och resurser?
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
          <PressZonesPanel />
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

      {/* Core message */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="pt-6 text-center">
          <p className="text-sm font-medium max-w-lg mx-auto">
            {KEY_MESSAGES.coreQuestion.sv}
          </p>
          <Separator className="my-4" />
          <p className="text-xs text-muted-foreground">
            Inte ideologi. Inte klimatmoral. Inte tillväxtoptimism. Bara fysik, biologi, teknik och mänskligt välbefinnande.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default GlobalCarryingCapacityEngine;
