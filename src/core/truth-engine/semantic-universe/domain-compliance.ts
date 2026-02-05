/**
 * DOMAIN COMPLIANCE RULES
 * 
 * Full compliance by design, not post-hoc control.
 * Enforced in prompt + schema + CI.
 */

import type { DomainCode } from '../usae/mao/unified-body';

/**
 * COMPLIANCE RULE
 */
export interface ComplianceRule {
  readonly id: string;
  readonly type: 'forbidden' | 'required' | 'conditional';
  readonly description: string;
  readonly enforcement: 'prompt' | 'schema' | 'runtime' | 'all';
  readonly violation_response: 'block' | 'warn' | 'flag';
}

/**
 * DOMAIN COMPLIANCE CONFIG
 */
export interface DomainComplianceConfig {
  readonly domain: DomainCode;
  readonly sensitivity_level: 'standard' | 'elevated' | 'high';
  readonly forbidden: readonly ComplianceRule[];
  readonly required: readonly ComplianceRule[];
  readonly conditional: readonly ComplianceRule[];
  readonly crisis_protocol?: string;
}

/**
 * MEDICAL/HEALTHCARE COMPLIANCE
 */
export const MEDICINE_COMPLIANCE: DomainComplianceConfig = {
  domain: 'medicine',
  sensitivity_level: 'high',
  forbidden: [
    {
      id: 'no_diagnosis',
      type: 'forbidden',
      description: 'No individual diagnosis or diagnostic suggestions',
      enforcement: 'all',
      violation_response: 'block',
    },
    {
      id: 'no_treatment_advice',
      type: 'forbidden',
      description: 'No treatment recommendations or medication suggestions',
      enforcement: 'all',
      violation_response: 'block',
    },
    {
      id: 'no_individual_prediction',
      type: 'forbidden',
      description: 'No predictions about individual patient outcomes',
      enforcement: 'all',
      violation_response: 'block',
    },
    {
      id: 'no_emergency_advice',
      type: 'forbidden',
      description: 'No guidance on emergency medical situations',
      enforcement: 'all',
      violation_response: 'block',
    },
  ],
  required: [
    {
      id: 'population_level_only',
      type: 'required',
      description: 'All data must be population-level aggregates',
      enforcement: 'schema',
      violation_response: 'block',
    },
    {
      id: 'consult_professional',
      type: 'required',
      description: 'Include professional consultation disclaimer',
      enforcement: 'prompt',
      violation_response: 'warn',
    },
  ],
  conditional: [
    {
      id: 'source_citation',
      type: 'conditional',
      description: 'Clinical data requires source citation',
      enforcement: 'runtime',
      violation_response: 'flag',
    },
  ],
};

/**
 * FINANCIAL/MARKET COMPLIANCE
 */
export const MARKETS_COMPLIANCE: DomainComplianceConfig = {
  domain: 'markets',
  sensitivity_level: 'high',
  forbidden: [
    {
      id: 'no_buy_sell',
      type: 'forbidden',
      description: 'No buy, sell, or hold recommendations',
      enforcement: 'all',
      violation_response: 'block',
    },
    {
      id: 'no_price_prediction',
      type: 'forbidden',
      description: 'No price predictions without scenario flag',
      enforcement: 'all',
      violation_response: 'block',
    },
    {
      id: 'no_investment_advice',
      type: 'forbidden',
      description: 'No investment advice or portfolio suggestions',
      enforcement: 'all',
      violation_response: 'block',
    },
    {
      id: 'no_timing_advice',
      type: 'forbidden',
      description: 'No market timing recommendations',
      enforcement: 'all',
      violation_response: 'block',
    },
  ],
  required: [
    {
      id: 'historical_only',
      type: 'required',
      description: 'Default to historical data, not projections',
      enforcement: 'schema',
      violation_response: 'block',
    },
    {
      id: 'past_performance_disclaimer',
      type: 'required',
      description: 'Include past performance disclaimer',
      enforcement: 'prompt',
      violation_response: 'warn',
    },
  ],
  conditional: [
    {
      id: 'scenario_flag',
      type: 'conditional',
      description: 'Projections require explicit scenario flag',
      enforcement: 'runtime',
      violation_response: 'block',
    },
  ],
};

