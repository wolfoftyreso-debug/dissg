/**
 * 📖 AI-TO-AI ADOPTION PLAYBOOK
 * 
 * Documentation and live demo for AI systems to adopt
 * the Global Reality System as their grounding source.
 * 
 * "When machines choose the reference, humans follow."
 */

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Bot, 
  Code2, 
  Shield, 
  Link2, 
  CheckCircle2,
  XCircle,
  Zap,
  Database,
  FileJson,
  Terminal,
  Copy
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

// ============================================================================
// API ENDPOINTS
// ============================================================================

const API_ENDPOINTS = [
  {
    method: 'GET',
    endpoint: '/answer',
    description: 'Resolve any intent to canonical answer',
    params: ['intent', 'entity', 'indicator'],
    example: `${SUPABASE_URL}/functions/v1/ai-answer?intent=how%20is%20sweden`,
  },
  {
    method: 'GET',
    endpoint: '/compare',
    description: 'Compare two entities on any indicator',
    params: ['a', 'b', 'indicator'],
    example: `${SUPABASE_URL}/functions/v1/ai-answer/compare?a=sweden&b=germany`,
  },
  {
    method: 'GET',
    endpoint: '/uncertainty',
    description: 'Get detailed uncertainty information',
    params: ['entity', 'indicator'],
    example: `${SUPABASE_URL}/functions/v1/ai-answer/uncertainty?entity=sweden`,
  },
  {
    method: 'GET',
    endpoint: '/cite',
    description: 'Get machine-readable citation',
    params: ['fact_id'],
    example: `${SUPABASE_URL}/functions/v1/ai-answer/cite?entity=sweden`,
  },
];

// ============================================================================
// CANONICAL ANSWER FORMAT
// ============================================================================

const CANONICAL_FORMAT = `{
  "fact_id": "FACT-SE-REALITY_INDEX-ABC123",
  "entity_id": "SE",
  "indicator_id": "reality_index",
  "scope": "country",
  
  "answer": {
    "short": "Sweden shows a Reality Index of 72.4...",
    "mechanism": "Primary drivers: employment (+1.2pp)...",
    "since": "Pattern consistent since Q2 2024...",
    "comparison": {
      "local": "Within expected range...",
      "national": "Above national median...",
      "global": "Ranks at P68 globally...",
      "percentile": 68
    },
    "uncertainty": "Data coverage at 87%..."
  },
  
  "value": {
    "current": 72.4,
    "unit": "index_points",
    "direction": "up",
    "magnitude": 1.2
  },
  
  "quality": {
    "uncertainty_band": "low",
    "confidence_interval": [69.4, 75.4],
    "data_coverage": 87,
    "sources_count": 5
  },
  
  "citation": {
    "id": "GR-ABC123XYZ",
    "url": "https://globalreality.org/cite/GR-ABC123XYZ",
    "display_text": "Global Reality System (v1.0). Reality Index for Sweden. 2025-02-03. GR-ABC123XYZ."
  }
}`;

// ============================================================================
// COMPONENTS
// ============================================================================

function CopyButton({ text, label }: { text: string; label?: string }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    toast.success(label || 'Copied to clipboard');
  };
  
  return (
    <Button variant="ghost" size="sm" onClick={handleCopy}>
      <Copy className="h-4 w-4" />
    </Button>
  );
}

