import React, { useState, useMemo } from 'react';
import { useDecisionTimeline, calculateEffectiveness, TimelineEvent, PolicyDecision, KpiChangePoint } from '@/hooks/useDecisionTimeline';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Calendar,
  FileText,
  TrendingUp,
  TrendingDown,
  Minus,
  ExternalLink,
  BarChart3,
  GitCommit,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface DecisionTimelineViewProps {
  className?: string;
}

export function DecisionTimelineView({ className }: DecisionTimelineViewProps) {
  const [timeRange, setTimeRange] = useState('5y');
  const [selectedKpi, setSelectedKpi] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const getDateRange = () => {
    const now = new Date();
    const to = now.toISOString().split('T')[0];
    let from: string;
    
    switch (timeRange) {
      case '1y': from = new Date(now.setFullYear(now.getFullYear() - 1)).toISOString().split('T')[0]; break;
      case '2y': from = new Date(now.setFullYear(now.getFullYear() - 2)).toISOString().split('T')[0]; break;
      case '5y': from = new Date(now.setFullYear(now.getFullYear() - 5)).toISOString().split('T')[0]; break;
      case '10y': from = new Date(now.setFullYear(now.getFullYear() - 10)).toISOString().split('T')[0]; break;
      default: from = '2010-01-01';
    }
    
    return { from, to };
  };

  const { from, to } = getDateRange();
  const { data, isLoading, error } = useDecisionTimeline(from, to);

  // Combine and sort all timeline items
  const timelineItems = useMemo(() => {
    if (!data) return [];

    const items: Array<{
      type: 'event' | 'decision' | 'kpi_change';
      date: string;
      data: TimelineEvent | PolicyDecision | KpiChangePoint;
    }> = [];

    // Add events
    data.events.forEach(event => {
      items.push({ type: 'event', date: event.event_date, data: event });
    });

    // Add decisions
    data.decisions.forEach(decision => {
      items.push({ type: 'decision', date: decision.decision_date, data: decision });
    });

    // Add KPI changes
    data.kpiChanges.forEach(change => {
      items.push({ type: 'kpi_change', date: change.period_start, data: change });
    });

    // Sort by date descending
    return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [data]);

  // Filter by selected KPI
  const filteredItems = useMemo(() => {
    if (!selectedKpi) return timelineItems;
    
    return timelineItems.filter(item => {
      if (item.type === 'kpi_change') {
        return (item.data as KpiChangePoint).kpi_id === selectedKpi;
      }
      if (item.type === 'event') {
        return (item.data as TimelineEvent).affected_kpi_ids?.includes(selectedKpi);
      }
      if (item.type === 'decision') {
        return (item.data as PolicyDecision).target_kpis?.includes(selectedKpi);
      }
      return true;
    });
  }, [timelineItems, selectedKpi]);

  // Get unique KPIs for filter
  const uniqueKpis = useMemo(() => {
    if (!data) return [];
    const kpis = new Map<string, string>();
    data.kpiChanges.forEach(change => {
      kpis.set(change.kpi_id, change.kpi_name);
    });
    return Array.from(kpis.entries()).map(([id, name]) => ({ id, name }));
  }, [data]);

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };


  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('sv-SE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="py-8 text-center">
          <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-destructive" />
          <p className="text-sm text-muted-foreground">Kunde inte ladda tidslinjen</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Beslutstidslinje
          </CardTitle>
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1y">1 år</SelectItem>
                <SelectItem value="2y">2 år</SelectItem>
                <SelectItem value="5y">5 år</SelectItem>
                <SelectItem value="10y">10 år</SelectItem>
                <SelectItem value="all">Alla</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedKpi || 'all'} onValueChange={(v) => setSelectedKpi(v === 'all' ? null : v)}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Alla KPI:er" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alla KPI:er</SelectItem>
                {uniqueKpis.map(kpi => (
                  <SelectItem key={kpi.id} value={kpi.id}>
                    {kpi.name.slice(0, 25)}...
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="bg-muted/30 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-primary">{data?.decisions.length || 0}</div>
            <div className="text-xs text-muted-foreground">Policy-beslut</div>
          </div>
          <div className="bg-muted/30 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-blue-500">{data?.events.length || 0}</div>
            <div className="text-xs text-muted-foreground">Händelser</div>
          </div>
          <div className="bg-muted/30 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-green-500">{data?.kpiChanges.length || 0}</div>
            <div className="text-xs text-muted-foreground">KPI-förändringar</div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="timeline">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="timeline">Tidslinje</TabsTrigger>
            <TabsTrigger value="decisions">Beslut</TabsTrigger>
            <TabsTrigger value="effects">Effekter</TabsTrigger>
          </TabsList>

          <TabsContent value="timeline">
            <ScrollArea className="h-[500px] pr-4">
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />

                {filteredItems.length > 0 ? (
                  <div className="space-y-4">
                    {filteredItems.map((item, index) => (
                      <div key={`${item.type}-${index}`} className="relative pl-10">
                        {/* Timeline dot */}
                        <div className={`absolute left-2.5 top-3 w-3 h-3 rounded-full border-2 border-background ${
                          item.type === 'decision' ? 'bg-primary' :
                          item.type === 'event' ? 'bg-blue-500' :
                          'bg-green-500'
                        }`} />

                        {item.type === 'decision' && (
                          <DecisionCard 
                            decision={item.data as PolicyDecision} 
                            kpiChanges={data?.kpiChanges || []}
                            isExpanded={expandedItems.has((item.data as PolicyDecision).id)}
                            onToggle={() => toggleExpanded((item.data as PolicyDecision).id)}
                          />
                        )}

                        {item.type === 'event' && (
                          <EventCard 
                            event={item.data as TimelineEvent}
                            isExpanded={expandedItems.has((item.data as TimelineEvent).id)}
                            onToggle={() => toggleExpanded((item.data as TimelineEvent).id)}
                          />
                        )}

                        {item.type === 'kpi_change' && (
                          <KpiChangeCard change={item.data as KpiChangePoint} />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Inga händelser under vald period</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="decisions">
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-4">
                {data?.decisions.map(decision => (
                  <DecisionCard 
                    key={decision.id}
                    decision={decision}
                    kpiChanges={data.kpiChanges}
                    isExpanded={expandedItems.has(decision.id)}
                    onToggle={() => toggleExpanded(decision.id)}
                    showEffectiveness
                  />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="effects">
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-4">
                {data?.decisions.map(decision => {
                  const effectiveness = calculateEffectiveness(decision, data.kpiChanges);
                  return (
                    <Card key={decision.id} className="bg-muted/20">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium">{decision.title}</h4>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(decision.decision_date)}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className={`text-2xl font-bold ${
                              effectiveness.score >= 70 ? 'text-green-500' :
                              effectiveness.score >= 40 ? 'text-yellow-500' :
                              'text-muted-foreground'
                            }`}>
                              {effectiveness.score > 0 ? `${Math.round(effectiveness.score)}%` : '—'}
                            </div>
                            <p className="text-xs text-muted-foreground">Effektivitet</p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">{effectiveness.analysis}</p>
                        {decision.measured_effect && (
                          <p className="text-sm mt-2 p-2 bg-muted/30 rounded">
                            <span className="font-medium">Uppmätt effekt:</span> {decision.measured_effect}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

// Sub-components
function DecisionCard({ 
  decision, 
  kpiChanges,
  isExpanded, 
  onToggle,
  showEffectiveness = false
}: { 
  decision: PolicyDecision; 
  kpiChanges: KpiChangePoint[];
  isExpanded: boolean; 
  onToggle: () => void;
  showEffectiveness?: boolean;
}) {
  const effectiveness = showEffectiveness ? calculateEffectiveness(decision, kpiChanges) : null;

  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <Card className="bg-primary/5 border-primary/20">
        <CollapsibleTrigger asChild>
          <CardContent className="p-3 cursor-pointer hover:bg-primary/10 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="font-medium text-sm">{decision.title}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(decision.decision_date).toLocaleDateString('sv-SE')}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {decision.status}
                </Badge>
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
            </div>
          </CardContent>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0 pb-3 px-3 space-y-2">
            {decision.description && (
              <p className="text-sm text-muted-foreground">{decision.description}</p>
            )}
            {decision.expected_effect && (
              <div className="text-xs">
                <span className="font-medium">Förväntad effekt:</span> {decision.expected_effect}
              </div>
            )}
            {decision.target_kpis && decision.target_kpis.length > 0 && (
              <div className="flex flex-wrap gap-1">
                <span className="text-xs text-muted-foreground">Berörda KPI:er:</span>
                {decision.target_kpis.slice(0, 3).map((kpiId, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    <BarChart3 className="h-3 w-3 mr-1" />
                    KPI
                  </Badge>
                ))}
                {decision.target_kpis.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{decision.target_kpis.length - 3}
                  </Badge>
                )}
              </div>
            )}
            {effectiveness && effectiveness.score > 0 && (
              <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                {effectiveness.score >= 70 ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                )}
                <span className="text-xs">{effectiveness.analysis}</span>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

function EventCard({ 
  event, 
  isExpanded, 
  onToggle 
}: { 
  event: TimelineEvent; 
  isExpanded: boolean; 
  onToggle: () => void;
}) {
  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <Card className="bg-blue-500/5 border-blue-500/20">
        <CollapsibleTrigger asChild>
          <CardContent className="p-3 cursor-pointer hover:bg-blue-500/10 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <GitCommit className="h-4 w-4 text-blue-500" />
                  <span className="font-medium text-sm">{event.event_title}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(event.event_date).toLocaleDateString('sv-SE')}
                  {event.responsible_entity && ` • ${event.responsible_entity}`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {event.event_type && (
                  <Badge variant="outline" className="text-xs capitalize">
                    {event.event_type}
                  </Badge>
                )}
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
            </div>
          </CardContent>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0 pb-3 px-3 space-y-2">
            {event.event_description && (
              <p className="text-sm text-muted-foreground">{event.event_description}</p>
            )}
            {event.responsible_level && (
              <div className="text-xs">
                <span className="font-medium">Ansvarsnivå:</span>{' '}
                <Badge variant="secondary" className="text-xs capitalize">
                  {event.responsible_level}
                </Badge>
              </div>
            )}
            {event.source_url && (
              <a 
                href={event.source_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
              >
                <ExternalLink className="h-3 w-3" />
                Källa
              </a>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

function KpiChangeCard({ change }: { change: KpiChangePoint }) {
  return (
    <Card className="bg-muted/30">
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-green-500" />
            <div>
              <span className="text-sm font-medium">{change.kpi_name}</span>
              <p className="text-xs text-muted-foreground">
                {new Date(change.period_start).toLocaleDateString('sv-SE')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="flex items-center gap-1">
                {change.trend === 'up' ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : change.trend === 'down' ? (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                ) : (
                  <Minus className="h-4 w-4 text-yellow-500" />
                )}
                <span className={`font-mono text-sm font-medium ${
                  change.trend === 'up' ? 'text-green-500' :
                  change.trend === 'down' ? 'text-red-500' :
                  'text-yellow-500'
                }`}>
                  {change.trend_percent !== null ? (
                    `${change.trend_percent > 0 ? '+' : ''}${change.trend_percent.toFixed(1)}%`
                  ) : '—'}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {change.value.toLocaleString('sv-SE')}
              </span>
            </div>
            {change.status !== 'neutral' && (
              <Badge 
                variant="secondary" 
                className={`text-xs ${
                  change.status === 'positive' ? 'bg-green-500/20 text-green-400' :
                  change.status === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                  change.status === 'critical' ? 'bg-red-500/20 text-red-400' :
                  ''
                }`}
              >
                {change.status}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
