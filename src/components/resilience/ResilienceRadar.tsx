/**
 * BLOCK SC — RESILIENCE PROFILE (Radar Chart)
 * "Folk ska förstå på 5 sek"
 */

import React from 'react';
import { 
  RadarChart, Radar, PolarGrid, PolarAngleAxis, 
  PolarRadiusAxis, ResponsiveContainer, Tooltip 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { ResilienceProfile } from '@/config/systemResilienceConfig';
import { RESILIENCE_DIMENSIONS, RESILIENCE_LEVEL_LABELS } from '@/config/systemResilienceConfig';

interface ResilienceRadarProps {
  profile: ResilienceProfile;
}

export function ResilienceRadar({ profile }: ResilienceRadarProps) {
  const chartData = profile.dimensions.map((dim) => {
    const dimensionConfig = RESILIENCE_DIMENSIONS.find(d => d.id === dim.dimensionId);
    return {
      dimension: dimensionConfig?.nameSv || dim.dimensionId,
      icon: dimensionConfig?.icon || '📊',
      score: dim.overallScore,
      fullMark: 100,
    };
  });

  const getResilienceLevel = (score: number) => {
    if (score >= RESILIENCE_LEVEL_LABELS.high.threshold) return RESILIENCE_LEVEL_LABELS.high;
    if (score >= RESILIENCE_LEVEL_LABELS.medium.threshold) return RESILIENCE_LEVEL_LABELS.medium;
    return RESILIENCE_LEVEL_LABELS.low;
  };

  const level = getResilienceLevel(profile.overallResilience);

  const TrendIcon = {
    improving: <TrendingUp className="h-4 w-4 text-success" />,
    stable: <Minus className="h-4 w-4 text-muted-foreground" />,
    declining: <TrendingDown className="h-4 w-4 text-destructive" />,
  }[profile.overallTrend];

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            Resiliensprofil: {profile.entityNameSv}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{level.sv}</Badge>
            {TrendIcon}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={chartData} cx="50%" cy="50%" outerRadius="70%">
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis 
                dataKey="dimension" 
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              />
              <PolarRadiusAxis 
                angle={90} 
                domain={[0, 100]} 
                tick={{ fontSize: 10 }}
              />
              <Radar
                name="Kapacitet"
                dataKey="score"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Tooltip 
                formatter={(value: number) => [`${value}/100`, 'Kapacitet']}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Summary text */}
        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            {generateSummaryText(profile)}
          </p>
        </div>

        {/* Overall score */}
        <div className="mt-4 flex items-center justify-center gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">
              {profile.overallResilience}
            </div>
            <div className="text-xs text-muted-foreground">
              Total resiliens
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function generateSummaryText(profile: ResilienceProfile): string {
  const sorted = [...profile.dimensions].sort((a, b) => b.overallScore - a.overallScore);
  const strongest = sorted[0];
  const weakest = sorted[sorted.length - 1];

  const strongestName = RESILIENCE_DIMENSIONS.find(d => d.id === strongest.dimensionId)?.nameSv || '';
  const weakestName = RESILIENCE_DIMENSIONS.find(d => d.id === weakest.dimensionId)?.nameSv || '';

  return `Systemet har relativt stark ${strongestName.toLowerCase()}, men lägre ${weakestName.toLowerCase()}. Detta innebär att vissa typer av chocker hanteras bättre än andra.`;
}
