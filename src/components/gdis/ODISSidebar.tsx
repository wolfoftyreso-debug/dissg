/**
 * ODIS-STYLE SIDEBAR (Operating Modes)
 * 
 * Höger sidopanel med vertikal knapplist.
 * Varje knapp representerar ett driftläge.
 */

import React from 'react';
import { cn } from '@/lib/utils';

export interface OperatingMode {
  id: string;
  label: string;
  shortLabel?: string;
  active?: boolean;
  disabled?: boolean;
  variant?: 'default' | 'primary' | 'secondary';
}

interface ODISSidebarProps {
  title?: string;
  modes: OperatingMode[];
  activeMode: string;
  onModeChange: (modeId: string) => void;
  footerActions?: React.ReactNode;
}

export const ODISSidebar: React.FC<ODISSidebarProps> = ({
  title = 'Operating modes',
  modes,
  activeMode,
  onModeChange,
  footerActions,
}) => {
  return (
    <aside className="w-[140px] lg:w-[160px] border-l border-border bg-muted/20 flex flex-col shrink-0">
      {/* Header */}
      <div className="px-2 py-2 border-b border-border">
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
          {title}
        </span>
      </div>

      {/* Mode buttons */}
      <div className="flex-1 p-2 space-y-1">
        {modes.map((mode) => {
          const isActive = activeMode === mode.id;
          return (
            <button
              key={mode.id}
              onClick={() => !mode.disabled && onModeChange(mode.id)}
              disabled={mode.disabled}
              className={cn(
                "w-full px-2 py-2 text-xs font-medium text-left rounded-sm border transition-all min-h-[36px]",
                isActive
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-background text-foreground border-border hover:bg-muted hover:border-muted-foreground/30",
                mode.disabled && "opacity-40 cursor-not-allowed"
              )}
            >
              <span className="hidden lg:inline">{mode.label}</span>
              <span className="lg:hidden">{mode.shortLabel || mode.label}</span>
            </button>
          );
        })}
      </div>

      {/* Divider section - secondary modes */}
      <div className="border-t border-border p-2 space-y-1">
        <button className="w-full px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground text-left">
          Log
        </button>
        <button className="w-full px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground text-left">
          Data
        </button>
        <button className="w-full px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground text-left">
          Extras
        </button>
        <button className="w-full px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground text-left">
          Help
        </button>
      </div>

      {/* Footer */}
      {footerActions && (
        <div className="border-t border-border p-2">
          {footerActions}
        </div>
      )}
    </aside>
  );
};

export default ODISSidebar;
