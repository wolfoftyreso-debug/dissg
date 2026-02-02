/**
 * BLOCK TI — INSIGHT LIBRARY
 * "Historik över frågor, hur förståelsen utvecklats"
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Library, TrendingUp, TrendingDown, Minus,
  Calendar, BarChart3, ChevronRight, RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { InsightLibrary, InsightHistoryEntry } from '@/config/personalInsightConfig';

interface InsightLibraryViewProps {
  library: InsightLibrary;
  onSelectInsight: (id: string) => void;
}

export function InsightLibraryView({ library, onSelectInsight }: InsightLibraryViewProps) {
  const { entries, learningProgress } = library;

  const TrendIcon = {
    improving: <TrendingUp className="h-4 w-4 text-success" />,
    stable: <Minus className="h-4 w-4 text-muted-foreground" />,
    declining: <TrendingDown className="h-4 w-4 text-destructive" />,
  }[learningProgress.improvementTrend];

  return (
    <div className="space-y-6">
      {/* Learning progress */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Min lärandeutveckling
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {learningProgress.totalInsights}
              </div>
              <div className="text-xs text-muted-foreground">Analyser</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {learningProgress.averageQuality}%
              </div>
              <div className="text-xs text-muted-foreground">Snittkvarlitet</div>
            </div>
            <div className="text-center flex flex-col items-center">
              {TrendIcon}
              <div className="text-xs text-muted-foreground mt-1">Trend</div>
            </div>
          </div>

          {/* Skills */}
          <div className="space-y-2">
            <div>
              <p className="text-xs font-medium mb-1">Starka områden:</p>
              <div className="flex flex-wrap gap-1">
                {learningProgress.skillsStrengthened.map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-medium mb-1">Att utveckla:</p>
              <div className="flex flex-wrap gap-1">
                {learningProgress.areasToImprove.map((area) => (
                  <Badge key={area} variant="outline" className="text-xs">
                    {area}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* History */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Library className="h-5 w-5 text-primary" />
            Mina tidigare analyser
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {entries.map((entry) => (
              <InsightHistoryCard 
                key={entry.id} 
                entry={entry}
                onClick={() => onSelectInsight(entry.id)}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function InsightHistoryCard({ 
  entry, 
  onClick 
}: { 
  entry: InsightHistoryEntry; 
  onClick: () => void;
}) {
  return (
    <div 
      className={cn(
        "p-3 rounded-lg border cursor-pointer transition-colors hover:bg-muted/50",
        entry.hasUpdatedData && "border-primary/50"
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium line-clamp-1">{entry.question}</p>
          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(entry.createdAt).toLocaleDateString('sv-SE')}
            </span>
            <span>
              {entry.stepsCompleted}/{entry.totalSteps} steg
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {entry.hasUpdatedData && (
            <Badge variant="outline" className="text-xs text-primary">
              <RefreshCw className="h-3 w-3 mr-1" />
              Ny data
            </Badge>
          )}
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium",
            entry.qualityScore >= 80 && "bg-success/20 text-success",
            entry.qualityScore >= 60 && entry.qualityScore < 80 && "bg-warning/20 text-warning",
            entry.qualityScore < 60 && "bg-destructive/20 text-destructive"
          )}>
            {entry.qualityScore}
          </div>
        </div>
      </div>
    </div>
  );
}
