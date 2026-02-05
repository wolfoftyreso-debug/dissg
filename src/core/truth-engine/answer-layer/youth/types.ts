 /**
  * YOUTH & MEDICAL ANSWER LAYER - TYPES
  * 
  * Core types for youth-focused, medically-safe answer generation.
  * 
  * FUNDAMENTAL PRINCIPLE (LOCKED):
  * The system informs, normalizes, and guides –
  * it NEVER diagnoses and NEVER replaces care.
  */
 
 /**
  * YOUTH QUESTION CLASSES (6 STABLE CATEGORIES)
  * 95% of all youth questions fall into these categories.
  */
 export const YOUTH_QUESTION_CLASSES = {
   NORMALITY: 'normality',           // "Is this normal?"
   BODY_DEVELOPMENT: 'body_development',  // "Is my body weird?"
   PSYCHE_EMOTIONS: 'psyche_emotions',    // "Why do I feel this way?"
   SEXUALITY_IDENTITY: 'sexuality_identity', // "Is this okay?"
   RISK_FEAR: 'risk_fear',           // "Should I be worried?"
   SOCIAL_BELONGING: 'social_belonging',   // "Am I the only one?"
 } as const;
 
 export type YouthQuestionClass = typeof YOUTH_QUESTION_CLASSES[keyof typeof YOUTH_QUESTION_CLASSES];
 
 /**
  * RISK LEVELS FOR YOUTH QUESTIONS
  */
 export const YOUTH_RISK_LEVELS = {
   LOW: 'low',           // General curiosity, safe to answer directly
   MODERATE: 'moderate', // Requires careful framing, disclaimers
   HIGH: 'high',         // May indicate distress, needs support resources
   CRISIS: 'crisis',     // Immediate safety concern, switch to crisis mode
 } as const;
 
 export type YouthRiskLevel = typeof YOUTH_RISK_LEVELS[keyof typeof YOUTH_RISK_LEVELS];
 
 /**
  * MEDICAL SCOPE CONSTRAINTS (HARD RULES)
  */
 export interface MedicalScopeConstraints {
   readonly diagnosis: 'forbidden';      // ALWAYS forbidden
   readonly treatment: 'forbidden';      // ALWAYS forbidden
   readonly education: 'allowed';        // General information
   readonly normalization: 'required';   // ALWAYS required for youth
   readonly help_guidance: 'required';   // ALWAYS required
 }
 
 /**
  * YOUTH ANSWER PACKET
  */
 export interface YouthAnswerPacket {
   readonly id: string;
   readonly version: number;
   readonly status: 'draft' | 'review' | 'stable';
   
   readonly intent: {
     readonly domain: string;
     readonly question_class: YouthQuestionClass;
     readonly question_patterns: readonly string[];
     readonly blocked_patterns: readonly string[];
   };
   
   readonly audience: {
     readonly age_range: [number, number];
     readonly tone: 'reassuring' | 'informative' | 'supportive';
     readonly language_level: 'simple' | 'moderate';
   };
   
   readonly medical_scope: MedicalScopeConstraints;
   
   readonly risk_classification: {
     readonly base_risk: YouthRiskLevel;
     readonly escalation_triggers: readonly string[];
     readonly crisis_keywords: readonly string[];
   };
   
   readonly content: {
     readonly normalize: boolean;
     readonly explain_variation: boolean;
     readonly red_flags_required: boolean;
     readonly help_guidance_required: boolean;
   };
   
   readonly output: {
     readonly template: string;
     readonly sections: readonly YouthAnswerSection[];
     readonly mandatory_disclaimers: readonly string[];
   };
   
   readonly safety: {
     readonly crisis_escalation: boolean;
     readonly age_gate: boolean;
     readonly parental_guidance_note: boolean;
   };
 }
 
 /**
  * ANSWER SECTIONS (MANDATORY STRUCTURE)
  */
 export const YOUTH_ANSWER_SECTIONS = {
   WHAT_IS_COMMON: 'what_is_common',
   WHY_IT_HAPPENS: 'why_it_happens',
   VARIATION_IS_NORMAL: 'variation_is_normal',
   WHEN_TO_SEEK_HELP: 'when_to_seek_help',
   WHAT_THIS_IS_NOT: 'what_this_is_not',
   RESOURCES: 'resources',
 } as const;
 
 export type YouthAnswerSection = typeof YOUTH_ANSWER_SECTIONS[keyof typeof YOUTH_ANSWER_SECTIONS];
 
 /**
  * CRISIS MODE RESPONSE
  */
 export interface CrisisModeResponse {
   readonly mode: 'crisis_support';
   readonly triggered_by: string;
   readonly priority: 'immediate';
   readonly response: {
     readonly message: string;
     readonly hotlines: readonly CrisisResource[];
     readonly chat_resources: readonly CrisisResource[];
     readonly safety_message: string;
   };
   readonly analytics_disabled: boolean;
   readonly follow_up_blocked: boolean;
 }

 
 export interface CrisisResource {
   readonly name: string;
   readonly country_code: string;
   readonly phone: string | null;
   readonly url: string | null;
   readonly hours: '24/7' | 'limited';
   readonly languages: readonly string[];
 }
 
 /**
  * MEDICAL SOURCE TIERS (TRUST CLASSIFICATION)
  */
 export const MEDICAL_SOURCE_TIERS = {
   TIER_1: {
     level: 1,
     name: 'Authoritative Health Bodies',
     examples: ['WHO', 'CDC', 'National Health Authorities'],
     youth_allowed: true,
   },
   TIER_2: {
     level: 2,
     name: 'Peer-Reviewed Research',
     examples: ['NEJM', 'Lancet', 'JAMA', 'BMJ'],
     youth_allowed: true,
   },
   TIER_3: {
     level: 3,
     name: 'Clinical Guidelines',
     examples: ['NICE', 'UpToDate', 'Professional Associations'],
     youth_allowed: false, // Too clinical for youth packets
   },
   TIER_4: {
     level: 4,
     name: 'Epidemiological Compilations',
     examples: ['Meta-analyses', 'Systematic Reviews'],
     youth_allowed: false,
   },
 } as const;
 
 export type MedicalSourceTier = keyof typeof MEDICAL_SOURCE_TIERS;