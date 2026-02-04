/**
 * INDEX CATEGORY PANEL - Avanza-inspired
 * 
 * Collapsible panel showing indices within a category.
 * Clean, professional financial app aesthetic.
 * 
 * NO ICONS - text markers only per design doctrine.
 */

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import type { IndexDefinition, IndexCategory } from '@/lib/lambda';

interface CategoryInfo {
  code: IndexCategory;
  name_sv: string;
  name_en: string;
}

interface IndexCategoryPanelProps {
  category: CategoryInfo;
  indices: IndexDefinition[];
  viewMode: 'grid' | 'list';
  onSelectIndex: (index: IndexDefinition) => void;
  defaultOpen?: boolean;
  className?: string;
}

// Text markers for categories
const CATEGORY_MARKERS: Record<IndexCategory, string> = {
  living_basic: '[LEVNAD]',
  shadow_economy: '[SKUGGA]',
  health_function: '[HÄLSA]',
  social_cultural: '[SOCIAL]',
  productivity_work: '[ARBETE]',
  environmental: '[MILJÖ]',
  governance: '[STYRNING]',
};

// Direction markers
const DIRECTION_MARKERS = {
  higher_better: '[+]',
  lower_better: '[−]',
  neutral_optimal: '[~]',
};

// Avanza-style category accent colors (left border + text)
const CATEGORY_ACCENTS: Record<IndexCategory, { border: string; text: string; bg: string }> = {
  living_basic: { border: 'border-l-amber-500', text: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50/50 dark:bg-amber-950/20' },
  shadow_economy: { border: 'border-l-slate-500', text: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-50/50 dark:bg-slate-950/20' },
  health_function: { border: 'border-l-rose-500', text: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50/50 dark:bg-rose-950/20' },
  social_cultural: { border: 'border-l-violet-500', text: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50/50 dark:bg-violet-950/20' },
  productivity_work: { border: 'border-l-blue-500', text: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50/50 dark:bg-blue-950/20' },
  environmental: { border: 'border-l-emerald-500', text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50/50 dark:bg-emerald-950/20' },
  governance: { border: 'border-l-orange-500', text: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50/50 dark:bg-orange-950/20' },
};

export function IndexCategoryPanel({
  category,
  indices,
  viewMode,
  onSelectIndex,
  defaultOpen = true,
  className,
}: IndexCategoryPanelProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const accent = CATEGORY_ACCENTS[category.code];

  if (indices.length === 0) return null;

  return (
    <div className={cn("space-y-0", className)}>
      {/* Category Header - Avanza style with left accent border */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between px-4 py-3 rounded-t-lg border border-b-0",
          "transition-colors hover:bg-muted/30",
          accent.bg,
          accent.border,
          "border-l-4"
        )}
      >
        <div className="flex items-center gap-3">
          <span className={cn("font-mono text-sm font-semibold", accent.text)}>
            {CATEGORY_MARKERS[category.code]}
          </span>
          <div className="text-left">
            <h3 className={cn("font-semibold", accent.text)}>{category.name_sv}</h3>
            <p className="text-xs text-muted-foreground">{category.name_en}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 font-mono text-sm text-muted-foreground">
          <span>{indices.length} index</span>
          <span>{isOpen ? '[−]' : '[+]'}</span>
        </div>
      </button>

      {/* Index Cards Container */}
      {isOpen && (
        <div className="border border-t-0 rounded-b-lg p-4 bg-card">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {indices.map(index => (
                <IndexCard 
                  key={index.code} 
                  index={index} 
                  onClick={() => onSelectIndex(index)}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {indices.map(index => (
                <IndexRow 
                  key={index.code} 
                  index={index} 
                  onClick={() => onSelectIndex(index)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Avanza-style Index Card
function IndexCard({ 
  index, 
  onClick 
}: { 
  index: IndexDefinition; 
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group cursor-pointer rounded-lg border bg-background p-4",
        "hover:border-primary/40 hover:shadow-sm transition-all"
      )}
    >
      {/* Header: Code + Direction */}
      <div className="flex items-center justify-between mb-2">
        <span className="inline-flex items-center px-2 py-0.5 rounded border text-xs font-mono bg-muted/50">
          {index.code}
        </span>
        <span className="text-xs font-mono text-muted-foreground">
          {DIRECTION_MARKERS[index.direction]}
        </span>
      </div>

      {/* Title */}
      <h4 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors line-clamp-1">
        {index.name_sv}
      </h4>

      {/* Description */}
      <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
        {index.description}
      </p>

      {/* Footer: Frequency + Arrow */}
      <div className="flex items-center justify-between pt-2 border-t text-xs font-mono text-muted-foreground">
        <span>
          [TID] {index.update_frequency === 'annual' ? 'Årlig' : 
           index.update_frequency === 'quarterly' ? 'Kvartal' :
           index.update_frequency === 'monthly' ? 'Månad' : 'Vecka'}
        </span>
        <span className="group-hover:translate-x-1 transition-transform">[→]</span>
      </div>
    </div>
  );
}

// Avanza-style Index Row (list view)
function IndexRow({ 
  index, 
  onClick 
}: { 
  index: IndexDefinition; 
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group flex items-center gap-4 p-3 rounded-lg border bg-background cursor-pointer",
        "hover:border-primary/40 hover:bg-muted/30 transition-all"
      )}
    >
      {/* Code Badge */}
      <span className="shrink-0 inline-flex items-center justify-center px-2 py-1 rounded border text-xs font-mono bg-muted/50 min-w-[160px]">
        {index.code}
      </span>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm group-hover:text-primary transition-colors truncate">
          {index.name_sv}
        </h4>
        <p className="text-xs text-muted-foreground truncate">
          {index.description}
        </p>
      </div>

      {/* Meta */}
      <div className="shrink-0 flex items-center gap-4 text-xs font-mono text-muted-foreground">
        <span>[TID] {index.update_frequency === 'annual' ? 'År' : 
         index.update_frequency === 'quarterly' ? 'Kv' :
         index.update_frequency === 'monthly' ? 'Mån' : 'V'}</span>
        <span>{DIRECTION_MARKERS[index.direction]}</span>
        <span className="group-hover:translate-x-1 transition-transform">[→]</span>
      </div>
    </div>
  );
}

export default IndexCategoryPanel;
