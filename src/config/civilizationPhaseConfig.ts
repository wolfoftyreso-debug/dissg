/**
 * CIVILIZATION PHASE MAP (CPM)
 * 
 * "Identifiera var ett samhälle befinner sig i den långsiktiga cykeln – utan att förutsäga slut."
 * 
 * Detta är orientering, inte domedag.
 * En karta, inte en profetia.
 */

// === 1. CORE PRINCIPLE ===

export const CPM_CORE_PRINCIPLE = {
  sv: 'Vissa mönster tenderar att uppstå när vissa strukturella villkor sammanfaller.',
  en: 'Certain patterns tend to emerge when certain structural conditions coincide.'
};

export const CPM_NOT_CLAIMS = [
  { sv: 'Att kollaps är oundviklig', en: 'That collapse is inevitable' },
  { sv: 'Att historien upprepar sig exakt', en: 'That history repeats exactly' }
];

export const CPM_OBSERVATION = {
  sv: 'Komplexa samhällen rör sig genom återkommande faser – men med olika hastighet, skala och utfall.',
  en: 'Complex societies move through recurring phases – but with different speed, scale, and outcomes.'
};

// === 2. THE FIVE PHASES ===

export interface CivilizationPhase {
  id: 'building' | 'expansion' | 'maturity' | 'overload' | 'transition';
  number: number;
  label: string;
  labelSv: string;
  description: string;
  descriptionSv: string;
  characteristics: { label: string; labelSv: string }[];
  color: string;
  keyFactors: { label: string; labelSv: string }[];
}

export const CIVILIZATION_PHASES: CivilizationPhase[] = [
  {
    id: 'building',
    number: 1,
    label: 'Building',
    labelSv: 'Uppbyggnad',
    description: 'Foundation establishment, low complexity',
    descriptionSv: 'Grundläggning, låg komplexitet',
    characteristics: [
      { label: 'Increasing energy per capita', labelSv: 'Ökande energi per capita' },
      { label: 'Growing institutional capacity', labelSv: 'Växande institutionell kapacitet' },
      { label: 'Low debt burden', labelSv: 'Låg skuldbelastning' },
      { label: 'Future optimism', labelSv: 'Framtidsoptimism' }
    ],
    color: 'hsl(142, 76%, 36%)',
    keyFactors: [
      { label: 'Capital formation', labelSv: 'Kapitalbildning' },
      { label: 'Institution building', labelSv: 'Institutionsbyggande' },
      { label: 'Social cohesion', labelSv: 'Social sammanhållning' }
    ]
  },
  {
    id: 'expansion',
    number: 2,
    label: 'Expansion',
    labelSv: 'Expansion',
    description: 'Rapid growth, increasing complexity',
    descriptionSv: 'Snabb tillväxt, ökande komplexitet',
    characteristics: [
      { label: 'Rapid population growth', labelSv: 'Snabb befolkningstillväxt' },
      { label: 'Technical acceleration', labelSv: 'Teknisk acceleration' },
      { label: 'Increasing specialization', labelSv: 'Ökande specialisering' },
      { label: 'Rising complexity', labelSv: 'Stigande komplexitet' }
    ],
    color: 'hsl(217, 91%, 60%)',
    keyFactors: [
      { label: 'Innovation rate', labelSv: 'Innovationstakt' },
      { label: 'Resource access', labelSv: 'Resurstillgång' },
      { label: 'Scaling ability', labelSv: 'Skalningsförmåga' }
    ]
  },
  {
    id: 'maturity',
    number: 3,
    label: 'Maturity',
    labelSv: 'Mognad',
    description: 'Stable growth, high welfare, rising maintenance',
    descriptionSv: 'Stabil tillväxt, högt välstånd, ökande underhåll',
    characteristics: [
      { label: 'Stable growth', labelSv: 'Stabil tillväxt' },
      { label: 'High prosperity', labelSv: 'Högt välstånd' },
      { label: 'Increasing maintenance requirements', labelSv: 'Ökande underhållskrav' },
      { label: 'Beginning institutional inertia', labelSv: 'Begynnande institutionell tröghet' }
    ],
    color: 'hsl(45, 93%, 47%)',
    keyFactors: [
      { label: 'Institutional maintenance', labelSv: 'Institutionellt underhåll' },
      { label: 'Adaptation capacity', labelSv: 'Anpassningsförmåga' },
      { label: 'Renewal investment', labelSv: 'Förnyelseinvestering' }
    ]
  },
  {
    id: 'overload',
    number: 4,
    label: 'Overload',
    labelSv: 'Överbelastning',
    description: 'Rising debt, shrinking margins, fragmentation',
    descriptionSv: 'Stigande skuld, minskande marginaler, fragmentering',
    characteristics: [
      { label: 'Rising debt (financial & institutional)', labelSv: 'Stigande skuld (finansiell & institutionell)' },
      { label: 'Shrinking margins', labelSv: 'Minskande marginaler' },
      { label: 'Increasing resource conflicts', labelSv: 'Ökande konflikter om resurser' },
      { label: 'Political fragmentation', labelSv: 'Politisk fragmentering' }
    ],
    color: 'hsl(0, 84%, 60%)',
    keyFactors: [
      { label: 'Debt discipline', labelSv: 'Skulddisciplin' },
      { label: 'Legitimacy', labelSv: 'Legitimitet' },
      { label: 'Conflict management', labelSv: 'Konflikthantering' }
    ]
  },
  {
    id: 'transition',
    number: 5,
    label: 'Transition',
    labelSv: 'Omställning',
    description: 'Reform or decline, power redistribution',
    descriptionSv: 'Reform eller förfall, maktomfördelning',
    characteristics: [
      { label: 'Reforms or decline', labelSv: 'Reformer eller förfall' },
      { label: 'Power redistribution', labelSv: 'Omfördelning av makt & resurser' },
      { label: 'Simplification or technological leap', labelSv: 'Förenkling eller tekniskt språng' }
    ],
    color: 'hsl(271, 81%, 56%)',
    keyFactors: [
      { label: 'Leadership quality', labelSv: 'Ledarskapskvalitet' },
      { label: 'Social consensus', labelSv: 'Social konsensus' },
      { label: 'External conditions', labelSv: 'Externa förutsättningar' }
    ]
  }
];

