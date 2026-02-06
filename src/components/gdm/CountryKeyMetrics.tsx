/**
 * COUNTRY KEY METRICS
 * 
 * Displays key country statistics with global context:
 * - Each metric shows the country value
 * - Best in world (green)
 * - Worst in world (red)
 * - Visual bar showing position
 */

import React from 'react';

// ============================================================================
// TYPES
// ============================================================================

export interface GlobalBenchmark {
  best: { country: string; code: string; value: number };
  worst: { country: string; code: string; value: number };
}

export interface KeyMetric {
  id: string;
  name: string;
  icon: string;
  unit: string;
  value: number;
  formatted: string;
  higherIsBetter: boolean;
  global: GlobalBenchmark;
  category: 'economy' | 'health' | 'safety' | 'education' | 'environment';
}

// ============================================================================
// MOCK GLOBAL DATA (to be replaced with real data)
// ============================================================================

const GLOBAL_BENCHMARKS: Record<string, GlobalBenchmark> = {
  gdp_per_capita: {
    best: { country: 'Luxembourg', code: 'LU', value: 128820 },
    worst: { country: 'Burundi', code: 'BI', value: 221 },
  },
  median_income: {
    best: { country: 'Switzerland', code: 'CH', value: 6538 },
    worst: { country: 'DR Kongo', code: 'CD', value: 42 },
  },
  life_expectancy: {
    best: { country: 'Japan', code: 'JP', value: 84.6 },
    worst: { country: 'Lesotho', code: 'LS', value: 50.8 },
  },
  murder_rate: {
    best: { country: 'Japan', code: 'JP', value: 0.2 },
    worst: { country: 'Jamaica', code: 'JM', value: 52.1 },
  },
  healthcare_index: {
    best: { country: 'Sydkorea', code: 'KR', value: 86.4 },
    worst: { country: 'Venezuela', code: 'VE', value: 34.2 },
  },
  education_index: {
    best: { country: 'Norge', code: 'NO', value: 0.953 },
    worst: { country: 'Niger', code: 'NE', value: 0.209 },
  },
  corruption_index: {
    best: { country: 'Danmark', code: 'DK', value: 90 },
    worst: { country: 'Somalia', code: 'SO', value: 12 },
  },
  unemployment: {
    best: { country: 'Thailand', code: 'TH', value: 0.9 },
    worst: { country: 'Sydafrika', code: 'ZA', value: 32.9 },
  },
  co2_per_capita: {
    best: { country: 'DR Kongo', code: 'CD', value: 0.04 },
    worst: { country: 'Qatar', code: 'QA', value: 32.4 },
  },
  happiness_index: {
    best: { country: 'Finland', code: 'FI', value: 7.82 },
    worst: { country: 'Afghanistan', code: 'AF', value: 1.72 },
  },
};

// Country-specific values (mock)
const COUNTRY_VALUES: Record<string, Record<string, number>> = {
  SE: {
    gdp_per_capita: 56424,
    median_income: 3218,
    life_expectancy: 83.2,
    murder_rate: 1.1,
    healthcare_index: 78.4,
    education_index: 0.911,
    corruption_index: 83,
    unemployment: 7.5,
    co2_per_capita: 3.6,
    happiness_index: 7.36,
  },
  US: {
    gdp_per_capita: 76398,
    median_income: 3828,
    life_expectancy: 77.5,
    murder_rate: 6.4,
    healthcare_index: 69.2,
    education_index: 0.900,
    corruption_index: 69,
    unemployment: 3.7,
    co2_per_capita: 14.2,
    happiness_index: 6.89,
  },
  JP: {
    gdp_per_capita: 33815,
    median_income: 2756,
    life_expectancy: 84.6,
    murder_rate: 0.2,
    healthcare_index: 81.5,
    education_index: 0.890,
    corruption_index: 73,
    unemployment: 2.6,
    co2_per_capita: 8.6,
    happiness_index: 6.13,
  },
  DE: {
    gdp_per_capita: 51384,
    median_income: 3074,
    life_expectancy: 81.3,
    murder_rate: 0.9,
    healthcare_index: 80.1,
    education_index: 0.943,
    corruption_index: 80,
    unemployment: 3.1,
    co2_per_capita: 7.9,
    happiness_index: 7.03,
  },
  NO: {
    gdp_per_capita: 89090,
    median_income: 4234,
    life_expectancy: 83.4,
    murder_rate: 0.5,
    healthcare_index: 77.8,
    education_index: 0.953,
    corruption_index: 84,
    unemployment: 3.2,
    co2_per_capita: 6.7,
    happiness_index: 7.57,
  },
};

// Default for unknown countries
const DEFAULT_VALUES: Record<string, number> = {
  gdp_per_capita: 15000,
  median_income: 800,
  life_expectancy: 72,
  murder_rate: 5.5,
  healthcare_index: 55,
  education_index: 0.65,
  corruption_index: 45,
  unemployment: 8,
  co2_per_capita: 4.5,
  happiness_index: 5.5,
};

// ============================================================================
// METRIC DEFINITIONS
// ============================================================================

