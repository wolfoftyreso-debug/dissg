import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { mockKPIs } from '@/data/mockKPIs';
import { useToast } from '@/hooks/use-toast';

export interface KPIAlert {
  kpiId: string;
  kpiName: string;
  alertType: 'threshold_breach' | 'velocity_warning' | 'trend_reversal' | 'correlation_break';
  severity: 'warning' | 'critical';
  title: string;
  description: string;
  currentValue: number;
  threshold: number;
  trendPercent: number;
  triggeredAt?: string;
  acknowledged?: boolean;
}

// KPI threshold configuration for client-side fallback
interface KPIThreshold {
  kpiId: string;
  warningThreshold: number;
  criticalThreshold: number;
  direction: 'above' | 'below';
  velocityWarning: number;
  velocityCritical: number;
}

const KPI_THRESHOLDS: KPIThreshold[] = [
  { kpiId: 'excess_mortality', warningThreshold: 3, criticalThreshold: 5, direction: 'above', velocityWarning: 20, velocityCritical: 50 },
  { kpiId: 'working_age_functional', warningThreshold: 70, criticalThreshold: 65, direction: 'below', velocityWarning: -1, velocityCritical: -2 },
  { kpiId: 'life_expectancy', warningThreshold: 82, criticalThreshold: 80, direction: 'below', velocityWarning: -0.5, velocityCritical: -1 },
  { kpiId: 'employment_rate_net', warningThreshold: 68, criticalThreshold: 65, direction: 'below', velocityWarning: -1, velocityCritical: -2 },
  { kpiId: 'long_term_exclusion', warningThreshold: 7, criticalThreshold: 10, direction: 'above', velocityWarning: 5, velocityCritical: 10 },
  { kpiId: 'tax_base_growth', warningThreshold: 0.5, criticalThreshold: -0.5, direction: 'below', velocityWarning: -50, velocityCritical: -100 },
  { kpiId: 'dependency_ratio', warningThreshold: 1.75, criticalThreshold: 1.85, direction: 'above', velocityWarning: 2, velocityCritical: 5 },
  { kpiId: 'violent_crime_rate', warningThreshold: 40, criticalThreshold: 50, direction: 'above', velocityWarning: 10, velocityCritical: 20 },
  { kpiId: 'young_men_outside_system', warningThreshold: 12, criticalThreshold: 15, direction: 'above', velocityWarning: 5, velocityCritical: 10 },
  { kpiId: 'healthcare_queue_functional', warningThreshold: 60, criticalThreshold: 90, direction: 'above', velocityWarning: 10, velocityCritical: 20 },
  { kpiId: 'school_outcomes_grade9', warningThreshold: 75, criticalThreshold: 70, direction: 'below', velocityWarning: -2, velocityCritical: -5 },
  { kpiId: 'energy_stability', warningThreshold: 60, criticalThreshold: 40, direction: 'below', velocityWarning: -10, velocityCritical: -20 },
  { kpiId: 'housing_turnover', warningThreshold: 4, criticalThreshold: 3, direction: 'below', velocityWarning: -10, velocityCritical: -20 },
];

