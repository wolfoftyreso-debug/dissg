/**
 * Canonical Question & Answer Intelligence System (CQAIS)
 * 
 * "Every important question, already answered correctly"
 */

import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  HelpCircle, 
  TrendingUp, 
  GitCompare, 
  AlertTriangle,
  Search,
  Shield,
  Globe,
  Zap,
  BookOpen,
  CheckCircle,
  XCircle,
  ArrowRight,
  Bot
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

// =============================================================================
// TYPES
// =============================================================================

type QuestionIntentClass = 'status' | 'trend' | 'cause' | 'comparison' | 'consequence' | 'forecast';

interface CQAISResponse {
  success: boolean;
  data?: {
    short_answer: string;
    drivers: { indicator_id: string; indicator_name: string; contribution: string; magnitude: string; description: string; }[];
    timeline: { start_date: string; end_date: string; key_breakpoints: { date: string; description: string; }[]; };
    comparison: { type: string; entities: string[]; summary: string; }[];
    uncertainty: { data_coverage: string; coverage_description: string; not_measured: string[]; caveats: string[]; };
    deep_links: { indicator_id: string; label: string; url: string; }[];
    meta: { question_id: string; intent_class: QuestionIntentClass; scope: string; generated_at: string; data_freshness: string; citation_id: string; method_version: string; };
  };
  blocked?: {
    is_blocked: boolean;
    block_reason: string;
    block_message: string;
    redirect_suggestion: string;
    alternative_questions: string[];
    meta: { original_query: string; detected_intent?: string; timestamp: string; };
  };
}

// =============================================================================
// CONSTANTS
// =============================================================================

const INTENT_ICONS: Record<QuestionIntentClass, React.ReactNode> = {
  status: <HelpCircle className="h-4 w-4" />,
  trend: <TrendingUp className="h-4 w-4" />,
  cause: <Search className="h-4 w-4" />,
  comparison: <GitCompare className="h-4 w-4" />,
  consequence: <ArrowRight className="h-4 w-4" />,
  forecast: <Zap className="h-4 w-4" />
};

const INTENT_COLORS: Record<QuestionIntentClass, string> = {
  status: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  trend: 'bg-green-500/10 text-green-500 border-green-500/20',
  cause: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  comparison: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  consequence: 'bg-pink-500/10 text-pink-500 border-pink-500/20',
  forecast: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20'
};

const EXAMPLE_QUESTIONS = [
  { question: 'How is Sweden doing?', intent: 'status' as QuestionIntentClass },
  { question: 'Is unemployment increasing in Germany?', intent: 'trend' as QuestionIntentClass },
  { question: 'Why are housing prices high?', intent: 'cause' as QuestionIntentClass },
  { question: 'Sweden vs Norway', intent: 'comparison' as QuestionIntentClass },
  { question: 'What does aging population mean?', intent: 'consequence' as QuestionIntentClass },
  { question: 'What is the pension outlook?', intent: 'forecast' as QuestionIntentClass }
];

const BLOCKED_EXAMPLES = [
  { question: 'Should we raise taxes?', reason: 'political_directive' },
  { question: 'Is socialism good or bad?', reason: 'normative' },
  { question: 'What if aliens invaded?', reason: 'speculative' }
];

// =============================================================================
// COMPONENT
// =============================================================================

