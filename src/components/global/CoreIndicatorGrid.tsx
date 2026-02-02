/**
 * 📊 CORE INDICATOR GRID
 * 
 * MASTER EXECUTION BLOCK 42 — Core Global Indicators Display
 * 
 * Displays the 21 locked core indicators organized by category.
 * Always available, always consistent, always understandable.
 * 
 * Rule: Everything else is an addition, never a replacement.
 */

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, Minus, Info, ChevronRight,
  BarChart3, Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  CORE_INDICATORS,
  INDICATOR_CATEGORIES,
  type CoreIndicator,
  type IndicatorCategory,
} from '@/config/masterPromptConfig';

// ============================================================
// TYPES
// ============================================================

type Language = 'sv' | 'en';

interface IndicatorValue {
  indicator_id: string;
  value: number;
  formatted_value: string;
  trend: 'up' | 'down' | 'stable';
  trend_percent?: number;
  compared_to_average: 'above' | 'below' | 'at';
  source: string;
  year: number;
}

interface CoreIndicatorGridProps {
  language?: Language;
  values?: IndicatorValue[];
  onIndicatorClick?: (indicator: CoreIndicator) => void;
  filterCategory?: IndicatorCategory;
  compact?: boolean;
}

// ============================================================
// DEMO VALUES (for visualization)
// ============================================================

const DEMO_VALUES: Record<string, Partial<IndicatorValue>> = {
  population: { formatted_value: '10.5M', trend: 'up', trend_percent: 0.8, compared_to_average: 'above' },
  gdp_per_capita_ppp: { formatted_value: '$54,200', trend: 'up', trend_percent: 2.1, compared_to_average: 'above' },
  life_expectancy: { formatted_value: '83.2 år', trend: 'stable', trend_percent: 0.1, compared_to_average: 'above' },
  unemployment: { formatted_value: '7.4%', trend: 'down', trend_percent: -0.5, compared_to_average: 'at' },
  fertility_rate: { formatted_value: '1.67', trend: 'down', trend_percent: -1.2, compared_to_average: 'below' },
};

// ============================================================
// HELPERS
// ============================================================

function getTrendIcon(trend: 'up' | 'down' | 'stable') {
  switch (trend) {
    case 'up': return TrendingUp;
    case 'down': return TrendingDown;
    default: return Minus;
  }
}

function getTrendColor(trend: 'up' | 'down' | 'stable', isInverted: boolean): string {
  if (trend === 'stable') return 'text-muted-foreground bg-muted';
  
  const isPositive = (trend === 'up' && !isInverted) || (trend === 'down' && isInverted);
  return isPositive 
    ? 'text-emerald-600 bg-emerald-100' 
    : 'text-rose-600 bg-rose-100';
}

function getComparisonText(compared: 'above' | 'below' | 'at', language: Language): string {
  const texts: Record<string, { sv: string; en: string }> = {
    above: { sv: 'Över historiskt snitt', en: 'Above historical average' },
    below: { sv: 'Under historiskt snitt', en: 'Below historical average' },
    at: { sv: 'Nära historiskt snitt', en: 'Near historical average' },
  };
  return texts[compared][language];
}

// ============================================================
// INDICATOR CARD
// ============================================================

