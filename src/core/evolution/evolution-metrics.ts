 /**
  * EVOLUTION METRICS
  * 
  * Measure how well the system ages.
  * 
  * Goals:
  * - Entropy ↓
  * - Constraints ↑
  * - Assumptions ↓
  * - Evolution cost ↑ (harder to change = good)
  */
 
 import type { EvolutionMetrics, SelfReinforcingCheck } from './evolution-types';
 
 /**
  * METRIC TARGETS
  */
 export const METRIC_TARGETS = {
   semanticEntropy: {
     direction: 'decrease',
     description: 'Overlap and vagueness should decrease',
     healthyThreshold: 0.3,
     criticalThreshold: 0.7,
   },
   
   constraintDensity: {
     direction: 'increase',
     description: 'Rules per schema should increase',
     healthyThreshold: 5,
     criticalThreshold: 2,
   },
   
   assumptionCount: {
     direction: 'decrease',
     description: 'Implicit assumptions should decrease',
     healthyThreshold: 10,
     criticalThreshold: 50,
   },
   
   evolutionCost: {
     direction: 'increase',
     description: 'Work per feature should increase (harder = safer)',
     healthyThreshold: 0.7,
     criticalThreshold: 0.2,
   },
   
   aiMisuseSurface: {
     direction: 'decrease',
     description: 'Misuse opportunities should decrease',
     healthyThreshold: 0.2,
     criticalThreshold: 0.6,
   },
 } as const;
 
 /**
  * CALCULATE EVOLUTION METRICS
  */
 export function calculateEvolutionMetrics(
   schemaCount: number,
   totalConstraints: number,
   explicitRelations: number,
   implicitAssumptions: number,
   recentChanges: number,
   recentViolations: number
 ): EvolutionMetrics {
   // Semantic Entropy: ratio of overlapping concepts
   const semanticEntropy = implicitAssumptions / (explicitRelations + 1);
   
   // Constraint Density: rules per schema
   const constraintDensity = totalConstraints / Math.max(schemaCount, 1);
   
   // Assumption Count: direct measure
   const assumptionCount = implicitAssumptions;
   
   // Evolution Cost: inverse of change velocity (higher = harder = better)
   const evolutionCost = 1 / (recentChanges + 1);
   
   // AI Misuse Surface: ratio of violations to changes
   const aiMisuseSurface = recentViolations / Math.max(recentChanges, 1);
   
   // Health Score: weighted average of normalized metrics
   const healthScore = calculateHealthScore({
     semanticEntropy,
     constraintDensity,
     assumptionCount,
     evolutionCost,
     aiMisuseSurface,
   });
   
   // Trend: based on recent metrics history
   const trend = healthScore > 0.7 ? 'improving' : 
                 healthScore > 0.4 ? 'stable' : 'degrading';
   
   return {
     timestamp: new Date().toISOString(),
     semanticEntropy,
     constraintDensity,
     assumptionCount,
     evolutionCost,
     aiMisuseSurface,
     healthScore,
     trend,
   };
 }
 
 /**
  * CALCULATE HEALTH SCORE
  */
 function calculateHealthScore(metrics: {
   semanticEntropy: number;
   constraintDensity: number;
   assumptionCount: number;
   evolutionCost: number;
   aiMisuseSurface: number;
 }): number {
   // Normalize each metric to 0-1 where 1 is healthy
   const entropyScore = 1 - Math.min(metrics.semanticEntropy, 1);
   const constraintScore = Math.min(metrics.constraintDensity / 10, 1);
   const assumptionScore = 1 - Math.min(metrics.assumptionCount / 100, 1);
   const costScore = Math.min(metrics.evolutionCost * 10, 1);
   const misuseScore = 1 - Math.min(metrics.aiMisuseSurface, 1);
   
   // Weighted average
   return (
     entropyScore * 0.25 +
     constraintScore * 0.2 +
     assumptionScore * 0.2 +
     costScore * 0.15 +
     misuseScore * 0.2
   );
 }
 
 /**
  * COMPARE METRICS
  */
 export function compareMetrics(
   before: EvolutionMetrics,
   after: EvolutionMetrics
 ): {
   improving: boolean;
   changes: Record<string, 'improved' | 'degraded' | 'stable'>;
   warnings: string[];
 } {
   const changes: Record<string, 'improved' | 'degraded' | 'stable'> = {};
   const warnings: string[] = [];
   
   // Semantic Entropy (should decrease)
   if (after.semanticEntropy < before.semanticEntropy) {
     changes.semanticEntropy = 'improved';
   } else if (after.semanticEntropy > before.semanticEntropy) {
     changes.semanticEntropy = 'degraded';
     warnings.push('Semantic entropy increased - clarity decreasing');
   } else {
     changes.semanticEntropy = 'stable';
   }
   
   // Constraint Density (should increase)
   if (after.constraintDensity > before.constraintDensity) {
     changes.constraintDensity = 'improved';
   } else if (after.constraintDensity < before.constraintDensity) {
     changes.constraintDensity = 'degraded';
     warnings.push('Constraint density decreased - rules weakening');
   } else {
     changes.constraintDensity = 'stable';
   }
   
   // Assumption Count (should decrease)
   if (after.assumptionCount < before.assumptionCount) {
     changes.assumptionCount = 'improved';
   } else if (after.assumptionCount > before.assumptionCount) {
     changes.assumptionCount = 'degraded';
     warnings.push('Assumption count increased - explicitness decreasing');
   } else {
     changes.assumptionCount = 'stable';
   }
   
   // Evolution Cost (should increase)
   if (after.evolutionCost > before.evolutionCost) {
     changes.evolutionCost = 'improved';
   } else if (after.evolutionCost < before.evolutionCost) {
     changes.evolutionCost = 'degraded';
     warnings.push('Evolution cost decreased - changes too easy');
   } else {
     changes.evolutionCost = 'stable';
   }
   
   // AI Misuse Surface (should decrease)
   if (after.aiMisuseSurface < before.aiMisuseSurface) {
     changes.aiMisuseSurface = 'improved';
   } else if (after.aiMisuseSurface > before.aiMisuseSurface) {
     changes.aiMisuseSurface = 'degraded';
     warnings.push('AI misuse surface increased - exploitation risk growing');
   } else {
     changes.aiMisuseSurface = 'stable';
   }
   
   const degradedCount = Object.values(changes).filter(c => c === 'degraded').length;
   const improving = degradedCount === 0 && after.healthScore >= before.healthScore;
   
   return {
     improving,
     changes,
     warnings,
   };
 }
 
 /**
  * SELF-REINFORCING CHECK
  */
 export function checkSelfReinforcing(
   metric: string,
   ruleCountBefore: number,
   ruleCountAfter: number,
   exceptionCountBefore: number,
   exceptionCountAfter: number
 ): SelfReinforcingCheck {
   const ruleDelta = ruleCountAfter - ruleCountBefore;
   const exceptionDelta = exceptionCountAfter - exceptionCountBefore;
   
   const result = ruleDelta >= exceptionDelta ? 'more_rules' : 'more_exceptions';
   
   return {
     metric,
     beforeUsage: ruleCountBefore + exceptionCountBefore,
     afterUsage: ruleCountAfter + exceptionCountAfter,
     result,
     isHealthy: result === 'more_rules',
   };
 }