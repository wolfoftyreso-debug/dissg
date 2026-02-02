/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SPOTLESS PROTOCOL - Quality Assurance Infrastructure
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * This context provides system-wide quality tracking for the Spotless Protocol.
 * Every page, component and data point must register its compliance status.
 * 
 * REQUIREMENTS (per Spotless Protocol):
 * 1. Universal Clickability - Everything clickable, no dead ends
 * 2. Source Attribution - 5 mandatory fields per data point
 * 3. Source Depth - Sources are nodes, not footnotes
 * 4. Shows/Doesn't Show - Mandatory limitation blocks
 * 5. Aggregation Inspection - 1-click to bottom
 * 6. Misinterpretation Guard - Active blocking of invalid views
 * 7. Linguistic Precision - No loose words
 * 8. Trust Log - Automatic change logging
 */

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface SourceAttribution {
  primarySource: string;
  publicationDate: string;
  dataCoverage: string;
  methodType: string;
  originalSourceUrl: string;
}

export interface LimitationBlock {
  whatThisShows: string[];
  whatThisDoesNotShow: string[];
  timePeriod: string;
  geographicResolution: string;
  commonMisinterpretations?: string[];
}

export interface SpotlessViolation {
  id: string;
  type: 
    | 'missing_source' 
    | 'non_clickable' 
    | 'missing_limitation_block'
    | 'dead_end'
    | 'hidden_uncertainty'
    | 'invalid_comparison'
    | 'loose_language'
    | 'hover_only_source'
    | 'insufficient_data';
  severity: 'critical' | 'warning' | 'info';
  element: string;
  description: string;
  location: string;
}

export interface PageCompliance {
  pageId: string;
  pagePath: string;
  totalElements: number;
  clickableElements: number;
  sourcedElements: number;
  hasLimitationBlock: boolean;
  violations: SpotlessViolation[];
  score: number; // 0-100
  isSpotless: boolean;
  lastAudit: string;
}

export interface SpotlessState {
  isAuditMode: boolean;
  currentPageCompliance: PageCompliance | null;
  globalViolations: SpotlessViolation[];
  pagesAudited: Record<string, PageCompliance>;
  globalScore: number;
}

interface SpotlessContextValue extends SpotlessState {
  // Audit controls
  enableAuditMode: () => void;
  disableAuditMode: () => void;
  
  // Registration
  registerElement: (elementId: string, hasSource: boolean, isClickable: boolean) => void;
  registerViolation: (violation: Omit<SpotlessViolation, 'id'>) => void;
  registerPageCompliance: (compliance: PageCompliance) => void;
  
  // Validation
  validateSource: (source: Partial<SourceAttribution>) => { isValid: boolean; missing: string[] };
  validateLimitationBlock: (block: Partial<LimitationBlock>) => { isValid: boolean; missing: string[] };
  
  // Queries
  getPageScore: (pageId: string) => number;
  getViolationsForPage: (pageId: string) => SpotlessViolation[];
  isPageSpotless: (pageId: string) => boolean;
}

const SpotlessContext = createContext<SpotlessContextValue | null>(null);

// ═══════════════════════════════════════════════════════════════════════════
// FORBIDDEN LANGUAGE (per Spotless Protocol §7)
// ═══════════════════════════════════════════════════════════════════════════

export const FORBIDDEN_WORDS = [
  'förbättras', 'förbättrats', 'förbättra',
  'försämras', 'försämrats', 'försämra',
  'starkt samband', 'stark korrelation',
  'tydlig trend', 'tydligt mönster',
  'signifikant', 'significant', // unless with p-value
  'dramatically', 'drastically',
  'obviously', 'clearly', 'certainly',
  'proves', 'bevisar',
  'causes', 'orsakar', 'leder till',
  'better', 'worse', 'bättre', 'sämre', // without defined baseline
] as const;

export const ALLOWED_PATTERNS = [
  /observed (increase|decrease|change) of \d+(\.\d+)?%? (within|during|over) period/i,
  /correlation of -?\d+(\.\d+)? under (these|the following) constraints/i,
  /data coverage insufficient to conclude/i,
  /p\s*[=<>]\s*0\.\d+/i, // p-values
  /\d+(\.\d+)?% (confidence|konfidens)/i,
] as const;

// ═══════════════════════════════════════════════════════════════════════════
// PROVIDER
// ═══════════════════════════════════════════════════════════════════════════

