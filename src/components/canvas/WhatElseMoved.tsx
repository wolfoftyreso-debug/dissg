/**
 * BLOCK PE — "WHAT ELSE MOVED?"
 * 
 * Anti-cherry-picking component that shows:
 * - Other variables that moved during the same period
 * - Variables that did NOT move
 * 
 * Always includes disclaimer:
 * "Shown because they often move together, not because they cause"
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, ArrowUp, ArrowDown, Minus, Info } from 'lucide-react';
import type { DataIndicator } from '@/config/correlationLearningCanvasConfig';

interface WhatElseMovedProps {
  indicatorA: DataIndicator;
  indicatorB: DataIndicator;
  region: string;
  timeRange: [number, number];
}

// Mock related indicators with correlation data
const MOCK_ALSO_MOVED = [
  { id: 'inflation', name: 'Inflation', nameSv: 'Inflation', correlation: 0.78, direction: 'same' as const },
  { id: 'interest_rate', name: 'Interest rate', nameSv: 'Räntenivå', correlation: 0.65, direction: 'same' as const },
  { id: 'export', name: 'Export volume', nameSv: 'Exportvolym', correlation: -0.52, direction: 'opposite' as const },
];

const MOCK_DID_NOT_MOVE = [
  { id: 'retail', name: 'Retail sales', nameSv: 'Detaljhandel', correlation: 0.08 },
  { id: 'construction', name: 'Construction', nameSv: 'Byggindustri', correlation: -0.12 },
];

export function WhatElseMoved({
  indicatorA,
  indicatorB,
  region,
  timeRange,
}: WhatElseMovedProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="font-medium">Vad mer rörde sig?</h3>
        <Badge variant="outline" className="text-xs">Anti-cherry-picking</Badge>
      </div>

      <p className="text-sm text-muted-foreground">
        Under perioden {timeRange[0]}–{timeRange[1]} rörde sig även:
      </p>

      {/* Variables that also moved */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Also changed:
        </p>
        {MOCK_ALSO_MOVED.map((related) => (
          <Card 
            key={related.id} 
            className="cursor-pointer hover:bg-muted/50 transition-colors"
          >
            <CardContent className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {related.direction === 'same' ? (
                  <ArrowUp className="h-4 w-4 text-primary" />
                ) : (
                  <ArrowDown className="h-4 w-4 text-destructive" />
                )}
                <span className="font-medium">{related.nameSv}</span>
                <span className="text-xs text-muted-foreground">({related.name})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm">
                  r={related.correlation > 0 ? '+' : ''}{related.correlation.toFixed(2)}
                </span>
                <Badge variant={related.direction === 'same' ? 'default' : 'secondary'}>
                  {related.direction === 'same' ? 'Samma riktning' : 'Motsatt'}
                </Badge>
                <Button variant="ghost" size="sm" className="gap-1">
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Variables that did NOT move */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Did not change significantly:
        </p>
        {MOCK_DID_NOT_MOVE.map((related) => (
          <Card 
            key={related.id} 
            className="bg-muted/30"
          >
            <CardContent className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Minus className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{related.nameSv}</span>
                <span className="text-xs text-muted-foreground">({related.name})</span>
              </div>
              <span className="font-mono text-sm text-muted-foreground">
                r={related.correlation.toFixed(2)}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Important disclaimer - ALWAYS SHOWN */}
      <div className="flex items-start gap-2 p-3 bg-warning/10 border border-warning/20 rounded-lg">
        <Info className="h-4 w-4 text-warning flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-warning font-medium">
            Shown because they often move together, not because they cause.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Visas eftersom de ofta rör sig samtidigt, inte för att de orsakar.
            Many factors can explain co-movement without direct connection.
          </p>
        </div>
      </div>
    </div>
  );
}
