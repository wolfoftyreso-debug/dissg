/**
 * LEGAL STATUS INDICATOR MODULE
 * 
 * Visualizes legal status of various substances/activities across countries:
 * - Cannabis (recreational, medical, decriminalized, illegal)
 * - Same-sex marriage
 * - Abortion
 * - Euthanasia
 * - Death penalty
 */

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

// ============================================================================
// TYPES
// ============================================================================

export type LegalTopic = 'cannabis' | 'same_sex_marriage' | 'abortion' | 'euthanasia' | 'death_penalty';

export type LegalStatus = 
  | 'legal'           // Fully legal
  | 'legal_medical'   // Legal for medical use only
  | 'decriminalized'  // Decriminalized but not legal
  | 'illegal'         // Fully illegal
  | 'varies'          // Varies by region
  | 'partial'         // Partially legal/restricted
  | 'abolished'       // Abolished (for death penalty)
  | 'unknown';

export interface LegalInfo {
  status: LegalStatus;
  year?: number;        // Year of legalization/change
  notes?: string;       // Additional context
  source?: string;      // Data source
}

export interface LegalTopicConfig {
  id: LegalTopic;
  name: { sv: string; en: string };
  icon: string;
  description: string;
  statuses: {
    status: LegalStatus;
    label: { sv: string; en: string };
    color: string;
  }[];
}

// ============================================================================
// TOPIC CONFIGURATIONS
// ============================================================================

export const LEGAL_TOPICS: Record<LegalTopic, LegalTopicConfig> = {
  cannabis: {
    id: 'cannabis',
    name: { sv: 'Cannabis', en: 'Cannabis' },
    icon: '🌿',
    description: 'Juridisk status för cannabis (rekreationellt och medicinskt)',
    statuses: [
      { status: 'legal', label: { sv: 'Lagligt', en: 'Legal' }, color: '#10B981' },
      { status: 'legal_medical', label: { sv: 'Medicinskt lagligt', en: 'Medical only' }, color: '#84CC16' },
      { status: 'decriminalized', label: { sv: 'Avkriminaliserat', en: 'Decriminalized' }, color: '#FBBF24' },
      { status: 'illegal', label: { sv: 'Olagligt', en: 'Illegal' }, color: '#EF4444' },
      { status: 'varies', label: { sv: 'Varierar regionalt', en: 'Varies by region' }, color: '#8B5CF6' },
    ],
  },
  same_sex_marriage: {
    id: 'same_sex_marriage',
    name: { sv: 'Samkönat äktenskap', en: 'Same-sex Marriage' },
    icon: '💒',
    description: 'Juridiskt erkännande av samkönade äktenskap',
    statuses: [
      { status: 'legal', label: { sv: 'Lagligt', en: 'Legal' }, color: '#10B981' },
      { status: 'partial', label: { sv: 'Partnerskap erkänt', en: 'Civil unions' }, color: '#84CC16' },
      { status: 'illegal', label: { sv: 'Ej erkänt', en: 'Not recognized' }, color: '#F59E0B' },
    ],
  },
  abortion: {
    id: 'abortion',
    name: { sv: 'Abort', en: 'Abortion' },
    icon: '⚕️',
    description: 'Juridisk tillgång till abort',
    statuses: [
      { status: 'legal', label: { sv: 'Lagligt på begäran', en: 'Legal on request' }, color: '#10B981' },
      { status: 'partial', label: { sv: 'Begränsat tillåtet', en: 'Restricted' }, color: '#FBBF24' },
      { status: 'illegal', label: { sv: 'Förbjudet', en: 'Prohibited' }, color: '#EF4444' },
      { status: 'varies', label: { sv: 'Varierar regionalt', en: 'Varies' }, color: '#8B5CF6' },
    ],
  },
  euthanasia: {
    id: 'euthanasia',
    name: { sv: 'Dödshjälp', en: 'Euthanasia' },
    icon: '🕊️',
    description: 'Juridisk status för aktiv dödshjälp och assisterat självmord',
    statuses: [
      { status: 'legal', label: { sv: 'Lagligt', en: 'Legal' }, color: '#10B981' },
      { status: 'partial', label: { sv: 'Assisterat självmord', en: 'Assisted suicide only' }, color: '#84CC16' },
      { status: 'illegal', label: { sv: 'Förbjudet', en: 'Prohibited' }, color: '#EF4444' },
    ],
  },
  death_penalty: {
    id: 'death_penalty',
    name: { sv: 'Dödsstraff', en: 'Death Penalty' },
    icon: '⚖️',
    description: 'Status för dödsstraff',
    statuses: [
      { status: 'abolished', label: { sv: 'Avskaffat', en: 'Abolished' }, color: '#10B981' },
      { status: 'partial', label: { sv: 'Moratorium', en: 'Moratorium' }, color: '#FBBF24' },
      { status: 'legal', label: { sv: 'Används', en: 'In use' }, color: '#EF4444' },
    ],
  },
};

