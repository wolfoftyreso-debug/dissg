import { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Globe, AlertTriangle, Zap, TrendingUp, BookOpen, Shield,
  ArrowRight, ChevronDown, ChevronUp, Link2, Eye, Activity,
  Users, Target, Heart, Leaf, GraduationCap, DollarSign,
  Factory, Scale,
} from 'lucide-react';
import {
  SEED_PROBLEMS, SEED_INTERVENTIONS, SEED_CAUSAL_LINKS,
  SEED_SOURCES, SEED_VARIABLES, SEED_CLAIMS,
} from '@/core/gdis';
import { rankInterventionsForProblem } from '@/core/gdis/engine';
import type { GlobalProblem, VariableDomain } from '@/core/gdis';

// ─── Helpers ───

const DOMAIN_ICONS: Record<VariableDomain, any> = {
  health: Heart, climate: Leaf, economy: DollarSign,
  education: GraduationCap, environment: Factory,
  governance: Scale, security: Shield,
};

const SEVERITY_COLORS: Record<string, string> = {
  critical: 'bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/20',
  severe: 'bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/20',
  moderate: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-300 border-yellow-500/20',
  emerging: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20',
};

function formatNumber(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(0)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toString();
}

function StatCard({ icon: Icon, label, value, sub }: { icon: any; label: string; value: string | number; sub?: string }) {
  return (
    <Card>
      <CardContent className="pt-4 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10"><Icon className="h-5 w-5 text-primary" /></div>
          <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-xl font-bold">{value}</p>
            {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Problem Map Tab ───

function ProblemMapTab() {
  const [selected, setSelected] = useState<GlobalProblem | null>(null);
  const sorted = [...SEED_PROBLEMS].sort((a, b) => b.dalysOrEquivalent - a.dalysOrEquivalent);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={AlertTriangle} label="Global Problems" value={SEED_PROBLEMS.length} />
        <StatCard icon={Users} label="People Affected" value={formatNumber(SEED_PROBLEMS.reduce((s, p) => s + p.populationAffected, 0))} />
        <StatCard icon={Activity} label="Critical" value={SEED_PROBLEMS.filter(p => p.severity === 'critical').length} />
        <StatCard icon={TrendingUp} label="Worsening" value={SEED_PROBLEMS.filter(p => p.trendDirection === 'worsening').length} />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="md:col-span-1">
          <CardHeader className="pb-2"><CardTitle className="text-sm">Problems by DALYs</CardTitle></CardHeader>
          <CardContent className="p-2">
            <ScrollArea className="h-[450px]">
              {sorted.map(p => {
                const Icon = DOMAIN_ICONS[p.domain] || Globe;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelected(p)}
                    className={`w-full text-left p-3 rounded-lg mb-1 transition-colors ${selected?.id === p.id ? 'bg-primary/10 border border-primary/30' : 'hover:bg-muted'}`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-primary shrink-0" />
                      <span className="text-sm font-medium">{p.title}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 ml-6">
                      <Badge className={`text-xs border ${SEVERITY_COLORS[p.severity]}`}>{p.severity}</Badge>
                      <span className="text-xs text-muted-foreground">{formatNumber(p.populationAffected)} affected</span>
                    </div>
                  </button>
                );
              })}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">{selected ? selected.title : 'Select a problem'}</CardTitle>
          </CardHeader>
          <CardContent>
            {selected ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">{selected.description}</p>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-muted/30 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Population Affected</p>
                    <p className="text-lg font-bold">{formatNumber(selected.populationAffected)}</p>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">DALYs / Equivalent</p>
                    <p className="text-lg font-bold">{formatNumber(selected.dalysOrEquivalent)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Trend:</span>
                  <Badge variant="outline" className="text-xs">{selected.trendDirection}</Badge>
                  <span className="text-xs text-muted-foreground">Scope:</span>
                  <Badge variant="outline" className="text-xs">{selected.geographicScope}</Badge>
                </div>

                <Separator />

                <div>
                  <p className="text-sm font-medium mb-2">Available Interventions</p>
                  {SEED_INTERVENTIONS.filter(i => i.targetProblems.includes(selected.id)).map(i => (
                    <div key={i.id} className="flex items-center gap-2 py-1.5 border-b last:border-0">
                      <Zap className="h-3 w-3 text-primary shrink-0" />
                      <span className="text-sm">{i.name}</span>
                      <Badge variant="outline" className="text-xs ml-auto">{i.status}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-12">← Select a problem to see details</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ─── Intervention Library Tab ───

function InterventionLibraryTab() {
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = SEED_INTERVENTIONS.filter(i =>
    !search || i.name.toLowerCase().includes(search.toLowerCase()) || i.domain.includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={Zap} label="Interventions" value={SEED_INTERVENTIONS.length} />
        <StatCard icon={Shield} label="Proven" value={SEED_INTERVENTIONS.filter(i => i.status === 'proven').length} />
        <StatCard icon={Globe} label="Global Scale" value={SEED_INTERVENTIONS.filter(i => i.scalability === 'global').length} />
        <StatCard icon={BookOpen} label="Domains" value={new Set(SEED_INTERVENTIONS.map(i => i.domain)).size} />
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Intervention Library</CardTitle>
          <Input placeholder="Search interventions..." value={search} onChange={e => setSearch(e.target.value)} className="h-8 text-sm mt-2" />
        </CardHeader>
        <CardContent className="p-0">
          {filtered.map(int => {
            const Icon = DOMAIN_ICONS[int.domain] || Globe;
            return (
              <div key={int.id}>
                <button
                  onClick={() => setExpanded(expanded === int.id ? null : int.id)}
                  className="w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 text-primary shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{int.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">{int.status}</Badge>
                        <Badge variant="outline" className="text-xs">{int.costLevel} cost</Badge>
                        <Badge variant="outline" className="text-xs">{int.scalability}</Badge>
                      </div>
                    </div>
                    {expanded === int.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                </button>
                {expanded === int.id && (
                  <div className="px-4 pb-4 bg-muted/30 space-y-3">
                    <p className="text-sm text-muted-foreground">{int.description}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                      <div><span className="text-muted-foreground">Effect:</span> <span className="font-medium">{int.effectSize}</span></div>
                      <div><span className="text-muted-foreground">Time:</span> <span className="font-medium">{int.timeToEffect}</span></div>
                      <div><span className="text-muted-foreground">Evidence:</span> <span className="font-medium">{int.evidenceGrade}</span></div>
                      <div><span className="text-muted-foreground">Population:</span> <span className="font-medium">{int.population}</span></div>
                    </div>
                    {int.implementationBarriers.length > 0 && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Barriers:</p>
                        <div className="flex flex-wrap gap-1">
                          {int.implementationBarriers.map(b => <Badge key={b} variant="outline" className="text-xs">{b}</Badge>)}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <Separator />
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Priority Engine Tab ───

function PriorityEngineTab() {
  const [selectedProblem, setSelectedProblem] = useState(SEED_PROBLEMS[0]);
  const ranked = useMemo(() => rankInterventionsForProblem(SEED_INTERVENTIONS, selectedProblem.id), [selectedProblem]);
  const maxScore = ranked[0]?.priorityScore || 1;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Select Problem to Prioritize</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {SEED_PROBLEMS.map(p => (
              <Button
                key={p.id}
                variant={selectedProblem.id === p.id ? 'default' : 'outline'}
                size="sm"
                className="text-xs"
                onClick={() => setSelectedProblem(p)}
              >{p.title}</Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">
            Ranked Interventions for: {selectedProblem.title}
          </CardTitle>
          <CardDescription className="text-xs">
            Score = (Impact × Evidence × Scalability × Cost⁻¹) / 1000
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {ranked.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">No interventions target this problem</p>
          )}
          {ranked.map(s => (
            <div key={s.interventionId} className="px-4 py-3 border-b last:border-0">
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-primary w-8">#{s.rank}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{s.interventionName}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.rationale}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">{s.priorityScore}</p>
                  <Progress value={(s.priorityScore / maxScore) * 100} className="w-20 h-1.5 mt-1" />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2 mt-2 ml-11">
                {(['impact', 'cost', 'evidence', 'scalability'] as const).map(dim => (
                  <div key={dim}>
                    <p className="text-xs text-muted-foreground capitalize">{dim}</p>
                    <div className="flex items-center gap-1">
                      <Progress value={s[dim] * 10} className="h-1.5 flex-1" />
                      <span className="text-xs font-medium w-5">{s[dim]}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Causal Network Tab ───

function CausalNetworkTab() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <StatCard icon={Link2} label="Causal Links" value={SEED_CAUSAL_LINKS.length} />
        <StatCard icon={Globe} label="Cross-domain" value={SEED_CAUSAL_LINKS.filter(l => l.domains.length > 1).length} />
        <StatCard icon={Activity} label="Avg Confidence" value={`${Math.round(SEED_CAUSAL_LINKS.reduce((s, l) => s + l.confidence, 0) / SEED_CAUSAL_LINKS.length * 100)}%`} />
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Causal Links</CardTitle>
          <CardDescription className="text-xs">Cross-domain causal relationships with mechanisms</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {SEED_CAUSAL_LINKS.map(link => (
              <div key={link.id} className="border rounded-lg p-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className="text-xs font-mono">{link.fromVariable}</Badge>
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  <Badge variant="outline" className="text-xs font-mono">{link.toVariable}</Badge>
                  {link.bidirectional && <Badge className="text-xs bg-yellow-500/10 text-yellow-700 dark:text-yellow-300">↔ bidirectional</Badge>}
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">{link.mechanism}</p>
                <div className="flex items-center gap-3 mt-2 text-xs">
                  <span>Strength: <strong>{Math.round(link.strength * 100)}%</strong></span>
                  <span>Confidence: <strong>{Math.round(link.confidence * 100)}%</strong></span>
                  {link.lagMonths && <span>Lag: <strong>{link.lagMonths}mo</strong></span>}
                  <div className="flex gap-1 ml-auto">
                    {link.domains.map(d => <Badge key={d} variant="outline" className="text-xs">{d}</Badge>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Transparency Tab ───

function TransparencyTab() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={Eye} label="Data Sources" value={SEED_SOURCES.length} />
        <StatCard icon={Target} label="Variables" value={SEED_VARIABLES.length} />
        <StatCard icon={BookOpen} label="Claims" value={SEED_CLAIMS.length} />
        <StatCard icon={Shield} label="Avg Reliability" value={`${Math.round(SEED_SOURCES.reduce((s, src) => s + src.reliabilityScore, 0) / SEED_SOURCES.length * 100)}%`} />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Data Sources</CardTitle></CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              {SEED_SOURCES.map(src => (
                <div key={src.id} className="py-2 border-b last:border-0">
                  <p className="text-sm font-medium">{src.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">{src.organization}</Badge>
                    <span className="text-xs text-muted-foreground">Reliability: {Math.round(src.reliabilityScore * 100)}%</span>
                    <span className="text-xs text-muted-foreground">Updated: {src.updateFrequency}</span>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Verified Claims</CardTitle></CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              {SEED_CLAIMS.map(c => (
                <div key={c.id} className="py-2 border-b last:border-0">
                  <p className="text-sm">{c.statement}</p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <Badge variant="outline" className="text-xs">{c.evidenceGrade}</Badge>
                    <span className="text-xs text-muted-foreground">{Math.round(c.confidence * 100)}% confidence</span>
                    <span className="text-xs text-muted-foreground">{c.sourceCount} sources</span>
                    <Badge variant="outline" className="text-xs">Bias: {c.biasRisk}</Badge>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ─── Main Explorer ───

export function GDISExplorer() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Globe className="h-6 w-6 text-primary" />
          Global Decision Intelligence System
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          12-layer architecture: Map problems → Evaluate evidence → Prioritize interventions → Publish transparently
        </p>
      </div>

      {/* Pipeline */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between gap-1 flex-wrap">
            {[
              { label: 'Problems', value: SEED_PROBLEMS.length, icon: AlertTriangle },
              { label: 'Interventions', value: SEED_INTERVENTIONS.length, icon: Zap },
              { label: 'Causal Links', value: SEED_CAUSAL_LINKS.length, icon: Link2 },
              { label: 'Data Sources', value: SEED_SOURCES.length, icon: Eye },
              { label: 'Claims', value: SEED_CLAIMS.length, icon: BookOpen },
            ].map((step, i, arr) => (
              <div key={step.label} className="flex items-center gap-2">
                <div className="text-center">
                  <step.icon className="h-5 w-5 mx-auto text-primary mb-1" />
                  <p className="text-lg font-bold">{step.value}</p>
                  <p className="text-xs text-muted-foreground">{step.label}</p>
                </div>
                {i < arr.length - 1 && <ArrowRight className="h-4 w-4 text-muted-foreground" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="problems" className="space-y-4">
        <TabsList className="grid grid-cols-5 w-full max-w-2xl">
          <TabsTrigger value="problems" className="text-xs">Problems</TabsTrigger>
          <TabsTrigger value="interventions" className="text-xs">Interventions</TabsTrigger>
          <TabsTrigger value="priority" className="text-xs">Priority</TabsTrigger>
          <TabsTrigger value="causal" className="text-xs">Causal</TabsTrigger>
          <TabsTrigger value="transparency" className="text-xs">Transparency</TabsTrigger>
        </TabsList>

        <TabsContent value="problems"><ProblemMapTab /></TabsContent>
        <TabsContent value="interventions"><InterventionLibraryTab /></TabsContent>
        <TabsContent value="priority"><PriorityEngineTab /></TabsContent>
        <TabsContent value="causal"><CausalNetworkTab /></TabsContent>
        <TabsContent value="transparency"><TransparencyTab /></TabsContent>
      </Tabs>
    </div>
  );
}
