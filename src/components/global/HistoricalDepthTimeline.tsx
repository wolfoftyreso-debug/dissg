/**
 * 🕰️ HISTORICAL DEPTH TIMELINE
 * 
 * MASTER EXECUTION BLOCK 39 — Core Timeline Visualization
 * 
 * Features:
 * - Smooth zoom from 10 to 2000 years
 * - Layer toggles for different historical contexts
 * - Period bands (not arrows)
 * - Calm, comprehensible aesthetic
 */

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
// NO ICONS - Text markers only per design doctrine
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  GLOBAL_TIMELINE_LAYERS,
  HISTORICAL_UI_TEXT,
  RESOLUTION_DISCLAIMERS,
  VISUALIZATION_RULES,
  HISTORICAL_SOURCES,
  type TimelineLayer,
  type ResolutionMetadata,
} from '@/config/historicalDepthConfig';

// ============================================================
// TYPES
// ============================================================

type Language = 'sv' | 'en';

interface TimelineEvent {
  id: string;
  year: number;
  year_end?: number;
  layer_id: string;
  label: { sv: string; en: string };
  description?: { sv: string; en: string };
}

interface HistoricalDepthTimelineProps {
  language?: Language;
  indicator_id?: string;
  title?: { sv: string; en: string };
  events?: TimelineEvent[];
  current_year?: number;
  onZoomChange?: (range: { start: number; end: number }) => void;
}

// ============================================================
// MOCK EVENTS (for demonstration)
// ============================================================

const MOCK_EVENTS: TimelineEvent[] = [
  { id: 'e1', year: 1760, layer_id: 'industrialization', label: { sv: 'Industriella revolutionen börjar', en: 'Industrial Revolution begins' } },
  { id: 'e2', year: 1850, layer_id: 'energy_transitions', label: { sv: 'Kolåldern dominerar', en: 'Coal era dominates' } },
  { id: 'e3', year: 1914, year_end: 1918, layer_id: 'major_wars', label: { sv: 'Första världskriget', en: 'World War I' } },
  { id: 'e4', year: 1939, year_end: 1945, layer_id: 'major_wars', label: { sv: 'Andra världskriget', en: 'World War II' } },
  { id: 'e5', year: 1950, layer_id: 'demographic_transitions', label: { sv: 'Global befolkningstillväxt accelererar', en: 'Global population growth accelerates' } },
  { id: 'e6', year: 1970, layer_id: 'energy_transitions', label: { sv: 'Oljekrisen', en: 'Oil crisis' } },
  { id: 'e7', year: 1990, layer_id: 'technological_revolutions', label: { sv: 'Digital revolution', en: 'Digital revolution' } },
  { id: 'e8', year: 2008, layer_id: 'industrialization', label: { sv: 'Global finanskris', en: 'Global financial crisis' } },
  { id: 'e9', year: 2020, layer_id: 'demographic_transitions', label: { sv: 'COVID-19 pandemi', en: 'COVID-19 pandemic' } },
];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function getResolutionForRange(start: number, end: number): ResolutionMetadata {
  const span = end - start;
  
  let resolution: 'annual' | 'decadal' | 'century' | 'epoch';
  let density: 'dense' | 'moderate' | 'sparse' | 'reconstructed';
  let uncertainty: 'low' | 'medium' | 'high' | 'very_high';
  let disclaimerKey: string;

  if (start < 1850) {
    resolution = span > 200 ? 'century' : 'decadal';
    density = 'reconstructed';
    uncertainty = 'very_high';
    disclaimerKey = 'pre_1850';
  } else if (start < 1900) {
    resolution = span > 100 ? 'decadal' : 'annual';
    density = 'sparse';
    uncertainty = 'high';
    disclaimerKey = 'pre_1900';
  } else if (start < 1950) {
    resolution = 'annual';
    density = 'moderate';
    uncertainty = 'medium';
    disclaimerKey = 'pre_1950';
  } else {
    resolution = 'annual';
    density = 'dense';
    uncertainty = 'low';
    disclaimerKey = 'modern';
  }

  return {
    period: { start, end },
    resolution,
    data_density: density,
    uncertainty_level: uncertainty,
    disclaimer: RESOLUTION_DISCLAIMERS[disclaimerKey],
  };
}

