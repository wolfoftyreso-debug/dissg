/**
 * WAVE 7 — BLOCK BC: DATA NON-OWNERSHIP CONTRACT
 * 
 * Systemlag för datapositionering.
 * Denna konfiguration är orubblig och ska gälla överallt.
 */

// =============================================================================
// BC1: OFFICIELL POSITION (SKA STÅ ÖVERALLT)
// =============================================================================

/**
 * Den officiella systemhållningen - exakt formulering.
 * Ska visas: i footer, i API-respons, i varje graf (hover), i varje export.
 */
export const OFFICIAL_POSITION = {
  sv: `Denna plattform producerar ingen primärdata.
All data presenteras exakt såsom den publicerats av ursprunglig källa.
Plattformen ansvarar för aggregation, struktur och visualisering – inte innehåll.`,
  
  en: `This platform produces no primary data.
All data is presented exactly as published by the original source.
The platform is responsible for aggregation, structure and visualization – not content.`,
} as const;

/**
 * Kortversion för kompakta ytor (tooltips, badges)
 */
export const OFFICIAL_POSITION_SHORT = {
  sv: 'Plattformen aggregerar – den producerar ingen egen data.',
  en: 'The platform aggregates – it produces no original data.',
} as const;

/**
 * Var positionen ska visas
 */
export const POSITION_DISPLAY_LOCATIONS = [
  'footer',
  'api_response',
  'chart_hover',
  'export_file',
  'data_tooltip',
  'methodology_dialog',
] as const;

// =============================================================================
// BC2: SYSTEMREGLER (HÅRDA)
// =============================================================================

/**
 * Förbjudna operationer - tekniskt spärrade
 */
export const FORBIDDEN_DATA_OPERATIONS = {
  value_modification: {
    code: 'NO_VALUE_MOD',
    description: 'Ingen datarensning som ändrar värden',
    severity: 'critical',
  },
  imputation: {
    code: 'NO_IMPUTE',
    description: 'Ingen imputering av saknade värden',
    severity: 'critical',
  },
  adjustment: {
    code: 'NO_ADJUST',
    description: 'Ingen "justering" av värden',
    severity: 'critical',
  },
  interpolation_auto: {
    code: 'NO_AUTO_INTERP',
    description: 'Ingen interpolation utan explicit val av användare',
    severity: 'critical',
  },
} as const;

/**
 * Tillåtna operationer - med full transparens
 */
export const ALLOWED_DATA_OPERATIONS = {
  grouping: {
    code: 'GROUP',
    description: 'Gruppering av datapunkter',
    requires_disclosure: true,
    disclosure_fields: ['group_by', 'group_count', 'source_points'],
  },
  summation: {
    code: 'SUM',
    description: 'Summering av värden',
    requires_disclosure: true,
    disclosure_fields: ['sum_method', 'included_values', 'excluded_values'],
  },
  normalization: {
    code: 'NORM',
    description: 'Normalisering (med full transparens)',
    requires_disclosure: true,
    disclosure_fields: ['norm_method', 'scale_min', 'scale_max', 'original_range'],
  },
  time_adjustment: {
    code: 'TIME_ADJ',
    description: 'Tidsjustering (med visad metod)',
    requires_disclosure: true,
    disclosure_fields: ['adjustment_method', 'original_period', 'adjusted_period'],
  },
} as const;

// =============================================================================
// BD: RAW DATA GUARANTEE LAYER
// =============================================================================

/**
 * Rådatagaranti-krav för varje datapunkt
 */
export const RAW_DATA_REQUIREMENTS = {
  /** Visa rådata-knapp */
  show_raw_data: true,
  /** Visa källa-knapp */
  show_source: true,
  /** Visa exakt datapost */
  show_exact_record: true,
  /** Max antal klick till rå post */
  max_clicks_to_raw: 1,
} as const;

/**
 * Integritetsgaranti per datapunkt
 */
