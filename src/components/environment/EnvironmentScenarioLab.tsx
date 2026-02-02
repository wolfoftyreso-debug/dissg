/**
 * ENVIRONMENT SCENARIO LAB
 * 
 * Clearly separated from observation mode.
 * Shows ranges, not points.
 * Shows historical analogues.
 * Shows explicit assumptions.
 * 
 * NEVER says "this will save the climate" or "this leads to catastrophe"
 * ONLY says "Historically, under similar conditions, outcomes ranged between X–Y"
 */

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  ENVIRONMENT_INDICATORS,
  MODEL_MODE_DISCLAIMER,
  type EnvironmentCoreIndicators,
  type EnvironmentProjection
} from '@/lib/environment';
import { ModeIndicator } from './ModeIndicator';
import { CorrelationWarning } from './CorrelationWarning';
import { AlertTriangle, Beaker, History, Cpu, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface ScenarioParameters {
  energyMixFossil: number;      // 0-100%
  energyMixRenewable: number;   // 0-100%
  economicGrowth: number;       // -5 to +10%
  populationGrowth: number;     // -2 to +3%
  efficiencyImprovement: number; // 0-5% per year
}

interface ScenarioOutcome {
  indicatorId: keyof EnvironmentCoreIndicators;
  currentValue: number;
  projectedRange: {
    low: number;
    mid: number;
    high: number;
  };
  yearsToOutcome: number;
  historicalAnalogues: {
    description: string;
    period: string;
    outcome: string;
  }[];
}

interface EnvironmentScenarioLabProps {
  currentValues: Partial<Record<keyof EnvironmentCoreIndicators, number>>;
  onParameterChange?: (param: keyof ScenarioParameters, value: number) => void;
  outcomes?: ScenarioOutcome[];
  isCalculating?: boolean;
}

const PARAMETER_CONFIG: Record<keyof ScenarioParameters, {
  name: string;
  description: string;
  min: number;
  max: number;
  step: number;
  unit: string;
}> = {
  energyMixFossil: {
    name: 'Fossil energiandel',
    description: 'Andel fossil energi av total primärenergi',
    min: 0,
    max: 100,
    step: 5,
    unit: '%'
  },
  energyMixRenewable: {
    name: 'Förnybar energiandel',
    description: 'Andel förnybar energi av total primärenergi',
    min: 0,
    max: 100,
    step: 5,
    unit: '%'
  },
  economicGrowth: {
    name: 'Ekonomisk tillväxt',
    description: 'Årlig BNP-tillväxt',
    min: -5,
    max: 10,
    step: 0.5,
    unit: '%'
  },
  populationGrowth: {
    name: 'Befolkningstillväxt',
    description: 'Årlig befolkningsförändring',
    min: -2,
    max: 3,
    step: 0.1,
    unit: '%'
  },
  efficiencyImprovement: {
    name: 'Effektivitetsförbättring',
    description: 'Årlig energieffektivitetsförbättring',
    min: 0,
    max: 5,
    step: 0.25,
    unit: '%/år'
  }
};

function OutcomeRangeDisplay({
  outcome
}: {
  outcome: ScenarioOutcome;
}) {
  const meta = ENVIRONMENT_INDICATORS[outcome.indicatorId];
  const range = outcome.projectedRange.high - outcome.projectedRange.low;
  const midPosition = ((outcome.projectedRange.mid - outcome.projectedRange.low) / range) * 100;
  
  return (
    <Card className="bg-muted/30">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium">{meta.nameShort}</span>
          <Badge variant="outline" className="text-xs">
            {outcome.yearsToOutcome} år
          </Badge>
        </div>
        
        <p className="text-xs text-muted-foreground mb-3">
          Nu: {outcome.currentValue.toLocaleString('sv-SE')} {meta.unit}
        </p>
        
        {/* Range bar */}
        <div className="relative h-8 bg-muted rounded mb-2">
          <div 
            className="absolute inset-y-1 bg-primary/20 rounded"
            style={{ left: '0%', right: '0%' }}
          />
          <div 
            className="absolute top-0 bottom-0 w-1 bg-primary rounded"
            style={{ left: `${midPosition}%` }}
          />
        </div>
        
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{outcome.projectedRange.low.toLocaleString('sv-SE')}</span>
          <span className="font-medium">
            {outcome.projectedRange.mid.toLocaleString('sv-SE')}
          </span>
          <span>{outcome.projectedRange.high.toLocaleString('sv-SE')}</span>
        </div>
        
        <p className="text-xs text-center text-muted-foreground mt-2">
          Historiskt intervall: {outcome.projectedRange.low.toLocaleString('sv-SE')}–{outcome.projectedRange.high.toLocaleString('sv-SE')} {meta.unit}
        </p>
        
        {/* Historical analogues */}
        {outcome.historicalAnalogues.length > 0 && (
          <div className="mt-4 pt-3 border-t border-border space-y-2">
            <p className="text-xs font-medium flex items-center gap-1">
              <History className="w-3 h-3" /> Historiska analoger:
            </p>
            {outcome.historicalAnalogues.slice(0, 2).map((analogue, i) => (
              <div key={i} className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                <p className="font-medium">{analogue.period}</p>
                <p>{analogue.description}</p>
                <p className="text-primary mt-1">Utfall: {analogue.outcome}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function EnvironmentScenarioLab({
  currentValues,
  onParameterChange,
  outcomes,
  isCalculating
}: EnvironmentScenarioLabProps) {
  const [parameters, setParameters] = useState<ScenarioParameters>({
    energyMixFossil: 80,
    energyMixRenewable: 15,
    economicGrowth: 2.5,
    populationGrowth: 1.0,
    efficiencyImprovement: 1.5
  });

  const handleParameterChange = (key: keyof ScenarioParameters, value: number) => {
    setParameters(prev => ({ ...prev, [key]: value }));
    onParameterChange?.(key, value);
  };

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-300">
      {/* Header with critical warnings */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Beaker className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Environment Scenario Lab</h2>
            <p className="text-sm text-muted-foreground">
              Utforska historiska samband – utan prognoser
            </p>
          </div>
        </div>

        {/* Mode indicator - ALWAYS shows "model" */}
        <ModeIndicator mode="model" />

        {/* Critical disclaimers */}
        <Card className="bg-destructive/10 border-destructive/20">
          <CardContent className="py-3 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-destructive">
                Detta är INTE en prognos
              </p>
              <p className="text-muted-foreground text-xs mt-1">
                Resultat visar historiska intervall under liknande förhållanden. 
                Framtiden är per definition osäker. Ingen modell kan förutsäga exakta utfall.
              </p>
            </div>
          </CardContent>
        </Card>

        <CorrelationWarning language="sv" compact />
      </div>

      {/* Parameter sliders */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium flex items-center gap-2">
          <Cpu className="w-4 h-4" />
          Justera scenarioparametrar
        </h3>
        
        {(Object.keys(PARAMETER_CONFIG) as (keyof ScenarioParameters)[]).map(paramKey => {
          const config = PARAMETER_CONFIG[paramKey];
          const value = parameters[paramKey];
          
          return (
            <Card key={paramKey}>
              <CardContent className="py-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-medium">{config.name}</p>
                    <p className="text-xs text-muted-foreground">{config.description}</p>
                  </div>
                  <span className="text-lg font-semibold tabular-nums">
                    {value > 0 && config.min < 0 ? '+' : ''}{value.toLocaleString('sv-SE', { maximumFractionDigits: 1 })} {config.unit}
                  </span>
                </div>
                <Slider
                  value={[value]}
                  min={config.min}
                  max={config.max}
                  step={config.step}
                  onValueChange={([v]) => handleParameterChange(paramKey, v)}
                  className="min-h-[44px]"
                />
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Outcomes */}
      <AnimatePresence mode="wait">
        {isCalculating ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center py-12"
          >
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </motion.div>
        ) : outcomes && outcomes.length > 0 ? (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <h3 className="text-sm font-medium">Möjliga utfallsintervall</h3>
            
            <p className="text-xs text-muted-foreground italic">
              "Historically, under similar conditions, outcomes ranged between these values."
            </p>
            
            {outcomes.map(outcome => (
              <OutcomeRangeDisplay key={outcome.indicatorId} outcome={outcome} />
            ))}

            {/* What models do NOT predict */}
            <Card className="bg-muted/30">
              <CardContent className="py-4 space-y-3">
                <h4 className="text-sm font-medium text-destructive">
                  Vad modeller INTE kan förutsäga:
                </h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Exakta årliga värden</li>
                  <li>• Oväntade teknologiska genombrott</li>
                  <li>• Politiska omvälvningar</li>
                  <li>• Naturkatastrofer och deras timing</li>
                  <li>• Beteendeförändringar i befolkningen</li>
                  <li>• Feedbackloopar som inte observerats historiskt</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <Card className="bg-muted/30">
            <CardContent className="py-8 text-center text-muted-foreground">
              <p className="text-sm">Justera parametrar för att se möjliga utfallsintervall</p>
            </CardContent>
          </Card>
        )}
      </AnimatePresence>
    </div>
  );
}
