/**
 * REGION INDICATOR MODULE
 * 
 * Visualizes different region types on the map:
 * - Continents (world parts)
 * - Political blocs (EU, NATO, BRICS, etc.)
 * - Economic zones (World Bank income classification)
 */

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

// ============================================================================
// REGION TYPES
// ============================================================================

export type RegionType = 'continent' | 'political' | 'economic';

export interface RegionInfo {
  code: string;
  name: { sv: string; en: string };
  color: string;
  countries: string[];
  description?: string;
}

// ============================================================================
// CONTINENTS
// ============================================================================

export const CONTINENTS: Record<string, RegionInfo> = {
  EU: {
    code: 'EU',
    name: { sv: 'Europa', en: 'Europe' },
    color: '#3B82F6', // Blue
    countries: ['SE', 'NO', 'DK', 'FI', 'IS', 'DE', 'FR', 'GB', 'IT', 'ES', 'PT', 'NL', 'BE', 'AT', 'CH', 'PL', 'CZ', 'HU', 'RO', 'BG', 'GR', 'HR', 'SK', 'SI', 'LT', 'LV', 'EE', 'IE', 'LU', 'MT', 'CY', 'UA', 'BY', 'MD', 'RS', 'BA', 'ME', 'MK', 'AL', 'XK'],
  },
  AS: {
    code: 'AS',
    name: { sv: 'Asien', en: 'Asia' },
    color: '#EF4444', // Red
    countries: ['CN', 'JP', 'KR', 'IN', 'ID', 'TH', 'VN', 'PH', 'MY', 'SG', 'TW', 'HK', 'PK', 'BD', 'LK', 'NP', 'MM', 'KH', 'LA', 'MN', 'KZ', 'UZ', 'TM', 'KG', 'TJ', 'AF', 'IR', 'IQ', 'SA', 'AE', 'IL', 'TR', 'SY', 'JO', 'LB', 'YE', 'OM', 'KW', 'QA', 'BH'],
  },
  AF: {
    code: 'AF',
    name: { sv: 'Afrika', en: 'Africa' },
    color: '#F59E0B', // Amber
    countries: ['ZA', 'NG', 'EG', 'KE', 'ET', 'GH', 'TZ', 'UG', 'DZ', 'MA', 'TN', 'LY', 'SD', 'SN', 'CI', 'CM', 'AO', 'MZ', 'MG', 'ZW', 'ZM', 'BW', 'NA', 'RW', 'MW', 'ML', 'NE', 'BF', 'TD', 'SO', 'CD', 'CG', 'GA', 'GQ', 'CF', 'SS', 'ER', 'DJ', 'MU', 'SC', 'CV', 'GM', 'GW', 'SL', 'LR', 'TG', 'BJ', 'BI', 'LS', 'SZ', 'KM', 'ST'],
  },
  NA: {
    code: 'NA',
    name: { sv: 'Nordamerika', en: 'North America' },
    color: '#10B981', // Emerald
    countries: ['US', 'CA', 'MX', 'GT', 'BZ', 'HN', 'SV', 'NI', 'CR', 'PA', 'CU', 'JM', 'HT', 'DO', 'PR', 'BS', 'BB', 'TT', 'GD', 'VC', 'LC', 'DM', 'AG', 'KN'],
  },
  SA: {
    code: 'SA',
    name: { sv: 'Sydamerika', en: 'South America' },
    color: '#8B5CF6', // Violet
    countries: ['BR', 'AR', 'CO', 'PE', 'VE', 'CL', 'EC', 'BO', 'PY', 'UY', 'GY', 'SR', 'GF'],
  },
  OC: {
    code: 'OC',
    name: { sv: 'Oceanien', en: 'Oceania' },
    color: '#06B6D4', // Cyan
    countries: ['AU', 'NZ', 'PG', 'FJ', 'SB', 'VU', 'NC', 'PF', 'WS', 'TO', 'FM', 'KI', 'MH', 'PW', 'NR', 'TV'],
  },
};

