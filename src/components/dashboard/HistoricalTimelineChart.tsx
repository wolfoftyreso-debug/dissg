import { useState, useMemo } from 'react';
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Brush,
  Area,
  ComposedChart,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Calendar, 
  TrendingUp, 
  AlertTriangle,
  Database,
  RefreshCw,
} from 'lucide-react';
import { format, parseISO, subMonths } from 'date-fns';
import { sv } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { HISTORICAL_EVENTS, type HistoricalEvent } from '@/data/historicalEvents';
import { useHistoricalKPIData } from '@/hooks/useHistoricalKPIData';

// Custom tooltip
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null;
  
  const date = parseISO(label);
  const isProjected = payload[0]?.payload?.projected;
  const confidence = payload[0]?.payload?.confidence;
  const status = payload[0]?.payload?.status;
  
  return (
    <div className="bg-popover border rounded-lg shadow-lg p-3 text-sm">
      <div className="font-medium mb-2 flex items-center gap-2">
        <Calendar className="h-4 w-4" />
        {format(date, 'd MMMM yyyy', { locale: sv })}
        {isProjected && (
          <Badge variant="outline" className="text-xs">Prognos</Badge>
        )}
      </div>
      <div className="space-y-1">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground">{entry.name}</span>
            </div>
            <span className="font-mono font-medium">
              {typeof entry.value === 'number' ? entry.value.toLocaleString('sv-SE') : entry.value}
            </span>
          </div>
        ))}
      </div>
      {confidence && (
        <div className="mt-2 pt-2 border-t text-xs text-muted-foreground">
          Konfidens: {confidence}% | Status: {status}
        </div>
      )}
    </div>
  );
}

interface HistoricalTimelineChartProps {
  kpiId?: string;
  kpiName?: string;
  showEvents?: boolean;
  height?: number;
}

