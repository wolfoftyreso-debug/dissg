/**
 * LAMBDA SYSTEM INDEX DASHBOARD
 * 
 * The primary display for Lambda 1.0 - the civilization balance index.
 * λ ≈ 1.0 = System in balance
 * λ < 1.0 = Inefficiency/underperformance
 * λ > 1.0 = Resource stress/overheating
 * 
 * Design: ECU display - no decoration, pure instrumentation.
 * NO ICONS - text only.
 */

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  getLambdaBand,
  interpretLambda,
  LAMBDA_BANDS,
} from '@/lib/lambda/lambda-calculator';
import type { LambdaCalculation } from '@/lib/lambda/index-types';

interface LambdaSystemDashboardProps {
  calculation: LambdaCalculation;
  language?: 'sv' | 'en';
  onIndicatorClick?: (code: string) => void;
  className?: string;
}

export function LambdaSystemDashboard({
  calculation,
  language = 'sv',
  onIndicatorClick,
  className,
}: LambdaSystemDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'sensors' | 'bands'>('overview');
  
  const band = getLambdaBand(calculation.lambda);
  const _interpretation = interpretLambda(calculation.lambda);
  
  const labels = {
    systemIndex: { sv: 'LAMBDA SYSTEMINDEX', en: 'LAMBDA SYSTEM INDEX' },
    overview: { sv: 'Översikt', en: 'Overview' },
    sensors: { sv: 'Sensorer', en: 'Sensors' },
    bands: { sv: 'Toleransband', en: 'Tolerance Bands' },
    trend: { sv: 'Trend', en: 'Trend' },
    coverage: { sv: 'Datatäckning', en: 'Data Coverage' },
    methodology: { sv: 'Metodversion', en: 'Methodology Version' },
    uncertainty: { sv: 'Osäkerhetsintervall', en: 'Uncertainty Interval' },
    primaryDrivers: { sv: 'Primära drivare', en: 'Primary Drivers' },
    historicalComparison: { sv: 'Historisk jämförelse', en: 'Historical Comparison' },
    oneYearAgo: { sv: '1 år sedan', en: '1 year ago' },
    fiveYearsAgo: { sv: '5 år sedan', en: '5 years ago' },
    similarStates: { sv: 'Liknande historiska tillstånd', en: 'Similar Historical States' },
  };
  
  return (
    <div className={cn('space-y-6', className)}>
      {/* Primary Lambda Display */}
      <Card className="border-2" style={{ borderColor: band.color }}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="font-mono text-sm tracking-wider">
              {labels.systemIndex[language]}
            </CardTitle>
            <Badge variant="outline" className="font-mono text-xs">
              {calculation.geo_code} | {calculation.period}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            {/* Main Lambda Value */}
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-xs text-muted-foreground font-mono">λ =</span>
                <span 
                  className="text-6xl font-mono font-bold tracking-tighter"
                  style={{ color: band.color }}
                >
                  {calculation.lambda.toFixed(3)}
                </span>
              </div>
              
              {/* Uncertainty interval */}
              <p className="text-sm text-muted-foreground font-mono">
                ±{((calculation.confidence_interval.upper - calculation.confidence_interval.lower) / 2).toFixed(3)}
              </p>
              
              {/* Band label */}
              <Badge 
                variant="secondary"
                className="font-mono text-xs"
                style={{ backgroundColor: `${band.color}20`, color: band.color }}
              >
                {language === 'sv' ? band.label_sv : band.label_en}
              </Badge>
            </div>
            
            {/* Quick Stats */}
            <div className="text-right space-y-2">
              {/* Trend */}
              <div className="text-sm">
                <span className="text-muted-foreground">{labels.trend[language]}: </span>
                <span className={cn(
                  'font-mono font-medium',
                  calculation.trend === 'improving' && 'text-blue-500',
                  calculation.trend === 'declining' && 'text-amber-500',
                  calculation.trend === 'stable' && 'text-muted-foreground'
                )}>
                  {calculation.trend === 'improving' ? '↑' : calculation.trend === 'declining' ? '↓' : '→'}
                  {' '}
                  {calculation.trend === 'improving' 
                    ? (language === 'sv' ? 'Förbättring' : 'Improving')
                    : calculation.trend === 'declining' 
                      ? (language === 'sv' ? 'Försämring' : 'Declining')
                      : (language === 'sv' ? 'Stabil' : 'Stable')
                  }
                </span>
              </div>
              
              {/* Coverage */}
              <div className="text-sm">
                <span className="text-muted-foreground">{labels.coverage[language]}: </span>
                <span className="font-mono font-medium">
                  {(calculation.data_coverage * 100).toFixed(0)}%
                </span>
              </div>
              
              {/* Methodology */}
              <div className="text-xs text-muted-foreground font-mono">
                v{calculation.methodology_version}
              </div>
            </div>
          </div>
          
          {/* Band description */}
          <p className="mt-4 text-sm text-muted-foreground">
            {band.description_sv}
          </p>
        </CardContent>
      </Card>
      
      {/* Detailed Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="overview" className="font-mono text-xs">
            {labels.overview[language]}
          </TabsTrigger>
          <TabsTrigger value="sensors" className="font-mono text-xs">
            {labels.sensors[language]}
          </TabsTrigger>
          <TabsTrigger value="bands" className="font-mono text-xs">
            {labels.bands[language]}
          </TabsTrigger>
        </TabsList>
        
        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="mt-4 space-y-4">
          {/* Primary Drivers */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                {labels.primaryDrivers[language]}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {calculation.sensor_readings
                .filter(r => r.is_primary_driver)
                .sort((a, b) => a.rank_among_drivers - b.rank_among_drivers)
                .map((reading) => (
                  <button
                    key={reading.index_code}
                    onClick={() => onIndicatorClick?.(reading.index_code)}
                    className="w-full flex items-center justify-between p-2 rounded hover:bg-muted/50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-mono font-bold">
                        {reading.rank_among_drivers}
                      </span>
                      <span className="font-mono text-sm">{reading.index_code}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={cn(
                        'text-sm font-mono',
                        reading.deviation > 0.05 && 'text-amber-500',
                        reading.deviation < -0.05 && 'text-blue-500',
                      )}>
                        {reading.deviation > 0 ? '+' : ''}{(reading.deviation * 100).toFixed(1)}%
                      </span>
                      <span className="text-xs text-muted-foreground">→</span>
                    </div>
                  </button>
                ))}
            </CardContent>
          </Card>
          
          {/* Historical Comparison */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                {labels.historicalComparison[language]}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded bg-muted/50">
                  <p className="text-xs text-muted-foreground">{labels.oneYearAgo[language]}</p>
                  <p className="text-lg font-mono font-bold">
                    {calculation.lambda_1y_ago?.toFixed(3) ?? '—'}
                  </p>
                  {calculation.lambda_1y_ago && (
                    <p className={cn(
                      'text-xs font-mono',
                      calculation.lambda > calculation.lambda_1y_ago ? 'text-amber-500' : 'text-blue-500'
                    )}>
                      {calculation.lambda > calculation.lambda_1y_ago ? '+' : ''}
                      {((calculation.lambda - calculation.lambda_1y_ago) * 100).toFixed(1)}%
                    </p>
                  )}
                </div>
                <div className="p-3 rounded bg-muted/50">
                  <p className="text-xs text-muted-foreground">{labels.fiveYearsAgo[language]}</p>
                  <p className="text-lg font-mono font-bold">
                    {calculation.lambda_5y_ago?.toFixed(3) ?? '—'}
                  </p>
                  {calculation.lambda_5y_ago && (
                    <p className={cn(
                      'text-xs font-mono',
                      calculation.lambda > calculation.lambda_5y_ago ? 'text-amber-500' : 'text-blue-500'
                    )}>
                      {calculation.lambda > calculation.lambda_5y_ago ? '+' : ''}
                      {((calculation.lambda - calculation.lambda_5y_ago) * 100).toFixed(1)}%
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Similar Historical States */}
          {calculation.similar_historical_states.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  {labels.similarStates[language]}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {calculation.similar_historical_states.map((state, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded bg-muted/30 text-sm">
                    <span className="font-mono">{state.geo_code} | {state.period}</span>
                    <span className="font-mono">λ={state.lambda.toFixed(3)}</span>
                    <span className="text-xs text-muted-foreground max-w-[200px] truncate">
                      {state.what_followed}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        {/* SENSORS TAB */}
        <TabsContent value="sensors" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                {language === 'sv' ? 'Alla sensorer' : 'All Sensors'} ({calculation.sensor_readings.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {calculation.sensor_readings
                  .sort((a, b) => Math.abs(b.deviation) - Math.abs(a.deviation))
                  .map((reading) => (
                    <button
                      key={reading.index_code}
                      onClick={() => onIndicatorClick?.(reading.index_code)}
                      className="w-full flex items-center justify-between p-2 rounded hover:bg-muted/50 transition-colors text-left border-b border-muted last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs w-24">{reading.index_code}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            {reading.current_value.toFixed(1)}
                          </span>
                          <span className="text-xs text-muted-foreground">/</span>
                          <span className="text-xs text-muted-foreground">
                            {reading.optimal_value.toFixed(1)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {/* Deviation bar */}
                        <div className="w-24 h-2 bg-muted rounded overflow-hidden relative">
                          <div className="absolute inset-y-0 left-1/2 w-px bg-foreground/20" />
                          <div 
                            className={cn(
                              'absolute inset-y-0',
                              reading.deviation > 0 ? 'left-1/2' : 'right-1/2',
                            )}
                            style={{
                              width: `${Math.min(Math.abs(reading.deviation) * 50, 50)}%`,
                              backgroundColor: reading.deviation > 0.05 
                                ? '#f59e0b' 
                                : reading.deviation < -0.05 
                                  ? '#3b82f6' 
                                  : '#6b7280',
                            }}
                          />
                        </div>
                        <span className={cn(
                          'text-xs font-mono w-12 text-right',
                          reading.deviation > 0.05 && 'text-amber-500',
                          reading.deviation < -0.05 && 'text-blue-500',
                        )}>
                          {reading.deviation > 0 ? '+' : ''}{(reading.deviation * 100).toFixed(0)}%
                        </span>
                      </div>
                    </button>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* BANDS TAB */}
        <TabsContent value="bands" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                {language === 'sv' ? 'Lambda toleransband' : 'Lambda Tolerance Bands'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {LAMBDA_BANDS.map((b) => {
                const isActive = calculation.lambda >= b.min && calculation.lambda < b.max;
                return (
                  <div 
                    key={b.min}
                    className={cn(
                      'flex items-center justify-between p-3 rounded border-2 transition-colors',
                      isActive ? 'border-current' : 'border-transparent bg-muted/30'
                    )}
                    style={{ 
                      borderColor: isActive ? b.color : undefined,
                      backgroundColor: isActive ? `${b.color}10` : undefined,
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: b.color }}
                      />
                      <div>
                        <p className="text-sm font-medium">
                          {language === 'sv' ? b.label_sv : b.label_en}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {b.description_sv}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono text-sm text-muted-foreground">
                      {b.min.toFixed(2)} – {b.max.toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Footer */}
      <div className="text-xs text-muted-foreground space-y-1 border-t pt-4">
        <p>
          {language === 'sv' 
            ? 'Lambda 1.0 är ett dimensionslöst balansmått. Det mäter systemets funktionsläge, inte dess "kvalitet".'
            : 'Lambda 1.0 is a dimensionless balance measure. It measures system functional state, not its "quality".'}
        </p>
        <p className="font-mono text-[10px]">
          {language === 'sv' ? 'Beräknat' : 'Calculated'}: {calculation.calculated_at}
        </p>
      </div>
    </div>
  );
}

export default LambdaSystemDashboard;
