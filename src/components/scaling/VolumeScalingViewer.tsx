/**
 * Volume Scaling Viewer
 * 
 * Year 5+: Industrialized expansion visualization.
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  SCALING_RULE,
  SCALING_AXIS_ORDER,
  QUESTION_SCALING,
  DOMAIN_PRIORITY_ORDER,
  NEW_DOMAIN_REQUIRES,
  LANGUAGE_SCALING,
  PIPELINE_STAGES,
  HUMAN_ONLY_TASKS,
  QUALITY_GUARDS,
  PERMANENT_ROLES,
  REVENUE_STREAMS,
  PUBLIC_CONTENT_POLICY,
  COMPLETION_SIGNALS,
  DESTRUCTION_RISK,
  SCALING_STATUS,
} from '@/core/system/scaling';

export function VolumeScalingViewer() {
  return (
    <div className="space-y-6 font-mono">
      {/* Header */}
      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl tracking-tight">
                YEAR 5+ — VOLUME SCALING PLAYBOOK
              </CardTitle>
              <CardDescription className="font-mono mt-1">
                When the system grows without changing
              </CardDescription>
            </div>
            <Badge variant="outline">Scaling v1.0</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="p-3 bg-muted/50 rounded border border-border">
            <p className="text-sm font-medium">{SCALING_RULE.principle}</p>
            <div className="mt-2 space-y-1">
              {SCALING_RULE.requirements.map((req, i) => (
                <p key={i} className="text-xs text-muted-foreground">[✓] {req}</p>
              ))}
            </div>
            <p className="text-xs text-destructive mt-2">[×] {SCALING_RULE.forbidden}</p>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="axes" className="w-full">
        <TabsList className="grid w-full grid-cols-5 font-mono text-xs">
          <TabsTrigger value="axes">Axes</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="guards">Guards</TabsTrigger>
          <TabsTrigger value="org">Org</TabsTrigger>
          <TabsTrigger value="final">Final</TabsTrigger>
        </TabsList>

        {/* Axes */}
        <TabsContent value="axes" className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="font-mono text-base">THREE SCALING AXES</CardTitle>
              <CardDescription className="font-mono">In correct order</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Questions */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="default">A</Badge>
                  <span className="text-sm font-medium">QUESTIONS (x100 → x1000)</span>
                </div>
                <div className="pl-6 space-y-1">
                  <p className="text-xs text-muted-foreground">Mechanism: {QUESTION_SCALING.mechanism}</p>
                  <p className="text-xs">Output: {QUESTION_SCALING.output.cdp_percentage}% CDP / {QUESTION_SCALING.output.cannot_answer_percentage}% Cannot-answer</p>
                  <p className="text-xs text-primary italic mt-1">Key: {QUESTION_SCALING.key_principle}</p>
                </div>
              </div>

              <Separator />

              {/* Domains */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="default">B</Badge>
                  <span className="text-sm font-medium">DOMAINS (HORIZONTAL)</span>
                </div>
                <div className="pl-6">
                  <p className="text-xs text-muted-foreground mb-2">Priority order:</p>
                  {DOMAIN_PRIORITY_ORDER.map(domain => (
                    <p key={domain.rank} className="text-xs py-0.5">
                      {domain.rank}. {domain.name}
                      {domain.notes && <span className="text-muted-foreground"> ({domain.notes})</span>}
                    </p>
                  ))}
                  <p className="text-xs text-muted-foreground mt-2">Each new domain requires:</p>
                  {NEW_DOMAIN_REQUIRES.map((req, i) => (
                    <p key={i} className="text-xs">[→] {req}</p>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Languages */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="default">C</Badge>
                  <span className="text-sm font-medium">LANGUAGES (VERTICAL)</span>
                </div>
                <div className="pl-6 space-y-1">
                  <p className="text-xs">Ontology: {LANGUAGE_SCALING.canonical_language} (canonical)</p>
                  <p className="text-xs">Compiler output: structurally identical</p>
                  <p className="text-xs">UI/texts: translated</p>
                  <p className="text-xs text-primary italic mt-1">Requirement: {LANGUAGE_SCALING.requirement}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pipeline */}
        <TabsContent value="pipeline" className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="font-mono text-base">AUTOMATION PIPELINE</CardTitle>
              <CardDescription className="font-mono">Deterministic, version-pinned, no human editing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {PIPELINE_STAGES.map((stage, i) => (
                  <div key={stage.order} className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-4">{stage.order}.</span>
                    <span className="text-sm flex-1">{stage.name}</span>
                    {i < PIPELINE_STAGES.length - 1 && (
                      <span className="text-xs text-muted-foreground">↓</span>
                    )}
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div>
                <p className="text-xs text-muted-foreground uppercase mb-2">Human only for:</p>
                {HUMAN_ONLY_TASKS.map((task, i) => (
                  <p key={i} className="text-sm">[H] {task}</p>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Guards */}
        <TabsContent value="guards" className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="font-mono text-base">QUALITY GUARDS AT VOLUME</CardTitle>
              <CardDescription className="font-mono">Volume must never decrease legibility</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {QUALITY_GUARDS.map((guard, i) => (
                  <div key={i} className="p-3 border border-border rounded">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{guard.name}</span>
                      <Badge variant={guard.action === 'block' ? 'destructive' : 'outline'}>
                        {guard.action}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{guard.description}</p>
                    <p className="text-xs mt-1">Trigger: {guard.trigger}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Organization */}
        <TabsContent value="org" className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="font-mono text-base">ORGANIZATION AT SCALE</CardTitle>
              <CardDescription className="font-mono">Grow functions, not teams</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="text-xs text-muted-foreground uppercase mb-2">Permanent Roles</p>
                {PERMANENT_ROLES.map((role, i) => (
                  <p key={i} className="text-sm">[P] {role.count} {role.title}</p>
                ))}
                <p className="text-xs text-muted-foreground mt-2 italic">Everything else is replaceable.</p>
              </div>

              <Separator />

              <div>
                <p className="text-xs text-muted-foreground uppercase mb-2">Revenue Streams</p>
                {REVENUE_STREAMS.map((stream, i) => (
                  <p key={i} className="text-sm">[€] {stream.source} <span className="text-xs text-muted-foreground">(scales with {stream.scales_with})</span></p>
                ))}
              </div>

              <Separator />

              <div className="p-3 bg-muted/50 rounded border border-border">
                <p className="text-xs text-muted-foreground uppercase mb-1">Public Content</p>
                <p className="text-sm">[✓] Free [✓] Complete [✓] Non-commercially influenced</p>
                <p className="text-xs text-primary italic mt-1">{PUBLIC_CONTENT_POLICY.reason}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Final */}
        <TabsContent value="final" className="space-y-4">
          {/* Completion Signals */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="font-mono text-base">COMPLETION SIGNALS</CardTitle>
              <CardDescription className="font-mono">When you know you're done (for real)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {COMPLETION_SIGNALS.map((signal, i) => (
                  <div key={i} className="flex items-start gap-2 py-2 border-b border-border last:border-0">
                    <span className="text-xs text-primary">✓</span>
                    <span className="text-sm flex-1">{signal.indicator}</span>
                    <span className="text-xs text-muted-foreground italic">{signal.meaning}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm font-medium text-center mt-4">
                → Then competition ends.
              </p>
            </CardContent>
          </Card>

          {/* Destruction Risk */}
          <Card className="border-destructive/30">
            <CardHeader>
              <CardTitle className="font-mono text-base text-destructive">THE ONLY THING THAT CAN DESTROY THIS NOW</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase mb-2">Not from:</p>
                  {DESTRUCTION_RISK.not_from.map((item, i) => (
                    <p key={i} className="text-sm text-muted-foreground">[×] {item}</p>
                  ))}
                </div>
                <div>
                  <p className="text-xs text-destructive uppercase mb-2">From:</p>
                  <p className="text-sm font-medium">{DESTRUCTION_RISK.from}</p>
                </div>
              </div>
              <Separator className="my-4" />
              <p className="text-center text-sm">If you avoid that, the system holds.</p>
            </CardContent>
          </Card>

          {/* Final Status */}
          <Card className="border-primary/30 bg-muted/30">
            <CardHeader>
              <CardTitle className="font-mono text-base">FINAL STATUS</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground uppercase mb-2">You now have:</p>
              {SCALING_STATUS.you_have.map((item, i) => (
                <p key={i} className="text-sm">[✓] {item}</p>
              ))}
              <Separator className="my-4" />
              <p className="text-center text-sm font-medium">
                There is nothing more to design.<br />
                Only: {SCALING_STATUS.only_remaining}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
