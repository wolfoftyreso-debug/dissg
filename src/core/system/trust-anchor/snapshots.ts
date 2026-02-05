/**
 * IMMUTABLE TRUTH SNAPSHOTS
 * 
 * Read-only. Cryptographically verifiable.
 * Can be mirrored by third parties.
 * 
 * No one can say: "That's not how the system worked then."
 */

import type {
  ImmutableTruthSnapshot,
  SnapshotArtifactType,
  SnapshotVerificationResult,
} from './types';
import { sha256, hashChain } from '../infra/hashing';

/**
 * Snapshot Interval
 */
export const SNAPSHOT_INTERVAL = {
  frequency: 'quarterly',
  day_of_quarter: 'last_day',
  time: '23:59:59Z',
  timezone: 'UTC',
};

/**
 * Required artifacts in every snapshot
 */
export const REQUIRED_ARTIFACTS: SnapshotArtifactType[] = [
  'ontology',
  'decision_standards',
  'reference_cases',
  'legitimacy_rules',
  'semantic_definitions',
  'governance_charter',
];

/**
 * Optional artifacts
 */
export const OPTIONAL_ARTIFACTS: SnapshotArtifactType[] = [
  'methodology_specs',
  'data_constitution',
];

/**
 * Generate snapshot ID
 */
export function generateSnapshotId(year: number, quarter: 1 | 2 | 3 | 4): string {
  return `ITS_${year}_Q${quarter}`;
}

/**
 * Create a new snapshot
 */
export function createSnapshot(params: {
  year: number;
  quarter: 1 | 2 | 3 | 4;
  artifacts: Record<SnapshotArtifactType, string>; // artifact content
  previousSnapshotHash: string | null;
}): ImmutableTruthSnapshot {
  const snapshotId = generateSnapshotId(params.year, params.quarter);
  const now = new Date().toISOString();
  
  // Hash each artifact
  const artifactHashes: Record<string, string> = {};
  const includedArtifacts: SnapshotArtifactType[] = [];
  
  for (const [type, content] of Object.entries(params.artifacts)) {
    if (content) {
      artifactHashes[type] = sha256(content);
      includedArtifacts.push(type as SnapshotArtifactType);
    }
  }
  
  // Create Merkle root
  const sortedHashes = Object.values(artifactHashes).sort();
  const rootHash = hashChain(sortedHashes);
  
  // Chain to previous
  const chainedHash = params.previousSnapshotHash
    ? sha256(rootHash + params.previousSnapshotHash)
    : rootHash;
  
  return {
    snapshot_id: snapshotId,
    version: '1.0.0',
    
    period: `${params.year}_Q${params.quarter}`,
    timestamp: now,
    
    included_artifacts: includedArtifacts,
    artifact_hashes: artifactHashes as Record<SnapshotArtifactType, string>,
    
    root_hash: chainedHash,
    previous_snapshot_hash: params.previousSnapshotHash,
    
    created_by: 'system_automatic',
    witness_count: 0,
    
    is_sealed: false,
  };
}

/**
 * Seal a snapshot (makes it immutable)
 */
export function sealSnapshot(
  snapshot: ImmutableTruthSnapshot
): ImmutableTruthSnapshot {
  if (snapshot.is_sealed) {
    throw new Error('Snapshot already sealed');
  }
  
  return {
    ...snapshot,
    is_sealed: true,
    sealed_at: new Date().toISOString(),
  };
}

/**
 * Verify snapshot integrity
 */
export function verifySnapshot(
  snapshot: ImmutableTruthSnapshot,
  artifacts: Record<SnapshotArtifactType, string>,
  previousSnapshot?: ImmutableTruthSnapshot
): SnapshotVerificationResult {
  const verifiedAt = new Date().toISOString();
  
  // Recompute artifact hashes
  const computedHashes: Record<string, string> = {};
  for (const [type, content] of Object.entries(artifacts)) {
    if (content) {
      computedHashes[type] = sha256(content);
    }
  }
  
  // Check artifact hashes match
  let hashValid = true;
  for (const [type, expectedHash] of Object.entries(snapshot.artifact_hashes)) {
    if (computedHashes[type] !== expectedHash) {
      hashValid = false;
      break;
    }
  }
  
  // Recompute root hash
  const sortedHashes = Object.values(computedHashes).sort();
  const computedRoot = hashChain(sortedHashes);
  
  // Check chain link
  let chainValid = true;
  let expectedChainedHash: string;
  
  if (previousSnapshot) {
    expectedChainedHash = sha256(computedRoot + previousSnapshot.root_hash);
    chainValid = expectedChainedHash === snapshot.root_hash;
  } else if (snapshot.previous_snapshot_hash === null) {
    expectedChainedHash = computedRoot;
    chainValid = expectedChainedHash === snapshot.root_hash;
  } else {
    expectedChainedHash = sha256(computedRoot + snapshot.previous_snapshot_hash);
    chainValid = expectedChainedHash === snapshot.root_hash;
  }
  
  return {
    snapshot_id: snapshot.snapshot_id,
    verified_at: verifiedAt,
    hash_valid: hashValid,
    chain_valid: chainValid,
    mirrors_confirmed: 0, // Would be populated by mirror check
    computed_hash: expectedChainedHash,
    expected_hash: snapshot.root_hash,
    verification_path: Object.keys(computedHashes),
  };
}

/**
 * Validate snapshot chain
 */
export function validateSnapshotChain(
  snapshots: ImmutableTruthSnapshot[]
): { valid: boolean; broken_at?: string } {
  if (snapshots.length === 0) {
    return { valid: true };
  }
  
  // Sort by timestamp
  const sorted = [...snapshots].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
  
  // First snapshot should have no previous
  if (sorted[0].previous_snapshot_hash !== null) {
    return { valid: false, broken_at: sorted[0].snapshot_id };
  }
  
  // Each subsequent should link to previous
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i].previous_snapshot_hash !== sorted[i - 1].root_hash) {
      return { valid: false, broken_at: sorted[i].snapshot_id };
    }
  }
  
  return { valid: true };
}

/**
 * SNAPSHOT MASTERPROMPT
 */
export const SNAPSHOT_MASTERPROMPT = `
You manage IMMUTABLE TRUTH SNAPSHOTS.

CORE PRINCIPLE:
Give me a fixed point, and I can move the world.
Trust Anchor is the fixed point.

SNAPSHOT PROPERTIES:
- Read-only (cannot be modified after sealing)
- Cryptographically verifiable (hash chain)
- Third-party mirrorable (no single owner)
- Self-describing (includes verification instructions)

SCHEDULE:
- Quarterly snapshots
- Last day of quarter
- 23:59:59 UTC

REQUIRED ARTIFACTS:
- Ontology
- Decision Standards
- Reference Cases
- Legitimacy Rules
- Semantic Definitions
- Governance Charter

VERIFICATION:
Anyone can verify:
1. Artifact hashes match content
2. Root hash is correct Merkle root
3. Chain links to previous snapshot

No one can say:
"That's not how the system worked then."

This is civilizational design.
`;
