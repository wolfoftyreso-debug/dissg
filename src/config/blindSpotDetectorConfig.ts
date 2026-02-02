/**
 * MODULE — GLOBAL BLIND SPOT DETECTOR (GBSD)
 * "Vad borde vara högt prioriterat – men är det inte?"
 * 
 * Kontrastmotorn som avslöjar strukturell blindhet i debatt,
 * styrning och resursallokering.
 * 
 * KRITISKT: Inte normativt. Inte politiskt. Rent observerande.
 * 
 * SYSTEMFRÅGA:
 * "Vilka faktorer har hög dokumenterad systempåverkan men låg 
 * uppmärksamhet, låg policyaktivitet eller låg resursallokering?"
 */

import type { ImpactDomain, ImpactProfile, WorldRegion } from './globalPrioritySynthesisConfig';

// ═══════════════════════════════════════════════════════════════
// KÄRNPRINCIP (ALDRIG BRYT)
// ═══════════════════════════════════════════════════════════════

export const BLIND_SPOT_CORE_PRINCIPLE = {
  statement: 'Systemet får aldrig säga "ni borde". Systemet får bara visa "här finns ett glapp".',
  statementEn: 'The system may never say "you should". It may only show "here is a gap".',
  enforced: true,
  
  definition: {
    blind_spot: 'Impact hög, fokus låg',
    formula: 'BSI = Impact − (Attention + Action)',
    meaning: 'Högt BSI = stark blind fläck',
  },
  
  mandatory_disclaimer: {
    text_sv: 'Blind spot betyder inte att åtgärd saknas, utan att observerad påverkan inte motsvaras av observerad uppmärksamhet eller handling.',
    text_en: 'Blind spot does not mean action is lacking, but that observed impact is not matched by observed attention or action.',
    display: 'always_visible',
  },
} as const;

// ═══════════════════════════════════════════════════════════════
// BLOCK LA — BLIND SPOT IDENTIFICATION ENGINE
// ═══════════════════════════════════════════════════════════════

export type AttentionSource = 
  | 'media_intensity'
  | 'political_activity'
  | 'public_discourse'
  | 'research_volume'
  | 'budget_allocation';

export interface AttentionInput {
  source: AttentionSource;
  name: string;
  nameSv: string;
  description: string;
  weight: number;
  dataAvailability: 'high' | 'medium' | 'low';
}

export const ATTENTION_INPUTS: AttentionInput[] = [
  {
    source: 'media_intensity',
    name: 'Media Intensity',
    nameSv: 'Medieintensitet',
    description: 'Volume and prominence of media coverage',
    weight: 0.25,
    dataAvailability: 'high',
  },
  {
    source: 'political_activity',
    name: 'Political Activity',
    nameSv: 'Politisk aktivitet',
    description: 'Laws, budget allocations, official initiatives',
    weight: 0.30,
    dataAvailability: 'medium',
  },
  {
    source: 'public_discourse',
    name: 'Public Discourse',
    nameSv: 'Offentlig diskurs',
    description: 'Aggregated public discussion and debate',
    weight: 0.20,
    dataAvailability: 'medium',
  },
  {
    source: 'research_volume',
    name: 'Research Application Gap',
    nameSv: 'Forskning–Tillämpning gap',
    description: 'What science points to vs what is implemented',
    weight: 0.15,
    dataAvailability: 'high',
  },
  {
    source: 'budget_allocation',
    name: 'Budget/Resource Allocation',
    nameSv: 'Budget/Resursallokering',
    description: 'Financial resources dedicated to the issue',
    weight: 0.10,
    dataAvailability: 'low',
  },
];

export interface BlindSpotScores {
  impact_score: number;      // From Global Priority Synthesis (0-1)
  attention_score: number;   // Aggregated attention (0-1)
  action_score: number;      // Policy/budget activity (0-1)
  research_action_gap: number; // Science vs implementation (0-1)
}

export interface BlindSpotIndex {
  factor_id: string;
  scores: BlindSpotScores;
  bsi: number; // Blind Spot Index = impact - (attention + action)/2
  classification: BlindSpotType;
  rank: number;
}

// ═══════════════════════════════════════════════════════════════
// BLOCK LB — BLIND SPOT CLASSIFICATION
// ═══════════════════════════════════════════════════════════════

export type BlindSpotType = 
  | 'silent_risk'
  | 'slow_burn'
  | 'system_dependency'
  | 'deferred_cost';

