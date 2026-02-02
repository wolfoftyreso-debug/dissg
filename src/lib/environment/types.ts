/**
 * Environment Reality Layer - Types & Definitions
 * Observation-first environmental data without advocacy
 * 
 * Core Principle: Show what is measured, how it's measured, and what happened.
 * Never say what should be done.
 */

/**
 * The 10-15 core environmental indicators that are globally observable
 * No indices. No weighting. Just meters.
 */
export interface EnvironmentCoreIndicators {
  globalMeanTemperature: number | null;     // °C anomaly from baseline
  seaLevel: number | null;                  // mm change from baseline
  arcticIceExtent: number | null;           // million km²
  antarcticIceMass: number | null;          // Gt change
  greenlandIceMass: number | null;          // Gt change
  atmosphericCO2: number | null;            // ppm
  atmosphericMethane: number | null;        // ppb
  fossilEnergyShare: number | null;         // % of primary energy
  renewableEnergyShare: number | null;      // % of primary energy
  pm25Global: number | null;                // μg/m³ population-weighted
  forestAreaNet: number | null;             // million hectares change
  oceanPH: number | null;                   // pH units
  extremeWeatherEvents: number | null;      // count per year (standardized definition)
}

/**
 * Data quality and uncertainty metadata
 */
export interface DataQuality {
  measurementMethod: string;
  spatialCoverage: 'global' | 'hemispheric' | 'regional' | 'local';
  temporalResolution: 'annual' | 'monthly' | 'daily' | 'continuous';
  uncertaintyRange: { low: number; high: number };
  confidenceLevel: 'very_high' | 'high' | 'medium' | 'low' | 'very_low';
  dataSources: string[];
  lastUpdated: string;
  knownLimitations: string[];
}

/**
 * Attribution confidence framework
 * How confident are we about cause-effect relationships?
 */
export interface AttributionConfidence {
  level: 'very_high' | 'high' | 'medium' | 'low' | 'very_low';
  evidenceType: 'observed' | 'modeled' | 'inferred';
  agreementLevel: 'robust' | 'medium' | 'limited';
  alternativeExplanations: string[];
  keyUncertainties: string[];
  ipccCategory?: string; // If applicable
}

/**
 * Clear separation between observation and model
 */
export type DataMode = 'observation' | 'model';

/**
 * An environmental observation at a point in time
 */
export interface EnvironmentObservation {
  id: string;
  indicatorId: keyof EnvironmentCoreIndicators;
  year: number;
  month?: number;
  value: number;
  unit: string;
  
  // Data quality (always visible)
  quality: DataQuality;
  
  // Mode indicator (always visible)
  mode: 'observation';
  
  // What this observation does NOT show
  limitations: string[];
}

/**
 * A model projection (clearly separated from observations)
 */
export interface EnvironmentProjection {
  id: string;
  indicatorId: keyof EnvironmentCoreIndicators;
  modelName: string;
  modelVersion: string;
  
  // Mode indicator (always visible, clearly marked)
  mode: 'model';
  
  // Projections are ALWAYS ranges, never points
  projections: {
    year: number;
    lowEstimate: number;
    midEstimate: number;
    highEstimate: number;
    confidenceBand: number;
  }[];
  
  // Explicit assumptions (always visible)
  assumptions: {
    scenarioName: string;
    keyAssumptions: string[];
    emissionsPathway?: string;
  };
  
  // Comparison with other models
  modelAgreement: {
    modelsCompared: number;
    rangeAcrossModels: { low: number; high: number };
    divergencePoints: string[];
  };
  
  // What this projection does NOT predict
  limitations: string[];
}

/**
 * Historical marker for timeline
 */
export interface EnvironmentMarker {
  id: string;
  year: number;
  type: 'industrial_era' | 'energy_transition' | 'policy' | 'technology' | 'natural_event' | 'conflict';
  title: string;
  description: string;
  
  // What changed after this
  observedChanges: {
    indicatorId: keyof EnvironmentCoreIndicators;
    beforeValue: number;
    afterValue: number;
    yearsToChange: number;
    attributionConfidence: AttributionConfidence;
  }[];
  
  // What did NOT change
  unchangedIndicators: (keyof EnvironmentCoreIndicators)[];
  
  sources: string[];
}

/**
 * "What happened when..." query result
 */
export interface WhatHappenedWhenResult {
  query: {
    condition: string;  // e.g., "coal use fell"
    indicatorOfInterest: keyof EnvironmentCoreIndicators;
    timePeriod: { start: number; end: number };
  };
  
