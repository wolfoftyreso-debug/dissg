import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

export type NavItem = 'priority' | 'overview' | 'indicators' | 'decisions' | 'responsibility' | 'analysis' | 'compact';

interface BottomNavProps {
  active: NavItem;
  onNavigate: (item: NavItem) => void;
}

/**
 * Navigation items with descriptive labels instead of abstract icons
 * Each item has a clear, action-oriented label that explains what the section does
 */
const NAV_ITEMS: { id: NavItem; label: string; description: string; link?: string }[] = [
  { id: 'priority', label: 'Prioritet', description: 'Vad som kräver uppmärksamhet nu' },
  { id: 'overview', label: 'Översikt', description: 'Systemets totala tillstånd' },
  { id: 'indicators', label: 'Indikatorer', description: 'Mätbara datapunkter' },
  { id: 'decisions', label: 'Beslut', description: 'Politiska händelser och effekter' },
  { id: 'responsibility', label: 'Ansvar', description: 'Vem påverkar vad' },
  { id: 'analysis', label: 'Analys', description: 'Samband och mönster' },
  { id: 'compact', label: 'Global', description: 'Världsläget kompakt', link: '/compact' },
];

export function BottomNav({ active, onNavigate }: BottomNavProps) {
  const navigate = useNavigate();

  const handleClick = (item: typeof NAV_ITEMS[0]) => {
    if (item.link) {
      navigate(item.link);
    } else {
      onNavigate(item.id);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card pb-safe">
      <div className="mx-auto flex max-w-2xl items-center justify-around">
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleClick(item)}
              className={cn(
                'flex flex-1 flex-col items-center gap-0.5 py-2.5 px-1 transition-colors relative group',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
              title={item.description}
            >
              {/* Active indicator bar */}
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
              )}
              
              {/* Label only - no icon */}
              <span className={cn(
                "text-[10px] font-medium tracking-wide text-center leading-tight",
                isActive && "font-semibold"
              )}>
                {item.label}
              </span>
              
              {/* Hover tooltip with description */}
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-popover border rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                <span className="text-xs text-popover-foreground">{item.description}</span>
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
