/**
 * LAMBDA PRESENTATION LAYER
 * 
 * Varje vy måste:
 * - vara begriplig för en 18-åring
 * - ha klickbart djup: index → komponenter → rådata → källa
 * - visa: vad, hur mycket, sedan när, i relation till vad
 * 
 * INGET: spekulativt språk, moral, politiska värdeord
 */

import type { 
  IndexCode,
  IndexValue,
  LambdaCalculation,
  PerformanceAnalysis,
  IndexCorrelation,
  IndexPresentation
} from './index-types';
import { getIndexDefinition } from './index-registry';
import { getLambdaBand } from './lambda-calculator';

// =============================================================================
// HEADLINE GENERATION (max 10 ord)
// =============================================================================

export function generateHeadline(
  lambda: LambdaCalculation,
  language: 'sv' | 'en' = 'sv'
): string {
  const band = getLambdaBand(lambda.lambda);
  
  const templates: Record<string, { sv: string; en: string }> = {
    critical_low: {
      sv: `λ ${lambda.lambda.toFixed(2)} — Kritisk avvikelse`,
      en: `λ ${lambda.lambda.toFixed(2)} — Critical deviation`,
    },
    warning_low: {
      sv: `λ ${lambda.lambda.toFixed(2)} — Betydande obalans`,
      en: `λ ${lambda.lambda.toFixed(2)} — Significant imbalance`,
    },
    balanced: {
      sv: `λ ${lambda.lambda.toFixed(2)} — Inom normalintervall`,
      en: `λ ${lambda.lambda.toFixed(2)} — Within normal range`,
    },
    warning_high: {
      sv: `λ ${lambda.lambda.toFixed(2)} — Systemstress`,
      en: `λ ${lambda.lambda.toFixed(2)} — System stress`,
    },
    critical_high: {
      sv: `λ ${lambda.lambda.toFixed(2)} — Kritisk överhettning`,
      en: `λ ${lambda.lambda.toFixed(2)} — Critical overheating`,
    },
  };
  
  let key = 'balanced';
  if (lambda.lambda < 0.70) key = 'critical_low';
  else if (lambda.lambda < 0.90) key = 'warning_low';
  else if (lambda.lambda > 1.30) key = 'critical_high';
  else if (lambda.lambda > 1.10) key = 'warning_high';
  
  return templates[key][language];
}

// =============================================================================
// SUMMARY GENERATION (max 50 ord)
// =============================================================================

export function generateSummary(
  lambda: LambdaCalculation,
  language: 'sv' | 'en' = 'sv'
): string {
  const primaryDriver = lambda.primary_drivers[0];
  const driverDef = primaryDriver ? getIndexDefinition(primaryDriver) : null;
  const driverName = driverDef 
    ? (language === 'sv' ? driverDef.name_sv : driverDef.name_en)
    : 'okänd faktor';
  
  const trendWord = {
    improving: language === 'sv' ? 'förbättras' : 'improving',
    stable: language === 'sv' ? 'stabilt' : 'stable',
    declining: language === 'sv' ? 'försämras' : 'declining',
  };
  
  const trend = trendWord[lambda.trend];
  
  if (language === 'sv') {
    return `Systembalans ${lambda.lambda.toFixed(2)} med ${trend} trend. ` +
           `Primär drivkraft: ${driverName}. ` +
           `Datatäckning: ${(lambda.data_coverage * 100).toFixed(0)}%.`;
  } else {
    return `System balance ${lambda.lambda.toFixed(2)} with ${trend} trend. ` +
           `Primary driver: ${driverName}. ` +
           `Data coverage: ${(lambda.data_coverage * 100).toFixed(0)}%.`;
  }
}

// =============================================================================
// STRUCTURED PRESENTATION
// =============================================================================

export function generateStructuredPresentation(
  lambda: LambdaCalculation,
  language: 'sv' | 'en' = 'sv'
): {
  what: string;
  how_much: string;
  since_when: string;
  compared_to: string;
} {
  const band = getLambdaBand(lambda.lambda);
  
  if (language === 'sv') {
    return {
      what: `Lambda-värde för ${lambda.geo_code} (${lambda.geo_level})`,
      how_much: `${lambda.lambda.toFixed(3)} (${band.label_sv})`,
      since_when: `Period: ${lambda.period}. Trend: ${
        lambda.trend === 'improving' ? 'förbättras' :
        lambda.trend === 'declining' ? 'försämras' : 'stabil'
      }`,
      compared_to: lambda.lambda_1y_ago 
        ? `Förändring sedan förra året: ${((lambda.lambda - lambda.lambda_1y_ago) * 100).toFixed(1)}%`
        : 'Historisk jämförelse ej tillgänglig',
    };
  } else {
    return {
      what: `Lambda value for ${lambda.geo_code} (${lambda.geo_level})`,
      how_much: `${lambda.lambda.toFixed(3)} (${band.label_en})`,
      since_when: `Period: ${lambda.period}. Trend: ${lambda.trend}`,
      compared_to: lambda.lambda_1y_ago 
        ? `Change since last year: ${((lambda.lambda - lambda.lambda_1y_ago) * 100).toFixed(1)}%`
        : 'Historical comparison not available',
    };
  }
}

