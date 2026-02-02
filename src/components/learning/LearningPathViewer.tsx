/**
 * GUIDED LEARNING PATHS — Main Viewer Component
 * "Hjälp mig förstå världen, steg för steg – med data som grund."
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  BookOpen,
  Share2,
  CheckCircle,
  Circle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { LearningStepView } from './LearningStepView';
import { ReflectionPromptView } from './ReflectionPromptView';
import { MicroInsightCard } from './MicroInsightCard';
import type { 
  LearningPath, 
  LearningStep,
  PathLevel 
} from '@/config/guidedLearningPathsConfig';
import { 
  PATH_LEVELS, 
  getStepsForLevel 
} from '@/config/guidedLearningPathsConfig';

interface LearningPathViewerProps {
  path: LearningPath;
  onComplete?: () => void;
  onExit?: () => void;
}

export function LearningPathViewer({ 
  path, 
  onComplete, 
  onExit 
}: LearningPathViewerProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [selectedLevel, setSelectedLevel] = useState<PathLevel>(path.level);
  const [showReflection, setShowReflection] = useState(false);
  
  const steps = getStepsForLevel(path.steps, selectedLevel);
  const currentStep = steps[currentStepIndex];
  const progress = ((currentStepIndex + 1) / steps.length) * 100;
  
  const handleNext = () => {
    // Mark current step as completed
    setCompletedSteps(prev => new Set(prev).add(currentStep.id));
    
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      setShowReflection(false);
    } else {
      onComplete?.();
    }
  };
  
  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
      setShowReflection(false);
    }
  };
  
  const handleStepClick = (index: number) => {
    // Allow navigation to any step
    setCurrentStepIndex(index);
    setShowReflection(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={onExit}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Tillbaka
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-2">
                <span className="text-2xl">{path.icon}</span>
                <div>
                  <h1 className="font-semibold">{path.titleSv}</h1>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{PATH_LEVELS[selectedLevel].duration}</span>
                    <span>•</span>
                    <span>{PATH_LEVELS[selectedLevel].labelSv}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Dela
              </Button>
            </div>
          </div>
          
          {/* Progress */}
          <div className="mt-3 space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Steg {currentStepIndex + 1} av {steps.length}</span>
              <span>{Math.round(progress)}% klart</span>
            </div>
            <Progress value={progress} className="h-1" />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 flex gap-6">
        {/* Step navigation sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Steg i denna path
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {steps.map((step, index) => {
                const isCompleted = completedSteps.has(step.id);
                const isCurrent = index === currentStepIndex;
                
                return (
                  <button
                    key={step.id}
                    onClick={() => handleStepClick(index)}
                    className={cn(
                      "w-full flex items-center gap-2 p-2 rounded-md text-left text-sm transition-colors",
                      isCurrent 
                        ? "bg-primary/10 text-primary" 
                        : "hover:bg-muted",
                      isCompleted && !isCurrent && "text-muted-foreground"
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                    ) : (
                      <Circle className={cn(
                        "h-4 w-4 flex-shrink-0",
                        isCurrent ? "text-primary" : "text-muted-foreground"
                      )} />
                    )}
                    <span className="truncate">{step.titleSv}</span>
                  </button>
                );
              })}
            </CardContent>
          </Card>
          
          {/* Level switcher */}
          <Card className="mt-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Tempo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {(Object.entries(PATH_LEVELS) as [PathLevel, typeof PATH_LEVELS[PathLevel]][]).map(([level, info]) => (
                <Button
                  key={level}
                  variant={selectedLevel === level ? "secondary" : "ghost"}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => {
                    setSelectedLevel(level);
                    setCurrentStepIndex(0);
                  }}
                >
                  <span className="truncate">{info.labelSv}</span>
                  <Badge variant="outline" className="ml-auto text-xs">
                    {info.duration}
                  </Badge>
                </Button>
              ))}
            </CardContent>
          </Card>
        </aside>

        {/* Main content */}
        <main className="flex-1 max-w-3xl space-y-6">
          {/* Current step */}
          <LearningStepView 
            step={currentStep}
            onShowReflection={() => setShowReflection(true)}
          />
          
          {/* Micro-insights */}
          {currentStep.microInsights && currentStep.microInsights.length > 0 && (
            <div className="space-y-3">
              {currentStep.microInsights.map((insight) => (
                <MicroInsightCard key={insight.id} insight={insight} />
              ))}
            </div>
          )}
          
          {/* Reflection prompt */}
          {currentStep.reflection && showReflection && (
            <ReflectionPromptView 
              reflection={currentStep.reflection}
              onContinue={handleNext}
            />
          )}
          
          {/* Navigation */}
          <div className="flex items-center justify-between pt-4">
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              disabled={currentStepIndex === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Föregående
            </Button>
            
            <div className="flex items-center gap-2">
              {currentStep.canSkip && currentStepIndex < steps.length - 1 && (
                <Button variant="ghost" onClick={handleNext}>
                  Hoppa över
                </Button>
              )}
              
              <Button onClick={handleNext}>
                {currentStepIndex === steps.length - 1 ? (
                  <>
                    Avsluta
                    <CheckCircle className="h-4 w-4 ml-2" />
                  </>
                ) : (
                  <>
                    Nästa
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
