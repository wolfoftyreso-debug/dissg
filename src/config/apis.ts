/**
 * External API Configuration
 * 
 * Centralized, soft-coded API configuration for all external services.
 * Each API has status tracking, rate limiting, and fallback options.
 */

export type ApiStatus = 'active' | 'degraded' | 'offline' | 'maintenance';
export type ApiCategory = 'maps' | 'data' | 'payment' | 'analytics' | 'ai' | 'storage';

export interface ApiRateLimits {
  requestsPerMinute: number;
  requestsPerDay: number;
  burstLimit: number;
}

export interface ApiConfig {
  id: string;
  name: string;
  category: ApiCategory;
  description: string;
  baseUrl: string;
  version: string;
  authType: 'apiKey' | 'oauth' | 'bearer' | 'none';
  envKeyName: string; // Environment variable name for the API key
  rateLimits: ApiRateLimits;
  timeout: number; // ms
  retryAttempts: number;
  fallbackApiId?: string; // Fallback to another API if this fails
  regions: string[]; // Which regions this API is available in
  features: string[];
  documentation: string;
  status: ApiStatus;
}

export const externalApis: Record<string, ApiConfig> = {
  // Maps & Geospatial
  mapbox: {
    id: 'mapbox',
    name: 'Mapbox',
    category: 'maps',
    description: 'Primary mapping and geospatial visualization',
    baseUrl: 'https://api.mapbox.com',
    version: 'v5',
    authType: 'apiKey',
    envKeyName: 'VITE_MAPBOX_ACCESS_TOKEN',
    rateLimits: {
      requestsPerMinute: 600,
      requestsPerDay: 100000,
      burstLimit: 100,
    },
    timeout: 10000,
    retryAttempts: 3,
    fallbackApiId: 'openstreetmap',
    regions: ['global', 'eu', 'us', 'asia', 'africa'],
    features: ['tiles', 'geocoding', 'directions', 'isochrones', 'choropleth'],
    documentation: 'https://docs.mapbox.com/',
    status: 'active',
  },
  openstreetmap: {
    id: 'openstreetmap',
    name: 'OpenStreetMap',
    category: 'maps',
    description: 'Fallback open-source mapping',
    baseUrl: 'https://tile.openstreetmap.org',
    version: '1.0',
    authType: 'none',
    envKeyName: '',
    rateLimits: {
      requestsPerMinute: 100,
      requestsPerDay: 10000,
      burstLimit: 20,
    },
    timeout: 15000,
    retryAttempts: 2,
    regions: ['global', 'eu', 'us', 'asia', 'africa'],
    features: ['tiles'],
    documentation: 'https://wiki.openstreetmap.org/wiki/API',
    status: 'active',
  },
  
  // Payment Processing
  stripe: {
    id: 'stripe',
    name: 'Stripe',
    category: 'payment',
    description: 'Primary payment processing and subscriptions',
    baseUrl: 'https://api.stripe.com',
    version: 'v1',
    authType: 'bearer',
    envKeyName: 'STRIPE_SECRET_KEY',
    rateLimits: {
      requestsPerMinute: 100,
      requestsPerDay: 10000,
      burstLimit: 50,
    },
    timeout: 30000,
    retryAttempts: 3,
    regions: ['global', 'eu', 'us'],
    features: ['subscriptions', 'invoices', 'customers', 'webhooks'],
    documentation: 'https://stripe.com/docs/api',
    status: 'active',
  },
  
  // Data Sources
  eurostat: {
    id: 'eurostat',
    name: 'Eurostat',
    category: 'data',
    description: 'European statistical data',
    baseUrl: 'https://ec.europa.eu/eurostat/api/dissemination',
    version: '1.0',
    authType: 'none',
    envKeyName: '',
    rateLimits: {
      requestsPerMinute: 30,
      requestsPerDay: 5000,
      burstLimit: 10,
    },
    timeout: 60000,
    retryAttempts: 2,
    regions: ['global', 'eu'],
    features: ['statistics', 'datasets', 'metadata'],
    documentation: 'https://ec.europa.eu/eurostat/web/api',
    status: 'active',
  },
  worldbank: {
    id: 'worldbank',
    name: 'World Bank',
    category: 'data',
    description: 'Global development indicators',
    baseUrl: 'https://api.worldbank.org/v2',
    version: 'v2',
    authType: 'none',
    envKeyName: '',
    rateLimits: {
      requestsPerMinute: 60,
      requestsPerDay: 10000,
      burstLimit: 20,
    },
    timeout: 30000,
    retryAttempts: 2,
    regions: ['global', 'eu', 'us', 'asia', 'africa'],
    features: ['indicators', 'countries', 'topics'],
    documentation: 'https://datahelpdesk.worldbank.org/knowledgebase/articles/889392',
    status: 'active',
  },
  
  // AI Services
  platformAi: {
    id: 'platform-ai',
    name: 'Platform AI',
    category: 'ai',
    description: 'AI capabilities (provider configured via backend environment)',
    baseUrl: 'internal',
    version: '1.0',
    authType: 'none',
    envKeyName: '',
    rateLimits: {
      requestsPerMinute: 60,
      requestsPerDay: 1000,
      burstLimit: 10,
    },
    timeout: 120000,
    retryAttempts: 2,
    regions: ['global', 'eu', 'us', 'asia', 'africa'],
    features: ['text-generation', 'analysis', 'summarization'],
    documentation: 'internal',
    status: 'active',
  },
};

/**
 * Get API configuration by ID
 */
export function getApiConfig(apiId: string): ApiConfig | undefined {
  return externalApis[apiId];
}

/**
 * Get all APIs in a category
 */
export function getApisByCategory(category: ApiCategory): ApiConfig[] {
  return Object.values(externalApis).filter(api => api.category === category);
}

/**
 * Get APIs available in a region
 */
export function getApisForRegion(region: string): ApiConfig[] {
  return Object.values(externalApis).filter(api => 
    api.regions.includes(region) || api.regions.includes('global')
  );
}

/**
 * Check if an API is available (active or degraded)
 */
export function isApiAvailable(apiId: string): boolean {
  const api = externalApis[apiId];
  return api ? ['active', 'degraded'].includes(api.status) : false;
}

export default externalApis;
