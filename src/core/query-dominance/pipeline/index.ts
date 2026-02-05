/**
 * SEARCH → DECISION INGESTION PIPELINE
 * 
 * From world's questions → structured decision surfaces.
 * This is the production line.
 * When complete, no practical limit to expansion.
 */

// Types
export type {
  RawSearchIntent,
  IntentSource,
  NormalizedIntent,
  ResolvedEntity,
  EntityType,
  EntityStub,
  CoverageCheck,
  DataGap,
  BlockGenerationResult,
  BlockValidation,
  ConditionalAnswer,
  Condition,
  PublicationResult,
  UpdateEvent,
  UpdateTrigger,
  PipelineRun,
  PipelineStage,
  PipelineMetrics,
  PipelineConfig,
} from './types';

// Stage 1: Intake
export {
  registerIntent,
  createFromAggregatedSearch,
  createFromPeopleAlsoAsk,
  createFromRelatedQueries,
  createFromAIAgentRequest,
  createFromInternalGap,
  getAllIntents,
  getIntentsBySource,
  getIntentsByGeo,
  getTopIntents,
  clearRegistry,
  INTAKE_MASTERPROMPT,
} from './intake';

// Stage 2: Normalization
export {
  normalizeIntent,
  normalizeIntents,
  areIntentsEquivalent,
  NORMALIZER_MASTERPROMPT,
} from './normalizer';

// Stage 3: Entity Resolution
export {
  resolveEntity,
  isEntityStub,
  getPendingStubs,
  ENTITY_RESOLVER_MASTERPROMPT,
} from './entity-resolver';

// Stage 4: Coverage Check
export {
  checkCoverage,
  createCannotAnswerResponse,
  COVERAGE_CHECKER_MASTERPROMPT,
} from './coverage-checker';
export type { AvailableDataSummary } from './coverage-checker';

// Stage 5: Block Generation
export {
  generateAllBlocks,
  generateBlock,
  resultsToCDPBlocks,
  BLOCK_GENERATOR_MASTERPROMPT,
} from './block-generator';
export type { BlockData, BlockDataSource } from './block-generator';

// Stage 6: Answer Compilation
export {
  compileConditionalAnswer,
  formatAnswerForHuman,
  ANSWER_COMPILER_MASTERPROMPT,
} from './answer-compiler';

// Stage 7: Publication
export {
  publishCDP,
  PUBLISHER_MASTERPROMPT,
} from './publisher';

// Stage 8: Update Loop
export {
  checkForUpdates,
  applyUpdate,
  getUpdateHistory,
  scheduleRefresh,
  isRefreshDue,
  calculateRefreshInterval,
  UPDATE_LOOP_MASTERPROMPT,
} from './update-loop';

/**
 * PIPELINE MASTERPROMPT
 */
export const PIPELINE_MASTERPROMPT = `
You operate the SEARCH → DECISION INGESTION PIPELINE.

FROM: World's questions
TO: Structured decision surfaces

8 STAGES:

1. INTAKE
   - Aggregated search intents
   - People Also Ask clusters
   - Related queries
   - AI agent requests (anonymized)
   - Internal gaps
   → Raw intention, not text

2. NORMALIZATION
   - Text → Decision Blueprint
   - Same intention = same blueprint
   - Language-independent core

3. ENTITY RESOLUTION
   - What the question is about
   - Match to ontology
   - Create stubs for unknowns
   - No conclusions, only identification

4. COVERAGE CHECK
   - Sufficient history?
   - 2+ alternatives?
   - Cost/risk/performance data?
   - build_allowed = false → "Cannot answer reliably"

5. BLOCK GENERATION
   - All 50 blocks generated
   - Validation: data, scope, uncertainty, sources
   - Empty blocks shown openly

6. ANSWER COMPILATION
   - Parametric conclusions
   - NEVER advice
   - Conditions + dominance + confidence

7. PUBLICATION
   - Human view: structured, clickable
   - Machine view: JSON, Schema.org, versioned
   - Wins both SEO and AI

8. UPDATE LOOP
   - Only affected blocks update
   - Version bumps
   - History preserved
   - Nothing rewritten backwards

SCALING:
- 10-50 CDP/day initially
- 500+/day when sources warm
- Global coverage in months

This is industrial knowledge production.
`;

