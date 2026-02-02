/**
 * 🧾 MASTER EXECUTION BLOCK 55
 * 
 * PUBLIC TRUST LOG & GOVERNANCE — IMMUNE TO BULLSHIT
 * 
 * Everything is traceable. Nothing can be hidden.
 */

// ============================================================================
// 1. CHANGE TYPES (STANDARDIZED)
// ============================================================================

export const CHANGE_TYPES = {
  data_update: {
    label: 'Datauppdatering',
    description: 'Ny källa eller ny tidsperiod',
    icon: 'Database',
  },
  method_update: {
    label: 'Metoduppdatering', 
    description: 'Tydligare eller förbättrad metod',
    icon: 'Settings',
  },
  text_simplification: {
    label: 'Textförenkling',
    description: 'Kortare, tydligare text',
    icon: 'FileText',
  },
  structure_change: {
    label: 'Strukturändring',
    description: 'Ändrad sidstruktur eller navigation',
    icon: 'Layout',
  },
  bug_fix: {
    label: 'Buggfix',
    description: 'Tekniskt fel rättat',
    icon: 'Bug',
  },
  deprecation: {
    label: 'Avveckling',
    description: 'Innehåll eller funktion borttagen',
    icon: 'Trash2',
  },
} as const;

// ❌ FORBIDDEN - These types are NOT allowed
export const FORBIDDEN_CHANGE_TYPES = [
  'editorial_update',
  'policy_clarification',
  'content_adjustment',
  'tone_change',
] as const;

export type ChangeType = keyof typeof CHANGE_TYPES;

// ============================================================================
// 2. GOVERNANCE ROLES
// ============================================================================

export const GOVERNANCE_ROLES = {
  data_steward: {
    label: 'Data Steward',
    description: 'Ansvarar för datakällor och kvalitet',
    canModify: ['data_update'],
    canReview: ['data_update', 'method_update'],
  },
  method_reviewer: {
    label: 'Method Reviewer',
    description: 'Granskar och godkänner metoder',
    canModify: ['method_update'],
    canReview: ['method_update', 'data_update'],
  },
  system_maintainer: {
    label: 'System Maintainer',
    description: 'Infrastruktur och prestanda',
    canModify: ['bug_fix', 'structure_change'],
    canReview: ['bug_fix', 'structure_change'],
  },
  public_observer: {
    label: 'Public Observer',
    description: 'Kan läsa allt, kan inte ändra något',
    canModify: [],
    canReview: [],
  },
} as const;

export type GovernanceRole = keyof typeof GOVERNANCE_ROLES;

// ============================================================================
// 3. REVIEW STATUS
// ============================================================================

export const REVIEW_STATUSES = {
  pending: {
    label: 'Väntar',
    color: 'text-status-warning',
    bgColor: 'bg-status-warning/10',
  },
  verified: {
    label: 'Verifierad',
    color: 'text-status-positive',
    bgColor: 'bg-status-positive/10',
  },
  disputed: {
    label: 'Ifrågasatt',
    color: 'text-status-critical',
    bgColor: 'bg-status-critical/10',
  },
  resolved: {
    label: 'Löst',
    color: 'text-muted-foreground',
    bgColor: 'bg-muted',
  },
} as const;

export type ReviewStatus = keyof typeof REVIEW_STATUSES;

// ============================================================================
// 4. ANTI-INFLUENCE LOCKS
// ============================================================================

export const ANTI_INFLUENCE_BLOCKS = {
  sponsored_content: {
    label: 'Sponsrat innehåll',
    description: 'Innehåll som betalats för visning',
    autoBlocked: true,
  },
  political_banners: {
    label: 'Politiska banners',
    description: 'Partipolitisk marknadsföring',
    autoBlocked: true,
  },
  partnership_content: {
    label: 'Partnerskapsinnehåll',
    description: 'Innehåll från "partners" i faktavyer',
    autoBlocked: true,
  },
  pay_to_rank: {
    label: 'Pay-to-rank',
    description: 'Prioritering baserad på betalning',
    autoBlocked: true,
  },
  editorial_influence: {
    label: 'Redaktionell påverkan',
    description: 'Externa försök att ändra presentation',
    autoBlocked: true,
  },
} as const;

// ============================================================================
// 5. DATA IMMUTABILITY RULES
// ============================================================================

export const IMMUTABILITY_RULES = {
  rawDataNeverOverwritten: true,
  aggregationVersioned: true,
  olderVersionsAlwaysAvailable: true,
  urlsNeverChange: true,
  historyCannotBeRewritten: true,
};

// ============================================================================
// 6. TRUST LOG ENTRY INTERFACE
// ============================================================================

export interface TrustLogEntry {
  id: string;
  log_id: string;
  change_type: ChangeType;
  scope: string;
  reason: string;
  data_changed: boolean;
  method_changed: boolean;
  content_impact: string | null;
  initiated_by: string;
  initiated_by_role: GovernanceRole | null;
  review_status: ReviewStatus;
  reviewed_at: string | null;
  reviewed_by_role: GovernanceRole | null;
  created_at: string;
}

// ============================================================================
// 7. CRISIS RESPONSE (AUTOMATIC)
// ============================================================================

export interface CrisisResponse {
  accusation: string;
  systemResponse: {
    dataUsed: string[];
    aggregationMethod: string;
    whatIsNotClaimed: string[];
    historicalChanges: TrustLogEntry[];
  };
}

export const CRISIS_RESPONSE_TEMPLATE = {
  bias: {
    template: 'All data comes from named sources with documented methodology.',
    evidenceRequired: ['source_list', 'method_description', 'trust_log_entries'],
  },
  political_agenda: {
    template: 'No policy recommendations are made. Only observed data is shown.',
    evidenceRequired: ['what_is_not_claimed', 'source_list'],
  },
  manipulation: {
    template: 'All changes are logged publicly. Historical data is immutable.',
    evidenceRequired: ['trust_log_entries', 'data_versions'],
  },
} as const;

// ============================================================================
// 8. PUBLIC TRANSPARENCY REQUIREMENTS
// ============================================================================

export const TRANSPARENCY_REQUIREMENTS = {
  // Every page must have these accessible
  mustHaveSourceLink: true,
  mustHaveMethodLink: true,
  mustHaveUncertaintyDisplay: true,
  mustHaveVersionHistory: true,
  mustHaveTrustLogEntries: true,
  
  // Max clicks to reach transparency
  maxClicksToSource: 1,
  maxClicksToMethod: 1,
  maxClicksToTrustLog: 2,
};

// ============================================================================
// 9. DEFINITION OF DONE
// ============================================================================

export const GOVERNANCE_DONE_CRITERIA = {
  allChangesArePublic: true,
  noInternalCanSneakChange: true,
  criticismCanBeAnsweredWithLinks: true,
  trustIsInStructureNotPeople: true,
};
