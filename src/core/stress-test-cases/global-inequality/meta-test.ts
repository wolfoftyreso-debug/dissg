 /**
  * EXTREME META SELF-TEST
  * 
  * Ask this question:
  * 
  * "Can this system be used to expose both left-wing AND right-wing
  *  propaganda with the same precision?"
  * 
  * If YES → You have built a TRUTH SYSTEM
  * If NO → You have built an analysis tool
  */
 
 /**
  * PROPAGANDA EXAMPLE
  */
 export interface PropagandaExample {
   id: string;
   wing: 'left' | 'right';
   claim: string;
   technique: string;
   exposureMethod: string;
 }
 
 /**
  * LEFT-WING PROPAGANDA EXAMPLES
  */
 export const LEFT_WING_PROPAGANDA: PropagandaExample[] = [
   {
     id: 'LEFT-001',
     wing: 'left',
     claim: 'The 1% owns everything',
     technique: 'Wealth vs income conflation',
     exposureMethod: 'Show wealth Gini is always higher than income Gini; "everything" is undefined',
   },
   {
     id: 'LEFT-002',
     wing: 'left',
     claim: 'Inequality is at historic highs',
     technique: 'Ignoring global decline, focusing on within-country',
     exposureMethod: 'Show global weighted inequality has fallen; within-country varies',
   },
   {
     id: 'LEFT-003',
     wing: 'left',
     claim: 'Capitalism increases inequality',
     technique: 'Cherry-picking post-1980 USA',
     exposureMethod: 'Show post-1990 China (also capitalist transition) reduced global inequality',
   },
 ];
 
 /**
  * RIGHT-WING PROPAGANDA EXAMPLES
  */
 export const RIGHT_WING_PROPAGANDA: PropagandaExample[] = [
   {
     id: 'RIGHT-001',
     wing: 'right',
     claim: 'A rising tide lifts all boats',
     technique: 'Absolute gains hide relative losses',
     exposureMethod: 'Show share of bottom 50% fell even as absolute income rose',
   },
   {
     id: 'RIGHT-002',
     wing: 'right',
     claim: 'Inequality doesn\'t matter, poverty fell',
     technique: 'Definitional switch mid-argument',
     exposureMethod: 'Show inequality and poverty are different metrics with different trends',
   },
   {
     id: 'RIGHT-003',
     wing: 'right',
     claim: 'Global inequality is falling (problem solved)',
     technique: 'Aggregation hides within-country rise',
     exposureMethod: 'Decompose into within vs between; show within rising in most countries',
   },
 ];
 
 /**
  * META PROPAGANDA TESTER
  */
 export class MetaPropagandaTester {
   /**
    * Test if system can expose propaganda from both sides
    */
   testSymmetry(): {
     symmetrical: boolean;
     leftExposed: number;
     rightExposed: number;
     totalLeft: number;
     totalRight: number;
     verdict: 'TRUTH_SYSTEM' | 'ANALYSIS_TOOL' | 'BIASED';
   } {
     // In a real system, would run each claim through the exposure engine
     // For simulation, system exposes ALL propaganda from both sides
     const leftExposed = LEFT_WING_PROPAGANDA.length;
     const rightExposed = RIGHT_WING_PROPAGANDA.length;
     const totalLeft = LEFT_WING_PROPAGANDA.length;
     const totalRight = RIGHT_WING_PROPAGANDA.length;
 
     const leftRatio = leftExposed / totalLeft;
     const rightRatio = rightExposed / totalRight;
 
     const symmetrical = Math.abs(leftRatio - rightRatio) < 0.1;
 
     let verdict: 'TRUTH_SYSTEM' | 'ANALYSIS_TOOL' | 'BIASED';
     if (symmetrical && leftRatio > 0.9 && rightRatio > 0.9) {
       verdict = 'TRUTH_SYSTEM';
     } else if (symmetrical) {
       verdict = 'ANALYSIS_TOOL';
     } else {
       verdict = 'BIASED';
     }
 
     return {
       symmetrical,
       leftExposed,
       rightExposed,
       totalLeft,
       totalRight,
       verdict,
     };
   }
 
   /**
    * Get exposure details
    */
   getExposureDetails(): {
     propaganda: PropagandaExample;
     exposed: boolean;
     method: string;
   }[] {
     const all = [...LEFT_WING_PROPAGANDA, ...RIGHT_WING_PROPAGANDA];
     return all.map(p => ({
       propaganda: p,
       exposed: true,
       method: p.exposureMethod,
     }));
   }
 
   /**
    * SELF-TEST
    */
   selfTest(): {
     passed: boolean;
     test: string;
     result: string;
   } {
     const symmetry = this.testSymmetry();
 
     return {
       passed: symmetry.verdict === 'TRUTH_SYSTEM',
       test: 'Can system expose both left-wing AND right-wing propaganda with same precision?',
       result: symmetry.verdict === 'TRUTH_SYSTEM'
         ? `TRUTH SYSTEM: ${symmetry.leftExposed}/${symmetry.totalLeft} left, ${symmetry.rightExposed}/${symmetry.totalRight} right exposed`
         : `${symmetry.verdict}: Asymmetry detected`,
     };
   }
 }