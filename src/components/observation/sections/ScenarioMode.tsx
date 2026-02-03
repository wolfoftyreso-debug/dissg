/**
 * ADVANCED MODE: SCENARIO MODE
 * 
 * 🔬 PAID FEATURE, USER RESPONSIBILITY
 * 
 * Users can:
 * - Build scenarios
 * - Test assumptions
 * - Create probability intervals
 * 
 * Always with banner: "User-generated scenario. Results depend entirely on selected assumptions."
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface ScenarioData {
  availableAssumptions: Array<{
    code: string;
    name: string;
    defaultValue: number;
    min: number;
    max: number;
    unit: string;
  }>;
  scenarios: Array<{
    id: string;
    name: string;
    assumptions: Record<string, number>;
    createdAt: string;
    createdBy: string;
  }>;
}

interface ScenarioModeProps {
  data: ScenarioData;
  language: 'en' | 'sv';
  userTier: 'analyst' | 'institutional';
}

const DISCLAIMER = {
  en: 'User-generated scenario. Results depend entirely on selected assumptions.',
  sv: 'Användargenererat scenario. Resultat beror helt på valda antaganden.',
};

const RESPONSIBILITY_TEXT = {
  en: 'The platform does not validate or endorse any scenario. All responsibility for interpretation lies with the user.',
  sv: 'Plattformen validerar eller godkänner inga scenarier. Allt ansvar för tolkning ligger hos användaren.',
};

export function ScenarioMode({ data, language, userTier }: ScenarioModeProps) {
  const isFullAccess = userTier === 'institutional';

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div>
        <h2 className="text-sm font-medium uppercase tracking-wider text-foreground">
          {language === 'sv' ? 'Scenarioläge' : 'Scenario Mode'}
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          {language === 'sv' ? 'Avancerat' : 'Advanced'} · {userTier}
        </p>
      </div>

      {/* MANDATORY DISCLAIMER BANNER */}
      <div className="bg-muted border-l-4 border-l-muted-foreground p-4">
        <p className="text-sm font-mono text-foreground font-medium">
          {DISCLAIMER[language]}
        </p>
        <p className="text-xs font-mono text-muted-foreground mt-2">
          {RESPONSIBILITY_TEXT[language]}
        </p>
      </div>

      {/* Scenario Builder */}
      <Card className="border-border bg-background">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            {language === 'sv' ? 'Tillgängliga antaganden' : 'Available Assumptions'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.availableAssumptions.map(assumption => (
            <div key={assumption.code} className="flex items-center justify-between">
              <div>
                <span className="text-sm text-foreground">{assumption.name}</span>
                <span className="text-xs text-muted-foreground ml-2 font-mono">
                  ({assumption.code})
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-muted-foreground">
                  {assumption.min}–{assumption.max} {assumption.unit}
                </span>
                <span className="text-foreground">
                  {language === 'sv' ? 'Standard' : 'Default'}: {assumption.defaultValue}
                </span>
              </div>
            </div>
          ))}

          {!isFullAccess && (
            <div className="text-xs text-muted-foreground pt-4 border-t border-border">
              {language === 'sv'
                ? 'Begränsat antal scenariokörningar. Uppgradera till Institutional för full åtkomst.'
                : 'Limited scenario runs. Upgrade to Institutional for full access.'}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Existing Scenarios */}
      {data.scenarios.length > 0 && (
        <Card className="border-border bg-background">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              {language === 'sv' ? 'Sparade scenarier' : 'Saved Scenarios'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-muted-foreground font-medium">
                    {language === 'sv' ? 'Namn' : 'Name'}
                  </th>
                  <th className="text-right py-2 text-muted-foreground font-medium">
                    {language === 'sv' ? 'Skapad' : 'Created'}
                  </th>
                  <th className="text-right py-2 text-muted-foreground font-medium">
                    {language === 'sv' ? 'Av' : 'By'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.scenarios.map(scenario => (
                  <tr key={scenario.id} className="border-b border-border/50">
                    <td className="py-2 text-foreground">{scenario.name}</td>
                    <td className="py-2 text-right text-muted-foreground">
                      {new Date(scenario.createdAt).toLocaleDateString(
                        language === 'sv' ? 'sv-SE' : 'en-GB'
                      )}
                    </td>
                    <td className="py-2 text-right text-muted-foreground">
                      {scenario.createdBy}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* Repeat disclaimer at bottom */}
      <div className="text-[10px] text-muted-foreground/70 font-mono text-center">
        {DISCLAIMER[language]}
      </div>
    </div>
  );
}

export default ScenarioMode;
