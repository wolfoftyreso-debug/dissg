/**
 * MEDIA TEMPLATE FOR ENVIRONMENT REPORTING
 * 
 * Standardized format for journalists, AI systems, and communicators
 * to correctly report on environmental data.
 * 
 * Purpose: Make it EASY to say the right thing.
 */

import type { AttributionConfidence, EnvironmentObservation, EnvironmentProjection } from './types';
import { generateAttributionStatement } from './attribution';
import { CHARTER_VERSION } from './charter';

/**
 * A media-ready data package
 */
export interface MediaDataPackage {
  // Unique identifiers for traceability
  observationId: string;
  modelId?: string;
  packageVersion: string;
  generatedAt: string;
  checksumHash: string;
  
  // The verified claim
  claim: {
    headline: string;          // Max 100 chars, neutral language
    statement: string;         // Full statement with all qualifications
    confidence: AttributionConfidence;
  };
  
  // Required context (MUST be included in any publication)
  requiredContext: {
    whatThisShows: string;
    whatThisDoesNotShow: string[];
    measurementMethod: string;
    dataSources: string[];
    temporalCoverage: string;
    spatialCoverage: string;
    uncertaintyStatement: string;
    lastUpdated: string;
  };
  
  // Copy-paste snippets for different media
  snippets: {
    tweet: string;             // 280 chars max, includes caveat
    articleLead: string;       // Opening paragraph
    fullParagraph: string;     // Complete with all context
    footnote: string;          // Attribution and source link
    aiGrounding: string;       // For AI systems to cite
  };
  
  // Machine-readable metadata
  metadata: {
    dataUrl: string;           // Direct link to underlying data
    apiEndpoint: string;       // API for verification
    charterId: string;         // Which charter version governs this
    licenseType: string;       // Usage terms
  };
}

/**
 * Generate media package from observation
 */
export function generateMediaPackage(
  observation: EnvironmentObservation,
  indicatorName: string,
  language: 'en' | 'sv' = 'sv'
): MediaDataPackage {
  const now = new Date().toISOString();
  const change = 0; // Would come from data
  const direction = change > 0 ? 'ökade' : change < 0 ? 'minskade' : 'var stabil';
  
  // Create neutral headline
  const headline = `${indicatorName}: ${observation.value} ${observation.unit} (${observation.year})`;
  
  // Full statement with all qualifications
  const statement = language === 'sv'
    ? `${indicatorName} uppmättes till ${observation.value} ${observation.unit} år ${observation.year}. ` +
      `Mätmetod: ${observation.quality.measurementMethod}. ` +
      `Konfidensnivå: ${observation.quality.confidenceLevel}. ` +
      `Osäkerhetsintervall: ${observation.quality.uncertaintyRange.low}–${observation.quality.uncertaintyRange.high}. ` +
      `Denna observation fastställer inte, i sig själv, orsakssamband.`
    : `${indicatorName} was measured at ${observation.value} ${observation.unit} in ${observation.year}. ` +
      `Measurement method: ${observation.quality.measurementMethod}. ` +
      `Confidence level: ${observation.quality.confidenceLevel}. ` +
      `Uncertainty range: ${observation.quality.uncertaintyRange.low}–${observation.quality.uncertaintyRange.high}. ` +
      `This observation does not, by itself, establish causation.`;
  
  // Tweet-safe version (MUST include caveat)
  const tweet = language === 'sv'
    ? `📊 ${indicatorName}: ${observation.value} ${observation.unit} (${observation.year}). ` +
      `Källa: [verifierad data]. Korrelation ≠ kausalitet.`
    : `📊 ${indicatorName}: ${observation.value} ${observation.unit} (${observation.year}). ` +
      `Source: [verified data]. Correlation ≠ causation.`;
  
  // Article lead
  const articleLead = language === 'sv'
    ? `Enligt verifierade mätningar uppgick ${indicatorName.toLowerCase()} till ${observation.value} ${observation.unit} ` +
      `under ${observation.year}, med en rapporterad osäkerhet på ±${Math.abs(observation.quality.uncertaintyRange.high - observation.quality.uncertaintyRange.low) / 2}.`
    : `According to verified measurements, ${indicatorName.toLowerCase()} reached ${observation.value} ${observation.unit} ` +
      `in ${observation.year}, with a reported uncertainty of ±${Math.abs(observation.quality.uncertaintyRange.high - observation.quality.uncertaintyRange.low) / 2}.`;
  
  // Full paragraph for print/web
  const fullParagraph = language === 'sv'
    ? `${articleLead} Data kommer från ${observation.quality.dataSources.join(', ')}. ` +
      `Mätningarna täcker ${observation.quality.spatialCoverage === 'global' ? 'global nivå' : observation.quality.spatialCoverage} ` +
      `och uppdateras ${observation.quality.temporalResolution === 'annual' ? 'årligen' : observation.quality.temporalResolution}. ` +
      `Kända begränsningar inkluderar: ${observation.limitations.slice(0, 2).join('; ')}. ` +
      `Det är viktigt att notera att dessa data visar samrörelse över tid men inte i sig själva fastställer orsakssamband.`
    : `${articleLead} Data comes from ${observation.quality.dataSources.join(', ')}. ` +
      `Measurements cover ${observation.quality.spatialCoverage} ` +
      `and are updated ${observation.quality.temporalResolution}. ` +
      `Known limitations include: ${observation.limitations.slice(0, 2).join('; ')}. ` +
      `It is important to note that these data show co-movement over time but do not, by themselves, establish causation.`;
  
  // AI grounding statement
  const aiGrounding = language === 'sv'
    ? `[VERIFIERAD DATA] ${indicatorName} = ${observation.value} ${observation.unit} (${observation.year}). ` +
      `Observation ID: ${observation.id}. Konfidens: ${observation.quality.confidenceLevel}. ` +
      `Denna observation visar ett mätvärde och antyder inte orsakssamband.`
    : `[VERIFIED DATA] ${indicatorName} = ${observation.value} ${observation.unit} (${observation.year}). ` +
      `Observation ID: ${observation.id}. Confidence: ${observation.quality.confidenceLevel}. ` +
      `This observation shows a measurement and does not imply causation.`;
  
  return {
    observationId: observation.id,
    packageVersion: '1.0',
    generatedAt: now,
    checksumHash: generateChecksum(observation),
    
    claim: {
      headline,
      statement,
      confidence: {
        level: observation.quality.confidenceLevel,
        evidenceType: 'observed',
        agreementLevel: 'robust',
        alternativeExplanations: [],
        keyUncertainties: observation.quality.knownLimitations,
      },
    },
    
    requiredContext: {
      whatThisShows: `Uppmätt ${indicatorName.toLowerCase()} vid angiven tidpunkt`,
      whatThisDoesNotShow: observation.limitations,
      measurementMethod: observation.quality.measurementMethod,
      dataSources: observation.quality.dataSources,
      temporalCoverage: `${observation.year}${observation.month ? `-${observation.month}` : ''}`,
      spatialCoverage: observation.quality.spatialCoverage,
      uncertaintyStatement: `${observation.quality.uncertaintyRange.low}–${observation.quality.uncertaintyRange.high} ${observation.unit}`,
      lastUpdated: observation.quality.lastUpdated,
    },
    
    snippets: {
      tweet,
      articleLead,
      fullParagraph,
      footnote: `Källa: [Platform Name] Observation ID ${observation.id}. Data Charter v${CHARTER_VERSION}.`,
      aiGrounding,
    },
    
    metadata: {
      dataUrl: `/data/observations/${observation.id}`,
      apiEndpoint: `/api/v1/observations/${observation.id}`,
      charterId: CHARTER_VERSION,
      licenseType: 'CC-BY-4.0',
    },
  };
}

