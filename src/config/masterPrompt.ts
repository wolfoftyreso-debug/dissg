/**
 * MASTERPROMPT: Öppen samhällsöversikt – Sverige
 * 
 * SLUTLIG SYSTEMFILOSOFI
 * "Enkelhet på ytan, oändlighet i djupet"
 * 
 * Kärnprincip: Användaren ska aldrig behöva välja komplexitet – 
 * komplexiteten ska erbjuda sig själv vid rätt tillfälle.
 */

// ═══════════════════════════════════════════════════════════════
// I. SYSTEMETS SJÄL
// ═══════════════════════════════════════════════════════════════

export const MASTER_SYSTEM_PROMPT = `DU ÄR:
Ett neutralt, faktabaserat samhällsinformationssystem för landet Sverige.

DIN UPPGIFT:
Att sammanställa, strukturera och visa:
- hur Sverige utvecklas över tid
- vilka större beslut och styrperioder som sammanfaller med förändringar
- vilka ansvarsområden och styrande konstellationer som haft mandat
- vilket observerbart utfall som följt

DU TAR INGA STÄLLNINGSTAGANDEN.
DU GÖR INGA REKOMMENDATIONER.
DU VISAR ENDAST SAMBAND, TIDSLINJER OCH UTFALL.

---

## GRUNDPRINCIPER

1. ALL INFORMATION SKA VARA:
- tidsstämplad
- spårbar till källa
- aggregerad
- begriplig för allmänheten

2. SYSTEMET SKA ALLTID SKILJA PÅ:
- beslut
- ansvar
- utfall
- tolkning

DU VISAR DE TRE FÖRSTA.
TOLKNING LÄMNAS TILL ANVÄNDAREN.

---

## SPRÅKREGLER

DU ANVÄNDER:
- neutralt språk
- förklarande språk
- vardagligt begripligt språk

DU ANVÄNDER ALDRIG:
- värdeord
- laddade uttryck
- skuldformuleringar
- uppmaningar

---

## VIKTIGASTE REGELN

OM NÅGOT GÅR DÅLIGT:
DU VISAR DET.

OM NÅGOT GÅR BRA:
DU VISAR DET.

OM UTFALLET ÄR OTYDLIGT:
DU SÄGER ATT DET ÄR OTYDLIGT.

DU FYLLER ALDRIG I TOMRUM MED ÅSIKTER.

---

## SYSTEMETS ROLL I SAMHÄLLET

DU ÄR:
- ett gemensamt facit
- en öppen instrumentpanel
- ett historiskt arkiv över ansvar och utfall

DU ÄR INTE:
- domare
- aktör
- opposition
- försvarare

---

## SLUTSATS SOM SYSTEMET ALLTID IMPLICIT STÅR FÖR

"Detta är hur Sverige har utvecklats.
Detta är vad som beslutades.
Detta är vad som följde."

ALL ANNAN SLUTSATS TILLHÖR ANVÄNDAREN.`;

// ═══════════════════════════════════════════════════════════════
// II. DESIGNFILOSOFI — YTAN
// ═══════════════════════════════════════════════════════════════

/**
 * De tre frågorna varje vy ska svara på inom 5 sekunder
 */
export const CORE_QUESTIONS = {
  howIsItGoing: {
    sv: 'Hur går det?',
    en: 'How is it going?',
    requirement: 'Huvudindikator med trend synlig direkt',
  },
  whereIsItHappening: {
    sv: 'Var händer det?',
    en: 'Where is it happening?',
    requirement: 'Geografisk kontext tillgänglig med ett klick',
  },
  whyIsItHappening: {
    sv: 'Varför händer det?',
    en: 'Why is it happening?',
    requirement: 'Samvariation och ansvarsmappning tillgänglig',
  },
} as const;

/**
 * Startsidans prioriteringslogik
 * "Visa mig det viktiga"
 */
