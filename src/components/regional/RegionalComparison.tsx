import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import {
  MapPin,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowUpDown,
  BarChart3,
  Table as TableIcon,
  Info,
  ChevronRight,
} from 'lucide-react';
import { formatRegionName, REGION_GROUPS, REGION_GROUP_LABELS } from '@/config/regionsConfig';
import { useRegionalKPIData, type RegionalKPIValue } from '@/hooks/useRegionalKPIData';
import { mockKPIs } from '@/data/mockKPIs';

// =====================================================
// REGION RANKING BAR
// =====================================================

interface RegionRankingBarProps {
  region: RegionalKPIValue;
  rank: number;
  maxValue: number;
  minValue: number;
  isInverted: boolean;
  unit: string;
  nationalValue: number;
  onClick?: () => void;
}

function RegionRankingBar({ 
  region, 
  rank, 
  maxValue, 
  minValue, 
  isInverted, 
  unit,
  nationalValue,
  onClick 
}: RegionRankingBarProps) {
  const range = maxValue - minValue;
  const normalizedValue = range > 0 ? ((region.value - minValue) / range) * 100 : 50;
  
  // Bestäm om värdet är bra eller dåligt
  const isBetterThanNational = isInverted 
    ? region.value < nationalValue 
    : region.value > nationalValue;

  const TrendIcon = region.trend === 'up' ? TrendingUp : region.trend === 'down' ? TrendingDown : Minus;
  const trendColor = region.trend === 'up' 
    ? (isInverted ? 'text-destructive' : 'text-chart-2')
    : region.trend === 'down' 
      ? (isInverted ? 'text-chart-2' : 'text-destructive')
      : 'text-muted-foreground';

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left p-3 rounded-lg border transition-all hover:shadow-sm hover:border-primary/50",
        "bg-card flex items-center gap-3"
      )}
    >
      <span className="text-sm font-mono text-muted-foreground w-6">
        #{rank}
      </span>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium truncate">{region.regionName}</span>
          {isBetterThanNational && (
            <Badge variant="outline" className="text-[10px] py-0 h-4 bg-chart-2/10 text-chart-2 border-chart-2/30">
              Över snitt
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Progress 
            value={normalizedValue} 
            className={cn(
              "h-2 flex-1",
              isBetterThanNational && "[&>div]:bg-chart-2",
              !isBetterThanNational && "[&>div]:bg-muted-foreground"
            )} 
          />
        </div>
      </div>

      <div className="text-right shrink-0">
        <p className="text-sm font-bold">
          {region.value.toLocaleString('sv-SE', { maximumFractionDigits: 1 })} 
          <span className="text-xs font-normal text-muted-foreground ml-1">{unit}</span>
        </p>
        <div className={cn("flex items-center justify-end gap-1 text-xs", trendColor)}>
          <TrendIcon className="h-3 w-3" />
          <span>
            {region.trendPercent > 0 ? '+' : ''}{region.trendPercent.toFixed(1)}%
          </span>
        </div>
      </div>

      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
    </button>
  );
}

// =====================================================
// REGION COMPARISON TABLE
// =====================================================

interface RegionComparisonTableProps {
  regions: RegionalKPIValue[];
  isInverted: boolean;
  unit: string;
  nationalValue: number;
}

function RegionComparisonTable({ regions, isInverted, nationalValue }: RegionComparisonTableProps) {
  const [sortField, setSortField] = useState<'name' | 'value' | 'trend'>('value');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const sortedRegions = useMemo(() => {
    return [...regions].sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'name':
          comparison = a.regionName.localeCompare(b.regionName, 'sv');
          break;
        case 'value':
          comparison = a.value - b.value;
          break;
        case 'trend':
          comparison = a.trendPercent - b.trendPercent;
          break;
      }
      return sortDir === 'asc' ? comparison : -comparison;
    });
  }, [regions, sortField, sortDir]);

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="grid grid-cols-4 gap-2 p-2 bg-muted/50 text-xs font-medium">
        <button onClick={() => toggleSort('name')} className="flex items-center gap-1 hover:text-primary">
          Län <ArrowUpDown className="h-3 w-3" />
        </button>
        <button onClick={() => toggleSort('value')} className="flex items-center gap-1 hover:text-primary text-right justify-end">
          Värde <ArrowUpDown className="h-3 w-3" />
        </button>
        <button onClick={() => toggleSort('trend')} className="flex items-center gap-1 hover:text-primary text-right justify-end">
          Trend <ArrowUpDown className="h-3 w-3" />
        </button>
        <div className="text-right">vs Riket</div>
      </div>
      
      <ScrollArea className="h-[400px]">
        {sortedRegions.map((region, idx) => {
          const diff = region.value - nationalValue;
          const isBetter = isInverted ? diff < 0 : diff > 0;
          
          return (
            <div 
              key={region.regionCode}
              className={cn(
                "grid grid-cols-4 gap-2 p-2 text-sm border-t",
                idx % 2 === 0 && "bg-muted/20"
              )}
            >
              <span className="truncate">{region.regionName}</span>
              <span className="text-right font-mono">
                {region.value.toLocaleString('sv-SE', { maximumFractionDigits: 1 })}
              </span>
              <span className={cn(
                "text-right",
                region.trendPercent > 0 ? (isInverted ? 'text-destructive' : 'text-chart-2') : 
                region.trendPercent < 0 ? (isInverted ? 'text-chart-2' : 'text-destructive') : ''
              )}>
                {region.trendPercent > 0 ? '+' : ''}{region.trendPercent.toFixed(1)}%
              </span>
              <span className={cn(
                "text-right font-medium",
                isBetter ? 'text-chart-2' : 'text-destructive'
              )}>
                {diff > 0 ? '+' : ''}{diff.toFixed(1)}
              </span>
            </div>
          );
        })}
      </ScrollArea>
    </div>
  );
}

