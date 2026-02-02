/**
 * 🧩 SIMPLE OVERVIEW CARD
 * 
 * LAYER 1 — "60 second understanding"
 * 
 * Design principles:
 * - 5-7 key indicators max
 * - Clear words (no indices)
 * - No advanced interaction
 * - Color + short text
 * - Click = deeper exploration
 */

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, ChevronRight, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// ============================================================
// TYPES
// ============================================================

type Language = 'sv' | 'en';
type TrendDirection = 'up' | 'down' | 'stable';

interface SimpleIndicator {
  id: string;
  label: { sv: string; en: string };
  value: string; // Pre-formatted human-readable value
  explanation: { sv: string; en: string }; // "What this means in reality"
  trend: TrendDirection;
  trend_text: { sv: string; en: string }; // Human-readable trend
  is_positive_trend: boolean; // Is this direction good?
  context?: { sv: string; en: string }; // Historical/comparative context
  source: string;
}

interface SimpleOverviewCardProps {
  indicator: SimpleIndicator;
  language?: Language;
  onClick?: () => void;
  compact?: boolean;
}

// ============================================================
// HELPERS
// ============================================================

function getTrendIcon(trend: TrendDirection) {
  switch (trend) {
    case 'up': return TrendingUp;
    case 'down': return TrendingDown;
    default: return Minus;
  }
}

function getTrendColor(trend: TrendDirection, isPositive: boolean): string {
  if (trend === 'stable') return 'text-slate-500 bg-slate-100';
  
  // If trend direction matches positive expectation
  const isGood = (trend === 'up' && isPositive) || (trend === 'down' && !isPositive);
  return isGood 
    ? 'text-emerald-600 bg-emerald-100' 
    : 'text-rose-600 bg-rose-100';
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export function SimpleOverviewCard({
  indicator,
  language = 'en',
  onClick,
  compact = false,
}: SimpleOverviewCardProps) {
  const TrendIcon = getTrendIcon(indicator.trend);
  const trendColor = getTrendColor(indicator.trend, indicator.is_positive_trend);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: onClick ? 1.02 : 1 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className={`transition-all ${onClick ? 'cursor-pointer hover:shadow-md' : ''} ${compact ? 'p-3' : ''}`}
        onClick={onClick}
      >
        <CardContent className={compact ? 'p-0' : 'pt-6'}>
          {/* Header: Label + Source */}
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-medium text-foreground">
              {indicator.label[language]}
            </h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="text-muted-foreground hover:text-foreground transition-colors">
                    <Info className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="left" className="max-w-xs">
                  <p className="text-sm">{indicator.explanation[language]}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {language === 'sv' ? 'Källa' : 'Source'}: {indicator.source}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Main Value */}
          <div className="flex items-baseline gap-3 mb-3">
            <span className="text-3xl font-bold text-foreground">
              {indicator.value}
            </span>
            <Badge className={`${trendColor} gap-1`}>
              <TrendIcon className="h-3 w-3" />
              {indicator.trend_text[language]}
            </Badge>
          </div>

          {/* Context (what this means in reality) */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            {indicator.explanation[language]}
          </p>

          {/* Historical/comparative context if available */}
          {indicator.context && (
            <p className="text-xs text-muted-foreground mt-2 italic">
              {indicator.context[language]}
            </p>
          )}

          {/* Click indicator */}
          {onClick && (
            <div className="flex items-center justify-end mt-4 text-xs text-primary">
              <span>{language === 'sv' ? 'Utforska mer' : 'Explore more'}</span>
              <ChevronRight className="h-3 w-3 ml-1" />
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ============================================================
// GRID COMPONENT FOR MULTIPLE INDICATORS
// ============================================================

interface SimpleOverviewGridProps {
  indicators: SimpleIndicator[];
  language?: Language;
  onIndicatorClick?: (id: string) => void;
  maxVisible?: number;
}

export function SimpleOverviewGrid({
  indicators,
  language = 'en',
  onIndicatorClick,
  maxVisible = 7,
}: SimpleOverviewGridProps) {
  const visibleIndicators = indicators.slice(0, maxVisible);

  return (
    <div className="space-y-6">
      {/* Header with "60 seconds" promise */}
      <div className="text-center">
        <h2 className="text-xl font-semibold text-foreground">
          {language === 'sv' ? 'Läget just nu' : 'The situation now'}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {language === 'sv' 
            ? 'Förstå på 60 sekunder'
            : 'Understand in 60 seconds'
          }
        </p>
      </div>

      {/* Indicator grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {visibleIndicators.map((indicator, index) => (
          <motion.div
            key={indicator.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <SimpleOverviewCard
              indicator={indicator}
              language={language}
              onClick={onIndicatorClick ? () => onIndicatorClick(indicator.id) : undefined}
            />
          </motion.div>
        ))}
      </div>

      {/* "Show details" progressive disclosure */}
      {indicators.length > maxVisible && (
        <div className="text-center">
          <button className="text-sm text-primary hover:underline">
            {language === 'sv' 
              ? `Visa ${indicators.length - maxVisible} fler indikatorer`
              : `Show ${indicators.length - maxVisible} more indicators`
            }
          </button>
        </div>
      )}
    </div>
  );
}

export default SimpleOverviewCard;