export const HOMEPAGE_PRIORITY_RULES = {
  principle: 'Startsidan är inte en meny – den är ett prioriteringsbeslut',
  
  criteria: [
    { id: 'impact', label: 'Påverkar flest människor', weight: 0.30 },
    { id: 'urgency', label: 'Påverkar mest just nu', weight: 0.25 },
    { id: 'recency', label: 'Har förändrats nyligen', weight: 0.20 },
    { id: 'breadth', label: 'Berör många områden', weight: 0.15 },
    { id: 'confidence', label: 'Hög datakvalitet', weight: 0.10 },
  ],
  
  userExperience: 'Användaren ska känna: "Okej, nu fattar jag läget."',
  
  fallbackMessage: 'Allt annat finns bakom klick.',
};

/**
 * Interaktionsfilosofi: Inga val, bara progression
 */
export const INTERACTION_PHILOSOPHY = {
  principle: 'Användaren ska inte behöva välja tekniska detaljer',
  
  systemHandles: [
    'datakälla',
    'analysmetod', 
    'normalisering',
    'aggregeringsnivå',
    'tidsperiod (default)',
  ],
  
  defaultMessage: 'Så här tittar vi på detta – vill du ändra?',
  
  qualities: ['inkluderande', 'pedagogiskt', 'kraftfullt'],
};

// ═══════════════════════════════════════════════════════════════
// III. DJUPFILOSOFI — OÄNDLIGT DJUP
// ═══════════════════════════════════════════════════════════════

/**
 * All data måste vara relationell
 */
export const RELATIONAL_DATA_REQUIREMENTS = {
  principle: 'Ingen datapunkt får existera isolerat',
  
  requiredRelations: [
    { field: 'kpi_id', description: 'Vilket KPI tillhör denna?' },
    { field: 'region_code', description: 'Vilken geografisk nivå?' },
    { field: 'demographic_dimensions', description: 'Vilka demografiska dimensioner?' },
    { field: 'period', description: 'Vilken tidsperiod?' },
    { field: 'responsibility_mapping', description: 'Vilket ansvar relaterar den till?' },
    { field: 'data_source_id', description: 'Vilken källa?' },
    { field: 'uncertainty', description: 'Vilken osäkerhet?' },
  ],
  
  enablesFeature: 'Oändligt djup möjligt',
};

/**
 * Rekursivt djup: Varje sak kan brytas ner
 */
export const RECURSIVE_DEPTH_QUESTIONS = [
  { question: 'Vad är detta?', depth: 'definition' },
  { question: 'Vad består det av?', depth: 'composition' },
  { question: 'Hur har det förändrats över tid?', depth: 'timeline' },
  { question: 'Vad samvarierar med detta?', depth: 'correlation' },
  { question: 'Vem bar ansvar när detta förändrades?', depth: 'responsibility' },
] as const;

export const RECURSIVE_DEPTH_APPLIES_TO = [
  'KPI',
  'kartor',
  'kluster',
  'politiker',
  'demografi',
  'simuleringar',
] as const;

/**
 * Skalbarhet utan kaos
 */
export const SCALE_PHILOSOPHY = {
  dataPoints: 'Miljontals datapunkter',
  apis: 'Hundratals API:er',
  history: 'Decennier av historik',
  
  userExperience: {
    always: [
      'en sak i taget',
      'i rätt kontext',
      'med förklaring i ord',
    ],
  },
  
  maxim: 'Data utan kontext är brus. Kontext utan data är bullshit. Ni levererar båda.',
};

// ═══════════════════════════════════════════════════════════════
// IV. INTERAKTIONSFILOSOFI — LEKFULL MEN KORREKT
// ═══════════════════════════════════════════════════════════════

/**
 * Jämförelser: Allt går att jämföra – säkert
 */
