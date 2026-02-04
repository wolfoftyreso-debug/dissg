/**
 * Step 9: Simulation (PRO ONLY)
 * 
 * VIDA-style "software coding" for civilization.
 * Select action classes → Set parameters → See projected Lambda effect.
 * 
 * CRITICAL: This is marked as SIMULATION – HYPOTHETICAL.
 * Never prescriptive. Always shows uncertainty.
 */

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ChevronRight, 
  AlertTriangle, 
  Lock, 
  FlaskConical, 
  ArrowRight,
  TrendingUp,
  Clock,
  Shield,
  Gauge
} from 'lucide-react';
import type { ActionClass } from '../types';

interface SimulationResult {
  currentLambda: number;
  projectedLambda: number;
  deltaLambda: number;
  affectedSensors: { name: string; currentValue: number; projectedValue: number; unit: string }[];
  timeToEffect: number; // months
  confidenceInterval: [number, number];
  uncertaintyFactors: string[];
}

interface StepSimulationProps {
  actionClasses: ActionClass[];
  currentLambda: number;
  isPro: boolean;
  onConfirm: (selectedActions: string[], simulationResult: SimulationResult | null) => void;
  onSkip: () => void;
}

export function StepSimulation({ 
  actionClasses, 
  currentLambda, 
  isPro, 
  onConfirm,
  onSkip 
}: StepSimulationProps) {
  // Selected actions (max 3)
  const [selectedActionIds, setSelectedActionIds] = useState<string[]>([]);
  
  // Intensity per action (0-100)
  const [intensities, setIntensities] = useState<Record<string, number>>({});
  
  // Timeframe in months
  const [timeframeMounths, setTimeframeMonths] = useState(24);
  
  // Has run simulation
  const [simulationRun, setSimulationRun] = useState(false);

  // Toggle action selection
  const toggleAction = (actionId: string) => {
    setSelectedActionIds(prev => {
      if (prev.includes(actionId)) {
        return prev.filter(id => id !== actionId);
      }
      if (prev.length >= 3) {
        return prev; // Max 3
      }
      return [...prev, actionId];
    });
    setSimulationRun(false);
  };

  // Update intensity
  const updateIntensity = (actionId: string, value: number) => {
    setIntensities(prev => ({ ...prev, [actionId]: value }));
    setSimulationRun(false);
  };

  // Calculate simulation result (mock)
  const simulationResult = useMemo<SimulationResult | null>(() => {
    if (!simulationRun || selectedActionIds.length === 0) return null;

    const selectedActions = actionClasses.filter(a => selectedActionIds.includes(a.id));
    
    // Calculate weighted effect based on historical effectiveness and intensity
    let totalEffect = 0;
    let maxTimeToEffect = 0;
    
    selectedActions.forEach(action => {
      const intensity = (intensities[action.id] || 50) / 100;
      const baseEffect = (action.historicalEffectiveness / 100) * 0.15; // Max 15% improvement per action
      totalEffect += baseEffect * intensity;
      maxTimeToEffect = Math.max(maxTimeToEffect, action.timeToEffect);
    });

    // Cap total effect at 25%
    totalEffect = Math.min(totalEffect, 0.25);
    
    const projectedLambda = Math.min(1.0, currentLambda * (1 + totalEffect));
    const deltaLambda = projectedLambda - currentLambda;

    // Affected sensors (mock data)
    const affectedSensors = [
      { name: 'BNP/capita', currentValue: 52400, projectedValue: 52400 * (1 + totalEffect * 0.8), unit: 'SEK' },
      { name: 'Produktivitet', currentValue: 98.2, projectedValue: 98.2 * (1 + totalEffect * 1.2), unit: 'index' },
      { name: 'Sysselsättningsgrad', currentValue: 77.4, projectedValue: Math.min(85, 77.4 * (1 + totalEffect * 0.5)), unit: '%' },
      { name: 'Investeringskvot', currentValue: 24.8, projectedValue: 24.8 * (1 + totalEffect * 1.5), unit: '% av BNP' },
    ];

    // Uncertainty based on number of actions and complexity
    const complexityFactor = selectedActions.filter(a => a.complexity === 'high').length;
    const uncertaintyRange = 0.02 + (complexityFactor * 0.01) + (selectedActions.length * 0.005);

    return {
      currentLambda,
      projectedLambda,
      deltaLambda,
      affectedSensors,
      timeToEffect: maxTimeToEffect,
      confidenceInterval: [
        projectedLambda - uncertaintyRange,
        projectedLambda + uncertaintyRange,
      ],
      uncertaintyFactors: [
        'Externa ekonomiska chocker ej inkluderade',
        'Politisk genomförbarhet ej modellerad',
        'Demografiska förändringar antagna konstanta',
        'Global marknadsvolatilitet ej inkluderad',
      ],
    };
  }, [simulationRun, selectedActionIds, actionClasses, intensities, currentLambda]);

  // Run simulation
  const runSimulation = () => {
    setSimulationRun(true);
  };

  // If not PRO, show locked state
  if (!isPro) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <Badge variant="outline" className="mb-4 font-mono">STEG 9 / 10</Badge>
          <h2 className="text-2xl font-bold mb-2">Simulering</h2>
          <p className="text-muted-foreground">
            Testa hypotetiska åtgärdseffekter på Lambda
          </p>
        </div>

        <div className="bg-card border rounded-xl p-12 text-center">
          <Lock className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-bold mb-2">PRO-funktion</h3>
          <p className="text-muted-foreground mb-6">
            Simuleringsmodulen kräver PRO-licens för att säkerställa 
            korrekt användning och spårbarhet.
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={onSkip}>
              Hoppa över
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
            <Button>
              Uppgradera till PRO
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header with SIMULATION warning */}
      <div className="text-center mb-6">
        <Badge variant="outline" className="mb-4 font-mono">STEG 9 / 10</Badge>
        <h2 className="text-2xl font-bold mb-2">Simulering</h2>
        <p className="text-muted-foreground">
          Testa hypotetiska åtgärdseffekter på Lambda
        </p>
      </div>

      {/* CRITICAL: Simulation warning banner */}
      <Alert className="mb-6 bg-amber-500/10 border-amber-500">
        <AlertTriangle className="h-5 w-5 text-amber-500" />
        <AlertDescription className="text-amber-600 dark:text-amber-400">
          <strong className="text-lg">SIMULATION – HYPOTHETICAL</strong>
          <br />
          Detta påverkar INTE diagnosen. Resultaten baseras på historiska mönster 
          och innehåller signifikant osäkerhet. Ingen rekommendation – endast konsekvensprojektion.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Action selection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold flex items-center gap-2">
              <FlaskConical className="h-4 w-4" />
              Välj åtgärdsklasser
            </h3>
            <Badge variant="secondary">
              {selectedActionIds.length}/3 valda
            </Badge>
          </div>

          {actionClasses.map(action => {
            const isSelected = selectedActionIds.includes(action.id);
            const intensity = intensities[action.id] || 50;

            return (
              <div 
                key={action.id}
                className={`bg-card border rounded-lg p-4 transition-all ${
                  isSelected ? 'border-primary ring-1 ring-primary' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => toggleAction(action.id)}
                    disabled={!isSelected && selectedActionIds.length >= 3}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{action.name.sv}</h4>
                      <Badge variant="outline" className="font-mono text-xs">
                        {action.historicalEffectiveness}% eff.
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {action.description.sv}
                    </p>

                    {/* Intensity slider (only when selected) */}
                    {isSelected && (
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Intensitet</span>
                          <span className="font-mono font-bold">{intensity}%</span>
                        </div>
                        <Slider
                          value={[intensity]}
                          onValueChange={([v]) => updateIntensity(action.id, v)}
                          min={10}
                          max={100}
                          step={10}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Minimal</span>
                          <span>Full</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Timeframe selection */}
          <div className="bg-muted/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Projektionstidsram
              </span>
              <span className="font-mono font-bold">{timeframeMounths} månader</span>
            </div>
            <Slider
              value={[timeframeMounths]}
              onValueChange={([v]) => { setTimeframeMonths(v); setSimulationRun(false); }}
              min={12}
              max={120}
              step={12}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>1 år</span>
              <span>5 år</span>
              <span>10 år</span>
            </div>
          </div>

          {/* Run simulation button */}
          <Button
            onClick={runSimulation}
            disabled={selectedActionIds.length === 0}
            className="w-full"
            size="lg"
          >
            <FlaskConical className="mr-2 h-4 w-4" />
            Kör simulering
          </Button>
        </div>

        {/* Right: Results */}
        <div className="space-y-4">
          {!simulationResult ? (
            <div className="bg-card border rounded-xl p-8 text-center h-full flex flex-col items-center justify-center">
              <Gauge className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Välj åtgärdsklasser och kör simulering för att se projicerad effekt
              </p>
            </div>
          ) : (
            <>
              {/* Lambda projection */}
              <div className="bg-card border rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <h3 className="font-bold">Projicerad Lambda-förändring</h3>
                </div>

                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground mb-1">Nuvarande</div>
                    <div className="text-3xl font-mono font-bold text-amber-500">
                      λ {simulationResult.currentLambda.toFixed(3)}
                    </div>
                  </div>
                  <ArrowRight className="h-8 w-8 text-muted-foreground" />
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground mb-1">Projicerad</div>
                    <div className="text-3xl font-mono font-bold text-primary">
                      λ {simulationResult.projectedLambda.toFixed(3)}
                    </div>
                  </div>
                </div>

                {/* Delta */}
                <div className="bg-green-500/10 rounded-lg p-3 text-center mb-4">
                  <span className="text-green-600 dark:text-green-400 font-mono font-bold text-lg">
                    +{(simulationResult.deltaLambda * 100).toFixed(1)}%
                  </span>
                  <span className="text-sm text-muted-foreground ml-2">
                    förväntad förbättring
                  </span>
                </div>

                {/* Confidence interval */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Osäkerhetsintervall</span>
                  <span className="font-mono">
                    [{simulationResult.confidenceInterval[0].toFixed(3)} – {simulationResult.confidenceInterval[1].toFixed(3)}]
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-muted-foreground">Tid till effekt</span>
                  <span className="font-mono">{simulationResult.timeToEffect} månader</span>
                </div>
              </div>

              {/* Affected sensors */}
              <div className="bg-card border rounded-xl p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Gauge className="h-4 w-4" />
                  Påverkade mätvärden
                </h3>
                <div className="space-y-3">
                  {simulationResult.affectedSensors.map((sensor, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-sm">{sensor.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-muted-foreground">
                          {sensor.currentValue.toFixed(1)}
                        </span>
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        <span className="font-mono text-sm text-primary">
                          {sensor.projectedValue.toFixed(1)}
                        </span>
                        <span className="text-xs text-muted-foreground">{sensor.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Uncertainty factors */}
              <div className="bg-card border border-amber-500/50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3 text-amber-600 dark:text-amber-400">
                  <Shield className="h-4 w-4" />
                  <h4 className="text-sm font-bold">Osäkerhetsfaktorer</h4>
                </div>
                <ul className="space-y-1">
                  {simulationResult.uncertaintyFactors.map((factor, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                      <span className="text-amber-500">•</span>
                      {factor}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Disclaimer */}
              <div className="bg-muted/30 rounded-lg p-3 text-center text-xs text-muted-foreground">
                "Historiskt har liknande åtgärder gett detta utfall" – 
                ingen garanti för framtida resultat.
              </div>
            </>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-end gap-4 mt-8">
        <Button variant="outline" onClick={onSkip}>
          Hoppa över simulering
        </Button>
        <Button
          size="lg"
          onClick={() => onConfirm(selectedActionIds, simulationResult)}
          className="font-mono"
        >
          Fortsätt till rapport
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
