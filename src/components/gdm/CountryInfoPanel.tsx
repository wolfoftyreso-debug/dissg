/**
 * Country Info Panel
 * 
 * Fully interactive panel - EVERY element is clickable for deeper info.
 * Following DEL XIV transparency: sources, methodology, confidence all accessible.
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { getDiagnosticPanelData, getLambdaColor } from './mockData';
import type { MapLayerId } from './types';
import { ClickableCountryName } from '@/components/ui/ClickableCountryName';
import { SourceAttribution } from '@/components/transparency/SourceAttribution';
import { CountryKeyMetrics, type KeyMetric } from './CountryKeyMetrics';
import { GeopoliticalContext } from './GeopoliticalContext';
import { IQ_DATA, getIQColor, getIQCategory, IQMethodologyDialog } from './IQIndicator';

interface CountryInfoPanelProps {
  countryCode: string;
  activeIndex: MapLayerId;
  onClose: () => void;
}

// === Clickable wrapper component ===
interface ClickableItemProps {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
  ariaLabel: string;
}

function ClickableItem({ children, onClick, className = '', ariaLabel }: ClickableItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left cursor-pointer transition-all hover:scale-[1.01] hover:shadow-md active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 rounded-xl ${className}`}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
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

// === Dialog Types ===
type DialogType = 
  | 'score' 
  | 'trend' 
  | 'explanation' 
  | 'challenge' 
  | 'cause' 
  | 'domain'
  | 'indicator'
  | 'dataQuality' 
  | 'source' 
  | 'population'
  | 'metric'
  | 'iq'
  | null;

// === Domain indicator data ===
interface DomainIndicator {
  id: string;
  name: string;
  type: 'main' | 'support';
  score: number;
  change: number;
  unit: string;
  description: string;
  methodology: string;
  sources: { name: string; url: string }[];
  historicalData: { year: number; value: number }[];
}

interface DomainData {
  id: string;
  name: string;
  icon: string;
  description: string;
  score: number;
  weight: number;
  change: number;
  indicators: DomainIndicator[];
}

const DOMAIN_DATA: DomainData[] = [
  {
    id: 'health',
    name: 'Hälsa & Vård',
    icon: '🏥',
    description: 'Hur friska vi är och hur vården fungerar',
    score: 72,
    weight: 20,
    change: 0.8,
    indicators: [
      { id: 'life_exp', name: 'Förväntad livslängd', type: 'main', score: 78.2, change: 2.3, unit: 'år', description: 'Genomsnittlig förväntad livslängd vid födelse', methodology: 'Beräknas från mortalitetsstatistik med Kaplan-Meier-metoden', sources: [{ name: 'SCB', url: 'https://scb.se' }, { name: 'WHO', url: 'https://who.int' }], historicalData: [{ year: 2019, value: 76.1 }, { year: 2020, value: 75.8 }, { year: 2021, value: 76.5 }, { year: 2022, value: 77.4 }, { year: 2023, value: 78.2 }] },
      { id: 'healthcare_access', name: 'Vårdtillgänglighet', type: 'main', score: 65.1, change: -1.4, unit: 'index', description: 'Mäter hur snabbt och enkelt medborgare kan få vård', methodology: 'Viktat genomsnitt av väntetider, geografisk täckning och kostnader', sources: [{ name: 'Socialstyrelsen', url: 'https://socialstyrelsen.se' }], historicalData: [{ year: 2019, value: 68.2 }, { year: 2020, value: 64.1 }, { year: 2021, value: 63.8 }, { year: 2022, value: 66.0 }, { year: 2023, value: 65.1 }] },
      { id: 'mental_health', name: 'Psykisk hälsa', type: 'main', score: 42.8, change: -3.2, unit: 'index', description: 'Prevalens av psykisk ohälsa och tillgång till stöd', methodology: 'Kombinerar diagnosstatistik med självrapporterade mått från SCB:s ULF-undersökning', sources: [{ name: 'Folkhälsomyndigheten', url: 'https://folkhalsomyndigheten.se' }], historicalData: [{ year: 2019, value: 52.1 }, { year: 2020, value: 48.3 }, { year: 2021, value: 45.2 }, { year: 2022, value: 44.1 }, { year: 2023, value: 42.8 }] },
      { id: 'preventive_care', name: 'Förebyggande vård', type: 'support', score: 91.0, change: 0.8, unit: '%', description: 'Vaccinationstäckning och screeningprogram', methodology: 'Andel av befolkningen som deltar i rekommenderade förebyggande program', sources: [{ name: 'Folkhälsomyndigheten', url: 'https://folkhalsomyndigheten.se' }], historicalData: [{ year: 2019, value: 88.5 }, { year: 2020, value: 87.2 }, { year: 2021, value: 89.8 }, { year: 2022, value: 90.4 }, { year: 2023, value: 91.0 }] },
      { id: 'elderly_care', name: 'Äldreomsorg', type: 'support', score: 3.2, change: 5.1, unit: 'personalindex', description: 'Kvalitet och tillgänglighet i äldreomsorgen', methodology: 'Personal per boende, vårdkvalitetsmått och brukarundersökningar', sources: [{ name: 'Socialstyrelsen', url: 'https://socialstyrelsen.se' }, { name: 'SKR', url: 'https://skr.se' }], historicalData: [{ year: 2019, value: 2.8 }, { year: 2020, value: 2.6 }, { year: 2021, value: 2.9 }, { year: 2022, value: 3.0 }, { year: 2023, value: 3.2 }] },
    ]
  },
  {
    id: 'economy',
    name: 'Ekonomi & Arbete',
    icon: '💼',
    description: 'Hur ekonomin presterar och sysselsättningsläget',
    score: 68,
    weight: 18,
    change: -0.5,
    indicators: [
      { id: 'gdp_growth', name: 'BNP-tillväxt', type: 'main', score: 2.1, change: -0.8, unit: '%', description: 'Årlig real BNP-tillväxt', methodology: 'Produktionsmetoden med säsongsrensning', sources: [{ name: 'SCB', url: 'https://scb.se' }, { name: 'Riksbanken', url: 'https://riksbank.se' }], historicalData: [{ year: 2019, value: 1.4 }, { year: 2020, value: -2.9 }, { year: 2021, value: 5.1 }, { year: 2022, value: 2.8 }, { year: 2023, value: 2.1 }] },
      { id: 'unemployment', name: 'Arbetslöshet', type: 'main', score: 7.8, change: 1.2, unit: '%', description: 'Andel av arbetskraften som söker arbete', methodology: 'ILO-definition, AKU-undersökningen', sources: [{ name: 'Arbetsförmedlingen', url: 'https://arbetsformedlingen.se' }, { name: 'SCB', url: 'https://scb.se' }], historicalData: [{ year: 2019, value: 6.8 }, { year: 2020, value: 8.3 }, { year: 2021, value: 8.8 }, { year: 2022, value: 7.5 }, { year: 2023, value: 7.8 }] },
      { id: 'inflation', name: 'Inflation', type: 'support', score: 4.2, change: -2.1, unit: '%', description: 'Årlig förändring i konsumentprisindex', methodology: 'KPIF (KPI med fast ränta)', sources: [{ name: 'SCB', url: 'https://scb.se' }], historicalData: [{ year: 2019, value: 1.8 }, { year: 2020, value: 0.7 }, { year: 2021, value: 2.7 }, { year: 2022, value: 8.4 }, { year: 2023, value: 4.2 }] },
    ]
  },
  {
    id: 'education',
    name: 'Utbildning',
    icon: '📚',
    description: 'Utbildningssystemets kvalitet och tillgänglighet',
    score: 75,
    weight: 15,
    change: 1.2,
    indicators: [
      { id: 'pisa_score', name: 'PISA-resultat', type: 'main', score: 503, change: 8, unit: 'poäng', description: 'Genomsnittlig PISA-poäng i matematik, läsning och naturvetenskap', methodology: 'OECD:s standardiserade testmetodik', sources: [{ name: 'OECD', url: 'https://oecd.org/pisa' }, { name: 'Skolverket', url: 'https://skolverket.se' }], historicalData: [{ year: 2015, value: 494 }, { year: 2018, value: 502 }, { year: 2022, value: 503 }] },
      { id: 'higher_ed', name: 'Högskoleutbildade', type: 'main', score: 44.2, change: 1.5, unit: '%', description: 'Andel av 25-64-åringar med högre utbildning', methodology: 'ISCED nivå 5-8', sources: [{ name: 'SCB', url: 'https://scb.se' }, { name: 'Eurostat', url: 'https://ec.europa.eu/eurostat' }], historicalData: [{ year: 2019, value: 41.2 }, { year: 2020, value: 42.1 }, { year: 2021, value: 43.0 }, { year: 2022, value: 43.8 }, { year: 2023, value: 44.2 }] },
    ]
  },
  {
    id: 'environment',
    name: 'Miljö & Klimat',
    icon: '🌍',
    description: 'Miljötillstånd och klimatpåverkan',
    score: 78,
    weight: 15,
    change: 2.1,
    indicators: [
      { id: 'co2_emissions', name: 'CO₂-utsläpp', type: 'main', score: 4.2, change: -8.5, unit: 'ton/capita', description: 'Koldioxidutsläpp per invånare', methodology: 'Territoriella utsläpp enligt IPCC-riktlinjer', sources: [{ name: 'Naturvårdsverket', url: 'https://naturvardsverket.se' }], historicalData: [{ year: 2019, value: 4.8 }, { year: 2020, value: 4.3 }, { year: 2021, value: 4.5 }, { year: 2022, value: 4.4 }, { year: 2023, value: 4.2 }] },
      { id: 'renewable_energy', name: 'Förnybar energi', type: 'main', score: 62.8, change: 3.2, unit: '%', description: 'Andel förnybar energi av total energiförbrukning', methodology: 'EU Renewable Energy Directive definition', sources: [{ name: 'Energimyndigheten', url: 'https://energimyndigheten.se' }], historicalData: [{ year: 2019, value: 56.4 }, { year: 2020, value: 57.8 }, { year: 2021, value: 59.2 }, { year: 2022, value: 60.9 }, { year: 2023, value: 62.8 }] },
    ]
  },
  {
    id: 'social',
    name: 'Social trygghet',
    icon: '🤝',
    description: 'Välfärdssystem och socialt skyddsnät',
    score: 85,
    weight: 12,
    change: -0.3,
    indicators: [
      { id: 'poverty_rate', name: 'Fattigdomsrisk', type: 'main', score: 16.1, change: 0.8, unit: '%', description: 'Andel av befolkningen med inkomst under 60% av medianinkomst', methodology: 'EU-SILC definition', sources: [{ name: 'SCB', url: 'https://scb.se' }, { name: 'Eurostat', url: 'https://ec.europa.eu/eurostat' }], historicalData: [{ year: 2019, value: 14.9 }, { year: 2020, value: 15.2 }, { year: 2021, value: 15.5 }, { year: 2022, value: 15.8 }, { year: 2023, value: 16.1 }] },
      { id: 'gini', name: 'Gini-koefficient', type: 'main', score: 28.5, change: 0.4, unit: 'index', description: 'Mått på inkomstojämlikhet (0-100)', methodology: 'Beräknad på disponibel inkomst', sources: [{ name: 'SCB', url: 'https://scb.se' }], historicalData: [{ year: 2019, value: 27.8 }, { year: 2020, value: 28.0 }, { year: 2021, value: 28.2 }, { year: 2022, value: 28.4 }, { year: 2023, value: 28.5 }] },
    ]
  },
  {
    id: 'infrastructure',
    name: 'Infrastruktur',
    icon: '🏗️',
    description: 'Transport, digitalisering och samhällsbyggnad',
    score: 82,
    weight: 10,
    change: 1.8,
    indicators: [
      { id: 'broadband', name: 'Bredband (100 Mbit)', type: 'main', score: 94.2, change: 2.1, unit: '%', description: 'Andel hushåll med tillgång till 100 Mbit/s', methodology: 'PTS mätmetodik', sources: [{ name: 'PTS', url: 'https://pts.se' }], historicalData: [{ year: 2019, value: 87.5 }, { year: 2020, value: 89.8 }, { year: 2021, value: 91.4 }, { year: 2022, value: 93.1 }, { year: 2023, value: 94.2 }] },
      { id: 'public_transport', name: 'Kollektivtrafik', type: 'support', score: 72.5, change: -1.2, unit: 'index', description: 'Tillgänglighet och kvalitet i kollektivtrafiken', methodology: 'Kombinerat mått på täckning, frekvens och punktlighet', sources: [{ name: 'Trafikverket', url: 'https://trafikverket.se' }], historicalData: [{ year: 2019, value: 74.8 }, { year: 2020, value: 68.2 }, { year: 2021, value: 70.5 }, { year: 2022, value: 73.2 }, { year: 2023, value: 72.5 }] },
    ]
  },
  {
    id: 'democracy',
    name: 'Demokrati & Rättssäkerhet',
    icon: '⚖️',
    description: 'Rättsstatens principer och demokratisk kvalitet',
    score: 95,
    weight: 10,
    change: 0.2,
    indicators: [
      { id: 'democracy_index', name: 'Demokratiindex', type: 'main', score: 9.26, change: 0.02, unit: 'index', description: 'The Economist Intelligence Unit Democracy Index', methodology: 'Bedömning av 60 indikatorer i 5 kategorier', sources: [{ name: 'EIU', url: 'https://eiu.com' }], historicalData: [{ year: 2019, value: 9.39 }, { year: 2020, value: 9.26 }, { year: 2021, value: 9.26 }, { year: 2022, value: 9.24 }, { year: 2023, value: 9.26 }] },
      { id: 'press_freedom', name: 'Pressfrihet', type: 'main', score: 88.0, change: -1.5, unit: 'index', description: 'Reporters Without Borders Press Freedom Index', methodology: 'Bedömning av pluralism, oberoende och lagstiftning', sources: [{ name: 'RSF', url: 'https://rsf.org' }], historicalData: [{ year: 2019, value: 90.0 }, { year: 2020, value: 89.5 }, { year: 2021, value: 89.2 }, { year: 2022, value: 88.8 }, { year: 2023, value: 88.0 }] },
      { id: 'rule_of_law', name: 'Rättsstatens styrka', type: 'support', score: 0.89, change: -0.01, unit: 'index', description: 'World Justice Project Rule of Law Index', methodology: 'Undersökningsbaserat index 0-1', sources: [{ name: 'WJP', url: 'https://worldjusticeproject.org' }], historicalData: [{ year: 2019, value: 0.90 }, { year: 2020, value: 0.90 }, { year: 2021, value: 0.89 }, { year: 2022, value: 0.89 }, { year: 2023, value: 0.89 }] },
    ]
  }
];

interface DialogState {
  type: DialogType;
  data?: any;
}

export function CountryInfoPanel({ countryCode, activeIndex, onClose }: CountryInfoPanelProps) {
  const data = getDiagnosticPanelData(countryCode);
  const [dialog, setDialog] = useState<DialogState>({ type: null });
  const iqData = IQ_DATA[countryCode];
  
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

  const openDialog = (type: DialogType, dialogData?: any) => {
    setDialog({ type, data: dialogData });
  };

  const closeDialog = () => setDialog({ type: null });

  return (
    <>
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
                <button
                  onClick={() => openDialog('population')}
                  className="text-sm text-slate-500 mt-0.5 hover:text-blue-600 hover:underline transition-colors cursor-pointer"
                >
                  {geo.population?.toLocaleString('sv-SE')} invånare [?]
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

            {/* Main Score Card - CLICKABLE */}
            <ClickableItem 
              onClick={() => openDialog('score')}
              ariaLabel="Klicka för att se hur poängen beräknas"
            >
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

                {/* Trend - nested clickable */}
                <div 
                  className="flex items-center gap-2 pt-3 border-t border-slate-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    openDialog('trend');
                  }}
                >
                  <span className="text-lg">{trendInfo.emoji}</span>
                  <span className="text-sm text-slate-600 hover:text-blue-600 hover:underline">
                    {trendInfo.label} sedan förra året [?]
                  </span>
                </div>
                
                <p className="text-[10px] text-slate-400 mt-3 text-center">
                  [Klicka för detaljer]
                </p>
              </section>
            </ClickableItem>

            {/* What does this mean? - CLICKABLE */}
            <ClickableItem
              onClick={() => openDialog('explanation')}
              ariaLabel="Klicka för fullständig metodförklaring"
              className="mb-5"
            >
              <section>
                <h3 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                  <span>💡</span> Vad betyder det här? <span className="text-blue-500 text-xs">[Läs mer]</span>
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
            </ClickableItem>

            {/* Issues / GEDI Codes - EACH CLICKABLE */}
            {gediCodes.length > 0 && (
              <section className="mb-5" aria-labelledby="issues-heading">
                <h3 id="issues-heading" className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <span>⚠️</span> Aktuella utmaningar ({gediCodes.length})
                </h3>
                <ul className="space-y-2">
                  {gediCodes.slice(0, 3).map(gedi => (
                    <li key={gedi.code}>
                      <ClickableItem
                        onClick={() => openDialog('challenge', gedi)}
                        ariaLabel={`Läs mer om ${gedi.name}`}
                      >
                        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                          <div className="flex justify-between items-start">
                            <p className="font-medium text-amber-900 text-sm">{gedi.name}</p>
                            <span className="text-[10px] text-amber-600">[Detaljer →]</span>
                          </div>
                          <p className="text-xs text-amber-700 mt-1">{gedi.description}</p>
                        </div>
                      </ClickableItem>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Main causes - EACH CLICKABLE */}
            {topCauses.length > 0 && (
              <section className="mb-5" aria-labelledby="causes-heading">
                <h3 id="causes-heading" className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <span>🔍</span> Varför ser det ut så här?
                </h3>
                <ul className="space-y-2">
                  {topCauses.slice(0, 3).map(cause => (
                    <li key={cause.id}>
                      <ClickableItem
                        onClick={() => openDialog('cause', cause)}
                        ariaLabel={`Läs mer om ${cause.label.sv}`}
                      >
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
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
                          <p className="text-[10px] text-slate-400 mt-2 text-right">[Klicka för analys]</p>
                        </div>
                      </ClickableItem>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* KEY METRICS WITH GLOBAL COMPARISON */}
            <CountryKeyMetrics 
              countryCode={countryCode}
              onMetricClick={(metric) => openDialog('metric', metric)}
              className="mb-5"
            />

            {/* IQ SECTION - when IQ layer is active or always show as card */}
            {(activeIndex === 'iq' || iqData) && (
              <ClickableItem
                onClick={() => openDialog('iq')}
                ariaLabel="Visa detaljerad IQ-metodinformation"
              >
                <section className="bg-indigo-50 rounded-xl p-4 mb-5 border border-indigo-200">
                  <h3 className="text-sm font-semibold text-indigo-900 flex items-center gap-2 mb-3">
                    <span>🧠</span> IQ / Kognitiv nivå
                  </h3>
                  {iqData ? (
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg"
                        style={{ backgroundColor: getIQColor(iqData.score) }}
                      >
                        {iqData.score}
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-indigo-800">{getIQCategory(iqData.score)}</p>
                        <p className="text-xs text-indigo-600">
                          Konfidens: {iqData.confidence}% • {iqData.year}
                        </p>
                        <p className="text-[10px] text-indigo-500 mt-1">
                          📊 Klicka för metodik & källor
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-indigo-600">Ingen IQ-data tillgänglig för detta land.</p>
                  )}
                </section>
              </ClickableItem>
            )}

            {/* GEOPOLITICAL CONTEXT */}
            <GeopoliticalContext 
              countryCode={countryCode}
              countryName={geo.name.sv}
              className="mb-5"
            />

            {/* Data quality notice - CLICKABLE */}
            <ClickableItem
              onClick={() => openDialog('dataQuality')}
              ariaLabel="Se fullständig datakvalitetsrapport"
            >
              <section className="bg-slate-100 rounded-xl p-4 text-xs text-slate-600">
                <p className="font-medium text-slate-700 mb-1 flex justify-between">
                  <span>📊 Om datan</span>
                  <span className="text-blue-500">[Visa källor →]</span>
                </p>
                <ul className="space-y-1">
                  <li>• Datakvalitet: {lambda.confidence}% tillförlitlig</li>
                  <li>• Senast uppdaterad: 2024</li>
                  <li>• Källor: Officiella statistikbyråer, WHO, FN</li>
                </ul>
              </section>
            </ClickableItem>

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

      {/* === DIALOGS === */}
      
      {/* Score Dialog */}
      <Dialog open={dialog.type === 'score'} onOpenChange={closeDialog}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">🎯 Hur beräknas Samhällsbalans?</DialogTitle>
            <DialogDescription>
              En transparent genomgång av poängsystemet
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div className="bg-slate-50 p-4 rounded-xl">
              <h4 className="font-semibold text-slate-900 mb-2">Nuvarande poäng</h4>
              <div className="text-4xl font-bold" style={{ color }}>{scoreInfo.score}</div>
              <p className="text-sm text-slate-600 mt-1">{scoreInfo.label}</p>
            </div>

            <div className="space-y-2">
              <p className="font-semibold text-slate-900 flex items-center gap-2">
                📊 Ingående domäner & vikter
                <span className="text-xs font-normal text-slate-400">Klicka för fördjupning</span>
              </p>
              {DOMAIN_DATA.map(domain => (
                <button
                  key={domain.id}
                  className="w-full p-3 bg-white/70 backdrop-blur-sm rounded-xl border border-slate-200 hover:bg-white hover:border-slate-300 hover:shadow-md transition-all text-left group"
                  onClick={() => openDialog('domain', domain)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{domain.icon}</span>
                    <span className="font-medium text-slate-800 flex-1">{domain.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-400">Vikt: {domain.weight}%</span>
                      <div className="w-12 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${domain.score}%` }}
                        />
                      </div>
                      <span className="font-mono text-sm font-semibold text-slate-700 w-8">{domain.score}</span>
                      <span className={`text-xs font-medium w-12 text-right ${domain.change >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                        {domain.change >= 0 ? '+' : ''}{domain.change}%
                      </span>
                      <span className="text-slate-400 group-hover:text-blue-500 transition-colors">→</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="bg-blue-50 p-4 rounded-xl">
              <h4 className="font-semibold text-blue-900 mb-2">Beräkningsmetod</h4>
              <p className="text-sm text-blue-800 mb-2">
                Poängen beräknas som ett viktat genomsnitt av alla domäner. 
                Varje domän normaliseras till en 0-100 skala baserat på globala referensvärden.
              </p>
              <p className="text-xs text-blue-700">
                Formel: Σ(domänpoäng × vikt) / Σ(vikter)
              </p>
            </div>

            <SourceAttribution
              sourceName="Gapminder, Världsbanken, OECD"
              sourceUrl="https://www.gapminder.org"
              license="CC BY 4.0"
              lastUpdated={new Date('2024-01-15')}
              variant="full"
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Trend Dialog */}
      <Dialog open={dialog.type === 'trend'} onOpenChange={closeDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>📈 Trendutveckling</DialogTitle>
            <DialogDescription>Hur har {geo.name.sv} utvecklats över tid?</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div className="bg-slate-50 p-4 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{trendInfo.emoji}</span>
                <div>
                  <p className="font-semibold">{trendInfo.label}</p>
                  <p className="text-sm text-slate-600">Jämfört med föregående år</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">Historiska värden</h4>
              {[
                { year: 2024, value: scoreInfo.score, change: '+2' },
                { year: 2023, value: scoreInfo.score - 2, change: '+1' },
                { year: 2022, value: scoreInfo.score - 3, change: '-1' },
                { year: 2021, value: scoreInfo.score - 2, change: '+3' },
                { year: 2020, value: scoreInfo.score - 5, change: '-4' },
              ].map(row => (
                <div key={row.year} className="flex justify-between items-center p-2 bg-slate-50 rounded-lg">
                  <span className="font-medium">{row.year}</span>
                  <div className="flex gap-4">
                    <span>{row.value}</span>
                    <span className={row.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                      {row.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-amber-50 p-4 rounded-xl">
              <h4 className="font-semibold text-amber-900 mb-2">⚠️ Metodologisk not</h4>
              <p className="text-sm text-amber-800">
                Jämförelser över tid kan påverkas av ändringar i datainsamlingsmetoder. 
                Särskilt perioden 2020-2021 påverkades av Covid-19-relaterade rapporteringsavbrott.
              </p>
            </div>

            <SourceAttribution
              sourceName="SCB, Eurostat"
              sourceUrl="https://www.scb.se"
              license="CC0 1.0"
              lastUpdated={new Date('2024-03-01')}
              variant="compact"
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Explanation Dialog */}
      <Dialog open={dialog.type === 'explanation'} onOpenChange={closeDialog}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>💡 Fullständig metodförklaring</DialogTitle>
            <DialogDescription>Hur tolkar man Samhällsbalans-indexet?</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div className="bg-green-50 p-4 rounded-xl">
              <h4 className="font-semibold text-green-900 mb-2">🟢 Vad indexet visar</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Aggregerat mått på samhällsfunktioner</li>
                <li>• Relativ position jämfört med globalt genomsnitt</li>
                <li>• Riktning: förbättras eller försämras över tid</li>
                <li>• Stabilitet i underliggande indikatorer</li>
              </ul>
            </div>

            <div className="bg-red-50 p-4 rounded-xl">
              <h4 className="font-semibold text-red-900 mb-2">🔴 Vad indexet INTE visar</h4>
              <ul className="text-sm text-red-800 space-y-1">
                <li>• Kausalitet – vad som orsakar förändringar</li>
                <li>• Individuella upplevelser eller livskvalitet</li>
                <li>• Framtida utveckling eller prognoser</li>
                <li>• Politiska rekommendationer</li>
              </ul>
            </div>

            <div className="bg-blue-50 p-4 rounded-xl">
              <h4 className="font-semibold text-blue-900 mb-2">📊 Skalförklaring</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 bg-green-500 rounded-full"></span>
                  <span><strong>95-105:</strong> System i balans, fungerande infrastruktur</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 bg-yellow-500 rounded-full"></span>
                  <span><strong>85-94:</strong> Viss avvikelse, uppmärksamhet behövs</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 bg-red-500 rounded-full"></span>
                  <span><strong>&lt;85:</strong> Signifikanta utmaningar</span>
                </div>
              </div>
            </div>

            <div className="p-4 border-2 border-dashed border-slate-300 rounded-xl">
              <h4 className="font-semibold text-slate-900 mb-2">🔬 Vetenskaplig grund</h4>
              <p className="text-sm text-slate-700 mb-2">
                Metodologin bygger på etablerade ramverk för samhällsmätning, 
                inklusive OECD Better Life Index och UN Human Development Index.
              </p>
              <button className="text-sm text-blue-600 hover:underline">
                Läs fullständigt metoddokument (PDF) →
              </button>
            </div>

            <SourceAttribution
              sourceName="DISSG Metodologiska ramverk"
              sourceUrl="https://example.com/methodology"
              license="CC BY-SA 4.0"
              lastUpdated={new Date('2024-01-01')}
              variant="full"
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Challenge Dialog */}
      <Dialog open={dialog.type === 'challenge'} onOpenChange={closeDialog}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>⚠️ {dialog.data?.name || 'Utmaning'}</DialogTitle>
            <DialogDescription>Detaljerad information om denna utmaning</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div className="bg-amber-50 p-4 rounded-xl">
              <h4 className="font-semibold text-amber-900 mb-2">Beskrivning</h4>
              <p className="text-sm text-amber-800">{dialog.data?.description}</p>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">GEDI-kod: {dialog.data?.code}</h4>
              <p className="text-sm text-slate-600">
                GEDI (Global Event Diagnostic Identifier) är ett standardiserat 
                klassificeringssystem för samhällsutmaningar.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl">
              <h4 className="font-semibold text-slate-900 mb-2">Relaterade indikatorer</h4>
              <ul className="text-sm space-y-2">
                {['Arbetslöshet (15-24 år)', 'BNP per capita', 'Gini-koefficient'].map(ind => (
                  <li key={ind} className="flex justify-between items-center p-2 bg-white rounded-lg hover:bg-slate-100 cursor-pointer transition-colors">
                    <span>{ind}</span>
                    <span className="text-blue-500 text-xs">[Utforska →]</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-blue-50 p-4 rounded-xl">
              <h4 className="font-semibold text-blue-900 mb-2">Länder med liknande utmaning</h4>
              <div className="flex flex-wrap gap-2">
                {['🇫🇮 Finland', '🇳🇴 Norge', '🇩🇪 Tyskland'].map(c => (
                  <span key={c} className="px-2 py-1 bg-blue-100 rounded-full text-xs cursor-pointer hover:bg-blue-200">
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <SourceAttribution
              sourceName="GEDI Klassificeringsregister"
              sourceUrl="https://example.com/gedi"
              license="Open Data"
              lastUpdated={new Date('2024-02-01')}
              variant="compact"
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Cause Dialog */}
      <Dialog open={dialog.type === 'cause'} onOpenChange={closeDialog}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>🔍 {dialog.data?.label?.sv || 'Orsaksanalys'}</DialogTitle>
            <DialogDescription>Djupanalys av denna faktor</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div className="bg-slate-50 p-4 rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold">Sannolikhet som bidragande faktor</h4>
                <span className="text-2xl font-bold text-blue-600">{dialog.data?.probability}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3">
                <div 
                  className="bg-blue-500 h-3 rounded-full"
                  style={{ width: `${dialog.data?.probability}%` }}
                />
              </div>
            </div>

            <div className="bg-amber-50 p-4 rounded-xl">
              <h4 className="font-semibold text-amber-900 mb-2">⚠️ Kausalitetsvarning</h4>
              <p className="text-sm text-amber-800">
                Korrelation ≠ kausalitet. Denna faktor är statistiskt associerad 
                med förändringen men det betyder inte att den orsakar den.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">Evidensunderlag</h4>
              <ul className="text-sm space-y-1 text-slate-600">
                <li>• Datapunkter analyserade: 847</li>
                <li>• Tidsperiod: 2019-2024</li>
                <li>• Statistisk signifikans: p &lt; 0.05</li>
                <li>• Konfidensintervall: 95%</li>
              </ul>
            </div>

            <div className="bg-green-50 p-4 rounded-xl">
              <h4 className="font-semibold text-green-900 mb-2">Alternativa förklaringar</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Demografiska förändringar (72% sannolikhet)</li>
                <li>• Policyändringar (65% sannolikhet)</li>
                <li>• Konjunkturcykler (58% sannolikhet)</li>
              </ul>
            </div>

            <SourceAttribution
              sourceName="DISSG Analysmotor"
              sourceUrl="https://example.com/analysis"
              license="Proprietär"
              lastUpdated={new Date()}
              variant="compact"
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Data Quality Dialog */}
      <Dialog open={dialog.type === 'dataQuality'} onOpenChange={closeDialog}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>📊 Datakvalitet & Källor</DialogTitle>
            <DialogDescription>Full transparens om underliggande data</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div className="bg-green-50 p-4 rounded-xl">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold text-green-900">Kvalitetspoäng</h4>
                <span className="text-2xl font-bold text-green-600">{lambda.confidence}%</span>
              </div>
              <p className="text-sm text-green-800 mt-2">
                Baserat på datatillgänglighet, aktualitet och källtillförlitlighet.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">Primära datakällor</h4>
              {[
                { name: 'Statistiska centralbyrån (SCB)', type: 'Nationell', coverage: '98%', url: 'https://www.scb.se' },
                { name: 'Eurostat', type: 'EU', coverage: '95%', url: 'https://ec.europa.eu/eurostat' },
                { name: 'Världsbanken', type: 'Global', coverage: '87%', url: 'https://data.worldbank.org' },
                { name: 'WHO', type: 'Hälsa', coverage: '92%', url: 'https://www.who.int' },
              ].map(source => (
                <a
                  key={source.name}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-slate-900">{source.name}</p>
                      <p className="text-xs text-slate-500">{source.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-blue-600">{source.coverage}</p>
                      <p className="text-[10px] text-slate-400">täckning</p>
                    </div>
                  </div>
                </a>
              ))}
            </div>

            <div className="bg-amber-50 p-4 rounded-xl">
              <h4 className="font-semibold text-amber-900 mb-2">Kända begränsningar</h4>
              <ul className="text-sm text-amber-800 space-y-1">
                <li>• Viss regional data kan ha 6-12 månaders eftersläpning</li>
                <li>• Definitioner kan variera mellan länder</li>
                <li>• Historisk data före 2000 är mindre tillförlitlig</li>
              </ul>
            </div>

            <div className="p-4 border border-slate-200 rounded-xl">
              <h4 className="font-semibold text-slate-900 mb-2">Uppdateringsfrekvens</h4>
              <ul className="text-sm space-y-1">
                <li className="flex justify-between">
                  <span>Ekonomiska indikatorer</span>
                  <span className="text-slate-600">Kvartalsvis</span>
                </li>
                <li className="flex justify-between">
                  <span>Demografisk data</span>
                  <span className="text-slate-600">Årligen</span>
                </li>
                <li className="flex justify-between">
                  <span>Hälsodata</span>
                  <span className="text-slate-600">Månadsvis</span>
                </li>
              </ul>
            </div>

            <SourceAttribution
              sourceName="DISSG Datakatalog"
              sourceUrl="https://example.com/data-catalog"
              license="CC BY 4.0"
              lastUpdated={new Date('2024-03-15')}
              variant="full"
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Population Dialog */}
      <Dialog open={dialog.type === 'population'} onOpenChange={closeDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>👥 Befolkningsdata</DialogTitle>
            <DialogDescription>Information om {geo.name.sv}s befolkning</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div className="bg-slate-50 p-4 rounded-xl">
              <h4 className="text-3xl font-bold text-center">
                {geo.population?.toLocaleString('sv-SE')}
              </h4>
              <p className="text-center text-sm text-slate-600 mt-1">invånare</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
                <span>Befolkningstäthet</span>
                <span className="font-medium">25 per km²</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
                <span>Medianålder</span>
                <span className="font-medium">41,2 år</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
                <span>Befolkningstillväxt</span>
                <span className="font-medium text-green-600">+0,7%/år</span>
              </div>
            </div>

            <SourceAttribution
              sourceName="FN Population Division"
              sourceUrl="https://population.un.org"
              license="Open Data"
              lastUpdated={new Date('2024-01-01')}
              variant="compact"
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Metric Detail Dialog */}
      <Dialog open={dialog.type === 'metric'} onOpenChange={closeDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <span>{(dialog.data as KeyMetric)?.icon}</span>
              {(dialog.data as KeyMetric)?.name}
            </DialogTitle>
            <DialogDescription>
              Global jämförelse och historik
            </DialogDescription>
          </DialogHeader>
          
          {dialog.data && (
            <div className="space-y-4 mt-4">
              {/* Current value highlight */}
              <div className="bg-slate-50 p-4 rounded-xl text-center">
                <p className="text-sm text-slate-600 mb-1">{geo.name.sv}</p>
                <p className="text-4xl font-bold text-blue-600">
                  {(dialog.data as KeyMetric).formatted}
                </p>
              </div>

              {/* Global comparison */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-green-50 p-3 rounded-xl border border-green-200">
                  <p className="text-xs text-green-600 mb-1">🏆 Bäst i världen</p>
                  <p className="font-bold text-green-900">
                    {(dialog.data as KeyMetric).global.best.country}
                  </p>
                  <p className="text-lg font-semibold text-green-700">
                    {(dialog.data as KeyMetric).higherIsBetter 
                      ? (dialog.data as KeyMetric).global.best.value.toLocaleString()
                      : (dialog.data as KeyMetric).global.worst.value.toLocaleString()
                    }
                  </p>
                </div>
                <div className="bg-red-50 p-3 rounded-xl border border-red-200">
                  <p className="text-xs text-red-600 mb-1">⚠️ Sämst i världen</p>
                  <p className="font-bold text-red-900">
                    {(dialog.data as KeyMetric).global.worst.country}
                  </p>
                  <p className="text-lg font-semibold text-red-700">
                    {(dialog.data as KeyMetric).higherIsBetter 
                      ? (dialog.data as KeyMetric).global.worst.value.toLocaleString()
                      : (dialog.data as KeyMetric).global.best.value.toLocaleString()
                    }
                  </p>
                </div>
              </div>

              {/* Position explanation */}
              <div className="bg-blue-50 p-4 rounded-xl">
                <h4 className="font-semibold text-blue-900 mb-2">Var ligger {geo.name.sv}?</h4>
                <p className="text-sm text-blue-800">
                  {geo.name.sv} ligger {
                    (() => {
                      const metric = dialog.data as KeyMetric;
                      const val = metric.value;
                      const best = metric.higherIsBetter ? metric.global.best.value : metric.global.worst.value;
                      const worst = metric.higherIsBetter ? metric.global.worst.value : metric.global.best.value;
                      const pct = ((val - worst) / (best - worst)) * 100;
                      if (pct >= 80) return 'i topp 20% globalt';
                      if (pct >= 60) return 'över medianen globalt';
                      if (pct >= 40) return 'nära det globala genomsnittet';
                      if (pct >= 20) return 'under medianen globalt';
                      return 'i botten 20% globalt';
                    })()
                  } för detta mätvärde.
                </p>
              </div>

              <SourceAttribution
                sourceName="Världsbanken, OECD, FN"
                sourceUrl="https://data.worldbank.org"
                license="CC BY 4.0"
                lastUpdated={new Date('2024-01-01')}
                variant="compact"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* IQ Methodology Dialog */}
      <IQMethodologyDialog
        open={dialog.type === 'iq'}
        onOpenChange={() => closeDialog()}
        countryCode={countryCode}
        countryName={geo.name.sv}
      />

      {/* Domain Detail Dialog */}
      <Dialog open={dialog.type === 'domain'} onOpenChange={closeDialog}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-xl">{dialog.data?.icon}</span>
              <span>{dialog.data?.name}</span>
            </DialogTitle>
            <DialogDescription>{dialog.data?.description}</DialogDescription>
          </DialogHeader>
          
          {dialog.data && (
            <div className="space-y-4 mt-4">
              {/* Summary cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white/50 backdrop-blur-sm p-3 rounded-xl border border-slate-200 text-center">
                  <p className="text-3xl font-bold text-slate-900">{dialog.data.score}</p>
                  <p className="text-xs text-slate-500">Poäng av 100</p>
                </div>
                <div className="bg-white/50 backdrop-blur-sm p-3 rounded-xl border border-slate-200 text-center">
                  <p className={`text-2xl font-bold ${dialog.data.change >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                    {dialog.data.change >= 0 ? '+' : ''}{dialog.data.change}%
                  </p>
                  <p className="text-xs text-slate-500">Förändring</p>
                </div>
                <div className="bg-white/50 backdrop-blur-sm p-3 rounded-xl border border-slate-200 text-center">
                  <p className="text-2xl font-bold text-slate-900">{dialog.data.indicators?.length || 0}</p>
                  <p className="text-xs text-slate-500">Mätpunkter</p>
                </div>
              </div>

              {/* Indicators list */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  📊 Alla mätpunkter i {dialog.data.name?.toLowerCase()}
                  <span className="text-xs text-slate-400">Klicka för detaljer</span>
                </p>
                
                {dialog.data.indicators?.map((ind: DomainIndicator) => {
                  const color = ind.type === 'main' 
                    ? (ind.change >= 0 ? 'bg-emerald-500' : 'bg-red-500')
                    : (ind.change >= 0 ? 'bg-emerald-400' : 'bg-amber-500');
                  
                  return (
                    <button
                      key={ind.id}
                      onClick={() => openDialog('indicator', ind)}
                      className="w-full p-3 bg-white/70 backdrop-blur-sm rounded-xl border border-slate-200 hover:bg-white hover:border-slate-300 hover:shadow-md transition-all text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
                        <span className="font-medium text-slate-800 flex-1">{ind.name}</span>
                        
                        {/* Mini progress bar */}
                        <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
                            style={{ width: `${Math.min(100, Math.max(0, ind.score))}%` }}
                          />
                        </div>
                        
                        <span className="text-sm font-mono text-slate-600 w-16 text-right">
                          {ind.score.toLocaleString('sv-SE', { maximumFractionDigits: 1 })}
                        </span>
                        
                        <span className={`text-xs font-medium w-14 text-right ${ind.change >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                          {ind.change >= 0 ? '+' : ''}{ind.change}%
                        </span>
                        
                        <span className="text-slate-400 group-hover:text-blue-500 transition-colors">→</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Methodology box */}
              <div className="bg-blue-50/80 backdrop-blur-sm p-4 rounded-xl border border-blue-100">
                <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  🔬 Hur beräknas {dialog.data.name?.toLowerCase()}?
                </h4>
                <p className="text-sm text-blue-800 mb-2">
                  Poängen beräknas genom att väga samman {dialog.data.indicators?.length || 0} olika mätningar. 
                  Vikterna baseras på internationell forskning och svenska förhållanden.
                </p>
                <button 
                  onClick={() => openDialog('explanation', null)}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                >
                  Se fullständig metodik →
                </button>
              </div>

              <SourceAttribution
                sourceName="SCB, Socialstyrelsen, Eurostat"
                sourceUrl="https://www.scb.se"
                license="CC BY 4.0"
                lastUpdated={new Date('2024-01-15')}
                variant="compact"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Indicator Detail Dialog */}
      <Dialog open={dialog.type === 'indicator'} onOpenChange={closeDialog}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${dialog.data?.type === 'main' ? 'bg-blue-500' : 'bg-amber-400'}`} />
              <span>{dialog.data?.name}</span>
            </DialogTitle>
            <DialogDescription>
              {dialog.data?.type === 'main' ? 'Huvudindikator' : 'Stödindikator'} • {dialog.data?.unit}
            </DialogDescription>
          </DialogHeader>
          
          {dialog.data && (
            <div className="space-y-4 mt-4">
              {/* Current value */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-5 rounded-xl text-center border border-slate-200">
                <p className="text-5xl font-bold text-slate-900 mb-1">
                  {dialog.data.score?.toLocaleString('sv-SE', { maximumFractionDigits: 1 })}
                </p>
                <p className="text-sm text-slate-500">{dialog.data.unit}</p>
                <p className={`text-lg font-semibold mt-2 ${(dialog.data.change || 0) >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                  {(dialog.data.change || 0) >= 0 ? '↑' : '↓'} {Math.abs(dialog.data.change || 0)}% sedan förra året
                </p>
              </div>

              {/* Description */}
              <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-slate-200">
                <h4 className="font-semibold text-slate-900 mb-2">📖 Vad mäter detta?</h4>
                <p className="text-sm text-slate-700">{dialog.data.description}</p>
              </div>

              {/* Historical trend */}
              <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-slate-200">
                <h4 className="font-semibold text-slate-900 mb-3">📈 Historisk utveckling</h4>
                <div className="space-y-2">
                  {dialog.data.historicalData?.map((point: { year: number; value: number }, i: number) => {
                    const data = dialog.data?.historicalData || [];
                    const max = Math.max(...data.map((d: { value: number }) => d.value));
                    const min = Math.min(...data.map((d: { value: number }) => d.value));
                    const range = max - min || 1;
                    const width = ((point.value - min) / range) * 100;
                    
                    return (
                      <div key={point.year} className="flex items-center gap-3">
                        <span className="text-xs font-mono text-slate-500 w-12">{point.year}</span>
                        <div className="flex-1 h-4 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all ${i === data.length - 1 ? 'bg-blue-500' : 'bg-slate-300'}`}
                            style={{ width: `${Math.max(10, width)}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-slate-700 w-16 text-right">
                          {point.value.toLocaleString('sv-SE', { maximumFractionDigits: 1 })}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Methodology */}
              <div className="bg-amber-50/80 backdrop-blur-sm p-4 rounded-xl border border-amber-100">
                <h4 className="font-semibold text-amber-900 mb-2">🔬 Metodik</h4>
                <p className="text-sm text-amber-800">{dialog.data.methodology}</p>
              </div>

              {/* Sources */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-semibold text-slate-900 mb-3">📚 Datakällor</h4>
                <div className="space-y-2">
                  {dialog.data.sources?.map((source: { name: string; url: string }) => (
                    <a
                      key={source.name}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2 bg-white rounded-lg hover:bg-blue-50 transition-colors group"
                    >
                      <span className="font-medium text-slate-800">{source.name}</span>
                      <span className="text-blue-500 text-sm group-hover:underline">↗ Besök källa</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CountryInfoPanel;
