import { useState } from 'react';
import { KPI } from '@/types/kpi';
import { supabase } from '@/integrations/supabase/client';
import { useLiveForecast, LiveDataPoint } from '@/hooks/useLiveForecast';
import { LiveForecastChart } from './LiveForecastChart';
import { cn } from '@/lib/utils';

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
  const [isLiveMode, setIsLiveMode] = useState(false);
  
  // Use live forecast hook for real-time data
  const liveForecast = useLiveForecast(isLiveMode ? kpi : null, {
    autoRefresh: isLiveMode,
    refreshInterval: 60000, // Refresh every minute
    horizon: '12_months',
  });

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
        // Start live mode after initial forecast
        setIsLiveMode(true);
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

  // Generate chart data for forecast visualization - use live data if available
  const generateChartData = (): LiveDataPoint[] => {
    // Use live data if available
    if (liveForecast.animatedData.length > 0) {
      return liveForecast.animatedData;
    }
    
    if (!forecast?.forecast) return [];
    
    const now = kpi.value;
    const baseline = forecast.forecast.scenario_baseline;
    const optimistic = forecast.forecast.scenario_optimistic;
    const pessimistic = forecast.forecast.scenario_pessimistic;

    // Convert to LiveDataPoint format with interpolated monthly values
    const dataPoints: LiveDataPoint[] = [];
    const months = 12;
    
    for (let i = 0; i <= months; i++) {
      let baselineValue: number;
      let optimisticValue: number;
      let pessimisticValue: number;
      
      if (i === 0) {
        baselineValue = now;
        optimisticValue = now;
        pessimisticValue = now;
      } else if (i <= 3) {
        const t = i / 3;
        baselineValue = now + (baseline.value_3m - now) * t;
        optimisticValue = baselineValue * (1 + 0.02 * t);
        pessimisticValue = baselineValue * (1 - 0.02 * t);
      } else if (i <= 6) {
        const t = (i - 3) / 3;
        baselineValue = baseline.value_3m + (baseline.value_6m - baseline.value_3m) * t;
        optimisticValue = baselineValue * 1.05;
        pessimisticValue = baselineValue * 0.95;
      } else {
        const t = (i - 6) / 6;
        baselineValue = baseline.value_6m + (baseline.value_12m - baseline.value_6m) * t;
        optimisticValue = baseline.value_6m + (optimistic.value_12m - baseline.value_6m) * t;
        pessimisticValue = baseline.value_6m + (pessimistic.value_12m - baseline.value_6m) * t;
      }
      
      dataPoints.push({
        month: i,
        baseline: Math.round(baselineValue * 100) / 100,
        optimistic: Math.round(optimisticValue * 100) / 100,
        pessimistic: Math.round(pessimisticValue * 100) / 100,
        lower_bound: Math.round(pessimisticValue * 0.95 * 100) / 100,
        upper_bound: Math.round(optimisticValue * 1.05 * 100) / 100,
      });
    }
    
    return dataPoints;
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  if (!forecast && !isLoading) {
    return (
      <div className="space-y-3">
        <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground font-mono">
          [KONSEKVENSANALYS] NIVÅ 3
        </h3>
        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <div className="flex items-start gap-3">
            <span className="font-mono text-sm font-bold text-primary">[PROGNOS]</span>
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
                className="mt-3 inline-flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-xs font-mono font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                {isLoading ? '[...] Analyserar' : '[↑] Generera prognos'}
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
        <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground font-mono">
          [KONSEKVENSANALYS] NIVÅ 3
        </h3>
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex flex-col items-center justify-center gap-3">
            <p className="font-mono text-2xl animate-pulse">[...]</p>
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
        <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground font-mono">
          [KONSEKVENSANALYS] NIVÅ 3
        </h3>
        <div className="rounded-lg border border-status-critical/30 bg-status-critical/5 p-4">
          <div className="flex items-start gap-3">
            <span className="font-mono text-sm font-bold text-status-critical">[FEL]</span>
            <div>
              <p className="text-sm font-medium text-status-critical">Fel vid analys</p>
              <p className="mt-1 text-xs text-muted-foreground">{error}</p>
              <button
                onClick={generateForecast}
                className="mt-2 text-xs text-primary hover:underline font-mono"
              >
                [↻] Försök igen
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
        <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground font-mono">
          [KONSEKVENSANALYS] NIVÅ 3
        </h3>
        <button
          onClick={generateForecast}
          className="text-xs text-primary hover:underline font-mono"
        >
          [↻ UPPDATERA]
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
          <span className={cn(
            'font-mono text-sm font-bold mt-0.5',
            severity === 'critical' || severity === 'high' 
              ? 'text-status-critical' 
              : 'text-status-warning'
          )}>
            [!]
          </span>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-foreground">
                Vid status quo
              </p>
              <span className={cn(
                'rounded px-1.5 py-0.5 text-[10px] font-medium font-mono',
                severityConfig.bg,
                severityConfig.color
              )}>
                [{severityConfig.label.toUpperCase()}] RISK
              </span>
            </div>
            <p className="mt-1 text-sm text-foreground">
              {forecast.status_quo_consequences?.summary}
            </p>
          </div>
        </div>
      </div>

      {/* Live Forecast Chart */}
      {chartData.length > 0 && (
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <p className="text-xs font-mono text-muted-foreground">[PROGNOS 12 MÅNADER]</p>
              {isLiveMode && (
                <span className="flex items-center gap-1 text-[10px] font-mono text-status-positive animate-pulse">
                  [LIVE]
                </span>
              )}
            </div>
            {isLiveMode && (
              <button
                onClick={() => liveForecast.refresh()}
                disabled={liveForecast.isLoading}
                className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground hover:text-foreground transition-colors"
              >
                {liveForecast.isLoading ? '[...]' : '[↻]'}
                {liveForecast.lastUpdated ? ` ${Math.round((Date.now() - liveForecast.lastUpdated.getTime()) / 1000)}s` : ''}
              </button>
            )}
          </div>
          <LiveForecastChart 
            data={chartData}
            unit={kpi.unit}
            isLoading={liveForecast.isLoading}
            showConfidenceInterval={true}
            height={140}
          />
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
              <span className="font-mono text-xs text-muted-foreground">[TID]</span>
              <span className="text-sm font-medium">Tidslinje vid inaktivitet</span>
            </div>
            <span className="font-mono text-xs text-muted-foreground">
              {expandedSection === 'consequences' ? '[−]' : '[+]'}
            </span>
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
                    <p className="text-xs font-medium text-foreground font-mono">[{item.period}]</p>
                    <p className="text-xs text-muted-foreground">{item.effect}</p>
                  </div>
                </div>
              ))}
              {forecast.status_quo_consequences.cost_of_inaction && (
                <div className="mt-2 rounded bg-muted/50 p-2">
                  <p className="text-xs font-medium text-muted-foreground font-mono">[KOSTNAD VID INAKTIVITET]</p>
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
              <span className="font-mono text-xs text-muted-foreground">[MÅL]</span>
              <span className="text-sm font-medium">Scenarioanalys</span>
            </div>
            <span className="font-mono text-xs text-muted-foreground">
              {expandedSection === 'scenarios' ? '[−]' : '[+]'}
            </span>
          </button>
          {expandedSection === 'scenarios' && forecast.forecast && (
            <div className="border-t border-border p-3 space-y-3">
              {/* Baseline */}
              <div className="rounded border border-primary/30 bg-primary/5 p-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-primary font-mono">[BAS]</span>
                  <span className="text-xs text-muted-foreground font-mono">
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
                  <span className="text-xs font-medium text-status-positive font-mono">[+] Optimistiskt</span>
                  <span className="text-xs text-muted-foreground font-mono">
                    {forecast.forecast.scenario_optimistic.probability}% sannolikhet
                  </span>
                </div>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  {forecast.forecast.scenario_optimistic.value_12m} {kpi.unit}
                </p>
                {forecast.forecast.scenario_optimistic.required_actions?.length > 0 && (
                  <div className="mt-1">
                    <p className="text-[10px] font-medium text-muted-foreground font-mono">[KRÄVER]</p>
                    <ul className="text-xs text-muted-foreground list-none">
                      {forecast.forecast.scenario_optimistic.required_actions.map((action, i) => (
                        <li key={i} className="flex items-start gap-1">
                          <span className="font-mono text-status-positive">[→]</span> {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Pessimistic */}
              <div className="rounded border border-status-critical/30 bg-status-critical/5 p-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-status-critical font-mono">[−] Pessimistiskt</span>
                  <span className="text-xs text-muted-foreground font-mono">
                    {forecast.forecast.scenario_pessimistic.probability}% sannolikhet
                  </span>
                </div>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  {forecast.forecast.scenario_pessimistic.value_12m} {kpi.unit}
                </p>
                {forecast.forecast.scenario_pessimistic.risk_factors?.length > 0 && (
                  <div className="mt-1">
                    <p className="text-[10px] font-medium text-muted-foreground font-mono">[RISKFAKTORER]</p>
                    <ul className="text-xs text-muted-foreground list-none">
                      {forecast.forecast.scenario_pessimistic.risk_factors.map((factor, i) => (
                        <li key={i} className="flex items-start gap-1">
                          <span className="font-mono text-status-critical">[!]</span> {factor}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Monitoring */}
        {forecast.recommended_monitoring && (
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <button
              onClick={() => toggleSection('monitoring')}
              className="flex w-full items-center justify-between p-3 text-left hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-muted-foreground">[MONITOR]</span>
                <span className="text-sm font-medium">Rekommenderad bevakning</span>
              </div>
              <span className="font-mono text-xs text-muted-foreground">
                {expandedSection === 'monitoring' ? '[−]' : '[+]'}
              </span>
            </button>
            {expandedSection === 'monitoring' && (
              <div className="border-t border-border p-3 space-y-2">
                <div>
                  <p className="text-[10px] font-medium text-muted-foreground font-mono">[NYCKELINDIKATORER]</p>
                  <ul className="text-xs text-foreground mt-1">
                    {forecast.recommended_monitoring.key_indicators?.map((indicator, i) => (
                      <li key={i} className="flex items-start gap-1">
                        <span className="font-mono text-primary">[KPI]</span> {indicator}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex gap-4">
                  <div>
                    <p className="text-[10px] font-medium text-muted-foreground font-mono">[TRÖSKEL]</p>
                    <p className="text-xs text-foreground">{forecast.recommended_monitoring.warning_threshold}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-medium text-muted-foreground font-mono">[FREKVENS]</p>
                    <p className="text-xs text-foreground">{forecast.recommended_monitoring.review_frequency}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Uncertainty Factors */}
        {forecast.uncertainty_factors?.length > 0 && (
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <button
              onClick={() => toggleSection('uncertainty')}
              className="flex w-full items-center justify-between p-3 text-left hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-muted-foreground">[?]</span>
                <span className="text-sm font-medium">Osäkerhetsfaktorer</span>
              </div>
              <span className="font-mono text-xs text-muted-foreground">
                {expandedSection === 'uncertainty' ? '[−]' : '[+]'}
              </span>
            </button>
            {expandedSection === 'uncertainty' && (
              <div className="border-t border-border p-3">
                <ul className="text-xs text-muted-foreground space-y-1">
                  {forecast.uncertainty_factors.map((factor, i) => (
                    <li key={i} className="flex items-start gap-1">
                      <span className="font-mono text-status-warning">[?]</span> {factor}
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
