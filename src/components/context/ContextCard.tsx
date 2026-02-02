/**
 * WAVE 8 BLOCK BM: Context Cards
 * 
 * UI-komponenter för kontextuell information.
 * Visar relaterade förändringar, samtida händelser, påverkande faktorer.
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Minus, 
  Info,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from 'lucide-react';
import { 
  CONTEXT_DIMENSIONS, 
  CONTEXT_DISCLAIMER,
  NEUTRAL_RELATION_PHRASES,
  type ContextItem,
} from '@/config/contextEngineConfig';

interface ContextCardProps {
  type: 'related_changes' | 'concurrent_events' | 'influencing_factors';
  title: string;
  items: ContextItem[];
  lang?: 'sv' | 'en';
  className?: string;
}

export function ContextCard({
  type,
  title,
  items,
  lang = 'sv',
  className = '',
}: ContextCardProps) {
  const [expanded, setExpanded] = useState(false);

  const displayItems = expanded ? items : items.slice(0, 3);

  const getDirectionIcon = (direction: 'up' | 'down' | 'stable') => {
    switch (direction) {
      case 'up':
        return <ArrowUpRight className="h-4 w-4 text-emerald-600" />;
      case 'down':
        return <ArrowDownRight className="h-4 w-4 text-rose-600" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getRelationPhrase = (observationType: ContextItem['observationType']) => {
    return NEUTRAL_RELATION_PHRASES[lang][observationType];
  };

  const getDimensionName = (dimensionId: string) => {
    const dim = CONTEXT_DIMENSIONS.find(d => d.id === dimensionId);
    return dim ? (lang === 'sv' ? dim.name : dim.name_en) : dimensionId;
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <Card className={`border-l-4 border-l-primary/20 ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          {title}
          <Badge variant="outline" className="text-xs font-normal">
            {items.length} {lang === 'sv' ? 'observationer' : 'observations'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {displayItems.map((item, index) => (
          <div 
            key={`${item.dimension}-${item.indicator}-${index}`}
            className="p-3 bg-muted/30 rounded-lg space-y-2"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {getDirectionIcon(item.changeDirection)}
                  <span className="font-medium text-sm">
                    {getDimensionName(item.dimension)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {item.indicator}
                </p>
              </div>
              <div className="text-right">
                <span className={`text-sm font-mono ${
                  item.changeDirection === 'up' ? 'text-emerald-600' :
                  item.changeDirection === 'down' ? 'text-rose-600' :
                  'text-muted-foreground'
                }`}>
                  {item.change > 0 ? '+' : ''}{item.change.toFixed(1)}%
                </span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground italic">
              {getRelationPhrase(item.observationType)}
              {item.timeLag > 0 && (
                <span className="ml-1">
                  ({item.timeLag} {lang === 'sv' ? 'mån tidsskillnad' : 'months lag'})
                </span>
              )}
            </p>

            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary/50 rounded-full"
                  style={{ width: `${item.correlationStrength * 100}%` }}
                />
              </div>
              <span className="text-[10px] text-muted-foreground">
                {(item.correlationStrength * 100).toFixed(0)}% {lang === 'sv' ? 'korrelation' : 'correlation'}
              </span>
            </div>
          </div>
        ))}

        {items.length > 3 && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <>
                <ChevronUp className="h-4 w-4 mr-1" />
                {lang === 'sv' ? 'Visa färre' : 'Show less'}
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-1" />
                {lang === 'sv' ? `Visa alla ${items.length}` : `Show all ${items.length}`}
              </>
            )}
          </Button>
        )}

        <div className="pt-2 border-t">
          <p className="text-[10px] text-muted-foreground flex items-start gap-1">
            <Info className="h-3 w-3 shrink-0 mt-0.5" />
            {CONTEXT_DISCLAIMER[lang]}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Kompakt version för inline-visning
 */
export function ContextBadge({
  item,
  lang = 'sv',
}: {
  item: ContextItem;
  lang?: 'sv' | 'en';
}) {
  const getDimensionName = (dimensionId: string) => {
    const dim = CONTEXT_DIMENSIONS.find(d => d.id === dimensionId);
    return dim ? (lang === 'sv' ? dim.name : dim.name_en) : dimensionId;
  };

  return (
    <Badge 
      variant="outline" 
      className="text-xs gap-1 py-1"
    >
      {item.changeDirection === 'up' ? (
        <ArrowUpRight className="h-3 w-3 text-emerald-600" />
      ) : item.changeDirection === 'down' ? (
        <ArrowDownRight className="h-3 w-3 text-rose-600" />
      ) : (
        <Minus className="h-3 w-3" />
      )}
      {getDimensionName(item.dimension)}
      <span className="font-mono">
        {item.change > 0 ? '+' : ''}{item.change.toFixed(1)}%
      </span>
    </Badge>
  );
}