// === 3. PLACEMENT INDICATORS ===

export interface PlacementIndicator {
  id: string;
  label: string;
  labelSv: string;
  weight: number;
  description: string;
  descriptionSv: string;
}

export const PLACEMENT_INDICATORS: PlacementIndicator[] = [
  {
    id: 'energy_trend',
    label: 'Energy per capita (trend)',
    labelSv: 'Energi per capita (trend)',
    weight: 0.20,
    description: 'Direction and stability of energy availability',
    descriptionSv: 'Riktning och stabilitet för energitillgång'
  },
  {
    id: 'resilience',
    label: 'Resilience',
    labelSv: 'Resiliens',
    weight: 0.15,
    description: 'Ability to absorb and recover from shocks',
    descriptionSv: 'Förmåga att absorbera och återhämta sig från chocker'
  },
  {
    id: 'intergenerational_debt',
    label: 'Intergenerational debt',
    labelSv: 'Intergenerationell skuld',
    weight: 0.18,
    description: 'Burden passed to future generations',
    descriptionSv: 'Belastning som förs vidare till framtida generationer'
  },
  {
    id: 'institutional_efficiency',
    label: 'Institutional efficiency',
    labelSv: 'Institutionell effektivitet',
    weight: 0.17,
    description: 'Ability to execute decisions and maintain trust',
    descriptionSv: 'Förmåga att genomföra beslut och upprätthålla förtroende'
  },
  {
    id: 'conflict_intensity',
    label: 'Conflict intensity',
    labelSv: 'Konfliktintensitet',
    weight: 0.15,
    description: 'Level of internal social and political tension',
    descriptionSv: 'Nivå av interna sociala och politiska spänningar'
  },
  {
    id: 'innovation_rate',
    label: 'Innovation rate',
    labelSv: 'Innovationsgrad',
    weight: 0.15,
    description: 'Rate of technological and organizational adaptation',
    descriptionSv: 'Takt för teknisk och organisatorisk anpassning'
  }
];

// === 4. COUNTRY PHASE DATA ===

export interface CountryPhaseData {
  code: string;
  name: string;
  nameSv: string;
  phasePosition: number; // 0-100 (0=start of building, 100=end of transition)
  phaseRange: [number, number]; // uncertainty range
  velocity: number; // -10 to +10 (negative = moving backward)
  accelerating: boolean;
  historicalTransitions: number; // successful transitions in history
  indicatorScores: Record<string, number>; // 0-100 for each indicator
}

