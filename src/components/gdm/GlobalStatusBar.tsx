/**
 * Global Status Bar
 * 
 * Shows global Lambda value and system status overlay on map.
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
        className="p-4 rounded-lg backdrop-blur-md border pointer-events-auto"
        style={{ 
          background: 'rgba(0,0,0,0.7)',
          borderColor: color,
        }}
      >
        {/* Lambda value */}
        <div className="text-center">
          <div className="text-xs text-muted-foreground font-mono mb-1">
            GLOBAL LAMBDA
          </div>
          <div 
            className="text-4xl font-mono font-bold"
            style={{ color }}
          >
            λ = {globalLambda?.lambda.toFixed(3) || '—'}
          </div>
        </div>

        {/* System status */}
        <div className="mt-3 flex items-center justify-center gap-2">
          <Badge 
            className="font-mono text-xs"
            style={{ backgroundColor: status.color, color: 'white' }}
          >
            {status.label.sv}
          </Badge>
        </div>

        {/* Active GEDI codes */}
        {globalLambda?.activeGEDICodes.length > 0 && (
          <div className="mt-3 pt-3 border-t border-muted">
            <div className="text-xs text-muted-foreground mb-1">
              Aktiva GEDI-koder
            </div>
            <div className="flex flex-wrap gap-1">
              {globalLambda.activeGEDICodes.map(code => (
                <Badge key={code} variant="destructive" className="text-xs font-mono">
                  {code}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Year indicator */}
        <div className="mt-3 pt-3 border-t border-muted text-center">
          <div className="text-xs text-muted-foreground">Period</div>
          <div className="font-mono text-lg">{timeYear}</div>
        </div>
      </div>
    </div>
  );
}

export default GlobalStatusBar;
