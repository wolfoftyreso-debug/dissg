/**
 * AUTOMATION PIPELINE
 * 
 * Deterministic, version-pinned, no human editing.
 */

import type { AutomationPipeline, PipelineStage } from './types';

// ============================================================================
// PIPELINE STAGES
// ============================================================================

export const PIPELINE_STAGES: readonly PipelineStage[] = [
  { name: 'Search Intake', order: 1, automated: true },
  { name: 'Query Normalization', order: 2, automated: true },
  { name: 'Decision Blueprint Match', order: 3, automated: true },
  { name: 'Draft Generation', order: 4, automated: true },
  { name: 'Coverage Check', order: 5, automated: true },
  { name: 'Publish CDP / Publish Cannot-Answer', order: 6, automated: true },
  { name: 'Index + AI Ingest', order: 7, automated: true },
];

// ============================================================================
// HUMAN-ONLY TASKS
// ============================================================================

export const HUMAN_ONLY_TASKS = [
  'Ontology changes',
  'Reference cases',
  'Stewardship decisions',
] as const;

// ============================================================================
// FULL PIPELINE
// ============================================================================

export const AUTOMATION_PIPELINE: AutomationPipeline = {
  stages: PIPELINE_STAGES,
  properties: {
    deterministic: true,
    version_pinned: true,
    no_human_editing: true,
  },
  human_only_for: HUMAN_ONLY_TASKS,
};

// ============================================================================
// PIPELINE EXECUTION
// ============================================================================

export interface PipelineExecution {
  readonly id: string;
  readonly started_at: string;
  readonly completed_at?: string;
  readonly stage_results: readonly StageResult[];
  readonly final_output: 'cdp' | 'cannot_answer' | 'rejected';
}

export interface StageResult {
  readonly stage: string;
  readonly status: 'passed' | 'failed' | 'skipped';
  readonly duration_ms: number;
  readonly output_hash?: string;
}

export function validatePipelineIntegrity(
  execution: PipelineExecution
): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  
  // Check all stages completed
  const completedStages = execution.stage_results.filter(s => s.status === 'passed');
  if (completedStages.length < PIPELINE_STAGES.length) {
    issues.push('Not all stages completed');
  }
  
  // Check determinism (all stages should have output_hash)
  const missingHashes = execution.stage_results.filter(
    s => s.status === 'passed' && !s.output_hash
  );
  if (missingHashes.length > 0) {
    issues.push('Missing output hashes - determinism not verified');
  }
  
  return {
    valid: issues.length === 0,
    issues,
  };
}
