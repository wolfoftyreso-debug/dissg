/**
 * EVERYDAY DECISION VIEW
 * 
 * Complete view for everyday decision intelligence.
 * Combines question analysis, scope selection, and UDF display.
 * 
 * The user makes the decision.
 * The system shows the consequences.
 */

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Scale, 
  AlertTriangle, 
  Users, 
  HelpCircle,
  CheckCircle2,
  XCircle,
  Clock,
} from 'lucide-react';
import { QuestionResolver } from './QuestionResolver';
import { ScopeSelector } from './ScopeSelector';
import type { 
  EverydayDecisionResponse, 
  DecisionScope,
  UniversalDecisionFormat,
} from '@/core/query-dominance/everyday/types';
import { applyScope } from '@/core/query-dominance/everyday/udf-generator';

interface EverydayDecisionViewProps {
  response: EverydayDecisionResponse;
  onScopeChange?: (scope: DecisionScope, updatedUDF: UniversalDecisionFormat) => void;
}

export function EverydayDecisionView({
  response,
  onScopeChange,
}: EverydayDecisionViewProps) {
  const [scope, setScope] = useState<DecisionScope>(response.user_scope);
  const [udf, setUdf] = useState<UniversalDecisionFormat>(response.udf);

  const handleScopeChange = useCallback((newScope: DecisionScope) => {
    setScope(newScope);
    const updated = applyScope(response.udf, newScope);
    setUdf(updated);
    onScopeChange?.(newScope, updated);
  }, [response.udf, onScopeChange]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Question Resolution */}
      <QuestionResolver analysis={response.question_analysis} />

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Scope Selector - Sidebar */}
        <div className="md:col-span-1">
          <ScopeSelector value={scope} onChange={handleScopeChange} />
        </div>

        {/* UDF Display - Main */}
        <div className="md:col-span-2 space-y-6">
          {/* Decision Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium">
                Decision Summary
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {response.summary.one_sentence}
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="gap-1">
                  <Scale className="h-3 w-3" />
                  {udf.trade_offs.length} trade-offs
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  {udf.uncertainty.known_unknowns.length} unknowns
                </Badge>
                <Badge variant="outline" className="gap-1">
                  Confidence: {Math.round(response.summary.confidence * 100)}%
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* UDF Tabs */}
          <Tabs defaultValue="applicability" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="applicability" className="text-xs">
                Who
              </TabsTrigger>
              <TabsTrigger value="assumptions" className="text-xs">
                Assumptions
              </TabsTrigger>
              <TabsTrigger value="tradeoffs" className="text-xs">
                Trade-offs
              </TabsTrigger>
              <TabsTrigger value="uncertainty" className="text-xs">
                Uncertainty
              </TabsTrigger>
            </TabsList>

            {/* Applicability */}
            <TabsContent value="applicability">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Who does this apply to?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-primary mb-2">
                      Applies to:
                    </p>
                    <ul className="space-y-1">
                      {udf.applicability.applies_to.map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="h-3 w-3 text-primary" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {udf.applicability.does_not_apply_to.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-destructive mb-2">
                        Does NOT apply to:
                      </p>
                      <ul className="space-y-1">
                        {udf.applicability.does_not_apply_to.map((item, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm">
                            <XCircle className="h-3 w-3 text-destructive" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <Separator />
                  <p className="text-xs text-muted-foreground">
                    {udf.applicability.geographic_scope} • {udf.applicability.temporal_scope}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Assumptions */}
            <TabsContent value="assumptions">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <HelpCircle className="h-4 w-4" />
                    Required Assumptions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {udf.required_assumptions.map((assumption) => (
                      <li key={assumption.assumption_id} className="border-b pb-3 last:border-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-medium">{assumption.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Current: <strong>{String(assumption.current_value)}</strong>
                            </p>
                          </div>
                          <Badge 
                            variant={
                              assumption.impact_if_wrong === 'decision_reversal' 
                                ? 'destructive' 
                                : assumption.impact_if_wrong === 'significant'
                                ? 'secondary'
                                : 'outline'
                            }
                            className="text-xs shrink-0"
                          >
                            {assumption.impact_if_wrong}
                          </Badge>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Trade-offs */}
            <TabsContent value="tradeoffs">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Scale className="h-4 w-4" />
                    Dominant Trade-offs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {udf.trade_offs.map((tradeOff) => (
                      <li key={tradeOff.trade_off_id} className="border-b pb-3 last:border-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-medium">
                              {tradeOff.dimension_a} ↔ {tradeOff.dimension_b}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {tradeOff.description}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              Matters to: {tradeOff.who_cares.join(', ')}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-xs shrink-0">
                            {tradeOff.magnitude}
                          </Badge>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Uncertainty */}
            <TabsContent value="uncertainty">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    What We Don't Know
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm italic text-muted-foreground">
                    {udf.uncertainty.confidence_statement}
                  </p>
                  
                  <Separator />
                  
                  <div>
                    <p className="text-sm font-medium mb-2">Known Unknowns:</p>
                    <ul className="space-y-3">
                      {udf.uncertainty.known_unknowns.map((unknown, i) => (
                        <li key={i} className="text-sm bg-muted/50 p-3 rounded-md">
                          <p className="font-medium">{unknown.variable}</p>
                          <p className="text-muted-foreground text-xs mt-1">
                            {unknown.why_unknown}
                          </p>
                          <p className="text-xs mt-1">
                            Impact: {unknown.impact_on_decision}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {udf.uncertainty.data_gaps.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Data Gaps:</p>
                      <ul className="space-y-1">
                        {udf.uncertainty.data_gaps.map((gap, i) => (
                          <li key={i} className="text-xs text-muted-foreground flex items-center gap-2">
                            <XCircle className="h-3 w-3 text-destructive" />
                            {gap}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Forbidden Outputs Warning */}
          <Card className="border-destructive/30 bg-destructive/5">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-destructive shrink-0" />
                <div>
                  <p className="text-sm font-medium">This system never says:</p>
                  <ul className="mt-2 space-y-1">
                    {response.forbidden_outputs.map((fo, i) => (
                      <li key={i} className="text-xs text-muted-foreground">
                        "{fo.example}" — {fo.why_forbidden}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Validity Notice */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            Valid until: {new Date(udf.valid_until).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}
