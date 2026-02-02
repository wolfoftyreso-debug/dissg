/**
 * Big Questions Components Index
 * 
 * Part of Block 56: Global Big Questions — Auto-Ranked, Data-Only
 */

export { BigQuestionCard } from './BigQuestionCard';
export { BigQuestionsList } from './BigQuestionsList';
export { BigQuestionDetail } from './BigQuestionDetail';

// Re-export config
export {
  QUESTION_CATEGORIES,
  RANKING_WEIGHTS,
  ANTI_MISUSE_RULES,
  VIEW_CONFIG,
  BIG_QUESTIONS_DONE_CRITERIA,
  calculateImportanceScore,
  getRankChangeIndicator,
  formatImportanceScore,
  type QuestionCategory,
  type BigQuestionDB,
  type BigQuestionRanking,
  type BigQuestionWithRanking,
  type RankingMetrics,
} from '@/config/bigQuestionsConfig';

// Re-export hooks
export { 
  useBigQuestions, 
  useBigQuestion, 
  useBigQuestionHistory,
  useBigQuestionSummary 
} from '@/hooks/useBigQuestions';
