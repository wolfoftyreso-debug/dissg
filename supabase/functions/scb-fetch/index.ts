import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// ═══════════════════════════════════════════════════════════════
// SCB PxWebApi 2.0 Integration
// Dokumentation: https://www.scb.se/en/services/open-data-api/api-for-the-statistical-database/
// ═══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════
// PxWeb API - Officiella endpoints
// Dokumentation: https://www.scb.se/en/services/open-data-api/pxwebapi/pxapi-2.0/
// ═══════════════════════════════════════════════════════════════

// API 2.0 produktions-URL (lanserad oktober 2025)
const SCB_API_V2_BASE = "https://statistikdatabasen.scb.se/api/v2/sv/ssd";
// Fallback beta-URL
const SCB_API_V2_BETA = "https://api.scb.se/OV0104/v2beta/api/v2/sv/ssd";
// Legacy API 1.0 (stöder fortfarande POST med json)
const SCB_API_V1_BASE = "https://api.scb.se/OV0104/v1/doris/sv/ssd";

// Länskoder för regional breakdown
const REGION_CODES: Record<string, string> = {
  "00": "Sverige",
  "01": "Stockholms län",
  "03": "Uppsala län",
  "04": "Södermanlands län",
  "05": "Östergötlands län",
  "06": "Jönköpings län",
  "07": "Kronobergs län",
  "08": "Kalmar län",
  "09": "Gotlands län",
  "10": "Blekinge län",
  "12": "Skåne län",
  "13": "Hallands län",
  "14": "Västra Götalands län",
  "17": "Värmlands län",
  "18": "Örebro län",
  "19": "Västmanlands län",
  "20": "Dalarnas län",
  "21": "Gävleborgs län",
  "22": "Västernorrlands län",
  "23": "Jämtlands län",
  "24": "Västerbottens län",
  "25": "Norrbottens län",
};

interface TableConfig {
  path: string;
  description: string;
  kpiCode: string;
  dataSourceCode: string;
  apiVersion: '1.0' | '2.0';
  responseFormat?: 'json' | 'json-stat2';  // Default: 'json' för 1.0, 'json-stat2' för 2.0
  query: {
    query: Array<{ code: string; selection: { filter: string; values: string[] } }>;
    response: { format: string };
  };
  valueMultiplier?: number;
  unit?: string;
  granularity?: string;
  aggregation?: 'sum' | 'average' | 'latest';
  isInverted?: boolean;
  includeRegions?: boolean;
}

// ═══════════════════════════════════════════════════════════════
// TABELLKONFIGURATIONER - Mappade till kpi_definitions.code
// ═══════════════════════════════════════════════════════════════

