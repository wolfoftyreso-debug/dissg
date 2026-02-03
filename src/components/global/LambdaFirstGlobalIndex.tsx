/**
 * LAMBDA FIRST GLOBAL INDEX
 * 
 * "The first measurement. Not the first announcement."
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Globe, 
  CheckCircle2, 
  Circle,
  Clock,
  Target,
  Eye,
  EyeOff,
  AlertTriangle,
  Rocket,
} from 'lucide-react';
import {
  PRE_LAUNCH_REQUIREMENTS,
  FIRST_MEASUREMENT_STEPS,
  FIRST_VALUE_EXPECTATIONS,
  POST_LAUNCH_COMMUNICATION,
  VERSION_ROADMAP,
  FIRST_INDEX_PHILOSOPHY,
  FIRST_INDEX_DOCTRINE,
} from '@/config/lambdaFirstGlobalIndex';

interface LambdaFirstGlobalIndexProps {
  completedRequirements?: string[];
  currentStep?: number;
  language?: 'sv' | 'en';
}

export const LambdaFirstGlobalIndex: React.FC<LambdaFirstGlobalIndexProps> = ({
  completedRequirements = [],
  currentStep = 0,
  language = 'sv',
}) => {
  const requirementProgress = (completedRequirements.length / PRE_LAUNCH_REQUIREMENTS.length) * 100;

  return (
    <div className="space-y-6">
      {/* Philosophy header */}
      <Card className="border-dashed">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <Globe className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">
                {FIRST_INDEX_PHILOSOPHY.principle[language]}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {FIRST_INDEX_PHILOSOPHY.anti_pattern[language]}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pre-launch requirements */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              {language === 'sv' ? 'Förlanseringskrav' : 'Pre-Launch Requirements'}
            </CardTitle>
            <Badge variant="outline">
              {completedRequirements.length} / {PRE_LAUNCH_REQUIREMENTS.length}
            </Badge>
          </div>
          <Progress value={requirementProgress} className="h-2" />
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-3">
            {PRE_LAUNCH_REQUIREMENTS.map((req, i) => {
              const isComplete = completedRequirements.includes(req.requirement.en);
              return (
                <div 
                  key={i}
                  className={`p-2 rounded-lg border ${
                    isComplete ? 'border-primary/50 bg-primary/5' : 'border-muted'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {isComplete ? (
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="text-xs">{req.requirement[language]}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {req.threshold}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {req.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Measurement steps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            {language === 'sv' ? 'Första mätningsprotokollet' : 'First Measurement Protocol'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {FIRST_MEASUREMENT_STEPS.map((step) => (
              <div 
                key={step.order}
                className={`flex items-center gap-3 p-2 rounded ${
                  step.order < currentStep ? 'bg-primary/10' :
                  step.order === currentStep ? 'bg-primary/20 border border-primary' :
                  'bg-muted/50'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  step.order < currentStep ? 'bg-primary text-primary-foreground' :
                  step.order === currentStep ? 'bg-primary text-primary-foreground animate-pulse' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {step.order}
                </div>
                <div className="flex-1">
                  <p className="text-sm">{step.action[language]}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {step.duration}
                    </Badge>
                    {step.publiclyVisible ? (
                      <Badge variant="secondary" className="text-xs gap-1">
                        <Eye className="h-3 w-3" />
                        {language === 'sv' ? 'Synlig' : 'Visible'}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs gap-1">
                        <EyeOff className="h-3 w-3" />
                        {language === 'sv' ? 'Intern' : 'Internal'}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Expected first value */}
      <Card className="border-primary/50">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Target className="h-4 w-4" />
            {language === 'sv' ? 'Förväntat första värde' : 'Expected First Value'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="text-center">
              <div className="text-3xl font-bold font-mono text-muted-foreground">
                {FIRST_VALUE_EXPECTATIONS.expected_range.min}
              </div>
              <div className="text-xs text-muted-foreground">min</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold font-mono text-primary">
                λ
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold font-mono text-muted-foreground">
                {FIRST_VALUE_EXPECTATIONS.expected_range.max}
              </div>
              <div className="text-xs text-muted-foreground">max</div>
            </div>
          </div>
          <p className="text-sm text-center text-muted-foreground">
            {FIRST_VALUE_EXPECTATIONS.expected_range.explanation[language]}
          </p>
          <div className="mt-4 p-2 bg-warning/10 rounded flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
            <p className="text-xs">
              {FIRST_VALUE_EXPECTATIONS.uncertainty_target.note[language]}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Post-launch communication */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-primary">
              {language === 'sv' ? 'Tillåten kommunikation' : 'Allowed Communication'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {POST_LAUNCH_COMMUNICATION.allowed.map((item, i) => (
                <li key={i} className="text-xs flex items-center gap-2">
                  <CheckCircle2 className="h-3 w-3 text-primary" />
                  {item[language]}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-destructive">
              {language === 'sv' ? 'Förbjuden kommunikation' : 'Forbidden Communication'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {POST_LAUNCH_COMMUNICATION.forbidden.map((item, i) => (
                <li key={i} className="text-xs flex items-center gap-2">
                  <Circle className="h-3 w-3 text-destructive" />
                  {item[language]}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Version roadmap */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Rocket className="h-4 w-4" />
            {language === 'sv' ? 'Versionsplan' : 'Version Roadmap'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-2">
            {VERSION_ROADMAP.map((version) => (
              <div key={version.version} className="p-2 bg-muted/50 rounded text-center">
                <div className="font-mono font-bold text-primary">{version.version}</div>
                <div className="text-xs text-muted-foreground">{version.scope}</div>
                <div className="text-xs mt-1">{version.coverage}</div>
                <Badge variant="outline" className="text-xs mt-1">
                  {version.timeline}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Doctrine */}
      <Card className="bg-muted/30">
        <CardContent className="pt-6 text-center">
          <p className="text-sm italic">
            "{FIRST_INDEX_DOCTRINE[language]}"
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LambdaFirstGlobalIndex;
