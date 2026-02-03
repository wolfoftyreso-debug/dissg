/**
 * LAMBDA PROTECTION SUMMARY
 * 
 * Displays the anti-manipulation guarantees to users.
 * Builds trust through transparency about what CAN and CANNOT be done.
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Shield, Check, X, AlertCircle } from 'lucide-react';
import {
  PROTECTION_SUMMARY,
  USER_RIGHTS,
  USER_CANNOT,
  ANTI_MANIPULATION_DOCTRINE,
} from '@/config/lambdaAntiManipulation';

interface LambdaProtectionSummaryProps {
  language?: 'sv' | 'en';
  compact?: boolean;
}

export const LambdaProtectionSummary: React.FC<LambdaProtectionSummaryProps> = ({
  language = 'sv',
  compact = false,
}) => {
  if (compact) {
    return (
      <div className="flex items-center gap-2 text-xs text-muted-foreground p-2 bg-muted rounded">
        <Shield className="h-3 w-3" />
        <span>{ANTI_MANIPULATION_DOCTRINE[language]}</span>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          {language === 'sv' ? 'Manipulationsskydd' : 'Manipulation Protection'}
        </CardTitle>
        <CardDescription>
          {language === 'sv'
            ? 'Inbyggda skydd mot missbruk av data'
            : 'Built-in protections against data abuse'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Core doctrine */}
        <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
          <p className="text-sm font-medium text-center">
            "{ANTI_MANIPULATION_DOCTRINE[language]}"
          </p>
        </div>

        {/* What Lambda prevents */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <X className="h-4 w-4 text-destructive" />
            {language === 'sv' ? 'Lambda kan inte:' : 'Lambda cannot be:'}
          </h4>
          <ul className="space-y-1 ml-6">
            {PROTECTION_SUMMARY[language].map((item, i) => (
              <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-destructive/50" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* User rights */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <Check className="h-4 w-4 text-primary" />
            {language === 'sv' ? 'Du kan:' : 'You may:'}
          </h4>
          <ul className="space-y-1 ml-6">
            {USER_RIGHTS[language].map((item, i) => (
              <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* The catch */}
        <div className="flex items-start gap-2 p-3 bg-muted rounded-lg">
          <AlertCircle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-sm font-medium">
            {USER_CANNOT[language]}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LambdaProtectionSummary;
