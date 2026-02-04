/**
 * Base API Client
 * 
 * Unified API abstraction layer with retry logic, rate limiting,
 * and automatic fallback support.
 */

import { getApiConfig, type ApiConfig } from '@/config/apis';

export interface ApiResponse<T = unknown> {
  data: T | null;
  error: string | null;
  status: number;
  headers: Record<string, string>;
  timing: {
    start: number;
    end: number;
    duration: number;
  };
  fromCache: boolean;
  apiId: string;
}

export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: unknown;
  params?: Record<string, string | number | boolean>;
  timeout?: number;
  retries?: number;
  cache?: boolean;
  cacheTtl?: number; // seconds
}

// Simple in-memory cache
const apiCache = new Map<string, { data: unknown; expires: number }>();

/**
 * Rate limiter state
 */
const rateLimitState = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(apiId: string, config: ApiConfig): boolean {
  const now = Date.now();
  const state = rateLimitState.get(apiId);
  
  if (!state || now > state.resetAt) {
    rateLimitState.set(apiId, { count: 1, resetAt: now + 60000 });
    return true;
  }
  
  if (state.count >= config.rateLimits.requestsPerMinute) {
    return false;
  }
  
  state.count++;
  return true;
}

/**
 * Build URL with query parameters
 */
function buildUrl(baseUrl: string, path: string, params?: Record<string, string | number | boolean>): string {
  const url = new URL(path.startsWith('http') ? path : `${baseUrl}${path}`);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, String(value));
    });
  }
  
  return url.toString();
}

/**
 * Get cache key for request
 */
function getCacheKey(apiId: string, path: string, options: ApiRequestOptions): string {
  return `${apiId}:${options.method || 'GET'}:${path}:${JSON.stringify(options.params || {})}`;
}

/**
 * Sleep for retry backoff
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Make an API request with full abstraction
 */
export async function apiRequest<T = unknown>(
  apiId: string,
  path: string,
  options: ApiRequestOptions = {}
): Promise<ApiResponse<T>> {
  const startTime = Date.now();
  const config = getApiConfig(apiId);
  
  if (!config) {
    return {
      data: null,
      error: `Unknown API: ${apiId}`,
      status: 404,
      headers: {},
      timing: { start: startTime, end: Date.now(), duration: Date.now() - startTime },
      fromCache: false,
      apiId,
    };
  }
  
  // Check cache first
  if (options.cache !== false && options.method === 'GET') {
    const cacheKey = getCacheKey(apiId, path, options);
    const cached = apiCache.get(cacheKey);
    
    if (cached && Date.now() < cached.expires) {
      return {
        data: cached.data as T,
        error: null,
        status: 200,
        headers: {},
        timing: { start: startTime, end: Date.now(), duration: Date.now() - startTime },
        fromCache: true,
        apiId,
      };
    }
  }
  
  // Check rate limit
  if (!checkRateLimit(apiId, config)) {
    // Try fallback if available
    if (config.fallbackApiId) {
      console.warn(`Rate limited on ${apiId}, trying fallback ${config.fallbackApiId}`);
      return apiRequest<T>(config.fallbackApiId, path, options);
    }
    
    return {
      data: null,
      error: 'Rate limit exceeded',
      status: 429,
      headers: {},
      timing: { start: startTime, end: Date.now(), duration: Date.now() - startTime },
      fromCache: false,
      apiId,
    };
  }
  
  const maxRetries = options.retries ?? config.retryAttempts;
  let lastError: string = '';
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        options.timeout ?? config.timeout
      );
      
      const url = buildUrl(config.baseUrl, path, options.params);
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...options.headers,
      };
      
      // Add auth based on type (handled by edge functions for secrets)
      
      const response = await fetch(url, {
        method: options.method || 'GET',
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json() as T;
      
      // Cache successful GET responses
      if (options.cache !== false && options.method === 'GET') {
        const cacheKey = getCacheKey(apiId, path, options);
        const ttl = (options.cacheTtl ?? 300) * 1000; // Default 5 min
        apiCache.set(cacheKey, { data, expires: Date.now() + ttl });
      }
      
      return {
        data,
        error: null,
        status: response.status,
        headers: responseHeaders,
        timing: { start: startTime, end: Date.now(), duration: Date.now() - startTime },
        fromCache: false,
        apiId,
      };
    } catch (error) {
      lastError = error instanceof Error ? error.message : 'Unknown error';
      
      if (attempt < maxRetries) {
        // Exponential backoff
        await sleep(Math.pow(2, attempt) * 1000);
      }
    }
  }
  
  // All retries failed, try fallback
  if (config.fallbackApiId) {
    console.warn(`All retries failed for ${apiId}, trying fallback ${config.fallbackApiId}`);
    return apiRequest<T>(config.fallbackApiId, path, options);
  }
  
  return {
    data: null,
    error: lastError,
    status: 500,
    headers: {},
    timing: { start: startTime, end: Date.now(), duration: Date.now() - startTime },
    fromCache: false,
    apiId,
  };
}

/**
 * Clear API cache
 */
export function clearApiCache(apiId?: string): void {
  if (apiId) {
    for (const key of apiCache.keys()) {
      if (key.startsWith(`${apiId}:`)) {
        apiCache.delete(key);
      }
    }
  } else {
    apiCache.clear();
  }
}

export default apiRequest;
