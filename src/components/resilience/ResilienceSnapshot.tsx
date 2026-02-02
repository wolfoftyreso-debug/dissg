/**
 * BLOCK SI — GLOBAL RESILIENCE SNAPSHOT
 * Startsidans snapshot: stabil / pressad / fragmenterad
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, TrendingUp, TrendingDown, Minus, 
  ChevronRight, Globe 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { GlobalResilienceSnapshot } from '@/config/systemResilienceConfig';
import { GLOBAL_STATUS_LABELS, RESILIENCE_CLARIFICATION } from '@/config/systemResilienceConfig';

interface ResilienceSnapshotProps {
  snapshot: GlobalResilienceSnapshot;
  onViewDetails?: () => void;
}

export function ResilienceSnapshotCard({ snapshot, onViewDetails }: ResilienceSnapshotProps) {
  const statusColors = {
    stable: 'text-success bg-success/10 border-success/30',
    pressured: 'text-warning bg-warning/10 border-warning/30',
    fragmented: 'text-destructive bg-destructive/10 border-destructive/30',
  };

  const TrendIcons = {
    improving: <TrendingUp className="h-4 w-4 text-success" />,
    stable: <Minus className="h-4 w-4 text-muted-foreground" />,
    declining: <TrendingDown className="h-4 w-4 text-destructive" />,
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Global Resiliens
          </CardTitle>
          <Badge className={cn("border", statusColors[snapshot.status])}>
            {GLOBAL_STATUS_LABELS[snapshot.status].sv}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall score */}
        <div className="flex items-center gap-4">
          <div className="text-3xl font-bold text-primary">
            {snapshot.averageScore}
          </div>
          <div className="flex-1">
            <Progress value={snapshot.averageScore} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              Genomsnittlig kapacitet
            </p>
          </div>
        </div>

        {/* Regional variations */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Regionala variationer
          </h4>
          {snapshot.regionalVariation.slice(0, 4).map((region) => (
            <div 
              key={region.region}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-muted-foreground">{region.regionSv}</span>
              <div className="flex items-center gap-2">
                <span className="font-medium">{region.score}</span>
                {TrendIcons[region.trend]}
              </div>
            </div>
          ))}
        </div>

        {/* Clarification */}
        <div className="p-3 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground italic">
            "{RESILIENCE_CLARIFICATION.sv}"
          </p>
        </div>

        {/* View details */}
        {onViewDetails && (
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={onViewDetails}
          >
            Utforska detaljer
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

// Compact version for dashboards
export function ResilienceSnapshotCompact({ snapshot }: { snapshot: GlobalResilienceSnapshot }) {
  const statusColors = {
    stable: 'bg-success',
    pressured: 'bg-warning',
    fragmented: 'bg-destructive',
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-card rounded-lg border">
      <div className={cn("w-3 h-3 rounded-full", statusColors[snapshot.status])} />
      <div className="flex-1">
        <div className="font-medium text-sm">Global Resiliens</div>
        <div className="text-xs text-muted-foreground">
          {GLOBAL_STATUS_LABELS[snapshot.status].sv} • {snapshot.averageScore}/100
        </div>
      </div>
      <Shield className="h-5 w-5 text-muted-foreground" />
    </div>
  );
}
