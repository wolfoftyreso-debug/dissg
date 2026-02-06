/**
 * MILITARY STRENGTH INDICATOR
 * 
 * Visualizes military power of countries with detailed breakdowns:
 * - Personnel
 * - Tanks, aircraft, ships
 * - Nuclear capability
 * - Defense budget
 */

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

// ============================================================================
// TYPES
// ============================================================================

export type MilitaryTier = 
  | 'superpower'    // US, Russia, China
  | 'major_power'   // France, UK, India
  | 'regional'      // Turkey, Israel, South Korea
  | 'moderate'      // Sweden, Poland, etc.
  | 'limited'       // Small countries
  | 'minimal'       // Tiny militaries
  | 'none'          // No military
  | 'unknown';

export interface MilitaryInfo {
  // Personnel
  activePersonnel: number;
  reservePersonnel?: number;
  paramilitaryPersonnel?: number;
  
  // Ground forces
  tanks?: number;
  armoredVehicles?: number;
  artillery?: number;
  rocketLaunchers?: number;
  
  // Air force
  aircraft?: number;
  fighters?: number;
  helicopters?: number;
  attackHelicopters?: number;
  
  // Navy
  navalVessels?: number;
  submarines?: number;
  aircraftCarriers?: number;
  destroyers?: number;
  frigates?: number;
  
  // Special capabilities
  nuclearWarheads?: number;
  hasNuclear?: boolean;
  icbm?: number;
  
  // Budget
  defensebudget?: number; // Billions USD
  budgetPercentGDP?: number;
  
  // Rankings and notes
  globalRank?: number;
  notes?: string;
}

// ============================================================================
// MILITARY TIER CONFIG
// ============================================================================

export const MILITARY_TIER_CONFIG: Record<MilitaryTier, {
  label: { sv: string; en: string };
  color: string;
  description: string;
}> = {
  superpower: { 
    label: { sv: 'Supermakt', en: 'Superpower' }, 
    color: '#7C2D12', // Dark brown/maroon
    description: 'Global räckvidd, kärnvapen'
  },
  major_power: { 
    label: { sv: 'Stormakt', en: 'Major Power' }, 
    color: '#DC2626', // Red
    description: 'Betydande global kapacitet'
  },
  regional: { 
    label: { sv: 'Regional makt', en: 'Regional Power' }, 
    color: '#F97316', // Orange
    description: 'Stark regional närvaro'
  },
  moderate: { 
    label: { sv: 'Medelstark', en: 'Moderate' }, 
    color: '#FBBF24', // Yellow
    description: 'Kapabel försvarsmakt'
  },
  limited: { 
    label: { sv: 'Begränsad', en: 'Limited' }, 
    color: '#84CC16', // Lime
    description: 'Liten men funktionell'
  },
  minimal: { 
    label: { sv: 'Minimal', en: 'Minimal' }, 
    color: '#22C55E', // Green
    description: 'Symbolisk försvarsmakt'
  },
  none: { 
    label: { sv: 'Ingen', en: 'None' }, 
    color: '#10B981', // Teal
    description: 'Ingen reguljär militär'
  },
  unknown: { 
    label: { sv: 'Okänd', en: 'Unknown' }, 
    color: '#9CA3AF', 
    description: 'Ingen data'
  },
};

// ============================================================================
// MILITARY DATA BY COUNTRY (2024)
// ============================================================================

