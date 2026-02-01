import { LayoutDashboard, BarChart3, FileCheck, Users, TrendingUp, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export type NavItem = 'overview' | 'indicators' | 'decisions' | 'responsibility' | 'analysis' | 'settings';

interface BottomNavProps {
  active: NavItem;
  onNavigate: (item: NavItem) => void;
}

const NAV_ITEMS: { id: NavItem; icon: typeof LayoutDashboard; label: string }[] = [
  { id: 'overview', icon: LayoutDashboard, label: 'Översikt' },
  { id: 'indicators', icon: BarChart3, label: 'Indikatorer' },
  { id: 'decisions', icon: FileCheck, label: 'Beslut' },
  { id: 'responsibility', icon: Users, label: 'Ansvar' },
  { id: 'analysis', icon: TrendingUp, label: 'Analys' },
  { id: 'settings', icon: Settings, label: 'Inställningar' },
];

export function BottomNav({ active, onNavigate }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card pb-safe">
      <div className="mx-auto flex max-w-lg items-center justify-around">
        {NAV_ITEMS.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={cn(
              'flex flex-1 flex-col items-center gap-0.5 py-2 transition-colors',
              active === id
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Icon className="h-5 w-5" />
            <span className="text-[9px] font-medium uppercase tracking-wide">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
