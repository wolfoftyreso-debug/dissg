/**
 * LAMBDA LAUNCH PROTOCOL VISUALIZATION
 * 
 * "Arrive without announcement. Become indispensable through accuracy."
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Rocket, 
  CheckCircle2, 
  Circle,
  Ban,
  Eye,
  Clock,
  Target,
} from 'lucide-react';
import {
  LAUNCH_PHASES,
  ANTI_BACKLASH,
  COMMUNICATION_RULES,
  LAUNCH_PHILOSOPHY,
  LAUNCH_DOCTRINE,
  type LaunchPhase,
} from '@/config/lambdaLaunchProtocol';

interface LambdaLaunchProtocolProps {
  currentPhase?: number;
  phaseProgress?: number;
  language?: 'sv' | 'en';
}

export const LambdaLaunchProtocol: React.FC<LambdaLaunchProtocolProps> = ({
  currentPhase = 1,
  phaseProgress = 0,
  language = 'sv',
}) => {
  return (
    <div className="space-y-6">
      {/* Philosophy header */}
      <Card className="border-dashed">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <Rocket className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">
                {LAUNCH_PHILOSOPHY.principle[language]}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {LAUNCH_PHILOSOPHY.anti_pattern[language]}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Launch phases */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            {language === 'sv' ? 'Lanseringsfaser' : 'Launch Phases'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {LAUNCH_PHASES.map((phase) => (
            <PhaseCard 
              key={phase.id} 
              phase={phase} 
              isActive={phase.phase === currentPhase}
              isComplete={phase.phase < currentPhase}
              progress={phase.phase === currentPhase ? phaseProgress : phase.phase < currentPhase ? 100 : 0}
              language={language}
            />
          ))}
        </CardContent>
      </Card>

      {/* Anti-backlash protocol */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Eye className="h-4 w-4" />
            {language === 'sv' ? 'Anti-backlash protokoll' : 'Anti-Backlash Protocol'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 mb-4">
            {ANTI_BACKLASH.principles.map((principle, i) => (
              <li key={i} className="text-sm flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                {principle[language]}
              </li>
            ))}
          </ul>
          <div className="p-3 bg-muted rounded-lg">
            <div className="text-xs text-muted-foreground mb-1">
              {language === 'sv' ? 'Vid attack:' : 'When attacked:'}
            </div>
            <p className="text-sm font-medium italic">
              "{ANTI_BACKLASH.response_to_attack[language]}"
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Communication rules */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-primary">
              {language === 'sv' ? 'Tillåtet' : 'Allowed'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {COMMUNICATION_RULES.allowed.map(item => (
                <li key={item} className="text-xs flex items-center gap-2">
                  <CheckCircle2 className="h-3 w-3 text-primary" />
                  {item.replace(/_/g, ' ')}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-destructive">
              {language === 'sv' ? 'Förbjudet' : 'Forbidden'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {COMMUNICATION_RULES.forbidden.map(item => (
                <li key={item} className="text-xs flex items-center gap-2">
                  <Ban className="h-3 w-3 text-destructive" />
                  {item.replace(/_/g, ' ')}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Doctrine */}
      <Card className="bg-muted/30">
        <CardContent className="pt-6 text-center">
          <p className="text-sm italic">
            "{LAUNCH_DOCTRINE[language]}"
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

const PhaseCard: React.FC<{
  phase: LaunchPhase;
  isActive: boolean;
  isComplete: boolean;
  progress: number;
  language: 'sv' | 'en';
}> = ({ phase, isActive, isComplete, progress, language }) => (
  <div className={`p-4 rounded-lg border ${
    isActive ? 'border-primary bg-primary/5' : 
    isComplete ? 'border-muted bg-muted/30' : 
    'border-muted'
  }`}>
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        {isComplete ? (
          <CheckCircle2 className="h-5 w-5 text-primary" />
        ) : isActive ? (
          <Clock className="h-5 w-5 text-primary animate-pulse" />
        ) : (
          <Circle className="h-5 w-5 text-muted-foreground" />
        )}
        <span className="font-medium">
          {language === 'sv' ? 'Fas' : 'Phase'} {phase.phase}: {phase.name[language]}
        </span>
      </div>
      <Badge variant="outline" className="text-xs">
        {phase.duration}
      </Badge>
    </div>

    <p className="text-sm text-muted-foreground mb-3">
      {phase.description[language]}
    </p>

    {isActive && (
      <Progress value={progress} className="h-1 mb-3" />
    )}

    <div className="grid md:grid-cols-3 gap-3 text-xs">
      <div>
        <div className="text-muted-foreground uppercase tracking-wide mb-1">
          {language === 'sv' ? 'Åtgärder' : 'Actions'}
        </div>
        <ul className="space-y-0.5">
          {phase.actions.slice(0, 2).map((action, i) => (
            <li key={i} className="flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-primary" />
              {action[language]}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <div className="text-muted-foreground uppercase tracking-wide mb-1">
          {language === 'sv' ? 'Framgångskriterier' : 'Success Criteria'}
        </div>
        <ul className="space-y-0.5">
          {phase.success_criteria.slice(0, 2).map((criterion, i) => (
            <li key={i} className="flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3 text-primary" />
              {criterion[language]}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <div className="text-muted-foreground uppercase tracking-wide mb-1">
          {language === 'sv' ? 'Förbjudet' : 'Forbidden'}
        </div>
        <ul className="space-y-0.5">
          {phase.forbidden.slice(0, 2).map((item, i) => (
            <li key={i} className="flex items-center gap-1">
              <Ban className="h-3 w-3 text-destructive" />
              {item[language]}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

export default LambdaLaunchProtocol;
