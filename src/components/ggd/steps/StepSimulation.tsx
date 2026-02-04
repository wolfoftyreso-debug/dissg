/**
 * Step 9: Simulation (FACTORY MODE)
 * 
 * "Controlled What-If Test" - exactly like VIDA/ODIS actuator testing.
 * 
 * CRITICAL RULES:
 * - This is NOT analysis
 * - This is NOT policy  
 * - This is NOT recommendation
 * - This ONLY shows: "If this changes – what happens to system sensors?"
 * 
 * All simulations are logged separately from diagnosis.
 */

import React, { useState, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  ChevronRight, 
  AlertTriangle, 
  Lock, 
  FlaskConical, 
  ArrowRight,
  Info,
  CircleHelp,
  Gauge,
  RotateCcw
} from 'lucide-react';
import type { ActionClass } from '../types';

// =============================================================================
// TYPES
// =============================================================================

type IntensityLevel = 'LOW' | 'MEDIUM' | 'HIGH';
type TimeframeYears = 1 | 3 | 5 | 10;
type UncertaintyLevel = 'LOW' | 'MEDIUM' | 'HIGH';

interface SensorImpact {
  sensor: string;
  code: string;
  current: number;
  simulated: number;
  unit: string;
  status: 'improved' | 'warning' | 'unchanged';
}

interface SimulationLog {
  simulationId: string;
  linkedCaseId: string;
  timestamp: string;
  actionClasses: string[];
  intensity: IntensityLevel;
  timeframeYears: TimeframeYears;
  modelVersion: string;
  confidenceLevel: number;
  baselineLambda: number;
  simulatedLambda: number;
}

interface SimulationResult {
  baselineLambda: number;
  simulatedLambda: number;
  deltaPercent: number;
  sensorImpacts: SensorImpact[];
  uncertainty: UncertaintyLevel;
  uncertaintyReasons: string[];
  timeToEffect: number;
  log: SimulationLog;
}

interface StepSimulationProps {
  actionClasses: ActionClass[];
  currentLambda: number;
  caseId: string;
  isPro: boolean;
  onConfirm: (simulationResult: SimulationResult | null) => void;
  onSkip: () => void;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const INTENSITY_LABELS: Record<IntensityLevel, { sv: string; en: string }> = {
  LOW: { sv: 'Låg', en: 'Low' },
  MEDIUM: { sv: 'Medel', en: 'Medium' },
  HIGH: { sv: 'Hög', en: 'High' },
};

const TIMEFRAME_OPTIONS: { value: TimeframeYears; label: string }[] = [
  { value: 1, label: '1 år' },
  { value: 3, label: '3 år' },
  { value: 5, label: '5 år' },
  { value: 10, label: '10 år' },
];

const INTENSITY_MULTIPLIERS: Record<IntensityLevel, number> = {
  LOW: 0.4,
  MEDIUM: 0.7,
  HIGH: 1.0,
};

// =============================================================================
// COMPONENT
// =============================================================================

export function StepSimulation({ 
  actionClasses, 
  currentLambda, 
  caseId,
  isPro, 
  onConfirm,
  onSkip 
}: StepSimulationProps) {
  // Selected actions (max 3)
  const [selectedActionIds, setSelectedActionIds] = useState<string[]>([]);
  
  // Intensity level (ODIS-style fixed levels)
  const [intensity, setIntensity] = useState<IntensityLevel>('MEDIUM');
  
  // Timeframe in years
  const [timeframeYears, setTimeframeYears] = useState<TimeframeYears>(5);
  
  // Simulation state
  const [simulationRun, setSimulationRun] = useState(false);
  const [showUncertaintyInfo, setShowUncertaintyInfo] = useState(false);

  // Toggle action selection (max 3)
  const toggleAction = useCallback((actionId: string) => {
    setSelectedActionIds(prev => {
      if (prev.includes(actionId)) {
        return prev.filter(id => id !== actionId);
      }
      if (prev.length >= 3) return prev;
      return [...prev, actionId];
    });
    setSimulationRun(false);
  }, []);

  // Reset simulation
  const resetSimulation = useCallback(() => {
    setSelectedActionIds([]);
    setIntensity('MEDIUM');
    setTimeframeYears(5);
    setSimulationRun(false);
  }, []);

  // Generate simulation ID
  const generateSimulationId = () => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `SIM-${timestamp}-${random}`.toUpperCase();
  };

