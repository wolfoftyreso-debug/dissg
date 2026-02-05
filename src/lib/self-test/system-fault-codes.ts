 /**
  * SYSTEM FAULT CODES
  * 
  * Machine-readable error classification.
  * Every violation has a unique, permanent code.
  */
 
 export type SystemDomain = 'SYS' | 'DAT' | 'MOD' | 'UI' | 'AI' | 'SEC';
 export type SystemSeverity = 'CRITICAL' | 'ERROR' | 'WARNING' | 'INFO';
 
 export interface SystemFaultCodeDefinition {
   code: string;
   domain: SystemDomain;
   severity: SystemSeverity;
   title: string;
   description: string;
   autoBlock: boolean;
   requiresHumanReview: boolean;
 }
 
 export const SYSTEM_FAULT_CODES: Record<string, SystemFaultCodeDefinition> = {
   // === PRINCIPLE 1: Machines are primary users ===
   'SYS-MRP-001': {
     code: 'SYS-MRP-001',
     domain: 'SYS',
     severity: 'CRITICAL',
     title: 'Schema requires human context',
     description: 'Schema cannot be interpreted by AI without external documentation',
     autoBlock: true,
     requiresHumanReview: false,
   },
   'SYS-MRP-002': {
     code: 'SYS-MRP-002',
     domain: 'SYS',
     severity: 'ERROR',
     title: 'Implicit field semantics',
     description: 'Field meaning depends on context not encoded in schema',
     autoBlock: true,
     requiresHumanReview: false,
   },
   
   // === PRINCIPLE 2: Explicit uncertainty ===
   'DAT-UNC-001': {
     code: 'DAT-UNC-001',
     domain: 'DAT',
     severity: 'CRITICAL',
     title: 'Hidden uncertainty',
     description: 'Data appears clean but has undeclared uncertainty bounds',
     autoBlock: true,
     requiresHumanReview: true,
   },
   'DAT-UNC-002': {
     code: 'DAT-UNC-002',
     domain: 'DAT',
     severity: 'ERROR',
     title: 'Conflicting sources suppressed',
     description: 'Contradictory data was discarded instead of preserved',
     autoBlock: true,
     requiresHumanReview: true,
   },
   'DAT-UNC-003': {
     code: 'DAT-UNC-003',
     domain: 'DAT',
     severity: 'WARNING',
     title: 'Missing confidence bounds',
     description: 'Numeric value lacks confidence interval or quality flag',
     autoBlock: false,
     requiresHumanReview: false,
   },
   
   // === PRINCIPLE 3: Temporal axis is sacred ===
   'DAT-TMP-001': {
     code: 'DAT-TMP-001',
     domain: 'DAT',
     severity: 'CRITICAL',
     title: 'Missing temporal axis',
     description: 'Data point has no valid_from/valid_to timestamps',
     autoBlock: true,
     requiresHumanReview: false,
   },
   'DAT-TMP-002': {
     code: 'DAT-TMP-002',
     domain: 'DAT',
     severity: 'CRITICAL',
     title: 'Non-reproducible history',
     description: 'Historical state cannot be reconstructed exactly',
     autoBlock: true,
     requiresHumanReview: true,
   },
   'DAT-TMP-003': {
     code: 'DAT-TMP-003',
     domain: 'DAT',
     severity: 'ERROR',
     title: 'Unexplained temporal mutation',
     description: 'Data changed without recorded supersede relation',
     autoBlock: true,
     requiresHumanReview: true,
   },
   
   // === STRUCTURAL DISCIPLINE ===
   'MOD-NRM-001': {
     code: 'MOD-NRM-001',
     domain: 'MOD',
     severity: 'ERROR',
     title: 'Multi-meaning object',
     description: 'Object contains multiple distinct semantic meanings',
     autoBlock: true,
     requiresHumanReview: false,
   },
   'MOD-NRM-002': {
     code: 'MOD-NRM-002',
     domain: 'MOD',
     severity: 'ERROR',
     title: 'Context-dependent meaning',
     description: 'Object interpretation requires external context',
     autoBlock: true,
     requiresHumanReview: false,
   },
   'MOD-HIR-001': {
     code: 'MOD-HIR-001',
     domain: 'MOD',
     severity: 'ERROR',
     title: 'Implicit hierarchy',
     description: 'Structural nesting without formal relation',
     autoBlock: true,
     requiresHumanReview: false,
   },
   'MOD-UNT-001': {
     code: 'MOD-UNT-001',
     domain: 'MOD',
     severity: 'ERROR',
     title: 'Missing unit definition',
     description: 'Numeric value has no defined unit or cannot be converted',
     autoBlock: true,
     requiresHumanReview: false,
   },
   
   // === SEMANTIC INTEGRITY ===
   'DAT-SEM-001': {
     code: 'DAT-SEM-001',
     domain: 'DAT',
     severity: 'CRITICAL',
     title: 'Definition collision',
     description: 'Same value with different definitions treated as identical',
     autoBlock: true,
     requiresHumanReview: true,
   },
   'DAT-SEM-002': {
     code: 'DAT-SEM-002',
     domain: 'DAT',
     severity: 'CRITICAL',
     title: 'Schema mutation without new ID',
     description: 'Schema definition changed without version increment',
     autoBlock: true,
     requiresHumanReview: true,
   },
   'DAT-SEM-003': {
     code: 'DAT-SEM-003',
     domain: 'DAT',
     severity: 'WARNING',
     title: 'Semantic overlap detected',
     description: 'Two definitions overlap >30% without formal relation',
     autoBlock: false,
     requiresHumanReview: true,
   },
   
   // === ONTOLOGICAL HEALTH ===
   'MOD-ONT-001': {
     code: 'MOD-ONT-001',
     domain: 'MOD',
     severity: 'WARNING',
     title: 'Isolated entity',
     description: 'Entity has 0-1 relations, likely modeling error',
     autoBlock: false,
     requiresHumanReview: true,
   },
   'MOD-ONT-002': {
     code: 'MOD-ONT-002',
     domain: 'MOD',
     severity: 'WARNING',
     title: 'Overloaded entity',
     description: 'Entity has excessive relations, should be decomposed',
     autoBlock: false,
     requiresHumanReview: true,
   },
   'MOD-AGG-001': {
     code: 'MOD-AGG-001',
     domain: 'MOD',
     severity: 'ERROR',
     title: 'Non-aggregatable indicator',
     description: 'Indicator cannot aggregate globally without assumptions',
     autoBlock: false,
     requiresHumanReview: true,
   },
   
   // === AI SAFETY ===
   'AI-CNF-001': {
     code: 'AI-CNF-001',
     domain: 'AI',
     severity: 'ERROR',
     title: 'High confusion potential',
     description: 'Schema likely to be misinterpreted by AI without context',
     autoBlock: false,
     requiresHumanReview: true,
   },
   'AI-SPE-001': {
     code: 'AI-SPE-001',
     domain: 'AI',
     severity: 'CRITICAL',
     title: 'Speculation in output',
     description: 'AI generated content without sufficient data backing',
     autoBlock: true,
     requiresHumanReview: false,
   },
 } as const;
 
 export const SYSTEM_DOMAIN_LABELS: Record<SystemDomain, string> = {
   SYS: 'System Architecture',
   DAT: 'Data Integrity',
   MOD: 'Model Structure',
   UI: 'User Interface',
   AI: 'AI Behavior',
   SEC: 'Security',
 };
 
 export const SEVERITY_REACTIONS: Record<SystemSeverity, { block: boolean; alert: boolean; log: boolean }> = {
   CRITICAL: { block: true, alert: true, log: true },
   ERROR: { block: true, alert: true, log: true },
   WARNING: { block: false, alert: false, log: true },
   INFO: { block: false, alert: false, log: true },
 };
 
 export function getSystemFaultCode(code: string): SystemFaultCodeDefinition | undefined {
   return SYSTEM_FAULT_CODES[code];
 }
 
 export function getSystemFaultCodesByDomain(domain: SystemDomain): SystemFaultCodeDefinition[] {
   return Object.values(SYSTEM_FAULT_CODES).filter(f => f.domain === domain);
 }
 
 export function getSystemFaultCodesBySeverity(severity: SystemSeverity): SystemFaultCodeDefinition[] {
   return Object.values(SYSTEM_FAULT_CODES).filter(f => f.severity === severity);
 }