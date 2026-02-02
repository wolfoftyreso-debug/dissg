/**
 * WAVE 10: BLOCK CD — FEDERATION MODE
 * BLOCK CI — GLOBAL GOVERNANCE
 * 
 * Ni blir baslager – andra bygger verktyg.
 * Systemet kan inte kapas.
 * 
 * "Trusted but Verifiable"
 */

import { G_DSP_VERSION } from './globalDataStandardProtocol';

// ============================================================
// CD1: FEDERATED NODES
// ============================================================

export type FederatedNodeType = 
  | 'university'
  | 'journalist'
  | 'government'
  | 'ngo'
  | 'research_institute'
  | 'corporation'
  | 'independent';

export interface FederatedNode {
  node_id: string;
  name: string;
  type: FederatedNodeType;
  organization: string;
  
  // Contact & verification
  contact_email: string;
  website: string;
  verified: boolean;
  verification_date?: string;
  
  // Technical
  api_endpoint?: string;
  gdsp_version: string;
  capabilities: NodeCapability[];
  
  // CD2: Transparency ranking
  transparency_score: number;     // 0-1
  transparency_factors: TransparencyFactor[];
  
  // Status
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  joined_at: string;
  last_active: string;
  
  // What they provide
  data_contributions: {
    countries: string[];
    kpi_categories: string[];
    aggregations: number;
    last_contribution: string;
  };
}

export type NodeCapability = 
  | 'data_source'          // Provides raw data
  | 'aggregation'          // Creates aggregations
  | 'analysis'             // Provides analysis
  | 'visualization'        // Provides visualizations
  | 'api_access'           // Offers API
  | 'embedding';           // Allows embedding

// ============================================================
// CD2: TRANSPARENCY RANKING
// ============================================================

export interface TransparencyFactor {
  factor: string;
  score: number;
  evidence: string;
}

export const TRANSPARENCY_FACTORS = [
  { id: 'source_citation', label: 'Källhänvisning', weight: 0.25 },
  { id: 'method_disclosure', label: 'Metodredovisning', weight: 0.25 },
  { id: 'data_accessibility', label: 'Datatillgänglighet', weight: 0.20 },
  { id: 'update_frequency', label: 'Uppdateringsfrekvens', weight: 0.15 },
  { id: 'error_correction', label: 'Felkorrigering', weight: 0.15 }
] as const;

export function calculateTransparencyScore(factors: TransparencyFactor[]): number {
  let totalWeight = 0;
  let weightedSum = 0;
  
  for (const factor of factors) {
    const config = TRANSPARENCY_FACTORS.find(f => f.id === factor.factor);
    if (config) {
      weightedSum += factor.score * config.weight;
      totalWeight += config.weight;
    }
  }
  
  return totalWeight > 0 ? weightedSum / totalWeight : 0;
}

// ============================================================
// CI1: GOVERNANCE PRINCIPLES
// ============================================================

export interface GovernancePrinciple {
  id: string;
  principle: string;
  enforcement: 'automatic' | 'community' | 'advisory';
  description: string;
  examples: string[];
}

export const GOVERNANCE_PRINCIPLES: GovernancePrinciple[] = [
  {
    id: 'no_central_truth',
    principle: 'Ingen central sanning',
    enforcement: 'automatic',
    description: 'Systemet föreskriver aldrig en "korrekt" tolkning. Alla tolkningar måste visa sin metod.',
    examples: [
      'Två noder kan ha olika index-vikter',
      'Användare kan jämföra metoders utfall',
      'Ingen aggregation märks som "officiell"'
    ]
  },
  {
    id: 'visible_methods',
    principle: 'Alla metoder synliga',
    enforcement: 'automatic',
    description: 'Varje beräkning, aggregation och analys måste peka på en registrerad metod.',
    examples: [
      'Metod-ID obligatoriskt i alla objekt',
      'Metoder är publikt tillgängliga',
      'Metodändringar loggas'
    ]
  },
  {
    id: 'open_criticism',
    principle: 'Alla kan kritisera',
    enforcement: 'community',
    description: 'Inbyggd infrastruktur för att ifrågasätta och föreslå alternativ.',
    examples: [
      'Counterexample-funktion',
      'Alternativa tolkningar',
      'Metodjämförelser'
    ]
  },
  {
    id: 'no_deletion',
    principle: 'Inget tas bort – bara versioneras',
    enforcement: 'automatic',
    description: 'All data och alla metoder bevaras i versionshistorik.',
    examples: [
      'Datakorrektioner skapar ny version',
      'Deprecated metoder är fortfarande tillgängliga',
      'Fullständig audit trail'
    ]
  }
];

// ============================================================
// FEDERATION API SPEC
// ============================================================

export interface FederationAPISpec {
  version: string;
  base_path: string;
  endpoints: FederationEndpoint[];
}

