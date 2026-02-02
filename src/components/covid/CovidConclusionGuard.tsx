/**
 * COVID-19 REALITY LAYER - Conclusion Guard
 * Shows what can and cannot be concluded from the data
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, XCircle, HelpCircle } from 'lucide-react';
import { ALLOWED_CONCLUSIONS, BLOCKED_PHRASES } from '@/lib/covid/conclusion-classifier';

interface ValidationResult {
  isAllowed: boolean;
  blockedPhrases: string[];
  suggestion?: string;
}

export function CovidConclusionGuard() {
  const [statement, setStatement] = useState('');
  const [validation, setValidation] = useState<ValidationResult | null>(null);

  const handleValidate = () => {
    const lowerStatement = statement.toLowerCase();
    const found = BLOCKED_PHRASES.filter(phrase => 
      lowerStatement.includes(phrase.toLowerCase())
    );

    if (found.length > 0) {
      setValidation({
        isAllowed: false,
        blockedPhrases: found,
        suggestion: 'Rephrase using observational language: "was observed", "moved together", "differed under".',
      });
    } else {
      setValidation({
        isAllowed: true,
        blockedPhrases: [],
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro */}
      <Card className="border-warning/30 bg-warning/5">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Conclusion Classification</p>
              <p className="text-xs text-muted-foreground">
                This system only allows three types of conclusions from COVID data. 
                Causal claims and policy judgments are blocked.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Allowed Conclusions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            Allowed Conclusion Types
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(ALLOWED_CONCLUSIONS).map(([key, value]) => (
            <div key={key} className="p-3 bg-green-500/5 border border-green-500/20 rounded">
              <p className="text-sm font-medium mb-1 capitalize">{key.replace('_', ' ')}</p>
              <p className="text-xs font-mono bg-muted/50 p-2 rounded mb-2">
                {value.template}
              </p>
              <p className="text-xs text-muted-foreground">
                Example: "{value.example}"
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Blocked Phrases */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <XCircle className="w-4 h-4 text-destructive" />
            Blocked Phrases
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {BLOCKED_PHRASES.map((phrase, i) => (
              <Badge key={i} variant="destructive" className="font-mono text-xs">
                {phrase}
              </Badge>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Statements containing these phrases will be blocked or flagged for review.
          </p>
        </CardContent>
      </Card>

      {/* Statement Validator */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <HelpCircle className="w-4 h-4" />
            Test Your Statement
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Enter a statement to check..."
              value={statement}
              onChange={(e) => setStatement(e.target.value)}
            />
            <Button onClick={handleValidate} disabled={!statement.trim()}>
              Validate Statement
            </Button>
          </div>

          {validation && (
            <div className={`p-4 rounded ${validation.isAllowed ? 'bg-green-500/10' : 'bg-destructive/10'}`}>
              <div className="flex items-center gap-2 mb-2">
                {validation.isAllowed ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium text-green-600">Statement Allowed</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-destructive" />
                    <span className="text-sm font-medium text-destructive">Statement Blocked</span>
                  </>
                )}
              </div>
              
              {!validation.isAllowed && (
                <>
                  <p className="text-xs text-muted-foreground mb-2">
                    Found blocked phrases: {validation.blockedPhrases.join(', ')}
                  </p>
                  {validation.suggestion && (
                    <p className="text-xs text-muted-foreground">
                      💡 {validation.suggestion}
                    </p>
                  )}
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Debate Response */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">When someone says "Data visar att..."</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            System counter-question:
          </p>
          <div className="p-4 bg-primary/5 border border-primary/20 rounded text-sm font-medium">
            "Which dataset and definition are you referring to?"
          </div>
          <p className="text-xs text-muted-foreground">
            The system then provides:
          </p>
          <ul className="text-xs text-muted-foreground list-disc list-inside">
            <li>Direct link to raw data</li>
            <li>Methodology box</li>
            <li>Limitation box</li>
            <li>Comparison validity status</li>
          </ul>
        </CardContent>
      </Card>

      {/* Standard Disclaimer */}
      <Card>
        <CardContent className="pt-4">
          <p className="text-xs text-muted-foreground text-center">
            These observations are based on reported data with known limitations. 
            Correlation does not imply causation. 
            For methodological details, see the data sources.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
