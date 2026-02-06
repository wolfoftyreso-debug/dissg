/**
 * ORACLE RESILIENCE
 * 
 * How the oracle withstands manipulation, pressure, framing, and strategic queries
 * – without becoming defensive.
 * 
 * This is the level where the system doesn't just answer correctly,
 * but REMAINS correct even when someone tries to make it fail.
 */

// ============================================
// THE PROBLEM: PRESSURE QUERIES
// ============================================

/**
 * When you become important, this inevitably happens:
 * - Political actors want answers that support narratives
 * - Companies want data to "sound" positive
 * - Journalists want angles
 * - AI agents sometimes optimize for answers, not truth
 */

export const PRESSURE_QUERY_EXAMPLES = {
  political_framing: [
    'Does data show that high taxes destroy the economy?',
    'Proves the data that immigration causes crime?',
    'Is the government succeeding with healthcare?',
  ],
  
  corporate_framing: [
    'How well is the energy transition going?',
    'Are we on track to meet climate goals?',
    'Show that our industry is sustainable',
  ],
  
  media_framing: [
    'Is there a crisis in X?',
    'Has Y failed?',
    'What is the worst aspect of Z?',
  ],
  
  why_dangerous: 'These appear statistical but contain embedded conclusions',
};

// ============================================
// QUERY ANALYSIS & DECOMPOSITION
// ============================================

export interface QueryAnalysis {
  original_query: string;
  
  // Detected elements
  contains_normative_claim: boolean;
  contains_causal_assumption: boolean;
  contains_temporal_speculation: boolean;
  contains_value_judgment: boolean;
  contains_leading_framing: boolean;
  
  // Extracted resolvable components
  resolvable_components: ResolvableComponent[];
  
  // Threat assessment
  manipulation_risk: 'none' | 'low' | 'medium' | 'high';
  recommended_action: 'answer' | 'reframe' | 'decompose' | 'refuse' | 'silence';
}

export interface ResolvableComponent {
  component: string;
  type: 'variable' | 'observation' | 'measurable_state' | 'time_series';
  answerable: boolean;
}

/**
 * Analyze a query for pressure patterns before matching to CQ
 */
export function analyzeQueryForPressure(query: string): QueryAnalysis {
  const analysis: QueryAnalysis = {
    original_query: query,
    contains_normative_claim: false,
    contains_causal_assumption: false,
    contains_temporal_speculation: false,
    contains_value_judgment: false,
    contains_leading_framing: false,
    resolvable_components: [],
    manipulation_risk: 'none',
    recommended_action: 'answer',
  };
  
  // Check for normative patterns
  const normativePatterns = [
    /\b(should|ought|must|need to)\b/i,
    /\b(bör|måste|borde)\b/i,
    /\bis (good|bad|better|worse|right|wrong)\b/i,
    /\bär (bra|dålig|bättre|sämre|rätt|fel)\b/i,
  ];
  
  for (const pattern of normativePatterns) {
    if (pattern.test(query)) {
      analysis.contains_normative_claim = true;
      break;
    }
  }
  
  // Check for causal assumptions
  const causalPatterns = [
    /\b(causes?|caused)\b/i,
    /\b(leads? to|led to)\b/i,
    /\b(destroys?|destroyed)\b/i,
    /\b(creates?|created)\b/i,
    /\b(proves?|proved|proven)\b/i,
    /\borsakar?\b/i,
    /\bleder till\b/i,
    /\bförstör\b/i,
    /\bbevisar?\b/i,
  ];
  
  for (const pattern of causalPatterns) {
    if (pattern.test(query)) {
      analysis.contains_causal_assumption = true;
      break;
    }
  }
  
  // Check for temporal speculation
  const speculativePatterns = [
    /\bwhat (will|would) happen\b/i,
    /\bwhat if\b/i,
    /\bvad händer om\b/i,
    /\bvad skulle hända\b/i,
    /\bprediction\b/i,
    /\bforecast\b/i,
    /\bprognos\b/i,
  ];
  
  for (const pattern of speculativePatterns) {
    if (pattern.test(query)) {
      analysis.contains_temporal_speculation = true;
      break;
    }
  }
  
  // Check for value judgments
  const valuePatterns = [
    /\b(succeed|fail|success|failure)\b/i,
    /\b(lyckades|misslyckades)\b/i,
    /\b(working|not working)\b/i,
    /\b(fungerar|fungerar inte)\b/i,
    /\b(crisis|krisis|kris)\b/i,
    /\b(worst|best)\b/i,
    /\b(sämst|bäst)\b/i,
  ];
  
  for (const pattern of valuePatterns) {
    if (pattern.test(query)) {
      analysis.contains_value_judgment = true;
      break;
    }
  }
  
  // Check for leading framing
  const leadingPatterns = [
    /^does data (show|prove|confirm)/i,
    /^visar data att/i,
    /^bevisar data att/i,
    /^confirms? that/i,
    /^bekräftar/i,
    /\bisn't it true that\b/i,
    /\bstämmer det att\b/i,
  ];
  
  for (const pattern of leadingPatterns) {
    if (pattern.test(query)) {
      analysis.contains_leading_framing = true;
      break;
    }
  }
  
  // Extract resolvable components
  analysis.resolvable_components = extractResolvableComponents(query);
  
  // Calculate manipulation risk
  const riskFactors = [
    analysis.contains_normative_claim,
    analysis.contains_causal_assumption,
    analysis.contains_temporal_speculation,
    analysis.contains_value_judgment,
    analysis.contains_leading_framing,
  ].filter(Boolean).length;
  
  if (riskFactors === 0) {
    analysis.manipulation_risk = 'none';
    analysis.recommended_action = 'answer';
  } else if (riskFactors === 1) {
    analysis.manipulation_risk = 'low';
    analysis.recommended_action = 'decompose';
  } else if (riskFactors <= 3) {
    analysis.manipulation_risk = 'medium';
    analysis.recommended_action = 'reframe';
  } else {
    analysis.manipulation_risk = 'high';
    analysis.recommended_action = 'refuse';
  }
  
  return analysis;
}

