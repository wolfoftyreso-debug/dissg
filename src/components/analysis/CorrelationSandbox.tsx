/**
 * BLOCK 5: CORRELATION & SANDBOX ENGINE
 * 
 * "Göra avancerad analys tillgänglig utan feltolkning."
 * 
 * Ingen korrelation visas utan:
 * - "What we see"
 * - "What this does not say"
 * - "Other factors changing"
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Skeleton } from '@/components/ui/skeleton';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Info,
  XCircle,
  ArrowRight,
  Shuffle,
  Clock,
  Users,
  BarChart2,
  Database,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SystemBreadcrumbs } from '@/components/navigation';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

// === TYPES ===

interface Indicator {
  id: string;
  code: string;
  name: string;
  category: string;
  unit: string;
  isInverted?: boolean;
}

interface DataPoint {
  period: string;
  year: number;
  [key: string]: string | number;
}

interface CorrelationResult {
  coefficient: number;
  pValue: number;
  sampleSize: number;
  timeLagMonths: number;
  isSignificant: boolean;
  strength: 'none' | 'weak' | 'moderate' | 'strong' | 'very_strong';
}

interface CorrelationWarning {
  type: 'time' | 'sample' | 'extreme' | 'causation' | 'confounding' | 'data';
  severity: 'info' | 'warning' | 'critical';
  message: string;
  messageSv: string;
}

// === FETCH INDICATORS FROM DATABASE ===

const fetchIndicators = async (): Promise<Indicator[]> => {
  const { data, error } = await supabase
    .from('kpi_definitions')
    .select('id, code, name, category, unit')
    .eq('is_active', true)
    .order('category', { ascending: true });

  if (error) throw error;

  return (data || []).map(kpi => ({
    id: kpi.id,
    code: kpi.code,
    name: kpi.name,
    category: kpi.category,
    unit: kpi.unit || '',
    isInverted: kpi.code.includes('mortality') || kpi.code.includes('crime') || kpi.code.includes('exclusion'),
  }));
};

// === FETCH TIME SERIES DATA ===

const fetchTimeSeriesData = async (
  kpiIdA: string,
  kpiIdB: string
): Promise<{ dataA: { period: string; value: number }[]; dataB: { period: string; value: number }[] }> => {
  const [resultA, resultB] = await Promise.all([
    supabase
      .from('kpi_values')
      .select('period_start, value')
      .eq('kpi_id', kpiIdA)
      .order('period_start', { ascending: true }),
    supabase
      .from('kpi_values')
      .select('period_start, value')
      .eq('kpi_id', kpiIdB)
      .order('period_start', { ascending: true }),
  ]);

  if (resultA.error) throw resultA.error;
  if (resultB.error) throw resultB.error;

  return {
    dataA: (resultA.data || []).map(row => ({
      period: row.period_start,
      value: Number(row.value),
    })),
    dataB: (resultB.data || []).map(row => ({
      period: row.period_start,
      value: Number(row.value),
    })),
  };
};

// === CORRELATION CALCULATOR ===

const calculateCorrelation = (
  data1: number[], 
  data2: number[]
): CorrelationResult => {
  const n = Math.min(data1.length, data2.length);
  if (n < 3) {
    return { coefficient: 0, pValue: 1, sampleSize: n, timeLagMonths: 0, isSignificant: false, strength: 'none' };
  }

  const mean1 = data1.reduce((a, b) => a + b, 0) / n;
  const mean2 = data2.reduce((a, b) => a + b, 0) / n;

  let numerator = 0;
  let denom1 = 0;
  let denom2 = 0;

  for (let i = 0; i < n; i++) {
    const diff1 = data1[i] - mean1;
    const diff2 = data2[i] - mean2;
    numerator += diff1 * diff2;
    denom1 += diff1 * diff1;
    denom2 += diff2 * diff2;
  }

  const coefficient = denom1 === 0 || denom2 === 0 
    ? 0 
    : numerator / Math.sqrt(denom1 * denom2);

  // Approximate p-value (simplified t-test)
  const tStat = coefficient * Math.sqrt((n - 2) / (1 - coefficient * coefficient + 0.0001));
  const pValue = Math.min(1, Math.max(0, 2 * (1 - Math.min(0.99, Math.abs(tStat) / (Math.abs(tStat) + n)))));

  const absCoeff = Math.abs(coefficient);
  const strength = 
    absCoeff < 0.2 ? 'none' :
    absCoeff < 0.4 ? 'weak' :
    absCoeff < 0.6 ? 'moderate' :
    absCoeff < 0.8 ? 'strong' : 'very_strong';

  return {
    coefficient,
    pValue,
    sampleSize: n,
    timeLagMonths: 0,
    isSignificant: pValue < 0.05 && n >= 5,
    strength
  };
};

// === WARNING GENERATOR ===

const generateWarnings = (
  result: CorrelationResult,
  dataPointCount: number
): CorrelationWarning[] => {
  const warnings: CorrelationWarning[] = [];
  
  // Check data availability
  if (dataPointCount === 0) {
    warnings.push({
      type: 'data',
      severity: 'critical',
      message: 'No overlapping data points found',
      messageSv: 'Inga överlappande datapunkter hittades'
    });
    return warnings;
  }

  if (dataPointCount < 5) {
    warnings.push({
      type: 'sample',
      severity: 'critical',
      message: `Very few data points (n=${dataPointCount}) - results unreliable`,
      messageSv: `Mycket få datapunkter (n=${dataPointCount}) – resultaten är opålitliga`
    });
  } else if (dataPointCount < 10) {
    warnings.push({
      type: 'sample',
      severity: 'warning',
      message: `Small sample size (n=${dataPointCount}) increases uncertainty`,
      messageSv: `Litet urval (n=${dataPointCount}) ökar osäkerheten`
    });
  }

  // Always add causation warning
  warnings.push({
    type: 'causation',
    severity: 'info',
    message: 'Correlation does not imply causation',
    messageSv: 'Korrelation innebär inte orsakssamband'
  });

  // Add confounding warning if strong correlation
  if (result.strength === 'strong' || result.strength === 'very_strong') {
    warnings.push({
      type: 'confounding',
      severity: 'warning',
      message: 'Strong correlations may be driven by hidden third variables',
      messageSv: 'Starka korrelationer kan drivas av dolda tredje variabler'
    });
  }

  return warnings;
};

// === CATEGORY LABELS ===

const categoryLabels: Record<string, string> = {
  demografi_halsa: 'Demografi & Hälsa',
  arbete_produktivitet: 'Arbete & Produktivitet',
  ekonomisk_barkraft: 'Ekonomisk Bärkraft',
  social_stabilitet: 'Social Stabilitet',
  systemrisk_styrning: 'Systemrisk & Styrning',
  infrastruktur: 'Infrastruktur',
  karnsystem_funktion: 'Kärnsystem',
};

// === MAIN COMPONENT ===

export const CorrelationSandbox: React.FC = () => {
  const [indicatorA, setIndicatorA] = useState<Indicator | null>(null);
  const [indicatorB, setIndicatorB] = useState<Indicator | null>(null);

  // Fetch available indicators from database
  const { data: indicators, isLoading: loadingIndicators, error: indicatorsError } = useQuery({
    queryKey: ['correlation-indicators'],
    queryFn: fetchIndicators,
  });

  // Fetch time series when both indicators are selected
  const { data: timeSeriesData, isLoading: loadingTimeSeries, error: timeSeriesError } = useQuery({
    queryKey: ['correlation-timeseries', indicatorA?.id, indicatorB?.id],
    queryFn: () => fetchTimeSeriesData(indicatorA!.id, indicatorB!.id),
    enabled: !!indicatorA && !!indicatorB,
  });

  // Calculate correlation result
  const { chartData, result, warnings, otherFactors } = useMemo(() => {
    if (!indicatorA || !indicatorB || !timeSeriesData) {
      return { chartData: [], result: null, warnings: [], otherFactors: [] };
    }

    const { dataA, dataB } = timeSeriesData;

    // Create a map of periods to values
    const mapA = new Map(dataA.map(d => [d.period, d.value]));
    const mapB = new Map(dataB.map(d => [d.period, d.value]));

    // Find overlapping periods
    const allPeriods = new Set([...mapA.keys(), ...mapB.keys()]);
    const merged: DataPoint[] = [];

    for (const period of allPeriods) {
      if (mapA.has(period) && mapB.has(period)) {
        const year = new Date(period).getFullYear();
        merged.push({
          period,
          year,
          [indicatorA.code]: mapA.get(period)!,
          [indicatorB.code]: mapB.get(period)!,
        });
      }
    }

    // Sort by period
    merged.sort((a, b) => a.period.localeCompare(b.period));

    if (merged.length === 0) {
      return { 
        chartData: [], 
        result: null, 
        warnings: [{ 
          type: 'data' as const, 
          severity: 'critical' as const, 
          message: 'No overlapping data', 
          messageSv: 'Inga överlappande data' 
        }], 
        otherFactors: [] 
      };
    }

    const values1 = merged.map(d => d[indicatorA.code] as number);
    const values2 = merged.map(d => d[indicatorB.code] as number);

    const corr = calculateCorrelation(values1, values2);
    const warns = generateWarnings(corr, merged.length);

    // Suggest other factors
    const others = (indicators || [])
      .filter(i => i.id !== indicatorA.id && i.id !== indicatorB.id)
      .slice(0, 3)
      .map(i => i.name);

    return { chartData: merged, result: corr, warnings: warns, otherFactors: others };
  }, [indicatorA, indicatorB, timeSeriesData, indicators]);

  const strengthLabels = {
    none: { sv: 'Ingen', color: 'text-muted-foreground' },
    weak: { sv: 'Svag', color: 'text-muted-foreground' },
    moderate: { sv: 'Måttlig', color: 'text-status-warning' },
    strong: { sv: 'Stark', color: 'text-primary' },
    very_strong: { sv: 'Mycket stark', color: 'text-status-critical' }
  };

  // Group indicators by category
  const groupedIndicators = useMemo(() => {
    if (!indicators) return {};
    return indicators.reduce((acc, ind) => {
      const cat = ind.category;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(ind);
      return acc;
    }, {} as Record<string, Indicator[]>);
  }, [indicators]);

  return (
    <div className="p-4 max-w-5xl mx-auto space-y-4">
      <SystemBreadcrumbs
        items={[
          { id: 'world', label: 'World', labelSv: 'Världen', level: 'world', href: '/' },
          { id: 'analysis', label: 'Analysis', labelSv: 'Analys', level: 'indicator' },
          { id: 'sandbox', label: 'Correlation Sandbox', labelSv: 'Korrelationssandbox', level: 'method' }
        ]}
      />

      <div className="text-center space-y-2 mb-6">
        <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
          <Shuffle className="h-6 w-6" />
          Korrelationssandbox
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Utforska samband mellan indikatorer – med tydliga varningar mot övertolkning.
        </p>
        <Badge variant="outline" className="text-xs">
          <Database className="h-3 w-3 mr-1" />
          Live data från databasen
        </Badge>
      </div>

      {/* Error states */}
      {indicatorsError && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Kunde inte hämta indikatorer: {(indicatorsError as Error).message}
          </AlertDescription>
        </Alert>
      )}

      {/* Indicator Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Välj indikatorer att jämföra</CardTitle>
          <CardDescription>
            Data hämtas direkt från databasen
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingIndicators ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex-1 min-w-48">
                <label className="text-xs text-muted-foreground mb-1 block">Indikator A</label>
                <Select 
                  value={indicatorA?.id || ''} 
                  onValueChange={(v) => setIndicatorA(indicators?.find(i => i.id === v) || null)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Välj indikator..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-80">
                    {Object.entries(groupedIndicators).map(([category, items]) => (
                      <div key={category}>
                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-muted/50">
                          {categoryLabels[category] || category}
                        </div>
                        {items.map(ind => (
                          <SelectItem key={ind.id} value={ind.id}>
                            <span className="flex items-center gap-2">
                              {ind.name}
                              <span className="text-xs text-muted-foreground">({ind.unit})</span>
                            </span>
                          </SelectItem>
                        ))}
                      </div>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <ArrowRight className="h-5 w-5 text-muted-foreground hidden sm:block" />

              <div className="flex-1 min-w-48">
                <label className="text-xs text-muted-foreground mb-1 block">Indikator B</label>
                <Select 
                  value={indicatorB?.id || ''} 
                  onValueChange={(v) => setIndicatorB(indicators?.find(i => i.id === v) || null)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Välj indikator..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-80">
                    {Object.entries(groupedIndicators).map(([category, items]) => (
                      <div key={category}>
                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-muted/50">
                          {categoryLabels[category] || category}
                        </div>
                        {items.filter(i => i.id !== indicatorA?.id).map(ind => (
                          <SelectItem key={ind.id} value={ind.id}>
                            <span className="flex items-center gap-2">
                              {ind.name}
                              <span className="text-xs text-muted-foreground">({ind.unit})</span>
                            </span>
                          </SelectItem>
                        ))}
                      </div>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Loading state for time series */}
      {loadingTimeSeries && indicatorA && indicatorB && (
        <Card>
          <CardContent className="py-12 flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Hämtar tidsseriedata...</p>
          </CardContent>
        </Card>
      )}

      {/* Time series error */}
      {timeSeriesError && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Kunde inte hämta tidsseriedata: {(timeSeriesError as Error).message}
          </AlertDescription>
        </Alert>
      )}

      {/* Results */}
      {indicatorA && indicatorB && result && chartData.length > 0 && (
        <>
          {/* Data info */}
          <Alert>
            <Database className="h-4 w-4" />
            <AlertDescription>
              Visar {chartData.length} överlappande datapunkter från{' '}
              {chartData[0]?.period.substring(0, 7)} till{' '}
              {chartData[chartData.length - 1]?.period.substring(0, 7)}
            </AlertDescription>
          </Alert>

          {/* Chart */}
          <Card>
            <CardContent className="pt-4">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="period" 
                    tick={{ fontSize: 12 }} 
                    tickFormatter={(v) => v.substring(0, 7)}
                  />
                  <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))' 
                    }}
                    labelFormatter={(v) => `Period: ${v}`}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey={indicatorA.code}
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={chartData.length < 20}
                    name={indicatorA.name}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey={indicatorB.code}
                    stroke="hsl(var(--status-warning))"
                    strokeWidth={2}
                    dot={chartData.length < 20}
                    name={indicatorB.name}
                  />
                </LineChart>
              </ResponsiveContainer>

              <div className="flex justify-center gap-6 mt-2 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-0.5 bg-primary" />
                  <span>{indicatorA.name} ({indicatorA.unit})</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-0.5 bg-status-warning" />
                  <span>{indicatorB.name} ({indicatorB.unit})</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Correlation Result */}
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <BarChart2 className="h-4 w-4" />
                Vad vi ser
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold font-data">
                    r = {result.coefficient.toFixed(3)}
                  </div>
                  <div className={cn("text-sm", strengthLabels[result.strength].color)}>
                    {strengthLabels[result.strength].sv} korrelation
                    {result.coefficient < 0 && ' (negativ)'}
                  </div>
                </div>
                <div className="text-right text-sm">
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span className="font-data">n = {result.sampleSize}</span>
                  </div>
                  <div className="text-muted-foreground">
                    p ≈ {result.pValue.toFixed(3)}
                    {result.isSignificant && (
                      <Badge variant="outline" className="ml-1 text-xs">Signifikant</Badge>
                    )}
                  </div>
                </div>
              </div>

              <p className="text-sm">
                Under den observerade perioden
                {result.coefficient > 0 
                  ? ` tenderar ${indicatorA.name} och ${indicatorB.name} att röra sig i samma riktning.`
                  : result.coefficient < 0
                  ? ` tenderar ${indicatorA.name} och ${indicatorB.name} att röra sig i motsatt riktning.`
                  : ` syns inget tydligt samband mellan ${indicatorA.name} och ${indicatorB.name}.`
                }
              </p>
            </CardContent>
          </Card>

          {/* Warnings */}
          {warnings.length > 0 && (
            <Card className="bg-status-warning/5 border-status-warning/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-status-warning" />
                  Automatiska varningar
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {warnings.map((w, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "flex items-start gap-2 text-sm p-2 rounded-sm",
                      w.severity === 'critical' && "bg-status-critical/10",
                      w.severity === 'warning' && "bg-status-warning/10",
                      w.severity === 'info' && "bg-muted"
                    )}
                  >
                    {w.severity === 'critical' ? (
                      <XCircle className="h-4 w-4 text-status-critical mt-0.5" />
                    ) : w.severity === 'warning' ? (
                      <AlertTriangle className="h-4 w-4 text-status-warning mt-0.5" />
                    ) : (
                      <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
                    )}
                    <span>{w.messageSv}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* What this does NOT show */}
          <Card className="border-status-critical/30 bg-status-critical/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2 text-status-critical">
                <XCircle className="h-4 w-4" />
                Vad detta INTE visar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-status-critical">•</span>
                  <span>Att det ena <strong>orsakar</strong> det andra (kausalitet)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-status-critical">•</span>
                  <span>Att sambandet gäller i alla regioner eller tidsperioder</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-status-critical">•</span>
                  <span>Att det inte finns andra variabler som driver båda (störfaktorer)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-status-critical">•</span>
                  <span>Styrkan i eventuellt orsakssamband</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Other factors */}
          {otherFactors.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Andra faktorer som kan påverka
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {otherFactors.map((factor, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {factor}
                    </Badge>
                  ))}
                  <Badge variant="secondary" className="text-xs">
                    + fler möjliga konfundrar...
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* No data state */}
      {indicatorA && indicatorB && !loadingTimeSeries && chartData.length === 0 && timeSeriesData && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Inga överlappande datapunkter hittades för de valda indikatorerna.
            Prova att välja andra indikatorer.
          </AlertDescription>
        </Alert>
      )}

      {/* Empty state */}
      {!indicatorA && !indicatorB && !loadingIndicators && (
        <Card className="bg-muted/30">
          <CardContent className="py-12 text-center">
            <Shuffle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-medium mb-2">Välj två indikatorer</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Välj indikatorer ovan för att utforska korrelationer baserat på 
              verklig data från databasen.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CorrelationSandbox;
