/**
 * Dynamic Menu
 * 
 * Menu items ranked by actual usage, not hardcoded order.
 * - Most visited first
 * - Most cited second
 * - Most recent third
 * 
 * Part of Block 54.
 */

import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { MenuItemStats, rankMenuItems, MENU_CONFIG } from '@/config/selfLearningCoreConfig';
import { ChevronRight } from 'lucide-react';

interface DynamicMenuProps {
  items: MenuItemStats[];
  onSelect: (id: string) => void;
  activeId?: string;
  showStats?: boolean;
  className?: string;
}

export function DynamicMenu({
  items,
  onSelect,
  activeId,
  showStats = false,
  className,
}: DynamicMenuProps) {
  // Rank items by usage
  const rankedItems = useMemo(() => {
    const ranked = rankMenuItems(items);
    
    // Filter: only show items with minimum visits
    const filtered = ranked.filter(item => 
      item.visits >= MENU_CONFIG.minVisitsToShow ||
      item.id === activeId // Always show active item
    );
    
    // Limit visible items
    return filtered.slice(0, MENU_CONFIG.maxVisibleItems);
  }, [items, activeId]);

  if (rankedItems.length === 0) {
    return null;
  }

  return (
    <nav className={cn('space-y-1', className)}>
      {rankedItems.map((item, index) => (
        <button
          key={item.id}
          onClick={() => onSelect(item.id)}
          className={cn(
            'w-full flex items-center justify-between px-3 py-2 rounded-md text-sm',
            'transition-colors',
            item.id === activeId ? [
              'bg-primary/10 text-primary font-medium',
            ] : [
              'text-muted-foreground hover:text-foreground hover:bg-muted/50',
            ]
          )}
        >
          <span className="truncate">{item.label}</span>
          
          <div className="flex items-center gap-2">
            {/* Optional stats badge */}
            {showStats && item.visits > 10 && (
              <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                {item.visits}
              </span>
            )}
            
            <ChevronRight className="h-3 w-3 text-muted-foreground" />
          </div>
        </button>
      ))}
    </nav>
  );
}

/**
 * Minimal horizontal menu variant
 */
interface DynamicTabsProps {
  items: MenuItemStats[];
  onSelect: (id: string) => void;
  activeId?: string;
  className?: string;
}

export function DynamicTabs({
  items,
  onSelect,
  activeId,
  className,
}: DynamicTabsProps) {
  const rankedItems = useMemo(() => {
    return rankMenuItems(items).slice(0, MENU_CONFIG.maxVisibleItems);
  }, [items]);

  return (
    <div className={cn('flex gap-1 overflow-x-auto', className)}>
      {rankedItems.map(item => (
        <button
          key={item.id}
          onClick={() => onSelect(item.id)}
          className={cn(
            'px-3 py-1.5 text-sm rounded-md whitespace-nowrap',
            'transition-colors',
            item.id === activeId ? [
              'bg-primary text-primary-foreground',
            ] : [
              'text-muted-foreground hover:text-foreground hover:bg-muted/50',
            ]
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

export default DynamicMenu;