const TABLE_CONFIGS: Record<string, TableConfig> = {
  // ─────────────────────────────────────────────────────────────
  // KPI 1: FÖRVÄNTAD LIVSLÄNGD
  // ─────────────────────────────────────────────────────────────
  life_expectancy: {
    path: "BE/BE0101/BE0101I/Medellivsl",
    description: "Återstående medellivslängd vid födelsen",
    kpiCode: "life_expectancy",
    dataSourceCode: "scb_px",
    apiVersion: '1.0',
    query: {
      query: [
        { code: "Region", selection: { filter: "item", values: ["00"] } },
        { code: "Kon", selection: { filter: "item", values: ["1", "2"] } },
        { code: "ContentsCode", selection: { filter: "item", values: ["000000NH"] } },
        { code: "Tid", selection: { filter: "top", values: ["10"] } },
      ],
      response: { format: "json" }
    },
    unit: "år",
    aggregation: 'average',
    granularity: "yearly",
  },

  // ─────────────────────────────────────────────────────────────
  // KPI 2: ÖVERDÖDLIGHET - Döda per månad
  // ─────────────────────────────────────────────────────────────
  excess_mortality_monthly: {
    path: "BE/BE0101/BE0101G/ManadBefStat",
    description: "Antal döda per månad för överdödlighetsberäkning",
    kpiCode: "excess_mortality",
    dataSourceCode: "scb_px",
    apiVersion: '1.0',
    query: {
      query: [
        { code: "Kon", selection: { filter: "item", values: ["1+2"] } },
        { code: "ContentsCode", selection: { filter: "item", values: ["000001S4"] } },
        { code: "Tid", selection: { filter: "top", values: ["36"] } }, // 3 år
      ],
      response: { format: "json" }
    },
    unit: "antal",
    granularity: "monthly",
    aggregation: 'sum',
    isInverted: true,
  },

  // ─────────────────────────────────────────────────────────────
  // KPI 2b: DÖDSORSAKER - Från dödsorsaksregistret
  // ─────────────────────────────────────────────────────────────
  death_causes: {
    path: "HS/HS0301/HS0301C/DodsijorsIntK",
    description: "Dödsorsaker per diagnoskategori (ICD-10)",
    kpiCode: "excess_mortality",
    dataSourceCode: "scb_px",
    apiVersion: '1.0',
    query: {
      query: [
        { code: "Diagnos", selection: { filter: "item", values: [
          "A00-Y98",  // Samtliga dödsorsaker
          "I00-I99",  // Cirkulationsorganens sjukdomar
          "C00-D48",  // Tumörer
          "J00-J99",  // Andningsorganens sjukdomar
          "V01-Y89",  // Yttre orsaker
        ] } },
        { code: "Kon", selection: { filter: "item", values: ["1+2"] } },
        { code: "ContentsCode", selection: { filter: "item", values: ["HS0301A3"] } },
        { code: "Tid", selection: { filter: "top", values: ["5"] } },
      ],
      response: { format: "json" }
    },
    unit: "antal döda",
    granularity: "yearly",
    aggregation: 'sum',
    isInverted: true,
  },

  // ─────────────────────────────────────────────────────────────
  // KPI 3: ARBETSFÖR BEFOLKNING (18-64 år)
  // ─────────────────────────────────────────────────────────────
  working_age_population: {
    path: "BE/BE0101/BE0101A/BefolkningNy",
    description: "Befolkning i arbetsför ålder 18-64 år",
    kpiCode: "working_age_functional",
    dataSourceCode: "scb_px",
    apiVersion: '1.0',
    query: {
      query: [
        { code: "Region", selection: { filter: "item", values: ["00"] } },
        { code: "Alder", selection: { filter: "agg:Ålder5år", values: ["20-24", "25-29", "30-34", "35-39", "40-44", "45-49", "50-54", "55-59", "60-64"] } },
        { code: "Kon", selection: { filter: "item", values: ["1", "2"] } },
        { code: "ContentsCode", selection: { filter: "item", values: ["BE0101N1"] } },
        { code: "Tid", selection: { filter: "top", values: ["5"] } },
      ],
      response: { format: "json" }
    },
    valueMultiplier: 0.000001,
    unit: "miljoner",
    granularity: "yearly",
    aggregation: 'sum',
  },

  // ─────────────────────────────────────────────────────────────
  // KPI 4: SYSSELSÄTTNINGSGRAD 20-64 år
  // ─────────────────────────────────────────────────────────────
  employment_rate: {
    path: "AM/AM0401/AM0401A/NAKUBefAkeLArb",
    description: "Sysselsättningsgrad 20-64 år",
    kpiCode: "employment_rate_net",
    dataSourceCode: "scb_px",
    apiVersion: '1.0',
    query: {
      query: [
        { code: "Alder", selection: { filter: "item", values: ["20-64"] } },
        { code: "Kon", selection: { filter: "item", values: ["1+2"] } },
        { code: "ContentsCode", selection: { filter: "item", values: ["000000CK"] } },
        { code: "Tid", selection: { filter: "top", values: ["24"] } },
      ],
      response: { format: "json" }
    },
    unit: "%",
    granularity: "monthly",
    aggregation: 'latest',
  },

  // ─────────────────────────────────────────────────────────────
  // KPI 5: PRODUKTIVITET PER ARBETAD TIMME
  // ─────────────────────────────────────────────────────────────
  productivity: {
    path: "NR/NR0103/NR0103B/NR0103ENS2010T04Kv",
    description: "BNP per arbetad timme, fasta priser",
    kpiCode: "productivity_per_hour",
    dataSourceCode: "scb_px",
    apiVersion: '1.0',
    query: {
      query: [
        { code: "SNI2007", selection: { filter: "item", values: ["TOT"] } },
        { code: "ContentsCode", selection: { filter: "item", values: ["0000003X"] } },
        { code: "Tid", selection: { filter: "top", values: ["20"] } },
      ],
      response: { format: "json" }
    },
    unit: "index (2020=100)",
    granularity: "quarterly",
    aggregation: 'latest',
  },

  // ─────────────────────────────────────────────────────────────
  // KPI 6: LÅNGVARIGT UTANFÖRSKAP (arbetslöshet som proxy)
  // ─────────────────────────────────────────────────────────────
  unemployment: {
    path: "AM/AM0401/AM0401A/NAKUBefAkeLArb",
    description: "Arbetslöshet 15-74 år",
    kpiCode: "long_term_exclusion",
    dataSourceCode: "scb_px",
    apiVersion: '1.0',
    query: {
      query: [
        { code: "Alder", selection: { filter: "item", values: ["15-74"] } },
        { code: "Kon", selection: { filter: "item", values: ["1+2"] } },
        { code: "ContentsCode", selection: { filter: "item", values: ["000000CL"] } },
        { code: "Tid", selection: { filter: "top", values: ["24"] } },
      ],
      response: { format: "json" }
    },
    unit: "% av arbetskraft",
    granularity: "monthly",
    aggregation: 'latest',
    isInverted: true,
  },

  // ─────────────────────────────────────────────────────────────
  // KPI 7: SKATTEBASENS TILLVÄXT
  // ─────────────────────────────────────────────────────────────
  tax_base: {
    path: "OE/OE0107/OE0107A/SkijRegLanK",
    description: "Beskattningsbar förvärvsinkomst per invånare",
    kpiCode: "tax_base_growth",
    dataSourceCode: "scb_px",
    apiVersion: '1.0',
    query: {
      query: [
        { code: "Region", selection: { filter: "item", values: ["00"] } },
        { code: "ContentsCode", selection: { filter: "item", values: ["OE0107A2"] } },
        { code: "Tid", selection: { filter: "top", values: ["10"] } },
      ],
      response: { format: "json" }
    },
    valueMultiplier: 0.001,
    unit: "tkr/inv",
    granularity: "yearly",
    aggregation: 'latest',
  },

  // ─────────────────────────────────────────────────────────────
  // KPI 8: OFFENTLIG NETTOKOSTNAD PER INVÅNARE
  // ─────────────────────────────────────────────────────────────
  public_cost: {
    path: "OE/OE0107/OE0107A/UtgNrPersAr",
    description: "Kommunernas nettokostnader per invånare",
    kpiCode: "public_cost_per_capita",
    dataSourceCode: "scb_px",
    apiVersion: '1.0',
    query: {
      query: [
        { code: "Region", selection: { filter: "item", values: ["00"] } },
        { code: "ContentsCode", selection: { filter: "item", values: ["OE0107A1"] } },
        { code: "Tid", selection: { filter: "top", values: ["10"] } },
      ],
      response: { format: "json" }
    },
    unit: "kr/inv",
    granularity: "yearly",
    aggregation: 'latest',
    isInverted: true,
  },

  // ─────────────────────────────────────────────────────────────
  // KPI 9: FÖRSÖRJNINGSKVOT
  // ─────────────────────────────────────────────────────────────
  dependency_ratio: {
    path: "BE/BE0101/BE0101C/BefijPrognRevN",
    description: "Demografisk försörjningskvot",
    kpiCode: "dependency_ratio",
    dataSourceCode: "scb_px",
    apiVersion: '1.0',
    query: {
      query: [
        { code: "Region", selection: { filter: "item", values: ["00"] } },
        { code: "Kon", selection: { filter: "item", values: ["1+2"] } },
        { code: "ContentsCode", selection: { filter: "item", values: ["BE0101U1"] } },
        { code: "Tid", selection: { filter: "top", values: ["10"] } },
      ],
      response: { format: "json" }
    },
    unit: "kvot",
    granularity: "yearly",
    aggregation: 'latest',
    isInverted: true,
  },

  // ─────────────────────────────────────────────────────────────
  // KPI 11: UNGA MÄN UTANFÖR SYSTEM (16-29 år NEET)
  // ─────────────────────────────────────────────────────────────
  young_neet: {
    path: "AM/AM0401/AM0401A/NAKUBefAkeLArb",
    description: "Unga 16-24 år som varken arbetar eller studerar",
    kpiCode: "young_men_outside_system",
    dataSourceCode: "scb_px",
    apiVersion: '1.0',
    query: {
      query: [
        { code: "Alder", selection: { filter: "item", values: ["16-24"] } },
        { code: "Kon", selection: { filter: "item", values: ["1"] } }, // Män
        { code: "ContentsCode", selection: { filter: "item", values: ["000000CL"] } },
        { code: "Tid", selection: { filter: "top", values: ["24"] } },
      ],
      response: { format: "json" }
    },
    unit: "% av åldersgrupp",
    granularity: "monthly",
    aggregation: 'latest',
    isInverted: true,
  },

  // ─────────────────────────────────────────────────────────────
  // KPI 14: SKOLUTFALL ÅK 9
  // ─────────────────────────────────────────────────────────────
  school_results: {
    path: "UF/UF0107/UF0107A/Grunderslag",
    description: "Elever med godkänt i alla ämnen åk 9",
    kpiCode: "school_outcomes_grade9",
    dataSourceCode: "scb_px",
    apiVersion: '1.0',
    query: {
      query: [
        { code: "Region", selection: { filter: "item", values: ["00"] } },
        { code: "Kon", selection: { filter: "item", values: ["1+2"] } },
        { code: "ContentsCode", selection: { filter: "item", values: ["UF0107A3"] } },
        { code: "Tid", selection: { filter: "top", values: ["10"] } },
      ],
      response: { format: "json" }
    },
    unit: "%",
    granularity: "yearly",
    aggregation: 'latest',
  },

  // ─────────────────────────────────────────────────────────────
  // KPI 16: BOSTADSOMSÄTTNING
  // ─────────────────────────────────────────────────────────────
  housing: {
    path: "BO/BO0101/BO0101A/LaijFardBoAr",
    description: "Färdigställda bostäder per år",
    kpiCode: "housing_turnover",
    dataSourceCode: "scb_px",
    apiVersion: '1.0',
    query: {
      query: [
        { code: "Region", selection: { filter: "item", values: ["00"] } },
        { code: "Hustyp", selection: { filter: "item", values: ["TOTALT"] } },
        { code: "ContentsCode", selection: { filter: "item", values: ["BO0101B1"] } },
        { code: "Tid", selection: { filter: "top", values: ["10"] } },
      ],
      response: { format: "json" }
    },
    unit: "antal/år",
    granularity: "yearly",
    aggregation: 'sum',
  },

  // ─────────────────────────────────────────────────────────────
  // BEFOLKNINGSSTATISTIK - Total befolkning
  // ─────────────────────────────────────────────────────────────
  total_population: {
    path: "BE/BE0101/BE0101A/BefolkningNy",
    description: "Sveriges totala befolkning",
    kpiCode: "total_population",
    dataSourceCode: "scb_px",
    apiVersion: '1.0',
    query: {
      query: [
        { code: "Region", selection: { filter: "item", values: ["00"] } },
        { code: "Alder", selection: { filter: "item", values: ["tot"] } },
        { code: "Kon", selection: { filter: "item", values: ["1", "2"] } },
        { code: "ContentsCode", selection: { filter: "item", values: ["BE0101N1"] } },
        { code: "Tid", selection: { filter: "top", values: ["10"] } },
      ],
      response: { format: "json" }
    },
    valueMultiplier: 0.000001,
    unit: "miljoner",
    granularity: "yearly",
    aggregation: 'sum',
  },

  // ─────────────────────────────────────────────────────────────
  // BEFOLKNINGSSTATISTIK - Per region
  // ─────────────────────────────────────────────────────────────
  population_by_region: {
    path: "BE/BE0101/BE0101A/BefolkningNy",
    description: "Befolkning per län",
    kpiCode: "population_regional",
    dataSourceCode: "scb_px",
    apiVersion: '1.0',
    query: {
      query: [
        { code: "Region", selection: { filter: "all", values: ["*"] } },
        { code: "Alder", selection: { filter: "item", values: ["tot"] } },
        { code: "Kon", selection: { filter: "item", values: ["1", "2"] } },
        { code: "ContentsCode", selection: { filter: "item", values: ["BE0101N1"] } },
        { code: "Tid", selection: { filter: "top", values: ["1"] } },
      ],
      response: { format: "json" }
    },
    unit: "antal",
    granularity: "yearly",
    aggregation: 'sum',
    includeRegions: true,
  },

  // ─────────────────────────────────────────────────────────────
  // BEFOLKNINGSSTATISTIK - Åldersfördelning (5-årsklasser)
  // ─────────────────────────────────────────────────────────────
  population_by_age: {
    path: "BE/BE0101/BE0101A/BefolkningNy",
    description: "Befolkning per åldersgrupp",
    kpiCode: "population_age_structure",
    dataSourceCode: "scb_px",
    apiVersion: '1.0',
    query: {
      query: [
        { code: "Region", selection: { filter: "item", values: ["00"] } },
        { code: "Alder", selection: { filter: "agg:Ålder5år", values: [
          "0-4", "5-9", "10-14", "15-19", "20-24", "25-29", "30-34", 
          "35-39", "40-44", "45-49", "50-54", "55-59", "60-64",
          "65-69", "70-74", "75-79", "80-84", "85-89", "90+"
        ] } },
        { code: "Kon", selection: { filter: "item", values: ["1", "2"] } },
        { code: "ContentsCode", selection: { filter: "item", values: ["BE0101N1"] } },
        { code: "Tid", selection: { filter: "top", values: ["5"] } },
      ],
      response: { format: "json" }
    },
    unit: "antal",
    granularity: "yearly",
    aggregation: 'sum',
  },

  // ─────────────────────────────────────────────────────────────
  // BEFOLKNINGSSTATISTIK - Födda och döda
  // ─────────────────────────────────────────────────────────────
  births_deaths: {
    path: "BE/BE0101/BE0101H/FoijddDodMij",
    description: "Födda och döda per månad",
    kpiCode: "natural_population_change",
    dataSourceCode: "scb_px",
    apiVersion: '1.0',
    query: {
      query: [
        { code: "Region", selection: { filter: "item", values: ["00"] } },
        { code: "ContentsCode", selection: { filter: "item", values: ["BE0101E1", "BE0101E2"] } },
        { code: "Tid", selection: { filter: "top", values: ["24"] } },
      ],
      response: { format: "json" }
    },
    unit: "antal",
    granularity: "monthly",
    aggregation: 'sum',
  },

  // ─────────────────────────────────────────────────────────────
  // BEFOLKNINGSSTATISTIK - In- och utvandring
  // ─────────────────────────────────────────────────────────────
  migration: {
    path: "BE/BE0101/BE0101J/InijUt",
    description: "In- och utvandring per år",
    kpiCode: "net_migration",
    dataSourceCode: "scb_px",
    apiVersion: '1.0',
    query: {
      query: [
        { code: "Region", selection: { filter: "item", values: ["00"] } },
        { code: "Kon", selection: { filter: "item", values: ["1+2"] } },
        { code: "ContentsCode", selection: { filter: "item", values: ["BE0101AE", "BE0101AF"] } },
        { code: "Tid", selection: { filter: "top", values: ["10"] } },
      ],
      response: { format: "json" }
    },
    unit: "antal",
    granularity: "yearly",
    aggregation: 'sum',
  },

  // ═══════════════════════════════════════════════════════════════
  // NYA TABELLER: BNP, SYSSELSÄTTNING, BROTT
  // ═══════════════════════════════════════════════════════════════

  // ─────────────────────────────────────────────────────────────
  // BNP - Bruttonationalprodukt, löpande priser
  // ─────────────────────────────────────────────────────────────
  gdp_current_prices: {
    path: "NR/NR0103/NR0103B/NR0103ENS2010T01Kv",
    description: "BNP löpande priser, kvartal",
    kpiCode: "gdp_level",
    dataSourceCode: "scb_px",
    apiVersion: '1.0',
    query: {
      query: [
        { code: "SNI2007", selection: { filter: "item", values: ["BNP"] } },
        { code: "ContentsCode", selection: { filter: "item", values: ["0000001W"] } },
        { code: "Tid", selection: { filter: "top", values: ["20"] } },
      ],
      response: { format: "json" }
    },
    valueMultiplier: 0.001,
    unit: "miljarder SEK",
    granularity: "quarterly",
    aggregation: 'latest',
  },

  // ─────────────────────────────────────────────────────────────
  // BNP - Fasta priser, säsongsrensat
  // ─────────────────────────────────────────────────────────────
  gdp_constant_prices: {
    path: "NR/NR0103/NR0103B/NR0103ENS2010T01Kv",
    description: "BNP fasta priser referensår 2021, säsongsrensat",
    kpiCode: "gdp_growth",
    dataSourceCode: "scb_px",
    apiVersion: '1.0',
    query: {
      query: [
        { code: "SNI2007", selection: { filter: "item", values: ["BNP"] } },
        { code: "ContentsCode", selection: { filter: "item", values: ["0000002O"] } },
        { code: "Tid", selection: { filter: "top", values: ["20"] } },
      ],
      response: { format: "json" }
    },
    unit: "miljarder SEK (2021 års priser)",
    granularity: "quarterly",
    aggregation: 'latest',
  },

  // ─────────────────────────────────────────────────────────────
  // BNP - Per capita
  // ─────────────────────────────────────────────────────────────
  gdp_per_capita: {
    path: "NR/NR0103/NR0103A/NR0103ENS2010T01A",
    description: "BNP per capita, löpande priser",
    kpiCode: "gdp_per_capita",
    dataSourceCode: "scb_px",
    apiVersion: '1.0',
    query: {
      query: [
        { code: "SNI2007", selection: { filter: "item", values: ["BNPCap"] } },
        { code: "ContentsCode", selection: { filter: "item", values: ["0000001X"] } },
        { code: "Tid", selection: { filter: "top", values: ["10"] } },
      ],
      response: { format: "json" }
    },
    unit: "SEK/capita",
    granularity: "yearly",
    aggregation: 'latest',
  },

  // ─────────────────────────────────────────────────────────────
  // BNP-TILLVÄXT - Procentuell förändring
  // ─────────────────────────────────────────────────────────────
  gdp_growth_rate: {
    path: "NR/NR0103/NR0103B/NR0103ENS2010T01Kv",
    description: "BNP-förändring i procent, säsongsrensat",
    kpiCode: "gdp_growth_rate",
    dataSourceCode: "scb_px",
    apiVersion: '1.0',
    query: {
      query: [
        { code: "SNI2007", selection: { filter: "item", values: ["BNP"] } },
        { code: "ContentsCode", selection: { filter: "item", values: ["0000002P"] } }, // Procentuell förändring
        { code: "Tid", selection: { filter: "top", values: ["20"] } },
      ],
      response: { format: "json" }
    },
    unit: "%",
    granularity: "quarterly",
    aggregation: 'latest',
  },

  // ─────────────────────────────────────────────────────────────
  // SYSSELSÄTTNING - Antal sysselsatta (tusental)
  // ─────────────────────────────────────────────────────────────
  employed_total: {
    path: "AM/AM0401/AM0401A/NAKUBefAkeLArb",
    description: "Antal sysselsatta 15-74 år, tusental",
    kpiCode: "employed_count",
    dataSourceCode: "scb_px",
    apiVersion: '1.0',
    query: {
      query: [
        { code: "Alder", selection: { filter: "item", values: ["15-74"] } },
        { code: "Kon", selection: { filter: "item", values: ["1+2"] } },
        { code: "ContentsCode", selection: { filter: "item", values: ["000000CJ"] } },
        { code: "Tid", selection: { filter: "top", values: ["24"] } },
      ],
      response: { format: "json" }
    },
    unit: "tusental",
    granularity: "monthly",
    aggregation: 'latest',
  },

  // ─────────────────────────────────────────────────────────────
  // SYSSELSÄTTNING - Per kön
  // ─────────────────────────────────────────────────────────────
  employment_by_gender: {
    path: "AM/AM0401/AM0401A/NAKUBefAkeLArb",
    description: "Sysselsättningsgrad 20-64 år per kön",
    kpiCode: "employment_by_gender",
    dataSourceCode: "scb_px",
    apiVersion: '1.0',
    query: {
      query: [
        { code: "Alder", selection: { filter: "item", values: ["20-64"] } },
        { code: "Kon", selection: { filter: "item", values: ["1", "2"] } },
        { code: "ContentsCode", selection: { filter: "item", values: ["000000CK"] } },
        { code: "Tid", selection: { filter: "top", values: ["24"] } },
      ],
      response: { format: "json" }
    },
    unit: "%",
    granularity: "monthly",
    aggregation: 'latest',
  },

  // ─────────────────────────────────────────────────────────────
  // SYSSELSÄTTNING - Per åldersgrupp
  // ─────────────────────────────────────────────────────────────
  employment_by_age: {
    path: "AM/AM0401/AM0401A/NAKUBefAkeLArb",
    description: "Sysselsättningsgrad per åldersgrupp",
    kpiCode: "employment_by_age",
    dataSourceCode: "scb_px",
    apiVersion: '1.0',
    query: {
      query: [
        { code: "Alder", selection: { filter: "item", values: ["15-24", "25-34", "35-44", "45-54", "55-64", "65-74"] } },
        { code: "Kon", selection: { filter: "item", values: ["1+2"] } },
        { code: "ContentsCode", selection: { filter: "item", values: ["000000CK"] } },
        { code: "Tid", selection: { filter: "top", values: ["12"] } },
      ],
      response: { format: "json" }
    },
    unit: "%",
    granularity: "monthly",
    aggregation: 'latest',
  },

  // ─────────────────────────────────────────────────────────────
  // SYSSELSÄTTNING - Per födelseregion (inrikes/utrikes)
  // ─────────────────────────────────────────────────────────────
  employment_by_birth_region: {
    path: "AM/AM0401/AM0401L/NAKUBefAkeLArbFoder",
    description: "Sysselsättningsgrad efter födelseregion",
    kpiCode: "employment_by_origin",
    dataSourceCode: "scb_px",
    apiVersion: '1.0',
    query: {
      query: [
        { code: "Alder", selection: { filter: "item", values: ["20-64"] } },
        { code: "Kon", selection: { filter: "item", values: ["1+2"] } },
        { code: "Fodelseland", selection: { filter: "item", values: ["inrikes", "utrikes"] } },
        { code: "ContentsCode", selection: { filter: "item", values: ["000000CK"] } },
        { code: "Tid", selection: { filter: "top", values: ["12"] } },
      ],
      response: { format: "json" }
    },
    unit: "%",
    granularity: "monthly",
    aggregation: 'latest',
  },

  // ─────────────────────────────────────────────────────────────
  // ARBETSLÖSHET - Antal arbetslösa (tusental)
  // ─────────────────────────────────────────────────────────────
  unemployed_total: {
    path: "AM/AM0401/AM0401A/NAKUBefAkeLArb",
    description: "Antal arbetslösa 15-74 år, tusental",
    kpiCode: "unemployed_count",
    dataSourceCode: "scb_px",
    apiVersion: '1.0',
    query: {
      query: [
        { code: "Alder", selection: { filter: "item", values: ["15-74"] } },
        { code: "Kon", selection: { filter: "item", values: ["1+2"] } },
        { code: "ContentsCode", selection: { filter: "item", values: ["000000CM"] } },
        { code: "Tid", selection: { filter: "top", values: ["24"] } },
      ],
      response: { format: "json" }
    },
    unit: "tusental",
    granularity: "monthly",
    aggregation: 'latest',
    isInverted: true,
  },

  // ─────────────────────────────────────────────────────────────
  // LÅNGTIDSARBETSLÖSHET - Mer än 6 månader
  // ─────────────────────────────────────────────────────────────
  long_term_unemployed: {
    path: "AM/AM0401/AM0401N/NAKUArbLosaTid",
    description: "Långtidsarbetslösa (6+ månader)",
    kpiCode: "long_term_unemployed",
    dataSourceCode: "scb_px",
    apiVersion: '1.0',
    query: {
      query: [
        { code: "Alder", selection: { filter: "item", values: ["15-74"] } },
        { code: "Kon", selection: { filter: "item", values: ["1+2"] } },
        { code: "Tid", selection: { filter: "item", values: ["27+"] } }, // 27+ veckor
        { code: "ContentsCode", selection: { filter: "item", values: ["000000CN"] } },
        { code: "Tid", selection: { filter: "top", values: ["12"] } },
      ],
      response: { format: "json" }
    },
    unit: "tusental",
    granularity: "monthly",
    aggregation: 'latest',
    isInverted: true,
  },

  // ─────────────────────────────────────────────────────────────
  // ARBETADE TIMMAR - Totalt i ekonomin
  // ─────────────────────────────────────────────────────────────
  hours_worked: {
    path: "AM/AM0401/AM0401A/NAKUBefAkeLArb",
    description: "Arbetade timmar per vecka, genomsnitt",
    kpiCode: "hours_worked",
    dataSourceCode: "scb_px",
    apiVersion: '1.0',
    query: {
      query: [
        { code: "Alder", selection: { filter: "item", values: ["15-74"] } },
        { code: "Kon", selection: { filter: "item", values: ["1+2"] } },
        { code: "ContentsCode", selection: { filter: "item", values: ["000000CO"] } },
        { code: "Tid", selection: { filter: "top", values: ["24"] } },
      ],
      response: { format: "json" }
    },
    unit: "miljoner timmar/vecka",
    granularity: "monthly",
    aggregation: 'latest',
  },

  // ═══════════════════════════════════════════════════════════════
  // BROTTSSTATISTIK (via SCB rättsvårdsstatistik)
  // ═══════════════════════════════════════════════════════════════

  // ─────────────────────────────────────────────────────────────
  // ANMÄLDA BROTT - Total (SCB har äldre data, BRÅ för nyare)
  // ─────────────────────────────────────────────────────────────
  crimes_reported: {
    path: "LE/LE0101/LE0101A/AnijBrott",
    description: "Anmälda brott efter brottstyp",
    kpiCode: "crimes_reported",
    dataSourceCode: "scb_px",
    apiVersion: '1.0',
    query: {
      query: [
        { code: "Brottstyp", selection: { filter: "item", values: [
          "3", // Mord, dråp
          "4", // Misshandel
          "5", // Våldtäkt
          "6", // Sexualbrott
          "7", // Rån
          "8", // Stöld
          "9", // Bedrägeri
        ] } },
        { code: "Region", selection: { filter: "item", values: ["00"] } },
        { code: "ContentsCode", selection: { filter: "item", values: ["LE0101A1"] } },
        { code: "Tid", selection: { filter: "top", values: ["10"] } },
      ],
      response: { format: "json" }
    },
    unit: "antal/100 000 inv",
    granularity: "yearly",
    aggregation: 'sum',
    isInverted: true,
  },

  // ─────────────────────────────────────────────────────────────
  // VÅLDSBROTT - Misshandel
  // ─────────────────────────────────────────────────────────────
  violent_crimes_assault: {
    path: "LE/LE0101/LE0101A/AnijBrott",
    description: "Anmälda misshandelsbrott",
    kpiCode: "violent_crime_assault",
    dataSourceCode: "scb_px",
    apiVersion: '1.0',
    query: {
      query: [
        { code: "Brottstyp", selection: { filter: "item", values: ["4"] } }, // Misshandel
        { code: "Region", selection: { filter: "item", values: ["00"] } },
        { code: "ContentsCode", selection: { filter: "item", values: ["LE0101A1"] } },
        { code: "Tid", selection: { filter: "top", values: ["15"] } },
      ],
      response: { format: "json" }
    },
    unit: "antal/100 000 inv",
    granularity: "yearly",
    aggregation: 'latest',
    isInverted: true,
  },

  // ─────────────────────────────────────────────────────────────
  // DÖDLIGT VÅLD - Mord och dråp
  // ─────────────────────────────────────────────────────────────
  homicides: {
    path: "LE/LE0101/LE0101A/AnijBrott",
    description: "Anmälda mord och dråp",
    kpiCode: "homicides",
    dataSourceCode: "scb_px",
    apiVersion: '1.0',
    query: {
      query: [
        { code: "Brottstyp", selection: { filter: "item", values: ["3"] } }, // Mord, dråp
        { code: "Region", selection: { filter: "item", values: ["00"] } },
        { code: "ContentsCode", selection: { filter: "item", values: ["LE0101A1"] } },
        { code: "Tid", selection: { filter: "top", values: ["20"] } },
      ],
      response: { format: "json" }
    },
    unit: "antal",
    granularity: "yearly",
    aggregation: 'sum',
    isInverted: true,
  },

  // ─────────────────────────────────────────────────────────────
  // SEXUALBROTT
  // ─────────────────────────────────────────────────────────────
  sexual_crimes: {
    path: "LE/LE0101/LE0101A/AnijBrott",
    description: "Anmälda sexualbrott",
    kpiCode: "sexual_crimes",
    dataSourceCode: "scb_px",
    apiVersion: '1.0',
    query: {
      query: [
        { code: "Brottstyp", selection: { filter: "item", values: ["5", "6"] } }, // Våldtäkt + övrigt
        { code: "Region", selection: { filter: "item", values: ["00"] } },
        { code: "ContentsCode", selection: { filter: "item", values: ["LE0101A1"] } },
        { code: "Tid", selection: { filter: "top", values: ["15"] } },
      ],
      response: { format: "json" }
    },
    unit: "antal/100 000 inv",
    granularity: "yearly",
    aggregation: 'sum',
    isInverted: true,
  },

  // ─────────────────────────────────────────────────────────────
  // STÖLD OCH RÅN
  // ─────────────────────────────────────────────────────────────
  theft_robbery: {
    path: "LE/LE0101/LE0101A/AnijBrott",
    description: "Anmälda stöld- och rånbrott",
    kpiCode: "theft_robbery",
    dataSourceCode: "scb_px",
    apiVersion: '1.0',
    query: {
      query: [
        { code: "Brottstyp", selection: { filter: "item", values: ["7", "8"] } }, // Rån + stöld
        { code: "Region", selection: { filter: "item", values: ["00"] } },
        { code: "ContentsCode", selection: { filter: "item", values: ["LE0101A1"] } },
        { code: "Tid", selection: { filter: "top", values: ["15"] } },
      ],
      response: { format: "json" }
    },
    unit: "antal/100 000 inv",
    granularity: "yearly",
    aggregation: 'sum',
    isInverted: true,
  },

  // ─────────────────────────────────────────────────────────────
  // LAGFÖRDA PERSONER
  // ─────────────────────────────────────────────────────────────
  convicted_persons: {
    path: "LE/LE0102/LE0102A/LagijF",
    description: "Lagförda personer per år",
    kpiCode: "convicted_persons",
    dataSourceCode: "scb_px",
    apiVersion: '1.0',
    query: {
      query: [
        { code: "Kon", selection: { filter: "item", values: ["1+2"] } },
        { code: "ContentsCode", selection: { filter: "item", values: ["LE0102A1"] } },
        { code: "Tid", selection: { filter: "top", values: ["10"] } },
      ],
      response: { format: "json" }
    },
    unit: "antal",
    granularity: "yearly",
    aggregation: 'sum',
  },

  // ─────────────────────────────────────────────────────────────
  // FÄNGELSEPOPULATION
  // ─────────────────────────────────────────────────────────────
  prison_population: {
    path: "LE/LE0103/LE0103A/KriminalVD",
    description: "Medelbeläggning kriminalvårdsanstalter",
    kpiCode: "prison_population",
    dataSourceCode: "scb_px",
    apiVersion: '1.0',
    query: {
      query: [
        { code: "Kon", selection: { filter: "item", values: ["1+2"] } },
        { code: "ContentsCode", selection: { filter: "item", values: ["LE0103A1"] } },
        { code: "Tid", selection: { filter: "top", values: ["10"] } },
      ],
      response: { format: "json" }
    },
    unit: "antal",
    granularity: "yearly",
    aggregation: 'latest',
  },

  // ─────────────────────────────────────────────────────────────
  // BROTT PER REGION
  // ─────────────────────────────────────────────────────────────
  crimes_by_region: {
    path: "LE/LE0101/LE0101A/AnijBrottReg",
    description: "Anmälda brott per region",
    kpiCode: "crimes_regional",
    dataSourceCode: "scb_px",
    apiVersion: '1.0',
    query: {
      query: [
        { code: "Brottstyp", selection: { filter: "item", values: ["TOT"] } },
        { code: "Region", selection: { filter: "all", values: ["*"] } },
        { code: "ContentsCode", selection: { filter: "item", values: ["LE0101A1"] } },
        { code: "Tid", selection: { filter: "top", values: ["1"] } },
      ],
      response: { format: "json" }
    },
    unit: "antal/100 000 inv",
    granularity: "yearly",
    aggregation: 'sum',
    includeRegions: true,
    isInverted: true,
  },
};

