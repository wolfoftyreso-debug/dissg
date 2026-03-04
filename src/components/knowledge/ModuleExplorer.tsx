import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Database, Brain, Lightbulb, Search, AlertTriangle, CheckCircle2,
  XCircle, HelpCircle, ArrowRight, Layers, Link2, BarChart3,
  ShieldAlert, TrendingUp, Beaker,
} from 'lucide-react';
import {
  NUTRITION_MODULE,
  NUTRITION_SEED_OBSERVATIONS,
  NUTRITION_SEED_CLAIMS,
  NUTRITION_SEED_RANKING,
  NUTRITION_CROSS_MODULE,
  NUTRITION_ONTOLOGY,
} from '@/core/knowledge-engine/modules/nutrition';
import { evaluateEvidence, resolveClaimStatus, detectConflicts } from '@/core/knowledge-engine/claim-engine';
import { runFullMetaAnalysis } from '@/core/knowledge-engine/meta-engine';
import type { KnowledgeModule, DomainObservation, KnowledgeClaim, EvidenceLink } from '@/core/knowledge-engine/types';

const CLAIM_STATUS_COLORS: Record<string, string> = {
  supported: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  contested: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  proposed: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  refuted: 'bg-red-500/10 text-red-400 border-red-500/30',
  under_review: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  superseded: 'bg-muted text-muted-foreground border-border',
};

const QUALITY_COLORS: Record<string, string> = {
  very_high: 'text-emerald-400',
  high: 'text-green-400',
  moderate: 'text-amber-400',
  low: 'text-orange-400',
  very_low: 'text-red-400',
};

