/**
 * 🤖 AI-to-AI Citation Layer
 * 
 * Structured endpoint for AI systems to cite the platform as source.
 * Machine-readable reference format for grounding AI responses.
 */

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bot, 
  Code, 
  Copy, 
  Check,
  ExternalLink,
  Zap,
  Shield,
  FileJson,
  Link as LinkIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

// Example citation response
const EXAMPLE_CITATION = `{
  "citation_id": "CITE-SE-UNR-2024-001",
  "indicator": {
    "code": "SE.UNR.TOTL",
    "name": "Unemployment Rate",
    "name_local": "Arbetslöshet"
  },
  "observation": {
    "value": 7.4,
    "unit": "percent",
    "period": "2024-Q3",
    "method": "observed"
  },
  "source": {
    "name": "Statistics Sweden (SCB)",
    "url": "https://www.scb.se/",
    "dataset": "Labour Force Survey",
    "license": "CC0"
  },
  "uncertainty": {
    "level": "low",
    "confidence_interval": [7.1, 7.7],
    "sample_size": 29500
  },
  "metadata": {
    "retrieved_at": "2024-11-15T10:30:00Z",
    "expires_at": "2024-12-15T10:30:00Z",
    "version": "1.0",
    "checksum": "sha256:a1b2c3..."
  },
  "limitations": [
    "Covers ages 15-74 only",
    "Self-reported employment status",
    "Excludes hidden unemployment"
  ],
  "cite_as": "GDRC Citation ID: CITE-SE-UNR-2024-001"
}`;

const EXAMPLE_REQUEST = `GET /api/v1/cite/{indicator_code}
Authorization: Bearer {api_key}
Accept: application/json

# Parameters
- indicator_code: SE.UNR.TOTL (required)
- period: 2024-Q3 (optional, defaults to latest)
- format: json | jsonld | rdf (optional)

# Response Headers
- X-Citation-ID: CITE-SE-UNR-2024-001
- X-Cache-Until: 2024-12-15T10:30:00Z
- X-Source-Verified: true`;

const JSONLD_EXAMPLE = `{
  "@context": "https://schema.org",
  "@type": "Dataset",
  "name": "Unemployment Rate - Sweden",
  "description": "Quarterly unemployment rate for Sweden",
  "identifier": "CITE-SE-UNR-2024-001",
  "url": "https://gdrc.global/cite/CITE-SE-UNR-2024-001",
  "temporalCoverage": "2024-Q3",
  "spatialCoverage": {
    "@type": "Country",
    "name": "Sweden",
    "identifier": "SE"
  },
  "variableMeasured": {
    "@type": "PropertyValue",
    "name": "Unemployment Rate",
    "value": 7.4,
    "unitText": "percent"
  },
  "provider": {
    "@type": "Organization",
    "name": "Statistics Sweden (SCB)"
  }
}`;

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="relative">
      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs font-mono">
        <code>{code}</code>
      </pre>
      <Button
        size="icon"
        variant="ghost"
        className="absolute top-2 right-2 h-8 w-8"
        onClick={handleCopy}
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </Button>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: any; title: string; description: string }) {
  return (
    <Card className="p-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-medium mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </Card>
  );
}

