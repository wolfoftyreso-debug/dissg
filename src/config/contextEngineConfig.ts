/**
 * WAVE 8 BLOCK BM: Context Engine
 * 
 * Det Bloomberg saknar: VARFÖR siffror rör sig.
 * Varje KPI sätts automatiskt i relation till 12 dimensioner.
 */

import { ContextLayer } from './economyModuleConfig';

export interface ContextDimension {
  id: ContextLayer;
  name: string;
  name_en: string;
  description: string;
  icon: string;
  exampleIndicators: string[];
  typicalLags: string; // "0-3 månader", "6-24 månader"
}

export interface ContextCard {
  type: 'related_changes' | 'concurrent_events' | 'influencing_factors';
  title: string;
  items: ContextItem[];
}

export interface ContextItem {
  dimension: ContextLayer;
  indicator: string;
  change: number;
  changeDirection: 'up' | 'down' | 'stable';
  timeLag: number; // månader
  correlationStrength: number; // 0-1
  observationType: 'concurrent' | 'leading' | 'lagging';
}

/**
 * BM1: Alla kontextdimensioner
 */
export const CONTEXT_DIMENSIONS: ContextDimension[] = [
  {
    id: 'demographics',
    name: 'Demografi',
    name_en: 'Demographics',
    description: 'Befolkningsstruktur, åldersfördelning, försörjningskvot',
    icon: 'Users',
    exampleIndicators: ['Befolkningstillväxt', 'Försörjningskvot', 'Medelålder'],
    typicalLags: '12-60 månader',
  },
  {
    id: 'migration',
    name: 'Migration',
    name_en: 'Migration',
    description: 'In- och utvandring, asyl, arbetskraftsinvandring',
    icon: 'Plane',
    exampleIndicators: ['Nettomigration', 'Asylinvandring', 'Arbetskraftsinvandring'],
    typicalLags: '6-24 månader',
  },
  {
    id: 'health',
    name: 'Hälsa',
    name_en: 'Health',
    description: 'Sjuklighet, vårdköer, livslängd, ohälsotal',
    icon: 'Heart',
    exampleIndicators: ['Ohälsotal', 'Vårdköer', 'Förväntad livslängd'],
    typicalLags: '3-12 månader',
  },
  {
    id: 'education',
    name: 'Utbildning',
    name_en: 'Education',
    description: 'Kunskapsresultat, avhopp, högskolebehörighet',
    icon: 'GraduationCap',
    exampleIndicators: ['PISA-resultat', 'Högskolebehörighet', 'Avhopp'],
    typicalLags: '24-120 månader',
  },
  {
    id: 'energy',
    name: 'Energi',
    name_en: 'Energy',
    description: 'Elpriser, energimix, kapacitet, fossilfrihet',
    icon: 'Zap',
    exampleIndicators: ['Spotpris el', 'Fossilfri andel', 'Effektbrist'],
    typicalLags: '0-6 månader',
  },
  {
    id: 'housing',
    name: 'Bostäder',
    name_en: 'Housing',
    description: 'Bostadsbrist, priser, byggande, trångboddhet',
    icon: 'Home',
    exampleIndicators: ['Bostadspriser', 'Byggstarter', 'Trångboddhet'],
    typicalLags: '6-36 månader',
  },
  {
    id: 'crime',
    name: 'Trygghet',
    name_en: 'Safety',
    description: 'Brottslighet, uppklaringsgrad, otrygghet',
    icon: 'Shield',
    exampleIndicators: ['Anmälda brott', 'Uppklaringsgrad', 'Trygghetsindex'],
    typicalLags: '3-12 månader',
  },
  {
    id: 'policy_decisions',
    name: 'Politiska beslut',
    name_en: 'Policy Decisions',
    description: 'Reformer, skatteändringar, regleringar',
    icon: 'Gavel',
    exampleIndicators: ['Skatteförändringar', 'Regeländringar', 'Reformer'],
    typicalLags: '6-48 månader',
  },
  {
    id: 'institutional_trust',
    name: 'Institutionellt förtroende',
    name_en: 'Institutional Trust',
    description: 'Förtroende för myndigheter, rättssystem, politik',
    icon: 'Building',
    exampleIndicators: ['Politikerförtroende', 'Myndighetsförtroende', 'Rättsystemet'],
    typicalLags: '12-36 månader',
  },
  {
    id: 'geopolitics',
    name: 'Geopolitik',
    name_en: 'Geopolitics',
    description: 'Internationella relationer, konflikter, handelsavtal',
    icon: 'Globe',
    exampleIndicators: ['Handelsavtal', 'Konflikter', 'Sanktioner'],
    typicalLags: '0-24 månader',
  },
  {
    id: 'climate',
    name: 'Klimat & Miljö',
    name_en: 'Climate & Environment',
    description: 'Utsläpp, extremväder, miljökvalitet',
    icon: 'Cloud',
    exampleIndicators: ['CO2-utsläpp', 'Extremväder', 'Luftkvalitet'],
    typicalLags: '12-120 månader',
  },
  {
    id: 'infrastructure',
    name: 'Infrastruktur',
    name_en: 'Infrastructure',
    description: 'Transport, digital, vatten, elnät',
    icon: 'Network',
    exampleIndicators: ['Järnvägspunktlighet', 'Bredband', 'Vägstandard'],
    typicalLags: '24-60 månader',
  },
];

/**
 * BM2: Generera Context Cards för en indikator
 */
export function generateContextCards(
  indicatorId: string,
  relatedChanges: ContextItem[]
): ContextCard[] {
  const concurrent = relatedChanges.filter(i => i.observationType === 'concurrent');
  const leading = relatedChanges.filter(i => i.observationType === 'leading');
  const lagging = relatedChanges.filter(i => i.observationType === 'lagging');

  return [
    {
      type: 'related_changes',
      title: 'Relaterade förändringar',
      items: [...leading, ...lagging].slice(0, 5),
    },
    {
      type: 'concurrent_events',
      title: 'Samtida händelser',
      items: concurrent.slice(0, 5),
    },
    {
      type: 'influencing_factors',
      title: 'Påverkande faktorer (observerade)',
      items: leading.filter(i => i.correlationStrength > 0.5).slice(0, 5),
    },
  ];
}

/**
 * Neutral formulering för samband
 */
export const NEUTRAL_RELATION_PHRASES = {
  sv: {
    concurrent: 'sammanfaller tidsmässigt med',
    leading: 'föregicks av förändring i',
    lagging: 'följdes av förändring i',
    correlation: 'uppvisar statistiskt samband med',
    noCorrelation: 'uppvisar inget observerat samband med',
  },
  en: {
    concurrent: 'coincides temporally with',
    leading: 'was preceded by change in',
    lagging: 'was followed by change in',
    correlation: 'shows statistical association with',
    noCorrelation: 'shows no observed association with',
  },
};

/**
 * Disclaimer för kontextuella observationer
 */
export const CONTEXT_DISCLAIMER = {
  sv: 'Observerade samband är statistiska korrelationer. Systemet drar inga slutsatser om orsakssamband.',
  en: 'Observed associations are statistical correlations. The system draws no conclusions about causation.',
};
