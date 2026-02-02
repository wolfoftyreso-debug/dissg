/**
 * BLOCK PE — "WHAT ELSE MOVED?"
 * 
 * Systemet föreslår (valfritt):
 * "Under samma period rörde sig även dessa datapunkter på liknande sätt:"
 * 
 * Alltid med:
 * "visas eftersom de ofta rör sig samtidigt, inte för att de orsakar"
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Info } from 'lucide-react';
import type { DataIndicator } from '@/config/correlationLearningCanvasConfig';

interface WhatElseMovedProps {
  indicatorA: DataIndicator;
  indicatorB: DataIndicator;
  region: string;
  timeRange: [number, number];
}

// Mock related indicators
const MOCK_RELATED = [
  { id: 'inflation', name: 'Inflation', nameSv: 'Inflation', similarity: 'high' as const },
  { id: 'employment', name: 'Employment rate', nameSv: 'Sysselsättningsgrad', similarity: 'medium' as const },
  { id: 'interest_rate', name: 'Interest rate', nameSv: 'Räntenivå', similarity: 'medium' as const },
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
        <Badge variant="outline" className="text-xs">Valfritt</Badge>
      </div>

      <p className="text-sm text-muted-foreground">
        Under samma period rörde sig även dessa datapunkter på liknande sätt:
      </p>

      <div className="grid gap-2">
        {MOCK_RELATED.map((related) => (
          <Card 
            key={related.id} 
            className="cursor-pointer hover:bg-muted/50 transition-colors"
          >
            <CardContent className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge 
                  variant={related.similarity === 'high' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {related.similarity === 'high' ? 'Tydligt' : 'Måttligt'}
                </Badge>
                <span className="font-medium">{related.nameSv}</span>
              </div>
              <Button variant="ghost" size="sm" className="gap-1">
                <span className="text-xs">Utforska</span>
                <ArrowRight className="h-3 w-3" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Important disclaimer */}
      <div className="flex items-start gap-2 p-3 bg-muted/30 rounded-lg">
        <Info className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground">
          Visas eftersom de ofta rör sig samtidigt, inte för att de orsakar.
          Många faktorer kan förklara samrörelse utan direkt koppling.
        </p>
      </div>
    </div>
  );
}
