/**
 * GEOPOLITICAL CONTEXT
 * 
 * Shows clear, transparent geopolitical relationships:
 * - Military alliances (NATO, CSTO, etc.)
 * - Political blocs (EU, AU, ASEAN, etc.)
 * - Trade agreements (USMCA, RCEP, etc.)
 * - Colonial history (colonizer/colonized)
 * - Current dependencies & territories
 * - Strategic partnerships
 */

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { getFlag } from './HierarchicalMarkers';

// ============================================================================
// TYPES
// ============================================================================

export type AllianceType = 'military' | 'political' | 'economic' | 'regional';
export type RelationshipType = 'ally' | 'partner' | 'rival' | 'neutral' | 'dependent' | 'colonizer' | 'former_colony';

export interface Alliance {
  id: string;
  name: string;
  type: AllianceType;
  icon: string;
  color: string;
  members: string[]; // country codes
  founded: number;
  description: string;
}

export interface ColonialHistory {
  colonizer: string;
  period: { start: number; end: number };
  type: 'colony' | 'protectorate' | 'mandate' | 'occupation';
}

export interface CountryGeopolitics {
  code: string;
  alliances: string[]; // alliance IDs
  colonialHistory?: ColonialHistory[];
  currentDependencies?: string[]; // country codes this country controls
  dependentOf?: string; // if this is a territory/dependency
  rivals?: string[];
  strategicPartners?: string[];
  nuclearStatus?: 'weapon_state' | 'sharing' | 'non_nuclear';
  unSecurityCouncil?: 'permanent' | 'non_permanent' | 'none';
}

// ============================================================================
// ALLIANCE DATABASE
// ============================================================================

