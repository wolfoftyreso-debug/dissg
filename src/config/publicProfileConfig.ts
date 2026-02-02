/**
 * DEL XII, XIII & XIV — OFFENTLIGA POLITIKERPROFILER & ANSVARSMODELL
 * 
 * NOGF (Nationellt Observationssystem för Grundläggande Funktioner)
 * 
 * Konfiguration för:
 * - Tre-lager-separation (Källfakta, Aggregering, Presentation)
 * - Juridiska disclaimers och språkliga skyddsräcken
 * - Metodtransparens
 * 
 * ⚠️ KRITISKT: Alla formuleringar är exakta och får INTE ändras utan juridisk granskning.
 */

// =====================================================
// TRE-LAGER-MODELL
// =====================================================

export const DATA_LAYERS = {
  /** LAGER A: Källfakta - ägs INTE av systemet */
  sourceData: {
    id: 'source',
    name: 'Källfakta',
    description: 'Oförändrad data direkt från öppna källor',
    ownership: 'Respektive datakälla',
    disclaimer: 'Data från öppen källa, ej modifierad av systemet.',
  },
  
  /** LAGER B: Aggregering - systemets beräkningsprodukt */
  aggregation: {
    id: 'aggregation',
    name: 'Sammanställning',
    description: 'Systemgenererad aggregering enligt dokumenterad metod',
    ownership: 'Systemet',
    disclaimer: 'Detta är en systemgenererad sammanställning baserad på öppna källor.',
  },
  
  /** LAGER C: Presentation - ren visualisering */
  presentation: {
    id: 'presentation',
    name: 'Visualisering',
    description: 'Pedagogisk presentation för översikt',
    ownership: 'Systemet',
    disclaimer: 'Visualiseringar och sammanfattningar är avsedda för översikt.',
  },
} as const;

// =====================================================
// JURIDISKA DISCLAIMERS (EXAKTA FORMULERINGAR)
// ⚠️ Dessa texter är oföränderliga och utgör juridiskt skydd
// =====================================================

