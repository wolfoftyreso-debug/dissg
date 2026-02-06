/**
 * Country Info Panel
 * 
 * Clean, slide-in panel showing country data with clear explanations.
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getDiagnosticPanelData, getLambdaColor } from './mockData';
import type { MapLayerId } from './types';
import { ClickableCountryName } from '@/components/ui/ClickableCountryName';

interface CountryInfoPanelProps {
  countryCode: string;
  activeIndex: MapLayerId;
  onClose: () => void;
}

// Helper to format Lambda as percentage-like score
function formatScore(lambda: number): { score: number; label: string; emoji: string } {
  const score = Math.round(lambda * 100);
  if (lambda >= 0.95 && lambda <= 1.05) {
    return { score, label: 'Bra balans', emoji: '🟢' };
  }
  if (lambda >= 0.85) {
    return { score, label: 'Viss avvikelse', emoji: '🟡' };
  }
  return { score, label: 'Behöver uppmärksamhet', emoji: '🔴' };
}

function getTrendInfo(trend: string): { emoji: string; label: string } {
  switch (trend) {
    case 'improving': return { emoji: '📈', label: 'Förbättras' };
    case 'declining': return { emoji: '📉', label: 'Försämras' };
    default: return { emoji: '➡️', label: 'Stabilt' };
  }
}

export function CountryInfoPanel({ countryCode, activeIndex: _activeIndex, onClose }: CountryInfoPanelProps) {
  const data = getDiagnosticPanelData(countryCode);
  
  if (!data) {
    return (
      <aside className="absolute top-0 right-0 h-full w-80 bg-white shadow-2xl z-40 flex items-center justify-center">
        <p className="text-slate-500">Data saknas för detta land</p>
      </aside>
    );
  }

  const { geo, lambda, gediCodes, topCauses } = data;
  const scoreInfo = formatScore(lambda.lambda);
  const trendInfo = getTrendInfo(lambda.trend);
  const color = getLambdaColor(lambda.lambda);

  return (
    <aside 
      className="absolute top-0 right-0 h-full w-96 bg-white shadow-2xl z-40 animate-in slide-in-from-right duration-300"
      role="complementary"
      aria-labelledby="country-panel-title"
    >
      <ScrollArea className="h-full">
        <div className="p-5">
          {/* Header */}
          <header className="flex items-start justify-between mb-6">
            <div>
              <h2 id="country-panel-title" className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <ClickableCountryName
                  countryCode={geo.code}
                  countryName={geo.name.sv}
                  variant="default"
                  className="hover:text-blue-600 transition-colors"
                />
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">
                {geo.population?.toLocaleString('sv-SE')} invånare
              </p>
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

          {/* Main Score Card */}
          <section 
            className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-5 mb-5 border border-slate-200"
            aria-labelledby="score-heading"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 id="score-heading" className="text-sm font-medium text-slate-600">
                Samhällsbalans
              </h3>
              <span className="text-2xl">{scoreInfo.emoji}</span>
            </div>
            
            <div className="flex items-end gap-3 mb-3">
              <span 
                className="text-5xl font-bold"
                style={{ color }}
              >
                {scoreInfo.score}
              </span>
              <span className="text-lg text-slate-400 mb-1.5">/ 100</span>
            </div>

            <p className="text-sm text-slate-600 mb-3">{scoreInfo.label}</p>

            {/* Trend */}
            <div className="flex items-center gap-2 pt-3 border-t border-slate-200">
              <span className="text-lg">{trendInfo.emoji}</span>
              <span className="text-sm text-slate-600">{trendInfo.label} sedan förra året</span>
            </div>
          </section>

          {/* What does this mean? */}
          <section className="mb-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
              <span>💡</span> Vad betyder det här?
            </h3>
            <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-900">
              <p className="mb-2">
                <strong>Poängen {scoreInfo.score}</strong> är ett genomsnitt av hur väl olika 
                delar av samhället fungerar: hälsa, ekonomi, utbildning, miljö med mera.
              </p>
              <p>
                {lambda.lambda >= 0.95 
                  ? 'Ett högt värde betyder att de flesta system fungerar som förväntat.'
                  : lambda.lambda >= 0.85
                    ? 'Ett mellanvärde visar att vissa områden behöver förbättras.'
                    : 'Ett lågt värde betyder att flera viktiga områden har utmaningar.'}
              </p>
            </div>
          </section>

          {/* Issues / GEDI Codes (simplified) */}
          {gediCodes.length > 0 && (
            <section className="mb-5" aria-labelledby="issues-heading">
              <h3 id="issues-heading" className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <span>⚠️</span> Aktuella utmaningar ({gediCodes.length})
              </h3>
              <ul className="space-y-2">
                {gediCodes.slice(0, 3).map(gedi => (
                  <li 
                    key={gedi.code}
                    className="p-3 bg-amber-50 rounded-xl border border-amber-200"
                  >
                    <p className="font-medium text-amber-900 text-sm">{gedi.name}</p>
                    <p className="text-xs text-amber-700 mt-1">{gedi.description}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Main causes */}
          {topCauses.length > 0 && (
            <section className="mb-5" aria-labelledby="causes-heading">
              <h3 id="causes-heading" className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <span>🔍</span> Varför ser det ut så här?
              </h3>
              <ul className="space-y-2">
                {topCauses.slice(0, 3).map(cause => (
                  <li 
                    key={cause.id}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-slate-900 text-sm">{cause.label.sv}</p>
                      <span className="text-xs text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">
                        {cause.probability}% sannolikhet
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                      <div 
                        className="bg-slate-500 h-1.5 rounded-full transition-all"
                        style={{ width: `${cause.probability}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Data quality notice */}
          <section className="bg-slate-100 rounded-xl p-4 text-xs text-slate-600">
            <p className="font-medium text-slate-700 mb-1">📊 Om datan</p>
            <ul className="space-y-1">
              <li>• Datakvalitet: {lambda.confidence}% tillförlitlig</li>
              <li>• Senast uppdaterad: 2024</li>
              <li>• Källor: Officiella statistikbyråer, WHO, FN</li>
            </ul>
          </section>

          {/* Disclaimer */}
          <footer className="mt-5 pt-4 border-t border-slate-200 text-[10px] text-slate-400">
            <p>
              ⚠️ Siffror visar mönster, inte sanningar. 
              Höga eller låga värden är inte "bra" eller "dåligt" – 
              det beror på sammanhanget.
            </p>
          </footer>
        </div>
      </ScrollArea>
    </aside>
  );
}

export default CountryInfoPanel;
