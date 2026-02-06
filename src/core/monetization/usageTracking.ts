/**
 * USAGE TRACKING
 * 
 * Tracks API usage for rate limiting and billing.
 * "Per resolve, per dataset, per risk class."
 */

import { MonetizationTier } from '@/config/monetizationArchitecture';
import { checkRateLimit, getBatchLimit } from './tierAccess';

// ============================================
// USAGE TYPES
// ============================================

export interface UsageRecord {
  tier: MonetizationTier;
  user_id: string;
  agent_id?: string;
  
  // Counters
  resolves_today: number;
  resolves_this_minute: number;
  resolves_this_month: number;
  
  // Billable
  billable_resolves: number;
  dataset_exports: number;
  batch_requests: number;
  
  // Timestamps
  last_request_at: string;
  minute_window_start: string;
  day_window_start: string;
  month_window_start: string;
}

export interface UsageCheck {
  allowed: boolean;
  reason?: string;
  upsell?: string;
  remaining: {
    per_minute: number;
    per_day: number;
  };
}

// ============================================
// USAGE MANAGER
// ============================================

export class UsageManager {
  private usage: Map<string, UsageRecord> = new Map();
  
  /**
   * Get or create usage record
   */
  getUsage(userId: string, tier: MonetizationTier): UsageRecord {
    const key = `${userId}:${tier}`;
    let record = this.usage.get(key);
    
    if (!record) {
      record = this.createRecord(userId, tier);
      this.usage.set(key, record);
    }
    
    // Reset windows if needed
    this.resetWindowsIfNeeded(record);
    
    return record;
  }
  
  /**
   * Check if request is allowed
   */
  checkRequest(userId: string, tier: MonetizationTier): UsageCheck {
    const record = this.getUsage(userId, tier);
    
    const rateCheck = checkRateLimit(
      tier,
      record.resolves_this_minute,
      record.resolves_today
    );
    
    if (!rateCheck.allowed) {
      return {
        allowed: false,
        reason: rateCheck.reason,
        upsell: rateCheck.upsell,
        remaining: {
          per_minute: 0,
          per_day: 0,
        },
      };
    }
    
    const limits = this.getLimits(tier);
    
    return {
      allowed: true,
      remaining: {
        per_minute: limits.per_minute - record.resolves_this_minute,
        per_day: limits.per_day > 0 ? limits.per_day - record.resolves_today : -1,
      },
    };
  }
  
  /**
   * Record a request
   */
  recordRequest(userId: string, tier: MonetizationTier, type: 'resolve' | 'batch' | 'export'): void {
    const record = this.getUsage(userId, tier);
    
    record.resolves_this_minute++;
    record.resolves_today++;
    record.resolves_this_month++;
    record.last_request_at = new Date().toISOString();
    
    // Track billable usage
    if (tier !== 'public') {
      record.billable_resolves++;
    }
    
    if (type === 'batch') {
      record.batch_requests++;
    }
    
    if (type === 'export') {
      record.dataset_exports++;
    }
  }
  
  /**
   * Check batch request
   */
  checkBatchRequest(
    userId: string, 
    tier: MonetizationTier, 
    batchSize: number
  ): UsageCheck {
    const limit = getBatchLimit(tier);
    
    if (batchSize > limit) {
      return {
        allowed: false,
        reason: `Batch size ${batchSize} exceeds limit of ${limit}`,
        upsell: `Need larger batches? Upgrade to process up to ${getBatchLimit(this.getNextTier(tier) ?? 'enterprise')} items at once.`,
        remaining: { per_minute: 0, per_day: 0 },
      };
    }
    
    // Still check rate limits for batch
    return this.checkRequest(userId, tier);
  }
  
  /**
   * Get billing summary
   */
  getBillingSummary(userId: string, tier: MonetizationTier): {
    resolves: number;
    dataset_exports: number;
    batch_requests: number;
    estimated_cost_eur: number;
  } {
    const record = this.getUsage(userId, tier);
    
    // Calculate estimated cost based on tier
    let estimatedCost = 0;
    if (tier === 'agent') {
      // €0.002 per resolve (€2000 per 1M)
      estimatedCost = record.billable_resolves * 0.002;
    }
    
    return {
      resolves: record.billable_resolves,
      dataset_exports: record.dataset_exports,
      batch_requests: record.batch_requests,
      estimated_cost_eur: Math.round(estimatedCost * 100) / 100,
    };
  }
  
