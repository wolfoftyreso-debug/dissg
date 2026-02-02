/**
 * MODULE — TRADE-OFF VISUALIZER (TOV)
 * "Vad förbättras – och vad försämras – när fokus flyttas?"
 * 
 * Konsekvensmotorn. Tar bort illusionen att man kan "lösa allt samtidigt"
 * och visar reella samband mellan val, resurser och utfall.
 * 
 * SYSTEMFRÅGA:
 * "Vilka observerade konsekvenser följer historiskt och strukturellt 
 * när uppmärksamhet, resurser eller policyfokus flyttas från X till Y?"
 * 
 * FOKUS: relationer, inte rekommendationer.
 */

import type { WorldRegion } from './globalPrioritySynthesisConfig';

// ═══════════════════════════════════════════════════════════════
// KÄRNPRINCIP (ALDRIG BRYT)
// ═══════════════════════════════════════════════════════════════

export const TOV_CORE_PRINCIPLE = {
  statement: 'Alla beslut har konsekvenser. De flesta konsekvenser syns inte samtidigt. Systemets jobb är att visa dem.',
  statementEn: 'All decisions have consequences. Most consequences are not visible simultaneously. The system\'s job is to show them.',
  enforced: true,
  
  system_question: {
    sv: 'Vilka observerade konsekvenser följer historiskt och strukturellt när uppmärksamhet, resurser eller policyfokus flyttas från X till Y?',
    en: 'What observed consequences historically and structurally follow when attention, resources, or policy focus shifts from X to Y?',
  },
  
  focus: ['relationships', 'not_recommendations'],
  
  mandatory_disclaimer: {
    text_sv: 'Visualiseringen visar observerade samband, inte önskvärda val. Utfallet beror på kontext, genomförande och samtidiga faktorer.',
    text_en: 'The visualization shows observed relationships, not desirable choices. Outcomes depend on context, implementation, and concurrent factors.',
    display: 'always_visible',
  },
} as const;

// ═══════════════════════════════════════════════════════════════
// BLOCK OA — TRADE-OFF GRAPH (SYSTEM CORE)
// ═══════════════════════════════════════════════════════════════

export type TradeOffDomain = 
  | 'energy'
  | 'health'
  | 'economy'
  | 'education'
  | 'environment'
  | 'institutional_capacity'
  | 'social_cohesion'
  | 'innovation';

export interface DomainNode {
  id: TradeOffDomain;
  name: string;
  nameSv: string;
  description: string;
  descriptionSv: string;
  color: string;
  icon?: string;
}

export const DOMAIN_NODES: DomainNode[] = [
  {
    id: 'energy',
    name: 'Energy',
    nameSv: 'Energi',
    description: 'Energy systems, supply, and infrastructure',
    descriptionSv: 'Energisystem, tillgång och infrastruktur',
    color: 'hsl(var(--chart-1))',
  },
  {
    id: 'health',
    name: 'Health',
    nameSv: 'Hälsa',
    description: 'Public health, healthcare systems, wellbeing',
    descriptionSv: 'Folkhälsa, sjukvårdssystem, välbefinnande',
    color: 'hsl(var(--chart-2))',
  },
  {
    id: 'economy',
    name: 'Economy',
    nameSv: 'Ekonomi',
    description: 'Economic output, employment, stability',
    descriptionSv: 'Ekonomisk produktion, sysselsättning, stabilitet',
    color: 'hsl(var(--chart-3))',
  },
  {
    id: 'education',
    name: 'Education',
    nameSv: 'Utbildning',
    description: 'Education systems, skills, human capital',
    descriptionSv: 'Utbildningssystem, kompetens, humankapital',
    color: 'hsl(var(--chart-4))',
  },
  {
    id: 'environment',
    name: 'Environment',
    nameSv: 'Miljö',
    description: 'Environmental quality, ecosystems, resources',
    descriptionSv: 'Miljökvalitet, ekosystem, resurser',
    color: 'hsl(var(--chart-5))',
  },
  {
    id: 'institutional_capacity',
    name: 'Institutional Capacity',
    nameSv: 'Institutionell kapacitet',
    description: 'Government effectiveness, rule of law, trust',
    descriptionSv: 'Statens effektivitet, rättsstat, tillit',
    color: 'hsl(var(--info))',
  },
  {
    id: 'social_cohesion',
    name: 'Social Cohesion',
    nameSv: 'Social sammanhållning',
    description: 'Social trust, equality, community bonds',
    descriptionSv: 'Socialt förtroende, jämlikhet, gemenskapsband',
    color: 'hsl(var(--warning))',
  },
  {
    id: 'innovation',
    name: 'Innovation/Productivity',
    nameSv: 'Innovation/Produktivitet',
    description: 'Innovation capacity, R&D, productivity growth',
    descriptionSv: 'Innovationsförmåga, FoU, produktivitetstillväxt',
    color: 'hsl(var(--accent))',
  },
];

