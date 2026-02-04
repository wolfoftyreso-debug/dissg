/**
 * INDEX CATEGORY PANEL
 * 
 * Collapsible panel showing indices within a category.
 * Supports grid and list view modes.
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  ChevronDown,
  ChevronUp,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Minus,
  Activity,
  Heart,
  Users,
  Briefcase,
  DollarSign,
  Building2,
  Leaf,
  Clock,
  Globe2,
} from 'lucide-react';
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

const CATEGORY_ICONS: Record<IndexCategory, React.ReactNode> = {
  living_basic: <DollarSign className="h-5 w-5" />,
  shadow_economy: <Activity className="h-5 w-5" />,
  health_function: <Heart className="h-5 w-5" />,
  social_cultural: <Users className="h-5 w-5" />,
  productivity_work: <Briefcase className="h-5 w-5" />,
  environmental: <Leaf className="h-5 w-5" />,
  governance: <Building2 className="h-5 w-5" />,
};

const CATEGORY_COLORS: Record<IndexCategory, string> = {
  living_basic: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
  shadow_economy: 'bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/20',
  health_function: 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20',
  social_cultural: 'bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/20',
  productivity_work: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
  environmental: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
  governance: 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20',
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

  if (indices.length === 0) return null;

  return (
    <Collapsible 
      open={isOpen} 
      onOpenChange={setIsOpen}
      className={cn("space-y-3", className)}
    >
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-between p-4 h-auto rounded-lg border",
            CATEGORY_COLORS[category.code]
          )}
        >
          <div className="flex items-center gap-3">
            {CATEGORY_ICONS[category.code]}
            <div className="text-left">
              <h3 className="font-semibold">{category.name_sv}</h3>
              <p className="text-xs opacity-75">{category.name_en}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-background/50">
              {indices.length} index
            </Badge>
            {isOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </div>
        </Button>
      </CollapsibleTrigger>

      <CollapsibleContent className="space-y-3">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {indices.map(index => (
              <IndexMiniCard 
                key={index.code} 
                index={index} 
                onClick={() => onSelectIndex(index)}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {indices.map(index => (
              <IndexListRow 
                key={index.code} 
                index={index} 
                onClick={() => onSelectIndex(index)}
              />
            ))}
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}

// Mini card for grid view
function IndexMiniCard({ 
  index, 
  onClick 
}: { 
  index: IndexDefinition; 
  onClick: () => void;
}) {
  const directionIcon = {
    higher_better: <TrendingUp className="h-3 w-3 text-trend-up" />,
    lower_better: <TrendingDown className="h-3 w-3 text-trend-down" />,
    neutral_optimal: <Minus className="h-3 w-3 text-trend-stable" />,
  };

  return (
    <Card 
      className="cursor-pointer hover:border-primary/50 hover:shadow-sm transition-all group"
      onClick={onClick}
    >
      <CardContent className="p-4 space-y-2">
        <div className="flex items-start justify-between">
          <Badge variant="outline" className="text-xs font-mono">
            {index.code}
          </Badge>
          {directionIcon[index.direction]}
        </div>
        
        <h4 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-1">
          {index.name_sv}
        </h4>
        
        <p className="text-xs text-muted-foreground line-clamp-2">
          {index.description}
        </p>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {index.update_frequency === 'annual' ? 'Årlig' : 
             index.update_frequency === 'quarterly' ? 'Kvartal' :
             index.update_frequency === 'monthly' ? 'Månad' : 'Vecka'}
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
        </div>
      </CardContent>
    </Card>
  );
}

// Row for list view
function IndexListRow({ 
  index, 
  onClick 
}: { 
  index: IndexDefinition; 
  onClick: () => void;
}) {
  return (
    <div
      className="flex items-center gap-4 p-3 rounded-lg border hover:border-primary/50 hover:bg-muted/50 cursor-pointer transition-colors group"
      onClick={onClick}
    >
      <Badge variant="outline" className="font-mono shrink-0 min-w-[140px] justify-center text-xs">
        {index.code}
      </Badge>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm group-hover:text-primary transition-colors truncate">
          {index.name_sv}
        </h4>
        <p className="text-xs text-muted-foreground truncate">
          {index.description}
        </p>
      </div>

      <div className="flex items-center gap-3 shrink-0 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Globe2 className="h-3 w-3" />
          {index.geo_coverage.toUpperCase()}
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {index.update_frequency === 'annual' ? 'År' : 
           index.update_frequency === 'quarterly' ? 'Kv' :
           index.update_frequency === 'monthly' ? 'Mån' : 'V'}
        </div>
        <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
}

export default IndexCategoryPanel;
