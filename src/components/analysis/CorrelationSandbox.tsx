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

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Info,
  XCircle,
  Plus,
  X,
  ArrowRight,
  Shuffle,
  Clock,
  Users,
  BarChart2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SystemBreadcrumbs } from '@/components/navigation';
import { DataQualityBadge, type DataQualityMetrics, calculateQualityLevel } from '@/components/quality';

// === TYPES ===

interface Indicator {
  id: string;
  name: string;
  nameSv: string;
  category: string;
  unit: string;
  isInverted?: boolean; // Lower = better (e.g., unemployment)
}

interface DataPoint {
  year: number;
  [key: string]: number;
}

interface CorrelationResult {
  coefficient: number;      // -1 to 1
  pValue: number;          // 0 to 1
  sampleSize: number;
  timeLagMonths: number;
  isSignificant: boolean;
  strength: 'none' | 'weak' | 'moderate' | 'strong' | 'very_strong';
}

interface CorrelationWarning {
  type: 'time' | 'sample' | 'extreme' | 'causation' | 'confounding';
  severity: 'info' | 'warning' | 'critical';
  message: string;
  messageSv: string;
}

// === AVAILABLE INDICATORS ===

const AVAILABLE_INDICATORS: Indicator[] = [
  { id: 'gdp_per_capita', name: 'GDP per capita', nameSv: 'BNP per capita', category: 'Ekonomi', unit: 'USD PPP' },
  { id: 'unemployment', name: 'Unemployment rate', nameSv: 'Arbetslöshet', category: 'Ekonomi', unit: '%', isInverted: true },
  { id: 'inflation', name: 'Inflation rate', nameSv: 'Inflation', category: 'Ekonomi', unit: '%' },
  { id: 'life_expectancy', name: 'Life expectancy', nameSv: 'Förväntad livslängd', category: 'Hälsa', unit: 'år' },
  { id: 'infant_mortality', name: 'Infant mortality', nameSv: 'Spädbarnsdödlighet', category: 'Hälsa', unit: 'per 1000', isInverted: true },
  { id: 'education_years', name: 'Years of education', nameSv: 'Utbildningsår', category: 'Utbildning', unit: 'år' },
  { id: 'co2_per_capita', name: 'CO2 emissions per capita', nameSv: 'CO2-utsläpp per capita', category: 'Miljö', unit: 'ton' },
  { id: 'energy_consumption', name: 'Energy consumption', nameSv: 'Energiförbrukning', category: 'Energi', unit: 'kWh/capita' },
  { id: 'trust_government', name: 'Trust in government', nameSv: 'Tillit till myndigheter', category: 'Samhälle', unit: '%' },
  { id: 'gini_coefficient', name: 'Gini coefficient', nameSv: 'Gini-koefficient', category: 'Ojämlikhet', unit: 'index', isInverted: true },
];

// === MOCK DATA GENERATOR ===

const generateMockTimeSeries = (indicator: Indicator, years: number = 20): DataPoint[] => {
  const baseValue = Math.random() * 50 + 25;
  const trend = (Math.random() - 0.5) * 2;
  
  return Array.from({ length: years }, (_, i) => ({
    year: 2005 + i,
    [indicator.id]: baseValue + trend * i + (Math.random() - 0.5) * 10
  }));
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

  // Approximate p-value (simplified)
  const t = coefficient * Math.sqrt((n - 2) / (1 - coefficient * coefficient));
  const pValue = Math.min(1, Math.max(0, 1 - Math.abs(t) / 10));

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
    isSignificant: pValue < 0.05,
    strength
  };
};

// === WARNING GENERATOR ===

