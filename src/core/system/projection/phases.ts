 /**
  * PROJECTION PHASES
  * 
  * Year 10-25: When the system becomes invisible
  * From standard → infrastructure → assumption
  */
 
 export interface PhaseEffect {
   readonly description: string;
   readonly domain: 'institutional' | 'cognitive' | 'behavioral' | 'structural';
   readonly reversible: boolean;
 }
 
 export interface PhaseState {
   readonly description: string;
   readonly indicators: readonly string[];
 }
 
 export interface ProjectionPhase {
   readonly id: string;
   readonly years: readonly [number, number];
   readonly title: string;
   readonly subtitle: string;
   readonly state: PhaseState;
   readonly key_change: string;
   readonly effects: readonly PhaseEffect[];
 }
 
 /**
  * YEAR 10-12: INSTITUTIONAL NORMALITY
  * "Why wouldn't we use it?"
  */
 const PHASE_INSTITUTIONAL_NORMALITY: ProjectionPhase = {
   id: 'institutional_normality',
   years: [10, 12],
   title: 'Institutional Normality',
   subtitle: 'Why wouldn\'t we use it?',
   state: {
     description: 'System no longer described as "new". Used as expected practice.',
     indicators: [
       'Board work references decision objects',
       'Major investments require structured context',
       'Policy preparation uses uncertainty declarations',
       'AI decision support integrates natively',
     ],
   },
   key_change: 'Decisions without structured context perceived as negligence',
   effects: [
     {
       description: 'Documents lacking uncertainty sections considered incomplete',
       domain: 'institutional',
       reversible: false,
     },
     {
       description: 'Responsibility shifts from person to process',
       domain: 'structural',
       reversible: false,
     },
     {
       description: 'Charismatic decision-making loses status',
       domain: 'behavioral',
       reversible: true,
     },
   ],
 } as const;
 
 /**
  * YEAR 13-15: HISTORICAL DEPTH
  * "We can see the pattern now."
  */
 const PHASE_HISTORICAL_DEPTH: ProjectionPhase = {
   id: 'historical_depth',
   years: [13, 15],
   title: 'Historical Depth',
   subtitle: 'We can see the pattern now.',
   state: {
     description: '10-15 years of decisions archived. Same decision types comparable across time, regions, organizations.',
     indicators: [
       'Cross-temporal decision comparison available',
       'Cross-regional pattern analysis enabled',
       'Cross-organizational learning possible',
       'Decision archaeology becomes discipline',
     ],
   },
   key_change: 'Researchers analyze decision patterns, not just outcomes',
   effects: [
     {
       description: 'Historians use system as primary source: "This is how they thought when they didn\'t know X"',
       domain: 'cognitive',
       reversible: false,
     },
     {
       description: 'Myth of "nobody could have known" weakens',
       domain: 'institutional',
       reversible: false,
     },
     {
       description: 'Difference between ignorance and negligence becomes visible',
       domain: 'structural',
       reversible: false,
     },
   ],
 } as const;
 
 /**
  * YEAR 16-18: AI COLLABORATION (FOR REAL)
  * "This is how you ask the world."
  */
 const PHASE_AI_COLLABORATION: ProjectionPhase = {
   id: 'ai_collaboration',
   years: [16, 18],
   title: 'AI Collaboration',
   subtitle: 'This is how you ask the world.',
   state: {
     description: 'New AI models trained with decisions as objects, uncertainty as first-class data, alternatives as symmetric nodes.',
     indicators: [
       'Decisions treated as structured objects in training',
       'Uncertainty modeled as first-class data type',
       'Alternatives represented as symmetric nodes',
       'Pattern recognition across decision space',
     ],
   },
   key_change: 'AI hallucination markedly reduced in structured decision domains',
   effects: [
     {
       description: 'AI can say: "This decision resembles others where uncertainty X was underestimated" - not as advice, as pattern recognition',
       domain: 'cognitive',
       reversible: false,
     },
     {
       description: 'Human + AI become complementary',
       domain: 'structural',
       reversible: false,
     },
     {
       description: 'AI does not take responsibility - it exposes structure',
       domain: 'institutional',
       reversible: false,
     },
   ],
 } as const;
 
 /**
  * YEAR 19-21: POWER SHIFT WITHOUT CONFLICT
  * "It is difficult to make bad decisions in silence."
  */
 const PHASE_POWER_SHIFT: ProjectionPhase = {
   id: 'power_shift',
   years: [19, 21],
   title: 'Power Shift Without Conflict',
   subtitle: 'It is difficult to make bad decisions in silence.',
   state: {
     description: 'Organizations know the future can read. Decision processes scrutinized more than their PR.',
     indicators: [
       'Future readability awareness embedded',
       'Process transparency valued over outcome spin',
       'Preparation visibility expected',
       'Silent extreme decisions rare',
     ],
   },
   key_change: 'Fewer extreme decisions without preparation',
   effects: [
     {
       description: 'More decisions with explicit "we don\'t know"',
       domain: 'behavioral',
       reversible: true,
     },
     {
       description: 'Risk taken more consciously',
       domain: 'cognitive',
       reversible: false,
     },
     {
       description: 'Caution gets a language that is not cowardice',
       domain: 'institutional',
       reversible: false,
     },
   ],
 } as const;
 
 /**
  * YEAR 22-25: CIVILIZATIONAL INFRASTRUCTURE
  * "This has always existed."
  */
 const PHASE_CIVILIZATIONAL_INFRASTRUCTURE: ProjectionPhase = {
   id: 'civilizational_infrastructure',
   years: [22, 25],
   title: 'Civilizational Infrastructure',
   subtitle: 'This has always existed.',
   state: {
     description: 'No one remembers who built the system. No one argues for its existence. It is simply used.',
     indicators: [
       'Origin story forgotten',
       'Existence unquestioned',
       'Usage automatic',
       'Alternatives unthinkable',
     ],
   },
   key_change: 'System becomes invisible through ubiquity',
   effects: [
     {
       description: 'Questions are better formulated',
       domain: 'cognitive',
       reversible: false,
     },
     {
       description: 'Decisions are slower where they should be slow, faster where they can be fast',
       domain: 'behavioral',
       reversible: true,
     },
     {
       description: 'Uncertainty is no longer shameful',
       domain: 'institutional',
       reversible: false,
     },
   ],
 } as const;
 
 /**
  * COMPLETE PHASE TIMELINE
  */
 export const PROJECTION_PHASES: readonly ProjectionPhase[] = [
   PHASE_INSTITUTIONAL_NORMALITY,
   PHASE_HISTORICAL_DEPTH,
   PHASE_AI_COLLABORATION,
   PHASE_POWER_SHIFT,
   PHASE_CIVILIZATIONAL_INFRASTRUCTURE,
 ] as const;
 
 export const PHASE_TIMELINE = {
   start_year: 10,
   end_year: 25,
   total_phases: 5,
   phases: PROJECTION_PHASES,
 } as const;