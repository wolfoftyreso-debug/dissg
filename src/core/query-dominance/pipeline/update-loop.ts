/**
 * PIPELINE STAGE 8: UPDATE LOOP (SELF-CORRECTING)
 * 
 * When new data arrives, only affected blocks update.
 * Version bumps. History preserved.
 * Nothing rewritten backwards.
 */

import type {
  UpdateEvent,
  UpdateTrigger,
} from './types';
import type { ConditionalDecisionPage, CDPBlock } from '../types';

/**
 * Update history registry
 */
const updateHistory: Map<string, UpdateEvent[]> = new Map();

/**
 * Check if CDP needs update
 */
export function checkForUpdates(
  cdp: ConditionalDecisionPage,
  newDataTimestamp: string,
  affectedDataTypes: string[]
): {
  needsUpdate: boolean;
  affectedBlocks: number[];
  trigger: UpdateTrigger;
} {
  const cdpTime = new Date(cdp.generated_at).getTime();
  const newDataTime = new Date(newDataTimestamp).getTime();
  
  // No update needed if CDP is newer
  if (cdpTime >= newDataTime) {
    return {
      needsUpdate: false,
      affectedBlocks: [],
      trigger: 'new_data',
    };
  }
  
  // Map data types to affected blocks
  const affectedBlocks = mapDataTypesToBlocks(affectedDataTypes);
  
  // Determine trigger type
  const trigger = determineTrigger(affectedDataTypes);
  
  return {
    needsUpdate: affectedBlocks.length > 0,
    affectedBlocks,
    trigger,
  };
}

/**
 * Map data types to block IDs
 */
function mapDataTypesToBlocks(dataTypes: string[]): number[] {
  const typeToBlocks: Record<string, number[]> = {
    'price': [6, 7, 8, 9, 13, 14, 15],
    'cost': [6, 7, 8, 9, 10, 11, 12],
    'reliability': [16, 17, 18, 19, 20, 24, 25],
    'performance': [16, 17, 18, 21, 22, 23],
    'risk': [26, 27, 28, 29, 30, 31, 32, 33, 34, 35],
    'comparison': [13, 18, 35, 36, 37, 38, 43],
    'scope': [1, 2, 3, 4, 5],
    'uncertainty': [46, 47, 48, 49, 50],
  };
  
  const blocks = new Set<number>();
  
  for (const dataType of dataTypes) {
    const mappedBlocks = typeToBlocks[dataType] || [];
    mappedBlocks.forEach(b => blocks.add(b));
  }
  
  return Array.from(blocks).sort((a, b) => a - b);
}

/**
 * Determine update trigger from data types
 */
function determineTrigger(dataTypes: string[]): UpdateTrigger {
  if (dataTypes.includes('price') || dataTypes.includes('cost')) {
    return 'price_change';
  }
  if (dataTypes.includes('reliability')) {
    return 'reliability_update';
  }
  return 'new_data';
}

/**
 * Apply update to CDP (only affected blocks)
 */
export function applyUpdate(
  cdp: ConditionalDecisionPage,
  affectedBlocks: number[],
  newBlockData: Map<number, CDPBlock['content']>,
  trigger: UpdateTrigger,
  previousVersion: number
): {
  updatedCDP: ConditionalDecisionPage;
  event: UpdateEvent;
} {
  const newVersion = previousVersion + 1;
  const updatedAt = new Date().toISOString();
  
  // Update only affected blocks
  const updatedBlocks = cdp.blocks.map(block => {
    if (!affectedBlocks.includes(block.block_id)) {
      return block; // Unchanged
    }
    
    const newContent = newBlockData.get(block.block_id);
    if (!newContent) {
      return block; // No new data for this block
    }
    
    return {
      ...block,
      has_content: true,
      content: newContent,
      empty_state: undefined,
    };
  });
  
  // Create updated CDP (new object, preserves immutability)
  const updatedCDP: ConditionalDecisionPage = {
    ...cdp,
    blocks: updatedBlocks,
    generated_at: updatedAt,
  };
  
  // Create update event
  const event: UpdateEvent = {
    event_id: `update_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    cdp_id: cdp.cdp_id,
    trigger,
    affected_blocks: affectedBlocks,
    previous_version: previousVersion,
    new_version: newVersion,
    updated_at: updatedAt,
  };
  
  // Store in history
  const history = updateHistory.get(cdp.cdp_id) || [];
  history.push(event);
  updateHistory.set(cdp.cdp_id, history);
  
  return { updatedCDP, event };
}

/**
 * Get update history for CDP
 */
export function getUpdateHistory(cdpId: string): UpdateEvent[] {
  return updateHistory.get(cdpId) || [];
}

/**
 * Schedule periodic refresh
 */
export function scheduleRefresh(
  cdpId: string,
  intervalDays: number
): {
  next_refresh: string;
  interval_days: number;
} {
  const nextRefresh = new Date();
  nextRefresh.setDate(nextRefresh.getDate() + intervalDays);
  
  return {
    next_refresh: nextRefresh.toISOString(),
    interval_days: intervalDays,
  };
}

/**
 * Check if scheduled refresh is due
 */
export function isRefreshDue(scheduledRefresh: string): boolean {
  return new Date(scheduledRefresh).getTime() <= Date.now();
}

/**
 * Calculate refresh interval based on CDP characteristics
 */
export function calculateRefreshInterval(
  cdp: ConditionalDecisionPage,
  entityType: string
): number {
  // Base interval by entity type
  const baseIntervals: Record<string, number> = {
    vehicle_model: 30,      // Monthly
    consumer_product: 14,   // Bi-weekly
    financial_instrument: 1, // Daily
    policy: 90,             // Quarterly
    medical_condition: 180, // Semi-annually
    unknown: 30,            // Monthly default
  };
  
  const baseInterval = baseIntervals[entityType] || 30;
  
  // Adjust based on time horizon
  const horizonMultipliers: Record<string, number> = {
    immediate: 0.5,
    short_term: 0.75,
    multi_year: 1.0,
    lifetime: 1.5,
  };
  
  const multiplier = horizonMultipliers[cdp.decision_blueprint.time_horizon] || 1.0;
  
  return Math.round(baseInterval * multiplier);
}

/**
 * UPDATE LOOP MASTERPROMPT
 */
export const UPDATE_LOOP_MASTERPROMPT = `
You manage the UPDATE LOOP (SELF-CORRECTING).

TRIGGERS:
- New data arrives
- Prices change
- Reliability updates
- Source revisions
- Entity updates
- Scheduled refresh

RULES:
1. Only affected blocks update
2. Version number bumps
3. History preserved
4. Nothing rewritten backwards

PROCESS:
1. Check if update needed
   - Compare timestamps
   - Map data types to blocks
2. Identify affected blocks
   - price → blocks 6-15
   - reliability → blocks 16-25
   - risk → blocks 26-35
   - etc.
3. Apply update
   - Create new CDP version
   - Record update event
   - Preserve previous version
4. Store history
   - All updates traceable
   - Full audit trail

REFRESH INTERVALS:
- Financial: Daily
- Consumer products: Bi-weekly
- Vehicles: Monthly
- Policy: Quarterly
- Medical: Semi-annually

IMMUTABILITY:
- Old versions never deleted
- Updates are additive
- History is append-only
- Full traceability maintained
`;
