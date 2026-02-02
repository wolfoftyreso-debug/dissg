/**
 * WAVE 10: BLOCK CF — GLOBAL BENCHMARK ENGINE
 * BLOCK CG — NARRATIVE-FREE SUMMARY ENGINE
 * 
 * Allt ska kunna jämföras korrekt.
 * Sammanfatta utan propaganda.
 */

// ============================================================
// CF1: BENCHMARK TYPES
// ============================================================

export type BenchmarkType = 
  | 'peer_countries'       // Jämförbara länder
  | 'similar_regions'      // Liknande regioner
  | 'historical_self'      // Historisk utveckling
  | 'best_quartile'        // Bästa kvartilen
  | 'worst_quartile'       // Sämsta kvartilen
  | 'median'               // Median
  | 'custom_group';        // Anpassad grupp

export interface BenchmarkConfig {
  type: BenchmarkType;
  name: string;
  description: string;
  
  // What entities are compared
  entity_type: 'country' | 'region' | 'municipality' | 'entity';
  
  // How comparability is assessed
  comparability_factors: ComparabilityFactor[];
  
  // Thresholds
  min_comparability_score: number;
  min_sample_size: number;
}

export interface ComparabilityFactor {
  factor: string;
  weight: number;
  description: string;
}

export const COMPARABILITY_FACTORS: ComparabilityFactor[] = [
  { factor: 'population_size', weight: 0.15, description: 'Befolkningsstorlek inom samma intervall' },
  { factor: 'gdp_per_capita', weight: 0.15, description: 'Liknande BNP per capita' },
  { factor: 'geographic_region', weight: 0.10, description: 'Samma geografiska region' },
  { factor: 'political_system', weight: 0.10, description: 'Liknande politiskt system' },
  { factor: 'definition_match', weight: 0.20, description: 'Samma definition av måttet' },
  { factor: 'methodology_match', weight: 0.20, description: 'Samma insamlingsmetod' },
  { factor: 'temporal_coverage', weight: 0.10, description: 'Överlappande tidsperiod' }
];

// ============================================================
// BENCHMARK RESULT
// ============================================================

export interface BenchmarkResult {
  subject: {
    id: string;
    name: string;
    value: number;
  };
  
  benchmark: {
    type: BenchmarkType;
    group_name: string;
    group_size: number;
    
    min: number;
    max: number;
    median: number;
    mean: number;
    std_dev: number;
    
    percentile: number;
    rank: number;
  };
  
  // MANDATORY: Comparability flag
  comparability: {
    score: number;
    level: 'high' | 'moderate' | 'low' | 'uncertain';
    factors: {
      factor: string;
      match: boolean;
      note?: string;
    }[];
    warnings: string[];
  };
  
  // Temporal context
  period: {
    subject_period: string;
    benchmark_period: string;
    period_match: boolean;
  };
  
  // Method transparency
  method: {
    subject_method: string;
    benchmark_method: string;
    method_match: boolean;
  };
}

// ============================================================
// CG1: NARRATIVE-FREE SUMMARY RULES
// ============================================================

// ALLOWED verbs (deskriptiva)
export const ALLOWED_VERBS = [
  'ökade', 'minskade', 'förändrades', 'förblev', 
  'låg', 'var', 'uppgick till', 'varierade',
  'avvek', 'sammanföll', 'översteg', 'understeg',
  'increased', 'decreased', 'changed', 'remained',
  'was', 'amounted to', 'varied', 'deviated'
] as const;

// FORBIDDEN words (värdeord & känsloord)
export const FORBIDDEN_WORDS = [
  // Värdeord
  'bra', 'dålig', 'bättre', 'sämre', 'bäst', 'sämst',
  'positiv', 'negativ', 'framgång', 'misslyckande',
  'lyckas', 'misslyckas', 'framsteg', 'tillbakagång',
  'god', 'ond', 'rätt', 'fel', 'korrekt', 'inkorrekt',
  
  // Känsloord
  'oroande', 'alarmerande', 'uppmuntrande', 'hoppfull',
  'skrämmande', 'fantastisk', 'katastrofal', 'lysande',
  'besvikelse', 'triumf', 'chock', 'överraskning',
  
  // Normativa
  'borde', 'måste', 'ska', 'bör', 'behöver',
  'should', 'must', 'ought', 'need to',
  
  // English equivalents
  'good', 'bad', 'better', 'worse', 'best', 'worst',
  'positive', 'negative', 'success', 'failure',
  'alarming', 'encouraging', 'concerning', 'promising'
] as const;

export interface SummaryValidation {
  valid: boolean;
  issues: {
    word: string;
    position: number;
    type: 'value_word' | 'emotion_word' | 'normative';
    suggestion?: string;
  }[];
}