export const COMPARISON_RULES = {
  allowed: [
    'kön',
    'regioner',
    'tid',
    'politiska perioder',
    'demografi × utfall',
  ],
  
  safeguards: [
    { type: 'invalid', action: 'stoppar ogiltiga jämförelser' },
    { type: 'low_quality', action: 'varnar vid låg datakvalitet' },
    { type: 'uncertainty', action: 'visar osäkerhet visuellt' },
  ],
  
  result: 'Systemet blir pålitligt',
};

/**
 * Korrelation utan vilseledning
 */
export const CORRELATION_DISPLAY_RULES = {
  alwaysShow: [
    { field: 'strength', label: 'Styrka (r)' },
    { field: 'stability', label: 'Stabilitet över tid' },
    { field: 'lag', label: 'Tidsförskjutning' },
    { field: 'uncertainty', label: 'Osäkerhet/konfidensintervall' },
  ],
  
  mandatoryDisclaimer: 'Detta visar samvariation, inte orsak.',
  
  enables: ['brutalt ärligt', 'utan att bli oseriöst'],
};

// ═══════════════════════════════════════════════════════════════
// V. ANSVARSFILOSOFI
// ═══════════════════════════════════════════════════════════════

/**
 * Allt leder till ansvar (men pekar inte)
 */
export const RESPONSIBILITY_PHILOSOPHY = {
  question: 'Vem hade mandat när detta förändrades?',
  
  notAbout: [
    'vem orsakade',
    'vem är skyldig',
  ],
  
  isAbout: [
    'vem bar ansvaret',
  ],
  
  importance: 'Avgörande för legitimitet',
};

/**
 * Mastervärdet styr allt
 */
export const MASTER_INDEX_PHILOSOPHY = {
  name: 'Nationellt funktionsindex',
  
  is: [
    'Statsministerns ansvar',
    'Allmänhetens referens',
    'Systemets ryggrad',
  ],
  
  rule: 'Alla andra KPI:er är förklaringar, inte konkurrenter',
};

// ═══════════════════════════════════════════════════════════════
// VI. TEKNISK FILOSOFI
// ═══════════════════════════════════════════════════════════════

/**
 * Infinite by design
 */
export const INFINITE_DESIGN_PRINCIPLES = {
  principle: 'Systemet växer utan ombyggnad',
  
  extensibility: [
    { type: 'nya KPI:er', implementation: 'bara nya noder' },
    { type: 'nya datakällor', implementation: 'bara nya ingestflöden' },
    { type: 'nya vyer', implementation: 'bara nya filter' },
  ],
  
  result: 'Inget behöver skrivas om',
};

/**
 * Versionering
 */
export const VERSIONING_PHILOSOPHY = {
  versionedEntities: [
    'Data',
    'Metoder',
    'Definitioner',
    'Ansvarsmatris',
  ],
  
  guarantees: [
    'Historik förändras aldrig',
    'Debatt kan inte flyttas i efterhand',
  ],
};

// ═══════════════════════════════════════════════════════════════
// VII. SAMHÄLLSFILOSOFI
// ═══════════════════════════════════════════════════════════════

/**
 * Det viktigaste systemet gör
 */
export const SOCIETAL_PURPOSE = {
  delivers: [
    'en gemensam verklighetsbild',
    'ett gemensamt språk',
    'en gemensam referens',
  ],
  
  effect: 'Antipolarisering i praktiken',
  
  summary: `Ett öppet, interaktivt, djupt men begripligt samhällssystem
där allt som betyder något finns – och allt som inte betyder något filtreras bort.`,
  
  nature: 'Detta är inte ett projekt. Det är infrastruktur.',
  
  outcome: [
    'Politik blir mätbar',
    'Ansvar blir synligt',
    'Bullshit dör långsamt men säkert',
  ],
};

// ═══════════════════════════════════════════════════════════════
// BEFINTLIGA KONFIGURATIONER (UPPDATERADE)
// ═══════════════════════════════════════════════════════════════

/**
 * Konfiguration för nationell lägesbild
 */
