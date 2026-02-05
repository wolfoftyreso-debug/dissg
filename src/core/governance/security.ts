/**
 * SECURITY MODEL
 * 
 * Zero Trust. Read-Only. Deterministic.
 */

import { sha256 } from '@/core/system/infra/hashing';

// ============================================
// API SECURITY
// ============================================

export interface ApiToken {
  token_id: string;
  permissions: ApiPermission[];
  rate_limit_per_minute: number;
  rate_limit_per_day: number;
  created_at: string;
  expires_at: string | null;
  is_active: boolean;
}

export type ApiPermission = 
  | 'read:nodes'
  | 'read:indexes'
  | 'read:graphs'
  | 'read:signals'
  | 'read:methodology'
  | 'traverse:graph';

// Default read-only token permissions
export const DEFAULT_PERMISSIONS: ApiPermission[] = [
  'read:nodes',
  'read:indexes',
  'read:graphs',
  'read:signals',
  'read:methodology',
  'traverse:graph',
];

// ============================================
// RATE LIMITING
// ============================================

interface RateLimitState {
  requests_this_minute: number;
  requests_today: number;
  minute_start: number;
  day_start: number;
}

const RATE_LIMIT_STORE: Map<string, RateLimitState> = new Map();

export function checkRateLimit(
  tokenId: string,
  token: ApiToken
): { allowed: boolean; reason?: string } {
  const now = Date.now();
  const state = RATE_LIMIT_STORE.get(tokenId) ?? {
    requests_this_minute: 0,
    requests_today: 0,
    minute_start: now,
    day_start: now,
  };
  
  // Reset minute counter
  if (now - state.minute_start > 60_000) {
    state.requests_this_minute = 0;
    state.minute_start = now;
  }
  
  // Reset day counter
  if (now - state.day_start > 86_400_000) {
    state.requests_today = 0;
    state.day_start = now;
  }
  
  // Check limits
  if (state.requests_this_minute >= token.rate_limit_per_minute) {
    return { allowed: false, reason: 'Rate limit exceeded (per minute)' };
  }
  
  if (state.requests_today >= token.rate_limit_per_day) {
    return { allowed: false, reason: 'Rate limit exceeded (per day)' };
  }
  
  // Increment and store
  state.requests_this_minute++;
  state.requests_today++;
  RATE_LIMIT_STORE.set(tokenId, state);
  
  return { allowed: true };
}

// ============================================
// DATA INTEGRITY
// ============================================

export interface IntegrityCheck {
  entity_type: 'node' | 'index' | 'graph';
  entity_id: string;
  expected_hash: string;
  actual_hash: string;
  valid: boolean;
  checked_at: string;
}

export function computeEntityHash(entity: Record<string, unknown>): string {
  const normalized = JSON.stringify(entity, Object.keys(entity).sort());
  return sha256(normalized);
}

export function verifyIntegrity(
  entity: Record<string, unknown>,
  expectedHash: string
): IntegrityCheck {
  const actualHash = computeEntityHash(entity);
  
  return {
    entity_type: 'node', // determined by caller
    entity_id: (entity.id as string) ?? 'unknown',
    expected_hash: expectedHash,
    actual_hash: actualHash,
    valid: actualHash === expectedHash,
    checked_at: new Date().toISOString(),
  };
}

// ============================================
// ATTACK SURFACE CLOSURES
// ============================================

export const ATTACK_MITIGATIONS = {
  // Prompt injection
  prompt_injection: {
    mitigation: 'LLM is never a source; all data from verified artifacts',
    enforcement: 'No LLM-generated content in Truth Nodes or Indexes',
  },
  
  // Data poisoning
  data_poisoning: {
    mitigation: 'Source validation + versioning + checksums',
    enforcement: 'All data changes require manifest + checksum verification',
  },
  
  // UI manipulation
  ui_manipulation: {
    mitigation: 'All semantic content server-rendered',
    enforcement: 'UI receives structured data only, no raw user input in rendering',
  },
  
  // Replay attacks
  replay_attacks: {
    mitigation: 'Deterministic responses with timestamps',
    enforcement: 'All responses include generation timestamp and version',
  },
} as const;

// ============================================
// SECURITY AUDIT LOG
// ============================================

interface SecurityEvent {
  event_id: string;
  event_type: 'rate_limit' | 'integrity_fail' | 'permission_denied' | 'suspicious_pattern';
  token_id?: string;
  details: string;
  timestamp: string;
}

const SECURITY_LOG: SecurityEvent[] = [];

export function logSecurityEvent(event: Omit<SecurityEvent, 'event_id' | 'timestamp'>): void {
  SECURITY_LOG.push({
    ...event,
    event_id: `sec_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    timestamp: new Date().toISOString(),
  });
}

export function getSecurityLog(limit = 100): readonly SecurityEvent[] {
  return SECURITY_LOG.slice(-limit);
}