// ═══════════════════════════════════════════════════════════════
// SCB API HELPERS - Stöd för både 1.0 (json) och 2.0 (json-stat2)
// ═══════════════════════════════════════════════════════════════

interface SCBDataItem {
  key: string[];
  values: string[];
}

interface SCBResponse {
  // V1 format (json)
  columns?: { code: string; text: string; type: string }[];
  data?: SCBDataItem[];
  // V2 format (json-stat2)
  id?: string[];
  size?: number[];
  dimension?: Record<string, {
    label: string;
    category: {
      index: Record<string, number>;
      label: Record<string, string>;
    };
  }>;
  value?: number[];
  status?: Record<string, string>;
}

// JSON-stat2 parser för PxWeb 2.0
interface ParsedJsonStat {
  values: Array<{ 
    period: string; 
    value: number; 
    region?: string;
    dimensions: Record<string, string>;
  }>;
}

function parseJsonStat2(data: SCBResponse): ParsedJsonStat | null {
  if (!data.value || !data.dimension || !data.size || !data.id) {
    console.warn("[SCB] Missing json-stat2 structure");
    return null;
  }

  const dimensions = data.id;
  const sizes = data.size;
  const values = data.value;
  
  // Build dimension labels lookup
  const dimLabels: Record<string, Record<string, string>> = {};
  for (const dimId of dimensions) {
    if (data.dimension[dimId]?.category?.label) {
      dimLabels[dimId] = data.dimension[dimId].category.label;
    }
  }

  // Calculate strides for multi-dimensional indexing
  const strides: number[] = [];
  let stride = 1;
  for (let i = sizes.length - 1; i >= 0; i--) {
    strides.unshift(stride);
    stride *= sizes[i];
  }

  const results: ParsedJsonStat['values'] = [];

  // Iterate through all value positions
  for (let flatIndex = 0; flatIndex < values.length; flatIndex++) {
    const value = values[flatIndex];
    
    // Skip missing values
    if (value === null || isNaN(value)) continue;
    
    // Decode multi-dimensional position
    const dimValues: Record<string, string> = {};
    let remaining = flatIndex;
    
    for (let d = 0; d < dimensions.length; d++) {
      const dimId = dimensions[d];
      const dimIndex = Math.floor(remaining / strides[d]);
      remaining = remaining % strides[d];
      
      // Get the key at this index
      const dimInfo = data.dimension[dimId];
      if (dimInfo?.category?.index) {
        const keys = Object.entries(dimInfo.category.index)
          .sort((a, b) => a[1] - b[1])
          .map(([key]) => key);
        
        if (keys[dimIndex]) {
          const key = keys[dimIndex];
          dimValues[dimId] = dimLabels[dimId]?.[key] || key;
        }
      }
    }

    // Extract period (usually "Tid" dimension)
    const period = dimValues["Tid"] || dimValues["tid"] || Object.values(dimValues).find(v => /^\d{4}/.test(v)) || "";
    const region = dimValues["Region"] || dimValues["region"];

    results.push({
      period,
      value,
      region,
      dimensions: dimValues,
    });
  }

  return { values: results };
}

