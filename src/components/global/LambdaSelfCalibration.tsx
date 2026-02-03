/**
 * LAMBDA SELF-CALIBRATION & MODEL EVOLUTION
 * 
 * "Learn continuously, drift never"
 * 
 * Visualizes the calibration system, version history,
 * and drift protection mechanisms.
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  RefreshCw, 
  Lock, 
  Unlock,
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  GitBranch,
  Layers,
  Shield,
  Activity,
  ArrowRight,
  History,
} from 'lucide-react';
import {
  CALIBRATABLE_PARAMETERS,
  IMMUTABLE_PARAMETERS,
  CALIBRATION_LOOP,
  DRIFT_GUARDS,
  SYSTEM_LAYERS,
  RELEASE_REQUIREMENTS,
  CALIBRATION_DOCTRINE,
  FUNDAMENTAL_PRINCIPLE,
  type ModelVersion,
  type CalibrationStep,
  type DriftCheck,
  type ReleaseTest,
} from '@/config/lambdaSelfCalibration';

// =============================================================================
// TYPES
// =============================================================================

interface LambdaSelfCalibrationProps {
  currentVersion: ModelVersion;
  versionHistory: ModelVersion[];
  currentCalibrationStep?: CalibrationStep;
  driftStatus: DriftCheck;
  releaseTests?: ReleaseTest;
  language?: 'sv' | 'en';
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const LambdaSelfCalibration: React.FC<LambdaSelfCalibrationProps> = ({
  currentVersion,
  versionHistory,
  currentCalibrationStep,
  driftStatus,
  releaseTests,
  language = 'sv',
}) => {
  return (
    <div className="space-y-6">
      {/* Doctrine header */}
      <Card className="border-dashed">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <RefreshCw className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">
                {FUNDAMENTAL_PRINCIPLE[language]}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {CALIBRATION_DOCTRINE[language]}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current version */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5" />
              {language === 'sv' ? 'Aktuell modellversion' : 'Current Model Version'}
            </CardTitle>
            <Badge variant="outline" className="font-mono">
              {currentVersion.versionId}
            </Badge>
          </div>
          <CardDescription>
            {language === 'sv' ? 'Skapad' : 'Created'}: {new Date(currentVersion.createdAt).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
              {language === 'sv' ? 'Motivation' : 'Motivation'}
            </div>
            <p className="text-sm">{currentVersion.motivation}</p>
          </div>

          {currentVersion.changelog.length > 0 && (
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                {language === 'sv' ? 'Ändringar' : 'Changes'}
              </div>
              <div className="space-y-1">
                {currentVersion.changelog.map((change, i) => (
                  <div key={i} className="flex items-center justify-between text-sm p-2 bg-muted rounded">
                    <span className="font-mono text-xs">{change.parameter}</span>
                    <span className="text-muted-foreground">
                      {change.previousValue.toFixed(3)} → {change.newValue.toFixed(3)}
                      <span className="ml-2 text-xs">
                        ({change.changePercent > 0 ? '+' : ''}{(change.changePercent * 100).toFixed(1)}%)
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="text-xs text-muted-foreground mb-1">
              {language === 'sv' ? 'Historisk påverkan' : 'Historical Impact'}
            </div>
            <p className="text-sm">{currentVersion.historicalImpact.described}</p>
            <Badge variant="secondary" className="mt-2 gap-1">
              <Lock className="h-3 w-3" />
              {language === 'sv' ? 'Ej tillämpat retroaktivt' : 'Not applied retroactively'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Three-layer architecture */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Layers className="h-5 w-5" />
            {language === 'sv' ? 'Tre-lagers arkitektur' : 'Three-Layer Architecture'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(SYSTEM_LAYERS).map(([key, layer]) => (
              <div 
                key={key} 
                className={`p-3 rounded-lg border ${
                  layer.calibratable ? 'border-primary/50 bg-primary/5' : 'border-muted'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {layer.calibratable ? (
                    <Unlock className="h-4 w-4 text-primary" />
                  ) : (
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="text-sm font-medium">{layer.name}</span>
                </div>
                <p className="text-xs text-muted-foreground">{layer.description}</p>
                {layer.calibratable && (
                  <Badge variant="default" className="mt-2 text-xs">
                    {language === 'sv' ? 'Kalibrerbar' : 'Calibratable'}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Calibration parameters */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Unlock className="h-4 w-4 text-primary" />
              {language === 'sv' ? 'Får kalibreras' : 'May Calibrate'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {CALIBRATABLE_PARAMETERS.map(param => (
                <li key={param} className="text-xs font-mono flex items-center gap-2">
                  <CheckCircle2 className="h-3 w-3 text-primary" />
                  {param}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Lock className="h-4 w-4 text-destructive" />
              {language === 'sv' ? 'Får aldrig kalibreras' : 'May Never Calibrate'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {IMMUTABLE_PARAMETERS.map(param => (
                <li key={param} className="text-xs font-mono flex items-center gap-2">
                  <XCircle className="h-3 w-3 text-destructive" />
                  {param}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Calibration loop */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            {language === 'sv' ? 'Kalibreringsloop (ECU-analogi)' : 'Calibration Loop (ECU Analogy)'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            {CALIBRATION_LOOP.map((step, i) => (
              <React.Fragment key={step.step}>
                <div className={`flex flex-col items-center p-3 rounded-lg ${
                  currentCalibrationStep === step.step 
                    ? 'bg-primary/10 border border-primary' 
                    : 'bg-muted/50'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    currentCalibrationStep === step.step
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {step.order}
                  </div>
                  <span className="text-xs mt-2 text-center">
                    {step.name[language]}
                  </span>
                </div>
                {i < CALIBRATION_LOOP.length - 1 && (
                  <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Drift guards */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {language === 'sv' ? 'Drift-skydd' : 'Drift Guards'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <DriftMetric
              label={language === 'sv' ? 'Max per version' : 'Max per version'}
              value={DRIFT_GUARDS.maxChangePerVersion * 100}
              unit="%"
            />
            <DriftMetric
              label={language === 'sv' ? 'Max per år' : 'Max per year'}
              value={DRIFT_GUARDS.maxAccumulatedChangePerYear * 100}
              unit="%"
            />
            <DriftMetric
              label={language === 'sv' ? 'Larmtröskel' : 'Alarm threshold'}
              value={DRIFT_GUARDS.alarmThreshold * 100}
              unit="%"
            />
            <DriftMetric
              label={language === 'sv' ? 'Manuell granskning' : 'Manual review'}
              value={DRIFT_GUARDS.manualReviewThreshold * 100}
              unit="%"
            />
          </div>

          <Separator />

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">
                {language === 'sv' ? 'Aktuell drift' : 'Current Drift'}
              </span>
              <DriftStatusBadge status={driftStatus.status} language={language} />
            </div>
            <Progress 
              value={(driftStatus.totalDrift / DRIFT_GUARDS.maxChangePerVersion) * 100} 
              className="h-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{(driftStatus.totalDrift * 100).toFixed(1)}%</span>
              <span>{(DRIFT_GUARDS.maxChangePerVersion * 100).toFixed(0)}% max</span>
            </div>
          </div>

          {driftStatus.requiresManualReview && (
            <div className="p-3 bg-destructive/10 rounded-lg flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <span className="text-sm">
                {language === 'sv' 
                  ? 'Manuell granskning krävs innan release'
                  : 'Manual review required before release'}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Release tests */}
      {releaseTests && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CheckCircle2 className="h-5 w-5" />
              {language === 'sv' ? 'Självtest före release' : 'Self-Test Before Release'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {RELEASE_REQUIREMENTS.map(req => {
                const passed = releaseTests[req.code as keyof ReleaseTest];
                return (
                  <div 
                    key={req.code}
                    className={`p-2 rounded text-center ${
                      passed ? 'bg-primary/10' : 'bg-destructive/10'
                    }`}
                  >
                    {passed ? (
                      <CheckCircle2 className="h-4 w-4 mx-auto text-primary" />
                    ) : (
                      <XCircle className="h-4 w-4 mx-auto text-destructive" />
                    )}
                    <span className="text-xs mt-1 block">{req.label[language]}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Version history */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <History className="h-5 w-5" />
            {language === 'sv' ? 'Versionshistorik' : 'Version History'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {versionHistory.slice(0, 5).map((version, i) => (
              <div 
                key={version.versionId}
                className={`flex items-center justify-between p-2 rounded ${
                  i === 0 ? 'bg-primary/10' : 'bg-muted/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Badge variant={i === 0 ? 'default' : 'outline'} className="font-mono text-xs">
                    {version.versionId}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(version.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {version.changelog.length} {language === 'sv' ? 'ändringar' : 'changes'}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

const DriftMetric: React.FC<{ label: string; value: number; unit: string }> = ({
  label,
  value,
  unit,
}) => (
  <div className="text-center p-2 bg-muted/50 rounded">
    <div className="text-lg font-bold">
      {value}{unit}
    </div>
    <div className="text-xs text-muted-foreground">{label}</div>
  </div>
);

const DriftStatusBadge: React.FC<{ 
  status: DriftCheck['status']; 
  language: 'sv' | 'en';
}> = ({ status, language }) => {
  const config = {
    ok: { 
      variant: 'default' as const, 
      label: { sv: 'OK', en: 'OK' },
      icon: CheckCircle2,
    },
    warning: { 
      variant: 'secondary' as const, 
      label: { sv: 'Varning', en: 'Warning' },
      icon: AlertTriangle,
    },
    alarm: { 
      variant: 'destructive' as const, 
      label: { sv: 'Larm', en: 'Alarm' },
      icon: AlertTriangle,
    },
    blocked: { 
      variant: 'destructive' as const, 
      label: { sv: 'Blockerad', en: 'Blocked' },
      icon: XCircle,
    },
  };

  const { variant, label, icon: Icon } = config[status];

  return (
    <Badge variant={variant} className="gap-1">
      <Icon className="h-3 w-3" />
      {label[language]}
    </Badge>
  );
};

export default LambdaSelfCalibration;
