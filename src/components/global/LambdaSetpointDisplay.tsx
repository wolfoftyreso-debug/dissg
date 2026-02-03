/**
 * LAMBDA 1.0 – GLOBAL REALITY SETPOINT DISPLAY
 * 
 * Visual representation of Lambda values at any level.
 * Like an ECU dashboard for society.
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  AlertTriangle,
  CheckCircle2,
  Info,
  Gauge
} from 'lucide-react';
import {
  LAMBDA_DEFINITION,
  LAMBDA_LEVELS,
  interpretLambda,
  formatLambda,
  getSensorCategoryWeights,
  type LambdaLevel,
  type LambdaSensorCategory,
} from '@/config/lambdaSetpointConfig';

interface LambdaSetpointDisplayProps {
  value: number;
  level: LambdaLevel;
  entityName: string;
  previousValue?: number;
  dataCoverage?: number;
  uncertainty?: number;
  primaryStressors?: string[];
  showDefinition?: boolean;
}

export const LambdaSetpointDisplay: React.FC<LambdaSetpointDisplayProps> = ({
  value,
  level,
  entityName,
  previousValue,
  dataCoverage = 0.85,
  uncertainty = 0.03,
  primaryStressors = [],
  showDefinition = false,
}) => {
  const interpretation = interpretLambda(value);
  const levelInfo = LAMBDA_LEVELS[level];
  const trend = previousValue ? value - previousValue : 0;
  
  // Calculate gauge position (0-100 for visual representation)
  // Lambda 0.5 = 0%, Lambda 1.0 = 50%, Lambda 1.5 = 100%
  const gaugePosition = Math.max(0, Math.min(100, ((value - 0.5) / 1.0) * 100));
  
  const getStatusColor = () => {
    switch (interpretation.color) {
      case 'emerald': return 'text-primary bg-primary/10';
      case 'amber': return 'text-secondary-foreground bg-secondary';
      case 'red': return 'text-destructive bg-destructive/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };
  
  const _getProgressColor = () => {
    switch (interpretation.color) {
      case 'emerald': return 'bg-emerald-500';
      case 'amber': return 'bg-amber-500';
      case 'red': return 'bg-red-500';
      default: return 'bg-primary';
    }
  };

  return (
    <Card className="border-2">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${getStatusColor()}`}>
              <Gauge className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                {levelInfo.emoji} {entityName}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{levelInfo.name}</p>
            </div>
          </div>
          <Badge variant="outline" className={getStatusColor()}>
            {interpretation.label}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Main Lambda Value */}
        <div className="text-center py-6 bg-muted/30 rounded-lg">
          <div className="text-5xl font-mono font-bold tracking-tight">
            {formatLambda(value)}
          </div>
          <div className="flex items-center justify-center gap-2 mt-2 text-sm text-muted-foreground">
            {trend > 0 && (
              <span className="flex items-center text-emerald-500">
                <TrendingUp className="h-4 w-4 mr-1" />
                +{trend.toFixed(3)}
              </span>
            )}
            {trend < 0 && (
              <span className="flex items-center text-red-500">
                <TrendingDown className="h-4 w-4 mr-1" />
                {trend.toFixed(3)}
              </span>
            )}
            {trend === 0 && previousValue && (
              <span className="flex items-center">
                <Minus className="h-4 w-4 mr-1" />
                Unchanged
              </span>
            )}
            <span className="text-muted-foreground/60">|</span>
            <span>±{(uncertainty * 100).toFixed(1)}% uncertainty</span>
          </div>
        </div>
        
        {/* Lambda Gauge Visualization */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>System Overload</span>
            <span>Optimal (1.0)</span>
            <span>Resource Strain</span>
          </div>
          <div className="relative h-4 bg-gradient-to-r from-red-500 via-emerald-500 to-red-500 rounded-full overflow-hidden">
            <div 
              className="absolute top-0 bottom-0 w-1 bg-white shadow-lg border border-black/20"
              style={{ left: `${gaugePosition}%`, transform: 'translateX(-50%)' }}
            />
          </div>
          <div className="flex justify-between text-xs font-mono text-muted-foreground">
            <span>0.50</span>
            <span>0.75</span>
            <span>1.00</span>
            <span>1.25</span>
            <span>1.50</span>
          </div>
        </div>
        
        {/* Data Quality Indicators */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Data Coverage</span>
              <span className="font-mono">{(dataCoverage * 100).toFixed(0)}%</span>
            </div>
            <Progress value={dataCoverage * 100} className="h-2" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Confidence</span>
              <span className="font-mono">{((1 - uncertainty) * 100).toFixed(0)}%</span>
            </div>
            <Progress value={(1 - uncertainty) * 100} className="h-2" />
          </div>
        </div>
        
        {/* Primary Stressors */}
        {primaryStressors.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Primary Stress Factors
            </div>
            <div className="flex flex-wrap gap-2">
              {primaryStressors.map((stressor) => (
                <Badge key={stressor} variant="secondary" className="text-xs">
                  {stressor}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {/* Definition Panel */}
        {showDefinition && (
          <>
            <Separator />
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 mt-0.5 text-blue-500" />
                <div>
                  <p className="font-medium">What Lambda 1.0 Means</p>
                  <p className="text-muted-foreground text-xs mt-1">
                    {LAMBDA_DEFINITION.formalDefinition.en}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-xs font-medium text-emerald-600 mb-2 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    What Lambda IS
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {LAMBDA_DEFINITION.whatLambdaIs.slice(0, 3).map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-medium text-red-600 mb-2 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    What Lambda is NOT
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {LAMBDA_DEFINITION.whatLambdaIsNot.slice(0, 3).map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

/**
 * Compact Lambda Badge for inline display
 */
export const LambdaBadge: React.FC<{ value: number; showTrend?: boolean; previousValue?: number }> = ({
  value,
  showTrend = false,
  previousValue,
}) => {
  const interpretation = interpretLambda(value);
  const trend = previousValue ? value - previousValue : 0;
  
  const getBadgeVariant = () => {
    switch (interpretation.color) {
      case 'emerald': return 'default';
      case 'amber': return 'secondary';
      case 'red': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <Badge variant={getBadgeVariant()} className="font-mono gap-1">
      <Activity className="h-3 w-3" />
      {formatLambda(value)}
      {showTrend && previousValue && (
        <>
          {trend > 0 && <TrendingUp className="h-3 w-3 ml-1" />}
          {trend < 0 && <TrendingDown className="h-3 w-3 ml-1" />}
        </>
      )}
    </Badge>
  );
};

/**
 * Sensor Category Breakdown
 */
export const LambdaSensorBreakdown: React.FC<{
  readings?: Record<LambdaSensorCategory, { value: number; contribution: number }>;
}> = ({ readings }) => {
  const _categoryWeights = getSensorCategoryWeights();
  
  // Mock readings if not provided
  const sensorReadings = readings || {
    health: { value: 1.02, contribution: 0.18 },
    economy: { value: 0.94, contribution: 0.15 },
    labor: { value: 0.88, contribution: 0.14 },
    housing: { value: 0.82, contribution: 0.08 },
    energy: { value: 1.05, contribution: 0.05 },
    education: { value: 0.98, contribution: 0.07 },
    safety: { value: 0.91, contribution: 0.06 },
    governance: { value: 0.95, contribution: 0.08 },
    environment: { value: 1.08, contribution: 0.07 },
    demographics: { value: 0.96, contribution: 0.09 },
  };

  const categoryEmojis: Record<LambdaSensorCategory, string> = {
    health: '🏥',
    economy: '💰',
    labor: '👷',
    housing: '🏠',
    energy: '⚡',
    education: '📚',
    safety: '🛡️',
    governance: '🏛️',
    environment: '🌿',
    demographics: '👥',
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Activity className="h-4 w-4" />
          Sensor Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Object.entries(sensorReadings).map(([category, data]) => {
            const interpretation = interpretLambda(data.value);
            return (
              <div key={category} className="flex items-center gap-3">
                <span className="text-lg">{categoryEmojis[category as LambdaSensorCategory]}</span>
                <div className="flex-1">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize">{category}</span>
                    <span className="font-mono text-xs text-muted-foreground">
                      λ {data.value.toFixed(2)}
                    </span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden mt-1">
                    <div 
                      className={`h-full transition-all ${
                        interpretation.color === 'emerald' ? 'bg-emerald-500' :
                        interpretation.color === 'amber' ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(100, data.value * 50)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
