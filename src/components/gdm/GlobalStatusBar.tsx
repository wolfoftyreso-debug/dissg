/**
 * Global Status Bar
 * 
 * Shows global Lambda value and system status overlay on map.
 * MYNDIGHETSDESIGN: Strikt, klinisk, inga spel-liknande effekter.
 * 
 * @semantic article element for self-contained content
 * @a11y Proper heading hierarchy and ARIA labels
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
    <article 
      aria-labelledby="global-lambda-heading"
      className="pointer-events-auto"
    >
      <div 
        className="p-4 rounded-sm backdrop-blur-sm border"
        style={{ 
          background: 'hsl(222.2 84% 4.9% / 0.95)',
          borderColor: 'hsl(215 20.2% 35% / 0.5)',
          minWidth: '160px',
        }}
      >
        {/* Header */}
        <h2 
          id="global-lambda-heading"
          className="text-[10px] text-slate-400 font-medium tracking-wider uppercase mb-3 text-center"
        >
          GLOBAL LAMBDA
        </h2>
        
        {/* Lambda value - Large, prominent */}
        <div className="text-center mb-3" role="status" aria-live="polite">
          <div 
            className="text-4xl font-semibold tracking-tight font-mono"
            style={{ color: 'hsl(215 20.2% 65.1%)' }}
            aria-label={`Lambda-värde: ${globalLambda?.lambda.toFixed(3) || 'ej tillgängligt'}`}
          >
            <span aria-hidden="true">λ = </span>
            <span style={{ color }}>{globalLambda?.lambda.toFixed(3) || '—'}</span>
          </div>
        </div>

        {/* System status indicator */}
        <div className="flex justify-center mb-4">
          <Badge
            variant="outline"
            className="font-mono text-[10px] h-7 px-3 rounded-sm border-slate-600 bg-slate-800/60 text-slate-300"
            style={{ borderLeftColor: status.color, borderLeftWidth: '3px' }}
            aria-label={`Systemstatus: ${status.label.sv}`}
          >
            {status.label.sv.toUpperCase()}
          </Badge>
        </div>

        {/* Active GEDI codes */}
        {globalLambda?.activeGEDICodes.length > 0 && (
          <section 
            aria-labelledby="active-gedi-heading"
            className="pt-3 border-t border-slate-700/50"
          >
            <h3 
              id="active-gedi-heading"
              className="text-[9px] text-slate-500 mb-2 uppercase tracking-wider text-center"
            >
              Aktiva GEDI-koder
            </h3>
            <ul 
              className="flex flex-wrap gap-1 justify-center"
              aria-label="Lista över aktiva GEDI-felkoder"
            >
              {globalLambda.activeGEDICodes.map(code => (
                <li key={code}>
                  <Badge 
                    variant="outline" 
                    className="text-[9px] font-mono rounded-sm border-slate-600 text-slate-400 bg-slate-800/50 px-2 py-0.5"
                  >
                    {code}
                  </Badge>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Year indicator */}
        <section 
          aria-labelledby="period-heading"
          className="mt-3 pt-3 border-t border-slate-700/50 text-center"
        >
          <h3 
            id="period-heading"
            className="text-[9px] text-slate-500 uppercase tracking-wider"
          >
            Period
          </h3>
          <time 
            dateTime={String(timeYear)}
            className="font-mono text-lg text-slate-300 font-semibold block"
          >
            {timeYear}
          </time>
        </section>
      </div>
    </article>
  );
}

export default GlobalStatusBar;
