/**
 * Institutional Governance Model
 * 
 * Three-tier governance structure for protecting the truth layer.
 * No actor may both change the system AND benefit from the change.
 * 
 * Part of Block 55: Public Trust Log & Governance
 */

// ============================================================================
// 1. GOVERNANCE TIERS (IMMUTABLE STRUCTURE)
// ============================================================================

export type GovernanceTier = 'builder' | 'steward' | 'guardian';

export interface GovernanceTierDefinition {
  tier: GovernanceTier;
  label: string;
  labelLocal: Record<string, string>;
  role: string;
  roleLocal: Record<string, string>;
  description: string;
  descriptionLocal: Record<string, string>;
  responsibilities: string[];
  responsibilitiesLocal: Record<string, string[]>;
  prohibitions: string[];
  prohibitionsLocal: Record<string, string[]>;
  icon: string;
}

export const GOVERNANCE_TIERS: Record<GovernanceTier, GovernanceTierDefinition> = {
  builder: {
    tier: 'builder',
    label: 'Builders',
    labelLocal: { sv: 'Byggare' },
    role: 'Build, but do not decide',
    roleLocal: { sv: 'Bygger, men bestämmer inte' },
    description: 'Engineers and developers who build and scale the platform.',
    descriptionLocal: { sv: 'Ingenjörer och utvecklare som bygger och skalar plattformen.' },
    responsibilities: [
      'Develop technology',
      'Improve UX',
      'Scale the system',
      'Integrate new data sources'
    ],
    responsibilitiesLocal: {
      sv: [
        'Utvecklar teknik',
        'Förbättrar UX',
        'Skalar systemet',
        'Integrerar nya datakällor'
      ]
    },
    prohibitions: [
      'Change definitions',
      'Alter methodological principles',
      'Modify language discipline',
      'Remove limitations'
    ],
    prohibitionsLocal: {
      sv: [
        'Ändra definitioner',
        'Ändra metodprinciper',
        'Ändra språkets disciplin',
        'Ta bort begränsningar'
      ]
    },
    icon: 'Hammer'
  },
  steward: {
    tier: 'steward',
    label: 'Stewards',
    labelLocal: { sv: 'Förvaltare' },
    role: 'Guard method and data',
    roleLocal: { sv: 'Förvaltar metod & data' },
    description: 'Statisticians, methodologists, and data scientists who ensure correctness.',
    descriptionLocal: { sv: 'Statistiker, metodexperter och datavetare som säkerställer korrekthet.' },
    responsibilities: [
      'Approve data sources',
      'Ensure methodological correctness',
      'Review aggregation rules',
      'Ensure comparability'
    ],
    responsibilitiesLocal: {
      sv: [
        'Godkänner datakällor',
        'Säkerställer metodisk korrekthet',
        'Granskar aggregeringsregler',
        'Säkerställer jämförbarhet'
      ]
    },
    prohibitions: [
      'Change platform purpose',
      'Introduce interpretation',
      'Prioritize content ideologically'
    ],
    prohibitionsLocal: {
      sv: [
        'Ändra plattformens syfte',
        'Införa tolkning',
        'Prioritera innehåll ideologiskt'
      ]
    },
    icon: 'Scale'
  },
  guardian: {
    tier: 'guardian',
    label: 'Guardians',
    labelLocal: { sv: 'Väktare' },
    role: 'Can stop everything',
    roleLocal: { sv: 'Kan stoppa allt' },
    description: 'Independent council with veto power to protect the charter.',
    descriptionLocal: { sv: 'Oberoende råd med vetorätt för att skydda chartern.' },
    responsibilities: [
      'Protect the charter',
      'Exercise veto power',
      'Stop deployments if needed',
      'Freeze functions if needed'
    ],
    responsibilitiesLocal: {
      sv: [
        'Skyddar chartern',
        'Utövar vetorätt',
        'Stoppar deploys vid behov',
        'Fryser funktioner vid behov'
      ]
    },
    prohibitions: [],
    prohibitionsLocal: { sv: [] },
    icon: 'Shield'
  }
};

// ============================================================================
// 2. VETO MECHANISM
// ============================================================================

export interface VetoTrigger {
  code: string;
  label: string;
  labelLocal: Record<string, string>;
  description: string;
  descriptionLocal: Record<string, string>;
}

export const VETO_TRIGGERS: VetoTrigger[] = [
  {
    code: 'charter_violation',
    label: 'Charter Violation',
    labelLocal: { sv: 'Charterbrott' },
    description: 'Attempt to change immutable charter principles',
    descriptionLocal: { sv: 'Försök att ändra oföränderliga charterprinciper' }
  },
  {
    code: 'methodological_manipulation',
    label: 'Methodological Manipulation',
    labelLocal: { sv: 'Metodisk manipulation' },
    description: 'Attempt to distort aggregation or presentation',
    descriptionLocal: { sv: 'Försök att förvränga aggregering eller presentation' }
  },
  {
    code: 'hidden_influence',
    label: 'Hidden Influence',
    labelLocal: { sv: 'Dold påverkan' },
    description: 'Undisclosed attempt to affect content or visibility',
    descriptionLocal: { sv: 'Ej offentliggjort försök att påverka innehåll eller synlighet' }
  },
  {
    code: 'recommendation_introduction',
    label: 'Recommendation Introduction',
    labelLocal: { sv: 'Införande av rekommendationer' },
    description: 'Attempt to add policy recommendations or suggestions',
    descriptionLocal: { sv: 'Försök att lägga till policyrekommendationer eller förslag' }
  },
  {
    code: 'uncertainty_hiding',
    label: 'Uncertainty Hiding',
    labelLocal: { sv: 'Döljande av osäkerhet' },
    description: 'Attempt to hide or downplay data limitations',
    descriptionLocal: { sv: 'Försök att dölja eller tona ned databegränsningar' }
  },
  {
    code: 'language_slanting',
    label: 'Language Slanting',
    labelLocal: { sv: 'Språklig vinkling' },
    description: 'Attempt to introduce biased or normative language',
    descriptionLocal: { sv: 'Försök att införa partiskt eller normativt språk' }
  },
  {
    code: 'actor_prioritization',
    label: 'Actor Prioritization',
    labelLocal: { sv: 'Aktörsprioritering' },
    description: 'Attempt to favor specific actors in visibility or treatment',
    descriptionLocal: { sv: 'Försök att favorisera specifika aktörer i synlighet eller behandling' }
  }
];

