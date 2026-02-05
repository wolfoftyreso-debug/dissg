/**
 * Enhanced MapContainer Component
 * 
 * MYNDIGHETSDESIGN: Strikt, klinisk map display.
 * Shows λ values and GEDI counts per country.
 * 
 * @semantic Proper ARIA for interactive map markers
 * @a11y Keyboard navigation and screen reader support
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
      el.setAttribute('role', 'button');
      el.setAttribute('tabindex', '0');
      el.setAttribute('aria-label', `${country.name.sv}: Lambda ${lambdaData.lambda.toFixed(2)}${hasActiveGEDI ? `, ${lambdaData.activeGEDICodes.length} aktiva GEDI-koder` : ''}`);
      el.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
      
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
        background: ${isDark ? 'hsl(222.2 84% 4.9% / 0.95)' : 'hsl(0 0% 100% / 0.98)'};
        border: 1px solid ${isSelected ? color : (isDark ? 'hsl(215 20.2% 35% / 0.6)' : 'hsl(214.3 31.8% 91.4% / 0.9)')};
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
          color: ${isDark ? 'hsl(215 20.2% 65.1%)' : 'hsl(215 16.3% 46.9%)'};
          margin-left: 2px;
        `;
        gediCount.textContent = `[${lambdaData.activeGEDICodes.length}]`;
        gediCount.setAttribute('aria-hidden', 'true');
        lambdaBox.appendChild(gediCount);
      }

      el.appendChild(lambdaBox);

      // Country code label below
      const codeLabel = document.createElement('div');
      codeLabel.style.cssText = `
        margin-top: 2px;
        padding: 1px 4px;
        background: ${isDark ? 'hsl(222.2 84% 4.9% / 0.9)' : 'hsl(0 0% 100% / 0.95)'};
        border-radius: 1px;
        font-family: 'SF Mono', 'Fira Code', 'Consolas', ui-monospace, monospace;
        font-size: 9px;
        font-weight: 600;
        color: ${isDark ? 'hsl(215 20.2% 65.1%)' : 'hsl(215 16.3% 46.9%)'};
        letter-spacing: 0.02em;
      `;
      codeLabel.textContent = country.code;
      codeLabel.setAttribute('aria-hidden', 'true');
      el.appendChild(codeLabel);

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

      // Hover effects
      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.1)';
        el.style.zIndex = '150';
      });
      
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1)';
        el.style.zIndex = isSelected ? '100' : '10';
      });

      // Focus effects
      el.addEventListener('focus', () => {
        el.style.transform = 'scale(1.1)';
        el.style.zIndex = '150';
      });
      
      el.addEventListener('blur', () => {
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
      <div 
        className="h-full flex items-center justify-center bg-background"
        role="alert"
      >
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
    <div 
      className="relative w-full h-full"
      role="application"
      aria-label="Interaktiv världskarta med Lambda-värden"
    >
      <div 
        ref={mapContainer} 
        className="w-full h-full"
        style={{ minHeight: '100%' }}
        aria-hidden="true"
      />
      
      {/* Screen reader description */}
      <div className="sr-only">
        <p>
          Interaktiv karta som visar Lambda-systembalans för olika länder.
          Använd Tab för att navigera mellan länder, Enter för att välja.
        </p>
      </div>
      
      {/* Loading overlay */}
      {!isLoaded && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-background/80 z-50"
          role="status"
          aria-live="polite"
        >
          <div className="flex flex-col items-center gap-3">
            <div 
              className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"
              aria-hidden="true"
            />
            <span className="text-sm font-mono text-muted-foreground">Laddar karta...</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default MapContainer;