  // Calculate simulation result (empirical interpolation, not prediction)
  const simulationResult = useMemo<SimulationResult | null>(() => {
    if (!simulationRun || selectedActionIds.length === 0) return null;

    const selectedActions = actionClasses.filter(a => selectedActionIds.includes(a.id));
    const intensityMultiplier = INTENSITY_MULTIPLIERS[intensity];
    
    // Calculate weighted effect based on historical effectiveness
    let totalEffect = 0;
    let maxTimeToEffect = 0;
    let complexityScore = 0;
    
    selectedActions.forEach(action => {
      const baseEffect = (action.historicalEffectiveness / 100) * 0.12;
      totalEffect += baseEffect * intensityMultiplier;
      maxTimeToEffect = Math.max(maxTimeToEffect, action.timeToEffect);
      if (action.complexity === 'high') complexityScore += 2;
      else if (action.complexity === 'medium') complexityScore += 1;
    });

    // Cap total effect and apply timeframe scaling
    const timeframeScaling = Math.min(1, timeframeYears / 5);
    totalEffect = Math.min(totalEffect * timeframeScaling, 0.20);
    
    const simulatedLambda = Math.min(1.0, currentLambda * (1 + totalEffect));
    const deltaPercent = ((simulatedLambda - currentLambda) / currentLambda) * 100;

    // Sensor impacts (based on action types)
    const sensorImpacts: SensorImpact[] = [
      { 
        sensor: 'Resource Performance Index', 
        code: 'RPI',
        current: 1.42, 
        simulated: +(1.42 * (1 - totalEffect * 0.8)).toFixed(2), 
        unit: 'ratio',
        status: totalEffect > 0.05 ? 'improved' as const : 'unchanged' as const
      },
      { 
        sensor: 'Employment Rate', 
        code: 'EMP',
        current: 67, 
        simulated: Math.min(85, +(67 * (1 + totalEffect * 0.5)).toFixed(1)), 
        unit: '%',
        status: totalEffect > 0.03 ? 'improved' as const : 'unchanged' as const
      },
      { 
        sensor: 'Energy Cost Index', 
        code: 'ECI',
        current: 0.34, 
        simulated: +(0.34 * (1 - totalEffect * 0.4)).toFixed(2), 
        unit: '€/kWh',
        status: totalEffect > 0.04 ? 'warning' as const : 'unchanged' as const
      },
      { 
        sensor: 'Productivity Index', 
        code: 'PROD',
        current: 98.2, 
        simulated: +(98.2 * (1 + totalEffect * 1.1)).toFixed(1), 
        unit: 'index',
        status: totalEffect > 0.06 ? 'improved' as const : 'warning' as const
      },
    ].filter(s => s.status !== 'unchanged');

    // Uncertainty calculation
    let uncertainty: UncertaintyLevel = 'LOW';
    const uncertaintyReasons: string[] = [];

    if (selectedActions.length > 2) {
      uncertainty = 'MEDIUM';
      uncertaintyReasons.push('Multiple concurrent interventions increase interaction uncertainty');
    }
    if (complexityScore >= 3) {
      uncertainty = 'HIGH';
      uncertaintyReasons.push('High-complexity actions have historically variable outcomes');
    }
    if (timeframeYears >= 10) {
      uncertainty = uncertainty === 'LOW' ? 'MEDIUM' : 'HIGH';
      uncertaintyReasons.push('Long-term projections carry increased external factor risk');
    }
    if (intensity === 'HIGH') {
      uncertaintyReasons.push('High-intensity implementation may encounter resistance factors');
    }

    if (uncertaintyReasons.length === 0) {
      uncertaintyReasons.push('Based on well-documented historical patterns with consistent outcomes');
    }

    // Create simulation log
    const log: SimulationLog = {
      simulationId: generateSimulationId(),
      linkedCaseId: caseId,
      timestamp: new Date().toISOString(),
      actionClasses: selectedActions.map(a => a.id),
      intensity,
      timeframeYears,
      modelVersion: '1.0.0-beta',
      confidenceLevel: uncertainty === 'LOW' ? 0.85 : uncertainty === 'MEDIUM' ? 0.65 : 0.45,
      baselineLambda: currentLambda,
      simulatedLambda,
    };

    return {
      baselineLambda: currentLambda,
      simulatedLambda,
      deltaPercent,
      sensorImpacts,
      uncertainty,
      uncertaintyReasons,
      timeToEffect: maxTimeToEffect,
      log,
    };
  }, [simulationRun, selectedActionIds, actionClasses, intensity, timeframeYears, currentLambda, caseId]);

  // Run simulation
  const runSimulation = () => setSimulationRun(true);

  // Get status indicator
  const getStatusIndicator = (status: SensorImpact['status']) => {
    switch (status) {
      case 'improved': return <span className="text-green-500">🟢</span>;
      case 'warning': return <span className="text-amber-500">🟡</span>;
      default: return <span className="text-muted-foreground">⚪</span>;
    }
  };

