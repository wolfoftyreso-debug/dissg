/**
 * API-POLICY & LICENSSTRATEGI
 * 
 * "Öppen verklighet. Betald förståelse."
 * 
 * All data är öppen att se. All intelligens är möjlig att köpa.
 */

// Licensnivåer
export type LicenseTier = 'open' | 'plus' | 'pro' | 'enterprise';

export const licenseTiers: Record<LicenseTier, {
  name: string;
  icon: string;
  color: string;
  description: string;
  price: string;
  features: string[];
  limits: {
    ratePerMinute: number;
    ratePerDay: number;
    queryComplexity: number;
    nutsLevels: number[];
  };
  permissions: {
    commercialUse: boolean;
    attribution: 'required' | 'recommended' | 'optional';
    whiteLabel: boolean;
    bulkExport: boolean;
    feeds: boolean;
    correlations: boolean;
    customIntegration: boolean;
    sla: boolean;
  };
  typicalUsers: string[];
}> = {
  open: {
    name: 'Open License',
    icon: '🟢',
    color: 'text-green-500',
    description: 'Gratis för icke-kommersiell användning',
    price: 'Gratis',
    features: [
      'Läsning av alla öppna data',
      'Delning med attribution',
      'Media-citering',
      'Utbildningssyfte',
    ],
    limits: {
      ratePerMinute: 30,
      ratePerDay: 1000,
      queryComplexity: 10,
      nutsLevels: [0, 1],
    },
    permissions: {
      commercialUse: false,
      attribution: 'required',
      whiteLabel: false,
      bulkExport: false,
      feeds: false,
      correlations: false,
      customIntegration: false,
      sla: false,
    },
    typicalUsers: ['Allmänhet', 'Skolor', 'Studenter', 'Journalister'],
  },
  plus: {
    name: 'Commercial License',
    icon: '🔵',
    color: 'text-blue-500',
    description: 'För kommersiell användning och publicering',
    price: 'Från 4 900 kr/mån',
    features: [
      'Allt i Open',
      'Kommersiell användning',
      'Publicering i egna produkter',
      'Analys & rapporter',
      'Regional data (NUTS 2)',
      'Grundläggande korrelationer',
    ],
    limits: {
      ratePerMinute: 120,
      ratePerDay: 50000,
      queryComplexity: 50,
      nutsLevels: [0, 1, 2],
    },
    permissions: {
      commercialUse: true,
      attribution: 'recommended',
      whiteLabel: false,
      bulkExport: false,
      feeds: true,
      correlations: true,
      customIntegration: false,
      sla: false,
    },
    typicalUsers: ['Mediahus', 'Konsultbolag', 'Analysföretag', 'Nyhetsredaktioner'],
  },
  pro: {
    name: 'Intelligence License',
    icon: '🟣',
    color: 'text-purple-500',
    description: 'Full integration och premium-intelligens',
    price: 'Från 14 900 kr/mån',
    features: [
      'Allt i Plus',
      'White-label tillåten',
      'Interna beslutsstöd',
      'Automatiska feeds',
      'Bulk & streaming',
      'Finmaskig data (NUTS 3)',
      'Avancerade korrelationer',
      'Relevansscore',
    ],
    limits: {
      ratePerMinute: 600,
      ratePerDay: 500000,
      queryComplexity: 200,
      nutsLevels: [0, 1, 2, 3],
    },
    permissions: {
      commercialUse: true,
      attribution: 'optional',
      whiteLabel: true,
      bulkExport: true,
      feeds: true,
      correlations: true,
      customIntegration: true,
      sla: true,
    },
    typicalUsers: ['Myndigheter', 'Regioner', 'Stora företag', 'Banker'],
  },
  enterprise: {
    name: 'Enterprise License',
    icon: '🏢',
    color: 'text-amber-500',
    description: 'Anpassad för stora organisationer',
    price: 'Kontakta oss',
    features: [
      'Allt i Pro',
      'Anpassade SLA',
      'Dedikerad support',
      'Juridiska tillägg per land',
      'On-premise option',
      'Anpassade feeds',
      'Prioriterad utveckling',
    ],
    limits: {
      ratePerMinute: 3000,
      ratePerDay: 5000000,
      queryComplexity: 1000,
      nutsLevels: [0, 1, 2, 3],
    },
    permissions: {
      commercialUse: true,
      attribution: 'optional',
      whiteLabel: true,
      bulkExport: true,
      feeds: true,
      correlations: true,
      customIntegration: true,
      sla: true,
    },
    typicalUsers: ['Regeringar', 'Internationella organisationer', 'Storföretag'],
  },
};

