/**
 * 🗺️ Perception Heatmap
 * 
 * "Var brukar människor ha mest fel?"
 * Shows aggregate perception gaps across questions and demographics.
 */

import { cn } from '@/lib/utils';
import { Info } from 'lucide-react';
import type { PerceptionGap, QuestionCategory } from '@/types/realityCheck';

interface PerceptionHeatmapProps {
  gaps: PerceptionGap[];
  groupBy?: 'category' | 'region' | 'indicator';
  className?: string;
}

const categoryLabels: Record<QuestionCategory, string> = {
  trend: 'Trender',
  comparison: 'Jämförelser',
  distribution: 'Fördelningar',
  correlation: 'Korrelationer',
  magnitude: 'Storlek',
  ranking: 'Rankingar',
};

export function PerceptionHeatmap({
  gaps,
  groupBy: _groupBy = 'category',
  className,
}: PerceptionHeatmapProps) {
  // Group gaps by category
  const groupedByCategory = gaps.reduce((acc, gap) => {
    const key = gap.questionCategory;
    if (!acc[key]) acc[key] = [];
    acc[key].push(gap);
    return acc;
  }, {} as Record<QuestionCategory, PerceptionGap[]>);

  // Calculate average gap per category
  const categoryAverages = Object.entries(groupedByCategory).map(([category, categoryGaps]) => {
    const avgGap = categoryGaps.reduce((sum, g) => sum + Math.abs(g.gapPercent), 0) / categoryGaps.length;
    const totalSamples = categoryGaps.reduce((sum, g) => sum + g.sampleSize, 0);
    const overCount = categoryGaps.filter(g => g.gapDirection === 'over').length;
    const underCount = categoryGaps.filter(g => g.gapDirection === 'under').length;
    
    return {
      category: category as QuestionCategory,
      averageGap: avgGap,
      totalSamples,
      tendencyToOverestimate: overCount > underCount,
      questions: categoryGaps.length,
    };
  }).sort((a, b) => b.averageGap - a.averageGap);

  // Color scale based on gap size
  const getGapColor = (gap: number): string => {
    if (gap < 10) return 'bg-status-positive/20 text-status-positive';
    if (gap < 25) return 'bg-status-warning/20 text-status-warning';
    if (gap < 50) return 'bg-orange-500/20 text-orange-600';
    return 'bg-status-negative/20 text-status-negative';
  };

  const getGapLabel = (gap: number): string => {
    if (gap < 10) return 'Nära verkligheten';
    if (gap < 25) return 'Viss avvikelse';
    if (gap < 50) return 'Betydande gap';
    return 'Stort gap';
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Perception vs Verklighet</h2>
        <p className="text-muted-foreground">
          Var brukar människor ha störst skillnad mellan uppfattning och observerad data?
        </p>
      </div>

      {/* Disclaimer */}
      <div className="p-3 bg-muted rounded-lg flex items-start gap-2 text-sm">
        <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
        <p className="text-muted-foreground">
          Denna vy visar aggregerade mönster, inte individuella resultat. 
          Ett stort "gap" betyder att många människor överskrider eller underskattar – 
          det säger inget om vad som är "bättre" eller "sämre".
        </p>
      </div>

      {/* Heatmap grid */}
      <div className="space-y-3">
        {categoryAverages.map((item) => (
          <div 
            key={item.category}
            className="flex items-center gap-4 p-4 border rounded-lg"
          >
            {/* Category label */}
            <div className="w-32 shrink-0">
              <p className="font-medium">{categoryLabels[item.category]}</p>
              <p className="text-xs text-muted-foreground">
                {item.questions} frågor
              </p>
            </div>
            
            {/* Gap bar */}
            <div className="flex-1">
              <div className="h-8 bg-muted rounded-full overflow-hidden relative">
                {/* Center line (reality) */}
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border" />
                
                {/* Gap indicator */}
                <div 
                  className={cn(
                    'absolute top-0 bottom-0 transition-all',
                    item.tendencyToOverestimate 
                      ? 'left-1/2 bg-status-warning/40' 
                      : 'right-1/2 bg-primary/40'
                  )}
                  style={{ 
                    width: `${Math.min(item.averageGap, 50)}%`,
                  }}
                />
              </div>
              
              <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                <span>Underskattar</span>
                <span>Verklighet</span>
                <span>Överskattar</span>
              </div>
            </div>
            
            {/* Gap value */}
            <div className={cn(
              'w-24 text-center py-2 rounded-lg shrink-0',
              getGapColor(item.averageGap)
            )}>
              <p className="text-lg font-mono font-bold">
                {item.averageGap.toFixed(0)}%
              </p>
              <p className="text-xs">
                {getGapLabel(item.averageGap)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 pt-4 border-t">
        <span className="text-sm text-muted-foreground">Gap-storlek:</span>
        <span className={cn('text-xs px-2 py-1 rounded', getGapColor(5))}>{"<10%"}</span>
        <span className={cn('text-xs px-2 py-1 rounded', getGapColor(20))}>10-25%</span>
        <span className={cn('text-xs px-2 py-1 rounded', getGapColor(40))}>25-50%</span>
        <span className={cn('text-xs px-2 py-1 rounded', getGapColor(60))}>{">50%"}</span>
      </div>

      {/* Sample size note */}
      <p className="text-xs text-muted-foreground text-center">
        Baserat på {gaps.reduce((sum, g) => sum + g.sampleSize, 0).toLocaleString()} svar
      </p>
    </div>
  );
}