export const COUNTRY_PHASE_DATA: CountryPhaseData[] = [
  {
    code: 'SE',
    name: 'Sweden',
    nameSv: 'Sverige',
    phasePosition: 62,
    phaseRange: [58, 68],
    velocity: 2.5,
    accelerating: false,
    historicalTransitions: 3,
    indicatorScores: {
      energy_trend: 55,
      resilience: 68,
      intergenerational_debt: 45,
      institutional_efficiency: 62,
      conflict_intensity: 35,
      innovation_rate: 72
    }
  },
  {
    code: 'NO',
    name: 'Norway',
    nameSv: 'Norge',
    phasePosition: 52,
    phaseRange: [48, 56],
    velocity: 0.8,
    accelerating: false,
    historicalTransitions: 2,
    indicatorScores: {
      energy_trend: 85,
      resilience: 82,
      intergenerational_debt: 22,
      institutional_efficiency: 78,
      conflict_intensity: 18,
      innovation_rate: 65
    }
  },
  {
    code: 'US',
    name: 'United States',
    nameSv: 'USA',
    phasePosition: 72,
    phaseRange: [65, 78],
    velocity: 4.2,
    accelerating: true,
    historicalTransitions: 2,
    indicatorScores: {
      energy_trend: 62,
      resilience: 55,
      intergenerational_debt: 68,
      institutional_efficiency: 45,
      conflict_intensity: 65,
      innovation_rate: 85
    }
  },
  {
    code: 'JP',
    name: 'Japan',
    nameSv: 'Japan',
    phasePosition: 78,
    phaseRange: [72, 82],
    velocity: 1.5,
    accelerating: false,
    historicalTransitions: 2,
    indicatorScores: {
      energy_trend: 42,
      resilience: 72,
      intergenerational_debt: 85,
      institutional_efficiency: 68,
      conflict_intensity: 22,
      innovation_rate: 75
    }
  },
  {
    code: 'CN',
    name: 'China',
    nameSv: 'Kina',
    phasePosition: 48,
    phaseRange: [42, 55],
    velocity: -1.2,
    accelerating: false,
    historicalTransitions: 4,
    indicatorScores: {
      energy_trend: 72,
      resilience: 58,
      intergenerational_debt: 55,
      institutional_efficiency: 65,
      conflict_intensity: 45,
      innovation_rate: 78
    }
  },
  {
    code: 'DE',
    name: 'Germany',
    nameSv: 'Tyskland',
    phasePosition: 65,
    phaseRange: [60, 70],
    velocity: 2.8,
    accelerating: true,
    historicalTransitions: 3,
    indicatorScores: {
      energy_trend: 45,
      resilience: 62,
      intergenerational_debt: 52,
      institutional_efficiency: 72,
      conflict_intensity: 38,
      innovation_rate: 68
    }
  },
  {
    code: 'IN',
    name: 'India',
    nameSv: 'Indien',
    phasePosition: 32,
    phaseRange: [28, 38],
    velocity: -2.5,
    accelerating: false,
    historicalTransitions: 2,
    indicatorScores: {
      energy_trend: 75,
      resilience: 48,
      intergenerational_debt: 35,
      institutional_efficiency: 42,
      conflict_intensity: 55,
      innovation_rate: 62
    }
  },
  {
    code: 'BR',
    name: 'Brazil',
    nameSv: 'Brasilien',
    phasePosition: 55,
    phaseRange: [48, 62],
    velocity: 1.8,
    accelerating: false,
    historicalTransitions: 1,
    indicatorScores: {
      energy_trend: 68,
      resilience: 45,
      intergenerational_debt: 48,
      institutional_efficiency: 38,
      conflict_intensity: 58,
      innovation_rate: 52
    }
  }
];

// === 5. PHASE POSITION HELPERS ===

export const getPhaseFromPosition = (position: number): CivilizationPhase => {
  if (position < 20) return CIVILIZATION_PHASES[0]; // building
  if (position < 40) return CIVILIZATION_PHASES[1]; // expansion
  if (position < 60) return CIVILIZATION_PHASES[2]; // maturity
  if (position < 80) return CIVILIZATION_PHASES[3]; // overload
  return CIVILIZATION_PHASES[4]; // transition
};

export const getPhaseColor = (position: number): string => {
  return getPhaseFromPosition(position).color;
};

// === 6. KEY MESSAGES ===

export const KEY_MESSAGES = {
  notDoom: {
    sv: 'Inte "vi är dömda"',
    en: 'Not "we are doomed"'
  },
  notNostalgia: {
    sv: 'Inte "allt var bättre förr"',
    en: 'Not "everything was better before"'
  },
  notTheory: {
    sv: 'Inte "en teori"',
    en: 'Not "a theory"'
  },
  whatItIs: {
    sv: 'En sammanfattning av strukturella signaler över tid.',
    en: 'A summary of structural signals over time.'
  },
  speedMatters: {
    sv: 'Hastighet är ofta viktigare än nivå.',
    en: 'Speed is often more important than level.'
  },
  transitionOutcomes: {
    sv: 'Omställning kan leda tillbaka till uppbyggnad eller till lång stagnation. Systemet avgör inte vilket.',
    en: 'Transition can lead back to building or to long stagnation. The system does not determine which.'
  },
  placementTransparency: {
    sv: 'Placeringen baseras på följande indikatorer…',
    en: 'The placement is based on the following indicators…'
  },
  coreInsight: {
    sv: 'Det är inte faserna som fäller civilisationer – det är oförmågan att förstå vilken fas man är i.',
    en: 'It is not the phases that fell civilizations – it is the inability to understand which phase one is in.'
  }
};

// === 7. MODULE CONNECTIONS ===

export const MODULE_CONNECTIONS = [
  { id: 'resilience', label: 'Resilience', labelSv: 'Resiliens', icon: '🔄', description: 'Hur väl omställning kan ske', descriptionEn: 'How well transition can occur' },
  { id: 'fairness', label: 'Intergenerational Fairness', labelSv: 'Intergenerationell rättvisa', icon: '⏳', description: 'Vem betalar', descriptionEn: 'Who pays' },
  { id: 'capacity', label: 'Carrying Capacity', labelSv: 'Bärkraft', icon: '🌍', description: 'Energi & resurser', descriptionEn: 'Energy & resources' },
  { id: 'scenarios', label: 'Policy Scenarios', labelSv: 'Policyscenarier', icon: '🧪', description: 'Historiska paralleller', descriptionEn: 'Historical parallels' }
];
