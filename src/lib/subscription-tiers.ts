/**
 * SUBSCRIPTION TIERS
 * ═══════════════════════════════════════════════════════════════
 * 
 * Enterprise subscription system for DISSG.
 * Users purchase subscriptions in "My Account" settings.
 * 
 * Tiers follow memory/business/monetization-licensing-tiers:
 * - Guest: Not logged in
 * - Observer: Free - democratic base with full transparency
 * - Analyst: €99–€299/mån - for professionals
 * - Institutional: €2,000–€20,000/mån - for banks/authorities
 */

export type SubscriptionTier = 
  | 'guest'        // Not logged in
  | 'observer'     // Free tier
  | 'analyst'      // Professional tier
  | 'institutional'; // Enterprise tier

export interface SubscriptionPlan {
  id: SubscriptionTier;
  name: string;
  name_local: string;
  description: string;
  price: {
    monthly: number | null;
    yearly: number | null;
    currency: string;
  };
  features: string[];
  limits: {
    exports_per_month: number | null;
    api_calls_per_day: number | null;
    team_members: number | null;
    scenario_simulations: number | null;
  };
  badge_color: string;
}

export const SUBSCRIPTION_PLANS: Record<SubscriptionTier, SubscriptionPlan> = {
  guest: {
    id: 'guest',
    name: 'Guest',
    name_local: 'Gäst',
    description: 'Begränsad åtkomst utan inloggning',
    price: { monthly: null, yearly: null, currency: 'EUR' },
    features: [
      'Publika dashboards',
      'Nationell översikt',
    ],
    limits: {
      exports_per_month: 0,
      api_calls_per_day: 0,
      team_members: 0,
      scenario_simulations: 0,
    },
    badge_color: 'bg-muted text-muted-foreground',
  },
  observer: {
    id: 'observer',
    name: 'Observer',
    name_local: 'Observatör',
    description: 'Demokratisk bas med full transparens',
    price: { monthly: 0, yearly: 0, currency: 'EUR' },
    features: [
      'Alla publika KPI:er',
      'Historiska trender',
      'Källhänvisningar',
      'Grundläggande jämförelser',
    ],
    limits: {
      exports_per_month: 0,
      api_calls_per_day: 0,
      team_members: 1,
      scenario_simulations: 0,
    },
    badge_color: 'bg-secondary text-secondary-foreground',
  },
  analyst: {
    id: 'analyst',
    name: 'Analyst',
    name_local: 'Analytiker',
    description: 'För professionella användare och forskare',
    price: { monthly: 99, yearly: 990, currency: 'EUR' },
    features: [
      'Allt i Observer',
      'Export (CSV, Excel, JSON)',
      'Scenario Lab (simuleringar)',
      'Avancerade jämförelser',
      'Korrelationsanalys',
      'Prioritet support',
    ],
    limits: {
      exports_per_month: 100,
      api_calls_per_day: 1000,
      team_members: 1,
      scenario_simulations: 50,
    },
    badge_color: 'bg-blue-500/20 text-blue-700 dark:text-blue-300',
  },
  institutional: {
    id: 'institutional',
    name: 'Institutional',
    name_local: 'Institution',
    description: 'För myndigheter, banker och organisationer',
    price: { monthly: 2000, yearly: 20000, currency: 'EUR' },
    features: [
      'Allt i Analyst',
      'Full API-access',
      'Teamkonton',
      'White-label embedding',
      'Dedikerad support',
      'Custom integrations',
      'SLA-garanti',
    ],
    limits: {
      exports_per_month: null, // Unlimited
      api_calls_per_day: null, // Unlimited
      team_members: null, // Unlimited
      scenario_simulations: null, // Unlimited
    },
    badge_color: 'bg-amber-500/20 text-amber-700 dark:text-amber-300',
  },
};

// Get tier hierarchy level (higher = more access)
export function getTierLevel(tier: SubscriptionTier): number {
  const levels: Record<SubscriptionTier, number> = {
    guest: 0,
    observer: 1,
    analyst: 2,
    institutional: 3,
  };
  return levels[tier];
}

// Check if tier has access to a feature
export function hasFeatureAccess(userTier: SubscriptionTier, requiredTier: SubscriptionTier): boolean {
  return getTierLevel(userTier) >= getTierLevel(requiredTier);
}

// Format price for display
export function formatPrice(plan: SubscriptionPlan, billing: 'monthly' | 'yearly' = 'monthly'): string {
  const price = billing === 'monthly' ? plan.price.monthly : plan.price.yearly;
  
  if (price === null) return 'Kontakta oss';
  if (price === 0) return 'Gratis';
  
  return `€${price.toLocaleString('sv-SE')}/${billing === 'monthly' ? 'mån' : 'år'}`;
}
