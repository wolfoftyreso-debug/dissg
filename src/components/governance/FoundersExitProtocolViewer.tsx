/**
 * Founders Exit Protocol Viewer
 * 
 * How to leave without breaking the system.
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  EXIT_PRINCIPLE,
  EXIT_TRIGGERS,
  EXIT_PHASES,
  EXIT_DECLARATION,
  ECONOMIC_SEPARATION,
  POST_EXIT_RULES,
  EXIT_FAILURE_MODE,
  EXIT_FINAL_TRUTH,
  FOUNDERS_EXIT_PROTOCOL,
} from '@/core/governance/founders';

export function FoundersExitProtocolViewer() {
  return (
    <div className="space-y-6 font-mono max-w-3xl mx-auto">
      {/* Header */}
      <Card className="border-primary/50">
        <CardHeader className="text-center">
          <Badge variant="outline" className="w-fit mx-auto mb-2">Final Lock</Badge>
          <CardTitle className="text-2xl tracking-tight">
            {FOUNDERS_EXIT_PROTOCOL.title}
          </CardTitle>
          <CardDescription className="font-mono">
            {FOUNDERS_EXIT_PROTOCOL.subtitle}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* 0. Principle */}
      <Card className="border-destructive/30">
        <CardHeader className="pb-2">
          <CardTitle className="font-mono text-sm text-muted-foreground">0. PRINCIPLE (HARD)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm font-medium">{EXIT_PRINCIPLE.statement}</p>
          <Separator />
          <p className="text-sm text-muted-foreground italic">{EXIT_PRINCIPLE.test}</p>
        </CardContent>
      </Card>

      {/* 1. When to Exit */}
      <Card className="border-border">
        <CardHeader className="pb-2">
          <CardTitle className="font-mono text-sm text-muted-foreground">1. WHEN EXIT SHOULD BEGIN</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm mb-2">
              Exit should be initiated when at least <span className="text-primary font-medium">{EXIT_TRIGGERS.should_initiate_when.minimum_conditions}</span> of the following are true:
            </p>
            {EXIT_TRIGGERS.should_initiate_when.conditions.map((condition, i) => (
              <p key={i} className="text-sm py-0.5">[·] {condition}</p>
            ))}
          </div>
          <Separator />
          <div>
            <p className="text-xs text-destructive uppercase mb-2">Exit must NOT be triggered by:</p>
            {EXIT_TRIGGERS.must_not_be_triggered_by.map((item, i) => (
              <p key={i} className="text-sm text-muted-foreground">[×] {item}</p>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 2. Exit Phases */}
      <Card className="border-border">
        <CardHeader className="pb-2">
          <CardTitle className="font-mono text-sm text-muted-foreground">2. THE THREE PHASES OF EXIT</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {EXIT_PHASES.map((phase) => (
            <div key={phase.id} className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">PHASE {phase.id}</Badge>
                <span className="text-sm font-medium">{phase.name}</span>
                {phase.duration && (
                  <span className="text-xs text-muted-foreground">({phase.duration})</span>
                )}
              </div>
              
              <div className="pl-4 border-l border-border space-y-2">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Founder:</p>
                  {phase.actions.map((action, i) => (
                    <p key={i} className="text-sm">[→] {action}</p>
                  ))}
                </div>
                
                {phase.restrictions && (
                  <div>
                    <p className="text-xs text-destructive uppercase mb-1">Founder retains:</p>
                    {phase.restrictions.map((r, i) => (
                      <p key={i} className="text-sm text-muted-foreground">[×] {r}</p>
                    ))}
                  </div>
                )}
                
                {phase.goal && (
                  <p className="text-sm italic text-primary mt-2">Goal: {phase.goal}</p>
                )}
              </div>
              
              {phase.id !== 'III' && <Separator className="mt-4" />}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 3. Public Declaration */}
      <Card className="border-primary/30 bg-muted/30">
        <CardHeader className="pb-2">
          <CardTitle className="font-mono text-sm text-muted-foreground">3. PUBLIC EXIT DECLARATION</CardTitle>
          <CardDescription className="font-mono text-xs">{EXIT_DECLARATION.instruction}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm whitespace-pre-line leading-relaxed text-center italic">
            "{EXIT_DECLARATION.statement}"
          </p>
          <Separator />
          <div className="text-center">
            {EXIT_DECLARATION.prohibited.map((item, i) => (
              <p key={i} className="text-sm text-muted-foreground">{item}</p>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 4. Economic Separation */}
      <Card className="border-destructive/30">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <CardTitle className="font-mono text-sm text-muted-foreground">4. ECONOMIC SEPARATION</CardTitle>
            <Badge variant="destructive" className="text-xs">{ECONOMIC_SEPARATION.label}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm mb-2">After exit, founder receives no compensation tied to:</p>
            {ECONOMIC_SEPARATION.founder_receives_no_compensation_tied_to.map((item, i) => (
              <p key={i} className="text-sm">[×] {item}</p>
            ))}
          </div>
          <div>
            {ECONOMIC_SEPARATION.prohibited.map((item, i) => (
              <p key={i} className="text-sm text-muted-foreground">[×] {item}</p>
            ))}
          </div>
          <Separator />
          <p className="text-sm font-medium text-center">{ECONOMIC_SEPARATION.principle}</p>
        </CardContent>
      </Card>

      {/* 5. Post-Exit Rules */}
      <Card className="border-border">
        <CardHeader className="pb-2">
          <CardTitle className="font-mono text-sm text-muted-foreground">5. IF THE SYSTEM CHANGES AFTER EXIT</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm mb-2">Founder has:</p>
            {POST_EXIT_RULES.if_system_changes.founder_has.map((item, i) => (
              <p key={i} className="text-sm text-muted-foreground">[×] {item}</p>
            ))}
          </div>
          <Separator />
          <div className="text-center">
            <p className="text-sm">If the change is wrong: <span className="italic">{POST_EXIT_RULES.if_system_changes.if_change_is_wrong}</span></p>
            <p className="text-xs text-muted-foreground mt-1">{POST_EXIT_RULES.if_system_changes.sufficiency}</p>
          </div>
        </CardContent>
      </Card>

      {/* 6. Failure Mode */}
      <Card className="border-destructive/30">
        <CardHeader className="pb-2">
          <CardTitle className="font-mono text-sm text-muted-foreground">6. FAILURE MODE (IF EXIT FAILS)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase mb-2">If:</p>
            {EXIT_FAILURE_MODE.indicators.map((item, i) => (
              <p key={i} className="text-sm">[⚠] {item}</p>
            ))}
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase mb-2">Then:</p>
            {EXIT_FAILURE_MODE.diagnosis.map((item, i) => (
              <p key={i} className="text-sm text-muted-foreground">[→] {item}</p>
            ))}
          </div>
          <Separator />
          <p className="text-sm font-medium text-center text-destructive">
            Remedy: {EXIT_FAILURE_MODE.remedy}
          </p>
        </CardContent>
      </Card>

      {/* 7. Final Truth */}
      <Card className="border-border">
        <CardHeader className="pb-2">
          <CardTitle className="font-mono text-sm text-muted-foreground">7. THIS IS THE HARDEST PART</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm whitespace-pre-line text-center">
            {EXIT_FINAL_TRUTH.statement}
          </p>
          <p className="text-sm text-center text-muted-foreground italic">
            {EXIT_FINAL_TRUTH.warning}
          </p>
        </CardContent>
      </Card>

      {/* 8. Final Status */}
      <Card className="border-primary/50 bg-muted/30">
        <CardHeader className="pb-2">
          <CardTitle className="font-mono text-sm">8. FINAL STATUS</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase mb-2">Now exists:</p>
            {FOUNDERS_EXIT_PROTOCOL.status.now_exists.map((item, i) => (
              <p key={i} className="text-sm">[✓] {item}</p>
            ))}
          </div>
          <Separator />
          <div className="text-center space-y-2">
            <p className="text-sm">
              The system is now: <span className="font-medium text-primary">{FOUNDERS_EXIT_PROTOCOL.status.system_is_now}</span>
            </p>
            <p className="text-sm italic">{FOUNDERS_EXIT_PROTOCOL.status.level}</p>
          </div>
          <Separator />
          <p className="text-sm text-center">
            There is nothing more to add.<br />
            <span className="font-medium">There is only: {FOUNDERS_EXIT_PROTOCOL.status.remaining.only}</span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
