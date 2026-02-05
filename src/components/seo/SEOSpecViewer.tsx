/**
 * SEO SPEC VIEWER
 * 
 * Interactive demonstration of SEO & Schema Markup spec
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  PAGE_TYPES,
  CDP_SECTION_ORDER,
  EEAT_PRINCIPLES,
  generateCanonicalH1,
  generateCombinedSchema,
  generateMachineReadableOutput,
  generateFullLinkSet,
  buildCDPUrl,
  buildUYPUrl,
  ONTOLOGY_NAMESPACE,
} from '@/core/seo';

const EXAMPLE_ENTITY = 'Volkswagen Golf';
const EXAMPLE_DOMAIN = 'consumer';
const EXAMPLE_DECISION_TYPE = 'consumer_vehicle_evaluation';

export function SEOSpecViewer() {
  const [activeTab, setActiveTab] = useState('structure');
  
  const h1 = generateCanonicalH1(EXAMPLE_ENTITY);
  const schema = generateCombinedSchema(EXAMPLE_ENTITY, EXAMPLE_DECISION_TYPE, 'Is Volkswagen Golf a good car?');
  const machineOutput = generateMachineReadableOutput(
    EXAMPLE_ENTITY,
    EXAMPLE_DOMAIN,
    EXAMPLE_DECISION_TYPE,
    'CDP',
    buildCDPUrl(EXAMPLE_DOMAIN, EXAMPLE_ENTITY),
    {
      alternativesCount: 3,
      uncertaintiesCount: 2,
      assumptions: ['Usage profile', 'Budget', 'Time horizon'],
    }
  );
  const links = generateFullLinkSet(EXAMPLE_DOMAIN, EXAMPLE_ENTITY, {
    alternativeEntities: ['Toyota Corolla', 'Honda Civic'],
    referenceIds: ['DEC-001'],
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-2">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-mono">
                SEO & STRUCTURED DATA SPEC
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                v1 — Technical Dominance for Google + AI Agents
              </p>
            </div>
            <Badge variant="outline" className="font-mono">ABSOLUTE</Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="flex flex-wrap gap-2 text-xs font-mono text-muted-foreground">
            <span>❌ No clickbait</span>
            <span>•</span>
            <span>❌ No "best of"</span>
            <span>•</span>
            <span>❌ No recommendation</span>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="structure">Structure</TabsTrigger>
          <TabsTrigger value="schema">Schema</TabsTrigger>
          <TabsTrigger value="machine">Machine</TabsTrigger>
          <TabsTrigger value="links">Links</TabsTrigger>
          <TabsTrigger value="eeat">E-E-A-T</TabsTrigger>
        </TabsList>

        {/* Structure Tab */}
        <TabsContent value="structure" className="space-y-4">
          {/* Page Types */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-mono">PAGE TYPES (3 ONLY)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.values(PAGE_TYPES).map((pt) => (
                  <div key={pt.type} className="p-3 bg-muted/50 rounded">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="font-mono">{pt.type}</Badge>
                      <span className="text-sm font-medium">{pt.name}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{pt.purpose}</p>
                    <code className="text-xs text-primary mt-1 block">{pt.urlPattern}</code>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* H1 Structure */}
          <Card className="border-primary/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-mono">CANONICAL H1</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-medium bg-primary/10 p-3 rounded">
                {h1}
              </p>
              <div className="mt-3 space-y-1">
                <p className="text-xs text-destructive">❌ Never: "Is {EXAMPLE_ENTITY} good?"</p>
                <p className="text-xs text-destructive">❌ Never: "{EXAMPLE_ENTITY} review"</p>
              </div>
            </CardContent>
          </Card>

          {/* H2 Sections */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-mono">H2 SECTIONS (FIXED ORDER)</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-1">
                {CDP_SECTION_ORDER.map((section, i) => (
                  <li key={section} className="text-sm font-mono flex items-center gap-2">
                    <span className="text-muted-foreground w-4">{i + 1}.</span>
                    <span>{section}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Schema Tab */}
        <TabsContent value="schema" className="space-y-4">
          {/* Schema.org */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-mono">SCHEMA.ORG (DefinedTerm)</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px]">
                <pre className="text-xs font-mono bg-muted p-3 rounded">
{JSON.stringify(schema.schemaOrg, null, 2)}
                </pre>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Custom Ontology */}
          <Card className="border-primary/30">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-mono">CUSTOM ONTOLOGY</CardTitle>
                <Badge variant="secondary" className="text-xs font-mono">UNIQUE</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-2">
                Namespace: {ONTOLOGY_NAMESPACE}
              </p>
              <ScrollArea className="h-[200px]">
                <pre className="text-xs font-mono bg-muted p-3 rounded">
{JSON.stringify(schema.decisionLegitimacy, null, 2)}
                </pre>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* FAQ Schema */}
          {schema.faq && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-mono">FAQ MARKUP (NON-NORMATIVE)</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px]">
                  <pre className="text-xs font-mono bg-muted p-3 rounded">
{JSON.stringify(schema.faq, null, 2)}
                  </pre>
                </ScrollArea>
                <p className="text-xs text-muted-foreground mt-2">
                  ✓ Qualifies for rich results without giving advice
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Machine Tab */}
        <TabsContent value="machine" className="space-y-4">
          <Card className="border-primary/30">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-mono">AI CRAWLER OUTPUT</CardTitle>
                <code className="text-xs text-primary">GET /decision/entity.json</code>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <pre className="text-xs font-mono bg-muted p-3 rounded">
{JSON.stringify(machineOutput, null, 2)}
                </pre>
              </ScrollArea>
              <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                <p>✓ AI agents cite this</p>
                <p>✓ RAG systems trust this</p>
                <p>✓ Hallucinations decrease</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Links Tab */}
        <TabsContent value="links" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-mono">INTERNAL LINKS (KNOWLEDGE GRAPH)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(links).map(([type, linkList]) => (
                <div key={type}>
                  <p className="text-xs font-medium text-muted-foreground mb-2 uppercase">{type}</p>
                  <div className="space-y-1">
                    {linkList.map((link, i) => (
                      <div key={i} className="text-sm font-mono flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">{link.rel}</Badge>
                        <a href={link.href} className="text-primary hover:underline">
                          {link.text}
                        </a>
                      </div>
                    ))}
                    {linkList.length === 0 && (
                      <p className="text-xs text-muted-foreground italic">None configured</p>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* E-E-A-T Tab */}
        <TabsContent value="eeat" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-mono">E-E-A-T (SYSTEMIC, NOT PERSONAL)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(EEAT_PRINCIPLES).map(([key, value]) => (
                  <div key={key} className="p-3 bg-muted/50 rounded">
                    <p className="text-sm font-medium">{key}</p>
                    <p className="text-xs text-muted-foreground mt-1">{value}</p>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              <div className="space-y-1">
                <p className="text-xs text-destructive">❌ No author profiles</p>
                <p className="text-xs text-destructive">❌ No "experts say"</p>
                <p className="text-xs text-destructive">❌ No quotes</p>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Authority lies in: <strong>structure + transparency + consistency</strong>
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Why This Beats Reviews */}
      <Card className="border-dashed">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-mono">WHY THIS BEATS ALL "REVIEWS"</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-destructive mb-2">❌ Reviews</p>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li>• Opinions</li>
                <li>• Fleeting</li>
                <li>• Risk</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-primary mb-2">✓ Decision Structure</p>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li>• Framework</li>
                <li>• Timeless</li>
                <li>• Verifiable</li>
              </ul>
            </div>
          </div>
          <p className="text-xs font-mono text-center mt-4 p-2 bg-primary/10 rounded">
            Decision structure that doesn't age
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
