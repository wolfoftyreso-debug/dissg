/**
 * LAMBDA GOVERNANCE, IMMUNITY & PROTECTION
 * 
 * "No owner of truth. Only custodians of process."
 * 
 * FUNDAMENTAL AXIOM (ABSOLUTE):
 * No one may own the system's conclusions.
 * Only the process may be owned.
 * 
 * All governance originates from this.
 */

// =============================================================================
// RULE 2: THREE-LAYER GOVERNANCE
// =============================================================================

export interface GovernanceLayer {
  id: 'technical' | 'methodological' | 'usage';
  name: { sv: string; en: string };
  icon: string;
  description: { sv: string; en: string };
  controls: string[];
  restrictions: string[];
  mandateType: 'permanent' | 'rotating' | 'open';
  publicProtocols: boolean;
}

export const GOVERNANCE_LAYERS: GovernanceLayer[] = [
  {
    id: 'technical',
    name: { sv: 'Teknisk integritet', en: 'Technical Integrity' },
    icon: '🧱',
    description: {
      sv: 'Orubblig grund – får aldrig styras politiskt eller kommersiellt',
      en: 'Immutable foundation – may never be governed politically or commercially',
    },
    controls: [
      'data_definitions',
      'model_architecture',
      'calibration_rules',
      'version_logic',
    ],
    restrictions: [
      'no_political_control',
      'no_commercial_control',
      'no_manual_overrides',
    ],
    mandateType: 'permanent',
    publicProtocols: true,
  },
  {
    id: 'methodological',
    name: { sv: 'Metodråd', en: 'Method Council' },
    icon: '🧭',
    description: {
      sv: 'Granskande, inte beslutande – tidsbegränsade mandat',
      en: 'Reviewing, not deciding – time-limited mandates',
    },
    controls: [
      'statistics_review',
      'epidemiology_review',
      'economics_review',
      'demography_review',
      'systems_theory_review',
    ],
    restrictions: [
      'review_only_not_decision',
      'time_limited_mandates',
      'public_protocols_required',
    ],
    mandateType: 'rotating',
    publicProtocols: true,
  },
  {
    id: 'usage',
    name: { sv: 'Användning', en: 'Usage' },
    icon: '🌍',
    description: {
      sv: 'Öppen för alla – samma siffror för alla',
      en: 'Open to all – same numbers for everyone',
    },
    controls: [
      'governments',
      'media',
      'researchers',
      'citizens',
      'ai_systems',
    ],
    restrictions: [
      'no_special_versions',
      'equal_access_to_truth',
    ],
    mandateType: 'open',
    publicProtocols: false,
  },
];

// =============================================================================
// RULE 3: POLITICAL IMMUNITY
// =============================================================================

export const POLITICAL_IMMUNITY = {
  builtin_protections: [
    'no_manual_adjustments',
    'no_quick_fixes',
    'no_ad_hoc_exceptions',
    'no_national_adaptations',
  ],
  challenge_response: {
    sv: 'Här är rådata. Här är modellen. Visa exakt var felet är.',
    en: 'Here is the raw data. Here is the model. Show exactly where the error is.',
  },
} as const;

// =============================================================================
// RULE 4: CORPORATE CAPTURE IMMUNITY
// =============================================================================

export const CORPORATE_IMMUNITY = {
  forbidden_in_architecture: [
    'exclusive_api_access',
    'hidden_prioritization',
    'sponsored_indicators',
    'payment_based_weighting',
  ],
  principle: {
    sv: 'Premium = fler verktyg, aldrig annan sanning.',
    en: 'Premium = more tools, never different truth.',
  },
} as const;

// =============================================================================
// RULE 5: LEGAL POSITIONING
// =============================================================================

export const LEGAL_POSITION = {
  system_is_not: [
    'advisory',
    'normative',
    'political',
  ],
  system_is: [
    'descriptive',
    'aggregating',
    'reproducible',
    'source_transparent',
  ],
  doctrine: {
    sv: 'Vi visar. Vi talar inte om.',
    en: 'We show. We do not tell.',
  },
} as const;

// =============================================================================
// RULE 6: KILL SWITCH
// =============================================================================

export interface KillSwitchTrigger {
  code: string;
  name: { sv: string; en: string };
  description: { sv: string; en: string };
  severity: 'critical';
}

export const KILL_SWITCH_TRIGGERS: KillSwitchTrigger[] = [
  {
    code: 'MODEL_MANIPULATION',
    name: { sv: 'Modellmanipulation', en: 'Model Manipulation' },
    description: {
      sv: 'Försök att manipulera modellens beräkningar',
      en: 'Attempt to manipulate model calculations',
    },
    severity: 'critical',
  },
  {
    code: 'HISTORY_DELETION',
    name: { sv: 'Historikradering', en: 'History Deletion' },
    description: {
      sv: 'Försök att ta bort historiska data',
      en: 'Attempt to delete historical data',
    },
    severity: 'critical',
  },
  {
    code: 'SOURCE_HIDING',
    name: { sv: 'Källdöljande', en: 'Source Hiding' },
    description: {
      sv: 'Försök att dölja eller obfuskera källor',
      en: 'Attempt to hide or obfuscate sources',
    },
    severity: 'critical',
  },
  {
    code: 'CENSORSHIP',
    name: { sv: 'Censur', en: 'Censorship' },
    description: {
      sv: 'Försök att införa politisk eller kommersiell censur',
      en: 'Attempt to introduce political or commercial censorship',
    },
    severity: 'critical',
  },
];

