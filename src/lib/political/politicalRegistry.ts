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
 
 // UK governments
 export const GOVERNMENT_PERIODS_GB: GovernmentPeriod[] = [
   {
     id: 'gb-2024-starmer',
     countryCode: 'GB',
     startDate: '2024-07-05',
     endDate: null,
     leaderName: 'Keir Starmer',
     leaderTitle: 'Prime Minister',
     leaderParty: 'Labour',
     bloc: 'left',
     coalitionParties: ['Labour'],
     parliamentaryMajority: true,
     minorityGovernment: false,
   },
   {
     id: 'gb-2022-sunak',
     countryCode: 'GB',
     startDate: '2022-10-25',
     endDate: '2024-07-05',
     leaderName: 'Rishi Sunak',
     leaderTitle: 'Prime Minister',
     leaderParty: 'Conservative',
     bloc: 'right',
     coalitionParties: ['Conservative'],
     parliamentaryMajority: true,
     minorityGovernment: false,
   },
   {
     id: 'gb-2019-johnson',
     countryCode: 'GB',
     startDate: '2019-07-24',
     endDate: '2022-10-25',
     leaderName: 'Boris Johnson',
     leaderTitle: 'Prime Minister',
     leaderParty: 'Conservative',
     bloc: 'right',
     coalitionParties: ['Conservative'],
     parliamentaryMajority: true,
     minorityGovernment: false,
   },
   {
     id: 'gb-2010-cameron',
     countryCode: 'GB',
     startDate: '2010-05-11',
     endDate: '2019-07-24',
     leaderName: 'David Cameron',
     leaderTitle: 'Prime Minister',
     leaderParty: 'Conservative',
     bloc: 'right',
     coalitionParties: ['Conservative', 'Liberal Democrats'],
     parliamentaryMajority: true,
     minorityGovernment: false,
   },
   {
     id: 'gb-1997-blair',
     countryCode: 'GB',
     startDate: '1997-05-02',
     endDate: '2010-05-11',
     leaderName: 'Tony Blair',
     leaderTitle: 'Prime Minister',
     leaderParty: 'Labour',
     bloc: 'left',
     coalitionParties: ['Labour'],
     parliamentaryMajority: true,
     minorityGovernment: false,
   },
 ];
 
 // French governments
 export const GOVERNMENT_PERIODS_FR: GovernmentPeriod[] = [
   {
     id: 'fr-2017-macron',
     countryCode: 'FR',
     startDate: '2017-05-14',
     endDate: null,
     leaderName: 'Emmanuel Macron',
     leaderTitle: 'Président',
     leaderParty: 'Renaissance',
     bloc: 'center',
     coalitionParties: ['Renaissance', 'MoDem'],
     parliamentaryMajority: false,
     minorityGovernment: true,
   },
   {
     id: 'fr-2012-hollande',
     countryCode: 'FR',
     startDate: '2012-05-15',
     endDate: '2017-05-14',
     leaderName: 'François Hollande',
     leaderTitle: 'Président',
     leaderParty: 'Parti Socialiste',
     bloc: 'left',
     coalitionParties: ['PS', 'EELV'],
     parliamentaryMajority: true,
     minorityGovernment: false,
   },
   {
     id: 'fr-2007-sarkozy',
     countryCode: 'FR',
     startDate: '2007-05-16',
     endDate: '2012-05-15',
     leaderName: 'Nicolas Sarkozy',
     leaderTitle: 'Président',
     leaderParty: 'UMP',
     bloc: 'right',
     coalitionParties: ['UMP'],
     parliamentaryMajority: true,
     minorityGovernment: false,
   },
 ];
 
