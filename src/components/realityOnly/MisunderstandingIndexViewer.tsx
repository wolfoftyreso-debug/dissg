/**
 * 🔒 Misunderstanding Index Viewer
 * 
 * "Var är världen oftast missförstådd?"
 */

import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Info } from 'lucide-react';
import { VerificationBadge } from './VerificationBadge';
import type { MisunderstandingIndex, MisunderstandingEntry } from '@/types/realityOnly';

interface MisunderstandingIndexViewerProps {
  index: MisunderstandingIndex;
  maxItems?: number;
  language?: 'en' | 'sv';
  className?: string;
}

export function MisunderstandingIndexViewer({
  index,
  maxItems = 5,
  language = 'sv',
  className,
}: MisunderstandingIndexViewerProps) {
  const allEntries = [
    ...index.mostOverestimated.slice(0, maxItems),
    ...index.mostUnderestimated.slice(0, maxItems),
  ].sort((a, b) => Math.abs(b.gapPercent) - Math.abs(a.gapPercent));

  const biasLabels = {
    pessimistic: { en: 'Pessimistic', sv: 'Pessimistisk' },
    optimistic: { en: 'Optimistic', sv: 'Optimistisk' },
    neutral: { en: 'Neutral', sv: 'Neutral' },
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">
          {language === 'sv' 
            ? 'Var är världen oftast missförstådd?'
            : 'Where is the world most often misunderstood?'
          }
        </h2>
        <p className="text-muted-foreground">
          {language === 'sv'
            ? 'Live-index baserat på perception vs verifierad data.'
            : 'Live index based on perception vs verified data.'
          }
        </p>
      </div>

      {/* Overall bias */}
      <div className={cn(
        'p-4 rounded-lg',
        index.overallBias === 'pessimistic' && 'bg-status-warning/10 border border-status-warning/20',
        index.overallBias === 'optimistic' && 'bg-primary/10 border border-primary/20',
        index.overallBias === 'neutral' && 'bg-muted border border-muted-foreground/20',
      )}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              {language === 'sv' ? 'Övergripande tendens' : 'Overall tendency'}
            </p>
            <p className="text-lg font-semibold">
              {biasLabels[index.overallBias][language]}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">
              {language === 'sv' ? 'Avvikelse' : 'Deviation'}
            </p>
            <p className="text-lg font-mono">
              {index.biasStrength.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      {/* Entries */}
      <div className="space-y-3">
        {allEntries.slice(0, maxItems * 2).map((entry, i) => (
          <MisunderstandingEntryCard
            key={entry.indicatorId}
            entry={entry}
            rank={i + 1}
            language={language}
          />
        ))}
      </div>

      {/* Methodology note */}
      <div className="p-3 bg-muted rounded-lg flex items-start gap-2 text-sm">
        <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
        <p className="text-muted-foreground">
          {language === 'sv'
            ? 'Denna vy visar aggregerade mönster baserat på verifierade svar. Ett "gap" visar skillnaden mellan genomsnittlig uppfattning och observerad data – det säger inget om vad som är "bättre" eller "sämre".'
            : 'This view shows aggregated patterns based on verified responses. A "gap" shows the difference between average perception and observed data – it says nothing about what is "better" or "worse".'
          }
        </p>
      </div>

      {/* Verification */}
      <div className="flex justify-between items-center pt-4 border-t">
        <p className="text-xs text-muted-foreground">
          {language === 'sv' ? 'Beräknad' : 'Calculated'}: {new Date(index.calculatedAt).toLocaleDateString()}
        </p>
        <VerificationBadge verification={index.verification} size="sm" />
      </div>
    </div>
  );
}

function MisunderstandingEntryCard({
  entry,
  rank,
  language,
}: {
  entry: MisunderstandingEntry;
  rank: number;
  language: 'en' | 'sv';
}) {
  const isOver = entry.gapDirection === 'overestimate';

  return (
    <div className="flex items-center gap-4 p-4 border rounded-lg">
      {/* Rank */}
      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-mono">
        {rank}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">
          {entry.indicatorNameLocal[language] || entry.indicatorName}
        </p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{entry.category}</span>
          <span>•</span>
          <span>{entry.sampleSize.toLocaleString()} {language === 'sv' ? 'svar' : 'responses'}</span>
        </div>
      </div>

      {/* Gap visualization */}
      <div className="text-right">
        <div className={cn(
          'flex items-center gap-1',
          isOver ? 'text-status-warning' : 'text-primary'
        )}>
          {isOver ? (
            <TrendingUp className="h-4 w-4" />
          ) : (
            <TrendingDown className="h-4 w-4" />
          )}
          <span className="text-lg font-mono font-bold">
            {Math.abs(entry.gapPercent).toFixed(0)}%
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          {isOver 
            ? (language === 'sv' ? 'överskattas' : 'overestimated')
            : (language === 'sv' ? 'underskattas' : 'underestimated')
          }
        </p>
      </div>
    </div>
  );
}
