/**
 * STATUS OVERVIEW COMPONENT
 * 
 * "Hur mår systemet just nu?"
 * 
 * Shows:
 * - Global Lambda
 * - Regional Lambda (selectable)
 * - Number of active warnings
 * - Number of critical deviations
 * - Last significant change
 */

import { Activity, AlertTriangle, Clock, TrendingDown, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LambdaGauge } from './LambdaGauge';
import type { SystemStatus } from '@/lib/lambda/oscilloscope-mode';
import type { DiagnosticCode } from '@/lib/lambda/diagnostic-codes';
import { getSeverityColor, formatDTCCode } from '@/lib/lambda/diagnostic-codes';

interface StatusOverviewProps {
  globalLambda: number;
  lambdaUncertainty: number;
  activeWarnings: number;
  criticalDeviations: number;
  lastSignificantChange?: {
    description: string;
    timestamp: string;
  };
  systemStatus: SystemStatus;
  recentCodes: DiagnosticCode[];
  language?: 'sv' | 'en';
  className?: string;
}

export function StatusOverview({
  globalLambda,
  lambdaUncertainty,
  activeWarnings,
  criticalDeviations,
  lastSignificantChange,
  systemStatus,
  recentCodes,
  language = 'sv',
  className,
}: StatusOverviewProps) {
  const labels = {
    systemStatus: { sv: 'Systemstatus', en: 'System Status' },
    globalLambda: { sv: 'Global Lambda', en: 'Global Lambda' },
    activeWarnings: { sv: 'Aktiva varningar', en: 'Active Warnings' },
    criticalDeviations: { sv: 'Kritiska avvikelser', en: 'Critical Deviations' },
    lastChange: { sv: 'Senaste förändring', en: 'Last Change' },
    recentCodes: { sv: 'Senaste diagnostikkoder', en: 'Recent Diagnostic Codes' },
    signalClarity: { sv: 'Signalklarhet', en: 'Signal Clarity' },
    dataFreshness: { sv: 'Datafärskhet', en: 'Data Freshness' },
    noChange: { sv: 'Ingen signifikant förändring registrerad', en: 'No significant change recorded' },
    hours: { sv: 'timmar', en: 'hours' },
  };
  
  return (
    <div className={cn('space-y-6', className)}>
      {/* Main status grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Lambda Gauge */}
        <Card className="md:col-span-2 lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {labels.globalLambda[language]}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LambdaGauge
              lambda={globalLambda}
              size="lg"
              showUncertainty
              uncertaintyRange={{
                lower: globalLambda - lambdaUncertainty,
                upper: globalLambda + lambdaUncertainty,
              }}
              language={language}
            />
          </CardContent>
        </Card>
        
        {/* Warnings */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              {labels.activeWarnings[language]}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className={cn(
                'text-4xl font-bold font-mono',
                activeWarnings > 0 ? 'text-amber-500' : 'text-muted-foreground'
              )}>
                {activeWarnings}
              </span>
              {activeWarnings > 0 && (
                <TrendingUp className="h-4 w-4 text-amber-500" />
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {language === 'sv' 
                ? 'Avvikelser som överskrider varningströsklar'
                : 'Deviations exceeding warning thresholds'}
            </p>
          </CardContent>
        </Card>
        
        {/* Critical */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="h-4 w-4 text-red-500" />
              {labels.criticalDeviations[language]}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className={cn(
                'text-4xl font-bold font-mono',
                criticalDeviations > 0 ? 'text-red-500' : 'text-muted-foreground'
              )}>
                {criticalDeviations}
              </span>
              {criticalDeviations > 0 && (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {language === 'sv'
                ? 'Avvikelser som kräver omedelbar uppmärksamhet'
                : 'Deviations requiring immediate attention'}
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Secondary info row */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Last significant change */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {labels.lastChange[language]}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {lastSignificantChange ? (
              <>
                <p className="text-sm font-medium">
                  {lastSignificantChange.description}
                </p>
                <p className="text-xs text-muted-foreground mt-1 font-mono">
                  {new Date(lastSignificantChange.timestamp).toLocaleDateString()}
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                {labels.noChange[language]}
              </p>
            )}
          </CardContent>
        </Card>
        
        {/* Signal clarity */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {labels.signalClarity[language]}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all"
                  style={{ width: `${systemStatus.clarity_score}%` }}
                />
              </div>
              <span className="font-mono text-sm">
                {systemStatus.clarity_score.toFixed(0)}%
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {language === 'sv'
                ? `Brus: ${systemStatus.noise_level}`
                : `Noise: ${systemStatus.noise_level}`}
            </p>
          </CardContent>
        </Card>
        
        {/* Data freshness */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {labels.dataFreshness[language]}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono">
                {systemStatus.data_freshness_hours}
              </span>
              <span className="text-sm text-muted-foreground">
                {labels.hours[language]}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {language === 'sv'
                ? 'Sedan senaste datauppdatering'
                : 'Since last data update'}
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent diagnostic codes */}
      {recentCodes.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {labels.recentCodes[language]}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentCodes.map((code) => (
                <div 
                  key={code.code}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <span 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: getSeverityColor(code.severity) }}
                    />
                    <span className="font-mono text-sm">
                      {formatDTCCode(code.code)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {language === 'sv' ? code.title_sv : code.title_en}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">
                    {code.confidence.toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default StatusOverview;
