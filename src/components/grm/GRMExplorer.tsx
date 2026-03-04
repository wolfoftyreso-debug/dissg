/**
 * GLOBAL REALITY MODEL — Explorer Dashboard
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import {
  Globe, Network, Zap, Search, Play, ArrowRight,
  TrendingUp, TrendingDown, AlertTriangle, Layers,
  Target, Activity, BarChart3, Brain, Leaf, Building2
} from 'lucide-react';
import {
  createGlobalRealityModel,
  SEED_ENTITIES, SEED_VARIABLES, SEED_INTERVENTIONS,
  SEED_OUTCOMES, SEED_CAUSAL_LINKS,
} from '@/core/grm';

const DOMAIN_ICONS: Record<string, React.ReactNode> = {
  health: <Activity className="h-3 w-3" />,
  psychology: <Brain className="h-3 w-3" />,
  economics: <BarChart3 className="h-3 w-3" />,
  environment: <Leaf className="h-3 w-3" />,
  governance: <Building2 className="h-3 w-3" />,
  nutrition: <Target className="h-3 w-3" />,
  urbanization: <Globe className="h-3 w-3" />,
};

const DOMAIN_COLORS: Record<string, string> = {
  health: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  psychology: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  economics: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  environment: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  governance: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  nutrition: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  urbanization: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300',
};

const NODE_TYPE_STYLES: Record<string, string> = {
  entity: 'border-muted-foreground/30 bg-muted/50',
  variable: 'border-primary/30 bg-primary/5',
  intervention: 'border-green-500/30 bg-green-500/5',
  outcome: 'border-amber-500/30 bg-amber-500/5',
};

export const GRMExplorer: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedIntervention, setSelectedIntervention] = useState('');
  const [simMagnitude, setSimMagnitude] = useState([30]);
  const [simResult, setSimResult] = useState<ReturnType<typeof grm.simulate> | null>(null);
  const [selectedOutcome, setSelectedOutcome] = useState('');

  // Initialize GRM
  const grm = useMemo(() => {
    const model = createGlobalRealityModel();
    model.loadEntities(SEED_ENTITIES);
    model.loadVariables(SEED_VARIABLES);
    model.loadInterventions(SEED_INTERVENTIONS);
    model.loadOutcomes(SEED_OUTCOMES);
    model.loadCausalLinks(SEED_CAUSAL_LINKS);
    return model;
  }, []);

  const stats = useMemo(() => grm.getStats(), [grm]);
  const crossDomainMatrix = useMemo(() => grm.getCrossDomainMatrix(), [grm]);
  const discoveries = useMemo(() => grm.discoverIndirectChains(0.1), [grm]);
  const allNodes = useMemo(() => grm.getAllNodes(), [grm]);
  const allLinks = useMemo(() => grm.getAllLinks(), [grm]);

  const interventionRankings = useMemo(() => {
    if (!selectedOutcome) return [];
    return grm.rankInterventions(selectedOutcome);
  }, [grm, selectedOutcome]);

  const runSimulation = () => {
    if (!selectedIntervention) return;
    const result = grm.simulate({
      intervention_id: selectedIntervention,
      magnitude_change_percent: simMagnitude[0],
      time_horizon_months: 12,
    });
    setSimResult(result);
  };

  return (
    <div className="space-y-6 p-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Globe className="h-7 w-7 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Global Reality Model</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Verkligheten som ett nätverk av orsaker och effekter. Alla domäner — hälsa, ekonomi, psykologi, miljö — kopplade i en enda kausal graf.
        </p>
        <div className="flex items-center justify-center gap-2">
          <Badge variant="outline" className="text-xs">
            <Network className="h-3 w-3 mr-1" />
            {stats.total_causal_links} kausala länkar
          </Badge>
          <Badge variant="outline" className="text-xs">
            <Layers className="h-3 w-3 mr-1" />
            {Object.keys(stats.by_domain).length} domäner
          </Badge>
          <Badge variant="outline" className="text-xs">
            <Zap className="h-3 w-3 mr-1" />
            {stats.cross_domain_links} kross-domän
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="overview">Översikt</TabsTrigger>
          <TabsTrigger value="graph">Kausal Graf</TabsTrigger>
          <TabsTrigger value="discovery">Upptäckter</TabsTrigger>
          <TabsTrigger value="simulate">Simulering</TabsTrigger>
          <TabsTrigger value="rank">Interventioner</TabsTrigger>
        </TabsList>

        {/* ================================================================ */}
        {/* OVERVIEW TAB */}
        {/* ================================================================ */}
        <TabsContent value="overview" className="space-y-4">
          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Entiteter', value: stats.total_entities, icon: Globe },
              { label: 'Variabler', value: stats.total_variables, icon: Activity },
              { label: 'Interventioner', value: stats.total_interventions, icon: Zap },
              { label: 'Utfall', value: stats.total_outcomes, icon: Target },
            ].map(s => (
              <Card key={s.label}>
                <CardContent className="pt-4 pb-3 text-center">
                  <s.icon className="h-5 w-5 mx-auto mb-1 text-primary" />
                  <div className="text-2xl font-bold">{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Domain distribution */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Domänfördelning</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {Object.entries(stats.by_domain).sort((a, b) => b[1] - a[1]).map(([domain, count]) => (
                  <Badge key={domain} className={`${DOMAIN_COLORS[domain] || 'bg-muted text-muted-foreground'} gap-1`}>
                    {DOMAIN_ICONS[domain]}
                    {domain}: {count}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Cross-domain matrix */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Network className="h-4 w-4" />
                Kross-domän kopplingar
              </CardTitle>
              <CardDescription className="text-xs">
                Hur domäner påverkar varandra genom kausala kedjor
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {crossDomainMatrix.map((link, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded bg-muted/30">
                    <div className="flex items-center gap-2 text-sm">
                      <Badge variant="outline" className="text-xs">{link.source}</Badge>
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                      <Badge variant="outline" className="text-xs">{link.target}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{link.count} länkar</span>
                      <Badge className={link.avgStrength > 0.6 ? 'bg-green-600' : 'bg-amber-600'}>
                        {link.avgStrength}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              GRM modellerar observerade samband, inte absoluta sanningar. Alla styrkor och konfidenser 
              baseras på tillgänglig evidens och kan förändras med ny data. Korrelation ≠ kausalitet.
            </AlertDescription>
          </Alert>
        </TabsContent>

        {/* ================================================================ */}
        {/* GRAPH TAB */}
        {/* ================================================================ */}
        <TabsContent value="graph" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Alla noder ({allNodes.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {allNodes.map(node => (
                  <div key={node.id} className={`p-2 rounded border text-sm ${NODE_TYPE_STYLES[node.type]}`}>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{node.label}</span>
                      <div className="flex gap-1">
                        <Badge variant="outline" className="text-[10px]">{node.type}</Badge>
                        <Badge className={`text-[10px] ${DOMAIN_COLORS[node.domain] || ''}`}>
                          {node.domain}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Kausala länkar ({allLinks.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1.5 max-h-96 overflow-y-auto">
                {allLinks.map(link => (
                  <div key={link.id} className="flex items-center gap-2 text-xs p-1.5 rounded bg-muted/20">
                    <span className="font-medium truncate flex-1">{link.source_label}</span>
                    <ArrowRight className="h-3 w-3 flex-shrink-0 text-muted-foreground" />
                    <span className="font-medium truncate flex-1">{link.target_label}</span>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {link.direction === 'positive' ?
                        <TrendingUp className="h-3 w-3 text-green-500" /> :
                        <TrendingDown className="h-3 w-3 text-red-500" />}
                      <Badge variant="outline" className="text-[10px]">
                        {link.strength}
                      </Badge>
                      {link.is_cross_domain && (
                        <Badge className="text-[10px] bg-purple-600">×</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ================================================================ */}
        {/* DISCOVERY TAB */}
        {/* ================================================================ */}
        <TabsContent value="discovery" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Search className="h-4 w-4" />
                Upptäckta kross-domän kedjor ({discoveries.length})
              </CardTitle>
              <CardDescription className="text-xs">
                Automatiskt upptäckta indirekta kausala kedjor som korsar domängränser
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {discoveries.slice(0, 15).map((disc, i) => (
                  <div key={i} className="p-3 rounded-lg border bg-muted/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">
                        {disc.domains_crossed.map(d => (
                          <Badge key={d} className={`text-[10px] ${DOMAIN_COLORS[d] || ''}`}>
                            {d}
                          </Badge>
                        ))}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Konfidens: {Math.round(disc.total_confidence * 100)}%
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-xs flex-wrap">
                      {disc.chain_labels.map((label, j) => (
                        <React.Fragment key={j}>
                          {j > 0 && <ArrowRight className="h-3 w-3 text-muted-foreground flex-shrink-0" />}
                          <span className="font-medium bg-background px-1.5 py-0.5 rounded border">
                            {label}
                          </span>
                        </React.Fragment>
                      ))}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Styrka: {Math.round(disc.total_strength * 100)}% • 
                      {disc.potential_intervention_points.length} interventionspunkter
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ================================================================ */}
        {/* SIMULATION TAB */}
        {/* ================================================================ */}
        <TabsContent value="simulate" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Play className="h-4 w-4" />
                Kontrafaktisk simulering
              </CardTitle>
              <CardDescription className="text-xs">
                "Vad händer om..." — Simulera effekten av en intervention genom hela den kausala grafen
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Intervention</label>
                  <Select value={selectedIntervention} onValueChange={setSelectedIntervention}>
                    <SelectTrigger>
                      <SelectValue placeholder="Välj intervention..." />
                    </SelectTrigger>
                    <SelectContent>
                      {grm.getInterventions().map(int => (
                        <SelectItem key={int.id} value={int.id}>{int.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Förändring: {simMagnitude[0]}%</label>
                  <Slider
                    value={simMagnitude}
                    onValueChange={setSimMagnitude}
                    min={-100}
                    max={100}
                    step={5}
                  />
                </div>
              </div>
              <Button onClick={runSimulation} disabled={!selectedIntervention} className="w-full">
                <Play className="h-4 w-4 mr-2" />
                Kör simulering
              </Button>
            </CardContent>
          </Card>

          {simResult && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Simuleringsresultat</CardTitle>
                <CardDescription className="text-xs">
                  {simResult.total_nodes_affected} noder påverkade • {simResult.domains_impacted.length} domäner
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {simResult.affected_outcomes.map((outcome, i) => (
                  <div key={i} className="p-3 rounded border bg-muted/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{outcome.outcome_name}</span>
                      <Badge className={outcome.predicted_change_percent > 0 ? 'bg-green-600' : 'bg-red-600'}>
                        {outcome.predicted_change_percent > 0 ? '+' : ''}{outcome.predicted_change_percent}%
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-xs flex-wrap">
                      {outcome.causal_path.map((step, j) => (
                        <React.Fragment key={j}>
                          {j > 0 && <ArrowRight className="h-3 w-3 text-muted-foreground" />}
                          <span className="bg-background px-1 py-0.5 rounded border">{step}</span>
                        </React.Fragment>
                      ))}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Konfidens: {Math.round(outcome.confidence * 100)}% • 
                      Tid till effekt: ~{outcome.time_to_effect_months} mån
                    </div>
                  </div>
                ))}

                <Alert className="mt-3">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    {simResult.uncertainty_note}
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ================================================================ */}
        {/* INTERVENTION RANKING TAB */}
        {/* ================================================================ */}
        <TabsContent value="rank" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Target className="h-4 w-4" />
                Interventionsrankning
              </CardTitle>
              <CardDescription className="text-xs">
                Vilka interventioner ger störst effekt på ett visst utfall?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={selectedOutcome} onValueChange={setSelectedOutcome}>
                <SelectTrigger>
                  <SelectValue placeholder="Välj utfall att optimera..." />
                </SelectTrigger>
                <SelectContent>
                  {grm.getOutcomes().map(out => (
                    <SelectItem key={out.id} value={out.id}>{out.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {interventionRankings.length > 0 && (
                <div className="space-y-2">
                  {interventionRankings.map((rank, i) => (
                    <div key={rank.intervention.id} className="flex items-center gap-3 p-3 rounded border bg-muted/20">
                      <div className="text-lg font-bold text-primary w-8 text-center">#{i + 1}</div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{rank.intervention.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {rank.intervention.domain} • {rank.pathCount} kausala vägar
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold">{Math.round(rank.totalImpact * 100)}%</div>
                        <div className="text-xs text-muted-foreground">
                          konf. {Math.round(rank.confidence * 100)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedOutcome && interventionRankings.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Inga interventioner hittade med kausal koppling till detta utfall.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
