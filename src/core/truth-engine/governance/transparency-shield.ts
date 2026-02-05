/**
 * TRANSPARENCY AS PROTECTION
 * 
 * We publish continuously:
 * - Rejected proposals
 * - Blocked Decision Graphs
 * - Methodology changes
 * - Confidence drift
 * 
 * This does two things:
 * - Builds trust
 * - Deters manipulation
 * 
 * Systems that show their limits are harder to attack.
 */

/**
 * TRANSPARENCY ARTIFACTS
 */
export const TRANSPARENCY_ARTIFACTS = {
  rejected_proposals: {
    id: 'rejected_proposals',
    description: 'Proposals that were rejected and why',
    update_frequency: 'On occurrence',
    public: true,
    purpose: 'Show what we refuse to do',
  },
  
  blocked_decisions: {
    id: 'blocked_decisions',
    description: 'Decision Graphs that failed validation',
    update_frequency: 'Daily aggregate',
    public: true, // Anonymized
    purpose: 'Show the standard has teeth',
  },
  
  methodology_changes: {
    id: 'methodology_changes',
    description: 'All changes to calculation methods',
    update_frequency: 'On occurrence',
    public: true,
    purpose: 'Full auditability',
  },
  
  confidence_drift: {
    id: 'confidence_drift',
    description: 'How confidence levels change over time',
    update_frequency: 'Weekly',
    public: true,
    purpose: 'Show data quality trends',
  },
  
  dissenting_opinions: {
    id: 'dissenting_opinions',
    description: 'Standards Council disagreements',
    update_frequency: 'On occurrence',
    public: true,
    purpose: 'Show healthy governance tension',
  },
  
  influence_attempts: {
    id: 'influence_attempts',
    description: 'Logged attempts to influence outputs',
    update_frequency: 'On occurrence',
    public: true, // Anonymized where appropriate
    purpose: 'Deter manipulation',
  },
} as const;

/**
 * REJECTED PROPOSAL LOG
 */
export interface RejectedProposal {
  id: string;
  submitted_at: string;
  rejected_at: string;
  proposal_type: string;
  summary: string;
  rejection_reason: string;
  rejection_authority: 'core_owner' | 'council' | 'automated';
  violates_principles: string[];
}

/**
 * BLOCKED DECISION LOG
 */
export interface BlockedDecision {
  id: string;
  blocked_at: string;
  reason_codes: string[];
  forbidden_patterns_found: string[];
  missing_requirements: string[];
  external: boolean;
}

/**
 * METHODOLOGY CHANGE LOG
 */
export interface MethodologyChange {
  id: string;
  changed_at: string;
  component: string;
  previous_version: string;
  new_version: string;
  change_description: string;
  impact_assessment: string;
  approved_by: 'core_owner' | 'joint';
  council_review: boolean;
  dissent?: string;
}

/**
 * TRANSPARENCY LOG (in-memory for demo)
 */
export class TransparencyLog {
  private rejectedProposals: RejectedProposal[] = [];
  private blockedDecisions: BlockedDecision[] = [];
  private methodologyChanges: MethodologyChange[] = [];

  logRejectedProposal(proposal: Omit<RejectedProposal, 'id'>): void {
    this.rejectedProposals.push({
      id: `rej_${Date.now()}`,
      ...proposal,
    });
  }

  logBlockedDecision(decision: Omit<BlockedDecision, 'id'>): void {
    this.blockedDecisions.push({
      id: `blk_${Date.now()}`,
      ...decision,
    });
  }

  logMethodologyChange(change: Omit<MethodologyChange, 'id'>): void {
    this.methodologyChanges.push({
      id: `mth_${Date.now()}`,
      ...change,
    });
  }

  getRejectedProposals(): RejectedProposal[] {
    return [...this.rejectedProposals];
  }

  getBlockedDecisions(): BlockedDecision[] {
    return [...this.blockedDecisions];
  }

  getMethodologyChanges(): MethodologyChange[] {
    return [...this.methodologyChanges];
  }

  getStats() {
    return {
      total_rejected: this.rejectedProposals.length,
      total_blocked: this.blockedDecisions.length,
      total_methodology_changes: this.methodologyChanges.length,
      external_blocks: this.blockedDecisions.filter(d => d.external).length,
    };
  }
}

export const transparencyLog = new TransparencyLog();

/**
 * WHY TRANSPARENCY PROTECTS
 */
export const TRANSPARENCY_PROTECTION = {
  builds_trust: [
    'Users see what we refuse to do',
    'Changes are never hidden',
    'Disagreements are visible',
    'Mistakes are acknowledged',
  ],
  deters_manipulation: [
    'Influence attempts are logged',
    'Patterns of pressure become visible',
    'Public scrutiny is permanent',
    'Bad actors know they will be exposed',
  ],
  reduces_attack_surface: [
    'Hard to claim hidden agenda when everything is public',
    'Hard to accuse of bias when methodology is open',
    'Hard to claim incompetence when limitations are stated',
    'Hard to capture what refuses to be captured',
  ],
} as const;