export interface BlindSpotTypeDefinition {
  type: BlindSpotType;
  name: string;
  nameSv: string;
  description: string;
  descriptionSv: string;
  indicators: string[];
}

export const BLIND_SPOT_TYPES: BlindSpotTypeDefinition[] = [
  {
    type: 'silent_risk',
    name: 'Silent Risk',
    nameSv: 'Tyst risk',
    description: 'Low attention, high long-term risk',
    descriptionSv: 'Låg uppmärksamhet, hög långsiktig risk',
    indicators: ['low_media_coverage', 'high_expert_concern', 'long_time_horizon'],
  },
  {
    type: 'slow_burn',
    name: 'Slow Burn',
    nameSv: 'Långsam förbränning',
    description: 'Effects accumulate slowly but powerfully',
    descriptionSv: 'Effekter ackumuleras långsamt men kraftigt',
    indicators: ['gradual_change', 'cumulative_impact', 'hard_to_reverse'],
  },
  {
    type: 'system_dependency',
    name: 'System Dependency',
    nameSv: 'Systemberoende',
    description: 'Affects many other systems but is ignored',
    descriptionSv: 'Påverkar många andra system men ignoreras',
    indicators: ['high_cross_domain_coupling', 'hidden_dependencies', 'cascade_potential'],
  },
  {
    type: 'deferred_cost',
    name: 'Deferred Cost',
    nameSv: 'Uppskjuten kostnad',
    description: 'Cost is pushed to the future',
    descriptionSv: 'Kostnaden skjuts på framtiden',
    indicators: ['future_burden', 'intergenerational', 'political_invisibility'],
  },
];

// ═══════════════════════════════════════════════════════════════
// BLOCK LC — GLOBAL BLIND SPOT LIST
// ═══════════════════════════════════════════════════════════════

export interface GlobalBlindSpot {
  rank: number;
  factor_id: string;
  title: string;
  titleSv: string;
  
  scores: BlindSpotScores;
  bsi: number;
  classification: BlindSpotType;
  
  impact_domains: ImpactDomain[];
  
  key_effects: string[];
  key_effects_sv: string[];
  
  why_blind: BlindnessExplanation;
  
  data_quality: {
    impact_confidence: number;
    attention_confidence: number;
    overall: 'high' | 'medium' | 'low';
  };
}

export interface BlindnessExplanation {
  reasons: string[];
  reasons_sv: string[];
  mechanism: 'slow_effects' | 'diffuse_responsibility' | 'political_invisibility' | 'measurement_difficulty' | 'future_burden';
  mechanism_description_sv: string;
}

