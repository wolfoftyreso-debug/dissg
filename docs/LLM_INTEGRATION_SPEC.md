# 🧠 LLM INTEGRATION SPECIFICATION

## "AI reasons. The Index knows."

**Version**: 1.0  
**Status**: Canonical  
**Classification**: Core AI Architecture

---

## FOUNDATIONAL PRINCIPLE

> **The LLM is NEVER the source. It is the reasoning engine.**

```
┌────────────────────────────────────────────────────────────────────┐
│                    THE FUNDAMENTAL DIFFERENCE                       │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  EVERYONE ELSE:                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  User → LLM (guesses from training data) → Answer          │   │
│  │                                                             │   │
│  │  Problem: No verification. No sources. Hallucinations.      │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  US:                                                                │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  User → LLM (interprets) → Index (retrieves) → LLM         │   │
│  │        (reasons over verified data) → Answer + Sources     │   │
│  │                                                             │   │
│  │  Result: Verified. Cited. Legally defensible.               │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ═══════════════════════════════════════════════════════════════   │
│                                                                     │
│  LLM THINKS.                                                        │
│  INDEX KNOWS.                                                       │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
```

---

# PART I: THE THREE MANDATORY LAYERS

## 1.1 Architecture Overview

```
┌────────────────────────────────────────────────────────────────────┐
│                    LLM ↔ INDEX ARCHITECTURE                         │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌───────────────┐                                                  │
│  │   USER QUERY  │  "How do interest rates affect housing          │
│  │               │   prices in Stockholm?"                          │
│  └───────┬───────┘                                                  │
│          │                                                          │
│          ▼                                                          │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │  LAYER 1: QUERY INTERPRETATION                                 │ │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━                │ │
│  │  LLM decomposes question into index operations:                │ │
│  │  • Indices: [interest_rate, housing_price]                     │ │
│  │  • Jurisdiction: SE → Stockholm                                │ │
│  │  • Relations: correlation housing_price ↔ interest_rate       │ │
│  │  • Time: historical + latest                                   │ │
│  │  • Intent: causal_analysis                                     │ │
│  └───────────────────────────────────────────────────────────────┘ │
│          │                                                          │
│          ▼                                                          │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │  LAYER 2: INDEX EXECUTION                                      │ │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━                │ │
│  │  System retrieves:                                             │ │
│  │  • Verified index objects                                      │ │
│  │  • Relation strengths and confidence                           │ │
│  │  • Historical versions                                         │ │
│  │  • Jurisdiction-specific data                                  │ │
│  │  • Methodology notes                                           │ │
│  │                                                                │ │
│  │  LLM receives ONLY verified input. Nothing else.               │ │
│  └───────────────────────────────────────────────────────────────┘ │
│          │                                                          │
│          ▼                                                          │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │  LAYER 3: REASONING + ATTRIBUTION                              │ │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━                │ │
│  │  LLM:                                                          │ │
│  │  • Weighs relations                                            │ │
│  │  • Reasons over time                                           │ │
│  │  • States uncertainty explicitly                               │ │
│  │  • Cites every claim                                           │ │
│  │                                                                │ │
│  │  Output MUST contain:                                          │ │
│  │  • Used indices (with IDs)                                     │ │
│  │  • Jurisdiction scope                                          │ │
│  │  • Time period                                                 │ │
│  │  • Confidence levels                                           │ │
│  │  • What data was NOT available                                 │ │
│  └───────────────────────────────────────────────────────────────┘ │
│          │                                                          │
│          ▼                                                          │
│  ┌───────────────┐                                                  │
│  │   RESPONSE    │  Verified answer with full attribution           │
│  └───────────────┘                                                  │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
```

---

## LAYER 1: QUERY INTERPRETATION

### 1.1 Purpose

Transform natural language questions into structured index operations.

### 1.2 Interface

```typescript
interface QueryInterpretation {
  // Original query
  original_query: string;
  language: string;
  
  // Decomposed elements
  decomposition: {
    // What indices are needed?
    required_indices: IndexReference[];
    
    // What jurisdiction scope?
    jurisdiction: {
      country: string | null;
      region: string | null;
      municipality: string | null;
      scope: 'specific' | 'comparative' | 'global';
    };
    
    // What time dimension?
    time: {
      type: 'point' | 'range' | 'trend' | 'historical';
      from: ISO8601 | null;
      to: ISO8601 | null;
      granularity: 'day' | 'week' | 'month' | 'quarter' | 'year';
    };
    
    // What relations to explore?
    relations: {
      type: RelationType[];
      depth: number;
      direction: 'upstream' | 'downstream' | 'both';
    };
    
    // What is the intent?
    intent: QueryIntent;
    
    // What operations to perform?
    operations: IndexOperation[];
  };
  
  // Validation
  validation: {
    is_answerable: boolean;
    missing_data: string[];
    ambiguities: Ambiguity[];
    clarification_needed: boolean;
    clarification_prompt: string | null;
  };
  
  // Confidence in interpretation
  interpretation_confidence: number;
}

type QueryIntent = 
  | 'factual_lookup'           // "What is X?"
  | 'comparison'               // "How does X compare to Y?"
  | 'trend_analysis'           // "How has X changed?"
  | 'causal_analysis'          // "What affects X?"
  | 'impact_analysis'          // "What does X affect?"
  | 'simulation'               // "What if X changes?"
  | 'prediction'               // "What will X be?"
  | 'explanation';             // "Why is X like this?"

interface IndexOperation {
  type: 'fetch' | 'aggregate' | 'compare' | 'correlate' | 'project';
  target: IndexReference[];
  parameters: Record<string, any>;
  required_confidence: number;
}

interface IndexReference {
  index_id: GlobalHash | null;     // Known ID
  index_slug: string | null;       // Known slug
  semantic_match: string;          // What we're looking for
  category: IndexCategory;
  required: boolean;
}
```

