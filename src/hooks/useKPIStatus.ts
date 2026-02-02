import { useMemo } from 'react';
import { calculateKPIStatus, calculateTrend, getThresholds, type KPIThresholds } from '@/config/kpiThresholds';
import type { KPI, KPIStatus, TrendDirection } from '@/types/kpi';

interface KPIWithCalculatedStatus extends KPI {
  calculatedStatus: KPIStatus;
  statusReason: string;
  thresholds: KPIThresholds;
}

/**
 * Hook för att beräkna KPI-status dynamiskt baserat på trösklar
 */
export function useKPIStatus(kpis: KPI[]): KPIWithCalculatedStatus[] {
  return useMemo(() => {
    return kpis.map(kpi => {
      const { status, reason } = calculateKPIStatus(
        kpi.id,
        kpi.value,
        kpi.inverted,
        kpi.trendPercent
      );

      return {
        ...kpi,
        status, // Överskrid hårdkodad status med beräknad
        calculatedStatus: status,
        statusReason: reason,
        thresholds: getThresholds(kpi.id),
      };
    });
  }, [kpis]);
}

/**
 * Hook för att beräkna status för en enskild KPI
 */
export function useSingleKPIStatus(
  kpiId: string,
  value: number,
  previousValue: number | undefined,
  isInverted: boolean = false
): {
  status: KPIStatus;
  statusReason: string;
  trend: TrendDirection;
  trendPercent: number;
  thresholds: KPIThresholds;
} {
  return useMemo(() => {
    const { trend, trendPercent } = calculateTrend(value, previousValue);
    const { status, reason } = calculateKPIStatus(kpiId, value, isInverted, trendPercent);
    
    return {
      status,
      statusReason: reason,
      trend,
      trendPercent,
      thresholds: getThresholds(kpiId),
    };
  }, [kpiId, value, previousValue, isInverted]);
}

/**
 * Hook för att få statussammanfattning för en lista av KPI:er
 */
export function useKPIStatusSummary(kpis: KPI[]): {
  positive: number;
  warning: number;
  critical: number;
  neutral: number;
  total: number;
  criticalKpis: KPI[];
  warningKpis: KPI[];
} {
  return useMemo(() => {
    const counts = { positive: 0, warning: 0, critical: 0, neutral: 0 };
    const criticalKpis: KPI[] = [];
    const warningKpis: KPI[] = [];

    kpis.forEach(kpi => {
      const { status } = calculateKPIStatus(
        kpi.id,
        kpi.value,
        kpi.inverted,
        kpi.trendPercent
      );
      
      counts[status]++;
      
      if (status === 'critical') {
        criticalKpis.push({ ...kpi, status });
      } else if (status === 'warning') {
        warningKpis.push({ ...kpi, status });
      }
    });

    return {
      ...counts,
      total: kpis.length,
      criticalKpis,
      warningKpis,
    };
  }, [kpis]);
}
