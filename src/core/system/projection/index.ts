 /**
  * SYSTEM PROJECTION MODULE
  * 
  * Year 10-25 Structural Consequence Simulation
  * 
  * This is not vision. This is not romanticism.
  * This is what happens when nothing erodes.
  */
 
 export {
   type ProjectionPhase,
   type PhaseState,
   type PhaseEffect,
   PROJECTION_PHASES,
   PHASE_TIMELINE,
 } from './phases';
 
 export {
   type CivilizationalState,
   type SystemBalance,
   FINAL_BALANCE,
   SYSTEM_ACHIEVEMENTS,
   SYSTEM_NON_ACHIEVEMENTS,
 } from './balance';
 
 export {
   type InvisibilityMarker,
   INVISIBILITY_MARKERS,
   assessInvisibility,
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