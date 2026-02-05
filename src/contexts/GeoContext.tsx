/**
 * GEO CONTEXT
 * 
 * Manages the current geographic scope/focus.
 * Default: User's detected country
 * Allows "zooming out" to region or global view.
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type GeoLevel = 'global' | 'region' | 'country' | 'province' | 'municipal';

export interface GeoScope {
  level: GeoLevel;
  code: string;
  name: string;
  name_local?: string;
}

// Geographic hierarchy
export const GEO_REGIONS: Record<string, { name: string; countries: string[] }> = {
  'EUROPE': { 
    name: 'Europa', 
    countries: ['SE', 'NO', 'DK', 'FI', 'DE', 'FR', 'GB', 'NL', 'BE', 'AT', 'CH', 'PL', 'ES', 'IT', 'PT'] 
  },
  'NORTH_AMERICA': { 
    name: 'Nordamerika', 
    countries: ['US', 'CA', 'MX'] 
  },
  'ASIA': { 
    name: 'Asien', 
    countries: ['JP', 'KR', 'CN', 'IN', 'SG', 'TH', 'VN', 'ID', 'MY'] 
  },
  'OCEANIA': { 
    name: 'Oceanien', 
    countries: ['AU', 'NZ'] 
  },
  'SOUTH_AMERICA': { 
    name: 'Sydamerika', 
    countries: ['BR', 'AR', 'CL', 'CO', 'PE'] 
  },
  'AFRICA': { 
    name: 'Afrika', 
    countries: ['ZA', 'NG', 'KE', 'EG', 'MA'] 
  },
};

// Country metadata
export const COUNTRIES: Record<string, { name: string; name_local: string; region: string }> = {
  'SE': { name: 'Sweden', name_local: 'Sverige', region: 'EUROPE' },
  'NO': { name: 'Norway', name_local: 'Norge', region: 'EUROPE' },
  'DK': { name: 'Denmark', name_local: 'Danmark', region: 'EUROPE' },
  'FI': { name: 'Finland', name_local: 'Finland', region: 'EUROPE' },
  'DE': { name: 'Germany', name_local: 'Deutschland', region: 'EUROPE' },
  'FR': { name: 'France', name_local: 'France', region: 'EUROPE' },
  'GB': { name: 'United Kingdom', name_local: 'United Kingdom', region: 'EUROPE' },
  'NL': { name: 'Netherlands', name_local: 'Nederland', region: 'EUROPE' },
  'US': { name: 'United States', name_local: 'United States', region: 'NORTH_AMERICA' },
  'CA': { name: 'Canada', name_local: 'Canada', region: 'NORTH_AMERICA' },
  'JP': { name: 'Japan', name_local: '日本', region: 'ASIA' },
  'AU': { name: 'Australia', name_local: 'Australia', region: 'OCEANIA' },
  'BR': { name: 'Brazil', name_local: 'Brasil', region: 'SOUTH_AMERICA' },
  'ZA': { name: 'South Africa', name_local: 'South Africa', region: 'AFRICA' },
};

interface GeoContextType {
  scope: GeoScope;
  setScope: (scope: GeoScope) => void;
  zoomOut: () => void;
  zoomIn: (target: GeoScope) => void;
  canZoomOut: boolean;
  canZoomIn: boolean;
  breadcrumbs: GeoScope[];
  detectedCountry: string;
}

const GeoContext = createContext<GeoContextType | undefined>(undefined);

// Detect user's country from browser/timezone
function detectUserCountry(): string {
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const timezoneToCountry: Record<string, string> = {
      'Europe/Stockholm': 'SE',
      'Europe/Oslo': 'NO',
      'Europe/Copenhagen': 'DK',
      'Europe/Helsinki': 'FI',
      'Europe/Berlin': 'DE',
      'Europe/Paris': 'FR',
      'Europe/London': 'GB',
      'Europe/Amsterdam': 'NL',
      'America/New_York': 'US',
      'America/Los_Angeles': 'US',
      'America/Chicago': 'US',
      'America/Toronto': 'CA',
      'Asia/Tokyo': 'JP',
      'Australia/Sydney': 'AU',
      'America/Sao_Paulo': 'BR',
    };
    return timezoneToCountry[timezone] || 'SE';
  } catch {
    return 'SE';
  }
}

export function GeoProvider({ children }: { children: ReactNode }) {
  const [detectedCountry] = useState(() => detectUserCountry());
  
   // GLOBAL FIRST PRINCIPLE: Always start at global level
   // Users drill down to continent → country → region
   // No country is favored - the system is jurisdictionally neutral
   const [scope, setScope] = useState<GeoScope>({
     level: 'global',
     code: 'GLOBAL',
     name: 'Global',
   });

  // Build breadcrumbs based on current scope
  const breadcrumbs: GeoScope[] = [];
  
  // Always include global
  breadcrumbs.push({ level: 'global', code: 'GLOBAL', name: 'Global' });
  
  // Add region if at country or below
  if (scope.level === 'country' || scope.level === 'province' || scope.level === 'municipal') {
    const country = COUNTRIES[scope.code] || COUNTRIES[detectedCountry];
    if (country) {
      const region = GEO_REGIONS[country.region];
      if (region) {
        breadcrumbs.push({ level: 'region', code: country.region, name: region.name });
      }
    }
  } else if (scope.level === 'region') {
    const region = GEO_REGIONS[scope.code];
    if (region) {
      breadcrumbs.push({ level: 'region', code: scope.code, name: region.name });
    }
  }
  
  // Add country if at country or below
  if (scope.level === 'country' || scope.level === 'province' || scope.level === 'municipal') {
    breadcrumbs.push(scope);
  }

  const canZoomOut = scope.level !== 'global';
  const canZoomIn = scope.level === 'global' || scope.level === 'region';

  const zoomOut = () => {
    if (scope.level === 'country') {
      const country = COUNTRIES[scope.code];
      if (country) {
        const region = GEO_REGIONS[country.region];
        if (region) {
          setScope({
            level: 'region',
            code: country.region,
            name: region.name,
          });
          return;
        }
      }
    }
    
    if (scope.level === 'region') {
      setScope({
        level: 'global',
        code: 'GLOBAL',
        name: 'Global',
      });
      return;
    }
    
    // Default: go to global
    setScope({
      level: 'global',
      code: 'GLOBAL',
      name: 'Global',
    });
  };

  const zoomIn = (target: GeoScope) => {
    setScope(target);
  };

  return (
    <GeoContext.Provider value={{
      scope,
      setScope,
      zoomOut,
      zoomIn,
      canZoomOut,
      canZoomIn,
      breadcrumbs,
      detectedCountry,
    }}>
      {children}
    </GeoContext.Provider>
  );
}

export function useGeo() {
  const context = useContext(GeoContext);
  if (!context) {
    throw new Error('useGeo must be used within a GeoProvider');
  }
  return context;
}
