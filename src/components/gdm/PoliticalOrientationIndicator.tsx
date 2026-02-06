/**
 * POLITICAL ORIENTATION INDICATOR
 * 
 * Visualizes political orientation of governments:
 * - Blue = Right/Conservative
 * - Red = Left/Socialist
 * - Yellow/Orange = Center/Liberal
 */

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

// ============================================================================
// TYPES
// ============================================================================

export type PoliticalOrientation = 
  | 'far_left'      // Communist/Socialist
  | 'left'          // Social Democrat
  | 'center_left'   // Liberal-Left
  | 'center'        // Centrist
  | 'center_right'  // Liberal-Right
  | 'right'         // Conservative
  | 'far_right'     // Nationalist
  | 'authoritarian' // Non-democratic
  | 'unknown';

export interface PoliticalInfo {
  orientation: PoliticalOrientation;
  party?: string;
  leader?: string;
  since?: number;
  coalition?: string[];
  notes?: string;
}

// ============================================================================
// ORIENTATION CONFIG
// ============================================================================

export const ORIENTATION_CONFIG: Record<PoliticalOrientation, {
  label: { sv: string; en: string };
  color: string;
  description: string;
}> = {
  far_left: { 
    label: { sv: 'Vänsterradikal', en: 'Far Left' }, 
    color: '#991B1B', // Dark red
    description: 'Kommunistisk/socialistisk politik'
  },
  left: { 
    label: { sv: 'Vänster', en: 'Left' }, 
    color: '#DC2626', // Red
    description: 'Socialdemokratisk politik'
  },
  center_left: { 
    label: { sv: 'Mittvänster', en: 'Center-Left' }, 
    color: '#F97316', // Orange
    description: 'Liberal-vänster politik'
  },
  center: { 
    label: { sv: 'Mitten', en: 'Center' }, 
    color: '#FBBF24', // Yellow
    description: 'Centristisk politik'
  },
  center_right: { 
    label: { sv: 'Mitthöger', en: 'Center-Right' }, 
    color: '#60A5FA', // Light blue
    description: 'Liberal-höger politik'
  },
  right: { 
    label: { sv: 'Höger', en: 'Right' }, 
    color: '#2563EB', // Blue
    description: 'Konservativ politik'
  },
  far_right: { 
    label: { sv: 'Högerradikal', en: 'Far Right' }, 
    color: '#1E3A8A', // Dark blue
    description: 'Nationalistisk politik'
  },
  authoritarian: { 
    label: { sv: 'Auktoritär', en: 'Authoritarian' }, 
    color: '#4B5563', // Gray
    description: 'Icke-demokratiskt styre'
  },
  unknown: { 
    label: { sv: 'Okänd', en: 'Unknown' }, 
    color: '#9CA3AF', 
    description: 'Ingen data'
  },
};

// ============================================================================
// POLITICAL DATA BY COUNTRY (2024)
// ============================================================================

