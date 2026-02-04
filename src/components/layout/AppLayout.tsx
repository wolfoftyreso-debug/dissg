/**
 * APP LAYOUT
 * ═══════════════════════════════════════════════════════════════
 * 
 * Global layoutkomponent som wrappas runt alla sidor.
 * Innehåller:
 * - DiagnosticSidebar (alltid synlig, 56px kollapsad)
 * - UniversalBreadcrumb (alltid synlig i header)
 * - Main content area
 * 
 * Följer design-specifikationer:
 * - Full-screen skeletal layout (100vh/100vw)
 * - Mobile-first med collapsible sidebar
 */

import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { DiagnosticSidebar } from './DiagnosticSidebar';
import { UniversalBreadcrumb } from '@/components/navigation/UniversalBreadcrumb';
import { useIsMobile } from '@/hooks/use-mobile';
import type { BreadcrumbItem } from '@/lib/link-registry';

interface AppLayoutProps {
  children?: React.ReactNode;
}

// Routes som ska exkluderas från standard-layout (t.ex. fullskärmskartor)
const FULLSCREEN_ROUTES = ['/gdm'];

// Route mappning med typade värden
const ROUTE_BREADCRUMB_MAP: Record<string, { name: string }> = {
  '/public': { name: 'Diagnos' },
  '/index': { name: 'Indexvisning' },
  '/data': { name: 'Datautforskare' },
  '/gdm': { name: 'Global karta' },
  '/oscilloscope-view': { name: 'Signalöversikt' },
  '/diagnostics': { name: 'Systemdiagnostik' },
  '/log': { name: 'Systemlogg' },
  '/budget': { name: 'Budgetjämförelse' },
  '/help': { name: 'Hjälp' },
  '/gedi': { name: 'GEDI' },
  '/self-test': { name: 'Självtest' },
  '/system-audit': { name: 'Systemrevision' },
  '/fault-codes': { name: 'Felkoder' },
  '/wages': { name: 'Lönestatistik' },
  '/democratic-health': { name: 'Demokratisk hälsa' },
};

// Generera route-specifika breadcrumb items
function getRouteBreadcrumbContext(pathname: string): BreadcrumbItem[] {
  const match = ROUTE_BREADCRUMB_MAP[pathname];

  if (match) {
    return [{
      id: pathname,
      type: 'mode' as const,
      code: pathname.replace('/', '').toUpperCase(),
      name: match.name,
      path: pathname,
      level: 3,
    }];
  }

  // Handle dynamic routes
  if (pathname.startsWith('/country/')) {
    return [{
      id: 'country-explorer',
      type: 'mode' as const,
      code: 'COUNTRY',
      name: 'Landsutforskare',
      path: pathname,
      level: 3,
    }];
  }

  if (pathname.startsWith('/indicator/')) {
    return [{
      id: 'indicator-explorer',
      type: 'mode' as const,
      code: 'INDICATOR',
      name: 'Indikator',
      path: pathname,
      level: 3,
    }];
  }

  return [];
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Auto-collapse on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarCollapsed(true);
      setMobileMenuOpen(false);
    }
  }, [isMobile, location.pathname]);

  // Check if current route is fullscreen
  const isFullscreen = FULLSCREEN_ROUTES.includes(location.pathname);

  // Generate route-specific breadcrumb context
  const routeContext = getRouteBreadcrumbContext(location.pathname);

  const handleToggleSidebar = () => {
    if (isMobile) {
      setMobileMenuOpen(!mobileMenuOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  // Fullscreen mode - no sidebar/breadcrumb
  if (isFullscreen) {
    return (
      <div className="min-h-screen w-full bg-background">
        {children || <Outlet />}
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Mobile overlay */}
      {isMobile && mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - alltid synlig på desktop, slide-in på mobil */}
      <div className={cn(
        "z-50",
        isMobile && cn(
          "fixed inset-y-0 left-0 transition-transform duration-200",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )
      )}>
        <DiagnosticSidebar
          collapsed={isMobile ? false : sidebarCollapsed}
          onToggle={handleToggleSidebar}
          className="h-full"
        />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Breadcrumb header */}
        <header className="shrink-0 border-b border-border">
          <div className="flex items-center">
            {/* Mobile menu trigger */}
            {isMobile && (
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-3 font-mono text-xs text-muted-foreground hover:text-foreground border-r border-border"
                aria-label="Öppna meny"
              >
                [≡]
              </button>
            )}
            
            {/* Universal Breadcrumb */}
            <div className="flex-1 min-w-0">
              <UniversalBreadcrumb
                contextItems={routeContext}
                showDataTier={true}
                className="border-none"
              />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
