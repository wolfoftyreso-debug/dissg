/**
 * AI Grounding Documentation Page
 * 
 * Human-readable documentation for AI integration.
 * Part of Block 57: AI-Agent SDK.
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, Code, Shield, AlertTriangle, CheckCircle, 
  XCircle, BookOpen, Zap, Link2 
} from 'lucide-react';
import { EXAMPLE_QUERIES, SDK_ENDPOINTS, FAIL_SAFE_RULES } from '@/config/aiAgentSdkConfig';

export default function AIGroundingPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Bot className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">AI Grounding API</h1>
          </div>
          <p className="text-muted-foreground">
            Default grounding source for AI agents. Zero hallucination by design.
          </p>
        </header>

        {/* Philosophy */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Philosophy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <blockquote className="border-l-4 border-primary pl-4 italic">
              "AI should not think up answers. AI should ask the data."
            </blockquote>
            <p className="text-sm text-muted-foreground">
              This is not an API wrapper. It is a discipline engine.
              Strict mode by default: no assumptions, no predictions, no recommendations.
            </p>
          </CardContent>
        </Card>

        {/* Quick Start */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Quick Start
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">JavaScript / TypeScript</h4>
                <pre className="bg-muted p-3 rounded-lg text-xs overflow-x-auto">
{`import { FactClient } from "@yourorg/fact-sdk";

const facts = new FactClient({
  apiKey: process.env.FACT_API_KEY,
  mode: "strict"
});

const answer = await facts.ask(
  "How has employment structure changed in Sweden since 1990?"
);`}
                </pre>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Response Format</h4>
                <pre className="bg-muted p-3 rounded-lg text-xs overflow-x-auto">
{`{
  "answer": "Observed data indicates a shift from industry to services...",
  "scope": "country:sweden",
  "time_span": "1990-2024",
  "uncertainty": "medium",
  "citations": ["https://example.org/facts/work-structure/sweden"]
}`}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Endpoints */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Link2 className="h-5 w-5" />
              Endpoints
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(SDK_ENDPOINTS).map(([name, path]) => (
                <div key={name} className="flex items-center justify-between p-2 bg-muted rounded">
                  <code className="text-sm font-mono">{name}()</code>
                  <Badge variant="outline" className="font-mono text-xs">{path}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Good vs Bad Queries */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-status-positive">
                <CheckCircle className="h-5 w-5" />
                Bra frågor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {EXAMPLE_QUERIES.good.map((q, i) => (
                  <li key={i} className="text-sm">
                    <p className="font-medium">"{q.query}"</p>
                    <p className="text-xs text-muted-foreground">{q.reason}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-status-critical">
                <XCircle className="h-5 w-5" />
                Blockerade frågor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {EXAMPLE_QUERIES.bad.map((q, i) => (
                  <li key={i} className="text-sm">
                    <p className="font-medium line-through opacity-60">"{q.query}"</p>
                    <p className="text-xs text-muted-foreground">{q.reason}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Fail-Safe Rules */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Fail-Safe Design
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Om data saknas eller frågan är olämplig returneras:
              </p>
              <pre className="bg-muted p-3 rounded-lg text-xs overflow-x-auto">
{`{
  "answer": null,
  "reason": "No verified data available for this question."
}`}
              </pre>
              <p className="text-sm text-muted-foreground">
                Detta är en feature, inte en begränsning. Agenten kan aldrig "fylla i".
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Limitations */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Begränsningar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <XCircle className="h-4 w-4 mt-0.5 text-status-critical flex-shrink-0" />
                <span><strong>Inga prediktioner</strong> – endast historisk data</span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="h-4 w-4 mt-0.5 text-status-critical flex-shrink-0" />
                <span><strong>Inga rekommendationer</strong> – systemet beskriver, föreskriver inte</span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="h-4 w-4 mt-0.5 text-status-critical flex-shrink-0" />
                <span><strong>Ingen individdata</strong> – all data är aggregerad</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 mt-0.5 text-status-positive flex-shrink-0" />
                <span><strong>Osäkerhet alltid angiven</strong> – varje svar inkluderar osäkerhetsgrad</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Footer */}
        <footer className="text-center text-xs text-muted-foreground pt-6 border-t border-border">
          <p>AI-Agent SDK v1.0 • Block 57</p>
          <p className="mt-1">Sanning som tjänst. Grounded by default.</p>
        </footer>
      </div>
    </div>
  );
}
