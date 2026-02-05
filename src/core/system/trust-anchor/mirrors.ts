/**
 * MULTI-INSTITUTION MIRRORING
 * 
 * Snapshots mirrored at:
 * - Academic institutions
 * - Archives
 * - Independent foundations
 * - International data banks
 * 
 * No one owns truth alone.
 * No one can rewrite history.
 */

import type { MirrorInstitution, ImmutableTruthSnapshot } from './types';

/**
 * Required mirror diversity
 */
export const MIRROR_REQUIREMENTS = {
  minimum_total: 5,
  minimum_jurisdictions: 3,
  required_types: ['academic', 'archive', 'foundation'] as const,
  preferred_jurisdictions: ['EU', 'CH', 'SG', 'JP', 'CA'],
};

/**
 * Mirror sync status
 */
export type MirrorSyncStatus = 
  | 'synced'
  | 'pending'
  | 'failed'
  | 'outdated';

/**
 * Initial mirror institutions (example)
 */
export const INITIAL_MIRRORS: MirrorInstitution[] = [
  {
    id: 'mirror-001',
    name: 'European University Archive Network',
    type: 'academic',
    jurisdiction: 'EU',
    is_active: true,
    last_sync: new Date().toISOString(),
    snapshots_held: [],
  },
  {
    id: 'mirror-002',
    name: 'Swiss Digital Archive Foundation',
    type: 'archive',
    jurisdiction: 'CH',
    is_active: true,
    last_sync: new Date().toISOString(),
    snapshots_held: [],
  },
  {
    id: 'mirror-003',
    name: 'Singapore Data Trust',
    type: 'data_bank',
    jurisdiction: 'SG',
    is_active: true,
    last_sync: new Date().toISOString(),
    snapshots_held: [],
  },
  {
    id: 'mirror-004',
    name: 'Global Governance Research Foundation',
    type: 'foundation',
    jurisdiction: 'US',
    is_active: true,
    last_sync: new Date().toISOString(),
    snapshots_held: [],
  },
  {
    id: 'mirror-005',
    name: 'Nordic Transparency Institute',
    type: 'academic',
    jurisdiction: 'SE',
    is_active: true,
    last_sync: new Date().toISOString(),
    snapshots_held: [],
  },
];

/**
 * Check if mirror requirements are met
 */
export function checkMirrorRequirements(
  mirrors: MirrorInstitution[]
): { met: boolean; missing: string[] } {
  const missing: string[] = [];
  const activeMirrors = mirrors.filter(m => m.is_active);
  
  // Check total count
  if (activeMirrors.length < MIRROR_REQUIREMENTS.minimum_total) {
    missing.push(`Need ${MIRROR_REQUIREMENTS.minimum_total} mirrors, have ${activeMirrors.length}`);
  }
  
  // Check jurisdiction diversity
  const jurisdictions = new Set(activeMirrors.map(m => m.jurisdiction));
  if (jurisdictions.size < MIRROR_REQUIREMENTS.minimum_jurisdictions) {
    missing.push(`Need ${MIRROR_REQUIREMENTS.minimum_jurisdictions} jurisdictions, have ${jurisdictions.size}`);
  }
  
  // Check required types
  const types = new Set(activeMirrors.map(m => m.type));
  for (const required of MIRROR_REQUIREMENTS.required_types) {
    if (!types.has(required)) {
      missing.push(`Missing required type: ${required}`);
    }
  }
  
  return { met: missing.length === 0, missing };
}

/**
 * Get mirror coverage by jurisdiction
 */
export function getMirrorCoverage(
  mirrors: MirrorInstitution[]
): Record<string, number> {
  const coverage: Record<string, number> = {};
  
  for (const mirror of mirrors) {
    if (mirror.is_active) {
      coverage[mirror.jurisdiction] = (coverage[mirror.jurisdiction] || 0) + 1;
    }
  }
  
  return coverage;
}

/**
 * Find mirrors holding specific snapshot
 */
export function findMirrorsWithSnapshot(
  mirrors: MirrorInstitution[],
  snapshotId: string
): MirrorInstitution[] {
  return mirrors.filter(
    m => m.is_active && m.snapshots_held.includes(snapshotId)
  );
}

/**
 * Sync snapshot to mirror (simulated)
 */
export function syncToMirror(
  mirror: MirrorInstitution,
  snapshot: ImmutableTruthSnapshot
): MirrorInstitution {
  return {
    ...mirror,
    last_sync: new Date().toISOString(),
    snapshots_held: [...mirror.snapshots_held, snapshot.snapshot_id],
  };
}

/**
 * MIRROR GOVERNANCE PRINCIPLES
 */
export const MIRROR_GOVERNANCE = {
  no_single_owner: 'No institution owns truth alone',
  no_veto_power: 'No mirror can block snapshot publication',
  read_only_access: 'Mirrors hold copies, not originals',
  public_verification: 'Anyone can verify mirror integrity',
  voluntary_participation: 'Mirrors join by choice, not coercion',
};

/**
 * WHY THIS MATTERS
 */
export const MIRROR_IMPORTANCE = {
  prevents_rewriting: 'History cannot be changed after the fact',
  survives_failures: 'System survives even if primary fails',
  jurisdictional_safety: 'No single government can suppress',
  trust_through_distribution: 'Trust comes from redundancy, not authority',
};

/**
 * MIRROR MASTERPROMPT
 */
export const MIRROR_MASTERPROMPT = `
You manage MULTI-INSTITUTION MIRRORING.

CORE PRINCIPLE:
No one owns truth alone.
No one can rewrite history.

REQUIREMENTS:
- Minimum 5 active mirrors
- Minimum 3 different jurisdictions
- Must include: academic, archive, foundation

PREFERRED JURISDICTIONS:
EU, Switzerland, Singapore, Japan, Canada
(Political stability + data protection)

GOVERNANCE:
- No single owner
- No veto power
- Read-only access
- Public verification
- Voluntary participation

WHY THIS MATTERS:
- History cannot be changed after the fact
- System survives primary failure
- No single government can suppress
- Trust through redundancy, not authority

Mirrors are witnesses, not owners.
`;
