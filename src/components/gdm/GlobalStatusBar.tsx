/**
 * Global Status Bar
 * 
 * Shows global Lambda value and system status overlay on map.
 * MYNDIGHETSDESIGN: Strikt, klinisk, inga spel-liknande effekter.
 */

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { LAMBDA_OVERLAYS, getSystemStatus, getLambdaColor } from './mockData';

interface GlobalStatusBarProps {
  timeYear: number;
}

export function GlobalStatusBar({ timeYear }: GlobalStatusBarProps) {
  const globalLambda = LAMBDA_OVERLAYS['GLOBAL'];
  const status = getSystemStatus(globalLambda?.lambda || 0.86);
  const color = getLambdaColor(globalLambda?.lambda || 0.86);

  return (
    <div className="absolute top-4 left-4 z-10 pointer-events-none">
      <div 
        className="p-4 rounded-sm backdrop-blur-sm border pointer-events-auto"
        style={{ 
          background: 'rgba(15,23,42,0.92)',
          borderColor: 'rgba(71,85,105,0.5)',
        }}
      >
        {/* Lambda value - Klinisk typografi */}
        <div className="text-center">
          <div className="text-[10px] text-slate-400 font-medium tracking-wider uppercase mb-2">
            GLOBAL LAMBDA
          </div>
          <div 
            className="text-3xl font-semibold tracking-tight"
            style={{ color: '#94a3b8' }}
          >
            λ = <span style={{ color }}>{globalLambda?.lambda.toFixed(3) || '—'}</span>
          </div>
        </div>

        {/* System status - Diskret badge utan emoji */}
        <div className="mt-3 flex items-center justify-center">
          <Badge 
            className="font-medium text-[10px] tracking-wide uppercase rounded-sm"
            style={{ 
              backgroundColor: 'rgba(71,85,105,0.4)', 
              color: '#94a3b8',
              border: `1px solid ${status.color}`,
            }}
          >
            {status.label.sv}
          </Badge>
        </div>

        {/* Active GEDI codes - Diskret styling */}
        {globalLambda?.activeGEDICodes.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-700/50">
            <div className="text-[9px] text-slate-500 mb-1.5 uppercase tracking-wider">
              Aktiva GEDI-koder
            </div>
            <div className="flex flex-wrap gap-1">
              {globalLambda.activeGEDICodes.map(code => (
                <Badge 
                  key={code} 
                  variant="outline" 
                  className="text-[9px] font-mono rounded-sm border-slate-600 text-slate-400 bg-slate-800/50"
                >
                  {code}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Year indicator - Minimal */}
        <div className="mt-3 pt-3 border-t border-slate-700/50 text-center">
          <div className="text-[9px] text-slate-500 uppercase tracking-wider">Period</div>
          <div className="font-mono text-base text-slate-300">{timeYear}</div>
        </div>
      </div>
    </div>
  );
}

export default GlobalStatusBar;
