import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Label
} from 'recharts';
import { 
  CorrelationResult,
  TimeSeriesPoint,
  calculatePearsonCorrelation,
  interpretCorrelation
} from '@/lib/analysis/correlationAnalysis';
import { cn } from '@/lib/utils';

interface CorrelationScatterPlotProps {
  kpiA: {
    id: string;
    name: string;
    data: TimeSeriesPoint[];
    unit?: string;
  };
  kpiB: {
    id: string;
    name: string;
    data: TimeSeriesPoint[];
    unit?: string;
  };
  onClose?: () => void;
}

export function CorrelationScatterPlot({ kpiA, kpiB, onClose }: CorrelationScatterPlotProps) {
  const { scatterData, correlation, trendLine } = useMemo(() => {
    // Align data points by date
    const dateMap = new Map<string, { x?: number; y?: number }>();
    
    kpiA.data.forEach(point => {
      dateMap.set(point.date, { ...dateMap.get(point.date), x: point.value });
    });
    
    kpiB.data.forEach(point => {
      const existing = dateMap.get(point.date);
      if (existing) {
        existing.y = point.value;
      }
    });
    
    const scatterData: { x: number; y: number; date: string }[] = [];
    dateMap.forEach((values, date) => {
      if (values.x !== undefined && values.y !== undefined) {
        scatterData.push({ x: values.x, y: values.y, date });
      }
    });
    
    // Calculate correlation
    const { coefficient, pValue, sampleSize } = calculatePearsonCorrelation(kpiA.data, kpiB.data);
    const { strength, direction, interpretation } = interpretCorrelation(coefficient);
    
    const correlation: CorrelationResult = {
      kpiA: kpiA.id,
      kpiB: kpiB.id,
      coefficient,
      pValue,
      sampleSize,
      strength,
      direction,
      interpretation
    };
    
    // Calculate trend line (linear regression)
    if (scatterData.length >= 2) {
      const n = scatterData.length;
      const sumX = scatterData.reduce((s, p) => s + p.x, 0);
      const sumY = scatterData.reduce((s, p) => s + p.y, 0);
      const sumXY = scatterData.reduce((s, p) => s + p.x * p.y, 0);
      const sumX2 = scatterData.reduce((s, p) => s + p.x * p.x, 0);
      
      const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
      const intercept = (sumY - slope * sumX) / n;
      
      const minX = Math.min(...scatterData.map(p => p.x));
      const maxX = Math.max(...scatterData.map(p => p.x));
      
      return {
        scatterData,
        correlation,
        trendLine: {
          start: { x: minX, y: slope * minX + intercept },
          end: { x: maxX, y: slope * maxX + intercept }
        }
      };
    }
    
    return { scatterData, correlation, trendLine: null };
  }, [kpiA, kpiB]);

  const strengthColor = {
    strong: 'bg-chart-2 text-white',
    moderate: 'bg-chart-2/70 text-white',
    weak: 'bg-muted text-foreground',
    none: 'bg-muted text-muted-foreground'
  }[correlation.strength];

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">Korrelationsanalys</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {kpiA.name} vs {kpiB.name}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={cn(strengthColor)}>
              r = {correlation.coefficient.toFixed(3)}
            </Badge>
            {onClose && (
              <button 
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Stäng"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Scatter plot */}
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis 
                type="number" 
                dataKey="x" 
                name={kpiA.name}
                tickFormatter={(v) => v.toLocaleString('sv-SE')}
                className="text-xs"
              >
                <Label 
                  value={`${kpiA.name}${kpiA.unit ? ` (${kpiA.unit})` : ''}`} 
                  position="bottom" 
                  offset={20}
                  className="fill-muted-foreground text-xs"
                />
              </XAxis>
              <YAxis 
                type="number" 
                dataKey="y" 
                name={kpiB.name}
                tickFormatter={(v) => v.toLocaleString('sv-SE')}
                className="text-xs"
              >
                <Label 
                  value={`${kpiB.name}${kpiB.unit ? ` (${kpiB.unit})` : ''}`} 
                  angle={-90} 
                  position="left" 
                  offset={10}
                  className="fill-muted-foreground text-xs"
                />
              </YAxis>
              <Tooltip 
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const data = payload[0].payload;
                  return (
                    <div className="bg-popover border rounded-lg shadow-lg p-3 text-sm">
                      <p className="text-muted-foreground text-xs mb-1">{data.date}</p>
                      <p>{kpiA.name}: <strong>{data.x.toLocaleString('sv-SE')}</strong></p>
                      <p>{kpiB.name}: <strong>{data.y.toLocaleString('sv-SE')}</strong></p>
                    </div>
                  );
                }}
              />
              <Scatter 
                data={scatterData} 
                fill="hsl(var(--primary))"
                opacity={0.7}
              />
              {/* Trend line */}
              {trendLine && (
                <ReferenceLine
                  segment={[
                    { x: trendLine.start.x, y: trendLine.start.y },
                    { x: trendLine.end.x, y: trendLine.end.y }
                  ]}
                  stroke="hsl(var(--destructive))"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
              )}
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Interpretation */}
        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
          <h4 className="font-medium text-sm">Tolkning</h4>
          <p className="text-sm">{correlation.interpretation}</p>
          
          <div className="grid grid-cols-2 gap-4 mt-3 text-xs">
            <div>
              <span className="text-muted-foreground">Datapunkter:</span>
              <span className="ml-2 font-mono">{correlation.sampleSize}</span>
            </div>
            <div>
              <span className="text-muted-foreground">p-värde:</span>
              <span className="ml-2 font-mono">{correlation.pValue.toFixed(4)}</span>
            </div>
          </div>
          
          {/* What this shows / doesn't show */}
          <div className="mt-3 pt-3 border-t border-border space-y-2">
            <div>
              <p className="text-xs font-medium text-chart-2">✓ Detta visar:</p>
              <p className="text-xs text-muted-foreground">
                Statistiskt samband mellan variablerna under den valda perioden
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-destructive">✗ Detta visar INTE:</p>
              <p className="text-xs text-muted-foreground">
                Orsakssamband (kausalitet). Korrelation ≠ kausalitet.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
