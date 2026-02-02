/**
 * 📝 SEMANTIC TEXT COMPONENTS
 * 
 * Märkta textblock för observation/context/uncertainty/non-causal.
 * Samma mening visas i UI, PDF, API.
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, 
  Layers, 
  AlertTriangle, 
  Link2Off, 
  History,
  Info,
} from 'lucide-react';
import type { SemanticTag } from '@/config/bigQuestionsContracts';

// ============================================================
// SEMANTIC TAG CONFIG
// ============================================================

const TAG_CONFIG: Record<SemanticTag, {
  label: { sv: string; en: string };
  icon: React.ComponentType<{ className?: string }>;
  className: string;
  bgClassName: string;
}> = {
  observation: {
    label: { sv: 'Observation', en: 'Observation' },
    icon: Eye,
    className: 'text-blue-600 border-blue-300',
    bgClassName: 'bg-blue-50 dark:bg-blue-950/30',
  },
  context: {
    label: { sv: 'Kontext', en: 'Context' },
    icon: Layers,
    className: 'text-slate-600 border-slate-300',
    bgClassName: 'bg-slate-50 dark:bg-slate-950/30',
  },
  uncertainty: {
    label: { sv: 'Osäkerhet', en: 'Uncertainty' },
    icon: AlertTriangle,
    className: 'text-amber-600 border-amber-300',
    bgClassName: 'bg-amber-50 dark:bg-amber-950/30',
  },
  'non-causal': {
    label: { sv: 'Ej orsakssamband', en: 'Non-causal' },
    icon: Link2Off,
    className: 'text-orange-600 border-orange-300',
    bgClassName: 'bg-orange-50 dark:bg-orange-950/30',
  },
  historical: {
    label: { sv: 'Historiskt', en: 'Historical' },
    icon: History,
    className: 'text-purple-600 border-purple-300',
    bgClassName: 'bg-purple-50 dark:bg-purple-950/30',
  },
};

// ============================================================
// SEMANTIC TEXT BLOCK
// ============================================================

interface SemanticTextBlockProps {
  tag: SemanticTag;
  children: React.ReactNode;
  sources?: string[];
  language?: 'sv' | 'en';
  showTag?: boolean;
  className?: string;
}

export function SemanticTextBlock({
  tag,
  children,
  sources,
  language = 'sv',
  showTag = true,
  className,
}: SemanticTextBlockProps) {
  const config = TAG_CONFIG[tag];
  const Icon = config.icon;

  return (
    <div 
      className={cn(
        'rounded-lg border p-4',
        config.bgClassName,
        className
      )}
      data-semantic-tag={tag}
    >
      {showTag && (
        <div className="flex items-center gap-2 mb-2">
          <Badge 
            variant="outline" 
            className={cn('text-xs font-normal', config.className)}
          >
            <Icon className="h-3 w-3 mr-1" />
            {config.label[language]}
          </Badge>
        </div>
      )}
      <div className="text-sm leading-relaxed">
        {children}
      </div>
      {sources && sources.length > 0 && (
        <div className="mt-3 pt-2 border-t border-current/10">
          <span className="text-xs text-muted-foreground">
            {language === 'sv' ? 'Källor: ' : 'Sources: '}
            {sources.join(', ')}
          </span>
        </div>
      )}
    </div>
  );
}

// ============================================================
// INLINE SEMANTIC TAG
// ============================================================

interface InlineSemanticTagProps {
  tag: SemanticTag;
  children: React.ReactNode;
  language?: 'sv' | 'en';
}

export function InlineSemanticTag({
  tag,
  children,
  language: _language = 'sv',
}: InlineSemanticTagProps) {
  const config = TAG_CONFIG[tag];
  const Icon = config.icon;

  return (
    <span 
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs',
        config.bgClassName,
        config.className
      )}
      data-semantic-tag={tag}
    >
      <Icon className="h-3 w-3" />
      {children}
    </span>
  );
}

// ============================================================
// SEMANTIC WARNING
// ============================================================

interface SemanticWarningProps {
  type: 'no_forecast' | 'no_recommendations' | 'correlation' | 'data_lag';
  language?: 'sv' | 'en';
  className?: string;
}

const WARNING_TEXT = {
  no_forecast: {
    sv: 'Systemet gör inga egna prognoser.',
    en: 'The system makes no forecasts of its own.',
  },
  no_recommendations: {
    sv: 'Systemet ger inga policyrekommendationer.',
    en: 'The system gives no policy recommendations.',
  },
  correlation: {
    sv: 'Samband innebär inte orsakssamband.',
    en: 'Correlation does not imply causation.',
  },
  data_lag: {
    sv: 'Data har fördröjning (1-6 månader).',
    en: 'Data has lag (1-6 months).',
  },
};

export function SemanticWarning({
  type,
  language = 'sv',
  className,
}: SemanticWarningProps) {
  return (
    <div 
      className={cn(
        'flex items-center gap-2 text-xs text-muted-foreground',
        className
      )}
      data-semantic-warning={type}
    >
      <Info className="h-3 w-3 shrink-0" />
      <span>{WARNING_TEXT[type][language]}</span>
    </div>
  );
}

// ============================================================
// DATA TIER BADGE
// ============================================================

interface DataTierBadgeProps {
  tier: 'A' | 'B' | 'C' | 'D';
  language?: 'sv' | 'en';
  showLabel?: boolean;
}

const TIER_CONFIG = {
  A: { label: { sv: 'Tier A – Full statistik', en: 'Tier A – Full statistics' }, className: 'bg-green-100 text-green-800 border-green-300' },
  B: { label: { sv: 'Tier B – God täckning', en: 'Tier B – Good coverage' }, className: 'bg-blue-100 text-blue-800 border-blue-300' },
  C: { label: { sv: 'Tier C – Begränsad', en: 'Tier C – Limited' }, className: 'bg-amber-100 text-amber-800 border-amber-300' },
  D: { label: { sv: 'Tier D – Minimal', en: 'Tier D – Minimal' }, className: 'bg-red-100 text-red-800 border-red-300' },
};

export function DataTierBadge({
  tier,
  language = 'sv',
  showLabel = false,
}: DataTierBadgeProps) {
  const config = TIER_CONFIG[tier];

  return (
    <Badge 
      variant="outline" 
      className={cn('text-xs font-mono', config.className)}
    >
      {showLabel ? config.label[language] : `Tier ${tier}`}
    </Badge>
  );
}

// ============================================================
// PATTERN BLOCK
// ============================================================

interface PatternBlockProps {
  observation: string;
  timeframe: string;
  uncertainty: 'low' | 'medium' | 'high';
  sources: string[];
  dataTier: 'A' | 'B' | 'C' | 'D';
  language?: 'sv' | 'en';
}

const UNCERTAINTY_LABEL = {
  low: { sv: 'Låg osäkerhet', en: 'Low uncertainty' },
  medium: { sv: 'Medel osäkerhet', en: 'Medium uncertainty' },
  high: { sv: 'Hög osäkerhet', en: 'High uncertainty' },
};

export function PatternBlock({
  observation,
  timeframe,
  uncertainty,
  sources,
  dataTier,
  language = 'sv',
}: PatternBlockProps) {
  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm leading-relaxed">{observation}</p>
        <DataTierBadge tier={dataTier} />
      </div>
      
      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
        <span className="bg-muted px-2 py-1 rounded">{timeframe}</span>
        <span className={cn(
          'px-2 py-1 rounded',
          uncertainty === 'low' && 'bg-green-100 text-green-700',
          uncertainty === 'medium' && 'bg-amber-100 text-amber-700',
          uncertainty === 'high' && 'bg-red-100 text-red-700',
        )}>
          {UNCERTAINTY_LABEL[uncertainty][language]}
        </span>
      </div>
      
      <div className="text-xs text-muted-foreground">
        {language === 'sv' ? 'Källor: ' : 'Sources: '}{sources.join(', ')}
      </div>
    </div>
  );
}

// ============================================================
// HISTORICAL CONTEXT BLOCK
// ============================================================

interface HistoricalContextBlockProps {
  conditions: string;
  outcome: string;
  whenNotWorked: string;
  timeLag: string;
  sources: string[];
  language?: 'sv' | 'en';
}

export function HistoricalContextBlock({
  conditions,
  outcome,
  whenNotWorked,
  timeLag,
  sources,
  language = 'sv',
}: HistoricalContextBlockProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-purple-50 dark:bg-purple-950/30 p-4 border-b">
        <Badge variant="outline" className="text-purple-600 border-purple-300 mb-2">
          <History className="h-3 w-3 mr-1" />
          {language === 'sv' ? 'Historisk kontext' : 'Historical context'}
        </Badge>
        <p className="text-sm text-purple-900 dark:text-purple-100">{conditions}</p>
      </div>
      
      <div className="p-4 space-y-3">
        <div>
          <span className="text-xs font-medium text-green-600">
            {language === 'sv' ? 'Observerat utfall:' : 'Observed outcome:'}
          </span>
          <p className="text-sm mt-1">{outcome}</p>
        </div>
        
        <div>
          <span className="text-xs font-medium text-amber-600">
            {language === 'sv' ? 'När det inte fungerade:' : 'When it didn\'t work:'}
          </span>
          <p className="text-sm mt-1">{whenNotWorked}</p>
        </div>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
          <span>{language === 'sv' ? 'Tidsfördröjning: ' : 'Time lag: '}{timeLag}</span>
          <span>{language === 'sv' ? 'Källor: ' : 'Sources: '}{sources.join(', ')}</span>
        </div>
      </div>
    </div>
  );
}

export default SemanticTextBlock;
