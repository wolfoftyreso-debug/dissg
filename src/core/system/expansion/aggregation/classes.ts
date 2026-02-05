 /**
  * AGGREGATION CLASSES
  * 
  * The three allowed aggregation types
  */
 
 import type { AggregationType } from './registry';
 
 /**
  * A. PREVALENCE AGGREGATES
  * 
  * "How common is X under Y?"
  * - over time
  * - over region  
  * - over population type
  */
 export interface PrevalenceAggregate {
   readonly aggregate_type: 'prevalence';
   readonly dimensions: readonly ('time' | 'region' | 'population')[];
   readonly interpretation: 'descriptive_only';
   readonly query: {
     readonly subject: string;
     readonly condition: string;
     readonly time_range?: { start: string; end: string };
     readonly regions?: readonly string[];
     readonly populations?: readonly string[];
   };
   readonly result: {
     readonly frequency: number;
     readonly sample_size: number;
     readonly distribution: Record<string, number>;
     readonly variance: number;
   };
 }
 
 /**
  * B. DECISION PATTERN AGGREGATES
  * 
  * "How do decisions of this type typically look?"
  * - Common assumptions
  * - Common uncertainties
  * - Common alternatives
  */
 export interface DecisionPatternAggregate {
   readonly aggregate_type: 'decision_pattern';
   readonly based_on: 'locked_decisions_only';
   readonly output: 'frequency_distribution';
   readonly query: {
     readonly decision_type: string;
     readonly time_range?: { start: string; end: string };
   };
   readonly result: {
     readonly total_decisions: number;
     readonly common_assumptions: readonly {
       readonly assumption: string;
       readonly frequency: number;
     }[];
     readonly common_uncertainties: readonly {
       readonly uncertainty: string;
       readonly frequency: number;
     }[];
     readonly common_alternatives: readonly {
       readonly alternative_count: number;
       readonly frequency: number;
     }[];
   };
 }
 
 /**
  * C. OUTCOME VARIANCE AGGREGATES
  * 
  * "How did outcomes vary given similar decisions?"
  * 
  * NEVER:
  * - "what went best"
  * - rankings
  * 
  * ONLY:
  * - spread & variation
  */
 export interface OutcomeVarianceAggregate {
   readonly aggregate_type: 'outcome_variance';
   readonly interpretation: 'descriptive_only';
   readonly forbidden_outputs: readonly ['best', 'worst', 'ranking', 'recommendation'];
   readonly query: {
     readonly decision_type: string;
     readonly outcome_metric: string;
     readonly time_range?: { start: string; end: string };
   };
   readonly result: {
     readonly sample_size: number;
     readonly mean: number;
     readonly median: number;
     readonly std_deviation: number;
     readonly min: number;
     readonly max: number;
     readonly percentiles: {
       readonly p10: number;
       readonly p25: number;
       readonly p75: number;
       readonly p90: number;
     };
     readonly distribution_shape: 'normal' | 'skewed_left' | 'skewed_right' | 'bimodal' | 'uniform';
   };
 }
 
 /**
  * COMPLETE AGGREGATION CLASS DEFINITIONS
  */
 export const AGGREGATION_CLASSES = {
   prevalence: {
     type: 'prevalence' as AggregationType,
     dimensions: ['time', 'region', 'population'] as const,
     interpretation: 'descriptive_only' as const,
     requires_minimum_samples: 30,
     forbidden_outputs: ['ranking', 'recommendation', 'best', 'worst'],
     description: 'How common is X under Y?',
   },
   decision_pattern: {
     type: 'decision_pattern' as AggregationType,
     dimensions: ['decision_type', 'time'] as const,
     interpretation: 'descriptive_only' as const,
     requires_minimum_samples: 20,
     forbidden_outputs: ['should', 'recommend', 'optimal', 'best practice'],
     description: 'How do decisions of this type typically look?',
   },
   outcome_variance: {
     type: 'outcome_variance' as AggregationType,
     dimensions: ['decision_type', 'outcome_metric', 'time'] as const,
     interpretation: 'descriptive_only' as const,
     requires_minimum_samples: 50,
     forbidden_outputs: ['best outcome', 'worst outcome', 'success', 'failure', 'winner', 'loser'],
     description: 'How did outcomes vary given similar decisions?',
   },
 } as const;
 
 /**
  * TOP 20 FIRST AGGREGATIONS
  * 
  * Concrete aggregation instances to implement first
  */
 export const INITIAL_AGGREGATIONS = [
   // Prevalence
   { id: 'AGG-PREV-001', type: 'prevalence', subject: 'uncertainty_declared', condition: 'major_decisions' },
   { id: 'AGG-PREV-002', type: 'prevalence', subject: 'alternatives_considered', condition: 'investment_decisions' },
   { id: 'AGG-PREV-003', type: 'prevalence', subject: 'external_validation', condition: 'policy_decisions' },
   { id: 'AGG-PREV-004', type: 'prevalence', subject: 'assumption_explicit', condition: 'all_decisions' },
   { id: 'AGG-PREV-005', type: 'prevalence', subject: 'reversibility_assessed', condition: 'strategic_decisions' },
   { id: 'AGG-PREV-006', type: 'prevalence', subject: 'timeline_specified', condition: 'project_decisions' },
   { id: 'AGG-PREV-007', type: 'prevalence', subject: 'stakeholders_identified', condition: 'organizational_decisions' },
   
   // Decision Patterns
   { id: 'AGG-DPAT-001', type: 'decision_pattern', decision_type: 'capital_allocation' },
   { id: 'AGG-DPAT-002', type: 'decision_pattern', decision_type: 'policy_change' },
   { id: 'AGG-DPAT-003', type: 'decision_pattern', decision_type: 'organizational_restructure' },
   { id: 'AGG-DPAT-004', type: 'decision_pattern', decision_type: 'technology_adoption' },
   { id: 'AGG-DPAT-005', type: 'decision_pattern', decision_type: 'market_entry' },
   { id: 'AGG-DPAT-006', type: 'decision_pattern', decision_type: 'regulatory_response' },
   
   // Outcome Variance
   { id: 'AGG-OVAR-001', type: 'outcome_variance', decision_type: 'capital_allocation', metric: 'roi_variance' },
   { id: 'AGG-OVAR-002', type: 'outcome_variance', decision_type: 'policy_change', metric: 'kpi_movement' },
   { id: 'AGG-OVAR-003', type: 'outcome_variance', decision_type: 'technology_adoption', metric: 'implementation_time' },
   { id: 'AGG-OVAR-004', type: 'outcome_variance', decision_type: 'market_entry', metric: 'market_share_change' },
   { id: 'AGG-OVAR-005', type: 'outcome_variance', decision_type: 'hiring_decision', metric: 'retention_rate' },
   { id: 'AGG-OVAR-006', type: 'outcome_variance', decision_type: 'cost_reduction', metric: 'actual_vs_projected' },
   { id: 'AGG-OVAR-007', type: 'outcome_variance', decision_type: 'partnership', metric: 'value_realization' },
 ] as const;