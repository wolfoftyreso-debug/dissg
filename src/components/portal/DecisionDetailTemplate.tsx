/**
 * Decision Detail Template
 * 
 * Template for displaying a single decision in the public portal.
 * Fixed order. No summary. No conclusion.
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { DecisionDetailView } from '@/core/portal';

interface DecisionDetailTemplateProps {
  decision: DecisionDetailView;
}

export function DecisionDetailTemplate({ decision }: DecisionDetailTemplateProps) {
  const { header, context, assumptions, alternatives, tradeoffs, uncertainties, evidence, review } = decision;

  return (
    <div className="space-y-6 font-mono">
      {/* Canonical Block (Top) */}
      <Card className="border-border">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Decision ID:</span>
              <span className="ml-2 font-medium">{header.decision_id}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Decision Type:</span>
              <span className="ml-2">{header.decision_type}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Scope:</span>
              <span className="ml-2">{header.scope}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Legitimacy Status:</span>
              <Badge variant="outline" className="ml-2">
                {header.legitimacy_status}
              </Badge>
            </div>
            <div>
              <span className="text-muted-foreground">Locked At:</span>
              <span className="ml-2">{header.locked_at || '[not locked]'}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 1. Context (locked) */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <span className="text-muted-foreground">[1]</span>
            Context
            {context.locked && <Badge variant="secondary">[LOCKED]</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <span className="text-muted-foreground">Decision Question:</span>
            <p className="mt-1">{context.decision_question}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Scope Definition:</span>
            <p className="mt-1">{context.scope_definition}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-muted-foreground">Time Horizon:</span>
              <span className="ml-2">{context.time_horizon}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Population Affected:</span>
              <span className="ml-2">{context.population_affected}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Assumptions */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-base">
            <span className="text-muted-foreground">[2]</span> Assumptions
            <Badge variant="outline" className="ml-2">{assumptions.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            {assumptions.map(a => (
              <li key={a.id} className="flex items-start gap-2">
                <span className={a.is_explicit ? 'text-primary' : 'text-muted-foreground'}>
                  {a.is_explicit ? '[EXPLICIT]' : '[IMPLICIT]'}
                </span>
                <span>{a.assumption_text}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* 3. Alternatives (symmetric) */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-base">
            <span className="text-muted-foreground">[3]</span> Alternatives
            <Badge variant="outline" className="ml-2">{alternatives.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alternatives.map(alt => (
              <div key={alt.id} className="p-3 border border-border rounded text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{alt.alternative_name}</span>
                  <Badge variant={alt.is_evaluated ? 'default' : 'secondary'}>
                    {alt.is_evaluated ? 'evaluated' : 'not evaluated'}
                  </Badge>
                </div>
                <p className="mt-2 text-muted-foreground">{alt.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 4. Trade-offs */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-base">
            <span className="text-muted-foreground">[4]</span> Trade-offs
            <Badge variant="outline" className="ml-2">{tradeoffs.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            {tradeoffs.map(t => (
              <li key={t.id}>
                <span className="font-medium">{t.dimension}:</span>
                <span className="ml-2 text-muted-foreground">{t.description}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* 5. Known Uncertainties */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-base">
            <span className="text-muted-foreground">[5]</span> Known Uncertainties
            <Badge variant="outline" className="ml-2">{uncertainties.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-sm">
            {uncertainties.map(u => (
              <li key={u.id} className="p-3 border border-border rounded">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{u.uncertainty_type}</span>
                  <Badge variant={
                    u.severity === 'high' ? 'destructive' :
                    u.severity === 'medium' ? 'default' : 'secondary'
                  }>
                    {u.severity}
                  </Badge>
                </div>
                <p className="mt-2 text-muted-foreground">{u.description}</p>
                {u.data_gap && (
                  <p className="mt-1 text-xs text-destructive">
                    Data gap: {u.data_gap}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* 6. Evidence */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-base">
            <span className="text-muted-foreground">[6]</span> Evidence
            <Badge variant="outline" className="ml-2">{evidence.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            {evidence.map(e => (
              <li key={e.id} className="flex items-center justify-between">
                <span>{e.source_name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    accessed: {e.access_date}
                  </span>
                  <Badge variant="outline">
                    reliability: {e.reliability_score}%
                  </Badge>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* 7. Review (if available) */}
      {review && (
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base">
              <span className="text-muted-foreground">[7]</span> Review
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground">Reviewed At:</span>
              <span>{review.reviewed_at}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground">Reviewer Type:</span>
              <Badge variant="outline">{review.reviewer_type}</Badge>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground">Outcome:</span>
              <Badge variant={
                review.outcome === 'confirmed' ? 'default' :
                review.outcome === 'disputed' ? 'destructive' : 'secondary'
              }>
                {review.outcome}
              </Badge>
            </div>
            {review.notes && (
              <div>
                <span className="text-muted-foreground">Notes:</span>
                <p className="mt-1">{review.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Separator />

      {/* Footer - No summary, no conclusion */}
      <div className="text-xs text-muted-foreground text-center font-mono">
        [END OF DECISION STRUCTURE] — No summary. No conclusion. No recommendation.
      </div>
    </div>
  );
}
