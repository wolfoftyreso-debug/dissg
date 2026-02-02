/**
 * ATTRIBUTION CONFIDENCE FRAMEWORK
 * 
 * Standardized schema for expressing how confident we are
 * about cause-effect relationships in environmental data.
 * 
 * Inspired by IPCC methodology but simplified for public use.
 */

import type { AttributionConfidence } from './types';

/**
 * Attribution confidence levels with explicit criteria
 */
export const ATTRIBUTION_LEVELS = {
  very_high: {
    label: { en: 'Very High', sv: 'Mycket hög' },
    description: { 
      en: 'Multiple independent lines of evidence all pointing to the same conclusion',
      sv: 'Flera oberoende bevislinjer pekar alla mot samma slutsats'
    },
    criteria: [
      'Observed in multiple independent datasets',
      'Consistent across different regions/time periods',
      'Physical mechanism well understood',
      'No significant alternative explanations remain',
      'Expert agreement >90%',
    ],
    color: 'hsl(var(--chart-2))',
    minScore: 0.9,
  },
  
  high: {
    label: { en: 'High', sv: 'Hög' },
    description: {
      en: 'Strong evidence from multiple sources with minor uncertainties',
      sv: 'Starkt stöd från flera källor med mindre osäkerheter'
    },
    criteria: [
      'Observed in multiple datasets',
      'Generally consistent patterns',
      'Mechanism largely understood',
      'Alternative explanations unlikely',
      'Expert agreement 70-90%',
    ],
    color: 'hsl(var(--chart-2) / 0.7)',
    minScore: 0.7,
  },
  
  medium: {
    label: { en: 'Medium', sv: 'Måttlig' },
    description: {
      en: 'Evidence suggests relationship but significant uncertainties remain',
      sv: 'Evidens antyder samband men betydande osäkerheter kvarstår'
    },
    criteria: [
      'Observed in some datasets',
      'Patterns show regional/temporal variation',
      'Mechanism partially understood',
      'Alternative explanations possible',
      'Expert agreement 50-70%',
    ],
    color: 'hsl(var(--warning))',
    minScore: 0.5,
  },
  
  low: {
    label: { en: 'Low', sv: 'Låg' },
    description: {
      en: 'Limited evidence, substantial uncertainties, multiple possible explanations',
      sv: 'Begränsad evidens, betydande osäkerheter, flera möjliga förklaringar'
    },
    criteria: [
      'Observed in limited datasets',
      'Inconsistent patterns',
      'Mechanism poorly understood',
      'Multiple alternative explanations',
      'Expert agreement 30-50%',
    ],
    color: 'hsl(var(--destructive) / 0.7)',
    minScore: 0.3,
  },
  
  very_low: {
    label: { en: 'Very Low', sv: 'Mycket låg' },
    description: {
      en: 'Insufficient evidence to make claims, high uncertainty',
      sv: 'Otillräcklig evidens för påståenden, hög osäkerhet'
    },
    criteria: [
      'Little to no observational support',
      'No consistent patterns',
      'Mechanism speculative',
      'Many alternative explanations equally plausible',
      'Expert agreement <30%',
    ],
    color: 'hsl(var(--destructive))',
    minScore: 0,
  },
} as const;

/**
 * Evidence types that inform attribution
 */
export const EVIDENCE_TYPES = {
  observed: {
    label: { en: 'Directly Observed', sv: 'Direkt observerat' },
    description: 'Measured with instruments, recorded in datasets',
    weight: 1.0,
  },
  modeled: {
    label: { en: 'Model-Derived', sv: 'Modellbaserat' },
    description: 'Calculated from climate/environmental models',
    weight: 0.7,
  },
  inferred: {
    label: { en: 'Inferred', sv: 'Infererat' },
    description: 'Deduced from indirect evidence or proxies',
    weight: 0.5,
  },
} as const;

/**
 * Agreement levels across scientific community
 */
