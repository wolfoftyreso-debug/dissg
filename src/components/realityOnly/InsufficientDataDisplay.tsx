/**
 * 🔒 Insufficient Data Display
 * 
 * Component for displaying when data is unavailable.
 * "Tomhet > påhitt"
 */

import { cn } from '@/lib/utils';
import { AlertTriangle, Database, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { DataAvailability } from '@/types/realityOnly';
import { getUnavailableMessage } from '@/types/realityOnly';

interface InsufficientDataDisplayProps {
  availability: DataAvailability;
  context?: {
    indicator?: string;
    region?: string;
    period?: string;
  };
  onRequestData?: () => void;
  showDetails?: boolean;
  language?: 'en' | 'sv';
  className?: string;
}

export function InsufficientDataDisplay({
  availability,
  context,
  onRequestData,
  showDetails = true,
  language = 'sv',
  className,
}: InsufficientDataDisplayProps) {
  const message = getUnavailableMessage(availability, language);
  
  const titles: Record<DataAvailability, Record<'en' | 'sv', string>> = {
    verified: { en: '', sv: '' },
    partial: { en: 'Partial Data', sv: 'Delvis data' },
    insufficient: { en: 'Insufficient Data', sv: 'Otillräcklig data' },
    stale: { en: 'Outdated Data', sv: 'Föråldrad data' },
    conflicting: { en: 'Conflicting Sources', sv: 'Motstridiga källor' },
  };

  const icons: Record<DataAvailability, React.ReactNode> = {
    verified: null,
    partial: <Database className="h-8 w-8" />,
    insufficient: <AlertTriangle className="h-8 w-8" />,
    stale: <AlertTriangle className="h-8 w-8" />,
    conflicting: <AlertTriangle className="h-8 w-8" />,
  };

  if (availability === 'verified') return null;

  return (
    <div className={cn(
      'border rounded-lg p-8 text-center space-y-4',
      availability === 'insufficient' && 'bg-muted/50 border-muted-foreground/20',
      availability === 'stale' && 'bg-status-warning/5 border-status-warning/20',
      availability === 'conflicting' && 'bg-status-negative/5 border-status-negative/20',
      availability === 'partial' && 'bg-muted/30 border-muted-foreground/10',
      className
    )}>
      {/* Icon */}
      <div className={cn(
        'mx-auto w-16 h-16 rounded-full flex items-center justify-center',
        availability === 'insufficient' && 'bg-muted text-muted-foreground',
        availability === 'stale' && 'bg-status-warning/10 text-status-warning',
        availability === 'conflicting' && 'bg-status-negative/10 text-status-negative',
        availability === 'partial' && 'bg-muted text-muted-foreground',
      )}>
        {icons[availability]}
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold">
        {titles[availability][language]}
      </h3>

      {/* Message */}
      <p className="text-muted-foreground max-w-md mx-auto">
        {message}
      </p>

      {/* Context details */}
      {showDetails && context && (
        <div className="text-sm text-muted-foreground space-y-1 pt-4 border-t">
          {context.indicator && (
            <p><span className="font-medium">{language === 'sv' ? 'Indikator' : 'Indicator'}:</span> {context.indicator}</p>
          )}
          {context.region && (
            <p><span className="font-medium">{language === 'sv' ? 'Region' : 'Region'}:</span> {context.region}</p>
          )}
          {context.period && (
            <p><span className="font-medium">{language === 'sv' ? 'Period' : 'Period'}:</span> {context.period}</p>
          )}
        </div>
      )}

      {/* Actions */}
      {onRequestData && (
        <div className="pt-4">
          <Button variant="outline" onClick={onRequestData}>
            <ExternalLink className="h-4 w-4 mr-2" />
            {language === 'sv' ? 'Begär data' : 'Request Data'}
          </Button>
        </div>
      )}

      {/* Principle reminder */}
      <p className="text-xs text-muted-foreground italic pt-4">
        {language === 'sv' 
          ? '"Tomhet > påhitt" — Vi visar hellre ingenting än något felaktigt.'
          : '"Emptiness > fabrication" — We prefer to show nothing than something incorrect.'
        }
      </p>
    </div>
  );
}
