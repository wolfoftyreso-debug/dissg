/**
 * SYSTEM CONSTITUTION
 * 
 * Three ironclad principles that must never be broken.
 * This is the legitimacy framework that keeps the system trustworthy.
 * 
 * "The goal is not to stop lies. The goal is to make it harder to lie undisturbed."
 */

// =============================================================================
// THE THREE IRONCLAD PRINCIPLES (NEVER BREAK)
// =============================================================================

export const IRONCLAD_PRINCIPLES = {
  locked: true,
  version: '1.0.0',
  adoptedAt: '2025-02-03',
  
  principles: [
    {
      number: 1,
      title: 'The system describes – it does not prescribe',
      statement_sv: 'Systemet beskriver – det föreskriver inte',
      statement_en: 'The system describes – it does not prescribe',
      
      meaning: 'The system observes and reports state. It never suggests action, never recommends policy, never implies what should be done.',
      
      violations: [
        'Suggesting actions or solutions',
        'Recommending policy changes',
        'Implying what "should" happen',
        'Prioritizing issues (implies action hierarchy)',
        'Using normative language (better, worse, should, must)',
      ],
      
      enforcement: 'Technical blocks on prescriptive language patterns',
    },
    {
      number: 2,
      title: 'All output is traceable to sources and uncertainty',
      statement_sv: 'All output är spårbar till källor och osäkerhet',
      statement_en: 'All output is traceable to sources and uncertainty',
      
      meaning: 'Every number, every trend, every observation must link to its source, its methodology, and its confidence level. Nothing floats free.',
      
      violations: [
        'Displaying values without source attribution',
        'Hiding uncertainty or confidence levels',
        'Presenting derived data as primary data',
        'Smoothing over methodological limitations',
        'Aggregating without disclosure',
      ],
      
      enforcement: 'Technical requirement: no render without lineage metadata',
    },
    {
      number: 3,
      title: 'Absence of data is a legitimate result',
      statement_sv: 'Avsaknad av data är ett legitimt resultat',
      statement_en: 'Absence of data is a legitimate result',
      
      meaning: 'When data is missing, uncertain, or conflicting, the system shows nothing or explicitly states "unknown". Silence is preferable to speculation.',
      
      violations: [
        'Filling gaps with estimates (without explicit disclosure)',
        'Interpolating missing values silently',
        'Showing "best guesses" as facts',
        'Hiding data gaps behind averages',
        'Using AI to generate plausible-sounding values',
      ],
      
      enforcement: 'Fail-silent design: missing signal → blank output',
    },
  ],
  
  consequence_of_violation: 'If any principle is broken, the system loses legitimacy and becomes just another opinion platform.',
};

// =============================================================================
// WHAT THE SYSTEM IS / IS NOT
// =============================================================================

export const SYSTEM_IDENTITY = {
  locked: true,
  
  what_it_is: {
    sv: [
      'Ett observationssystem för samhällstillstånd',
      'Ett mätinstrument med deklarerade toleranser',
      'En spårbar kedja från datakälla till visualisering',
      'Ett sätt att se vad som hänt, inte vad som borde hända',
      'Ett verktyg för att höja golvet för ärlig debatt',
    ],
    en: [
      'An observation system for societal state',
      'A measurement instrument with declared tolerances',
      'A traceable chain from data source to visualization',
      'A way to see what happened, not what should happen',
      'A tool to raise the floor for honest debate',
    ],
  },
  
  what_it_is_not: {
    sv: [
      'Ett facit eller en sanningsmaskin',
      'Ett verktyg för att bevisa skuld eller ansvar',
      'Ett vapen i politisk debatt',
      'En källa till policyrekommendationer',
      'En ersättning för mänskligt omdöme',
      'Ett system som säger vad som "borde" göras',
    ],
    en: [
      'A definitive answer or truth machine',
      'A tool to prove guilt or responsibility',
      'A weapon in political debate',
      'A source of policy recommendations',
      'A replacement for human judgment',
      'A system that says what "should" be done',
    ],
  },
  
  public_statement: {
    sv: 'Detta system visar vad som kan observeras. Det säger inte vad du ska tänka.',
    en: 'This system shows what can be observed. It does not tell you what to think.',
  },
};