export const LEGAL_DISCLAIMERS = {
  // A. Global disclaimer (sidfot, alla sidor)
  global: {
    title: 'Om informationen',
    text: `Denna plattform sammanställer och visualiserar information från öppna källor (t.ex. myndighetsstatistik och Wikipedia). Plattformen producerar ingen ny fakta och tar inte ställning i politiska frågor. Visualiseringar och sammanställningar är systemgenererade enligt öppet redovisad metodik.`,
  },
  
  // B. Datakälla & ansvar (på alla KPI- och analyssidor)
  dataSource: {
    title: 'Datakällor och ansvar',
    text: `All grunddata härrör från öppna källor. Eventuella fel eller brister i grunddata hänförs till respektive källa. Plattformen ansvarar för aggregering, tidslinjeläggning och presentation enligt publicerad metod.`,
  },
  
  // C. Analysens natur (på alla analysvyer)
  analysis: {
    title: 'Om analysen',
    text: `Analysen visar observerade samband i tid mellan ansvar, beslut och indikatorutveckling. Analysen fastställer inte kausalitet, intention eller skuld.`,
  },
  
  // D. Ansvar & roller (på roll- och ansvarsvyer)
  responsibility: {
    title: 'Ansvar och mandat',
    text: `Ansvar visas som formella uppdrag och mandatperioder. Plattformen tillskriver inte individer personlig orsak till utfall.`,
  },
  
  // E. Politikerprofiler (överst på varje profilsida)
  profile: {
    title: 'Viktig information',
    text: `Denna profilsida visar offentliga uppdrag (källa: Wikipedia) och hur relevanta indikatorer utvecklades under dessa perioder. Utfallet är en sammanställning av öppna data och innebär ingen värdering av personen.`,
  },
  
  // F. Rättelse & uppdatering (på profilsidor)
  correction: {
    title: 'Rättelser',
    text: `Biografiska fakta hämtas från Wikipedia (CC BY-SA). För rättelser av grundfakta hänvisas till Wikipedia. Plattformen synkroniserar uppdateringar regelbundet.`,
  },
  
  // G. Metodlänk (fast länk överallt)
  methodLink: {
    title: 'Så här är detta beräknat',
    text: `Läs om datakällor, tidsfönster, trendklassificering, osäkerhet och aggregeringsregler.`,
  },
  
  // Legacy-stöd för befintliga komponenter
  main: {
    title: 'Viktig information',
    text: `Denna profilsida visar offentliga uppdrag (källa: Wikipedia) och hur relevanta indikatorer utvecklades under dessa perioder. Utfallet är en sammanställning av öppna data och innebär ingen värdering av personen.`,
  },
  
  compact: 'Visar observerade utfall, inte avsikter eller orsakssamband.',
  
  footer: `Denna plattform sammanställer och visualiserar information från öppna källor. Plattformen producerar ingen ny fakta och tar inte ställning i politiska frågor.`,
  
  methodology: {
    title: 'Metod och begränsningar',
    text: `Analysen visar observerade samband i tid mellan ansvar, beslut och indikatorutveckling. Analysen fastställer inte kausalitet, intention eller skuld.`,
  },
  
  aggregation: {
    title: 'Om aggregering',
    text: `Aggregering innebär att flera datapunkter sammanställs enligt fasta regler. Aggregering är inte en värdering av individer, beslut eller intentioner.`,
  },
  
  dataResponsibility: {
    title: 'Datakällor och ansvar',
    text: `All grunddata härrör från öppna källor. Eventuella fel eller brister i grunddata hänförs till respektive källa. Plattformen ansvarar för aggregering, tidslinjeläggning och presentation enligt publicerad metod.`,
  },
  
  wikipediaAttribution: {
    title: 'Grundfakta',
    text: 'Denna information är hämtad från Wikipedia (CC BY-SA)',
    linkText: 'Visa ursprungskälla på Wikipedia',
  },
  
  systemAnalysis: {
    title: 'Ansvar & observerade utfall',
    text: 'Denna del är systemgenererad analys baserad på öppna myndighetsdata.',
  },
  
  verification: {
    prefix: 'Grundfakta senast verifierad mot Wikipedia:',
    unknown: 'Ej verifierad',
  },
  
  globalSystem: {
    title: 'Om informationen',
    text: `Denna plattform sammanställer och visualiserar information från öppna källor (t.ex. myndighetsstatistik och Wikipedia). Plattformen producerar ingen ny fakta och tar inte ställning i politiska frågor. Visualiseringar och sammanställningar är systemgenererade enligt öppet redovisad metodik.`,
  },
} as const;

// =====================================================
// SPRÅKREGLER (neutralt språk)
// =====================================================

export const LANGUAGE_TEMPLATES = {
  // Profilens huvudrubrik
  profileHeader: {
    title: 'Offentlig profil',
    subtitle: 'Uppdrag och observerade utfall',
  },
  
  // Ansvarsöversikt
  responsibilitySummary: {
    title: 'Ansvar och observerade utfall',
    description: 'Sammanfattning av uppdrag och indikatorutveckling under ansvarstid.',
  },
  
  // Tidslinje
  timeline: {
    title: 'Tidslinje',
    description: 'Denna graf visar hur indikatorn utvecklades under perioden då ansvaret låg inom detta uppdrag.',
  },
  
  // Utfallsfördelning
  outcomeDistribution: {
    title: 'Utfallsfördelning',
    improved: 'Positiv utveckling',
    stagnant: 'Neutral',
    declined: 'Negativ utveckling',
    footer: 'Utfall baseras på observerad utveckling i indikatorer under ansvarstiden.',
  },
  
  // Sambandsformulering (används i grafer)
  correlation: {
    prefix: 'Under perioden med ansvar för detta område',
    improved: 'förbättrades',
    declined: 'försämrades',
    unchanged: 'var oförändrad',
    suffix: 'indikatorn under {months} av {totalMonths} månader.',
  },
  
  // Navigering
  navigation: {
    viewOtherAreas: 'Visa andra områden',
    viewAllAssignments: 'Alla uppdrag',
    backToProfile: 'Tillbaka till profil',
  },
} as const;

