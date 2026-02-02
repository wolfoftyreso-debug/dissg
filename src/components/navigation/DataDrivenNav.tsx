/**
 * Data-Driven Navigation
 * 
 * Menus built by actual usage, not editorial preference:
 * - Most visited
 * - Most cited
 * - Most current
 */

import { cn } from '@/lib/utils';
import { NAVIGATION_RULES } from '@/config/simplificationConfig';

interface NavItem {
  label: string;
  href: string;
  metric: number; // visits, citations, or recency score
  metricType: 'visited' | 'cited' | 'current';
}

interface DataDrivenNavProps {
  items: NavItem[];
  maxItems?: number;
  className?: string;
}

/**
 * Navigation that reflects usage, not opinion
 */
export function DataDrivenNav({ 
  items, 
  maxItems = NAVIGATION_RULES.maxTopLevelItems,
  className 
}: DataDrivenNavProps) {
  // Sort by metric (highest first) and limit
  const sortedItems = [...items]
    .sort((a, b) => b.metric - a.metric)
    .slice(0, maxItems);
  
  return (
    <nav className={cn('flex flex-wrap gap-4', className)}>
      {sortedItems.map((item, i) => (
        <a
          key={i}
          href={item.href}
          className="text-foreground/80 hover:text-foreground transition-colors"
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}

interface TopFactsNavProps {
  facts: {
    title: string;
    href: string;
    visits: number;
  }[];
  className?: string;
}

/**
 * Top facts based on visits
 */
export function TopFactsNav({ facts, className }: TopFactsNavProps) {
  const sorted = [...facts]
    .sort((a, b) => b.visits - a.visits)
    .slice(0, 5);
  
  return (
    <nav className={cn('space-y-2', className)}>
      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
        Most Viewed
      </h3>
      <ul className="space-y-1">
        {sorted.map((fact, i) => (
          <li key={i}>
            <a 
              href={fact.href}
              className="text-foreground hover:text-primary transition-colors"
            >
              {fact.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

interface RecentUpdatesNavProps {
  updates: {
    title: string;
    href: string;
    updatedAt: Date;
  }[];
  className?: string;
}

/**
 * Recent updates based on data freshness
 */
export function RecentUpdatesNav({ updates, className }: RecentUpdatesNavProps) {
  const sorted = [...updates]
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 5);
  
  return (
    <nav className={cn('space-y-2', className)}>
      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
        Recently Updated
      </h3>
      <ul className="space-y-1">
        {sorted.map((update, i) => (
          <li key={i} className="flex items-center justify-between">
            <a 
              href={update.href}
              className="text-foreground hover:text-primary transition-colors"
            >
              {update.title}
            </a>
            <span className="text-xs text-muted-foreground">
              {formatRelativeTime(update.updatedAt)}
            </span>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffHours < 1) return 'just now';
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

interface BreadcrumbNavProps {
  items: { label: string; href?: string }[];
  className?: string;
}

/**
 * Minimal breadcrumb - shows hierarchy only
 */
export function BreadcrumbNav({ items, className }: BreadcrumbNavProps) {
  return (
    <nav className={cn('text-sm text-muted-foreground', className)} aria-label="Breadcrumb">
      <ol className="flex items-center gap-1">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && <span>/</span>}
            {item.href ? (
              <a href={item.href} className="hover:text-foreground transition-colors">
                {item.label}
              </a>
            ) : (
              <span className="text-foreground">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
