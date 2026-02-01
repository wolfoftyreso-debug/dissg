// API-konfiguration för svenska myndighets-API:er
// Dokumenterad struktur för ingest-lagret

export interface DataSourceConfig {
  code: string;
  name: string;
  baseUrl: string;
  endpoints: EndpointConfig[];
  authentication: AuthConfig | null;
  rateLimit: RateLimitConfig;
  responseFormat: 'json' | 'json-stat2' | 'csv' | 'xml';
  updateSchedule: UpdateSchedule;
}

export interface EndpointConfig {
  path: string;
  method: 'GET' | 'POST';
  description: string;
  parameters?: Record<string, ParameterConfig>;
  responseMapping: ResponseMapping;
}

export interface ParameterConfig {
  type: 'string' | 'number' | 'date' | 'array';
  required: boolean;
  description: string;
  example?: string;
}

export interface ResponseMapping {
  valuePath: string;
  datePath: string;
  regionPath?: string;
  metadataPath?: string;
}

export interface AuthConfig {
  type: 'api_key' | 'oauth2' | 'basic';
  headerName?: string;
  tokenUrl?: string;
}

export interface RateLimitConfig {
  requestsPerMinute: number;
  requestsPerDay: number;
}

export interface UpdateSchedule {
  frequency: 'realtime' | 'daily' | 'weekly' | 'monthly' | 'quarterly';
  preferredTime?: string; // HH:MM UTC
  retryAttempts: number;
  retryDelayMinutes: number;
}

// ═══════════════════════════════════════════════════════════════
// SCB (Statistiska centralbyrån) - Sveriges huvudsakliga statistikkälla
// ═══════════════════════════════════════════════════════════════
export const SCB_CONFIG: DataSourceConfig = {
  code: 'scb_px',
  name: 'SCB PX-Web API',
  baseUrl: 'https://api.scb.se/OV0104/v1/doris/sv/ssd',
  endpoints: [
    {
      path: '/BE/BE0101/BE0101A/BesijkaraFodelseregion',
      method: 'POST',
      description: 'Befolkningsstatistik',
      parameters: {
        query: { type: 'array', required: true, description: 'PX-Web query object' },
      },
      responseMapping: {
        valuePath: '$.value',
        datePath: '$.dimension.Tid.category.label',
        regionPath: '$.dimension.Region.category.label',
      },
    },
    {
      path: '/AM/AM0401/AM0401A/NAKUBeijkaraHusar',
      method: 'POST',
      description: 'Arbetskraftsundersökningen (AKU)',
      parameters: {
        query: { type: 'array', required: true, description: 'AKU query' },
      },
      responseMapping: {
        valuePath: '$.value',
        datePath: '$.dimension.Tid.category.label',
      },
    },
  ],
  authentication: null, // Öppet API
  rateLimit: {
    requestsPerMinute: 30,
    requestsPerDay: 10000,
  },
  responseFormat: 'json-stat2',
  updateSchedule: {
    frequency: 'monthly',
    preferredTime: '06:00',
    retryAttempts: 3,
    retryDelayMinutes: 30,
  },
};

// ═══════════════════════════════════════════════════════════════
// SOCIALSTYRELSEN - Hälso- och vårddata
// ═══════════════════════════════════════════════════════════════
export const SOCIALSTYRELSEN_CONFIG: DataSourceConfig = {
  code: 'sos_dodsorsaker',
  name: 'Socialstyrelsen Statistikdatabas',
  baseUrl: 'https://sdb.socialstyrelsen.se/api',
  endpoints: [
    {
      path: '/dodsorsaker/v1/data',
      method: 'GET',
      description: 'Dödsorsaker per vecka/månad',
      parameters: {
        year: { type: 'number', required: true, description: 'År', example: '2025' },
        week: { type: 'number', required: false, description: 'Vecka (1-52)' },
        region: { type: 'string', required: false, description: 'Regionkod' },
      },
      responseMapping: {
        valuePath: '$.data[*].deaths',
        datePath: '$.data[*].period',
        regionPath: '$.data[*].region',
      },
    },
    {
      path: '/slutenvard/v1/diagnoses',
      method: 'GET',
      description: 'Slutenvårdsdiagnoser (missbruk etc.)',
      parameters: {
        icd10: { type: 'string', required: true, description: 'ICD-10 kod', example: 'F10-F19' },
      },
      responseMapping: {
        valuePath: '$.data[*].count',
        datePath: '$.data[*].period',
      },
    },
  ],
  authentication: null,
  rateLimit: {
    requestsPerMinute: 60,
    requestsPerDay: 5000,
  },
  responseFormat: 'json',
  updateSchedule: {
    frequency: 'weekly',
    preferredTime: '07:00',
    retryAttempts: 3,
    retryDelayMinutes: 60,
  },
};