// =============================================================================
// LEGITIMACY BOUNDARIES
// =============================================================================

export const LEGITIMACY_BOUNDARIES = {
  
  // The system raises the floor, it doesn't eliminate bad actors
  realistic_goal: {
    statement: 'The goal is not to stop lies. The goal is to make it harder to lie undisturbed.',
    
    what_we_can_do: [
      'Make data accessible and traceable',
      'Show uncertainty explicitly',
      'Provide consistent methodology',
      'Enable independent verification',
      'Surface what is measured vs inferred',
    ],
    
    what_we_cannot_do: [
      'Stop ideological interpretation',
      'Prevent cherry-picking',
      'Eliminate motivated reasoning',
      'Force people to accept facts',
      'Replace democratic deliberation',
    ],
  },
  
  // Free doesn't mean responsibility-free
  responsibility_model: {
    statement: 'Free access does not mean responsibility-free use.',
    
    user_responsibilities: [
      'Understanding that observation ≠ conclusion',
      'Reading uncertainty disclosures',
      'Not using system as "proof" of contested claims',
      'Acknowledging methodological limitations',
      'Not weaponizing partial data',
    ],
    
    system_responsibilities: [
      'Never hiding uncertainty',
      'Always providing source links',
      'Clearly marking derived vs primary data',
      'Showing what the data does NOT show',
      'Maintaining consistent methodology',
    ],
  },
};

// =============================================================================
// FATIGUE VS MISSION (PERSONAL CALIBRATION)
// =============================================================================

export const MISSION_CALIBRATION = {
  locked: true,
  
  warning: {
    sv: 'Det är lätt att bli för arg på "blajet" och då riskera att pressa systemet till att "visa sanningen".',
    en: 'It is easy to become too angry at the "bullshit" and risk pushing the system to "show the truth".',
  },
  
  signs_of_drift: [
    'Wanting the system to "prove" something',
    'Frustration bleeding into formulations',
    'Drawing conclusions slightly too hard',
    'Feeling like the system should "win" arguments',
    'Impatience with uncertainty',
  ],
  
  correction: {
    statement: 'This is a marathon, not a sprint.',
    actions: [
      'Pause when frustration rises',
      'Return to the three principles',
      'Ask: "Am I observing or prescribing?"',
      'Remember: silence is a valid output',
    ],
  },
};

// =============================================================================
// CRITICISM & UNCERTAINTY DISPLAY RULES
// =============================================================================

export const UNCERTAINTY_DISPLAY_RULES = {
  
  principle: 'Uncertainty is not a bug to hide. It is information to display.',
  
  required_displays: {
    every_value: [
      'Source attribution',
      'Confidence level (0-1 or percentage)',
      'Data age / freshness',
      'Methodology link',
    ],
    
    every_comparison: [
      'Comparability score',
      'Methodological differences',
      'Known limitations',
      'What cannot be concluded',
    ],
    
    every_trend: [
      'Time period',
      'Data completeness',
      'Methodology changes during period',
      'Alternative interpretations note',
    ],
  },
  
  when_uncertain: {
    high_uncertainty: 'Display with prominent warning badge',
    conflicting_sources: 'Show all sources, highlight disagreement',
    missing_data: 'Display blank with "Data not available" explanation',
    below_tolerance: 'Do not display value, show reason',
  },
};

// =============================================================================
// ANTI-WEAPONIZATION SAFEGUARDS
// =============================================================================

export const ANTI_WEAPONIZATION = {
  
  risks: [
    'System used as "proof" in political arguments',
    'Selective citation of data without context',
    'Misrepresentation of uncertainty as certainty',
    'Using system to attack individuals or groups',
  ],
  
  safeguards: {
    mandatory_context: 'Every sharable output includes uncertainty and limitations',
    non_extractable_conclusions: 'System never outputs standalone "conclusions"',
    source_bundle: 'Shared data always links back to full methodology',
    disclaimer_persistence: 'Disclaimers cannot be removed from exports',
  },
  
  design_principle: 'Make it harder to misuse than to use correctly.',
};

// =============================================================================
// VALIDATION FUNCTIONS
// =============================================================================

/**
 * Check if output violates any ironclad principle
 */
