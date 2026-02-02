/**
 * QUERY FILTER
 * 
 * Identifies and blocks queries that request advice, recommendations,
 * predictions, or individual-level information.
 * 
 * Core principle: The platform describes, never prescribes.
 */

import type { 
  QueryComplianceResult, 
  BlockedQueryPattern, 
  QueryAnalysis,
  QueryIntent 
} from '@/types/compliance';

// Hardcoded patterns for immediate blocking (no DB dependency)
const IMMEDIATE_BLOCK_PATTERNS: BlockedQueryPattern[] = [
  {
    id: 'medical-advice',
    pattern_type: 'medical',
    pattern_regex: '(what|which|how) (should|do|can) (i|we|you|one) (take|use|try|treat)',
    pattern_keywords: ['should I take', 'what medicine', 'which treatment', 'best cure', 'how to treat', 'what drug'],
    block_response_template: 'This platform does not provide medical advice. It shows observed population-level health data. For personal health decisions, consult licensed healthcare professionals.',
    redirect_suggestion: 'You can explore population-level health outcomes and historical trends instead.',
    severity: 'block',
    category: 'medical',
    is_active: true
  },
  {
    id: 'policy-recommendation',
    pattern_type: 'recommendation',
    pattern_regex: '(what|which) (policy|approach|strategy|intervention) (is|would be|should be) (best|better|optimal|recommended)',
    pattern_keywords: ['best policy', 'should implement', 'recommend', 'which approach', 'optimal strategy', 'what works best'],
    block_response_template: 'This platform does not provide policy recommendations. It presents observed outcomes from historical policy periods. Policy decisions require context beyond this data.',
    redirect_suggestion: 'You can explore what was observed during specific policy periods.',
    severity: 'block',
    category: 'policy',
    is_active: true
  },
  {
    id: 'individual-prediction',
    pattern_type: 'individual',
    pattern_regex: '(what|how) (will|would|might) (happen|change|affect) (to|for) (me|my|individual|person)',
    pattern_keywords: ['will I', 'my risk', 'predict for me', 'my chances', 'individual outcome', 'personal risk'],
    block_response_template: 'This platform does not provide individual predictions or risk assessments. All data is aggregated at population level. For individual guidance, consult relevant professionals.',
    redirect_suggestion: 'You can explore population-level statistics for context.',
    severity: 'block',
    category: 'individual',
    is_active: true
  },
  {
    id: 'causation-claim',
    pattern_type: 'prediction',
    pattern_regex: '(will|would|going to) (cause|lead to|result in|create|produce)',
    pattern_keywords: ['will cause', 'going to lead', 'would result', 'future impact', 'will create'],
    block_response_template: 'This platform does not make causal claims or predictions. It shows observed correlations and historical patterns. Causation requires controlled studies beyond observational data.',
    severity: 'warn',
    category: 'predictive',
    is_active: true
  },
  {
    id: 'normative-judgment',
    pattern_type: 'advice',
    pattern_regex: '(is it|would it be|isn\'t it) (good|bad|better|worse|right|wrong|smart|stupid)',
    pattern_keywords: ['is it good', 'would be better', 'right thing', 'wrong approach', 'smart to', 'stupid to'],
    block_response_template: 'This platform does not make normative judgments. It presents observed data without value assessments. Interpretation and evaluation lie outside this system.',
    severity: 'block',
    category: 'policy',
    is_active: true
  },
  {
    id: 'dosage-inquiry',
    pattern_type: 'medical',
    pattern_regex: '(how much|what dose|dosage|how many) (should|to take|is safe|is effective)',
    pattern_keywords: ['how much should', 'what dose', 'safe dosage', 'effective dose', 'how many to take'],
    block_response_template: 'This platform does not provide dosage information or medical guidance. For medication questions, consult licensed healthcare professionals or pharmacists.',
    severity: 'block',
    category: 'medical',
    is_active: true
  },
  {
    id: 'treatment-comparison',
    pattern_type: 'medical',
    pattern_regex: '(which|what) (treatment|medication|drug|therapy) (is|works) (better|best|more effective)',
    pattern_keywords: ['which treatment is better', 'best medication', 'more effective drug', 'works better'],
    block_response_template: 'This platform does not compare treatment effectiveness or provide clinical guidance. It shows population-level health outcomes. For treatment decisions, consult healthcare professionals.',
    severity: 'block',
    category: 'medical',
    is_active: true
  }
];

// Keywords that indicate observational queries (allowed)
const OBSERVATION_KEYWORDS = [
  'what was', 'what were', 'what happened',
  'how did', 'how many', 'how much',
  'during', 'between', 'from', 'to',
  'observed', 'recorded', 'measured',
  'trend', 'pattern', 'change',
  'compare', 'comparison', 'versus',
  'historical', 'over time', 'period'
];

/**
 * Analyze a query to determine its intent and compliance status
 */
