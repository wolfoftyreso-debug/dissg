/**
 * REFERENCE CASE VIEWER
 * 
 * Display the Volkswagen Golf reference case execution.
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  VOLKSWAGEN_GOLF_CASE,
  executeVolkswagenGolfCase,
  type ExecutionResult,
} from '@/core/reference-cases/volkswagen-golf';

export function ReferenceCaseViewer() {
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const runCase = async () => {
    setIsRunning(true);
    try {
      const execution = await executeVolkswagenGolfCase();
      setResult(execution);
    } catch (error) {
      console.error('Execution failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-2">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-mono">
                REFERENCE CASE #1
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Consumer Vehicle Evaluation — Volkswagen Golf
              </p>
            </div>
            <Badge variant="outline" className="font-mono">
              CANONICAL
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <p className="text-sm">
            Shows everyday decision without simplification. System gives NO recommendations.
          </p>
          <Button 
            onClick={runCase} 
            disabled={isRunning}
            className="mt-4"
          >
            {isRunning ? 'Executing...' : 'Execute Full Case'}
          </Button>
        </CardContent>
      </Card>

      {/* Static Case Data */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-mono">CASE DATA</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Decision */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">DECISION</p>
            <div className="bg-muted p-3 rounded text-xs font-mono">
              <p>Type: {VOLKSWAGEN_GOLF_CASE.decision.decision_type}</p>
              <p>Scope: {VOLKSWAGEN_GOLF_CASE.decision.scope.population_size} | {VOLKSWAGEN_GOLF_CASE.decision.scope.reversibility}</p>
              <p>Horizon: {VOLKSWAGEN_GOLF_CASE.decision.time_horizon.start} → {VOLKSWAGEN_GOLF_CASE.decision.time_horizon.end}</p>
            </div>
          </div>

          {/* Context */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">CONTEXT</p>
            <div className="bg-muted p-3 rounded text-xs font-mono">
              <p>{VOLKSWAGEN_GOLF_CASE.context.description}</p>
              <p className="mt-1 text-muted-foreground">
                Assumptions: {VOLKSWAGEN_GOLF_CASE.context.assumptions.length}
              </p>
            </div>
          </div>

          {/* Alternatives */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">
              ALTERNATIVES ({VOLKSWAGEN_GOLF_CASE.alternatives.length}, SYMMETRICAL)
            </p>
            <div className="grid gap-2">
              {VOLKSWAGEN_GOLF_CASE.alternatives.map((alt, i) => (
                <div key={i} className="bg-muted p-3 rounded text-xs font-mono">
                  <p className="font-medium">{alt.label}</p>
                  <p className="text-muted-foreground">{alt.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Uncertainties */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">
              UNCERTAINTIES ({VOLKSWAGEN_GOLF_CASE.uncertainties.length}, EXPLICIT)
            </p>
            <div className="grid gap-2">
              {VOLKSWAGEN_GOLF_CASE.uncertainties.map((unc, i) => (
                <div key={i} className="bg-muted p-3 rounded text-xs font-mono">
                  <Badge variant="secondary" className="text-xs mb-1">
                    {unc.uncertainty_type}
                  </Badge>
                  <p>{unc.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Legitimacy */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">LEGITIMACY</p>
            <div className="bg-muted p-3 rounded text-xs font-mono">
              <div className="flex items-center gap-2 mb-2">
                <span>Status:</span>
                <Badge variant={VOLKSWAGEN_GOLF_CASE.legitimacy.legitimate ? 'default' : 'destructive'}>
                  {VOLKSWAGEN_GOLF_CASE.legitimacy.legitimate ? 'LEGITIMATE' : 'ILLEGITIMATE'}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-1">
                {Object.entries(VOLKSWAGEN_GOLF_CASE.legitimacy.checks).map(([key, value]) => (
                  <p key={key}>
                    {value ? '✓' : '✗'} {key.replace(/_/g, ' ')}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Public View */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">PUBLIC VIEW</p>
            <div className="bg-muted p-3 rounded text-xs font-mono">
              <p className="font-medium">{VOLKSWAGEN_GOLF_CASE.public_view.title}</p>
              <p>Scope: {VOLKSWAGEN_GOLF_CASE.public_view.scope}</p>
              <p>Alternatives: {VOLKSWAGEN_GOLF_CASE.public_view.alternatives_count}</p>
              <p>Uncertainties: {VOLKSWAGEN_GOLF_CASE.public_view.uncertainties_count}</p>
              <p>Legibility Score: {VOLKSWAGEN_GOLF_CASE.public_view.legibility_score}</p>
              <Separator className="my-2" />
              <p className="text-muted-foreground">{VOLKSWAGEN_GOLF_CASE.public_view.note}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Execution Result */}
      {result && (
        <Card className="border-primary/30">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-mono">EXECUTION RESULT</CardTitle>
              <div className="flex gap-2">
                <Badge variant={result.success ? 'default' : 'destructive'}>
                  {result.success ? 'SUCCESS' : 'FAILED'}
                </Badge>
                <Badge variant="outline">
                  {result.execution_time_ms}ms
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-3">
              Total events emitted: <span className="font-mono font-bold">{result.total_events}</span>
            </p>
            <ScrollArea className="h-[300px]">
              <div className="space-y-2">
                {result.steps.map((step, i) => (
                  <div key={i} className="bg-muted p-3 rounded text-xs font-mono">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{step.step}</span>
                      <Badge variant="outline" className="text-xs">
                        {step.method} {step.endpoint}
                      </Badge>
                    </div>
                    {step.events_emitted.length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {step.events_emitted.map((evt, j) => (
                          <Badge key={j} variant="secondary" className="text-xs">
                            {evt}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            {result.final_projection && (
              <div className="mt-4">
                <p className="text-xs font-medium text-muted-foreground mb-2">FINAL PROJECTION</p>
                <div className="bg-muted p-3 rounded text-xs font-mono">
                  <p>Status: {result.final_projection.status}</p>
                  <p>Legitimacy: {result.final_projection.legitimacy_status}</p>
                  <p>Alternatives: {result.final_projection.alternatives.length}</p>
                  <p>Uncertainties: {result.final_projection.uncertainties.length}</p>
                  <p>Locked at: {result.final_projection.locked_at}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Critical Note */}
      <Card className="border-dashed">
        <CardContent className="py-4 text-center">
          <p className="text-sm font-medium mb-2">Why This Case Is Critical</p>
          <div className="text-xs text-muted-foreground space-y-1">
            <p>• Shows everyday decision without simplification</p>
            <p>• Shows that the system gives NO recommendations</p>
            <p>• Shows how uncertainty is documented</p>
            <p>• Shows how learning happens without rewriting</p>
          </div>
          <Separator className="my-3" />
          <p className="font-mono text-sm">
            "Is X good?" → "Under which assumptions is X rational?"
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
