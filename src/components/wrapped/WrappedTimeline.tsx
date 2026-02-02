// Wrapped Step 3: Timeline - "När hände det?"

import { Card, CardContent } from '@/components/ui/card';
import { format, parseISO } from 'date-fns';
import { sv } from 'date-fns/locale';
import type { WrappedOutput, WrappedTimelineMarker } from '@/types/wrapped';
import { cn } from '@/lib/utils';

interface WrappedTimelineProps {
  data: WrappedOutput['timeline'];
}

function TimelineMarker({ 
  marker, 
  index, 
  total 
}: { 
  marker: WrappedTimelineMarker; 
  index: number;
  total: number;
}) {
  const position = ((index + 1) / (total + 1)) * 100;

  return (
    <div 
      className="absolute flex flex-col items-center"
      style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
    >
      {/* Marker dot */}
      <div className={cn(
        "w-3 h-3 rounded-full border-2 border-background",
        marker.isSignificant 
          ? "bg-chart-1" 
          : "bg-muted-foreground"
      )} />
      
      {/* Date label */}
      <p className="text-xs text-muted-foreground mt-2 whitespace-nowrap">
        {format(parseISO(marker.date), 'MMM', { locale: sv })}
      </p>
      
      {/* Value - only show for significant markers */}
      {marker.isSignificant && (
        <p className="text-sm font-medium mt-1 tabular-nums">
          {marker.value.toLocaleString('sv-SE')}
        </p>
      )}
    </div>
  );
}

export function WrappedTimeline({ data }: WrappedTimelineProps) {
  const periodStart = format(parseISO(data.periodStart), 'd MMM yyyy', { locale: sv });
  const periodEnd = format(parseISO(data.periodEnd), 'd MMM yyyy', { locale: sv });

  return (
    <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold">När hände det?</h2>
        <p className="text-muted-foreground">
          Datapunkter under perioden {periodStart} – {periodEnd}
        </p>
      </div>

      <Card>
        <CardContent className="pt-8 pb-12">
          {/* Timeline visualization */}
          <div className="relative">
            {/* Timeline line */}
            <div className="h-0.5 bg-border w-full" />
            
            {/* Markers */}
            <div className="relative h-16">
              {data.markers.map((marker, index) => (
                <TimelineMarker 
                  key={`${marker.date}-${marker.indicatorId}`}
                  marker={marker}
                  index={index}
                  total={data.markers.length}
                />
              ))}
            </div>

            {/* Start/End labels */}
            <div className="flex justify-between mt-4">
              <span className="text-sm text-muted-foreground">Start</span>
              <span className="text-sm text-muted-foreground">Slut</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Significant events callout */}
      {data.markers.some(m => m.isSignificant) && (
        <Card className="bg-muted/50">
          <CardContent className="py-4">
            <p className="text-sm text-muted-foreground">
              <span className="inline-block w-2 h-2 rounded-full bg-chart-1 mr-2" />
              Markerade punkter indikerar signifikanta datapunkter
            </p>
          </CardContent>
        </Card>
      )}

      <p className="text-sm text-muted-foreground text-center">
        Tidslinjen visar datapunkter, inte händelser eller beslut.
      </p>
    </div>
  );
}