export interface FederationEndpoint {
  path: string;
  method: 'GET' | 'POST' | 'PUT';
  description: string;
  authentication: 'none' | 'api_key' | 'oauth';
  rate_limit?: number;
  response_format: 'gdsp_json' | 'csv' | 'both';
}

export const FEDERATION_API_SPEC: FederationAPISpec = {
  version: '1.0.0',
  base_path: '/federation/v1',
  endpoints: [
    {
      path: '/nodes',
      method: 'GET',
      description: 'List all federated nodes',
      authentication: 'none',
      response_format: 'gdsp_json'
    },
    {
      path: '/nodes/:id',
      method: 'GET',
      description: 'Get node details and transparency score',
      authentication: 'none',
      response_format: 'gdsp_json'
    },
    {
      path: '/nodes/:id/contributions',
      method: 'GET',
      description: 'List data contributions from a node',
      authentication: 'none',
      rate_limit: 100,
      response_format: 'both'
    },
    {
      path: '/register',
      method: 'POST',
      description: 'Register a new federated node',
      authentication: 'api_key',
      response_format: 'gdsp_json'
    },
    {
      path: '/validate',
      method: 'POST',
      description: 'Validate a G-DSP object',
      authentication: 'none',
      rate_limit: 1000,
      response_format: 'gdsp_json'
    }
  ]
};

// ============================================================
// EXAMPLE FEDERATED NODES
// ============================================================

export const EXAMPLE_NODES: FederatedNode[] = [
  {
    node_id: 'node_su_001',
    name: 'Stockholm University Data Lab',
    type: 'university',
    organization: 'Stockholm University',
    contact_email: 'datalab@su.se',
    website: 'https://su.se/datalab',
    verified: true,
    verification_date: '2024-01-15',
    gdsp_version: G_DSP_VERSION,
    capabilities: ['data_source', 'analysis', 'api_access'],
    transparency_score: 0.92,
    transparency_factors: [
      { factor: 'source_citation', score: 0.95, evidence: 'Full academic citation in all outputs' },
      { factor: 'method_disclosure', score: 0.98, evidence: 'Published methodology papers' },
      { factor: 'data_accessibility', score: 0.85, evidence: 'Open data repository' }
    ],
    status: 'active',
    joined_at: '2024-01-15T00:00:00Z',
    last_active: '2024-01-20T14:30:00Z',
    data_contributions: {
      countries: ['SE'],
      kpi_categories: ['education', 'research', 'labour'],
      aggregations: 24,
      last_contribution: '2024-01-20T14:30:00Z'
    }
  },
  {
    node_id: 'node_dn_001',
    name: 'DN Datajournalistik',
    type: 'journalist',
    organization: 'Dagens Nyheter',
    contact_email: 'data@dn.se',
    website: 'https://dn.se/data',
    verified: true,
    verification_date: '2024-02-01',
    gdsp_version: G_DSP_VERSION,
    capabilities: ['visualization', 'embedding'],
    transparency_score: 0.88,
    transparency_factors: [
      { factor: 'source_citation', score: 0.90, evidence: 'Always links to original sources' },
      { factor: 'method_disclosure', score: 0.85, evidence: 'Methodology notes in articles' }
    ],
    status: 'active',
    joined_at: '2024-02-01T00:00:00Z',
    last_active: '2024-02-10T09:00:00Z',
    data_contributions: {
      countries: ['SE'],
      kpi_categories: ['politics', 'economy'],
      aggregations: 8,
      last_contribution: '2024-02-10T09:00:00Z'
    }
  }
];

// ============================================================
// NODE VALIDATION
// ============================================================

export interface NodeValidationResult {
  valid: boolean;
  transparency_score: number;
  issues: string[];
  recommendations: string[];
}

export function validateFederatedNode(node: Partial<FederatedNode>): NodeValidationResult {
  const issues: string[] = [];
  const recommendations: string[] = [];

  if (!node.name) issues.push('Node name required');
  if (!node.type) issues.push('Node type required');
  if (!node.organization) issues.push('Organization required');
  if (!node.contact_email) issues.push('Contact email required');
  if (!node.website) issues.push('Website required');
  
  if (!node.gdsp_version || node.gdsp_version !== G_DSP_VERSION) {
    issues.push(`G-DSP version must be ${G_DSP_VERSION}`);
  }
  
  if (!node.capabilities || node.capabilities.length === 0) {
    recommendations.push('Define at least one capability');
  }
  
  if (!node.transparency_factors || node.transparency_factors.length === 0) {
    recommendations.push('Add transparency factors for better ranking');
  }
  
  const score = node.transparency_factors 
    ? calculateTransparencyScore(node.transparency_factors)
    : 0;

  return {
    valid: issues.length === 0,
    transparency_score: score,
    issues,
    recommendations
  };
}
