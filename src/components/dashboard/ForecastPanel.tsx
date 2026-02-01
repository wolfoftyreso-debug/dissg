import { useState } from 'react';
import { KPI } from '@/types/kpi';
import { supabase } from '@/integrations/supabase/client';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Clock, 
  Target,
  Loader2,
  ChevronDown,
  ChevronRight,
  Lightbulb,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, ReferenceLine, Area, ComposedChart } from 'recharts';

interface ForecastPanelProps {
  kpi: KPI;
}

interface ForecastData {
  forecast: {
    scenario_baseline: {
      value_3m: number;
      value_6m: number;
      value_12m: number;
      confidence: number;
      description: string;
    };
    scenario_optimistic: {
      value_12m: number;
      probability: number;
      required_actions: string[];
    };
    scenario_pessimistic: {
      value_12m: number;
      probability: number;
      risk_factors: string[];
    };
  };
  status_quo_consequences: {
    summary: string;
    timeline: Array<{ period: string; effect: string }>;
    severity: 'low' | 'medium' | 'high' | 'critical';
    affected_areas: string[];
    cost_of_inaction: string;
  };
  recommended_monitoring: {
    key_indicators: string[];
    warning_threshold: string;
    review_frequency: string;
  };
  uncertainty_factors: string[];
}

const SEVERITY_CONFIG = {
  low: { label: 'Låg', color: 'text-status-positive', bg: 'bg-status-positive/10' },
  medium: { label: 'Medel', color: 'text-status-warning', bg: 'bg-status-warning/12' },
  high: { label: 'Hög', color: 'text-status-critical', bg: 'bg-status-critical/10' },
  critical: { label: 'Kritisk', color: 'text-status-critical', bg: 'bg-status-critical/20' },
};

