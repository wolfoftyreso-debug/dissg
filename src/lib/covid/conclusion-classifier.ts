/**
 * COVID-19 REALITY LAYER - Conclusion Classifier
 * Classifies and blocks invalid conclusion types
 */

import { supabase } from '@/integrations/supabase/client';
import type { CovidConclusionType } from '@/types/covid';

export interface ConclusionValidation {
  isAllowed: boolean;
  conclusionType: string;
  templateText: string;
  blockedPhrases: string[];
  suggestion?: string;
}

// Cached conclusion types
let cachedConclusionTypes: CovidConclusionType[] | null = null;

/**
 * Load conclusion types from database
 */
async function loadConclusionTypes(): Promise<CovidConclusionType[]> {
  if (cachedConclusionTypes) return cachedConclusionTypes;

  const { data, error } = await supabase
    .from('covid_conclusion_types')
    .select('*');

  if (error) throw error;

  cachedConclusionTypes = (data || []).map(row => ({
    id: row.id,
    conclusionType: row.conclusion_type,
    isAllowed: row.is_allowed,
    templateText: row.template_text,
    requiresConditions: row.requires_conditions || [],
    forbiddenPhrases: row.forbidden_phrases || [],
  }));

  return cachedConclusionTypes;
}

/**
 * Check if a statement contains forbidden phrases
 */
export async function validateStatement(statement: string): Promise<ConclusionValidation> {
  const types = await loadConclusionTypes();
  const lowerStatement = statement.toLowerCase();

  // Check for forbidden phrases from blocked conclusion types
  for (const type of types) {
    if (!type.isAllowed) {
      const foundPhrases = type.forbiddenPhrases.filter(phrase => 
        lowerStatement.includes(phrase.toLowerCase())
      );
      
      if (foundPhrases.length > 0) {
        return {
          isAllowed: false,
          conclusionType: type.conclusionType,
          templateText: type.templateText,
          blockedPhrases: foundPhrases,
          suggestion: getSuggestionForBlockedType(type.conclusionType),
        };
      }
    }
  }

  // Statement is allowed
  return {
    isAllowed: true,
    conclusionType: 'valid_observation',
    templateText: statement,
    blockedPhrases: [],
  };
}

/**
 * Get allowed conclusion template
 */
export async function getAllowedConclusionTemplate(
  conclusionType: 'observed_association' | 'temporal_comovement' | 'outcome_difference'
): Promise<string> {
  const types = await loadConclusionTypes();
  const found = types.find(t => t.conclusionType === conclusionType && t.isAllowed);
  return found?.templateText || '';
}

/**
 * Format a conclusion using allowed template
 */
export function formatAllowedConclusion(
  template: string,
  variables: Record<string, string>
): string {
  let result = template;
  for (const [key, value] of Object.entries(variables)) {
    result = result.replace(`{${key}}`, value);
  }
  return result;
}

function getSuggestionForBlockedType(type: string): string {
  const suggestions: Record<string, string> = {
    causal_claim: 'Instead of claiming causation, describe the observed association or temporal co-movement.',
    policy_judgment: 'Instead of judging policy success or failure, describe the observed outcomes during different policy periods.',
  };
  return suggestions[type] || 'Rephrase using only observational language.';
}

/**
 * Pre-defined allowed conclusion templates
 */
export const ALLOWED_CONCLUSIONS = {
  association: {
    template: 'An association was observed between {X} and {Y} during {period}.',
    example: 'An association was observed between testing volume and confirmed cases during March-April 2020.',
  },
  comovement: {
    template: '{X} and {Y} moved together during {period}. This temporal pattern does not establish causation.',
    example: 'Hospitalizations and deaths moved together during the spring wave. This temporal pattern does not establish causation.',
  },
  difference: {
    template: 'Outcomes differed between {A} and {B} under {conditions}. Multiple confounding factors may explain this difference.',
    example: 'Outcomes differed between Sweden and Norway under comparable demographic conditions. Multiple confounding factors may explain this difference.',
  },
};

/**
 * Blocked phrases that trigger automatic rejection
 */
export const BLOCKED_PHRASES = [
  'proves that',
  'caused by',
  'resulted in',
  'led to',
  'because of',
  'therefore',
  'thus proving',
  'demonstrating that',
  'should have',
  'was right',
  'was wrong',
  'correct policy',
  'failed policy',
  'worked because',
  'success of',
  'failure of',
  'better than',
  'worse than',
];

/**
 * Standard disclaimer for all COVID conclusions
 */
export const COVID_CONCLUSION_DISCLAIMER = {
  sv: 'Dessa observationer baseras på rapporterade data med kända begränsningar. Korrelation innebär inte kausalitet. För metodologiska detaljer, se datakällorna.',
  en: 'These observations are based on reported data with known limitations. Correlation does not imply causation. For methodological details, see the data sources.',
};
