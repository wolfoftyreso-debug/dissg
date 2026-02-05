/**
 * DECISION GRAPH DEMO PAGE
 * 
 * Public demonstration of Decision Substrate capabilities.
 * Shows 3 live decision graphs: Investment, Healthcare, Policy.
 * 
 * These DISPLAY data, never RECOMMEND actions.
 */

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LiveDecisionGraph } from "@/components/decision/LiveDecisionGraph";
import { AssumptionsPanel } from "@/components/decision/AssumptionsPanel";
import { 
  Building2, 
  Stethoscope, 
  BookOpen, 
  Info,
  AlertTriangle,
  
  Code2,
} from "lucide-react";

const DEMO_CONFIGS = {
  investment: {
    templateId: "investment_decision_v1",
    title: "Investment Analysis: Energy Infrastructure",
    description: "Structured question framework for evaluating infrastructure investment decisions. Does NOT recommend whether to invest.",
    icon: Building2,
    context: { sector: "renewable_energy", country: "SE", time_horizon: "10y" },
  },
  healthcare: {
    templateId: "healthcare_planning_v1",
    title: "Healthcare Capacity: 12-Month Outlook",
    description: "Structured question framework for healthcare capacity planning. Does NOT recommend staffing levels or capacity targets.",
    icon: Stethoscope,
    context: { region: "Stockholm", facility_type: "hospital" },
  },
  policy: {
    templateId: "policy_decision_v1",
    title: "Policy Assessment: Education Reform",
    description: "Structured question framework for policy impact assessment. Does NOT recommend for or against the policy.",
    icon: BookOpen,
    context: { country: "SE", policy_area: "education" },
  },
};

export default function DecisionDemo() {
  const [activeGraph, setActiveGraph] = useState<keyof typeof DEMO_CONFIGS>("investment");
  const [showApiExample, setShowApiExample] = useState(false);

  const currentConfig = DEMO_CONFIGS[activeGraph];
  const Icon = currentConfig.icon;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Decision Substrate Demo</h1>
              <p className="text-muted-foreground mt-1">
                Structured question trees against reality — no recommendations, just data
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-sm">
                API v1
              </Badge>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-1"
                onClick={() => setShowApiExample(!showApiExample)}
              >
                <Code2 className="h-3.5 w-3.5" />
                {showApiExample ? "Hide API" : "View API"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Principle Banner */}
        <Card className="mb-8 border-primary/20 bg-primary/5">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">How this works</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Each decision is broken into structured questions. We provide verified answers 
                  with confidence levels and limitations. <strong>We never recommend</strong> — 
                  the decision remains yours.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Graph Selector */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <span className="text-sm font-medium">Select Decision Type:</span>
          <Select value={activeGraph} onValueChange={(v) => setActiveGraph(v as keyof typeof DEMO_CONFIGS)}>
            <SelectTrigger className="w-[280px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="investment">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Investment Decision
                </div>
              </SelectItem>
              <SelectItem value="healthcare">
                <div className="flex items-center gap-2">
                  <Stethoscope className="h-4 w-4" />
                  Healthcare Planning
                </div>
              </SelectItem>
              <SelectItem value="policy">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Policy Assessment
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          
          <Badge variant="secondary" className="ml-auto gap-1">
            <Icon className="h-3 w-3" />
            {currentConfig.templateId}
          </Badge>
        </div>

        {/* API Example */}
        {showApiExample && (
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Code2 className="h-4 w-4" />
                API Request Example
              </CardTitle>
              <CardDescription>
                POST /functions/v1/decision
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="overflow-auto rounded-lg bg-muted p-4 text-xs">
{`// Request
POST /functions/v1/decision
{
  "template_id": "${currentConfig.templateId}",
  "context": ${JSON.stringify(currentConfig.context, null, 4)},
  "include_indices": true,
  "include_signals": true
}

// Response includes:
// - Resolved question nodes with answers
// - Confidence levels per node
// - Data gaps and limitations
// - Index context (stability, volatility)
// - NOT included: recommendations, optimal choices, value judgments`}
              </pre>
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        <Tabs defaultValue="live-graph" className="space-y-6">
          <TabsList>
            <TabsTrigger value="live-graph">Live Graph</TabsTrigger>
            <TabsTrigger value="assumptions">Assumptions & Gaps</TabsTrigger>
          </TabsList>

          <TabsContent value="live-graph">
            <LiveDecisionGraph
              templateId={currentConfig.templateId}
              context={currentConfig.context}
              title={currentConfig.title}
            />
          </TabsContent>

          <TabsContent value="assumptions">
            <div className="grid gap-6 lg:grid-cols-2">
              <AssumptionsPanel
                assumptions={[
                  { assumption_id: "time_horizon", description: "What time horizon is relevant for this analysis?", impact_level: "high", options: ["1 year", "3 years", "5 years", "10+ years"], required: true },
                  { assumption_id: "baseline", description: "Conditions remain within historical range", impact_level: "medium", required: true },
                  { assumption_id: "stability", description: "No major disruption in analysis period", impact_level: "high", required: false },
                ]}
                dataGaps={[
                  {
                    node_id: "policy_signals",
                    question: "What policy signals are relevant?",
                    gap_type: "low_confidence",
                    severity: "important",
                    what_it_means: "Data exists but confidence is below threshold",
                    possible_alternatives: ["Proxy measures", "Alternative periods"],
                  },
                ]}
              />

              <Card className="border-yellow-500/30 bg-yellow-500/5">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base text-yellow-700">
                    <AlertTriangle className="h-4 w-4" />
                    What We Don't Provide
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-600">✕</span>
                      <span><strong>Recommendations</strong> — We never suggest what to do</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-600">✕</span>
                      <span><strong>Optimal choices</strong> — We don't rank alternatives</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-600">✕</span>
                      <span><strong>Value judgments</strong> — We don't weigh priorities</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-600">✕</span>
                      <span><strong>Risk preferences</strong> — We don't assess risk tolerance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-600">✕</span>
                      <span><strong>Action suggestions</strong> — We don't propose next steps</span>
                    </li>
                  </ul>
                  <div className="mt-4 pt-4 border-t border-yellow-500/20">
                    <p className="text-xs text-yellow-700 font-medium">
                      Responsibility lies with user/organization, never with AI, never with us.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Decision Substrate v1 — Questions against reality, never recommendations</p>
          <p className="mt-1">Responsibility lies with user/organization, not with AI, not with us</p>
        </div>
      </footer>
    </div>
  );
}
