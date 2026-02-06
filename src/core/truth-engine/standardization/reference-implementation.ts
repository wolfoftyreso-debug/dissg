/**
 * REFERENCE IMPLEMENTATION EFFECT
 * 
 * STEG 23: BECOMING THE DEFAULT ANSWER
 * 
 * When someone builds:
 * - A new index
 * - A local statistics platform
 * - An industry-specific AI system
 * 
 * And they ask: "How should we structure this?"
 * 
 * The answer becomes: "Do what the global index does."
 * 
 * You are then reference implementation, whether you said it or not.
 */

/**
 * REFERENCE STATUS
 */
export type ReferenceStatus = 
  | 'unknown'
  | 'alternative'
  | 'recommended'
  | 'de_facto'
  | 'canonical';

/**
 * REFERENCE DOMAIN
 */
export interface ReferenceDomain {
  readonly domain: string;
  readonly description: string;
  readonly status: ReferenceStatus;
  readonly competitors: string[];
  readonly adoption_signals: string[];
}

/**
 * DOMAINS WHERE WE ARE REFERENCE
 */
export const REFERENCE_DOMAINS: readonly ReferenceDomain[] = [
  {
    domain: 'canonical_question_structure',
    description: 'How to structure questions about facts',
    status: 'de_facto',
    competitors: [],
    adoption_signals: [
      'Others copy our CQ schema',
      'AI agents expect our format',
      'Documentation references us',
    ],
  },
  {
    domain: 'epistemic_state_vocabulary',
    description: 'How to express certainty and uncertainty',
    status: 'de_facto',
    competitors: [],
    adoption_signals: [
      'Others use our terminology',
      'Legal documents cite our states',
      'Academic papers reference us',
    ],
  },
  {
    domain: 'provenance_chain',
    description: 'How to trace data origin',
    status: 'de_facto',
    competitors: ['W3C PROV'],
    adoption_signals: [
      'Auditors accept our format',
      'AI systems verify using our chain',
      'Data providers publish in our format',
    ],
  },
  {
    domain: 'query_semantics',
    description: 'How to query factual databases',
    status: 'recommended',
    competitors: ['SPARQL', 'GraphQL'],
    adoption_signals: [
      'New platforms adopt our DSL',
      'Tutorials teach our format',
      'Tools support our queries',
    ],
  },
  {
    domain: 'entity_identification',
    description: 'How to identify global entities',
    status: 'de_facto',
    competitors: ['Wikidata', 'ISNI'],
    adoption_signals: [
      'Cross-references use our IDs',
      'Registries link to us',
      'AI agents resolve to our entities',
    ],
  },
];

/**
 * REFERENCE IMPLEMENTATION CHARACTERISTICS
 */
export const REFERENCE_CHARACTERISTICS = {
  // What makes something a reference
  requirements: [
    'publicly_documented',
    'freely_inspectable',
    'obviously_structured',
    'demonstrably_working',
    'actively_maintained',
  ],
  
  // What we provide
  we_provide: [
    'Complete schema definitions',
    'Working implementation',
    'Extensive documentation',
    'Real-world usage examples',
    'Migration guides from alternatives',
  ],
  
  // The question we answer
  the_question: 'How should we structure this?',
  
  // The answer we become
  the_answer: 'Do what the global index does.',
} as const;

/**
 * ADOPTION PATHWAY
 */
export interface AdoptionPathway {
  readonly stage: number;
  readonly name: string;
  readonly description: string;
  readonly indicator: string;
}

/**
 * HOW OTHERS ADOPT
 */
export const ADOPTION_PATHWAY: readonly AdoptionPathway[] = [
  {
    stage: 1,
    name: 'Discovery',
    description: 'Someone encounters the system',
    indicator: 'First API call or documentation visit',
  },
  {
    stage: 2,
    name: 'Evaluation',
    description: 'They compare to alternatives',
    indicator: 'Schema download, comparison requests',
  },
  {
    stage: 3,
    name: 'Experimentation',
    description: 'They try using the format',
    indicator: 'Test queries, sandbox usage',
  },
  {
    stage: 4,
    name: 'Partial Adoption',
    description: 'They implement for one use case',
    indicator: 'Production traffic from single system',
  },
  {
    stage: 5,
    name: 'Full Adoption',
    description: 'They migrate to our structure',
    indicator: 'All systems use our format',
  },
  {
    stage: 6,
    name: 'Advocacy',
    description: 'They recommend to others',
    indicator: 'Public endorsement, documentation',
  },
];

/**
 * WHO ASKS THE QUESTION
 */
export const WHO_ASKS = {
  // Types of builders
  builders: [
    'New index creators',
    'Local statistics platforms',
    'Industry-specific AI systems',
    'Government data portals',
    'Academic research platforms',
    'Journalism fact-check systems',
    'Corporate intelligence tools',
  ],
  
  // What they're really asking
  real_question: 'What is the obvious way to do this?',
  
  // Why they ask
  why: 'Building from scratch is expensive and risky',
  
  // What they want
  what_they_want: 'A proven pattern to follow',
} as const;

/**
 * Calculate reference status for a domain
 */
export function calculateReferenceStatus(
  adoptionCount: number,
  competitorCount: number,
  mentionCount: number
): ReferenceStatus {
  if (adoptionCount > 1000 && competitorCount === 0) return 'canonical';
  if (adoptionCount > 100 && mentionCount > adoptionCount) return 'de_facto';
  if (adoptionCount > 10) return 'recommended';
  if (adoptionCount > 0) return 'alternative';
  return 'unknown';
}

/**
 * THE REFERENCE EFFECT
 */
export const REFERENCE_EFFECT = {
  trigger: 'When someone asks "How should we structure this?"',
  response: 'They find us first, find us clearest, find us proven',
  result: 'They copy us without asking permission',
  outcome: 'We become the reference, whether declared or not',
} as const;
