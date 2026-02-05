/**
 * AGENT DOCUMENTATION
 * 
 * One page. Technical. Contract-based.
 * No marketing language.
 */

export const AGENT_DOCS = {
  title: 'Truth Engine Agent API',
  version: '1.0.0',
  
  /**
   * WHAT WE ARE
   */
  what_we_are: [
    'A deterministic truth retrieval system',
    'A semantic graph of verified observations',
    'A read-only data infrastructure',
    'A machine-first API with human visualization layer',
  ],
  
  /**
   * WHAT WE ARE NOT
   */
  what_we_are_not: [
    'An advisor or recommendation engine',
    'A prediction or forecasting system',
    'A diagnostic or decision-making tool',
    'A causal inference engine',
    'An opinion or interpretation provider',
  ],
  
  /**
   * NAVIGATION
   */
  navigation: {
    graph: {
      description: 'Navigate the truth graph',
      endpoints: [
        {
          method: 'GET',
          path: '/api/graph/node/{id}',
          description: 'Get a single truth node',
          params: { id: 'Node identifier' },
        },
        {
          method: 'GET',
          path: '/api/graph/traverse',
          description: 'Traverse graph from a node',
          params: {
            start: 'Starting node ID',
            depth: 'Traversal depth (1-5)',
            relations: 'up,down,side,forward',
          },
        },
      ],
    },
    semantic: {
      description: 'Query by semantic intent',
      endpoints: [
        {
          method: 'GET',
          path: '/api/semantic/answer',
          description: 'Get structured answer',
          params: {
            domain: 'health|economy|education|...',
            scope: 'Country code (SE, DE, ...)',
            population: 'Population segment',
          },
        },
      ],
    },
    index: {
      description: 'Access composite indices',
      endpoints: [
        {
          method: 'GET',
          path: '/api/index/{index_id}',
          description: 'Get index value and components',
          params: {
            version: 'Index version (v1, v2, ...)',
            time: 'Time range (2020-2024)',
          },
        },
      ],
    },
    decision: {
      description: 'Resolve decision graphs',
      endpoints: [
        {
          method: 'GET',
          path: '/api/decision/{graph_id}/resolve',
          description: 'Get decision context (data only)',
          params: {
            scope: 'Geographic scope',
          },
        },
      ],
    },
  },
  
  /**
   * UNCERTAINTY INTERPRETATION
   */
  uncertainty: {
    description: 'How to interpret uncertainty envelopes',
    
    confidence: {
      range: '0.0 to 1.0',
      interpretation: {
        'above_0.8': 'High confidence - multiple agreeing sources',
        '0.5_to_0.8': 'Moderate confidence - some uncertainty',
        'below_0.5': 'Low confidence - treat with caution',
      },
    },
    
    coverage: {
      range: '0.0 to 1.0',
      interpretation: {
        'above_0.9': 'Complete data coverage',
        '0.7_to_0.9': 'Good coverage with minor gaps',
        'below_0.7': 'Significant data gaps',
      },
    },
    
    gaps: {
      types: ['temporal', 'geographic', 'demographic', 'methodological'],
      impact_levels: ['low', 'medium', 'high'],
      action: 'Always display gaps to end users',
    },
    
    rules: [
      'Never ignore uncertainty envelope',
      'High uncertainty = do not present as fact',
      'Gaps MUST be communicated to users',
      'Source disagreement = explicit warning',
    ],
  },
  
  /**
   * MANDATORY HEADERS
   */
  headers: {
    required: {
      'X-Agent-Policy': {
        description: 'Policy flags for response filtering',
        example: 'no-advice,no-individual,no-recommendation',
        consequence_if_missing: 'Request throttled (429)',
      },
    },
    optional: {
      'Authorization': {
        description: 'Bearer token for authenticated access',
        example: 'Bearer sk_live_xxx',
      },
      'Accept-Version': {
        description: 'Pin to specific API version',
        example: '1.0.0',
      },
    },
  },
  
  /**
   * RESPONSE GUARANTEES
   */
  guarantees: {
    determinism: 'Same query = same response (until new version)',
    versioning: 'All responses include version pin',
    pagination: 'Stable cursor-based pagination',
    caching: 'cache_key + cache_valid_until in every response',
    completeness: 'All fields mandatory - HTTP 409 if incomplete',
  },
  
  /**
   * ERROR CODES
   */
  errors: {
    400: 'Bad request - invalid parameters',
    403: 'Forbidden - policy violation detected',
    404: 'Not found - node does not exist',
    409: 'Semantic conflict - incomplete data',
    429: 'Throttled - missing policy header',
    500: 'Internal error - should not happen',
  },
  
  /**
   * SDK
   */
  sdk: {
    functions: 3,
    list: [
      'getTruthNode(id) - Retrieve single node',
      'traverseGraph(start, depth) - Navigate graph',
      'resolveDecision(graphId, scope) - Get decision context',
    ],
    installation: 'npm install @truth-engine/agent-sdk',
    design_principle: 'Does nothing smart. Makes wrong impossible.',
  },
} as const;

