/**
 * SUBSTANCE PROFILE VIEW
 * 
 * Neutral presentation of substance-related data.
 * No moral judgments. No recommendations. Just data.
 */

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InterpretationGuide } from './HealthGuardrailBlock';
import { generateInterpretationGuide } from '@/lib/health/formatters';
import { supabase } from '@/integrations/supabase/client';

interface SubstanceProfileViewProps {
  countryCode: string;
  countryName: string;
}

const CHEMICAL_CLASSES = [
  { value: 'all', label: 'All Substances' },
  { value: 'alcohol', label: 'Alcohol' },
  { value: 'nicotine', label: 'Tobacco/Nicotine' },
  { value: 'cannabinoid', label: 'Cannabis' },
  { value: 'opioid', label: 'Opioids' },
  { value: 'stimulant', label: 'Stimulants' },
  { value: 'depressant', label: 'Depressants' },
  { value: 'hallucinogen', label: 'Hallucinogens' }
];

export function SubstanceProfileView({ countryCode, countryName }: SubstanceProfileViewProps) {
  const [chemicalClass, setChemicalClass] = useState<string>('all');
  const [selectedSubstance, setSelectedSubstance] = useState<string | null>(null);

  // Fetch substance profiles
  const { data: substances, isLoading: loadingSubstances } = useQuery({
    queryKey: ['substance-profiles', chemicalClass],
    queryFn: async () => {
      let query = supabase
        .from('substance_profiles')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (chemicalClass !== 'all') {
        query = query.eq('chemical_class', chemicalClass);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  // Fetch data for selected substance
  const { data: substanceData, isLoading: loadingData } = useQuery({
    queryKey: ['substance-data', selectedSubstance, countryCode],
    queryFn: async () => {
      if (!selectedSubstance) return null;
      
      const [dataResult, legalResult] = await Promise.all([
        supabase
          .from('substance_data')
          .select('*')
          .eq('substance_id', selectedSubstance)
          .eq('country_code', countryCode)
          .order('period_start', { ascending: false }),
        supabase
          .from('substance_legal_status')
          .select('*')
          .eq('substance_id', selectedSubstance)
          .eq('country_code', countryCode)
          .order('effective_from', { ascending: true })
      ]);
      
      if (dataResult.error) throw dataResult.error;
      if (legalResult.error) throw legalResult.error;
      
      return {
        data: dataResult.data,
        legalHistory: legalResult.data
      };
    },
    enabled: !!selectedSubstance
  });

  const guide = generateInterpretationGuide('substance_prevalence');

  return (
    <div className="space-y-6">
      {/* Interpretation guide */}
      <InterpretationGuide shows={guide.shows} doesNotShow={guide.doesNotShow} />

      {/* Controls */}
      <div className="flex gap-3">
        <Select value={chemicalClass} onValueChange={setChemicalClass}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Chemical class" />
          </SelectTrigger>
          <SelectContent>
            {CHEMICAL_CLASSES.map((cc) => (
              <SelectItem key={cc.value} value={cc.value}>
                {cc.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Substance list */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Substances</CardTitle>
            <CardDescription>
              Select a substance to view data
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingSubstances ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : !substances?.length ? (
              <p className="text-sm text-muted-foreground">
                No substance profiles available. Data will be loaded from EMCDDA, UNODC, and WHO sources.
              </p>
            ) : (
              <div className="space-y-1">
                {substances.map((substance) => (
                  <button
                    key={substance.id}
                    onClick={() => setSelectedSubstance(substance.id)}
                    className={`w-full text-left p-2 rounded-lg transition-colors ${
                      selectedSubstance === substance.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <p className="font-medium">{substance.name}</p>
                    {substance.chemical_class && (
                      <Badge variant="outline" className="mt-1 text-xs">
                        {substance.chemical_class}
                      </Badge>
                    )}
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Substance detail */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">
              {selectedSubstance 
                ? substances?.find(s => s.id === selectedSubstance)?.name || 'Substance Data'
                : 'Select a Substance'
              }
            </CardTitle>
            <CardDescription>
              Population-level data for {countryName}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!selectedSubstance ? (
              <p className="text-muted-foreground">
                Select a substance from the list to view prevalence, mortality, 
                and legal status data.
              </p>
            ) : loadingData ? (
              <Skeleton className="h-[200px] w-full" />
            ) : !substanceData?.data?.length && !substanceData?.legalHistory?.length ? (
              <p className="text-muted-foreground">
                No data available for this substance in {countryName}.
              </p>
            ) : (
              <Tabs defaultValue="prevalence">
                <TabsList>
                  <TabsTrigger value="prevalence">Prevalence</TabsTrigger>
                  <TabsTrigger value="mortality">Mortality</TabsTrigger>
                  <TabsTrigger value="legal">Legal Status</TabsTrigger>
                </TabsList>
                
                <TabsContent value="prevalence" className="mt-4">
                  <SubstanceDataTable 
                    data={substanceData?.data?.filter(d => d.measure_type === 'prevalence') || []}
                    measureType="prevalence"
                  />
                </TabsContent>
                
                <TabsContent value="mortality" className="mt-4">
                  <SubstanceDataTable 
                    data={substanceData?.data?.filter(d => 
                      d.measure_type === 'mortality' || d.measure_type === 'overdose'
                    ) || []}
                    measureType="mortality"
                  />
                </TabsContent>
                
                <TabsContent value="legal" className="mt-4">
                  <LegalStatusTimeline 
                    history={substanceData?.legalHistory || []}
                  />
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Source attribution */}
      <div className="text-xs text-muted-foreground">
        <p>
          <strong>Data sources:</strong> EMCDDA, UNODC World Drug Report, WHO, 
          National Public Health Agencies
        </p>
        <p className="mt-1">
          <strong>Important:</strong> This platform presents observational data only. 
          It does not make value judgments about substance use and does not provide 
          advice about individual behavior. Data may reflect reporting biases and 
          methodological differences between countries.
        </p>
      </div>
    </div>
  );
}

function SubstanceDataTable({ 
  data, 
  measureType 
}: { 
  data: Array<{
    id: string;
    period_start: string;
    period_end: string;
    value: number;
    unit: string;
    age_group: string;
    data_source_code: string;
  }>;
  measureType: string;
}) {
  if (!data.length) {
    return (
      <p className="text-muted-foreground">
        No {measureType} data available.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {data.map((item) => (
        <div 
          key={item.id}
          className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
        >
          <div>
            <p className="font-medium">
              {new Date(item.period_start).getFullYear()}
              {item.period_end !== item.period_start && 
                `–${new Date(item.period_end).getFullYear()}`
              }
            </p>
            <p className="text-xs text-muted-foreground">
              {item.age_group === 'all' ? 'All ages' : item.age_group}
            </p>
          </div>
          <div className="text-right">
            <p className="font-mono font-medium">
              {item.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-muted-foreground">{item.unit}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function LegalStatusTimeline({ 
  history 
}: { 
  history: Array<{
    id: string;
    status: string;
    schedule?: string;
    effective_from: string;
    effective_to?: string;
    notes?: string;
  }>;
}) {
  if (!history.length) {
    return (
      <p className="text-muted-foreground">
        No legal status history available.
      </p>
    );
  }

  const statusColors: Record<string, string> = {
    prohibited: 'bg-destructive/20 text-destructive border-destructive/50',
    controlled: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-300',
    prescription: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300',
    decriminalized: 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/30 dark:text-orange-300',
    legal: 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-300',
    otc: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400'
  };

  return (
    <div className="space-y-3">
      {history.map((item, index) => (
        <div 
          key={item.id}
          className="flex gap-4"
        >
          <div className="flex flex-col items-center">
            <div className="w-3 h-3 rounded-full bg-primary" />
            {index < history.length - 1 && (
              <div className="w-0.5 h-full bg-border" />
            )}
          </div>
          <div className="flex-1 pb-4">
            <p className="text-sm font-medium">
              {new Date(item.effective_from).getFullYear()}
              {item.effective_to 
                ? `–${new Date(item.effective_to).getFullYear()}`
                : '–present'
              }
            </p>
            <Badge 
              variant="outline" 
              className={statusColors[item.status] || ''}
            >
              {item.status}
              {item.schedule && ` (${item.schedule})`}
            </Badge>
            {item.notes && (
              <p className="text-xs text-muted-foreground mt-1">
                {item.notes}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default SubstanceProfileView;
