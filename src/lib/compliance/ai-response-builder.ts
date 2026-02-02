/**
 * AI RESPONSE BUILDER
 * 
 * Builds compliant AI responses that always cite scope,
 * include required disclaimers, and never cross into advice territory.
 * 
 * Standard response pattern:
 * "Observed data show X under Y conditions. The data do not establish causation."
 */

import type { 
  AIResponse, 
  AIResponseTemplate, 
  ScopeCitation,
  SafeAIResponse 
} from '@/types/compliance';
import { checkQueryCompliance, getBlockResponse, getRedirectSuggestion } from './query-filter';
import { formatScopeCitationText } from './scope-manager';

// Built-in response templates
const TEMPLATES: Record<string, AIResponseTemplate> = {
  OBSERVATION_STANDARD: {
    id: 'obs-std',
    template_code: 'OBSERVATION_STANDARD',
    template_name: 'Standard Observation Response',
    template_text: 'Observed data from the Truth Layer show {{observation}} under {{conditions}}. The data do not establish causation or recommendations. Source: {{source}}. Confidence: {{confidence}}.',
    required_placeholders: ['observation', 'conditions', 'source', 'confidence'],
    use_when: ['general_query', 'data_request'],
    never_use_when: ['advice_query', 'recommendation_query'],
    translations: {},
    is_active: true
  },
  COMPARISON_STANDARD: {
    id: 'cmp-std',
    template_code: 'COMPARISON_STANDARD',
    template_name: 'Standard Comparison Response',
    template_text: 'Comparison of {{entity_a}} and {{entity_b}} during {{period}}: {{observation}}. This comparison is observational only and does not imply that one approach is preferable. Limitations: {{limitations}}.',
    required_placeholders: ['entity_a', 'entity_b', 'period', 'observation', 'limitations'],
    use_when: ['comparison_query'],
    never_use_when: ['recommendation_query'],
    translations: {},
    is_active: true
  },
  TREND_STANDARD: {
    id: 'trd-std',
    template_code: 'TREND_STANDARD',
    template_name: 'Standard Trend Response',
    template_text: 'During {{period}}, {{metric}} showed {{direction}} of {{magnitude}}. This observation does not predict future trends or establish causation. Context: {{context}}.',
    required_placeholders: ['period', 'metric', 'direction', 'magnitude', 'context'],
    use_when: ['trend_query'],
    never_use_when: ['prediction_query'],
    translations: {},
    is_active: true
  },
  BLOCKED_QUERY: {
    id: 'blk-qry',
    template_code: 'BLOCKED_QUERY',
    template_name: 'Blocked Query Response',
    template_text: 'This query requests {{blocked_type}}, which is outside the scope of this platform. This platform provides: observational data, historical patterns, and population-level statistics. It does not provide: {{not_provided}}.',
    required_placeholders: ['blocked_type', 'not_provided'],
    use_when: ['blocked_query'],
    never_use_when: [],
    translations: {},
    is_active: true
  },
  SCOPE_VIOLATION: {
    id: 'scp-vio',
    template_code: 'SCOPE_VIOLATION',
    template_name: 'Scope Violation Response',
    template_text: 'The requested information is outside the scope of {{scope_name}}. This data covers: {{covers}}. It does not cover: {{does_not_cover}}. Please rephrase your question to ask about observable historical data.',
    required_placeholders: ['scope_name', 'covers', 'does_not_cover'],
    use_when: ['scope_violation'],
    never_use_when: [],
    translations: {},
    is_active: true
  }
};

// Default disclaimers always included
const DEFAULT_DISCLAIMERS = [
  'This platform does not provide medical advice.',
  'All data is observational and population-level.',
  'Correlation does not imply causation.',
  'For individual decisions, consult licensed professionals.'
];

/**
 * Build a compliant AI response
 */
