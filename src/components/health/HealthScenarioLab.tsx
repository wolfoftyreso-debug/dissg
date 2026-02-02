/**
 * HEALTH SCENARIO LAB
 * 
 * Historical analogue exploration.
 * NOT predictions. NOT recommendations.
 * Shows what happened in similar situations.
 */

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, History, ArrowRight } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScenarioWarning } from './HealthDisclaimer';
import { supabase } from '@/integrations/supabase/client';

interface HealthScenarioLabProps {
  countryCode: string;
  countryName: string;
}

const SCENARIO_CATEGORIES = [
  { value: 'all', label: 'All Scenarios' },
  { value: 'demographic', label: 'Demographic Change' },
  { value: 'policy', label: 'Policy Change' },
  { value: 'crisis', label: 'Crisis Response' },
  { value: 'reform', label: 'System Reform' }
];

export function HealthScenarioLab({ countryCode, countryName }: HealthScenarioLabProps) {
  const [category, setCategory] = useState<string>('all');
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);

  // Fetch scenario analogues
  const { data: scenarios, isLoading } = useQuery({
    queryKey: ['health-scenarios', category],
    queryFn: async () => {
      let query = supabase
        .from('health_scenario_analogues')
        .select('*')
        .order('name');
      
      if (category !== 'all') {
        query = query.eq('category', category);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  const selectedScenarioData = scenarios?.find(s => s.id === selectedScenario);

  return (
    <div className="space-y-6">
      {/* Prominent warning */}
      <ScenarioWarning />

      {/* Explanation */}
      <Alert>
        <History className="h-4 w-4" />
        <AlertTitle>Historical Analogue Exploration</AlertTitle>
        <AlertDescription>
          This lab allows you to explore what happened in historical situations 
          that share characteristics with potential future scenarios. 
          <strong> These are observations, not predictions.</strong> Past outcomes 
          may not apply to current or future contexts.
        </AlertDescription>
      </Alert>

      {/* Controls */}
      <div className="flex gap-3">
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Scenario type" />
          </SelectTrigger>
          <SelectContent>
            {SCENARIO_CATEGORIES.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Scenario list */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Available Analogues</CardTitle>
            <CardDescription>
              Historical situations with documented outcomes
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : !scenarios?.length ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No historical analogues available yet.</p>
                <p className="text-sm mt-2">
                  Analogues will be curated from academic research, 
                  historical health data, and policy evaluations.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {scenarios.map((scenario) => (
                  <button
                    key={scenario.id}
                    onClick={() => setSelectedScenario(scenario.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedScenario === scenario.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50 hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium">{scenario.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {scenario.base_country_code} • 
                          {new Date(scenario.base_period_start).getFullYear()}–
                          {new Date(scenario.base_period_end).getFullYear()}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {scenario.category}
                      </Badge>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Scenario detail */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {selectedScenarioData?.name || 'Select an Analogue'}
            </CardTitle>
            {selectedScenarioData && (
              <CardDescription>
                Based on {selectedScenarioData.base_country_code}, 
                {' '}{new Date(selectedScenarioData.base_period_start).getFullYear()}–
                {new Date(selectedScenarioData.base_period_end).getFullYear()}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {!selectedScenarioData ? (
              <p className="text-muted-foreground">
                Select a historical analogue from the list to see what was observed.
              </p>
            ) : (
              <div className="space-y-4">
                {/* Description */}
                {selectedScenarioData.description && (
                  <p className="text-sm">{selectedScenarioData.description}</p>
                )}

                {/* Key characteristics */}
                {selectedScenarioData.key_characteristics && (
                  <div>
                    <h4 className="font-medium text-sm mb-2">Defining Characteristics</h4>
                    <div className="bg-muted/50 rounded-lg p-3 text-sm">
                      <pre className="whitespace-pre-wrap font-sans">
                        {JSON.stringify(selectedScenarioData.key_characteristics, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Observed outcomes */}
                {selectedScenarioData.observed_outcomes && (
                  <div>
                    <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                      <ArrowRight className="h-4 w-4" />
                      What Was Observed
                    </h4>
                    <div className="bg-muted/50 rounded-lg p-3 text-sm">
                      <pre className="whitespace-pre-wrap font-sans">
                        {JSON.stringify(selectedScenarioData.observed_outcomes, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Uncertainty factors */}
                {selectedScenarioData.uncertainty_factors && 
                 selectedScenarioData.uncertainty_factors.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                      Uncertainty Factors
                    </h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      {selectedScenarioData.uncertainty_factors.map((factor, i) => (
                        <li key={i}>• {factor}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Reminder */}
                <div className="pt-4 border-t">
                  <p className="text-xs text-muted-foreground italic">
                    This historical analogue describes what was observed in a specific 
                    context. Outcomes were influenced by factors unique to that time 
                    and place. Application to other contexts requires careful consideration 
                    of differences.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Source attribution */}
      <div className="text-xs text-muted-foreground">
        <p>
          <strong>Methodology:</strong> Historical analogues are identified from 
          peer-reviewed literature, official health statistics, and policy evaluations. 
          Each analogue includes documented uncertainty factors and limitations.
        </p>
        <p className="mt-1">
          <strong>Limitation:</strong> Historical patterns do not determine future outcomes. 
          This exploration tool is for research and understanding, not decision-making.
        </p>
      </div>
    </div>
  );
}

export default HealthScenarioLab;