export const MILITARY_DATA: Record<string, MilitaryInfo> = {
  // Superpowers
  US: { 
    activePersonnel: 1328000, reservePersonnel: 799000, 
    tanks: 5500, armoredVehicles: 45000, artillery: 3000, 
    aircraft: 13300, fighters: 1957, helicopters: 5463, attackHelicopters: 910,
    navalVessels: 484, submarines: 68, aircraftCarriers: 11, destroyers: 92, frigates: 0,
    nuclearWarheads: 5550, hasNuclear: true, icbm: 400,
    defensebudget: 886, budgetPercentGDP: 3.4,
    globalRank: 1
  },
  RU: { 
    activePersonnel: 1150000, reservePersonnel: 2000000, paramilitaryPersonnel: 554000,
    tanks: 12420, armoredVehicles: 30122, artillery: 14564, rocketLaunchers: 3860,
    aircraft: 4255, fighters: 772, helicopters: 1543, attackHelicopters: 544,
    navalVessels: 598, submarines: 65, aircraftCarriers: 1, destroyers: 15, frigates: 11,
    nuclearWarheads: 5977, hasNuclear: true, icbm: 326,
    defensebudget: 109, budgetPercentGDP: 5.9,
    globalRank: 2,
    notes: 'Stora förluster i Ukraina'
  },
  CN: { 
    activePersonnel: 2035000, reservePersonnel: 510000, paramilitaryPersonnel: 1500000,
    tanks: 5000, armoredVehicles: 35000, artillery: 5000, rocketLaunchers: 3160,
    aircraft: 3304, fighters: 1200, helicopters: 912, attackHelicopters: 281,
    navalVessels: 730, submarines: 78, aircraftCarriers: 3, destroyers: 50, frigates: 42,
    nuclearWarheads: 500, hasNuclear: true, icbm: 350,
    defensebudget: 296, budgetPercentGDP: 1.7,
    globalRank: 3
  },
  
  // Major powers
  IN: { 
    activePersonnel: 1455550, reservePersonnel: 1155000, paramilitaryPersonnel: 2527000,
    tanks: 4614, armoredVehicles: 12000, artillery: 4026, rocketLaunchers: 1320,
    aircraft: 2296, fighters: 564, helicopters: 826, attackHelicopters: 37,
    navalVessels: 295, submarines: 18, aircraftCarriers: 2, destroyers: 11, frigates: 13,
    nuclearWarheads: 172, hasNuclear: true, icbm: 0,
    defensebudget: 83, budgetPercentGDP: 2.4,
    globalRank: 4
  },
  GB: { 
    activePersonnel: 148500, reservePersonnel: 37000,
    tanks: 227, armoredVehicles: 5015, artillery: 126,
    aircraft: 664, fighters: 119, helicopters: 245, attackHelicopters: 50,
    navalVessels: 72, submarines: 11, aircraftCarriers: 2, destroyers: 6, frigates: 11,
    nuclearWarheads: 225, hasNuclear: true,
    defensebudget: 75, budgetPercentGDP: 2.3,
    globalRank: 5
  },
  FR: { 
    activePersonnel: 203250, reservePersonnel: 41050,
    tanks: 406, armoredVehicles: 6558, artillery: 105,
    aircraft: 1055, fighters: 266, helicopters: 488, attackHelicopters: 69,
    navalVessels: 180, submarines: 10, aircraftCarriers: 1, destroyers: 11, frigates: 15,
    nuclearWarheads: 290, hasNuclear: true,
    defensebudget: 61, budgetPercentGDP: 2.1,
    globalRank: 6
  },
  KR: { 
    activePersonnel: 555000, reservePersonnel: 3100000,
    tanks: 2130, armoredVehicles: 13000, artillery: 6038, rocketLaunchers: 600,
    aircraft: 1576, fighters: 402, helicopters: 739, attackHelicopters: 112,
    navalVessels: 234, submarines: 22, destroyers: 12, frigates: 18,
    defensebudget: 47, budgetPercentGDP: 2.8,
    globalRank: 7
  },
  JP: { 
    activePersonnel: 247150, reservePersonnel: 56000,
    tanks: 1004, armoredVehicles: 5500, artillery: 480,
    aircraft: 1449, fighters: 287, helicopters: 528, attackHelicopters: 119,
    navalVessels: 155, submarines: 23, destroyers: 36, frigates: 4,
    defensebudget: 53, budgetPercentGDP: 1.2,
    globalRank: 8,
    notes: 'Ökar försvarsbudget kraftigt'
  },
  
  // Regional powers
  TR: { 
    activePersonnel: 425000, reservePersonnel: 378000,
    tanks: 2229, armoredVehicles: 11000, artillery: 1255,
    aircraft: 1065, fighters: 207, helicopters: 507, attackHelicopters: 91,
    navalVessels: 156, submarines: 12, frigates: 16,
    defensebudget: 16, budgetPercentGDP: 1.4,
    globalRank: 11
  },
  IL: { 
    activePersonnel: 169500, reservePersonnel: 465000,
    tanks: 1370, armoredVehicles: 12500, artillery: 650,
    aircraft: 612, fighters: 241, helicopters: 127, attackHelicopters: 48,
    navalVessels: 67, submarines: 5,
    nuclearWarheads: 90, hasNuclear: true,
    defensebudget: 24, budgetPercentGDP: 5.3,
    globalRank: 17,
    notes: 'Kärnvapenstatus ej bekräftad'
  },
  EG: { 
    activePersonnel: 438500, reservePersonnel: 479000, paramilitaryPersonnel: 397000,
    tanks: 4295, armoredVehicles: 13000, artillery: 1139,
    aircraft: 1062, fighters: 238, helicopters: 294, attackHelicopters: 92,
    navalVessels: 316, submarines: 8, frigates: 9,
    defensebudget: 7, budgetPercentGDP: 1.2,
    globalRank: 12
  },
  PK: { 
    activePersonnel: 654000, reservePersonnel: 550000, paramilitaryPersonnel: 421000,
    tanks: 2824, armoredVehicles: 8000, artillery: 1366,
    aircraft: 1434, fighters: 150, helicopters: 356, attackHelicopters: 52,
    navalVessels: 114, submarines: 9, frigates: 10,
    nuclearWarheads: 170, hasNuclear: true,
    defensebudget: 10, budgetPercentGDP: 3.7,
    globalRank: 9
  },
  
  // European
  DE: { 
    activePersonnel: 184000, reservePersonnel: 30000,
    tanks: 339, armoredVehicles: 4712, artillery: 121,
    aircraft: 617, fighters: 122, helicopters: 266, attackHelicopters: 51,
    navalVessels: 80, submarines: 6, frigates: 7,
    defensebudget: 68, budgetPercentGDP: 1.6,
    globalRank: 16,
    notes: '€100B moderniseringspaket'
  },
  IT: { 
    activePersonnel: 161550, reservePersonnel: 18300,
    tanks: 200, armoredVehicles: 6518, artillery: 108,
    aircraft: 862, fighters: 94, helicopters: 409, attackHelicopters: 59,
    navalVessels: 184, submarines: 8, aircraftCarriers: 2, destroyers: 4, frigates: 11,
    defensebudget: 32, budgetPercentGDP: 1.5,
    globalRank: 10
  },
  PL: { 
    activePersonnel: 114050, reservePersonnel: 0,
    tanks: 612, armoredVehicles: 3050, artillery: 700,
    aircraft: 462, fighters: 48, helicopters: 274, attackHelicopters: 29,
    navalVessels: 83, submarines: 1, frigates: 2,
    defensebudget: 35, budgetPercentGDP: 4.0,
    globalRank: 21,
    notes: 'Massiv upprustning pågår'
  },
  ES: { 
    activePersonnel: 121900, reservePersonnel: 15450,
    tanks: 327, armoredVehicles: 2000, artillery: 63,
    aircraft: 531, fighters: 136, helicopters: 139, attackHelicopters: 24,
    navalVessels: 138, submarines: 4, frigates: 11,
    defensebudget: 17, budgetPercentGDP: 1.3,
    globalRank: 23
  },
  
  // Nordic
  SE: { 
    activePersonnel: 24000, reservePersonnel: 10000,
    tanks: 120, armoredVehicles: 780, artillery: 48,
    aircraft: 205, fighters: 71, helicopters: 145,
    navalVessels: 40, submarines: 5, frigates: 0,
    defensebudget: 10, budgetPercentGDP: 2.4,
    globalRank: 31,
    notes: 'NATO-medlem 2024, upprustning'
  },
  NO: { 
    activePersonnel: 26150, reservePersonnel: 40000,
    tanks: 36, armoredVehicles: 393, artillery: 48,
    aircraft: 149, fighters: 57, helicopters: 54,
    navalVessels: 61, submarines: 6, frigates: 4,
    defensebudget: 9, budgetPercentGDP: 1.8,
    globalRank: 35
  },
  FI: { 
    activePersonnel: 23000, reservePersonnel: 870000,
    tanks: 200, armoredVehicles: 1590, artillery: 700,
    aircraft: 154, fighters: 55, helicopters: 27,
    navalVessels: 270, 
    defensebudget: 6, budgetPercentGDP: 2.4,
    globalRank: 33,
    notes: 'Europas största artilleri'
  },
  DK: { 
    activePersonnel: 17000, reservePersonnel: 63000,
    tanks: 44, armoredVehicles: 316, artillery: 24,
    aircraft: 107, fighters: 30, helicopters: 28,
    navalVessels: 64, submarines: 0, frigates: 6,
    defensebudget: 6, budgetPercentGDP: 2.4,
    globalRank: 40
  },
  
  // Others
  AU: { 
    activePersonnel: 60750, reservePersonnel: 29560,
    tanks: 59, armoredVehicles: 2040, artillery: 75,
    aircraft: 410, fighters: 79, helicopters: 171, attackHelicopters: 22,
    navalVessels: 43, submarines: 6, destroyers: 3, frigates: 8,
    defensebudget: 33, budgetPercentGDP: 2.0,
    globalRank: 14
  },
  BR: { 
    activePersonnel: 366500, reservePersonnel: 1340000,
    tanks: 439, armoredVehicles: 2300, artillery: 900,
    aircraft: 679, fighters: 43, helicopters: 260, attackHelicopters: 12,
    navalVessels: 109, submarines: 7, aircraftCarriers: 1, frigates: 7,
    defensebudget: 22, budgetPercentGDP: 1.2,
    globalRank: 13
  },
  IR: { 
    activePersonnel: 610000, reservePersonnel: 350000, paramilitaryPersonnel: 220000,
    tanks: 1996, armoredVehicles: 2345, artillery: 2168, rocketLaunchers: 1474,
    aircraft: 541, fighters: 142, helicopters: 126, attackHelicopters: 12,
    navalVessels: 398, submarines: 19, frigates: 7,
    defensebudget: 10, budgetPercentGDP: 2.5,
    globalRank: 14,
    notes: 'Ballistiska missiler, drönare'
  },
  SA: { 
    activePersonnel: 257000, reservePersonnel: 0, paramilitaryPersonnel: 24500,
    tanks: 1062, armoredVehicles: 8100, artillery: 490,
    aircraft: 897, fighters: 261, helicopters: 200, attackHelicopters: 36,
    navalVessels: 55, submarines: 0, frigates: 7,
    defensebudget: 75, budgetPercentGDP: 7.1,
    globalRank: 22
  },
  UA: { 
    activePersonnel: 900000, reservePersonnel: 400000,
    tanks: 1700, armoredVehicles: 3500, artillery: 2600,
    aircraft: 146, fighters: 69, helicopters: 121,
    navalVessels: 10, 
    defensebudget: 43, budgetPercentGDP: 37.0,
    globalRank: 18,
    notes: 'Storskaligt krig, västerländskt stöd'
  },
  
  // No military
  IS: { activePersonnel: 0, notes: 'Ingen militär, endast kustbevakning' },
  CR: { activePersonnel: 0, notes: 'Avskaffade militären 1948' },
  PA: { activePersonnel: 0, notes: 'Ingen militär sedan 1990' },
  
  // Minimal
  LU: { activePersonnel: 900, tanks: 0, aircraft: 0, defensebudget: 0.5 },
  MT: { activePersonnel: 1700, tanks: 0, aircraft: 5, navalVessels: 6 },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getMilitaryTier(info: MilitaryInfo): MilitaryTier {
  if (info.activePersonnel === 0) return 'none';
  if (info.nuclearWarheads && info.nuclearWarheads > 1000) return 'superpower';
  if (info.globalRank && info.globalRank <= 5) return 'superpower';
  if (info.globalRank && info.globalRank <= 10) return 'major_power';
  if (info.globalRank && info.globalRank <= 25) return 'regional';
  if (info.activePersonnel > 100000) return 'moderate';
  if (info.activePersonnel > 10000) return 'limited';
  return 'minimal';
}

export function getMilitaryColor(countryCode: string): string {
  const info = MILITARY_DATA[countryCode];
  if (!info) return MILITARY_TIER_CONFIG.unknown.color;
  const tier = getMilitaryTier(info);
  return MILITARY_TIER_CONFIG[tier].color;
}

export function formatNumber(value: number): string {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
  return value.toString();
}

// ============================================================================
// MILITARY LEGEND
// ============================================================================

interface MilitaryLegendProps {
  className?: string;
}

export function MilitaryLegend({ className = '' }: MilitaryLegendProps) {
  const tiers: MilitaryTier[] = ['superpower', 'major_power', 'regional', 'moderate', 'limited', 'minimal', 'none'];

  return (
    <div className={`bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-3 ${className}`}>
      <p className="text-xs font-semibold text-slate-700 mb-2">
        ⚔️ Militär styrka
      </p>
      <div className="flex flex-col gap-1">
        {tiers.map(t => (
          <div key={t} className="flex items-center gap-2">
            <div 
              className="w-4 h-3 rounded-sm" 
              style={{ backgroundColor: MILITARY_TIER_CONFIG[t].color }}
            />
            <span className="text-[10px] text-slate-600">
              {MILITARY_TIER_CONFIG[t].label.sv}
            </span>
          </div>
        ))}
      </div>
      <p className="text-[9px] text-slate-400 mt-2 pt-2 border-t border-slate-100">
        Källa: Global Firepower 2024
      </p>
    </div>
  );
}

// ============================================================================
// MILITARY DIALOG
// ============================================================================

interface MilitaryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  countryCode: string;
  countryName: string;
}

