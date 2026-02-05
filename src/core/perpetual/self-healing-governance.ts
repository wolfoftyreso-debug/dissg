/**
 * SELF-HEALING GOVERNANCE
 * 
 * Autonomous protection against corruption.
 * Block, log, flag publicly.
 */

/**
 * VIOLATION TYPE
 */
export type ViolationType = 
  | 'simplification_attempt'
  | 'truth_commercialization'
  | 'advice_injection'
  | 'core_modification'
  | 'history_alteration'
  | 'guardrail_bypass'
  | 'unauthorized_access'
  | 'narrative_insertion';

/**
 * VIOLATION SEVERITY
 */
export type ViolationSeverity = 'warning' | 'block' | 'critical' | 'emergency';

/**
 * GOVERNANCE VIOLATION
 */
export interface GovernanceViolation {
  violation_id: string;
  type: ViolationType;
  severity: ViolationSeverity;
  detected_at: string;
  source: string;
  description: string;
  action_taken: 'blocked' | 'logged' | 'flagged' | 'escalated';
  public_flag: boolean;
  resolved: boolean;
  resolution_note: string | null;
}

/**
 * GOVERNANCE RULE
 */
export interface GovernanceRule {
  rule_id: string;
  protects_against: ViolationType;
  detection_method: 'automated' | 'manual' | 'hybrid';
  response: 'block' | 'log' | 'flag' | 'escalate';
  public_notification: boolean;
  active: true;
}

/**
 * GOVERNANCE RULES
 */
export const GOVERNANCE_RULES: GovernanceRule[] = [
  {
    rule_id: 'GOV:001',
    protects_against: 'simplification_attempt',
    detection_method: 'automated',
    response: 'block',
    public_notification: true,
    active: true,
  },
  {
    rule_id: 'GOV:002',
    protects_against: 'truth_commercialization',
    detection_method: 'automated',
    response: 'block',
    public_notification: true,
    active: true,
  },
  {
    rule_id: 'GOV:003',
    protects_against: 'advice_injection',
    detection_method: 'automated',
    response: 'block',
    public_notification: false,
    active: true,
  },
  {
    rule_id: 'GOV:004',
    protects_against: 'core_modification',
    detection_method: 'automated',
    response: 'escalate',
    public_notification: true,
    active: true,
  },
  {
    rule_id: 'GOV:005',
    protects_against: 'history_alteration',
    detection_method: 'automated',
    response: 'block',
    public_notification: true,
    active: true,
  },
  {
    rule_id: 'GOV:006',
    protects_against: 'guardrail_bypass',
    detection_method: 'automated',
    response: 'block',
    public_notification: true,
    active: true,
  },
  {
    rule_id: 'GOV:007',
    protects_against: 'narrative_insertion',
    detection_method: 'hybrid',
    response: 'flag',
    public_notification: true,
    active: true,
  },
];

/**
 * SELF-HEALING GOVERNANCE ENGINE
 */
class SelfHealingGovernance {
  private violations: GovernanceViolation[] = [];
  private rules: GovernanceRule[] = GOVERNANCE_RULES;

  /**
   * CHECK FOR VIOLATION
   */
  checkViolation(context: {
    action: string;
    source: string;
    target: string;
    content?: string;
  }): GovernanceViolation | null {
    // Check for simplification
    if (this.detectSimplification(context)) {
      return this.recordViolation('simplification_attempt', 'warning', context.source,
        `Attempted to simplify ${context.target}`);
    }

    // Check for advice injection
    if (context.content && this.detectAdvice(context.content)) {
      return this.recordViolation('advice_injection', 'block', context.source,
        'Advice or recommendation detected in content');
    }

    // Check for core modification
    if (this.detectCoreModification(context)) {
      return this.recordViolation('core_modification', 'critical', context.source,
        `Attempted to modify core artifact: ${context.target}`);
    }

    // Check for history alteration
    if (this.detectHistoryAlteration(context)) {
      return this.recordViolation('history_alteration', 'critical', context.source,
        'Attempted to alter historical record');
    }

    return null;
  }

