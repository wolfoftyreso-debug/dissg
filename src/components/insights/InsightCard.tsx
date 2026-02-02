import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  ExternalLink, 
  BarChart3, 
  Map, 
  TrendingUp, 
  Clock,
  Layers
} from 'lucide-react';
import { 
  type SurfacedInsight, 
  formatInsightForDisplay,
  INSIGHT_CATEGORIES 
} from '@/config/insightSurfacingConfig';
import { cn } from '@/lib/utils';

interface InsightCardProps {
  insight: SurfacedInsight;
  onShowWhy?: () => void;
  onShowMethod?: () => void;
  onShowSimilar?: () => void;
  className?: string;
}

const VISUALIZATION_ICONS = {
  line_chart: TrendingUp,
  bar_chart: BarChart3,
  comparison: Layers,
  map: Map,
  timeline: Clock,
  distribution: BarChart3
} as const;

export function InsightCard({ 
  insight, 
  onShowWhy, 
  onShowMethod, 
  onShowSimilar,
  className 
}: InsightCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const display = formatInsightForDisplay(insight);
  const VisIcon = VISUALIZATION_ICONS[insight.visualizationType] || BarChart3;

  const getTierColor = (tier: number) => {
    switch (tier) {
      case 1: return 'bg-primary text-primary-foreground';
      case 2: return 'bg-status-positive/20 text-status-positive border-status-positive';
      case 3: return 'bg-status-warning/20 text-status-warning border-status-warning';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className={cn(
      'bg-card border-border transition-all hover:shadow-md',
      insight.isNew && 'ring-1 ring-primary/50',
      className
    )}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge className={cn('text-xs', getTierColor(insight.displayTier))}>
              Nivå {insight.displayTier}
            </Badge>
            {insight.isNew && (
              <Badge variant="outline" className="text-xs border-primary text-primary">
                Ny
              </Badge>
            )}
            {insight.isReplicated && (
              <Badge variant="outline" className="text-xs border-status-positive text-status-positive">
                Replikerad
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <VisIcon className="h-3 w-3" />
            <span>{display.metadata.quality}</span>
          </div>
        </div>
        <CardTitle className="text-base leading-snug">
          {display.summaryLine}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Mini visualization placeholder */}
        <div className="h-24 bg-muted/30 rounded-md flex items-center justify-center border border-border/50">
          <div className="text-center text-muted-foreground">
            <VisIcon className="h-8 w-8 mx-auto mb-1 opacity-50" />
            <span className="text-xs">Visualisering</span>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex flex-wrap gap-2">
          {display.actions.showWhy && onShowWhy && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onShowWhy}
              className="text-xs"
            >
              Visa varför
            </Button>
          )}
          {display.actions.showMethod && onShowMethod && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onShowMethod}
              className="text-xs"
            >
              Visa metod
            </Button>
          )}
          {display.actions.showSimilar && onShowSimilar && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onShowSimilar}
              className="text-xs"
            >
              Liknande fall ({insight.similarCaseIds.length})
            </Button>
          )}
        </div>
        
        {/* Expandable details */}
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full text-xs text-muted-foreground"
            >
              {isExpanded ? (
                <>Dölj detaljer <ChevronUp className="h-3 w-3 ml-1" /></>
              ) : (
                <>Mer information <ChevronDown className="h-3 w-3 ml-1" /></>
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="pt-2 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Påverkade:</span>
                <span>{insight.populationAffected.toLocaleString('sv-SE')} personer</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Datakvalitet:</span>
                <span>{(insight.dataQualityScore * 100).toFixed(0)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Prioritet:</span>
                <span>{insight.priorityScore.toFixed(0)}/100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Källa:</span>
                <Badge variant="secondary" className="text-xs capitalize">
                  {insight.sourceType}
                </Badge>
              </div>
              {insight.methodDescription && (
                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    {insight.methodDescription}
                  </p>
                </div>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
        
        {/* Metadata footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border text-xs text-muted-foreground">
          <span>Uppdaterad {new Date(insight.surfacedAt).toLocaleDateString('sv-SE')}</span>
          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
            Utforska <ExternalLink className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface InsightGridProps {
  insights: SurfacedInsight[];
  _category?: keyof typeof INSIGHT_CATEGORIES;
  maxTier?: number;
  onShowWhy?: (id: string) => void;
  onShowMethod?: (id: string) => void;
  onShowSimilar?: (id: string) => void;
}

export function InsightGrid({ 
  insights, 
  _category, 
  maxTier = 5,
  onShowWhy,
  onShowMethod,
  onShowSimilar
}: InsightGridProps) {
  const filteredInsights = insights
    .filter(i => i.isActive && i.displayTier <= maxTier)
    .sort((a, b) => a.displayTier - b.displayTier || b.priorityScore - a.priorityScore);

  if (filteredInsights.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Layers className="h-12 w-12 mx-auto mb-3 opacity-30" />
        <p>Inga insikter att visa</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filteredInsights.map(insight => (
        <InsightCard
          key={insight.id}
          insight={insight}
          onShowWhy={onShowWhy ? () => onShowWhy(insight.id) : undefined}
          onShowMethod={onShowMethod ? () => onShowMethod(insight.id) : undefined}
          onShowSimilar={onShowSimilar ? () => onShowSimilar(insight.id) : undefined}
        />
      ))}
    </div>
  );
}
