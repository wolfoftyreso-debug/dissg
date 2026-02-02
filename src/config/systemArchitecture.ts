/**
 * 🧱 TOTAL SYSTEM ARCHITECTURE — FINAL FORM
 * 
 * GLOBAL TRANSPARENCY & ANALYTICS INFRASTRUCTURE
 * 
 * This is not vision. This is implementable system blueprint.
 */

// ============================================================
// I. CORE PRINCIPLES (LOCKED, GLOBAL)
// ============================================================

export const CORE_PRINCIPLES = {
  title: { en: 'Core Principles', sv: 'Kärnprinciper' },
  subtitle: { en: 'Apply everywhere: all code, all text, all AI', sv: 'Gäller överallt: all kod, all text, all AI' },
  principles: [
    { id: 'P01', en: 'Observation before interpretation', sv: 'Observation före tolkning' },
    { id: 'P02', en: 'No recommendation from the system', sv: 'Ingen rekommendation från systemet' },
    { id: 'P03', en: 'Everything is traceable to source', sv: 'Allt är spårbart till källa' },
    { id: 'P04', en: 'Uncertainty is always shown', sv: 'Osäkerhet visas alltid' },
    { id: 'P05', en: 'User is responsible for conclusions', sv: 'Användaren ansvarar för slutsats' },
    { id: 'P06', en: 'Same method for everyone', sv: 'Samma metod för alla' },
    { id: 'P07', en: 'Rather nothing than wrong', sv: 'Hellre inget än fel' },
    { id: 'P08', en: 'Reproducibility as requirement', sv: 'Reproducerbarhet som krav' },
    { id: 'P09', en: 'No normative language', sv: 'Inget normativt språk' },
    { id: 'P10', en: 'Exit-safe (read-only on breach)', sv: 'Exit-safe (read-only vid brott)' },
  ],
  locked: true,
  version: '1.0.0',
};

// ============================================================
// II. DATA & INGESTION LAYER
// ============================================================

export const DATA_INGESTION_LAYER = {
  title: { en: 'Data & Ingestion Layer', sv: 'Data- och ingestionslager' },
  
  sources: {
    label: { en: 'Sources', sv: 'Källor' },
    categories: [
      { en: 'National statistical bureaus', sv: 'Nationella statistikbyråer' },
      { en: 'Central banks', sv: 'Centralbanker' },
      { en: 'WHO, OECD, IMF, World Bank', sv: 'WHO, OECD, IMF, Världsbanken' },
      { en: 'Energy authorities', sv: 'Energimyndigheter' },
      { en: 'Climate databases', sv: 'Klimatdatabaser' },
      { en: 'Health databases', sv: 'Hälsodatabaser' },
      { en: 'Financial market data (licensed)', sv: 'Finansmarknadsdata (licensierat)' },
      { en: 'Historical archives', sv: 'Historiska arkiv' },
      { en: 'Academic open datasets', sv: 'Akademiska öppna dataset' },
    ],
  },
  
  ingestion: {
    label: { en: 'Ingestion', sv: 'Ingestion' },
    methods: [
      { en: 'Pull + webhook', sv: 'Pull + webhook' },
      { en: 'Version control per source', sv: 'Versionshantering per källa' },
      { en: 'Schema-diff detection', sv: 'Schema-diff detection' },
      { en: 'Anomaly flagging', sv: 'Anomali-flaggning' },
      { en: 'Metadata-first', sv: 'Metadata-first' },
    ],
  },
  
  dataHygiene: {
    label: { en: 'Data Hygiene', sv: 'Datahygien' },
    requirements: [
      { en: 'Normalization (units, currencies, timezones)', sv: 'Normalisering (units, valutor, tidszoner)' },
      { en: 'Definition layer (what each measure means)', sv: 'Definitionslager (vad betyder varje mått)' },
      { en: 'Historical breakpoints', sv: 'Historiska brytpunkter' },
      { en: 'Quality index per data point', sv: 'Kvalitetsindex per datapunkt' },
    ],
  },
};

// ============================================================
// III. OBSERVATION LAYER (FREE / OPEN)
// ============================================================

