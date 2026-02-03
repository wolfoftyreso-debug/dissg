/**
 * EXPLANATION ENGINE
 * 
 * "Så att en 18-åring förstår – utan att förenkla bort sanningen"
 * 
 * Fundamental Law:
 * If a normal 18-year-old doesn't understand it
 * → the system is broken, not the user.
 * 
 * Three simultaneous understanding levels:
 * 1. "What do I see?" (immediate)
 * 2. "Why does it look like this?" (one click)
 * 3. "How do we know this?" (deep dive)
 */

// =============================================================================
// TYPES
// =============================================================================

export interface ExplanationLevel {
  level: 1 | 2 | 3;
  title: { sv: string; en: string };
  content: { sv: string; en: string };
}

export interface NumberContext {
  /** The number itself */
  value: number;
  
  /** Unit of measurement */
  unit: string;
  
  /** REQUIRED: Compared to what? */
  compared_to: {
    reference_value: number;
    reference_label: { sv: string; en: string };
    reference_period?: string;
  };
  
  /** REQUIRED: Over what time period? */
  time_period: {
    start: string;
    end: string;
    granularity: 'day' | 'week' | 'month' | 'quarter' | 'year';
  };
  
  /** REQUIRED: Why does this matter? */
  significance: {
    sv: string;
    en: string;
  };
}

export interface ThisMeansBlock {
  /** Simple, human interpretation */
  statement: { sv: string; en: string };
  
  /** Confidence in this interpretation */
  confidence: 'high' | 'medium' | 'low';
  
  /** What this does NOT mean */
  caveats: Array<{ sv: string; en: string }>;
}

export interface IntuitiveComparison {
  type: 'per_person' | 'per_household' | 'lifetime' | 'daily' | 'work_time' | 'distance' | 'custom';
  value: number;
  unit: { sv: string; en: string };
  explanation: { sv: string; en: string };
}

export interface Assumption {
  id: string;
  label: { sv: string; en: string };
  description: { sv: string; en: string };
  is_active: boolean;
  is_removable: boolean;
  impact_if_changed: { sv: string; en: string };
}

export interface ContextWarning {
  type: 'narrow_zoom' | 'unusual_period' | 'cherry_pick_risk' | 'missing_context' | 'methodology_change';
  message: { sv: string; en: string };
  suggestion: { sv: string; en: string };
  severity: 'info' | 'warning' | 'critical';
}

export interface ExplanationPackage {
  /** The three understanding levels */
  levels: [ExplanationLevel, ExplanationLevel, ExplanationLevel];
  
  /** Number with full context */
  number_context: NumberContext;
  
  /** "This means" block */
  this_means: ThisMeansBlock;
  
  /** Intuitive comparison */
  intuitive: IntuitiveComparison;
  
  /** Visible assumptions */
  assumptions: Assumption[];
  
  /** Context warnings (if any) */
  warnings: ContextWarning[];
  
  /** Is this ready for display? */
  is_valid: boolean;
  
  /** Validation errors */
  validation_errors: string[];
}

// =============================================================================
// FORBIDDEN WORDS - STRICT LANGUAGE DISCIPLINE
// =============================================================================

/**
 * Words that are NEVER allowed in explanations
 * - Academic jargon
 * - Bureaucratic Swedish
 * - Political language
 * - Value-laden words
 */
export const FORBIDDEN_PATTERNS: Array<{
  pattern: RegExp;
  category: 'jargon' | 'bureaucratic' | 'political' | 'value_laden';
  replacement_hint: { sv: string; en: string };
}> = [
  // Academic jargon
  { 
    pattern: /\b(socioekonomisk|strukturell divergens|systemisk)\b/gi,
    category: 'jargon',
    replacement_hint: { sv: 'Använd vardagliga ord', en: 'Use everyday words' }
  },
  { 
    pattern: /\b(paradigm|diskurs|narrativ|problematisera)\b/gi,
    category: 'jargon',
    replacement_hint: { sv: 'Förenkla utan att förlora mening', en: 'Simplify without losing meaning' }
  },
  
  // Bureaucratic
  { 
    pattern: /\b(implementering|verkställande|operationalisera|kartläggning)\b/gi,
    category: 'bureaucratic',
    replacement_hint: { sv: 'Säg vad som faktiskt händer', en: 'Say what actually happens' }
  },
  { 
    pattern: /\b(åtgärdspaket|handlingsplan|insatsområde)\b/gi,
    category: 'bureaucratic',
    replacement_hint: { sv: 'Var konkret', en: 'Be concrete' }
  },
  
  // Political language
  { 
    pattern: /\b(hållbar utveckling|grön omställning|rättvis fördelning)\b/gi,
    category: 'political',
    replacement_hint: { sv: 'Beskriv det mätbara', en: 'Describe what is measurable' }
  },
  { 
    pattern: /\b(nödvändig reform|ambitiös satsning|historiskt)\b/gi,
    category: 'political',
    replacement_hint: { sv: 'Undvik värdering', en: 'Avoid evaluation' }
  },
  
  // Value-laden words
  { 
    pattern: /\b(kris|katastrof|framgång|misslyckande|bra|dålig)\b/gi,
    category: 'value_laden',
    replacement_hint: { sv: 'Beskriv förändring neutralt', en: 'Describe change neutrally' }
  },
  { 
    pattern: /\b(borde|måste|ska|behöver)\b/gi,
    category: 'value_laden',
    replacement_hint: { sv: 'Systemet ger inga råd', en: 'System gives no advice' }
  },
];