  // Get uncertainty color
  const getUncertaintyColor = (level: UncertaintyLevel) => {
    switch (level) {
      case 'LOW': return 'text-green-500 border-green-500';
      case 'MEDIUM': return 'text-amber-500 border-amber-500';
      case 'HIGH': return 'text-red-500 border-red-500';
    }
  };

  // ==========================================================================
  // LOCKED STATE (FREE USERS)
  // ==========================================================================
  if (!isPro) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <Badge variant="outline" className="mb-4 font-mono">STEG 9 / 10</Badge>
          <h2 className="text-2xl font-bold mb-2">Simulering</h2>
          <p className="text-muted-foreground">Controlled What-If Test</p>
        </div>

        <div className="bg-card border rounded-xl p-12 text-center">
          <Lock className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-bold mb-2">PRO-funktion</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Simuleringsmodulen kräver PRO-licens för att säkerställa 
            korrekt användning, spårbarhet och loggning.
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={onSkip}>
              Hoppa över
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
            <Button>Uppgradera till PRO</Button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================================================
  // MAIN SIMULATION UI
  // ==========================================================================
  return (
    <div className="max-w-6xl mx-auto">
      {/* PERMANENT BANNER - Always visible */}
      <div className="bg-muted border-2 border-dashed rounded-lg p-4 mb-6 text-center">
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <AlertTriangle className="h-5 w-5" />
          <span className="font-mono font-bold tracking-wide">
            SIMULATION MODE – HYPOTHETICAL TEST
          </span>
          <AlertTriangle className="h-5 w-5" />
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Resultat påverkar inte diagnosstatus. Alla simuleringar loggas separat.
        </p>
      </div>

      {/* Header */}
      <div className="text-center mb-6">
        <Badge variant="outline" className="mb-4 font-mono">STEG 9 / 10</Badge>
        <h2 className="text-2xl font-bold mb-2">Controlled What-If Test</h2>
        <p className="text-muted-foreground">
          "Om detta ändras – vad händer med systemets mätvärden?"
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* =================================================================
            LEFT PANEL - INPUT (CONTROL)
        ================================================================= */}
        <div className="space-y-6">
          <div className="bg-card border rounded-xl p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <FlaskConical className="h-4 w-4" />
              Control Parameters
            </h3>

