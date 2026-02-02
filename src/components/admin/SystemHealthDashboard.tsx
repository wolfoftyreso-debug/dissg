/**
 * WAVE 14 — BLOCK DN
 * SYSTEM HEALTH DASHBOARD
 * 
 * Full insyn i systemets tillstånd.
 * Om hälsan sjunker → syns publikt.
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Activity,
  Database,
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  Server,
  Users,
  TrendingUp,
  Shield,
} from 'lucide-react';
import {
  SystemHealthMetrics,
  HealthAlert,
  HEALTH_MONITOR_CONFIG,
  calculateSystemHealth,
} from '@/config/systemResilienceConfig';

// Mock data for demonstration
const mockMetrics: SystemHealthMetrics = {
  timestamp: new Date().toISOString(),
  coverage: {
    countriesActive: 27,
    countriesTotal: 30,
    kpisActive: 142,
    kpisTotal: 150,
    percentCovered: 90,
  },
  performance: {
    avgLatencyMs: 245,
    p95LatencyMs: 890,
    requestsPerMinute: 1250,
    cacheHitRate: 0.87,
  },
  errors: {
    errorRate: 0.002,
    errorsLast24h: 45,
    criticalErrors: 0,
    warningsActive: 3,
  },
  data: {
    freshnessHours: 4,
    staleSources: 2,
    pendingIngests: 5,
    failedIngests: 0,
  },
  uncertainty: {
    avgConfidence: 82,
    lowConfidenceKpis: 8,
    missingDataPoints: 234,
  },
  userActivity: {
    activeSessionsLast24h: 1847,
    queriesLast24h: 12450,
    exportsLast24h: 89,
  },
};

const mockAlerts: HealthAlert[] = [
  {
    id: '1',
    severity: 'warning',
    category: 'data',
    message: '2 datakällor har inte uppdaterats på 48+ timmar',
    metric: 'freshness',
    currentValue: 52,
    threshold: 48,
    triggeredAt: new Date(Date.now() - 3600000).toISOString(),
    isPublic: true,
  },
  {
    id: '2',
    severity: 'info',
    category: 'coverage',
    message: '3 länder saknar fullständig KPI-täckning',
    metric: 'coverage',
    currentValue: 90,
    threshold: 95,
    triggeredAt: new Date(Date.now() - 7200000).toISOString(),
    isPublic: true,
  },
];

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: React.ReactNode;
  status: 'good' | 'warning' | 'critical';
  trend?: 'up' | 'down' | 'stable';
}

function MetricCard({ title, value, unit, icon, status, trend }: MetricCardProps) {
  const statusColors = {
    good: 'text-green-600 dark:text-green-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    critical: 'text-red-600 dark:text-red-400',
  };

  const bgColors = {
    good: 'bg-green-50 dark:bg-green-900/20',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20',
    critical: 'bg-red-50 dark:bg-red-900/20',
  };

  return (
    <div className={`p-4 rounded-lg ${bgColors[status]}`}>
      <div className="flex items-center justify-between mb-2">
        <div className={`${statusColors[status]}`}>{icon}</div>
        {trend && (
          <TrendingUp 
            className={`h-4 w-4 ${
              trend === 'up' ? 'text-green-500' : 
              trend === 'down' ? 'text-red-500 rotate-180' : 
              'text-gray-400'
            }`} 
          />
        )}
      </div>
      <div className={`text-2xl font-bold ${statusColors[status]}`}>
        {value}{unit && <span className="text-sm ml-1">{unit}</span>}
      </div>
      <div className="text-sm text-muted-foreground">{title}</div>
    </div>
  );
}

export function SystemHealthDashboard() {
  const healthStatus = calculateSystemHealth(mockMetrics);
  
  const getMetricStatus = (
    value: number, 
    warningThreshold: number, 
    criticalThreshold: number,
    inverted = false
  ): 'good' | 'warning' | 'critical' => {
    if (inverted) {
      if (value < criticalThreshold) return 'critical';
      if (value < warningThreshold) return 'warning';
      return 'good';
    }
    if (value > criticalThreshold) return 'critical';
    if (value > warningThreshold) return 'warning';
    return 'good';
  };

  return (
    <div className="space-y-6">
      {/* Overall Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Systemhälsa
            </CardTitle>
            <Badge 
              variant={healthStatus.status === 'healthy' ? 'default' : 
                       healthStatus.status === 'degraded' ? 'secondary' : 'destructive'}
            >
              {healthStatus.status === 'healthy' ? 'Friskt' :
               healthStatus.status === 'degraded' ? 'Degraderat' : 'Kritiskt'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Övergripande hälsopoäng</span>
              <span className="font-medium">{healthStatus.score}%</span>
            </div>
            <Progress value={healthStatus.score} className="h-3" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Senast uppdaterad: {new Date(mockMetrics.timestamp).toLocaleString('sv-SE')}
          </p>
        </CardContent>
      </Card>

      {/* Alerts */}
      {mockAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Aktiva varningar ({mockAlerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockAlerts.map(alert => (
              <Alert 
                key={alert.id} 
                variant={alert.severity === 'critical' ? 'destructive' : 'default'}
              >
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle className="text-sm">
                  {alert.severity === 'warning' ? 'Varning' : 
                   alert.severity === 'critical' ? 'Kritiskt' : 'Information'}
                </AlertTitle>
                <AlertDescription className="text-sm">
                  {alert.message}
                  <span className="block text-xs text-muted-foreground mt-1">
                    Utlöst: {new Date(alert.triggeredAt).toLocaleString('sv-SE')}
                  </span>
                </AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Key Metrics Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Nyckeltal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard
              title="Datatäckning"
              value={mockMetrics.coverage.percentCovered}
              unit="%"
              icon={<Database className="h-5 w-5" />}
              status={getMetricStatus(
                mockMetrics.coverage.percentCovered,
                HEALTH_MONITOR_CONFIG.metrics.coverage.warningThreshold,
                HEALTH_MONITOR_CONFIG.metrics.coverage.criticalThreshold,
                true
              )}
              trend="stable"
            />
            <MetricCard
              title="Latens"
              value={mockMetrics.performance.avgLatencyMs}
              unit="ms"
              icon={<Zap className="h-5 w-5" />}
              status={getMetricStatus(
                mockMetrics.performance.avgLatencyMs,
                HEALTH_MONITOR_CONFIG.metrics.latency.warningThreshold,
                HEALTH_MONITOR_CONFIG.metrics.latency.criticalThreshold
              )}
              trend="down"
            />
            <MetricCard
              title="Felgrad"
              value={(mockMetrics.errors.errorRate * 100).toFixed(2)}
              unit="%"
              icon={<AlertTriangle className="h-5 w-5" />}
              status={getMetricStatus(
                mockMetrics.errors.errorRate,
                HEALTH_MONITOR_CONFIG.metrics.errorRate.warningThreshold,
                HEALTH_MONITOR_CONFIG.metrics.errorRate.criticalThreshold
              )}
              trend="stable"
            />
            <MetricCard
              title="Datafärskhet"
              value={mockMetrics.data.freshnessHours}
              unit="h"
              icon={<Clock className="h-5 w-5" />}
              status={getMetricStatus(
                mockMetrics.data.freshnessHours,
                HEALTH_MONITOR_CONFIG.metrics.freshness.warningThreshold,
                HEALTH_MONITOR_CONFIG.metrics.freshness.criticalThreshold
              )}
              trend="up"
            />
          </div>
        </CardContent>
      </Card>

      {/* Detailed Sections */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Coverage Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Database className="h-4 w-4" />
              Täckning
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm">Aktiva länder</span>
              <span className="font-medium">
                {mockMetrics.coverage.countriesActive}/{mockMetrics.coverage.countriesTotal}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Aktiva KPIs</span>
              <span className="font-medium">
                {mockMetrics.coverage.kpisActive}/{mockMetrics.coverage.kpisTotal}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Saknade datapunkter</span>
              <span className="font-medium text-yellow-600">
                {mockMetrics.uncertainty.missingDataPoints}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Performance Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Prestanda
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm">P95 Latens</span>
              <span className="font-medium">{mockMetrics.performance.p95LatencyMs}ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Cache-träffar</span>
              <span className="font-medium">
                {(mockMetrics.performance.cacheHitRate * 100).toFixed(0)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Förfrågningar/min</span>
              <span className="font-medium">{mockMetrics.performance.requestsPerMinute}</span>
            </div>
          </CardContent>
        </Card>

        {/* Data Pipeline */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Server className="h-4 w-4" />
              Datapipeline
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm">Inaktuella källor</span>
              <span className={`font-medium ${mockMetrics.data.staleSources > 0 ? 'text-yellow-600' : ''}`}>
                {mockMetrics.data.staleSources}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Väntande ingest</span>
              <span className="font-medium">{mockMetrics.data.pendingIngests}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Misslyckade ingest</span>
              <span className={`font-medium ${mockMetrics.data.failedIngests > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {mockMetrics.data.failedIngests}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* User Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4" />
              Användaraktivitet (24h)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm">Aktiva sessioner</span>
              <span className="font-medium">{mockMetrics.userActivity.activeSessionsLast24h}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Sökningar</span>
              <span className="font-medium">{mockMetrics.userActivity.queriesLast24h}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Exporter</span>
              <span className="font-medium">{mockMetrics.userActivity.exportsLast24h}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Confidence/Uncertainty */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Osäkerhet & förtroende
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Genomsnittligt förtroende</span>
                <span className="font-medium">{mockMetrics.uncertainty.avgConfidence}%</span>
              </div>
              <Progress value={mockMetrics.uncertainty.avgConfidence} className="h-2" />
            </div>
            <div className="flex justify-between text-sm">
              <span>KPIs med lågt förtroende</span>
              <span className="font-medium text-yellow-600">
                {mockMetrics.uncertainty.lowConfidenceKpis} st
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Public Visibility Notice */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertTitle>Publik synlighet</AlertTitle>
        <AlertDescription>
          Alla systemhälsomått är offentligt tillgängliga i enlighet med principen: 
          "Om hälsan sjunker → syns publikt."
        </AlertDescription>
      </Alert>
    </div>
  );
}

export default SystemHealthDashboard;
