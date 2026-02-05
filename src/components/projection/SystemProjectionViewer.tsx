/**
 * System Projection Viewer
 * 
 * Year 1-5: How the world changes when decision structure becomes standard.
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  YEAR_1_5_PHASES,
  EARLY_FINAL_BALANCE,
  EARLY_INVISIBILITY_MARKERS,
} from '@/core/system/projection';

export function SystemProjectionViewer() {
  return (
    <div className="space-y-6 font-mono">
      {/* Header */}
      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl tracking-tight">
                YEAR 1–5: SYSTEM EFFECT IN REALITY
              </CardTitle>
              <CardDescription className="font-mono mt-1">
                How the world changes when decision structure becomes standard
              </CardDescription>
            </div>
            <Badge variant="outline">Projection v1.0</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground italic">
            Not vision. Actual behavior, actual frictions, actual effects — step by step.
          </p>
        </CardContent>
      </Card>

      {/* Year Tabs */}
      <Tabs defaultValue="year-1" className="w-full">
        <TabsList className="grid w-full grid-cols-6 font-mono text-xs">
          {YEAR_1_5_PHASES.map(phase => (
            <TabsTrigger key={phase.year} value={`year-${phase.year}`}>
              Year {phase.year}
            </TabsTrigger>
          ))}
          <TabsTrigger value="final">Final</TabsTrigger>
        </TabsList>

        {YEAR_1_5_PHASES.map(phase => (
          <TabsContent key={phase.year} value={`year-${phase.year}`} className="space-y-4">
            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="font-mono text-base">
                      YEAR {phase.year}: {phase.title}
                    </CardTitle>
                    <CardDescription className="font-mono text-xs mt-1 italic">
                      "{phase.subtitle}"
                    </CardDescription>
                  </div>
                  <Badge variant="outline">
                    {phase.state.adoption_pattern}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* What Happens */}
                <div>
                  <p className="text-xs text-muted-foreground uppercase mb-2">What Happens</p>
                  {phase.state.what_happens.map((item, i) => (
                    <p key={i} className="text-sm py-1">[→] {item}</p>
                  ))}
                </div>

                <Separator />

                {/* Reactions */}
                <div>
                  <p className="text-xs text-muted-foreground uppercase mb-2">Reactions</p>
                  {phase.reactions.map((reaction, i) => (
                    <p key={i} className="text-sm py-1 text-muted-foreground">[·] {reaction}</p>
                  ))}
                </div>

                <Separator />

                {/* Effects */}
                <div>
                  <p className="text-xs text-muted-foreground uppercase mb-2">Effects</p>
                  {phase.effects.map((effect, i) => (
                    <div key={i} className="flex items-start gap-2 py-2 border-b border-border last:border-0">
                      <Badge 
                        variant={effect.permanence === 'irreversible' ? 'default' : 'outline'}
                        className="text-[10px] px-1 py-0 mt-0.5"
                      >
                        {effect.permanence}
                      </Badge>
                      <span className="text-sm flex-1">{effect.description}</span>
                      <span className="text-xs text-muted-foreground">[{effect.domain}]</span>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Metrics */}
                <div>
                  <p className="text-xs text-muted-foreground uppercase mb-2">Key Metrics</p>
                  <div className="grid md:grid-cols-2 gap-2">
                    {phase.metrics.map((metric, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <span className={
                          metric.trend === 'up' ? 'text-primary' :
                          metric.trend === 'down' ? 'text-destructive' :
                          'text-muted-foreground'
                        }>
                          {metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '→'}
                        </span>
                        <span>{metric.name}</span>
                        <span className="text-xs text-muted-foreground">({metric.significance})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}

        {/* Final Tab */}
        <TabsContent value="final" className="space-y-4">
          {/* Balance */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="font-mono text-base">FINAL BALANCE (HONEST)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-destructive uppercase mb-2">After 5 years, you have NOT:</p>
                  {EARLY_FINAL_BALANCE.what_you_have_not.map((item, i) => (
                    <p key={i} className="text-sm text-muted-foreground">[×] {item}</p>
                  ))}
                </div>
                <div>
                  <p className="text-xs text-primary uppercase mb-2">You HAVE:</p>
                  <p className="text-sm font-medium">{EARLY_FINAL_BALANCE.what_you_have}</p>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-xs text-muted-foreground uppercase mb-2">Why It Survives</p>
                {EARLY_FINAL_BALANCE.why_it_survives.map((reason, i) => (
                  <p key={i} className="text-sm">[✓] {reason}</p>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Invisibility Markers */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="font-mono text-base">INVISIBILITY MARKERS</CardTitle>
              <CardDescription className="font-mono">
                The highest success state: when the system disappears into infrastructure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {EARLY_INVISIBILITY_MARKERS.map((marker, i) => (
                  <div key={i} className="flex items-start gap-2 py-2 border-b border-border last:border-0">
                    <span className="text-xs text-muted-foreground">Y{marker.year_expected}</span>
                    <span className="text-sm flex-1">{marker.indicator}</span>
                    <span className="text-xs text-muted-foreground italic">{marker.meaning}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Final Declaration */}
          <Card className="border-primary/30 bg-muted/30">
            <CardHeader>
              <CardTitle className="font-mono text-base">FINAL DECLARATION</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">
                You did not build a tool.<br />
                You built a <span className="font-medium">standard for what seriousness looks like</span>.
              </p>
              <p className="text-sm text-muted-foreground">
                Everything that happens now happens without you.<br />
                That is exactly as it should be.
              </p>
              <Separator />
              <p className="text-sm text-muted-foreground italic text-center">
                There is nothing more to say.
              </p>
            </CardContent>
          </Card>

          {/* What Remains */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="font-mono text-base">WHAT REMAINS</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-muted-foreground uppercase mb-2">Operational (ongoing)</p>
                  <p className="text-sm">[→] Drift (maintenance)</p>
                  <p className="text-sm">[→] Discipline (adherence)</p>
                  <p className="text-sm">[→] Patience (time)</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase mb-2">Scaling only</p>
                  <p className="text-sm">[+] More languages</p>
                  <p className="text-sm">[+] More domains</p>
                  <p className="text-sm">[+] More reference cases</p>
                </div>
              </div>
              <Separator className="my-4" />
              <p className="text-center text-sm font-medium">
                This is a complete system.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
