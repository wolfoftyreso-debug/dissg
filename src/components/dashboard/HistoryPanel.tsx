import { useState, useMemo } from 'react';
import { KPI } from '@/types/kpi';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { 
  Calendar,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronDown,
  Info,
  GitCompare
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  Line, 
  XAxis, 
  YAxis, 
  ResponsiveContainer, 
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Area,
  ComposedChart,
  Brush
} from 'recharts';
import { format, subMonths, parseISO } from 'date-fns';
import { sv } from 'date-fns/locale';
import { KPICompareSelector } from './KPICompareSelector';
import { KPICompareChart } from './KPICompareChart';

interface HistoryPanelProps {
  kpi: KPI;
}

type TimeRange = '6m' | '1y' | '2y' | '5y' | 'all';

interface HistoricalDataPoint {
  date: string;
  value: number;
  formattedDate: string;
  trend?: 'up' | 'down' | 'stable';
  isProvisional?: boolean;
}

// NO MOCK DATA GENERATION - System principle: "Silence over speculation"
// Historical data comes ONLY from verified kpi_values table

const TIME_RANGES: { value: TimeRange; label: string; months: number }[] = [
  { value: '6m', label: '6 mån', months: 6 },
  { value: '1y', label: '1 år', months: 12 },
  { value: '2y', label: '2 år', months: 24 },
  { value: '5y', label: '5 år', months: 60 },
  { value: 'all', label: 'Allt', months: 120 },
];

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null;
  
  const data = payload[0].payload as HistoricalDataPoint;
  
  return (
    <div className="rounded-lg border border-border bg-card p-2 shadow-lg">
      <p className="text-xs font-medium text-foreground">{data.formattedDate}</p>
      <p className="text-sm font-bold text-primary">
        {data.value.toLocaleString('sv-SE')}
      </p>
      {data.isProvisional && (
        <p className="text-[10px] text-status-warning">Preliminärt värde</p>
      )}
      <div className="mt-1 flex items-center gap-1">
        {data.trend === 'up' && <TrendingUp className="h-3 w-3 text-status-positive" />}
        {data.trend === 'down' && <TrendingDown className="h-3 w-3 text-status-critical" />}
        {data.trend === 'stable' && <Minus className="h-3 w-3 text-muted-foreground" />}
        <span className="text-[10px] text-muted-foreground">
          {data.trend === 'up' ? 'Ökning' : data.trend === 'down' ? 'Minskning' : 'Stabil'}
        </span>
      </div>
    </div>
  );
}

