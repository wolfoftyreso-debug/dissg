 /**
  * TRUTH ENGINE SPEC - SECTION 6
  * 
  * AGGREGATION LAW (CRITICAL)
  */
 
 /**
  * 6.1 PROHIBITION
  * 
  * Aggregation is FORBIDDEN without:
  * - Explicit permission
  * - Machine-readable rule
  * - Defined weighting
  */
 export const AGGREGATION_PROHIBITION = {
   principle: 'Aggregation is forbidden without explicit permission, rule, and weighting.',
   
   required: [
     'Explicit permission from query',
     'Machine-readable aggregation rule',
     'Defined weighting method',
     'Coverage declaration',
     'Methodology documentation',
   ],
   
   forbidden: [
     'Implicit aggregation',
     'Default weighting',
     'Hidden coverage gaps',
     'Automatic summarization',
   ],
 } as const;
 
 /**
  * AGGREGATION PERMIT
  */
 export interface AggregationPermit {
   readonly permit_id: string;
   readonly granted_at: string;
   readonly expires_at: string;
   readonly aggregation_rule: {
     method: 'sum' | 'mean' | 'weighted_mean' | 'median' | 'custom';
     weighting: {
       method: string;
       weights: Record<string, number> | null;
     };
     coverage_requirement: number; // 0-1
   };
   readonly granted_by: string; // User or system that granted
 }
 
 /**
  * 6.2 AGGREGATION AS ACTION
  * 
  * Aggregation is NOT data – it is an OPERATION WITH RESPONSIBILITY.
  */
 export interface AggregationOperation {
   readonly operation_id: string;
   readonly permit_id: string;
   readonly input_ids: string[];
   readonly output_id: string;
   readonly executed_at: string;
   readonly responsible_entity: string;
   readonly audit_trail: {
     step: number;
     action: string;
     result: unknown;
   }[];
 }
 
 /**
  * Validate aggregation request
  */
 export function validateAggregationRequest(request: {
   has_permission?: boolean;
   has_rule?: boolean;
   has_weighting?: boolean;
   coverage?: number;
 }): {
   permitted: boolean;
   missing: string[];
 } {
   const missing: string[] = [];
   
   if (!request.has_permission) missing.push('Explicit permission');
   if (!request.has_rule) missing.push('Machine-readable rule');
   if (!request.has_weighting) missing.push('Defined weighting');
   if (request.coverage === undefined) missing.push('Coverage declaration');
   
   return {
     permitted: missing.length === 0,
     missing,
   };
 }
 
 /**
  * Assert aggregation responsibility
  */
 export function assertAggregationResponsibility(
   operation: AggregationOperation
 ): void {
   if (!operation.permit_id) {
     throw new Error('AGGREGATION VIOLATION: Operation has no permit');
   }
   
   if (!operation.responsible_entity) {
     throw new Error('AGGREGATION VIOLATION: No responsible entity defined');
   }
   
   if (!operation.audit_trail || operation.audit_trail.length === 0) {
     throw new Error('AGGREGATION VIOLATION: No audit trail');
   }
 }