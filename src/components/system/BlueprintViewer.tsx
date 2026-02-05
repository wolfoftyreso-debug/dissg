/**
 * BLUEPRINT VIEWER
 * 
 * Display the Implementation Blueprint architecture.
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const PRINCIPLES = [
  { rule: 'Event-sourcing before CRUD', desc: 'History is sacred' },
  { rule: 'Append-only before update', desc: 'No rewrites' },
  { rule: 'Validation before UX', desc: 'Truth over convenience' },
  { rule: 'Structure before speed', desc: 'Correctness over performance' },
  { rule: 'Refuse > guess', desc: 'Silence over speculation' },
];

const EVENTS = [
  'DecisionCreated',
  'ContextAttached',
  'AlternativeAdded',
  'UncertaintyAdded',
  'EvidenceLinked',
  'DecisionLocked',
  'ReviewRecorded',
];

const AI_RULES = {
  allowed: [
    'Read projections',
    'Suggest questions',
    'Flag missing blocks',
  ],
  forbidden: [
    'Write events',
    'Suggest decisions',
    'Rank alternatives',
  ],
};

const FAILURE_MODES = [
  { condition: 'System doesn\'t know', response: '"Cannot be answered reliably yet"' },
  { condition: 'Data is missing', response: 'Block locking' },
  { condition: 'Load is high', response: 'System becomes slower, NOT dumber' },
];

export function BlueprintViewer() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-2">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-mono">
                IMPLEMENTATION BLUEPRINT v1
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Decision Legitimacy System — Production-grade
              </p>
            </div>
            <Badge variant="outline" className="font-mono">
              EVENT-SOURCED
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Governing Principles */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-mono">
            GOVERNING PRINCIPLES
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {PRINCIPLES.map((p, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="font-mono text-sm">{p.rule}</span>
                <span className="text-xs text-muted-foreground">{p.desc}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-center mt-4 font-medium">
            If anyone proposes otherwise → they're building the wrong system.
          </p>
        </CardContent>
      </Card>

      {/* Architecture Diagram */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-mono">
            SYSTEM ARCHITECTURE
          </CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs font-mono bg-muted p-4 rounded overflow-x-auto">
{`┌────────────┐
│   Clients  │  (Web, API, AI-agents)
└─────┬──────┘
      ↓
┌───────────────┐
│ API Gateway   │  (Auth, rate limit, versioning)
└─────┬─────────┘
      ↓
┌─────────────────────────────┐
│ Decision Core (Write Model) │
│ - Command handlers          │
│ - Validation                │
│ - Legitimacy Engine         │
└─────┬───────────────────────┘
      ↓
┌─────────────────────────────┐
│ Event Store (Append-only)   │  ← TRUTH
└─────┬───────────────────────┘
      ↓
┌─────────────────────────────┐
│ Read Models / Projections   │
└─────────────────────────────┘`}
          </pre>
          <p className="text-xs text-center mt-3 text-muted-foreground">
            Everything can be replaced — EXCEPT event store + ontology.
          </p>
        </CardContent>
      </Card>

      {/* Events */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-mono">
            DOMAIN EVENTS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {EVENTS.map((evt) => (
              <Badge key={evt} variant="secondary" className="font-mono text-xs">
                {evt}
              </Badge>
            ))}
          </div>
          <Separator className="my-3" />
          <p className="text-sm font-bold text-center">
            No event may ever be deleted. Ever.
          </p>
        </CardContent>
      </Card>

      {/* Command Flow */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-mono">
            COMMAND → EVENT FLOW
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-1 font-mono text-sm">
            <span>POST /decisions/{'{id}'}/lock</span>
            <span className="text-muted-foreground">↓</span>
            <span>ValidateCommand</span>
            <span className="text-muted-foreground">↓</span>
            <span>LegitimacyEngine.check()</span>
            <span className="text-muted-foreground">↓</span>
            <span className="text-primary">DecisionLockedEvent</span>
            <span className="text-muted-foreground">↓</span>
            <span>Persist event</span>
          </div>
          <p className="text-xs text-center mt-3 text-muted-foreground">
            If validation fails → NO EVENT is created.
          </p>
        </CardContent>
      </Card>

      {/* Immutability */}
      <Card className="border-blue-500/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-mono">
            IMMUTABILITY GUARANTEES
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm mb-3">When DecisionLockedEvent exists:</p>
          <div className="grid grid-cols-2 gap-2">
            {['Context', 'Alternatives', 'Uncertainties', 'Evidence'].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm">
                <span className="text-primary">❄️</span>
                <span>{item} → FROZEN</span>
              </div>
            ))}
          </div>
          <Separator className="my-3" />
          <p className="text-sm text-center">
            Attempt to modify → <code className="text-xs">409 Conflict</code>
          </p>
        </CardContent>
      </Card>

      {/* AI Integration */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-mono">
            AI INTEGRATION (SAFE)
          </CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">AI MAY:</p>
            {AI_RULES.allowed.map((rule, i) => (
              <p key={i} className="text-sm flex items-center gap-2">
                <span className="text-primary">✓</span> {rule}
              </p>
            ))}
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">AI MAY NEVER:</p>
            {AI_RULES.forbidden.map((rule, i) => (
              <p key={i} className="text-sm flex items-center gap-2">
                <span className="text-destructive">✗</span> {rule}
              </p>
            ))}
          </div>
        </CardContent>
        <CardContent className="pt-0">
          <p className="text-sm font-bold text-center">
            AI = assistive lens, NEVER actor.
          </p>
        </CardContent>
      </Card>

      {/* Failure Modes */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-mono">
            FAILURE MODES
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {FAILURE_MODES.map((fm, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{fm.condition}</span>
                <span className="font-mono text-xs">{fm.response}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <Card className="border-dashed">
        <CardContent className="py-4 text-center">
          <p className="text-sm font-medium mb-2">Why This Is Production-Ready</p>
          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <p>Scale infra without scaling risk</p>
            <p>Change UI without changing truth</p>
            <p>Swap AI without swapping principle</p>
            <p>Die as company without system dying</p>
          </div>
          <p className="font-medium mt-3">
            This is the right way to build something permanent.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