async function fetchFromSCB(config: TableConfig): Promise<SCBResponse> {
  // Use appropriate API version
  const baseUrl = config.apiVersion === '2.0' ? SCB_API_V2_BASE : SCB_API_V1_BASE;
  const url = `${baseUrl}/${config.path}`;
  
  // Determine response format
  const responseFormat = config.responseFormat || (config.apiVersion === '2.0' ? 'json-stat2' : 'json');
  const queryWithFormat = {
    ...config.query,
    response: { format: responseFormat }
  };
  
  console.log(`[SCB] Fetching from: ${url} (API ${config.apiVersion}, format: ${responseFormat})`);
  
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(queryWithFormat),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[SCB] API error ${response.status}: ${errorText.substring(0, 500)}`);
      throw new Error(`SCB API error: ${response.status} - ${errorText.substring(0, 100)}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`[SCB] Fetch failed for ${config.path}:`, error);
    throw error;
  }
}

function parseScbResponse(data: SCBResponse, config: TableConfig): { 
  value: number; 
  previousValue?: number; 
  period: string;
  rawValues: Array<{ period: string; value: number; region?: string }>;
  regionalData?: Array<{ region: string; value: number; period: string }>;
} | null {
  const responseFormat = config.responseFormat || (config.apiVersion === '2.0' ? 'json-stat2' : 'json');
  
  // ─────────────────────────────────────────────────────────────
  // JSON-stat2 format (PxWeb 2.0)
  // ─────────────────────────────────────────────────────────────
  if (responseFormat === 'json-stat2' || data.value) {
    const parsed = parseJsonStat2(data);
    if (!parsed || parsed.values.length === 0) {
      console.warn(`[SCB] No data in json-stat2 response for ${config.kpiCode}`);
      return null;
    }

    // Group by period (and optionally region)
    const periodValues: Record<string, number[]> = {};
    const regionalData: Array<{ region: string; value: number; period: string }> = [];
    
    for (const item of parsed.values) {
      const period = item.period;
      if (!periodValues[period]) {
        periodValues[period] = [];
      }
      periodValues[period].push(item.value);
      
      if (config.includeRegions && item.region) {
        regionalData.push({
          region: item.region,
          value: item.value,
          period,
        });
      }
    }

    // Aggregate
    const aggregatedPeriods: Record<string, number> = {};
    for (const [period, values] of Object.entries(periodValues)) {
      switch (config.aggregation) {
        case 'sum':
          aggregatedPeriods[period] = values.reduce((a, b) => a + b, 0);
          break;
        case 'average':
          aggregatedPeriods[period] = values.reduce((a, b) => a + b, 0) / values.length;
          break;
        case 'latest':
        default:
          aggregatedPeriods[period] = values[values.length - 1];
      }
    }

    const sortedPeriods = Object.keys(aggregatedPeriods).sort();
    if (sortedPeriods.length === 0) return null;

    const latestPeriod = sortedPeriods[sortedPeriods.length - 1];
    const previousPeriod = sortedPeriods.length > 1 ? sortedPeriods[sortedPeriods.length - 2] : null;
    
    let latestValue = aggregatedPeriods[latestPeriod];
    let previousValue = previousPeriod ? aggregatedPeriods[previousPeriod] : undefined;

    if (config.valueMultiplier) {
      latestValue *= config.valueMultiplier;
      if (previousValue !== undefined) previousValue *= config.valueMultiplier;
    }

    return {
      value: latestValue,
      previousValue,
      period: latestPeriod,
      rawValues: sortedPeriods.map(p => ({
        period: p,
        value: aggregatedPeriods[p] * (config.valueMultiplier || 1),
      })),
      regionalData: config.includeRegions ? regionalData : undefined,
    };
  }

  // ─────────────────────────────────────────────────────────────
  // Legacy JSON format (PxWeb 1.0)
  // ─────────────────────────────────────────────────────────────
  if (!data.data || !Array.isArray(data.data) || data.data.length === 0) {
    console.warn(`[SCB] No data in response for ${config.kpiCode}`);
    return null;
  }

  // Group values by period
  const periodValues: Record<string, number[]> = {};
  
  for (const item of data.data) {
    const period = item.key[item.key.length - 1];
    const value = parseFloat(item.values[0]);
    
    if (!isNaN(value)) {
      if (!periodValues[period]) {
        periodValues[period] = [];
      }
      periodValues[period].push(value);
    }
  }

  // Aggregate based on config
  const aggregatedPeriods: Record<string, number> = {};
  for (const [period, values] of Object.entries(periodValues)) {
    switch (config.aggregation) {
      case 'sum':
        aggregatedPeriods[period] = values.reduce((a, b) => a + b, 0);
        break;
      case 'average':
        aggregatedPeriods[period] = values.reduce((a, b) => a + b, 0) / values.length;
        break;
      case 'latest':
      default:
        aggregatedPeriods[period] = values[values.length - 1];
    }
  }

  const sortedPeriods = Object.keys(aggregatedPeriods).sort();
  
  if (sortedPeriods.length === 0) {
    return null;
  }

  const latestPeriod = sortedPeriods[sortedPeriods.length - 1];
  const previousPeriod = sortedPeriods.length > 1 ? sortedPeriods[sortedPeriods.length - 2] : null;
  
  let latestValue = aggregatedPeriods[latestPeriod];
  let previousValue = previousPeriod ? aggregatedPeriods[previousPeriod] : undefined;

  if (config.valueMultiplier) {
    latestValue *= config.valueMultiplier;
    if (previousValue !== undefined) {
      previousValue *= config.valueMultiplier;
    }
  }

  return {
    value: latestValue,
    previousValue,
    period: latestPeriod,
    rawValues: sortedPeriods.map(p => ({
      period: p,
      value: aggregatedPeriods[p] * (config.valueMultiplier || 1),
    })),
  };
}