// ═══════════════════════════════════════════════════════════════
// BRÅ - Brottsstatistik
// ═══════════════════════════════════════════════════════════════
export const BRA_CONFIG: DataSourceConfig = {
  code: 'bra_brott',
  name: 'BRÅ Statistikdatabas',
  baseUrl: 'https://statistik.bra.se/solwebb/action',
  endpoints: [
    {
      path: '/anmalda/urval/vantapaBotten',
      method: 'POST',
      description: 'Anmälda brott',
      parameters: {
        bpiKod: { type: 'string', required: true, description: 'Brottskod' },
        fromPeriod: { type: 'string', required: true, description: 'Startperiod', example: '2024M01' },
        tomPeriod: { type: 'string', required: true, description: 'Slutperiod', example: '2025M01' },
      },
      responseMapping: {
        valuePath: '$.result.rows[*].cells[*].value',
        datePath: '$.result.rows[*].period',
        regionPath: '$.result.rows[*].region',
      },
    },
  ],
  authentication: null,
  rateLimit: {
    requestsPerMinute: 20,
    requestsPerDay: 2000,
  },
  responseFormat: 'json',
  updateSchedule: {
    frequency: 'monthly',
    preferredTime: '08:00',
    retryAttempts: 3,
    retryDelayMinutes: 120,
  },
};

// ═══════════════════════════════════════════════════════════════
// SKR Väntetider - Vårdköer
// ═══════════════════════════════════════════════════════════════
export const SKR_VANTETIDER_CONFIG: DataSourceConfig = {
  code: 'skr_vantetider',
  name: 'SKR Väntetider i vården',
  baseUrl: 'https://vantetider.se/api',
  endpoints: [
    {
      path: '/v1/operation',
      method: 'GET',
      description: 'Väntetider till operation',
      parameters: {
        region: { type: 'string', required: false, description: 'Regionkod' },
        specialty: { type: 'string', required: false, description: 'Specialitet' },
      },
      responseMapping: {
        valuePath: '$.data[*].medianDays',
        datePath: '$.data[*].measurementDate',
        regionPath: '$.data[*].regionCode',
      },
    },
  ],
  authentication: null,
  rateLimit: {
    requestsPerMinute: 30,
    requestsPerDay: 3000,
  },
  responseFormat: 'json',
  updateSchedule: {
    frequency: 'weekly',
    preferredTime: '05:00',
    retryAttempts: 3,
    retryDelayMinutes: 60,
  },
};

// ═══════════════════════════════════════════════════════════════
// Svenska Kraftnät - Energidata
// ═══════════════════════════════════════════════════════════════
export const SVK_CONFIG: DataSourceConfig = {
  code: 'svk_energi',
  name: 'Svenska Kraftnät MIMER',
  baseUrl: 'https://mimer.svk.se/api',
  endpoints: [
    {
      path: '/production/v1/hourly',
      method: 'GET',
      description: 'Elproduktion per timme',
      parameters: {
        date: { type: 'date', required: true, description: 'Datum' },
      },
      responseMapping: {
        valuePath: '$.data[*].production_mw',
        datePath: '$.data[*].timestamp',
      },
    },
    {
      path: '/balance/v1/daily',
      method: 'GET',
      description: 'Daglig energibalans',
      parameters: {
        from: { type: 'date', required: true, description: 'Startdatum' },
        to: { type: 'date', required: true, description: 'Slutdatum' },
      },
      responseMapping: {
        valuePath: '$.data[*].balance_gwh',
        datePath: '$.data[*].date',
      },
    },
  ],
  authentication: null,
  rateLimit: {
    requestsPerMinute: 60,
    requestsPerDay: 10000,
  },
  responseFormat: 'json',
  updateSchedule: {
    frequency: 'daily',
    preferredTime: '04:00',
    retryAttempts: 5,
    retryDelayMinutes: 15,
  },
};

