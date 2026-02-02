/**
 * BLOCK PC — VISUALISERING (INGEN MAGI)
 * 
 * Systemet visar:
 * - linjer på samma tidsaxel
 * - tydligt markerad skala
 * - markerade beslut/händelser (om tillgängligt)
 * 
 * Och alltid:
 * - "Dessa kurvor rör sig samtidigt / inte samtidigt"
 * - "Förändringen sker före / efter / parallellt"
 * 
 * 📌 Inga trendlinjer som antyder kausalitet.
 */

import React, { useMemo } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine,
  Legend
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Info } from 'lucide-react';
import type { DataIndicator } from '@/config/correlationLearningCanvasConfig';

interface CorrelationChartProps {
  indicatorA: DataIndicator;
  indicatorB: DataIndicator;
  region: string;
  timeRange: [number, number];
}

// Generate mock data for visualization
function generateMockData(
  indicatorA: DataIndicator, 
  indicatorB: DataIndicator, 
  timeRange: [number, number]
) {
  const data = [];
  const years = timeRange[1] - timeRange[0] + 1;
  
  // Create correlated but noisy data
  let baseA = 50 + Math.random() * 20;
  let baseB = 50 + Math.random() * 20;
  
  for (let i = 0; i < years; i++) {
    const year = timeRange[0] + i;
    
    // Add some correlation with noise
    const sharedTrend = Math.sin(i * 0.5) * 10;
    const noiseA = (Math.random() - 0.5) * 8;
    const noiseB = (Math.random() - 0.5) * 8;
    
    baseA += (Math.random() - 0.5) * 5 + sharedTrend * 0.3;
    baseB += (Math.random() - 0.5) * 5 + sharedTrend * 0.25;
    
    data.push({
      year,
      valueA: Math.max(0, baseA + noiseA),
      valueB: Math.max(0, baseB + noiseB),
      labelA: indicatorA.nameSv,
      labelB: indicatorB.nameSv,
    });
  }
  
  return data;
}

// Mock decision/event data
const MOCK_EVENTS = [
  { year: 2015, label: 'Energireform antagen' },
  { year: 2020, label: 'Pandemiåtgärder' },
];

export function CorrelationChart({
  indicatorA,
  indicatorB,
  region,
  timeRange,
}: CorrelationChartProps) {
  const data = useMemo(
    () => generateMockData(indicatorA, indicatorB, timeRange),
    [indicatorA, indicatorB, timeRange]
  );

  // Analyze pattern (simplified)
  const patternAnalysis = useMemo(() => {
    if (data.length < 3) return { movement: 'unclear', timing: 'unclear' };
    
    let sameDirection = 0;
    for (let i = 1; i < data.length; i++) {
      const deltaA = data[i].valueA - data[i-1].valueA;
      const deltaB = data[i].valueB - data[i-1].valueB;
      if ((deltaA > 0 && deltaB > 0) || (deltaA < 0 && deltaB < 0)) {
        sameDirection++;
      }
    }
    
    const ratio = sameDirection / (data.length - 1);
    
    return {
      movement: ratio > 0.6 ? 'together' : ratio < 0.4 ? 'opposite' : 'mixed',
      timing: 'parallel', // Simplified
    };
  }, [data]);

  const getMovementText = () => {
    switch (patternAnalysis.movement) {
      case 'together':
        return 'Dessa kurvor rör sig ofta i samma riktning';
      case 'opposite':
        return 'När den ena stiger, sjunker den andra ofta';
      case 'mixed':
        return 'Mönstret varierar under olika perioder';
      default:
        return 'Inget tydligt mönster syns';
    }
  };

  return (
    <div className="space-y-4">
      {/* Chart */}
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="year" 
              tick={{ fontSize: 12 }}
              className="text-muted-foreground"
            />
            <YAxis 
              yAxisId="left"
              tick={{ fontSize: 12 }}
              className="text-muted-foreground"
              label={{ 
                value: indicatorA.unit, 
                angle: -90, 
                position: 'insideLeft',
                style: { fontSize: 11, fill: 'hsl(var(--muted-foreground))' }
              }}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 12 }}
              className="text-muted-foreground"
              label={{ 
                value: indicatorB.unit, 
                angle: 90, 
                position: 'insideRight',
                style: { fontSize: 11, fill: 'hsl(var(--muted-foreground))' }
              }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
              formatter={(value: number, name: string) => [
                value.toFixed(1),
                name === 'valueA' ? indicatorA.nameSv : indicatorB.nameSv
              ]}
              labelFormatter={(label) => `År ${label}`}
            />
            <Legend 
              formatter={(value) => value === 'valueA' ? indicatorA.nameSv : indicatorB.nameSv}
            />
            
            {/* Event markers */}
            {MOCK_EVENTS.filter(e => e.year >= timeRange[0] && e.year <= timeRange[1]).map((event) => (
              <ReferenceLine 
                key={event.year}
                x={event.year} 
                stroke="hsl(var(--muted-foreground))" 
                strokeDasharray="5 5"
                label={{ 
                  value: event.label, 
                  position: 'top',
                  fontSize: 10,
                  fill: 'hsl(var(--muted-foreground))'
                }}
              />
            ))}
            
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="valueA" 
              stroke="hsl(var(--chart-1))" 
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="valueB" 
              stroke="hsl(var(--chart-2))" 
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Pattern description - NO STATISTICAL TERMS */}
      <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
        <Info className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
        <div className="space-y-2">
          <p className="font-medium">{getMovementText()}</p>
          <p className="text-sm text-muted-foreground">
            Förändringarna sker ungefär samtidigt under denna period.
          </p>
          <div className="flex gap-2 flex-wrap">
            <Badge variant="outline" className="text-xs">
              {indicatorA.nameSv}: vänster skala
            </Badge>
            <Badge variant="outline" className="text-xs">
              {indicatorB.nameSv}: höger skala
            </Badge>
          </div>
        </div>
      </div>

      {/* Decision annotations note */}
      {MOCK_EVENTS.some(e => e.year >= timeRange[0] && e.year <= timeRange[1]) && (
        <div className="text-xs text-muted-foreground flex items-center gap-2">
          <span className="w-4 border-t border-dashed border-muted-foreground"></span>
          <span>Streckade linjer markerar beslut/händelser under perioden</span>
        </div>
      )}
    </div>
  );
}
