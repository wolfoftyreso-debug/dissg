 /**
  * DOMAIN PLAYBOOK TYPES
  * 
  * Universal structure for all domain playbooks.
  */
 
 export interface PlaybookAnswerRule {
   readonly answer_type: string;
   readonly allowed: boolean;
   readonly conditions?: readonly string[];
   readonly template?: string;
 }
 
 export interface PlaybookSafetyRule {
   readonly rule_id: string;
   readonly name: string;
   readonly pattern: RegExp;
   readonly action: 'block' | 'warn' | 'redirect';
   readonly message: string;
 }
 
 export interface DomainPlaybook {
   readonly domain: string;
   readonly version: number;
   readonly locked: boolean;
   
   // What can be answered
   readonly allowed_answer_types: readonly string[];
   readonly forbidden_answer_types: readonly string[];
   
   // What data can be shown
   readonly allowed_measures: readonly string[];
   readonly forbidden_measures: readonly string[];
   
   // How answers are structured
   readonly answer_rules: readonly PlaybookAnswerRule[];
   
   // Safety barriers
   readonly safety_rules: readonly PlaybookSafetyRule[];
   
   // Mandatory elements
   readonly mandatory_disclaimers: readonly string[];
   readonly mandatory_resources: readonly string[];
   
   // Crisis handling (if applicable)
   readonly crisis_detection: boolean;
   readonly crisis_fallback_id: string | null;
 }