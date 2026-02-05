/**
 * Enhanced MapContainer Component
 * 
 * Financial terminal-style world map with country markers
 * showing codes, names, percentages, and sparklines.
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { COUNTRIES, LAMBDA_OVERLAYS, getHistoricalLambda } from './mockData';

const MAPBOX_TOKEN = 'pk.eyJ1IjoiY2VydGlmaWVkMTIiLCJhIjoiY21sOG9hNnlvMDhtZTNmc2Rsa2t4c25hNiJ9._mlFk7T05_QzjW1kC79lfw';

interface MapContainerProps {
  theme: 'dark' | 'light';
  onSelectCountry: (code: string) => void;
  selectedCountry: string | null;
  activeLayer: string;
  timeYear: number;
}

// Generate mini sparkline SVG
function generateSparkline(data: number[], width = 40, height = 12): string {
  if (data.length < 2) return '';
  
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');
  
  // Determine trend color
  const trend = data[data.length - 1] - data[0];
  const color = trend > 0 ? '#22c55e' : trend < 0 ? '#ef4444' : '#94a3b8';
  
  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" style="display:block;">
    <polyline 
      fill="none" 
      stroke="${color}" 
      stroke-width="1.5" 
      stroke-linecap="round"
      stroke-linejoin="round"
      points="${points}"
    />
  </svg>`;
}

// Calculate percentage change
function getPercentChange(data: number[]): { value: number; formatted: string } {
  if (data.length < 2) return { value: 0, formatted: '0,00%' };
  
  const first = data[Math.max(0, data.length - 12)]; // Last 12 periods
  const last = data[data.length - 1];
  const change = ((last - first) / first) * 100;
  
  const sign = change >= 0 ? '+' : '';
  const formatted = `${sign}${change.toFixed(2).replace('.', ',')}%`;
  
  return { value: change, formatted };
}

// Country flag emoji from code
function getFlagEmoji(countryCode: string): string {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
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
      zoom: 1.8,
      projection: 'mercator',
      attributionControl: false,
      fadeDuration: 0,
    });

    // Minimal navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({ showCompass: false }), 
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

      // Get historical data for sparkline
      const historicalData = getHistoricalLambda(country.code);
      const recentData = historicalData.slice(-12).map(d => d.value);
      const percentChange = getPercentChange(recentData);
      const sparklineSvg = generateSparkline(recentData);
      const flag = getFlagEmoji(country.code);
      
      const isSelected = selectedCountry === country.code;
      const isDark = theme === 'dark';
      
      // Determine change color
      const changeColor = percentChange.value > 0 
        ? '#22c55e' 
        : percentChange.value < 0 
          ? '#ef4444' 
          : '#94a3b8';

      // Create financial-terminal style marker
      const el = document.createElement('div');
      el.className = 'gdm-terminal-marker';
      el.style.cssText = `
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 4px 8px;
        background: ${isDark ? 'rgba(15, 23, 42, 0.92)' : 'rgba(255, 255, 255, 0.95)'};
        border: 1px solid ${isSelected 
          ? (isDark ? '#3b82f6' : '#2563eb') 
          : (isDark ? 'rgba(71, 85, 105, 0.5)' : 'rgba(203, 213, 225, 0.8)')};
        border-radius: 3px;
        cursor: pointer;
        font-family: 'SF Mono', 'Fira Code', 'Consolas', monospace;
        font-size: 11px;
        box-shadow: ${isSelected 
          ? '0 0 0 2px rgba(59, 130, 246, 0.3)' 
          : '0 2px 8px rgba(0,0,0,0.15)'};
        transition: all 0.15s ease;
        white-space: nowrap;
        z-index: ${isSelected ? 100 : 10};
      `;

      // Flag + Country code
      const codeSection = document.createElement('div');
      codeSection.style.cssText = `
        display: flex;
        align-items: center;
        gap: 4px;
      `;
      
      const flagEl = document.createElement('span');
      flagEl.textContent = flag;
      flagEl.style.fontSize = '12px';
      codeSection.appendChild(flagEl);
      
      const codeEl = document.createElement('span');
      codeEl.style.cssText = `
        font-weight: 600;
        color: ${isDark ? '#f1f5f9' : '#1e293b'};
        letter-spacing: 0.02em;
      `;
      codeEl.textContent = country.code;
      codeSection.appendChild(codeEl);
      
      el.appendChild(codeSection);

      // Country name (abbreviated)
      const nameEl = document.createElement('span');
      nameEl.style.cssText = `
        color: ${isDark ? '#94a3b8' : '#64748b'};
        max-width: 50px;
        overflow: hidden;
        text-overflow: ellipsis;
      `;
      nameEl.textContent = country.name.en.substring(0, 4) + (country.name.en.length > 4 ? '...' : '');
      el.appendChild(nameEl);

      // Percentage change
      const changeEl = document.createElement('span');
      changeEl.style.cssText = `
        color: ${changeColor};
        font-weight: 600;
        min-width: 52px;
        text-align: right;
      `;
      changeEl.textContent = percentChange.formatted;
      el.appendChild(changeEl);

      // Sparkline
      const sparkContainer = document.createElement('div');
      sparkContainer.innerHTML = sparklineSvg;
      sparkContainer.style.cssText = `
        display: flex;
        align-items: center;
        margin-left: 2px;
      `;
      el.appendChild(sparkContainer);

      // Click handler
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        onSelectCountry(country.code);
      });

      // Hover effects
      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.05)';
        el.style.zIndex = '150';
        el.style.boxShadow = '0 4px 16px rgba(0,0,0,0.25)';
      });
      
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1)';
        el.style.zIndex = isSelected ? '100' : '10';
        el.style.boxShadow = isSelected 
          ? '0 0 0 2px rgba(59, 130, 246, 0.3)' 
          : '0 2px 8px rgba(0,0,0,0.15)';
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
          <div className="text-4xl mb-4">🗺️</div>
          <div className="text-lg font-semibold">MAPBOX_TOKEN SAKNAS</div>
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
      
      {/* Global Index Badge */}
      <div 
        className="absolute bottom-24 left-4 z-10 pointer-events-none"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          background: theme === 'dark' 
            ? 'rgba(15, 23, 42, 0.95)' 
            : 'rgba(255, 255, 255, 0.95)',
          border: `1px solid ${theme === 'dark' ? 'rgba(71, 85, 105, 0.5)' : 'rgba(203, 213, 225, 0.8)'}`,
          borderRadius: '4px',
          fontFamily: "'SF Mono', 'Fira Code', 'Consolas', monospace",
          fontSize: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}
      >
        <span style={{ fontSize: '16px' }}>🌐</span>
        <span style={{ 
          fontWeight: 600, 
          color: theme === 'dark' ? '#f1f5f9' : '#1e293b' 
        }}>
          Global Reality Index
        </span>
        <span style={{ 
          color: '#ef4444', 
          fontWeight: 600,
          marginLeft: '4px',
        }}>
          −0,32%
        </span>
        <div 
          dangerouslySetInnerHTML={{ 
            __html: generateSparkline(
              [0.88, 0.87, 0.86, 0.87, 0.85, 0.86, 0.85, 0.84, 0.85, 0.84, 0.85, 0.84],
              40, 
              12
            ) 
          }}
          style={{ marginLeft: '4px' }}
        />
      </div>
      
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
