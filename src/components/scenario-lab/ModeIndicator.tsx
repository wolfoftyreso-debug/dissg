/**
 * MODE INDICATOR
 * 
 * Visual distinction between Observation Mode and Scenario Mode.
 * Critical for ensuring no one can say "the system said".
 */

import React from 'react';
import { MODE_DISTINCTION, type PlatformMode } from '@/config/scenarioLabConfig';

interface ModeIndicatorProps {
  mode: PlatformMode;
  language?: 'en' | 'sv';
  variant?: 'badge' | 'banner' | 'watermark';
  className?: string;
}

export function ModeIndicator({
  mode,
  language = 'en',
  variant = 'badge',
  className = '',
}: ModeIndicatorProps) {
  const config = mode === 'observation' 
    ? MODE_DISTINCTION.observation 
    : MODE_DISTINCTION.scenario;

  if (variant === 'watermark' && mode === 'scenario') {
    return (
      <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
        <div className={`px-4 py-2 border-2 ${config.color} bg-background/90 backdrop-blur-sm`}>
          <div className="flex items-center gap-2">
            <span className="text-lg">{config.icon}</span>
            <span className="text-sm font-mono uppercase tracking-wider">
              {MODE_DISTINCTION.scenario.watermark[language]}
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'banner') {
    return (
      <div className={`border-2 p-4 ${config.color} ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{config.icon}</span>
            <div>
              <h3 className="font-bold">{config.label[language]}</h3>
              <p className="text-sm opacity-80">{config.description[language]}</p>
            </div>
          </div>
          {mode === 'scenario' && (
            <span className="text-xs font-mono uppercase tracking-wider px-2 py-1 bg-current/10">
              {MODE_DISTINCTION.scenario.watermark[language]}
            </span>
          )}
        </div>
      </div>
    );
  }

  // Badge variant (default)
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 border ${config.color} ${className}`}>
      <span>{config.icon}</span>
      <span className="text-sm font-medium">{config.label[language]}</span>
    </div>
  );
}

/**
 * Mode switcher for UI controls
 */
export function ModeSwitcher({
  currentMode,
  onModeChange,
  language = 'en',
  className = '',
}: {
  currentMode: PlatformMode;
  onModeChange: (mode: PlatformMode) => void;
  language?: 'en' | 'sv';
  className?: string;
}) {
  return (
    <div className={`flex gap-2 ${className}`}>
      <button
        onClick={() => onModeChange('observation')}
        className={`flex items-center gap-2 px-4 py-2 border-2 transition-all ${
          currentMode === 'observation'
            ? MODE_DISTINCTION.observation.color
            : 'border-border text-muted-foreground hover:border-primary/50'
        }`}
      >
        <span>{MODE_DISTINCTION.observation.icon}</span>
        <span className="text-sm font-medium">{MODE_DISTINCTION.observation.label[language]}</span>
      </button>
      
      <button
        onClick={() => onModeChange('scenario')}
        className={`flex items-center gap-2 px-4 py-2 border-2 transition-all ${
          currentMode === 'scenario'
            ? MODE_DISTINCTION.scenario.color
            : 'border-border text-muted-foreground hover:border-amber-500/50'
        }`}
      >
        <span>{MODE_DISTINCTION.scenario.icon}</span>
        <span className="text-sm font-medium">{MODE_DISTINCTION.scenario.label[language]}</span>
      </button>
    </div>
  );
}
