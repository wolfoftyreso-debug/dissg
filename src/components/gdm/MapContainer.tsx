/**
 * Enhanced MapContainer Component
 * 
 * Supports multiple map modes: satellite (photorealistic), 3D globe, 2D flat.
 * Hierarchical markers: Countries (flags), States, Cities with 3D styling.
 */

import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { COUNTRIES, LAMBDA_OVERLAYS } from './mockData';
import { MOCK_CITIES, type CityData } from './CityMarkers';
import { 
  injectMarkerStyles, 
  getScoreColor as getHierarchicalScoreColor,
  getFlag,
  MOCK_STATES, 
  MOCK_CITIES_HIERARCHICAL,
} from './HierarchicalMarkers';
import { IQ_DATA, getIQColor } from './IQIndicator';
import { getRegionColor, type RegionType } from './RegionIndicator';
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
  // Region visualization
  activeRegionType?: RegionType | null;
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

// Score color is now imported from HierarchicalMarkers

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
  activeRegionType = null,
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

  // Inject hierarchical marker styles once
  useEffect(() => {
    injectMarkerStyles();
  }, []);

  // Add country markers with flags
  useEffect(() => {
    if (!map.current || !isLoaded) return;

    // Clear existing markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    // Add markers for each country (with FLAGS)
    COUNTRIES.forEach(country => {
      const lambdaData = LAMBDA_OVERLAYS[country.code];
      if (!lambdaData) return;

      const isSelected = selectedCountry === country.code;
      
      // Determine score and color based on active layer or region type
      let score: number;
      let scoreColor: string;
      let scoreLabel: string;
      
      if (activeRegionType) {
        // Color by region type
        score = 0; // Not used for regions
        scoreColor = getRegionColor(country.code, activeRegionType);
        scoreLabel = country.name.sv;
      } else if (activeLayer === 'iq') {
        const iqInfo = IQ_DATA[country.code];
        score = iqInfo?.score || 0;
        scoreColor = iqInfo ? getIQColor(iqInfo.score) : '#9CA3AF';
        scoreLabel = iqInfo ? `IQ: ${iqInfo.score}` : 'Ingen data';
      } else {
        score = Math.round(lambdaData.lambda * 100);
        scoreColor = getHierarchicalScoreColor(score);
        scoreLabel = `${score} poäng`;
      }
      
      const flag = getFlag(country.code);
      
      const el = document.createElement('div');
      el.className = 'country-marker-wrapper';
      el.setAttribute('role', 'button');
      el.setAttribute('tabindex', '0');
      el.setAttribute('aria-label', `${country.name.sv}: ${scoreLabel}`);
      
      // Create flag marker with 3D styling
      // Show score badge only when not in region mode
      const badgeContent = activeRegionType 
        ? '' 
        : `<div class="marker-score-badge" style="background: ${scoreColor}">${activeLayer === 'iq' ? (IQ_DATA[country.code]?.score || '—') : score}</div>`;
      
      el.innerHTML = `
        <div class="marker-container marker-country ${isSelected ? 'marker-selected' : ''}" style="${isSelected ? `box-shadow: 0 0 0 3px white, 0 0 0 5px ${scoreColor};` : ''}; ${activeRegionType ? `border: 3px solid ${scoreColor}; border-radius: 12px;` : ''}">
          <div class="marker-flag-large">${flag}</div>
          ${badgeContent}
        </div>
      `;

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

    // Add STATE markers
    MOCK_STATES.forEach(state => {
      const isSelected = false; // TODO: state selection
      const scoreColor = getHierarchicalScoreColor(state.score || 100);
      const flag = getFlag(state.countryCode);
      const abbrev = state.id.substring(0, 3).toUpperCase();
      
      const el = document.createElement('div');
      el.className = 'state-marker-wrapper';
      el.setAttribute('role', 'button');
      el.setAttribute('tabindex', '0');
      el.setAttribute('aria-label', `${state.name}: ${state.score} poäng`);
      
      el.innerHTML = `
        <div class="marker-container marker-state ${isSelected ? 'marker-selected' : ''}">
          <div class="marker-state-icon">
            <div class="marker-mini-flag">${flag}</div>
            <div class="marker-state-abbrev">${abbrev}</div>
          </div>
          <div class="marker-score-badge-sm" style="background: ${scoreColor}">${state.score}</div>
        </div>
        <div class="marker-label marker-label-state">${state.name}</div>
      `;

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        // TODO: Handle state selection
      });

      const marker = new mapboxgl.Marker({ 
        element: el,
        anchor: 'center',
      })
        .setLngLat(state.coordinates)
        .addTo(map.current!);

      markersRef.current.push(marker);
    });
  }, [isLoaded, selectedCountry, onSelectCountry, activeLayer, timeYear, activeRegionType]);

  // Add city markers when enabled (use hierarchical 3D style)
  useEffect(() => {
    if (!map.current || !isLoaded) return;

    // Clear existing city markers
    cityMarkersRef.current.forEach(m => m.remove());
    cityMarkersRef.current = [];

    if (!showCities) return;

    // Combine old mock cities with new hierarchical cities
    const allCities = [
      ...MOCK_CITIES.map(c => ({ 
        id: c.id, 
        name: c.name, 
        coordinates: c.coordinates, 
        score: calculateCityScore(c, selectedCityIndicators) 
      })),
      ...MOCK_CITIES_HIERARCHICAL
        .filter(c => !MOCK_CITIES.some(m => m.id === c.id))
        .map(c => ({ id: c.id, name: c.name, coordinates: c.coordinates, score: c.score || 100 }))
    ];

    // Add markers for each city with 3D sphere styling
    allCities.forEach(city => {
      const isSelected = selectedCity === city.id;
      const score = city.score || 100;
      const scoreColor = getHierarchicalScoreColor(score);
      
      const el = document.createElement('div');
      el.className = 'city-marker-wrapper';
      el.setAttribute('role', 'button');
      el.setAttribute('tabindex', '0');
      el.setAttribute('aria-label', `${city.name}: ${score} poäng`);
      
      // New 3D sphere style for cities
      el.innerHTML = `
        <div class="marker-container marker-city ${isSelected ? 'marker-selected' : ''}" style="${isSelected ? `box-shadow: 0 0 0 3px white, 0 0 0 5px ${scoreColor};` : ''}">
          <div class="marker-city-dot" style="background: ${scoreColor}">
            <span class="marker-city-score">${score}</span>
          </div>
        </div>
        <div class="marker-label marker-label-city">${city.name}</div>
      `;

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

      const coords: [number, number] = city.coordinates;

      const marker = new mapboxgl.Marker({ 
        element: el,
        anchor: 'center',
      })
        .setLngLat(coords)
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
