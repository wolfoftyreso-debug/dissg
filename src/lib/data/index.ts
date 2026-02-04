/**
 * DATA LAYER EXPORTS
 * 
 * Complete data aggregation manifest and utilities
 */

export {
  // Types
  type DataDomain,
  type DataChannel,
  type DataTier,
  type UpdateFrequency,
  type GeographicScope,
  type DataSourceDefinition,
  
  // Source registries
  CHANNEL_A_SOURCES,
  CHANNEL_B_SOURCES,
  CHANNEL_C_SOURCES,
  CHANNEL_D_SOURCES,
  
  // Complete manifest
  DATA_MANIFEST,
  
  // Helpers
  getSourcesByDomain,
  getSourcesByCountry,
  getSourcesByChannel,
  getEmpiricalSources,
  getSourceReliability
} from './dataManifest';
