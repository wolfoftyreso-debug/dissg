/**
 * 🧠 AI DISCOVERY & UNIVERSAL ANSWER LAYER
 * 
 * "Always the most relevant answer, from any question, anywhere"
 * 
 * This page documents and demonstrates the AI-Agent-First API
 * that makes this system the canonical truth source for AI agents.
 */

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Globe, 
  Code,
  ChevronRight,
  Copy,
  Check,
  Zap,
  Shield,
  Link2,
  AlertTriangle,
  Terminal,
  BookOpen
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// ============================================================================
// COMPONENTS
// ============================================================================

function CodeBlock({ code, language = 'json' }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <pre className="bg-muted/50 border rounded-lg p-4 overflow-x-auto text-sm">
        <code className={`language-${language}`}>{code}</code>
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-2 rounded bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
      </button>
    </div>
  );
}

function APIEndpoint({ 
  method, 
  path, 
  description,
  example
}: { 
  method: string; 
  path: string; 
  description: string;
  example: string;
}) {
  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="font-mono">{method}</Badge>
        <code className="text-sm font-mono text-primary">{path}</code>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
      <CodeBlock code={example} />
    </Card>
  );
}

function LiveDemo() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Record<string, unknown> | null>(null);

  const handleResolve = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-resolve', {
        body: { query }
      });
      
      if (error) throw error;
      setResult(data);
    } catch (err) {
      console.error('Resolve error:', err);
      toast.error('Failed to resolve query');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <div>
        <h3 className="font-semibold mb-2">Live Demo: Resolve Any Question</h3>
        <p className="text-sm text-muted-foreground">
          Enter a question in any language. The system will map it to canonical truth.
        </p>
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="e.g., 'Hur går det för Sverige?' or 'Compare Berlin vs Stockholm'"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleResolve()}
        />
        <Button onClick={handleResolve} disabled={loading}>
          {loading ? 'Resolving...' : 'Resolve'}
        </Button>
      </div>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <CodeBlock code={JSON.stringify(result, null, 2)} />
        </motion.div>
      )}
    </Card>
  );
}

