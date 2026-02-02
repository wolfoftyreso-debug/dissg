/**
 * HEALTH POLICY TIMELINE
 * 
 * Shows healthcare capacity and policy periods overlay.
 * "What happened when..." functionality.
 */

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { InterpretationGuide } from './HealthGuardrailBlock';
import { generateInterpretationGuide, formatPolicyPeriod } from '@/lib/health/formatters';
import { supabase } from '@/integrations/supabase/client';
import type { HealthPolicyPeriod } from '@/types/health';

interface HealthPolicyTimelineProps {
  countryCode: string;
  countryName: string;
}

const POLICY_CATEGORIES = [
  { value: 'all', label: 'All Policies' },
  { value: 'substance_policy', label: 'Substance Policy' },
  { value: 'healthcare_reform', label: 'Healthcare Reform' },
  { value: 'public_health', label: 'Public Health' },
  { value: 'pandemic_response', label: 'Pandemic Response' }
];

export function HealthPolicyTimeline({ countryCode, countryName }: HealthPolicyTimelineProps) {
  const [category, setCategory] = useState<string>('all');

  // Fetch healthcare capacity
  const { data: capacity, isLoading: loadingCapacity } = useQuery({
    queryKey: ['healthcare-capacity', countryCode],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('healthcare_capacity')
        .select('*')
        .eq('country_code', countryCode)
        .order('period_year', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch policy periods
  const { data: policies, isLoading: loadingPolicies } = useQuery({
    queryKey: ['health-policies', countryCode, category],
    queryFn: async () => {
      let query = supabase
        .from('health_policy_periods')
        .select('*')
        .eq('country_code', countryCode)
        .eq('is_active', true)
        .order('start_date', { ascending: false });
      
      if (category !== 'all') {
        query = query.eq('category', category);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  const guide = generateInterpretationGuide('healthcare_capacity');
  const latestCapacity = capacity?.[0];

  return (
    <div className="space-y-6">
      {/* Interpretation guide */}
      <InterpretationGuide shows={guide.shows} doesNotShow={guide.doesNotShow} />

      {/* Healthcare capacity cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Physicians</CardDescription>
            <CardTitle className="text-2xl">
              {latestCapacity?.physicians_per_10k?.toFixed(1) || '—'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              per 10,000 population
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Nurses</CardDescription>
            <CardTitle className="text-2xl">
              {latestCapacity?.nurses_per_10k?.toFixed(1) || '—'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              per 10,000 population
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Hospital Beds</CardDescription>
            <CardTitle className="text-2xl">
              {latestCapacity?.hospital_beds_per_10k?.toFixed(1) || '—'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              per 10,000 population
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Health Spending</CardDescription>
            <CardTitle className="text-2xl">
              {latestCapacity?.health_expenditure_pct_gdp?.toFixed(1) || '—'}%
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              of GDP, {latestCapacity?.period_year || '—'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Policy periods */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Policy Periods in {countryName}</CardTitle>
              <CardDescription>
                Healthcare and substance policy changes over time
              </CardDescription>
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {POLICY_CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loadingPolicies ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : !policies?.length ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No policy periods documented for {countryName}.</p>
              <p className="text-sm mt-2">
                Policy data will be sourced from government records, 
                WHO policy databases, and academic research.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {policies.map((policy) => {
                const formatted = formatPolicyPeriod({
                  ...policy,
                  name_local: policy.name_local as Record<string, string> | undefined,
                  category: policy.category as HealthPolicyPeriod['category']
                });
                return (
                  <div 
                    key={policy.id}
                    className="border-l-4 border-primary pl-4 py-2"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="font-medium">{formatted.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {formatted.dateRange}
                          {formatted.isOngoing && (
                            <Badge variant="outline" className="ml-2">Ongoing</Badge>
                          )}
                        </p>
                      </div>
                      <Badge variant="secondary">
                        {policy.category.replace('_', ' ')}
                      </Badge>
                    </div>
                    {policy.description && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {policy.description}
                      </p>
                    )}
                    {policy.key_changes && policy.key_changes.length > 0 && (
                      <ul className="text-sm mt-2 space-y-1">
                        {policy.key_changes.map((change, i) => (
                          <li key={i} className="flex gap-2">
                            <span className="text-muted-foreground">•</span>
                            {change}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Capacity trend over time */}
      {capacity && capacity.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Capacity Trend</CardTitle>
            <CardDescription>
              Healthcare resources over time in {countryName}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Year</th>
                    <th className="text-right py-2">Physicians</th>
                    <th className="text-right py-2">Nurses</th>
                    <th className="text-right py-2">Beds</th>
                    <th className="text-right py-2">Spending (%GDP)</th>
                  </tr>
                </thead>
                <tbody>
                  {capacity.slice(0, 10).map((row) => (
                    <tr key={row.id} className="border-b border-muted">
                      <td className="py-2 font-medium">{row.period_year}</td>
                      <td className="text-right py-2">
                        {row.physicians_per_10k?.toFixed(1) || '—'}
                      </td>
                      <td className="text-right py-2">
                        {row.nurses_per_10k?.toFixed(1) || '—'}
                      </td>
                      <td className="text-right py-2">
                        {row.hospital_beds_per_10k?.toFixed(1) || '—'}
                      </td>
                      <td className="text-right py-2">
                        {row.health_expenditure_pct_gdp?.toFixed(1) || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Source attribution */}
      <div className="text-xs text-muted-foreground">
        <p>
          <strong>Data sources:</strong> OECD Health Statistics, WHO Global Health Expenditure Database, 
          National Health Ministries
        </p>
        <p className="mt-1">
          <strong>Note:</strong> Policy documentation aims to be factual and descriptive. 
          Inclusion of a policy does not imply evaluation of its effectiveness. 
          Observed outcomes during policy periods may be influenced by many confounding factors.
        </p>
      </div>
    </div>
  );
}

export default HealthPolicyTimeline;
