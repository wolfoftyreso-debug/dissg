/**
 * Geo Navigation Components
 * Block B: Mobile-first geographic navigation
 */

import React from 'react';
import { ChevronRight, MapPin, Globe, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { GeoNode, GeoContext, GeoLevel } from '@/lib/geo/geoHierarchy';
import { GEO_LEVEL_LABELS, DATA_TIER_DEFINITIONS, MISSING_DATA_FALLBACK } from '@/lib/geo/geoHierarchy';

interface GeoBreadcrumbProps {
  path: Array<{ id: string; name: string; level: GeoLevel }>;
  onNavigate: (nodeId: string) => void;
  className?: string;
}

export function GeoBreadcrumb({ path, onNavigate, className }: GeoBreadcrumbProps) {
  return (
    <nav className={cn('flex items-center gap-1 text-sm overflow-x-auto', className)}>
      <button
        onClick={() => onNavigate('world')}
        className="flex items-center gap-1 text-muted-foreground hover:text-foreground min-h-[44px] px-2 shrink-0"
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">Världen</span>
      </button>
      
      {path.map((node, index) => (
        <React.Fragment key={node.id}>
          <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
          <button
            onClick={() => onNavigate(node.id)}
            className={cn(
              'min-h-[44px] px-2 shrink-0 whitespace-nowrap',
              index === path.length - 1
                ? 'font-medium text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {node.name}
          </button>
        </React.Fragment>
      ))}
    </nav>
  );
}

interface GeoNodeCardProps {
  node: GeoNode;
  onClick: () => void;
  showDataTier?: boolean;
  className?: string;
}

export function GeoNodeCard({ node, onClick, showDataTier = true, className }: GeoNodeCardProps) {
  const tierInfo = node.dataTier ? DATA_TIER_DEFINITIONS[node.dataTier] : null;
  
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors min-h-[44px]',
        !node.hasData && 'opacity-60',
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="font-medium">{node.name}</span>
            {node.nameLocal && node.nameLocal !== node.name && (
              <span className="text-sm text-muted-foreground">({node.nameLocal})</span>
            )}
          </div>
          
          <div className="mt-1 text-xs text-muted-foreground">
            {GEO_LEVEL_LABELS[node.level].sv}
            {node.population && (
              <span className="ml-2">• {formatPopulation(node.population)} inv.</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {showDataTier && tierInfo && (
            <Badge 
              variant="outline" 
              className={cn(
                'text-xs',
                node.dataTier === 'A' && 'border-green-500 text-green-600',
                node.dataTier === 'B' && 'border-blue-500 text-blue-600',
                node.dataTier === 'C' && 'border-orange-500 text-orange-600',
                node.dataTier === 'D' && 'border-red-500 text-red-600'
              )}
            >
              {node.dataTier}
            </Badge>
          )}
          
          {!node.hasData && (
            <Badge variant="secondary" className="text-xs">
              <AlertCircle className="h-3 w-3 mr-1" />
              {MISSING_DATA_FALLBACK.shortText}
            </Badge>
          )}
          
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
    </button>
  );
}

interface GeoListProps {
  nodes: GeoNode[];
  onSelect: (node: GeoNode) => void;
  emptyMessage?: string;
  className?: string;
}

export function GeoList({ nodes, onSelect, emptyMessage, className }: GeoListProps) {
  if (nodes.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Globe className="h-12 w-12 mx-auto mb-4 opacity-30" />
        <p>{emptyMessage || 'Inga geografiska områden hittades'}</p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-2', className)}>
      {nodes.map(node => (
        <GeoNodeCard
          key={node.id}
          node={node}
          onClick={() => onSelect(node)}
        />
      ))}
    </div>
  );
}

interface GeoContextHeaderProps {
  context: GeoContext;
  onNavigateUp: () => void;
  className?: string;
}

export function GeoContextHeader({ context, onNavigateUp, className }: GeoContextHeaderProps) {
  const { current, parent } = context;
  
  return (
    <div className={cn('space-y-2', className)}>
      {/* Breadcrumb */}
      <GeoBreadcrumb
        path={context.path.nodes.map(n => ({ id: n.id, name: n.name, level: n.level }))}
        onNavigate={() => {}} // Would need navigation handler
      />
      
      {/* Current location header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">{current.name}</h1>
          {current.nameLocal && current.nameLocal !== current.name && (
            <p className="text-muted-foreground">{current.nameLocal}</p>
          )}
          <p className="text-sm text-muted-foreground mt-1">
            {GEO_LEVEL_LABELS[current.level].sv}
            {current.population && ` • ${formatPopulation(current.population)} invånare`}
            {current.areaKm2 && ` • ${formatArea(current.areaKm2)}`}
          </p>
        </div>
        
        {parent && (
          <Button
            variant="outline"
            size="sm"
            onClick={onNavigateUp}
            className="min-h-[44px]"
          >
            ↑ {parent.name}
          </Button>
        )}
      </div>
      
      {/* Data tier indicator */}
      {current.dataTier && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Datatillgång:</span>
          <Badge variant="outline">
            {DATA_TIER_DEFINITIONS[current.dataTier].label}
          </Badge>
        </div>
      )}
    </div>
  );
}

// Utility functions
function formatPopulation(pop: number): string {
  if (pop >= 1_000_000) {
    return `${(pop / 1_000_000).toFixed(1)}M`;
  }
  if (pop >= 1_000) {
    return `${(pop / 1_000).toFixed(0)}k`;
  }
  return pop.toString();
}

function formatArea(km2: number): string {
  if (km2 >= 1_000_000) {
    return `${(km2 / 1_000_000).toFixed(2)}M km²`;
  }
  if (km2 >= 1_000) {
    return `${(km2 / 1_000).toFixed(0)}k km²`;
  }
  return `${km2.toFixed(0)} km²`;
}