export const OBSERVATION_LAYER = {
  title: { en: 'Observation Layer', sv: 'Observationslager' },
  access: { en: 'Free / Open', sv: 'Gratis / Öppen' },
  
  functions: {
    label: { en: 'Functions', sv: 'Funktioner' },
    items: [
      { en: 'Time series', sv: 'Tidsserier' },
      { en: 'Comparisons (country, region, sector)', sv: 'Jämförelser (land, region, sektor)' },
      { en: 'Relative position', sv: 'Relativ position' },
      { en: 'Historical intervals', sv: 'Historiska intervall' },
      { en: 'Trend breaks', sv: 'Trendbrott' },
      { en: 'Volatility', sv: 'Volatilitet' },
      { en: 'Uncertainty bands', sv: 'Osäkerhetsband' },
    ],
  },
  
  output: {
    label: { en: 'Output', sv: 'Output' },
    format: { en: 'Observation Cards', sv: 'Observationskort' },
    structure: ['Scope', 'Change', 'Context', 'Limits'],
    feature: { en: 'Clickable down to raw data', sv: 'Klickbart ner till rådata' },
  },
  
  forbidden: {
    label: { en: 'Forbidden', sv: 'Förbjudet' },
    items: [
      { en: 'No conclusions', sv: 'Inga slutsatser' },
      { en: 'No up/down arrows', sv: 'Inga pilar upp/ner' },
      { en: 'No colors that evaluate', sv: 'Inga färger som värderar' },
    ],
  },
};

// ============================================================
// IV. INCONSISTENCY & ALIGNMENT LAYER
// ============================================================

export const INCONSISTENCY_LAYER = {
  title: { en: 'Inconsistency & Alignment Layer', sv: 'Inkonsistens- och anpassningslager' },
  
  input: {
    label: { en: 'Input', sv: 'Input' },
    items: [
      { en: 'Publicly stated goals', sv: 'Offentligt uttalade mål' },
      { en: 'Actual actions (budget, decisions)', sv: 'Faktiska åtgärder (budget, beslut)' },
      { en: 'Observed outcomes', sv: 'Observerade utfall' },
    ],
  },
  
  classification: {
    label: { en: 'Classification', sv: 'Klassificering' },
    types: [
      { id: 'unverified', en: 'Unverified Effect', sv: 'Overifierad effekt' },
      { id: 'neutral', en: 'Neutral Outcome', sv: 'Neutralt utfall' },
      { id: 'negative', en: 'Negative Divergence', sv: 'Negativ divergens' },
      { id: 'insufficient', en: 'Insufficient Data', sv: 'Otillräcklig data' },
    ],
  },
  
  presentation: {
    label: { en: 'Presentation', sv: 'Presentation' },
    requirements: [
      { en: 'Neutral language', sv: 'Neutral språkdräkt' },
      { en: 'No blame', sv: 'Ingen skuld' },
      { en: 'No interpretation', sv: 'Ingen tolkning' },
    ],
  },
};

// ============================================================
// V. SCENARIO & PROBABILITY LAB (PAID)
// ============================================================

export const SCENARIO_LAB = {
  title: { en: 'Scenario & Probability Lab', sv: 'Scenario- och sannolikhetslabb' },
  access: { en: 'Paid', sv: 'Betald' },
  
  userSelects: {
    label: { en: 'User Selects', sv: 'Användaren väljer' },
    items: [
      { en: 'Indicators', sv: 'Indikatorer' },
      { en: 'Periods', sv: 'Perioder' },
      { en: 'Population', sv: 'Population' },
      { en: 'Model type', sv: 'Modelltyp' },
      { en: 'Assumptions', sv: 'Antaganden' },
    ],
  },
  
  modelTypes: {
    label: { en: 'Model Types', sv: 'Modelltyper' },
    items: [
      { id: 'historical', en: 'Historical frequency', sv: 'Historisk frekvens' },
      { id: 'bayesian', en: 'Bayesian updating', sv: 'Bayesiansk uppdatering' },
      { id: 'regression', en: 'Regression', sv: 'Regression' },
      { id: 'montecarlo', en: 'Monte Carlo', sv: 'Monte Carlo' },
      { id: 'sensitivity', en: 'Sensitivity analysis', sv: 'Känslighetsanalys' },
    ],
  },
  
  output: {
    label: { en: 'Output', sv: 'Output' },
    requirements: [
      { en: 'Interval, not point', sv: 'Intervall, inte punkt' },
      { en: 'Stability measure', sv: 'Stabilitetsmått' },
      { en: 'Assumption-dependent', sv: 'Antagande-beroende' },
    ],
  },
  
  protection: {
    label: { en: 'Protection', sv: 'Skydd' },
    requirements: [
      { en: '"User-generated scenario" label', sv: '"Användargenererat scenario"-märkning' },
      { en: 'Responsibility clause', sv: 'Ansvarsklausul' },
      { en: 'Encouragement for broader evidence', sv: 'Uppmaning till bredare evidens' },
    ],
  },
};

// ============================================================
// VI. REPORT & EXPORT SYSTEM
// ============================================================