// =============================================================================
// CLICK PATH (DRILL-DOWN)
// =============================================================================

export interface ClickPathLevel {
  level: number;
  label: string;
  description: string;
  data_type: 'index' | 'component' | 'raw_data' | 'source';
  url?: string;
}

export function generateClickPath(
  indexCode: IndexCode,
  value: IndexValue,
  language: 'sv' | 'en' = 'sv'
): ClickPathLevel[] {
  const def = getIndexDefinition(indexCode);
  if (!def) return [];
  
  const name = language === 'sv' ? def.name_sv : def.name_en;
  
  return [
    {
      level: 1,
      label: name,
      description: language === 'sv' 
        ? `Övergripande indexvärde: ${value.normalized_value.toFixed(1)}`
        : `Overall index value: ${value.normalized_value.toFixed(1)}`,
      data_type: 'index',
    },
    {
      level: 2,
      label: language === 'sv' ? 'Komponenter' : 'Components',
      description: language === 'sv'
        ? `Ingående indikatorer: ${def.input_indicators.join(', ')}`
        : `Input indicators: ${def.input_indicators.join(', ')}`,
      data_type: 'component',
    },
    {
      level: 3,
      label: language === 'sv' ? 'Rådata' : 'Raw Data',
      description: language === 'sv'
        ? `Värde: ${value.raw_value}, Z-score: ${value.zscore.toFixed(2)}`
        : `Value: ${value.raw_value}, Z-score: ${value.zscore.toFixed(2)}`,
      data_type: 'raw_data',
    },
    {
      level: 4,
      label: language === 'sv' ? 'Källor' : 'Sources',
      description: def.primary_sources.join(', '),
      data_type: 'source',
    },
  ];
}

// =============================================================================
// QR VERIFICATION
// =============================================================================

export function generateVerificationUrl(
  type: 'lambda' | 'index' | 'correlation',
  id: string,
  period: string
): string {
  const base = 'https://strim.se/verify';
  const params = new URLSearchParams({
    type,
    id,
    period,
    ts: Date.now().toString(),
  });
  return `${base}?${params.toString()}`;
}

// =============================================================================
// COMPLETE INDEX PRESENTATION
// =============================================================================

export function createIndexPresentation(
  indexCode: IndexCode,
  value: IndexValue,
  language: 'sv' | 'en' = 'sv'
): IndexPresentation {
  const def = getIndexDefinition(indexCode);
  if (!def) {
    throw new Error(`Unknown index: ${indexCode}`);
  }
  
  const name = language === 'sv' ? def.name_sv : def.name_en;
  const trendText = {
    improving: language === 'sv' ? 'ökar' : 'increasing',
    stable: language === 'sv' ? 'stabil' : 'stable',
    declining: language === 'sv' ? 'minskar' : 'decreasing',
    insufficient_data: language === 'sv' ? 'otillräcklig data' : 'insufficient data',
  };
  
  return {
    headline: `${name}: ${value.normalized_value.toFixed(1)}`,
    summary: language === 'sv'
      ? `${name} är ${value.normalized_value.toFixed(1)} (percentil: ${value.percentile_rank.toFixed(0)}). Trend: ${trendText[value.trend_direction]}.`
      : `${name} is ${value.normalized_value.toFixed(1)} (percentile: ${value.percentile_rank.toFixed(0)}). Trend: ${trendText[value.trend_direction]}.`,
    
    what: name,
    how_much: `${value.normalized_value.toFixed(2)} (${value.percentile_rank.toFixed(0)}:e percentilen)`,
    since_when: `Mätperiod: ${value.period}`,
    compared_to: value.change_1y !== null 
      ? `Förändring 1 år: ${value.change_1y > 0 ? '+' : ''}${value.change_1y.toFixed(1)}%`
      : 'Ingen historisk jämförelse',
    
    click_path: generateClickPath(indexCode, value, language),
    
    qr_verification_url: generateVerificationUrl('index', indexCode, value.period),
    source_list: def.primary_sources,
    
    data_quality_warning: value.data_coverage < 0.7 
      ? (language === 'sv' ? 'Begränsad datatäckning' : 'Limited data coverage')
      : null,
    coverage_warning: value.source_count < 2
      ? (language === 'sv' ? 'Enstaka källa' : 'Single source')
      : null,
  };
}

// =============================================================================
// CORRELATION PRESENTATION
// =============================================================================

