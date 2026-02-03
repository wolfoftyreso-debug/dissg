/**
 * CLICKABLE DATA POINT
 * ═══════════════════════════════════════════════════════════════
 * 
 * Wraps ANY data value to make it clickable with infinite depth.
 * Every number, percentage, label, or metric becomes a portal
 * to deeper understanding.
 * 
 * Spotless Protocol: Nothing is shown that cannot be explored.
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight, Info, TrendingUp, TrendingDown, Minus, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useInfiniteDepth, DataPoint } from './InfiniteDepthProvider';

// =============================================================================
// TYPES
// =============================================================================

interface ClickableDataPointProps {
  /** The data point with full depth information */
  dataPoint: DataPoint;
  
  /** Display variant */
  variant?: 'inline' | 'card' | 'compact' | 'hero';
  
  /** Show trend indicator if available */
  showTrend?: boolean;
  
  /** Trend direction */
  trend?: 'up' | 'down' | 'stable';
  
  /** Trend value (percentage change) */
  trendValue?: number;
  
  /** Custom className */
  className?: string;
  
  /** Size variant */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  
  /** Show confidence indicator */
  showConfidence?: boolean;
  
  /** Override click behavior */
  onClick?: () => void;
  
  /** Disable interaction */
  disabled?: boolean;
}

// =============================================================================
// COMPONENT
// =============================================================================