// Juridiska skyddsklausuler (globalt giltiga)
export const legalDisclaimers = {
  noAdvice: {
    id: 'no_advice',
    title: 'Ingen rådgivning',
    shortText: 'Information, inte rådgivning',
    fullText: `Tjänsten tillhandahåller systemgenererade indikationer baserade på öppna data. 
Informationen utgör inte rådgivning, rekommendationer eller beslut. 
Användaren bör alltid konsultera relevanta experter innan beslut fattas.`,
  },
  noCausality: {
    id: 'no_causality',
    title: 'Ingen kausalitet',
    shortText: 'Korrelation ≠ orsak',
    fullText: `Visade samband indikerar samvariation över tid. 
Kausalitet fastställs inte av systemet. 
Statistiska mönster bör tolkas med försiktighet och i sitt sammanhang.`,
  },
  liabilityLimit: {
    id: 'liability_limit',
    title: 'Ansvarsbegränsning',
    shortText: 'Användaren ansvarar för beslut',
    fullText: `Användaren ansvarar själv för hur informationen används i beslutsfattande. 
Plattformen ansvarar inte för konsekvenser av beslut baserade på presenterad information.`,
  },
  dataQuality: {
    id: 'data_quality',
    title: 'Datakvalitet',
    shortText: 'Aggregering, inte källdata',
    fullText: `Plattformen ansvarar för aggregering, normalisering och presentation. 
Ansvar för underliggande källdata ligger hos respektive datakälla. 
All data visas med angivna osäkerhetsnivåer och senaste uppdateringstid.`,
  },
};

// Datakategorier (strikt åtskilda)
export const dataCategories = {
  openSource: {
    name: 'Öppen källdata',
    description: 'Data från myndigheter, statistikbyråer, internationella organisationer',
    ownership: 'Ej ägt av plattformen',
    policy: [
      'Alltid attribution',
      'Länk till ursprung',
      'Licenser respekteras',
      'Inga ändringar i rådata',
    ],
    examples: ['SCB', 'Eurostat', 'WHO', 'Världsbanken', 'Wikipedia (CC BY-SA)'],
  },
  systemGenerated: {
    name: 'Systemgenererad data',
    description: 'Bearbetning, aggregering och intelligens producerad av plattformen',
    ownership: 'Ägt av plattformen',
    policy: [
      'Licensieras kommersiellt',
      'Kan återanvändas enligt villkor',
      'White-label tillåten i Pro/Enterprise',
    ],
    examples: [
      'Normaliseringar',
      'Aggregeringar',
      'Index',
      'Relevansscore',
      'Kluster',
      'Korrelationer',
      'Indikationer',
      'Feeds',
    ],
  },
};

// Attribution-krav
export const attributionConfig = {
  required: {
    template: 'Data och analyser tillhandahålls av {{platform}}. {{source_url}}',
    shortTemplate: 'Källa: {{platform}}',
    placement: 'Synlig i anslutning till presenterad data',
  },
  recommended: {
    template: 'Baserat på data från {{platform}}',
    shortTemplate: '{{platform}}',
    placement: 'Footer eller datakälla-sektion',
  },
  optional: {
    template: null,
    shortTemplate: null,
    placement: 'Valfritt',
  },
};

// Anti-misuse policy
export const antiMisusePolicy = {
  prohibited: [
    'Mass-replikering av databas',
    'Skrapning för konkurrerande tjänst',
    'Försök att återskapa rådata från aggregeringar',
    'Missbruk som bryter privacy-spärrar',
    'Vidareförsäljning utan licens',
    'Automatiserad replikering av feeds',
  ],
  technicalProtections: [
    'Rate-limits per API-nyckel',
    'Query-complexity caps',
    'Audit logs på all användning',
    'Automatisk avstängning vid brott',
    'IP-baserad throttling',
    'Pattern detection för skrapning',
  ],
  violationActions: {
    warning: 'Första överträdelse - varning via e-post',
    temporaryBlock: 'Upprepade överträdelser - tillfällig avstängning (24-72h)',
    permanentBlock: 'Allvarliga överträdelser - permanent avstängning',
  },
};

// Jurisdiktionsspecifika tillägg
export const jurisdictionAdditions = {
  EU: {
    name: 'EU/EES',
    notes: 'GDPR säkrat via aggregering och anonymisering',
    additionalTerms: [
      'Databehandlingsavtal (DPA) tillgängligt',
      'Servrar inom EU',
      'Privacy by design',
    ],
  },
  US: {
    name: 'USA',
    notes: 'Liability disclaimers förstärkta',
    additionalTerms: [
      'No warranty disclaimer',
      'Limitation of liability',
      'Choice of law clause',
    ],
  },
  PUBLIC_SECTOR: {
    name: 'Offentlig sektor',
    notes: 'Upphandlingsbilagor tillgängliga',
    additionalTerms: [
      'LOU-kompatibla villkor',
      'Standardavtal för IT-tjänster',
      'Möjlighet till ramavtal',
    ],
  },
};

// Prissättningslogik
export const pricingLogic = {
  basedOn: [
    'Djup (NUTS-nivå)',
    'Frekvens (realtid vs daglig)',
    'Ansvarsnära signaler (feeds)',
    'SLA-nivå',
  ],
  notBasedOn: [
    'Antal datapunkter',
    'Antal förfrågningar (inom rimligt tak)',
    'Antal användare (inom organisation)',
  ],
};

// Platform identity
export const platformIdentity = {
  name: 'NOGF',
  tagline: 'Öppen verklighet. Betald förståelse.',
  mission: 'Infrastruktur för hur samhällen mäts och förstås.',
  principles: [
    'All data är öppen att se',
    'All intelligens är möjlig att köpa',
    'Metoder är transparenta',
    'Vikter är synliga',
    'Versioner är spårbara',
    'Historik är oföränderlig',
  ],
};
