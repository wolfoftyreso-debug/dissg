import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, ArrowRight, CheckCircle, AlertCircle, HelpCircle } from 'lucide-react';
import { 
  type CausalChain, 
  buildCausalTimeline, 
  calculateChainUncertainty,
  getStrengthIndicator,
  generateWhyExplanation 
} from '@/config/whyEngineConfig';
import { cn } from '@/lib/utils';

interface WhyEngineViewerProps {
  chain: CausalChain;
  showAlternatives?: boolean;
  className?: string;
}

export function WhyEngineViewer({ chain, showAlternatives = true, className }: WhyEngineViewerProps) {
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set());
  const [showFullExplanation, setShowFullExplanation] = useState(false);
  
  const _timeline = buildCausalTimeline(chain);
  const uncertainty = calculateChainUncertainty(chain);
  
  const toggleStep = (index: number) => {
    const newSet = new Set(expandedSteps);
    if (newSet.has(index)) {
      newSet.delete(index);
    } else {
      newSet.add(index);
    }
    setExpandedSteps(newSet);
  };

  return (
    <Card className={cn('bg-card border-border', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{chain.outcomeDescription}</CardTitle>
          <Badge 
            variant="outline" 
            className={cn(
              'text-xs',
              uncertainty > 0.5 ? 'border-status-critical text-status-critical' :
              uncertainty > 0.3 ? 'border-status-warning text-status-warning' :
              'border-status-positive text-status-positive'
            )}
          >
            {(chain.chainConfidence * 100).toFixed(0)}% konfidens
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Kedjelängd: {chain.totalChainDurationMonths} månader
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Timeline visualization */}
        <div className="relative pl-6 space-y-4">
          <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-border" />
          
          {chain.steps.map((step, index) => {
            const strength = getStrengthIndicator(step.strength);
            const isFirst = index === 0;
            
            return (
              <Collapsible 
                key={step.id} 
                open={expandedSteps.has(index)}
                onOpenChange={() => toggleStep(index)}
              >
                <div className="relative">
                  <div 
                    className={cn(
                      'absolute -left-4 w-4 h-4 rounded-full border-2 bg-background',
                      isFirst ? 'border-primary' : 'border-muted-foreground'
                    )} 
                  />
                  
                  <CollapsibleTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-between p-3 h-auto text-left hover:bg-muted/50"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{step.name}</span>
                          {isFirst && (
                            <Badge variant="secondary" className="text-xs">Första rörelse</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <span>
                            {step.movementDirection === 'up' ? '+' : step.movementDirection === 'down' ? '-' : '±'}
                            {Math.abs(step.movementMagnitude).toFixed(1)}%
                          </span>
                          <span>•</span>
                          <span>{step.movedAt}</span>
                          {step.lagMonths > 0 && (
                            <>
                              <span>•</span>
                              <span>{step.lagMonths} mån fördröjning</span>
                            </>
                          )}
                        </div>
                      </div>
                      {expandedSteps.has(index) ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <div className="pl-3 pr-3 pb-3 space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Styrka:</span>
                        <Badge variant="outline" className={cn('text-xs', `text-${strength.color}`)}>
                          {strength.label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Osäkerhet:</span>
                        <span>{(step.uncertainty * 100).toFixed(0)}%</span>
                      </div>
                      {step.kpiId && (
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Kopplad KPI:</span>
                          <span className="font-mono text-xs">{step.kpiId}</span>
                        </div>
                      )}
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            );
          })}
          
          {/* Outcome */}
          <div className="relative">
            <div className="absolute -left-4 w-4 h-4 rounded-full border-2 border-primary bg-primary" />
            <div className="p-3 bg-muted/30 rounded-md">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-status-positive" />
                <span className="font-medium">Utfall observerat</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {chain.outcomeObservedDate}
              </p>
            </div>
          </div>
        </div>
        
        {/* Uncertainty factors */}
        {chain.uncertaintyFactors.length > 0 && (
          <div className="bg-status-warning/10 border border-status-warning/30 rounded-md p-3">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-4 w-4 text-status-warning" />
              <span className="font-medium text-sm">Osäkerhetsfaktorer</span>
            </div>
            <ul className="text-sm text-muted-foreground space-y-1">
              {chain.uncertaintyFactors.map((factor, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-muted-foreground">•</span>
                  {factor}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Alternative explanations */}
        {showAlternatives && chain.alternativeExplanations.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <HelpCircle className="h-4 w-4" />
              Alternativa förklaringar
            </div>
            {chain.alternativeExplanations
              .filter(alt => alt.plausibility > 0.1)
              .map((alt, i) => (
                <div 
                  key={i} 
                  className="border border-border rounded-md p-3 text-sm"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{alt.description}</span>
                    <Badge variant="outline" className="text-xs">
                      {(alt.plausibility * 100).toFixed(0)}% plausibel
                    </Badge>
                  </div>
                  {alt.evidenceFor.length > 0 && (
                    <p className="text-muted-foreground text-xs">
                      Stöd: {alt.evidenceFor.join(', ')}
                    </p>
                  )}
                </div>
              ))}
          </div>
        )}
        
        {/* Full explanation toggle */}
        <Collapsible open={showFullExplanation} onOpenChange={setShowFullExplanation}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" size="sm" className="w-full">
              {showFullExplanation ? 'Dölj' : 'Visa'} fullständig förklaring
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="mt-3 p-3 bg-muted/30 rounded-md text-sm whitespace-pre-wrap font-mono">
              {generateWhyExplanation(chain)}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
