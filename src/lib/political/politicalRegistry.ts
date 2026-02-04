/**
 * POLITICAL REGISTRY
 * 
 * Neutral, factual registry of government periods and leaders.
 * Used for political overlay on ALL time-series statistics.
 * 
 * IMMUTABLE RULE: No value judgments. Only facts: who, when, what coalition.
 */

export type PoliticalBloc = 'left' | 'right' | 'center' | 'coalition' | 'other';

export interface GovernmentPeriod {
  id: string;
  countryCode: string;
  startDate: string; // YYYY-MM-DD
  endDate: string | null; // null = current
  
  // Leadership
  leaderName: string;
  leaderTitle: string; // "Prime Minister", "President", "Chancellor"
  leaderParty: string;
  
  // Coalition
  bloc: PoliticalBloc;
  coalitionParties: string[];
  
  // Metadata
  parliamentaryMajority: boolean;
  minorityGovernment: boolean;
  
  // Source
  sourceUrl?: string;
}

export interface Leader {
  name: string;
  title: string;
  party: string;
  birthYear?: number;
  photoUrl?: string;
  wikiUrl?: string;
}

// Color mapping for political blocs - using semantic design tokens
export const BLOC_COLORS: Record<PoliticalBloc, { bg: string; border: string; label: string }> = {
  left: { 
    bg: 'bg-red-500/10', 
    border: 'border-red-500/30', 
    label: 'Vänsterblock' 
  },
  right: { 
    bg: 'bg-blue-500/10', 
    border: 'border-blue-500/30', 
    label: 'Högerblock' 
  },
  center: { 
    bg: 'bg-yellow-500/10', 
    border: 'border-yellow-500/30', 
    label: 'Mittenblock' 
  },
  coalition: { 
    bg: 'bg-purple-500/10', 
    border: 'border-purple-500/30', 
    label: 'Bred koalition' 
  },
  other: { 
    bg: 'bg-muted/50', 
    border: 'border-muted', 
    label: 'Övrigt' 
  },
};

// Swedish governments - example data (would come from database in production)
export const GOVERNMENT_PERIODS_SE: GovernmentPeriod[] = [
  {
    id: 'se-2022-kristersson',
    countryCode: 'SE',
    startDate: '2022-10-18',
    endDate: null,
    leaderName: 'Ulf Kristersson',
    leaderTitle: 'Statsminister',
    leaderParty: 'Moderaterna',
    bloc: 'right',
    coalitionParties: ['Moderaterna', 'Kristdemokraterna', 'Liberalerna'],
    parliamentaryMajority: false,
    minorityGovernment: true,
    sourceUrl: 'https://www.government.se'
  },
  {
    id: 'se-2021-andersson',
    countryCode: 'SE',
    startDate: '2021-11-30',
    endDate: '2022-10-18',
    leaderName: 'Magdalena Andersson',
    leaderTitle: 'Statsminister',
    leaderParty: 'Socialdemokraterna',
    bloc: 'left',
    coalitionParties: ['Socialdemokraterna'],
    parliamentaryMajority: false,
    minorityGovernment: true,
  },
  {
    id: 'se-2014-lofven-1',
    countryCode: 'SE',
    startDate: '2014-10-03',
    endDate: '2021-11-30',
    leaderName: 'Stefan Löfven',
    leaderTitle: 'Statsminister',
    leaderParty: 'Socialdemokraterna',
    bloc: 'left',
    coalitionParties: ['Socialdemokraterna', 'Miljöpartiet'],
    parliamentaryMajority: false,
    minorityGovernment: true,
  },
  {
    id: 'se-2006-reinfeldt',
    countryCode: 'SE',
    startDate: '2006-10-06',
    endDate: '2014-10-03',
    leaderName: 'Fredrik Reinfeldt',
    leaderTitle: 'Statsminister',
    leaderParty: 'Moderaterna',
    bloc: 'right',
    coalitionParties: ['Moderaterna', 'Folkpartiet', 'Centerpartiet', 'Kristdemokraterna'],
    parliamentaryMajority: true,
    minorityGovernment: false,
  },
  {
    id: 'se-1996-persson',
    countryCode: 'SE',
    startDate: '1996-03-22',
    endDate: '2006-10-06',
    leaderName: 'Göran Persson',
    leaderTitle: 'Statsminister',
    leaderParty: 'Socialdemokraterna',
    bloc: 'left',
    coalitionParties: ['Socialdemokraterna'],
    parliamentaryMajority: false,
    minorityGovernment: true,
  },
  {
    id: 'se-1991-bildt',
    countryCode: 'SE',
    startDate: '1991-10-04',
    endDate: '1994-10-07',
    leaderName: 'Carl Bildt',
    leaderTitle: 'Statsminister',
    leaderParty: 'Moderaterna',
    bloc: 'right',
    coalitionParties: ['Moderaterna', 'Folkpartiet', 'Centerpartiet', 'Kristdemokraterna'],
    parliamentaryMajority: true,
    minorityGovernment: false,
  },
  {
    id: 'se-1986-carlsson',
    countryCode: 'SE',
    startDate: '1986-03-12',
    endDate: '1991-10-04',
    leaderName: 'Ingvar Carlsson',
    leaderTitle: 'Statsminister',
    leaderParty: 'Socialdemokraterna',
    bloc: 'left',
    coalitionParties: ['Socialdemokraterna'],
    parliamentaryMajority: false,
    minorityGovernment: true,
  },
  {
    id: 'se-1982-palme-2',
    countryCode: 'SE',
    startDate: '1982-10-08',
    endDate: '1986-02-28',
    leaderName: 'Olof Palme',
    leaderTitle: 'Statsminister',
    leaderParty: 'Socialdemokraterna',
    bloc: 'left',
    coalitionParties: ['Socialdemokraterna'],
    parliamentaryMajority: false,
    minorityGovernment: true,
  },
];