// Norwegian governments - Extended historical data
export const GOVERNMENT_PERIODS_NO: GovernmentPeriod[] = [
  {
    id: 'no-2021-store',
    countryCode: 'NO',
    startDate: '2021-10-14',
    endDate: null,
    leaderName: 'Jonas Gahr Støre',
    leaderTitle: 'Statsminister',
    leaderParty: 'Arbeiderpartiet',
    bloc: 'left',
    coalitionParties: ['Arbeiderpartiet', 'Senterpartiet'],
    parliamentaryMajority: false,
    minorityGovernment: true,
  },
  {
    id: 'no-2013-solberg',
    countryCode: 'NO',
    startDate: '2013-10-16',
    endDate: '2021-10-14',
    leaderName: 'Erna Solberg',
    leaderTitle: 'Statsminister',
    leaderParty: 'Høyre',
    bloc: 'right',
    coalitionParties: ['Høyre', 'Fremskrittspartiet', 'Venstre', 'KrF'],
    parliamentaryMajority: false,
    minorityGovernment: true,
  },
  {
    id: 'no-2005-stoltenberg-2',
    countryCode: 'NO',
    startDate: '2005-10-17',
    endDate: '2013-10-16',
    leaderName: 'Jens Stoltenberg',
    leaderTitle: 'Statsminister',
    leaderParty: 'Arbeiderpartiet',
    bloc: 'left',
    coalitionParties: ['Arbeiderpartiet', 'SV', 'Senterpartiet'],
    parliamentaryMajority: true,
    minorityGovernment: false,
  },
  {
    id: 'no-2001-bondevik-2',
    countryCode: 'NO',
    startDate: '2001-10-19',
    endDate: '2005-10-17',
    leaderName: 'Kjell Magne Bondevik',
    leaderTitle: 'Statsminister',
    leaderParty: 'Kristelig Folkeparti',
    bloc: 'right',
    coalitionParties: ['KrF', 'Høyre', 'Venstre'],
    parliamentaryMajority: false,
    minorityGovernment: true,
  },
  {
    id: 'no-2000-stoltenberg-1',
    countryCode: 'NO',
    startDate: '2000-03-17',
    endDate: '2001-10-19',
    leaderName: 'Jens Stoltenberg',
    leaderTitle: 'Statsminister',
    leaderParty: 'Arbeiderpartiet',
    bloc: 'left',
    coalitionParties: ['Arbeiderpartiet'],
    parliamentaryMajority: false,
    minorityGovernment: true,
  },
  {
    id: 'no-1997-bondevik-1',
    countryCode: 'NO',
    startDate: '1997-10-17',
    endDate: '2000-03-17',
    leaderName: 'Kjell Magne Bondevik',
    leaderTitle: 'Statsminister',
    leaderParty: 'Kristelig Folkeparti',
    bloc: 'center',
    coalitionParties: ['KrF', 'Senterpartiet', 'Venstre'],
    parliamentaryMajority: false,
    minorityGovernment: true,
  },
  {
    id: 'no-1996-jagland',
    countryCode: 'NO',
    startDate: '1996-10-25',
    endDate: '1997-10-17',
    leaderName: 'Thorbjørn Jagland',
    leaderTitle: 'Statsminister',
    leaderParty: 'Arbeiderpartiet',
    bloc: 'left',
    coalitionParties: ['Arbeiderpartiet'],
    parliamentaryMajority: false,
    minorityGovernment: true,
  },
  {
    id: 'no-1990-brundtland-3',
    countryCode: 'NO',
    startDate: '1990-11-03',
    endDate: '1996-10-25',
    leaderName: 'Gro Harlem Brundtland',
    leaderTitle: 'Statsminister',
    leaderParty: 'Arbeiderpartiet',
    bloc: 'left',
    coalitionParties: ['Arbeiderpartiet'],
    parliamentaryMajority: false,
    minorityGovernment: true,
  },
  {
    id: 'no-1989-syse',
    countryCode: 'NO',
    startDate: '1989-10-16',
    endDate: '1990-11-03',
    leaderName: 'Jan P. Syse',
    leaderTitle: 'Statsminister',
    leaderParty: 'Høyre',
    bloc: 'right',
    coalitionParties: ['Høyre', 'KrF', 'Senterpartiet'],
    parliamentaryMajority: false,
    minorityGovernment: true,
  },
  {
    id: 'no-1986-brundtland-2',
    countryCode: 'NO',
    startDate: '1986-05-09',
    endDate: '1989-10-16',
    leaderName: 'Gro Harlem Brundtland',
    leaderTitle: 'Statsminister',
    leaderParty: 'Arbeiderpartiet',
    bloc: 'left',
    coalitionParties: ['Arbeiderpartiet'],
    parliamentaryMajority: false,
    minorityGovernment: true,
  },
  {
    id: 'no-1981-willoch',
    countryCode: 'NO',
    startDate: '1981-10-14',
    endDate: '1986-05-09',
    leaderName: 'Kåre Willoch',
    leaderTitle: 'Statsminister',
    leaderParty: 'Høyre',
    bloc: 'right',
    coalitionParties: ['Høyre', 'KrF', 'Senterpartiet'],
    parliamentaryMajority: false,
    minorityGovernment: true,
  },
  {
    id: 'no-1981-brundtland-1',
    countryCode: 'NO',
    startDate: '1981-02-04',
    endDate: '1981-10-14',
    leaderName: 'Gro Harlem Brundtland',
    leaderTitle: 'Statsminister',
    leaderParty: 'Arbeiderpartiet',
    bloc: 'left',
    coalitionParties: ['Arbeiderpartiet'],
    parliamentaryMajority: false,
    minorityGovernment: true,
  },
  {
    id: 'no-1976-nordli',
    countryCode: 'NO',
    startDate: '1976-01-15',
    endDate: '1981-02-04',
    leaderName: 'Odvar Nordli',
    leaderTitle: 'Statsminister',
    leaderParty: 'Arbeiderpartiet',
    bloc: 'left',
    coalitionParties: ['Arbeiderpartiet'],
    parliamentaryMajority: false,
    minorityGovernment: true,
  },
  {
    id: 'no-1972-korvald',
    countryCode: 'NO',
    startDate: '1972-10-18',
    endDate: '1973-10-16',
    leaderName: 'Lars Korvald',
    leaderTitle: 'Statsminister',
    leaderParty: 'Kristelig Folkeparti',
    bloc: 'center',
    coalitionParties: ['KrF', 'Senterpartiet', 'Venstre'],
    parliamentaryMajority: false,
    minorityGovernment: true,
  },
  {
    id: 'no-1973-bratteli-2',
    countryCode: 'NO',
    startDate: '1973-10-16',
    endDate: '1976-01-15',
    leaderName: 'Trygve Bratteli',
    leaderTitle: 'Statsminister',
    leaderParty: 'Arbeiderpartiet',
    bloc: 'left',
    coalitionParties: ['Arbeiderpartiet'],
    parliamentaryMajority: false,
    minorityGovernment: true,
  },
  {
    id: 'no-1971-bratteli-1',
    countryCode: 'NO',
    startDate: '1971-03-17',
    endDate: '1972-10-18',
    leaderName: 'Trygve Bratteli',
    leaderTitle: 'Statsminister',
    leaderParty: 'Arbeiderpartiet',
    bloc: 'left',
    coalitionParties: ['Arbeiderpartiet'],
    parliamentaryMajority: false,
    minorityGovernment: true,
  },
  {
    id: 'no-1965-borten',
    countryCode: 'NO',
    startDate: '1965-10-12',
    endDate: '1971-03-17',
    leaderName: 'Per Borten',
    leaderTitle: 'Statsminister',
    leaderParty: 'Senterpartiet',
    bloc: 'center',
    coalitionParties: ['Senterpartiet', 'Høyre', 'Venstre', 'KrF'],
    parliamentaryMajority: true,
    minorityGovernment: false,
  },
  {
    id: 'no-1963-gerhardsen-3',
    countryCode: 'NO',
    startDate: '1963-09-25',
    endDate: '1965-10-12',
    leaderName: 'Einar Gerhardsen',
    leaderTitle: 'Statsminister',
    leaderParty: 'Arbeiderpartiet',
    bloc: 'left',
    coalitionParties: ['Arbeiderpartiet'],
    parliamentaryMajority: true,
    minorityGovernment: false,
  },
  {
    id: 'no-1963-lyng',
    countryCode: 'NO',
    startDate: '1963-08-28',
    endDate: '1963-09-25',
    leaderName: 'John Lyng',
    leaderTitle: 'Statsminister',
    leaderParty: 'Høyre',
    bloc: 'right',
    coalitionParties: ['Høyre', 'Senterpartiet', 'Venstre', 'KrF'],
    parliamentaryMajority: false,
    minorityGovernment: true,
  },
  {
    id: 'no-1955-gerhardsen-2',
    countryCode: 'NO',
    startDate: '1955-01-22',
    endDate: '1963-08-28',
    leaderName: 'Einar Gerhardsen',
    leaderTitle: 'Statsminister',
    leaderParty: 'Arbeiderpartiet',
    bloc: 'left',
    coalitionParties: ['Arbeiderpartiet'],
    parliamentaryMajority: true,
    minorityGovernment: false,
  },
  {
    id: 'no-1951-torp',
    countryCode: 'NO',
    startDate: '1951-11-19',
    endDate: '1955-01-22',
    leaderName: 'Oscar Torp',
    leaderTitle: 'Statsminister',
    leaderParty: 'Arbeiderpartiet',
    bloc: 'left',
    coalitionParties: ['Arbeiderpartiet'],
    parliamentaryMajority: true,
    minorityGovernment: false,
  },
  {
    id: 'no-1945-gerhardsen-1',
    countryCode: 'NO',
    startDate: '1945-06-25',
    endDate: '1951-11-19',
    leaderName: 'Einar Gerhardsen',
    leaderTitle: 'Statsminister',
    leaderParty: 'Arbeiderpartiet',
    bloc: 'left',
    coalitionParties: ['Samlingsregjering', 'Arbeiderpartiet'],
    parliamentaryMajority: true,
    minorityGovernment: false,
  },
];
 
 // Danish governments
 export const GOVERNMENT_PERIODS_DK: GovernmentPeriod[] = [
   {
     id: 'dk-2022-frederiksen',
     countryCode: 'DK',
     startDate: '2022-12-15',
     endDate: null,
     leaderName: 'Mette Frederiksen',
     leaderTitle: 'Statsminister',
     leaderParty: 'Socialdemokratiet',
     bloc: 'coalition',
     coalitionParties: ['Socialdemokratiet', 'Venstre', 'Moderaterne'],
     parliamentaryMajority: true,
     minorityGovernment: false,
   },
   {
     id: 'dk-2019-frederiksen-1',
     countryCode: 'DK',
     startDate: '2019-06-27',
     endDate: '2022-12-15',
     leaderName: 'Mette Frederiksen',
     leaderTitle: 'Statsminister',
     leaderParty: 'Socialdemokratiet',
     bloc: 'left',
     coalitionParties: ['Socialdemokratiet'],
     parliamentaryMajority: false,
     minorityGovernment: true,
   },
   {
     id: 'dk-2015-rasmussen',
     countryCode: 'DK',
     startDate: '2015-06-28',
     endDate: '2019-06-27',
     leaderName: 'Lars Løkke Rasmussen',
     leaderTitle: 'Statsminister',
     leaderParty: 'Venstre',
     bloc: 'right',
     coalitionParties: ['Venstre', 'Liberal Alliance', 'Konservative'],
     parliamentaryMajority: false,
     minorityGovernment: true,
   },
 ];
 
 // Finnish governments
 export const GOVERNMENT_PERIODS_FI: GovernmentPeriod[] = [
   {
     id: 'fi-2023-orpo',
     countryCode: 'FI',
     startDate: '2023-06-20',
     endDate: null,
     leaderName: 'Petteri Orpo',
     leaderTitle: 'Pääministeri',
     leaderParty: 'Kokoomus',
     bloc: 'right',
     coalitionParties: ['Kokoomus', 'Perussuomalaiset', 'RKP'],
     parliamentaryMajority: true,
     minorityGovernment: false,
   },
   {
     id: 'fi-2019-marin',
     countryCode: 'FI',
     startDate: '2019-12-10',
     endDate: '2023-06-20',
     leaderName: 'Sanna Marin',
     leaderTitle: 'Pääministeri',
     leaderParty: 'SDP',
     bloc: 'left',
     coalitionParties: ['SDP', 'Keskusta', 'Vihreät', 'Vasemmistoliitto'],
     parliamentaryMajority: true,
     minorityGovernment: false,
   },
 ];
 
 // Japanese governments
 export const GOVERNMENT_PERIODS_JP: GovernmentPeriod[] = [
   {
     id: 'jp-2024-ishiba',
     countryCode: 'JP',
     startDate: '2024-10-01',
     endDate: null,
     leaderName: 'Shigeru Ishiba',
     leaderTitle: 'Prime Minister',
     leaderParty: 'LDP',
     bloc: 'right',
     coalitionParties: ['LDP', 'Komeito'],
     parliamentaryMajority: false,
     minorityGovernment: true,
   },
   {
     id: 'jp-2021-kishida',
     countryCode: 'JP',
     startDate: '2021-10-04',
     endDate: '2024-10-01',
     leaderName: 'Fumio Kishida',
     leaderTitle: 'Prime Minister',
     leaderParty: 'LDP',
     bloc: 'right',
     coalitionParties: ['LDP', 'Komeito'],
     parliamentaryMajority: true,
     minorityGovernment: false,
   },
   {
     id: 'jp-2012-abe',
     countryCode: 'JP',
     startDate: '2012-12-26',
     endDate: '2021-10-04',
     leaderName: 'Shinzō Abe',
     leaderTitle: 'Prime Minister',
     leaderParty: 'LDP',
     bloc: 'right',
     coalitionParties: ['LDP', 'Komeito'],
     parliamentaryMajority: true,
     minorityGovernment: false,
   },
 ];
 
 // Australian governments
 export const GOVERNMENT_PERIODS_AU: GovernmentPeriod[] = [
   {
     id: 'au-2022-albanese',
     countryCode: 'AU',
     startDate: '2022-05-23',
     endDate: null,
     leaderName: 'Anthony Albanese',
     leaderTitle: 'Prime Minister',
     leaderParty: 'Labor',
     bloc: 'left',
     coalitionParties: ['Labor'],
     parliamentaryMajority: true,
     minorityGovernment: false,
   },
   {
     id: 'au-2018-morrison',
     countryCode: 'AU',
     startDate: '2018-08-24',
     endDate: '2022-05-23',
     leaderName: 'Scott Morrison',
     leaderTitle: 'Prime Minister',
     leaderParty: 'Liberal',
     bloc: 'right',
     coalitionParties: ['Liberal Party', 'National Party'],
     parliamentaryMajority: true,
     minorityGovernment: false,
   },
 ];
 
 // Canadian governments
 export const GOVERNMENT_PERIODS_CA: GovernmentPeriod[] = [
   {
     id: 'ca-2015-trudeau',
     countryCode: 'CA',
     startDate: '2015-11-04',
     endDate: null,
     leaderName: 'Justin Trudeau',
     leaderTitle: 'Prime Minister',
     leaderParty: 'Liberal',
     bloc: 'left',
     coalitionParties: ['Liberal Party'],
     parliamentaryMajority: false,
     minorityGovernment: true,
   },
   {
     id: 'ca-2006-harper',
     countryCode: 'CA',
     startDate: '2006-02-06',
     endDate: '2015-11-04',
     leaderName: 'Stephen Harper',
     leaderTitle: 'Prime Minister',
     leaderParty: 'Conservative',
     bloc: 'right',
     coalitionParties: ['Conservative Party'],
     parliamentaryMajority: true,
     minorityGovernment: false,
   },
 ];
 
 // Italian governments
 export const GOVERNMENT_PERIODS_IT: GovernmentPeriod[] = [
   {
     id: 'it-2022-meloni',
     countryCode: 'IT',
     startDate: '2022-10-22',
     endDate: null,
     leaderName: 'Giorgia Meloni',
     leaderTitle: 'Presidente del Consiglio',
     leaderParty: "Fratelli d'Italia",
     bloc: 'right',
     coalitionParties: ['FdI', 'Lega', 'Forza Italia'],
     parliamentaryMajority: true,
     minorityGovernment: false,
   },
   {
     id: 'it-2021-draghi',
     countryCode: 'IT',
     startDate: '2021-02-13',
     endDate: '2022-10-22',
     leaderName: 'Mario Draghi',
     leaderTitle: 'Presidente del Consiglio',
     leaderParty: 'Indipendente',
     bloc: 'coalition',
     coalitionParties: ['PD', 'M5S', 'Lega', 'FI'],
     parliamentaryMajority: true,
     minorityGovernment: false,
   },
 ];
 
 // Spanish governments
 export const GOVERNMENT_PERIODS_ES: GovernmentPeriod[] = [
   {
     id: 'es-2018-sanchez',
     countryCode: 'ES',
     startDate: '2018-06-02',
     endDate: null,
     leaderName: 'Pedro Sánchez',
     leaderTitle: 'Presidente del Gobierno',
     leaderParty: 'PSOE',
     bloc: 'left',
     coalitionParties: ['PSOE', 'Sumar'],
     parliamentaryMajority: false,
     minorityGovernment: true,
   },
   {
     id: 'es-2011-rajoy',
     countryCode: 'ES',
     startDate: '2011-12-21',
     endDate: '2018-06-02',
     leaderName: 'Mariano Rajoy',
     leaderTitle: 'Presidente del Gobierno',
     leaderParty: 'PP',
     bloc: 'right',
     coalitionParties: ['Partido Popular'],
     parliamentaryMajority: true,
     minorityGovernment: false,
   },
 ];
 
 // Polish governments
 export const GOVERNMENT_PERIODS_PL: GovernmentPeriod[] = [
   {
     id: 'pl-2023-tusk',
     countryCode: 'PL',
     startDate: '2023-12-13',
     endDate: null,
     leaderName: 'Donald Tusk',
     leaderTitle: 'Prime Minister',
     leaderParty: 'PO',
     bloc: 'center',
     coalitionParties: ['PO', 'PSL', 'Nowa Lewica'],
     parliamentaryMajority: true,
     minorityGovernment: false,
   },
   {
     id: 'pl-2017-morawiecki',
     countryCode: 'PL',
     startDate: '2017-12-11',
     endDate: '2023-12-13',
     leaderName: 'Mateusz Morawiecki',
     leaderTitle: 'Prime Minister',
     leaderParty: 'PiS',
     bloc: 'right',
     coalitionParties: ['PiS'],
     parliamentaryMajority: true,
     minorityGovernment: false,
   },
 ];
 
 // Brazilian governments
 export const GOVERNMENT_PERIODS_BR: GovernmentPeriod[] = [
   {
     id: 'br-2023-lula',
     countryCode: 'BR',
     startDate: '2023-01-01',
     endDate: null,
     leaderName: 'Lula da Silva',
     leaderTitle: 'Presidente',
     leaderParty: 'PT',
     bloc: 'left',
     coalitionParties: ['PT', 'PSB'],
     parliamentaryMajority: false,
     minorityGovernment: true,
   },
   {
     id: 'br-2019-bolsonaro',
     countryCode: 'BR',
     startDate: '2019-01-01',
     endDate: '2023-01-01',
     leaderName: 'Jair Bolsonaro',
     leaderTitle: 'Presidente',
     leaderParty: 'PL',
     bloc: 'right',
     coalitionParties: ['PL', 'PP'],
     parliamentaryMajority: false,
     minorityGovernment: true,
   },
 ];
 
 // Indian governments
 export const GOVERNMENT_PERIODS_IN: GovernmentPeriod[] = [
   {
     id: 'in-2014-modi',
     countryCode: 'IN',
     startDate: '2014-05-26',
     endDate: null,
     leaderName: 'Narendra Modi',
     leaderTitle: 'Prime Minister',
     leaderParty: 'BJP',
     bloc: 'right',
     coalitionParties: ['BJP', 'NDA'],
     parliamentaryMajority: true,
     minorityGovernment: false,
   },
   {
     id: 'in-2004-singh',
     countryCode: 'IN',
     startDate: '2004-05-22',
     endDate: '2014-05-26',
     leaderName: 'Manmohan Singh',
     leaderTitle: 'Prime Minister',
     leaderParty: 'INC',
     bloc: 'left',
     coalitionParties: ['INC', 'UPA'],
     parliamentaryMajority: false,
     minorityGovernment: true,
   },
 ];
 
 // South Korean governments
 export const GOVERNMENT_PERIODS_KR: GovernmentPeriod[] = [
   {
     id: 'kr-2022-yoon',
     countryCode: 'KR',
     startDate: '2022-05-10',
     endDate: null,
     leaderName: 'Yoon Suk-yeol',
     leaderTitle: 'President',
     leaderParty: 'PPP',
     bloc: 'right',
     coalitionParties: ['People Power Party'],
     parliamentaryMajority: false,
     minorityGovernment: true,
   },
   {
     id: 'kr-2017-moon',
     countryCode: 'KR',
     startDate: '2017-05-10',
     endDate: '2022-05-10',
     leaderName: 'Moon Jae-in',
     leaderTitle: 'President',
     leaderParty: 'Democratic Party',
     bloc: 'left',
     coalitionParties: ['Democratic Party'],
     parliamentaryMajority: true,
     minorityGovernment: false,
   },
 ];
 
 // Extend the combined registry with all countries
 GOVERNMENT_REGISTRY['GB'] = GOVERNMENT_PERIODS_GB;
 GOVERNMENT_REGISTRY['FR'] = GOVERNMENT_PERIODS_FR;
 GOVERNMENT_REGISTRY['NO'] = GOVERNMENT_PERIODS_NO;
 GOVERNMENT_REGISTRY['DK'] = GOVERNMENT_PERIODS_DK;
 GOVERNMENT_REGISTRY['FI'] = GOVERNMENT_PERIODS_FI;
 GOVERNMENT_REGISTRY['JP'] = GOVERNMENT_PERIODS_JP;
 GOVERNMENT_REGISTRY['AU'] = GOVERNMENT_PERIODS_AU;
 GOVERNMENT_REGISTRY['CA'] = GOVERNMENT_PERIODS_CA;
 GOVERNMENT_REGISTRY['IT'] = GOVERNMENT_PERIODS_IT;
 GOVERNMENT_REGISTRY['ES'] = GOVERNMENT_PERIODS_ES;
 GOVERNMENT_REGISTRY['PL'] = GOVERNMENT_PERIODS_PL;
 GOVERNMENT_REGISTRY['BR'] = GOVERNMENT_PERIODS_BR;
 GOVERNMENT_REGISTRY['IN'] = GOVERNMENT_PERIODS_IN;
 GOVERNMENT_REGISTRY['KR'] = GOVERNMENT_PERIODS_KR;
 
 // Country metadata for budget explorer
 export interface CountryMeta {
   code: string;
   name: string;
   nameLocal: string;
   leaderTitle: string;
   population: number;
   currency: string;
   currencySymbol: string;
 }
 
 export const COUNTRY_META: Record<string, CountryMeta> = {
   'SE': { code: 'SE', name: 'Sweden', nameLocal: 'Sverige', leaderTitle: 'Statsminister', population: 10.5, currency: 'SEK', currencySymbol: 'kr' },
   'DE': { code: 'DE', name: 'Germany', nameLocal: 'Deutschland', leaderTitle: 'Bundeskanzler', population: 84.4, currency: 'EUR', currencySymbol: '€' },
   'US': { code: 'US', name: 'United States', nameLocal: 'USA', leaderTitle: 'President', population: 331.9, currency: 'USD', currencySymbol: '$' },
   'GB': { code: 'GB', name: 'United Kingdom', nameLocal: 'Storbritannien', leaderTitle: 'Prime Minister', population: 67.3, currency: 'GBP', currencySymbol: '£' },
   'FR': { code: 'FR', name: 'France', nameLocal: 'Frankrike', leaderTitle: 'Président', population: 67.8, currency: 'EUR', currencySymbol: '€' },
   'NO': { code: 'NO', name: 'Norway', nameLocal: 'Norge', leaderTitle: 'Statsminister', population: 5.5, currency: 'NOK', currencySymbol: 'kr' },
   'DK': { code: 'DK', name: 'Denmark', nameLocal: 'Danmark', leaderTitle: 'Statsminister', population: 5.9, currency: 'DKK', currencySymbol: 'kr' },
   'FI': { code: 'FI', name: 'Finland', nameLocal: 'Finland', leaderTitle: 'Pääministeri', population: 5.5, currency: 'EUR', currencySymbol: '€' },
   'JP': { code: 'JP', name: 'Japan', nameLocal: 'Japan', leaderTitle: 'Prime Minister', population: 125.1, currency: 'JPY', currencySymbol: '¥' },
   'AU': { code: 'AU', name: 'Australia', nameLocal: 'Australien', leaderTitle: 'Prime Minister', population: 26.0, currency: 'AUD', currencySymbol: '$' },
   'CA': { code: 'CA', name: 'Canada', nameLocal: 'Kanada', leaderTitle: 'Prime Minister', population: 40.1, currency: 'CAD', currencySymbol: '$' },
   'IT': { code: 'IT', name: 'Italy', nameLocal: 'Italien', leaderTitle: 'Presidente del Consiglio', population: 58.9, currency: 'EUR', currencySymbol: '€' },
   'ES': { code: 'ES', name: 'Spain', nameLocal: 'Spanien', leaderTitle: 'Presidente del Gobierno', population: 47.4, currency: 'EUR', currencySymbol: '€' },
   'PL': { code: 'PL', name: 'Poland', nameLocal: 'Polen', leaderTitle: 'Prime Minister', population: 37.8, currency: 'PLN', currencySymbol: 'zł' },
   'BR': { code: 'BR', name: 'Brazil', nameLocal: 'Brasilien', leaderTitle: 'Presidente', population: 214.3, currency: 'BRL', currencySymbol: 'R$' },
   'IN': { code: 'IN', name: 'India', nameLocal: 'Indien', leaderTitle: 'Prime Minister', population: 1417.2, currency: 'INR', currencySymbol: '₹' },
   'KR': { code: 'KR', name: 'South Korea', nameLocal: 'Sydkorea', leaderTitle: 'President', population: 51.7, currency: 'KRW', currencySymbol: '₩' },
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
