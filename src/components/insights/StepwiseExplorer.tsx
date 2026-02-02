/**
 * BLOCK TC — STEPWISE EXPLORATION
 * "Förhindrar feltolkning genom tempo"
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, ChevronRight, Check, 
  TrendingUp, GitCompare, Link2, AlertCircle, Ban
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { EXPLORATION_STEPS, type ExplorationStepType } from '@/config/personalInsightConfig';

interface StepwiseExplorerProps {
  onComplete: (completedSteps: ExplorationStepType[]) => void;
  onStepChange?: (step: ExplorationStepType) => void;
}

const STEP_ICONS: Record<ExplorationStepType, React.ReactNode> = {
  basic_trend: <TrendingUp className="h-5 w-5" />,
  comparison: <GitCompare className="h-5 w-5" />,
  covariation: <Link2 className="h-5 w-5" />,
  deviations: <AlertCircle className="h-5 w-5" />,
  limitations: <Ban className="h-5 w-5" />,
};

// Mock content for each step
const STEP_CONTENT: Record<ExplorationStepType, React.ReactNode> = {
  basic_trend: (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Grundtrenden visar hur huvudindikatorn utvecklats över den valda tidsperioden.
      </p>
      <div className="h-40 bg-muted/30 rounded-lg flex items-center justify-center">
        <span className="text-muted-foreground">[Trendvisualisering]</span>
      </div>
      <p className="text-sm">
        Under perioden 2015–2024 ser vi en generell ökning på <strong>+12%</strong>, 
        med accelererad tillväxt från 2020.
      </p>
    </div>
  ),
  comparison: (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Jämförelse med liknande entiteter ger perspektiv på den observerade trenden.
      </p>
      <div className="h-40 bg-muted/30 rounded-lg flex items-center justify-center">
        <span className="text-muted-foreground">[Jämförelsediagram]</span>
      </div>
      <p className="text-sm">
        Sverige ligger <strong>8% över</strong> genomsnittet för jämförelsegruppen, 
        men <strong>under</strong> Norge och Danmark.
      </p>
    </div>
  ),
  covariation: (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Vilka andra indikatorer rör sig tillsammans med denna?
      </p>
      <div className="h-40 bg-muted/30 rounded-lg flex items-center justify-center">
        <span className="text-muted-foreground">[Korrelationsvisualisering]</span>
      </div>
      <div className="p-3 bg-warning/10 border border-warning/30 rounded-lg">
        <p className="text-sm">
          <strong>Observerat samband:</strong> Variablerna rör sig ofta tillsammans, 
          men detta kan bero på flera faktorer.
        </p>
      </div>
    </div>
  ),
  deviations: (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Var finns undantagen och avvikarna i denna data?
      </p>
      <div className="h-40 bg-muted/30 rounded-lg flex items-center justify-center">
        <span className="text-muted-foreground">[Avvikelsekarta]</span>
      </div>
      <p className="text-sm">
        <strong>3 signifikanta avvikelser</strong> identifierades: 
        Finland (2018), Estland (2020), och Island (2022).
      </p>
    </div>
  ),
  limitations: (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Kritiskt steg: Vad kan vi <strong>inte</strong> dra slutsatser om?
      </p>
      <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg space-y-2">
        <p className="text-sm font-medium text-destructive">Begränsningar:</p>
        <ul className="text-sm space-y-1">
          <li>• Data saknas för perioden 2010–2014</li>
          <li>• Metodändringar 2018 påverkar jämförbarhet</li>
          <li>• Kausalitet kan inte fastställas</li>
          <li>• Externa faktorer (pandemi) påverkar 2020–2021</li>
        </ul>
      </div>
      <p className="text-sm italic text-muted-foreground">
        Utan att beakta dessa begränsningar riskerar slutsatser att bli felaktiga.
      </p>
    </div>
  ),
};

export function StepwiseExplorer({ onComplete, onStepChange }: StepwiseExplorerProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<ExplorationStepType[]>([]);

  const currentStep = EXPLORATION_STEPS[currentStepIndex];
  const progress = ((currentStepIndex + 1) / EXPLORATION_STEPS.length) * 100;

  const handleNext = () => {
    // Mark current step as completed
    if (!completedSteps.includes(currentStep.type)) {
      setCompletedSteps([...completedSteps, currentStep.type]);
    }

    if (currentStepIndex < EXPLORATION_STEPS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      onStepChange?.(EXPLORATION_STEPS[currentStepIndex + 1].type);
    } else {
      // All steps completed
      onComplete([...completedSteps, currentStep.type]);
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      onStepChange?.(EXPLORATION_STEPS[currentStepIndex - 1].type);
    }
  };

  const isLastStep = currentStepIndex === EXPLORATION_STEPS.length - 1;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {STEP_ICONS[currentStep.type]}
            Steg {currentStep.order}: {currentStep.titleSv}
          </CardTitle>
          <Badge variant="outline">
            {currentStepIndex + 1} / {EXPLORATION_STEPS.length}
          </Badge>
        </div>
        <Progress value={progress} className="h-2 mt-2" />
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Step indicators */}
        <div className="flex justify-between">
          {EXPLORATION_STEPS.map((step, idx) => (
            <div 
              key={step.type}
              className={cn(
                "flex flex-col items-center gap-1",
                idx === currentStepIndex && "text-primary",
                completedSteps.includes(step.type) && "text-success"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center border-2",
                idx === currentStepIndex && "border-primary bg-primary/10",
                completedSteps.includes(step.type) && "border-success bg-success/10",
                idx !== currentStepIndex && !completedSteps.includes(step.type) && "border-muted"
              )}>
                {completedSteps.includes(step.type) ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span className="text-xs">{step.order}</span>
                )}
              </div>
              <span className="text-xs hidden md:block">{step.titleSv}</span>
            </div>
          ))}
        </div>

        {/* Step description */}
        <p className="text-sm text-muted-foreground">
          {currentStep.descriptionSv}
        </p>

        {/* Step content */}
        <div className="min-h-[200px]">
          {STEP_CONTENT[currentStep.type]}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={currentStepIndex === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Föregående
          </Button>
          <Button onClick={handleNext}>
            {isLastStep ? 'Slutför analys' : 'Nästa steg'}
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
