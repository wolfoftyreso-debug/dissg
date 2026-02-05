/**
 * YOUTH ANSWER LAYER TYPES
 * 
 * Complete type definitions for Youth domain.
 * Compatible with existing packet files.
 */

export type YouthQuestionClass = 
  | 'normality'           // "Is this normal?"
  | 'prevalence'          // "How common is this?"
  | 'informational'       // "What is...?"
  | 'help_seeking'        // "Where can I get help?"
  | 'crisis'              // High-risk - immediate redirect
  | 'body_development'    // Body and puberty questions
  | 'psyche_emotions'     // Mental health and emotions
  | 'sexuality_identity'  // Sexuality and identity
  | 'social_belonging'    // Social and belonging
  | 'risk_fear';          // Risk assessment and fear

export type YouthRiskLevel = 'low' | 'medium' | 'moderate' | 'high' | 'crisis';

export type YouthAnswerSection = 
  | 'normalize'
  | 'limits'
  | 'when_to_seek_help'
  | 'crisis_resources'
  | 'what_is_common'
  | 'variation_is_normal'
  | 'what_this_is_not'
  | 'why_it_happens'
  | 'resources';

export interface YouthAnswerPacket {
  readonly id: string;
  readonly version?: string;
  readonly question_class?: YouthQuestionClass;
  readonly risk_level?: YouthRiskLevel;
  readonly answer_type?: string;
  readonly text?: string;
  readonly population_scope?: string;
  readonly age_range?: { min: number; max: number };
  readonly measure_id?: string;
  readonly sections?: {
    readonly normalize?: boolean;
    readonly limits?: boolean;
    readonly when_to_seek_help?: boolean;
    readonly crisis_resources?: boolean;
    readonly what_is_common?: boolean;
    readonly variation_is_normal?: boolean;
    readonly what_this_is_not?: boolean;
    readonly why_it_happens?: boolean;
  };
  readonly confidence?: {
    readonly coverage?: 'high' | 'medium' | 'low' | 'not_applicable';
    readonly tier?: 1 | 2 | 3;
  };
  readonly sources?: readonly string[];
  readonly help_urgency?: 'none' | 'optional' | 'recommended' | 'encouraged' | 'immediate';
  readonly metadata?: {
    readonly created?: string;
    readonly last_validated?: string;
    readonly owner?: string;
  };
  // Extended packet fields for detailed packets
  readonly status?: string;
  readonly intent?: {
    readonly domain: string;
    readonly question_class: string;
    readonly question_patterns: readonly string[];
    readonly blocked_patterns: readonly string[];
  };
  readonly audience?: {
    readonly age_range: readonly [number, number];
    readonly tone: string;
    readonly language_level: string;
  };
  readonly medical_scope?: {
    readonly diagnosis: 'forbidden' | 'allowed';
    readonly treatment: 'forbidden' | 'allowed';
    readonly education: 'allowed' | 'forbidden';
    readonly normalization: 'required' | 'optional';
    readonly help_guidance: 'required' | 'optional';
  };
  readonly risk_classification?: {
    readonly base_risk: string;
    readonly escalation_triggers: readonly string[];
    readonly crisis_keywords: readonly string[];
  };
  readonly content?: {
    readonly normalize: boolean;
    readonly explain_variation: boolean;
    readonly red_flags_required: boolean;
    readonly help_guidance_required: boolean;
  };
  readonly output?: {
    readonly template: string;
    readonly sections: readonly string[];
    readonly mandatory_disclaimers: readonly string[];
  };
  readonly safety?: {
    readonly crisis_escalation: boolean;
    readonly age_gate: boolean;
    readonly parental_guidance_note: boolean;
  };
}

/**
 * MEDICAL SCOPE CONSTRAINTS
 */
export interface MedicalScopeConstraints {
  readonly population_only: true;
  readonly no_diagnosis: true;
  readonly no_treatment: true;
  readonly no_individual_risk: true;
}

export const YOUTH_MEDICAL_CONSTRAINTS: MedicalScopeConstraints = {
  population_only: true,
  no_diagnosis: true,
  no_treatment: true,
  no_individual_risk: true,
};

/**
 * CRISIS MODE RESPONSE
 */
export interface CrisisModeResponse {
  readonly triggered: true;
  readonly reason: string;
  readonly redirect_to: 'human_support';
  readonly resources: CrisisResource[];
  readonly mode?: string;
  readonly triggered_by?: string;
  readonly priority?: string;
  readonly response?: {
    readonly message: string;
    readonly hotlines: CrisisResource[];
    readonly chat_resources: CrisisResource[];
    readonly safety_message: string;
  };
  readonly analytics_disabled?: boolean;
  readonly follow_up_blocked?: boolean;
}

export interface CrisisResource {
  readonly name: string;
  readonly country_code?: string;
  readonly phone?: string | null;
  readonly text?: string;
  readonly chat?: string;
  readonly url?: string;
  readonly available: string;
  readonly hours?: string;
  readonly languages?: readonly string[];
}

/**
 * MEDICAL SOURCE TIER
 */
export type MedicalSourceTier = 1 | 2 | 3 | '1' | '2' | '3' | 'TIER_1' | 'TIER_2' | 'TIER_3';

/**
 * MEDICAL SOURCE TIER CONFIG
 */
export interface MedicalSourceTierConfig {
  readonly level: number;
  readonly description: string;
  readonly youth_allowed: boolean;
}

/**
 * CONSTANTS
 */
export const YOUTH_QUESTION_CLASSES: YouthQuestionClass[] = [
  'normality',
  'prevalence', 
  'informational',
  'help_seeking',
  'crisis',
  'body_development',
  'psyche_emotions',
  'sexuality_identity',
  'social_belonging',
  'risk_fear',
];

export const YOUTH_RISK_LEVELS: YouthRiskLevel[] = ['low', 'medium', 'moderate', 'high', 'crisis'];

export const YOUTH_ANSWER_SECTIONS = {
  NORMALIZE: 'normalize',
  LIMITS: 'limits',
  WHEN_TO_SEEK_HELP: 'when_to_seek_help',
  CRISIS_RESOURCES: 'crisis_resources',
  WHAT_IS_COMMON: 'what_is_common',
  VARIATION_IS_NORMAL: 'variation_is_normal',
  WHAT_THIS_IS_NOT: 'what_this_is_not',
  WHY_IT_HAPPENS: 'why_it_happens',
  RESOURCES: 'resources',
} as const;

export const MEDICAL_SOURCE_TIERS: Record<string | number, MedicalSourceTierConfig> = {
  1: { level: 1, description: 'Official international organizations (WHO, UNICEF)', youth_allowed: true },
  2: { level: 2, description: 'National statistical offices and research institutions', youth_allowed: true },
  3: { level: 3, description: 'Peer-reviewed research (requires corroboration)', youth_allowed: false },
  'TIER_1': { level: 1, description: 'Official international organizations (WHO, UNICEF)', youth_allowed: true },
  'TIER_2': { level: 2, description: 'National statistical offices and research institutions', youth_allowed: true },
  'TIER_3': { level: 3, description: 'Peer-reviewed research (requires corroboration)', youth_allowed: false },
};