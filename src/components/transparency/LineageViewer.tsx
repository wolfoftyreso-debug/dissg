import React from 'react';
import { useEntityLineage, useLineageTrace } from '@/hooks/useDataLineage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  GitBranch, 
  ArrowRight, 
  Database, 
  BarChart3,
  Eye,
  Layers,
  Link2
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface LineageViewerProps {
  entityType: 'kpi_value' | 'observation' | 'analysis_chain' | 'master_index';
  entityId: string;
  title?: string;
}

export function LineageViewer({ entityType, entityId, title }: LineageViewerProps) {
  const { data: lineage, isLoading: lineageLoading } = useEntityLineage(entityType, entityId);
  const { data: trace, isLoading: traceLoading } = useLineageTrace(entityType, entityId, 3);

  const isLoading = lineageLoading || traceLoading;

  const getEntityIcon = (type: string) => {
    switch (type) {
      case 'kpi_value': return <BarChart3 className="h-4 w-4" />;
      case 'observation': return <Eye className="h-4 w-4" />;
      case 'analysis_chain': return <Layers className="h-4 w-4" />;
      case 'data_source': return <Database className="h-4 w-4" />;
      default: return <Link2 className="h-4 w-4" />;
    }
  };

  const getLinkTypeLabel = (type: string) => {
    switch (type) {
      case 'derived_from': return 'Härledd från';
      case 'aggregated_from': return 'Aggregerad från';
      case 'calculated_from': return 'Beräknad från';
      case 'triggered_by': return 'Utlöst av';
      case 'validated_by': return 'Validerad av';
      default: return type;
    }
  };

  const getLinkTypeColor = (type: string) => {
    switch (type) {
      case 'derived_from': return 'bg-blue-500/20 text-blue-400';
      case 'aggregated_from': return 'bg-purple-500/20 text-purple-400';
      case 'calculated_from': return 'bg-green-500/20 text-green-400';
      case 'triggered_by': return 'bg-orange-500/20 text-orange-400';
      case 'validated_by': return 'bg-cyan-500/20 text-cyan-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-card/50 border-border/50">
        <CardHeader className="pb-3">
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2].map(i => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <GitBranch className="h-4 w-4 text-primary" />
          {title || 'Data Lineage'}
          <Badge variant="outline" className="ml-auto text-xs">
            Spårbarhet
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upstream sources */}
        {lineage?.upstream && lineage.upstream.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Källor (Upstream)
            </h4>
            <div className="space-y-2">
              {lineage.upstream.map((link) => (
                <div 
                  key={link.id}
                  className="flex items-center gap-2 bg-muted/30 rounded-lg p-2"
                >
                  <div className="p-1.5 rounded bg-muted">
                    {getEntityIcon(link.source_type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium capitalize">
                        {link.source_type.replace('_', ' ')}
                      </span>
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${getLinkTypeColor(link.link_type)}`}
                      >
                        {getLinkTypeLabel(link.link_type)}
                      </Badge>
                    </div>
                    {link.transformation_applied && (
                      <span className="text-xs text-muted-foreground">
                        Transform: {link.transformation_applied}
                      </span>
                    )}
                    <div className="text-xs font-mono text-muted-foreground/60 truncate">
                      {link.source_checksum?.slice(0, 16)}...
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Current entity */}
        <div className="flex items-center justify-center py-2">
          <div className="flex items-center gap-2 bg-primary/20 rounded-lg px-4 py-2">
            {getEntityIcon(entityType)}
            <span className="text-sm font-medium capitalize">
              {entityType.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Downstream derivatives */}
        {lineage?.downstream && lineage.downstream.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Härledda (Downstream)
            </h4>
            <div className="space-y-2">
              {lineage.downstream.map((link) => (
                <div 
                  key={link.id}
                  className="flex items-center gap-2 bg-muted/30 rounded-lg p-2"
                >
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${getLinkTypeColor(link.link_type)}`}
                  >
                    {getLinkTypeLabel(link.link_type)}
                  </Badge>
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  <div className="p-1.5 rounded bg-muted">
                    {getEntityIcon(link.target_type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-medium capitalize">
                      {link.target_type.replace('_', ' ')}
                    </span>
                    <div className="text-xs font-mono text-muted-foreground/60 truncate">
                      {link.target_checksum?.slice(0, 16)}...
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lineage trace visualization */}
        {trace && trace.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-border/50">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Fullständig kedja ({trace.length} nivåer)
            </h4>
            <div className="flex items-center gap-1 overflow-x-auto pb-2">
              {trace.map((level, levelIndex) => (
                <React.Fragment key={levelIndex}>
                  <div className="flex flex-col gap-1">
                    {level.slice(0, 3).map((link) => (
                      <div 
                        key={link.id}
                        className="flex items-center gap-1 bg-muted/30 rounded px-2 py-1 text-xs"
                      >
                        {getEntityIcon(link.source_type)}
                        <span className="truncate max-w-[80px]">
                          {link.source_type}
                        </span>
                      </div>
                    ))}
                    {level.length > 3 && (
                      <span className="text-xs text-muted-foreground text-center">
                        +{level.length - 3} fler
                      </span>
                    )}
                  </div>
                  {levelIndex < trace.length - 1 && (
                    <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  )}
                </React.Fragment>
              ))}
              <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <div className="flex items-center gap-1 bg-primary/20 rounded px-2 py-1 text-xs">
                {getEntityIcon(entityType)}
                <span>Aktuell</span>
              </div>
            </div>
          </div>
        )}

        {/* Empty state */}
        {(!lineage?.upstream?.length && !lineage?.downstream?.length) && (
          <div className="text-center text-muted-foreground py-4">
            <GitBranch className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Ingen lineage-data tillgänglig</p>
            <p className="text-xs">Kopplingar skapas automatiskt vid databehandling</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
