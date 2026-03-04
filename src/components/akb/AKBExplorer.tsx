import { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Brain, Search, Zap, BarChart3, Globe, BookOpen,
  TrendingUp, ArrowRight, ChevronDown, ChevronUp,
  FileJson, Target, Layers, Network,
} from 'lucide-react';
import {
  SEED_QUESTION_UNIVERSES,
  SEED_RANKED_INTERVENTIONS,
  SEED_KNOWLEDGE_OBJECTS,
  SEED_KNOWLEDGE_GRAPH,
  SEED_CLAIMS,
} from '@/core/akb';
import type { QuestionUniverse, QuestionCategory, InterventionScore, KnowledgeObject } from '@/core/akb';

// ─── Stat Card ───

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

// ─── Category Badge Colors ───

const CAT_COLORS: Record<QuestionCategory, string> = {
  definition: 'bg-blue-500/10 text-blue-700 dark:text-blue-300',
  comparison: 'bg-purple-500/10 text-purple-700 dark:text-purple-300',
  causal: 'bg-red-500/10 text-red-700 dark:text-red-300',
  practical: 'bg-green-500/10 text-green-700 dark:text-green-300',
  myth: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-300',
  counterfactual: 'bg-orange-500/10 text-orange-700 dark:text-orange-300',
  population: 'bg-teal-500/10 text-teal-700 dark:text-teal-300',
  temporal: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300',
  mechanism: 'bg-pink-500/10 text-pink-700 dark:text-pink-300',
  quantitative: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300',
};

// ─── Question Universe Tab ───

