/**
 * Time Slider
 * 
 * Controls the time dimension of the map.
 * MYNDIGHETSDESIGN: Strikt, klinisk, inga spel-liknande effekter.
 * NO ICONS per no-icons-doctrine - ASCII text markers only.
 * 
 * @semantic proper ARIA for slider component
 * @a11y Keyboard accessible with screen reader support
 */

import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

interface TimeSliderProps {
  year: number;
  minYear: number;
  maxYear: number;
  onChange: (year: number) => void;
  isPlaying?: boolean;
  onPlayPause?: () => void;
}

export function TimeSlider({
  year,
  minYear,
  maxYear,
  onChange,
  isPlaying = false,
  onPlayPause,
}: TimeSliderProps) {
  return (
    <nav 
      className="pointer-events-auto"
      aria-label="Tidsnavigering"
    >
      <div 
        className="px-5 py-3 rounded-sm backdrop-blur-sm border flex items-center gap-4"
        style={{ 
          background: 'hsl(222.2 84% 4.9% / 0.95)', 
          borderColor: 'hsl(215 20.2% 35% / 0.5)' 
        }}
      >
        {/* Playback controls - ASCII text markers */}
        <div 
          className="flex items-center gap-1"
          role="group"
          aria-label="Uppspelningskontroller"
        >
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 px-2 font-mono text-[10px] text-slate-400 hover:text-slate-100 hover:bg-slate-700/50"
            onClick={() => onChange(minYear)}
            aria-label={`Gå till första år (${minYear})`}
          >
            [FIRST]
          </Button>
          {onPlayPause && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 px-2 font-mono text-[10px] text-slate-400 hover:text-slate-100 hover:bg-slate-700/50"
              onClick={onPlayPause}
              aria-label={isPlaying ? 'Pausa uppspelning' : 'Spela upp tidslinje'}
              aria-pressed={isPlaying}
            >
              {isPlaying ? '[STOP]' : '[PLAY]'}
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 px-2 font-mono text-[10px] text-slate-400 hover:text-slate-100 hover:bg-slate-700/50"
            onClick={() => onChange(maxYear)}
            aria-label={`Gå till senaste år (${maxYear})`}
          >
            [LAST]
          </Button>
        </div>

        {/* Year display */}
        <div className="w-16 text-center">
          <output 
            htmlFor="time-slider"
            className="font-mono text-2xl font-bold text-slate-100 tracking-tight block"
            aria-live="polite"
          >
            {year}
          </output>
        </div>

        {/* Slider with year range */}
        <div className="w-64">
          <Slider
            id="time-slider"
            value={[year]}
            min={minYear}
            max={maxYear}
            step={1}
            onValueChange={(v) => onChange(v[0])}
            aria-label="Välj år"
            aria-valuemin={minYear}
            aria-valuemax={maxYear}
            aria-valuenow={year}
            aria-valuetext={`År ${year}`}
            className="w-full"
          />
          <div 
            className="flex justify-between text-[9px] text-slate-500 mt-1.5 font-mono px-1"
            aria-hidden="true"
          >
            <span>{minYear}</span>
            <span className="text-blue-400">{maxYear}</span>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default TimeSlider;
