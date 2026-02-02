import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Download, Database, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { triggerDataImport, getAvailableDataSources, getLastImportStatus, ImportResult } from '@/lib/dataImport/importService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function DataImportPanel() {
  const [selectedSources, setSelectedSources] = useState<string[]>(['scb', 'kolada']);
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>([]);
  const [result, setResult] = useState<ImportResult | null>(null);
  
  const queryClient = useQueryClient();
  const dataSources = getAvailableDataSources();
  
  const { data: importStatus } = useQuery({
    queryKey: ['import-status'],
    queryFn: getLastImportStatus
  });
  
  const importMutation = useMutation({
    mutationFn: (dryRun: boolean) => triggerDataImport({
      sources: selectedSources as ('scb' | 'kolada')[],
      indicators: selectedIndicators.length > 0 ? selectedIndicators : 'all',
      dryRun
    }),
    onSuccess: (data) => {
      setResult(data);
      if (!data.dryRun && data.success) {
        queryClient.invalidateQueries({ queryKey: ['import-status'] });
        queryClient.invalidateQueries({ queryKey: ['kpi-values'] });
      }
    }
  });
  
  const toggleSource = (sourceId: string) => {
    setSelectedSources(prev => 
      prev.includes(sourceId) 
        ? prev.filter(s => s !== sourceId)
        : [...prev, sourceId]
    );
  };
  
  const toggleIndicator = (indicatorKey: string) => {
    setSelectedIndicators(prev =>
      prev.includes(indicatorKey)
        ? prev.filter(i => i !== indicatorKey)
        : [...prev, indicatorKey]
    );
  };
  
  const allIndicators = dataSources
    .filter(ds => selectedSources.includes(ds.id))
    .flatMap(ds => ds.indicators);
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Dataimport från externa källor
          </CardTitle>
          <CardDescription>
            Hämta historiska data från SCB och Kolada för att fylla på KPI-värden
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Last import info */}
          {importStatus?.lastImport && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Senaste import: {new Date(importStatus.lastImport).toLocaleString('sv-SE')}
              </AlertDescription>
            </Alert>
          )}
          
          {/* Source selection */}
          <div>
            <h3 className="font-medium mb-3">Välj datakällor</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {dataSources.map(source => (
                <Card 
                  key={source.id}
                  className={`cursor-pointer transition-colors ${
                    selectedSources.includes(source.id) 
                      ? 'border-primary bg-primary/5' 
                      : 'hover:border-muted-foreground/50'
                  }`}
                  onClick={() => toggleSource(source.id)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{source.name}</CardTitle>
                      <Checkbox 
                        checked={selectedSources.includes(source.id)}
                        onCheckedChange={() => toggleSource(source.id)}
                      />
                    </div>
                    <CardDescription className="text-xs">
                      {source.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1">
                      {source.indicators.map(ind => (
                        <Badge key={ind.key} variant="secondary" className="text-xs">
                          {ind.name}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          {/* Indicator selection */}
          {selectedSources.length > 0 && (
            <div>
              <h3 className="font-medium mb-3">
                Välj indikatorer 
                <span className="text-muted-foreground font-normal ml-2">
                  (lämna tomt för alla)
                </span>
              </h3>
              <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                {allIndicators.map(indicator => (
                  <div 
                    key={indicator.key}
                    className="flex items-center space-x-2 p-2 rounded border hover:bg-muted/50 cursor-pointer"
                    onClick={() => toggleIndicator(indicator.key)}
                  >
                    <Checkbox 
                      checked={selectedIndicators.includes(indicator.key)}
                      onCheckedChange={() => toggleIndicator(indicator.key)}
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{indicator.name}</div>
                      <div className="text-xs text-muted-foreground">{indicator.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Action buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => importMutation.mutate(true)}
              disabled={importMutation.isPending || selectedSources.length === 0}
            >
              {importMutation.isPending && importMutation.variables === true ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Info className="mr-2 h-4 w-4" />
              )}
              Förhandsgranska
            </Button>
            <Button
              onClick={() => importMutation.mutate(false)}
              disabled={importMutation.isPending || selectedSources.length === 0}
            >
              {importMutation.isPending && importMutation.variables === false ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              Importera data
            </Button>
          </div>
          
          {/* Results */}
          {result && (
            <div className="space-y-4">
              {result.success ? (
                <Alert className="border-primary/50 bg-primary/5">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <AlertDescription>
                    {result.dryRun ? (
                      <>
                        <strong>Förhandsgranskning:</strong> {result.summary?.totalValues || 0} värden 
                        skulle importeras
                      </>
                    ) : (
                      <>
                        <strong>Import klar:</strong> {result.summary?.inserted || 0} värden 
                        importerades från {result.summary?.fetched || 0} hämtade
                      </>
                    )}
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Fel:</strong> {result.error}
                  </AlertDescription>
                </Alert>
              )}
              
              {/* Source breakdown */}
              {result.summary?.bySource && (
                <div className="grid gap-2 sm:grid-cols-2">
                  {Object.entries(result.summary.bySource).map(([source, data]) => (
                    <Card key={source} className="p-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium uppercase">{source}</span>
                        <Badge variant="outline">{data.fetched} värden</Badge>
                      </div>
                      {data.errors.length > 0 && (
                        <div className="mt-2 text-xs text-destructive">
                          {data.errors.length} fel
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              )}
              
              {/* Errors */}
              {result.summary?.errors && result.summary.errors.length > 0 && (
                <details className="text-sm">
                  <summary className="cursor-pointer text-destructive">
                    {result.summary.errors.length} fel
                  </summary>
                  <ul className="mt-2 space-y-1 text-muted-foreground">
                    {result.summary.errors.slice(0, 10).map((err, i) => (
                      <li key={i} className="text-xs">{err}</li>
                    ))}
                    {result.summary.errors.length > 10 && (
                      <li className="text-xs">...och {result.summary.errors.length - 10} till</li>
                    )}
                  </ul>
                </details>
              )}
              
              {/* Sample values for dry run */}
              {result.dryRun && result.summary?.sampleValues && result.summary.sampleValues.length > 0 && (
                <details className="text-sm">
                  <summary className="cursor-pointer">Exempelvärden</summary>
                  <div className="mt-2 overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-1">Indikator</th>
                          <th className="text-left p-1">Värde</th>
                          <th className="text-left p-1">Period</th>
                          <th className="text-left p-1">Källa</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.summary.sampleValues.map((v, i) => (
                          <tr key={i} className="border-b border-muted">
                            <td className="p-1">{v.indicator_key}</td>
                            <td className="p-1">{v.value}</td>
                            <td className="p-1">{v.period_start}</td>
                            <td className="p-1">{v.source}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </details>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