export type EdgeDirection = 'positive' | 'negative' | 'complex';
export type EvidenceBase = 'strong' | 'moderate' | 'weak' | 'contested';

export interface TradeOffEdge {
  id: string;
  from: TradeOffDomain;
  to: TradeOffDomain;
  
  // Direction of effect when 'from' increases
  direction: EdgeDirection;
  
  // Strength of relationship (0-1)
  strength: number;
  
  // Time delay before effect manifests
  time_lag: {
    min_months: number;
    max_months: number;
    typical_months: number;
  };
  
  // Uncertainty about the relationship
  uncertainty: number; // 0-1 (higher = more uncertain)
  
  // Evidence supporting this relationship
  evidence: {
    base: EvidenceBase;
    study_count?: number;
    meta_analyses?: number;
    historical_observations?: number;
    key_sources?: string[];
  };
  
  // Description
  description: string;
  descriptionSv: string;
  
  // Conditions that affect the relationship
  context_modifiers?: ContextModifier[];
}

export interface ContextModifier {
  condition: string;
  conditionSv: string;
  effect: 'strengthens' | 'weakens' | 'reverses' | 'neutralizes';
  magnitude: number;
}

// Example edges (a subset of the full graph)
export const TRADE_OFF_EDGES: TradeOffEdge[] = [
  {
    id: 'economy_to_environment_negative',
    from: 'economy',
    to: 'environment',
    direction: 'negative',
    strength: 0.6,
    time_lag: { min_months: 6, max_months: 60, typical_months: 24 },
    uncertainty: 0.3,
    evidence: { base: 'strong', meta_analyses: 12, historical_observations: 50 },
    description: 'Economic growth often correlates with environmental pressure',
    descriptionSv: 'Ekonomisk tillväxt korrelerar ofta med miljöbelastning',
    context_modifiers: [
      { condition: 'High institutional capacity', conditionSv: 'Hög institutionell kapacitet', effect: 'weakens', magnitude: 0.4 },
      { condition: 'Clean technology adoption', conditionSv: 'Ren teknologi adoption', effect: 'weakens', magnitude: 0.5 },
    ],
  },
  {
    id: 'education_to_economy_positive',
    from: 'education',
    to: 'economy',
    direction: 'positive',
    strength: 0.7,
    time_lag: { min_months: 36, max_months: 120, typical_months: 72 },
    uncertainty: 0.2,
    evidence: { base: 'strong', meta_analyses: 25 },
    description: 'Education investment historically strengthens long-term economic capacity',
    descriptionSv: 'Utbildningsinvesteringar stärker historiskt långsiktig ekonomisk kapacitet',
  },
  {
    id: 'energy_to_economy_positive',
    from: 'energy',
    to: 'economy',
    direction: 'positive',
    strength: 0.8,
    time_lag: { min_months: 3, max_months: 24, typical_months: 12 },
    uncertainty: 0.15,
    evidence: { base: 'strong', meta_analyses: 18 },
    description: 'Energy access and stability strongly correlate with economic output',
    descriptionSv: 'Energitillgång och stabilitet korrelerar starkt med ekonomisk produktion',
  },
  {
    id: 'economy_to_health_positive',
    from: 'economy',
    to: 'health',
    direction: 'positive',
    strength: 0.6,
    time_lag: { min_months: 12, max_months: 60, typical_months: 36 },
    uncertainty: 0.25,
    evidence: { base: 'strong', meta_analyses: 20 },
    description: 'Economic resources enable better health outcomes over time',
    descriptionSv: 'Ekonomiska resurser möjliggör bättre hälsoutfall över tid',
    context_modifiers: [
      { condition: 'High inequality', conditionSv: 'Hög ojämlikhet', effect: 'weakens', magnitude: 0.5 },
    ],
  },
  {
    id: 'health_to_economy_positive',
    from: 'health',
    to: 'economy',
    direction: 'positive',
    strength: 0.5,
    time_lag: { min_months: 6, max_months: 48, typical_months: 24 },
    uncertainty: 0.2,
    evidence: { base: 'strong', meta_analyses: 15 },
    description: 'Population health contributes to workforce productivity',
    descriptionSv: 'Befolkningshälsa bidrar till arbetskraftens produktivitet',
  },
  {
    id: 'social_cohesion_to_institutional_positive',
    from: 'social_cohesion',
    to: 'institutional_capacity',
    direction: 'positive',
    strength: 0.65,
    time_lag: { min_months: 12, max_months: 60, typical_months: 36 },
    uncertainty: 0.3,
    evidence: { base: 'moderate', study_count: 40 },
    description: 'Social trust tends to support institutional effectiveness',
    descriptionSv: 'Socialt förtroende tenderar att stödja institutionell effektivitet',
  },
  {
    id: 'institutional_to_all_positive',
    from: 'institutional_capacity',
    to: 'economy',
    direction: 'positive',
    strength: 0.7,
    time_lag: { min_months: 12, max_months: 72, typical_months: 36 },
    uncertainty: 0.2,
    evidence: { base: 'strong', meta_analyses: 30 },
    description: 'Strong institutions amplify effectiveness of policies across domains',
    descriptionSv: 'Starka institutioner förstärker effektiviteten av politik över domäner',
  },
  {
    id: 'environment_to_health_positive',
    from: 'environment',
    to: 'health',
    direction: 'positive',
    strength: 0.55,
    time_lag: { min_months: 12, max_months: 120, typical_months: 48 },
    uncertainty: 0.25,
    evidence: { base: 'strong', meta_analyses: 22 },
    description: 'Environmental quality affects population health outcomes',
    descriptionSv: 'Miljökvalitet påverkar befolkningens hälsoutfall',
  },
  {
    id: 'innovation_to_environment_complex',
    from: 'innovation',
    to: 'environment',
    direction: 'complex',
    strength: 0.5,
    time_lag: { min_months: 24, max_months: 120, typical_months: 60 },
    uncertainty: 0.45,
    evidence: { base: 'contested' },
    description: 'Innovation can improve or worsen environmental outcomes depending on direction',
    descriptionSv: 'Innovation kan förbättra eller försämra miljöutfall beroende på inriktning',
  },
  {
    id: 'economy_to_social_cohesion_complex',
    from: 'economy',
    to: 'social_cohesion',
    direction: 'complex',
    strength: 0.55,
    time_lag: { min_months: 12, max_months: 60, typical_months: 36 },
    uncertainty: 0.4,
    evidence: { base: 'moderate' },
    description: 'Economic growth can strengthen or weaken social cohesion depending on distribution',
    descriptionSv: 'Ekonomisk tillväxt kan stärka eller försvaga social sammanhållning beroende på fördelning',
  },
];

