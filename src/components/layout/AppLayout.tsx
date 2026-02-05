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

 import React, { useState, useEffect, useMemo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { DiagnosticSidebar } from './DiagnosticSidebar';
import { UniversalBreadcrumb } from '@/components/navigation/UniversalBreadcrumb';
import { useIsMobile } from '@/hooks/use-mobile';
 import { UserMenu } from '@/components/auth/UserMenu';
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
  '/education': { name: 'Utbildning' },
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

 // Formatera datum på svenska
 function formatSwedishDate(): string {
   const today = new Date();
   return today.toLocaleDateString('sv-SE', {
     year: 'numeric',
     month: 'long',
     day: 'numeric',
   });
 }
 
export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
   
   // Memorera datum så det inte uppdateras vid varje render
   const dateStr = useMemo(() => formatSwedishDate(), []);

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
         {/* Global Header */}
         <header className="shrink-0 border-b border-border bg-card">
           <div className="flex items-center h-12">
             {/* Left section: Mobile menu trigger + System name */}
             <div className="flex items-center">
               {/* Mobile hamburger menu */}
               {isMobile && (
                 <button
                   onClick={() => setMobileMenuOpen(true)}
                   className="p-3 font-mono text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 border-r border-border h-12 flex items-center"
                   aria-label="Öppna meny"
                 >
                   [≡]
                 </button>
               )}
               
               {/* System name */}
               <div className="px-3 border-r border-border h-12 flex items-center">
                 <span className="text-sm font-semibold text-foreground tracking-tight font-mono">
                   DISSG
                 </span>
               </div>
             </div>
             
             {/* Center: Breadcrumb navigation */}
             <div className="flex-1 min-w-0 h-12 flex items-center">
               <UniversalBreadcrumb
                 contextItems={routeContext}
                 showDataTier={!isMobile}
                 className="border-none"
               />
             </div>
             
             {/* Right section: Date, notifications, user */}
             <div className="flex items-center gap-2 px-3">
               {/* Date - only on desktop */}
               {!isMobile && (
                 <div className="text-xs text-muted-foreground font-mono px-2">
                   {dateStr} · CET
                 </div>
               )}
               
               {/* User menu */}
               <div className="border-l border-border pl-3 h-8 flex items-center">
                 <UserMenu />
               </div>
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
