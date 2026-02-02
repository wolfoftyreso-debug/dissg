/**
 * LOCKED CORRELATION WARNING
 * 
 * This component CANNOT be disabled.
 * It appears on every environmental data view.
 * 
 * "These data show co-movement over time.
 *  They do not, by themselves, establish causation."
 */

import { AlertTriangle } from 'lucide-react';
import { CORRELATION_WARNING } from '@/lib/environment';

interface CorrelationWarningProps {
  language?: keyof typeof CORRELATION_WARNING;
  compact?: boolean;
}

export function CorrelationWarning({ 
  language = 'sv',
  compact = false 
}: CorrelationWarningProps) {
  const text = CORRELATION_WARNING[language] || CORRELATION_WARNING.sv;
  
  if (compact) {
    return (
      <div className="flex items-center gap-2 text-xs text-warning bg-warning/10 px-3 py-2 rounded-md">
        <AlertTriangle className="w-3 h-3 shrink-0" />
        <span>{text}</span>
      </div>
    );
  }
  
  return (
    <div className="border border-warning/30 bg-warning/5 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-warning/20 flex items-center justify-center shrink-0">
          <AlertTriangle className="w-4 h-4 text-warning" />
        </div>
        <div>
          <p className="text-sm font-medium text-warning-foreground">
            Korrelation ≠ Kausalitet
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}