export const EXAMPLE_GLOBAL_BLIND_SPOTS: GlobalBlindSpot[] = [
  {
    rank: 1,
    factor_id: 'mental_health_working_age',
    title: 'Mental Health in Working-Age Population',
    titleSv: 'Psykisk hälsa i arbetsför ålder',
    scores: {
      impact_score: 0.85,
      attention_score: 0.35,
      action_score: 0.25,
      research_action_gap: 0.65,
    },
    bsi: 0.55, // 0.85 - (0.35+0.25)/2 = 0.55
    classification: 'slow_burn',
    impact_domains: ['health', 'economy', 'institutional_stability'],
    key_effects: [
      'High impact on productivity',
      'Family stability effects',
      'Social stability consequences',
    ],
    key_effects_sv: [
      'Hög påverkan på produktivitet',
      'Effekter på familjestabilitet',
      'Konsekvenser för social stabilitet',
    ],
    why_blind: {
      reasons: [
        'Long lag between cause and visible effect',
        'Stigma reduces reporting and visibility',
        'Effects distributed across many domains',
        'Hard to attribute to specific policies',
      ],
      reasons_sv: [
        'Lång lagg mellan orsak och synlig effekt',
        'Stigma minskar rapportering och synlighet',
        'Effekter fördelade över många domäner',
        'Svårt att hänföra till specifika policies',
      ],
      mechanism: 'slow_effects',
      mechanism_description_sv: 'Effekterna är för långsamma för att synas i politiska cykler',
    },
    data_quality: {
      impact_confidence: 0.85,
      attention_confidence: 0.70,
      overall: 'high',
    },
  },
  {
    rank: 2,
    factor_id: 'institutional_competence_loss',
    title: 'Institutional Competence Loss',
    titleSv: 'Institutionell kompetensförlust',
    scores: {
      impact_score: 0.75,
      attention_score: 0.20,
      action_score: 0.15,
      research_action_gap: 0.70,
    },
    bsi: 0.575,
    classification: 'system_dependency',
    impact_domains: ['institutional_stability', 'education_competence'],
    key_effects: [
      'Lost experience in agencies/organizations',
      'Reduced implementation capacity',
      'Decision quality degradation',
    ],
    key_effects_sv: [
      'Tappad erfarenhet i myndigheter/organisationer',
      'Minskad implementeringsförmåga',
      'Försämrad beslutskvalitet',
    ],
    why_blind: {
      reasons: [
        'Invisible in traditional metrics',
        'Effects only visible in crisis',
        'Distributed across all institutions',
        'No clear accountability',
      ],
      reasons_sv: [
        'Osynligt i traditionella mått',
        'Effekter syns bara i kris',
        'Fördelat över alla institutioner',
        'Ingen tydlig ansvarighet',
      ],
      mechanism: 'diffuse_responsibility',
      mechanism_description_sv: 'Ansvaret är så utspritt att ingen äger frågan',
    },
    data_quality: {
      impact_confidence: 0.70,
      attention_confidence: 0.60,
      overall: 'medium',
    },
  },
  {
    rank: 3,
    factor_id: 'education_future_mismatch',
    title: 'Education-Future Needs Mismatch',
    titleSv: 'Utbildningens matchning mot framtida behov',
    scores: {
      impact_score: 0.80,
      attention_score: 0.45,
      action_score: 0.30,
      research_action_gap: 0.55,
    },
    bsi: 0.425,
    classification: 'deferred_cost',
    impact_domains: ['education_competence', 'economy'],
    key_effects: [
      'High long-term effect on adaptability',
      'Economic competitiveness impact',
      'Innovation capacity constraints',
    ],
    key_effects_sv: [
      'Hög långsiktig effekt på anpassningsförmåga',
      'Påverkan på ekonomisk konkurrenskraft',
      'Begränsningar i innovationskapacitet',
    ],
    why_blind: {
      reasons: [
        'Short-term debate dominates',
        'Future needs are uncertain',
        'Current metrics focus on inputs not outcomes',
        'Benefits realized beyond political cycles',
      ],
      reasons_sv: [
        'Kortsiktig debatt dominerar',
        'Framtida behov är osäkra',
        'Nuvarande mått fokuserar på input inte utfall',
        'Nyttan realiseras bortom politiska cykler',
      ],
      mechanism: 'future_burden',
      mechanism_description_sv: 'Effekterna kommer så långt fram att de inte påverkar dagens beslut',
    },
    data_quality: {
      impact_confidence: 0.75,
      attention_confidence: 0.80,
      overall: 'high',
    },
  },
  {
    rank: 4,
    factor_id: 'soil_degradation',
    title: 'Soil Degradation & Agricultural Resilience',
    titleSv: 'Markförstöring & jordbrukets resiliens',
    scores: {
      impact_score: 0.70,
      attention_score: 0.25,
      action_score: 0.20,
      research_action_gap: 0.60,
    },
    bsi: 0.475,
    classification: 'silent_risk',
    impact_domains: ['climate_environment', 'economy', 'health'],
    key_effects: [
      'Food security foundation',
      'Carbon sequestration capacity',
      'Water filtration and retention',
    ],
    key_effects_sv: [
      'Grund för livsmedelssäkerhet',
      'Kapacitet för kolinlagring',
      'Vattenfiltrering och retention',
    ],
    why_blind: {
      reasons: [
        'Changes happen underground',
        'Long time scales (decades)',
        'Disconnection from food system',
        'Complex causation chains',
      ],
      reasons_sv: [
        'Förändringar sker under jord',
        'Långa tidsskalor (decennier)',
        'Bortkoppling från livsmedelssystem',
        'Komplexa orsakskedjor',
      ],
      mechanism: 'measurement_difficulty',
      mechanism_description_sv: 'Det som inte mäts syns inte i beslutsunderlag',
    },
    data_quality: {
      impact_confidence: 0.80,
      attention_confidence: 0.65,
      overall: 'medium',
    },
  },
  {
    rank: 5,
    factor_id: 'antibiotic_resistance',
    title: 'Antibiotic Resistance Spread',
    titleSv: 'Spridning av antibiotikaresistens',
    scores: {
      impact_score: 0.75,
      attention_score: 0.40,
      action_score: 0.35,
      research_action_gap: 0.50,
    },
    bsi: 0.375,
    classification: 'silent_risk',
    impact_domains: ['health', 'economy'],
    key_effects: [
      'Medical procedure risk increase',
      'Healthcare cost escalation',
      'Treatment option reduction',
    ],
    key_effects_sv: [
      'Ökad risk vid medicinska ingrepp',
      'Eskalerande vårdkostnader',
      'Minskade behandlingsalternativ',
    ],
    why_blind: {
      reasons: [
        'Probabilistic risk hard to communicate',
        'Effects invisible until crisis',
        'Distributed responsibility (agriculture, medicine, patients)',
        'International coordination required',
      ],
      reasons_sv: [
        'Sannolikhetsbaserad risk svår att kommunicera',
        'Effekter osynliga tills kris',
        'Utspritt ansvar (jordbruk, medicin, patienter)',
        'Internationell samordning krävs',
      ],
      mechanism: 'diffuse_responsibility',
      mechanism_description_sv: 'Ingen enskild aktör kan lösa det ensam',
    },
    data_quality: {
      impact_confidence: 0.85,
      attention_confidence: 0.75,
      overall: 'high',
    },
  },
];

