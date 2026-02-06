/**
 * ENERGY INDICATOR
 * 
 * Shows energy mix per country: nuclear, coal, wind, solar, hydro, gas, oil.
 * Color-coded by dominant energy source.
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

// ============================================
// ENERGY TYPES & DATA
// ============================================

export type EnergySource = 'nuclear' | 'coal' | 'gas' | 'oil' | 'hydro' | 'wind' | 'solar' | 'other';

export interface EnergyMix {
  nuclear: number;
  coal: number;
  gas: number;
  oil: number;
  hydro: number;
  wind: number;
  solar: number;
  other: number;
}

export interface CountryEnergy {
  mix: EnergyMix;
  dominant: EnergySource;
  renewablePercent: number;
  fossilPercent: number;
  carbonIntensity: number; // gCO2/kWh
  totalCapacityGW: number;
  lastUpdated: string;
}

// Energy source metadata
export const ENERGY_SOURCES: Record<EnergySource, { label: string; icon: string; color: string; description: string }> = {
  nuclear: { label: 'Kärnkraft', icon: '☢️', color: '#9333ea', description: 'Elektricitet från kärnkraftverk' },
  coal: { label: 'Kol', icon: '⬛', color: '#374151', description: 'Fossilt bränsle med höga utsläpp' },
  gas: { label: 'Naturgas', icon: '🔥', color: '#f97316', description: 'Fossilt bränsle, lägre utsläpp än kol' },
  oil: { label: 'Olja', icon: '🛢️', color: '#1f2937', description: 'Fossilt bränsle från petroleum' },
  hydro: { label: 'Vattenkraft', icon: '💧', color: '#0ea5e9', description: 'Förnybar energi från vattendrag' },
  wind: { label: 'Vindkraft', icon: '🌬️', color: '#06b6d4', description: 'Förnybar energi från vind' },
  solar: { label: 'Solenergi', icon: '☀️', color: '#eab308', description: 'Förnybar energi från solen' },
  other: { label: 'Övrigt', icon: '⚡', color: '#6b7280', description: 'Biomassa, geotermisk m.m.' },
};

// Country energy data (approximate 2024 data)
export const ENERGY_DATA: Record<string, CountryEnergy> = {
  // Nordic
  'SE': { mix: { nuclear: 30, hydro: 45, wind: 17, solar: 2, coal: 1, gas: 2, oil: 1, other: 2 }, dominant: 'hydro', renewablePercent: 66, fossilPercent: 4, carbonIntensity: 25, totalCapacityGW: 42, lastUpdated: '2024-12' },
  'NO': { mix: { hydro: 92, wind: 6, gas: 1, nuclear: 0, coal: 0, oil: 0, solar: 0, other: 1 }, dominant: 'hydro', renewablePercent: 99, fossilPercent: 1, carbonIntensity: 8, totalCapacityGW: 38, lastUpdated: '2024-12' },
  'FI': { mix: { nuclear: 35, hydro: 18, wind: 18, coal: 5, gas: 5, oil: 2, solar: 1, other: 16 }, dominant: 'nuclear', renewablePercent: 53, fossilPercent: 12, carbonIntensity: 80, totalCapacityGW: 22, lastUpdated: '2024-12' },
  'DK': { mix: { wind: 55, solar: 8, coal: 8, gas: 10, oil: 2, nuclear: 0, hydro: 0, other: 17 }, dominant: 'wind', renewablePercent: 80, fossilPercent: 20, carbonIntensity: 120, totalCapacityGW: 17, lastUpdated: '2024-12' },
  'IS': { mix: { hydro: 70, other: 30, nuclear: 0, coal: 0, gas: 0, oil: 0, wind: 0, solar: 0 }, dominant: 'hydro', renewablePercent: 100, fossilPercent: 0, carbonIntensity: 5, totalCapacityGW: 3, lastUpdated: '2024-12' },
  
  // Western Europe
  'FR': { mix: { nuclear: 65, hydro: 12, wind: 9, solar: 5, gas: 6, coal: 1, oil: 1, other: 1 }, dominant: 'nuclear', renewablePercent: 27, fossilPercent: 8, carbonIntensity: 55, totalCapacityGW: 140, lastUpdated: '2024-12' },
  'DE': { mix: { wind: 27, coal: 26, gas: 15, solar: 12, nuclear: 0, hydro: 4, oil: 1, other: 15 }, dominant: 'wind', renewablePercent: 58, fossilPercent: 42, carbonIntensity: 350, totalCapacityGW: 240, lastUpdated: '2024-12' },
  'GB': { mix: { wind: 30, gas: 32, nuclear: 15, solar: 5, hydro: 2, coal: 1, oil: 1, other: 14 }, dominant: 'gas', renewablePercent: 51, fossilPercent: 34, carbonIntensity: 200, totalCapacityGW: 105, lastUpdated: '2024-12' },
  'ES': { mix: { wind: 24, nuclear: 21, solar: 17, gas: 18, hydro: 10, coal: 2, oil: 3, other: 5 }, dominant: 'wind', renewablePercent: 56, fossilPercent: 23, carbonIntensity: 150, totalCapacityGW: 120, lastUpdated: '2024-12' },
  'IT': { mix: { gas: 42, hydro: 15, solar: 11, wind: 8, coal: 4, oil: 4, nuclear: 0, other: 16 }, dominant: 'gas', renewablePercent: 50, fossilPercent: 50, carbonIntensity: 280, totalCapacityGW: 125, lastUpdated: '2024-12' },
  'NL': { mix: { gas: 45, wind: 20, solar: 15, coal: 8, nuclear: 3, hydro: 0, oil: 2, other: 7 }, dominant: 'gas', renewablePercent: 42, fossilPercent: 55, carbonIntensity: 320, totalCapacityGW: 45, lastUpdated: '2024-12' },
  'BE': { mix: { nuclear: 40, gas: 25, wind: 15, solar: 8, hydro: 1, coal: 2, oil: 2, other: 7 }, dominant: 'nuclear', renewablePercent: 31, fossilPercent: 29, carbonIntensity: 170, totalCapacityGW: 25, lastUpdated: '2024-12' },
  'AT': { mix: { hydro: 60, wind: 12, solar: 5, gas: 15, coal: 2, nuclear: 0, oil: 2, other: 4 }, dominant: 'hydro', renewablePercent: 81, fossilPercent: 19, carbonIntensity: 100, totalCapacityGW: 28, lastUpdated: '2024-12' },
  'CH': { mix: { hydro: 57, nuclear: 35, solar: 5, wind: 1, gas: 1, coal: 0, oil: 0, other: 1 }, dominant: 'hydro', renewablePercent: 63, fossilPercent: 1, carbonIntensity: 30, totalCapacityGW: 25, lastUpdated: '2024-12' },
  'PT': { mix: { wind: 28, hydro: 25, solar: 7, gas: 25, coal: 5, nuclear: 0, oil: 5, other: 5 }, dominant: 'wind', renewablePercent: 65, fossilPercent: 35, carbonIntensity: 180, totalCapacityGW: 22, lastUpdated: '2024-12' },
  
  // Eastern Europe
  'PL': { mix: { coal: 65, gas: 10, wind: 12, solar: 5, hydro: 2, nuclear: 0, oil: 2, other: 4 }, dominant: 'coal', renewablePercent: 23, fossilPercent: 77, carbonIntensity: 650, totalCapacityGW: 55, lastUpdated: '2024-12' },
  'CZ': { mix: { coal: 40, nuclear: 35, gas: 8, solar: 5, wind: 2, hydro: 3, oil: 2, other: 5 }, dominant: 'coal', renewablePercent: 15, fossilPercent: 50, carbonIntensity: 400, totalCapacityGW: 22, lastUpdated: '2024-12' },
  'UA': { mix: { nuclear: 55, coal: 25, hydro: 8, gas: 8, wind: 2, solar: 1, oil: 0, other: 1 }, dominant: 'nuclear', renewablePercent: 11, fossilPercent: 33, carbonIntensity: 300, totalCapacityGW: 55, lastUpdated: '2024-12' },
  'RO': { mix: { hydro: 28, nuclear: 20, coal: 20, gas: 15, wind: 12, solar: 3, oil: 1, other: 1 }, dominant: 'hydro', renewablePercent: 43, fossilPercent: 36, carbonIntensity: 280, totalCapacityGW: 22, lastUpdated: '2024-12' },
  'HU': { mix: { nuclear: 45, gas: 25, solar: 12, coal: 8, wind: 3, hydro: 1, oil: 2, other: 4 }, dominant: 'nuclear', renewablePercent: 20, fossilPercent: 35, carbonIntensity: 220, totalCapacityGW: 12, lastUpdated: '2024-12' },
  
  // North America
  'US': { mix: { gas: 43, coal: 16, nuclear: 18, wind: 11, solar: 5, hydro: 6, oil: 0, other: 1 }, dominant: 'gas', renewablePercent: 23, fossilPercent: 59, carbonIntensity: 380, totalCapacityGW: 1280, lastUpdated: '2024-12' },
  'CA': { mix: { hydro: 60, nuclear: 15, gas: 12, wind: 7, coal: 3, solar: 2, oil: 0, other: 1 }, dominant: 'hydro', renewablePercent: 69, fossilPercent: 15, carbonIntensity: 120, totalCapacityGW: 150, lastUpdated: '2024-12' },
  'MX': { mix: { gas: 55, oil: 10, hydro: 10, wind: 8, coal: 8, solar: 5, nuclear: 3, other: 1 }, dominant: 'gas', renewablePercent: 28, fossilPercent: 73, carbonIntensity: 420, totalCapacityGW: 85, lastUpdated: '2024-12' },
  
  // Asia
  'CN': { mix: { coal: 60, hydro: 15, wind: 10, solar: 6, nuclear: 5, gas: 3, oil: 0, other: 1 }, dominant: 'coal', renewablePercent: 32, fossilPercent: 63, carbonIntensity: 550, totalCapacityGW: 2950, lastUpdated: '2024-12' },
  'JP': { mix: { gas: 35, coal: 28, nuclear: 8, solar: 10, hydro: 8, wind: 2, oil: 6, other: 3 }, dominant: 'gas', renewablePercent: 23, fossilPercent: 69, carbonIntensity: 450, totalCapacityGW: 340, lastUpdated: '2024-12' },
  'KR': { mix: { coal: 32, nuclear: 30, gas: 28, solar: 5, wind: 2, hydro: 1, oil: 1, other: 1 }, dominant: 'coal', renewablePercent: 9, fossilPercent: 61, carbonIntensity: 420, totalCapacityGW: 140, lastUpdated: '2024-12' },
  'IN': { mix: { coal: 72, hydro: 10, solar: 7, wind: 5, nuclear: 3, gas: 2, oil: 0, other: 1 }, dominant: 'coal', renewablePercent: 23, fossilPercent: 74, carbonIntensity: 680, totalCapacityGW: 430, lastUpdated: '2024-12' },
  'TW': { mix: { coal: 42, gas: 38, nuclear: 10, solar: 4, wind: 2, hydro: 2, oil: 1, other: 1 }, dominant: 'coal', renewablePercent: 9, fossilPercent: 81, carbonIntensity: 490, totalCapacityGW: 58, lastUpdated: '2024-12' },
  
  // Middle East
  'SA': { mix: { gas: 55, oil: 42, solar: 2, wind: 0, nuclear: 0, coal: 0, hydro: 0, other: 1 }, dominant: 'gas', renewablePercent: 3, fossilPercent: 97, carbonIntensity: 520, totalCapacityGW: 85, lastUpdated: '2024-12' },
  'AE': { mix: { gas: 90, solar: 5, nuclear: 4, oil: 0, coal: 0, hydro: 0, wind: 0, other: 1 }, dominant: 'gas', renewablePercent: 6, fossilPercent: 90, carbonIntensity: 420, totalCapacityGW: 36, lastUpdated: '2024-12' },
  'IR': { mix: { gas: 80, oil: 10, hydro: 8, nuclear: 1, coal: 0, wind: 0, solar: 0, other: 1 }, dominant: 'gas', renewablePercent: 9, fossilPercent: 90, carbonIntensity: 450, totalCapacityGW: 92, lastUpdated: '2024-12' },
  
  // Africa
  'ZA': { mix: { coal: 85, nuclear: 5, wind: 4, solar: 3, hydro: 2, gas: 0, oil: 0, other: 1 }, dominant: 'coal', renewablePercent: 10, fossilPercent: 85, carbonIntensity: 750, totalCapacityGW: 58, lastUpdated: '2024-12' },
  'EG': { mix: { gas: 75, oil: 12, hydro: 8, wind: 3, solar: 1, nuclear: 0, coal: 0, other: 1 }, dominant: 'gas', renewablePercent: 12, fossilPercent: 87, carbonIntensity: 450, totalCapacityGW: 62, lastUpdated: '2024-12' },
  'NG': { mix: { gas: 80, hydro: 15, oil: 3, solar: 1, wind: 0, nuclear: 0, coal: 0, other: 1 }, dominant: 'gas', renewablePercent: 17, fossilPercent: 83, carbonIntensity: 380, totalCapacityGW: 16, lastUpdated: '2024-12' },
  'MA': { mix: { coal: 38, wind: 22, solar: 10, hydro: 8, gas: 18, oil: 2, nuclear: 0, other: 2 }, dominant: 'coal', renewablePercent: 42, fossilPercent: 58, carbonIntensity: 480, totalCapacityGW: 12, lastUpdated: '2024-12' },
  
  // South America
  'BR': { mix: { hydro: 65, wind: 12, solar: 4, gas: 10, nuclear: 2, coal: 3, oil: 2, other: 2 }, dominant: 'hydro', renewablePercent: 83, fossilPercent: 15, carbonIntensity: 85, totalCapacityGW: 195, lastUpdated: '2024-12' },
  'AR': { mix: { gas: 55, hydro: 25, nuclear: 5, wind: 8, solar: 3, coal: 2, oil: 1, other: 1 }, dominant: 'gas', renewablePercent: 38, fossilPercent: 58, carbonIntensity: 320, totalCapacityGW: 45, lastUpdated: '2024-12' },
  'CL': { mix: { solar: 22, hydro: 25, wind: 15, coal: 18, gas: 15, oil: 2, nuclear: 0, other: 3 }, dominant: 'hydro', renewablePercent: 65, fossilPercent: 35, carbonIntensity: 280, totalCapacityGW: 32, lastUpdated: '2024-12' },
  'CO': { mix: { hydro: 68, gas: 15, coal: 8, wind: 3, solar: 2, oil: 2, nuclear: 0, other: 2 }, dominant: 'hydro', renewablePercent: 75, fossilPercent: 25, carbonIntensity: 120, totalCapacityGW: 18, lastUpdated: '2024-12' },
  
  // Oceania
  'AU': { mix: { coal: 47, gas: 20, solar: 15, wind: 12, hydro: 5, oil: 0, nuclear: 0, other: 1 }, dominant: 'coal', renewablePercent: 33, fossilPercent: 67, carbonIntensity: 510, totalCapacityGW: 78, lastUpdated: '2024-12' },
  'NZ': { mix: { hydro: 58, other: 18, wind: 8, gas: 12, solar: 2, coal: 2, nuclear: 0, oil: 0 }, dominant: 'hydro', renewablePercent: 86, fossilPercent: 14, carbonIntensity: 95, totalCapacityGW: 10, lastUpdated: '2024-12' },
  
  // Russia & Central Asia
  'RU': { mix: { gas: 48, nuclear: 20, hydro: 18, coal: 12, oil: 1, wind: 0, solar: 0, other: 1 }, dominant: 'gas', renewablePercent: 19, fossilPercent: 61, carbonIntensity: 380, totalCapacityGW: 260, lastUpdated: '2024-12' },
  'KZ': { mix: { coal: 65, gas: 20, hydro: 10, wind: 3, solar: 1, nuclear: 0, oil: 0, other: 1 }, dominant: 'coal', renewablePercent: 14, fossilPercent: 85, carbonIntensity: 620, totalCapacityGW: 24, lastUpdated: '2024-12' },
};

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getEnergyColor(dominant: EnergySource): string {
  return ENERGY_SOURCES[dominant].color;
}

export function getCountryEnergy(countryCode: string): CountryEnergy | null {
  return ENERGY_DATA[countryCode] || null;
}

export function getRenewableCategory(percent: number): { label: string; color: string } {
  if (percent >= 80) return { label: 'Nästan helt förnybart', color: 'text-emerald-600' };
  if (percent >= 60) return { label: 'Mestadels förnybart', color: 'text-green-600' };
  if (percent >= 40) return { label: 'Blandat', color: 'text-amber-600' };
  if (percent >= 20) return { label: 'Mestadels fossilt', color: 'text-orange-600' };
  return { label: 'Fossilt dominerat', color: 'text-red-600' };
}

export function getCarbonCategory(intensity: number): { label: string; color: string } {
  if (intensity <= 50) return { label: 'Mycket lågt', color: 'text-emerald-600' };
  if (intensity <= 150) return { label: 'Lågt', color: 'text-green-600' };
  if (intensity <= 300) return { label: 'Medel', color: 'text-amber-600' };
  if (intensity <= 500) return { label: 'Högt', color: 'text-orange-600' };
  return { label: 'Mycket högt', color: 'text-red-600' };
}

// ============================================
// ENERGY BAR COMPONENT
// ============================================

interface EnergyBarProps {
  mix: EnergyMix;
  className?: string;
}

export const EnergyBar: React.FC<EnergyBarProps> = ({ mix, className }) => {
  // Sort sources by percentage
  const sources = Object.entries(mix)
    .filter(([, value]) => value > 0)
    .sort(([, a], [, b]) => b - a) as [EnergySource, number][];

  return (
    <div className={cn("w-full h-6 rounded-full overflow-hidden flex", className)}>
      {sources.map(([source, percent]) => (
        <div
          key={source}
          style={{ 
            width: `${percent}%`,
            backgroundColor: ENERGY_SOURCES[source].color,
          }}
          className="h-full flex items-center justify-center text-white text-[10px] font-medium"
          title={`${ENERGY_SOURCES[source].label}: ${percent}%`}
        >
          {percent >= 8 && `${percent}%`}
        </div>
      ))}
    </div>
  );
};

// ============================================
// ENERGY LEGEND
// ============================================

export const EnergyLegend: React.FC = () => {
  return (
    <Card className="bg-white/95 backdrop-blur-sm shadow-lg">
      <CardContent className="p-3">
        <h4 className="text-xs font-semibold text-slate-700 mb-2">⚡ Energikällor</h4>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          {Object.entries(ENERGY_SOURCES).map(([key, { label, icon, color }]) => (
            <div key={key} className="flex items-center gap-1.5">
              <span 
                className="w-3 h-3 rounded-full shrink-0" 
                style={{ backgroundColor: color }}
              />
              <span className="text-xs text-slate-600">{icon} {label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// ============================================
// ENERGY DIALOG
// ============================================

interface EnergyDialogProps {
  countryCode: string;
  countryName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EnergyDialog: React.FC<EnergyDialogProps> = ({
  countryCode,
  countryName,
  open,
  onOpenChange,
}) => {
  const energy = getCountryEnergy(countryCode);
  
  if (!energy) return null;

  const renewableCat = getRenewableCategory(energy.renewablePercent);
  const carbonCat = getCarbonCategory(energy.carbonIntensity);
  const dominantInfo = ENERGY_SOURCES[energy.dominant];

  // Sort sources for display
  const sortedSources = Object.entries(energy.mix)
    .filter(([, value]) => value > 0)
    .sort(([, a], [, b]) => b - a) as [EnergySource, number][];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            ⚡ Energimix: {countryName}
          </DialogTitle>
          <DialogDescription>
            Fördelning av elproduktion per energikälla
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Dominant source highlight */}
          <div className="p-4 rounded-xl" style={{ backgroundColor: `${dominantInfo.color}15` }}>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{dominantInfo.icon}</span>
              <div>
                <p className="font-semibold text-slate-900">Dominerande: {dominantInfo.label}</p>
                <p className="text-sm text-slate-600">{dominantInfo.description}</p>
              </div>
            </div>
          </div>

          {/* Energy bar */}
          <div>
            <p className="text-sm font-medium text-slate-700 mb-2">Energimix</p>
            <EnergyBar mix={energy.mix} />
          </div>

          {/* Source list */}
          <div className="space-y-2">
            {sortedSources.map(([source, percent]) => {
              const info = ENERGY_SOURCES[source];
              return (
                <div key={source} className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
                  <span 
                    className="w-4 h-4 rounded-full shrink-0" 
                    style={{ backgroundColor: info.color }}
                  />
                  <span className="text-lg">{info.icon}</span>
                  <span className="flex-1 text-sm font-medium text-slate-700">{info.label}</span>
                  <span className="text-sm font-bold text-slate-900">{percent}%</span>
                </div>
              );
            })}
          </div>

          {/* Key metrics */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-3">
                <p className="text-xs text-slate-600">Förnybart</p>
                <p className="text-xl font-bold text-green-700">{energy.renewablePercent}%</p>
                <p className={cn("text-xs", renewableCat.color)}>{renewableCat.label}</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-50 border-slate-200">
              <CardContent className="p-3">
                <p className="text-xs text-slate-600">Fossilt</p>
                <p className="text-xl font-bold text-slate-700">{energy.fossilPercent}%</p>
              </CardContent>
            </Card>
            <Card className="bg-amber-50 border-amber-200">
              <CardContent className="p-3">
                <p className="text-xs text-slate-600">CO₂-intensitet</p>
                <p className="text-xl font-bold text-amber-700">{energy.carbonIntensity}</p>
                <p className={cn("text-xs", carbonCat.color)}>{carbonCat.label} (g/kWh)</p>
              </CardContent>
            </Card>
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-3">
                <p className="text-xs text-slate-600">Total kapacitet</p>
                <p className="text-xl font-bold text-blue-700">{energy.totalCapacityGW}</p>
                <p className="text-xs text-slate-500">GW</p>
              </CardContent>
            </Card>
          </div>

          {/* Data source */}
          <div className="text-center pt-2 border-t">
            <p className="text-xs text-slate-500">
              📊 Data: IEA, Ember ({energy.lastUpdated})
            </p>
            <a 
              href="https://ember-climate.org/data-catalogue/yearly-electricity-data/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:underline"
            >
              🔗 Se primärkälla →
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnergyDialog;