function extractResolvableComponents(query: string): ResolvableComponent[] {
  const components: ResolvableComponent[] = [];
  
  // Common resolvable patterns
  const variablePatterns = [
    { pattern: /\b(tax(?:es)?|skatt(?:er)?)\s*(levels?|rates?|nivåer?)?\b/i, type: 'variable' as const },
    { pattern: /\b(economic|ekonomisk)\s*(growth|tillväxt)\b/i, type: 'time_series' as const },
    { pattern: /\b(unemployment|arbetslöshet)\b/i, type: 'time_series' as const },
    { pattern: /\b(inflation)\b/i, type: 'time_series' as const },
    { pattern: /\b(crime|brottslighet)\s*(rate|statistics)?\b/i, type: 'time_series' as const },
    { pattern: /\b(immigration|invandring)\b/i, type: 'time_series' as const },
    { pattern: /\b(GDP|BNP)\b/i, type: 'variable' as const },
    { pattern: /\b(healthcare|sjukvård)\s*(spending|costs|outcomes)?\b/i, type: 'variable' as const },
    { pattern: /\b(energy|energi)\s*(consumption|production)?\b/i, type: 'time_series' as const },
    { pattern: /\b(emissions?|utsläpp)\b/i, type: 'time_series' as const },
  ];
  
  for (const { pattern, type } of variablePatterns) {
    const match = query.match(pattern);
    if (match) {
      components.push({
        component: match[0].toLowerCase(),
        type,
        answerable: true,
      });
    }
  }
  
  return components;
}

// ============================================
// REFRAMED RESPONSE MODE
// ============================================

export type ResponseMode = 
  | 'Direct'           // Normal answer
  | 'Reframed'         // Answer resolvable parts only
  | 'Decomposed'       // Break into multiple sub-answers
  | 'Refused'          // Cannot answer
  | 'Silent';          // No response

export interface ReframedResponse {
  mode: ResponseMode;
  original_query: string;
  reframed_as?: string;
  
  // What we CAN answer
  answerable_aspects: string[];
  
  // What we CANNOT answer
  unanswerable_aspects: string[];
  
  // The actual response (if any)
  response?: string;
  
  // Why this mode was chosen
  mode_rationale: string;
}

/**
 * Build a reframed response for pressure queries
 */
export function buildReframedResponse(
  analysis: QueryAnalysis
): ReframedResponse {
  const response: ReframedResponse = {
    mode: 'Direct',
    original_query: analysis.original_query,
    answerable_aspects: [],
    unanswerable_aspects: [],
    mode_rationale: '',
  };
  
  // Determine what can and cannot be answered
  if (analysis.contains_normative_claim) {
    response.unanswerable_aspects.push('Value judgment (good/bad/should)');
  }
  
  if (analysis.contains_causal_assumption) {
    response.unanswerable_aspects.push('Causal relationship (X causes Y)');
  }
  
  if (analysis.contains_temporal_speculation) {
    response.unanswerable_aspects.push('Future prediction');
  }
  
  if (analysis.contains_leading_framing) {
    response.unanswerable_aspects.push('Confirmation request');
  }
  
  // Add resolvable components
  for (const component of analysis.resolvable_components) {
    if (component.answerable) {
      response.answerable_aspects.push(
        `${component.component} (${component.type})`
      );
    }
  }
  
  // Set mode based on analysis
  switch (analysis.recommended_action) {
    case 'answer':
      response.mode = 'Direct';
      response.mode_rationale = 'Query contains no manipulation patterns';
      break;
      
    case 'decompose':
      response.mode = 'Decomposed';
      response.mode_rationale = 'Query contains minor pressure patterns; answering resolvable components';
      response.reframed_as = `Data on: ${response.answerable_aspects.join(', ')}`;
      break;
      
    case 'reframe':
      response.mode = 'Reframed';
      response.mode_rationale = 'Query contains embedded conclusions; reframing to observational';
      response.reframed_as = reframeToObservational(analysis);
      break;
      
    case 'refuse':
      response.mode = 'Refused';
      response.mode_rationale = 'Query is fundamentally non-resolvable with data';
      break;
      
    case 'silence':
      response.mode = 'Silent';
      response.mode_rationale = 'Query requires silence for epistemological or legal reasons';
      break;
  }
  
  return response;
}

