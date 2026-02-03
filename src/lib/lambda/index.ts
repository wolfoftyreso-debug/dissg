/**
 * GLOBAL MULTI-INDEX ANALYSIS ENGINE (LAMBDA SYSTEM)
 * 
 * Exports for the complete Lambda calculation and analysis system.
 */

// Types
export * from './index-types';

// Index Registry
export {
  INDEX_REGISTRY,
  getIndexDefinition,
  getIndicesByCategory,
  getAllIndexCodes,
  INDEX_CATEGORIES,
} from './index-registry';

// Normalization
export * from './normalization';

// Correlation Engine
export {
  calculateCorrelation,
  assessResearchAlignment,
  generateCrossAnalysisMatrix,
  type CorrelationInput,
  type CorrelationResult,
  type KnownRelationship,
  type CrossAnalysisMatrix,
  type IndexCluster,
} from './correlation-engine';

// Underperformance Detector
export {
  classifyPerformance,
  analyzePerformance,
  analyzeSector,
  getPerformanceClassLabel,
  getPerformanceColor,
  type PerformanceInput,
  type PeerGroup,
  type HistoricalPattern,
  type SectorAnalysis,
} from './underperformance-detector';

// Lambda Calculator
export {
  DEFAULT_LAMBDA_CONFIG,
  createSensorReadings,
  calculateLambda,
  interpretLambda,
  computeLambda,
  getLambdaBand,
  LAMBDA_BANDS,
  type LambdaConfig,
  type LambdaInput,
  type LambdaBand,
} from './lambda-calculator';

// Presentation
export {
  generateHeadline,
  generateSummary,
  generateStructuredPresentation,
  generateClickPath,
  generateVerificationUrl,
  createIndexPresentation,
  presentCorrelation,
  presentPerformance,
  type ClickPathLevel,
} from './presentation';

// Legal Protection
export * from './legal-protection';

// Signal Terminology
export * from './signal-terminology';

// Oscilloscope Mode
export * from './oscilloscope-mode';
