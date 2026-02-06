/**
 * AGENT QUERY PROFILES
 * 
 * STEG 17: AI-AGENT ROUTING
 * 
 * AI-agenter ställer inte frågor som människor.
 * De bryter ner problem, testar formuleringar, väljer säkraste träff.
 * 
 * Agenten hittar rätt CQ direkt, utan fallback.
 */

import type { AIAgentClass } from '../questions/ai-agent-questions';
import type { UserIntent, QueryTemplateCategory } from './problem-objects';
import type { DomainCode } from '../questions/global-question-types';

/**
 * Agent Query Profile
 * Defines how a specific AI agent class interacts with the query system
 */
export interface AgentQueryProfile {
  readonly agent_class: AIAgentClass;
  readonly name_en: string;
  readonly name_sv: string;
  
  // Intent preferences
  readonly preferred_intents: UserIntent[];
  readonly neutral_intents: UserIntent[];
  readonly forbidden_intents: UserIntent[];
  
  // Template preferences
  readonly preferred_templates: QueryTemplateCategory[];
  readonly template_weights: Record<QueryTemplateCategory, number>;
  
  // Domain affinities
  readonly primary_domains: DomainCode[];
  readonly secondary_domains: DomainCode[];
  readonly excluded_domains: DomainCode[];
  
  // Query behavior
  readonly prefers_quantitative: boolean;
  readonly prefers_comparative: boolean;
  readonly prefers_time_series: boolean;
  readonly max_uncertainty_tolerance: number; // 0-1, lower = stricter
  
  // Output preferences
  readonly preferred_formats: OutputFormat[];
  readonly citation_requirements: CitationRequirement;
  readonly requires_methodology: boolean;
}

/**
 * Output formats supported
 */
export type OutputFormat = 
  | 'json'           // Structured data
  | 'markdown'       // Human-readable with formatting
  | 'plain_text'     // Simple text
  | 'table'          // Tabular data
  | 'chart_data'     // Data formatted for visualization
  | 'api_response';  // Standard API response format

/**
 * Citation requirements
 */
export type CitationRequirement = 
  | 'none'           // No citation needed
  | 'inline'         // Inline citations
  | 'footnote'       // Footnote-style
  | 'full_source'    // Complete source details
  | 'academic';      // Academic citation format

/**
 * AGENT QUERY PROFILES - Full Definitions
 */
