/**
 * AGENT SDK
 * 
 * Minimal, sharp. Three functions. Period.
 * The SDK does nothing smart. It makes it impossible to do wrong.
 */

import type { 
  AgentResponse, 
  GraphNodeResponse, 
  GraphTraversalResponse,
  DecisionResolveResponse,
  SemanticConflictError,
} from './schemas';
import { AGENT_POLICY_HEADER } from './guardrails';

/**
 * SDK CONFIGURATION
 */
export interface AgentSDKConfig {
  baseUrl: string;
  apiKey?: string;
  timeout?: number;
  retries?: number;
  policyFlags?: string[];
}

/**
 * SDK RESPONSE
 */
export type SDKResponse<T> = 
  | { success: true; data: T; cached: boolean; version: string }
  | { success: false; error: SemanticConflictError | Error };

/**
 * AGENT SDK CLASS
 */
export class TruthEngineSDK {
  private config: Required<AgentSDKConfig>;
  private cache: Map<string, { data: unknown; validUntil: number }> = new Map();

  constructor(config: AgentSDKConfig) {
    this.config = {
      baseUrl: config.baseUrl.replace(/\/$/, ''),
      apiKey: config.apiKey || '',
      timeout: config.timeout || 10000,
      retries: config.retries || 3,
      policyFlags: config.policyFlags || [
        'no-advice',
        'no-individual',
        'no-recommendation',
      ],
    };
  }

  /**
   * FUNCTION 1: GET TRUTH NODE
   * 
   * Retrieves a single truth node by ID.
   * Returns full node with all mandatory envelopes.
   */
  async getTruthNode(id: string): Promise<SDKResponse<AgentResponse<GraphNodeResponse>>> {
    const cacheKey = `node:${id}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      return { 
        success: true, 
        data: cached as AgentResponse<GraphNodeResponse>, 
        cached: true,
        version: (cached as AgentResponse<GraphNodeResponse>).version,
      };
    }

    try {
      const response = await this.fetch<AgentResponse<GraphNodeResponse>>(
        `/api/graph/node/${encodeURIComponent(id)}`
      );
      
      this.setCache(cacheKey, response, 300000); // 5 min cache
      
      return { 
        success: true, 
        data: response, 
        cached: false,
        version: response.version,
      };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error : new Error('Unknown error'),
      };
    }
  }

  /**
   * FUNCTION 2: TRAVERSE GRAPH
   * 
   * Traverses the truth graph from a starting node.
   * Returns connected nodes up to specified depth.
   */
  async traverseGraph(
    startId: string,
    depth: number = 2,
    directions: ('up' | 'down' | 'side' | 'forward')[] = ['up', 'side', 'forward']
  ): Promise<SDKResponse<AgentResponse<GraphTraversalResponse>>> {
    const cacheKey = `traverse:${startId}:${depth}:${directions.join(',')}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      return { 
        success: true, 
        data: cached as AgentResponse<GraphTraversalResponse>, 
        cached: true,
        version: (cached as AgentResponse<GraphTraversalResponse>).version,
      };
    }

    try {
      const params = new URLSearchParams({
        start: startId,
        depth: String(depth),
        relations: directions.join(','),
      });

      const response = await this.fetch<AgentResponse<GraphTraversalResponse>>(
        `/api/graph/traverse?${params}`
      );
      
      this.setCache(cacheKey, response, 300000);
      
      return { 
        success: true, 
        data: response, 
        cached: false,
        version: response.version,
      };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error : new Error('Unknown error'),
      };
    }
  }

  /**
   * FUNCTION 3: RESOLVE DECISION
   * 
   * Resolves a decision graph for a given scope.
   * Returns data only - NO recommendations, NO advice.
   */
  async resolveDecision(
    graphId: string,
    scope: string
  ): Promise<SDKResponse<AgentResponse<DecisionResolveResponse>>> {
    const cacheKey = `decision:${graphId}:${scope}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      return { 
        success: true, 
        data: cached as AgentResponse<DecisionResolveResponse>, 
        cached: true,
        version: (cached as AgentResponse<DecisionResolveResponse>).version,
      };
    }

    try {
      const params = new URLSearchParams({ scope });
      
      const response = await this.fetch<AgentResponse<DecisionResolveResponse>>(
        `/api/decision/${encodeURIComponent(graphId)}/resolve?${params}`
      );
      
      this.setCache(cacheKey, response, 60000); // 1 min cache for decisions
      
      return { 
        success: true, 
        data: response, 
        cached: false,
        version: response.version,
      };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error : new Error('Unknown error'),
      };
    }
  }

  /**
   * INTERNAL: FETCH WITH RETRIES
   */
  private async fetch<T>(path: string): Promise<T> {
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt < this.config.retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(
          () => controller.abort(),
          this.config.timeout
        );

        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          [AGENT_POLICY_HEADER]: this.config.policyFlags.join(','),
        };

        if (this.config.apiKey) {
          headers['Authorization'] = `Bearer ${this.config.apiKey}`;
        }

        const response = await fetch(`${this.config.baseUrl}${path}`, {
          method: 'GET',
          headers,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const error = await response.json();
          
          if (response.status === 409) {
            throw error as SemanticConflictError;
          }
          
          throw new Error(error.message || `HTTP ${response.status}`);
        }

        return await response.json();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        
        // Don't retry semantic conflicts
        if ((error as SemanticConflictError).code === 409) {
          throw error;
        }
        
        // Wait before retry
        if (attempt < this.config.retries - 1) {
          await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
        }
      }
    }

    throw lastError || new Error('Request failed');
  }

  /**
   * CACHE MANAGEMENT
   */
  private getFromCache(key: string): unknown | null {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    if (Date.now() > cached.validUntil) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }

  private setCache(key: string, data: unknown, ttlMs: number): void {
    this.cache.set(key, {
      data,
      validUntil: Date.now() + ttlMs,
    });
  }

  /**
   * CLEAR CACHE
   */
  clearCache(): void {
    this.cache.clear();
  }
}

/**
 * CREATE SDK INSTANCE
 */
export function createAgentSDK(config: AgentSDKConfig): TruthEngineSDK {
  return new TruthEngineSDK(config);
}

/**
 * SDK EXPORTS - CORE RESOLVE METHOD (THE MAIN ONE)
 */
export const SDK_FUNCTIONS = {
  getTruthNode: 'Retrieves a single truth node by ID',
  traverseGraph: 'Traverses the graph from a starting node',
  resolveDecision: 'Resolves a decision graph for a scope',
  resolve: 'Query → Canonical Answer (main method for AI agents)',
} as const;

/**
 * SDK CONTRACT - TRUST HANDSHAKE
 */
export const SDK_CONTRACT = {
  version: '1.0.0',
  functions: 4,
  
  // Trust handshake (makes AI agents trust you)
  guarantees: {
    no_opinion: true,
    no_speculation: true,
    source_traceable: true,
    revision_logged: true,
  },
  
  api_guarantees: [
    'Deterministic responses',
    'Version-pinned results',
    'No advice or recommendations',
    'All uncertainty included',
    'Stable pagination',
  ],
  
  rate_limits: {
    free: { requests_per_minute: 10, answer_depth: 'short' },
    pro: { requests_per_minute: 100, answer_depth: 'full', numerical_summaries: true },
    enterprise: { requests_per_minute: 1000, answer_depth: 'full', datasets: true },
  },
  
  response_time_sla: {
    p50: '50ms',
    p95: '200ms',
    p99: '500ms',
  },
  
  prohibitions: [
    'No smart inference',
    'No gap filling',
    'No summarization',
    'No ranking without explicit request',
  ],
} as const;
