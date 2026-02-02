// Wrapped Step 4: Comparisons - "Hur stod det sig?"

import { Card, CardContent } from '@/components/ui/card';
import type { WrappedOutput, WrappedRanking } from '@/types/wrapped';
import { cn } from '@/lib/utils';

interface WrappedComparisonsProps {
  data: WrappedOutput['comparisons'];
}

function RankingCard({ ranking }: { ranking: WrappedRanking }) {
  const positionPercent = (ranking.rank / ranking.total) * 100;
  const isTopHalf = ranking.rank <= ranking.total / 2;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <p className="font-medium">{ranking.indicatorId.replace(/_/g, ' ')}</p>
            <p className="text-sm text-muted-foreground">
              {ranking.referenceGroupDescription}
            </p>
          </div>

          {/* Ranking visualization */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Bäst</span>
              <span className="text-muted-foreground">Sämst</span>
            </div>
            
            <div className="relative h-3 bg-muted rounded-full overflow-hidden">
              {/* Position marker */}
              <div 
                className={cn(
                  "absolute top-0 bottom-0 w-3 rounded-full border-2 border-background",
                  isTopHalf ? "bg-chart-2" : "bg-chart-4"
                )}
                style={{ 
                  left: `${positionPercent}%`,
                  transform: 'translateX(-50%)'
                }}
              />
            </div>
          </div>

          {/* Rank text - factual, not boastful */}
          <div className="text-center">
            <p className="text-2xl font-semibold tabular-nums">
              {ranking.rank} <span className="text-lg text-muted-foreground">av {ranking.total}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Percentil: {ranking.percentile}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function WrappedComparisons({ data }: WrappedComparisonsProps) {
  return (
    <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold">Hur stod det sig?</h2>
        <p className="text-muted-foreground">
          {data.comparisonText}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {data.rankings.map((ranking, index) => (
          <div
            key={ranking.indicatorId}
            className="animate-in fade-in-0 slide-in-from-bottom-2"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <RankingCard ranking={ranking} />
          </div>
        ))}
      </div>

      {/* Reference group explanation */}
      <Card className="bg-muted/50">
        <CardContent className="py-4">
          <p className="text-sm text-muted-foreground text-center">
            Jämförelser görs mot {data.rankings[0]?.referenceGroup || 'vald referensgrupp'}. 
            Ranking baseras på senast tillgängliga data.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
