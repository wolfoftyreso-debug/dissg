/**
 * City Info Panel
 * 
 * Slide-in panel showing detailed city data with all selected indicators.
 * Every element is clickable for deeper transparency.
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { MOCK_CITIES, CITY_INDICATORS, type CityData } from './CityMarkers';
import { SourceAttribution } from '@/components/transparency/SourceAttribution';

interface CityInfoPanelProps {
  cityId: string;
  selectedIndicators: string[];
  onClose: () => void;
}

type DialogType = 'indicator' | 'source' | 'compare' | null;

interface DialogState {
  type: DialogType;
  data?: any;
}

function getScoreColor(score: number): string {
  if (score >= 80) return '#22c55e';
  if (score >= 60) return '#84cc16';
  if (score >= 40) return '#eab308';
  if (score >= 20) return '#f97316';
  return '#ef4444';
}

function getScoreLabel(score: number): string {
  if (score >= 80) return 'Utmärkt';
  if (score >= 60) return 'Bra';
  if (score >= 40) return 'Medel';
  if (score >= 20) return 'Under medel';
  return 'Behöver uppmärksamhet';
}

function normalizeValue(value: number, indicatorId: string): number {
  switch (indicatorId) {
    case 'life_expectancy': return ((value - 70) / 20) * 100;
    case 'unemployment': return 100 - (value * 5);
    case 'crime_rate': return 100 - (value * 3);
    case 'co2_emissions': return 100 - (value * 15);
    case 'gini': return 100 - (value * 200);
    case 'housing_cost': return 100 - (value / 3);
    default: return value;
  }
}

export function CityInfoPanel({ cityId, selectedIndicators, onClose }: CityInfoPanelProps) {
  const [dialog, setDialog] = useState<DialogState>({ type: null });
  
  const city = MOCK_CITIES.find(c => c.id === cityId);
  
  if (!city) {
    return (
      <aside className="absolute top-0 right-0 h-full w-80 bg-white shadow-2xl z-40 flex items-center justify-center">
        <p className="text-slate-500">Stad hittades inte</p>
      </aside>
    );
  }

  // Calculate aggregate score
  const aggregateScore = selectedIndicators.length > 0
    ? Math.round(
        selectedIndicators.reduce((sum, id) => {
          const value = city.indicators[id];
          if (value === undefined) return sum;
          return sum + Math.max(0, Math.min(100, normalizeValue(value, id)));
        }, 0) / selectedIndicators.length
      )
    : 50;

  const scoreColor = getScoreColor(aggregateScore);

  const openDialog = (type: DialogType, data?: any) => {
    setDialog({ type, data });
  };

  const closeDialog = () => setDialog({ type: null });

  // Group indicators by category
  const groupedIndicators = selectedIndicators.reduce((groups, id) => {
    const indicator = CITY_INDICATORS.find(i => i.id === id);
    if (!indicator) return groups;
    
    const category = indicator.category;
    if (!groups[category]) groups[category] = [];
    groups[category].push({ ...indicator, value: city.indicators[id] });
    return groups;
  }, {} as Record<string, Array<typeof CITY_INDICATORS[0] & { value: number }>>);

  const categoryNames: Record<string, string> = {
    health: '❤️ Hälsa',
    economy: '💰 Ekonomi',
    environment: '🌿 Miljö',
    social: '👥 Samhälle',
    infrastructure: '🏗️ Infrastruktur',
  };

  return (
    <>
      <aside 
        className="absolute top-0 right-0 h-full w-96 bg-white shadow-2xl z-40 animate-in slide-in-from-right duration-300"
        role="complementary"
        aria-labelledby="city-panel-title"
      >
        <ScrollArea className="h-full">
          <div className="p-5">
            {/* Header */}
            <header className="flex items-start justify-between mb-6">
              <div>
                <h2 id="city-panel-title" className="text-2xl font-bold text-slate-900">
                  📍 {city.name}
                </h2>
                <button
                  onClick={() => openDialog('source', { type: 'population' })}
                  className="text-sm text-slate-500 mt-0.5 hover:text-blue-600 hover:underline transition-colors"
                >
                  {city.population.toLocaleString('sv-SE')} invånare [?]
                </button>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 -mr-2 -mt-2"
                aria-label="Stäng"
              >
                ✕
              </Button>
            </header>

            {/* Aggregate Score Card */}
            <button
              onClick={() => openDialog('source', { type: 'aggregate' })}
              className="w-full text-left mb-5 group"
            >
              <section className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-5 border border-slate-200 group-hover:border-blue-300 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-slate-600">Sammansatt poäng</h3>
                  <span className="text-xs text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    [Visa beräkning]
                  </span>
                </div>
                
                <div className="flex items-end gap-3 mb-2">
                  <span 
                    className="text-5xl font-bold"
                    style={{ color: scoreColor }}
                  >
                    {aggregateScore}
                  </span>
                  <span className="text-lg text-slate-400 mb-1.5">/ 100</span>
                </div>

                <p className="text-sm text-slate-600">{getScoreLabel(aggregateScore)}</p>
                
                <p className="text-[10px] text-slate-400 mt-3 pt-3 border-t border-slate-200">
                  Baserat på {selectedIndicators.length} valda indikatorer
                </p>
              </section>
            </button>

            {/* Indicators by Category */}
            {Object.entries(groupedIndicators).map(([category, indicators]) => (
              <section key={category} className="mb-5">
                <h3 className="text-sm font-semibold text-slate-900 mb-3">
                  {categoryNames[category] || category}
                </h3>
                
                <div className="space-y-2">
                  {indicators.map(indicator => {
                    const normalized = normalizeValue(indicator.value, indicator.id);
                    const score = Math.max(0, Math.min(100, Math.round(normalized)));
                    const color = getScoreColor(score);
                    
                    return (
                      <button
                        key={indicator.id}
                        onClick={() => openDialog('indicator', indicator)}
                        className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-slate-100 transition-all text-left group"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span 
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
                              style={{ backgroundColor: `${indicator.color}20` }}
                            >
                              {indicator.icon}
                            </span>
                            <div>
                              <p className="font-medium text-slate-900 text-sm">{indicator.name}</p>
                              <p className="text-xs text-slate-500">{indicator.description}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg" style={{ color }}>
                              {typeof indicator.value === 'number' && indicator.value < 1 
                                ? indicator.value.toFixed(2) 
                                : Math.round(indicator.value)}
                            </p>
                            <p className="text-[10px] text-slate-400">poäng: {score}</p>
                          </div>
                        </div>
                        
                        {/* Progress bar */}
                        <div className="w-full bg-slate-200 rounded-full h-1.5">
                          <div 
                            className="h-1.5 rounded-full transition-all"
                            style={{ width: `${score}%`, backgroundColor: color }}
                          />
                        </div>
                        
                        <p className="text-[10px] text-blue-500 mt-2 opacity-0 group-hover:opacity-100 transition-opacity text-right">
                          [Klicka för detaljer]
                        </p>
                      </button>
                    );
                  })}
                </div>
              </section>
            ))}

            {/* Compare Button */}
            <button
              onClick={() => openDialog('compare')}
              className="w-full p-4 bg-blue-50 rounded-xl border border-blue-200 hover:bg-blue-100 transition-colors mb-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📊</span>
                  <div className="text-left">
                    <p className="font-medium text-blue-900">Jämför med andra städer</p>
                    <p className="text-xs text-blue-700">Se hur {city.name} ligger till</p>
                  </div>
                </div>
                <span className="text-blue-500">→</span>
              </div>
            </button>

            {/* Data Source */}
            <button
              onClick={() => openDialog('source', { type: 'all' })}
              className="w-full"
            >
              <section className="bg-slate-100 rounded-xl p-4 text-xs text-slate-600 hover:bg-slate-200 transition-colors">
                <p className="font-medium text-slate-700 mb-1 flex justify-between">
                  <span>📊 Om datan</span>
                  <span className="text-blue-500">[Visa källor →]</span>
                </p>
                <ul className="space-y-1">
                  <li>• Datakvalitet: 91% tillförlitlig</li>
                  <li>• Senast uppdaterad: 2024-Q4</li>
                  <li>• Källor: SCB, Eurostat, Kommundata</li>
                </ul>
              </section>
            </button>

            {/* Disclaimer */}
            <footer className="mt-5 pt-4 border-t border-slate-200 text-[10px] text-slate-400">
              <p>
                ⚠️ Kommunal data kan ha längre eftersläpning än nationell data. 
                Jämförelser mellan städer kräver kontextförståelse.
              </p>
            </footer>
          </div>
        </ScrollArea>
      </aside>

      {/* Indicator Detail Dialog */}
      <Dialog open={dialog.type === 'indicator'} onOpenChange={closeDialog}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span>{dialog.data?.icon}</span>
              {dialog.data?.name}
            </DialogTitle>
            <DialogDescription>{dialog.data?.description}</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div className="bg-slate-50 p-4 rounded-xl">
              <h4 className="font-semibold text-slate-900 mb-2">Aktuellt värde</h4>
              <div className="text-3xl font-bold" style={{ color: dialog.data?.color }}>
                {dialog.data?.value}
              </div>
              <p className="text-sm text-slate-600 mt-1">i {city.name}</p>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">Jämförelse</h4>
              {MOCK_CITIES.slice(0, 5).map(c => {
                const value = c.indicators[dialog.data?.id];
                return (
                  <div key={c.id} className="flex justify-between items-center p-2 bg-slate-50 rounded-lg">
                    <span className={c.id === city.id ? 'font-semibold' : ''}>{c.name}</span>
                    <span className="font-medium">{typeof value === 'number' ? Math.round(value) : value}</span>
                  </div>
                );
              })}
            </div>

            <div className="bg-blue-50 p-4 rounded-xl">
              <h4 className="font-semibold text-blue-900 mb-2">📊 Om denna indikator</h4>
              <p className="text-sm text-blue-800">
                Data samlas in {dialog.data?.category === 'health' ? 'årligen' : 'kvartalsvis'} från 
                officiella källor. Värdet normaliseras för jämförbarhet mellan kommuner.
              </p>
            </div>

            <SourceAttribution
              sourceName="SCB, Eurostat"
              sourceUrl="https://www.scb.se"
              license="Open Data"
              lastUpdated={new Date('2024-06-01')}
              variant="full"
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Source Dialog */}
      <Dialog open={dialog.type === 'source'} onOpenChange={closeDialog}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>📊 Datakällor</DialogTitle>
            <DialogDescription>Fullständig transparens om underliggande data</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div className="bg-green-50 p-4 rounded-xl">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold text-green-900">Kvalitetspoäng</h4>
                <span className="text-2xl font-bold text-green-600">91%</span>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">Primära datakällor</h4>
              {[
                { name: 'Statistiska centralbyrån (SCB)', type: 'Nationell', url: 'https://www.scb.se' },
                { name: 'Kolada (Kommun- och landstingsdatabasen)', type: 'Kommunal', url: 'https://www.kolada.se' },
                { name: 'Eurostat', type: 'EU', url: 'https://ec.europa.eu/eurostat' },
              ].map(source => (
                <a
                  key={source.name}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <p className="font-medium text-slate-900">{source.name}</p>
                  <p className="text-xs text-slate-500">{source.type}</p>
                </a>
              ))}
            </div>

            <SourceAttribution
              sourceName="DISSG Datakatalog"
              sourceUrl="https://example.com/data"
              license="CC BY 4.0"
              lastUpdated={new Date()}
              variant="full"
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Compare Dialog */}
      <Dialog open={dialog.type === 'compare'} onOpenChange={closeDialog}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>📊 Jämför städer</DialogTitle>
            <DialogDescription>Se hur {city.name} står sig mot andra städer</DialogDescription>
          </DialogHeader>
          
          <div className="mt-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3">Stad</th>
                    {selectedIndicators.slice(0, 5).map(id => {
                      const ind = CITY_INDICATORS.find(i => i.id === id);
                      return (
                        <th key={id} className="text-center py-2 px-2">
                          <span title={ind?.name}>{ind?.icon}</span>
                        </th>
                      );
                    })}
                    <th className="text-center py-2 px-3 font-semibold">Snitt</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_CITIES.map(c => {
                    const avg = Math.round(
                      selectedIndicators.reduce((sum, id) => {
                        const val = c.indicators[id];
                        return sum + (val !== undefined ? normalizeValue(val, id) : 0);
                      }, 0) / selectedIndicators.length
                    );
                    const isCurrent = c.id === city.id;
                    
                    return (
                      <tr key={c.id} className={`border-b ${isCurrent ? 'bg-blue-50' : ''}`}>
                        <td className={`py-2 px-3 ${isCurrent ? 'font-semibold' : ''}`}>
                          {c.name}
                        </td>
                        {selectedIndicators.slice(0, 5).map(id => {
                          const val = c.indicators[id];
                          return (
                            <td key={id} className="text-center py-2 px-2">
                              {val !== undefined ? (typeof val === 'number' && val < 1 ? val.toFixed(2) : Math.round(val)) : '—'}
                            </td>
                          );
                        })}
                        <td className="text-center py-2 px-3 font-semibold" style={{ color: getScoreColor(avg) }}>
                          {avg}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CityInfoPanel;
