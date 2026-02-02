/**
 * 💼 BUSINESS MODEL CONFIGURATION
 * 
 * License structure, public vs premium, value positioning, pricing rationale.
 * 
 * Core principle:
 * "The platform provides data aggregation and analytical tools.
 * All scenarios, simulations and interpretations are created by users 
 * under their own responsibility."
 */

// ============================================================
// RESPONSIBILITY MODEL (LEGALLY CRITICAL)
// ============================================================

export const RESPONSIBILITY_MODEL = {
  title: {
    en: 'Responsibility Model',
    sv: 'Ansvarsmodell',
  },
  platformProvides: {
    label: { en: 'Platform Provides', sv: 'Plattformen tillhandahåller' },
    items: [
      { en: 'Data aggregation', sv: 'Dataaggregering' },
      { en: 'Analytical tools', sv: 'Analysverktyg' },
      { en: 'Computational capacity', sv: 'Beräkningskapacitet' },
      { en: 'Methodological framework', sv: 'Metodiskt ramverk' },
    ],
  },
  platformDoesNot: {
    label: { en: 'Platform Does Not', sv: 'Plattformen ansvarar inte för' },
    items: [
      { en: 'Interpret results', sv: 'Tolka resultat' },
      { en: 'Recommend actions', sv: 'Rekommendera åtgärder' },
      { en: 'Validate conclusions', sv: 'Validera slutsatser' },
      { en: 'Bear responsibility for decisions', sv: 'Bära ansvar för beslut' },
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
  legalStatement: {
    en: 'The platform provides data aggregation and analytical tools. All scenarios, simulations and interpretations are created by users under their own responsibility.',
    sv: 'Plattformen tillhandahåller dataaggregering och analysverktyg. Alla scenarier, simuleringar och tolkningar skapas av användare under eget ansvar.',
  },
};

// ============================================================
// LICENSE TIERS
// ============================================================

export type LicenseTier = 'public' | 'pro' | 'institutional' | 'infrastructure';

export interface LicenseTierDefinition {
  id: LicenseTier;
  name: { en: string; sv: string };
  tagline: { en: string; sv: string };
  audience: { en: string; sv: string };
  price: {
    display: { en: string; sv: string };
    value: number | null;
    period: 'month' | 'year' | 'custom';
  };
  features: Array<{ en: string; sv: string }>;
  limitations: Array<{ en: string; sv: string }>;
  color: string;
  icon: string;
}

export const LICENSE_TIERS: LicenseTierDefinition[] = [
  {
    id: 'public',
    name: { en: 'Public Access', sv: 'Publik tillgång' },
    tagline: { en: 'Understand', sv: 'Förstå' },
    audience: { en: 'Citizens, journalists, students', sv: 'Medborgare, journalister, studenter' },
    price: { display: { en: 'Free', sv: 'Gratis' }, value: 0, period: 'month' },
    features: [
      { en: 'All public data', sv: 'All publik data' },
      { en: 'Basic visualizations', sv: 'Grundläggande visualiseringar' },
      { en: 'Source links', sv: 'Källänkar' },
      { en: 'Transparency reports', sv: 'Transparensrapporter' },
    ],
    limitations: [
      { en: 'No export', sv: 'Ingen export' },
      { en: 'No API access', sv: 'Ingen API-åtkomst' },
      { en: 'No scenario tools', sv: 'Inga scenarioverktyg' },
    ],
    color: 'border-primary/30 bg-primary/5',
    icon: '🌐',
  },
  {
    id: 'pro',
    name: { en: 'Professional', sv: 'Professionell' },
    tagline: { en: 'Work', sv: 'Arbeta' },
    audience: { en: 'Analysts, researchers, advisors', sv: 'Analytiker, forskare, rådgivare' },
    price: { display: { en: '€99/month', sv: '€99/månad' }, value: 99, period: 'month' },
    features: [
      { en: 'Everything in Public', sv: 'Allt i Publik' },
      { en: 'Data export (CSV, JSON)', sv: 'Dataexport (CSV, JSON)' },
      { en: 'Saved views & alerts', sv: 'Sparade vyer & notiser' },
      { en: 'Basic scenario tools', sv: 'Grundläggande scenarioverktyg' },
    ],
    limitations: [
      { en: 'Single user', sv: 'En användare' },
      { en: 'No API access', sv: 'Ingen API-åtkomst' },
    ],
    color: 'border-blue-500/30 bg-blue-500/5',
    icon: '💼',
  },
  {
    id: 'institutional',
    name: { en: 'Institutional', sv: 'Institutionell' },
    tagline: { en: 'Automate', sv: 'Automatisera' },
    audience: { en: 'Research institutes, banks, policy labs', sv: 'Forskningsinstitut, banker, policy labs' },
    price: { display: { en: '€999/month', sv: '€999/månad' }, value: 999, period: 'month' },
    features: [
      { en: 'Everything in Professional', sv: 'Allt i Professionell' },
      { en: 'Full API access', sv: 'Full API-åtkomst' },
      { en: 'Team accounts (up to 10)', sv: 'Teamkonton (upp till 10)' },
      { en: 'Advanced scenario lab', sv: 'Avancerat scenariolabb' },
      { en: 'Monte Carlo simulations', sv: 'Monte Carlo-simuleringar' },
    ],
    limitations: [
      { en: 'Rate limits apply', sv: 'Hastighetsbegränsningar gäller' },
    ],
    color: 'border-amber-500/30 bg-amber-500/5',
    icon: '🏛️',
  },
  {
    id: 'infrastructure',
    name: { en: 'Infrastructure', sv: 'Infrastruktur' },
    tagline: { en: 'Govern', sv: 'Styra' },
    audience: { en: 'Governments, central banks', sv: 'Regeringar, centralbanker' },
    price: { display: { en: 'Custom', sv: 'Anpassat' }, value: null, period: 'custom' },
    features: [
      { en: 'Everything in Institutional', sv: 'Allt i Institutionell' },
      { en: 'Unlimited users', sv: 'Obegränsade användare' },
      { en: 'Custom data integrations', sv: 'Anpassade dataintegrationer' },
      { en: 'On-premise deployment', sv: 'Lokal installation' },
      { en: 'Dedicated support', sv: 'Dedikerad support' },
    ],
    limitations: [],
    color: 'border-purple-500/30 bg-purple-500/5',
    icon: '🌍',
  },
];

// ============================================================
// PUBLIC VS PREMIUM DISTINCTION
// ============================================================

export const PUBLIC_PREMIUM_DISTINCTION = {
  title: { en: 'Public vs Premium', sv: 'Publik vs Premium' },
  principle: {
    en: 'Data and understanding are always free. Tools, persistence, export and API cost.',
    sv: 'Data och förståelse är alltid gratis. Verktyg, persistens, export och API kostar.',
  },
  public: {
    label: { en: 'Always Free', sv: 'Alltid gratis' },
    items: [
      { en: 'Access to all public indicators', sv: 'Tillgång till alla publika indikatorer' },
      { en: 'Transparency about methods', sv: 'Transparens om metoder' },
      { en: 'Source verification', sv: 'Källverifiering' },
    ],
  },
  premium: {
    label: { en: 'Premium Features', sv: 'Premium-funktioner' },
    items: [
      { en: 'Data export', sv: 'Dataexport' },
      { en: 'API access', sv: 'API-åtkomst' },
      { en: 'Scenario tools', sv: 'Scenarioverktyg' },
      { en: 'Team collaboration', sv: 'Teamsamarbete' },
    ],
  },
};

// ============================================================
// VALUE PROPOSITION
// ============================================================

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
      { en: 'Data hygiene infrastructure', sv: 'Datahygien-infrastruktur' },
    ],
  },
  competitorStatement: {
    en: 'We do not compete with "free information". We compete with bad information.',
    sv: 'Vi konkurrerar inte med "gratis information". Vi konkurrerar med dålig information.',
  },
};

// ============================================================
// PRICING RATIONALE
// ============================================================

export const PRICING_RATIONALE = {
  title: { en: 'Pricing Rationale', sv: 'Prislogik' },
  costDrivers: {
    label: { en: 'What The Price Covers', sv: 'Vad priset täcker' },
    items: [
      { en: 'Source verification', sv: 'Källverifiering' },
      { en: 'Continuous data updates', sv: 'Kontinuerlig datauppdatering' },
      { en: 'Methodology review', sv: 'Metodgranskning' },
      { en: 'Bias documentation', sv: 'Bias-dokumentation' },
      { en: 'Historical consistency', sv: 'Historisk konsistens' },
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
// INDUSTRY STANDARD
// ============================================================

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