const METRIC_DEFINITIONS: Omit<KeyMetric, 'value' | 'formatted' | 'global'>[] = [
  { id: 'gdp_per_capita', name: 'BNP per capita', icon: '💰', unit: 'USD', higherIsBetter: true, category: 'economy' },
  { id: 'median_income', name: 'Medianinkomst', icon: '💵', unit: 'USD/mån', higherIsBetter: true, category: 'economy' },
  { id: 'life_expectancy', name: 'Medellivslängd', icon: '❤️', unit: 'år', higherIsBetter: true, category: 'health' },
  { id: 'murder_rate', name: 'Mordfrekvens', icon: '🔪', unit: 'per 100k', higherIsBetter: false, category: 'safety' },
  { id: 'healthcare_index', name: 'Sjukvårdsindex', icon: '🏥', unit: 'poäng', higherIsBetter: true, category: 'health' },
  { id: 'unemployment', name: 'Arbetslöshet', icon: '📉', unit: '%', higherIsBetter: false, category: 'economy' },
  { id: 'corruption_index', name: 'Korruptionsindex', icon: '⚖️', unit: '0-100', higherIsBetter: true, category: 'safety' },
  { id: 'happiness_index', name: 'Lyckoindex', icon: '😊', unit: '1-10', higherIsBetter: true, category: 'health' },
];

// ============================================================================
// HELPERS
// ============================================================================

function formatValue(id: string, value: number): string {
  switch (id) {
    case 'gdp_per_capita':
    case 'median_income':
      return `$${value.toLocaleString('sv-SE')}`;
    case 'life_expectancy':
      return `${value.toFixed(1)} år`;
    case 'murder_rate':
      return `${value.toFixed(1)}`;
    case 'unemployment':
      return `${value.toFixed(1)}%`;
    case 'education_index':
      return value.toFixed(3);
    default:
      return value.toFixed(1);
  }
}

function getPositionPercentage(value: number, best: number, worst: number, higherIsBetter: boolean): number {
  if (higherIsBetter) {
    // Higher is better: 0% = worst, 100% = best
    return Math.max(0, Math.min(100, ((value - worst) / (best - worst)) * 100));
  } else {
    // Lower is better: 0% = worst (high value), 100% = best (low value)
    return Math.max(0, Math.min(100, ((worst - value) / (worst - best)) * 100));
  }
}

function getPositionColor(percentage: number): string {
  if (percentage >= 80) return '#059669'; // emerald-600
  if (percentage >= 60) return '#22c55e'; // green-500
  if (percentage >= 40) return '#eab308'; // yellow-500
  if (percentage >= 20) return '#f97316'; // orange-500
  return '#ef4444'; // red-500
}

// ============================================================================
// GET METRICS FOR COUNTRY
// ============================================================================

export function getCountryMetrics(countryCode: string): KeyMetric[] {
  const values = COUNTRY_VALUES[countryCode] || DEFAULT_VALUES;
  
  return METRIC_DEFINITIONS.map(def => {
    const value = values[def.id] || DEFAULT_VALUES[def.id];
    const global = GLOBAL_BENCHMARKS[def.id];
    
    return {
      ...def,
      value,
      formatted: formatValue(def.id, value),
      global,
    };
  });
}

// ============================================================================
// COMPONENT: Single Metric Row
// ============================================================================

interface MetricRowProps {
  metric: KeyMetric;
  onClick?: () => void;
}

export function MetricRow({ metric, onClick }: MetricRowProps) {
  const { name, icon, formatted, value, global, higherIsBetter } = metric;
  const position = getPositionPercentage(
    value, 
    global.best.value, 
    global.worst.value, 
    higherIsBetter
  );
  const positionColor = getPositionColor(position);
  
  // Determine best/worst display (considering polarity)
  const bestLabel = higherIsBetter ? global.best : global.worst;
  const worstLabel = higherIsBetter ? global.worst : global.best;
  
  return (
    <button
      onClick={onClick}
      className="w-full p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all text-left group"
      type="button"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <span className="font-medium text-slate-900 text-sm">{name}</span>
        </div>
        <span 
          className="font-bold text-lg"
          style={{ color: positionColor }}
        >
          {formatted}
        </span>
      </div>
      
      {/* Position bar */}
      <div className="relative h-2 bg-gradient-to-r from-red-200 via-yellow-200 to-green-200 rounded-full mb-2">
        <div 
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white shadow-md transition-all"
          style={{ 
            left: `calc(${position}% - 6px)`,
            background: positionColor,
          }}
        />
      </div>
      
      {/* Best/Worst labels */}
      <div className="flex justify-between text-[10px] text-slate-500">
        <div className="flex items-center gap-1">
          <span className="text-red-500">⬇</span>
          <span>{worstLabel.country}: {formatValue(metric.id, worstLabel.value)}</span>
        </div>
        <div className="flex items-center gap-1">
          <span>{bestLabel.country}: {formatValue(metric.id, bestLabel.value)}</span>
          <span className="text-green-500">⬆</span>
        </div>
      </div>
      
      {/* Click hint */}
      <p className="text-[9px] text-slate-400 text-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
        Klicka för detaljer →
      </p>
    </button>
  );
}

// ============================================================================
// COMPONENT: Key Metrics Panel
// ============================================================================

interface CountryKeyMetricsProps {
  countryCode: string;
  onMetricClick?: (metric: KeyMetric) => void;
  className?: string;
}

export function CountryKeyMetrics({ countryCode, onMetricClick, className = '' }: CountryKeyMetricsProps) {
  const metrics = getCountryMetrics(countryCode);
  
  return (
    <section className={`space-y-3 ${className}`}>
      <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
        <span>📊</span> Nyckeltal med global jämförelse
      </h3>
      
      <div className="space-y-2">
        {metrics.map(metric => (
          <MetricRow 
            key={metric.id} 
            metric={metric}
            onClick={() => onMetricClick?.(metric)}
          />
        ))}
      </div>
      
      {/* Legend */}
      <div className="bg-slate-100 rounded-lg p-3 text-[10px] text-slate-600">
        <div className="flex items-center gap-4 justify-center">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-red-400 rounded-full" />
            <span>Sämst i världen</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-yellow-400 rounded-full" />
            <span>Medel</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-green-400 rounded-full" />
            <span>Bäst i världen</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CountryKeyMetrics;
