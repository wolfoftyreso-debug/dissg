import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  HUMAN_INDICATORS, 
  getOrderedIndicators,
  type HumanBaseLayerIndicators,
  type LivingStandardsSnapshot 
} from '@/lib/living-standards';
import { Info, AlertTriangle, TrendingUp, Minus } from 'lucide-react';
import { DeepenButton } from '@/components/mobile';

interface HumanDashboardProps {
  snapshot: LivingStandardsSnapshot;
  onDeepen?: (indicatorId: keyof HumanBaseLayerIndicators) => void;
}

function IndicatorCard({ 
  indicatorId,
  value,
  onDeepen
}: {
  indicatorId: keyof HumanBaseLayerIndicators;
  value: number | null;
  onDeepen?: () => void;
}) {
  const meta = HUMAN_INDICATORS[indicatorId];
  
  // Calculate progress for visualization (0-100 scale)
  const normalizedValue = value !== null 
    ? ((value - meta.globalMin) / (meta.globalMax - meta.globalMin)) * 100
    : null;
  
  // Invert for indicators where lower is better
  const displayProgress = normalizedValue !== null
    ? (meta.higherIsBetter ? normalizedValue : 100 - normalizedValue)
    : 0;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{meta.name}</p>
            <p className="text-xs text-muted-foreground">{meta.description}</p>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="p-1 text-muted-foreground hover:text-foreground min-w-[44px] min-h-[44px] flex items-center justify-center">
                  <Info className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="left" className="max-w-[250px]">
                <p className="text-sm">{meta.description}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Globalt intervall: {meta.globalMin.toLocaleString('sv-SE')} – {meta.globalMax.toLocaleString('sv-SE')} {meta.unit}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        {value !== null ? (
          <div className="mt-3 space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-semibold tabular-nums">
                {value.toLocaleString('sv-SE', { maximumFractionDigits: 1 })}
              </span>
              <span className="text-sm text-muted-foreground">{meta.unit}</span>
            </div>
            <Progress 
              value={Math.max(0, Math.min(100, displayProgress))} 
              className="h-2"
            />
          </div>
        ) : (
          <div className="mt-3 flex items-center gap-2 text-muted-foreground">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm">Data saknas</span>
          </div>
        )}
        
        {onDeepen && (
          <div className="mt-3">
            <DeepenButton 
              onClick={onDeepen}
              variant="ghost"
              fullWidth
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function HumanDashboard({ snapshot, onDeepen }: HumanDashboardProps) {
  const orderedIndicators = getOrderedIndicators();
  
  return (
    <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold">
            {snapshot.countryName}, {snapshot.year}
          </h2>
          <Badge variant="outline" className="text-xs">
            {snapshot.coverage.percentage}% datatäckning
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Mänsklig levnadsstandard i {snapshot.coverage.indicatorsAvailable} av {snapshot.coverage.indicatorsTotal} indikatorer
        </p>
      </div>

      {/* Data quality warning if needed */}
      {snapshot.uncertainty.level !== 'low' && (
        <Card className="bg-warning/10 border-warning/20">
          <CardContent className="py-3 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium">
                {snapshot.uncertainty.level === 'very_high' ? 'Mycket hög' : 
                 snapshot.uncertainty.level === 'high' ? 'Hög' : 'Måttlig'} osäkerhet
              </p>
              <p className="text-muted-foreground text-xs mt-1">
                {snapshot.uncertainty.sources.join('. ')}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Indicator grid - single column on mobile */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {orderedIndicators.map(indicatorId => (
          <IndicatorCard
            key={indicatorId}
            indicatorId={indicatorId}
            value={snapshot.indicators[indicatorId]}
            onDeepen={onDeepen ? () => onDeepen(indicatorId) : undefined}
          />
        ))}
      </div>

      {/* What this shows / doesn't show */}
      <Card className="bg-muted/30">
        <CardContent className="py-4 space-y-3">
          <div>
            <p className="text-xs font-medium text-chart-2 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Detta visar:
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Genomsnittliga levnadsvillkor för en person i {snapshot.countryName} år {snapshot.year}, baserat på officiella statistikkällor.
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-destructive flex items-center gap-1">
              <Minus className="w-3 h-3" /> Detta visar INTE:
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Fördelning inom landet, regionala skillnader, eller individuella livsöden. Siffror är nationella genomsnitt.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Sources */}
      <details className="text-xs">
        <summary className="cursor-pointer text-muted-foreground hover:text-foreground py-2">
          Visa {snapshot.sources.length} datakällor
        </summary>
        <div className="mt-2 space-y-1 pl-4 border-l-2 border-muted">
          {snapshot.sources.map((source, i) => (
            <p key={i} className="text-muted-foreground">
              {HUMAN_INDICATORS[source.indicatorId as keyof HumanBaseLayerIndicators]?.nameShort || source.indicatorId}: {source.sourceName} ({source.collectionYear})
            </p>
          ))}
        </div>
      </details>
    </div>
  );
}
