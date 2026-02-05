/**
 * DECISION BUTTON — DESIGNED FOR WEIGHT
 * 
 * Not green. No animation. No confirmation emoji.
 * "Lock decision context and proceed"
 */

import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { DecisionConfirmation, FrictionCheckpoint } from './types';

interface DecisionButtonProps {
  alternativeId: string;
  alternativeLabel: string;
  checkpoints: FrictionCheckpoint[];
  onConfirm: (alternativeId: string) => void;
  disabled?: boolean;
}

export function DecisionButton({ 
  alternativeId, 
  alternativeLabel,
  checkpoints,
  onConfirm,
  disabled = false 
}: DecisionButtonProps) {
  const [confirmation, setConfirmation] = useState<DecisionConfirmation>({
    has_seen_uncertainties: false,
    has_seen_assumptions: false,
    has_seen_all_alternatives: false,
    confirmation_timestamp: null,
  });
  const [showConfirmation, setShowConfirmation] = useState(false);

  const allCheckpointsComplete = checkpoints.every(c => c.completed || !c.required);
  const allConfirmationsComplete = 
    confirmation.has_seen_uncertainties &&
    confirmation.has_seen_assumptions &&
    confirmation.has_seen_all_alternatives;

  const canProceed = allCheckpointsComplete && allConfirmationsComplete;

  const handleInitiate = () => {
    if (!allCheckpointsComplete) return;
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    if (!canProceed) return;
    setConfirmation(prev => ({
      ...prev,
      confirmation_timestamp: new Date().toISOString(),
    }));
    onConfirm(alternativeId);
  };

  if (!showConfirmation) {
    return (
      <button
        onClick={handleInitiate}
        disabled={disabled || !allCheckpointsComplete}
        className={cn(
          "w-full font-mono text-sm p-4 border-2 transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-ring",
          allCheckpointsComplete 
            ? "border-foreground hover:bg-foreground hover:text-background"
            : "border-muted text-muted-foreground cursor-not-allowed"
        )}
      >
        <div className="text-left">
          <div className="mb-1">Föreslå beslut</div>
          <div className="text-muted-foreground">
            Alternativ {alternativeId}: {alternativeLabel}
          </div>
        </div>
      </button>
    );
  }

  return (
    <div className="border-2 border-foreground p-4 space-y-4">
      <div className="font-mono text-sm">
        <div className="mb-4">
          <strong>BEKRÄFTELSE KRÄVS</strong>
          <p className="text-muted-foreground mt-1">
            Alternativ {alternativeId}: {alternativeLabel}
          </p>
        </div>

        {/* Confirmation checkboxes - micro-accountability */}
        <div className="space-y-3">
          <ConfirmationCheckbox
            checked={confirmation.has_seen_uncertainties}
            onChange={(v) => setConfirmation(prev => ({ ...prev, has_seen_uncertainties: v }))}
            label="Jag har sett osäkerheterna"
          />
          <ConfirmationCheckbox
            checked={confirmation.has_seen_assumptions}
            onChange={(v) => setConfirmation(prev => ({ ...prev, has_seen_assumptions: v }))}
            label="Jag är medveten om antagandena"
          />
          <ConfirmationCheckbox
            checked={confirmation.has_seen_all_alternatives}
            onChange={(v) => setConfirmation(prev => ({ ...prev, has_seen_all_alternatives: v }))}
            label="Jag har granskat alla alternativ"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setShowConfirmation(false)}
          className="flex-1 font-mono text-sm p-3 border hover:bg-accent"
        >
          Avbryt
        </button>
        <button
          onClick={handleConfirm}
          disabled={!canProceed}
          className={cn(
            "flex-1 font-mono text-sm p-3 border-2",
            canProceed
              ? "border-foreground bg-foreground text-background"
              : "border-muted text-muted-foreground cursor-not-allowed"
          )}
        >
          Lås beslutskontext och fortsätt
        </button>
      </div>
    </div>
  );
}

interface ConfirmationCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

function ConfirmationCheckbox({ checked, onChange, label }: ConfirmationCheckboxProps) {
  return (
    <label className="flex items-start gap-3 cursor-pointer">
      <div 
        className={cn(
          "w-5 h-5 border-2 flex items-center justify-center shrink-0 mt-0.5",
          checked ? "border-foreground bg-foreground" : "border-muted-foreground"
        )}
        onClick={() => onChange(!checked)}
      >
        {checked && <span className="text-background text-xs">×</span>}
      </div>
      <span className={cn(
        checked && "text-foreground",
        !checked && "text-muted-foreground"
      )}>
        {label}
      </span>
    </label>
  );
}
