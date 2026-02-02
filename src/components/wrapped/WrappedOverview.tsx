// Wrapped Step 1: Overview - "Så här såg året ut"

import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { WrappedOutput } from '@/types/wrapped';
import { cn } from '@/lib/utils';

interface WrappedOverviewProps {
  data: WrappedOutput['overview'];
  isDemo?: boolean;
}

export function WrappedOverview({ data, isDemo }: WrappedOverviewProps) {
  return (
    <div className="space-y-8 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          {data.title}
        </h1>
        <p className="text-muted-foreground">
          {data.subtitle}
        </p>
      </div>

      {/* Main indicators */}
      <div className="grid gap-4 md:grid-cols-2">
        {data.mainIndicators.map((indicator, index) => (
          <Card 
            key={indicator.indicatorId}
            className={cn(
              "transition-all duration-300",
              "animate-in fade-in-0 slide-in-from-bottom-2",
            )}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    {indicator.indicatorName}
                  </p>
                  <p className="text-3xl font-semibold tabular-nums">
                    {indicator.value.toLocaleString('sv-SE')}
                    <span className="text-lg text-muted-foreground ml-1">
                      {indicator.unit}
                    </span>
                  </p>
                </div>
                
                {/* Change indicator - subtle, not celebratory */}
                <div className={cn(
                  "flex items-center gap-1 text-sm",
                  indicator.isPositiveChange && indicator.changeDirection !== 'stable'
                    ? "text-chart-2" // Subtle positive
                    : indicator.changeDirection !== 'stable'
                    ? "text-chart-5" // Subtle negative
                    : "text-muted-foreground"
                )}>
                  {indicator.changeDirection === 'up' && (
                    <TrendingUp className="h-4 w-4" />
                  )}
                  {indicator.changeDirection === 'down' && (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  {indicator.changeDirection === 'stable' && (
                    <Minus className="h-4 w-4" />
                  )}
                  {indicator.changePercent !== null && (
                    <span className="tabular-nums">
                      {indicator.changePercent > 0 ? '+' : ''}
                      {indicator.changePercent.toFixed(1)}%
                    </span>
                  )}
                </div>
              </div>

              {/* Source attribution */}
              <p className="text-xs text-muted-foreground mt-4">
                Källa: {indicator.dataSource}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary text - neutral, factual */}
      <div className="text-center">
        <p className="text-muted-foreground max-w-xl mx-auto">
          {data.summaryText}
        </p>
      </div>

      {/* Demo watermark */}
      {isDemo && (
        <div className="text-center">
          <span className="inline-block px-3 py-1 text-xs text-muted-foreground bg-muted rounded-full">
            DEMO – Begränsad funktionalitet
          </span>
        </div>
      )}
    </div>
  );
}
