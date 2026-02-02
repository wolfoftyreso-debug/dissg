import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SWEDISH_REGIONS, getRegionByCode } from '@/config/regionsConfig';
import { mockKPIs } from '@/data/mockKPIs';
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
  spread: number; // Skillnad mellan bästa och sämsta
  isInverted: boolean;
}

/**
 * Generera mock-data för regional jämförelse
 */
function generateMockRegionalData(kpi: KPI): RegionalKPIValue[] {
  const baseValue = kpi.value;
  const variance = baseValue * 0.15; // ±15% variation

  return SWEDISH_REGIONS.map(region => {
    // Skapa realistisk variation baserat på regiontyp
    let modifier = 0;
    
    // Storstadslän tenderar att ha bättre värden för produktivitet/sysselsättning
    if (['01', '12', '14'].includes(region.code)) {
      modifier = kpi.category === 'arbete_produktivitet' ? 0.05 : -0.02;
    }
    // Norrlandslän har ofta lägre sysselsättning men bättre för vissa hälsoindikatorer
    if (['23', '24', '25'].includes(region.code)) {
      modifier = kpi.category === 'demografi_halsa' ? 0.03 : -0.05;
    }

    const randomVariation = (Math.random() - 0.5) * 2 * variance;
    const value = Math.max(0, baseValue + randomVariation + (baseValue * modifier));
    
    const trendOptions: Array<'up' | 'down' | 'stable'> = ['up', 'down', 'stable'];
    const trend = trendOptions[Math.floor(Math.random() * 3)];
    const trendPercent = trend === 'stable' ? 0 : (Math.random() - 0.5) * 4;

    return {
      regionCode: region.code,
      regionName: region.name,
      value: Math.round(value * 100) / 100,
      previousValue: value * (1 - trendPercent / 100),
      trend,
      trendPercent: Math.round(trendPercent * 10) / 10,
      confidence: 70 + Math.floor(Math.random() * 25),
      lastUpdated: new Date().toISOString(),
      population: region.population,
    };
  });
}

export function useRegionalKPIData(kpiId?: string) {
  const [regionalData, setRegionalData] = useState<RegionalKPIComparison | null>(null);
  const [allKPIsRegionalData, setAllKPIsRegionalData] = useState<RegionalKPIComparison[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Hämta regional data för en specifik KPI
  useEffect(() => {
    if (!kpiId) return;

    async function fetchRegionalData() {
      setIsLoading(true);
      setError(null);

      try {
        // Försök hämta från databasen först
        const { data: dbData, error: dbError } = await supabase
          .from('kpi_values')
          .select(`
            value,
            previous_value,
            trend,
            trend_percent,
            confidence,
            region_code,
            period_end,
            kpi:kpi_definitions(id, name, unit, is_inverted)
          `)
          .eq('kpi_id', kpiId)
          .not('region_code', 'is', null)
          .order('period_end', { ascending: false });

        if (dbError) throw dbError;

        if (dbData && dbData.length > 0) {
          // Gruppera efter region och ta senaste värdet
          const regionMap = new Map<string, any>();
          dbData.forEach(row => {
            if (row.region_code && !regionMap.has(row.region_code)) {
              regionMap.set(row.region_code, row);
            }
          });

          const regions: RegionalKPIValue[] = Array.from(regionMap.entries()).map(([code, row]) => {
            const region = getRegionByCode(code);
            return {
              regionCode: code,
              regionName: region?.name || `Län ${code}`,
              value: row.value,
              previousValue: row.previous_value,
              trend: row.trend,
              trendPercent: row.trend_percent || 0,
              confidence: row.confidence,
              lastUpdated: row.period_end,
              population: region?.population || 0,
            };
          });

          const kpiInfo = dbData[0].kpi as any;
          const isInverted = kpiInfo?.is_inverted || false;
          
          const sorted = [...regions].sort((a, b) => 
            isInverted ? a.value - b.value : b.value - a.value
          );

          setRegionalData({
            kpiId,
            kpiName: kpiInfo?.name || 'Okänd KPI',
            kpiUnit: kpiInfo?.unit || '',
            nationalValue: regions.reduce((sum, r) => sum + r.value * r.population, 0) / 
                          regions.reduce((sum, r) => sum + r.population, 0),
            regions,
            bestRegion: sorted[0] || null,
            worstRegion: sorted[sorted.length - 1] || null,
            spread: sorted.length > 1 ? Math.abs(sorted[0].value - sorted[sorted.length - 1].value) : 0,
            isInverted,
          });
        } else {
          // Fallback till mock-data
          const kpi = mockKPIs.find(k => k.id === kpiId);
          if (kpi) {
            const regions = generateMockRegionalData(kpi);
            const sorted = [...regions].sort((a, b) => 
              kpi.inverted ? a.value - b.value : b.value - a.value
            );

            setRegionalData({
              kpiId: kpi.id,
              kpiName: kpi.name,
              kpiUnit: kpi.unit,
              nationalValue: kpi.value,
              regions,
              bestRegion: sorted[0] || null,
              worstRegion: sorted[sorted.length - 1] || null,
              spread: sorted.length > 1 ? Math.abs(sorted[0].value - sorted[sorted.length - 1].value) : 0,
              isInverted: kpi.inverted || false,
            });
          }
        }
      } catch (err) {
        console.error('Error fetching regional KPI data:', err);
        setError('Kunde inte hämta regional data');
        
        // Fallback till mock
        const kpi = mockKPIs.find(k => k.id === kpiId);
        if (kpi) {
          const regions = generateMockRegionalData(kpi);
          const sorted = [...regions].sort((a, b) => 
            kpi.inverted ? a.value - b.value : b.value - a.value
          );

          setRegionalData({
            kpiId: kpi.id,
            kpiName: kpi.name,
            kpiUnit: kpi.unit,
            nationalValue: kpi.value,
            regions,
            bestRegion: sorted[0] || null,
            worstRegion: sorted[sorted.length - 1] || null,
            spread: sorted.length > 1 ? Math.abs(sorted[0].value - sorted[sorted.length - 1].value) : 0,
            isInverted: kpi.inverted || false,
          });
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchRegionalData();
  }, [kpiId]);

  // Hämta regional data för alla KPI:er
  useEffect(() => {
    async function fetchAllRegionalData() {
      const allData: RegionalKPIComparison[] = mockKPIs.map(kpi => {
        const regions = generateMockRegionalData(kpi);
        const sorted = [...regions].sort((a, b) => 
          kpi.inverted ? a.value - b.value : b.value - a.value
        );

        return {
          kpiId: kpi.id,
          kpiName: kpi.name,
          kpiUnit: kpi.unit,
          nationalValue: kpi.value,
          regions,
          bestRegion: sorted[0] || null,
          worstRegion: sorted[sorted.length - 1] || null,
          spread: sorted.length > 1 ? Math.abs(sorted[0].value - sorted[sorted.length - 1].value) : 0,
          isInverted: kpi.inverted || false,
        };
      });

      setAllKPIsRegionalData(allData);
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

    return allKPIsRegionalData.map(kpi => {
      const region1 = kpi.regions.find(r => r.regionCode === regionCode1);
      const region2 = kpi.regions.find(r => r.regionCode === regionCode2);

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
    }).filter(Boolean);
  }, [allKPIsRegionalData, regionCode1, regionCode2]);

  return { comparison, isLoading };
}
