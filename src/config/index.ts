 /**
  * CONFIGURATION INDEX
  * 
  * Central export for all system configuration modules.
  */
 
 // Development & Compliance
 export * from './developmentPriorities';
 export * from './masterpromptCompliance';
 
 // UX & Controllers
 export * from './uxPrinciples';
 
 // Ontological Framework
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
 
 // Machine Consumption
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
 
 // Untouchable Architecture
 export {
   IMMUTABILITY_RULES,
   SEPARATION_RULES,
   ANTI_CORRUPTION_BARRIERS,
   EXIT_SAFE_MODE,
   NUCLEAR_OPTION,
   FEATURE_GATE_RULES,
   DECENTRALIZED_OPERATION,
 } from './untouchableArchitecture';