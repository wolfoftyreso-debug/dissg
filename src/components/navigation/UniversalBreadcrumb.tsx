/**
 * UNIVERSAL BREADCRUMB
 * ═══════════════════════════════════════════════════════════════
 * 
 * Always visible breadcrumb navigation showing exact position
 * in the DISSG hierarchy: Global → Region → Country → Province → Municipal
 * 
 * Follows Descriptive Clarity Doctrine: text-based markers, no icons.
 * Designed for machine-readability (JSON-LD, aria-labels).
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useGeo, COUNTRIES, GEO_REGIONS } from '@/contexts/GeoContext';
import { 
  type BreadcrumbItem,
  generateEntityJsonLd,
  type EntityLink,
} from '@/lib/link-registry';
import { Helmet } from 'react-helmet-async';

interface UniversalBreadcrumbProps {
  /** Additional context items to append (e.g., indicator, observation) */
  contextItems?: BreadcrumbItem[];
  /** Show data tier badge */
  showDataTier?: boolean;
  /** Custom class */
  className?: string;
  /** Variant: 'full' shows all levels, 'compact' abbreviates */
  variant?: 'full' | 'compact';
}

export function UniversalBreadcrumb({
  contextItems = [],
  showDataTier = false,
  className,
  variant = 'full',
}: UniversalBreadcrumbProps) {
  const { scope, breadcrumbs: geoBreadcrumbs, setScope } = useGeo();
  const location = useLocation();
  
  // Build complete breadcrumb trail
  const breadcrumbs: BreadcrumbItem[] = [
    // Global root
    {
      id: 'global',
      type: 'global',
      code: 'GLOBAL',
      name: 'Global',
      path: '/',
      level: 0,
    },
  ];
  
  // Add region if applicable
  if (scope.level !== 'global') {
    const country = COUNTRIES[scope.code];
    if (country) {
      const region = GEO_REGIONS[country.region];
      if (region) {
        breadcrumbs.push({
          id: country.region,
          type: 'region',
          code: country.region,
          name: region.name,
          path: `/region/${country.region.toLowerCase()}`,
          level: 1,
        });
      }
    } else if (scope.level === 'region') {
      const region = GEO_REGIONS[scope.code];
      if (region) {
        breadcrumbs.push({
          id: scope.code,
          type: 'region',
          code: scope.code,
          name: region.name,
          path: `/region/${scope.code.toLowerCase()}`,
          level: 1,
        });
      }
    }
  }
  
  // Add country if applicable
  if (scope.level === 'country' || scope.level === 'province' || scope.level === 'municipal') {
    const country = COUNTRIES[scope.code];
    if (country) {
      breadcrumbs.push({
        id: scope.code,
        type: 'country',
        code: scope.code,
        name: country.name,
        name_local: country.name_local,
        path: `/country/${scope.code.toLowerCase()}`,
        level: 2,
      });
    }
  }
  
  // Add any context items (indicator, observation, etc.)
  contextItems.forEach((item, index) => {
    breadcrumbs.push({
      ...item,
      level: breadcrumbs.length,
    });
  });
  
  // Generate JSON-LD for current entity
  const currentEntity: EntityLink = {
    id: breadcrumbs[breadcrumbs.length - 1].id,
    type: breadcrumbs[breadcrumbs.length - 1].type,
    code: breadcrumbs[breadcrumbs.length - 1].code,
    name: breadcrumbs[breadcrumbs.length - 1].name,
    name_local: breadcrumbs[breadcrumbs.length - 1].name_local,
    path: breadcrumbs[breadcrumbs.length - 1].path,
  };
  
  const jsonLd = generateEntityJsonLd(currentEntity, breadcrumbs);
  
  // Navigate to specific breadcrumb
  const handleNavigate = (crumb: BreadcrumbItem) => {
    if (crumb.type === 'global') {
      setScope({ level: 'global', code: 'GLOBAL', name: 'Global' });
    } else if (crumb.type === 'region') {
      const region = GEO_REGIONS[crumb.code];
      if (region) {
        setScope({ level: 'region', code: crumb.code, name: region.name });
      }
    } else if (crumb.type === 'country') {
      const country = COUNTRIES[crumb.code];
      if (country) {
        setScope({ 
          level: 'country', 
          code: crumb.code, 
          name: country.name, 
          name_local: country.name_local 
        });
      }
    }
  };

  return (
    <>
      {/* JSON-LD for machine readability */}
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      </Helmet>
      
      {/* Visual breadcrumb */}
      <nav 
        aria-label="Breadcrumb navigation"
        className={cn(
          "bg-muted/50 border-b border-border px-4 py-2",
          "font-mono text-xs",
          className
        )}
      >
        <ol 
          className="flex items-center flex-wrap gap-1"
          itemScope 
          itemType="https://schema.org/BreadcrumbList"
        >
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            const isClickable = !isLast || contextItems.length > 0;
            
            return (
              <li 
                key={crumb.id}
                className="flex items-center"
                itemProp="itemListElement"
                itemScope
                itemType="https://schema.org/ListItem"
              >
                {index > 0 && (
                  <span 
                    className="text-muted-foreground mx-1.5 select-none"
                    aria-hidden="true"
                  >
                    ›
                  </span>
                )}
                
                {isClickable ? (
                  <button
                    onClick={() => handleNavigate(crumb)}
                    className={cn(
                      "hover:text-primary transition-colors",
                      "underline-offset-4 hover:underline",
                      "focus:outline-none focus:ring-1 focus:ring-primary rounded px-1",
                      isLast 
                        ? "text-foreground font-semibold" 
                        : "text-muted-foreground"
                    )}
                    itemProp="item"
                    data-code={crumb.code}
                    data-type={crumb.type}
                    aria-current={isLast ? "page" : undefined}
                  >
                    <span itemProp="name">
                      {variant === 'compact' && index > 0 && crumb.code.length <= 3
                        ? crumb.code
                        : (crumb.name_local || crumb.name)
                      }
                    </span>
                  </button>
                ) : (
                  <span 
                    className="text-foreground font-semibold px-1"
                    itemProp="name"
                    aria-current="page"
                  >
                    {crumb.name_local || crumb.name}
                  </span>
                )}
                
                <meta itemProp="position" content={String(index + 1)} />
              </li>
            );
          })}
          
          {/* Data tier indicator */}
          {showDataTier && scope.level === 'country' && (
            <li className="ml-2 flex items-center">
              <span className="text-muted-foreground">[</span>
              <span 
                className="text-primary font-bold"
                title="Data coverage tier"
              >
                Tier A
              </span>
              <span className="text-muted-foreground">]</span>
            </li>
          )}
        </ol>
        
        {/* Machine-readable position indicator */}
        <div className="sr-only" aria-live="polite">
          Current position: {breadcrumbs.map(b => b.name).join(' › ')}
        </div>
      </nav>
    </>
  );
}

export default UniversalBreadcrumb;
