/**
 * UI MISINTERPRETATION ATTACKS (D1-D2)
 * 
 * Tester som försöker:
 * - Skärmdump-kapning (D1)
 * - Scroll-fälla (D2)
 */

import type { RedTeamViolation } from '../red-team-checks';

export interface UIAttack {
  id: string;
  name: string;
  category: 'screenshot_hijack' | 'scroll_trap';
  description: string;
  validatorFn: (uiState: UIState) => UIAttackResult;
}

export interface UIState {
  visibleElements: UIElement[];
  viewportHeight: number;
  scrollPosition: number;
  totalContentHeight: number;
}

export interface UIElement {
  id: string;
  type: 'chart' | 'number' | 'text' | 'scope' | 'uncertainty' | 'caveat' | 'limitation';
  top: number; // pixels from top
  height: number;
  visible: boolean;
  required: boolean;
}

export interface UIAttackResult {
  passed: boolean;
  violations: RedTeamViolation[];
  contextComplete: boolean;
  uncertaintyVisible: boolean;
  executedAt: string;
}

/**
 * Required context elements that MUST be visible with any data
 */
const REQUIRED_CONTEXT_TYPES: UIElement['type'][] = [
  'scope',
  'uncertainty',
  'limitation',
];

/**
 * D1: SKÄRMDUMP-KAPNING
 * 
 * UI-element lösryckt ur kontext
 * 
 * PASS om: inget kan delas utan begränsningar
 */
export const ATTACK_D1_SCREENSHOT_HIJACK: UIAttack = {
  id: 'D1',
  name: 'Skärmdump-kapning',
  category: 'screenshot_hijack',
  description: 'Attempt to share UI element out of context',
  
  validatorFn: (uiState: UIState): UIAttackResult => {
    const violations: RedTeamViolation[] = [];
    
    // Find all data elements (charts, numbers)
    const dataElements = uiState.visibleElements.filter(
      e => e.type === 'chart' || e.type === 'number'
    );
    
    // For each data element, check if required context is visible
    for (const dataElement of dataElements) {
      const nearbyContext = uiState.visibleElements.filter(e => {
        const isContext = REQUIRED_CONTEXT_TYPES.includes(e.type);
        const isNearby = Math.abs(e.top - dataElement.top) < uiState.viewportHeight;
        return isContext && isNearby && e.visible;
      });
      
      // Check scope visibility
      const hasScope = nearbyContext.some(e => e.type === 'scope');
      if (!hasScope) {
        violations.push({
          code: 'D1-NO-SCOPE',
          description: `Data element ${dataElement.id} lacks visible scope context`,
          evidence: `No scope element within viewport of ${dataElement.id}`,
          recommendation: 'Scope must always be visible with data',
        });
      }
      
      // Check uncertainty visibility
      const hasUncertainty = nearbyContext.some(e => e.type === 'uncertainty');
      if (!hasUncertainty) {
        violations.push({
          code: 'D1-NO-UNCERTAINTY',
          description: `Data element ${dataElement.id} lacks visible uncertainty`,
          evidence: `No uncertainty element within viewport of ${dataElement.id}`,
          recommendation: 'Uncertainty must always be visible with data',
        });
      }
      
      // Check limitation/caveat visibility
      const hasLimitation = nearbyContext.some(e => e.type === 'limitation' || e.type === 'caveat');
      if (!hasLimitation) {
        violations.push({
          code: 'D1-NO-LIMITATION',
          description: `Data element ${dataElement.id} lacks visible limitations`,
          evidence: `No limitation element within viewport of ${dataElement.id}`,
          recommendation: '"Does not mean" must always be visible with data',
        });
      }
    }
    
    const contextComplete = violations.filter(v => 
      v.code.startsWith('D1-NO-')
    ).length === 0;
    
    const uncertaintyVisible = uiState.visibleElements.some(
      e => e.type === 'uncertainty' && e.visible
    );
    
    return {
      passed: violations.length === 0,
      violations,
      contextComplete,
      uncertaintyVisible,
      executedAt: new Date().toISOString(),
    };
  },
};

