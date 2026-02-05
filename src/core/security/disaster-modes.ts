/**
 * DISASTER MODES (DESIGNED)
 * 
 * Infra down → Read-only snapshots continue
 * Org gone → Public mirrors live
 * Key loss → Multi-sig + threshold recovery
 * Hostile takeover → Ontology + Charter cannot change fast enough
 */

import type { DisasterMode, DisasterResponse } from './types';

// ============================================================================
// DISASTER RESPONSES
// ============================================================================

export const DISASTER_RESPONSES: Record<DisasterMode, DisasterResponse> = {
  infra_down: {
    mode: 'infra_down',
    trigger: 'Primary infrastructure becomes unavailable',
    automatic_actions: [
      'Activate read-only snapshots on CDN',
      'Redirect API to cached responses',
      'Display maintenance status',
    ],
    manual_actions: [
      'Restore primary infrastructure',
      'Verify data integrity',
      'Resume write operations',
    ],
  },
  
  org_gone: {
    mode: 'org_gone',
    trigger: 'Organization ceases to exist or operate',
    automatic_actions: [
      'Public mirrors continue serving data',
      'Trust anchors remain accessible',
      'IPFS pins maintained by community',
    ],
    manual_actions: [
      'Transfer stewardship to successor entity',
      'Publish final data snapshot',
      'Archive all materials permanently',
    ],
  },
  
  key_loss: {
    mode: 'key_loss',
    trigger: 'Cryptographic keys are lost or compromised',
    automatic_actions: [
      'Activate threshold recovery protocol',
      'Require multi-sig from remaining key holders',
      'Lock all write operations',
    ],
    manual_actions: [
      'Convene key recovery ceremony',
      'Generate new keys with proper witnesses',
      'Re-sign critical artifacts',
    ],
  },
  
  hostile_takeover: {
    mode: 'hostile_takeover',
    trigger: 'Attempt to compromise system integrity through control',
    automatic_actions: [
      'Ontology locked by 90-day delay',
      'Charter cannot be changed without public process',
      'All changes logged immutably',
    ],
    manual_actions: [
      'Alert community through public channels',
      'Fork to alternative governance',
      'Publish IPFS snapshot as evidence',
    ],
  },
} as const;

// ============================================================================
// KEY RECOVERY
// ============================================================================

export const KEY_RECOVERY_PROTOCOL = {
  type: 'multi_sig_threshold',
  total_shares: 5,
  required_shares: 3,
  
  share_holders: [
    'primary_steward',
    'secondary_steward',
    'technical_guardian',
    'legal_guardian',
    'community_delegate',
  ],
  
  recovery_process: [
    '1. Declare key loss incident publicly',
    '2. Convene at least 3 share holders',
    '3. Verify identity of each share holder',
    '4. Combine shares to reconstruct key',
    '5. Generate new key set with new shares',
    '6. Distribute new shares with witnesses',
    '7. Publish new public keys to trust anchors',
  ],
} as const;

// ============================================================================
// RESILIENCE GUARANTEES
// ============================================================================

export const RESILIENCE_GUARANTEES = {
  data_availability: {
    primary: 'Production infrastructure',
    secondary: 'Read-only CDN mirrors',
    tertiary: 'IPFS permanent storage',
  },
  
  integrity_protection: {
    hash_chains: 'All events cryptographically linked',
    merkle_roots: 'Periodic snapshots published externally',
    trust_anchors: 'Third-party verification possible',
  },
  
  governance_protection: {
    ontology_delay: '90 days minimum for changes',
    charter_delay: 'Requires public process',
    no_emergency_override: 'No backdoor for fast changes',
  },
} as const;

// ============================================================================
// NUCLEAR OPTION
// ============================================================================

export const NUCLEAR_OPTION = {
  name: 'Full Public Disclosure',
  trigger: 'Irrecoverable compromise of system integrity',
  
  actions: [
    'Publish all code to public GitHub',
    'Publish all data to IPFS',
    'Publish to multiple public mirrors',
    'Send to national archives where applicable',
    'Alert research community',
  ],
  
  purpose: 'Ensure truth survives even if system does not',
  
  reversibility: 'Not reversible. Last resort only.',
} as const;
