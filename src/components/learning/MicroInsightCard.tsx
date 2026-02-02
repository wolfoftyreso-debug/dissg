/**
 * BLOCK QC — MICRO-INSIGHTS
 * 
 * Cognitive pointers, NOT conclusions
 * "Lägg märke till att..."
 * "Notera hur..."
 * "Här ser vi ofta att..."
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb, Eye, TrendingUp } from 'lucide-react';
import type { MicroInsight } from '@/config/guidedLearningPathsConfig';
import { MICRO_INSIGHT_PREFIXES } from '@/config/guidedLearningPathsConfig';

interface MicroInsightCardProps {
  insight: MicroInsight;
}

const INSIGHT_ICONS = {
  notice: <Lightbulb className="h-4 w-4" />,
  observe: <Eye className="h-4 w-4" />,
  pattern: <TrendingUp className="h-4 w-4" />,
};

const INSIGHT_COLORS = {
  notice: 'border-amber-500/30 bg-amber-500/5',
  observe: 'border-blue-500/30 bg-blue-500/5',
  pattern: 'border-emerald-500/30 bg-emerald-500/5',
};

export function MicroInsightCard({ insight }: MicroInsightCardProps) {
  return (
    <Card className={`${INSIGHT_COLORS[insight.type]} border`}>
      <CardContent className="p-4 flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {INSIGHT_ICONS[insight.type]}
        </div>
        <div>
          <span className="font-medium text-sm">
            {MICRO_INSIGHT_PREFIXES[insight.type].sv}
          </span>
          <span className="text-sm text-muted-foreground ml-1">
            {insight.textSv}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
