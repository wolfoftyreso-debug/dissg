/**
 * GEO SCOPE NAVIGATOR
 * 
 * Shows current geographic scope with zoom in/out controls.
 * Displays breadcrumbs: Global → Region → Country
 * NO ICONS - text markers only per design doctrine.
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
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from '@/components/ui/dropdown-menu';
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

const LEVEL_MARKERS: Record<GeoLevel, string> = {
  global: '[GLOBAL]',
  region: '[REGION]',
  country: '[LAND]',
  province: '[PROVINS]',
  municipal: '[KOMMUN]',
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

  const navigateTo = (newScope: GeoScope) => {
    setScope(newScope);
  };

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

  // Get all countries sorted alphabetically
  const getAllCountries = () => {
    return Object.entries(COUNTRIES)
      .map(([code, data]) => ({ code, ...data }))
      .sort((a, b) => a.name_local.localeCompare(b.name_local));
  };

  if (variant === 'breadcrumb') {
    return (
      <div className={cn("flex items-center gap-1 text-xs font-mono", className)}>
        {breadcrumbs.map((crumb, i) => (
          <React.Fragment key={crumb.code}>
            {i > 0 && <span className="text-muted-foreground">›</span>}
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
      <div className={cn("flex items-center gap-2 font-mono", className)}>
        {/* Zoom out button */}
        <Button
          variant="ghost"
          size="sm"
          className="font-mono"
          onClick={zoomOut}
          disabled={!canZoomOut}
          title="Zooma ut"
        >
          [−]
        </Button>

        {/* Current scope dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 min-w-[140px] justify-start font-mono">
              <span className="text-xs text-muted-foreground">{LEVEL_MARKERS[scope.level]}</span>
              <span className="truncate">{scope.name_local || scope.name}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64 bg-popover font-mono">
            <DropdownMenuLabel className="text-xs font-mono">BYT GEOGRAFISKT FOKUS</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            {/* Global option */}
            <DropdownMenuItem 
              onClick={() => navigateTo({ level: 'global', code: 'GLOBAL', name: 'Global' })}
              className="font-mono"
            >
              [GLOBAL] Global översikt
              {scope.level === 'global' && <Badge variant="secondary" className="ml-auto text-xs font-mono">[AKTIV]</Badge>}
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs font-mono">REGIONER</DropdownMenuLabel>
            
            {Object.entries(GEO_REGIONS).map(([code, region]) => (
              <DropdownMenuSub key={code}>
                <DropdownMenuSubTrigger className="font-mono">
                  [REGION] {region.name}
                  {scope.level === 'region' && scope.code === code && (
                    <Badge variant="secondary" className="ml-auto text-xs font-mono">[AKTIV]</Badge>
                  )}
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="bg-popover font-mono max-h-80 overflow-y-auto">
                    <DropdownMenuItem 
                      onClick={() => navigateTo({ level: 'region', code, name: region.name })}
                      className="font-mono"
                    >
                      [REGION] Hela {region.name}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel className="text-xs font-mono">LÄNDER</DropdownMenuLabel>
                    {getRegionCountries(code).map(country => (
                      <DropdownMenuItem 
                        key={country.code}
                        onClick={() => navigateTo({ 
                          level: 'country', 
                          code: country.code, 
                          name: country.name,
                          name_local: country.name_local,
                        })}
                        className="font-mono"
                      >
                        [{country.code}] {country.name_local}
                        {scope.level === 'country' && scope.code === country.code && (
                          <Badge variant="secondary" className="ml-auto text-xs font-mono">[AKTIV]</Badge>
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            ))}
            
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs font-mono">SNABBVAL</DropdownMenuLabel>
            
            {COUNTRIES[detectedCountry] && (
              <DropdownMenuItem 
                onClick={() => navigateTo({ 
                  level: 'country', 
                  code: detectedCountry, 
                  name: COUNTRIES[detectedCountry].name,
                  name_local: COUNTRIES[detectedCountry].name_local,
                })}
                className="font-mono"
              >
                [{detectedCountry}] {COUNTRIES[detectedCountry].name_local} [DETEKTERAT]
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Scope info */}
        <div className="hidden md:flex items-center gap-4 text-xs">
          <div>
            <span className="text-muted-foreground">SCOPE:</span>{' '}
            <span className="font-medium uppercase">{scope.level}</span>
          </div>
          <div>
            <span className="text-muted-foreground">FOCUS:</span>{' '}
            <span className="font-medium">{scope.name_local || scope.name}</span>
          </div>
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
          <span className="text-xs text-muted-foreground">{LEVEL_MARKERS[scope.level]}</span>
          <span className="text-xs">{scope.code}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56 bg-popover font-mono">
        <DropdownMenuLabel className="text-xs font-mono">
          {scope.level.toUpperCase()}: {scope.name_local || scope.name}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* Zoom out option */}
        {canZoomOut && (
          <DropdownMenuItem onClick={zoomOut} className="font-mono">
            [−] Zooma ut till {scope.level === 'country' ? 'region' : 'global'}
          </DropdownMenuItem>
        )}
        
        {/* Region countries if at region level */}
        {scope.level === 'region' && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs font-mono">LÄNDER I {scope.name.toUpperCase()}</DropdownMenuLabel>
            {getRegionCountries(scope.code).map(country => (
              <DropdownMenuItem 
                key={country.code}
                onClick={() => navigateTo({ 
                  level: 'country', 
                  code: country.code, 
                  name: country.name,
                  name_local: country.name_local,
                })}
                className="font-mono"
              >
                [{country.code}] {country.name_local}
              </DropdownMenuItem>
            ))}
          </>
        )}

        {/* All countries submenu if at global level */}
        {scope.level === 'global' && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs font-mono">VÄLJ LAND</DropdownMenuLabel>
            {Object.entries(GEO_REGIONS).map(([code, region]) => (
              <DropdownMenuSub key={code}>
                <DropdownMenuSubTrigger className="font-mono">
                  {region.name}
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="bg-popover font-mono">
                    {getRegionCountries(code).map(country => (
                      <DropdownMenuItem 
                        key={country.code}
                        onClick={() => navigateTo({ 
                          level: 'country', 
                          code: country.code, 
                          name: country.name,
                          name_local: country.name_local,
                        })}
                        className="font-mono"
                      >
                        [{country.code}] {country.name_local}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            ))}
          </>
        )}
        
        {/* Global option */}
        {scope.level !== 'global' && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => navigateTo({ level: 'global', code: 'GLOBAL', name: 'Global' })}
              className="font-mono"
            >
              [GLOBAL] Global översikt
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default GeoScopeNavigator;
