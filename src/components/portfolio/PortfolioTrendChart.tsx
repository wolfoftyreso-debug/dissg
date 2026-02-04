/**
 * PORTFOLIO TREND CHART
 * ═══════════════════════════════════════════════════════════════
 * 
 * Visar trendanalys för portföljens Reality Index över tid.
 */

import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';

interface PortfolioTrendChartProps {
  countryCodes: string[];
}

// Generate simulated historical data
function generateHistoricalData(codes: string[], years: number = 10) {
  const data = [];
  const currentYear = new Date().getFullYear();
  
  for (let i = years; i >= 0; i--) {
    const year = currentYear - i;
    const point: Record<string, number | string> = { year: year.toString() };
    
    // Calculate average for portfolio
    let sum = 0;
    codes.forEach((code) => {
      const hash = code.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
      const baseScore = 45 + (hash % 35);
      // Add slight trend over time
      const trend = (years - i) * 0.3;
      const noise = Math.sin(hash * i) * 3;
      point[code] = Math.min(100, Math.max(0, baseScore + trend + noise));
      sum += point[code] as number;
    });
    
    point.average = sum / codes.length;
    data.push(point);
  }
  
  return data;
}

const COLORS = [
  'hsl(217, 91%, 60%)',
  'hsl(142, 76%, 36%)',
  'hsl(48, 96%, 53%)',
  'hsl(280, 65%, 60%)',
  'hsl(0, 84%, 60%)',
  'hsl(173, 80%, 40%)',
  'hsl(340, 82%, 52%)',
  'hsl(30, 90%, 55%)',
];

export function PortfolioTrendChart({ countryCodes }: PortfolioTrendChartProps) {
  const chartData = useMemo(() => generateHistoricalData(countryCodes), [countryCodes]);

  // Calculate trend direction
  const firstAvg = chartData[0]?.average as number || 0;
  const lastAvg = chartData[chartData.length - 1]?.average as number || 0;
  const trendPercent = ((lastAvg - firstAvg) / firstAvg) * 100;
  const trendDirection = trendPercent > 0 ? '[↑]' : trendPercent < 0 ? '[↓]' : '[~]';

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-mono">[↗] Trendanalys - Reality Index</CardTitle>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-mono text-muted-foreground">{trendDirection}</span>
              <span className={trendPercent >= 0 ? 'text-emerald-600' : 'text-red-600'}>
                {trendPercent >= 0 ? '+' : ''}{trendPercent.toFixed(1)}%
              </span>
              <span className="text-muted-foreground text-xs">(10 år)</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="avgGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis domain={[30, 90]} tick={{ fontSize: 11 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="average"
                name="Portföljgenomsnitt"
                stroke="hsl(217, 91%, 60%)"
                fill="url(#avgGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Individual country trends */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-mono">[↗] Individuella länder</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis domain={[30, 90]} tick={{ fontSize: 11 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              {countryCodes.map((code, index) => (
                <Line
                  key={code}
                  type="monotone"
                  dataKey={code}
                  name={`[${code}]`}
                  stroke={COLORS[index % COLORS.length]}
                  strokeWidth={1.5}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
