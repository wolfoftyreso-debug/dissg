/**
 * City Markers Component
 * 
 * Renders city-level markers on the map with selected indicators.
 * Clean, non-cluttered design even with many indicators selected.
 */

import React from 'react';
import { CITY_INDICATORS, type CityIndicator } from './CityIndicatorSelector';

// Mock city data
export interface CityData {
  id: string;
  name: string;
  country: string;
  coordinates: [number, number];
  population: number;
  indicators: Record<string, number>;
}

export const MOCK_CITIES: CityData[] = [
  {
    id: 'stockholm',
    name: 'Stockholm',
    country: 'SE',
    coordinates: [18.0686, 59.3293],
    population: 975000,
    indicators: {
      life_expectancy: 83.2, healthcare_access: 94, air_quality: 87,
      median_income: 38500, unemployment: 5.2, housing_cost: 195, gini: 0.28,
      co2_emissions: 2.1, green_space: 68, renewable_energy: 78, recycling: 49,
      education_level: 52, crime_rate: 12.4, voter_turnout: 87, trust_index: 72,
      public_transport: 91, internet_speed: 245, hospital_beds: 2.3,
    },
  },
  {
    id: 'gothenburg',
    name: 'Göteborg',
    country: 'SE',
    coordinates: [11.9746, 57.7089],
    population: 583000,
    indicators: {
      life_expectancy: 82.8, healthcare_access: 92, air_quality: 82,
      median_income: 34200, unemployment: 6.1, housing_cost: 142, gini: 0.31,
      co2_emissions: 2.8, green_space: 58, renewable_energy: 72, recycling: 45,
      education_level: 48, crime_rate: 14.2, voter_turnout: 84, trust_index: 68,
      public_transport: 85, internet_speed: 198, hospital_beds: 2.1,
    },
  },
  {
    id: 'malmo',
    name: 'Malmö',
    country: 'SE',
    coordinates: [13.0038, 55.6049],
    population: 347000,
    indicators: {
      life_expectancy: 81.5, healthcare_access: 89, air_quality: 79,
      median_income: 29800, unemployment: 9.4, housing_cost: 128, gini: 0.35,
      co2_emissions: 3.2, green_space: 42, renewable_energy: 65, recycling: 41,
      education_level: 44, crime_rate: 18.7, voter_turnout: 79, trust_index: 58,
      public_transport: 78, internet_speed: 176, hospital_beds: 1.9,
    },
  },
  {
    id: 'oslo',
    name: 'Oslo',
    country: 'NO',
    coordinates: [10.7522, 59.9139],
    population: 698000,
    indicators: {
      life_expectancy: 83.9, healthcare_access: 96, air_quality: 91,
      median_income: 52400, unemployment: 3.8, housing_cost: 285, gini: 0.25,
      co2_emissions: 1.8, green_space: 78, renewable_energy: 98, recycling: 52,
      education_level: 54, crime_rate: 8.2, voter_turnout: 82, trust_index: 78,
      public_transport: 88, internet_speed: 312, hospital_beds: 2.8,
    },
  },
  {
    id: 'copenhagen',
    name: 'Köpenhamn',
    country: 'DK',
    coordinates: [12.5683, 55.6761],
    population: 644000,
    indicators: {
      life_expectancy: 82.4, healthcare_access: 93, air_quality: 85,
      median_income: 44100, unemployment: 4.5, housing_cost: 215, gini: 0.27,
      co2_emissions: 2.4, green_space: 62, renewable_energy: 82, recycling: 48,
      education_level: 51, crime_rate: 10.1, voter_turnout: 86, trust_index: 76,
      public_transport: 92, internet_speed: 268, hospital_beds: 2.4,
    },
  },
  {
    id: 'helsinki',
    name: 'Helsingfors',
    country: 'FI',
    coordinates: [24.9384, 60.1699],
    population: 656000,
    indicators: {
      life_expectancy: 82.1, healthcare_access: 95, air_quality: 92,
      median_income: 41200, unemployment: 5.9, housing_cost: 182, gini: 0.26,
      co2_emissions: 2.0, green_space: 72, renewable_energy: 68, recycling: 44,
      education_level: 56, crime_rate: 7.8, voter_turnout: 75, trust_index: 74,
      public_transport: 89, internet_speed: 224, hospital_beds: 2.6,
    },
  },
];

interface CityMarkersProps {
  selectedIndicators: string[];
  onSelectCity: (cityId: string) => void;
  selectedCity: string | null;
}

/**
 * Get score color based on value (normalized 0-100)
 */
function getScoreColor(value: number, max: number, inverted = false): string {
  const normalized = (value / max) * 100;
  const score = inverted ? 100 - normalized : normalized;
  
  if (score >= 80) return '#22c55e';
  if (score >= 60) return '#84cc16';
  if (score >= 40) return '#eab308';
  if (score >= 20) return '#f97316';
  return '#ef4444';
}

/**
 * Get primary indicator to show on marker
 */
function getPrimaryIndicatorValue(city: CityData, selectedIndicators: string[]): { value: number; icon: string; color: string } | null {
  if (selectedIndicators.length === 0) return null;
  
  const primaryId = selectedIndicators[0];
  const indicator = CITY_INDICATORS.find(i => i.id === primaryId);
  if (!indicator) return null;
  
  const value = city.indicators[primaryId];
  if (value === undefined) return null;
  
  return {
    value: Math.round(value),
    icon: indicator.icon,
    color: indicator.color,
  };
}

/**
 * Calculate aggregate score for city based on selected indicators
 */
