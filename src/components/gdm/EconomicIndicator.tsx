/**
 * ECONOMIC STATUS INDICATOR
 * 
 * Visualizes economic status of countries:
 * - GDP per capita
 * - Total GDP
 * - Economic growth
 * - Wealth distribution
 */

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

// ============================================================================
// TYPES
// ============================================================================

export type EconomicTier = 
  | 'ultra_high'    // >80k GDP/capita
  | 'very_high'     // 50-80k
  | 'high'          // 25-50k
  | 'upper_middle'  // 12-25k
  | 'lower_middle'  // 4-12k
  | 'low'           // <4k
  | 'unknown';

export interface EconomicInfo {
  gdpPerCapita: number;        // USD PPP
  gdpTotal?: number;           // Billions USD
  gdpGrowth?: number;          // %
  unemployment?: number;       // %
  inflation?: number;          // %
  publicDebt?: number;         // % of GDP
  tradeBalance?: number;       // Billions USD
  reserves?: number;           // Billions USD
  mainExports?: string[];
  notes?: string;
}

// ============================================================================
// ECONOMIC TIER CONFIG
// ============================================================================

export const ECONOMIC_TIER_CONFIG: Record<EconomicTier, {
  label: { sv: string; en: string };
  color: string;
  range: string;
}> = {
  ultra_high: { 
    label: { sv: 'Ultra-rik', en: 'Ultra High' }, 
    color: '#065F46', // Dark green
    range: '>$80,000'
  },
  very_high: { 
    label: { sv: 'Mycket hög', en: 'Very High' }, 
    color: '#059669', // Green
    range: '$50,000-80,000'
  },
  high: { 
    label: { sv: 'Hög', en: 'High' }, 
    color: '#10B981', // Light green
    range: '$25,000-50,000'
  },
  upper_middle: { 
    label: { sv: 'Övre medel', en: 'Upper Middle' }, 
    color: '#FBBF24', // Yellow
    range: '$12,000-25,000'
  },
  lower_middle: { 
    label: { sv: 'Lägre medel', en: 'Lower Middle' }, 
    color: '#F97316', // Orange
    range: '$4,000-12,000'
  },
  low: { 
    label: { sv: 'Låg', en: 'Low' }, 
    color: '#DC2626', // Red
    range: '<$4,000'
  },
  unknown: { 
    label: { sv: 'Okänd', en: 'Unknown' }, 
    color: '#9CA3AF', 
    range: 'N/A'
  },
};

// ============================================================================
// ECONOMIC DATA BY COUNTRY (2024 estimates, GDP per capita PPP)
// ============================================================================