export const AGENT_QUERY_PROFILES: AgentQueryProfile[] = [
  // ========== POLICY AGENT ==========
  {
    agent_class: 'policy',
    name_en: 'Policy & Government AI',
    name_sv: 'Policy & Myndighets-AI',
    
    preferred_intents: [
      'understand_trend',
      'compare_entities',
      'assess_distribution',
      'measure_stability',
      'assess_dependency',
    ],
    neutral_intents: [
      'assess_level',
      'historical_reference',
      'find_extremes',
    ],
    forbidden_intents: [
      'project_trajectory', // Policy AI should not speculate
    ],
    
    preferred_templates: ['trend', 'comparison', 'level', 'ranking'],
    template_weights: {
      trend: 0.95,
      comparison: 0.90,
      level: 0.85,
      ranking: 0.80,
      extremes: 0.70,
      normal_range: 0.65,
      anomaly: 0.60,
      historical: 0.75,
      dependency: 0.85,
      correlation: 0.70,
    },
    
    primary_domains: ['DEMO', 'GOV', 'TAX', 'WELFARE', 'EDU', 'MIGRATION', 'CLIMATE'],
    secondary_domains: ['HEALTH', 'LABOR', 'HOUSING', 'TRANSPORT'],
    excluded_domains: ['CRYPTO'],
    
    prefers_quantitative: true,
    prefers_comparative: true,
    prefers_time_series: true,
    max_uncertainty_tolerance: 0.3, // Low tolerance for uncertainty
    
    preferred_formats: ['json', 'table', 'markdown'],
    citation_requirements: 'full_source',
    requires_methodology: true,
  },
  
  // ========== JOURNALISM AGENT ==========
  {
    agent_class: 'journalism',
    name_en: 'Journalism & Research AI',
    name_sv: 'Journalistik & Forsknings-AI',
    
    preferred_intents: [
      'compare_entities',
      'detect_anomaly',
      'find_extremes',
      'find_precedent',
      'historical_reference',
    ],
    neutral_intents: [
      'understand_trend',
      'assess_level',
    ],
    forbidden_intents: [
      'project_trajectory',
    ],
    
    preferred_templates: ['comparison', 'ranking', 'anomaly', 'historical'],
    template_weights: {
      trend: 0.75,
      comparison: 0.95,
      level: 0.70,
      ranking: 0.90,
      extremes: 0.85,
      normal_range: 0.80,
      anomaly: 0.95,
      historical: 0.90,
      dependency: 0.65,
      correlation: 0.60,
    },
    
    primary_domains: ['CRIME', 'INEQUALITY', 'GOV', 'HEALTH'],
    secondary_domains: ['ECON', 'LABOR', 'HOUSING', 'MIGRATION'],
    excluded_domains: [],
    
    prefers_quantitative: true,
    prefers_comparative: true,
    prefers_time_series: true,
    max_uncertainty_tolerance: 0.4,
    
    preferred_formats: ['markdown', 'table', 'plain_text'],
    citation_requirements: 'full_source',
    requires_methodology: true,
  },
  
  // ========== FINANCE AGENT ==========
  {
    agent_class: 'finance',
    name_en: 'Finance & Macro AI',
    name_sv: 'Finans & Makro-AI',
    
    preferred_intents: [
      'understand_trend',
      'compare_entities',
      'assess_level',
      'find_correlation',
      'measure_stability',
    ],
    neutral_intents: [
      'find_extremes',
      'detect_anomaly',
    ],
    forbidden_intents: [
      'project_trajectory', // Must not speculate
    ],
    
    preferred_templates: ['trend', 'comparison', 'level', 'correlation'],
    template_weights: {
      trend: 0.95,
      comparison: 0.90,
      level: 0.95,
      ranking: 0.75,
      extremes: 0.70,
      normal_range: 0.80,
      anomaly: 0.85,
      historical: 0.80,
      dependency: 0.90,
      correlation: 0.95,
    },
    
    primary_domains: ['ECON', 'LABOR', 'HOUSING', 'TRADE', 'CONSUME', 'PENSION', 'CRYPTO'],
    secondary_domains: ['TAX', 'BUSINESS', 'ENERGY'],
    excluded_domains: [],
    
    prefers_quantitative: true,
    prefers_comparative: true,
    prefers_time_series: true,
    max_uncertainty_tolerance: 0.2, // Very low tolerance
    
    preferred_formats: ['json', 'chart_data', 'api_response'],
    citation_requirements: 'inline',
    requires_methodology: true,
  },
  
  // ========== CORPORATE AGENT ==========
  {
    agent_class: 'corporate',
    name_en: 'Corporate & Strategy AI',
    name_sv: 'Företags & Strategi-AI',
    
    preferred_intents: [
      'compare_entities',
      'assess_level',
      'understand_structure',
      'assess_distribution',
    ],
    neutral_intents: [
      'understand_trend',
      'find_extremes',
    ],
    forbidden_intents: [
      'project_trajectory',
    ],
    
    preferred_templates: ['comparison', 'level', 'ranking'],
    template_weights: {
      trend: 0.70,
      comparison: 0.95,
      level: 0.90,
      ranking: 0.85,
      extremes: 0.75,
      normal_range: 0.70,
      anomaly: 0.60,
      historical: 0.65,
      dependency: 0.80,
      correlation: 0.70,
    },
    
    primary_domains: ['BUSINESS', 'ENERGY', 'TECH', 'TRANSPORT', 'RND'],
    secondary_domains: ['TAX', 'LABOR', 'TRADE'],
    excluded_domains: [],
    
    prefers_quantitative: true,
    prefers_comparative: true,
    prefers_time_series: false,
    max_uncertainty_tolerance: 0.4,
    
    preferred_formats: ['json', 'table', 'markdown'],
    citation_requirements: 'inline',
    requires_methodology: false,
  },
  
  // ========== HEALTH AGENT ==========
  {
    agent_class: 'health',
    name_en: 'Health & Social Systems AI',
    name_sv: 'Hälso & Socialsystems-AI',
    
    preferred_intents: [
      'understand_trend',
      'compare_entities',
      'assess_level',
      'assess_distribution',
      'detect_anomaly',
    ],
    neutral_intents: [
      'find_extremes',
      'historical_reference',
    ],
    forbidden_intents: [
      'project_trajectory',
    ],
    
    preferred_templates: ['trend', 'comparison', 'level', 'anomaly'],
    template_weights: {
      trend: 0.90,
      comparison: 0.85,
      level: 0.90,
      ranking: 0.70,
      extremes: 0.65,
      normal_range: 0.85,
      anomaly: 0.90,
      historical: 0.75,
      dependency: 0.80,
      correlation: 0.85,
    },
    
    primary_domains: ['HEALTH', 'WELFARE', 'FOOD', 'ADDICTION'],
    secondary_domains: ['DEMO', 'INEQUALITY', 'HOUSING'],
    excluded_domains: ['CRYPTO', 'TRADE'],
    
    prefers_quantitative: true,
    prefers_comparative: true,
    prefers_time_series: true,
    max_uncertainty_tolerance: 0.25,
    
    preferred_formats: ['json', 'table', 'chart_data'],
    citation_requirements: 'full_source',
    requires_methodology: true,
  },
  
  // ========== LEGAL AGENT ==========
  {
    agent_class: 'legal',
    name_en: 'Legal & Compliance AI',
    name_sv: 'Juridik & Compliance-AI',
    
    preferred_intents: [
      'assess_level',
      'compare_entities',
      'understand_structure',
      'historical_reference',
    ],
    neutral_intents: [
      'understand_trend',
    ],
    forbidden_intents: [
      'project_trajectory',
      'detect_anomaly', // Legal AI needs facts, not interpretations
    ],
    
    preferred_templates: ['level', 'comparison', 'historical'],
    template_weights: {
      trend: 0.60,
      comparison: 0.85,
      level: 0.95,
      ranking: 0.70,
      extremes: 0.50,
      normal_range: 0.40,
      anomaly: 0.30,
      historical: 0.90,
      dependency: 0.75,
      correlation: 0.40,
    },
    
    primary_domains: ['TAX', 'CRIME', 'GOV', 'PROCUREMENT'],
    secondary_domains: ['LABOR', 'BUSINESS'],
    excluded_domains: ['CRYPTO', 'ADDICTION'],
    
    prefers_quantitative: true,
    prefers_comparative: false,
    prefers_time_series: false,
    max_uncertainty_tolerance: 0.15, // Very strict
    
    preferred_formats: ['json', 'markdown', 'api_response'],
    citation_requirements: 'academic',
    requires_methodology: true,
  },
  
  // ========== GENERAL AGENT ==========
  {
    agent_class: 'general',
    name_en: 'General / Public AI',
    name_sv: 'Allmän / Publik AI',
    
    preferred_intents: [
      'assess_level',
      'compare_entities',
      'understand_normal',
    ],
    neutral_intents: [
      'understand_trend',
      'find_extremes',
      'historical_reference',
    ],
    forbidden_intents: [
      'project_trajectory',
      'assess_dependency',
      'find_correlation',
    ],
    
    preferred_templates: ['level', 'comparison', 'ranking'],
    template_weights: {
      trend: 0.70,
      comparison: 0.85,
      level: 0.95,
      ranking: 0.80,
      extremes: 0.75,
      normal_range: 0.70,
      anomaly: 0.50,
      historical: 0.60,
      dependency: 0.40,
      correlation: 0.35,
    },
    
    primary_domains: ['DEMO', 'EDU', 'CONSUME', 'INTERNET'],
    secondary_domains: ['HEALTH', 'LABOR', 'HOUSING'],
    excluded_domains: [],
    
    prefers_quantitative: false,
    prefers_comparative: true,
    prefers_time_series: false,
    max_uncertainty_tolerance: 0.5, // More tolerant
    
    preferred_formats: ['markdown', 'plain_text', 'table'],
    citation_requirements: 'inline',
    requires_methodology: false,
  },
];

