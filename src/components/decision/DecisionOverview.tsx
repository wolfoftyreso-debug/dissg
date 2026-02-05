/**
 * DECISION OVERVIEW COMPONENT
 * 
 * Shows all questions in a decision graph with their status.
 * Displays confidence per node and overall data coverage.
 * 
 * This component DISPLAYS information, never RECOMMENDS actions.
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertCircle, XCircle, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface DecisionNode {
  node_id: string;
  question: string;
  status: 'resolved' | 'unresolved' | 'insufficient_data';
  confidence?: number;
  answer_summary?: string;
}

interface DecisionOverviewProps {
  title: string;
  description: string;
  nodes: DecisionNode[];
  overallConfidence: number;
  completeness: number;
  onNodeClick?: (nodeId: string) => void;
}

export function DecisionOverview({
  title,
  description,
  nodes,
  overallConfidence,
  completeness,
  onNodeClick,
}: DecisionOverviewProps) {
  const resolved = nodes.filter(n => n.status === 'resolved').length;
  const uncertain = nodes.filter(n => n.status === 'unresolved').length;
  const missing = nodes.filter(n => n.status === 'insufficient_data').length;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl">{title}</CardTitle>
            <CardDescription className="mt-1 max-w-2xl">{description}</CardDescription>
          </div>
          <Badge variant="outline" className="text-xs">
            v1 Schema
          </Badge>
        </div>
        
        {/* Summary metrics */}
        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
          <MetricCard
            label="Completeness"
            value={`${Math.round(completeness * 100)}%`}
            subtext={`${resolved}/${nodes.length} questions`}
          />
          <MetricCard
            label="Confidence"
            value={`${Math.round(overallConfidence * 100)}%`}
            subtext="Mean across nodes"
          />
          <MetricCard
            label="Uncertain"
            value={uncertain}
            subtext="Need review"
            variant={uncertain > 0 ? 'warning' : 'default'}
          />
          <MetricCard
            label="Data Gaps"
            value={missing}
            subtext="No data available"
            variant={missing > 0 ? 'error' : 'default'}
          />
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Progress bar */}
        <div className="mb-6">
          <div className="mb-2 flex justify-between text-sm text-muted-foreground">
            <span>Resolution Progress</span>
            <span>{Math.round(completeness * 100)}%</span>
          </div>
          <Progress value={completeness * 100} className="h-2" />
        </div>
        
        {/* Node list */}
        <div className="space-y-2">
          {nodes.map((node) => (
            <NodeRow
              key={node.node_id}
              node={node}
              onClick={() => onNodeClick?.(node.node_id)}
            />
          ))}
        </div>
        
        {/* Governance notice */}
        <div className="mt-6 rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
          <p className="font-medium">⚠️ This is structured information, not a recommendation.</p>
          <p className="mt-1">
            Decision responsibility lies with the user/organization. 
            This system provides data-driven answers to specific questions.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

interface MetricCardProps {
  label: string;
  value: string | number;
  subtext: string;
  variant?: 'default' | 'warning' | 'error';
}

function MetricCard({ label, value, subtext, variant = 'default' }: MetricCardProps) {
  return (
    <div className={cn(
      "rounded-lg border p-3",
      variant === 'warning' && "border-yellow-500/30 bg-yellow-500/5",
      variant === 'error' && "border-red-500/30 bg-red-500/5"
    )}>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={cn(
        "text-2xl font-bold",
        variant === 'warning' && "text-yellow-600",
        variant === 'error' && "text-red-600"
      )}>
        {value}
      </div>
      <div className="text-xs text-muted-foreground">{subtext}</div>
    </div>
  );
}

interface NodeRowProps {
  node: DecisionNode;
  onClick?: () => void;
}

function NodeRow({ node, onClick }: NodeRowProps) {
  const StatusIcon = {
    resolved: CheckCircle,
    unresolved: AlertCircle,
    insufficient_data: XCircle,
  }[node.status];
  
  const statusColor = {
    resolved: 'text-green-600',
    unresolved: 'text-yellow-600',
    insufficient_data: 'text-red-600',
  }[node.status];

  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-muted/50"
    >
      <StatusIcon className={cn("h-5 w-5 shrink-0", statusColor)} />
      
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">{node.question}</div>
        {node.answer_summary && (
          <div className="text-sm text-muted-foreground truncate">
            {node.answer_summary}
          </div>
        )}
      </div>
      
      {node.confidence !== undefined && node.status === 'resolved' && (
        <Badge variant={node.confidence >= 0.7 ? 'default' : 'secondary'}>
          {Math.round(node.confidence * 100)}%
        </Badge>
      )}
      
      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
    </button>
  );
}

export default DecisionOverview;
