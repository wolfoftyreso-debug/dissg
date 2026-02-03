/**
 * LEGAL PROTECTION LAYER
 * 
 * Juridiskt skydd för Lambda-systemet:
 * - Ansvarsfriskrivningar (Disclaimers)
 * - Datakällors immunitet
 * - GDPR-compliance
 * - Terms of Use
 * 
 * Princip: Plattformen tillhandahåller data och beräkningskraft.
 * Allt ansvar för antaganden, tolkningar och beslut vilar helt på användaren.
 */

// =============================================================================
// TYPES
// =============================================================================

export type DisclaimerType =
  | 'data_source'
  | 'correlation'
  | 'prediction'
  | 'recommendation'
  | 'historical'
  | 'methodology'
  | 'coverage'
  | 'uncertainty';

export type LiabilityLevel = 'none' | 'limited' | 'standard' | 'high';

export interface Disclaimer {
  type: DisclaimerType;
  text_sv: string;
  text_en: string;
  required_context: string[];
  display_always: boolean;
}

export interface DataSourceImmunity {
  source_code: string;
  source_name: string;
  original_publisher: string;
  license: string;
  transformation_note: string;
  liability_statement: string;
}

export interface LegalMetadata {
  liability_level: LiabilityLevel;
  disclaimers: DisclaimerType[];
  data_source_immunities: string[];
  user_responsibility_statement: string;
  methodology_version: string;
  last_legal_review: string;
}

// =============================================================================
// STANDARD DISCLAIMERS
// =============================================================================

export const STANDARD_DISCLAIMERS: Record<DisclaimerType, Disclaimer> = {
  data_source: {
    type: 'data_source',
    text_sv: 'Data härrör från officiella källor. Plattformen ansvarar för aggregering och presentation, inte för ursprungsdata korrekthet.',
    text_en: 'Data originates from official sources. The platform is responsible for aggregation and presentation, not for the correctness of source data.',
    required_context: ['all'],
    display_always: true,
  },
  
  correlation: {
    type: 'correlation',
    text_sv: 'Korrelation innebär inte kausalitet. Observerade samband kan ha alternativa förklaringar som inte visas här.',
    text_en: 'Correlation does not imply causation. Observed relationships may have alternative explanations not shown here.',
    required_context: ['correlation', 'cross_analysis'],
    display_always: true,
  },
  
  prediction: {
    type: 'prediction',
    text_sv: 'Historiska mönster garanterar inte framtida utfall. All projektion baseras på antaganden som kan vara felaktiga.',
    text_en: 'Historical patterns do not guarantee future outcomes. All projections are based on assumptions that may be incorrect.',
    required_context: ['trend', 'forecast', 'projection'],
    display_always: true,
  },
  
  recommendation: {
    type: 'recommendation',
    text_sv: 'Denna plattform ger inga rekommendationer. All information är beskrivande, inte normativ.',
    text_en: 'This platform provides no recommendations. All information is descriptive, not normative.',
    required_context: ['all'],
    display_always: true,
  },
  
  historical: {
    type: 'historical',
    text_sv: 'Historiska paralleller är informativa, inte prediktiva. Varje situation har unika omständigheter.',
    text_en: 'Historical parallels are informative, not predictive. Each situation has unique circumstances.',
    required_context: ['historical_pattern', 'similar_cases'],
    display_always: false,
  },
  
  methodology: {
    type: 'methodology',
    text_sv: 'Beräkningsmetoden påverkar resultatet. Alternativa metodval kan ge annorlunda slutsatser.',
    text_en: 'The calculation methodology affects results. Alternative methods may yield different conclusions.',
    required_context: ['index', 'calculation', 'normalization'],
    display_always: false,
  },
  
  coverage: {
    type: 'coverage',
    text_sv: 'Datatäckningen är begränsad. Resultat baseras endast på tillgänglig data och kan vara ofullständiga.',
    text_en: 'Data coverage is limited. Results are based only on available data and may be incomplete.',
    required_context: ['low_coverage'],
    display_always: false,
  },
  
  uncertainty: {
    type: 'uncertainty',
    text_sv: 'Osäkerhetsintervall indikerar statistisk precision, inte säkerhet om verkligheten.',
    text_en: 'Confidence intervals indicate statistical precision, not certainty about reality.',
    required_context: ['confidence_interval', 'uncertainty'],
    display_always: false,
  },
};

// =============================================================================
// USER RESPONSIBILITY STATEMENTS
// =============================================================================