// ═══════════════════════════════════════════════════════════════
// BLOCK OB — "IF FOCUS SHIFTS" SIMULATOR
// ═══════════════════════════════════════════════════════════════

export interface FocusShiftQuery {
  focus_increased: TradeOffDomain;
  focus_decreased?: TradeOffDomain;
  magnitude: 'slight' | 'moderate' | 'significant';
  time_horizon: 'short' | 'medium' | 'long';
}

export interface FocusShiftResult {
  query: FocusShiftQuery;
  
  strengthened_domains: Array<{
    domain: TradeOffDomain;
    domainNameSv: string;
    likelihood: number;
    typical_lag_months: number;
    mechanism: string;
    mechanismSv: string;
    evidence_strength: EvidenceBase;
  }>;
  
  weakened_domains: Array<{
    domain: TradeOffDomain;
    domainNameSv: string;
    likelihood: number;
    typical_lag_months: number;
    mechanism: string;
    mechanismSv: string;
    evidence_strength: EvidenceBase;
  }>;
  
  often_neglected: Array<{
    domain: TradeOffDomain;
    domainNameSv: string;
    reason: string;
    reasonSv: string;
  }>;
  
  effect_duration: {
    short_term: string;
    long_term: string;
  };
  
  framing: {
    sv: string;
    en: string;
  };
}

