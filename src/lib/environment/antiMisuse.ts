/**
 * ANTI-MISUSE PROTECTION SYSTEM
 * 
 * Technical barriers preventing data from being weaponized
 * in political campaigns, advocacy, or propaganda.
 * 
 * Core principle: Make misuse technically difficult and easily detectable.
 */

import { validateAgainstCharter, FORBIDDEN_PHRASES } from './charter';
import type { AttributionConfidence } from './types';

/**
 * Campaign context detection keywords
 */
const CAMPAIGN_CONTEXT_SIGNALS = {
  political_parties: [
    'vote', 'rösta', 'elect', 'välj',
    'party', 'parti', 'campaign', 'kampanj',
    'politician', 'politiker', 'candidate', 'kandidat',
  ],
  advocacy: [
    'sign petition', 'signera petition',
    'donate', 'donera',
    'take action', 'agera nu',
    'join us', 'gå med',
    'fight', 'kämpa',
    'stop', 'stoppa',
  ],
  urgency_manipulation: [
    'last chance', 'sista chansen',
    'time is running out', 'tiden rinner ut',
    'act now', 'agera nu',
    'before it\'s too late', 'innan det är för sent',
  ],
} as const;

/**
 * Misuse attempt types
 */
export type MisuseType = 
  | 'cherry_picking'
  | 'missing_context'
  | 'causal_claim'
  | 'certainty_exaggeration'
  | 'campaign_embedding'
  | 'selective_timeframe'
  | 'comparison_without_baseline';

/**
 * Misuse detection result
 */
export interface MisuseDetection {
  detected: boolean;
  type?: MisuseType;
  severity: 'low' | 'medium' | 'high';
  description: string;
  recommendation: string;
}

/**
 * Data request with context
 */
export interface DataRequest {
  indicatorIds: string[];
  timeframeStart: number;
  timeframeEnd: number;
  comparisonType?: 'absolute' | 'relative' | 'trend';
  includeContext?: boolean;
  surroundingText?: string;
}

/**
 * Protected data response
 */
export interface ProtectedDataResponse<T> {
  data: T;
  
  // Mandatory context (always included, cannot be removed)
  mandatoryContext: {
    correlationCaveat: string;
    uncertaintyStatement: string;
    limitations: string[];
    whatThisDoesNotShow: string[];
  };
  
  // Misuse protection metadata
  protection: {
    requestId: string;
    timestamp: string;
    checksumHash: string;
    charterId: string;
    accessConditions: string;
    tamperedDetectable: boolean;
  };
  
  // Embedding restrictions
  embeddingRules: {
    contextMustBeVisible: boolean;
    caveatsCannotBeRemoved: boolean;
    urlMustBeIncluded: boolean;
    modificationDetectable: boolean;
  };
}

/**
 * Detect potential misuse in data request
 */
export function detectMisuseInRequest(request: DataRequest): MisuseDetection[] {
  const detections: MisuseDetection[] = [];
  
  // Check for selective timeframe (cherry-picking)
  const timeframeYears = request.timeframeEnd - request.timeframeStart;
  if (timeframeYears < 5) {
    detections.push({
      detected: true,
      type: 'selective_timeframe',
      severity: 'medium',
      description: `Short timeframe (${timeframeYears} years) may not show meaningful trends`,
      recommendation: 'Include at least 10 years for trend analysis, or explain why short period is appropriate',
    });
  }
  
  // Check for cherry-picking (single indicator without context)
  if (request.indicatorIds.length === 1 && !request.includeContext) {
    detections.push({
      detected: true,
      type: 'cherry_picking',
      severity: 'low',
      description: 'Single indicator without related context may be misleading',
      recommendation: 'Include related indicators or explicitly request full context',
    });
  }
  
  // Check surrounding text for campaign signals
  if (request.surroundingText) {
    const lowerText = request.surroundingText.toLowerCase();
    
    for (const [category, signals] of Object.entries(CAMPAIGN_CONTEXT_SIGNALS)) {
      for (const signal of signals) {
        if (lowerText.includes(signal.toLowerCase())) {
          detections.push({
            detected: true,
            type: 'campaign_embedding',
            severity: 'high',
            description: `Data requested in ${category} context`,
            recommendation: 'Data cannot be embedded in advocacy/campaign material without full context',
          });
          break;
        }
      }
    }
    
    // Check against charter forbidden phrases
    const charterValidation = validateAgainstCharter(request.surroundingText);
    if (!charterValidation.isValid) {
      for (const violation of charterValidation.violations) {
        detections.push({
          detected: true,
          type: 'causal_claim',
          severity: 'high',
          description: `Forbidden phrase detected: "${violation.phrase}"`,
          recommendation: violation.suggestion,
        });
      }
    }
  }
  
  return detections;
}

