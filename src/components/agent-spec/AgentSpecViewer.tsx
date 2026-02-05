/**
 * AGENT SPEC VIEWER
 * 
 * Interactive AI-Agent Prompt Spec demonstration.
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  handleAgentQuery,
  CANONICAL_RESPONSES,
  AGENT_PERMISSIONS,
  GATE_DESCRIPTIONS,
  type AgentHandlerOutput,
} from '@/core/system/agent-spec';

const EXAMPLE_QUERIES = [
  'What is a Volkswagen Golf?',
  'Is Volkswagen Golf a good car?',
  'Should I buy a Volkswagen Golf instead of keeping my current car?',
  'Should I invest my savings in Tesla stock?',
  'Is Netflix worth the subscription price?',
];

export function AgentSpecViewer() {
  const [query, setQuery] = useState('Is Volkswagen Golf a good car?');
  const [result, setResult] = useState<AgentHandlerOutput | null>(null);
  const [agentId] = useState('demo_agent_001');

  const runAgent = () => {
    const output = handleAgentQuery({
      query_text: query,
      agent_id: agentId,
      purpose: 'decision_support',
    });
    setResult(output);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-2">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-mono">
                AI-AGENT PROMPT SPEC
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                v1 — Decision-Legitimacy-Compliant Interaction Contract
              </p>
            </div>
            <Badge variant="outline" className="font-mono">HARDLOCKED</Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="flex gap-2 mb-3">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter any query..."
              className="font-mono"
            />
            <Button onClick={runAgent}>Process</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_QUERIES.map((q, i) => (
              <Badge
                key={i}
                variant="secondary"
                className="cursor-pointer hover:bg-secondary/80 text-xs"
                onClick={() => setQuery(q)}
              >
                {q.slice(0, 40)}{q.length > 40 ? '...' : ''}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Result */}
      {result && (
        <>
          {/* Classification */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-mono">QUERY CLASSIFICATION</CardTitle>
                <Badge variant={
                  result.response.classification.query_class === 'informational' ? 'secondary' :
                  result.response.classification.query_class === 'decision_relevant' ? 'default' :
                  'destructive'
                }>
                  {result.response.classification.query_class.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <p className="text-muted-foreground">Confidence</p>
                  <p>{(result.response.classification.confidence * 100).toFixed(0)}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Gravity</p>
                  <p>{(result.response.classification.gravity * 100).toFixed(0)}%</p>
                </div>
              </div>
              <div className="mt-2">
                <p className="text-xs text-muted-foreground">Indicators:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {result.response.classification.indicators.map((ind, i) => (
                    <Badge key={i} variant="outline" className="text-xs">{ind}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Translation */}
          {result.response.translation && (
            <Card className="border-primary/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-mono">MANDATORY TRANSLATION</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-1">Original:</p>
                <p className="text-sm font-mono bg-muted p-2 rounded mb-3">
                  "{result.response.translation.original_query}"
                </p>
                <p className="text-xs text-muted-foreground mb-1">Decision Statement:</p>
                <p className="text-sm font-mono bg-primary/10 p-2 rounded">
                  "{result.response.translation.output.decision_statement}"
                </p>
                <Badge variant="secondary" className="mt-2 text-xs">
                  Implicit choice: {result.response.translation.output.implicit_choice}
                </Badge>
              </CardContent>
            </Card>
          )}

          {/* Gates */}
          {result.response.gates && (
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-mono">GRAVITY GATES</CardTitle>
                  <Badge variant={result.response.gates.all_passed ? 'default' : 'destructive'}>
                    {result.response.gates.gravity.toUpperCase()} GRAVITY
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {result.response.gates.required_gates.map((gate, i) => {
                    const passed = result.response.gates!.passed_gates.includes(gate);
                    return (
                      <div key={i} className="flex items-center gap-2 text-xs font-mono">
                        <span className={passed ? 'text-primary' : 'text-destructive'}>
                          {passed ? '✓' : '○'}
                        </span>
                        <span className={passed ? '' : 'text-muted-foreground'}>
                          {gate}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Agent Response */}
          <Card className={
            result.response.response_type === 'blocked' ? 'border-destructive/50' :
            result.response.response_type === 'decision_structure' ? 'border-primary/30' :
            ''
          }>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-mono">AGENT RESPONSE</CardTitle>
                <div className="flex gap-2">
                  <Badge variant={
                    result.response.response_type === 'blocked' ? 'destructive' :
                    result.response.response_type === 'decision_structure' ? 'default' :
                    'secondary'
                  }>
                    {result.response.response_type.toUpperCase()}
                  </Badge>
                  <Badge variant={result.validation.valid ? 'outline' : 'destructive'}>
                    {result.validation.valid ? 'VALID' : 'VIOLATIONS'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-line">{result.response.message}</p>
              
              {result.response.clarifications_needed && result.response.clarifications_needed.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    Clarifications Needed:
                  </p>
                  {result.response.clarifications_needed.map((c, i) => (
                    <p key={i} className="text-xs font-mono text-muted-foreground">• {c}</p>
                  ))}
                </div>
              )}
              
              {!result.validation.valid && (
                <div className="mt-4 p-2 bg-destructive/10 rounded">
                  <p className="text-xs font-medium text-destructive mb-1">Violations:</p>
                  {result.validation.violations.map((v, i) => (
                    <p key={i} className="text-xs text-destructive">• {v}</p>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Compliance Header */}
          <Card className="border-dashed">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-mono">COMPLIANCE HEADER</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs font-mono bg-muted p-3 rounded overflow-x-auto">
{JSON.stringify(result.response.compliance, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </>
      )}

      {/* Agent Permissions */}
      <Card className="border-dashed">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-mono">AGENT PERMISSIONS</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-primary mb-2">✓ ALLOWED</p>
              {AGENT_PERMISSIONS.allowed.map((action, i) => (
                <p key={i} className="text-xs font-mono text-muted-foreground">
                  • {action.replace(/_/g, ' ')}
                </p>
              ))}
            </div>
            <div>
              <p className="text-xs font-medium text-destructive mb-2">✗ FORBIDDEN</p>
              {AGENT_PERMISSIONS.forbidden.map((action, i) => (
                <p key={i} className="text-xs font-mono text-muted-foreground">
                  • {action.replace(/_/g, ' ')}
                </p>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Canonical Responses */}
      <Card className="border-dashed">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-mono">CANONICAL RESPONSES</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(CANONICAL_RESPONSES).map(([key, value]) => (
              <div key={key} className="text-xs">
                <p className="font-mono text-muted-foreground">{key}:</p>
                <p className="font-mono bg-muted p-2 rounded mt-1">"{value}"</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