// MANDATORY FRAMING (always use observed pattern, never "effect of decision")
export const FOCUS_SHIFT_FRAMING = {
  standard_sv: 'Historiskt har ökat fokus på {domain} ofta varit associerat med:',
  standard_en: 'Historically, increased focus on {domain} has often been associated with:',
  
  strengthens_sv: 'snabb förbättring i',
  strengthens_en: 'rapid improvement in',
  
  weakens_sv: 'fördröjd belastning i',
  weakens_en: 'delayed strain in',
  
  long_term_sv: 'långsiktig effekt på (osäker)',
  long_term_en: 'long-term effect on (uncertain)',
  
  disclaimer_sv: 'Detta är observerat mönster, inte kausal effekt.',
  disclaimer_en: 'This is an observed pattern, not a causal effect.',
} as const;

// ═══════════════════════════════════════════════════════════════
// BLOCK OC — TIME-LAG & SECOND-ORDER EFFECTS
// ═══════════════════════════════════════════════════════════════

export type EffectOrder = 'first' | 'second' | 'third';

export interface OrderedEffect {
  order: EffectOrder;
  
  domain_affected: TradeOffDomain;
  domainNameSv: string;
  
  direction: 'positive' | 'negative' | 'uncertain';
  
  typical_lag: {
    months: number;
    range: [number, number];
  };
  
  description: string;
  descriptionSv: string;
  
  confidence: number;
  
  visibility: 'high' | 'medium' | 'low';
  visibility_reason?: string;
}

export interface TradeOffTimeline {
  source_domain: TradeOffDomain;
  
  first_order: OrderedEffect[];   // Fast, direct effects
  second_order: OrderedEffect[];  // Delayed, indirect effects
  third_order: OrderedEffect[];   // Systemic, long-term effects
  
  example_narrative: {
    sv: string;
    en: string;
  };
}

export const EFFECT_ORDER_DEFINITIONS: Record<EffectOrder, {
  name: string;
  nameSv: string;
  typical_lag: string;
  visibility: string;
}> = {
  first: {
    name: 'First-Order Effect',
    nameSv: 'Första ordningens effekt',
    typical_lag: '0-12 months',
    visibility: 'Usually visible in public discourse',
  },
  second: {
    name: 'Second-Order Effect',
    nameSv: 'Andra ordningens effekt',
    typical_lag: '12-48 months',
    visibility: 'Often overlooked, delayed visibility',
  },
  third: {
    name: 'Third-Order Effect',
    nameSv: 'Tredje ordningens effekt',
    typical_lag: '48+ months',
    visibility: 'Systemic, rarely attributed correctly',
  },
};

// Example structure for a timeline
export const EXAMPLE_TRADE_OFF_TIMELINE: TradeOffTimeline = {
  source_domain: 'economy',
  
  first_order: [
    {
      order: 'first',
      domain_affected: 'energy',
      domainNameSv: 'Energi',
      direction: 'positive',
      typical_lag: { months: 6, range: [3, 12] },
      description: 'Economic growth increases energy demand and investment',
      descriptionSv: 'Ekonomisk tillväxt ökar energiefterfrågan och investeringar',
      confidence: 0.8,
      visibility: 'high',
    },
  ],
  
  second_order: [
    {
      order: 'second',
      domain_affected: 'environment',
      domainNameSv: 'Miljö',
      direction: 'negative',
      typical_lag: { months: 24, range: [12, 48] },
      description: 'Increased economic activity often strains environmental resources',
      descriptionSv: 'Ökad ekonomisk aktivitet belastar ofta miljöresurser',
      confidence: 0.7,
      visibility: 'medium',
      visibility_reason: 'Effects accumulate slowly',
    },
  ],
  
  third_order: [
    {
      order: 'third',
      domain_affected: 'health',
      domainNameSv: 'Hälsa',
      direction: 'uncertain',
      typical_lag: { months: 60, range: [36, 120] },
      description: 'Environmental changes eventually affect population health',
      descriptionSv: 'Miljöförändringar påverkar så småningom befolkningens hälsa',
      confidence: 0.5,
      visibility: 'low',
      visibility_reason: 'Long lag and multiple intervening factors',
    },
  ],
  
  example_narrative: {
    sv: 'Historiskt har ökat fokus på ekonomi ofta följts av:\n– snabb förbättring i energitillgång\n– fördröjd belastning i miljö\n– långsiktig effekt på hälsa (osäker)',
    en: 'Historically, increased focus on economy has often been followed by:\n– rapid improvement in energy access\n– delayed strain on environment\n– long-term effect on health (uncertain)',
  },
};

// ═══════════════════════════════════════════════════════════════
// BLOCK OD — ZERO-SUM vs POSITIVE-SUM MARKING
// ═══════════════════════════════════════════════════════════════

