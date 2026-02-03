/**
 * LAMBDA PRIMARY GAUGE
 * 
 * Follows strict visualization rules:
 * - Horizontal line (NOT speedometer)
 * - Lambda = 1.0 marked with fixed neutral line
 * - NO animations suggesting "good" or "bad"
 * - Uncertainty MUST be shown
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Info, ExternalLink, ChevronRight } from 'lucide-react';
import {
  getLambdaColor,
  getLambdaStatus,
  formatLambdaValue,
  canShowLambda,
  type LambdaValueWithUncertainty,
} from '@/config/lambdaVisualizationRules';

interface LambdaGaugeProps {
  data: LambdaValueWithUncertainty;
  entityName: string;
  language?: 'sv' | 'en';
  showMethodLink?: boolean;
  onMethodClick?: () => void;
}

export const LambdaGauge: React.FC<LambdaGaugeProps> = ({
  data,
  entityName,
  language = 'sv',
  showMethodLink = true,
  onMethodClick,
}) => {
  // RULE: If uncertainty is missing, DO NOT show
  if (!canShowLambda(data)) {
    return (
      <Card className="border-destructive/30 bg-destructive/5">
        <CardContent className="pt-6 text-center">
          <p className="text-sm text-destructive">
            {language === 'sv' 
              ? 'Lambda kan inte visas: osäkerhetsdata saknas'
              : 'Lambda cannot be displayed: uncertainty data missing'}
          </p>
        </CardContent>
      </Card>
    );
  }

  const { value, uncertainty, confidence, dataCoverage } = data;
  
  // Calculate position on scale (0.7 to 1.3 range for display)
  const minScale = 0.7;
  const maxScale = 1.3;
  const position = ((value - minScale) / (maxScale - minScale)) * 100;
  const uncertaintyWidth = (uncertainty / (maxScale - minScale)) * 100;

  const statusColor = getLambdaColor(value);
  const statusText = getLambdaStatus(value, language);

  return (
    <Card>
      <CardContent className="pt-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold">{entityName}</h3>
            <Badge 
              variant="outline" 
              className="mt-1"
              style={{ borderColor: statusColor, color: statusColor }}
            >
              {statusText}
            </Badge>
          </div>
          <div className="text-right">
            <code className="text-2xl font-mono font-bold">
              {formatLambdaValue(data)}
            </code>
            <p className="text-xs text-muted-foreground mt-1">
              {language === 'sv' ? 'Konfidens' : 'Confidence'}: {(confidence * 100).toFixed(0)}%
            </p>
          </div>
        </div>

        {/* Horizontal Gauge */}
        <div className="relative h-12 mb-4">
          {/* Scale background with zones */}
          <div className="absolute inset-0 flex rounded-lg overflow-hidden">
            {/* Critical Low */}
            <div 
              className="h-full" 
              style={{ 
                width: `${((0.85 - minScale) / (maxScale - minScale)) * 100}%`,
                backgroundColor: 'hsl(0, 72%, 51%, 0.15)'
              }}
            />
            {/* Warning Low */}
            <div 
              className="h-full" 
              style={{ 
                width: `${((0.90 - 0.85) / (maxScale - minScale)) * 100}%`,
                backgroundColor: 'hsl(35, 92%, 50%, 0.15)'
              }}
            />
            {/* Stable */}
            <div 
              className="h-full" 
              style={{ 
                width: `${((1.10 - 0.90) / (maxScale - minScale)) * 100}%`,
                backgroundColor: 'hsl(var(--primary) / 0.15)'
              }}
            />
            {/* Warning High */}
            <div 
              className="h-full" 
              style={{ 
                width: `${((1.15 - 1.10) / (maxScale - minScale)) * 100}%`,
                backgroundColor: 'hsl(280, 70%, 55%, 0.15)'
              }}
            />
            {/* Critical High */}
            <div 
              className="h-full flex-1"
              style={{ 
                backgroundColor: 'hsl(280, 80%, 40%, 0.15)'
              }}
            />
          </div>

          {/* Lambda = 1.0 reference line */}
          <div 
            className="absolute top-0 bottom-0 w-0.5 bg-muted-foreground/50"
            style={{ 
              left: `${((1.0 - minScale) / (maxScale - minScale)) * 100}%` 
            }}
          />

          {/* Uncertainty band */}
          <div 
            className="absolute top-2 bottom-2 rounded opacity-30"
            style={{ 
              left: `${Math.max(0, position - uncertaintyWidth / 2)}%`,
              width: `${uncertaintyWidth}%`,
              backgroundColor: statusColor,
            }}
          />

          {/* Current value indicator */}
          <div 
            className="absolute top-1 bottom-1 w-1 rounded-full transition-all duration-300 ease-out"
            style={{ 
              left: `${position}%`,
              backgroundColor: statusColor,
              transform: 'translateX(-50%)'
            }}
          />

          {/* Scale labels */}
          <div className="absolute -bottom-5 left-0 text-xs text-muted-foreground font-mono">
            0.7
          </div>
          <div 
            className="absolute -bottom-5 text-xs text-muted-foreground font-mono"
            style={{ left: `${((1.0 - minScale) / (maxScale - minScale)) * 100}%`, transform: 'translateX(-50%)' }}
          >
            1.0
          </div>
          <div className="absolute -bottom-5 right-0 text-xs text-muted-foreground font-mono">
            1.3
          </div>
        </div>

        {/* Data coverage indicator */}
        <div className="mt-8 pt-4 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {language === 'sv' ? 'Datatäckning' : 'Data coverage'}
            </span>
            <span className="font-mono">{(dataCoverage * 100).toFixed(0)}%</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full mt-1 overflow-hidden">
            <div 
              className="h-full bg-primary/50 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${dataCoverage * 100}%` }}
            />
          </div>
        </div>

        {/* Method transparency link */}
        {showMethodLink && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full mt-4 text-muted-foreground"
            onClick={onMethodClick}
          >
            <Info className="h-4 w-4 mr-2" />
            {language === 'sv' ? 'Hur detta beräknas' : 'How this is calculated'}
            <ChevronRight className="h-4 w-4 ml-auto" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default LambdaGauge;
