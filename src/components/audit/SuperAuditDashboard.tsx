/**
 * Super Audit Dashboard
 * 
 * Displays results from POST-ACQUISITION GOD MODE audit
 * No praise. No marketing language. No ego. Only reality.
 */

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { AlertTriangle, CheckCircle, XCircle, Trash2, Minimize2, Lock, Shield } from 'lucide-react';

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

interface AuditOutput {
  runId: string;
  timestamp: string;
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
}

export function SuperAuditDashboard() {
  const [auditData, setAuditData] = useState<AuditOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const severityColors = {
    critical: 'bg-red-500/20 text-red-400 border-red-500/30',
    high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    low: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">🧠 Super Audit</h1>
        <p className="text-muted-foreground">
          POST-ACQUISITION GOD MODE — No praise. No ego. Only reality.
        </p>
      </div>

      {/* Run Button */}
      <Button 
        onClick={runAudit} 
        disabled={loading}
        className="bg-primary hover:bg-primary/90"
      >
        {loading ? 'Running Audit...' : 'Run God Mode Audit'}
      </Button>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
          {error}
        </div>
      )}

      {auditData && (
        <div className="space-y-6">
          {/* Overall Score */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Final Assessment</span>
                <Badge 
                  variant="outline" 
                  className={cn(
                    auditData.finalQuestion.answer === 'yes' 
                      ? 'bg-green-500/20 text-green-400' 
                      : auditData.finalQuestion.answer === 'qualified_yes'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-red-500/20 text-red-400'
                  )}
                >
                  {auditData.overallScore.toFixed(0)}%
                </Badge>
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
                    <XCircle className="h-5 w-5 text-red-400" />
                  )}
                  <span className="font-medium uppercase">{auditData.finalQuestion.answer.replace('_', ' ')}</span>
                </div>
                <p className="text-muted-foreground">{auditData.finalQuestion.reasoning}</p>
              </div>
            </CardContent>
          </Card>

          {/* Action Lists */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* To Delete */}
            <Card className="border-red-500/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Trash2 className="h-4 w-4 text-red-400" />
                  To Delete ({auditData.toDelete.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 text-sm">
                  {auditData.toDelete.map((item, i) => (
                    <li key={i} className="text-muted-foreground">– {item}</li>
                  ))}
                  {auditData.toDelete.length === 0 && (
                    <li className="text-green-400">Nothing to delete</li>
                  )}
                </ul>
              </CardContent>
            </Card>

            {/* To Simplify */}
            <Card className="border-yellow-500/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Minimize2 className="h-4 w-4 text-yellow-400" />
                  To Simplify ({auditData.toSimplify.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 text-sm">
                  {auditData.toSimplify.map((item, i) => (
                    <li key={i} className="text-muted-foreground">– {item}</li>
                  ))}
                  {auditData.toSimplify.length === 0 && (
                    <li className="text-green-400">Nothing to simplify</li>
                  )}
                </ul>
              </CardContent>
            </Card>

            {/* Never Change */}
            <Card className="border-green-500/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lock className="h-4 w-4 text-green-400" />
                  Never Change ({auditData.neverChange.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 text-sm">
                  {auditData.neverChange.map((item, i) => (
                    <li key={i} className="text-muted-foreground">– {item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* New Constraints */}
            <Card className="border-blue-500/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-400" />
                  New Constraints ({auditData.newConstraints.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 text-sm">
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

          {/* Detailed Audit Results */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Detailed Audit Results</h2>
            
            {auditData.auditResults.map((result, i) => (
              <Card key={i} className={cn(
                'border-border/50',
                result.passed ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-red-500'
              )}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span>{result.auditType.replace(/_/g, ' ')}</span>
                    <Badge variant="outline" className={cn(
                      result.score >= 80 ? 'bg-green-500/20 text-green-400' :
                      result.score >= 60 ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    )}>
                      {result.score}%
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {result.findings.length > 0 ? (
                    <div className="space-y-2">
                      {result.findings.map((finding, j) => (
                        <div 
                          key={j} 
                          className={cn(
                            'p-3 rounded-lg border text-sm',
                            severityColors[finding.severity]
                          )}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="font-medium">{finding.description}</span>
                              {finding.location && (
                                <span className="text-xs ml-2 opacity-70">@ {finding.location}</span>
                              )}
                            </div>
                            <Badge variant="outline" className="text-xs shrink-0">
                              {finding.suggestedAction}
                            </Badge>
                          </div>
                          {finding.details && (
                            <p className="mt-1 text-xs opacity-80">{finding.details}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-green-400 text-sm">✓ No issues found</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Metadata */}
          <div className="text-xs text-muted-foreground border-t border-border/50 pt-4">
            <p>Run ID: {auditData.runId}</p>
            <p>Timestamp: {new Date(auditData.timestamp).toLocaleString()}</p>
            <p>Total Findings: {auditData.totalFindings} | Critical: {auditData.criticalFindings}</p>
          </div>
        </div>
      )}
    </div>
  );
}
