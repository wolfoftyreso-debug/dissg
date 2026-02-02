/**
 * BLOCK SF — TIME EROSION VIEW
 * "Även hög kapacitet kan eroderas om belastning är långvarig."
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, ReferenceLine 
} from 'recharts';
import { TrendingDown, AlertTriangle } from 'lucide-react';
import type { ResilienceDimensionId } from '@/config/systemResilienceConfig';
import { RESILIENCE_DIMENSIONS, EROSION_WARNING } from '@/config/systemResilienceConfig';

interface ErosionViewProps {
  dimensionId: ResilienceDimensionId;
  data: { date: string; value: number }[];
  erosionRate: number;
  projectedValue: number;
}

export function ErosionView({ dimensionId, data, erosionRate, projectedValue }: ErosionViewProps) {
  const dimension = RESILIENCE_DIMENSIONS.find(d => d.id === dimensionId);
  const isEroding = erosionRate < -1;

  // Add projection point
  const chartData = [
    ...data,
    { date: '2025 (proj.)', value: projectedValue, projected: true },
  ];

  return (
    <Card className={isEroding ? "border-warning/50" : ""}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <span>{dimension?.icon}</span>
            {dimension?.nameSv} – Utveckling över tid
          </CardTitle>
          {isEroding && (
            <Badge variant="outline" className="text-warning border-warning">
              <TrendingDown className="h-3 w-3 mr-1" />
              {erosionRate.toFixed(1)}% / år
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 11 }}
              />
              <YAxis 
                domain={[0, 100]} 
                tick={{ fontSize: 11 }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <ReferenceLine 
                y={50} 
                stroke="hsl(var(--muted-foreground))" 
                strokeDasharray="5 5"
                label={{ value: 'Medel', position: 'right', fontSize: 10 }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={(props: any) => {
                  const item = chartData[props.index] as { date: string; value: number; projected?: boolean };
                  const isProjected = item?.projected;
                  return (
                    <circle
                      key={props.index}
                      cx={props.cx}
                      cy={props.cy}
                      r={4}
                      fill={isProjected ? "hsl(var(--warning))" : "hsl(var(--primary))"}
                      stroke={isProjected ? "hsl(var(--warning))" : "hsl(var(--primary))"}
                      strokeWidth={2}
                      strokeDasharray={isProjected ? "3 3" : "0"}
                    />
                  );
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Erosion warning */}
        {isEroding && (
          <Alert className="border-warning/50 bg-warning/10">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <AlertDescription className="text-sm">
              {EROSION_WARNING.template_sv}
            </AlertDescription>
          </Alert>
        )}

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-3 h-0.5 bg-primary" />
            <span>Historisk data</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-0.5 bg-warning border-dashed" style={{ borderTop: '2px dashed' }} />
            <span>Projektion</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