export interface VetoConsequence {
  action: string;
  actionLocal: Record<string, string>;
  isAutomatic: boolean;
}

export const VETO_CONSEQUENCES: VetoConsequence[] = [
  {
    action: 'Public Trust Log entry created',
    actionLocal: { sv: 'Publik Trust Log-post skapas' },
    isAutomatic: true
  },
  {
    action: 'Function or feature frozen',
    actionLocal: { sv: 'Funktion eller feature fryses' },
    isAutomatic: true
  },
  {
    action: 'Open justification published',
    actionLocal: { sv: 'Öppen motivering publiceras' },
    isAutomatic: true
  },
  {
    action: 'Deployment blocked until resolved',
    actionLocal: { sv: 'Deploy blockeras tills löst' },
    isAutomatic: true
  }
];

// ============================================================================
// 3. OWNERSHIP SEPARATION
// ============================================================================

export interface OwnershipRight {
  action: string;
  actionLocal: Record<string, string>;
  allowed: boolean;
}

export const OWNER_CAN: OwnershipRight[] = [
  { action: 'Finance the platform', actionLocal: { sv: 'Finansiera plattformen' }, allowed: true },
  { action: 'Scale infrastructure', actionLocal: { sv: 'Skala infrastruktur' }, allowed: true },
  { action: 'Integrate with external systems', actionLocal: { sv: 'Integrera med externa system' }, allowed: true },
  { action: 'Hire and manage builders', actionLocal: { sv: 'Anställa och leda byggare' }, allowed: true }
];

export const OWNER_CANNOT: OwnershipRight[] = [
  { action: 'Change truth definition', actionLocal: { sv: 'Ändra sanningsdefinition' }, allowed: false },
  { action: 'Control visibility', actionLocal: { sv: 'Styra synlighet' }, allowed: false },
  { action: 'Influence language', actionLocal: { sv: 'Påverka språk' }, allowed: false },
  { action: 'Prioritize narratives', actionLocal: { sv: 'Prioritera narrativ' }, allowed: false },
  { action: 'Remove uncertainty', actionLocal: { sv: 'Ta bort osäkerhet' }, allowed: false },
  { action: 'Introduce recommendations', actionLocal: { sv: 'Införa rekommendationer' }, allowed: false },
  { action: 'Hide data', actionLocal: { sv: 'Dölja data' }, allowed: false }
];

// ============================================================================
// 4. CONFLICT RESOLUTION
// ============================================================================

export interface ConflictResponseStep {
  order: number;
  action: string;
  actionLocal: Record<string, string>;
}

export const CONFLICT_RESOLUTION_STEPS: ConflictResponseStep[] = [
  { order: 1, action: 'Show the data', actionLocal: { sv: 'Visa datan' } },
  { order: 2, action: 'Show the method', actionLocal: { sv: 'Visa metoden' } },
  { order: 3, action: 'Show the limitations', actionLocal: { sv: 'Visa begränsningarna' } },
  { order: 4, action: 'Show the Trust Log', actionLocal: { sv: 'Visa Trust Log' } }
];

export const CONFLICT_PRINCIPLE = {
  en: 'The platform does not defend itself. It opens itself.',
  sv: 'Plattformen försvarar sig inte. Den öppnar sig.'
};

// ============================================================================
// 5. PUBLIC ACCOUNTABILITY
// ============================================================================

export const PUBLIC_ACCOUNTABILITY_REQUIREMENTS = {
  allMethodChangesPublic: true,
  allDataSourcesPublic: true,
  allVetoesPublic: true,
  allDisputesPublic: true,
  trustLogMachineReadable: true,
  trustLogEternal: true,
  trustLogVersionLocked: true
};

// ============================================================================
// 6. GOVERNANCE DONE CRITERIA
// ============================================================================

export const GOVERNANCE_MODEL_DONE_CRITERIA = {
  noSingleActorCanChangeTruth: true,
  allPowerIsDivided: true,
  allDecisionsLeaveTraces: true,
  criticismCanBeAnsweredWithoutWords: true
};

// ============================================================================
// 7. SEPARATION RULE (CORE PRINCIPLE)
// ============================================================================

export const SEPARATION_RULE = {
  en: 'No actor may both change the system AND benefit from the change.',
  sv: 'Ingen aktör får både kunna ändra systemet och dra nytta av ändringen.'
};

export const TIER_EXCLUSIVITY_RULE = {
  en: 'No person may serve in more than one tier simultaneously.',
  sv: 'Ingen person får sitta i mer än en nivå samtidigt.'
};