export function validateNarrativeFreeSummary(text: string): SummaryValidation {
  const issues: SummaryValidation['issues'] = [];
  const lowerText = text.toLowerCase();
  
  for (const word of FORBIDDEN_WORDS) {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    let match;
    while ((match = regex.exec(lowerText)) !== null) {
      issues.push({
        word: match[0],
        position: match.index,
        type: ['borde', 'måste', 'ska', 'bör', 'should', 'must', 'ought'].includes(word)
          ? 'normative'
          : ['oroande', 'alarmerande', 'fantastisk', 'skrämmande'].includes(word)
          ? 'emotion_word'
          : 'value_word',
        suggestion: getSuggestion(word)
      });
    }
  }
  
  return {
    valid: issues.length === 0,
    issues
  };
}

function getSuggestion(word: string): string | undefined {
  const suggestions: Record<string, string> = {
    'bra': 'hög/över genomsnitt',
    'dålig': 'låg/under genomsnitt',
    'bättre': 'högre',
    'sämre': 'lägre',
    'positiv': 'ökande',
    'negativ': 'minskande',
    'oroande': 'avvikande från trend',
    'framgång': 'uppnått mål',
    'misslyckande': 'ej uppnått mål'
  };
  return suggestions[word];
}

// ============================================================
// NEUTRAL SUMMARY TEMPLATES
// ============================================================

export const SUMMARY_TEMPLATES = {
  value_statement: {
    sv: '{entity} uppmätte {value} {unit} under {period}.',
    en: '{entity} recorded {value} {unit} during {period}.'
  },
  
  change_statement: {
    sv: '{entity} {direction} med {change} {unit} ({percent}%) jämfört med {comparison_period}.',
    en: '{entity} {direction} by {change} {unit} ({percent}%) compared to {comparison_period}.'
  },
  
  benchmark_statement: {
    sv: '{entity} låg {position} {benchmark_group} ({percentile}:e percentilen, rank {rank} av {total}).',
    en: '{entity} was {position} {benchmark_group} ({percentile}th percentile, rank {rank} of {total}).'
  },
  
  trend_statement: {
    sv: 'Under perioden {period_start} till {period_end} {trend_verb} {entity} med i genomsnitt {avg_change} per {time_unit}.',
    en: 'From {period_start} to {period_end}, {entity} {trend_verb} by an average of {avg_change} per {time_unit}.'
  },
  
  correlation_statement: {
    sv: '{entity_a} och {entity_b} uppvisade {strength} samvariation (r={coefficient}) under {period}.',
    en: '{entity_a} and {entity_b} showed {strength} covariation (r={coefficient}) during {period}.'
  }
} as const;

// Position words (neutral)
export const POSITION_WORDS = {
  above: { sv: 'över', en: 'above' },
  below: { sv: 'under', en: 'below' },
  at: { sv: 'på', en: 'at' },
  near: { sv: 'nära', en: 'near' }
};

// Trend words (neutral)
export const TREND_WORDS = {
  increasing: { sv: 'ökade', en: 'increased' },
  decreasing: { sv: 'minskade', en: 'decreased' },
  stable: { sv: 'förblev stabil', en: 'remained stable' },
  volatile: { sv: 'varierade', en: 'varied' }
};

// Strength words (neutral)
export const STRENGTH_WORDS = {
  strong: { sv: 'stark', en: 'strong' },
  moderate: { sv: 'måttlig', en: 'moderate' },
  weak: { sv: 'svag', en: 'weak' },
  negligible: { sv: 'försumbar', en: 'negligible' }
};

// ============================================================
// BENCHMARK ENGINE
// ============================================================

export function calculateBenchmark(
  subjectValue: number,
  benchmarkValues: number[],
  benchmarkType: BenchmarkType
): Omit<BenchmarkResult['benchmark'], 'type' | 'group_name'> {
  const sorted = [...benchmarkValues].sort((a, b) => a - b);
  const n = sorted.length;
  
  const min = sorted[0];
  const max = sorted[n - 1];
  const median = n % 2 === 0 
    ? (sorted[n/2 - 1] + sorted[n/2]) / 2 
    : sorted[Math.floor(n/2)];
  const mean = sorted.reduce((a, b) => a + b, 0) / n;
  const variance = sorted.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n;
  const std_dev = Math.sqrt(variance);
  
  // Calculate percentile
  const belowCount = sorted.filter(v => v < subjectValue).length;
  const percentile = Math.round((belowCount / n) * 100);
  
  // Calculate rank (1 = highest)
  const rank = sorted.filter(v => v > subjectValue).length + 1;
  
  return {
    group_size: n,
    min,
    max,
    median,
    mean,
    std_dev,
    percentile,
    rank
  };
}
