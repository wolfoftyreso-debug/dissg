/**
 * BLOCK PD — KORRELATIONSFÖRKLARING (TEXT, INTE SIFFROR)
 * 
 * Istället för "Korrelation: 0,72" visar systemet:
 * "När A ökade under denna period, ökade också B ofta.
 * Detta mönster syns i X av Y år.
 * Det finns också perioder där sambandet inte syns."
 * 
 * Och: "Detta betyder inte att A orsakar B."
 * 
 * 📌 Människor förstår ord bättre än koefficienter.
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Lightbulb, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { DataIndicator } from '@/config/correlationLearningCanvasConfig';

interface PatternExplanationProps {
  indicatorA: DataIndicator;
  indicatorB: DataIndicator;
}

export function PatternExplanation({
  indicatorA,
  indicatorB,
}: PatternExplanationProps) {
  // Mock analysis results
  const yearsMatched = 10;
  const totalYears = 14;
  const hasExceptions = true;

  return (
    <div className="space-y-4">
      {/* Main explanation - NO STATISTICAL TERMS */}
      <div className="space-y-3">
        <p className="text-base">
          <span className="font-medium">
            När {indicatorA.nameSv.toLowerCase()} ökade under denna period, 
            ökade också {indicatorB.nameSv.toLowerCase()} ofta.
          </span>
        </p>
        
        <p className="text-muted-foreground">
          Detta mönster syns i {yearsMatched} av {totalYears} år.
        </p>
        
        {hasExceptions && (
          <p className="text-muted-foreground">
            Det finns också perioder där sambandet inte syns.
          </p>
        )}
      </div>

      {/* Causation warning - CRITICAL */}
      <Card className="border-warning/50 bg-warning/5">
        <CardContent className="p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-sm">
              Detta betyder inte att det ena orsakar det andra.
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Många faktorer kan påverka båda samtidigt utan att de påverkar varandra direkt.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Learning moment */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="p-4 flex items-start gap-3">
          <Lightbulb className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-medium">Lärmoment:</span>{' '}
              Detta är ett exempel på ett återkommande mönster. 
              Liknande mönster har observerats i andra länder och perioder.
            </p>
            <Button variant="link" size="sm" className="p-0 h-auto gap-1">
              <span>Visa andra exempel</span>
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Method link */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Badge variant="outline" className="text-xs">
          Metod
        </Badge>
        <span>
          Sambandet beskrivs baserat på hur ofta datapunkterna rör sig i samma riktning.
        </span>
        <Button variant="link" size="sm" className="p-0 h-auto text-xs">
          Läs mer om metoden
        </Button>
      </div>
    </div>
  );
}
