/**
 * GOVERNANCE MODULE
 * 
 * Code + Contract + Transparency.
 * Machine-enforceable. Append-only. Public.
 */

// Kernel
export {
  CHANGE_RULES,
  GOVERNANCE_RULES,
  PUBLIC_RULEBOOK,
  evaluateChange,
  getChangeCategory,
} from './kernel';

export type {
  ChangeCategory,
  ChangeType,
  GovernanceRule,
  GovernanceContext,
  GovernanceResult,
} from './kernel';

// Change Manifest
export {
  createManifest,
  validateManifest,
  registerManifest,
  getManifestHistory,
  getLatestManifest,
  getManifest,
  canDeploy,
} from './change-manifest';

export type {
  ChangeManifest,
  MethodologyChange,
  ManifestValidation,
} from './change-manifest';

// Security
export {
  DEFAULT_PERMISSIONS,
  ATTACK_MITIGATIONS,
  checkRateLimit,
  computeEntityHash,
  verifyIntegrity,
  logSecurityEvent,
  getSecurityLog,
} from './security';

export type {
  ApiToken,
  ApiPermission,
  IntegrityCheck,
} from './security';

// AI SDK
export {
  SDK_ENDPOINTS,
  SUPPORTED_VERSIONS,
  CURRENT_VERSION,
  DEPRECATED_VERSIONS,
  buildAIResponse,
  isVersionSupported,
  getVersionWarning,
} from './ai-sdk';

export type {
  AIAgentRequest,
  AIAgentResponse,
  ResponseMeta,
  PaginationInfo,
  RelationInfo,
  ScopeInfo,
  UncertaintyInfo,
} from './ai-sdk';

// Scale
export {
  CACHE_STRATEGY,
  getPrecomputeJobs,
  cacheGet,
  cacheSet,
  cacheInvalidate,
  getPerformanceTargets,
  getCacheStats,
} from './scale';

export type {
  CacheLayer,
  CacheConfig,
  PrecomputeJob,
} from './scale';

// Freeze
export {
  isFrozen,
  getFreezeStatus,
  attemptModification,
  performFreeze,
  generateFreezeManifest,
  EXTENSION_POINTS,
} from './freeze';

export type { CoreComponent } from './freeze';
