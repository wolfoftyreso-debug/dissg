/**
 * Simple Time Slider
 * 
 * Clean, minimal time navigation with range selection.
 */

import React, { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface SimpleTimeSliderProps {
  year: number;
  onChange: (year: number) => void;
  isPlaying?: boolean;
  onPlayPause?: () => void;
  minYear?: number;
  maxYear?: number;
  // Range support
  yearRange?: [number, number];
  onRangeChange?: (range: [number, number]) => void;
}

export function SimpleTimeSlider({
  year,
  onChange,
  isPlaying = false,
  onPlayPause,
  minYear = 2000,
  maxYear = 2024,
  yearRange,
  onRangeChange,
}: SimpleTimeSliderProps) {
  const [isRangeMode, setIsRangeMode] = useState(!!yearRange);
  const [localRange, setLocalRange] = useState<[number, number]>(yearRange || [minYear, maxYear]);
  const [showRangePopover, setShowRangePopover] = useState(false);

  const handleRangeChange = (values: number[]) => {
    const newRange: [number, number] = [values[0], values[1]];
    setLocalRange(newRange);
    onRangeChange?.(newRange);
    // Also update current year to be within range
    if (year < newRange[0]) onChange(newRange[0]);
    if (year > newRange[1]) onChange(newRange[1]);
  };

  const handleSingleChange = (values: number[]) => {
    onChange(values[0]);
  };

  const toggleRangeMode = () => {
    setIsRangeMode(!isRangeMode);
    if (!isRangeMode) {
      // Entering range mode - set range around current year
      const start = Math.max(minYear, year - 5);
      const end = Math.min(maxYear, year + 5);
      setLocalRange([start, end]);
      onRangeChange?.([start, end]);
    }
  };

  // Quick range presets
  const presets = [
    { label: '5 år', range: [maxYear - 5, maxYear] as [number, number] },
    { label: '10 år', range: [maxYear - 10, maxYear] as [number, number] },
    { label: '20 år', range: [maxYear - 20, maxYear] as [number, number] },
    { label: 'Allt', range: [minYear, maxYear] as [number, number] },
  ];

  return (
    <div 
      className="flex items-center gap-3 px-4 py-3 bg-white/95 backdrop-blur-md rounded-full shadow-lg border border-slate-200"
      role="group"
      aria-label="Tidsnavigering"
    >
      {/* Play/Pause Button */}
      {onPlayPause && (
        <button
          onClick={onPlayPause}
          aria-label={isPlaying ? 'Pausa' : 'Spela upp tidslinje'}
          className={`
            w-9 h-9 rounded-full flex items-center justify-center
            font-bold text-sm transition-all duration-200
            ${isPlaying 
              ? 'bg-slate-900 text-white' 
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }
          `}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
      )}

      {/* Range Mode Toggle */}
      <Popover open={showRangePopover} onOpenChange={setShowRangePopover}>
        <PopoverTrigger asChild>
          <button
            className={`
              px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all
              ${isRangeMode 
                ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }
            `}
            aria-label="Välj tidsperiod"
          >
            📅 {isRangeMode ? `${localRange[0]}–${localRange[1]}` : 'Period'}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-4" align="center" side="top">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-slate-900 text-sm">Välj mätperiod</h4>
              <button
                onClick={() => {
                  setIsRangeMode(!isRangeMode);
                  if (isRangeMode) {
                    onRangeChange?.(undefined as any);
                  }
                }}
                className="text-xs text-blue-600 hover:text-blue-700"
              >
                {isRangeMode ? 'Använd ett år' : 'Använd period'}
              </button>
            </div>

            {/* Range Slider */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-slate-700">{localRange[0]}</span>
                <span className="text-slate-400">→</span>
                <span className="font-medium text-slate-700">{localRange[1]}</span>
              </div>
              <Slider
                value={localRange}
                min={minYear}
                max={maxYear}
                step={1}
                onValueChange={handleRangeChange}
                className="w-full"
              />
              <p className="text-xs text-slate-500 text-center">
                {localRange[1] - localRange[0]} års data
              </p>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-2">
              {presets.map(preset => (
                <Button
                  key={preset.label}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setLocalRange(preset.range);
                    onRangeChange?.(preset.range);
                    setIsRangeMode(true);
                  }}
                  className={`text-xs ${
                    localRange[0] === preset.range[0] && localRange[1] === preset.range[1]
                      ? 'bg-blue-50 border-blue-300 text-blue-700'
                      : ''
                  }`}
                >
                  {preset.label}
                </Button>
              ))}
            </div>

            <Button 
              onClick={() => setShowRangePopover(false)} 
              className="w-full"
              size="sm"
            >
              Klar
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Main Slider */}
      <div className="w-44">
        <Slider
          value={[year]}
          min={isRangeMode ? localRange[0] : minYear}
          max={isRangeMode ? localRange[1] : maxYear}
          step={1}
          onValueChange={handleSingleChange}
          aria-label="Välj år"
          className="w-full"
        />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1 px-0.5">
          <span>{isRangeMode ? localRange[0] : minYear}</span>
          <span className="font-medium text-slate-600">{year}</span>
          <span>{isRangeMode ? localRange[1] : maxYear}</span>
        </div>
      </div>

      {/* Quick jump buttons */}
      <div className="flex gap-0.5">
        <button
          onClick={() => onChange(isRangeMode ? localRange[0] : minYear)}
          className="px-2 py-1.5 text-xs text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label={`Gå till ${isRangeMode ? localRange[0] : minYear}`}
        >
          ⏮
        </button>
        <button
          onClick={() => onChange(isRangeMode ? localRange[1] : maxYear)}
          className="px-2 py-1.5 text-xs text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label={`Gå till ${isRangeMode ? localRange[1] : maxYear}`}
        >
          ⏭
        </button>
      </div>
    </div>
  );
}

export default SimpleTimeSlider;
