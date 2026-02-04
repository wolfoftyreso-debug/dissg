/**
 * AI GOVERNANCE: Allowed Expression Patterns
 * 
 * OEM-class diagnostic system.
 * AI may ONLY use these expression types.
 */

// =============================================================================
// ALLOWED EXPRESSION CATEGORIES
// =============================================================================

export type AllowedExpressionType =
  | 'measurement'      // Raw values with units
  | 'deviation'        // Deviation from setpoint/tolerance
  | 'tolerance'        // Tolerance ranges
  | 'historical'       // Historical comparisons
  | 'correlation'      // Statistical correlations
  | 'probability'      // Probability intervals
  | 'limitation'       // Data limitations
  | 'uncertainty'      // Uncertainty declarations
  | 'reference'        // Source references
  | 'procedural';      // Guided step instructions

// =============================================================================
// EXPRESSION TEMPLATES
// =============================================================================

export const ALLOWED_EXPRESSION_TEMPLATES: Record<AllowedExpressionType, string[]> = {
  measurement: [
    'Parameter {param} visar värdet {value} {unit}.',
    'Mätvärdet för {param} är {value} {unit}.',
    'Observerat värde: {value} {unit}.',
    'Aktuellt värde ligger på {value} {unit}.',
  ],
  
  deviation: [
    'Avviker {percent}% från börvärde ({setpoint}).',
    '{param} ligger {percent}% {direction} normalintervallet.',
    'Avvikelse från tolerans: {deviation} {unit}.',
    'Utanför toleransintervallet {min}–{max}.',
  ],
  
  tolerance: [
    'Toleransintervall: {min}–{max} {unit}.',
    'Börvärde: {setpoint} (±{tolerance}).',
    'Acceptabelt intervall: {range}.',
    'Inom/utanför tolerans baserat på definition {ref}.',
  ],
  
  historical: [
    'Historisk jämförelse: {current} vs {historical} ({period}).',
    'Förändring sedan {year}: {change}%.',
    'Trend {period}: {direction} {magnitude}%.',
    'Jämfört med {baseline_period}: {comparison}.',
  ],
  
  correlation: [
    'Korrelation med {param_b}: {correlation} (n={sample_size}).',
    'Samvariation observerad: {description}.',
    'Korrelationskoefficient: {r} (p={p_value}).',
    'Ingen signifikant korrelation detekterad.',
  ],
  
  probability: [
    'Sannolikhetsintervall: {lower}%–{upper}%.',
    'Konfidensintervall ({ci}%): {range}.',
    'Estimerad sannolikhet: {probability}% (±{margin}).',
    'Baserat på {n} observationer över {years} år.',
  ],
  
  limitation: [
    'Data saknas för {parameter} under {period}.',
    'Begränsning: {description}.',
    'Otillräcklig datatäckning ({coverage}%).',
    'Metodändring vid {date} påverkar jämförbarhet.',
  ],
  
  uncertainty: [
    'Osäkerhet: ±{uncertainty} {unit}.',
    'Datakvalitet: {quality_score}/100.',
    'Källkonflikt: {source_a} vs {source_b}.',
    'Kan ej fastställas med tillgänglig data.',
  ],
  
  reference: [
    'Källa: {source} ({year}).',
    'Metod: {methodology}.',
    'Senast uppdaterad: {date}.',
    'Definition enligt: {standard}.',
  ],
  
  procedural: [
    'Nästa steg: {step_description}.',
    'För att fortsätta, granska {component}.',
    'Obligatoriskt steg: {step}.',
    'Kontrollschema kräver verifiering av {item}.',
  ],
};

// =============================================================================
// ALLOWED SENTENCE STARTERS
// =============================================================================

export const ALLOWED_SENTENCE_STARTERS = [
  // Observational
  'Data visar',
  'Observerat värde',
  'Mätblocket indikerar',
  'Historisk trend',
  'Korrelation observerad',
  
  // Neutral descriptive
  'Parameter',
  'Värdet',
  'Avvikelsen',
  'Toleransintervallet',
  'Datakällan',
  
  // Procedural
  'Nästa steg',
  'För att fortsätta',
  'Kontrollschema',
  'Obligatoriskt',
  
  // Limitation
  'Data saknas',
  'Osäkerhet',
  'Begränsning',
  'Kan ej fastställas',
  'Otillräcklig',
] as const;

// =============================================================================
// RESPONSE STRUCTURE VALIDATOR
// =============================================================================

export interface LayeredResponse {
  layer1_observation: {
    rawData: string[];
    noInterpretation: boolean;
  };
  layer2_constraints: {
    verifiedRelationships: string[];
    uncertainRelationships: string[];
    unknownRelationships: string[];
    dataLimitations: string[];
  };
}

export function validateLayeredResponse(response: unknown): response is LayeredResponse {
  if (typeof response !== 'object' || response === null) {
    return false;
  }
  
  const r = response as Record<string, unknown>;
  
  // Check layer 1
  if (!r.layer1_observation || typeof r.layer1_observation !== 'object') {
    return false;
  }
  
  // Check layer 2
  if (!r.layer2_constraints || typeof r.layer2_constraints !== 'object') {
    return false;
  }
  
  return true;
}