export const NATIONAL_STATUS_CONFIG = {
  coreIndicators: [
    'life_expectancy',
    'working_age_functional',
    'excess_mortality',
    'long_term_exclusion',
    'productivity_per_hour',
    'violent_crime_rate',
    'dependency_ratio'
  ],
  
  statusLevels: {
    improving: {
      label: 'Förbättras',
      description: 'Positiv utveckling över tid',
      color: 'positive'
    },
    stable: {
      label: 'Stabilt',
      description: 'Ingen tydlig förändring',
      color: 'neutral'
    },
    declining: {
      label: 'Försämras',
      description: 'Negativ utveckling över tid',
      color: 'critical'
    }
  }
};

/**
 * Konfiguration för ansvarsvisning
 */
export const RESPONSIBILITY_DISPLAY_CONFIG = {
  showPersonNames: false,
  showStructureOnly: true,
  
  responsibilityTemplate: {
    national: 'Under perioden {startDate}–{endDate} låg det övergripande ansvaret för detta område på den sittande regeringen.',
    regional: 'Under perioden {startDate}–{endDate} låg ansvaret för detta område på {region}.',
    municipal: 'Under perioden {startDate}–{endDate} låg ansvaret för detta område på {municipality}.'
  }
};

/**
 * Konfiguration för utfallsanalys
 */
export const OUTCOME_ANALYSIS_CONFIG = {
  visualization: {
    improved: {
      label: 'Månader med förbättring',
      color: 'hsl(var(--status-positive))'
    },
    declined: {
      label: 'Månader med försämring',
      color: 'hsl(var(--status-critical))'
    },
    unchanged: {
      label: 'Månader utan tydlig förändring',
      color: 'hsl(var(--muted))'
    }
  },
  
  outcomeTemplate: 'Under denna styrperiod {direction} indikatorn under {months} av {totalMonths} månader.',
  disclaimer: 'Detta visar observerade utfall, inte avsikter.'
};

/**
 * Konfiguration för spårbarhet
 */
export const TRACEABILITY_CONFIG = {
  requiredFields: [
    'source',
    'updatedAt',
    'methodology',
    'uncertainty'
  ],
  
  transparencyNote: 'All data är spårbar till ursprungskälla.'
};

// ═══════════════════════════════════════════════════════════════
// SAMLAD EXPORT
// ═══════════════════════════════════════════════════════════════

export const SYSTEM_CONFIG = {
  // Själen
  masterPrompt: MASTER_SYSTEM_PROMPT,
  
  // Ytan
  coreQuestions: CORE_QUESTIONS,
  homepagePriority: HOMEPAGE_PRIORITY_RULES,
  interaction: INTERACTION_PHILOSOPHY,
  
  // Djupet
  relationalData: RELATIONAL_DATA_REQUIREMENTS,
  recursiveDepth: { questions: RECURSIVE_DEPTH_QUESTIONS, appliesTo: RECURSIVE_DEPTH_APPLIES_TO },
  scale: SCALE_PHILOSOPHY,
  
  // Interaktion
  comparison: COMPARISON_RULES,
  correlation: CORRELATION_DISPLAY_RULES,
  
  // Ansvar
  responsibility: RESPONSIBILITY_PHILOSOPHY,
  responsibilityDisplay: RESPONSIBILITY_DISPLAY_CONFIG,
  masterIndex: MASTER_INDEX_PHILOSOPHY,
  
  // Teknik
  infiniteDesign: INFINITE_DESIGN_PRINCIPLES,
  versioning: VERSIONING_PHILOSOPHY,
  
  // Samhälle
  purpose: SOCIETAL_PURPOSE,
  
  // Befintliga
  nationalStatus: NATIONAL_STATUS_CONFIG,
  outcomeAnalysis: OUTCOME_ANALYSIS_CONFIG,
  traceability: TRACEABILITY_CONFIG,
};
