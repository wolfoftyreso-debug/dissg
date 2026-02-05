/**
 * Steward Oath Viewer
 * 
 * A binding commitment to protect decision legitimacy.
 * Short. Public. Non-negotiable.
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  CORE_COMMITMENT,
  POSITIVE_DUTIES,
  NEGATIVE_DUTIES,
  AUTHORITY,
  CHANGE_DISCIPLINE,
  AI_ACKNOWLEDGMENT,
  SUCCESSION_COMMITMENT,
  RESIGNATION_CLAUSE,
  FINAL_STATEMENT,
  STEWARD_OATH_COMPLETE,
} from '@/core/governance/steward/oath';

export function StewardOathViewer() {
  return (
    <div className="space-y-6 font-mono max-w-3xl mx-auto">
      {/* Header */}
      <Card className="border-primary/50">
        <CardHeader className="text-center">
          <Badge variant="outline" className="w-fit mx-auto mb-2">Binding Commitment</Badge>
          <CardTitle className="text-2xl tracking-tight">
            {STEWARD_OATH_COMPLETE.title}
          </CardTitle>
          <CardDescription className="font-mono">
            {STEWARD_OATH_COMPLETE.subtitle}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* I. Core Commitment */}
      <Card className="border-border">
        <CardHeader className="pb-2">
          <CardTitle className="font-mono text-sm text-muted-foreground">I. CORE COMMITMENT</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm whitespace-pre-line leading-relaxed">
            {CORE_COMMITMENT.statement}
          </p>
        </CardContent>
      </Card>

      {/* II. Positive Duties */}
      <Card className="border-border">
        <CardHeader className="pb-2">
          <CardTitle className="font-mono text-sm text-muted-foreground">II. WHAT I WILL ALWAYS DO</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-1">
            {POSITIVE_DUTIES.map((duty, i) => (
              <li key={i} className="text-sm flex gap-2">
                <span className="text-primary">{i + 1}.</span>
                <span>{duty}</span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* III. Negative Duties */}
      <Card className="border-destructive/30">
        <CardHeader className="pb-2">
          <CardTitle className="font-mono text-sm text-muted-foreground">III. WHAT I WILL NEVER DO</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm mb-2">I will never:</p>
          <ul className="space-y-1">
            {NEGATIVE_DUTIES.map((duty, i) => (
              <li key={i} className="text-sm flex gap-2">
                <span className="text-destructive">×</span>
                <span>{duty}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* IV. Authority & Limits */}
      <Card className="border-border">
        <CardHeader className="pb-2">
          <CardTitle className="font-mono text-sm text-muted-foreground">IV. AUTHORITY & LIMITS</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground mb-1">My authority exists only to:</p>
            {AUTHORITY.exists_only_to.map((item, i) => (
              <p key={i} className="text-sm">[→] {item}</p>
            ))}
          </div>
          <Separator />
          <p className="text-sm text-muted-foreground">
            I hold no authority over {AUTHORITY.holds_no_authority_over.join(', ')}.
          </p>
        </CardContent>
      </Card>

      {/* V. Change Discipline */}
      <Card className="border-border">
        <CardHeader className="pb-2">
          <CardTitle className="font-mono text-sm text-muted-foreground">V. CHANGE DISCIPLINE</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm mb-2">I accept that:</p>
          <ul className="space-y-1">
            {CHANGE_DISCIPLINE.acceptance.map((item, i) => (
              <li key={i} className="text-sm flex gap-2">
                <span className="text-primary">·</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* VI. AI Relationship */}
      <Card className="border-border">
        <CardHeader className="pb-2">
          <CardTitle className="font-mono text-sm text-muted-foreground">VI. AI RELATIONSHIP</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm mb-2">I acknowledge that:</p>
            {AI_ACKNOWLEDGMENT.acknowledges.map((item, i) => (
              <p key={i} className="text-sm flex gap-2">
                <span className="text-muted-foreground">·</span>
                <span>{item}</span>
              </p>
            ))}
          </div>
          <Separator />
          <p className="text-sm font-medium">{AI_ACKNOWLEDGMENT.commitment}</p>
        </CardContent>
      </Card>

      {/* VII. Succession */}
      <Card className="border-border">
        <CardHeader className="pb-2">
          <CardTitle className="font-mono text-sm text-muted-foreground">VII. SUCCESSION</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm mb-2">I commit to leave:</p>
            {SUCCESSION_COMMITMENT.will_leave.map((item, i) => (
              <p key={i} className="text-sm flex gap-2">
                <span className="text-primary">·</span>
                <span>{item}</span>
              </p>
            ))}
          </div>
          <Separator />
          <p className="text-sm text-muted-foreground italic">
            {SUCCESSION_COMMITMENT.failure_condition}
          </p>
        </CardContent>
      </Card>

      {/* VIII. Resignation Clause */}
      <Card className="border-destructive/30">
        <CardHeader className="pb-2">
          <CardTitle className="font-mono text-sm text-muted-foreground">VIII. RESIGNATION CLAUSE</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm mb-2">I will step down immediately if I:</p>
            {RESIGNATION_CLAUSE.triggers.map((trigger, i) => (
              <p key={i} className="text-sm flex gap-2">
                <span className="text-destructive">⚠</span>
                <span>{trigger}</span>
              </p>
            ))}
          </div>
          <Separator />
          <p className="text-sm font-medium text-center">
            {RESIGNATION_CLAUSE.principle}
          </p>
        </CardContent>
      </Card>

      {/* IX. Final Statement */}
      <Card className="border-primary/50 bg-muted/30">
        <CardHeader className="pb-2">
          <CardTitle className="font-mono text-sm text-muted-foreground">IX. FINAL STATEMENT</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm whitespace-pre-line leading-relaxed text-center">
            {FINAL_STATEMENT.truth}
          </p>
          <p className="text-sm font-medium text-center text-primary">
            {FINAL_STATEMENT.acceptance}
          </p>
        </CardContent>
      </Card>

      {/* Signature Block */}
      <Card className="border-border">
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Signed:</p>
              <div className="border-b border-muted-foreground/30 h-6" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Date:</p>
              <div className="border-b border-muted-foreground/30 h-6" />
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Ontology Version:</p>
            <div className="border-b border-muted-foreground/30 h-6 w-1/2" />
          </div>
        </CardContent>
      </Card>

      {/* Status */}
      <Card className="border-primary/30">
        <CardHeader className="pb-2">
          <CardTitle className="font-mono text-sm">STATUS</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground uppercase mb-2">Now exists:</p>
            {STEWARD_OATH_COMPLETE.status.now_exists.map((item, i) => (
              <p key={i} className="text-sm">[✓] {item}</p>
            ))}
          </div>
          <Separator />
          <p className="text-sm text-center">
            {STEWARD_OATH_COMPLETE.status.conclusion}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
