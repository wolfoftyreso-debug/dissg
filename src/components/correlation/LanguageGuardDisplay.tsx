/**
 * LANGUAGE GUARD DISPLAY
 * Shows what language is allowed/blocked
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Shield, AlertTriangle } from 'lucide-react';
import { checkLanguage, blockCausalClaims, ALLOWED_TEMPLATES, MANDATORY_DISCLAIMERS } from '@/lib/correlation/language-guard';

export function LanguageGuardDisplay() {
  const [testInput, setTestInput] = useState('');
  const [checkResult, setCheckResult] = useState<ReturnType<typeof checkLanguage> | null>(null);

  const handleCheck = () => {
    const result = checkLanguage(testInput);
    setCheckResult(result);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Språkkontroll / Language Guard
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Explanation */}
        <div className="p-4 bg-warning/10 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
            <div>
              <p className="font-medium text-warning">
                Systemet har strikt språkkontroll
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Kausala och normativa formuleringar blockeras tekniskt.
                Endast observationer och statistik tillåts.
              </p>
            </div>
          </div>
        </div>

        {/* Test input */}
        <div className="space-y-3">
          <h4 className="font-medium">Testa en formulering:</h4>
          <div className="flex gap-2">
            <Input
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              placeholder="Skriv ett påstående för att testa..."
              className="flex-1"
            />
            <Button onClick={handleCheck}>Kontrollera</Button>
          </div>

          {checkResult && (
            <div className={`p-4 rounded-lg ${checkResult.isValid ? 'bg-primary/10' : 'bg-destructive/10'}`}>
              <div className="flex items-center gap-2">
                {checkResult.isValid ? (
                  <CheckCircle className="h-5 w-5 text-primary" />
                ) : (
                  <XCircle className="h-5 w-5 text-destructive" />
                )}
                <span className="font-medium">
                  {checkResult.isValid ? 'Tillåtet' : 'Blockerat'}
                </span>
              </div>
              
              {checkResult.violations.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-destructive">Violations:</p>
                  <ul className="mt-1 text-sm">
                    {checkResult.violations.map((v, i) => (
                      <li key={i}>{v}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {!checkResult.isValid && (
                <div className="mt-3">
                  <p className="text-sm font-medium">Sanitized version:</p>
                  <p className="text-sm text-muted-foreground mt-1 font-mono">
                    {checkResult.sanitized}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Example forbidden phrases */}
        <div className="space-y-3">
          <h4 className="font-medium">Blockerade mönster:</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium mb-2">Svenska:</p>
              <div className="space-y-1">
                {['orsakades av', 'ledde till', 'berodde på', 'gynnades av', 'tjänade på'].map(phrase => (
                  <div key={phrase} className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-destructive" />
                    <code className="text-sm bg-muted px-2 py-0.5 rounded">{phrase}</code>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">English:</p>
              <div className="space-y-1">
                {['caused by', 'led to', 'due to', 'benefited from', 'profited from'].map(phrase => (
                  <div key={phrase} className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-destructive" />
                    <code className="text-sm bg-muted px-2 py-0.5 rounded">{phrase}</code>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Allowed templates */}
        <div className="space-y-3">
          <h4 className="font-medium">Tillåtna formuleringar:</h4>
          <div className="grid gap-2">
            {[
              { label: 'Observation', example: ALLOWED_TEMPLATES.observed('X increased', '2020-2021') },
              { label: 'Correlation present', example: ALLOWED_TEMPLATES.correlationPresent('A', 'B', 0.72, '2020-2022') },
              { label: 'Correlation absent', example: ALLOWED_TEMPLATES.correlationAbsent('A', 'B', '2020-2022') },
              { label: 'Varies by', example: ALLOWED_TEMPLATES.variesBy('Outcome', 'country') },
              { label: 'Also moved', example: ALLOWED_TEMPLATES.alsoMoved(['GDP', 'Unemployment', 'Interest rates']) },
            ].map(item => (
              <div key={item.label} className="flex items-start gap-2 p-2 bg-muted/50 rounded">
                <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                <div>
                  <span className="text-sm font-medium">{item.label}:</span>
                  <p className="text-sm text-muted-foreground">{item.example}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mandatory disclaimers */}
        <div className="space-y-3">
          <h4 className="font-medium">Obligatoriska varningar (alltid synliga):</h4>
          <div className="space-y-2">
            {Object.entries(MANDATORY_DISCLAIMERS).map(([key, value]) => (
              <div key={key} className="p-3 bg-warning/5 border border-warning/20 rounded-lg">
                <Badge variant="outline" className="mb-2 text-xs">{key}</Badge>
                <p className="text-sm">{value.en}</p>
                <p className="text-sm text-muted-foreground">{value.sv}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
