import { KPIStatus } from '@/types/kpi';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: KPIStatus;
  className?: string;
}

const statusLabels: Record<KPIStatus, string> = {
  positive: 'STABIL',
  warning: 'AVVIKELSE',
  critical: 'KRITISK',
  neutral: 'NEUTRAL',
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'status-indicator font-mono',
        {
          'status-positive': status === 'positive',
          'status-warning': status === 'warning',
          'status-critical': status === 'critical',
          'bg-muted text-muted-foreground border border-border': status === 'neutral',
        },
        status === 'critical' && 'animate-pulse-critical',
        className
      )}
    >
      {statusLabels[status]}
    </span>
  );
}
