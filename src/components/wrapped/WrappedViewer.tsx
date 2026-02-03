/**
 * 🎬 WRAPPED VIEWER - Spotify/Avanza Premium Experience
 * 
 * Immersive full-screen presentation with:
 * - Animated gradient backgrounds
 * - Glassmorphism navigation
 * - Smooth page transitions
 * - Premium visual polish
 */

import { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X, Sparkles } from 'lucide-react';
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

// Step-specific gradient themes
const STEP_GRADIENTS = [
  'from-violet-950 via-indigo-950 to-slate-950', // Step 1 - Overview
  'from-emerald-950 via-teal-950 to-slate-950',   // Step 2 - Changes
  'from-blue-950 via-indigo-950 to-slate-950',    // Step 3 - Timeline
  'from-amber-950 via-orange-950 to-slate-950',   // Step 4 - Comparisons
  'from-slate-900 via-zinc-900 to-slate-950',     // Step 5 - Unchanged
  'from-rose-950 via-pink-950 to-slate-950',      // Step 6 - Limitations
  'from-purple-950 via-violet-950 to-slate-950',  // Step 7 - Deep Dive
];

// Accent colors for each step
const STEP_ACCENTS = [
  'from-violet-500 to-indigo-500',
  'from-emerald-500 to-teal-500',
  'from-blue-500 to-cyan-500',
  'from-amber-500 to-orange-500',
  'from-slate-500 to-zinc-400',
  'from-rose-500 to-pink-500',
  'from-purple-500 to-violet-500',
];

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
  const gradientClass = STEP_GRADIENTS[currentStep - 1] || STEP_GRADIENTS[0];
  const accentClass = STEP_ACCENTS[currentStep - 1] || STEP_ACCENTS[0];

  const renderStep = useCallback(() => {
    const commonProps = { accentGradient: accentClass };
    
    switch (currentStep) {
      case 1:
        return <WrappedOverview data={wrapped.overview} isDemo={wrapped.isDemo} {...commonProps} />;
      case 2:
        return <WrappedChanges data={wrapped.biggestChanges} {...commonProps} />;
      case 3:
        return <WrappedTimeline data={wrapped.timeline} {...commonProps} />;
      case 4:
        return <WrappedComparisons data={wrapped.comparisons} {...commonProps} />;
      case 5:
        return <WrappedUnchanged data={wrapped.unchanged} {...commonProps} />;
      case 6:
        return <WrappedLimitations data={wrapped.limitations} {...commonProps} />;
      case 7:
        return <WrappedDeepDive data={wrapped.deepDive} isDemo={wrapped.isDemo} {...commonProps} />;
      default:
        return null;
    }
  }, [currentStep, wrapped, accentClass]);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Animated gradient background */}
      <motion.div
        key={`bg-${currentStep}`}
        className={cn(
          "absolute inset-0 bg-gradient-to-br transition-all duration-1000",
          gradientClass
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
      />
      
      {/* Subtle animated orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className={cn(
            "absolute w-[600px] h-[600px] rounded-full blur-3xl opacity-20 bg-gradient-to-r",
            accentClass
          )}
          animate={{
            x: ['-20%', '20%', '-20%'],
            y: ['-20%', '30%', '-20%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ top: '-200px', left: '-200px' }}
        />
        <motion.div 
          className={cn(
            "absolute w-[500px] h-[500px] rounded-full blur-3xl opacity-15 bg-gradient-to-r",
            accentClass
          )}
          animate={{
            x: ['20%', '-20%', '20%'],
            y: ['20%', '-20%', '20%'],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ bottom: '-200px', right: '-200px' }}
        />
      </div>

      {/* Content wrapper */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Header with glassmorphism */}
        <header className="relative z-20">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-xl" />
          <div className="relative container flex items-center justify-between h-16 px-4">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onClose}
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </Button>
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-white/50" />
                  <p className="text-sm font-medium text-white/90">
                    Steg {currentStep} av {totalSteps}
                  </p>
                </div>
                <p className="text-xs text-white/50">
                  {stepTitle.sv}
                </p>
              </div>
            </div>

            {/* Animated step dots */}
            <div className="hidden sm:flex items-center gap-2">
              {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
                <button
                  key={step}
                  onClick={() => onGoToStep(step as WrappedStep)}
                  className="relative p-0.5"
                  aria-label={`Gå till steg ${step}`}
                >
                  <motion.div
                    className={cn(
                      "rounded-full transition-all duration-300",
                      step === currentStep 
                        ? "w-8 h-2 bg-white" 
                        : step < currentStep 
                        ? "w-2 h-2 bg-white/60"
                        : "w-2 h-2 bg-white/20"
                    )}
                    layoutId="step-indicator"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                </button>
              ))}
            </div>

            {/* Demo badge */}
            {wrapped.isDemo && (
              <motion.span 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-xs px-3 py-1.5 bg-white/10 backdrop-blur rounded-full text-white/70 border border-white/10"
              >
                DEMO
              </motion.span>
            )}
          </div>
          
          {/* Animated progress bar */}
          <div className="h-0.5 bg-white/10">
            <motion.div 
              className={cn("h-full bg-gradient-to-r", accentClass)}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </header>

        {/* Content area with page transitions */}
        <main className="flex-1 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 40, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -40, scale: 0.98 }}
              transition={{ 
                duration: 0.5, 
                ease: [0.16, 1, 0.3, 1] 
              }}
              className="container max-w-3xl mx-auto px-4 py-12"
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Navigation footer with glassmorphism */}
        <footer className="relative z-20">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-xl" />
          <div className="relative container flex items-center justify-between h-20 px-4">
            <Button
              variant="ghost"
              onClick={onPrev}
              disabled={currentStep === 1}
              className={cn(
                "gap-2 text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-30",
                currentStep === 1 && "invisible"
              )}
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="hidden sm:inline">Föregående</span>
            </Button>

            {/* Keyboard hint */}
            <p className="text-xs text-white/30 hidden md:block">
              ← → för att navigera · ESC för att stänga
            </p>

            <Button
              onClick={onNext}
              disabled={currentStep === totalSteps}
              className={cn(
                "gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur",
                currentStep === totalSteps && "invisible"
              )}
            >
              <span className="hidden sm:inline">Nästa</span>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </footer>
      </div>
    </div>
  );
}
