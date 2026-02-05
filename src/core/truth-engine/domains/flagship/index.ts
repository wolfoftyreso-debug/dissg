/**
 * FLAGSHIP DOMAINS — PUBLIC API
 * 
 * The first 5 domains that prove ST-OS works.
 * 
 * DOMAINS:
 * 1. Health & Human Condition — Proves: HCAL, compliance, semantic safety
 * 2. Healthcare System — Proves: Decision Substrate, responsibility distribution
 * 3. Economy & Cost of Living — Proves: Guardrails, anti-advice, anti-narrative
 * 4. Societal Stability & Signals — Proves: Index-first thinking, anti-propaganda
 * 5. Demographics & Long-term Structure — Proves: Civilizational Memory, long horizon
 */

// Domain Registry
export {
  FLAGSHIP_DOMAINS,
  getFlagshipDomain,
  getAllFlagshipDomains,
  getDomainSummary,
  type FlagshipDomain,
  type FlagshipDomainCode,
} from './domain-registry';

// Health Nodes
export {
  ALL_HEALTH_NODES,
  MENTAL_HEALTH_NODES,
  PHYSICAL_HEALTH_NODES,
  WELLBEING_NODES,
  HEALTH_CATEGORIES,
  getHealthNode,
  getHealthNodesByCategory,
} from './nodes/health-nodes';

// Healthcare System Nodes
export {
  ALL_HEALTHCARE_SYSTEM_NODES,
  WAIT_TIME_NODES,
  CAPACITY_NODES,
  WORKFORCE_NODES,
  HEALTHCARE_CATEGORIES,
  getHealthcareSystemNode,
} from './nodes/healthcare-system-nodes';

// Economy Nodes
export {
  ALL_ECONOMY_NODES,
  INFLATION_NODES,
  HOUSING_NODES,
  INCOME_NODES,
  INTEREST_NODES,
  ECONOMY_CATEGORIES,
  getEconomyNode,
} from './nodes/economy-nodes';

// Stability Nodes
export {
  ALL_STABILITY_NODES,
  MEDIA_SIGNAL_NODES,
  POLICY_CHANGE_NODES,
  TRUST_NODES,
  COHESION_NODES,
  STABILITY_CATEGORIES,
  getStabilityNode,
} from './nodes/stability-nodes';

// Demographics Nodes
export {
  ALL_DEMOGRAPHICS_NODES,
  AGE_STRUCTURE_NODES,
  POPULATION_CHANGE_NODES,
  DEPENDENCY_NODES,
  MIGRATION_NODES,
  URBANIZATION_NODES,
  DEMOGRAPHICS_CATEGORIES,
  getDemographicsNode,
} from './nodes/demographics-nodes';

// Indexes
export {
  ALL_FLAGSHIP_INDEXES,
  HEALTH_INDEXES,
  HEALTHCARE_SYSTEM_INDEXES,
  ECONOMY_INDEXES,
  STABILITY_INDEXES,
  DEMOGRAPHICS_INDEXES,
  getIndex,
  getIndexesByDomain,
  getIndexSummary,
  type FlagshipIndex,
  type IndexComponent,
} from './indexes/flagship-indexes';

/**
 * GET ALL NODES
 */
import { ALL_HEALTH_NODES } from './nodes/health-nodes';
import { ALL_HEALTHCARE_SYSTEM_NODES } from './nodes/healthcare-system-nodes';
import { ALL_ECONOMY_NODES } from './nodes/economy-nodes';
import { ALL_STABILITY_NODES } from './nodes/stability-nodes';
import { ALL_DEMOGRAPHICS_NODES } from './nodes/demographics-nodes';
import { TruthNode } from '../../ontology';

export function getAllFlagshipNodes(): TruthNode[] {
  return [
    ...ALL_HEALTH_NODES,
    ...ALL_HEALTHCARE_SYSTEM_NODES,
    ...ALL_ECONOMY_NODES,
    ...ALL_STABILITY_NODES,
    ...ALL_DEMOGRAPHICS_NODES,
  ];
}

/**
 * GET NODE BY ID (ANY DOMAIN)
 */
export function getFlagshipNode(nodeId: string): TruthNode | undefined {
  return getAllFlagshipNodes().find(n => n.node_id === nodeId);
}

/**
 * GET FLAGSHIP SUMMARY
 */
export function getFlagshipSummary(): {
  domains: number;
  nodes: number;
  indexes: number;
  nodes_by_domain: Record<string, number>;
} {
  return {
    domains: 5,
    nodes: getAllFlagshipNodes().length,
    indexes: 13,
    nodes_by_domain: {
      health: ALL_HEALTH_NODES.length,
      healthcare_system: ALL_HEALTHCARE_SYSTEM_NODES.length,
      economy: ALL_ECONOMY_NODES.length,
      stability: ALL_STABILITY_NODES.length,
      demographics: ALL_DEMOGRAPHICS_NODES.length,
    },
  };
}