export function HistoricalTimelineChart({
  kpiId,
  kpiName = 'Indikator',
  showEvents = true,
  height = 400,
}: HistoricalTimelineChartProps) {
  const [timeRange, setTimeRange] = useState<'1y' | '3y' | '5y' | '10y'>('5y');
  const [chartType, setChartType] = useState<'line' | 'area'>('line');
  const [showConfidence, setShowConfidence] = useState(true);
  const [showTrendline, setShowTrendline] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<HistoricalEvent | null>(null);
  
  // Fetch real data from database
  const { data: historicalData, isLoading, refetch } = useHistoricalKPIData(kpiId, timeRange);
  
  const monthsMap = { '1y': 12, '3y': 36, '5y': 60, '10y': 120 };
  
  // Use real data or show empty state
  const data = useMemo(() => {
    if (!historicalData?.data?.length) return [];
    return historicalData.data;
  }, [historicalData]);
  
  // Calculate confidence band (±5%)
  const dataWithBands = useMemo(() => {
    return data.map(d => ({
      ...d,
      upper: d.value * 1.05,
      lower: d.value * 0.95,
      trendline: d.value,
    }));
  }, [data]);
  
  // Use stats from hook or calculate fallback
  const stats = historicalData?.stats || { min: 0, max: 0, avg: 0, first: 0, last: 0, change: 0 };
  
  // Filter relevant historical events
  const relevantEvents = useMemo(() => {
    if (!showEvents) return [];
    const startDate = subMonths(new Date(), monthsMap[timeRange]);
    return HISTORICAL_EVENTS.filter(event => {
      const eventDate = parseISO(event.date);
      return eventDate >= startDate;
    });
  }, [showEvents, timeRange]);
  
  const formatXAxis = (dateStr: string) => {
    try {
      const date = parseISO(dateStr);
      return format(date, timeRange === '1y' ? 'MMM' : 'MMM yy', { locale: sv });
    } catch {
      return dateStr;
    }
  };
  
  const displayName = historicalData?.kpiName || kpiName;
  const displayUnit = historicalData?.unit || 'värde';

  // Loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Historisk Tidslinje: {kpiName}
          </CardTitle>
          <CardDescription>Laddar data...</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[400px] w-full" />
        </CardContent>
      </Card>
    );
  }
  
  // Empty state
  if (!data.length) {
    return (
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Historisk Tidslinje: {displayName}
              </CardTitle>
              <CardDescription>Ingen historisk data tillgänglig</CardDescription>
            </div>
            <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v as typeof timeRange)}>
              <TabsList className="h-8">
                <TabsTrigger value="1y" className="text-xs">1 år</TabsTrigger>
                <TabsTrigger value="3y" className="text-xs">3 år</TabsTrigger>
                <TabsTrigger value="5y" className="text-xs">5 år</TabsTrigger>
                <TabsTrigger value="10y" className="text-xs">10 år</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Database className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="mb-2">Ingen tidsseriedata hittades för denna KPI</p>
              <p className="text-sm">Välj en annan tidsperiod eller KPI</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Historisk Tidslinje: {displayName}
            </CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Database className="h-3 w-3" />
              {data.length} datapunkter från databasen ({displayUnit})
              <button onClick={() => refetch()} className="ml-2 hover:text-primary">
                <RefreshCw className="h-3 w-3" />
              </button>
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v as typeof timeRange)}>
              <TabsList className="h-8">
                <TabsTrigger value="1y" className="text-xs">1 år</TabsTrigger>
                <TabsTrigger value="3y" className="text-xs">3 år</TabsTrigger>
                <TabsTrigger value="5y" className="text-xs">5 år</TabsTrigger>
                <TabsTrigger value="10y" className="text-xs">10 år</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        
        {/* Controls */}
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <Select value={chartType} onValueChange={(v) => setChartType(v as typeof chartType)}>
            <SelectTrigger className="w-[120px] h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="line">Linjediagram</SelectItem>
              <SelectItem value="area">Ytdiagram</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex items-center gap-2">
            <Switch 
              id="confidence" 
              checked={showConfidence} 
              onCheckedChange={setShowConfidence}
            />
            <Label htmlFor="confidence" className="text-xs">Konfidensband</Label>
          </div>
          
          <div className="flex items-center gap-2">
            <Switch 
              id="trendline" 
              checked={showTrendline} 
              onCheckedChange={setShowTrendline}
            />
            <Label htmlFor="trendline" className="text-xs">Trendlinje</Label>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Stats summary */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-xs text-muted-foreground">Min</div>
            <div className="font-mono font-bold">{stats.min.toLocaleString('sv-SE')}</div>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-xs text-muted-foreground">Max</div>
            <div className="font-mono font-bold">{stats.max.toLocaleString('sv-SE')}</div>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-xs text-muted-foreground">Genomsnitt</div>
            <div className="font-mono font-bold">{stats.avg.toLocaleString('sv-SE', { maximumFractionDigits: 1 })}</div>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-xs text-muted-foreground">Nuvarande</div>
            <div className="font-mono font-bold">{stats.last.toLocaleString('sv-SE')}</div>
          </div>
          <div className={cn(
            "text-center p-3 rounded-lg",
            stats.change >= 0 ? "bg-emerald-50 dark:bg-emerald-950/30" : "bg-red-50 dark:bg-red-950/30"
          )}>
            <div className="text-xs text-muted-foreground">Förändring</div>
            <div className={cn(
              "font-mono font-bold",
              stats.change >= 0 ? "text-emerald-600" : "text-red-600"
            )}>
              {stats.change >= 0 ? '+' : ''}{stats.change.toFixed(1)}%
            </div>
          </div>
        </div>
        
        {/* Chart */}
        <ResponsiveContainer width="100%" height={height}>
          <ComposedChart data={dataWithBands} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" opacity={0.3} />
            
            <XAxis 
              dataKey="date" 
              tickFormatter={formatXAxis}
              tick={{ fontSize: 11 }}
              className="fill-muted-foreground"
              interval="preserveStartEnd"
            />
            
            <YAxis 
              tick={{ fontSize: 11 }}
              className="fill-muted-foreground"
              tickFormatter={(v) => v.toLocaleString('sv-SE')}
              domain={['auto', 'auto']}
            />
            
            <Tooltip content={<CustomTooltip />} />
            
            <Legend 
              wrapperStyle={{ paddingTop: 20 }}
              formatter={(value) => <span className="text-sm">{value}</span>}
            />
            
            {/* Confidence band */}
            {showConfidence && (
              <Area
                type="monotone"
                dataKey="upper"
                stroke="none"
                fill="hsl(var(--primary))"
                fillOpacity={0.1}
                name="Övre konfidensband"
                legendType="none"
              />
            )}
            {showConfidence && (
              <Area
                type="monotone"
                dataKey="lower"
                stroke="none"
                fill="hsl(var(--background))"
                fillOpacity={1}
                name="Undre konfidensband"
                legendType="none"
              />
            )}
            
            {/* Event markers as reference lines */}
            {relevantEvents.map(event => (
              <ReferenceLine
                key={event.id}
                x={event.date}
                stroke="hsl(var(--destructive))"
                strokeDasharray="3 3"
                label={{
                  value: event.name.length > 20 ? event.name.slice(0, 17) + '...' : event.name,
                  position: 'insideTopRight',
                  fontSize: 9,
                  fill: 'hsl(var(--destructive))',
                  angle: -90,
                  offset: 10,
                }}
              />
            ))}
            
            {/* Main data line */}
            {chartType === 'line' ? (
              <Line
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
                name={displayName}
              />
            ) : (
              <Area
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="hsl(var(--primary))"
                fillOpacity={0.2}
                name={displayName}
              />
            )}
            
            {/* Trendline */}
            {showTrendline && (
              <Line
                type="linear"
                dataKey="trendline"
                stroke="hsl(var(--muted-foreground))"
                strokeWidth={1}
                strokeDasharray="5 5"
                dot={false}
                name="Trend"
                legendType="line"
              />
            )}
            
            {/* Brush for zoom */}
            <Brush
              dataKey="date"
              height={30}
              stroke="hsl(var(--primary))"
              tickFormatter={formatXAxis}
              startIndex={Math.max(0, data.length - 24)}
            />
          </ComposedChart>
        </ResponsiveContainer>
        
        {/* Events legend */}
        {showEvents && relevantEvents.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <span className="text-sm font-medium">Historiska händelser i perioden</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {relevantEvents.map(event => (
                <Badge 
                  key={event.id}
                  variant="outline"
                  className={cn(
                    "cursor-pointer transition-colors",
                    event.severity === 'critical' && "border-destructive text-destructive",
                    event.severity === 'high' && "border-warning text-warning",
                    selectedEvent?.id === event.id && "bg-muted"
                  )}
                  onClick={() => setSelectedEvent(selectedEvent?.id === event.id ? null : event)}
                >
                  {format(parseISO(event.date), 'yyyy-MM', { locale: sv })}: {event.name}
                </Badge>
              ))}
            </div>
            
            {/* Selected event details */}
            {selectedEvent && (
              <div className="mt-3 p-3 bg-muted/50 rounded-lg text-sm">
                <div className="font-medium mb-1">{selectedEvent.name}</div>
                <p className="text-muted-foreground text-xs mb-2">{selectedEvent.description}</p>
                <div className="text-xs">
                  <span className="text-muted-foreground">Utfall: </span>
                  <span>{selectedEvent.actualOutcome}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
