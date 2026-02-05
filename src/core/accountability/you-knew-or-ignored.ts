/**
 * "YOU KNEW OR YOU IGNORED" MECHANISM
 * 
 * After a decision, only three defenses exist:
 * 1. We didn't know → System shows if data existed
 * 2. It was uncertain → System shows if uncertainty was marked
 * 3. We chose anyway → System shows what was chosen against
 * 
 * System makes self-deception impossible.
 */

import { contextFreeze, type DecisionContextSnapshot } from './decision-context-freeze';

/**
 * DEFENSE TYPE
 */
export type DefenseType =
  | 'did_not_know'
  | 'was_uncertain'
  | 'chose_anyway';

/**
 * DEFENSE ASSESSMENT
 */
export interface DefenseAssessment {
  defense_type: DefenseType;
  claim: string;
  assessment: {
    valid: boolean;
    evidence: string[];
    contradictions: string[];
  };
  data_availability: {
    was_available: boolean;
    where: string | null;
    since_when: string | null;
  };
  uncertainty_marking: {
    was_marked: boolean;
    severity_at_time: 'low' | 'moderate' | 'high' | 'unknown';
  };
  alternatives_shown: {
    were_visible: boolean;
    alternatives: string[];
  };
}

/**
 * ACCOUNTABILITY VERDICT
 */
export interface AccountabilityVerdict {
  decision_id: string;
  assessed_at: string;
  snapshot_id: string | null;
  defenses_claimed: DefenseAssessment[];
  verdict: {
    knowledge_was_available: boolean;
    uncertainty_was_flagged: boolean;
    alternatives_were_visible: boolean;
    overall_defensibility: 'defensible' | 'partially_defensible' | 'indefensible';
  };
  structural_conclusion: string;
  no_moral_judgment: true;
}

/**
 * YOU KNEW OR IGNORED ENGINE
 */
class YouKnewOrIgnoredEngine {
  private verdicts: Map<string, AccountabilityVerdict> = new Map();

  /**
   * ASSESS DEFENSE
   */
  assessDefense(
    decisionId: string,
    defenseType: DefenseType,
    claim: string
  ): DefenseAssessment {
    // Get context snapshot
    const snapshots = contextFreeze.getSnapshotsForDecision(decisionId);
    const snapshot = snapshots.length > 0 ? snapshots[0] : null;
    
    switch (defenseType) {
      case 'did_not_know':
        return this.assessDidNotKnow(claim, snapshot);
      case 'was_uncertain':
        return this.assessWasUncertain(claim, snapshot);
      case 'chose_anyway':
        return this.assessChoseAnyway(claim, snapshot);
    }
  }

  /**
   * ASSESS "DID NOT KNOW"
   */
  private assessDidNotKnow(
    claim: string,
    snapshot: DecisionContextSnapshot | null
  ): DefenseAssessment {
    if (!snapshot) {
      return {
        defense_type: 'did_not_know',
        claim,
        assessment: {
          valid: true,
          evidence: ['No context snapshot exists for this decision'],
          contradictions: [],
        },
        data_availability: {
          was_available: false,
          where: null,
          since_when: null,
        },
        uncertainty_marking: {
          was_marked: false,
          severity_at_time: 'unknown',
        },
        alternatives_shown: {
          were_visible: false,
          alternatives: [],
        },
      };
    }
    
    // Check if relevant data was in context
    const relevantNodes = snapshot.context.relevant_truth_nodes;
    const hasData = relevantNodes.length > 0;
    
    return {
      defense_type: 'did_not_know',
      claim,
      assessment: {
        valid: !hasData,
        evidence: hasData 
          ? [`${relevantNodes.length} truth nodes were available at decision time`]
          : ['No relevant data was available'],
        contradictions: hasData
          ? relevantNodes.map(n => `Node ${n.node_id} was available`)
          : [],
      },
      data_availability: {
        was_available: hasData,
        where: hasData ? 'context_snapshot' : null,
        since_when: hasData ? snapshot.frozen_at : null,
      },
      uncertainty_marking: {
        was_marked: false,
        severity_at_time: 'unknown',
      },
      alternatives_shown: {
        were_visible: false,
        alternatives: [],
      },
    };
  }

  /**
   * ASSESS "WAS UNCERTAIN"
   */
  private assessWasUncertain(
    claim: string,
    snapshot: DecisionContextSnapshot | null
  ): DefenseAssessment {
    if (!snapshot) {
      return {
        defense_type: 'was_uncertain',
        claim,
        assessment: {
          valid: true,
          evidence: ['No context snapshot - uncertainty status unknown'],
          contradictions: [],
        },
        data_availability: {
          was_available: false,
          where: null,
          since_when: null,
        },
        uncertainty_marking: {
          was_marked: false,
          severity_at_time: 'unknown',
        },
        alternatives_shown: {
          were_visible: false,
          alternatives: [],
        },
      };
    }
    
    const uncertainties = snapshot.context.known_uncertainties;
    const wasMarked = uncertainties.length > 0;
    const highUncertainty = uncertainties.some(u => u.severity === 'high');
    
    return {
      defense_type: 'was_uncertain',
      claim,
      assessment: {
        valid: wasMarked,
        evidence: wasMarked
          ? uncertainties.map(u => `${u.area}: ${u.description} [${u.severity}]`)
          : ['No uncertainties were documented at decision time'],
        contradictions: !wasMarked
          ? ['Uncertainty was not flagged in context snapshot']
          : [],
      },
      data_availability: {
        was_available: true,
        where: 'context_snapshot',
        since_when: snapshot.frozen_at,
      },
      uncertainty_marking: {
        was_marked: wasMarked,
        severity_at_time: highUncertainty ? 'high' : wasMarked ? 'moderate' : 'low',
      },
      alternatives_shown: {
        were_visible: false,
        alternatives: [],
      },
    };
  }

