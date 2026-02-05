/**
 * Public Trust Declaration Viewer
 * 
 * On Decision Legitimacy and Public Accountability.
 * Short enough to be read, strong enough to withstand time.
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  ARTICLE_1,
  ARTICLE_2,
  ARTICLE_3,
  ARTICLE_4,
  ARTICLE_5,
  ARTICLE_6,
  ARTICLE_7,
  ARTICLE_8,
  ARTICLE_9,
  ARTICLE_10,
  PUBLIC_TRUST_DECLARATION,
} from '@/core/governance/trust';

export function PublicTrustDeclarationViewer() {
  return (
    <div className="space-y-6 font-mono max-w-3xl mx-auto">
      {/* Header */}
      <Card className="border-primary/50">
        <CardHeader className="text-center">
          <Badge variant="outline" className="w-fit mx-auto mb-2">Final Public Text</Badge>
          <CardTitle className="text-2xl tracking-tight">
            {PUBLIC_TRUST_DECLARATION.title}
          </CardTitle>
          <CardDescription className="font-mono">
            {PUBLIC_TRUST_DECLARATION.subtitle}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Article 1 */}
      <Card className="border-border">
        <CardHeader className="pb-2">
          <CardTitle className="font-mono text-sm text-muted-foreground">1. {ARTICLE_1.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm">{ARTICLE_1.purpose}</p>
          <div>
            <p className="text-xs text-muted-foreground mb-1">It records:</p>
            {ARTICLE_1.records.map((item, i) => (
              <p key={i} className="text-sm">[·] {item}</p>
            ))}
          </div>
          <Separator />
          <p className="text-sm text-center">
            It does not {ARTICLE_1.clarification.does_not}.<br />
            It {ARTICLE_1.clarification.does}.
          </p>
        </CardContent>
      </Card>

      {/* Article 2 */}
      <Card className="border-destructive/30">
        <CardHeader className="pb-2">
          <CardTitle className="font-mono text-sm text-muted-foreground">2. {ARTICLE_2.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm mb-2">This system does not:</p>
            {ARTICLE_2.does_not.map((item, i) => (
              <p key={i} className="text-sm text-muted-foreground">[×] {item}</p>
            ))}
          </div>
          <Separator />
          <p className="text-sm text-center italic">{ARTICLE_2.principle}</p>
        </CardContent>
      </Card>

      {/* Article 3 */}
      <Card className="border-border">
        <CardHeader className="pb-2">
          <CardTitle className="font-mono text-sm text-muted-foreground">3. {ARTICLE_3.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-center">
            Trust is not {ARTICLE_3.foundation.not}.<br />
            It is {ARTICLE_3.foundation.is}.
          </p>
          <Separator />
          <div>
            <p className="text-sm mb-2">Every legitimate decision must:</p>
            {ARTICLE_3.legitimate_decision_must.map((item, i) => (
              <p key={i} className="text-sm">[→] {item}</p>
            ))}
          </div>
          <Separator />
          <p className="text-sm text-center">
            History {ARTICLE_3.division.history}.<br />
            The system {ARTICLE_3.division.system}.
          </p>
        </CardContent>
      </Card>

      {/* Article 4 */}
      <Card className="border-border">
        <CardHeader className="pb-2">
          <CardTitle className="font-mono text-sm text-muted-foreground">4. {ARTICLE_4.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm">{ARTICLE_4.purpose}</p>
          <div>
            <p className="text-sm mb-1">There are:</p>
            {ARTICLE_4.there_are_no.map((item, i) => (
              <p key={i} className="text-sm text-muted-foreground">[×] no {item}</p>
            ))}
          </div>
          <Separator />
          <p className="text-sm text-center">
            Understanding is {ARTICLE_4.principles.understanding}.<br />
            Interpretation {ARTICLE_4.principles.interpretation}.
          </p>
        </CardContent>
      </Card>

      {/* Article 5 */}
      <Card className="border-border">
        <CardHeader className="pb-2">
          <CardTitle className="font-mono text-sm text-muted-foreground">5. {ARTICLE_5.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm">Automated systems may {ARTICLE_5.may}.</p>
          <div>
            <p className="text-sm mb-1">They may not:</p>
            {ARTICLE_5.may_not.map((item, i) => (
              <p key={i} className="text-sm text-muted-foreground">[×] {item}</p>
            ))}
          </div>
          <Separator />
          <p className="text-sm text-center font-medium">{ARTICLE_5.principle}</p>
        </CardContent>
      </Card>

      {/* Article 6 */}
      <Card className="border-border">
        <CardHeader className="pb-2">
          <CardTitle className="font-mono text-sm text-muted-foreground">6. {ARTICLE_6.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm">{ARTICLE_6.evolution_purpose}</p>
          <p className="text-sm text-muted-foreground">
            {ARTICLE_6.insufficient_reasons.join(', ')} are not sufficient reasons for change.
          </p>
          <Separator />
          <p className="text-sm text-center font-medium">{ARTICLE_6.imperative}</p>
        </CardContent>
      </Card>

      {/* Article 7 */}
      <Card className="border-border">
        <CardHeader className="pb-2">
          <CardTitle className="font-mono text-sm text-muted-foreground">7. {ARTICLE_7.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm">{ARTICLE_7.principle}</p>
          <p className="text-sm text-muted-foreground">{ARTICLE_7.separation}</p>
          <Separator />
          <p className="text-sm text-center font-medium">{ARTICLE_7.imperative}</p>
        </CardContent>
      </Card>

      {/* Article 8 */}
      <Card className="border-destructive/30">
        <CardHeader className="pb-2">
          <CardTitle className="font-mono text-sm text-muted-foreground">8. {ARTICLE_8.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm">{ARTICLE_8.behavior}</p>
          <Separator />
          <p className="text-sm text-center">
            Refusal is not {ARTICLE_8.clarification.refusal_is_not}.<br />
            It is {ARTICLE_8.clarification.refusal_is}.
          </p>
        </CardContent>
      </Card>

      {/* Article 9 */}
      <Card className="border-border">
        <CardHeader className="pb-2">
          <CardTitle className="font-mono text-sm text-muted-foreground">9. {ARTICLE_9.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm">{ARTICLE_9.binding}</p>
          <Separator />
          <p className="text-sm text-center text-muted-foreground">{ARTICLE_9.authority_scope}</p>
        </CardContent>
      </Card>

      {/* Article 10 */}
      <Card className="border-primary/50 bg-muted/30">
        <CardHeader className="pb-2">
          <CardTitle className="font-mono text-sm text-muted-foreground">10. {ARTICLE_10.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm whitespace-pre-line text-center">
            {ARTICLE_10.purpose}
          </p>
          <Separator />
          <p className="text-sm text-center font-medium">
            Trust is not {ARTICLE_10.truth.trust_is_not}.<br />
            It is {ARTICLE_10.truth.trust_is}.
          </p>
        </CardContent>
      </Card>

      {/* Signature Block */}
      <Card className="border-border">
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Published:</p>
              <div className="border-b border-muted-foreground/30 h-6" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Ontology Version:</p>
              <div className="border-b border-muted-foreground/30 h-6" />
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Trust Snapshot:</p>
            <div className="border-b border-muted-foreground/30 h-6 w-2/3" />
          </div>
        </CardContent>
      </Card>

      {/* Final Status */}
      <Card className="border-primary/30">
        <CardHeader className="pb-2">
          <CardTitle className="font-mono text-sm">FINAL STATUS (DEFINITIVE)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase mb-2">Now exists:</p>
            <div className="grid md:grid-cols-2 gap-1">
              {PUBLIC_TRUST_DECLARATION.status.now_exists.map((item, i) => (
                <p key={i} className="text-sm">[✓] {item}</p>
              ))}
            </div>
          </div>
          <Separator />
          <div className="text-center space-y-2">
            <p className="text-sm">There is nothing more to write.</p>
            <p className="text-sm text-muted-foreground">
              The only remaining: {PUBLIC_TRUST_DECLARATION.status.remaining.join(', ')}.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
