import { KPIStatus } from '@/types/kpi';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: KPIStatus;
  className?: string;
  compact?: boolean;
}

const STATUS_CONFIG: Record<KPIStatus, { label: string; dotClass: string; bgClass: string }> = {
  positive: {
    label: 'Stabil',
    dotClass: 'bg-status-positive',
    bgClass: 'bg-status-positive/10 text-status-positive',
  },
  warning: {
    label: 'Avvikelse',
    dotClass: 'bg-status-warning',
    bgClass: 'bg-status-warning/12 text-amber-700',
  },
  critical: {
    label: 'Kritisk',
    dotClass: 'bg-status-critical',
    bgClass: 'bg-status-critical/10 text-status-critical',
  },
  neutral: {
    label: 'Neutral',
    dotClass: 'bg-status-neutral',
    bgClass: 'bg-muted text-muted-foreground',
  },
};

export function StatusBadge({ status, className, compact }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  if (compact) {
    return (
      <div 
        className={cn(
          'h-2.5 w-2.5 rounded-sm',
          config.dotClass,
          status === 'critical' && 'animate-pulse',
          className
        )}
        title={config.label}
      />
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-sm px-2 py-0.5 text-xs font-semibold',
        config.bgClass,
        className
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-sm', config.dotClass)} />
      {config.label}
    </span>
  );
}