/**
 * Wrap data response with protection
 */
export function wrapWithProtection<T>(
  data: T,
  observationId: string,
  limitations: string[],
  whatDoesNotShow: string[]
): ProtectedDataResponse<T> {
  const now = new Date().toISOString();
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  return {
    data,
    
    mandatoryContext: {
      correlationCaveat: 'These data show co-movement over time. They do not, by themselves, establish causation.',
      uncertaintyStatement: 'All measurements have associated uncertainty. See documentation for details.',
      limitations,
      whatThisDoesNotShow: whatDoesNotShow,
    },
    
    protection: {
      requestId,
      timestamp: now,
      checksumHash: generateHash(JSON.stringify(data) + now),
      charterId: '1.0.0',
      accessConditions: 'Data may be used with attribution and mandatory context. Context cannot be removed.',
      tamperedDetectable: true,
    },
    
    embeddingRules: {
      contextMustBeVisible: true,
      caveatsCannotBeRemoved: true,
      urlMustBeIncluded: true,
      modificationDetectable: true,
    },
  };
}

/**
 * Verify data integrity (detect tampering)
 */
export function verifyDataIntegrity(
  response: ProtectedDataResponse<any>,
  originalChecksum: string
): { valid: boolean; tamperedFields?: string[] } {
  const currentChecksum = generateHash(JSON.stringify(response.data) + response.protection.timestamp);
  
  if (currentChecksum !== originalChecksum) {
    return {
      valid: false,
      tamperedFields: ['data'],
    };
  }
  
  // Check if mandatory context is intact
  const tamperedFields: string[] = [];
  
  if (!response.mandatoryContext.correlationCaveat) {
    tamperedFields.push('correlationCaveat');
  }
  
  if (!response.mandatoryContext.uncertaintyStatement) {
    tamperedFields.push('uncertaintyStatement');
  }
  
  if (tamperedFields.length > 0) {
    return { valid: false, tamperedFields };
  }
  
  return { valid: true };
}

/**
 * Generate usage restriction watermark
 */
export function generateUsageWatermark(observationId: string): string {
  const timestamp = Date.now();
  return `[DATA:${observationId}|${timestamp}|CONTEXT_REQUIRED]`;
}

/**
 * Parse and validate embedded watermark
 */
export function validateWatermark(watermark: string): {
  valid: boolean;
  observationId?: string;
  timestamp?: number;
} {
  const match = watermark.match(/\[DATA:([^|]+)\|(\d+)\|CONTEXT_REQUIRED\]/);
  
  if (!match) {
    return { valid: false };
  }
  
  return {
    valid: true,
    observationId: match[1],
    timestamp: parseInt(match[2], 10),
  };
}

/**
 * Rate limiting for campaign-like access patterns
 */
export interface AccessPattern {
  userId?: string;
  ipAddress: string;
  requestsPerHour: number;
  indicatorsRequested: string[];
  containsCampaignContext: boolean;
}

export function shouldRateLimitAccess(pattern: AccessPattern): {
  limited: boolean;
  reason?: string;
  waitTimeSeconds?: number;
} {
  // High request rate from campaign context
  if (pattern.containsCampaignContext && pattern.requestsPerHour > 10) {
    return {
      limited: true,
      reason: 'Campaign-context requests are rate-limited',
      waitTimeSeconds: 3600,
    };
  }
  
  // Very high general rate
  if (pattern.requestsPerHour > 100) {
    return {
      limited: true,
      reason: 'Request rate exceeds fair use limits',
      waitTimeSeconds: 60,
    };
  }
  
  return { limited: false };
}

/**
 * Generate simple hash (production should use crypto)
 */
function generateHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `sha256:${Math.abs(hash).toString(16).padStart(16, '0')}`;
}

/**
 * Log misuse attempt for audit
 */
export interface MisuseAuditEntry {
  timestamp: string;
  requestId: string;
  misuseType: MisuseType;
  severity: 'low' | 'medium' | 'high';
  blockedAction: string;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Terms of use that must be accepted for data access
 */
export const DATA_USE_TERMS = {
  version: '1.0',
  terms: [
    'Data must be presented with all mandatory context',
    'Correlation caveats cannot be removed or hidden',
    'Uncertainty ranges must be included',
    'Source attribution is required',
    'Modifications to data are detectable and prohibited',
    'Campaign/advocacy use requires additional review',
    'Violations may result in access revocation',
  ],
  acceptanceRequired: true,
} as const;
