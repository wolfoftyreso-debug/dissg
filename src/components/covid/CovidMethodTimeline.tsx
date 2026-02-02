/**
 * COVID-19 REALITY LAYER - Method Timeline
 * Shows methodology changes over time
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { SEVERITY_DISPLAY } from '@/lib/covid/method-tracker';
import type { CovidMethodChange } from '@/types/covid';

interface CovidMethodTimelineProps {
  changes: CovidMethodChange[];
  countryCode: string;
}

export function CovidMethodTimeline({ changes, countryCode }: CovidMethodTimelineProps) {
  if (changes.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <Info className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No methodology changes recorded for this period</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-warning" />
          Methodology Changes ({countryCode})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

          {/* Timeline items */}
          <div className="space-y-6">
            {changes.map((change, index) => {
              const severity = SEVERITY_DISPLAY[change.impactSeverity];
              
              return (
                <div key={change.id || index} className="relative pl-10">
                  {/* Timeline dot */}
                  <div className={`absolute left-2.5 w-3 h-3 rounded-full ${severity.bgClass} border-2 border-background`} />
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className="font-mono text-xs">
                        {change.changeDate}
                      </Badge>
                      <Badge className={`${severity.bgClass} ${severity.textClass}`}>
                        {change.impactSeverity.replace('_', ' ')}
                      </Badge>
                      <span className="text-sm font-medium">{formatChangeType(change.changeType)}</span>
                    </div>

                    <div className="text-sm text-muted-foreground">
                      <span className="line-through opacity-60">{change.previousDefinition}</span>
                      <span className="mx-2">→</span>
                      <span>{change.newDefinition}</span>
                    </div>

                    {change.impactSeverity === 'breaks_comparability' && (
                      <div className="flex items-start gap-2 p-2 rounded bg-destructive/10 text-destructive text-xs">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>
                          ⚠️ Method change here – comparisons across this point require caution.
                        </span>
                      </div>
                    )}

                    <p className="text-xs text-muted-foreground">
                      {change.comparabilityNote}
                    </p>

                    {change.sourceUrl && (
                      <a 
                        href={change.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline"
                      >
                        View source documentation →
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Standard disclaimer */}
        <div className="mt-6 pt-4 border-t">
          <p className="text-xs text-muted-foreground">
            Methodology changes affect comparability over time. Data before and after a change 
            may not measure the same thing. This timeline shows documented changes; 
            undocumented changes may also exist.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function formatChangeType(type: string): string {
  const typeMap: Record<string, string> = {
    test_strategy: 'Testing Strategy',
    death_definition: 'Death Definition',
    reporting_frequency: 'Reporting Frequency',
    case_definition: 'Case Definition',
  };
  return typeMap[type] || type;
}
