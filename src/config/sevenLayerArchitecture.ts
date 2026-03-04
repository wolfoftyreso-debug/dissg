/**
 * 7-LAYER KNOWLEDGE INTELLIGENCE ARCHITECTURE
 * 
 * Master standard for all knowledge modules.
 * Every module must map to these 7 layers.
 */

export interface LayerSpec {
  readonly number: number;
  readonly code: string;
  readonly name: string;
  readonly purpose: string;
  readonly principle: string;
  readonly inputs: string[];
  readonly outputs: string[];
  readonly existingImplementation: string[];
  readonly rules: string[];
}

export const SEVEN_LAYERS: readonly LayerSpec[] = [
  {
    number: 1,
    code: 'SOURCE',
    name: 'Source Layer',
    purpose: 'Defines where data originates. All provenance starts here.',
    principle: 'No data enters the system without a registered, typed, and scored source.',
    inputs: ['APIs', 'Research databases', 'Statistical agencies', 'Sensor data', 'Reports', 'Manual inputs'],
    outputs: ['Registered source with reliability score', 'Data contract', 'Authentication config'],
    existingImplementation: [
      'data_sources table',
      'data_contracts table',
      'source_reliability_scores',
      'global_data_sources config',
    ],
    rules: [
      'Every source must have a reliability_score (0-1)',
      'Every source must have an update_frequency',
      'Every source must have a data_contract with validation schema',
      'Sources are typed: api | dataset | feed | manual',
      'No anonymous or unverified sources permitted',
    ],
  },
  {
    number: 2,
    code: 'INGESTION',
    name: 'Ingestion Layer',
    purpose: 'How data enters the system. Fail-hard pipeline: raw → normalized → validated → canonical.',
    principle: 'A single validation failure aborts the entire ingest run. No partial writes.',
    inputs: ['Raw data from Source Layer'],
    outputs: ['Validated, normalized observations ready for storage'],
    existingImplementation: [
      'ingest_runs table',
      'raw_data_ingest table (append-only)',
      'anomaly_queue table',
      'ingestion pipeline (src/core/ingestion/)',
    ],
    rules: [
      'Pipeline stages: raw → normalized → validated → canonical',
      'raw_data_ingest is append-only (UPDATE/DELETE blocked by trigger)',
      'Any validation error aborts entire run',
      'Anomalies are queued, never auto-fixed',
      'Schema mapping must be explicit and versioned',
      'Deduplication runs before canonical write',
    ],
  },
  {
    number: 3,
    code: 'OBSERVATION',
    name: 'Observation Layer',
    purpose: 'Stores raw factual observations. Pure data, zero interpretation.',
    principle: 'Observations contain no opinion, no conclusion, no normative language.',
    inputs: ['Validated data from Ingestion Layer'],
    outputs: ['Timestamped, geo-scoped, sourced observations'],
    existingImplementation: [
      'observations table (with revisions)',
      'kpi_values table (with revisions)',
      'canonical_facts table',
      'temporal envelopes (valid_from/to)',
    ],
    rules: [
      'Every observation must have: timestamp, population scope, geographic scope, unit, source_id',
      'No causal language allowed (no "because", "therefore", "causes")',
      'All values must include uncertainty/confidence metadata',
      'Observations are append-only with revision tracking',
      'Checksums verify data integrity across revisions',
    ],
  },
  {
    number: 4,
    code: 'CLAIM',
    name: 'Claim Layer',
    purpose: 'Transforms observations into structured knowledge claims.',
    principle: 'All knowledge follows: ENTITY → VARIABLE → RELATIONSHIP → OUTCOME.',
    inputs: ['Observations from Observation Layer', 'Evidence from Evidence Layer'],
    outputs: ['Standardized claims with confidence scores'],
    existingImplementation: [
      'universal_claims table (UCE)',
      'claim_graph_edges table',
      'claim_discovery_log table',
      'UCE engine (src/core/uce/)',
    ],
    rules: [
      'Every claim must specify: subject_entity, variable, relationship_type, target_outcome',
      'Every claim must have effect_size, population_scope, time_scale',
      'Every claim must have confidence_score (0-1)',
      'Claims must reference supporting observations',
      'Contradicting evidence must be explicitly tracked',
      'No claim exists without at least one evidence source',
    ],
  },
  {
    number: 5,
    code: 'EVIDENCE',
    name: 'Evidence Layer',
    purpose: 'Evaluates credibility and weight of claims through epistemological rigor.',
    principle: 'Evidence is weighted by hierarchy: Systematic Review > RCT > Cohort > Expert Opinion.',
    inputs: ['Claims from Claim Layer', 'Source metadata'],
    outputs: ['Weighted evidence scores', 'Conflict reports', 'Bias flags'],
    existingImplementation: [
      'claim_evidence table',
      'claim_conflicts table',
      'evidence_type enum (systematic_review, rct, cohort, case_control, cross_sectional, expert_opinion)',
      'calibration_snapshots table',
    ],
    rules: [
      'Evidence hierarchy: systematic_review(1.0) > rct(0.85) > cohort(0.70) > case_control(0.55) > cross_sectional(0.40) > expert_opinion(0.15)',
      'Replication weight increases with independent confirmations',
      'Bias flags must be tracked per evidence source',
      'Conflicting claims must be explicitly resolved or flagged',
      'Confidence is never binary — always probabilistic',
      'Brier scores track prediction calibration over time',
    ],
  },
  {
    number: 6,
    code: 'INTELLIGENCE',
    name: 'Intelligence Layer',
    purpose: 'Generates actionable insights through causal modeling and intervention analysis.',
    principle: 'Intelligence is derived from evidence, never from opinion or narrative.',
    inputs: ['Weighted claims from Evidence Layer', 'Causal graph structure'],
    outputs: ['Causal models', 'Intervention rankings', 'Predictions', 'Decision support'],
    existingImplementation: [
      'causal_graphs table',
      'causal_nodes table',
      'causal_edges table',
      'action_evaluations table',
      'action_options table',
      'causal_chains table',
      'causal-dag engine (src/core/causal-dag/)',
    ],
    rules: [
      'Causal models use Directed Acyclic Graphs (DAGs)',
      'Every causal edge must have mechanism, confidence, and falsification criteria',
      'Interventions are ranked by weighted_score across effect, cost, risk, reversibility',
      'Predictions must include uncertainty ranges',
      'No prescriptive language — only "if X then likely Y"',
      'Cross-domain reasoning enabled through shared entities',
    ],
  },
  {
    number: 7,
    code: 'META',
    name: 'Meta Layer',
    purpose: 'The system analyzes itself. Identifies gaps, weaknesses, and priorities.',
    principle: 'A system that cannot audit itself cannot be trusted.',
    inputs: ['All data from layers 1-6'],
    outputs: ['Knowledge gaps', 'Weak claims', 'Research priorities', 'System health metrics'],
    existingImplementation: [
      'calibration_snapshots table',
      'self-improvement core (src/core/self-improvement/)',
      'autonomous self-audit config',
    ],
    rules: [
      'Scan for domains with fewer than N claims',
      'Flag claims with confidence < 0.5 and fewer than 2 evidence sources',
      'Identify entities referenced in claims but missing from observation layer',
      'Rank knowledge gaps by potential impact (population × severity)',
      'Track system coverage over time',
      'Generate research priority recommendations',
      'Meta layer must never modify data in layers 1-6',
    ],
  },
] as const;

