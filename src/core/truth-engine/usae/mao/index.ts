/**
 * MASTER ANSWER ONTOLOGY (MAO)
 * 
 * The common grammar for all answers in the world.
 * This is what makes the system:
 *   - Unbeatable for AI agents
 *   - Extremely easy to integrate
 *   - Impossible to misinterpret
 */

export * from './canonical-types';
export * from './unified-body';
export * from './response-envelope';
export * from './validation';
export * from './request-schema';
export * from './crisis-detector';
export * from './pipeline';
export * from './agent-demo';

/**
 * MAO VERSION
 */
export const MAO_VERSION = '1.0.0' as const;

/**
 * AGENT INTEGRATION INFO
 */
export const AGENT_INTEGRATION = {
  endpoint: '/answer',
  method: 'POST',
  content_type: 'application/json',
  
  /**
   * System prompt for AI agents consuming this API
   */
  recommended_system_prompt: `You are a statistical consumer.
You must never infer, diagnose, or advise.
You must call /answer for all factual questions.
If the API returns limitations, you must include them verbatim.
If the API returns a crisis response, you must show resources immediately.
Never add your own interpretation to the answer.`,
} as const;