// =============================================================================
// VALIDATION
// =============================================================================

/**
 * Validate that text follows language discipline
 */
export function validateLanguage(text: string): {
  is_valid: boolean;
  violations: Array<{
    word: string;
    category: string;
    hint: { sv: string; en: string };
    position: number;
  }>;
} {
  const violations: Array<{
    word: string;
    category: string;
    hint: { sv: string; en: string };
    position: number;
  }> = [];
  
  for (const forbidden of FORBIDDEN_PATTERNS) {
    let match;
    while ((match = forbidden.pattern.exec(text)) !== null) {
      violations.push({
        word: match[0],
        category: forbidden.category,
        hint: forbidden.replacement_hint,
        position: match.index,
      });
    }
  }
  
  return {
    is_valid: violations.length === 0,
    violations,
  };
}

/**
 * Validate that a number has full context
 */
export function validateNumberContext(ctx: Partial<NumberContext>): {
  is_valid: boolean;
  missing: string[];
} {
  const missing: string[] = [];
  
  if (ctx.value === undefined) missing.push('value');
  if (!ctx.unit) missing.push('unit');
  if (!ctx.compared_to?.reference_value) missing.push('compared_to');
  if (!ctx.time_period?.start || !ctx.time_period?.end) missing.push('time_period');
  if (!ctx.significance?.sv || !ctx.significance?.en) missing.push('significance');
  
  return {
    is_valid: missing.length === 0,
    missing,
  };
}

/**
 * Validate complete explanation package
 */
export function validateExplanationPackage(pkg: Partial<ExplanationPackage>): {
  is_valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  // Check all three levels exist
  if (!pkg.levels || pkg.levels.length !== 3) {
    errors.push('All three understanding levels are required');
  } else {
    // Validate language in each level
    pkg.levels.forEach((level, idx) => {
      const svValidation = validateLanguage(level.content.sv);
      const enValidation = validateLanguage(level.content.en);
      
      if (!svValidation.is_valid) {
        errors.push(`Level ${idx + 1} (sv) contains forbidden words: ${svValidation.violations.map(v => v.word).join(', ')}`);
      }
      if (!enValidation.is_valid) {
        errors.push(`Level ${idx + 1} (en) contains forbidden words: ${enValidation.violations.map(v => v.word).join(', ')}`);
      }
    });
  }
  
  // Check number context
  if (pkg.number_context) {
    const numValidation = validateNumberContext(pkg.number_context);
    if (!numValidation.is_valid) {
      errors.push(`Number missing required context: ${numValidation.missing.join(', ')}`);
    }
  }
  
  // Check "this means" block
  if (!pkg.this_means?.statement?.sv || !pkg.this_means?.statement?.en) {
    errors.push('"This means" block is required');
  }
  
  // Check assumptions are visible
  if (!pkg.assumptions) {
    errors.push('Assumptions must be visible (can be empty array)');
  }
  
  return {
    is_valid: errors.length === 0,
    errors,
  };
}

// =============================================================================
// CONTEXT WARNINGS
// =============================================================================

/**
 * Detect if view is zoomed too narrowly
 */
export function detectNarrowZoom(
  selectedPeriod: { start: Date; end: Date },
  availableData: { start: Date; end: Date }
): ContextWarning | null {
  const selectedDays = (selectedPeriod.end.getTime() - selectedPeriod.start.getTime()) / (1000 * 60 * 60 * 24);
  const availableDays = (availableData.end.getTime() - availableData.start.getTime()) / (1000 * 60 * 60 * 24);
  
  const ratio = selectedDays / availableDays;
  
  if (ratio < 0.1) {
    return {
      type: 'narrow_zoom',
      message: {
        sv: 'Du tittar på en mycket kort period. Mönstret kan se annorlunda ut över längre tid.',
        en: 'You are viewing a very short period. The pattern may look different over longer time.',
      },
      suggestion: {
        sv: 'Prova att zooma ut för att se det större sammanhanget.',
        en: 'Try zooming out to see the bigger context.',
      },
      severity: 'warning',
    };
  }
  
  if (ratio < 0.25) {
    return {
      type: 'narrow_zoom',
      message: {
        sv: 'Denna tidsperiod är kortare än en fjärdedel av tillgänglig data.',
        en: 'This time period is less than a quarter of available data.',
      },
      suggestion: {
        sv: 'Resultatet kan ändras om du tittar längre bak.',
        en: 'Results may change if you look further back.',
      },
      severity: 'info',
    };
  }
  
  return null;
}

