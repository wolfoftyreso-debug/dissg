/**
 * AGGREGATION SANDBOX – PROMOTION FLOW
 * 
 * Promotes validated aggregations from sandbox to registry.
 * No overwrite. Always history.
 */

import type { 
  PromotionRecord, 
  ValidationPipelineResult,
  AggregationResultRaw,
  SandboxAuditEntry,
} from './types';
import type { Aggregation, AggregationStatus } from '../registry/types';

// ============================================================================
// PROMOTION ELIGIBILITY
// ============================================================================

export interface PromotionEligibility {
  eligible: boolean;
  blockers: readonly string[];
  warnings: readonly string[];
}

export function checkPromotionEligibility(
  validationResult: ValidationPipelineResult
): PromotionEligibility {
  const blockers: string[] = [];
  const warnings: string[] = [];
  
  // Must pass all gates
  if (!validationResult.passed) {
    blockers.push('Not all validation gates passed');
  }
  
  // Must not require steward review (unless already reviewed)
  if (validationResult.requires_steward_review) {
    blockers.push('Requires steward review before promotion');
  }
  
  // Disposition must be 'promote'
  if (validationResult.disposition !== 'promote') {
    blockers.push(`Disposition is '${validationResult.disposition}', not 'promote'`);
  }
  
  // Check for any warnings in gates
  for (const gate of validationResult.gates) {
    if (gate.result === 'warn') {
      warnings.push(`Gate '${gate.gate}' has warnings: ${gate.details}`);
    }
  }
  
  return {
    eligible: blockers.length === 0,
    blockers,
    warnings,
  };
}

// ============================================================================
// VERSION MANAGEMENT
// ============================================================================

export function incrementVersion(currentVersion: string): string {
  const parts = currentVersion.split('.').map(Number);
  
  if (parts.length !== 3) {
    return '1.0.0';
  }
  
  // Increment patch version
  parts[2]++;
  
  return parts.join('.');
}

export function incrementMinorVersion(currentVersion: string): string {
  const parts = currentVersion.split('.').map(Number);
  
  if (parts.length !== 3) {
    return '1.0.0';
  }
  
  // Increment minor, reset patch
  parts[1]++;
  parts[2] = 0;
  
  return parts.join('.');
}

// ============================================================================
// PROMOTION EXECUTOR
// ============================================================================

let promotionCounter = 0;

export function createPromotionRecord(
  jobId: string,
  aggregationId: string,
  previousVersion: string | null,
  validationResult: ValidationPipelineResult,
  promotedBy: string = 'system'
): PromotionRecord {
  promotionCounter++;
  
  const newVersion = previousVersion 
    ? incrementVersion(previousVersion)
    : '1.0.0';
  
  return {
    promotion_id: `promo_${Date.now()}_${promotionCounter}`,
    job_id: jobId,
    aggregation_id: aggregationId,
    new_version: newVersion,
    previous_version: previousVersion,
    validation_result: validationResult,
    promoted_at: new Date().toISOString(),
    promoted_by: promotedBy,
  };
}

// ============================================================================
// DEPRECATION
// ============================================================================

export interface DeprecationRecord {
  aggregation_id: string;
  version: string;
  reason: string;
  deprecated_at: string;
  deprecated_by: string;
  superseded_by: string | null;
}

export function createDeprecationRecord(
  aggregationId: string,
  version: string,
  reason: string,
  supersededBy: string | null = null,
  deprecatedBy: string = 'system'
): DeprecationRecord {
  return {
    aggregation_id: aggregationId,
    version,
    reason,
    deprecated_at: new Date().toISOString(),
    deprecated_by: deprecatedBy,
    superseded_by: supersededBy,
  };
}

// ============================================================================
// AUDIT LOG
// ============================================================================

let auditCounter = 0;

export function createAuditEntry(
  action: SandboxAuditEntry['action'],
  entityId: string,
  details: Record<string, unknown>
): SandboxAuditEntry {
  auditCounter++;
  
  return {
    entry_id: `audit_${Date.now()}_${auditCounter}`,
    action,
    entity_id: entityId,
    details,
    timestamp: new Date().toISOString(),
  };
}

// ============================================================================
// PROMOTION REGISTRY
// ============================================================================

class PromotionRegistry {
  private promotions: Map<string, PromotionRecord[]> = new Map();
  private deprecations: Map<string, DeprecationRecord[]> = new Map();
  private auditLog: SandboxAuditEntry[] = [];
  
  recordPromotion(record: PromotionRecord): void {
    const existing = this.promotions.get(record.aggregation_id) || [];
    existing.push(record);
    this.promotions.set(record.aggregation_id, existing);
    
    this.auditLog.push(createAuditEntry('promotion', record.aggregation_id, {
      promotion_id: record.promotion_id,
      new_version: record.new_version,
      previous_version: record.previous_version,
    }));
  }
  
  recordDeprecation(record: DeprecationRecord): void {
    const existing = this.deprecations.get(record.aggregation_id) || [];
    existing.push(record);
    this.deprecations.set(record.aggregation_id, existing);
    
    this.auditLog.push(createAuditEntry('deprecation', record.aggregation_id, {
      version: record.version,
      reason: record.reason,
      superseded_by: record.superseded_by,
    }));
  }
  
  getPromotionHistory(aggregationId: string): readonly PromotionRecord[] {
    return this.promotions.get(aggregationId) || [];
  }
  
  getDeprecationHistory(aggregationId: string): readonly DeprecationRecord[] {
    return this.deprecations.get(aggregationId) || [];
  }
  
  getLatestVersion(aggregationId: string): string | null {
    const promotions = this.promotions.get(aggregationId) || [];
    if (promotions.length === 0) return null;
    
    const latest = promotions.reduce((a, b) => 
      new Date(a.promoted_at) > new Date(b.promoted_at) ? a : b
    );
    
    return latest.new_version;
  }
  
  isDeprecated(aggregationId: string, version: string): boolean {
    const deprecations = this.deprecations.get(aggregationId) || [];
    return deprecations.some(d => d.version === version);
  }
  
  getAuditLog(): readonly SandboxAuditEntry[] {
    return this.auditLog;
  }
}

export const promotionRegistry = new PromotionRegistry();

// ============================================================================
// FULL PROMOTION FLOW
// ============================================================================

export interface PromotionFlowResult {
  success: boolean;
  promotion?: PromotionRecord;
  deprecation?: DeprecationRecord;
  error?: string;
}

export function executePromotionFlow(
  result: AggregationResultRaw,
  validationResult: ValidationPipelineResult,
  aggregationId: string,
  promotedBy: string = 'system'
): PromotionFlowResult {
  // Check eligibility
  const eligibility = checkPromotionEligibility(validationResult);
  
  if (!eligibility.eligible) {
    return {
      success: false,
      error: `Not eligible: ${eligibility.blockers.join(', ')}`,
    };
  }
  
  // Get current version
  const currentVersion = promotionRegistry.getLatestVersion(aggregationId);
  
  // Create promotion record
  const promotion = createPromotionRecord(
    result.job_id,
    aggregationId,
    currentVersion,
    validationResult,
    promotedBy
  );
  
  // Deprecate previous version if exists
  let deprecation: DeprecationRecord | undefined;
  if (currentVersion) {
    deprecation = createDeprecationRecord(
      aggregationId,
      currentVersion,
      'Superseded by new version',
      promotion.new_version,
      promotedBy
    );
    promotionRegistry.recordDeprecation(deprecation);
  }
  
  // Record promotion
  promotionRegistry.recordPromotion(promotion);
  
  return {
    success: true,
    promotion,
    deprecation,
  };
}