// German governments
export const GOVERNMENT_PERIODS_DE: GovernmentPeriod[] = [
  {
    id: 'de-2021-scholz',
    countryCode: 'DE',
    startDate: '2021-12-08',
    endDate: null,
    leaderName: 'Olaf Scholz',
    leaderTitle: 'Bundeskanzler',
    leaderParty: 'SPD',
    bloc: 'left',
    coalitionParties: ['SPD', 'Grüne', 'FDP'],
    parliamentaryMajority: true,
    minorityGovernment: false,
  },
  {
    id: 'de-2005-merkel',
    countryCode: 'DE',
    startDate: '2005-11-22',
    endDate: '2021-12-08',
    leaderName: 'Angela Merkel',
    leaderTitle: 'Bundeskanzlerin',
    leaderParty: 'CDU',
    bloc: 'coalition', // Various grand coalitions
    coalitionParties: ['CDU', 'CSU', 'SPD'], // Simplified
    parliamentaryMajority: true,
    minorityGovernment: false,
  },
  {
    id: 'de-1998-schroder',
    countryCode: 'DE',
    startDate: '1998-10-27',
    endDate: '2005-11-22',
    leaderName: 'Gerhard Schröder',
    leaderTitle: 'Bundeskanzler',
    leaderParty: 'SPD',
    bloc: 'left',
    coalitionParties: ['SPD', 'Grüne'],
    parliamentaryMajority: true,
    minorityGovernment: false,
  },
  {
    id: 'de-1982-kohl',
    countryCode: 'DE',
    startDate: '1982-10-01',
    endDate: '1998-10-27',
    leaderName: 'Helmut Kohl',
    leaderTitle: 'Bundeskanzler',
    leaderParty: 'CDU',
    bloc: 'right',
    coalitionParties: ['CDU', 'CSU', 'FDP'],
    parliamentaryMajority: true,
    minorityGovernment: false,
  },
];

// US governments
export const GOVERNMENT_PERIODS_US: GovernmentPeriod[] = [
  {
    id: 'us-2021-biden',
    countryCode: 'US',
    startDate: '2021-01-20',
    endDate: null,
    leaderName: 'Joe Biden',
    leaderTitle: 'President',
    leaderParty: 'Democratic Party',
    bloc: 'left',
    coalitionParties: ['Democratic Party'],
    parliamentaryMajority: false,
    minorityGovernment: false,
  },
  {
    id: 'us-2017-trump',
    countryCode: 'US',
    startDate: '2017-01-20',
    endDate: '2021-01-20',
    leaderName: 'Donald Trump',
    leaderTitle: 'President',
    leaderParty: 'Republican Party',
    bloc: 'right',
    coalitionParties: ['Republican Party'],
    parliamentaryMajority: true,
    minorityGovernment: false,
  },
  {
    id: 'us-2009-obama',
    countryCode: 'US',
    startDate: '2009-01-20',
    endDate: '2017-01-20',
    leaderName: 'Barack Obama',
    leaderTitle: 'President',
    leaderParty: 'Democratic Party',
    bloc: 'left',
    coalitionParties: ['Democratic Party'],
    parliamentaryMajority: false,
    minorityGovernment: false,
  },
  {
    id: 'us-2001-bush',
    countryCode: 'US',
    startDate: '2001-01-20',
    endDate: '2009-01-20',
    leaderName: 'George W. Bush',
    leaderTitle: 'President',
    leaderParty: 'Republican Party',
    bloc: 'right',
    coalitionParties: ['Republican Party'],
    parliamentaryMajority: true,
    minorityGovernment: false,
  },
];

// Combined registry
export const GOVERNMENT_REGISTRY: Record<string, GovernmentPeriod[]> = {
  'SE': GOVERNMENT_PERIODS_SE,
  'DE': GOVERNMENT_PERIODS_DE,
  'US': GOVERNMENT_PERIODS_US,
};

// Helper functions
export function getGovernmentAtDate(countryCode: string, date: Date): GovernmentPeriod | null {
  const periods = GOVERNMENT_REGISTRY[countryCode];
  if (!periods) return null;
  
  const dateStr = date.toISOString().split('T')[0];
  
  return periods.find(period => {
    const start = period.startDate;
    const end = period.endDate || '9999-12-31';
    return dateStr >= start && dateStr <= end;
  }) || null;
}

export function getGovernmentsInRange(
  countryCode: string, 
  startDate: Date, 
  endDate: Date
): GovernmentPeriod[] {
  const periods = GOVERNMENT_REGISTRY[countryCode];
  if (!periods) return [];
  
  const startStr = startDate.toISOString().split('T')[0];
  const endStr = endDate.toISOString().split('T')[0];
  
  return periods.filter(period => {
    const pStart = period.startDate;
    const pEnd = period.endDate || '9999-12-31';
    
    // Period overlaps with range
    return pStart <= endStr && pEnd >= startStr;
  }).sort((a, b) => a.startDate.localeCompare(b.startDate));
}

export function getAvailableCountries(): string[] {
  return Object.keys(GOVERNMENT_REGISTRY);
}
