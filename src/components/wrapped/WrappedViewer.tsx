// Wrapped Viewer - Main container with step navigation

import { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { WrappedOutput, WrappedStep } from '@/types/wrapped';
import { WRAPPED_STEP_TITLES } from '@/types/wrapped';
import { WrappedOverview } from './WrappedOverview';
import { WrappedChanges } from './WrappedChanges';
import { WrappedTimeline } from './WrappedTimeline';
import { WrappedComparisons } from './WrappedComparisons';
import { WrappedUnchanged } from './WrappedUnchanged';
import { WrappedLimitations } from './WrappedLimitations';
import { WrappedDeepDive } from './WrappedDeepDive';
import { cn } from '@/lib/utils';

interface WrappedViewerProps {
  wrapped: WrappedOutput;
  currentStep: WrappedStep;
  onNext: () => void;
  onPrev: () => void;
  onGoToStep: (step: WrappedStep) => void;
  onClose: () => void;
  totalSteps: number;
}

export function WrappedViewer({
  wrapped,
  currentStep,
  onNext,
  onPrev,
  onGoToStep,
  onClose,
  totalSteps,
}: WrappedViewerProps) {
  const progress = (currentStep / totalSteps) * 100;
  const stepTitle = WRAPPED_STEP_TITLES[currentStep];

  const renderStep = useCallback(() => {
    switch (currentStep) {
      case 1:
        return <WrappedOverview data={wrapped.overview} isDemo={wrapped.isDemo} />;
      case 2:
        return <WrappedChanges data={wrapped.biggestChanges} />;
      case 3:
        return <WrappedTimeline data={wrapped.timeline} />;
      case 4:
        return <WrappedComparisons data={wrapped.comparisons} />;
      case 5:
        return <WrappedUnchanged data={wrapped.unchanged} />;
      case 6:
        return <WrappedLimitations data={wrapped.limitations} />;
      case 7:
        return <WrappedDeepDive data={wrapped.deepDive} isDemo={wrapped.isDemo} />;
      default:
        return null;
    }
  }, [currentStep, wrapped]);

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Header with progress */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
            <div>
              <p className="text-sm font-medium">
                Steg {currentStep} av {totalSteps}
              </p>
              <p className="text-xs text-muted-foreground">
                {stepTitle.sv}
              </p>
            </div>
          </div>

          {/* Step dots */}
          <div className="hidden sm:flex items-center gap-2">
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
              <button
                key={step}
                onClick={() => onGoToStep(step as WrappedStep)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  step === currentStep 
                    ? "bg-primary w-6" 
                    : step < currentStep 
                    ? "bg-primary/60"
                    : "bg-muted"
                )}
                aria-label={`Gå till steg ${step}`}
              />
            ))}
          </div>

          {/* Demo badge */}
          {wrapped.isDemo && (
            <span className="text-xs px-2 py-1 bg-muted rounded text-muted-foreground">
              DEMO
            </span>
          )}
        </div>
        
        {/* Progress bar */}
        <Progress value={progress} className="h-1 rounded-none" />
      </header>

      {/* Content area */}
      <main className="flex-1 overflow-auto">
        <div className="container max-w-2xl mx-auto px-4 py-8">
          {renderStep()}
        </div>
      </main>

      {/* Navigation footer */}
      <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex items-center justify-between h-16 px-4">
          <Button
            variant="ghost"
            onClick={onPrev}
            disabled={currentStep === 1}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Föregående</span>
          </Button>

          {/* Keyboard hint */}
          <p className="text-xs text-muted-foreground hidden md:block">
            Använd piltangenter för att navigera
          </p>

          <Button
            onClick={onNext}
            disabled={currentStep === totalSteps}
            className="gap-2"
          >
            <span className="hidden sm:inline">Nästa</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </footer>
    </div>
  );
}