export const ClickableDataPoint: React.FC<ClickableDataPointProps> = ({
  dataPoint,
  variant = 'inline',
  showTrend = false,
  trend,
  trendValue,
  className,
  size = 'md',
  showConfidence = false,
  onClick,
  disabled = false,
}) => {
  const { openDepth } = useInfiniteDepth();
  
  const handleClick = () => {
    if (disabled) return;
    if (onClick) {
      onClick();
    } else {
      openDepth(dataPoint, 1);
    }
  };
  
  const formatValue = (value: string | number, type: DataPoint['type'], unit?: string) => {
    if (typeof value === 'number') {
      switch (type) {
        case 'percentage':
          return `${value.toFixed(1)}%`;
        case 'currency':
          return new Intl.NumberFormat('sv-SE', { 
            style: 'currency', 
            currency: unit || 'SEK',
            maximumFractionDigits: 0
          }).format(value);
        case 'index':
          return value.toFixed(2);
        case 'ratio':
          return value.toFixed(3);
        default:
          return new Intl.NumberFormat('sv-SE').format(value);
      }
    }
    return value;
  };
  
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-muted-foreground';
  
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-2xl font-bold',
  };
  
  const hasDepth = dataPoint.depth && dataPoint.depth.length > 0;
  
  // Compact inline variant
  if (variant === 'compact') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={handleClick}
              disabled={disabled || !hasDepth}
              className={cn(
                'inline-flex items-center gap-1 font-mono transition-all',
                'hover:text-primary hover:underline underline-offset-2',
                'focus:outline-none focus:ring-2 focus:ring-primary/20 rounded',
                'cursor-pointer',
                disabled && 'cursor-not-allowed opacity-50',
                sizeClasses[size],
                className
              )}
            >
              <span>{formatValue(dataPoint.value, dataPoint.type, dataPoint.unit)}</span>
              {dataPoint.unit && dataPoint.type !== 'percentage' && dataPoint.type !== 'currency' && (
                <span className="text-muted-foreground text-xs">{dataPoint.unit}</span>
              )}
              {hasDepth && <ChevronRight className="h-3 w-3 text-muted-foreground" />}
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            <div className="space-y-1">
              <p className="font-medium">{dataPoint.label}</p>
              {dataPoint.depth[0]?.content && (
                <p className="text-xs text-muted-foreground">{dataPoint.depth[0].content}</p>
              )}
              {hasDepth && (
                <p className="text-xs text-primary">Klicka för att fördjupa →</p>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  // Inline variant (default)
  if (variant === 'inline') {
    return (
      <button
        onClick={handleClick}
        disabled={disabled || !hasDepth}
        className={cn(
          'inline-flex items-center gap-1.5 group transition-all',
          'hover:bg-primary/5 rounded px-1 -mx-1',
          'focus:outline-none focus:ring-2 focus:ring-primary/20',
          'cursor-pointer',
          disabled && 'cursor-not-allowed opacity-50',
          className
        )}
      >
        <span className={cn('font-medium', sizeClasses[size])}>
          {formatValue(dataPoint.value, dataPoint.type, dataPoint.unit)}
        </span>
        {dataPoint.unit && dataPoint.type !== 'percentage' && dataPoint.type !== 'currency' && (
          <span className="text-muted-foreground text-xs">{dataPoint.unit}</span>
        )}
        {showTrend && trend && (
          <span className={cn('flex items-center gap-0.5 text-xs', trendColor)}>
            <TrendIcon className="h-3 w-3" />
            {trendValue !== undefined && (
              <span>{trendValue > 0 ? '+' : ''}{trendValue.toFixed(1)}%</span>
            )}
          </span>
        )}
        {hasDepth && (
          <Info className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </button>
    );
  }
  
  // Card variant
  if (variant === 'card') {
    return (
      <button
        onClick={handleClick}
        disabled={disabled || !hasDepth}
        className={cn(
          'flex flex-col items-start p-4 rounded-lg border transition-all w-full text-left',
          'hover:border-primary/50 hover:bg-primary/5',
          'focus:outline-none focus:ring-2 focus:ring-primary/20',
          'group cursor-pointer',
          disabled && 'cursor-not-allowed opacity-50',
          className
        )}
      >
        <div className="flex items-center justify-between w-full mb-2">
          <span className="text-sm text-muted-foreground">{dataPoint.label}</span>
          {hasDepth && (
            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          )}
        </div>
        
        <div className="flex items-baseline gap-2">
          <span className={cn('font-bold', sizeClasses[size === 'sm' ? 'md' : size === 'md' ? 'lg' : 'xl'])}>
            {formatValue(dataPoint.value, dataPoint.type, dataPoint.unit)}
          </span>
          {dataPoint.unit && dataPoint.type !== 'percentage' && dataPoint.type !== 'currency' && (
            <span className="text-muted-foreground text-sm">{dataPoint.unit}</span>
          )}
        </div>
        
        {showTrend && trend && (
          <div className={cn('flex items-center gap-1 mt-2 text-sm', trendColor)}>
            <TrendIcon className="h-4 w-4" />
            <span>
              {trendValue !== undefined && (
                <>{trendValue > 0 ? '+' : ''}{trendValue.toFixed(1)}% </>
              )}
              {trend === 'up' ? 'ökning' : trend === 'down' ? 'minskning' : 'oförändrat'}
            </span>
          </div>
        )}
        
        {showConfidence && dataPoint.confidence !== undefined && (
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-muted-foreground">Konfidens:</span>
            <Badge variant={dataPoint.confidence > 0.8 ? 'default' : dataPoint.confidence > 0.5 ? 'secondary' : 'destructive'}>
              {(dataPoint.confidence * 100).toFixed(0)}%
            </Badge>
          </div>
        )}
        
        {dataPoint.evidenceLink && (
          <div className="flex items-center gap-1 mt-2 text-xs text-primary">
            <ExternalLink className="h-3 w-3" />
            <span className="font-mono">{dataPoint.evidenceLink}</span>
          </div>
        )}
      </button>
    );
  }
  
  // Hero variant (large display)
  if (variant === 'hero') {
    return (
      <button
        onClick={handleClick}
        disabled={disabled || !hasDepth}
        className={cn(
          'flex flex-col items-center justify-center p-8 rounded-xl transition-all',
          'hover:scale-[1.02] hover:shadow-lg',
          'focus:outline-none focus:ring-2 focus:ring-primary/20',
          'bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20',
          'group cursor-pointer',
          disabled && 'cursor-not-allowed opacity-50',
          className
        )}
      >
        <span className="text-sm text-muted-foreground mb-2">{dataPoint.label}</span>
        
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-bold tracking-tight">
            {formatValue(dataPoint.value, dataPoint.type, dataPoint.unit)}
          </span>
          {dataPoint.unit && dataPoint.type !== 'percentage' && dataPoint.type !== 'currency' && (
            <span className="text-xl text-muted-foreground">{dataPoint.unit}</span>
          )}
        </div>
        
        {showTrend && trend && (
          <div className={cn('flex items-center gap-2 mt-4 text-lg', trendColor)}>
            <TrendIcon className="h-5 w-5" />
            <span>
              {trendValue !== undefined && (
                <>{trendValue > 0 ? '+' : ''}{trendValue.toFixed(1)}%</>
              )}
            </span>
          </div>
        )}
        
        {hasDepth && (
          <div className="flex items-center gap-1 mt-4 text-sm text-muted-foreground group-hover:text-primary transition-colors">
            <span>Klicka för att fördjupa</span>
            <ChevronRight className="h-4 w-4" />
          </div>
        )}
      </button>
    );
  }
  
  return null;
};

export default ClickableDataPoint;