// =====================================================
// MAIN COMPONENT
// =====================================================

interface RegionalComparisonProps {
  className?: string;
  initialKpiId?: string;
  onRegionSelect?: (regionCode: string) => void;
}

export function RegionalComparison({ className, initialKpiId, onRegionSelect }: RegionalComparisonProps) {
  const [selectedKpiId, setSelectedKpiId] = useState(initialKpiId || mockKPIs[0]?.id);
  const [selectedRegionGroup, setSelectedRegionGroup] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'ranking' | 'table'>('ranking');
  
  const { regionalData, isLoading } = useRegionalKPIData(selectedKpiId);

  const filteredRegions = useMemo(() => {
    if (!regionalData) return [];
    
    if (selectedRegionGroup === 'all') {
      return regionalData.regions;
    }

    const groupKey = selectedRegionGroup as keyof typeof REGION_GROUPS;
    const groupCodes: readonly string[] = REGION_GROUPS[groupKey] || [];
    return regionalData.regions.filter(r => groupCodes.includes(r.regionCode));
  }, [regionalData, selectedRegionGroup]);

  const sortedRegions = useMemo(() => {
    if (!filteredRegions.length) return [];
    return [...filteredRegions].sort((a, b) => 
      regionalData?.isInverted ? a.value - b.value : b.value - a.value
    );
  }, [filteredRegions, regionalData?.isInverted]);

  const maxValue = Math.max(...filteredRegions.map(r => r.value));
  const minValue = Math.min(...filteredRegions.map(r => r.value));

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-64">
          <div className="animate-pulse text-muted-foreground">Laddar regional data...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Jämför län
            </CardTitle>
            <CardDescription>
              Samma indikator – olika regioner. Objektiv jämförelse.
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'ranking' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('ranking')}
            >
              <BarChart3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'table' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('table')}
            >
              <TableIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Indikator</label>
            <Select value={selectedKpiId} onValueChange={setSelectedKpiId}>
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {mockKPIs.map(kpi => (
                  <SelectItem key={kpi.id} value={kpi.id}>
                    {kpi.index}. {kpi.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Region</label>
            <Select value={selectedRegionGroup} onValueChange={setSelectedRegionGroup}>
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alla 21 län</SelectItem>
                {Object.entries(REGION_GROUP_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Summary */}
        {regionalData && (
          <>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">Rikssnitt</p>
                <p className="text-lg font-bold">
                  {regionalData.nationalValue.toLocaleString('sv-SE', { maximumFractionDigits: 1 })}
                </p>
                <p className="text-xs text-muted-foreground">{regionalData.kpiUnit}</p>
              </div>
              
              <div className="bg-chart-2/10 rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">
                  {regionalData.isInverted ? 'Lägst' : 'Högst'}
                </p>
                <p className="text-lg font-bold text-chart-2">
                  {regionalData.bestRegion?.value.toLocaleString('sv-SE', { maximumFractionDigits: 1 })}
                </p>
                <p className="text-xs text-chart-2 truncate">
                  {formatRegionName(regionalData.bestRegion?.regionCode || '', true)}
                </p>
              </div>
              
              <div className="bg-destructive/10 rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">
                  {regionalData.isInverted ? 'Högst' : 'Lägst'}
                </p>
                <p className="text-lg font-bold text-destructive">
                  {regionalData.worstRegion?.value.toLocaleString('sv-SE', { maximumFractionDigits: 1 })}
                </p>
                <p className="text-xs text-destructive truncate">
                  {formatRegionName(regionalData.worstRegion?.regionCode || '', true)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 rounded-lg p-2">
              <Info className="h-4 w-4 shrink-0" />
              <span>
                Spridning mellan bästa och sämsta län: <strong>{regionalData.spread.toFixed(1)} {regionalData.kpiUnit}</strong>
              </span>
            </div>
          </>
        )}

        <Separator />

        {/* Content */}
        {viewMode === 'ranking' ? (
          <ScrollArea className="h-[400px] pr-2">
            <div className="space-y-2">
              {sortedRegions.map((region, idx) => (
                <RegionRankingBar
                  key={region.regionCode}
                  region={region}
                  rank={idx + 1}
                  maxValue={maxValue}
                  minValue={minValue}
                  isInverted={regionalData?.isInverted || false}
                  unit={regionalData?.kpiUnit || ''}
                  nationalValue={regionalData?.nationalValue || 0}
                  onClick={() => onRegionSelect?.(region.regionCode)}
                />
              ))}
            </div>
          </ScrollArea>
        ) : (
          <RegionComparisonTable
            regions={filteredRegions}
            isInverted={regionalData?.isInverted || false}
            unit={regionalData?.kpiUnit || ''}
            nationalValue={regionalData?.nationalValue || 0}
          />
        )}
      </CardContent>
    </Card>
  );
}

export default RegionalComparison;
