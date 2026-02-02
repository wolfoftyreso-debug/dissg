/**
 * 🔒 AI Data Filter
 * 
 * Filters AI responses to ensure they are backed by verified data.
 * Blocks speculative, causal, or unsupported claims.
 */

import type {
  AIDataFilter,
  AIClaimValidation,
  VerificationProof,
} from '@/types/realityOnly';
import { AI_RESPONSE_PATTERNS } from '@/types/realityOnly';
import { generateVerificationProof } from './dataValidator';

// ============================================
// CLAIM DETECTION
// ============================================

interface DataPoint {
  indicatorId: string;
  value: number;
  date: string;
  source: string;
  confidence: number;
}

interface DataContext {
  availableIndicators: string[];
  latestData: Record<string, DataPoint>;
  timeRange: { start: string; end: string };
}

/**
 * Extract claims from AI response text
 */
export function extractClaims(text: string): string[] {
  // Split by sentences
  const sentences = text.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 10);
  
  // Filter to sentences that make factual claims
  const claims = sentences.filter(sentence => {
    const lower = sentence.toLowerCase();
    
    // Contains quantitative claims
    const hasNumbers = /\d+/.test(sentence);
    
    // Contains comparison words
    const hasComparison = /higher|lower|more|less|increased|decreased|grew|fell|rose|dropped/.test(lower);
    
    // Contains state words
    const hasState = /is|are|was|were|has|have/.test(lower);
    
    return hasNumbers || hasComparison || (hasState && sentence.length > 30);
  });
  
  return claims;
}

/**
 * Check if text contains forbidden patterns
 */
export function containsForbiddenPatterns(text: string): {
  hasForbidden: boolean;
  patterns: string[];
} {
  const foundPatterns: string[] = [];
  const lower = text.toLowerCase();
  
  for (const pattern of AI_RESPONSE_PATTERNS.forbidden) {
    if (lower.includes(pattern.toLowerCase())) {
      foundPatterns.push(pattern);
    }
  }
  
  return {
    hasForbidden: foundPatterns.length > 0,
    patterns: foundPatterns,
  };
}

/**
 * Check if text follows allowed patterns
 */
export function followsAllowedPatterns(text: string): boolean {
  const lower = text.toLowerCase();
  
  return AI_RESPONSE_PATTERNS.allowed.some(
    pattern => lower.includes(pattern.toLowerCase().split('[')[0]) // Match base pattern
  );
}

// ============================================
// CLAIM VALIDATION
// ============================================

/**
 * Validate a single claim against available data
 */
export function validateClaim(
  claim: string,
  dataContext: DataContext
): AIClaimValidation {
  // Check for forbidden patterns first
  const forbidden = containsForbiddenPatterns(claim);
  if (forbidden.hasForbidden) {
    return {
      hasDataBacking: false,
      backingStrength: 'none',
      rejection: {
        reason: 'speculative',
        suggestion: `Remove speculative language: ${forbidden.patterns.join(', ')}`,
        alternatives: [
          'Rephrase using "Observed data indicates..."',
          'Add citation: "According to [source]..."',
        ],
      },
    };
  }
  
  // Extract potential indicator references from claim
  const indicatorMatches = findIndicatorReferences(claim, dataContext.availableIndicators);
  
  if (indicatorMatches.length === 0) {
    return {
      hasDataBacking: false,
      backingStrength: 'weak',
      rejection: {
        reason: 'no_data',
        suggestion: 'Claim references no known data indicators.',
        alternatives: [
          'Reference specific indicators available in the system.',
          'Provide source citation for external claims.',
        ],
      },
    };
  }
  
  // Check if we have recent data for referenced indicators
  const supportingData: DataPoint[] = [];
  for (const indicatorId of indicatorMatches) {
    const data = dataContext.latestData[indicatorId];
    if (data) {
      supportingData.push(data);
    }
  }
  
  if (supportingData.length === 0) {
    return {
      hasDataBacking: false,
      backingStrength: 'none',
      rejection: {
        reason: 'insufficient_data',
        suggestion: 'Referenced indicators have no available data.',
      },
    };
  }
  
  // Check data staleness
  const mostRecentDate = new Date(Math.max(...supportingData.map(d => new Date(d.date).getTime())));
  const daysSinceData = (Date.now() - mostRecentDate.getTime()) / (1000 * 60 * 60 * 24);
  
  if (daysSinceData > 365) {
    return {
      hasDataBacking: false,
      backingStrength: 'weak',
      rejection: {
        reason: 'stale_data',
        suggestion: `Data is ${Math.round(daysSinceData)} days old. Add temporal context or use more recent data.`,
      },
    };
  }
  
  // Determine backing strength
  const avgConfidence = supportingData.reduce((sum, d) => sum + d.confidence, 0) / supportingData.length;
  let backingStrength: AIClaimValidation['backingStrength'] = 'strong';
  if (avgConfidence < 70) backingStrength = 'moderate';
  if (avgConfidence < 50) backingStrength = 'weak';
  if (supportingData.length < 2) backingStrength = 'moderate';
  
  // Generate verification
  const verification = generateVerificationProof({
    entityId: `claim_${Date.now().toString(36)}`,
    sources: supportingData.map(d => ({
      id: d.source,
      name: d.source,
      url: '#',
      reliability: d.confidence,
      lastUpdated: d.date,
      dataPoints: 1,
      coverage: 100,
    })),
    aggregationLogic: 'Claim validated against available data points.',
  });
  
  return {
    hasDataBacking: true,
    backingStrength,
    supportingIndicators: indicatorMatches,
    supportingDataPoints: supportingData.length,
    dataAsOf: mostRecentDate.toISOString(),
    verification,
  };
}