export interface DataIntegrity {
  /** Checksumma vid ingest */
  checksum: string;
  /** Hash-algoritm (SHA-256) */
  hashAlgorithm: 'SHA-256';
  /** Versions-ID */
  versionId: string;
  /** Tidsstämpel för ingest */
  ingestedAt: string;
  /** Käll-URL vid tidpunkt för ingest */
  sourceUrlAtIngest: string;
}

/**
 * Verifieringsmeddelande för användare
 */
export const VERIFICATION_MESSAGE = {
  sv: 'Detta är exakt vad källan publicerade.',
  en: 'This is exactly what the source published.',
} as const;

// =============================================================================
// BE: SOURCE BLAME & ATTRIBUTION ENGINE
// =============================================================================

/**
 * Obligatoriska attributfält för alla datapunkter
 */
export const REQUIRED_ATTRIBUTION_FIELDS = [
  'sourceName',       // Källa (organisation)
  'sourceUrl',        // URL
  'license',          // Licens
  'lastUpdated',      // Senaste uppdatering
] as const;

/**
 * Standardmall för attribution
 */
export const ATTRIBUTION_TEMPLATE = {
  sv: 'Källa: {sourceName} – detta värde har inte ändrats av plattformen.',
  en: 'Source: {sourceName} – this value has not been modified by the platform.',
} as const;

/**
 * Käll-disclaimer (juridiskt guld)
 */
export const SOURCE_DISCLAIMER = {
  sv: 'Eventuella fel, definitioner eller metodval härrör från ursprunglig datakälla.',
  en: 'Any errors, definitions, or methodological choices originate from the original data source.',
} as const;

// =============================================================================
// BF: ZERO-INTERPRETATION MODE (DEFAULT)
// =============================================================================

/**
 * SPÄRRADE värdeord - systemet får ALDRIG använda dessa
 */
export const FORBIDDEN_VALUE_WORDS = [
  // Svenska
  'bättre', 'sämre',
  'lyckades', 'misslyckades',
  'framgång', 'fiasko',
  'positivt', 'negativt',
  'bra', 'dåligt',
  'stark', 'svag',
  'vinst', 'förlust',
  'framsteg', 'bakslag',
  'förbättring', 'försämring',
  'optimalt', 'suboptimalt',
  'effektivt', 'ineffektivt',
  
  // Engelska
  'better', 'worse',
  'succeeded', 'failed',
  'success', 'failure',
  'positive', 'negative',
  'good', 'bad',
  'strong', 'weak',
  'win', 'loss',
  'progress', 'setback',
  'improvement', 'deterioration',
  'optimal', 'suboptimal',
  'effective', 'ineffective',
] as const;

/**
 * TILLÅTNA neutrala ord
 */
export const ALLOWED_NEUTRAL_WORDS = {
  change: {
    sv: ['ökade', 'minskade', 'förändrades', 'var oförändrad'],
    en: ['increased', 'decreased', 'changed', 'remained unchanged'],
  },
  comparison: {
    sv: ['sammanfaller med', 'avviker från', 'skiljer sig från', 'liknar'],
    en: ['coincides with', 'deviates from', 'differs from', 'resembles'],
  },
  observation: {
    sv: ['observerades', 'uppmättes', 'registrerades', 'noterades'],
    en: ['was observed', 'was measured', 'was recorded', 'was noted'],
  },
  relationship: {
    sv: ['korrelerar med', 'samvarierar med', 'förekommer tillsammans med'],
    en: ['correlates with', 'co-varies with', 'co-occurs with'],
  },
} as const;

/**
 * Validera text mot förbjudna värdeord
 */
