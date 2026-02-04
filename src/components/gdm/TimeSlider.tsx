/**
 * Time Slider
 * 
 * Controls the time dimension of the map.
 */

import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

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
    <div 
      className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 pointer-events-auto"
    >
      <div 
        className="px-6 py-4 rounded-lg backdrop-blur-md border flex items-center gap-4"
        style={{ background: 'rgba(0,0,0,0.7)', borderColor: 'rgba(255,255,255,0.1)' }}
      >
        {/* Playback controls */}
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => onChange(minYear)}
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          {onPlayPause && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={onPlayPause}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => onChange(maxYear)}
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        {/* Year display */}
        <div className="w-16 text-center">
          <div className="font-mono text-2xl font-bold text-white">{year}</div>
        </div>

        {/* Slider */}
        <div className="w-64">
          <Slider
            value={[year]}
            min={minYear}
            max={maxYear}
            step={1}
            onValueChange={(v) => onChange(v[0])}
            className="w-full"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
            <span>{minYear}</span>
            <span>{maxYear}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TimeSlider;