export function ForecastPanel({ kpi }: ForecastPanelProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>('consequences');

  const generateForecast = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('kpi-forecast', {
        body: { 
          kpi: {
            id: kpi.id,
            name: kpi.name,
            category: kpi.category,
            value: kpi.value,
            unit: kpi.unit,
            trend: kpi.trend,
            trendPercent: kpi.trendPercent,
            status: kpi.status,
            inverted: kpi.inverted,
            rationale: kpi.rationale,
          },
          horizon: '12_months'
        }
      });

      if (fnError) throw fnError;

      if (data?.analysis) {
        setForecast(data.analysis);
      } else {
        throw new Error('Ingen analysdata mottagen');
      }
    } catch (err) {
      console.error('Forecast error:', err);
      setError(err instanceof Error ? err.message : 'Kunde inte generera prognos');
    } finally {
      setIsLoading(false);
    }
  };

  // Generate chart data for forecast visualization
  const generateChartData = () => {
    if (!forecast?.forecast) return [];
    
    const now = kpi.value;
    const baseline = forecast.forecast.scenario_baseline;
    const optimistic = forecast.forecast.scenario_optimistic;
    const pessimistic = forecast.forecast.scenario_pessimistic;

    return [
      { month: 'Nu', baseline: now, optimistic: now, pessimistic: now },
      { month: '3m', baseline: baseline.value_3m, optimistic: baseline.value_3m * 1.05, pessimistic: baseline.value_3m * 0.95 },
      { month: '6m', baseline: baseline.value_6m, optimistic: baseline.value_6m * 1.08, pessimistic: baseline.value_6m * 0.92 },
      { month: '12m', baseline: baseline.value_12m, optimistic: optimistic.value_12m, pessimistic: pessimistic.value_12m },
    ];
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  if (!forecast && !isLoading) {
    return (
      <div className="space-y-3">
        <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Konsekvensanalys (Nivå 3)
        </h3>
        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-primary/10 p-2">
              <Lightbulb className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">
                AI-driven prognosfunktion
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Analyserar trender och visar konsekvenser av status quo över tid.
                Inkluderar scenarioanalys och rekommendationer.
              </p>
              <button
                onClick={generateForecast}
                disabled={isLoading}
                className="mt-3 inline-flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Analyserar...
                  </>
                ) : (
                  <>
                    <TrendingUp className="h-3 w-3" />
                    Generera prognos
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Konsekvensanalys (Nivå 3)
        </h3>
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex flex-col items-center justify-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              Analyserar trender och beräknar prognos...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-3">
        <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Konsekvensanalys (Nivå 3)
        </h3>
        <div className="rounded-lg border border-status-critical/30 bg-status-critical/5 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-status-critical" />
            <div>
              <p className="text-sm font-medium text-status-critical">Fel vid analys</p>
              <p className="mt-1 text-xs text-muted-foreground">{error}</p>
              <button
                onClick={generateForecast}
                className="mt-2 text-xs text-primary hover:underline"
              >
                Försök igen
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!forecast) return null;

  const severity = forecast.status_quo_consequences?.severity || 'medium';
  const severityConfig = SEVERITY_CONFIG[severity] || SEVERITY_CONFIG.medium;
  const chartData = generateChartData();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Konsekvensanalys (Nivå 3)
        </h3>
        <button
          onClick={generateForecast}
          className="text-xs text-primary hover:underline"
        >
          Uppdatera
        </button>
      </div>

      {/* Status Quo Warning Box */}
      <div className={cn(
        'rounded-lg border p-4',
        severity === 'critical' || severity === 'high' 
          ? 'border-status-critical/30 bg-status-critical/5' 
          : 'border-status-warning/30 bg-status-warning/5'
      )}>
        <div className="flex items-start gap-3">
          <AlertTriangle className={cn(
            'h-5 w-5 mt-0.5',
            severity === 'critical' || severity === 'high' 
              ? 'text-status-critical' 
              : 'text-status-warning'
          )} />
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-foreground">
                Vid status quo
              </p>
              <span className={cn(
                'rounded px-1.5 py-0.5 text-[10px] font-medium',
                severityConfig.bg,
                severityConfig.color
              )}>
                {severityConfig.label} risk
              </span>
            </div>
            <p className="mt-1 text-sm text-foreground">
              {forecast.status_quo_consequences?.summary}
            </p>
          </div>
        </div>
      </div>

      {/* Forecast Chart */}
      {chartData.length > 0 && (
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="mb-2 text-xs font-medium text-muted-foreground">PROGNOS 12 MÅNADER</p>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={false}
                  tickLine={false}
                  width={35}
                />
                {/* Pessimistic area */}
                <Area
                  type="monotone"
                  dataKey="pessimistic"
                  fill="hsl(var(--status-critical) / 0.1)"
                  stroke="none"
                />
                {/* Optimistic line */}
                <Line
                  type="monotone"
                  dataKey="optimistic"
                  stroke="hsl(var(--status-positive))"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  dot={false}
                />
                {/* Baseline (main forecast) */}
                <Line
                  type="monotone"
                  dataKey="baseline"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ r: 3, fill: 'hsl(var(--primary))' }}
                />
                {/* Pessimistic line */}
                <Line
                  type="monotone"
                  dataKey="pessimistic"
                  stroke="hsl(var(--status-critical))"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  dot={false}
                />
                <ReferenceLine x="Nu" stroke="hsl(var(--border))" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex items-center justify-center gap-4 text-[10px]">
            <div className="flex items-center gap-1">
              <div className="h-0.5 w-3 bg-primary" />
              <span className="text-muted-foreground">Basscenario</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-0.5 w-3 bg-status-positive" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 2px, hsl(var(--status-positive)) 2px, hsl(var(--status-positive)) 4px)' }} />
              <span className="text-muted-foreground">Optimistiskt</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-0.5 w-3 bg-status-critical" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 2px, hsl(var(--status-critical)) 2px, hsl(var(--status-critical)) 4px)' }} />
              <span className="text-muted-foreground">Pessimistiskt</span>
            </div>
          </div>
        </div>
      )}

      {/* Collapsible sections */}
      <div className="space-y-2">
        {/* Consequences Timeline */}
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <button
            onClick={() => toggleSection('consequences')}
            className="flex w-full items-center justify-between p-3 text-left hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Tidslinje vid inaktivitet</span>
            </div>
            {expandedSection === 'consequences' ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
          {expandedSection === 'consequences' && forecast.status_quo_consequences?.timeline && (
            <div className="border-t border-border px-3 py-2 space-y-2">
              {forecast.status_quo_consequences.timeline.map((item, i) => (
                <div key={i} className="flex items-start gap-3 py-1">
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      'h-2 w-2 rounded-full',
                      i === forecast.status_quo_consequences.timeline.length - 1 
                        ? 'bg-status-critical' 
                        : 'bg-status-warning'
                    )} />
                    {i < forecast.status_quo_consequences.timeline.length - 1 && (
                      <div className="h-full w-0.5 bg-border my-1" style={{ minHeight: '20px' }} />
                    )}
                  </div>
                  <div className="flex-1 pb-2">
                    <p className="text-xs font-medium text-foreground">{item.period}</p>
                    <p className="text-xs text-muted-foreground">{item.effect}</p>
                  </div>
                </div>
              ))}
              {forecast.status_quo_consequences.cost_of_inaction && (
                <div className="mt-2 rounded bg-muted/50 p-2">
                  <p className="text-xs font-medium text-muted-foreground">Kostnad vid inaktivitet:</p>
                  <p className="text-xs text-foreground">{forecast.status_quo_consequences.cost_of_inaction}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Scenarios */}
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <button
            onClick={() => toggleSection('scenarios')}
            className="flex w-full items-center justify-between p-3 text-left hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Scenarioanalys</span>
            </div>
            {expandedSection === 'scenarios' ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
          {expandedSection === 'scenarios' && forecast.forecast && (
            <div className="border-t border-border p-3 space-y-3">
              {/* Baseline */}
              <div className="rounded border border-primary/30 bg-primary/5 p-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-primary">Basscenario</span>
                  <span className="text-xs text-muted-foreground">
                    {forecast.forecast.scenario_baseline.confidence}% säkerhet
                  </span>
                </div>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  {forecast.forecast.scenario_baseline.value_12m} {kpi.unit} om 12 mån
                </p>
                <p className="text-xs text-muted-foreground">
                  {forecast.forecast.scenario_baseline.description}
                </p>
              </div>

              {/* Optimistic */}
              <div className="rounded border border-status-positive/30 bg-status-positive/5 p-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-status-positive" />
                    <span className="text-xs font-medium text-status-positive">Optimistiskt</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {forecast.forecast.scenario_optimistic.probability}% sannolikhet
                  </span>
                </div>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  {forecast.forecast.scenario_optimistic.value_12m} {kpi.unit}
                </p>
                {forecast.forecast.scenario_optimistic.required_actions?.length > 0 && (
                  <div className="mt-1">
                    <p className="text-[10px] font-medium text-muted-foreground">KRÄVER:</p>
                    <ul className="text-xs text-muted-foreground list-disc list-inside">
                      {forecast.forecast.scenario_optimistic.required_actions.map((action, i) => (
                        <li key={i}>{action}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Pessimistic */}
              <div className="rounded border border-status-critical/30 bg-status-critical/5 p-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <XCircle className="h-3 w-3 text-status-critical" />
                    <span className="text-xs font-medium text-status-critical">Pessimistiskt</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {forecast.forecast.scenario_pessimistic.probability}% sannolikhet
                  </span>
                </div>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  {forecast.forecast.scenario_pessimistic.value_12m} {kpi.unit}
                </p>
                {forecast.forecast.scenario_pessimistic.risk_factors?.length > 0 && (
                  <div className="mt-1">
                    <p className="text-[10px] font-medium text-muted-foreground">RISKFAKTORER:</p>
                    <ul className="text-xs text-muted-foreground list-disc list-inside">
                      {forecast.forecast.scenario_pessimistic.risk_factors.map((risk, i) => (
                        <li key={i}>{risk}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Uncertainty Factors */}
        {forecast.uncertainty_factors?.length > 0 && (
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <button
              onClick={() => toggleSection('uncertainty')}
              className="flex w-full items-center justify-between p-3 text-left hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Osäkerhetsfaktorer</span>
              </div>
              {expandedSection === 'uncertainty' ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
            {expandedSection === 'uncertainty' && (
              <div className="border-t border-border px-3 py-2">
                <ul className="space-y-1">
                  {forecast.uncertainty_factors.map((factor, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <span className="text-muted-foreground">•</span>
                      {factor}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
