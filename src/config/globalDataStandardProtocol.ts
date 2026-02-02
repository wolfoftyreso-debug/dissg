/**
 * WAVE 10: BLOCK CB — GLOBAL DATA STANDARD & PROTOCOL (G-DSP)
 * BLOCK CC — OPEN METHOD REGISTRY
 * 
 * "HTTP för samhällsdata"
 * 
 * Ni standardiserar INTE data – ni standardiserar:
 * - hur data beskrivs
 * - hur data jämförs
 * - hur osäkerhet uttrycks
 * - hur metod redovisas
 */

// ============================================================
// CB2: G-DSP CORE OBJECTS — JSON SCHEMA DEFINITIONS
// ============================================================

export const G_DSP_VERSION = '1.0.0';

// Base interface for all G-DSP objects
export interface GDSPBaseObject {
  _gdsp_version: string;
  _object_type: GDSPObjectType;
  _created_at: string;
  _updated_at: string;
}

export type GDSPObjectType = 
  | 'DataPoint'
  | 'KPI'
  | 'Index'
  | 'Event'
  | 'Action'
  | 'Region'
  | 'TimeSlice'
  | 'Aggregation'
  | 'Method'
  | 'Confidence'
  | 'Coverage';

// ============================================================
// CB3: OBLIGATORISKA FÄLT — INGEN EXCEPTION
// ============================================================

/**
 * MANDATORY FIELDS
 * Om något saknas → objektet är ogiltigt
 */
export interface MandatoryFields {
  source: SourceAttribution;
  method: MethodReference;
  confidence: ConfidenceLevel;
  coverage: CoverageDescription;
  last_updated: string;
  version: string;
}

export interface SourceAttribution {
  name: string;
  organization: string;
  url: string;
  license: string;
  accessed_at: string;
  original_id?: string;
}

export interface MethodReference {
  method_id: string;
  name: string;
  version: string;
  registry_url: string;
}

export interface ConfidenceLevel {
  score: number;          // 0-1
  level: 'high' | 'medium' | 'low' | 'unknown';
  factors: string[];
  limitations: string[];
}

export interface CoverageDescription {
  geographic: {
    type: 'global' | 'continental' | 'national' | 'regional' | 'local';
    codes: string[];
    gaps?: string[];
  };
  temporal: {
    start: string;
    end: string;
    granularity: 'yearly' | 'quarterly' | 'monthly' | 'weekly' | 'daily';
    gaps?: string[];
  };
  demographic?: {
    included: string[];
    excluded?: string[];
  };
}

// ============================================================
// G-DSP CORE OBJECTS
// ============================================================

export interface GDSPDataPoint extends GDSPBaseObject, MandatoryFields {
  _object_type: 'DataPoint';
  id: string;
  kpi_id: string;
  value: number;
  unit: string;
  period: TimeSlice;
  region: RegionReference;
  raw_value?: number;
  transformations?: string[];
  checksum?: string;
}

export interface GDSPKPI extends GDSPBaseObject, MandatoryFields {
  _object_type: 'KPI';
  id: string;
  code: string;
  name: string;
  description: string;
  unit: string;
  direction: 'higher_is_better' | 'lower_is_better' | 'neutral';
  category: string;
  subcategory?: string;
  comparable_across: string[];
  definition_url: string;
}

export interface GDSPIndex extends GDSPBaseObject, MandatoryFields {
  _object_type: 'Index';
  id: string;
  code: string;
  name: string;
  description: string;
  components: {
    kpi_id: string;
    weight: number;
    normalization: string;
  }[];
  aggregation_method: string;
  value: number;
  period: TimeSlice;
}

export interface GDSPEvent extends GDSPBaseObject, MandatoryFields {
  _object_type: 'Event';
  id: string;
  code: string;
  name: string;
  description: string;
  event_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  start_date: string;
  end_date?: string;
  affected_regions: string[];
  affected_kpis: string[];
}