export default function CQAIS() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<CQAISResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleResolve = async (questionText?: string) => {
    const q = questionText || query;
    if (!q.trim()) return;

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('cqais', {
        body: { query: q }
      });

      if (fnError) throw fnError;
      setResponse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resolve question');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>CQAIS - Canonical Question & Answer Intelligence System</title>
        <meta name="description" content="Every important question, already answered correctly. AI-readable, human-understandable answers with full uncertainty disclosure." />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebAPI",
            "name": "CQAIS - Canonical Question & Answer Intelligence System",
            "description": "Structured, data-backed answers to all factual societal questions",
            "documentation": "https://gdrc.io/api/cqais",
            "provider": {
              "@type": "Organization",
              "name": "Global Decision & Reality Cluster"
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero */}
        <section className="border-b bg-gradient-to-b from-muted/50 to-background">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="outline" className="mb-4">
                <Bot className="h-3 w-3 mr-1" />
                CQAIS v1.0
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Canonical Question & Answer
                <br />
                <span className="text-muted-foreground">Intelligence System</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                "Every important question, already answered correctly"
              </p>
              
              {/* Query Input */}
              <div className="flex gap-2 max-w-2xl mx-auto">
                <Input
                  placeholder="Ask any factual question about society, economy, health..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleResolve()}
                  className="text-lg h-12"
                />
                <Button 
                  onClick={() => handleResolve()} 
                  disabled={loading}
                  className="h-12 px-6"
                >
                  {loading ? 'Resolving...' : 'Resolve'}
                </Button>
              </div>

              {/* Example Questions */}
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {EXAMPLE_QUESTIONS.slice(0, 4).map((ex) => (
                  <Button
                    key={ex.question}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setQuery(ex.question);
                      handleResolve(ex.question);
                    }}
                    className="text-xs"
                  >
                    {INTENT_ICONS[ex.intent]}
                    <span className="ml-1">{ex.question}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Response Display */}
        {(response || error) && (
          <section className="py-8">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                {error && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {response?.blocked && (
                  <Card className="border-amber-500/50 bg-amber-500/5">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <XCircle className="h-5 w-5 text-amber-500" />
                        <CardTitle className="text-amber-500">Question Blocked</CardTitle>
                      </div>
                      <Badge variant="outline" className="w-fit">{response.blocked.block_reason}</Badge>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground">{response.blocked.block_message}</p>
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="font-medium mb-2">{response.blocked.redirect_suggestion}</p>
                        <div className="space-y-1">
                          {response.blocked.alternative_questions.map((q, i) => (
                            <Button
                              key={i}
                              variant="link"
                              className="p-0 h-auto text-left justify-start"
                              onClick={() => {
                                setQuery(q);
                                handleResolve(q);
                              }}
                            >
                              → {q}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {response?.success && response.data && (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <CardTitle>Answer (A2F Format)</CardTitle>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={INTENT_COLORS[response.data.meta.intent_class]}>
                            {INTENT_ICONS[response.data.meta.intent_class]}
                            <span className="ml-1">{response.data.meta.intent_class}</span>
                          </Badge>
                          <Badge variant="outline">{response.data.meta.scope}</Badge>
                        </div>
                      </div>
                      <CardDescription>
                        Citation: {response.data.meta.citation_id} • {response.data.meta.method_version}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* 1. Short Answer */}
                      <div>
                        <h4 className="font-semibold mb-2 text-sm text-muted-foreground">1. SHORT ANSWER</h4>
                        <p className="text-lg">{response.data.short_answer}</p>
                      </div>

                      {/* 2. Drivers */}
                      <div>
                        <h4 className="font-semibold mb-2 text-sm text-muted-foreground">2. WHAT DRIVES THIS</h4>
                        <div className="space-y-2">
                          {response.data.drivers.map((driver) => (
                            <div key={driver.indicator_id} className="p-3 bg-muted rounded-lg">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium">{driver.indicator_name}</span>
                                <div className="flex gap-1">
                                  <Badge variant="outline" className="text-xs">
                                    {driver.contribution}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {driver.magnitude}
                                  </Badge>
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground">{driver.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 3. Timeline */}
                      <div>
                        <h4 className="font-semibold mb-2 text-sm text-muted-foreground">3. SINCE WHEN</h4>
                        <p className="text-sm mb-2">
                          Period: {response.data.timeline.start_date} → {response.data.timeline.end_date}
                        </p>
                        <div className="space-y-1">
                          {response.data.timeline.key_breakpoints.map((bp, i) => (
                            <div key={i} className="flex gap-2 text-sm">
                              <span className="text-muted-foreground">{bp.date}</span>
                              <span>{bp.description}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 4. Comparison */}
                      <div>
                        <h4 className="font-semibold mb-2 text-sm text-muted-foreground">4. COMPARISON</h4>
                        <div className="space-y-2">
                          {response.data.comparison.map((comp, i) => (
                            <div key={i} className="p-3 bg-muted rounded-lg">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline" className="text-xs">{comp.type}</Badge>
                                <span className="text-xs text-muted-foreground">
                                  {comp.entities.join(' • ')}
                                </span>
                              </div>
                              <p className="text-sm">{comp.summary}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 5. Uncertainty */}
                      <div>
                        <h4 className="font-semibold mb-2 text-sm text-muted-foreground">5. UNCERTAINTY & LIMITATIONS</h4>
                        <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                            <span className="font-medium">Data Coverage: {response.data.uncertainty.data_coverage}</span>
                          </div>
                          <p className="text-sm mb-2">{response.data.uncertainty.coverage_description}</p>
                          <div className="text-sm">
                            <p className="font-medium mb-1">Not Measured:</p>
                            <ul className="list-disc list-inside text-muted-foreground">
                              {response.data.uncertainty.not_measured.map((item, i) => (
                                <li key={i}>{item}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="text-sm mt-2">
                            <p className="font-medium mb-1">Caveats:</p>
                            <ul className="list-disc list-inside text-muted-foreground">
                              {response.data.uncertainty.caveats.map((item, i) => (
                                <li key={i}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* 6. Deep Links */}
                      <div>
                        <h4 className="font-semibold mb-2 text-sm text-muted-foreground">6. EXPLORE DEEPER</h4>
                        <div className="flex flex-wrap gap-2">
                          {response.data.deep_links.map((link) => (
                            <Button key={link.indicator_id} variant="outline" size="sm">
                              <BookOpen className="h-3 w-3 mr-1" />
                              {link.label}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Raw JSON */}
                      <details className="mt-4">
                        <summary className="cursor-pointer text-sm text-muted-foreground">
                          View Raw JSON (for AI consumption)
                        </summary>
                        <pre className="mt-2 p-4 bg-muted rounded-lg overflow-x-auto text-xs">
                          {JSON.stringify(response.data, null, 2)}
                        </pre>
                      </details>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Documentation */}
        <section className="py-12 border-t">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <Tabs defaultValue="ontology">
                <TabsList className="mb-6">
                  <TabsTrigger value="ontology">Question Ontology</TabsTrigger>
                  <TabsTrigger value="format">A2F Format</TabsTrigger>
                  <TabsTrigger value="blocked">Blocked Questions</TabsTrigger>
                  <TabsTrigger value="api">API Reference</TabsTrigger>
                </TabsList>

                <TabsContent value="ontology">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { intent: 'status' as QuestionIntentClass, title: 'Status Questions', desc: 'Current state or condition', examples: ['How is Sweden doing?', 'What is unemployment in Berlin?'] },
                      { intent: 'trend' as QuestionIntentClass, title: 'Trend Questions', desc: 'Changes over time', examples: ['Is crime getting worse?', 'Are wages increasing?'] },
                      { intent: 'cause' as QuestionIntentClass, title: 'Cause Questions', desc: 'Factors and mechanisms', examples: ['Why are housing prices high?', 'Why is fertility declining?'] },
                      { intent: 'comparison' as QuestionIntentClass, title: 'Comparison Questions', desc: 'Differences between entities', examples: ['Sweden vs Norway', 'Before/after reform X'] },
                      { intent: 'consequence' as QuestionIntentClass, title: 'Consequence Questions', desc: 'Implications and effects', examples: ['What does aging mean?', 'What are the risks?'] },
                      { intent: 'forecast' as QuestionIntentClass, title: 'Forecast Questions', desc: 'Trajectory projections', examples: ['Pension outlook?', 'Which sectors are growing?'] }
                    ].map((item) => (
                      <Card key={item.intent}>
                        <CardHeader className="pb-2">
                          <div className="flex items-center gap-2">
                            <Badge className={INTENT_COLORS[item.intent]}>
                              {INTENT_ICONS[item.intent]}
                            </Badge>
                            <CardTitle className="text-base">{item.title}</CardTitle>
                          </div>
                          <CardDescription>{item.desc}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ul className="text-sm space-y-1">
                            {item.examples.map((ex, i) => (
                              <li key={i} className="text-muted-foreground">• {ex}</li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="format">
                  <Card>
                    <CardHeader>
                      <CardTitle>Always-Answer-Format (A2F)</CardTitle>
                      <CardDescription>
                        Every answer follows this 6-part structure for consistency and citability
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { num: 1, title: 'Short Answer', desc: '2-3 sentence direct response with key finding' },
                          { num: 2, title: 'Drivers', desc: 'What factors are associated with this pattern' },
                          { num: 3, title: 'Timeline', desc: 'Since when, with key breakpoints' },
                          { num: 4, title: 'Comparison', desc: 'Historical, peer, and global context' },
                          { num: 5, title: 'Uncertainty', desc: 'Data coverage, what is NOT measured, caveats' },
                          { num: 6, title: 'Deep Links', desc: 'Click through to underlying indicators' }
                        ].map((step) => (
                          <div key={step.num} className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                              {step.num}
                            </div>
                            <div>
                              <h4 className="font-semibold">{step.title}</h4>
                              <p className="text-sm text-muted-foreground">{step.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="blocked">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        <CardTitle>Questions We Refuse to Answer</CardTitle>
                      </div>
                      <CardDescription>
                        These question types are blocked to maintain epistemic integrity
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { type: 'Normative', desc: 'Value judgments (right/wrong, good/bad)', example: 'Is socialism good or bad?' },
                          { type: 'Political Directive', desc: 'Policy recommendations', example: 'Should we raise taxes?' },
                          { type: 'Speculative', desc: 'Hypotheticals without data', example: 'What if aliens invaded?' },
                          { type: 'Insufficient Data', desc: 'Questions we cannot answer reliably', example: 'Exact outcomes 50 years from now' },
                          { type: 'Out of Scope', desc: 'Non-factual questions', example: 'What is the meaning of life?' }
                        ].map((item) => (
                          <div key={item.type} className="p-4 bg-muted rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <XCircle className="h-4 w-4 text-destructive" />
                              <span className="font-semibold">{item.type}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{item.desc}</p>
                            <p className="text-sm mt-1">Example: <span className="italic">"{item.example}"</span></p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="api">
                  <Card>
                    <CardHeader>
                      <CardTitle>API Reference</CardTitle>
                      <CardDescription>Zero-friction access for AI agents</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-mono text-sm font-semibold mb-2">POST /functions/v1/cqais</h4>
                          <p className="text-sm text-muted-foreground mb-2">Resolve a natural language question</p>
                          <pre className="p-4 bg-muted rounded-lg overflow-x-auto text-xs">
{`// Request
{
  "query": "How is Sweden doing?",
  "geo_context": "SE",
  "language": "en"
}

// Response (success)
{
  "success": true,
  "data": {
    "short_answer": "According to Reality Index 1.0...",
    "drivers": [...],
    "timeline": {...},
    "comparison": [...],
    "uncertainty": {...},
    "deep_links": [...],
    "meta": {
      "question_id": "CQ-STATUS-COUNTRY-...",
      "intent_class": "status",
      "citation_id": "CITE-CQ-STATUS-..."
    }
  }
}

// Response (blocked)
{
  "success": false,
  "blocked": {
    "is_blocked": true,
    "block_reason": "normative",
    "block_message": "This question involves value judgments...",
    "redirect_suggestion": "Here is what can be measured...",
    "alternative_questions": [...]
  }
}`}
                          </pre>
                        </div>

                        <div>
                          <h4 className="font-mono text-sm font-semibold mb-2">GET /functions/v1/cqais</h4>
                          <p className="text-sm text-muted-foreground mb-2">Get system info and search questions</p>
                          <pre className="p-4 bg-muted rounded-lg overflow-x-auto text-xs">
{`// Query parameters
?intent=status    // Filter by intent class
?scope=country    // Filter by scope level
?q=sweden         // Search query

// Returns list of canonical questions matching filters`}
                          </pre>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-12 bg-muted/50 border-t">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold text-center mb-8">Why This Wins</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { icon: <Globe className="h-6 w-6" />, title: 'Universal Scope', desc: 'Same logic works globally, nationally, locally' },
                  { icon: <Shield className="h-6 w-6" />, title: 'Anti-Hallucination', desc: 'Blocks speculative & normative questions' },
                  { icon: <Bot className="h-6 w-6" />, title: 'AI-First', desc: 'Structured for machine consumption' },
                  { icon: <CheckCircle className="h-6 w-6" />, title: 'Always Citable', desc: 'Every answer has a citation ID' }
                ].map((feature) => (
                  <Card key={feature.title}>
                    <CardContent className="pt-6 text-center">
                      <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                        {feature.icon}
                      </div>
                      <h3 className="font-semibold mb-1">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
