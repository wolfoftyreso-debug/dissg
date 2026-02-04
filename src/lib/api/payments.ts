/**
 * Payments API Abstraction
 * 
 * Unified interface for payment processing (Stripe-ready but abstracted).
 * All payment operations go through edge functions for security.
 */

import { supabase } from '@/integrations/supabase/client';
import { 
  type LicenseTier, 
  type BillingInterval, 
  getTierPricing,
} from '@/config/licensing';
import { getRegionConfig } from '@/config/regions';

export interface PaymentSession {
  id: string;
  url: string;
  expiresAt: Date;
}

export interface SubscriptionInfo {
  tier: LicenseTier;
  status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'incomplete';
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  billingInterval: BillingInterval;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank' | 'other';
  last4: string;
  brand: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
}

/**
 * Check if payment processing is configured
 */
export function isPaymentConfigured(): boolean {
  // Will be true when Stripe is properly configured
  return false; // Placeholder until Stripe activation
}

/**
 * Get available payment currencies for current region
 */
export function getAvailableCurrencies(): string[] {
  const region = getRegionConfig();
  return region.supportedCurrencies;
}

/**
 * Get default currency for current region
 */
export function getDefaultCurrency(): string {
  const region = getRegionConfig();
  return region.defaultCurrency;
}

/**
 * Create a checkout session for subscription upgrade
 */
export async function createCheckoutSession(
  tier: LicenseTier,
  interval: BillingInterval,
  currency: string = getDefaultCurrency()
): Promise<PaymentSession | null> {
  if (!isPaymentConfigured()) {
    console.warn('Payment processing not configured');
    return null;
  }

  try {
    const { data, error } = await supabase.functions.invoke('create-checkout', {
      body: {
        tier,
        interval,
        currency,
        successUrl: `${window.location.origin}/account?success=true`,
        cancelUrl: `${window.location.origin}/pricing?canceled=true`,
      },
    });

    if (error) throw error;

    return {
      id: data.sessionId,
      url: data.url,
      expiresAt: new Date(data.expiresAt),
    };
  } catch (error) {
    console.error('Failed to create checkout session:', error);
    return null;
  }
}

/**
 * Create a customer portal session for subscription management
 */
export async function createPortalSession(): Promise<string | null> {
  if (!isPaymentConfigured()) {
    console.warn('Payment processing not configured');
    return null;
  }

  try {
    const { data, error } = await supabase.functions.invoke('customer-portal', {
      body: {
        returnUrl: `${window.location.origin}/account`,
      },
    });

    if (error) throw error;

    return data.url;
  } catch (error) {
    console.error('Failed to create portal session:', error);
    return null;
  }
}

/**
 * Get current subscription info for user
 */
export async function getSubscriptionInfo(): Promise<SubscriptionInfo | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error || !data) return null;

    return {
      tier: data.tier as LicenseTier,
      status: data.status as SubscriptionInfo['status'],
      currentPeriodEnd: new Date(data.current_period_end || Date.now()),
      cancelAtPeriodEnd: data.cancel_at !== null,
      billingInterval: 'monthly' as BillingInterval, // Default, can be extended later
    };
  } catch (error) {
    console.error('Failed to get subscription info:', error);
    return null;
  }
}

/**
 * Format price for display
 */
export function formatPrice(amount: number, currency: string): string {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Get pricing display for a tier
 */
export function getTierPricingDisplay(
  tier: LicenseTier,
  currency: string = getDefaultCurrency()
): { monthly: string; yearly: string; savings: number } {
  const pricing = getTierPricing(tier, currency);
  const monthlyCost = pricing.monthly;
  const yearlyCost = pricing.yearly;
  const monthlyEquivalent = yearlyCost / 12;
  const savings = monthlyCost > 0 ? Math.round((1 - monthlyEquivalent / monthlyCost) * 100) : 0;

  return {
    monthly: formatPrice(monthlyCost, currency),
    yearly: formatPrice(yearlyCost, currency),
    savings,
  };
}

export default {
  isPaymentConfigured,
  getAvailableCurrencies,
  getDefaultCurrency,
  createCheckoutSession,
  createPortalSession,
  getSubscriptionInfo,
  formatPrice,
  getTierPricingDisplay,
};