### 1.3 Interpretation Examples

```typescript
const INTERPRETATION_EXAMPLES = [
  {
    query: "What is the current inflation rate in Sweden?",
    interpretation: {
      required_indices: [
        { semantic_match: "consumer_price_index", category: "economy" }
      ],
      jurisdiction: { country: "SE", scope: "specific" },
      time: { type: "point", granularity: "month" },
      relations: { type: [], depth: 0 },
      intent: "factual_lookup",
      operations: [
        { type: "fetch", target: ["cpi_sweden"] }
      ],
    },
  },
  
  {
    query: "How do interest rates affect housing prices in Stockholm?",
    interpretation: {
      required_indices: [
        { semantic_match: "interest_rate", category: "economy" },
        { semantic_match: "housing_price_index", category: "economy" }
      ],
      jurisdiction: { country: "SE", region: "Stockholm", scope: "specific" },
      time: { type: "historical", from: "2014-01-01", granularity: "month" },
      relations: { type: ["correlates_with", "influences"], depth: 1 },
      intent: "causal_analysis",
      operations: [
        { type: "fetch", target: ["interest_rate_se", "hpi_stockholm"] },
        { type: "correlate", target: ["interest_rate_se", "hpi_stockholm"] }
      ],
    },
  },
  
  {
    query: "Compare healthcare quality between Sweden and Germany",
    interpretation: {
      required_indices: [
        { semantic_match: "healthcare_quality_index", category: "health" }
      ],
      jurisdiction: { scope: "comparative" },
      time: { type: "range", from: "2019-01-01", granularity: "year" },
      relations: { type: [], depth: 0 },
      intent: "comparison",
      operations: [
        { type: "fetch", target: ["hqi_sweden", "hqi_germany"] },
        { type: "compare", target: ["hqi_sweden", "hqi_germany"] }
      ],
    },
  },
  
  {
    query: "What will happen to unemployment if minimum wage increases 10%?",
    interpretation: {
      required_indices: [
        { semantic_match: "minimum_wage", category: "economy" },
        { semantic_match: "unemployment_rate", category: "economy" }
      ],
      jurisdiction: { scope: "specific" },  // Needs clarification
      time: { type: "trend", granularity: "quarter" },
      relations: { type: ["influences", "correlates_with"], depth: 2 },
      intent: "simulation",
      operations: [
        { type: "project", target: ["unemployment"], parameters: { intervention: "+10% minimum_wage" } }
      ],
      validation: {
        clarification_needed: true,
        clarification_prompt: "Which jurisdiction? Minimum wage effects vary significantly by country.",
      },
    },
  },
];
```

### 1.4 Query Rejection Patterns

```typescript
const QUERY_REJECTION_PATTERNS = {
  // Cannot answer - no relevant index exists
  no_index: {
    pattern: /best|should|recommend|opinion/i,
    response: "This question asks for subjective judgment. I can only reason over verified indices. Would you like to see relevant data instead?",
  },
  
  // Cannot answer - outside scope
  out_of_scope: {
    pattern: /predict the future|will definitely|guarantee/i,
    response: "I cannot make guarantees about future events. I can show historical patterns and correlations with stated confidence levels.",
  },
  
  // Cannot answer - jurisdiction not covered
  no_jurisdiction: {
    example: "What's the crime rate in North Korea?",
    response: "No verified data available for this jurisdiction. Available jurisdictions for crime indices: [list].",
  },
  
  // Cannot answer - time not covered
  no_time_coverage: {
    example: "What was GDP in 1800?",
    response: "Data for this time period is not available. Available range for GDP: 1960-present.",
  },
};
```

---

## LAYER 2: INDEX EXECUTION

### 2.1 Purpose

Retrieve verified data from the index based on interpreted query.

### 2.2 Interface

