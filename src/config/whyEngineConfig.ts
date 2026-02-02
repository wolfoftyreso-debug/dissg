/**
 * WAVE 6 — BLOCK AZ: WHY ENGINE
 * 
 * Svarar på frågan "VARFÖR?" utan storytelling.
 * Endast data, tidsordning, styrka, osäkerhet.
 */

export interface CausalFactor {
  id: string;
  name: string;
  kpiId?: string;
  movedAt: string; // ISO date
  movementDirection: 'up' | 'down' | 'volatile';
  movementMagnitude: number; // percentage
  precedesOutcome: boolean;
  lagMonths: number;
  strength: number; // 0-1
  uncertainty: number; // 0-1
}

export interface CausalChain {
  id: string;
  chainCode: string;
  outcomeDescription: string;
  
  // Chain structure (ordered by time)
  steps: CausalFactor[];
  
  // Timing
  firstMovementDate: string;
  outcomeObservedDate: string;
  totalChainDurationMonths: number;
  
  // Confidence
  chainConfidence: number;
  uncertaintyFactors: string[];
  alternativeExplanations: AlternativeExplanation[];
  
  // Linkage
  relatedKpiIds: string[];
  relatedActionIds: string[];
}

export interface AlternativeExplanation {
  description: string;
  plausibility: number; // 0-1
  evidenceFor: string[];
  evidenceAgainst: string[];
}

/**
 * Why-engine response structure
 */
export interface WhyResponse {
  outcome: string;
  chain: CausalChain;
  
  // What moved first
  firstMover: {
    factor: string;
    when: string;
    magnitude: string;
  };
  
  // What followed
  subsequentChanges: Array<{
    factor: string;
    when: string;
    magnitude: string;
    lagFromFirst: number;
  }>;
  
  // Time order visualization
  timeline: Array<{
    date: string;
    event: string;
    type: 'factor' | 'outcome' | 'context';
  }>;
  
  // Uncertainty disclosure
  uncertainty: {
    overall: number;
    factors: string[];
    caveats: string[];
  };
}

/**
 * Creates a timeline from causal chain
 */
export function buildCausalTimeline(chain: CausalChain): WhyResponse['timeline'] {
  const events: WhyResponse['timeline'] = [];
  
  // Add factor movements
  for (const step of chain.steps) {
    events.push({
      date: step.movedAt,
      event: `${step.name}: ${step.movementDirection === 'up' ? '+' : '-'}${Math.abs(step.movementMagnitude).toFixed(1)}%`,
      type: 'factor'
    });
  }
  
  // Add outcome
  events.push({
    date: chain.outcomeObservedDate,
    event: chain.outcomeDescription,
    type: 'outcome'
  });
  
  // Sort by date
  return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

/**
 * Calculate overall chain uncertainty
 */
export function calculateChainUncertainty(chain: CausalChain): number {
  if (chain.steps.length === 0) return 1;
  
  // Compound uncertainties
  let compoundedConfidence = 1;
  for (const step of chain.steps) {
    compoundedConfidence *= (1 - step.uncertainty);
  }
  
  // Factor in alternative explanations
  const altExplanationPenalty = chain.alternativeExplanations
    .reduce((sum, alt) => sum + alt.plausibility * 0.1, 0);
  
  return 1 - Math.max(0, compoundedConfidence - altExplanationPenalty);
}

/**
 * Neutral language templates for "why" explanations
 */
export const WHY_LANGUAGE_TEMPLATES = {
  first_mover: 'Första observerade förändringen: {factor} ({direction}{magnitude}%) vid {date}.',
  subsequent: 'Efterföljande: {factor} ({direction}{magnitude}%) med {lag} månaders fördröjning.',
  outcome: 'Utfall: {outcome} observerades {date}.',
  uncertainty_high: 'Analysen har hög osäkerhet på grund av: {factors}.',
  uncertainty_moderate: 'Analysen har moderat osäkerhet. Observera: {caveats}.',
  alternative: 'Alternativ förklaring ({plausibility}% plausibel): {description}.'
} as const;

/**
 * Generates a neutral "why" explanation
 */
export function generateWhyExplanation(chain: CausalChain): string {
  const lines: string[] = [];
  const timeline = buildCausalTimeline(chain);
  
  // First mover
  if (chain.steps.length > 0) {
    const first = chain.steps[0];
    lines.push(
      `Första observerade förändringen: ${first.name} ` +
      `(${first.movementDirection === 'up' ? '+' : '-'}${Math.abs(first.movementMagnitude).toFixed(1)}%) ` +
      `vid ${first.movedAt}.`
    );
  }
  
  // Subsequent factors
  for (let i = 1; i < chain.steps.length; i++) {
    const step = chain.steps[i];
    lines.push(
      `Efterföljande: ${step.name} ` +
      `(${step.movementDirection === 'up' ? '+' : '-'}${Math.abs(step.movementMagnitude).toFixed(1)}%) ` +
      `med ${step.lagMonths} månaders fördröjning från första förändringen.`
    );
  }
  
  // Outcome
  lines.push(`Utfall: ${chain.outcomeDescription} observerades ${chain.outcomeObservedDate}.`);
  
  // Uncertainty
  const uncertainty = calculateChainUncertainty(chain);
  if (uncertainty > 0.5) {
    lines.push(`\nAnalysen har hög osäkerhet (${(uncertainty * 100).toFixed(0)}%) på grund av: ${chain.uncertaintyFactors.join(', ')}.`);
  } else if (uncertainty > 0.3) {
    lines.push(`\nAnalysen har moderat osäkerhet (${(uncertainty * 100).toFixed(0)}%).`);
  }
  
  // Alternatives
  for (const alt of chain.alternativeExplanations.filter(a => a.plausibility > 0.2)) {
    lines.push(`\nAlternativ förklaring (${(alt.plausibility * 100).toFixed(0)}% plausibel): ${alt.description}`);
  }
  
  return lines.join('\n');
}

/**
 * Strength indicators for UI
 */
export const STRENGTH_INDICATORS = {
  strong: { min: 0.7, label: 'Stark koppling', color: 'status-positive' },
  moderate: { min: 0.4, label: 'Moderat koppling', color: 'status-warning' },
  weak: { min: 0.2, label: 'Svag koppling', color: 'muted-foreground' },
  unclear: { min: 0, label: 'Oklar koppling', color: 'status-critical' }
} as const;

export function getStrengthIndicator(strength: number) {
  if (strength >= STRENGTH_INDICATORS.strong.min) return STRENGTH_INDICATORS.strong;
  if (strength >= STRENGTH_INDICATORS.moderate.min) return STRENGTH_INDICATORS.moderate;
  if (strength >= STRENGTH_INDICATORS.weak.min) return STRENGTH_INDICATORS.weak;
  return STRENGTH_INDICATORS.unclear;
}