  /**
   * DETECT SIMPLIFICATION
   */
  private detectSimplification(context: { action: string; target: string }): boolean {
    const simplificationActions = ['remove_uncertainty', 'hide_gaps', 'flatten_hierarchy'];
    return simplificationActions.includes(context.action);
  }

  /**
   * DETECT ADVICE
   */
  private detectAdvice(content: string): boolean {
    const advicePatterns = [
      /\bshould\b/i,
      /\bmust\b/i,
      /\brecommend/i,
      /\badvise/i,
      /\bsuggested action/i,
      /\bwe believe/i,
      /\byou need to/i,
    ];
    return advicePatterns.some(pattern => pattern.test(content));
  }

  /**
   * DETECT CORE MODIFICATION
   */
  private detectCoreModification(context: { target: string }): boolean {
    const coreArtifacts = ['charter', 'guardrails', 'governance_kernel', 'semantic_contract'];
    return coreArtifacts.some(a => context.target.toLowerCase().includes(a));
  }

  /**
   * DETECT HISTORY ALTERATION
   */
  private detectHistoryAlteration(context: { action: string }): boolean {
    const alterationActions = ['update_historical', 'delete_record', 'modify_past'];
    return alterationActions.includes(context.action);
  }

  /**
   * RECORD VIOLATION
   */
  private recordViolation(
    type: ViolationType,
    severity: ViolationSeverity,
    source: string,
    description: string
  ): GovernanceViolation {
    const rule = this.rules.find(r => r.protects_against === type);
    
    const actionMap: Record<string, 'blocked' | 'logged' | 'flagged' | 'escalated'> = {
      block: 'blocked',
      log: 'logged',
      flag: 'flagged',
      escalate: 'escalated',
    };
    
    const violation: GovernanceViolation = {
      violation_id: `VIOL:${Date.now().toString(36)}`,
      type,
      severity,
      detected_at: new Date().toISOString(),
      source,
      description,
      action_taken: actionMap[rule?.response || 'log'] || 'logged',
      public_flag: rule?.public_notification || false,
      resolved: false,
      resolution_note: null,
    };

    this.violations.push(violation);
    return violation;
  }

  /**
   * GET PUBLIC VIOLATIONS
   */
  getPublicViolations(): GovernanceViolation[] {
    return this.violations.filter(v => v.public_flag);
  }

  /**
   * GET CRITICAL VIOLATIONS
   */
  getCriticalViolations(): GovernanceViolation[] {
    return this.violations.filter(v => 
      v.severity === 'critical' || v.severity === 'emergency'
    );
  }

  /**
   * RESOLVE VIOLATION
   */
  resolveViolation(violationId: string, note: string): boolean {
    const violation = this.violations.find(v => v.violation_id === violationId);
    if (!violation) return false;
    
    violation.resolved = true;
    violation.resolution_note = note;
    return true;
  }

  /**
   * GET HEALTH STATUS
   */
  getHealthStatus(): {
    healthy: boolean;
    total_violations: number;
    unresolved_critical: number;
    rules_active: number;
  } {
    const unresolved = this.violations.filter(v => 
      !v.resolved && (v.severity === 'critical' || v.severity === 'emergency')
    );
    
    return {
      healthy: unresolved.length === 0,
      total_violations: this.violations.length,
      unresolved_critical: unresolved.length,
      rules_active: this.rules.filter(r => r.active).length,
    };
  }
}

/**
 * SINGLETON INSTANCE
 */
export const selfHealingGovernance = new SelfHealingGovernance();

/**
 * GOVERNANCE PRINCIPLES
 */
export const SELF_HEALING_PRINCIPLES = {
  autonomous: true,
  blocks_simplification: true,
  blocks_commercialization: true,
  blocks_advice_injection: true,
  blocks_core_modification: true,
  logs_everything: true,
  flags_publicly: true,
  governance_is_autonomous: true,
} as const;