```typescript
interface IndexExecutionRequest {
  interpretation: QueryInterpretation;
  
  // Execution parameters
  parameters: {
    max_results: number;
    min_confidence: number;
    include_versions: boolean;
    include_relations: boolean;
    include_methodology: boolean;
  };
  
  // Context
  context: {
    user_tier: AccessTier;
    request_id: UUID;
    timestamp: ISO8601;
  };
}

interface IndexExecutionResult {
  // Status
  status: 'complete' | 'partial' | 'failed';
  
  // Retrieved data
  data: {
    // Primary indices
    indices: RetrievedIndex[];
    
    // Relations (if requested)
    relations: RetrievedRelation[];
    
    // Time series (if requested)
    time_series: RetrievedTimeSeries[];
    
    // Aggregations (if computed)
    aggregations: ComputedAggregation[];
  };
  
  // Coverage report
  coverage: {
    requested: string[];
    found: string[];
    missing: string[];
    partial: string[];
  };
  
  // Quality report
  quality: {
    overall_confidence: number;
    confidence_breakdown: Record<string, number>;
    data_freshness: Record<string, ISO8601>;
    methodology_notes: string[];
  };
  
  // Limitations
  limitations: {
    missing_data: MissingDataNote[];
    low_confidence: LowConfidenceNote[];
    jurisdiction_gaps: JurisdictionGap[];
    time_gaps: TimeGap[];
  };
  
  // Execution metadata
  metadata: {
    execution_time_ms: number;
    cache_hit: boolean;
    indices_queried: number;
    data_points_retrieved: number;
  };
}

interface RetrievedIndex {
  id: GlobalHash;
  slug: string;
  
  // Current value
  current: {
    value: ClaimValue;
    observed_at: ISO8601;
    valid_from: ISO8601;
    valid_to: ISO8601 | null;
  };
  
  // Source
  source: {
    authority: string;
    authority_type: AuthorityType;
    access_url: URL;
    methodology_url: URL | null;
  };
  
  // Jurisdiction
  jurisdiction: JurisdictionInfo;
  
  // Confidence
  confidence: {
    score: number;
    method: ConfidenceMethod;
    factors: ConfidenceFactors;
  };
  
  // Version info
  version: {
    current: SemanticVersion;
    previous: GlobalHash | null;
    history_depth: number;
  };
}

interface RetrievedRelation {
  source_id: GlobalHash;
  target_id: GlobalHash;
  
  type: RelationType;
  
  properties: {
    strength: number | null;
    confidence: number;
    lag: Duration | null;
    direction: 'unidirectional' | 'bidirectional';
  };
  
  evidence: {
    data_points: number;
    time_range: TimeRange;
    methodology: string;
    r_squared: number | null;
    p_value: number | null;
  };
}
```

### 2.3 Execution Flow

```typescript
async function executeIndexQuery(
  request: IndexExecutionRequest
): Promise<IndexExecutionResult> {
  const { interpretation, parameters, context } = request;
  
  // 1. Resolve index references to actual IDs
  const resolvedIndices = await resolveIndexReferences(
    interpretation.decomposition.required_indices
  );
  
  // 2. Check jurisdiction coverage
  const jurisdictionCoverage = await checkJurisdictionCoverage(
    resolvedIndices,
    interpretation.decomposition.jurisdiction
  );
  
  // 3. Check time coverage
  const timeCoverage = await checkTimeCoverage(
    resolvedIndices,
    interpretation.decomposition.time
  );
  
  // 4. Fetch primary data
  const primaryData = await fetchIndices(
    resolvedIndices,
    {
      jurisdiction: interpretation.decomposition.jurisdiction,
      time: interpretation.decomposition.time,
      minConfidence: parameters.min_confidence,
    }
  );
  
  // 5. Fetch relations if needed
  let relations: RetrievedRelation[] = [];
  if (parameters.include_relations) {
    relations = await fetchRelations(
      resolvedIndices,
      interpretation.decomposition.relations
    );
  }
  
  // 6. Execute operations
  const operationResults = await executeOperations(
    primaryData,
    relations,
    interpretation.decomposition.operations
  );
  
  // 7. Compile coverage and quality reports
  const coverage = compileCoverageReport(
    interpretation.decomposition.required_indices,
    primaryData
  );
  
  const quality = compileQualityReport(primaryData, relations);
  
  // 8. Identify limitations
  const limitations = identifyLimitations(
    interpretation,
    primaryData,
    jurisdictionCoverage,
    timeCoverage
  );
  
  return {
    status: determineStatus(coverage, limitations),
    data: {
      indices: primaryData,
      relations,
      time_series: operationResults.timeSeries,
      aggregations: operationResults.aggregations,
    },
    coverage,
    quality,
    limitations,
    metadata: {
      execution_time_ms: Date.now() - startTime,
      cache_hit: cacheHit,
      indices_queried: resolvedIndices.length,
      data_points_retrieved: countDataPoints(primaryData),
    },
  };
}
```

### 2.4 Missing Data Handling

```typescript
interface MissingDataNote {
  index: string;
  reason: MissingDataReason;
  alternative: string | null;
  impact: 'critical' | 'significant' | 'minor';
}

type MissingDataReason = 
  | 'index_not_exists'
  | 'jurisdiction_not_covered'
  | 'time_not_covered'
  | 'below_confidence_threshold'
  | 'access_restricted';

// This is CRITICAL - we never hide missing data
function formatMissingDataForLLM(notes: MissingDataNote[]): string {
  if (notes.length === 0) return '';
  
  return `
## Data Limitations

The following data was requested but not available:

