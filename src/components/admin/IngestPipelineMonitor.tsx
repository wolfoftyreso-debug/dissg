/**
 * Ingest Pipeline Monitor - Admin dashboard for data pipelines
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Database, RefreshCw, CheckCircle, XCircle, Clock, 
  Layers, ArrowDownToLine, GitBranch, Sparkles, Settings,
  Activity, AlertTriangle
} from 'lucide-react';
import { ingestLayers, pipelineStatusConfig, globalDataSourcesCatalog, getTotalIndicators, getTotalSources } from '@/config/globalExpansionConfig';
import { useIngestSources, usePipelineRuns, useIngestStats, useSemanticConcepts } from '@/hooks/useIngestPipelines';

export function IngestPipelineMonitor() {
  const { data: sources, isLoading: loadingSources } = useIngestSources({ isActive: true });
  const { data: runs } = usePipelineRuns({ limit: 20 });
  const { data: stats } = useIngestStats();
  const { data: concepts } = useSemanticConcepts();

  const layerIcons = {
    layer1: ArrowDownToLine,
    layer2: GitBranch,
    layer3: Layers,
    layer4: Sparkles,
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Database className="h-8 w-8 text-primary" />
              <div>
                <div className="text-2xl font-bold">{sources?.length || 0}</div>
                <div className="text-sm text-muted-foreground">Aktiva källor</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <div className="text-2xl font-bold">{stats?.successfulRuns || 0}</div>
                <div className="text-sm text-muted-foreground">Lyckade (24h)</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <XCircle className="h-8 w-8 text-red-500" />
              <div>
                <div className="text-2xl font-bold">{stats?.failedRuns || 0}</div>
                <div className="text-sm text-muted-foreground">Misslyckade</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Activity className="h-8 w-8 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">{getTotalIndicators().toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Indikatorer</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 4-Layer Architecture */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            4-lagers ingest-arkitektur
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            {Object.entries(ingestLayers).map(([key, layer]) => {
              const Icon = layerIcons[key as keyof typeof layerIcons];
              return (
                <div key={key} className="p-4 rounded-lg border bg-card/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="h-5 w-5 text-primary" />
                    <span className="font-medium">{layer.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">{layer.description}</p>
                  <ul className="text-xs space-y-1">
                    {layer.responsibilities.slice(0, 3).map((r, i) => (
                      <li key={i} className="flex items-center gap-1">
                        <span className="text-green-500">✓</span> {r}
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-primary mt-2 font-medium">{layer.principle}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="sources" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sources">Datakällor</TabsTrigger>
          <TabsTrigger value="runs">Pipeline-körningar</TabsTrigger>
          <TabsTrigger value="concepts">Semantik</TabsTrigger>
        </TabsList>

        <TabsContent value="sources">
          <Card>
            <CardHeader>
              <CardTitle>Globala datakällor ({getTotalSources()})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(globalDataSourcesCatalog).map(([region, regionSources]) => (
                  <div key={region}>
                    <h4 className="font-medium capitalize mb-2">{region}</h4>
                    <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                      {regionSources.map(source => {
                        const dbSource = sources?.find(s => s.code === source.code);
                        return (
                          <div key={source.code} className="p-3 rounded-lg border bg-muted/30">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-sm">{source.name}</span>
                              <Badge variant={dbSource ? 'default' : 'outline'} className="text-xs">
                                {dbSource ? 'Aktiv' : 'Ej kopplad'}
                              </Badge>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {source.indicators.toLocaleString()} indikatorer • {source.schedule}
                            </div>
                            {dbSource?.last_success_at && (
                              <div className="text-xs text-green-500 mt-1">
                                Senast: {new Date(dbSource.last_success_at).toLocaleDateString('sv-SE')}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="runs">
          <Card>
            <CardHeader>
              <CardTitle>Senaste pipeline-körningar</CardTitle>
            </CardHeader>
            <CardContent>
              {runs && runs.length > 0 ? (
                <div className="space-y-2">
                  {runs.map(run => {
                    const statusConfig = pipelineStatusConfig[run.status as keyof typeof pipelineStatusConfig] || pipelineStatusConfig.pending;
                    return (
                      <div key={run.id} className="p-3 rounded-lg border flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{statusConfig.icon}</span>
                          <div>
                            <div className="font-medium">{run.source_code}</div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(run.started_at).toLocaleString('sv-SE')}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right text-sm">
                            <div>{run.records_fetched} hämtade</div>
                            <div className="text-xs text-muted-foreground">
                              {run.duration_ms ? `${run.duration_ms}ms` : '-'}
                            </div>
                          </div>
                          <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Inga körningar ännu
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="concepts">
          <Card>
            <CardHeader>
              <CardTitle>Centralt begreppsbibliotek</CardTitle>
            </CardHeader>
            <CardContent>
              {concepts && concepts.length > 0 ? (
                <div className="grid gap-2 md:grid-cols-3">
                  {concepts.map(concept => (
                    <div key={concept.id} className="p-3 rounded-lg border">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{concept.name}</span>
                        <Badge variant="outline" className="text-xs">{concept.category}</Badge>
                      </div>
                      <code className="text-xs text-muted-foreground">{concept.code}</code>
                      {concept.definition && (
                        <p className="text-xs text-muted-foreground mt-1">{concept.definition}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Laddar begrepp...
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Key Principle */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Grundregel:</strong> En källa = en pipeline. Systemet är byggt för att hantera kaos – 
          ojämn data, avbrott och variation är förväntade och inbyggda. 95% av samhällsdata är batch – 
          acceptera det.
        </AlertDescription>
      </Alert>
    </div>
  );
}

export default IngestPipelineMonitor;