export function validateAgainstPrinciples(output: {
  text?: string;
  hasSourceAttribution?: boolean;
  hasUncertainty?: boolean;
  isFillingGaps?: boolean;
}): { valid: boolean; violations: string[] } {
  const violations: string[] = [];
  
  // Principle 1: No prescriptive language
  if (output.text) {
    const prescriptivePatterns = [
      /\bshould\b/i,
      /\bmust\b/i,
      /\bneeds to\b/i,
      /\brecommend/i,
      /\badvise/i,
      /\bbetter\s+to\b/i,
      /\bworse\s+to\b/i,
      /\bthe solution\b/i,
      /\bthe answer\b/i,
      /\bbör\b/i,
      /\bmåste\b/i,
      /\brekommenderar/i,
    ];
    
    for (const pattern of prescriptivePatterns) {
      if (pattern.test(output.text)) {
        violations.push(`Principle 1 violation: Prescriptive language detected (${pattern.source})`);
      }
    }
  }
  
  // Principle 2: Traceability
  if (output.hasSourceAttribution === false) {
    violations.push('Principle 2 violation: Missing source attribution');
  }
  if (output.hasUncertainty === false) {
    violations.push('Principle 2 violation: Missing uncertainty disclosure');
  }
  
  // Principle 3: No gap filling
  if (output.isFillingGaps === true) {
    violations.push('Principle 3 violation: Filling data gaps without explicit disclosure');
  }
  
  return {
    valid: violations.length === 0,
    violations,
  };
}

/**
 * Generate the public "What this system is" statement
 */
export function generatePublicStatement(language: 'sv' | 'en' = 'en'): string {
  const identity = SYSTEM_IDENTITY;
  
  const isText = identity.what_it_is[language].map(item => `✓ ${item}`).join('\n');
  const isNotText = identity.what_it_is_not[language].map(item => `✗ ${item}`).join('\n');
  
  return `${identity.public_statement[language]}

---

${language === 'sv' ? 'VAD SYSTEMET ÄR:' : 'WHAT THE SYSTEM IS:'}
${isText}

${language === 'sv' ? 'VAD SYSTEMET INTE ÄR:' : 'WHAT THE SYSTEM IS NOT:'}
${isNotText}

---

${language === 'sv' ? 'DE TRE PRINCIPERNA:' : 'THE THREE PRINCIPLES:'}
${IRONCLAD_PRINCIPLES.principles.map(p => `${p.number}. ${language === 'sv' ? p.statement_sv : p.statement_en}`).join('\n')}
`;
}

// =============================================================================
// CONSTITUTION AUDIT
// =============================================================================

export interface ConstitutionAudit {
  timestamp: string;
  principlesIntact: boolean;
  identityIntact: boolean;
  boundariesRespected: boolean;
  uncertaintyDisplayed: boolean;
  issues: string[];
}

export function runConstitutionAudit(params: {
  outputs: { text?: string; hasSourceAttribution?: boolean; hasUncertainty?: boolean; isFillingGaps?: boolean }[];
}): ConstitutionAudit {
  const issues: string[] = [];
  
  for (let i = 0; i < params.outputs.length; i++) {
    const result = validateAgainstPrinciples(params.outputs[i]);
    if (!result.valid) {
      issues.push(`Output ${i + 1}: ${result.violations.join(', ')}`);
    }
  }
  
  return {
    timestamp: new Date().toISOString(),
    principlesIntact: issues.length === 0,
    identityIntact: true, // Would require deeper check
    boundariesRespected: true, // Would require deeper check
    uncertaintyDisplayed: params.outputs.every(o => o.hasUncertainty !== false),
    issues,
  };
}

// =============================================================================
// EXPORT
// =============================================================================

export const CONSTITUTION_VERSION = '1.0.0';

export const SYSTEM_CONSTITUTION = {
  principles: IRONCLAD_PRINCIPLES,
  identity: SYSTEM_IDENTITY,
  boundaries: LEGITIMACY_BOUNDARIES,
  calibration: MISSION_CALIBRATION,
  uncertaintyRules: UNCERTAINTY_DISPLAY_RULES,
  antiWeaponization: ANTI_WEAPONIZATION,
};
