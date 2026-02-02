/**
 * WAVE 16 — BLOCK DZ, EA
 * PLANETARY ORCHESTRATION & MULTI-SYSTEM INTEROP
 * 
 * Orkestrering utan centrum. Samverkan utan makt.
 * Tänk internet-routing, inte kommandokedja.
 */

// ============================================
// BLOCK DZ: PLANETARY ORCHESTRATION LAYER
// ============================================

export type SyncState = 
  | 'in_sync'
  | 'pending_sync'
  | 'diverged'
  | 'unreachable'
  | 'unknown';

export type ConflictState = 
  | 'none'
  | 'source_conflict'
  | 'method_conflict'
  | 'time_conflict'
  | 'definition_conflict'
  | 'multiple_conflicts';

export type SignalType = 
  | 'observation'
  | 'change'
  | 'pattern'
  | 'anomaly'
  | 'learning'
  | 'correction'
  | 'metadata';

export interface SourceNode {
  node_id: string;
  name: string;
  region: string;
  country_code: string;
  node_type: 'primary' | 'regional' | 'thematic' | 'partner' | 'mirror';
  endpoint: string;
  public_key: string;
  trust_score: number;
  transparency_score: number;
  last_seen: string;
  capabilities: string[];
  status: 'active' | 'degraded' | 'offline';
}

export interface TargetNode extends SourceNode {
  subscription_type: 'full' | 'filtered' | 'on_demand';
  filters: {
    domains: string[];
    regions: string[];
    signal_types: SignalType[];
    min_confidence: number;
  };
}

export interface OrchestrationEvent {
  event_id: string;
  timestamp: string;
  
  source_node: string;
  target_nodes: string[];
  
  signal_type: SignalType;
  payload_hash: string;
  
  sync_state: SyncState;
  conflict_state: ConflictState;
  
  propagation: {
    initiated_at: string;
    confirmed_nodes: string[];
    pending_nodes: string[];
    failed_nodes: string[];
  };
  
  metadata: {
    confidence: number;
    traceable: boolean;
    lineage_url: string;
  };
}

export const ORCHESTRATION_PRINCIPLES = {
  core: {
    no_master_node: {
      principle: 'Ingen master-node',
      description: 'Inget system har förtur eller auktoritet över andra',
      enforcement: 'architectural',
    },
    no_global_truth: {
      principle: 'Ingen global sanning',
      description: 'Sanningen är distribuerad och versionerad',
      enforcement: 'protocol',
    },
    standard_publication: {
      principle: 'Alla noder publicerar enligt standard',
      description: 'Gemensamt protokoll, individuell data',
      enforcement: 'validation',
    },
    orchestration_definition: {
      principle: 'Orkestrering = synk + jämförelse + synlighet',
      description: 'Samordning utan kontroll',
      enforcement: 'design',
    },
  },
  
  routing: {
    model: 'internet_routing',
    not: 'command_chain',
    description: 'Decentraliserad routing där varje nod fattar egna beslut',
  },
  
  conflicts: {
    shown: true,
    resolved_centrally: false,
    policy: 'Konflikter visas – de löses inte centralt',
  },
} as const;

export const ORCHESTRATION_CONFIG = {
  syncIntervalSeconds: 60,
  maxPropagationHops: 5,
  conflictDisplayThreshold: 0.1, // Show conflicts if >10% divergence
  
  nodeDiscovery: {
    method: 'dns_plus_registry',
    bootstrapNodes: [
      'node.global-reality.org',
      'eu.global-reality.org',
      'asia.global-reality.org',
      'americas.global-reality.org',
    ],
  },
  
  trustScoring: {
    factors: {
      transparency: 0.30,
      uptime: 0.20,
      data_quality: 0.25,
      responsiveness: 0.15,
      community_feedback: 0.10,
    },
    minimumForFederation: 0.5,
  },
} as const;

// ============================================
// BLOCK EA: MULTI-SYSTEM INTEROP
// ============================================

export type InteropMethod = 
  | 'pull'      // API requests
  | 'push'      // Webhooks
  | 'subscribe' // Feed subscriptions
  | 'federated_query'; // Cross-node queries

export interface InteropEndpoint {
  method: InteropMethod;
  endpoint: string;
  version: string;
  authentication: 'api_key' | 'oauth2' | 'mtls' | 'public';
  rate_limit: {
    requests_per_minute: number;
    requests_per_day: number;
  };
  documentation_url: string;
}

