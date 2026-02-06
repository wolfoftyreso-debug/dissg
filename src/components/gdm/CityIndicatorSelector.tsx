/**
 * City Indicator Selector
 * 
 * Allows selecting which indicators to show on city-level markers.
 * Beautiful icons for each indicator category.
 * Supports hierarchical drill-down (e.g., Crime → Murder, Rape, Robbery).
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronRight, ChevronDown } from 'lucide-react';

export interface SubIndicator {
  id: string;
  name: string;
  description: string;
  icon: string;
  /** Whether higher raw values are better (true) or worse (false) */
  higherIsBetter?: boolean;
}

export interface CityIndicator {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: 'health' | 'economy' | 'environment' | 'social' | 'infrastructure' | 'safety' | 'demographics' | 'culture';
  subIndicators?: SubIndicator[];
  /** Whether higher raw values are better (true) or worse (false) - affects benchmark calculation */
  higherIsBetter?: boolean;
  /** Unit of measurement for display */
  unit?: string;
}

export const CITY_INDICATORS: CityIndicator[] = [
  // ============ HEALTH ============
  { id: 'life_expectancy', name: 'Livslängd', description: 'Förväntad livslängd vid födseln', icon: '❤️', color: '#ef4444', category: 'health' },
  { id: 'healthcare_access', name: 'Vårdtillgång', description: 'Tillgång till primärvård', icon: '🏥', color: '#f97316', category: 'health',
    subIndicators: [
      { id: 'wait_time_primary', name: 'Väntetid primärvård', description: 'Dagar till läkarbesök', icon: '⏱️' },
      { id: 'wait_time_specialist', name: 'Väntetid specialist', description: 'Dagar till specialistvård', icon: '👨‍⚕️' },
      { id: 'hospital_distance', name: 'Avstånd sjukhus', description: 'Km till närmaste sjukhus', icon: '🚑' },
    ]
  },
  { id: 'air_quality', name: 'Luftkvalitet', description: 'PM2.5-nivåer', icon: '🌬️', color: '#06b6d4', category: 'health' },
  { id: 'mental_health', name: 'Psykisk hälsa', description: 'Psykisk ohälsa per 1000 inv', icon: '🧠', color: '#a855f7', category: 'health',
    subIndicators: [
      { id: 'depression_rate', name: 'Depression', description: 'Diagnosticerad depression', icon: '😔' },
      { id: 'anxiety_rate', name: 'Ångest', description: 'Ångestdiagnoser', icon: '😰' },
      { id: 'suicide_rate', name: 'Självmord', description: 'Självmord per 100k inv', icon: '⚠️' },
    ]
  },
  { id: 'child_mortality', name: 'Spädbarnsdödlighet', description: 'Dödsfall per 1000 födda', icon: '👶', color: '#f43f5e', category: 'health' },
  { id: 'obesity_rate', name: 'Fetma', description: 'Andel överviktiga', icon: '⚖️', color: '#f59e0b', category: 'health' },
  { id: 'drug_deaths', name: 'Narkotikadödsfall', description: 'Dödsfall per 100k inv', icon: '💊', color: '#dc2626', category: 'health' },

  // ============ ECONOMY ============
  { id: 'median_income', name: 'Medianinkomst', description: 'Disponibel inkomst per capita', icon: '💰', color: '#22c55e', category: 'economy' },
  { id: 'unemployment', name: 'Arbetslöshet', description: 'Arbetslöshetsnivå 16-64 år', icon: '📊', color: '#eab308', category: 'economy',
    subIndicators: [
      { id: 'youth_unemployment', name: 'Ungdomsarbetslöshet', description: '16-24 år', icon: '👦' },
      { id: 'long_term_unemployment', name: 'Långtidsarbetslöshet', description: '>12 månader', icon: '📉' },
      { id: 'foreign_born_unemployment', name: 'Utrikesfödda', description: 'Arbetslöshet utrikesfödda', icon: '🌍' },
    ]
  },
  { id: 'housing_cost', name: 'Boendekostnad', description: 'Genomsnittlig hyra/m²', icon: '🏠', color: '#8b5cf6', category: 'economy' },
  { id: 'gini', name: 'Ojämlikhet', description: 'Gini-koefficient', icon: '⚖️', color: '#ec4899', category: 'economy' },
  { id: 'gdp_per_capita', name: 'BNP per capita', description: 'Bruttonationalprodukt per person', icon: '📈', color: '#10b981', category: 'economy' },
  { id: 'poverty_rate', name: 'Fattigdom', description: 'Andel under fattigdomsgräns', icon: '🏚️', color: '#f97316', category: 'economy' },
  { id: 'startup_rate', name: 'Nyföretagande', description: 'Nya företag per 1000 inv', icon: '🚀', color: '#3b82f6', category: 'economy' },
  { id: 'tax_burden', name: 'Skattebörda', description: 'Total skatt som andel av inkomst', icon: '🧾', color: '#64748b', category: 'economy' },

  // ============ SAFETY (NEW CATEGORY) ============
  { id: 'crime_rate', name: 'Brottslighet', description: 'Anmälda brott per 1000 inv', icon: '🔒', color: '#6b7280', category: 'safety',
    subIndicators: [
      { id: 'murder', name: 'Mord', description: 'Mord per 100k inv', icon: '⚰️' },
      { id: 'rape', name: 'Våldtäkt', description: 'Våldtäkter per 100k inv', icon: '⚠️' },
      { id: 'robbery', name: 'Rån', description: 'Personrån per 100k inv', icon: '🔫' },
      { id: 'assault', name: 'Misshandel', description: 'Misshandelsfall per 100k inv', icon: '👊' },
      { id: 'theft', name: 'Stöld', description: 'Stölder per 100k inv', icon: '🦹' },
      { id: 'burglary', name: 'Inbrott', description: 'Bostadsinbrott per 100k inv', icon: '🏠' },
      { id: 'car_theft', name: 'Bilstöld', description: 'Bilstölder per 100k inv', icon: '🚗' },
      { id: 'fraud', name: 'Bedrägeri', description: 'Bedrägerier per 100k inv', icon: '🎭' },
      { id: 'drug_crime', name: 'Narkotikabrott', description: 'Narkotikabrott per 100k inv', icon: '💊' },
    ]
  },
  { id: 'gang_activity', name: 'Gängkriminalitet', description: 'Gängrelaterade incidenter', icon: '👥', color: '#dc2626', category: 'safety',
    subIndicators: [
      { id: 'shootings', name: 'Skjutningar', description: 'Skjutningar per år', icon: '💥' },
      { id: 'explosions', name: 'Sprängningar', description: 'Sprängdåd per år', icon: '💣' },
      { id: 'gang_murders', name: 'Gängmord', description: 'Gängrelaterade mord', icon: '⚰️' },
    ]
  },
  { id: 'traffic_safety', name: 'Trafiksäkerhet', description: 'Trafikdöda per 100k inv', icon: '🚗', color: '#f59e0b', category: 'safety' },
  { id: 'fire_incidents', name: 'Bränder', description: 'Bränder per 1000 inv', icon: '🔥', color: '#ef4444', category: 'safety' },
  { id: 'police_trust', name: 'Polisförtroende', description: 'Förtroende för polisen', icon: '👮', color: '#3b82f6', category: 'safety' },

  // ============ ENVIRONMENT ============
  { id: 'co2_emissions', name: 'CO₂-utsläpp', description: 'Ton CO₂ per capita', icon: '🏭', color: '#64748b', category: 'environment' },
  { id: 'green_space', name: 'Grönyta', description: 'M² grönyta per invånare', icon: '🌳', color: '#22c55e', category: 'environment' },
  { id: 'renewable_energy', name: 'Förnybar energi', description: 'Andel förnybar energi', icon: '⚡', color: '#fbbf24', category: 'environment' },
  { id: 'recycling', name: 'Återvinning', description: 'Andel återvunnet avfall', icon: '♻️', color: '#10b981', category: 'environment' },
  { id: 'water_quality', name: 'Vattenkvalitet', description: 'Dricksvattenkvalitet', icon: '💧', color: '#0ea5e9', category: 'environment' },
  { id: 'noise_pollution', name: 'Bullernivå', description: 'Genomsnittlig bullernivå dB', icon: '🔊', color: '#f97316', category: 'environment' },
  { id: 'biodiversity', name: 'Biologisk mångfald', description: 'Artrikedomsindex', icon: '🦋', color: '#84cc16', category: 'environment' },

  // ============ SOCIAL ============
  { id: 'education_level', name: 'Utbildningsnivå', description: 'Andel med högskoleutbildning', icon: '🎓', color: '#3b82f6', category: 'social',
    subIndicators: [
      { id: 'preschool_coverage', name: 'Förskoletäckning', description: 'Andel barn i förskola', icon: '👶' },
      { id: 'high_school_graduation', name: 'Gymnasieexamen', description: 'Andel som tar examen', icon: '🎒' },
      { id: 'pisa_score', name: 'PISA-resultat', description: 'Genomsnittligt PISA-poäng', icon: '📝' },
      { id: 'adult_education', name: 'Vuxenutbildning', description: 'Deltagande i vuxenutbildning', icon: '📚' },
    ]
  },
  { id: 'voter_turnout', name: 'Valdeltagande', description: 'Deltagande i senaste valet', icon: '🗳️', color: '#8b5cf6', category: 'social' },
  { id: 'trust_index', name: 'Tillit', description: 'Mellanmänsklig tillit', icon: '🤝', color: '#f472b6', category: 'social' },
  { id: 'social_mobility', name: 'Social rörlighet', description: 'Möjlighet att byta inkomstklass', icon: '📶', color: '#06b6d4', category: 'social' },
  { id: 'gender_equality', name: 'Jämställdhet', description: 'Jämställdhetsindex', icon: '⚧️', color: '#ec4899', category: 'social' },
  { id: 'integration', name: 'Integration', description: 'Integrationsmått för nyanlända', icon: '🌍', color: '#f59e0b', category: 'social' },
  { id: 'loneliness', name: 'Ensamhet', description: 'Andel som känner sig ensamma', icon: '😔', color: '#94a3b8', category: 'social' },

  // ============ DEMOGRAPHICS (NEW) ============
  { id: 'population_density', name: 'Befolkningstäthet', description: 'Invånare per km²', icon: '👥', color: '#6366f1', category: 'demographics' },
  { id: 'median_age', name: 'Medianålder', description: 'Befolkningens medianålder', icon: '📅', color: '#8b5cf6', category: 'demographics' },
  { id: 'dependency_ratio', name: 'Försörjningskvot', description: 'Barn+äldre per 100 arbetsföra', icon: '👴', color: '#f97316', category: 'demographics' },
  { id: 'birth_rate', name: 'Nativitet', description: 'Födda per 1000 inv', icon: '👶', color: '#22c55e', category: 'demographics' },
  { id: 'net_migration', name: 'Nettomigration', description: 'Inflyttning minus utflyttning', icon: '✈️', color: '#0ea5e9', category: 'demographics' },
  { id: 'foreign_born', name: 'Utrikesfödda', description: 'Andel utrikesfödda', icon: '🌐', color: '#a855f7', category: 'demographics' },

  // ============ INFRASTRUCTURE ============
  { id: 'public_transport', name: 'Kollektivtrafik', description: 'Tillgång till kollektivtrafik', icon: '🚇', color: '#0ea5e9', category: 'infrastructure',
    subIndicators: [
      { id: 'bus_coverage', name: 'Busstäckning', description: 'Andel inom 500m från hållplats', icon: '🚌' },
      { id: 'train_access', name: 'Tågtillgång', description: 'Avstånd till tågstation', icon: '🚆' },
      { id: 'bike_lanes', name: 'Cykelbanor', description: 'Km cykelbanor per inv', icon: '🚴' },
    ]
  },
  { id: 'internet_speed', name: 'Bredband', description: 'Genomsnittlig nedladdningshastighet', icon: '📶', color: '#6366f1', category: 'infrastructure' },
  { id: 'hospital_beds', name: 'Sjukhusplatser', description: 'Vårdplatser per 1000 inv', icon: '🛏️', color: '#f43f5e', category: 'infrastructure' },
  { id: 'road_quality', name: 'Vägkvalitet', description: 'Andel vägar i gott skick', icon: '🛣️', color: '#64748b', category: 'infrastructure' },
  { id: 'electricity_reliability', name: 'Elförsörjning', description: 'Avbrottsminuter per år', icon: '⚡', color: '#fbbf24', category: 'infrastructure' },
  { id: 'mobile_coverage', name: 'Mobiltäckning', description: '4G/5G täckning i procent', icon: '📱', color: '#10b981', category: 'infrastructure' },

  // ============ CULTURE (NEW) ============
  { id: 'cultural_spending', name: 'Kulturutgifter', description: 'Kulturbudget per capita', icon: '🎭', color: '#ec4899', category: 'culture' },
  { id: 'library_access', name: 'Bibliotek', description: 'Biblioteksbesök per inv', icon: '📚', color: '#8b5cf6', category: 'culture' },
  { id: 'sports_facilities', name: 'Idrottsanläggningar', description: 'Anläggningar per 10k inv', icon: '⚽', color: '#22c55e', category: 'culture' },
  { id: 'restaurant_density', name: 'Restauranger', description: 'Restauranger per 1000 inv', icon: '🍽️', color: '#f97316', category: 'culture' },
  { id: 'nightlife', name: 'Nöjesliv', description: 'Barer och klubbar per 10k inv', icon: '🎉', color: '#a855f7', category: 'culture' },
];

