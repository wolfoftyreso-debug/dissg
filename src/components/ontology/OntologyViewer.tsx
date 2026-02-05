/**
 * ONTOLOGY VIEWER
 * 
 * Display the 7 canonical root objects and their rules.
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { FORBIDDEN_CONCEPTS, FORBIDDEN_RATIONALE } from '@/core/ontology';

const ROOT_OBJECTS = [
  {
    name: 'Decision',
    fields: ['decision_id', 'decision_type', 'gravity_score', 'scope', 'time_horizon', 'alternatives[]', 'uncertainties[]', 'legitimacy_status'],
    rules: [
      'alternatives.length >= 2',
      'uncertainties.length >= 1',
      'locked_at → immutable',
      'legitimacy = structure only',
    ],
  },
  {
    name: 'Context',
    fields: ['context_id', 'description', 'affected_population', 'geographic_scope', 'assumptions[]'],
    rules: [
      'Never edited after locked_at',
      'Assumptions ≠ conclusions',
    ],
  },
  {
    name: 'Alternative',
    fields: ['alternative_id', 'label', 'description', 'trade_offs[]', 'required_assumptions[]'],
    rules: [
      'All treated symmetrically',
      'No "default" option',
      'Never ranked',
    ],
  },
  {
    name: 'Uncertainty',
    fields: ['uncertainty_id', 'description', 'uncertainty_type', 'impact_range'],
    rules: [
      'Never reduced to risk score',
      'Empty = illegitimate',
    ],
    critical: true,
  },
  {
    name: 'Evidence',
    fields: ['evidence_id', 'source_type', 'reference', 'validity_period'],
    rules: [
      'Supports, never decides',
      'History preserved',
    ],
  },
  {
    name: 'Outcome',
    fields: ['outcome_id', 'decision_id', 'observed_effects', 'deviation_from_expectation'],
    rules: [
      'Never affects legitimacy',
      'Cannot change Context/Decision',
    ],
  },
  {
    name: 'Review',
    fields: ['review_id', 'decision_id', 'expected_vs_observed', 'learnings[]', 'foreseeable_deviation'],
    rules: [
      'Additive, never corrective',
      'No backward writing',
    ],
  },
];

export function OntologyViewer() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-2">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-mono">
                ONTOLOGY v1.0
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Decision Legitimacy Core — 7 Canonical Objects
              </p>
            </div>
            <Badge variant="outline" className="font-mono">
              IMMUTABLE
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Root Objects */}
      <div className="grid md:grid-cols-2 gap-4">
        {ROOT_OBJECTS.map((obj) => (
          <Card 
            key={obj.name}
            className={obj.critical ? 'border-destructive/50' : ''}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-mono">
                  {obj.name}
                </CardTitle>
                {obj.critical && (
                  <Badge variant="destructive" className="text-xs">
                    CRITICAL
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Fields */}
              <div className="flex flex-wrap gap-1">
                {obj.fields.map((field) => (
                  <Badge 
                    key={field} 
                    variant="secondary" 
                    className="text-xs font-mono"
                  >
                    {field}
                  </Badge>
                ))}
              </div>
              
              <Separator />
              
              {/* Rules */}
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">RULES:</p>
                {obj.rules.map((rule, i) => (
                  <p key={i} className="text-xs font-mono">
                    • {rule}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Legitimacy Engine */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-mono">
            LEGITIMACY ENGINE
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 font-mono text-sm">
            <p>context_present: boolean</p>
            <p>alternatives_exposed: boolean (&gt;= 2)</p>
            <p>uncertainties_acknowledged: boolean (&gt;= 1)</p>
            <p>scope_defined: boolean</p>
            <p>time_defined: boolean</p>
          </div>
          <Separator className="my-3" />
          <p className="font-mono font-bold text-center">
            legitimate = all(true)
          </p>
          <p className="text-xs text-muted-foreground text-center mt-1">
            No other logic allowed.
          </p>
        </CardContent>
      </Card>

      {/* Forbidden Concepts */}
      <Card className="border-destructive/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-mono text-destructive">
            FORBIDDEN CONCEPTS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {FORBIDDEN_CONCEPTS.map((concept) => (
              <div key={concept} className="flex items-start gap-2">
                <span className="text-destructive font-bold">✗</span>
                <div>
                  <p className="font-mono text-sm">{concept}</p>
                  <p className="text-xs text-muted-foreground">
                    {FORBIDDEN_RATIONALE[concept]}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-center mt-4 font-medium">
            If any appear → SYSTEM VIOLATION
          </p>
        </CardContent>
      </Card>

      {/* Footer */}
      <Card className="border-dashed">
        <CardContent className="py-4 text-center">
          <p className="text-sm font-medium mb-2">Why This Ontology Is Strong</p>
          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <p>Cannot be "UX'd away"</p>
            <p>Cannot be marketed into destruction</p>
            <p>Cannot be AI-optimized wrong</p>
            <p>Can be read in 40 years</p>
          </div>
          <p className="font-medium mt-3">
            This is epistemic concrete.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
