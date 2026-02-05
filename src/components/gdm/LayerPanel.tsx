/**
 * Layer Selection Panel
 * 
 * Checkbox-based layer control with compatibility warnings.
 * MYNDIGHETSDESIGN: Strikt, klinisk, inga spel-liknande effekter.
 * NO ICONS per no-icons-doctrine - ASCII text markers only.
 * 
 * @semantic fieldset/legend for grouped controls
 * @a11y Proper labeling and role attributes
 */

import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
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
          const warning = `${layer.name.sv} + ${MAP_LAYERS[incomp].name.sv}`;
          if (!incompatibleWarnings.includes(warning)) {
            incompatibleWarnings.push(warning);
          }
        }
      });
    }
  });

  // Check for non-comparable layers
  const nonComparableLayers = activeLayers
    .map(id => MAP_LAYERS[id])
    .filter(l => !l.isComparable);

  return (
    <aside 
      className="w-64 pointer-events-auto"
      aria-label="Lagerval"
    >
      <div 
        className="p-4 rounded-sm backdrop-blur-sm border"
        style={{ 
          background: 'hsl(222.2 84% 4.9% / 0.95)', 
          borderColor: 'hsl(215 20.2% 35% / 0.5)' 
        }}
      >
        <fieldset>
          <legend className="text-[10px] text-slate-400 font-medium tracking-wider uppercase mb-3">
            KARTLAGER
          </legend>

          <div className="space-y-0.5" role="group" aria-label="Tillgängliga kartlager">
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
                    id={`layer-${layer.id}`}
                    checked={isActive}
                    disabled={isLocked}
                    onCheckedChange={() => onToggleLayer(layer.id)}
                    aria-describedby={isLocked ? `layer-${layer.id}-locked` : undefined}
                    className="border-slate-500 data-[state=checked]:bg-blue-700 data-[state=checked]:border-blue-700"
                  />
                  <label 
                    htmlFor={`layer-${layer.id}`}
                    className="flex-1 text-xs cursor-pointer flex items-center gap-2"
                  >
                    <span className={`${isActive ? 'text-slate-100 font-medium' : 'text-slate-300'}`}>
                      {layer.name.sv}
                    </span>
                    {isLocked && (
                      <span 
                        id={`layer-${layer.id}-locked`}
                        className="font-mono text-[9px] text-slate-500"
                        aria-label="Kräver PRO-licens"
                      >
                        [PRO]
                      </span>
                    )}
                  </label>
                  {!layer.isComparable && isActive && (
                    <Badge 
                      variant="outline" 
                      className="text-[9px] text-slate-400 border-slate-600 rounded-sm px-1"
                      aria-label="Kontextberoende - ej jämförbar"
                    >
                      [!]
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        </fieldset>

        {/* Warnings */}
        {incompatibleWarnings.length > 0 && (
          <div 
            role="alert"
            className="mt-3 p-2 bg-slate-800/60 border border-slate-600 rounded-sm"
          >
            <span className="font-mono text-[9px] text-slate-400 mr-1">[X]</span>
            <span className="text-[10px] text-slate-400">
              Ej jämförbara: {incompatibleWarnings.join(', ')}
            </span>
          </div>
        )}

        {nonComparableLayers.length > 0 && incompatibleWarnings.length === 0 && (
          <div 
            role="status"
            className="mt-3 p-2 bg-slate-800/60 border border-slate-600 rounded-sm"
          >
            <span className="font-mono text-[9px] text-slate-400 mr-1">[!]</span>
            <span className="text-[10px] text-slate-400">
              Kontextberoende data – jämför med försiktighet
            </span>
          </div>
        )}

        {!isPro && (
          <footer className="mt-3 pt-3 border-t border-slate-700/50 text-center">
            <p className="text-[9px] text-slate-500 uppercase tracking-wider">
              Vissa lager kräver PRO
            </p>
          </footer>
        )}
      </div>
    </aside>
  );
}

export default LayerPanel;