function IndicatorCard({
  indicator,
  value,
  language,
  onClick,
  compact,
}: {
  indicator: CoreIndicator;
  value?: Partial<IndicatorValue>;
  language: Language;
  onClick?: () => void;
  compact?: boolean;
}) {
  const demoValue = value || DEMO_VALUES[indicator.id] || {};
  const trend = demoValue.trend || 'stable';
  const TrendIcon = getTrendIcon(trend);
  const trendColor = getTrendColor(trend, indicator.is_inverted);

  return (
    <motion.div
      whileHover={{ scale: onClick ? 1.02 : 1 }}
      transition={{ duration: 0.15 }}
    >
      <Card 
        className={`h-full transition-shadow ${onClick ? 'cursor-pointer hover:shadow-md' : ''}`}
        onClick={onClick}
      >
        <CardContent className={compact ? 'p-4' : 'pt-5'}>
          {/* Number badge + category */}
          <div className="flex items-center justify-between mb-2">
            <Badge variant="outline" className="text-xs font-mono">
              #{indicator.number}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {INDICATOR_CATEGORIES[indicator.category].icon}
            </span>
          </div>

          {/* Indicator name */}
          <h3 className="font-medium text-sm text-foreground mb-2 line-clamp-2">
            {indicator.name[language]}
          </h3>

          {/* Value + trend */}
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-2xl font-bold text-foreground">
              {demoValue.formatted_value || '—'}
            </span>
            <Badge className={`${trendColor} text-xs gap-0.5`}>
              <TrendIcon className="h-3 w-3" />
              {demoValue.trend_percent !== undefined 
                ? `${demoValue.trend_percent > 0 ? '+' : ''}${demoValue.trend_percent}%`
                : ''
              }
            </Badge>
          </div>

          {/* Historical comparison (required by rules) */}
          {demoValue.compared_to_average && (
            <p className="text-xs text-muted-foreground italic">
              {getComparisonText(demoValue.compared_to_average, language)}
            </p>
          )}

          {/* Click to explore */}
          {onClick && (
            <div className="flex items-center justify-end mt-3 text-xs text-primary">
              <span>{language === 'sv' ? 'Utforska' : 'Explore'}</span>
              <ChevronRight className="h-3 w-3 ml-0.5" />
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export function CoreIndicatorGrid({
  language = 'en',
  values,
  onIndicatorClick,
  filterCategory,
  compact = false,
}: CoreIndicatorGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<IndicatorCategory | 'all'>(
    filterCategory || 'all'
  );

  // Filter indicators
  const filteredIndicators = useMemo(() => {
    if (selectedCategory === 'all') return CORE_INDICATORS;
    return CORE_INDICATORS.filter(ind => ind.category === selectedCategory);
  }, [selectedCategory]);

  // Group by category for display
  const groupedIndicators = useMemo(() => {
    const groups: Record<IndicatorCategory, CoreIndicator[]> = {
      economy_living: [],
      work_competence: [],
      health_demography: [],
      energy_resources: [],
      institutional_capacity: [],
      risk_resilience: [],
    };
    
    filteredIndicators.forEach(ind => {
      groups[ind.category].push(ind);
    });
    
    return groups;
  }, [filteredIndicators]);

  const valueMap = useMemo(() => {
    if (!values) return {};
    return values.reduce((acc, v) => ({ ...acc, [v.indicator_id]: v }), {} as Record<string, IndicatorValue>);
  }, [values]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            {language === 'sv' ? 'Kärnindikatorer' : 'Core Indicators'}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {language === 'sv' 
              ? '21 globalt jämförbara mått'
              : '21 globally comparable measures'
            }
          </p>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <Info className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left" className="max-w-xs">
              <p className="text-sm">
                {language === 'sv'
                  ? 'Dessa indikatorer finns alltid, i alla vyer, för alla länder. Allt annat är tillägg.'
                  : 'These indicators are always present, in all views, for all countries. Everything else is an addition.'
                }
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedCategory('all')}
          className="text-xs"
        >
          <Filter className="h-3 w-3 mr-1" />
          {language === 'sv' ? 'Alla' : 'All'} (21)
        </Button>
        {(Object.keys(INDICATOR_CATEGORIES) as IndicatorCategory[]).map(cat => (
          <Button
            key={cat}
            variant={selectedCategory === cat ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(cat)}
            className="text-xs"
          >
            {INDICATOR_CATEGORIES[cat].icon} {INDICATOR_CATEGORIES[cat][language]}
          </Button>
        ))}
      </div>

      {/* Indicator grid by category */}
      {selectedCategory === 'all' ? (
        Object.entries(groupedIndicators).map(([category, indicators]) => {
          if (indicators.length === 0) return null;
          const cat = category as IndicatorCategory;
          
          return (
            <div key={category}>
              <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                {INDICATOR_CATEGORIES[cat].icon}
                {INDICATOR_CATEGORIES[cat][language]}
              </h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {indicators.map((indicator, index) => (
                  <motion.div
                    key={indicator.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <IndicatorCard
                      indicator={indicator}
                      value={valueMap[indicator.id]}
                      language={language}
                      onClick={onIndicatorClick ? () => onIndicatorClick(indicator) : undefined}
                      compact={compact}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredIndicators.map((indicator, index) => (
            <motion.div
              key={indicator.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <IndicatorCard
                indicator={indicator}
                value={valueMap[indicator.id]}
                language={language}
                onClick={onIndicatorClick ? () => onIndicatorClick(indicator) : undefined}
                compact={compact}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Footer: rule reminder */}
      <Card className="bg-muted/50 border-dashed">
        <CardContent className="py-3 text-center">
          <p className="text-xs text-muted-foreground">
            📌 {language === 'sv' 
              ? 'Allt annat är tillägg, aldrig ersättning.'
              : 'Everything else is an addition, never a replacement.'
            }
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default CoreIndicatorGrid;
