 /**
  * INVISIBILITY MARKERS
  * 
  * How to know the system has succeeded:
  * When it becomes invisible through ubiquity
  */
 
 export interface InvisibilityMarker {
   readonly id: string;
   readonly description: string;
   readonly detection_method: string;
   readonly phase: 'early' | 'middle' | 'late' | 'complete';
   readonly reversible: boolean;
 }
 
 /**
  * MARKERS OF SUCCESS
  * 
  * Signs that the system has achieved its purpose (in order)
  */
 export const INVISIBILITY_MARKERS: readonly InvisibilityMarker[] = [
   {
     id: 'ai_question_reformulation',
     description: 'AI starts formulating questions differently',
     detection_method: 'Query pattern analysis shows structural shift',
     phase: 'early',
     reversible: true,
   },
   {
     id: 'cannot_answer_cited',
     description: '"Cannot answer yet" is cited as valuable',
     detection_method: 'External references to uncertainty declarations',
     phase: 'early',
     reversible: false,
   },
   {
     id: 'structure_over_quotes',
     description: 'Journalists link to structure, not quotes',
     detection_method: 'Link analysis shows structural references dominate',
     phase: 'middle',
     reversible: false,
   },
   {
     id: 'decisions_as_objects',
     description: 'Decisions referenced as objects ("DEC-123")',
     detection_method: 'External usage of decision IDs',
     phase: 'middle',
     reversible: false,
   },
   {
     id: 'question_quality_shift',
     description: 'People stop asking "what is best"',
     detection_method: 'Query taxonomy shift from superlative to comparative',
     phase: 'late',
     reversible: true,
   },
   {
     id: 'origin_forgotten',
     description: 'No one remembers who built it',
     detection_method: 'Survey shows origin unknown to majority of users',
     phase: 'complete',
     reversible: false,
   },
   {
     id: 'existence_unquestioned',
     description: 'No one argues for its existence',
     detection_method: 'Absence of advocacy indicates assumed value',
     phase: 'complete',
     reversible: false,
   },
 ] as const;
 
 /**
  * COMPETITOR MOAT
  * 
  * Why this is too late for competitors when these markers appear
  */
 export const COMPETITOR_BARRIER = {
   structural: 'Cannot copy epistemic discipline',
   temporal: 'Cannot replicate historical depth',
   semantic: 'Cannot adopt decision ontology retroactively',
   institutional: 'Cannot gain trust without track record',
 } as const;
 
 /**
  * Assess current invisibility level
  */
 export function assessInvisibility(
   markersAchieved: readonly string[]
 ): {
   phase: 'pre' | 'early' | 'middle' | 'late' | 'complete';
   percentage: number;
   nextMarker: InvisibilityMarker | null;
 } {
   const achieved = new Set(markersAchieved);
   const total = INVISIBILITY_MARKERS.length;
   const count = INVISIBILITY_MARKERS.filter(m => achieved.has(m.id)).length;
   
   const percentage = Math.round((count / total) * 100);
   
   let phase: 'pre' | 'early' | 'middle' | 'late' | 'complete';
   if (count === 0) phase = 'pre';
   else if (count <= 2) phase = 'early';
   else if (count <= 4) phase = 'middle';
   else if (count <= 6) phase = 'late';
   else phase = 'complete';
   
   const nextMarker = INVISIBILITY_MARKERS.find(m => !achieved.has(m.id)) ?? null;
   
   return { phase, percentage, nextMarker };
 }
 
 /**
  * FINAL STATEMENT
  * 
  * The system's ultimate success condition
  */
 export const SUCCESS_CONDITION = 
   'When the system is no longer discussed, only used.' as const;