/**
 * Time Slider
 * 
 * Controls the time dimension of the map.
 * MYNDIGHETSDESIGN: Strikt, klinisk, inga spel-liknande effekter.
 * NO ICONS per no-icons-doctrine.
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
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 pointer-events-auto">
      <div 
        className="px-6 py-3 rounded-sm backdrop-blur-sm border flex items-center gap-4"
        style={{ 
          background: 'rgba(15,23,42,0.92)', 
          borderColor: 'rgba(71,85,105,0.5)' 
        }}
      >
        {/* Playback controls - Text markers */}
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 w-7 font-mono text-[10px] text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
            onClick={() => onChange(minYear)}
          >
            [«]
          </Button>
          {onPlayPause && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 w-7 font-mono text-[10px] text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
              onClick={onPlayPause}
            >
              {isPlaying ? '[||]' : '[>]'}
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 w-7 font-mono text-[10px] text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
            onClick={() => onChange(maxYear)}
          >
            [»]
          </Button>
        </div>

        {/* Year display - Klinisk typografi */}
        <div className="w-14 text-center">
          <div className="font-mono text-xl font-semibold text-slate-200 tracking-tight">{year}</div>
        </div>

        {/* Slider */}
        <div className="w-56">
          <Slider
            value={[year]}
            min={minYear}
            max={maxYear}
            step={1}
            onValueChange={(v) => onChange(v[0])}
            className="w-full"
          />
          <div className="flex justify-between text-[9px] text-slate-500 mt-1 font-mono">
            <span>{minYear}</span>
            <span>{maxYear}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TimeSlider;
