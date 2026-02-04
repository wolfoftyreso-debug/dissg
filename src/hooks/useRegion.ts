/**
 * Region Hook
 * 
 * Access current region configuration and utilities.
 */

import { useMemo } from 'react';
import { detectRegion, getRegionConfig, type RegionCode, type RegionConfig } from '@/config/regions';

export interface UseRegionReturn {
  region: RegionConfig;
  regionCode: RegionCode;
  isGlobal: boolean;
  isEU: boolean;
  hasGDPR: boolean;
  hasCCPA: boolean;
}

export function useRegion(): UseRegionReturn {
  const regionCode = useMemo(() => detectRegion(), []);
  const region = useMemo(() => getRegionConfig(regionCode), [regionCode]);

  return {
    region,
    regionCode,
    isGlobal: regionCode === 'global',
    isEU: regionCode === 'eu',
    hasGDPR: region.compliance.gdpr,
    hasCCPA: region.compliance.ccpa,
  };
}

export default useRegion;
