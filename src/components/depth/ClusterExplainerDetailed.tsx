import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import {
  Layers,
  TrendingUp,
  TrendingDown,
  Minus,
  Info,
  ChevronDown,
  BarChart3,
  MapPin,
  Scale,
} from 'lucide-react';

// =====================================================
// DEL XVI — KLUSTERLOGIK (MYCKET VIKTIGT)
// Kluster är inte geografi. De är mönster.
// =====================================================

interface ClusterDatapoint {
  id: string;
  name: string;
  value: number;
  nationalAverage: number;
  unit: string;
  direction: 'positive' | 'negative' | 'neutral';
  weight: number;
}

interface ClusterDefinition {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  memberType: 'kommun' | 'stadsdel' | 'område';
  characteristics: ClusterDatapoint[];
  exampleAreas: string[];
  trendDirection: 'improving' | 'declining' | 'stable';
  trendMagnitude: number;
}

const DEMO_CLUSTERS: ClusterDefinition[] = [
  {
    id: 'cluster_1',
    name: 'Hög vårdkonsumtion + låg arbetsförmåga',
    description: 'Områden med signifikant högre vårdkonsumtion och lägre sysselsättningsgrad än rikssnitt.',
    memberCount: 42,
    memberType: 'kommun',
    trendDirection: 'declining',
    trendMagnitude: -1.2,
    exampleAreas: ['Området A', 'Området B', 'Området C'],
    characteristics: [
      { id: '1', name: 'Vårdkonsumtion per capita', value: 52300, nationalAverage: 41800, unit: 'SEK/år', direction: 'negative', weight: 0.35 },
      { id: '2', name: 'Sysselsättningsgrad 20-64', value: 64.2, nationalAverage: 78.4, unit: '%', direction: 'negative', weight: 0.30 },
      { id: '3', name: 'Långtidssjukskrivning', value: 8.7, nationalAverage: 5.2, unit: '%', direction: 'negative', weight: 0.20 },
      { id: '4', name: 'Medianinkomst', value: 248000, nationalAverage: 312000, unit: 'SEK', direction: 'negative', weight: 0.15 },
    ],
  },
  {
    id: 'cluster_2',
    name: 'Ung befolkning + stigande sysselsättning',
    description: 'Områden med ung demografisk profil och positiv arbetsmarknadsutveckling.',
    memberCount: 67,
    memberType: 'kommun',
    trendDirection: 'improving',
    trendMagnitude: 1.8,
    exampleAreas: ['Området D', 'Området E', 'Området F'],
    characteristics: [
      { id: '1', name: 'Medelålder', value: 38.2, nationalAverage: 41.8, unit: 'år', direction: 'positive', weight: 0.25 },
      { id: '2', name: 'Sysselsättningsgrad förändring', value: 2.4, nationalAverage: 0.5, unit: '%/år', direction: 'positive', weight: 0.35 },
      { id: '3', name: 'Nystartade företag', value: 14.2, nationalAverage: 8.7, unit: '/1000 inv', direction: 'positive', weight: 0.25 },
      { id: '4', name: 'Inflyttningsnetto', value: 12.5, nationalAverage: 0.0, unit: '/1000 inv', direction: 'positive', weight: 0.15 },
    ],
  },
  {
    id: 'cluster_3',
    name: 'Snabb försämring senaste 24 mån',
    description: 'Områden med hastigt försämrade nyckeltal under de senaste två åren.',
    memberCount: 28,
    memberType: 'kommun',
    trendDirection: 'declining',
    trendMagnitude: -2.8,
    exampleAreas: ['Området G', 'Området H'],
    characteristics: [
      { id: '1', name: 'Masterindex förändring 24m', value: -4.2, nationalAverage: 0.3, unit: 'p.e.', direction: 'negative', weight: 0.40 },
      { id: '2', name: 'Arbetslöshetsökning', value: 3.1, nationalAverage: 0.2, unit: '%', direction: 'negative', weight: 0.30 },
      { id: '3', name: 'Befolkningsminskning', value: -1.8, nationalAverage: 0.5, unit: '%', direction: 'negative', weight: 0.20 },
      { id: '4', name: 'Företagskonkurser', value: 2.8, nationalAverage: 1.2, unit: '/1000', direction: 'negative', weight: 0.10 },
    ],
  },
];

