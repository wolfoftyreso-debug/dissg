/**
 * BLOCK SE — RESILIENCE vs STRESS MATRIX
 * "Systemets viktigaste karta"
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  calculateZone, 
  STRESS_RESILIENCE_ZONES,
  StressResilienceZone 
} from '@/config/systemResilienceConfig';

interface StressResilienceMatrixProps {
  data: {
    entityId: string;
    entityName: string;
    stress: number;
    resilience: number;
  }[];
  highlightEntity?: string;
}

export function StressResilienceMatrix({ data, highlightEntity }: StressResilienceMatrixProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Stress vs Resiliens</CardTitle>
        <p className="text-sm text-muted-foreground">
          Systemets viktigaste karta – var befinner sig olika områden?
        </p>
      </CardHeader>
      <CardContent>
        {/* Matrix visualization */}
        <div className="relative aspect-square max-w-[400px] mx-auto">
          {/* Background quadrants */}
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
            {/* Top-left: High stress, low resilience = Critical */}
            <div className="bg-destructive/10 border-r border-b border-border flex items-center justify-center p-2">
              <span className="text-xs text-destructive font-medium text-center">
                Kritisk zon
              </span>
            </div>
            {/* Top-right: High stress, high resilience = Pressured */}
            <div className="bg-warning/10 border-b border-border flex items-center justify-center p-2">
              <span className="text-xs text-warning font-medium text-center">
                Pressad men hanterbar
              </span>
            </div>
            {/* Bottom-left: Low stress, low resilience = Latent risk */}
            <div className="bg-secondary/30 border-r border-border flex items-center justify-center p-2">
              <span className="text-xs text-muted-foreground font-medium text-center">
                Latent sårbarhet
              </span>
            </div>
            {/* Bottom-right: Low stress, high resilience = Stable */}
            <div className="bg-success/10 flex items-center justify-center p-2">
              <span className="text-xs text-success font-medium text-center">
                Stabil zon
              </span>
            </div>
          </div>

          {/* Axis labels */}
          <div className="absolute -left-8 top-1/2 -translate-y-1/2 -rotate-90 text-xs text-muted-foreground whitespace-nowrap">
            Stressnivå →
          </div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-6 text-xs text-muted-foreground">
            Resiliens →
          </div>

          {/* Data points */}
          {data.map((point) => {
            const isHighlighted = point.entityId === highlightEntity;
            
            // Convert to position (resilience = x, stress = y, inverted)
            const x = (point.resilience / 100) * 100;
            const y = (1 - point.stress / 100) * 100;

            return (
              <div
                key={point.entityId}
                className={cn(
                  "absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                  isHighlighted 
                    ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 z-10" 
                    : "bg-card border-2 border-border hover:scale-110"
                )}
                style={{ left: `${x}%`, top: `${y}%` }}
                title={`${point.entityName}: Stress ${point.stress}, Resiliens ${point.resilience}`}
              >
                {point.entityId}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-8 grid grid-cols-2 gap-2">
          {(Object.entries(STRESS_RESILIENCE_ZONES) as [StressResilienceZone, typeof STRESS_RESILIENCE_ZONES[StressResilienceZone]][]).map(([zone, config]) => (
            <div key={zone} className="flex items-center gap-2 text-xs">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: config.color }}
              />
              <span>{config.nameSv}</span>
            </div>
          ))}
        </div>

        {/* Current entities list */}
        <div className="mt-6 space-y-2">
          {data.map((point) => {
            const zone = calculateZone(point.stress, point.resilience);
            const zoneConfig = STRESS_RESILIENCE_ZONES[zone];
            
            return (
              <div 
                key={point.entityId}
                className="flex items-center justify-between p-2 bg-muted/50 rounded"
              >
                <span className="font-medium">{point.entityName}</span>
                <Badge 
                  variant="outline"
                  style={{ borderColor: zoneConfig.color, color: zoneConfig.color }}
                >
                  {zoneConfig.nameSv}
                </Badge>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
