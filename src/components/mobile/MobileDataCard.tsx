/**
 * Mobile-First Data Card
 * Primary surface for displaying data on mobile devices
 * Follows: Snapshot → Explanation → Method → Data → Source → Alternative
 */

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, ExternalLink, Info, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface MobileDataCardProps {
  /** What is shown (1 line) */
  title: string;
  /** Status indicator */
  status?: 'positive' | 'negative' | 'neutral' | 'warning';
  /** Key metric value */
  value: string | number;
  /** Unit of measurement */
  unit?: string;
  /** Trend direction */
  trend?: 'up' | 'down' | 'stable';
  /** Trend percentage */
  trendPercent?: number;
  /** Mini graph data (optional) */
  sparklineData?: number[];
  /** Source name */
  sourceName: string;
  /** Source URL */
  sourceUrl?: string;
  /** Period covered */
  period?: string;
  /** Explanation text (what does this mean) */
  explanation?: string;
  /** Method description */
  method?: string;
  /** Data coverage info */
  coverage?: string;
  /** What this shows (required by Spotless Protocol) */
  whatThisShows?: string;
  /** What this does NOT show (required by Spotless Protocol) */
  whatThisDoesNotShow?: string[];
  /** Uncertainty level */
  uncertainty?: 'low' | 'medium' | 'high';
  /** Click handler for full deep-dive */
  onDeepen?: () => void;
  /** Additional className */
  className?: string;
}

const StatusBadge: React.FC<{ status: MobileDataCardProps['status'] }> = ({ status }) => {
  const variants = {
    positive: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    negative: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    neutral: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400',
    warning: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  };
  
  const labels = {
    positive: 'Observation',
    negative: 'Observation',
    neutral: 'Stabil',
    warning: 'Varning',
  };

  if (!status) return null;
  
  return (
    <Badge variant="secondary" className={cn('text-xs', variants[status])}>
      {labels[status]}
    </Badge>
  );
};

const TrendIndicator: React.FC<{ trend: MobileDataCardProps['trend']; percent?: number }> = ({ trend, percent }) => {
  const icons = {
    up: <TrendingUp className="h-4 w-4 text-blue-500" />,
    down: <TrendingDown className="h-4 w-4 text-blue-500" />,
    stable: <Minus className="h-4 w-4 text-muted-foreground" />,
  };

  if (!trend) return null;

  return (
    <div className="flex items-center gap-1 text-sm text-muted-foreground">
      {icons[trend]}
      {percent !== undefined && (
        <span>{trend === 'down' ? '-' : trend === 'up' ? '+' : ''}{Math.abs(percent)}%</span>
      )}
    </div>
  );
};

const MiniSparkline: React.FC<{ data: number[] }> = ({ data }) => {
  if (!data || data.length < 2) return null;
  
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const height = 32;
  const width = 80;
  
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="text-primary">
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
};

export function MobileDataCard({
  title,
  status,
  value,
  unit,
  trend,
  trendPercent,
  sparklineData,
  sourceName,
  sourceUrl,
  period,
  explanation,
  method,
  coverage,
  whatThisShows,
  whatThisDoesNotShow,
  uncertainty,
  onDeepen,
  className,
}: MobileDataCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const uncertaintyLabels = {
    low: 'Låg osäkerhet',
    medium: 'Måttlig osäkerhet',
    high: 'Hög osäkerhet',
  };

  return (
    <Card className={cn('w-full touch-manipulation', className)}>
      <CardContent className="p-4">
        {/* Row 1: Title + Status */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="text-sm font-medium leading-tight flex-1">{title}</h3>
          <StatusBadge status={status} />
        </div>

        {/* Row 2: Key Metric + Mini Graph */}
        <div className="flex items-end justify-between mb-3">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold tabular-nums">{value}</span>
            {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
          </div>
          <div className="flex items-center gap-3">
            {sparklineData && <MiniSparkline data={sparklineData} />}
            <TrendIndicator trend={trend} percent={trendPercent} />
          </div>
        </div>

        {/* Row 3: Period + Source */}
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
          {period && <span>{period}</span>}
          <a 
            href={sourceUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-foreground transition-colors min-h-[44px] min-w-[44px] justify-end"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="underline">{sourceName}</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        {/* Expandable Section */}
        {(explanation || method || whatThisShows || whatThisDoesNotShow) && (
          <>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full flex items-center justify-between py-2 text-sm text-muted-foreground hover:text-foreground transition-colors min-h-[44px]"
            >
              <span className="flex items-center gap-1">
                <Info className="h-4 w-4" />
                Mer information
              </span>
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>

            {isExpanded && (
              <div className="space-y-3 pt-2 border-t">
                {/* What this shows */}
                {whatThisShows && (
                  <div>
                    <h4 className="text-xs font-medium text-green-600 dark:text-green-400 mb-1">
                      Detta visar
                    </h4>
                    <p className="text-sm text-muted-foreground">{whatThisShows}</p>
                  </div>
                )}

                {/* What this does NOT show */}
                {whatThisDoesNotShow && whatThisDoesNotShow.length > 0 && (
                  <div>
                    <h4 className="text-xs font-medium text-orange-600 dark:text-orange-400 mb-1">
                      Detta visar inte
                    </h4>
                    <ul className="text-sm text-muted-foreground list-disc list-inside">
                      {whatThisDoesNotShow.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Explanation */}
                {explanation && (
                  <div>
                    <h4 className="text-xs font-medium mb-1">Förklaring</h4>
                    <p className="text-sm text-muted-foreground">{explanation}</p>
                  </div>
                )}

                {/* Method */}
                {method && (
                  <div>
                    <h4 className="text-xs font-medium mb-1">Metod</h4>
                    <p className="text-sm text-muted-foreground">{method}</p>
                  </div>
                )}

                {/* Coverage */}
                {coverage && (
                  <div>
                    <h4 className="text-xs font-medium mb-1">Datatäckning</h4>
                    <p className="text-sm text-muted-foreground">{coverage}</p>
                  </div>
                )}

                {/* Uncertainty */}
                {uncertainty && (
                  <Badge variant="outline" className="text-xs">
                    {uncertaintyLabels[uncertainty]}
                  </Badge>
                )}
              </div>
            )}
          </>
        )}

        {/* Primary CTA: Deepen */}
        {onDeepen && (
          <Button
            onClick={onDeepen}
            variant="default"
            className="w-full mt-4 min-h-[44px]"
          >
            Fördjupa
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
