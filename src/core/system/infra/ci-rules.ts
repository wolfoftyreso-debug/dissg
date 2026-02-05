 /**
  * CI RULES
  * 
  * Build-time enforcement of system constraints.
  */
 
 export const CI_RULES = {
   ontology_change_requires_steward_review: true,
   charter_change_requires_guardian_veto: true,
   forbidden_language_blocks_build: true,
   missing_provenance_blocks_build: true,
   missing_uncertainty_blocks_build: true,
   coverage_below_threshold_blocks_publish: true,
 } as const;
 
 export function validateBuild(context: {
   hasOntologyChanges: boolean;
   hasCharterChanges: boolean;
   hasForbiddenLanguage: boolean;
   hasMissingProvenance: boolean;
   hasMissingUncertainty: boolean;
 }): { pass: boolean; blockers: string[] } {
   const blockers: string[] = [];
   
   if (context.hasOntologyChanges && CI_RULES.ontology_change_requires_steward_review) {
     blockers.push('Ontology changes require steward review');
   }
   if (context.hasCharterChanges && CI_RULES.charter_change_requires_guardian_veto) {
     blockers.push('Charter changes require guardian approval');
   }
   if (context.hasForbiddenLanguage && CI_RULES.forbidden_language_blocks_build) {
     blockers.push('Forbidden language detected');
   }
   if (context.hasMissingProvenance && CI_RULES.missing_provenance_blocks_build) {
     blockers.push('Missing provenance detected');
   }
   if (context.hasMissingUncertainty && CI_RULES.missing_uncertainty_blocks_build) {
     blockers.push('Missing uncertainty declarations');
   }
   
   return { pass: blockers.length === 0, blockers };
 }