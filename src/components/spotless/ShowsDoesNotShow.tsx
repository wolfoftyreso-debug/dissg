/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SHOWS / DOES NOT SHOW - Mandatory Limitation Block (Spotless Protocol §4)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Every view, graph, or summary MUST have two blocks:
 * 
 * A. "This Shows"
 *    - Exactly what is measured
 *    - Time period
 *    - Geographic resolution
 * 
 * B. "This Does Not Show"
 *    - What is not covered
 *    - What cannot be inferred
 *    - What is commonly misinterpreted
 * 
 * This is the most important misinterpretation barrier.
 */

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Eye, 
  EyeOff, 
  ChevronDown, 
  ChevronUp,
  Calendar,
  MapPin,
  AlertCircle,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { type LimitationBlock } from '@/context/SpotlessContext';

interface ShowsDoesNotShowProps {
  /** The limitation block data */
  limitations: LimitationBlock;
  /** Visual variant */
  variant?: 'full' | 'compact' | 'inline';
  /** Start expanded */
  defaultExpanded?: boolean;
  className?: string;
}

export function ShowsDoesNotShow({ 
  limitations, 
  variant = 'full',
  defaultExpanded = false,
  className 
}: ShowsDoesNotShowProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  // Validate completeness
  const isComplete = Boolean(
    limitations.whatThisShows?.length > 0 &&
    limitations.whatThisDoesNotShow?.length > 0 &&
    limitations.timePeriod &&
    limitations.geographicResolution
  );

  if (variant === 'inline') {
    return (
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <button
            className={cn(
              'inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs',
              'bg-muted/50 hover:bg-muted transition-colors',
              'text-muted-foreground hover:text-foreground',
              className
            )}
          >
            <Info className="h-3 w-3" />
            <span>Visa begränsningar</span>
            {isExpanded ? (
              <ChevronUp className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )}
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2">
          <LimitationContent limitations={limitations} compact />
        </CollapsibleContent>
      </Collapsible>
    );
  }

  if (variant === 'compact') {
    return (
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <Card className={cn('overflow-hidden', className)}>
          <CollapsibleTrigger asChild>
            <button className="w-full p-3 flex items-center justify-between hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Begränsningar och täckning</span>
                {!isComplete && (
                  <Badge variant="outline" className="text-status-critical border-status-critical/40 text-xs">
                    Ofullständig
                  </Badge>
                )}
              </div>
              {isExpanded ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0 pb-3">
              <LimitationContent limitations={limitations} compact />
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    );
  }

  // Full variant - always visible
  return (
    <Card className={cn(!isComplete && 'border-status-critical/40', className)}>
      <CardContent className="pt-4">
        <LimitationContent limitations={limitations} />
      </CardContent>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// LIMITATION CONTENT
// ═══════════════════════════════════════════════════════════════════════════

interface LimitationContentProps {
  limitations: LimitationBlock;
  compact?: boolean;
}

function LimitationContent({ limitations, compact }: LimitationContentProps) {
  return (
    <div className={cn('space-y-4', compact && 'space-y-3')}>
      {/* Metadata row */}
      <div className="flex flex-wrap gap-3">
        <Badge variant="secondary" className="gap-1.5">
          <Calendar className="h-3 w-3" />
          {limitations.timePeriod || 'Tidsperiod saknas'}
        </Badge>
        <Badge variant="secondary" className="gap-1.5">
          <MapPin className="h-3 w-3" />
          {limitations.geographicResolution || 'Geografisk upplösning saknas'}
        </Badge>
      </div>

      {/* Two-column layout */}
      <div className={cn('grid gap-4', compact ? 'grid-cols-1' : 'md:grid-cols-2')}>
        {/* This Shows */}
        <div className="space-y-2">
          <h4 className={cn(
            'font-semibold flex items-center gap-2',
            compact ? 'text-xs' : 'text-sm',
            'text-status-positive'
          )}>
            <Eye className={cn(compact ? 'h-3.5 w-3.5' : 'h-4 w-4')} />
            Detta visar
          </h4>
          {limitations.whatThisShows?.length > 0 ? (
            <ul className={cn('space-y-1.5', compact && 'space-y-1')}>
              {limitations.whatThisShows.map((item, i) => (
                <li 
                  key={i} 
                  className={cn(
                    'flex items-start gap-2',
                    compact ? 'text-xs' : 'text-sm',
                    'text-muted-foreground'
                  )}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-status-positive mt-1.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className={cn('text-muted-foreground italic', compact ? 'text-xs' : 'text-sm')}>
              Inte specificerat
            </p>
          )}
        </div>

        {/* This Does Not Show */}
        <div className="space-y-2">
          <h4 className={cn(
            'font-semibold flex items-center gap-2',
            compact ? 'text-xs' : 'text-sm',
            'text-status-warning'
          )}>
            <EyeOff className={cn(compact ? 'h-3.5 w-3.5' : 'h-4 w-4')} />
            Detta visar inte
          </h4>
          {limitations.whatThisDoesNotShow?.length > 0 ? (
            <ul className={cn('space-y-1.5', compact && 'space-y-1')}>
              {limitations.whatThisDoesNotShow.map((item, i) => (
                <li 
                  key={i} 
                  className={cn(
                    'flex items-start gap-2',
                    compact ? 'text-xs' : 'text-sm',
                    'text-muted-foreground'
                  )}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-status-warning mt-1.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className={cn('text-muted-foreground italic', compact ? 'text-xs' : 'text-sm')}>
              Inte specificerat
            </p>
          )}
        </div>
      </div>

      {/* Common misinterpretations */}
      {limitations.commonMisinterpretations && limitations.commonMisinterpretations.length > 0 && (
        <div className="p-3 bg-status-warning/5 border border-status-warning/20 rounded-md space-y-2">
          <h4 className={cn(
            'font-semibold flex items-center gap-2 text-status-warning',
            compact ? 'text-xs' : 'text-sm'
          )}>
            <AlertCircle className={cn(compact ? 'h-3.5 w-3.5' : 'h-4 w-4')} />
            Vanliga feltolkningar
          </h4>
          <ul className="space-y-1">
            {limitations.commonMisinterpretations.map((item, i) => (
              <li 
                key={i} 
                className={cn(
                  'flex items-start gap-2',
                  compact ? 'text-xs' : 'text-sm',
                  'text-muted-foreground'
                )}
              >
                <span className="text-status-warning">⚠</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ShowsDoesNotShow;
