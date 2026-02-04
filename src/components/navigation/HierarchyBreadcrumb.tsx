/**
 * ============================================================================
 * DISSG HIERARCHY BREADCRUMB
 * ============================================================================
 * 
 * Visualizes the user's position in the 7-level hierarchy:
 * Civilisation → Världsdel → Nation → Region → System → Indikator → Datapunkt
 * 
 * Always visible, always clickable, ensures navigation context is maintained.
 */

import { Link } from 'react-router-dom';
import { HIERARCHY_LEVELS, type HierarchyLevel } from '@/config/system';
import { cn } from '@/lib/utils';

interface BreadcrumbNode {
  level: HierarchyLevel;
  code: string;
  name: string;
  href?: string;
}

interface HierarchyBreadcrumbProps {
  nodes: BreadcrumbNode[];
  className?: string;
}

export function HierarchyBreadcrumb({ nodes, className }: HierarchyBreadcrumbProps) {
  // Sort nodes by hierarchy order
  const sortedNodes = [...nodes].sort(
    (a, b) => HIERARCHY_LEVELS[a.level].order - HIERARCHY_LEVELS[b.level].order
  );

  return (
    <nav 
      className={cn(
        "flex items-center gap-1 text-xs font-mono text-muted-foreground overflow-x-auto",
        className
      )}
      aria-label="Hierarkisk navigation"
    >
      {sortedNodes.map((node, index) => {
        const isLast = index === sortedNodes.length - 1;
        const levelInfo = HIERARCHY_LEVELS[node.level];
        
        return (
          <span key={node.code} className="flex items-center gap-1 shrink-0">
            {node.href && !isLast ? (
              <Link 
                to={node.href}
                className="hover:text-foreground transition-colors"
                title={`${levelInfo.label}: ${node.name}`}
              >
                {node.name}
              </Link>
            ) : (
              <span 
                className={cn(
                  isLast && "text-foreground font-medium"
                )}
                title={`${levelInfo.label}: ${node.name}`}
              >
                {node.name}
              </span>
            )}
            
            {!isLast && (
              <span className="text-muted-foreground/50">→</span>
            )}
          </span>
        );
      })}
    </nav>
  );
}

// Convenience function to build breadcrumb for common patterns
export function buildNationBreadcrumb(
  continentCode: string,
  continentName: string,
  countryCode: string,
  countryName: string
): BreadcrumbNode[] {
  return [
    { 
      level: 'civilization', 
      code: 'WORLD', 
      name: 'Civilisation',
      href: '/reality-index?country=WORLD'
    },
    { 
      level: 'continent', 
      code: continentCode, 
      name: continentName,
      // href: `/continent/${continentCode}` // Future route
    },
    { 
      level: 'nation', 
      code: countryCode, 
      name: countryName,
      href: `/country/${countryCode}`
    },
  ];
}

export function buildIndicatorBreadcrumb(
  countryCode: string,
  countryName: string,
  systemCode: string,
  systemName: string,
  indicatorCode: string,
  indicatorName: string
): BreadcrumbNode[] {
  return [
    { 
      level: 'civilization', 
      code: 'WORLD', 
      name: 'Civilisation',
      href: '/reality-index?country=WORLD'
    },
    { 
      level: 'nation', 
      code: countryCode, 
      name: countryName,
      href: `/country/${countryCode}`
    },
    { 
      level: 'system', 
      code: systemCode, 
      name: systemName,
    },
    { 
      level: 'indicator', 
      code: indicatorCode, 
      name: indicatorName,
      href: `/indicator/${indicatorCode}`
    },
  ];
}
