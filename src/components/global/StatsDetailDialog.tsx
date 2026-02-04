/**
 * STATS DETAIL DIALOG
 * Fördjupningsvy för statistikkort i UniversalResponsibilityMap
 */

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface StatsDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  statType: 'domains' | 'indicators' | 'availability' | 'levels' | null;
  domains: Array<{
    id: string;
    code: string;
    name: string;
    marker: string;
    description: string;
    universalIndicators: Array<{
      code: string;
      name: string;
      unit: string;
      description: string;
      dataAvailability: 'high' | 'medium' | 'low' | 'none';
    }>;
  }>;
  governanceLevels: Array<{
    id: string;
    name: string;
    description: string;
    marker: string;
    typicalActors: string[];
    jurisdictionExamples: string[];
  }>;
}

export const StatsDetailDialog: React.FC<StatsDetailDialogProps> = ({
  open,
  onOpenChange,
  statType,
  domains,
  governanceLevels,
}) => {
  if (!statType) return null;

  const allIndicators = domains.flatMap(d => 
    d.universalIndicators.map(i => ({ ...i, domainCode: d.code, domainName: d.name }))
  );
  
  const highAvailabilityIndicators = allIndicators.filter(i => i.dataAvailability === 'high');
  const mediumAvailabilityIndicators = allIndicators.filter(i => i.dataAvailability === 'medium');
  const lowAvailabilityIndicators = allIndicators.filter(i => i.dataAvailability === 'low');

  const getTitle = () => {
    switch (statType) {
      case 'domains': return '[DOM] Behovsdomäner';
      case 'indicators': return '[IND] Universella Indikatorer';
      case 'availability': return '[DATA] Datatillgång';
      case 'levels': return '[NIV] Styrningsnivåer';
    }
  };

  const getDescription = () => {
    switch (statType) {
      case 'domains': return 'Fundamentala domäner för mänskligt välbefinnande - universella oavsett jurisdiktion.';
      case 'indicators': return 'Mätbara indikatorer som spårar tillståndet inom varje behovsdomän.';
      case 'availability': return 'Översikt av datatillgänglighet för varje indikator globalt.';
      case 'levels': return 'Styrningsnivåer med typiska aktörer och ansvarsområden.';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] font-mono">
        <DialogHeader>
          <DialogTitle className="text-xl">{getTitle()}</DialogTitle>
          <DialogDescription>{getDescription()}</DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[60vh] pr-4">
          {statType === 'domains' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 mb-4">
                <Card className="p-3 bg-muted/30">
                  <div className="text-sm text-muted-foreground">[ANT] Antal domäner</div>
                  <div className="text-2xl font-bold text-primary">{domains.length}</div>
                </Card>
                <Card className="p-3 bg-muted/30">
                  <div className="text-sm text-muted-foreground">[TOT] Totala indikatorer</div>
                  <div className="text-2xl font-bold">{allIndicators.length}</div>
                </Card>
              </div>

              {domains.map((domain) => (
                <Card key={domain.id} className="border-l-4 border-l-primary/50">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono">{domain.marker}</Badge>
                      <CardTitle className="text-base">{domain.name}</CardTitle>
                      <Badge className="ml-auto">{domain.universalIndicators.length} ind.</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">{domain.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {domain.universalIndicators.slice(0, 5).map((ind) => (
                        <Badge key={ind.code} variant="secondary" className="text-xs">
                          {ind.code}
                        </Badge>
                      ))}
                      {domain.universalIndicators.length > 5 && (
                        <Badge variant="outline" className="text-xs">
                          +{domain.universalIndicators.length - 5} fler
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {statType === 'indicators' && (
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-4 font-mono">
                <TabsTrigger value="all">[ALLA] Alla ({allIndicators.length})</TabsTrigger>
                {domains.slice(0, 4).map((d) => (
                  <TabsTrigger key={d.id} value={d.id}>
                    {d.marker} ({d.universalIndicators.length})
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="all" className="space-y-2">
                {allIndicators.map((ind) => (
                  <Card key={ind.code} className="p-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs font-mono">{ind.code}</Badge>
                          <span className="font-medium text-sm">{ind.name}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{ind.description}</p>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant={ind.dataAvailability === 'high' ? 'default' : 'secondary'}
                          className={ind.dataAvailability === 'high' ? 'bg-emerald-500' : ''}
                        >
                          {ind.dataAvailability}
                        </Badge>
                        <div className="text-xs text-muted-foreground mt-1">{ind.unit}</div>
                      </div>
                    </div>
                  </Card>
                ))}
              </TabsContent>

              {domains.map((domain) => (
                <TabsContent key={domain.id} value={domain.id} className="space-y-2">
                  <Card className="p-3 bg-primary/5 mb-4">
                    <div className="text-sm font-medium">{domain.name}</div>
                    <div className="text-xs text-muted-foreground">{domain.description}</div>
                  </Card>
                  {domain.universalIndicators.map((ind) => (
                    <Card key={ind.code} className="p-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs font-mono">{ind.code}</Badge>
                            <span className="font-medium text-sm">{ind.name}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{ind.description}</p>
                        </div>
                        <Badge 
                          variant={ind.dataAvailability === 'high' ? 'default' : 'secondary'}
                          className={ind.dataAvailability === 'high' ? 'bg-emerald-500' : ''}
                        >
                          {ind.dataAvailability}
                        </Badge>
                      </div>
                    </Card>
                  ))}
                </TabsContent>
              ))}
            </Tabs>
          )}

          {statType === 'availability' && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-3">
                <Card className="p-4 text-center bg-emerald-500/10 border-emerald-500/30">
                  <div className="text-2xl font-bold text-emerald-400">{highAvailabilityIndicators.length}</div>
                  <div className="text-xs text-muted-foreground">[HÖG] Hög tillgång</div>
                  <div className="text-xs text-emerald-400 mt-1">
                    {Math.round((highAvailabilityIndicators.length / allIndicators.length) * 100)}%
                  </div>
                </Card>
                <Card className="p-4 text-center bg-amber-500/10 border-amber-500/30">
                  <div className="text-2xl font-bold text-amber-400">{mediumAvailabilityIndicators.length}</div>
                  <div className="text-xs text-muted-foreground">[MED] Medel tillgång</div>
                  <div className="text-xs text-amber-400 mt-1">
                    {Math.round((mediumAvailabilityIndicators.length / allIndicators.length) * 100)}%
                  </div>
                </Card>
                <Card className="p-4 text-center bg-red-500/10 border-red-500/30">
                  <div className="text-2xl font-bold text-red-400">{lowAvailabilityIndicators.length}</div>
                  <div className="text-xs text-muted-foreground">[LÅG] Låg tillgång</div>
                  <div className="text-xs text-red-400 mt-1">
                    {Math.round((lowAvailabilityIndicators.length / allIndicators.length) * 100)}%
                  </div>
                </Card>
              </div>

              <Card className="p-4">
                <CardTitle className="text-sm mb-3">[HÖG] Indikatorer med hög datatillgång</CardTitle>
                <div className="space-y-2">
                  {highAvailabilityIndicators.map((ind) => (
                    <div key={ind.code} className="flex items-center gap-2 text-sm">
                      <Badge variant="outline" className="text-xs font-mono">{ind.code}</Badge>
                      <span className="flex-1">{ind.name}</span>
                      <Badge variant="secondary" className="text-xs">{ind.domainCode}</Badge>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-4">
                <CardTitle className="text-sm mb-3">[LUCKOR] Indikatorer med låg datatillgång</CardTitle>
                <p className="text-xs text-muted-foreground mb-3">
                  Dessa indikatorer har begränsad eller ojämn global täckning.
                </p>
                <div className="space-y-2">
                  {lowAvailabilityIndicators.map((ind) => (
                    <div key={ind.code} className="flex items-center gap-2 text-sm">
                      <Badge variant="outline" className="text-xs font-mono text-red-400">{ind.code}</Badge>
                      <span className="flex-1">{ind.name}</span>
                      <Badge variant="secondary" className="text-xs">{ind.domainCode}</Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {statType === 'levels' && (
            <div className="space-y-4">
              <div className="grid grid-cols-5 gap-2 mb-4">
                {governanceLevels.map((level, idx) => (
                  <Card key={level.id} className="p-2 text-center">
                    <Badge variant="outline" className="font-mono mb-1">{level.marker}</Badge>
                    <div className="text-xs font-medium">{level.name}</div>
                  </Card>
                ))}
              </div>

              {governanceLevels.map((level) => (
                <Card key={level.id} className="border-l-4 border-l-primary/50">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <Badge className="font-mono">{level.marker}</Badge>
                      <CardTitle className="text-base">{level.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">{level.description}</p>
                    
                    <div>
                      <div className="text-xs font-medium mb-1">[AKT] Typiska aktörer:</div>
                      <div className="flex flex-wrap gap-1">
                        {level.typicalActors.map((actor, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {actor}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-medium mb-1">[EX] Jurisdiktionsexempel:</div>
                      <div className="flex flex-wrap gap-1">
                        {level.jurisdictionExamples.map((ex, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {ex}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