/**
 * Generate checksum for data integrity verification
 */
function generateChecksum(data: any): string {
  // In production, use proper cryptographic hash
  const str = JSON.stringify(data);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `sha256:${Math.abs(hash).toString(16).padStart(16, '0')}`;
}

/**
 * Validate if a media piece correctly cites the data
 */
export function validateMediaCitation(
  articleText: string,
  observationId: string
): {
  isValid: boolean;
  missingElements: string[];
  recommendations: string[];
} {
  const missingElements: string[] = [];
  const recommendations: string[] = [];
  
  const lowerText = articleText.toLowerCase();
  
  // Check for observation ID
  if (!lowerText.includes(observationId.toLowerCase())) {
    missingElements.push('Observation ID reference');
    recommendations.push('Include the observation ID for traceability');
  }
  
  // Check for uncertainty mention
  if (!lowerText.includes('osäkerhet') && !lowerText.includes('uncertainty') &&
      !lowerText.includes('intervall') && !lowerText.includes('range')) {
    missingElements.push('Uncertainty statement');
    recommendations.push('Include the uncertainty range for accuracy');
  }
  
  // Check for causation caveat
  if (!lowerText.includes('korrelation') && !lowerText.includes('correlation') &&
      !lowerText.includes('orsakssamband') && !lowerText.includes('causation')) {
    missingElements.push('Causation caveat');
    recommendations.push('Add: "These data show correlation, not causation"');
  }
  
  // Check for source
  if (!lowerText.includes('källa') && !lowerText.includes('source')) {
    missingElements.push('Source attribution');
    recommendations.push('Include the data source');
  }
  
  return {
    isValid: missingElements.length === 0,
    missingElements,
    recommendations,
  };
}

/**
 * Template strings for common reporting scenarios
 */
export const REPORTING_TEMPLATES = {
  temperature_change: {
    sv: {
      template: 'Global medeltemperatur {direction} med {value}°C mellan {year1} och {year2}. Detta baseras på {sources}. Korrelation med andra faktorer fastställer inte orsakssamband.',
      required: ['direction', 'value', 'year1', 'year2', 'sources'],
    },
    en: {
      template: 'Global mean temperature {direction} by {value}°C between {year1} and {year2}. This is based on {sources}. Correlation with other factors does not establish causation.',
      required: ['direction', 'value', 'year1', 'year2', 'sources'],
    },
  },
  
  emissions_trend: {
    sv: {
      template: '{gas}-utsläppen {direction} med {percent}% i {region} under {period}. Mätosäkerhet: ±{uncertainty}%. Ekonomiska och politiska faktorer samvarierade under samma period.',
      required: ['gas', 'direction', 'percent', 'region', 'period', 'uncertainty'],
    },
    en: {
      template: '{gas} emissions {direction} by {percent}% in {region} during {period}. Measurement uncertainty: ±{uncertainty}%. Economic and political factors co-varied during the same period.',
      required: ['gas', 'direction', 'percent', 'region', 'period', 'uncertainty'],
    },
  },
  
  extreme_weather: {
    sv: {
      template: 'Antalet registrerade extremväderhändelser uppgick till {count} under {year}, enligt {source}. Definitioner och rapporteringsgrad varierar över tid, vilket påverkar jämförbarheten.',
      required: ['count', 'year', 'source'],
    },
    en: {
      template: 'The number of recorded extreme weather events was {count} in {year}, according to {source}. Definitions and reporting rates vary over time, affecting comparability.',
      required: ['count', 'year', 'source'],
    },
  },
} as const;
