import { ExternalLink, Clock, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';

interface SourceAttributionProps {
  /** Källans namn */
  sourceName: string;
  
  /** URL till ursprungskälla */
  sourceUrl: string;
  
  /** Licensinformation */
  license?: string;
  
  /** Senast uppdaterad (datum) */
  lastUpdated?: Date | string;
  
  /** Visuell variant */
  variant?: 'full' | 'compact' | 'inline';
  
  className?: string;
}

/**
 * DEL XIV LAGER A: Källattribution
 * 
 * Visar alltid:
 * - Källa: X
 * - Licens: Y  
 * - Senast uppdaterad: Z
 * - Länk till ursprung
 */
export function SourceAttribution({
  sourceName,
  sourceUrl,
  license,
  lastUpdated,
  variant = 'compact',
  className = '',
}: SourceAttributionProps) {
  const formattedDate = lastUpdated
    ? format(
        typeof lastUpdated === 'string' ? new Date(lastUpdated) : lastUpdated,
        'PPP',
        { locale: sv }
      )
    : null;

  if (variant === 'inline') {
    return (
      <span className={`text-xs text-muted-foreground ${className}`}>
        Källa:{' '}
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-foreground"
        >
          {sourceName}
        </a>
        {license && <span> ({license})</span>}
      </span>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2 text-xs text-muted-foreground ${className}`}>
        <Shield className="h-3 w-3 shrink-0" />
        <span>
          Källa:{' '}
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-2 hover:text-foreground"
          >
            {sourceName}
            <ExternalLink className="h-2.5 w-2.5 inline ml-0.5" />
          </a>
        </span>
        {license && (
          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
            {license}
          </Badge>
        )}
        {formattedDate && (
          <span className="flex items-center gap-1">
            <Clock className="h-2.5 w-2.5" />
            {formattedDate}
          </span>
        )}
      </div>
    );
  }

  // Full variant
  return (
    <div className={`p-3 border rounded-lg bg-muted/30 ${className}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Datakälla</span>
          </div>
          
          <p className="text-sm">
            <span className="text-muted-foreground">Källa:</span>{' '}
            <span className="font-medium">{sourceName}</span>
          </p>
          
          {license && (
            <p className="text-sm">
              <span className="text-muted-foreground">Licens:</span>{' '}
              <span>{license}</span>
            </p>
          )}
          
          {formattedDate && (
            <p className="text-sm">
              <span className="text-muted-foreground">Senast uppdaterad:</span>{' '}
              <span>{formattedDate}</span>
            </p>
          )}
        </div>
        
        <Button variant="outline" size="sm" asChild>
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Visa källa
          </a>
        </Button>
      </div>
      
      <p className="text-xs text-muted-foreground mt-3 pt-3 border-t">
        Data från öppen källa, ej modifierad av systemet.
      </p>
    </div>
  );
}
