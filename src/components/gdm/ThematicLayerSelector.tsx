/**
 * THEMATIC LAYER SELECTOR
 * 
 * Unified selector for all thematic map layers:
 * - Regions (Continents, Blocs, Economic zones)
 * - Legal Status (Cannabis, etc.)
 * - Political Orientation
 * - Economic Status
 * - Military Strength
 */

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Globe, Scale, Vote, DollarSign, Shield } from 'lucide-react';
import { RegionTypeSelector, type RegionType } from './RegionIndicator';
import { LegalTopicSelector, type LegalTopic } from './LegalStatusIndicator';

export type ThematicLayer = 
  | { type: 'none' }
  | { type: 'region'; value: RegionType }
  | { type: 'legal'; value: LegalTopic }
  | { type: 'political' }
  | { type: 'economic' }
  | { type: 'military' };

interface ThematicLayerSelectorProps {
  activeLayer: ThematicLayer;
  onChange: (layer: ThematicLayer) => void;
  className?: string;
}

const LAYER_GROUPS = [
  {
    id: 'political',
    name: '🏛️ Politik',
    description: 'Vänster-höger skala',
    icon: Vote,
  },
  {
    id: 'economic',
    name: '💰 Ekonomi',
    description: 'BNP och välstånd',
    icon: DollarSign,
  },
  {
    id: 'military',
    name: '⚔️ Försvar',
    description: 'Militär styrka',
    icon: Shield,
  },
];

export function ThematicLayerSelector({ activeLayer, onChange, className = '' }: ThematicLayerSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showRegions, setShowRegions] = useState(false);
  const [showLegal, setShowLegal] = useState(false);

  const isAnyActive = activeLayer.type !== 'none';

  const handleLayerClick = (layerId: string) => {
    if (activeLayer.type === layerId) {
      onChange({ type: 'none' });
    } else {
      onChange({ type: layerId as 'political' | 'economic' | 'military' });
    }
  };

  const handleRegionChange = (region: RegionType | null) => {
    if (region) {
      onChange({ type: 'region', value: region });
      setShowLegal(false);
    } else {
      onChange({ type: 'none' });
    }
  };

  const handleLegalChange = (topic: LegalTopic | null) => {
    if (topic) {
      onChange({ type: 'legal', value: topic });
      setShowRegions(false);
    } else {
      onChange({ type: 'none' });
    }
  };

  return (
    <div className={`bg-white/95 backdrop-blur-md rounded-xl shadow-lg ${className}`}>
      {/* Header - always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          w-full flex items-center justify-between px-3 py-2 rounded-xl
          transition-all duration-200
          ${isAnyActive ? 'bg-slate-800 text-white' : 'hover:bg-slate-50'}
        `}
      >
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4" />
          <span className="text-sm font-medium">
            {activeLayer.type === 'none' ? 'Tematiska lager' : 
             activeLayer.type === 'region' ? '🌍 Regioner' :
             activeLayer.type === 'legal' ? '⚖️ Juridisk status' :
             activeLayer.type === 'political' ? '🏛️ Politik' :
             activeLayer.type === 'economic' ? '💰 Ekonomi' :
             activeLayer.type === 'military' ? '⚔️ Försvar' : 'Tematiska lager'}
          </span>
        </div>
        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="p-2 space-y-2 border-t border-slate-100">
          {/* Main layer buttons */}
          <div className="grid grid-cols-3 gap-1">
            {LAYER_GROUPS.map(layer => {
              const isActive = activeLayer.type === layer.id;
              return (
                <button
                  key={layer.id}
                  onClick={() => handleLayerClick(layer.id)}
                  className={`
                    p-2 rounded-lg text-center transition-all
                    ${isActive 
                      ? 'bg-slate-800 text-white' 
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700'}
                  `}
                >
                  <span className="text-lg block mb-1">
                    {layer.id === 'political' ? '🏛️' : 
                     layer.id === 'economic' ? '💰' : '⚔️'}
                  </span>
                  <span className="text-[10px] font-medium">
                    {layer.id === 'political' ? 'Politik' : 
                     layer.id === 'economic' ? 'Ekonomi' : 'Försvar'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Region sub-selector */}
          <div className="border-t border-slate-100 pt-2">
            <button
              onClick={() => {
                setShowRegions(!showRegions);
                setShowLegal(false);
              }}
              className={`
                w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs
                ${activeLayer.type === 'region' ? 'bg-slate-100' : 'hover:bg-slate-50'}
              `}
            >
              <span>🌍 Regioner</span>
              {showRegions ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
            {showRegions && (
              <div className="mt-1 pl-2">
                <RegionTypeSelector
                  selected={activeLayer.type === 'region' ? activeLayer.value : null}
                  onChange={handleRegionChange}
                />
              </div>
            )}
          </div>

          {/* Legal sub-selector */}
          <div className="border-t border-slate-100 pt-2">
            <button
              onClick={() => {
                setShowLegal(!showLegal);
                setShowRegions(false);
              }}
              className={`
                w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs
                ${activeLayer.type === 'legal' ? 'bg-slate-100' : 'hover:bg-slate-50'}
              `}
            >
              <span>⚖️ Juridisk status</span>
              {showLegal ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
            {showLegal && (
              <div className="mt-1 pl-2">
                <LegalTopicSelector
                  selected={activeLayer.type === 'legal' ? activeLayer.value : null}
                  onChange={handleLegalChange}
                />
              </div>
            )}
          </div>

          {/* Clear button */}
          {isAnyActive && (
            <button
              onClick={() => onChange({ type: 'none' })}
              className="w-full mt-2 px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
            >
              ✕ Rensa lager
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default ThematicLayerSelector;
