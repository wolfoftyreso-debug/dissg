/**
 * PIPELINE STAGE 1: INTAKE
 * 
 * Input sources: aggregated, legal, stable.
 * We don't collect opinions. We collect intentions.
 */

import type { RawSearchIntent, IntentSource } from './types';

/**
 * Intent intake registry
 */
const intentRegistry: Map<string, RawSearchIntent> = new Map();

/**
 * Register a raw search intent
 */
export function registerIntent(intent: RawSearchIntent): void {
  // Deduplicate by intent_id
  if (!intentRegistry.has(intent.intent_id)) {
    intentRegistry.set(intent.intent_id, intent);
  } else {
    // Merge surface forms
    const existing = intentRegistry.get(intent.intent_id)!;
    const mergedForms = [...new Set([...existing.surface_forms, ...intent.surface_forms])];
    intentRegistry.set(intent.intent_id, {
      ...existing,
      surface_forms: mergedForms,
      volume_rank: Math.min(existing.volume_rank, intent.volume_rank),
    });
  }
}

/**
 * Create intent from aggregated search data
 */
export function createFromAggregatedSearch(
  intentId: string,
  surfaceForms: string[],
  volumeRank: number,
  geo: string = 'global',
  language: string = 'en'
): RawSearchIntent {
  return {
    intent_id: intentId,
    surface_forms: surfaceForms,
    volume_rank: volumeRank,
    geo,
    language,
    source: 'aggregated_search',
    collected_at: new Date().toISOString(),
  };
}

/**
 * Create intent from "People Also Ask" cluster
 */
export function createFromPeopleAlsoAsk(
  intentId: string,
  questions: string[],
  volumeRank: number,
  geo: string = 'global',
  language: string = 'en'
): RawSearchIntent {
  return {
    intent_id: intentId,
    surface_forms: questions,
    volume_rank: volumeRank,
    geo,
    language,
    source: 'people_also_ask',
    collected_at: new Date().toISOString(),
  };
}

/**
 * Create intent from related queries
 */
export function createFromRelatedQueries(
  intentId: string,
  queries: string[],
  volumeRank: number,
  geo: string = 'global',
  language: string = 'en'
): RawSearchIntent {
  return {
    intent_id: intentId,
    surface_forms: queries,
    volume_rank: volumeRank,
    geo,
    language,
    source: 'related_queries',
    collected_at: new Date().toISOString(),
  };
}

/**
 * Create intent from AI agent requests (anonymized)
 */
export function createFromAIAgentRequest(
  intentId: string,
  normalizedQuery: string,
  volumeRank: number
): RawSearchIntent {
  return {
    intent_id: intentId,
    surface_forms: [normalizedQuery],
    volume_rank: volumeRank,
    geo: 'global',
    language: 'en',
    source: 'ai_agent_requests',
    collected_at: new Date().toISOString(),
  };
}

/**
 * Create intent from internal gap analysis
 */
export function createFromInternalGap(
  intentId: string,
  gapDescription: string,
  priority: number
): RawSearchIntent {
  return {
    intent_id: intentId,
    surface_forms: [gapDescription],
    volume_rank: priority,
    geo: 'global',
    language: 'en',
    source: 'internal_gaps',
    collected_at: new Date().toISOString(),
  };
}

/**
 * Get all registered intents
 */
export function getAllIntents(): RawSearchIntent[] {
  return Array.from(intentRegistry.values());
}

/**
 * Get intents by source
 */
export function getIntentsBySource(source: IntentSource): RawSearchIntent[] {
  return getAllIntents().filter(i => i.source === source);
}

/**
 * Get intents by geo
 */
export function getIntentsByGeo(geo: string): RawSearchIntent[] {
  return getAllIntents().filter(i => i.geo === geo || i.geo === 'global');
}

/**
 * Get top N intents by volume
 */
export function getTopIntents(n: number): RawSearchIntent[] {
  return getAllIntents()
    .sort((a, b) => a.volume_rank - b.volume_rank)
    .slice(0, n);
}

/**
 * Clear registry (for testing)
 */
export function clearRegistry(): void {
  intentRegistry.clear();
}

/**
 * INTAKE MASTERPROMPT
 */
export const INTAKE_MASTERPROMPT = `
You handle INTAKE for the Search → Decision Pipeline.

PRINCIPLE:
We don't collect opinions.
We collect intentions.

INPUT SOURCES:
1. Aggregated search intents (Top-N per country/language)
2. "People Also Ask" clusters
3. Related queries (query graphs)
4. AI agent requests (anonymized)
5. Internal "next valid questions" gaps

STORAGE FORMAT:
{
  "intent_id": "consumer_product_eval",
  "surface_forms": ["is X good", "should I buy X", "X pros and cons"],
  "volume_rank": 132,
  "geo": "global",
  "language": "en"
}

RULES:
- Store raw intention, not text
- Same intention → same intent_id
- Different languages → same structure
- No language dependency in core
- Deduplicate by intent_id
- Merge surface forms on collision
- Keep lowest volume_rank (highest priority)

OUTPUT:
Raw intents ready for normalization.
`;
