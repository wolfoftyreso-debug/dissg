import React from 'react';
import { useKpiValueRevisions, useObservationRevisions, formatRevision } from '@/hooks/useDataLineage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  History, 
  CheckCircle, 
  AlertCircle, 
  GitBranch,
  Lock,
  FileCheck
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface RevisionHistoryProps {
  entityType: 'kpi_value' | 'observation';
  entityId: string;
  title?: string;
}

export function RevisionHistory({ entityType, entityId, title }: RevisionHistoryProps) {
  const { 
    data: kpiRevisions, 
    isLoading: kpiLoading 
  } = useKpiValueRevisions(entityType === 'kpi_value' ? entityId : null);
  
  const { 
    data: obsRevisions, 
    isLoading: obsLoading 
  } = useObservationRevisions(entityType === 'observation' ? entityId : null);

  const isLoading = kpiLoading || obsLoading;
  const revisions = entityType === 'kpi_value' ? kpiRevisions : obsRevisions;

  const getRevisionTypeColor = (type: string) => {
    switch (type) {
      case 'initial': return 'bg-blue-500/20 text-blue-400';
      case 'correction': return 'bg-yellow-500/20 text-yellow-400';
      case 'methodology_change': return 'bg-purple-500/20 text-purple-400';
      case 'data_update': return 'bg-green-500/20 text-green-400';
      case 'recalculation': return 'bg-orange-500/20 text-orange-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getRevisionTypeLabel = (type: string) => {
    switch (type) {
      case 'initial': return 'Initial';
      case 'correction': return 'Korrigering';
      case 'methodology_change': return 'Metodändring';
      case 'data_update': return 'Datauppdatering';
      case 'recalculation': return 'Omberäkning';
      default: return type;
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
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-16 w-full" />
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
          <History className="h-4 w-4 text-primary" />
          {title || 'Revisionshistorik'}
          <Badge variant="outline" className="ml-auto text-xs">
            <Lock className="h-3 w-3 mr-1" />
            Immutable
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          {revisions && revisions.length > 0 ? (
            <div className="space-y-3">
              {revisions.map((revision, index) => (
                <div 
                  key={revision.id}
                  className="relative pl-6 pb-3 border-l border-border/50 last:border-l-0"
                >
                  {/* Timeline dot */}
                  <div className="absolute left-0 top-0 -translate-x-1/2 w-3 h-3 rounded-full bg-primary border-2 border-background" />
                  
                  <div className="bg-muted/30 rounded-lg p-3 space-y-2">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-muted-foreground">
                        {formatRevision(revision as any)}
                      </span>
                      {'revision_type' in revision && (
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${getRevisionTypeColor(revision.revision_type)}`}
                        >
                          {getRevisionTypeLabel(revision.revision_type)}
                        </Badge>
                      )}
                    </div>
                    
                    {/* Content based on type */}
                    {entityType === 'kpi_value' && 'value' in revision && (
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-muted-foreground">Värde:</span>{' '}
                          <span className="font-mono">{revision.value}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Status:</span>{' '}
                          <Badge variant="outline" className="text-xs">
                            {revision.status}
                          </Badge>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Trend:</span>{' '}
                          <span>{revision.trend}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Konfidens:</span>{' '}
                          <span>{Math.round(revision.confidence * 100)}%</span>
                        </div>
                      </div>
                    )}
                    
                    {entityType === 'observation' && 'title' in revision && (
                      <div className="space-y-1 text-xs">
                        <div className="font-medium">{revision.title}</div>
                        <div className="text-muted-foreground line-clamp-2">
                          {revision.description}
                        </div>
                        <div className="flex gap-2">
                          <span className="text-muted-foreground">
                            Signal: {Math.round(revision.signal_strength * 100)}%
                          </span>
                          <span className="text-muted-foreground">
                            Modell: {revision.model_version}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    {/* Checksum */}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground/70 font-mono">
                      <FileCheck className="h-3 w-3" />
                      <span className="truncate" title={revision.checksum}>
                        {revision.checksum?.slice(0, 16)}...
                      </span>
                      {revision.previous_checksum && (
                        <>
                          <GitBranch className="h-3 w-3 ml-2" />
                          <span className="truncate" title={revision.previous_checksum}>
                            ← {revision.previous_checksum?.slice(0, 8)}...
                          </span>
                        </>
                      )}
                    </div>
                    
                    {/* Reason if present */}
                    {'revision_reason' in revision && revision.revision_reason && (
                      <div className="text-xs text-muted-foreground italic">
                        "{revision.revision_reason}"
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Ingen revisionshistorik tillgänglig</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
