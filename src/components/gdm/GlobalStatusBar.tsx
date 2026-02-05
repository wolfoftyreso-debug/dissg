/**
 * Global Status Bar
 * 
 * Shows global Lambda value and system status overlay on map.
 * MYNDIGHETSDESIGN: Strikt, klinisk, inga spel-liknande effekter.
 */

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LAMBDA_OVERLAYS, getSystemStatus, getLambdaColor } from './mockData';

interface GlobalStatusBarProps {
  timeYear: number;
}

export function GlobalStatusBar({ timeYear }: GlobalStatusBarProps) {
  const globalLambda = LAMBDA_OVERLAYS['GLOBAL'];
  const status = getSystemStatus(globalLambda?.lambda || 0.86);
  const color = getLambdaColor(globalLambda?.lambda || 0.86);

  return (
    <div className="absolute top-4 left-4 z-30 pointer-events-none">
      <div 
        className="p-4 rounded-sm backdrop-blur-sm border pointer-events-auto"
        style={{ 
          background: 'rgba(15,23,42,0.95)',
          borderColor: 'rgba(71,85,105,0.5)',
          minWidth: '160px',
        }}
      >
        {/* Header */}
        <div className="text-[10px] text-slate-400 font-medium tracking-wider uppercase mb-3 text-center">
          GLOBAL LAMBDA
        </div>
        
        {/* Lambda value - Large, prominent */}
        <div className="text-center mb-3">
          <div 
            className="text-4xl font-semibold tracking-tight font-mono"
            style={{ color: '#94a3b8' }}
          >
            λ = <span style={{ color }}>{globalLambda?.lambda.toFixed(3) || '—'}</span>
          </div>
        </div>

        {/* System status button */}
        <div className="flex justify-center mb-4">
          <Button
            variant="outline"
            size="sm"
            className="font-mono text-[10px] h-7 px-3 rounded-sm border-slate-600 bg-slate-800/60 text-slate-300 hover:bg-slate-700/60 hover:text-slate-100"
            style={{ borderLeftColor: status.color, borderLeftWidth: '3px' }}
          >
            {status.label.sv.toUpperCase()}
          </Button>
        </div>

        {/* Active GEDI codes */}
        {globalLambda?.activeGEDICodes.length > 0 && (
          <div className="pt-3 border-t border-slate-700/50">
            <div className="text-[9px] text-slate-500 mb-2 uppercase tracking-wider text-center">
              Aktiva GEDI-koder
            </div>
            <div className="flex flex-wrap gap-1 justify-center">
              {globalLambda.activeGEDICodes.map(code => (
                <Badge 
                  key={code} 
                  variant="outline" 
                  className="text-[9px] font-mono rounded-sm border-slate-600 text-slate-400 bg-slate-800/50 px-2 py-0.5"
                >
                  {code}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Year indicator */}
        <div className="mt-3 pt-3 border-t border-slate-700/50 text-center">
          <div className="text-[9px] text-slate-500 uppercase tracking-wider">Period</div>
          <div className="font-mono text-lg text-slate-300 font-semibold">{timeYear}</div>
        </div>
      </div>
    </div>
  );
}

export default GlobalStatusBar;
