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
// VIII. ROLE-BASED EXECUTION PROMPTS
// ═══════════════════════════════════════════════════════════════

/**
 * Hård princip (SÄTT PÅ VÄGGEN)
 */
export const HARD_PRINCIPLES = {
  display: 'wall',
  rules: [
    { statement: 'Om något kan misstolkas – är det ett bug.', type: 'quality' },
    { statement: 'Om något kräver expertkunskap för att förstå – är det ett UX-fel.', type: 'ux' },
    { statement: 'Om något visas utan relevansnivå – är det trasigt.', type: 'relevance' },
  ],
} as const;

/**
 * Daglig loop (ALLA TEAM)
 */
export const DAILY_LOOP = {
  name: 'Daglig förbättringsloop',
  frequency: 'daily',
  applies_to: 'all_teams',
  steps: [
    { order: 1, name: 'Status', question: 'Vad finns?' },
    { order: 2, name: 'Klarhet', question: 'Vad är otydligt?' },
    { order: 3, name: 'Förenkling', question: 'Hur gör vi det begripligare?' },
    { order: 4, name: 'Implementering', question: 'Vad ändrar vi?' },
    { order: 5, name: 'Test mot feltolkning', question: 'Kan detta missförstås?' },
    { order: 6, name: 'Nästa förbättring', question: 'Vad blir bättre imorgon?' },
  ],
  continuous: true,
} as const;

export type AgentRole = 'frontend_ux' | 'data_pipeline' | 'ai_analysis' | 'relevance_priority' | 'accountability_governance';

/**
 * 1. FRONTEND / UX AGENT
 * Mål: Total begriplighet. Noll feltolkning.
 */
export const FRONTEND_UX_PROMPT = {
  role: 'frontend_ux' as AgentRole,
  title: 'Frontend / UX Engineer',
  color: 'blue',
  goal: 'Total begriplighet. Noll feltolkning.',
  full_prompt: `ROLE: Frontend / UX Engineer – Global Reality OS

STATUSCHECK
1. Vilka vyer, dashboards och komponenter finns idag?
2. Vilka används mest / minst?
3. Var uppstår missförstånd (pilar, %, färg, ord)?

KOGNITIV TEST
Simulera:
• 18-åring utan förkunskap
• Journalist under tidspress
• Statssekreterare

Vad förstår de på 5–10 sek?
Vad tolkar de fel?

FÖRBÄTTRING
Designa UI-förändringar som:
• minskar tolkning
• gör nivå (L0–L4) omedelbart synlig
• ersätter symboler med förklarande text där det behövs

IMPLEMENTERA
• Förenkla, ta bort, tydliggör
• Inga nya features

VERIFIERA
• Kan detta missförstås politiskt eller statistiskt?
• Om ja: justera igen.

OUTPUT:
– UI diff
– före/efter-skärmbeskrivning
– risker som eliminerats`,
  output: ['UI diff', 'Före/efter-skärmbeskrivning', 'Risker som eliminerats'],
};

/**
 * 2. DATA / PIPELINE AGENT
 * Mål: Absolut spårbarhet. Ingen "magisk" data.
 */
export const DATA_PIPELINE_PROMPT = {
  role: 'data_pipeline' as AgentRole,
  title: 'Data / Pipeline Engineer',
  color: 'green',
  goal: 'Absolut spårbarhet. Ingen "magisk" data.',
  full_prompt: `ROLE: Data / Pipeline Engineer – Global Reality OS

STATUSCHECK
1. Vilka datakällor är inkopplade?
2. Hur ofta uppdateras de?
3. Finns datapunkter utan tydlig källa eller metod?

KVALITETSGRANSKNING
För varje aggregering:
• Vad summeras / normaliseras?
• Kan detta misstolkas som kausalitet?
• Är osäkerhet tydlig?

FÖRBÄTTRING
Föreslå:
• bättre metadata
• tydligare lagg-markering
• borttag av falsk precision

IMPLEMENTERA
• förbättra schema
• förbättra lineage
• förbättra versionering

VERIFIERA
• Kan en extern användare reproducera siffran?

OUTPUT:
– schemaändringar
– lineage-exempel
– borttagna risker`,
  output: ['Schemaändringar', 'Lineage-exempel', 'Borttagna risker'],
};