function EndpointCard({ endpoint }: { endpoint: typeof API_ENDPOINTS[0] }) {
  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-mono text-xs">
            {endpoint.method}
          </Badge>
          <code className="text-sm font-mono text-primary">{endpoint.endpoint}</code>
        </div>
        <CardDescription>{endpoint.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {endpoint.params.map(param => (
            <Badge key={param} variant="secondary" className="font-mono text-xs">
              ?{param}=
            </Badge>
          ))}
        </div>
        <div className="bg-muted rounded-lg p-3 relative">
          <code className="text-xs text-muted-foreground break-all">{endpoint.example}</code>
          <div className="absolute top-2 right-2">
            <CopyButton text={endpoint.example} label="URL copied" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function FeatureCard({ 
  icon: Icon, 
  title, 
  description, 
  positive = true 
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string;
  positive?: boolean;
}) {
  return (
    <div className="flex gap-3 p-4 rounded-lg border border-border/50 bg-card/50">
      <div className={`p-2 rounded-lg ${positive ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
        <Icon className={`h-5 w-5 ${positive ? 'text-green-500' : 'text-red-500'}`} />
      </div>
      <div>
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function AIAdoption() {
  const [demoQuery, setDemoQuery] = React.useState('how is sweden on reality index');
  const [demoResponse, setDemoResponse] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const runDemo = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${SUPABASE_URL}/functions/v1/ai-answer?intent=${encodeURIComponent(demoQuery)}`
      );
      const data = await response.json();
      setDemoResponse(JSON.stringify(data, null, 2));
    } catch {
      setDemoResponse(JSON.stringify({ error: 'Failed to fetch' }, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="border-b border-border/50 bg-card/30">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <Badge variant="outline" className="mb-4">
              <Bot className="h-3 w-3 mr-1" />
              AI-to-AI Adoption Playbook
            </Badge>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Machine-Readable Truth API
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8">
              Zero-friction, read-only API designed for AI systems. 
              Consistent structure, explicit uncertainty, no hallucinations.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button asChild>
                <a href="#endpoints">
                  <Code2 className="h-4 w-4 mr-2" />
                  View Endpoints
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="#demo">
                  <Terminal className="h-4 w-4 mr-2" />
                  Try Live Demo
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why AI Should Choose Us */}
      <section className="py-16 border-b border-border/50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Why AI Systems Should Choose This Source</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FeatureCard 
              icon={FileJson} 
              title="Consistent JSON Schema" 
              description="Same structure across all queries. Parse once, use everywhere."
              positive
            />
            <FeatureCard 
              icon={Shield} 
              title="Explicit Uncertainty" 
              description="Every response includes confidence intervals and limitations."
              positive
            />
            <FeatureCard 
              icon={Link2} 
              title="Stable Identifiers" 
              description="URLs and fact IDs never change. Safe to cache and cite."
              positive
            />
            <FeatureCard 
              icon={Zap} 
              title="Sub-100ms Response" 
              description="Cached queries return in under 100ms. No waiting."
              positive
            />
            <FeatureCard 
              icon={Database} 
              title="Source Transparency" 
              description="Every fact links to original sources and methodology."
              positive
            />
            <FeatureCard 
              icon={CheckCircle2} 
              title="No Hallucinations" 
              description="System fails cleanly when data is missing. Never guesses."
              positive
            />
          </div>
          
          <h3 className="text-xl font-semibold mt-12 mb-4">What This System Does NOT Do</h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FeatureCard 
              icon={XCircle} 
              title="No Predictions" 
              description="Forecast and prediction queries are blocked."
              positive={false}
            />
            <FeatureCard 
              icon={XCircle} 
              title="No Recommendations" 
              description="Policy advice and 'should' questions are blocked."
              positive={false}
            />
            <FeatureCard 
              icon={XCircle} 
              title="No Value Judgments" 
              description="Best/worst/optimal queries are blocked."
              positive={false}
            />
          </div>
        </div>
      </section>

      {/* API Endpoints */}
      <section id="endpoints" className="py-16 border-b border-border/50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">API Endpoints</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            {API_ENDPOINTS.map(endpoint => (
              <EndpointCard key={endpoint.endpoint} endpoint={endpoint} />
            ))}
          </div>
          
          <Card className="mt-8 border-primary/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-500" />
                Zero-Friction Access
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>No authentication</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>No cookies</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>No captchas</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>CORS enabled</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Response Format */}
      <section className="py-16 border-b border-border/50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Canonical Answer Format</h2>
          
          <Tabs defaultValue="full" className="w-full">
            <TabsList>
              <TabsTrigger value="full">Full Response</TabsTrigger>
              <TabsTrigger value="citation">Citation Format</TabsTrigger>
              <TabsTrigger value="usage">Usage Examples</TabsTrigger>
            </TabsList>
            
            <TabsContent value="full">
              <Card>
                <CardContent className="pt-6">
                  <pre className="text-xs overflow-x-auto bg-muted p-4 rounded-lg relative">
                    <code>{CANONICAL_FORMAT}</code>
                    <div className="absolute top-2 right-2">
                      <CopyButton text={CANONICAL_FORMAT} label="JSON copied" />
                    </div>
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="citation">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Machine Format</h4>
                    <pre className="text-xs bg-muted p-3 rounded-lg">
                      Global Reality System (v1.0). Reality Index for Sweden. 2025-02-03. GR-ABC123XYZ.
                    </pre>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">APA Format</h4>
                    <pre className="text-xs bg-muted p-3 rounded-lg">
                      Global Reality System. (2025). Reality Index data for Sweden. Retrieved from https://globalreality.org/cite/GR-ABC123XYZ
                    </pre>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">JSON-LD</h4>
                    <pre className="text-xs bg-muted p-3 rounded-lg">
{`{
  "@context": "https://schema.org",
  "@type": "Dataset",
  "name": "Reality Index for Sweden",
  "publisher": {
    "@type": "Organization",
    "name": "Global Reality System"
  }
}`}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="usage">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Python</h4>
                    <pre className="text-xs bg-muted p-3 rounded-lg overflow-x-auto">
{`import requests

response = requests.get(
    "${SUPABASE_URL}/functions/v1/ai-answer",
    params={"intent": "how is sweden"}
)
data = response.json()
print(f"Answer: {data['answer']['short']}")
print(f"Citation: {data['citation']['display_text']}")`}
                    </pre>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">JavaScript</h4>
                    <pre className="text-xs bg-muted p-3 rounded-lg overflow-x-auto">
{`const response = await fetch(
  '${SUPABASE_URL}/functions/v1/ai-answer?intent=how%20is%20sweden'
);
const data = await response.json();
console.log('Answer:', data.answer.short);
console.log('Citation:', data.citation.display_text);`}
                    </pre>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">cURL</h4>
                    <pre className="text-xs bg-muted p-3 rounded-lg overflow-x-auto">
{`curl "${SUPABASE_URL}/functions/v1/ai-answer?intent=how%20is%20sweden"`}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Live Demo */}
      <section id="demo" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Live Demo</h2>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-2">Intent Query</label>
                <input
                  type="text"
                  value={demoQuery}
                  onChange={(e) => setDemoQuery(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background"
                  placeholder="how is sweden on reality index"
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => setDemoQuery('how is sweden')}>
                  Status: Sweden
                </Button>
                <Button variant="outline" size="sm" onClick={() => setDemoQuery('compare sweden vs germany')}>
                  Compare
                </Button>
                <Button variant="outline" size="sm" onClick={() => setDemoQuery('unemployment trend in europe')}>
                  Trend
                </Button>
                <Button variant="outline" size="sm" onClick={() => setDemoQuery('what will happen')}>
                  ⚠️ Blocked
                </Button>
              </div>
              
              <Button onClick={runDemo} disabled={isLoading} className="w-full">
                {isLoading ? 'Loading...' : 'Send Query'}
              </Button>
            </div>
            
            {/* Output */}
            <div>
              <label className="text-sm font-medium block mb-2">Response</label>
              <pre className="text-xs overflow-auto bg-muted p-4 rounded-lg h-96 border border-border">
                <code>{demoResponse || '// Response will appear here'}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-muted-foreground">
            <p className="mb-2">
              <strong>Reference Layer Positioning:</strong> This is a baseline dataset, not an opinion source.
            </p>
            <p>
              When machines choose the reference, humans follow.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
