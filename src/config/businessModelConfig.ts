/**
 * 💼 BUSINESS MODEL CONFIGURATION — FINAL FORM
 * 
 * License structure, responsibility distribution, pricing rationale.
 * 
 * Core principle:
 * "The platform provides tools and data.
 * All interpretations, scenarios and decisions remain the sole responsibility of the user."
 */

// ============================================================
// LAYER ARCHITECTURE
// ============================================================

export const LAYER_ARCHITECTURE = {
  title: { en: 'Layer Architecture', sv: 'Lagerarkitektur' },
  openReference: {
    id: 'open_reference',
    name: { en: 'Open Reference Layer', sv: 'Öppet referenslager' },
    icon: '🔓',
    price: { en: 'Free. Always.', sv: 'Gratis. Alltid.' },
    purpose: {
      en: 'Create shared understanding of reality.',
      sv: 'Skapa gemensam verklighetsbild.',
    },
    principle: {
      en: 'This is the democratic floor. No paywall on facts.',
      sv: 'Detta är det demokratiska golvet. Ingen betalvägg på fakta.',
    },
    includes: [
      { en: 'Aggregated public data', sv: 'Aggregerad offentlig data' },
      { en: 'Observation mode', sv: 'Observationsläge' },
      { en: 'Comparisons', sv: 'Jämförelser' },
      { en: 'Historical data', sv: 'Historisk data' },
      { en: 'Uncertainty disclosure', sv: 'Osäkerhetsredovisning' },
      { en: 'Methodology', sv: 'Metodik' },
      { en: 'Source links', sv: 'Källhänvisningar' },
    ],
  },
  professionalAnalysis: {
    id: 'professional_analysis',
    name: { en: 'Professional Analysis Layer', sv: 'Professionellt analyslager' },
    icon: '🔐',
    price: { en: 'Paid. High.', sv: 'Betald. Hög.' },
    purpose: {
      en: 'Enable advanced work under responsibility.',
      sv: 'Möjliggöra avancerat arbete under ansvar.',
    },
    principle: {
      en: 'This is work tools, not information.',
      sv: 'Detta är arbetsverktyg, inte information.',
    },
    includes: [
      { en: 'Scenario mode', sv: 'Scenarioläge' },
      { en: 'Probability calculations', sv: 'Sannolikhetsberäkningar' },
      { en: 'Model selection', sv: 'Modellval' },
      { en: 'Sensitivity analysis', sv: 'Känslighetsanalys' },
      { en: 'Data export', sv: 'Dataexport' },
      { en: 'API access', sv: 'API-åtkomst' },
      { en: 'Version history', sv: 'Versionshistorik' },
      { en: 'Per-user traceability', sv: 'Spårbarhet per användare' },
    ],
  },
};

// ============================================================
// LICENSE TIERS (3-TIER MODEL)
// ============================================================

export type LicenseTier = 'observer' | 'analyst' | 'institutional';

export interface LicenseTierDefinition {
  id: LicenseTier;
  name: { en: string; sv: string };
  tagline: { en: string; sv: string };
  audience: { en: string; sv: string };
  price: {
    display: { en: string; sv: string };
    level: 'free' | 'professional' | 'high';
  };
  layer: 'open_reference' | 'professional_analysis';
  features: Array<{ en: string; sv: string }>;
  limitations: Array<{ en: string; sv: string }>;
  color: string;
  icon: string;
}

