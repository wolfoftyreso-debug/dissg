/**
 * MISINTERPRETATION RISK
 * 
 * 🛡️ ANTI-PROPAGANDA MODULE
 * 
 * Fixed UI component on ALL pages.
 * This is the protection against misuse – in all directions.
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MisinterpretationRiskProps {
  language?: 'en' | 'sv';
  customWarnings?: string[];
}

// FIXED WARNINGS (IMMUTABLE)
const COMMON_MISREADINGS = {
  en: [
    'This does not show intent',
    'This does not isolate cause',
    'This does not assign responsibility',
    'This does not predict future outcomes',
    'This does not compare "right" vs "wrong"',
    'This does not recommend action',
  ],
  sv: [
    'Detta visar inte avsikt',
    'Detta isolerar inte orsak',
    'Detta tillskriver inte ansvar',
    'Detta förutspår inte framtida utfall',
    'Detta jämför inte "rätt" mot "fel"',
    'Detta rekommenderar inte handling',
  ],
};

const HEADER = {
  en: 'Common misreadings',
  sv: 'Vanliga feltolkningar',
};

const SUBTEXT = {
  en: 'Data shown here cannot support the following claims:',
  sv: 'Data som visas här kan inte stödja följande påståenden:',
};

export function MisinterpretationRisk({ 
  language = 'en',
  customWarnings = [],
}: MisinterpretationRiskProps) {
  const warnings = [...COMMON_MISREADINGS[language], ...customWarnings];

  return (
    <Card className="border-l-4 border-l-muted-foreground bg-muted/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          {HEADER[language]}
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          {SUBTEXT[language]}
        </p>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {warnings.map((warning, i) => (
            <li 
              key={i}
              className="flex items-start gap-3 text-sm font-mono"
            >
              <span className="w-5 h-5 flex-shrink-0 border border-muted-foreground flex items-center justify-center text-xs text-muted-foreground">
                ✗
              </span>
              <span className="text-foreground">{warning}</span>
            </li>
          ))}
        </ul>

        {/* Reinforcement text */}
        <div className="mt-6 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground font-mono">
            {language === 'sv'
              ? 'Om någon hävdar att dessa data "bevisar" något av ovanstående, tolkar de fel.'
              : 'If someone claims this data "proves" any of the above, they are misinterpreting.'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// Compact version for inline use
export function MisinterpretationRiskCompact({ 
  language = 'en' 
}: { 
  language?: 'en' | 'sv';
}) {
  return (
    <div className="bg-muted/30 border border-border p-3 text-xs font-mono">
      <span className="text-muted-foreground">
        {language === 'sv' ? 'Varning: ' : 'Warning: '}
      </span>
      <span className="text-foreground">
        {language === 'sv'
          ? 'Denna data visar inte orsak, avsikt eller ansvar.'
          : 'This data does not show cause, intent, or responsibility.'}
      </span>
    </div>
  );
}

export default MisinterpretationRisk;