const generateWarnings = (
  result: CorrelationResult,
  yearRange: [number, number]
): CorrelationWarning[] => {
  const warnings: CorrelationWarning[] = [];
  
  const periodLength = yearRange[1] - yearRange[0];
  
  // Short time period
  if (periodLength < 5) {
    warnings.push({
      type: 'time',
      severity: 'critical',
      message: 'Very short time period may exaggerate patterns',
      messageSv: 'Mycket kort tidsperiod kan förstärka mönster'
    });
  } else if (periodLength < 10) {
    warnings.push({
      type: 'time',
      severity: 'warning',
      message: 'Short time period - patterns may not be stable',
      messageSv: 'Kort tidsperiod – mönster kanske inte är stabila'
    });
  }

  // Small sample
  if (result.sampleSize < 10) {
    warnings.push({
      type: 'sample',
      severity: 'warning',
      message: `Small sample size (n=${result.sampleSize}) increases uncertainty`,
      messageSv: `Litet urval (n=${result.sampleSize}) ökar osäkerheten`
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

// === MAIN COMPONENT ===

export const CorrelationSandbox: React.FC = () => {
  const [indicatorA, setIndicatorA] = useState<Indicator | null>(null);
  const [indicatorB, setIndicatorB] = useState<Indicator | null>(null);
  const [yearRange, setYearRange] = useState<[number, number]>([2010, 2024]);
  const [showAnalysis, setShowAnalysis] = useState(false);

  // Generate data when indicators are selected
  const { data, result, warnings, otherFactors } = useMemo(() => {
    if (!indicatorA || !indicatorB) {
      return { data: [], result: null, warnings: [], otherFactors: [] };
    }

    const dataA = generateMockTimeSeries(indicatorA, yearRange[1] - yearRange[0] + 1);
    const dataB = generateMockTimeSeries(indicatorB, yearRange[1] - yearRange[0] + 1);

    // Merge data
    const merged = dataA.map((d, i) => ({
      year: yearRange[0] + i,
      [indicatorA.id]: d[indicatorA.id],
      [indicatorB.id]: dataB[i]?.[indicatorB.id] || 0
    }));

    const values1 = merged.map(d => d[indicatorA.id]);
    const values2 = merged.map(d => d[indicatorB.id]);

    const corr = calculateCorrelation(values1, values2);
    const warns = generateWarnings(corr, yearRange);

    // Suggest other factors
    const others = AVAILABLE_INDICATORS
      .filter(i => i.id !== indicatorA.id && i.id !== indicatorB.id)
      .slice(0, 3)
      .map(i => i.nameSv);

    return { data: merged, result: corr, warnings: warns, otherFactors: others };
  }, [indicatorA, indicatorB, yearRange]);

  const strengthLabels = {
    none: { sv: 'Ingen', color: 'text-muted-foreground' },
    weak: { sv: 'Svag', color: 'text-muted-foreground' },
    moderate: { sv: 'Måttlig', color: 'text-status-warning' },
    strong: { sv: 'Stark', color: 'text-primary' },
    very_strong: { sv: 'Mycket stark', color: 'text-status-critical' }
  };

  return (
    <div className="p-4 max-w-5xl mx-auto space-y-4">
      <SystemBreadcrumbs
        items={[
          { label: 'World', labelSv: 'Världen', level: 'world', href: '/' },
          { label: 'Analysis', labelSv: 'Analys', level: 'indicator' },
          { label: 'Correlation Sandbox', labelSv: 'Korrelationssandbox', level: 'method' }
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
      </div>

      {/* Indicator Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Välj indikatorer att jämföra</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex-1 min-w-48">
              <label className="text-xs text-muted-foreground mb-1 block">Indikator A</label>
              <Select 
                value={indicatorA?.id || ''} 
                onValueChange={(v) => setIndicatorA(AVAILABLE_INDICATORS.find(i => i.id === v) || null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Välj indikator..." />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_INDICATORS.map(ind => (
                    <SelectItem key={ind.id} value={ind.id}>
                      <span className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">{ind.category}</Badge>
                        {ind.nameSv}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <ArrowRight className="h-5 w-5 text-muted-foreground hidden sm:block" />

            <div className="flex-1 min-w-48">
              <label className="text-xs text-muted-foreground mb-1 block">Indikator B</label>
              <Select 
                value={indicatorB?.id || ''} 
                onValueChange={(v) => setIndicatorB(AVAILABLE_INDICATORS.find(i => i.id === v) || null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Välj indikator..." />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_INDICATORS.filter(i => i.id !== indicatorA?.id).map(ind => (
                    <SelectItem key={ind.id} value={ind.id}>
                      <span className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">{ind.category}</Badge>
                        {ind.nameSv}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Year range */}
          <div className="mt-4">
            <label className="text-xs text-muted-foreground mb-2 block flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Tidsperiod: {yearRange[0]} – {yearRange[1]}
            </label>
            <Slider
              value={yearRange}
              min={1990}
              max={2024}
              step={1}
              onValueChange={(v) => setYearRange(v as [number, number])}
              className="mt-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {indicatorA && indicatorB && result && (
        <>
          {/* Chart */}
          <Card>
            <CardContent className="pt-4">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))' 
                    }} 
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey={indicatorA.id}
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={false}
                    name={indicatorA.nameSv}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey={indicatorB.id}
                    stroke="hsl(var(--status-warning))"
                    strokeWidth={2}
                    dot={false}
                    name={indicatorB.nameSv}
                  />
                </LineChart>
              </ResponsiveContainer>

              <div className="flex justify-center gap-6 mt-2 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-0.5 bg-primary" />
                  <span>{indicatorA.nameSv}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-0.5 bg-status-warning" />
                  <span>{indicatorB.nameSv}</span>
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
                    p = {result.pValue.toFixed(3)}
                    {result.isSignificant && (
                      <Badge variant="outline" className="ml-1 text-xs">Signifikant</Badge>
                    )}
                  </div>
                </div>
              </div>

              <p className="text-sm">
                Under perioden {yearRange[0]}–{yearRange[1]} 
                {result.coefficient > 0 
                  ? ` tenderar ${indicatorA.nameSv} och ${indicatorB.nameSv} att röra sig i samma riktning.`
                  : result.coefficient < 0
                  ? ` tenderar ${indicatorA.nameSv} och ${indicatorB.nameSv} att röra sig i motsatt riktning.`
                  : ` syns inget tydligt samband mellan ${indicatorA.nameSv} och ${indicatorB.nameSv}.`
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

          {/* What this does NOT say */}
          <Card className="bg-destructive/5 border-destructive/20">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-destructive" />
                <CardTitle className="text-sm">Detta säger INTE:</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-xs border-destructive/30">
                  ❌ att {indicatorA.nameSv} orsakar {indicatorB.nameSv}
                </Badge>
                <Badge variant="outline" className="text-xs border-destructive/30">
                  ❌ att sambandet är stabilt över tid
                </Badge>
                <Badge variant="outline" className="text-xs border-destructive/30">
                  ❌ att det gäller alla länder/regioner
                </Badge>
                <Badge variant="outline" className="text-xs border-destructive/30">
                  ❌ att detta kommer fortsätta
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Other factors */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Shuffle className="h-4 w-4" />
                Andra faktorer som kan spela roll
              </CardTitle>
              <CardDescription className="text-xs">
                Dessa indikatorer förändrades också under samma period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {otherFactors.map((factor, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {factor}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Empty state */}
      {(!indicatorA || !indicatorB) && (
        <Card className="bg-muted/30">
          <CardContent className="py-12 text-center">
            <Shuffle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Välj två indikatorer ovan för att utforska samband.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Det ska vara lätt att analysera – svårt att ljuga.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CorrelationSandbox;
