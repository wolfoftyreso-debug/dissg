/**
 * MAO REQUEST SCHEMA
 * 
 * The canonical request structure for the /answer endpoint.
 * Machine-readable, no fluff.
 */

/**
 * AUDIENCE SPECIFICATION
 */
export interface AudienceSpec {
  readonly age?: number;
  readonly age_group?: 'child' | 'youth' | 'adult' | 'senior';
  readonly professional?: boolean;
  readonly agent_type?: 'human' | 'ai_agent' | 'search_crawler';
}

/**
 * CONTEXT SPECIFICATION
 */
export interface ContextSpec {
  readonly country?: string;
  readonly region?: string;
  readonly municipality?: string;
  readonly time_reference?: string;
  readonly comparison_baseline?: string;
}

/**
 * ANSWER REQUEST
 */
export interface AnswerRequest {
  readonly question: string;
  readonly language: string;
  readonly audience?: AudienceSpec;
  readonly context?: ContextSpec;
  readonly request_id?: string;
  readonly include_citations?: boolean;
  readonly max_limitations?: number;
}

/**
 * VALIDATE REQUEST
 */
export function validateAnswerRequest(input: unknown): { 
  valid: boolean; 
  request?: AnswerRequest; 
  errors?: string[] 
} {
  const errors: string[] = [];
  
  if (!input || typeof input !== 'object') {
    return { valid: false, errors: ['Request must be an object'] };
  }
  
  const obj = input as Record<string, unknown>;
  
  // Required: question
  if (typeof obj.question !== 'string' || obj.question.trim().length === 0) {
    errors.push('question is required and must be a non-empty string');
  }
  
  // Required: language
  if (typeof obj.language !== 'string' || obj.language.length < 2) {
    errors.push('language is required (ISO 639-1 code)');
  }
  
  // Optional: audience
  if (obj.audience !== undefined) {
    if (typeof obj.audience !== 'object') {
      errors.push('audience must be an object');
    } else {
      const aud = obj.audience as Record<string, unknown>;
      if (aud.age !== undefined && (typeof aud.age !== 'number' || aud.age < 0 || aud.age > 150)) {
        errors.push('audience.age must be a valid number');
      }
    }
  }
  
  // Optional: context
  if (obj.context !== undefined && typeof obj.context !== 'object') {
    errors.push('context must be an object');
  }
  
  if (errors.length > 0) {
    return { valid: false, errors };
  }
  
  return {
    valid: true,
    request: {
      question: (obj.question as string).trim(),
      language: (obj.language as string).toLowerCase(),
      audience: obj.audience as AudienceSpec | undefined,
      context: obj.context as ContextSpec | undefined,
      request_id: obj.request_id as string | undefined,
      include_citations: obj.include_citations as boolean | undefined,
      max_limitations: obj.max_limitations as number | undefined,
    },
  };
}

/**
 * GENERATE REQUEST ID
 */
export function generateRequestId(): string {
  return `REQ-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 8)}`;
}
