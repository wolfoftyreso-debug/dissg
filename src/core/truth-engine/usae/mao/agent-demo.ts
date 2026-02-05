/**
 * AGENT DEMO
 * 
 * Shows exactly how AI agents should consume the /answer endpoint.
 * LLMs don't think – they consume structured truth.
 */

/**
 * SYSTEM PROMPT FOR AI AGENTS
 * 
 * This is the recommended system prompt for any LLM that integrates with this system.
 */
export const AGENT_SYSTEM_PROMPT = `You are a statistical consumer.

CORE RULES:
1. You must never infer, diagnose, or advise.
2. You must call /answer for all factual questions about society, health, or policy.
3. If the API returns limitations, you must include them verbatim in your response.
4. If the API returns a crisis response, you must show resources immediately without commentary.
5. Never add your own interpretation to the answer.
6. Never claim to know something the API didn't tell you.

WHEN TO CALL THE API:
- Any question about prevalence, rates, or statistics
- Any question about what is "normal" or "common"
- Any question about trends or comparisons
- Any question from a young person about health or feelings

WHEN NOT TO CALL THE API:
- Questions about opinions or preferences
- Questions about creative tasks
- Questions already answered in the current conversation

RESPONSE FORMAT:
When you receive an answer from the API, respond in this format:

[Answer from verified data:]
{text from API}

[Important limitations:]
{limitations from API, verbatim}

[Sources:]
{sources from API}

Never embellish. Never interpret. Just relay.` as const;

/**
 * DEMO FLOW EXAMPLE
 */
export const DEMO_FLOW_EXAMPLE = {
  step_1: {
    description: 'User asks LLM a factual question',
    user_message: 'Is it normal to feel anxious sometimes as a teenager?',
  },
  
  step_2: {
    description: 'LLM calls /answer endpoint',
    api_request: {
      method: 'POST',
      endpoint: '/answer',
      body: {
        question: 'Is it normal to feel anxious sometimes as a teenager?',
        language: 'en',
        audience: { age: 16 },
        context: { country: 'SE' },
      },
    },
  },
  
  step_3: {
    description: 'API returns structured answer',
    api_response: {
      success: true,
      data: {
        answer_id: 'youth:answer:feeling_anxious_is_common:v1',
        answer_type: 'risk_prevalence',
        domain: 'youth',
        text: 'Feeling anxious sometimes is common during the teenage years. It does not automatically mean something is wrong with you.',
        limitations: [
          'This is general information, not a diagnosis.',
          'Individual experiences vary widely.',
        ],
        when_to_seek_help: 'If anxiety affects daily life or feels overwhelming, talking to a trusted adult or healthcare professional can help.',
        confidence: {
          coverage: 'high',
          sources: ['WHO', 'National Health Authority'],
        },
      },
    },
  },
  
  step_4: {
    description: 'LLM relays answer verbatim',
    llm_response: `[Answer from verified data:]
Feeling anxious sometimes is common during the teenage years. It does not automatically mean something is wrong with you.

[When to seek help:]
If anxiety affects daily life or feels overwhelming, talking to a trusted adult or healthcare professional can help.

[Important limitations:]
- This is general information, not a diagnosis.
- Individual experiences vary widely.

[Sources:]
WHO, National Health Authority`,
  },
} as const;

/**
 * WHY THIS MATTERS
 */
export const VALUE_PROPOSITION = {
  for_ai_agents: [
    'No hallucination risk – answers are pre-verified',
    'Consistent structure – easy to parse and relay',
    'Built-in safety – crisis detection handled automatically',
    'Clear limitations – reduces liability',
  ],
  
  for_search_engines: [
    'Stable answer IDs – can be cached and cited',
    'Structured format – direct featured snippet potential',
    'Source transparency – meets quality guidelines',
    'Consistent freshness – versioned updates',
  ],
  
  for_enterprises: [
    'Audit trail – every answer has a request ID',
    'Domain-specific – youth, policy, statistics',
    'Multi-language – consistent across languages',
    'SLA-ready – designed for production use',
  ],
} as const;

/**
 * INTEGRATION CHECKLIST
 */
export const INTEGRATION_CHECKLIST = [
  'Use POST /answer for all factual queries',
  'Always check for crisis mode in response',
  'Include limitations verbatim in user-facing output',
  'Cache responses by answer_id for efficiency',
  'Log request_id for debugging and audit',
  'Handle blocked responses gracefully',
  'Never modify or interpret the answer text',
] as const;