export const ALLIANCES: Record<string, Alliance> = {
  nato: {
    id: 'nato',
    name: 'NATO',
    type: 'military',
    icon: '🛡️',
    color: '#004990',
    founded: 1949,
    members: ['US', 'GB', 'FR', 'DE', 'IT', 'CA', 'TR', 'NO', 'DK', 'NL', 'BE', 'LU', 'PT', 'ES', 'GR', 'PL', 'CZ', 'HU', 'SK', 'SI', 'HR', 'AL', 'ME', 'MK', 'BG', 'RO', 'EE', 'LV', 'LT', 'FI', 'SE'],
    description: 'Nordatlantiska fördraget – militär försvarsallians',
  },
  eu: {
    id: 'eu',
    name: 'EU',
    type: 'political',
    icon: '🇪🇺',
    color: '#003399',
    founded: 1993,
    members: ['DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'SE', 'DK', 'FI', 'IE', 'PT', 'GR', 'PL', 'CZ', 'HU', 'SK', 'SI', 'HR', 'BG', 'RO', 'EE', 'LV', 'LT', 'CY', 'MT', 'LU'],
    description: 'Europeiska unionen – politisk och ekonomisk union',
  },
  brics: {
    id: 'brics',
    name: 'BRICS+',
    type: 'economic',
    icon: '🌍',
    color: '#2E7D32',
    founded: 2009,
    members: ['BR', 'RU', 'IN', 'CN', 'ZA', 'EG', 'ET', 'IR', 'SA', 'AE'],
    description: 'Ekonomiskt samarbete mellan tillväxtekonomier',
  },
  csto: {
    id: 'csto',
    name: 'CSTO',
    type: 'military',
    icon: '⚔️',
    color: '#B71C1C',
    founded: 2002,
    members: ['RU', 'BY', 'AM', 'KZ', 'KG', 'TJ'],
    description: 'Kollektiva säkerhetsfördraget – Rysslandsledd militärallians',
  },
  asean: {
    id: 'asean',
    name: 'ASEAN',
    type: 'regional',
    icon: '🌏',
    color: '#1565C0',
    founded: 1967,
    members: ['ID', 'MY', 'PH', 'SG', 'TH', 'BN', 'VN', 'LA', 'MM', 'KH'],
    description: 'Sydostasiatiska nationers förbund',
  },
  au: {
    id: 'au',
    name: 'Afrikanska unionen',
    type: 'regional',
    icon: '🌍',
    color: '#4CAF50',
    founded: 2002,
    members: ['ZA', 'NG', 'EG', 'KE', 'ET', 'GH', 'TZ', 'UG', 'RW', 'SN', 'CI', 'CM', 'AO', 'MZ', 'ZW', 'ZM', 'BW', 'NA', 'MW', 'MG'],
    description: 'Afrikanska unionens 55 medlemsländer',
  },
  gcc: {
    id: 'gcc',
    name: 'GCC',
    type: 'regional',
    icon: '🏜️',
    color: '#795548',
    founded: 1981,
    members: ['SA', 'AE', 'QA', 'KW', 'BH', 'OM'],
    description: 'Gulfstaternas samarbetsråd',
  },
  five_eyes: {
    id: 'five_eyes',
    name: 'Five Eyes',
    type: 'military',
    icon: '👁️',
    color: '#1A237E',
    founded: 1941,
    members: ['US', 'GB', 'CA', 'AU', 'NZ'],
    description: 'Underrättelsesamarbete mellan anglosaxiska länder',
  },
  quad: {
    id: 'quad',
    name: 'QUAD',
    type: 'military',
    icon: '🔷',
    color: '#0D47A1',
    founded: 2007,
    members: ['US', 'JP', 'AU', 'IN'],
    description: 'Säkerhetsdialog i Indo-Stillahavsregionen',
  },
  mercosur: {
    id: 'mercosur',
    name: 'Mercosur',
    type: 'economic',
    icon: '🌎',
    color: '#1976D2',
    founded: 1991,
    members: ['BR', 'AR', 'UY', 'PY'],
    description: 'Sydamerikansk tullunion',
  },
  sco: {
    id: 'sco',
    name: 'SCO',
    type: 'political',
    icon: '🤝',
    color: '#E65100',
    founded: 2001,
    members: ['CN', 'RU', 'IN', 'PK', 'KZ', 'KG', 'TJ', 'UZ', 'IR'],
    description: 'Shanghai Cooperation Organisation',
  },
};

// ============================================================================
// COLONIAL HISTORY DATABASE
// ============================================================================

export const COLONIAL_HISTORY: Record<string, ColonialHistory[]> = {
  // Former British colonies
  US: [{ colonizer: 'GB', period: { start: 1607, end: 1776 }, type: 'colony' }],
  IN: [{ colonizer: 'GB', period: { start: 1858, end: 1947 }, type: 'colony' }],
  AU: [{ colonizer: 'GB', period: { start: 1788, end: 1901 }, type: 'colony' }],
  CA: [{ colonizer: 'GB', period: { start: 1763, end: 1867 }, type: 'colony' }, { colonizer: 'FR', period: { start: 1534, end: 1763 }, type: 'colony' }],
  ZA: [{ colonizer: 'GB', period: { start: 1806, end: 1961 }, type: 'colony' }],
  NG: [{ colonizer: 'GB', period: { start: 1901, end: 1960 }, type: 'colony' }],
  KE: [{ colonizer: 'GB', period: { start: 1895, end: 1963 }, type: 'colony' }],
  GH: [{ colonizer: 'GB', period: { start: 1821, end: 1957 }, type: 'colony' }],
  
  // Former French colonies
  VN: [{ colonizer: 'FR', period: { start: 1887, end: 1954 }, type: 'colony' }],
  SN: [{ colonizer: 'FR', period: { start: 1895, end: 1960 }, type: 'colony' }],
  CI: [{ colonizer: 'FR', period: { start: 1893, end: 1960 }, type: 'colony' }],
  MA: [{ colonizer: 'FR', period: { start: 1912, end: 1956 }, type: 'protectorate' }],
  DZ: [{ colonizer: 'FR', period: { start: 1830, end: 1962 }, type: 'colony' }],
  
  // Former Spanish colonies
  MX: [{ colonizer: 'ES', period: { start: 1521, end: 1821 }, type: 'colony' }],
  AR: [{ colonizer: 'ES', period: { start: 1536, end: 1816 }, type: 'colony' }],
  PE: [{ colonizer: 'ES', period: { start: 1542, end: 1821 }, type: 'colony' }],
  CO: [{ colonizer: 'ES', period: { start: 1538, end: 1819 }, type: 'colony' }],
  CL: [{ colonizer: 'ES', period: { start: 1540, end: 1818 }, type: 'colony' }],
  PH: [{ colonizer: 'ES', period: { start: 1565, end: 1898 }, type: 'colony' }, { colonizer: 'US', period: { start: 1898, end: 1946 }, type: 'colony' }],
  
  // Former Portuguese colonies
  BR: [{ colonizer: 'PT', period: { start: 1500, end: 1822 }, type: 'colony' }],
  AO: [{ colonizer: 'PT', period: { start: 1575, end: 1975 }, type: 'colony' }],
  MZ: [{ colonizer: 'PT', period: { start: 1505, end: 1975 }, type: 'colony' }],
  
  // Former Dutch colonies
  ID: [{ colonizer: 'NL', period: { start: 1800, end: 1949 }, type: 'colony' }],
  
  // Former Belgian colonies
  CD: [{ colonizer: 'BE', period: { start: 1908, end: 1960 }, type: 'colony' }],
  
  // Former Japanese occupation
  KR: [{ colonizer: 'JP', period: { start: 1910, end: 1945 }, type: 'occupation' }],
  TW: [{ colonizer: 'JP', period: { start: 1895, end: 1945 }, type: 'colony' }],
};

// ============================================================================
// CURRENT DEPENDENCIES & TERRITORIES
// ============================================================================

export const DEPENDENCIES: Record<string, string[]> = {
  US: ['PR', 'GU', 'VI', 'AS', 'MP'], // Puerto Rico, Guam, Virgin Islands, American Samoa, Northern Mariana
  GB: ['GI', 'FK', 'BM', 'KY', 'VG', 'TC', 'MS', 'AI', 'SH', 'IO'], // Gibraltar, Falklands, Bermuda, etc.
  FR: ['GP', 'MQ', 'GF', 'RE', 'YT', 'NC', 'PF', 'PM', 'WF', 'BL', 'MF'], // Guadeloupe, Martinique, French Guiana, etc.
  NL: ['AW', 'CW', 'SX', 'BQ'], // Aruba, Curaçao, Sint Maarten, Caribbean Netherlands
  DK: ['GL', 'FO'], // Greenland, Faroe Islands
  AU: ['NF', 'CX', 'CC', 'HM'], // Norfolk, Christmas, Cocos, Heard
  NZ: ['CK', 'NU', 'TK'], // Cook Islands, Niue, Tokelau
};

// ============================================================================
// GEOPOLITICS BY COUNTRY
// ============================================================================

export const COUNTRY_GEOPOLITICS: Record<string, CountryGeopolitics> = {
  SE: {
    code: 'SE',
    alliances: ['eu', 'nato'],
    nuclearStatus: 'non_nuclear',
    unSecurityCouncil: 'none',
    strategicPartners: ['FI', 'NO', 'DK'],
  },
  US: {
    code: 'US',
    alliances: ['nato', 'five_eyes', 'quad'],
    colonialHistory: COLONIAL_HISTORY.US,
    currentDependencies: DEPENDENCIES.US,
    nuclearStatus: 'weapon_state',
    unSecurityCouncil: 'permanent',
    rivals: ['CN', 'RU', 'IR', 'KP'],
    strategicPartners: ['GB', 'JP', 'AU', 'IL', 'SA'],
  },
  GB: {
    code: 'GB',
    alliances: ['nato', 'five_eyes'],
    currentDependencies: DEPENDENCIES.GB,
    nuclearStatus: 'weapon_state',
    unSecurityCouncil: 'permanent',
    strategicPartners: ['US', 'FR', 'DE', 'JP', 'AU'],
  },
  RU: {
    code: 'RU',
    alliances: ['csto', 'brics', 'sco'],
    nuclearStatus: 'weapon_state',
    unSecurityCouncil: 'permanent',
    rivals: ['US', 'GB', 'UA', 'PL'],
    strategicPartners: ['CN', 'IN', 'IR', 'BY'],
  },
  CN: {
    code: 'CN',
    alliances: ['brics', 'sco'],
    nuclearStatus: 'weapon_state',
    unSecurityCouncil: 'permanent',
    rivals: ['US', 'JP', 'IN', 'TW'],
    strategicPartners: ['RU', 'PK', 'IR', 'KP'],
  },
  FR: {
    code: 'FR',
    alliances: ['eu', 'nato'],
    currentDependencies: DEPENDENCIES.FR,
    nuclearStatus: 'weapon_state',
    unSecurityCouncil: 'permanent',
    strategicPartners: ['DE', 'GB', 'US', 'IT'],
  },
  DE: {
    code: 'DE',
    alliances: ['eu', 'nato'],
    nuclearStatus: 'sharing',
    unSecurityCouncil: 'none',
    strategicPartners: ['FR', 'US', 'PL', 'NL'],
  },
  JP: {
    code: 'JP',
    alliances: ['quad'],
    nuclearStatus: 'non_nuclear',
    unSecurityCouncil: 'none',
    rivals: ['CN', 'KP', 'RU'],
    strategicPartners: ['US', 'AU', 'IN', 'KR'],
  },
  IN: {
    code: 'IN',
    alliances: ['brics', 'quad', 'sco'],
    colonialHistory: COLONIAL_HISTORY.IN,
    nuclearStatus: 'weapon_state',
    unSecurityCouncil: 'none',
    rivals: ['PK', 'CN'],
    strategicPartners: ['US', 'RU', 'JP', 'FR'],
  },
  BR: {
    code: 'BR',
    alliances: ['brics', 'mercosur'],
    colonialHistory: COLONIAL_HISTORY.BR,
    nuclearStatus: 'non_nuclear',
    unSecurityCouncil: 'none',
    strategicPartners: ['AR', 'CN', 'US'],
  },
  NO: {
    code: 'NO',
    alliances: ['nato'],
    nuclearStatus: 'non_nuclear',
    unSecurityCouncil: 'none',
    strategicPartners: ['SE', 'DK', 'FI', 'US', 'GB'],
  },
  FI: {
    code: 'FI',
    alliances: ['eu', 'nato'],
    nuclearStatus: 'non_nuclear',
    unSecurityCouncil: 'none',
    strategicPartners: ['SE', 'NO', 'EE'],
  },
  UA: {
    code: 'UA',
    alliances: [],
    nuclearStatus: 'non_nuclear',
    unSecurityCouncil: 'none',
    rivals: ['RU'],
    strategicPartners: ['US', 'GB', 'PL', 'DE'],
  },
};

// Get geopolitics for a country (with defaults)
export function getCountryGeopolitics(countryCode: string): CountryGeopolitics {
  return COUNTRY_GEOPOLITICS[countryCode] || {
    code: countryCode,
    alliances: [],
    nuclearStatus: 'non_nuclear',
    unSecurityCouncil: 'none',
  };
}

// ============================================================================
// COUNTRY NAME HELPER
// ============================================================================

const COUNTRY_NAMES: Record<string, string> = {
  SE: 'Sverige', US: 'USA', GB: 'Storbritannien', RU: 'Ryssland', CN: 'Kina',
  FR: 'Frankrike', DE: 'Tyskland', JP: 'Japan', IN: 'Indien', BR: 'Brasilien',
  NO: 'Norge', FI: 'Finland', DK: 'Danmark', NL: 'Nederländerna', BE: 'Belgien',
  IT: 'Italien', ES: 'Spanien', PT: 'Portugal', GR: 'Grekland', PL: 'Polen',
  UA: 'Ukraina', BY: 'Belarus', KZ: 'Kazakstan', TR: 'Turkiet', IR: 'Iran',
  SA: 'Saudiarabien', AE: 'Förenade Arabemiraten', IL: 'Israel', EG: 'Egypten',
  ZA: 'Sydafrika', NG: 'Nigeria', KE: 'Kenya', AU: 'Australien', NZ: 'Nya Zeeland',
  CA: 'Kanada', MX: 'Mexiko', AR: 'Argentina', CL: 'Chile', CO: 'Colombia',
  KR: 'Sydkorea', KP: 'Nordkorea', TW: 'Taiwan', PH: 'Filippinerna', VN: 'Vietnam',
  TH: 'Thailand', ID: 'Indonesien', MY: 'Malaysia', SG: 'Singapore', PK: 'Pakistan',
};

function getCountryName(code: string): string {
  return COUNTRY_NAMES[code] || code;
}

// ============================================================================
// COMPONENT: Alliance Badge
// ============================================================================

interface AllianceBadgeProps {
  alliance: Alliance;
  onClick?: () => void;
}

function AllianceBadge({ alliance, onClick }: AllianceBadgeProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium transition-all hover:scale-105"
      style={{ 
        background: `${alliance.color}15`,
        color: alliance.color,
        border: `1px solid ${alliance.color}40`,
      }}
    >
      <span>{alliance.icon}</span>
      <span>{alliance.name}</span>
    </button>
  );
}