export interface ExternalSystem {
  system_id: string;
  name: string;
  type: 
    | 'national_statistics'
    | 'university_platform'
    | 'media_pipeline'
    | 'ngo_analytics'
    | 'regional_dashboard'
    | 'research_institution'
    | 'international_org'
    | 'other';
  country_codes: string[];
  domains: string[];
  interop_methods: InteropMethod[];
  trust_level: 'verified' | 'registered' | 'public';
  data_sharing: 'bidirectional' | 'inbound_only' | 'outbound_only';
}

export const INTEROP_CONFIG = {
  interfaces: {
    pull: {
      name: 'API Pull',
      description: 'Standard REST/GraphQL API för datahämtning',
      protocols: ['REST', 'GraphQL'],
      formats: ['JSON', 'CSV', 'Parquet'],
    },
    push: {
      name: 'Webhooks',
      description: 'Push-notifikationer vid förändringar',
      protocols: ['HTTPS POST'],
      formats: ['JSON'],
      delivery: 'at_least_once',
    },
    subscribe: {
      name: 'Feed Subscriptions',
      description: 'Real-time feeds via SSE eller WebSocket',
      protocols: ['SSE', 'WebSocket'],
      formats: ['JSON-LD', 'JSON'],
    },
    federated_query: {
      name: 'Federated Queries',
      description: 'Distribuerade queries över flera noder',
      protocols: ['GraphQL Federation', 'SPARQL'],
      formats: ['JSON-LD'],
    },
  },
  
  exampleSystems: [
    {
      type: 'national_statistics',
      examples: ['SCB (Sverige)', 'Eurostat', 'BLS (USA)', 'ONS (UK)'],
    },
    {
      type: 'university_platform',
      examples: ['ICPSR', 'Harvard Dataverse', 'Zenodo'],
    },
    {
      type: 'media_pipeline',
      examples: ['Reuters Data', 'AP Fact Check', 'BBC Data Unit'],
    },
    {
      type: 'ngo_analytics',
      examples: ['Our World in Data', 'Gapminder', 'World Bank Open Data'],
    },
    {
      type: 'regional_dashboard',
      examples: ['EU Open Data Portal', 'Nordic Statistics', 'OECD.Stat'],
    },
  ],
  
  positioning: {
    role: 'hub',
    not: 'owner',
    principle: 'Ni är navet – inte ägaren',
    noUIRequirement: true,
  },
} as const;

// ============================================
// HELPER FUNCTIONS
// ============================================

export function createOrchestrationEvent(
  sourceNode: string,
  targetNodes: string[],
  signalType: SignalType,
  payloadHash: string,
  confidence: number
): OrchestrationEvent {
  return {
    event_id: `orch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    source_node: sourceNode,
    target_nodes: targetNodes,
    signal_type: signalType,
    payload_hash: payloadHash,
    sync_state: 'pending_sync',
    conflict_state: 'none',
    propagation: {
      initiated_at: new Date().toISOString(),
      confirmed_nodes: [],
      pending_nodes: targetNodes,
      failed_nodes: [],
    },
    metadata: {
      confidence,
      traceable: true,
      lineage_url: `/api/lineage/${payloadHash}`,
    },
  };
}

export function registerExternalSystem(
  name: string,
  type: ExternalSystem['type'],
  countryCodes: string[],
  domains: string[],
  methods: InteropMethod[]
): ExternalSystem {
  return {
    system_id: `ext_${name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`,
    name,
    type,
    country_codes: countryCodes,
    domains,
    interop_methods: methods,
    trust_level: 'registered',
    data_sharing: 'bidirectional',
  };
}

export function calculateTrustScore(node: Partial<SourceNode>): number {
  const factors = ORCHESTRATION_CONFIG.trustScoring.factors;
  let score = 0;
  
  // Simplified calculation
  score += (node.transparency_score || 0.5) * factors.transparency;
  score += 0.9 * factors.uptime; // Assume good uptime
  score += 0.8 * factors.data_quality;
  score += 0.85 * factors.responsiveness;
  score += 0.7 * factors.community_feedback;
  
  return Math.min(1, Math.max(0, score));
}

export const ORCHESTRATION_STATUS = {
  version: '16.0',
  blocks: ['DZ', 'EA'],
  capabilities: [
    'planetary_orchestration',
    'multi_system_interop',
    'no_master_node',
    'standard_publication',
  ],
  principle: 'Tänk internet-routing, inte kommandokedja.',
} as const;