function calculateAggregateScore(city: CityData, selectedIndicators: string[]): number {
  if (selectedIndicators.length === 0) return 0;
  
  let total = 0;
  let count = 0;
  
  selectedIndicators.forEach(id => {
    const value = city.indicators[id];
    if (value !== undefined) {
      // Normalize different indicators to 0-100 scale
      const indicator = CITY_INDICATORS.find(i => i.id === id);
      if (indicator) {
        let normalized: number;
        
        // Different normalization based on indicator type
        switch (id) {
          case 'life_expectancy': normalized = ((value - 70) / 20) * 100; break;
          case 'unemployment': normalized = 100 - (value * 5); break; // Inverted
          case 'crime_rate': normalized = 100 - (value * 3); break; // Inverted
          case 'co2_emissions': normalized = 100 - (value * 15); break; // Inverted
          case 'gini': normalized = 100 - (value * 200); break; // Inverted
          case 'housing_cost': normalized = 100 - (value / 3); break; // Inverted (higher cost = worse)
          default: normalized = value; break;
        }
        
        total += Math.max(0, Math.min(100, normalized));
        count++;
      }
    }
  });
  
  return count > 0 ? Math.round(total / count) : 0;
}

export function CityMarkerContent({
  city,
  selectedIndicators,
  isSelected,
  onClick,
}: {
  city: CityData;
  selectedIndicators: string[];
  isSelected: boolean;
  onClick: () => void;
}) {
  const aggregateScore = calculateAggregateScore(city, selectedIndicators);
  const scoreColor = getScoreColor(aggregateScore, 100);
  const showDetails = selectedIndicators.length <= 4;
  
  return (
    <button
      onClick={onClick}
      className={`
        city-marker group relative flex flex-col items-center
        transition-all duration-200 hover:scale-110 hover:z-50
        ${isSelected ? 'scale-110 z-50' : ''}
      `}
      aria-label={`${city.name}: ${aggregateScore} poäng`}
    >
      {/* Main Marker */}
      <div 
        className={`
          relative flex items-center gap-1 px-2 py-1.5 rounded-xl shadow-lg
          ${isSelected ? 'ring-2 ring-offset-2' : ''}
          bg-white border border-slate-200
        `}
        style={{ 
          borderColor: isSelected ? scoreColor : undefined,
          boxShadow: isSelected ? `0 0 0 3px ${scoreColor}40` : undefined,
        }}
      >
        {/* Aggregate Score */}
        <div 
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
          style={{ backgroundColor: scoreColor }}
        >
          {aggregateScore}
        </div>
        
        {/* Indicator Icons (when few selected) */}
        {showDetails && selectedIndicators.length > 0 && (
          <div className="flex gap-0.5">
            {selectedIndicators.slice(0, 4).map(id => {
              const indicator = CITY_INDICATORS.find(i => i.id === id);
              const value = city.indicators[id];
              if (!indicator || value === undefined) return null;
              
              return (
                <div
                  key={id}
                  className="w-6 h-6 rounded-md flex items-center justify-center text-xs"
                  style={{ backgroundColor: `${indicator.color}20` }}
                  title={`${indicator.name}: ${Math.round(value)}`}
                >
                  {indicator.icon}
                </div>
              );
            })}
          </div>
        )}
        
        {/* Many indicators indicator */}
        {selectedIndicators.length > 4 && (
          <span className="text-xs text-slate-500 px-1">
            +{selectedIndicators.length - 4}
          </span>
        )}
      </div>
      
      {/* City Name */}
      <div className="mt-1 px-2 py-0.5 bg-white/95 rounded-full shadow text-xs font-medium text-slate-700 border border-slate-100">
        {city.name}
      </div>
      
      {/* Hover Details */}
      <div className={`
        absolute bottom-full left-1/2 -translate-x-1/2 mb-2 
        bg-white rounded-xl shadow-xl border border-slate-200 p-3 min-w-48
        opacity-0 group-hover:opacity-100 pointer-events-none
        transition-opacity duration-200 z-50
      `}>
        <p className="font-semibold text-slate-900 mb-2">{city.name}</p>
        <p className="text-xs text-slate-500 mb-3">{city.population.toLocaleString('sv-SE')} invånare</p>
        
        {selectedIndicators.length > 0 ? (
          <div className="space-y-1.5">
            {selectedIndicators.slice(0, 6).map(id => {
              const indicator = CITY_INDICATORS.find(i => i.id === id);
              const value = city.indicators[id];
              if (!indicator || value === undefined) return null;
              
              return (
                <div key={id} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5">
                    <span>{indicator.icon}</span>
                    <span className="text-slate-600">{indicator.name}</span>
                  </span>
                  <span className="font-medium text-slate-900">
                    {typeof value === 'number' && value < 1 ? value.toFixed(2) : Math.round(value)}
                  </span>
                </div>
              );
            })}
            {selectedIndicators.length > 6 && (
              <p className="text-xs text-slate-400 text-center pt-1">
                +{selectedIndicators.length - 6} fler...
              </p>
            )}
          </div>
        ) : (
          <p className="text-xs text-slate-400 text-center">
            Välj indikatorer för att se data
          </p>
        )}
      </div>
    </button>
  );
}

export function CityMarkers({
  selectedIndicators,
  onSelectCity,
  selectedCity,
}: CityMarkersProps) {
  // This component will be used by MapContainer to render markers
  // For now, return data that can be used
  return null;
}

export { CITY_INDICATORS };
export default CityMarkers;
