 /**
  * TRUTH ENGINE SPEC - SECTION 9
  * 
  * SELF-REVISION
  */
 
 /**
  * 9.1 REVISION DUTY
  * 
  * System shall continuously question:
  * - definitions
  * - sources
  * - conclusions
  */
 export const REVISION_DUTY = {
   principle: 'System shall continuously question definitions, sources, and conclusions.',
   
   targets: [
     {
       type: 'definition',
       question: 'Has the meaning of this definition drifted?',
       check_frequency: 'daily',
     },
     {
       type: 'source',
       question: 'Is this source still reliable and consistent?',
       check_frequency: 'daily',
     },
     {
       type: 'conclusion',
       question: 'Is this conclusion still supported by current data?',
       check_frequency: 'on_data_update',
     },
   ],
 } as const;
 
 /**
  * Revision check result
  */
 export interface RevisionCheck {
   readonly target_id: string;
   readonly target_type: 'definition' | 'source' | 'conclusion';
   readonly checked_at: string;
   readonly status: 'VALID' | 'NEEDS_REVIEW' | 'INVALID';
   readonly findings: string[];
   readonly recommended_action: string | null;
 }
 
 /**
  * 9.2 CONCLUSION PERISHABILITY
  * 
  * All conclusions have BEST-BEFORE dates.
  */
 export const CONCLUSION_PERISHABILITY = {
   principle: 'All conclusions have best-before dates.',
   
   rules: [
     'No conclusion without valid_until timestamp',
     'Expired conclusions must be re-validated',
     'Stale conclusions are demoted in relevance',
     'Ancient conclusions require explicit acknowledgment to use',
   ],
   
   default_lifespans: {
     short_term: '30 days',
     medium_term: '180 days',
     long_term: '365 days',
     max_allowed: '730 days', // 2 years absolute max
   },
 } as const;
 
 /**
  * Check conclusion freshness
  */
 export function checkConclusionFreshness(
   validUntil: string,
   currentTime: string = new Date().toISOString()
 ): {
   fresh: boolean;
   status: 'FRESH' | 'STALE' | 'EXPIRED';
   days_remaining: number;
 } {
   const valid = new Date(validUntil);
   const now = new Date(currentTime);
   const diffMs = valid.getTime() - now.getTime();
   const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
   
   let status: 'FRESH' | 'STALE' | 'EXPIRED';
   if (diffDays <= 0) {
     status = 'EXPIRED';
   } else if (diffDays <= 30) {
     status = 'STALE';
   } else {
     status = 'FRESH';
   }
   
   return {
     fresh: status === 'FRESH',
     status,
     days_remaining: Math.max(0, diffDays),
   };
 }