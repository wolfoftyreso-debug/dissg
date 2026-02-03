/**
 * GLOBAL REALITY INDEX (GRI)
 * 
 * "Hur mår världen – just nu – i ett mänskligt och strukturellt perspektiv?"
 * 
 * Sammansatt realtidsöversikt baserad på live-data från databasen.
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
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
  MapPin,
  Database,
  Loader2
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
import { 
  useCategoryAggregates, 
  useKPIsWithLatestValues,
  getTrendDirection 
} from '@/hooks/useLiveKPIData';

// Map database categories to GRI pillars
const CATEGORY_TO_PILLAR: Record<string, PillarId> = {
  demografi_halsa: 'human_wellbeing',
  arbete_produktivitet: 'economic_space',
  ekonomisk_barkraft: 'economic_space',
  social_stabilitet: 'institutional_capacity',
  systemrisk_styrning: 'global_stability',
  infrastruktur: 'energy_capacity',
  karnsystem_funktion: 'institutional_capacity',
};

interface PillarData {
  id: PillarId;
  level: number;
  trend: TrendDirection;
  uncertainty: number;
  drivers: { name: string; contribution: number; direction: TrendDirection }[];
}

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
      {expanded && data.drivers.length > 0 && (
        <Card className="ml-4 bg-muted/30 border-l-4" style={{ borderLeftColor: pillar.color }}>
          <CardHeader className="py-2 pb-1">
            <CardTitle className="text-sm flex items-center gap-2">
              <Database className="h-3 w-3" />
              Vad driver förändringen? (Live-data)
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

// Region code to geo path mapping
const REGION_TO_GEO_PATH: Record<string, string> = {
  'EUR': '/geo/europe',
  'NAM': '/geo/north-america',
  'EAS': '/geo/east-asia',
  'SAS': '/geo/south-asia',
  'AFR': '/geo/africa',
  'LAM': '/geo/latin-america',
  'MNA': '/geo/mena',
  'OCE': '/geo/oceania',
};

// Regional map (clickable grid representation with drill-down)
const RegionalMap: React.FC = () => {
  const handleRegionClick = (regionCode: string) => {
    const path = REGION_TO_GEO_PATH[regionCode] || `/geo?region=${regionCode}`;
    window.location.href = path;
  };

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
              <button 
                key={region.regionCode}
                onClick={() => handleRegionClick(region.regionCode)}
                className="p-2 rounded text-center text-xs hover:opacity-80 hover:scale-105 cursor-pointer transition-all group border border-transparent hover:border-primary/30"
                style={{ backgroundColor: `${status?.color}20` }}
                title={`Klicka för att utforska ${region.regionNameSv}`}
              >
                <div 
                  className="w-3 h-3 rounded-full mx-auto mb-1 group-hover:ring-2 group-hover:ring-offset-1 group-hover:ring-primary/40 transition-all"
                  style={{ backgroundColor: status?.color }}
                />
                <span className="font-medium group-hover:underline">{region.regionNameSv}</span>
              </button>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground mt-3 text-center">
          Klicka på en region för att se detaljerad data →
        </p>
      </CardContent>
    </Card>
  );
};

// Main GRI Dashboard
export const GlobalRealityIndex: React.FC = () => {
  const [expandedPillar, setExpandedPillar] = useState<PillarId | null>(null);
  const [timePeriod, setTimePeriod] = useState('today');
  const [showValues, setShowValues] = useState(false);

  // Fetch live data
  const { data: categoryAggregates, isLoading: loadingCategories } = useCategoryAggregates();
  const { data: kpisWithValues, isLoading: loadingKPIs } = useKPIsWithLatestValues();

  const isLoading = loadingCategories || loadingKPIs;

  // Calculate pillar data from live database
  const pillarData: PillarData[] = useMemo(() => {
    if (!categoryAggregates || !kpisWithValues) {
      // Return empty pillar data with neutral values
      return GRI_PILLARS.map(pillar => ({
        id: pillar.id,
        level: 50,
        trend: 'stable' as TrendDirection,
        uncertainty: 20,
        drivers: [],
      }));
    }

    // Group KPIs by pillar
    const pillarKPIs: Record<PillarId, typeof kpisWithValues> = {
      human_wellbeing: [],
      energy_capacity: [],
      economic_space: [],
      demographic_balance: [],
      institutional_capacity: [],
      global_stability: [],
    };

    for (const kpi of kpisWithValues) {
      const pillarId = CATEGORY_TO_PILLAR[kpi.category];
      if (pillarId) {
        pillarKPIs[pillarId].push(kpi);
      }
    }

    return GRI_PILLARS.map(pillar => {
      const kpis = pillarKPIs[pillar.id] || [];
      
      // Calculate aggregate trend
      let improving = 0;
      let declining = 0;
      let totalValue = 0;
      let valueCount = 0;

      for (const kpi of kpis) {
        if (kpi.latestTrend === 'up') improving++;
        else if (kpi.latestTrend === 'down') declining++;
        
        if (kpi.latestValue !== null) {
          totalValue += Math.min(100, Math.max(0, kpi.latestValue));
          valueCount++;
        }
      }

      const trend: TrendDirection = 
        improving > declining ? 'improving' :
        declining > improving ? 'declining' : 'stable';

      // Calculate level (normalized 0-100)
      const avgValue = valueCount > 0 ? totalValue / valueCount : 50;
      const level = Math.min(100, Math.max(0, avgValue));

      // Create drivers from actual KPIs
      const drivers = kpis.slice(0, 4).map(kpi => ({
        name: kpi.name,
        contribution: Math.round(100 / kpis.length),
        direction: getTrendDirection(kpi.latestTrend),
      }));

      return {
        id: pillar.id,
        level: Math.round(level),
        trend,
        uncertainty: Math.round(15 + (kpis.length < 3 ? 15 : 0)), // Higher uncertainty with less data
        drivers,
      };
    });
  }, [categoryAggregates, kpisWithValues]);

  // Calculate global status from pillar trends
  const pillarTrends = pillarData.reduce((acc, p) => {
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
        <Badge variant="outline" className="text-xs">
          <Database className="h-3 w-3 mr-1" />
          Live data från databasen
        </Badge>
      </div>

      {/* Loading state */}
      {isLoading && (
        <Card>
          <CardContent className="py-12 flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Hämtar global data...</p>
          </CardContent>
        </Card>
      )}

      {/* Global Status Card */}
      {!isLoading && (
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
      )}

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
            Varje pelare är ett klickbart universum • {kpisWithValues?.length || 0} indikatorer
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-1">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            GRI_PILLARS.map(pillar => {
              const data = pillarData.find(d => d.id === pillar.id);
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
            })
          )}
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
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs"
              onClick={() => window.location.href = '/civilization'}
            >
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