// ============================================================================
// POLITICAL BLOCS
// ============================================================================

export const POLITICAL_BLOCS: Record<string, RegionInfo> = {
  EU_BLOC: {
    code: 'EU_BLOC',
    name: { sv: 'Europeiska unionen', en: 'European Union' },
    color: '#1E40AF', // Dark blue
    countries: ['DE', 'FR', 'IT', 'ES', 'PL', 'RO', 'NL', 'BE', 'CZ', 'GR', 'PT', 'SE', 'HU', 'AT', 'BG', 'DK', 'FI', 'SK', 'IE', 'HR', 'LT', 'SI', 'LV', 'EE', 'CY', 'LU', 'MT'],
    description: '27 medlemsländer, politisk och ekonomisk union',
  },
  NATO: {
    code: 'NATO',
    name: { sv: 'NATO', en: 'NATO' },
    color: '#0EA5E9', // Sky blue
    countries: ['US', 'CA', 'GB', 'FR', 'DE', 'IT', 'ES', 'PL', 'TR', 'NL', 'BE', 'DK', 'NO', 'PT', 'GR', 'CZ', 'HU', 'RO', 'BG', 'SK', 'SI', 'HR', 'AL', 'LT', 'LV', 'EE', 'MK', 'ME', 'FI', 'SE', 'IS', 'LU'],
    description: 'Nordatlantiska fördraget - 32 medlemsländer',
  },
  BRICS: {
    code: 'BRICS',
    name: { sv: 'BRICS+', en: 'BRICS+' },
    color: '#DC2626', // Red
    countries: ['BR', 'RU', 'IN', 'CN', 'ZA', 'EG', 'ET', 'IR', 'SA', 'AE'],
    description: 'Ursprungligen Brasilien, Ryssland, Indien, Kina, Sydafrika + nya medlemmar',
  },
  G7: {
    code: 'G7',
    name: { sv: 'G7', en: 'G7' },
    color: '#7C3AED', // Purple
    countries: ['US', 'CA', 'GB', 'FR', 'DE', 'IT', 'JP'],
    description: 'De sju största avancerade ekonomierna',
  },
  G20: {
    code: 'G20',
    name: { sv: 'G20', en: 'G20' },
    color: '#059669', // Emerald
    countries: ['US', 'CA', 'MX', 'BR', 'AR', 'GB', 'FR', 'DE', 'IT', 'ES', 'RU', 'TR', 'SA', 'ZA', 'IN', 'CN', 'JP', 'KR', 'ID', 'AU'],
    description: '19 länder + EU - de största ekonomierna',
  },
  ASEAN: {
    code: 'ASEAN',
    name: { sv: 'ASEAN', en: 'ASEAN' },
    color: '#F97316', // Orange
    countries: ['ID', 'MY', 'PH', 'SG', 'TH', 'BN', 'VN', 'LA', 'MM', 'KH'],
    description: 'Sydostasiens nationförbund - 10 medlemmar',
  },
  AU_BLOC: {
    code: 'AU_BLOC',
    name: { sv: 'Afrikanska unionen', en: 'African Union' },
    color: '#65A30D', // Lime
    countries: ['ZA', 'NG', 'EG', 'KE', 'ET', 'GH', 'TZ', 'UG', 'DZ', 'MA', 'TN', 'SN', 'CI', 'CM', 'AO', 'MZ', 'MG', 'ZW', 'ZM', 'BW', 'NA', 'RW', 'MW', 'ML', 'NE', 'BF', 'TD', 'CD', 'CG'],
    description: '55 afrikanska länder',
  },
  COMMONWEALTH: {
    code: 'COMMONWEALTH',
    name: { sv: 'Samväldet', en: 'Commonwealth' },
    color: '#BE185D', // Pink
    countries: ['GB', 'CA', 'AU', 'NZ', 'IN', 'ZA', 'NG', 'KE', 'GH', 'MY', 'SG', 'PK', 'BD', 'JM', 'TT', 'MT', 'CY'],
    description: 'Brittiska samväldet - 56 nationer',
  },
  NON_ALIGNED: {
    code: 'NON_ALIGNED',
    name: { sv: 'Icke-allierade', en: 'Non-aligned' },
    color: '#6B7280', // Gray
    countries: ['CH', 'AT', 'IE', 'RS', 'BA', 'MD', 'AZ', 'AM', 'GE', 'TM'],
    description: 'Militärt neutrala eller icke-allierade länder',
  },
};