export function ModuleExplorer() {
  const [activeTab, setActiveTab] = useState('overview');
  const module = NUTRITION_MODULE as KnowledgeModule & { id: string };

  // Run meta analysis on seed data
  const mockModule = { ...NUTRITION_MODULE, id: 'nutrition-v1' } as KnowledgeModule;
  const mockObs = NUTRITION_SEED_OBSERVATIONS.map((o, i) => ({ ...o, id: `obs-${i}`, module_id: 'nutrition-v1' })) as DomainObservation[];
  const mockClaims = NUTRITION_SEED_CLAIMS.map((c, i) => ({ ...c, id: `clm-${i}`, module_id: 'nutrition-v1', supporting_evidence: [], contradicting_evidence: [] })) as KnowledgeClaim[];
  const metaResults = runFullMetaAnalysis(mockModule, mockObs, mockClaims, []);
  const conflicts = detectConflicts(mockClaims);

  return (
    <div className="min-h-screen bg-background text-foreground p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Layers className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Knowledge Modules</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Triple-layer kunskapsarkitektur: Observation → Claim → Decision. 
            Varje modul följer strikt lager-separation för skalbar evidenshantering.
          </p>
        </div>
        <Badge variant="outline" className="text-xs font-mono">
          Architecture v1.0
        </Badge>
      </div>

      {/* Architecture diagram */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { icon: Database, label: 'Data Layer', desc: 'Råa observationer', count: NUTRITION_SEED_OBSERVATIONS.length, color: 'text-blue-400' },
          { icon: Brain, label: 'Knowledge Layer', desc: 'Evidens-graderade claims', count: NUTRITION_SEED_CLAIMS.length, color: 'text-purple-400' },
          { icon: Lightbulb, label: 'Intelligence Layer', desc: 'Interventionsranking', count: NUTRITION_SEED_RANKING.interventions.length, color: 'text-amber-400' },
          { icon: Search, label: 'Meta Layer', desc: 'Självanalys', count: metaResults.reduce((s, m) => s + m.findings.length, 0), color: 'text-red-400' },
        ].map(({ icon: Icon, label, desc, count, color }) => (
          <Card key={label} className="bg-card border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <Icon className={`h-8 w-8 ${color} shrink-0`} />
              <div>
                <p className="font-semibold text-sm">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
                <p className="text-lg font-bold mt-1">{count}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Module card */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">{NUTRITION_MODULE.name}</CardTitle>
              <CardDescription className="mt-1">{NUTRITION_MODULE.description}</CardDescription>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="font-mono text-xs">{NUTRITION_MODULE.module_code}</Badge>
              <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                {NUTRITION_MODULE.status}
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Tab content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="overview">Översikt</TabsTrigger>
          <TabsTrigger value="observations">Observationer</TabsTrigger>
          <TabsTrigger value="claims">Claims</TabsTrigger>
          <TabsTrigger value="intelligence">Intelligence</TabsTrigger>
          <TabsTrigger value="meta">Meta-analys</TabsTrigger>
          <TabsTrigger value="cross">Korsmoduler</TabsTrigger>
        </TabsList>

        {/* OVERVIEW */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-card border-border">
              <CardHeader><CardTitle className="text-sm">Domänontologi</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Entiteter</p>
                  <div className="flex flex-wrap gap-1">
                    {NUTRITION_ONTOLOGY.entities.map(e => (
                      <Badge key={e.code} variant="outline" className="text-xs">
                        {e.name}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Variabler</p>
                  <div className="space-y-1">
                    {NUTRITION_ONTOLOGY.variables.map(v => (
                      <div key={v.code} className="flex items-center justify-between text-xs">
                        <span>{v.name}</span>
                        <span className="text-muted-foreground font-mono">{v.unit}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Datakällor</p>
                  <div className="space-y-1">
                    {NUTRITION_ONTOLOGY.data_sources.map(s => (
                      <div key={s.code} className="flex items-center justify-between text-xs">
                        <span>{s.name}</span>
                        <Badge variant="outline" className="text-[10px]">Tier {s.reliability_tier}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader><CardTitle className="text-sm">Evidensfördelning</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {(['supported', 'contested', 'proposed', 'refuted'] as const).map(status => {
                  const count = NUTRITION_SEED_CLAIMS.filter(c => c.status === status).length;
                  return (
                    <div key={status} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="capitalize">{status}</span>
                        <span>{count} / {NUTRITION_SEED_CLAIMS.length}</span>
                      </div>
                      <Progress value={(count / NUTRITION_SEED_CLAIMS.length) * 100} className="h-2" />
                    </div>
                  );
                })}
                <Separator />
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• Genomsnittlig konfidensgrad: {(NUTRITION_SEED_CLAIMS.reduce((s, c) => s + c.confidence_score, 0) / NUTRITION_SEED_CLAIMS.length).toFixed(2)}</p>
                  <p>• Konflikter detekterade: {conflicts.length}</p>
                  <p>• Meta-varningar: {metaResults.reduce((s, m) => s + m.findings.length, 0)}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* OBSERVATIONS */}
        <TabsContent value="observations">
          <ScrollArea className="h-[600px]">
            <div className="space-y-3">
              {NUTRITION_SEED_OBSERVATIONS.map((obs, i) => (
                <Card key={i} className="bg-card border-border">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Database className="h-4 w-4 text-blue-400" />
                        <span className="font-mono text-xs text-muted-foreground">{obs.observation_code}</span>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-[10px]">{obs.source_type}</Badge>
                        {obs.is_replicated && <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[10px]">Replicated ×{obs.replication_count}</Badge>}
                      </div>
                    </div>
                    <p className="text-sm mb-2">{obs.source_reference}</p>
                    <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                      <div>
                        <span className="block text-foreground font-medium">Population</span>
                        {obs.population_descriptor || 'N/A'}
                        {obs.population_size && <span className="ml-1">(n={obs.population_size.toLocaleString()})</span>}
                      </div>
                      <div>
                        <span className="block text-foreground font-medium">Effect Size</span>
                        {obs.effect_size !== undefined ? obs.effect_size.toFixed(2) : 'N/A'}
                        {obs.p_value && <span className="ml-1">(p={obs.p_value})</span>}
                      </div>
                      <div>
                        <span className="block text-foreground font-medium">Geo</span>
                        {obs.geo_scope} {obs.geo_code && `(${obs.geo_code})`}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* CLAIMS */}
        <TabsContent value="claims">
          <ScrollArea className="h-[600px]">
            <div className="space-y-3">
              {NUTRITION_SEED_CLAIMS.map((claim, i) => (
                <Card key={i} className="bg-card border-border">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Brain className="h-4 w-4 text-purple-400" />
                        <span className="font-mono text-xs text-muted-foreground">{claim.claim_code}</span>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={`text-[10px] border ${CLAIM_STATUS_COLORS[claim.status]}`}>
                          {claim.status}
                        </Badge>
                        <Badge variant="outline" className={`text-[10px] ${QUALITY_COLORS[claim.evidence_quality]}`}>
                          {claim.evidence_quality}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm font-medium mb-1">{claim.statement}</p>
                    {claim.statement_sv && (
                      <p className="text-xs text-muted-foreground italic mb-3">{claim.statement_sv}</p>
                    )}
                    
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-1 text-xs">
                        <BarChart3 className="h-3 w-3" />
                        <span>Konfidensgrad: {(claim.confidence_score * 100).toFixed(0)}%</span>
                      </div>
                      {claim.effect_size !== undefined && (
                        <div className="flex items-center gap-1 text-xs">
                          <TrendingUp className="h-3 w-3" />
                          <span>Effektstorlek: {claim.effect_size} {claim.effect_size_unit}</span>
                        </div>
                      )}
                    </div>

                    {claim.uncertainty_description && (
                      <div className="bg-muted/50 rounded p-2 mb-2">
                        <p className="text-xs flex items-start gap-1">
                          <AlertTriangle className="h-3 w-3 text-amber-400 mt-0.5 shrink-0" />
                          <span className="text-muted-foreground">{claim.uncertainty_description}</span>
                        </p>
                      </div>
                    )}

                    {claim.limitations.length > 0 && (
                      <div className="text-xs text-muted-foreground space-y-0.5 mt-2">
                        {claim.limitations.map((l, j) => (
                          <p key={j} className="flex items-start gap-1">
                            <span className="text-red-400">•</span> {l}
                          </p>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* INTELLIGENCE */}
        <TabsContent value="intelligence">
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-400" />
                <div>
                  <CardTitle className="text-lg">{NUTRITION_SEED_RANKING.question}</CardTitle>
                  {NUTRITION_SEED_RANKING.question_sv && (
                    <CardDescription className="italic">{NUTRITION_SEED_RANKING.question_sv}</CardDescription>
                  )}
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                <Badge variant="outline" className="font-mono text-[10px]">{NUTRITION_SEED_RANKING.ranking_code}</Badge>
                <Badge variant="outline" className="text-[10px]">
                  Konfidensgrad: {(NUTRITION_SEED_RANKING.confidence_score * 100).toFixed(0)}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {NUTRITION_SEED_RANKING.interventions.map((int, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 border border-border">
                  <div className="text-2xl font-bold text-primary w-8 text-center">#{int.rank}</div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{int.name}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span>Score: {(int.score * 100).toFixed(0)}</span>
                      <span>Effect: {int.effect_size}</span>
                      <span className={QUALITY_COLORS[int.evidence_quality]}>
                        {int.evidence_quality}
                      </span>
                      <span>Applicability: {(int.population_applicability * 100).toFixed(0)}%</span>
                    </div>
                    {int.side_effects.length > 0 && (
                      <p className="text-xs text-amber-400 mt-1">⚠ {int.side_effects.join('; ')}</p>
                    )}
                  </div>
                  <Progress value={int.score * 100} className="w-24 h-2" />
                </div>
              ))}

              <Separator className="my-4" />
              
              <div className="text-xs text-muted-foreground space-y-1">
                <p className="font-medium text-foreground">Vikter:</p>
                {Object.entries(NUTRITION_SEED_RANKING.ranking_criteria).map(([key, val]) => (
                  <p key={key}>• {key.replace(/_/g, ' ')}: {(val * 100).toFixed(0)}%</p>
                ))}
              </div>

              <div className="bg-muted/50 rounded p-3 mt-3">
                <p className="text-xs font-medium text-foreground mb-1 flex items-center gap-1">
                  <ShieldAlert className="h-3 w-3 text-amber-400" /> Begränsningar
                </p>
                {NUTRITION_SEED_RANKING.limitations.map((l, i) => (
                  <p key={i} className="text-xs text-muted-foreground">• {l}</p>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* META */}
        <TabsContent value="meta">
          <div className="space-y-3">
            {metaResults.length === 0 ? (
              <Card className="bg-card border-border">
                <CardContent className="p-8 text-center text-muted-foreground">
                  <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-emerald-400" />
                  <p>Inga meta-varningar detekterade</p>
                </CardContent>
              </Card>
            ) : (
              metaResults.map((meta, i) => (
                <Card key={i} className="bg-card border-border">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm capitalize flex items-center gap-2">
                        {meta.severity === 'critical' ? <XCircle className="h-4 w-4 text-red-400" /> : <AlertTriangle className="h-4 w-4 text-amber-400" />}
                        {meta.analysis_type.replace(/_/g, ' ')}
                      </CardTitle>
                      <Badge className={meta.severity === 'critical' ? 'bg-red-500/10 text-red-400 border-red-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'}>
                        {meta.severity}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {meta.findings.map((f, j) => (
                      <div key={j} className="p-2 rounded bg-muted/30 border border-border text-xs">
                        <p className="font-medium text-foreground">{f.title}</p>
                        <p className="text-muted-foreground mt-0.5">{f.description}</p>
                        <p className="text-primary mt-1">→ {f.suggested_action}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* CROSS-MODULE */}
        <TabsContent value="cross">
          <div className="space-y-3">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Link2 className="h-4 w-4 text-primary" />
                  Korsmodulvariabler
                </CardTitle>
                <CardDescription>
                  Delade variabler mellan nutrition och andra domäner: {NUTRITION_MODULE.cross_module_links.join(', ')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {NUTRITION_CROSS_MODULE.map((v, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border">
                    <div>
                      <p className="text-sm font-medium">{v.variable_name.replace(/_/g, ' ')}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{v.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px] capitalize">{v.relationship_type.replace(/_/g, ' ')}</Badge>
                      <div className="text-xs text-muted-foreground">
                        Styrka: {(v.strength * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-sm">Ontologirelationer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {NUTRITION_ONTOLOGY.relationships.map((r, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <Badge variant="outline" className="text-[10px] font-mono">{r.source}</Badge>
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">{r.type.replace(/_/g, ' ')}</span>
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                      <Badge variant="outline" className="text-[10px] font-mono">{r.target}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
