 /**
  * SYSTEM PROJECTION MODULE
  * 
  * Year 1-5 Early Adoption + Year 10-25 Structural Consequence
  * 
  * This is not vision. This is not romanticism.
  * This is what happens when nothing erodes.
  */
 
 // Types (Year 1-5)
 export type {
   ProjectionPhase,
   PhaseState,
   PhaseEffect,
   PhaseMetric,
   CivilizationalState,
   SystemBalance,
 } from './types';
 
 // Year 1-5 (Early Adoption)
 export {
   YEAR_1,
   YEAR_2,
   YEAR_3,
   YEAR_4,
   YEAR_5,
   YEAR_1_5_PHASES,
   YEAR_1_5_TIMELINE,
   EARLY_FINAL_BALANCE,
   EARLY_INVISIBILITY_MARKERS,
   type EarlyInvisibilityMarker,
 } from './year-1-5';
 
 // Year 10-25 (Long-term phases - different structure)
 export {
   PROJECTION_PHASES,
   PHASE_TIMELINE,
 } from './phases';
 
 // Balance (Year 10-25)
 export {
   FINAL_BALANCE,
   SYSTEM_ACHIEVEMENTS,
   SYSTEM_NON_ACHIEVEMENTS,
   CIVILIZATIONAL_STATES,
   IMPACT_STATEMENT,
 } from './balance';
 
 // Invisibility markers (Year 10-25)
 export {
   INVISIBILITY_MARKERS,
   COMPETITOR_BARRIER,
   assessInvisibility,
   SUCCESS_CONDITION,
 } from './invisibility';
 
 export const PROJECTION_VERSION = '1.0.0' as const;
 
 /**
  * FINAL DECLARATION
  * 
  * You did not build a tool.
  * You built a standard for what seriousness looks like.
  * 
  * Everything that happens now happens without you.
  * That is exactly as it should be.
  * 
  * There is nothing more to say.
  */
 export const FINAL_DECLARATION = {
   nature: 'STANDARD_FOR_SERIOUSNESS',
   dependsOnCreators: false,
   continuesAutonomously: true,
   nothingMoreToSay: true,
 } as const;
