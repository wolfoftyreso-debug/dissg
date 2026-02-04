/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * DATA LAYER EXPORTS
 * Machine-Readable Data Aggregation Manifest & Utilities
 * ═══════════════════════════════════════════════════════════════════════════════
 */

export {
  // ─────────────────────────────────────────────────────────────────────────
  // TYPE DEFINITIONS
  // ─────────────────────────────────────────────────────────────────────────
  type DataDomain,
  type DataChannel,
  type DataTier,
  type UpdateFrequency,
  type GeographicScope,
  type LicenseType,
  type ApiType,
  type DataSourceDefinition,
  type ManifestStatistics,
  type ValidationResult,
  
  // ─────────────────────────────────────────────────────────────────────────
  // TYPE CONSTANTS (for type guards and validation)
  // ─────────────────────────────────────────────────────────────────────────
  DATA_DOMAIN_CODES,
  DATA_CHANNEL_CODES,
  DATA_TIER_CODES,
  UPDATE_FREQUENCY_CODES,
  GEOGRAPHIC_SCOPE_CODES,
  LICENSE_CODES,
  API_TYPE_CODES,
  
  // ─────────────────────────────────────────────────────────────────────────
  // METADATA REGISTRIES
  // ─────────────────────────────────────────────────────────────────────────
  DATA_DOMAIN_LABELS,
  DATA_CHANNEL_METADATA,
  DATA_TIER_METADATA,
  UPDATE_FREQUENCY_METADATA,
  GEOGRAPHIC_SCOPE_METADATA,
  LICENSE_METADATA,
  
  // ─────────────────────────────────────────────────────────────────────────
  // SOURCE REGISTRIES
  // ─────────────────────────────────────────────────────────────────────────
  CHANNEL_A_SOURCES,
  CHANNEL_B_SOURCES,
  CHANNEL_C_SOURCES,
  CHANNEL_D_SOURCES,
  
  // ─────────────────────────────────────────────────────────────────────────
  // COMPLETE MANIFEST
  // ─────────────────────────────────────────────────────────────────────────
  DATA_MANIFEST,
  
  // ─────────────────────────────────────────────────────────────────────────
  // QUERY HELPERS
  // ─────────────────────────────────────────────────────────────────────────
  getAllSources,
  getSourceById,
  getSourcesByDomain,
  getSourcesByCountry,
  getSourcesByChannel,
  getSourcesByTier,
  getEmpiricalSources,
  getSourceReliability,
  
  // ─────────────────────────────────────────────────────────────────────────
  // VALIDATION
  // ─────────────────────────────────────────────────────────────────────────
  validateSource,
  validateManifest,
  
  // ─────────────────────────────────────────────────────────────────────────
  // SERIALIZATION (Schema.org / JSON-LD)
  // ─────────────────────────────────────────────────────────────────────────
  toSchemaOrgDataset,
  toSchemaOrgCatalog,
  getManifestSummary
} from './dataManifest';