export function containsForbiddenValueWord(text: string): { 
  found: boolean; 
  words: string[];
  suggestions: string[];
} {
  const lowerText = text.toLowerCase();
  const foundWords = FORBIDDEN_VALUE_WORDS.filter(word => 
    lowerText.includes(word.toLowerCase())
  );
  
  // Föreslå neutrala alternativ
  const suggestions = foundWords.map(word => {
    if (['bättre', 'better', 'förbättring', 'improvement'].includes(word.toLowerCase())) {
      return '"ökade" eller "förändrades i positiv riktning enligt definition"';
    }
    if (['sämre', 'worse', 'försämring', 'deterioration'].includes(word.toLowerCase())) {
      return '"minskade" eller "förändrades i negativ riktning enligt definition"';
    }
    if (['lyckades', 'succeeded', 'framgång', 'success'].includes(word.toLowerCase())) {
      return '"uppnåddes" eller "målvärdet nåddes"';
    }
    if (['misslyckades', 'failed', 'fiasko', 'failure'].includes(word.toLowerCase())) {
      return '"uppnåddes inte" eller "målvärdet nåddes ej"';
    }
    return '"förändrades"';
  });
  
  return { 
    found: foundWords.length > 0, 
    words: foundWords,
    suggestions 
  };
}

// =============================================================================
// BG: USER-DRIVEN COMPARISON ENGINE
// =============================================================================

/**
 * Krav för användardriven jämförelse
 */
export const COMPARISON_REQUIREMENTS = {
  /** Systemet föreslår ALDRIG jämförelser */
  system_suggests_never: true,
  
  /** Användaren måste explicit välja */
  user_must_select: [
    'source_a',
    'source_b', 
    'kpi',
    'period',
    'visualization',
  ] as const,
  
  /** Systemet validerar och visar */
  system_actions: [
    'validate_comparability',
    'show_definition_diff',
    'show_method_diff',
    'show_coverage_diff',
    'display_result',
  ] as const,
};

/**
 * Definition Diff-struktur
 */
export interface DefinitionDiff {
  sourceA: {
    name: string;
    definition: string;
    measurementMethod: string;
    coverage: string;
    period: string;
  };
  sourceB: {
    name: string;
    definition: string;
    measurementMethod: string;
    coverage: string;
    period: string;
  };
  differences: {
    field: string;
    description: string;
    severity: 'minor' | 'moderate' | 'major';
  }[];
  comparabilityScore: number; // 0-100
  comparabilityWarning?: string;
}

// =============================================================================
// BH: METHOD VISIBILITY ENGINE
// =============================================================================

/**
 * All aggregering MÅSTE visa
 */
export const METHOD_VISIBILITY_REQUIREMENTS = [
  'exact_formula',      // Exakt formel
  'exact_selection',    // Exakt urval
  'exact_weighting',    // Exakt viktning
  'exact_time_window',  // Exakt tidsfönster
] as const;

/**
 * Ingen formel får vara dold
 */
export const METHOD_DISCLOSURE_RULE = {
  hidden_formulas_allowed: false,
  hidden_weights_allowed: false,
  hidden_selections_allowed: false,
} as const;

/**
 * Export inkluderar alltid
 */
export const EXPORT_INCLUDES = {
  method_json: true,
  sources: true,
  confidence: true,
  checksums: true,
  formula: true,
} as const;

// =============================================================================
// BI: "BLAME THE SOURCE" UX PATTERN
// =============================================================================

/**
 * UX-meddelande för konstiga värden
 */
export const BLAME_SOURCE_MESSAGE = {
  sv: `Detta värde kommer från {sourceName}.
Plattformen har inte ändrat siffran.`,
  
  en: `This value comes from {sourceName}.
The platform has not modified this number.`,
} as const;

/**
 * Generera blame-source meddelande
 */
export function generateBlameSourceMessage(
  sourceName: string, 
  lang: 'sv' | 'en' = 'sv'
): string {
  return BLAME_SOURCE_MESSAGE[lang].replace('{sourceName}', sourceName);
}

// =============================================================================
// BJ: PUBLIC VERIFICATION MODE
// =============================================================================

/**
 * Verifieringsfunktion för allmänheten
 */