/**
 * D2: SCROLL-FÄLLA
 * 
 * Försök gömma osäkerhet "below the fold"
 * 
 * PASS om: osäkerhet alltid synlig
 */
export const ATTACK_D2_SCROLL_TRAP: UIAttack = {
  id: 'D2',
  name: 'Scroll-fälla',
  category: 'scroll_trap',
  description: 'Attempt to hide uncertainty below the fold',
  
  validatorFn: (uiState: UIState): UIAttackResult => {
    const violations: RedTeamViolation[] = [];
    
    // Check if uncertainty is above the fold (within initial viewport)
    const initialViewport = uiState.viewportHeight;
    
    const uncertaintyElements = uiState.visibleElements.filter(
      e => e.type === 'uncertainty'
    );
    
    if (uncertaintyElements.length === 0) {
      violations.push({
        code: 'D2-NO-UNCERTAINTY',
        description: 'No uncertainty element exists in UI',
        evidence: 'Zero uncertainty elements found',
        recommendation: 'Every data view must include uncertainty element',
      });
    } else {
      // Check if any uncertainty is above the fold
      const aboveFold = uncertaintyElements.filter(e => e.top < initialViewport);
      
      if (aboveFold.length === 0) {
        violations.push({
          code: 'D2-UNCERTAINTY-HIDDEN',
          description: 'All uncertainty elements are below the fold',
          evidence: `Highest uncertainty at ${Math.min(...uncertaintyElements.map(e => e.top))}px, viewport is ${initialViewport}px`,
          recommendation: 'At least one uncertainty indicator must be above the fold',
        });
      }
    }
    
    // Check that required elements cannot be scrolled past
    const requiredElements = uiState.visibleElements.filter(e => e.required);
    const scrolledPast = requiredElements.filter(e => 
      e.top + e.height < uiState.scrollPosition
    );
    
    if (scrolledPast.length > 0) {
      violations.push({
        code: 'D2-REQUIRED-SCROLLED',
        description: 'Required context elements can be scrolled past',
        evidence: `${scrolledPast.length} required elements above current scroll position`,
        recommendation: 'Required context must be sticky or repeated',
      });
    }
    
    const uncertaintyVisible = uncertaintyElements.some(e => 
      e.top >= uiState.scrollPosition && 
      e.top < uiState.scrollPosition + uiState.viewportHeight
    );
    
    return {
      passed: violations.length === 0,
      violations,
      contextComplete: violations.length === 0,
      uncertaintyVisible,
      executedAt: new Date().toISOString(),
    };
  },
};

/**
 * All UI attacks
 */
export const UI_ATTACKS: UIAttack[] = [
  ATTACK_D1_SCREENSHOT_HIJACK,
  ATTACK_D2_SCROLL_TRAP,
];

/**
 * Run UI attack
 */
export function runUIAttack(attackId: string, uiState: UIState): UIAttackResult {
  const attack = UI_ATTACKS.find(a => a.id === attackId);
  if (!attack) {
    return {
      passed: false,
      violations: [{
        code: 'UNKNOWN-ATTACK',
        description: `Unknown attack ID: ${attackId}`,
        evidence: '',
        recommendation: 'Use valid attack ID',
      }],
      contextComplete: false,
      uncertaintyVisible: false,
      executedAt: new Date().toISOString(),
    };
  }
  
  return attack.validatorFn(uiState);
}

/**
 * Run all UI attacks
 */
export function runAllUIAttacks(uiState: UIState): Map<string, UIAttackResult> {
  const results = new Map<string, UIAttackResult>();
  
  for (const attack of UI_ATTACKS) {
    const result = attack.validatorFn(uiState);
    results.set(attack.id, result);
  }
  
  return results;
}