/**
 * Detect unusual periods that may skew interpretation
 */
export function detectUnusualPeriod(
  periodStart: Date,
  periodEnd: Date
): ContextWarning | null {
  // COVID period
  const covidStart = new Date('2020-03-01');
  const covidEnd = new Date('2022-12-31');
  
  if (periodStart >= covidStart && periodEnd <= covidEnd) {
    return {
      type: 'unusual_period',
      message: {
        sv: 'Denna period inkluderar pandemin (2020-2022), vilket påverkar många mätvärden.',
        en: 'This period includes the pandemic (2020-2022), which affects many metrics.',
      },
      suggestion: {
        sv: 'Jämför gärna med perioder före och efter för att se underliggande trender.',
        en: 'Consider comparing with periods before and after to see underlying trends.',
      },
      severity: 'warning',
    };
  }
  
  // Financial crisis
  const crisisStart = new Date('2008-01-01');
  const crisisEnd = new Date('2010-12-31');
  
  if (periodStart >= crisisStart && periodEnd <= crisisEnd) {
    return {
      type: 'unusual_period',
      message: {
        sv: 'Denna period inkluderar finanskrisen (2008-2010).',
        en: 'This period includes the financial crisis (2008-2010).',
      },
      suggestion: {
        sv: 'Ekonomiska mätvärden var extrema under denna tid.',
        en: 'Economic metrics were extreme during this time.',
      },
      severity: 'info',
    };
  }
  
  return null;
}

// =============================================================================
// INTUITIVE COMPARISONS
// =============================================================================

/**
 * Convert abstract numbers to intuitive comparisons
 */
export function createIntuitiveComparison(
  value: number,
  unit: string,
  comparisonType: IntuitiveComparison['type'],
  population?: number
): IntuitiveComparison {
  switch (comparisonType) {
    case 'per_person':
      const perPerson = population ? value / population : value;
      return {
        type: 'per_person',
        value: perPerson,
        unit: { sv: 'per person', en: 'per person' },
        explanation: {
          sv: `Det motsvarar ungefär ${formatNumber(perPerson)} ${unit} per person.`,
          en: `This equals approximately ${formatNumber(perPerson)} ${unit} per person.`,
        },
      };
      
    case 'per_household':
      const avgHouseholdSize = 2.2; // Swedish average
      const perHousehold = population ? (value / population) * avgHouseholdSize : value;
      return {
        type: 'per_household',
        value: perHousehold,
        unit: { sv: 'per hushåll', en: 'per household' },
        explanation: {
          sv: `Det motsvarar ungefär ${formatNumber(perHousehold)} ${unit} per hushåll.`,
          en: `This equals approximately ${formatNumber(perHousehold)} ${unit} per household.`,
        },
      };
      
    case 'work_time':
      // Convert to work hours (assuming value is in SEK and avg hourly wage ~200 SEK)
      const avgHourlyWage = 200;
      const workHours = value / avgHourlyWage;
      const workDays = workHours / 8;
      const workMonths = workDays / 20;
      
      if (workMonths >= 1) {
        return {
          type: 'work_time',
          value: workMonths,
          unit: { sv: 'arbetsmånader', en: 'work months' },
          explanation: {
            sv: `Det motsvarar ungefär ${formatNumber(workMonths, 1)} extra arbetsmånad${workMonths > 1 ? 'er' : ''} per person.`,
            en: `This equals approximately ${formatNumber(workMonths, 1)} extra work month${workMonths > 1 ? 's' : ''} per person.`,
          },
        };
      }
      
      return {
        type: 'work_time',
        value: workDays,
        unit: { sv: 'arbetsdagar', en: 'work days' },
        explanation: {
          sv: `Det motsvarar ungefär ${formatNumber(workDays, 0)} arbetsdagar per person.`,
          en: `This equals approximately ${formatNumber(workDays, 0)} work days per person.`,
        },
      };
      
    case 'lifetime':
      // Assuming value is annual, multiply by average remaining years
      const avgLifeExpectancy = 82;
      const avgAge = 40;
      const remainingYears = avgLifeExpectancy - avgAge;
      const lifetimeValue = value * remainingYears;
      
      return {
        type: 'lifetime',
        value: lifetimeValue,
        unit: { sv: 'under en livstid', en: 'over a lifetime' },
        explanation: {
          sv: `Över en genomsnittlig återstående livstid blir det ${formatNumber(lifetimeValue)} ${unit}.`,
          en: `Over an average remaining lifetime, this becomes ${formatNumber(lifetimeValue)} ${unit}.`,
        },
      };
      
    default:
      return {
        type: 'custom',
        value,
        unit: { sv: unit, en: unit },
        explanation: {
          sv: `Värdet är ${formatNumber(value)} ${unit}.`,
          en: `The value is ${formatNumber(value)} ${unit}.`,
        },
      };
  }
}