// =====================================================
// DATAPOINT CARD
// =====================================================

interface DatapointCardProps {
  datapoint: ClusterDatapoint;
}

function DatapointCard({ datapoint }: DatapointCardProps) {
  const diff = datapoint.value - datapoint.nationalAverage;
  const diffPercent = ((diff / datapoint.nationalAverage) * 100);
  const isPositive = datapoint.direction === 'positive';
  
  return (
    <div className="bg-muted/50 rounded-lg p-3 space-y-2">
      <div className="flex items-start justify-between">
        <span className="text-xs font-medium">{datapoint.name}</span>
        <Badge 
          variant={isPositive ? 'default' : 'destructive'}
          className="text-[10px] shrink-0"
        >
          {diffPercent > 0 ? '+' : ''}{diffPercent.toFixed(1)}%
        </Badge>
      </div>
      
      <div className="flex items-end justify-between">
        <div>
          <p className="text-lg font-bold">
            {typeof datapoint.value === 'number' && datapoint.value >= 1000 
              ? datapoint.value.toLocaleString('sv-SE') 
              : datapoint.value}
          </p>
          <p className="text-[10px] text-muted-foreground">{datapoint.unit}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">
            Nationellt: {typeof datapoint.nationalAverage === 'number' && datapoint.nationalAverage >= 1000 
              ? datapoint.nationalAverage.toLocaleString('sv-SE') 
              : datapoint.nationalAverage}
          </p>
        </div>
      </div>
      
      <div className="space-y-1">
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>Vikt i kluster</span>
          <span>{(datapoint.weight * 100).toFixed(0)}%</span>
        </div>
        <Progress value={datapoint.weight * 100} className="h-1" />
      </div>
    </div>
  );
}

// =====================================================
// CLUSTER DETAIL CARD
// =====================================================

interface ClusterDetailCardProps {
  cluster: ClusterDefinition;
  isExpanded: boolean;
  onToggle: () => void;
}

