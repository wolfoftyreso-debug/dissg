/**
 * SYSTEM BREADCRUMBS
 * 
 * Subtila brödsmulor som alltid visar var användaren befinner sig
 * i systemhierarkin:
 * 
 * Civilisation → Världsdel → Nation → Region → System → Indikator → Datapunkt
 * 
 * Alltid synliga, alltid navigerbara.
 */

import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface BreadcrumbItem {
  id: string;
  label: string;
  labelSv: string;
  level: 'civilization' | 'continent' | 'nation' | 'region' | 'system' | 'indicator' | 'datapoint' | 'world' | 'method';
  href?: string;
  onClick?: () => void;
}

interface SystemBreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
  size?: 'sm' | 'md';
}

// Level labels for reference
const LEVEL_LABELS: Record<BreadcrumbItem['level'], string> = {
  civilization: 'Civilisation',
  continent: 'Världsdel',
  nation: 'Nation',
  region: 'Region',
  system: 'System',
  indicator: 'Indikator',
  datapoint: 'Datapunkt',
  world: 'Världen',
  method: 'Metod'
};

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export function SystemBreadcrumbs({ 
  items, 
  className,
  showHome = true,
  size = 'sm'
}: SystemBreadcrumbsProps) {
  const navigate = useNavigate();

  const handleClick = (item: BreadcrumbItem) => {
    if (item.onClick) {
      item.onClick();
    } else if (item.href) {
      navigate(item.href);
    }
  };

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm'
  };

  return (
    <nav 
      aria-label="Brödsmulor" 
      className={cn(
        "flex items-center gap-1 py-2 px-1 text-muted-foreground",
        sizeClasses[size],
        className
      )}
    >
      {showHome && (
        <>
          <button
            onClick={() => navigate('/')}
            className="p-1 hover:text-foreground hover:bg-muted rounded transition-colors"
            title="Global översikt"
          >
            <Home className="h-3 w-3" />
          </button>
          {items.length > 0 && <ChevronRight className="h-3 w-3 shrink-0 opacity-50" />}
        </>
      )}

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const isClickable = !!item.href || !!item.onClick;

        return (
          <React.Fragment key={item.id}>
            {isClickable && !isLast ? (
              <button
                onClick={() => handleClick(item)}
                className="hover:text-foreground hover:underline underline-offset-2 transition-colors whitespace-nowrap"
                title={`${LEVEL_LABELS[item.level]}: ${item.labelSv}`}
              >
                {item.labelSv}
              </button>
            ) : (
              <span 
                className={cn(
                  "whitespace-nowrap",
                  isLast ? "text-foreground font-medium" : ""
                )}
                title={`${LEVEL_LABELS[item.level]}: ${item.labelSv}`}
              >
                {item.labelSv}
              </span>
            )}

            {!isLast && (
              <ChevronRight className="h-3 w-3 shrink-0 opacity-50" />
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// LOCATION INDICATOR
// ═══════════════════════════════════════════════════════════════════════════

interface LocationIndicatorProps {
  level: BreadcrumbItem['level'];
  label: string;
  className?: string;
}

export function LocationIndicator({ level, label, className }: LocationIndicatorProps) {
  return (
    <div className={cn("flex items-center gap-2 text-xs", className)}>
      <span className="text-muted-foreground">{LEVEL_LABELS[level]}:</span>
      <span className="font-medium">{label}</span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// HIERARCHY PATH
// ═══════════════════════════════════════════════════════════════════════════

type HierarchyPath = {
  civilization?: string;
  continent?: string;
  nation?: string;
  region?: string;
  system?: string;
  indicator?: string;
  datapoint?: string;
};

interface HierarchyPathProps {
  path: HierarchyPath;
  className?: string;
  onNavigate?: (level: keyof HierarchyPath, value: string) => void;
}

export function HierarchyPathComponent({ path, className, onNavigate }: HierarchyPathProps) {
  const levels: { key: keyof typeof path; label: string }[] = [
    { key: 'civilization', label: 'Civilisation' },
    { key: 'continent', label: 'Världsdel' },
    { key: 'nation', label: 'Nation' },
    { key: 'region', label: 'Region' },
    { key: 'system', label: 'System' },
    { key: 'indicator', label: 'Indikator' },
    { key: 'datapoint', label: 'Datapunkt' }
  ];

  const activeLevels = levels.filter(l => path[l.key]);

  return (
    <div className={cn("flex flex-wrap items-center gap-1 text-xs", className)}>
      {activeLevels.map((level, index) => {
        const value = path[level.key]!;
        const isLast = index === activeLevels.length - 1;
        const isClickable = onNavigate && !isLast;

        return (
          <React.Fragment key={level.key}>
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">{level.label}:</span>
              {isClickable ? (
                <button
                  onClick={() => onNavigate(level.key, value)}
                  className="text-primary hover:underline underline-offset-2"
                >
                  {value}
                </button>
              ) : (
                <span className="font-medium">{value}</span>
              )}
            </div>
            {!isLast && <ChevronRight className="h-3 w-3 text-muted-foreground/50" />}
          </React.Fragment>
        );
      })}
    </div>
  );
}
