/**
 * BLOCK PB — DATA PICKER (EXTREMT ENKEL)
 * 
 * Användaren gör:
 * - välj Datapunkt A
 * - välj Datapunkt B
 * - (valfritt) välj filter (land, tid)
 * 
 * Systemet översätter detta till teknik. Inte användaren.
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import type { DataCategory, DataIndicator } from '@/config/correlationLearningCanvasConfig';
import { ArrowRight, Globe, Calendar } from 'lucide-react';

interface DataPickerProps {
  categories: DataCategory[];
  selectedA: DataIndicator | null;
  selectedB: DataIndicator | null;
  region: string;
  timeRange: [number, number];
  onSelectA: (indicator: DataIndicator) => void;
  onSelectB: (indicator: DataIndicator) => void;
  onSelectRegion: (region: string) => void;
  onSelectTimeRange: (range: [number, number]) => void;
}

const REGIONS = [
  { code: 'SE', name: 'Sverige' },
  { code: 'NO', name: 'Norge' },
  { code: 'DK', name: 'Danmark' },
  { code: 'FI', name: 'Finland' },
  { code: 'DE', name: 'Tyskland' },
  { code: 'FR', name: 'Frankrike' },
  { code: 'UK', name: 'Storbritannien' },
];

export function DataPicker({
  categories,
  selectedA,
  selectedB,
  region,
  timeRange,
  onSelectA,
  onSelectB,
  onSelectRegion,
  onSelectTimeRange,
}: DataPickerProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [selectingFor, setSelectingFor] = useState<'A' | 'B' | null>(null);

  const handleIndicatorSelect = (indicator: DataIndicator) => {
    if (selectingFor === 'A') {
      onSelectA(indicator);
    } else if (selectingFor === 'B') {
      onSelectB(indicator);
    }
    setSelectingFor(null);
    setExpandedCategory(null);
  };

  return (
    <div className="space-y-6">
      {/* Main selection area */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        {/* Indicator A */}
        <div className="flex-1 w-full">
          <div className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">
            Datapunkt A
          </div>
          <Button
            variant={selectedA ? "secondary" : "outline"}
            className={cn(
              "w-full h-auto py-4 px-4 justify-start text-left",
              !selectedA && "border-dashed"
            )}
            onClick={() => setSelectingFor(selectingFor === 'A' ? null : 'A')}
          >
            {selectedA ? (
              <div>
                <div className="font-medium">{selectedA.nameSv}</div>
                <div className="text-xs text-muted-foreground">{selectedA.unit}</div>
              </div>
            ) : (
              <span className="text-muted-foreground">Välj första datapunkt...</span>
            )}
          </Button>
        </div>

        {/* Arrow */}
        <div className="flex-shrink-0 text-muted-foreground">
          <ArrowRight className="h-5 w-5 rotate-90 md:rotate-0" />
        </div>

        {/* Indicator B */}
        <div className="flex-1 w-full">
          <div className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">
            Datapunkt B
          </div>
          <Button
            variant={selectedB ? "secondary" : "outline"}
            className={cn(
              "w-full h-auto py-4 px-4 justify-start text-left",
              !selectedB && "border-dashed"
            )}
            onClick={() => setSelectingFor(selectingFor === 'B' ? null : 'B')}
          >
            {selectedB ? (
              <div>
                <div className="font-medium">{selectedB.nameSv}</div>
                <div className="text-xs text-muted-foreground">{selectedB.unit}</div>
              </div>
            ) : (
              <span className="text-muted-foreground">Välj andra datapunkt...</span>
            )}
          </Button>
        </div>
      </div>

      {/* Category selection dropdown */}
      {selectingFor && (
        <div className="bg-muted/50 rounded-lg p-4 space-y-4 animate-in fade-in slide-in-from-top-2">
          <div className="text-sm font-medium">
            Välj {selectingFor === 'A' ? 'första' : 'andra'} datapunkten:
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={expandedCategory === category.id ? "default" : "outline"}
                size="sm"
                className="gap-2"
                onClick={() => setExpandedCategory(
                  expandedCategory === category.id ? null : category.id
                )}
              >
                <span>{category.icon}</span>
                <span>{category.nameSv}</span>
              </Button>
            ))}
          </div>

          {/* Indicators in selected category */}
          {expandedCategory && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 animate-in fade-in slide-in-from-top-2">
              {categories
                .find(c => c.id === expandedCategory)
                ?.indicators.map((indicator) => {
                  const isSelected = 
                    (selectingFor === 'A' && selectedA?.id === indicator.id) ||
                    (selectingFor === 'B' && selectedB?.id === indicator.id);
                  const isOtherSelected = 
                    (selectingFor === 'A' && selectedB?.id === indicator.id) ||
                    (selectingFor === 'B' && selectedA?.id === indicator.id);
                  
                  return (
                    <Button
                      key={indicator.id}
                      variant={isSelected ? "secondary" : "ghost"}
                      className={cn(
                        "h-auto py-3 px-4 justify-start text-left",
                        isOtherSelected && "opacity-50"
                      )}
                      disabled={isOtherSelected}
                      onClick={() => handleIndicatorSelect(indicator)}
                    >
                      <div>
                        <div className="font-medium">{indicator.nameSv}</div>
                        <div className="text-xs text-muted-foreground">
                          {indicator.descriptionSv}
                        </div>
                      </div>
                    </Button>
                  );
                })}
            </div>
          )}
        </div>
      )}

      {/* Filters row */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Region filter */}
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-muted-foreground" />
          <Select value={region} onValueChange={onSelectRegion}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Välj region" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Region</SelectLabel>
                {REGIONS.map((r) => (
                  <SelectItem key={r.code} value={r.code}>
                    {r.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Time range */}
        <div className="flex items-center gap-4 flex-1">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <div className="flex-1 px-2">
            <Slider
              value={timeRange}
              min={2000}
              max={2024}
              step={1}
              onValueChange={(value) => onSelectTimeRange(value as [number, number])}
              className="w-full"
            />
          </div>
          <div className="text-sm text-muted-foreground whitespace-nowrap">
            {timeRange[0]} – {timeRange[1]}
          </div>
        </div>
      </div>

      {/* Selection summary */}
      {selectedA && selectedB && (
        <div className="bg-primary/5 rounded-lg p-4 text-sm">
          <span className="text-muted-foreground">Du jämför </span>
          <Badge variant="secondary">{selectedA.nameSv}</Badge>
          <span className="text-muted-foreground"> med </span>
          <Badge variant="secondary">{selectedB.nameSv}</Badge>
          <span className="text-muted-foreground"> i </span>
          <Badge variant="outline">{REGIONS.find(r => r.code === region)?.name}</Badge>
          <span className="text-muted-foreground"> under perioden </span>
          <Badge variant="outline">{timeRange[0]}–{timeRange[1]}</Badge>
        </div>
      )}
    </div>
  );
}
