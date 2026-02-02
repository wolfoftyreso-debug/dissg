import { } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { 
  CorrelationMatrix as CorrelationMatrixType,
  getCorrelationColor 
} from '@/lib/analysis/correlationAnalysis';
import { cn } from '@/lib/utils';

interface CorrelationMatrixProps {
  data: CorrelationMatrixType;
  kpiNames: Map<string, string>; // kpiId -> display name
  onCellClick?: (kpiA: string, kpiB: string) => void;
}

export function CorrelationMatrix({ 
  data, 
  kpiNames,
  onCellClick 
}: CorrelationMatrixProps) {
  const getDisplayName = (kpiId: string) => kpiNames.get(kpiId) || kpiId;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          Korrelationsmatris
          <Badge variant="outline" className="font-normal">
            {data.kpis.length} KPI:er
          </Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Klicka på en cell för att se detaljer
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <TooltipProvider>
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-2 text-left text-xs font-medium text-muted-foreground" />
                  {data.kpis.map((kpi, i) => (
                    <th 
                      key={kpi} 
                      className="p-1 text-center text-xs font-medium text-muted-foreground max-w-[80px] truncate"
                      title={getDisplayName(kpi)}
                    >
                      <span className="writing-mode-vertical inline-block max-h-[100px] overflow-hidden">
                        {getDisplayName(kpi).slice(0, 12)}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.kpis.map((kpiRow, i) => (
                  <tr key={kpiRow}>
                    <td 
                      className="p-2 text-xs font-medium text-muted-foreground max-w-[120px] truncate"
                      title={getDisplayName(kpiRow)}
                    >
                      {getDisplayName(kpiRow).slice(0, 15)}
                    </td>
                    {data.kpis.map((kpiCol, j) => {
                      const coefficient = data.matrix[i][j];
                      const isSelf = i === j;
                      const result = data.results.find(
                        r => (r.kpiA === kpiRow && r.kpiB === kpiCol) ||
                             (r.kpiA === kpiCol && r.kpiB === kpiRow)
                      );
                      
                      return (
                        <Tooltip key={`${kpiRow}-${kpiCol}`}>
                          <TooltipTrigger asChild>
                            <td
                              className={cn(
                                "p-1 text-center cursor-pointer transition-all hover:ring-2 hover:ring-primary/50",
                                "min-w-[44px] min-h-[44px]",
                                isSelf && "cursor-default"
                              )}
                              style={{ 
                                backgroundColor: isSelf 
                                  ? 'hsl(var(--muted))' 
                                  : getCorrelationColor(coefficient)
                              }}
                              onClick={() => !isSelf && onCellClick?.(kpiRow, kpiCol)}
                            >
                              <span className={cn(
                                "text-xs font-mono tabular-nums",
                                Math.abs(coefficient) > 0.5 ? "text-white" : "text-foreground"
                              )}>
                                {isSelf ? '–' : coefficient.toFixed(2)}
                              </span>
                            </td>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-[250px]">
                            {isSelf ? (
                              <p className="text-sm">Självkorrelation</p>
                            ) : result ? (
                              <div className="space-y-1">
                                <p className="font-medium text-sm">{result.interpretation}</p>
                                <p className="text-xs text-muted-foreground">
                                  n={result.sampleSize}, p={result.pValue.toFixed(3)}
                                </p>
                              </div>
                            ) : null}
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </TooltipProvider>
        </div>
        
        {/* Legend */}
        <div className="mt-4 flex items-center justify-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: 'hsl(var(--destructive))' }} />
            <span>-1.0</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: 'hsl(var(--muted))' }} />
            <span>0</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: 'hsl(var(--chart-2))' }} />
            <span>+1.0</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
