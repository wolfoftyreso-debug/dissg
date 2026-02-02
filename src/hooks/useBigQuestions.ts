/**
 * Big Questions Hook
 * 
 * Fetches and manages Big Questions with auto-ranking.
 * Part of Block 56: Global Big Questions.
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  BigQuestionDB, 
  BigQuestionRanking, 
  BigQuestionWithRanking,
  QuestionCategory 
} from '@/config/bigQuestionsConfig';

interface UseBigQuestionsOptions {
  countryCode?: string | null;
  category?: QuestionCategory;
  limit?: number;
}

export function useBigQuestions(options: UseBigQuestionsOptions = {}) {
  const { countryCode = null, category, limit = 10 } = options;

  return useQuery({
    queryKey: ['big-questions', countryCode, category, limit],
    queryFn: async (): Promise<BigQuestionWithRanking[]> => {
      // Fetch questions
      let questionsQuery = supabase
        .from('big_questions')
        .select('*')
        .eq('is_active', true);

      if (category) {
        questionsQuery = questionsQuery.eq('category', category);
      }

      const { data: questions, error: questionsError } = await questionsQuery;

      if (questionsError) {
        console.error('Error fetching big questions:', questionsError);
        return [];
      }

      if (!questions || questions.length === 0) {
        return [];
      }

      // Fetch rankings for these questions
      const questionIds = questions.map(q => q.id);
      
      let rankingsQuery = supabase
        .from('big_question_rankings')
        .select('*')
        .in('question_id', questionIds)
        .order('importance_score', { ascending: false });

      if (countryCode) {
        rankingsQuery = rankingsQuery.eq('country_code', countryCode);
      } else {
        rankingsQuery = rankingsQuery.is('country_code', null);
      }

      const { data: rankings, error: rankingsError } = await rankingsQuery;

      if (rankingsError) {
        console.error('Error fetching rankings:', rankingsError);
      }

      // Combine questions with rankings
      const rankingsMap = new Map<string, BigQuestionRanking>();
      (rankings || []).forEach((r: any) => {
        rankingsMap.set(r.question_id, r as BigQuestionRanking);
      });

      const combined: BigQuestionWithRanking[] = questions.map((q: any) => ({
        ...q as BigQuestionDB,
        ranking: rankingsMap.get(q.id),
      }));

      // Sort by ranking importance score
      combined.sort((a, b) => {
        const scoreA = a.ranking?.importance_score ?? -Infinity;
        const scoreB = b.ranking?.importance_score ?? -Infinity;
        return scoreB - scoreA;
      });

      return combined.slice(0, limit);
    },
  });
}

export function useBigQuestion(questionCode: string) {
  return useQuery({
    queryKey: ['big-question', questionCode],
    queryFn: async (): Promise<BigQuestionWithRanking | null> => {
      const { data, error } = await supabase
        .from('big_questions')
        .select('*')
        .eq('code', questionCode)
        .single();

      if (error) {
        console.error('Error fetching big question:', error);
        return null;
      }

      // Fetch global ranking
      const { data: ranking } = await supabase
        .from('big_question_rankings')
        .select('*')
        .eq('question_id', data.id)
        .is('country_code', null)
        .order('calculated_at', { ascending: false })
        .limit(1)
        .single();

      return {
        ...data as BigQuestionDB,
        ranking: ranking as BigQuestionRanking | undefined,
      };
    },
    enabled: !!questionCode,
  });
}

export function useBigQuestionHistory(questionId: string, countryCode?: string | null) {
  return useQuery({
    queryKey: ['big-question-history', questionId, countryCode],
    queryFn: async () => {
      let query = supabase
        .from('big_question_history')
        .select('*')
        .eq('question_id', questionId)
        .order('period', { ascending: false })
        .limit(24);

      if (countryCode) {
        query = query.eq('country_code', countryCode);
      } else {
        query = query.is('country_code', null);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching question history:', error);
        return [];
      }

      return data || [];
    },
    enabled: !!questionId,
  });
}

export function useBigQuestionSummary(questionId: string, countryCode?: string | null, language = 'en') {
  return useQuery({
    queryKey: ['big-question-summary', questionId, countryCode, language],
    queryFn: async () => {
      let query = supabase
        .from('big_question_summaries')
        .select('*')
        .eq('question_id', questionId)
        .eq('language_code', language);

      if (countryCode) {
        query = query.eq('country_code', countryCode);
      } else {
        query = query.is('country_code', null);
      }

      const { data, error } = await query.single();

      if (error) {
        console.error('Error fetching summary:', error);
        return null;
      }

      return data;
    },
    enabled: !!questionId,
  });
}

export default useBigQuestions;
