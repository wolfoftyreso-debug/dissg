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
import { 
  Layers, 
  TrendingUp, 
  Calendar,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { format, parseISO, subMonths } from 'date-fns';
import { sv } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { KPI, CATEGORIES } from '@/types/kpi';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

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

// Generate normalized historical data
function generateNormalizedData(
  kpis: KPI[], 
  months: number
): Array<{ date: string; [key: string]: number | string }> {
  const data: Array<{ date: string; [key: string]: number | string }> = [];
  const now = new Date();
  
  for (let i = months; i >= 0; i--) {
    const date = subMonths(now, i);
    const point: { date: string; [key: string]: number | string } = {
      date: format(date, 'yyyy-MM-dd'),
    };
    
    kpis.forEach(kpi => {
      // Normalize to 0-100 scale
      const trend = (months - i) / months * 0.1;
      const noise = (Math.random() - 0.5) * 0.05;
      const baseNormalized = 50 + (kpi.value / 100) * 30; // Simplified normalization
      point[kpi.id] = Math.round((baseNormalized * (1 + trend + noise)) * 10) / 10;
    });
    
    data.push(point);
  }
  
  return data;
}

// Custom tooltip for multi-KPI
function MultiTooltip({ active, payload, label, kpiMap }: any) {
  if (!active || !payload || !payload.length) return null;
  
  const date = parseISO(label);
  
  return (
    <div className="bg-popover border rounded-lg shadow-lg p-3 text-sm max-w-xs">
      <div className="font-medium mb-2 flex items-center gap-2">
        <Calendar className="h-4 w-4" />
        {format(date, 'd MMMM yyyy', { locale: sv })}
      </div>
      <div className="space-y-1.5">
        {payload.map((entry: any, index: number) => {
          const kpi = kpiMap[entry.dataKey];
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
                {entry.value.toFixed(1)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface MultiKPITimelineChartProps {
  kpis: KPI[];
  defaultSelected?: string[];
  height?: number;
}

export function MultiKPITimelineChart({
  kpis,
  defaultSelected = [],
  height = 450,
}: MultiKPITimelineChartProps) {
  const [timeRange, setTimeRange] = useState<'1y' | '3y' | '5y'>('3y');
  const [selectedKPIs, setSelectedKPIs] = useState<Set<string>>(
    new Set(defaultSelected.length > 0 ? defaultSelected : kpis.slice(0, 3).map(k => k.id))
  );
  const [showSelector, setShowSelector] = useState(false);
  
  const monthsMap = { '1y': 12, '3y': 36, '5y': 60 };
  
  const activeKPIs = useMemo(() => {
    return kpis.filter(kpi => selectedKPIs.has(kpi.id));
  }, [kpis, selectedKPIs]);
  
  const data = useMemo(() => {
    return generateNormalizedData(activeKPIs, monthsMap[timeRange]);
  }, [activeKPIs, timeRange]);
  
  const kpiMap = useMemo(() => {
    return kpis.reduce((acc, kpi) => {
      acc[kpi.id] = kpi;
      return acc;
    }, {} as Record<string, KPI>);
  }, [kpis]);
  
  const kpisByCategory = useMemo(() => {
    return CATEGORIES.map(cat => ({
      category: cat,
      kpis: kpis.filter(k => k.category === cat.id),
    })).filter(g => g.kpis.length > 0);
  }, [kpis]);
  
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
    const date = parseISO(dateStr);
    return format(date, 'MMM yy', { locale: sv });
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              Jämför Indikatorer över Tid
            </CardTitle>
            <CardDescription>
              Välj upp till 10 KPI:er för jämförelse (normaliserad skala 0-100)
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
                              selectedKPIs.has(kpi.id) 
                                ? "bg-primary/10 border border-primary/30" 
                                : "bg-background hover:bg-muted"
                            )}
                            onClick={() => toggleKPI(kpi.id)}
                          >
                            <Checkbox 
                              checked={selectedKPIs.has(kpi.id)}
                              className="pointer-events-none"
                            />
                            <div className="min-w-0">
                              <div className="text-sm font-medium truncate">{kpi.name}</div>
                              <div className="text-xs text-muted-foreground">{kpi.value} {kpi.unit}</div>
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
        {activeKPIs.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Layers className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Välj minst en indikator för att visa grafen</p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
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
                domain={[0, 100]}
                label={{ 
                  value: 'Normaliserat (0-100)', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { fontSize: 11, fill: 'hsl(var(--muted-foreground))' }
                }}
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
                />
              ))}
              
              <Brush
                dataKey="date"
                height={30}
                stroke="hsl(var(--primary))"
                tickFormatter={formatXAxis}
                startIndex={Math.max(0, data.length - 18)}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
        
        {/* Correlation hint */}
        {activeKPIs.length >= 2 && (
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
