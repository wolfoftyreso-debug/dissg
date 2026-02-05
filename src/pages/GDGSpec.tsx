/**
 * GLOBAL DECISION GRAMMAR SPECIFICATION PAGE
 * 
 * Public documentation of the GDG standard.
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  BookOpen, 
  Shield, 
  CheckCircle2, 
  XCircle, 
  FileCode,
  Scale,
  Info,
} from "lucide-react";
import { 
  GDG_VERSION, 
  GDG_AXIOMS, 
  GDG_FORBIDDEN, 
  GDG_REQUIRED,
  GDG_HUMAN_READABLE,
  GDG_YAML_SPEC,
} from "@/core/truth-engine/standards/global-decision-grammar";

export default function GDGSpec() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                <Scale className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold">Global Decision Grammar</h1>
              </div>
              <p className="text-lg text-muted-foreground mt-2 max-w-2xl">
                An open standard for structuring decisions. How the world learns to think correctly.
              </p>
            </div>
            <Badge variant="outline" className="text-sm">
              v{GDG_VERSION.version} · {GDG_VERSION.status}
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="axioms" className="gap-2">
              <Shield className="h-4 w-4" />
              Axioms
            </TabsTrigger>
            <TabsTrigger value="rules" className="gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Rules
            </TabsTrigger>
            <TabsTrigger value="spec" className="gap-2">
              <FileCode className="h-4 w-4" />
              Machine Spec
            </TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>What is GDG?</CardTitle>
                <CardDescription>
                  A formal language for correct decision-making
                </CardDescription>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <pre className="bg-muted p-4 rounded-lg text-sm whitespace-pre-wrap">
                  {GDG_HUMAN_READABLE}
                </pre>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    What GDG Provides
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-2 text-muted-foreground">
                    <li>• Structured question decomposition</li>
                    <li>• Verified answers with sources</li>
                    <li>• Explicit confidence levels</li>
                    <li>• Clear limitations</li>
                    <li>• Reproducible outputs</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-destructive" />
                    What GDG Forbids
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-2 text-muted-foreground">
                    <li>• Recommendations</li>
                    <li>• Optimization</li>
                    <li>• Value judgments</li>
                    <li>• Predictions as facts</li>
                    <li>• Advice or diagnosis</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Info className="h-4 w-4 text-primary" />
                    Who Uses GDG
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-2 text-muted-foreground">
                    <li>• AI models for grounding</li>
                    <li>• Organizations for decisions</li>
                    <li>• Governments for policy</li>
                    <li>• Researchers for analysis</li>
                    <li>• Anyone who wants truth</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Axioms */}
          <TabsContent value="axioms" className="space-y-4">
            {Object.values(GDG_AXIOMS).map((axiom, i) => (
              <Card key={axiom.id}>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Badge variant="outline">Axiom {i + 1}</Badge>
                    {axiom.id.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="font-medium">{axiom.statement}</p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Rationale:</strong> {axiom.rationale}
                  </p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Rules */}
          <TabsContent value="rules" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Required */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <CheckCircle2 className="h-5 w-5" />
                    Required Elements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Every Decision Must Have:</h4>
                    <ul className="text-sm space-y-1">
                      {GDG_REQUIRED.every_decision_must_have.map(item => (
                        <li key={item} className="flex items-center gap-2">
                          <CheckCircle2 className="h-3 w-3 text-primary" />
                          {item.replace(/_/g, ' ')}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Every Answer Must Have:</h4>
                    <ul className="text-sm space-y-1">
                      {GDG_REQUIRED.every_answer_must_have.map(item => (
                        <li key={item} className="flex items-center gap-2">
                          <CheckCircle2 className="h-3 w-3 text-primary" />
                          {item.replace(/_/g, ' ')}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Forbidden */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-destructive">
                    <XCircle className="h-5 w-5" />
                    Forbidden Elements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Forbidden Outputs:</h4>
                    <ul className="text-sm space-y-1">
                      {GDG_FORBIDDEN.forbidden_outputs.map(item => (
                        <li key={item} className="flex items-center gap-2">
                          <XCircle className="h-3 w-3 text-destructive" />
                          {item.replace(/_/g, ' ')}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Forbidden Operations:</h4>
                    <ul className="text-sm space-y-1">
                      {GDG_FORBIDDEN.forbidden_operations.map(item => (
                        <li key={item} className="flex items-center gap-2">
                          <XCircle className="h-3 w-3 text-destructive" />
                          {item.replace(/_/g, ' ')}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Machine Spec */}
          <TabsContent value="spec">
            <Card>
              <CardHeader>
                <CardTitle>Machine-Readable Specification (YAML)</CardTitle>
                <CardDescription>
                  Use this specification to validate GDG compliance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <pre className="bg-muted p-4 rounded-lg text-sm font-mono">
                    {GDG_YAML_SPEC}
                  </pre>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Global Decision Grammar v{GDG_VERSION.version} · Published {GDG_VERSION.published}</p>
          <p className="mt-1">You don't own the decisions. You own the language for making them correctly.</p>
        </div>
      </footer>
    </div>
  );
}
