export type KPIStatus = 'positive' | 'warning' | 'critical' | 'neutral';
export type TrendDirection = 'up' | 'down' | 'stable';

export interface KPI {
  id: string;
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
  description?: string;
}

export type KPICategory = 
  | 'demografi_halsa'
  | 'arbetsformaga_produktivitet'
  | 'offentliga_karnfunktioner'
  | 'social_stabilitet'
  | 'ekonomisk_barkraft'
  | 'systemrisker';

export interface CategoryMeta {
  id: KPICategory;
  name: string;
  description: string;
}

export const CATEGORIES: CategoryMeta[] = [
  { id: 'demografi_halsa', name: 'Demografi & Hälsa', description: 'Befolkningsutveckling och folkhälsa' },
  { id: 'arbetsformaga_produktivitet', name: 'Arbetsförmåga & Produktivitet', description: 'Arbetskraft och ekonomisk aktivitet' },
  { id: 'offentliga_karnfunktioner', name: 'Offentliga Kärnfunktioner', description: 'Statens grundläggande funktioner' },
  { id: 'social_stabilitet', name: 'Social Stabilitet', description: 'Samhällssammanhållning och trygghet' },
  { id: 'ekonomisk_barkraft', name: 'Ekonomisk Bärkraft', description: 'Finansiell hållbarhet och tillväxt' },
  { id: 'systemrisker', name: 'Systemrisker', description: 'Strukturella hot och sårbarheter' },
];
