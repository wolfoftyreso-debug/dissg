// Wrapped Step 5: Unchanged - "Vad låg still?"

import { Card, CardContent } from '@/components/ui/card';
import { Minus } from 'lucide-react';
import type { WrappedOutput } from '@/types/wrapped';

interface WrappedUnchangedProps {
  data: WrappedOutput['unchanged'];
}

export function WrappedUnchanged({ data }: WrappedUnchangedProps) {
  const hasStableIndicators = data.stableIndicators.length > 0;

  return (
    <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold">Vad låg still?</h2>
        <p className="text-muted-foreground">
          {data.stabilityText}
        </p>
      </div>

      {hasStableIndicators ? (
        <div className="grid gap-3">
          {data.stableIndicators.map((indicator, index) => (
            <Card 
              key={indicator.indicatorId}
              className="animate-in fade-in-0 slide-in-from-left-2"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-muted">
                      <Minus className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{indicator.indicatorName}</p>
                      <p className="text-sm text-muted-foreground">
                        Källa: {indicator.dataSource}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-lg font-semibold tabular-nums">
                      {indicator.value.toLocaleString('sv-SE')} {indicator.unit}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {indicator.changePercent !== null 
                        ? `${indicator.changePercent > 0 ? '+' : ''}${indicator.changePercent.toFixed(1)}%`
                        : 'Oförändrad'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">
              Alla analyserade indikatorer visade mätbar förändring under perioden.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Why stability matters */}
      <Card className="bg-muted/50">
        <CardContent className="py-4">
          <p className="text-sm text-muted-foreground text-center">
            Stabilitet kan vara lika viktig som förändring. 
            Oförändrade indikatorer visar områden utan signifikant utveckling.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
