/**
 * Enhanced MapContainer Component
 * 
 * Supports multiple map modes: satellite (photorealistic), 3D globe, 2D flat.
 * Clean, minimal country markers with scores.
 * NEW: City-level markers with selectable indicators.
 */

import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { COUNTRIES, LAMBDA_OVERLAYS, getLambdaColor } from './mockData';
import { MOCK_CITIES, type CityData, CITY_INDICATORS } from './CityMarkers';
import type { MapMode } from './types';

const MAPBOX_TOKEN = 'pk.eyJ1IjoiY2VydGlmaWVkMTIiLCJhIjoiY21sOG9hNnlvMDhtZTNmc2Rsa2t4c25hNiJ9._mlFk7T05_QzjW1kC79lfw';

// Map styles for each mode
const MAP_STYLES: Record<MapMode, string> = {
  satellite: 'mapbox://styles/mapbox/satellite-streets-v12',
  '3d': 'mapbox://styles/mapbox/light-v11',
  '2d': 'mapbox://styles/mapbox/light-v11',
};

interface MapContainerProps {
  theme: 'dark' | 'light';
  mapMode: MapMode;
  onSelectCountry: (code: string) => void;
  selectedCountry: string | null;
  activeLayer: string;
  timeYear: number;
  // NEW: City layer props
  showCities?: boolean;
  selectedCityIndicators?: string[];
  onSelectCity?: (cityId: string) => void;
  selectedCity?: string | null;
}

/**
 * Calculate aggregate score for city based on selected indicators
 */
function calculateCityScore(city: CityData, selectedIndicators: string[]): number {
  if (selectedIndicators.length === 0) return 50;
  
  let total = 0;
  let count = 0;
  
  selectedIndicators.forEach(id => {
    const value = city.indicators[id];
    if (value !== undefined) {
      let normalized: number;
      
      switch (id) {
        case 'life_expectancy': normalized = ((value - 70) / 20) * 100; break;
        case 'unemployment': normalized = 100 - (value * 5); break;
        case 'crime_rate': normalized = 100 - (value * 3); break;
        case 'co2_emissions': normalized = 100 - (value * 15); break;
        case 'gini': normalized = 100 - (value * 200); break;
        case 'housing_cost': normalized = 100 - (value / 3); break;
        default: normalized = value; break;
      }
      
      total += Math.max(0, Math.min(100, normalized));
      count++;
    }
  });
  
  return count > 0 ? Math.round(total / count) : 50;
}

function getScoreColor(score: number): string {
  if (score >= 80) return '#22c55e';
  if (score >= 60) return '#84cc16';
  if (score >= 40) return '#eab308';
  if (score >= 20) return '#f97316';
  return '#ef4444';
}

