import { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Brain, AlertTriangle, Target, Activity, Layers, ArrowRight,
  ShieldAlert, TrendingUp, Database, Eye, Lightbulb, Gauge,
} from 'lucide-react';
import { generateMetaReport } from '@/core/meta-layer';
import { SEVEN_LAYERS, DATA_FLOW, ARCHITECTURE_RULES } from '@/config/sevenLayerArchitecture';
import type { MetaLayerReport, GapSeverity, WeakClaimReason } from '@/core/meta-layer/types';

const severityColor: Record<GapSeverity, string> = {
  critical: 'bg-destructive text-destructive-foreground',
  high: 'bg-orange-500/20 text-orange-700 dark:text-orange-300',
  medium: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300',
  low: 'bg-muted text-muted-foreground',
};

const reasonLabel: Record<WeakClaimReason, string> = {
  low_confidence: 'Low confidence',
  few_sources: 'Few sources',
  unresolved_conflict: 'Unresolved conflict',
  stale_evidence: 'Stale evidence',
  narrow_population: 'Narrow population',
};

const layerIcons = [Database, ArrowRight, Eye, Lightbulb, ShieldAlert, Brain, Gauge];

export function MetaLayerDashboard() {
  const [activeTab, setActiveTab] = useState('health');
  const report: MetaLayerReport = useMemo(() => generateMetaReport(), []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Meta Layer — System Intelligence
        </h1>
        <p className="text-muted-foreground mt-1">
          Layer 7: Self-analysis of the entire knowledge system
        </p>
      </div>

      {/* Recommendations */}
      {report.recommendations.length > 0 && (
        <div className="space-y-2">
          {report.recommendations.map((rec, i) => (
            <Alert key={i} variant={rec.startsWith('CRITICAL') ? 'destructive' : 'default'}>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>{rec.startsWith('CRITICAL') ? 'Critical' : 'Recommendation'}</AlertTitle>
              <AlertDescription>{rec}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="health"><Activity className="h-4 w-4 mr-1" /> Health</TabsTrigger>
          <TabsTrigger value="gaps"><Target className="h-4 w-4 mr-1" /> Gaps</TabsTrigger>
          <TabsTrigger value="weak"><AlertTriangle className="h-4 w-4 mr-1" /> Weak Claims</TabsTrigger>
          <TabsTrigger value="priorities"><TrendingUp className="h-4 w-4 mr-1" /> Priorities</TabsTrigger>
          <TabsTrigger value="architecture"><Layers className="h-4 w-4 mr-1" /> Architecture</TabsTrigger>
        </TabsList>

        {/* HEALTH TAB */}
        <TabsContent value="health" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard label="Total Claims" value={report.health.total_claims} />
            <MetricCard label="Avg Confidence" value={`${(report.health.avg_claim_confidence * 100).toFixed(0)}%`} />
            <MetricCard label="Evidence Links" value={report.health.total_evidence_links} />
            <MetricCard label="Open Gaps" value={report.health.open_knowledge_gaps} alert={report.health.open_knowledge_gaps > 3} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader><CardTitle className="text-sm">Domain Coverage</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {['health', 'psychology', 'economics', 'environment', 'society', 'education', 'governance', 'technology'].map(domain => {
                    const covered = report.health.domains_covered.includes(domain);
                    const hasGap = report.health.domains_with_gaps.includes(domain);
                    return (
                      <div key={domain} className="flex items-center justify-between">
                        <span className="text-sm capitalize text-foreground">{domain}</span>
                        <Badge variant={covered ? (hasGap ? 'secondary' : 'default') : 'destructive'}>
                          {covered ? (hasGap ? 'Partial' : 'Covered') : 'Missing'}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-sm">System Quality</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <QualityBar label="Source Freshness" value={report.health.source_freshness_score * 100} />
                <QualityBar label="Claim Confidence" value={report.health.avg_claim_confidence * 100} />
                <QualityBar label="Conflict Resolution" value={report.health.unresolved_conflicts === 0 ? 100 : Math.max(0, 100 - report.health.unresolved_conflicts * 15)} />
                <QualityBar label="Coverage Breadth" value={(report.health.domains_covered.length / 8) * 100} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* GAPS TAB */}
        <TabsContent value="gaps">
          <ScrollArea className="h-[600px]">
            <div className="space-y-3">
              {report.top_gaps.map(gap => (
                <Card key={gap.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={severityColor[gap.severity]}>{gap.severity}</Badge>
                          <span className="text-xs text-muted-foreground capitalize">{gap.domain}</span>
                        </div>
                        <p className="text-sm text-foreground">{gap.description}</p>
                        {gap.suggested_sources.length > 0 && (
                          <div className="mt-2">
                            <span className="text-xs text-muted-foreground">Suggested sources: </span>
                            <span className="text-xs text-foreground">{gap.suggested_sources.join(', ')}</span>
                          </div>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-2xl font-bold text-foreground">{gap.potential_impact_score}</div>
                        <div className="text-xs text-muted-foreground">Impact</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {report.top_gaps.length === 0 && (
                <p className="text-muted-foreground text-center py-8">No knowledge gaps detected ✓</p>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* WEAK CLAIMS TAB */}
        <TabsContent value="weak">
          <ScrollArea className="h-[600px]">
            <div className="space-y-3">
              {report.weakest_claims.map(wc => (
                <Card key={wc.claim_id}>
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-mono text-foreground">{wc.claim_statement}</p>
                        <div className="flex gap-1 mt-2 flex-wrap">
                          {wc.reasons.map(r => (
                            <Badge key={r} variant="outline" className="text-xs">{reasonLabel[r]}</Badge>
                          ))}
                        </div>
                        <ul className="mt-2 space-y-1">
                          {wc.improvement_suggestions.map((s, i) => (
                            <li key={i} className="text-xs text-muted-foreground">→ {s}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-2xl font-bold text-foreground">{(wc.confidence_score * 100).toFixed(0)}%</div>
                        <div className="text-xs text-muted-foreground">Confidence</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {report.weakest_claims.length === 0 && (
                <p className="text-muted-foreground text-center py-8">All claims are above threshold ✓</p>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* PRIORITIES TAB */}
        <TabsContent value="priorities">
          <ScrollArea className="h-[600px]">
            <div className="space-y-3">
              {report.research_priorities.map((rp, i) => (
                <Card key={rp.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-4">
                      <div className="text-2xl font-bold text-muted-foreground w-8">#{i + 1}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant={rp.priority === 'urgent' ? 'destructive' : 'default'}>
                            {rp.priority}
                          </Badge>
                          <span className="text-xs text-muted-foreground capitalize">{rp.domain}</span>
                        </div>
                        <p className="text-sm text-foreground">{rp.question}</p>
                        <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                          <span>Impact: {rp.impact_score}</span>
                          <span>Feasibility: {rp.feasibility_score}</span>
                          <span>Combined: {rp.combined_score.toFixed(0)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* ARCHITECTURE TAB */}
        <TabsContent value="architecture" className="space-y-6">
          {/* 7-Layer Overview */}
          <Card>
            <CardHeader>
              <CardTitle>7-Layer Knowledge Intelligence Architecture</CardTitle>
              <CardDescription>Master standard for all knowledge modules</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {SEVEN_LAYERS.map((layer, i) => {
                  const Icon = layerIcons[i] || Layers;
                  return (
                    <div key={layer.code} className="border border-border rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Icon className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{layer.number}. {layer.name}</h3>
                          <p className="text-xs text-muted-foreground">{layer.code}</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{layer.purpose}</p>
                      <div className="bg-muted/50 rounded p-2">
                        <p className="text-xs font-medium text-foreground">Principle: {layer.principle}</p>
                      </div>
                      {layer.existingImplementation.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {layer.existingImplementation.map(impl => (
                            <Badge key={impl} variant="outline" className="text-xs">{impl}</Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Data Flow */}
          <Card>
            <CardHeader>
              <CardTitle>Data Flow</CardTitle>
              <CardDescription>How data moves between layers (cyclic — Meta feeds back to Source)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {DATA_FLOW.map((flow, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <Badge variant="outline">{flow.from}</Badge>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <Badge variant="outline">{flow.to}</Badge>
                    <span className="text-xs text-muted-foreground flex-1">{flow.description}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Rules */}
          <Card>
            <CardHeader>
              <CardTitle>Architecture Integrity Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(ARCHITECTURE_RULES).map(([key, rule]) => (
                  <div key={key} className="flex gap-2 text-sm">
                    <ShieldAlert className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span className="text-foreground">{rule}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MetricCard({ label, value, alert }: { label: string; value: string | number; alert?: boolean }) {
  return (
    <Card className={alert ? 'border-destructive' : ''}>
      <CardContent className="pt-4">
        <div className="text-2xl font-bold text-foreground">{value}</div>
        <div className="text-xs text-muted-foreground">{label}</div>
      </CardContent>
    </Card>
  );
}

function QualityBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-foreground">{label}</span>
        <span className="text-muted-foreground">{value.toFixed(0)}%</span>
      </div>
      <Progress value={value} className="h-2" />
    </div>
  );
}
