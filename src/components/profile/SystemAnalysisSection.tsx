import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TrendingUp, TrendingDown, Minus, BarChart3, Info } from 'lucide-react';
import { LEGAL_DISCLAIMERS, LANGUAGE_TEMPLATES } from '@/config/publicProfileConfig';
import { OutcomeDistribution } from './OutcomeDistribution';

interface AggregatedOutcomes {
  improved: number;
  stagnant: number;
  declined: number;
}

interface SystemAnalysisSectionProps {
  outcomes: AggregatedOutcomes;
  totalMonths: number;
  className?: string;
}

export function SystemAnalysisSection({ 
  outcomes, 
  totalMonths,
  className = '' 
}: SystemAnalysisSectionProps) {
  const labels = LEGAL_DISCLAIMERS.systemAnalysis;
  const summaryLabels = LANGUAGE_TEMPLATES.responsibilitySummary;
  
  const getPercentages = () => {
    if (totalMonths === 0) return { improved: 0, stagnant: 0, declined: 0 };
    return {
      improved: (outcomes.improved / totalMonths) * 100,
      stagnant: (outcomes.stagnant / totalMonths) * 100,
      declined: (outcomes.declined / totalMonths) * 100,
    };
  };

  const percentages = getPercentages();

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Sektion-header med tydlig markering */}
      <Alert className="bg-muted/50 border-muted">
        <BarChart3 className="h-4 w-4" />
        <AlertDescription className="flex items-start justify-between">
          <div>
            <span className="font-semibold">{labels.title}</span>
            <p className="text-sm text-muted-foreground mt-1">{labels.text}</p>
          </div>
        </AlertDescription>
      </Alert>

      {/* Sammanfattning */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{summaryLabels.title}</CardTitle>
          <CardDescription>{summaryLabels.description}</CardDescription>
        </CardHeader>
        <CardContent>
          {totalMonths > 0 ? (
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-lg bg-primary/10">
                <TrendingUp className="h-5 w-5 mx-auto mb-1 text-primary" />
                <div className="text-2xl font-bold">{outcomes.improved}</div>
                <div className="text-xs text-muted-foreground">månader förbättring</div>
              </div>
              <div className="p-4 rounded-lg bg-muted">
                <Minus className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                <div className="text-2xl font-bold">{outcomes.stagnant}</div>
                <div className="text-xs text-muted-foreground">månader stagnation</div>
              </div>
              <div className="p-4 rounded-lg bg-destructive/10">
                <TrendingDown className="h-5 w-5 mx-auto mb-1 text-destructive" />
                <div className="text-2xl font-bold">{outcomes.declined}</div>
                <div className="text-xs text-muted-foreground">månader försämring</div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Info className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Ingen utfallsdata tillgänglig för denna profil.</p>
              <p className="text-sm mt-1">Data beräknas baserat på uppdrag och relevanta KPI:er.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Utfallsfördelning */}
      {totalMonths > 0 && (
        <OutcomeDistribution
          improved={percentages.improved}
          stagnant={percentages.stagnant}
          declined={percentages.declined}
          totalMonths={totalMonths}
        />
      )}
    </div>
  );
}