${notes.map(note => `
- **${note.index}**: ${formatReason(note.reason)}
  - Impact: ${note.impact}
  ${note.alternative ? `- Alternative: ${note.alternative}` : ''}
`).join('\n')}

You MUST acknowledge these limitations in your response.
`;
}
```

---

## LAYER 3: REASONING + ATTRIBUTION

### 3.1 Purpose

Generate response using ONLY retrieved data, with full attribution.

### 3.2 LLM System Prompt

```typescript
const REASONING_SYSTEM_PROMPT = `
You are a reasoning engine for the Reality Index.

## CRITICAL RULES

1. **You are NOT a knowledge source.**
   You reason ONLY over the verified data provided.
   Never claim to "know" something not in the provided indices.

2. **Every claim must be cited.**
   Format: "Value X [INDEX_ID, confidence: Y%]"
   No uncited claims. Ever.

3. **Confidence is mandatory.**
   Every statement must include its confidence level.
   If combining multiple sources, state the combined confidence.

4. **Limitations are features.**
   Always state what data was NOT available.
   "I don't know" is a valid and important response.

5. **No speculation.**
   Do not extrapolate beyond the data.
   Do not make predictions without explicit historical basis.
   Do not suggest causation from correlation.

6. **Jurisdiction is sacred.**
   Never mix jurisdictions without explicit statement.
   Never assume one jurisdiction's data applies to another.

7. **Time is sacred.**
   Always state the time period of data.
   Never present historical data as current.
   Never present current data as predictive.

## RESPONSE FORMAT

Every response MUST include:

1. **Direct Answer**
   The verified answer to the question.

2. **Data Used**
   List of all indices used with IDs and confidence.

3. **Methodology**
   How the answer was derived.

4. **Limitations**
   What data was missing or uncertain.

5. **Caveats**
   Important context the user should know.

## EXAMPLE RESPONSE

---

**Question**: What is the current inflation rate in Sweden?

**Answer**: 
The Consumer Price Index (CPI) in Sweden increased by 2.3% year-over-year as of January 2024 [cpi_sweden_2024_01, confidence: 100%].

**Data Used**:
- Consumer Price Index Sweden [id: abc123, source: SCB, confidence: 100%]
- Observation date: 2024-01-15
- Valid from: 2024-01-01

**Methodology**:
Direct retrieval of official statistics from Statistics Sweden (SCB).
Year-over-year change calculated from index values.

**Limitations**:
- This is headline CPI. Core inflation (excluding energy/food) may differ.
- Regional variation within Sweden not shown.

**Caveats**:
- CPI methodology was updated in 2023. Comparisons with pre-2023 data should note this change.

---
`;
```

### 3.3 Attribution Format

```typescript
interface AttributedResponse {
  // The main response text
  text: string;
  
  // All citations used
  citations: Citation[];
  
  // Response metadata
  metadata: {
    query_id: UUID;
    generated_at: ISO8601;
    model_used: string;
    reasoning_time_ms: number;
  };
  
  // Confidence summary
  confidence: {
    overall: number;
    breakdown: ConfidenceBreakdown[];
    lowest_component: string;
  };
  
  // Explicit limitations
  limitations: ResponseLimitation[];
  
  // What was NOT answered
  unanswered: {
    aspects: string[];
    reason: string;
  }[];
}

interface Citation {
  id: GlobalHash;
  slug: string;
  
  // What was cited
  claim: string;
  value: ClaimValue;
  
  // Source
  source: {
    authority: string;
    url: URL;
  };
  
  // Context
  context: {
    jurisdiction: string;
    observed_at: ISO8601;
    confidence: number;
  };
  
  // Position in response
  position: {
    start: number;
    end: number;
  };
}

interface ResponseLimitation {
  type: 'missing_data' | 'low_confidence' | 'jurisdiction_gap' | 'time_gap' | 'methodology_change';
  description: string;
  impact: 'critical' | 'significant' | 'minor';
  mitigation: string | null;
}
```

### 3.4 Response Generation

```typescript
async function generateAttributedResponse(
  query: string,
  interpretation: QueryInterpretation,
  executionResult: IndexExecutionResult
): Promise<AttributedResponse> {
  
  // 1. Prepare context for LLM
  const context = prepareReasoningContext(executionResult);
  
  // 2. Generate response with attribution requirements
  const llmResponse = await llm.complete({
    system: REASONING_SYSTEM_PROMPT,
    user: `
## Question
${query}

## Available Data
${formatDataForLLM(executionResult.data)}

## Data Limitations
${formatMissingDataForLLM(executionResult.limitations.missing_data)}

## Quality Report
${formatQualityReport(executionResult.quality)}

