/**
 * Layer Selection Panel
 * 
 * Checkbox-based layer control with compatibility warnings.
 * MYNDIGHETSDESIGN: Strikt, klinisk, inga spel-liknande effekter.
 * NO ICONS per no-icons-doctrine.
 */

import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MAP_LAYERS, type MapLayerId } from './types';

interface LayerPanelProps {
  activeLayers: MapLayerId[];
  onToggleLayer: (layerId: MapLayerId) => void;
  isPro: boolean;
}

export function LayerPanel({ activeLayers, onToggleLayer, isPro }: LayerPanelProps) {
  const layers = Object.values(MAP_LAYERS);

  // Check for incompatible layers
  const incompatibleWarnings: string[] = [];
  activeLayers.forEach(layerId => {
    const layer = MAP_LAYERS[layerId];
    if (layer?.incompatibleWith) {
      layer.incompatibleWith.forEach(incomp => {
        if (activeLayers.includes(incomp)) {
          incompatibleWarnings.push(`${layer.name.sv} + ${MAP_LAYERS[incomp].name.sv}`);
        }
      });
    }
  });

  // Check for non-comparable layers
  const nonComparableLayers = activeLayers
    .map(id => MAP_LAYERS[id])
    .filter(l => !l.isComparable);

  return (
    <div className="absolute top-4 right-16 z-10 w-64 pointer-events-auto">
      <div 
        className="p-4 rounded-sm backdrop-blur-sm border"
        style={{ 
          background: 'rgba(15,23,42,0.95)', 
          borderColor: 'rgba(71,85,105,0.5)' 
        }}
      >
        <div className="text-[10px] text-slate-400 font-medium tracking-wider uppercase mb-3">
          KARTLAGER
        </div>

        <div className="space-y-0.5">
          {layers.map(layer => {
            const isActive = activeLayers.includes(layer.id);
            const isLocked = layer.proOnly && !isPro;

            return (
              <div 
                key={layer.id}
                className={`flex items-center gap-3 p-2.5 rounded-sm transition-colors ${
                  isActive 
                    ? 'bg-blue-900/30 border-l-2 border-l-blue-600' 
                    : 'hover:bg-slate-800/50'
                } ${isLocked ? 'opacity-40' : ''}`}
              >
                <Checkbox
                  id={layer.id}
                  checked={isActive}
                  disabled={isLocked}
                  onCheckedChange={() => onToggleLayer(layer.id)}
                  className="border-slate-500 data-[state=checked]:bg-blue-700 data-[state=checked]:border-blue-700"
                />
                <label 
                  htmlFor={layer.id}
                  className="flex-1 text-xs cursor-pointer flex items-center gap-2"
                >
                  <span className={`${isActive ? 'text-slate-100 font-medium' : 'text-slate-300'}`}>
                    {layer.name.sv}
                  </span>
                  {isLocked && (
                    <span className="font-mono text-[9px] text-slate-500">[PRO]</span>
                  )}
                </label>
                {!layer.isComparable && isActive && (
                  <Badge 
                    variant="outline" 
                    className="text-[9px] text-slate-400 border-slate-600 rounded-sm px-1"
                  >
                    [!]
                  </Badge>
                )}
              </div>
            );
          })}
        </div>

        {/* Warnings */}
        {incompatibleWarnings.length > 0 && (
          <Alert className="mt-3 bg-slate-800/60 border-slate-600 py-2 rounded-sm">
            <span className="font-mono text-[9px] text-slate-400 mr-1">[X]</span>
            <AlertDescription className="text-[10px] text-slate-400 inline">
              Ej jämförbara: {incompatibleWarnings.join(', ')}
            </AlertDescription>
          </Alert>
        )}

        {nonComparableLayers.length > 0 && incompatibleWarnings.length === 0 && (
          <Alert className="mt-3 bg-slate-800/60 border-slate-600 py-2 rounded-sm">
            <span className="font-mono text-[9px] text-slate-400 mr-1">[!]</span>
            <AlertDescription className="text-[10px] text-slate-400 inline">
              Kontextberoende data – jämför med försiktighet
            </AlertDescription>
          </Alert>
        )}

        {!isPro && (
          <div className="mt-3 pt-3 border-t border-slate-700/50 text-center">
            <div className="text-[9px] text-slate-500 uppercase tracking-wider">
              Vissa lager kräver PRO
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LayerPanel;