/**
 * Get profile by agent class
 */
export function getAgentProfile(agentClass: AIAgentClass): AgentQueryProfile | undefined {
  return AGENT_QUERY_PROFILES.find(p => p.agent_class === agentClass);
}

/**
 * Score a query for a specific agent
 * Returns 0-1 indicating how suitable this query is for the agent
 */
export function scoreQueryForAgent(
  agentClass: AIAgentClass,
  intent: UserIntent,
  domain: DomainCode,
  templateCategory: QueryTemplateCategory,
  uncertaintyLevel: number
): number {
  const profile = getAgentProfile(agentClass);
  if (!profile) return 0.5;
  
  let score = 0.5;
  
  // Intent scoring
  if (profile.preferred_intents.includes(intent)) score += 0.2;
  else if (profile.forbidden_intents.includes(intent)) score -= 0.5;
  else if (profile.neutral_intents.includes(intent)) score += 0.05;
  
  // Domain scoring
  if (profile.primary_domains.includes(domain)) score += 0.15;
  else if (profile.secondary_domains.includes(domain)) score += 0.08;
  else if (profile.excluded_domains.includes(domain)) score -= 0.3;
  
  // Template scoring
  const templateWeight = profile.template_weights[templateCategory] || 0.5;
  score += (templateWeight - 0.5) * 0.3;
  
  // Uncertainty check
  if (uncertaintyLevel > profile.max_uncertainty_tolerance) {
    score -= (uncertaintyLevel - profile.max_uncertainty_tolerance) * 0.5;
  }
  
  return Math.max(0, Math.min(1, score));
}