export const REPORT_EXPORT_SYSTEM = {
  title: { en: 'Report & Export System', sv: 'Rapport- och exportsystem' },
  
  functions: {
    label: { en: 'Functions', sv: 'Funktioner' },
    items: [
      { en: 'Report generator (PDF, HTML)', sv: 'Rapportgenerator (PDF, HTML)' },
      { en: 'Version history', sv: 'Versionshistorik' },
      { en: 'Sharing with locked disclaimer', sv: 'Delning med låst disclaimer' },
      { en: 'QR verification', sv: 'QR-verifiering' },
      { en: 'Source appendix always included', sv: 'Källbilaga alltid med' },
    ],
  },
  
  limitations: {
    label: { en: 'Limitations', sv: 'Begränsningar' },
    items: [
      { en: 'No export without method', sv: 'Ingen export utan metod' },
      { en: 'No export without uncertainty', sv: 'Ingen export utan osäkerhet' },
      { en: 'No simplification beyond the data', sv: 'Ingen förenkling bortom datan' },
    ],
  },
};

// ============================================================
// VII. AI LAYER (STRICT MODE)
// ============================================================

export const AI_LAYER = {
  title: { en: 'AI Layer (Strict Mode)', sv: 'AI-lager (strikt läge)' },
  
  allowed: {
    label: { en: 'AI May', sv: 'AI får' },
    items: [
      { en: 'Discover patterns', sv: 'Upptäcka mönster' },
      { en: 'Describe co-variation', sv: 'Beskriva samvariation' },
      { en: 'Test stability', sv: 'Testa stabilitet' },
      { en: 'Show alternatives', sv: 'Visa alternativ' },
    ],
  },
  
  forbidden: {
    label: { en: 'AI May Not', sv: 'AI får inte' },
    items: [
      { en: 'Draw conclusions', sv: 'Dra slutsats' },
      { en: 'Recommend', sv: 'Rekommendera' },
      { en: 'Evaluate', sv: 'Värdera' },
      { en: 'Speculate', sv: 'Spekulera' },
    ],
  },
  
  languageStandard: {
    label: { en: 'Language Standard', sv: 'Språkstandard' },
    requirements: [
      { en: 'Allowed verb list', sv: 'Tillåtna verblista' },
      { en: 'Forbidden verb list', sv: 'Förbjudna verblista' },
      { en: 'Fallback: "Beyond observable data"', sv: 'Fallback: "Bortom observerbar data"' },
    ],
  },
};

// ============================================================
// VIII. UI / UX (CRITICAL)
// ============================================================

export const UI_UX_LAYER = {
  title: { en: 'UI / UX Layer (Critical)', sv: 'UI/UX-lager (kritiskt)' },
  
  designPrinciples: {
    label: { en: 'Design Principles', sv: 'Designprinciper' },
    items: [
      { en: 'Telia/Amazon level', sv: 'Telia/Amazon-nivå' },
      { en: 'Mobile first', sv: 'Mobil först' },
      { en: 'Clickable everywhere', sv: 'Klickbart överallt' },
      { en: 'Depth in layers', sv: 'Djup i lager' },
      { en: 'Same structure everywhere', sv: 'Samma struktur överallt' },
    ],
  },
  
  views: {
    label: { en: 'Views', sv: 'Vyer' },
    hierarchy: ['Global', 'Nation', 'Region', 'City'],
    features: [
      { en: 'Timeline as backbone', sv: 'Tidslinje som ryggrad' },
      { en: 'Maps (layers, clusters)', sv: 'Kartor (lager, kluster)' },
      { en: 'Side-by-side comparisons', sv: 'Jämförelser sida vid sida' },
    ],
  },
};

// ============================================================
// IX. USER & LICENSE MODEL
// ============================================================

export const USER_LICENSE_MODEL = {
  title: { en: 'User & License Model', sv: 'Användar- och licensmodell' },
  
  roles: {
    label: { en: 'Roles', sv: 'Roller' },
    items: ['Guest', 'Observer', 'Analyst', 'Institutional'],
  },
  
  functionsPerLevel: {
    label: { en: 'Functions Per Level', sv: 'Funktioner per nivå' },
    free: { en: 'Free = facts', sv: 'Gratis = fakta' },
    paid: { en: 'Paid = calculation, export, API', sv: 'Betalt = beräkning, export, API' },
  },
  
  traceability: {
    label: { en: 'Traceability', sv: 'Spårbarhet' },
    requirements: [
      { en: 'User-ID on all scenarios', sv: 'User-ID på alla scenarier' },
      { en: 'Audit log', sv: 'Audit log' },
      { en: 'Version control', sv: 'Versionskontroll' },
    ],
  },
};

// ============================================================
// X. LEGAL & GOVERNANCE
// ============================================================

