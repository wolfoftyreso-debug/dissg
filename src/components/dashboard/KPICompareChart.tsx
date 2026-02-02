import { useMemo } from 'react';
import { KPI } from '@/types/kpi';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  ResponsiveContainer, 
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { format, subMonths, parseISO } from 'date-fns';
import { sv } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus, Equal, ArrowRight, X } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

interface KPICompareChartProps {
  kpi1: KPI;
  kpi2: KPI;
  months: number;
  onRemoveCompare: () => void;
}

interface CompareDataPoint {
  date: string;
  formattedDate: string;
  value1: number;
  value2: number;
  normalized1?: number;
  normalized2?: number;
}

// Generate mock historical data for comparison
function generateMockData(kpi: KPI, months: number): { date: string; value: number }[] {
  const data: { date: string; value: number }[] = [];
  const now = new Date();
  const baseValue = kpi.value;
  const volatility = baseValue * 0.05;
  
  let currentValue = baseValue;
  
  for (let i = months; i >= 0; i--) {
    const date = subMonths(now, i);
    const trendFactor = kpi.status === 'positive' ? 0.002 : 
                        kpi.status === 'critical' ? -0.003 : 0;
    const randomChange = (Math.random() - 0.5) * volatility;
    
    if (i < months) {
      currentValue = currentValue * (1 + trendFactor) + randomChange;
    }
    
    currentValue = Math.max(currentValue * 0.5, Math.min(currentValue * 1.5, currentValue));
    
    data.push({
      date: format(date, 'yyyy-MM-dd'),
      value: Math.round(currentValue * 100) / 100,
    });
  }
  
  if (data.length > 0) {
    data[data.length - 1].value = kpi.value;
  }
  
  return data;
}

function CustomTooltip({ active, payload, label, kpi1, kpi2 }: any) {
  if (!active || !payload || !payload.length) return null;
  
  const data = payload[0].payload as CompareDataPoint;
  
  return (
    <div className="rounded-lg border border-border bg-card p-3 shadow-lg min-w-[200px]">
      <p className="text-xs font-medium text-foreground mb-2">{data.formattedDate}</p>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-xs text-muted-foreground truncate max-w-[100px]">
              {kpi1.name}
            </span>
          </div>
          <span className="text-sm font-bold text-primary">
            {data.value1.toLocaleString('sv-SE')}
          </span>
        </div>
        
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-chart-2" />
            <span className="text-xs text-muted-foreground truncate max-w-[100px]">
              {kpi2.name}
            </span>
          </div>
          <span className="text-sm font-bold" style={{ color: 'hsl(var(--chart-2))' }}>
            {data.value2.toLocaleString('sv-SE')}
          </span>
        </div>
      </div>
    </div>
  );
}