// ═══════════════════════════════════════════════════════════════
// BLOCK LD — REGIONAL & NATIONAL BLIND SPOT MAP
// ═══════════════════════════════════════════════════════════════

export type BlindnessSource = 
  | 'cultural'
  | 'political'
  | 'structural'
  | 'resource_related';

export interface RegionalBlindSpotProfile {
  region: WorldRegion;
  regionName: string;
  regionNameSv: string;
  
  top_blind_spots: Array<{
    rank: number;
    factor_id: string;
    titleSv: string;
    bsi: number;
    deviation_from_global: number; // positive = bigger blind spot than global
  }>;
  
  blindness_sources: Array<{
    source: BlindnessSource;
    description_sv: string;
    examples: string[];
  }>;
  
  unique_blind_spots: string[]; // Factors blind here but not globally
  
  shared_with_global: string[];
}

export interface NationalBlindSpotProfile {
  country_code: string;
  country_name: string;
  
  top_blind_spots: Array<{
    rank: number;
    factor_id: string;
    titleSv: string;
    bsi: number;
    classification: BlindSpotType;
  }>;
  
  blindness_analysis: {
    primary_source: BlindnessSource;
    description_sv: string;
    structural_factors: string[];
  };
  
  comparison_to_global: {
    more_blind_to: string[];
    less_blind_to: string[];
    unique_blind_spots: string[];
  };
}

// ═══════════════════════════════════════════════════════════════
// BLOCK LE — "WHY IS THIS A BLIND SPOT?"
// ═══════════════════════════════════════════════════════════════

export interface BlindnessReasoningTemplate {
  question_sv: string;
  question_en: string;
  answer_categories: Array<{
    category: string;
    category_sv: string;
    examples: string[];
  }>;
}

export const WHY_BLIND_TEMPLATE: BlindnessReasoningTemplate = {
  question_sv: 'Varför får detta låg uppmärksamhet?',
  question_en: 'Why does this receive low attention?',
  answer_categories: [
    {
      category: 'slow_effects',
      category_sv: 'Effekterna är långsamma',
      examples: [
        'Changes happen over years/decades',
        'Hard to connect cause and effect',
        'Below threshold of political attention',
      ],
    },
    {
      category: 'diffuse_responsibility',
      category_sv: 'Ansvaret är utspritt',
      examples: [
        'No single owner of the problem',
        'Crosses organizational boundaries',
        'International coordination required',
      ],
    },
    {
      category: 'political_invisibility',
      category_sv: 'Nyttan är politiskt osynlig',
      examples: [
        'Benefits are prevention (non-events)',
        'Gains accrue beyond election cycles',
        'No clear constituency benefits',
      ],
    },
    {
      category: 'measurement_difficulty',
      category_sv: 'Svårt att mäta',
      examples: [
        'No standardized metrics',
        'Qualitative rather than quantitative',
        'Data infrastructure lacking',
      ],
    },
    {
      category: 'future_burden',
      category_sv: 'Kostnaden ligger i framtiden',
      examples: [
        'Current generation doesn\'t pay',
        'Discount rate makes it seem small',
        'Intergenerational transfer',
      ],
    },
  ],
};

// ═══════════════════════════════════════════════════════════════
// BLOCK LF — BLIND SPOT vs TOP ISSUE (CONTRAST VIEW)
// ═══════════════════════════════════════════════════════════════

export type AlignmentStatus = 
  | 'blind_spot'      // High impact, low attention, low action
  | 'aligned'         // High impact, high attention, high action
  | 'overexposed'     // Low impact, high attention
  | 'emerging'        // Medium impact, low attention (watch list)
  | 'waning';         // Impact declining, attention high

