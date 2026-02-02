/**
 * 🔐 FINAL LOCK — IMMUTABLE PRINCIPLES
 * 
 * THE NON-NEGOTIABLE CORE
 * 
 * These are not features. This is constitution.
 * These principles can NEVER be changed regardless of:
 * - Ownership changes
 * - Financial pressure
 * - Political pressure
 * - Time
 * 
 * Written into: system prompt, governance docs, public charter, legal text, AI guardrails
 */

// ============================================================
// I. IMMUTABLE PRINCIPLES (CAN NEVER BE CHANGED)
// ============================================================

export interface ImmutablePrinciple {
  number: number;
  code: string;
  title: { en: string; sv: string };
  principle: { en: string; sv: string };
  enforcementNote: { en: string; sv: string };
  violationResponse: 'block' | 'warn' | 'freeze';
}

export const IMMUTABLE_PRINCIPLES: ImmutablePrinciple[] = [
  {
    number: 1,
    code: 'OBSERVATION_FIRST',
    title: {
      en: 'Observation before interpretation',
      sv: 'Observation före tolkning',
    },
    principle: {
      en: 'The system may only show what can be observed in data. All interpretation happens outside the system.',
      sv: 'Systemet får endast visa vad som kan observeras i data. All tolkning sker utanför systemet.',
    },
    enforcementNote: {
      en: 'No feature, no payment tier, no partner may break this.',
      sv: 'Ingen feature, ingen betalnivå, ingen partner får bryta detta.',
    },
    violationResponse: 'block',
  },
  {
    number: 2,
    code: 'NO_CENTRAL_TRUTH',
    title: {
      en: 'No central truth',
      sv: 'Ingen central sanning',
    },
    principle: {
      en: 'The system provides no "conclusion", no grade, no answer key. Only: multiple indicators, multiple perspectives, clear limitations.',
      sv: 'Systemet tillhandahåller ingen "slutsats", inget betyg, inget facit. Endast: flera indikatorer, flera perspektiv, tydliga begränsningar.',
    },
    enforcementNote: {
      en: 'Any single-score index must include alternatives and context.',
      sv: 'Varje enstaka index måste inkludera alternativ och kontext.',
    },
    violationResponse: 'block',
  },
  {
    number: 3,
    code: 'SAME_METHOD_FOR_ALL',
    title: {
      en: 'Same method for all',
      sv: 'Samma metod för alla',
    },
    principle: {
      en: 'All actors, countries, ideologies, and organizations are treated identically. No exceptions. No "special views". No hidden filters.',
      sv: 'Alla aktörer, länder, ideologier och organisationer behandlas identiskt. Inga undantag. Inga "special views". Inga hemliga filter.',
    },
    enforcementNote: {
      en: 'Methodology must be identical regardless of subject.',
      sv: 'Metoden måste vara identisk oavsett subjekt.',
    },
    violationResponse: 'block',
  },
  {
    number: 4,
    code: 'UNCERTAINTY_TRANSPARENCY',
    title: {
      en: 'Transparency about uncertainty',
      sv: 'Transparens om osäkerhet',
    },
    principle: {
      en: 'Uncertainty must always be shown where it exists. Hiding uncertainty is a system failure.',
      sv: 'Osäkerhet ska alltid visas där den finns. Att dölja osäkerhet är ett systemfel.',
    },
    enforcementNote: {
      en: 'Every data point must include confidence indicators.',
      sv: 'Varje datapunkt måste inkludera konfidensindikatorer.',
    },
    violationResponse: 'warn',
  },
  {
    number: 5,
    code: 'NO_NORMATIVE_LANGUAGE',
    title: {
      en: 'No normative language',
      sv: 'Inget normativt språk',
    },
    principle: {
      en: 'The system may not use language that implies value, blame, responsibility, or direction. This applies to: text, labels, colors, icons, animations.',
      sv: 'Systemet får inte använda språk som antyder värde, skuld, ansvar eller riktning. Detta gäller: text, etiketter, färger, ikoner, animationer.',
    },
    enforcementNote: {
      en: 'Automated language validation required on all outputs.',
      sv: 'Automatiserad språkvalidering krävs på alla outputs.',
    },
    violationResponse: 'block',
  },
  {
    number: 6,
    code: 'SOURCES_OVER_RESULTS',
    title: {
      en: 'Sources over results',
      sv: 'Källor över resultat',
    },
    principle: {
      en: 'If sources are removed, the result is removed. The system would rather show nothing than something that cannot be verified.',
      sv: 'Om källor tas bort, faller resultatet bort. Systemet visar hellre ingenting än något som inte kan verifieras.',
    },
    enforcementNote: {
      en: 'No orphaned data points allowed.',
      sv: 'Inga föräldralösa datapunkter tillåtna.',
    },
    violationResponse: 'block',
  },
  {
    number: 7,
    code: 'REPRODUCIBILITY_STANDARD',
    title: {
      en: 'Reproducibility as standard',
      sv: 'Reproducerbarhet som standard',
    },
    principle: {
      en: 'Everything shown must be reproducible by an external party. Otherwise it is not shown.',
      sv: 'Allt som visas ska kunna återskapas av en extern part. Annars visas det inte.',
    },
    enforcementNote: {
      en: 'Every output must include method documentation.',
      sv: 'Varje output måste inkludera metoddokumentation.',
    },
    violationResponse: 'warn',
  },
  {
    number: 8,
    code: 'NEGATIVE_SPACE_MANDATORY',
    title: {
      en: 'Negative space is mandatory',
      sv: 'Negativt utrymme är obligatoriskt',
    },
    principle: {
      en: 'The system must always show what it cannot say. Absence of data = explicit marking.',
      sv: 'Systemet ska alltid visa vad det inte kan säga. Frånvaro av data = explicit markering.',
    },
    enforcementNote: {
      en: 'Every view must include "What this does not show" section.',
      sv: 'Varje vy måste inkludera "Vad detta inte visar"-sektion.',
    },
    violationResponse: 'warn',
  },
  {
    number: 9,
    code: 'OWNERSHIP_NEUTRALITY',
    title: {
      en: 'Ownership neutrality',
      sv: 'Ägarskapsneutralitet',
    },
    principle: {
      en: 'The system\'s core principles apply regardless of who owns, operates, or finances it. No owner may change: method, language rules, neutrality.',
      sv: 'Systemets kärnprinciper gäller oavsett vem som äger, driver eller finansierar det. Ingen ägare får ändra: metod, språkregler, neutralitet.',
    },
    enforcementNote: {
      en: 'Principles are enforced by code, not policy.',
      sv: 'Principer upprätthålls av kod, inte policy.',
    },
    violationResponse: 'freeze',
  },
  {
    number: 10,
    code: 'EXIT_SAFE',
    title: {
      en: 'Exit-safe',
      sv: 'Exit-safe',
    },
    principle: {
      en: 'If the system can no longer follow these principles, it must: show warning, freeze interpretive functions, go into "read-only reference mode". Rather silent than wrong.',
      sv: 'Om systemet inte längre kan följa dessa principer ska det: visa varning, frysa tolkande funktioner, gå i "read-only reference mode". Hellre tyst än fel.',
    },
    enforcementNote: {
      en: 'Automatic degradation to safe mode on principle violation.',
      sv: 'Automatisk nedgradering till säkert läge vid principbrott.',
    },
    violationResponse: 'freeze',
  },
];

