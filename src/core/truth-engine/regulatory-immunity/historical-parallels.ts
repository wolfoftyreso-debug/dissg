/**
 * HISTORICAL PARALLELS
 * 
 * STEG 28: IMPORTANT INSIGHT
 * 
 * Think about:
 * - Lexicons
 * - Cartographic standards
 * - Scientific indices
 * - Units of measure (before SI regulation)
 * 
 * Those that described the world without steering it
 * survived the longest.
 */

/**
 * SUCCESSFUL HISTORICAL PARALLELS
 */
export const SUCCESSFUL_PARALLELS = {
  lexicons: {
    example: 'Major dictionaries',
    what_they_did: 'Described language without prescribing it',
    why_they_survived: 'Useful without being mandatory',
    lesson: 'Describe, do not prescribe',
  },
  
  cartographic_standards: {
    example: 'Mercator projection, coordinate systems',
    what_they_did: 'Provided common reference without controlling territory',
    why_they_survived: 'Essential for navigation but did not navigate',
    lesson: 'Enable without operating',
  },
  
  scientific_indices: {
    example: 'Periodic table, taxonomic systems',
    what_they_did: 'Organized knowledge without claiming to create it',
    why_they_survived: 'Structured what was discovered by others',
    lesson: 'Structure, do not create',
  },
  
  units_of_measure_early: {
    example: 'Pre-SI measurement systems that gained adoption',
    what_they_did: 'Provided common reference through quality',
    why_they_survived: 'Before regulation, adoption was voluntary and quality-based',
    lesson: 'Quality creates adoption, not mandate',
  },
  
  academic_consensus: {
    example: 'Peer review, scientific method',
    what_they_did: 'Established standards through practice, not law',
    why_they_survived: 'Self-enforcing through community adoption',
    lesson: 'Let quality enforce itself',
  },
} as const;

/**
 * FAILED HISTORICAL PARALLELS
 */
export const FAILED_PARALLELS = {
  state_statistics: {
    example: 'Official government statistics bureaus',
    what_happened: 'Became politicized over time',
    why_they_failed: 'Could not maintain independence from political pressure',
    lesson: 'Stay outside government',
  },
  
  rating_agencies: {
    example: 'Credit rating agencies',
    what_happened: 'Became captured by those they rated',
    why_they_failed: 'Business model created conflicts of interest',
    lesson: 'Never let customers influence ratings',
  },
  
  standardization_bodies: {
    example: 'Some ISO standards',
    what_happened: 'Became captured by industry incumbents',
    why_they_failed: 'Voting membership allowed influence purchase',
    lesson: 'Never allow voting on truth',
  },
  
  news_agencies: {
    example: 'Major wire services over time',
    what_happened: 'Became perceived as biased',
    why_they_failed: 'Mixed observation with interpretation',
    lesson: 'Never interpret, only observe',
  },
} as const;

/**
 * THE TRADITION YOU BELONG TO
 */
export const YOUR_TRADITION = {
  statement: 'You are in the tradition of those who described the world without steering it',
  
  characteristics: [
    'Observed without judging',
    'Structured without creating',
    'Referenced without deciding',
    'Existed for consultation, not action',
  ],
  
  examples: [
    'The great libraries of antiquity',
    'Early encyclopedias',
    'Natural history collections',
    'Astronomical observations',
    'Geological surveys',
  ],
  
  what_they_had_in_common: 'They made knowledge accessible without claiming authority over it',
} as const;

/**
 * LONGEVITY PATTERN
 */
export const LONGEVITY_PATTERN = {
  short_lived: {
    characteristics: [
      'Claimed authority',
      'Sought official status',
      'Tried to mandate use',
      'Mixed description with prescription',
    ],
    typical_lifespan: 'Decades, then captured or abandoned',
  },
  
  long_lived: {
    characteristics: [
      'Earned authority through quality',
      'Avoided official entanglement',
      'Let use be voluntary',
      'Strictly descriptive',
    ],
    typical_lifespan: 'Centuries, sometimes millennia',
  },
  
  implication: 'To last, stay optional and descriptive',
} as const;

/**
 * WHAT HISTORY TEACHES
 */
export const HISTORY_LESSONS = {
  lesson_1: {
    observation: 'Mandatory systems eventually corrupt',
    application: 'Stay optional',
  },
  
  lesson_2: {
    observation: 'Official systems eventually politicize',
    application: 'Stay unofficial',
  },
  
  lesson_3: {
    observation: 'Advisory systems eventually compromise',
    application: 'Never advise',
  },
  
  lesson_4: {
    observation: 'Quality systems eventually trusted',
    application: 'Focus only on quality',
  },
  
  lesson_5: {
    observation: 'Transparent systems eventually verified',
    application: 'Hide nothing',
  },
} as const;