export function SpotlessProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SpotlessState>({
    isAuditMode: false,
    currentPageCompliance: null,
    globalViolations: [],
    pagesAudited: {},
    globalScore: 100,
  });

  const enableAuditMode = useCallback(() => {
    setState(prev => ({ ...prev, isAuditMode: true }));
  }, []);

  const disableAuditMode = useCallback(() => {
    setState(prev => ({ ...prev, isAuditMode: false }));
  }, []);

  const registerElement = useCallback((elementId: string, hasSource: boolean, isClickable: boolean) => {
    if (!hasSource) {
      setState(prev => ({
        ...prev,
        globalViolations: [
          ...prev.globalViolations,
          {
            id: `${elementId}-source-${Date.now()}`,
            type: 'missing_source',
            severity: 'critical',
            element: elementId,
            description: 'Datapunkt saknar fullständig källattribution',
            location: window.location.pathname,
          }
        ]
      }));
    }
    if (!isClickable) {
      setState(prev => ({
        ...prev,
        globalViolations: [
          ...prev.globalViolations,
          {
            id: `${elementId}-click-${Date.now()}`,
            type: 'non_clickable',
            severity: 'critical',
            element: elementId,
            description: 'Element är inte klickbart',
            location: window.location.pathname,
          }
        ]
      }));
    }
  }, []);

  const registerViolation = useCallback((violation: Omit<SpotlessViolation, 'id'>) => {
    setState(prev => ({
      ...prev,
      globalViolations: [
        ...prev.globalViolations,
        { ...violation, id: `${violation.element}-${Date.now()}` }
      ]
    }));
  }, []);

  const registerPageCompliance = useCallback((compliance: PageCompliance) => {
    setState(prev => {
      const newPagesAudited = { ...prev.pagesAudited, [compliance.pageId]: compliance };
      const allScores = Object.values(newPagesAudited).map(p => p.score);
      const globalScore = allScores.length > 0 
        ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length)
        : 100;
      
      return {
        ...prev,
        pagesAudited: newPagesAudited,
        globalScore,
        currentPageCompliance: compliance,
      };
    });
  }, []);

  const validateSource = useCallback((source: Partial<SourceAttribution>) => {
    const required: (keyof SourceAttribution)[] = [
      'primarySource',
      'publicationDate', 
      'dataCoverage',
      'methodType',
      'originalSourceUrl'
    ];
    const missing = required.filter(field => !source[field]);
    return { isValid: missing.length === 0, missing };
  }, []);

  const validateLimitationBlock = useCallback((block: Partial<LimitationBlock>) => {
    const missing: string[] = [];
    if (!block.whatThisShows || block.whatThisShows.length === 0) {
      missing.push('whatThisShows');
    }
    if (!block.whatThisDoesNotShow || block.whatThisDoesNotShow.length === 0) {
      missing.push('whatThisDoesNotShow');
    }
    if (!block.timePeriod) missing.push('timePeriod');
    if (!block.geographicResolution) missing.push('geographicResolution');
    return { isValid: missing.length === 0, missing };
  }, []);

  const getPageScore = useCallback((pageId: string) => {
    return state.pagesAudited[pageId]?.score ?? 100;
  }, [state.pagesAudited]);

  const getViolationsForPage = useCallback((pageId: string) => {
    return state.globalViolations.filter(v => v.location === pageId);
  }, [state.globalViolations]);

  const isPageSpotless = useCallback((pageId: string) => {
    return state.pagesAudited[pageId]?.isSpotless ?? false;
  }, [state.pagesAudited]);

  const value: SpotlessContextValue = {
    ...state,
    enableAuditMode,
    disableAuditMode,
    registerElement,
    registerViolation,
    registerPageCompliance,
    validateSource,
    validateLimitationBlock,
    getPageScore,
    getViolationsForPage,
    isPageSpotless,
  };

  return (
    <SpotlessContext.Provider value={value}>
      {children}
    </SpotlessContext.Provider>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// HOOK
// ═══════════════════════════════════════════════════════════════════════════

export function useSpotless() {
  const context = useContext(SpotlessContext);
  if (!context) {
    throw new Error('useSpotless must be used within SpotlessProvider');
  }
  return context;
}

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Check if text contains forbidden language
 */
export function detectForbiddenLanguage(text: string): { hasForbidden: boolean; matches: string[] } {
  const lowercaseText = text.toLowerCase();
  const matches = FORBIDDEN_WORDS.filter(word => lowercaseText.includes(word.toLowerCase()));
  
  // Check if any allowed pattern makes it acceptable
  const hasAllowedPattern = ALLOWED_PATTERNS.some(pattern => pattern.test(text));
  
  return {
    hasForbidden: matches.length > 0 && !hasAllowedPattern,
    matches,
  };
}

/**
 * Standard fallback text when data cannot be shown reliably
 */
export const INSUFFICIENT_DATA_TEXT = {
  sv: 'Denna vy kan inte visas tillförlitligt med tillgänglig data.',
  en: 'This view cannot be presented reliably with available data.',
} as const;

/**
 * Calculate compliance score for a page
 */
export function calculatePageScore(
  totalElements: number,
  clickableElements: number,
  sourcedElements: number,
  hasLimitationBlock: boolean,
  violationCount: number
): number {
  if (totalElements === 0) return 100;
  
  const clickableScore = (clickableElements / totalElements) * 30;
  const sourcedScore = (sourcedElements / totalElements) * 40;
  const limitationScore = hasLimitationBlock ? 20 : 0;
  const violationPenalty = Math.min(violationCount * 5, 50);
  
  return Math.max(0, Math.round(clickableScore + sourcedScore + limitationScore + 10 - violationPenalty));
}