export interface ContrastViewRow {
  factor_id: string;
  titleSv: string;
  
  impact: number;
  attention: number;
  action: number;
  
  status: AlignmentStatus;
  
  trend: 'improving' | 'stable' | 'worsening';
}

export interface ContrastViewConfig {
  columns: Array<{
    id: string;
    label: string;
    labelSv: string;
    format: 'score' | 'status' | 'trend';
  }>;
  
  status_colors: Record<AlignmentStatus, string>;
  
  description_sv: string;
}

export const CONTRAST_VIEW_CONFIG: ContrastViewConfig = {
  columns: [
    { id: 'factor', label: 'Factor', labelSv: 'Faktor', format: 'status' },
    { id: 'impact', label: 'Impact', labelSv: 'Påverkan', format: 'score' },
    { id: 'attention', label: 'Attention', labelSv: 'Uppmärksamhet', format: 'score' },
    { id: 'action', label: 'Action', labelSv: 'Handling', format: 'score' },
    { id: 'status', label: 'Status', labelSv: 'Status', format: 'status' },
  ],
  
  status_colors: {
    blind_spot: 'hsl(var(--destructive))',      // Red
    aligned: 'hsl(var(--success))',             // Green
    overexposed: 'hsl(var(--warning))',         // Orange
    emerging: 'hsl(var(--info))',               // Blue
    waning: 'hsl(var(--muted-foreground))',     // Gray
  },
  
  description_sv: 'På 10 sek förstår användaren var fokus ligger fel.',
};

export function determineAlignmentStatus(
  impact: number,
  attention: number,
  action: number
): AlignmentStatus {
  const avgFocus = (attention + action) / 2;
  
  if (impact >= 0.6 && avgFocus < 0.4) return 'blind_spot';
  if (impact >= 0.6 && avgFocus >= 0.6) return 'aligned';
  if (impact < 0.4 && avgFocus >= 0.6) return 'overexposed';
  if (impact >= 0.4 && impact < 0.7 && avgFocus < 0.35) return 'emerging';
  return 'waning';
}

// ═══════════════════════════════════════════════════════════════
// BLOCK LG — SAFETY & NON-NORMATIVE GUARD
// ═══════════════════════════════════════════════════════════════

export const BLIND_SPOT_SAFETY_GUARDS = {
  mandatory_disclaimer: BLIND_SPOT_CORE_PRINCIPLE.mandatory_disclaimer,
  
  forbidden_implications: [
    'should address',
    'needs to be fixed',
    'requires action',
    'must prioritize',
    'bör åtgärda',
    'måste prioritera',
    'kräver handling',
  ],
  
  required_framing: [
    'observed gap between',
    'documented difference',
    'data shows mismatch',
    'observerat glapp mellan',
    'dokumenterad skillnad',
    'data visar diskrepans',
  ],
  
  interpretation_guard: {
    text_sv: 'Blind spot är en observation, inte en kritik. Det visar var uppmärksamhet och påverkan skiljer sig åt.',
    text_en: 'Blind spot is an observation, not a criticism. It shows where attention and impact diverge.',
    display: 'contextual_tooltip',
  },
  
  anti_blame_checks: [
    { check: 'no_responsibility_attribution', enforcement: 'block' },
    { check: 'no_should_statements', enforcement: 'block' },
    { check: 'always_show_uncertainty', enforcement: 'require' },
    { check: 'always_explain_mechanism', enforcement: 'require' },
  ],
} as const;

// ═══════════════════════════════════════════════════════════════
// BLOCK LH — HOMEPAGE INTEGRATION
// ═══════════════════════════════════════════════════════════════

export interface HomepageBlindSpotWidget {
  title: string;
  titleSv: string;
  
  subtitle: string;
  subtitleSv: string;
  
  max_items: number;
  
  item_format: {
    show_bsi: boolean;
    show_classification: boolean;
    show_uncertainty: boolean;
    clickable: boolean;
  };
  
  disclaimer: string;
  disclaimerSv: string;
}

export const HOMEPAGE_BLIND_SPOT_CONFIG: HomepageBlindSpotWidget = {
  title: "What matters most – but isn't talked about",
  titleSv: 'Vad som betyder mest – men inte diskuteras',
  
  subtitle: 'Factors with high documented impact but low attention',
  subtitleSv: 'Faktorer med hög dokumenterad påverkan men låg uppmärksamhet',
  
  max_items: 5,
  
  item_format: {
    show_bsi: true,
    show_classification: true,
    show_uncertainty: true,
    clickable: true,
  },
  
  disclaimer: 'This shows observed gaps, not recommendations.',
  disclaimerSv: 'Detta visar observerade glapp, inte rekommendationer.',
};

