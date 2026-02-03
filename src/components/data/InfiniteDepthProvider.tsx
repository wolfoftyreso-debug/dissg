/**
 * INFINITE DEPTH PROVIDER
 * ═══════════════════════════════════════════════════════════════
 * 
 * Core principle: EVERY piece of data must be clickable and lead to
 * deeper understanding. The depth is infinite - you can always go
 * further until you reach raw data sources.
 * 
 * Architecture:
 * L0: Current View (what you see)
 * L1: Observation (what the data shows)
 * L2: Mechanism (why/how it works)
 * L3: Method (how we know)
 * L4: Limitations (what it doesn't show)
 * L5: Raw Data (underlying sources)
 * L6+: Cross-references and related systems
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';

// =============================================================================
// TYPES
// =============================================================================

export interface DataPoint {
  /** Unique identifier */
  id: string;
  
  /** The value displayed */
  value: string | number;
  
  /** Optional unit */
  unit?: string;
  
  /** Display label */
  label: string;
  
  /** Data type for specialized handling */
  type: 'metric' | 'percentage' | 'currency' | 'date' | 'index' | 'count' | 'ratio' | 'text';
  
  /** Depth layers for this data point */
  depth: DepthLayer[];
  
  /** Related data points (for cross-referencing) */
  related?: string[];
  
  /** Evidence link for verification */
  evidenceLink?: string;
  
  /** Geographic scope */
  geoScope?: string;
  
  /** Time scope */
  timeScope?: { start: string; end: string };
  
  /** Confidence level 0-1 */
  confidence?: number;
  
  /** Last updated timestamp */
  lastUpdated?: string;
}

export interface DepthLayer {
  level: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  
  /** What this level shows */
  title: string;
  
  /** Main content */
  content: string;
  
  /** Structured data for this level */
  data?: LayerData;
  
  /** Sources for this level */
  sources?: SourceReference[];
  
  /** Further drill-down options */
  drillDown?: DrillDownOption[];
  
  /** This shows / This does NOT show */
  shows?: string[];
  doesNotShow?: string[];
}

export interface LayerData {
  type: 'chart' | 'table' | 'list' | 'comparison' | 'timeline' | 'map' | 'breakdown';
  data: unknown;
  config?: Record<string, unknown>;
}

export interface SourceReference {
  id: string;
  name: string;
  type: 'official' | 'academic' | 'institutional' | 'calculated';
  url?: string;
  accessDate: string;
  reliability: number; // 0-100
  methodology?: string;
}

export interface DrillDownOption {
  id: string;
  label: string;
  description: string;
  targetDataPointId?: string;
  targetUrl?: string;
  icon?: string;
}

// Context for managing the depth navigation
interface DepthContext {
  /** Current active data point being explored */
  activeDataPoint: DataPoint | null;
  
  /** Current depth level */
  currentLevel: number;
  
  /** Navigation stack for breadcrumbs */
  navigationStack: Array<{ dataPoint: DataPoint; level: number }>;
  
  /** Open a data point for exploration */
  openDepth: (dataPoint: DataPoint, startLevel?: number) => void;
  
  /** Navigate to a specific level */
  goToLevel: (level: number) => void;
  
  /** Go back in navigation */
  goBack: () => void;
  
  /** Close depth explorer */
  closeDepth: () => void;
  
  /** Is depth explorer open */
  isOpen: boolean;
}

const InfiniteDepthContext = createContext<DepthContext | null>(null);

export const useInfiniteDepth = () => {
  const context = useContext(InfiniteDepthContext);
  if (!context) {
    throw new Error('useInfiniteDepth must be used within InfiniteDepthProvider');
  }
  return context;
};

// =============================================================================
// PROVIDER
// =============================================================================

interface InfiniteDepthProviderProps {
  children: ReactNode;
}

export const InfiniteDepthProvider: React.FC<InfiniteDepthProviderProps> = ({ children }) => {
  const [activeDataPoint, setActiveDataPoint] = useState<DataPoint | null>(null);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [navigationStack, setNavigationStack] = useState<Array<{ dataPoint: DataPoint; level: number }>>([]);
  const [isOpen, setIsOpen] = useState(false);
  
  const openDepth = (dataPoint: DataPoint, startLevel = 1) => {
    setActiveDataPoint(dataPoint);
    setCurrentLevel(startLevel);
    setNavigationStack([{ dataPoint, level: startLevel }]);
    setIsOpen(true);
  };
  
  const goToLevel = (level: number) => {
    if (activeDataPoint && level <= (activeDataPoint.depth.length - 1)) {
      setCurrentLevel(level);
    }
  };
  
  const goBack = () => {
    if (navigationStack.length > 1) {
      const newStack = navigationStack.slice(0, -1);
      const previous = newStack[newStack.length - 1];
      setNavigationStack(newStack);
      setActiveDataPoint(previous.dataPoint);
      setCurrentLevel(previous.level);
    } else {
      closeDepth();
    }
  };
  
  const closeDepth = () => {
    setIsOpen(false);
    setActiveDataPoint(null);
    setCurrentLevel(0);
    setNavigationStack([]);
  };
  
  return (
    <InfiniteDepthContext.Provider value={{
      activeDataPoint,
      currentLevel,
      navigationStack,
      openDepth,
      goToLevel,
      goBack,
      closeDepth,
      isOpen,
    }}>
      {children}
    </InfiniteDepthContext.Provider>
  );
};

// =============================================================================
// LEVEL CONFIGURATION
// =============================================================================

export const DEPTH_LEVEL_CONFIG = {
  0: {
    id: 0,
    labelSv: 'Vy',
    labelEn: 'View',
    descriptionSv: 'Aktuell presentation',
    descriptionEn: 'Current presentation',
    color: 'hsl(var(--muted))',
    icon: 'Eye',
  },
  1: {
    id: 1,
    labelSv: 'Observation',
    labelEn: 'Observation',
    descriptionSv: 'Vad visar datan?',
    descriptionEn: 'What does the data show?',
    color: 'hsl(var(--primary))',
    icon: 'BarChart3',
  },
  2: {
    id: 2,
    labelSv: 'Mekanism',
    labelEn: 'Mechanism',
    descriptionSv: 'Hur fungerar det?',
    descriptionEn: 'How does it work?',
    color: 'hsl(var(--secondary))',
    icon: 'Zap',
  },
  3: {
    id: 3,
    labelSv: 'Metod',
    labelEn: 'Method',
    descriptionSv: 'Hur vet vi detta?',
    descriptionEn: 'How do we know this?',
    color: 'hsl(var(--accent))',
    icon: 'Microscope',
  },
  4: {
    id: 4,
    labelSv: 'Begränsningar',
    labelEn: 'Limitations',
    descriptionSv: 'Vad visar detta INTE?',
    descriptionEn: 'What does this NOT show?',
    color: 'hsl(var(--destructive))',
    icon: 'AlertTriangle',
  },
  5: {
    id: 5,
    labelSv: 'Rådata',
    labelEn: 'Raw Data',
    descriptionSv: 'Underliggande källor',
    descriptionEn: 'Underlying sources',
    color: 'hsl(var(--muted-foreground))',
    icon: 'Database',
  },
  6: {
    id: 6,
    labelSv: 'Kopplingar',
    labelEn: 'Connections',
    descriptionSv: 'Relaterade system och data',
    descriptionEn: 'Related systems and data',
    color: 'hsl(var(--primary))',
    icon: 'Network',
  },
} as const;

export type DepthLevelId = keyof typeof DEPTH_LEVEL_CONFIG;
