/**
 * Simple Time Slider
 * 
 * Clean, minimal time navigation.
 */

import React from 'react';
import { Slider } from '@/components/ui/slider';

interface SimpleTimeSliderProps {
  year: number;
  onChange: (year: number) => void;
  isPlaying?: boolean;
  onPlayPause?: () => void;
  minYear?: number;
  maxYear?: number;
}

export function SimpleTimeSlider({
  year,
  onChange,
  isPlaying = false,
  onPlayPause,
  minYear = 2000,
  maxYear = 2024,
}: SimpleTimeSliderProps) {
  return (
    <div 
      className="flex items-center gap-4 px-5 py-3 bg-white/95 backdrop-blur-md rounded-full shadow-lg border border-slate-200"
      role="group"
      aria-label="Tidsnavigering"
    >
      {/* Play/Pause Button */}
      {onPlayPause && (
        <button
          onClick={onPlayPause}
          aria-label={isPlaying ? 'Pausa' : 'Spela upp tidslinje'}
          className={`
            w-10 h-10 rounded-full flex items-center justify-center
            font-bold text-lg transition-all duration-200
            ${isPlaying 
              ? 'bg-slate-900 text-white' 
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }
          `}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
      )}

      {/* Slider */}
      <div className="w-48">
        <Slider
          value={[year]}
          min={minYear}
          max={maxYear}
          step={1}
          onValueChange={(v) => onChange(v[0])}
          aria-label="Välj år"
          className="w-full"
        />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1 px-1">
          <span>{minYear}</span>
          <span>{maxYear}</span>
        </div>
      </div>

      {/* Quick jump buttons */}
      <div className="flex gap-1">
        <button
          onClick={() => onChange(minYear)}
          className="px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label={`Gå till ${minYear}`}
        >
          ⏮
        </button>
        <button
          onClick={() => onChange(maxYear)}
          className="px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label={`Gå till ${maxYear}`}
        >
          ⏭
        </button>
      </div>
    </div>
  );
}

export default SimpleTimeSlider;
