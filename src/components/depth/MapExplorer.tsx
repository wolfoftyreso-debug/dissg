import { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import {
  MapPin,
  ZoomIn,
  ZoomOut,
  Layers,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  Info,
  Lock,
  Clock,
  Eye,
} from 'lucide-react';

// =====================================================
// ZOOM LEVELS (DEL XVI)
// =====================================================

export type ZoomLevel = 0 | 1 | 2 | 3;

interface ZoomConfig {
  level: ZoomLevel;
  id: string;
  name: string;
  description: string;
  isPublic: boolean;
  minObservations: number;
}

const ZOOM_LEVELS: ZoomConfig[] = [
  {
    level: 0,
    id: 'nation',
    name: 'Nation',
    description: 'Sammanvägd status, masterindex + 5 huvudblock',
    isPublic: true,
    minObservations: 100000,
  },
  {
    level: 1,
    id: 'region',
    name: 'Region / Län',
    description: 'Samma KPI, samma färgskala, jämförbarhet garanterad',
    isPublic: true,
    minObservations: 10000,
  },
  {
    level: 2,
    id: 'kommun',
    name: 'Kommun / Stad',
    description: 'Kluster aktiveras, staplar + trendpilar, tidsreglage',
    isPublic: true,
    minObservations: 1000,
  },
  {
    level: 3,
    id: 'cluster',
    name: 'Områdeskluster',
    description: 'Statistiska kluster, "liknande områden"-logik',
    isPublic: false, // Maxdjup för publik
    minObservations: 100,
  },
];

// =====================================================
// REGION DATA (DEMO)
// =====================================================

interface RegionData {
  id: string;
  name: string;
  value: number;
  trend: 'up' | 'down' | 'stable';
  trendPercent: number;
  observations: number;
}

const DEMO_REGIONS: Record<ZoomLevel, RegionData[]> = {
  0: [
    { id: 'se', name: 'Sverige', value: 67.4, trend: 'up', trendPercent: 0.3, observations: 10500000 },
  ],
  1: [
    { id: '01', name: 'Stockholms län', value: 72.1, trend: 'up', trendPercent: 0.5, observations: 2400000 },
    { id: '03', name: 'Uppsala län', value: 70.3, trend: 'up', trendPercent: 0.2, observations: 390000 },
    { id: '04', name: 'Södermanlands län', value: 65.8, trend: 'down', trendPercent: -0.3, observations: 300000 },
    { id: '05', name: 'Östergötlands län', value: 68.2, trend: 'stable', trendPercent: 0.0, observations: 470000 },
    { id: '06', name: 'Jönköpings län', value: 69.1, trend: 'up', trendPercent: 0.4, observations: 370000 },
    { id: '12', name: 'Skåne län', value: 66.4, trend: 'down', trendPercent: -0.2, observations: 1400000 },
    { id: '14', name: 'Västra Götalands län', value: 68.7, trend: 'up', trendPercent: 0.3, observations: 1750000 },
    { id: '17', name: 'Värmlands län', value: 63.2, trend: 'down', trendPercent: -0.5, observations: 280000 },
    { id: '25', name: 'Norrbottens län', value: 61.8, trend: 'stable', trendPercent: 0.1, observations: 250000 },
  ],
  2: [
    { id: '0180', name: 'Stockholm', value: 73.5, trend: 'up', trendPercent: 0.6, observations: 980000 },
    { id: '0184', name: 'Solna', value: 75.2, trend: 'up', trendPercent: 0.8, observations: 85000 },
    { id: '0186', name: 'Lidingö', value: 77.1, trend: 'stable', trendPercent: 0.1, observations: 48000 },
    { id: '0187', name: 'Vaxholm', value: 74.8, trend: 'up', trendPercent: 0.4, observations: 12000 },
    { id: '0123', name: 'Järfälla', value: 68.9, trend: 'down', trendPercent: -0.3, observations: 82000 },
    { id: '0127', name: 'Botkyrka', value: 59.2, trend: 'down', trendPercent: -0.8, observations: 95000 },
    { id: '0162', name: 'Danderyd', value: 79.3, trend: 'up', trendPercent: 0.5, observations: 33000 },
    { id: '0163', name: 'Sollentuna', value: 71.4, trend: 'stable', trendPercent: 0.0, observations: 75000 },
  ],
  3: [
    { id: 'cluster_1', name: 'Hög vårdkonsumtion + låg arbetsförmåga', value: 52.3, trend: 'down', trendPercent: -1.2, observations: 45000 },
    { id: 'cluster_2', name: 'Ung befolkning + stigande sysselsättning', value: 71.8, trend: 'up', trendPercent: 1.5, observations: 62000 },
    { id: 'cluster_3', name: 'Snabb försämring senaste 24 mån', value: 58.1, trend: 'down', trendPercent: -2.1, observations: 28000 },
    { id: 'cluster_4', name: 'Stabilt hög livskvalitet', value: 78.4, trend: 'stable', trendPercent: 0.2, observations: 89000 },
    { id: 'cluster_5', name: 'Industriomvandling + stigande arbetslöshet', value: 61.2, trend: 'down', trendPercent: -0.9, observations: 35000 },
  ],
};

// =====================================================
// MAP REGION COMPONENT
// =====================================================

interface MapRegionProps {
  region: RegionData;
  isSelected: boolean;
  onClick: () => void;
  showDetails: boolean;
}

function MapRegion({ region, isSelected, onClick, showDetails }: MapRegionProps) {
  // Färgskala baserad på värde
  const getColorClass = (value: number) => {
    if (value >= 75) return 'bg-emerald-500';
    if (value >= 70) return 'bg-emerald-400';
    if (value >= 65) return 'bg-amber-400';
    if (value >= 60) return 'bg-orange-400';
    return 'bg-red-400';
  };

  const TrendIcon = region.trend === 'up' ? TrendingUp : region.trend === 'down' ? TrendingDown : Minus;
  const trendColor = region.trend === 'up' ? 'text-emerald-500' : region.trend === 'down' ? 'text-red-500' : 'text-muted-foreground';

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left p-3 rounded-lg border transition-all",
        "hover:shadow-md hover:border-primary/50",
        isSelected && "ring-2 ring-primary border-primary",
        "bg-card"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className={cn("w-3 h-3 rounded-full shrink-0", getColorClass(region.value))} />
            <p className="text-sm font-medium truncate">{region.name}</p>
          </div>
          {showDetails && (
            <p className="text-xs text-muted-foreground mt-1 truncate">
              {region.observations.toLocaleString('sv-SE')} obs
            </p>
          )}
        </div>
        <div className="text-right shrink-0">
          <p className="text-lg font-bold">{region.value.toFixed(1)}</p>
          <div className={cn("flex items-center justify-end gap-1 text-xs", trendColor)}>
            <TrendIcon className="h-3 w-3" />
            <span>{region.trendPercent > 0 ? '+' : ''}{region.trendPercent}%</span>
          </div>
        </div>
      </div>
    </button>
  );
}