export interface KillSwitchResponse {
  action: string;
  description: { sv: string; en: string };
}

export const KILL_SWITCH_RESPONSES: KillSwitchResponse[] = [
  {
    action: 'freeze_updates',
    description: {
      sv: 'Fryser alla uppdateringar',
      en: 'Freezes all updates',
    },
  },
  {
    action: 'lock_readonly',
    description: {
      sv: 'Låser systemet till read-only',
      en: 'Locks system to read-only',
    },
  },
  {
    action: 'publish_log',
    description: {
      sv: 'Publicerar fullständig logg',
      en: 'Publishes complete log',
    },
  },
];

export const KILL_SWITCH_DOCTRINE = {
  sv: 'Hellre stopp än förvanskning.',
  en: 'Better stop than corruption.',
};

// =============================================================================
// RULE 7: RELATIONSHIP TO STATES & UN
// =============================================================================

export const STATE_RELATIONS = {
  lambda_shall: [
    'offer_as_reference',
  ],
  lambda_shall_never: [
    'become_official_truth',
    'be_certified_by_state',
    'be_controlled_by_state',
  ],
  principle: {
    sv: 'De får använda – aldrig styra.',
    en: 'They may use – never govern.',
  },
  warning: {
    sv: 'Certifiering = politisering = död.',
    en: 'Certification = politicization = death.',
  },
} as const;

// =============================================================================
// RULE 8: MEDIA & DEBATE RESILIENCE
// =============================================================================

export const DEBATE_RESPONSE_TEMPLATE = {
  when_challenged: {
    sv: '"Lambda har fel"',
    en: '"Lambda is wrong"',
  },
  response_always: [
    {
      sv: 'Visa vilken datapunkt',
      en: 'Show which data point',
    },
    {
      sv: 'Visa vilken definition',
      en: 'Show which definition',
    },
    {
      sv: 'Visa vilken version',
      en: 'Show which version',
    },
  ],
  forbidden: [
    'press_releases',
    'defense_speeches',
    'emotional_responses',
  ],
  only_allowed: 'reproducibility',
} as const;

// =============================================================================
// RULE 9: PROTECTION AGAINST SOFT NARRATIVES
// =============================================================================

export const NARRATIVE_PROTECTION = {
  system_may_never: [
    'rank_values',
    'suggest_ideology',
    'indicate_right_decision',
  ],
  system_may_only: [
    'show_consequences',
    'show_correlations',
    'show_historical_outcomes',
    'show_uncertainty',
  ],
} as const;

// =============================================================================
// RULE 10: OWNERSHIP MODEL
// =============================================================================

export interface OwnershipEntity {
  type: 'foundation' | 'operating_company' | 'open_council';
  name: { sv: string; en: string };
  responsibility: { sv: string; en: string };
  canBeBought: boolean;
}

export const OWNERSHIP_MODEL: OwnershipEntity[] = [
  {
    type: 'foundation',
    name: { sv: 'Stiftelse', en: 'Foundation' },
    responsibility: {
      sv: 'Process & IP',
      en: 'Process & IP',
    },
    canBeBought: false,
  },
  {
    type: 'operating_company',
    name: { sv: 'Driftbolag', en: 'Operating Company' },
    responsibility: {
      sv: 'API, UX, infrastruktur',
      en: 'API, UX, infrastructure',
    },
    canBeBought: false, // Controlled by foundation
  },
  {
    type: 'open_council',
    name: { sv: 'Öppet råd', en: 'Open Council' },
    responsibility: {
      sv: 'Revision, ej styrning',
      en: 'Audit, not governance',
    },
    canBeBought: false,
  },
];

export const OWNERSHIP_PRINCIPLE = {
  sv: 'Ingen kan köpa hela.',
  en: 'No one can buy the whole.',
};

// =============================================================================
// RULE 11: LONG-TERM PROTECTION
// =============================================================================

export const LONG_TERM_PROTECTION = {
  what_protects_lambda: [
    'more_correct',
    'more_transparent',
    'more_consistent',
  ],
  what_does_not_protect: [
    'PR',
    'power',
    'money',
  ],
  doctrine: {
    sv: 'Det enda som i längden skyddar Lambda är att systemet är mer korrekt, mer transparent och mer konsekvent än alla alternativ.',
    en: 'The only thing that protects Lambda in the long run is that the system is more correct, more transparent, and more consistent than all alternatives.',
  },
} as const;

// =============================================================================
// CORE PRINCIPLES
// =============================================================================

export const GOVERNANCE_AXIOM = {
  sv: 'Ingen får äga systemets slutsatser. Endast processen får ägas.',
  en: 'No one may own the system\'s conclusions. Only the process may be owned.',
};

export const SURVIVAL_DOCTRINE = {
  sv: 'Lambda överlever genom att vara tråkigt korrekt, brutalt öppen och omöjlig att äga.',
  en: 'Lambda survives by being boringly correct, brutally open, and impossible to own.',
};

// =============================================================================
// IMMUNITY STATUS TYPE
// =============================================================================

export interface ImmunityStatus {
  political: 'immune' | 'compromised' | 'unknown';
  corporate: 'immune' | 'compromised' | 'unknown';
  killSwitchArmed: boolean;
  lastIntegrityCheck: string;
  governanceLayers: {
    technical: 'intact' | 'warning' | 'breached';
    methodological: 'intact' | 'warning' | 'breached';
    usage: 'intact' | 'warning' | 'breached';
  };
}
