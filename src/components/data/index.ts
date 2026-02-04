/**
 * INFINITE DEPTH DATA SYSTEM
 * ═══════════════════════════════════════════════════════════════
 * 
 * Core data presentation system following the Spotless Protocol:
 * Every piece of data must be clickable and lead to infinite depth.
 * 
 * Components:
 * - InfiniteDepthProvider: Context for managing depth navigation
 * - ClickableDataPoint: Wraps any value to make it explorable
 * - DepthExplorer: Full-screen modal for deep exploration
 * - DataDashboard: Full data access dashboard with tabs
 * - DataOverview: Avanza-inspired live overview
 * - DataAccessPage: Standalone tabbed data access
 */

// Provider and context
export { 
  InfiniteDepthProvider, 
  useInfiniteDepth,
  DEPTH_LEVEL_CONFIG,
  type DataPoint,
  type DepthLayer,
  type LayerData,
  type SourceReference,
  type DrillDownOption,
  type DepthLevelId,
} from './InfiniteDepthProvider';

// Data point component
export { ClickableDataPoint } from './ClickableDataPoint';

// Explorer modal
export { DepthExplorer } from './DepthExplorer';

// Dashboard components
export { DataDashboard } from './DataDashboard';
export { DataOverview, MiniSparkline } from './DataOverview';
export { DataAccessPage } from './DataAccessPage';
export { SortableIndexTable, IndexCategoryTables } from './SortableIndexTable';
export { 
  SourcesDrilldown, 
  CountriesDrilldown, 
  IndicatorsDrilldown, 
  TablesDrilldown 
} from './StatDrilldown';

// Utility: Create a simple data point with basic depth
export function createDataPoint(params: {
  id: string;
  value: string | number;
  label: string;
  type?: 'metric' | 'percentage' | 'currency' | 'date' | 'index' | 'count' | 'ratio' | 'text';
  unit?: string;
  observation?: string;
  mechanism?: string;
  methodology?: string;
  limitations?: string[];
  sources?: Array<{ name: string; url?: string }>;
}): import('./InfiniteDepthProvider').DataPoint {
  const depth: import('./InfiniteDepthProvider').DepthLayer[] = [];
  
  if (params.observation) {
    depth.push({
      level: 1,
      title: 'Observation',
      content: params.observation,
      shows: ['Aktuellt värde och trend'],
      doesNotShow: ['Kausalitet eller orsakssamband'],
    });
  }
  
  if (params.mechanism) {
    depth.push({
      level: 2,
      title: 'Mekanism',
      content: params.mechanism,
    });
  }
  
  if (params.methodology) {
    depth.push({
      level: 3,
      title: 'Metod',
      content: params.methodology,
      sources: params.sources?.map((s, i) => ({
        id: `source-${i}`,
        name: s.name,
        type: 'official' as const,
        url: s.url,
        accessDate: new Date().toISOString().split('T')[0],
        reliability: 85,
      })),
    });
  }
  
  if (params.limitations) {
    depth.push({
      level: 4,
      title: 'Begränsningar',
      content: 'Denna data har följande kända begränsningar:',
      doesNotShow: params.limitations,
    });
  }
  
  return {
    id: params.id,
    value: params.value,
    label: params.label,
    type: params.type || 'metric',
    unit: params.unit,
    depth,
  };
}
