/**
 * Index Pills
 * 
 * Simple, colorful pills to select what data to show on the map.
 * Each pill has a clear icon and label explaining what it measures.
 */

import React, { useState } from 'react';
import type { MapLayerId } from './types';

interface IndexPillsProps {
  activeIndex: MapLayerId;
  onSelectIndex: (index: MapLayerId) => void;
}

interface IndexInfo {
  id: MapLayerId;
  icon: string;
  label: string;
  shortLabel: string;
  description: string;
  whatItMeasures: string;
  color: string;
}

const INDICES: IndexInfo[] = [
  { 
    id: 'lambda', 
    icon: '⚖️', 
    label: 'Samhällsbalans',
    shortLabel: 'Balans',
    description: 'Hur väl samhället fungerar som helhet',
    whatItMeasures: 'Ett genomsnitt av alla mätningar nedan',
    color: 'bg-blue-500'
  },
  { 
    id: 'health', 
    icon: '🏥', 
    label: 'Hälsa',
    shortLabel: 'Hälsa',
    description: 'Hur friska människor är',
    whatItMeasures: 'Livslängd, sjukvårdens kvalitet, barnadödlighet',
    color: 'bg-rose-500'
  },
  { 
    id: 'labor', 
    icon: '💼', 
    label: 'Ekonomi & Jobb',
    shortLabel: 'Jobb',
    description: 'Hur bra ekonomin fungerar för vanliga människor',
    whatItMeasures: 'Arbetslöshet, löneutveckling, fattigdom',
    color: 'bg-amber-500'
  },
  { 
    id: 'climate', 
    icon: '🌱', 
    label: 'Miljö',
    shortLabel: 'Miljö',
    description: 'Hur väl landet tar hand om miljön',
    whatItMeasures: 'Utsläpp, förnybar energi, biologisk mångfald',
    color: 'bg-emerald-500'
  },
  { 
    id: 'education', 
    icon: '📚', 
    label: 'Utbildning',
    shortLabel: 'Skola',
    description: 'Hur bra utbildningssystemet fungerar',
    whatItMeasures: 'PISA-resultat, andel som går klart skolan',
    color: 'bg-violet-500'
  },
];

export function IndexPills({ activeIndex, onSelectIndex }: IndexPillsProps) {
  const [expandedId, setExpandedId] = useState<MapLayerId | null>(null);

  const handleClick = (id: MapLayerId) => {
    if (activeIndex === id) {
      // Toggle expansion if already selected
      setExpandedId(expandedId === id ? null : id);
    } else {
      onSelectIndex(id);
      setExpandedId(null);
    }
  };

  return (
    <div className="flex flex-col items-end gap-2">
      {/* Main pills */}
      <div className="flex flex-col gap-1.5">
        {INDICES.map((index) => {
          const isActive = activeIndex === index.id;
          const isExpanded = expandedId === index.id;
          
          return (
            <div key={index.id} className="flex flex-col items-end">
              <button
                onClick={() => handleClick(index.id)}
                aria-pressed={isActive}
                aria-expanded={isExpanded}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-xl
                  font-medium text-sm transition-all duration-200
                  ${isActive 
                    ? `${index.color} text-white shadow-lg` 
                    : 'bg-white/95 text-slate-700 hover:bg-white shadow-md border border-slate-200'
                  }
                `}
              >
                <span className="text-base">{index.icon}</span>
                <span>{index.shortLabel}</span>
                {isActive && (
                  <span className="ml-1 text-white/80 text-xs">
                    {isExpanded ? '▲' : '▼'}
                  </span>
                )}
              </button>

              {/* Expanded info card */}
              {isExpanded && (
                <div className="mt-2 p-3 bg-white rounded-xl shadow-lg border border-slate-200 max-w-[250px] text-left animate-in slide-in-from-top-2 duration-200">
                  <h3 className="font-semibold text-slate-900 mb-1">
                    {index.label}
                  </h3>
                  <p className="text-xs text-slate-600 mb-2">
                    {index.description}
                  </p>
                  <div className="pt-2 border-t border-slate-100">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">
                      Vad mäts?
                    </p>
                    <p className="text-xs text-slate-700">
                      {index.whatItMeasures}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend hint */}
      <div className="mt-2 text-[10px] text-slate-500 bg-white/80 px-2 py-1 rounded-lg">
        Tryck för info · Dubbelklicka för land
      </div>
    </div>
  );
}

export default IndexPills;
