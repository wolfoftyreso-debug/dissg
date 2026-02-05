/**
 * API SPEC VIEWER
 * 
 * Display the API-SPEC v1.0 contract.
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { API_ROUTES, FORBIDDEN_ENDPOINTS, API_VERSION } from '@/core/api';

const DESIGN_PRINCIPLES = [
  'API does NOT accept incomplete decisions',
  'API does NO inference',
  'API returns NO recommendations',
  'API is append-only',
  'API can refuse response rather than simplify',
];

const ENDPOINTS = [
  { method: 'POST', path: '/v1/decisions', desc: 'Create draft decision' },
  { method: 'GET', path: '/v1/decisions/{id}', desc: 'Get decision state' },
  { method: 'POST', path: '/v1/decisions/{id}/lock', desc: 'Attempt lock' },
  { method: 'GET', path: '/v1/decisions/{id}/legitimacy', desc: 'Get legitimacy check' },
  { method: 'POST', path: '/v1/contexts', desc: 'Create context' },
  { method: 'POST', path: '/v1/alternatives', desc: 'Create alternative' },
  { method: 'POST', path: '/v1/uncertainties', desc: 'Create uncertainty' },
  { method: 'POST', path: '/v1/evidence', desc: 'Create evidence' },
  { method: 'POST', path: '/v1/reviews', desc: 'Create review (post-decision)' },
];

const PUBLIC_ENDPOINTS = [
  { method: 'GET', path: '/v1/public/decisions/{id}', desc: 'Read-only, after lock' },
  { method: 'GET', path: '/v1/public/decisions/{id}/context', desc: 'Read-only' },
  { method: 'GET', path: '/v1/public/decisions/{id}/review', desc: 'Read-only' },
];

export function ApiSpecViewer() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-2">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-mono">
                API-SPEC {API_VERSION}.0
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Decision Legitimacy Core — Read / Write / Lock / Verify
              </p>
            </div>
            <Badge variant="outline" className="font-mono">
              REST + JSON
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Design Principles */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-mono">
            DESIGN PRINCIPLES (ABSOLUTE)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {DESIGN_PRINCIPLES.map((principle, i) => (
              <li key={i} className="text-sm flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>{principle}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Core Endpoints */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-mono">
            CORE ENDPOINTS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {ENDPOINTS.map((ep, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <Badge 
                  variant={ep.method === 'GET' ? 'secondary' : 'default'}
                  className="font-mono w-14 justify-center"
                >
                  {ep.method}
                </Badge>
                <code className="flex-1 text-xs bg-muted px-2 py-1 rounded">
                  {ep.path}
                </code>
                <span className="text-xs text-muted-foreground">
                  {ep.desc}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Public Endpoints */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-mono">
            PUBLIC (READ-ONLY, AFTER LOCK)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground mb-3">
            No auth. No filtering. No summarization.
          </p>
          <div className="space-y-2">
            {PUBLIC_ENDPOINTS.map((ep, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <Badge variant="secondary" className="font-mono w-14 justify-center">
                  {ep.method}
                </Badge>
                <code className="flex-1 text-xs bg-muted px-2 py-1 rounded">
                  {ep.path}
                </code>
                <span className="text-xs text-muted-foreground">
                  {ep.desc}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Lock Behavior */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-mono">
            LOCK BEHAVIOR
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground mb-2">SUCCESS:</p>
            <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
{`{ "status": "locked", "locked_at": "timestamp" }`}
            </pre>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">FAIL:</p>
            <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
{`{ "status": "rejected", "missing": ["alternatives < 2", ...] }`}
            </pre>
          </div>
          <p className="text-sm font-bold text-center">
            NO OVERRIDE. EVER.
          </p>
        </CardContent>
      </Card>

      {/* Forbidden Endpoints */}
      <Card className="border-destructive/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-mono text-destructive">
            FORBIDDEN ENDPOINTS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {FORBIDDEN_ENDPOINTS.map((ep) => (
              <Badge key={ep} variant="destructive" className="font-mono">
                ❌ {ep}
              </Badge>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3 text-center">
            If anyone proposes these → they have not understood the system.
          </p>
        </CardContent>
      </Card>

      {/* Failure Mode */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-mono">
            FAILURE MODE (422)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1 text-sm">
            <li>• API responds <code className="text-xs">422 Unprocessable Decision</code></li>
            <li>• With exactly what's missing</li>
            <li>• <strong>NEVER</strong> with fallback text</li>
            <li>• <strong>NEVER</strong> with "best guess"</li>
          </ul>
        </CardContent>
      </Card>

      {/* Footer */}
      <Card className="border-dashed">
        <CardContent className="py-4 text-center">
          <p className="text-sm font-medium mb-2">Why This API Is Hard To Abuse</p>
          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <p>It requires reality</p>
            <p>It allows no shortcuts</p>
            <p>It rewards structure</p>
            <p>It punishes sloppiness</p>
          </div>
          <p className="font-medium mt-3">
            This is responsibility in machine form.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
