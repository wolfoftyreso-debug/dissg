/**
 * MODE INDICATOR
 * 
 * Clear visual separation between:
 * - OBSERVATION MODE (default): Only measured data
 * - MODEL MODE (optional): Projections with explicit assumptions
 */

import { Eye, Cpu, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { MODEL_MODE_DISCLAIMER } from '@/lib/environment';
import type { DataMode } from '@/lib/environment';
import { cn } from '@/lib/utils';

interface ModeIndicatorProps {
  mode: DataMode;
  onModeChange?: (mode: DataMode) => void;
  language?: keyof typeof MODEL_MODE_DISCLAIMER;
}

export function ModeIndicator({ 
  mode, 
  onModeChange,
  language = 'sv'
}: ModeIndicatorProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {onModeChange ? (
          <div className="flex rounded-lg border border-border overflow-hidden">
            <button
              onClick={() => onModeChange('observation')}
              className={cn(
                "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors min-h-[44px]",
                mode === 'observation' 
                  ? "bg-chart-2 text-chart-2-foreground" 
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              <Eye className="w-4 h-4" />
              Observation
            </button>
            <button
              onClick={() => onModeChange('model')}
              className={cn(
                "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors min-h-[44px]",
                mode === 'model' 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              <Cpu className="w-4 h-4" />
              Modeller
            </button>
          </div>
        ) : (
          <Badge 
            variant="outline" 
            className={cn(
              "text-sm py-1 px-3",
              mode === 'observation' && "border-chart-2 text-chart-2",
              mode === 'model' && "border-primary text-primary"
            )}
          >
            {mode === 'observation' ? (
              <><Eye className="w-3 h-3 mr-1" /> Observationsläge</>
            ) : (
              <><Cpu className="w-3 h-3 mr-1" /> Modellläge</>
            )}
          </Badge>
        )}
      </div>
      
      {mode === 'model' && (
        <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/50 p-3 rounded-md">
          <AlertCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <p>{MODEL_MODE_DISCLAIMER[language]}</p>
        </div>
      )}
    </div>
  );
}