export type SumType = 'zero_sum' | 'positive_sum' | 'context_dependent';

export interface SumClassification {
  domain_pair: [TradeOffDomain, TradeOffDomain];
  
  classification: SumType;
  
  confidence: number;
  
  explanation: string;
  explanationSv: string;
  
  conditions_for_positive_sum?: string[];
  conditions_for_zero_sum?: string[];
  
  evidence: {
    base: EvidenceBase;
    key_insight?: string;
  };
}

export const SUM_TYPE_DEFINITIONS: Record<SumType, {
  name: string;
  nameSv: string;
  description: string;
  descriptionSv: string;
  color: string;
}> = {
  zero_sum: {
    name: 'Zero-Sum Tendency',
    nameSv: 'Nollsummatendens',
    description: 'Gains in one domain often come at the expense of the other',
    descriptionSv: 'Vinster i en domän sker ofta på bekostnad av den andra',
    color: 'hsl(var(--destructive) / 0.6)',
  },
  positive_sum: {
    name: 'Positive-Sum Potential',
    nameSv: 'Positivsummapotential',
    description: 'Both domains can improve simultaneously under certain conditions',
    descriptionSv: 'Båda domäner kan förbättras samtidigt under vissa förutsättningar',
    color: 'hsl(var(--success) / 0.7)',
  },
  context_dependent: {
    name: 'Context-Dependent',
    nameSv: 'Kontextberoende',
    description: 'Relationship varies based on conditions, timing, and implementation',
    descriptionSv: 'Relationen varierar baserat på förutsättningar, timing och genomförande',
    color: 'hsl(var(--warning) / 0.7)',
  },
};

export const EXAMPLE_SUM_CLASSIFICATIONS: SumClassification[] = [
  {
    domain_pair: ['economy', 'environment'],
    classification: 'context_dependent',
    confidence: 0.7,
    explanation: 'Can be positive-sum with clean technology, zero-sum with dirty growth',
    explanationSv: 'Kan vara positivsumma med ren teknologi, nollsumma med smutsig tillväxt',
    conditions_for_positive_sum: ['Clean technology', 'Strong institutions', 'Carbon pricing'],
    conditions_for_zero_sum: ['Weak regulation', 'Resource extraction focus'],
    evidence: { base: 'strong', key_insight: 'Environmental Kuznets Curve debate' },
  },
  {
    domain_pair: ['health', 'economy'],
    classification: 'positive_sum',
    confidence: 0.75,
    explanation: 'Health investments typically strengthen economic productivity over time',
    explanationSv: 'Hälsoinvesteringar stärker typiskt ekonomisk produktivitet över tid',
    evidence: { base: 'strong' },
  },
  {
    domain_pair: ['education', 'economy'],
    classification: 'positive_sum',
    confidence: 0.8,
    explanation: 'Education and economic growth reinforce each other with appropriate timing',
    explanationSv: 'Utbildning och ekonomisk tillväxt förstärker varandra med rätt timing',
    evidence: { base: 'strong' },
  },
];

// ═══════════════════════════════════════════════════════════════
// BLOCK OE — COUNTRY/REGION CONTEXT LAYER
// ═══════════════════════════════════════════════════════════════

export type DevelopmentLevel = 'low' | 'lower_middle' | 'upper_middle' | 'high';
export type InstitutionalStrength = 'weak' | 'moderate' | 'strong';
export type DemographicProfile = 'young_growing' | 'mature_stable' | 'aging_declining';

export interface CountryContext {
  country_code: string;
  country_name: string;
  
  development_level: DevelopmentLevel;
  institutional_strength: InstitutionalStrength;
  demographic_profile: DemographicProfile;
  
  resource_base: {
    natural_resources: 'abundant' | 'moderate' | 'limited';
    human_capital: 'high' | 'medium' | 'low';
    infrastructure: 'developed' | 'developing' | 'underdeveloped';
  };
  
  trade_off_modifiers: Array<{
    edge_id: string;
    modifier: number; // -1 to 1, how context changes the relationship
    reason: string;
    reasonSv: string;
  }>;
}

export interface ContextAdjustedEdge extends TradeOffEdge {
  original_strength: number;
  adjusted_strength: number;
  adjustment_reason: string;
  adjustment_reasonSv: string;
}

