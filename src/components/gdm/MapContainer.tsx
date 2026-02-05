/**
 * Enhanced MapContainer Component
 * 
 * MYNDIGHETSDESIGN: Strikt, klinisk map display.
 * Shows λ values and GEDI counts per country.
 */

import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { COUNTRIES, LAMBDA_OVERLAYS, getLambdaColor } from './mockData';

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
      center: [15, 35],
      zoom: 2.2,
      projection: 'mercator',
      attributionControl: false,
      fadeDuration: 0,
    });

    // Navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({ showCompass: true }), 
      'top-right'
    );

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

      const isSelected = selectedCountry === country.code;
      const isDark = theme === 'dark';
      const color = getLambdaColor(lambdaData.lambda);
      const hasActiveGEDI = lambdaData.activeGEDICodes.length > 0;
      
      // Create myndighets-style marker
      const el = document.createElement('div');
      el.className = 'gdm-lambda-marker';
      el.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;
        transition: transform 0.15s ease;
        z-index: ${isSelected ? 100 : 10};
      `;

      // Lambda value box
      const lambdaBox = document.createElement('div');
      lambdaBox.style.cssText = `
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 3px 6px;
        background: ${isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.98)'};
        border: 1px solid ${isSelected ? color : (isDark ? 'rgba(71, 85, 105, 0.6)' : 'rgba(203, 213, 225, 0.9)')};
        border-radius: 2px;
        font-family: 'SF Mono', 'Fira Code', 'Consolas', ui-monospace, monospace;
        font-size: 11px;
        box-shadow: ${isSelected 
          ? `0 0 0 2px ${color}40` 
          : '0 2px 6px rgba(0,0,0,0.2)'};
        white-space: nowrap;
        ${hasActiveGEDI ? `border-left: 3px solid ${color};` : ''}
      `;

      // Lambda value
      const lambdaValue = document.createElement('span');
      lambdaValue.style.cssText = `
        font-weight: 600;
        color: ${color};
        letter-spacing: -0.02em;
      `;
      lambdaValue.textContent = lambdaData.lambda.toFixed(2);
      lambdaBox.appendChild(lambdaValue);

      // GEDI count if any
      if (hasActiveGEDI) {
        const gediCount = document.createElement('span');
        gediCount.style.cssText = `
          font-size: 9px;
          color: ${isDark ? '#94a3b8' : '#64748b'};
          margin-left: 2px;
        `;
        gediCount.textContent = `[${lambdaData.activeGEDICodes.length}]`;
        lambdaBox.appendChild(gediCount);
      }

      el.appendChild(lambdaBox);

      // Country code label below
      const codeLabel = document.createElement('div');
      codeLabel.style.cssText = `
        margin-top: 2px;
        padding: 1px 4px;
        background: ${isDark ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.95)'};
        border-radius: 1px;
        font-family: 'SF Mono', 'Fira Code', 'Consolas', ui-monospace, monospace;
        font-size: 9px;
        font-weight: 600;
        color: ${isDark ? '#94a3b8' : '#64748b'};
        letter-spacing: 0.02em;
      `;
      codeLabel.textContent = country.code;
      el.appendChild(codeLabel);

      // Click handler
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        onSelectCountry(country.code);
      });

      // Hover effects
      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.1)';
        el.style.zIndex = '150';
      });
      
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1)';
        el.style.zIndex = isSelected ? '100' : '10';
      });

      const marker = new mapboxgl.Marker({ 
        element: el,
        anchor: 'center',
      })
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
        duration: 1200,
      });
    }
  }, [selectedCountry]);

  if (!MAPBOX_TOKEN) {
    return (
      <div className="h-full flex items-center justify-center bg-background">
        <div className="text-center p-8 font-mono">
          <div className="text-lg font-semibold">[!] MAPBOX_TOKEN SAKNAS</div>
          <div className="text-sm text-muted-foreground mt-2">
            Konfiguration krävs för kartvisning
          </div>
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
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-50">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-mono text-muted-foreground">Laddar karta...</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default MapContainer;
