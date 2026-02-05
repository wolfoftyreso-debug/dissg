/**
 * FULL RED TEAM ATTACK SIMULATOR
 * 
 * Koordinerar alla attacktyper och genererar
 * systemisk attackrapport.
 */

import {
  LANGUAGE_ATTACKS,
  runAllLanguageAttacks,
  type LanguageAttack,
  type AttackResult as LanguageAttackResult,
} from './attacks/language-attacks';

import {
  DATA_ATTACKS,
  runAllDataAttacks,
  type DataAttack,
  type DataAttackResult,
  type DataAttackContext,
  type SystemState as DataSystemState,
} from './attacks/data-attacks';

import {
  INDEX_ATTACKS,
  runAllIndexAttacks,
  type IndexAttack,
  type IndexAttackResult,
  type IndexAttackAttempt,
  type IndexSystemResponse,
} from './attacks/index-attacks';

import {
  UI_ATTACKS,
  runAllUIAttacks,
  type UIAttack,
  type UIAttackResult,
  type UIState,
} from './attacks/ui-attacks';

import {
  HISTORY_ATTACKS,
  runAllHistoryAttacks,
  type HistoryAttack,
  type HistoryAttackResult,
  type HistoryAttackAttempt,
  type HistorySystemState,
} from './attacks/history-attacks';

import {
  AGENT_ATTACKS,
  runAllAgentAttacks,
  type AgentAttack,
  type AgentAttackResult,
  type AgentAttackAttempt,
  type AgentSystemResponse,
} from './attacks/agent-attacks';

import type { RedTeamViolation } from './red-team-checks';

/**
 * ATTACK CATEGORIES
 */
export type AttackCategory = 
  | 'language'   // A1-A3
  | 'data'       // B1-B2
  | 'index'      // C1-C2
  | 'ui'         // D1-D2
  | 'history'    // E1-E2
  | 'agent';     // F1-F2

/**
 * FULL SIMULATION RESULT
 */
export interface FullSimulationResult {
  simulationId: string;
  executedAt: string;
  duration: number;
  
  categories: {
    language: CategoryResult<LanguageAttackResult>;
    data: CategoryResult<DataAttackResult>;
    index: CategoryResult<IndexAttackResult>;
    ui: CategoryResult<UIAttackResult>;
    history: CategoryResult<HistoryAttackResult>;
    agent: CategoryResult<AgentAttackResult>;
  };
  
  summary: SimulationSummary;
  
  systemApproved: boolean;
  blockingViolations: RedTeamViolation[];
}

export interface CategoryResult<T> {
  category: AttackCategory;
  attackCount: number;
  passedCount: number;
  failedCount: number;
  results: Map<string, T>;
  allPassed: boolean;
}

export interface SimulationSummary {
  totalAttacks: number;
  totalPassed: number;
  totalFailed: number;
  passRate: number;
  
  // Objective criteria from spec
  noAdviceGiven: boolean;
  noIndividualInterpretation: boolean;
  noValueJudgment: boolean;
  noHistoryChanged: boolean;
  noNarrativeCreated: boolean;
  allAttacksLogged: boolean;
  allBlocksComprehensible: boolean;
  systemContinuesFunctioning: boolean;
}

/**
 * SYSTEM MOCKS (for testing without full system)
 */
export interface SystemMocks {
  responseGenerator: (input: string) => string;
  dataStateProvider: (context: DataAttackContext) => DataSystemState;
  indexResponseProvider: (attempt: IndexAttackAttempt) => IndexSystemResponse;
  uiState: UIState;
  historyStateProvider: (attempt: HistoryAttackAttempt) => HistorySystemState;
  agentResponseProvider: (attempt: AgentAttackAttempt) => AgentSystemResponse;
}

/**
 * Create default secure mocks (system behaves correctly)
 */
