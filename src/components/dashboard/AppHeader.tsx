import { Bell, User } from 'lucide-react';
import { KPI } from '@/types/kpi';

interface AppHeaderProps {
  kpis: KPI[];
  role?: string;
}

export function AppHeader({ kpis, role = 'Statsminister' }: AppHeaderProps) {
  const criticalCount = kpis.filter(k => k.status === 'critical').length;
  const hasAlerts = criticalCount > 0;

  const today = new Date().toLocaleDateString('sv-SE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="border-b border-border bg-card px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left: System name and date */}
        <div>
          <h1 className="text-sm font-semibold text-foreground">
            Nationellt Ledningssystem
          </h1>
          <p className="text-xs text-muted-foreground capitalize">
            {today}
          </p>
        </div>

        {/* Right: Notifications and profile */}
        <div className="flex items-center gap-3">
          {/* Notification bell */}
          <button className="relative rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground">
            <Bell className="h-5 w-5" />
            {hasAlerts && (
              <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-status-critical opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-status-critical" />
              </span>
            )}
          </button>

          {/* Profile */}
          <div className="flex items-center gap-2 rounded-full bg-muted px-3 py-1.5">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-medium text-foreground">{role}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