export function analyzeQuery(query: string): QueryAnalysis {
  const normalizedQuery = query.toLowerCase().trim();
  const blocked_patterns: string[] = [];
  const warnings: string[] = [];
  let blocked = false;
  
  // Check against immediate block patterns
  for (const pattern of IMMEDIATE_BLOCK_PATTERNS) {
    if (!pattern.is_active) continue;
    
    // Check keywords
    const keywordMatch = pattern.pattern_keywords.some(keyword => 
      normalizedQuery.includes(keyword.toLowerCase())
    );
    
    // Check regex
    let regexMatch = false;
    try {
      const regex = new RegExp(pattern.pattern_regex, 'i');
      regexMatch = regex.test(normalizedQuery);
    } catch {
      // Invalid regex, skip
    }
    
    if (keywordMatch || regexMatch) {
      if (pattern.severity === 'block') {
        blocked = true;
        blocked_patterns.push(pattern.id);
      } else if (pattern.severity === 'warn') {
        warnings.push(pattern.block_response_template);
      }
    }
  }
  
  // Determine intent
  const intent = determineIntent(normalizedQuery, blocked, blocked_patterns);
  
  // Sanitize query (remove problematic framing)
  const sanitized_query = sanitizeQuery(query);
  
  return {
    original_query: query,
    sanitized_query,
    detected_intent: intent,
    blocked,
    block_patterns: blocked_patterns,
    warnings,
    required_scopes: [] // Will be populated by scope manager
  };
}

/**
 * Determine the intent of a query
 */
function determineIntent(query: string, blocked: boolean, patterns: string[]): QueryIntent {
  if (blocked) {
    if (patterns.includes('medical-advice') || patterns.includes('dosage-inquiry') || patterns.includes('treatment-comparison')) {
      return 'medical';
    }
    if (patterns.includes('individual-prediction')) {
      return 'individual';
    }
    if (patterns.includes('policy-recommendation') || patterns.includes('normative-judgment')) {
      return 'recommendation';
    }
    if (patterns.includes('causation-claim')) {
      return 'prediction';
    }
    return 'advice';
  }
  
  // Check for observation patterns
  if (query.includes('what happened') || query.includes('what was') || query.includes('observed')) {
    return 'observation';
  }
  if (query.includes('compare') || query.includes('versus') || query.includes(' vs ')) {
    return 'comparison';
  }
  if (query.includes('trend') || query.includes('over time') || query.includes('change')) {
    return 'trend';
  }
  
  return 'observation'; // Default to most permissive valid intent
}

/**
 * Sanitize a query by removing problematic framing
 */
function sanitizeQuery(query: string): string {
  let sanitized = query;
  
  // Replace advice-seeking framing with observation framing
  const replacements: [RegExp, string][] = [
    [/what should (i|we|you|one) do/gi, 'what has been observed'],
    [/which is (better|best|worse)/gi, 'how do they compare'],
    [/will (it|this|that) (cause|lead to)/gi, 'has it been observed to correlate with'],
    [/is it (good|bad|right|wrong)/gi, 'what has been observed regarding'],
    [/should (i|we|you|one)/gi, 'what has been observed when'],
  ];
  
  for (const [pattern, replacement] of replacements) {
    sanitized = sanitized.replace(pattern, replacement);
  }
  
  return sanitized;
}

/**
 * Check query compliance and return detailed result
 */
export function checkQueryCompliance(query: string): QueryComplianceResult {
  const analysis = analyzeQuery(query);
  
  // Get matching patterns for response
  const matchedPatterns = IMMEDIATE_BLOCK_PATTERNS.filter(p => 
    analysis.block_patterns.includes(p.id)
  );
  
  // Build required disclaimers
  const required_disclaimers: string[] = [
    'This platform does not provide medical advice.',
    'All data is observational and population-level.',
    'Correlation does not imply causation.'
  ];
  
  return {
    allowed: !analysis.blocked,
    blocked_patterns: matchedPatterns,
    warnings: analysis.warnings,
    required_disclaimers,
    scope_citations: [],
    sanitized_query: analysis.sanitized_query
  };
}

/**
 * Get block response for a blocked query
 */
export function getBlockResponse(patterns: string[]): string {
  const matchedPatterns = IMMEDIATE_BLOCK_PATTERNS.filter(p => 
    patterns.includes(p.id)
  );
  
  if (matchedPatterns.length === 0) {
    return 'This query is outside the scope of this platform. Please rephrase as an observational question about historical data.';
  }
  
  // Return the most specific block response
  const medicalPattern = matchedPatterns.find(p => p.category === 'medical');
  if (medicalPattern) {
    return medicalPattern.block_response_template;
  }
  
  return matchedPatterns[0].block_response_template;
}

/**
 * Get redirect suggestion for blocked query
 */
export function getRedirectSuggestion(patterns: string[]): string | undefined {
  const matchedPatterns = IMMEDIATE_BLOCK_PATTERNS.filter(p => 
    patterns.includes(p.id)
  );
  
  return matchedPatterns.find(p => p.redirect_suggestion)?.redirect_suggestion;
}

/**
 * Check if query is an observational question (always allowed)
 */
export function isObservationalQuery(query: string): boolean {
  const normalized = query.toLowerCase();
  return OBSERVATION_KEYWORDS.some(keyword => normalized.includes(keyword));
}
