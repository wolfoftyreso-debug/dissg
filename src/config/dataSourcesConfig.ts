// ═══════════════════════════════════════════════════════════════════════════
// NATIONELLT LEDNINGSSYSTEM - DATAKÄLLE-SPECIFIKATION
// Komplett API-dokumentation för alla 20 KPI:ers datakällor
// ═══════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════
// TYPDEFINITIONER
// ═══════════════════════════════════════════════════════════════════════════

export type AuthenticationType = 
  | 'none'           // Öppet API utan autentisering
  | 'api_key'        // API-nyckel i header
  | 'oauth2'         // OAuth 2.0 flöde
  | 'basic'          // Basic auth
  | 'certificate';   // Klientcertifikat (myndighet-till-myndighet)

export type DataFormat = 
  | 'json'           // Standard JSON
  | 'json-stat2'     // JSON-stat2 (SCB:s format)
  | 'csv'            // CSV-filer
  | 'xlsx'           // Excel-filer (kräver manuell hantering)
  | 'xml';           // XML/SOAP

export type DataAvailability = 
  | 'public_api'     // Öppet API tillgängligt
  | 'public_download'// Nedladdningsbara filer
  | 'restricted_api' // API med registrering
  | 'scraping'       // Kräver scraping (ej rekommenderat)
  | 'manual';        // Manuell inmatning krävs

export interface DataSourceConfig {
  code: string;
  name: string;
  organization: string;
  baseUrl: string;
  documentationUrl: string;
  availability: DataAvailability;
  endpoints: EndpointConfig[];
  authentication: AuthConfig;
  rateLimit: RateLimitConfig;
  responseFormat: DataFormat;
  updateSchedule: UpdateSchedule;
  reliabilityScore: number;  // 0-100
  notes: string[];
}

export interface EndpointConfig {
  path: string;
  method: 'GET' | 'POST';
  description: string;
  parameters?: Record<string, ParameterConfig>;
  requestBody?: RequestBodyConfig;
  responseMapping: ResponseMapping;
  exampleRequest?: string;
  exampleResponse?: string;
}

export interface ParameterConfig {
  type: 'string' | 'number' | 'date' | 'array';
  required: boolean;
  description: string;
  example?: string;
  allowedValues?: string[];
}

export interface RequestBodyConfig {
  contentType: string;
  schema: Record<string, unknown>;
  example: string;
}

export interface ResponseMapping {
  valuePath: string;
  datePath: string;
  regionPath?: string;
  metadataPath?: string;
  unitPath?: string;
}

export interface AuthConfig {
  type: AuthenticationType;
  headerName?: string;
  tokenUrl?: string;
  registrationUrl?: string;
  contactEmail?: string;
  notes?: string;
}

export interface RateLimitConfig {
  requestsPerMinute: number;
  requestsPerDay: number;
  notes?: string;
}