function yearToPercent(year: number, start: number, end: number): number {
  return ((year - start) / (end - start)) * 100;
}

// ============================================================
// SUB-COMPONENTS
// ============================================================

/** Resolution & uncertainty indicator */
function ResolutionIndicator({ metadata, language }: { metadata: ResolutionMetadata; language: Language }) {
  const densityColors: Record<string, string> = {
    dense: 'bg-emerald-100 text-emerald-700',
    moderate: 'bg-amber-100 text-amber-700',
    sparse: 'bg-orange-100 text-orange-700',
    reconstructed: 'bg-slate-100 text-slate-600',
  };

  return (
    <Alert className="bg-slate-50 border-slate-200">
      <AlertDescription className="text-sm text-slate-600">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[10px] text-muted-foreground">[RES]</span>
          <Badge variant="outline" className={densityColors[metadata.data_density]}>
            {metadata.data_density}
          </Badge>
          <span className="text-muted-foreground">·</span>
          <span>{metadata.disclaimer[language]}</span>
        </div>
      </AlertDescription>
    </Alert>
  );
}

/** Layer toggle panel */
function LayerTogglePanel({
  layers,
  activeLayers,
  onToggle,
  language,
}: {
  layers: TimelineLayer[];
  activeLayers: Set<string>;
  onToggle: (id: string) => void;
  language: Language;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 font-mono">
          <span className="text-[10px]">[LAGER]</span>
          {HISTORICAL_UI_TEXT.toggle_layers[language]}
          <span className={`text-[10px] transition-transform ${isOpen ? 'rotate-180' : ''}`}>{isOpen ? '▲' : '▼'}</span>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-3">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {layers.map((layer) => (
            <div
              key={layer.id}
              className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              <Switch
                checked={activeLayers.has(layer.id)}
                onCheckedChange={() => onToggle(layer.id)}
                className="scale-90"
              />
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: layer.color }}
              />
              <span className="text-xs font-medium">{layer.name[language]}</span>
            </div>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

