/**
 * ROOT KPI CONFIGURATION
 * ═══════════════════════════════════════════════════════════════
 * 
 * Detta är systemets överordnade mått:
 * "Andel av befolkningen som har funktionell livsförmåga"
 * 
 * Definition: Kan försörja sig, har god hälsa, och lever i trygghet
 * 
 * Alla andra KPI:er påverkar denna rot-indikator.
 */

export interface RootKPIThreshold {
  level: 'green' | 'yellow' | 'red';
  label: string;
  minValue: number;
  maxValue: number;
  description: string;
  implication: string;
}

export interface RootKPIConfig {
  id: string;
  name: string;
  shortName: string;
  unit: string;
  description: string;
  formula: string;
  thresholds: RootKPIThreshold[];
  components: RootKPIComponent[];
}

export interface RootKPIComponent {
  kpiId: string;
  weight: number;
  categoryId: string;
  influence: 'direct' | 'indirect' | 'modulating';
  lagMonths: number;
  description: string;
}

/**
 * TRÖSKELVÄRDEN FÖR ROT-KPI
 * ═══════════════════════════════════════════════════════════════
 * 
 * Grön: Systemet fungerar – befolkningen kan upprätthålla sig själv
 * Gul:  Varningszonen – negativa trender kräver uppmärksamhet  
 * Röd:  Kritiskt läge – strukturella problem kräver intervention
 */
export const ROOT_KPI_THRESHOLDS: RootKPIThreshold[] = [
  {
    level: 'green',
    label: 'Fungerande',
    minValue: 72,
    maxValue: 100,
    description: 'Över 72% av befolkningen har full funktionell livsförmåga',
    implication: 'Systemet är självbärande. Normalt reformarbete.',
  },
  {
    level: 'yellow', 
    label: 'Varning',
    minValue: 65,
    maxValue: 71.9,
    description: '65-72% av befolkningen har funktionell livsförmåga',
    implication: 'Negativa trender accelererar. Proaktiva åtgärder krävs.',
  },
  {
    level: 'red',
    label: 'Kritiskt',
    minValue: 0,
    maxValue: 64.9,
    description: 'Under 65% av befolkningen har funktionell livsförmåga',
    implication: 'Systemrisk. Strukturella reformer nödvändiga för att undvika nedåtgående spiral.',
  },
];

/**
 * KPI HIERARKISK KOPPLING TILL ROT-KPI
 * ═══════════════════════════════════════════════════════════════
 * 
 * Varje KPI påverkar rot-KPI:t med en vikt och fördröjning.
 * 
 * Influence types:
 * - direct: Omedelbar påverkan på livsförmåga
 * - indirect: Påverkar genom andra faktorer
 * - modulating: Förstärker eller dämpar andra effekter
 */
