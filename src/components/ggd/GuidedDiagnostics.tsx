/**
 * Guided Global Diagnostics (GGD) Main Container
 * 
 * "ODIS for civilization" - strict step-by-step diagnostic flow.
 * No shortcuts. No skipping. No conclusions without verification.
 */

import React, { useState, useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, X } from 'lucide-react';
import { StepSymptomDefinition } from './steps/StepSymptomDefinition';
import { StepAxisSelection } from './steps/StepAxisSelection';
import { StepMeasurementBlocks } from './steps/StepMeasurementBlocks';
import { StepFaultCodes } from './steps/StepFaultCodes';
import { StepProbableCauses } from './steps/StepProbableCauses';
import { StepCorrelationVerification } from './steps/StepCorrelationVerification';
import { StepLambdaProjection } from './steps/StepLambdaProjection';
import { StepActionClasses } from './steps/StepActionClasses';
import { StepSimulation } from './steps/StepSimulation';
import { StepReportGeneration } from './steps/StepReportGeneration';
import {
  createDiagnosticCase,
  getSymptomData,
  getAxisStatus,
  getMeasurementBlocks,
  getGEDIFaultCodes,
  getProbableCauses,
  getProjectionData,
  getActionClasses,
} from './mockData';
import { DIAGNOSTIC_STEPS, STEP_LABELS, type DiagnosticCase } from './types';
import type { LambdaAxis } from '@/lib/lambda/lambda-1.0';

interface GuidedDiagnosticsProps {
  geoCode: string;
  geoName: string;
  lambdaDeviation: number;
  onClose: () => void;
  isPro?: boolean;
}