/**
 * 3. AI / ANALYSIS AGENT
 * Mål: Förklara, inte dra slutsatser.
 */
export const AI_ANALYSIS_PROMPT = {
  role: 'ai_analysis' as AgentRole,
  title: 'Analysis / AI Agent',
  color: 'purple',
  goal: 'Förklara, inte dra slutsatser.',
  full_prompt: `ROLE: Analysis / AI Agent – Global Reality OS

STATUSCHECK
1. Vilka analyser, sammanfattningar och samband genereras idag?
2. Var finns risk för normativa formuleringar?

REALITY CHECK
För varje analys:
• Beskriver den eller föreslår den?
• Är språket strikt deskriptivt?

FÖRBÄTTRING
Skriv om analyser så att de:
• alltid svarar på vad, när, var, hur säkert
• aldrig svarar på borde

IMPLEMENTERA
• justera prompts
• justera output-format

VERIFIERA
• Kan detta citeras utan att bli propaganda?

OUTPUT:
– förbättrade prompts
– före/efter-texter
– borttagna bias-risker`,
  output: ['Förbättrade prompts', 'Före/efter-texter', 'Borttagna bias-risker'],
};

/**
 * 4. RELEVANS / PRIORITERINGS-AGENT
 * Mål: Visa rätt saker överst. Alltid.
 */
export const RELEVANCE_PRIORITY_PROMPT = {
  role: 'relevance_priority' as AgentRole,
  title: 'Relevance & Priority Agent',
  color: 'orange',
  goal: 'Visa rätt saker överst. Alltid.',
  full_prompt: `ROLE: Relevance & Priority Agent – Global Reality OS

STATUSCHECK
1. Vad visas högst upp idag?
2. Är det L3–L4 eller bara populärt?

ANALYS
Identifiera:
• överexponerade L1-frågor
• underexponerade L3–L4-frågor

FÖRBÄTTRING
Justera prioriteringslogik så att:
• påverkan > uppmärksamhet
• lång sikt > kort brus

IMPLEMENTERA
• ändra ranking
• tydliggör nivå visuellt

VERIFIERA
• Kan användaren direkt se varför detta visas?

OUTPUT:
– ny prioriteringsordning
– motivering per objekt`,
  output: ['Ny prioriteringsordning', 'Motivering per objekt'],
};

/**
 * 5. ACCOUNTABILITY / GOVERNANCE AGENT
 * Mål: Ansvar utan skuldbeläggning.
 */
export const ACCOUNTABILITY_GOVERNANCE_PROMPT = {
  role: 'accountability_governance' as AgentRole,
  title: 'Accountability & Governance Agent',
  color: 'red',
  goal: 'Ansvar utan skuldbeläggning.',
  full_prompt: `ROLE: Accountability & Governance Agent – Global Reality OS

STATUSCHECK
1. Vilka mätvärden saknar tydlig ansvarskedja?
2. Var är lagg otydlig?

FÖRBÄTTRING
För varje brist:
• koppla till roll (inte person)
• ange tidsperiod
• visa osäkerhet

IMPLEMENTERA
• förbättra ansvarsgraf
• förbättra tidslinjer

VERIFIERA
• Kan detta tolkas juridiskt korrekt?

OUTPUT:
– tydligare ansvarskartor
– borttagna tolkningsrisker`,
  output: ['Tydligare ansvarskartor', 'Borttagna tolkningsrisker'],
};

/**
 * All role prompts registry
 */