export const KPI_HIERARCHY: RootKPIComponent[] = [
  // ═══════════════════════════════════════════════════════════════
  // A. DEMOGRAFI & HÄLSA (vikt: 25%)
  // ═══════════════════════════════════════════════════════════════
  {
    kpiId: 'life_expectancy',
    weight: 0.08,
    categoryId: 'demografi_halsa',
    influence: 'direct',
    lagMonths: 0,
    description: 'Samlad effekt av hela samhället på individnivå',
  },
  {
    kpiId: 'excess_mortality',
    weight: 0.07,
    categoryId: 'demografi_halsa',
    influence: 'direct',
    lagMonths: 0,
    description: 'Akut signal på systemstress – direkt påverkan',
  },
  {
    kpiId: 'working_age_functional',
    weight: 0.10,
    categoryId: 'demografi_halsa',
    influence: 'direct',
    lagMonths: 0,
    description: 'Kärnkomponenten – de som bär systemet',
  },

  // ═══════════════════════════════════════════════════════════════
  // B. ARBETE & PRODUKTIVITET (vikt: 20%)
  // ═══════════════════════════════════════════════════════════════
  {
    kpiId: 'employment_rate_net',
    weight: 0.08,
    categoryId: 'arbete_produktivitet',
    influence: 'direct',
    lagMonths: 0,
    description: 'Faktisk ekonomisk delaktighet',
  },
  {
    kpiId: 'productivity_per_hour',
    weight: 0.05,
    categoryId: 'arbete_produktivitet',
    influence: 'indirect',
    lagMonths: 6,
    description: 'Framtida välstånd – påverkar med fördröjning',
  },
  {
    kpiId: 'long_term_exclusion',
    weight: 0.07,
    categoryId: 'arbete_produktivitet',
    influence: 'direct',
    lagMonths: 0,
    description: 'Permanent förlust av humankapital',
  },

  // ═══════════════════════════════════════════════════════════════
  // C. EKONOMISK BÄRKRAFT (vikt: 15%)
  // ═══════════════════════════════════════════════════════════════
  {
    kpiId: 'tax_base_growth',
    weight: 0.05,
    categoryId: 'ekonomisk_barkraft',
    influence: 'indirect',
    lagMonths: 12,
    description: 'Finansieringsförmåga – påverkar systemets uthållighet',
  },
  {
    kpiId: 'public_cost_per_capita',
    weight: 0.04,
    categoryId: 'ekonomisk_barkraft',
    influence: 'modulating',
    lagMonths: 6,
    description: 'Effektivitet – hur långt resurserna räcker',
  },
  {
    kpiId: 'dependency_ratio',
    weight: 0.06,
    categoryId: 'ekonomisk_barkraft',
    influence: 'indirect',
    lagMonths: 24,
    description: 'Långsiktig bärkraft – demografisk skuld',
  },

  // ═══════════════════════════════════════════════════════════════
  // D. SOCIAL STABILITET (vikt: 15%)
  // ═══════════════════════════════════════════════════════════════
  {
    kpiId: 'violent_crime_rate',
    weight: 0.05,
    categoryId: 'social_stabilitet',
    influence: 'direct',
    lagMonths: 0,
    description: 'Trygghet – direkt påverkan på livsförmåga',
  },
  {
    kpiId: 'young_men_outside_system',
    weight: 0.06,
    categoryId: 'social_stabilitet',
    influence: 'indirect',
    lagMonths: 6,
    description: 'Framtidsrisk – ledande indikator',
  },
  {
    kpiId: 'substance_harm',
    weight: 0.04,
    categoryId: 'social_stabilitet',
    influence: 'modulating',
    lagMonths: 3,
    description: 'Samhällsstress-markör',
  },

  // ═══════════════════════════════════════════════════════════════
  // E. KÄRNSYSTEMENS FUNKTION (vikt: 12%)
  // ═══════════════════════════════════════════════════════════════
  {
    kpiId: 'healthcare_queue_functional',
    weight: 0.04,
    categoryId: 'karnsystem_funktion',
    influence: 'direct',
    lagMonths: 0,
    description: 'Vård påverkar arbetsförmåga direkt',
  },
  {
    kpiId: 'school_outcomes_grade9',
    weight: 0.05,
    categoryId: 'karnsystem_funktion',
    influence: 'indirect',
    lagMonths: 60,
    description: 'Framtida arbetskraft – lång fördröjning',
  },
  {
    kpiId: 'justice_throughput',
    weight: 0.03,
    categoryId: 'karnsystem_funktion',
    influence: 'modulating',
    lagMonths: 6,
    description: 'Förtroende för systemet',
  },

  // ═══════════════════════════════════════════════════════════════
  // F. INFRASTRUKTUR (vikt: 8%)
  // ═══════════════════════════════════════════════════════════════
  {
    kpiId: 'housing_turnover',
    weight: 0.04,
    categoryId: 'infrastruktur',
    influence: 'indirect',
    lagMonths: 12,
    description: 'Rörlighet möjliggör arbete',
  },
  {
    kpiId: 'energy_stability',
    weight: 0.04,
    categoryId: 'infrastruktur',
    influence: 'modulating',
    lagMonths: 0,
    description: 'Grundförutsättning för ekonomisk aktivitet',
  },

  // ═══════════════════════════════════════════════════════════════
  // G. SYSTEMRISK & STYRNING (vikt: 5%)
  // ═══════════════════════════════════════════════════════════════
  {
    kpiId: 'regional_divergence',
    weight: 0.02,
    categoryId: 'systemrisk_styrning',
    influence: 'modulating',
    lagMonths: 12,
    description: 'Förstärker eller dämpar andra effekter',
  },
  {
    kpiId: 'policy_outcome_gap',
    weight: 0.02,
    categoryId: 'systemrisk_styrning',
    influence: 'modulating',
    lagMonths: 6,
    description: 'Styrningsförmåga påverkar alla andra åtgärder',
  },
  {
    kpiId: 'system_stress_index',
    weight: 0.01,
    categoryId: 'systemrisk_styrning',
    influence: 'modulating',
    lagMonths: 0,
    description: 'Aggregerad varningssignal',
  },
];

