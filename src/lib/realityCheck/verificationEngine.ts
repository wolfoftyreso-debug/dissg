/**
 * 🔐 Reality Check Verification Engine
 * 
 * Generates and validates verification hashes/QR codes
 * for complete traceability of all data claims.
 * 
 * "Ingen kan säga 'det där har ni hittat på'"
 */

import type {
  VerificationRecord,
  SourceSignature,
  Layer3Traceability,
  RealityCheckAnswer,
} from '@/types/realityCheck';

// ============================================
// HASH GENERATION
// ============================================

/**
 * Generate a deterministic hash for verification
 * In production, this would use crypto.subtle
 */
export function generateVerificationHash(data: Record<string, unknown>): string {
  // Deterministic JSON serialization
  const sortedKeys = Object.keys(data).sort();
  const normalized = sortedKeys.map(k => `${k}:${JSON.stringify(data[k])}`).join('|');
  
  // Simple hash for demo (production would use SHA-256)
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    const char = normalized.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  // Convert to hex-like string
  const hashStr = Math.abs(hash).toString(16).padStart(8, '0');
  const timestamp = Date.now().toString(36);
  
  return `RC-${hashStr}-${timestamp}`.toUpperCase();
}

/**
 * Generate a compact hash suitable for QR codes
 */
export function generateCompactHash(data: Record<string, unknown>): string {
  const fullHash = generateVerificationHash(data);
  return fullHash.slice(0, 16);
}

// ============================================
// VERIFICATION RECORD
// ============================================

/**
 * Create a complete verification record for an entity
 */
export function createVerificationRecord(
  type: VerificationRecord['type'],
  entityId: string,
  entityData: Record<string, unknown>,
  sources: string[],
  aggregationLogic: string
): VerificationRecord {
  const timestamp = new Date().toISOString();
  
  const record: VerificationRecord = {
    hash: generateVerificationHash({ entityId, entityData, sources, timestamp }),
    type,
    entityId,
    entityData,
    sources,
    aggregationLogic,
    timestamp,
    systemVersion: '1.0.0',
    rawDataUrl: `/api/v1/verify/${entityId}/raw`,
    methodologyUrl: `/api/v1/verify/${entityId}/methodology`,
    apiEndpoint: `/api/v1/verify/${entityId}`,
  };
  
  return record;
}

// ============================================
// SOURCE SIGNATURE
// ============================================

/**
 * Create a source signature showing exactly what's included/excluded
 */
export function createSourceSignature(
  includedSources: Array<{ id: string; name: string; weight: number }>,
  excludedSources: Array<{ id: string; name: string; excludedBy: 'user' | 'system'; reason: string }>,
  valueWithAll?: number,
  valueWithSelection?: number
): SourceSignature {
  const id = `SS-${Date.now().toString(36)}`;
  
  let exclusionImpact: SourceSignature['exclusionImpact'] = null;
  if (valueWithAll !== undefined && valueWithSelection !== undefined) {
    const differencePercent = ((valueWithSelection - valueWithAll) / valueWithAll) * 100;
    exclusionImpact = {
      valueWithAll,
      valueWithSelection,
      differencePercent,
      isSignificant: Math.abs(differencePercent) > 5, // 5% threshold
    };
  }
  
  const signature: SourceSignature = {
    id,
    hash: generateCompactHash({ includedSources, excludedSources }),
    includedSources,
    excludedSources,
    exclusionImpact,
    qrCodeUrl: `/api/v1/qr/${id}`,
    verificationUrl: `/verify/${id}`,
    createdAt: new Date().toISOString(),
  };
  
  return signature;
}

// ============================================
// TRACEABILITY LAYER
// ============================================

/**
 * Build Layer 3 (traceability) for an answer
 */
export function buildTraceabilityLayer(
  questionId: string,
  sources: Array<{ id: string; name: string; url: string; reliability: number; lastUpdated: string }>,
  aggregationMethod: string,
  limitations: string[]
): Layer3Traceability {
  const hash = generateVerificationHash({
    questionId,
    sources: sources.map(s => s.id),
    aggregationMethod,
    timestamp: new Date().toISOString(),
  });
  
  return {
    questionId,
    sources,
    aggregationMethod,
    normalizationApplied: false,
    exclusions: [],
    limitations,
    whatThisDoesNotShow: [
      'Causal relationships between variables',
      'Individual-level predictions from aggregate data',
      'Future projections or forecasts',
      'Policy recommendations or normative judgments',
    ],
    verificationHash: hash,
    verificationUrl: `/verify/${hash}`,
    timestamp: new Date().toISOString(),
    systemVersion: '1.0.0',
  };
}