export function HistoryPanel({ kpi }: HistoryPanelProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('2y');
  const [showDetails, setShowDetails] = useState(false);
  const [showCompareSelector, setShowCompareSelector] = useState(false);
  const [compareKPI, setCompareKPI] = useState<KPI | null>(null);
  
  const months = TIME_RANGES.find(r => r.value === timeRange)?.months || 24;
  
  // Fetch real historical data from database
  const { data: dbData, isLoading } = useQuery({
    queryKey: ['kpi-history', kpi.id, timeRange],
    queryFn: async () => {
      const startDate = format(subMonths(new Date(), months), 'yyyy-MM-dd');
      
      const { data, error } = await supabase
        .from('kpi_values')
        .select('*')
        .eq('kpi_id', kpi.id)
        .gte('period_start', startDate)
        .order('period_start', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });
  
  // Use ONLY real verified data - no mock/simulated data
  const historicalData = useMemo(() => {
    if (dbData && dbData.length > 0) {
      return dbData.map((row, idx, arr) => {
        const prevValue = idx > 0 ? arr[idx - 1].value : row.value;
        const value = Number(row.value);
        const trend = value > Number(prevValue) * 1.01 ? 'up' : 
                      value < Number(prevValue) * 0.99 ? 'down' : 'stable';
        
        return {
          date: row.period_start,
          value,
          formattedDate: format(parseISO(row.period_start), 'MMM yyyy', { locale: sv }),
          trend: trend as 'up' | 'down' | 'stable',
          isProvisional: row.is_provisional,
        };
      });
    }
    
    // NO MOCK DATA - return empty array when real data unavailable
    return [];
  }, [dbData]);
  
  // Flag for when we have no verified data
  const hasVerifiedData = historicalData.length > 0;
  
  // Calculate statistics
  const stats = useMemo(() => {
    if (historicalData.length === 0) return null;
    
    const values = historicalData.map(d => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const first = values[0];
    const last = values[values.length - 1];
    const change = ((last - first) / first) * 100;
    
    // Calculate volatility (standard deviation)
    const variance = values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / values.length;
    const volatility = Math.sqrt(variance);
    
    return {
      min,
      max,
      avg,
      change,
      volatility,
      dataPoints: historicalData.length,
    };
  }, [historicalData]);
  
  const isUsingMockData = !dbData || dbData.length === 0;
  
  const handleSelectCompareKPI = (selectedKPI: KPI) => {
    setCompareKPI(selectedKPI);
    setShowCompareSelector(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground flex items-center gap-2">
          <Calendar className="h-3.5 w-3.5" />
          Historik
        </h3>
        <div className="flex items-center gap-2">
          {/* Compare button */}
          <button
            onClick={() => setShowCompareSelector(!showCompareSelector)}
            className={cn(
              "flex items-center gap-1.5 px-2 py-1 text-[10px] font-medium rounded transition-colors border",
              showCompareSelector || compareKPI
                ? "bg-primary text-primary-foreground border-primary"
                : "text-muted-foreground hover:text-foreground border-border bg-muted/50 hover:bg-muted"
            )}
          >
            <GitCompare className="h-3 w-3" />
            {compareKPI ? 'Byt KPI' : 'Jämför'}
          </button>
          
          {/* Time range selector */}
          <div className="flex rounded-md border border-border bg-muted/50 p-0.5">
            {TIME_RANGES.map((range) => (
              <button
                key={range.value}
                onClick={() => setTimeRange(range.value)}
                className={cn(
                  "px-2 py-1 text-[10px] font-medium rounded transition-colors",
                  timeRange === range.value
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Compare KPI selector */}
      {showCompareSelector && (
        <KPICompareSelector
          currentKPI={kpi}
          onSelect={handleSelectCompareKPI}
          onCancel={() => setShowCompareSelector(false)}
        />
      )}
      
      {/* Compare chart */}
      {compareKPI && !showCompareSelector && (
        <KPICompareChart
          kpi1={kpi}
          kpi2={compareKPI}
          months={months}
          onRemoveCompare={() => setCompareKPI(null)}
        />
      )}
      
      {/* Data source status */}
      {isUsingMockData && (
        <div className="flex items-center gap-2 rounded border border-amber-500/30 bg-amber-500/10 px-2 py-1.5">
          <Info className="h-3 w-3 text-amber-600" />
          <p className="text-[10px] text-amber-700 dark:text-amber-400 font-medium">
            [DATA SAKNAS] Inga verifierade datakällor anslutna för denna indikator.
          </p>
        </div>
      )}
      
      {/* Main chart */}
      <div className="rounded-lg border border-border bg-card p-3">
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={historicalData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
              <defs>
                <linearGradient id={`gradient-${kpi.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="hsl(var(--border))" 
                vertical={false}
              />
              <XAxis 
                dataKey="formattedDate" 
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis 
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false}
                tickLine={false}
                width={40}
                domain={['auto', 'auto']}
                tickFormatter={(value) => value.toLocaleString('sv-SE')}
              />
              <Tooltip content={<CustomTooltip />} />
              
              {/* Average reference line */}
              {stats && (
                <ReferenceLine 
                  y={stats.avg} 
                  stroke="hsl(var(--muted-foreground))" 
                  strokeDasharray="5 5"
                  strokeOpacity={0.5}
                />
              )}
              
              {/* Area fill */}
              <Area
                type="monotone"
                dataKey="value"
                stroke="none"
                fill={`url(#gradient-${kpi.id})`}
              />
              
              {/* Main line */}
              <Line
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={(props: any) => {
                  const { cx, cy, payload } = props;
                  if (payload.isProvisional) {
                    return (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={4}
                        fill="hsl(var(--status-warning))"
                        stroke="hsl(var(--background))"
                        strokeWidth={2}
                      />
                    );
                  }
                  return null;
                }}
                activeDot={{ r: 4, fill: 'hsl(var(--primary))' }}
              />
              
              {/* Brush for zooming on larger datasets */}
              {historicalData.length > 24 && (
                <Brush 
                  dataKey="formattedDate" 
                  height={20} 
                  stroke="hsl(var(--border))"
                  fill="hsl(var(--muted))"
                  tickFormatter={() => ''}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend */}
        <div className="mt-2 flex items-center justify-center gap-4 text-[10px]">
          <div className="flex items-center gap-1">
            <div className="h-0.5 w-3 bg-primary" />
            <span className="text-muted-foreground">Värde</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-0.5 w-3 bg-muted-foreground" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 2px, hsl(var(--muted-foreground)) 2px, hsl(var(--muted-foreground)) 4px)' }} />
            <span className="text-muted-foreground">Medelvärde</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-status-warning" />
            <span className="text-muted-foreground">Preliminärt</span>
          </div>
        </div>
      </div>
      
      {/* Statistics summary */}
      {stats && (
        <div className="grid grid-cols-4 gap-2">
          <div className="rounded-lg border border-border bg-card p-2 text-center">
            <p className="text-[10px] text-muted-foreground">Min</p>
            <p className="text-sm font-bold text-foreground">
              {stats.min.toLocaleString('sv-SE', { maximumFractionDigits: 1 })}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-2 text-center">
            <p className="text-[10px] text-muted-foreground">Max</p>
            <p className="text-sm font-bold text-foreground">
              {stats.max.toLocaleString('sv-SE', { maximumFractionDigits: 1 })}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-2 text-center">
            <p className="text-[10px] text-muted-foreground">Medel</p>
            <p className="text-sm font-bold text-foreground">
              {stats.avg.toLocaleString('sv-SE', { maximumFractionDigits: 1 })}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-2 text-center">
            <p className="text-[10px] text-muted-foreground">Förändring</p>
            <p className={cn(
              "text-sm font-bold",
              stats.change > 0 
                ? (kpi.inverted ? 'text-status-critical' : 'text-status-positive')
                : stats.change < 0 
                  ? (kpi.inverted ? 'text-status-positive' : 'text-status-critical')
                  : 'text-muted-foreground'
            )}>
              {stats.change > 0 ? '+' : ''}{stats.change.toFixed(1)}%
            </p>
          </div>
        </div>
      )}
      
      {/* Expandable details */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="flex w-full items-center justify-between rounded-lg border border-border bg-card p-2 text-left hover:bg-muted/50 transition-colors"
      >
        <span className="text-xs font-medium text-foreground">Detaljerad statistik</span>
        <ChevronDown className={cn(
          "h-4 w-4 text-muted-foreground transition-transform",
          showDetails && "rotate-180"
        )} />
      </button>
      
      {showDetails && stats && (
        <div className="rounded-lg border border-border bg-card p-3 space-y-3">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <p className="text-muted-foreground">Datapunkter</p>
              <p className="font-medium text-foreground">{stats.dataPoints} st</p>
            </div>
            <div>
              <p className="text-muted-foreground">Volatilitet</p>
              <p className="font-medium text-foreground">
                ±{stats.volatility.toLocaleString('sv-SE', { maximumFractionDigits: 2 })} {kpi.unit}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Period</p>
              <p className="font-medium text-foreground">
                {historicalData.length > 0 && (
                  <>
                    {historicalData[0].formattedDate} – {historicalData[historicalData.length - 1].formattedDate}
                  </>
                )}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Datakälla</p>
              <p className={cn(
                "font-medium",
                isUsingMockData ? "text-amber-600 dark:text-amber-400" : "text-foreground"
              )}>
                {isUsingMockData ? '—' : 'Verifierad'}
              </p>
            </div>
          </div>
          
          {/* Trend breakdown */}
          <div>
            <p className="text-[10px] font-medium text-muted-foreground mb-2">TRENDFÖRDELNING</p>
            <div className="flex items-center gap-1 h-3 rounded overflow-hidden">
              {(() => {
                const upCount = historicalData.filter(d => d.trend === 'up').length;
                const downCount = historicalData.filter(d => d.trend === 'down').length;
                const stableCount = historicalData.filter(d => d.trend === 'stable').length;
                const total = historicalData.length;
                
                return (
                  <>
                    <div 
                      className="h-full bg-status-positive" 
                      style={{ width: `${(upCount / total) * 100}%` }}
                      title={`Uppåt: ${upCount} perioder`}
                    />
                    <div 
                      className="h-full bg-muted-foreground" 
                      style={{ width: `${(stableCount / total) * 100}%` }}
                      title={`Stabil: ${stableCount} perioder`}
                    />
                    <div 
                      className="h-full bg-status-critical" 
                      style={{ width: `${(downCount / total) * 100}%` }}
                      title={`Nedåt: ${downCount} perioder`}
                    />
                  </>
                );
              })()}
            </div>
            <div className="flex justify-between mt-1 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-status-positive" />
                Uppåt
              </span>
              <span className="flex items-center gap-1">
                <Minus className="h-3 w-3" />
                Stabil
              </span>
              <span className="flex items-center gap-1">
                <TrendingDown className="h-3 w-3 text-status-critical" />
                Nedåt
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
