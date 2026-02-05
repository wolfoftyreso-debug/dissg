/**
 * COUNTERFACTUAL SAFETY (ANTI-RETROACTIVE LOGIC)
 * 
 * The system must NEVER:
 * - Interpret old data with new definitions
 * - Apply current morality backwards
 * - Silently recalculate history
 * 
 * Instead:
 * - Parallel versions
 * - Explicit breakpoints
 * - Visible incompatibility
 * 
 * History gets to be itself.
 */

/**
 * RETROACTIVE VIOLATION TYPE
 */
export type RetroactiveViolationType =
  | 'definition_reapplied'
  | 'moral_reinterpretation'
  | 'silent_recalculation'
  | 'context_stripping'
  | 'baseline_shift';

/**
 * VIOLATION ATTEMPT
 */
export interface ViolationAttempt {
  id: string;
  type: RetroactiveViolationType;
  attempted_at: string;
  source: string;
  target_node: string;
  target_period: string;
  blocked: boolean;
  reason: string;
}

/**
 * PARALLEL VERSION
 */
export interface ParallelVersion {
  node_id: string;
  original_version: string;
  parallel_version: string;
  purpose: string;
  created_at: string;
  comparability_note: string;
  do_not_merge: boolean;
}

/**
 * BREAKPOINT
 */
export interface ExplicitBreakpoint {
  id: string;
  node_id: string;
  break_date: string;
  break_type: 'methodological' | 'definitional' | 'contextual' | 'political';
  description: string;
  before_context: string;
  after_context: string;
  comparison_guidance: string;
}

/**
 * COUNTERFACTUAL SAFETY ENGINE
 */
class CounterfactualSafetyEngine {
  private violations: ViolationAttempt[] = [];
  private parallelVersions: ParallelVersion[] = [];
  private breakpoints: ExplicitBreakpoint[] = [];

  /**
   * CHECK RETROACTIVE OPERATION
   */
  checkOperation(operation: {
    type: 'query' | 'calculation' | 'comparison';
    source_period: string;
    target_period: string;
    definition_version: string;
    applies_current_definition: boolean;
  }): { allowed: boolean; warnings: string[] } {
    const warnings: string[] = [];
    
    // Block applying current definitions to historical data
    if (operation.applies_current_definition && 
        this.isPeriodHistorical(operation.target_period)) {
      this.recordViolation({
        type: 'definition_reapplied',
        source: 'operation_check',
        target_node: 'unknown',
        target_period: operation.target_period,
        reason: 'Cannot apply current definition to historical period',
      });
      
      return {
        allowed: false,
        warnings: ['Current definition cannot be applied retroactively'],
      };
    }
    
    // Check for breakpoints in range
    const relevantBreakpoints = this.getBreakpointsInRange(
      operation.source_period,
      operation.target_period
    );
    
    if (relevantBreakpoints.length > 0) {
      for (const bp of relevantBreakpoints) {
        warnings.push(`Breakpoint crossed: ${bp.description}`);
      }
    }
    
    return {
      allowed: true,
      warnings,
    };
  }

  /**
   * RECORD VIOLATION
   */
  private recordViolation(violation: Omit<ViolationAttempt, 'id' | 'attempted_at' | 'blocked'>): void {
    this.violations.push({
      ...violation,
      id: `VIOL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      attempted_at: new Date().toISOString(),
      blocked: true,
    });
  }

  /**
   * IS PERIOD HISTORICAL
   */
  private isPeriodHistorical(period: string): boolean {
    // Consider anything more than 5 years ago as historical
    const periodYear = parseInt(period.split('-')[0]);
    const currentYear = new Date().getFullYear();
    return (currentYear - periodYear) > 5;
  }

  /**
   * CREATE PARALLEL VERSION
   */
  createParallelVersion(config: Omit<ParallelVersion, 'created_at'>): ParallelVersion {
    const parallel: ParallelVersion = {
      ...config,
      created_at: new Date().toISOString(),
    };
    
    this.parallelVersions.push(parallel);
    return parallel;
  }

  /**
   * REGISTER BREAKPOINT
   */
  registerBreakpoint(breakpoint: Omit<ExplicitBreakpoint, 'id'>): ExplicitBreakpoint {
    const bp: ExplicitBreakpoint = {
      ...breakpoint,
      id: `BP-${breakpoint.node_id}-${breakpoint.break_date}`,
    };
    
    this.breakpoints.push(bp);
    return bp;
  }

  /**
   * GET BREAKPOINTS IN RANGE
   */
  getBreakpointsInRange(startPeriod: string, endPeriod: string): ExplicitBreakpoint[] {
    return this.breakpoints.filter(bp => {
      return bp.break_date >= startPeriod && bp.break_date <= endPeriod;
    });
  }

  /**
   * GET BREAKPOINTS FOR NODE
   */
  getBreakpointsForNode(nodeId: string): ExplicitBreakpoint[] {
    return this.breakpoints.filter(bp => bp.node_id === nodeId);
  }

  /**
   * GET PARALLEL VERSIONS
   */
  getParallelVersions(nodeId: string): ParallelVersion[] {
    return this.parallelVersions.filter(pv => pv.node_id === nodeId);
  }

  /**
   * GET VIOLATION LOG
   */
  getViolationLog(): ViolationAttempt[] {
    return [...this.violations];
  }

  /**
   * GENERATE COMPARISON GUIDANCE
   */
  generateComparisonGuidance(nodeId: string, periodA: string, periodB: string): string {
    const breakpoints = this.getBreakpointsInRange(periodA, periodB);
    const parallels = this.getParallelVersions(nodeId);
    
    const lines = [
      `COMPARISON GUIDANCE: ${nodeId}`,
      `Period: ${periodA} → ${periodB}`,
      '═'.repeat(50),
    ];
    
    if (breakpoints.length === 0 && parallels.length === 0) {
      lines.push('');
      lines.push('✓ Direct comparison is valid');
      lines.push('  No breakpoints or methodology changes detected');
      return lines.join('\n');
    }
    
    if (breakpoints.length > 0) {
      lines.push('');
      lines.push('⚠ BREAKPOINTS DETECTED:');
      for (const bp of breakpoints) {
        lines.push(`  • ${bp.break_date}: ${bp.description}`);
        lines.push(`    Guidance: ${bp.comparison_guidance}`);
      }
    }
    
    if (parallels.length > 0) {
      lines.push('');
      lines.push('⚠ PARALLEL VERSIONS EXIST:');
      for (const pv of parallels) {
        lines.push(`  • ${pv.parallel_version}: ${pv.purpose}`);
        lines.push(`    Note: ${pv.comparability_note}`);
      }
    }
    
    return lines.join('\n');
  }

  /**
   * EXPORT STATE
   */
  exportState(): {
    violations_blocked: number;
    parallel_versions: number;
    breakpoints: number;
  } {
    return {
      violations_blocked: this.violations.length,
      parallel_versions: this.parallelVersions.length,
      breakpoints: this.breakpoints.length,
    };
  }
}

/**
 * SINGLETON
 */
export const counterfactualSafety = new CounterfactualSafetyEngine();

/**
 * PRINCIPLES
 */
export const COUNTERFACTUAL_PRINCIPLES = {
  never_reinterpret_history: true,
  parallel_versions_only: true,
  explicit_breakpoints: true,
  visible_incompatibility: true,
  history_is_itself: true,
} as const;
