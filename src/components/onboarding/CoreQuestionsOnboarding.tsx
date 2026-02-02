/**
 * Interactive Onboarding View
 * Introduces users to the three core questions:
 * 1. Hur går det? (How is it going?)
 * 2. Var händer det? (Where is it happening?)
 * 3. Varför? (Why?)
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  MapPin, 
  HelpCircle, 
  ChevronRight, 
  ChevronLeft,
  CheckCircle2,
  BarChart3,
  Lightbulb,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface OnboardingStep {
  id: string;
  question: string;
  questionEn: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  description: string;
  details: string[];
  example: {
    title: string;
    value: string;
    context: string;
  };
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'how',
    question: 'Hur går det?',
    questionEn: 'How is it going?',
    icon: TrendingUp,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    description: 'Få en omedelbar överblick över samhällets tillstånd genom nyckelindikatorer.',
    details: [
      'Se aktuella värden och trender för viktiga mått',
      'Förstå om utvecklingen går åt rätt håll',
      'Identifiera områden som kräver uppmärksamhet',
      'Jämför med historiska värden och mål'
    ],
    example: {
      title: 'Arbetslöshet',
      value: '7.2%',
      context: '↓ 0.3% sedan förra månaden'
    }
  },
  {
    id: 'where',
    question: 'Var händer det?',
    questionEn: 'Where is it happening?',
    icon: MapPin,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    description: 'Utforska geografiska skillnader och se var förändringarna sker.',
    details: [
      'Bryt ner data på region, kommun eller län',
      'Upptäck lokala avvikelser från riksgenomsnittet',
      'Identifiera områden som leder utvecklingen',
      'Se var resurserna behövs mest'
    ],
    example: {
      title: 'Västra Götaland',
      value: '6.8%',
      context: 'Lägre än riksgenomsnittet'
    }
  },
  {
    id: 'why',
    question: 'Varför?',
    questionEn: 'Why?',
    icon: HelpCircle,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    description: 'Förstå orsakerna bakom siffrorna genom djupare analys.',
    details: [
      'Spåra beslut och åtgärder till utfall',
      'Se vem som har mandat att agera',
      'Granska evidensunderlaget för påståenden',
      'Förstå samband mellan olika indikatorer'
    ],
    example: {
      title: 'Koppling identifierad',
      value: 'Utbildningssatsning 2023',
      context: '→ 12% fler i arbete bland unga'
    }
  }
];

interface CoreQuestionsOnboardingProps {
  onComplete?: () => void;
  onSkip?: () => void;
}

export function CoreQuestionsOnboarding({ onComplete, onSkip }: CoreQuestionsOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  
  const step = ONBOARDING_STEPS[currentStep];
  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;
  const allCompleted = completedSteps.size === ONBOARDING_STEPS.length;

  const handleNext = () => {
    setCompletedSteps(prev => new Set([...prev, currentStep]));
    if (isLastStep) {
      onComplete?.();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleStepClick = (index: number) => {
    setCurrentStep(index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex flex-col">
      {/* Header */}
      <header className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Välkommen
            </h1>
            <p className="text-muted-foreground">
              Lär dig navigera i samhällsdata
            </p>
          </div>
          {onSkip && (
            <Button variant="ghost" onClick={onSkip} className="text-muted-foreground">
              Hoppa över
            </Button>
          )}
        </div>
      </header>

      {/* Progress indicators */}
      <div className="px-4 sm:px-6 lg:px-8 mb-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3">
            {ONBOARDING_STEPS.map((s, index) => {
              const Icon = s.icon;
              const isActive = index === currentStep;
              const isCompleted = completedSteps.has(index);
              
              return (
                <button
                  key={s.id}
                  onClick={() => handleStepClick(index)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full transition-all",
                    isActive && s.bgColor,
                    isActive && "ring-2 ring-offset-2",
                    isActive && s.id === 'how' && "ring-emerald-300",
                    isActive && s.id === 'where' && "ring-blue-300",
                    isActive && s.id === 'why' && "ring-purple-300",
                    !isActive && "hover:bg-muted"
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle2 className={cn("h-5 w-5", s.color)} />
                  ) : (
                    <Icon className={cn(
                      "h-5 w-5",
                      isActive ? s.color : "text-muted-foreground"
                    )} />
                  )}
                  <span className={cn(
                    "text-sm font-medium hidden sm:inline",
                    isActive ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {s.question}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 pb-8">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="overflow-hidden border-0 shadow-lg">
                {/* Question header */}
                <div className={cn("p-8 sm:p-12", step.bgColor)}>
                  <div className="flex items-start gap-6">
                    <div className={cn(
                      "p-4 rounded-2xl bg-white/80 backdrop-blur-sm shadow-sm",
                    )}>
                      <step.icon className={cn("h-10 w-10", step.color)} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        Fråga {currentStep + 1} av {ONBOARDING_STEPS.length}
                      </p>
                      <h2 className={cn("text-4xl sm:text-5xl font-bold mb-2", step.color)}>
                        {step.question}
                      </h2>
                      <p className="text-lg text-foreground/80">
                        {step.questionEn}
                      </p>
                    </div>
                  </div>
                </div>

                <CardContent className="p-8 sm:p-12">
                  {/* Description */}
                  <p className="text-xl text-foreground mb-8">
                    {step.description}
                  </p>

                  {/* Two-column layout */}
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Details list */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-foreground flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-amber-500" />
                        Vad du kan göra
                      </h3>
                      <ul className="space-y-3">
                        {step.details.map((detail, i) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-start gap-3"
                          >
                            <ArrowRight className={cn("h-4 w-4 mt-1 shrink-0", step.color)} />
                            <span className="text-muted-foreground">{detail}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    {/* Example card */}
                    <div>
                      <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
                        <BarChart3 className="h-5 w-5 text-muted-foreground" />
                        Exempel
                      </h3>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className={cn(
                          "p-6 rounded-xl border-2",
                          step.id === 'how' && "border-emerald-200 bg-emerald-50/50",
                          step.id === 'where' && "border-blue-200 bg-blue-50/50",
                          step.id === 'why' && "border-purple-200 bg-purple-50/50"
                        )}
                      >
                        <p className="text-sm text-muted-foreground mb-1">
                          {step.example.title}
                        </p>
                        <p className={cn("text-3xl font-bold mb-2", step.color)}>
                          {step.example.value}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {step.example.context}
                        </p>
                      </motion.div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Föregående
            </Button>

            <div className="flex items-center gap-2">
              {ONBOARDING_STEPS.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "h-2 rounded-full transition-all",
                    index === currentStep ? "w-8 bg-primary" : "w-2 bg-muted-foreground/30"
                  )}
                />
              ))}
            </div>

            <Button
              onClick={handleNext}
              className="gap-2"
            >
              {isLastStep ? 'Kom igång' : 'Nästa'}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Quick access hint */}
          {allCompleted && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 text-center"
            >
              <p className="text-sm text-muted-foreground">
                Du kan alltid återvända till denna guide via{' '}
                <span className="font-medium text-foreground">Hjälp</span> i menyn.
              </p>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}

/**
 * Compact version for use in modals or sidebars
 */
export function CoreQuestionsCompact({ onQuestionClick }: { onQuestionClick?: (id: string) => void }) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        Tre kärnfrågor
      </h3>
      {ONBOARDING_STEPS.map((step) => {
        const Icon = step.icon;
        return (
          <button
            key={step.id}
            onClick={() => onQuestionClick?.(step.id)}
            className={cn(
              "w-full flex items-center gap-4 p-4 rounded-lg transition-all",
              "hover:shadow-md border border-transparent",
              "hover:" + step.bgColor,
              "hover:border-current/10"
            )}
          >
            <div className={cn("p-2 rounded-lg", step.bgColor)}>
              <Icon className={cn("h-5 w-5", step.color)} />
            </div>
            <div className="text-left">
              <p className="font-medium text-foreground">{step.question}</p>
              <p className="text-sm text-muted-foreground line-clamp-1">
                {step.description}
              </p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto" />
          </button>
        );
      })}
    </div>
  );
}
