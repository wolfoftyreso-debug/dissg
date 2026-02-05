/**
 * Global Diagnostic Map (GDM)
 * 
 * The oscilloscope for civilization.
 * Main entry point combining all GDM components.
 * 
 * MYNDIGHETSDESIGN: Strikt, klinisk, inga spel-liknande effekter.
 * NO ICONS per no-icons-doctrine (ASCII text markers only).
 * 
 * @semantic HTML5 landmark elements for accessibility
 * @machineReadable Schema.org WebApplication + Dataset
 */

import React, { useState, useCallback, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { MapContainer } from './MapContainer';
import { GlobalStatusBar } from './GlobalStatusBar';
import { LayerPanel } from './LayerPanel';
import { DiagnosticPanel } from './DiagnosticPanel';
import { TimeSlider } from './TimeSlider';
import { AISignalOverlay } from './AISignalOverlay';
import type { MapLayerId, AISignal } from './types';

/** Schema.org JSON-LD for machine readability */
const GDM_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Global Diagnostic Map",
  "alternateName": "GDM",
  "description": "Diagnostic visualization interface for civilizational system balance. Displays Lambda values, GEDI fault codes, and structural patterns across geographies.",
  "applicationCategory": "DataVisualization",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "SEK"
  },
  "featureList": [
    "Lambda system balance visualization",
    "GEDI fault code monitoring",
    "Historical time series analysis",
    "Multi-layer diagnostic overlays"
  ],
  "isPartOf": {
    "@type": "Dataset",
    "name": "DISSG Global Diagnostic Dataset",
    "description": "Aggregated societal indicators across 8 axes for global coverage"
  }
};

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
      message: { sv: 'USA visar avvikelse i HEALTH-axeln', en: 'USA shows deviation in HEALTH axis' },
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
    console.log('Open GEDI flow:', code);
  }, []);

  return (
    <>
      {/* SEO & Schema.org metadata */}
      <Helmet>
        <title>GDM | Global Diagnostic Map | DISSG</title>
        <meta name="description" content="Global Diagnostic Map - Oscilloskopet för civilisationen. Visualiserar Lambda-systembalans, GEDI-felkoder och strukturella mönster globalt." />
        <script type="application/ld+json">
          {JSON.stringify(GDM_SCHEMA)}
        </script>
      </Helmet>

      <main 
        role="application"
        aria-label="Global Diagnostic Map"
        className={`relative w-full h-full overflow-hidden ${
          isFullscreen ? 'fixed inset-0 z-50' : ''
        }`}
        style={{ 
          background: theme === 'dark' 
            ? 'hsl(var(--background))' 
            : 'hsl(var(--background))',
          minHeight: 'calc(100vh - 56px)',
        }}
      >
        {/* Map visualization */}
        <section 
          aria-label="Kartvisualisering"
          className="absolute inset-0"
        >
          <MapContainer
            theme={theme}
            onSelectCountry={setSelectedCountry}
            selectedCountry={selectedCountry}
            activeLayer={activeLayers[0] || 'lambda'}
            timeYear={timeYear}
          />
        </section>

        {/* Global Status (top-left) */}
        <header 
          role="banner"
          aria-label="Global systemstatus"
          className="absolute top-4 left-4 z-30"
        >
          <GlobalStatusBar timeYear={timeYear} />
        </header>

        {/* Layer Panel (top-right) - Hide when diagnostic panel is open */}
        {showLayerPanel && !selectedCountry && (
          <nav 
            role="navigation"
            aria-label="Kartlager"
            className="absolute top-4 right-16 z-10"
          >
            <LayerPanel
              activeLayers={activeLayers}
              onToggleLayer={handleToggleLayer}
              isPro={isPro}
            />
          </nav>
        )}

        {/* Time Slider (bottom-center) */}
        <section 
          role="slider"
          aria-label="Tidsnavigering"
          aria-valuemin={2000}
          aria-valuemax={2024}
          aria-valuenow={timeYear}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10"
        >
          <TimeSlider
            year={timeYear}
            minYear={2000}
            maxYear={2024}
            onChange={setTimeYear}
            isPlaying={isPlaying}
            onPlayPause={() => setIsPlaying(!isPlaying)}
          />
        </section>

        {/* AI Signals (bottom-left) */}
        <aside 
          role="complementary"
          aria-label="AI-signaler"
          aria-live="polite"
          className="absolute bottom-24 left-4 z-10"
        >
          <AISignalOverlay
            signals={signals}
            onDismiss={handleDismissSignal}
            onAction={handleSignalAction}
          />
        </aside>

        {/* Diagnostic Side Panel - Only visible when country is selected */}
        {selectedCountry && (
          <aside 
            role="complementary"
            aria-label={`Diagnostik för ${selectedCountry}`}
            className="absolute top-0 right-0 h-full w-96 z-40 pointer-events-auto"
          >
            <DiagnosticPanel
              countryCode={selectedCountry}
              onClose={() => setSelectedCountry(null)}
              onSelectGEDI={handleSelectGEDI}
              isPro={isPro}
            />
          </aside>
        )}

        {/* Control buttons (bottom-right) - ASCII text markers only */}
        <footer 
          role="toolbar"
          aria-label="Kartkontroller"
          className="absolute bottom-4 right-4 z-10 flex gap-2 pointer-events-auto"
        >
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
            aria-label={theme === 'dark' ? 'Byt till ljust läge' : 'Byt till mörkt läge'}
            className="backdrop-blur-md font-mono text-[10px] h-8 px-3 bg-slate-800/90 border border-slate-600/50 text-slate-300 hover:bg-slate-700/90 hover:text-slate-100"
          >
            {theme === 'dark' ? '[LIGHT]' : '[DARK]'}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowLayerPanel(!showLayerPanel)}
            aria-label={showLayerPanel ? 'Dölj lagerpanel' : 'Visa lagerpanel'}
            aria-pressed={showLayerPanel}
            className="backdrop-blur-md font-mono text-[10px] h-8 px-3 bg-slate-800/90 border border-slate-600/50 text-slate-300 hover:bg-slate-700/90 hover:text-slate-100"
          >
            [LAYERS]
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
            aria-label={isFullscreen ? 'Avsluta helskärm' : 'Helskärmsläge'}
            aria-pressed={isFullscreen}
            className="backdrop-blur-md font-mono text-[10px] h-8 px-3 bg-slate-800/90 border border-slate-600/50 text-slate-300 hover:bg-slate-700/90 hover:text-slate-100"
          >
            {isFullscreen ? '[EXIT]' : '[FULL]'}
          </Button>
          <Button
            variant={isPro ? "default" : "outline"}
            size="sm"
            onClick={() => setIsPro(!isPro)}
            aria-label={isPro ? 'Inaktivera PRO-läge' : 'Aktivera PRO-läge'}
            aria-pressed={isPro}
            className={`backdrop-blur-md font-mono text-[10px] h-8 px-4 border ${
              isPro 
                ? 'bg-blue-900/90 border-blue-700/50 text-blue-100 hover:bg-blue-800/90' 
                : 'bg-slate-800/90 border-slate-600/50 text-slate-400 hover:bg-slate-700/90'
            }`}
          >
            PRO
          </Button>
        </footer>

        {/* Hidden semantic content for SEO/Accessibility - embedded per doctrine */}
        <div className="sr-only">
          <h1>Global Diagnostic Map (GDM)</h1>
          <h2>Oscilloskopet för civilisationen</h2>
          <p>
            Ett kliniskt diagnosinstrument för att visualisera och analysera 
            samhällsdata globalt. Visar Lambda-systembalans (λ), GEDI-felkoder 
            och strukturella mönster utan normativa värderingar.
          </p>
          <h3>Systembegränsningar</h3>
          <ul>
            <li>Korrelation innebär inte kausalitet</li>
            <li>Aggregerad data kan dölja lokala variationer</li>
            <li>Historisk data garanterar inte framtida utfall</li>
            <li>Lambda är ett balansmått, inte ett kvalitetsmått</li>
          </ul>
          <h3>Vad systemet INTE gör</h3>
          <ul>
            <li>Ger inga rekommendationer</li>
            <li>Rangordnar inte länder efter "bättre" eller "sämre"</li>
            <li>Förutspår inte framtiden</li>
            <li>Tillskriver inte orsak utan verifierbara samband</li>
          </ul>
        </div>
      </main>
    </>
  );
}

export default GlobalDiagnosticMap;
