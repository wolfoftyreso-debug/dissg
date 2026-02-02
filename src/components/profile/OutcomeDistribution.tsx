import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { LANGUAGE_TEMPLATES } from '@/config/publicProfileConfig';
import { LegalDisclaimer } from './LegalDisclaimer';

interface OutcomeDistributionProps {
  improved: number; // percentage
  stagnant: number;
  declined: number;
  totalMonths?: number;
  className?: string;
}

export function OutcomeDistribution({
  improved,
  stagnant,
  declined,
  totalMonths,
  className = '',
}: OutcomeDistributionProps) {
  const labels = LANGUAGE_TEMPLATES.outcomeDistribution;
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">{labels.title}</CardTitle>
        {totalMonths && (
          <CardDescription>
            Baserat på {totalMonths} månader med uppmätt data
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Improved */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              {labels.improved}
            </span>
            <span className="font-mono">{improved.toFixed(1)}%</span>
          </div>
          <Progress value={improved} className="h-2" />
        </div>

        {/* Stagnant */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <Minus className="h-4 w-4 text-muted-foreground" />
              {labels.stagnant}
            </span>
            <span className="font-mono">{stagnant.toFixed(1)}%</span>
          </div>
          <Progress value={stagnant} className="h-2 [&>div]:bg-muted-foreground" />
        </div>

        {/* Declined */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-destructive" />
              {labels.declined}
            </span>
            <span className="font-mono">{declined.toFixed(1)}%</span>
          </div>
          <Progress value={declined} className="h-2 [&>div]:bg-destructive" />
        </div>

        <LegalDisclaimer variant="compact" className="mt-4" />
      </CardContent>
    </Card>
  );
}
