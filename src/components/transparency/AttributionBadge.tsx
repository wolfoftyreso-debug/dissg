/**
 * Attribution Badge - Visar korrekt attribution för data
 */

import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Database, ExternalLink, Info } from 'lucide-react';
import { platformIdentity } from '@/config/licensingConfig';

interface AttributionBadgeProps {
  sourceName: string;
  sourceUrl?: string;
  isSystemGenerated?: boolean;
  showPlatformAttribution?: boolean;
  size?: 'sm' | 'md';
}

export function AttributionBadge({ 
  sourceName, 
  sourceUrl, 
  isSystemGenerated = false,
  showPlatformAttribution = true,
  size = 'sm' 
}: AttributionBadgeProps) {
  const sizeClasses = size === 'sm' ? 'text-xs' : 'text-sm';
  const iconSize = size === 'sm' ? 'h-3 w-3' : 'h-4 w-4';

  return (
    <div className={`flex items-center gap-2 ${sizeClasses} text-muted-foreground`}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="outline" className={`gap-1 ${sizeClasses}`}>
            <Database className={iconSize} />
            {isSystemGenerated ? platformIdentity.name : sourceName}
            {sourceUrl && (
              <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="ml-1">
                <ExternalLink className={`${iconSize} hover:text-primary`} />
              </a>
            )}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1">
            <p className="font-semibold">{isSystemGenerated ? 'Systemgenererad data' : 'Öppen källdata'}</p>
            <p className="text-xs">
              {isSystemGenerated 
                ? `Beräknad av ${platformIdentity.name}`
                : `Källa: ${sourceName}`
              }
            </p>
          </div>
        </TooltipContent>
      </Tooltip>

      {showPlatformAttribution && !isSystemGenerated && (
        <span className="text-xs text-muted-foreground">
          via {platformIdentity.name}
        </span>
      )}
    </div>
  );
}

interface SourceAttributionProps {
  sources: Array<{
    name: string;
    url?: string;
    type: 'open' | 'system';
  }>;
}

export function SourceAttribution({ sources }: SourceAttributionProps) {
  const openSources = sources.filter(s => s.type === 'open');
  const systemSources = sources.filter(s => s.type === 'system');

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
      {openSources.length > 0 && (
        <div className="flex items-center gap-1">
          <span>Källor:</span>
          {openSources.map((source, i) => (
            <span key={source.name}>
              {source.url ? (
                <a href={source.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {source.name}
                </a>
              ) : (
                source.name
              )}
              {i < openSources.length - 1 && ', '}
            </span>
          ))}
        </div>
      )}
      
      {systemSources.length > 0 && openSources.length > 0 && (
        <span>•</span>
      )}
      
      {systemSources.length > 0 && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="secondary" className="text-xs gap-1 cursor-help">
              <Info className="h-2 w-2" />
              + {platformIdentity.name}-analys
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>Inkluderar systemgenererade beräkningar:</p>
            <ul className="text-xs mt-1">
              {systemSources.map(s => (
                <li key={s.name}>• {s.name}</li>
              ))}
            </ul>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}

export function PlatformAttributionFooter() {
  return (
    <div className="text-center text-xs text-muted-foreground py-4 border-t">
      <p>
        Data och analyser tillhandahålls av{' '}
        <span className="font-medium">{platformIdentity.name}</span>
      </p>
      <p className="mt-1">{platformIdentity.tagline}</p>
    </div>
  );
}

export function AttributionRequirementNotice({ tier }: { tier: 'open' | 'plus' | 'pro' | 'enterprise' }) {
  const requirement = {
    open: { level: 'Obligatorisk', description: 'Synlig attribution krävs vid all publicering' },
    plus: { level: 'Rekommenderad', description: 'Attribution uppskattas men ej obligatorisk' },
    pro: { level: 'Valfri', description: 'Ingen attribution krävs' },
    enterprise: { level: 'Valfri', description: 'Ingen attribution krävs' },
  }[tier];

  return (
    <div className="flex items-center gap-2 text-xs">
      <Badge variant="outline">{requirement.level}</Badge>
      <span className="text-muted-foreground">{requirement.description}</span>
    </div>
  );
}

export default AttributionBadge;
