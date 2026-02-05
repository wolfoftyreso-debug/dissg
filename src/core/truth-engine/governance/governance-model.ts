/**
 * NEUTRAL GOVERNANCE MODEL
 * 
 * Two-layer governance: Core Owners + Independent Standards Council
 * External legitimacy, internal control.
 */

/**
 * GOVERNANCE LAYERS
 */
export const GOVERNANCE_LAYERS = {
  layer_a: {
    name: 'Core Owners',
    role: 'Operational control and final authority',
    owns: [
      'Truth Engine',
      'Answer Packets',
      'Index definitions',
      'Operations & SLA',
      'Roadmap',
    ],
    can: [
      'Say no to any change',
      'Stop modifications',
      'Version-lock components',
      'Set operational priorities',
      'Define expansion scope',
    ],
    cannot: [
      'Change data retroactively',
      'Override locked specifications',
      'Ignore published limitations',
    ],
  },
  
  layer_b: {
    name: 'Standards Council',
    role: 'Independent review and legitimacy',
    composition: [
      'Statistics experts (2-3)',
      'Methodologists (2-3)',
      'Ethics/Legal advisors (1-2)',
      'Domain experts (rotating)',
    ],
    can: [
      'Review all methodologies',
      'Recommend changes',
      'Publish dissenting opinions',
      'Audit compliance',
      'Request clarifications',
    ],
    cannot: [
      'Change data',
      'Control roadmap',
      'Influence operations',
      'Override Core Owners',
      'Access raw systems',
    ],
  },
} as const;

/**
 * GOVERNANCE PRINCIPLES
 */
export const GOVERNANCE_PRINCIPLES = [
  {
    id: 'separation_of_powers',
    principle: 'No single entity controls both truth and interpretation',
    enforcement: 'Structural separation between layers',
  },
  {
    id: 'transparency_by_default',
    principle: 'All governance decisions are logged and public',
    enforcement: 'Immutable governance log',
  },
  {
    id: 'veto_without_alternatives',
    principle: 'Core Owners can say no without providing alternatives',
    enforcement: 'Built into decision protocol',
  },
  {
    id: 'dissent_is_published',
    principle: 'Standards Council dissent is always made public',
    enforcement: 'Automatic publication requirement',
  },
  {
    id: 'no_hidden_influence',
    principle: 'All external input is logged with source',
    enforcement: 'Anti-influence log',
  },
] as const;

/**
 * DECISION TYPES AND AUTHORITY
 */
export const DECISION_AUTHORITY = {
  // Core Owners only
  core_owner_exclusive: [
    'Index definition changes',
    'Answer Packet structure',
    'GDG spec modifications',
    'Operational decisions',
    'Partnership approvals',
    'Pricing changes',
  ],
  
  // Requires Standards Council review
  requires_council_review: [
    'Methodology changes',
    'New domain additions',
    'Comparability rule changes',
    'Confidence calculation updates',
    'Cross-domain correlation rules',
  ],
  
  // Joint decision required
  joint_decision: [
    'Breaking changes to GDG',
    'Removal of existing features',
    'Changes to constitutional principles',
    'Succession protocol updates',
  ],
} as const;

/**
 * GOVERNANCE LOG ENTRY
 */
export interface GovernanceLogEntry {
  id: string;
  timestamp: string;
  decision_type: string;
  authority: 'core_owner' | 'council' | 'joint';
  summary: string;
  rationale: string;
  dissent?: string;
  affected_components: string[];
  reversible: boolean;
}

/**
 * GOVERNANCE LOG (in-memory for demo)
 */
export class GovernanceLog {
  private entries: GovernanceLogEntry[] = [];

  log(entry: Omit<GovernanceLogEntry, 'id' | 'timestamp'>): GovernanceLogEntry {
    const fullEntry: GovernanceLogEntry = {
      id: `gov_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      ...entry,
    };
    this.entries.push(fullEntry);
    return fullEntry;
  }

  getAll(): GovernanceLogEntry[] {
    return [...this.entries];
  }

  getByAuthority(authority: GovernanceLogEntry['authority']): GovernanceLogEntry[] {
    return this.entries.filter(e => e.authority === authority);
  }

  getDissent(): GovernanceLogEntry[] {
    return this.entries.filter(e => e.dissent);
  }
}

export const governanceLog = new GovernanceLog();
