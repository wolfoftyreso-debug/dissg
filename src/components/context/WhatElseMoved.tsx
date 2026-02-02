/**
 * WAVE 8 BLOCK BN: "What Else Moved?" Component
 * 
 * Automatisk fråga vid varje större förändring:
 * "Vilka andra indikatorer rörde sig samtidigt?"
 * 
 * Inga "one-variable stories".
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Minus,
  Clock,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { CONTEXT_DIMENSIONS } from '@/config/contextEngineConfig';

interface MovementData {
  indicator: string;
  domain: string;
  change: number;
  direction: 'up' | 'down' | 'stable';
  timing: 'before' | 'concurrent' | 'after';
  timeDelta: number; // månader
  source: string;
}

interface WhatElseMovedProps {
  primaryIndicator: string;
  primaryChange: number;
  primaryPeriod: string;
  movements: MovementData[];
  lang?: 'sv' | 'en';
}

export function WhatElseMoved({
  primaryIndicator,
  primaryChange,
  primaryPeriod,
  movements,
  lang = 'sv',
}: WhatElseMovedProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'before' | 'concurrent' | 'after'>('all');

  const beforeMovements = movements.filter(m => m.timing === 'before');
  const concurrentMovements = movements.filter(m => m.timing === 'concurrent');
  const afterMovements = movements.filter(m => m.timing === 'after');
  const stableIndicators = movements.filter(m => m.direction === 'stable');

  const getFilteredMovements = () => {
    switch (activeTab) {
      case 'before':
        return beforeMovements;
      case 'concurrent':
        return concurrentMovements;
      case 'after':
        return afterMovements;
      default:
        return movements.filter(m => m.direction !== 'stable');
    }
  };

  const getDomainName = (domainId: string) => {
    const dim = CONTEXT_DIMENSIONS.find(d => d.id === domainId);
    return dim ? (lang === 'sv' ? dim.name : dim.name_en) : domainId;
  };

  const getTimingLabel = (timing: string, delta: number) => {
    if (timing === 'concurrent') {
      return lang === 'sv' ? 'Samtidigt' : 'Concurrent';
    }
    const direction = timing === 'before' 
      ? (lang === 'sv' ? 'före' : 'before') 
      : (lang === 'sv' ? 'efter' : 'after');
    return `${Math.abs(delta)} ${lang === 'sv' ? 'mån' : 'mo'} ${direction}`;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          {lang === 'sv' ? 'Vad mer rörde sig?' : 'What else moved?'}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {primaryIndicator}: {primaryChange > 0 ? '+' : ''}{primaryChange.toFixed(1)}% ({primaryPeriod})
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="all" className="text-xs">
              {lang === 'sv' ? 'Alla' : 'All'}
              <Badge variant="secondary" className="ml-1 text-[10px]">
                {movements.filter(m => m.direction !== 'stable').length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="before" className="text-xs">
              {lang === 'sv' ? 'Före' : 'Before'}
              <Badge variant="secondary" className="ml-1 text-[10px]">
                {beforeMovements.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="concurrent" className="text-xs">
              {lang === 'sv' ? 'Samtidigt' : 'Same time'}
              <Badge variant="secondary" className="ml-1 text-[10px]">
                {concurrentMovements.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="after" className="text-xs">
              {lang === 'sv' ? 'Efter' : 'After'}
              <Badge variant="secondary" className="ml-1 text-[10px]">
                {afterMovements.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4 space-y-2">
            {getFilteredMovements().map((movement, index) => (
              <div 
                key={`${movement.indicator}-${index}`}
                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded ${
                    movement.direction === 'up' ? 'bg-emerald-100 dark:bg-emerald-900/30' :
                    movement.direction === 'down' ? 'bg-rose-100 dark:bg-rose-900/30' :
                    'bg-muted'
                  }`}>
                    {movement.direction === 'up' ? (
                      <ArrowUpRight className="h-4 w-4 text-emerald-600" />
                    ) : movement.direction === 'down' ? (
                      <ArrowDownRight className="h-4 w-4 text-rose-600" />
                    ) : (
                      <Minus className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{movement.indicator}</p>
                    <p className="text-xs text-muted-foreground">
                      {getDomainName(movement.domain)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-sm font-mono ${
                    movement.direction === 'up' ? 'text-emerald-600' :
                    movement.direction === 'down' ? 'text-rose-600' :
                    'text-muted-foreground'
                  }`}>
                    {movement.change > 0 ? '+' : ''}{movement.change.toFixed(1)}%
                  </span>
                  <p className="text-[10px] text-muted-foreground flex items-center justify-end gap-1">
                    <Clock className="h-2.5 w-2.5" />
                    {getTimingLabel(movement.timing, movement.timeDelta)}
                  </p>
                </div>
              </div>
            ))}

            {getFilteredMovements().length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                <Minus className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">
                  {lang === 'sv' 
                    ? 'Inga rörelser i denna kategori' 
                    : 'No movements in this category'}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Vad som INTE rörde sig */}
        {stableIndicators.length > 0 && (
          <div className="pt-3 border-t">
            <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
              <Minus className="h-3 w-3" />
              {lang === 'sv' ? 'Vad som INTE rörde sig:' : 'What did NOT move:'}
            </p>
            <div className="flex flex-wrap gap-1">
              {stableIndicators.slice(0, 5).map((item, i) => (
                <Badge key={i} variant="outline" className="text-[10px]">
                  {item.indicator}
                </Badge>
              ))}
              {stableIndicators.length > 5 && (
                <Badge variant="outline" className="text-[10px]">
                  +{stableIndicators.length - 5} {lang === 'sv' ? 'till' : 'more'}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="pt-3 border-t">
          <p className="text-[10px] text-muted-foreground flex items-start gap-1">
            <Info className="h-3 w-3 shrink-0 mt-0.5" />
            {lang === 'sv' 
              ? 'Tidsmässiga samband innebär inte orsakssamband. Visningen är observationell.'
              : 'Temporal associations do not imply causation. Display is observational.'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Kompakt "headline" version
 */
export function WhatElseMovedSummary({
  movements,
  lang = 'sv',
}: {
  movements: MovementData[];
  lang?: 'sv' | 'en';
}) {
  const upCount = movements.filter(m => m.direction === 'up').length;
  const downCount = movements.filter(m => m.direction === 'down').length;
  const concurrentCount = movements.filter(m => m.timing === 'concurrent').length;

  return (
    <div className="flex items-center gap-3 text-xs text-muted-foreground">
      <span className="flex items-center gap-1">
        <ArrowUpRight className="h-3 w-3 text-emerald-600" />
        {upCount} {lang === 'sv' ? 'ökade' : 'increased'}
      </span>
      <span className="flex items-center gap-1">
        <ArrowDownRight className="h-3 w-3 text-rose-600" />
        {downCount} {lang === 'sv' ? 'minskade' : 'decreased'}
      </span>
      <span className="flex items-center gap-1">
        <Clock className="h-3 w-3" />
        {concurrentCount} {lang === 'sv' ? 'samtidigt' : 'concurrent'}
      </span>
    </div>
  );
}