export const POLITICAL_DATA: Record<string, PoliticalInfo> = {
  // Nordic countries
  SE: { orientation: 'center_right', party: 'Moderaterna', leader: 'Ulf Kristersson', since: 2022, coalition: ['KD', 'L'], notes: 'Stöd av SD' },
  NO: { orientation: 'center_left', party: 'Arbeiderpartiet', leader: 'Jonas Gahr Støre', since: 2021 },
  DK: { orientation: 'center', party: 'Socialdemokraterne', leader: 'Mette Frederiksen', since: 2019, notes: 'Bred koalition' },
  FI: { orientation: 'center_right', party: 'Samlingspartiet', leader: 'Petteri Orpo', since: 2023 },
  IS: { orientation: 'center_left', party: 'Självständighetspartiet', leader: 'Bjarni Benediktsson', since: 2024 },
  
  // Western Europe
  DE: { orientation: 'center_left', party: 'SPD', leader: 'Olaf Scholz', since: 2021, coalition: ['Grüne', 'FDP'] },
  FR: { orientation: 'center', party: 'Renaissance', leader: 'Emmanuel Macron', since: 2017 },
  GB: { orientation: 'left', party: 'Labour', leader: 'Keir Starmer', since: 2024 },
  NL: { orientation: 'far_right', party: 'PVV', leader: 'Geert Wilders', since: 2024, notes: 'Koalitionsregering' },
  BE: { orientation: 'center_right', party: 'MR', leader: 'Alexander De Croo', since: 2020 },
  AT: { orientation: 'center_right', party: 'ÖVP', leader: 'Karl Nehammer', since: 2021 },
  CH: { orientation: 'center', notes: 'Konsensusregering med alla stora partier' },
  LU: { orientation: 'center_right', party: 'CSV', leader: 'Luc Frieden', since: 2023 },
  
  // Southern Europe
  IT: { orientation: 'right', party: 'Fratelli d\'Italia', leader: 'Giorgia Meloni', since: 2022 },
  ES: { orientation: 'left', party: 'PSOE', leader: 'Pedro Sánchez', since: 2018 },
  PT: { orientation: 'center_right', party: 'AD', leader: 'Luís Montenegro', since: 2024 },
  GR: { orientation: 'center_right', party: 'Nea Dimokratia', leader: 'Kyriakos Mitsotakis', since: 2019 },
  
  // Eastern Europe
  PL: { orientation: 'center', party: 'KO', leader: 'Donald Tusk', since: 2023 },
  CZ: { orientation: 'center_right', party: 'ODS', leader: 'Petr Fiala', since: 2021 },
  HU: { orientation: 'far_right', party: 'Fidesz', leader: 'Viktor Orbán', since: 2010, notes: 'Nationalkonservativ' },
  SK: { orientation: 'left', party: 'SMER', leader: 'Robert Fico', since: 2023 },
  RO: { orientation: 'center_left', party: 'PSD', leader: 'Marcel Ciolacu', since: 2023 },
  BG: { orientation: 'center', party: 'GERB', leader: 'Nikolai Denkov', since: 2023 },
  HR: { orientation: 'center_right', party: 'HDZ', leader: 'Andrej Plenković', since: 2016 },
  SI: { orientation: 'center_left', party: 'GS', leader: 'Robert Golob', since: 2022 },
  
  // Baltic states
  EE: { orientation: 'center_right', party: 'Reformierakond', leader: 'Kaja Kallas', since: 2021 },
  LV: { orientation: 'center_right', party: 'JV', leader: 'Evika Siliņa', since: 2023 },
  LT: { orientation: 'center_right', party: 'TS-LKD', leader: 'Ingrida Šimonytė', since: 2020 },
  
  // Americas
  US: { orientation: 'right', party: 'Republican', leader: 'Donald Trump', since: 2025 },
  CA: { orientation: 'center_left', party: 'Liberal Party', leader: 'Mark Carney', since: 2025 },
  MX: { orientation: 'left', party: 'MORENA', leader: 'Claudia Sheinbaum', since: 2024 },
  BR: { orientation: 'left', party: 'PT', leader: 'Lula da Silva', since: 2023 },
  AR: { orientation: 'far_right', party: 'La Libertad Avanza', leader: 'Javier Milei', since: 2023, notes: 'Libertarian' },
  CL: { orientation: 'left', party: 'Convergencia Social', leader: 'Gabriel Boric', since: 2022 },
  CO: { orientation: 'left', party: 'Pacto Histórico', leader: 'Gustavo Petro', since: 2022 },
  VE: { orientation: 'far_left', party: 'PSUV', leader: 'Nicolás Maduro', since: 2013, notes: 'Omtvistat val' },
  CU: { orientation: 'far_left', party: 'PCC', leader: 'Miguel Díaz-Canel', since: 2018, notes: 'Enpartisystem' },
  
  // Asia
  CN: { orientation: 'authoritarian', party: 'CCP', leader: 'Xi Jinping', since: 2012, notes: 'Kommunistiskt enpartistyre' },
  JP: { orientation: 'right', party: 'LDP', leader: 'Shigeru Ishiba', since: 2024 },
  KR: { orientation: 'center_right', party: 'PPP', leader: 'Yoon Suk-yeol', since: 2022 },
  IN: { orientation: 'right', party: 'BJP', leader: 'Narendra Modi', since: 2014, notes: 'Hinduisk nationalism' },
  ID: { orientation: 'center', party: 'Gerindra', leader: 'Prabowo Subianto', since: 2024 },
  TH: { orientation: 'center', party: 'Pheu Thai', leader: 'Paetongtarn Shinawatra', since: 2024 },
  VN: { orientation: 'far_left', party: 'CPV', leader: 'Tô Lâm', since: 2024, notes: 'Kommunistiskt enpartistyre' },
  PH: { orientation: 'center', party: 'PFP', leader: 'Bongbong Marcos', since: 2022 },
  MY: { orientation: 'center', party: 'PH', leader: 'Anwar Ibrahim', since: 2022 },
  SG: { orientation: 'center_right', party: 'PAP', leader: 'Lawrence Wong', since: 2024 },
  PK: { orientation: 'center_right', party: 'PML-N', leader: 'Shehbaz Sharif', since: 2024 },
  BD: { orientation: 'center', leader: 'Muhammad Yunus', since: 2024, notes: 'Interimsregering' },
  
  // Middle East
  IL: { orientation: 'far_right', party: 'Likud', leader: 'Benjamin Netanyahu', since: 2022, notes: 'Nationalistisk koalition' },
  TR: { orientation: 'right', party: 'AKP', leader: 'Recep Tayyip Erdoğan', since: 2003 },
  SA: { orientation: 'authoritarian', leader: 'Mohammed bin Salman', notes: 'Absolut monarki' },
  AE: { orientation: 'authoritarian', leader: 'Mohammed bin Zayed', notes: 'Federala emirat' },
  IR: { orientation: 'authoritarian', leader: 'Masoud Pezeshkian', since: 2024, notes: 'Teokrati' },
  IQ: { orientation: 'center', party: 'State of Law', leader: 'Mohammed Shia al-Sudani', since: 2022 },
  EG: { orientation: 'authoritarian', leader: 'Abdel Fattah el-Sisi', since: 2014 },
  
  // Africa
  ZA: { orientation: 'center_left', party: 'ANC', leader: 'Cyril Ramaphosa', since: 2018 },
  NG: { orientation: 'center_right', party: 'APC', leader: 'Bola Tinubu', since: 2023 },
  KE: { orientation: 'center_right', party: 'UDA', leader: 'William Ruto', since: 2022 },
  ET: { orientation: 'center', party: 'PP', leader: 'Abiy Ahmed', since: 2018 },
  MA: { orientation: 'center_right', party: 'RNI', leader: 'Aziz Akhannouch', since: 2021 },
  
  // Oceania
  AU: { orientation: 'center_left', party: 'Labor', leader: 'Anthony Albanese', since: 2022 },
  NZ: { orientation: 'center_right', party: 'National', leader: 'Christopher Luxon', since: 2023 },
  
  // Russia & former Soviet
  RU: { orientation: 'authoritarian', party: 'United Russia', leader: 'Vladimir Putin', since: 2000, notes: 'Auktoritär stat' },
  UA: { orientation: 'center', party: 'Servant of the People', leader: 'Volodymyr Zelenskyy', since: 2019 },
  BY: { orientation: 'authoritarian', leader: 'Alexander Lukashenko', since: 1994, notes: 'Diktatur' },
  KZ: { orientation: 'authoritarian', leader: 'Kassym-Jomart Tokayev', since: 2019 },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getPoliticalColor(countryCode: string): string {
  const info = POLITICAL_DATA[countryCode];
  if (!info) return ORIENTATION_CONFIG.unknown.color;
  return ORIENTATION_CONFIG[info.orientation].color;
}

export function getPoliticalInfo(countryCode: string): PoliticalInfo | null {
  return POLITICAL_DATA[countryCode] || null;
}

// ============================================================================
// POLITICAL LEGEND
// ============================================================================

interface PoliticalLegendProps {
  className?: string;
}

export function PoliticalLegend({ className = '' }: PoliticalLegendProps) {
  const orientations: PoliticalOrientation[] = [
    'far_left', 'left', 'center_left', 'center', 'center_right', 'right', 'far_right', 'authoritarian'
  ];

  return (
    <div className={`bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-3 ${className}`}>
      <p className="text-xs font-semibold text-slate-700 mb-2">
        🏛️ Politisk orientering
      </p>
      <div className="flex flex-col gap-1">
        {orientations.map(o => (
          <div key={o} className="flex items-center gap-2">
            <div 
              className="w-4 h-3 rounded-sm" 
              style={{ backgroundColor: ORIENTATION_CONFIG[o].color }}
            />
            <span className="text-[10px] text-slate-600">
              {ORIENTATION_CONFIG[o].label.sv}
            </span>
          </div>
        ))}
      </div>
      <p className="text-[9px] text-slate-400 mt-2 pt-2 border-t border-slate-100">
        Baserat på regerande parti 2024
      </p>
    </div>
  );
}

// ============================================================================
// POLITICAL DIALOG
// ============================================================================

interface PoliticalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  countryCode: string;
  countryName: string;
}

