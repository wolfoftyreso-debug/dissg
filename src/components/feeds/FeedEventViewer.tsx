import React, { useState } from 'react';
import { 
  useFeedEvents, 
  useLogFeedInteraction,
  severityConfig,
  tierConfig,
  FeedEvent,
  FeedSeverity
} from '@/hooks/useIntelligenceFeeds';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Bell, 
  ExternalLink, 
  Clock, 
  MapPin, 
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Filter,
  Share2,
  Eye
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Link } from 'react-router-dom';

interface FeedEventViewerProps {
  feedId?: string;
  maxHeight?: string;
  className?: string;
}

export function FeedEventViewer({ feedId, maxHeight = '600px', className }: FeedEventViewerProps) {
  const [severityFilter, setSeverityFilter] = useState<FeedSeverity | 'all'>('all');
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set());
  
  const { data: events, isLoading } = useFeedEvents(
    feedId, 
    { 
      severity: severityFilter === 'all' ? undefined : severityFilter,
      limit: 100 
    }
  );
  const logInteraction = useLogFeedInteraction();

  const toggleExpanded = (eventId: string) => {
    const newExpanded = new Set(expandedEvents);
    if (newExpanded.has(eventId)) {
      newExpanded.delete(eventId);
    } else {
      newExpanded.add(eventId);
      logInteraction.mutate({ 
        eventId, 
        interactionType: 'clicked',
        context: { expanded: true }
      });
    }
    setExpandedEvents(newExpanded);
  };

  const handleExplore = (event: FeedEvent) => {
    logInteraction.mutate({ 
      eventId: event.id, 
      interactionType: 'explored',
      context: { url: event.explore_url }
    });
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return 'Just nu';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} min sedan`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} tim sedan`;
    return date.toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' });
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Intelligence Feed
          </CardTitle>
          <Select 
            value={severityFilter} 
            onValueChange={(v) => setSeverityFilter(v as FeedSeverity | 'all')}
          >
            <SelectTrigger className="w-[140px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alla nivåer</SelectItem>
              <SelectItem value="critical">Kritiska</SelectItem>
              <SelectItem value="high">Höga</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Låga</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        <ScrollArea style={{ height: maxHeight }} className="pr-4">
          {events && events.length > 0 ? (
            <div className="space-y-3">
              {events.map(event => (
                <FeedEventCard
                  key={event.id}
                  event={event}
                  isExpanded={expandedEvents.has(event.id)}
                  onToggle={() => toggleExpanded(event.id)}
                  onExplore={() => handleExplore(event)}
                  formatTimestamp={formatTimestamp}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Inga feed-händelser att visa</p>
              <p className="text-xs mt-1">Nya händelser visas här automatiskt</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function FeedEventCard({
  event,
  isExpanded,
  onToggle,
  onExplore,
  formatTimestamp,
}: {
  event: FeedEvent;
  isExpanded: boolean;
  onToggle: () => void;
  onExplore: () => void;
  formatTimestamp: (ts: string) => string;
}) {
  const severity = severityConfig[event.severity];
  const tier = event.feed_definitions?.tier 
    ? tierConfig[event.feed_definitions.tier as keyof typeof tierConfig]
    : null;

  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <Card className={`${severity.bgColor} border-0`}>
        <CollapsibleTrigger asChild>
          <CardContent className="p-3 cursor-pointer hover:bg-muted/20 transition-colors">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${severity.bgColor} ${severity.color}`}
                  >
                    {event.severity === 'critical' && <AlertTriangle className="h-3 w-3 mr-1" />}
                    {severity.label}
                  </Badge>
                  {tier && (
                    <Badge variant="outline" className="text-xs">
                      {tier.icon} {event.feed_definitions?.name}
                    </Badge>
                  )}
                </div>

                <p className="font-medium text-sm line-clamp-2">{event.summary}</p>

                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatTimestamp(event.generated_at)}
                  </span>
                  {event.scope_code && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {event.scope_code}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {event.confidence}
                  </span>
                </div>
              </div>

              <div className="flex-shrink-0">
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </div>
          </CardContent>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0 pb-3 px-3 space-y-3">
            {/* Why now */}
            {event.why_now && event.why_now.length > 0 && (
              <div className="bg-background/50 rounded-lg p-3">
                <h4 className="text-xs font-medium mb-2 uppercase tracking-wider text-muted-foreground">
                  Varför nu?
                </h4>
                <ul className="space-y-1">
                  {event.why_now.map((reason, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Metrics */}
            {event.metrics && event.metrics.length > 0 && (
              <div>
                <h4 className="text-xs font-medium mb-2 uppercase tracking-wider text-muted-foreground">
                  Mätvärden
                </h4>
                <div className="grid gap-2">
                  {event.metrics.slice(0, 5).map((metric, i) => (
                    <div 
                      key={i} 
                      className="flex items-center justify-between bg-background/50 rounded-lg p-2"
                    >
                      <span className="text-sm truncate flex-1">
                        {metric.name || metric.kpi}
                      </span>
                      {metric.delta && (
                        <span className={`font-mono text-sm font-medium flex items-center gap-1 ${
                          metric.delta.startsWith('+') ? 'text-green-500' :
                          metric.delta.startsWith('-') ? 'text-red-500' :
                          'text-muted-foreground'
                        }`}>
                          {metric.delta.startsWith('+') ? (
                            <TrendingUp className="h-3 w-3" />
                          ) : metric.delta.startsWith('-') ? (
                            <TrendingDown className="h-3 w-3" />
                          ) : null}
                          {metric.delta}
                        </span>
                      )}
                      {metric.period && (
                        <span className="text-xs text-muted-foreground ml-2">
                          {metric.period}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2">
              {event.explore_url && (
                <Button 
                  size="sm" 
                  variant="default" 
                  asChild
                  onClick={onExplore}
                >
                  <Link to={event.explore_url}>
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Utforska
                  </Link>
                </Button>
              )}
              <Button size="sm" variant="outline">
                <Share2 className="h-3 w-3 mr-1" />
                Dela
              </Button>
            </div>

            {/* Sources */}
            {event.data_sources && event.data_sources.length > 0 && (
              <div className="text-xs text-muted-foreground pt-2 border-t border-border/50">
                Källor: {event.data_sources.join(', ')}
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
