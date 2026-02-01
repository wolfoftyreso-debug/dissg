import { Bell, User } from 'lucide-react';
import { KPI } from '@/types/kpi';
import { cn } from '@/lib/utils';

interface AppHeaderProps {
  kpis: KPI[];
  role?: string;
}

export function AppHeader({ kpis, role = 'Statsminister' }: AppHeaderProps) {
  const criticalCount = kpis.filter(k => k.status === 'critical').length;
  const hasAlerts = criticalCount > 0;

  const today = new Date();
  const dateStr = today.toLocaleDateString('sv-SE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const timeZone = 'CET';

  return (
    <header className="border-b border-border bg-card px-4 py-2.5">
      <div className="flex items-center justify-between">
        {/* Left: System name */}
        <div className="flex items-baseline gap-2">
          <h1 className="text-sm font-semibold text-foreground tracking-tight">
            Nationellt Ledningssystem
          </h1>
        </div>

        {/* Right: Date, notifications, profile */}
        <div className="flex items-center gap-4">
          {/* Date and timezone - diskret */}
          <div className="hidden sm:block text-right">
            <p className="text-xs text-muted-foreground">
              {dateStr} · {timeZone}
            </p>
          </div>

          {/* Notification bell - endast systemvarningar */}
          <button 
            className={cn(
              "relative p-1.5 rounded-sm transition-colors",
              hasAlerts 
                ? "text-status-critical hover:bg-status-critical/10" 
                : "text-muted-foreground hover:bg-muted"
            )}
            title={hasAlerts ? `${criticalCount} kritiska varningar` : 'Inga varningar'}
          >
            <Bell className="h-4 w-4" />
            {hasAlerts && (
              <span className="absolute -right-0.5 -top-0.5 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-status-critical opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-status-critical" />
              </span>
            )}
          </button>

          {/* Profile / behörighet */}
          <div className="flex items-center gap-1.5 border-l border-border pl-4">
            <User className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs font-medium text-foreground">{role}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