const CATEGORIES = [
  { id: 'health', name: 'Hälsa', icon: '❤️', color: '#ef4444' },
  { id: 'safety', name: 'Trygghet & Brott', icon: '🔒', color: '#6b7280' },
  { id: 'economy', name: 'Ekonomi', icon: '💰', color: '#22c55e' },
  { id: 'environment', name: 'Miljö', icon: '🌿', color: '#10b981' },
  { id: 'social', name: 'Samhälle', icon: '👥', color: '#8b5cf6' },
  { id: 'demographics', name: 'Demografi', icon: '📊', color: '#6366f1' },
  { id: 'infrastructure', name: 'Infrastruktur', icon: '🏗️', color: '#0ea5e9' },
  { id: 'culture', name: 'Kultur & Fritid', icon: '🎭', color: '#ec4899' },
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
  const [expandedIndicators, setExpandedIndicators] = useState<Set<string>>(new Set());

  const toggleIndicator = (id: string) => {
    if (selectedIndicators.includes(id)) {
      onSelectionChange(selectedIndicators.filter(i => i !== id));
    } else {
      onSelectionChange([...selectedIndicators, id]);
    }
  };

  const toggleExpandIndicator = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newExpanded = new Set(expandedIndicators);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIndicators(newExpanded);
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

  const totalIndicators = CITY_INDICATORS.length;
  const totalSubIndicators = CITY_INDICATORS.reduce((sum, i) => sum + (i.subIndicators?.length || 0), 0);

  return (
    <div className="absolute top-20 left-4 z-30">
      {/* Toggle Button */}
      <Button
        onClick={onToggle}
        className="bg-white text-slate-700 hover:bg-slate-50 shadow-lg border border-slate-200 rounded-2xl px-4 py-2 flex items-center gap-2"
        variant="ghost"
      >
        <span className="text-lg">📍</span>
        <span className="font-medium">Index</span>
        <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
          {selectedIndicators.length}
        </span>
        <span className="text-slate-400">{isOpen ? '▲' : '▼'}</span>
      </Button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 w-96 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-slate-900">Välj index</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={selectAll}
                className="text-xs text-blue-600 hover:text-blue-700"
              >
                {selectedIndicators.length === CITY_INDICATORS.length ? 'Avmarkera alla' : 'Välj alla'}
              </Button>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded-full font-mono">
                📊 100 = Globalt snitt
              </span>
              <span className="text-[10px] text-slate-400">Benchmark-normaliserat</span>
            </div>
            <p className="text-xs text-slate-500">
              {totalIndicators} huvudindex · {totalSubIndicators} subindikatorer · Klicka [›] för detaljer
            </p>
          </div>

          {/* Categories */}
          <ScrollArea className="h-[420px]">
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
                          <p className="text-xs text-slate-500">{indicators.length} index</p>
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
                          {isExpanded ? '▼' : '▶'}
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
                        
                        {indicators.map(indicator => {
                          const hasSubIndicators = indicator.subIndicators && indicator.subIndicators.length > 0;
                          const isIndicatorExpanded = expandedIndicators.has(indicator.id);
                          
                          return (
                            <div key={indicator.id}>
                              <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors group">
                                {/* Expand button for sub-indicators */}
                                {hasSubIndicators && (
                                  <button
                                    onClick={(e) => toggleExpandIndicator(indicator.id, e)}
                                    className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-slate-600 rounded hover:bg-slate-200"
                                  >
                                    {isIndicatorExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                  </button>
                                )}
                                {!hasSubIndicators && <div className="w-5" />}
                                
                                <Checkbox
                                  checked={selectedIndicators.includes(indicator.id)}
                                  onCheckedChange={() => toggleIndicator(indicator.id)}
                                />
                                <span className="text-lg">{indicator.icon}</span>
                                <div className="flex-1 min-w-0" onClick={() => toggleIndicator(indicator.id)}>
                                  <div className="flex items-center gap-2">
                                    <p className="text-sm font-medium text-slate-700 truncate">
                                      {indicator.name}
                                    </p>
                                    {hasSubIndicators && (
                                      <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                                        +{indicator.subIndicators!.length}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-slate-400 truncate group-hover:text-slate-500">
                                    {indicator.description}
                                  </p>
                                </div>
                              </div>
                              
                              {/* Sub-indicators */}
                              {hasSubIndicators && isIndicatorExpanded && (
                                <div className="ml-8 pl-3 border-l border-dashed border-slate-200 space-y-1 py-1">
                                  {indicator.subIndicators!.map(sub => (
                                    <button
                                      key={sub.id}
                                      onClick={() => toggleIndicator(sub.id)}
                                      className={`
                                        w-full flex items-center gap-2 p-2 rounded-lg text-left transition-colors
                                        ${selectedIndicators.includes(sub.id) 
                                          ? 'bg-blue-50 border border-blue-200' 
                                          : 'hover:bg-slate-50'
                                        }
                                      `}
                                    >
                                      <span className="text-sm">{sub.icon}</span>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium text-slate-700">{sub.name}</p>
                                        <p className="text-[10px] text-slate-400">{sub.description}</p>
                                      </div>
                                      {selectedIndicators.includes(sub.id) && (
                                        <span className="text-blue-500 text-xs">✓</span>
                                      )}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
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
              <span>{selectedIndicators.length} valda</span>
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