export const ECONOMIC_DATA: Record<string, EconomicInfo> = {
  // Ultra-high (>80k)
  LU: { gdpPerCapita: 143743, gdpTotal: 89, gdpGrowth: 1.5, unemployment: 5.8, inflation: 3.2, publicDebt: 28, mainExports: ['Financial services', 'Steel', 'Chemicals'] },
  SG: { gdpPerCapita: 133737, gdpTotal: 515, gdpGrowth: 2.8, unemployment: 2.0, inflation: 4.5, publicDebt: 168, reserves: 289, mainExports: ['Electronics', 'Refined petroleum', 'Machinery'] },
  IE: { gdpPerCapita: 133194, gdpTotal: 589, gdpGrowth: 3.2, unemployment: 4.3, inflation: 5.2, publicDebt: 42, mainExports: ['Pharmaceuticals', 'Chemicals', 'Tech'] },
  QA: { gdpPerCapita: 112283, gdpTotal: 252, gdpGrowth: 2.4, unemployment: 0.1, inflation: 3.0, reserves: 45, mainExports: ['LNG', 'Oil', 'Petrochemicals'] },
  CH: { gdpPerCapita: 91932, gdpTotal: 841, gdpGrowth: 0.8, unemployment: 2.1, inflation: 1.7, publicDebt: 38, reserves: 837, mainExports: ['Watches', 'Pharmaceuticals', 'Machinery'] },
  AE: { gdpPerCapita: 88962, gdpTotal: 509, gdpGrowth: 3.4, unemployment: 2.9, inflation: 4.8, reserves: 173, mainExports: ['Oil', 'Gold', 'Diamonds'] },
  NO: { gdpPerCapita: 82655, gdpTotal: 546, gdpGrowth: 1.1, unemployment: 3.5, inflation: 5.5, publicDebt: 43, reserves: 1400, mainExports: ['Oil', 'Gas', 'Fish'] },
  
  // Very high (50-80k)
  US: { gdpPerCapita: 80412, gdpTotal: 27360, gdpGrowth: 2.5, unemployment: 3.8, inflation: 3.4, publicDebt: 123, reserves: 244, mainExports: ['Refined petroleum', 'Aircraft', 'Pharmaceuticals'] },
  IS: { gdpPerCapita: 75180, gdpTotal: 31, gdpGrowth: 4.5, unemployment: 3.8, inflation: 7.5, mainExports: ['Fish', 'Aluminum', 'Tourism'] },
  DK: { gdpPerCapita: 73386, gdpTotal: 431, gdpGrowth: 1.8, unemployment: 5.0, inflation: 3.3, publicDebt: 29, mainExports: ['Pharmaceuticals', 'Machinery', 'Food'] },
  NL: { gdpPerCapita: 72973, gdpTotal: 1135, gdpGrowth: 0.6, unemployment: 3.6, inflation: 3.9, publicDebt: 47, mainExports: ['Machinery', 'Chemicals', 'Fuel'] },
  SE: { gdpPerCapita: 66209, gdpTotal: 635, gdpGrowth: 0.3, unemployment: 7.5, inflation: 3.7, publicDebt: 31, mainExports: ['Machinery', 'Vehicles', 'Paper'] },
  AU: { gdpPerCapita: 65099, gdpTotal: 1788, gdpGrowth: 1.5, unemployment: 4.0, inflation: 4.1, publicDebt: 51, reserves: 62, mainExports: ['Iron ore', 'Coal', 'Gold'] },
  AT: { gdpPerCapita: 64751, gdpTotal: 536, gdpGrowth: 0.0, unemployment: 5.1, inflation: 4.3, publicDebt: 77, mainExports: ['Machinery', 'Vehicles', 'Pharmaceuticals'] },
  BE: { gdpPerCapita: 63936, gdpTotal: 653, gdpGrowth: 1.4, unemployment: 5.5, inflation: 2.3, publicDebt: 105, mainExports: ['Chemicals', 'Pharmaceuticals', 'Vehicles'] },
  FI: { gdpPerCapita: 59869, gdpTotal: 311, gdpGrowth: -0.5, unemployment: 7.2, inflation: 4.3, publicDebt: 75, mainExports: ['Paper', 'Machinery', 'Electronics'] },
  DE: { gdpPerCapita: 63150, gdpTotal: 4457, gdpGrowth: -0.3, unemployment: 3.1, inflation: 2.4, publicDebt: 64, reserves: 295, mainExports: ['Vehicles', 'Machinery', 'Chemicals'] },
  CA: { gdpPerCapita: 60495, gdpTotal: 2271, gdpGrowth: 1.1, unemployment: 6.1, inflation: 2.8, publicDebt: 107, reserves: 106, mainExports: ['Oil', 'Vehicles', 'Machinery'] },
  GB: { gdpPerCapita: 56471, gdpTotal: 3495, gdpGrowth: 0.1, unemployment: 4.2, inflation: 4.0, publicDebt: 101, reserves: 190, mainExports: ['Machinery', 'Vehicles', 'Pharmaceuticals'] },
  FR: { gdpPerCapita: 55493, gdpTotal: 3031, gdpGrowth: 0.7, unemployment: 7.1, inflation: 2.3, publicDebt: 111, reserves: 242, mainExports: ['Aircraft', 'Vehicles', 'Pharmaceuticals'] },
  
  // High (25-50k)
  KR: { gdpPerCapita: 53051, gdpTotal: 1721, gdpGrowth: 1.4, unemployment: 2.7, inflation: 3.6, publicDebt: 54, reserves: 420, mainExports: ['Semiconductors', 'Vehicles', 'Ships'] },
  IT: { gdpPerCapita: 52425, gdpTotal: 2255, gdpGrowth: 0.7, unemployment: 7.7, inflation: 1.0, publicDebt: 140, reserves: 200, mainExports: ['Machinery', 'Vehicles', 'Fashion'] },
  JP: { gdpPerCapita: 52120, gdpTotal: 4231, gdpGrowth: 1.9, unemployment: 2.6, inflation: 2.7, publicDebt: 255, reserves: 1295, mainExports: ['Vehicles', 'Machinery', 'Electronics'] },
  ES: { gdpPerCapita: 46413, gdpTotal: 1582, gdpGrowth: 2.5, unemployment: 11.7, inflation: 3.4, publicDebt: 108, mainExports: ['Vehicles', 'Food', 'Machinery'] },
  PL: { gdpPerCapita: 45342, gdpTotal: 842, gdpGrowth: 0.2, unemployment: 2.9, inflation: 11.4, publicDebt: 49, mainExports: ['Machinery', 'Vehicles', 'Furniture'] },
  PT: { gdpPerCapita: 41473, gdpTotal: 296, gdpGrowth: 2.3, unemployment: 6.5, inflation: 4.3, publicDebt: 112, mainExports: ['Vehicles', 'Fuel', 'Machinery'] },
  CZ: { gdpPerCapita: 49572, gdpTotal: 345, gdpGrowth: -0.4, unemployment: 2.6, inflation: 10.7, publicDebt: 44, mainExports: ['Machinery', 'Vehicles', 'Electronics'] },
  GR: { gdpPerCapita: 38067, gdpTotal: 260, gdpGrowth: 2.0, unemployment: 11.1, inflation: 4.2, publicDebt: 161, mainExports: ['Fuel', 'Food', 'Chemicals'] },
  HU: { gdpPerCapita: 43907, gdpTotal: 216, gdpGrowth: -0.9, unemployment: 4.3, inflation: 17.6, publicDebt: 73, mainExports: ['Machinery', 'Vehicles', 'Electronics'] },
  
  // Upper middle (12-25k)
  CN: { gdpPerCapita: 23309, gdpTotal: 18566, gdpGrowth: 5.2, unemployment: 5.2, inflation: 0.2, publicDebt: 83, reserves: 3220, mainExports: ['Electronics', 'Machinery', 'Textiles'] },
  RU: { gdpPerCapita: 36485, gdpTotal: 2240, gdpGrowth: 3.6, unemployment: 2.9, inflation: 7.4, publicDebt: 15, reserves: 600, mainExports: ['Oil', 'Gas', 'Metals'] },
  MX: { gdpPerCapita: 22672, gdpTotal: 1811, gdpGrowth: 3.2, unemployment: 2.8, inflation: 4.7, publicDebt: 53, reserves: 214, mainExports: ['Vehicles', 'Electronics', 'Oil'] },
  TR: { gdpPerCapita: 41887, gdpTotal: 1154, gdpGrowth: 4.5, unemployment: 9.4, inflation: 64.8, publicDebt: 34, reserves: 145, mainExports: ['Vehicles', 'Machinery', 'Textiles'] },
  MY: { gdpPerCapita: 35942, gdpTotal: 447, gdpGrowth: 3.7, unemployment: 3.3, inflation: 2.5, reserves: 116, mainExports: ['Electronics', 'Oil', 'Palm oil'] },
  TH: { gdpPerCapita: 21990, gdpTotal: 574, gdpGrowth: 1.9, unemployment: 1.0, inflation: 1.2, reserves: 224, mainExports: ['Electronics', 'Vehicles', 'Food'] },
  BR: { gdpPerCapita: 20809, gdpTotal: 2173, gdpGrowth: 2.9, unemployment: 7.8, inflation: 4.6, publicDebt: 87, reserves: 355, mainExports: ['Soybeans', 'Iron ore', 'Oil'] },
  AR: { gdpPerCapita: 26505, gdpTotal: 641, gdpGrowth: -1.6, unemployment: 6.2, inflation: 211.4, publicDebt: 155, reserves: 23, mainExports: ['Soybeans', 'Vehicles', 'Corn'] },
  ZA: { gdpPerCapita: 16091, gdpTotal: 405, gdpGrowth: 0.6, unemployment: 32.1, inflation: 5.4, publicDebt: 72, reserves: 62, mainExports: ['Gold', 'Diamonds', 'Platinum'] },
  
  // Lower middle (4-12k)
  ID: { gdpPerCapita: 15855, gdpTotal: 1417, gdpGrowth: 5.0, unemployment: 5.3, inflation: 2.8, reserves: 137, mainExports: ['Palm oil', 'Coal', 'Nickel'] },
  IN: { gdpPerCapita: 9183, gdpTotal: 3937, gdpGrowth: 7.8, unemployment: 8.0, inflation: 5.4, publicDebt: 81, reserves: 619, mainExports: ['Petroleum', 'Gems', 'Pharmaceuticals'] },
  VN: { gdpPerCapita: 14289, gdpTotal: 449, gdpGrowth: 5.0, unemployment: 2.3, inflation: 3.3, reserves: 100, mainExports: ['Electronics', 'Textiles', 'Footwear'] },
  PH: { gdpPerCapita: 10332, gdpTotal: 440, gdpGrowth: 5.6, unemployment: 4.3, inflation: 6.0, reserves: 103, mainExports: ['Electronics', 'Machinery', 'Coconut oil'] },
  EG: { gdpPerCapita: 14928, gdpTotal: 476, gdpGrowth: 3.8, unemployment: 7.0, inflation: 33.9, publicDebt: 96, reserves: 35, mainExports: ['Oil', 'Gas', 'Gold'] },
  NG: { gdpPerCapita: 5878, gdpTotal: 477, gdpGrowth: 2.9, unemployment: 5.0, inflation: 28.9, reserves: 34, mainExports: ['Oil', 'Gas', 'Cocoa'] },
  PK: { gdpPerCapita: 6470, gdpTotal: 374, gdpGrowth: -0.2, unemployment: 8.5, inflation: 28.3, publicDebt: 73, reserves: 13, mainExports: ['Textiles', 'Rice', 'Leather'] },
  BD: { gdpPerCapita: 8682, gdpTotal: 460, gdpGrowth: 5.8, unemployment: 5.1, inflation: 9.7, reserves: 20, mainExports: ['Textiles', 'Garments', 'Fish'] },
  UA: { gdpPerCapita: 14649, gdpTotal: 178, gdpGrowth: 5.3, unemployment: 19.0, inflation: 5.1, publicDebt: 93, notes: 'Pågående krig' },
  
  // Low (<4k)
  ET: { gdpPerCapita: 3245, gdpTotal: 164, gdpGrowth: 6.1, unemployment: 3.5, inflation: 30.2, mainExports: ['Coffee', 'Sesame', 'Gold'] },
  KE: { gdpPerCapita: 5759, gdpTotal: 113, gdpGrowth: 5.0, unemployment: 5.7, inflation: 6.6, mainExports: ['Tea', 'Coffee', 'Flowers'] },
  GH: { gdpPerCapita: 6627, gdpTotal: 76, gdpGrowth: 2.3, unemployment: 14.7, inflation: 23.2, publicDebt: 93, mainExports: ['Gold', 'Cocoa', 'Oil'] },
  TZ: { gdpPerCapita: 3574, gdpTotal: 85, gdpGrowth: 5.0, unemployment: 2.6, inflation: 4.0, mainExports: ['Gold', 'Tobacco', 'Coffee'] },
  UG: { gdpPerCapita: 2847, gdpTotal: 50, gdpGrowth: 6.0, unemployment: 2.8, inflation: 5.4, mainExports: ['Coffee', 'Fish', 'Tobacco'] },
  AF: { gdpPerCapita: 1516, gdpTotal: 14, unemployment: 14.0, inflation: 10.0, notes: 'Taliban-styre, ekonomisk kris' },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getEconomicTier(gdpPerCapita: number): EconomicTier {
  if (gdpPerCapita >= 80000) return 'ultra_high';
  if (gdpPerCapita >= 50000) return 'very_high';
  if (gdpPerCapita >= 25000) return 'high';
  if (gdpPerCapita >= 12000) return 'upper_middle';
  if (gdpPerCapita >= 4000) return 'lower_middle';
  return 'low';
}

export function getEconomicColor(countryCode: string): string {
  const info = ECONOMIC_DATA[countryCode];
  if (!info) return ECONOMIC_TIER_CONFIG.unknown.color;
  const tier = getEconomicTier(info.gdpPerCapita);
  return ECONOMIC_TIER_CONFIG[tier].color;
}

export function formatCurrency(value: number, type: 'capita' | 'total' = 'capita'): string {
  if (type === 'total') {
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}T`;
    return `$${value.toFixed(0)}B`;
  }
  return `$${value.toLocaleString()}`;
}

// ============================================================================
// ECONOMIC LEGEND
// ============================================================================

interface EconomicLegendProps {
  className?: string;
}

export function EconomicLegend({ className = '' }: EconomicLegendProps) {
  const tiers: EconomicTier[] = ['ultra_high', 'very_high', 'high', 'upper_middle', 'lower_middle', 'low'];

  return (
    <div className={`bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-3 ${className}`}>
      <p className="text-xs font-semibold text-slate-700 mb-2">
        💰 BNP per capita (PPP)
      </p>
      <div className="flex flex-col gap-1">
        {tiers.map(t => (
          <div key={t} className="flex items-center gap-2">
            <div 
              className="w-4 h-3 rounded-sm" 
              style={{ backgroundColor: ECONOMIC_TIER_CONFIG[t].color }}
            />
            <span className="text-[10px] text-slate-600">
              {ECONOMIC_TIER_CONFIG[t].label.sv} ({ECONOMIC_TIER_CONFIG[t].range})
            </span>
          </div>
        ))}
      </div>
      <p className="text-[9px] text-slate-400 mt-2 pt-2 border-t border-slate-100">
        Källa: IMF 2024 estimat
      </p>
    </div>
  );
}

// ============================================================================
// ECONOMIC DIALOG
// ============================================================================

interface EconomicDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  countryCode: string;
  countryName: string;
}

export function EconomicDialog({ open, onOpenChange, countryCode, countryName }: EconomicDialogProps) {
  const info = ECONOMIC_DATA[countryCode];
  
  if (!info) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>💰 Ekonomi i {countryName}</DialogTitle>
            <DialogDescription>Ingen data tillgänglig</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  const tier = getEconomicTier(info.gdpPerCapita);
  const config = ECONOMIC_TIER_CONFIG[tier];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">💰</span>
            Ekonomi: {countryName}
          </DialogTitle>
          <DialogDescription>Ekonomiska nyckeltal 2024</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* GDP per capita */}
          <div 
            className="flex items-center gap-4 p-4 rounded-xl"
            style={{ backgroundColor: `${config.color}20` }}
          >
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
              style={{ backgroundColor: config.color }}
            >
              <span className="text-white text-2xl font-bold">$</span>
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: config.color }}>
                {formatCurrency(info.gdpPerCapita)}
              </p>
              <p className="text-sm text-slate-600">BNP per capita (PPP)</p>
              <p className="text-xs text-slate-500">{config.label.sv}</p>
            </div>
          </div>

          {/* Key metrics grid */}
          <div className="grid grid-cols-2 gap-3">
            {info.gdpTotal && (
              <div className="bg-green-50 rounded-xl p-3">
                <p className="text-xs font-medium text-green-700 mb-1">📊 Total BNP</p>
                <p className="text-lg font-bold text-green-800">{formatCurrency(info.gdpTotal, 'total')}</p>
              </div>
            )}
            {info.gdpGrowth !== undefined && (
              <div className={`rounded-xl p-3 ${info.gdpGrowth >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                <p className={`text-xs font-medium mb-1 ${info.gdpGrowth >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                  📈 BNP-tillväxt
                </p>
                <p className={`text-lg font-bold ${info.gdpGrowth >= 0 ? 'text-green-800' : 'text-red-800'}`}>
                  {info.gdpGrowth > 0 ? '+' : ''}{info.gdpGrowth}%
                </p>
              </div>
            )}
            {info.unemployment !== undefined && (
              <div className={`rounded-xl p-3 ${info.unemployment < 5 ? 'bg-green-50' : info.unemployment < 10 ? 'bg-yellow-50' : 'bg-red-50'}`}>
                <p className="text-xs font-medium text-slate-700 mb-1">👷 Arbetslöshet</p>
                <p className="text-lg font-bold text-slate-800">{info.unemployment}%</p>
              </div>
            )}
            {info.inflation !== undefined && (
              <div className={`rounded-xl p-3 ${info.inflation < 3 ? 'bg-green-50' : info.inflation < 10 ? 'bg-yellow-50' : 'bg-red-50'}`}>
                <p className="text-xs font-medium text-slate-700 mb-1">📉 Inflation</p>
                <p className="text-lg font-bold text-slate-800">{info.inflation}%</p>
              </div>
            )}
            {info.publicDebt !== undefined && (
              <div className={`rounded-xl p-3 ${info.publicDebt < 60 ? 'bg-green-50' : info.publicDebt < 100 ? 'bg-yellow-50' : 'bg-red-50'}`}>
                <p className="text-xs font-medium text-slate-700 mb-1">🏦 Statsskuld</p>
                <p className="text-lg font-bold text-slate-800">{info.publicDebt}% av BNP</p>
              </div>
            )}
            {info.reserves !== undefined && (
              <div className="bg-blue-50 rounded-xl p-3">
                <p className="text-xs font-medium text-blue-700 mb-1">💎 Valutareserver</p>
                <p className="text-lg font-bold text-blue-800">${info.reserves}B</p>
              </div>
            )}
          </div>

          {/* Main exports */}
          {info.mainExports && info.mainExports.length > 0 && (
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-xs font-medium text-slate-700 mb-2">📦 Huvudexporter</p>
              <div className="flex flex-wrap gap-1">
                {info.mainExports.map(e => (
                  <span key={e} className="px-2 py-1 bg-white rounded-full text-xs text-slate-700 border">
                    {e}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {info.notes && (
            <div className="border border-amber-200 bg-amber-50 rounded-xl p-3">
              <p className="text-xs text-amber-700">⚠️ {info.notes}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default EconomicLegend;
