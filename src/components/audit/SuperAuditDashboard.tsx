/**
 * Super Audit Dashboard V2
 * 
 * POST-ACQUISITION GOD MODE — 10 Audit Dimensions
 * No praise. No marketing language. No ego. Only reality.
 */

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import {
  AlertTriangle, CheckCircle, XCircle, Trash2, Minimize2,
  Lock, Shield, Activity, GitBranch, Target, Brain,
  TrendingDown, BarChart3, Loader2
} from 'lucide-react';

interface AuditFinding {
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  description: string;
  location?: string;
  suggestedAction: 'delete' | 'simplify' | 'preserve' | 'constrain';
  details?: string;
}

interface AuditResult {
  auditType: string;
  passed: boolean;
  score: number;
  findings: AuditFinding[];
  recommendations: string[];
  timestamp: string;
}

interface SystemMetrics {
  totalKpis: number;
  totalObservations: number;
  totalQuestions: number;
  totalFacts: number;
  causalGraphs: number;
  causalNodes: number;
  causalEdges: number;
  predictions: number;
  assignments: number;
  auditDimensions: number;
}

interface AuditOutput {
  runId: string;
  timestamp: string;
  version: number;
  toDelete: string[];
  toSimplify: string[];
  neverChange: string[];
  newConstraints: string[];
  auditResults: AuditResult[];
  finalQuestion: {
    question: string;
    answer: 'yes' | 'qualified_yes' | 'no';
    reasoning: string;
  };
  overallScore: number;
  totalFindings: number;
  criticalFindings: number;
  systemMetrics?: SystemMetrics;
}

const AUDIT_ICONS: Record<string, React.ReactNode> = {
  'STRUCTURAL_AUDIT': <GitBranch className="h-4 w-4" />,
  'CLARITY_AUDIT': <Brain className="h-4 w-4" />,
  'DATA_INTEGRITY_AUDIT': <Shield className="h-4 w-4" />,
  'AI_AGENT_AUDIT': <Activity className="h-4 w-4" />,
  'CAUSAL_DAG_AUDIT': <GitBranch className="h-4 w-4" />,
  'CALIBRATION_AUDIT': <Target className="h-4 w-4" />,
  'ACCOUNTABILITY_AUDIT': <BarChart3 className="h-4 w-4" />,
  'POWER_ABUSE_AUDIT': <AlertTriangle className="h-4 w-4" />,
  'SIMPLICITY_AUDIT': <Minimize2 className="h-4 w-4" />,
  'RED_TEAM_AUDIT': <TrendingDown className="h-4 w-4" />,
};

const AUDIT_LABELS: Record<string, string> = {
  'STRUCTURAL_AUDIT': 'Structural',
  'CLARITY_AUDIT': 'Clarity',
  'DATA_INTEGRITY_AUDIT': 'Data Integrity',
  'AI_AGENT_AUDIT': 'AI Agent',
  'CAUSAL_DAG_AUDIT': 'Causal DAG',
  'CALIBRATION_AUDIT': 'Calibration',
  'ACCOUNTABILITY_AUDIT': 'Accountability',
  'POWER_ABUSE_AUDIT': 'Power / Abuse',
  'SIMPLICITY_AUDIT': 'Simplicity',
  'RED_TEAM_AUDIT': 'Red Team',
};

