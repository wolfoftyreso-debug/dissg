/**
 * LIFE EXPECTANCY VIEW
 * 
 * Shows life expectancy trends and comparisons.
 * Population-level statistics only.
 */

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { InterpretationGuide } from './HealthGuardrailBlock';
import { generateInterpretationGuide, formatLifeExpectancy } from '@/lib/health/formatters';
import { supabase } from '@/integrations/supabase/client';

interface LifeExpectancyViewProps {
  countryCode: string;
  countryName: string;
}

export function LifeExpectancyView({ countryCode, countryName }: LifeExpectancyViewProps) {
  const [startYear, setStartYear] = useState(1990);

  const { data: lifeExpectancy, isLoading, error } = useQuery({
    queryKey: ['life-expectancy', countryCode, startYear],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('life_expectancy')
        .select('*')
        .eq('country_code', countryCode)
        .gte('period_year', startYear)
        .order('period_year', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  const guide = generateInterpretationGuide('life_expectancy');

  const chartData = lifeExpectancy?.map(item => ({
    year: item.period_year,
    total: item.life_expectancy_total,
    male: item.life_expectancy_male,
    female: item.life_expectancy_female,
    healthy: item.healthy_life_expectancy_total
  })) || [];

  const latestData = lifeExpectancy?.[lifeExpectancy.length - 1];

  return (
    <div className="space-y-6">
      {/* Interpretation guide */}
      <InterpretationGuide shows={guide.shows} doesNotShow={guide.doesNotShow} />

      {/* Controls */}
      <div className="flex gap-3">
        <Select value={String(startYear)} onValueChange={(v) => setStartYear(Number(v))}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="From year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1950">From 1950</SelectItem>
            <SelectItem value="1970">From 1970</SelectItem>
            <SelectItem value="1990">From 1990</SelectItem>
            <SelectItem value="2000">From 2000</SelectItem>
            <SelectItem value="2010">From 2010</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary cards */}
      {latestData && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Life Expectancy</CardDescription>
              <CardTitle className="text-2xl">
                {formatLifeExpectancy(latestData.life_expectancy_total)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                At birth, {latestData.period_year}
              </p>
            </CardContent>
          </Card>

          {latestData.life_expectancy_male && (
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Male</CardDescription>
                <CardTitle className="text-2xl">
                  {formatLifeExpectancy(latestData.life_expectancy_male)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  At birth, {latestData.period_year}
                </p>
              </CardContent>
            </Card>
          )}

          {latestData.life_expectancy_female && (
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Female</CardDescription>
                <CardTitle className="text-2xl">
                  {formatLifeExpectancy(latestData.life_expectancy_female)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  At birth, {latestData.period_year}
                </p>
              </CardContent>
            </Card>
          )}

          {latestData.healthy_life_expectancy_total && (
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Healthy Life Expectancy</CardDescription>
                <CardTitle className="text-2xl">
                  {formatLifeExpectancy(latestData.healthy_life_expectancy_total)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  HALE, {latestData.period_year}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Life Expectancy Trend in {countryName}</CardTitle>
          <CardDescription>
            Years of life expected at birth
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-[300px] w-full" />
          ) : error ? (
            <p className="text-destructive">Error loading data</p>
          ) : !chartData.length ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No life expectancy data available for {countryName}.</p>
              <p className="text-sm mt-2">
                Data sources: WHO, OECD, National Statistics
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="year" 
                  className="text-xs" 
                  tick={{ fill: 'currentColor' }}
                />
                <YAxis 
                  domain={['dataMin - 2', 'dataMax + 2']}
                  className="text-xs"
                  tick={{ fill: 'currentColor' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  name="Total" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="male" 
                  name="Male" 
                  stroke="hsl(210, 70%, 50%)" 
                  strokeWidth={1.5}
                  dot={false}
                  strokeDasharray="5 5"
                />
                <Line 
                  type="monotone" 
                  dataKey="female" 
                  name="Female" 
                  stroke="hsl(330, 70%, 50%)" 
                  strokeWidth={1.5}
                  dot={false}
                  strokeDasharray="5 5"
                />
                {chartData.some(d => d.healthy) && (
                  <Line 
                    type="monotone" 
                    dataKey="healthy" 
                    name="Healthy (HALE)" 
                    stroke="hsl(120, 50%, 50%)" 
                    strokeWidth={1.5}
                    dot={false}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Source attribution */}
      <div className="text-xs text-muted-foreground">
        <p>
          <strong>Data source:</strong> WHO Global Health Observatory, OECD Health Statistics
        </p>
        <p className="mt-1">
          <strong>Note:</strong> Life expectancy at birth represents the average number of 
          years a newborn would live if current mortality rates remained constant. 
          This is a statistical measure that does not predict any individual's lifespan.
        </p>
      </div>
    </div>
  );
}

export default LifeExpectancyView;