// ============================================================
// II. PUBLIC COVENANT
// ============================================================

export const PUBLIC_COVENANT = {
  shortVersion: {
    en: 'This platform exists to make public data visible, comparable and understandable. It does not advocate, recommend, judge or decide. It provides a shared factual baseline so that disagreement can happen without distortion.',
    sv: 'Denna plattform finns för att göra offentlig data synlig, jämförbar och begriplig. Den förespråkar inte, rekommenderar inte, dömer inte eller beslutar inte. Den tillhandahåller en gemensam faktabas så att oenighet kan ske utan förvrängning.',
  },
  properties: ['Short', 'Rock-solid', 'Unassailable'],
  visibility: 'Always publicly accessible',
};

// ============================================================
// III. AI GUARDRAILS
// ============================================================

export const AI_GUARDRAILS = {
  requirements: [
    'Respond in templates',
    'Use permitted verbs only',
    'Always show alternatives',
    'Always show uncertainty',
    'Always show limitations',
  ],
  
  triggerConditions: [
    { trigger: 'starts interpreting', action: 'block' },
    { trigger: 'starts evaluating', action: 'block' },
    { trigger: 'starts suggesting', action: 'block' },
    { trigger: 'uses forbidden language', action: 'block' },
    { trigger: 'omits uncertainty', action: 'warn' },
    { trigger: 'omits limitations', action: 'warn' },
  ],

  blockResponse: {
    en: 'This question requires interpretation beyond observable data.',
    sv: 'Denna fråga kräver tolkning utöver observerbar data.',
  },

  permittedVerbs: [
    'observed', 'measured', 'recorded', 'calculated', 'compared',
    'coincided', 'varied', 'remained', 'changed', 'fluctuated',
    'increased', 'decreased', 'stabilized', 'deviated',
  ],

  forbiddenPatterns: [
    // Causal language
    /\b(caused?|causes?|causing)\b/i,
    /\b(led to|leads to|leading to)\b/i,
    /\b(because of|due to|owing to)\b/i,
    /\b(result(ed|s|ing)? (in|from))\b/i,
    /\b(therefore|thus|hence|consequently)\b/i,
    
    // Normative language
    /\b(should|must|ought to|need to)\b/i,
    /\b(better|worse|best|worst)\b/i,
    /\b(good|bad|right|wrong)\b/i,
    /\b(success(ful)?|fail(ed|ure)?)\b/i,
    /\b(progress|regress)\b/i,
    
    // Recommendation language
    /\b(recommend|suggest|advise|propose)\b/i,
    /\b(we (should|must|need))\b/i,
    /\b(it is (important|necessary|essential))\b/i,
    
    // Blame/responsibility
    /\b(responsible|blame|fault|guilty)\b/i,
    /\b(accountable|liable)\b/i,
    
    // Certainty overreach
    /\b(proves?|proving|proven)\b/i,
    /\b(demonstrates? that)\b/i,
    /\b(clearly shows)\b/i,
    /\b(undoubtedly|certainly|definitely)\b/i,
  ],
};