export const LICENSE_TIERS: LicenseTierDefinition[] = [
  {
    id: 'observer',
    name: { en: 'Observer', sv: 'Observatör' },
    tagline: { en: 'Understand', sv: 'Förstå' },
    audience: { en: 'Citizens, journalists, students', sv: 'Medborgare, journalister, studenter' },
    price: { display: { en: 'Free', sv: 'Gratis' }, level: 'free' },
    layer: 'open_reference',
    features: [
      { en: 'Full Open Reference access', sv: 'Full tillgång till öppet referenslager' },
      { en: 'Basic comparisons', sv: 'Grundläggande jämförelser' },
      { en: 'Historical data', sv: 'Historisk data' },
      { en: 'Methodology transparency', sv: 'Metodtransparens' },
    ],
    limitations: [
      { en: 'No scenario analysis', sv: 'Ingen scenarioanalys' },
      { en: 'No export', sv: 'Ingen export' },
      { en: 'Limited comparisons', sv: 'Begränsade jämförelser' },
    ],
    color: 'border-primary/30 bg-primary/5',
    icon: '🔓',
  },
  {
    id: 'analyst',
    name: { en: 'Analyst', sv: 'Analytiker' },
    tagline: { en: 'Work', sv: 'Arbeta' },
    audience: { en: 'Researchers, policy analysts, newsrooms', sv: 'Forskare, policyanalytiker, redaktioner' },
    price: { display: { en: 'Professional', sv: 'Professionellt' }, level: 'professional' },
    layer: 'professional_analysis',
    features: [
      { en: 'Everything in Observer', sv: 'Allt i Observatör' },
      { en: 'Scenario mode (limited)', sv: 'Scenarioläge (begränsat)' },
      { en: 'Probability intervals', sv: 'Sannolikhetsintervall' },
      { en: 'Historical simulations', sv: 'Historiska simuleringar' },
      { en: 'Watermarked export', sv: 'Vattenstämplad export' },
    ],
    limitations: [
      { en: 'No recommendations', sv: 'Inga rekommendationer' },
      { en: 'Limited API access', sv: 'Begränsad API-åtkomst' },
      { en: 'Single user', sv: 'En användare' },
    ],
    color: 'border-blue-500/30 bg-blue-500/5',
    icon: '📊',
  },
  {
    id: 'institutional',
    name: { en: 'Institutional', sv: 'Institutionell' },
    tagline: { en: 'Govern', sv: 'Styra' },
    audience: { en: 'Central banks, ministries, funds, international organizations', sv: 'Centralbanker, departement, fonder, internationella organisationer' },
    price: { display: { en: 'High', sv: 'Högt' }, level: 'high' },
    layer: 'professional_analysis',
    features: [
      { en: 'Everything in Analyst', sv: 'Allt i Analytiker' },
      { en: 'Full scenario engine', sv: 'Full scenariomotor' },
      { en: 'Advanced models', sv: 'Avancerade modeller' },
      { en: 'Full API access', sv: 'Full API-åtkomst' },
      { en: 'Version control', sv: 'Versionskontroll' },
      { en: 'Team accounts', sv: 'Teamkonton' },
      { en: 'Audit logs', sv: 'Revisionsloggar' },
    ],
    limitations: [],
    color: 'border-amber-500/30 bg-amber-500/5',
    icon: '🏛️',
  },
];

// ============================================================
// RESPONSIBILITY MODEL (LEGALLY CRITICAL)
// ============================================================

export const RESPONSIBILITY_MODEL = {
  title: { en: 'Responsibility Distribution', sv: 'Ansvarsfördelning' },
  platformResponsibleFor: {
    label: { en: 'Platform is responsible for', sv: 'Plattformen ansvarar för' },
    items: [
      { en: 'Data integrity', sv: 'Dataintegritet' },
      { en: 'Methodology transparency', sv: 'Metodtransparens' },
      { en: 'Calculation correctness', sv: 'Beräkningskorrekthet' },
      { en: 'Traceability', sv: 'Spårbarhet' },
      { en: 'Operations', sv: 'Drift' },
    ],
  },
  platformNotResponsibleFor: {
    label: { en: 'Platform is NOT responsible for', sv: 'Plattformen ansvarar INTE för' },
    items: [
      { en: 'User assumptions', sv: 'Användarens antaganden' },
      { en: 'User conclusions', sv: 'Användarens slutsatser' },
      { en: 'User decisions', sv: 'Användarens beslut' },
      { en: 'External consequences', sv: 'Externa konsekvenser' },
    ],
  },
  legalStatement: {
    en: 'The platform provides tools and data. All interpretations, scenarios and decisions remain the sole responsibility of the user.',
    sv: 'Plattformen tillhandahåller verktyg och data. Alla tolkningar, scenarier och beslut förblir användarens eget ansvar.',
  },
  industryStandard: {
    en: 'This is industry standard.',
    sv: 'Detta är industristandard.',
  },
  // Legacy compatibility
  platformProvides: {
    label: { en: 'Platform Provides', sv: 'Plattformen tillhandahåller' },
    items: [
      { en: 'Data integrity', sv: 'Dataintegritet' },
      { en: 'Methodology transparency', sv: 'Metodtransparens' },
      { en: 'Calculation correctness', sv: 'Beräkningskorrekthet' },
      { en: 'Traceability', sv: 'Spårbarhet' },
    ],
  },
  platformDoesNot: {
    label: { en: 'Platform Does Not', sv: 'Plattformen ansvarar inte för' },
    items: [
      { en: 'User assumptions', sv: 'Användarens antaganden' },
      { en: 'User conclusions', sv: 'Användarens slutsatser' },
      { en: 'User decisions', sv: 'Användarens beslut' },
      { en: 'External consequences', sv: 'Externa konsekvenser' },
    ],
  },
  userResponsibility: {
    label: { en: 'User Responsibility', sv: 'Användarens ansvar' },
    items: [
      { en: 'Assumptions', sv: 'Antaganden' },
      { en: 'Interpretation', sv: 'Tolkning' },
      { en: 'Application', sv: 'Användning' },
      { en: 'Decisions', sv: 'Beslut' },
    ],
  },
};

