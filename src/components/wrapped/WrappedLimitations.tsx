// Wrapped Step 6: Limitations - "Vad detta inte säger"

import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Info, AlertCircle } from 'lucide-react';
import type { WrappedOutput, WrappedLimitation } from '@/types/wrapped';
import { cn } from '@/lib/utils';

interface WrappedLimitationsProps {
  data: WrappedOutput['limitations'];
}

function LimitationIcon({ severity }: { severity: WrappedLimitation['severity'] }) {
  switch (severity) {
    case 'significant':
      return <AlertCircle className="h-5 w-5 text-chart-5" />;
    case 'moderate':
      return <AlertTriangle className="h-5 w-5 text-chart-4" />;
    default:
      return <Info className="h-5 w-5 text-muted-foreground" />;
  }
}

function getLimitationTypeLabel(type: WrappedLimitation['type']): string {
  switch (type) {
    case 'causation': return 'Orsakssamband';
    case 'methodology': return 'Metod';
    case 'scope': return 'Omfattning';
    case 'temporal': return 'Tidsmässig';
    case 'data_gap': return 'Datalucka';
    default: return 'Begränsning';
  }
}

export function WrappedLimitations({ data }: WrappedLimitationsProps) {
  return (
    <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold">Vad detta inte säger</h2>
        <p className="text-muted-foreground">
          Viktiga begränsningar att ha i åtanke
        </p>
      </div>

      {/* Main disclaimer - always visible */}
      <Card className="border-chart-4/50 bg-chart-4/5">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-chart-4 shrink-0 mt-0.5" />
            <p className="text-sm">
              {data.disclaimerText}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Individual limitations */}
      <div className="space-y-3">
        {data.items.map((limitation, index) => (
          <Card 
            key={`${limitation.type}-${index}`}
            className={cn(
              "animate-in fade-in-0 slide-in-from-left-2",
              limitation.severity === 'significant' && "border-chart-5/30"
            )}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="py-4">
              <div className="flex items-start gap-3">
                <LimitationIcon severity={limitation.severity} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground">
                      {getLimitationTypeLabel(limitation.type)}
                    </span>
                  </div>
                  <p className="text-sm">{limitation.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Fixed disclaimers - always present */}
      <div className="grid gap-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
          <span>Korrelation innebär inte orsakssamband</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
          <span>Historiska data säger inget om framtiden</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
          <span>Systemgenererad sammanfattning</span>
        </div>
      </div>
    </div>
  );
}