function evaluateKPILocal(kpi: {
  id: string;
  name: string;
  value: number;
  previousValue: number;
  trendPercent: number;
}): KPIAlert | null {
  const threshold = KPI_THRESHOLDS.find(t => t.kpiId === kpi.id);
  if (!threshold) return null;
  
  const isAboveThreshold = threshold.direction === 'above';
  
  // Check absolute threshold breach
  const isCritical = isAboveThreshold 
    ? kpi.value >= threshold.criticalThreshold
    : kpi.value <= threshold.criticalThreshold;
  const isWarning = isAboveThreshold
    ? kpi.value >= threshold.warningThreshold
    : kpi.value <= threshold.warningThreshold;
  
  if (isCritical) {
    return {
      kpiId: kpi.id,
      kpiName: kpi.name,
      alertType: 'threshold_breach',
      severity: 'critical',
      title: `KRITISK: ${kpi.name} har nått kritisk nivå`,
      description: `Värdet ${kpi.value} har passerat den kritiska tröskeln på ${threshold.criticalThreshold}. Omedelbar uppmärksamhet krävs.`,
      currentValue: kpi.value,
      threshold: threshold.criticalThreshold,
      trendPercent: kpi.trendPercent,
      triggeredAt: new Date().toISOString(),
    };
  }
  
  if (isWarning) {
    return {
      kpiId: kpi.id,
      kpiName: kpi.name,
      alertType: 'threshold_breach',
      severity: 'warning',
      title: `VARNING: ${kpi.name} närmar sig kritisk nivå`,
      description: `Värdet ${kpi.value} har passerat varningströskeln på ${threshold.warningThreshold}. Övervakning rekommenderas.`,
      currentValue: kpi.value,
      threshold: threshold.warningThreshold,
      trendPercent: kpi.trendPercent,
      triggeredAt: new Date().toISOString(),
    };
  }
  
  // Check velocity
  const velocity = kpi.trendPercent;
  const isCriticalVelocity = isAboveThreshold
    ? velocity >= threshold.velocityCritical
    : velocity <= threshold.velocityCritical;
  const isWarningVelocity = isAboveThreshold
    ? velocity >= threshold.velocityWarning
    : velocity <= threshold.velocityWarning;
  
  if (isCriticalVelocity) {
    return {
      kpiId: kpi.id,
      kpiName: kpi.name,
      alertType: 'velocity_warning',
      severity: 'critical',
      title: `KRITISK TREND: ${kpi.name} förändras snabbt`,
      description: `Förändringshastigheten på ${velocity.toFixed(1)}% överskrider den kritiska gränsen.`,
      currentValue: kpi.value,
      threshold: threshold.velocityCritical,
      trendPercent: velocity,
      triggeredAt: new Date().toISOString(),
    };
  }
  
  if (isWarningVelocity) {
    return {
      kpiId: kpi.id,
      kpiName: kpi.name,
      alertType: 'velocity_warning',
      severity: 'warning',
      title: `VARNING: ${kpi.name} visar oroväckande trend`,
      description: `Förändringshastigheten på ${velocity.toFixed(1)}% indikerar negativ utveckling.`,
      currentValue: kpi.value,
      threshold: threshold.velocityWarning,
      trendPercent: velocity,
      triggeredAt: new Date().toISOString(),
    };
  }
  
  return null;
}

export function useKPIAlerts() {
  const [alerts, setAlerts] = useState<KPIAlert[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const { toast } = useToast();

  const analyzeAlerts = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // Try edge function first
      const { data, error } = await supabase.functions.invoke('kpi-alerts', {
        body: {
          action: 'analyze',
          kpis: mockKPIs.map(kpi => ({
            id: kpi.id,
            name: kpi.name,
            value: kpi.value,
            previousValue: kpi.previousValue,
            trendPercent: kpi.trendPercent,
            status: kpi.status,
          })),
        },
      });

      if (error) throw error;
      
      setAlerts(data.alerts);
      setLastChecked(new Date());
      
      // Show toast for critical alerts
      const criticalCount = data.alerts.filter((a: KPIAlert) => a.severity === 'critical').length;
      if (criticalCount > 0) {
        toast({
          title: `${criticalCount} kritiska varningar`,
          description: 'Nya kritiska tröskelvärden har överskridits',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.log('Edge function unavailable, using local analysis');
      
      // Fallback to local analysis
      const localAlerts: KPIAlert[] = [];
      for (const kpi of mockKPIs) {
        const alert = evaluateKPILocal(kpi);
        if (alert) {
          localAlerts.push(alert);
        }
      }
      
      localAlerts.sort((a, b) => {
        if (a.severity === 'critical' && b.severity !== 'critical') return -1;
        if (a.severity !== 'critical' && b.severity === 'critical') return 1;
        return 0;
      });
      
      setAlerts(localAlerts);
      setLastChecked(new Date());
      
      const criticalCount = localAlerts.filter(a => a.severity === 'critical').length;
      if (criticalCount > 0) {
        toast({
          title: `${criticalCount} kritiska varningar`,
          description: 'Nya kritiska tröskelvärden har överskridits',
          variant: 'destructive',
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const acknowledgeAlert = useCallback((kpiId: string) => {
    setAlerts(prev => prev.map(a => 
      a.kpiId === kpiId ? { ...a, acknowledged: true } : a
    ));
  }, []);

  const dismissAlert = useCallback((kpiId: string) => {
    setAlerts(prev => prev.filter(a => a.kpiId !== kpiId));
  }, []);

  // Auto-analyze on mount
  useEffect(() => {
    analyzeAlerts();
  }, [analyzeAlerts]);

  return {
    alerts,
    isLoading,
    lastChecked,
    analyzeAlerts,
    acknowledgeAlert,
    dismissAlert,
    criticalCount: alerts.filter(a => a.severity === 'critical' && !a.acknowledged).length,
    warningCount: alerts.filter(a => a.severity === 'warning' && !a.acknowledged).length,
  };
}