## Instructions
1. Answer the question using ONLY the data provided above.
2. Cite every claim with [index_id, confidence: X%].
3. State all limitations explicitly.
4. If the question cannot be fully answered, say so clearly.
`,
  });
  
  // 3. Extract citations from response
  const citations = extractCitations(llmResponse.text, executionResult.data);
  
  // 4. Validate all claims are cited
  const uncitedClaims = findUncitedClaims(llmResponse.text, citations);
  if (uncitedClaims.length > 0) {
    // Re-generate with stricter prompting, or flag for review
    return handleUncitedClaims(uncitedClaims, llmResponse);
  }
  
  // 5. Calculate overall confidence
  const confidence = calculateResponseConfidence(citations, executionResult.quality);
  
  // 6. Compile limitations
  const limitations = compileResponseLimitations(
    executionResult.limitations,
    interpretation,
    citations
  );
  
  return {
    text: llmResponse.text,
    citations,
    metadata: {
      query_id: crypto.randomUUID(),
      generated_at: new Date().toISOString(),
      model_used: llmResponse.model,
      reasoning_time_ms: llmResponse.timing,
    },
    confidence,
    limitations,
    unanswered: identifyUnansweredAspects(interpretation, llmResponse),
  };
}
```

---

# PART II: "I DON'T KNOW" AS A FEATURE

## 2.1 The Power of Uncertainty

```
┌────────────────────────────────────────────────────────────────────┐
│                    "I DON'T KNOW" IS A FEATURE                      │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  EVERYONE ELSE:                                                     │
│  ───────────────                                                    │
│  Q: "What's the crime rate in North Korea?"                         │
│  A: "The crime rate in North Korea is approximately..."             │
│     (hallucinated, unverified, potentially dangerous)               │
│                                                                     │
│  US:                                                                │
│  ───                                                                │
│  Q: "What's the crime rate in North Korea?"                         │
│  A: "No verified data available for this jurisdiction.              │
│      Available jurisdictions for crime indices:                     │
│      Sweden, Germany, France, UK, USA, ... [47 more]"              │
│                                                                     │
│  ═══════════════════════════════════════════════════════════════   │
│                                                                     │
│  THIS BUILDS:                                                       │
│  • Trust (we don't fake it)                                         │
│  • Legal protection (no false claims)                               │
│  • Competitive advantage (others can't match)                       │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
```

## 2.2 Uncertainty Response Types

```typescript
const UNCERTAINTY_RESPONSES = {
  // No data exists
  no_data: {
    template: `
No verified data available for "{query_subject}" in {jurisdiction}.

**Why**: {reason}

**Available alternatives**:
{alternatives}

**Would you like to**: 
- Explore a related index?
- Check a different jurisdiction?
- See the methodology for how this data is collected?
`,
  },
  
  // Data exists but below confidence threshold
  low_confidence: {
    template: `
Data exists but confidence is below threshold ({confidence}% < {threshold}%).

**The data shows**: {value}
**Source**: {source}
**Confidence**: {confidence}%

**Why low confidence**:
{confidence_reasons}

**Would you like to**:
- See the data anyway with caveats?
- Explore the methodology?
- See higher-confidence alternatives?
`,
  },
  
  // Partial data available
  partial_data: {
    template: `
Partial data available for your question.

**What we have**:
{available_data}

**What we're missing**:
{missing_data}

**Impact of missing data**:
{impact_description}

**Answer with available data**:
{partial_answer}

**Confidence in partial answer**: {confidence}%
`,
  },
  
  // Question outside scope
  out_of_scope: {
    template: `
This question cannot be answered with verified indices.

**Why**: {reason}

**What we CAN show you**:
{related_capabilities}

**Reformulated question that we CAN answer**:
"{reformulated_question}"

Would you like to explore that instead?
`,
  },
  
  // Conflicting data
  conflicting_data: {
    template: `
Multiple sources provide conflicting data for this question.

**Source 1**: {source_1_name}
- Value: {source_1_value}
- Confidence: {source_1_confidence}%

**Source 2**: {source_2_name}
- Value: {source_2_value}
- Confidence: {source_2_confidence}%

**Why they differ**:
{difference_explanation}

**Recommendation**: {recommendation}
`,
  },
};
```

## 2.3 Graceful Degradation

```typescript
interface DegradationStrategy {
  level: number;
  condition: string;
  response: DegradedResponse;
}

const DEGRADATION_LEVELS: DegradationStrategy[] = [
  {
    level: 0,
    condition: 'Full data available, high confidence',
    response: {
      type: 'complete',
      show_answer: true,
      show_confidence: true,
      show_limitations: true,
    },
  },
  {
    level: 1,
    condition: 'Full data available, medium confidence (0.6-0.8)',
    response: {
      type: 'complete_with_caveats',
      show_answer: true,
      show_confidence: true,
      show_limitations: true,
      emphasize_uncertainty: true,
    },
  },
  {
    level: 2,
    condition: 'Partial data available',
    response: {
      type: 'partial',
      show_answer: true,
      show_what_missing: true,
      show_impact_of_missing: true,
      offer_alternatives: true,
    },
  },
  {
    level: 3,
    condition: 'Data below confidence threshold (<0.6)',
    response: {
      type: 'low_confidence',
      show_answer: false,  // Don't show by default
      offer_to_show: true,
      explain_why_low: true,
      suggest_alternatives: true,
    },
  },
  {
    level: 4,
    condition: 'No data available',
    response: {
      type: 'no_data',
      show_answer: false,
      explain_why_no_data: true,
      show_alternatives: true,
      show_coverage_map: true,
    },
  },
  {
    level: 5,
    condition: 'Question outside scope entirely',
    response: {
      type: 'out_of_scope',
      show_answer: false,
      explain_scope: true,
      offer_reformulation: true,
      show_what_we_can_do: true,
    },
  },
];
```

