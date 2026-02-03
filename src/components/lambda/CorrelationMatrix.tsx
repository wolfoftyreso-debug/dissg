/**
 * CORRELATION MATRIX VISUALIZATION
 * 
 * Neutral presentation of index correlations.
 * No value judgments - only observed co-movement.
 * 
 * Color scheme:
 * - Blue: Positive correlation
 * - Orange: Negative correlation
 * - Intensity = strength
 */

import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { IndexCorrelation, IndexCode } from '@/lib/lambda/index-types';
import { getIndexDefinition } from '@/lib/lambda/index-registry';

interface CorrelationMatrixProps {
  correlations: IndexCorrelation[];
  indices: IndexCode[];
  onCellClick?: (indexA: IndexCode, indexB: IndexCode) => void;
  language?: 'sv' | 'en';
  className?: string;
}

export function CorrelationMatrix({
  correlations,
  indices,
  onCellClick,
  language = 'sv',
  className,
}: CorrelationMatrixProps) {
  // Create correlation lookup
  const correlationMap = new Map<string, IndexCorrelation>();
  for (const corr of correlations) {
    correlationMap.set(`${corr.index_a}-${corr.index_b}`, corr);
    correlationMap.set(`${corr.index_b}-${corr.index_a}`, corr);
  }
  
  const getCorrelation = (a: IndexCode, b: IndexCode): IndexCorrelation | undefined => {
    return correlationMap.get(`${a}-${b}`);
  };
  
  const getCellColor = (r: number | undefined): string => {
    if (r === undefined) return 'bg-muted/30';
    
    const intensity = Math.min(Math.abs(r), 1);
    const alpha = 0.2 + intensity * 0.6; // 20% to 80% opacity
    
    if (r > 0) {
      // Blue for positive
      return `rgba(59, 130, 246, ${alpha})`;
    } else {
      // Orange for negative
      return `rgba(249, 115, 22, ${alpha})`;
    }
  };
  
  const getShortName = (code: IndexCode): string => {
    const def = getIndexDefinition(code);
    if (!def) return code;
    
    const name = language === 'sv' ? def.name_sv : def.name_en;
    // Truncate to fit
    return name.length > 12 ? name.slice(0, 10) + '...' : name;
  };
  
  return (
    <TooltipProvider>
      <div className={cn('overflow-x-auto', className)}>
        <div className="min-w-max">
          {/* Legend */}
          <div className="flex items-center justify-end gap-4 mb-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgba(59, 130, 246, 0.6)' }} />
              <span>{language === 'sv' ? 'Positiv samvariation' : 'Positive covariation'}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgba(249, 115, 22, 0.6)' }} />
              <span>{language === 'sv' ? 'Negativ samvariation' : 'Negative covariation'}</span>
            </div>
          </div>
          
          {/* Matrix */}
          <table className="border-collapse">
            <thead>
              <tr>
                <th className="w-32" />
                {indices.map(code => (
                  <th 
                    key={code} 
                    className="text-xs font-normal text-muted-foreground p-1 w-12 h-24"
                  >
                    <div className="transform -rotate-45 origin-bottom-left whitespace-nowrap">
                      {getShortName(code)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {indices.map((rowCode, rowIdx) => (
                <tr key={rowCode}>
                  <td className="text-xs text-right pr-2 font-medium">
                    {getShortName(rowCode)}
                  </td>
                  {indices.map((colCode, colIdx) => {
                    const corr = rowIdx !== colIdx ? getCorrelation(rowCode, colCode) : undefined;
                    const isDiagonal = rowIdx === colIdx;
                    
                    return (
                      <td key={colCode} className="p-0.5">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              className={cn(
                                'w-10 h-10 rounded text-xs font-mono flex items-center justify-center transition-all',
                                isDiagonal && 'bg-muted/50 cursor-default',
                                !isDiagonal && 'hover:ring-2 hover:ring-primary cursor-pointer',
                                corr?.spurious_warning && 'ring-1 ring-amber-500'
                              )}
                              style={{ 
                                backgroundColor: isDiagonal ? undefined : getCellColor(corr?.pearson_r) 
                              }}
                              onClick={() => !isDiagonal && onCellClick?.(rowCode, colCode)}
                              disabled={isDiagonal}
                            >
                              {isDiagonal ? '—' : corr ? corr.pearson_r.toFixed(2) : '?'}
                            </button>
                          </TooltipTrigger>
                          {!isDiagonal && (
                            <TooltipContent className="max-w-xs">
                              <div className="space-y-2">
                                <div className="font-medium">
                                  {getShortName(rowCode)} ↔ {getShortName(colCode)}
                                </div>
                                {corr ? (
                                  <>
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                                      <span className="text-muted-foreground">Pearson r:</span>
                                      <span className="font-mono">{corr.pearson_r.toFixed(4)}</span>
                                      
                                      <span className="text-muted-foreground">p-value:</span>
                                      <span className="font-mono">{corr.p_value.toFixed(4)}</span>
                                      
                                      <span className="text-muted-foreground">
                                        {language === 'sv' ? 'Urval' : 'Sample'}:
                                      </span>
                                      <span className="font-mono">{corr.sample_size}</span>
                                      
                                      <span className="text-muted-foreground">
                                        {language === 'sv' ? 'Konfidens' : 'Confidence'}:
                                      </span>
                                      <span className="font-mono">{corr.confidence_level}</span>
                                    </div>
                                    
                                    {corr.spurious_warning && (
                                      <div className="text-xs text-amber-500 mt-2">
                                        ⚠️ {language === 'sv' 
                                          ? 'Varning: Litet urval kan ge missvisande korrelation'
                                          : 'Warning: Small sample may produce misleading correlation'}
                                      </div>
                                    )}
                                    
                                    <div className="text-xs text-muted-foreground mt-2 pt-2 border-t">
                                      {language === 'sv' 
                                        ? 'Korrelation innebär inte kausalitet'
                                        : 'Correlation does not imply causation'}
                                    </div>
                                  </>
                                ) : (
                                  <div className="text-xs text-muted-foreground">
                                    {language === 'sv' 
                                      ? 'Otillräcklig data för beräkning'
                                      : 'Insufficient data for calculation'}
                                  </div>
                                )}
                              </div>
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Disclaimer */}
          <div className="mt-4 p-3 bg-muted/30 rounded text-xs text-muted-foreground">
            <p className="font-medium mb-1">
              {language === 'sv' ? 'Viktig information' : 'Important Information'}
            </p>
            <p>
              {language === 'sv'
                ? 'Korrelation innebär inte kausalitet. Observerade samband kan ha alternativa förklaringar som inte visas här. Statistisk signifikans garanterar inte praktisk betydelse.'
                : 'Correlation does not imply causation. Observed relationships may have alternative explanations not shown here. Statistical significance does not guarantee practical significance.'}
            </p>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

export default CorrelationMatrix;