function QuestionUniverseTab() {
  const [selected, setSelected] = useState<QuestionUniverse | null>(null);
  const [catFilter, setCatFilter] = useState<QuestionCategory | 'all'>('all');
  const [search, setSearch] = useState('');

  const filteredQs = useMemo(() => {
    if (!selected) return [];
    return selected.questions.filter(q => {
      if (catFilter !== 'all' && q.category !== catFilter) return false;
      if (search && !q.questionText.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [selected, catFilter, search]);

  const totalGenerated = SEED_QUESTION_UNIVERSES.reduce((s, u) => s + u.totalQuestions, 0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={Search} label="Total Questions" value={totalGenerated} />
        <StatCard icon={Brain} label="Claims Covered" value={SEED_QUESTION_UNIVERSES.length} />
        <StatCard icon={Globe} label="Domains" value={new Set(SEED_QUESTION_UNIVERSES.map(u => u.domain)).size} />
        <StatCard icon={Target} label="Avg Coverage" value={`${Math.round(SEED_QUESTION_UNIVERSES.reduce((s, u) => s + u.coverageScore, 0) / SEED_QUESTION_UNIVERSES.length * 100)}%`} />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {/* Claim list */}
        <Card className="md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Claims → Question Universes</CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <ScrollArea className="h-[400px]">
              {SEED_QUESTION_UNIVERSES.map(u => (
                <button
                  key={u.claimId}
                  onClick={() => { setSelected(u); setCatFilter('all'); setSearch(''); }}
                  className={`w-full text-left p-3 rounded-lg mb-1 transition-colors ${selected?.claimId === u.claimId ? 'bg-primary/10 border border-primary/30' : 'hover:bg-muted'}`}
                >
                  <p className="text-sm font-medium line-clamp-2">{u.claimStatement}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">{u.domain}</Badge>
                    <span className="text-xs text-muted-foreground">{u.totalQuestions} questions</span>
                  </div>
                </button>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Questions */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">
              {selected ? `${selected.totalQuestions} Generated Questions` : 'Select a claim'}
            </CardTitle>
            {selected && (
              <div className="flex flex-wrap gap-1 mt-2">
                <Badge
                  variant={catFilter === 'all' ? 'default' : 'outline'}
                  className="cursor-pointer text-xs"
                  onClick={() => setCatFilter('all')}
                >All</Badge>
                {(Object.keys(CAT_COLORS) as QuestionCategory[]).map(cat => {
                  const count = selected.questions.filter(q => q.category === cat).length;
                  if (count === 0) return null;
                  return (
                    <Badge
                      key={cat}
                      variant={catFilter === cat ? 'default' : 'outline'}
                      className={`cursor-pointer text-xs ${catFilter !== cat ? CAT_COLORS[cat] : ''}`}
                      onClick={() => setCatFilter(cat)}
                    >{cat} ({count})</Badge>
                  );
                })}
              </div>
            )}
          </CardHeader>
          <CardContent className="p-2">
            {selected && (
              <Input
                placeholder="Search questions..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="mb-2 h-8 text-sm"
              />
            )}
            <ScrollArea className="h-[350px]">
              {filteredQs.map(q => (
                <div key={q.id} className="p-2 border-b last:border-0">
                  <p className="text-sm">{q.questionText}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={`text-xs ${CAT_COLORS[q.category]}`}>{q.category}</Badge>
                    <Badge variant="outline" className="text-xs">{q.difficulty}</Badge>
                    <span className="text-xs text-muted-foreground ml-auto">~{q.searchVolEstimate} vol</span>
                  </div>
                </div>
              ))}
              {selected && filteredQs.length === 0 && (
                <p className="text-sm text-muted-foreground p-4 text-center">No matching questions</p>
              )}
              {!selected && (
                <p className="text-sm text-muted-foreground p-4 text-center">← Select a claim to see its question universe</p>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ─── Priority Engine Tab ───

function PriorityEngineTab() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const maxScore = SEED_RANKED_INTERVENTIONS[0]?.priorityScore || 1;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={Zap} label="Interventions Ranked" value={SEED_RANKED_INTERVENTIONS.length} />
        <StatCard icon={TrendingUp} label="Top Score" value={maxScore} />
        <StatCard icon={BarChart3} label="Avg Confidence" value={`${Math.round(SEED_RANKED_INTERVENTIONS.reduce((s, i) => s + i.confidence, 0) / SEED_RANKED_INTERVENTIONS.length * 100)}%`} />
        <StatCard icon={BookOpen} label="Total Evidence" value={SEED_RANKED_INTERVENTIONS.reduce((s, i) => s + i.evidenceCount, 0)} />
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Priority Score = (Impact × Confidence) / Effort</CardTitle>
          <CardDescription className="text-xs">Ranked by actionable potential</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {SEED_RANKED_INTERVENTIONS.map(int => (
            <div key={int.id}>
              <button
                onClick={() => setExpanded(expanded === int.id ? null : int.id)}
                className="w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-primary w-8">#{int.rank}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{int.interventionName}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">{int.domain}</Badge>
                      <span className="text-xs text-muted-foreground">{int.populationScope}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{int.priorityScore}</p>
                    <Progress value={(int.priorityScore / maxScore) * 100} className="w-20 h-1.5 mt-1" />
                  </div>
                  {expanded === int.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </button>
              {expanded === int.id && (
                <div className="px-4 pb-4 grid grid-cols-3 gap-4 bg-muted/30">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Impact</p>
                    <div className="flex items-center gap-2">
                      <Progress value={int.impact * 10} className="h-2 flex-1" />
                      <span className="text-sm font-medium">{int.impact}/10</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Effort</p>
                    <div className="flex items-center gap-2">
                      <Progress value={int.effort * 10} className="h-2 flex-1" />
                      <span className="text-sm font-medium">{int.effort}/10</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Confidence</p>
                    <div className="flex items-center gap-2">
                      <Progress value={int.confidence * 100} className="h-2 flex-1" />
                      <span className="text-sm font-medium">{Math.round(int.confidence * 100)}%</span>
                    </div>
                  </div>
                  <div className="col-span-3 flex gap-4 text-xs text-muted-foreground">
                    <span>⏱ {int.timeToEffect}</span>
                    <span>📚 {int.evidenceCount} studies</span>
                    <span>🔗 {int.relatedClaims.join(', ')}</span>
                  </div>
                </div>
              )}
              <Separator />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Machine-Readable Tab ───

function MachineReadableTab() {
  const [selectedKO, setSelectedKO] = useState<KnowledgeObject | null>(null);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <StatCard icon={FileJson} label="Knowledge Objects" value={SEED_KNOWLEDGE_OBJECTS.length} />
        <StatCard icon={Layers} label="Output Formats" value="3" sub="JSON-LD / Schema.org / Raw" />
        <StatCard icon={Globe} label="Geographic Scope" value="Global" />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Knowledge Objects</CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <ScrollArea className="h-[400px]">
              {SEED_KNOWLEDGE_OBJECTS.map(ko => (
                <button
                  key={ko.id}
                  onClick={() => setSelectedKO(ko)}
                  className={`w-full text-left p-3 rounded-lg mb-1 transition-colors ${selectedKO?.id === ko.id ? 'bg-primary/10 border border-primary/30' : 'hover:bg-muted'}`}
                >
                  <p className="text-sm font-medium line-clamp-2">{ko.claim}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">{ko.evidenceLevel}</Badge>
                    <span className="text-xs text-muted-foreground">{Math.round(ko.confidence * 100)}% conf</span>
                  </div>
                </button>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <FileJson className="h-4 w-4" /> Machine-Readable Output
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedKO ? (
              <ScrollArea className="h-[400px]">
                <pre className="text-xs bg-muted/50 p-3 rounded-lg overflow-x-auto font-mono">
{JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'Claim',
  claim: selectedKO.claim,
  effect_size: selectedKO.effectSize,
  population: selectedKO.population,
  confidence: selectedKO.confidence,
  evidence_level: selectedKO.evidenceLevel,
  related_variables: selectedKO.relatedVariables,
  temporal_scope: selectedKO.temporalScope,
  geographic_scope: selectedKO.geographicScope,
  machine_formats: selectedKO.machineFormats,
  last_verified: selectedKO.lastVerified,
}, null, 2)}
                </pre>
              </ScrollArea>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">← Select a knowledge object</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ─── Knowledge Graph Tab ───

function KnowledgeGraphTab() {
  const domains = SEED_KNOWLEDGE_GRAPH.filter(n => n.type === 'domain');
  const claims = SEED_KNOWLEDGE_GRAPH.filter(n => n.type === 'claim');

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <StatCard icon={Network} label="Graph Nodes" value={SEED_KNOWLEDGE_GRAPH.length} />
        <StatCard icon={Globe} label="Domains" value={domains.length} />
        <StatCard icon={Brain} label="Claim Nodes" value={claims.length} />
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">SEO Knowledge Graph Structure</CardTitle>
          <CardDescription className="text-xs">Domain → Topic → Claim → Questions → Answers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {domains.map(d => (
              <div key={d.id} className="border rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-sm">{d.label}</span>
                  <Badge variant="outline" className="text-xs">{d.childCount} claims</Badge>
                </div>
                <div className="ml-6 space-y-2">
                  {claims.filter(c => c.parentId === d.id).map(c => {
                    const universe = SEED_QUESTION_UNIVERSES.find(u => u.claimId === c.id.replace('claim-', ''));
                    return (
                      <div key={c.id} className="border-l-2 border-primary/20 pl-3 py-1">
                        <p className="text-sm">{c.label}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">{c.childCount} questions</Badge>
                          <span className="text-xs text-muted-foreground">
                            Coverage: {Math.round(c.searchRelevance * 100)}%
                          </span>
                          {universe && (
                            <span className="text-xs text-muted-foreground">
                              | {new Set(universe.questions.map(q => q.category)).size} categories
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Main Explorer ───

export function AKBExplorer() {
  const totalQuestions = SEED_QUESTION_UNIVERSES.reduce((s, u) => s + u.totalQuestions, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Brain className="h-6 w-6 text-primary" />
          Autonomous Knowledge Builder
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Distribution Layer: Claim → Questions → Machine-readable → SEO Dominance
        </p>
      </div>

      {/* Pipeline overview */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            {[
              { label: 'Claims', value: SEED_CLAIMS.length, icon: BookOpen },
              { label: 'Questions', value: totalQuestions, icon: Search },
              { label: 'Knowledge Objects', value: SEED_KNOWLEDGE_OBJECTS.length, icon: FileJson },
              { label: 'Interventions Ranked', value: SEED_RANKED_INTERVENTIONS.length, icon: TrendingUp },
              { label: 'Graph Nodes', value: SEED_KNOWLEDGE_GRAPH.length, icon: Network },
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

      <Tabs defaultValue="questions" className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full max-w-lg">
          <TabsTrigger value="questions" className="text-xs">Questions</TabsTrigger>
          <TabsTrigger value="priority" className="text-xs">Priority</TabsTrigger>
          <TabsTrigger value="machine" className="text-xs">Machine-Readable</TabsTrigger>
          <TabsTrigger value="graph" className="text-xs">Knowledge Graph</TabsTrigger>
        </TabsList>

        <TabsContent value="questions"><QuestionUniverseTab /></TabsContent>
        <TabsContent value="priority"><PriorityEngineTab /></TabsContent>
        <TabsContent value="machine"><MachineReadableTab /></TabsContent>
        <TabsContent value="graph"><KnowledgeGraphTab /></TabsContent>
      </Tabs>
    </div>
  );
}
