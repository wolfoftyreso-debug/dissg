import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import {
  MapPin,
  TrendingUp,
  TrendingDown,
  Minus,
  Users,
  ArrowRight,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { SWEDISH_REGIONS, getRegionByCode } from '@/config/regionsConfig';
import { useRegionalKPIData } from '@/hooks/useRegionalKPIData';
import { CATEGORIES } from '@/types/kpi';

interface RegionDetailPanelProps {
  regionCode: string;
  className?: string;
  onClose?: () => void;
  onCompareWith?: (regionCode: string) => void;
}

export function RegionDetailPanel({ regionCode, className, onClose, onCompareWith }: RegionDetailPanelProps) {
  const [compareRegion, setCompareRegion] = useState<string>('');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  
  const region = getRegionByCode(regionCode);
  const { allKPIsRegionalData, isLoading } = useRegionalKPIData();

  // Beräkna statistik för regionen
  const regionStats = useMemo(() => {
    if (!allKPIsRegionalData.length) return null;

    let betterThanNational = 0;
    let worseThanNational = 0;
    let improving = 0;
    let declining = 0;

    allKPIsRegionalData.forEach(kpi => {
      const regionValue = kpi.regions.find(r => r.regionCode === regionCode);
      if (!regionValue) return;

      const isBetter = kpi.isInverted 
        ? regionValue.value < kpi.nationalValue 
        : regionValue.value > kpi.nationalValue;
      
      if (isBetter) betterThanNational++;
      else worseThanNational++;

      if (regionValue.trend === 'up') {
        if (kpi.isInverted) declining++;
        else improving++;
      } else if (regionValue.trend === 'down') {
        if (kpi.isInverted) improving++;
        else declining++;
      }
    });

    return {
      total: allKPIsRegionalData.length,
      betterThanNational,
      worseThanNational,
      improving,
      declining,
      stable: allKPIsRegionalData.length - improving - declining,
    };
  }, [allKPIsRegionalData, regionCode]);

  if (!region) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-64">
          <span className="text-muted-foreground">Regionen hittades inte</span>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-64">
          <div className="animate-pulse text-muted-foreground">Laddar...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              {region.name}
            </CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <Users className="h-3 w-3" />
              {region.population.toLocaleString('sv-SE')} invånare
              <span className="text-muted-foreground">•</span>
              Residensstad: {region.capital}
            </CardDescription>
          </div>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              Stäng
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Summary Stats */}
        {regionStats && (
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-chart-2/10 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Över rikssnitt</p>
              <p className="text-2xl font-bold text-chart-2">
                {regionStats.betterThanNational}
                <span className="text-sm font-normal text-muted-foreground ml-1">
                  / {regionStats.total}
                </span>
              </p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Förbättras</p>
              <p className="text-2xl font-bold">
                {regionStats.improving}
                <span className="text-sm font-normal text-muted-foreground ml-1">
                  indikatorer
                </span>
              </p>
            </div>
          </div>
        )}

        {/* Compare with another region */}
        <div className="flex items-center gap-2">
          <Select value={compareRegion} onValueChange={setCompareRegion}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Jämför med annat län..." />
            </SelectTrigger>
            <SelectContent>
              {SWEDISH_REGIONS.filter(r => r.code !== regionCode).map(r => (
                <SelectItem key={r.code} value={r.code}>
                  {r.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {compareRegion && (
            <Button 
              size="sm" 
              onClick={() => onCompareWith?.(compareRegion)}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>

        <Separator />

        {/* KPIs by Category */}
        <ScrollArea className="h-[400px]">
          <div className="space-y-2">
            {CATEGORIES.map(category => {
              const categoryKpis = allKPIsRegionalData.filter(kpi => {
                // Enkel matchning baserad på ID-mönster
                return kpi.kpiId.toLowerCase().includes(category.id.replace('_', ''));
              });

              if (!categoryKpis.length) return null;

              const isExpanded = expandedCategory === category.id;

              return (
                <div key={category.id} className="border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
                    className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {category.code}
                      </Badge>
                      <span className="text-sm font-medium">{category.name}</span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="border-t p-3 space-y-3 bg-muted/20">
                      {allKPIsRegionalData.slice(0, 5).map(kpi => {
                        const regionValue = kpi.regions.find(r => r.regionCode === regionCode);
                        if (!regionValue) return null;

                        const diff = regionValue.value - kpi.nationalValue;
                        const isBetter = kpi.isInverted ? diff < 0 : diff > 0;
                        const rank = [...kpi.regions].sort((a, b) => 
                          kpi.isInverted ? a.value - b.value : b.value - a.value
                        ).findIndex(r => r.regionCode === regionCode) + 1;

                        const TrendIcon = regionValue.trend === 'up' ? TrendingUp : 
                                         regionValue.trend === 'down' ? TrendingDown : Minus;

                        return (
                          <div key={kpi.kpiId} className="flex items-center gap-3">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm truncate">{kpi.kpiName}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs font-mono">
                                  {regionValue.value.toLocaleString('sv-SE', { maximumFractionDigits: 1 })} {kpi.kpiUnit}
                                </span>
                                <span className={cn(
                                  "text-xs",
                                  isBetter ? 'text-chart-2' : 'text-destructive'
                                )}>
                                  ({diff > 0 ? '+' : ''}{diff.toFixed(1)} vs rikssnitt)
                                </span>
                              </div>
                            </div>
                            <Badge variant={isBetter ? 'default' : 'secondary'} className="shrink-0">
                              #{rank}
                            </Badge>
                            <TrendIcon className={cn(
                              "h-4 w-4 shrink-0",
                              regionValue.trend === 'up' && !kpi.isInverted && 'text-chart-2',
                              regionValue.trend === 'down' && !kpi.isInverted && 'text-destructive',
                              regionValue.trend === 'up' && kpi.isInverted && 'text-destructive',
                              regionValue.trend === 'down' && kpi.isInverted && 'text-chart-2',
                            )} />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

export default RegionDetailPanel;
