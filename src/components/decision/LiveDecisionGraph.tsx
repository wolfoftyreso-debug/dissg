/**
 * LIVE DECISION GRAPH COMPONENT
 * 
 * Connects to the Decision API and renders a complete decision graph.
 * Shows nodes, answers, visualizations, and limitations.
 */

import { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { VegaChart } from "./VegaChart";
import { 
  Play, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  ChevronRight,
  Info,
  Database,
  TrendingUp,
  BarChart3,
  GitBranch,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { generateSpecFromAnswerType, type VegaLiteSpec } from "@/core/truth-engine/decision/visualization";

interface DecisionNode {
  node_id: string;
  question: string;
  answer_type: string;
  required: boolean;
  status: "resolved" | "unresolved" | "insufficient_data";
  confidence_threshold: number;
  answer?: {
    answer_packet_id: string;
    summary: string;
    confidence: number;
    data_coverage: number;
    source_count: number;
    freshness_days: number;
    limitations: string[];
    resolved_at: string;
  };
}

interface DecisionGraphData {
  decision_graph_id: string;
  version: string;
  title: string;
  description?: string;
  nodes: DecisionNode[];
  overall_confidence: number;
  completeness: number;
  governance: {
    no_recommendation: boolean;
    read_only: boolean;
  };
}

interface LiveDecisionGraphProps {
  templateId: string;
  context: Record<string, string>;
  title?: string;
}

export function LiveDecisionGraph({ templateId, context, title }: LiveDecisionGraphProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isResolved, setIsResolved] = useState(false);
  const [graph, setGraph] = useState<DecisionGraphData | null>(null);
  const [selectedNode, setSelectedNode] = useState<DecisionNode | null>(null);
  const [error, setError] = useState<string | null>(null);

  const resolveGraph = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("decision", {
        body: {
          template_id: templateId,
          context,
          include_indices: true,
          include_signals: true,
          include_assumptions: true,
        },
      });

      if (fnError) throw fnError;
      if (!data?.success) throw new Error(data?.error || "Failed to resolve graph");

      setGraph(data.graph);
      setIsResolved(true);
      
      // Select first node by default
      if (data.graph?.nodes?.length > 0) {
        setSelectedNode(data.graph.nodes[0]);
      }
    } catch (e) {
      console.error("Failed to resolve decision graph:", e);
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, [templateId, context]);

  const getStatusIcon = (status: DecisionNode["status"]) => {
    switch (status) {
      case "resolved":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "unresolved":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "insufficient_data":
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getAnswerTypeIcon = (type: string) => {
    switch (type) {
      case "TREND_CHANGE":
        return <TrendingUp className="h-4 w-4" />;
      case "DISTRIBUTION_STRUCTURE":
      case "COMPARISON_CONDITIONAL":
        return <BarChart3 className="h-4 w-4" />;
      case "CORRELATION_OVERVIEW":
        return <GitBranch className="h-4 w-4" />;
      default:
        return <Database className="h-4 w-4" />;
    }
  };

  // Generate mock chart data based on node type
  const generateChartData = (node: DecisionNode): unknown[] => {
    switch (node.answer_type) {
      case "TREND_CHANGE":
        return Array.from({ length: 12 }, (_, i) => ({
          period: i,
          value: 100 + Math.random() * 50 + i * 3,
        }));
      case "DISTRIBUTION_STRUCTURE":
        return Array.from({ length: 20 }, () => ({
          value: Math.random() * 100,
          count: Math.floor(Math.random() * 50),
        }));
      case "COMPARISON_CONDITIONAL":
        return ["Region A", "Region B", "Region C", "Region D"].map(region => ({
          category: region,
          value: Math.random() * 100,
        }));
      case "CORRELATION_OVERVIEW":
        return ["Var A", "Var B", "Var C"].flatMap(a =>
          ["Var A", "Var B", "Var C"].map(b => ({
            factor_a: a,
            factor_b: b,
            value: a === b ? 1 : (Math.random() * 2 - 1),
          }))
        );
      default:
        return [{ metric: "Current", value: 75 }, { metric: "Target", value: 90 }];
    }
  };

  const selectedChartSpec: VegaLiteSpec | null = selectedNode
    ? generateSpecFromAnswerType(
        selectedNode.answer_type,
        generateChartData(selectedNode),
        selectedNode.question,
        selectedNode.answer?.limitations || ["Data shown without interpretation"]
      )
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>{title || graph?.title || "Decision Graph"}</CardTitle>
              <CardDescription className="mt-1">
                {graph?.description || "Structured question framework — no recommendations provided"}
              </CardDescription>
            </div>
            <Button
              onClick={resolveGraph}
              disabled={isLoading}
              className="gap-2"
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              {isLoading ? "Resolving..." : isResolved ? "Re-resolve" : "Resolve Graph"}
            </Button>
          </div>
        </CardHeader>
        {graph && (
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="flex-1">
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Completeness</span>
                  <span className="font-medium">{Math.round(graph.completeness * 100)}%</span>
                </div>
                <Progress value={graph.completeness * 100} className="h-2" />
              </div>
              <div className="flex-1">
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Confidence</span>
                  <span className="font-medium">{Math.round(graph.overall_confidence * 100)}%</span>
                </div>
                <Progress value={graph.overall_confidence * 100} className="h-2" />
              </div>
              <Badge variant="secondary" className="gap-1">
                <Info className="h-3 w-3" />
                No recommendation
              </Badge>
            </div>
          </CardContent>
        )}
      </Card>

      {error && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="py-4">
            <div className="flex items-center gap-2 text-destructive">
              <XCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {graph && (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Node List */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Questions ({graph.nodes.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[400px]">
                <div className="space-y-1 p-4 pt-0">
                  {graph.nodes.map(node => (
                    <button
                      key={node.node_id}
                      onClick={() => setSelectedNode(node)}
                      className={`w-full rounded-lg border p-3 text-left transition-colors ${
                        selectedNode?.node_id === node.node_id
                          ? "border-primary bg-primary/5"
                          : "border-transparent hover:bg-muted"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {getStatusIcon(node.status)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium line-clamp-2">{node.question}</p>
                          <div className="mt-1 flex items-center gap-2">
                            <Badge variant="outline" className="text-[10px]">
                              {node.answer_type.replace(/_/g, " ")}
                            </Badge>
                            {node.answer && (
                              <span className="text-xs text-muted-foreground">
                                {Math.round(node.answer.confidence * 100)}%
                              </span>
                            )}
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Detail View */}
          <div className="lg:col-span-2 space-y-4">
            {selectedNode ? (
              <Tabs defaultValue="visualization">
                <TabsList>
                  <TabsTrigger value="visualization">Visualization</TabsTrigger>
                  <TabsTrigger value="answer">Answer</TabsTrigger>
                  <TabsTrigger value="metadata">Metadata</TabsTrigger>
                </TabsList>

                <TabsContent value="visualization" className="mt-4">
                  <VegaChart
                    spec={selectedChartSpec}
                    title={selectedNode.question}
                    limitations={selectedNode.answer?.limitations}
                    height={350}
                  />
                </TabsContent>

                <TabsContent value="answer" className="mt-4">
                  <Card>
                    <CardHeader>
                      <div className="flex items-start gap-2">
                        {getAnswerTypeIcon(selectedNode.answer_type)}
                        <div>
                          <CardTitle className="text-base">{selectedNode.question}</CardTitle>
                          <CardDescription>
                            {selectedNode.answer_type.replace(/_/g, " ")}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {selectedNode.answer ? (
                        <div className="space-y-4">
                          <div className="rounded-lg bg-muted p-4">
                            <p className="text-sm">{selectedNode.answer.summary}</p>
                          </div>

                          <div className="grid gap-4 sm:grid-cols-3">
                            <div className="rounded-lg border p-3">
                              <p className="text-xs text-muted-foreground">Confidence</p>
                              <p className="text-lg font-semibold">
                                {Math.round(selectedNode.answer.confidence * 100)}%
                              </p>
                            </div>
                            <div className="rounded-lg border p-3">
                              <p className="text-xs text-muted-foreground">Sources</p>
                              <p className="text-lg font-semibold">
                                {selectedNode.answer.source_count}
                              </p>
                            </div>
                            <div className="rounded-lg border p-3">
                              <p className="text-xs text-muted-foreground">Freshness</p>
                              <p className="text-lg font-semibold">
                                {selectedNode.answer.freshness_days}d
                              </p>
                            </div>
                          </div>

                          {selectedNode.answer.limitations.length > 0 && (
                            <div className="rounded-lg border-yellow-500/30 bg-yellow-500/5 p-3">
                              <p className="mb-2 text-xs font-medium text-yellow-700">Limitations</p>
                              <ul className="space-y-1 text-xs text-muted-foreground">
                                {selectedNode.answer.limitations.map((lim, i) => (
                                  <li key={i}>• {lim}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <AlertTriangle className="h-4 w-4" />
                          <span>No answer data available</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="metadata" className="mt-4">
                  <Card>
                    <CardContent className="pt-6">
                      <pre className="max-h-[400px] overflow-auto rounded-lg bg-muted p-4 text-xs">
                        {JSON.stringify(selectedNode, null, 2)}
                      </pre>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            ) : (
              <Card className="flex h-[400px] items-center justify-center">
                <p className="text-muted-foreground">Select a question to view details</p>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