// ============================================================================
// ECONOMIC ZONES (World Bank classification)
// ============================================================================

export const ECONOMIC_ZONES: Record<string, RegionInfo> = {
  HIGH_INCOME: {
    code: 'HIGH_INCOME',
    name: { sv: 'Höginkomstländer', en: 'High Income' },
    color: '#1E40AF', // Dark blue
    countries: ['US', 'CA', 'GB', 'FR', 'DE', 'IT', 'ES', 'JP', 'KR', 'AU', 'NZ', 'SE', 'NO', 'DK', 'FI', 'NL', 'BE', 'AT', 'CH', 'IE', 'SG', 'HK', 'IL', 'AE', 'SA', 'QA', 'KW', 'BH', 'PT', 'GR', 'CZ', 'PL', 'HU', 'SK', 'SI', 'EE', 'LT', 'LV', 'HR', 'CY', 'MT', 'LU', 'IS'],
    description: 'BNI per capita > $14,005 (Världsbanken 2024)',
  },
  UPPER_MIDDLE: {
    code: 'UPPER_MIDDLE',
    name: { sv: 'Övre medelinkomst', en: 'Upper Middle Income' },
    color: '#3B82F6', // Blue
    countries: ['CN', 'BR', 'MX', 'TR', 'TH', 'MY', 'RO', 'BG', 'RS', 'CO', 'PE', 'AR', 'CL', 'ZA', 'JO', 'LB', 'IQ', 'LY', 'DZ', 'GA', 'BW', 'NA', 'MU', 'DO', 'JM', 'CR', 'PA', 'EC', 'AZ', 'KZ', 'TM', 'GE', 'AM', 'AL', 'MK', 'ME', 'BA', 'BY', 'RU'],
    description: 'BNI per capita $4,516-$14,005',
  },
  LOWER_MIDDLE: {
    code: 'LOWER_MIDDLE',
    name: { sv: 'Lägre medelinkomst', en: 'Lower Middle Income' },
    color: '#F59E0B', // Amber
    countries: ['IN', 'ID', 'PH', 'VN', 'UA', 'EG', 'MA', 'NG', 'KE', 'GH', 'CI', 'SN', 'CM', 'ZM', 'ZW', 'TZ', 'UG', 'BD', 'PK', 'LK', 'MM', 'KH', 'LA', 'NP', 'MN', 'UZ', 'KG', 'TJ', 'BO', 'HN', 'NI', 'SV', 'GT'],
    description: 'BNI per capita $1,146-$4,515',
  },
  LOW_INCOME: {
    code: 'LOW_INCOME',
    name: { sv: 'Låginkomstländer', en: 'Low Income' },
    color: '#DC2626', // Red
    countries: ['AF', 'ET', 'CD', 'SD', 'SS', 'SO', 'YE', 'SY', 'HT', 'NE', 'ML', 'BF', 'TD', 'CF', 'ER', 'MW', 'MZ', 'MG', 'RW', 'BI', 'SL', 'LR', 'GM', 'GW', 'TG'],
    description: 'BNI per capita < $1,145',
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getRegionData(type: RegionType): Record<string, RegionInfo> {
  switch (type) {
    case 'continent': return CONTINENTS;
    case 'political': return POLITICAL_BLOCS;
    case 'economic': return ECONOMIC_ZONES;
  }
}

export function getCountryRegion(countryCode: string, type: RegionType): RegionInfo | null {
  const regions = getRegionData(type);
  for (const region of Object.values(regions)) {
    if (region.countries.includes(countryCode)) {
      return region;
    }
  }
  return null;
}

export function getRegionColor(countryCode: string, type: RegionType): string {
  const region = getCountryRegion(countryCode, type);
  return region?.color || '#9CA3AF';
}

// ============================================================================
// REGION LEGEND COMPONENT
// ============================================================================

interface RegionLegendProps {
  regionType: RegionType;
  className?: string;
}

export function RegionLegend({ regionType, className = '' }: RegionLegendProps) {
  const regions = getRegionData(regionType);
  const title = {
    continent: '🌍 Världsdelar',
    political: '🏛️ Politiska block',
    economic: '💰 Ekonomiska zoner',
  }[regionType];

  return (
    <div className={`bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-3 ${className}`}>
      <p className="text-xs font-semibold text-slate-700 mb-2">{title}</p>
      <div className="flex flex-col gap-1">
        {Object.values(regions).map(r => (
          <div key={r.code} className="flex items-center gap-2">
            <div 
              className="w-4 h-3 rounded-sm" 
              style={{ backgroundColor: r.color }}
            />
            <span className="text-[10px] text-slate-600">{r.name.sv}</span>
            <span className="text-[9px] text-slate-400 ml-auto">{r.countries.length}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// REGION TYPE SELECTOR
// ============================================================================

interface RegionTypeSelectorProps {
  selected: RegionType | null;
  onChange: (type: RegionType | null) => void;
  className?: string;
}

export function RegionTypeSelector({ selected, onChange, className = '' }: RegionTypeSelectorProps) {
  const options: { type: RegionType; icon: string; label: string }[] = [
    { type: 'continent', icon: '🌍', label: 'Världsdelar' },
    { type: 'political', icon: '🏛️', label: 'Politiska block' },
    { type: 'economic', icon: '💰', label: 'Ekonomiska zoner' },
  ];

  return (
    <div className={`flex gap-1 ${className}`}>
      {options.map(opt => (
        <button
          key={opt.type}
          onClick={() => onChange(selected === opt.type ? null : opt.type)}
          className={`
            px-3 py-1.5 rounded-lg text-xs font-medium transition-all
            ${selected === opt.type 
              ? 'bg-slate-800 text-white shadow-md' 
              : 'bg-white/90 text-slate-700 hover:bg-white'}
          `}
        >
          <span className="mr-1">{opt.icon}</span>
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ============================================================================
// REGION INFO DIALOG
// ============================================================================

interface RegionInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  region: RegionInfo | null;
  regionType: RegionType;
}

export function RegionInfoDialog({ open, onOpenChange, region, regionType }: RegionInfoDialogProps) {
  if (!region) return null;

  const typeLabel = {
    continent: 'Världsdel',
    political: 'Politiskt block',
    economic: 'Ekonomisk zon',
  }[regionType];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div 
              className="w-4 h-4 rounded-full" 
              style={{ backgroundColor: region.color }}
            />
            {region.name.sv}
          </DialogTitle>
          <DialogDescription>{typeLabel}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {region.description && (
            <p className="text-sm text-slate-600">{region.description}</p>
          )}

          <div className="bg-slate-50 rounded-xl p-3">
            <p className="text-xs font-medium text-slate-700 mb-2">
              🏳️ Medlemsländer ({region.countries.length})
            </p>
            <div className="flex flex-wrap gap-1">
              {region.countries.slice(0, 20).map(code => (
                <span 
                  key={code}
                  className="px-2 py-0.5 bg-white rounded text-xs text-slate-600 border border-slate-200"
                >
                  {code}
                </span>
              ))}
              {region.countries.length > 20 && (
                <span className="px-2 py-0.5 text-xs text-slate-400">
                  +{region.countries.length - 20} till
                </span>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default RegionLegend;
