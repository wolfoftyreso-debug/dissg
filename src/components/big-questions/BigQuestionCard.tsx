/**
 * Big Question Card
 * 
 * Displays a single Big Question with its ranking.
 * Part of Block 56.
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import {
  BigQuestionWithRanking,
  QUESTION_CATEGORIES,
  getRankChangeIndicator,
  formatImportanceScore,
  QuestionCategory,
} from '@/config/bigQuestionsConfig';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowUp, ArrowDown, Minus, ChevronRight,
  Users, TrendingUp, Heart, Zap, Wheat, Building 
} from 'lucide-react';

interface BigQuestionCardProps {
  question: BigQuestionWithRanking;
  rank?: number;
  showRankChange?: boolean;
  showCategory?: boolean;
  compact?: boolean;
  className?: string;
}

const CATEGORY_ICONS = {
  demography_work: Users,
  economic_capacity: TrendingUp,
  health_longevity: Heart,
  energy_resources: Zap,
  food_supply: Wheat,
  institutional_resilience: Building,
};

export function BigQuestionCard({
  question,
  rank,
  showRankChange = true,
  showCategory = true,
  compact = false,
  className,
}: BigQuestionCardProps) {
  const category = question.category ? QUESTION_CATEGORIES[question.category as QuestionCategory] : null;
  const CategoryIcon = question.category ? CATEGORY_ICONS[question.category as QuestionCategory] : Users;
  const rankChange = question.ranking?.rank_change ?? 0;
  const changeIndicator = getRankChangeIndicator(rankChange);

  const RankChangeIcon = rankChange > 0 
    ? ArrowUp 
    : rankChange < 0 
    ? ArrowDown 
    : Minus;

  return (
    <Link
      to={`/big-questions/${question.code}`}
      className={cn(
        'block border border-border rounded-lg p-4 bg-card',
        'hover:border-primary/50 transition-colors',
        'group',
        className
      )}
    >
      <div className="flex items-start gap-3">
        {/* Rank number */}
        {rank !== undefined && (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-bold text-primary">{rank}</span>
          </div>
        )}

        <div className="flex-1 min-w-0">
          {/* Category badge */}
          {showCategory && category && (
            <div className="flex items-center gap-2 mb-2">
              <CategoryIcon className={cn('h-3.5 w-3.5', category.color)} />
              <span className="text-xs text-muted-foreground">
                {category.label}
              </span>
            </div>
          )}

          {/* Question text */}
          <h3 className={cn(
            'font-medium text-foreground group-hover:text-primary transition-colors',
            compact ? 'text-sm' : 'text-base'
          )}>
            {question.question_text}
          </h3>

          {/* Description */}
          {!compact && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {question.short_description}
            </p>
          )}

          {/* Metrics row */}
          <div className="flex items-center gap-3 mt-3">
            {/* Importance score */}
            {question.ranking && (
              <Badge variant="secondary" className="text-xs">
                Score: {formatImportanceScore(question.ranking.importance_score)}
              </Badge>
            )}

            {/* Rank change */}
            {showRankChange && rankChange !== 0 && (
              <div className={cn('flex items-center gap-1 text-xs', changeIndicator.color)}>
                <RankChangeIcon className="h-3 w-3" />
                <span>{Math.abs(rankChange)}</span>
              </div>
            )}

            {/* Arrow */}
            <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}

export default BigQuestionCard;
