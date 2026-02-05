/**
 * PIPELINE STAGE 5: AUTO-GENERATION OF 50 BLOCKS
 * 
 * Factory mode. All 50 blocks generated.
 * Each block must pass validation.
 * Empty blocks shown openly — no fill, no guess.
 */

import type {
  BlockGenerationResult,
  BlockValidation,
  ResolvedEntity,
  NormalizedIntent,
} from './types';
import type { CDPBlock } from '../types';
import { ALL_QUESTION_BLOCKS } from '../question-blocks';

/**
 * Generate all 50 blocks for entity + intent
 */
export function generateAllBlocks(
  entity: ResolvedEntity,
  intent: NormalizedIntent,
  dataSource: BlockDataSource
): BlockGenerationResult[] {
  return ALL_QUESTION_BLOCKS.map(block => 
    generateBlock(block.block_id, entity, intent, dataSource)
  );
}

/**
 * Generate single block
 */
export function generateBlock(
  blockId: number,
  entity: ResolvedEntity,
  intent: NormalizedIntent,
  dataSource: BlockDataSource
): BlockGenerationResult {
  const blockDef = ALL_QUESTION_BLOCKS.find(b => b.block_id === blockId);
  if (!blockDef) {
    return {
      block_id: blockId,
      status: 'empty',
      validation: createFailedValidation('Block definition not found'),
      empty_reason: 'Invalid block ID',
    };
  }
  
  // Try to get data for this block
  const data = dataSource.getDataForBlock(blockId, entity.entity_id);
  
  if (!data) {
    return {
      block_id: blockId,
      status: 'empty',
      validation: {
        data_valid: false,
        scope_valid: true,
        uncertainty_stated: true, // Empty is a form of uncertainty statement
        sources_cited: false,
        errors: ['No data available for this block'],
      },
      empty_reason: blockDef.empty_display,
    };
  }
  
  // Validate the data
  const validation = validateBlockData(blockDef, data, intent);
  
  if (!validation.data_valid) {
    return {
      block_id: blockId,
      status: 'empty',
      validation,
      empty_reason: `Data failed validation: ${validation.errors.join(', ')}`,
    };
  }
  
  // Check if all required fields are present
  const isPartial = !validation.sources_cited || !validation.uncertainty_stated;
  
  return {
    block_id: blockId,
    status: isPartial ? 'partial' : 'filled',
    validation,
    content: data,
  };
}

/**
 * Validate block data
 */
function validateBlockData(
  blockDef: typeof ALL_QUESTION_BLOCKS[0],
  data: BlockData,
  intent: NormalizedIntent
): BlockValidation {
  const errors: string[] = [];
  
  // Data validation
  const dataValid = data.value !== undefined && data.value !== null;
  if (!dataValid) {
    errors.push('Missing primary value');
  }
  
  // Scope validation
  const scopeValid = checkScopeValidity(data, intent);
  if (!scopeValid) {
    errors.push('Data scope does not match intent scope');
  }
  
  // Uncertainty statement check
  const uncertaintyStated = data.uncertainty !== undefined && data.uncertainty !== '';
  if (!uncertaintyStated && blockDef.data_type === 'quantitative') {
    errors.push('Quantitative data requires uncertainty statement');
  }
  
  // Sources check
  const sourcesCited = data.sources && data.sources.length > 0;
  if (!sourcesCited && blockDef.requires_sources) {
    errors.push('Required sources not cited');
  }
  
  return {
    data_valid: dataValid,
    scope_valid: scopeValid,
    uncertainty_stated: uncertaintyStated,
    sources_cited: sourcesCited,
    errors,
  };
}

/**
 * Check scope validity
 */
function checkScopeValidity(data: BlockData, intent: NormalizedIntent): boolean {
  // Check time horizon compatibility
  if (data.time_scope && intent.time_horizon) {
    const timeScopes = {
      'immediate': 0,
      'short_term': 1,
      'multi_year': 2,
      'lifetime': 3,
    };
    
    // Data scope should be at least as long as intent scope
    const dataScope = timeScopes[data.time_scope as keyof typeof timeScopes] ?? 1;
    const intentScope = timeScopes[intent.time_horizon];
    
    if (dataScope < intentScope) {
      return false;
    }
  }
  
  return true;
}

/**
 * Create failed validation result
 */
function createFailedValidation(error: string): BlockValidation {
  return {
    data_valid: false,
    scope_valid: false,
    uncertainty_stated: false,
    sources_cited: false,
    errors: [error],
  };
}

/**
 * Convert generation results to CDP blocks
 */
export function resultsToCDPBlocks(results: BlockGenerationResult[]): CDPBlock[] {
  return results.map(result => {
    const blockDef = ALL_QUESTION_BLOCKS.find(b => b.block_id === result.block_id)!;
    
    if (result.status === 'empty') {
      return {
        block_id: result.block_id,
        block_group: blockDef.block_group,
        question: blockDef.question,
        has_content: false,
        empty_state: {
          message: result.empty_reason || 'No data available',
          why_empty: result.validation.errors.join('; ') || 'Data not collected',
          can_be_filled_by: ['official_statistics', 'research', 'user_data'],
        },
      };
    }
    
    return {
      block_id: result.block_id,
      block_group: blockDef.block_group,
      question: blockDef.question,
      has_content: true,
      content: {
        summary: (result.content as BlockData)?.summary || '',
        data_points: [],
        sources: (result.content as BlockData)?.sources?.map(s => ({
          source_id: s.id,
          name: s.name,
          type: 'official_statistics' as const,
          retrieved_at: new Date().toISOString(),
          reliability_score: s.reliability || 0.8,
        })) || [],
        uncertainty_statement: (result.content as BlockData)?.uncertainty,
      },
    };
  });
}

/**
 * Block data structure (from data source)
 */
export interface BlockData {
  value: unknown;
  summary?: string;
  uncertainty?: string;
  time_scope?: string;
  geo_scope?: string;
  sources?: Array<{
    id: string;
    name: string;
    reliability?: number;
  }>;
}

/**
 * Block data source interface
 */
export interface BlockDataSource {
  getDataForBlock(blockId: number, entityId: string): BlockData | null;
}

/**
 * BLOCK GENERATOR MASTERPROMPT
 */
export const BLOCK_GENERATOR_MASTERPROMPT = `
You generate the 50 QUESTION BLOCKS.

FACTORY MODE:
All 50 blocks generated.
Each block must pass validation.
Empty blocks shown openly — no fill, no guess.

VALIDATION FOR EACH BLOCK:
1. Data validation — primary value exists and is valid
2. Scope validation — data scope matches intent scope
3. Uncertainty check — quantitative data needs uncertainty statement
4. Sources check — required blocks must cite sources

BLOCK STATES:
- filled: All validations pass
- partial: Some validations fail (but can proceed)
- empty: No data or data failed validation

EMPTY BLOCKS:
- Shown openly
- No padding or filler text
- Display: "[Block question]: No verified data available"
- Show why empty
- Show what could fill it

RULES:
- Never generate fake data
- Never interpolate missing values
- Never hide empty blocks
- Always state uncertainty
- Always cite sources when available
`;