// =====================================================
// CLUSTER EXPLAINER
// =====================================================

interface ClusterExplainerProps {
  clusterId: string;
  clusterName: string;
  onClose: () => void;
}

function ClusterExplainer({ clusterName, onClose }: Omit<ClusterExplainerProps, 'clusterId'>) {
  // Demo-data för klusterförklaring
  const factors = [
    { name: 'Långtidssjukskrivning', value: '+38%', direction: 'above' },
    { name: 'Arbetsförmåga 20-64 år', value: '-12%', direction: 'below' },
    { name: 'Vårdkonsumtion', value: '+25%', direction: 'above' },
    { name: 'Medianinkomst', value: '-8%', direction: 'below' },
  ];

  return (
    <div className="bg-muted/50 rounded-lg p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium flex items-center gap-2">
            <Layers className="h-4 w-4" />
            Varför detta kluster?
          </p>
          <p className="text-xs text-muted-foreground mt-1">{clusterName}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-6 px-2 text-xs">
          Stäng
        </Button>
      </div>
      
      <div className="space-y-2">
        {factors.map((factor) => (
          <div key={factor.name} className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{factor.name}</span>
            <Badge 
              variant={factor.direction === 'above' ? 'destructive' : 'secondary'}
              className="text-xs"
            >
              {factor.value} vs nationellt
            </Badge>
          </div>
        ))}
      </div>
      
      <Alert className="bg-background">
        <Info className="h-4 w-4" />
        <AlertDescription className="text-xs">
          Kluster är mönster, inte geografi. Dessa områden delar statistiska profiler.
        </AlertDescription>
      </Alert>
    </div>
  );
}

// =====================================================
// MAIN MAP EXPLORER COMPONENT
// =====================================================

interface MapExplorerProps {
  className?: string;
  onRegionSelect?: (regionId: string, zoomLevel: ZoomLevel) => void;
}