  /**
   * ASSESS "CHOSE ANYWAY"
   */
  private assessChoseAnyway(
    claim: string,
    snapshot: DecisionContextSnapshot | null
  ): DefenseAssessment {
    if (!snapshot) {
      return {
        defense_type: 'chose_anyway',
        claim,
        assessment: {
          valid: false,
          evidence: ['No context snapshot - alternatives not documented'],
          contradictions: [],
        },
        data_availability: {
          was_available: false,
          where: null,
          since_when: null,
        },
        uncertainty_marking: {
          was_marked: false,
          severity_at_time: 'unknown',
        },
        alternatives_shown: {
          were_visible: false,
          alternatives: [],
        },
      };
    }
    
    const tradeoffs = snapshot.context.known_tradeoffs;
    const alternativesVisible = tradeoffs.length > 0;
    
    return {
      defense_type: 'chose_anyway',
      claim,
      assessment: {
        valid: alternativesVisible,
        evidence: alternativesVisible
          ? tradeoffs.map(t => `Tradeoff: ${t.option_a} vs ${t.option_b}`)
          : [],
        contradictions: !alternativesVisible
          ? ['No alternatives were documented']
          : [],
      },
      data_availability: {
        was_available: true,
        where: 'context_snapshot',
        since_when: snapshot.frozen_at,
      },
      uncertainty_marking: {
        was_marked: snapshot.context.known_uncertainties.length > 0,
        severity_at_time: 'moderate',
      },
      alternatives_shown: {
        were_visible: alternativesVisible,
        alternatives: tradeoffs.map(t => t.tradeoff),
      },
    };
  }

  /**
   * GENERATE VERDICT
   */
  generateVerdict(
    decisionId: string,
    claimedDefenses: Array<{ type: DefenseType; claim: string }>
  ): AccountabilityVerdict {
    const assessments = claimedDefenses.map(d => 
      this.assessDefense(decisionId, d.type, d.claim)
    );
    
    const snapshots = contextFreeze.getSnapshotsForDecision(decisionId);
    
    // Determine overall verdict
    const knowledgeWasAvailable = assessments.some(a => 
      a.data_availability.was_available
    );
    const uncertaintyWasFlagged = assessments.some(a => 
      a.uncertainty_marking.was_marked
    );
    const alternativesWereVisible = assessments.some(a => 
      a.alternatives_shown.were_visible
    );
    
    // Calculate defensibility
    let defensibility: 'defensible' | 'partially_defensible' | 'indefensible';
    const invalidDefenses = assessments.filter(a => !a.assessment.valid).length;
    
    if (invalidDefenses === 0) {
      defensibility = 'defensible';
    } else if (invalidDefenses < assessments.length) {
      defensibility = 'partially_defensible';
    } else {
      defensibility = 'indefensible';
    }
    
    const verdict: AccountabilityVerdict = {
      decision_id: decisionId,
      assessed_at: new Date().toISOString(),
      snapshot_id: snapshots.length > 0 ? snapshots[0].snapshot_id : null,
      defenses_claimed: assessments,
      verdict: {
        knowledge_was_available: knowledgeWasAvailable,
        uncertainty_was_flagged: uncertaintyWasFlagged,
        alternatives_were_visible: alternativesWereVisible,
        overall_defensibility: defensibility,
      },
      structural_conclusion: this.generateConclusion(assessments, defensibility),
      no_moral_judgment: true,
    };
    
    this.verdicts.set(decisionId, verdict);
    return verdict;
  }

  /**
   * GENERATE CONCLUSION
   */
  private generateConclusion(
    assessments: DefenseAssessment[],
    defensibility: 'defensible' | 'partially_defensible' | 'indefensible'
  ): string {
    if (defensibility === 'defensible') {
      return 'All claimed defenses are structurally supported by available evidence.';
    }
    
    const invalidCount = assessments.filter(a => !a.assessment.valid).length;
    
    if (defensibility === 'indefensible') {
      return `None of the ${invalidCount} claimed defenses are supported by the available context.`;
    }
    
    return `${invalidCount} of ${assessments.length} claimed defenses are contradicted by available evidence.`;
  }

  /**
   * GET VERDICT
   */
  getVerdict(decisionId: string): AccountabilityVerdict | null {
    return this.verdicts.get(decisionId) || null;
  }

  /**
   * EXPORT STATE
   */
  exportState(): {
    total_verdicts: number;
    by_defensibility: Record<string, number>;
  } {
    const byDefensibility: Record<string, number> = {
      defensible: 0,
      partially_defensible: 0,
      indefensible: 0,
    };
    
    this.verdicts.forEach(v => {
      byDefensibility[v.verdict.overall_defensibility]++;
    });
    
    return {
      total_verdicts: this.verdicts.size,
      by_defensibility: byDefensibility,
    };
  }
}

/**
 * SINGLETON
 */
export const youKnewOrIgnored = new YouKnewOrIgnoredEngine();

/**
 * PRINCIPLES
 */
export const ACCOUNTABILITY_PRINCIPLES = {
  only_three_defenses: true,
  system_shows_evidence: true,
  self_deception_impossible: true,
  no_moral_judgment: true,
} as const;
