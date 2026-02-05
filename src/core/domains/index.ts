/**
 * DOMAIN REGISTRY
 * 
 * All auto-generated domains.
 * Factory-built. No handwork.
 */

// Education Domain
export {
  EDUCATION_DOMAIN,
  EDUCATION_TRUTH_NODES,
  EDUCATION_INDEXES,
  EDUCATION_DECISION_GRAPHS,
  EDUCATION_STATS,
} from './education/education-domain';

// Labor Market Domain
export {
  LABOR_DOMAIN,
  LABOR_TRUTH_NODES,
  LABOR_INDEXES,
  LABOR_DECISION_GRAPHS,
  LABOR_STATS,
} from './labor/labor-domain';

// Housing Domain
export {
  HOUSING_DOMAIN,
  HOUSING_TRUTH_NODES,
  HOUSING_INDEXES,
  HOUSING_DECISION_GRAPHS,
  HOUSING_STATS,
} from './housing/housing-domain';

/**
 * ALL DOMAINS REGISTRY
 */
export const DOMAIN_REGISTRY = {
  EDU: 'Education System Load',
  LBR: 'Labor Market Pressure',
  HSG: 'Housing System Load',
} as const;

/**
 * AGGREGATE STATISTICS
 */
export function getDomainStats(): {
  total_domains: number;
  total_truth_nodes: number;
  total_indexes: number;
  total_decision_graphs: number;
} {
  // Import stats
  const { EDUCATION_STATS } = require('./education/education-domain');
  const { LABOR_STATS } = require('./labor/labor-domain');
  const { HOUSING_STATS } = require('./housing/housing-domain');
  
  return {
    total_domains: Object.keys(DOMAIN_REGISTRY).length,
    total_truth_nodes: EDUCATION_STATS.truth_nodes + LABOR_STATS.truth_nodes + HOUSING_STATS.truth_nodes,
    total_indexes: EDUCATION_STATS.indexes + LABOR_STATS.indexes + HOUSING_STATS.indexes,
    total_decision_graphs: EDUCATION_STATS.decision_graphs + LABOR_STATS.decision_graphs + HOUSING_STATS.decision_graphs,
  };
}
