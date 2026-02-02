/**
 * DISEASE BURDEN VIEW
 * 
 * Shows DALYs, YLL, YLD from Global Burden of Disease data.
 * Population-level only. No individual conclusions.
 */

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { InterpretationGuide } from './HealthGuardrailBlock';
import { generateInterpretationGuide } from '@/lib/health/formatters';
import { supabase } from '@/integrations/supabase/client';

interface DiseaseBurdenViewProps {
  countryCode: string;
  countryName: string;
  year: number;
}

export function DiseaseBurdenView({ countryCode, countryName, year }: DiseaseBurdenViewProps) {
  const [causeLevel, setCauseLevel] = useState<number>(2);
  const [ageGroup, setAgeGroup] = useState<string>('all');

  const { data: diseaseBurden, isLoading, error } = useQuery({
    queryKey: ['disease-burden', countryCode, year, causeLevel, ageGroup],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('disease_burden')
        .select('*')
        .eq('country_code', countryCode)
        .eq('period_year', year)
        .eq('cause_level', causeLevel)
        .eq('age_group', ageGroup)
        .eq('sex', 'both')
        .order('dalys_per_100k', { ascending: false, nullsFirst: false })
        .limit(20);
      
      if (error) throw error;
      return data;
    }
  });

  const guide = generateInterpretationGuide('disease_burden');

  return (
    <div className="space-y-6">
      {/* Interpretation guide */}
      <InterpretationGuide shows={guide.shows} doesNotShow={guide.doesNotShow} />

      {/* Controls */}
      <div className="flex flex-wrap gap-3">
        <Select value={String(causeLevel)} onValueChange={(v) => setCauseLevel(Number(v))}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Detail level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Top Level</SelectItem>
            <SelectItem value="2">Categories</SelectItem>
            <SelectItem value="3">Specific Causes</SelectItem>
          </SelectContent>
        </Select>

        <Select value={ageGroup} onValueChange={setAgeGroup}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Age group" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All ages</SelectItem>
            <SelectItem value="0-14">0–14 years</SelectItem>
            <SelectItem value="15-49">15–49 years</SelectItem>
            <SelectItem value="50-69">50–69 years</SelectItem>
            <SelectItem value="70+">70+ years</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Data display */}
      <Card>
        <CardHeader>
          <CardTitle>Disease Burden in {countryName}, {year}</CardTitle>
          <CardDescription>
            Disability-Adjusted Life Years (DALYs) per 100,000 population
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : error ? (
            <p className="text-destructive">Error loading data</p>
          ) : !diseaseBurden?.length ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No disease burden data available for {countryName} in {year}.</p>
              <p className="text-sm mt-2">
                Data sources: WHO Global Health Estimates, IHME Global Burden of Disease Study
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {diseaseBurden.map((item, index) => (
                <div 
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-muted-foreground w-6">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium">{item.cause_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.cause_code}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-medium">
                      {item.dalys_per_100k?.toLocaleString(undefined, { maximumFractionDigits: 1 })}
                    </p>
                    <p className="text-xs text-muted-foreground">per 100k</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Source attribution */}
      <div className="text-xs text-muted-foreground">
        <p>
          <strong>Data source:</strong> Global Burden of Disease Study (GBD), 
          Institute for Health Metrics and Evaluation (IHME)
        </p>
        <p className="mt-1">
          <strong>Note:</strong> DALYs combine years of life lost (YLL) and years lived with 
          disability (YLD). This metric aggregates population-level burden and cannot 
          indicate individual health status.
        </p>
      </div>
    </div>
  );
}

export default DiseaseBurdenView;