export function MapExplorer({ className, onRegionSelect }: MapExplorerProps) {
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>(0);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedKpi, setSelectedKpi] = useState('employment_rate');
  const [timeIndex, setTimeIndex] = useState([12]); // Månader tillbaka
  const [showClusterExplainer, setShowClusterExplainer] = useState(false);

  const currentZoomConfig = ZOOM_LEVELS[zoomLevel];
  const regions = DEMO_REGIONS[zoomLevel];

  const handleZoomIn = useCallback(() => {
    if (zoomLevel < 3) {
      setZoomLevel((zoomLevel + 1) as ZoomLevel);
      setSelectedRegion(null);
    }
  }, [zoomLevel]);

  const handleZoomOut = useCallback(() => {
    if (zoomLevel > 0) {
      setZoomLevel((zoomLevel - 1) as ZoomLevel);
      setSelectedRegion(null);
      setShowClusterExplainer(false);
    }
  }, [zoomLevel]);

  const handleRegionClick = useCallback((regionId: string) => {
    setSelectedRegion(regionId);
    onRegionSelect?.(regionId, zoomLevel);
    
    // Visa klusterförklaring på nivå 3
    if (zoomLevel === 3) {
      setShowClusterExplainer(true);
    }
  }, [zoomLevel, onRegionSelect]);

  const isPublicLimit = zoomLevel === 3;

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Geografisk utforskare
            </CardTitle>
            <CardDescription className="text-xs">
              {currentZoomConfig.name} – {currentZoomConfig.description}
            </CardDescription>
          </div>
          <div className="flex items-center gap-1">
            <Badge variant="outline" className="text-xs">
              Zoom {zoomLevel}
            </Badge>
            {!currentZoomConfig.isPublic && (
              <Badge variant="secondary" className="text-xs gap-1">
                <Lock className="h-3 w-3" />
                Maxdjup
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Zoom Controls */}
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleZoomOut}
                  disabled={zoomLevel === 0}
                  className="h-8 w-8"
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zooma ut</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className="flex-1 flex items-center gap-1">
            {ZOOM_LEVELS.map((level) => (
              <button
                key={level.level}
                onClick={() => {
                  setZoomLevel(level.level);
                  setSelectedRegion(null);
                }}
                className={cn(
                  "flex-1 h-2 rounded-full transition-all",
                  level.level <= zoomLevel 
                    ? "bg-primary" 
                    : "bg-muted",
                  level.level === zoomLevel && "ring-2 ring-primary ring-offset-2"
                )}
              />
            ))}
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleZoomIn}
                  disabled={zoomLevel === 3}
                  className="h-8 w-8"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zooma in</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Zoom Level Labels */}
        <div className="flex justify-between text-[10px] text-muted-foreground px-10">
          {ZOOM_LEVELS.map((level) => (
            <span key={level.level} className={cn(
              level.level === zoomLevel && "text-foreground font-medium"
            )}>
              {level.name.split(' ')[0]}
            </span>
          ))}
        </div>

        <Separator />

        {/* KPI & Time Controls */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Indikator</label>
            <Select value={selectedKpi} onValueChange={setSelectedKpi}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="employment_rate">Sysselsättningsgrad</SelectItem>
                <SelectItem value="life_expectancy">Medellivslängd</SelectItem>
                <SelectItem value="productivity">Produktivitet</SelectItem>
                <SelectItem value="crime_rate">Brottslighet</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Period
            </label>
            <div className="flex items-center gap-2">
              <Slider
                value={timeIndex}
                onValueChange={setTimeIndex}
                min={1}
                max={36}
                step={1}
                className="flex-1"
              />
              <span className="text-xs font-mono w-8">{timeIndex[0]}m</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Privacy Warning for Cluster Level */}
        {isPublicLimit && (
          <Alert className="bg-amber-500/5 border-amber-500/20">
            <Lock className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-xs text-amber-700 dark:text-amber-400">
              🔒 Publik zoom slutar här. Kluster visar statistiska mönster, inte administrativa gränser.
            </AlertDescription>
          </Alert>
        )}

        {/* Region List (Visual Map Placeholder) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {zoomLevel === 3 ? 'Kluster' : 'Regioner'} ({regions.length})
            </p>
            <div className="flex items-center gap-2 text-[10px]">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                Stark
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-amber-400" />
                Medel
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-red-400" />
                Svag
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-1">
            {regions.map((region) => (
              <MapRegion
                key={region.id}
                region={region}
                isSelected={selectedRegion === region.id}
                onClick={() => handleRegionClick(region.id)}
                showDetails={zoomLevel >= 2}
              />
            ))}
          </div>
        </div>

        {/* Cluster Explainer */}
        {showClusterExplainer && selectedRegion && zoomLevel === 3 && (
          <>
            <Separator />
            <ClusterExplainer
              clusterName={regions.find(r => r.id === selectedRegion)?.name || ''}
              onClose={() => setShowClusterExplainer(false)}
            />
          </>
        )}

        {/* Navigation Hint */}
        <div className="text-center text-xs text-muted-foreground pt-2">
          {zoomLevel < 3 ? (
            <span className="flex items-center justify-center gap-1">
              Klicka på en region och zooma in för mer detalj
              <ZoomIn className="h-3 w-3" />
            </span>
          ) : (
            <span className="flex items-center justify-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Maximal publik zoom nådd
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
