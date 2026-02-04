/**
 * AI Signal Overlay
 * 
 * Discrete AI-assisted signals (not a chatbot).
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { X, AlertCircle, HelpCircle, TrendingDown } from 'lucide-react';
import type { AISignal } from './types';

interface AISignalOverlayProps {
  signals: AISignal[];
  onDismiss: (index: number) => void;
  onAction: (signal: AISignal) => void;
}

export function AISignalOverlay({ signals, onDismiss, onAction }: AISignalOverlayProps) {
  if (signals.length === 0) return null;

  const getIcon = (type: AISignal['type']) => {
    switch (type) {
      case 'deviation': return <AlertCircle className="h-4 w-4" />;
      case 'explanation': return <HelpCircle className="h-4 w-4" />;
      case 'prognosis': return <TrendingDown className="h-4 w-4" />;
    }
  };

  const getColor = (severity: AISignal['severity']) => {
    switch (severity) {
      case 'critical': return '#dc2626';
      case 'warning': return '#f59e0b';
      case 'info': return '#3b82f6';
    }
  };

  return (
    <div className="absolute bottom-24 left-4 z-10 pointer-events-auto space-y-2 max-w-sm">
      {signals.map((signal, index) => (
        <div
          key={index}
          className="p-3 rounded-lg backdrop-blur-md border animate-in slide-in-from-left-5"
          style={{ 
            background: `${getColor(signal.severity)}20`,
            borderColor: getColor(signal.severity),
          }}
        >
          <div className="flex items-start gap-2">
            <div style={{ color: getColor(signal.severity) }}>
              {getIcon(signal.type)}
            </div>
            <div className="flex-1">
              <div className="text-sm text-white">{signal.message.sv}</div>
              {signal.action && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mt-2 h-7 text-xs"
                  onClick={() => onAction(signal)}
                >
                  {signal.action.label} →
                </Button>
              )}
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6"
              onClick={() => onDismiss(index)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AISignalOverlay;
