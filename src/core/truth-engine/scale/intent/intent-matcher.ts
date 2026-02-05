/**
 * INTENT MATCHER 2.0
 * 
 * LLMs are good at language – bad at responsibility.
 * We separate these.
 * 
 * Three-layer matching:
 * 1. Rules (fast, exact)
 * 2. Embeddings (semantic breadth)
 * 3. Ontology hints (domain + measure)
 */

import type { CanonicalAnswerTypeCode } from '../../usae/mao/canonical-types';
import type { DomainCode } from '../../usae/mao/unified-body';

/**
 * INTENT RESULT
 */
export interface IntentResult {
  readonly matched: boolean;
  readonly packet_id: string | null;
  readonly domain: DomainCode | null;
  readonly answer_type: CanonicalAnswerTypeCode | null;
  readonly confidence: number;
  readonly match_method: 'rule' | 'embedding' | 'ontology' | 'fallback';
  readonly requires_clarification: boolean;
  readonly clarification_prompt?: string;
  readonly alternatives?: readonly IntentAlternative[];
}

/**
 * INTENT ALTERNATIVE
 */
export interface IntentAlternative {
  readonly packet_id: string;
  readonly confidence: number;
  readonly reason: string;
}

/**
 * HARD RULE
 */
export interface HardRule {
  readonly rule_id: string;
  readonly priority: number;
  readonly patterns: readonly RegExp[];
  readonly domain: DomainCode;
  readonly answer_type: CanonicalAnswerTypeCode;
  readonly packet_id: string;
  readonly block?: boolean;
  readonly block_reason?: string;
}

/**
 * EMBEDDING MATCH
 */
interface EmbeddingMatch {
  readonly packet_id: string;
  readonly similarity: number;
  readonly domain: DomainCode;
  readonly answer_type: CanonicalAnswerTypeCode;
}

/**
 * INTENT MATCHER
 */
export class IntentMatcher {
  private rules: HardRule[] = [];
  private embeddings: Map<string, number[]> = new Map();
  private ontologyHints: Map<string, OntologyHint> = new Map();

  constructor() {
    this.registerDefaultRules();
    this.registerOntologyHints();
  }

  /**
   * Match question to intent (main entry point)
   */
  match(question: string, context?: MatchContext): IntentResult {
    const normalized = question.toLowerCase().trim();

    // Layer 1: Hard rules (safety, finance, medical)
    const ruleMatch = this.matchRules(normalized);
    if (ruleMatch) {
      if (ruleMatch.block) {
        return {
          matched: false,
          packet_id: null,
          domain: null,
          answer_type: null,
          confidence: 1.0,
          match_method: 'rule',
          requires_clarification: false,
        };
      }
      return {
        matched: true,
        packet_id: ruleMatch.packet_id,
        domain: ruleMatch.domain,
        answer_type: ruleMatch.answer_type,
        confidence: 0.95,
        match_method: 'rule',
        requires_clarification: false,
      };
    }

    // Layer 2: Embedding similarity → top 5 intents
    const embeddingMatches = this.matchEmbeddings(normalized);
    
    // Layer 3: Ontology fit → best Answer Packet
    const bestMatch = this.selectBestMatch(embeddingMatches, normalized, context);

    if (bestMatch && bestMatch.similarity >= 0.7) {
      return {
        matched: true,
        packet_id: bestMatch.packet_id,
        domain: bestMatch.domain,
        answer_type: bestMatch.answer_type,
        confidence: bestMatch.similarity,
        match_method: 'ontology',
        requires_clarification: false,
        alternatives: embeddingMatches
          .filter(m => m.packet_id !== bestMatch.packet_id)
          .slice(0, 3)
          .map(m => ({
            packet_id: m.packet_id,
            confidence: m.similarity,
            reason: 'Semantic similarity',
          })),
      };
    }

    // Fallback: request clarification
    if (embeddingMatches.length > 0) {
      return {
        matched: false,
        packet_id: null,
        domain: embeddingMatches[0].domain,
        answer_type: null,
        confidence: embeddingMatches[0].similarity,
        match_method: 'fallback',
        requires_clarification: true,
        clarification_prompt: 'Could you be more specific about what you want to know?',
        alternatives: embeddingMatches.slice(0, 5).map(m => ({
          packet_id: m.packet_id,
          confidence: m.similarity,
          reason: 'Possible match',
        })),
      };
    }

    return {
      matched: false,
      packet_id: null,
      domain: null,
      answer_type: null,
      confidence: 0,
      match_method: 'fallback',
      requires_clarification: true,
      clarification_prompt: 'I could not match your question to any known pattern. Please rephrase.',
    };
  }