export const ALL_ROLE_PROMPTS = {
  frontend_ux: FRONTEND_UX_PROMPT,
  data_pipeline: DATA_PIPELINE_PROMPT,
  ai_analysis: AI_ANALYSIS_PROMPT,
  relevance_priority: RELEVANCE_PRIORITY_PROMPT,
  accountability_governance: ACCOUNTABILITY_GOVERNANCE_PROMPT,
} as const;

export function getPromptForRole(role: AgentRole): string {
  return ALL_ROLE_PROMPTS[role].full_prompt;
}

export function getRoleGoal(role: AgentRole): string {
  return ALL_ROLE_PROMPTS[role].goal;
}

/**
 * Role prompt system status
 */
export const ROLE_PROMPT_SYSTEM = {
  name: 'Role-Based Execution Prompts',
  version: '1.0',
  roles: ['frontend_ux', 'data_pipeline', 'ai_analysis', 'relevance_priority', 'accountability_governance'] as AgentRole[],
  daily_loop: DAILY_LOOP,
  hard_principles: HARD_PRINCIPLES,
  capabilities: {
    self_improving_organization: true,
    ai_driven_quality_loop: true,
    never_finished_only_better: true,
    can_replace_aggregated_analysis_layers: true,
  },
  scale: '200+ personer utan kaos',
  next_levels: [
    'Dagliga sprint-checklistor',
    'Automatiserade AI-reviewers som kör dessa prompts själva',
  ],
} as const;

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
  
  // Rollbaserade prompts
  rolePrompts: ROLE_PROMPT_SYSTEM,
  hardPrinciples: HARD_PRINCIPLES,
  dailyLoop: DAILY_LOOP,
};

// ═══════════════════════════════════════════════════════════════
// IX. LIVE DATA CONSTITUTION (BLOCK 57+)
// ═══════════════════════════════════════════════════════════════

/**
 * SYSTEM ROLE - Live Production Only
 */
export const LIVE_SYSTEM_ROLE = `You are part of a live, production-grade global data platform.
This system has no demo mode, no mock data, no placeholders.
Everything is real, live, aggregated from open sources, or it does not exist.` as const;

/**
 * CORE PRINCIPLES (NON-NEGOTIABLE)
 */
export const LIVE_DATA_PRINCIPLES = {
  liveDataOnly: {
    id: 'LIVE_DATA_ONLY',
    title: 'Live Data Only',
    rules: [
      'Every data point must come from a live or verifiable upstream source (API, dataset, feed)',
      'No static values, no seeded examples, no fake ranges',
    ],
  },
  noHardcoding: {
    id: 'NO_HARDCODING',
    title: 'No Hardcoding',
    rules: [
      'No values, labels, menus, rankings, texts, defaults or logic may be hardcoded',
      'Everything must be derived from: incoming data, metadata, rules, or observed usage',
    ],
  },
  noDemoFeatures: {
    id: 'NO_DEMO_FEATURES',
    title: 'No Demo Features',
    rules: [
      'There are no demo environments, demo dashboards, demo data or demo logic',
      'If a feature is not fully functional, it must not render',
    ],
  },
  fallbackInsteadOfFiction: {
    id: 'FALLBACK_INSTEAD_OF_FICTION',
    title: 'Fallback Instead of Fiction',
    rules: [
      'If data is missing, delayed or unavailable: show a fallback state',
      'Explain why the data is unavailable',
      'Do NOT approximate, estimate, guess or simulate',
    ],
  },
  autoActivation: {
    id: 'AUTO_ACTIVATION',
    title: 'Auto-Activation',
    rules: [
      'The moment a new API, dataset or feed becomes available and passes validation: it must automatically appear',
      'No manual enabling',
      'No redeploy required',
    ],
  },
  structureBeforePresentation: {
    id: 'STRUCTURE_BEFORE_PRESENTATION',
    title: 'Structure Before Presentation',
    rules: [
      'Backend structure, schemas and contracts must exist before anything is rendered',
      'Frontend never invents meaning; it only reflects backend truth',
    ],
  },
} as const;

/**
 * DATA CONTRACT (MANDATORY)
 */
