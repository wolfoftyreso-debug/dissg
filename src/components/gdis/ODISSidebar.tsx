/**
 * ODIS-STYLE SIDEBAR (Operating Modes)
 * 
 * Höger sidopanel med vertikal knapplist.
 * Varje knapp representerar ett driftläge.
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

export interface OperatingMode {
  id: string;
  label: string;
  shortLabel?: string;
  active?: boolean;
  disabled?: boolean;
  variant?: 'default' | 'primary' | 'secondary';
}

export interface SecondaryAction {
  id: string;
  label: string;
  onClick?: () => void;
  href?: string;
}

interface ODISSidebarProps {
  title?: string;
  modes: OperatingMode[];
  activeMode: string;
  onModeChange: (modeId: string) => void;
  secondaryActions?: SecondaryAction[];
  footerActions?: React.ReactNode;
}

const DEFAULT_SECONDARY_ACTIONS: SecondaryAction[] = [
  { id: 'log', label: 'Log', href: '/diagnostics' },
  { id: 'data', label: 'Data', href: '/index' },
  { id: 'extras', label: 'Extras', href: '/gedi' },
  { id: 'help', label: 'Help', href: '/gdm' },
];

export const ODISSidebar: React.FC<ODISSidebarProps> = ({
  title = 'Operating modes',
  modes,
  activeMode,
  onModeChange,
  secondaryActions = DEFAULT_SECONDARY_ACTIONS,
  footerActions,
}) => {
  const navigate = useNavigate();

  const handleSecondaryClick = (action: SecondaryAction) => {
    if (action.onClick) {
      action.onClick();
    } else if (action.href) {
      navigate(action.href);
    }
  };

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
                "active:scale-[0.98]",
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
        {secondaryActions.map((action) => (
          <button
            key={action.id}
            onClick={() => handleSecondaryClick(action)}
            className="w-full px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 text-left rounded-sm transition-colors active:scale-[0.98]"
          >
            {action.label}
          </button>
        ))}
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
