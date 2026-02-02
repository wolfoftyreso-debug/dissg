import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  HUMAN_INDICATORS,
  type HumanBaseLayerIndicators 
} from '@/lib/living-standards';
import { 
  type ScenarioParameters,
  type ScenarioOutcome,
  type HistoricalAnalogue
} from '@/lib/living-standards/scenarioTypes';
import { AlertTriangle, Info, Beaker, History } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface ScenarioLabProps {
  baselineCountry: string;
  baselineYear: number;
  currentParameters: ScenarioParameters;
  onParameterChange: (param: keyof ScenarioParameters, value: number) => void;
  outcome?: ScenarioOutcome;
  isCalculating?: boolean;
}

const PARAMETER_CONFIG: Record<keyof Omit<ScenarioParameters, 'populationSize' | 'populationGrowthRate' | 'medianAge'>, {
  name: string;
  description: string;
  min: number;
  max: number;
  step: number;
  unit: string;
}> = {
  investmentLevel: {
    name: 'Investeringsnivå',
    description: 'Relativ nivå av kapitalinvesteringar',
    min: 0,
    max: 100,
    step: 5,
    unit: '%'
  },
  educationLevel: {
    name: 'Utbildningsnivå',
    description: 'Genomsnittlig utbildningsgrad',
    min: 0,
    max: 100,
    step: 5,
    unit: '%'
  },
  urbanizationRate: {
    name: 'Urbaniseringsgrad',
    description: 'Andel av befolkningen i städer',
    min: 0,
    max: 100,
    step: 5,
    unit: '%'
  },
  energyAccess: {
    name: 'Energitillgång',
    description: 'Andel med tillgång till modern energi',
    min: 0,
    max: 100,
    step: 5,
    unit: '%'
  },
  fertilityRate: {
    name: 'Fertilitetstal',
    description: 'Genomsnittligt antal barn per kvinna',
    min: 0.5,
    max: 8,
    step: 0.1,
    unit: 'barn'
  },
  tradeOpenness: {
    name: 'Handelsöppenhet',
    description: 'Relativ nivå av internationell handel',
    min: 0,
    max: 100,
    step: 5,
    unit: '%'
  }
};

function OutcomeRange({ 
  indicatorId,
  low,
  mid,
  high,
  current,
  yearsToEffect
}: {
  indicatorId: keyof HumanBaseLayerIndicators;
  low: number;
  mid: number;
  high: number;
  current: number;
  yearsToEffect: { min: number; max: number };
}) {
  const meta = HUMAN_INDICATORS[indicatorId];
  const range = high - low;
  const midPosition = ((mid - low) / range) * 100;
  
  return (
    <div className="p-3 bg-muted/30 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">{meta.nameShort}</span>
        <Badge variant="outline" className="text-xs">
          {yearsToEffect.min}–{yearsToEffect.max} år
        </Badge>
      </div>
      
      {/* Current value */}
      <p className="text-xs text-muted-foreground mb-2">
        Nu: {current.toLocaleString('sv-SE')} {meta.unit}
      </p>
      
      {/* Range visualization */}
      <div className="relative h-8 bg-muted rounded">
        {/* Range bar */}
        <div 
          className="absolute inset-y-1 bg-primary/20 rounded"
          style={{ left: '0%', right: '0%' }}
        />
        
        {/* Mid estimate marker */}
        <div 
          className="absolute top-0 bottom-0 w-0.5 bg-primary"
          style={{ left: `${midPosition}%` }}
        />
        
        {/* Labels */}
        <div className="absolute -bottom-5 left-0 text-xs text-muted-foreground">
          {low.toLocaleString('sv-SE')}
        </div>
        <div className="absolute -bottom-5 right-0 text-xs text-muted-foreground">
          {high.toLocaleString('sv-SE')}
        </div>
      </div>
      
      <p className="text-xs text-center mt-6 text-muted-foreground">
        Historiskt intervall: {low.toLocaleString('sv-SE')} – {high.toLocaleString('sv-SE')} {meta.unit}
      </p>
    </div>
  );
}

