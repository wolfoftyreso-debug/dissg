/**
 * INDEX CARD COMPONENT
 * 
 * Displays a single index with drill-down capability.
 * 
 * Structure:
 * - Headline (value)
 * - Trend indicator
 * - Click to drill down
 * - Source attribution
 */

import { ChevronRight, TrendingUp, TrendingDown, Minus, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { IndexValue, IndexCode } from '@/lib/lambda/index-types';
import { getIndexDefinition } from '@/lib/lambda/index-registry';

interface IndexCardProps {
  indexCode: IndexCode;
  value: IndexValue;
  onClick?: () => void;
  showDrillDown?: boolean;
  compact?: boolean;
  language?: 'sv' | 'en';
  className?: string;
}

export function IndexCard({
  indexCode,
  value,
  onClick,
  showDrillDown = true,
  compact = false,
  language = 'sv',
  className,
}: IndexCardProps) {
  const definition = getIndexDefinition(indexCode);
  
  if (!definition) {
    return null;
  }
  
  const name = language === 'sv' ? definition.name_sv : definition.name_en;
  
  // Trend icon and color (neutral colors)
  const TrendIcon = value.trend_direction === 'improving' 
    ? TrendingUp 
    : value.trend_direction === 'declining' 
    ? TrendingDown 
    : Minus;
  
  // Using neutral colors: blue for change, gray for stable
  const trendColor = value.trend_direction === 'improving' 
    ? 'text-blue-500'
    : value.trend_direction === 'declining'
    ? 'text-orange-500'
    : 'text-muted-foreground';
  
  // Data quality indicator
  const hasQualityWarning = value.data_coverage < 0.7 || value.source_count < 2;
  
  if (compact) {
    return (
      <div 
        className={cn(
          'flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer',
          className
        )}
        onClick={onClick}
      >
        <div className="flex items-center gap-3">
          <div>
            <div className="text-sm font-medium">{name}</div>
            <div className="text-xs text-muted-foreground">
              {value.percentile_rank.toFixed(0)}:e percentilen
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="font-mono text-lg font-semibold">
            {value.normalized_value.toFixed(1)}
          </span>
          <TrendIcon className={cn('h-4 w-4', trendColor)} />
          {showDrillDown && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
        </div>
      </div>
    );
  }
  
  return (
    <Card 
      className={cn(
        'hover:border-primary/50 transition-colors cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-base">{name}</h3>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {definition.description}
            </p>
          </div>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1">
                  {hasQualityWarning ? (
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                  ) : (
                    <Info className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-xs space-y-1">
                  <div>
                    {language === 'sv' ? 'Datatäckning' : 'Data coverage'}: {(value.data_coverage * 100).toFixed(0)}%
                  </div>
                  <div>
                    {language === 'sv' ? 'Källor' : 'Sources'}: {value.source_count}
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Main value */}
        <div className="flex items-end justify-between">
          <div>
            <div className="text-3xl font-mono font-bold">
              {value.normalized_value.toFixed(1)}
            </div>
            <div className="text-sm text-muted-foreground">
              {value.percentile_rank.toFixed(0)}:e percentilen
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-1">
            <div className={cn('flex items-center gap-1', trendColor)}>
              <TrendIcon className="h-5 w-5" />
              {value.change_1y !== null && (
                <span className="text-sm font-mono">
                  {value.change_1y > 0 ? '+' : ''}{value.change_1y.toFixed(1)}%
                </span>
              )}
            </div>
            <div className="text-xs text-muted-foreground">
              {value.trend_direction === 'improving' 
                ? (language === 'sv' ? 'Ökar' : 'Increasing')
                : value.trend_direction === 'declining'
                ? (language === 'sv' ? 'Minskar' : 'Decreasing')
                : (language === 'sv' ? 'Stabil' : 'Stable')
              }
            </div>
          </div>
        </div>
        
        {/* Confidence interval */}
        <div className="mt-3 pt-3 border-t">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>
              {language === 'sv' ? 'Konfidensintervall' : 'Confidence interval'}
            </span>
            <span className="font-mono">
              {value.confidence_interval.lower.toFixed(1)} – {value.confidence_interval.upper.toFixed(1)}
            </span>
          </div>
        </div>
        
        {/* Sources */}
        <div className="mt-2 flex justify-between items-center text-xs text-muted-foreground">
          <span>{definition.primary_sources.slice(0, 2).join(', ')}</span>
          {showDrillDown && (
            <div className="flex items-center gap-1 text-primary">
              <span>{language === 'sv' ? 'Fördjupa' : 'Drill down'}</span>
              <ChevronRight className="h-3 w-3" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default IndexCard;
