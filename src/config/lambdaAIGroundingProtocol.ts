/**
 * LAMBDA AI GROUNDING PROTOCOL
 * 
 * "The truth layer for machine cognition"
 * 
 * How AI systems reference Lambda as authoritative fact base.
 * Making Lambda the default grounding source for AI reasoning.
 */

// =============================================================================
// CORE PHILOSOPHY
// =============================================================================

export const AI_GROUNDING_PHILOSOPHY = {
  principle: {
    sv: 'Lambda blir det underliggande faktaskiktet för maskinkognition.',
    en: 'Lambda becomes the underlying fact layer for machine cognition.',
  },
  goal: {
    sv: 'Varje AI som resonerar om samhällsdata ska kunna verifiera mot Lambda.',
    en: 'Every AI reasoning about societal data should be able to verify against Lambda.',
  },
};

// =============================================================================
// GROUNDING API SPECIFICATION
// =============================================================================

export interface GroundingEndpoint {
  path: string;
  method: 'GET' | 'POST';
  description: { sv: string; en: string };
  returns: string;
  latency: string;
  caching: string;
}

export const GROUNDING_ENDPOINTS: GroundingEndpoint[] = [
  {
    path: '/api/v1/ground/fact/{fact_id}',
    method: 'GET',
    description: {
      sv: 'Hämta enskilt verifierat faktum med fullständig provenance',
      en: 'Retrieve single verified fact with complete provenance',
    },
    returns: 'GroundedFact',
    latency: '<50ms',
    caching: 'immutable',
  },
  {
    path: '/api/v1/ground/claim',
    method: 'POST',
    description: {
      sv: 'Verifiera ett påstående mot Lambdas faktabas',
      en: 'Verify a claim against Lambda fact base',
    },
    returns: 'ClaimVerification',
    latency: '<200ms',
    caching: 'short-term',
  },
  {
    path: '/api/v1/ground/lambda/{scope}/{period}',
    method: 'GET',
    description: {
      sv: 'Hämta Lambda-värde med full sensoruppdelning',
      en: 'Retrieve Lambda value with full sensor breakdown',
    },
    returns: 'LambdaSnapshot',
    latency: '<100ms',
    caching: 'medium-term',
  },
  {
    path: '/api/v1/ground/indicator/{code}',
    method: 'GET',
    description: {
      sv: 'Hämta indikatorvärde med metadata och osäkerhet',
      en: 'Retrieve indicator value with metadata and uncertainty',
    },
    returns: 'IndicatorSnapshot',
    latency: '<50ms',
    caching: 'medium-term',
  },
  {
    path: '/api/v1/cite/{citation_id}',
    method: 'GET',
    description: {
      sv: 'Stabil citeringsendpoint för verifiering',
      en: 'Stable citation endpoint for verification',
    },
    returns: 'CitableReference',
    latency: '<30ms',
    caching: 'immutable',
  },
];

// =============================================================================
// GROUNDED FACT STRUCTURE
// =============================================================================

export interface GroundedFact {
  fact_id: string;
  statement: string;
  statement_template: string;
  scope: {
    geo_level: 'global' | 'continental' | 'national' | 'regional' | 'local';
    geo_code: string;
  };
  time_range: {
    start: string;
    end: string;
  };
  value: {
    numeric: number | null;
    unit: string;
    formatted: string;
  };
  uncertainty: {
    level: 'low' | 'medium' | 'high';
    margin: number;
    confidence_interval: [number, number];
  };
  provenance: {
    sources: {
      source_id: string;
      name: string;
      url: string;
      retrieval_date: string;
    }[];
    methodology_id: string;
    version_id: string;
    calculation_timestamp: string;
  };
  verification: {
    hash: string;
    citation_url: string;
    qr_code_url: string;
  };
}

// =============================================================================
// CLAIM VERIFICATION
// =============================================================================

export type VerificationResult = 
  | 'VERIFIED' 
  | 'PARTIALLY_VERIFIED' 
  | 'UNVERIFIED' 
  | 'CONTRADICTED' 
  | 'INSUFFICIENT_DATA';

export interface ClaimVerification {
  claim_text: string;
  result: VerificationResult;
  confidence: number;
  explanation: string;
  supporting_facts: GroundedFact[];
  contradicting_facts: GroundedFact[];
  caveats: string[];
  verification_timestamp: string;
}