// =====================================================
// FÖRBJUDNA ORD OCH UTTRYCK
// =====================================================

export const FORBIDDEN_TERMS = [
  // Värdeord
  'bra', 'dålig', 'misslyckad', 'framgångsrik', 'lyckad',
  'kompetent', 'inkompetent', 'duglig', 'oduglig',
  
  // Skuldformulering
  'skuld', 'ansvarig för', 'orsakade', 'ledde till', 'resulterade i',
  'på grund av', 'tack vare', 'misskötte', 'misslyckades med',
  
  // Laddade uttryck
  'katastrof', 'fiasko', 'triumf', 'succé', 'rekord',
  'sämsta', 'bästa', 'värsta', 'fantastisk', 'usel',
  
  // Uppmaningar
  'borde', 'måste', 'ska', 'rekommenderar', 'föreslår',
] as const;

// =====================================================
// TILLÅTNA FORMULERINGAR
// =====================================================

export const ALLOWED_PHRASES = {
  // Neutrala trendord
  trends: {
    improved: 'förbättrades',
    declined: 'försämrades',
    stable: 'var oförändrad',
    unclear: 'visade ingen tydlig trend',
  },
  
  // Tidsformulering
  timing: {
    during: 'Under perioden',
    between: 'Mellan {start} och {end}',
    since: 'Sedan {date}',
  },
  
  // Ansvarsformulering
  responsibility: {
    held: 'innehade uppdraget',
    assigned: 'tilldelades ansvar för',
    active: 'var verksam inom',
  },
  
  // Observationsformulering
  observation: {
    prefix: 'Under denna period observerades att',
    showed: 'visade en utveckling på',
    changed: 'förändrades med',
  },
} as const;

// =====================================================
// UPPDRAGSTYPER
// =====================================================

export const ASSIGNMENT_TYPES = {
  minister: { label: 'Minister', description: 'Statsråd i regeringen' },
  state_secretary: { label: 'Statssekreterare', description: 'Departementets högsta tjänsteman' },
  party_leader: { label: 'Partiledare', description: 'Ledare för politiskt parti' },
  committee_chair: { label: 'Utskottsordförande', description: 'Ordförande i riksdagsutskott' },
  speaker: { label: 'Talman', description: 'Riksdagens talman' },
  mp: { label: 'Riksdagsledamot', description: 'Ledamot av Sveriges riksdag' },
  municipal_leader: { label: 'Kommunalråd', description: 'Ledande kommunalpolitiker' },
  regional_leader: { label: 'Regionråd', description: 'Ledande regionpolitiker' },
} as const;

// =====================================================
// FÄRGKONFIGURATION (neutral)
// =====================================================

export const OUTCOME_COLORS = {
  // Använder CSS-variabler för tematisering
  improved: 'hsl(var(--status-positive))',
  declined: 'hsl(var(--status-critical))',
  stagnant: 'hsl(var(--muted))',
  unknown: 'hsl(var(--muted-foreground))',
} as const;

// =====================================================
// EXPORTERA ALLT
// =====================================================

export const PUBLIC_PROFILE_CONFIG = {
  disclaimers: LEGAL_DISCLAIMERS,
  language: LANGUAGE_TEMPLATES,
  forbidden: FORBIDDEN_TERMS,
  allowed: ALLOWED_PHRASES,
  assignmentTypes: ASSIGNMENT_TYPES,
  colors: OUTCOME_COLORS,
} as const;
