/**
 * CRYPTOGRAPHIC INTEGRITY
 * 
 * The core protection layer.
 * Chain breaks = immediate alarm.
 * No one can alter history without leaving traces.
 */

import type { HashableEvent, MerkleRoot } from './types';

// ============================================================================
// EVENT HASHING (APPEND-ONLY)
// ============================================================================

export async function hashEvent(
  eventId: string,
  prevHash: string,
  payload: Record<string, unknown>
): Promise<HashableEvent> {
  const payloadHash = await computeHash(JSON.stringify(payload));
  const combinedData = `${eventId}:${prevHash}:${payloadHash}`;
  const hash = await computeHash(combinedData);
  
  return {
    event_id: eventId,
    prev_hash: prevHash,
    payload_hash: payloadHash,
    hash,
    timestamp: new Date().toISOString(),
  };
}

export async function computeHash(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  
  // Use Web Crypto API for SHA-256
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  
  return '0x' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export function verifyChain(events: HashableEvent[]): {
  valid: boolean;
  break_at: number | null;
} {
  for (let i = 1; i < events.length; i++) {
    if (events[i].prev_hash !== events[i - 1].hash) {
      return { valid: false, break_at: i };
    }
  }
  return { valid: true, break_at: null };
}

// ============================================================================
// MERKLE ROOTS
// ============================================================================

export async function computeMerkleRoot(hashes: string[]): Promise<string> {
  if (hashes.length === 0) {
    return await computeHash('empty');
  }
  
  if (hashes.length === 1) {
    return hashes[0];
  }
  
  // Pad to even length
  const paddedHashes = hashes.length % 2 === 0 
    ? hashes 
    : [...hashes, hashes[hashes.length - 1]];
  
  const nextLevel: string[] = [];
  for (let i = 0; i < paddedHashes.length; i += 2) {
    const combined = paddedHashes[i] + paddedHashes[i + 1];
    nextLevel.push(await computeHash(combined));
  }
  
  return computeMerkleRoot(nextLevel);
}

export async function createMerkleRoot(
  events: HashableEvent[],
  period: 'daily' | 'weekly'
): Promise<MerkleRoot> {
  const hashes = events.map(e => e.hash);
  const rootHash = await computeMerkleRoot(hashes);
  
  return {
    root_hash: rootHash,
    period,
    event_count: events.length,
    created_at: new Date().toISOString(),
    published_to: [], // Will be populated when published
  };
}

// ============================================================================
// PUBLICATION TARGETS
// ============================================================================

export const MERKLE_PUBLICATION_TARGETS = [
  'ipfs',
  'arweave',
  'public_github',
  'transparency_log',
] as const;

// ============================================================================
// CHAIN VALIDATION
// ============================================================================

export interface ChainValidationResult {
  valid: boolean;
  events_checked: number;
  chain_breaks: number[];
  tamper_alerts: string[];
}

export function validateEventChain(events: HashableEvent[]): ChainValidationResult {
  const chainBreaks: number[] = [];
  const tamperAlerts: string[] = [];
  
  for (let i = 1; i < events.length; i++) {
    if (events[i].prev_hash !== events[i - 1].hash) {
      chainBreaks.push(i);
      tamperAlerts.push(
        `Chain break detected at index ${i}: expected prev_hash ${events[i - 1].hash}, got ${events[i].prev_hash}`
      );
    }
  }
  
  return {
    valid: chainBreaks.length === 0,
    events_checked: events.length,
    chain_breaks: chainBreaks,
    tamper_alerts: tamperAlerts,
  };
}
