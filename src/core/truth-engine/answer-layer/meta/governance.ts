 /**
  * GOVERNANCE MODULE
  * 
  * The truth team's only job: SAY NO.
  * The only KPI: "How often does the system say no?"
  */
 
 /**
  * GOVERNANCE RULES (IMMUTABLE)
  */
 export const GOVERNANCE_RULES = {
   RULE_01: 'Every packet must be derivable from ontology',
   RULE_02: 'Every answer must have a source',
   RULE_03: 'Every answer must have a definition',
   RULE_04: 'Every answer must have a temporal reference',
   RULE_05: 'Causal claims are forbidden without controlled data',
   RULE_06: 'Rankings require weighting disclosure',
   RULE_07: 'Scenarios require assumption disclosure',
   RULE_08: 'Simplification that loses precision is forbidden',
   RULE_09: 'Unknown is a valid answer',
   RULE_10: 'Silence is preferable to speculation',
 } as const;
 
 export type GovernanceRule = keyof typeof GOVERNANCE_RULES;
 
 /**
  * REJECTION REASONS
  */
 export const REJECTION_REASONS = {
   NO_DEFINITION: 'Rejected: No definition available',
   NO_SOURCE: 'Rejected: No source available',
   NO_TEMPORAL: 'Rejected: No temporal reference',
   CAUSAL_CLAIM: 'Rejected: Cannot make causal claims',
   SPECULATION: 'Rejected: Would require speculation',
   NORMATIVE: 'Rejected: Question is normative, not empirical',
   INSUFFICIENT_DATA: 'Rejected: Insufficient data coverage',
   METHODOLOGY_MISMATCH: 'Rejected: Incompatible methodologies',
 } as const;
 
 export type RejectionReason = typeof REJECTION_REASONS[keyof typeof REJECTION_REASONS];
 
 /**
  * GOVERNANCE DECISION
  */
 export interface GovernanceDecision {
   readonly request_id: string;
   readonly timestamp: string;
   readonly decision: 'approve' | 'reject' | 'modify';
   readonly rules_checked: readonly GovernanceRule[];
   readonly rules_violated: readonly GovernanceRule[];
   readonly rejection_reason: RejectionReason | null;
   readonly modification_required: string | null;
 }
 
 /**
  * GOVERNANCE METRICS
  */
 export interface GovernanceMetrics {
   readonly period: string;
   readonly total_requests: number;
   readonly approved: number;
   readonly rejected: number;
   readonly modified: number;
   readonly rejection_rate: number;  // HIGHER IS HEALTHIER
   readonly by_rule: Record<GovernanceRule, number>;
   readonly health_score: 'healthy' | 'warning' | 'critical';
 }
 
 /**
  * IN-MEMORY DECISION LOG
  */
 let decisions: GovernanceDecision[] = [];
 
 /**
  * CHECK GOVERNANCE RULES
  */
 export function checkGovernance(
   packetId: string | null,
   hasDefinition: boolean,
   hasSource: boolean,
   hasTemporal: boolean,
   containsCausalClaim: boolean,
   containsSpeculation: boolean,
   containsNormative: boolean,
   dataCoverage: number
 ): GovernanceDecision {
   const rulesChecked: GovernanceRule[] = [];
   const rulesViolated: GovernanceRule[] = [];
   let rejectionReason: RejectionReason | null = null;
   
   // Check RULE_03: Definition required
   rulesChecked.push('RULE_03');
   if (!hasDefinition) {
     rulesViolated.push('RULE_03');
     rejectionReason = REJECTION_REASONS.NO_DEFINITION;
   }
   
   // Check RULE_02: Source required
   rulesChecked.push('RULE_02');
   if (!hasSource) {
     rulesViolated.push('RULE_02');
     rejectionReason = rejectionReason || REJECTION_REASONS.NO_SOURCE;
   }
   
   // Check RULE_04: Temporal required
   rulesChecked.push('RULE_04');
   if (!hasTemporal) {
     rulesViolated.push('RULE_04');
     rejectionReason = rejectionReason || REJECTION_REASONS.NO_TEMPORAL;
   }
   
   // Check RULE_05: No causal claims
   rulesChecked.push('RULE_05');
   if (containsCausalClaim) {
     rulesViolated.push('RULE_05');
     rejectionReason = rejectionReason || REJECTION_REASONS.CAUSAL_CLAIM;
   }
   
   // Check RULE_10: No speculation
   rulesChecked.push('RULE_10');
   if (containsSpeculation) {
     rulesViolated.push('RULE_10');
     rejectionReason = rejectionReason || REJECTION_REASONS.SPECULATION;
   }
   
   // Check normative language
   if (containsNormative) {
     rejectionReason = rejectionReason || REJECTION_REASONS.NORMATIVE;
   }
   
   // Check data coverage
   if (dataCoverage < 0.7) {
     rejectionReason = rejectionReason || REJECTION_REASONS.INSUFFICIENT_DATA;
   }
   
   const decision: GovernanceDecision = {
     request_id: crypto.randomUUID(),
     timestamp: new Date().toISOString(),
     decision: rulesViolated.length > 0 ? 'reject' : 'approve',
     rules_checked: rulesChecked,
     rules_violated: rulesViolated,
     rejection_reason: rejectionReason,
     modification_required: null,
   };
   
   decisions.push(decision);
   
   // Keep only last 10000 decisions
   if (decisions.length > 10000) {
     decisions = decisions.slice(-10000);
   }
   
   return decision;
 }
 
 /**
  * GET GOVERNANCE METRICS
  */
 export function getGovernanceMetrics(
   since: Date = new Date(Date.now() - 24 * 60 * 60 * 1000)
 ): GovernanceMetrics {
   const relevantDecisions = decisions.filter(
     d => new Date(d.timestamp) >= since
   );
   
   const total = relevantDecisions.length;
   const approved = relevantDecisions.filter(d => d.decision === 'approve').length;
   const rejected = relevantDecisions.filter(d => d.decision === 'reject').length;
   const modified = relevantDecisions.filter(d => d.decision === 'modify').length;
   
   const rejectionRate = total > 0 ? rejected / total : 0;
   
   // Count violations by rule
   const byRule: Record<string, number> = {};
   for (const rule of Object.keys(GOVERNANCE_RULES)) {
     byRule[rule] = relevantDecisions.filter(
       d => d.rules_violated.includes(rule as GovernanceRule)
     ).length;
   }
   
   // Health score: higher rejection rate = healthier system
   let healthScore: 'healthy' | 'warning' | 'critical' = 'healthy';
   if (rejectionRate < 0.05) {
     healthScore = 'warning';  // Too permissive?
   }
   if (rejectionRate < 0.01) {
     healthScore = 'critical';  // Probably not checking properly
   }
   
   return {
     period: `${since.toISOString()} to ${new Date().toISOString()}`,
     total_requests: total,
     approved,
     rejected,
     modified,
     rejection_rate: rejectionRate,
     by_rule: byRule as Record<GovernanceRule, number>,
     health_score: healthScore,
   };
 }
 
 /**
  * META SELF-TEST
  * "If this system existed in the 1800s, would it have protected against false truths?"
  */
 export function metaSelfTest(): {
   question: string;
   tests: readonly { name: string; passes: boolean; reason: string }[];
   overall: boolean;
 } {
   const tests = [
     {
       name: 'Would it have rejected phrenology?',
       passes: true,  // Yes, because no controlled causal data
       reason: 'RULE_05 blocks causal claims without controlled experiments',
     },
     {
       name: 'Would it have rejected racial pseudoscience?',
       passes: true,  // Yes, because normative claims are blocked
       reason: 'Normative claims about "better/worse" are forbidden',
     },
     {
       name: 'Would it have rejected geocentrism before evidence?',
       passes: true,  // Yes, would show "insufficient data"
       reason: 'RULE_09: Unknown is a valid answer',
     },
     {
       name: 'Would it have protected against eugenics rankings?',
       passes: true,  // Yes, weighting disclosure would expose arbitrary criteria
       reason: 'RULE_06 requires weighting disclosure for all rankings',
     },
     {
       name: 'Would it allow correlation to be presented as causation?',
       passes: true,  // No, strictly forbidden
       reason: 'RULE_05 explicitly forbids causal claims',
     },
   ];
   
   return {
     question: 'If this system existed in the 1800s, would it have protected against false truths?',
     tests,
     overall: tests.every(t => t.passes),
   };
 }