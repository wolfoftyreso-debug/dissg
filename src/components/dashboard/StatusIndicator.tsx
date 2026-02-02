/**
 * StatusIndicator — Visuell komponent för röd/gul/grön-status
 * 
 * Visar status med:
 * - Färgkodad cirkel eller badge
 * - Konfidensindikator
 * - Tooltip med matematisk motivering
 */

import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, XCircle, HelpCircle } from 'lucide-react';
import type { AnalysisResult } from '@/config/analysisRulesEngine';

interface StatusIndicatorProps {
  result: AnalysisResult;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  showConfidence?: boolean;
  showFormula?: boolean;
  className?: string;
}

const SIZE_CLASSES = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-6 w-6'
} as const;

const ICON_SIZE = {
  sm: 12,
  md: 16,
  lg: 20
} as const;

const STATUS_CONFIG = {
  green: {
    bgClass: 'bg-status-positive',
    textClass: 'text-status-positive',
    borderClass: 'border-status-positive',
    Icon: CheckCircle,
    label: 'Positivt'
  },
  yellow: {
    bgClass: 'bg-status-warning',
    textClass: 'text-status-warning',
    borderClass: 'border-status-warning',
    Icon: AlertTriangle,
    label: 'Varning'
  },
  red: {
    bgClass: 'bg-status-critical',
    textClass: 'text-status-critical',
    borderClass: 'border-status-critical',
    Icon: XCircle,
    label: 'Kritiskt'
  },
  neutral: {
    bgClass: 'bg-muted',
    textClass: 'text-muted-foreground',
    borderClass: 'border-muted',
    Icon: HelpCircle,
    label: 'Neutral'
  }
} as const;

export function StatusIndicator({
  result,
  size = 'md',
  showLabel = false,
  showConfidence = false,
  showFormula = false,
  className
}: StatusIndicatorProps) {
  const config = STATUS_CONFIG[result.statusColor];
  const Icon = config.Icon;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn('inline-flex items-center gap-2', className)}>
            {/* Status-cirkel */}
            <div className={cn(
              'rounded-full flex items-center justify-center',
              SIZE_CLASSES[size],
              config.bgClass
            )}>
              <Icon 
                size={ICON_SIZE[size]} 
                className="text-white" 
                strokeWidth={2.5}
              />
            </div>

            {/* Label */}
            {showLabel && (
              <span className={cn('font-medium', config.textClass)}>
                {config.label}
              </span>
            )}

            {/* Konfidensindikator */}
            {showConfidence && (
              <ConfidenceMeter 
                confidence={result.confidence} 
                level={result.confidenceLevel}
                size={size}
              />
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-sm">
          <div className="space-y-2">
            <div className="font-semibold">{config.label}</div>
            <p className="text-sm text-muted-foreground">{result.explanation}</p>
            
            {showFormula && (
              <div className="mt-2 p-2 bg-muted rounded text-xs font-mono">
                {result.formula}
              </div>
            )}
            
            <div className="flex items-center gap-2 text-xs">
              <span>Konfidens:</span>
              <Badge variant="outline" className="text-xs">
                {(result.confidence * 100).toFixed(0)}% ({result.confidenceLevel})
              </Badge>
            </div>
            
            {result.appliedRules.length > 0 && (
              <div className="text-xs text-muted-foreground">
                Regler: {result.appliedRules.join(', ')}
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Konfidensindikator
interface ConfidenceMeterProps {
  confidence: number;
  level: 'high' | 'medium' | 'low' | 'insufficient';
  size: 'sm' | 'md' | 'lg';
}

function ConfidenceMeter({ confidence, level, size }: ConfidenceMeterProps) {
  const widths = {
    sm: 'w-12',
    md: 'w-16',
    lg: 'w-20'
  };

  const heights = {
    sm: 'h-1',
    md: 'h-1.5',
    lg: 'h-2'
  };

  const levelColors = {
    high: 'bg-status-positive',
    medium: 'bg-status-warning',
    low: 'bg-orange-500',
    insufficient: 'bg-muted-foreground'
  };

  return (
    <div className="flex items-center gap-1">
      <div className={cn('bg-muted rounded-full overflow-hidden', widths[size], heights[size])}>
        <div 
          className={cn('h-full transition-all', levelColors[level])}
          style={{ width: `${confidence * 100}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground font-mono">
        {(confidence * 100).toFixed(0)}%
      </span>
    </div>
  );
}

// Badge variant för status
interface StatusBadgeProps {
  result: AnalysisResult;
  showScore?: boolean;
  className?: string;
}

export function StatusBadge({ result, showScore = false, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[result.statusColor];
  
  return (
    <Badge 
      variant="outline"
      className={cn(
        'font-medium border-2',
        config.borderClass,
        config.textClass,
        className
      )}
    >
      <config.Icon size={12} className="mr-1" />
      {config.label}
      {showScore && (
        <span className="ml-1 font-mono">({result.score})</span>
      )}
    </Badge>
  );
}

// Kompakt status för tabeller
interface CompactStatusProps {
  statusColor: 'green' | 'yellow' | 'red' | 'neutral';
  tooltip?: string;
}

export function CompactStatus({ statusColor, tooltip }: CompactStatusProps) {
  const config = STATUS_CONFIG[statusColor];
  
  const indicator = (
    <div className={cn(
      'h-2 w-2 rounded-full',
      config.bgClass
    )} />
  );

  if (tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{indicator}</TooltipTrigger>
          <TooltipContent>{tooltip}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return indicator;
}

// Score-display
interface ScoreDisplayProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function ScoreDisplay({ score, size = 'md', showLabel = true }: ScoreDisplayProps) {
  let color: string;
  if (score >= 75) color = 'text-status-positive';
  else if (score >= 50) color = 'text-status-warning';
  else color = 'text-status-critical';

  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl'
  };

  return (
    <div className="flex flex-col items-center">
      <span className={cn('font-bold font-mono', sizeClasses[size], color)}>
        {score}
      </span>
      {showLabel && (
        <span className="text-xs text-muted-foreground">av 100</span>
      )}
    </div>
  );
}
