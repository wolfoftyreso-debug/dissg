/**
 * TRUST STRUCTURE
 * 
 * Anti-capture ownership model.
 * No single party can change the truth.
 */

/**
 * TRUST ENTITIES
 */
export const TRUST_ENTITIES = {
  /**
   * TRUTH CORE TRUST
   * Owns: contracts, governance, artifacts
   * Cannot: operate infrastructure
   */
  TRUTH_CORE_TRUST: {
    id: 'TRUST:core',
    name: 'Truth Core Trust',
    type: 'foundation' as const,
    jurisdiction: 'CH', // Switzerland
    
    owns: [
      'Semantic Output Contract',
      'Guardrails',
      'Governance Kernel',
      'Charter',
      'Core Ontology',
    ],
    
    cannot: [
      'Operate infrastructure',
      'Modify historical data',
      'Grant commercial licenses',
      'Unilaterally change governance',
    ],
    
    governance: {
      board_size: 5,
      quorum: 4,
      charter_change_requires: 'unanimous',
    },
  },

  /**
   * OPERATING ENTITY
   * Runs: infrastructure, UI, SDK
   * Cannot: change core contracts
   */
  OPERATING_ENTITY: {
    id: 'ENTITY:ops',
    name: 'Truth Engine Operations',
    type: 'company' as const,
    jurisdiction: 'SE', // Sweden
    
    operates: [
      'Infrastructure',
      'API endpoints',
      'User interface',
      'SDK distribution',
      'Customer support',
    ],
    
    cannot: [
      'Modify core contracts',
      'Change Charter',
      'Access raw governance',
      'Override Trust decisions',
    ],
    
    licensed_by: 'TRUST:core',
    license_revocable: true,
  },

  /**
   * PUBLIC VERIFIER
   * Validates: outputs independently
   * Cannot: modify anything
   */
  PUBLIC_VERIFIER: {
    id: 'VERIFIER:public',
    name: 'Independent Verification Council',
    type: 'council' as const,
    jurisdiction: 'international',
    
    responsibilities: [
      'Validate output correctness',
      'Audit methodology',
      'Publish verification reports',
      'Flag discrepancies',
    ],
    
    cannot: [
      'Modify any data',
      'Override governance',
      'Access private infrastructure',
    ],
    
    independence: {
      no_funding_from_operating_entity: true,
      public_membership: true,
      rotating_members: true,
    },
  },
} as const;

/**
 * SEPARATION OF POWERS
 */
export const SEPARATION_OF_POWERS = {
  rule: 'No single entity can unilaterally change truth',
  
  checks: {
    contract_change: {
      requires: ['TRUST:core unanimous vote', 'VERIFIER:public audit'],
      operating_entity_role: 'none',
    },
    
    infrastructure_change: {
      requires: ['ENTITY:ops decision'],
      trust_role: 'oversight',
      verifier_role: 'audit',
    },
    
    methodology_change: {
      requires: ['TRUST:core approval', 'VERIFIER:public review'],
      operating_entity_role: 'implementation',
    },
  },
  
  veto_powers: {
    trust_can_veto: ['contract_change', 'methodology_change'],
    verifier_can_flag: ['all_outputs'],
    operating_entity_can_veto: ['none'],
  },
} as const;

/**
 * ANTI-CAPTURE MECHANISMS
 */
export const ANTI_CAPTURE = {
  /**
   * OWNERSHIP DILUTION PREVENTION
   */
  ownership: {
    trust_cannot_be_sold: true,
    trust_cannot_be_merged: true,
    board_cannot_be_replaced_at_once: true,
    max_board_turnover_per_year: 1,
  },

  /**
   * FUNDING INDEPENDENCE
   */
  funding: {
    endowment_required: true,
    no_single_donor_above_10_percent: true,
    public_funding_reports: true,
    operating_revenue_separate: true,
  },

  /**
   * DECISION TRANSPARENCY
   */
  transparency: {
    all_governance_decisions_public: true,
    meeting_minutes_published: true,
    vote_records_immutable: true,
    dissent_recorded: true,
  },

  /**
   * NUCLEAR OPTION
   */
  nuclear_option: {
    description: 'If capture is imminent, all code and data are released to public domain',
    trigger: 'Trust board 4/5 vote OR external verification of capture',
    effect: 'IPFS publication of complete system',
    irreversible: true,
  },
} as const;

/**
 * TRUST DIAGRAM (ASCII)
 */
export const TRUST_DIAGRAM = `
┌─────────────────────────────────────────────────────────────┐
│                    TRUST STRUCTURE                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌───────────────────┐                                      │
│  │  TRUTH CORE TRUST │ ◄── Owns contracts, cannot operate  │
│  │  (Switzerland)    │                                      │
│  └─────────┬─────────┘                                      │
│            │ licenses                                       │
│            ▼                                                │
│  ┌───────────────────┐     ┌───────────────────────┐       │
│  │ OPERATING ENTITY  │ ◄───│  PUBLIC VERIFIER      │       │
│  │ (Sweden)          │     │  (International)      │       │
│  │                   │     │                       │       │
│  │ • Infrastructure  │     │ • Audits outputs      │       │
│  │ • API / SDK       │     │ • Validates methods   │       │
│  │ • Customer ops    │     │ • Publishes reports   │       │
│  └───────────────────┘     └───────────────────────┘       │
│                                                             │
│  NO SINGLE ENTITY CAN CHANGE TRUTH UNILATERALLY            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
`.trim();

/**
 * VALIDATE TRUST STRUCTURE INTEGRITY
 */
export function validateTrustIntegrity(): {
  valid: boolean;
  entities: number;
  separation_complete: boolean;
} {
  const entities = Object.keys(TRUST_ENTITIES).length;
  
  return {
    valid: entities >= 3,
    entities,
    separation_complete: 
      TRUST_ENTITIES.TRUTH_CORE_TRUST.cannot.includes('Operate infrastructure') &&
      TRUST_ENTITIES.OPERATING_ENTITY.cannot.includes('Modify core contracts') &&
      TRUST_ENTITIES.PUBLIC_VERIFIER.cannot.includes('Modify any data'),
  };
}
