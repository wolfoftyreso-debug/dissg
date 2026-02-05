/**
 * BUSINESS MODEL (CLEAN, UNCORRUPTIBLE)
 * 
 * Free: public CDP, read-only reference cases, query compiler (limited)
 * Paid: private decision instances, enterprise SLA, internal mirrors, audit tooling
 * Forbidden: affiliate, ads, ranking, recommendation
 */

import type { BusinessModelItem, TierType } from './types';

// ============================================================================
// FREE TIER
// ============================================================================

export const FREE_FEATURES: readonly BusinessModelItem[] = [
  {
    feature: 'Public CDP Pages',
    tier: 'free',
    description: 'All conditional decision pages are publicly accessible',
  },
  {
    feature: 'Read-Only Reference Cases',
    tier: 'free',
    description: 'Historical decision reference cases viewable by anyone',
  },
  {
    feature: 'Query Compiler (Limited)',
    tier: 'free',
    description: 'Limited queries per day for structure translation',
  },
  {
    feature: 'Uncertainty Documentation',
    tier: 'free',
    description: 'Full transparency on what is not known',
  },
  {
    feature: 'AI Agent Read Access',
    tier: 'free',
    description: 'Machine-readable endpoints for AI consumption',
  },
] as const;

// ============================================================================
// PAID TIER
// ============================================================================

export const PAID_FEATURES: readonly BusinessModelItem[] = [
  {
    feature: 'Private Decision Instances',
    tier: 'paid',
    description: 'Create and store private decision structures',
  },
  {
    feature: 'Enterprise SLA',
    tier: 'paid',
    description: 'Guaranteed uptime and response times',
  },
  {
    feature: 'Internal Mirrors',
    tier: 'paid',
    description: 'Self-hosted or private cloud deployment',
  },
  {
    feature: 'Audit Tooling',
    tier: 'paid',
    description: 'Full audit trail and compliance reporting',
  },
  {
    feature: 'AI Agent Integration at Scale',
    tier: 'paid',
    description: 'High-volume API access for AI platforms',
  },
  {
    feature: 'Team Collaboration',
    tier: 'paid',
    description: 'Multi-user decision documentation',
  },
  {
    feature: 'Custom Ontology Extensions',
    tier: 'paid',
    description: 'Domain-specific ontology additions',
  },
] as const;

// ============================================================================
// FORBIDDEN (NEVER)
// ============================================================================

export const FORBIDDEN_FEATURES: readonly BusinessModelItem[] = [
  {
    feature: 'Affiliate Links',
    tier: 'forbidden',
    description: 'Never: would corrupt decision neutrality',
  },
  {
    feature: 'Advertising',
    tier: 'forbidden',
    description: 'Never: would create bias incentives',
  },
  {
    feature: 'Rankings',
    tier: 'forbidden',
    description: 'Never: would imply recommendations',
  },
  {
    feature: 'Recommendations',
    tier: 'forbidden',
    description: 'Never: violates core principle',
  },
  {
    feature: 'Sponsored Content',
    tier: 'forbidden',
    description: 'Never: would undermine trust',
  },
  {
    feature: 'Data Selling',
    tier: 'forbidden',
    description: 'Never: user decisions are private',
  },
] as const;

// ============================================================================
// ALL FEATURES
// ============================================================================

export const ALL_BUSINESS_MODEL_ITEMS: readonly BusinessModelItem[] = [
  ...FREE_FEATURES,
  ...PAID_FEATURES,
  ...FORBIDDEN_FEATURES,
] as const;

// ============================================================================
// UTILITIES
// ============================================================================

export function getFeaturesByTier(tier: TierType): readonly BusinessModelItem[] {
  return ALL_BUSINESS_MODEL_ITEMS.filter(f => f.tier === tier);
}

export function isFeatureFree(feature: string): boolean {
  return FREE_FEATURES.some(f => f.feature === feature);
}

export function isFeatureForbidden(feature: string): boolean {
  return FORBIDDEN_FEATURES.some(f => f.feature === feature);
}
