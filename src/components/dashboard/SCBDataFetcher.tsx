import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  RefreshCw, 
  Database, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';
import { toast } from 'sonner';

interface SCBFetchResult {
  success: boolean;
  source: string;
  table: string;
  kpi_code: string;
  kpi_name?: string;
  value: number;
  previous_value?: number;
  unit?: string;
  trend: 'up' | 'down' | 'stable';
  trend_percent: number;
  period: string;
  inserted: boolean;
  historical_values?: Array<{ period: string; value: number }>;
  error?: string;
}

const AVAILABLE_TABLES = [
  { key: 'population', label: 'Befolkning', description: 'Folkmängd per månad', kpi: 'A1' },
  { key: 'population_yearly', label: 'Befolkning (år)', description: 'Folkmängd per år', kpi: 'A1' },
];

export function SCBDataFetcher() {
  const [results, setResults] = useState<Record<string, SCBFetchResult>>({});
  const queryClient = useQueryClient();

  const fetchMutation = useMutation({
    mutationFn: async (tableKey: string) => {
      const response = await supabase.functions.invoke('scb-fetch', {
        body: { table_key: tableKey },
      });
      
      if (response.error) throw response.error;
      return { tableKey, result: response.data as SCBFetchResult };
    },
    onSuccess: ({ tableKey, result }) => {
      setResults(prev => ({ ...prev, [tableKey]: result }));
      if (result.success) {
        toast.success(`Hämtade ${result.value} ${result.unit || ''} från SCB`);
        queryClient.invalidateQueries({ queryKey: ['kpi_values'] });
      } else {
        toast.error(result.error || 'Kunde inte hämta data');
      }
    },
    onError: (error) => {
      console.error('SCB fetch error:', error);
      toast.error('Kunde inte ansluta till SCB API');
    },
  });

  const fetchAllMutation = useMutation({
    mutationFn: async () => {
      const promises = AVAILABLE_TABLES.map(table =>
        supabase.functions.invoke('scb-fetch', {
          body: { table_key: table.key },
        }).then(response => ({
          tableKey: table.key,
          result: response.data as SCBFetchResult,
        }))
      );
      return Promise.all(promises);
    },
    onSuccess: (allResults) => {
      const newResults: Record<string, SCBFetchResult> = {};
      for (const { tableKey, result } of allResults) {
        newResults[tableKey] = result;
      }
      setResults(prev => ({ ...prev, ...newResults }));
      
      const successCount = allResults.filter(r => r.result?.success).length;
      toast.success(`Hämtade data från ${successCount}/${allResults.length} tabeller`);
      queryClient.invalidateQueries({ queryKey: ['kpi_values'] });
    },
    onError: (error) => {
      console.error('SCB fetch all error:', error);
      toast.error('Kunde inte hämta all data från SCB');
    },
  });

  const TrendIcon = ({ trend }: { trend: 'up' | 'down' | 'stable' }) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-muted-foreground" />;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-primary" />
            <CardTitle className="text-base">SCB PxWebApi Integration</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchAllMutation.mutate()}
            disabled={fetchAllMutation.isPending}
          >
            {fetchAllMutation.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Uppdatera alla
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Hämta officiell statistik direkt från Statistiska Centralbyrån (SCB).
        </p>

        <div className="grid gap-3">
          {AVAILABLE_TABLES.map((table) => {
            const result = results[table.key];
            const isLoading = fetchMutation.isPending && fetchMutation.variables === table.key;
            
            return (
              <div
                key={table.key}
                className="flex items-center justify-between p-3 rounded-lg border bg-card"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{table.label}</span>
                    <Badge variant="outline" className="text-[10px]">
                      {table.kpi}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{table.description}</p>
                  
                  {result?.success && (
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-lg font-bold">
                        {result.value.toFixed(2)} {result.unit}
                      </span>
                      <div className="flex items-center gap-1">
                        <TrendIcon trend={result.trend} />
                        <span className={`text-xs ${
                          result.trend === 'up' ? 'text-green-600' : 
                          result.trend === 'down' ? 'text-red-600' : 
                          'text-muted-foreground'
                        }`}>
                          {result.trend_percent > 0 ? '+' : ''}{result.trend_percent.toFixed(2)}%
                        </span>
                      </div>
                      <Badge variant="secondary" className="text-[10px]">
                        {result.period}
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {result?.success && (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  )}
                  {result && !result.success && (
                    <AlertCircle className="w-4 h-4 text-red-600" />
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => fetchMutation.mutate(table.key)}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-xs text-muted-foreground pt-2 border-t">
          <span className="font-medium">Källa:</span> api.scb.se • PxWebApi v1 • Öppen data
        </div>
      </CardContent>
    </Card>
  );
}

export default SCBDataFetcher;
