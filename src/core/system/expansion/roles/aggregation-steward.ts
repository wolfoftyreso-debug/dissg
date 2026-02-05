 /**
  * AGGREGATION STEWARD ROLE
  * 
  * NEW ROLE: Separate from Ontology Steward
  * 
  * Responsibilities:
  * - Ensure aggregations don't drift toward normativity
  * - Stop "smartness"
  * - Defend boringness
  */
 
 export interface AggregationStewardRole {
   readonly role_id: 'aggregation_steward';
   readonly separate_from: 'ontology_steward';
   readonly cannot_combine_with: readonly ['ontology_steward', 'builder', 'guardian'];
   readonly responsibilities: readonly string[];
   readonly veto_power: readonly string[];
   readonly approval_required_for: readonly string[];
 }
 
 export const AGGREGATION_STEWARD: AggregationStewardRole = {
   role_id: 'aggregation_steward',
   separate_from: 'ontology_steward',
   cannot_combine_with: ['ontology_steward', 'builder', 'guardian'],
   responsibilities: [
     'Ensure aggregations remain purely descriptive',
     'Block any aggregation that drifts toward normativity',
     'Stop "smart" features that add implicit recommendations',
     'Defend systematic boringness',
     'Review all new aggregation classes',
     'Validate sandbox results before publication',
     'Maintain forbidden phrase registry',
   ],
   veto_power: [
     'Any aggregation containing forbidden phrases',
     'Any aggregation that ranks or recommends',
     'Any aggregation that implies causation',
     'Any display format that suggests preference',
   ],
   approval_required_for: [
     'New aggregation class registration',
     'Sandbox result publication',
     'Integration target addition',
     'Display rule modifications',
   ],
 } as const;
 
 /**
  * Steward review decision
  */
 export interface StewardReview {
   readonly review_id: string;
   readonly reviewed_at: string;
   readonly aggregation_id: string;
   readonly decision: 'approved' | 'rejected' | 'needs_modification';
   readonly rejection_reason?: string;
   readonly required_modifications?: readonly string[];
   readonly reviewer_notes: string;
 }
 
 /**
  * STEWARD CHECKLIST
  * 
  * Questions the Aggregation Steward must verify for every aggregation
  */
 export const STEWARD_CHECKLIST = [
   {
     id: 'descriptive_only',
     question: 'Is this aggregation purely descriptive?',
     fail_action: 'reject',
   },
   {
     id: 'no_ranking',
     question: 'Does it avoid any form of ranking?',
     fail_action: 'reject',
   },
   {
     id: 'no_recommendation',
     question: 'Does it avoid any recommendation?',
     fail_action: 'reject',
   },
   {
     id: 'no_causation',
     question: 'Does it avoid causal language?',
     fail_action: 'reject',
   },
   {
     id: 'limitations_visible',
     question: 'Are limitations clearly displayed?',
     fail_action: 'modify',
   },
   {
     id: 'sample_size_visible',
     question: 'Is sample size visible?',
     fail_action: 'modify',
   },
   {
     id: 'boring_enough',
     question: 'Is it boring enough to be trusted?',
     fail_action: 'modify',
   },
 ] as const;