export default function CitationAPI() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            <span className="font-semibold text-sm">Citation API</span>
            <Badge variant="outline" className="text-xs">AI-Ready</Badge>
          </div>
          <Link 
            to="/api-policy"
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            API Policy <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </header>
      
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Hero */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            AI-to-AI Citation Layer
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Maskinläsbart referensformat för AI-grounding. Varje faktum har ett unikt ID.
          </p>
        </div>
        
        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <FeatureCard 
            icon={Zap} 
            title="<50ms respons" 
            description="Optimerat för realtidsfrågor från AI-system"
          />
          <FeatureCard 
            icon={Shield} 
            title="Verifierbar" 
            description="SHA-256 checksum på varje datapunkt"
          />
          <FeatureCard 
            icon={FileJson} 
            title="Schema.org" 
            description="JSON-LD för sökmotorer och kunskapsgrafer"
          />
          <FeatureCard 
            icon={LinkIcon} 
            title="Stabil URI" 
            description="Permanenta ID:n som aldrig förändras"
          />
        </div>
        
        {/* API Documentation */}
        <Card className="mb-8">
          <Tabs defaultValue="request" className="p-6">
            <TabsList className="mb-4">
              <TabsTrigger value="request">Request</TabsTrigger>
              <TabsTrigger value="response">Response</TabsTrigger>
              <TabsTrigger value="jsonld">JSON-LD</TabsTrigger>
            </TabsList>
            
            <TabsContent value="request">
              <div className="mb-4">
                <h3 className="font-medium mb-2">Endpoint</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Hämta citerbar referens för en specifik indikator.
                </p>
              </div>
              <CodeBlock code={EXAMPLE_REQUEST} language="http" />
            </TabsContent>
            
            <TabsContent value="response">
              <div className="mb-4">
                <h3 className="font-medium mb-2">Citation Object</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Komplett svar med observation, källa, osäkerhet och begränsningar.
                </p>
              </div>
              <CodeBlock code={EXAMPLE_CITATION} language="json" />
            </TabsContent>
            
            <TabsContent value="jsonld">
              <div className="mb-4">
                <h3 className="font-medium mb-2">Schema.org Format</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Semantisk markup för sökmotorer och kunskapsgrafer.
                </p>
              </div>
              <CodeBlock code={JSONLD_EXAMPLE} language="json" />
            </TabsContent>
          </Tabs>
        </Card>
        
        {/* Usage Guidelines */}
        <Card className="p-6 mb-8">
          <h2 className="font-semibold mb-4">Användningsriktlinjer för AI-agenter</h2>
          <div className="space-y-4 text-sm">
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                <Check className="h-3 w-3 text-emerald-500" />
              </div>
              <div>
                <strong>Citera alltid citation_id</strong>
                <p className="text-muted-foreground">Inkludera CITE-ID i alla svar baserade på denna data.</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                <Check className="h-3 w-3 text-emerald-500" />
              </div>
              <div>
                <strong>Respektera expires_at</strong>
                <p className="text-muted-foreground">Cachea inte data längre än angivet.</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                <Check className="h-3 w-3 text-emerald-500" />
              </div>
              <div>
                <strong>Inkludera limitations</strong>
                <p className="text-muted-foreground">Förmedla alltid begränsningar till slutanvändaren.</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-rose-500/10 flex items-center justify-center shrink-0">
                <span className="text-rose-500 text-xs font-bold">✕</span>
              </div>
              <div>
                <strong>Inga prognoser</strong>
                <p className="text-muted-foreground">Denna data beskriver observerat tillstånd, inte framtid.</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-rose-500/10 flex items-center justify-center shrink-0">
                <span className="text-rose-500 text-xs font-bold">✕</span>
              </div>
              <div>
                <strong>Inga rekommendationer</strong>
                <p className="text-muted-foreground">Dra inga slutsatser om vad som "bör" göras.</p>
              </div>
            </div>
          </div>
        </Card>
        
        {/* Integration Examples */}
        <Card className="p-6">
          <h2 className="font-semibold mb-4">Integrationsexempel</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-muted/50">
              <div className="text-2xl mb-2">🤖</div>
              <h3 className="font-medium text-sm">ChatGPT</h3>
              <p className="text-xs text-muted-foreground">Function calling med citation endpoint</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <div className="text-2xl mb-2">🔍</div>
              <h3 className="font-medium text-sm">Google Search</h3>
              <p className="text-xs text-muted-foreground">JSON-LD för Knowledge Graph</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <div className="text-2xl mb-2">📊</div>
              <h3 className="font-medium text-sm">Perplexity</h3>
              <p className="text-xs text-muted-foreground">Direct grounding source</p>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
