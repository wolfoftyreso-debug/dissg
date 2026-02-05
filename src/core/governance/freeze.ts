/**
 * CORE v1 FREEZE
 * 
 * When frozen:
 * - Semantic Output Contract locked
 * - Governance Kernel locked
 * - Guardrails locked
 * 
 * All innovation happens above, never in the core.
 * This is how systems live for decades.
 */

// ============================================
// FREEZE STATUS
// ============================================

export interface CoreComponent {
  name: string;
  version: string;
  frozen: boolean;
  frozen_at: string | null;
  checksum: string;
}

const CORE_COMPONENTS: CoreComponent[] = [
  {
    name: 'SemanticOutputContract',
    version: '1.0.0',
    frozen: true,
    frozen_at: '2026-02-05T00:00:00Z',
    checksum: 'a1b2c3d4e5f6',
  },
  {
    name: 'GovernanceKernel',
    version: '1.0.0',
    frozen: true,
    frozen_at: '2026-02-05T00:00:00Z',
    checksum: 'f6e5d4c3b2a1',
  },
  {
    name: 'Guardrails',
    version: '1.0.0',
    frozen: true,
    frozen_at: '2026-02-05T00:00:00Z',
    checksum: '1a2b3c4d5e6f',
  },
  {
    name: 'TruthNodeContract',
    version: '1.0.0',
    frozen: true,
    frozen_at: '2026-02-05T00:00:00Z',
    checksum: '6f5e4d3c2b1a',
  },
  {
    name: 'IndexContract',
    version: '1.0.0',
    frozen: true,
    frozen_at: '2026-02-05T00:00:00Z',
    checksum: 'abcdef123456',
  },
];

// ============================================
// FREEZE GUARDS
// ============================================

export function isFrozen(componentName: string): boolean {
  const component = CORE_COMPONENTS.find(c => c.name === componentName);
  return component?.frozen ?? false;
}

export function getFreezeStatus(): {
  all_frozen: boolean;
  components: CoreComponent[];
  frozen_count: number;
  total_count: number;
} {
  const frozenCount = CORE_COMPONENTS.filter(c => c.frozen).length;
  
  return {
    all_frozen: frozenCount === CORE_COMPONENTS.length,
    components: [...CORE_COMPONENTS],
    frozen_count: frozenCount,
    total_count: CORE_COMPONENTS.length,
  };
}

export function attemptModification(componentName: string): {
  allowed: boolean;
  reason: string;
} {
  const component = CORE_COMPONENTS.find(c => c.name === componentName);
  
  if (!component) {
    return {
      allowed: false,
      reason: `Unknown component: ${componentName}`,
    };
  }
  
  if (component.frozen) {
    return {
      allowed: false,
      reason: `Component ${componentName} is frozen since ${component.frozen_at}. ` +
              `Modifications are permanently blocked. Build above the core instead.`,
    };
  }
  
  return {
    allowed: true,
    reason: 'Component is not frozen',
  };
}

// ============================================
// FREEZE CEREMONY
// ============================================

export function performFreeze(componentName: string, checksum: string): {
  success: boolean;
  message: string;
} {
  const component = CORE_COMPONENTS.find(c => c.name === componentName);
  
  if (!component) {
    return {
      success: false,
      message: `Unknown component: ${componentName}`,
    };
  }
  
  if (component.frozen) {
    return {
      success: false,
      message: `Component ${componentName} is already frozen`,
    };
  }
  
  // In production, this would be a one-way operation
  component.frozen = true;
  component.frozen_at = new Date().toISOString();
  component.checksum = checksum;
  
  return {
    success: true,
    message: `Component ${componentName} has been frozen at version ${component.version}. ` +
             `This action is permanent.`,
  };
}

// ============================================
// EXTENSION POINTS
// ============================================

export const EXTENSION_POINTS = {
  description: 'All innovation happens at these points, never in frozen core',
  
  safe_extensions: [
    'New Truth Nodes (uses frozen contract)',
    'New Indexes (uses frozen contract)',
    'New Decision Graphs (uses frozen contract)',
    'New Signals (uses frozen pipeline)',
    'New Domains (uses frozen ontology)',
    'New UI Components (uses frozen data contracts)',
    'New API Endpoints (uses frozen SDK)',
  ],
  
  forbidden_extensions: [
    'Modify Semantic Output structure',
    'Change Governance Rules',
    'Weaken Guardrails',
    'Alter historical data',
    'Change core type definitions',
  ],
} as const;

// ============================================
// FREEZE MANIFEST
// ============================================

export function generateFreezeManifest(): {
  version: string;
  frozen_at: string;
  components: CoreComponent[];
  combined_checksum: string;
  extension_points: typeof EXTENSION_POINTS;
} {
  const status = getFreezeStatus();
  
  // Combined checksum of all frozen components
  const combinedChecksum = CORE_COMPONENTS
    .filter(c => c.frozen)
    .map(c => c.checksum)
    .join('');
  
  return {
    version: '1.0.0',
    frozen_at: new Date().toISOString(),
    components: status.components,
    combined_checksum: combinedChecksum,
    extension_points: EXTENSION_POINTS,
  };
}
