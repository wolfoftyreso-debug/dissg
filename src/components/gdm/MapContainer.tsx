/**
 * Mapbox Container Component
 * 
 * Core map renderer with Lambda overlay.
 */

import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { COUNTRIES, LAMBDA_OVERLAYS, getLambdaColor } from './mockData';

// Public Mapbox token - safe to store in frontend code
const MAPBOX_TOKEN = 'pk.eyJ1IjoiY2VydGlmaWVkMTIiLCJhIjoiY21sOG9hNnlvMDhtZTNmc2Rsa2t4c25hNiJ9._mlFk7T05_QzjW1kC79lfw';

interface MapContainerProps {
  theme: 'dark' | 'light';
  onSelectCountry: (code: string) => void;
  selectedCountry: string | null;
  activeLayer: string;
  timeYear: number;
}

export function MapContainer({
  theme,
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

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: theme === 'dark' 
        ? 'mapbox://styles/mapbox/dark-v11'
        : 'mapbox://styles/mapbox/light-v11',
      center: [10, 30],
      zoom: 1.5,
      projection: 'mercator',
      attributionControl: false,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.current.addControl(new mapboxgl.AttributionControl({ compact: true }), 'bottom-right');

    map.current.on('load', () => {
      setIsLoaded(true);
    });

    return () => {
      markersRef.current.forEach(m => m.remove());
      map.current?.remove();
    };
  }, [theme]);

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

      const color = getLambdaColor(lambdaData.lambda);
      const isSelected = selectedCountry === country.code;

      // Create marker element - Myndighetsdesign: fyrkantiga, dämpade
      const el = document.createElement('div');
      el.className = 'gdm-country-marker';
      el.style.cssText = `
        width: ${isSelected ? '52px' : '44px'};
        height: ${isSelected ? '32px' : '28px'};
        background: ${theme === 'dark' ? 'rgba(30, 41, 59, 0.95)' : 'rgba(248, 250, 252, 0.95)'};
        border-radius: 2px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        cursor: pointer;
        box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        border: 1px solid ${isSelected ? color : 'rgba(100,116,139,0.4)'};
        border-left: 3px solid ${color};
        transition: all 0.15s ease;
        font-family: 'Inter', system-ui, sans-serif;
      `;

      // Lambda value - Klinisk typografi
      const lambdaEl = document.createElement('div');
      lambdaEl.style.cssText = `
        font-size: 11px;
        font-weight: 600;
        color: ${color};
        letter-spacing: -0.02em;
      `;
      lambdaEl.textContent = lambdaData.lambda.toFixed(2);
      el.appendChild(lambdaEl);

      // Country code - Diskret
      const codeEl = document.createElement('div');
      codeEl.style.cssText = `
        font-size: 8px;
        font-weight: 500;
        color: ${theme === 'dark' ? 'rgba(148,163,184,0.8)' : 'rgba(100,116,139,0.9)'};
        letter-spacing: 0.05em;
        text-transform: uppercase;
      `;
      codeEl.textContent = country.code;
      el.appendChild(codeEl);

      // Active GEDI indicator - Diskret liten markör
      if (lambdaData.activeGEDICodes.length > 0) {
        const gediEl = document.createElement('div');
        gediEl.style.cssText = `
          position: absolute;
          top: -2px;
          right: -2px;
          width: 12px;
          height: 12px;
          background: ${theme === 'dark' ? '#475569' : '#64748b'};
          border-radius: 1px;
          border: 1px solid ${theme === 'dark' ? '#334155' : '#cbd5e1'};
          font-size: 7px;
          font-weight: 600;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
        `;
        gediEl.textContent = lambdaData.activeGEDICodes.length.toString();
        el.appendChild(gediEl);
      }

      // Click handler
      el.addEventListener('click', () => {
        onSelectCountry(country.code);
      });

      // Hover effects
      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.15)';
        el.style.zIndex = '100';
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1)';
        el.style.zIndex = 'auto';
      });

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat(country.center)
        .addTo(map.current!);

      markersRef.current.push(marker);
    });
  }, [isLoaded, selectedCountry, onSelectCountry, activeLayer, timeYear, theme]);

  // Fly to selected country
  useEffect(() => {
    if (!map.current || !selectedCountry) return;

    const country = COUNTRIES.find(c => c.code === selectedCountry);
    if (country) {
      map.current.flyTo({
        center: country.center,
        zoom: 4,
        duration: 1500,
      });
    }
  }, [selectedCountry]);

  if (!MAPBOX_TOKEN) {
    return (
      <div className="h-full flex items-center justify-center bg-muted/30">
        <div className="text-center p-8">
          <div className="text-4xl mb-4">🗺️</div>
          <div className="font-mono text-lg">MAPBOX TOKEN REQUIRED</div>
          <div className="text-sm text-muted-foreground mt-2">
            Add VITE_MAPBOX_ACCESS_TOKEN to enable the diagnostic map
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={mapContainer} 
      className="w-full h-full"
      style={{ minHeight: '100%' }}
    />
  );
}

export default MapContainer;
