/**
 * COMPUTATIONAL CORRELATION LAYER
 * Types for cross-domain correlation analysis
 * 
 * RULE: System identifies co-movement and covariation – never motive, intent, or cause.
 */

// Domain separation (kept analytically distinct)
export type CorrelationDomain = 
  | 'health_outcomes'    // A: Deaths, excess mortality, hospitalizations
  | 'policy_actions'     // B: Vaccinations, restrictions, testing
  | 'macro_economy'      // C: GDP, unemployment, spending
  | 'sector_economics';  // D: Market performance, revenue (sector level)

export interface DomainVariable {
  id: string;
  domain: CorrelationDomain;
  code: string;
  name: string;
  description: string;
  unit: string;
  dataSourceCode: string;
  isInverted?: boolean; // Lower is better
  granularity: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
}

export interface TimeSeriesPoint {
  date: string;
  value: number;
  isInterpolated?: boolean;
  isPreliminary?: boolean;
}

export interface CorrelationPair {
  variableA: DomainVariable;
  variableB: DomainVariable;
  periodStart: string;
  periodEnd: string;
  
  // Statistical measures (mathematics, not narrative)
  correlation: number;           // Pearson r
  correlationSpearman?: number;  // Spearman rho (rank-based)
  pValue: number;
  sampleSize: number;
  
  // Stability assessment
  stabilityScore: number;        // 0-1: how consistent across subperiods
  subperiodCorrelations: number[];
  
  // Time relationship
  lagDays?: number;              // If cross-correlation detected lag
  leadLagDirection?: 'A_leads' | 'B_leads' | 'simultaneous' | 'unclear';
  
  // Confidence classification
  confidenceLevel: 'high' | 'medium' | 'low' | 'insufficient';
}

// Anti-cherry-picking: what else moved
export interface CoMovementContext {
  targetPair: CorrelationPair;
  period: { start: string; end: string };
  
  // Other variables that also moved
  alsoMoved: {
    variable: DomainVariable;
    correlation: number;
    direction: 'same' | 'opposite';
  }[];
  
  // Variables that did NOT move
  didNotMove: {
    variable: DomainVariable;
    correlation: number; // Should be near zero
  }[];
}

// Allowed system language (locked vocabulary)
export type SystemStatement = 
  | { type: 'observed'; description: string }
  | { type: 'not_observed'; description: string }
  | { type: 'varies'; by: 'country' | 'age' | 'period' | 'region'; description: string }
  | { type: 'insufficient_data'; reason: string }
  | { type: 'correlation_present'; strength: 'strong' | 'moderate' | 'weak'; stable: boolean }
  | { type: 'correlation_absent' }
  | { type: 'correlation_unstable'; description: string };

// Forbidden language patterns (blocked in code)
export const FORBIDDEN_LANGUAGE_PATTERNS = [
  /caused by/i,
  /led to/i,
  /resulted in/i,
  /due to/i,
  /because of/i,
  /benefited from/i,
  /profited from/i,
  /exploited/i,
  /took advantage/i,
  /gynnades/i,
  /orsakades/i,
  /ledde till/i,
  /berodde på/i,
  /tjänade på/i,
  /utnyttjade/i,
];

// Domain configuration
export const DOMAIN_CONFIGS: Record<CorrelationDomain, {
  name: string;
  nameSv: string;
  description: string;
  color: string;
}> = {
  health_outcomes: {
    name: 'Health Outcomes',
    nameSv: 'Hälsoutfall',
    description: 'Observed health metrics: deaths, excess mortality, hospitalizations',
    color: 'hsl(var(--destructive))',
  },
  policy_actions: {
    name: 'Policy & Actions',
    nameSv: 'Åtgärder & Policy',
    description: 'Time-marked interventions: vaccinations, restrictions, testing strategies',
    color: 'hsl(var(--primary))',
  },
  macro_economy: {
    name: 'Macro Economy',
    nameSv: 'Makroekonomi',
    description: 'Economic aggregates: GDP, unemployment, government spending',
    color: 'hsl(var(--accent))',
  },
  sector_economics: {
    name: 'Sector Economics',
    nameSv: 'Sektorekonomi',
    description: 'Sector-level performance (not individual companies by default)',
    color: 'hsl(var(--muted-foreground))',
  },
};
