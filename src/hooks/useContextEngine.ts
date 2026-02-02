/**
 * WAVE 8: Context Engine Hook
 * 
 * Hook för att hämta och hantera kontextuell data.
 * Implementerar Block BM, BN, BP.
 */

import { useState, useEffect, useCallback } from 'react';
import { 
  CONTEXT_DIMENSIONS, 
  generateContextCards,
  type ContextItem,
  type ContextCard,
} from '@/config/contextEngineConfig';
import { 
  CROSS_DOMAIN_RELATIONS,
  findRelationsForDomain,
  type CrossDomainRelation,
} from '@/config/crossDomainConfig';
import { 
  getRequiredContext,
  validateContextPresence,
  type ContextLayer,
} from '@/config/economyModuleConfig';

interface ContextEngineState {
  isLoading: boolean;
  error: string | null;
  contextCards: ContextCard[];
  relatedMovements: ContextItem[];
  crossDomainRelations: CrossDomainRelation[];
  missingContextLayers: ContextLayer[];
}

interface UseContextEngineOptions {
  indicatorId: string;
  indicatorDomain: string;
  currentValue: number;
  previousValue: number;
  period: string;
}

/**
 * Hook för Context Engine
 */
export function useContextEngine({
  indicatorId,
  indicatorDomain,
  currentValue,
  previousValue,
  period,
}: UseContextEngineOptions) {
  const [state, setState] = useState<ContextEngineState>({
    isLoading: true,
    error: null,
    contextCards: [],
    relatedMovements: [],
    crossDomainRelations: [],
    missingContextLayers: [],
  });

  const loadContextData = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Simulera API-anrop för relaterade rörelser
      // I produktion: hämta från databas/API
      const mockRelatedMovements: ContextItem[] = generateMockMovements(
        indicatorDomain,
        currentValue - previousValue
      );

      // Generera context cards
      const contextCards = generateContextCards(indicatorId, mockRelatedMovements);

      // Hitta relevanta tvärsamband
      const crossDomainRelations = findRelationsForDomain(indicatorDomain);

      // Validera att nödvändiga kontextlager finns
      const requiredLayers = getRequiredContext(indicatorId);
      const presentLayers: ContextLayer[] = mockRelatedMovements
        .map(m => m.dimension as ContextLayer)
        .filter((v, i, a) => a.indexOf(v) === i);
      
      const validation = validateContextPresence(indicatorId, presentLayers);

      setState({
        isLoading: false,
        error: null,
        contextCards,
        relatedMovements: mockRelatedMovements,
        crossDomainRelations,
        missingContextLayers: validation.missing,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }));
    }
  }, [indicatorId, indicatorDomain, currentValue, previousValue]);

  useEffect(() => {
    loadContextData();
  }, [loadContextData]);

  return {
    ...state,
    refresh: loadContextData,
  };
}

/**
 * Generera mock-data för demonstration
 * I produktion: ersätts med riktiga API-anrop
 */
function generateMockMovements(domain: string, primaryChange: number): ContextItem[] {
  const relatedDimensions = CONTEXT_DIMENSIONS.filter(d => d.id !== domain);
  
  return relatedDimensions.slice(0, 8).map((dim, index) => {
    // Simulera korrelerade rörelser
    const baseChange = primaryChange * (0.3 + Math.random() * 0.7);
    const direction = Math.random() > 0.3 
      ? (baseChange >= 0 ? 'same' : 'opposite')
      : 'opposite';
    
    const change = direction === 'same' 
      ? baseChange * (0.5 + Math.random() * 0.5)
      : -baseChange * (0.3 + Math.random() * 0.5);

    return {
      dimension: dim.id,
      indicator: dim.exampleIndicators[0],
      change: change,
      changeDirection: change > 0.5 ? 'up' : change < -0.5 ? 'down' : 'stable',
      timeLag: Math.floor(Math.random() * 12),
      correlationStrength: 0.3 + Math.random() * 0.6,
      observationType: index < 3 ? 'concurrent' : index < 5 ? 'leading' : 'lagging',
    };
  });
}

/**
 * Hook för "What Else Moved?" funktionalitet
 */
export function useWhatElseMoved(
  primaryIndicator: string,
  primaryChange: number,
  period: string
) {
  const [movements, setMovements] = useState<Array<{
    indicator: string;
    domain: string;
    change: number;
    direction: 'up' | 'down' | 'stable';
    timing: 'before' | 'concurrent' | 'after';
    timeDelta: number;
    source: string;
  }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulera datahämtning
    const loadMovements = async () => {
      setIsLoading(true);
      
      // Mock data - i produktion: API-anrop
      const mockMovements = CONTEXT_DIMENSIONS.flatMap(dim => 
        dim.exampleIndicators.slice(0, 1).map(ind => {
          const change = (Math.random() - 0.5) * 10;
          return {
            indicator: ind,
            domain: dim.id,
            change,
            direction: (change > 1 ? 'up' : change < -1 ? 'down' : 'stable') as 'up' | 'down' | 'stable',
            timing: (['before', 'concurrent', 'after'] as const)[Math.floor(Math.random() * 3)],
            timeDelta: Math.floor(Math.random() * 6),
            source: 'SCB',
          };
        })
      );

      setMovements(mockMovements);
      setIsLoading(false);
    };

    loadMovements();
  }, [primaryIndicator, period]);

  return { movements, isLoading };
}

/**
 * Hook för tvärdomänkorrelationer
 */
export function useCrossDomainCorrelations(domains: string[]) {
  const [correlations, setCorrelations] = useState<CrossDomainRelation[]>([]);

  useEffect(() => {
    const relevant = CROSS_DOMAIN_RELATIONS.filter(rel =>
      rel.domains.some(d => domains.includes(d))
    );
    setCorrelations(relevant);
  }, [domains]);

  return correlations;
}