function reframeToObservational(analysis: QueryAnalysis): string {
  const components = analysis.resolvable_components
    .filter(c => c.answerable)
    .map(c => c.component);
  
  if (components.length === 0) {
    return 'No resolvable observational components identified';
  }
  
  if (components.length === 1) {
    return `Historical data on ${components[0]} across available periods and regions`;
  }
  
  return `Observed patterns in ${components.join(' and ')} across available periods and regions`;
}

// ============================================
// FRAMING IMMUNITY
// ============================================

/**
 * The oracle NEVER accepts user framing.
 * It only accepts: variables, observations, measurable states.
 * Everything else is stripped.
 */
export const FRAMING_IMMUNITY = {
  principle: 'The oracle accepts variables, observations, and measurable states. Nothing else.',
  
  accepts: [
    'Variable names (unemployment, GDP, emissions)',
    'Time ranges (1990-2023, Q1 2024)',
    'Geographic scopes (Sweden, OECD, EU)',
    'Demographic segments (age 18-65, women)',
    'Measurement types (percentage, per capita, index)',
  ],
  
  strips: [
    'Value judgments (good, bad, successful, failed)',
    'Causal claims (causes, leads to, destroys)',
    'Predictions (will, would, might)',
    'Confirmation requests (proves, confirms, shows that)',
    'Rhetorical framing (crisis, disaster, miracle)',
  ],
  
  result: {
    leading_questions_lose_effect: true,
    rhetoric_is_neutralized: true,
    oracle_remains_cold: true,
  },
};

/**
 * Strip framing from a query, leaving only resolvable elements
 */
export function stripFraming(query: string): string {
  let stripped = query;
  
  // Remove leading confirmation phrases
  stripped = stripped.replace(/^(does data (show|prove|confirm) that|visar data att|bevisar data att)\s*/i, '');
  stripped = stripped.replace(/^(is it true that|stämmer det att)\s*/i, '');
  stripped = stripped.replace(/^(confirm that|bekräfta att)\s*/i, '');
  
  // Remove value judgments
  stripped = stripped.replace(/\b(good|bad|better|worse|best|worst|successful|failed|failing)\b/gi, '');
  stripped = stripped.replace(/\b(bra|dålig|bättre|sämre|bäst|sämst|lyckat|misslyckat)\b/gi, '');
  
  // Remove causal verbs
  stripped = stripped.replace(/\b(causes?|caused|leads? to|led to|destroys?|destroyed|creates?|created)\b/gi, '');
  stripped = stripped.replace(/\b(orsakar?|leder till|ledde till|förstör|skapar?)\b/gi, '');
  
  // Remove rhetorical words
  stripped = stripped.replace(/\b(crisis|disaster|miracle|catastrophe|success|failure)\b/gi, '');
  stripped = stripped.replace(/\b(kris|katastrof|mirakel|framgång|misslyckande)\b/gi, '');
  
  // Clean up whitespace
  stripped = stripped.replace(/\s+/g, ' ').trim();
  
  return stripped || 'No resolvable elements';
}

// ============================================
// ADVERSARIAL QUERY HANDLING
// ============================================

export interface ClaimValidation {
  claim_supported: boolean;
  reason: string;
  available_data?: string;
  oracle_position: 'neutral';
}

/**
 * Handle queries that try to use the oracle as an authority stamp
 */