// ============================================================
// WHAT THIS IS NOT (IDENTITY PROTECTION)
// ============================================================

export const IDENTITY_PROTECTION = {
  title: { en: 'What This Is Not', sv: 'Vad detta inte är' },
  weAreNot: {
    label: { en: 'We are NOT', sv: 'Vi är INTE' },
    items: [
      { en: 'Advisory firm', sv: 'Rådgivningsföretag' },
      { en: 'Analysis company', sv: 'Analysföretag' },
      { en: 'Political actor', sv: 'Politisk aktör' },
      { en: 'Consultant', sv: 'Konsult' },
    ],
  },
  weDoNot: {
    label: { en: 'We do NOT', sv: 'Vi gör INTE' },
    items: [
      { en: 'Deliver recommendations', sv: 'Levererar rekommendationer' },
      { en: 'Write conclusions for clients', sv: 'Skriver slutsatser åt kunder' },
      { en: 'Take responsibility for decisions', sv: 'Tar ansvar för beslut' },
      { en: 'Participate in policy formulation', sv: 'Deltar i policyutformning' },
    ],
  },
  weAre: {
    label: { en: 'We ARE', sv: 'Vi ÄR' },
    statement: {
      en: 'Provider of computation and reference infrastructure.',
      sv: 'Leverantör av beräknings- och referensinfrastruktur.',
    },
  },
  benefits: {
    label: { en: 'Therefore we', sv: 'Därför är vi' },
    items: [
      { en: 'Never become political', sv: 'Blir aldrig politiska' },
      { en: 'Never become legally exposed', sv: 'Blir aldrig juridiskt exponerade' },
      { en: 'Never need to defend conclusions', sv: 'Behöver aldrig försvara slutsatser' },
    ],
  },
};

// ============================================================
// PRICING RATIONALE
// ============================================================

export const PRICING_RATIONALE = {
  title: { en: 'Why High Price Is An Advantage', sv: 'Varför högt pris är en fördel' },
  benefits: [
    { en: 'Signals seriousness', sv: 'Signalerar seriositet' },
    { en: 'Filters out careless use', sv: 'Filtrerar bort slarv' },
    { en: 'Reduces misuse', sv: 'Minskar missbruk' },
    { en: 'Attracts the right users', sv: 'Attraherar rätt användare' },
    { en: 'Finances data quality', sv: 'Finansierar datakvalitet' },
  ],
  positioning: {
    weDoNotSell: { en: 'We do not sell "insights".', sv: 'Vi säljer inte "insikter".' },
    weSell: { en: 'We sell peace of work.', sv: 'Vi säljer arbetsro.' },
  },
  conclusion: {
    en: 'It becomes cheaper to use us than not to.',
    sv: 'Det blir billigare att använda oss än att inte göra det.',
  },
  // Legacy compatibility
  costDrivers: {
    label: { en: 'What The Price Covers', sv: 'Vad priset täcker' },
    items: [
      { en: 'Data integrity', sv: 'Dataintegritet' },
      { en: 'Methodology transparency', sv: 'Metodtransparens' },
      { en: 'Calculation correctness', sv: 'Beräkningskorrekthet' },
      { en: 'Traceability', sv: 'Spårbarhet' },
      { en: 'Operations', sv: 'Drift' },
    ],
  },
  qualityFilter: {
    label: { en: 'Price as Quality Filter', sv: 'Pris som kvalitetsfilter' },
    points: [
      { en: 'Filters out careless use', sv: 'Sorterar bort slarv' },
      { en: 'Attracts serious users', sv: 'Attraherar seriösa användare' },
      { en: 'Reduces misuse', sv: 'Minskar missbruk' },
      { en: 'Increases institutional trust', sv: 'Höjer institutionellt förtroende' },
    ],
  },
  officialStatement: {
    en: 'Pricing reflects the cost of maintaining high-integrity, continuously verified data and computational infrastructure.',
    sv: 'Prissättningen speglar kostnaden för att underhålla högintegritets-, kontinuerligt verifierad data och beräkningsinfrastruktur.',
  },
};

// ============================================================
// EXPORT PROTECTION
// ============================================================