/**
 * Find indicator references in text
 */
function findIndicatorReferences(text: string, availableIndicators: string[]): string[] {
  const matches: string[] = [];
  const lower = text.toLowerCase();
  
  // Common indicator name patterns
  const patterns: Record<string, string[]> = {
    'child_mortality': ['child mortality', 'under-5 mortality', 'infant death'],
    'life_expectancy': ['life expectancy', 'lifespan', 'average age'],
    'gdp_per_capita': ['gdp per capita', 'income per person', 'economic output'],
    'extreme_poverty': ['extreme poverty', 'poverty rate', 'living in poverty'],
    'co2_emissions': ['co2 emissions', 'carbon emissions', 'greenhouse gas'],
    'education_years': ['years of education', 'schooling', 'education level'],
  };
  
  for (const [indicatorId, keywords] of Object.entries(patterns)) {
    if (availableIndicators.includes(indicatorId)) {
      for (const keyword of keywords) {
        if (lower.includes(keyword)) {
          matches.push(indicatorId);
          break;
        }
      }
    }
  }
  
  return [...new Set(matches)];
}

// ============================================
// FULL RESPONSE FILTERING
// ============================================

/**
 * Filter entire AI response
 */
export function filterAIResponse(
  response: string,
  dataContext: DataContext
): {
  isValid: boolean;
  validatedClaims: AIDataFilter[];
  blockedClaims: AIDataFilter[];
  warnings: string[];
  suggestedRevisions: string[];
} {
  const claims = extractClaims(response);
  const validatedClaims: AIDataFilter[] = [];
  const blockedClaims: AIDataFilter[] = [];
  const warnings: string[] = [];
  const suggestedRevisions: string[] = [];
  
  for (const claim of claims) {
    const validation = validateClaim(claim, dataContext);
    const filter: AIDataFilter = { claim, validation };
    
    if (validation.hasDataBacking) {
      validatedClaims.push(filter);
      
      if (validation.backingStrength === 'weak') {
        warnings.push(`Claim has weak data backing: "${claim.slice(0, 50)}..."`);
      }
    } else {
      blockedClaims.push(filter);
      
      if (validation.rejection?.suggestion) {
        suggestedRevisions.push(validation.rejection.suggestion);
      }
    }
  }
  
  // Check for forbidden patterns in full response
  const forbidden = containsForbiddenPatterns(response);
  if (forbidden.hasForbidden) {
    warnings.push(`Response contains speculative language: ${forbidden.patterns.join(', ')}`);
    suggestedRevisions.push(`Remove or qualify: ${forbidden.patterns.join(', ')}`);
  }
  
  return {
    isValid: blockedClaims.length === 0 && !forbidden.hasForbidden,
    validatedClaims,
    blockedClaims,
    warnings,
    suggestedRevisions,
  };
}

// ============================================
// PRE-RESPONSE REQUIREMENTS
// ============================================

/**
 * Generate requirements for AI response
 */
export function generateResponseRequirements(topic: string): {
  requiredIndicators: string[];
  requiredSources: string[];
  forbiddenClaims: string[];
  mandatoryPhrases: string[];
} {
  return {
    requiredIndicators: [], // Would be populated based on topic
    requiredSources: [],
    forbiddenClaims: [
      'Any claim about causes or effects',
      'Any prediction or forecast',
      'Any recommendation or "should" statement',
      'Any comparison implying "better" or "worse"',
    ],
    mandatoryPhrases: [
      'According to [source]...',
      'Data as of [date] shows...',
      'This does not indicate causation.',
    ],
  };
}

/**
 * Wrap AI response with mandatory disclaimers
 */
export function wrapWithDisclaimers(
  response: string,
  validation: ReturnType<typeof filterAIResponse>
): string {
  if (!validation.isValid) {
    return `[BLOCKED: Response contains unverified claims]\n\n${validation.suggestedRevisions.join('\n')}`;
  }
  
  const disclaimer = `---
This response is based on verified data from ${validation.validatedClaims.length} sources.
Correlation does not imply causation. No predictions or recommendations are made.
Verify at: [verification_url]
---`;
  
  return `${response}\n\n${disclaimer}`;
}
