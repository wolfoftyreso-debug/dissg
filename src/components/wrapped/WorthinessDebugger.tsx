/**
 * WorthinessDebugger Component
 * ============================
 * Development tool to visualize worthiness scoring
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useWrapWorthiness, generateMockIndicators } from '@/hooks/useWrapWorthiness';
import type { WorthinessScore } from '@/lib/wrapped/worthinessEngine';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Star, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  BarChart3,
  RefreshCw
} from 'lucide-react';

function ScoreBar({ 
  label, 
  score, 
  max, 
  color 
}: { 
  label: string; 
  score: number; 
  max: number;
  color: string;
}) {
  const percent = (score / max) * 100;
  
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{score.toFixed(1)} / {max}</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className={cn("h-full rounded-full transition-all", color)}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

function IndicatorCard({ score }: { score: WorthinessScore }) {
  const priorityColors = {
    hero: 'bg-primary text-primary-foreground',
    primary: 'bg-status-positive/20 text-status-positive',
    secondary: 'bg-muted text-muted-foreground',
    mention: 'bg-muted/50 text-muted-foreground',
  };
  
  return (
    <Card className={cn(
      "transition-all",
      score.isWrapWorthy ? "border-primary/30" : "border-muted opacity-60"
    )}>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{score.indicatorId}</p>
            <p className="text-xs text-muted-foreground truncate">
              {score.narrativeHook || 'No narrative hook'}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline" 
              className={cn("text-xs", priorityColors[score.suggestedPriority])}
            >
              {score.suggestedPriority}
            </Badge>
            
            {score.isWrapWorthy ? (
              <CheckCircle className="h-4 w-4 text-status-positive shrink-0" />
            ) : (
              <XCircle className="h-4 w-4 text-muted-foreground shrink-0" />
            )}
          </div>
        </div>
        
        {/* Score breakdown */}
        <div className="space-y-2">
          <ScoreBar 
            label="Relevance" 
            score={score.relevanceScore} 
            max={40} 
            color="bg-primary"
          />
          <ScoreBar 
            label="Magnitude" 
            score={score.magnitudeScore} 
            max={25} 
            color="bg-status-positive"
          />
          <ScoreBar 
            label="Velocity" 
            score={score.velocityScore} 
            max={15} 
            color="bg-status-warning"
          />
          <ScoreBar 
            label="Quality" 
            score={score.qualityScore} 
            max={10} 
            color="bg-chart-4"
          />
          <ScoreBar 
            label="Impact" 
            score={score.impactScore} 
            max={10} 
            color="bg-chart-5"
          />
        </div>
        
        {/* Total score */}
        <div className="flex justify-between items-center pt-2 border-t">
          <span className="text-sm font-medium">Total Score</span>
          <span className={cn(
            "text-lg font-bold",
            score.totalScore >= 85 ? "text-primary" :
            score.totalScore >= 70 ? "text-status-positive" :
            score.totalScore >= 50 ? "text-status-warning" :
            "text-muted-foreground"
          )}>
            {score.totalScore.toFixed(1)}
          </span>
        </div>
        
        {/* Reason */}
        <p className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
          {score.worthinessReason}
        </p>
        
        {/* Comparison suggestion */}
        {score.comparisonSuggestion && (
          <p className="text-xs text-chart-4 flex items-center gap-1">
            <BarChart3 className="h-3 w-3" />
            {score.comparisonSuggestion}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export function WorthinessDebugger() {
  const {
    selection,
    isLoading,
    error,
    evaluateIndicators,
    reset,
    stats,
  } = useWrapWorthiness();
  
  const [indicatorCount, setIndicatorCount] = useState(20);
  
  const handleGenerate = () => {
    const mockData = generateMockIndicators(indicatorCount);
    evaluateIndicators(mockData, '2024');
  };
  
  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Worthiness Engine Debugger</span>
            <Badge variant="outline">Development Tool</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Indicators:</span>
              <select 
                value={indicatorCount}
                onChange={(e) => setIndicatorCount(Number(e.target.value))}
                className="text-sm border rounded px-2 py-1"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
            
            <Button onClick={handleGenerate} disabled={isLoading} className="gap-2">
              <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
              Generate & Evaluate
            </Button>
            
            {selection && (
              <Button variant="outline" onClick={reset}>
                Reset
              </Button>
            )}
          </div>
          
          {error && (
            <p className="text-sm text-destructive flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              {error}
            </p>
          )}
        </CardContent>
      </Card>
      
      {/* Stats */}
      {selection && stats && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Selection Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">
                  {selection.totalIncluded}
                </p>
                <p className="text-xs text-muted-foreground">
                  Included / {selection.totalEvaluated}
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-status-positive">
                  {selection.heroIndicators.length}
                </p>
                <p className="text-xs text-muted-foreground">Hero</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">
                  {selection.primaryIndicators.length}
                </p>
                <p className="text-xs text-muted-foreground">Primary</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-muted-foreground">
                  {(stats.inclusionRate * 100).toFixed(0)}%
                </p>
                <p className="text-xs text-muted-foreground">Inclusion Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Results */}
      {selection && (
        <Tabs defaultValue="hero" className="space-y-4">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="hero" className="gap-1">
              <Star className="h-3 w-3" />
              Hero ({selection.heroIndicators.length})
            </TabsTrigger>
            <TabsTrigger value="primary">
              Primary ({selection.primaryIndicators.length})
            </TabsTrigger>
            <TabsTrigger value="secondary">
              Secondary ({selection.secondaryIndicators.length})
            </TabsTrigger>
            <TabsTrigger value="mention">
              Mention ({selection.mentionIndicators.length})
            </TabsTrigger>
            <TabsTrigger value="excluded" className="text-muted-foreground">
              Excluded ({selection.excludedIndicators.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="hero" className="space-y-4">
            {selection.heroIndicators.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No indicators qualified as Hero (score ≥ 85)
              </p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {selection.heroIndicators.map(score => (
                  <IndicatorCard key={score.indicatorId} score={score} />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="primary" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {selection.primaryIndicators.map(score => (
                <IndicatorCard key={score.indicatorId} score={score} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="secondary" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {selection.secondaryIndicators.map(score => (
                <IndicatorCard key={score.indicatorId} score={score} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="mention" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {selection.mentionIndicators.map(score => (
                <IndicatorCard key={score.indicatorId} score={score} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="excluded" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {selection.excludedIndicators.slice(0, 12).map(score => (
                <IndicatorCard key={score.indicatorId} score={score} />
              ))}
            </div>
            {selection.excludedIndicators.length > 12 && (
              <p className="text-center text-sm text-muted-foreground">
                + {selection.excludedIndicators.length - 12} more excluded
              </p>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