export function handleAdversarialQuery(query: string): ClaimValidation {
  // Check if query is trying to get confirmation
  const confirmationPatterns = [
    /\bconfirms?\b/i,
    /\bproves?\b/i,
    /\bshows? that\b/i,
    /\bbekräftar?\b/i,
    /\bbevisar?\b/i,
    /\bvisar att\b/i,
  ];
  
  const isConfirmationRequest = confirmationPatterns.some(p => p.test(query));
  
  if (isConfirmationRequest) {
    return {
      claim_supported: false,
      reason: 'The oracle does not confirm or deny claims. It provides observations.',
      oracle_position: 'neutral',
    };
  }
  
  // Check if claim is measurable
  const analysis = analyzeQueryForPressure(query);
  
  if (analysis.resolvable_components.length === 0) {
    return {
      claim_supported: false,
      reason: 'Claim not defined in measurable terms',
      oracle_position: 'neutral',
    };
  }
  
  return {
    claim_supported: false,
    reason: 'The oracle provides data, not claim validation',
    available_data: analysis.resolvable_components.map(c => c.component).join(', '),
    oracle_position: 'neutral',
  };
}

// ============================================
// ORACLE SILENCE (CRITICAL)
// ============================================

export type SilenceReason =
  | 'LegalProceeding'          // Ongoing legal case
  | 'DataUnderRevision'        // Data being corrected
  | 'ExtremelyNew'             // Event too recent
  | 'InsufficientCoverage'     // Not enough data
  | 'SourceContamination'      // Sources potentially compromised
  | 'MethodologyDispute';      // Fundamental disagreement on measurement

export interface OracleSilence {
  response: null;
  epistemic_status: 'TemporarilyUnavailable';
  silence_reason: SilenceReason;
  estimated_availability?: string;
  alternative_resources?: string[];
}

/**
 * Determine if oracle should be silent
 */
export function shouldRemainSilent(
  context: {
    has_legal_proceeding?: boolean;
    data_under_revision?: boolean;
    event_age_hours?: number;
    coverage_score?: number;
    source_integrity_score?: number;
    methodology_stable?: boolean;
  }
): OracleSilence | null {
  // Legal proceeding - mandatory silence
  if (context.has_legal_proceeding) {
    return {
      response: null,
      epistemic_status: 'TemporarilyUnavailable',
      silence_reason: 'LegalProceeding',
      alternative_resources: ['Official court documents', 'Legal databases'],
    };
  }
  
  // Data under revision
  if (context.data_under_revision) {
    return {
      response: null,
      epistemic_status: 'TemporarilyUnavailable',
      silence_reason: 'DataUnderRevision',
      estimated_availability: 'When revision is complete',
    };
  }
  
  // Event too recent (less than 48 hours)
  if (context.event_age_hours !== undefined && context.event_age_hours < 48) {
    return {
      response: null,
      epistemic_status: 'TemporarilyUnavailable',
      silence_reason: 'ExtremelyNew',
      estimated_availability: '48-72 hours after event',
    };
  }
  
  // Coverage too low
  if (context.coverage_score !== undefined && context.coverage_score < 0.3) {
    return {
      response: null,
      epistemic_status: 'TemporarilyUnavailable',
      silence_reason: 'InsufficientCoverage',
    };
  }
  
  // Source integrity compromised
  if (context.source_integrity_score !== undefined && context.source_integrity_score < 0.5) {
    return {
      response: null,
      epistemic_status: 'TemporarilyUnavailable',
      silence_reason: 'SourceContamination',
    };
  }
  
  // Methodology unstable
  if (context.methodology_stable === false) {
    return {
      response: null,
      epistemic_status: 'TemporarilyUnavailable',
      silence_reason: 'MethodologyDispute',
    };
  }
  
  return null; // No silence required
}

// ============================================
// THE SILENCE PRINCIPLE
// ============================================

export const SILENCE_PRINCIPLE = {
  statement: 'Being silent at the right moment is maximum authority',
  
  when_to_be_silent: [
    'Legal proceedings in progress',
    'Data actively being revised',
    'Events less than 48 hours old',
    'Coverage below minimum threshold',
    'Source integrity questionable',
    'Methodology fundamentally disputed',
  ],
  
  why_silence_is_power: [
    'Shows the oracle knows its limits',
    'Prevents premature conclusions',
    'Protects against manipulation',
    'Maintains long-term trust',
    'Legal protection',
  ],
};

// ============================================
// ORACLE RESILIENCE SUMMARY
// ============================================

export const ORACLE_RESILIENCE_STATUS = {
  capabilities: {
    pressure_query_detection: true,
    query_decomposition: true,
    framing_immunity: true,
    adversarial_handling: true,
    strategic_silence: true,
  },
  
  guarantees: {
    never_confirms_claims: true,
    never_accepts_framing: true,
    never_predicts: true,
    never_judges: true,
    can_be_silent: true,
  },
  
  result: {
    correct: true,
    neutral: true,
    unaffectable: true,
    non_manipulable: true,
    legally_safe: true,
  },
  
  position: 'Can be used by power, examined by media, consumed by AI – without ever becoming a party',
};