export function PoliticalDialog({ open, onOpenChange, countryCode, countryName }: PoliticalDialogProps) {
  const info = POLITICAL_DATA[countryCode];
  
  if (!info) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>🏛️ Politik i {countryName}</DialogTitle>
            <DialogDescription>Ingen data tillgänglig</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  const config = ORIENTATION_CONFIG[info.orientation];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">🏛️</span>
            Politisk orientering: {countryName}
          </DialogTitle>
          <DialogDescription>{config.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Orientation badge */}
          <div 
            className="flex items-center gap-4 p-4 rounded-xl"
            style={{ backgroundColor: `${config.color}20` }}
          >
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
              style={{ backgroundColor: config.color }}
            >
              <span className="text-white text-3xl">🏛️</span>
            </div>
            <div>
              <p className="text-lg font-bold" style={{ color: config.color }}>
                {config.label.sv}
              </p>
              {info.party && (
                <p className="text-sm text-slate-600">{info.party}</p>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-3">
            {info.leader && (
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-xs font-medium text-slate-500 mb-1">👤 Ledare</p>
                <p className="text-sm font-semibold text-slate-800">{info.leader}</p>
              </div>
            )}
            {info.since && (
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-xs font-medium text-slate-500 mb-1">📅 Vid makten sedan</p>
                <p className="text-sm font-semibold text-slate-800">{info.since}</p>
              </div>
            )}
          </div>

          {/* Coalition */}
          {info.coalition && info.coalition.length > 0 && (
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-xs font-medium text-slate-500 mb-2">🤝 Koalitionspartier</p>
              <div className="flex flex-wrap gap-1">
                {info.coalition.map(p => (
                  <span key={p} className="px-2 py-1 bg-white rounded-full text-xs text-slate-700 border">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {info.notes && (
            <div className="border border-slate-200 rounded-xl p-3">
              <p className="text-xs font-medium text-slate-700 mb-1">📋 Anmärkning</p>
              <p className="text-sm text-slate-600">{info.notes}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default PoliticalLegend;
