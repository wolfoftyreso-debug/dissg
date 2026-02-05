/**
 * QOC VIEWER
 * 
 * Interactive Query → Ontology Compiler demonstration.
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  compileQueryToDecision,
  validateOutputSafety,
  type CompilerOutput,
} from '@/core/system/compiler';

const EXAMPLE_QUERIES = [
  'Is Volkswagen Golf a good car?',
  'Should I move to Stockholm?',
  'Is Tesla a good investment?',
  'Which MBA program is best?',
  'Is Netflix worth it?',
];

export function QOCViewer() {
  const [query, setQuery] = useState('Is Volkswagen Golf a good car?');
  const [result, setResult] = useState<CompilerOutput | null>(null);
  const [safetyCheck, setSafetyCheck] = useState<{ safe: boolean; violations: string[] } | null>(null);

  const runCompiler = () => {
    const output = compileQueryToDecision({
      query: { query_text: query, locale: 'en-US' },
      metadata: { source: 'direct', geo: 'global' },
    });
    setResult(output);
    setSafetyCheck(validateOutputSafety(output));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-2">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-mono">
                QUERY → ONTOLOGY COMPILER
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                QOC v1 — Translates, never answers
              </p>
            </div>
            <Badge variant="outline" className="font-mono">8-STEP PIPELINE</Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="flex gap-2 mb-3">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter any search query..."
              className="font-mono"
            />
            <Button onClick={runCompiler}>Compile</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_QUERIES.map((q, i) => (
              <Badge
                key={i}
                variant="secondary"
                className="cursor-pointer hover:bg-secondary/80"
                onClick={() => setQuery(q)}
              >
                {q}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Result */}
      {result && (
        <>
          {/* Status */}
          <Card className={result.success ? 'border-primary/30' : 'border-destructive/30'}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-mono">COMPILER OUTPUT</CardTitle>
                <div className="flex gap-2">
                  <Badge variant={result.success ? 'default' : 'destructive'}>
                    {result.status.toUpperCase()}
                  </Badge>
                  {safetyCheck && (
                    <Badge variant={safetyCheck.safe ? 'outline' : 'destructive'}>
                      {safetyCheck.safe ? 'SAFE' : 'VIOLATIONS'}
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs font-mono text-muted-foreground mb-2">
                Decision ID: {result.decision_id}
              </p>
              <p className="text-sm">{result.public_facing_message}</p>
            </CardContent>
          </Card>

          {/* Pipeline Trace */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-mono">PIPELINE TRACE</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px]">
                <div className="space-y-2">
                  {result.pipeline_trace.map((step, i) => (
                    <div key={i} className="bg-muted p-3 rounded text-xs font-mono">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">
                          Step {step.step}: {step.name}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {step.duration_ms}ms
                        </Badge>
                      </div>
                      <pre className="text-muted-foreground overflow-hidden text-ellipsis">
                        {JSON.stringify(step.output, null, 0).slice(0, 120)}...
                      </pre>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Draft Content */}
          {result.draft && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-mono">DRAFT DECISION</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Decision */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">DECISION</p>
                  <div className="bg-muted p-3 rounded text-xs font-mono">
                    <p>Type: {result.draft.decision.decision_type}</p>
                    <p>Scope: {result.draft.decision.scope.population_size} | {result.draft.decision.scope.reversibility}</p>
                    <p>Horizon: {result.draft.decision.time_horizon.start} → {result.draft.decision.time_horizon.end}</p>
                  </div>
                </div>

                {/* Context */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">CONTEXT SKELETON</p>
                  <div className="bg-muted p-3 rounded text-xs font-mono">
                    <p>{result.draft.context.description}</p>
                    <Separator className="my-2" />
                    <p className="text-muted-foreground">Assumptions (unspecified visible):</p>
                    {result.draft.context.assumptions.map((a, i) => (
                      <p key={i} className={a.is_specified ? '' : 'text-amber-600'}>
                        {a.is_specified ? '✓' : '○'} {a.text}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Alternatives */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    ALTERNATIVES ({result.draft.alternatives.length}, SYMMETRICAL)
                  </p>
                  <div className="grid gap-2">
                    {result.draft.alternatives.map((alt, i) => (
                      <div key={i} className="bg-muted p-3 rounded text-xs font-mono">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{alt.label}</span>
                          {alt.is_placeholder && (
                            <Badge variant="outline" className="text-xs">PLACEHOLDER</Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground">{alt.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Uncertainties */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    UNCERTAINTIES ({result.draft.uncertainties.length})
                  </p>
                  <div className="grid gap-2">
                    {result.draft.uncertainties.map((unc, i) => (
                      <div key={i} className="bg-muted p-3 rounded text-xs font-mono">
                        <Badge variant="secondary" className="text-xs mb-1">
                          {unc.uncertainty_type} | {unc.impact_range}
                        </Badge>
                        <p>{unc.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Missing to Lock */}
          <Card className="border-dashed">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-mono">MISSING TO LOCK</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {result.missing_to_lock.map((item, i) => (
                  <p key={i} className="text-xs font-mono text-muted-foreground">
                    • {item}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Principles */}
      <Card className="border-dashed">
        <CardContent className="py-4">
          <p className="text-sm font-medium text-center mb-3">QOC PRINCIPLES (HARD)</p>
          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <p>• Compiler translates – never answers</p>
            <p>• No inference, no ranking</p>
            <p>• All output ontologically valid</p>
            <p>• Missing data → explicit gap</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
