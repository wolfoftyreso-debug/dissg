 /**
  * YOUTH ANSWER LAYER TYPES
  * 
  * Complete type definitions for Youth domain.
  * Compatible with existing packet files.
  */
 
 export type YouthQuestionClass = 
   | 'normality'       // "Is this normal?"
   | 'prevalence'      // "How common is this?"
   | 'informational'   // "What is...?"
   | 'help_seeking'    // "Where can I get help?"
   | 'crisis';         // High-risk - immediate redirect
 
 export type YouthRiskLevel = 'low' | 'medium' | 'high' | 'crisis';
 
 export type YouthAnswerSection = 
   | 'normalize'
   | 'limits'
   | 'when_to_seek_help'
   | 'crisis_resources'
   | 'what_is_common'
   | 'variation_is_normal'
   | 'what_this_is_not';
 
 export interface YouthAnswerPacket {
   readonly id: string;
   readonly version?: string;
   readonly question_class: YouthQuestionClass;
   readonly risk_level: YouthRiskLevel;
   readonly answer_type: string;
   readonly text: string;
   readonly population_scope?: string;
   readonly age_range?: { min: number; max: number };
   readonly measure_id?: string;
   readonly sections: {
     readonly normalize: boolean;
     readonly limits: boolean;
     readonly when_to_seek_help: boolean;
     readonly crisis_resources?: boolean;
     readonly what_is_common?: boolean;
     readonly variation_is_normal?: boolean;
     readonly what_this_is_not?: boolean;
   };
   readonly confidence: {
     readonly coverage: 'high' | 'medium' | 'low' | 'not_applicable';
     readonly tier: 1 | 2 | 3;
   };
   readonly sources?: readonly string[];
   readonly help_urgency?: 'none' | 'optional' | 'recommended' | 'encouraged' | 'immediate';
   readonly metadata?: {
     readonly created?: string;
     readonly last_validated?: string;
     readonly owner?: string;
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
 }
 
 export interface CrisisResource {
   readonly name: string;
   readonly country_code?: string;
   readonly phone?: string;
   readonly text?: string;
   readonly chat?: string;
   readonly url?: string;
   readonly available: string;
 }
 
 /**
  * MEDICAL SOURCE TIER
  */
 export type MedicalSourceTier = 1 | 2 | 3 | '1' | '2' | '3';
 
 /**
  * CONSTANTS
  */
 export const YOUTH_QUESTION_CLASSES: YouthQuestionClass[] = [
   'normality',
   'prevalence', 
   'informational',
   'help_seeking',
   'crisis',
 ];
 
 export const YOUTH_RISK_LEVELS: YouthRiskLevel[] = ['low', 'medium', 'high', 'crisis'];
 
 export const YOUTH_ANSWER_SECTIONS = {
   NORMALIZE: 'normalize',
   LIMITS: 'limits',
   WHEN_TO_SEEK_HELP: 'when_to_seek_help',
   CRISIS_RESOURCES: 'crisis_resources',
   WHAT_IS_COMMON: 'what_is_common',
   VARIATION_IS_NORMAL: 'variation_is_normal',
   WHAT_THIS_IS_NOT: 'what_this_is_not',
 } as const;
 
 export const MEDICAL_SOURCE_TIERS: Record<number, string> = {
   1: 'Official international organizations (WHO, UNICEF)',
   2: 'National statistical offices and research institutions',
   3: 'Peer-reviewed research (requires corroboration)',
 };