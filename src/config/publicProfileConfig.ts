/**
 * DEL XII & XIII — OFFENTLIGA POLITIKERPROFILER (ANSVAR & UTFALL)
 * 
 * Konfiguration för språkliga skyddsräcken och juridiska disclaimers.
 * Alla formuleringar är exakta och får inte ändras utan juridisk granskning.
 * 
 * DEL XIII: Faktabaserat katalogsystem med Wikipedia-separation
 */

// =====================================================
// JURIDISKA DISCLAIMERS
// =====================================================

export const LEGAL_DISCLAIMERS = {
  // Huvuddisclaimer - visas alltid på varje profil (fast text, oföränderlig)
  main: {
    title: 'Om denna sida',
    text: `Profilerna visar offentliga uppdrag och hur relevanta indikatorer utvecklades under dessa perioder.
Systemet tillskriver inte individer orsak, skuld eller intention.`,
  },
  
  // Kortare version för kompakta vyer
  compact: 'Visar observerade utfall, inte avsikter eller orsakssamband.',
  
  // Footer-disclaimer
  footer: `Systemet tar inte ställning till orsak. 
Det visar endast offentliga uppdrag och observerade indikatorförändringar under samma period.`,
  
  // Metoddisclaimer
  methodology: {
    title: 'Metod och begränsningar',
    text: `Dessa sidor sammanställer offentligt tillgänglig information om uppdrag 
och kopplar dem till nationella indikatorer. Korrelation i tid innebär inte kausalitet.
En persons ansvar för ett område innebär inte ensamt ansvar för alla förändringar.`,
  },
  
  // DEL XIII: Wikipedia-faktaruta
  wikipediaAttribution: {
    title: 'Grundfakta',
    text: 'Denna information är hämtad från Wikipedia (CC BY-SA)',
    linkText: 'Visa ursprungskälla på Wikipedia',
  },
  
  // DEL XIII: Systemanalys-sektion
  systemAnalysis: {
    title: 'Ansvar & observerade utfall',
    text: 'Denna del är systemgenererad analys baserad på öppna myndighetsdata.',
  },
  
  // DEL XIII: Rättelse & transparens
  correction: {
    title: 'Rättelse & transparens',
    text: `Om faktauppgifter är felaktiga ber vi dig först kontrollera och uppdatera Wikipedia.
Systemet uppdateras automatiskt därefter.`,
  },
  
  // DEL XIII: Verifieringsstatus
  verification: {
    prefix: 'Grundfakta senast verifierad mot Wikipedia:',
    unknown: 'Ej verifierad',
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
