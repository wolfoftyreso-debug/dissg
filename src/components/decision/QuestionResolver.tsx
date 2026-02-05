/**
 * QUESTION RESOLVER UI
 * 
 * "This depends on a small number of assumptions.
 *  Here is what the question actually resolves to."
 * 
 * This is not UX friction. It is cognitive enlightenment.
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle, 
  Lightbulb,
  ArrowRight,
} from 'lucide-react';
import type { QuestionAnalysis } from '@/core/query-dominance/everyday/types';
import { formatQuestionAnalysis } from '@/core/query-dominance/everyday/question-analyzer';

interface QuestionResolverProps {
  analysis: QuestionAnalysis;
  showBetterQuestions?: boolean;
}

export function QuestionResolver({ 
  analysis, 
  showBetterQuestions = true 
}: QuestionResolverProps) {
  const formatted = formatQuestionAnalysis(analysis);

  return (
    <Card className="w-full border-l-4 border-l-primary">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <CardTitle className="text-lg font-medium">
              {formatted.header}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Here is what the question actually resolves to:
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Original vs Resolved */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>You asked:</span>
          </div>
          <p className="text-sm bg-muted p-3 rounded-md italic">
            "{analysis.original_question}"
          </p>
          
          <div className="flex items-center justify-center">
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <span className="font-medium">This actually means:</span>
          </div>
          <p className="text-sm bg-primary/10 p-3 rounded-md border border-primary/20">
            {formatted.resolved}
          </p>
        </div>

        <Separator />

        {/* Hidden Assumptions Revealed */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              Hidden assumptions in your question:
            </span>
          </div>
          <ul className="space-y-2">
            {formatted.assumptions.map((assumption, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="text-muted-foreground">•</span>
                <span>{assumption}</span>
              </li>
            ))}
          </ul>
        </div>

        <Separator />

        {/* Implicit Scope */}
        <div className="space-y-3">
          <span className="text-sm font-medium">
            Your implied context:
          </span>
          <div className="flex flex-wrap gap-2">
            {formatted.scope.map((item, i) => (
              <Badge key={i} variant="outline" className="text-xs">
                {item.label}: {item.value}
              </Badge>
            ))}
          </div>
        </div>

        {/* Better Questions */}
        {showBetterQuestions && formatted.better_questions.length > 0 && (
          <>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-medium">
                  More precise questions to consider:
                </span>
              </div>
              <ul className="space-y-2">
                {formatted.better_questions.map((q, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-amber-500 font-medium">{i + 1}.</span>
                    <span className="text-muted-foreground">{q}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {/* Footer note */}
        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground italic">
            Understanding the structure of your question helps you make a 
            better decision — regardless of what answer you find.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