export function presentCorrelation(
  correlation: IndexCorrelation,
  language: 'sv' | 'en' = 'sv'
): {
  headline: string;
  interpretation: string;
  strength: string;
  confidence: string;
  warning: string | null;
} {
  const defA = getIndexDefinition(correlation.index_a);
  const defB = getIndexDefinition(correlation.index_b);
  
  const nameA = defA ? (language === 'sv' ? defA.name_sv : defA.name_en) : correlation.index_a;
  const nameB = defB ? (language === 'sv' ? defB.name_sv : defB.name_en) : correlation.index_b;
  
  const r = correlation.pearson_r;
  const absR = Math.abs(r);
  
  let strength: string;
  if (absR > 0.7) strength = language === 'sv' ? 'Stark' : 'Strong';
  else if (absR > 0.4) strength = language === 'sv' ? 'Måttlig' : 'Moderate';
  else if (absR > 0.2) strength = language === 'sv' ? 'Svag' : 'Weak';
  else strength = language === 'sv' ? 'Mycket svag' : 'Very weak';
  
  const direction = r >= 0 
    ? (language === 'sv' ? 'positiv' : 'positive')
    : (language === 'sv' ? 'negativ' : 'negative');
  
  return {
    headline: `${nameA} ↔ ${nameB}: r = ${r.toFixed(2)}`,
    interpretation: language === 'sv'
      ? `${strength} ${direction} samvariation observerad mellan ${nameA} och ${nameB}.`
      : `${strength} ${direction} covariation observed between ${nameA} and ${nameB}.`,
    strength: `${strength} (|r| = ${absR.toFixed(2)})`,
    confidence: language === 'sv'
      ? `Konfidensnivå: ${correlation.confidence_level}, p = ${correlation.p_value.toFixed(4)}`
      : `Confidence level: ${correlation.confidence_level}, p = ${correlation.p_value.toFixed(4)}`,
    warning: correlation.spurious_warning
      ? (language === 'sv' 
          ? 'Varning: Litet urval kan ge missvisande korrelation'
          : 'Warning: Small sample may produce misleading correlation')
      : null,
  };
}

// =============================================================================
// PERFORMANCE PRESENTATION
// =============================================================================

export function presentPerformance(
  analysis: PerformanceAnalysis,
  language: 'sv' | 'en' = 'sv'
): {
  headline: string;
  classification: string;
  efficiency: string;
  comparison: string;
  recommendation_free_observation: string;
} {
  const classLabels: Record<string, { sv: string; en: string }> = {
    'overperforming_low_resource': {
      sv: 'Överpresterar trots låg resursinsats',
      en: 'Overperforming despite low resource input',
    },
    'overperforming_high_resource': {
      sv: 'Presterar enligt förväntan',
      en: 'Performing as expected',
    },
    'underperforming_high_resource': {
      sv: 'Underpresterar trots hög resursinsats',
      en: 'Underperforming despite high resource input',
    },
    'underperforming_low_resource': {
      sv: 'Underpresterar med låg insats',
      en: 'Underperforming with low input',
    },
    'structurally_locked': {
      sv: 'Strukturellt låst system',
      en: 'Structurally locked system',
    },
    'insufficient_data': {
      sv: 'Otillräcklig data',
      en: 'Insufficient data',
    },
  };
  
  const classLabel = classLabels[analysis.performance_class]?.[language] || analysis.performance_class;
  
  return {
    headline: `${analysis.geo_code}: ${classLabel}`,
    classification: classLabel,
    efficiency: language === 'sv'
      ? `Effektivitetskvot: ${analysis.efficiency_ratio.toFixed(2)} (utfall/insats)`
      : `Efficiency ratio: ${analysis.efficiency_ratio.toFixed(2)} (outcome/input)`,
    comparison: language === 'sv'
      ? `Vs global median: ${analysis.vs_global_median > 0 ? '+' : ''}${analysis.vs_global_median.toFixed(1)}. ` +
        `Vs jämförelsegrupp: ${analysis.vs_peer_group_median > 0 ? '+' : ''}${analysis.vs_peer_group_median.toFixed(1)}.`
      : `Vs global median: ${analysis.vs_global_median > 0 ? '+' : ''}${analysis.vs_global_median.toFixed(1)}. ` +
        `Vs peer group: ${analysis.vs_peer_group_median > 0 ? '+' : ''}${analysis.vs_peer_group_median.toFixed(1)}.`,
    recommendation_free_observation: language === 'sv'
      ? `Observerad avvikelse från förväntad prestation baserat på resursinsats. Historiska paralleller finns från ${analysis.similar_historical_patterns.length} fall.`
      : `Observed deviation from expected performance based on resource input. Historical parallels exist from ${analysis.similar_historical_patterns.length} cases.`,
  };
}
