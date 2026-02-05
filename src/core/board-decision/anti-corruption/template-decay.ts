/**
 * ANTI-TEMPLATE DECAY
 * 
 * Templates are fixed in structure, open in content.
 * But: empty fields cannot be approved, copy-paste is flagged.
 */

import type { TemplateDecaySignal } from './types';

/**
 * Required fields by document type
 */
const REQUIRED_FIELDS: Record<string, string[]> = {
  dpd: [
    'decision_statement',
    'scope',
    'alternatives',
    'known_risks',
    'unknowns',
    'constraints',
  ],
  agenda: [
    'context_summary',
    'objectives',
    'time_allocations',
  ],
  protocol: [
    'present',
    'decisions_made',
    'action_items',
  ],
  dcs: [
    'what_was_known',
    'what_was_unknown',
    'irreversibility_assessment',
  ],
};

/**
 * Check document for template decay
 */
export function checkTemplateDecay(
  documentId: string,
  documentType: keyof typeof REQUIRED_FIELDS,
  content: Record<string, unknown>,
  historicalDocuments: Array<{
    id: string;
    date: string;
    content: Record<string, unknown>;
  }>
): TemplateDecaySignal {
  const emptyFields = findEmptyFields(documentType, content);
  const copyPasteResult = detectCopyPaste(content, historicalDocuments);
  const reusedFormulations = findReusedFormulations(content, historicalDocuments);
  
  // Calculate decay score
  const decayScore = calculateDecayScore(
    emptyFields.length,
    REQUIRED_FIELDS[documentType]?.length || 0,
    copyPasteResult.detected,
    reusedFormulations.length
  );
  
  return {
    document_id: documentId,
    document_type: documentType as TemplateDecaySignal['document_type'],
    empty_fields: emptyFields,
    copy_paste_detected: copyPasteResult.detected,
    copy_paste_source: copyPasteResult.source,
    reused_formulations: reusedFormulations,
    decay_score: decayScore,
  };
}

/**
 * Find empty required fields
 */
function findEmptyFields(
  documentType: string,
  content: Record<string, unknown>
): string[] {
  const required = REQUIRED_FIELDS[documentType] || [];
  const empty: string[] = [];
  
  for (const field of required) {
    const value = content[field];
    if (isEmpty(value)) {
      empty.push(field);
    }
  }
  
  return empty;
}

function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string' && value.trim() === '') return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (typeof value === 'object' && Object.keys(value as object).length === 0) return true;
  return false;
}

/**
 * Detect copy-paste from historical documents
 */
function detectCopyPaste(
  content: Record<string, unknown>,
  historicalDocuments: Array<{ id: string; date: string; content: Record<string, unknown> }>
): { detected: boolean; source?: string } {
  const contentString = JSON.stringify(content);
  
  for (const historical of historicalDocuments) {
    const historicalString = JSON.stringify(historical.content);
    
    // Check for high similarity (excluding IDs and dates)
    const similarity = calculateSimilarity(contentString, historicalString);
    if (similarity > 0.8) {
      return {
        detected: true,
        source: historical.id,
      };
    }
  }
  
  return { detected: false };
}

/**
 * Simple similarity calculation
 */
function calculateSimilarity(a: string, b: string): number {
  const aWords = new Set(a.toLowerCase().split(/\s+/));
  const bWords = new Set(b.toLowerCase().split(/\s+/));
  
  let intersection = 0;
  for (const word of aWords) {
    if (bWords.has(word)) intersection++;
  }
  
  const union = aWords.size + bWords.size - intersection;
  return intersection / union;
}

/**
 * Find reused formulations
 */
function findReusedFormulations(
  content: Record<string, unknown>,
  historicalDocuments: Array<{ id: string; date: string; content: Record<string, unknown> }>
): TemplateDecaySignal['reused_formulations'] {
  const reused: TemplateDecaySignal['reused_formulations'] = [];
  const contentStrings = extractTextContent(content);
  
  for (const text of contentStrings) {
    if (text.length < 20) continue; // Skip short strings
    
    for (const historical of historicalDocuments) {
      const historicalStrings = extractTextContent(historical.content);
      
      for (const histText of historicalStrings) {
        if (text === histText && text.length > 30) {
          reused.push({
            text: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
            original_document_id: historical.id,
            original_date: historical.date,
          });
        }
      }
    }
  }
  
  return reused;
}

function extractTextContent(obj: unknown): string[] {
  const texts: string[] = [];
  
  if (typeof obj === 'string') {
    texts.push(obj);
  } else if (Array.isArray(obj)) {
    for (const item of obj) {
      texts.push(...extractTextContent(item));
    }
  } else if (typeof obj === 'object' && obj !== null) {
    for (const value of Object.values(obj)) {
      texts.push(...extractTextContent(value));
    }
  }
  
  return texts;
}

/**
 * Calculate overall decay score
 */
function calculateDecayScore(
  emptyFieldCount: number,
  totalRequiredFields: number,
  copyPasteDetected: boolean,
  reusedFormulationCount: number
): number {
  let score = 0;
  
  // Empty fields contribute to decay
  if (totalRequiredFields > 0) {
    score += (emptyFieldCount / totalRequiredFields) * 0.4;
  }
  
  // Copy-paste is major decay
  if (copyPasteDetected) {
    score += 0.4;
  }
  
  // Reused formulations contribute
  score += Math.min(reusedFormulationCount * 0.05, 0.2);
  
  return Math.min(score, 1);
}

/**
 * Validate document can be approved
 */
export function canApproveDocument(
  decaySignal: TemplateDecaySignal
): { can_approve: boolean; blockers: string[] } {
  const blockers: string[] = [];
  
  // Empty required fields block approval
  if (decaySignal.empty_fields.length > 0) {
    blockers.push(`Empty required fields: ${decaySignal.empty_fields.join(', ')}`);
  }
  
  return {
    can_approve: blockers.length === 0,
    blockers,
  };
}

/**
 * TEMPLATE DECAY MASTERPROMPT
 */
export const TEMPLATE_DECAY_MASTERPROMPT = `
You enforce Anti-Template Decay.

PRINCIPLE:
Templates are:
- Fixed in structure
- Open in content

BUT:
- Empty fields cannot be approved
- Copy-paste from previous decisions is flagged
- Reused formulations are visible in metadata

WHAT STOPS DECAY:
1. Required fields must be filled
2. Copy-paste triggers review
3. Originality is measured

DECAY SCORE:
0 = Fresh, original content
1 = Complete copy

WHY THIS MATTERS:
Templates become rituals.
Rituals become empty.
Empty rituals create false confidence.

THE FIX:
Not more templates.
Not stricter enforcement.
Just: visibility of decay.

When people see their originality score declining,
they naturally course-correct.

NO BLAME:
The system shows patterns.
It doesn't accuse.
`;
