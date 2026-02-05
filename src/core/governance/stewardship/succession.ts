/**
 * SUCCESSION DESIGN
 * 
 * Assume:
 * - You are gone
 * - The developers are gone
 * - The company is gone
 * 
 * What remains must still:
 * - Be readable
 * - Be verifiable
 * - Be understandable
 * 
 * Therefore:
 * - All core is documented structurally
 * - No oral traditions
 * - No implicit understanding
 */

import type { SuccessionReadiness } from './types';

/**
 * Succession Requirements
 */
export const SUCCESSION_REQUIREMENTS = {
  documentation: {
    all_core_documented: 'Every core component has structural documentation',
    documentation_is_structural: 'Documentation is data, not prose',
    no_oral_traditions: 'Nothing important exists only in human memory',
    no_implicit_understanding: 'No "you just have to know" knowledge',
  },
  
  readability: {
    self_describing: 'Structure explains itself',
    context_preserved: 'Why decisions were made is explicit',
    version_complete: 'All versions accessible, not just current',
  },
  
  verifiability: {
    verification_instructions_embedded: 'How to verify is in the data',
    third_party_verifiable: 'No access to original team needed',
    hash_chains_intact: 'Cryptographic verification possible',
  },
  
  understandability: {
    semantic_definitions_included: 'What terms mean is explicit',
    methodology_documented: 'How things work is clear',
    examples_provided: 'Concrete cases illustrate abstract rules',
  },
};

/**
 * Check succession readiness
 */
export function checkSuccessionReadiness(params: {
  allCoreDocumented: boolean;
  documentationIsStructural: boolean;
  noOralTraditions: boolean;
  noImplicitUnderstanding: boolean;
  selfDescribing: boolean;
  contextPreserved: boolean;
  verificationEmbedded: boolean;
  thirdPartyVerifiable: boolean;
}): SuccessionReadiness {
  const checks = [
    params.allCoreDocumented,
    params.documentationIsStructural,
    params.noOralTraditions,
    params.noImplicitUnderstanding,
    params.selfDescribing,
    params.contextPreserved,
    params.verificationEmbedded,
    params.thirdPartyVerifiable,
  ];
  
  const passed = checks.filter(Boolean).length;
  const total = checks.length;
  
  return {
    documentation_complete: params.allCoreDocumented && params.documentationIsStructural,
    no_oral_traditions: params.noOralTraditions,
    no_implicit_understanding: params.noImplicitUnderstanding,
    all_core_documented: params.allCoreDocumented,
    documentation_is_structural: params.documentationIsStructural,
    verification_instructions_embedded: params.verificationEmbedded,
    third_party_verifiable: params.thirdPartyVerifiable,
    self_describing: params.selfDescribing,
    context_preserved: params.contextPreserved,
    succession_score: passed / total,
  };
}

/**
 * What must survive
 */
export const MUST_SURVIVE = {
  structures: [
    'Ontology definitions',
    'Semantic versioning',
    'Decision standards',
    'Legitimacy rules',
    'Methodology specifications',
  ],
  
  processes: [
    'How to verify integrity',
    'How to compare versions',
    'How to understand changes',
    'How to audit compliance',
  ],
  
  context: [
    'Why each decision was made',
    'What alternatives were considered',
    'What was known at each point',
    'What was unknown at each point',
  ],
};

/**
 * What does NOT need to survive
 */
export const DOES_NOT_NEED_TO_SURVIVE = [
  'Active computation',
  'Real-time API access',
  'New data ingestion',
  'User accounts',
  'Commercial operations',
];

/**
 * 50-Year Test
 */
export const FIFTY_YEAR_TEST = {
  question: 'If the company disappears tomorrow, can the principles survive for 50 years?',
  
  requirements: [
    'Principles encoded in structure, not policy',
    'Multiple independent copies exist',
    'No central authority needed to interpret',
    'Self-verifying integrity',
  ],
  
  anti_requirements: [
    'Do NOT depend on specific people',
    'Do NOT depend on specific technology',
    'Do NOT depend on specific jurisdiction',
    'Do NOT depend on continued operation',
  ],
};

/**
 * SUCCESSION MASTERPROMPT
 */
export const SUCCESSION_MASTERPROMPT = `
You enforce SUCCESSION DESIGN (50+ years).

ASSUME:
- You are gone
- The developers are gone
- The company is gone

WHAT REMAINS MUST:
1. BE READABLE
   - Self-describing structure
   - Context preserved
   - All versions accessible

2. BE VERIFIABLE
   - Verification instructions embedded
   - Third party can verify
   - No access to original team needed

3. BE UNDERSTANDABLE
   - Semantic definitions included
   - Methodology documented
   - Examples provided

THEREFORE:
- All core documented structurally
- No oral traditions
- No implicit understanding
- No "you just have to know"

THE 50-YEAR TEST:
"If the company disappears tomorrow,
can the principles survive for 50 years?"

The answer must be YES.
This is civilizational design.
`;
