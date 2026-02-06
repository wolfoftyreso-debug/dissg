/**
 * MACHINE-FIRST QUESTION PAGE
 * 
 * Priority order:
 * 1. JSON-LD (PRIMARY) - for AI agents
 * 2. Schema.org / Dataset
 * 3. Plain HTML (SECONDARY)
 * 4. Human-readable (TERTIARY)
 * 
 * AI reads structure, not text.
 */

import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { JsonLdHead } from '@/components/teflon/JsonLdHead';
import { createMinimalCQO, STABLE_URLS, VERIFICATION_NOTES } from '@/core/truth-engine/teflon';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle, AlertTriangle, Clock, ExternalLink, 
  Database, FileText, Globe, TrendingUp 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const CERTAINTY_COLORS = {
  very_high: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  high: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  low: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  uncertain: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const VERIFICATION_ICONS = {
  verified: CheckCircle,
  pending: Clock,
  stale: AlertTriangle,
  disputed: AlertTriangle,
};

export default function QuestionPage() {
  const { questionId } = useParams<{ questionId: string }>();

  // Fetch question
  const { data: question, isLoading: loadingQuestion } = useQuery({
    queryKey: ['question', questionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('global_index_questions')
        .select('*')
        .eq('question_id', questionId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!questionId,
  });

  // Fetch answer
  const { data: answer } = useQuery({
    queryKey: ['answer', question?.canonical_answer_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('canonical_answers')
        .select('*')
        .eq('question_id', question?.id)
        .eq('is_current', true)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!question?.id,
  });

  // Fetch provenance
  const { data: provenance = [] } = useQuery({
    queryKey: ['provenance', answer?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('data_provenance')
        .select('*')
        .eq('answer_id', answer?.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!answer?.id,
  });

  if (loadingQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-destructive">Question not found</div>
      </div>
    );
  }

  // Create CQO for JSON-LD
  const cqo = createMinimalCQO({
    question_id: question.question_id,
    url: STABLE_URLS.question(question.question_id),
    question_en: question.question_en,
    question_sv: question.question_sv,
    primary_ai_agent: question.primary_ai_agent as any,
    secondary_ai_agents: (question.secondary_ai_agents || []) as any[],
    intent_layer: question.intent_layer as any,
    domain_code: question.domain_code,
    geographic_scope: question.scope as any,
    time_scope: (question.time_dimension === 'weekly' ? 'monthly' : question.time_dimension) as any,
    answer_type: (question.answer_type === 'aggregate' || question.answer_type === 'distribution' 
      ? 'statistic' : question.answer_type) as any,
    certainty_level: (question.certainty_level || 'medium') as any,
    misinterpretation_risk: (question.misinterpretation_risk || 'low') as any,
    ai_retrieval_tags: question.ai_retrieval_tags || [],
    last_verified_at: question.last_verified_at || new Date().toISOString(),
    verification_status: (question.verification_status || 'verified') as any,
  });

  const VerificationIcon = VERIFICATION_ICONS[(question.verification_status || 'verified') as keyof typeof VERIFICATION_ICONS];

  return (
    <>
      {/* JSON-LD HEAD - AI reads this first */}
      <JsonLdHead 
        question={cqo} 
        answer={answer as any} 
        provenance={provenance as any}
      />

      <div className="min-h-screen bg-background">
        {/* Machine-readable data attributes */}
        <article 
          data-question-id={question.question_id}
          data-domain={question.domain_code}
          data-certainty={question.certainty_level}
          data-verified={question.last_verified_at}
          className="container mx-auto px-4 py-8 max-w-4xl"
        >
          {/* Header */}
          <header className="mb-8">
            {/* Stable ID */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <Badge variant="outline" className="font-mono text-xs">
                {question.question_id}
              </Badge>
              <Badge 
                variant="outline" 
                className={cn('text-xs', CERTAINTY_COLORS[question.certainty_level || 'medium'])}
              >
                {question.certainty_level || 'medium'} certainty
              </Badge>
              <Badge variant="outline" className="text-xs flex items-center gap-1">
                <VerificationIcon className="h-3 w-3" />
                {question.verification_status || 'verified'}
              </Badge>
            </div>

            {/* Question title */}
            <h1 className="text-3xl font-bold mb-2" lang="en">
              {question.question_en}
            </h1>
            <p className="text-lg text-muted-foreground" lang="sv">
              {question.question_sv}
            </p>
          </header>

          <Separator className="my-6" />

          {/* Answer section */}
          {answer && (
            <section aria-label="Answer" className="mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <TrendingUp className="h-5 w-5" />
                    Canonical Answer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* The answer blob - 5-10 lines, never varies */}
                  <div className="prose prose-invert max-w-none">
                    <p className="whitespace-pre-line">{answer.answer_blob}</p>
                  </div>

                  {/* Structured data display */}
                  {answer.structured_data && Object.keys(answer.structured_data).length > 0 && (
                    <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                      <pre className="text-xs overflow-auto">
                        {JSON.stringify(answer.structured_data, null, 2)}
                      </pre>
                    </div>
                  )}

                  {/* Quality signals */}
                  <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Database className="h-4 w-4" />
                      Confidence: {Math.round((answer.confidence_score || 0.8) * 100)}%
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {answer.verification_note || VERIFICATION_NOTES.no_change}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </section>
          )}

          {/* Provenance section */}
          {provenance.length > 0 && (
            <section aria-label="Data Provenance" className="mb-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Data Provenance
              </h2>
              <div className="grid gap-4">
                {provenance.map((p) => (
                  <Card key={p.id}>
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Value</div>
                          <div className="font-mono font-bold">
                            {p.value} {p.unit}
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Source</div>
                          <div className="font-medium">{p.source_org}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Period</div>
                          <div>{p.valid_for_period}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Confidence</div>
                          <Badge variant="outline" className="text-xs">
                            {p.confidence}
                          </Badge>
                        </div>
                      </div>
                      {p.source_url && (
                        <a 
                          href={p.source_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-primary mt-2 hover:underline"
                        >
                          <ExternalLink className="h-3 w-3" />
                          View source
                        </a>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Methodology section */}
          {answer?.methodology_text && (
            <section aria-label="Methodology" className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Methodology</h2>
              <Card>
                <CardContent className="pt-4">
                  <p className="text-sm text-muted-foreground whitespace-pre-line">
                    {answer.methodology_text}
                  </p>
                  <div className="text-xs text-muted-foreground mt-2">
                    Version: {answer.methodology_version}
                  </div>
                </CardContent>
              </Card>
            </section>
          )}

          {/* AI retrieval tags */}
          <section aria-label="Retrieval Tags" className="mb-8">
            <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <Globe className="h-4 w-4" />
              AI Retrieval Tags
            </h2>
            <div className="flex flex-wrap gap-2">
              {question.ai_retrieval_tags?.map((tag: string) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </section>

          {/* Machine-readable footer */}
          <footer className="text-xs text-muted-foreground border-t pt-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="font-medium">Question ID</div>
                <code>{question.question_id}</code>
              </div>
              <div>
                <div className="font-medium">Last Verified</div>
                <time dateTime={question.last_verified_at}>
                  {new Date(question.last_verified_at).toLocaleDateString()}
                </time>
              </div>
              <div>
                <div className="font-medium">API Endpoint</div>
                <code>{STABLE_URLS.api_question(question.question_id)}</code>
              </div>
              <div>
                <div className="font-medium">Token Cost Est.</div>
                <span>~{question.token_cost_estimate || 100} tokens</span>
              </div>
            </div>
          </footer>
        </article>
      </div>
    </>
  );
}