export const USER_RESPONSIBILITY_STATEMENT_SV = `
ANVÄNDARANSVAR

Genom att använda denna plattform bekräftar du att:

1. TOLKNING: Du är ensamt ansvarig för tolkningen av all information.
2. BESLUT: Alla beslut baserade på plattformens data är dina egna.
3. ANTAGANDEN: Du förstår att all analys bygger på antaganden som kan vara felaktiga.
4. INTE RÅDGIVNING: Denna plattform ger ingen finansiell, medicinsk, juridisk eller annan professionell rådgivning.
5. VERIFIERING: Du bör verifiera kritisk information genom oberoende källor.
6. KONSEKVENSER: Plattformen bär inget ansvar för konsekvenser av beslut baserade på dess data.

Användning av plattformen innebär acceptans av dessa villkor.
`;

export const USER_RESPONSIBILITY_STATEMENT_EN = `
USER RESPONSIBILITY

By using this platform, you confirm that:

1. INTERPRETATION: You are solely responsible for interpreting all information.
2. DECISIONS: All decisions based on platform data are your own.
3. ASSUMPTIONS: You understand that all analysis is based on assumptions that may be incorrect.
4. NOT ADVICE: This platform provides no financial, medical, legal, or other professional advice.
5. VERIFICATION: You should verify critical information through independent sources.
6. CONSEQUENCES: The platform bears no responsibility for consequences of decisions based on its data.

Use of the platform implies acceptance of these terms.
`;

// =============================================================================
// DATA SOURCE IMMUNITY GENERATOR
// =============================================================================

/**
 * Generate immunity statement for a data source
 */
export function generateDataSourceImmunity(
  sourceCode: string,
  sourceName: string,
  originalPublisher: string,
  license: string
): DataSourceImmunity {
  return {
    source_code: sourceCode,
    source_name: sourceName,
    original_publisher: originalPublisher,
    license,
    transformation_note: `Data has been aggregated and normalized for analysis purposes. Original data remains the intellectual property of ${originalPublisher}.`,
    liability_statement: `This platform republishes data from ${sourceName} under ${license} license. The platform is not liable for errors or omissions in the original data. Users should consult the original source for authoritative information.`,
  };
}

// =============================================================================
// LEGAL METADATA GENERATOR
// =============================================================================

/**
 * Generate complete legal metadata for a view or analysis
 */
export function generateLegalMetadata(
  context: {
    hasCorrelation?: boolean;
    hasTrend?: boolean;
    hasHistoricalPattern?: boolean;
    dataCoverage: number;
    sourceCount: number;
    sources: string[];
  },
  methodologyVersion: string
): LegalMetadata {
  const disclaimers: DisclaimerType[] = ['data_source', 'recommendation'];
  
  if (context.hasCorrelation) {
    disclaimers.push('correlation');
  }
  
  if (context.hasTrend) {
    disclaimers.push('prediction');
  }
  
  if (context.hasHistoricalPattern) {
    disclaimers.push('historical');
  }
  
  if (context.dataCoverage < 0.7) {
    disclaimers.push('coverage');
  }
  
  // Always include methodology and uncertainty
  disclaimers.push('methodology', 'uncertainty');
  
  // Determine liability level
  let liabilityLevel: LiabilityLevel = 'none';
  if (context.hasCorrelation || context.hasTrend) {
    liabilityLevel = 'limited';
  }
  if (context.dataCoverage < 0.5) {
    liabilityLevel = 'standard';
  }
  
  return {
    liability_level: liabilityLevel,
    disclaimers,
    data_source_immunities: context.sources,
    user_responsibility_statement: USER_RESPONSIBILITY_STATEMENT_EN,
    methodology_version: methodologyVersion,
    last_legal_review: new Date().toISOString().split('T')[0],
  };
}

// =============================================================================
// DISCLAIMER TEXT GENERATOR
// =============================================================================

/**
 * Get disclaimers for a specific context
 */
export function getDisclaimersForContext(
  context: string[],
  language: 'sv' | 'en' = 'sv'
): string[] {
  const relevantDisclaimers: string[] = [];
  
  for (const disclaimer of Object.values(STANDARD_DISCLAIMERS)) {
    if (disclaimer.display_always || 
        disclaimer.required_context.some(c => context.includes(c) || c === 'all')) {
      relevantDisclaimers.push(
        language === 'sv' ? disclaimer.text_sv : disclaimer.text_en
      );
    }
  }
  
  return relevantDisclaimers;
}

/**
 * Generate full disclaimer block for display
 */
export function generateDisclaimerBlock(
  context: string[],
  language: 'sv' | 'en' = 'sv'
): {
  title: string;
  disclaimers: string[];
  methodology_note: string;
  responsibility_statement: string;
} {
  return {
    title: language === 'sv' ? 'Viktig information' : 'Important Information',
    disclaimers: getDisclaimersForContext(context, language),
    methodology_note: language === 'sv'
      ? 'Alla beräkningar är reproducerbara. Metodik och källhänvisningar finns tillgängliga för varje datapunkt.'
      : 'All calculations are reproducible. Methodology and source references are available for each data point.',
    responsibility_statement: language === 'sv'
      ? USER_RESPONSIBILITY_STATEMENT_SV
      : USER_RESPONSIBILITY_STATEMENT_EN,
  };
}

