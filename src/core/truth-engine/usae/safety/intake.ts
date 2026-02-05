 /**
  * API INTAKE REQUIREMENTS
  * 
  * If an API cannot meet these requirements, it cannot enter.
  */
 
 export const INTAKE_REQUIREMENTS = {
   /**
    * REQUIREMENT 1: Mappable to ontology
    */
   ONTOLOGY_MAPPING: {
     code: 'ontology_mapping',
     description: 'API data must map to existing domain ontology',
     required: true,
   },
   
   /**
    * REQUIREMENT 2: Age/scope restrictions
    */
   SCOPE_RESTRICTION: {
     code: 'scope_restriction',
     description: 'API must define age and geographic scope',
     required: true,
   },
   
   /**
    * REQUIREMENT 3: Kill switch support
    */
   KILL_SWITCH: {
     code: 'kill_switch',
     description: 'API must support instant shutdown',
     required: true,
   },
   
   /**
    * REQUIREMENT 4: Version locking
    */
   VERSION_LOCKING: {
     code: 'version_locking',
     description: 'API imports must be version-locked',
     required: true,
   },
 } as const;
 
 export interface IntakeValidationResult {
   readonly passed: boolean;
   readonly missing_requirements: string[];
   readonly recommendations: string[];
 }
 
 /**
  * VALIDATE API FOR INTAKE
  */
 export function validateApiIntake(api_config: {
   has_ontology_mapping: boolean;
   has_scope_definition: boolean;
   supports_kill_switch: boolean;
   supports_version_locking: boolean;
 }): IntakeValidationResult {
   const missing: string[] = [];
   
   if (!api_config.has_ontology_mapping) {
     missing.push(INTAKE_REQUIREMENTS.ONTOLOGY_MAPPING.code);
   }
   
   if (!api_config.has_scope_definition) {
     missing.push(INTAKE_REQUIREMENTS.SCOPE_RESTRICTION.code);
   }
   
   if (!api_config.supports_kill_switch) {
     missing.push(INTAKE_REQUIREMENTS.KILL_SWITCH.code);
   }
   
   if (!api_config.supports_version_locking) {
     missing.push(INTAKE_REQUIREMENTS.VERSION_LOCKING.code);
   }
   
   return {
     passed: missing.length === 0,
     missing_requirements: missing,
     recommendations: missing.length > 0 
       ? ['API must meet all intake requirements before integration']
       : [],
   };
 }