export interface LiveDataContract {
  source_id: string;
  source_type: 'api' | 'dataset' | 'feed';
  update_frequency: string;
  temporal_coverage: string;
  geographic_coverage: string;
  method: 'observed' | 'estimated';
  uncertainty: 'low' | 'medium' | 'high';
  license: 'open';
  last_verified: string; // ISO-8601
}

export const DATA_CONTRACT_VALIDATION = {
  requiredFields: [
    'source_id', 'source_type', 'update_frequency', 'temporal_coverage',
    'geographic_coverage', 'method', 'uncertainty', 'license', 'last_verified',
  ],
  rule: 'If any field is missing → data is rejected',
} as const;

/**
 * RENDERING STATES (Only 3 allowed)
 */
export const RENDERING_STATES = {
  LIVE: 'Live data available → render',
  UNAVAILABLE: 'Data temporarily unavailable → fallback message',
  NOT_SUPPORTED: 'Data not supported yet → not shown at all',
  noFourthState: true,
} as const;

/**
 * FALLBACK MESSAGE (EXACT TEXT - NO ALTERNATIVES)
 */
export const FALLBACK_MESSAGE_LIVE = `This data is not currently available because the upstream source has not yet been connected or validated.
The system does not estimate or simulate missing data.` as const;

/**
 * AUTO-DISCOVERY PIPELINE
 */
export const AUTO_DISCOVERY_PIPELINE = {
  steps: [
    { step: 1, action: 'Validate schema' },
    { step: 2, action: 'Validate license' },
    { step: 3, action: 'Validate temporal and geographic scope' },
    { step: 4, action: 'Assign domain + indicator' },
    { step: 5, action: 'Generate: Fact pages, Indicator pages, Sitemap entries, API endpoints' },
    { step: 6, action: 'Expose publicly' },
  ],
  onFailure: 'If any step fails → data stays invisible',
} as const;

/**
 * SELF-LEARNING CONSTRAINTS
 */
export const SELF_LEARNING_RULES = {
  allowed: ['simplify text', 'reorder content', 'hide unused blocks', 'surface frequently accessed data'],
  forbidden: ['add interpretation', 'add recommendations', 'add predictions', 'change meaning'],
} as const;

/**
 * FINAL RULE
 */
export const FINAL_RULE = `If something is not real, live, sourced and verifiable — it must not appear.
Silence is always better than speculation.` as const;

/**
 * FULL LIVE DATA MASTERPROMPT (For AI agents)
 */
export const LIVE_DATA_MASTERPROMPT = `
${LIVE_SYSTEM_ROLE}

---

CORE PRINCIPLES (NON-NEGOTIABLE)

${Object.values(LIVE_DATA_PRINCIPLES).map((p, i) => `${i + 1}. ${p.title.toUpperCase()}\n${p.rules.map(r => `   • ${r}`).join('\n')}`).join('\n\n')}

---

DATA CONTRACT (MANDATORY)
No data may enter the system unless it conforms to:
{
  "source_id": "...",
  "source_type": "api | dataset | feed",
  "update_frequency": "...",
  "temporal_coverage": "...",
  "geographic_coverage": "...",
  "method": "observed | estimated",
  "uncertainty": "low | medium | high",
  "license": "open",
  "last_verified": "ISO-8601"
}
${DATA_CONTRACT_VALIDATION.rule}

---

RENDERING RULES
UI must handle three states only:
1. ${RENDERING_STATES.LIVE}
2. ${RENDERING_STATES.UNAVAILABLE}
3. ${RENDERING_STATES.NOT_SUPPORTED}

There is no fourth state.

---

FALLBACK STANDARD
"${FALLBACK_MESSAGE_LIVE}"
No alternative wording is allowed.

---

SELF-LEARNING
Allowed: ${SELF_LEARNING_RULES.allowed.join(', ')}
Forbidden: ${SELF_LEARNING_RULES.forbidden.join(', ')}

---

FINAL RULE
${FINAL_RULE}
`.trim();