// ============================================================================
// CANNABIS DATA BY COUNTRY
// ============================================================================

export const CANNABIS_STATUS: Record<string, LegalInfo> = {
  // Fully legal (recreational)
  CA: { status: 'legal', year: 2018, notes: 'Legaliserat nationellt', source: 'Cannabis Act 2018' },
  UY: { status: 'legal', year: 2013, notes: 'Första landet att legalisera', source: 'Law 19.172' },
  
  // US - varies by state
  US: { status: 'varies', notes: 'Lagligt i 24 delstater, federalt olagligt', source: 'State laws 2024' },
  
  // Legal medical only
  DE: { status: 'legal', year: 2024, notes: 'Legaliserat april 2024', source: 'CanG 2024' },
  TH: { status: 'legal_medical', year: 2022, notes: 'Avkriminaliserat, medicinsk användning tillåten', source: 'Narcotics Act amendment' },
  AU: { status: 'legal_medical', year: 2016, notes: 'Medicinsk användning lagligt federalt', source: 'Narcotic Drugs Amendment Act' },
  IL: { status: 'legal_medical', year: 1999, notes: 'Ett av de äldsta medicinska programmen', source: 'Ministry of Health' },
  IT: { status: 'legal_medical', year: 2013, notes: 'Medicinsk cannabis tillåtet', source: 'Law 79/2014' },
  PL: { status: 'legal_medical', year: 2017, notes: 'Medicinsk användning tillåten', source: 'Pharmaceutical Law Amendment' },
  GB: { status: 'legal_medical', year: 2018, notes: 'Medicinsk användning för specifika tillstånd', source: 'Home Office 2018' },
  DK: { status: 'legal_medical', year: 2018, notes: 'Pilotprogram för medicinsk cannabis', source: 'Pilot scheme' },
  NO: { status: 'legal_medical', year: 2016, notes: 'Begränsad medicinsk användning', source: 'Norwegian Medicines Agency' },
  CZ: { status: 'legal_medical', year: 2013, notes: 'Medicinsk cannabis tillåtet', source: 'Act 50/2013' },
  HR: { status: 'legal_medical', year: 2015, notes: 'Medicinsk användning tillåten', source: 'Ordinance on Cannabis' },
  CY: { status: 'legal_medical', year: 2019, notes: 'Medicinsk cannabis lagligt', source: 'Law 2019' },
  MT: { status: 'legal', year: 2021, notes: 'Första EU-landet att legalisera', source: 'ARLOPC Act' },
  LU: { status: 'legal', year: 2023, notes: 'Hemmaodling tillåten', source: 'Law 2023' },
  
  // Decriminalized
  NL: { status: 'decriminalized', notes: 'Toleranspolicy, coffee shops', source: 'Gedoogbeleid' },
  PT: { status: 'decriminalized', year: 2001, notes: 'Alla droger avkriminaliserade', source: 'Law 30/2000' },
  ES: { status: 'decriminalized', notes: 'Privat användning tolererad, cannabis clubs', source: 'Regional laws' },
  CH: { status: 'decriminalized', notes: 'Små mängder avkriminaliserade', source: 'Federal Council' },
  BE: { status: 'decriminalized', notes: 'Personlig användning lägsta prioritet', source: 'Ministerial Guidelines' },
  MX: { status: 'decriminalized', year: 2021, notes: 'Personlig användning avkriminaliserad', source: 'Supreme Court ruling' },
  AR: { status: 'decriminalized', notes: 'Personlig användning avkriminaliserad', source: 'Supreme Court 2009' },
  CO: { status: 'decriminalized', notes: 'Personlig dos tillåten', source: 'Constitutional Court' },
  JM: { status: 'decriminalized', year: 2015, notes: 'Små mängder avkriminaliserade', source: 'Dangerous Drugs Amendment' },
  
  // Illegal
  SE: { status: 'illegal', notes: 'Strikt förbudet, även personlig användning straffbart', source: 'Narkotikastrafflagen' },
  FI: { status: 'illegal', notes: 'Olagligt men sällan fängelse för personlig användning', source: 'Narcotics Act' },
  FR: { status: 'illegal', notes: 'Olagligt men böter istället för fängelse sedan 2020', source: 'Penal Code' },
  JP: { status: 'illegal', notes: 'Strikt förbudet, hårda straff', source: 'Cannabis Control Act' },
  KR: { status: 'illegal', notes: 'Strikt förbudet, hårda straff', source: 'Act on Control of Narcotics' },
  CN: { status: 'illegal', notes: 'Strikt förbudet, dödsstraff möjligt', source: 'Criminal Law' },
  RU: { status: 'illegal', notes: 'Olagligt, fängelsestraff', source: 'Criminal Code' },
  SA: { status: 'illegal', notes: 'Strikt förbudet, hårda straff', source: 'Sharia law' },
  AE: { status: 'illegal', notes: 'Strikt förbudet, fängelse', source: 'Federal Law 14/1995' },
  SG: { status: 'illegal', notes: 'Strikt förbudet, dödsstraff för trafficking', source: 'Misuse of Drugs Act' },
  MY: { status: 'illegal', notes: 'Dödsstraff för trafficking', source: 'Dangerous Drugs Act' },
  ID: { status: 'illegal', notes: 'Strikt förbudet, dödsstraff möjligt', source: 'Narcotics Law' },
  PH: { status: 'illegal', notes: 'Olagligt, hårt bekämpat', source: 'Comprehensive Dangerous Drugs Act' },
  IN: { status: 'illegal', notes: 'Nationellt olagligt, bhang undantaget', source: 'NDPS Act' },
  EG: { status: 'illegal', notes: 'Olagligt', source: 'Anti-Narcotics Law' },
  NG: { status: 'illegal', notes: 'Olagligt', source: 'NDLEA Act' },
  KE: { status: 'illegal', notes: 'Olagligt', source: 'Narcotic Drugs Act' },
  ZA: { status: 'decriminalized', year: 2018, notes: 'Privat användning avkriminaliserad', source: 'Constitutional Court' },
  BR: { status: 'decriminalized', notes: 'Personlig användning ej straffbart med fängelse', source: 'Law 11.343/2006' },
  NZ: { status: 'legal_medical', year: 2020, notes: 'Medicinsk lagligt, referendum misslyckades', source: 'Medicinal Cannabis Scheme' },
  TR: { status: 'illegal', notes: 'Olagligt, fängelsestraff', source: 'Law 2313' },
  UA: { status: 'illegal', notes: 'Olagligt men reform diskuteras', source: 'Criminal Code' },
  PK: { status: 'illegal', notes: 'Olagligt, fängelsestraff', source: 'Control of Narcotic Substances Act' },
  BD: { status: 'illegal', notes: 'Olagligt', source: 'Narcotics Control Act' },
  VN: { status: 'illegal', notes: 'Olagligt, dödsstraff för trafficking', source: 'Penal Code' },
  TW: { status: 'illegal', notes: 'Olagligt, hårda straff', source: 'Narcotics Hazard Prevention Act' },
  HK: { status: 'illegal', notes: 'Olagligt', source: 'Dangerous Drugs Ordinance' },
  AT: { status: 'decriminalized', notes: 'Personlig användning kan behandlas med terapi', source: 'SMG' },
  GR: { status: 'legal_medical', year: 2017, notes: 'Medicinsk användning tillåten', source: 'Law 4523/2018' },
  HU: { status: 'illegal', notes: 'Olagligt, fängelsestraff', source: 'Act C of 2012' },
  RO: { status: 'illegal', notes: 'Olagligt', source: 'Law 143/2000' },
  BG: { status: 'illegal', notes: 'Olagligt', source: 'Penal Code' },
  IE: { status: 'legal_medical', year: 2019, notes: 'Medicinsk cannabis-access program', source: 'MCAP' },
  SK: { status: 'illegal', notes: 'Olagligt, fängelsestraff', source: 'Act 139/1998' },
  SI: { status: 'legal_medical', year: 2019, notes: 'Medicinsk användning tillåten', source: 'Production of Medicinal Products Act' },
  LT: { status: 'legal_medical', year: 2019, notes: 'Medicinsk användning tillåten', source: 'Law Amendment' },
  LV: { status: 'illegal', notes: 'Olagligt', source: 'Criminal Law' },
  EE: { status: 'illegal', notes: 'Olagligt men sällan åtal för personlig användning', source: 'Narcotic Drugs Act' },
  CL: { status: 'decriminalized', notes: 'Privat odling och användning tolererad', source: 'Law 20.000' },
  PE: { status: 'legal_medical', year: 2017, notes: 'Medicinsk användning tillåten', source: 'Law 30681' },
  EC: { status: 'decriminalized', notes: 'Personlig användning avkriminaliserad', source: 'COIP' },
  VE: { status: 'illegal', notes: 'Olagligt', source: 'Organic Law Against Illicit Drug Trafficking' },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getLegalStatus(countryCode: string, topic: LegalTopic): LegalInfo | null {
  switch (topic) {
    case 'cannabis':
      return CANNABIS_STATUS[countryCode] || null;
    // Add more topics as needed
    default:
      return null;
  }
}

export function getLegalColor(countryCode: string, topic: LegalTopic): string {
  const info = getLegalStatus(countryCode, topic);
  if (!info) return '#9CA3AF'; // Gray for unknown
  
  const topicConfig = LEGAL_TOPICS[topic];
  const statusConfig = topicConfig.statuses.find(s => s.status === info.status);
  return statusConfig?.color || '#9CA3AF';
}

export function getLegalLabel(status: LegalStatus, topic: LegalTopic): string {
  const topicConfig = LEGAL_TOPICS[topic];
  const statusConfig = topicConfig.statuses.find(s => s.status === status);
  return statusConfig?.label.sv || 'Okänd';
}

// ============================================================================
// LEGAL STATUS LEGEND
// ============================================================================

interface LegalLegendProps {
  topic: LegalTopic;
  className?: string;
}

export function LegalLegend({ topic, className = '' }: LegalLegendProps) {
  const config = LEGAL_TOPICS[topic];

  return (
    <div className={`bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-3 ${className}`}>
      <p className="text-xs font-semibold text-slate-700 mb-2">
        {config.icon} {config.name.sv}
      </p>
      <div className="flex flex-col gap-1">
        {config.statuses.map(s => (
          <div key={s.status} className="flex items-center gap-2">
            <div 
              className="w-4 h-3 rounded-sm" 
              style={{ backgroundColor: s.color }}
            />
            <span className="text-[10px] text-slate-600">{s.label.sv}</span>
          </div>
        ))}
      </div>
      <p className="text-[9px] text-slate-400 mt-2 pt-2 border-t border-slate-100">
        Klicka på land för detaljer
      </p>
    </div>
  );
}

// ============================================================================
// LEGAL TOPIC SELECTOR
// ============================================================================

interface LegalTopicSelectorProps {
  selected: LegalTopic | null;
  onChange: (topic: LegalTopic | null) => void;
  className?: string;
}

export function LegalTopicSelector({ selected, onChange, className = '' }: LegalTopicSelectorProps) {
  const topics = Object.values(LEGAL_TOPICS);

  return (
    <div className={`flex flex-wrap gap-1 ${className}`}>
      {topics.map(topic => (
        <button
          key={topic.id}
          onClick={() => onChange(selected === topic.id ? null : topic.id)}
          className={`
            px-3 py-1.5 rounded-lg text-xs font-medium transition-all
            ${selected === topic.id 
              ? 'bg-slate-800 text-white shadow-md' 
              : 'bg-white/90 text-slate-700 hover:bg-white'}
          `}
        >
          <span className="mr-1">{topic.icon}</span>
          {topic.name.sv}
        </button>
      ))}
    </div>
  );
}

// ============================================================================
// LEGAL STATUS DIALOG
// ============================================================================

interface LegalStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  countryCode: string;
  countryName: string;
  topic: LegalTopic;
}