export function KPICompareChart({ kpi1, kpi2, months, onRemoveCompare }: KPICompareChartProps) {
  // Fetch real data for both KPIs
  const { data: dbData1 } = useQuery({
    queryKey: ['kpi-compare', kpi1.id, months],
    queryFn: async () => {
      const startDate = format(subMonths(new Date(), months), 'yyyy-MM-dd');
      const { data, error } = await supabase
        .from('kpi_values')
        .select('*')
        .eq('kpi_id', kpi1.id)
        .gte('period_start', startDate)
        .order('period_start', { ascending: true });
      if (error) throw error;
      return data;
    },
  });
  
  const { data: dbData2 } = useQuery({
    queryKey: ['kpi-compare', kpi2.id, months],
    queryFn: async () => {
      const startDate = format(subMonths(new Date(), months), 'yyyy-MM-dd');
      const { data, error } = await supabase
        .from('kpi_values')
        .select('*')
        .eq('kpi_id', kpi2.id)
        .gte('period_start', startDate)
        .order('period_start', { ascending: true });
      if (error) throw error;
      return data;
    },
  });
  
  // Combine data from both KPIs
  const compareData = useMemo(() => {
    // Get data arrays (use mock if no real data)
    const data1 = dbData1?.length ? dbData1.map(d => ({ date: d.period_start, value: Number(d.value) }))
      : generateMockData(kpi1, months);
    const data2 = dbData2?.length ? dbData2.map(d => ({ date: d.period_start, value: Number(d.value) }))
      : generateMockData(kpi2, months);
    
    // Create a map of all dates
    const dateMap = new Map<string, CompareDataPoint>();
    
    data1.forEach(d => {
      const dateKey = d.date.substring(0, 7); // YYYY-MM format
      dateMap.set(dateKey, {
        date: d.date,
        formattedDate: format(parseISO(d.date), 'MMM yyyy', { locale: sv }),
        value1: d.value,
        value2: 0,
      });
    });
    
    data2.forEach(d => {
      const dateKey = d.date.substring(0, 7);
      const existing = dateMap.get(dateKey);
      if (existing) {
        existing.value2 = d.value;
      } else {
        dateMap.set(dateKey, {
          date: d.date,
          formattedDate: format(parseISO(d.date), 'MMM yyyy', { locale: sv }),
          value1: 0,
          value2: d.value,
        });
      }
    });
    
    // Sort by date and filter out incomplete data points
    const sortedData = Array.from(dateMap.values())
      .filter(d => d.value1 > 0 && d.value2 > 0)
      .sort((a, b) => a.date.localeCompare(b.date));
    
    // Normalize values for comparison (percentage of first value)
    if (sortedData.length > 0) {
      const base1 = sortedData[0].value1;
      const base2 = sortedData[0].value2;
      sortedData.forEach(d => {
        d.normalized1 = (d.value1 / base1) * 100;
        d.normalized2 = (d.value2 / base2) * 100;
      });
    }
    
    return sortedData;
  }, [dbData1, dbData2, kpi1, kpi2, months]);
  
  // Calculate correlation coefficient
  const correlation = useMemo(() => {
    if (compareData.length < 3) return null;
    
    const n = compareData.length;
    const sumX = compareData.reduce((s, d) => s + d.value1, 0);
    const sumY = compareData.reduce((s, d) => s + d.value2, 0);
    const sumXY = compareData.reduce((s, d) => s + d.value1 * d.value2, 0);
    const sumX2 = compareData.reduce((s, d) => s + d.value1 * d.value1, 0);
    const sumY2 = compareData.reduce((s, d) => s + d.value2 * d.value2, 0);
    
    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    
    if (denominator === 0) return 0;
    return numerator / denominator;
  }, [compareData]);
  
  // Determine if units are comparable
  const sameUnit = kpi1.unit === kpi2.unit;
  
  return (
    <div className="space-y-3 rounded-lg border border-primary/30 bg-primary/5 p-3">
      {/* Compare header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Equal className="h-4 w-4 text-primary" />
          <h4 className="text-xs font-medium text-foreground">Jämförelse</h4>
        </div>
        <button
          onClick={onRemoveCompare}
          className="rounded-sm p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          title="Ta bort jämförelse"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      
      {/* KPI labels */}
      <div className="flex items-center gap-2 text-xs">
        <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-primary/10">
          <div className="h-2 w-2 rounded-full bg-primary" />
          <span className="font-medium text-foreground">{kpi1.name}</span>
          <span className="text-muted-foreground">({kpi1.unit})</span>
        </div>
        <ArrowRight className="h-3 w-3 text-muted-foreground" />
        <div className="flex items-center gap-1.5 px-2 py-1 rounded" style={{ backgroundColor: 'hsl(var(--chart-2) / 0.1)' }}>
          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: 'hsl(var(--chart-2))' }} />
          <span className="font-medium text-foreground">{kpi2.name}</span>
          <span className="text-muted-foreground">({kpi2.unit})</span>
        </div>
      </div>
      
      {/* Chart */}
      <div className="h-48 bg-card rounded-lg border border-border p-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={compareData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis 
              dataKey="formattedDate" 
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              tickLine={false}
              interval="preserveStartEnd"
            />
            {sameUnit ? (
              <YAxis 
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false}
                tickLine={false}
                width={45}
                tickFormatter={(value) => value.toLocaleString('sv-SE')}
              />
            ) : (
              <>
                <YAxis 
                  yAxisId="left"
                  tick={{ fontSize: 10, fill: 'hsl(var(--primary))' }}
                  axisLine={false}
                  tickLine={false}
                  width={45}
                  tickFormatter={(value) => value.toLocaleString('sv-SE')}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 10, fill: 'hsl(var(--chart-2))' }}
                  axisLine={false}
                  tickLine={false}
                  width={45}
                  tickFormatter={(value) => value.toLocaleString('sv-SE')}
                />
              </>
            )}
            <Tooltip content={<CustomTooltip kpi1={kpi1} kpi2={kpi2} />} />
            
            <Line
              type="monotone"
              dataKey="value1"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: 'hsl(var(--primary))' }}
              yAxisId={sameUnit ? undefined : "left"}
            />
            <Line
              type="monotone"
              dataKey="value2"
              stroke="hsl(var(--chart-2))"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: 'hsl(var(--chart-2))' }}
              yAxisId={sameUnit ? undefined : "right"}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* Comparison stats */}
      <div className="grid grid-cols-2 gap-2">
        {/* KPI 1 stats */}
        <div className="rounded border border-border bg-card p-2 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-medium text-primary">{kpi1.name}</span>
            <StatusBadge status={kpi1.status} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-foreground">
              {kpi1.value.toLocaleString('sv-SE')}
            </span>
            <span className="text-[10px] text-muted-foreground">{kpi1.unit}</span>
          </div>
          <div className="flex items-center gap-1 text-[10px]">
            {kpi1.trend === 'up' && <TrendingUp className={cn("h-3 w-3", kpi1.inverted ? "text-status-critical" : "text-status-positive")} />}
            {kpi1.trend === 'down' && <TrendingDown className={cn("h-3 w-3", kpi1.inverted ? "text-status-positive" : "text-status-critical")} />}
            {kpi1.trend === 'stable' && <Minus className="h-3 w-3 text-muted-foreground" />}
            <span className={cn(
              kpi1.trendPercent > 0 
                ? (kpi1.inverted ? "text-status-critical" : "text-status-positive")
                : kpi1.trendPercent < 0
                  ? (kpi1.inverted ? "text-status-positive" : "text-status-critical")
                  : "text-muted-foreground"
            )}>
              {kpi1.trendPercent > 0 ? '+' : ''}{kpi1.trendPercent.toFixed(1)}%
            </span>
          </div>
        </div>
        
        {/* KPI 2 stats */}
        <div className="rounded border border-border bg-card p-2 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-medium" style={{ color: 'hsl(var(--chart-2))' }}>{kpi2.name}</span>
            <StatusBadge status={kpi2.status} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-foreground">
              {kpi2.value.toLocaleString('sv-SE')}
            </span>
            <span className="text-[10px] text-muted-foreground">{kpi2.unit}</span>
          </div>
          <div className="flex items-center gap-1 text-[10px]">
            {kpi2.trend === 'up' && <TrendingUp className={cn("h-3 w-3", kpi2.inverted ? "text-status-critical" : "text-status-positive")} />}
            {kpi2.trend === 'down' && <TrendingDown className={cn("h-3 w-3", kpi2.inverted ? "text-status-positive" : "text-status-critical")} />}
            {kpi2.trend === 'stable' && <Minus className="h-3 w-3 text-muted-foreground" />}
            <span className={cn(
              kpi2.trendPercent > 0 
                ? (kpi2.inverted ? "text-status-critical" : "text-status-positive")
                : kpi2.trendPercent < 0
                  ? (kpi2.inverted ? "text-status-positive" : "text-status-critical")
                  : "text-muted-foreground"
            )}>
              {kpi2.trendPercent > 0 ? '+' : ''}{kpi2.trendPercent.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
      
      {/* Correlation indicator */}
      {correlation !== null && (
        <div className="flex items-center justify-between rounded bg-muted/50 px-3 py-2">
          <span className="text-xs text-muted-foreground">Korrelation</span>
          <div className="flex items-center gap-2">
            <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className={cn(
                  "h-full rounded-full transition-all",
                  Math.abs(correlation) > 0.7 ? "bg-status-positive" :
                  Math.abs(correlation) > 0.4 ? "bg-status-warning" :
                  "bg-muted-foreground"
                )}
                style={{ 
                  width: `${Math.abs(correlation) * 100}%`,
                  marginLeft: correlation < 0 ? 'auto' : 0
                }}
              />
            </div>
            <span className={cn(
              "text-sm font-bold min-w-[50px] text-right",
              Math.abs(correlation) > 0.7 ? "text-status-positive" :
              Math.abs(correlation) > 0.4 ? "text-status-warning" :
              "text-muted-foreground"
            )}>
              {correlation > 0 ? '+' : ''}{correlation.toFixed(2)}
            </span>
          </div>
        </div>
      )}
      
      {/* Interpretation */}
      {correlation !== null && (
        <p className="text-[10px] text-muted-foreground">
          {Math.abs(correlation) > 0.7 
            ? `Stark ${correlation > 0 ? 'positiv' : 'negativ'} korrelation – när ${kpi1.name} ${correlation > 0 ? 'ökar' : 'minskar'} tenderar ${kpi2.name} att ${correlation > 0 ? 'öka' : 'minska'}.`
            : Math.abs(correlation) > 0.4
              ? `Måttlig ${correlation > 0 ? 'positiv' : 'negativ'} korrelation mellan indikatorerna.`
              : 'Svag eller ingen observerbar korrelation mellan dessa KPI:er.'
          }
        </p>
      )}
    </div>
  );
}
