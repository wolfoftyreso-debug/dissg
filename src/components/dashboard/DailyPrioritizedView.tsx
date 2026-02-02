// Daglig "editorless" startsida - auto-prioritering baserat på relevans
// Visar vad som är mest relevant idag

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  TrendingUp, TrendingDown, Minus, ChevronRight, 
  Sparkles, Clock, AlertTriangle, ArrowRight 
} from 'lucide-react';
import { useRelevanceRanking, useWhatsNewToday } from '@/hooks/useRelevanceRanking';
import { formatResponsibilityText } from '@/config/responsibilityMatrixConfig';
import type { KPI } from '@/types/kpi';
import { cn } from '@/lib/utils';

interface DailyPrioritizedViewProps {
  kpis: KPI[];
  onKPISelect: (kpi: KPI) => void;
}

function RelevanceScoreBadge({ score }: { score: number }) {
  const color = score >= 75 ? 'destructive' : score >= 50 ? 'default' : 'secondary';
  
  return (
    <Badge variant={color} className="text-xs">
      Relevans: {score.toFixed(0)}
    </Badge>
  );
}

function HighlightCard({ 
  kpi, 
  reason,
  relevanceScore,
  onClick 
}: { 
  kpi: KPI; 
  reason: string;
  relevanceScore: number;
  onClick: () => void;
}) {
  const TrendIcon = kpi.trend === 'up' ? TrendingUp : kpi.trend === 'down' ? TrendingDown : Minus;
  const trendPercent = kpi.trendPercent ?? 0;

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all hover:shadow-md",
        kpi.status === 'critical' && "border-status-critical/50",
        kpi.status === 'warning' && "border-status-warning/50"
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <div className={cn(
                "w-2 h-2 rounded-full shrink-0",
                kpi.status === 'positive' && "bg-status-positive",
                kpi.status === 'warning' && "bg-status-warning",
                kpi.status === 'critical' && "bg-status-critical",
                kpi.status === 'neutral' && "bg-muted-foreground"
              )} />
              <h3 className="font-medium text-sm truncate">{kpi.name}</h3>
            </div>
            
            <p className="text-xs text-muted-foreground mb-2">
              {reason}
            </p>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">
                {kpi.value.toFixed(1)} {kpi.unit}
              </span>
              <span className="flex items-center gap-1">
                <TrendIcon className={cn(
                  "h-3 w-3",
                  kpi.trend === 'up' && !kpi.inverted && "text-status-positive",
                  kpi.trend === 'down' && kpi.inverted && "text-status-positive",
                  kpi.trend === 'up' && kpi.inverted && "text-status-critical",
                  kpi.trend === 'down' && !kpi.inverted && "text-status-critical",
                  kpi.trend === 'stable' && "text-muted-foreground"
                )} />
                {trendPercent !== 0 ? `${trendPercent > 0 ? '+' : ''}${trendPercent.toFixed(1)}%` : 'Stabil'}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <RelevanceScoreBadge score={relevanceScore} />
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function DailyPrioritizedView({ kpis, onKPISelect }: DailyPrioritizedViewProps) {
  const { rankedKPIs, highlights, todaysSummary, lastCalculated } = useRelevanceRanking({
    kpis,
    maxHighlights: 5,
  });

  const { newItems, summary: whatsnewSummary } = useWhatsNewToday(kpis);

  const criticalCount = kpis.filter(k => k.status === 'critical').length;
  const warningCount = kpis.filter(k => k.status === 'warning').length;

  return (
    <div className="space-y-6">
      {/* Dagens datum och uppdatering */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Idag</h2>
          <p className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString('sv-SE', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        <div className="text-right text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Uppdaterad: {lastCalculated.toLocaleTimeString('sv-SE', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
          <p>Automatisk prioritering</p>
        </div>
      </div>

      {/* Vad är nytt idag? */}
      {newItems.length > 0 && (
        <Alert className="bg-chart-1/5 border-chart-1/30">
          <Sparkles className="h-4 w-4 text-chart-1" />
          <AlertDescription>
            <span className="font-medium">Vad är nytt idag?</span> {whatsnewSummary}
          </AlertDescription>
        </Alert>
      )}

      {/* Systemstatus */}
      <Card className={cn(
        "border-2",
        criticalCount > 0 && "border-status-critical/50 bg-status-critical/5",
        criticalCount === 0 && warningCount > 0 && "border-status-warning/50 bg-status-warning/5",
        criticalCount === 0 && warningCount === 0 && "border-status-positive/50 bg-status-positive/5"
      )}>
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">
                {criticalCount > 0 
                  ? `${criticalCount} kritiska indikatorer`
                  : warningCount > 0
                    ? `${warningCount} varningar`
                    : 'Alla system stabila'
                }
              </p>
              <p className="text-sm text-muted-foreground">
                {todaysSummary}
              </p>
            </div>
            {criticalCount > 0 && (
              <AlertTriangle className="h-6 w-6 text-status-critical" />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dagens prioriteringar */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Mest relevant just nu</h3>
          <Badge variant="outline" className="text-xs">
            Sorterat efter relevans
          </Badge>
        </div>

        <div className="space-y-3">
          {highlights.map((item) => (
            <HighlightCard
              key={item.id}
              kpi={item}
              reason={item.relevance.reason}
              relevanceScore={item.relevance.totalScore}
              onClick={() => onKPISelect(item)}
            />
          ))}
        </div>

        {highlights.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Inga indikatorer kräver särskild uppmärksamhet idag.
            </CardContent>
          </Card>
        )}
      </div>

      {/* Alla indikatorer (rankade) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Alla indikatorer</h3>
          <p className="text-xs text-muted-foreground">
            {rankedKPIs.length} totalt
          </p>
        </div>

        <div className="space-y-2">
          {rankedKPIs.slice(5).map((item) => (
            <Card 
              key={item.id}
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => onKPISelect(item)}
            >
              <CardContent className="py-3 px-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-5">
                      #{item.relevance.rank}
                    </span>
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      item.status === 'positive' && "bg-status-positive",
                      item.status === 'warning' && "bg-status-warning",
                      item.status === 'critical' && "bg-status-critical",
                      item.status === 'neutral' && "bg-muted-foreground"
                    )} />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {item.value.toFixed(1)} {item.unit}
                    </span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Metodtransparens */}
      <Card className="bg-muted/30">
        <CardContent className="py-4">
          <p className="text-xs text-muted-foreground text-center">
            Prioritering baseras på: Impact (30%), Acceleration (20%), Bredd (15%), 
            Persistens (15%), Ansvar (10%). Osäker data ger avdrag.
            <br />
            Ingen redaktör väljer – algoritmen prioriterar baserat på data.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