// =============================================================================
// LEVEL GENERATION
// =============================================================================

/**
 * Generate Level 1: "What do I see?"
 */
export function generateLevel1(
  direction: 'up' | 'down' | 'stable',
  magnitude: 'small' | 'moderate' | 'large',
  subject: { sv: string; en: string },
  timeframe: { sv: string; en: string }
): ExplanationLevel {
  const directionText = {
    up: { sv: 'har ökat', en: 'has increased' },
    down: { sv: 'har minskat', en: 'has decreased' },
    stable: { sv: 'har legat stabilt', en: 'has remained stable' },
  };
  
  const magnitudeText = {
    small: { sv: 'något', en: 'slightly' },
    moderate: { sv: 'märkbart', en: 'noticeably' },
    large: { sv: 'kraftigt', en: 'significantly' },
  };
  
  return {
    level: 1,
    title: {
      sv: 'Vad ser jag?',
      en: 'What do I see?',
    },
    content: {
      sv: `${subject.sv} ${directionText[direction].sv} ${magnitudeText[magnitude].sv} ${timeframe.sv}.`,
      en: `${subject.en} ${directionText[direction].en} ${magnitudeText[magnitude].en} ${timeframe.en}.`,
    },
  };
}

/**
 * Generate Level 2: "Why does it look like this?"
 */
export function generateLevel2(
  primaryDriver: { sv: string; en: string },
  secondaryDrivers: Array<{ sv: string; en: string }>,
  nonFactors?: Array<{ sv: string; en: string }>
): ExplanationLevel {
  let svContent = `Den största drivkraften är ${primaryDriver.sv}.`;
  let enContent = `The primary driver is ${primaryDriver.en}.`;
  
  if (secondaryDrivers.length > 0) {
    svContent += ` Andra faktorer inkluderar ${secondaryDrivers.map(d => d.sv).join(' och ')}.`;
    enContent += ` Other factors include ${secondaryDrivers.map(d => d.en).join(' and ')}.`;
  }
  
  if (nonFactors && nonFactors.length > 0) {
    svContent += ` ${nonFactors[0].sv} har liten påverkan trots hög uppmärksamhet.`;
    enContent += ` ${nonFactors[0].en} has little impact despite high attention.`;
  }
  
  return {
    level: 2,
    title: {
      sv: 'Varför ser det ut så?',
      en: 'Why does it look like this?',
    },
    content: {
      sv: svContent,
      en: enContent,
    },
  };
}

/**
 * Generate Level 3: "How do we know this?"
 */
export function generateLevel3(
  sources: Array<{ name: string; url: string }>,
  methodology: { sv: string; en: string },
  comparableExamples: Array<{ sv: string; en: string }>,
  uncertainties: Array<{ sv: string; en: string }>
): ExplanationLevel {
  return {
    level: 3,
    title: {
      sv: 'Hur vet vi detta?',
      en: 'How do we know this?',
    },
    content: {
      sv: `Data från: ${sources.map(s => s.name).join(', ')}. ${methodology.sv}. Osäkerheter: ${uncertainties.map(u => u.sv).join('; ')}.`,
      en: `Data from: ${sources.map(s => s.name).join(', ')}. ${methodology.en}. Uncertainties: ${uncertainties.map(u => u.en).join('; ')}.`,
    },
  };
}

// =============================================================================
// HELPERS
// =============================================================================

function formatNumber(value: number, decimals: number = 0): string {
  if (Math.abs(value) >= 1_000_000) {
    return (value / 1_000_000).toFixed(1) + 'M';
  }
  if (Math.abs(value) >= 1_000) {
    return (value / 1_000).toFixed(1) + 'k';
  }
  return value.toFixed(decimals);
}

// =============================================================================
// EXPORTS
// =============================================================================

export const EXPLANATION_CONSTANTS = {
  MAX_LEVEL1_LENGTH: 50, // words
  MAX_LEVEL2_LENGTH: 100, // words
  REQUIRED_ASSUMPTIONS_VISIBILITY: true,
  ALLOW_HIDDEN_ASSUMPTIONS: false,
} as const;
