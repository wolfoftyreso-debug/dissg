/**
 * AI Signal Overlay
 * 
 * Discrete AI-assisted signals (not a chatbot).
 * MYNDIGHETSDESIGN: Strikt, klinisk, inga spel-liknande effekter.
 * NO ICONS per no-icons-doctrine - ASCII text markers only.
 * 
 * @semantic proper list structure for signals
 * @a11y aria-live region for dynamic updates
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import type { AISignal } from './types';

interface AISignalOverlayProps {
  signals: AISignal[];
  onDismiss: (index: number) => void;
  onAction: (signal: AISignal) => void;
}

// Myndighets-dämpade färger baserat på severity
const getSeverityStyle = (severity: AISignal['severity']) => {
  switch (severity) {
    case 'critical':
      return { 
        bg: 'hsl(221.2 83.2% 53.3% / 0.25)', 
        border: 'hsl(221.2 83.2% 53.3% / 0.5)', 
        marker: '[!]', 
        dot: 'hsl(221.2 83.2% 53.3%)' 
      };
    case 'warning':
      return { 
        bg: 'hsl(221.2 83.2% 53.3% / 0.18)', 
        border: 'hsl(221.2 83.2% 53.3% / 0.4)', 
        marker: '[~]', 
        dot: 'hsl(217.2 91.2% 59.8%)' 
      };
    case 'info':
      return { 
        bg: 'hsl(215 20.2% 35% / 0.15)', 
        border: 'hsl(215 20.2% 45% / 0.4)', 
        marker: '[i]', 
        dot: 'hsl(215 20.2% 65.1%)' 
      };
    default:
      return { 
        bg: 'hsl(215 20.2% 35% / 0.12)', 
        border: 'hsl(215 20.2% 45% / 0.3)', 
        marker: '[?]', 
        dot: 'hsl(215 16.3% 46.9%)' 
      };
  }
};

// ASCII text markers for signal types
const getTypeMarker = (type: AISignal['type']) => {
  switch (type) {
    case 'deviation': return '[DEV]';
    case 'explanation': return '[EXP]';
    case 'prognosis': return '[PRG]';
    default: return '[SIG]';
  }
};

export function AISignalOverlay({ signals, onDismiss, onAction }: AISignalOverlayProps) {
  if (signals.length === 0) return null;

  return (
    <section 
      aria-label="AI-genererade signaler"
      aria-live="polite"
      aria-atomic="false"
      className="pointer-events-auto space-y-2 max-w-sm"
    >
      <h2 className="sr-only">Aktiva AI-signaler ({signals.length})</h2>
      
      <ul className="space-y-2">
        {signals.map((signal, index) => {
          const style = getSeverityStyle(signal.severity);
          
          return (
            <li
              key={index}
              className="p-3 rounded-sm backdrop-blur-sm border animate-in slide-in-from-left-5"
              style={{ 
                background: style.bg,
                borderColor: style.border,
              }}
              role="alert"
              aria-labelledby={`signal-${index}-type`}
            >
              <article className="flex items-start gap-3">
                {/* Indicator dot */}
                <div 
                  className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                  style={{ backgroundColor: style.dot }}
                  aria-hidden="true"
                />
                
                <div className="flex-1 min-w-0">
                  {/* Type marker */}
                  <header 
                    id={`signal-${index}-type`}
                    className="font-mono text-[9px] text-slate-500 mb-1"
                  >
                    <span aria-label={`Severity: ${signal.severity}`}>{style.marker}</span>
                    {' '}
                    <span aria-label={`Type: ${signal.type}`}>{getTypeMarker(signal.type)}</span>
                  </header>
                  
                  {/* Message */}
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {signal.message.sv}
                  </p>
                  
                  {/* Action button */}
                  {signal.action && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="mt-2 h-6 text-[10px] text-slate-400 hover:text-slate-100 hover:bg-slate-700/50 px-2 font-mono"
                      onClick={() => onAction(signal)}
                      aria-label={`${signal.action.label} - undersök ${signal.geoCode}`}
                    >
                      {signal.action.label} [GO]
                    </Button>
                  )}
                </div>
                
                {/* Dismiss button */}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-5 w-8 font-mono text-[10px] text-slate-500 hover:text-slate-200 hover:bg-slate-700/50 p-0 shrink-0"
                  onClick={() => onDismiss(index)}
                  aria-label="Stäng signal"
                >
                  [X]
                </Button>
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default AISignalOverlay;
