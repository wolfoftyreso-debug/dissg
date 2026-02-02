/**
 * OBSERVATION CARD LIST
 * 
 * Displays multiple observation cards with filtering options.
 */

import { ObservationCard } from './ObservationCard';
import type { ObservationCard as ObservationCardType, ObservationType } from '@/types/ai-observation';
import { useState } from 'react';

interface ObservationCardListProps {
  observations: ObservationCardType[];
  onViewRawData?: (sourceIds: string[]) => void;
}

export function ObservationCardList({ observations, onViewRawData }: ObservationCardListProps) {
  const [filter, setFilter] = useState<ObservationType | 'all'>('all');
  
  const typeLabels: Record<ObservationType | 'all', string> = {
    all: 'Alla',
    deviation: 'Avvikelser',
    comovement: 'Samvariationer',
    stability: 'Stabilitet',
    alternative: 'Alternativ'
  };
  
  const filteredObservations = filter === 'all' 
    ? observations 
    : observations.filter(o => o.observation_type === filter);
  
  const typeCounts = observations.reduce((acc, o) => {
    acc[o.observation_type] = (acc[o.observation_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  if (observations.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Inga observationer tillgängliga.</p>
        <p className="text-xs mt-1">Välj variabler och tidsperiod för att generera observationer.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {/* Filter tabs - text only */}
      <div className="flex flex-wrap gap-2">
        {(['all', 'deviation', 'comovement', 'stability', 'alternative'] as const).map((type) => {
          const count = type === 'all' ? observations.length : (typeCounts[type] || 0);
          const isActive = filter === type;
          
          return (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                isActive 
                  ? 'bg-primary text-primary-foreground border-primary' 
                  : 'bg-background border-border hover:border-foreground/20'
              }`}
            >
              {typeLabels[type]} ({count})
            </button>
          );
        })}
      </div>
      
      {/* Cards */}
      <div className="space-y-3">
        {filteredObservations.map((observation) => (
          <ObservationCard
            key={observation.id}
            observation={observation}
            onViewRawData={onViewRawData}
          />
        ))}
      </div>
      
      {/* Summary disclaimer */}
      <div className="pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          Visar {filteredObservations.length} av {observations.length} observationer. 
          Alla mönster är matematiska observationer utan kausal tolkning.
        </p>
      </div>
    </div>
  );
}