// ============================================================================
// COMPONENT: Relationship Card
// ============================================================================

interface RelationshipCardProps {
  type: 'rival' | 'partner' | 'colonial';
  countries: string[];
  title: string;
  icon: string;
  bgColor: string;
  onClick?: (code: string) => void;
}

function RelationshipCard({ type, countries, title, icon, bgColor, onClick }: RelationshipCardProps) {
  if (!countries.length) return null;
  
  return (
    <div className={`p-3 rounded-xl ${bgColor}`}>
      <p className="text-xs font-medium text-slate-700 mb-2 flex items-center gap-1.5">
        <span>{icon}</span> {title}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {countries.map(code => (
          <button
            key={code}
            onClick={() => onClick?.(code)}
            className="flex items-center gap-1 px-2 py-1 bg-white rounded-lg text-xs hover:bg-slate-50 transition-colors shadow-sm"
          >
            <span>{getFlag(code)}</span>
            <span>{getCountryName(code)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT: GeopoliticalContext
// ============================================================================

interface GeopoliticalContextProps {
  countryCode: string;
  countryName: string;
  className?: string;
}

export function GeopoliticalContext({ countryCode, countryName, className = '' }: GeopoliticalContextProps) {
  const [selectedAlliance, setSelectedAlliance] = useState<Alliance | null>(null);
  const geo = getCountryGeopolitics(countryCode);
  const alliances = geo.alliances.map(id => ALLIANCES[id]).filter(Boolean);
  const colonialHistory = COLONIAL_HISTORY[countryCode];
  
  return (
    <>
      <section className={`space-y-4 ${className}`}>
        <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
          <span>🌐</span> Geopolitisk kontext
        </h3>

        {/* Alliances */}
        {alliances.length > 0 && (
          <div>
            <p className="text-xs text-slate-600 mb-2">Medlemskap i allianser & unioner</p>
            <div className="flex flex-wrap gap-2">
              {alliances.map(alliance => (
                <AllianceBadge 
                  key={alliance.id} 
                  alliance={alliance}
                  onClick={() => setSelectedAlliance(alliance)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Nuclear & UN Status */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2.5 bg-slate-50 rounded-lg">
            <p className="text-[10px] text-slate-500 mb-1">Kärnvapenstatus</p>
            <p className="text-xs font-medium flex items-center gap-1.5">
              {geo.nuclearStatus === 'weapon_state' && <><span>☢️</span> Kärnvapenstat</>}
              {geo.nuclearStatus === 'sharing' && <><span>🔗</span> NATO-delning</>}
              {geo.nuclearStatus === 'non_nuclear' && <><span>☮️</span> Kärnvapenfri</>}
            </p>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-lg">
            <p className="text-[10px] text-slate-500 mb-1">FN:s säkerhetsråd</p>
            <p className="text-xs font-medium flex items-center gap-1.5">
              {geo.unSecurityCouncil === 'permanent' && <><span>🔒</span> Permanent (veto)</>}
              {geo.unSecurityCouncil === 'non_permanent' && <><span>🪑</span> Icke-permanent</>}
              {geo.unSecurityCouncil === 'none' && <><span>—</span> Ej medlem</>}
            </p>
          </div>
        </div>

        {/* Strategic Partners */}
        {geo.strategicPartners && geo.strategicPartners.length > 0 && (
          <RelationshipCard
            type="partner"
            countries={geo.strategicPartners}
            title="Strategiska partners"
            icon="🤝"
            bgColor="bg-green-50"
          />
        )}

        {/* Rivals */}
        {geo.rivals && geo.rivals.length > 0 && (
          <RelationshipCard
            type="rival"
            countries={geo.rivals}
            title="Geopolitiska rivaler"
            icon="⚡"
            bgColor="bg-red-50"
          />
        )}

        {/* Colonial History */}
        {colonialHistory && colonialHistory.length > 0 && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
            <p className="text-xs font-medium text-amber-800 mb-2 flex items-center gap-1.5">
              <span>📜</span> Kolonihistorik
            </p>
            <div className="space-y-1.5">
              {colonialHistory.map((col, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-amber-900">
                  <span>{getFlag(col.colonizer)}</span>
                  <span className="font-medium">{getCountryName(col.colonizer)}</span>
                  <span className="text-amber-600">
                    ({col.period.start}–{col.period.end})
                  </span>
                  <span className="text-[10px] text-amber-500 px-1.5 py-0.5 bg-amber-100 rounded">
                    {col.type === 'colony' && 'Koloni'}
                    {col.type === 'protectorate' && 'Protektorat'}
                    {col.type === 'mandate' && 'Mandat'}
                    {col.type === 'occupation' && 'Ockupation'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Current Dependencies */}
        {geo.currentDependencies && geo.currentDependencies.length > 0 && (
          <div className="p-3 rounded-xl bg-purple-50 border border-purple-200">
            <p className="text-xs font-medium text-purple-800 mb-2 flex items-center gap-1.5">
              <span>🏝️</span> Nuvarande territorier & beroenden
            </p>
            <div className="flex flex-wrap gap-1.5">
              {geo.currentDependencies.map(code => (
                <span key={code} className="px-2 py-1 bg-white rounded text-xs text-purple-700 shadow-sm">
                  {code}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Transparency note */}
        <p className="text-[10px] text-slate-400 text-center pt-2">
          Geopolitiska relationer baserade på officiella fördrag och erkända allianser.
          <br />Klicka på allianser för medlemslista.
        </p>
      </section>

      {/* Alliance Detail Dialog */}
      <Dialog open={!!selectedAlliance} onOpenChange={() => setSelectedAlliance(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-2xl">{selectedAlliance?.icon}</span>
              {selectedAlliance?.name}
            </DialogTitle>
            <DialogDescription>
              Grundad {selectedAlliance?.founded} • {selectedAlliance?.members.length} medlemmar
            </DialogDescription>
          </DialogHeader>
          
          {selectedAlliance && (
            <div className="space-y-4 mt-4">
              <p className="text-sm text-slate-600">{selectedAlliance.description}</p>
              
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-xs font-medium text-slate-700 mb-2">
                  Typ: {selectedAlliance.type === 'military' && '⚔️ Militär'}
                  {selectedAlliance.type === 'political' && '🏛️ Politisk'}
                  {selectedAlliance.type === 'economic' && '💰 Ekonomisk'}
                  {selectedAlliance.type === 'regional' && '🗺️ Regional'}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-slate-700 mb-2">Alla medlemmar:</p>
                <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto">
                  {selectedAlliance.members.map(code => (
                    <span 
                      key={code}
                      className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs ${
                        code === countryCode 
                          ? 'bg-blue-100 text-blue-800 font-medium' 
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      <span>{getFlag(code)}</span>
                      <span>{getCountryName(code)}</span>
                    </span>
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

export default GeopoliticalContext;
