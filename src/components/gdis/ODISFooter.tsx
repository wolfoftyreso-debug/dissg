/**
 * ODIS-STYLE FOOTER
 * 
 * Bottenpanel med åtgärdsknappar.
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface FooterAction {
  id: string;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'default' | 'primary' | 'danger';
}

interface ODISFooterProps {
  actions?: FooterAction[];
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
}

export const ODISFooter: React.FC<ODISFooterProps> = ({
  actions = [],
  leftContent,
  rightContent,
}) => {
  return (
    <footer className="border-t-2 border-border bg-muted/30 px-3 py-2">
      <div className="flex items-center justify-between gap-4">
        {/* Left actions */}
        <div className="flex items-center gap-2">
          {actions.map((action) => (
            <button
              key={action.id}
              onClick={action.onClick}
              disabled={action.disabled}
              className={cn(
                "px-3 py-1.5 text-xs font-medium border rounded-sm transition-colors min-h-[32px]",
                action.variant === 'primary'
                  ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
                  : action.variant === 'danger'
                  ? "bg-destructive text-destructive-foreground border-destructive hover:bg-destructive/90"
                  : "bg-background text-foreground border-border hover:bg-muted",
                action.disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              {action.label}
            </button>
          ))}
          {leftContent}
        </div>

        {/* Right content */}
        <div className="flex items-center gap-4">
          {rightContent}
        </div>
      </div>
    </footer>
  );
};

export default ODISFooter;
