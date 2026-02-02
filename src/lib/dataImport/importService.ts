import { supabase } from '@/integrations/supabase/client';

export interface ImportOptions {
  sources?: ('scb' | 'kolada')[];
  indicators?: string[] | 'all';
  dryRun?: boolean;
}

export interface ImportResult {
  success: boolean;
  dryRun?: boolean;
  summary?: {
    fetched?: number;
    inserted?: number;
    totalValues?: number;
    errors?: string[];
    bySource?: Record<string, { fetched: number; errors: string[] }>;
    sampleValues?: any[];
  };
  error?: string;
}

export interface DataSourceInfo {
  id: string;
  name: string;
  description: string;
  indicators: {
    key: string;
    name: string;
    description: string;
  }[];
}

export const DATA_SOURCES: DataSourceInfo[] = [
  {
    id: 'scb',
    name: 'Statistiska Centralbyrån (SCB)',
    description: 'Sveriges officiella statistikmyndighet med data om befolkning, arbetsmarknad, ekonomi m.m.',
    indicators: [
      { key: 'life_expectancy', name: 'Medellivslängd', description: 'Förväntad livslängd vid födseln' },
      { key: 'employment_rate', name: 'Sysselsättningsgrad', description: 'Andel av befolkningen i arbete' },
      { key: 'population', name: 'Befolkning', description: 'Total befolkningsstorlek' },
    ]
  },
  {
    id: 'kolada',
    name: 'Kolada',
    description: 'Kommun- och landstingsdatabasen med nyckeltal för kommuner och regioner.',
    indicators: [
      { key: 'school_outcomes', name: 'Skolutfall', description: 'Elever som nått kunskapskraven i åk 9' },
      { key: 'healthcare_wait', name: 'Vårdköer', description: 'Väntetid till första besök i primärvård' },
      { key: 'elderly_care', name: 'Äldreomsorg', description: 'Brukarbedömning av äldreomsorg' },
      { key: 'unemployment', name: 'Arbetslöshet', description: 'Öppet arbetslösa 16-64 år' },
    ]
  }
];

/**
 * Trigger a data import from external APIs
 */
export async function triggerDataImport(options: ImportOptions = {}): Promise<ImportResult> {
  const { sources = ['scb', 'kolada'], indicators = 'all', dryRun = false } = options;
  
  try {
    const { data, error } = await supabase.functions.invoke('data-import', {
      body: { sources, indicators, dryRun }
    });
    
    if (error) {
      throw new Error(error.message);
    }
    
    return data as ImportResult;
  } catch (error) {
    console.error('Data import failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Get last import status from trust log
 */
export async function getLastImportStatus(): Promise<{
  lastImport: string | null;
  recentImports: { date: string; scope: string; reason: string }[];
}> {
  const { data } = await supabase
    .from('trust_log')
    .select('created_at, scope, reason')
    .eq('scope', 'data_import')
    .order('created_at', { ascending: false })
    .limit(10);
  
  return {
    lastImport: data?.[0]?.created_at || null,
    recentImports: (data || []).map(d => ({
      date: d.created_at,
      scope: d.scope,
      reason: d.reason
    }))
  };
}

/**
 * Get available data sources and their indicators
 */
export function getAvailableDataSources(): DataSourceInfo[] {
  return DATA_SOURCES;
}
