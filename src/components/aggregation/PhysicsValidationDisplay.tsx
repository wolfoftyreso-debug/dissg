/**
 * Physics Validation Display
 * Visual representation of physics layer validation results
 */

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import type { PhysicsValidation, UncertaintyValue, ConservationCheck } from '@/lib/physics/physicsLayer';

interface PhysicsValidationDisplayProps {
  validation: PhysicsValidation;
  showDetails?: boolean;
  compact?: boolean;
}

export function PhysicsValidationDisplay({ 
  validation, 
  showDetails = false,
  compact = false 
}: PhysicsValidationDisplayProps) {
  const [isOpen, setIsOpen] = useState(showDetails);
  
  const recommendationStyles = {
    PROCEED: 'bg-status-positive/10 text-status-positive border-status-positive/30',
    CAUTION: 'bg-warning/10 text-warning border-warning/30',
    BLOCK: 'bg-destructive/10 text-destructive border-destructive/30'
  };
  
  const recommendationLabels = {
    PROCEED: '[OK] GODKÄND',
    CAUTION: '[!] VARNING',
    BLOCK: '[!!] BLOCKERAD'
  };

  if (compact) {
    return (
      <div className={cn(
        "inline-flex items-center gap-2 px-2 py-1 rounded border font-mono text-xs",
        recommendationStyles[validation.recommendation]
      )}>
        <span>{recommendationLabels[validation.recommendation]}</span>
        <span className="text-muted-foreground">|</span>
        <span>σ: ±{(validation.uncertainty.relativeUncertainty * 100).toFixed(1)}%</span>
        {validation.conservation && (
          <>
            <span className="text-muted-foreground">|</span>
            <span>Δ: {validation.conservation.imbalancePercent.toFixed(1)}%</span>
          </>
        )}
      </div>
    );
  }

  return (
    <Card className={cn(
      "border",
      recommendationStyles[validation.recommendation]
    )}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-mono flex items-center gap-2">
                [FYSIKLAGER]
                <Badge 
                  variant="outline" 
                  className={cn("font-mono text-xs", recommendationStyles[validation.recommendation])}
                >
                  {recommendationLabels[validation.recommendation]}
                </Badge>
              </CardTitle>
              <span className="text-xs font-mono text-muted-foreground">
                {isOpen ? '[−]' : '[+]'}
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-mono mt-1">
              {validation.summary}
            </p>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="pt-0 space-y-4">
            {/* Dimensional Analysis */}
            <DimensionalSection 
              isValid={validation.dimensional.isValid}
              errors={validation.dimensional.errors}
              warnings={validation.dimensional.warnings}
            />
            
            {/* Uncertainty */}
            <UncertaintySection uncertainty={validation.uncertainty} />
            
            {/* Conservation */}
            {validation.conservation && (
              <ConservationSection conservation={validation.conservation} />
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

function DimensionalSection({ 
  isValid, 
  errors, 
  warnings 
}: { 
  isValid: boolean; 
  errors: string[]; 
  warnings: string[] 
}) {
  return (
    <div className="rounded-lg border bg-card p-3">
      <div className="flex items-center gap-2 mb-2">
        <h4 className="text-xs font-mono text-muted-foreground">[DIMENSIONSANALYS]</h4>
        <Badge 
          variant="outline" 
          className={cn(
            "text-[10px] font-mono",
            isValid ? "text-status-positive" : "text-destructive"
          )}
        >
          {isValid ? '[OK]' : '[FEL]'}
        </Badge>
      </div>
      
      {errors.length > 0 && (
        <div className="space-y-1 mb-2">
          {errors.map((error, i) => (
            <p key={i} className="text-xs text-destructive font-mono">{error}</p>
          ))}
        </div>
      )}
      
      {warnings.length > 0 && (
        <div className="space-y-1">
          {warnings.map((warning, i) => (
            <p key={i} className="text-xs text-warning font-mono">{warning}</p>
          ))}
        </div>
      )}
      
      {errors.length === 0 && warnings.length === 0 && (
        <p className="text-xs text-muted-foreground">
          Alla dimensioner är konsistenta. Enheter matchar genom beräkningskedjan.
        </p>
      )}
    </div>
  );
}

function UncertaintySection({ uncertainty }: { uncertainty: UncertaintyValue }) {
  const level = uncertainty.relativeUncertainty < 0.05 ? 'low' :
                uncertainty.relativeUncertainty < 0.15 ? 'medium' : 'high';
  
  const levelStyles = {
    low: 'text-status-positive',
    medium: 'text-warning',
    high: 'text-destructive'
  };
  
  const levelLabels = {
    low: 'LÅG',
    medium: 'MÅTTLIG',
    high: 'HÖG'
  };
  
  return (
    <div className="rounded-lg border bg-card p-3">
      <div className="flex items-center gap-2 mb-2">
        <h4 className="text-xs font-mono text-muted-foreground">[FELFORTPLANTNING]</h4>
        <Badge 
          variant="outline" 
          className={cn("text-[10px] font-mono", levelStyles[level])}
        >
          [{levelLabels[level]}]
        </Badge>
      </div>
      
      <div className="grid grid-cols-3 gap-3 text-xs">
        <div>
          <p className="font-mono text-[10px] text-muted-foreground">[VÄRDE]</p>
          <p className="font-mono font-bold">{uncertainty.value.toFixed(4)}</p>
        </div>
        <div>
          <p className="font-mono text-[10px] text-muted-foreground">[ABSOLUT ±]</p>
          <p className="font-mono font-bold">±{uncertainty.uncertainty.toFixed(4)}</p>
        </div>
        <div>
          <p className="font-mono text-[10px] text-muted-foreground">[RELATIV %]</p>
          <p className={cn("font-mono font-bold", levelStyles[level])}>
            ±{(uncertainty.relativeUncertainty * 100).toFixed(1)}%
          </p>
        </div>
      </div>
      
      {/* Uncertainty visualization bar */}
      <div className="mt-3">
        <div className="h-6 bg-muted rounded-full relative overflow-hidden">
          {/* Central value */}
          <div 
            className="absolute top-0 bottom-0 w-0.5 bg-foreground z-10"
            style={{ left: '50%' }}
          />
          
          {/* Uncertainty range */}
          <div 
            className={cn(
              "absolute top-1 bottom-1 rounded-full opacity-50",
              level === 'low' ? 'bg-status-positive' :
              level === 'medium' ? 'bg-warning' : 'bg-destructive'
            )}
            style={{ 
              left: `${50 - Math.min(uncertainty.relativeUncertainty * 100, 45)}%`,
              right: `${50 - Math.min(uncertainty.relativeUncertainty * 100, 45)}%`
            }}
          />
          
          {/* Labels */}
          <div className="absolute inset-0 flex items-center justify-between px-2 text-[10px] font-mono">
            <span>-{(uncertainty.relativeUncertainty * 100).toFixed(0)}%</span>
            <span>+{(uncertainty.relativeUncertainty * 100).toFixed(0)}%</span>
          </div>
        </div>
      </div>
      
      {/* Sources */}
      {uncertainty.sources.length > 0 && (
        <div className="mt-2">
          <p className="font-mono text-[10px] text-muted-foreground">[KÄLLOR]</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {uncertainty.sources.map((source, i) => (
              <Badge key={i} variant="secondary" className="text-[10px] font-mono">
                {source}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ConservationSection({ conservation }: { conservation: ConservationCheck }) {
  return (
    <div className="rounded-lg border bg-card p-3">
      <div className="flex items-center gap-2 mb-2">
        <h4 className="text-xs font-mono text-muted-foreground">[BEVARANDELAG]</h4>
        <Badge 
          variant="outline" 
          className={cn(
            "text-[10px] font-mono",
            conservation.isBalanced ? "text-status-positive" : 
            conservation.withinTolerance ? "text-warning" : "text-destructive"
          )}
        >
          {conservation.isBalanced ? '[BALANSERAD]' : '[OBALANSERAD]'}
        </Badge>
      </div>
      
      <p className="text-xs font-mono mb-2">{conservation.explanation}</p>
      
      {/* Balance visualization */}
      <div className="flex items-center gap-2 mb-2">
        <div className="flex-1">
          <p className="text-[10px] font-mono text-muted-foreground">[IN]</p>
          <div className="h-3 bg-status-positive/30 rounded-full" />
        </div>
        <span className="font-mono text-lg">=</span>
        <div className="flex-1">
          <p className="text-[10px] font-mono text-muted-foreground">[UT + Δ]</p>
          <div 
            className="h-3 rounded-full"
            style={{
              background: `linear-gradient(to right, 
                hsl(var(--primary)/0.3) 0%, 
                hsl(var(--primary)/0.3) ${100 - conservation.imbalancePercent}%, 
                hsl(var(--destructive)/0.3) ${100 - conservation.imbalancePercent}%, 
                hsl(var(--destructive)/0.3) 100%)`
            }}
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4 text-xs font-mono">
        <span>Obalans: {conservation.imbalancePercent.toFixed(2)}%</span>
        <span className="text-muted-foreground">Tolerans: {conservation.tolerance}%</span>
      </div>
      
      {/* Anomalies */}
      {conservation.anomalies.length > 0 && (
        <div className="mt-2 space-y-1">
          {conservation.anomalies.map((anomaly, i) => (
            <p key={i} className="text-xs text-warning font-mono">{anomaly}</p>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Compact inline badge for showing physics status
 */
export function PhysicsStatusBadge({ 
  validation 
}: { 
  validation: PhysicsValidation 
}) {
  const styles = {
    PROCEED: 'bg-status-positive/20 text-status-positive',
    CAUTION: 'bg-warning/20 text-warning',
    BLOCK: 'bg-destructive/20 text-destructive'
  };
  
  return (
    <Badge variant="outline" className={cn("font-mono text-[10px]", styles[validation.recommendation])}>
      [σ±{(validation.uncertainty.relativeUncertainty * 100).toFixed(0)}%]
    </Badge>
  );
}