export function MapContainer({
  theme: _theme,
  mapMode,
  onSelectCountry,
  selectedCountry,
  activeLayer,
  timeYear,
  showCities = false,
  selectedCityIndicators = [],
  onSelectCity,
  selectedCity,
}: MapContainerProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const cityMarkersRef = useRef<mapboxgl.Marker[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || !MAPBOX_TOKEN) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const projection = mapMode === '3d' ? 'globe' : 'mercator';
    const style = MAP_STYLES[mapMode];

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style,
      center: [10, 30],
      zoom: mapMode === '3d' ? 1.5 : 2,
      projection,
      attributionControl: false,
      fadeDuration: 0,
    });

    // Navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({ showCompass: true }), 
      'bottom-left'
    );

    // Globe atmosphere for 3D mode
    map.current.on('style.load', () => {
      if (mapMode === '3d' && map.current) {
        map.current.setFog({
          color: 'rgb(220, 230, 240)',
          'high-color': 'rgb(180, 200, 220)',
          'horizon-blend': 0.05,
          'space-color': 'rgb(240, 245, 250)',
          'star-intensity': 0,
        });
      }
    });

    map.current.on('load', () => {
      setIsLoaded(true);
    });

    return () => {
      markersRef.current.forEach(m => m.remove());
      cityMarkersRef.current.forEach(m => m.remove());
      map.current?.remove();
    };
  }, [mapMode]);

  // Add country markers
  useEffect(() => {
    if (!map.current || !isLoaded) return;

    // Clear existing markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    // Add markers for each country
    COUNTRIES.forEach(country => {
      const lambdaData = LAMBDA_OVERLAYS[country.code];
      if (!lambdaData) return;

      const isSelected = selectedCountry === country.code;
      const score = Math.round(lambdaData.lambda * 100);
      const color = getLambdaColor(lambdaData.lambda);
      
      // Create clean, modern marker
      const el = document.createElement('div');
      el.className = 'gdm-marker';
      el.setAttribute('role', 'button');
      el.setAttribute('tabindex', '0');
      el.setAttribute('aria-label', `${country.name.sv}: ${score} poäng`);
      
      
      el.innerHTML = `
        <div class="gdm-marker-content ${isSelected ? 'gdm-marker-selected' : ''}">
          <div class="gdm-marker-score" style="background: ${color}">${score}</div>
          <div class="gdm-marker-flag">${country.code}</div>
        </div>
      `;
      
      // Styles
      const styles = document.createElement('style');
      styles.textContent = `
        .gdm-marker {
          cursor: pointer;
          transition: transform 0.2s ease;
        }
        .gdm-marker:hover {
          transform: scale(1.15);
          z-index: 100 !important;
        }
        .gdm-marker-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }
        .gdm-marker-score {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 700;
          color: white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          min-width: 32px;
          text-align: center;
        }
        .gdm-marker-flag {
          font-size: 9px;
          font-weight: 600;
          color: #64748b;
          background: white;
          padding: 1px 4px;
          border-radius: 4px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .gdm-marker-selected .gdm-marker-score {
          box-shadow: 0 0 0 3px white, 0 0 0 5px ${color};
        }
      `;
      el.appendChild(styles);

      // Click handler
      const handleSelect = (e: Event) => {
        e.stopPropagation();
        onSelectCountry(country.code);
      };
      
      el.addEventListener('click', handleSelect);
      el.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleSelect(e);
        }
      });

      const marker = new mapboxgl.Marker({ 
        element: el,
        anchor: 'center',
      })
        .setLngLat(country.center)
        .addTo(map.current!);

      markersRef.current.push(marker);
    });
  }, [isLoaded, selectedCountry, onSelectCountry, activeLayer, timeYear]);

  // Add city markers when enabled
  useEffect(() => {
    if (!map.current || !isLoaded) return;

    // Clear existing city markers
    cityMarkersRef.current.forEach(m => m.remove());
    cityMarkersRef.current = [];

    if (!showCities) return;

    // Add markers for each city
    MOCK_CITIES.forEach(city => {
      const isSelected = selectedCity === city.id;
      const score = calculateCityScore(city, selectedCityIndicators);
      const scoreColor = getScoreColor(score);
      const showDetails = selectedCityIndicators.length <= 4 && selectedCityIndicators.length > 0;
      
      const el = document.createElement('div');
      el.className = 'city-marker-wrapper';
      el.setAttribute('role', 'button');
      el.setAttribute('tabindex', '0');
      el.setAttribute('aria-label', `${city.name}: ${score} poäng`);
      
      // Build indicator icons HTML
      let indicatorIconsHTML = '';
      if (showDetails) {
        indicatorIconsHTML = selectedCityIndicators.slice(0, 4).map(id => {
          const indicator = CITY_INDICATORS.find(i => i.id === id);
          if (!indicator) return '';
          return `<span class="city-indicator-icon" style="background: ${indicator.color}20" title="${indicator.name}">${indicator.icon}</span>`;
        }).join('');
      } else if (selectedCityIndicators.length > 4) {
        indicatorIconsHTML = `<span class="city-more-indicators">+${selectedCityIndicators.length}</span>`;
      }
      
      el.innerHTML = `
        <div class="city-marker-main ${isSelected ? 'city-marker-selected' : ''}" style="--score-color: ${scoreColor}">
          <div class="city-score" style="background: ${scoreColor}">${score}</div>
          ${indicatorIconsHTML ? `<div class="city-indicators">${indicatorIconsHTML}</div>` : ''}
        </div>
        <div class="city-name">${city.name}</div>
      `;
      
      // Inject styles once
      if (!document.getElementById('city-marker-styles')) {
        const styles = document.createElement('style');
        styles.id = 'city-marker-styles';
        styles.textContent = `
          .city-marker-wrapper {
            cursor: pointer;
            transition: transform 0.2s ease, z-index 0s;
            display: flex;
            flex-direction: column;
            align-items: center;
            z-index: 10;
          }
          .city-marker-wrapper:hover {
            transform: scale(1.15);
            z-index: 200 !important;
          }
          .city-marker-main {
            display: flex;
            align-items: center;
            gap: 4px;
            padding: 4px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 2px 12px rgba(0,0,0,0.15);
            border: 2px solid white;
          }
          .city-marker-selected {
            border-color: var(--score-color);
            box-shadow: 0 0 0 3px var(--score-color), 0 2px 12px rgba(0,0,0,0.2);
          }
          .city-score {
            width: 28px;
            height: 28px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 700;
            font-size: 12px;
          }
          .city-indicators {
            display: flex;
            gap: 2px;
          }
          .city-indicator-icon {
            width: 22px;
            height: 22px;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
          }
          .city-more-indicators {
            font-size: 10px;
            color: #64748b;
            padding: 0 4px;
          }
          .city-name {
            margin-top: 4px;
            padding: 2px 8px;
            background: white;
            border-radius: 8px;
            font-size: 11px;
            font-weight: 600;
            color: #334155;
            box-shadow: 0 1px 4px rgba(0,0,0,0.1);
            white-space: nowrap;
          }
        `;
        document.head.appendChild(styles);
      }

      // Click handler
      const handleSelect = (e: Event) => {
        e.stopPropagation();
        onSelectCity?.(city.id);
      };
      
      el.addEventListener('click', handleSelect);
      el.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleSelect(e);
        }
      });

      const marker = new mapboxgl.Marker({ 
        element: el,
        anchor: 'center',
      })
        .setLngLat(city.coordinates)
        .addTo(map.current!);

      cityMarkersRef.current.push(marker);
    });
  }, [isLoaded, showCities, selectedCityIndicators, selectedCity, onSelectCity]);

  // Fly to selected country
  useEffect(() => {
    if (!map.current || !selectedCountry) return;

    const country = COUNTRIES.find(c => c.code === selectedCountry);
    if (country) {
      map.current.flyTo({
        center: country.center,
        zoom: mapMode === '3d' ? 3 : 4,
        duration: 1200,
      });
    }
  }, [selectedCountry, mapMode]);

  // Fly to selected city
  useEffect(() => {
    if (!map.current || !selectedCity) return;

    const city = MOCK_CITIES.find(c => c.id === selectedCity);
    if (city) {
      map.current.flyTo({
        center: city.coordinates,
        zoom: 10,
        duration: 1200,
      });
    }
  }, [selectedCity]);

  if (!MAPBOX_TOKEN) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-50">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">🗺️</div>
          <div className="text-lg font-medium text-slate-600">Kartan laddas...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div 
        ref={mapContainer} 
        className="w-full h-full"
        style={{ minHeight: '100%' }}
      />
      
      {/* Loading overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-50/90 z-50">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-3 border-slate-300 border-t-blue-500 rounded-full animate-spin" />
            <span className="text-sm text-slate-500">Laddar världskarta...</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default MapContainer;
