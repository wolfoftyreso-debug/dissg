/**
 * GLOBAL ICON REGISTRY
 * ═══════════════════════════════════════════════════════════════
 * 
 * Every icon in the system is registered here with:
 * - Semantic meaning
 * - Deep-dive content (explanation pyramid)
 * - Related concepts
 * - Data sources
 * 
 * Following Spotless Protocol: Nothing displayed without depth.
 */

export interface IconDefinition {
  id: string;
  name: string;
  nameSv: string;
  category: 'status' | 'domain' | 'action' | 'metric' | 'warning' | 'navigation' | 'substance' | 'health' | 'governance';
  description: string;
  descriptionSv: string;
  whatItShows: string[];
  whatItDoesNotShow: string[];
  relatedConcepts: string[];
  dataSource?: string;
  learnMoreUrl?: string;
}

export const ICON_REGISTRY: Record<string, IconDefinition> = {
  // STATUS ICONS
  'trending-up': {
    id: 'trending-up',
    name: 'Upward Trend',
    nameSv: 'Uppåtgående trend',
    category: 'status',
    description: 'Indicates a value is increasing over the measured period',
    descriptionSv: 'Indikerar att ett värde ökar under mätperioden',
    whatItShows: [
      'Riktning på förändring (upp)',
      'Att data finns för minst två tidpunkter',
      'Relativ förändring, inte absolut nivå'
    ],
    whatItDoesNotShow: [
      'Om ökningen är bra eller dålig (kontextberoende)',
      'Orsaken till förändringen',
      'Storleken på förändringen',
      'Om trenden kommer fortsätta'
    ],
    relatedConcepts: ['trend-analysis', 'time-series', 'rate-of-change']
  },
  'trending-down': {
    id: 'trending-down',
    name: 'Downward Trend',
    nameSv: 'Nedåtgående trend',
    category: 'status',
    description: 'Indicates a value is decreasing over the measured period',
    descriptionSv: 'Indikerar att ett värde minskar under mätperioden',
    whatItShows: [
      'Riktning på förändring (ned)',
      'Att data finns för minst två tidpunkter',
      'Relativ förändring, inte absolut nivå'
    ],
    whatItDoesNotShow: [
      'Om minskningen är bra eller dålig (kontextberoende)',
      'Orsaken till förändringen',
      'Storleken på förändringen',
      'Om trenden kommer fortsätta'
    ],
    relatedConcepts: ['trend-analysis', 'time-series', 'rate-of-change']
  },
  'minus': {
    id: 'minus',
    name: 'Stable/No Change',
    nameSv: 'Stabil/Ingen förändring',
    category: 'status',
    description: 'Indicates a value has remained relatively stable',
    descriptionSv: 'Indikerar att ett värde har förblivit relativt stabilt',
    whatItShows: [
      'Ingen signifikant förändring detekterad',
      'Värdet ligger inom normal variation'
    ],
    whatItDoesNotShow: [
      'Om stabilitet är önskvärt',
      'Underliggande fluktuation',
      'Tröskelvärde för "signifikant"'
    ],
    relatedConcepts: ['statistical-significance', 'baseline', 'normal-range']
  },

  // DOMAIN ICONS
  'zap': {
    id: 'zap',
    name: 'Energy',
    nameSv: 'Energi',
    category: 'domain',
    description: 'Represents energy systems, power, and electricity access',
    descriptionSv: 'Representerar energisystem, kraft och tillgång till elektricitet',
    whatItShows: [
      'Energirelaterade indikatorer',
      'Kraftproduktion och distribution',
      'Elektrifiering'
    ],
    whatItDoesNotShow: [
      'Specifik energikälla',
      'Energikvalitet',
      'Kostnad för energi'
    ],
    relatedConcepts: ['energy-access', 'electrification', 'renewable-energy', 'carrying-capacity'],
    dataSource: 'IEA, World Bank'
  },
  'users': {
    id: 'users',
    name: 'Population',
    nameSv: 'Befolkning',
    category: 'domain',
    description: 'Represents population, demographics, and human capital',
    descriptionSv: 'Representerar befolkning, demografi och humankapital',
    whatItShows: [
      'Befolkningsrelaterade indikatorer',
      'Demografiska data',
      'Mänskliga resurser'
    ],
    whatItDoesNotShow: [
      'Befolkningens sammansättning',
      'Migrationsmönster',
      'Livskvalitet'
    ],
    relatedConcepts: ['demography', 'fertility', 'mortality', 'migration'],
    dataSource: 'UN DESA, World Bank'
  },
  'building-2': {
    id: 'building-2',
    name: 'Institutions',
    nameSv: 'Institutioner',
    category: 'governance',
    description: 'Represents governance, institutions, and state capacity',
    descriptionSv: 'Representerar styrning, institutioner och statskapacitet',
    whatItShows: [
      'Institutionell kapacitet',
      'Styrningsstrukturer',
      'Offentlig förvaltning'
    ],
    whatItDoesNotShow: [
      'Kvalitet på tjänster',
      'Korruptionsnivå',
      'Demokratisk legitimitet'
    ],
    relatedConcepts: ['governance', 'state-capacity', 'rule-of-law', 'corruption'],
    dataSource: 'World Bank WGI, V-Dem'
  },
  'map-pin': {
    id: 'map-pin',
    name: 'Geographic Location',
    nameSv: 'Geografisk plats',
    category: 'navigation',
    description: 'Indicates a specific geographic area or region',
    descriptionSv: 'Indikerar ett specifikt geografiskt område eller region',
    whatItShows: [
      'Geografisk avgränsning',
      'Regional kontext'
    ],
    whatItDoesNotShow: [
      'Exakta gränser',
      'Administrativa nivåer',
      'Politiska indelningar'
    ],
    relatedConcepts: ['geography', 'region', 'territory']
  },

  // WARNING ICONS
  'alert-triangle': {
    id: 'alert-triangle',
    name: 'Warning/Pressure',
    nameSv: 'Varning/Tryck',
    category: 'warning',
    description: 'Indicates elevated risk, pressure, or attention needed',
    descriptionSv: 'Indikerar förhöjd risk, tryck eller att uppmärksamhet behövs',
    whatItShows: [
      'Att något avviker från önskat tillstånd',
      'Att risk eller tryck har identifierats',
      'Att närmare granskning rekommenderas'
    ],
    whatItDoesNotShow: [
      'Vad som orsakat situationen',
      'Hur allvarlig situationen är (utan kontext)',
      'Vad som bör göras'
    ],
    relatedConcepts: ['risk', 'vulnerability', 'threshold', 'alert']
  },
  'info': {
    id: 'info',
    name: 'Information',
    nameSv: 'Information',
    category: 'navigation',
    description: 'Additional context or explanation available',
    descriptionSv: 'Ytterligare kontext eller förklaring tillgänglig',
    whatItShows: [
      'Att mer information finns',
      'Att klick ger fördjupning'
    ],
    whatItDoesNotShow: [
      'Vilken typ av information',
      'Hur viktig informationen är'
    ],
    relatedConcepts: ['context', 'explanation', 'deep-dive']
  },

  // SUBSTANCE ICONS
  'wine': {
    id: 'wine',
    name: 'Alcohol',
    nameSv: 'Alkohol',
    category: 'substance',
    description: 'Represents alcohol consumption and related indicators',
    descriptionSv: 'Representerar alkoholkonsumtion och relaterade indikatorer',
    whatItShows: [
      'Alkoholrelaterade data',
      'Konsumtionsmönster',
      'Hälsoeffekter av alkohol'
    ],
    whatItDoesNotShow: [
      'Typ av alkohol',
      'Konsumtionsmönster (binge vs regelbunden)',
      'Individuella skillnader'
    ],
    relatedConcepts: ['alcohol-use-disorder', 'binge-drinking', 'liver-disease'],
    dataSource: 'WHO GHO',
    learnMoreUrl: '/strim/substances/alcohol'
  },
  'cigarette': {
    id: 'cigarette',
    name: 'Tobacco',
    nameSv: 'Tobak',
    category: 'substance',
    description: 'Represents tobacco use and related indicators',
    descriptionSv: 'Representerar tobaksanvändning och relaterade indikatorer',
    whatItShows: [
      'Tobaksrelaterade data',
      'Rökning och snusanvändning',
      'Hälsoeffekter av tobak'
    ],
    whatItDoesNotShow: [
      'Typ av tobaksprodukt',
      'Passiv rökning',
      'E-cigaretter separat'
    ],
    relatedConcepts: ['smoking', 'nicotine', 'lung-cancer', 'COPD'],
    dataSource: 'WHO GTSS',
    learnMoreUrl: '/strim/substances/tobacco'
  },
  'pill': {
    id: 'pill',
    name: 'Pharmaceutical/Substance',
    nameSv: 'Läkemedel/Substans',
    category: 'substance',
    description: 'Represents pharmaceutical drugs or controlled substances',
    descriptionSv: 'Representerar läkemedel eller kontrollerade substanser',
    whatItShows: [
      'Substansrelaterade data',
      'Läkemedelsanvändning',
      'Generisk substansindikator'
    ],
    whatItDoesNotShow: [
      'Specifik substans',
      'Legal status',
      'Administreringsväg'
    ],
    relatedConcepts: ['pharmacology', 'drug-use', 'prescription'],
    learnMoreUrl: '/strim/substances'
  },
  'syringe': {
    id: 'syringe',
    name: 'Injectable/Opioids',
    nameSv: 'Injektions/Opioider',
    category: 'substance',
    description: 'Represents injectable drugs, typically opioids',
    descriptionSv: 'Representerar injicerbara droger, typiskt opioider',
    whatItShows: [
      'Opioidrelaterade data',
      'Injektionsanvändning',
      'Hög-risk substansbruk'
    ],
    whatItDoesNotShow: [
      'Specifik opioid',
      'Legal vs illegal källa',
      'Orsak till användning'
    ],
    relatedConcepts: ['opioid-crisis', 'heroin', 'fentanyl', 'needle-exchange'],
    dataSource: 'UNODC',
    learnMoreUrl: '/strim/substances/opioids'
  },

  // HEALTH ICONS
  'heart': {
    id: 'heart',
    name: 'Health',
    nameSv: 'Hälsa',
    category: 'health',
    description: 'Represents health indicators and wellbeing',
    descriptionSv: 'Representerar hälsoindikatorer och välbefinnande',
    whatItShows: [
      'Hälsorelaterade data',
      'Fysisk och psykisk hälsa',
      'Vårdtillgång'
    ],
    whatItDoesNotShow: [
      'Specifik sjukdom',
      'Vårdkvalitet',
      'Hälsojämlikhet'
    ],
    relatedConcepts: ['public-health', 'healthcare', 'wellbeing'],
    dataSource: 'WHO, IHME'
  },
  'activity': {
    id: 'activity',
    name: 'Health Metrics',
    nameSv: 'Hälsomått',
    category: 'health',
    description: 'Represents measurable health outcomes and vital signs',
    descriptionSv: 'Representerar mätbara hälsoutfall och vitalparametrar',
    whatItShows: [
      'Kvantifierbara hälsodata',
      'Trender i hälsoutfall',
      'Befolkningshälsa'
    ],
    whatItDoesNotShow: [
      'Individuella variationer',
      'Subjektiv hälsoupplevelse',
      'Underliggande orsaker'
    ],
    relatedConcepts: ['epidemiology', 'biostatistics', 'health-outcomes'],
    dataSource: 'WHO, GBD'
  },
  'skull': {
    id: 'skull',
    name: 'Mortality/Deaths',
    nameSv: 'Mortalitet/Dödsfall',
    category: 'health',
    description: 'Represents death counts, mortality rates, or lethal outcomes',
    descriptionSv: 'Representerar dödstal, mortalitet eller dödliga utfall',
    whatItShows: [
      'Antal dödsfall',
      'Dödlighet relaterad till specifik orsak',
      'Mortalitetsgrad'
    ],
    whatItDoesNotShow: [
      'Livskvalitet innan död',
      'Förebyggbara vs oundvikliga dödsfall',
      'Indirekt orsakade dödsfall'
    ],
    relatedConcepts: ['mortality-rate', 'cause-of-death', 'DALY', 'YLL'],
    dataSource: 'WHO, IHME GBD'
  },

  // METRIC ICONS
  'globe': {
    id: 'globe',
    name: 'Global/International',
    nameSv: 'Global/Internationell',
    category: 'domain',
    description: 'Indicates global scope or international data',
    descriptionSv: 'Indikerar global omfattning eller internationella data',
    whatItShows: [
      'Världsomspännande data',
      'Internationella jämförelser',
      'Global aggregering'
    ],
    whatItDoesNotShow: [
      'Nationella variationer',
      'Regionala skillnader',
      'Datakvalitet per land'
    ],
    relatedConcepts: ['global-health', 'international-comparison', 'SDG'],
    dataSource: 'UN, WHO, World Bank'
  },
  'database': {
    id: 'database',
    name: 'Data Source',
    nameSv: 'Datakälla',
    category: 'navigation',
    description: 'Indicates access to underlying data or source',
    descriptionSv: 'Indikerar tillgång till underliggande data eller källa',
    whatItShows: [
      'Att data är tillgänglig',
      'Att källan är spårbar',
      'Transparens i data'
    ],
    whatItDoesNotShow: [
      'Datakvalitet',
      'Uppdateringsfrekvens',
      'Fullständighet'
    ],
    relatedConcepts: ['data-transparency', 'source', 'methodology']
  },
  'bar-chart-3': {
    id: 'bar-chart-3',
    name: 'Statistics/Chart',
    nameSv: 'Statistik/Diagram',
    category: 'metric',
    description: 'Indicates statistical data or visualization available',
    descriptionSv: 'Indikerar att statistiska data eller visualisering finns',
    whatItShows: [
      'Kvantitativa data',
      'Jämförbara värden',
      'Visuell representation'
    ],
    whatItDoesNotShow: [
      'Statistisk signifikans',
      'Konfidensintervall',
      'Samplingsfel'
    ],
    relatedConcepts: ['statistics', 'visualization', 'comparison']
  },
  'scale': {
    id: 'scale',
    name: 'Balance/Comparison',
    nameSv: 'Balans/Jämförelse',
    category: 'metric',
    description: 'Indicates comparative analysis or trade-offs',
    descriptionSv: 'Indikerar jämförande analys eller avvägningar',
    whatItShows: [
      'Relativa skillnader',
      'Trade-offs mellan alternativ',
      'Balans mellan faktorer'
    ],
    whatItDoesNotShow: [
      'Vilket alternativ som är "bäst"',
      'Vikter i jämförelsen',
      'Värderingsgrunder'
    ],
    relatedConcepts: ['trade-off', 'comparison', 'cost-benefit']
  },
  'clock': {
    id: 'clock',
    name: 'Time/History',
    nameSv: 'Tid/Historia',
    category: 'navigation',
    description: 'Indicates temporal data or historical context',
    descriptionSv: 'Indikerar tidsdata eller historisk kontext',
    whatItShows: [
      'Tidsdimension i data',
      'Historisk utveckling',
      'Tidsperiod'
    ],
    whatItDoesNotShow: [
      'Framtida utveckling',
      'Cykliska mönster',
      'Kausalitet över tid'
    ],
    relatedConcepts: ['time-series', 'historical-analysis', 'periodization']
  },

  // ACTION ICONS
  'chevron-right': {
    id: 'chevron-right',
    name: 'Drill Down/More',
    nameSv: 'Fördjupa/Mer',
    category: 'navigation',
    description: 'Indicates more detail available on click',
    descriptionSv: 'Indikerar att mer detalj finns vid klick',
    whatItShows: [
      'Att elementet är klickbart',
      'Att fördjupning finns',
      'Navigation till nästa nivå'
    ],
    whatItDoesNotShow: [
      'Vad fördjupningen innehåller',
      'Hur djupt man kan gå'
    ],
    relatedConcepts: ['navigation', 'hierarchy', 'drill-down']
  },
  'external-link': {
    id: 'external-link',
    name: 'External Source',
    nameSv: 'Extern källa',
    category: 'navigation',
    description: 'Opens link to external website or resource',
    descriptionSv: 'Öppnar länk till extern webbplats eller resurs',
    whatItShows: [
      'Att länken går utanför systemet',
      'Tillgång till originalkälla',
      'Tredjepartsinformation'
    ],
    whatItDoesNotShow: [
      'Kvalitet på extern källa',
      'Aktualitet på extern information',
      'Om sidan kräver inloggning'
    ],
    relatedConcepts: ['source', 'reference', 'external-data']
  },
  'book-open': {
    id: 'book-open',
    name: 'Documentation/Learn',
    nameSv: 'Dokumentation/Lär',
    category: 'navigation',
    description: 'Access to educational content or documentation',
    descriptionSv: 'Tillgång till utbildningsinnehåll eller dokumentation',
    whatItShows: [
      'Förklarande material finns',
      'Pedagogiskt innehåll',
      'Metodbeskrivning'
    ],
    whatItDoesNotShow: [
      'Förkunskapskrav',
      'Längd på material',
      'Uppdateringsdatum'
    ],
    relatedConcepts: ['education', 'methodology', 'explanation']
  },
  'file-text': {
    id: 'file-text',
    name: 'Document/Report',
    nameSv: 'Dokument/Rapport',
    category: 'navigation',
    description: 'Access to formal document or report',
    descriptionSv: 'Tillgång till formellt dokument eller rapport',
    whatItShows: [
      'Formell dokumentation',
      'Detaljerad rapport',
      'Officiell källa'
    ],
    whatItDoesNotShow: [
      'Dokumentets längd',
      'Sammanfattning av innehåll',
      'Publiceringsdatum'
    ],
    relatedConcepts: ['report', 'documentation', 'official-source']
  }
};

// Helper to get icon definition
export function getIconDefinition(iconId: string): IconDefinition | undefined {
  return ICON_REGISTRY[iconId];
}

// Get all icons by category
export function getIconsByCategory(category: IconDefinition['category']): IconDefinition[] {
  return Object.values(ICON_REGISTRY).filter(icon => icon.category === category);
}

// Search icons
export function searchIcons(query: string): IconDefinition[] {
  const lowerQuery = query.toLowerCase();
  return Object.values(ICON_REGISTRY).filter(icon => 
    icon.name.toLowerCase().includes(lowerQuery) ||
    icon.nameSv.toLowerCase().includes(lowerQuery) ||
    icon.description.toLowerCase().includes(lowerQuery) ||
    icon.descriptionSv.toLowerCase().includes(lowerQuery)
  );
}
