/**
 * BLOCK RF — STORY NAVIGATION
 * 
 * Användaren kan:
 * - byta land
 * - byta period
 * - byta jämförelsegrupp
 * - byta mätvärden
 * 
 * Samma struktur, nya perspektiv.
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Globe, Calendar, Users, BarChart2, RefreshCw } from 'lucide-react';
import type { StoryNavigationState } from '@/config/countryStoriesConfig';
import { DEFAULT_COMPARISON_GROUPS } from '@/config/countryStoriesConfig';

interface StoryNavigationProps {
  currentState: StoryNavigationState;
  onNavigate: (newState: Partial<StoryNavigationState>) => void;
  availableCountries?: { code: string; name: string }[];
  availableIndicators?: { id: string; name: string }[];
}

const DEFAULT_COUNTRIES = [
  { code: 'SE', name: 'Sverige' },
  { code: 'NO', name: 'Norge' },
  { code: 'DK', name: 'Danmark' },
  { code: 'FI', name: 'Finland' },
  { code: 'DE', name: 'Tyskland' },
  { code: 'NL', name: 'Nederländerna' },
  { code: 'UK', name: 'Storbritannien' },
  { code: 'FR', name: 'Frankrike' },
];

const DEFAULT_INDICATORS = [
  { id: 'gdp_growth', name: 'BNP-tillväxt' },
  { id: 'unemployment', name: 'Arbetslöshet' },
  { id: 'inflation', name: 'Inflation' },
  { id: 'life_expectancy', name: 'Förväntad livslängd' },
  { id: 'renewable_energy', name: 'Förnybar energi' },
  { id: 'education_spending', name: 'Utbildningsutgifter' },
];

export function StoryNavigation({ 
  currentState,
  onNavigate,
  availableCountries = DEFAULT_COUNTRIES,
  availableIndicators = DEFAULT_INDICATORS,
}: StoryNavigationProps) {
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>(
    currentState.selectedIndicators
  );

  const handleIndicatorToggle = (indicatorId: string) => {
    const updated = selectedIndicators.includes(indicatorId)
      ? selectedIndicators.filter(id => id !== indicatorId)
      : [...selectedIndicators, indicatorId];
    
    setSelectedIndicators(updated);
    onNavigate({ selectedIndicators: updated });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <RefreshCw className="h-5 w-5" />
          Navigera berättelsen
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Samma struktur, nya perspektiv
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Country selector */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Land
          </Label>
          <Select 
            value={currentState.selectedCountry}
            onValueChange={(value) => onNavigate({ selectedCountry: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Välj land" />
            </SelectTrigger>
            <SelectContent>
              {availableCountries.map((country) => (
                <SelectItem key={country.code} value={country.code}>
                  {country.name} ({country.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Period selector */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Tidsperiod
          </Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs text-muted-foreground">Från</Label>
              <Select defaultValue="2015">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[2010, 2012, 2015, 2018, 2020].map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Till</Label>
              <Select defaultValue="2024">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[2020, 2022, 2023, 2024].map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Comparison group */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Jämförelsegrupp
          </Label>
          <Select 
            value={currentState.comparisonGroup[0]}
            onValueChange={(value) => {
              const group = DEFAULT_COMPARISON_GROUPS.find(g => g.id === value);
              if (group) {
                onNavigate({ comparisonGroup: group.countries });
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Välj grupp" />
            </SelectTrigger>
            <SelectContent>
              {DEFAULT_COMPARISON_GROUPS.map((group) => (
                <SelectItem key={group.id} value={group.id}>
                  {group.nameSv}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Show selected countries */}
          <div className="flex flex-wrap gap-1 mt-2">
            {currentState.comparisonGroup.map((code) => (
              <Badge key={code} variant="outline" className="text-xs">
                {code}
              </Badge>
            ))}
          </div>
        </div>

        {/* Indicators */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            Mätvärden
          </Label>
          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            {availableIndicators.map((indicator) => (
              <div key={indicator.id} className="flex items-center space-x-2">
                <Checkbox
                  id={indicator.id}
                  checked={selectedIndicators.includes(indicator.id)}
                  onCheckedChange={() => handleIndicatorToggle(indicator.id)}
                />
                <label
                  htmlFor={indicator.id}
                  className="text-sm cursor-pointer"
                >
                  {indicator.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Apply button */}
        <Button className="w-full">
          Uppdatera berättelse
          <RefreshCw className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}
