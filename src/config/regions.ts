/**
 * Regional Configuration System
 * 
 * Soft-coded regional settings for multi-region AWS deployment.
 * Each region has its own CDN, languages, currencies, and compliance rules.
 */

import type { SupportedLanguage } from '@/i18n';

export type RegionCode = 'global' | 'eu' | 'us' | 'asia' | 'africa';

export interface RegionConfig {
  code: RegionCode;
  name: string;
  domain: string;
  defaultLanguage: SupportedLanguage;
  supportedLanguages: SupportedLanguage[];
  defaultCurrency: string;
  supportedCurrencies: string[];
  timezone: string;
  awsRegion: string;
  cdnEndpoint: string;
  compliance: {
    gdpr: boolean;
    ccpa: boolean;
    dataResidency: boolean;
  };
  features: {
    municipalData: boolean;
    politicianProfiles: boolean;
    simulation: boolean;
  };
}

export const regions: Record<RegionCode, RegionConfig> = {
  global: {
    code: 'global',
    name: 'Global',
    domain: 'dissg.com',
    defaultLanguage: 'en',
    supportedLanguages: ['en', 'sv', 'de', 'fr', 'es', 'zh', 'ar', 'sw'],
    defaultCurrency: 'USD',
    supportedCurrencies: ['USD', 'EUR', 'SEK', 'GBP'],
    timezone: 'UTC',
    awsRegion: 'us-east-1',
    cdnEndpoint: 'cdn.dissg.com',
    compliance: {
      gdpr: true,
      ccpa: true,
      dataResidency: false,
    },
    features: {
      municipalData: true,
      politicianProfiles: true,
      simulation: true,
    },
  },
  eu: {
    code: 'eu',
    name: 'Europe',
    domain: 'dissg.eu',
    defaultLanguage: 'en',
    supportedLanguages: ['en', 'sv', 'de', 'fr', 'es'],
    defaultCurrency: 'EUR',
    supportedCurrencies: ['EUR', 'SEK', 'GBP', 'CHF', 'NOK', 'DKK'],
    timezone: 'Europe/Stockholm',
    awsRegion: 'eu-north-1',
    cdnEndpoint: 'cdn-eu.dissg.com',
    compliance: {
      gdpr: true,
      ccpa: false,
      dataResidency: true,
    },
    features: {
      municipalData: true,
      politicianProfiles: true,
      simulation: true,
    },
  },
  us: {
    code: 'us',
    name: 'United States',
    domain: 'dissg.us',
    defaultLanguage: 'en',
    supportedLanguages: ['en', 'es'],
    defaultCurrency: 'USD',
    supportedCurrencies: ['USD'],
    timezone: 'America/New_York',
    awsRegion: 'us-east-1',
    cdnEndpoint: 'cdn-us.dissg.com',
    compliance: {
      gdpr: false,
      ccpa: true,
      dataResidency: true,
    },
    features: {
      municipalData: true,
      politicianProfiles: false,
      simulation: true,
    },
  },
  asia: {
    code: 'asia',
    name: 'Asia Pacific',
    domain: 'dissg.asia',
    defaultLanguage: 'en',
    supportedLanguages: ['en', 'zh'],
    defaultCurrency: 'USD',
    supportedCurrencies: ['USD', 'JPY', 'CNY', 'SGD', 'HKD'],
    timezone: 'Asia/Singapore',
    awsRegion: 'ap-southeast-1',
    cdnEndpoint: 'cdn-asia.dissg.com',
    compliance: {
      gdpr: false,
      ccpa: false,
      dataResidency: true,
    },
    features: {
      municipalData: false,
      politicianProfiles: false,
      simulation: true,
    },
  },
  africa: {
    code: 'africa',
    name: 'Africa',
    domain: 'dissg.africa',
    defaultLanguage: 'en',
    supportedLanguages: ['en', 'fr', 'ar', 'sw'],
    defaultCurrency: 'USD',
    supportedCurrencies: ['USD', 'EUR', 'ZAR', 'NGN', 'KES'],
    timezone: 'Africa/Nairobi',
    awsRegion: 'af-south-1',
    cdnEndpoint: 'cdn-africa.dissg.com',
    compliance: {
      gdpr: false,
      ccpa: false,
      dataResidency: false,
    },
    features: {
      municipalData: false,
      politicianProfiles: false,
      simulation: false,
    },
  },
};

/**
 * Detect current region from domain or environment
 */
export function detectRegion(): RegionCode {
  if (typeof window === 'undefined') return 'global';
  
  const hostname = window.location.hostname;
  
  for (const [code, config] of Object.entries(regions)) {
    if (hostname.includes(config.domain) || hostname.includes(code)) {
      return code as RegionCode;
    }
  }
  
  return 'global';
}

/**
 * Get region configuration
 */
export function getRegionConfig(code?: RegionCode): RegionConfig {
  return regions[code || detectRegion()];
}

export default regions;