export const AGREEMENT_LEVELS = {
  robust: {
    label: { en: 'Robust Agreement', sv: 'Robust samstämmighet' },
    description: 'Wide consensus across independent research groups',
    threshold: 0.8,
  },
  medium: {
    label: { en: 'Medium Agreement', sv: 'Måttlig samstämmighet' },
    description: 'General agreement with some dissenting views',
    threshold: 0.5,
  },
  limited: {
    label: { en: 'Limited Agreement', sv: 'Begränsad samstämmighet' },
    description: 'Significant disagreement or insufficient studies',
    threshold: 0,
  },
} as const;

/**
 * Calculate attribution confidence from components
 */
export function calculateAttributionConfidence(params: {
  evidenceType: keyof typeof EVIDENCE_TYPES;
  agreementLevel: keyof typeof AGREEMENT_LEVELS;
  observationalSupport: number; // 0-1
  mechanismUnderstood: number;  // 0-1
  alternativeExplanations: string[];
  keyUncertainties: string[];
}): AttributionConfidence {
  // Weight the factors
  const evidenceWeight = EVIDENCE_TYPES[params.evidenceType].weight;
  const agreementThreshold = AGREEMENT_LEVELS[params.agreementLevel].threshold;
  
  // Calculate composite score
  const score = (
    params.observationalSupport * 0.3 +
    params.mechanismUnderstood * 0.2 +
    evidenceWeight * 0.25 +
    agreementThreshold * 0.25
  ) * (1 - (params.alternativeExplanations.length * 0.05));
  
  // Determine level
  let level: AttributionConfidence['level'];
  if (score >= ATTRIBUTION_LEVELS.very_high.minScore) {
    level = 'very_high';
  } else if (score >= ATTRIBUTION_LEVELS.high.minScore) {
    level = 'high';
  } else if (score >= ATTRIBUTION_LEVELS.medium.minScore) {
    level = 'medium';
  } else if (score >= ATTRIBUTION_LEVELS.low.minScore) {
    level = 'low';
  } else {
    level = 'very_low';
  }
  
  return {
    level,
    evidenceType: params.evidenceType,
    agreementLevel: params.agreementLevel,
    alternativeExplanations: params.alternativeExplanations,
    keyUncertainties: params.keyUncertainties,
  };
}

/**
 * Generate human-readable attribution statement
 */
export function generateAttributionStatement(
  confidence: AttributionConfidence,
  language: 'en' | 'sv' = 'sv'
): string {
  const level = ATTRIBUTION_LEVELS[confidence.level];
  const evidence = EVIDENCE_TYPES[confidence.evidenceType];
  const agreement = AGREEMENT_LEVELS[confidence.agreementLevel];
  
  if (language === 'sv') {
    return `Attribueringskonfidens: ${level.label.sv}. ` +
           `Evidenstyp: ${evidence.label.sv}. ` +
           `Vetenskaplig samstämmighet: ${agreement.label.sv}. ` +
           (confidence.alternativeExplanations.length > 0 
             ? `Alternativa förklaringar finns: ${confidence.alternativeExplanations.join(', ')}. `
             : '') +
           (confidence.keyUncertainties.length > 0
             ? `Huvudsakliga osäkerheter: ${confidence.keyUncertainties.join(', ')}.`
             : '');
  }
  
  return `Attribution confidence: ${level.label.en}. ` +
         `Evidence type: ${evidence.label.en}. ` +
         `Scientific agreement: ${agreement.label.en}. ` +
         (confidence.alternativeExplanations.length > 0 
           ? `Alternative explanations exist: ${confidence.alternativeExplanations.join(', ')}. `
           : '') +
         (confidence.keyUncertainties.length > 0
           ? `Key uncertainties: ${confidence.keyUncertainties.join(', ')}.`
           : '');
}

/**
 * Get confidence level badge properties
 */
export function getConfidenceBadgeProps(level: AttributionConfidence['level']): {
  label: string;
  color: string;
  className: string;
} {
  const config = ATTRIBUTION_LEVELS[level];
  return {
    label: config.label.sv,
    color: config.color,
    className: level === 'very_high' || level === 'high' 
      ? 'border-chart-2 text-chart-2'
      : level === 'medium'
        ? 'border-warning text-warning'
        : 'border-destructive text-destructive',
  };
}