export function MilitaryDialog({ open, onOpenChange, countryCode, countryName }: MilitaryDialogProps) {
  const info = MILITARY_DATA[countryCode];
  
  if (!info) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>⚔️ Försvar i {countryName}</DialogTitle>
            <DialogDescription>Ingen data tillgänglig</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  const tier = getMilitaryTier(info);
  const config = MILITARY_TIER_CONFIG[tier];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">⚔️</span>
            Militär styrka: {countryName}
            {info.globalRank && (
              <span className="ml-2 px-2 py-0.5 bg-slate-100 rounded-full text-xs font-normal">
                #{info.globalRank} globalt
              </span>
            )}
          </DialogTitle>
          <DialogDescription>Militära resurser och kapacitet 2024</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-4 mt-4 pr-4">
            {/* Tier badge */}
            <div 
              className="flex items-center gap-4 p-4 rounded-xl"
              style={{ backgroundColor: `${config.color}20` }}
            >
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
                style={{ backgroundColor: config.color }}
              >
                <span className="text-white text-2xl">⚔️</span>
              </div>
              <div>
                <p className="text-lg font-bold" style={{ color: config.color }}>
                  {config.label.sv}
                </p>
                <p className="text-sm text-slate-600">{config.description}</p>
              </div>
            </div>

            {/* Personnel */}
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs font-semibold text-slate-700 mb-3">👥 Personal</p>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-800">
                    {formatNumber(info.activePersonnel)}
                  </p>
                  <p className="text-xs text-slate-500">Aktiv</p>
                </div>
                {info.reservePersonnel !== undefined && (
                  <div className="text-center">
                    <p className="text-2xl font-bold text-slate-600">
                      {formatNumber(info.reservePersonnel)}
                    </p>
                    <p className="text-xs text-slate-500">Reserv</p>
                  </div>
                )}
                {info.paramilitaryPersonnel !== undefined && (
                  <div className="text-center">
                    <p className="text-2xl font-bold text-slate-500">
                      {formatNumber(info.paramilitaryPersonnel)}
                    </p>
                    <p className="text-xs text-slate-500">Paramilitär</p>
                  </div>
                )}
              </div>
            </div>

            {/* Ground forces */}
            {(info.tanks || info.armoredVehicles || info.artillery) && (
              <div className="bg-amber-50 rounded-xl p-4">
                <p className="text-xs font-semibold text-amber-800 mb-3">🛡️ Markstridskrafter</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {info.tanks !== undefined && (
                    <div className="bg-white rounded-lg p-2 text-center">
                      <p className="text-xl font-bold text-amber-700">{info.tanks.toLocaleString()}</p>
                      <p className="text-xs text-slate-500">🚛 Stridsvagnar</p>
                    </div>
                  )}
                  {info.armoredVehicles !== undefined && (
                    <div className="bg-white rounded-lg p-2 text-center">
                      <p className="text-xl font-bold text-amber-700">{info.armoredVehicles.toLocaleString()}</p>
                      <p className="text-xs text-slate-500">🚐 Pansarfordon</p>
                    </div>
                  )}
                  {info.artillery !== undefined && (
                    <div className="bg-white rounded-lg p-2 text-center">
                      <p className="text-xl font-bold text-amber-700">{info.artillery.toLocaleString()}</p>
                      <p className="text-xs text-slate-500">💣 Artilleri</p>
                    </div>
                  )}
                  {info.rocketLaunchers !== undefined && (
                    <div className="bg-white rounded-lg p-2 text-center">
                      <p className="text-xl font-bold text-amber-700">{info.rocketLaunchers.toLocaleString()}</p>
                      <p className="text-xs text-slate-500">🚀 Raketartilleri</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Air force */}
            {(info.aircraft || info.fighters || info.helicopters) && (
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-xs font-semibold text-blue-800 mb-3">✈️ Flygvapen</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {info.aircraft !== undefined && (
                    <div className="bg-white rounded-lg p-2 text-center">
                      <p className="text-xl font-bold text-blue-700">{info.aircraft.toLocaleString()}</p>
                      <p className="text-xs text-slate-500">✈️ Totalt flygplan</p>
                    </div>
                  )}
                  {info.fighters !== undefined && (
                    <div className="bg-white rounded-lg p-2 text-center">
                      <p className="text-xl font-bold text-blue-700">{info.fighters.toLocaleString()}</p>
                      <p className="text-xs text-slate-500">🛩️ Stridsflygplan</p>
                    </div>
                  )}
                  {info.helicopters !== undefined && (
                    <div className="bg-white rounded-lg p-2 text-center">
                      <p className="text-xl font-bold text-blue-700">{info.helicopters.toLocaleString()}</p>
                      <p className="text-xs text-slate-500">🚁 Helikoptrar</p>
                    </div>
                  )}
                  {info.attackHelicopters !== undefined && (
                    <div className="bg-white rounded-lg p-2 text-center">
                      <p className="text-xl font-bold text-blue-700">{info.attackHelicopters.toLocaleString()}</p>
                      <p className="text-xs text-slate-500">🚁 Attackhelikoptrar</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Navy */}
            {(info.navalVessels || info.submarines) && (
              <div className="bg-cyan-50 rounded-xl p-4">
                <p className="text-xs font-semibold text-cyan-800 mb-3">⚓ Marin</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {info.navalVessels !== undefined && (
                    <div className="bg-white rounded-lg p-2 text-center">
                      <p className="text-xl font-bold text-cyan-700">{info.navalVessels.toLocaleString()}</p>
                      <p className="text-xs text-slate-500">🚢 Fartyg totalt</p>
                    </div>
                  )}
                  {info.submarines !== undefined && (
                    <div className="bg-white rounded-lg p-2 text-center">
                      <p className="text-xl font-bold text-cyan-700">{info.submarines}</p>
                      <p className="text-xs text-slate-500">🔱 Ubåtar</p>
                    </div>
                  )}
                  {info.aircraftCarriers !== undefined && info.aircraftCarriers > 0 && (
                    <div className="bg-white rounded-lg p-2 text-center">
                      <p className="text-xl font-bold text-cyan-700">{info.aircraftCarriers}</p>
                      <p className="text-xs text-slate-500">🛳️ Hangarfartyg</p>
                    </div>
                  )}
                  {info.destroyers !== undefined && (
                    <div className="bg-white rounded-lg p-2 text-center">
                      <p className="text-xl font-bold text-cyan-700">{info.destroyers}</p>
                      <p className="text-xs text-slate-500">⚔️ Jagare</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Nuclear */}
            {info.hasNuclear && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-xs font-semibold text-red-800 mb-3">☢️ Kärnvapenkapacitet</p>
                <div className="grid grid-cols-2 gap-3">
                  {info.nuclearWarheads !== undefined && (
                    <div className="bg-white rounded-lg p-3 text-center">
                      <p className="text-3xl font-bold text-red-700">{info.nuclearWarheads.toLocaleString()}</p>
                      <p className="text-xs text-slate-500">Kärnstridsspetsar</p>
                    </div>
                  )}
                  {info.icbm !== undefined && (
                    <div className="bg-white rounded-lg p-3 text-center">
                      <p className="text-3xl font-bold text-red-700">{info.icbm}</p>
                      <p className="text-xs text-slate-500">ICBM (interkontinentala)</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Budget */}
            {info.defensebudget && (
              <div className="bg-green-50 rounded-xl p-4">
                <p className="text-xs font-semibold text-green-800 mb-3">💵 Försvarsbudget</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-green-700">${info.defensebudget}B</p>
                    <p className="text-xs text-slate-500">Årlig budget (USD)</p>
                  </div>
                  {info.budgetPercentGDP && (
                    <div className="bg-white rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-green-700">{info.budgetPercentGDP}%</p>
                      <p className="text-xs text-slate-500">Andel av BNP</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Notes */}
            {info.notes && (
              <div className="border border-amber-200 bg-amber-50 rounded-xl p-3">
                <p className="text-xs text-amber-700">📋 {info.notes}</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default MilitaryLegend;