/**
 * GENERATE MARKDOWN DOCS
 */
export function generateMarkdownDocs(): string {
  const lines: string[] = [];
  
  lines.push('# Truth Engine Agent API');
  lines.push('');
  lines.push(`Version: ${AGENT_DOCS.version}`);
  lines.push('');
  
  lines.push('## What We Are');
  AGENT_DOCS.what_we_are.forEach(item => lines.push(`- ${item}`));
  lines.push('');
  
  lines.push('## What We Are NOT');
  AGENT_DOCS.what_we_are_not.forEach(item => lines.push(`- ${item}`));
  lines.push('');
  
  lines.push('## Endpoints');
  lines.push('');
  
  for (const [category, data] of Object.entries(AGENT_DOCS.navigation)) {
    lines.push(`### ${category.charAt(0).toUpperCase() + category.slice(1)}`);
    lines.push(data.description);
    lines.push('');
    
    for (const endpoint of data.endpoints) {
      lines.push(`**${endpoint.method} ${endpoint.path}**`);
      lines.push(endpoint.description);
      lines.push('');
    }
  }
  
  lines.push('## Uncertainty');
  lines.push('');
  lines.push('### Confidence Score');
  lines.push(`Range: ${AGENT_DOCS.uncertainty.confidence.range}`);
  lines.push('');
  
  lines.push('### Rules');
  AGENT_DOCS.uncertainty.rules.forEach(rule => lines.push(`- ${rule}`));
  lines.push('');
  
  lines.push('## Required Headers');
  lines.push('```');
  lines.push('X-Agent-Policy: no-advice,no-individual,no-recommendation');
  lines.push('```');
  lines.push('');
  
  lines.push('## SDK');
  lines.push('```typescript');
  lines.push("import { createAgentSDK } from '@truth-engine/agent-sdk';");
  lines.push('');
  lines.push("const sdk = createAgentSDK({ baseUrl: 'https://api.truth-engine.io' });");
  lines.push('');
  lines.push("const node = await sdk.getTruthNode('TN:health:SE:2024');");
  lines.push("const graph = await sdk.traverseGraph('TN:health:SE:2024', 2);");
  lines.push("const decision = await sdk.resolveDecision('DG:policy:health', 'SE');");
  lines.push('```');
  lines.push('');
  
  lines.push('---');
  lines.push('');
  lines.push('**Machine-First Declaration:**');
  lines.push('');
  lines.push('> This system is designed for machines first.');
  lines.push('> Humans are a visualization layer.');
  
  return lines.join('\n');
}

/**
 * MACHINE-FIRST DECLARATION
 */
export const MACHINE_FIRST_DECLARATION = {
  statement: 'This system is designed for machines first. Humans are a visualization layer.',
  implications: [
    'API contracts are the primary interface',
    'Human UI is derived from machine-readable data',
    'All truth is structured before it is displayed',
    'No information exists only in human form',
  ],
  published_at: new Date().toISOString(),
  version: '1.0.0',
} as const;
