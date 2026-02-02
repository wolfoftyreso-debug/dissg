/**
 * OBSERVATION CARD
 * 
 * Displays a single AI observation with all required context.
 * Every card is clickable down to raw data.
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ExternalLink, AlertTriangle, CheckCircle, XCircle, Minus } from 'lucide-react';
import type { ObservationCard as ObservationCardType, StabilityLevel } from '@/types/ai-observation';
import { useState } from 'react';

interface ObservationCardProps {
  observation: ObservationCardType;
  onViewRawData?: (sourceIds: string[]) => void;
}

function StabilityBadge({ level, score }: { level: StabilityLevel; score: number }) {
  const config: Record<StabilityLevel, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
    high: { variant: 'default', label: 'Stabil' },
    medium: { variant: 'secondary', label: 'Medel' },
    low: { variant: 'outline', label: 'Låg' },
    unstable: { variant: 'destructive', label: 'Instabil' }
  };
  
  const { variant, label } = config[level];
  
  return (
    <Badge variant={variant} className="text-xs">
      {label} ({Math.round(score * 100)}%)
    </Badge>
  );
}

function CorrelationDisplay({ value, interval }: { value?: number; interval?: [number, number] }) {
  if (value === undefined) return null;
  
  const strength = Math.abs(value);
  let strengthLabel = 'Svag';
  if (strength > 0.7) strengthLabel = 'Stark';
  else if (strength > 0.4) strengthLabel = 'Måttlig';
  
  return (
    <div className="text-sm">
      <span className="text-muted-foreground">Korrelation: </span>
      <span className="font-mono font-medium">{value.toFixed(3)}</span>
      {interval && (
        <span className="text-muted-foreground text-xs ml-1">
          [{interval[0].toFixed(2)}, {interval[1].toFixed(2)}]
        </span>
      )}
      <span className="text-muted-foreground text-xs ml-2">({strengthLabel})</span>
    </div>
  );
}

function PlaceboIndicator({ passed, correlation }: { passed: boolean; correlation: number }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      {passed ? (
        <>
          <CheckCircle className="h-3 w-3 text-primary" />
          <span className="text-muted-foreground">Placebo-test: Godkänt</span>
        </>
      ) : (
        <>
          <AlertTriangle className="h-3 w-3 text-destructive" />
          <span className="text-muted-foreground">
            Placebo-test: Liknande korrelationer hittades (r={correlation.toFixed(2)})
          </span>
        </>
      )}
    </div>
  );
}

export function ObservationCard({ observation, onViewRawData }: ObservationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const typeLabels: Record<string, string> = {
    deviation: 'Avvikelse',
    comovement: 'Samvariation',
    stability: 'Stabilitet',
    alternative: 'Alternativ'
  };
  
  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs font-normal">
                {typeLabels[observation.observation_type] || observation.observation_type}
              </Badge>
              <StabilityBadge 
                level={observation.strength.stability_level} 
                score={observation.strength.stability_score} 
              />
            </div>
            <CardTitle className="text-sm font-medium leading-snug">
              {observation.observation.what}
            </CardTitle>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mt-2">
          <span>När: {observation.observation.when}</span>
          <span>Var: {observation.observation.where}</span>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-4">
        {/* Strength section */}
        <div className="space-y-2">
          <CorrelationDisplay 
            value={observation.strength.correlation}
            interval={observation.strength.correlation_interval}
          />
        </div>
        
        {/* Context section */}
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <ChevronDown className={`h-3 w-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            Kontext & Begränsningar
          </CollapsibleTrigger>
          
          <CollapsibleContent className="mt-3 space-y-4">
            {/* What else moved */}
            {observation.context.also_moved.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Rörde sig också:</p>
                <div className="flex flex-wrap gap-1">
                  {observation.context.also_moved.map((v, i) => (
                    <Badge key={i} variant="secondary" className="text-xs font-normal">
                      {v.variable_name}
                      <span className="ml-1 opacity-70">
                        {v.direction === 'same' ? '↑' : '↓'} r={v.correlation.toFixed(2)}
                      </span>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {/* What didn't move */}
            {observation.context.did_not_move.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Rörde sig inte:</p>
                <div className="flex flex-wrap gap-1">
                  {observation.context.did_not_move.map((v, i) => (
                    <Badge key={i} variant="outline" className="text-xs font-normal opacity-70">
                      <Minus className="h-2 w-2 mr-1" />
                      {v.variable_name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {/* Placebo test */}
            <PlaceboIndicator 
              passed={observation.context.placebo_test_passed}
              correlation={observation.context.placebo_correlation}
            />
            
            {/* Limits */}
            <div className="space-y-1 pt-2 border-t border-border/50">
              <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <XCircle className="h-3 w-3" />
                Vad detta INTE visar:
              </p>
              <ul className="text-xs text-muted-foreground space-y-0.5 ml-4">
                {observation.limits.what_this_does_not_show.map((limit, i) => (
                  <li key={i} className="list-disc">{limit}</li>
                ))}
              </ul>
            </div>
            
            {/* Data reference */}
            <div className="pt-2 border-t border-border/50">
              <button
                onClick={() => onViewRawData?.(observation.data_reference.source_ids)}
                className="flex items-center gap-1 text-xs text-primary hover:underline"
              >
                <ExternalLink className="h-3 w-3" />
                Visa rådata
              </button>
              <p className="text-[10px] text-muted-foreground font-mono mt-1">
                Hash: {observation.data_reference.verification_hash.slice(0, 16)}...
              </p>
            </div>
          </CollapsibleContent>
        </Collapsible>
        
        {/* Mandatory disclaimer */}
        <div className="pt-2 border-t border-border/50">
          <p className="text-[10px] text-muted-foreground italic">
            Observerade mönster innebär inte kausalitet eller avsikt.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