// ═══════════════════════════════════════════════════════════════
// Arbetsförmedlingen - Arbetsmarknadsdata
// ═══════════════════════════════════════════════════════════════
export const AF_CONFIG: DataSourceConfig = {
  code: 'af_statistik',
  name: 'Arbetsförmedlingen Statistik',
  baseUrl: 'https://arbetsformedlingen.se/rest',
  endpoints: [
    {
      path: '/statistik/v1/inskrivna',
      method: 'GET',
      description: 'Inskrivna arbetssökande',
      parameters: {
        period: { type: 'string', required: true, description: 'Period (YYYY-MM)' },
        region: { type: 'string', required: false, description: 'Länskod' },
      },
      responseMapping: {
        valuePath: '$.data.total',
        datePath: '$.data.period',
        regionPath: '$.data.region',
      },
    },
    {
      path: '/statistik/v1/langtidsarbetsloshet',
      method: 'GET',
      description: 'Långtidsarbetslöshet (>12 mån)',
      parameters: {
        period: { type: 'string', required: true, description: 'Period' },
      },
      responseMapping: {
        valuePath: '$.data.longTermUnemployed',
        datePath: '$.data.period',
      },
    },
  ],
  authentication: null,
  rateLimit: {
    requestsPerMinute: 30,
    requestsPerDay: 5000,
  },
  responseFormat: 'json',
  updateSchedule: {
    frequency: 'weekly',
    preferredTime: '06:30',
    retryAttempts: 3,
    retryDelayMinutes: 30,
  },
};

// ═══════════════════════════════════════════════════════════════
// Alla konfigurationer exporterade
// ═══════════════════════════════════════════════════════════════
export const DATA_SOURCE_CONFIGS: Record<string, DataSourceConfig> = {
  scb_px: SCB_CONFIG,
  sos_dodsorsaker: SOCIALSTYRELSEN_CONFIG,
  bra_brott: BRA_CONFIG,
  skr_vantetider: SKR_VANTETIDER_CONFIG,
  svk_energi: SVK_CONFIG,
  af_statistik: AF_CONFIG,
};

// KPI till datakälla-mappning
export const KPI_SOURCE_MAPPING: Record<number, string[]> = {
  1: ['scb_px', 'sos_dodsorsaker'],           // Förväntad livslängd
  2: ['sos_dodsorsaker', 'scb_px'],           // Överdödlighet
  3: ['scb_px', 'fk_sjukskrivning'],          // Arbetsför befolkning
  4: ['scb_aku'],                              // Sysselsättningsgrad
  5: ['scb_px'],                               // Produktivitet
  6: ['af_statistik'],                         // Långvarigt utanförskap
  7: ['skv_inbetalningar', 'scb_px'],         // Skattebas
  8: ['esv_offentlig', 'skr_vantetider'],     // Offentlig nettokostnad
  9: ['scb_px', 'fk_sjukskrivning'],          // Försörjningskvot
  10: ['bra_brott', 'polisen_statistik'],     // Grova våldsbrott
  11: ['scb_px', 'af_statistik'],             // Unga män utanför system
  12: ['sos_slutenvard', 'sos_dodsorsaker'],  // Missbruksskador
  13: ['skr_vantetider'],                      // Vårdkö
  14: ['skolverket_betyg'],                    // Skolutfall
  15: ['domstolsverket', 'bra_brott'],        // Rättssystemets genomloppstid
  16: ['lantmateriet_lagfarter', 'scb_px'],   // Bostadsomsättning
  17: ['svk_energi'],                          // Energibalans
  18: ['internal_divergence'],                 // Regional divergens
  19: ['internal_policy'],                     // Policy-utfall-gap
  20: ['internal_stress'],                     // Systemstress
};
