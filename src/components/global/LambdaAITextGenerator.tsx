/**
 * LAMBDA AI TEXT GENERATOR
 * 
 * "Say only what the data supports"
 * 
 * This component generates AI-validated Lambda text summaries
 * following the strict text skeleton protocol.
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Bot, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  FileText,
  Shield,
  Lock,
} from 'lucide-react';
import {
  type LambdaTextSkeleton,
  type ValidationResult,
  type PrePublishCheck,
  validateText,
  runPrePublishChecks,
  canPublish,
  getUncertaintyLevel,
  TEMPLATES,
  AI_TEXT_DOCTRINE,
  FUNDAMENTAL_RULE,
  VALUE_JUDGMENT_RESPONSE,
} from '@/config/lambdaAITextProtocol';

// =============================================================================
// TYPES
// =============================================================================

interface LambdaDataInput {
  scope: string;
  period: string;
  previousPeriod: string;
  value: number;
  uncertainty: number;
  delta: number;
  trend: 'stable' | 'declining' | 'improving';
  drivers: {
    indicator: string;
    direction: 'increase' | 'decrease';
    magnitude: string;
  }[];
  observableFrom: string;
  medianPosition: 'above' | 'below' | 'near';
  uncertaintyFactor: string;
  dataCoverage: 'high' | 'medium' | 'low';
}

interface LambdaAITextGeneratorProps {
  data: LambdaDataInput;
  language?: 'sv' | 'en';
  showValidation?: boolean;
  showProtocol?: boolean;
}

// =============================================================================
// TEXT GENERATION LOGIC
// =============================================================================

const generateSkeleton = (
  data: LambdaDataInput,
  language: 'sv' | 'en'
): LambdaTextSkeleton => {
  const t = TEMPLATES[language];
  const uncertaintyLevel = getUncertaintyLevel(data.uncertainty);

  // If unreliable, return minimal skeleton
  if (uncertaintyLevel === 'unreliable') {
    return {
      status: '',
      change: '',
      drivers: [],
      timeDimension: '',
      comparison: '',
      uncertainty: t.noReliableSummary,
      limitation: t.limitation,
    };
  }

  const trendLabels = {
    stable: language === 'sv' ? 'stabil' : 'stable',
    declining: language === 'sv' ? 'avtagande' : 'declining',
    improving: language === 'sv' ? 'förbättrad' : 'improving',
  };

  const positionLabels = {
    above: language === 'sv' ? 'ovanför' : 'above',
    below: language === 'sv' ? 'under' : 'below',
    near: language === 'sv' ? 'nära' : 'near',
  };

  const directionLabels = {
    increase: language === 'sv' ? 'ökning' : 'increase',
    decrease: language === 'sv' ? 'minskning' : 'decrease',
  };

  // Generate each section
  const status = t.status
    .replace('{scope}', data.scope)
    .replace('{period}', data.period)
    .replace('{value}', data.value.toFixed(2))
    .replace('{uncertainty}', data.uncertainty.toFixed(2))
    .replace('{trend}', trendLabels[data.trend]);

  const change = t.change
    .replace('{previousPeriod}', data.previousPeriod)
    .replace('{delta}', (data.delta > 0 ? '+' : '') + data.delta.toFixed(2));

  const drivers = data.drivers.map(d =>
    t.driverItem
      .replace('{indicator}', d.indicator)
      .replace('{direction}', directionLabels[d.direction])
      .replace('{magnitude}', d.magnitude)
  );

  const timeDimension = t.timeDimension
    .replace('{observableFrom}', data.observableFrom);

  const comparison = t.comparison
    .replace('{scope}', data.scope)
    .replace('{position}', positionLabels[data.medianPosition]);

  let uncertainty: string;
  if (uncertaintyLevel === 'high') {
    uncertainty = t.uncertaintyHigh.replace('{factor}', data.uncertaintyFactor);
  } else if (uncertaintyLevel === 'medium') {
    uncertainty = t.uncertaintyMedium.replace('{factor}', data.uncertaintyFactor);
  } else {
    uncertainty = t.uncertaintyLow;
  }

  if (uncertaintyLevel === 'high') {
    uncertainty += ' ' + t.cautionRequired;
  }

  return {
    status,
    change,
    drivers,
    timeDimension,
    comparison,
    uncertainty,
    limitation: t.limitation,
  };
};

const skeletonToText = (skeleton: LambdaTextSkeleton): string => {
  if (!skeleton.status && skeleton.uncertainty) {
    // Unreliable data case
    return skeleton.uncertainty + '\n\n' + skeleton.limitation;
  }

  const sections = [
    skeleton.status,
    '',
    skeleton.change,
    ...skeleton.drivers,
    '',
    skeleton.timeDimension,
    '',
    skeleton.comparison,
    '',
    skeleton.uncertainty,
    '',
    skeleton.limitation,
  ];

  return sections.join('\n');
};

// =============================================================================
// COMPONENT
// =============================================================================

export const LambdaAITextGenerator: React.FC<LambdaAITextGeneratorProps> = ({
  data,
  language = 'sv',
  showValidation = true,
  showProtocol = false,
}) => {
  const skeleton = generateSkeleton(data, language);
  const fullText = skeletonToText(skeleton);
  const validation = validateText(fullText);
  const prePublishChecks = runPrePublishChecks(fullText, skeleton);
  const publishable = canPublish(prePublishChecks);

  const uncertaintyLevel = getUncertaintyLevel(data.uncertainty);
  const isUnreliable = uncertaintyLevel === 'unreliable';

  return (
    <div className="space-y-4">
      {/* Protocol header */}
      {showProtocol && (
        <Card className="border-dashed">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <Lock className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">
                  {FUNDAMENTAL_RULE[language]}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {AI_TEXT_DOCTRINE[language]}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main generated text */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              {language === 'sv' ? 'AI-genererad sammanfattning' : 'AI-Generated Summary'}
            </CardTitle>
            <div className="flex items-center gap-2">
              {publishable ? (
                <Badge variant="default" className="gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  {language === 'sv' ? 'Validerad' : 'Validated'}
                </Badge>
              ) : (
                <Badge variant="destructive" className="gap-1">
                  <XCircle className="h-3 w-3" />
                  {language === 'sv' ? 'Blockerad' : 'Blocked'}
                </Badge>
              )}
            </div>
          </div>
          <CardDescription>
            {language === 'sv' 
              ? 'Följer strikt textskelett-protokoll'
              : 'Follows strict text skeleton protocol'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isUnreliable ? (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>
                {language === 'sv' ? 'Otillräcklig data' : 'Insufficient Data'}
              </AlertTitle>
              <AlertDescription>
                {TEMPLATES[language].noReliableSummary}
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              {/* Section 1: Status */}
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  1. {language === 'sv' ? 'Status' : 'Status'}
                </div>
                <p className="text-sm">{skeleton.status}</p>
              </div>

              <Separator />

              {/* Section 2: Change */}
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  2. {language === 'sv' ? 'Förändring' : 'Change'}
                </div>
                <p className="text-sm">{skeleton.change}</p>
              </div>

              {/* Section 3: Drivers */}
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  3. {language === 'sv' ? 'Drivkrafter' : 'Drivers'}
                </div>
                <ul className="space-y-1">
                  {skeleton.drivers.map((driver, i) => (
                    <li key={i} className="text-sm font-mono">{driver}</li>
                  ))}
                </ul>
              </div>

              <Separator />

              {/* Section 4: Time Dimension */}
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  4. {language === 'sv' ? 'Tidsdimension' : 'Time Dimension'}
                </div>
                <p className="text-sm">{skeleton.timeDimension}</p>
              </div>

              {/* Section 5: Comparison */}
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  5. {language === 'sv' ? 'Jämförelse' : 'Comparison'}
                </div>
                <p className="text-sm">{skeleton.comparison}</p>
              </div>

              <Separator />

              {/* Section 6: Uncertainty */}
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  6. {language === 'sv' ? 'Osäkerhet' : 'Uncertainty'}
                </div>
                <p className="text-sm">{skeleton.uncertainty}</p>
              </div>

              {/* Section 7: Limitation (ALWAYS) */}
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  7. {language === 'sv' ? 'Begränsning' : 'Limitation'}
                </div>
                <p className="text-sm font-medium">{skeleton.limitation}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Validation panel */}
      {showValidation && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Shield className="h-4 w-4" />
              {language === 'sv' ? 'Förpubliceringskontroll' : 'Pre-Publish Check'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              <CheckItem 
                label={language === 'sv' ? 'Datastöd' : 'Data Support'} 
                passed={prePublishChecks.hasDataSupport} 
              />
              <CheckItem 
                label={language === 'sv' ? 'Neutrala ord' : 'Neutral Words'} 
                passed={prePublishChecks.allWordsNeutral} 
              />
              <CheckItem 
                label={language === 'sv' ? 'Osäkerhet nämnd' : 'Uncertainty Mentioned'} 
                passed={prePublishChecks.uncertaintyMentioned} 
              />
              <CheckItem 
                label={language === 'sv' ? 'Ej tvetydig' : 'Not Ambiguous'} 
                passed={!prePublishChecks.canBeMisunderstood} 
              />
              <CheckItem 
                label={language === 'sv' ? 'Struktur följd' : 'Structure Followed'} 
                passed={prePublishChecks.structureFollowed} 
              />
            </div>

            {validation.violations.length > 0 && (
              <div className="mt-4">
                <div className="text-xs text-destructive font-medium mb-2">
                  {language === 'sv' ? 'Överträdelser:' : 'Violations:'}
                </div>
                <ul className="space-y-1">
                  {validation.violations.map((v, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-center gap-1">
                      <XCircle className="h-3 w-3 text-destructive" />
                      {v.details}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

const CheckItem: React.FC<{ label: string; passed: boolean }> = ({ label, passed }) => (
  <div className="flex items-center gap-1.5 text-xs">
    {passed ? (
      <CheckCircle2 className="h-3 w-3 text-primary" />
    ) : (
      <XCircle className="h-3 w-3 text-destructive" />
    )}
    <span className={passed ? 'text-foreground' : 'text-muted-foreground'}>{label}</span>
  </div>
);

// =============================================================================
// VALUE JUDGMENT RESPONSE COMPONENT
// =============================================================================

export const LambdaValueJudgmentResponse: React.FC<{ language?: 'sv' | 'en' }> = ({ 
  language = 'sv' 
}) => (
  <Alert>
    <FileText className="h-4 w-4" />
    <AlertDescription>
      {VALUE_JUDGMENT_RESPONSE[language]}
    </AlertDescription>
  </Alert>
);

export default LambdaAITextGenerator;