// =============================================================================
// GDPR COMPLIANCE
// =============================================================================

export interface GDPRCompliance {
  data_minimization: boolean;
  purpose_limitation: boolean;
  storage_limitation: boolean;
  accuracy: boolean;
  integrity_confidentiality: boolean;
  lawful_basis: string;
}

/**
 * GDPR compliance statement for the platform
 */
export const GDPR_COMPLIANCE: GDPRCompliance = {
  data_minimization: true, // Only aggregate statistical data, no personal data
  purpose_limitation: true, // Data used only for analysis and presentation
  storage_limitation: true, // Historical data retained for trend analysis only
  accuracy: true, // Data validated against official sources
  integrity_confidentiality: true, // No personal identifiable information processed
  lawful_basis: 'Legitimate interest in providing public statistical analysis',
};

/**
 * Generate GDPR statement for a data view
 */
export function generateGDPRStatement(language: 'sv' | 'en' = 'sv'): string {
  if (language === 'sv') {
    return `
GDPR-EFTERLEVNAD

Denna plattform behandlar endast aggregerad statistisk data på befolkningsnivå.
Ingen personidentifierbar information samlas in, lagras eller bearbetas.
All data härrör från officiella offentliga källor som är undantagna från GDPR:s
tillämpningsområde enligt artikel 89 om arkivändamål, forskning eller statistik.
    `.trim();
  }
  
  return `
GDPR COMPLIANCE

This platform processes only aggregate statistical data at the population level.
No personally identifiable information is collected, stored, or processed.
All data originates from official public sources exempt from GDPR scope
under Article 89 for archiving purposes, research, or statistics.
  `.trim();
}

// =============================================================================
// TERMS OF USE
// =============================================================================

/**
 * Generate terms of use summary
 */
export function generateTermsOfUseSummary(language: 'sv' | 'en' = 'sv'): {
  title: string;
  sections: { heading: string; content: string }[];
} {
  if (language === 'sv') {
    return {
      title: 'Användarvillkor (Sammanfattning)',
      sections: [
        {
          heading: '1. Informationsändamål',
          content: 'Plattformen tillhandahåller information för forsknings- och analysändamål. Den utgör inte professionell rådgivning.',
        },
        {
          heading: '2. Datakällor',
          content: 'All data härrör från officiella källor. Plattformen garanterar inte datans korrekthet eller aktualitet.',
        },
        {
          heading: '3. Användaransvar',
          content: 'Användaren ansvarar för alla tolkningar och beslut baserade på plattformens information.',
        },
        {
          heading: '4. Ansvarsbegränsning',
          content: 'Plattformen friskriver sig från allt ansvar för direkta, indirekta eller följdskador.',
        },
        {
          heading: '5. Metodtransparens',
          content: 'Alla beräkningsmetoder är offentliga och reproducerbara. Metodikversion anges för varje analys.',
        },
      ],
    };
  }
  
  return {
    title: 'Terms of Use (Summary)',
    sections: [
      {
        heading: '1. Informational Purpose',
        content: 'The platform provides information for research and analysis purposes. It does not constitute professional advice.',
      },
      {
        heading: '2. Data Sources',
        content: 'All data originates from official sources. The platform does not guarantee accuracy or timeliness of data.',
      },
      {
        heading: '3. User Responsibility',
        content: 'The user is responsible for all interpretations and decisions based on platform information.',
      },
      {
        heading: '4. Limitation of Liability',
        content: 'The platform disclaims all liability for direct, indirect, or consequential damages.',
      },
      {
        heading: '5. Method Transparency',
        content: 'All calculation methods are public and reproducible. Methodology version is stated for each analysis.',
      },
    ],
  };
}

// =============================================================================
// VERIFICATION UTILITIES
// =============================================================================

/**
 * Generate verification hash for a data snapshot
 */
export function generateVerificationHash(
  data: Record<string, unknown>,
  timestamp: string
): string {
  const payload = JSON.stringify({ data, timestamp, version: '1.0' });
  // In production, this would be a proper cryptographic hash
  // For now, we create a deterministic pseudo-hash
  let hash = 0;
  for (let i = 0; i < payload.length; i++) {
    const char = payload.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16).padStart(8, '0').toUpperCase();
}

/**
 * Generate QR verification URL for a data point
 */
export function generateQRVerificationUrl(
  entityType: 'index' | 'lambda' | 'correlation' | 'analysis',
  entityId: string,
  hash: string
): string {
  return `https://strim.se/verify?type=${entityType}&id=${entityId}&h=${hash}`;
}
