/**
 * AI Signal Overlay
 * 
 * Discrete AI-assisted signals (not a chatbot).
 * MYNDIGHETSDESIGN: Strikt, klinisk, inga spel-liknande effekter.
 * NO ICONS per no-icons-doctrine.
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
      return { bg: 'rgba(30,58,138,0.25)', border: 'rgba(59,130,246,0.5)', marker: '[!]', dot: '#3b82f6' };
    case 'warning':
      return { bg: 'rgba(30,58,138,0.18)', border: 'rgba(59,130,246,0.4)', marker: '[~]', dot: '#60a5fa' };
    case 'info':
      return { bg: 'rgba(71,85,105,0.15)', border: 'rgba(100,116,139,0.4)', marker: '[i]', dot: '#94a3b8' };
    default:
      return { bg: 'rgba(71,85,105,0.12)', border: 'rgba(100,116,139,0.3)', marker: '[?]', dot: '#64748b' };
  }
};

// Text markers for signal types
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
    <div className="absolute bottom-24 left-4 z-10 pointer-events-auto space-y-2 max-w-sm">
      {signals.map((signal, index) => {
        const style = getSeverityStyle(signal.severity);
        
        return (
          <div
            key={index}
            className="p-3 rounded-sm backdrop-blur-sm border animate-in slide-in-from-left-5"
            style={{ 
              background: style.bg,
              borderColor: style.border,
            }}
          >
            <div className="flex items-start gap-3">
              {/* Indicator dot */}
              <div 
                className="w-2 h-2 rounded-full mt-1.5 shrink-0 animate-pulse"
                style={{ backgroundColor: style.dot }}
              />
              
              <div className="flex-1 min-w-0">
                {/* Type marker */}
                <div className="font-mono text-[9px] text-slate-500 mb-1">
                  {style.marker} {getTypeMarker(signal.type)}
                </div>
                
                {/* Message */}
                <div className="text-xs text-slate-200 leading-relaxed">
                  {signal.message.sv}
                </div>
                
                {/* Action button */}
                {signal.action && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mt-2 h-6 text-[10px] text-slate-400 hover:text-slate-100 hover:bg-slate-700/50 px-2 font-mono"
                    onClick={() => onAction(signal)}
                  >
                    {signal.action.label} [→]
                  </Button>
                )}
              </div>
              
              {/* Dismiss button */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-5 w-5 font-mono text-[10px] text-slate-500 hover:text-slate-200 hover:bg-slate-700/50 p-0 shrink-0"
                onClick={() => onDismiss(index)}
              >
                [x]
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default AISignalOverlay;