function HistoricalAnalogueCard({ analogue }: { analogue: HistoricalAnalogue }) {
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-medium">{analogue.countryName}</p>
            <p className="text-sm text-muted-foreground">
              {analogue.periodStart}–{analogue.periodEnd}
            </p>
          </div>
          <Badge variant="secondary">
            {analogue.similarityScore}% liknande
          </Badge>
        </div>
        
        <div className="mt-3 flex flex-wrap gap-1">
          {analogue.similarityDimensions.slice(0, 3).map(dim => (
            <Badge 
              key={dim.dimension}
              variant="outline" 
              className={cn(
                "text-xs",
                dim.matchQuality === 'high' && "border-chart-2 text-chart-2",
                dim.matchQuality === 'medium' && "border-warning text-warning",
                dim.matchQuality === 'low' && "border-muted-foreground"
              )}
            >
              {dim.dimension}
            </Badge>
          ))}
        </div>
        
        <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
          {analogue.contextFactors[0]}
        </p>
      </CardContent>
    </Card>
  );
}

export function ScenarioLab({
  baselineCountry,
  baselineYear,
  currentParameters,
  onParameterChange,
  outcome,
  isCalculating
}: ScenarioLabProps) {
  const adjustableParams = Object.keys(PARAMETER_CONFIG) as (keyof typeof PARAMETER_CONFIG)[];

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-300">
      {/* Header with warnings */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Beaker className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Scenario Lab</h2>
            <p className="text-sm text-muted-foreground">
              Utforska historiska samband utan prognoser
            </p>
          </div>
        </div>

        {/* Critical disclaimer */}
        <Card className="bg-warning/10 border-warning/20">
          <CardContent className="py-3 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium">Detta är INTE en prognos</p>
              <p className="text-muted-foreground text-xs mt-1">
                Resultat visar historiska intervall baserat på liknande fall, inte vad som "kommer" att hända. 
                Varje land och tidpunkt är unikt.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Baseline info */}
      <Card className="bg-muted/30">
        <CardContent className="py-3">
          <p className="text-sm">
            <span className="text-muted-foreground">Utgångspunkt:</span>{' '}
            <span className="font-medium">{baselineCountry}, {baselineYear}</span>
          </p>
        </CardContent>
      </Card>

      {/* Parameter sliders */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium flex items-center gap-2">
          <span>Justera parametrar</span>
          <Info className="w-4 h-4 text-muted-foreground" />
        </h3>
        
        {adjustableParams.map(paramKey => {
          const config = PARAMETER_CONFIG[paramKey];
          const value = currentParameters[paramKey];
          
          return (
            <Card key={paramKey}>
              <CardContent className="py-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-medium">{config.name}</p>
                    <p className="text-xs text-muted-foreground">{config.description}</p>
                  </div>
                  <span className="text-lg font-semibold tabular-nums">
                    {value.toLocaleString('sv-SE', { maximumFractionDigits: 1 })} {config.unit}
                  </span>
                </div>
                <Slider
                  value={[value]}
                  min={config.min}
                  max={config.max}
                  step={config.step}
                  onValueChange={([v]) => onParameterChange(paramKey, v)}
                  className="min-h-[44px]"
                />
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Results */}
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
        ) : outcome ? (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Outcome ranges */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Möjliga utfallsintervall</h3>
              {outcome.outcomeRanges.map(range => (
                <OutcomeRange
                  key={range.indicatorId}
                  indicatorId={range.indicatorId}
                  low={range.lowEstimate}
                  mid={range.midEstimate}
                  high={range.highEstimate}
                  current={range.currentValue}
                  yearsToEffect={range.yearsToEffect}
                />
              ))}
            </div>

            {/* Historical analogues */}
            {outcome.historicalAnalogues.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <History className="w-4 h-4" />
                  Historiska liknelser
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {outcome.historicalAnalogues.slice(0, 4).map(analogue => (
                    <HistoricalAnalogueCard 
                      key={`${analogue.countryCode}-${analogue.periodStart}`}
                      analogue={analogue}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Limitations */}
            <Card className="bg-muted/30">
              <CardContent className="py-4 space-y-3">
                <h4 className="text-sm font-medium text-destructive">
                  Vad datan INTE täcker:
                </h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  {outcome.limitations.map((lim, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-destructive">•</span>
                      {lim}
                    </li>
                  ))}
                </ul>
                
                <h4 className="text-sm font-medium mt-4">Antaganden:</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  {outcome.assumptions.map((assumption, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span>•</span>
                      {assumption}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