// Context adjustment logic
export function adjustEdgeForContext(
  edge: TradeOffEdge,
  context: CountryContext
): ContextAdjustedEdge {
  let adjustment = 0;
  const reasons: string[] = [];
  
  // Institutional strength modifies many relationships
  if (context.institutional_strength === 'strong') {
    if (edge.direction === 'negative') {
      adjustment -= 0.15; // Strong institutions mitigate negative effects
      reasons.push('Strong institutions mitigate negative spillovers');
    }
  } else if (context.institutional_strength === 'weak') {
    if (edge.direction === 'positive') {
      adjustment -= 0.2; // Weak institutions reduce positive spillovers
      reasons.push('Weak institutions reduce policy effectiveness');
    }
  }
  
  // Development level affects certain trade-offs
  if (context.development_level === 'high' && edge.from === 'economy' && edge.to === 'environment') {
    adjustment -= 0.1; // High development can afford cleaner growth
    reasons.push('Higher development enables cleaner growth paths');
  }
  
  const adjustedStrength = Math.max(0, Math.min(1, edge.strength + adjustment));
  
  return {
    ...edge,
    original_strength: edge.strength,
    adjusted_strength: adjustedStrength,
    adjustment_reason: reasons.join('; ') || 'No significant context adjustment',
    adjustment_reasonSv: reasons.join('; ') || 'Ingen signifikant kontextjustering',
  };
}

// ═══════════════════════════════════════════════════════════════
// BLOCK OF — TRADE-OFF HEATMAP
// ═══════════════════════════════════════════════════════════════

export type HeatmapCell = 'strengthens' | 'uncertain' | 'weakens' | 'neutral';

export interface HeatmapEntry {
  from: TradeOffDomain;
  to: TradeOffDomain;
  
  cell_type: HeatmapCell;
  
  strength: number;
  uncertainty: number;
  
  time_lag_months: number;
  
  color: string;
  
  click_reveals: 'data' | 'timeline' | 'sources';
}

export const HEATMAP_COLORS: Record<HeatmapCell, string> = {
  strengthens: 'hsl(var(--success) / 0.7)',    // Green
  uncertain: 'hsl(var(--warning) / 0.5)',      // Yellow/muted
  weakens: 'hsl(var(--destructive) / 0.5)',    // Red/muted
  neutral: 'hsl(var(--muted))',                // Gray
};

export interface HeatmapConfig {
  show_timeline: boolean;
  show_uncertainty_indicator: boolean;
  link_to_data: boolean;
  
  label_format: {
    sv: string;
    en: string;
  };
  
  legend: Array<{
    type: HeatmapCell;
    label: string;
    labelSv: string;
  }>;
}

export const HEATMAP_CONFIG: HeatmapConfig = {
  show_timeline: true,
  show_uncertainty_indicator: true,
  link_to_data: true,
  
  label_format: {
    sv: '{from} → {to}',
    en: '{from} → {to}',
  },
  
  legend: [
    { type: 'strengthens', label: 'Historical strengthening', labelSv: 'Historisk förstärkning' },
    { type: 'uncertain', label: 'Uncertain / Mixed', labelSv: 'Osäker / Blandad' },
    { type: 'weakens', label: 'Recurring weakening', labelSv: 'Återkommande försvagning' },
    { type: 'neutral', label: 'No strong relationship', labelSv: 'Ingen stark relation' },
  ],
};

// ═══════════════════════════════════════════════════════════════
// BLOCK OG — "WHAT PEOPLE OFTEN MISS"
// ═══════════════════════════════════════════════════════════════

export interface CommonMisunderstanding {
  id: string;
  
  belief: string;
  beliefSv: string;
  
  reality: string;
  realitySv: string;
  
  why_missed: string;
  why_missedSv: string;
  
  related_domains: TradeOffDomain[];
  
  evidence_strength: EvidenceBase;
}