export function GuidedDiagnostics({
  geoCode,
  geoName,
  lambdaDeviation,
  onClose,
  isPro = false,
}: GuidedDiagnosticsProps) {
  // Case state
  const [diagnosticCase, setDiagnosticCase] = useState<DiagnosticCase>(() =>
    createDiagnosticCase(geoCode, geoName, lambdaDeviation)
  );

  // Current step
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentStep = DIAGNOSTIC_STEPS[currentStepIndex];

  // Collected data through steps
  const [primaryAxis, setPrimaryAxis] = useState<LambdaAxis | null>(null);
  const [secondaryAxes, setSecondaryAxes] = useState<LambdaAxis[]>([]);
  const [causes, setCauses] = useState<ReturnType<typeof getProbableCauses>>([]);
  const [faultCodes, setFaultCodes] = useState<ReturnType<typeof getGEDIFaultCodes>>([]);
  const [actionClasses, setActionClasses] = useState<ReturnType<typeof getActionClasses>>([]);

  // Progress calculation
  const progress = ((currentStepIndex + 1) / DIAGNOSTIC_STEPS.length) * 100;

  // Step navigation
  const goToNextStep = useCallback(() => {
    if (currentStepIndex < DIAGNOSTIC_STEPS.length - 1) {
      setDiagnosticCase(prev => ({
        ...prev,
        completedSteps: [...prev.completedSteps, currentStep],
        currentStep: DIAGNOSTIC_STEPS[currentStepIndex + 1],
      }));
      setCurrentStepIndex(currentStepIndex + 1);
    }
  }, [currentStepIndex, currentStep]);

  const goToPreviousStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  }, [currentStepIndex]);

  // Step 2: Axis selection handler
  const handleAxisSelection = useCallback((primary: LambdaAxis, secondary: LambdaAxis[]) => {
    setPrimaryAxis(primary);
    setSecondaryAxes(secondary);
    // Load data for next steps
    setCauses(getProbableCauses(geoCode, primary));
    setFaultCodes(getGEDIFaultCodes(geoCode));
    setActionClasses(getActionClasses(primary));
    goToNextStep();
  }, [geoCode, goToNextStep]);

  // Step 6: Verification handler
  const handleVerification = useCallback((verdicts: Record<string, 'supported' | 'rejected'>) => {
    // Update causes with verdicts
    setCauses(prev => prev.map(c => ({
      ...c,
      userVerdict: verdicts[c.id] || 'pending',
    })));
    goToNextStep();
  }, [goToNextStep]);

  // Render current step
  const renderStep = () => {
    switch (currentStep) {
      case 'symptom_definition':
        return (
          <StepSymptomDefinition
            symptomData={getSymptomData(geoCode)}
            geoName={geoName}
            onConfirm={goToNextStep}
          />
        );

      case 'axis_selection':
        return (
          <StepAxisSelection
            axes={getAxisStatus(geoCode)}
            onConfirm={handleAxisSelection}
          />
        );

      case 'measurement_blocks':
        return primaryAxis ? (
          <StepMeasurementBlocks
            blocks={getMeasurementBlocks(geoCode, primaryAxis)}
            primaryAxis={primaryAxis}
            onConfirm={goToNextStep}
          />
        ) : null;

      case 'fault_codes':
        return (
          <StepFaultCodes
            faultCodes={faultCodes}
            onConfirm={goToNextStep}
          />
        );

      case 'probable_causes':
        return (
          <StepProbableCauses
            causes={causes}
            onConfirm={goToNextStep}
          />
        );

      case 'correlation_verification':
        return (
          <StepCorrelationVerification
            causes={causes}
            onConfirm={handleVerification}
          />
        );

      case 'lambda_projection':
        return (
          <StepLambdaProjection
            projectionData={getProjectionData(geoCode)}
            geoName={geoName}
            onConfirm={goToNextStep}
          />
        );

      case 'action_classes':
        return primaryAxis ? (
          <StepActionClasses
            actionClasses={actionClasses}
            onConfirm={goToNextStep}
          />
        ) : null;

      case 'simulation':
        return (
          <StepSimulation
            actionClasses={actionClasses}
            currentLambda={diagnosticCase.lambdaDeviation > 0 
              ? 1 + (diagnosticCase.lambdaDeviation / 100)
              : 1 - (Math.abs(diagnosticCase.lambdaDeviation) / 100)
            }
            caseId={diagnosticCase.caseId}
            isPro={isPro}
            onConfirm={() => goToNextStep()}
            onSkip={goToNextStep}
          />
        );

      case 'report_generation':
        return primaryAxis ? (
          <StepReportGeneration
            diagnosticCase={diagnosticCase}
            primaryAxis={primaryAxis}
            secondaryAxes={secondaryAxes}
            activeFaultCodes={faultCodes.map(f => f.code)}
            topCauses={causes.slice(0, 3).map(c => ({ name: c.name.sv, probability: c.probability }))}
            isPro={isPro}
            onComplete={onClose}
          />
        ) : null;

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Header */}
      <header className="border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {currentStepIndex > 0 && currentStep !== 'report_generation' && (
              <Button variant="ghost" size="icon" onClick={goToPreviousStep}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono text-xs">
                  {diagnosticCase.caseId}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {geoName}
                </Badge>
              </div>
              <div className="text-sm font-medium mt-1">
                {STEP_LABELS[currentStep].sv}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Progress</div>
              <div className="flex items-center gap-2">
                <Progress value={progress} className="w-32 h-2" />
                <span className="text-sm font-mono">{Math.round(progress)}%</span>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Step indicators */}
      <div className="border-b px-6 py-2 overflow-x-auto">
        <div className="flex items-center gap-1 min-w-max">
          {DIAGNOSTIC_STEPS.map((step, index) => {
            const isCompleted = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;
            const isLocked = index > currentStepIndex;

            return (
              <div
                key={step}
                className={`flex items-center ${index < DIAGNOSTIC_STEPS.length - 1 ? 'flex-1' : ''}`}
              >
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-mono ${
                    isCompleted
                      ? 'bg-green-500 text-white'
                      : isCurrent
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {isCompleted ? '✓' : index + 1}
                </div>
                {index < DIAGNOSTIC_STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-1 ${
                      isCompleted ? 'bg-green-500' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 overflow-auto p-6">
        {renderStep()}
      </main>

      {/* Footer */}
      <footer className="border-t px-6 py-3 text-center text-xs text-muted-foreground">
        GUIDED GLOBAL DIAGNOSTICS v{diagnosticCase.dataModelVersion} • 
        Systemet fungerar som ett ECU-diagnossystem för civilisationen
      </footer>
    </div>
  );
}

export default GuidedDiagnostics;
