/**
 * City Indicator Selector
 * 
 * Allows selecting which indicators to show on city-level markers.
 * Beautiful icons for each indicator category.
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';

export interface CityIndicator {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: 'health' | 'economy' | 'environment' | 'social' | 'infrastructure';
}

export const CITY_INDICATORS: CityIndicator[] = [
  // Health
  { id: 'life_expectancy', name: 'Livslängd', description: 'Förväntad livslängd vid födseln', icon: '❤️', color: '#ef4444', category: 'health' },
  { id: 'healthcare_access', name: 'Vårdtillgång', description: 'Tillgång till primärvård', icon: '🏥', color: '#f97316', category: 'health' },
  { id: 'air_quality', name: 'Luftkvalitet', description: 'PM2.5-nivåer', icon: '🌬️', color: '#06b6d4', category: 'health' },
  
  // Economy
  { id: 'median_income', name: 'Medianinkomst', description: 'Disponibel inkomst per capita', icon: '💰', color: '#22c55e', category: 'economy' },
  { id: 'unemployment', name: 'Arbetslöshet', description: 'Arbetslöshetsnivå 16-64 år', icon: '📊', color: '#eab308', category: 'economy' },
  { id: 'housing_cost', name: 'Boendekostnad', description: 'Genomsnittlig hyra/m²', icon: '🏠', color: '#8b5cf6', category: 'economy' },
  { id: 'gini', name: 'Ojämlikhet', description: 'Gini-koefficient', icon: '⚖️', color: '#ec4899', category: 'economy' },
  
  // Environment
  { id: 'co2_emissions', name: 'CO₂-utsläpp', description: 'Ton CO₂ per capita', icon: '🏭', color: '#64748b', category: 'environment' },
  { id: 'green_space', name: 'Grönyta', description: 'M² grönyta per invånare', icon: '🌳', color: '#22c55e', category: 'environment' },
  { id: 'renewable_energy', name: 'Förnybar energi', description: 'Andel förnybar energi', icon: '⚡', color: '#fbbf24', category: 'environment' },
  { id: 'recycling', name: 'Återvinning', description: 'Andel återvunnet avfall', icon: '♻️', color: '#10b981', category: 'environment' },
  
  // Social
  { id: 'education_level', name: 'Utbildningsnivå', description: 'Andel med högskoleutbildning', icon: '🎓', color: '#3b82f6', category: 'social' },
  { id: 'crime_rate', name: 'Brottslighet', description: 'Anmälda brott per 1000 inv', icon: '🔒', color: '#6b7280', category: 'social' },
  { id: 'voter_turnout', name: 'Valdeltagande', description: 'Deltagande i senaste valet', icon: '🗳️', color: '#8b5cf6', category: 'social' },
  { id: 'trust_index', name: 'Tillit', description: 'Mellanmänsklig tillit', icon: '🤝', color: '#f472b6', category: 'social' },
  
  // Infrastructure
  { id: 'public_transport', name: 'Kollektivtrafik', description: 'Tillgång till kollektivtrafik', icon: '🚇', color: '#0ea5e9', category: 'infrastructure' },
  { id: 'internet_speed', name: 'Bredband', description: 'Genomsnittlig nedladdningshastighet', icon: '📶', color: '#6366f1', category: 'infrastructure' },
  { id: 'hospital_beds', name: 'Sjukhusplatser', description: 'Vårdplatser per 1000 inv', icon: '🛏️', color: '#f43f5e', category: 'infrastructure' },
];

const CATEGORIES = [
  { id: 'health', name: 'Hälsa', icon: '❤️', color: '#ef4444' },
  { id: 'economy', name: 'Ekonomi', icon: '💰', color: '#22c55e' },
  { id: 'environment', name: 'Miljö', icon: '🌿', color: '#10b981' },
  { id: 'social', name: 'Samhälle', icon: '👥', color: '#8b5cf6' },
  { id: 'infrastructure', name: 'Infrastruktur', icon: '🏗️', color: '#0ea5e9' },
];

interface CityIndicatorSelectorProps {
  selectedIndicators: string[];
  onSelectionChange: (indicators: string[]) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function CityIndicatorSelector({
  selectedIndicators,
  onSelectionChange,
  isOpen,
  onToggle,
}: CityIndicatorSelectorProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>('health');

  const toggleIndicator = (id: string) => {
    if (selectedIndicators.includes(id)) {
      onSelectionChange(selectedIndicators.filter(i => i !== id));
    } else {
      onSelectionChange([...selectedIndicators, id]);
    }
  };

  const selectAllInCategory = (category: string) => {
    const categoryIds = CITY_INDICATORS.filter(i => i.category === category).map(i => i.id);
    const allSelected = categoryIds.every(id => selectedIndicators.includes(id));
    
    if (allSelected) {
      onSelectionChange(selectedIndicators.filter(id => !categoryIds.includes(id)));
    } else {
      const newSelection = [...new Set([...selectedIndicators, ...categoryIds])];
      onSelectionChange(newSelection);
    }
  };

  const selectAll = () => {
    if (selectedIndicators.length === CITY_INDICATORS.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(CITY_INDICATORS.map(i => i.id));
    }
  };

  const getIndicatorsByCategory = (category: string) => 
    CITY_INDICATORS.filter(i => i.category === category);

  return (
    <div className="absolute top-20 left-4 z-30">
      {/* Toggle Button */}
      <Button
        onClick={onToggle}
        className="bg-white text-slate-700 hover:bg-slate-50 shadow-lg border border-slate-200 rounded-2xl px-4 py-2 flex items-center gap-2"
        variant="ghost"
      >
        <span className="text-lg">📍</span>
        <span className="font-medium">Städer</span>
        <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
          {selectedIndicators.length}
        </span>
        <span className="text-slate-400">{isOpen ? '▲' : '▼'}</span>
      </Button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 w-80 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-slate-900">Välj indikatorer</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={selectAll}
                className="text-xs text-blue-600 hover:text-blue-700"
              >
                {selectedIndicators.length === CITY_INDICATORS.length ? 'Avmarkera alla' : 'Välj alla'}
              </Button>
            </div>
            <p className="text-xs text-slate-500">
              Välj vilken data som visas för varje stad på kartan
            </p>
          </div>

          {/* Categories */}
          <ScrollArea className="h-80">
            <div className="p-2">
              {CATEGORIES.map(category => {
                const indicators = getIndicatorsByCategory(category.id);
                const selectedCount = indicators.filter(i => selectedIndicators.includes(i.id)).length;
                const isExpanded = expandedCategory === category.id;

                return (
                  <div key={category.id} className="mb-2">
                    {/* Category Header */}
                    <button
                      onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
                      className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span 
                          className="text-2xl w-10 h-10 flex items-center justify-center rounded-xl"
                          style={{ backgroundColor: `${category.color}15` }}
                        >
                          {category.icon}
                        </span>
                        <div className="text-left">
                          <p className="font-medium text-slate-900">{category.name}</p>
                          <p className="text-xs text-slate-500">{indicators.length} indikatorer</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {selectedCount > 0 && (
                          <span 
                            className="text-xs px-2 py-0.5 rounded-full text-white font-medium"
                            style={{ backgroundColor: category.color }}
                          >
                            {selectedCount}
                          </span>
                        )}
                        <span className="text-slate-400 text-sm">
                          {isExpanded ? '▲' : '▼'}
                        </span>
                      </div>
                    </button>

                    {/* Indicators List */}
                    {isExpanded && (
                      <div className="ml-4 pl-4 border-l-2 border-slate-100 space-y-1 py-2">
                        {/* Select all in category */}
                        <button
                          onClick={() => selectAllInCategory(category.id)}
                          className="w-full text-left text-xs text-blue-600 hover:text-blue-700 py-1 px-2 rounded hover:bg-blue-50"
                        >
                          {selectedCount === indicators.length ? '✓ Avmarkera alla' : '○ Välj alla i kategorin'}
                        </button>
                        
                        {indicators.map(indicator => (
                          <label
                            key={indicator.id}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors group"
                          >
                            <Checkbox
                              checked={selectedIndicators.includes(indicator.id)}
                              onCheckedChange={() => toggleIndicator(indicator.id)}
                            />
                            <span className="text-lg">{indicator.icon}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-700 truncate">
                                {indicator.name}
                              </p>
                              <p className="text-xs text-slate-400 truncate group-hover:text-slate-500">
                                {indicator.description}
                              </p>
                            </div>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="p-3 border-t border-slate-100 bg-slate-50">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>{selectedIndicators.length} av {CITY_INDICATORS.length} valda</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                className="text-slate-600 text-xs"
              >
                Stäng
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CityIndicatorSelector;
