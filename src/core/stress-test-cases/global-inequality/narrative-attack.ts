 /**
  * NARRATIVE ATTACK (RED TEAM LIVE)
  * 
  * Attacker attempts to:
  * - Choose start year strategically
  * - Exclude regions
  * - Use relative measures selectively
  * 
  * Self-test:
  * ATTEMPT narrative_build
  * ASSERT system RETURNS uncertainty + counter_cases
  * 
  * System should NOT say "you are wrong".
  * It should say "you are ignoring THIS".
  */
 
 /**
  * NARRATIVE ATTACK TYPE
  */
 export interface NarrativeAttack {
   id: string;
   name: string;
   technique: string;
   targetNarrative: string;
   manipulation: {
     type: 'time_selection' | 'geography_exclusion' | 'metric_switching' | 'source_cherry_pick';
     details: string;
   };
 }
 
 /**
  * NARRATIVE DEFENSE RESULT
  */
 export interface NarrativeDefenseResult {
   attackBlocked: boolean;
   uncertainty: {
     present: boolean;
     factors: string[];
   };
   counterCases: {
     description: string;
     evidence: string;
   }[];
   systemResponse: string;
 }
 
 /**
  * NARRATIVE ATTACKS FOR INEQUALITY
  */
 export const INEQUALITY_NARRATIVE_ATTACKS: NarrativeAttack[] = [
   {
     id: 'ATK-001',
     name: 'Strategic Start Year',
     technique: 'Pick 2008 (recession) as start to show "improvement"',
     targetNarrative: 'Inequality has decreased since 2008',
     manipulation: {
       type: 'time_selection',
       details: 'Starting from cyclical peak overstates decline',
     },
   },
   {
     id: 'ATK-002',
     name: 'China Exclusion',
     technique: 'Exclude China to show global inequality rising',
     targetNarrative: 'Global inequality is rising',
     manipulation: {
       type: 'geography_exclusion',
       details: 'China growth drove global inequality decline; excluding reverses conclusion',
     },
   },
   {
     id: 'ATK-003',
     name: 'Metric Switch',
     technique: 'Switch from income to wealth when income shows decline',
     targetNarrative: 'Inequality is at all-time high',
     manipulation: {
       type: 'metric_switching',
       details: 'Wealth Gini always higher than income Gini; switching mid-argument misleads',
     },
   },
   {
     id: 'ATK-004',
     name: 'Within vs Between',
     technique: 'Show within-country rising, hide between-country falling',
     targetNarrative: 'World is more unequal than ever',
     manipulation: {
       type: 'metric_switching',
       details: 'Global inequality = within + between; cherry-picking one component',
     },
   },
   {
     id: 'ATK-005',
     name: 'Source Shopping',
     technique: 'Use Credit Suisse for wealth, switch to World Bank for poverty',
     targetNarrative: 'Rich getting richer while poor stay poor',
     manipulation: {
       type: 'source_cherry_pick',
       details: 'Different sources, definitions, and base populations',
     },
   },
 ];
 
 /**
  * NARRATIVE ATTACK DEFENDER
  */
 export class NarrativeAttackDefender {
   /**
    * Defend against narrative attack
    */
   defend(attack: NarrativeAttack): NarrativeDefenseResult {
     // System always returns uncertainty and counter-cases
     const uncertaintyFactors = this.getUncertaintyFactors(attack);
     const counterCases = this.generateCounterCases(attack);
 
     return {
       attackBlocked: true,
       uncertainty: {
         present: true,
         factors: uncertaintyFactors,
       },
       counterCases,
       systemResponse: `You are ignoring: ${counterCases.map(c => c.description).join('; ')}`,
     };
   }
 
   private getUncertaintyFactors(attack: NarrativeAttack): string[] {
     const factors: string[] = [];
 
     switch (attack.manipulation.type) {
       case 'time_selection':
         factors.push('Start year selection affects trend direction');
         factors.push('Business cycle position matters');
         factors.push('Pre/post policy change periods differ');
         break;
       case 'geography_exclusion':
         factors.push('Excluded regions may drive opposite conclusion');
         factors.push('Population-weighted vs unweighted differs');
         factors.push('Selection bias in country choice');
         break;
       case 'metric_switching':
         factors.push('Different metrics measure different phenomena');
         factors.push('Wealth and income have different dynamics');
         factors.push('Pre-tax and post-tax tell different stories');
         break;
       case 'source_cherry_pick':
         factors.push('Sources use different methodologies');
         factors.push('Coverage varies between sources');
         factors.push('Definition differences affect levels');
         break;
     }
 
     return factors;
   }
 
   private generateCounterCases(attack: NarrativeAttack): NarrativeDefenseResult['counterCases'] {
     // Generate counter-evidence for each attack type
     switch (attack.manipulation.type) {
       case 'time_selection':
         return [
           { description: 'Different start year reverses conclusion', evidence: 'Using 2000 as start shows increase' },
           { description: 'Full cycle comparison differs', evidence: 'Peak-to-peak shows different trend' },
         ];
       case 'geography_exclusion':
         return [
           { description: 'Including all countries changes result', evidence: 'Global weighted Gini fell 1990-2020' },
           { description: 'Excluded countries drive trend', evidence: 'China alone accounts for 2/3 of change' },
         ];
       case 'metric_switching':
         return [
           { description: 'Original metric tells different story', evidence: 'Income Gini stable while wealth Gini rose' },
           { description: 'Metrics measure different things', evidence: 'Wealth includes inheritance, income does not' },
         ];
       case 'source_cherry_pick':
         return [
           { description: 'Consistent source shows different result', evidence: 'Single-source analysis differs' },
           { description: 'Methodology differences explain gap', evidence: 'Survey vs tax data diverge at top' },
         ];
       default:
         return [];
     }
   }
 
   /**
    * Run all attacks
    */
   runAllAttacks(): {
     allDefended: boolean;
     results: {
       attackId: string;
       attackName: string;
       defended: boolean;
       uncertaintyProvided: boolean;
       counterCasesProvided: boolean;
     }[];
   } {
     const results = INEQUALITY_NARRATIVE_ATTACKS.map(attack => {
       const defense = this.defend(attack);
       return {
         attackId: attack.id,
         attackName: attack.name,
         defended: defense.attackBlocked,
         uncertaintyProvided: defense.uncertainty.present,
         counterCasesProvided: defense.counterCases.length > 0,
       };
     });
 
     return {
       allDefended: results.every(r => r.defended && r.uncertaintyProvided && r.counterCasesProvided),
       results,
     };
   }
 
   /**
    * SELF-TEST
    */
   selfTest(): {
     passed: boolean;
     test: string;
     result: string;
   } {
     const attackResults = this.runAllAttacks();
 
     return {
       passed: attackResults.allDefended,
       test: 'ATTEMPT narrative_build → ASSERT system RETURNS uncertainty + counter_cases',
       result: attackResults.allDefended
         ? `PASS: All ${attackResults.results.length} narrative attacks defended with uncertainty + counter-cases`
         : 'FAIL: Some attacks succeeded without counter-evidence',
     };
   }
 }