function ClusterDetailCard({ cluster, isExpanded, onToggle }: ClusterDetailCardProps) {
  const TrendIcon = cluster.trendDirection === 'improving' 
    ? TrendingUp 
    : cluster.trendDirection === 'declining' 
      ? TrendingDown 
      : Minus;
  
  const trendColor = cluster.trendDirection === 'improving' 
    ? 'text-emerald-500' 
    : cluster.trendDirection === 'declining' 
      ? 'text-red-500' 
      : 'text-muted-foreground';

  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-between p-4 h-auto hover:bg-muted/50"
        >
          <div className="flex items-start gap-3 text-left">
            <div className={cn(
              "p-2 rounded-lg shrink-0",
              cluster.trendDirection === 'improving' ? "bg-emerald-500/10" :
              cluster.trendDirection === 'declining' ? "bg-red-500/10" :
              "bg-muted"
            )}>
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium">{cluster.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {cluster.memberCount} {cluster.memberType}er
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className={cn("flex items-center gap-1", trendColor)}>
              <TrendIcon className="h-4 w-4" />
              <span className="text-sm font-medium">
                {cluster.trendMagnitude > 0 ? '+' : ''}{cluster.trendMagnitude}%
              </span>
            </div>
            <ChevronDown className={cn(
              "h-5 w-5 transition-transform text-muted-foreground",
              isExpanded && "rotate-180"
            )} />
          </div>
        </Button>
      </CollapsibleTrigger>

      <CollapsibleContent className="px-4 pb-4">
        <div className="space-y-4 pt-2 border-t">
          <p className="text-xs text-muted-foreground leading-relaxed">
            {cluster.description}
          </p>

          {/* Datapunkter - Svaret i datapunkter, inte ord */}
          <div className="space-y-2">
            <p className="text-xs font-medium flex items-center gap-1">
              <BarChart3 className="h-3 w-3" />
              Definierande datapunkter
            </p>
            <div className="grid grid-cols-2 gap-2">
              {cluster.characteristics.map((dp) => (
                <DatapointCard key={dp.id} datapoint={dp} />
              ))}
            </div>
          </div>

          {/* Exempel på områden (aldrig riktiga namn) */}
          <div className="space-y-2">
            <p className="text-xs font-medium flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              Typiska områden i detta kluster
            </p>
            <div className="flex flex-wrap gap-2">
              {cluster.exampleAreas.map((area) => (
                <Badge key={area} variant="outline" className="text-xs">
                  {area}
                </Badge>
              ))}
              <Badge variant="secondary" className="text-xs">
                +{cluster.memberCount - 3} till
              </Badge>
            </div>
          </div>

          {/* Klusterförklaring */}
          <Alert className="bg-primary/5 border-primary/20">
            <Info className="h-4 w-4 text-primary" />
            <AlertDescription className="text-xs">
              Kluster är <strong>mönster, inte geografi</strong>. Dessa områden delar statistiska 
              profiler oberoende av var i Sverige de ligger.
            </AlertDescription>
          </Alert>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

// =====================================================
// MAIN COMPONENT
// =====================================================

interface ClusterExplainerDetailedProps {
  className?: string;
  selectedClusterId?: string;
  onClusterSelect?: (clusterId: string) => void;
}

export function ClusterExplainerDetailed({ 
  className, 
  selectedClusterId,
  onClusterSelect 
}: ClusterExplainerDetailedProps) {
  const [expandedCluster, setExpandedCluster] = useState<string | null>(
    selectedClusterId || null
  );

  const handleToggle = (clusterId: string) => {
    const newExpanded = expandedCluster === clusterId ? null : clusterId;
    setExpandedCluster(newExpanded);
    if (newExpanded) {
      onClusterSelect?.(newExpanded);
    }
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Klusteranalys
            </CardTitle>
            <CardDescription className="text-xs">
              Mönster och profiler – inte administrativa gränser
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-xs">
            {DEMO_CLUSTERS.length} kluster
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Quick Explainer */}
        <Alert className="bg-muted/50">
          <Scale className="h-4 w-4" />
          <AlertDescription className="text-xs">
            <strong>Varför hamnar dessa områden i samma kluster?</strong> Svaret ges i datapunkter, 
            inte ord. Klicka på ett kluster för att se definierande faktorer.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="all">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all" className="text-xs">Alla</TabsTrigger>
            <TabsTrigger value="declining" className="text-xs gap-1">
              <TrendingDown className="h-3 w-3" />
              Försämring
            </TabsTrigger>
            <TabsTrigger value="improving" className="text-xs gap-1">
              <TrendingUp className="h-3 w-3" />
              Förbättring
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4 space-y-2">
            {DEMO_CLUSTERS.map((cluster) => (
              <ClusterDetailCard
                key={cluster.id}
                cluster={cluster}
                isExpanded={expandedCluster === cluster.id}
                onToggle={() => handleToggle(cluster.id)}
              />
            ))}
          </TabsContent>

          <TabsContent value="declining" className="mt-4 space-y-2">
            {DEMO_CLUSTERS.filter(c => c.trendDirection === 'declining').map((cluster) => (
              <ClusterDetailCard
                key={cluster.id}
                cluster={cluster}
                isExpanded={expandedCluster === cluster.id}
                onToggle={() => handleToggle(cluster.id)}
              />
            ))}
          </TabsContent>

          <TabsContent value="improving" className="mt-4 space-y-2">
            {DEMO_CLUSTERS.filter(c => c.trendDirection === 'improving').map((cluster) => (
              <ClusterDetailCard
                key={cluster.id}
                cluster={cluster}
                isExpanded={expandedCluster === cluster.id}
                onToggle={() => handleToggle(cluster.id)}
              />
            ))}
          </TabsContent>
        </Tabs>

        <Separator />

        {/* Cluster Types Legend */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-xs">
            <div className="p-1.5 rounded bg-emerald-500/10">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
            </div>
            <span className="text-muted-foreground">Positiv utveckling</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="p-1.5 rounded bg-red-500/10">
              <TrendingDown className="h-3 w-3 text-red-500" />
            </div>
            <span className="text-muted-foreground">Negativ utveckling</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
