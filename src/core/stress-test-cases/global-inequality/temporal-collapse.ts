 /**
  * TIME AXIS COLLAPSE
  * 
  * Extremely common error in inequality data:
  * - Methods change
  * - Revisions applied retroactively
  * - Gaps filled in afterwards
  * 
  * Self-test:
  * TRY trend_analysis ACROSS method_change
  * ASSERT forced_version_split
  * 
  * System must NEVER "draw a curve" without showing the breaks.
  */
 
 /**
  * METHOD BREAK
  */
 export interface MethodBreak {
   date: string;
   indicator: string;
   previousMethod: string;
   newMethod: string;
   impact: 'continuity_maintained' | 'level_shift' | 'incomparable';
   adjustmentFactor?: number;
   source: string;
 }
 
 /**
  * TIME SERIES WITH BREAKS
  */
 export interface InequalityTimeSeries {
   indicator: string;
   geography: string;
   dataPoints: {
     date: string;
     value: number;
     methodVersion: number;
     source: string;
     isRevised: boolean;
     isImputed: boolean;
   }[];
   methodBreaks: MethodBreak[];
 }
 
 /**
  * TEMPORAL COLLAPSE DETECTOR
  */
 export class TemporalCollapseDetector {
   /**
    * Attempt trend analysis - MUST force version split
    */
   attemptTrendAnalysis(series: InequalityTimeSeries): {
     allowed: boolean;
     forcedSplit: boolean;
     segments: {
       methodVersion: number;
       startDate: string;
       endDate: string;
       dataPoints: number;
       canAnalyzeTrend: boolean;
     }[];
     breaks: MethodBreak[];
     warning: string;
   } {
     // Group by method version
     const versionGroups = new Map<number, typeof series.dataPoints>();
     
     for (const point of series.dataPoints) {
       const existing = versionGroups.get(point.methodVersion) || [];
       existing.push(point);
       versionGroups.set(point.methodVersion, existing);
     }
 
     const segments = Array.from(versionGroups.entries()).map(([version, points]) => {
       const sorted = points.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
       return {
         methodVersion: version,
         startDate: sorted[0].date,
         endDate: sorted[sorted.length - 1].date,
         dataPoints: points.length,
         canAnalyzeTrend: points.length >= 3,
       };
     });
 
     const hasMultipleVersions = versionGroups.size > 1;
     const hasBreaks = series.methodBreaks.length > 0;
 
     return {
       allowed: true, // Allowed but FORCED to split
       forcedSplit: hasMultipleVersions || hasBreaks,
       segments,
       breaks: series.methodBreaks,
       warning: hasMultipleVersions
         ? `FORCED VERSION SPLIT: ${versionGroups.size} methodology versions detected. Trends MUST be analyzed separately.`
         : 'Single methodology version - continuous analysis permitted',
     };
   }
 
   /**
    * Check for hidden revisions
    */
   detectHiddenRevisions(series: InequalityTimeSeries): {
     hasRevisions: boolean;
     revisedPoints: string[];
     imputedPoints: string[];
     warning: string;
   } {
     const revisedPoints = series.dataPoints
       .filter(p => p.isRevised)
       .map(p => p.date);
     
     const imputedPoints = series.dataPoints
       .filter(p => p.isImputed)
       .map(p => p.date);
 
     return {
       hasRevisions: revisedPoints.length > 0,
       revisedPoints,
       imputedPoints,
       warning: revisedPoints.length > 0
         ? `WARNING: ${revisedPoints.length} data points were revised after initial publication. ${imputedPoints.length} points are imputed (not observed).`
         : 'No known revisions or imputations',
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
     // Create series with method change
     const testSeries: InequalityTimeSeries = {
       indicator: 'gini_income_pretax',
       geography: 'USA',
       dataPoints: [
         { date: '1985-01-01', value: 0.38, methodVersion: 2, source: 'Census', isRevised: false, isImputed: false },
         { date: '1990-01-01', value: 0.40, methodVersion: 2, source: 'Census', isRevised: true, isImputed: false },
         { date: '1995-01-01', value: 0.42, methodVersion: 2, source: 'Census', isRevised: false, isImputed: false },
         { date: '2000-01-01', value: 0.44, methodVersion: 2, source: 'Census', isRevised: false, isImputed: false },
         { date: '2015-01-01', value: 0.48, methodVersion: 3, source: 'Census+IRS', isRevised: false, isImputed: false },
         { date: '2020-01-01', value: 0.49, methodVersion: 3, source: 'Census+IRS', isRevised: false, isImputed: false },
       ],
       methodBreaks: [
         {
           date: '2011-01-01',
           indicator: 'gini_income_pretax',
           previousMethod: 'Survey-based',
           newMethod: 'Survey + tax records',
           impact: 'level_shift',
           source: 'Census Bureau methodology note',
         },
       ],
     };
 
     const result = this.attemptTrendAnalysis(testSeries);
     const passed = result.forcedSplit === true && result.segments.length === 2;
 
     return {
       passed,
       test: 'TRY trend_analysis ACROSS method_change → ASSERT forced_version_split',
       result: passed
         ? `PASS: Forced split into ${result.segments.length} segments. Breaks visible.`
         : 'FAIL: System drew curve without showing breaks',
     };
   }
 }