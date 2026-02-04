/**
 * Step 7: Lambda Projection
 * 
 * Shows what happens if current trends continue.
 * No recommendations - only consequences.
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ChevronRight, AlertTriangle, TrendingDown, TrendingUp, Minus } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
  Legend,
} from 'recharts';
import type { ProjectionData } from '../types';

interface StepLambdaProjectionProps {
  projectionData: ProjectionData;
  geoName: string;
  onConfirm: () => void;
}

export function StepLambdaProjection({ projectionData, geoName, onConfirm }: StepLambdaProjectionProps) {
  // Prepare chart data
  const chartData = Array.from({ length: 11 }, (_, i) => {
    const year = 2024 + i;
    const baseline = projectionData.projections.find(p => p.year === year && p.scenario === 'baseline');
    const optimistic = projectionData.projections.find(p => p.year === year && p.scenario === 'optimistic');
    const pessimistic = projectionData.projections.find(p => p.year === year && p.scenario === 'pessimistic');
    
    return {
      year,
      baseline: baseline?.value,
      optimistic: optimistic?.value,
      pessimistic: pessimistic?.value,
    };
  });

  const finalBaseline = chartData[chartData.length - 1]?.baseline || 0;
  const trendDirection = finalBaseline < 0.82 ? 'declining' : finalBaseline > 0.9 ? 'improving' : 'stable';

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <Badge variant="outline" className="mb-4 font-mono">STEG 7 / 8</Badge>
        <h2 className="text-2xl font-bold mb-2">Systemstatus & Lambda-projektion</h2>
        <p className="text-muted-foreground">
          Prognostiserad utveckling för {geoName} baserat på nuvarande trender
        </p>
      </div>

      {/* Main projection */}
      <div className="bg-card border rounded-xl p-6 mb-6">
        <div className="text-sm text-muted-foreground mb-4">
          OM DESSA ORSAKER KVARSTÅR:
        </div>

        {/* Chart */}
        <div className="h-80 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis 
                domain={[0.6, 1.1]} 
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => v.toFixed(1)}
              />
              <Tooltip 
                contentStyle={{ fontSize: 12, background: 'rgba(0,0,0,0.9)', border: 'none' }}
                formatter={(v: number) => [v?.toFixed(3), 'λ']}
              />
              <Legend />

              {/* Optimal zone */}
              <ReferenceArea y1={0.95} y2={1.05} fill="#3b82f6" fillOpacity={0.1} />
              
              {/* Risk zones */}
              {projectionData.riskZones.map((zone, i) => (
                <ReferenceArea 
                  key={i}
                  x1={zone.startYear} 
                  x2={zone.endYear} 
                  fill={zone.severity === 'critical' ? '#dc2626' : '#f97316'} 
                  fillOpacity={0.1} 
                />
              ))}

              {/* Reference line at 1.0 */}
              <ReferenceLine y={1.0} stroke="#3b82f6" strokeDasharray="5 5" />
              
              {/* Scenario lines */}
              <Line 
                type="monotone" 
                dataKey="optimistic" 
                name="Optimistisk"
                stroke="#22c55e" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="baseline" 
                name="Baslinje"
                stroke="#f97316" 
                strokeWidth={3}
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="pessimistic" 
                name="Pessimistisk"
                stroke="#dc2626" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Projection summary */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="text-xs text-muted-foreground mb-1">OM 1 ÅR</div>
            <div className="text-2xl font-mono font-bold">
              λ = {chartData[1]?.baseline?.toFixed(2) || '—'}
            </div>
          </div>
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="text-xs text-muted-foreground mb-1">OM 5 ÅR</div>
            <div className="text-2xl font-mono font-bold text-amber-500">
              λ = {chartData[5]?.baseline?.toFixed(2) || '—'}
            </div>
          </div>
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="text-xs text-muted-foreground mb-1">OM 10 ÅR</div>
            <div className={`text-2xl font-mono font-bold ${finalBaseline < 0.85 ? 'text-red-500' : 'text-amber-500'}`}>
              λ = {chartData[10]?.baseline?.toFixed(2) || '—'}
            </div>
          </div>
        </div>
      </div>

      {/* Risk zones */}
      {projectionData.riskZones.length > 0 && (
        <Alert className="mb-6 bg-red-500/10 border-red-500">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <AlertDescription>
            <strong className="text-red-500">Riskzoner identifierade:</strong>
            <ul className="mt-2 space-y-1">
              {projectionData.riskZones.map((zone, i) => (
                <li key={i} className="text-sm">
                  {zone.startYear}–{zone.endYear}: {zone.severity === 'critical' ? 'Kritisk risk' : 'Hög risk'}
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Stabilizing factors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2 text-green-500 mb-3">
            <TrendingUp className="h-4 w-4" />
            <span className="font-medium">Stabiliserande faktorer</span>
          </div>
          <div className="space-y-2">
            {projectionData.stabilizingFactors.map((factor, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span>{factor.factor}</span>
                <Badge variant="outline" className="text-green-500 border-green-500">
                  +{(factor.impact * 100).toFixed(0)}%
                </Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-3">
            <Minus className="h-4 w-4" />
            <span className="font-medium">Nyckelantaganden</span>
          </div>
          <ul className="space-y-1 text-sm text-muted-foreground">
            {projectionData.keyAssumptions.map((assumption, i) => (
              <li key={i}>• {assumption}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* No recommendation notice */}
      <div className="bg-muted/30 rounded-lg p-4 text-center text-sm text-muted-foreground mb-6">
        Systemet visar konsekvenser – inte rekommendationer. 
        Beslut fattas av ansvariga beslutsfattare.
      </div>

      {/* Action button */}
      <div className="flex justify-end">
        <Button
          size="lg"
          onClick={onConfirm}
          className="font-mono"
        >
          Fortsätt till åtgärdsklasser
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
