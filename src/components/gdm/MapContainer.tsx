/**
 * Enhanced MapContainer Component
 * 
 * Supports multiple map modes: satellite (photorealistic), 3D globe, 2D flat.
 * Clean, minimal country markers with scores.
 */

import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { COUNTRIES, LAMBDA_OVERLAYS, getLambdaColor } from './mockData';
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
}

export function MapContainer({
  theme: _theme,
  mapMode,
  onSelectCountry,
  selectedCountry,
  activeLayer,
  timeYear,
}: MapContainerProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
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