export const COMMON_MISUNDERSTANDINGS: CommonMisunderstanding[] = [
  {
    id: 'free_education',
    belief: '"Education investment has no trade-offs"',
    beliefSv: '"Utbildningsinvesteringar har inga trade-offs"',
    reality: 'Short-term fiscal pressure; opportunity cost; return depends on labor market matching',
    realitySv: 'Kortsiktigt finansiellt tryck; alternativkostnad; avkastning beror på arbetsmarknadsmatchning',
    why_missed: 'Long time lag before returns visible (10+ years)',
    why_missedSv: 'Lång tidsfördröjning innan avkastning syns (10+ år)',
    related_domains: ['education', 'economy', 'institutional_capacity'],
    evidence_strength: 'moderate',
  },
  {
    id: 'green_growth',
    belief: '"Green growth has no economic cost"',
    beliefSv: '"Grön tillväxt har ingen ekonomisk kostnad"',
    reality: 'Transition costs are real; distribution of costs is uneven; timing matters',
    realitySv: 'Omställningskostnader är verkliga; fördelning av kostnader är ojämn; timing spelar roll',
    why_missed: 'Aggregated long-term benefits obscure short-term sectoral costs',
    why_missedSv: 'Aggregerade långsiktiga fördelar döljer kortsiktiga sektorkostnader',
    related_domains: ['economy', 'environment', 'social_cohesion'],
    evidence_strength: 'strong',
  },
  {
    id: 'health_spending',
    belief: '"Health spending always improves health"',
    beliefSv: '"Hälsoutgifter förbättrar alltid hälsan"',
    reality: 'Diminishing returns; allocation efficiency matters; lifestyle factors often dominate',
    realitySv: 'Avtagande avkastning; allokeringseffektivitet spelar roll; livsstilsfaktorer dominerar ofta',
    why_missed: 'Political pressure for visible spending obscures efficiency questions',
    why_missedSv: 'Politiskt tryck för synliga utgifter döljer effektivitetsfrågor',
    related_domains: ['health', 'economy'],
    evidence_strength: 'strong',
  },
  {
    id: 'innovation_solution',
    belief: '"Innovation will solve all trade-offs"',
    beliefSv: '"Innovation kommer lösa alla trade-offs"',
    reality: 'Innovation creates new trade-offs; deployment takes decades; winners and losers differ',
    realitySv: 'Innovation skapar nya trade-offs; utbredning tar årtionden; vinnare och förlorare skiljer sig',
    why_missed: 'Technological optimism and survivorship bias in tech narratives',
    why_missedSv: 'Teknologisk optimism och överlevnadsbias i tekniknarrativ',
    related_domains: ['innovation', 'environment', 'social_cohesion'],
    evidence_strength: 'moderate',
  },
];

export const MISSED_TRADE_OFF_FRAMING = {
  pattern_sv: 'Denna trade-off uppmärksammas sällan eftersom effekten uppstår {reason}.',
  pattern_en: 'This trade-off is rarely noticed because the effect occurs {reason}.',
  
  reasons: {
    later: { sv: 'senare', en: 'later' },
    elsewhere: { sv: 'i annan domän', en: 'in another domain' },
    gradually: { sv: 'gradvis', en: 'gradually' },
    differently: { sv: 'för andra grupper', en: 'for different groups' },
  },
} as const;

// ═══════════════════════════════════════════════════════════════
// BLOCK OH — SAFETY & NON-NORMATIVE GUARD
// ═══════════════════════════════════════════════════════════════

export const TOV_SAFETY_GUARDS = {
  mandatory_disclaimer: TOV_CORE_PRINCIPLE.mandatory_disclaimer,
  
  forbidden_terms: [
    'should prioritize',
    'must choose',
    'correct path',
    'wrong decision',
    'bör prioritera',
    'måste välja',
    'rätt väg',
    'fel beslut',
    'optimal',
    'best choice',
    'bästa val',
  ],
  
  required_framing: [
    'historically associated',
    'often observed',
    'tends to correlate',
    'pattern suggests',
    'historiskt associerat',
    'ofta observerat',
    'tenderar att korrelera',
    'mönster antyder',
  ],
  
  uncertainty_requirements: [
    { check: 'always_show_confidence', enforcement: 'require' },
    { check: 'always_show_time_lag', enforcement: 'require' },
    { check: 'always_show_context_dependency', enforcement: 'require' },
    { check: 'no_prescriptive_language', enforcement: 'block' },
  ],
  
  anti_manipulation: {
    rule: 'Never frame trade-offs to favor specific policy positions',
    enforcement: 'strict',
  },
} as const;

export function validateTOVLanguage(text: string): { valid: boolean; violations: string[] } {
  const violations: string[] = [];
  
  for (const forbidden of TOV_SAFETY_GUARDS.forbidden_terms) {
    if (text.toLowerCase().includes(forbidden.toLowerCase())) {
      violations.push(`Forbidden term: "${forbidden}"`);
    }
  }
  
  return { valid: violations.length === 0, violations };
}

// ═══════════════════════════════════════════════════════════════
// CALCULATION HELPERS
// ═══════════════════════════════════════════════════════════════

