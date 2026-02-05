/**
 * TIME-LOCKED TRUTH
 * 
 * Artifacts can only be interpreted in their time.
 * Cannot be retroactively updated, only superseded.
 * History is physical in the system.
 */

import type { TimeLockEnvelope } from './types';

/**
 * Create a time-locked envelope for an artifact
 */
export function createTimeLockEnvelope<T>(
  artifactId: string,
  artifactType: TimeLockEnvelope<T>['artifact_type'],
  content: T
): TimeLockEnvelope<T> {
  return {
    artifact_id: artifactId,
    artifact_type: artifactType,
    content,
    locked_at: new Date().toISOString(),
    interpretation_context: 'This artifact can only be interpreted in the context of its creation time',
    can_be_modified: false,
    can_be_deleted: false,
    version: 1,
  };
}

/**
 * Attempt to modify a time-locked artifact (always throws)
 */
export function attemptModify<T>(
  _envelope: TimeLockEnvelope<T>,
  _newContent: T
): never {
  throw new Error(
    'TIME-LOCKED: Artifacts cannot be modified. ' +
    'To change, create a new version that supersedes this one.'
  );
}

/**
 * Attempt to delete a time-locked artifact (always throws)
 */
export function attemptDelete<T>(_envelope: TimeLockEnvelope<T>): never {
  throw new Error(
    'TIME-LOCKED: Artifacts cannot be deleted. ' +
    'History is physical in this system.'
  );
}

/**
 * Create a superseding version
 */
export function supersede<T>(
  original: TimeLockEnvelope<T>,
  newContent: T,
  supersedingId: string
): { original: TimeLockEnvelope<T>; newVersion: TimeLockEnvelope<T> } {
  // Original is marked as superseded (but not modified)
  const markedOriginal: TimeLockEnvelope<T> = {
    ...original,
    superseded_by: supersedingId,
  };
  
  // New version is created
  const newVersion: TimeLockEnvelope<T> = {
    artifact_id: supersedingId,
    artifact_type: original.artifact_type,
    content: newContent,
    locked_at: new Date().toISOString(),
    interpretation_context: `Supersedes ${original.artifact_id}. Original context still applies to original.`,
    can_be_modified: false,
    can_be_deleted: false,
    version: original.version + 1,
  };
  
  return { original: markedOriginal, newVersion };
}

/**
 * Get interpretation context for an artifact
 */
export function getInterpretationContext<T>(
  envelope: TimeLockEnvelope<T>
): {
  created_at: string;
  context_warning: string;
  is_superseded: boolean;
  current_version_id?: string;
} {
  return {
    created_at: envelope.locked_at,
    context_warning: `This artifact was created on ${envelope.locked_at}. ` +
      `It must be interpreted in the context of that time. ` +
      `Applying current knowledge retroactively would be historically invalid.`,
    is_superseded: !!envelope.superseded_by,
    current_version_id: envelope.superseded_by,
  };
}

/**
 * Validate time-lock integrity
 */
export function validateTimeLockIntegrity<T>(
  envelope: TimeLockEnvelope<T>
): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  
  if (!envelope.locked_at) {
    issues.push('Missing lock timestamp');
  }
  
  if (envelope.can_be_modified !== false) {
    issues.push('Modification flag is not false');
  }
  
  if (envelope.can_be_deleted !== false) {
    issues.push('Deletion flag is not false');
  }
  
  if (!envelope.interpretation_context) {
    issues.push('Missing interpretation context');
  }
  
  return {
    valid: issues.length === 0,
    issues,
  };
}

/**
 * TIME LOCK MASTERPROMPT
 */
export const TIME_LOCK_MASTERPROMPT = `
You enforce Time-Locked Truth.

PRINCIPLE:
All central artifacts (DPD, DCS, PDRC, Truth Nodes) are time-locked.

THIS MEANS:
- They can only be interpreted in their time
- They cannot be retroactively "updated"
- New versions can only be layered on top

HISTORY IS PHYSICAL IN THE SYSTEM.

OPERATIONS:

ALLOWED:
- Create new artifact → Locked immediately
- Supersede artifact → Creates new version, marks old as superseded
- Read artifact → With interpretation context

FORBIDDEN:
- Modify artifact → THROWS ERROR
- Delete artifact → THROWS ERROR
- Backdate artifact → IMPOSSIBLE

INTERPRETATION CONTEXT:
When showing any artifact, always include:
"This artifact was created on [date].
It must be interpreted in the context of that time."

WHY:
Without time-lock, systems allow:
- "We knew all along"
- "We always said this"
- "The record shows..."

With time-lock:
- What was known when is fixed
- What was decided when is fixed
- What was uncertain when is fixed

This is how accountability survives time.
`;