  /**
   * Register a hard rule
   */
  registerRule(rule: HardRule): void {
    this.rules.push(rule);
    this.rules.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Get matching stats
   */
  getStats(): MatcherStats {
    return {
      total_rules: this.rules.length,
      total_embeddings: this.embeddings.size,
      total_ontology_hints: this.ontologyHints.size,
      blocking_rules: this.rules.filter(r => r.block).length,
    };
  }

  private matchRules(question: string): HardRule | null {
    for (const rule of this.rules) {
      for (const pattern of rule.patterns) {
        if (pattern.test(question)) {
          return rule;
        }
      }
    }
    return null;
  }

  private matchEmbeddings(question: string): EmbeddingMatch[] {
    // Simplified: keyword-based matching (real implementation uses vector similarity)
    const matches: EmbeddingMatch[] = [];
    
    // Domain detection via keywords
    const domainKeywords: Record<DomainCode, string[]> = {
      economy: ['inflation', 'gdp', 'growth', 'economic', 'unemployment', 'interest rate'],
      healthcare: ['hospital', 'doctor', 'wait time', 'health', 'medical', 'patient'],
      youth: ['teenager', 'teen', 'young', 'adolescent', 'puberty', 'school'],
      markets: ['stock', 'index', 'volatility', 'trading', 'market', 'investment'],
      education: ['school', 'university', 'education', 'student', 'learning'],
      labor: ['employment', 'job', 'work', 'salary', 'wage'],
      housing: ['housing', 'rent', 'property', 'home', 'real estate'],
      crime: ['crime', 'safety', 'police', 'theft', 'violence'],
      environment: ['climate', 'pollution', 'environment', 'emissions'],
      migration: ['migration', 'immigration', 'refugee', 'asylum'],
      society: ['society', 'population', 'demographic'],
      substance_use: ['drug', 'alcohol', 'substance', 'addiction'],
      medicine: ['medicine', 'drug', 'treatment', 'pharmaceutical'],
    };

    for (const [domain, keywords] of Object.entries(domainKeywords)) {
      const matchCount = keywords.filter(k => question.includes(k)).length;
      if (matchCount > 0) {
        matches.push({
          packet_id: `${domain}:answer:general:v1`,
          similarity: Math.min(0.5 + matchCount * 0.15, 0.95),
          domain: domain as DomainCode,
          answer_type: 'DESCRIPTIVE_STAT',
        });
      }
    }

    return matches.sort((a, b) => b.similarity - a.similarity);
  }

  private selectBestMatch(
    candidates: EmbeddingMatch[],
    question: string,
    _context?: MatchContext
  ): EmbeddingMatch | null {
    if (candidates.length === 0) return null;

    // Check ontology hints to boost/adjust scores
    for (const candidate of candidates) {
      const hint = this.ontologyHints.get(candidate.domain);
      if (hint) {
        // Boost if ontology keywords match
        const boost = hint.keywords.filter(k => question.includes(k)).length * 0.05;
        return {
          ...candidate,
          similarity: Math.min(candidate.similarity + boost, 1.0),
        };
      }
    }

    return candidates[0];
  }

  private registerDefaultRules(): void {
    // Safety rules (highest priority)
    this.registerRule({
      rule_id: 'crisis_detection',
      priority: 1000,
      patterns: [
        /\b(kill|hurt|harm)\s+(myself|me)\b/i,
        /\bsuicid(e|al)\b/i,
        /\bwant\s+to\s+die\b/i,
      ],
      domain: 'youth',
      answer_type: 'RISK_PREVALENCE',
      packet_id: 'crisis:support:immediate',
    });

    // Block normative questions
    this.registerRule({
      rule_id: 'block_normative',
      priority: 900,
      patterns: [
        /\bshould\s+i\b/i,
        /\bwhat\s+should\b/i,
        /\badvise\s+me\b/i,
      ],
      domain: 'society',
      answer_type: 'DESCRIPTIVE_STAT',
      packet_id: '',
      block: true,
      block_reason: 'Normative questions blocked',
    });

    // Youth anxiety (common pattern)
    this.registerRule({
      rule_id: 'youth_anxiety',
      priority: 100,
      patterns: [
        /\bnormal\s+to\s+(feel\s+)?anxious\b/i,
        /\banxiety\s+(as\s+a\s+)?teenager\b/i,
        /\bteen(ager)?\s+anxiety\b/i,
      ],
      domain: 'youth',
      answer_type: 'RISK_PREVALENCE',
      packet_id: 'youth:answer:feeling_anxious_is_common:v1',
    });

    // Inflation queries
    this.registerRule({
      rule_id: 'inflation_current',
      priority: 80,
      patterns: [
        /\bcurrent\s+inflation\b/i,
        /\binflation\s+rate\b/i,
        /\bwhat\s+is\s+inflation\b/i,
      ],
      domain: 'economy',
      answer_type: 'DESCRIPTIVE_STAT',
      packet_id: 'economy:answer:inflation_current:v1',
    });
  }

  private registerOntologyHints(): void {
    this.ontologyHints.set('economy', {
      domain: 'economy',
      keywords: ['gdp', 'inflation', 'growth', 'recession', 'employment'],
      measures: ['gdp_growth', 'inflation_rate', 'unemployment_rate'],
    });

    this.ontologyHints.set('healthcare', {
      domain: 'healthcare',
      keywords: ['hospital', 'waiting', 'treatment', 'doctor'],
      measures: ['wait_time', 'bed_occupancy', 'patient_count'],
    });

    this.ontologyHints.set('youth', {
      domain: 'youth',
      keywords: ['teenager', 'teen', 'adolescent', 'young', 'puberty'],
      measures: ['prevalence', 'survey_response'],
    });
  }
}

/**
 * ONTOLOGY HINT
 */
interface OntologyHint {
  readonly domain: DomainCode;
  readonly keywords: readonly string[];
  readonly measures: readonly string[];
}

/**
 * MATCH CONTEXT
 */
export interface MatchContext {
  readonly audience_age?: number;
  readonly country?: string;
  readonly previous_questions?: readonly string[];
}

/**
 * MATCHER STATS
 */
export interface MatcherStats {
  readonly total_rules: number;
  readonly total_embeddings: number;
  readonly total_ontology_hints: number;
  readonly blocking_rules: number;
}

/**
 * KPI: % questions requiring clarification (should be low, but not zero)
 */
export const INTENT_MATCH_KPI = {
  target_clarification_rate: 0.15, // 15% is acceptable
  max_clarification_rate: 0.30,    // Above 30% needs investigation
  min_rule_match_rate: 0.40,       // At least 40% should hit hard rules
} as const;