/**
 * ROOT KPI FULL CONFIGURATION
 */
export const ROOT_KPI_CONFIG: RootKPIConfig = {
  id: 'root_functional_capacity',
  name: 'Funktionell Livsförmåga',
  shortName: 'FLF',
  unit: '% av befolkning',
  description: 'Andel av befolkningen som har funktionell livsförmåga: kan försörja sig, har god hälsa, och lever i trygghet',
  formula: 'Viktat genomsnitt av 20 KPI:er, normaliserade till 0-100 skala',
  thresholds: ROOT_KPI_THRESHOLDS,
  components: KPI_HIERARCHY,
};

/**
 * Calculate current root KPI value from component KPIs
 */
export function calculateRootKPI(kpiValues: Record<string, number>): {
  value: number;
  level: 'green' | 'yellow' | 'red';
  contributions: { kpiId: string; contribution: number; weight: number }[];
} {
  let totalWeight = 0;
  let weightedSum = 0;
  const contributions: { kpiId: string; contribution: number; weight: number }[] = [];

  for (const component of KPI_HIERARCHY) {
    const value = kpiValues[component.kpiId];
    if (value !== undefined) {
      // Normalize value to 0-100 scale based on typical ranges
      const normalizedValue = normalizeKPIValue(component.kpiId, value);
      const contribution = normalizedValue * component.weight;
      
      weightedSum += contribution;
      totalWeight += component.weight;
      
      contributions.push({
        kpiId: component.kpiId,
        contribution,
        weight: component.weight,
      });
    }
  }

  const finalValue = totalWeight > 0 ? (weightedSum / totalWeight) : 0;
  
  // Determine level based on thresholds
  let level: 'green' | 'yellow' | 'red' = 'red';
  for (const threshold of ROOT_KPI_THRESHOLDS) {
    if (finalValue >= threshold.minValue && finalValue <= threshold.maxValue) {
      level = threshold.level;
      break;
    }
  }

  return { value: finalValue, level, contributions };
}

/**
 * Normalize individual KPI values to 0-100 scale
 */
function normalizeKPIValue(kpiId: string, value: number): number {
  // Define normalization ranges for each KPI
  const ranges: Record<string, { min: number; max: number; inverted?: boolean }> = {
    life_expectancy: { min: 75, max: 90 },
    excess_mortality: { min: 0, max: 10, inverted: true },
    working_age_functional: { min: 50, max: 85 },
    employment_rate_net: { min: 50, max: 80 },
    productivity_per_hour: { min: 80, max: 120 },
    long_term_exclusion: { min: 0, max: 15, inverted: true },
    tax_base_growth: { min: -2, max: 4 },
    public_cost_per_capita: { min: 200000, max: 300000, inverted: true },
    dependency_ratio: { min: 1.4, max: 2.0, inverted: true },
    violent_crime_rate: { min: 20, max: 60, inverted: true },
    young_men_outside_system: { min: 5, max: 20, inverted: true },
    substance_harm: { min: 500, max: 1200, inverted: true },
    healthcare_queue_functional: { min: 30, max: 90, inverted: true },
    school_outcomes_grade9: { min: 60, max: 90 },
    justice_throughput: { min: 150, max: 400, inverted: true },
    housing_turnover: { min: 3, max: 8 },
    energy_stability: { min: 40, max: 100 },
    regional_divergence: { min: 20, max: 50, inverted: true },
    policy_outcome_gap: { min: 30, max: 70 },
    system_stress_index: { min: 20, max: 80, inverted: true },
  };

  const range = ranges[kpiId];
  if (!range) return 50; // Default to middle if unknown

  // Clamp value to range
  const clampedValue = Math.max(range.min, Math.min(range.max, value));
  
  // Normalize to 0-100
  let normalized = ((clampedValue - range.min) / (range.max - range.min)) * 100;
  
  // Invert if necessary (lower is better)
  if (range.inverted) {
    normalized = 100 - normalized;
  }

  return normalized;
}