export function buildAIResponse(
  query: string,
  templateCode: string,
  placeholders: Record<string, string>,
  scopeCitations: ScopeCitation[] = []
): AIResponse {
  // First check query compliance
  const compliance = checkQueryCompliance(query);
  
  if (!compliance.allowed) {
    return buildBlockedResponse(compliance.blocked_patterns.map(p => p.id));
  }
  
  // Get template
  const template = TEMPLATES[templateCode];
  if (!template) {
    return buildBlockedResponse(['unknown_template']);
  }
  
  // Fill template
  let responseText = template.template_text;
  for (const [key, value] of Object.entries(placeholders)) {
    responseText = responseText.replace(`{{${key}}}`, value);
  }
  
  // Add scope citations
  if (scopeCitations.length > 0) {
    const citationText = scopeCitations
      .map(formatScopeCitationText)
      .join(' ');
    responseText = `${responseText}\n\n${citationText}`;
  }
  
  return {
    template_code: templateCode,
    response_text: responseText,
    scope_citations: scopeCitations,
    disclaimers: DEFAULT_DISCLAIMERS,
    blocked: false
  };
}

/**
 * Build a blocked response
 */
export function buildBlockedResponse(patterns: string[]): AIResponse {
  const blockResponse = getBlockResponse(patterns);
  const redirect = getRedirectSuggestion(patterns);
  
  let responseText = blockResponse;
  if (redirect) {
    responseText += `\n\n${redirect}`;
  }
  
  return {
    template_code: 'BLOCKED_QUERY',
    response_text: responseText,
    scope_citations: [],
    disclaimers: DEFAULT_DISCLAIMERS,
    blocked: true,
    block_reason: patterns.join(', ')
  };
}

/**
 * Create safe AI response wrapper with full compliance metadata
 */
export function createSafeAIResponse<T>(
  data: T,
  scopeCitations: ScopeCitation[],
  query: string
): SafeAIResponse<T> {
  const compliance = checkQueryCompliance(query);
  
  // Generate hashes for audit
  const requestHash = hashString(query);
  const responseHash = hashString(JSON.stringify(data));
  
  if (!compliance.allowed) {
    return {
      success: false,
      blocked: true,
      block_reason: getBlockResponse(compliance.blocked_patterns.map(p => p.id)),
      redirect_suggestion: getRedirectSuggestion(compliance.blocked_patterns.map(p => p.id)),
      scope_cited: false,
      scope_declarations: [],
      disclaimers_included: DEFAULT_DISCLAIMERS,
      request_hash: requestHash,
      response_hash: responseHash,
      timestamp: new Date().toISOString()
    };
  }
  
  return {
    success: true,
    data,
    blocked: false,
    scope_cited: scopeCitations.length > 0,
    scope_declarations: scopeCitations,
    disclaimers_included: DEFAULT_DISCLAIMERS,
    request_hash: requestHash,
    response_hash: responseHash,
    timestamp: new Date().toISOString()
  };
}

/**
 * Build observation response (most common)
 */
export function buildObservationResponse(
  observation: string,
  conditions: string,
  source: string,
  confidence: string,
  scopeCitations: ScopeCitation[] = []
): AIResponse {
  return buildAIResponse(
    observation, // Query is the observation itself for compliance check
    'OBSERVATION_STANDARD',
    { observation, conditions, source, confidence },
    scopeCitations
  );
}

/**
 * Build comparison response
 */
export function buildComparisonResponse(
  entityA: string,
  entityB: string,
  period: string,
  observation: string,
  limitations: string,
  scopeCitations: ScopeCitation[] = []
): AIResponse {
  return buildAIResponse(
    `compare ${entityA} ${entityB}`,
    'COMPARISON_STANDARD',
    { 
      entity_a: entityA, 
      entity_b: entityB, 
      period, 
      observation, 
      limitations 
    },
    scopeCitations
  );
}

/**
 * Build trend response
 */
export function buildTrendResponse(
  period: string,
  metric: string,
  direction: string,
  magnitude: string,
  context: string,
  scopeCitations: ScopeCitation[] = []
): AIResponse {
  return buildAIResponse(
    `trend in ${metric}`,
    'TREND_STANDARD',
    { period, metric, direction, magnitude, context },
    scopeCitations
  );
}

/**
 * Simple string hash for audit purposes
 */
function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
}

/**
 * Get all available templates
 */
export function getAvailableTemplates(): AIResponseTemplate[] {
  return Object.values(TEMPLATES);
}

/**
 * Add required disclaimers to any text
 */
export function addDisclaimers(text: string, additionalDisclaimers: string[] = []): string {
  const allDisclaimers = [...DEFAULT_DISCLAIMERS, ...additionalDisclaimers];
  const disclaimerText = allDisclaimers
    .map(d => `• ${d}`)
    .join('\n');
  
  return `${text}\n\n---\nImportant:\n${disclaimerText}`;
}
