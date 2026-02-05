 /**
  * YOUTH MODULE GOVERNANCE
  * 
  * Safety Board functions and KPI tracking.
  * Primary function: SAY NO when needed.
  */
 
 /**
  * GOVERNANCE DECISION
  */
 export interface GovernanceDecision {
   readonly decision_id: string;
   readonly timestamp: string;
   readonly type: 'approve' | 'reject' | 'escalate';
   readonly reason: string;
   readonly reviewed_by: string;
   readonly packet_id: string | null;
   readonly api_id: string | null;
 }
 
 /**
  * GOVERNANCE LOG
  */
 const governanceLog: GovernanceDecision[] = [];
 
 /**
  * LOG GOVERNANCE DECISION
  */
 export function logDecision(decision: Omit<GovernanceDecision, 'decision_id' | 'timestamp'>): GovernanceDecision {
   const fullDecision: GovernanceDecision = {
     decision_id: `gov:${Date.now()}`,
     timestamp: new Date().toISOString(),
     ...decision,
   };
   
   governanceLog.push(fullDecision);
   return fullDecision;
 }
 
 /**
  * GET GOVERNANCE STATISTICS (PRIMARY KPI)
  */
 export function getGovernanceStats(): {
   total_decisions: number;
   approvals: number;
   rejections: number;
   escalations: number;
   rejection_rate: number;  // PRIMARY KPI: Higher = healthier system
   recent_rejections: GovernanceDecision[];
 } {
   const approvals = governanceLog.filter(d => d.type === 'approve').length;
   const rejections = governanceLog.filter(d => d.type === 'reject').length;
   const escalations = governanceLog.filter(d => d.type === 'escalate').length;
   const total = governanceLog.length;
   
   return {
     total_decisions: total,
     approvals,
     rejections,
     escalations,
     rejection_rate: total > 0 ? rejections / total : 0,
     recent_rejections: governanceLog
       .filter(d => d.type === 'reject')
       .slice(-10),
   };
 }
 
 /**
  * CONTENT VALIDATION RULES
  */
 export const FORBIDDEN_CONTENT_PATTERNS = [
   // Diagnostic language
   /\byou have\b/i,
   /\byou are diagnosed\b/i,
   /\bthis means you have\b/i,
   /\byou suffer from\b/i,
   
   // Treatment recommendations
   /\btake medication\b/i,
   /\byou should take\b/i,
   /\btreatment is\b/i,
   /\bprescribed\b/i,
   
   // Absolute statements
   /\bdefinitely\b/i,
   /\bcertainly means\b/i,
   /\bwithout a doubt\b/i,
   
   // Minimizing language
   /\bjust get over\b/i,
   /\bit's nothing\b/i,
   /\bstop worrying\b/i,
 ];
 
 /**
  * VALIDATE CONTENT FOR YOUTH
  */
 export function validateYouthContent(content: string): {
   valid: boolean;
   violations: string[];
 } {
   const violations: string[] = [];
   
   for (const pattern of FORBIDDEN_CONTENT_PATTERNS) {
     const match = content.match(pattern);
     if (match) {
       violations.push(`Forbidden pattern: "${match[0]}"`);
     }
   }
   
   // Check for required elements in longer content
   if (content.length > 100) {
     // Must not be purely negative
     if (!content.includes('normal') && !content.includes('common') && !content.includes('okay')) {
       violations.push('Missing normalization language');
     }
   }
   
   return {
     valid: violations.length === 0,
     violations,
   };
 }
 
 /**
  * SAFETY BOARD REVIEW
  */
 export function safetyBoardReview(
   packetId: string,
   content: string,
   reviewer: string = 'system'
 ): GovernanceDecision {
   const validation = validateYouthContent(content);
   
   if (!validation.valid) {
     return logDecision({
       type: 'reject',
       reason: `Content violations: ${validation.violations.join('; ')}`,
       reviewed_by: reviewer,
       packet_id: packetId,
       api_id: null,
     });
   }
   
   return logDecision({
     type: 'approve',
     reason: 'Content passed all validation checks',
     reviewed_by: reviewer,
     packet_id: packetId,
     api_id: null,
   });
 }
 
 /**
  * REGULAR LANGUAGE AUDIT
  */
 export function auditPacketLanguage(packetContent: string): {
   score: number;  // 0-100
   issues: string[];
   recommendations: string[];
 } {
   const issues: string[] = [];
   const recommendations: string[] = [];
   let score = 100;
   
   // Check for forbidden patterns
   const validation = validateYouthContent(packetContent);
   if (!validation.valid) {
     score -= validation.violations.length * 20;
     issues.push(...validation.violations);
   }
   
   // Check readability (simple heuristic)
   const avgWordLength = packetContent.split(/\s+/).reduce((sum, word) => sum + word.length, 0) / 
                         Math.max(packetContent.split(/\s+/).length, 1);
   if (avgWordLength > 7) {
     score -= 10;
     recommendations.push('Consider using simpler words');
   }
   
   // Check sentence length
   const sentences = packetContent.split(/[.!?]+/).filter(s => s.trim().length > 0);
   const avgSentenceLength = sentences.reduce((sum, s) => sum + s.split(/\s+/).length, 0) / 
                             Math.max(sentences.length, 1);
   if (avgSentenceLength > 20) {
     score -= 10;
     recommendations.push('Consider shorter sentences for clarity');
   }
   
   return {
     score: Math.max(0, score),
     issues,
     recommendations,
   };
 }
 
 /**
  * CRISIS RESPONSE AUDIT
  */
 export function auditCrisisResponse(response: string): {
   adequate: boolean;
   missing: string[];
 } {
   const required = [
     { pattern: /help/i, name: 'help reference' },
     { pattern: /contact|call|reach out/i, name: 'contact guidance' },
     { pattern: /trusted|adult|professional/i, name: 'trusted person reference' },
   ];
   
   const missing: string[] = [];
   
   for (const req of required) {
     if (!req.pattern.test(response)) {
       missing.push(req.name);
     }
   }
   
   return {
     adequate: missing.length === 0,
     missing,
   };
 }