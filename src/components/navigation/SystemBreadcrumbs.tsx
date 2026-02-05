/**
 * BLOCK 7: GLOBAL NAVIGATION SYSTEM
 * 
 * Breadcrumbs + "You are here" indicator
 * Extended structure: World → Region → Country → Indicator → Method → Data
 * 
 * User always knows:
 * - Where they are
 * - Why this is shown
 * - How to go deeper
 * - How to go back
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { type BreadcrumbLevel } from '@/config/extremeClaritySystem';

export interface BreadcrumbItem {
  label: string;
  labelSv: string;
  href?: string;
  icon?: React.ReactNode;
  level: BreadcrumbLevel;
}

interface SystemBreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

// Text markers instead of icons - per no-icons-doctrine
const LEVEL_MARKERS: Record<BreadcrumbLevel, string> = {
  world: '[W]',
  region: '[R]',
  country: '[C]',
  indicator: '[I]',
  method: '[M]',
  data: '[D]',
};

const LEVEL_LABELS: Record<BreadcrumbLevel, string> = {
  world: 'Världen',
  region: 'Region',
  country: 'Land',
  indicator: 'Indikator',
  method: 'Metod',
  data: 'Data',
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
        className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors font-mono text-xs"
        aria-label="Hem"
      >
        [H]
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const marker = LEVEL_MARKERS[item.level] || '[?]';

        return (
          <React.Fragment key={index}>
            <span className="font-mono text-xs text-muted-foreground/50">/</span>
            
            {isLast ? (
              <span 
                className="flex items-center gap-1 font-medium text-foreground"
                aria-current="page"
              >
                <span className="font-mono text-xs text-muted-foreground">{marker}</span>
                <span>{item.labelSv}</span>
              </span>
            ) : (
              <Link
                to={item.href || '#'}
                className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
              >
                <span className="font-mono text-xs">{marker}</span>
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
  level: BreadcrumbLevel;
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
 * Extended with Method and Data levels
 */
export const SystemHierarchyPath: React.FC<{
  world?: string;
  region?: string;
  country?: string;
  indicator?: string;
  method?: string;
  data?: string;
  className?: string;
}> = ({ world = 'Global', region, country, indicator, method, data, className }) => {
  const parts = [
    { key: 'world' as BreadcrumbLevel, value: world, marker: LEVEL_MARKERS.world },
    { key: 'region' as BreadcrumbLevel, value: region, marker: LEVEL_MARKERS.region },
    { key: 'country' as BreadcrumbLevel, value: country, marker: LEVEL_MARKERS.country },
    { key: 'indicator' as BreadcrumbLevel, value: indicator, marker: LEVEL_MARKERS.indicator },
    { key: 'method' as BreadcrumbLevel, value: method, marker: LEVEL_MARKERS.method },
    { key: 'data' as BreadcrumbLevel, value: data, marker: LEVEL_MARKERS.data },
  ].filter(p => p.value);

  return (
    <div className={cn("flex items-center flex-wrap gap-1", className)}>
      {parts.map((part, index) => (
        <React.Fragment key={part.key}>
          {index > 0 && <span className="font-mono text-xs text-muted-foreground/30">/</span>}
          <span className={cn(
            "flex items-center gap-1 text-xs px-2 py-0.5 rounded-sm",
            index === parts.length - 1 
              ? "bg-primary/10 text-primary font-medium" 
              : "bg-muted text-muted-foreground"
          )}>
            <span className="font-mono text-[10px]">{part.marker}</span>
            <span>{part.value}</span>
          </span>
        </React.Fragment>
      ))}
    </div>
  );
};

/**
 * Depth indicator showing current level in the 5-level pyramid
 */
export const DepthIndicator: React.FC<{
  currentLevel: 1 | 2 | 3 | 4 | 5;
  className?: string;
}> = ({ currentLevel, className }) => {
  const levels = [
    { level: 1, label: 'Observation' },
    { level: 2, label: 'Definition' },
    { level: 3, label: 'Metod' },
    { level: 4, label: 'Begränsning' },
    { level: 5, label: 'Data' },
  ];
  
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {levels.map(({ level, label }) => (
        <div
          key={level}
          className={cn(
            "flex items-center gap-1 px-2 py-0.5 text-xs rounded",
            level === currentLevel
              ? "bg-primary text-primary-foreground font-medium"
              : level < currentLevel
                ? "bg-primary/20 text-primary"
                : "bg-muted text-muted-foreground"
          )}
        >
          <span>{level}</span>
          {level === currentLevel && <span className="hidden sm:inline">· {label}</span>}
        </div>
      ))}
    </div>
  );
};

export default SystemBreadcrumbs;