export function LegalStatusDialog({ 
  open, 
  onOpenChange, 
  countryCode, 
  countryName,
  topic 
}: LegalStatusDialogProps) {
  const info = getLegalStatus(countryCode, topic);
  const config = LEGAL_TOPICS[topic];
  
  if (!info) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{config.icon} {config.name.sv} i {countryName}</DialogTitle>
            <DialogDescription>Ingen data tillgänglig</DialogDescription>
          </DialogHeader>
          <p className="text-sm text-slate-600">
            Vi har ingen information om {config.name.sv.toLowerCase()} för {countryName}.
          </p>
        </DialogContent>
      </Dialog>
    );
  }

  const statusConfig = config.statuses.find(s => s.status === info.status);
  const color = statusConfig?.color || '#9CA3AF';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">{config.icon}</span>
            {config.name.sv}: {countryName}
          </DialogTitle>
          <DialogDescription>{config.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Status display */}
          <div 
            className="flex items-center gap-4 p-4 rounded-xl"
            style={{ backgroundColor: `${color}15` }}
          >
            <div 
              className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
              style={{ backgroundColor: color }}
            >
              <span className="text-white text-2xl">{config.icon}</span>
            </div>
            <div>
              <p className="text-lg font-semibold" style={{ color }}>
                {statusConfig?.label.sv}
              </p>
              {info.year && (
                <p className="text-sm text-slate-600">Sedan {info.year}</p>
              )}
            </div>
          </div>

          {/* Notes */}
          {info.notes && (
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-xs font-medium text-slate-700 mb-1">📋 Detaljer</p>
              <p className="text-sm text-slate-600">{info.notes}</p>
            </div>
          )}

          {/* Source */}
          {info.source && (
            <div className="border border-slate-200 rounded-xl p-3">
              <p className="text-xs font-medium text-slate-700 mb-1">📚 Källa</p>
              <p className="text-sm text-slate-600">{info.source}</p>
            </div>
          )}

          {/* Disclaimer */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
            <p className="text-[10px] text-amber-700 leading-relaxed">
              <strong>⚠️ Obs:</strong> Juridisk status kan variera regionalt och ändras. 
              Denna information är endast vägledande och ersätter inte professionell juridisk rådgivning.
              Kontrollera alltid aktuella lagar innan du reser.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default LegalLegend;