  // ============================================
  // PRIVATE HELPERS
  // ============================================
  
  private createRecord(userId: string, tier: MonetizationTier): UsageRecord {
    const now = new Date().toISOString();
    return {
      tier,
      user_id: userId,
      resolves_today: 0,
      resolves_this_minute: 0,
      resolves_this_month: 0,
      billable_resolves: 0,
      dataset_exports: 0,
      batch_requests: 0,
      last_request_at: now,
      minute_window_start: now,
      day_window_start: now,
      month_window_start: now,
    };
  }
  
  private resetWindowsIfNeeded(record: UsageRecord): void {
    const now = new Date();
    
    // Reset minute window
    const minuteStart = new Date(record.minute_window_start);
    if (now.getTime() - minuteStart.getTime() > 60000) {
      record.resolves_this_minute = 0;
      record.minute_window_start = now.toISOString();
    }
    
    // Reset day window
    const dayStart = new Date(record.day_window_start);
    if (now.toDateString() !== dayStart.toDateString()) {
      record.resolves_today = 0;
      record.day_window_start = now.toISOString();
    }
    
    // Reset month window
    const monthStart = new Date(record.month_window_start);
    if (now.getMonth() !== monthStart.getMonth() || now.getFullYear() !== monthStart.getFullYear()) {
      record.resolves_this_month = 0;
      record.billable_resolves = 0;
      record.dataset_exports = 0;
      record.batch_requests = 0;
      record.month_window_start = now.toISOString();
    }
  }
  
  private getLimits(tier: MonetizationTier): { per_minute: number; per_day: number } {
    const limits: Record<MonetizationTier, { per_minute: number; per_day: number }> = {
      public: { per_minute: 5, per_day: 100 },
      pro: { per_minute: 30, per_day: 1000 },
      agent: { per_minute: 500, per_day: 50000 },
      enterprise: { per_minute: 2000, per_day: -1 },
    };
    return limits[tier];
  }
  
  private getNextTier(tier: MonetizationTier): MonetizationTier | null {
    const order: MonetizationTier[] = ['public', 'pro', 'agent', 'enterprise'];
    const index = order.indexOf(tier);
    return index < order.length - 1 ? order[index + 1] : null;
  }
}

// ============================================
// SINGLETON INSTANCE
// ============================================

export const usageManager = new UsageManager();

// ============================================
// BILLING CALCULATOR
// ============================================

export interface BillingEstimate {
  tier: MonetizationTier;
  period: 'monthly';
  
  // Usage
  estimated_resolves: number;
  estimated_exports: number;
  
  // Costs
  base_cost_eur: number;
  overage_cost_eur: number;
  total_cost_eur: number;
  
  // Comparison
  cost_per_resolve: number;
  savings_vs_lower_tier?: number;
}

export function calculateBilling(
  tier: MonetizationTier,
  estimatedResolves: number,
  estimatedExports: number = 0
): BillingEstimate {
  const baseCosts: Record<MonetizationTier, number> = {
    public: 0,
    pro: 99,
    agent: 2000,
    enterprise: 250000 / 12, // Monthly portion of annual
  };
  
  const baseCost = baseCosts[tier];
  let overageCost = 0;
  
  // Agent tier has overage
  if (tier === 'agent') {
    const includedResolves = 1000000;
    if (estimatedResolves > includedResolves) {
      overageCost = (estimatedResolves - includedResolves) * 0.0001; // €0.1 per 1000 over
    }
  }
  
  const totalCost = baseCost + overageCost;
  const costPerResolve = estimatedResolves > 0 ? totalCost / estimatedResolves : 0;
  
  return {
    tier,
    period: 'monthly',
    estimated_resolves: estimatedResolves,
    estimated_exports: estimatedExports,
    base_cost_eur: baseCost,
    overage_cost_eur: overageCost,
    total_cost_eur: Math.round(totalCost * 100) / 100,
    cost_per_resolve: Math.round(costPerResolve * 10000) / 10000,
  };
}