// ============================================================
// IV. PRACTICAL IMPACT
// ============================================================

export const PRACTICAL_IMPACT = {
  effects: [
    'Political rhetoric loses effect',
    'Debates become shorter',
    'Journalism becomes clearer',
    'AI starts referencing the platform',
    '"Experts" must show method',
  ],
  note: 'Without saying a word.',
};

// ============================================================
// V. FINAL POSITION
// ============================================================

export const FINAL_POSITION = {
  thesis: {
    en: 'If you have clean hands, this is protection. If you do not – it is still just light.',
    sv: 'Om du har gott mjöl i påsen är detta ett skydd. Om du inte har det – då är det fortfarande bara ljus.',
  },
  stance: {
    en: 'We judge no one. We illuminate the room.',
    sv: 'Vi dömer ingen. Vi lyser upp rummet.',
  },
};

// ============================================================
// VI. COMPLETION CRITERIA
// ============================================================

export const COMPLETION_CRITERIA = [
  {
    criterion: 'The system can remain standing even if you leave it',
    achieved: false,
  },
  {
    criterion: 'No one can use it for propaganda',
    achieved: false,
  },
  {
    criterion: 'No one can shut it down without it being noticed',
    achieved: false,
  },
  {
    criterion: 'No one needs to trust you – just the method',
    achieved: false,
  },
];

// ============================================================
// VALIDATION FUNCTIONS
// ============================================================

export function validateAgainstPrinciples(
  content: string,
  context: { hasUncertainty?: boolean; hasLimitations?: boolean; hasAlternatives?: boolean }
): {
  valid: boolean;
  violations: Array<{ principle: ImmutablePrinciple; reason: string }>;
  response: 'allow' | 'warn' | 'block' | 'freeze';
} {
  const violations: Array<{ principle: ImmutablePrinciple; reason: string }> = [];

  // Check forbidden patterns (Principle 5: No normative language)
  for (const pattern of AI_GUARDRAILS.forbiddenPatterns) {
    if (pattern.test(content)) {
      violations.push({
        principle: IMMUTABLE_PRINCIPLES[4], // NO_NORMATIVE_LANGUAGE
        reason: `Contains forbidden pattern: ${pattern.source}`,
      });
    }
  }

  // Check uncertainty transparency (Principle 4)
  if (context.hasUncertainty === false) {
    violations.push({
      principle: IMMUTABLE_PRINCIPLES[3], // UNCERTAINTY_TRANSPARENCY
      reason: 'Missing uncertainty indicators',
    });
  }

  // Check negative space (Principle 8)
  if (context.hasLimitations === false) {
    violations.push({
      principle: IMMUTABLE_PRINCIPLES[7], // NEGATIVE_SPACE_MANDATORY
      reason: 'Missing limitations disclosure',
    });
  }

  // Check for central truth claims (Principle 2)
  const centralTruthPatterns = [
    /\bthe truth is\b/i,
    /\bthe answer is\b/i,
    /\bthe conclusion is\b/i,
    /\bthis proves\b/i,
    /\bdefinitively shows\b/i,
  ];
  for (const pattern of centralTruthPatterns) {
    if (pattern.test(content)) {
      violations.push({
        principle: IMMUTABLE_PRINCIPLES[1], // NO_CENTRAL_TRUTH
        reason: `Contains central truth claim: ${pattern.source}`,
      });
    }
  }

  // Determine response based on worst violation
  // Priority: freeze > block > warn > allow
  const hasFreeze = violations.some(v => v.principle.violationResponse === 'freeze');
  const hasBlock = violations.some(v => v.principle.violationResponse === 'block');
  const hasWarn = violations.some(v => v.principle.violationResponse === 'warn');
  
  let response: 'allow' | 'warn' | 'block' | 'freeze' = 'allow';
  if (hasFreeze) {
    response = 'freeze';
  } else if (hasBlock) {
    response = 'block';
  } else if (hasWarn) {
    response = 'warn';
  }

  return {
    valid: violations.length === 0,
    violations,
    response,
  };
}

export function getBlockedResponse(language: 'en' | 'sv' = 'en'): string {
  return AI_GUARDRAILS.blockResponse[language];
}

export function generatePrinciplesManifest(): string {
  return IMMUTABLE_PRINCIPLES
    .map(p => `${p.number}. ${p.title.en}\n   ${p.principle.en}`)
    .join('\n\n');
}