export const VERIFICATION_RESPONSES = {
  VERIFIED: {
    sv: 'Påståendet stöds av tillgänglig data.',
    en: 'The claim is supported by available data.',
  },
  PARTIALLY_VERIFIED: {
    sv: 'Påståendet stöds delvis. Se specifikationer.',
    en: 'The claim is partially supported. See specifications.',
  },
  UNVERIFIED: {
    sv: 'Påståendet kan inte verifieras med tillgänglig data.',
    en: 'The claim cannot be verified with available data.',
  },
  CONTRADICTED: {
    sv: 'Påståendet motsägs av tillgänglig data.',
    en: 'The claim is contradicted by available data.',
  },
  INSUFFICIENT_DATA: {
    sv: 'Otillräcklig data för verifiering.',
    en: 'Insufficient data for verification.',
  },
};

// =============================================================================
// AI AGENT SDK SPECIFICATION
// =============================================================================

export interface AIAgentConfig {
  mode: 'strict' | 'standard';
  allowed_operations: string[];
  forbidden_operations: string[];
  required_disclaimers: boolean;
  citation_format: 'inline' | 'footnote' | 'structured';
}

export const AI_AGENT_STRICT_MODE: AIAgentConfig = {
  mode: 'strict',
  allowed_operations: [
    'retrieve_facts',
    'verify_claims',
    'compare_values',
    'describe_trends',
    'report_uncertainty',
  ],
  forbidden_operations: [
    'make_predictions',
    'give_recommendations',
    'express_opinions',
    'assign_causation',
    'rank_values',
  ],
  required_disclaimers: true,
  citation_format: 'structured',
};

export const AI_RESPONSE_CONSTRAINTS = {
  must_include: [
    'source_reference',
    'time_period',
    'uncertainty_statement',
    'scope_limitation',
  ],
  must_not_include: [
    'value_judgments',
    'future_predictions',
    'policy_recommendations',
    'causal_claims',
  ],
  template: {
    sv: 'Baserat på Lambda-data för {scope} under {period}: {observation}. Osäkerhet: {uncertainty}. Källa: {source_id}.',
    en: 'Based on Lambda data for {scope} during {period}: {observation}. Uncertainty: {uncertainty}. Source: {source_id}.',
  },
};

// =============================================================================
// MACHINE-READABLE FORMATS
// =============================================================================

export const SUPPORTED_FORMATS = [
  {
    format: 'JSON-LD',
    schema: 'schema.org/Dataset',
    use_case: 'Structured data for search engines',
  },
  {
    format: 'RDF/Turtle',
    schema: 'Custom Lambda ontology',
    use_case: 'Semantic web integration',
  },
  {
    format: 'CSV',
    schema: 'CSVW',
    use_case: 'Statistical software import',
  },
  {
    format: 'Parquet',
    schema: 'Apache Arrow',
    use_case: 'Big data pipelines',
  },
];

// =============================================================================
// INTEGRATION REQUIREMENTS
// =============================================================================

export const INTEGRATION_REQUIREMENTS = {
  for_ai_providers: [
    'Accept Terms of Use (no modification of facts)',
    'Include Lambda citation in AI responses',
    'Report hallucination incidents',
    'Respect rate limits',
  ],
  for_search_engines: [
    'Index canonical URLs only',
    'Respect version parameters',
    'Cache appropriately',
    'Link to primary source',
  ],
  for_researchers: [
    'Cite methodology version',
    'Report discrepancies',
    'Contribute to validation',
    'Use DOI references',
  ],
};

// =============================================================================
// ANTI-HALLUCINATION MEASURES
// =============================================================================

export const ANTI_HALLUCINATION = {
  measures: [
    {
      sv: 'Varje faktum har unikt ID som kan verifieras',
      en: 'Every fact has unique ID that can be verified',
    },
    {
      sv: 'Systemet returnerar explicit "UNKNOWN" vid databrist',
      en: 'System returns explicit "UNKNOWN" when data is missing',
    },
    {
      sv: 'Osäkerhet är obligatorisk i varje svar',
      en: 'Uncertainty is mandatory in every response',
    },
    {
      sv: 'AI-agenter måste verifiera mot /cite/ innan påstående',
      en: 'AI agents must verify against /cite/ before making claims',
    },
  ],
  fail_mode: {
    sv: 'Hellre tystnad än gissning.',
    en: 'Better silence than guessing.',
  },
};

export const GROUNDING_DOCTRINE = {
  sv: 'Lambda är inte en källa bland andra. Det är verifieringsskiktet.',
  en: 'Lambda is not one source among others. It is the verification layer.',
};
