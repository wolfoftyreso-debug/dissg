/**
 * EU Cluster View - Visar regionkluster baserat på liknande profiler
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, MapPin } from 'lucide-react';
import { useEuClusters, useEuClusterMembers } from '@/hooks/useEuData';
import { euClusterTypes } from '@/config/euConfig';

export function EuClusterView() {
  const [selectedCluster, setSelectedCluster] = useState<string | undefined>();
  const { data: clusters, isLoading } = useEuClusters();
  const { data: members } = useEuClusterMembers(selectedCluster);

  // Group clusters by type
  const clustersByType = clusters?.reduce((acc, cluster) => {
    if (!acc[cluster.cluster_type]) acc[cluster.cluster_type] = [];
    acc[cluster.cluster_type].push(cluster);
    return acc;
  }, {} as Record<string, typeof clusters>) || {};

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6 h-40" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Info banner */}
      <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-purple-500/20">
              <Users className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold">EU Regionkluster</h2>
              <p className="text-muted-foreground">
                Regioner grupperade efter liknande profiler - oberoende av nationsgränser.
                Klustren uppdateras baserat på senaste data och hjälper till att identifiera
                mönster och jämförbara regioner.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cluster types */}
      <Tabs defaultValue="economic">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          {Object.entries(euClusterTypes).map(([key, config]) => (
            <TabsTrigger key={key} value={key} className="gap-2">
              <span>{config.icon}</span>
              {config.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(euClusterTypes).map(([typeKey, typeConfig]) => (
          <TabsContent key={typeKey} value={typeKey} className="space-y-4">
            <p className="text-sm text-muted-foreground">{typeConfig.description}</p>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {(clustersByType[typeKey] || []).map(cluster => (
                <ClusterCard
                  key={cluster.id}
                  cluster={cluster}
                  isSelected={selectedCluster === cluster.id}
                  onSelect={() => setSelectedCluster(
                    selectedCluster === cluster.id ? undefined : cluster.id
                  )}
                />
              ))}
              {(clustersByType[typeKey] || []).length === 0 && (
                <Card className="col-span-full">
                  <CardContent className="p-8 text-center text-muted-foreground">
                    Inga kluster av denna typ ännu
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Selected cluster members */}
      {selectedCluster && members && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Klustermedlemmar
              <Badge variant="secondary" className="ml-auto">
                {members.length} regioner
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
              {members.map(member => (
                <div
                  key={member.id}
                  className="flex items-center gap-3 p-3 rounded-lg border bg-card"
                >
                  <div className="p-2 rounded bg-primary/10">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{member.nuts_code}</div>
                    <div className="text-xs text-muted-foreground">{member.country_code}</div>
                  </div>
                  <Badge variant="outline">
                    {Math.round((member.membership_score || 0) * 100)}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface ClusterCardProps {
  cluster: {
    id: string;
    code: string;
    name: string;
    description: string | null;
    cluster_type: string;
    member_count: number | null;
    centroid_values: Record<string, number>;
  };
  isSelected: boolean;
  onSelect: () => void;
}

function ClusterCard({ cluster, isSelected, onSelect }: ClusterCardProps) {
  const typeConfig = euClusterTypes[cluster.cluster_type as keyof typeof euClusterTypes];

  return (
    <Card 
      className={`cursor-pointer transition-all ${isSelected ? 'ring-2 ring-primary' : 'hover:shadow-md'}`}
      onClick={onSelect}
    >
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <span className="text-lg">{typeConfig?.icon}</span>
          {cluster.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {cluster.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {cluster.description}
          </p>
        )}

        {/* Centroid values */}
        {Object.keys(cluster.centroid_values || {}).length > 0 && (
          <div className="space-y-2">
            <div className="text-xs font-medium text-muted-foreground">Genomsnittsprofil:</div>
            <div className="flex flex-wrap gap-1">
              {Object.entries(cluster.centroid_values).slice(0, 3).map(([key, value]) => (
                <Badge key={key} variant="secondary" className="text-xs">
                  {key}: {typeof value === 'number' ? value.toFixed(0) : value}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-1 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{cluster.member_count || 0} regioner</span>
          </div>
          <Button variant={isSelected ? "default" : "outline"} size="sm">
            {isSelected ? 'Vald' : 'Visa'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default EuClusterView;