/**
 * Find best agent for a query
 */
export function findBestAgentForQuery(
  intent: UserIntent,
  domain: DomainCode,
  templateCategory: QueryTemplateCategory,
  uncertaintyLevel: number
): { agent: AIAgentClass; score: number }[] {
  const scores = AGENT_QUERY_PROFILES.map(profile => ({
    agent: profile.agent_class,
    score: scoreQueryForAgent(
      profile.agent_class,
      intent,
      domain,
      templateCategory,
      uncertaintyLevel
    ),
  }));
  
  return scores.sort((a, b) => b.score - a.score);
}

/**
 * Route query to canonical question
 * Returns the best CQ ID for this agent's query
 */
export interface QueryRoutingResult {
  readonly agent_class: AIAgentClass;
  readonly canonical_question_id: string;
  readonly confidence: number;
  readonly alternative_cqs: string[];
  readonly warnings: string[];
}

/**
 * THE KEY INSIGHT
 * 
 * AI-agenter:
 * - bryter ner problem
 * - testar flera formuleringar
 * - väljer säkraste träffen
 * 
 * Med agent profiles:
 * - Agenten hittar rätt CQ direkt
 * - Utan fallback
 * - Utan gissning
 * 
 * De slutar formulera egna frågor.
 * De mappar direkt mot era problem-ID:n.
 */
export const AGENT_ROUTING_PRINCIPLES = {
  agents_dont_ask_like_humans: true,
  agents_decompose_problems: true,
  agents_test_formulations: true,
  agents_pick_safest_hit: true,
  direct_mapping_to_cq: true,
  no_fallback_needed: true,
} as const;

/**
 * Get agent routing statistics
 */
export function getAgentRoutingStats() {
  return {
    total_profiles: AGENT_QUERY_PROFILES.length,
    profiles_by_class: AGENT_QUERY_PROFILES.map(p => ({
      class: p.agent_class,
      preferred_intents: p.preferred_intents.length,
      forbidden_intents: p.forbidden_intents.length,
      primary_domains: p.primary_domains.length,
      uncertainty_tolerance: p.max_uncertainty_tolerance,
    })),
    strictest_agent: AGENT_QUERY_PROFILES.reduce((min, p) => 
      p.max_uncertainty_tolerance < min.max_uncertainty_tolerance ? p : min
    ).agent_class,
    most_tolerant_agent: AGENT_QUERY_PROFILES.reduce((max, p) => 
      p.max_uncertainty_tolerance > max.max_uncertainty_tolerance ? p : max
    ).agent_class,
  };
}
