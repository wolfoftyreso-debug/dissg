/**
 * Layer Selection Panel
 * 
 * Checkbox-based layer control with compatibility warnings.
 */

import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Lock } from 'lucide-react';
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
    <div 
      className="absolute top-4 right-16 z-10 w-64 pointer-events-auto"
    >
      <div 
        className="p-4 rounded-lg backdrop-blur-md border"
        style={{ background: 'rgba(0,0,0,0.7)', borderColor: 'rgba(255,255,255,0.1)' }}
      >
        <div className="text-xs text-muted-foreground font-mono mb-3">
          KARTLAGER
        </div>

        <div className="space-y-2">
          {layers.map(layer => {
            const isActive = activeLayers.includes(layer.id);
            const isLocked = layer.proOnly && !isPro;

            return (
              <div 
                key={layer.id}
                className={`flex items-center gap-2 p-2 rounded transition-colors ${
                  isActive ? 'bg-primary/20' : 'hover:bg-muted/20'
                } ${isLocked ? 'opacity-50' : ''}`}
              >
                <Checkbox
                  id={layer.id}
                  checked={isActive}
                  disabled={isLocked}
                  onCheckedChange={() => onToggleLayer(layer.id)}
                  className="border-muted-foreground"
                />
                <label 
                  htmlFor={layer.id}
                  className="flex-1 text-sm cursor-pointer flex items-center gap-2"
                >
                  <span>{layer.icon}</span>
                  <span className="text-white">{layer.name.sv}</span>
                  {isLocked && <Lock className="h-3 w-3 text-muted-foreground" />}
                </label>
                {!layer.isComparable && isActive && (
                  <Badge variant="outline" className="text-[10px] text-amber-400 border-amber-400">
                    ⚠️
                  </Badge>
                )}
              </div>
            );
          })}
        </div>

        {/* Warnings */}
        {incompatibleWarnings.length > 0 && (
          <Alert className="mt-3 bg-red-500/20 border-red-500 py-2">
            <AlertTriangle className="h-3 w-3" />
            <AlertDescription className="text-xs">
              Ej jämförbara: {incompatibleWarnings.join(', ')}
            </AlertDescription>
          </Alert>
        )}

        {nonComparableLayers.length > 0 && incompatibleWarnings.length === 0 && (
          <Alert className="mt-3 bg-amber-500/20 border-amber-500 py-2">
            <AlertTriangle className="h-3 w-3" />
            <AlertDescription className="text-xs">
              Kontextberoende data – jämför med försiktighet
            </AlertDescription>
          </Alert>
        )}

        {!isPro && (
          <div className="mt-3 pt-3 border-t border-muted text-center">
            <div className="text-xs text-muted-foreground">
              Några lager kräver PRO
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LayerPanel;
