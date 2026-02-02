/**
 * Method Sidebar
 * 
 * "How this page is built" - always 1 click away.
 * Shows sources, method, uncertainty, version history.
 * 
 * Part of Block 55.
 */

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { 
  Info, ExternalLink, ChevronRight, Database, 
  Settings, AlertTriangle, History, Shield 
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

interface MethodSidebarProps {
  /** Page/entity identifier */
  pageId: string;
  /** Data sources used */
  sources?: {
    name: string;
    url?: string;
    lastUpdated?: string;
  }[];
  /** Method description */
  method?: {
    summary: string;
    details?: string;
  };
  /** Uncertainty information */
  uncertainty?: {
    level: 'low' | 'medium' | 'high';
    description: string;
  };
  /** Version info */
  version?: {
    current: number;
    lastChanged: string;
  };
  className?: string;
}

export function MethodSidebar({
  pageId,
  sources = [],
  method,
  uncertainty,
  version,
  className,
}: MethodSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const uncertaintyColors = {
    low: 'text-status-positive bg-status-positive/10',
    medium: 'text-status-warning bg-status-warning/10',
    high: 'text-status-critical bg-status-critical/10',
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button
          className={cn(
            'flex items-center gap-1.5 text-xs text-muted-foreground',
            'hover:text-foreground transition-colors',
            'px-2 py-1 rounded border border-transparent hover:border-border',
            className
          )}
        >
          <Info className="h-3.5 w-3.5" />
          <span>Hur denna sida byggs</span>
          <ChevronRight className="h-3 w-3" />
        </button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Hur denna sida byggs
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Sources */}
          <section>
            <h3 className="flex items-center gap-2 text-sm font-medium mb-3">
              <Database className="h-4 w-4 text-muted-foreground" />
              Datakällor
            </h3>
            {sources.length > 0 ? (
              <ul className="space-y-2">
                {sources.map((source, i) => (
                  <li key={i} className="text-sm">
                    <div className="flex items-center justify-between">
                      <span>{source.name}</span>
                      {source.url && (
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                    {source.lastUpdated && (
                      <span className="text-xs text-muted-foreground">
                        Uppdaterad: {source.lastUpdated}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                Ingen källinformation tillgänglig.
              </p>
            )}
          </section>

          {/* Method */}
          {method && (
            <section>
              <h3 className="flex items-center gap-2 text-sm font-medium mb-3">
                <Settings className="h-4 w-4 text-muted-foreground" />
                Metod
              </h3>
              <p className="text-sm text-muted-foreground">
                {method.summary}
              </p>
              {method.details && (
                <p className="text-xs text-muted-foreground mt-2">
                  {method.details}
                </p>
              )}
            </section>
          )}

          {/* Uncertainty */}
          {uncertainty && (
            <section>
              <h3 className="flex items-center gap-2 text-sm font-medium mb-3">
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                Osäkerhet
              </h3>
              <Badge 
                variant="outline" 
                className={cn('mb-2', uncertaintyColors[uncertainty.level])}
              >
                {uncertainty.level === 'low' && 'Låg osäkerhet'}
                {uncertainty.level === 'medium' && 'Medel osäkerhet'}
                {uncertainty.level === 'high' && 'Hög osäkerhet'}
              </Badge>
              <p className="text-sm text-muted-foreground">
                {uncertainty.description}
              </p>
            </section>
          )}

          {/* Version */}
          {version && (
            <section>
              <h3 className="flex items-center gap-2 text-sm font-medium mb-3">
                <History className="h-4 w-4 text-muted-foreground" />
                Version
              </h3>
              <div className="text-sm">
                <span className="font-mono">v{version.current}</span>
                <span className="text-muted-foreground ml-2">
                  Senast ändrad: {version.lastChanged}
                </span>
              </div>
            </section>
          )}

          {/* Trust Log Link */}
          <section className="pt-4 border-t border-border">
            <Link
              to={`/trust-log?scope=${encodeURIComponent(pageId)}`}
              className="flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <Shield className="h-4 w-4" />
              Se ändringshistorik i Trust Log
              <ChevronRight className="h-3 w-3" />
            </Link>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default MethodSidebar;
