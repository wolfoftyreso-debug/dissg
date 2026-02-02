/**
 * QA PROMPT VALIDATOR
 * 
 * Validerar all AI-output mot Monster-Masterprompt.
 * Används för intern QA och självgranskning.
 */

import { TRANSPARENCY_LAYER_PROMPT, validateOutput, type QAValidationResult } from '@/config/masterPromptConfig';

export interface FullQAReport {
  timestamp: string;
  inputText: string;
  validation: QAValidationResult;
  languageAnalysis: {
    forbiddenWordsFound: string[];
    permittedWordsUsed: string[];
    neutralityScore: number;
  };
  structureAnalysis: {
    blocksFound: string[];
    blocksMissing: string[];
    completeness: number;
  };
  recommendations: string[];
}

/**
 * Performs full QA validation on AI output
 */
export function performFullQA(text: string): FullQAReport {
  const textLower = text.toLowerCase();
  
  // Language analysis
  const forbiddenWordsFound = TRANSPARENCY_LAYER_PROMPT.languageRules.forbidden.filter(
    word => textLower.includes(word.toLowerCase())
  );
  
  const permittedWordsUsed = TRANSPARENCY_LAYER_PROMPT.languageRules.permitted.filter(
    word => textLower.includes(word.toLowerCase())
  );

  // Calculate neutrality score (higher = more neutral)
  const neutralityScore = Math.max(0, 100 - (forbiddenWordsFound.length * 15));

  // Structure analysis
  const blockPatterns: Record<string, RegExp> = {
    scope: /scope|what|where|when|sources?/i,
    observed_changes: /observed|changes?|changed/i,
    relative_context: /relative|context|comparison|compared|history|peers?/i,
    comovement: /co-?movement|simultaneously|coincided|alternatives?/i,
    stability: /stability|sensitivity|robust|pattern/i,
    limits: /limits?|non-?claims?|does not|uncertainty/i,
  };

  const blocksFound = Object.entries(blockPatterns)
    .filter(([, regex]) => regex.test(text))
    .map(([id]) => id);

  const allBlockIds = TRANSPARENCY_LAYER_PROMPT.outputStructure.mandatoryBlocks.map(b => b.id);
  const blocksMissing = allBlockIds.filter(id => !blocksFound.includes(id));
  
  const completeness = (blocksFound.length / allBlockIds.length) * 100;

  // Base validation
  const validation = validateOutput(text, blocksFound);

  // Generate recommendations
  const recommendations: string[] = [];
  
  if (forbiddenWordsFound.length > 0) {
    recommendations.push(`Remove forbidden expressions: ${forbiddenWordsFound.join(', ')}`);
  }
  
  if (blocksMissing.length > 0) {
    const missingTitles = TRANSPARENCY_LAYER_PROMPT.outputStructure.mandatoryBlocks
      .filter(b => blocksMissing.includes(b.id))
      .map(b => b.title);
    recommendations.push(`Add missing blocks: ${missingTitles.join(', ')}`);
  }
  
  if (permittedWordsUsed.length < 3) {
    recommendations.push('Use more permitted neutral expressions for clarity');
  }

  if (!text.includes(TRANSPARENCY_LAYER_PROMPT.mandatoryDisclaimer.en) && 
      !text.includes(TRANSPARENCY_LAYER_PROMPT.mandatoryDisclaimer.sv)) {
    recommendations.push('Include the mandatory closing disclaimer');
  }

  return {
    timestamp: new Date().toISOString(),
    inputText: text,
    validation,
    languageAnalysis: {
      forbiddenWordsFound,
      permittedWordsUsed,
      neutralityScore,
    },
    structureAnalysis: {
      blocksFound,
      blocksMissing,
      completeness,
    },
    recommendations,
  };
}

/**
 * Quick check if output passes minimum QA standards
 */
export function passesMinimumQA(text: string): boolean {
  const report = performFullQA(text);
  return (
    report.validation.isValid &&
    report.languageAnalysis.neutralityScore >= 70 &&
    report.structureAnalysis.completeness >= 50
  );
}

/**
 * Get the transparency layer prompt config for external use
 */
export function getTransparencyLayerPrompt() {
  return TRANSPARENCY_LAYER_PROMPT;
}
