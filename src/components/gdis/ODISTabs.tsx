/**
 * ODIS-STYLE TAB NAVIGATION
 * 
 * Horisontella flikar i Windows 2000-stil.
 * Varje flik representerar ett huvudmodul.
 */

import React from 'react';
import { cn } from '@/lib/utils';

export interface ODISTab {
  id: string;
  label: string;
  shortLabel?: string;
  disabled?: boolean;
}

interface ODISTabsProps {
  tabs: ODISTab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const ODISTabs: React.FC<ODISTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="border-b border-border bg-muted/20 px-1 pt-1">
      <div className="flex gap-0.5 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => !tab.disabled && onTabChange(tab.id)}
              disabled={tab.disabled}
              className={cn(
                "px-3 py-1.5 text-xs font-medium border border-b-0 rounded-t-sm transition-colors whitespace-nowrap min-h-[32px]",
                isActive
                  ? "bg-background text-foreground border-border shadow-sm relative -mb-px z-10"
                  : "bg-muted/50 text-muted-foreground border-transparent hover:bg-muted hover:text-foreground",
                tab.disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.shortLabel || tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ODISTabs;