// ═══════════════════════════════════════════════════════════════
// CALCULATION HELPERS
// ═══════════════════════════════════════════════════════════════

export function calculateBSI(scores: BlindSpotScores): number {
  const avgFocus = (scores.attention_score + scores.action_score) / 2;
  const bsi = scores.impact_score - avgFocus;
  return Math.round(bsi * 1000) / 1000;
}

export function classifyBlindSpot(
  bsi: number,
  scores: BlindSpotScores,
  timeHorizon: 'short' | 'medium' | 'long',
  crossDomainCoupling: number
): BlindSpotType {
  // Silent Risk: High research-action gap, long time horizon
  if (scores.research_action_gap > 0.6 && timeHorizon === 'long') {
    return 'silent_risk';
  }
  
  // System Dependency: High cross-domain coupling
  if (crossDomainCoupling > 0.7) {
    return 'system_dependency';
  }
  
  // Deferred Cost: Future burden pattern
  if (timeHorizon === 'long' && scores.action_score < 0.3) {
    return 'deferred_cost';
  }
  
  // Default: Slow Burn
  return 'slow_burn';
}

export function rankBlindSpots(spots: GlobalBlindSpot[]): GlobalBlindSpot[] {
  return [...spots].sort((a, b) => b.bsi - a.bsi);
}

export function getBlindSpotSeverity(bsi: number): 'critical' | 'high' | 'moderate' | 'low' {
  if (bsi >= 0.5) return 'critical';
  if (bsi >= 0.35) return 'high';
  if (bsi >= 0.2) return 'moderate';
  return 'low';
}

export function validateBlindSpotLanguage(text: string): { valid: boolean; violations: string[] } {
  const violations: string[] = [];
  
  for (const forbidden of BLIND_SPOT_SAFETY_GUARDS.forbidden_implications) {
    if (text.toLowerCase().includes(forbidden.toLowerCase())) {
      violations.push(`Forbidden implication: "${forbidden}"`);
    }
  }
  
  return { valid: violations.length === 0, violations };
}

// ═══════════════════════════════════════════════════════════════
// SYSTEM STATUS
// ═══════════════════════════════════════════════════════════════

export const GLOBAL_BLIND_SPOT_DETECTOR = {
  name: 'Global Blind Spot Detector',
  acronym: 'GBSD',
  version: '1.0',
  
  system_question: {
    sv: 'Vilka faktorer har hög dokumenterad systempåverkan men låg uppmärksamhet, låg policyaktivitet eller låg resursallokering?',
    en: 'Which factors have high documented system impact but low attention, low policy activity, or low resource allocation?',
  },
  
  core_principle: BLIND_SPOT_CORE_PRINCIPLE,
  
  blocks: {
    LA: 'Blind Spot Identification Engine',
    LB: 'Blind Spot Classification',
    LC: 'Global Blind Spot List',
    LD: 'Regional & National Blind Spot Map',
    LE: 'Why Is This a Blind Spot?',
    LF: 'Blind Spot vs Top Issue (Contrast View)',
    LG: 'Safety & Non-Normative Guard',
    LH: 'Homepage Integration',
  },
  
  formula: 'BSI = Impact − (Attention + Action) / 2',
  
  classification_types: BLIND_SPOT_TYPES.length,
  attention_inputs: ATTENTION_INPUTS.length,
  
  capabilities: {
    identify_structural_blindness: true,
    compare_impact_vs_attention: true,
    classify_blindness_type: true,
    explain_blindness_mechanism: true,
    regional_national_breakdown: true,
    contrast_view: true,
    homepage_widget: true,
  },
  
  integration: {
    complements: 'Global Priority Synthesis Engine',
    homepage_section: 'What matters most – but isn\'t talked about',
  },
  
  next_modules: [
    { name: 'Decision Stress Index', description: 'Var världen är mest sårbar om inget förändras' },
    { name: 'Trade-off Visualizer', description: 'Vad förbättras/försämras när man fokuserar på X' },
    { name: 'Early Warning Signals', description: 'Svaga signaler som ofta missas' },
  ],
  
  description: 'Kontrastmotorn som avslöjar strukturell blindhet i debatt, styrning och resursallokering.',
} as const;