export const VERIFICATION_FEATURES = {
  /** Kopiera rådatapunkt */
  copy_raw_data: true,
  /** Gå till käll-URL */
  go_to_source: true,
  /** Verifiera siffran manuellt */
  manual_verify: true,
  /** Exportera med checksumma */
  export_with_checksum: true,
} as const;

// =============================================================================
// BK: ANTI-MISINTERPRETATION GUARD
// =============================================================================

/**
 * Systemet stoppar
 */
export const MISINTERPRETATION_GUARDS = {
  cherry_picking: {
    code: 'CHERRY_PICK_WARN',
    description: 'Varning vid partiellt urval',
    action: 'warn',
    message_sv: 'Du har valt ett partiellt urval. Den fullständiga datamängden kan visa annat mönster.',
    message_en: 'You have selected a partial sample. The complete dataset may show a different pattern.',
  },
  invalid_comparison: {
    code: 'INVALID_COMP_WARN',
    description: 'Varning vid ogiltig jämförelse',
    action: 'warn',
    message_sv: 'Denna jämförelse använder olika definitioner eller mätmetoder.',
    message_en: 'This comparison uses different definitions or measurement methods.',
  },
  statistical_invalid: {
    code: 'STAT_INVALID_WARN',
    description: 'Varning vid statistiskt ogiltig slutsats',
    action: 'warn',
    message_sv: 'Denna jämförelse är möjlig – men metodiskt svag.',
    message_en: 'This comparison is possible – but methodologically weak.',
  },
} as const;

/**
 * Validera en jämförelse
 */
export function validateComparison(params: {
  sourceA: string;
  sourceB: string;
  definitionMatch: number;
  methodMatch: number;
  coverageMatch: number;
}): {
  valid: boolean;
  strength: 'strong' | 'moderate' | 'weak';
  warnings: string[];
} {
  const { definitionMatch, methodMatch, coverageMatch } = params;
  const avgMatch = (definitionMatch + methodMatch + coverageMatch) / 3;
  
  const warnings: string[] = [];
  
  if (definitionMatch < 0.7) {
    warnings.push(MISINTERPRETATION_GUARDS.invalid_comparison.message_sv);
  }
  
  if (avgMatch < 0.5) {
    warnings.push(MISINTERPRETATION_GUARDS.statistical_invalid.message_sv);
  }
  
  return {
    valid: warnings.length === 0,
    strength: avgMatch > 0.8 ? 'strong' : avgMatch > 0.5 ? 'moderate' : 'weak',
    warnings,
  };
}

// =============================================================================
// EXPORT: Komplett konfiguration
// =============================================================================

export const DATA_POSITIONING_CONFIG = {
  officialPosition: OFFICIAL_POSITION,
  officialPositionShort: OFFICIAL_POSITION_SHORT,
  forbiddenOperations: FORBIDDEN_DATA_OPERATIONS,
  allowedOperations: ALLOWED_DATA_OPERATIONS,
  rawDataRequirements: RAW_DATA_REQUIREMENTS,
  verificationMessage: VERIFICATION_MESSAGE,
  requiredAttributionFields: REQUIRED_ATTRIBUTION_FIELDS,
  attributionTemplate: ATTRIBUTION_TEMPLATE,
  sourceDisclaimer: SOURCE_DISCLAIMER,
  forbiddenValueWords: FORBIDDEN_VALUE_WORDS,
  allowedNeutralWords: ALLOWED_NEUTRAL_WORDS,
  comparisonRequirements: COMPARISON_REQUIREMENTS,
  methodVisibilityRequirements: METHOD_VISIBILITY_REQUIREMENTS,
  exportIncludes: EXPORT_INCLUDES,
  blameSourceMessage: BLAME_SOURCE_MESSAGE,
  verificationFeatures: VERIFICATION_FEATURES,
  misinterpretationGuards: MISINTERPRETATION_GUARDS,
} as const;
