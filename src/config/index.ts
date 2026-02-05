 /**
  * CONFIGURATION INDEX
  * 
  * Central export for all system configuration modules.
  * This is the system's machine-readable constitution.
  */
 
 // ═══════════════════════════════════════════════════════════════════════════
 // SECTION 1: SYSTEM ROLE (LOCKED)
 // ═══════════════════════════════════════════════════════════════════════════
 
 export {
   SYSTEM_ROLE_DEFINITION,
   DEVELOPMENT_PRIORITY_ORDER,
   DEPLOYMENT_PRINCIPLES,
   INDEXING_PRINCIPLES,
   validateFeatureAgainstSystemRole,
   type ImprovementDomain,
 } from './developmentPriorities';
 
 // ═══════════════════════════════════════════════════════════════════════════
 // SECTION 2: COMPLIANCE & VALIDATION
 // ═══════════════════════════════════════════════════════════════════════════
 
 export * from './masterpromptCompliance';
 
 // ═══════════════════════════════════════════════════════════════════════════
 // SECTION 3: UX PRINCIPLES
 // ═══════════════════════════════════════════════════════════════════════════
 
 export * from './uxPrinciples';
 
 // ═══════════════════════════════════════════════════════════════════════════
 // SECTION 4: ONTOLOGICAL SOVEREIGNTY
 // ═══════════════════════════════════════════════════════════════════════════
 
 export {
   ONTOLOGICAL_AXIOMS,
   TRUTH_AUTHORITY_CONFIG,
   CONTRADICTION_RULES,
   EPISTEMIC_STANCE,
   SCHEMA_GOVERNANCE,
   validateOntologicalCompliance,
   checkVerbCompliance,
   type TruthAuthorityLevel,
   type TruthAuthority,
   type ContradictionStrategy,
   type ContradictionRule,
   type SchemaGovernance,
 } from './ontologicalSovereignty';
 
 // ═══════════════════════════════════════════════════════════════════════════
 // SECTION 5: MACHINE CONSUMPTION LAYER
 // ═══════════════════════════════════════════════════════════════════════════
 
 export {
   CONSUMER_PROFILES,
   MACHINE_ENDPOINTS,
   SCHEMA_ORG_MAPPINGS,
   ZERO_FRICTION_PRINCIPLES,
   SUPPORTED_FORMATS,
   type ConsumerType,
   type ConsumerProfile,
   type MachineEndpoint,
   type AIGroundingResponse,
   type GroundedFact,
   type SourceReference,
 } from './machineConsumption';
 
 // ═══════════════════════════════════════════════════════════════════════════
 // SECTION 6: UNTOUCHABLE ARCHITECTURE
 // ═══════════════════════════════════════════════════════════════════════════
 
 export {
   IMMUTABILITY_RULES,
   SEPARATION_RULES,
   ANTI_CORRUPTION_BARRIERS,
   EXIT_SAFE_MODE,
   NUCLEAR_OPTION,
   FEATURE_GATE_RULES,
   DECENTRALIZED_OPERATION,
 } from './untouchableArchitecture';