  // Historical cases
  cases: {
    countryOrRegion: string;
    periodStart: number;
    periodEnd: number;
    conditionChange: { before: number; after: number; unit: string };
    indicatorChange: { before: number; after: number; unit: string };
    confoundingFactors: string[];
    attributionConfidence: AttributionConfidence;
  }[];
  
  // Pattern summary (if any)
  observedPattern: {
    statement: string; // Neutral language only
    casesSupporting: number;
    casesContradicting: number;
    limitations: string[];
  } | null;
  
  // What this analysis does NOT show
  whatThisDoesNotShow: string[];
}

/**
 * Indicator metadata with locked definitions
 */
export const ENVIRONMENT_INDICATORS: Record<keyof EnvironmentCoreIndicators, {
  id: keyof EnvironmentCoreIndicators;
  name: string;
  nameShort: string;
  unit: string;
  description: string;
  measurementMethod: string;
  baseline: { year: number; value: number } | null;
  primarySource: string;
  updateFrequency: string;
}> = {
  globalMeanTemperature: {
    id: 'globalMeanTemperature',
    name: 'Global medeltemperatur',
    nameShort: 'Temperatur',
    unit: '°C (anomali)',
    description: 'Global medeltemperaturavvikelse från referensperiod',
    measurementMethod: 'Surface temperature stations, sea surface measurements, satellite',
    baseline: { year: 1951, value: 0 }, // 1951-1980 baseline
    primarySource: 'NASA GISS, NOAA, HadCRUT',
    updateFrequency: 'Monthly'
  },
  seaLevel: {
    id: 'seaLevel',
    name: 'Global havsnivå',
    nameShort: 'Havsnivå',
    unit: 'mm',
    description: 'Global medelhavsnivåförändring från referensperiod',
    measurementMethod: 'Satellite altimetry (since 1993), tide gauges (historical)',
    baseline: { year: 1993, value: 0 },
    primarySource: 'NASA Sea Level Portal, AVISO',
    updateFrequency: 'Monthly'
  },
  arcticIceExtent: {
    id: 'arcticIceExtent',
    name: 'Arktisk isutbredning',
    nameShort: 'Arktis is',
    unit: 'miljoner km²',
    description: 'Säsongsminimum för arktisk havsisutbredning',
    measurementMethod: 'Satellite passive microwave',
    baseline: null,
    primarySource: 'NSIDC',
    updateFrequency: 'Daily/Monthly'
  },
  antarcticIceMass: {
    id: 'antarcticIceMass',
    name: 'Antarktisk ismassa',
    nameShort: 'Antarktis is',
    unit: 'Gt',
    description: 'Förändring i Antarktis landismassa',
    measurementMethod: 'GRACE satellite gravimetry',
    baseline: { year: 2002, value: 0 },
    primarySource: 'NASA GRACE',
    updateFrequency: 'Monthly'
  },
  greenlandIceMass: {
    id: 'greenlandIceMass',
    name: 'Grönlands ismassa',
    nameShort: 'Grönland is',
    unit: 'Gt',
    description: 'Förändring i Grönlands inlandsis',
    measurementMethod: 'GRACE satellite gravimetry',
    baseline: { year: 2002, value: 0 },
    primarySource: 'NASA GRACE',
    updateFrequency: 'Monthly'
  },
  atmosphericCO2: {
    id: 'atmosphericCO2',
    name: 'Atmosfärisk CO₂',
    nameShort: 'CO₂',
    unit: 'ppm',
    description: 'Koldioxidkoncentration i atmosfären',
    measurementMethod: 'Direct atmospheric sampling (Mauna Loa, global network)',
    baseline: { year: 1958, value: 315 },
    primarySource: 'NOAA ESRL, Scripps CO2 Program',
    updateFrequency: 'Daily'
  },
  atmosphericMethane: {
    id: 'atmosphericMethane',
    name: 'Atmosfärisk metan',
    nameShort: 'Metan',
    unit: 'ppb',
    description: 'Metankoncentration i atmosfären',
    measurementMethod: 'Direct atmospheric sampling, satellite',
    baseline: { year: 1984, value: 1645 },
    primarySource: 'NOAA ESRL',
    updateFrequency: 'Monthly'
  },
  fossilEnergyShare: {
    id: 'fossilEnergyShare',
    name: 'Fossil energiandel',
    nameShort: 'Fossil',
    unit: '%',
    description: 'Andel fossil energi av total primärenergi',
    measurementMethod: 'National energy statistics aggregation',
    baseline: null,
    primarySource: 'IEA, BP Statistical Review',
    updateFrequency: 'Annual'
  },
  renewableEnergyShare: {
    id: 'renewableEnergyShare',
    name: 'Förnybar energiandel',
    nameShort: 'Förnybart',
    unit: '%',
    description: 'Andel förnybar energi av total primärenergi',
    measurementMethod: 'National energy statistics aggregation',
    baseline: null,
    primarySource: 'IEA, IRENA',
    updateFrequency: 'Annual'
  },
  pm25Global: {
    id: 'pm25Global',
    name: 'Luftföroreningar PM2.5',
    nameShort: 'PM2.5',
    unit: 'μg/m³',
    description: 'Befolkningsviktad global exponering för PM2.5',
    measurementMethod: 'Ground stations, satellite-derived estimates',
    baseline: null,
    primarySource: 'WHO, IHME',
    updateFrequency: 'Annual'
  },
  forestAreaNet: {
    id: 'forestAreaNet',
    name: 'Skogsareal netto',
    nameShort: 'Skog',
    unit: 'miljoner ha',
    description: 'Nettoförändring i global skogsareal',
    measurementMethod: 'Satellite remote sensing, national inventories',
    baseline: null,
    primarySource: 'FAO Global Forest Resources Assessment',
    updateFrequency: 'Annual'
  },
  oceanPH: {
    id: 'oceanPH',
    name: 'Havsförsurning',
    nameShort: 'Ocean pH',
    unit: 'pH',
    description: 'Global genomsnittlig ytvattens-pH',
    measurementMethod: 'Ship-based measurements, buoys, Argo floats',
    baseline: { year: 1850, value: 8.2 },
    primarySource: 'NOAA PMEL, SOCAT',
    updateFrequency: 'Annual'
  },
  extremeWeatherEvents: {
    id: 'extremeWeatherEvents',
    name: 'Extremväderhändelser',
    nameShort: 'Extremväder',
    unit: 'händelser/år',
    description: 'Antal kvalificerade extremväderhändelser (standardiserad definition)',
    measurementMethod: 'Insurance records, weather station data, standardized thresholds',
    baseline: null,
    primarySource: 'EM-DAT, Munich Re NatCatSERVICE',
    updateFrequency: 'Annual'
  }
};

