/**
 * DIAGNOSTIC SIDEBAR
 * ═══════════════════════════════════════════════════════════════
 * 
 * Minimalistisk sidopanel för navigation i diagnosinstrumentet.
 * Följer "No Icons Doctrine" - endast textmarkörer i monospace.
 * 56px bred i kollapserat läge per design-specifikation.
 */

import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NavItem {
  path: string;
  label: string;
  shortLabel: string;
  marker: string; // Text-baserad markör istället för ikon
  description: string;
}

const MAIN_NAVIGATION: NavItem[] = [
  {
    path: '/public',
    label: 'Diagnos',
    shortLabel: 'DX',
    marker: '[DX]',
    description: 'Huvuddiagnos och systemöversikt',
  },
  {
    path: '/index',
    label: 'Index',
    shortLabel: 'IX',
    marker: '[IX]',
    description: 'Indexvisning och indikatorer',
  },
  {
    path: '/gdm',
    label: 'Karta',
    shortLabel: 'MAP',
    marker: '[M]',
    description: 'Global diagnostisk karta',
  },
  {
    path: '/oscilloscope-view',
    label: 'Signal',
    shortLabel: 'SIG',
    marker: '[~]',
    description: 'Signalöversikt och trender',
  },
  {
    path: '/data',
    label: 'Data',
    shortLabel: 'DT',
    marker: '[D]',
    description: 'Datautforskare',
  },
  {
    path: '/portfolio',
    label: 'Portfölj',
    shortLabel: 'PORT',
    marker: '[P]',
    description: 'Landsportföljer (Premium)',
  },
];

const SECONDARY_NAVIGATION: NavItem[] = [
  {
    path: '/diagnostics',
    label: 'System',
    shortLabel: 'SYS',
    marker: '[S]',
    description: 'Systemdiagnostik',
  },
  {
    path: '/log',
    label: 'Logg',
    shortLabel: 'LOG',
    marker: '[L]',
    description: 'Systemlogg',
  },
  {
    path: '/budget',
    label: 'Budget',
    shortLabel: 'BUD',
    marker: '[B]',
    description: 'Budgetjämförelse',
  },
  {
    path: '/education',
    label: 'Utbildning',
    shortLabel: 'EDU',
    marker: '[E]',
    description: 'Skola och utbildningsdata',
  },
  {
    path: '/help',
    label: 'Hjälp',
    shortLabel: '?',
    marker: '[?]',
    description: 'Hjälp och dokumentation',
  },
];

interface DiagnosticSidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
  className?: string;
}

export const DiagnosticSidebar: React.FC<DiagnosticSidebarProps> = ({
  collapsed = false,
  onToggle,
  className,
}) => {
  const location = useLocation();

  const renderNavItem = (item: NavItem, isSecondary = false) => {
    const isActive = location.pathname === item.path;
    
    return (
      <NavLink
        key={item.path}
        to={item.path}
        title={item.description}
        className={cn(
          "flex items-center transition-all duration-150",
          "font-mono text-xs",
          "border border-transparent rounded-sm",
          "min-h-[36px]",
          collapsed ? "justify-center px-1" : "px-2 gap-2",
          isActive
            ? "bg-primary text-primary-foreground border-primary"
            : cn(
                "text-muted-foreground hover:text-foreground",
                "hover:bg-muted/50 hover:border-border",
                isSecondary && "opacity-70 hover:opacity-100"
              )
        )}
      >
        <span 
          className={cn(
            "font-bold shrink-0",
            collapsed ? "text-[10px]" : "text-xs"
          )}
        >
          {collapsed ? item.marker : item.shortLabel}
        </span>
        {!collapsed && (
          <span className="truncate">{item.label}</span>
        )}
      </NavLink>
    );
  };

  return (
    <aside
      className={cn(
        "flex flex-col shrink-0 bg-sidebar border-r border-border",
        "transition-all duration-200 ease-in-out",
        collapsed ? "w-[56px]" : "w-[160px]",
        className
      )}
      aria-label="Huvudnavigation"
    >
      {/* Header med toggle */}
      <div className={cn(
        "flex items-center border-b border-border",
        collapsed ? "justify-center h-10" : "px-2 h-10"
      )}>
        <button
          onClick={onToggle}
          className={cn(
            "font-mono text-xs text-muted-foreground hover:text-foreground",
            "transition-colors p-1 rounded-sm hover:bg-muted/50"
          )}
          title={collapsed ? "Expandera meny" : "Minimera meny"}
        >
          {collapsed ? "[»]" : "[«] Meny"}
        </button>
      </div>

      {/* Huvudnavigation */}
      <nav className="flex-1 p-1 space-y-0.5">
        <div className={cn(
          "text-[9px] uppercase tracking-wider text-muted-foreground/60 font-medium",
          collapsed ? "hidden" : "px-2 py-1"
        )}>
          Instrument
        </div>
        {MAIN_NAVIGATION.map((item) => renderNavItem(item))}
      </nav>

      {/* Sekundär navigation */}
      <div className="border-t border-border p-1 space-y-0.5">
        <div className={cn(
          "text-[9px] uppercase tracking-wider text-muted-foreground/60 font-medium",
          collapsed ? "hidden" : "px-2 py-1"
        )}>
          Verktyg
        </div>
        {SECONDARY_NAVIGATION.map((item) => renderNavItem(item, true))}
      </div>

      {/* Footer - version info */}
      <div className={cn(
        "border-t border-border p-2",
        "text-[9px] text-muted-foreground/50 font-mono",
        collapsed ? "text-center" : ""
      )}>
        {collapsed ? "v1" : "DISSG v1.0"}
      </div>
    </aside>
  );
};

export default DiagnosticSidebar;
