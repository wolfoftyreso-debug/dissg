import { cn } from '@/lib/utils';

interface ConfidenceBarProps {
  value: number; // 0-100
  className?: string;
}

export function ConfidenceBar({ value, className }: ConfidenceBarProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="h-1 w-16 overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            'h-full transition-all',
            value >= 90 && 'bg-status-positive',
            value >= 70 && value < 90 && 'bg-status-warning',
            value < 70 && 'bg-status-critical'
          )}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="font-mono text-xs text-muted-foreground">{value}%</span>
    </div>
  );
}