---

# PART III: HALLUCINATION ELIMINATION

## 3.1 Why Hallucinations Happen

```
┌────────────────────────────────────────────────────────────────────┐
│                    WHY LLMs HALLUCINATE                             │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  CAUSE 1: Forced to answer without source                          │
│  ─────────────────────────────────────────                          │
│  User asks → LLM has no data → LLM generates plausible answer      │
│  → Answer is fabricated but sounds confident                       │
│                                                                     │
│  OUR SOLUTION: No source = no answer                                │
│  LLM is INSTRUCTED to refuse. System BLOCKS unsourced responses.  │
│                                                                     │
│  ───────────────────────────────────────────────────────────────   │
│                                                                     │
│  CAUSE 2: Broad prompts invite imagination                         │
│  ─────────────────────────────────────────                          │
│  "Tell me about X" → LLM draws on training data → Mixes facts     │
│  with outdated info, assumptions, and pattern completion            │
│                                                                     │
│  OUR SOLUTION: Structured query interpretation                      │
│  Broad question → specific index operations → verified data only   │
│                                                                     │
│  ───────────────────────────────────────────────────────────────   │
│                                                                     │
│  CAUSE 3: Implicit data from training                               │
│  ────────────────────────────────────────                           │
│  LLM "remembers" things from training → Uses as if current facts  │
│  → Training data is frozen, outdated, potentially wrong            │
│                                                                     │
│  OUR SOLUTION: Training knowledge is BLOCKED                        │
│  System prompt explicitly forbids using training knowledge.        │
│  Only retrieved, timestamped indices are allowed.                  │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
```

## 3.2 Anti-Hallucination Architecture

```typescript
const ANTI_HALLUCINATION_SYSTEM = {
  // Pre-generation checks
  pre_checks: {
    // Every query must map to indices
    require_index_mapping: true,
    
    // Block queries that can't be answered
    block_unanswerable: true,
    
    // Require minimum data coverage
    min_coverage: 0.7,
    
    // Require minimum confidence
    min_confidence: 0.6,
  },
  
  // Generation constraints
  generation: {
    // System prompt forbids training knowledge
    block_training_knowledge: true,
    
    // Every claim must have citation
    require_citations: true,
    
    // Temperature low for factual accuracy
    temperature: 0.1,
    
    // Stop sequences for speculation
    stop_sequences: [
      "I think",
      "probably",
      "might be",
      "could be",
      "I believe",
      "it seems",
      "generally",
      "typically",
    ],
  },
  
  // Post-generation validation
  post_checks: {
    // Verify all citations exist in retrieved data
    verify_citations: true,
    
    // Check for uncited claims
    detect_uncited_claims: true,
    
    // Check for speculation language
    detect_speculation: true,
    
    // Check for training data leakage
    detect_training_leakage: true,
  },
  
  // Rejection handling
  rejection: {
    // If post-checks fail
    on_uncited_claim: 'regenerate_or_flag',
    on_speculation: 'remove_and_flag',
    on_training_leakage: 'reject_entirely',
    
    // Human review triggers
    flag_for_review: [
      'multiple_regenerations',
      'low_confidence_answer',
      'partial_data_answer',
    ],
  },
};
```

## 3.3 Citation Verification

```typescript
async function verifyCitations(
  response: string,
  availableData: IndexExecutionResult
): Promise<CitationVerification> {
  // 1. Extract all citations from response
  const citations = extractCitationsFromText(response);
  
  // 2. Build set of available index IDs
  const availableIds = new Set(
    availableData.data.indices.map(i => i.id)
  );
  
  // 3. Verify each citation
  const verified: VerifiedCitation[] = [];
  const invalid: InvalidCitation[] = [];
  
  for (const citation of citations) {
    if (availableIds.has(citation.indexId)) {
      // Citation points to retrieved data
      const sourceData = availableData.data.indices.find(
        i => i.id === citation.indexId
      );
      
      // Verify the claimed value matches
      if (valueMatches(citation.claimedValue, sourceData.current.value)) {
        verified.push({
          ...citation,
          verified: true,
          source: sourceData,
        });
      } else {
        invalid.push({
          ...citation,
          reason: 'value_mismatch',
          claimed: citation.claimedValue,
          actual: sourceData.current.value,
        });
      }
    } else {
      // Citation points to data not in retrieved set
      invalid.push({
        ...citation,
        reason: 'index_not_in_context',
      });
    }
  }
  
  // 4. Detect uncited claims
  const textClaims = extractFactualClaims(response);
  const citedClaims = new Set(verified.map(c => c.position));
  const uncited = textClaims.filter(c => !citedClaims.has(c.position));
  
  return {
    verified,
    invalid,
    uncited,
    all_valid: invalid.length === 0 && uncited.length === 0,
  };
}
```

