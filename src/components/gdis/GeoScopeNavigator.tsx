/**
 * GEO SCOPE NAVIGATOR
 * 
 * Shows current geographic scope with zoom in/out controls.
 * Displays breadcrumbs: Global → Region → Country
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Globe2,
  MapPin,
  ChevronUp,
  ChevronDown,
  ChevronRight,
  Map,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  useGeo, 
  GeoScope, 
  GEO_REGIONS, 
  COUNTRIES,
  type GeoLevel 
} from '@/contexts/GeoContext';

interface GeoScopeNavigatorProps {
  variant?: 'compact' | 'full' | 'breadcrumb';
  className?: string;
}

const LEVEL_ICONS: Record<GeoLevel, React.ElementType> = {
  global: Globe2,
  region: Map,
  country: MapPin,
  province: MapPin,
  municipal: MapPin,
};

const LEVEL_LABELS: Record<GeoLevel, string> = {
  global: 'Global',
  region: 'Region',
  country: 'Land',
  province: 'Provins',
  municipal: 'Kommun',
};

export function GeoScopeNavigator({ 
  variant = 'compact',
  className 
}: GeoScopeNavigatorProps) {
  const { 
    scope, 
    setScope, 
    zoomOut, 
    canZoomOut, 
    breadcrumbs,
    detectedCountry,
  } = useGeo();

  const Icon = LEVEL_ICONS[scope.level];

  // Navigate to specific scope
  const navigateTo = (newScope: GeoScope) => {
    setScope(newScope);
  };

  // Get available countries for current region
  const getRegionCountries = (regionCode: string) => {
    const region = GEO_REGIONS[regionCode];
    if (!region) return [];
    return region.countries
      .filter(code => COUNTRIES[code])
      .map(code => ({
        code,
        ...COUNTRIES[code],
      }));
  };

  if (variant === 'breadcrumb') {
    return (
      <div className={cn("flex items-center gap-1 text-xs", className)}>
        {breadcrumbs.map((crumb, i) => (
          <React.Fragment key={crumb.code}>
            {i > 0 && <ChevronRight className="h-3 w-3 text-muted-foreground" />}
            <button
              onClick={() => navigateTo(crumb)}
              className={cn(
                "hover:text-primary transition-colors",
                crumb.code === scope.code 
                  ? "text-foreground font-medium" 
                  : "text-muted-foreground"
              )}
            >
              {crumb.name_local || crumb.name}
            </button>
          </React.Fragment>
        ))}
      </div>
    );
  }

  if (variant === 'full') {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        {/* Zoom out button */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={zoomOut}
          disabled={!canZoomOut}
          title="Zooma ut"
        >
          <ChevronUp className="h-4 w-4" />
        </Button>

        {/* Current scope dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 min-w-[140px] justify-start">
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{scope.name_local || scope.name}</span>
              <ChevronDown className="h-3 w-3 ml-auto opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56 bg-popover">
            <DropdownMenuLabel className="text-xs">Byt geografiskt fokus</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            {/* Global option */}
            <DropdownMenuItem onClick={() => navigateTo({ level: 'global', code: 'GLOBAL', name: 'Global' })}>
              <Globe2 className="h-4 w-4 mr-2" />
              Global översikt
              {scope.level === 'global' && <Badge variant="secondary" className="ml-auto text-xs">Aktiv</Badge>}
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs">Regioner</DropdownMenuLabel>
            
            {Object.entries(GEO_REGIONS).map(([code, region]) => (
              <DropdownMenuItem 
                key={code}
                onClick={() => navigateTo({ level: 'region', code, name: region.name })}
              >
                <Map className="h-4 w-4 mr-2" />
                {region.name}
                {scope.level === 'region' && scope.code === code && (
                  <Badge variant="secondary" className="ml-auto text-xs">Aktiv</Badge>
                )}
              </DropdownMenuItem>
            ))}
            
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs">Snabbval</DropdownMenuLabel>
            
            {/* Quick access to detected country */}
            {COUNTRIES[detectedCountry] && (
              <DropdownMenuItem 
                onClick={() => navigateTo({ 
                  level: 'country', 
                  code: detectedCountry, 
                  name: COUNTRIES[detectedCountry].name,
                  name_local: COUNTRIES[detectedCountry].name_local,
                })}
              >
                <MapPin className="h-4 w-4 mr-2" />
                {COUNTRIES[detectedCountry].name_local} (detekterat)
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Breadcrumbs */}
        <div className="hidden md:flex items-center gap-1 text-xs text-muted-foreground">
          {breadcrumbs.map((crumb, i) => (
            <React.Fragment key={crumb.code}>
              {i > 0 && <span>›</span>}
              <button
                onClick={() => navigateTo(crumb)}
                className={cn(
                  "hover:text-primary transition-colors px-1",
                  crumb.code === scope.code && "text-foreground font-medium"
                )}
              >
                {crumb.name_local || crumb.name}
              </button>
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  }

  // Compact variant (default)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className={cn("gap-1.5 font-mono", className)}
        >
          <Icon className="h-3.5 w-3.5" />
          <span className="text-xs">{scope.code}</span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48 bg-popover">
        <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
          {LEVEL_LABELS[scope.level]}: {scope.name_local || scope.name}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* Zoom out option */}
        {canZoomOut && (
          <DropdownMenuItem onClick={zoomOut}>
            <ChevronUp className="h-4 w-4 mr-2" />
            Zooma ut till {scope.level === 'country' ? 'region' : 'global'}
          </DropdownMenuItem>
        )}
        
        {/* Region countries if at region level */}
        {scope.level === 'region' && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs">Länder i {scope.name}</DropdownMenuLabel>
            {getRegionCountries(scope.code).slice(0, 8).map(country => (
              <DropdownMenuItem 
                key={country.code}
                onClick={() => navigateTo({ 
                  level: 'country', 
                  code: country.code, 
                  name: country.name,
                  name_local: country.name_local,
                })}
              >
                <MapPin className="h-4 w-4 mr-2" />
                {country.name_local}
              </DropdownMenuItem>
            ))}
          </>
        )}
        
        {/* Global option */}
        {scope.level !== 'global' && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigateTo({ level: 'global', code: 'GLOBAL', name: 'Global' })}>
              <Globe2 className="h-4 w-4 mr-2" />
              Global översikt
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default GeoScopeNavigator;