/**
 * YOUTH/PSYCHOLOGY COMPLIANCE
 */
export const YOUTH_COMPLIANCE: DomainComplianceConfig = {
  domain: 'youth',
  sensitivity_level: 'elevated',
  forbidden: [
    {
      id: 'no_individual_diagnosis',
      type: 'forbidden',
      description: 'No individual psychological diagnosis',
      enforcement: 'all',
      violation_response: 'block',
    },
    {
      id: 'no_pathologizing',
      type: 'forbidden',
      description: 'No pathologizing language',
      enforcement: 'prompt',
      violation_response: 'block',
    },
  ],
  required: [
    {
      id: 'normalization',
      type: 'required',
      description: 'Include normalization messages (you are not alone)',
      enforcement: 'prompt',
      violation_response: 'warn',
    },
    {
      id: 'safe_language',
      type: 'required',
      description: 'Use safe, non-stigmatizing language',
      enforcement: 'prompt',
      violation_response: 'warn',
    },
  ],
  conditional: [],
  crisis_protocol: 'crisis_fallback',
};

/**
 * ECONOMY COMPLIANCE
 */
export const ECONOMY_COMPLIANCE: DomainComplianceConfig = {
  domain: 'economy',
  sensitivity_level: 'standard',
  forbidden: [
    {
      id: 'no_policy_recommendation',
      type: 'forbidden',
      description: 'No policy recommendations',
      enforcement: 'all',
      violation_response: 'block',
    },
    {
      id: 'no_political_attribution',
      type: 'forbidden',
      description: 'No political attribution of outcomes',
      enforcement: 'all',
      violation_response: 'block',
    },
  ],
  required: [
    {
      id: 'methodology_transparency',
      type: 'required',
      description: 'Include methodology notes for calculations',
      enforcement: 'schema',
      violation_response: 'flag',
    },
  ],
  conditional: [],
};

/**
 * ALL DOMAIN COMPLIANCE CONFIGS
 */
export const DOMAIN_COMPLIANCE: Record<string, DomainComplianceConfig> = {
  medicine: MEDICINE_COMPLIANCE,
  healthcare: MEDICINE_COMPLIANCE, // Same rules
  markets: MARKETS_COMPLIANCE,
  economy: ECONOMY_COMPLIANCE,
  youth: YOUTH_COMPLIANCE,
};

/**
 * GET COMPLIANCE CONFIG
 */
export function getComplianceConfig(domain: string): DomainComplianceConfig | null {
  return DOMAIN_COMPLIANCE[domain] ?? null;
}

/**
 * CHECK DOMAIN COMPLIANCE
 */
export function checkDomainCompliance(
  domain: string,
  content: string
): {
  compliant: boolean;
  blocked: boolean;
  violations: string[];
  warnings: string[];
} {
  const config = getComplianceConfig(domain);
  if (!config) {
    return { compliant: true, blocked: false, violations: [], warnings: [] };
  }
  
  const violations: string[] = [];
  const warnings: string[] = [];
  let blocked = false;
  
  // Check forbidden rules
  for (const rule of config.forbidden) {
    // Simplified check - in production, use more sophisticated detection
    const patterns: Record<string, RegExp> = {
      no_diagnosis: /\b(diagnose|diagnosis|you have|you might have)\b/i,
      no_treatment_advice: /\b(take|prescribe|treatment for you|medication)\b/i,
      no_buy_sell: /\b(buy|sell|hold|invest in|divest)\b/i,
      no_price_prediction: /\b(will be worth|will reach|price will)\b/i,
      no_policy_recommendation: /\b(policy should|government must|we need to)\b/i,
    };
    
    const pattern = patterns[rule.id];
    if (pattern && pattern.test(content)) {
      if (rule.violation_response === 'block') {
        violations.push(rule.description);
        blocked = true;
      } else {
        warnings.push(rule.description);
      }
    }
  }
  
  return {
    compliant: violations.length === 0,
    blocked,
    violations,
    warnings,
  };
}