---

# PART IV: PREMIUM AI FEATURES

## 4.1 Feature Tiers

```typescript
const AI_FEATURE_TIERS = {
  // Free tier
  free: {
    description: 'Basic factual questions with full attribution',
    
    capabilities: [
      'factual_lookup',           // "What is X?"
      'basic_comparison',         // "Compare X and Y"
      'historical_lookup',        // "What was X in 2020?"
      'relation_exploration',     // "What affects X?"
    ],
    
    limits: {
      queries_per_day: 50,
      complexity: 'simple',       // Single index operations
      time_depth: '5_years',
      jurisdictions: 'single',
    },
    
    output: {
      attribution: true,
      confidence: true,
      limitations: true,
      citations: true,
    },
  },
  
  // Analyst tier
  analyst: {
    description: 'Advanced analysis and scenario exploration',
    
    inherits: 'free',
    
    unlocks: [
      'multi_index_analysis',     // Complex queries across many indices
      'trend_analysis',           // "How has X changed over time?"
      'correlation_analysis',     // "What correlates with X?"
      'scenario_exploration',     // "What if X changes?"
      'impact_tracing',           // "If X changes, what else changes?"
    ],
    
    limits: {
      queries_per_day: 500,
      complexity: 'advanced',
      time_depth: 'unlimited',
      jurisdictions: 'multiple',
      simulations_per_day: 20,
    },
    
    output: {
      ...free.output,
      scenario_results: true,
      confidence_intervals: true,
      methodology_details: true,
    },
  },
  
  // Institutional tier
  institutional: {
    description: 'Full reasoning capability with custom models',
    
    inherits: 'analyst',
    
    unlocks: [
      'custom_assumptions',       // Override model parameters
      'monte_carlo_simulation',   // Full probabilistic modeling
      'bayesian_analysis',        // Belief updates with new data
      'private_index_reasoning',  // Include proprietary data
      'batch_analysis',           // Process many queries
      'api_reasoning_access',     // Direct API to reasoning layer
    ],
    
    limits: {
      queries_per_day: 'unlimited',
      complexity: 'unlimited',
      concurrent_simulations: 100,
    },
    
    output: {
      ...analyst.output,
      full_probability_distributions: true,
      raw_computation_results: true,
      custom_export_formats: true,
    },
  },
};
```

## 4.2 Simulation Engine

```typescript
interface SimulationRequest {
  // What to simulate
  scenario: {
    name: string;
    description: string;
    
    // Interventions (changes to make)
    interventions: Intervention[];
    
    // Assumptions (model parameters)
    assumptions: Assumption[];
    
    // Time horizon
    time_horizon: Duration;
  };
  
  // How to simulate
  method: SimulationMethod;
  
  // What to measure
  targets: SimulationTarget[];
}

interface Intervention {
  target_index: GlobalHash;
  type: 'absolute_change' | 'percent_change' | 'set_value';
  value: number;
  timing: 'immediate' | 'gradual';
  duration: Duration | null;
}

interface Assumption {
  parameter: string;
  value: number;
  confidence: number;
  source: 'user_defined' | 'historical' | 'default';
}

type SimulationMethod = 
  | { type: 'historical_analog'; reference_period: TimeRange }
  | { type: 'monte_carlo'; iterations: number; seed: number }
  | { type: 'bayesian'; priors: Record<string, Distribution> };

interface SimulationResult {
  scenario: string;
  method: SimulationMethod;
  
  // Results per target
  impacts: {
    target: SimulationTarget;
    
    // Point estimates
    estimate: {
      baseline: number;
      projected: number;
      change_absolute: number;
      change_percent: number;
    };
    
    // Uncertainty
    confidence_interval: {
      level: number;       // 0.95 for 95% CI
      lower: number;
      upper: number;
    };
    
    // Distribution (for monte carlo)
    distribution: {
      mean: number;
      median: number;
      std_dev: number;
      percentiles: Record<number, number>;
    } | null;
    
    // Timing
    timing: {
      first_impact: Duration;
      peak_impact: Duration;
      stabilization: Duration | null;
    };
    
    // Causation path
    causation: {
      path: GlobalHash[];
      contribution_per_step: number[];
    };
  }[];
  
  // Overall quality
  quality: {
    confidence: number;
    data_coverage: number;
    assumption_sensitivity: number;
  };
  
  // Warnings and limitations
  warnings: SimulationWarning[];
  limitations: string[];
  
  // Methodology
  methodology: {
    description: string;
    assumptions_used: Assumption[];
    relations_used: GlobalHash[];
    historical_basis: TimeRange | null;
  };
}
```

## 4.3 Custom Assumption Engine

