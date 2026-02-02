/**
 * Deepen Button
 * Primary CTA for progressive disclosure on mobile
 * Follows mobile-first: min 44px touch target, clear affordance
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, Layers, BarChart3, FileText, Database } from 'lucide-react';
import { cn } from '@/lib/utils';

type DeepenLevel = 'explanation' | 'method' | 'data' | 'source' | 'full';

interface DeepenButtonProps {
  /** Target level to deepen to */
  level?: DeepenLevel;
  /** Click handler */
  onClick: () => void;
  /** Custom label */
  label?: string;
  /** Variant style */
  variant?: 'default' | 'outline' | 'ghost';
  /** Full width */
  fullWidth?: boolean;
  /** Show icon */
  showIcon?: boolean;
  /** Disabled state */
  disabled?: boolean;
  className?: string;
}

const LEVEL_CONFIG: Record<DeepenLevel, { label: string; icon: React.ReactNode }> = {
  explanation: { label: 'Vad betyder detta?', icon: <FileText className="h-4 w-4" /> },
  method: { label: 'Hur beräknat?', icon: <BarChart3 className="h-4 w-4" /> },
  data: { label: 'Vilka dataset?', icon: <Database className="h-4 w-4" /> },
  source: { label: 'Visa källa', icon: <Layers className="h-4 w-4" /> },
  full: { label: 'Fördjupa', icon: <ChevronRight className="h-4 w-4" /> },
};

export function DeepenButton({
  level = 'full',
  onClick,
  label,
  variant = 'default',
  fullWidth = false,
  showIcon = true,
  disabled = false,
  className,
}: DeepenButtonProps) {
  const config = LEVEL_CONFIG[level];
  const displayLabel = label || config.label;

  return (
    <Button
      onClick={onClick}
      variant={variant}
      disabled={disabled}
      className={cn(
        'min-h-[44px] gap-2',
        fullWidth && 'w-full',
        className
      )}
    >
      {showIcon && config.icon}
      <span>{displayLabel}</span>
      <ChevronRight className="h-4 w-4 ml-auto" />
    </Button>
  );
}

/**
 * Deepen Link - For inline progressive disclosure
 */
interface DeepenLinkProps {
  onClick: () => void;
  label?: string;
  level?: DeepenLevel;
  className?: string;
}

export function DeepenLink({ onClick, label, level = 'full', className }: DeepenLinkProps) {
  const config = LEVEL_CONFIG[level];
  const displayLabel = label || config.label;

  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1 text-primary hover:text-primary/80 text-sm underline underline-offset-2 min-h-[44px] px-1',
        className
      )}
    >
      {displayLabel}
      <ChevronRight className="h-3 w-3" />
    </button>
  );
}

/**
 * Progressive Disclosure Stack - Shows deepen options
 */
interface ProgressiveDisclosureProps {
  onExplanation?: () => void;
  onMethod?: () => void;
  onData?: () => void;
  onSource?: () => void;
  onFull?: () => void;
  className?: string;
}

export function ProgressiveDisclosureStack({
  onExplanation,
  onMethod,
  onData,
  onSource,
  onFull,
  className,
}: ProgressiveDisclosureProps) {
  const actions = [
    { key: 'explanation', handler: onExplanation, level: 'explanation' as DeepenLevel },
    { key: 'method', handler: onMethod, level: 'method' as DeepenLevel },
    { key: 'data', handler: onData, level: 'data' as DeepenLevel },
    { key: 'source', handler: onSource, level: 'source' as DeepenLevel },
    { key: 'full', handler: onFull, level: 'full' as DeepenLevel },
  ].filter(a => a.handler);

  if (actions.length === 0) return null;

  // If only one action, show as primary button
  if (actions.length === 1) {
    return (
      <DeepenButton
        level={actions[0].level}
        onClick={actions[0].handler!}
        fullWidth
        className={className}
      />
    );
  }

  // Multiple actions: show as list
  return (
    <div className={cn('space-y-2', className)}>
      {actions.map(({ key, handler, level }) => (
        <DeepenButton
          key={key}
          level={level}
          onClick={handler!}
          variant="outline"
          fullWidth
        />
      ))}
    </div>
  );
}
