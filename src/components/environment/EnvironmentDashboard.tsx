/**
 * GLOBAL ENVIRONMENT DASHBOARD
 * 
 * 10-15 core meters. No indices. No weighting.
 * Just observable, measurable environmental indicators.
 * 
 * Default: 1800 → today timeline
 */

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  ENVIRONMENT_INDICATORS, 
  getEnvironmentIndicators,
  type EnvironmentCoreIndicators,
  type DataQuality,
  type DataMode
} from '@/lib/environment';
import { CorrelationWarning } from './CorrelationWarning';
import { ModeIndicator } from './ModeIndicator';
import { Info, AlertTriangle, TrendingUp, TrendingDown, Minus, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface IndicatorValue {
  value: number;
  year: number;
  trend?: 'up' | 'down' | 'stable';
  trendPercent?: number;
  quality: DataQuality;
}

interface EnvironmentDashboardProps {
  data: Partial<Record<keyof EnvironmentCoreIndicators, IndicatorValue>>;
  mode: DataMode;
  onModeChange?: (mode: DataMode) => void;
  onIndicatorClick?: (indicatorId: keyof EnvironmentCoreIndicators) => void;
}

function IndicatorMeter({
  indicatorId,
  data,
  onClick
}: {
  indicatorId: keyof EnvironmentCoreIndicators;
  data?: IndicatorValue;
  onClick?: () => void;
}) {
  const meta = ENVIRONMENT_INDICATORS[indicatorId];
  
  const getTrendIcon = () => {
    if (!data?.trend) return <Minus className="w-4 h-4 text-muted-foreground" />;
    if (data.trend === 'up') return <TrendingUp className="w-4 h-4 text-chart-2" />;
    if (data.trend === 'down') return <TrendingDown className="w-4 h-4 text-destructive" />;
    return <Minus className="w-4 h-4 text-muted-foreground" />;
  };
  
  const getConfidenceColor = (confidence?: DataQuality['confidenceLevel']) => {
    switch (confidence) {
      case 'very_high': return 'bg-chart-2';
      case 'high': return 'bg-chart-2/70';
      case 'medium': return 'bg-warning';
      case 'low': return 'bg-destructive/70';
      case 'very_low': return 'bg-destructive';
      default: return 'bg-muted';
    }
  };

  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{meta.name}</p>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {meta.description}
            </p>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="p-1 text-muted-foreground hover:text-foreground min-w-[44px] min-h-[44px] flex items-center justify-center">
                  <Info className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="left" className="max-w-[300px]">
                <div className="space-y-2 text-sm">
                  <p><strong>Mätmetod:</strong> {meta.measurementMethod}</p>
                  <p><strong>Källa:</strong> {meta.primarySource}</p>
                  <p><strong>Uppdatering:</strong> {meta.updateFrequency}</p>
                  {meta.baseline && (
                    <p><strong>Baslinje:</strong> {meta.baseline.year} = {meta.baseline.value}</p>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        {data ? (
          <div className="space-y-3">
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-semibold tabular-nums">
                  {data.value.toLocaleString('sv-SE', { maximumFractionDigits: 2 })}
                </span>
                <span className="text-sm text-muted-foreground">{meta.unit}</span>
              </div>
              <div className="flex items-center gap-1">
                {getTrendIcon()}
                {data.trendPercent !== undefined && (
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {data.trendPercent > 0 ? '+' : ''}{data.trendPercent.toFixed(1)}%
                  </span>
                )}
              </div>
            </div>
            
            {/* Data quality indicator */}
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full ${getConfidenceColor(data.quality.confidenceLevel)}`}
                  style={{ 
                    width: data.quality.confidenceLevel === 'very_high' ? '100%' :
                           data.quality.confidenceLevel === 'high' ? '80%' :
                           data.quality.confidenceLevel === 'medium' ? '60%' :
                           data.quality.confidenceLevel === 'low' ? '40%' : '20%'
                  }}
                />
              </div>
              <span className="text-xs text-muted-foreground">
                {data.quality.confidenceLevel === 'very_high' ? 'Mycket hög' :
                 data.quality.confidenceLevel === 'high' ? 'Hög' :
                 data.quality.confidenceLevel === 'medium' ? 'Måttlig' :
                 data.quality.confidenceLevel === 'low' ? 'Låg' : 'Mycket låg'} konfidens
              </span>
            </div>
            
            {/* Last updated */}
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>Senast uppdaterad: {data.quality.lastUpdated}</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-muted-foreground py-4">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm">Data saknas</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function EnvironmentDashboard({
  data,
  mode,
  onModeChange,
  onIndicatorClick
}: EnvironmentDashboardProps) {
  const indicators = getEnvironmentIndicators();
  const availableCount = Object.keys(data).length;
  
  return (
    <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Global Environment Dashboard</h2>
            <p className="text-sm text-muted-foreground">
              {availableCount} av {indicators.length} indikatorer med data
            </p>
          </div>
          <Badge variant="outline" className="text-xs">
            1800 → idag
          </Badge>
        </div>
        
        {/* Mode selector */}
        <ModeIndicator 
          mode={mode} 
          onModeChange={onModeChange}
        />
      </div>

      {/* LOCKED correlation warning */}
      <CorrelationWarning language="sv" />

      {/* Indicator grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {indicators.map((indicatorId, index) => (
          <motion.div
            key={indicatorId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
          >
            <IndicatorMeter
              indicatorId={indicatorId}
              data={data[indicatorId]}
              onClick={() => onIndicatorClick?.(indicatorId)}
            />
          </motion.div>
        ))}
      </div>

      {/* What this shows / doesn't show */}
      <Card className="bg-muted/30">
        <CardContent className="py-4 space-y-3">
          <div>
            <p className="text-xs font-medium text-chart-2 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Detta visar:
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Globalt observerade miljöindikatorer baserat på mätstationer, satelliter och internationella statistikprogram.
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-destructive flex items-center gap-1">
              <Minus className="w-3 h-3" /> Detta visar INTE:
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Orsakssamband, framtida utveckling, eller vad som bör göras. 
              Regional variation kan avvika betydligt från globala medelvärden.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
