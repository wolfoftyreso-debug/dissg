/**
 * Rollout Plan Viewer
 * 
 * Interactive visualization of the Global Rollout Plan.
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Globe, Languages, TrendingUp, Shield, DollarSign, AlertTriangle } from 'lucide-react';
import {
  ALL_WAVES,
  LANGUAGE_CONFIGS,
  ALL_SEO_PHASES,
  FREE_FEATURES,
  PAID_FEATURES,
  FORBIDDEN_FEATURES,
  RISK_MITIGATIONS,
  TRACKED_METRICS,
  IGNORED_METRICS,
  FIVE_YEAR_EFFECTS,
  LEGAL_POSITION,
  ROLLOUT_PLAN_VERSION,
} from '@/core/rollout';

export function RolloutPlanViewer() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Globe className="h-8 w-8 text-primary" />
            <div>
              <CardTitle className="text-2xl">Global Rollout Plan v{ROLLOUT_PLAN_VERSION.version}</CardTitle>
              <CardDescription>
                {ROLLOUT_PLAN_VERSION.strategy}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="waves" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="waves">Waves</TabsTrigger>
          <TabsTrigger value="languages">Languages</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="business">Business</TabsTrigger>
          <TabsTrigger value="risks">Risks</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
        </TabsList>

        {/* Waves Tab */}
        <TabsContent value="waves" className="space-y-4">
          {ALL_WAVES.map((wave, index) => (
            <Card key={wave.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    Wave {index + 1}: {wave.name}
                  </CardTitle>
                  <Badge variant="outline">
                    Month {wave.timeline_months[0]}-{wave.timeline_months[1]}
                  </Badge>
                </div>
                <CardDescription>{wave.goal}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Focus Domains</p>
                  <div className="flex flex-wrap gap-2">
                    {wave.focus_domains.map(domain => (
                      <Badge key={domain} variant="secondary">{domain}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Target CDP Count</p>
                  <p className="text-muted-foreground">
                    {wave.target_cdp_count[0].toLocaleString()} – {wave.target_cdp_count[1].toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Success Criteria</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {wave.success_criteria.map((c, i) => (
                      <li key={i}>• {c}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Languages Tab */}
        <TabsContent value="languages" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Languages className="h-5 w-5" />
                <CardTitle>Language Priority</CardTitle>
              </div>
              <CardDescription>
                Ontology = always English (canonical). Only UI/examples/units localized.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {LANGUAGE_CONFIGS.map(lang => (
                  <div key={lang.code} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">#{lang.priority}</Badge>
                      <span className="font-medium">{lang.name}</span>
                      <span className="text-sm text-muted-foreground">({lang.code})</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">
                        {lang.population_reach_millions}M speakers
                      </span>
                      <Badge variant="secondary">{lang.wave.replace('wave_', 'W')}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO Tab */}
        <TabsContent value="seo" className="space-y-4">
          {ALL_SEO_PHASES.map((phase, index) => (
            <Card key={phase.phase}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  <CardTitle>Phase {String.fromCharCode(65 + index)}: {phase.name}</CardTitle>
                </div>
                <CardDescription>
                  Target: {phase.cdp_target[0].toLocaleString()} – {phase.cdp_target[1].toLocaleString()} CDP pages
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Strategy</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {phase.strategy.map((s, i) => (
                      <li key={i}>• {s}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Success Signals</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {phase.success_signals.map((s, i) => (
                      <li key={i}>✓ {s}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Business Model Tab */}
        <TabsContent value="business" className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="border-primary/30">
              <CardHeader>
                <CardTitle className="text-primary flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Free
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {FREE_FEATURES.map(f => (
                    <li key={f.feature} className="text-sm">
                      <span className="font-medium">{f.feature}</span>
                      <p className="text-muted-foreground text-xs">{f.description}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-secondary/30">
              <CardHeader>
                <CardTitle className="text-secondary-foreground flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Paid
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {PAID_FEATURES.map(f => (
                    <li key={f.feature} className="text-sm">
                      <span className="font-medium">{f.feature}</span>
                      <p className="text-muted-foreground text-xs">{f.description}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-destructive/30">
              <CardHeader>
                <CardTitle className="text-destructive flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Forbidden
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {FORBIDDEN_FEATURES.map(f => (
                    <li key={f.feature} className="text-sm">
                      <span className="font-medium">{f.feature}</span>
                      <p className="text-muted-foreground text-xs">{f.description}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Risks Tab */}
        <TabsContent value="risks" className="space-y-4">
          <Card className="border-accent/30 mb-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Legal Position
              </CardTitle>
            </CardHeader>
            <CardContent>
              <blockquote className="border-l-4 border-primary pl-4 italic text-lg mb-4">
                "{LEGAL_POSITION.statement}"
              </blockquote>
              <p className="text-sm text-muted-foreground">
                Classification: {LEGAL_POSITION.classification}
              </p>
            </CardContent>
          </Card>

          {RISK_MITIGATIONS.map(risk => (
            <Card key={risk.risk}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <AlertTriangle className="h-4 w-4" />
                    {risk.risk.replace(/_/g, ' ')}
                  </CardTitle>
                  <Badge variant={
                    risk.severity === 'high' ? 'destructive' :
                    risk.severity === 'medium' ? 'default' : 'secondary'
                  }>
                    {risk.severity}
                  </Badge>
                </div>
                <CardDescription>{risk.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  <span className="font-medium">Countermeasure:</span> {risk.countermeasure}
                </p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Metrics Tab */}
        <TabsContent value="metrics" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-primary/30">
              <CardHeader>
                <CardTitle className="text-primary">We Measure (Right Things)</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {TRACKED_METRICS.map(m => (
                    <li key={m.metric} className="text-sm">
                      <span className="font-medium">{m.metric.replace(/_/g, ' ')}</span>
                      <p className="text-muted-foreground text-xs">{m.why}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-destructive/30">
              <CardHeader>
                <CardTitle className="text-destructive">We Ignore (Vanity)</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {IGNORED_METRICS.map(m => (
                    <li key={m.metric} className="text-sm">
                      <span className="font-medium line-through text-muted-foreground">
                        {m.metric.replace(/_/g, ' ')}
                      </span>
                      <p className="text-muted-foreground text-xs">{m.why}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>5-Year Effect (Realistic)</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {FIVE_YEAR_EFFECTS.map((effect, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-primary">→</span>
                    <span>{effect}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-muted-foreground italic">
                This is civilizational upgrade, not product.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
