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
import { DecisionOverview } from "@/components/decision/DecisionOverview";
import { AssumptionsPanel } from "@/components/decision/AssumptionsPanel";
import { 
  Building2, 
  Stethoscope, 
  BookOpen, 
  Play, 
  Info,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";

// Demo data for each graph type
const DEMO_GRAPHS = {
  investment: {
    title: "Investment Analysis: Energy Infrastructure",
    description: "Structured question framework for evaluating infrastructure investment decisions. Does NOT recommend whether to invest.",
    icon: Building2,
    context: { sector: "renewable_energy", country: "SE" },
    nodes: [
      { node_id: "demand_trend", question: "How has demand for renewable energy changed over 10 years?", status: "resolved" as const, confidence: 0.87, answer_summary: "Demand increased 34% with CAGR 3.0%" },
      { node_id: "volatility", question: "How volatile is demand in this sector?", status: "resolved" as const, confidence: 0.82, answer_summary: "Standard deviation 12%, within normal range" },
      { node_id: "regional", question: "How does demand differ across Swedish regions?", status: "resolved" as const, confidence: 0.79, answer_summary: "Stockholm 40% of demand, Skåne growing fastest" },
      { node_id: "rate_corr", question: "How does the sector correlate with interest rates?", status: "resolved" as const, confidence: 0.74, answer_summary: "Negative correlation (-0.45), 6-12 month lag" },
      { node_id: "policy", question: "What policy signals are relevant?", status: "unresolved" as const, confidence: 0.68, answer_summary: "Policy Volatility Index elevated (62)" },
    ],
  },
  healthcare: {
    title: "Healthcare Capacity: 12-Month Outlook",
    description: "Structured question framework for healthcare capacity planning. Does NOT recommend staffing levels or capacity targets.",
    icon: Stethoscope,
    context: { region: "Stockholm", facility_type: "hospital" },
    nodes: [
      { node_id: "occupancy", question: "What is the historical bed occupancy rate?", status: "resolved" as const, confidence: 0.91, answer_summary: "Mean 87% over 5 years, peak Dec-Feb" },
      { node_id: "wait_time", question: "How have wait times trended?", status: "resolved" as const, confidence: 0.84, answer_summary: "Increased 22% over 3 years, elective +35%" },
      { node_id: "regional", question: "How does capacity vary by region?", status: "resolved" as const, confidence: 0.78, answer_summary: "Urban areas 8-12% higher occupancy" },
      { node_id: "seasonal", question: "What are the seasonal patterns?", status: "resolved" as const, confidence: 0.89, answer_summary: "18% amplitude, peak Dec-Feb, trough Jun-Aug" },
      { node_id: "staffing", question: "How is staffing trending?", status: "unresolved" as const, confidence: 0.72, answer_summary: "FTE per bed declined 4%, nursing shortage acute" },
      { node_id: "readmission", question: "What are readmission rates?", status: "insufficient_data" as const },
    ],
  },
  policy: {
    title: "Policy Assessment: Education Reform",
    description: "Structured question framework for policy impact assessment. Does NOT recommend for or against the policy.",
    icon: BookOpen,
    context: { country: "SE", policy_area: "education" },
    nodes: [
      { node_id: "precedent", question: "What outcomes have similar reforms had?", status: "resolved" as const, confidence: 0.68, answer_summary: "8 Nordic reforms: 3 achieved goals, 2 neutral, 3 reversed" },
      { node_id: "variation", question: "What is normal variation in education outcomes?", status: "resolved" as const, confidence: 0.82, answer_summary: "Std dev 85 points, regional variation ±12%" },
      { node_id: "teacher_corr", question: "How do outcomes correlate with teacher density?", status: "resolved" as const, confidence: 0.76, answer_summary: "Positive correlation (r=0.42), stronger for low-SES" },
      { node_id: "affected", question: "Which groups are most affected by changes?", status: "resolved" as const, confidence: 0.74, answer_summary: "High sensitivity: special needs, newly arrived, low-SES urban" },
      { node_id: "dependencies", question: "What systems depend on current structure?", status: "insufficient_data" as const },
    ],
  },
};

export default function DecisionDemo() {
  const [activeGraph, setActiveGraph] = useState<keyof typeof DEMO_GRAPHS>("investment");
  const [isLoading, setIsLoading] = useState(false);
  const [hasResolved, setHasResolved] = useState(false);

  const currentGraph = DEMO_GRAPHS[activeGraph];
  const Icon = currentGraph.icon;

  const resolvedNodes = currentGraph.nodes.filter(n => n.status === "resolved");
  const completeness = resolvedNodes.length / currentGraph.nodes.length;
  const overallConfidence = resolvedNodes.length > 0
    ? resolvedNodes.reduce((sum, n) => sum + (n.confidence || 0), 0) / resolvedNodes.length
    : 0;

  const handleResolve = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setHasResolved(true);
    setIsLoading(false);
  };

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
            <Badge variant="outline" className="text-sm">
              API v1
            </Badge>
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
        <div className="mb-6 flex items-center gap-4">
          <span className="text-sm font-medium">Select Decision Type:</span>
          <Select value={activeGraph} onValueChange={(v) => { setActiveGraph(v as keyof typeof DEMO_GRAPHS); setHasResolved(false); }}>
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

          <Button 
            onClick={handleResolve} 
            disabled={isLoading || hasResolved}
            className="gap-2"
          >
            <Play className="h-4 w-4" />
            {isLoading ? "Resolving..." : hasResolved ? "Resolved" : "Resolve Graph"}
          </Button>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="assumptions">Assumptions & Gaps</TabsTrigger>
            <TabsTrigger value="api">API Response</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Graph Card */}
              <div className="lg:col-span-2">
                <DecisionOverview
                  title={currentGraph.title}
                  description={currentGraph.description}
                  nodes={currentGraph.nodes}
                  overallConfidence={overallConfidence}
                  completeness={completeness}
                />
              </div>

              {/* Context Card */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Icon className="h-5 w-5" />
                      Context
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-2 text-sm">
                      {Object.entries(currentGraph.context).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <dt className="text-muted-foreground">{key}</dt>
                          <dd className="font-medium">{value}</dd>
                        </div>
                      ))}
                    </dl>
                  </CardContent>
                </Card>

                <Card className="border-yellow-500/30 bg-yellow-500/5">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base text-yellow-700">
                      <AlertTriangle className="h-4 w-4" />
                      What We Don't Provide
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Recommendations</li>
                      <li>• Optimal choices</li>
                      <li>• Value judgments</li>
                      <li>• Risk preferences</li>
                      <li>• Action suggestions</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="assumptions">
            <AssumptionsPanel
              assumptions={[
                { assumption_id: "time_horizon", description: "What time horizon is relevant for this analysis?", impact_level: "high", options: ["1 year", "3 years", "5 years", "10+ years"], required: true },
                { assumption_id: "baseline", description: "Conditions remain within historical range", impact_level: "medium", required: true },
                { assumption_id: "stability", description: "No major disruption in analysis period", impact_level: "high", required: false },
              ]}
              dataGaps={currentGraph.nodes
                .filter(n => n.status === "insufficient_data" || n.status === "unresolved")
                .map(n => ({
                  node_id: n.node_id,
                  question: n.question,
                  gap_type: n.status === "insufficient_data" ? "no_data" as const : "low_confidence" as const,
                  severity: n.status === "insufficient_data" ? "critical" as const : "important" as const,
                  what_it_means: n.status === "insufficient_data" 
                    ? "No verified data available for this question"
                    : "Data exists but confidence below threshold",
                  possible_alternatives: ["Proxy measures", "Alternative periods", "Related indicators"],
                }))}
            />
          </TabsContent>

          <TabsContent value="api">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>API Response Preview</span>
                  <Button variant="outline" size="sm" className="gap-1">
                    <ExternalLink className="h-3 w-3" />
                    Try API
                  </Button>
                </CardTitle>
                <CardDescription>
                  POST /decision with template_id and context
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="max-h-[500px] overflow-auto rounded-lg bg-muted p-4 text-xs">
{JSON.stringify({
  success: true,
  graph: {
    decision_graph_id: `${activeGraph}_demo`,
    version: "v1",
    title: currentGraph.title,
    nodes: currentGraph.nodes.map(n => ({
      node_id: n.node_id,
      question: n.question,
      status: n.status,
      confidence: n.confidence,
      answer_summary: n.answer_summary,
    })),
    overall_confidence: Math.round(overallConfidence * 100) / 100,
    completeness: Math.round(completeness * 100) / 100,
    governance: {
      no_recommendation: true,
      read_only: true,
    },
  },
  not_provided: [
    "Recommendations",
    "Optimal choices",
    "Value judgments",
    "Risk preferences",
    "Action suggestions",
  ],
}, null, 2)}
                </pre>
              </CardContent>
            </Card>
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
