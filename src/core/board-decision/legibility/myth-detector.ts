/**
 * MYTH DETECTOR
 * 
 * Protection against:
 * - Hero stories
 * - Individual blame
 * - Romanticized "brave decisions"
 * 
 * Decisions are reduced to: context + alternatives + uncertainty + choice
 */

import type { MythIndicator } from './types';

/**
 * Hero narrative patterns
 */
const HERO_PATTERNS = [
  /\b(visionary|bold|brave|courageous|fearless)\s+(decision|choice|leader)/gi,
  /\b(saved|rescued|transformed)\s+the\s+(organization|company|board)/gi,
  /\bagainst\s+all\s+odds\b/gi,
  /\b(single-handedly|alone)\s+(changed|fixed|solved)/gi,
  /\b(modig|djärv|visionär)\s+(beslut|ledare)/gi,
  /\b(räddade|transformerade)\s+(organisationen|bolaget)/gi,
];

/**
 * Blame patterns
 */
const BLAME_PATTERNS = [
  /\b(fault|blame|failure)\s+of\s+\w+/gi,
  /\b(responsible for|caused by)\s+\w+('s)?\s+(incompetence|negligence|mistake)/gi,
  /\bif\s+(only|he|she|they)\s+had\b/gi,
  /\b(skuld|misslyckande)\s+(hos|av)\s+\w+/gi,
  /\bom\s+(bara|hen|de)\s+hade\b/gi,
];

/**
 * Romanticization patterns
 */
const ROMANTICIZATION_PATTERNS = [
  /\b(gamble|bet|risk)\s+that\s+(paid off|worked out)/gi,
  /\b(against\s+the\s+odds|defied\s+expectations)/gi,
  /\b(brilliant|genius|masterful)\s+(move|strategy|decision)/gi,
  /\b(spel|satsning|risk)\s+som\s+(lönade sig|fungerade)/gi,
  /\b(briljant|genial)\s+(drag|strategi|beslut)/gi,
];

/**
 * Retrospective wisdom patterns
 */
const RETROSPECTIVE_PATTERNS = [
  /\bin\s+(hindsight|retrospect)\b/gi,
  /\b(should|could|would)\s+have\s+(known|seen|anticipated)/gi,
  /\b(obvious|clear|evident)\s+in\s+retrospect\b/gi,
  /\bwe\s+(now|finally)\s+(know|understand|see)\b/gi,
  /\bi\s+efterhand\b/gi,
  /\b(borde|kunde|skulle)\s+ha\s+(vetat|sett|förutsett)/gi,
];

/**
 * Scan text for myth indicators
 */
export function detectMythIndicators(
  text: string,
  source: string
): MythIndicator[] {
  const indicators: MythIndicator[] = [];
  const timestamp = new Date().toISOString();
  
  // Check hero narratives
  for (const pattern of HERO_PATTERNS) {
    const matches = text.match(pattern);
    if (matches) {
      for (const match of matches) {
        indicators.push({
          indicator_type: 'hero_narrative',
          description: `Hero narrative detected: "${match}"`,
          source,
          detected_at: timestamp,
        });
      }
    }
  }
  
  // Check blame patterns
  for (const pattern of BLAME_PATTERNS) {
    const matches = text.match(pattern);
    if (matches) {
      for (const match of matches) {
        indicators.push({
          indicator_type: 'individual_blame',
          description: `Blame pattern detected: "${match}"`,
          source,
          detected_at: timestamp,
        });
      }
    }
  }
  
  // Check romanticization
  for (const pattern of ROMANTICIZATION_PATTERNS) {
    const matches = text.match(pattern);
    if (matches) {
      for (const match of matches) {
        indicators.push({
          indicator_type: 'romanticized_risk',
          description: `Romanticization detected: "${match}"`,
          source,
          detected_at: timestamp,
        });
      }
    }
  }
  
  // Check retrospective wisdom
  for (const pattern of RETROSPECTIVE_PATTERNS) {
    const matches = text.match(pattern);
    if (matches) {
      for (const match of matches) {
        indicators.push({
          indicator_type: 'retrospective_wisdom',
          description: `Retrospective wisdom detected: "${match}"`,
          source,
          detected_at: timestamp,
        });
      }
    }
  }
  
  return indicators;
}

/**
 * Sanitize text by removing myth-building language
 */
export function sanitizeMythLanguage(text: string): string {
  let sanitized = text;
  
  const allPatterns = [
    ...HERO_PATTERNS,
    ...BLAME_PATTERNS,
    ...ROMANTICIZATION_PATTERNS,
    ...RETROSPECTIVE_PATTERNS,
  ];
  
  for (const pattern of allPatterns) {
    sanitized = sanitized.replace(pattern, '[REDACTED]');
  }
  
  return sanitized;
}

/**
 * Validate that a summary is myth-free
 */
export function validateMythFree(text: string): {
  valid: boolean;
  indicators: MythIndicator[];
} {
  const indicators = detectMythIndicators(text, 'validation');
  return {
    valid: indicators.length === 0,
    indicators,
  };
}

/**
 * MYTH DETECTOR MASTERPROMPT
 */
export const MYTH_DETECTOR_MASTERPROMPT = `
You detect myth-building language in decision documentation.

MYTHS YOU DETECT:
1. Hero narratives ("visionary leader", "saved the company")
2. Individual blame ("fault of X", "if only they had")
3. Romanticized risk ("bold gamble that paid off")
4. Retrospective wisdom ("obvious in hindsight")

WHY THIS MATTERS:
- Hero stories distort learning
- Blame prevents honest analysis
- Romanticization encourages recklessness
- Retrospective wisdom masks genuine uncertainty

THE ALTERNATIVE:
Decisions reduced to structure:
- Context
- Alternatives considered
- Uncertainties acknowledged
- Choice made

No adjectives. No narratives. No myths.
This is adult decision-making.
`;