/**
 * Get ordered list of indicators for display
 */
export function getEnvironmentIndicators(): (keyof EnvironmentCoreIndicators)[] {
  return [
    'globalMeanTemperature',
    'atmosphericCO2',
    'atmosphericMethane',
    'seaLevel',
    'arcticIceExtent',
    'greenlandIceMass',
    'antarcticIceMass',
    'fossilEnergyShare',
    'renewableEnergyShare',
    'pm25Global',
    'forestAreaNet',
    'oceanPH',
    'extremeWeatherEvents'
  ];
}

/**
 * Locked warning text - CANNOT be disabled
 */
export const CORRELATION_WARNING = {
  en: "These data show co-movement over time. They do not, by themselves, establish causation.",
  sv: "Dessa data visar samrörelse över tid. De fastställer inte, i sig själva, orsakssamband.",
  de: "Diese Daten zeigen gemeinsame Bewegung über Zeit. Sie belegen, für sich genommen, keine Kausalität.",
  fr: "Ces données montrent une co-évolution dans le temps. Elles n'établissent pas, en elles-mêmes, de causalité.",
  es: "Estos datos muestran co-movimiento a lo largo del tiempo. No establecen, por sí mismos, causalidad."
} as const;

/**
 * Model mode disclaimer - ALWAYS visible when in model mode
 */
export const MODEL_MODE_DISCLAIMER = {
  en: "You are viewing model projections, not observations. Projections depend on assumptions and vary across models.",
  sv: "Du visar modellprojektioner, inte observationer. Projektioner beror på antaganden och varierar mellan modeller.",
  de: "Sie betrachten Modellprojektionen, keine Beobachtungen. Projektionen hängen von Annahmen ab und variieren zwischen Modellen.",
  fr: "Vous consultez des projections de modèles, pas des observations. Les projections dépendent des hypothèses et varient selon les modèles.",
  es: "Está viendo proyecciones de modelos, no observaciones. Las proyecciones dependen de supuestos y varían entre modelos."
} as const;