/**
 * DATA FLOW SPECIFICATION
 * 
 * Describes how data moves between layers.
 */
export const DATA_FLOW = [
  { from: 'SOURCE', to: 'INGESTION', description: 'Raw data fetched via connectors with source metadata' },
  { from: 'INGESTION', to: 'OBSERVATION', description: 'Validated, normalized data stored as timestamped observations' },
  { from: 'OBSERVATION', to: 'CLAIM', description: 'Patterns in observations generate structured claims' },
  { from: 'CLAIM', to: 'EVIDENCE', description: 'Claims are evaluated against evidence hierarchy' },
  { from: 'EVIDENCE', to: 'INTELLIGENCE', description: 'Weighted claims feed causal models and decision engines' },
  { from: 'INTELLIGENCE', to: 'META', description: 'Intelligence outputs are audited for gaps and quality' },
  { from: 'META', to: 'SOURCE', description: 'Meta layer identifies missing data → triggers new source integration' },
] as const;

/**
 * MODULE GENERATION STANDARD
 * 
 * When creating a new domain module, it must map to all 7 layers.
 */
export interface ModuleManifest {
  readonly domain: string;
  readonly version: string;
  readonly layers: {
    readonly source: { dataSources: string[]; updateFrequency: string };
    readonly ingestion: { connectorType: string; validationRules: string[] };
    readonly observation: { entityTypes: string[]; measureTypes: string[] };
    readonly claim: { claimCategories: string[]; relationshipTypes: string[] };
    readonly evidence: { primaryEvidenceTypes: string[]; biasRisks: string[] };
    readonly intelligence: { modelTypes: string[]; outputFormats: string[] };
    readonly meta: { knownGaps: string[]; qualityMetrics: string[] };
  };
}

/**
 * ARCHITECTURE INTEGRITY RULES
 */
export const ARCHITECTURE_RULES = {
  noLayerSkipping: 'Data must pass through each layer sequentially. No layer may be bypassed.',
  noUpstreamMutation: 'Higher layers may never modify data in lower layers.',
  appendOnly: 'Layers 2-3 (Ingestion, Observation) are append-only. No updates or deletes.',
  explicitUncertainty: 'Every layer must propagate uncertainty. No silent confidence.',
  versionedSchemas: 'All schemas are versioned. Old versions are superseded, never deleted.',
  noNormativeCore: 'Layers 1-5 must contain zero normative language or value judgments.',
  machineReadable: 'All outputs must be machine-readable without human instruction.',
} as const;

/**
 * Utility: validate a module manifest against the 7-layer standard
 */
export function validateModuleManifest(manifest: ModuleManifest): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!manifest.domain) errors.push('Module must have a domain name');
  if (!manifest.version) errors.push('Module must have a version');
  
  const layers = manifest.layers;
  if (!layers.source?.dataSources?.length) errors.push('Source layer must define at least one data source');
  if (!layers.ingestion?.validationRules?.length) errors.push('Ingestion layer must define validation rules');
  if (!layers.observation?.entityTypes?.length) errors.push('Observation layer must define entity types');
  if (!layers.claim?.claimCategories?.length) errors.push('Claim layer must define claim categories');
  if (!layers.evidence?.primaryEvidenceTypes?.length) errors.push('Evidence layer must define evidence types');
  if (!layers.intelligence?.modelTypes?.length) errors.push('Intelligence layer must define model types');
  if (!layers.meta?.qualityMetrics?.length) errors.push('Meta layer must define quality metrics');
  
  return { valid: errors.length === 0, errors };
}

/**
 * Get layer by code
 */
export function getLayerByCode(code: string): LayerSpec | undefined {
  return SEVEN_LAYERS.find(l => l.code === code);
}

/**
 * Get all layers as a summary
 */
export function getArchitectureSummary(): string {
  return SEVEN_LAYERS.map(l => `${l.number}. ${l.name} — ${l.purpose}`).join('\n');
}
