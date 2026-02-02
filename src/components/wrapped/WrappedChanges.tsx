// Wrapped Step 2: Biggest Changes - "Det här förändrades mest"

import { Card, CardContent } from '@/components/ui/card';
import { ArrowUp, ArrowDown } from 'lucide-react';
import type { WrappedOutput, WrappedDataPoint } from '@/types/wrapped';
import { cn } from '@/lib/utils';

interface WrappedChangesProps {
  data: WrappedOutput['biggestChanges'];
}

function ChangeBar({ indicator }: { indicator: WrappedDataPoint }) {
  const absChange = Math.abs(indicator.changePercent || 0);
  const maxWidth = Math.min(absChange * 10, 100); // Scale for visualization

  return (
    <Card className="overflow-hidden">
      <CardContent className="pt-6 pb-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="font-medium">{indicator.indicatorName}</p>
            <p className="text-sm text-muted-foreground">
              {indicator.previousValue?.toLocaleString('sv-SE')} → {indicator.value.toLocaleString('sv-SE')} {indicator.unit}
            </p>
          </div>
          
          <div className={cn(
            "flex items-center gap-1 text-lg font-semibold tabular-nums",
            indicator.isPositiveChange ? "text-chart-2" : "text-chart-5"
          )}>
            {indicator.changeDirection === 'up' ? (
              <ArrowUp className="h-5 w-5" />
            ) : (
              <ArrowDown className="h-5 w-5" />
            )}
            {indicator.changePercent !== null && (
              <span>
                {indicator.changePercent > 0 ? '+' : ''}
                {indicator.changePercent.toFixed(1)}%
              </span>
            )}
          </div>
        </div>

        {/* Visual bar - subtle, not flashy */}
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className={cn(
              "h-full rounded-full transition-all duration-700 ease-out",
              indicator.isPositiveChange ? "bg-chart-2/60" : "bg-chart-5/60"
            )}
            style={{ width: `${maxWidth}%` }}
          />
        </div>

        <p className="text-xs text-muted-foreground mt-2">
          Källa: {indicator.dataSource} • Konfidens: {indicator.confidence}%
        </p>
      </CardContent>
    </Card>
  );
}

export function WrappedChanges({ data }: WrappedChangesProps) {
  const hasChanges = data.changes.length > 0;

  return (
    <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold">Det här förändrades mest</h2>
        <p className="text-muted-foreground">
          {data.analysisText}
        </p>
      </div>

      {hasChanges ? (
        <div className="space-y-4">
          {data.changes.map((change, index) => (
            <div
              key={change.indicatorId}
              className="animate-in fade-in-0 slide-in-from-left-4"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <ChangeBar indicator={change} />
            </div>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Inga indikatorer visade signifikanta förändringar under perioden.
          </CardContent>
        </Card>
      )}

      {/* No celebration language - just facts */}
      {hasChanges && (
        <p className="text-sm text-muted-foreground text-center">
          Förändring mäts jämfört med föregående period.
        </p>
      )}
    </div>
  );
}