export const LEGAL_GOVERNANCE = {
  title: { en: 'Legal & Governance', sv: 'Juridik och styrning' },
  
  platformResponsibleFor: {
    label: { en: 'Platform is Responsible For', sv: 'Plattformen ansvarar för' },
    items: [
      { en: 'Operations', sv: 'Drift' },
      { en: 'Data quality', sv: 'Datakvalitet' },
      { en: 'Methodology transparency', sv: 'Metodtransparens' },
    ],
  },
  
  platformNotResponsibleFor: {
    label: { en: 'Platform is NOT Responsible For', sv: 'Plattformen ansvarar INTE för' },
    items: [
      { en: 'Interpretation', sv: 'Tolkning' },
      { en: 'Decisions', sv: 'Beslut' },
      { en: 'Consequences', sv: 'Konsekvenser' },
    ],
  },
  
  safeHarbor: {
    en: 'Safe-harbor text everywhere.',
    sv: 'Safe-harbor-text överallt.',
  },
};

// ============================================================
// XI. AI / MEDIA / INSTITUTIONAL ADOPTION
// ============================================================

export const ADOPTION_LAYER = {
  title: { en: 'AI / Media / Institutional Adoption', sv: 'AI/Media/Institutionell adoption' },
  
  builtFor: {
    label: { en: 'Built For', sv: 'Byggt för att' },
    items: [
      { en: 'Be cited', sv: 'Citeras' },
      { en: 'Be linked', sv: 'Länkas' },
      { en: 'Be used as baseline', sv: 'Användas som baseline' },
      { en: 'Compare on the same map', sv: 'Jämföra på samma karta' },
    ],
  },
  
  noPR: {
    label: { en: 'No PR', sv: 'Ingen PR' },
    items: [
      { en: 'Only usage', sv: 'Bara användning' },
      { en: 'Only references', sv: 'Bara referenser' },
    ],
  },
};

// ============================================================
// XII. OPERATIONS & FUTURE
// ============================================================

export const OPERATIONS_FUTURE = {
  title: { en: 'Operations & Future', sv: 'Drift och framtid' },
  
  requirements: [
    { en: 'Serverless', sv: 'Serverlös' },
    { en: 'Redundancy', sv: 'Redundans' },
    { en: 'Read-only fallback', sv: 'Read-only fallback' },
    { en: 'Open method docs', sv: 'Öppna metoddokument' },
    { en: 'Immutable principles', sv: 'Oföränderliga principer' },
  ],
};

// ============================================================
// XIII. IDENTITY SUMMARY
// ============================================================

export const IDENTITY_SUMMARY = {
  title: { en: 'What We Have Built', sv: 'Vad vi har byggt' },
  
  notThis: [
    { en: 'Not an analysis company', sv: 'Inte ett analysföretag' },
    { en: 'Not a political tool', sv: 'Inte ett politiskt verktyg' },
    { en: 'Not an opinion platform', sv: 'Inte en åsiktsplattform' },
  ],
  
  butThis: {
    en: 'Global decision infrastructure where responsibility emerges naturally when data becomes shared.',
    sv: 'Global beslutsinfrastruktur där ansvar uppstår naturligt när data blir gemensam.',
  },
  
  characteristics: [
    { en: 'Inevitable', sv: 'Ofrånkomligt' },
    { en: 'Unassailable', sv: 'Oangripbart' },
    { en: 'Necessary', sv: 'Nödvändigt' },
  ],
};

// ============================================================
// COMPLETE ARCHITECTURE EXPORT
// ============================================================

export const SYSTEM_ARCHITECTURE = {
  version: '1.0.0',
  modules: {
    I: CORE_PRINCIPLES,
    II: DATA_INGESTION_LAYER,
    III: OBSERVATION_LAYER,
    IV: INCONSISTENCY_LAYER,
    V: SCENARIO_LAB,
    VI: REPORT_EXPORT_SYSTEM,
    VII: AI_LAYER,
    VIII: UI_UX_LAYER,
    IX: USER_LICENSE_MODEL,
    X: LEGAL_GOVERNANCE,
    XI: ADOPTION_LAYER,
    XII: OPERATIONS_FUTURE,
    XIII: IDENTITY_SUMMARY,
  },
  totalModules: 13,
  locked: true,
};

// ============================================================
// VALIDATION FUNCTIONS
// ============================================================

export function validateArchitectureCompleteness(): { complete: boolean; missing: string[] } {
  const required = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII'];
  const present = Object.keys(SYSTEM_ARCHITECTURE.modules);
  const missing = required.filter(r => !present.includes(r));
  return { complete: missing.length === 0, missing };
}

export function getPrincipleById(id: string) {
  return CORE_PRINCIPLES.principles.find(p => p.id === id);
}

export function getModuleByNumber(num: string) {
  return SYSTEM_ARCHITECTURE.modules[num as keyof typeof SYSTEM_ARCHITECTURE.modules];
}
