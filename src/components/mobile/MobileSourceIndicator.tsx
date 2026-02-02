/**
 * Mobile Source Indicator
 * Compact, always-visible source attribution for mobile
 * Follows Spotless Protocol: Source must be visible, clickable, never hover-only
 */

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Calendar, Database, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SourceInfo {
  /** Primary source name */
  name: string;
  /** Publication date */
  publishedAt?: string;
  /** Data coverage description */
  coverage?: string;
  /** Method type */
  methodType?: 'survey' | 'register' | 'estimate' | 'composite' | 'observed';
  /** Direct link to source */
  url?: string;
  /** Reliability score (0-1) */
  reliability?: number;
}

interface MobileSourceIndicatorProps {
  source: SourceInfo;
  /** Compact mode for inline use */
  compact?: boolean;
  /** Show full details */
  expanded?: boolean;
  /** Click handler */
  onClick?: () => void;
  className?: string;
}

const METHOD_LABELS: Record<string, string> = {
  survey: 'Enkät',
  register: 'Register',
  estimate: 'Uppskattning',
  composite: 'Sammansatt',
  observed: 'Observerad',
};

export function MobileSourceIndicator({
  source,
  compact = false,
  expanded = false,
  onClick,
  className,
}: MobileSourceIndicatorProps) {
  const hasUrl = !!source.url;
  
  const Wrapper = hasUrl ? 'a' : 'button';
  const wrapperProps = hasUrl 
    ? { href: source.url, target: '_blank', rel: 'noopener noreferrer' }
    : { onClick };

  if (compact) {
    return (
      <Wrapper
        {...wrapperProps}
        className={cn(
          'inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors min-h-[44px] px-2',
          className
        )}
      >
        <Database className="h-3 w-3" />
        <span className="underline">{source.name}</span>
        {hasUrl && <ExternalLink className="h-3 w-3" />}
      </Wrapper>
    );
  }

  return (
    <div className={cn('rounded-lg border bg-muted/30 p-3', className)}>
      {/* Source Name + Link */}
      <Wrapper
        {...wrapperProps}
        className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors min-h-[44px] w-full justify-between"
      >
        <span className="flex items-center gap-2">
          <Database className="h-4 w-4 text-muted-foreground" />
          <span className="underline">{source.name}</span>
        </span>
        {hasUrl && <ExternalLink className="h-4 w-4 text-muted-foreground" />}
      </Wrapper>

      {expanded && (
        <div className="mt-3 space-y-2 text-xs text-muted-foreground">
          {/* Publication Date */}
          {source.publishedAt && (
            <div className="flex items-center gap-2">
              <Calendar className="h-3 w-3" />
              <span>Publicerad: {source.publishedAt}</span>
            </div>
          )}

          {/* Method Type */}
          {source.methodType && (
            <Badge variant="outline" className="text-xs">
              {METHOD_LABELS[source.methodType] || source.methodType}
            </Badge>
          )}

          {/* Coverage */}
          {source.coverage && (
            <p className="pt-1">{source.coverage}</p>
          )}

          {/* Reliability Warning */}
          {source.reliability !== undefined && source.reliability < 0.7 && (
            <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 pt-2">
              <AlertCircle className="h-3 w-3" />
              <span>Begränsad tillförlitlighet ({Math.round(source.reliability * 100)}%)</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Inline source badge for use within text
 */
export function InlineSourceBadge({ source }: { source: SourceInfo }) {
  return (
    <a
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground underline"
    >
      [{source.name}]
      <ExternalLink className="h-2.5 w-2.5" />
    </a>
  );
}