export interface UpdateSchedule {
  frequency: 'realtime' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  typicalDelay: string;  // T.ex. "2-3 veckor efter period"
  preferredTime?: string;
  retryAttempts: number;
  retryDelayMinutes: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// 1. SCB (Statistiska centralbyrån) - PRIMÄR DATAKÄLLA
// KPI: 1, 2, 3, 4, 5, 9, 16, 18
// ═══════════════════════════════════════════════════════════════════════════
export const SCB_CONFIG: DataSourceConfig = {
  code: 'scb_px',
  name: 'SCB PxWebApi 2.0',
  organization: 'Statistiska centralbyrån',
  baseUrl: 'https://api.scb.se/OV0104/v2beta/sv/ssd',
  documentationUrl: 'https://www.scb.se/en/services/open-data-api/pxwebapi/pxapi-2.0',
  availability: 'public_api',
  endpoints: [
    {
      path: '/BE/BE0101/BE0101I/Dodstal',
      method: 'POST',
      description: 'Dödstal och överdödlighet',
      requestBody: {
        contentType: 'application/json',
        schema: {
          query: [
            { code: 'Region', selection: { filter: 'item', values: ['00'] } },
            { code: 'Alder', selection: { filter: 'item', values: ['tot'] } },
            { code: 'Tid', selection: { filter: 'top', values: ['12'] } }
          ],
          response: { format: 'json-stat2' }
        },
        example: `{
  "query": [
    {"code": "Region", "selection": {"filter": "item", "values": ["00"]}},
    {"code": "Tid", "selection": {"filter": "top", "values": ["24"]}}
  ],
  "response": {"format": "json-stat2"}
}`
      },
      responseMapping: {
        valuePath: '$.value',
        datePath: '$.dimension.Tid.category.label',
        regionPath: '$.dimension.Region.category.label',
      },
    },
    {
      path: '/BE/BE0101/BE0101G/MedelAlder',
      method: 'POST',
      description: 'Medelålder och livslängd',
      responseMapping: {
        valuePath: '$.value',
        datePath: '$.dimension.Tid.category.label',
      },
    },
    {
      path: '/AM/AM0401/AM0401A/NAKUBeijkaraHusar',
      method: 'POST',
      description: 'Arbetskraftsundersökningen (AKU) - sysselsättning',
      responseMapping: {
        valuePath: '$.value',
        datePath: '$.dimension.Tid.category.label',
      },
    },
    {
      path: '/NR/NR0103/NR0103B/NR0103ENS2010T04A',
      method: 'POST',
      description: 'Produktivitet och BNP per arbetad timme',
      responseMapping: {
        valuePath: '$.value',
        datePath: '$.dimension.Tid.category.label',
      },
    },
    {
      path: '/BE/BE0101/BE0101A/BeijFodelseregion',
      method: 'POST',
      description: 'Befolkning efter region, ålder och födelseregion',
      responseMapping: {
        valuePath: '$.value',
        datePath: '$.dimension.Tid.category.label',
        regionPath: '$.dimension.Region.category.label',
      },
    },
  ],
  authentication: {
    type: 'none',
    notes: 'Öppet API utan registrering. Inga API-nycklar krävs.',
  },
  rateLimit: {
    requestsPerMinute: 30,
    requestsPerDay: 10000,
    notes: 'Vid överbelastning returneras HTTP 429. Vänta 60 sekunder.',
  },
  responseFormat: 'json-stat2',
  updateSchedule: {
    frequency: 'monthly',
    typicalDelay: '2-4 veckor efter månadsskifte',
    preferredTime: '06:00',
    retryAttempts: 3,
    retryDelayMinutes: 30,
  },
  reliabilityScore: 98,
  notes: [
    'JSON-stat2 format kräver parsing med jsonstat-suite bibliotek',
    'Använd filter "top" för senaste N perioder',
    'Stöder både månads- och årsdata beroende på tabell',
    'PxWebApi 2.0 lanserades oktober 2025 med förbättrad prestanda',
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
// 2. SOCIALSTYRELSEN - Hälso- och vårddata
// KPI: 1, 2, 12, 13
// ═══════════════════════════════════════════════════════════════════════════
export const SOCIALSTYRELSEN_CONFIG: DataSourceConfig = {
  code: 'sos_statistik',
  name: 'Socialstyrelsens Statistikdatabas API',
  organization: 'Socialstyrelsen',
  baseUrl: 'https://sdb.socialstyrelsen.se/api/v1',
  documentationUrl: 'https://www.socialstyrelsen.se/statistik-och-data/statistik/for-utvecklare/',
  availability: 'public_api',
  endpoints: [
    {
      path: '/dodsorsaker/data',
      method: 'GET',
      description: 'Dödsorsaker efter ICD-10 kategori',
      parameters: {
        ar: { type: 'number', required: true, description: 'År', example: '2024' },
        manad: { type: 'number', required: false, description: 'Månad 1-12' },
        diagnosgrupp: { type: 'string', required: false, description: 'ICD-10 grupp' },
        region: { type: 'string', required: false, description: 'Regionkod' },
      },
      responseMapping: {
        valuePath: '$.data[*].antal',
        datePath: '$.data[*].period',
        regionPath: '$.data[*].region',
      },
    },
    {
      path: '/slutenvard/diagnoser',
      method: 'GET',
      description: 'Slutenvårdsdiagnoser (inkl. missbruk F10-F19)',
      parameters: {
        icd10: { type: 'string', required: true, description: 'ICD-10 kod', example: 'F10-F19' },
        ar: { type: 'number', required: true, description: 'År' },
      },
      responseMapping: {
        valuePath: '$.data[*].vardtillfallen',
        datePath: '$.data[*].period',
      },
    },
    {
      path: '/oppenvard/besok',
      method: 'GET',
      description: 'Öppenvårdsbesök per specialitet',
      parameters: {
        specialitet: { type: 'string', required: false, description: 'Specialitet' },
        region: { type: 'string', required: false, description: 'Region' },
      },
      responseMapping: {
        valuePath: '$.data[*].besok',
        datePath: '$.data[*].period',
      },
    },
  ],
  authentication: {
    type: 'none',
    notes: 'Öppet API. Datafiler finns också för nedladdning.',
  },
  rateLimit: {
    requestsPerMinute: 60,
    requestsPerDay: 5000,
  },
  responseFormat: 'json',
  updateSchedule: {
    frequency: 'monthly',
    typicalDelay: '6-8 veckor efter period (preliminär data)',
    preferredTime: '07:00',
    retryAttempts: 3,
    retryDelayMinutes: 60,
  },
  reliabilityScore: 95,
  notes: [
    'Preliminär data publiceras snabbare men kan revideras',
    'Månadsdata för dödsorsaker släpar 2-3 månader',
    'Slutenvårdsdata har 1-2 månaders fördröjning',
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
// 3. BRÅ (Brottsförebyggande rådet) - Brottsstatistik
// KPI: 10, 15
// ═══════════════════════════════════════════════════════════════════════════
export const BRA_CONFIG: DataSourceConfig = {
  code: 'bra_brott',
  name: 'BRÅ Statistikdatabas',
  organization: 'Brottsförebyggande rådet',
  baseUrl: 'https://statistik.bra.se/solwebb/action',
  documentationUrl: 'https://bra.se/om-bra/om-webbplatsen/data-fran-bra',
  availability: 'public_download',  // INGET PUBLIKT API!
  endpoints: [
    {
      path: '/anmalda/urval/vantapaBotten',
      method: 'POST',
      description: 'Anmälda brott (web-scraping-baserat)',
      parameters: {
        bpiKod: { 
          type: 'string', 
          required: true, 
          description: 'Brottskod',
          allowedValues: ['3', '4', '5', '6', '7', '8', '9'],  // Grova våldsbrott
        },
        fromPeriod: { type: 'string', required: true, description: 'Startperiod', example: '2024M01' },
        tomPeriod: { type: 'string', required: true, description: 'Slutperiod', example: '2025M01' },
        region: { type: 'string', required: false, description: 'Länskod' },
      },
      responseMapping: {
        valuePath: '$.result.rows[*].cells[*].value',
        datePath: '$.result.rows[*].period',
        regionPath: '$.result.rows[*].region',
      },
    },
  ],
  authentication: {
    type: 'none',
    notes: '⚠️ BRÅ har INGET publikt API. Data måste hämtas via nedladdning eller scraping.',
    contactEmail: 'statistik@bra.se',
  },
  rateLimit: {
    requestsPerMinute: 10,
    requestsPerDay: 500,
    notes: 'Begränsa anrop vid scraping för att undvika blockering',
  },
  responseFormat: 'json',
  updateSchedule: {
    frequency: 'monthly',
    typicalDelay: '4-6 veckor efter månad',
    preferredTime: '08:00',
    retryAttempts: 3,
    retryDelayMinutes: 120,
  },
  reliabilityScore: 85,
  notes: [
    '⚠️ KRITISKT: BRÅ saknar publikt API per 2025',
    'Rekommendation: Ladda ner Excel-filer manuellt månadsvis',
    'Alternativ: Använd Kolada för kommunal brottsstatistik',
    'Brottskoder: 3=Mord, 4=Dråp, 5=Grov misshandel, etc.',
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
// 4. POLISEN - Händelser och insatser
// KPI: 10 (komplement till BRÅ)
// ═══════════════════════════════════════════════════════════════════════════
export const POLISEN_CONFIG: DataSourceConfig = {
  code: 'polisen_handelser',
  name: 'Polisens Händelse-API',
  organization: 'Polismyndigheten',
  baseUrl: 'https://polisen.se/api',
  documentationUrl: 'https://polisen.se/om-polisen/om-webbplatsen/oppna-data/api-over-polisens-handelser/',
  availability: 'public_api',
  endpoints: [
    {
      path: '/events',
      method: 'GET',
      description: 'Aktuella polishändelser (senaste 500)',
      parameters: {
        locationName: { type: 'string', required: false, description: 'Platsnamn' },
        type: { type: 'string', required: false, description: 'Händelsetyp' },
      },
      responseMapping: {
        valuePath: '$[*]',
        datePath: '$[*].datetime',
        regionPath: '$[*].location.name',
      },
      exampleResponse: `[
  {
    "id": 123456,
    "datetime": "2025-02-01 14:30",
    "name": "Misshandel",
    "summary": "Kortfattad beskrivning",
    "location": {"name": "Stockholm", "gps": "59.329,18.068"}
  }
]`,
    },
  ],
  authentication: {
    type: 'none',
    notes: 'Öppet API. Endast händelsenotiser, ej detaljerad statistik.',
  },
  rateLimit: {
    requestsPerMinute: 30,
    requestsPerDay: 5000,
  },
  responseFormat: 'json',
  updateSchedule: {
    frequency: 'realtime',
    typicalDelay: '1-4 timmar efter händelse',
    retryAttempts: 5,
    retryDelayMinutes: 5,
  },
  reliabilityScore: 90,
  notes: [
    'Endast händelsenotiser, ej aggregerad statistik',
    'Innehåller 500 senaste händelserna',
    'Uppdateras i realtid men med viss fördröjning',
    'Använd för trendindikation, ej som officiell statistik',
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
// 5. ARBETSFÖRMEDLINGEN - Arbetsmarknadsdata
// KPI: 4, 6, 11
// ═══════════════════════════════════════════════════════════════════════════
export const AF_CONFIG: DataSourceConfig = {
  code: 'af_statistik',
  name: 'Arbetsförmedlingen Öppna Data',
  organization: 'Arbetsförmedlingen',
  baseUrl: 'https://arbetsformedlingen.se/rest',
  documentationUrl: 'https://arbetsformedlingen.se/om-oss/var-verksamhet/oppna-data',
  availability: 'restricted_api',
  endpoints: [
    {
      path: '/statistik/v1/inskrivna',
      method: 'GET',
      description: 'Inskrivna arbetssökande per kategori',
      parameters: {
        period: { type: 'string', required: true, description: 'Period (YYYY-MM)', example: '2025-01' },
        region: { type: 'string', required: false, description: 'Länskod' },
        kategori: { 
          type: 'string', 
          required: false, 
          description: 'Kategori',
          allowedValues: ['oppet_arbetslosa', 'program', 'langtidsarbetslosa'],
        },
      },
      responseMapping: {
        valuePath: '$.data.total',
        datePath: '$.data.period',
        regionPath: '$.data.region',
      },
    },
    {
      path: '/statistik/v1/unga',
      method: 'GET',
      description: 'Unga utan arbete eller utbildning',
      parameters: {
        period: { type: 'string', required: true, description: 'Period' },
        aldersgrupp: { type: 'string', required: false, description: '18-24 eller 18-29' },
      },
      responseMapping: {
        valuePath: '$.data.antal',
        datePath: '$.data.period',
      },
    },
  ],
  authentication: {
    type: 'api_key',
    headerName: 'X-API-Key',
    registrationUrl: 'https://arbetsformedlingen.se/om-oss/var-verksamhet/oppna-data',
    notes: 'Kräver registrering för API-nyckel. Gratis för offentlig sektor.',
  },
  rateLimit: {
    requestsPerMinute: 60,
    requestsPerDay: 10000,
  },
  responseFormat: 'json',
  updateSchedule: {
    frequency: 'weekly',
    typicalDelay: '1-2 veckor',
    preferredTime: '06:30',
    retryAttempts: 3,
    retryDelayMinutes: 30,
  },
  reliabilityScore: 92,
  notes: [
    'API-nyckel krävs - registrera via deras portal',
    'Veckovis uppdatering för grunddata',
    'Månadsstatistik publiceras 2-3 veckor efter period',
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
// 6. FÖRSÄKRINGSKASSAN - Sjukskrivning och ersättningar
// KPI: 3, 9
// ═══════════════════════════════════════════════════════════════════════════
export const FK_CONFIG: DataSourceConfig = {
  code: 'fk_statistik',
  name: 'Försäkringskassans Statistikdatabas',
  organization: 'Försäkringskassan',
  baseUrl: 'https://www.forsakringskassan.se/api',
  documentationUrl: 'https://www.forsakringskassan.se/om-forsakringskassan/oppna-data',
  availability: 'public_download',  // Inget direkt API
  endpoints: [
    {
      path: '/statistik/sjukfall',
      method: 'GET',
      description: 'Pågående sjukfall per kategori',
      parameters: {
        period: { type: 'string', required: true, description: 'Period YYYY-MM' },
        diagnosgrupp: { type: 'string', required: false, description: 'Diagnosgrupp' },
      },
      responseMapping: {
        valuePath: '$.data[*].antal',
        datePath: '$.data[*].period',
      },
    },
    {
      path: '/statistik/sjukpenningtalet',
      method: 'GET',
      description: 'Sjukpenningtal per kommun',
      parameters: {
        period: { type: 'string', required: true, description: 'Period' },
      },
      responseMapping: {
        valuePath: '$.data[*].tal',
        datePath: '$.data[*].period',
        regionPath: '$.data[*].kommun',
      },
    },
  ],
  authentication: {
    type: 'none',
    notes: '⚠️ Ingen öppen API. Data finns som nedladdningsbara Excel-filer.',
  },
  rateLimit: {
    requestsPerMinute: 20,
    requestsPerDay: 1000,
  },
  responseFormat: 'xlsx',
  updateSchedule: {
    frequency: 'monthly',
    typicalDelay: '4-6 veckor',
    preferredTime: '09:00',
    retryAttempts: 3,
    retryDelayMinutes: 60,
  },
  reliabilityScore: 88,
  notes: [
    '⚠️ Inget publikt REST API tillgängligt',
    'Data hämtas via statistikdatabasen eller Excel-nedladdning',
    'Rekommendation: Använd Kolada för aggregerad sjukstatistik',
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
// 7. KOLADA - Kommunal och regional statistik (AGGREGATOR)
// KPI: Stöd för 1, 6, 10, 11, 14 (kommunal nedbrytning)
// ═══════════════════════════════════════════════════════════════════════════
export const KOLADA_CONFIG: DataSourceConfig = {
  code: 'kolada_api',
  name: 'Kolada API v3',
  organization: 'Rådet för främjande av kommunala analyser (RKA)',
  baseUrl: 'https://api.kolada.se/v3',
  documentationUrl: 'https://www.kolada.se/om-oss/api/',
  availability: 'public_api',
  endpoints: [
    {
      path: '/data/kpi/{kpi_id}/municipality/{municipality_id}',
      method: 'GET',
      description: 'Nyckeltal för specifik kommun',
      parameters: {
        kpi_id: { type: 'string', required: true, description: 'Kolada KPI-id', example: 'N00914' },
        municipality_id: { type: 'string', required: true, description: 'Kommunkod', example: '0180' },
        year: { type: 'string', required: false, description: 'År (kommaseparerat)', example: '2023,2024' },
      },
      responseMapping: {
        valuePath: '$.values[*].value',
        datePath: '$.values[*].period',
        regionPath: '$.values[*].municipality',
      },
      exampleRequest: 'GET /v3/data/kpi/N00914/municipality/0180?year=2023,2024',
    },
    {
      path: '/kpi',
      method: 'GET',
      description: 'Lista alla tillgängliga nyckeltal',
      parameters: {
        title: { type: 'string', required: false, description: 'Sök i titel' },
      },
      responseMapping: {
        valuePath: '$.values',
        datePath: '$.values[*].publication_date',
      },
    },
    {
      path: '/municipality',
      method: 'GET',
      description: 'Lista alla kommuner och regioner',
      responseMapping: {
        valuePath: '$.values',
        datePath: 'N/A',
      },
    },
  ],
  authentication: {
    type: 'none',
    notes: 'Öppet API utan registrering. v2 avvecklas 2026-03-31!',
  },
  rateLimit: {
    requestsPerMinute: 100,
    requestsPerDay: 50000,
  },
  responseFormat: 'json',
  updateSchedule: {
    frequency: 'monthly',
    typicalDelay: 'Varierar per nyckeltal, ofta 3-6 månader',
    preferredTime: '05:00',
    retryAttempts: 3,
    retryDelayMinutes: 15,
  },
  reliabilityScore: 96,
  notes: [
    '⚠️ API v2 avvecklas 2026-03-31 - använd v3!',
    'Aggregerar data från SCB, BRÅ, Skolverket m.fl.',
    'Utmärkt för kommunal och regional jämförelse',
    'Över 5000 nyckeltal tillgängliga',
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
// 8. SKOLVERKET - Utbildningsstatistik
// KPI: 14
// ═══════════════════════════════════════════════════════════════════════════
export const SKOLVERKET_CONFIG: DataSourceConfig = {
  code: 'skolverket_api',
  name: 'Skolverket Öppna API',
  organization: 'Skolverket',
  baseUrl: 'https://api.skolverket.se',
  documentationUrl: 'https://www.skolverket.se/om-skolverket/webbplatser-och-tjanster/oppna-data',
  availability: 'public_api',
  endpoints: [
    {
      path: '/planned-educations/v3/school-units',
      method: 'GET',
      description: 'Skolenheter med statistik',
      parameters: {
        municipalityCode: { type: 'string', required: false, description: 'Kommunkod' },
        typeOfSchooling: { type: 'string', required: false, description: 'Skolform' },
      },
      responseMapping: {
        valuePath: '$.body[*]',
        datePath: '$.body[*].statistics.year',
      },
    },
    {
      path: '/syllabus/v1/subjects',
      method: 'GET',
      description: 'Ämnen och kursplaner',
      responseMapping: {
        valuePath: '$.subjects',
        datePath: 'N/A',
      },
    },
  ],
  authentication: {
    type: 'none',
    notes: 'Öppet API. Betygsstatistik finns via SIRIS som nedladdning.',
  },
  rateLimit: {
    requestsPerMinute: 60,
    requestsPerDay: 10000,
  },
  responseFormat: 'json',
  updateSchedule: {
    frequency: 'yearly',
    typicalDelay: '6-9 månader efter läsår',
    preferredTime: '06:00',
    retryAttempts: 3,
    retryDelayMinutes: 60,
  },
  reliabilityScore: 94,
  notes: [
    'API:er för skolenheter, kursplaner, utbildningar',
    'Betygsstatistik: Hämtas via SIRIS eller Kolada',
    'Årlig uppdatering för slutbetyg',
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
// 9. SKR VÄNTETIDER - Vårdköer
// KPI: 13
// ═══════════════════════════════════════════════════════════════════════════
export const SKR_VANTETIDER_CONFIG: DataSourceConfig = {
  code: 'skr_vantetider',
  name: 'Väntetider i vården',
  organization: 'Sveriges Kommuner och Regioner (SKR)',
  baseUrl: 'https://api.vantetider.se',
  documentationUrl: 'https://www.vantetider.se/',
  availability: 'public_api',
  endpoints: [
    {
      path: '/v1/specialistvard',
      method: 'GET',
      description: 'Väntetider till specialistvård',
      parameters: {
        region: { type: 'string', required: false, description: 'Regionkod' },
        specialitet: { type: 'string', required: false, description: 'Specialitet' },
        period: { type: 'string', required: false, description: 'Period YYYY-MM' },
      },
      responseMapping: {
        valuePath: '$.data[*].medianVantetid',
        datePath: '$.data[*].matningstidpunkt',
        regionPath: '$.data[*].region',
      },
    },
    {
      path: '/v1/operation',
      method: 'GET',
      description: 'Väntetider till operation',
      parameters: {
        region: { type: 'string', required: false, description: 'Regionkod' },
      },
      responseMapping: {
        valuePath: '$.data[*].medianDagar',
        datePath: '$.data[*].matningstidpunkt',
        regionPath: '$.data[*].region',
      },
    },
  ],
  authentication: {
    type: 'none',
    notes: 'Öppet API för vårdgarantistatistik.',
  },
  rateLimit: {
    requestsPerMinute: 30,
    requestsPerDay: 3000,
  },
  responseFormat: 'json',
  updateSchedule: {
    frequency: 'monthly',
    typicalDelay: '2-3 veckor',
    preferredTime: '05:00',
    retryAttempts: 3,
    retryDelayMinutes: 60,
  },
  reliabilityScore: 91,
  notes: [
    'Data från regionernas inrapportering',
    'Vårdgarantin: 90 dagar till specialist, 90 dagar till behandling',
    'Finns också öppna datafiler för nedladdning',
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
// 10. SVENSKA KRAFTNÄT - Energibalans
// KPI: 17
// ═══════════════════════════════════════════════════════════════════════════
export const SVK_CONFIG: DataSourceConfig = {
  code: 'svk_mimer',
  name: 'Svenska Kraftnät MIMER',
  organization: 'Svenska Kraftnät',
  baseUrl: 'https://mimer.svk.se/api',
  documentationUrl: 'https://www.svk.se/om-oss/oppna-data/',
  availability: 'public_api',
  endpoints: [
    {
      path: '/controlroom/v1/productionConsumption',
      method: 'GET',
      description: 'Elproduktion och konsumtion i realtid',
      parameters: {
        date: { type: 'date', required: false, description: 'Datum YYYY-MM-DD' },
      },
      responseMapping: {
        valuePath: '$.data.production',
        datePath: '$.data.timestamp',
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
    {
      path: '/capacity/v1/transmissionCapacity',
      method: 'GET',
      description: 'Överföringskapacitet mellan elområden',
      responseMapping: {
        valuePath: '$.data.capacity',
        datePath: '$.data.timestamp',
      },
    },
  ],
  authentication: {
    type: 'none',
    notes: 'Öppet API med realtidsdata.',
  },
  rateLimit: {
    requestsPerMinute: 60,
    requestsPerDay: 10000,
  },
  responseFormat: 'json',
  updateSchedule: {
    frequency: 'realtime',
    typicalDelay: '5-15 minuter',
    retryAttempts: 5,
    retryDelayMinutes: 5,
  },
  reliabilityScore: 97,
  notes: [
    'Realtidsdata med ~15 min fördröjning',
    'Historisk data tillgänglig',
    'Kritisk infrastruktur - hög tillgänglighet',
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
// 11. DOMSTOLSVERKET - Rättssystemets handläggningstider
// KPI: 15
// ═══════════════════════════════════════════════════════════════════════════
export const DOMSTOLSVERKET_CONFIG: DataSourceConfig = {
  code: 'domstol_statistik',
  name: 'Sveriges Domstolar Öppna Data',
  organization: 'Domstolsverket',
  baseUrl: 'https://data.domstol.se/api',
  documentationUrl: 'https://www.domstol.se/om-webbplatsen-och-digitala-kanaler/oppna-data/',
  availability: 'public_download',
  endpoints: [
    {
      path: '/statistics/v1/processingTimes',
      method: 'GET',
      description: 'Handläggningstider per domstol och måltyp',
      parameters: {
        court: { type: 'string', required: false, description: 'Domstolskod' },
        caseType: { type: 'string', required: false, description: 'Måltyp' },
        period: { type: 'string', required: false, description: 'År' },
      },
      responseMapping: {
        valuePath: '$.data[*].medianDays',
        datePath: '$.data[*].period',
      },
    },
    {
      path: '/cases/v1/caselaw',
      method: 'GET',
      description: 'Rättsfallsreferat och domar',
      parameters: {
        court: { type: 'string', required: false, description: 'Domstol' },
        year: { type: 'number', required: false, description: 'År' },
      },
      responseMapping: {
        valuePath: '$.cases',
        datePath: '$.cases[*].date',
      },
    },
  ],
  authentication: {
    type: 'none',
    notes: 'Öppet API för rättspraxis. Statistik finns som nedladdning.',
  },
  rateLimit: {
    requestsPerMinute: 30,
    requestsPerDay: 5000,
  },
  responseFormat: 'json',
  updateSchedule: {
    frequency: 'quarterly',
    typicalDelay: '3-4 månader',
    preferredTime: '08:00',
    retryAttempts: 3,
    retryDelayMinutes: 60,
  },
  reliabilityScore: 89,
  notes: [
    'Rättspraxis finns som API',
    'Statistik: Främst Excel-filer för nedladdning',
    'Löpande statistik uppdateras månadsvis',
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
// 12. EKONOMISTYRNINGSVERKET (ESV) - Statsfinanser
// KPI: 7, 8
// ═══════════════════════════════════════════════════════════════════════════
export const ESV_CONFIG: DataSourceConfig = {
  code: 'esv_statsbudget',
  name: 'ESV Statistik och Data',
  organization: 'Ekonomistyrningsverket',
  baseUrl: 'https://www.esv.se/api',
  documentationUrl: 'https://www.esv.se/statistik-och-data/',
  availability: 'public_download',
  endpoints: [
    {
      path: '/budget/v1/monthlyOutcome',
      method: 'GET',
      description: 'Månadsutfall för statens budget',
      parameters: {
        year: { type: 'number', required: true, description: 'År' },
        month: { type: 'number', required: false, description: 'Månad' },
      },
      responseMapping: {
        valuePath: '$.data.inkomster',
        datePath: '$.data.period',
      },
    },
    {
      path: '/budget/v1/publicSector',
      method: 'GET',
      description: 'Offentliga sektorns nettokostnad',
      parameters: {
        year: { type: 'number', required: true, description: 'År' },
      },
      responseMapping: {
        valuePath: '$.data.nettokostnad',
        datePath: '$.data.period',
      },
    },
  ],
  authentication: {
    type: 'none',
    notes: 'Data finns på Sveriges dataportal. Inga direkta REST API:er.',
  },
  rateLimit: {
    requestsPerMinute: 30,
    requestsPerDay: 2000,
  },
  responseFormat: 'csv',
  updateSchedule: {
    frequency: 'monthly',
    typicalDelay: '3-4 veckor',
    preferredTime: '09:00',
    retryAttempts: 3,
    retryDelayMinutes: 60,
  },
  reliabilityScore: 92,
  notes: [
    'Data via Sveriges dataportal (dataportal.se)',
    'Månadsutfall publiceras löpande',
    'Rekommendation: Ladda ner CSV-filer',
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
// 13. SKATTEVERKET - Skatteintäkter och inbetalningar
// KPI: 7
// ═══════════════════════════════════════════════════════════════════════════
export const SKV_CONFIG: DataSourceConfig = {
  code: 'skv_statistik',
  name: 'Skatteverket Öppna Data',
  organization: 'Skatteverket',
  baseUrl: 'https://skatteverket.se/api',
  documentationUrl: 'https://skatteverket.se/omoss/digitalasamarbeten/omvaraoppnadata',
  availability: 'restricted_api',
  endpoints: [
    {
      path: '/statistics/v1/taxRevenue',
      method: 'GET',
      description: 'Skatteintäkter per månad',
      parameters: {
        year: { type: 'number', required: true, description: 'År' },
        taxType: { type: 'string', required: false, description: 'Skattetyp' },
      },
      responseMapping: {
        valuePath: '$.data.belopp',
        datePath: '$.data.period',
      },
    },
  ],
  authentication: {
    type: 'api_key',
    registrationUrl: 'https://skatteverket.se/omoss/digitalasamarbeten/anslutningochsupportforvaraapierochoppnadata',
    notes: 'API-nyckel krävs. Vissa data är endast för myndigheter.',
  },
  rateLimit: {
    requestsPerMinute: 30,
    requestsPerDay: 5000,
  },
  responseFormat: 'json',
  updateSchedule: {
    frequency: 'monthly',
    typicalDelay: '2-3 veckor',
    preferredTime: '08:00',
    retryAttempts: 3,
    retryDelayMinutes: 60,
  },
  reliabilityScore: 95,
  notes: [
    'Många API:er kräver registrering',
    'Skattestatistik finns på dataportal.se',
    'Realtidsstatistik via månatlig publicering',
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
// 14. LANTMÄTERIET - Bostadsdata
// KPI: 16
// ═══════════════════════════════════════════════════════════════════════════
export const LANTMATERIET_CONFIG: DataSourceConfig = {
  code: 'lm_fastigheter',
  name: 'Lantmäteriet Öppna Data',
  organization: 'Lantmäteriet',
  baseUrl: 'https://api.lantmateriet.se',
  documentationUrl: 'https://www.lantmateriet.se/sv/om-lantmateriet/oppna-data/',
  availability: 'restricted_api',
  endpoints: [
    {
      path: '/property/v1/transactions',
      method: 'GET',
      description: 'Fastighetsöverlåtelser (lagfarter)',
      parameters: {
        municipality: { type: 'string', required: false, description: 'Kommunkod' },
        fromDate: { type: 'date', required: false, description: 'Från datum' },
        toDate: { type: 'date', required: false, description: 'Till datum' },
      },
      responseMapping: {
        valuePath: '$.transactions[*].price',
        datePath: '$.transactions[*].date',
        regionPath: '$.transactions[*].municipality',
      },
    },
  ],
  authentication: {
    type: 'oauth2',
    tokenUrl: 'https://api.lantmateriet.se/oauth/token',
    registrationUrl: 'https://www.lantmateriet.se/sv/om-lantmateriet/Kontakta-oss/',
    notes: 'Kräver avtal och API-nyckel. Avgift för vissa tjänster.',
  },
  rateLimit: {
    requestsPerMinute: 60,
    requestsPerDay: 10000,
  },
  responseFormat: 'json',
  updateSchedule: {
    frequency: 'weekly',
    typicalDelay: '1-2 veckor',
    preferredTime: '07:00',
    retryAttempts: 3,
    retryDelayMinutes: 30,
  },
  reliabilityScore: 94,
  notes: [
    'Kräver avtal för API-åtkomst',
    'Avgifter för vissa dataset',
    'Alternativ: Mäklarstatistik (betaldata)',
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
// 15-17. INTERNA BERÄKNADE INDIKATORER
// KPI: 18 (Regional divergens), 19 (Policy-utfall-gap), 20 (Systemstress)
// ═══════════════════════════════════════════════════════════════════════════
export const INTERNAL_CALCULATED_CONFIG: DataSourceConfig = {
  code: 'internal_calculated',
  name: 'Interna beräknade indikatorer',
  organization: 'Nationellt Ledningssystem',
  baseUrl: 'internal://calculations',
  documentationUrl: 'N/A',
  availability: 'public_api',
  endpoints: [
    {
      path: '/divergence/regional',
      method: 'GET',
      description: 'Regional divergensindex (beräknat från KPI 1-17)',
      responseMapping: {
        valuePath: '$.index',
        datePath: '$.calculatedAt',
      },
    },
    {
      path: '/policy/effectiveness',
      method: 'GET',
      description: 'Policy-utfall-gap (beslut vs faktiskt utfall)',
      responseMapping: {
        valuePath: '$.gap',
        datePath: '$.period',
      },
    },
    {
      path: '/stress/composite',
      method: 'GET',
      description: 'Systemstress-index (viktad komposit)',
      responseMapping: {
        valuePath: '$.stressIndex',
        datePath: '$.calculatedAt',
      },
    },
  ],
  authentication: {
    type: 'none',
    notes: 'Interna beräkningar baserade på övriga KPI:er.',
  },
  rateLimit: {
    requestsPerMinute: 100,
    requestsPerDay: 50000,
  },
  responseFormat: 'json',
  updateSchedule: {
    frequency: 'daily',
    typicalDelay: 'Beräknas efter övriga uppdateringar',
    preferredTime: '23:00',
    retryAttempts: 5,
    retryDelayMinutes: 10,
  },
  reliabilityScore: 99,
  notes: [
    'Beräknas internt från övriga KPI:er',
    'Formler definieras i calculated_indicators-tabellen',
    'Uppdateras automatiskt när källdata uppdateras',
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
// SAMMANSTÄLLNING - ALLA DATAKÄLLOR
// ═══════════════════════════════════════════════════════════════════════════

export const ALL_DATA_SOURCES: Record<string, DataSourceConfig> = {
  scb_px: SCB_CONFIG,
  sos_statistik: SOCIALSTYRELSEN_CONFIG,
  bra_brott: BRA_CONFIG,
  polisen_handelser: POLISEN_CONFIG,
  af_statistik: AF_CONFIG,
  fk_statistik: FK_CONFIG,
  kolada_api: KOLADA_CONFIG,
  skolverket_api: SKOLVERKET_CONFIG,
  skr_vantetider: SKR_VANTETIDER_CONFIG,
  svk_mimer: SVK_CONFIG,
  domstol_statistik: DOMSTOLSVERKET_CONFIG,
  esv_statsbudget: ESV_CONFIG,
  skv_statistik: SKV_CONFIG,
  lm_fastigheter: LANTMATERIET_CONFIG,
  internal_calculated: INTERNAL_CALCULATED_CONFIG,
};

// ═══════════════════════════════════════════════════════════════════════════
// KPI → DATAKÄLLA MAPPNING
// ═══════════════════════════════════════════════════════════════════════════

export interface KPIDataSourceMapping {
  kpiIndex: number;
  kpiName: string;
  primarySource: string;
  secondarySources: string[];
  notes: string;
}

export const KPI_DATA_SOURCE_MAPPINGS: KPIDataSourceMapping[] = [
  {
    kpiIndex: 1,
    kpiName: 'Förväntad livslängd',
    primarySource: 'scb_px',
    secondarySources: ['sos_statistik'],
    notes: 'SCB: BE0101, Socialstyrelsen för dödsorsaker',
  },
  {
    kpiIndex: 2,
    kpiName: 'Överdödlighet',
    primarySource: 'sos_statistik',
    secondarySources: ['scb_px'],
    notes: 'Socialstyrelsen primär, SCB för historik',
  },
  {
    kpiIndex: 3,
    kpiName: 'Arbetsför befolkning',
    primarySource: 'scb_px',
    secondarySources: ['fk_statistik'],
    notes: 'SCB befolkning + FK sjukskrivning',
  },
  {
    kpiIndex: 4,
    kpiName: 'Sysselsättningsgrad',
    primarySource: 'scb_px',
    secondarySources: ['af_statistik'],
    notes: 'SCB AKU primär, AF för detaljer',
  },
  {
    kpiIndex: 5,
    kpiName: 'Produktivitet per arbetad timme',
    primarySource: 'scb_px',
    secondarySources: [],
    notes: 'SCB Nationalräkenskaper NR0103',
  },
  {
    kpiIndex: 6,
    kpiName: 'Långvarigt utanförskap',
    primarySource: 'af_statistik',
    secondarySources: ['kolada_api'],
    notes: 'AF för arbetslösa, Kolada för kommundata',
  },
  {
    kpiIndex: 7,
    kpiName: 'Skattebas per capita',
    primarySource: 'skv_statistik',
    secondarySources: ['esv_statsbudget', 'scb_px'],
    notes: 'Skatteverket + ESV för statsfinans',
  },
  {
    kpiIndex: 8,
    kpiName: 'Offentlig nettokostnad',
    primarySource: 'esv_statsbudget',
    secondarySources: ['skr_vantetider'],
    notes: 'ESV budget, SKR för vårdkostnader',
  },
  {
    kpiIndex: 9,
    kpiName: 'Försörjningskvot',
    primarySource: 'scb_px',
    secondarySources: ['fk_statistik'],
    notes: 'SCB befolkning efter ålder',
  },
  {
    kpiIndex: 10,
    kpiName: 'Grova våldsbrott',
    primarySource: 'bra_brott',
    secondarySources: ['polisen_handelser', 'kolada_api'],
    notes: '⚠️ BRÅ saknar API - använd nedladdning',
  },
  {
    kpiIndex: 11,
    kpiName: 'Unga män utanför system',
    primarySource: 'af_statistik',
    secondarySources: ['scb_px', 'kolada_api'],
    notes: 'AF + SCB befolkning för åldersgrupp',
  },
  {
    kpiIndex: 12,
    kpiName: 'Missbruksskador',
    primarySource: 'sos_statistik',
    secondarySources: [],
    notes: 'Socialstyrelsen slutenvård ICD F10-F19',
  },
  {
    kpiIndex: 13,
    kpiName: 'Vårdkö',
    primarySource: 'skr_vantetider',
    secondarySources: [],
    notes: 'SKR Väntetider i vården',
  },
  {
    kpiIndex: 14,
    kpiName: 'Skolutfall',
    primarySource: 'skolverket_api',
    secondarySources: ['kolada_api'],
    notes: 'Skolverket SIRIS, Kolada för kommuner',
  },
  {
    kpiIndex: 15,
    kpiName: 'Rättssystemets genomloppstid',
    primarySource: 'domstol_statistik',
    secondarySources: ['bra_brott'],
    notes: 'Domstolsverket handläggningstider',
  },
  {
    kpiIndex: 16,
    kpiName: 'Bostadsomsättning',
    primarySource: 'lm_fastigheter',
    secondarySources: ['scb_px'],
    notes: 'Lantmäteriet lagfarter (kräver avtal)',
  },
  {
    kpiIndex: 17,
    kpiName: 'Energibalans',
    primarySource: 'svk_mimer',
    secondarySources: [],
    notes: 'Svenska Kraftnät realtidsdata',
  },
  {
    kpiIndex: 18,
    kpiName: 'Regional divergens',
    primarySource: 'internal_calculated',
    secondarySources: ['kolada_api'],
    notes: 'Beräknat index från regionala KPI:er',
  },
  {
    kpiIndex: 19,
    kpiName: 'Policy-utfall-gap',
    primarySource: 'internal_calculated',
    secondarySources: [],
    notes: 'Beräknat från policy_decisions + KPI:er',
  },
  {
    kpiIndex: 20,
    kpiName: 'Systemstress-index',
    primarySource: 'internal_calculated',
    secondarySources: [],
    notes: 'Viktad komposit av varningsindikatorer',
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// AUTENTISERINGSSTRATEGI - SAMMANFATTNING
// ═══════════════════════════════════════════════════════════════════════════

export interface AuthenticationSummary {
  source: string;
  authType: AuthenticationType;
  requiresRegistration: boolean;
  requiresContract: boolean;
  secretName: string | null;
  notes: string;
}

export const AUTHENTICATION_SUMMARY: AuthenticationSummary[] = [
  { source: 'SCB', authType: 'none', requiresRegistration: false, requiresContract: false, secretName: null, notes: 'Helt öppet' },
  { source: 'Socialstyrelsen', authType: 'none', requiresRegistration: false, requiresContract: false, secretName: null, notes: 'Helt öppet' },
  { source: 'BRÅ', authType: 'none', requiresRegistration: false, requiresContract: false, secretName: null, notes: 'Inget API - manuell' },
  { source: 'Polisen', authType: 'none', requiresRegistration: false, requiresContract: false, secretName: null, notes: 'Helt öppet' },
  { source: 'Arbetsförmedlingen', authType: 'api_key', requiresRegistration: true, requiresContract: false, secretName: 'AF_API_KEY', notes: 'Gratis registrering' },
  { source: 'Försäkringskassan', authType: 'none', requiresRegistration: false, requiresContract: false, secretName: null, notes: 'Inget API - nedladdning' },
  { source: 'Kolada', authType: 'none', requiresRegistration: false, requiresContract: false, secretName: null, notes: 'Helt öppet' },
  { source: 'Skolverket', authType: 'none', requiresRegistration: false, requiresContract: false, secretName: null, notes: 'Helt öppet' },
  { source: 'SKR Väntetider', authType: 'none', requiresRegistration: false, requiresContract: false, secretName: null, notes: 'Helt öppet' },
  { source: 'Svenska Kraftnät', authType: 'none', requiresRegistration: false, requiresContract: false, secretName: null, notes: 'Helt öppet' },
  { source: 'Domstolsverket', authType: 'none', requiresRegistration: false, requiresContract: false, secretName: null, notes: 'Rättspraxis öppen' },
  { source: 'ESV', authType: 'none', requiresRegistration: false, requiresContract: false, secretName: null, notes: 'Dataportal.se' },
  { source: 'Skatteverket', authType: 'api_key', requiresRegistration: true, requiresContract: false, secretName: 'SKV_API_KEY', notes: 'Registrering krävs' },
  { source: 'Lantmäteriet', authType: 'oauth2', requiresRegistration: true, requiresContract: true, secretName: 'LM_CLIENT_ID,LM_CLIENT_SECRET', notes: 'Avtal + avgift' },
];

// ═══════════════════════════════════════════════════════════════════════════
// IMPLEMENTATION PRIORITY
// ═══════════════════════════════════════════════════════════════════════════

export interface ImplementationPriority {
  priority: 1 | 2 | 3;
  sources: string[];
  description: string;
  estimatedEffort: string;
}

export const IMPLEMENTATION_PRIORITIES: ImplementationPriority[] = [
  {
    priority: 1,
    sources: ['scb_px', 'kolada_api', 'svk_mimer', 'polisen_handelser'],
    description: 'Öppna API:er utan autentisering - implementera först',
    estimatedEffort: '1-2 dagar per källa',
  },
  {
    priority: 2,
    sources: ['sos_statistik', 'skolverket_api', 'skr_vantetider', 'domstol_statistik'],
    description: 'Öppna API:er med viss komplexitet',
    estimatedEffort: '2-3 dagar per källa',
  },
  {
    priority: 3,
    sources: ['af_statistik', 'skv_statistik', 'lm_fastigheter', 'bra_brott', 'fk_statistik', 'esv_statsbudget'],
    description: 'Kräver registrering, avtal, eller manuell hantering',
    estimatedEffort: '3-5 dagar per källa (inkl. avtal)',
  },
];