function SeverityBadge({ severity }: { severity: string }) {
  const colors: Record<string, string> = {
    critical: 'bg-destructive/20 text-destructive border-destructive/30',
    high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    low: 'bg-muted text-muted-foreground border-border',
  };
  return (
    <Badge variant="outline" className={cn('text-xs', colors[severity] || colors.low)}>
      {severity}
    </Badge>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 80
    ? 'bg-green-500/20 text-green-400'
    : score >= 60
    ? 'bg-yellow-500/20 text-yellow-400'
    : 'bg-destructive/20 text-destructive';
  return (
    <Badge variant="outline" className={color}>
      {score}%
    </Badge>
  );
}

export function SuperAuditDashboard() {
  const [auditData, setAuditData] = useState<AuditOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedAudit, setExpandedAudit] = useState<string | null>(null);

  async function runAudit() {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: fnError } = await supabase.functions.invoke('super-audit');
      if (fnError) throw fnError;
      setAuditData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Audit failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">🧠 Super Audit V2</h1>
        <p className="text-muted-foreground text-sm">
          POST-ACQUISITION GOD MODE — 10 audit dimensions. No praise. No ego. Only reality.
        </p>
      </div>

      {/* Run Button */}
      <Button 
        onClick={runAudit} 
        disabled={loading}
        className="bg-primary hover:bg-primary/90"
        size="lg"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Running Full Audit...
          </>
        ) : (
          'Run God Mode Audit'
        )}
      </Button>

      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
          {error}
        </div>
      )}

      {auditData && (
        <div className="space-y-6">
          {/* Overall Score & Final Question */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Final Assessment</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">v{auditData.version ?? 1}</span>
                  <ScoreBadge score={auditData.overallScore} />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-lg font-medium">{auditData.finalQuestion.question}</p>
                <div className="flex items-center gap-2">
                  {auditData.finalQuestion.answer === 'yes' ? (
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  ) : auditData.finalQuestion.answer === 'qualified_yes' ? (
                    <AlertTriangle className="h-5 w-5 text-yellow-400" />
                  ) : (
                    <XCircle className="h-5 w-5 text-destructive" />
                  )}
                  <span className="font-medium uppercase">{auditData.finalQuestion.answer.replace('_', ' ')}</span>
                </div>
                <p className="text-muted-foreground text-sm">{auditData.finalQuestion.reasoning}</p>
                <div className="flex gap-6 text-xs text-muted-foreground pt-2 border-t border-border/50">
                  <span>Findings: {auditData.totalFindings}</span>
                  <span className={auditData.criticalFindings > 0 ? 'text-destructive font-medium' : ''}>
                    Critical: {auditData.criticalFindings}
                  </span>
                  <span>Dimensions: {auditData.auditResults.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Metrics */}
          {auditData.systemMetrics && (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                { label: 'KPIs', value: auditData.systemMetrics.totalKpis },
                { label: 'Observations', value: auditData.systemMetrics.totalObservations },
                { label: 'Questions', value: auditData.systemMetrics.totalQuestions },
                { label: 'Causal Nodes', value: auditData.systemMetrics.causalNodes },
                { label: 'Predictions', value: auditData.systemMetrics.predictions },
              ].map(m => (
                <Card key={m.label} className="border-border/30">
                  <CardContent className="p-3 text-center">
                    <div className="text-2xl font-bold">{m.value}</div>
                    <div className="text-xs text-muted-foreground">{m.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Audit Dimension Scores Overview */}
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Audit Dimensions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {auditData.auditResults.map(result => (
                <button
                  key={result.auditType}
                  onClick={() => setExpandedAudit(
                    expandedAudit === result.auditType ? null : result.auditType
                  )}
                  className="w-full text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      'shrink-0',
                      result.passed ? 'text-green-400' : 'text-destructive'
                    )}>
                      {AUDIT_ICONS[result.auditType] || <Shield className="h-4 w-4" />}
                    </span>
                    <span className="text-sm font-medium w-36 shrink-0">
                      {AUDIT_LABELS[result.auditType] || result.auditType}
                    </span>
                    <div className="flex-1">
                      <Progress 
                        value={result.score} 
                        className={cn(
                          'h-2',
                          result.score >= 80 ? '[&>div]:bg-green-500' :
                          result.score >= 60 ? '[&>div]:bg-yellow-500' :
                          '[&>div]:bg-destructive'
                        )}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-10 text-right">{result.score}%</span>
                    <Badge variant="outline" className="text-xs shrink-0">
                      {result.findings.length}
                    </Badge>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Expanded Audit Detail */}
          {expandedAudit && (() => {
            const result = auditData.auditResults.find(r => r.auditType === expandedAudit);
            if (!result) return null;
            return (
              <Card className={cn(
                'border-border/50',
                result.passed ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-destructive'
              )}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {AUDIT_ICONS[result.auditType]}
                      <span>{AUDIT_LABELS[result.auditType] || result.auditType}</span>
                    </div>
                    <ScoreBadge score={result.score} />
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {result.findings.length > 0 ? (
                    result.findings.map((finding, j) => (
                      <div
                        key={j}
                        className={cn(
                          'p-3 rounded-lg border text-sm',
                          finding.severity === 'critical' ? 'bg-destructive/10 border-destructive/30' :
                          finding.severity === 'high' ? 'bg-orange-500/10 border-orange-500/30' :
                          finding.severity === 'medium' ? 'bg-yellow-500/10 border-yellow-500/30' :
                          'bg-muted/50 border-border'
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <SeverityBadge severity={finding.severity} />
                              <span className="font-medium">{finding.description}</span>
                            </div>
                            {finding.location && (
                              <span className="text-xs text-muted-foreground">@ {finding.location}</span>
                            )}
                            {finding.details && (
                              <p className="text-xs text-muted-foreground mt-1">{finding.details}</p>
                            )}
                          </div>
                          <Badge variant="outline" className="text-xs shrink-0 capitalize">
                            {finding.suggestedAction}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-green-400 text-sm">✓ No issues found</p>
                  )}
                  {result.recommendations.length > 0 && (
                    <div className="pt-3 border-t border-border/50">
                      <p className="text-xs font-medium text-muted-foreground mb-2">Recommendations:</p>
                      <ul className="space-y-1">
                        {result.recommendations.map((rec, i) => (
                          <li key={i} className="text-xs text-muted-foreground">→ {rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })()}

          {/* Action Lists */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-destructive/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Trash2 className="h-4 w-4 text-destructive" />
                  To Delete ({auditData.toDelete.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 text-xs">
                  {auditData.toDelete.map((item, i) => (
                    <li key={i} className="text-muted-foreground">– {item}</li>
                  ))}
                  {auditData.toDelete.length === 0 && (
                    <li className="text-green-400">Nothing to delete</li>
                  )}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-yellow-500/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Minimize2 className="h-4 w-4 text-yellow-400" />
                  To Simplify ({auditData.toSimplify.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 text-xs">
                  {auditData.toSimplify.map((item, i) => (
                    <li key={i} className="text-muted-foreground">– {item}</li>
                  ))}
                  {auditData.toSimplify.length === 0 && (
                    <li className="text-green-400">Nothing to simplify</li>
                  )}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-green-500/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Lock className="h-4 w-4 text-green-400" />
                  Never Change ({auditData.neverChange.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 text-xs">
                  {auditData.neverChange.map((item, i) => (
                    <li key={i} className="text-muted-foreground">– {item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-blue-500/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-400" />
                  New Constraints ({auditData.newConstraints.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 text-xs">
                  {auditData.newConstraints.map((item, i) => (
                    <li key={i} className="text-muted-foreground">– {item}</li>
                  ))}
                  {auditData.newConstraints.length === 0 && (
                    <li className="text-green-400">No new constraints needed</li>
                  )}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Metadata */}
          <div className="text-xs text-muted-foreground border-t border-border/50 pt-4 flex flex-wrap gap-4">
            <span>Run ID: {auditData.runId}</span>
            <span>{new Date(auditData.timestamp).toLocaleString()}</span>
            <span>Findings: {auditData.totalFindings}</span>
            <span>Critical: {auditData.criticalFindings}</span>
          </div>
        </div>
      )}
    </div>
  );
}
