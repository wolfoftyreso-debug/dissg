/**
 * Map Mode Selector
 * 
 * Clean pill-style selector for switching between map views.
 * Inspired by Snapchat's simple UI.
 */

import React from 'react';
import type { MapMode } from './types';

interface MapModeSelectorProps {
  mode: MapMode;
  onChange: (mode: MapMode) => void;
}

const MODES: { id: MapMode; label: string; icon: string; description: string }[] = [
  { 
    id: 'satellite', 
    label: 'Foto', 
    icon: '🛰️',
    description: 'Satellitvyer av jorden'
  },
  { 
    id: '3d', 
    label: '3D', 
    icon: '🌐',
    description: 'Jordglob som du kan rotera'
  },
  { 
    id: '2d', 
    label: '2D', 
    icon: '🗺️',
    description: 'Klassisk platt karta'
  },
];

export function MapModeSelector({ mode, onChange }: MapModeSelectorProps) {
  return (
    <div 
      className="flex items-center gap-1 p-1 bg-white/95 backdrop-blur-md rounded-full shadow-lg border border-slate-200"
      role="tablist"
      aria-label="Välj kartvy"
    >
      {MODES.map((m) => {
        const isActive = mode === m.id;
        return (
          <button
            key={m.id}
            role="tab"
            aria-selected={isActive}
            aria-label={`${m.label}: ${m.description}`}
            onClick={() => onChange(m.id)}
            className={`
              flex items-center gap-2 px-4 py-2.5 rounded-full font-medium text-sm
              transition-all duration-200 ease-out
              ${isActive 
                ? 'bg-slate-900 text-white shadow-md' 
                : 'text-slate-600 hover:bg-slate-100'
              }
            `}
          >
            <span className="text-base">{m.icon}</span>
            <span>{m.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default MapModeSelector;