export const EXPORT_PROTECTION = {
  title: { en: 'Export & Report Protection', sv: 'Export- & rapportskydd' },
  allExportsContain: {
    label: { en: 'All exports contain', sv: 'Alla exporter innehåller' },
    items: [
      { en: '"User-generated scenario" label', sv: '"Användargenererat scenario"-märkning' },
      { en: 'Assumptions used', sv: 'Använda antaganden' },
      { en: 'Uncertainty disclosure', sv: 'Osäkerhetsredovisning' },
      { en: 'Methodology', sv: 'Metodik' },
      { en: 'Responsibility clause', sv: 'Ansvarsklausul' },
    ],
  },
  systemPrevents: {
    label: { en: 'System prevents', sv: 'Systemet förhindrar' },
    items: [
      { en: 'Export without disclaimer', sv: 'Export utan ansvarsfriskrivning' },
      { en: 'Removal of methodology', sv: 'Borttagning av metodik' },
      { en: 'Simplification of uncertainty', sv: 'Förenkling av osäkerhet' },
    ],
  },
  principle: {
    en: 'This protects both you and the user.',
    sv: 'Detta skyddar både er och användaren.',
  },
};

// ============================================================
// SUMMARY STATEMENT
// ============================================================

export const BUSINESS_MODEL_SUMMARY = {
  title: { en: 'What We Build', sv: 'Vad vi bygger' },
  notThis: [
    { en: 'Not advisory', sv: 'Inte rådgivning' },
    { en: 'Not analysis company', sv: 'Inte analysföretag' },
    { en: 'Not political actor', sv: 'Inte politisk aktör' },
  ],
  butThis: {
    en: 'A neutral, professional, expensive and extremely clean tool for people who take responsibility for their decisions.',
    sv: 'Ett neutralt, professionellt, dyrt och extremt rent verktyg för människor som tar ansvar för sina beslut.',
  },
  requirements: [
    { en: 'It should be expensive', sv: 'Det ska vara dyrt' },
    { en: 'It should be demanding', sv: 'Det ska vara krävande' },
    { en: 'It should feel serious to use', sv: 'Det ska kännas allvarligt att använda' },
  ],
};

// ============================================================
// LEGACY EXPORTS (backward compatibility)
// ============================================================

export const PUBLIC_PREMIUM_DISTINCTION = {
  title: { en: 'Open vs Professional', sv: 'Öppen vs Professionell' },
  principle: {
    en: 'Data and understanding are always free. Tools, persistence, export and API cost.',
    sv: 'Data och förståelse är alltid gratis. Verktyg, persistens, export och API kostar.',
  },
  public: {
    label: { en: 'Always Free', sv: 'Alltid gratis' },
    items: LAYER_ARCHITECTURE.openReference.includes.slice(0, 4),
  },
  premium: {
    label: { en: 'Professional Features', sv: 'Professionella funktioner' },
    items: LAYER_ARCHITECTURE.professionalAnalysis.includes.slice(0, 4),
  },
};

export const VALUE_PROPOSITION = {
  title: { en: 'Value Proposition', sv: 'Värdeerbjudande' },
  weDoNotSell: {
    label: { en: 'We Do Not Sell', sv: 'Vi säljer inte' },
    items: [
      { en: 'Opinions', sv: 'Åsikter' },
      { en: 'Conclusions', sv: 'Slutsatser' },
      { en: 'Advice', sv: 'Råd' },
      { en: 'Predictions', sv: 'Prognoser' },
    ],
  },
  weSell: {
    label: { en: 'We Provide', sv: 'Vi tillhandahåller' },
    items: [
      { en: 'Access to verified data', sv: 'Tillgång till verifierad data' },
      { en: 'Computational capacity', sv: 'Beräkningskapacitet' },
      { en: 'Methodological rigor', sv: 'Metodisk stringens' },
      { en: 'Work peace', sv: 'Arbetsro' },
    ],
  },
  competitorStatement: {
    en: 'We do not compete with "free information". We compete with bad information.',
    sv: 'Vi konkurrerar inte med "gratis information". Vi konkurrerar med dålig information.',
  },
};

export const INDUSTRY_STANDARD = {
  title: { en: 'Industry Standard Reference', sv: 'Branschstandardreferens' },
  similarPlatforms: [
    { en: 'Bloomberg Terminal', sv: 'Bloomberg Terminal' },
    { en: 'Refinitiv Eikon', sv: 'Refinitiv Eikon' },
    { en: 'FactSet', sv: 'FactSet' },
  ],
  sharedPrinciples: [
    { en: 'No responsibility for user interpretation', sv: 'Inget ansvar för användartolkning' },
    { en: 'No responsibility for decisions made', sv: 'Inget ansvar för fattade beslut' },
    { en: 'Tools and data only', sv: 'Endast verktyg och data' },
  ],
  conclusion: {
    en: 'We are not doing anything new — we are doing it cleaner.',
    sv: 'Vi gör inget nytt — vi gör det renare.',
  },
};