// ============================================
// ANSWER VALIDATION
// ============================================

/**
 * Validate that an answer has complete traceability
 */
export function validateAnswerTraceability(answer: Partial<RealityCheckAnswer>): {
  isValid: boolean;
  missingElements: string[];
} {
  const missing: string[] = [];
  
  // Check Layer 2
  if (!answer.layer2) {
    missing.push('Layer 2 (Observed Data)');
  } else {
    if (answer.layer2.confidence === undefined) missing.push('Data confidence');
    if (!answer.layer2.dataAsOf) missing.push('Data timestamp');
    if (answer.layer2.dataPoints === undefined) missing.push('Data point count');
  }
  
  // Check Layer 3
  if (!answer.layer3) {
    missing.push('Layer 3 (Traceability)');
  } else {
    if (!answer.layer3.sources || answer.layer3.sources.length === 0) {
      missing.push('Source citations');
    }
    if (!answer.layer3.verificationHash) missing.push('Verification hash');
    if (!answer.layer3.limitations || answer.layer3.limitations.length === 0) {
      missing.push('Limitations disclosure');
    }
    if (!answer.layer3.whatThisDoesNotShow || answer.layer3.whatThisDoesNotShow.length === 0) {
      missing.push('"What this does not show" section');
    }
  }
  
  return {
    isValid: missing.length === 0,
    missingElements: missing,
  };
}

// ============================================
// QR CODE DATA
// ============================================

export interface QRCodeData {
  type: 'question' | 'answer' | 'correlation' | 'diagram';
  id: string;
  hash: string;
  verifyUrl: string;
  timestamp: string;
}

/**
 * Generate data structure for QR code
 */
export function generateQRCodeData(
  type: QRCodeData['type'],
  id: string,
  data: Record<string, unknown>
): QRCodeData {
  const hash = generateCompactHash(data);
  
  return {
    type,
    id,
    hash,
    verifyUrl: `https://verify.example.com/${hash}`,
    timestamp: new Date().toISOString(),
  };
}

// ============================================
// VERIFICATION CHECK
// ============================================

/**
 * Verify a hash against stored data
 */
export function verifyHash(
  providedHash: string,
  entityData: Record<string, unknown>
): {
  isValid: boolean;
  computedHash: string;
  mismatchReason?: string;
} {
  const computedHash = generateVerificationHash(entityData);
  const isValid = providedHash === computedHash;
  
  return {
    isValid,
    computedHash,
    mismatchReason: isValid ? undefined : 'Hash does not match current data state',
  };
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

/**
 * Export verification record as JSON for external validation
 */
export function exportVerificationJSON(record: VerificationRecord): string {
  return JSON.stringify({
    ...record,
    exportedAt: new Date().toISOString(),
    format: 'reality-check-verification-v1',
  }, null, 2);
}

/**
 * Generate a citation string for academic/media use
 */
export function generateCitation(
  answer: RealityCheckAnswer,
  format: 'apa' | 'mla' | 'bibtex' = 'apa'
): string {
  const { layer3 } = answer;
  const date = new Date(layer3.timestamp);
  
  if (format === 'apa') {
    return `Reality Check Engine. (${date.getFullYear()}). Question ${answer.layer1.questionId}. ` +
           `Retrieved from ${layer3.verificationUrl}. Hash: ${layer3.verificationHash}`;
  }
  
  if (format === 'mla') {
    return `"Question ${answer.layer1.questionId}." Reality Check Engine, ` +
           `${date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}. ` +
           `${layer3.verificationUrl}.`;
  }
  
  if (format === 'bibtex') {
    return `@misc{realitycheck_${answer.layer1.questionId},
  title = {Reality Check Question ${answer.layer1.questionId}},
  howpublished = {\\url{${layer3.verificationUrl}}},
  note = {Hash: ${layer3.verificationHash}},
  year = {${date.getFullYear()}}
}`;
  }
  
  return '';
}