function parsePeriodToDates(period: string): { periodStart: string; periodEnd: string; granularity: string } {
  if (period.includes("M")) {
    const [year, month] = period.split("M");
    const periodStart = `${year}-${month.padStart(2, "0")}-01`;
    const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
    const periodEnd = `${year}-${month.padStart(2, "0")}-${lastDay}`;
    return { periodStart, periodEnd, granularity: "monthly" };
  } else if (period.includes("K")) {
    const [year, quarter] = period.split("K");
    const startMonth = (parseInt(quarter) - 1) * 3 + 1;
    const endMonth = startMonth + 2;
    const periodStart = `${year}-${String(startMonth).padStart(2, "0")}-01`;
    const lastDay = new Date(parseInt(year), endMonth, 0).getDate();
    const periodEnd = `${year}-${String(endMonth).padStart(2, "0")}-${lastDay}`;
    return { periodStart, periodEnd, granularity: "quarterly" };
  } else {
    return { 
      periodStart: `${period}-01-01`, 
      periodEnd: `${period}-12-31`,
      granularity: "yearly"
    };
  }
}

function calculateTrendAndStatus(
  value: number, 
  previousValue: number | undefined, 
  isInverted: boolean = false
): { 
  trend: "up" | "down" | "stable"; 
  trendPercent: number; 
  status: "positive" | "warning" | "critical" | "neutral" 
} {
  if (!previousValue || previousValue === 0) {
    return { trend: "stable", trendPercent: 0, status: "neutral" };
  }

  const trendPercent = ((value - previousValue) / Math.abs(previousValue)) * 100;
  
  let trend: "up" | "down" | "stable" = "stable";
  if (Math.abs(trendPercent) > 0.5) {
    trend = trendPercent > 0 ? "up" : "down";
  }

  // For inverted KPIs, down is good
  const isImproving = isInverted ? trend === "down" : trend === "up";
  const isDeclining = isInverted ? trend === "up" : trend === "down";

  let status: "positive" | "warning" | "critical" | "neutral" = "neutral";
  if (isImproving && Math.abs(trendPercent) > 2) {
    status = "positive";
  } else if (isDeclining && Math.abs(trendPercent) > 5) {
    status = "critical";
  } else if (isDeclining && Math.abs(trendPercent) > 1) {
    status = "warning";
  }

  return { trend, trendPercent, status };
}

