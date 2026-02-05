/**
 * MINIMAL GOVERNANCE
 * 
 * Four roles. No content team. No editorial.
 */

/**
 * GOVERNANCE ROLES
 */
export const GOVERNANCE_ROLES = {
  /**
   * ONTOLOGY STEWARD
   */
  ONTOLOGY_STEWARD: {
    role: 'ontology_steward',
    title: 'Ontology Steward',
    count: 1,
    
    responsibilities: [
      'Maintain semantic definitions',
      'Approve ontology extensions',
      'Validate concept mappings',
      'Ensure cross-domain consistency',
    ],
    
    cannot: [
      'Modify truth nodes',
      'Change historical data',
      'Override guardrails',
      'Make editorial decisions',
    ],
    
    decisions_require: 'Trust board approval for major changes',
  },

  /**
   * GOVERNANCE MAINTAINER
   */
  GOVERNANCE_MAINTAINER: {
    role: 'governance_maintainer',
    title: 'Governance Maintainer',
    count: 1,
    
    responsibilities: [
      'Maintain Charter compliance',
      'Oversee Trust structure',
      'Manage governance processes',
      'Coordinate with Verifier council',
    ],
    
    cannot: [
      'Modify Charter unilaterally',
      'Override Trust decisions',
      'Change core contracts',
    ],
    
    decisions_require: 'Trust board vote',
  },

  /**
   * INFRASTRUCTURE LEAD
   */
  INFRASTRUCTURE_LEAD: {
    role: 'infrastructure_lead',
    title: 'Infrastructure Lead',
    count: 1,
    
    responsibilities: [
      'Operate production systems',
      'Maintain API availability',
      'Scale infrastructure',
      'Manage deployments',
    ],
    
    cannot: [
      'Modify data',
      'Change semantics',
      'Override governance',
    ],
    
    decisions_require: 'Operating entity approval',
  },

  /**
   * SECURITY/INTEGRITY
   */
  SECURITY_INTEGRITY: {
    role: 'security_integrity',
    title: 'Security & Integrity Lead',
    count: 1,
    
    responsibilities: [
      'Run red team assessments',
      'Monitor for attacks',
      'Validate data integrity',
      'Enforce immutability',
    ],
    
    cannot: [
      'Modify protected artifacts',
      'Disable guardrails',
      'Bypass audit logs',
    ],
    
    decisions_require: 'Trust oversight',
  },
} as const;

/**
 * TOTAL GOVERNANCE HEADCOUNT
 */
export const GOVERNANCE_HEADCOUNT = {
  total_roles: 4,
  total_people: 4,
  no_content_team: true,
  no_editorial_staff: true,
  no_marketing_required: true,
} as const;

/**
 * WHAT DOES NOT EXIST
 */
export const DOES_NOT_EXIST = {
  roles_that_do_not_exist: [
    'Editor',
    'Content manager',
    'Narrative designer',
    'Communications lead',
    'Policy interpreter',
    'Data analyst (for conclusions)',
  ],
  
  departments_that_do_not_exist: [
    'Editorial',
    'Content',
    'Policy',
    'Communications',
    'Interpretation',
  ],
  
  reason: 'The system produces only observations. There is nothing to editorialize.',
} as const;

/**
 * DECISION MATRIX
 */
export const DECISION_MATRIX = {
  /**
   * WHO CAN DECIDE WHAT
   */
  decisions: {
    add_new_country: {
      initiator: 'infrastructure_lead',
      approver: 'ontology_steward',
      oversight: 'governance_maintainer',
    },
    
    extend_ontology: {
      initiator: 'ontology_steward',
      approver: 'Trust board',
      oversight: 'governance_maintainer',
    },
    
    deploy_new_version: {
      initiator: 'infrastructure_lead',
      approver: 'security_integrity',
      oversight: 'none (automated)',
    },
    
    modify_charter: {
      initiator: 'governance_maintainer',
      approver: 'Trust board (unanimous)',
      oversight: 'Public Verifier',
    },
    
    security_incident: {
      initiator: 'security_integrity',
      approver: 'immediate (no approval needed)',
      oversight: 'governance_maintainer (post-hoc)',
    },
  },
} as const;

/**
 * SUSTAINABILITY MODEL
 */
export const SUSTAINABILITY = {
  minimum_viable_team: 4,
  can_operate_indefinitely: true,
  succession_plan: {
    each_role_has_documented_procedures: true,
    knowledge_is_codified_not_personal: true,
    handover_period_weeks: 8,
  },
  
  automation_level: {
    data_ingestion: 'fully_automated',
    truth_node_generation: 'fully_automated',
    red_team_testing: 'fully_automated',
    monitoring: 'fully_automated',
    deployment: 'fully_automated',
    
    human_required_for: [
      'Ontology changes',
      'Governance decisions',
      'Security incidents',
      'Trust oversight',
    ],
  },
} as const;

/**
 * VALIDATE GOVERNANCE STRUCTURE
 */
export function validateGovernanceStructure(): {
  valid: boolean;
  roles_covered: number;
  separation_adequate: boolean;
  minimal: boolean;
} {
  const roles = Object.values(GOVERNANCE_ROLES);
  
  return {
    valid: roles.length >= 4,
    roles_covered: roles.length,
    separation_adequate: roles.every(r => r.cannot.length >= 2),
    minimal: GOVERNANCE_HEADCOUNT.total_people <= 5,
  };
}