export function getDirectEffects(
  domain: TradeOffDomain,
  edges: TradeOffEdge[]
): Array<{ target: TradeOffDomain; edge: TradeOffEdge }> {
  return edges
    .filter(e => e.from === domain)
    .map(e => ({ target: e.to, edge: e }));
}

export function getIncomingEffects(
  domain: TradeOffDomain,
  edges: TradeOffEdge[]
): Array<{ source: TradeOffDomain; edge: TradeOffEdge }> {
  return edges
    .filter(e => e.to === domain)
    .map(e => ({ source: e.from, edge: e }));
}

export function calculateSecondOrderEffects(
  domain: TradeOffDomain,
  edges: TradeOffEdge[]
): Array<{ path: [TradeOffDomain, TradeOffDomain, TradeOffDomain]; combinedStrength: number }> {
  const directEffects = getDirectEffects(domain, edges);
  const secondOrder: Array<{ path: [TradeOffDomain, TradeOffDomain, TradeOffDomain]; combinedStrength: number }> = [];
  
  for (const first of directEffects) {
    const nextEffects = getDirectEffects(first.target, edges);
    for (const second of nextEffects) {
      if (second.target !== domain) { // Avoid loops back to source
        secondOrder.push({
          path: [domain, first.target, second.target],
          combinedStrength: first.edge.strength * second.edge.strength * 0.7, // Decay factor
        });
      }
    }
  }
  
  return secondOrder.sort((a, b) => b.combinedStrength - a.combinedStrength);
}

export function buildHeatmapData(edges: TradeOffEdge[]): HeatmapEntry[] {
  return edges.map(edge => {
    let cellType: HeatmapCell;
    if (edge.uncertainty > 0.5) {
      cellType = 'uncertain';
    } else if (edge.direction === 'positive') {
      cellType = 'strengthens';
    } else if (edge.direction === 'negative') {
      cellType = 'weakens';
    } else {
      cellType = 'uncertain';
    }
    
    return {
      from: edge.from,
      to: edge.to,
      cell_type: cellType,
      strength: edge.strength,
      uncertainty: edge.uncertainty,
      time_lag_months: edge.time_lag.typical_months,
      color: HEATMAP_COLORS[cellType],
      click_reveals: 'data',
    };
  });
}

// ═══════════════════════════════════════════════════════════════
// SYSTEM STATUS
// ═══════════════════════════════════════════════════════════════

export const TRADE_OFF_VISUALIZER_SYSTEM = {
  name: 'Trade-off Visualizer',
  acronym: 'TOV',
  version: '1.0',
  
  system_question: TOV_CORE_PRINCIPLE.system_question,
  core_principle: TOV_CORE_PRINCIPLE,
  
  blocks: {
    OA: 'Trade-Off Graph (8 domain nodes, relationship edges)',
    OB: '"If Focus Shifts" Simulator',
    OC: 'Time-Lag & Second-Order Effects',
    OD: 'Zero-Sum vs Positive-Sum Classification',
    OE: 'Country/Region Context Layer',
    OF: 'Trade-Off Heatmap',
    OG: '"What People Often Miss"',
    OH: 'Safety & Non-Normative Guard',
  },
  
  graph_structure: {
    nodes: DOMAIN_NODES.length,
    edge_types: ['positive', 'negative', 'complex'],
    sum_classifications: ['zero_sum', 'positive_sum', 'context_dependent'],
    effect_orders: ['first', 'second', 'third'],
  },
  
  context_factors: {
    development_levels: ['low', 'lower_middle', 'upper_middle', 'high'],
    institutional_strength: ['weak', 'moderate', 'strong'],
    demographic_profiles: ['young_growing', 'mature_stable', 'aging_declining'],
  },
  
  integration: {
    complements: ['Global Priority Synthesis', 'Blind Spot Detector', 'Decision Stress Index', 'Early Warning Signals'],
    provides: 'Consequence awareness for prioritization decisions',
  },
  
  next_modules: [
    { name: 'Resilience Capacity Map', description: 'Var finns buffertar och elasticitet' },
    { name: 'Collective Learning Tracker', description: 'Vad världen faktiskt lär sig över tid' },
    { name: 'Scenario Comparator', description: 'Jämföra strukturella mönster utan att förutspå' },
  ],
  
  description: 'Konsekvensmotorn som visar reella samband mellan val och utfall.',
} as const;