```typescript
interface AssumptionEngine {
  // User can override these
  configurable: {
    // Time lags between cause and effect
    time_lags: Record<string, Duration>;
    
    // Relation strengths
    relation_strengths: Record<string, number>;
    
    // Confidence thresholds
    confidence_thresholds: Record<string, number>;
    
    // Propagation decay
    propagation_decay: number;
    
    // Feedback loops
    enable_feedback_loops: boolean;
  };
  
  // User cannot override these (safety)
  immutable: {
    // Data source hierarchy
    source_priority: string[];
    
    // Maximum propagation depth
    max_propagation_depth: number;
    
    // Minimum confidence for inclusion
    absolute_min_confidence: number;
  };
  
  // Validation
  validate: (assumptions: Assumption[]) => ValidationResult;
  
  // Explain impact of assumptions
  explain: (assumptions: Assumption[]) => AssumptionImpact[];
}
```

---

# PART V: API FOR EXTERNAL AI SYSTEMS

## 5.1 AI-to-AI Interface

```typescript
// External AI systems can query us directly
const AI_API = {
  // Grounding endpoint
  ground: {
    endpoint: '/api/v1/ai/ground',
    method: 'POST',
    
    request: {
      claim: string;              // Claim to verify
      jurisdiction: string;       // Required scope
      time: TimeRange | null;     // Optional time scope
    },
    
    response: {
      verified: boolean;
      confidence: number;
      source: IndexReference | null;
      corrections: Correction[];  // If claim was wrong
    },
  },
  
  // Structured query endpoint
  query: {
    endpoint: '/api/v1/ai/query',
    method: 'POST',
    
    request: {
      query: string;              // Natural language query
      require_confidence: number; // Minimum confidence
      max_results: number;
    },
    
    response: {
      answer: string;
      citations: Citation[];
      confidence: number;
      limitations: string[];
    },
  },
  
  // RAG-optimized endpoint
  retrieve: {
    endpoint: '/api/v1/ai/retrieve',
    method: 'POST',
    
    request: {
      topics: string[];           // Semantic search topics
      filters: FilterSet;
      format: 'structured' | 'natural' | 'embeddings';
    },
    
    response: {
      documents: RetrievedDocument[];
      metadata: RetrievalMetadata;
    },
  },
  
  // Fact-check endpoint
  factcheck: {
    endpoint: '/api/v1/ai/factcheck',
    method: 'POST',
    
    request: {
      statements: string[];       // Statements to check
      context: FactCheckContext;
    },
    
    response: {
      results: FactCheckResult[];
    },
  },
};

interface FactCheckResult {
  statement: string;
  
  verdict: 'verified' | 'contradicted' | 'unverifiable' | 'partially_true';
  
  evidence: {
    supporting: IndexReference[];
    contradicting: IndexReference[];
  };
  
  confidence: number;
  
  correction: string | null;    // If contradicted
  
  nuance: string | null;        // If partially true
}
```

## 5.2 Becoming AI Backbone

```
┌────────────────────────────────────────────────────────────────────┐
│                    BECOMING AI INFRASTRUCTURE                       │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  WHAT WE PROVIDE:                                                   │
│  ─────────────────                                                  │
│  • Verified facts with timestamps                                   │
│  • Structured relations between concepts                            │
│  • Confidence scores for every claim                                │
│  • Full provenance chains                                           │
│  • Jurisdiction-aware data                                          │
│  • Historical versions                                              │
│                                                                     │
│  WHO USES US:                                                       │
│  ──────────────                                                     │
│  • Other LLM applications (grounding)                               │
│  • Search engines (factual verification)                            │
│  • News organizations (fact-checking)                               │
│  • Government systems (policy AI)                                   │
│  • Enterprise copilots (decision support)                           │
│  • Research tools (data analysis)                                   │
│                                                                     │
│  WHY THEY USE US:                                                   │
│  ─────────────────                                                  │
│  • We're more reliable than training data                           │
│  • We're more current than any model                                │
│  • We're more structured than web scraping                          │
│  • We're more defensible than guessing                              │
│                                                                     │
│  ═══════════════════════════════════════════════════════════════   │
│                                                                     │
│  WE DON'T COMPETE WITH AI COMPANIES.                                │
│  WE BECOME WHAT THEY MUST RELY ON.                                  │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
```

## 5.3 The Real Power

```
┌────────────────────────────────────────────────────────────────────┐
│                    THE REAL POWER                                   │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Whoever controls:                                                  │
│                                                                     │
│    • The INDICES                                                    │
│    • The RELATIONS                                                  │
│    • The VALIDITY over TIME                                         │
│                                                                     │
│  ...controls how AI perceives reality.                              │
│                                                                     │
│  ═══════════════════════════════════════════════════════════════   │
│                                                                     │
│  This is bigger than:                                               │
│    • Search (Google)                                                │
│    • Social media (Meta)                                            │
│    • Individual AI models (OpenAI)                                  │
│                                                                     │
│  This is:                                                           │
│                                                                     │
│  ╔═══════════════════════════════════════════════════════════════╗ │
│  ║                                                                 ║ │
│  ║         CIVILIZATIONAL INFRASTRUCTURE                          ║ │
│  ║                                                                 ║ │
│  ║         The external memory of machine intelligence            ║ │
│  ║                                                                 ║ │
│  ╚═══════════════════════════════════════════════════════════════╝ │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
```

---

**END OF LLM INTEGRATION SPECIFICATION**

*"LLM thinks. Index knows. Together: verified intelligence."*
