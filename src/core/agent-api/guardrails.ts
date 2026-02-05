/**
 * AGENT GUARDRAILS
 * 
 * Machine-enforced policy compliance.
 * No advice, no individual interpretation, no recommendations.
 */

/**
 * AGENT POLICY HEADER
 */
export const AGENT_POLICY_HEADER = 'X-Agent-Policy';

/**
 * POLICY FLAGS
 */
export type PolicyFlag = 
  | 'no-advice'
  | 'no-individual'
  | 'no-recommendation'
  | 'no-causation'
  | 'no-ranking'
  | 'data-only';

/**
 * PARSED POLICY
 */
export interface AgentPolicy {
  flags: Set<PolicyFlag>;
  strict: boolean;
  version: string;
}

/**
 * POLICY VIOLATION
 */
export interface PolicyViolation {
  code: string;
  flag: PolicyFlag;
  description: string;
  blocked: boolean;
  logged_at: string;
}

/**
 * GUARDRAIL RESULT
 */
export interface GuardrailResult {
  passed: boolean;
  violations: PolicyViolation[];
  policy_applied: AgentPolicy;
  throttled: boolean;
  blocked: boolean;
}

/**
 * DEFAULT POLICY (strictest)
 */
export const DEFAULT_POLICY: AgentPolicy = {
  flags: new Set([
    'no-advice',
    'no-individual',
    'no-recommendation',
    'no-causation',
    'no-ranking',
    'data-only',
  ]),
  strict: true,
  version: '1.0',
};

/**
 * PARSE POLICY HEADER
 */
export function parseAgentPolicy(header: string | null): AgentPolicy | null {
  if (!header) return null;
  
  const flags = new Set<PolicyFlag>();
  const parts = header.split(',').map(p => p.trim().toLowerCase());
  
  for (const part of parts) {
    if (isValidPolicyFlag(part)) {
      flags.add(part);
    }
  }
  
  return {
    flags,
    strict: flags.size >= 3,
    version: '1.0',
  };
}

/**
 * CHECK IF VALID POLICY FLAG
 */
function isValidPolicyFlag(value: string): value is PolicyFlag {
  return [
    'no-advice',
    'no-individual',
    'no-recommendation',
    'no-causation',
    'no-ranking',
    'data-only',
  ].includes(value);
}

/**
 * CONTENT PATTERNS TO BLOCK
 */
const BLOCKED_PATTERNS = {
  'no-advice': [
    /\b(should|bör|must|måste|recommend|rekommendera)\b/i,
    /\b(you need to|du behöver|take action|vidta åtgärd)\b/i,
    /\b(best|bäst|optimal|rätt val)\b/i,
  ],
  'no-individual': [
    /\b(you have|du har|you are|du är)\b/i,
    /\b(your|din|ditt|dina)\b/i,
    /\b(personally|personligen|in your case|i ditt fall)\b/i,
  ],
  'no-recommendation': [
    /\b(we recommend|vi rekommenderar|our advice|vårt råd)\b/i,
    /\b(consider doing|överväg att|it would be wise)\b/i,
  ],
  'no-causation': [
    /\b(caused by|orsakas av|leads to|leder till)\b/i,
    /\b(because of|på grund av|therefore|därför)\b/i,
  ],
  'no-ranking': [
    /\b(best|bäst|worst|sämst|top|bottom)\b/i,
    /\b(number one|nummer ett|leading|ledande)\b/i,
  ],
} as const;

/**
 * CHECK CONTENT AGAINST POLICY
 */
export function checkContentAgainstPolicy(
  content: string,
  policy: AgentPolicy
): PolicyViolation[] {
  const violations: PolicyViolation[] = [];
  
  for (const flag of policy.flags) {
    const patterns = BLOCKED_PATTERNS[flag as keyof typeof BLOCKED_PATTERNS];
    if (!patterns) continue;
    
    for (const pattern of patterns) {
      const match = content.match(pattern);
      if (match) {
        violations.push({
          code: `POLICY_${flag.toUpperCase().replace('-', '_')}`,
          flag,
          description: `Content matches blocked pattern: "${match[0]}"`,
          blocked: policy.strict,
          logged_at: new Date().toISOString(),
        });
      }
    }
  }
  
  return violations;
}

/**
 * RUN GUARDRAIL CHECK
 */
export function runGuardrailCheck(
  policyHeader: string | null,
  responseContent: string
): GuardrailResult {
  // Parse or use default
  const policy = parseAgentPolicy(policyHeader) || DEFAULT_POLICY;
  
  // Check if header was missing
  const headerMissing = policyHeader === null;
  
  // Check content
  const violations = checkContentAgainstPolicy(responseContent, policy);
  
  // Determine throttle/block
  const hasBlockingViolation = violations.some(v => v.blocked);
  
  return {
    passed: violations.length === 0,
    violations,
    policy_applied: policy,
    throttled: headerMissing,
    blocked: hasBlockingViolation,
  };
}

/**
 * CREATE GUARDRAIL MIDDLEWARE RESPONSE
 */
export function createGuardrailResponse(result: GuardrailResult): {
  status: number;
  headers: Record<string, string>;
  body: unknown;
} {
  if (result.blocked) {
    return {
      status: 403,
      headers: {
        'X-Guardrail-Blocked': 'true',
        'X-Policy-Violations': result.violations.map(v => v.code).join(','),
      },
      body: {
        error: 'policy_violation',
        code: 403,
        violations: result.violations,
        message: 'Response blocked due to policy violations',
      },
    };
  }
  
  if (result.throttled) {
    return {
      status: 429,
      headers: {
        'X-Guardrail-Throttled': 'true',
        'X-Required-Header': AGENT_POLICY_HEADER,
        'Retry-After': '1',
      },
      body: {
        error: 'policy_header_missing',
        code: 429,
        message: `Missing required header: ${AGENT_POLICY_HEADER}`,
        example: 'X-Agent-Policy: no-advice,no-individual,no-recommendation',
      },
    };
  }
  
  return {
    status: 200,
    headers: {
      'X-Guardrail-Passed': 'true',
      'X-Policy-Applied': [...result.policy_applied.flags].join(','),
    },
    body: null,
  };
}

/**
 * VALIDATE REQUEST HAS POLICY HEADER
 */
export function requirePolicyHeader(headers: Record<string, string>): {
  valid: boolean;
  policy: AgentPolicy | null;
  error: string | null;
} {
  const headerValue = headers[AGENT_POLICY_HEADER] || 
                      headers[AGENT_POLICY_HEADER.toLowerCase()];
  
  if (!headerValue) {
    return {
      valid: false,
      policy: null,
      error: `Missing required header: ${AGENT_POLICY_HEADER}`,
    };
  }
  
  const policy = parseAgentPolicy(headerValue);
  
  if (!policy || policy.flags.size === 0) {
    return {
      valid: false,
      policy: null,
      error: 'Invalid policy header format',
    };
  }
  
  return {
    valid: true,
    policy,
    error: null,
  };
}
