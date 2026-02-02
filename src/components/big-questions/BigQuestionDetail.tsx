/**
 * Big Question Detail View
 * 
 * Full page view for a single Big Question.
 * Part of Block 56.
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { 
  useBigQuestion, 
  useBigQuestionHistory 
} from '@/hooks/useBigQuestions';
import { 
  QUESTION_CATEGORIES, 
  formatImportanceScore,
  getRankChangeIndicator,
  QuestionCategory 
} from '@/config/bigQuestionsConfig';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, TrendingUp, AlertTriangle, Link2, 
  History, Ban, CheckCircle, Info
} from 'lucide-react';

interface BigQuestionDetailProps {
  questionCode: string;
  countryCode?: string | null;
  className?: string;
}

export function BigQuestionDetail({
  questionCode,
  countryCode = null,
  className,
}: BigQuestionDetailProps) {
  const { data: question, isLoading } = useBigQuestion(questionCode);
  const { data: history } = useBigQuestionHistory(
    question?.id || '', 
    countryCode
  );

  if (isLoading) {
    return (
      <div className={cn('space-y-6', className)}>
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!question) {
    return (
      <div className={cn('text-center py-12', className)}>
        <p className="text-muted-foreground">Frågan hittades inte.</p>
        <Link to="/big-questions" className="text-primary hover:underline text-sm mt-2">
          Tillbaka till Big Questions
        </Link>
      </div>
    );
  }

  const category = question.category ? QUESTION_CATEGORIES[question.category as QuestionCategory] : null;
  const rankChange = question.ranking?.rank_change ?? 0;
  const changeIndicator = getRankChangeIndicator(rankChange);

  return (
    <div className={cn('space-y-6', className)}>
      {/* Back link */}
      <Link 
        to="/big-questions" 
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Tillbaka till Big Questions
      </Link>

      {/* Header */}
      <div>
        {category && (
          <Badge variant="outline" className="mb-2">
            {category.label}
          </Badge>
        )}
        <h1 className="text-2xl font-bold">{question.question_text}</h1>
        <p className="text-muted-foreground mt-2">{question.short_description}</p>
      </div>

      {/* Ranking info */}
      {question.ranking && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Nuvarande ranking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <div className="text-2xl font-bold">
                  #{question.ranking.rank_position || '–'}
                </div>
                <div className="text-xs text-muted-foreground">Position</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {formatImportanceScore(question.ranking.importance_score)}
                </div>
                <div className="text-xs text-muted-foreground">Importance Score</div>
              </div>
              <div>
                <div className={cn('text-2xl font-bold', changeIndicator.color)}>
                  {rankChange > 0 ? '+' : ''}{rankChange || '–'}
                </div>
                <div className="text-xs text-muted-foreground">Förändring</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {(100 - question.ranking.data_uncertainty).toFixed(0)}%
                </div>
                <div className="text-xs text-muted-foreground">Datatillförlitlighet</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Why ranked high */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Info className="h-4 w-4" />
            Varför detta rankas högt
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {question.ranking && (
            <>
              <div className="flex items-center justify-between">
                <span>Förändringstakt</span>
                <Badge variant="secondary">
                  {question.ranking.trend_acceleration.toFixed(1)}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Korsdomän-påverkan</span>
                <Badge variant="secondary">
                  {question.ranking.cross_domain_impact.toFixed(1)}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Berörd population</span>
                <Badge variant="secondary">
                  {question.ranking.population_affected.toFixed(1)}
                </Badge>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* What this shows */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-status-positive" />
            Vad datan visar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{question.what_this_shows}</p>
        </CardContent>
      </Card>

      {/* What this does NOT show */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Ban className="h-4 w-4 text-status-critical" />
            Vad datan INTE visar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1">
            {question.what_this_does_not_show.map((item, i) => (
              <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                <AlertTriangle className="h-3 w-3 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Underlying indicators */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Link2 className="h-4 w-4" />
            Underliggande indikatorer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {question.primary_kpi_codes.map((kpi) => (
              <Badge key={kpi} variant="outline" className="font-mono text-xs">
                {kpi}
              </Badge>
            ))}
            {question.secondary_kpi_codes?.map((kpi) => (
              <Badge key={kpi} variant="secondary" className="font-mono text-xs">
                {kpi}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* History */}
      {history && history.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <History className="h-4 w-4" />
              Rankinghistorik
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {history.slice(0, 6).map((h: any) => (
                <div key={h.id} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{h.period}</span>
                  <div className="flex items-center gap-2">
                    <span>#{h.rank_position}</span>
                    <Badge variant="secondary" className="text-xs">
                      {formatImportanceScore(h.importance_score)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default BigQuestionDetail;