            {/* 1. Action Class Selection */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium">Val av Action Class</label>
                <Badge variant="secondary" className="font-mono">
                  {selectedActionIds.length}/3
                </Badge>
              </div>
              <div className="space-y-2">
                {actionClasses.map(action => {
                  const isSelected = selectedActionIds.includes(action.id);
                  const isDisabled = !isSelected && selectedActionIds.length >= 3;

                  return (
                    <div 
                      key={action.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                        isSelected ? 'border-primary bg-primary/5' : 'border-border'
                      } ${isDisabled ? 'opacity-50' : ''}`}
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleAction(action.id)}
                        disabled={isDisabled}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">
                          {action.name.en}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Historiskt observerad åtgärdskategori
                        </div>
                      </div>
                      <Badge variant="outline" className="font-mono text-xs shrink-0">
                        {action.historicalEffectiveness}%
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Intensity (Fixed Levels - ODIS Style) */}
            <div className="mb-6">
              <label className="text-sm font-medium mb-3 block">Intensitet</label>
              <div className="grid grid-cols-3 gap-2">
                {(['LOW', 'MEDIUM', 'HIGH'] as IntensityLevel[]).map(level => (
                  <button
                    key={level}
                    onClick={() => { setIntensity(level); setSimulationRun(false); }}
                    className={`p-3 rounded-lg border text-center font-mono text-sm transition-all ${
                      intensity === level
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {INTENSITY_LABELS[level].sv}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Timeframe (Dropdown) */}
            <div className="mb-6">
              <label className="text-sm font-medium mb-3 block">Tidsram</label>
              <Select 
                value={String(timeframeYears)} 
                onValueChange={(v) => { setTimeframeYears(Number(v) as TimeframeYears); setSimulationRun(false); }}
              >
                <SelectTrigger className="font-mono">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIMEFRAME_OPTIONS.map(opt => (
                    <SelectItem key={opt.value} value={String(opt.value)} className="font-mono">
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                onClick={runSimulation}
                disabled={selectedActionIds.length === 0}
                className="flex-1"
                size="lg"
              >
                <FlaskConical className="mr-2 h-4 w-4" />
                Kör simulering
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={resetSimulation}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* =================================================================
            RIGHT PANEL - OUTPUT (READ ONLY)
        ================================================================= */}
        <div className="space-y-4">
          {!simulationResult ? (
            <div className="bg-card border rounded-xl p-12 text-center h-full flex flex-col items-center justify-center min-h-[400px]">
              <Gauge className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground font-mono">
                Välj Action Classes och kör simulering
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Resultat visas här efter körning
              </p>
            </div>
          ) : (
            <>
              {/* 1. Lambda Response */}
              <div className="bg-card border rounded-xl p-6">
                <h4 className="font-bold mb-4 font-mono text-sm">LAMBDA RESPONSE</h4>
                
                <div className="flex items-center justify-center gap-6 mb-4">
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground mb-1 font-mono">BASELINE</div>
                    <div className="text-3xl font-mono font-bold">
                      λ {simulationResult.baselineLambda.toFixed(3)}
                    </div>
                  </div>
                  <ArrowRight className="h-8 w-8 text-muted-foreground" />
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground mb-1 font-mono">SIMULATED</div>
                    <div className="text-3xl font-mono font-bold text-primary" style={{ textDecoration: 'underline', textDecorationStyle: 'dashed' }}>
                      λ {simulationResult.simulatedLambda.toFixed(3)}
                    </div>
                  </div>
                </div>

                {/* Delta indicator */}
                <div className="bg-muted rounded-lg p-3 text-center">
                  <span className="text-green-600 dark:text-green-400 font-mono font-bold">
                    +{simulationResult.deltaPercent.toFixed(1)}%
                  </span>
                  <span className="text-sm text-muted-foreground ml-2">
                    projected change over {timeframeYears} år
                  </span>
                </div>
              </div>

              {/* 2. Sensor Impact Table */}
              <div className="bg-card border rounded-xl p-6">
                <h4 className="font-bold mb-4 font-mono text-sm">SENSOR IMPACT TABLE</h4>
                
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left p-3 font-mono text-xs">SENSOR</th>
                        <th className="text-right p-3 font-mono text-xs">CURRENT</th>
                        <th className="text-right p-3 font-mono text-xs">SIMULATED</th>
                        <th className="text-center p-3 font-mono text-xs">STATUS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {simulationResult.sensorImpacts.map((sensor, i) => (
                        <tr key={i} className="border-t">
                          <td className="p-3">
                            <span className="font-mono text-xs text-muted-foreground">{sensor.code}</span>
                            <span className="ml-2 text-sm">{sensor.sensor}</span>
                          </td>
                          <td className="text-right p-3 font-mono">
                            {sensor.current} <span className="text-xs text-muted-foreground">{sensor.unit}</span>
                          </td>
                          <td className="text-right p-3 font-mono text-primary">
                            {sensor.simulated} <span className="text-xs text-muted-foreground">{sensor.unit}</span>
                          </td>
                          <td className="text-center p-3">
                            {getStatusIndicator(sensor.status)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Endast sensorer som påverkas visas
                </p>
              </div>

              {/* 3. Uncertainty Indicator */}
              <div className="bg-card border rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold font-mono text-sm">UNCERTAINTY LEVEL</h4>
                  <button
                    onClick={() => setShowUncertaintyInfo(!showUncertaintyInfo)}
                    className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getUncertaintyColor(simulationResult.uncertainty)}`}
                  >
                    <span className="font-mono font-bold">{simulationResult.uncertainty}</span>
                    <CircleHelp className="h-4 w-4" />
                  </button>
                </div>

                {showUncertaintyInfo && (
                  <div className="mt-4 bg-muted/50 rounded-lg p-4">
                    <ul className="space-y-2">
                      {simulationResult.uncertaintyReasons.map((reason, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <Info className="h-4 w-4 mt-0.5 shrink-0" />
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Simulation Log Reference */}
              <div className="bg-muted/30 rounded-lg p-4 font-mono text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-muted-foreground">Simulation ID:</span>
                  <span>{simulationResult.log.simulationId}</span>
                  <span className="text-muted-foreground">Linked Case:</span>
                  <span>{simulationResult.log.linkedCaseId}</span>
                  <span className="text-muted-foreground">Model Version:</span>
                  <span>{simulationResult.log.modelVersion}</span>
                  <span className="text-muted-foreground">Confidence:</span>
                  <span>{(simulationResult.log.confidenceLevel * 100).toFixed(0)}%</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t">
        <p className="text-sm text-muted-foreground">
          {simulationResult 
            ? "Simulation complete. Returning to diagnostic flow."
            : "Simulering är valfri – du kan hoppa över detta steg."
          }
        </p>
        <div className="flex gap-4">
          <Button variant="outline" onClick={onSkip}>
            Hoppa över
          </Button>
          <Button
            size="lg"
            onClick={() => onConfirm(simulationResult)}
            className="font-mono"
          >
            Fortsätt till rapport
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