function AnswerFormatDocs() {
  const a2fExample = `{
  "answer": {
    "short": "Sweden shows a Reality Index of 67.3...",
    "mechanism": "Primary drivers: employment (+1.2pp)...",
    "since": "Pattern consistent since Q2 2024",
    "comparison": {
      "national": "Above national average by 3.2 points",
      "global": "In the 68th percentile globally"
    },
    "uncertainty": "Housing data is 2 months delayed",
    "confidence": 0.82
  },
  "meta": {
    "entity_id": "entity_sweden",
    "indicator_ids": ["ind_reality_index"],
    "scope": "country",
    "time_window": { "start": "2024-01-01", "end": "2026-02-03" },
    "sources": [...],
    "data_coverage": 87
  },
  "links": {
    "canonical": "https://globalreality.org/country/sweden/reality_index",
    "cite": "https://globalreality.org/cite/RI-SWEDEN-1738548000",
    "methodology": "https://globalreality.org/methodology/reality_index"
  }
}`;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-2">Always-Answer-Format (A2F)</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Every answer follows an identical structure, regardless of query type or language:
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="text-2xl mb-2">1️⃣</div>
          <h4 className="font-medium">Short Answer</h4>
          <p className="text-sm text-muted-foreground">
            1-2 sentence factual response
          </p>
        </Card>
        <Card className="p-4">
          <div className="text-2xl mb-2">2️⃣</div>
          <h4 className="font-medium">Mechanism</h4>
          <p className="text-sm text-muted-foreground">
            What drives this observation
          </p>
        </Card>
        <Card className="p-4">
          <div className="text-2xl mb-2">3️⃣</div>
          <h4 className="font-medium">Since When</h4>
          <p className="text-sm text-muted-foreground">
            Temporal context and history
          </p>
        </Card>
        <Card className="p-4">
          <div className="text-2xl mb-2">4️⃣</div>
          <h4 className="font-medium">Comparison</h4>
          <p className="text-sm text-muted-foreground">
            National and global context
          </p>
        </Card>
        <Card className="p-4">
          <div className="text-2xl mb-2">5️⃣</div>
          <h4 className="font-medium">Uncertainty</h4>
          <p className="text-sm text-muted-foreground">
            Explicit limitations and caveats
          </p>
        </Card>
        <Card className="p-4">
          <div className="text-2xl mb-2">6️⃣</div>
          <h4 className="font-medium">Deep Links</h4>
          <p className="text-sm text-muted-foreground">
            Canonical URLs for citation
          </p>
        </Card>
      </div>

      <CodeBlock code={a2fExample} />
    </div>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function AIDiscovery() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="border-b bg-gradient-to-br from-primary/5 via-background to-primary/10">
        <div className="container max-w-6xl mx-auto px-4 py-16">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <span>AI Discovery</span>
          </div>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-primary/10">
              <Brain className="h-10 w-10 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">AI Discovery & Universal Answer Layer</h1>
              <p className="text-xl text-muted-foreground mt-1">
                "Always the most relevant answer, from any question, anywhere"
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <Card className="p-4 text-center">
              <Globe className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="font-semibold">Universal</div>
              <div className="text-xs text-muted-foreground">Same truth, any input</div>
            </Card>
            <Card className="p-4 text-center">
              <Shield className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="font-semibold">Anti-Hallucination</div>
              <div className="text-xs text-muted-foreground">Verified facts only</div>
            </Card>
            <Card className="p-4 text-center">
              <Link2 className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="font-semibold">Citable</div>
              <div className="text-xs text-muted-foreground">Permanent IDs</div>
            </Card>
            <Card className="p-4 text-center">
              <Zap className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="font-semibold">Agent-First</div>
              <div className="text-xs text-muted-foreground">Built for AI</div>
            </Card>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container max-w-6xl mx-auto px-4 py-12">
        <Tabs defaultValue="demo" className="space-y-8">
          <TabsList>
            <TabsTrigger value="demo" className="gap-2">
              <Terminal className="h-4 w-4" />
              Live Demo
            </TabsTrigger>
            <TabsTrigger value="api" className="gap-2">
              <Code className="h-4 w-4" />
              API Reference
            </TabsTrigger>
            <TabsTrigger value="format" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Answer Format
            </TabsTrigger>
            <TabsTrigger value="principles" className="gap-2">
              <Shield className="h-4 w-4" />
              Principles
            </TabsTrigger>
          </TabsList>

          <TabsContent value="demo" className="space-y-6">
            <LiveDemo />

            <Card className="p-6 bg-amber-500/10 border-amber-500/20">
              <div className="flex gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
                <div className="text-sm">
                  <strong>Anti-Hallucination Protection:</strong> The system will refuse to answer 
                  questions that require forecasting, speculation, or data it doesn't have. 
                  Try asking "What will happen to Sweden's economy?" to see this in action.
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="api" className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">AI-Agent-First API</h2>
              <p className="text-muted-foreground">
                Read-only truth API designed for AI agents, search engines, and automated systems.
              </p>
            </div>

            <APIEndpoint
              method="POST"
              path="/ai-resolve"
              description="Resolve any natural language query to canonical truth. Supports any language."
              example={`curl -X POST \\
  https://your-project.supabase.co/functions/v1/ai-resolve \\
  -H "Content-Type: application/json" \\
  -d '{"query": "Hur går det för Sverige?"}'`}
            />

            <APIEndpoint
              method="POST"
              path="/ai-resolve/compare"
              description="Compare two or more entities across any indicators."
              example={`curl -X POST \\
  https://your-project.supabase.co/functions/v1/ai-resolve \\
  -H "Content-Type: application/json" \\
  -d '{
    "entities": ["stockholm", "berlin"],
    "indicators": ["housing", "employment"],
    "scope": "city"
  }'`}
            />

            <APIEndpoint
              method="POST"
              path="/ai-resolve/explain"
              description="Get mechanism-level explanation for any observation."
              example={`curl -X POST \\
  https://your-project.supabase.co/functions/v1/ai-resolve \\
  -H "Content-Type: application/json" \\
  -d '{
    "query": "Why is housing expensive in Stockholm?",
    "entities": ["stockholm"],
    "indicators": ["housing"]
  }'`}
            />

            <APIEndpoint
              method="POST"
              path="/ai-resolve/timeline"
              description="Get temporal evolution with breakpoints and policy markers."
              example={`curl -X POST \\
  https://your-project.supabase.co/functions/v1/ai-resolve \\
  -H "Content-Type: application/json" \\
  -d '{
    "entities": ["sweden"],
    "indicators": ["reality_index"],
    "from_date": "2020-01-01",
    "to_date": "2026-01-01"
  }'`}
            />
          </TabsContent>

          <TabsContent value="format">
            <AnswerFormatDocs />
          </TabsContent>

          <TabsContent value="principles" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10">
                    <Check className="h-5 w-5 text-emerald-500" />
                  </div>
                  <h3 className="font-semibold">What the System DOES</h3>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Resolve any question to verified facts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Provide consistent answers regardless of input method</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Show uncertainty and data limitations explicitly</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Enable machine-to-machine citation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Maintain local-global coherence</span>
                  </li>
                </ul>
              </Card>

              <Card className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-rose-500/10">
                    <AlertTriangle className="h-5 w-5 text-rose-500" />
                  </div>
                  <h3 className="font-semibold">What the System NEVER Does</h3>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                    <span>Make predictions or forecasts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                    <span>Give recommendations or advice</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                    <span>Answer without sufficient data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                    <span>Use value judgments (good/bad/better)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                    <span>Provide different answers based on input source</span>
                  </li>
                </ul>
              </Card>
            </div>

            <Card className="p-6 border-dashed">
              <h3 className="font-semibold mb-4">Universal Entry Test</h3>
              <p className="text-sm text-muted-foreground mb-4">
                The system must pass this test for every query:
              </p>
              <div className="p-4 bg-muted/30 rounded-lg text-center">
                <p className="italic">
                  "Could any other source reasonably provide a more accurate, 
                  more contextualized answer to this question?"
                </p>
                <p className="mt-2 font-medium text-primary">
                  If yes → FIX REQUIRED
                </p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
