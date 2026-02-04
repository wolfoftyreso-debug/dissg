/**
 * Global Diagnostic Map (GDM)
 * 
 * The oscilloscope for civilization.
 * Main entry point combining all GDM components.
 */

import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Maximize2, Minimize2, Settings } from 'lucide-react';
import { MapContainer } from './MapContainer';
import { GlobalStatusBar } from './GlobalStatusBar';
import { LayerPanel } from './LayerPanel';
import { DiagnosticPanel } from './DiagnosticPanel';
import { TimeSlider } from './TimeSlider';
import { AISignalOverlay } from './AISignalOverlay';
import type { MapLayerId, AISignal } from './types';

export function GlobalDiagnosticMap() {
  // State
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [activeLayers, setActiveLayers] = useState<MapLayerId[]>(['lambda']);
  const [timeYear, setTimeYear] = useState(2024);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPro, setIsPro] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showLayerPanel, setShowLayerPanel] = useState(true);
  const [signals, setSignals] = useState<AISignal[]>([
    {
      type: 'deviation',
      geoCode: 'US',
      severity: 'warning',
      message: { sv: '🟡 USA visar avvikelse i HEALTH-axeln', en: '🟡 USA shows deviation in HEALTH axis' },
      action: { label: 'Undersök', onClick: () => {} },
    },
  ]);

  // Toggle layer
  const handleToggleLayer = useCallback((layerId: MapLayerId) => {
    setActiveLayers(prev => 
      prev.includes(layerId) 
        ? prev.filter(id => id !== layerId)
        : [...prev, layerId]
    );
  }, []);

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
    }, 500);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Dismiss signal
  const handleDismissSignal = useCallback((index: number) => {
    setSignals(prev => prev.filter((_, i) => i !== index));
  }, []);

  // Handle signal action
  const handleSignalAction = useCallback((signal: AISignal) => {
    setSelectedCountry(signal.geoCode);
    handleDismissSignal(signals.indexOf(signal));
  }, [signals]);

  // GEDI selection
  const handleSelectGEDI = useCallback((code: string) => {
    // Would open GEDI guided diagnostic flow
    console.log('Open GEDI flow:', code);
  }, []);

  return (
    <div 
      className={`relative w-full h-screen overflow-hidden ${
        isFullscreen ? 'fixed inset-0 z-50' : ''
      }`}
    >
      {/* Map */}
      <MapContainer
        theme={theme}
        onSelectCountry={setSelectedCountry}
        selectedCountry={selectedCountry}
        activeLayer={activeLayers[0] || 'lambda'}
        timeYear={timeYear}
      />

      {/* Global Status (top-left) */}
      <GlobalStatusBar timeYear={timeYear} />

      {/* Layer Panel (top-right) */}
      {showLayerPanel && (
        <LayerPanel
          activeLayers={activeLayers}
          onToggleLayer={handleToggleLayer}
          isPro={isPro}
        />
      )}

      {/* Time Slider (bottom-center) */}
      <TimeSlider
        year={timeYear}
        minYear={2000}
        maxYear={2024}
        onChange={setTimeYear}
        isPlaying={isPlaying}
        onPlayPause={() => setIsPlaying(!isPlaying)}
      />

      {/* AI Signals (bottom-left) */}
      <AISignalOverlay
        signals={signals}
        onDismiss={handleDismissSignal}
        onAction={handleSignalAction}
      />

      {/* Diagnostic Side Panel */}
      {selectedCountry && (
        <div className="absolute top-0 right-0 h-full w-96 z-20">
          <DiagnosticPanel
            countryCode={selectedCountry}
            onClose={() => setSelectedCountry(null)}
            onSelectGEDI={handleSelectGEDI}
            isPro={isPro}
          />
        </div>
      )}

      {/* Control buttons (bottom-right) */}
      <div className="absolute bottom-4 right-4 z-10 flex gap-2 pointer-events-auto">
        <Button
          variant="secondary"
          size="icon"
          onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
          className="backdrop-blur-md"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={() => setShowLayerPanel(!showLayerPanel)}
          className="backdrop-blur-md"
        >
          <Settings className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="backdrop-blur-md"
        >
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>
        <Button
          variant={isPro ? "default" : "outline"}
          size="sm"
          onClick={() => setIsPro(!isPro)}
          className="backdrop-blur-md font-mono"
        >
          {isPro ? 'PRO' : 'FREE'}
        </Button>
      </div>

      {/* Hidden semantic content for SEO/Accessibility */}
      <div className="sr-only" aria-hidden="true">
        <h1>Global Diagnostic Map (GDM) - Oscilloskopet för civilisationen</h1>
        <p>
          Ett diagnosinstrument för att visualisera och analysera samhällsdata globalt.
          Visar Lambda-systembalans, GEDI-felkoder och strukturella mönster.
        </p>
        <ul>
          <li>Kartan är alltid sanningen</li>
          <li>Inget visas utan kontext</li>
          <li>Allt är klickbart</li>
          <li>Allt går att fördjupa</li>
          <li>Inga dekorativa element</li>
          <li>Färg = tillstånd, inte känsla</li>
        </ul>
      </div>
    </div>
  );
}

export default GlobalDiagnosticMap;
