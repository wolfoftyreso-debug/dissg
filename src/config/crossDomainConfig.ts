/**
 * WAVE 8 BLOCK BQ: Cross-Domain Correlation Library
 * 
 * Tvärsamband mellan domäner – visas alltid med osäkerhet.
 */

export interface CrossDomainRelation {
  id: string;
  name: string;
  name_en: string;
  domains: string[];
  description: string;
  description_en: string;
  typicalLagMonths: number;
  evidenceStrength: 'strong' | 'moderate' | 'weak' | 'emerging';
  limitationsNote: string;
  exampleIndicators: Array<{
    domain: string;
    indicator: string;
    direction: 'same' | 'opposite';
  }>;
}

/**
 * BQ1: Etablerade tvärsamband
 */
export const CROSS_DOMAIN_RELATIONS: CrossDomainRelation[] = [
  {
    id: 'energy_inflation_household',
    name: 'Energi ↔ Inflation ↔ Hushåll',
    name_en: 'Energy ↔ Inflation ↔ Household',
    domains: ['energy', 'inflation', 'household_economy'],
    description: 'Energiprisförändringar påverkar inflationsmått och hushållens köpkraft med varierande tidsfördröjning.',
    description_en: 'Energy price changes affect inflation measures and household purchasing power with varying time lags.',
    typicalLagMonths: 3,
    evidenceStrength: 'strong',
    limitationsNote: 'Sambandet varierar beroende på hushållens energiberoende och kompensationsmekanismer.',
    exampleIndicators: [
      { domain: 'energy', indicator: 'Elpris spot', direction: 'same' },
      { domain: 'inflation', indicator: 'KPIF', direction: 'same' },
      { domain: 'household_economy', indicator: 'Disponibel inkomst (real)', direction: 'opposite' },
    ],
  },
  {
    id: 'migration_housing_wages',
    name: 'Migration ↔ Bostäder ↔ Löner',
    name_en: 'Migration ↔ Housing ↔ Wages',
    domains: ['migration', 'housing', 'labor_market'],
    description: 'Ökad migration sammanfaller med press på bostadsmarknad och arbetsmarknad, med regional variation.',
    description_en: 'Increased migration coincides with pressure on housing and labor markets, with regional variation.',
    typicalLagMonths: 12,
    evidenceStrength: 'moderate',
    limitationsNote: 'Effekter varierar kraftigt mellan regioner och arbetsmarknadssegment.',
    exampleIndicators: [
      { domain: 'migration', indicator: 'Nettoinvandring', direction: 'same' },
      { domain: 'housing', indicator: 'Bostadsbrist', direction: 'same' },
      { domain: 'labor_market', indicator: 'Löneutveckling (okvalificerad)', direction: 'opposite' },
    ],
  },
  {
    id: 'health_productivity',
    name: 'Hälsa ↔ Produktivitet',
    name_en: 'Health ↔ Productivity',
    domains: ['health', 'productivity'],
    description: 'Ohälsotal och sjukfrånvaro samvarierar med produktivitetsmått på arbetsplatsnivå.',
    description_en: 'Illness rates and sick leave co-vary with productivity measures at workplace level.',
    typicalLagMonths: 6,
    evidenceStrength: 'strong',
    limitationsNote: 'Kausalitetsriktningen är oklar – ohälsa kan både orsaka och orsakas av låg produktivitet.',
    exampleIndicators: [
      { domain: 'health', indicator: 'Sjukfrånvaro', direction: 'same' },
      { domain: 'productivity', indicator: 'Arbetsproduktivitet', direction: 'opposite' },
    ],
  },
  {
    id: 'education_innovation',
    name: 'Utbildning ↔ Innovation',
    name_en: 'Education ↔ Innovation',
    domains: ['education', 'innovation'],
    description: 'Utbildningsnivå och kunskapsresultat samvarierar med innovationsmått, med lång tidsfördröjning.',
    description_en: 'Education levels and knowledge results co-vary with innovation measures, with long time lag.',
    typicalLagMonths: 60,
    evidenceStrength: 'moderate',
    limitationsNote: 'Sambandet påverkas av många mellanliggande faktorer som arbetsmiljö och finansiering.',
    exampleIndicators: [
      { domain: 'education', indicator: 'Högskoleutbildade', direction: 'same' },
      { domain: 'innovation', indicator: 'Patent per capita', direction: 'same' },
    ],
  },
  {
    id: 'institutions_capital',
    name: 'Institutioner ↔ Kapitalflöden',
    name_en: 'Institutions ↔ Capital Flows',
    domains: ['institutional_trust', 'investments'],
    description: 'Institutionell stabilitet och rättsstatsmått samvarierar med utländska direktinvesteringar.',
    description_en: 'Institutional stability and rule of law measures co-vary with foreign direct investments.',
    typicalLagMonths: 24,
    evidenceStrength: 'strong',
    limitationsNote: 'Kortsiktiga kapitalflöden kan avvika från långsiktiga mönster.',
    exampleIndicators: [
      { domain: 'institutional_trust', indicator: 'Rule of Law Index', direction: 'same' },
      { domain: 'investments', indicator: 'FDI inflow', direction: 'same' },
    ],
  },
  {
    id: 'demographics_public_finance',
    name: 'Demografi ↔ Offentliga Finanser',
    name_en: 'Demographics ↔ Public Finance',
    domains: ['demographics', 'public_finance'],
    description: 'Åldersstruktur och försörjningskvot samvarierar med offentliga finansers hållbarhet.',
    description_en: 'Age structure and dependency ratio co-vary with public finance sustainability.',
    typicalLagMonths: 120,
    evidenceStrength: 'strong',
    limitationsNote: 'Långsiktiga projektioner har hög osäkerhet.',
    exampleIndicators: [
      { domain: 'demographics', indicator: 'Försörjningskvot', direction: 'same' },
      { domain: 'public_finance', indicator: 'Pensionskostnader/BNP', direction: 'same' },
    ],
  },
];

/**
 * Evidence strength labels
 */
export const EVIDENCE_STRENGTH_LABELS = {
  strong: { sv: 'Starkt belagt', en: 'Strong evidence' },
  moderate: { sv: 'Måttligt belagt', en: 'Moderate evidence' },
  weak: { sv: 'Svagt belagt', en: 'Weak evidence' },
  emerging: { sv: 'Framväxande', en: 'Emerging' },
};

/**
 * Hitta relevanta tvärsamband för en domän
 */
export function findRelationsForDomain(domain: string): CrossDomainRelation[] {
  return CROSS_DOMAIN_RELATIONS.filter(r => 
    r.domains.includes(domain)
  );
}

/**
 * Generera disclaimer för tvärsamband
 */
export function getCrossDomainDisclaimer(relationId: string, lang: 'sv' | 'en' = 'sv'): string {
  const relation = CROSS_DOMAIN_RELATIONS.find(r => r.id === relationId);
  if (!relation) return '';
  
  const evidenceLabel = EVIDENCE_STRENGTH_LABELS[relation.evidenceStrength][lang];
  
  if (lang === 'sv') {
    return `${evidenceLabel}. ${relation.limitationsNote}`;
  }
  return `${evidenceLabel}. ${relation.limitationsNote}`;
}