// ═══════════════════════════════════════════════════════════════
// MAIN HANDLER
// ═══════════════════════════════════════════════════════════════

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();

  try {
    const body = await req.json().catch(() => ({}));
    const { table_key, fetch_all, dry_run, kpi_codes } = body;

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get SCB data source
    const { data: dataSource } = await supabase
      .from("data_sources")
      .select("id")
      .eq("code", "scb_px")
      .maybeSingle();

    // Log ingest start
    const { data: ingestLog } = await supabase
      .from("ingest_log")
      .insert({
        data_source_id: dataSource?.id,
        status: "running",
        metadata: { table_key, fetch_all, kpi_codes }
      })
      .select()
      .single();

    // ─────────────────────────────────────────────────────────────
    // FETCH ALL TABLES
    // ─────────────────────────────────────────────────────────────
    if (fetch_all || kpi_codes) {
      const tablesToFetch = kpi_codes 
        ? Object.entries(TABLE_CONFIGS).filter(([_, c]) => kpi_codes.includes(c.kpiCode))
        : Object.entries(TABLE_CONFIGS);

      const results: Record<string, { success: boolean; value?: number; error?: string; period?: string }> = {};
      let totalInserted = 0;
      let totalUpdated = 0;

      for (const [key, config] of tablesToFetch) {
        try {
          console.log(`[SCB] Processing: ${key} (${config.kpiCode})`);
          
          const scbData = await fetchFromSCB(config);
          const parsed = parseScbResponse(scbData, config);
          
          if (!parsed) {
            results[key] = { success: false, error: "No data returned" };
            continue;
          }

          if (!dry_run) {
            const { data: kpiDef } = await supabase
              .from("kpi_definitions")
              .select("id, name, is_inverted")
              .eq("code", config.kpiCode)
              .maybeSingle();

            if (kpiDef) {
              const { periodStart, periodEnd, granularity } = parsePeriodToDates(parsed.period);
              const isInverted = config.isInverted ?? kpiDef.is_inverted ?? false;
              const { trend, trendPercent, status } = calculateTrendAndStatus(
                parsed.value, 
                parsed.previousValue, 
                isInverted
              );

              // Check existing
              const { data: existing } = await supabase
                .from("kpi_values")
                .select("id, value")
                .eq("kpi_id", kpiDef.id)
                .eq("period_start", periodStart)
                .eq("region_code", "SE")
                .maybeSingle();

              const kpiValue = {
                kpi_id: kpiDef.id,
                value: parsed.value,
                previous_value: parsed.previousValue,
                trend,
                trend_percent: trendPercent,
                status,
                confidence: 95,
                period_start: periodStart,
                period_end: periodEnd,
                granularity: config.granularity || granularity,
                region_code: "SE",
                data_source_id: dataSource?.id,
                is_provisional: false,
                raw_data: { 
                  scb_path: config.path,
                  fetched_at: new Date().toISOString(),
                },
              };

              if (existing) {
                if (Math.abs(existing.value - parsed.value) > 0.001) {
                  await supabase
                    .from("kpi_values")
                    .update({ ...kpiValue, updated_at: new Date().toISOString() })
                    .eq("id", existing.id);
                  totalUpdated++;
                }
              } else {
                await supabase.from("kpi_values").insert(kpiValue);
                totalInserted++;
              }
            }
          }

          results[key] = { 
            success: true, 
            value: Math.round(parsed.value * 1000) / 1000,
            period: parsed.period,
          };

        } catch (err) {
          console.error(`[SCB] Error for ${key}:`, err);
          results[key] = { 
            success: false, 
            error: err instanceof Error ? err.message : "Unknown error" 
          };
        }
        
        // Rate limiting
        await new Promise(r => setTimeout(r, 300));
      }

      // Update ingest log
      const errorCount = Object.values(results).filter(r => !r.success).length;
      await supabase
        .from("ingest_log")
        .update({
          completed_at: new Date().toISOString(),
          status: errorCount > 0 ? (errorCount === Object.keys(results).length ? "failed" : "partial") : "success",
          records_fetched: Object.keys(results).length,
          records_inserted: totalInserted,
          records_updated: totalUpdated,
          metadata: { duration_ms: Date.now() - startTime, results },
        })
        .eq("id", ingestLog?.id);

      return new Response(
        JSON.stringify({
          success: true,
          dry_run: dry_run || false,
          duration_ms: Date.now() - startTime,
          records_inserted: totalInserted,
          records_updated: totalUpdated,
          results,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ─────────────────────────────────────────────────────────────
    // SINGLE TABLE FETCH
    // ─────────────────────────────────────────────────────────────
    if (table_key && TABLE_CONFIGS[table_key]) {
      const config = TABLE_CONFIGS[table_key];
      
      const scbData = await fetchFromSCB(config);
      const parsed = parseScbResponse(scbData, config);

      if (!parsed) {
        return new Response(
          JSON.stringify({ success: false, error: "No data in response" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { trend, trendPercent, status } = calculateTrendAndStatus(
        parsed.value, 
        parsed.previousValue, 
        config.isInverted
      );

      return new Response(
        JSON.stringify({
          success: true,
          table: table_key,
          kpi_code: config.kpiCode,
          value: Math.round(parsed.value * 1000) / 1000,
          previous_value: parsed.previousValue ? Math.round(parsed.previousValue * 1000) / 1000 : null,
          unit: config.unit,
          trend,
          trend_percent: Math.round(trendPercent * 100) / 100,
          status,
          period: parsed.period,
          historical: parsed.rawValues.slice(-10),
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ─────────────────────────────────────────────────────────────
    // LIST AVAILABLE TABLES
    // ─────────────────────────────────────────────────────────────
    return new Response(
      JSON.stringify({
        message: "SCB PxWebApi Integration - Nationellt Ledningssystem",
        api_versions: ["1.0", "2.0"],
        available_tables: Object.entries(TABLE_CONFIGS).map(([key, config]) => ({
          key,
          kpi_code: config.kpiCode,
          description: config.description,
          unit: config.unit,
          granularity: config.granularity,
          is_inverted: config.isInverted || false,
        })),
        usage: {
          single: 'POST { "table_key": "life_expectancy" }',
          all: 'POST { "fetch_all": true }',
          by_kpi: 'POST { "kpi_codes": ["life_expectancy", "employment_rate_net"] }',
          dry_run: 'Lägg till "dry_run": true för test',
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("[SCB] Fatal error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