/** Timeline visualization */
function TimelineVisualization({
  events,
  activeLayers,
  range,
  language,
}: {
  events: TimelineEvent[];
  activeLayers: Set<string>;
  range: { start: number; end: number };
  language: Language;
}) {
  const filteredEvents = events.filter(
    (e) => activeLayers.has(e.layer_id) && e.year >= range.start && e.year <= range.end
  );

  const layerMap = new Map(GLOBAL_TIMELINE_LAYERS.map((l) => [l.id, l]));

  // Generate year markers
  const span = range.end - range.start;
  let step: number;
  if (span > 500) step = 100;
  else if (span > 100) step = 50;
  else if (span > 50) step = 10;
  else step = 5;

  const yearMarkers: number[] = [];
  for (let y = Math.ceil(range.start / step) * step; y <= range.end; y += step) {
    yearMarkers.push(y);
  }

  return (
    <div className="relative">
      {/* Timeline axis */}
      <div className="h-2 bg-slate-200 rounded-full mb-4" />
      
      {/* Year markers */}
      <div className="relative h-6 mb-4">
        {yearMarkers.map((year) => (
          <div
            key={year}
            className="absolute transform -translate-x-1/2 text-xs text-muted-foreground"
            style={{ left: `${yearToPercent(year, range.start, range.end)}%` }}
          >
            {year}
          </div>
        ))}
      </div>

      {/* Events as bands */}
      <div className="relative min-h-[120px]">
        {filteredEvents.map((event, index) => {
          const layer = layerMap.get(event.layer_id);
          const startPercent = yearToPercent(event.year, range.start, range.end);
          const endPercent = event.year_end
            ? yearToPercent(event.year_end, range.start, range.end)
            : startPercent + 2;
          const width = Math.max(endPercent - startPercent, 2);

          return (
            <TooltipProvider key={event.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="absolute h-8 rounded cursor-pointer hover:brightness-110 transition-all"
                    style={{
                      left: `${startPercent}%`,
                      width: `${width}%`,
                      top: `${(index % 3) * 36}px`,
                      backgroundColor: layer?.color || 'hsl(var(--muted))',
                      opacity: 0.8,
                    }}
                  />
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <p className="font-medium">{event.label[language]}</p>
                  <p className="text-xs text-muted-foreground">
                    {event.year}{event.year_end ? ` – ${event.year_end}` : ''}
                  </p>
                  {event.description && (
                    <p className="text-xs mt-1">{event.description[language]}</p>
                  )}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>

      {/* Current year marker */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-primary/50"
        style={{ left: `${yearToPercent(new Date().getFullYear(), range.start, range.end)}%` }}
      >
        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 rounded-full bg-primary" />
      </div>
    </div>
  );
}

/** Sources panel */
function SourcesPanel({ language }: { language: Language }) {
  return (
    <Card className="bg-slate-50 border-slate-200">
      <CardContent className="py-4">
        <p className="text-xs font-medium text-muted-foreground mb-2">
          {HISTORICAL_UI_TEXT.source_info[language]}:
        </p>
        <div className="flex flex-wrap gap-2">
          {HISTORICAL_SOURCES.slice(0, 6).map((source) => (
            <TooltipProvider key={source.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="secondary" className="text-xs cursor-help">
                    {source.name.split(' ')[0]}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="font-medium">{source.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {source.time_coverage.start} – {source.time_coverage.end}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export function HistoricalDepthTimeline({
  language = 'en',
  title,
  events = MOCK_EVENTS,
  current_year = new Date().getFullYear(),
  onZoomChange,
}: HistoricalDepthTimelineProps) {
  // State
  const [range, setRange] = useState({ start: 1900, end: current_year });
  const [activeLayers, setActiveLayers] = useState<Set<string>>(
    new Set(GLOBAL_TIMELINE_LAYERS.filter((l) => l.default_visible).map((l) => l.id))
  );

  // Computed
  const resolution = useMemo(() => getResolutionForRange(range.start, range.end), [range]);
  const span = range.end - range.start;

  // Handlers
  const handleZoom = (direction: 'in' | 'out') => {
    const delta = direction === 'in' ? -20 : 20;
    const newStart = Math.max(range.start + delta, -2000);
    const newEnd = Math.min(range.end - delta, current_year);
    
    if (newEnd - newStart >= VISUALIZATION_RULES.zoom_range.min_years) {
      const newRange = { start: newStart, end: newEnd };
      setRange(newRange);
      onZoomChange?.(newRange);
    }
  };

  const handleSliderChange = (value: number[]) => {
    const newRange = { start: value[0], end: range.end };
    setRange(newRange);
    onZoomChange?.(newRange);
  };

  const toggleLayer = (id: string) => {
    setActiveLayers((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            <span className="font-mono text-sm text-primary">[TID]</span>
            {title?.[language] || HISTORICAL_UI_TEXT.timeline_title[language]}
          </h2>
          <p className="text-muted-foreground mt-1">
            {range.start} – {range.end} ({span} {language === 'sv' ? 'år' : 'years'})
          </p>
        </div>
        
        {/* Zoom controls - text based */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => handleZoom('out')} className="font-mono text-xs">
            [−]
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleZoom('in')} className="font-mono text-xs">
            [+]
          </Button>
        </div>
      </div>

      {/* Resolution indicator */}
      <ResolutionIndicator metadata={resolution} language={language} />

      {/* Layer toggles */}
      <LayerTogglePanel
        layers={GLOBAL_TIMELINE_LAYERS}
        activeLayers={activeLayers}
        onToggle={toggleLayer}
        language={language}
      />

      {/* Main timeline */}
      <Card>
        <CardContent className="py-6">
          <TimelineVisualization
            events={events}
            activeLayers={activeLayers}
            range={range}
            language={language}
          />
        </CardContent>
      </Card>

      {/* Time range slider */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{language === 'sv' ? 'Startår' : 'Start year'}: {range.start}</span>
          <span>{language === 'sv' ? 'Nutid' : 'Present'}: {range.end}</span>
        </div>
        <Slider
          value={[range.start]}
          onValueChange={handleSliderChange}
          min={-2000}
          max={range.end - VISUALIZATION_RULES.zoom_range.min_years}
          step={10}
          className="w-full"
        />
      </div>

      {/* Sources */}
      <SourcesPanel language={language} />

      {/* Report footer disclaimer */}
      <div className="text-center text-xs text-muted-foreground italic border-t border-slate-200 pt-4">
        {HISTORICAL_UI_TEXT.report_footer[language]}
      </div>
    </div>
  );
}

export default HistoricalDepthTimeline;
