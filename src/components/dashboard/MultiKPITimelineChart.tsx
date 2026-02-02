import { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Brush,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Layers, 
  TrendingUp, 
  Calendar,
  ChevronDown,
  ChevronUp,
  Database,
  RefreshCw,
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { sv } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { CATEGORIES } from '@/types/kpi';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useAvailableKPIs, useMultipleKPIHistoricalData } from '@/hooks/useHistoricalKPIData';

// Color palette for multiple lines
const CHART_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  '#8884d8',
  '#82ca9d',
  '#ffc658',
  '#ff7300',
  '#00C49F',
];

// Custom tooltip for multi-KPI
function MultiTooltip({ active, payload, label, kpiMap }: any) {
  if (!active || !payload || !payload.length) return null;
  
  let date: Date;
  try {
    date = parseISO(label);
  } catch {
    return null;
  }
  
  return (
    <div className="bg-popover border rounded-lg shadow-lg p-3 text-sm max-w-xs">
      <div className="font-medium mb-2 flex items-center gap-2">
        <Calendar className="h-4 w-4" />
        {format(date, 'd MMMM yyyy', { locale: sv })}
      </div>
      <div className="space-y-1.5">
        {payload.map((entry: any, index: number) => {
          const kpi = kpiMap?.[entry.dataKey];
          return (
            <div key={index} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <div 
                  className="w-2 h-2 rounded-full shrink-0" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-muted-foreground truncate text-xs">
                  {kpi?.name || entry.dataKey}
                </span>
              </div>
              <span className="font-mono font-medium shrink-0">
                {typeof entry.value === 'number' ? entry.value.toLocaleString('sv-SE', { maximumFractionDigits: 2 }) : '-'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface MultiKPITimelineChartProps {
  defaultSelected?: string[];
  height?: number;
}

export function MultiKPITimelineChart({
  defaultSelected = [],
  height = 450,
}: MultiKPITimelineChartProps) {
  const [timeRange, setTimeRange] = useState<'1y' | '3y' | '5y'>('3y');
  const [selectedKPIs, setSelectedKPIs] = useState<Set<string>>(
    new Set(defaultSelected)
  );
  const [showSelector, setShowSelector] = useState(false);
  
  // Fetch available KPIs from database
  const { data: availableKPIs, isLoading: loadingKPIs } = useAvailableKPIs();
  
  // Initialize with first 3 KPIs if no default selection
  const activeKPIIds = useMemo(() => {
    if (selectedKPIs.size > 0) return Array.from(selectedKPIs);
    if (availableKPIs?.length) {
      const initial = availableKPIs.slice(0, 3).map(k => k.id);
      return initial;
    }
    return [];
  }, [selectedKPIs, availableKPIs]);
  
  // Fetch historical data for selected KPIs
  const { data: historicalData, isLoading: loadingData, refetch } = useMultipleKPIHistoricalData(activeKPIIds, timeRange);
  
  const kpisByCategory = useMemo(() => {
    if (!availableKPIs) return [];
    return CATEGORIES.map(cat => ({
      category: cat,
      kpis: availableKPIs.filter(k => k.category === cat.id),
    })).filter(g => g.kpis.length > 0);
  }, [availableKPIs]);
  
  const toggleKPI = (kpiId: string) => {
    setSelectedKPIs(prev => {
      const next = new Set(prev);
      if (next.has(kpiId)) {
        next.delete(kpiId);
      } else if (next.size < 10) {
        next.add(kpiId);
      }
      return next;
    });
  };
  
  const formatXAxis = (dateStr: string) => {
    try {
      const date = parseISO(dateStr);
      return format(date, 'MMM yy', { locale: sv });
    } catch {
      return dateStr;
    }
  };
  
  const chartData = historicalData?.chartData || [];
  const kpiMap = historicalData?.kpiMap || {};
  const activeKPIs = availableKPIs?.filter(k => activeKPIIds.includes(k.id)) || [];

  // Loading state
  if (loadingKPIs) {
    return (
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            Jämför Indikatorer över Tid
          </CardTitle>
          <CardDescription>Laddar KPI-definitioner...</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[450px] w-full" />
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
              <Layers className="h-5 w-5 text-primary" />
              Jämför Indikatorer över Tid
            </CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Database className="h-3 w-3" />
              Riktig data från databasen • Välj upp till 10 KPI:er
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
              </TabsList>
            </Tabs>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* KPI Selector */}
        <Collapsible open={showSelector} onOpenChange={setShowSelector}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-wrap gap-1.5">
              {activeKPIs.map((kpi, index) => (
                <Badge 
                  key={kpi.id}
                  variant="secondary"
                  className="gap-1 cursor-pointer"
                  style={{ 
                    backgroundColor: `${CHART_COLORS[index % CHART_COLORS.length]}20`,
                    borderColor: CHART_COLORS[index % CHART_COLORS.length],
                  }}
                  onClick={() => toggleKPI(kpi.id)}
                >
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                  />
                  {kpi.name}
                  <span className="text-muted-foreground">×</span>
                </Badge>
              ))}
              {activeKPIs.length === 0 && (
                <span className="text-muted-foreground text-sm">Ingen KPI vald</span>
              )}
            </div>
            
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                {showSelector ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                {showSelector ? 'Dölj' : 'Välj KPI:er'}
              </Button>
            </CollapsibleTrigger>
          </div>
          
          <CollapsibleContent>
            <div className="border rounded-lg p-4 mb-4 bg-muted/30">
              <ScrollArea className="h-[200px]">
                <div className="space-y-4">
                  {kpisByCategory.map(({ category, kpis: catKPIs }) => (
                    <div key={category.id}>
                      <div className="font-medium text-sm mb-2 text-muted-foreground">
                        {category.code}. {category.name}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {catKPIs.map(kpi => (
                          <div 
                            key={kpi.id}
                            className={cn(
                              "flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors",
                              selectedKPIs.has(kpi.id) || activeKPIIds.includes(kpi.id)
                                ? "bg-primary/10 border border-primary/30" 
                                : "bg-background hover:bg-muted"
                            )}
                            onClick={() => toggleKPI(kpi.id)}
                          >
                            <Checkbox 
                              checked={selectedKPIs.has(kpi.id) || activeKPIIds.includes(kpi.id)}
                              className="pointer-events-none"
                            />
                            <div className="min-w-0">
                              <div className="text-sm font-medium truncate">{kpi.name}</div>
                              <div className="text-xs text-muted-foreground">{kpi.code}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </CollapsibleContent>
        </Collapsible>
        
        {/* Chart */}
        {loadingData ? (
          <Skeleton className="h-[400px] w-full" />
        ) : chartData.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Database className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="mb-2">Ingen historisk data hittades</p>
              <p className="text-sm">Välj KPI:er som har lagrat tidsseriedata</p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
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
                domain={['auto', 'auto']}
                tickFormatter={(v) => v.toLocaleString('sv-SE')}
              />
              
              <Tooltip content={<MultiTooltip kpiMap={kpiMap} />} />
              
              <Legend 
                wrapperStyle={{ paddingTop: 20 }}
                formatter={(value) => (
                  <span className="text-xs">
                    {kpiMap[value]?.name || value}
                  </span>
                )}
              />
              
              {activeKPIs.map((kpi, index) => (
                <Line
                  key={kpi.id}
                  type="monotone"
                  dataKey={kpi.id}
                  stroke={CHART_COLORS[index % CHART_COLORS.length]}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 5 }}
                  name={kpi.id}
                  connectNulls
                />
              ))}
              
              {chartData.length > 18 && (
                <Brush
                  dataKey="date"
                  height={30}
                  stroke="hsl(var(--primary))"
                  tickFormatter={formatXAxis}
                  startIndex={Math.max(0, chartData.length - 18)}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        )}
        
        {/* Info hint */}
        {activeKPIs.length >= 2 && chartData.length > 0 && (
          <div className="mt-4 p-3 bg-muted/50 rounded-lg text-sm flex items-start gap-2">
            <TrendingUp className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <div>
              <span className="font-medium">Tips: </span>
              <span className="text-muted-foreground">
                Jämför trender mellan indikatorer för att identifiera möjliga korrelationer. 
                Observera att korrelation inte innebär orsakssamband.
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
