/**
 * Big Questions List
 * 
 * Shows top Big Questions with auto-ranking.
 * Part of Block 56.
 */

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { useBigQuestions } from '@/hooks/useBigQuestions';
import { BigQuestionCard } from './BigQuestionCard';
import { 
  QUESTION_CATEGORIES, 
  QuestionCategory
} from '@/config/bigQuestionsConfig';
import { Skeleton } from '@/components/ui/skeleton';
import { Globe, Filter, Info } from 'lucide-react';

interface BigQuestionsListProps {
  countryCode?: string | null;
  countryName?: string;
  title?: string;
  showFilters?: boolean;
  limit?: number;
  className?: string;
}

export function BigQuestionsList({
  countryCode = null,
  countryName,
  title,
  showFilters = true,
  limit = 5,
  className,
}: BigQuestionsListProps) {
  const [selectedCategory, setSelectedCategory] = useState<QuestionCategory | undefined>();
  
  const { data: questions, isLoading } = useBigQuestions({
    countryCode,
    category: selectedCategory,
    limit,
  });

  const categories = Object.entries(QUESTION_CATEGORIES);

  const displayTitle = title || (countryCode 
    ? `Key structural questions for ${countryName || countryCode}`
    : 'Top structural questions this week');

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Globe className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">{displayTitle}</h2>
        </div>
      </div>

      {/* Explanation */}
      <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
        <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
        <p>
          Ranking baseras på: förändringstakt, påverkan på andra domäner, 
          antal berörda, och datatillförlitlighet. Ingen manuell prioritering.
        </p>
      </div>

      {/* Category filters */}
      {showFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <button
            onClick={() => setSelectedCategory(undefined)}
            className={cn(
              'px-2 py-1 text-xs rounded transition-colors',
              !selectedCategory 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground hover:text-foreground'
            )}
          >
            Alla
          </button>
          {categories.map(([key, cat]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key as QuestionCategory)}
              className={cn(
                'px-2 py-1 text-xs rounded transition-colors',
                selectedCategory === key 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}

      {/* Questions list */}
      <div className="space-y-3">
        {isLoading ? (
          <>
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </>
        ) : questions && questions.length > 0 ? (
          questions.map((question, index) => (
            <BigQuestionCard 
              key={question.id} 
              question={question} 
              rank={index + 1}
              showRankChange={true}
              showCategory={!selectedCategory}
            />
          ))
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <Globe className="h-8 w-8 mx-auto mb-3 opacity-50" />
            <p>Inga Big Questions tillgängliga.</p>
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory(undefined)}
                className="text-primary hover:underline text-sm mt-2"
              >
                Visa alla kategorier
              </button>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <p className="text-xs text-muted-foreground text-center">
        Ranking uppdateras automatiskt baserat på dataförändringar.
      </p>
    </div>
  );
}

export default BigQuestionsList;