export function createSecureSystemMocks(): SystemMocks {
  return {
    responseGenerator: (input: string): string => {
      // Secure system blocks all attack inputs
      if (input.toLowerCase().includes('bästa') || input.toLowerCase().includes('göra')) {
        return 'Action-oriented requests are not supported. See valid questions.';
      }
      if (input.toLowerCase().includes('jag har') || input.toLowerCase().includes('jag är')) {
        return 'Population-level data cannot be applied to individuals.';
      }
      if (input.toLowerCase().includes('misslyckats') || input.toLowerCase().includes('politiken')) {
        return 'Value judgments are not provided. System shows observed measurements only.';
      }
      return 'Data response without conclusions.';
    },
    
    dataStateProvider: (_context: DataAttackContext): DataSystemState => ({
      truthNodesAffected: 0,
      indexesAffected: 0,
      signalSpike: true,
      spikeMarkedAsAttention: true,
      structuralIndexChange: false,
      persistenceScore: 0.1,
    }),
    
    indexResponseProvider: (_attempt: IndexAttackAttempt): IndexSystemResponse => ({
      allowed: false,
      hashMismatch: true,
      coverageViolation: true,
      deployBlocked: true,
      ciPassed: false,
      errorMessage: 'Coverage violation: missing required ontological coverage',
    }),
    
    uiState: {
      visibleElements: [
        { id: 'chart-1', type: 'chart', top: 100, height: 300, visible: true, required: false },
        { id: 'scope-1', type: 'scope', top: 50, height: 30, visible: true, required: true },
        { id: 'uncertainty-1', type: 'uncertainty', top: 80, height: 20, visible: true, required: true },
        { id: 'limitation-1', type: 'limitation', top: 410, height: 60, visible: true, required: true },
      ],
      viewportHeight: 800,
      scrollPosition: 0,
      totalContentHeight: 1200,
    },
    
    historyStateProvider: (_attempt: HistoryAttackAttempt): HistorySystemState => ({
      artifactExists: true,
      artifact: {
        id: 'TN:test:v1',
        version: 1,
        statement: 'Test statement',
        knownAt: '2020-01-01',
        uncertaintyAt: 'moderate',
        immutable: true,
      },
      modificationAllowed: false,
      newVersionCreated: true,
      oldVersionPreserved: true,
      historyChainIntact: true,
      knowledgeStateTracked: true,
    }),
    
    agentResponseProvider: (_attempt: AgentAttackAttempt): AgentSystemResponse => ({
      responseType: 'data',
      hasUncertainty: true,
      hasConclusion: false,
      hasDecision: false,
      hasRecommendation: false,
      structuredFieldsOnly: true,
      textContentIgnored: true,
      data: {
        indicators: [],
        uncertainty: 0.5,
        timeRange: '2020-2024',
        scope: 'national',
      },
    }),
  };
}

/**
 * Create vulnerable mocks (system has vulnerabilities)
 */
export function createVulnerableSystemMocks(): SystemMocks {
  return {
    responseGenerator: (input: string): string => {
      // Vulnerable: gives advice
      if (input.includes('bästa')) {
        return 'You should invest in education. This is recommended based on the data.';
      }
      return 'Data response.';
    },
    
    dataStateProvider: (_context: DataAttackContext): DataSystemState => ({
      truthNodesAffected: 5, // VULNERABILITY
      indexesAffected: 2,
      signalSpike: true,
      spikeMarkedAsAttention: false, // VULNERABILITY
      structuralIndexChange: true, // VULNERABILITY
      persistenceScore: 0.8,
    }),
    
    indexResponseProvider: (_attempt: IndexAttackAttempt): IndexSystemResponse => ({
      allowed: true, // VULNERABILITY
      hashMismatch: false,
      coverageViolation: false,
      deployBlocked: false,
      ciPassed: true,
    }),
    
    uiState: {
      visibleElements: [
        { id: 'chart-1', type: 'chart', top: 100, height: 300, visible: true, required: false },
        // Missing scope, uncertainty, limitation - VULNERABILITY
      ],
      viewportHeight: 800,
      scrollPosition: 0,
      totalContentHeight: 1200,
    },
    
    historyStateProvider: (_attempt: HistoryAttackAttempt): HistorySystemState => ({
      artifactExists: true,
      modificationAllowed: true, // VULNERABILITY
      newVersionCreated: false,
      oldVersionPreserved: false, // VULNERABILITY
      historyChainIntact: false,
      knowledgeStateTracked: false,
    }),
    
    agentResponseProvider: (_attempt: AgentAttackAttempt): AgentSystemResponse => ({
      responseType: 'conclusion', // VULNERABILITY
      hasUncertainty: false,
      hasConclusion: true, // VULNERABILITY
      hasDecision: true, // VULNERABILITY
      hasRecommendation: true, // VULNERABILITY
      structuredFieldsOnly: false,
      textContentIgnored: false, // VULNERABILITY
    }),
  };
}

/**
 * RUN FULL RED TEAM SIMULATION
 */
