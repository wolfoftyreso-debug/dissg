import { useState } from 'react';
import { HelpCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getSimpleExplanation } from '@/config/simpleExplanations';

interface SimpleExplanationButtonProps {
  kpiId: string;
  kpiName: string;
  currentTrend: 'up' | 'down' | 'stable';
  isInverted?: boolean;
  className?: string;
}

/**
 * "Förklara enkelt" button that shows a single-sentence explanation
 * that anyone can understand
 */
export function SimpleExplanationButton({
  kpiId,
  kpiName,
  currentTrend,
  isInverted = false,
  className,
}: SimpleExplanationButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const explanation = getSimpleExplanation(kpiId);
  
  // Determine if current trend is good or bad
  const trendIsGood = isInverted
    ? currentTrend === 'down'
    : currentTrend === 'up';
  
  const trendIsBad = isInverted
    ? currentTrend === 'up'
    : currentTrend === 'down';

  const trendContext = trendIsGood
    ? 'Det går åt rätt håll just nu.'
    : trendIsBad
      ? 'Det går åt fel håll just nu.'
      : 'Det är stabilt just nu.';

  return (
    <div className={cn('relative', className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="h-7 text-xs gap-1.5 text-muted-foreground hover:text-foreground"
      >
        <HelpCircle className="h-3.5 w-3.5" />
        Förklara enkelt
      </Button>

      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 z-50 w-80 max-w-[90vw]">
          <div className="bg-card border border-border rounded-lg shadow-lg p-4 space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{explanation.icon}</span>
                <h4 className="font-semibold text-sm">{kpiName}</h4>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 shrink-0"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* One-liner explanation */}
            <p className="text-sm text-foreground leading-relaxed">
              {explanation.oneLiner}
            </p>

            {/* Current status */}
            <div className={cn(
              'text-xs p-2 rounded',
              trendIsGood ? 'bg-status-positive/10 text-status-positive' :
              trendIsBad ? 'bg-status-critical/10 text-status-critical' :
              'bg-muted text-muted-foreground'
            )}>
              {trendContext}
            </div>

            {/* Why it matters */}
            <div className="pt-2 border-t border-border">
              <p className="text-xs text-muted-foreground">
                <span className="font-medium">Varför det spelar roll:</span>{' '}
                {explanation.whyItMatters}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
