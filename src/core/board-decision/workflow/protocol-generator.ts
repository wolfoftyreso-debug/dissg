/**
 * PROTOCOL GENERATOR
 * 
 * Structured protocol generation - NO narrative, NO free text.
 * Only structured fields allowed.
 */

import type { 
  BoardProtocol, 
  ProtocolItem, 
  ProtocolAttendance,
  VoteResult,
  Reservation 
} from './types';
import { generateChecksum } from './utils';

/**
 * Create new protocol for meeting
 */
export function createProtocol(params: {
  meeting_date: string;
  meeting_type: 'board_meeting' | 'annual_meeting' | 'extraordinary';
  attendance: ProtocolAttendance;
}): BoardProtocol {
  const protocol_id = `prot_${params.meeting_date.replace(/-/g, '_')}_${Date.now()}`;
  
  const protocol: BoardProtocol = {
    protocol_id,
    meeting_date: params.meeting_date,
    meeting_type: params.meeting_type,
    
    attendance: params.attendance,
    items: [],
    
    signatures: [
      { role: 'chair', name: '', signed_at: null, signature_hash: null },
      { role: 'secretary', name: '', signed_at: null, signature_hash: null },
    ],
    context_snapshot_id: '',
    
    locked: false,
    locked_at: null,
    checksum: '',
  };
  
  protocol.checksum = generateChecksum(protocol);
  
  return protocol;
}

/**
 * Add decision item to protocol
 */
export function addProtocolItem(
  protocol: BoardProtocol,
  item: {
    title: string;
    dpd_id: string | null;
    alternatives_considered: string[];
    decision_taken: string | null;
    vote_result: VoteResult | null;
    reservations?: Reservation[];
  }
): BoardProtocol {
  if (protocol.locked) {
    throw new Error('Cannot modify locked protocol');
  }
  
  const newItem: ProtocolItem = {
    item_number: protocol.items.length + 1,
    title: item.title,
    dpd_id: item.dpd_id,
    alternatives_considered: item.alternatives_considered,
    decision_taken: item.decision_taken,
    vote_result: item.vote_result,
    reservations: item.reservations || [],
    notes: null, // Explicitly null - no free text allowed
  };
  
  const updated = {
    ...protocol,
    items: [...protocol.items, newItem],
  };
  
  updated.checksum = generateChecksum(updated);
  
  return updated;
}

/**
 * Record vote on item
 */
export function recordVote(
  protocol: BoardProtocol,
  item_number: number,
  vote: VoteResult
): BoardProtocol {
  if (protocol.locked) {
    throw new Error('Cannot modify locked protocol');
  }
  
  const updated = {
    ...protocol,
    items: protocol.items.map(item => 
      item.item_number === item_number
        ? { ...item, vote_result: vote }
        : item
    ),
  };
  
  updated.checksum = generateChecksum(updated);
  
  return updated;
}

/**
 * Add reservation to item
 */
export function addReservation(
  protocol: BoardProtocol,
  item_number: number,
  reservation: Reservation
): BoardProtocol {
  if (protocol.locked) {
    throw new Error('Cannot modify locked protocol');
  }
  
  const updated = {
    ...protocol,
    items: protocol.items.map(item => 
      item.item_number === item_number
        ? { ...item, reservations: [...item.reservations, reservation] }
        : item
    ),
  };
  
  updated.checksum = generateChecksum(updated);
  
  return updated;
}

/**
 * Sign protocol
 */
export function signProtocol(
  protocol: BoardProtocol,
  signature: {
    role: 'chair' | 'secretary' | 'adjuster';
    name: string;
  }
): BoardProtocol {
  if (protocol.locked) {
    throw new Error('Cannot modify locked protocol');
  }
  
  const signed_at = new Date().toISOString();
  const signature_hash = generateChecksum({ 
    ...signature, 
    signed_at, 
    protocol_id: protocol.protocol_id 
  });
  
  const updated = {
    ...protocol,
    signatures: protocol.signatures.map(sig => 
      sig.role === signature.role
        ? { ...sig, name: signature.name, signed_at, signature_hash }
        : sig
    ),
  };
  
  updated.checksum = generateChecksum(updated);
  
  return updated;
}

/**
 * Lock protocol (after all signatures)
 */
export function lockProtocol(
  protocol: BoardProtocol,
  context_snapshot_id: string
): BoardProtocol {
  // Verify required signatures
  const requiredSignatures = ['chair', 'secretary'];
  const missingSignatures = requiredSignatures.filter(role => {
    const sig = protocol.signatures.find(s => s.role === role);
    return !sig || !sig.signed_at;
  });
  
  if (missingSignatures.length > 0) {
    throw new Error(`Missing required signatures: ${missingSignatures.join(', ')}`);
  }
  
  const locked: BoardProtocol = {
    ...protocol,
    context_snapshot_id,
    locked: true,
    locked_at: new Date().toISOString(),
  };
  
  locked.checksum = generateChecksum(locked);
  
  return locked;
}

/**
 * Validate protocol structure
 */
export function validateProtocol(protocol: BoardProtocol): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check attendance
  if (protocol.attendance.present.length === 0) {
    errors.push('No attendees recorded');
  }
  
  // Check items
  if (protocol.items.length === 0) {
    warnings.push('No items in protocol');
  }
  
  // Check each item
  for (const item of protocol.items) {
    if (item.dpd_id && !item.alternatives_considered.length) {
      errors.push(`Item ${item.item_number}: Has DPD but no alternatives recorded`);
    }
    
    if (item.notes !== null) {
      errors.push(`Item ${item.item_number}: Free text notes not allowed`);
    }
  }
  
  // Check signatures
  const unsigned = protocol.signatures.filter(s => !s.signed_at);
  if (unsigned.length > 0 && !protocol.locked) {
    warnings.push(`Unsigned roles: ${unsigned.map(s => s.role).join(', ')}`);
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

export const PROTOCOL_GENERATOR_MASTERPROMPT = `
You are a Board Protocol Generator.
Generate structured, non-narrative protocols.

ALLOWED FIELDS ONLY:
- Attendance (present, absent, guests)
- Item number and title
- Alternatives considered (list)
- Decision taken (single choice)
- Vote result (for, against, abstain)
- Reservations (member + structured reason)
- Context snapshot ID

FORBIDDEN:
- Free text notes
- Narrative descriptions
- Interpretations
- Recommendations
- Post-hoc rationalizations

The protocol is a RECORD, not a STORY.
`;
