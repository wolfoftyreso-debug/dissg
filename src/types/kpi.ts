export type KPIStatus = 'positive' | 'warning' | 'critical' | 'neutral';
export type TrendDirection = 'up' | 'down' | 'stable';

export interface DataSource {
  name: string;
  updateFrequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  reliability: number; // 0-100
}

export interface RedFlag {
  condition: string;
  threshold?: string;
}

// Simple explanation for the "Explain Simply" feature
export interface SimpleExplanation {
  oneLiner: string; // Single sentence a 12-year-old can understand
  icon: string; // Emoji icon for the KPI
  goodDirection: 'up' | 'down'; // Which direction is good for this KPI
  whatItMeasures: string; // Clear description of what's being measured
  whyItMatters: string; // Why this matters for society
}

export interface KPI {
  id: string;
  index: number; // 1-20
  name: string;
  category: KPICategory;
  value: number;
  unit: string;
  previousValue: number;
  status: KPIStatus;
  trend: TrendDirection;
  trendPercent: number;
  confidence: number; // 0-100
  lastUpdated: string;
  shortTermTrend: string; // 4-12 weeks
  longTermTrend: string; // 6-12 months
  description: string;
  rationale: string; // Why this KPI matters
  dataSources: DataSource[];
  redFlags: RedFlag[];
  breakdownAvailable: ('region' | 'age' | 'time' | 'gender')[];
  inverted?: boolean; // True if decrease is positive
  simpleExplanation?: SimpleExplanation; // For "Explain Simply" feature
}

export type KPICategory = 
  | 'demografi_halsa'
  | 'arbete_produktivitet'
  | 'ekonomisk_barkraft'
  | 'social_stabilitet'
  | 'karnsystem_funktion'
  | 'infrastruktur'
  | 'systemrisk_styrning';

export interface CategoryMeta {
  id: KPICategory;
  code: string;
  name: string;
  description: string;
}

export const CATEGORIES: CategoryMeta[] = [
  { id: 'demografi_halsa', code: 'A', name: 'Demografi & Hälsa', description: 'Systemets bottenplatta' },
  { id: 'arbete_produktivitet', code: 'B', name: 'Arbete & Produktivitet', description: 'Välståndsmotorn' },
  { id: 'ekonomisk_barkraft', code: 'C', name: 'Ekonomisk Bärkraft', description: 'Bränslet' },
  { id: 'social_stabilitet', code: 'D', name: 'Social Stabilitet', description: 'Friktion & Risk' },
  { id: 'karnsystem_funktion', code: 'E', name: 'Kärnsystemens Funktion', description: 'Statens kompetens' },
  { id: 'infrastruktur', code: 'F', name: 'Bostad, Energi, Infrastruktur', description: 'Flöden' },
  { id: 'systemrisk_styrning', code: 'G', name: 'Systemrisk & Styrning', description: 'Ledningens spegel' },
];
