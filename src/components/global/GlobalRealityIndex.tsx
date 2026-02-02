/**
 * GLOBAL REALITY INDEX (GRI)
 * 
 * "Hur mår världen – just nu – i ett mänskligt och strukturellt perspektiv?"
 * 
 * Sammansatt realtidsöversikt baserad på sex bärande pelare.
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Globe,
  TrendingUp,
  TrendingDown,
  Minus,
  Info,
  Clock,
  ChevronDown,
  ChevronUp,
  XCircle,
  MapPin
} from 'lucide-react';
import {
  GRI_IDENTITY,
  GRI_PILLARS,
  TREND_LABELS,
  TIME_PERIODS,
  GRI_DISCLAIMERS,
  SAMPLE_REGIONAL_DATA,
  CONTEXT_MESSAGES,
  getStatusConfig,
  calculateGlobalStatus,
  type PillarId,
  type TrendDirection
} from '@/config/globalRealityIndexConfig';

// Mock data for pillars
interface PillarData {
  id: PillarId;
  level: number; // 0-100
  trend: TrendDirection;
  uncertainty: number; // 0-100
  drivers: { name: string; contribution: number; direction: TrendDirection }[];
}

const MOCK_PILLAR_DATA: PillarData[] = [
  {
    id: 'human_wellbeing',
    level: 62,
    trend: 'stable',
    uncertainty: 15,
    drivers: [
      { name: 'Livslängd', contribution: 35, direction: 'improving' },
      { name: 'Mental hälsa', contribution: 28, direction: 'declining' },
      { name: 'Materiell standard', contribution: 22, direction: 'stable' },
      { name: 'Social tillit', contribution: 15, direction: 'declining' }
    ]
  },
  {
    id: 'energy_capacity',
    level: 48,
    trend: 'declining',
    uncertainty: 22,
    drivers: [
      { name: 'Energipris', contribution: 40, direction: 'declining' },
      { name: 'Försörjningstrygghet', contribution: 35, direction: 'declining' },
      { name: 'Förnybar kapacitet', contribution: 25, direction: 'improving' }
    ]
  },
  {
    id: 'economic_space',
    level: 41,
    trend: 'declining',
    uncertainty: 18,
    drivers: [
      { name: 'Offentlig skuld', contribution: 38, direction: 'declining' },
      { name: 'Investeringskvot', contribution: 32, direction: 'declining' },
      { name: 'Real löneutveckling', contribution: 30, direction: 'stable' }
    ]
  },
  {
    id: 'demographic_balance',
    level: 55,
    trend: 'declining',
    uncertainty: 12,
    drivers: [
      { name: 'Försörjningskvot', contribution: 40, direction: 'declining' },
      { name: 'Fertilitet', contribution: 30, direction: 'declining' },
      { name: 'Migration', contribution: 30, direction: 'stable' }
    ]
  },
  {
    id: 'institutional_capacity',
    level: 58,
    trend: 'stable',
    uncertainty: 25,
    drivers: [
      { name: 'Genomförandeförmåga', contribution: 35, direction: 'stable' },
      { name: 'Rättsstatens styrka', contribution: 35, direction: 'stable' },
      { name: 'Politisk legitimitet', contribution: 30, direction: 'declining' }
    ]
  },
  {
    id: 'global_stability',
    level: 44,
    trend: 'declining',
    uncertainty: 30,
    drivers: [
      { name: 'Väpnade konflikter', contribution: 40, direction: 'declining' },
      { name: 'Handelsspänningar', contribution: 35, direction: 'declining' },
      { name: 'Geopolitisk fragmentering', contribution: 25, direction: 'declining' }
    ]
  }
];

// Trend icon component
const TrendIcon: React.FC<{ trend: TrendDirection; size?: 'sm' | 'md' }> = ({ trend, size = 'md' }) => {
  const sizeClass = size === 'sm' ? 'h-3 w-3' : 'h-4 w-4';
  switch (trend) {
    case 'improving':
      return <TrendingUp className={`${sizeClass} text-green-500`} />;
    case 'declining':
      return <TrendingDown className={`${sizeClass} text-red-500`} />;
    default:
      return <Minus className={`${sizeClass} text-amber-500`} />;
  }
};

// Pillar bar component
const PillarBar: React.FC<{
  pillar: typeof GRI_PILLARS[0];
  data: PillarData;
  expanded: boolean;
  onToggle: () => void;
  showValues: boolean;
}> = ({ pillar, data, expanded, onToggle, showValues }) => {
  return (
    <div className="space-y-2">
      <button
        onClick={onToggle}
        className="w-full text-left hover:bg-muted/50 p-3 rounded-lg transition-colors"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">{pillar.icon}</span>
            <span className="font-medium text-sm">{pillar.nameSv}</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendIcon trend={data.trend} />
            <Badge 
              variant="outline" 
              className={`text-xs ${
                data.trend === 'improving' ? 'border-green-500 text-green-600' :
                data.trend === 'declining' ? 'border-red-500 text-red-600' :
                'border-amber-500 text-amber-600'
              }`}
            >
              {TREND_LABELS[data.trend].sv}
            </Badge>
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="relative">
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-500"
              style={{ 
                width: `${data.level}%`,
                backgroundColor: pillar.color
              }}
            />
          </div>
          {/* Uncertainty indicator */}
          <div 
            className="absolute top-0 h-3 bg-foreground/10 rounded-full"
            style={{
              left: `${Math.max(0, data.level - data.uncertainty/2)}%`,
              width: `${data.uncertainty}%`
            }}
          />
        </div>
        
        {showValues && (
          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
            <span>Nivå: {data.level}/100</span>
            <span>Osäkerhet: ±{data.uncertainty}%</span>
          </div>
        )}
      </button>
      
      {/* Expanded view - Drivers */}
      {expanded && (
        <Card className="ml-4 bg-muted/30 border-l-4" style={{ borderLeftColor: pillar.color }}>
          <CardHeader className="py-2 pb-1">
            <CardTitle className="text-sm flex items-center gap-2">
              <Info className="h-3 w-3" />
              Vad driver förändringen?
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 pb-3">
            <div className="space-y-2">
              {data.drivers.map((driver, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <TrendIcon trend={driver.direction} size="sm" />
                    <span>{driver.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{driver.contribution}% bidrag</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3 italic">
              Klicka för att se källor och metod →
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Regional map (simplified grid representation)
const RegionalMap: React.FC = () => {
  return (
    <Card className="bg-muted/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Regional fördelning
        </CardTitle>
        <CardDescription className="text-xs">
          {CONTEXT_MESSAGES.regionalVariation.sv}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-2">
          {SAMPLE_REGIONAL_DATA.map(region => {
            const status = getStatusConfig(region.overallStatus);
            return (
              <div 
                key={region.regionCode}
                className="p-2 rounded text-center text-xs hover:opacity-80 cursor-pointer transition-opacity"
                style={{ backgroundColor: `${status?.color}20` }}
              >
                <div 
                  className="w-3 h-3 rounded-full mx-auto mb-1"
                  style={{ backgroundColor: status?.color }}
                />
                <span className="font-medium">{region.regionNameSv}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

// Main GRI Dashboard
export const GlobalRealityIndex: React.FC = () => {
  const [expandedPillar, setExpandedPillar] = useState<PillarId | null>(null);
  const [timePeriod, setTimePeriod] = useState('today');
  const [showValues, setShowValues] = useState(false);

  // Calculate global status from pillar trends
  const pillarTrends = MOCK_PILLAR_DATA.reduce((acc, p) => {
    acc[p.id] = p.trend;
    return acc;
  }, {} as Record<PillarId, TrendDirection>);
  
  const globalStatus = calculateGlobalStatus(pillarTrends);
  const statusConfig = getStatusConfig(globalStatus);

  const lastUpdate = new Date().toLocaleDateString('sv-SE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="space-y-6 p-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Globe className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">{GRI_IDENTITY.name}</h1>
        </div>
        <p className="text-muted-foreground max-w-xl mx-auto">
          {GRI_IDENTITY.question.sv}
        </p>
      </div>

      {/* Global Status Card */}
      <Card 
        className="border-2"
        style={{ borderColor: statusConfig?.color }}
      >
        <CardContent className="pt-6">
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-3">
              <span className="text-sm text-muted-foreground">Globalt läge:</span>
              <Badge 
                className="text-lg px-4 py-1"
                style={{ backgroundColor: statusConfig?.color }}
              >
                {statusConfig?.labelSv}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              {statusConfig?.descriptionSv}
            </p>
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>Uppdaterat: {lastUpdate}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Time Period Selector */}
      <div className="flex items-center justify-between">
        <Tabs value={timePeriod} onValueChange={setTimePeriod}>
          <TabsList>
            {TIME_PERIODS.map(period => (
              <TabsTrigger key={period.id} value={period.id} className="text-xs">
                {period.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setShowValues(!showValues)}
          className="text-xs"
        >
          {showValues ? 'Dölj siffror' : 'Visa siffror'}
        </Button>
      </div>

      {/* Context message */}
      <Alert className="bg-muted/30">
        <Info className="h-4 w-4" />
        <AlertDescription className="text-sm">
          {CONTEXT_MESSAGES.timeSnapshot.sv}
        </AlertDescription>
      </Alert>

      {/* Six Pillars */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">De sex pelarna</CardTitle>
          <CardDescription>
            Varje pelare är ett klickbart universum
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-1">
          {GRI_PILLARS.map(pillar => {
            const data = MOCK_PILLAR_DATA.find(d => d.id === pillar.id);
            if (!data) return null;
            return (
              <PillarBar
                key={pillar.id}
                pillar={pillar}
                data={data}
                expanded={expandedPillar === pillar.id}
                onToggle={() => setExpandedPillar(
                  expandedPillar === pillar.id ? null : pillar.id
                )}
                showValues={showValues}
              />
            );
          })}
        </CardContent>
      </Card>

      {/* Regional differentiation */}
      <RegionalMap />

      {/* Responsibility notice */}
      <Alert className="bg-primary/5 border-primary/20">
        <Globe className="h-4 w-4" />
        <AlertDescription className="text-sm">
          {CONTEXT_MESSAGES.responsibility.sv}
        </AlertDescription>
      </Alert>

      {/* What GRI is NOT */}
      <Card className="bg-red-50 dark:bg-red-950/20 border-red-200">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <XCircle className="h-4 w-4 text-red-500" />
            <CardTitle className="text-sm">{GRI_DISCLAIMERS.title.sv}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {GRI_DISCLAIMERS.items.map((item, i) => (
              <Badge key={i} variant="outline" className="text-xs border-red-300">
                ❌ {item.sv}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Connection to Civilization Phase Map */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium mb-1">Koppling till civilisationskarta</h4>
              <p className="text-xs text-muted-foreground">
                GRI korsat med CPM ger: <strong>Sen mognad / tidig omställning</strong>
              </p>
            </div>
            <Button variant="outline" size="sm" className="text-xs">
              Öppna CPM →
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center text-xs text-muted-foreground space-y-1">
        <p>Global Reality Index © {new Date().getFullYear()}</p>
        <p className="italic">
          Detta är inte ett verktyg. Det är en gemensam referensram för mänskligheten.
        </p>
      </div>
    </div>
  );
};

export default GlobalRealityIndex;
