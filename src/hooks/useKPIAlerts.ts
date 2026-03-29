import { useState, useEffect, useCallback } from 'react';
import { getToken } from '@/lib/auth';
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
  priorityIndex?: number;
  deviationPercent?: number;
}

// Fetch active alerts from DISSG API
async function fetchAlertsFromAPI(): Promise<KPIAlert[]> {
  const token = getToken();
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch('https://api.wavult.com/v1/dissg/alerts/active', { headers });
  if (!res.ok) throw new Error(`Alerts API: ${res.status}`);
  const data = await res.json();
  return data.alerts || [];
}

export function useKPIAlerts() {
  const [alerts, setAlerts] = useState<KPIAlert[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const { toast } = useToast();

  const analyzeAlerts = useCallback(async () => {
    setIsLoading(true);

    try {
      const fetched = await fetchAlertsFromAPI();

      // Sort by priority index (highest first)
      fetched.sort((a, b) => ((b.priorityIndex ?? 0) - (a.priorityIndex ?? 0)));

      setAlerts(fetched);
      setLastChecked(new Date());

      const criticalCount = fetched.filter((a) => a.severity === 'critical').length;
      if (criticalCount > 0) {
        toast({
          title: `${criticalCount} kritiska varningar`,
          description: 'Nya kritiska tröskelvärden har överskridits',
          variant: 'destructive',
        });
      }
    } catch (err) {
      console.warn('Alerts API unavailable:', err);
      // No mock fallback — empty state
      setAlerts([]);
      setLastChecked(new Date());
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const acknowledgeAlert = useCallback((kpiId: string) => {
    setAlerts((prev) => prev.map((a) => (a.kpiId === kpiId ? { ...a, acknowledged: true } : a)));
  }, []);

  const dismissAlert = useCallback((kpiId: string) => {
    setAlerts((prev) => prev.filter((a) => a.kpiId !== kpiId));
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
    criticalCount: alerts.filter((a) => a.severity === 'critical' && !a.acknowledged).length,
    warningCount: alerts.filter((a) => a.severity === 'warning' && !a.acknowledged).length,
  };
}
