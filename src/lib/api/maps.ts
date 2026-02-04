/**
 * Maps API Abstraction
 * 
 * Unified interface for map providers (Mapbox, OpenStreetMap, etc.)
 * with automatic fallback and regional optimization.
 */

import { apiRequest } from './base';
import { getRegionConfig } from '@/config/regions';

export interface GeocodingResult {
  id: string;
  name: string;
  fullAddress: string;
  coordinates: [number, number]; // [lng, lat]
  type: string;
  country: string;
  countryCode: string;
  region?: string;
  city?: string;
}

export interface MapTileConfig {
  url: string;
  attribution: string;
  maxZoom: number;
  minZoom: number;
}

export interface ChoroplethData {
  geoJsonUrl: string;
  featureIdProperty: string;
  valueProperty: string;
}

/**
 * Get map tile configuration based on region and availability
 */
export function getMapTileConfig(): MapTileConfig {
  const mapboxToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
  
  if (mapboxToken) {
    return {
      url: `https://api.mapbox.com/styles/v1/mapbox/dark-v11/tiles/{z}/{x}/{y}?access_token=${mapboxToken}`,
      attribution: '© Mapbox © OpenStreetMap',
      maxZoom: 18,
      minZoom: 0,
    };
  }
  
  // Fallback to OpenStreetMap
  return {
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19,
    minZoom: 0,
  };
}

/**
 * Geocode an address to coordinates
 */
export async function geocodeAddress(query: string): Promise<GeocodingResult[]> {
  const mapboxToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
  
  if (mapboxToken) {
    const response = await apiRequest<{ features: Array<{
      id: string;
      place_name: string;
      center: [number, number];
      place_type: string[];
      context?: Array<{ id: string; text: string; short_code?: string }>;
      text: string;
    }> }>('mapbox', `/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json`, {
      params: {
        access_token: mapboxToken,
        limit: 5,
        types: 'country,region,place,locality,address',
      },
    });
    
    if (response.data?.features) {
      return response.data.features.map(f => {
        const countryCtx = f.context?.find(c => c.id.startsWith('country'));
        const regionCtx = f.context?.find(c => c.id.startsWith('region'));
        const placeCtx = f.context?.find(c => c.id.startsWith('place'));
        
        return {
          id: f.id,
          name: f.text,
          fullAddress: f.place_name,
          coordinates: f.center,
          type: f.place_type[0] || 'unknown',
          country: countryCtx?.text || '',
          countryCode: countryCtx?.short_code?.toUpperCase() || '',
          region: regionCtx?.text,
          city: placeCtx?.text,
        };
      });
    }
  }
  
  // Fallback: return empty for now (could integrate Nominatim)
  console.warn('Geocoding unavailable without Mapbox token');
  return [];
}

/**
 * Reverse geocode coordinates to address
 */
export async function reverseGeocode(lng: number, lat: number): Promise<GeocodingResult | null> {
  const mapboxToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
  
  if (mapboxToken) {
    const response = await apiRequest<{ features: Array<{
      id: string;
      place_name: string;
      center: [number, number];
      place_type: string[];
      context?: Array<{ id: string; text: string; short_code?: string }>;
      text: string;
    }> }>('mapbox', `/geocoding/v5/mapbox.places/${lng},${lat}.json`, {
      params: {
        access_token: mapboxToken,
        limit: 1,
      },
    });
    
    const feature = response.data?.features?.[0];
    if (feature) {
      const countryCtx = feature.context?.find(c => c.id.startsWith('country'));
      
      return {
        id: feature.id,
        name: feature.text,
        fullAddress: feature.place_name,
        coordinates: feature.center,
        type: feature.place_type[0] || 'unknown',
        country: countryCtx?.text || '',
        countryCode: countryCtx?.short_code?.toUpperCase() || '',
      };
    }
  }
  
  return null;
}

/**
 * Get initial map view based on detected region
 */
export function getInitialMapView(): { center: [number, number]; zoom: number } {
  const region = getRegionConfig();
  
  const regionCenters: Record<string, { center: [number, number]; zoom: number }> = {
    global: { center: [0, 20], zoom: 2 },
    eu: { center: [10, 50], zoom: 4 },
    us: { center: [-98, 39], zoom: 4 },
    asia: { center: [105, 35], zoom: 3 },
    africa: { center: [20, 0], zoom: 3 },
  };
  
  return regionCenters[region.code] || regionCenters.global;
}

export default {
  getMapTileConfig,
  geocodeAddress,
  reverseGeocode,
  getInitialMapView,
};
