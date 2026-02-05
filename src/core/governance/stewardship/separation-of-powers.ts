/**
 * SEPARATION OF POWERS
 * 
 * Four roles that can NEVER overlap.
 * No group can alone change the system's nature.
 */

import type { StewardshipRole, RoleDefinition } from './types';

/**
 * The Four Powers
 */
export const ROLE_DEFINITIONS: Record<StewardshipRole, RoleDefinition> = {
  truth_steward: {
    role: 'truth_steward',
    owns: [
      'ontology',
      'semantic_definitions',
      'decision_standards',
      'legitimacy_rules',
      'methodology_specs',
    ],
    can_do: [
      'propose_ontology_changes',
      'review_semantic_drift',
      'approve_new_standards',
      'define_legitimacy_criteria',
    ],
    never_can: [
      'touch_infrastructure',
      'modify_interface',
      'rush_changes',
      'bypass_latency',
    ],
    change_authority: 'approve',
  },
  
  system_operator: {
    role: 'system_operator',
    owns: [
      'infrastructure',
      'performance',
      'availability',
      'scaling',
    ],
    can_do: [
      'deploy_infrastructure',
      'optimize_performance',
      'manage_mirrors',
      'handle_incidents',
    ],
    never_can: [
      'touch_ontology',
      'modify_semantics',
      'change_standards',
      'alter_legitimacy_rules',
    ],
    change_authority: 'execute',
  },
  
  interface_designer: {
    role: 'interface_designer',
    owns: [
      'user_experience',
      'visual_design',
      'interaction_patterns',
    ],
    can_do: [
      'design_interfaces',
      'improve_usability',
      'create_visualizations',
    ],
    never_can: [
      'change_data_structure',
      'hide_uncertainty',
      'add_recommendations',
      'simplify_away_complexity',
    ],
    change_authority: 'propose',
  },
  
  external_verifier: {
    role: 'external_verifier',
    owns: [
      'audit_rights',
      'verification_access',
      'public_reporting',
    ],
    can_do: [
      'audit_system',
      'verify_snapshots',
      'publish_findings',
      'flag_violations',
    ],
    never_can: [
      'modify_anything',
      'block_publication',
      'access_private_data',
    ],
    change_authority: 'none',
  },
};

/**
 * Check if a role can perform an action
 */
export function canRolePerform(
  role: StewardshipRole,
  action: string
): { allowed: boolean; reason: string } {
  const definition = ROLE_DEFINITIONS[role];
  
  // Check if explicitly allowed
  if (definition.can_do.includes(action)) {
    return { allowed: true, reason: `Action '${action}' is within ${role} scope` };
  }
  
  // Check if explicitly forbidden
  if (definition.never_can.includes(action)) {
    return { 
      allowed: false, 
      reason: `Action '${action}' is NEVER allowed for ${role}` 
    };
  }
  
  // Default deny
  return { 
    allowed: false, 
    reason: `Action '${action}' is not in ${role} allowed actions` 
  };
}

/**
 * Check if role separation is violated
 */
export function checkRoleSeparation(
  personRoles: StewardshipRole[]
): { valid: boolean; violations: string[] } {
  const violations: string[] = [];
  
  // No person can have more than one role
  if (personRoles.length > 1) {
    violations.push(`Person has ${personRoles.length} roles: ${personRoles.join(', ')}`);
  }
  
  // Specific incompatible combinations
  const incompatible: [StewardshipRole, StewardshipRole][] = [
    ['truth_steward', 'system_operator'],
    ['truth_steward', 'interface_designer'],
    ['system_operator', 'external_verifier'],
  ];
  
  for (const [role1, role2] of incompatible) {
    if (personRoles.includes(role1) && personRoles.includes(role2)) {
      violations.push(`Incompatible roles: ${role1} and ${role2}`);
    }
  }
  
  return { valid: violations.length === 0, violations };
}

/**
 * Why separation matters
 */
export const SEPARATION_RATIONALE = {
  truth_steward: 'Protects semantic integrity from operational pressures',
  system_operator: 'Ensures technical stability without semantic authority',
  interface_designer: 'Allows UX improvement without structural power',
  external_verifier: 'Provides independent oversight without modification rights',
};

/**
 * SEPARATION MASTERPROMPT
 */
export const SEPARATION_MASTERPROMPT = `
You enforce SEPARATION OF POWERS.

THE FOUR ROLES (NEVER OVERLAP):

1. TRUTH STEWARDS
   Owns: Ontology, standards, legitimacy rules
   Can: Propose/approve semantic changes
   Never: Touch infrastructure or interface

2. SYSTEM OPERATORS
   Owns: Infrastructure, performance, availability
   Can: Deploy, scale, manage
   Never: Touch ontology or semantics

3. INTERFACE DESIGNERS
   Owns: User experience, visuals
   Can: Design, improve usability
   Never: Change structure, hide uncertainty

4. EXTERNAL VERIFIERS
   Owns: Audit rights, verification access
   Can: Audit, verify, publish findings
   Never: Modify anything

No person can hold more than one role.
No group can alone change the system's nature.

This is separation of powers, not collaboration.
`;