export interface GDSPAction extends GDSPBaseObject, MandatoryFields {
  _object_type: 'Action';
  id: string;
  title: string;
  description: string;
  action_type: string;
  authority: string;
  effective_date: string;
  target_kpis: string[];
  expected_effects: {
    kpi_id: string;
    direction: 'increase' | 'decrease' | 'stabilize';
    magnitude?: string;
    timeframe?: string;
  }[];
}

export interface TimeSlice {
  start: string;
  end: string;
  granularity: 'year' | 'quarter' | 'month' | 'week' | 'day';
  label?: string;
}

export interface RegionReference {
  code: string;
  name: string;
  type: 'country' | 'region' | 'municipality' | 'city';
  parent_code?: string;
  nuts_code?: string;
}

// ============================================================
// CC1: METHOD AS FIRST-CLASS OBJECT
// ============================================================

export interface GDSPMethod extends GDSPBaseObject {
  _object_type: 'Method';
  method_id: string;
  name: string;
  version: string;
  description: string;
  
  // Detailed methodology
  procedure: string;
  formula?: string;
  parameters?: Record<string, unknown>;
  
  // Critical transparency
  assumptions: string[];
  limitations: string[];
  edge_cases: string[];
  
  // Academic references
  references: {
    type: 'paper' | 'book' | 'standard' | 'documentation';
    citation: string;
    url?: string;
  }[];
  
  // Reproducibility
  reproducibility_score: number;  // 0-1
  code_available: boolean;
  code_url?: string;
  
  // Versioning
  previous_versions: string[];
  breaking_changes?: string[];
  deprecation_date?: string;
}

// ============================================================
// CC2: METHOD COMPARISON
// ============================================================

export interface MethodComparison {
  method_a: GDSPMethod;
  method_b: GDSPMethod;
  
  differences: {
    category: 'assumptions' | 'procedure' | 'parameters' | 'limitations';
    description: string;
    impact: 'major' | 'moderate' | 'minor';
  }[];
  
  outcome_comparison?: {
    sample_data: string;
    result_a: number;
    result_b: number;
    difference: number;
    difference_percent: number;
  };
  
  recommendation?: string;
}

