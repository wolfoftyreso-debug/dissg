/**
 * Global Diagnostic Map (GDM) - Redesigned
 * 
 * Clean, Snapchat-inspired interface for civilizational diagnostics.
 * Simple, beautiful, and pedagogical.
 */

import React, { useState, useCallback, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { MapContainer } from './MapContainer';
import { IndexPills } from './IndexPills';
import { MapModeSelector } from './MapModeSelector';
import { SimpleTimeSlider } from './SimpleTimeSlider';
import { CountryInfoPanel } from './CountryInfoPanel';
import type { MapLayerId, MapMode } from './types';

/** Schema.org JSON-LD for machine readability */
const GDM_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Global Diagnostic Map",
  "alternateName": "GDM",
  "description": "Visualisering av samhällsdata globalt. Se hur olika länder mår inom hälsa, ekonomi, miljö och mer.",
  "applicationCategory": "DataVisualization",
};

export function GlobalDiagnosticMap() {
  // State
  const [mapMode, setMapMode] = useState<MapMode>('satellite');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState<MapLayerId>('lambda');
  const [timeYear, setTimeYear] = useState(2024);
  const [isPlaying, setIsPlaying] = useState(false);

  // Time animation
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setTimeYear(prev => {
        if (prev >= 2024) {
          setIsPlaying(false);
          return 2024;
        }
        return prev + 1;
      });
    }, 600);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleClosePanel = useCallback(() => {
    setSelectedCountry(null);
  }, []);

  return (
    <>
      <Helmet>
        <title>Världskarta | Se hur länder mår</title>
        <meta name="description" content="Interaktiv världskarta som visar samhällsdata för alla länder. Välj mellan fotorealistisk, 3D och 2D-vy." />
        <script type="application/ld+json">
          {JSON.stringify(GDM_SCHEMA)}
        </script>
      </Helmet>

      <main 
        className="relative w-full h-full overflow-hidden bg-slate-50"
        style={{ minHeight: 'calc(100vh - 56px)' }}
      >
        {/* Map */}
        <section className="absolute inset-0">
          <MapContainer
            theme="light"
            mapMode={mapMode}
            onSelectCountry={setSelectedCountry}
            selectedCountry={selectedCountry}
            activeLayer={activeIndex}
            timeYear={timeYear}
          />
        </section>

        {/* Top: Map Mode Selector */}
        <header className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
          <MapModeSelector 
            mode={mapMode} 
            onChange={setMapMode} 
          />
        </header>

        {/* Top Right: Index Pills */}
        <nav className="absolute top-4 right-4 z-20">
          <IndexPills 
            activeIndex={activeIndex}
            onSelectIndex={setActiveIndex}
          />
        </nav>

        {/* Bottom: Time Slider */}
        <footer className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
          <SimpleTimeSlider
            year={timeYear}
            onChange={setTimeYear}
            isPlaying={isPlaying}
            onPlayPause={() => setIsPlaying(!isPlaying)}
          />
        </footer>

        {/* Country Info Panel (slide in from right) */}
        {selectedCountry && (
          <CountryInfoPanel
            countryCode={selectedCountry}
            activeIndex={activeIndex}
            onClose={handleClosePanel}
          />
        )}

        {/* Year Display (bottom left) */}
        <div className="absolute bottom-6 left-4 z-10 pointer-events-none">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-lg border border-slate-200">
            <span className="text-2xl font-bold text-slate-800">{timeYear}</span>
          </div>
        </div>

        {/* Hidden semantic content for SEO */}
        <div className="sr-only">
          <h1>Världskarta - Se hur länder mår</h1>
          <p>
            En interaktiv karta som visar data om alla världens länder.
            Välj olika index för att se hälsa, ekonomi, miljö och mer.
          </p>
        </div>
      </main>
    </>
  );
}

export default GlobalDiagnosticMap;
