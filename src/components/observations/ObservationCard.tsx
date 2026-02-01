import { AlertCircle, TrendingDown, TrendingUp, Activity, GitBranch, Clock, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Observation, ObservationType } from '@/types/observation';
import { cn } from '@/lib/utils';

interface ObservationCardProps {
  observation: Observation;
  onShowAnalysis: (observationId: string) => void;
}

const OBSERVATION_TYPE_CONFIG: Record<ObservationType, {
  icon: React.ElementType;
  label: string;
  color: string;
}> = {
  trend_deviation: {
    icon: TrendingDown,
    label: 'Trendavvikelse',
    color: 'text-status-warning',
  },
  threshold_breach: {
    icon: AlertCircle,
    label: 'Tröskelvärde passerat',
    color: 'text-status-critical',
  },
  correlation_detected: {
    icon: GitBranch,
    label: 'Korrelation upptäckt',
    color: 'text-status-info',
  },
  pattern_match: {
    icon: Activity,
    label: 'Mönstermatchning',
    color: 'text-status-warning',
  },
  lag_signal: {
    icon: Clock,
    label: 'Tidsfördröjd signal',
    color: 'text-status-warning',
  },
  anomaly: {
    icon: TrendingUp,
    label: 'Statistisk anomali',
    color: 'text-status-critical',
  },
};

export function ObservationCard({ observation, onShowAnalysis }: ObservationCardProps) {
  const config = OBSERVATION_TYPE_CONFIG[observation.observation_type];
  const Icon = config.icon;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('sv-SE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getSignalStrengthLabel = (strength: number) => {
    if (strength >= 80) return 'Mycket stark';
    if (strength >= 60) return 'Stark';
    if (strength >= 40) return 'Måttlig';
    if (strength >= 20) return 'Svag';
    return 'Mycket svag';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 90) return 'Hög';
    if (confidence >= 70) return 'God';
    if (confidence >= 50) return 'Måttlig';
    return 'Låg';
  };

  return (
    <Card className="border-l-4 border-l-accent hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn("p-2 rounded-lg bg-muted", config.color)}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                Iakttagelse på {observation.kpi_name || 'KPI'}
              </h3>
              <Badge variant="outline" className="mt-1">
                {config.label}
              </Badge>
            </div>
          </div>
          
          <div className="text-right text-sm text-muted-foreground">
            <div>{formatDate(observation.detected_at)}</div>
            <div className="text-xs">
              Period: {formatDate(observation.observation_period_start)} – {formatDate(observation.observation_period_end)}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Beskrivning - alltid observationsspråk */}
        <p className="text-foreground leading-relaxed">
          "{observation.description}"
        </p>
        
        {/* Signalstyrka & Säkerhet */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground uppercase tracking-wide">
              Signalstyrka
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-accent transition-all"
                  style={{ width: `${observation.signal_strength}%` }}
                />
              </div>
              <span className="text-sm font-medium">
                {getSignalStrengthLabel(observation.signal_strength)}
              </span>
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground uppercase tracking-wide">
              Säkerhet i slutsats
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all"
                  style={{ width: `${observation.confidence_level}%` }}
                />
              </div>
              <span className="text-sm font-medium">
                {getConfidenceLabel(observation.confidence_level)} ({observation.confidence_level}%)
              </span>
            </div>
          </div>
        </div>
        
        {/* CTA - Visa analys */}
        <Button 
          variant="outline" 
          className="w-full justify-between group"
          onClick={() => onShowAnalysis(observation.id)}
        >
          <span>Visa analys</span>
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
        
        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
          <span>Analysversion: {observation.analysis_version}</span>
          <span>Modell: {observation.model_version}</span>
        </div>
      </CardContent>
    </Card>
  );
}
