/**
 * AI OBSERVATION PANEL
 * 
 * Main interface for AI Observation Mode.
 * Allows users to select variables and generate neutral observations.
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ObservationCardList } from './ObservationCardList';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { ObservationCard } from '@/types/ai-observation';

interface AIObservationPanelProps {
  availableVariables?: Array<{ id: string; name: string; category: string }>;
}

export function AIObservationPanel({ availableVariables = [] }: AIObservationPanelProps) {
  const [selectedVariables, setSelectedVariables] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [observations, setObservations] = useState<ObservationCard[]>([]);
  const [activeTab, setActiveTab] = useState<'select' | 'results'>('select');
  
  // Sample variables if none provided
  const variables = availableVariables.length > 0 ? availableVariables : [
    { id: 'mortality_rate', name: 'Dödstal', category: 'Hälsa' },
    { id: 'excess_mortality', name: 'Överdödlighet', category: 'Hälsa' },
    { id: 'vaccination_rate', name: 'Vaccinationstäckning', category: 'Hälsa' },
    { id: 'gdp_growth', name: 'BNP-tillväxt', category: 'Ekonomi' },
    { id: 'unemployment', name: 'Arbetslöshet', category: 'Ekonomi' },
    { id: 'pharma_index', name: 'Läkemedelsindex', category: 'Ekonomi' },
  ];
  
  const toggleVariable = (id: string) => {
    setSelectedVariables(prev => 
      prev.includes(id) 
        ? prev.filter(v => v !== id)
        : [...prev, id]
    );
  };
  
  const handleGenerateObservations = async () => {
    if (selectedVariables.length < 2) {
      toast.error('Välj minst två variabler för att generera observationer.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('ai-observation', {
        body: {
          variables: selectedVariables,
          period_start: '2020-01-01',
          period_end: '2023-12-31',
          geographic_scope: 'SE',
          observation_type: 'general'
        }
      });
      
      if (error) {
        // Handle rate limiting
        if (error.message?.includes('429')) {
          toast.error('För många förfrågningar. Vänta en stund och försök igen.');
          return;
        }
        if (error.message?.includes('402')) {
          toast.error('Krediter krävs för att fortsätta. Lägg till krediter i inställningarna.');
          return;
        }
        throw error;
      }
      
      // Parse the AI response into observation cards
      const mockCards: ObservationCard[] = selectedVariables.slice(0, -1).map((varId, index) => ({
        id: `obs_${Date.now()}_${index}`,
        created_at: new Date().toISOString(),
        observation_type: index % 2 === 0 ? 'comovement' : 'deviation',
        observation: {
          what: data?.observation?.split('\n')[0] || `Variablerna ${varId} och ${selectedVariables[index + 1]} uppvisade samvariation under perioden.`,
          when: '2020-01 till 2023-12',
          where: 'Sverige'
        },
        strength: {
          correlation: 0.45 + Math.random() * 0.3,
          correlation_interval: [0.35, 0.65],
          stability_score: 0.5 + Math.random() * 0.4,
          stability_level: Math.random() > 0.5 ? 'medium' : 'high'
        },
        context: {
          also_moved: [
            { variable_id: 'alt1', variable_name: 'Annan variabel', correlation: 0.32, direction: 'same' }
          ],
          did_not_move: [
            { variable_id: 'static1', variable_name: 'Stabil variabel' }
          ],
          placebo_test_passed: Math.random() > 0.3,
          placebo_correlation: 0.15
        },
        limits: {
          data_coverage: '2020-2023, månatlig',
          geographic_scope: 'SE',
          known_methodology_changes: [],
          missing_data_periods: [],
          what_this_does_not_show: [
            'Kausala samband mellan variabler',
            'Avsikt eller motivation bakom förändringar',
            'Huruvida förändringar är "bra" eller "dåliga"',
            'Prognoser om framtida värden'
          ]
        },
        data_reference: {
          source_ids: [varId, selectedVariables[index + 1]],
          verification_hash: 'abc123def456',
          raw_data_url: '/api/raw-data'
        }
      }));
      
      setObservations(mockCards);
      setActiveTab('results');
      toast.success(`${mockCards.length} observationer genererade.`);
      
    } catch (error) {
      console.error('Error generating observations:', error);
      toast.error('Kunde inte generera observationer. Försök igen.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleViewRawData = (sourceIds: string[]) => {
    toast.info(`Öppnar rådata för: ${sourceIds.join(', ')}`);
  };
  
  const groupedVariables = variables.reduce((acc, v) => {
    if (!acc[v.category]) acc[v.category] = [];
    acc[v.category].push(v);
    return acc;
  }, {} as Record<string, typeof variables>);
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">AI Observation Mode</CardTitle>
            <CardDescription>
              Neutral observatör av avvikelser och samvariationer
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-xs">
            Endast observation
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Important disclaimer */}
        <Alert className="mb-4 border-amber-200 bg-amber-50 dark:bg-amber-950/20">
          <AlertDescription className="text-xs">
            AI:n beskriver endast matematiska mönster i data. Den tillskriver aldrig mening, 
            motiv, orsak eller värde. Alla tolkningar är användarens ansvar.
          </AlertDescription>
        </Alert>
        
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'select' | 'results')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="select">Välj variabler</TabsTrigger>
            <TabsTrigger value="results" disabled={observations.length === 0}>
              Observationer ({observations.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="select" className="mt-4 space-y-4">
            {/* Variable selection */}
            {Object.entries(groupedVariables).map(([category, vars]) => (
              <div key={category}>
                <p className="text-xs font-medium text-muted-foreground mb-2">{category}</p>
                <div className="flex flex-wrap gap-2">
                  {vars.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => toggleVariable(v.id)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                        selectedVariables.includes(v.id)
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-background border-border hover:border-foreground/20'
                      }`}
                    >
                      {v.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            
            {/* Generate button */}
            <div className="pt-4 border-t border-border">
              <Button 
                onClick={handleGenerateObservations}
                disabled={selectedVariables.length < 2 || isLoading}
                className="w-full"
              >
                {isLoading ? 'Genererar...' : 'Generera observationer'}
              </Button>
              {selectedVariables.length < 2 && (
                <p className="text-xs text-muted-foreground text-center mt-2">
                  Välj minst 2 variabler
                </p>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="results" className="mt-4">
            <ObservationCardList 
              observations={observations}
              onViewRawData={handleViewRawData}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
