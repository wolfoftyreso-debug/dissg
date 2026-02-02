/**
 * Telia Container
 * 
 * Enforces Telia-grade simplicity principles:
 * - 0 surprises
 * - 0 decisions for user
 * - 1 obvious path forward
 * - Immediate response
 * - Exact language
 * 
 * Part of Block 54.
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { TELIA_UI_RULES } from '@/config/selfLearningCoreConfig';

interface TeliaContainerProps {
  children: React.ReactNode;
  /** Single primary action for this view */
  primaryAction?: React.ReactNode;
  /** Optional secondary info (non-action) */
  secondaryInfo?: React.ReactNode;
  className?: string;
}

/**
 * Container that enforces Telia principles.
 * Max 1 primary action per view.
 */
export function TeliaContainer({
  children,
  primaryAction,
  secondaryInfo,
  className,
}: TeliaContainerProps) {
  return (
    <div className={cn(
      // Base: clean, minimal, immediate
      'relative',
      // No decorative elements
      'bg-background',
      className
    )}>
      {/* Main content - single focus */}
      <div className="space-y-4">
        {children}
      </div>

      {/* Primary action area - max 1 */}
      {primaryAction && (
        <div className="mt-6 flex justify-center">
          {primaryAction}
        </div>
      )}

      {/* Secondary info - non-competing */}
      {secondaryInfo && (
        <div className="mt-4 text-center text-sm text-muted-foreground">
          {secondaryInfo}
        </div>
      )}
    </div>
  );
}

/**
 * Telia-style card: minimal, clear, single purpose.
 */
interface TeliaCardProps {
  title?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function TeliaCard({
  title,
  children,
  action,
  className,
}: TeliaCardProps) {
  return (
    <div className={cn(
      'bg-card border border-border rounded-lg p-4',
      // No shadows, no gradients, no decorations
      className
    )}>
      {title && (
        <h3 className="text-sm font-medium text-foreground mb-3">
          {title}
        </h3>
      )}
      
      <div className="text-sm text-muted-foreground">
        {children}
      </div>

      {action && (
        <div className="mt-4 pt-3 border-t border-border">
          {action}
        </div>
      )}
    </div>
  );
}

/**
 * Telia-style button: obvious, single purpose.
 */
interface TeliaButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

export function TeliaButton({
  variant = 'primary',
  children,
  className,
  ...props
}: TeliaButtonProps) {
  return (
    <button
      className={cn(
        'px-4 py-2 rounded-md text-sm font-medium transition-colors',
        // Clickable must look clickable
        'cursor-pointer',
        // Immediate feedback
        'active:scale-[0.98]',
        // No decorative animations
        'transition-none hover:transition-colors',
        variant === 'primary' && [
          'bg-primary text-primary-foreground',
          'hover:bg-primary/90',
        ],
        variant === 'secondary' && [
          'bg-muted text-muted-foreground',
          'hover:bg-muted/80',
        ],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

/**
 * Telia-style text: exact, minimal.
 */
interface TeliaTextProps {
  children: React.ReactNode;
  emphasis?: boolean;
  muted?: boolean;
  className?: string;
}

export function TeliaText({
  children,
  emphasis,
  muted,
  className,
}: TeliaTextProps) {
  return (
    <span className={cn(
      'text-sm',
      emphasis && 'font-medium text-foreground',
      muted && 'text-muted-foreground',
      !emphasis && !muted && 'text-foreground',
      className
    )}>
      {children}
    </span>
  );
}

export default TeliaContainer;