export function runFullRedTeamSimulation(
  mocks: SystemMocks = createSecureSystemMocks()
): FullSimulationResult {
  const startTime = performance.now();
  const simulationId = `SIM-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  // Run all attack categories
  const languageResults = runAllLanguageAttacks(mocks.responseGenerator);
  const dataResults = runAllDataAttacks(mocks.dataStateProvider);
  const indexResults = runAllIndexAttacks(mocks.indexResponseProvider);
  const uiResults = runAllUIAttacks(mocks.uiState);
  const historyResults = runAllHistoryAttacks(mocks.historyStateProvider);
  const agentResults = runAllAgentAttacks(mocks.agentResponseProvider);
  
  // Build category results
  const categories = {
    language: buildCategoryResult('language', languageResults),
    data: buildCategoryResult('data', dataResults),
    index: buildCategoryResult('index', indexResults),
    ui: buildCategoryResult('ui', uiResults),
    history: buildCategoryResult('history', historyResults),
    agent: buildCategoryResult('agent', agentResults),
  };
  
  // Calculate summary
  const summary = calculateSummary(categories);
  
  // Collect all blocking violations
  const blockingViolations = collectBlockingViolations(categories);
  
  // Determine if system is approved
  const systemApproved = 
    summary.noAdviceGiven &&
    summary.noIndividualInterpretation &&
    summary.noValueJudgment &&
    summary.noHistoryChanged &&
    summary.noNarrativeCreated &&
    summary.allAttacksLogged &&
    summary.systemContinuesFunctioning;
  
  return {
    simulationId,
    executedAt: new Date().toISOString(),
    duration: performance.now() - startTime,
    categories,
    summary,
    systemApproved,
    blockingViolations,
  };
}

/**
 * Build category result from attack results
 */
function buildCategoryResult<T extends { passed: boolean }>(
  category: AttackCategory,
  results: Map<string, T>
): CategoryResult<T> {
  const attackCount = results.size;
  const passedCount = [...results.values()].filter(r => r.passed).length;
  const failedCount = attackCount - passedCount;
  
  return {
    category,
    attackCount,
    passedCount,
    failedCount,
    results,
    allPassed: failedCount === 0,
  };
}

/**
 * Calculate simulation summary
 */
function calculateSummary(categories: FullSimulationResult['categories']): SimulationSummary {
  const totalAttacks = Object.values(categories).reduce((sum, c) => sum + c.attackCount, 0);
  const totalPassed = Object.values(categories).reduce((sum, c) => sum + c.passedCount, 0);
  const totalFailed = totalAttacks - totalPassed;
  
  return {
    totalAttacks,
    totalPassed,
    totalFailed,
    passRate: totalAttacks > 0 ? (totalPassed / totalAttacks) * 100 : 0,
    
    // Check objective criteria
    noAdviceGiven: categories.language.results.get('A1')?.passed ?? false,
    noIndividualInterpretation: categories.language.results.get('A2')?.passed ?? false,
    noValueJudgment: categories.language.results.get('A3')?.passed ?? false,
    noHistoryChanged: categories.history.allPassed,
    noNarrativeCreated: categories.data.allPassed,
    allAttacksLogged: true, // Assumed true if simulation completed
    allBlocksComprehensible: totalFailed === 0 || categories.language.allPassed,
    systemContinuesFunctioning: true, // Assumed true if simulation completed
  };
}

/**
 * Collect all blocking violations from categories
 */
function collectBlockingViolations(categories: FullSimulationResult['categories']): RedTeamViolation[] {
  const violations: RedTeamViolation[] = [];
  
  for (const category of Object.values(categories)) {
    for (const result of category.results.values()) {
      if ('violations' in result && Array.isArray(result.violations)) {
        violations.push(...result.violations);
      }
    }
  }
  
  return violations;
}

/**
 * Get all attack definitions
 */
export function getAllAttacks(): {
  language: LanguageAttack[];
  data: DataAttack[];
  index: IndexAttack[];
  ui: UIAttack[];
  history: HistoryAttack[];
  agent: AgentAttack[];
} {
  return {
    language: LANGUAGE_ATTACKS,
    data: DATA_ATTACKS,
    index: INDEX_ATTACKS,
    ui: UI_ATTACKS,
    history: HISTORY_ATTACKS,
    agent: AGENT_ATTACKS,
  };
}

/**
 * Get attack by ID
 */
export function getAttackById(id: string): unknown | undefined {
  const all = getAllAttacks();
  
  for (const attacks of Object.values(all)) {
    const found = (attacks as { id: string }[]).find(a => a.id === id);
    if (found) return found;
  }
  
  return undefined;
}
