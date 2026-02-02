/**
 * BLOCK 7: GLOBAL NAVIGATION SYSTEM
 * 
 * Breadcrumbs + "You are here" indicator
 * Struktur: World → Region → Country → System → Indicator
 */

import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Globe, Map, Building2, BarChart3, Activity, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  labelSv: string;
  href?: string;
  icon?: React.ReactNode;
  level: 'world' | 'region' | 'country' | 'system' | 'indicator';
}

interface SystemBreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

const LEVEL_ICONS = {
  world: <Globe className="h-3 w-3" />,
  region: <Map className="h-3 w-3" />,
  country: <Building2 className="h-3 w-3" />,
  system: <BarChart3 className="h-3 w-3" />,
  indicator: <Activity className="h-3 w-3" />,
};

const LEVEL_LABELS = {
  world: 'Världen',
  region: 'Region',
  country: 'Land',
  system: 'System',
  indicator: 'Indikator',
};

export const SystemBreadcrumbs: React.FC<SystemBreadcrumbsProps> = ({ 
  items, 
  className 
}) => {
  if (items.length === 0) return null;

  return (
    <nav 
      aria-label="Breadcrumb navigation" 
      className={cn("flex items-center gap-1 text-sm", className)}
    >
      {/* Home link */}
      <Link 
        to="/" 
        className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Hem"
      >
        <Home className="h-3 w-3" />
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const icon = item.icon || LEVEL_ICONS[item.level];

        return (
          <React.Fragment key={index}>
            <ChevronRight className="h-3 w-3 text-muted-foreground/50" />
            
            {isLast ? (
              <span 
                className="flex items-center gap-1 font-medium text-foreground"
                aria-current="page"
              >
                {icon}
                <span>{item.labelSv}</span>
              </span>
            ) : (
              <Link
                to={item.href || '#'}
                className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
              >
                {icon}
                <span>{item.labelSv}</span>
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

/**
 * "You are here" context indicator
 * Shows where user is in the system hierarchy
 */
export const SystemLocationIndicator: React.FC<{
  level: BreadcrumbItem['level'];
  current: string;
  className?: string;
}> = ({ level, current, className }) => {
  return (
    <div className={cn(
      "flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-sm",
      className
    )}>
      <span className="font-medium uppercase tracking-wider">
        {LEVEL_LABELS[level]}:
      </span>
      <span className="text-foreground font-medium">{current}</span>
    </div>
  );
};

/**
 * Full hierarchy indicator showing complete path
 */
export const SystemHierarchyPath: React.FC<{
  world?: string;
  region?: string;
  country?: string;
  system?: string;
  indicator?: string;
  className?: string;
}> = ({ world = 'Global', region, country, system, indicator, className }) => {
  const parts = [
    { key: 'world', value: world, icon: LEVEL_ICONS.world },
    { key: 'region', value: region, icon: LEVEL_ICONS.region },
    { key: 'country', value: country, icon: LEVEL_ICONS.country },
    { key: 'system', value: system, icon: LEVEL_ICONS.system },
    { key: 'indicator', value: indicator, icon: LEVEL_ICONS.indicator },
  ].filter(p => p.value);

  return (
    <div className={cn("flex items-center flex-wrap gap-1", className)}>
      {parts.map((part, index) => (
        <React.Fragment key={part.key}>
          {index > 0 && <ChevronRight className="h-3 w-3 text-muted-foreground/30" />}
          <span className={cn(
            "flex items-center gap-1 text-xs px-2 py-0.5 rounded-sm",
            index === parts.length - 1 
              ? "bg-primary/10 text-primary font-medium" 
              : "bg-muted text-muted-foreground"
          )}>
            {part.icon}
            <span>{part.value}</span>
          </span>
        </React.Fragment>
      ))}
    </div>
  );
};

export default SystemBreadcrumbs;
