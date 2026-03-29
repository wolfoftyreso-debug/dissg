import { useState, useEffect, useMemo } from 'react';
import { getToken } from '@/lib/auth';
import { SWEDISH_REGIONS, getRegionByCode } from '@/config/regionsConfig';
import type { KPI } from '@/types/kpi';

export interface RegionalKPIValue {
  regionCode: string;
  regionName: string;
  value: number;
  previousValue: number | null;
  trend: 'up' | 'down' | 'stable';
  trendPercent: number;
  confidence: number;
  lastUpdated: string;
  population: number;
}

export interface RegionalKPIComparison {
  kpiId: string;
  kpiName: string;
  kpiUnit: string;
  nationalValue: number;
  regions: RegionalKPIValue[];
  bestRegion: RegionalKPIValue | null;
  worstRegion: RegionalKPIValue | null;
  spread: number;
  isInverted: boolean;
}

// Authenticated fetch to DISSG API
async function apiFetch(path: string) {
  const token = getToken();
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`https://api.wavult.com/v1/dissg${path}`, { headers });
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`);
  return res.json();
}

export function useRegionalKPIData(kpiId?: string) {
  const [regionalData, setRegionalData] = useState<RegionalKPIComparison | null>(null);
  const [allKPIsRegionalData, setAllKPIsRegionalData] = useState<RegionalKPIComparison[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!kpiId) {
      setIsLoading(false);
      return;
    }

    async function fetchRegionalData() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await apiFetch(`/kpi/${kpiId}/regional`);
        const regions: RegionalKPIValue[] = (data.regions || []).map((row: RegionalKPIValue) => {
          const region = getRegionByCode(row.regionCode);
          return {
            ...row,
            regionName: region?.name || row.regionName || `Län ${row.regionCode}`,
            population: region?.population || row.population || 0,
          };
        });

        const isInverted = data.isInverted || false;
        const sorted = [...regions].sort((a, b) =>
          isInverted ? a.value - b.value : b.value - a.value,
        );

        setRegionalData({
          kpiId,
          kpiName: data.kpiName || 'Okänd KPI',
          kpiUnit: data.kpiUnit || '',
          nationalValue: data.nationalValue ?? 0,
          regions,
          bestRegion: sorted[0] || null,
          worstRegion: sorted[sorted.length - 1] || null,
          spread:
            sorted.length > 1
              ? Math.abs(sorted[0].value - sorted[sorted.length - 1].value)
              : 0,
          isInverted,
        });
      } catch (err) {
        console.error('Error fetching regional KPI data:', err);
        setError('Regional data ej tillgänglig — ingen data i systemet ännu');
        setRegionalData(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRegionalData();
  }, [kpiId]);

  // All-KPIs regional data — requires API
  useEffect(() => {
    async function fetchAllRegionalData() {
      try {
        const data = await apiFetch('/kpi/regional/all');
        setAllKPIsRegionalData(data.kpis || []);
      } catch {
        // No fallback — empty state
        setAllKPIsRegionalData([]);
      }
    }

    fetchAllRegionalData();
  }, []);

  return {
    regionalData,
    allKPIsRegionalData,
    isLoading,
    error,
  };
}

/**
 * Hook för att jämföra två specifika regioner
 */
export function useRegionComparison(regionCode1: string, regionCode2: string) {
  const { allKPIsRegionalData, isLoading } = useRegionalKPIData();

  const comparison = useMemo(() => {
    if (!allKPIsRegionalData.length) return null;

    return allKPIsRegionalData
      .map((kpi) => {
        const region1 = kpi.regions.find((r) => r.regionCode === regionCode1);
        const region2 = kpi.regions.find((r) => r.regionCode === regionCode2);

        if (!region1 || !region2) return null;

        const difference = region1.value - region2.value;
        const percentDiff = ((region1.value - region2.value) / region2.value) * 100;

        return {
          kpiId: kpi.kpiId,
          kpiName: kpi.kpiName,
          kpiUnit: kpi.kpiUnit,
          region1Value: region1.value,
          region2Value: region2.value,
          difference,
          percentDiff,
          isInverted: kpi.isInverted,
          region1Better: kpi.isInverted ? difference < 0 : difference > 0,
        };
      })
      .filter(Boolean);
  }, [allKPIsRegionalData, regionCode1, regionCode2]);

  return { comparison, isLoading };
}
