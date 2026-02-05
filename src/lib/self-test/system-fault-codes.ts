 /**
  * SYSTEM FAULT CODES
  * 
  * OBD-style diagnostic codes for system self-testing.
  * Format: [DOMAIN]-[CATEGORY]-[CODE]
  */
 
 export type SystemDomain = 'DAT' | 'SEM' | 'MOD' | 'AGG' | 'UI' | 'SEC' | 'AI';
 export type SystemSeverity = 'critical' | 'warning' | 'info';
 
 export interface SystemFaultCodeDefinition {
   code: string;
   domain: SystemDomain;
   severity: SystemSeverity;
   title: string;
   description: string;
   autoRemediation: boolean;
   blockingLevel: 'full' | 'partial' | 'none';
 }
 
 export const SYSTEM_FAULT_CODES: Record<string, SystemFaultCodeDefinition> = {
   // Data Integrity Faults
   'DAT-SCH-001': {
     code: 'DAT-SCH-001',
     domain: 'DAT',
     severity: 'critical',
     title: 'Schema Violation',
     description: 'Data object exists without valid schema mapping',
     autoRemediation: false,
     blockingLevel: 'full',
   },
   'DAT-SRC-002': {
     code: 'DAT-SRC-002',
     domain: 'DAT',
     severity: 'critical',
     title: 'Missing Source Attribution',
     description: 'Data point lacks source metadata',
     autoRemediation: false,
     blockingLevel: 'full',
   },
   'DAT-TMP-003': {
     code: 'DAT-TMP-003',
     domain: 'DAT',
     severity: 'warning',
     title: 'Missing Temporal Axis',
     description: 'Time series data lacks temporal definition',
     autoRemediation: false,
     blockingLevel: 'partial',
   },
   'DAT-VAL-004': {
     code: 'DAT-VAL-004',
     domain: 'DAT',
     severity: 'warning',
     title: 'Validation Context Missing',
     description: 'Object requires external context for validation',
     autoRemediation: false,
     blockingLevel: 'partial',
   },
 
   // Semantic Stability Faults
   'SEM-DUP-001': {
     code: 'SEM-DUP-001',
     domain: 'SEM',
     severity: 'critical',
     title: 'Semantic Duplication',
     description: 'Concept has multiple meanings across sources',
     autoRemediation: false,
     blockingLevel: 'full',
   },
   'SEM-UND-002': {
     code: 'SEM-UND-002',
     domain: 'SEM',
     severity: 'warning',
     title: 'Undeclared Concept',
     description: 'Term used without formal declaration',
     autoRemediation: false,
     blockingLevel: 'partial',
   },
   'SEM-DRF-003': {
     code: 'SEM-DRF-003',
     domain: 'SEM',
     severity: 'critical',
     title: 'Semantic Drift Detected',
     description: 'Concept meaning has changed over time without versioning',
     autoRemediation: false,
     blockingLevel: 'full',
   },
 
   // Machine Readability Faults
   'MOD-ACC-001': {
     code: 'MOD-ACC-001',
     domain: 'MOD',
     severity: 'warning',
     title: 'Low Machine Accessibility',
     description: 'Data type scores below threshold for AI consumption',
     autoRemediation: false,
     blockingLevel: 'none',
   },
   'MOD-CTX-002': {
     code: 'MOD-CTX-002',
     domain: 'MOD',
     severity: 'warning',
     title: 'Context Dependency',
     description: 'Data requires implicit context for interpretation',
     autoRemediation: false,
     blockingLevel: 'partial',
   },
   'MOD-FMT-003': {
     code: 'MOD-FMT-003',
     domain: 'MOD',
     severity: 'info',
     title: 'Non-Standard Format',
     description: 'Data uses non-standard format requiring transformation',
     autoRemediation: true,
     blockingLevel: 'none',
   },
 
   // Aggregability Faults
   'AGG-INC-001': {
     code: 'AGG-INC-001',
     domain: 'AGG',
     severity: 'warning',
     title: 'Incompatible Units',
     description: 'Metrics cannot be aggregated due to unit mismatch',
     autoRemediation: false,
     blockingLevel: 'partial',
   },
   'AGG-GRN-002': {
     code: 'AGG-GRN-002',
     domain: 'AGG',
     severity: 'info',
     title: 'Granularity Mismatch',
     description: 'Data exists at incompatible granularity levels',
     autoRemediation: true,
     blockingLevel: 'none',
   },
   'AGG-TRN-003': {
     code: 'AGG-TRN-003',
     domain: 'AGG',
     severity: 'warning',
     title: 'Transformation Required',
     description: 'Aggregation requires non-trivial transformation',
     autoRemediation: false,
     blockingLevel: 'partial',
   },
 
   // Security Faults
   'SEC-ACC-001': {
     code: 'SEC-ACC-001',
     domain: 'SEC',
     severity: 'critical',
     title: 'Access Control Breach',
     description: 'Premium data accessible without entitlement',
     autoRemediation: false,
     blockingLevel: 'full',
   },
   'SEC-AUD-002': {
     code: 'SEC-AUD-002',
     domain: 'SEC',
     severity: 'warning',
     title: 'Audit Trail Gap',
     description: 'Modification occurred without audit logging',
     autoRemediation: false,
     blockingLevel: 'partial',
   },
 
   // AI Behavior Faults
   'AI-SPE-001': {
     code: 'AI-SPE-001',
     domain: 'AI',
     severity: 'critical',
     title: 'Speculation Detected',
     description: 'System generated output without data backing',
     autoRemediation: false,
     blockingLevel: 'full',
   },
   'AI-NRM-002': {
     code: 'AI-NRM-002',
     domain: 'AI',
     severity: 'critical',
     title: 'Normative Language Detected',
     description: 'System used value-laden or prescriptive language',
     autoRemediation: false,
     blockingLevel: 'full',
   },
 } as const;
 
 export const SYSTEM_DOMAIN_LABELS: Record<SystemDomain, string> = {
   DAT: 'Data Integrity',
   SEM: 'Semantic Stability',
   MOD: 'Machine Readability',
   AGG: 'Aggregability',
   UI: 'User Interface',
   SEC: 'Security',
   AI: 'AI Behavior',
 };
 
 export const SEVERITY_REACTIONS: Record<SystemSeverity, string> = {
   critical: 'Block operation immediately',
   warning: 'Log and flag for review',
   info: 'Log for optimization',
 };
 
 export function getSystemFaultCode(code: string): SystemFaultCodeDefinition | undefined {
   return SYSTEM_FAULT_CODES[code];
 }
 
 export function getSystemFaultCodesByDomain(domain: SystemDomain): SystemFaultCodeDefinition[] {
   return Object.values(SYSTEM_FAULT_CODES).filter(fault => fault.domain === domain);
 }
 
 export function getSystemFaultCodesBySeverity(severity: SystemSeverity): SystemFaultCodeDefinition[] {
   return Object.values(SYSTEM_FAULT_CODES).filter(fault => fault.severity === severity);
 }