// ============================================================
// VALIDATION FUNCTIONS
// ============================================================

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateGDSPObject(obj: unknown): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!obj || typeof obj !== 'object') {
    return { valid: false, errors: ['Object is null or not an object'], warnings: [] };
  }

  const o = obj as Record<string, unknown>;

  // Check mandatory fields
  if (!o._gdsp_version) errors.push('Missing _gdsp_version');
  if (!o._object_type) errors.push('Missing _object_type');
  if (!o.source) errors.push('Missing source attribution');
  if (!o.method) errors.push('Missing method reference');
  if (!o.confidence) errors.push('Missing confidence level');
  if (!o.coverage) errors.push('Missing coverage description');
  if (!o.last_updated) errors.push('Missing last_updated');
  if (!o.version) errors.push('Missing version');

  // Validate source if present
  if (o.source) {
    const source = o.source as Record<string, unknown>;
    if (!source.name) errors.push('Source missing name');
    if (!source.url) errors.push('Source missing URL');
    if (!source.license) warnings.push('Source missing license information');
  }

  // Validate method if present
  if (o.method) {
    const method = o.method as Record<string, unknown>;
    if (!method.method_id) errors.push('Method missing method_id');
    if (!method.registry_url) warnings.push('Method missing registry URL');
  }

  // Validate confidence if present
  if (o.confidence) {
    const conf = o.confidence as Record<string, unknown>;
    const score = conf.score as number;
    if (typeof score !== 'number' || score < 0 || score > 1) {
      errors.push('Confidence score must be between 0 and 1');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

export function createMandatoryFields(params: {
  sourceName: string;
  sourceOrg: string;
  sourceUrl: string;
  license: string;
  methodId: string;
  methodName: string;
  confidence: number;
  coverageType: 'global' | 'national' | 'regional';
  countryCodes: string[];
  periodStart: string;
  periodEnd: string;
}): MandatoryFields {
  return {
    source: {
      name: params.sourceName,
      organization: params.sourceOrg,
      url: params.sourceUrl,
      license: params.license,
      accessed_at: new Date().toISOString()
    },
    method: {
      method_id: params.methodId,
      name: params.methodName,
      version: '1.0.0',
      registry_url: `https://gdsp.example.org/methods/${params.methodId}`
    },
    confidence: {
      score: params.confidence,
      level: params.confidence >= 0.8 ? 'high' : params.confidence >= 0.5 ? 'medium' : 'low',
      factors: [],
      limitations: []
    },
    coverage: {
      geographic: {
        type: params.coverageType,
        codes: params.countryCodes
      },
      temporal: {
        start: params.periodStart,
        end: params.periodEnd,
        granularity: 'yearly'
      }
    },
    last_updated: new Date().toISOString(),
    version: '1.0.0'
  };
}

// ============================================================
// METHOD REGISTRY
// ============================================================

export const STANDARD_METHODS: GDSPMethod[] = [
  {
    _gdsp_version: G_DSP_VERSION,
    _object_type: 'Method',
    _created_at: '2024-01-01T00:00:00Z',
    _updated_at: '2024-01-01T00:00:00Z',
    method_id: 'weighted_average_v1',
    name: 'Weighted Average',
    version: '1.0.0',
    description: 'Standard weighted average aggregation',
    procedure: 'Sum of (value × weight) divided by sum of weights',
    formula: 'Σ(value_i × weight_i) / Σ(weight_i)',
    assumptions: [
      'Weights sum to 1 or are normalized',
      'Values are on comparable scales',
      'Missing values are excluded'
    ],
    limitations: [
      'Sensitive to extreme values',
      'Assumes linear relationships'
    ],
    edge_cases: [
      'All weights zero: returns undefined',
      'Single value: returns that value'
    ],
    references: [],
    reproducibility_score: 1.0,
    code_available: true,
    code_url: 'https://github.com/example/gdsp-methods',
    previous_versions: []
  },
  {
    _gdsp_version: G_DSP_VERSION,
    _object_type: 'Method',
    _created_at: '2024-01-01T00:00:00Z',
    _updated_at: '2024-01-01T00:00:00Z',
    method_id: 'minmax_normalization_v1',
    name: 'Min-Max Normalization',
    version: '1.0.0',
    description: 'Scales values to 0-1 range based on observed min/max',
    procedure: '(value - min) / (max - min)',
    formula: '(x - x_min) / (x_max - x_min)',
    assumptions: [
      'Min and max are known or observable',
      'Distribution is roughly uniform'
    ],
    limitations: [
      'Sensitive to outliers',
      'New data may exceed original min/max'
    ],
    edge_cases: [
      'min = max: returns 0.5',
      'value outside range: clamp to 0 or 1'
    ],
    references: [],
    reproducibility_score: 1.0,
    code_available: true,
    previous_versions: []
  },
  {
    _gdsp_version: G_DSP_VERSION,
    _object_type: 'Method',
    _created_at: '2024-01-01T00:00:00Z',
    _updated_at: '2024-01-01T00:00:00Z',
    method_id: 'pearson_correlation_v1',
    name: 'Pearson Correlation',
    version: '1.0.0',
    description: 'Measures linear correlation between two variables',
    procedure: 'Covariance divided by product of standard deviations',
    formula: 'cov(X,Y) / (σ_X × σ_Y)',
    assumptions: [
      'Linear relationship',
      'Continuous variables',
      'No significant outliers',
      'Bivariate normal distribution (for inference)'
    ],
    limitations: [
      'Only detects linear relationships',
      'Sensitive to outliers',
      'Does not imply causation'
    ],
    edge_cases: [
      'Constant variable: undefined',
      'Perfect correlation: ±1'
    ],
    references: [
      {
        type: 'paper',
        citation: 'Pearson, K. (1895). Notes on regression and inheritance in the case of two parents.'
      }
    ],
    reproducibility_score: 1.0,
    code_available: true,
    previous_versions: []
  }
];
