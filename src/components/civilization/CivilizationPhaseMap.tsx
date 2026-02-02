/**
 * CIVILIZATION PHASE MAP (CPM)
 * 
 * "Identifiera var ett samhälle befinner sig i den långsiktiga cykeln – utan att förutsäga slut."
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
  TrendingUp,
  TrendingDown,
  Minus,
  Info,
  Clock,
  Compass,
  Layers
} from 'lucide-react';
import {
  CIVILIZATION_PHASES,
  PLACEMENT_INDICATORS,
  COUNTRY_PHASE_DATA,
  getPhaseFromPosition,
  CPM_CORE_PRINCIPLE,
  CPM_NOT_CLAIMS,
  KEY_MESSAGES,
  MODULE_CONNECTIONS,
  type CountryPhaseData,
  type CivilizationPhase
} from '@/config/civilizationPhaseConfig';

// Velocity icon
const VelocityIcon: React.FC<{ velocity: number; size?: number }> = ({ velocity, size = 16 }) => {
  if (velocity < -0.5) return <TrendingDown size={size} className="text-green-500" />;
  if (velocity > 0.5) return <TrendingUp size={size} className="text-red-500" />;
  return <Minus size={size} className="text-muted-foreground" />;
};

// Phase timeline visualization
const PhaseTimeline: React.FC<{ selectedCountry?: CountryPhaseData }> = ({ selectedCountry }) => (
  <div className="relative py-8">
    {/* Background track */}
    <div className="absolute top-1/2 left-0 right-0 h-3 -translate-y-1/2 rounded-full overflow-hidden flex">
      {CIVILIZATION_PHASES.map((phase, i) => (
        <div
          key={phase.id}
          className="flex-1"
          style={{ backgroundColor: phase.color, opacity: 0.3 }}
        />
      ))}
    </div>

    {/* Phase labels */}
    <div className="relative flex justify-between text-xs">
      {CIVILIZATION_PHASES.map((phase) => (
        <div key={phase.id} className="flex-1 text-center">
          <div 
            className="inline-block px-2 py-1 rounded-full text-white font-medium"
            style={{ backgroundColor: phase.color }}
          >
            {phase.labelSv}
          </div>
        </div>
      ))}
    </div>

    {/* Country markers */}
    <div className="relative h-16 mt-4">
      {COUNTRY_PHASE_DATA.map((country) => {
        const isSelected = selectedCountry?.code === country.code;
        const phase = getPhaseFromPosition(country.phasePosition);
        
        return (
          <div
            key={country.code}
            className="absolute transform -translate-x-1/2 transition-all duration-300"
            style={{ 
              left: `${country.phasePosition}%`,
              zIndex: isSelected ? 10 : 1
            }}
          >
            {/* Uncertainty range */}
            <div
              className="absolute h-2 rounded-full opacity-30"
              style={{
                left: `${country.phaseRange[0] - country.phasePosition}%`,
                width: `${country.phaseRange[1] - country.phaseRange[0]}%`,
                backgroundColor: phase.color,
                top: '50%',
                transform: 'translateY(-50%)'
              }}
            />
            
            {/* Country marker */}
            <div
              className={`relative flex flex-col items-center cursor-pointer transition-transform ${
                isSelected ? 'scale-125' : 'hover:scale-110'
              }`}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg"
                style={{ backgroundColor: phase.color }}
              >
                {country.code}
              </div>
              <div className="flex items-center gap-1 mt-1">
                <VelocityIcon velocity={country.velocity} size={12} />
                {country.accelerating && (
                  <span className="text-[10px] text-muted-foreground">⚡</span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

// Phase detail card
const PhaseDetailCard: React.FC<{ phase: CivilizationPhase }> = ({ phase }) => (
  <Card className="border-2" style={{ borderColor: phase.color }}>
    <CardHeader className="pb-2">
      <div className="flex items-center gap-2">
        <div 
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: phase.color }}
        />
        <CardTitle className="text-base">{phase.number}. {phase.labelSv}</CardTitle>
      </div>
      <CardDescription>{phase.descriptionSv}</CardDescription>
    </CardHeader>
    <CardContent className="space-y-3">
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-2">Kännetecken:</p>
        <div className="flex flex-wrap gap-1">
          {phase.characteristics.map((c, i) => (
            <Badge key={i} variant="secondary" className="text-xs">{c.labelSv}</Badge>
          ))}
        </div>
      </div>
      
      <Separator />
      
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-2">
          I denna fas har följande faktorer historiskt varit avgörande:
        </p>
        <div className="flex flex-wrap gap-1">
          {phase.keyFactors.map((f, i) => (
            <Badge key={i} variant="outline" className="text-xs">{f.labelSv}</Badge>
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
);

// Country detail panel
const CountryDetailPanel: React.FC<{ country: CountryPhaseData }> = ({ country }) => {
  const phase = getPhaseFromPosition(country.phasePosition);
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: phase.color }}
            >
              {country.code}
            </div>
            <div>
              <CardTitle className="text-lg">{country.nameSv}</CardTitle>
              <CardDescription>Fas: {phase.labelSv}</CardDescription>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1">
              <VelocityIcon velocity={country.velocity} size={16} />
              <span className={`text-sm font-medium ${country.velocity > 0 ? 'text-red-500' : 'text-green-500'}`}>
                {country.velocity > 0 ? '+' : ''}{country.velocity.toFixed(1)}/år
              </span>
            </div>
            {country.accelerating && (
              <Badge variant="secondary" className="text-xs">Accelererande</Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Position bar */}
        <div>
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Position i cykeln</span>
            <span>{country.phasePosition}% (osäkerhet: {country.phaseRange[0]}-{country.phaseRange[1]}%)</span>
          </div>
          <div className="relative h-4 bg-muted rounded-full overflow-hidden">
            <div
              className="absolute h-full rounded-full"
              style={{
                left: `${country.phaseRange[0]}%`,
                width: `${country.phaseRange[1] - country.phaseRange[0]}%`,
                backgroundColor: phase.color,
                opacity: 0.3
              }}
            />
            <div
              className="absolute h-full w-1 rounded-full"
              style={{
                left: `${country.phasePosition}%`,
                backgroundColor: phase.color
              }}
            />
          </div>
        </div>

        {/* Indicator scores */}
        <div>
          <p className="text-sm font-medium mb-2">{KEY_MESSAGES.placementTransparency.sv}</p>
          <div className="grid gap-2">
            {PLACEMENT_INDICATORS.map(ind => {
              const score = country.indicatorScores[ind.id];
              return (
                <div key={ind.id} className="flex items-center gap-2 text-xs">
                  <span className="w-40 text-muted-foreground">{ind.labelSv}</span>
                  <Progress value={score} className="flex-1 h-2" />
                  <span className="w-8 text-right">{score}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Historical transitions */}
        <div className="p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4" />
            <span>Historiska omställningar: <strong>{country.historicalTransitions}</strong></span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Denna region har historiskt rört sig {country.velocity > 2 ? 'snabbt' : 'måttligt'} mellan faser.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

// All phases overview
const PhasesOverview: React.FC = () => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    {CIVILIZATION_PHASES.map(phase => (
      <PhaseDetailCard key={phase.id} phase={phase} />
    ))}
  </div>
);

// Module connections
const ModuleConnectionsPanel: React.FC = () => (
  <Card className="bg-muted/30">
    <CardHeader>
      <div className="flex items-center gap-2">
        <Layers className="h-4 w-4" />
        <CardTitle className="text-base">CPM integreras med</CardTitle>
      </div>
      <CardDescription>Navigationsskiktet för alla moduler</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="grid gap-2 md:grid-cols-2">
        {MODULE_CONNECTIONS.map(conn => (
          <Button key={conn.id} variant="outline" className="justify-start h-auto py-3">
            <span className="text-xl mr-2">{conn.icon}</span>
            <div className="text-left">
              <p className="text-sm font-medium">{conn.labelSv}</p>
              <p className="text-xs text-muted-foreground">{conn.description}</p>
            </div>
          </Button>
        ))}
      </div>
    </CardContent>
  </Card>
);

// Main component
const CivilizationPhaseMap: React.FC = () => {
  const [activeTab, setActiveTab] = useState('map');
  const [selectedCountry, setSelectedCountry] = useState<CountryPhaseData | undefined>(
    COUNTRY_PHASE_DATA.find(c => c.code === 'SE')
  );

  return (
    <div className="space-y-6 p-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Compass className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Civilization Phase Map</h1>
        </div>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Identifiera var ett samhälle befinner sig i den långsiktiga cykeln – utan att förutsäga slut.
        </p>
      </div>

      {/* Core principle */}
      <Alert className="bg-primary/5 border-primary/20">
        <Info className="h-4 w-4" />
        <AlertDescription className="text-sm">
          <strong>Grundprincip:</strong> {CPM_CORE_PRINCIPLE.sv}
        </AlertDescription>
      </Alert>

      {/* What CPM is NOT */}
      <div className="flex flex-wrap justify-center gap-2">
        {CPM_NOT_CLAIMS.map((claim, i) => (
          <Badge key={i} variant="outline" className="text-xs">
            ❌ {claim.sv}
          </Badge>
        ))}
        <Badge variant="secondary" className="text-xs">
          ✓ {KEY_MESSAGES.whatItIs.sv}
        </Badge>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="map">Karta</TabsTrigger>
          <TabsTrigger value="phases">Faser</TabsTrigger>
          <TabsTrigger value="countries">Länder</TabsTrigger>
        </TabsList>

        <TabsContent value="map" className="mt-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Global faspositionering</CardTitle>
              <CardDescription>
                Varje land markeras som ett intervall (osäkerhet). Pilar visar rörelseriktning.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PhaseTimeline selectedCountry={selectedCountry} />
            </CardContent>
          </Card>

          {/* Country selector */}
          <div className="flex flex-wrap gap-2">
            {COUNTRY_PHASE_DATA.map(country => (
              <Button
                key={country.code}
                variant={selectedCountry?.code === country.code ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCountry(country)}
              >
                {country.nameSv}
              </Button>
            ))}
          </div>

          {selectedCountry && <CountryDetailPanel country={selectedCountry} />}

          <Alert>
            <Clock className="h-4 w-4" />
            <AlertDescription className="text-sm">
              {KEY_MESSAGES.speedMatters.sv}
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="phases" className="mt-4 space-y-6">
          <PhasesOverview />
          
          <Alert className="bg-purple-50 dark:bg-purple-950/30 border-purple-200">
            <Info className="h-4 w-4" />
            <AlertDescription className="text-sm">
              📌 {KEY_MESSAGES.transitionOutcomes.sv}
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="countries" className="mt-4 space-y-4">
          {COUNTRY_PHASE_DATA.sort((a, b) => a.phasePosition - b.phasePosition).map(country => (
            <CountryDetailPanel key={country.code} country={country} />
          ))}
        </TabsContent>
      </Tabs>

      {/* Module connections */}
      <ModuleConnectionsPanel />

      {/* Core message */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="pt-6 text-center">
          <p className="text-sm font-medium max-w-lg mx-auto">
            {KEY_MESSAGES.coreInsight.sv}
          </p>
          <Separator className="my-4" />
          <p className="text-xs text-muted-foreground">
            Detta är orientering, inte domedag. En karta, inte en profetia.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CivilizationPhaseMap;