/**
 * Run full pipeline for a query
 */
export async function runPipeline(
  query: string,
  _config?: Partial<import('./types').PipelineConfig>
): Promise<{
  success: boolean;
  result?: import('./types').PublicationResult;
  error?: string;
  metrics: import('./types').PipelineMetrics;
}> {
  const startTime = Date.now();
  const metrics: import('./types').PipelineMetrics = {
    intents_processed: 0,
    entities_resolved: 0,
    cdps_generated: 0,
    blocks_filled: 0,
    blocks_empty: 0,
    average_confidence: 0,
    duration_ms: 0,
  };
  
  try {
    // Stage 1: Create intent from query
    const { createFromAggregatedSearch } = await import('./intake');
    const intent = createFromAggregatedSearch(
      `intent_${Date.now()}`,
      [query],
      1,
      'global',
      'en'
    );
    metrics.intents_processed = 1;
    
    // Stage 2: Normalize
    const { normalizeIntent } = await import('./normalizer');
    const normalized = normalizeIntent(intent);
    
    // Stage 3: Resolve entity
    const { resolveEntity, isEntityStub } = await import('./entity-resolver');
    const entityResult = resolveEntity(query.split(' ').slice(-2).join(' '));
    
    if (isEntityStub(entityResult)) {
      return {
        success: false,
        error: 'Entity could not be resolved with sufficient confidence',
        metrics: { ...metrics, duration_ms: Date.now() - startTime },
      };
    }
    
    metrics.entities_resolved = 1;
    
    // Stage 4: Check coverage
    const { checkCoverage, createCannotAnswerResponse } = await import('./coverage-checker');
    const mockDataSummary = {
      hasBasicInfo: true,
      hasCostData: true,
      hasTCOData: false,
      hasReliabilityData: true,
      hasRiskData: true,
      hasComparativeData: true,
      comparableAlternatives: 2,
      dataFreshness: 'current' as const,
      sourceCount: 5,
    };
    
    const coverage = checkCoverage(entityResult, normalized, mockDataSummary);
    
    if (!coverage.build_allowed) {
      const cannotAnswer = createCannotAnswerResponse(coverage);
      return {
        success: false,
        error: cannotAnswer.message,
        metrics: { ...metrics, duration_ms: Date.now() - startTime },
      };
    }
    
    // Stage 5: Generate blocks
    const { generateAllBlocks, resultsToCDPBlocks } = await import('./block-generator');
    const mockDataSource = {
      getDataForBlock: () => null, // Empty data source for now
    };
    
    const blockResults = generateAllBlocks(entityResult, normalized, mockDataSource);
    const cdpBlocks = resultsToCDPBlocks(blockResults);
    
    metrics.blocks_filled = blockResults.filter(b => b.status === 'filled').length;
    metrics.blocks_empty = blockResults.filter(b => b.status === 'empty').length;
    
    // Create CDP
    const { generateEmptyCDP, mapQueryToBlueprint } = await import('../cdp-generator');
    const blueprint = mapQueryToBlueprint(query);
    const cdp = generateEmptyCDP(query, blueprint);
    cdp.blocks = cdpBlocks;
    
    metrics.cdps_generated = 1;
    
    // Stage 6: Compile answer
    const { compileConditionalAnswer } = await import('./answer-compiler');
    const answer = compileConditionalAnswer(
      entityResult,
      normalized,
      blockResults,
      entityResult.alternatives
    );
    
    metrics.average_confidence = answer.confidence;
    
    // Stage 7: Publish
    const { publishCDP } = await import('./publisher');
    const result = publishCDP(cdp, entityResult, normalized, answer);
    
    metrics.duration_ms = Date.now() - startTime;
    
    return {
      success: true,
      result,
      metrics,
    };
    
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Pipeline error',
      metrics: { ...metrics, duration_ms: Date.now() - startTime },
    };
  }
}
